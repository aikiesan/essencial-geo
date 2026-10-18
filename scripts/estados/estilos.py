"""
Série «Brasil, estado por estado» — grava no GeoPackage os estilos do QGIS, com as cores da prancha.

    .venv-geo/Scripts/python scripts/estados/estilos.py SP --pasta 001-estado-sao-paulo

Roda depois de preparar.py e prancha.mjs: as cores das regiões intermediárias vêm de
scripts/estados/cache/<uf>_prancha.json. Os estilos vão para a tabela `layer_styles`, como o
próprio QGIS faz em "Salvar estilo → no banco de dados", com useAsDefault = 1: quem abre o
GPKG no QGIS vê cada camada já desenhada como na prancha. Nada muda nas feições.
"""

from __future__ import annotations

import argparse
import json
import sqlite3
import tempfile
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape, quoteattr

RAIZ = Path(__file__).resolve().parents[2]

# Mesmas cores da prancha (scripts/estados/prancha.mjs).
TINTA = "#1a1c1e"
PAPEL = "#ffffff"
OCEANO = "#d9e5ec"
BORDA_AGUA = "#8fa6b5"
ROTULO_AGUA = "#6f8796"
ROD_FED = "#9c4a32"
ROD_EST = "#4a4540"
LIM_RGI = "#5f6458"
LIM_RGINT = "#1a211a"
CINZA = "#7a8189"
SERIF = "Georgia"
SANS = "Arial"

# Só na legenda: o dado segue com a grafia do IBGE.
GRAFIA = {"Juíz de Fora": "Juiz de Fora"}

GEOM = {"ponto": 0, "linha": 1, "poligono": 2}


def rgba(hexa: str, alfa: float = 1.0) -> str:
    h = hexa.lstrip("#")
    return f"{int(h[0:2], 16)},{int(h[2:4], 16)},{int(h[4:6], 16)},{round(alfa * 255)}"


def props(d: dict) -> str:
    """Propriedades de uma camada de símbolo nos dois formatos: <Option> (QGIS ≥ 3.26) e <prop> (anteriores)."""
    opcoes = "".join(f'<Option name={quoteattr(k)} value={quoteattr(str(v))} type="QString"/>' for k, v in d.items())
    antigas = "".join(f"<prop k={quoteattr(k)} v={quoteattr(str(v))}/>" for k, v in d.items())
    return f'<Option type="Map">{opcoes}</Option>{antigas}'


def preenchimento(cor: str | None, borda: str, largura: float, alfa_borda: float = 1.0) -> str:
    return (
        '<layer class="SimpleFill" enabled="1" locked="0" pass="0">'
        + props({
            "color": rgba(cor) if cor else "0,0,0,0",
            "style": "solid" if cor else "no",
            "outline_color": rgba(borda, alfa_borda),
            "outline_style": "solid",
            "outline_width": largura,
            "outline_width_unit": "MM",
            "joinstyle": "round",
        })
        + "</layer>"
    )


def traco(cor: str, largura: float, passe: int = 0, tracejado: str | None = None) -> str:
    d = {
        "line_color": rgba(cor),
        "line_width": largura,
        "line_width_unit": "MM",
        "line_style": "solid",
        "capstyle": "round",
        "joinstyle": "round",
        "use_custom_dash": 0,
    }
    if tracejado:
        d.update({"use_custom_dash": 1, "customdash": tracejado, "customdash_unit": "MM", "capstyle": "flat"})
    return f'<layer class="SimpleLine" enabled="1" locked="0" pass="{passe}">' + props(d) + "</layer>"


def simbolo(tipo: str, nome: str, camadas: str, alfa: float = 1.0) -> str:
    return f'<symbol type="{tipo}" name="{nome}" alpha="{alfa}" clip_to_extent="1" force_rhr="0">{camadas}</symbol>'


def unico(sym: str) -> str:
    return f'<renderer-v2 type="singleSymbol" symbollevels="0" forceraster="0" enableorderby="0"><symbols>{sym}</symbols></renderer-v2>'


