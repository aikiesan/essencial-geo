"""
Coleção «O biogás na geração distribuída» (Brasil) — prepara os dados de uma prancha (uso interno).

    .venv-geo/Scripts/python scripts/colecoes/gd-biogas-br/preparar.py registro|rede|remoto|tempo

Saídas: mapas/<pasta>/dados/<base>.gpkg.zip (com estilos do QGIS), <base>.csv
e scripts/colecoes/cache/gd-biogas-br-<tema>.json (para a prancha e a ficha).
Fonte: relação de empreendimentos de geração distribuída da ANEEL (dados abertos, referência 10/2026), em
scripts/colecoes/cache/downloads/aneel_gd/empreendimento-geracao-distribuida.csv (um ZIP, apesar do nome).
O tema `registro` lê o arquivo inteiro (1,5 GB, uns 3 minutos) e guarda as usinas a biogás e os totais da GD em
cache/gd-biogas-br-registro.*; os outros temas partem dele (e o refazem, se faltar).
"""

from __future__ import annotations

import argparse
import json
import sys
import zipfile
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
GD_ZIP = RAIZ / "scripts" / "colecoes" / "cache" / "downloads" / "aneel_gd" / "empreendimento-geracao-distribuida.csv"
CACHE = RAIZ / "scripts" / "colecoes" / "cache"
REG_USINAS = CACHE / "gd-biogas-br-registro.csv"
REG_TOTAIS = CACHE / "gd-biogas-br-registro.json"
REGIOES = {"1": "Norte", "2": "Nordeste", "3": "Sudeste", "4": "Sul", "5": "Centro-Oeste"}

# Fonte declarada no registro (DscFonteGeracao), como a ANEEL a escreve.
FONTES = {
    "Biogás - RA": ("animal", "resíduos animais", "animal waste"),
    "Biogás - RU": ("urbano", "resíduos urbanos", "urban waste"),
    "Biogás-AGR": ("agroindustrial", "resíduos agroindustriais", "agro-industrial waste"),
    "Biogás - Floresta": ("florestal", "resíduos florestais", "forest residues"),
}
MODALIDADES = {
    "Geracao na propria UC": ("propria", "na própria unidade", "on site"),
    "Auto consumo remoto": ("remoto", "autoconsumo remoto", "remote self-consumption"),
    "Compartilhada": ("compartilhada", "geração compartilhada", "shared generation"),
    "Condomínio": ("condominio", "múltiplas unidades (condomínio)", "multiple units (condominium)"),
}
# Classe de consumo da unidade onde a usina está ligada.
CLASSES = [
    ("rural", "rural", "rural", "#6f7d2e"),
    ("comercial", "comercial", "commercial", "#234e70"),
    ("industrial", "industrial", "industrial", "#9c4a32"),
    ("outras", "poder público e residencial", "public and residential", "#b3a06a"),
]
CLASSE_DE = {"Rural": "rural", "Comercial": "comercial", "Industrial": "industrial", "Poder Público": "outras",
             "Residencial": "outras", "Serviço Público": "outras"}
COR_FORA = "#234e70"  # crédito em outras unidades (remoto + compartilhada)
COR_COMP = "#6b3d5c"
COR_PROPRIA = "#b3bac1"
# Período de entrada do município: ano da atualização cadastral mais antiga entre as suas usinas a biogás.
# DthAtualizaCadastralEmpreend é a data da última atualização do cadastro, não a data de ligação: aproxima o ano de entrada.
PERIODOS = [
    ("ate2017", 0, 2017, "até 2017", "up to 2017", "#1d3b52"),
    ("2018a2020", 2018, 2020, "2018 a 2020", "2018 to 2020", "#4f86ad"),
    ("2021a2025", 2021, 2100, "2021 a 2025", "2021 to 2025", "#a9cbe0"),
]


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
    """Municípios da malha simplificada da série dos estados, com UF, região e um ponto interno (lon, lat)."""
    m = gpd.read_file(MALHA_BR, engine="pyogrio").set_crs(GEO, allow_override=True)
    m = m[m["CD_MUN"].str.match(r"^\d{7}$") & m["CD_RGINT"].notna()][["CD_MUN", "NM_MUN", "SIGLA_UF", "geometry"]]
    m["regiao"] = m["CD_MUN"].str[0].map(REGIOES)
    ll = m.geometry.to_crs(AREA_BR).representative_point().to_crs(GEO)
    m["lon"], m["lat"] = ll.x.round(4), ll.y.round(4)
    return m.reset_index(drop=True)


