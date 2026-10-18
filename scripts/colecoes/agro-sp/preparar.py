"""
Coleção «Do campo ao biometano» — prepara os dados de uma prancha (uso interno).

    .venv-geo/Scripts/python scripts/colecoes/agro-sp/preparar.py cana|laranja|graos|urbano|sintese

Saídas: mapas/<pasta>/dados/<base>.gpkg.zip (com estilos do QGIS), <base>.csv
e scripts/colecoes/cache/agro-sp-<tema>.json (para a prancha e a ficha).

O potencial de biometano é o do método CP2B v5.1 (Unicamp), cenário de referência, nível N4
(acessível, o «Cenário Real» da plataforma CP2B), em m³ de biometano equivalente por dia.
"""

from __future__ import annotations

import argparse
import sys
from functools import lru_cache
from pathlib import Path

import geopandas as gpd
import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from comum import (  # noqa: E402
    DADOS, MINERAIS, RAIZ, TINTA, classe, estilo_contorno, estilo_graduado, estilo_regras, gravar_cache, gravar_estilos,
    igual, malha_uf, marcador, preenchimento, quebras, sidra, simbolo, valor_sidra, zipar,
)

PASTAS = {
    "cana": "046-cana-2008-2024-sp",
    "laranja": "047-laranja-sp",
    "graos": "048-milho-e-soja-sp",
    "urbano": "049-lixo-e-esgoto-sp",
    "sintese": "050-biometano-sp",
}
PAM = DADOS / "raw" / "pam"
F1612 = ["TABELA_1612_2012_A_2008.xlsx", "TABELA_1612_2016_A_2013.xlsx", "TABELA_1612_2020_A_2017.xlsx", "TABELA_1612_2024_A_2021.xlsx"]
F1613 = ["TABELA_1613_2008_A_2011.xlsx", "TABELA_1613_2012_A_2015.xlsx", "TABELA_1613_2016_A_2020.xlsx",
         "TABELA_1613_2020_A_2023.xlsx", "TABELA_1613_2024.xlsx"]
CP2B = DADOS / "raw" / "cp2b_potential" / "2026" / "cp2b_municipio_substrato_niveis.csv"
ETES = DADOS / "shapefiles" / "ETEs_2019_SP.shp"
CENARIO = "med"
ANO0, ANO1 = 2008, 2024

CANA = ["#f3efd9", "#dfe0a8", "#b8c97f", "#86ad5f", "#558a45", "#2b6233"]
LARANJA = ["#fdf0d9", "#fdd49e", "#fdbb84", "#fc8d59", "#e34a33", "#b30000"]
SOJA = ["#f7f1dc", "#ecdcab", "#dcc07a", "#c39a4c", "#9c712c", "#6b4a1a"]
MILHO = ["#fbf6d0", "#f2e58f", "#d9cf55", "#a9b33a", "#748f2d", "#465f22"]
METANO = ["#e6f1f1", "#bcdcdc", "#86c0c3", "#4f9ea8", "#2a7a8c", "#174f66"]
DIVERGE = ["#8c510a", "#d8b365", "#efe9dc", "#9fcfc3", "#35978f", "#01665e"]
PCT = [5, 15, 30, 45, 60, 100]          # % do território municipal, as mesmas classes em 2008 e 2024
VAR = [-10, -3, 3, 10, 20]              # pontos percentuais (limites internos das seis classes)

# Grupos da síntese: substrato do CP2B → grupo.
GRUPOS = {
    "cana": ("Cana", "Sugarcane", "#5b7f3a", ["PALHA", "BAGACO", "TORTA_FILTRO", "VINHACA"]),
    "lavouras": ("Outras lavouras", "Other crops", "#c99a2e", ["PALHA_MILHO", "PALHA_SOJA", "BAGACO_CITROS", "CASCA_CAFE"]),
    "pecuaria": ("Pecuária", "Livestock", MINERAIS["argila"], ["AVES_CORTE", "AVES_POSTURA", "BOV_LEITE", "BOV_CONFINADO",
                                                               "BOV_PASTO_MISTO", "SUINOS"]),
    "urbano": ("Lixo e esgoto", "Waste and sewage", MINERAIS["azul_profundo"], ["RSU_ORGANICO", "LODO_ETE", "PODA_URBANA"]),
}
SUBSTRATOS = {
    "PALHA": ("palha de cana", "cane straw"), "BAGACO": ("bagaço de cana", "cane bagasse"),
    "TORTA_FILTRO": ("torta de filtro", "filter cake"), "VINHACA": ("vinhaça", "vinasse"),
    "PALHA_MILHO": ("palha de milho", "maize straw"), "PALHA_SOJA": ("palha de soja", "soybean straw"),
    "BAGACO_CITROS": ("bagaço de laranja", "orange bagasse"), "CASCA_CAFE": ("casca de café", "coffee husk"),
    "AVES_CORTE": ("frango de corte", "broilers"), "AVES_POSTURA": ("galinhas poedeiras", "laying hens"),
    "BOV_LEITE": ("gado leiteiro", "dairy cattle"), "BOV_CONFINADO": ("gado confinado", "feedlot cattle"),
    "BOV_PASTO_MISTO": ("gado a pasto", "grazing cattle"), "SUINOS": ("suínos", "pigs"),
    "RSU_ORGANICO": ("lixo orgânico", "organic waste"), "LODO_ETE": ("lodo de esgoto", "sewage sludge"),
    "PODA_URBANA": ("poda urbana", "urban prunings"),
}


