"""
Coleção «O que se colhe na mata» (Brasil) — prepara os dados de uma prancha (uso interno).

    .venv-geo/Scripts/python scripts/colecoes/biomassa-da-mata-br/preparar.py acai|babacu|carvao

Saídas: mapas/<pasta>/dados/<base>.gpkg.zip (com estilos do QGIS), <base>.csv (municípios), <base>_serie.csv
(série anual do país) e scripts/colecoes/cache/biomassa-da-mata-br-<tema>.json (para a prancha e a ficha).
Fontes: IBGE, Produção da Extração Vegetal e da Silvicultura (PEVS, tabelas 289 e 291 do SIDRA) e Produção
Agrícola Municipal (PAM, tabela 5457), baixadas em dados-brutos/ibge/pevs/ (ver fontes.csv).
Só quantidades declaradas: nenhuma estimativa de energia ou de potencial.
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

SERIE = {s["tema"]: s for s in json.loads((Path(__file__).parent / "serie.json").read_text(encoding="utf-8"))}
MALHA_BR = RAIZ / "scripts" / "estados" / "cache" / "brasil_0_004.gpkg"
PEVS = RAIZ / "dados-brutos" / "ibge" / "pevs"
REGIOES = {"1": "Norte", "2": "Nordeste", "3": "Sudeste", "4": "Sul", "5": "Centro-Oeste"}
UF_COD = {
    "11": "RO", "12": "AC", "13": "AM", "14": "RR", "15": "PA", "16": "AP", "17": "TO", "21": "MA", "22": "PI", "23": "CE",
    "24": "RN", "25": "PB", "26": "PE", "27": "AL", "28": "SE", "29": "BA", "31": "MG", "32": "ES", "33": "RJ", "35": "SP",
    "41": "PR", "42": "SC", "43": "RS", "50": "MS", "51": "MT", "52": "GO", "53": "DF",
}
NOME_UF = {
    "RO": "Rondônia", "AC": "Acre", "AM": "Amazonas", "RR": "Roraima", "PA": "Pará", "AP": "Amapá", "TO": "Tocantins",
    "MA": "Maranhão", "PI": "Piauí", "CE": "Ceará", "RN": "Rio Grande do Norte", "PB": "Paraíba", "PE": "Pernambuco",
    "AL": "Alagoas", "SE": "Sergipe", "BA": "Bahia", "MG": "Minas Gerais", "ES": "Espírito Santo", "RJ": "Rio de Janeiro",
    "SP": "São Paulo", "PR": "Paraná", "SC": "Santa Catarina", "RS": "Rio Grande do Sul", "MS": "Mato Grosso do Sul",
    "MT": "Mato Grosso", "GO": "Goiás", "DF": "Distrito Federal",
}
INICIO, FIM = 1986, 2025
A0, A1 = 1986, 1990   # primeiro quinquênio da série
B0, B1 = 2021, 2025   # último quinquênio


# ------------------------------------------------------------------ leitura
def sidra_mun(padrao: str) -> pd.DataFrame:
    """Arquivos «só códigos» do SIDRA (n6) → cd, ano, t. «-» = zero; «..»/«...» = sem dado (fica NaN); «X» não ocorre."""
    partes = []
    for arq in sorted(PEVS.glob(padrao)):
        j = json.loads(arq.read_text(encoding="utf-8"))
        partes.append(pd.DataFrame(j[1:]))
    assert partes, padrao
    d = pd.concat(partes, ignore_index=True)
    assert not d["V"].eq("X").any(), padrao
    d["t"] = pd.to_numeric(d["V"].replace({"-": "0", "..": None, "...": None}))
    d = d.rename(columns={"D1C": "CD_MUN", "D3C": "ano"})
    d["ano"] = d["ano"].astype(int)
    assert not d.duplicated(["CD_MUN", "ano"]).any(), padrao
    return d[["CD_MUN", "ano", "t"]]


def largo(d: pd.DataFrame) -> pd.DataFrame:
    """Uma linha por município, uma coluna por ano (NaN → 0: sem dado é sem produção declarada)."""
    w = d.pivot_table(index="CD_MUN", columns="ano", values="t", aggfunc="sum").fillna(0)
    return w


def municipios() -> gpd.GeoDataFrame:
    m = gpd.read_file(MALHA_BR, engine="pyogrio").set_crs(GEO, allow_override=True)
    m = m[m["CD_MUN"].str.match(r"^\d{7}$") & m["CD_RGINT"].notna()][["CD_MUN", "NM_MUN", "SIGLA_UF", "geometry"]]
    m["regiao"] = m["CD_MUN"].str[0].map(REGIOES)
    pos = m.geometry.to_crs(AREA_BR).representative_point().to_crs(GEO)
    m["lon"], m["lat"] = pos.x.round(4), pos.y.round(4)
    return m.reset_index(drop=True)


def ufs_brasil(m: gpd.GeoDataFrame) -> tuple[gpd.GeoDataFrame, gpd.GeoDataFrame]:
    ufs = m.dissolve(by=["SIGLA_UF", "regiao"], as_index=False)[["SIGLA_UF", "regiao", "geometry"]]
    lim = m.assign(pais="Brasil").dissolve(by="pais", as_index=False)[["pais", "geometry"]]
    return ufs, lim


def com_malha(w: pd.DataFrame, m: gpd.GeoDataFrame, rotulo: str) -> pd.DataFrame:
    """Confere que todo município com produção existe na malha de 2025."""
    fora = sorted(set(w.index) - set(m["CD_MUN"]))
    prod_fora = w.loc[fora].sum(axis=1) if fora else pd.Series(dtype=float)
    assert (prod_fora == 0).all(), (rotulo, prod_fora[prod_fora > 0])
    return w.drop(index=fora)


def gravar(tema: str, camadas: dict[str, gpd.GeoDataFrame], estilos: dict, csv: pd.DataFrame, serie: pd.DataFrame) -> dict:
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
    arq_serie = destino / f"{s['base']}_serie.csv"
    serie.to_csv(arq_serie, index=False, encoding="utf-8")
    return {z.name: z.stat().st_size, arq_csv.name: arq_csv.stat().st_size, arq_serie.name: arq_serie.stat().st_size}


def media(w: pd.DataFrame, a0: int, a1: int) -> pd.Series:
    return w.reindex(columns=range(a0, a1 + 1), fill_value=0).mean(axis=1)


def pontos(d: pd.DataFrame, m: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    d = d.reset_index().rename(columns={"index": "CD_MUN"}).merge(m.drop(columns="geometry"), on="CD_MUN", how="left")
    assert d["NM_MUN"].notna().all()
    return gpd.GeoDataFrame(d, geometry=gpd.points_from_xy(d["lon"], d["lat"]), crs=GEO)


def mun_dict(r, **extra) -> dict:
    return {"cd": r.CD_MUN, "nome": r.NM_MUN, "uf": r.SIGLA_UF, "coord": [float(r.lon), float(r.lat)], **extra}


# ------------------------------------------------------------------ 1 açaí: a mata e o açaizal
CLASSES_ACAI = [
    (0, "quase tudo da mata (90 % ou mais)", "almost all from the forest (90% or more)", "#2f5d3a"),
    (1, "mais da mata (50 a 90 %)", "mostly from the forest (50 to 90%)", "#8aa05a"),
    (2, "mais do cultivo (10 a 50 % da mata)", "mostly cultivated (10 to 50% forest)", "#b48aa5"),
    (3, "quase tudo cultivado (menos de 10 % da mata)", "almost all cultivated (under 10% forest)", "#6b3d5c"),
]


def acai() -> None:
    m = municipios()
    ext = com_malha(largo(sidra_mun("t289_mun_acai_*.json")), m, "açaí extrativo")
    cul = com_malha(largo(sidra_mun("t5457_mun_acai_*.json")), m, "açaí cultivado")
    serie = pd.DataFrame({"ano": range(INICIO, FIM + 1)})
    serie["extrativo_t"] = serie["ano"].map(ext.sum()).astype(float)
    serie["cultivado_t"] = serie["ano"].map(cul.sum())  # a PAM só tem açaí a partir de 2015
    serie["municipios_extrativo"] = serie["ano"].map((ext > 0).sum())
    serie["municipios_cultivado"] = serie["ano"].map((cul > 0).sum())
    serie["pct_mata"] = (serie["extrativo_t"] / (serie["extrativo_t"] + serie["cultivado_t"]) * 100).round(2)

    d = pd.DataFrame({"extrativo_2025": ext[FIM], "extrativo_2015": ext[2015], "extrativo_1986": ext[INICIO]}).join(
        pd.DataFrame({"cultivado_2025": cul[FIM], "cultivado_2015": cul[2015]}), how="outer").fillna(0)
    d["total_2025"] = d["extrativo_2025"] + d["cultivado_2025"]
    d["total_2015"] = d["extrativo_2015"] + d["cultivado_2015"]
    d = d[d["total_2025"] > 0].copy()
    d["pct_mata_2025"] = (d["extrativo_2025"] / d["total_2025"] * 100).round(1)
    d["classe"] = np.select([d["pct_mata_2025"] >= 90, d["pct_mata_2025"] >= 50, d["pct_mata_2025"] >= 10], [0, 1, 2], 3).astype(int)
    pts = pontos(d, m)
    cols = ["CD_MUN", "NM_MUN", "SIGLA_UF", "regiao", "extrativo_1986", "extrativo_2015", "cultivado_2015", "total_2015",
            "extrativo_2025", "cultivado_2025", "total_2025", "pct_mata_2025", "classe", "lon", "lat"]
    pts = pts[cols + ["geometry"]].sort_values("total_2025", ascending=False).reset_index(drop=True)

    ufs, lim = ufs_brasil(m)
    pts_uf = pts.groupby("SIGLA_UF")[["extrativo_2025", "cultivado_2025", "extrativo_2015", "cultivado_2015"]].sum()
    for c in pts_uf.columns:
        ufs[c] = ufs["SIGLA_UF"].map(pts_uf[c]).fillna(0)
    ufs["total_2025"] = ufs["extrativo_2025"] + ufs["cultivado_2025"]

    regras = [(igual("classe", k), r, marcador(cor, 2, tamanho_expr='1 + 0.012 * sqrt("total_2025")')) for k, r, _, cor in CLASSES_ACAI]
    estilos = {
        "municipios": [("pct_mata", "Açaí de 2025 por município: parte colhida na mata (círculo ∝ toneladas)",
                        estilo_regras("ponto", regras, ordem='"total_2025" DESC'), True)],
        "ufs": [("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    ufs_cols = ["SIGLA_UF", "regiao", "extrativo_2015", "cultivado_2015", "extrativo_2025", "cultivado_2025", "total_2025"]
    tam = gravar("acai", {"municipios": pts, "ufs": ufs[ufs_cols + ["geometry"]], "limite_nacional": lim}, estilos,
                 pts.drop(columns="geometry"), serie)

    s25 = serie.set_index("ano").loc[FIM]
    s15 = serie.set_index("ano").loc[2015]
    cl = pts.groupby("classe").agg(n=("CD_MUN", "size"), t=("total_2025", "sum"), ext=("extrativo_2025", "sum"))
    top = pts.head(10)
    ext_top = pts.sort_values("extrativo_2025", ascending=False).head(5)
    pa = ufs.set_index("SIGLA_UF").loc["PA"]
    uf_tab = ufs[ufs["total_2025"] > 0].sort_values("total_2025", ascending=False)
    gravar_cache("biomassa-da-mata-br-acai", {
        "classes": [{"classe": k, "rotulo": r, "rotulo_en": en, "cor": cor, "municipios": int(cl.at[k, "n"]) if k in cl.index else 0,
                     "t": float(cl.at[k, "t"]) if k in cl.index else 0.0} for k, r, en, cor in CLASSES_ACAI],
        "pontos": [[int(r.classe), float(r.lon), float(r.lat), float(r.total_2025), float(r.extrativo_2025), float(r.cultivado_2025),
                    r.NM_MUN, r.SIGLA_UF] for r in pts.itertuples()],
        "serie": [{"ano": int(r.ano), "ext": float(r.extrativo_t), "cul": None if pd.isna(r.cultivado_t) else float(r.cultivado_t)}
                  for r in serie.itertuples()],
        "ext_2025": float(s25.extrativo_t), "cul_2025": float(s25.cultivado_t), "ext_2015": float(s15.extrativo_t),
        "cul_2015": float(s15.cultivado_t), "ext_1986": float(serie.iloc[0].extrativo_t),
        "pct_mata_2015": float(s15.pct_mata), "pct_mata_2025": float(s25.pct_mata),
        "mun_ext_1986": int(serie.iloc[0].municipios_extrativo), "mun_ext_2025": int(s25.municipios_extrativo),
        "mun_cul_2015": int(s15.municipios_cultivado), "mun_cul_2025": int(s25.municipios_cultivado),
        "municipios": int(len(pts)),
        "top": [mun_dict(r, total=float(r.total_2025), ext=float(r.extrativo_2025), cul=float(r.cultivado_2025)) for r in top.itertuples()],
        "top_ext": [mun_dict(r, total=float(r.total_2025), ext=float(r.extrativo_2025), cul=float(r.cultivado_2025)) for r in ext_top.itertuples()],
        "ufs": [{"uf": r.SIGLA_UF, "ext": float(r.extrativo_2025), "cul": float(r.cultivado_2025), "ext15": float(r.extrativo_2015),
                 "cul15": float(r.cultivado_2015)} for r in uf_tab.itertuples()],
        "pa_pct_total": round(float(pa.total_2025 / (s25.extrativo_t + s25.cultivado_t) * 100), 1),
        "pa_pct_ext": round(float(pa.extrativo_2025 / s25.extrativo_t * 100), 1),
        "tamanhos": tam,
    })
    print(tam)
    print(serie.to_string())
    print(cl.to_string())
    print(top[["NM_MUN", "SIGLA_UF", "extrativo_2025", "cultivado_2025", "total_2025", "pct_mata_2025"]].to_string())
    print(ext_top[["NM_MUN", "SIGLA_UF", "extrativo_2025", "cultivado_2025"]].to_string())
    print(uf_tab[ufs_cols].to_string())


# ------------------------------------------------------------------ 2 babaçu: menos coco quebrado
CATEGORIAS_BABACU = [
    ("caiu90", "caiu mais de 90 %", "fell by over 90%", "#9c4a32"),
    ("caiu50", "caiu de 50 a 90 %", "fell by 50 to 90%", "#d6a96a"),
    ("manteve", "caiu menos da metade ou cresceu", "fell by under half, or grew", "#7d8a3c"),
    ("nova", "passou a declarar", "started reporting", "#2f5d3a"),
    ("parou", "deixou de declarar", "stopped reporting", "#4a4e52"),
]
GRUPOS_UF_BABACU = ["MA", "PI", "TO", "outras"]


def babacu() -> None:
    m = municipios()
    w = com_malha(largo(sidra_mun("t289_mun_babacu_*.json")), m, "babaçu")
    a, b = media(w, A0, A1), media(w, B0, B1)
    d = pd.DataFrame({"media_1986_1990": a.round(1), "media_2021_2025": b.round(1), "t_1986": w[INICIO], "t_1988": w[1988],
                      "t_2025": w[FIM]})
    d = d[(d["media_1986_1990"] > 0) | (d["media_2021_2025"] > 0)].copy()
    d["variacao_pct"] = np.where(d["media_1986_1990"] > 0, (d["media_2021_2025"] / d["media_1986_1990"] - 1) * 100, np.nan).round(1)
    d["categoria"] = np.select(
        [(d["media_1986_1990"] == 0), (d["media_2021_2025"] == 0), d["media_2021_2025"] <= 0.1 * d["media_1986_1990"],
         d["media_2021_2025"] <= 0.5 * d["media_1986_1990"]], ["nova", "parou", "caiu90", "caiu50"], "manteve")
    pts = pontos(d, m)
    cols = ["CD_MUN", "NM_MUN", "SIGLA_UF", "regiao", "t_1986", "t_1988", "media_1986_1990", "media_2021_2025", "t_2025",
            "variacao_pct", "categoria", "lon", "lat"]
    pts = pts[cols + ["geometry"]].sort_values("media_1986_1990", ascending=False).reset_index(drop=True)

    uf = w.index.str[:2].map(UF_COD)
    grupo = pd.Index([u if u in GRUPOS_UF_BABACU else "outras" for u in uf])
    por_grupo = w.groupby(grupo).sum().T.reindex(columns=GRUPOS_UF_BABACU, fill_value=0)
    serie = pd.DataFrame({"ano": range(INICIO, FIM + 1)})
    serie["amendoa_t"] = serie["ano"].map(w.sum())
    for g in GRUPOS_UF_BABACU:
        serie[f"{g}_t"] = serie["ano"].map(por_grupo[g])
    serie["municipios"] = serie["ano"].map((w > 0).sum())
    serie["t_por_municipio"] = (serie["amendoa_t"] / serie["municipios"]).round(1)

    ufs, lim = ufs_brasil(m)
    por_uf = w.groupby(uf).sum()
    ufs["media_1986_1990"] = ufs["SIGLA_UF"].map(media(por_uf, A0, A1)).fillna(0).round(1)
    ufs["media_2021_2025"] = ufs["SIGLA_UF"].map(media(por_uf, B0, B1)).fillna(0).round(1)
    ufs["t_2025"] = ufs["SIGLA_UF"].map(por_uf[FIM]).fillna(0)

    regras = [(igual("categoria", k), r, marcador(cor, 2, tamanho_expr='1 + 0.06 * sqrt("media_2021_2025")'))
              for k, r, _, cor in CATEGORIAS_BABACU if k != "parou"]
    regras.append((igual("categoria", "parou"), "deixou de declarar (anel = 1986–1990)",
                   marcador("#4a4e52", 2, vazado=True, tamanho_expr='1 + 0.06 * sqrt("media_1986_1990")')))
    estilos = {
        "municipios": [("categoria", "Amêndoa de babaçu por município: média de 2021–2025 contra 1986–1990",
                        estilo_regras("ponto", regras, ordem='"media_2021_2025" DESC'), True)],
        "ufs": [("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    tam = gravar("babacu", {"municipios": pts, "ufs": ufs[["SIGLA_UF", "regiao", "media_1986_1990", "media_2021_2025", "t_2025", "geometry"]],
                            "limite_nacional": lim}, estilos, pts.drop(columns="geometry"), serie)

    s = serie.set_index("ano")
    pico = s["amendoa_t"].idxmax()
    cat = pts.groupby("categoria").agg(n=("CD_MUN", "size"), a=("media_1986_1990", "sum"), b=("media_2021_2025", "sum"))
    cat = cat.reindex([k for k, *_ in CATEGORIAS_BABACU]).fillna(0)
    top_a = pts.head(8)
    top_b = pts.sort_values("media_2021_2025", ascending=False).head(8)
    gravar_cache("biomassa-da-mata-br-babacu", {
        "a": f"{A0}–{A1}", "b": f"{B0}–{B1}",
        "categorias": [{"chave": k, "rotulo": r, "rotulo_en": en, "cor": cor, "municipios": int(cat.at[k, "n"]),
                        "a": float(cat.at[k, "a"]), "b": float(cat.at[k, "b"])} for k, r, en, cor in CATEGORIAS_BABACU],
        "pontos": [[r.categoria, float(r.lon), float(r.lat), float(r.media_1986_1990), float(r.media_2021_2025), r.NM_MUN, r.SIGLA_UF]
                   for r in pts.itertuples()],
        "serie": [{"ano": int(r.ano), "t": float(r.amendoa_t), **{g: float(getattr(r, f"{g}_t")) for g in GRUPOS_UF_BABACU},
                   "mun": int(r.municipios)} for r in serie.itertuples()],
        "pico_ano": int(pico), "pico_t": float(s.at[pico, "amendoa_t"]), "t_1986": float(s.at[INICIO, "amendoa_t"]),
        "t_2025": float(s.at[FIM, "amendoa_t"]),
        "mun_1986": int(s.at[INICIO, "municipios"]), "mun_2025": int(s.at[FIM, "municipios"]),
        "tpm_1986": float(s.at[INICIO, "t_por_municipio"]), "tpm_2025": float(s.at[FIM, "t_por_municipio"]),
        "ma_pct_2025": round(float(s.at[FIM, "MA_t"] / s.at[FIM, "amendoa_t"] * 100), 1),
        "ma_pct_1986": round(float(s.at[INICIO, "MA_t"] / s.at[INICIO, "amendoa_t"] * 100), 1),
        "top_a": [mun_dict(r, a=float(r.media_1986_1990), b=float(r.media_2021_2025)) for r in top_a.itertuples()],
        "top_b": [mun_dict(r, a=float(r.media_1986_1990), b=float(r.media_2021_2025)) for r in top_b.itertuples()],
        "ufs": [{"uf": r.SIGLA_UF, "a": float(r.media_1986_1990), "b": float(r.media_2021_2025), "t25": float(r.t_2025)}
                for r in ufs[ufs["media_1986_1990"] + ufs["media_2021_2025"] > 0].sort_values("media_1986_1990", ascending=False).itertuples()],
        "tamanhos": tam,
    })
    print(tam)
    print(serie.to_string())
    print(cat.to_string())
    print(top_a[["NM_MUN", "SIGLA_UF", "media_1986_1990", "media_2021_2025", "categoria"]].to_string())
    print(top_b[["NM_MUN", "SIGLA_UF", "media_1986_1990", "media_2021_2025", "categoria"]].to_string())


# ------------------------------------------------------------------ 3 carvão: da mata ou plantado
def carvao() -> None:
    m = municipios()
    nat = com_malha(largo(sidra_mun("t289_mun_carvao_*.json")), m, "carvão nativo")
    pla = com_malha(largo(sidra_mun("t291_mun_carvao_*.json")), m, "carvão plantado")
    d = pd.DataFrame({"nativo_1986_1990": media(nat, A0, A1), "nativo_2021_2025": media(nat, B0, B1),
                      "nativo_1986": nat[INICIO], "nativo_2025": nat[FIM]}).join(
        pd.DataFrame({"plantado_1986_1990": media(pla, A0, A1), "plantado_2021_2025": media(pla, B0, B1),
                      "plantado_1986": pla[INICIO], "plantado_2025": pla[FIM]}), how="outer").fillna(0).round(1)
    d = d[d.sum(axis=1) > 0].copy()
    d["pct_nativo_2021_2025"] = np.where(d["nativo_2021_2025"] + d["plantado_2021_2025"] > 0,
                                         d["nativo_2021_2025"] / (d["nativo_2021_2025"] + d["plantado_2021_2025"]) * 100, np.nan).round(1)
    pts = pontos(d, m)
    cols = ["CD_MUN", "NM_MUN", "SIGLA_UF", "regiao", "nativo_1986", "plantado_1986", "nativo_1986_1990", "plantado_1986_1990",
            "nativo_2021_2025", "plantado_2021_2025", "nativo_2025", "plantado_2025", "pct_nativo_2021_2025", "lon", "lat"]
    pts = pts[cols + ["geometry"]].sort_values("nativo_1986_1990", ascending=False).reset_index(drop=True)

    serie = pd.DataFrame({"ano": range(INICIO, FIM + 1)})
    serie["nativo_t"] = serie["ano"].map(nat.sum())
    serie["plantado_t"] = serie["ano"].map(pla.sum())
    serie["pct_nativo"] = (serie["nativo_t"] / (serie["nativo_t"] + serie["plantado_t"]) * 100).round(2)
    serie["municipios_nativo"] = serie["ano"].map((nat > 0).sum())
    serie["municipios_plantado"] = serie["ano"].map((pla > 0).sum())

    ufs, lim = ufs_brasil(m)
    por_uf = pts.groupby("SIGLA_UF")[["nativo_1986_1990", "nativo_2021_2025", "plantado_1986_1990", "plantado_2021_2025",
                                      "nativo_2025", "plantado_2025"]].sum()
    for c in por_uf.columns:
        ufs[c] = ufs["SIGLA_UF"].map(por_uf[c]).fillna(0).round(0)

    def regra(campo, rot, cor, k):
        return estilo_regras("ponto", [(f"&quot;{campo}&quot; &gt; 0", rot, marcador(cor, 2, tamanho_expr=f'1 + {k} * sqrt("{campo}")'))],
                             ordem=f'"{campo}" DESC')
    estilos = {
        "municipios": [
            ("nativo_1986_1990", "Carvão vegetal da extração (mata nativa), média 1986–1990 (t)", regra("nativo_1986_1990", "t por ano", "#9c4a32", 0.012), True),
            ("nativo_2021_2025", "Carvão vegetal da extração (mata nativa), média 2021–2025 (t)", regra("nativo_2021_2025", "t por ano", "#9c4a32", 0.012), False),
            ("plantado_2021_2025", "Carvão vegetal da silvicultura (floresta plantada), média 2021–2025 (t)", regra("plantado_2021_2025", "t por ano", "#3f5a2a", 0.012), False),
        ],
        "ufs": [("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    tam = gravar("carvao", {"municipios": pts, "ufs": ufs[["SIGLA_UF", "regiao", *por_uf.columns, "geometry"]], "limite_nacional": lim},
                 estilos, pts.drop(columns="geometry"), serie)

    s = serie.set_index("ano")
    nat_maior = s.index[s["nativo_t"] > s["plantado_t"]]
    pico = int(s["nativo_t"].idxmax())
    uf_tab = ufs.assign(soma=ufs[por_uf.columns].sum(axis=1))
    uf_tab = uf_tab[uf_tab["soma"] > 0]
    top_nat_a = pts.head(6)
    top_nat_b = pts.sort_values("nativo_2021_2025", ascending=False).head(6)
    top_pla_b = pts.sort_values("plantado_2021_2025", ascending=False).head(6)
    def pts_de(campo):
        q = pts[pts[campo] > 0]
        return [[float(r.lon), float(r.lat), float(getattr(r, campo))] for r in q.itertuples()]
    an = s.loc[A0:A1]
    bn = s.loc[B0:B1]
    gravar_cache("biomassa-da-mata-br-carvao", {
        "a": f"{A0}–{A1}", "b": f"{B0}–{B1}",
        "nativo_a": pts_de("nativo_1986_1990"), "nativo_b": pts_de("nativo_2021_2025"), "plantado_b": pts_de("plantado_2021_2025"),
        "serie": [{"ano": int(r.ano), "nat": float(r.nativo_t), "pla": float(r.plantado_t)} for r in serie.itertuples()],
        "nat_1986": float(s.at[INICIO, "nativo_t"]), "pla_1986": float(s.at[INICIO, "plantado_t"]),
        "nat_2025": float(s.at[FIM, "nativo_t"]), "pla_2025": float(s.at[FIM, "plantado_t"]),
        "pct_nat_1986": float(s.at[INICIO, "pct_nativo"]), "pct_nat_2025": float(s.at[FIM, "pct_nativo"]),
        "pico_ano": pico, "pico_t": float(s.at[pico, "nativo_t"]),
        "ultimo_ano_nativo_maior": int(nat_maior.max()),
        "nat_a": float(an["nativo_t"].mean()), "nat_b": float(bn["nativo_t"].mean()),
        "pla_a": float(an["plantado_t"].mean()), "pla_b": float(bn["plantado_t"].mean()),
        "mun_nat_1986": int(s.at[INICIO, "municipios_nativo"]), "mun_nat_2025": int(s.at[FIM, "municipios_nativo"]),
        "mun_pla_1986": int(s.at[INICIO, "municipios_plantado"]), "mun_pla_2025": int(s.at[FIM, "municipios_plantado"]),
        "ufs": [{"uf": r.SIGLA_UF, "na": float(r.nativo_1986_1990), "nb": float(r.nativo_2021_2025), "pa": float(r.plantado_1986_1990),
                 "pb": float(r.plantado_2021_2025)} for r in uf_tab.itertuples()],
        "top_nat_a": [mun_dict(r, v=float(r.nativo_1986_1990)) for r in top_nat_a.itertuples()],
        "top_nat_b": [mun_dict(r, v=float(r.nativo_2021_2025)) for r in top_nat_b.itertuples()],
        "top_pla_b": [mun_dict(r, v=float(r.plantado_2021_2025)) for r in top_pla_b.itertuples()],
        "pla_1987": float(s.at[1987, "plantado_t"]),
        "tamanhos": tam,
    })
    print(tam)
    print(serie.to_string())
    print("último ano com nativo > plantado:", nat_maior.max(), list(nat_maior))
    print(uf_tab[["SIGLA_UF", *por_uf.columns]].sort_values("nativo_1986_1990", ascending=False).to_string())
    for t, q in [("nat A", top_nat_a), ("nat B", top_nat_b), ("pla B", top_pla_b)]:
        print(t, q[["NM_MUN", "SIGLA_UF", "nativo_1986_1990", "nativo_2021_2025", "plantado_2021_2025"]].to_string())


if __name__ == "__main__":
    temas = {"acai": acai, "babacu": babacu, "carvao": carvao}
    ap = argparse.ArgumentParser()
    ap.add_argument("tema", choices=list(temas))
    temas[ap.parse_args().tema]()