def rotulo(campo: str, *, tamanho: float, cor: str = TINTA, fonte: str = SANS, italico: bool = False,
           negrito: bool = False, expressao: bool = False, posicao: int = 1, escala_max: int | None = None,
           buffer: float = 0.8, maiusculas: bool = False, prioridade: int = 5, linha: bool = False,
           distancia: float = 0) -> str:
    """Rótulo simples com halo branco, como na prancha. posicao: 1 = sobre o centroide, 2 = ao longo da linha."""
    escala = f'scaleVisibility="1" scaleMin="1" scaleMax="{escala_max}"' if escala_max else 'scaleVisibility="0"'
    return (
        '<labeling type="simple"><settings calloutType="simple">'
        f'<text-style fieldName={quoteattr(campo)} isExpression="{int(expressao)}" fontFamily="{fonte}" '
        f'fontSize="{tamanho}" fontSizeUnit="Point" textColor="{rgba(cor)}" textOpacity="1" '
        f'fontItalic="{int(italico)}" fontWeight="{75 if negrito else 50}" fontCapitals="{1 if maiusculas else 0}" '
        f'fontLetterSpacing="{0.6 if maiusculas else 0}" multilineHeight="1">'
        f'<text-buffer bufferDraw="1" bufferSize="{buffer}" bufferSizeUnits="MM" bufferColor="{rgba(PAPEL)}" '
        'bufferOpacity="0.85" bufferJoinStyle="128" bufferNoFill="1"/>'
        '</text-style>'
        f'<text-format wrapChar="" autoWrapLength="{0 if linha else 18}" useMaxLineLengthForAutoWrap="1" multilineAlign="1"/>'
        f'<placement placement="{posicao}" placementFlags="{9 if linha else 10}" centroidInside="1" centroidWhole="0" '
        f'fitInPolygonOnly="0" priority="{prioridade}" repeatDistance="{60 if linha else 0}" repeatDistanceUnits="MM" '
        f'dist="{distancia}" distUnits="MM" overlapHandling="PreventOverlap"/>'
        f'<rendering {escala} obstacle="1" labelPerPart="0" mergeLines="{int(linha)}" displayAll="0" '
        'upsidedownLabels="0" limitNumLabels="0" drawLabels="1"/>'
        '</settings></labeling>'
    )


def qml(renderer: str, geometria: str, labeling: str = "", opacidade: float = 1.0) -> str:
    return (
        "<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>\n"
        f'<qgis version="3.28.0" styleCategories="Symbology|Labeling">{renderer}{labeling}'
        f"<layerOpacity>{opacidade}</layerOpacity>"
        f"<layerGeometryType>{GEOM[geometria]}</layerGeometryType></qgis>"
    )