# ------------------------------------------------------------------ comuns
def base_territorial(mun: gpd.GeoDataFrame):
    rgint = mun.dissolve(by=["CD_RGINT", "NM_RGINT"], as_index=False)[["CD_RGINT", "NM_RGINT", "geometry"]]
    limite = mun.assign(SIGLA_UF="SP").dissolve(by="SIGLA_UF", as_index=False)[["SIGLA_UF", "geometry"]]
    return rgint, limite


def estilos_base() -> dict:
    return {
        "regioes_intermediarias": [("contorno", "Limites e nomes das regiões intermediárias",
                                    estilo_contorno("#1a211a", 0.45, "NM_RGINT"), True)],
        "limite_estadual": [("contorno", "Limite estadual", estilo_contorno(TINTA, 0.8), True)],
    }


def gravar(tema: str, nome: str, camadas: dict[str, gpd.GeoDataFrame], estilos: dict, csv: pd.DataFrame) -> dict:
    destino = RAIZ / "mapas" / PASTAS[tema] / "dados"
    destino.mkdir(parents=True, exist_ok=True)
    gpkg = destino / f"{nome}.gpkg"
    gpkg.unlink(missing_ok=True)
    for camada, gdf in camadas.items():
        gdf.to_file(gpkg, layer=camada, driver="GPKG", engine="pyogrio")
    gravar_estilos(gpkg, estilos)
    z = zipar(gpkg)
    arq_csv = destino / f"{nome}.csv"
    csv.to_csv(arq_csv, index=False, encoding="utf-8")
    return {z.name: z.stat().st_size, arq_csv.name: arq_csv.stat().st_size}


def topo(df: pd.DataFrame, campo: str, n: int = 5, asc: bool = False) -> list[dict]:
    t = df[df[campo].notna()].sort_values(campo, ascending=asc).head(n)
    return [{"cd": r.CD_MUN, "nome": r.NM_MUN, "valor": float(getattr(r, campo))} for r in t.itertuples()]


@lru_cache(maxsize=None)
def _aba(arq: str, aba: int) -> pd.DataFrame:
    t, _ = sidra(PAM / arq, aba)
    return t[t.index.str.startswith("35")]


def pam(arqs: list[str], aba: int, produto: str) -> pd.DataFrame:
    """Municípios × anos de uma variável da PAM (aba 1 = área colhida, 2 = produção), com a situação do IBGE."""
    vals, sits = {}, {}
    for a in arqs:
        t = _aba(a, aba)
        for ano, p in t.columns:
            if p == produto:
                par = t[(ano, p)].map(valor_sidra)
                vals[ano] = par.map(lambda x: x[0])
                sits[ano] = par.map(lambda x: x[1])
    return pd.DataFrame(vals).sort_index(axis=1), pd.DataFrame(sits).sort_index(axis=1)


def junta(df: pd.DataFrame, tab: pd.DataFrame, ano: int, campo: str) -> None:
    """Coluna `campo` com o valor do ano; município fora da tabela fica sem informação."""
    df[campo] = df["CD_MUN"].map(tab[ano]) if ano in tab.columns else None


def serie_estadual(tab: pd.DataFrame) -> dict[int, float]:
    return {int(a): float(tab[a].sum()) for a in tab.columns}


@lru_cache(maxsize=1)
def cp2b() -> pd.DataFrame:
    """Potencial N4 do cenário de referência por município e substrato, em m³ de biometano por dia."""
    n = pd.read_csv(CP2B, dtype={"ibge_code": str})
    n = n[n["scenario"] == CENARIO]
    assert n["method_version"].nunique() == 1
    return n


def cp2b_pivo(campo: str = "n4_biomethane_eq_nm3_year") -> pd.DataFrame:
    n = cp2b()
    return (n.pivot_table(index="ibge_code", columns="substrate", values=campo, aggfunc="sum") / 365).fillna(0)