def ufs_brasil(m: gpd.GeoDataFrame) -> tuple[gpd.GeoDataFrame, gpd.GeoDataFrame]:
    ufs = m.dissolve(by=["SIGLA_UF", "regiao"], as_index=False)[["SIGLA_UF", "regiao", "geometry"]]
    lim = m.assign(pais="Brasil").dissolve(by="pais", as_index=False)[["pais", "geometry"]]
    return ufs, lim


# ------------------------------------------------------------------ o registro
def registro() -> None:
    """Lê o registro inteiro: guarda as usinas a biogás (uma linha cada) e os totais de toda a GD."""
    cols = ["AnmPeriodoReferencia", "DatGeracaoConjuntoDados", "CodEmpreendimento", "SigUF", "CodMunicipioIbge", "NomMunicipio",
            "DscClasseConsumo", "DscSubGrupoTarifario", "SigTipoConsumidor", "NomTitularEmpreendimento", "DthAtualizaCadastralEmpreend",
            "DscModalidadeHabilitado", "QtdUCRecebeCredito", "SigTipoGeracao", "DscFonteGeracao", "DscPorte", "MdaPotenciaInstaladaKW"]
    z = zipfile.ZipFile(GD_ZIP)
    with z.open(z.infolist()[0]) as f:
        d = pd.concat(pd.read_csv(f, sep=";", usecols=cols, dtype=str, chunksize=500_000, encoding="utf-8"), ignore_index=True)
    assert d["CodEmpreendimento"].is_unique
    d["kw"] = pd.to_numeric(d["MdaPotenciaInstaladaKW"].str.replace(",", ".", regex=False))
    d["uc_credito"] = pd.to_numeric(d["QtdUCRecebeCredito"], errors="coerce").fillna(0).astype(int)
    # Data da última atualização cadastral do empreendimento (dicionário da ANEEL): não é a data de ligação.
    d["data"] = pd.to_datetime(d["DthAtualizaCadastralEmpreend"], errors="coerce")
    d["ano"] = d["data"].dt.year
    d["grupo"] = np.where(d["DscFonteGeracao"].isin(list(FONTES)), "biogas", np.where(d["SigTipoGeracao"] == "UFV", "solar", "outras"))
    # Algumas usinas (nenhuma a biogás) vêm sem modalidade: ficam como «sem_modalidade» nos totais.
    d["modalidade"] = d["DscModalidadeHabilitado"].map({k: v[0] for k, v in MODALIDADES.items()})
    assert d.loc[d["DscModalidadeHabilitado"].notna(), "modalidade"].notna().all()
    d["modalidade"] = d["modalidade"].fillna("sem_modalidade")

    b = d[d["grupo"] == "biogas"].copy()
    assert (b["modalidade"] != "sem_modalidade").all()
    b["fonte"] = b["DscFonteGeracao"].map({k: v[0] for k, v in FONTES.items()})
    b["classe"] = b["DscClasseConsumo"].map(CLASSE_DE)
    assert b["classe"].notna().all(), b.loc[b["classe"].isna(), "DscClasseConsumo"].unique()
    b = b.rename(columns={"CodEmpreendimento": "cod_empreendimento", "SigUF": "uf", "CodMunicipioIbge": "cd_mun",
                          "NomMunicipio": "municipio", "DscClasseConsumo": "classe_consumo", "DscSubGrupoTarifario": "subgrupo",
                          "SigTipoConsumidor": "tipo_titular", "NomTitularEmpreendimento": "titular", "DscFonteGeracao": "fonte_registro",
                          "DscModalidadeHabilitado": "modalidade_registro", "DscPorte": "porte"})
    b["data_atualizacao"] = b["data"].dt.strftime("%Y-%m-%d")
    b = b[["cod_empreendimento", "uf", "cd_mun", "municipio", "classe_consumo", "classe", "subgrupo", "tipo_titular", "titular",
           "fonte_registro", "fonte", "modalidade_registro", "modalidade", "porte", "kw", "uc_credito", "data_atualizacao", "ano"]]
    b.sort_values(["data_atualizacao", "cod_empreendimento"]).to_csv(REG_USINAS, index=False, encoding="utf-8")

    def soma(k: pd.DataFrame) -> dict:
        return {"n": int(len(k)), "kw": float(k["kw"].sum()), "uc": int(k["uc_credito"].sum())}

    totais = {
        "referencia": d["AnmPeriodoReferencia"].iloc[0], "gerado_em": d["DatGeracaoConjuntoDados"].iloc[0],
        "total": soma(d),
        "grupos": {g: soma(k) for g, k in d.groupby("grupo")},
        "modalidade": {g: {m: soma(k2) for m, k2 in k.groupby("modalidade")} for g, k in d.groupby("grupo")},
        "por_ano": {g: {str(int(a)): soma(k2) for a, k2 in k.groupby("ano")} for g, k in d.groupby("grupo")},
        "ultima_atualizacao": {g: k["data"].max().strftime("%Y-%m-%d") for g, k in d.groupby("grupo")},
        "atualizacoes_2026": {g: int((k["ano"] == 2026).sum()) for g, k in d.groupby("grupo")},
    }
    REG_TOTAIS.write_text(json.dumps(totais, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps(totais, ensure_ascii=False)[:2000])


def usinas_biogas() -> tuple[pd.DataFrame, dict]:
    if not REG_USINAS.exists() or not REG_TOTAIS.exists():
        registro()
    b = pd.read_csv(REG_USINAS, dtype={"cd_mun": str, "ano": int}, encoding="utf-8")
    return b, json.loads(REG_TOTAIS.read_text(encoding="utf-8"))


def com_municipio(b: pd.DataFrame, m: gpd.GeoDataFrame) -> pd.DataFrame:
    b = b.merge(m[["CD_MUN", "NM_MUN", "SIGLA_UF", "regiao", "lon", "lat"]], left_on="cd_mun", right_on="CD_MUN", how="left")
    assert b["CD_MUN"].notna().all(), b.loc[b["CD_MUN"].isna(), ["cd_mun", "municipio"]]
    assert (b["uf"] == b["SIGLA_UF"]).all()
    return b.drop(columns=["CD_MUN", "SIGLA_UF"])


def pontos_usinas(b: pd.DataFrame) -> gpd.GeoDataFrame:
    """Uma linha por usina, no ponto interno do município (o registro não traz coordenada da usina)."""
    cols = ["cod_empreendimento", "uf", "cd_mun", "NM_MUN", "regiao", "classe_consumo", "classe", "subgrupo", "tipo_titular", "titular",
            "fonte_registro", "fonte", "modalidade_registro", "modalidade", "porte", "kw", "uc_credito", "data_atualizacao", "ano"]
    g = gpd.GeoDataFrame(b[cols].rename(columns={"NM_MUN": "municipio"}), geometry=gpd.points_from_xy(b["lon"], b["lat"]), crs=GEO)
    return g.sort_values("kw", ascending=False).reset_index(drop=True)


ESTILO_UFS = [("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), True)]
ESTILO_LIM = [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)]
TAM = 'max(1.2, 0.09 * sqrt("kw_total"))'


def ufs_tab(b: pd.DataFrame, gd_uf: pd.Series | None = None) -> list[dict]:
    k = b.groupby("uf").agg(n=("kw", "size"), kw=("kw", "sum"), municipios=("cd_mun", "nunique")).sort_values("kw", ascending=False)
    return [{"uf": u, "n": int(v.n), "kw": float(v.kw), "municipios": int(v.municipios)} for u, v in k.iterrows()]


# ------------------------------------------------------------------ 1 onde o biogás entra na rede
def rede() -> None:
    m = municipios()
    b, t = usinas_biogas()
    b = com_municipio(b, m)
    g = b.groupby("cd_mun")
    mun = pd.DataFrame({"n_usinas": g.size(), "kw_total": g["kw"].sum()})
    for k, *_ in CLASSES:
        mun[f"kw_{k}"] = b[b["classe"] == k].groupby("cd_mun")["kw"].sum()
    mun = mun.fillna(0)
    mun["classe_dominante"] = mun[[f"kw_{k}" for k, *_ in CLASSES]].idxmax(axis=1).str[3:]
    mun["classes"] = g["classe"].nunique()
    mun["primeira_atualizacao"] = g["data_atualizacao"].min()
    mun = mun.reset_index().merge(m.drop(columns="geometry"), left_on="cd_mun", right_on="CD_MUN").drop(columns="CD_MUN")
    pts = gpd.GeoDataFrame(mun, geometry=gpd.points_from_xy(mun["lon"], mun["lat"]), crs=GEO).sort_values("kw_total", ascending=False)
    cols = ["cd_mun", "NM_MUN", "SIGLA_UF", "regiao", "n_usinas", "kw_total"] + [f"kw_{k}" for k, *_ in CLASSES] + [
        "classe_dominante", "classes", "primeira_atualizacao", "lon", "lat"]
    pts = pts[cols + ["geometry"]].reset_index(drop=True)
    for c in ["kw_total"] + [f"kw_{k}" for k, *_ in CLASSES]:
        pts[c] = pts[c].round(2)

    ufs, lim = ufs_brasil(m)
    uk = b.groupby("uf").agg(n=("kw", "size"), kw=("kw", "sum"))
    ufs["usinas_biogas"] = ufs["SIGLA_UF"].map(uk["n"]).fillna(0).astype(int)
    ufs["kw_biogas"] = ufs["SIGLA_UF"].map(uk["kw"]).fillna(0).round(2)
    usinas = pontos_usinas(b)
    regras = [(igual("classe_dominante", k), r, marcador(cor, 2.4, tamanho_expr=TAM)) for k, r, _, cor in CLASSES]
    estilos = {
        "municipios": [("classe", "Potência a biogás na GD por município, cor da classe de consumo com mais kW",
                        estilo_regras("ponto", regras, ordem='"kw_total" DESC'), True)],
        "usinas": [("classe", "Usinas a biogás na GD (no ponto do município), por classe de consumo", estilo_regras("ponto", [
            (igual("classe", k), r, marcador(cor, 2, tamanho_expr='max(1, 0.09 * sqrt("kw"))')) for k, r, _, cor in CLASSES],
            ordem='"kw" DESC'), False)],
        "ufs": ESTILO_UFS,
        "limite_nacional": ESTILO_LIM,
    }
    tam = gravar("rede", {"municipios": pts, "usinas": usinas, "ufs": ufs, "limite_nacional": lim}, estilos, pts.drop(columns="geometry"))

    ck = b.groupby("classe").agg(n=("kw", "size"), kw=("kw", "sum"))
    fk = b.groupby("fonte").agg(n=("kw", "size"), kw=("kw", "sum"))
    pk = b.groupby("porte").agg(n=("kw", "size"), kw=("kw", "sum"))
    # Fonte declarada que não combina com a classe: granjas rurais com «resíduos urbanos».
    rural_urbano = b[(b["classe"] == "rural") & (b["fonte"] == "urbano")]
    top = pts.head(8)
    pdm = pts.sort_values("n_usinas", ascending=False).iloc[0]
    gravar_cache("gd-biogas-br-rede", {
        "referencia": t["referencia"], "gerado_em": t["gerado_em"],
        "n": int(len(b)), "kw": float(b["kw"].sum()), "municipios": int(b["cd_mun"].nunique()), "ufs_n": int(b["uf"].nunique()),
        "gd_kw": t["total"]["kw"], "gd_n": t["total"]["n"], "solar_kw": t["grupos"]["solar"]["kw"], "solar_n": t["grupos"]["solar"]["n"],
        "kw_mediana": float(b["kw"].median()), "kw_75": int((b["kw"] == 75).sum()),
        "pontos": [[r.classe_dominante, float(r.lon), float(r.lat), float(r.kw_total), int(r.n_usinas)] for r in pts.itertuples()],
        "classes": [{"chave": k, "rotulo": r, "rotulo_en": en, "cor": cor, "n": int(ck.at[k, "n"]), "kw": float(ck.at[k, "kw"]),
                     "municipios": int((pts["classe_dominante"] == k).sum())} for k, r, en, cor in CLASSES],
        "fontes": [{"chave": v[0], "rotulo": v[1], "rotulo_en": v[2], "n": int(fk.at[v[0], "n"]), "kw": float(fk.at[v[0], "kw"])}
                   for v in sorted(FONTES.values(), key=lambda v: -fk.at[v[0], "kw"])],
        "porte": {k: {"n": int(v.n), "kw": float(v.kw)} for k, v in pk.iterrows()},
        "rural_urbano": {"n": int(len(rural_urbano)), "kw": float(rural_urbano["kw"].sum())},
        "ufs": ufs_tab(b),
        "maiores": [{"nome": r.NM_MUN, "uf": r.SIGLA_UF, "kw": float(r.kw_total), "n": int(r.n_usinas), "classe": r.classe_dominante,
                     "coord": [float(r.lon), float(r.lat)]} for r in top.itertuples()],
        "mais_usinas": {"nome": pdm.NM_MUN, "uf": pdm.SIGLA_UF, "n": int(pdm.n_usinas), "kw": float(pdm.kw_total),
                        "coord": [float(pdm.lon), float(pdm.lat)],
                        "rural": int(((b["cd_mun"] == pdm.cd_mun) & (b["classe"] == "rural")).sum())},
        "tamanhos": tam,
    })
    print(tam, len(b), b["kw"].sum(), b["kw"].sum() / t["total"]["kw"] * 100)
    print(ck, fk, pk, len(rural_urbano), sep="\n")
    print(pts.head(10)[["NM_MUN", "SIGLA_UF", "n_usinas", "kw_total", "classe_dominante"]].to_string())
    print((pts["classes"] > 1).sum(), "municípios com mais de uma classe")


# ------------------------------------------------------------------ 2 gerar aqui, consumir lá
LIM_FORA = [1, 25, 50, 75]
CORES_FORA = ["#dfe9f0", "#a9c6da", "#6f9cbc", "#3d6e93", "#1d3b52"]
ROT_FORA = [("nada", "none"), ("até 25 %", "up to 25%"), ("25 a 50 %", "25 to 50%"), ("50 a 75 %", "50 to 75%"), ("75 % ou mais", "75% or more")]


def remoto() -> None:
    m = municipios()
    b, t = usinas_biogas()
    b = com_municipio(b, m)
    b["fora"] = b["modalidade"].isin(["remoto", "compartilhada"])
    g = b.groupby("cd_mun")
    mun = pd.DataFrame({"n_usinas": g.size(), "kw_total": g["kw"].sum(),
                        "kw_propria": b[~b["fora"]].groupby("cd_mun")["kw"].sum(),
                        "kw_remoto": b[b["modalidade"] == "remoto"].groupby("cd_mun")["kw"].sum(),
                        "kw_compartilhada": b[b["modalidade"] == "compartilhada"].groupby("cd_mun")["kw"].sum(),
                        "uc_credito_fora": b[b["fora"]].groupby("cd_mun")["uc_credito"].sum()}).fillna(0)
    mun["kw_fora"] = mun["kw_remoto"] + mun["kw_compartilhada"]
    mun["pct_fora"] = (mun["kw_fora"] / mun["kw_total"] * 100).round(1)
    mun["uc_credito_fora"] = mun["uc_credito_fora"].astype(int)
    mun = mun.reset_index().merge(m.drop(columns="geometry"), left_on="cd_mun", right_on="CD_MUN").drop(columns="CD_MUN")
    cols = ["cd_mun", "NM_MUN", "SIGLA_UF", "regiao", "n_usinas", "kw_total", "kw_propria", "kw_remoto", "kw_compartilhada", "kw_fora",
            "pct_fora", "uc_credito_fora", "lon", "lat"]
    pts = gpd.GeoDataFrame(mun[cols], geometry=gpd.points_from_xy(mun["lon"], mun["lat"]), crs=GEO).sort_values("kw_total", ascending=False)
    pts = pts.reset_index(drop=True)

    ufs, lim = ufs_brasil(m)
    uk = b.groupby("uf").agg(n=("kw", "size"), kw=("kw", "sum"))
    uf_fora = b[b["fora"]].groupby("uf").agg(n=("kw", "size"), kw=("kw", "sum"), uc=("uc_credito", "sum"))
    ufs["usinas_biogas"] = ufs["SIGLA_UF"].map(uk["n"]).fillna(0).astype(int)
    ufs["kw_biogas"] = ufs["SIGLA_UF"].map(uk["kw"]).fillna(0).round(2)
    ufs["kw_fora"] = ufs["SIGLA_UF"].map(uf_fora["kw"]).fillna(0).round(2)
    ufs["uc_credito_fora"] = ufs["SIGLA_UF"].map(uf_fora["uc"]).fillna(0).astype(int)
    ufs["pct_fora"] = (ufs["kw_fora"] / ufs["kw_biogas"] * 100).where(ufs["kw_biogas"] > 0).round(1)
    ufs["classe"] = np.where(ufs["kw_biogas"] == 0, -1, np.digitize(ufs["pct_fora"].fillna(0), LIM_FORA)).astype(int)

    usinas = pontos_usinas(b)
    regras_uf = [(igual("classe", i), f"{ROT_FORA[i][0]} da potência a biogás", preenchimento(cor, "#ffffff", 0.2)) for i, cor in enumerate(CORES_FORA)]
    regras_uf.append((igual("classe", -1), "sem biogás na GD", preenchimento("#ffffff", "#c9ced3", 0.2)))
    estilos = {
        "municipios": [
            ("fora", "Potência que credita outras unidades (remoto + compartilhada)", estilo_regras("ponto", [
                ('"kw_fora" > 0', "kW com crédito em outras unidades", marcador(COR_FORA, 2, tamanho_expr='max(1.2, 0.09 * sqrt("kw_fora"))'))],
                ordem='"kw_fora" DESC'), True),
            ("total", "Potência a biogás na GD (anel)", estilo_regras("ponto", [
                ("TRUE", "kW total no município", marcador(TINTA, 2, vazado=True, tamanho_expr=TAM))], ordem='"kw_total" DESC'), False),
        ],
        "usinas": [("modalidade", "Usinas a biogás na GD, por modalidade", estilo_regras("ponto", [
            (igual("modalidade", "propria"), "na própria unidade", marcador(COR_PROPRIA, 2, tamanho_expr='max(1, 0.09 * sqrt("kw"))')),
            (igual("modalidade", "remoto"), "autoconsumo remoto", marcador(COR_FORA, 2, tamanho_expr='max(1, 0.09 * sqrt("kw"))')),
            (igual("modalidade", "compartilhada"), "geração compartilhada", marcador(COR_COMP, 2, tamanho_expr='max(1, 0.09 * sqrt("kw"))')),
        ], ordem='"kw" DESC'), False)],
        "ufs": [("pct_fora", "Potência a biogás que credita outras unidades, % da UF", estilo_regras("poligono", regras_uf, rotulo_campo="SIGLA_UF"), True)],
        "limite_nacional": ESTILO_LIM,
    }
    cols_uf = ["SIGLA_UF", "regiao", "usinas_biogas", "kw_biogas", "kw_fora", "pct_fora", "uc_credito_fora", "classe"]
    tam = gravar("remoto", {"municipios": pts, "usinas": usinas, "ufs": ufs[cols_uf + ["geometry"]], "limite_nacional": lim}, estilos,
                 pts.drop(columns="geometry"))

    def partes(mod: dict) -> dict:
        tot = sum(v["kw"] for v in mod.values())
        return {k: {"kw": v["kw"], "n": v["n"], "uc": v["uc"], "pct": v["kw"] / tot * 100} for k, v in mod.items()}

    bio = partes(t["modalidade"]["biogas"])
    sol = partes(t["modalidade"]["solar"])
    fora = b[b["fora"]]
    sol_fora_kw = sum(sol[k]["kw"] for k in ("remoto", "compartilhada", "condominio"))
    sol_fora_uc = sum(sol[k]["uc"] for k in ("remoto", "compartilhada", "condominio"))
    # Municípios onde estão as usinas que creditam mais unidades.
    mu = fora.groupby(["cd_mun", "NM_MUN", "uf"]).agg(uc=("uc_credito", "sum"), kw=("kw", "sum"), n=("kw", "size"),
                                                       titulares=("titular", lambda s: sorted(set(s)))).sort_values("uc", ascending=False)
    cl = fora.groupby("classe")["kw"].sum()
    pj = fora.groupby("tipo_titular")["kw"].sum()
    car = b[(b["NM_MUN"] == "Cariacica") & b["fora"]]
    gravar_cache("gd-biogas-br-remoto", {
        "referencia": t["referencia"],
        "biogas": bio, "solar": sol,
        "bio_kw": float(b["kw"].sum()), "bio_fora_kw": float(fora["kw"].sum()), "bio_fora_n": int(len(fora)),
        "bio_fora_uc": int(fora["uc_credito"].sum()),
        "bio_fora_pct": float(fora["kw"].sum() / b["kw"].sum() * 100),
        "solar_fora_pct": float(sol_fora_kw / t["grupos"]["solar"]["kw"] * 100),
        "solar_fora_uc_mw": float(sol_fora_uc / (sol_fora_kw / 1000)), "bio_fora_uc_mw": float(fora["uc_credito"].sum() / (fora["kw"].sum() / 1000)),
        "classes_fora": {k: float(v) for k, v in cl.items()}, "pj_fora_pct": float(pj.get("PJ", 0) / fora["kw"].sum() * 100),
        "uc_mediana_fora": float(fora["uc_credito"].median()),
        "municipios_fora": int(fora["cd_mun"].nunique()),
        "maiores_uc": [{"nome": n, "uf": u, "uc": int(v.uc), "kw": float(v.kw), "n": int(v.n), "titulares": v.titulares}
                       for (cd, n, u), v in mu.head(8).iterrows()],
        "cariacica": {"n": int(len(car)), "kw": float(car["kw"].sum()), "uc": int(car["uc_credito"].sum()),
                      "fonte": sorted(car["fonte"].unique().tolist()), "modalidade": sorted(car["modalidade"].unique().tolist()),
                      "anos": sorted(car["ano"].unique().tolist()), "coord": [float(car["lon"].iloc[0]), float(car["lat"].iloc[0])]},
        "pontos": [[float(r.lon), float(r.lat), float(r.kw_total), float(r.kw_fora), int(r.uc_credito_fora)] for r in pts.itertuples()],
        "ufs": [{"uf": u, "kw": float(v.kw_biogas), "fora": float(v.kw_fora), "pct": None if pd.isna(v.pct_fora) else float(v.pct_fora),
                 "uc": int(v.uc_credito_fora), "n": int(v.usinas_biogas), "classe": int(v.classe)}
                for u, v in ufs.set_index("SIGLA_UF").sort_values("kw_biogas", ascending=False).iterrows()],
        "classes": [{"classe": i, "rotulo": r, "rotulo_en": en, "cor": cor} for i, ((r, en), cor) in enumerate(zip(ROT_FORA, CORES_FORA))],
        "tamanhos": tam,
    })
    print(tam)
    print(json.dumps(bio, indent=0)[:800]); print(json.dumps(sol)[:800])
    print("fora", fora["kw"].sum() / b["kw"].sum() * 100, "solar", sol_fora_kw / t["grupos"]["solar"]["kw"] * 100, fora["uc_credito"].sum(), sol_fora_uc)
    print(mu.head(10).to_string())
    print(ufs.loc[ufs["kw_biogas"] > 0, cols_uf].sort_values("kw_biogas", ascending=False).to_string())
    print(cl, pj)


# ------------------------------------------------------------------ 3 o biogás que chegou à conta de luz
CORTES = [2017, 2020, None]  # None = o registro todo


def tempo() -> None:
    m = municipios()
    b, t = usinas_biogas()
    b = com_municipio(b, m)
    ultimo = t["ultima_atualizacao"]["biogas"]
    g = b.groupby("cd_mun")
    mun = pd.DataFrame({"primeiro_ano": g["ano"].min(), "primeira_atualizacao": g["data_atualizacao"].min(),
                        "n_usinas": g.size(), "kw_total": g["kw"].sum()})
    for c in CORTES[:-1]:
        mun[f"kw_ate_{c}"] = b[b["ano"] <= c].groupby("cd_mun")["kw"].sum()
        mun[f"usinas_ate_{c}"] = b[b["ano"] <= c].groupby("cd_mun").size()
    mun = mun.fillna(0)
    mun["periodo"] = [next(k for k, a0, a1, *_ in PERIODOS if a0 <= a <= a1) for a in mun["primeiro_ano"]]
    mun = mun.reset_index().merge(m.drop(columns="geometry"), left_on="cd_mun", right_on="CD_MUN").drop(columns="CD_MUN")
    for c in CORTES[:-1]:
        mun[f"usinas_ate_{c}"] = mun[f"usinas_ate_{c}"].astype(int)
    cols = ["cd_mun", "NM_MUN", "SIGLA_UF", "regiao", "primeiro_ano", "primeira_atualizacao", "periodo", "n_usinas", "kw_total",
            "usinas_ate_2017", "kw_ate_2017", "usinas_ate_2020", "kw_ate_2020", "lon", "lat"]
    pts = gpd.GeoDataFrame(mun[cols], geometry=gpd.points_from_xy(mun["lon"], mun["lat"]), crs=GEO).sort_values("kw_total", ascending=False)
    pts = pts.reset_index(drop=True)
    ufs, lim = ufs_brasil(m)
    usinas = pontos_usinas(b)

    regras = [(igual("periodo", k), f"atualização mais antiga {r}", marcador(cor, 2, tamanho_expr=TAM)) for k, _, _, r, _, cor in PERIODOS]
    estilos = {
        "municipios": [("periodo", "Ano de atualização cadastral mais antigo do município (círculo: kW hoje)",
                        estilo_regras("ponto", regras, ordem='"kw_total" DESC'), True)],
        "usinas": [("ano", "Usinas a biogás na GD, por ano da última atualização cadastral", estilo_regras("ponto", [
            (f'"ano" >= {a0} AND "ano" <= {a1}', r, marcador(cor, 2, tamanho_expr='max(1, 0.09 * sqrt("kw"))')) for _, a0, a1, r, _, cor in PERIODOS],
            ordem='"kw" DESC'), False)],
        "ufs": ESTILO_UFS,
        "limite_nacional": ESTILO_LIM,
    }
    tam = gravar("tempo", {"municipios": pts, "usinas": usinas, "ufs": ufs, "limite_nacional": lim}, estilos, pts.drop(columns="geometry"))

    anos = list(range(int(b["ano"].min()), int(b["ano"].max()) + 1))
    pa = b.groupby("ano").agg(n=("kw", "size"), kw=("kw", "sum"), municipios_novos=("cd_mun", "nunique"))
    novos = mun.groupby("primeiro_ano").size()
    serie = []
    acum_kw = 0.0
    for a in anos:
        kw = float(pa["kw"].get(a, 0))
        acum_kw += kw
        tot = t["por_ano"]
        gd_ano = sum(tot[gr].get(str(a), {"kw": 0})["kw"] for gr in tot)
        serie.append({"ano": a, "n": int(pa["n"].get(a, 0)), "kw": kw, "kw_acum": acum_kw, "municipios_novos": int(novos.get(a, 0)),
                      "municipios_acum": int((mun["primeiro_ano"] <= a).sum()),
                      "por_classe": {k: float(b[(b["ano"] == a) & (b["classe"] == k)]["kw"].sum()) for k, *_ in CLASSES},
                      "pct_gd_ano": kw / gd_ano * 100 if gd_ano else None})
    cortes = []
    for c in CORTES:
        k = b if c is None else b[b["ano"] <= c]
        cortes.append({"ate": c, "n": int(len(k)), "kw": float(k["kw"].sum()), "municipios": int(k["cd_mun"].nunique()),
                       "ufs": int(k["uf"].nunique()),
                       "pontos": [[p, float(lo), float(la), float(kw)] for p, lo, la, kw in
                                  k.groupby("cd_mun").agg(lo=("lon", "first"), la=("lat", "first"), kw=("kw", "sum"))
                                  .join(mun.set_index("cd_mun")["periodo"]).pipe(lambda x: zip(x["periodo"], x["lo"], x["la"], x["kw"]))]})
    pr = b.sort_values("data_atualizacao").iloc[0]
    per = mun.groupby("periodo").agg(n=("cd_mun", "size"), kw=("kw_total", "sum"))
    uf_ini = mun.groupby("SIGLA_UF")["primeiro_ano"].min().sort_values()
    gravar_cache("gd-biogas-br-tempo", {
        "referencia": t["referencia"], "ultimo": ultimo, "ultimo_solar": t["ultima_atualizacao"]["solar"],
        "fim_registro": max(t["ultima_atualizacao"].values()),
        "atualizacoes_2026": t["atualizacoes_2026"],
        "primeira": {"data": pr.data_atualizacao, "municipio": pr.NM_MUN, "uf": pr.uf, "kw": float(pr.kw), "classe": pr.classe,
                     "fonte": pr.fonte},
        "serie": serie, "cortes": cortes,
        "periodos": [{"chave": k, "de": a0, "ate": a1, "rotulo": r, "rotulo_en": en, "cor": cor, "municipios": int(per.at[k, "n"]),
                      "kw": float(per.at[k, "kw"])} for k, a0, a1, r, en, cor in PERIODOS],
        "classes": [{"chave": k, "rotulo": r, "rotulo_en": en, "cor": cor} for k, r, en, cor in CLASSES],
        "uf_inicio": {u: int(a) for u, a in uf_ini.items()},
        "tamanhos": tam,
    })
    print(tam)
    print(pd.DataFrame(serie).drop(columns="por_classe").to_string())
    print(per, uf_ini.to_string(), pr.to_dict(), sep="\n")
    for c in cortes:
        print(c["ate"], c["n"], round(c["kw"]), c["municipios"], c["ufs"])


if __name__ == "__main__":
    temas = {"registro": registro, "rede": rede, "remoto": remoto, "tempo": tempo}
    ap = argparse.ArgumentParser()
    ap.add_argument("tema", choices=list(temas))
    temas[ap.parse_args().tema]()
