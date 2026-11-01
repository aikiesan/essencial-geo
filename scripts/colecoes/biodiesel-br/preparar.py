"""
Coleção «De onde vem o biodiesel» (Brasil) — prepara os dados de uma prancha (uso interno).

    .venv-geo/Scripts/python scripts/colecoes/biodiesel-br/preparar.py usinas|sebo|balanco

Saídas: mapas/<pasta>/dados/<base>.gpkg.zip (com estilos do QGIS), <base>.csv
e scripts/colecoes/cache/biodiesel-br-<tema>.json (para a prancha e a ficha).
Fontes: dados abertos do Painel Dinâmico de Produtores de Biodiesel da ANP (dados-brutos/anp-biodiesel/),
vendas de derivados por UF da ANP (dados-brutos/anp-precos/) e a PPM do IBGE (tabela 3939).
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path

import geopandas as gpd
import numpy as np
import pandas as pd
from shapely.geometry import LineString

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from comum import (  # noqa: E402
    AREA_BR, DADOS, GEO, RAIZ, TINTA, estilo_contorno, estilo_regras, gravar_cache, gravar_estilos, igual, linha, marcador,
    sidra, valor_sidra, zipar,
)
from estilos import preenchimento  # noqa: E402

SERIE = {s["tema"]: s for s in json.loads((Path(__file__).parent / "serie.json").read_text(encoding="utf-8"))}
MALHA_BR = RAIZ / "scripts" / "estados" / "cache" / "brasil_0_004.gpkg"
ANP = RAIZ / "dados-brutos" / "anp-biodiesel" / "pb-da-biodiesel"
VENDAS_UF = RAIZ / "dados-brutos" / "anp-precos" / "vendas-combustiveis-m3-1990-2025.csv"
PPM = DADOS / "raw" / "ibge_ppm" / "TABELA_3939_PPM_2008A2024.xlsx"
REGIOES = {"1": "Norte", "2": "Nordeste", "3": "Sudeste", "4": "Sul", "5": "Centro-Oeste"}
REGIAO_ANP = {"NORTE": "Norte", "NORDESTE": "Nordeste", "SUDESTE": "Sudeste", "SUL": "Sul", "CENTRO OESTE": "Centro-Oeste",
              "CENTRO-OESTE": "Centro-Oeste"}
UF = {
    "Acre": "AC", "Alagoas": "AL", "Amapá": "AP", "Amazonas": "AM", "Bahia": "BA", "Ceará": "CE", "Distrito Federal": "DF",
    "Espírito Santo": "ES", "Goiás": "GO", "Maranhão": "MA", "Mato Grosso": "MT", "Mato Grosso do Sul": "MS",
    "Minas Gerais": "MG", "Pará": "PA", "Paraíba": "PB", "Paraná": "PR", "Pernambuco": "PE", "Piauí": "PI",
    "Rio de Janeiro": "RJ", "Rio Grande do Norte": "RN", "Rio Grande do Sul": "RS", "Rondônia": "RO", "Roraima": "RR",
    "Santa Catarina": "SC", "São Paulo": "SP", "Sergipe": "SE", "Tocantins": "TO",
}
MESES = {"JAN": 1, "FEV": 2, "MAR": 3, "ABR": 4, "MAI": 5, "JUN": 6, "JUL": 7, "AGO": 8, "SET": 9, "OUT": 10, "NOV": 11, "DEZ": 12}
# Mistura obrigatória em vigor em todo o período de doze meses (B15 desde 01/08/2025, Resolução CNPE nº 9/2025).
MISTURA = 0.15
INICIO = "01/2018"  # o painel de capacidade começa aqui
FIM = "09/2026"     # último mês publicado (arquivo de 27/10/2026)


def gravar(tema: str, camadas: dict[str, gpd.GeoDataFrame], estilos: dict, csv: pd.DataFrame) -> dict:
    s = SERIE[tema]
    destino = RAIZ / "mapas" / s["pasta"] / "dados"
    destino.mkdir(parents=True, exist_ok=True)
    gpkg = destino / f"{s['base']}.gpkg"
    gpkg.unlink(missing_ok=True)
    for camada, gdf in camadas.items():
        gdf.to_file(gpkg, layer=camada, driver="GPKG", engine="pyogrio")
    gravar_estilos(gpkg, estilos)
    z = zipar(gpkg)
    arq_csv = destino / f"{s['base']}.csv"
    csv.to_csv(arq_csv, index=False, encoding="utf-8")
    return {z.name: z.stat().st_size, arq_csv.name: arq_csv.stat().st_size}


def chave(uf: str, nome: str) -> str:
    """'SP|SAO JOAO DA BOA VISTA': sem acento, caixa alta, sem pontuação."""
    s = unicodedata.normalize("NFD", str(nome)).encode("ascii", "ignore").decode().upper()
    s = re.sub(r"[^A-Z0-9 ]", " ", s.replace("'", "").replace("-", " "))
    return f"{uf}|{re.sub(r'\s+', ' ', s).strip()}"


def municipios() -> gpd.GeoDataFrame:
    """Municípios da malha simplificada da série dos estados, com UF, região e um ponto interno (lon, lat)."""
    m = gpd.read_file(MALHA_BR, engine="pyogrio").set_crs(GEO, allow_override=True)
    m = m[m["CD_MUN"].str.match(r"^\d{7}$") & m["CD_RGINT"].notna()][["CD_MUN", "NM_MUN", "SIGLA_UF", "geometry"]]
    m["regiao"] = m["CD_MUN"].str[0].map(REGIOES)
    pos = m.geometry.to_crs(AREA_BR).representative_point().to_crs(GEO)
    m["lon"], m["lat"] = pos.x.round(4), pos.y.round(4)
    return m.reset_index(drop=True)


def ufs_brasil(m: gpd.GeoDataFrame) -> tuple[gpd.GeoDataFrame, gpd.GeoDataFrame, gpd.GeoDataFrame]:
    ufs = m.dissolve(by=["SIGLA_UF", "regiao"], as_index=False)[["SIGLA_UF", "regiao", "geometry"]]
    reg = m.dissolve(by="regiao", as_index=False)[["regiao", "geometry"]]
    lim = m.assign(pais="Brasil").dissolve(by="pais", as_index=False)[["pais", "geometry"]]
    return ufs, reg, lim


def numero(s: pd.Series) -> pd.Series:
    """'8121648,878' → 8121648.878 (vírgula decimal, sem separador de milhar)."""
    return pd.to_numeric(s.astype(str).str.replace(".", "", regex=False).str.replace(",", ".", regex=False))


def ler(nome: str, colunas: list[str]) -> pd.DataFrame:
    d = pd.read_csv(ANP / f"Biodiesel_DadosAbertos_CSV_{nome}.csv", encoding="utf-8-sig", dtype=str)
    assert len(d.columns) == len(colunas), d.columns
    d.columns = colunas
    d["data"] = pd.to_datetime(d["mes"], format="%m/%Y")
    return d


def doze(d: pd.DataFrame) -> pd.Series:
    """Os doze meses até o último publicado (10/2025–09/2026)."""
    fim = pd.to_datetime(FIM, format="%m/%Y")
    return (d["data"] > fim - pd.DateOffset(months=12)) & (d["data"] <= fim)


ROT12 = "10/2025–09/2026"


def capacidade(m: gpd.GeoDataFrame) -> pd.DataFrame:
    """Capacidade autorizada de biodiesel, uma linha por usina (CNPJ) e mês, com o município do IBGE."""
    c = ler("Capacidade", ["mes", "razao_social", "cnpj", "regiao_anp", "estado", "municipio_anp", "capacidade_m3d"])
    c["capacidade_m3d"] = numero(c["capacidade_m3d"])
    c["uf"] = c["estado"].map(UF)
    assert c["uf"].notna().all(), c.loc[c["uf"].isna(), "estado"].unique()
    c["regiao"] = c["regiao_anp"].map(REGIAO_ANP)
    k = c.apply(lambda r: chave(r.uf, r.municipio_anp), axis=1)
    cd = dict(zip([chave(u, n) for u, n in zip(m["SIGLA_UF"], m["NM_MUN"])], m["CD_MUN"]))
    c["CD_MUN"] = k.map(cd)
    assert c["CD_MUN"].notna().all(), k[c["CD_MUN"].isna()].unique()
    assert not c.duplicated(["mes", "cnpj"]).any()
    return c


def producao() -> pd.DataFrame:
    p = ler("Produção", ["mes", "regiao_anp", "m3"])
    p["m3"] = numero(p["m3"])
    p["regiao"] = p["regiao_anp"].map(REGIAO_ANP)
    assert p["regiao"].notna().all()
    return p


def mes_txt(d: pd.Timestamp) -> str:
    return d.strftime("%m/%Y")


# ------------------------------------------------------------------ 1 as usinas de biodiesel
CATEGORIAS = [
    ("nova", "ganhou usina", "gained a plant", "#3f5a2a"),
    ("cresceu", "cresceu", "grew", "#8aa05a"),
    ("igual", "não mudou", "unchanged", "#b8bd9e"),
    ("encolheu", "encolheu", "shrank", "#d6a96a"),
    ("zerou", "perdeu a usina", "lost its plant", "#9c4a32"),
]


def usinas() -> None:
    m = municipios()
    c = capacidade(m)
    a = c[c["mes"] == INICIO].groupby("CD_MUN").agg(cap_2018=("capacidade_m3d", "sum"), usinas_2018=("cnpj", "size"))
    b = c[c["mes"] == FIM].groupby("CD_MUN").agg(cap_2026=("capacidade_m3d", "sum"), usinas_2026=("cnpj", "size"))
    d = a.join(b, how="outer").fillna(0)
    d = d[(d["cap_2018"] > 0) | (d["cap_2026"] > 0)]
    d["variacao_m3d"] = d["cap_2026"] - d["cap_2018"]
    d["categoria"] = np.select(
        [(d["cap_2018"] == 0) & (d["cap_2026"] > 0), (d["cap_2018"] > 0) & (d["cap_2026"] == 0),
         d["variacao_m3d"] > 0, d["variacao_m3d"] < 0], ["nova", "zerou", "cresceu", "encolheu"], "igual")
    d = d.reset_index().merge(m.drop(columns="geometry"), on="CD_MUN", how="left")
    for k in ("usinas_2018", "usinas_2026"):
        d[k] = d[k].astype(int)
    pts = gpd.GeoDataFrame(d, geometry=gpd.points_from_xy(d["lon"], d["lat"]), crs=GEO)
    cols = ["CD_MUN", "NM_MUN", "SIGLA_UF", "regiao", "usinas_2018", "cap_2018", "usinas_2026", "cap_2026", "variacao_m3d",
            "categoria", "lon", "lat"]
    pts = pts[cols + ["geometry"]].sort_values("cap_2026", ascending=False).reset_index(drop=True)

    # Uso da capacidade: produção da região no período ÷ capacidade autorizada de cada mês × dias do mês.
    p = producao()
    c["dias"] = c["data"].dt.days_in_month
    c["cap_mes_m3"] = c["capacidade_m3d"] * c["dias"]

    def uso(sel_c: pd.Series, sel_p: pd.Series, por: str | None) -> pd.DataFrame:
        cc = c[sel_c].groupby(por or (lambda _: "Brasil"))["cap_mes_m3"].sum()
        pp = p[sel_p].groupby(por or (lambda _: "Brasil"))["m3"].sum()
        r = pd.DataFrame({"capacidade_m3": cc, "producao_m3": pp})
        r["uso_pct"] = r["producao_m3"] / r["capacidade_m3"] * 100
        return r

    reg12 = uso(doze(c), doze(p), "regiao")
    br12 = uso(doze(c), doze(p), None).iloc[0]
    anos = pd.concat({a_: uso(c["data"].dt.year == a_, p["data"].dt.year == a_, None).iloc[0] for a_ in range(2018, 2026)}, axis=1).T
    anos.loc["12m"] = br12

    ufs, reg, lim = ufs_brasil(m)
    u26 = c[c["mes"] == FIM]
    por_uf = u26.groupby("uf").agg(usinas=("cnpj", "size"), cap=("capacidade_m3d", "sum"))
    por_uf18 = c[c["mes"] == INICIO].groupby("uf")["capacidade_m3d"].sum()
    ufs["usinas_2026"] = ufs["SIGLA_UF"].map(por_uf["usinas"]).fillna(0).astype(int)
    ufs["cap_2026"] = ufs["SIGLA_UF"].map(por_uf["cap"]).fillna(0)
    ufs["cap_2018"] = ufs["SIGLA_UF"].map(por_uf18).fillna(0)
    reg["capacidade_m3_12m"] = reg["regiao"].map(reg12["capacidade_m3"]).round(0)
    reg["producao_m3_12m"] = reg["regiao"].map(reg12["producao_m3"]).round(0)
    reg["uso_pct_12m"] = reg["regiao"].map(reg12["uso_pct"]).round(1)

    regras = [(igual("categoria", k), r, marcador(cor, 2.4, tamanho_expr='1 + 0.1 * sqrt("cap_2026")'))
              for k, r, _, cor in CATEGORIAS if k != "zerou"]
    regras.append((igual("categoria", "zerou"), "perdeu a usina (anel = 01/2018)",
                   marcador("#9c4a32", 2.4, vazado=True, tamanho_expr='1 + 0.1 * sqrt("cap_2018")')))
    estilos = {
        "municipios": [("categoria", f"Capacidade de biodiesel por município, {INICIO} → {FIM}",
                        estilo_regras("ponto", regras, ordem='"cap_2026" DESC'), True)],
        "regioes": [("uso", f"Uso da capacidade por região, {ROT12} (%)", estilo_contorno(TINTA, 0.8, "uso_pct_12m"), True)],
        "ufs": [("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    tam = gravar("usinas", {"municipios": pts, "regioes": reg, "ufs": ufs, "limite_nacional": lim}, estilos, pts.drop(columns="geometry"))

    cat = pts.groupby("categoria").agg(n=("CD_MUN", "size"), d=("variacao_m3d", "sum"), c18=("cap_2018", "sum"), c26=("cap_2026", "sum"))
    cat = cat.reindex([k for k, *_ in CATEGORIAS]).fillna(0)
    maiores = u26.sort_values("capacidade_m3d", ascending=False)
    gravar_cache("biodiesel-br-usinas", {
        "inicio": INICIO, "fim": FIM, "rotulo_12m": ROT12,
        "pontos": [[r.categoria, float(r.lon), float(r.lat), float(r.cap_2018), float(r.cap_2026), r.NM_MUN, r.SIGLA_UF, int(r.usinas_2026)]
                   for r in pts.itertuples()],
        "categorias": [{"chave": k, "rotulo": r, "rotulo_en": en, "cor": cor, "municipios": int(cat.at[k, "n"]),
                        "variacao": float(cat.at[k, "d"]), "c18": float(cat.at[k, "c18"]), "c26": float(cat.at[k, "c26"])}
                       for k, r, en, cor in CATEGORIAS],
        "total_2018": float(c.loc[c["mes"] == INICIO, "capacidade_m3d"].sum()), "total_2026": float(u26["capacidade_m3d"].sum()),
        "usinas_2018": int((c["mes"] == INICIO).sum()), "usinas_2026": int(len(u26)),
        "municipios_2026": int((pts["cap_2026"] > 0).sum()), "empresas_2026": int(u26["cnpj"].str[:8].nunique()),
        "ufs": [{"uf": k, "usinas": int(v.usinas), "cap": float(v.cap), "c18": float(por_uf18.get(k, 0))}
                for k, v in por_uf.sort_values("cap", ascending=False).iterrows()],
        "regioes": [{"regiao": k, "cap_m3": float(v.capacidade_m3), "prod_m3": float(v.producao_m3), "uso": round(float(v.uso_pct), 1),
                     "cap_m3d": float(u26.loc[u26["regiao"] == k, "capacidade_m3d"].sum()), "usinas": int((u26["regiao"] == k).sum())}
                    for k, v in reg12.sort_values("capacidade_m3", ascending=False).iterrows()],
        "brasil_12m": {"cap_m3": float(br12.capacidade_m3), "prod_m3": float(br12.producao_m3), "uso": round(float(br12.uso_pct), 1)},
        "anos": [{"ano": str(k), "cap_m3": float(v.capacidade_m3), "prod_m3": float(v.producao_m3), "uso": round(float(v.uso_pct), 1)}
                 for k, v in anos.iterrows()],
        "maior_usina": {"nome": maiores.iloc[0]["razao_social"], "cap": float(maiores.iloc[0]["capacidade_m3d"]),
                        "mun": m.set_index("CD_MUN").at[maiores.iloc[0]["CD_MUN"], "NM_MUN"], "uf": maiores.iloc[0]["uf"]},
        "mediana_usina": float(u26["capacidade_m3d"].median()),
        "tamanhos": tam,
    })
    print(tam)
    print(cat.to_string())
    print(por_uf.sort_values("cap", ascending=False).to_string())
    print(reg12.round(1).to_string())
    print(anos.round(1).to_string())
    print(pts.head(12)[["NM_MUN", "SIGLA_UF", "usinas_2026", "cap_2018", "cap_2026", "categoria"]].to_string())


# ------------------------------------------------------------------ 2 soja, sebo e o resto
# Grupos de matéria-prima (rótulos da ANP → grupo do mapa).
GRUPOS = {
    "ÓLEO DE SOJA (GLYCINE MAX)": "soja", "ÁCIDO GRAXO DE ÓLEO DE SOJA": "soja",
    "GORDURA BOVINA": "sebo",
    "GORDURA DE PORCO": "outras_gorduras", "GORDURA DE FRANGO": "outras_gorduras",
    "ÓLEO DE ALGODÃO (GOSSYPIUM HIRSUT)": "outros_oleos", "ÓLEO DE MILHO": "outros_oleos",
    "ÓLEO DE PALMA/DENDÊ (ELAEIS GUINEENSIS OU ELAEIS O": "outros_oleos", "ÁCIDO GRAXO DE ÓLEO DE PALMA / DENDÊ": "outros_oleos",
    "ÓLEO DE PALMISTE": "outros_oleos", "ÓLEO DE COLZA/CANOLA (BRESSICA CAMPESTRIS)": "outros_oleos",
    "ÓLEO DE GIRASSOL (HELLANTHUS ANNUS)": "outros_oleos",
    "ÓLEO DE FRITURA USADO": "fritura",
    "OUTROS MATERIAIS GRAXOS": "outros_materiais", "OUTROS ÁCIDOS GRAXOS": "outros_materiais",
}
ORDEM_GRUPOS = [
    ("soja", "óleo de soja", "soybean oil", "#b59a3c"),
    ("sebo", "sebo bovino", "beef tallow", "#8c3f2b"),
    ("outras_gorduras", "gordura de porco e de frango", "pork and chicken fat", "#d39a86"),
    ("outros_oleos", "outros óleos vegetais", "other vegetable oils", "#7f9a5a"),
    ("fritura", "óleo de fritura usado", "used cooking oil", "#5f7f95"),
    ("outros_materiais", "outros materiais graxos", "other fatty materials", "#b9bdc1"),
]
LIMITES_SEBO = [2, 5, 15, 30]
CORES_SEBO = ["#f3e2d9", "#e3b8a3", "#c7826a", "#a2533c", "#6e2c1c"]
ROTULOS_SEBO = [("até 2 %", "up to 2%"), ("2 a 5 %", "2 to 5%"), ("5 a 15 %", "5 to 15%"), ("15 a 30 %", "15 to 30%"),
                ("30 % ou mais", "30% or more")]
LIMITES_SOJA = [30, 60, 80, 95]
CORES_SOJA = ["#f4eccd", "#e5d38f", "#c9ad55", "#9c8131", "#625019"]
ROTULOS_SOJA = [("até 30 %", "up to 30%"), ("30 a 60 %", "30 to 60%"), ("60 a 80 %", "60 to 80%"), ("80 a 95 %", "80 to 95%"),
                ("95 % ou mais", "95% or more")]
LIMITES_BOI = [2, 5, 10, 20]  # milhões de cabeças
CORES_BOI = ["#eef0ea", "#d4d9c8", "#adb595", "#7f8a63", "#4f5a3a"]
ROTULOS_BOI = [("até 2 mi", "up to 2 M"), ("2 a 5 mi", "2 to 5 M"), ("5 a 10 mi", "5 to 10 M"), ("10 a 20 mi", "10 to 20 M"),
               ("20 mi ou mais", "20 M or more")]
SEM_BIODIESEL = "#ffffff"


def materia_prima() -> pd.DataFrame:
    """m³ de matéria-prima por UF e mês, uma coluna por grupo."""
    mp = ler("MatériaPrima", ["mes", "regiao_anp", "estado", "produto", "m3"])
    mp["m3"] = numero(mp["m3"])
    assert set(mp["produto"]) <= set(GRUPOS), set(mp["produto"]) - set(GRUPOS)
    mp["grupo"] = mp["produto"].map(GRUPOS)
    mp["uf"] = mp["estado"].map(UF)
    mp["regiao"] = mp["regiao_anp"].map(REGIAO_ANP)
    assert mp["uf"].notna().all() and mp["regiao"].notna().all()
    return mp


def rebanho() -> pd.Series:
    """Bovinos por município em 2024 (PPM). Células «...» (não disponível) ficam de fora da soma; nenhuma inibida."""
    tab, _ = sidra(PPM)
    v = [valor_sidra(x) for x in tab[(2024, "Bovino")]]
    assert not any(s == "inibido" for _, s in v)
    s = pd.Series([x for x, _ in v], index=tab.index.astype(str))
    print("PPM 2024 sem dado:", list(s.index[s.isna()]))
    return s.dropna()


def sebo() -> None:
    m = municipios()
    mp = materia_prima()
    grupos = [g for g, *_ in ORDEM_GRUPOS]
    w12 = mp[doze(mp)].pivot_table(index="uf", columns="grupo", values="m3", aggfunc="sum").reindex(columns=grupos).fillna(0)
    w12["total"] = w12[grupos].sum(axis=1)
    pct12 = w12[grupos].div(w12["total"], axis=0) * 100
    mp["periodo"] = mp["data"].dt.year.astype(str)
    anos = mp.pivot_table(index="periodo", columns="grupo", values="m3", aggfunc="sum").reindex(columns=grupos).fillna(0)
    anos = anos.loc[[str(a) for a in range(2017, 2026)]]
    anos.loc["12m"] = w12[grupos].sum()
    anos["total"] = anos[grupos].sum(axis=1)
    pct_anos = anos[grupos].div(anos["total"], axis=0) * 100

    boi = rebanho()
    boi_uf = boi.groupby(boi.index.map(lambda cd: dict(zip(m["CD_MUN"], m["SIGLA_UF"])).get(cd))).sum()
    boi_br = float(boi.sum())

    ufs, _, lim = ufs_brasil(m)
    ufs["mp_total_m3"] = ufs["SIGLA_UF"].map(w12["total"]).fillna(0).round(0)
    for g in grupos:
        ufs[f"{g}_m3"] = ufs["SIGLA_UF"].map(w12[g]).fillna(0).round(0)
        ufs[f"{g}_pct"] = ufs["SIGLA_UF"].map(pct12[g]).round(1)
    ufs["bovinos_2024"] = ufs["SIGLA_UF"].map(boi_uf).astype("int64")
    ufs["sebo_l_por_boi"] = (ufs["sebo_m3"] * 1000 / ufs["bovinos_2024"]).round(2)
    tem = ufs["mp_total_m3"] > 0
    ufs["classe_sebo"] = np.where(tem, np.digitize(ufs["sebo_pct"].fillna(0), LIMITES_SEBO), -2).astype(int)
    ufs["classe_soja"] = np.where(tem, np.digitize(ufs["soja_pct"].fillna(0), LIMITES_SOJA), -2).astype(int)
    ufs["classe_boi"] = np.digitize(ufs["bovinos_2024"] / 1e6, LIMITES_BOI).astype(int)
    pos = ufs.geometry.to_crs(AREA_BR).representative_point().to_crs(GEO)
    sebo_pts = gpd.GeoDataFrame(ufs.loc[ufs["sebo_m3"] > 0, ["SIGLA_UF", "sebo_m3", "sebo_pct", "bovinos_2024"]],
                                geometry=pos[ufs["sebo_m3"] > 0].values, crs=GEO)

    def regras(campo, cores, rot, sem):
        r = [(igual(campo, i), rot[i][0], preenchimento(cor, "#ffffff", 0.2)) for i, cor in enumerate(cores)]
        if sem:
            r.append((igual(campo, -2), "sem produção de biodiesel", preenchimento(SEM_BIODIESEL, "#c9ced3", 0.2)))
        return r

    estilos = {
        "ufs": [("sebo", f"Sebo bovino, % da matéria-prima do biodiesel da UF, {ROT12}",
                 estilo_regras("poligono", regras("classe_sebo", CORES_SEBO, ROTULOS_SEBO, True), rotulo_campo="SIGLA_UF"), True),
                ("soja", f"Óleo de soja, % da matéria-prima do biodiesel da UF, {ROT12}",
                 estilo_regras("poligono", regras("classe_soja", CORES_SOJA, ROTULOS_SOJA, True), rotulo_campo="SIGLA_UF"), False),
                ("bovinos", "Rebanho bovino, 2024 (milhões de cabeças)",
                 estilo_regras("poligono", regras("classe_boi", CORES_BOI, ROTULOS_BOI, False), rotulo_campo="SIGLA_UF"), False)],
        "sebo_volume": [("sebo_m3", f"Sebo bovino usado no biodiesel, {ROT12} (m³)", estilo_regras("ponto", [
            ("TRUE", "m³ de sebo", marcador("#8c3f2b", 2, tamanho_expr='1 + 0.03 * sqrt("sebo_m3")'))], ordem='"sebo_m3" DESC'), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    cols = ["SIGLA_UF", "regiao", "mp_total_m3"] + [f"{g}_{k}" for g in grupos for k in ("m3", "pct")] + \
           ["bovinos_2024", "sebo_l_por_boi", "classe_sebo", "classe_soja", "classe_boi"]
    tam = gravar("sebo", {"ufs": ufs[cols + ["geometry"]], "sebo_volume": sebo_pts, "limite_nacional": lim}, estilos,
                 ufs[cols].sort_values("mp_total_m3", ascending=False))

    br12 = anos.loc["12m"]
    sebo_pct_br = float(br12["sebo"] / br12["total"] * 100)
    gravar_cache("biodiesel-br-sebo", {
        "rotulo_12m": ROT12, "mistura": MISTURA,
        "grupos": [{"chave": g, "rotulo": r, "rotulo_en": en, "cor": cor} for g, r, en, cor in ORDEM_GRUPOS],
        "classes_sebo": [{"rotulo": r, "rotulo_en": en, "cor": cor} for (r, en), cor in zip(ROTULOS_SEBO, CORES_SEBO)],
        "classes_soja": [{"rotulo": r, "rotulo_en": en, "cor": cor} for (r, en), cor in zip(ROTULOS_SOJA, CORES_SOJA)],
        "classes_boi": [{"rotulo": r, "rotulo_en": en, "cor": cor} for (r, en), cor in zip(ROTULOS_BOI, CORES_BOI)],
        "ufs": {r.SIGLA_UF: {"sebo": int(r.classe_sebo), "soja": int(r.classe_soja), "boi": int(r.classe_boi)} for r in ufs.itertuples()},
        "tabela": [{"uf": r.SIGLA_UF, "total": float(r.mp_total_m3), **{g: float(getattr(r, f"{g}_m3")) for g in grupos},
                    "bovinos": int(r.bovinos_2024)} for r in ufs[tem].sort_values("mp_total_m3", ascending=False).itertuples()],
        "sebo_pontos": [[r.SIGLA_UF, float(p.x), float(p.y), float(r.sebo_m3)] for r, p in zip(ufs.itertuples(), pos) if r.sebo_m3 > 0],
        "anos": [{"periodo": k, "total": float(v.total), **{g: float(v[g]) for g in grupos}} for k, v in anos.iterrows()],
        "sebo_pct_br": round(sebo_pct_br, 2), "sebo_m3_br": float(br12["sebo"]), "total_m3_br": float(br12["total"]),
        "sebo_no_diesel_pct": round(sebo_pct_br * MISTURA, 2),
        "bovinos_br": boi_br, "bovinos_ufs_sem_biodiesel": float(ufs.loc[~tem, "bovinos_2024"].sum()),
        "tamanhos": tam,
    })
    print(tam)
    print(pct_anos.round(1).to_string())
    print(anos.round(0).to_string())
    print(ufs.loc[tem, ["SIGLA_UF", "mp_total_m3", "soja_pct", "sebo_pct", "sebo_m3", "bovinos_2024", "sebo_l_por_boi"]]
          .sort_values("sebo_m3", ascending=False).to_string())
    print("bovinos BR", boi_br, "sem biodiesel", ufs.loc[~tem, "bovinos_2024"].sum(), "sebo no diesel %", sebo_pct_br * MISTURA)


# ------------------------------------------------------------------ 3 quem produz, quem consome
LIMITES_SALDO = [-1000, -400, -100, 100, 400, 1000]  # mil m³ no período
CORES_SALDO = ["#7e3b28", "#b8735a", "#e3b9a5", "#f1f2ef", "#b9c99a", "#7f9a5a", "#3f5a2a"]
ROTULOS_SALDO = [("falta mais de 1 milhão de m³", "short by over 1 million m³"), ("falta de 400 mil a 1 milhão", "short by 400 k to 1 million"),
                 ("falta de 100 a 400 mil", "short by 100 to 400 k"), ("perto do equilíbrio (±100 mil)", "near balance (±100 k)"),
                 ("sobra de 100 a 400 mil", "surplus of 100 to 400 k"), ("sobra de 400 mil a 1 milhão", "surplus of 400 k to 1 million"),
                 ("sobra mais de 1 milhão de m³", "surplus of over 1 million m³")]
# Pontos de ancoragem das setas entre regiões (lon, lat), escolhidos à mão dentro de cada região.
ANCORAS = {"Norte": [-58.5, -5.0], "Nordeste": [-40.8, -8.6], "Centro-Oeste": [-53.5, -14.2], "Sudeste": [-45.6, -19.6],
           "Sul": [-51.6, -27.0]}


def diesel_uf() -> pd.DataFrame:
    v = pd.read_csv(VENDAS_UF, sep=";", encoding="utf-8-sig", dtype=str)
    v.columns = ["ano", "mes", "grande_regiao", "estado", "produto", "m3"]
    v = v[v["produto"] == "ÓLEO DIESEL"].copy()
    v["m3"] = numero(v["m3"])
    v["data"] = pd.to_datetime(v["ano"] + "-" + v["mes"].map(MESES).astype(str) + "-01")
    nomes = {chave("", k).split("|")[1]: s for k, s in UF.items()}
    v["uf"] = v["estado"].map(lambda e: nomes.get(chave("", e).split("|")[1]))
    assert v["uf"].notna().all(), v.loc[v["uf"].isna(), "estado"].unique()
    v["regiao"] = v["grande_regiao"].str.replace("REGIÃO ", "", regex=False).map(REGIAO_ANP)
    assert v["regiao"].notna().all()
    return v


def balanco() -> None:
    m = municipios()
    mp = materia_prima()
    p = producao()
    dz = diesel_uf()
    s = ler("Vendas", ["mes", "origem_anp", "destino_anp", "m3"])
    s["m3"] = numero(s["m3"])
    s["origem"] = s["origem_anp"].map(REGIAO_ANP)
    s["destino"] = s["destino_anp"].map(REGIAO_ANP).fillna("não informada")
    assert s["origem"].notna().all()
    assert dz["data"].max() == pd.to_datetime(FIM, format="%m/%Y"), dz["data"].max()

    # Produção por UF (estimada): matéria-prima da UF × (produção da região ÷ matéria-prima da região), no período.
    mp12 = mp[doze(mp)]
    mp_uf = mp12.groupby(["regiao", "uf"])["m3"].sum()
    fator = p[doze(p)].groupby("regiao")["m3"].sum() / mp12.groupby("regiao")["m3"].sum()
    prod_uf = (mp_uf * mp_uf.index.get_level_values(0).map(fator).values).droplevel(0)
    diesel = dz[doze(dz)].groupby("uf")["m3"].sum()
    dem_uf = diesel * MISTURA

    ufs, reg, lim = ufs_brasil(m)
    ufs["diesel_m3"] = ufs["SIGLA_UF"].map(diesel).round(0)
    ufs["demanda_m3"] = ufs["SIGLA_UF"].map(dem_uf).round(0)
    ufs["producao_m3"] = ufs["SIGLA_UF"].map(prod_uf).fillna(0).round(0)
    ufs["saldo_m3"] = ufs["producao_m3"] - ufs["demanda_m3"]
    ufs["cobertura_pct"] = (ufs["producao_m3"] / ufs["demanda_m3"] * 100).round(1)
    ufs["classe"] = np.digitize(ufs["saldo_m3"] / 1000, LIMITES_SALDO).astype(int)

    # Vendas entre regiões (produtor → distribuidor), no período.
    v12 = s[doze(s)]
    mat = v12.pivot_table(index="origem", columns="destino", values="m3", aggfunc="sum").fillna(0)
    reg_nomes = list(ANCORAS)
    fluxos = [(o, d, float(mat.at[o, d])) for o in reg_nomes for d in reg_nomes if o != d and d in mat.columns and mat.at[o, d] > 0]
    fluxos.sort(key=lambda f: -f[2])
    linhas = gpd.GeoDataFrame({"origem": [f[0] for f in fluxos], "destino": [f[1] for f in fluxos], "vendas_m3": [round(f[2]) for f in fluxos]},
                              geometry=[LineString([ANCORAS[o], ANCORAS[d]]) for o, d, _ in fluxos], crs=GEO)
    prod_reg = p[doze(p)].groupby("regiao")["m3"].sum()
    dem_reg = dz[doze(dz)].groupby("regiao")["m3"].sum() * MISTURA
    vend_dest = mat.sum(axis=0)
    vend_orig = mat.sum(axis=1)
    reg["producao_m3"] = reg["regiao"].map(prod_reg).round(0)
    reg["demanda_m3"] = reg["regiao"].map(dem_reg).round(0)
    reg["vendas_origem_m3"] = reg["regiao"].map(vend_orig).round(0)
    reg["vendas_destino_m3"] = reg["regiao"].map(vend_dest).round(0)
    reg["fica_na_regiao_m3"] = [round(float(mat.at[r, r])) for r in reg["regiao"]]

    regras_uf = [(igual("classe", i), ROTULOS_SALDO[i][0], preenchimento(cor, "#ffffff", 0.2)) for i, cor in enumerate(CORES_SALDO)]
    estilos = {
        "ufs": [("saldo", f"Produção estimada menos diesel × 15 %, {ROT12}", estilo_regras("poligono", regras_uf, rotulo_campo="SIGLA_UF"), True)],
        "fluxos": [("vendas", f"Vendas de biodiesel entre regiões, {ROT12} (m³)", estilo_regras("linha", [
            ("TRUE", "produtor → distribuidor", linha(TINTA, 0.8))]), True)],
        "regioes": [("regioes", "Grandes regiões", estilo_contorno(TINTA, 0.8, "regiao"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    cols = ["SIGLA_UF", "regiao", "diesel_m3", "demanda_m3", "producao_m3", "saldo_m3", "cobertura_pct", "classe"]
    tam = gravar("balanco", {"ufs": ufs[cols + ["geometry"]], "fluxos": linhas, "regioes": reg, "limite_nacional": lim}, estilos,
                 ufs[cols].sort_values("saldo_m3"))

    # Mistura efetiva no país: vendas de biodiesel ÷ vendas de diesel, mês a mês, no período.
    bm = s.groupby("data")["m3"].sum()
    dm = dz.groupby("data")["m3"].sum()
    efetiva = (bm / dm * 100).dropna()
    ef12 = float(s[doze(s)]["m3"].sum() / dz[doze(dz)]["m3"].sum() * 100)
    gravar_cache("biodiesel-br-balanco", {
        "rotulo_12m": ROT12, "mistura": MISTURA,
        "classes": [{"classe": i, "rotulo": r, "rotulo_en": en, "cor": cor} for i, ((r, en), cor) in enumerate(zip(ROTULOS_SALDO, CORES_SALDO))],
        "ufs": [{"uf": r.SIGLA_UF, "regiao": r.regiao, "diesel": float(r.diesel_m3), "demanda": float(r.demanda_m3),
                 "producao": float(r.producao_m3), "saldo": float(r.saldo_m3), "classe": int(r.classe)}
                for r in ufs.sort_values("saldo_m3", ascending=False).itertuples()],
        "fluxos": [{"origem": o, "destino": d, "m3": v} for o, d, v in fluxos],
        "ancoras": ANCORAS,
        "regioes": [{"regiao": r, "producao": float(prod_reg[r]), "demanda": float(dem_reg[r]), "origem": float(vend_orig.get(r, 0)),
                     "destino": float(vend_dest.get(r, 0)), "fica": float(mat.at[r, r])} for r in reg_nomes],
        "nao_informada_m3": float(mat["não informada"].sum()) if "não informada" in mat.columns else 0.0,
        "vendas_m3": float(v12["m3"].sum()), "producao_m3": float(p[doze(p)]["m3"].sum()),
        "diesel_m3": float(dz[doze(dz)]["m3"].sum()), "mistura_efetiva_12m": round(ef12, 2),
        "efetiva_min": round(float(efetiva[efetiva.index > "2025-09-01"].min()), 2),
        "efetiva_max": round(float(efetiva[efetiva.index > "2025-09-01"].max()), 2),
        "ufs_sem_usina": sorted(ufs.loc[ufs["producao_m3"] == 0, "SIGLA_UF"].tolist()),
        "ufs_com_sobra": sorted(ufs.loc[ufs["saldo_m3"] > 0, "SIGLA_UF"].tolist()),
        "fator_regiao": {k: round(float(v), 3) for k, v in fator.items()},
        "entre_regioes_m3": float(sum(v for _, _, v in fluxos)),
        "tamanhos": tam,
    })
    print(tam)
    print(ufs[cols].sort_values("saldo_m3").to_string())
    print(mat.round(0).to_string())
    print("fator", fator.round(3).to_dict(), "efetiva 12m", round(ef12, 2))
    print(pd.DataFrame({"prod": prod_reg, "dem": dem_reg, "orig": vend_orig, "dest": vend_dest}).round(0).to_string())


if __name__ == "__main__":
    temas = {"usinas": usinas, "sebo": sebo, "balanco": balanco}
    ap = argparse.ArgumentParser()
    ap.add_argument("tema", choices=list(temas))
    temas[ap.parse_args().tema]()