def versao_cp2b() -> str:
    return str(cp2b()["method_version"].iloc[0])


def regras_classes(campo: str, lim: list[float], cores: list[str], rotulos: list[str]) -> list[tuple[str, str, str]]:
    """Itens de estilo por regras para classes com limites negativos (variação)."""
    q = f"&quot;{campo}&quot;"
    itens, ini = [], None
    for i, (cor, rot) in enumerate(zip(cores, rotulos)):
        fim = lim[i] if i < len(lim) else None
        partes = ([f"{q} &gt; {ini!r}"] if ini is not None else []) + ([f"{q} &lt;= {fim!r}"] if fim is not None else [])
        itens.append((" AND ".join(partes), rot, preenchimento(cor, "#ffffff", 0.1)))
        ini = fim
    itens.append((f"{q} IS NULL", "sem informação", preenchimento("#ffffff", "#ffffff", 0.1)))
    return itens


def classe_var(v) -> int | None:
    if v is None or pd.isna(v):
        return None
    for i, l in enumerate(VAR):
        if v <= l:
            return i
    return len(VAR)


# ------------------------------------------------------------------ 046 cana 2008 × 2024
def cana() -> None:
    mun = malha_uf("SP")
    area, sit = pam(F1612, 1, "Cana-de-açúcar")
    prod, _ = pam(F1612, 2, "Cana-de-açúcar")
    df = mun.drop(columns="geometry").copy()
    for ano in (ANO0, ANO1):
        junta(df, area, ano, f"area_{ano}_ha")
        junta(df, prod, ano, f"producao_{ano}_t")
        df[f"pct_{ano}"] = (df[f"area_{ano}_ha"] / (df["area_km2"] * 100) * 100).round(2)
        df[f"cl_{ano}"] = [classe(v, PCT) for v in df[f"pct_{ano}"]]
    df["var_pp"] = (df[f"pct_{ANO1}"] - df[f"pct_{ANO0}"]).round(2)
    df["cl_var"] = [classe_var(v) for v in df["var_pp"]]
    rgint, limite = base_territorial(mun)
    cols = ["CD_MUN", "NM_MUN", "CD_RGINT", "NM_RGINT", "area_km2", f"area_{ANO0}_ha", f"area_{ANO1}_ha",
            f"producao_{ANO0}_t", f"producao_{ANO1}_t", f"pct_{ANO0}", f"pct_{ANO1}", "var_pp"]
    camada = gpd.GeoDataFrame(df[cols], geometry=mun.geometry.values, crs=mun.crs)
    rot_var = ["perdeu mais de 10 p.p.", "perdeu de 3 a 10 p.p.", "estável (±3 p.p.)", "ganhou de 3 a 10 p.p.",
               "ganhou de 10 a 20 p.p.", "ganhou mais de 20 p.p."]
    estilos = {
        "municipios": [
            (f"parte_{ANO1}", f"Área colhida de cana como parte do território (%), PAM {ANO1}",
             estilo_graduado(f"pct_{ANO1}", PCT, CANA, rotulo_campo="NM_MUN"), True),
            (f"parte_{ANO0}", f"Área colhida de cana como parte do território (%), PAM {ANO0}",
             estilo_graduado(f"pct_{ANO0}", PCT, CANA, rotulo_campo="NM_MUN"), False),
            ("variacao", f"Variação {ANO0}–{ANO1}, em pontos percentuais do território",
             estilo_regras("poligono", regras_classes("var_pp", VAR, DIVERGE, rot_var), rotulo_campo="NM_MUN"), False),
        ],
        **estilos_base(),
    }
    arquivos = gravar("cana", "sp_cana_2008_2024", {"municipios": camada, "regioes_intermediarias": rgint,
                                                     "limite_estadual": limite}, estilos, df[cols].sort_values("NM_MUN"))
    ok = df.dropna(subset=["var_pp"])
    a_ano = serie_estadual(area)
    gravar_cache("agro-sp-cana", {
        "anos": [ANO0, ANO1], "municipios": len(df),
        "area_sp_km2": float(df["area_km2"].sum()),
        "area": {str(a): float(df[f"area_{a}_ha"].sum()) for a in (ANO0, ANO1)},
        "producao": {str(a): float(df[f"producao_{a}_t"].sum()) for a in (ANO0, ANO1)},
        "com_cana": {str(a): int((df[f"area_{a}_ha"] > 0).sum()) for a in (ANO0, ANO1)},
        "acima_50": {str(a): int((df[f"pct_{a}"] > 50).sum()) for a in (ANO0, ANO1)},
        "sem_info": {str(a): int(df[f"area_{a}_ha"].isna().sum()) for a in (ANO0, ANO1)},
        "serie_area": a_ano, "serie_producao": serie_estadual(prod),
        "pico": max(a_ano, key=a_ano.get),
        "ganharam_10": int((ok["var_pp"] > 10).sum()), "perderam_10": int((ok["var_pp"] < -10).sum()),
        "ganharam_3": int((ok["var_pp"] > 3).sum()), "perderam_3": int((ok["var_pp"] < -3).sum()),
        "estaveis": int(ok["var_pp"].between(-3, 3).sum()),
        "maiores_ganhos": topo(ok, "var_pp"), "maiores_perdas": topo(ok, "var_pp", asc=True),
        "ganho_ha": topo(df.assign(d=df[f"area_{ANO1}_ha"] - df[f"area_{ANO0}_ha"]), "d"),
        "classes": PCT, "var": VAR,
        "valores": {r.CD_MUN: [getattr(r, f"cl_{ANO0}"), getattr(r, f"cl_{ANO1}"), r.cl_var] for r in df.itertuples()},
        "arquivos": arquivos,
    })
    print(f"cana: {ANO0} {df[f'area_{ANO0}_ha'].sum():,.0f} ha → {ANO1} {df[f'area_{ANO1}_ha'].sum():,.0f} ha · {arquivos}")


