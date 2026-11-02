"""
Coleção «Quarenta anos de biomassa» (Brasil) — prepara os dados de uma prancha (uso interno).

    .venv-geo/Scripts/python -I -X utf8 scripts/colecoes/quarenta-anos-de-biomassa-br/preparar.py chegada|rumo|monocultura < /dev/null

Entrada: scripts/colecoes/cache/quarenta-anos-de-biomassa-br-cobertura.csv.gz (extrair.py), a área de cada classe
do MapBiomas (coleção 11) por município e ano, 1985–2025, em hectares, com os biomas somados.
Saídas: mapas/<pasta>/dados/<base>.gpkg.zip (com estilos do QGIS), <base>.csv
e scripts/colecoes/cache/quarenta-anos-de-biomassa-br-<tema>.json (para a prancha e a ficha).
"""

from __future__ import annotations

import argparse
import json
import math
import sys
from pathlib import Path

import geopandas as gpd
import numpy as np
import pandas as pd
from shapely.geometry import LineString, Point

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from comum import (  # noqa: E402
    AREA_BR, GEO, RAIZ, TINTA, estilo_contorno, estilo_regras, gravar_cache, gravar_estilos, igual, linha, marcador,
    para_d3, zipar,
)
from estilos import preenchimento  # noqa: E402

SERIE = {s["tema"]: s for s in json.loads((Path(__file__).parent / "serie.json").read_text(encoding="utf-8"))}
MALHA_BR = RAIZ / "scripts" / "estados" / "cache" / "brasil_0_004.gpkg"
COBERTURA = RAIZ / "scripts" / "colecoes" / "cache" / "quarenta-anos-de-biomassa-br-cobertura.csv.gz"
REGIOES = {"1": "Norte", "2": "Nordeste", "3": "Sudeste", "4": "Sul", "5": "Centro-Oeste"}
REGIAO_EN = {"Norte": "North", "Nordeste": "Northeast", "Sudeste": "Southeast", "Sul": "South", "Centro-Oeste": "Centre-West"}
ORDEM_REG = ["Sul", "Sudeste", "Centro-Oeste", "Nordeste", "Norte"]
ANOS = list(range(1985, 2026))
Y = [f"y{a}" for a in ANOS]
# Classes do MapBiomas (coleção 11) usadas na coleção.
CLASSES = {20: "cana", 39: "soja", 41: "outras_temporarias", 9: "silvicultura", 15: "pastagem", 3: "floresta", 21: "mosaico"}


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


def municipios() -> gpd.GeoDataFrame:
    """Municípios da malha simplificada da série dos estados (2025), com UF, região e um ponto interno."""
    m = gpd.read_file(MALHA_BR, engine="pyogrio").set_crs(GEO, allow_override=True)
    m = m[m["CD_MUN"].str.match(r"^\d{7}$") & m["CD_RGINT"].notna()][["CD_MUN", "NM_MUN", "SIGLA_UF", "geometry"]]
    m["regiao"] = m["CD_MUN"].str[0].map(REGIOES)
    pos = m.geometry.to_crs(AREA_BR).representative_point().to_crs(GEO)
    m["lon"], m["lat"] = pos.x.round(3), pos.y.round(3)
    return m.sort_values("CD_MUN").reset_index(drop=True)


def ufs_brasil(m: gpd.GeoDataFrame) -> tuple[gpd.GeoDataFrame, gpd.GeoDataFrame]:
    ufs = m.dissolve(by=["SIGLA_UF", "regiao"], as_index=False)[["SIGLA_UF", "regiao", "geometry"]]
    lim = m.assign(pais="Brasil").dissolve(by="pais", as_index=False)[["pais", "geometry"]]
    return ufs, lim


def cobertura(m: gpd.GeoDataFrame) -> tuple[pd.DataFrame, dict[str, pd.DataFrame]]:
    """Área total do município (todas as classes) e área de cada classe de interesse, em ha, por ano."""
    c = pd.read_csv(COBERTURA, dtype={"geocode": str})
    # As duas lagoas do RS (4300001, 4300002) não são municípios; Fernando de Noronha (2605459) não tem estatística.
    c = c[c["geocode"].isin(m["CD_MUN"])]
    area = c.groupby("geocode")[Y].sum().reindex(m["CD_MUN"])
    cl = {n: c[c["class"] == k].set_index("geocode")[Y].reindex(m["CD_MUN"]).fillna(0) for k, n in CLASSES.items()}
    return area, cl