def estilos(cores: dict[str, str], rgints: list[tuple[str, str]], nome_estado: str, en: bool) -> dict[str, tuple[str, str]]:
    """{camada: (descrição, QML)}"""
    cats, syms = [], []
    for i, (cod, nome) in enumerate(rgints):
        nome = GRAFIA.get(nome, nome)
        cats.append(f'<category render="true" symbol="{i}" value={quoteattr(cod)} label={quoteattr(nome)}/>')
        syms.append(simbolo("fill", str(i), preenchimento(cores[cod], PAPEL, 0.15)))
    municipios = (
        f'<renderer-v2 type="categorizedSymbol" attr="CD_RGINT" symbollevels="0" forceraster="0" enableorderby="0">'
        f'<categories>{"".join(cats)}</categories><symbols>{"".join(syms)}</symbols></renderer-v2>'
    )

    q = lambda v: escape(v, {'"': "&quot;"})  # noqa: E731
    fed = q("\"jurisdicao_mapa\" = 'federal'")
    construida = q("\"situacao_fisica\" = 'Construída'")
    regras = [
        # (filtro, rótulo PT, rótulo EN, símbolo, ligada)
        (f"{fed} AND {construida}", "Rodovia federal", "Federal highway",
         simbolo("line", "{i}", traco(PAPEL, 1.3, 2) + traco(ROD_FED, 0.7, 3)), True),
        (f"NOT {fed} AND {construida} AND &quot;pavimentada&quot;", "Rodovia estadual pavimentada", "Paved state highway",
         simbolo("line", "{i}", traco(ROD_EST, 0.35, 1)), True),
        (f"NOT {fed} AND {construida} AND NOT &quot;pavimentada&quot;", "Rodovia estadual sem pavimento", "Unpaved state highway",
         simbolo("line", "{i}", traco(ROD_EST, 0.28, 1, "1.2;0.9")), True),
        (f"NOT {construida} OR &quot;situacao_fisica&quot; IS NULL", "Situação física não confirmada (fora da prancha)",
         "Physical status not confirmed (not on the plate)", simbolo("line", "{i}", traco(CINZA, 0.25, 0, "0.6;0.8")), False),
    ]
    rs, ss = [], []
    for i, (filtro, pt, en_, sym, ligada) in enumerate(regras):
        rs.append(f'<rule key="r{i}" filter="{filtro}" label={quoteattr(en_ if en else pt)} symbol="{i}" checkstate="{int(ligada)}"/>')
        ss.append(sym.replace("{i}", str(i)))
    rodovias = (
        '<renderer-v2 type="RuleRenderer" symbollevels="1" forceraster="0" enableorderby="0">'
        f'<rules key="root">{"".join(rs)}</rules><symbols>{"".join(ss)}</symbols></renderer-v2>'
    )
    sigla_fed = "CASE WHEN \"jurisdicao_mapa\" = 'federal' THEN \"sigla\" END"  # quoteattr escapa

    estrela = (
        '<layer class="SimpleMarker" enabled="1" locked="0" pass="0">'
        + props({
            "name": "star", "color": rgba(TINTA), "outline_color": rgba(PAPEL), "outline_width": 0.2,
            "outline_width_unit": "MM", "size": 5, "size_unit": "MM", "joinstyle": "round",
            "outline_style": "solid", "angle": 0, "vertical_anchor_point": 1, "horizontal_anchor_point": 1,
        })
        + "</layer>"
    )

    t = (lambda pt, en_: en_) if en else (lambda pt, en_: pt)
    return {
        "municipios": (t(f"Municípios de {nome_estado}, coloridos pela região intermediária",
                         f"Municipalities of {nome_estado}, coloured by intermediate region"),
                       qml(municipios, "poligono", rotulo('CASE WHEN NOT "capital" THEN "NM_MUN" END', tamanho=7, cor="#33373a",
                                                  expressao=True, escala_max=1_500_000, prioridade=3))),
        "regioes_imediatas": (t("Limites das regiões imediatas", "Immediate-region boundaries"),
                              qml(unico(simbolo("fill", "0", preenchimento(None, LIM_RGI, 0.25, 0.8))), "poligono")),
        "regioes_intermediarias": (t("Limites e nomes das regiões intermediárias", "Intermediate-region boundaries and names"),
                                   qml(unico(simbolo("fill", "0", preenchimento(None, LIM_RGINT, 0.5))), "poligono",
                                       rotulo("NM_RGINT", tamanho=10, cor=LIM_RGINT, fonte=SERIF, italico=True, buffer=1, prioridade=8))),
        "limite_estadual": (t("Limite estadual", "State boundary"),
                            qml(unico(simbolo("fill", "0", preenchimento(None, TINTA, 0.9))), "poligono")),
        "areas_operacionais": (t("Áreas operacionais do IBGE (lagoas), desenhadas como água",
                                 "IBGE operational areas (lagoons), drawn as water"),
                               qml(unico(simbolo("fill", "0", preenchimento(OCEANO, BORDA_AGUA, 0.25))), "poligono",
                                   rotulo("NM_MUN", tamanho=9, cor=ROTULO_AGUA, fonte=SERIF, italico=True, prioridade=6))),
        "rodovias": (t("Rodovias como na prancha; os trechos sem situação confirmada ficam desligados na legenda",
                       "Highways as on the plate; sections without a confirmed status are switched off in the legend"),
                     qml(rodovias, "linha", rotulo(sigla_fed, tamanho=7.5, cor=ROD_FED, expressao=True, negrito=True,
                                                    posicao=2, linha=True, escala_max=3_000_000, prioridade=4))),
        "capital": (t("Capital (ponto interno do município)", "Capital (point inside the municipality)"),
                    qml(unico(simbolo("marker", "0", estrela)), "ponto",
                        rotulo("NM_MUN", tamanho=9, negrito=True, posicao=0, buffer=1, prioridade=10, distancia=2.4))),
    }