# ------------------------------------------------------------------ 047 laranja
def laranja() -> None:
    mun = malha_uf("SP")
    area, _ = pam(F1613, 1, "Laranja")
    prod, sit = pam(F1613, 2, "Laranja")
    df = mun.drop(columns="geometry").copy()
    for ano in (ANO0, ANO1):
        junta(df, area, ano, f"area_{ano}_ha")
        junta(df, prod, ano, f"producao_{ano}_t")
    df["pct_area"] = (df[f"area_{ANO1}_ha"] / (df["area_km2"] * 100) * 100).round(2)
    pv = cp2b_pivo()
    df["biometano_m3_dia"] = df["CD_MUN"].map(pv["BAGACO_CITROS"]).round(1)
    # Deixou a laranja: tinha área colhida em 2008 e nenhuma em 2024.
    df["deixou"] = (df[f"area_{ANO0}_ha"] > 0) & (df[f"area_{ANO1}_ha"] == 0)
    lim = quebras(df[f"producao_{ANO1}_t"])
    df["cl"] = [classe(v, lim) for v in df[f"producao_{ANO1}_t"]]
    rgint, limite = base_territorial(mun)
    cols = ["CD_MUN", "NM_MUN", "CD_RGINT", "NM_RGINT", "area_km2", f"area_{ANO0}_ha", f"producao_{ANO0}_t",
            f"area_{ANO1}_ha", f"producao_{ANO1}_t", "pct_area", "deixou", "biometano_m3_dia"]
    camada = gpd.GeoDataFrame(df[cols], geometry=mun.geometry.values, crs=mun.crs)
    lim_bm = quebras(df["biometano_m3_dia"])
    estilos = {
        "municipios": [
            ("producao", f"Produção de laranja (t), PAM {ANO1}", estilo_graduado(f"producao_{ANO1}_t", lim, LARANJA, rotulo_campo="NM_MUN"), True),
            ("biometano", "Potencial de biometano do bagaço de laranja (m³/dia), CP2B N4",
             estilo_graduado("biometano_m3_dia", lim_bm, METANO, rotulo_campo="NM_MUN"), False),
            ("deixou", f"Municípios que colhiam laranja em {ANO0} e não colhem em {ANO1}",
             estilo_regras("poligono", [(igual("deixou", 1), f"deixou a laranja entre {ANO0} e {ANO1}",
                                         preenchimento("#f2a07f", "#ffffff", 0.1)),
                                        ("ELSE", "outros", preenchimento(None, "#c9ced3", 0.1))]), False),
        ],
        **estilos_base(),
    }
    # O método aloca o bagaço às fábricas de suco: círculos nos municípios que o recebem.
    tem = df["biometano_m3_dia"] > 0
    fab = gpd.GeoDataFrame(df.loc[tem, ["CD_MUN", "NM_MUN", "producao_2024_t", "biometano_m3_dia"]],
                           geometry=mun.loc[tem].to_crs("EPSG:5880").representative_point().to_crs(mun.crs).values, crs=mun.crs)
    estilos["bagaco_nas_fabricas"] = [("circulos", "Biometano do bagaço de laranja onde ele é gerado, nas fábricas de suco (círculo ∝ m³/dia), CP2B N4",
                                       estilo_regras("ponto", [("1 = 1", "bagaço nas fábricas de suco", marcador(METANO[4], 2, alfa=0.85,
                                                     tamanho_expr='1 + 0.05 * sqrt("biometano_m3_dia")'))], rotulo_campo="NM_MUN"), True)]
    arquivos = gravar("laranja", f"sp_laranja_{ANO1}", {"bagaco_nas_fabricas": fab, "municipios": camada, "regioes_intermediarias": rgint,
                                                       "limite_estadual": limite}, estilos, df[cols].sort_values("NM_MUN"))
    bm = df["biometano_m3_dia"].sum()
    gravar_cache("agro-sp-laranja", {
        "anos": [ANO0, ANO1], "municipios": len(df), "cp2b": versao_cp2b(),
        "area": {str(a): float(df[f"area_{a}_ha"].sum()) for a in (ANO0, ANO1)},
        "producao": {str(a): float(df[f"producao_{a}_t"].sum()) for a in (ANO0, ANO1)},
        "com_laranja": {str(a): int((df[f"area_{a}_ha"] > 0).sum()) for a in (ANO0, ANO1)},
        "deixaram": int(df["deixou"].sum()), "deixaram_cds": df.loc[df["deixou"], "CD_MUN"].tolist(),
        "sem_info": int(df[f"producao_{ANO1}_t"].isna().sum()),
        "serie_area": serie_estadual(area), "serie_producao": serie_estadual(prod),
        "maiores": topo(df, f"producao_{ANO1}_t", 6), "maior_parte": topo(df, "pct_area", 3),
        "biometano_m3_dia": float(bm), "biometano_maiores": topo(df, "biometano_m3_dia"),
        "fabricas": [{"cd": r.CD_MUN, "nome": r.NM_MUN, "v": float(r.biometano_m3_dia), "coord": [round(g.x, 5), round(g.y, 5)]}
                     for r, g in zip(fab.itertuples(), fab.geometry)],
        "rendimento": {str(a): float(df[f"producao_{a}_t"].sum() / df[f"area_{a}_ha"].sum()) for a in (ANO0, ANO1)},
        "top10_pct_producao": float(df[f"producao_{ANO1}_t"].nlargest(10).sum() / df[f"producao_{ANO1}_t"].sum() * 100),
        "quebras": lim,
        "valores": {r.CD_MUN: r.cl for r in df.itertuples()},
        "arquivos": arquivos,
    })
    print(f"laranja: {df[f'producao_{ANO1}_t'].sum():,.0f} t · biometano {bm:,.0f} m³/dia · {arquivos}")


