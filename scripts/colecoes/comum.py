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


INFRA = Path(os.environ.get(
    "ESSENCIAL_INFRA",
    "A:/Pilar-2b/00_Fontes_Primarias-20260802T093400Z-1-001/shapefiles_infraestrutura_mapbiomas",
))
# Tons minerais para dados categóricos (docs/ESTILO.md).
MINERAIS = {
    "verde_mata": "#2f5d3a", "oliva": "#7d8a3c", "palha": "#d9c27a", "ocre": "#c08a2e",
    "argila": "#9c4a32", "ameixa": "#6b3d5c", "grafite": "#4a4e52", "azul_profundo": "#234e70",
}


def infra(nome: str) -> gpd.GeoDataFrame:
    """Uma camada da base de infraestrutura do MapBiomas (ZIP original, texto em Latin-1), em SIRGAS 2000."""
    import pyogrio

    arq = f"zip://{INFRA / f'{nome}.zip'}"
    camada = [c for c in pyogrio.list_layers(arq)[:, 0] if not c.startswith("._")][0]
    g = gpd.read_file(arq, layer=camada, engine="pyogrio", encoding="latin1")
    return g.to_crs(GEO) if g.crs and g.crs.to_epsg() != 4674 else g.set_crs(GEO, allow_override=True)


def _num_br(v) -> float | None:
    """'5,500.00' → 5500.0 (as planilhas do SIGA usam vírgula de milhar); '-' → None."""
    s = str(v).strip()
    if s in ("", "-", "nan", "None"):
        return None
    return float(s.replace(",", ""))


def siga(nome: str) -> gpd.GeoDataFrame:
    """Usinas do SIGA/ANEEL na versão da base de infraestrutura do MapBiomas, com nomes de campo limpos."""
    g = infra(nome)
    c = list(g.columns)
    pega = lambda prefixo: next(x for x in c if x.startswith(prefixo))  # noqa: E731
    df = gpd.GeoDataFrame({
        "nome": g[pega("Empreendim")].str.strip(),
        "ceg": g[pega("CEG")],
        "uf": g[pega("UF")],
        "fonte": g[pega("Fonte")],
        "fase": g[pega("Fase")],
        "origem": g[pega("Origem")],
        "tipo": g[pega("Tipo")],
        "combustivel": g[pega("Combust")],
        "inicio_operacao": pd.to_datetime(g[pega("Inicio ope")], dayfirst=True, errors="coerce"),
        "potencia_kw": g[pega("Potência O")].map(_num_br),
        "potencia_fiscalizada_kw": g[pega("Potência F")].map(_num_br),
        "municipio_siga": g[pega("Munic")],
        "proprietario": g[pega("Propriet")],
    }, geometry=g.geometry.values, crs=g.crs)
    return df


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


def _tamanho_por_expressao(expr: str) -> str:
    """Tamanho definido por expressão (círculos proporcionais), nos dois formatos do QGIS."""
    return (
        '<data_defined_properties><Option type="Map"><Option name="name" value="" type="QString"/>'
        '<Option name="properties" type="Map"><Option name="size" type="Map">'
        '<Option name="active" value="true" type="bool"/>'
        f'<Option name="expression" value={quoteattr(expr)} type="QString"/>'
        '<Option name="type" value="3" type="int"/></Option></Option>'
        '<Option name="type" value="collection" type="QString"/></Option></data_defined_properties>'
    )


def marcador(cor: str, tamanho: float, *, borda: str = PAPEL, largura_borda: float = 0.25, forma: str = "circle",
             vazado: bool = False, alfa: float = 0.9, tamanho_expr: str | None = None) -> str:
    """Camada SimpleMarker (mm). `tamanho_expr`: expressão do QGIS para o diâmetro (círculos proporcionais)."""
    d = {
        "name": forma, "color": "0,0,0,0" if vazado else rgba(cor, alfa),
        "outline_color": rgba(cor if vazado else borda), "outline_width": 0.5 if vazado else largura_borda,
        "outline_width_unit": "MM", "outline_style": "solid", "size": tamanho, "size_unit": "MM",
        "joinstyle": "round", "angle": 0, "vertical_anchor_point": 1, "horizontal_anchor_point": 1,
        "scale_method": "diameter",
    }
    dd = _tamanho_por_expressao(tamanho_expr) if tamanho_expr else ""
    return f'<layer class="SimpleMarker" enabled="1" locked="0" pass="0">{props(d)}{dd}</layer>'


def linha(cor: str, largura: float, tracejado: str | None = None) -> str:
    d = {"line_color": rgba(cor), "line_width": largura, "line_width_unit": "MM", "line_style": "solid",
         "capstyle": "round", "joinstyle": "round", "use_custom_dash": 0}
    if tracejado:
        d.update({"use_custom_dash": 1, "customdash": tracejado, "customdash_unit": "MM", "capstyle": "flat"})
    return f'<layer class="SimpleLine" enabled="1" locked="0" pass="0">{props(d)}</layer>'