def mha(v) -> float:
    return round(float(v) / 1e6, 2)


def pct(a, b) -> float:
    return round(float(a) / float(b) * 100, 1) if b else 0.0


def cidade(r) -> dict:
    return {"cd": r.CD_MUN, "nome": r.NM_MUN, "uf": r.SIGLA_UF, "coord": [float(r.lon), float(r.lat)]}


# ------------------------------------------------------------------ 171 o ano em que a soja chegou
LIMIAR_SOJA = 5.0  # % da área do município
PERIODOS = [  # (chave, primeiro ano, último ano, rótulo, rótulo EN, cor)
    (0, 1985, 1985, "já havia em 1985", "already there in 1985", "#3b2a14"),
    (1, 1986, 1995, "1986 a 1995", "1986 to 1995", "#7a4e1d"),
    (2, 1996, 2005, "1996 a 2005", "1996 to 2005", "#b5762a"),
    (3, 2006, 2015, "2006 a 2015", "2006 to 2015", "#dca543"),
    (4, 2016, 2025, "2016 a 2025", "2016 to 2025", "#f3d77a"),
]
SEM_SOJA = "#f1f2f3"


def chegada_ano(share: pd.DataFrame, limiar: float) -> pd.Series:
    """Primeiro ano em que a classe passa do limiar e fica acima dele por três anos seguidos (ou até 2025)."""
    v = share.values >= limiar
    ok = v.copy()
    ok[:, :-2] = v[:, :-2] & v[:, 1:-1] & v[:, 2:]
    ok[:, -2] = v[:, -2] & v[:, -1]
    ano = np.where(ok.any(axis=1), ok.argmax(axis=1) + ANOS[0], 0)
    return pd.Series(ano, index=share.index)