# ------------------------------------------------------------------ 048 milho e soja
def graos() -> None:
    mun = malha_uf("SP")
    df = mun.drop(columns="geometry").copy()
    series = {}
    for chave, produto in (("soja", "Soja (em grão)"), ("milho", "Milho (em grão)")):
        area, _ = pam(F1612, 1, produto)
        prod, _ = pam(F1612, 2, produto)
        series[chave] = {"area": serie_estadual(area), "producao": serie_estadual(prod)}
        for ano in (ANO0, ANO1):
            junta(df, area, ano, f"{chave}_area_{ano}_ha")
            junta(df, prod, ano, f"{chave}_producao_{ano}_t")
        df[f"{chave}_pct"] = (df[f"{chave}_area_{ANO1}_ha"] / (df["area_km2"] * 100) * 100).round(2)
    pv = cp2b_pivo()
    df["palha_milho_m3_dia"] = df["CD_MUN"].map(pv["PALHA_MILHO"]).round(1)
    df["palha_soja_m3_dia"] = df["CD_MUN"].map(pv["PALHA_SOJA"]).round(1)
    df["palhas_m3_dia"] = (df["palha_milho_m3_dia"] + df["palha_soja_m3_dia"]).round(1)
    lims = {c: quebras(df[c]) for c in ("soja_pct", "milho_pct", "palhas_m3_dia")}
    for c, lim in lims.items():
        df[f"cl_{c}"] = [classe(v, lim) for v in df[c]]
    rgint, limite = base_territorial(mun)
    cols = ["CD_MUN", "NM_MUN", "CD_RGINT", "NM_RGINT", "area_km2"] + [
        f"{c}_{v}_{a}_{u}" for c in ("soja", "milho") for a in (ANO0, ANO1) for v, u in (("area", "ha"), ("producao", "t"))
    ] + ["soja_pct", "milho_pct", "palha_milho_m3_dia", "palha_soja_m3_dia", "palhas_m3_dia"]
    camada = gpd.GeoDataFrame(df[cols], geometry=mun.geometry.values, crs=mun.crs)
    estilos = {
        "municipios": [
            ("soja", f"Área colhida de soja como parte do território (%), PAM {ANO1}",
             estilo_graduado("soja_pct", lims["soja_pct"], SOJA, casas=1, rotulo_campo="NM_MUN"), True),
            ("milho", f"Área colhida de milho como parte do território (%), PAM {ANO1}",
             estilo_graduado("milho_pct", lims["milho_pct"], MILHO, casas=1, rotulo_campo="NM_MUN"), False),
            ("palhas", "Potencial de biometano das palhas de milho e soja (m³/dia), CP2B N4",
             estilo_graduado("palhas_m3_dia", lims["palhas_m3_dia"], METANO, rotulo_campo="NM_MUN"), False),
        ],
        **estilos_base(),
    }
    arquivos = gravar("graos", f"sp_milho_soja_{ANO1}", {"municipios": camada, "regioes_intermediarias": rgint,
                                                        "limite_estadual": limite}, estilos, df[cols].sort_values("NM_MUN"))
    cruzou = next(a for a in sorted(series["soja"]["area"]) if series["soja"]["area"][a] > series["milho"]["area"][a])
    gravar_cache("agro-sp-graos", {
        "anos": [ANO0, ANO1], "municipios": len(df), "cp2b": versao_cp2b(), "series": series, "soja_passa_milho": cruzou,
        "com": {c: {str(a): int((df[f"{c}_area_{a}_ha"] > 0).sum()) for a in (ANO0, ANO1)} for c in ("soja", "milho")},
        "sem_info": int(df[f"soja_area_{ANO1}_ha"].isna().sum()),
        "maiores": {c: topo(df, f"{c}_producao_{ANO1}_t") for c in ("soja", "milho")},
        "mais_parte": {c: topo(df, f"{c}_pct", 3) for c in ("soja", "milho")},
        "palhas_m3_dia": float(df["palhas_m3_dia"].sum()),
        "palha_milho_m3_dia": float(df["palha_milho_m3_dia"].sum()), "palha_soja_m3_dia": float(df["palha_soja_m3_dia"].sum()),
        "palhas_maiores": topo(df, "palhas_m3_dia"),
        "quebras": lims,
        "valores": {r.CD_MUN: [getattr(r, "cl_soja_pct"), getattr(r, "cl_milho_pct"), getattr(r, "cl_palhas_m3_dia")]
                    for r in df.itertuples()},
        "arquivos": arquivos,
    })
    print(f"grãos: soja passa o milho em {cruzou} · palhas {df['palhas_m3_dia'].sum():,.0f} m³/dia · {arquivos}")