def gravar(gpkg: Path, camadas: dict[str, tuple[str, str]]) -> list[str]:
    con = sqlite3.connect(gpkg)
    try:
        cur = con.cursor()
        existentes = {r[0]: r[1] for r in cur.execute("SELECT table_name, data_type FROM gpkg_contents")}
        geom = dict(cur.execute("SELECT table_name, column_name FROM gpkg_geometry_columns"))
        cur.execute("DROP TABLE IF EXISTS layer_styles")
        cur.execute("DELETE FROM gpkg_contents WHERE table_name = 'layer_styles'")
        # Mesmo esquema que o QGIS cria (via OGR) ao salvar um estilo no GeoPackage.
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
        if "gpkg_ogr_contents" in {r[0] for r in cur.execute("SELECT name FROM sqlite_master WHERE type='table'")}:
            cur.execute("DELETE FROM gpkg_ogr_contents WHERE table_name = 'layer_styles'")
            cur.execute("INSERT INTO gpkg_ogr_contents (table_name, feature_count) VALUES ('layer_styles', ?)",
                        (sum(c in existentes for c in camadas),))
        gravadas = []
        for camada, (descricao, estilo) in camadas.items():
            if camada not in existentes:
                continue
            cur.execute(
                "INSERT INTO layer_styles (f_table_catalog, f_table_schema, f_table_name, f_geometry_column, styleName, "
                "styleQML, styleSLD, useAsDefault, description, owner, ui) VALUES ('', '', ?, ?, ?, ?, '', 1, ?, '', '')",
                (camada, geom[camada], camada, estilo, descricao),
            )
            gravadas.append(camada)
        faltando = [c for c, tipo in existentes.items() if tipo == "features" and c not in camadas]
        assert not faltando, f"camadas sem estilo: {faltando}"
        con.commit()
    finally:
        con.close()
    return gravadas


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("uf")
    ap.add_argument("--pasta", required=True, help="pasta do mapa em /mapas")
    a = ap.parse_args()
    uf = a.uf.lower()

    prancha = json.loads((RAIZ / "scripts" / "estados" / "cache" / f"{uf}_prancha.json").read_text(encoding="utf-8"))
    nome_estado = json.loads((RAIZ / "scripts" / "estados" / "cache" / f"{uf}.json").read_text(encoding="utf-8"))["numeros"]["nome"]
    arq_zip = RAIZ / "mapas" / a.pasta / "dados" / f"{uf}_divisao_territorial.gpkg.zip"
    nome = f"{uf}_divisao_territorial.gpkg"

    with tempfile.TemporaryDirectory() as tmp:
        gpkg = Path(tmp) / nome
        with zipfile.ZipFile(arq_zip) as z:
            gpkg.write_bytes(z.read(nome))
        con = sqlite3.connect(gpkg)
        rgints = list(con.execute("SELECT CD_RGINT, NM_RGINT FROM regioes_intermediarias ORDER BY NM_RGINT"))
        con.close()
        sem_cor = [c for c, _ in rgints if c not in prancha["cores"]]
        assert not sem_cor, f"regiões sem cor na prancha: {sem_cor}"
        # Os rótulos da legenda vão em português: os nomes dos campos e das camadas já são em português.
        gravadas = gravar(gpkg, estilos(prancha["cores"], rgints, nome_estado, en=False))
        con = sqlite3.connect(gpkg)
        con.execute("VACUUM")
        con.close()
        arq_zip.unlink()
        with zipfile.ZipFile(arq_zip, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
            z.write(gpkg, nome)

    print(f"{uf.upper()}: {len(gravadas)} estilos ({', '.join(gravadas)}) · {arq_zip.stat().st_size / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
