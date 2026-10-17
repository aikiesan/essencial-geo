"""
Coleções temáticas — peças comuns do preparo de dados (uso interno; as fichas não citam scripts).

    from comum import malha_uf, sidra, quebras, estilo_graduado, gravar_estilos, zipar

Nada aqui estima valor: lê tabelas oficiais, junta pelo código IBGE de 7 dígitos e grava.
"""

from __future__ import annotations

import json
import math
import os
import sqlite3
import sys
import zipfile
from pathlib import Path
from xml.sax.saxutils import quoteattr

import geopandas as gpd
import pandas as pd

RAIZ = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RAIZ / "scripts" / "estados"))
from estilos import PAPEL, TINTA, SERIF, preenchimento, props, qml, rgba, rotulo, simbolo, unico  # noqa: E402

DADOS = Path(os.environ.get("ESSENCIAL_DADOS", "A:/Pilar-2b-cp2b/cp2b-workspace/NewLook/backend/data"))
MALHA = Path(os.environ.get("ESSENCIAL_MALHA", DADOS / "shapefiles" / "BR_Municipios_2025.shp"))
CACHE = RAIZ / "scripts" / "colecoes" / "cache"
GEO = "EPSG:4674"

# Paletas sequenciais da prancha (docs/ESTILO.md): perceptualmente uniformes, o escuro carrega o valor alto.
PLASMA = ["#f0f921", "#fca636", "#e16462", "#b12a90", "#6a00a8", "#0d0887"]
VIRIDIS = ["#fde725", "#7ad151", "#22a884", "#2a788e", "#414487", "#440154"]
ZERO = "#eef0f1"        # zero absoluto na tabela (símbolo "-")
SEM_INFO = "#ffffff"    # sem informação ("..." ou município fora da tabela), com hachura na prancha


def malha_uf(uf: str) -> gpd.GeoDataFrame:
    """Municípios da UF na geometria original do IBGE (Malha Municipal 2025)."""
    m = gpd.read_file(MALHA, engine="pyogrio").set_crs(GEO, allow_override=True)
    m = m[(m["SIGLA_UF"] == uf) & m["CD_MUN"].str.match(r"^\d{7}$") & m["CD_RGINT"].notna()]
    m = m[["CD_MUN", "NM_MUN", "CD_RGI", "NM_RGI", "CD_RGINT", "NM_RGINT", "AREA_KM2", "geometry"]]
    return m.rename(columns={"AREA_KM2": "area_km2"}).reset_index(drop=True)


def sidra(caminho: Path, aba: int | str = 0) -> tuple[pd.DataFrame, str]:
    """Tabela do SIDRA exportada em XLSX (linhas = municípios; colunas = (ano, produto)).

    Mantém os símbolos do IBGE como texto: "-" zero absoluto, "..." não disponível, "X" inibido.
    Devolve também o nome da variável (2ª linha da planilha).
    """
    bruto = pd.read_excel(caminho, sheet_name=aba, header=None, engine="openpyxl")
    anos = bruto.iloc[3].ffill()
    produtos = bruto.iloc[4]
    corpo = bruto.iloc[5:]
    corpo = corpo[corpo[0] == "MU"]
    tabela = corpo.iloc[:, 3:]
    tabela.columns = pd.MultiIndex.from_tuples([(int(a), str(p)) for a, p in zip(anos[3:], produtos[3:])])
    tabela.index = corpo[1].astype(str)
    return tabela, str(bruto.iloc[1, 0]).replace("Variável - ", "")


def valor_sidra(v) -> tuple[float | None, str]:
    """(número, situação): situação é 'valor', 'zero', 'nao_disponivel' ou 'inibido'."""
    if isinstance(v, str):
        v = v.strip()
        if v == "-":
            return 0.0, "zero"
        if v == "X":
            return None, "inibido"
        return None, "nao_disponivel"
    if v is None or (isinstance(v, float) and math.isnan(v)):
        return None, "nao_disponivel"
    return float(v), "valor"


