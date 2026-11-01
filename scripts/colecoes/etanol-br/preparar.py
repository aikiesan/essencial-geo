"""
Coleção «A nova geografia do etanol» (Brasil) — prepara os dados de uma prancha (uso interno).

    .venv-geo/Scripts/python scripts/colecoes/etanol-br/preparar.py endereco|milho|recuperacao

Saídas: mapas/<pasta>/dados/<base>.gpkg.zip (com estilos do QGIS), <base>.csv
e scripts/colecoes/cache/etanol-br-<tema>.json (para a prancha e a ficha).
Fonte: painel dinâmico do etanol da ANP (CSVs em dados-brutos/anp/etanol/pb-da-etanol/).
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
from shapely.geometry import LineString, box

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from comum import (  # noqa: E402
    AREA_BR, GEO, RAIZ, TINTA, estilo_contorno, estilo_regras, gravar_cache, gravar_estilos, igual, linha, marcador,
    para_d3, zipar,
)
from estilos import preenchimento  # noqa: E402

SERIE = {s["tema"]: s for s in json.loads((Path(__file__).parent / "serie.json").read_text(encoding="utf-8"))}
MALHA_BR = RAIZ / "scripts" / "estados" / "cache" / "brasil_0_004.gpkg"
ANP = RAIZ / "dados-brutos" / "anp" / "etanol" / "pb-da-etanol"
REGIOES = {"1": "Norte", "2": "Nordeste", "3": "Sudeste", "4": "Sul", "5": "Centro-Oeste"}
UF = {
    "Acre": "AC", "Alagoas": "AL", "Amapá": "AP", "Amazonas": "AM", "Bahia": "BA", "Ceará": "CE", "Distrito Federal": "DF",
    "Espírito Santo": "ES", "Goiás": "GO", "Maranhão": "MA", "Mato Grosso": "MT", "Mato Grosso do Sul": "MS",
    "Minas Gerais": "MG", "Pará": "PA", "Paraíba": "PB", "Paraná": "PR", "Pernambuco": "PE", "Piauí": "PI",
    "Rio de Janeiro": "RJ", "Rio Grande do Norte": "RN", "Rio Grande do Sul": "RS", "Rondônia": "RO", "Roraima": "RR",
    "Santa Catarina": "SC", "São Paulo": "SP", "Sergipe": "SE", "Tocantins": "TO",
}
# Grafia da ANP que não bate com a do IBGE depois de tirar acentos e caixa.
NOMES_ANP = {"BA|MUQUEM DE SAO FRANCISCO": "BA|MUQUEM DO SAO FRANCISCO"}
INICIO, FIM = "12/2018", "08/2026"  # o painel só se completa no fim de 2018 (273 usinas em 01/2018, 371 em 12/2018)


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
    pos = m.geometry.to_crs(AREA_BR).representative_point()
    m["x"], m["y"] = pos.x, pos.y  # metros, na Albers do Brasil
    ll = pos.to_crs(GEO)
    m["lon"], m["lat"] = ll.x.round(4), ll.y.round(4)
    return m.reset_index(drop=True)


def ufs_brasil(m: gpd.GeoDataFrame) -> tuple[gpd.GeoDataFrame, gpd.GeoDataFrame]:
    ufs = m.dissolve(by=["SIGLA_UF", "regiao"], as_index=False)[["SIGLA_UF", "regiao", "geometry"]]
    lim = m.assign(pais="Brasil").dissolve(by="pais", as_index=False)[["pais", "geometry"]]
    return ufs, lim


def numero(s: pd.Series) -> pd.Series:
    """'8121648,878' → 8121648.878 (vírgula decimal, sem separador de milhar)."""
    return pd.to_numeric(s.astype(str).str.replace(".", "", regex=False).str.replace(",", ".", regex=False))


def capacidade(m: gpd.GeoDataFrame) -> pd.DataFrame:
    """Capacidade autorizada, uma linha por usina (CNPJ) e mês, com o município do IBGE."""
    arqs = sorted(ANP.glob("Etanol_Capacidade *.csv"))
    c = pd.concat([pd.read_csv(a, encoding="utf-8-sig", dtype=str) for a in arqs], ignore_index=True)
    c.columns = ["mes", "razao_social", "cnpj", "regiao_anp", "estado", "municipio_anp", "anidro_m3d", "hidratado_m3d"]
    for k in ("anidro_m3d", "hidratado_m3d"):
        c[k] = numero(c[k])
    # A mesma destilaria faz anidro ou hidratado: a capacidade de etanol é a maior das duas, não a soma.
    c["capacidade_m3d"] = c[["anidro_m3d", "hidratado_m3d"]].max(axis=1)
    c["data"] = pd.to_datetime(c["mes"], format="%m/%Y")
    c["uf"] = c["estado"].map(UF)
    assert c["uf"].notna().all(), c.loc[c["uf"].isna(), "estado"].unique()
    k = c.apply(lambda r: chave(r.uf, r.municipio_anp), axis=1).replace(NOMES_ANP)
    cd = dict(zip([chave(u, n) for u, n in zip(m["SIGLA_UF"], m["NM_MUN"])], m["CD_MUN"]))
    c["CD_MUN"] = k.map(cd)
    assert c["CD_MUN"].notna().all(), k[c["CD_MUN"].isna()].unique()
    assert not c.duplicated(["mes", "cnpj"]).any()
    # Recuperação judicial: o nome empresarial registrado na ANP leva «em recuperação judicial» (art. 69 da Lei 11.101).
    c["recuperacao_judicial"] = c["razao_social"].map(
        lambda s: "RECUPERACAO JUDICIAL" in unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode().upper())
    return c


def mes_txt(d: pd.Timestamp) -> str:
    return d.strftime("%m/%Y")


# ------------------------------------------------------------------ 1 o etanol muda de endereço
CATEGORIAS = [
    ("nova", "ganhou destilaria", "gained a distillery", "#234e70"),
    ("cresceu", "cresceu", "grew", "#6f9cbc"),
    ("igual", "não mudou", "unchanged", "#b3bac1"),
    ("encolheu", "encolheu", "shrank", "#d9a27a"),
    ("zerou", "perdeu toda a capacidade", "lost all capacity", "#9c4a32"),
]


def endereco() -> None:
    m = municipios()
    c = capacidade(m)
    a = c[c["mes"] == INICIO].groupby("CD_MUN").agg(cap_2018=("capacidade_m3d", "sum"), usinas_2018=("cnpj", "size"))
    b = c[c["mes"] == FIM].groupby("CD_MUN").agg(cap_2026=("capacidade_m3d", "sum"), usinas_2026=("cnpj", "size"),
                                                  anidro_2026=("anidro_m3d", "sum"), hidratado_2026=("hidratado_m3d", "sum"))
    d = a.join(b, how="outer").fillna(0)
    # Destilaria registrada com capacidade zero nos dois meses (Bauru, 08/2026): fica fora das categorias.
    d = d[(d["cap_2018"] > 0) | (d["cap_2026"] > 0)]
    d["variacao_m3d"] = d["cap_2026"] - d["cap_2018"]
    d["categoria"] = np.select(
        [(d["cap_2018"] == 0) & (d["cap_2026"] > 0), (d["cap_2018"] > 0) & (d["cap_2026"] == 0),
         d["variacao_m3d"] > 0, d["variacao_m3d"] < 0], ["nova", "zerou", "cresceu", "encolheu"], "igual")
    d = d.reset_index().merge(m.drop(columns="geometry"), on="CD_MUN", how="left")
    for k in ("usinas_2018", "usinas_2026"):
        d[k] = d[k].astype(int)
    pts = gpd.GeoDataFrame(d, geometry=gpd.points_from_xy(d["lon"], d["lat"]), crs=GEO)
    cols = ["CD_MUN", "NM_MUN", "SIGLA_UF", "regiao", "usinas_2018", "cap_2018", "usinas_2026", "cap_2026", "anidro_2026",
            "hidratado_2026", "variacao_m3d", "categoria", "lon", "lat"]
    pts = pts[cols + ["geometry"]].sort_values("cap_2026", ascending=False).reset_index(drop=True)

    # Centro de gravidade da capacidade: média dos pontos dos municípios ponderada pela capacidade, em dezembro de
    # cada ano e no último mês, calculada na Albers do Brasil (metros) e devolvida em graus.
    meses = [f"12/{ano}" for ano in range(2018, 2026)] + [FIM]
    pos = m.set_index("CD_MUN")[["x", "y"]]
    trilha = []
    for me in meses:
        k = c[c["mes"] == me].join(pos, on="CD_MUN")
        w = k["capacidade_m3d"]
        trilha.append({"mes": me, "x": float((k["x"] * w).sum() / w.sum()), "y": float((k["y"] * w).sum() / w.sum()),
                       "capacidade_m3d": float(w.sum()), "usinas": int(len(k))})
    t = pd.DataFrame(trilha)
    t["passo_km"] = (np.hypot(t["x"].diff(), t["y"].diff()) / 1000).round(1)
    t["desde_2018_km"] = (np.hypot(t["x"] - t["x"].iloc[0], t["y"] - t["y"].iloc[0]) / 1000).round(1)
    g = gpd.GeoSeries(gpd.points_from_xy(t["x"], t["y"]), crs=AREA_BR)
    mp = m.set_crs(GEO).to_crs(AREA_BR)
    t["municipio"] = [mp.loc[mp.contains(p), "NM_MUN"].iloc[0] + " (" + mp.loc[mp.contains(p), "SIGLA_UF"].iloc[0] + ")" for p in g]
    ll = g.to_crs(GEO)
    t["lon"], t["lat"] = ll.x.round(4), ll.y.round(4)
    dx, dy = t["x"].iloc[-1] - t["x"].iloc[0], t["y"].iloc[-1] - t["y"].iloc[0]
    rumo = float(np.degrees(np.arctan2(dx, dy)) % 360)  # do norte, no sentido horário (na Albers; ≈ geográfico aqui)
    centro = gpd.GeoDataFrame(t[["mes", "capacidade_m3d", "usinas", "passo_km", "desde_2018_km", "municipio", "lon", "lat"]],
                              geometry=ll.values, crs=GEO)
    trajeto = gpd.GeoDataFrame({"de": [meses[0]], "ate": [meses[-1]], "km_em_linha_reta": [round(float(np.hypot(dx, dy)) / 1000, 1)],
                                "km_percorridos": [round(float(t["passo_km"].sum()), 1)], "rumo_graus": [round(rumo, 1)]},
                               geometry=[LineString(list(zip(ll.x, ll.y)))], crs=GEO)

    ufs, lim = ufs_brasil(m)
    regras = [(igual("categoria", k), r, marcador(cor, 2.4, tamanho_expr='1 + 0.08 * sqrt("cap_2026")'))
              for k, r, _, cor in CATEGORIAS if k != "zerou"]
    regras.append((igual("categoria", "zerou"), "perdeu toda a capacidade (anel = 12/2018)",
                   marcador("#9c4a32", 2.4, vazado=True, tamanho_expr='1 + 0.08 * sqrt("cap_2018")')))
    estilos = {
        "municipios": [("categoria", "Capacidade de etanol por município, 12/2018 → 08/2026",
                        estilo_regras("ponto", regras, ordem='"cap_2026" DESC'), True)],
        "centro_gravidade": [("centro", "Centro de gravidade da capacidade", estilo_regras("ponto", [
            ("TRUE", "dezembro de cada ano e 08/2026", marcador(TINTA, 1.6))]), True)],
        "trajeto": [("trajeto", "Trajeto do centro de gravidade", estilo_regras("linha", [("TRUE", "12/2018 → 08/2026", linha(TINTA, 0.5))]), True)],
        "ufs": [("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    tam = gravar("endereco", {"municipios": pts, "centro_gravidade": centro, "trajeto": trajeto, "ufs": ufs,
                              "limite_nacional": lim}, estilos, pts.drop(columns="geometry"))

    # Lupa: municípios em volta do trajeto, para o desenho ampliado.
    xs, ys = t["x"], t["y"]
    cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
    lado = 230_000
    janela = gpd.GeoSeries([box(cx - lado * 0.62, cy - lado / 2, cx + lado * 0.62, cy + lado / 2)], crs=AREA_BR)
    perto = mp[mp.intersects(janela.iloc[0].buffer(60_000))]
    nomes = set(t["municipio"]) | {"Uberlândia (MG)", "Itumbiara (GO)", "Frutal (MG)"}
    cidades = perto[(perto["NM_MUN"] + " (" + perto["SIGLA_UF"] + ")").isin(nomes)]
    ufs_c = c.groupby(["mes", "uf"])["capacidade_m3d"].sum().unstack(0)[[INICIO, FIM]].fillna(0)
    ufs_c["d"] = ufs_c[FIM] - ufs_c[INICIO]
    cat = pts.groupby("categoria").agg(n=("CD_MUN", "size"), d=("variacao_m3d", "sum"), c18=("cap_2018", "sum"), c26=("cap_2026", "sum"))

    def reg(r) -> dict:
        return {"cd": r.CD_MUN, "nome": r.NM_MUN, "uf": r.SIGLA_UF, "c18": float(r.cap_2018), "c26": float(r.cap_2026),
                "coord": [float(r.lon), float(r.lat)]}

    gravar_cache("etanol-br-endereco", {
        "inicio": INICIO, "fim": FIM,
        "pontos": [[r.categoria, float(r.lon), float(r.lat), float(r.cap_2018), float(r.cap_2026)] for r in pts.itertuples()],
        "categorias": [{"chave": k, "rotulo": r, "rotulo_en": en, "cor": cor, "municipios": int(cat.at[k, "n"]),
                        "variacao": float(cat.at[k, "d"]), "c18": float(cat.at[k, "c18"]), "c26": float(cat.at[k, "c26"])}
                       for k, r, en, cor in CATEGORIAS],
        "total_2018": float(pts["cap_2018"].sum()), "total_2026": float(pts["cap_2026"].sum()),
        "usinas_2018": int((c["mes"] == INICIO).sum()), "usinas_2026": int((c["mes"] == FIM).sum()),
        "municipios_2018": int((pts["cap_2018"] > 0).sum()), "municipios_2026": int((pts["cap_2026"] > 0).sum()),
        "trilha": [{"mes": r.mes, "coord": [float(r.lon), float(r.lat)], "cap": r.capacidade_m3d, "usinas": r.usinas,
                    "km": float(r.desde_2018_km), "municipio": r.municipio} for r in t.itertuples()],
        "km_reta": round(float(np.hypot(dx, dy)) / 1000, 1), "km_percorridos": round(float(t["passo_km"].sum()), 1),
        "rumo": round(rumo, 1),
        "lupa": {
            "janela": para_d3(gpd.GeoDataFrame(geometry=janela, crs=AREA_BR).assign(id=1), ["id"], casas=4),
            "municipios": para_d3(perto, ["CD_MUN", "NM_MUN", "SIGLA_UF"], casas=4),
            "cidades": [{"cd": r.CD_MUN, "nome": r.NM_MUN, "coord": [float(r.lon), float(r.lat)]} for r in cidades.itertuples()],
        },
        "ufs": [{"uf": k, "c18": float(v[INICIO]), "c26": float(v[FIM]), "d": float(v.d),
                 "municipios": {cat_: int(n) for cat_, n in pts[pts["SIGLA_UF"] == k]["categoria"].value_counts().items()}}
                for k, v in ufs_c.sort_values("d", ascending=False).iterrows()],
        "maiores_ganhos": [reg(r) for r in pts.sort_values("variacao_m3d", ascending=False).head(6).itertuples()],
        "maiores_perdas": [reg(r) for r in pts.sort_values("variacao_m3d").head(6).itertuples()],
        "tamanhos": tam,
    })
    print(tam)
    print(t[["mes", "capacidade_m3d", "usinas", "passo_km", "desde_2018_km", "municipio", "lon", "lat"]].to_string())
    print("reta", round(float(np.hypot(dx, dy)) / 1000, 1), "rumo", round(rumo, 1))
    print(cat.to_string())
    print(ufs_c.sort_values("d").to_string())


# ------------------------------------------------------------------ 2 o milho entra na destilaria
LIMITES_MILHO = [5, 20, 50, 80]
CORES_MILHO = ["#f1e3ad", "#e2bf5a", "#c08a2e", "#8a5a1c", "#4f3210"]
ROTULOS_MILHO = [("até 5 %", "up to 5%"), ("5 a 20 %", "5 to 20%"), ("20 a 50 %", "20 to 50%"), ("50 a 80 %", "50 to 80%"),
                 ("80 % ou mais", "80% or more")]
SEM_MILHO = "#e3e6e0"
PRODUTOS = {"CANA DE AÇÚCAR": "cana", "MELAÇO": "melaco", "MILHO": "milho", "OUTRAS MATÉRIAS - PRIMAS": "outras",
            "BAGAÇO OU PALHA DE CANA": "bagaco"}


def materia_prima() -> pd.DataFrame:
    """Toneladas processadas por UF e mês, uma coluna por matéria-prima, com a produção de etanol (m³)."""
    mp = pd.read_csv(ANP / "Etanol_MatériaPrima.csv", encoding="utf-8-sig", dtype=str)
    mp.columns = ["mes", "regiao_anp", "estado", "produto", "t"]
    mp["t"] = numero(mp["t"])
    assert set(mp["produto"]) <= set(PRODUTOS), set(mp["produto"]) - set(PRODUTOS)
    mp["produto"] = mp["produto"].map(PRODUTOS)
    w = mp.pivot_table(index=["mes", "estado"], columns="produto", values="t", aggfunc="sum").reindex(columns=list(PRODUTOS.values())).fillna(0)
    pr = pd.read_csv(ANP / "Etanol_Produção.csv", encoding="utf-8-sig", dtype=str)
    pr.columns = ["mes", "regiao_anp", "estado", "hidratado_m3", "anidro_m3"]
    for k in ("hidratado_m3", "anidro_m3"):
        pr[k] = numero(pr[k])
    x = w.join(pr.set_index(["mes", "estado"])[["hidratado_m3", "anidro_m3"]], how="outer").fillna(0).reset_index()
    x["etanol_m3"] = x["hidratado_m3"] + x["anidro_m3"]
    x["data"] = pd.to_datetime(x["mes"], format="%m/%Y")
    x["uf"] = x["estado"].map(UF)
    return x[x["data"] >= "2018-01-01"].reset_index(drop=True)


def rendimento(x: pd.DataFrame, so: str) -> dict:
    """Mediana de m³ de etanol por tonelada nos meses-UF em que `so` foi a única matéria-prima processada."""
    outras = [p for p in PRODUTOS.values() if p != so]
    k = x[(x[so] > 0) & (x[outras].sum(axis=1) == 0) & (x["etanol_m3"] > 0)]
    r = k["etanol_m3"] / k[so]
    return {"mediana": round(float(r.median()), 3), "q1": round(float(r.quantile(0.25)), 3), "q3": round(float(r.quantile(0.75)), 3),
            "n": int(len(k)), "ufs": sorted(k["uf"].unique().tolist())}


def milho() -> None:
    m = municipios()
    x = materia_prima()
    rm, rc = rendimento(x, "milho"), rendimento(x, "cana")
    fim = x["data"].max()
    doze = (x["data"] > fim - pd.DateOffset(months=12))
    rot12 = f"{mes_txt(fim - pd.DateOffset(months=11))}–{mes_txt(fim)}"
    x["periodo"] = x["data"].dt.year.astype(str)
    janelas = {str(a): x["periodo"] == str(a) for a in range(2018, fim.year)} | {"12m": doze}
    toneladas = list(PRODUTOS.values())

    def resumo(sel: pd.Series, por_uf: bool) -> pd.DataFrame:
        k = x[sel].groupby("uf" if por_uf else (lambda _: "BR"))[toneladas + ["etanol_m3"]].sum()
        k["t_total"] = k[toneladas].sum(axis=1)
        k["pct_milho_t"] = k["milho"] / k["t_total"] * 100
        k["etanol_milho_m3"] = np.minimum(k["milho"] * rm["mediana"], k["etanol_m3"])
        k["pct_milho_etanol"] = (k["etanol_milho_m3"] / k["etanol_m3"] * 100).where(k["etanol_m3"] > 0)
        return k

    br = pd.concat({p: resumo(s, False).iloc[0] for p, s in janelas.items()}, axis=1).T
    uf = {p: resumo(s, True) for p, s in janelas.items()}

    def classe(v: float, t_milho: float) -> int:
        if pd.isna(v):
            return -2  # sem produção de etanol no período
        if t_milho == 0:
            return -1  # só cana e outras
        return int(np.digitize(v, LIMITES_MILHO))

    ufs, lim = ufs_brasil(m)
    mapas = ["2018", "2022", "12m"]
    for p in mapas:
        k = uf[p]
        ufs[f"pct_milho_etanol_{p}"] = ufs["SIGLA_UF"].map(k["pct_milho_etanol"]).round(1)
        ufs[f"pct_milho_t_{p}"] = ufs["SIGLA_UF"].map(k["pct_milho_t"]).round(2)
        ufs[f"milho_t_{p}"] = ufs["SIGLA_UF"].map(k["milho"]).round(0)
        ufs[f"etanol_m3_{p}"] = ufs["SIGLA_UF"].map(k["etanol_m3"]).round(0)
        ufs[f"classe_{p}"] = [classe(v, t) for v, t in zip(ufs[f"pct_milho_etanol_{p}"], ufs[f"milho_t_{p}"].fillna(0))]

    # Destilarias nas UFs que processaram milho nos últimos 12 meses: capacidade por município em 08/2026, e se o
    # município não tinha capacidade em 12/2018. Os dados não dizem qual usina usa milho.
    c = capacidade(m)
    ufs_milho = sorted(uf["12m"].index[uf["12m"]["milho"] > 0])
    a = c[c["mes"] == INICIO].groupby("CD_MUN")["capacidade_m3d"].sum()
    b = c[(c["mes"] == FIM) & c["uf"].isin(ufs_milho)].groupby("CD_MUN").agg(cap_2026=("capacidade_m3d", "sum"), usinas_2026=("cnpj", "size"))
    b = b[b["cap_2026"] > 0].copy()  # sem a destilaria de capacidade zero (Bauru)
    b["cap_2018"] = b.index.map(a).fillna(0)
    b["estreante"] = b["cap_2018"] == 0
    b = b.reset_index().merge(m.drop(columns=["geometry", "x", "y"]), on="CD_MUN")
    pts = gpd.GeoDataFrame(b, geometry=gpd.points_from_xy(b["lon"], b["lat"]), crs=GEO).sort_values("cap_2026", ascending=False)

    regras = [(igual("classe_12m", i), ROTULOS_MILHO[i][0], preenchimento(cor, "#ffffff", 0.2)) for i, cor in enumerate(CORES_MILHO)]
    regras += [(igual("classe_12m", -1), "sem milho (cana e outras)", preenchimento(SEM_MILHO, "#ffffff", 0.2)),
               (igual("classe_12m", -2), "sem produção de etanol", preenchimento("#ffffff", "#c9ced3", 0.2))]
    estilos = {
        "ufs": [("milho_12m", f"Etanol de milho (estimado), % da produção da UF, {rot12}", estilo_regras("poligono", regras, rotulo_campo="SIGLA_UF"), True)]
        + [(f"milho_{p}", f"Etanol de milho (estimado), % da produção da UF, {p}", estilo_regras("poligono", [
            (igual(f"classe_{p}", i), r, s) for i, (_, r, s) in enumerate(regras[:5])] + [
            (igual(f"classe_{p}", -1), regras[5][1], regras[5][2]), (igual(f"classe_{p}", -2), regras[6][1], regras[6][2])],
            rotulo_campo="SIGLA_UF"), False) for p in ("2018", "2022")],
        "destilarias": [("estreante", "Capacidade por município em 08/2026, nas UFs que processam milho", estilo_regras("ponto", [
            (igual("estreante", True), "município sem capacidade em 12/2018", marcador("#1a1c1e", 2, tamanho_expr='1 + 0.08 * sqrt("cap_2026")')),
            (igual("estreante", False), "município que já tinha capacidade", marcador("#1a1c1e", 2, vazado=True, tamanho_expr='1 + 0.08 * sqrt("cap_2026")')),
        ], ordem='"cap_2026" DESC'), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    cols_uf = ["SIGLA_UF", "regiao"] + [f"{v}_{p}" for p in mapas for v in ("milho_t", "etanol_m3", "pct_milho_t", "pct_milho_etanol", "classe")]
    tam = gravar("milho", {"ufs": ufs[cols_uf + ["geometry"]], "destilarias": pts, "limite_nacional": lim}, estilos,
                 ufs[cols_uf].sort_values("SIGLA_UF"))

    def tab(p: str) -> list[dict]:
        k = uf[p][uf[p]["milho"] > 0].sort_values("etanol_milho_m3", ascending=False)
        return [{"uf": u, "milho_t": float(v.milho), "etanol_m3": float(v.etanol_m3), "pct_t": round(float(v.pct_milho_t), 2),
                 "pct_etanol": round(float(v.pct_milho_etanol), 1)} for u, v in k.iterrows()]

    gravar_cache("etanol-br-milho", {
        "fim": mes_txt(fim), "rotulo_12m": rot12,
        "rendimento_milho": rm, "rendimento_cana": rc,
        "ufs": {p: {u: classe(ufs.set_index("SIGLA_UF").at[u, f"pct_milho_etanol_{p}"], ufs.set_index("SIGLA_UF").at[u, f"milho_t_{p}"] or 0)
                    for u in ufs["SIGLA_UF"]} for p in mapas},
        "classes": [{"classe": i, "rotulo": r, "rotulo_en": en, "cor": cor} for i, ((r, en), cor) in enumerate(zip(ROTULOS_MILHO, CORES_MILHO))],
        "sem_milho": SEM_MILHO,
        "brasil": [{"periodo": p, "milho_t": float(v.milho), "cana_t": float(v.cana), "t_total": float(v.t_total),
                    "etanol_m3": float(v.etanol_m3), "etanol_milho_m3": float(v.etanol_milho_m3),
                    "pct_t": round(float(v.pct_milho_t), 2), "pct_etanol": round(float(v.pct_milho_etanol), 1)} for p, v in br.iterrows()],
        "tabela": {p: tab(p) for p in mapas},
        "ufs_milho": ufs_milho,
        "destilarias": [[bool(r.estreante), float(r.lon), float(r.lat), float(r.cap_2026)] for r in pts.itertuples()],
        "destilarias_n": int(pts["usinas_2026"].sum()), "destilarias_cap": float(pts["cap_2026"].sum()),
        "estreantes_n": int(pts["estreante"].sum()), "estreantes_cap": float(pts.loc[pts["estreante"], "cap_2026"].sum()),
        "tamanhos": tam,
    })
    print(tam, rm, rc, rot12)
    print(br[["milho", "cana", "etanol_m3", "pct_milho_t", "etanol_milho_m3", "pct_milho_etanol"]].round(1).to_string())
    for p in mapas:
        print(p, uf[p].loc[uf[p]["milho"] > 0, ["milho", "etanol_m3", "pct_milho_t", "pct_milho_etanol"]].round(1).to_string())
    print(pts.head(10)[["NM_MUN", "SIGLA_UF", "cap_2018", "cap_2026", "estreante"]].to_string())


# ------------------------------------------------------------------ 3 produzir em recuperação judicial
LIMITES_RJ = [5, 15, 30]
CORES_RJ = ["#f2dfd6", "#ddb09c", "#b8735a", "#7e3b28"]
ROTULOS_RJ = [("até 5 %", "up to 5%"), ("5 a 15 %", "5 to 15%"), ("15 a 30 %", "15 to 30%"), ("30 % ou mais", "30% or more")]
SEM_RJ = "#eef0f1"
COR_RJ = "#6b3d5c"


def recuperacao() -> None:
    m = municipios()
    c = capacidade(m)
    u = c[c["mes"] == FIM].copy()
    u = u.merge(m[["CD_MUN", "NM_MUN", "regiao", "lon", "lat"]], on="CD_MUN")
    u["raiz_cnpj"] = u["cnpj"].str[:8]
    rj = u[u["recuperacao_judicial"]]
    tot_uf = u.groupby("uf")["capacidade_m3d"].sum()
    rj_uf = rj.groupby("uf").agg(usinas=("cnpj", "size"), cap=("capacidade_m3d", "sum"), empresas=("raiz_cnpj", "nunique"))
    ufs, lim = ufs_brasil(m)
    ufs["cap_total_m3d"] = ufs["SIGLA_UF"].map(tot_uf).fillna(0)
    ufs["usinas_rj"] = ufs["SIGLA_UF"].map(rj_uf["usinas"]).fillna(0).astype(int)
    ufs["cap_rj_m3d"] = ufs["SIGLA_UF"].map(rj_uf["cap"]).fillna(0)
    ufs["pct_rj"] = (ufs["cap_rj_m3d"] / ufs["cap_total_m3d"] * 100).where(ufs["cap_total_m3d"] > 0).round(1)
    ufs["classe"] = np.where(ufs["cap_total_m3d"] == 0, -2, np.where(ufs["usinas_rj"] == 0, -1,
                             np.digitize(ufs["pct_rj"].fillna(0), LIMITES_RJ))).astype(int)

    # Uma linha por usina do último mês, no ponto do município (todas, com a marca de recuperação judicial).
    usinas = gpd.GeoDataFrame(u[["cnpj", "razao_social", "uf", "CD_MUN", "NM_MUN", "regiao", "anidro_m3d", "hidratado_m3d",
                                 "capacidade_m3d", "recuperacao_judicial"]].rename(columns={"uf": "SIGLA_UF"}),
                              geometry=gpd.points_from_xy(u["lon"], u["lat"]), crs=GEO).sort_values("capacidade_m3d", ascending=False)

    # Série mensal: usinas e capacidade com a marca, e o fluxo entre 12/2018 e o último mês, por CNPJ.
    serie = c.groupby("data").apply(lambda d: pd.Series({
        "usinas": int(d["recuperacao_judicial"].sum()), "cap": float(d.loc[d["recuperacao_judicial"], "capacidade_m3d"].sum()),
        "total": float(d["capacidade_m3d"].sum()), "n": int(len(d))}), include_groups=False)
    serie["pct"] = serie["cap"] / serie["total"] * 100
    a = c[c["mes"] == INICIO].set_index("cnpj")
    b = u.set_index("cnpj")
    rj18 = set(a.index[a["recuperacao_judicial"]])
    rj26 = set(b.index[b["recuperacao_judicial"]])
    # Saiu do registro, mas no mesmo município aparece um CNPJ que não existia em 12/2018, com a mesma capacidade:
    # provável troca de titular (venda, arrendamento), não fechamento.
    novos = b[~b.index.isin(a.index)]
    troca = {k for k in rj18 - set(b.index)
             if ((novos["CD_MUN"] == a.at[k, "CD_MUN"]) & (novos["capacidade_m3d"] == a.at[k, "capacidade_m3d"])).any()}
    fluxo = {
        "sairam_trocaram_cnpj": len(troca),
        "rj_2018": len(rj18),
        "continuam": len(rj18 & rj26),
        "sairam_da_marca": len({k for k in rj18 if k in b.index and not b.at[k, "recuperacao_judicial"]}),
        "sairam_do_registro": len(rj18 - set(b.index)),
        "rj_2026": len(rj26),
        "entraram": len(rj26 - rj18),
        "entraram_ja_registradas": len({k for k in rj26 - rj18 if k in a.index}),
        "cap_continuam": float(b.loc[list(rj18 & rj26), "capacidade_m3d"].sum()),
        "cap_sairam_do_registro_2018": float(a.loc[list(rj18 - set(b.index)), "capacidade_m3d"].sum()),
    }
    # Quantos meses cada usina de hoje já aparece com a marca (desde 01/2018, quando começa o painel).
    meses_rj = c[c["recuperacao_judicial"] & c["cnpj"].isin(rj26)].groupby("cnpj")["mes"].nunique()
    desde_inicio = int((c[(c["mes"] == "01/2018") & c["recuperacao_judicial"]]["cnpj"].isin(rj26)).sum())

    ufs_reg = ufs.copy()
    regras_uf = [(igual("classe", i), f"{ROTULOS_RJ[i][0]} da capacidade da UF", preenchimento(cor, "#ffffff", 0.2)) for i, cor in enumerate(CORES_RJ)]
    regras_uf += [(igual("classe", -1), "nenhuma usina em recuperação judicial", preenchimento(SEM_RJ, "#ffffff", 0.2)),
                  (igual("classe", -2), "sem destilaria de etanol", preenchimento("#ffffff", "#c9ced3", 0.2))]
    estilos = {
        "usinas": [("recuperacao", "Destilarias em 08/2026: em recuperação judicial ou não", estilo_regras("ponto", [
            (igual("recuperacao_judicial", True), "nome com «em recuperação judicial»", marcador(COR_RJ, 2, tamanho_expr='1 + 0.1 * sqrt("capacidade_m3d")')),
            (igual("recuperacao_judicial", False), "demais destilarias", marcador("#9aa3ab", 1.2, alfa=0.6)),
        ], ordem='"capacidade_m3d" DESC'), True)],
        "ufs": [("pct_rj", "Capacidade em recuperação judicial, % da UF", estilo_regras("poligono", regras_uf, rotulo_campo="SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    tam = gravar("recuperacao", {"usinas": usinas, "ufs": ufs_reg, "limite_nacional": lim}, estilos, usinas.drop(columns="geometry"))

    mun = rj.groupby("CD_MUN").agg(cap=("capacidade_m3d", "sum"), n=("cnpj", "size"), lon=("lon", "first"), lat=("lat", "first"),
                                   nome=("NM_MUN", "first"), uf=("uf", "first")).sort_values("cap", ascending=False)
    outras = u[~u["recuperacao_judicial"]].groupby("CD_MUN").agg(cap=("capacidade_m3d", "sum"), lon=("lon", "first"), lat=("lat", "first"))
    regiao = u.groupby("regiao").apply(lambda d: pd.Series({"cap": float(d["capacidade_m3d"].sum()),
                                                             "rj": float(d.loc[d["recuperacao_judicial"], "capacidade_m3d"].sum()),
                                                             "usinas_rj": int(d["recuperacao_judicial"].sum())}), include_groups=False)
    tam_rj = rj["capacidade_m3d"]
    gravar_cache("etanol-br-recuperacao", {
        "fim": FIM, "inicio": INICIO,
        "usinas": int(len(u)), "cap_total": float(u["capacidade_m3d"].sum()),
        "usinas_rj": int(len(rj)), "cap_rj": float(tam_rj.sum()), "empresas_rj": int(rj["raiz_cnpj"].nunique()),
        "empresas": int(u["raiz_cnpj"].nunique()),
        "media_rj": float(tam_rj.mean()), "media_outras": float(u.loc[~u["recuperacao_judicial"], "capacidade_m3d"].mean()),
        "maior_grupo_usinas": int(rj.groupby("raiz_cnpj").size().max()),
        "municipios_rj": int(rj["CD_MUN"].nunique()),
        "pontos_rj": [[float(r.lon), float(r.lat), float(r.cap), int(r.n)] for r in mun.itertuples()],
        "pontos_outras": [[float(r.lon), float(r.lat), float(r.cap)] for r in outras.itertuples()],
        "ufs": [{"uf": k, "usinas_rj": int(v.usinas_rj), "cap_rj": float(v.cap_rj_m3d), "cap": float(v.cap_total_m3d),
                 "pct": None if pd.isna(v.pct_rj) else float(v.pct_rj), "classe": int(v.classe)}
                for k, v in ufs.set_index("SIGLA_UF").sort_values("cap_rj_m3d", ascending=False).iterrows()],
        "empresas_por_uf": {k: int(v) for k, v in rj_uf["empresas"].items()},
        "classes": [{"classe": i, "rotulo": r, "rotulo_en": en, "cor": cor} for i, ((r, en), cor) in enumerate(zip(ROTULOS_RJ, CORES_RJ))],
        "sem_rj": SEM_RJ, "cor_rj": COR_RJ,
        "serie": [{"mes": mes_txt(d), "usinas": int(v.usinas), "cap": float(v.cap), "total": float(v.total), "pct": round(float(v.pct), 2)}
                  for d, v in serie.iterrows()],
        "fluxo": fluxo,
        "desde_jan2018": desde_inicio, "meses_rj_mediana": float(meses_rj.median()),
        "regioes": [{"regiao": k, "cap": v.cap, "rj": v.rj, "usinas_rj": int(v.usinas_rj)} for k, v in regiao.iterrows()],
        "tamanhos": tam,
    })
    print(tam)
    print(len(u), len(rj), round(tam_rj.sum()), round(u["capacidade_m3d"].sum()), rj["raiz_cnpj"].nunique(), json.dumps(fluxo))
    print("desde 01/2018:", desde_inicio, "meses mediana", meses_rj.median())
    print(ufs.loc[ufs["usinas_rj"] > 0, ["SIGLA_UF", "usinas_rj", "cap_rj_m3d", "cap_total_m3d", "pct_rj", "classe"]].sort_values("cap_rj_m3d", ascending=False).to_string())
    print(serie.iloc[[0, 11, 23, 35, 47, 59, 71, 83, 95, -1]].round(2).to_string())
    print(regiao.to_string())


if __name__ == "__main__":
    temas = {"endereco": endereco, "milho": milho, "recuperacao": recuperacao}
    ap = argparse.ArgumentParser()
    ap.add_argument("tema", choices=list(temas))
    temas[ap.parse_args().tema]()