# ------------------------------------------------------------------ 049 lixo e esgoto
FAMILIAS_ETE = {
    "Reatores Anaeróbios": ("reator", "Reator anaeróbio", "Anaerobic reactor"),
    "Sistemas de Lagoas": ("lagoa", "Lagoas", "Ponds"),
    "Lodos Ativados": ("lodos", "Lodos ativados", "Activated sludge"),
}


def urbano() -> None:
    mun = malha_uf("SP")
    df = mun.drop(columns="geometry").copy()
    pv = cp2b_pivo()
    uso = cp2b_pivo("existing_use_subtracted_ch4_nm3_year")
    antes = cp2b_pivo("n3_before_existing_use_ch4_nm3_year")
    for s, c in (("RSU_ORGANICO", "lixo_m3_dia"), ("LODO_ETE", "lodo_m3_dia"), ("PODA_URBANA", "poda_m3_dia")):
        df[c] = df["CD_MUN"].map(pv[s]).round(1)
    df["urbano_m3_dia"] = df[["lixo_m3_dia", "lodo_m3_dia", "poda_m3_dia"]].sum(axis=1).round(1)
    # Metano do lixo que os aterros já captam (descontado do potencial pelo método), em CH₄.
    df["lixo_ja_usado_ch4_m3_dia"] = df["CD_MUN"].map(uso["RSU_ORGANICO"]).round(1)
    lim = quebras(df["urbano_m3_dia"])
    df["cl"] = [classe(v, lim) for v in df["urbano_m3_dia"]]
    e = gpd.read_file(ETES, engine="pyogrio").set_crs("EPSG:4674", allow_override=True)
    fam = {k: v[0] for k, v in FAMILIAS_ETE.items()}
    etes = gpd.GeoDataFrame({
        "codigo": e["ETE_CD"], "nome": e["ETE_NM"], "situacao": e["ETE_DS_STA"], "tratamento": e["ETE_DS_TIP"],
        "familia_ana": e["ETE_DS_TI"], "familia": e["ETE_DS_TI"].map(fam).fillna("outros"),
        "remocao_dbo": e["ETE_PC_REM"], "CD_MUN": e["ETE_MUN_CD"].astype(str),
    }, geometry=e.geometry.values, crs=e.crs)
    # A base repete a estação integrada uma vez por município atendido (mesmo código, pontos a poucos metros):
    # fica um ponto por estação, no registro do município-sede (os sete primeiros dígitos do código).
    atendidos = etes.groupby("codigo")["CD_MUN"].nunique()
    etes = etes[etes["CD_MUN"] == etes["codigo"].str[:7]].drop_duplicates("codigo").reset_index(drop=True)
    assert len(etes) == len(atendidos)
    etes["municipios_atendidos"] = etes["codigo"].map(atendidos)
    etes["NM_MUN"] = etes["CD_MUN"].map(df.set_index("CD_MUN")["NM_MUN"])
    assert etes["NM_MUN"].notna().all()
    rgint, limite = base_territorial(mun)
    cols = ["CD_MUN", "NM_MUN", "CD_RGINT", "NM_RGINT", "lixo_m3_dia", "lodo_m3_dia", "poda_m3_dia", "urbano_m3_dia",
            "lixo_ja_usado_ch4_m3_dia"]
    camada = gpd.GeoDataFrame(df[cols], geometry=mun.geometry.values, crs=mun.crs)
    cor_fam = {"reator": MINERAIS["argila"], "lagoa": "#5d8fb0", "lodos": "#3f4a55", "outros": "#9aa1a8"}
    itens = [(igual("familia", k), rot, marcador(cor_fam[k], 2.2 if k == "reator" else 1.6))
             for k, rot in [("reator", "Reator anaeróbio"), ("lagoa", "Lagoas"), ("lodos", "Lodos ativados"), ("outros", "Outros processos")]]
    estilos = {
        "municipios": [("urbano", "Potencial de biometano do lixo, do esgoto e da poda (m³/dia), CP2B N4",
                        estilo_graduado("urbano_m3_dia", lim, METANO, rotulo_campo="NM_MUN"), True)],
        "etes": [("familia", "Estações de tratamento de esgoto por família de processo (ANA, 2019)", estilo_regras("ponto", itens), True)],
        **estilos_base(),
    }
    csv = df[cols].sort_values("NM_MUN")
    arquivos = gravar("urbano", "sp_lixo_esgoto", {"etes": etes, "municipios": camada, "regioes_intermediarias": rgint,
                                                   "limite_estadual": limite}, estilos, csv)
    etes[["codigo", "nome", "situacao", "tratamento", "familia_ana", "familia", "remocao_dbo", "CD_MUN", "NM_MUN",
          "municipios_atendidos"]].assign(
        lon=etes.geometry.x.round(6), lat=etes.geometry.y.round(6)).to_csv(
        RAIZ / "mapas" / PASTAS["urbano"] / "dados" / "sp_etes_2019.csv", index=False, encoding="utf-8")
    sp = df.set_index("CD_MUN").loc["3550308"]
    gravar_cache("agro-sp-urbano", {
        "municipios": len(df), "cp2b": versao_cp2b(),
        "urbano_m3_dia": float(df["urbano_m3_dia"].sum()),
        "partes": {c: float(df[c].sum()) for c in ("lixo_m3_dia", "lodo_m3_dia", "poda_m3_dia")},
        "lixo_antes_ch4_m3_dia": float(antes["RSU_ORGANICO"].sum()),
        "lixo_ja_usado_ch4_m3_dia": float(df["lixo_ja_usado_ch4_m3_dia"].sum()),
        "municipios_com_uso": int((df["lixo_ja_usado_ch4_m3_dia"] > 0).sum()),
        "sao_paulo": {"urbano": float(sp["urbano_m3_dia"]), "lixo": float(sp["lixo_m3_dia"])},
        "maiores": topo(df, "urbano_m3_dia"),
        "quebras": lim,
        "etes": int(len(etes)), "etes_ativas": int((etes["situacao"] == "Ativa").sum()),
        "etes_municipios": int(etes["CD_MUN"].nunique()),
        "municipios_atendidos": int(len(set(e["ETE_MUN_CD"].astype(str)))),
        "maior_integrada": max(((r.nome, int(r.municipios_atendidos)) for r in etes.itertuples()), key=lambda t: t[1]),
        "etes_familia": etes["familia"].value_counts().to_dict(),
        "pontos": [{"f": r.familia, "coord": [round(r.geometry.x, 5), round(r.geometry.y, 5)]} for r in etes.itertuples()],
        "valores": {r.CD_MUN: r.cl for r in df.itertuples()},
        "arquivos": arquivos,
    })
    print(f"urbano: {df['urbano_m3_dia'].sum():,.0f} m³/dia · {len(etes)} ETEs · {arquivos}")


