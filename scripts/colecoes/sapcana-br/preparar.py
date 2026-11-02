"""
Coleção «A safra de cada estado» (Brasil) — prepara os dados de uma prancha (uso interno).

    .venv-geo/Scripts/python scripts/colecoes/sapcana-br/preparar.py safras|acucar|calendario

Entrada: scripts/colecoes/cache/sapcana-br-acumulado.csv, gerado por converter_xls.py a partir dos relatórios
mensais do SAPCana (MAPA, «Acompanhamento da produção sucroalcooleira») em dados-brutos/mapa-sapcana/.
Cada relatório traz, por UF, o acumulado da safra (01/04 até o fim do mês anterior) de cana moída, açúcar e
etanol anidro e hidratado. O MAPA publica esses números por UF, não por usina.

Saídas: mapas/<pasta>/dados/<base>.gpkg.zip (com estilos do QGIS), <base>.csv
e scripts/colecoes/cache/sapcana-br-<tema>.json (para a prancha e a ficha).
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import geopandas as gpd
import numpy as np
import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from comum import (  # noqa: E402
    AREA_BR, GEO, RAIZ, TINTA, estilo_contorno, estilo_regras, gravar_cache, gravar_estilos, igual, marcador, zipar,
)
from estilos import preenchimento  # noqa: E402

SERIE = {s["tema"]: s for s in json.loads((Path(__file__).parent / "serie.json").read_text(encoding="utf-8"))}
MALHA_BR = RAIZ / "scripts" / "estados" / "cache" / "brasil_0_004.gpkg"
ACUMULADO = RAIZ / "scripts" / "colecoes" / "cache" / "sapcana-br-acumulado.csv"
REGIOES = {"1": "Norte", "2": "Nordeste", "3": "Sudeste", "4": "Sul", "5": "Centro-Oeste"}
SAFRAS = ["2023/2024", "2024/2025", "2025/2026"]
ROT = {"2023/2024": "2023/24", "2024/2025": "2024/25", "2025/2026": "2025/26"}
VARS = ["cana_t", "acucar_t", "etanol_m3", "anidro_m3", "hidratado_m3"]
# Litoral do Nordeste: as UFs cuja safra vai de setembro a agosto (nota do próprio relatório; a Bahia tem os dois calendários).
LITORAL_NE = ["AL", "PE", "PB", "RN", "SE"]


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


def ufs_brasil() -> tuple[gpd.GeoDataFrame, gpd.GeoDataFrame]:
    """As 27 UFs (com região e um ponto interno) e o limite do país, da malha simplificada da série dos estados."""
    m = gpd.read_file(MALHA_BR, engine="pyogrio").set_crs(GEO, allow_override=True)
    m = m[m["CD_MUN"].str.match(r"^\d{7}$") & m["CD_RGINT"].notna()][["CD_MUN", "SIGLA_UF", "geometry"]]
    m["regiao"] = m["CD_MUN"].str[0].map(REGIOES)
    ufs = m.dissolve(by=["SIGLA_UF", "regiao"], as_index=False)[["SIGLA_UF", "regiao", "geometry"]]
    pos = ufs.geometry.to_crs(AREA_BR).representative_point().to_crs(GEO)
    ufs["lon"], ufs["lat"] = pos.x.round(4), pos.y.round(4)
    lim = m.assign(pais="Brasil").dissolve(by="pais", as_index=False)[["pais", "geometry"]]
    assert len(ufs) == 27
    return ufs.reset_index(drop=True), lim


def acumulado() -> pd.DataFrame:
    d = pd.read_csv(ACUMULADO, dtype={"uf": str})
    d["fim"] = pd.to_datetime(d["fim"])
    assert (pd.to_datetime(d["inicio"]).dt.strftime("%m-%d") == "04-01").all()
    assert d.groupby("uf").size().eq(36).all()
    return d.sort_values(["uf", "fim"]).reset_index(drop=True)


def safras(d: pd.DataFrame) -> pd.DataFrame:
    """Fechamento de cada safra (relatório com período final em 31/03): UF × safra."""
    f = d[d["fim"].dt.month == 3]
    assert len(f) == d["uf"].nunique() * 3
    return f.set_index(["uf", "safra"])[VARS]


def mensal(d: pd.DataFrame) -> pd.DataFrame:
    """Moagem de cada mês = acumulado do mês menos o do mês anterior, na mesma safra. As poucas revisões
    para baixo (diferença negativa) viram zero; o total da safra continua o do fechamento."""
    d = d.copy()
    for v in VARS:
        d[f"m_{v}"] = d.groupby(["uf", "safra"])[v].diff().fillna(d[v])
    d["mes"] = d["fim"].dt.to_period("M").dt.to_timestamp()
    return d


def pct(a: float, b: float) -> float:
    return (a / b - 1) * 100


# ------------------------------------------------------------------ 1 três safras, menos cana
CATEGORIAS = [
    ("subiu", "cresceu mais de 2 %", "grew by over 2%", "#5f7f3a"),
    ("igual", "ficou entre −2 e +2 %", "within ±2%", "#b8bd9e"),
    ("caiu", "caiu de 2 a 10 %", "fell by 2 to 10%", "#d29a5c"),
    ("despencou", "caiu mais de 10 %", "fell by over 10%", "#9c4a32"),
]


def cat_variacao(v: float) -> str:
    return "subiu" if v > 2 else "igual" if v >= -2 else "caiu" if v >= -10 else "despencou"


def tema_safras() -> None:
    d = acumulado()
    f = safras(d)
    ufs, lim = ufs_brasil()
    cana = f["cana_t"].unstack("safra")[SAFRAS]
    tem = cana.index[cana.sum(axis=1) > 0]
    t = pd.DataFrame({f"cana_{ROT[s][:4]}_{ROT[s][5:]}": cana[s] for s in SAFRAS})
    t.columns = ["cana_2023_24", "cana_2024_25", "cana_2025_26"]
    t["variacao_t"] = t["cana_2025_26"] - t["cana_2023_24"]
    t["variacao_pct"] = np.where(t["cana_2023_24"] > 0, (t["cana_2025_26"] / t["cana_2023_24"] - 1) * 100, np.nan)
    t = t.loc[tem]
    t["categoria"] = t["variacao_pct"].map(cat_variacao)
    br = cana.sum()
    t["parte_perda_pct"] = t["variacao_t"] / (br[SAFRAS[2]] - br[SAFRAS[0]]) * 100

    u = ufs.merge(t, left_on="SIGLA_UF", right_index=True, how="left")
    for c in ["cana_2023_24", "cana_2024_25", "cana_2025_26", "variacao_t"]:
        u[c] = u[c].fillna(0).round(0)
    u["categoria"] = u["categoria"].fillna("sem_cana")
    pts = gpd.GeoDataFrame(u.loc[u["SIGLA_UF"].isin(tem)].drop(columns="geometry"),
                           geometry=gpd.points_from_xy(u.loc[u["SIGLA_UF"].isin(tem), "lon"], u.loc[u["SIGLA_UF"].isin(tem), "lat"]), crs=GEO)
    cols = ["SIGLA_UF", "regiao", "cana_2023_24", "cana_2024_25", "cana_2025_26", "variacao_t", "variacao_pct", "parte_perda_pct",
            "categoria", "lon", "lat"]
    pts["variacao_pct"] = pts["variacao_pct"].round(2)
    pts["parte_perda_pct"] = pts["parte_perda_pct"].round(2)
    pts = pts[cols + ["geometry"]].sort_values("cana_2025_26", ascending=False).reset_index(drop=True)

    regras = [(igual("categoria", k), r, marcador(cor, 2.4, tamanho_expr='1 + 0.0012 * sqrt("cana_2025_26")')) for k, r, _, cor in CATEGORIAS]
    estilos = {
        "moagem_uf": [("variacao", "Cana moída por UF, 2025/26 (círculo), cor pela variação desde 2023/24",
                       estilo_regras("ponto", regras, ordem='"cana_2025_26" DESC', rotulo_campo="SIGLA_UF"), True)],
        "ufs": [("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    tam = gravar("safras", {"moagem_uf": pts, "ufs": u[["SIGLA_UF", "regiao", "cana_2023_24", "cana_2024_25", "cana_2025_26",
                                                        "variacao_t", "categoria", "geometry"]], "limite_nacional": lim},
                 estilos, pts.drop(columns="geometry"))

    # Curva acumulada nacional, mês a mês, em cada safra.
    curva = d.groupby(["safra", "fim"])["cana_t"].sum().reset_index()
    curvas = {ROT[s]: [float(v) for v in curva.loc[curva["safra"] == s, "cana_t"]] for s in SAFRAS}
    # Até que mês 2025/26 andava à frente ou atrás de 2023/24 (diferença acumulada).
    dif = [b - a for a, b in zip(curvas["2023/24"], curvas["2025/26"])]
    cat = pts.groupby("categoria").agg(n=("SIGLA_UF", "size"), d=("variacao_t", "sum")).reindex([k for k, *_ in CATEGORIAS]).fillna(0)
    ac = f["acucar_t"].unstack("safra")[SAFRAS].sum()
    et = f["etanol_m3"].unstack("safra")[SAFRAS].sum()
    gravar_cache("sapcana-br-safras", {
        "safras": [ROT[s] for s in SAFRAS],
        "br": {ROT[s]: float(br[s]) for s in SAFRAS},
        "acucar": {ROT[s]: float(ac[s]) for s in SAFRAS},
        "etanol": {ROT[s]: float(et[s]) for s in SAFRAS},
        "ufs": [{"uf": r.SIGLA_UF, "regiao": r.regiao, "lon": float(r.lon), "lat": float(r.lat), "c23": float(r.cana_2023_24),
                 "c24": float(r.cana_2024_25), "c25": float(r.cana_2025_26), "d": float(r.variacao_t),
                 "p": None if pd.isna(r.variacao_pct) else float(r.variacao_pct), "cat": r.categoria}
                for r in pts.itertuples()],
        "categorias": [{"chave": k, "rotulo": r, "rotulo_en": en, "cor": cor, "ufs": int(cat.at[k, "n"]), "d": float(cat.at[k, "d"])}
                       for k, r, en, cor in CATEGORIAS],
        "curvas": curvas, "dif_acumulada": dif,
        "meses": [m.strftime("%m") for m in curva.loc[curva["safra"] == SAFRAS[0], "fim"]],
        "tamanhos": tam,
    })
    print(tam)
    print(pts.drop(columns="geometry").to_string())
    print("BR", {k: round(v / 1e6, 2) for k, v in br.items()}, "Δ", round((br[SAFRAS[2]] - br[SAFRAS[0]]) / 1e6, 2),
          round(pct(br[SAFRAS[2]], br[SAFRAS[0]]), 2))
    print("açúcar", (ac / 1e6).round(2).to_dict(), "etanol", (et / 1e6).round(2).to_dict())
    print(cat)
    print("dif acumulada (Mt)", [round(x / 1e6, 1) for x in dif])


# ------------------------------------------------------------------ 2 açúcar ou etanol
LIMITES_KG = [30, 50, 70]  # kg de açúcar por tonelada de cana; 0 é classe própria
CORES_KG = ["#e8e2d0", "#e9cf9b", "#d4a55a", "#a8712c", "#6b4415"]
ROTULOS_KG = [("nenhum açúcar", "no sugar"), ("até 30 kg", "up to 30 kg"), ("30 a 50 kg", "30 to 50 kg"), ("50 a 70 kg", "50 to 70 kg"),
              ("70 kg ou mais", "70 kg or more")]
SEM_CANA = "#ffffff"
# Rendimento teórico máximo da cana em etanol: ~ 90 L/t (ATR de ~ 150 kg/t, todo em etanol hidratado a 1,6913 kg/L).
TETO_ETANOL_CANA = 90


def classe_kg(v: float) -> int:
    return 0 if v == 0 else 1 + int(np.digitize(v, LIMITES_KG))


def tema_acucar() -> None:
    d = acumulado()
    f = safras(d)
    ufs, lim = ufs_brasil()
    w = {v: f[v].unstack("safra")[SAFRAS] for v in VARS}
    tem = w["cana_t"].index[w["cana_t"][SAFRAS[2]] > 0]
    t = pd.DataFrame(index=tem)
    for s in (SAFRAS[0], SAFRAS[2]):
        k = ROT[s].replace("/", "_")
        t[f"cana_{k}"] = w["cana_t"].loc[tem, s]
        t[f"acucar_{k}"] = w["acucar_t"].loc[tem, s]
        t[f"etanol_{k}"] = w["etanol_m3"].loc[tem, s]
        t[f"kg_acucar_t_{k}"] = (t[f"acucar_{k}"] / t[f"cana_{k}"] * 1000).round(1)
        t[f"l_etanol_t_{k}"] = (t[f"etanol_{k}"] / t[f"cana_{k}"] * 1000).round(1)
    t["parte_acucar_br_pct"] = (t["acucar_2025_26"] / w["acucar_t"][SAFRAS[2]].sum() * 100).round(2)
    t["parte_cana_br_pct"] = (t["cana_2025_26"] / w["cana_t"][SAFRAS[2]].sum() * 100).round(2)
    t["etanol_alem_da_cana"] = t["l_etanol_t_2025_26"] > TETO_ETANOL_CANA
    t["classe"] = t["kg_acucar_t_2025_26"].map(classe_kg).astype(int)

    u = ufs.merge(t, left_on="SIGLA_UF", right_index=True, how="left")
    u["classe"] = u["classe"].fillna(-1).astype(int)
    u["etanol_alem_da_cana"] = u["etanol_alem_da_cana"].astype("boolean").fillna(False).astype(bool)
    regras = [(igual("classe", i), ROTULOS_KG[i][0], preenchimento(cor, "#ffffff", 0.2)) for i, cor in enumerate(CORES_KG)]
    regras.append((igual("classe", -1), "sem cana moída", preenchimento(SEM_CANA, "#c9ced3", 0.2)))
    estilos = {
        "ufs": [("acucar", "Açúcar por tonelada de cana moída, 2025/26 (kg/t)",
                 estilo_regras("poligono", regras, rotulo_campo="SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    cols = ["SIGLA_UF", "regiao"] + list(t.columns)
    csv = u.loc[u["SIGLA_UF"].isin(tem), cols].sort_values("cana_2025_26", ascending=False)
    tam = gravar("acucar", {"ufs": u[cols + ["geometry"]], "limite_nacional": lim}, estilos, csv)

    br = {ROT[s]: {v: float(w[v][s].sum()) for v in VARS} for s in SAFRAS}
    gravar_cache("sapcana-br-acucar", {
        "classes": [{"classe": i, "rotulo": r, "rotulo_en": en, "cor": cor} for i, ((r, en), cor) in enumerate(zip(ROTULOS_KG, CORES_KG))],
        "sem_cana": SEM_CANA, "teto": TETO_ETANOL_CANA,
        "classe_uf": {r.SIGLA_UF: int(r.classe) for r in u.itertuples()},
        "ufs": [{"uf": k, "lon": float(ufs.set_index("SIGLA_UF").at[k, "lon"]), "lat": float(ufs.set_index("SIGLA_UF").at[k, "lat"]),
                 "cana": float(r.cana_2025_26), "acucar": float(r.acucar_2025_26), "etanol": float(r.etanol_2025_26),
                 "kg23": float(r.kg_acucar_t_2023_24), "kg25": float(r.kg_acucar_t_2025_26),
                 "l23": float(r.l_etanol_t_2023_24), "l25": float(r.l_etanol_t_2025_26), "alem": bool(r.etanol_alem_da_cana),
                 "classe": int(r.classe)}
                for k, r in t.sort_values("cana_2025_26", ascending=False).iterrows()],
        "br": br,
        "tamanhos": tam,
    })
    print(tam)
    print(csv.to_string())
    for s, b in br.items():
        print(s, {k: round(v / 1e6, 2) for k, v in b.items()}, "kg/t", round(b["acucar_t"] / b["cana_t"] * 1000, 1),
              "L/t", round(b["etanol_m3"] / b["cana_t"] * 1000, 1))


# ------------------------------------------------------------------ 3 o ano inteiro moendo
MESES_SAFRA = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3]
FORA = [10, 11, 12, 1, 2, 3]  # outubro a março: a entressafra do Centro-Sul
LIMITES_FORA = [25, 50, 75]
CORES_FORA = ["#dfe6d3", "#a9bd8c", "#d9b77a", "#a8692e"]
ROTULOS_FORA = [("menos de 25 %", "under 25%"), ("25 a 50 %", "25 to 50%"), ("50 a 75 %", "50 to 75%"), ("75 % ou mais", "75% or more")]


def tema_calendario() -> None:
    d = mensal(acumulado())
    ufs, lim = ufs_brasil()
    neg = d[d["m_cana_t"] < 0]
    print("revisões para baixo na cana (zeradas):", neg[["uf", "mes", "m_cana_t"]].to_dict("records"))
    d["m_cana_t"] = d["m_cana_t"].clip(lower=0)
    tem = d.groupby("uf")["cana_t"].max()
    tem = tem.index[tem > 0]
    d = d[d["uf"].isin(tem)]
    d["mes_cal"] = d["mes"].dt.month
    prof = d.groupby(["uf", "mes_cal"])["m_cana_t"].sum().unstack().reindex(columns=MESES_SAFRA).fillna(0)
    tot = prof.sum(axis=1)
    sh = prof.div(tot, axis=0) * 100
    t = pd.DataFrame(index=tem)
    t["cana_3_safras"] = tot.round(0)
    t["fora_pct"] = sh[FORA].sum(axis=1).round(1)
    t["mes_pico"] = sh.idxmax(axis=1).astype(int)
    t["pico_pct"] = sh.max(axis=1).round(1)
    # Meses com ao menos 5 % da moagem do ano: a «janela» de cada UF.
    t["meses_ativos"] = (sh >= 5).sum(axis=1).astype(int)
    for m in MESES_SAFRA:
        t[f"m{m:02d}_pct"] = sh[m].round(2)
    t["classe"] = np.digitize(t["fora_pct"], LIMITES_FORA).astype(int)

    # O país mês a mês: quanto da moagem veio do litoral do Nordeste.
    d["grupo"] = np.where(d["uf"].isin(LITORAL_NE), "litoral_ne", "resto")
    mm = d.pivot_table(index="mes", columns="grupo", values="m_cana_t", aggfunc="sum").fillna(0)
    mm["br"] = mm.sum(axis=1)
    mm["ne_pct"] = mm["litoral_ne"] / mm["br"] * 100
    cal = d.assign(g=d["grupo"]).groupby(["mes_cal", "g"])["m_cana_t"].sum().unstack().reindex(MESES_SAFRA)
    cal["ne_pct"] = cal["litoral_ne"] / cal.sum(axis=1) * 100
    jf = cal.loc[[1, 2]]
    jf_pct = float(jf["litoral_ne"].sum() / jf[["litoral_ne", "resto"]].sum().sum() * 100)
    dm = cal.loc[[12, 1, 2, 3]]
    dm_pct = float(dm["litoral_ne"].sum() / dm[["litoral_ne", "resto"]].sum().sum() * 100)
    ne_ano = float(cal["litoral_ne"].sum() / cal[["litoral_ne", "resto"]].sum().sum() * 100)

    u = ufs.merge(t, left_on="SIGLA_UF", right_index=True, how="left")
    u["classe"] = u["classe"].fillna(-1).astype(int)
    regras = [(igual("classe", i), ROTULOS_FORA[i][0], preenchimento(cor, "#ffffff", 0.2)) for i, cor in enumerate(CORES_FORA)]
    regras.append((igual("classe", -1), "sem cana moída", preenchimento(SEM_CANA, "#c9ced3", 0.2)))
    estilos = {
        "ufs": [("fora", "Parte da moagem feita de outubro a março (safras 2023/24 a 2025/26)",
                 estilo_regras("poligono", regras, rotulo_campo="SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    cols = ["SIGLA_UF", "regiao"] + list(t.columns)
    longa = d[["uf", "mes", "safra", "m_cana_t", "m_acucar_t", "m_etanol_m3"]].rename(
        columns={"m_cana_t": "cana_t", "m_acucar_t": "acucar_t", "m_etanol_m3": "etanol_m3"})
    longa["mes"] = longa["mes"].dt.strftime("%Y-%m")
    tam = gravar("calendario", {"ufs": u[cols + ["geometry"]], "limite_nacional": lim}, estilos,
                 longa.sort_values(["uf", "mes"]))

    ordem = t.assign(c=(sh[FORA].sum(axis=1))).sort_values(["c"]).index.tolist()
    gravar_cache("sapcana-br-calendario", {
        "classes": [{"classe": i, "rotulo": r, "rotulo_en": en, "cor": cor} for i, ((r, en), cor) in enumerate(zip(ROTULOS_FORA, CORES_FORA))],
        "sem_cana": SEM_CANA, "classe_uf": {r.SIGLA_UF: int(r.classe) for r in u.itertuples()},
        "meses": MESES_SAFRA, "litoral_ne": LITORAL_NE,
        "ufs": [{"uf": k, "lon": float(ufs.set_index("SIGLA_UF").at[k, "lon"]), "lat": float(ufs.set_index("SIGLA_UF").at[k, "lat"]),
                 "cana": float(t.at[k, "cana_3_safras"]), "fora": float(t.at[k, "fora_pct"]), "pico": int(t.at[k, "mes_pico"]),
                 "pico_pct": float(t.at[k, "pico_pct"]), "perfil": [round(float(sh.at[k, m]), 2) for m in MESES_SAFRA]} for k in ordem],
        "serie": [{"mes": i.strftime("%Y-%m"), "br": float(r.br), "ne": float(r.litoral_ne)} for i, r in mm.iterrows()],
        "cal_ne_pct": [round(float(cal.at[m, "ne_pct"]), 2) for m in MESES_SAFRA],
        "cal_br": [float(cal.loc[m, ["litoral_ne", "resto"]].sum()) for m in MESES_SAFRA],
        "jan_fev_ne_pct": round(jf_pct, 2), "dez_mar_ne_pct": round(dm_pct, 2), "ne_ano_pct": round(ne_ano, 2),
        "min_mes": {"mes": mm["br"].idxmin().strftime("%Y-%m"), "t": float(mm["br"].min())},
        "max_mes": {"mes": mm["br"].idxmax().strftime("%Y-%m"), "t": float(mm["br"].max())},
        "tamanhos": tam,
    })
    print(tam)
    print(t.drop(columns=[f"m{m:02d}_pct" for m in MESES_SAFRA]).sort_values("fora_pct").to_string())
    print(cal.round(0).to_string())
    print("jan-fev NE %", round(jf_pct, 1), "dez-mar", round(dm_pct, 1), "ano", round(ne_ano, 1))
    print((mm[["br", "litoral_ne", "ne_pct"]] / [1e6, 1e6, 1]).round(2).to_string())


if __name__ == "__main__":
    temas = {"safras": tema_safras, "acucar": tema_acucar, "calendario": tema_calendario}
    ap = argparse.ArgumentParser()
    ap.add_argument("tema", choices=list(temas))
    temas[ap.parse_args().tema]()