def _arredonda(v: float) -> float:
    """Dois algarismos significativos: limites de classe legíveis."""
    if v <= 0:
        return 0.0
    return float(f"{v:.2g}")


def quebras(valores: pd.Series, n: int = 6) -> list[float]:
    """Limites superiores de n classes por quantis dos valores positivos, arredondados (o último é o máximo)."""
    pos = valores[valores > 0].dropna().sort_values()
    lim = []
    for i in range(1, n):
        q = _arredonda(float(pos.quantile(i / n)))
        if not lim or q > lim[-1]:
            lim.append(q)
    lim.append(float(pos.max()))
    return lim


def classe(v: float | None, lim: list[float]) -> int | None:
    """Índice da classe (0 = zero; 1..n = classes); None = sem informação."""
    if v is None or (isinstance(v, float) and math.isnan(v)):
        return None
    if v == 0:
        return 0
    for i, l in enumerate(lim):
        if v <= l:
            return i + 1
    return len(lim)


def nf(v: float, casas: int = 0, lingua: str = "pt") -> str:
    s = f"{v:,.{casas}f}"
    return s if lingua == "en" else s.replace(",", "§").replace(".", ",").replace("§", ".")


def rotulos_classes(lim: list[float], casas: int = 0, lingua: str = "pt") -> list[str]:
    ini = [0.0] + lim[:-1]
    return [f"{nf(a, casas, lingua)} – {nf(b, casas, lingua)}" for a, b in zip(ini, lim)]


# ---------------------------------------------------------------- estilos do QGIS
def estilo_graduado(campo: str, lim: list[float], cores: list[str], *, casas: int = 0, rotulo_campo: str | None = None,
                    borda: str = PAPEL) -> str:
    """Coroplético graduado: classe 'zero' em cinza-claro, n classes coloridas e 'sem informação' em branco (regra ELSE)."""
    # Regras em vez de graduatedSymbol: assim "zero" e "sem informação" ficam explícitos na legenda do QGIS.
    regras, simbolos = [], []
    q = f'&quot;{campo}&quot;'
    itens = [(f"{q} = 0", "zero" if lim else "zero", ZERO)]
    ini = [0.0] + lim[:-1]
    for (a, b), cor, r in zip(zip(ini, lim), cores, rotulos_classes(lim, casas)):
        itens.append((f"{q} &gt; {a!r} AND {q} &lt;= {b!r}", r, cor))
    itens.append((f"{q} IS NULL", "sem informação", SEM_INFO))
    for i, (filtro, rot, cor) in enumerate(itens):
        regras.append(f'<rule key="r{i}" filter="{filtro}" label={quoteattr(rot)} symbol="{i}"/>')
        simbolos.append(simbolo("fill", str(i), preenchimento(cor, borda, 0.1)))
    renderer = (
        '<renderer-v2 type="RuleRenderer" symbollevels="0" forceraster="0" enableorderby="0">'
        f'<rules key="root">{"".join(regras)}</rules><symbols>{"".join(simbolos)}</symbols></renderer-v2>'
    )
    rot = rotulo(rotulo_campo, tamanho=7, cor="#33373a", escala_max=1_500_000, prioridade=3) if rotulo_campo else ""
    return qml(renderer, "poligono", rot)


def estilo_contorno(cor: str, largura: float, rotulo_campo: str | None = None, alfa: float = 1.0) -> str:
    rot = rotulo(rotulo_campo, tamanho=10, cor=cor, fonte=SERIF, italico=True, buffer=1, prioridade=8) if rotulo_campo else ""
    return qml(unico(simbolo("fill", "0", preenchimento(None, cor, largura, alfa))), "poligono", rot)