def chegada() -> None:
    m = municipios()
    area, cl = cobertura(m)
    soja = cl["soja"]
    share = soja.div(area, axis=0) * 100
    g = m.copy()
    g["area_ha"] = area["y2025"].values.round(0)
    g["soja_1985_ha"] = soja["y1985"].values.round(0)
    g["soja_2025_ha"] = soja["y2025"].values.round(0)
    g["soja_1985_pct"] = share["y1985"].values.round(2)
    g["soja_2025_pct"] = share["y2025"].values.round(2)
    g["soja_max_pct"] = share.max(axis=1).values.round(2)
    g["ano_chegada"] = chegada_ano(share.fillna(0), LIMIAR_SOJA).values
    g.loc[area["y2025"].isna().values, "ano_chegada"] = -1
    g["periodo"] = -1
    for k, a0, a1, *_ in PERIODOS:
        g.loc[(g["ano_chegada"] >= a0) & (g["ano_chegada"] <= a1), "periodo"] = k
    g["abaixo_em_2025"] = (g["periodo"] >= 0) & (g["soja_2025_pct"] < LIMIAR_SOJA)
    g["faixa"] = g["periodo"].map({k: r for k, _, _, r, *_ in PERIODOS}).fillna("sem soja acima de 5 %")
    g.loc[g["ano_chegada"] == -1, "faixa"] = "sem estatística"
    tem = g[g["periodo"] >= 0]

    por_ano = tem.groupby("ano_chegada").size().reindex(ANOS, fill_value=0)
    per = []
    for k, a0, a1, r, en, cor in PERIODOS:
        d = tem[tem["periodo"] == k]
        reg = d.groupby("regiao").size()
        per.append({"chave": k, "rotulo": r, "rotulo_en": en, "cor": cor, "n": int(len(d)),
                    "lat_mediana": round(float(d["lat"].median()), 2), "lon_mediana": round(float(d["lon"].median()), 2),
                    "regioes": {rg: int(reg.get(rg, 0)) for rg in ORDEM_REG},
                    "soja_2025_mha": mha(d["soja_2025_ha"].sum())})
    reg_anos = {rg: [mha(soja.loc[(m["regiao"] == rg).values, f"y{a}"].sum()) for a in ANOS] for rg in ORDEM_REG}

    # Chamadas: a chegada mais ao norte em 2016–2025 e o município de 2016–2025 com mais soja hoje.
    rec = tem[tem["periodo"] == 4]
    norte = rec.sort_values("lat", ascending=False).iloc[0]
    maior_rec = rec.sort_values("soja_2025_ha", ascending=False).iloc[0]
    ufs_rec = rec.groupby("SIGLA_UF").size().sort_values(ascending=False)
    # Distância entre a mediana das chegadas da primeira e da última década (em Albers, km).
    p = gpd.GeoSeries([Point(per[1]["lon_mediana"], per[1]["lat_mediana"]), Point(per[4]["lon_mediana"], per[4]["lat_mediana"])],
                      crs=GEO).to_crs(AREA_BR)
    desloc_km = round(float(p.iloc[0].distance(p.iloc[1])) / 1000)

    ufs, lim = ufs_brasil(m)
    regras = [(igual("periodo", k), r, preenchimento(cor, "#ffffff", 0.05)) for k, _, _, r, _, cor in PERIODOS]
    regras.append((igual("periodo", -1), "soja nunca passou de 5 % da área", preenchimento(SEM_SOJA, "#ffffff", 0.05)))
    estilos = {
        "municipios": [("chegada", "Ano em que a soja passou de 5 % da área do município (por três anos seguidos)",
                        estilo_regras("poligono", regras), True)],
        "ufs": [("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    cols = ["CD_MUN", "NM_MUN", "SIGLA_UF", "regiao", "area_ha", "soja_1985_ha", "soja_1985_pct", "soja_2025_ha", "soja_2025_pct",
            "soja_max_pct", "ano_chegada", "periodo", "faixa", "abaixo_em_2025", "lon", "lat"]
    tam = gravar("chegada", {"municipios": g[cols + ["geometry"]], "ufs": ufs, "limite_nacional": lim}, estilos, g[cols])

    total = soja.sum()
    gravar_cache("quarenta-anos-de-biomassa-br-chegada", {
        "limiar": LIMIAR_SOJA,
        "municipios": para_d3(g, ["CD_MUN", "periodo"], tol=0.012, casas=3),
        "periodos": per,
        "por_ano": [int(v) for v in por_ano.values],
        "anos": ANOS,
        "soja_br_mha": [mha(total[f"y{a}"]) for a in ANOS],
        "soja_regiao_mha": reg_anos,
        "com_soja": int(len(tem)), "ja_1985": int((g["periodo"] == 0).sum()), "chegaram": int((g["periodo"] >= 1).sum()),
        "acima_2025": int((g["soja_2025_pct"] >= LIMIAR_SOJA).sum()),
        "abaixo_em_2025": int(g["abaixo_em_2025"].sum()),
        "municipios_total": int((g["ano_chegada"] >= 0).sum()),
        "pico": {"ano": int(por_ano.idxmax()), "n": int(por_ano.max())},
        "norte": {**cidade(norte), "ano": int(norte.ano_chegada), "pct": float(norte.soja_2025_pct)},
        "maior_recente": {**cidade(maior_rec), "ano": int(maior_rec.ano_chegada), "ha": float(maior_rec.soja_2025_ha),
                          "pct": float(maior_rec.soja_2025_pct)},
        "ufs_recentes": {k: int(v) for k, v in ufs_rec.head(6).items()},
        "desloc_km": desloc_km,
        "tamanhos": tam,
    })
    print(tam)
    print(pd.DataFrame(per).drop(columns=["cor"]).to_string())
    print("por ano:", por_ano[por_ano > 0].to_dict())
    print("norte:", norte[["NM_MUN", "SIGLA_UF", "ano_chegada", "lat", "soja_2025_pct"]].to_dict())
    print("maior recente:", maior_rec[["NM_MUN", "SIGLA_UF", "ano_chegada", "soja_2025_ha", "soja_2025_pct"]].to_dict())
    print("UFs 2016–2025:", ufs_rec.head(8).to_dict(), "desloc km", desloc_km)
    print("soja BR Mha", mha(total["y1985"]), mha(total["y2025"]), "abaixo em 2025:", int(g["abaixo_em_2025"].sum()))


# ------------------------------------------------------------------ 172 cada lavoura no seu rumo
RUMOS = [  # (classe, rótulo, rótulo EN, cor)
    ("soja", "soja", "soybean", "#c08a1e"),
    ("cana", "cana-de-açúcar", "sugar cane", "#a8325e"),
    ("pastagem", "pastagem", "pasture", "#7d6a4a"),
    ("silvicultura", "silvicultura", "planted forest", "#2f6b5a"),
]
DIRECOES = [("norte", "north"), ("nordeste", "north-east"), ("leste", "east"), ("sudeste", "south-east"), ("sul", "south"),
            ("sudoeste", "south-west"), ("oeste", "west"), ("noroeste", "north-west")]


def rumo() -> None:
    m = municipios()
    area, cl = cobertura(m)
    # Centro de cada município: centroide do polígono na Albers do Brasil (equivalente).
    cen = m.geometry.to_crs(AREA_BR).centroid
    ok = area["y2025"].notna().values
    X, Yc = cen.x.values[ok], cen.y.values[ok]
    linhas, pontos, rot = [], [], []
    classes = RUMOS + [("floresta", "formação florestal", "forest formation", "#5d7f45")]
    for k, r, en, cor in classes:
        a = cl[k].values[ok]
        tot = a.sum(axis=0)
        cx, cy = (a * X[:, None]).sum(axis=0) / tot, (a * Yc[:, None]).sum(axis=0) / tot
        geo = gpd.GeoSeries(gpd.points_from_xy(cx, cy), crs=AREA_BR).to_crs(GEO)
        caminho = float(np.hypot(np.diff(cx), np.diff(cy)).sum() / 1000)
        dx, dy = cx[-1] - cx[0], cy[-1] - cy[0]
        liquido = float(math.hypot(dx, dy) / 1000)
        az = (math.degrees(math.atan2(dx, dy)) + 360) % 360  # 0 = norte, sentido horário
        dpt, den = DIRECOES[int((az + 22.5) // 45) % 8]
        # O ano em que o centro andou mais (de um ano ao seguinte).
        passo = np.hypot(np.diff(cx), np.diff(cy)) / 1000
        rot.append({"classe": k, "rotulo": r, "rotulo_en": en, "cor": cor, "caminho_km": round(caminho), "liquido_km": round(liquido),
                    "azimute": round(az), "direcao": dpt, "direcao_en": den,
                    "km_norte": round(dy / 1000), "km_leste": round(dx / 1000),
                    "area_mha": [mha(v) for v in tot], "fator": round(float(tot[-1] / tot[0]), 2),
                    "pontos": [[round(float(p.x), 3), round(float(p.y), 3)] for p in geo],
                    "maior_passo": {"de": ANOS[int(passo.argmax())], "km": round(float(passo.max()))}})
        linhas.append({"classe": k, "rotulo": r, "caminho_km": round(caminho), "liquido_km": round(liquido), "direcao": dpt,
                       "area_1985_mha": mha(tot[0]), "area_2025_mha": mha(tot[-1]),
                       "geometry": LineString([(p.x, p.y) for p in geo])})
        for a_, p, t in zip(ANOS, geo, tot):
            pontos.append({"classe": k, "rotulo": r, "ano": a_, "lon": round(float(p.x), 4), "lat": round(float(p.y), 4),
                           "area_mha": mha(t), "geometry": p})
    lin = gpd.GeoDataFrame(linhas, crs=GEO)
    pts = gpd.GeoDataFrame(pontos, crs=GEO)
    ufs, lim = ufs_brasil(m)
    estilos = {
        "trajetorias": [("classe", "Trajetória do centro de gravidade de cada classe, 1985–2025", estilo_regras(
            "linha", [(igual("classe", k), r, linha(cor, 0.9)) for k, r, _, cor in classes]), True)],
        "centros_anuais": [("ano", "Centro de gravidade de cada classe, por ano", estilo_regras(
            "ponto", [(igual("classe", k), r, marcador(cor, 1.4)) for k, r, _, cor in classes]), True)],
        "ufs": [("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    tam = gravar("rumo", {"trajetorias": lin, "centros_anuais": pts, "ufs": ufs, "limite_nacional": lim}, estilos,
                 pts.drop(columns="geometry"))
    gravar_cache("quarenta-anos-de-biomassa-br-rumo", {"anos": ANOS, "classes": rot, "tamanhos": tam})
    print(tam)
    for r in rot:
        print(r["classe"], r["pontos"][0], "→", r["pontos"][-1], r["caminho_km"], r["liquido_km"], r["direcao"], r["azimute"],
              "N", r["km_norte"], "L", r["km_leste"], "área", r["area_mha"][0], "→", r["area_mha"][-1], "×", r["fator"], r["maior_passo"])


# ------------------------------------------------------------------ 173 cidades de uma cultura só
LIMIAR_MONO = 50.0  # % da área do município numa só classe
MONO = ["cana", "soja", "pastagem", "silvicultura", "outras_temporarias"]
MONO_ROT = {"cana": ("cana-de-açúcar", "sugar cane"), "soja": ("soja", "soybean"), "pastagem": ("pastagem", "pasture"),
            "silvicultura": ("silvicultura", "planted forest"), "outras_temporarias": ("outras lavouras temporárias", "other temporary crops"),
            "nenhuma": ("nenhuma classe passa de 50 %", "no class above 50%")}
CATEGORIAS_MONO = [  # (chave, rótulo, rótulo EN, cor)
    ("soja_nova", "soja, desde depois de 1985", "soybean, since after 1985", "#c08a1e"),
    ("soja_antiga", "soja, já em 1985", "soybean, already in 1985", "#6e4c0c"),
    ("cana_nova", "cana, desde depois de 1985", "sugar cane, since after 1985", "#b8466f"),
    ("cana_antiga", "cana, já em 1985", "sugar cane, already in 1985", "#6a1838"),
    ("pastagem_nova", "pastagem, desde depois de 1985", "pasture, since after 1985", "#b39a6c"),
    ("pastagem_antiga", "pastagem, já em 1985", "pasture, already in 1985", "#7d6a4a"),
    ("outra", "silvicultura ou outra lavoura", "planted forest or another crop", "#2f6b5a"),
    ("deixou", "era em 1985, deixou de ser", "was in 1985, no longer", "#e3dccd"),
    ("nenhuma", "nem em 1985 nem em 2025", "neither in 1985 nor in 2025", "#f6f6f4"),
]


def dominante(cl: dict[str, pd.DataFrame], area: pd.DataFrame, ano: str) -> tuple[pd.Series, pd.Series]:
    s = pd.DataFrame({k: cl[k][ano] / area[ano] * 100 for k in MONO})
    mx = s.max(axis=1)
    dom = s.idxmax(axis=1).where(mx >= LIMIAR_MONO, "nenhuma")
    return dom, mx


def monocultura() -> None:
    m = municipios()
    area, cl = cobertura(m)
    ok = area["y2025"].notna().values
    g = m[ok].copy()
    a2, c2 = area[ok], {k: v[ok] for k, v in cl.items()}
    d85, p85 = dominante(c2, a2, "y1985")
    d25, p25 = dominante(c2, a2, "y2025")
    g["dominante_1985"], g["pct_1985"] = d85.values, p85.values.round(1)
    g["dominante_2025"], g["pct_2025"] = d25.values, p25.values.round(1)
    for k in ("soja", "cana", "pastagem"):
        g[f"{k}_2025_pct"] = (c2[k]["y2025"] / a2["y2025"] * 100).values.round(1)
    d, a = g["dominante_2025"], g["dominante_1985"]
    g["categoria"] = np.select(
        [d.isin(["soja", "cana", "pastagem"]) & (a == d), d.isin(["soja", "cana", "pastagem"]),
         d.isin(["silvicultura", "outras_temporarias"]), a != "nenhuma"],
        [d + "_antiga", d + "_nova", "outra", "deixou"], "nenhuma")
    cat = g["categoria"].value_counts()
    cruz = pd.crosstab(g["dominante_1985"], g["dominante_2025"])
    # Número de municípios de uma cultura só, ano a ano.
    serie = {k: [] for k in MONO}
    for y in Y:
        dd, _ = dominante(c2, a2, y)
        vc = dd.value_counts()
        for k in MONO:
            serie[k].append(int(vc.get(k, 0)))
    # Chamadas: o município de soja com a maior parte da terra numa cultura só; o de cana idem.
    top = {k: g[g["dominante_2025"] == k].sort_values("pct_2025", ascending=False).iloc[0] for k in ("soja", "cana")}
    reg = g.groupby(["regiao", "dominante_2025"]).size().unstack(fill_value=0)
    reg85 = g.groupby(["regiao", "dominante_1985"]).size().unstack(fill_value=0)
    pasto_deixou = g[(g["dominante_1985"] == "pastagem") & (g["dominante_2025"] != "pastagem")]
    pasto_virou = pasto_deixou["dominante_2025"].value_counts()
    # Área dos municípios de uma cultura só (de soja) em 2025.
    area_soja_mono = float(c2["soja"].loc[(g["dominante_2025"] == "soja").values, "y2025"].sum())
    area_soja = float(c2["soja"]["y2025"].sum())

    ufs, lim = ufs_brasil(m)
    regras = [(igual("categoria", k), r, preenchimento(cor, "#ffffff", 0.05)) for k, r, _, cor in CATEGORIAS_MONO]
    estilos = {
        "municipios": [("categoria", "Municípios com mais de 50 % da área numa só classe de lavoura, pasto ou silvicultura, 1985 e 2025",
                        estilo_regras("poligono", regras), True)],
        "ufs": [("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    cols = ["CD_MUN", "NM_MUN", "SIGLA_UF", "regiao", "dominante_1985", "pct_1985", "dominante_2025", "pct_2025",
            "soja_2025_pct", "cana_2025_pct", "pastagem_2025_pct", "categoria", "lon", "lat"]
    tam = gravar("monocultura", {"municipios": g[cols + ["geometry"]], "ufs": ufs, "limite_nacional": lim}, estilos, g[cols])

    gravar_cache("quarenta-anos-de-biomassa-br-monocultura", {
        "limiar": LIMIAR_MONO,
        "municipios": para_d3(g, ["CD_MUN", "categoria"], tol=0.012, casas=3),
        "categorias": [{"chave": k, "rotulo": r, "rotulo_en": en, "cor": cor, "n": int(cat.get(k, 0))} for k, r, en, cor in CATEGORIAS_MONO],
        "rotulos": {k: list(v) for k, v in MONO_ROT.items()},
        "cruzamento": {a_: {b: int(cruz.at[a_, b]) if (a_ in cruz.index and b in cruz.columns) else 0 for b in [*MONO, "nenhuma"]}
                       for a_ in [*MONO, "nenhuma"]},
        "anos": ANOS, "serie": serie,
        "total_1985": int((g["dominante_1985"] != "nenhuma").sum()), "total_2025": int((g["dominante_2025"] != "nenhuma").sum()),
        "por_classe_1985": {k: int((g["dominante_1985"] == k).sum()) for k in MONO},
        "por_classe_2025": {k: int((g["dominante_2025"] == k).sum()) for k in MONO},
        "regioes_2025": {r: {k: int(reg.at[r, k]) if k in reg.columns else 0 for k in MONO} for r in ORDEM_REG},
        "regioes_1985": {r: {k: int(reg85.at[r, k]) if k in reg85.columns else 0 for k in MONO} for r in ORDEM_REG},
        "pasto_deixou": int(len(pasto_deixou)), "pasto_virou": {k: int(v) for k, v in pasto_virou.items()},
        "top": {k: {**cidade(v), "pct": float(v.pct_2025), "pct_1985": float(v.pct_1985), "dom_1985": v.dominante_1985} for k, v in top.items()},
        "soja_mono_pct_area": pct(area_soja_mono, area_soja),
        "cana_sp_de_pasto": int(((g["dominante_2025"] == "cana") & (g["SIGLA_UF"] == "SP") & (g["dominante_1985"] == "pastagem")).sum()),
        "cana_ufs": {k: int(v) for k, v in g.loc[g["dominante_2025"] == "cana", "SIGLA_UF"].value_counts().items()},
        "soja_ufs": {k: int(v) for k, v in g.loc[g["dominante_2025"] == "soja", "SIGLA_UF"].value_counts().items()},
        "municipios_total": int(len(g)),
        "tamanhos": tam,
    })
    print(tam)
    print(cat.to_string())
    print(cruz.to_string())
    print("pasto deixou:", len(pasto_deixou), pasto_virou.to_dict())
    for k, v in top.items():
        print(k, v[["NM_MUN", "SIGLA_UF", "pct_2025", "dominante_1985", "pct_1985"]].to_dict())
    print(reg.to_string())
    print(reg85.to_string())
    print("pico:", {k: (ANOS[int(np.argmax(v))], max(v)) for k, v in serie.items()})
    print("soja em municípios de soja:", pct(area_soja_mono, area_soja))


if __name__ == "__main__":
    temas = {"chegada": chegada, "rumo": rumo, "monocultura": monocultura}
    ap = argparse.ArgumentParser()
    ap.add_argument("tema", choices=list(temas))
    temas[ap.parse_args().tema]()