# ------------------------------------------------------------------ 050 síntese
def sintese() -> None:
    mun = malha_uf("SP")
    df = mun.drop(columns="geometry").copy()
    pv = cp2b_pivo()
    for g, (_, _, _, subs) in GRUPOS.items():
        df[f"{g}_m3_dia"] = df["CD_MUN"].map(pv[subs].sum(axis=1)).round(1)
    grupos = [f"{g}_m3_dia" for g in GRUPOS]
    df["total_m3_dia"] = df[grupos].sum(axis=1).round(1)
    df["dominante"] = df[grupos].idxmax(axis=1).str.replace("_m3_dia", "")
    df["parte_dominante"] = (df[grupos].max(axis=1) / df["total_m3_dia"] * 100).round(1)
    # Sem potencial nenhum, não há fonte dominante (idxmax devolveria a primeira coluna).
    df.loc[df["total_m3_dia"] == 0, ["dominante", "parte_dominante"]] = None
    n = cp2b()
    niveis = {k: float(n[f"{k}_ch4_nm3_year"].sum() / 365) for k in ("n1", "n2", "n3", "n4")}
    sub = (n.groupby("substrate")["n4_biomethane_eq_nm3_year"].sum() / 365).sort_values(ascending=False)
    rgint, limite = base_territorial(mun)
    cols = ["CD_MUN", "NM_MUN", "CD_RGINT", "NM_RGINT"] + grupos + ["total_m3_dia", "dominante", "parte_dominante"]
    camada = gpd.GeoDataFrame(df[cols], geometry=mun.geometry.values, crs=mun.crs)
    # Pontos no interior de cada município, para os círculos proporcionais.
    pts = gpd.GeoDataFrame(df[cols], geometry=mun.to_crs("EPSG:5880").representative_point().to_crs(mun.crs).values, crs=mun.crs)
    itens = [(igual("dominante", g), f"{pt}: o maior potencial do município", marcador(cor, 2, alfa=0.82,
             tamanho_expr='0.6 + 0.022 * sqrt("total_m3_dia")')) for g, (pt, _, cor, _) in GRUPOS.items()]
    estilos = {
        "potencial": [("circulos", "Potencial de biometano por município (círculo ∝ m³/dia; cor = maior fonte), CP2B N4",
                       estilo_regras("ponto", itens, ordem='"total_m3_dia" DESC'), True)],
        "municipios": [("contorno", "Limites municipais", estilo_contorno("#c9ced3", 0.1), True)],
        **estilos_base(),
    }
    arquivos = gravar("sintese", "sp_biometano_cp2b", {"potencial": pts, "municipios": camada, "regioes_intermediarias": rgint,
                                                      "limite_estadual": limite}, estilos, df[cols].sort_values("NM_MUN"))
    tot = df["total_m3_dia"].sum()
    gravar_cache("agro-sp-sintese", {
        "municipios": len(df), "cp2b": versao_cp2b(), "cenario": CENARIO,
        "total_m3_dia": float(tot),
        "ch4_m3_dia": niveis["n4"],
        "niveis_ch4_m3_dia": niveis,
        "grupos": {g: float(df[f"{g}_m3_dia"].sum()) for g in GRUPOS},
        "dominante": df["dominante"].value_counts().to_dict(),
        "substratos": [{"codigo": k, "pt": SUBSTRATOS[k][0], "en": SUBSTRATOS[k][1], "m3_dia": float(v)} for k, v in sub.items()],
        "maiores": topo(df, "total_m3_dia", 6),
        "top10_pct": float(df["total_m3_dia"].nlargest(10).sum() / tot * 100),
        "zero": int((df["total_m3_dia"] == 0).sum()),
        "metade_em": int((df["total_m3_dia"].sort_values(ascending=False).cumsum() < tot / 2).sum() + 1),
        "pontos": [{"cd": r.CD_MUN, "v": float(r.total_m3_dia), "g": r.dominante,
                    "coord": [round(p.x, 5), round(p.y, 5)]} for r, p in zip(df.itertuples(), pts.geometry) if r.total_m3_dia > 0],
        "arquivos": arquivos,
    })
    print(f"síntese: {tot:,.0f} m³/dia de biometano · {arquivos}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    temas = {"cana": cana, "laranja": laranja, "graos": graos, "urbano": urbano, "sintese": sintese}
    ap.add_argument("tema", choices=list(temas))
    temas[ap.parse_args().tema]()