def estilo_regras(geometria: str, itens: list[tuple[str, str, str]], *, rotulo_campo: str | None = None,
                  rotulo_tamanho: float = 7, ordem: str | None = None) -> str:
    """Renderizador por regras: itens = [(filtro QGIS já escapado para XML, rótulo, camadas de símbolo)].

    `ordem`: expressão de ordenação (ex.: '"potencia_kw" DESC', para os círculos grandes ficarem por baixo).
    """
    tipo = {"ponto": "marker", "linha": "line", "poligono": "fill"}[geometria]
    regras = "".join(f'<rule key="r{i}" filter="{f}" label={quoteattr(r)} symbol="{i}"/>' for i, (f, r, _) in enumerate(itens))
    simbolos = "".join(simbolo(tipo, str(i), s) for i, (_, _, s) in enumerate(itens))
    ob = ""
    if ordem:
        campo, _, sentido = ordem.partition(" ")
        ob = (f'<orderby><orderByClause asc="{0 if sentido.upper() == "DESC" else 1}" nullsFirst="0">'
              f'{campo.replace(chr(34), "&quot;")}</orderByClause></orderby>')
    renderer = (
        f'<renderer-v2 type="RuleRenderer" symbollevels="0" forceraster="0" enableorderby="{int(bool(ordem))}">'
        f'<rules key="root">{regras}</rules><symbols>{simbolos}</symbols>{ob}</renderer-v2>'
    )
    rot = rotulo(rotulo_campo, tamanho=rotulo_tamanho, cor="#33373a", prioridade=4) if rotulo_campo else ""
    return qml(renderer, geometria, rot)


def igual(campo: str, valor) -> str:
    """Filtro `"campo" = 'valor'` escapado para XML."""
    v = f"'{valor}'" if isinstance(valor, str) else repr(valor)
    return f"&quot;{campo}&quot; = {v}"


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


# Albers equivalente do IBGE para o Brasil: áreas em km² sem a distorção da policônica.
AREA_BR = "+proj=aea +lat_0=-12 +lon_0=-54 +lat_1=-2 +lat_2=-22 +x_0=5000000 +y_0=10000000 +ellps=GRS80 +units=m +no_defs"


def km2(g: gpd.GeoSeries | gpd.GeoDataFrame) -> pd.Series:
    return g.to_crs(AREA_BR).area / 1e6


def km_geodesico(g: gpd.GeoSeries) -> float:
    """Comprimento de linhas em km, no elipsoide (GRS80)."""
    from pyproj import Geod

    geod = Geod(ellps="GRS80")
    return float(sum(geod.geometry_length(x) for x in g.to_crs(GEO).geometry) / 1000)


def _horario(geom):
    """d3-geo espera o anel externo no sentido horário (o contrário da RFC 7946)."""
    import shapely
    from shapely.geometry.polygon import orient

    if geom is None or geom.is_empty:
        return geom
    if geom.geom_type == "Polygon":
        return orient(geom, sign=-1.0)
    if geom.geom_type == "MultiPolygon":
        return shapely.MultiPolygon([orient(p, sign=-1.0) for p in geom.geoms])
    if geom.geom_type == "GeometryCollection":  # make_valid pode devolver polígonos misturados com linhas
        polis = [p for g in geom.geoms for p in (g.geoms if g.geom_type == "MultiPolygon" else [g]) if p.geom_type == "Polygon"]
        if polis:
            return shapely.MultiPolygon([orient(p, sign=-1.0) for p in polis])
        linhas = [g for g in geom.geoms if g.geom_type in ("LineString", "MultiLineString")]
        return shapely.union_all(linhas) if linhas else None
    return geom


def _arredonda_coords(o, casas):
    if isinstance(o, float):
        return round(o, casas)
    if isinstance(o, (list, tuple)):
        return [_arredonda_coords(v, casas) for v in o]
    return o


def para_d3(gdf: gpd.GeoDataFrame, campos: list[str], tol: float | None = None, casas: int = 4,
            cobertura: bool = True) -> dict:
    """FeatureCollection para a prancha (só desenho): simplificada em graus, anéis no sentido do d3.

    `cobertura=False` para polígonos que se sobrepõem (unidades de conservação): simplifica um a um.
    """
    import shapely
    from shapely.geometry import mapping

    g = gdf.to_crs(GEO)
    geoms = g.geometry.values
    if tol:
        poli = g.geom_type.isin(["Polygon", "MultiPolygon"]).all()
        geoms = (shapely.coverage_simplify(shapely.make_valid(geoms), tol) if poli and cobertura and len(g) > 1
                 else shapely.make_valid(shapely.simplify(geoms, tol, preserve_topology=True)))
    feats = []
    for (_, linha_), geom in zip(g.iterrows(), geoms):
        if geom is None or geom.is_empty:
            continue
        p = {c: (None if not isinstance(linha_[c], str) and pd.isna(linha_[c]) else
                 (linha_[c].item() if hasattr(linha_[c], "item") else linha_[c])) for c in campos}
        m = mapping(_horario(geom))
        feats.append({"type": "Feature", "properties": p,
                      "geometry": {"type": m["type"], "coordinates": _arredonda_coords(m["coordinates"], casas)}})
    return {"type": "FeatureCollection", "features": feats}


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
    "RAIZ", "DADOS", "GEO", "PLASMA", "VIRIDIS", "ZERO", "SEM_INFO", "TINTA", "PAPEL", "MINERAIS", "infra", "siga",
    "malha_uf", "sidra", "valor_sidra", "quebras", "classe", "nf", "rotulos_classes",
    "estilo_graduado", "estilo_contorno", "estilo_regras", "marcador", "linha", "igual", "preenchimento",
    "gravar_estilos", "zipar", "gravar_cache", "AREA_BR", "km2", "km_geodesico", "para_d3",
]