def gravar_estilos(gpkg: Path, estilos: dict[str, list[tuple[str, str, str, bool]]]) -> None:
    """estilos = {camada: [(nome_do_estilo, descrição, QML, padrão?)]}. Mesmo esquema que o QGIS cria."""
    con = sqlite3.connect(gpkg)
    try:
        cur = con.cursor()
        existentes = {r[0]: r[1] for r in cur.execute("SELECT table_name, data_type FROM gpkg_contents")}
        geom = dict(cur.execute("SELECT table_name, column_name FROM gpkg_geometry_columns"))
        faltando = [c for c, t in existentes.items() if t == "features" and c not in estilos]
        assert not faltando, f"camadas sem estilo: {faltando}"
        cur.execute("DROP TABLE IF EXISTS layer_styles")
        cur.execute("DELETE FROM gpkg_contents WHERE table_name = 'layer_styles'")
        cur.execute(
            "CREATE TABLE layer_styles (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, f_table_catalog TEXT(256), "
            "f_table_schema TEXT(256), f_table_name TEXT(256), f_geometry_column TEXT(256), styleName TEXT(30), "
            "styleQML TEXT, styleSLD TEXT, useAsDefault BOOLEAN, description TEXT, owner TEXT(30), ui TEXT(30), "
            "update_time DATETIME DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')))"
        )
        cur.execute(
            "INSERT INTO gpkg_contents (table_name, data_type, identifier, description, last_change) "
            "VALUES ('layer_styles', 'attributes', 'layer_styles', '', strftime('%Y-%m-%dT%H:%M:%fZ','now'))"
        )
        n = 0
        for camada, lista in estilos.items():
            for nome, descricao, estilo, padrao in lista:
                cur.execute(
                    "INSERT INTO layer_styles (f_table_catalog, f_table_schema, f_table_name, f_geometry_column, styleName, "
                    "styleQML, styleSLD, useAsDefault, description, owner, ui) VALUES ('', '', ?, ?, ?, ?, '', ?, ?, '', '')",
                    (camada, geom[camada], nome, estilo, int(padrao), descricao),
                )
                n += 1
        if "gpkg_ogr_contents" in {r[0] for r in cur.execute("SELECT name FROM sqlite_master WHERE type='table'")}:
            cur.execute("DELETE FROM gpkg_ogr_contents WHERE table_name = 'layer_styles'")
            cur.execute("INSERT INTO gpkg_ogr_contents (table_name, feature_count) VALUES ('layer_styles', ?)", (n,))
        con.commit()
        con.execute("VACUUM")
    finally:
        con.close()


def zipar(arq: Path) -> Path:
    """Compacta e apaga o original (o ZIP vai para a release da coleção)."""
    z = Path(f"{arq}.zip")
    z.unlink(missing_ok=True)
    with zipfile.ZipFile(z, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as f:
        f.write(arq, arq.name)
    arq.unlink()
    return z


def _sem_nan(o):
    """NaN não existe em JSON: vira null (= sem informação)."""
    if isinstance(o, float) and math.isnan(o):
        return None
    if isinstance(o, dict):
        return {k: _sem_nan(v) for k, v in o.items()}
    if isinstance(o, (list, tuple)):
        return [_sem_nan(v) for v in o]
    return o


def gravar_cache(nome: str, obj: dict) -> None:
    CACHE.mkdir(parents=True, exist_ok=True)
    texto = json.dumps(_sem_nan(obj), ensure_ascii=False, indent=1, allow_nan=False)
    (CACHE / f"{nome}.json").write_text(texto, encoding="utf-8")


__all__ = [
    "RAIZ", "DADOS", "GEO", "PLASMA", "VIRIDIS", "ZERO", "SEM_INFO", "TINTA", "PAPEL",
    "malha_uf", "sidra", "valor_sidra", "quebras", "classe", "nf", "rotulos_classes",
    "estilo_graduado", "estilo_contorno", "gravar_estilos", "zipar", "gravar_cache",
]
