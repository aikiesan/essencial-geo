"""
Coleção «O que a prefeitura faz com o resto» (Brasil) — prepara os dados de uma prancha (uso interno).

    .venv-geo/Scripts/python scripts/colecoes/residuo-organico-br/preparar.py composto|consorcio|taxa

Saídas: mapas/<pasta>/dados/<base>.gpkg.zip (com estilos do QGIS), <base>.csv
e scripts/colecoes/cache/residuo-organico-br-<tema>.json (para a prancha e a ficha).
Fonte: IBGE, Pesquisa de Informações Básicas Municipais (MUNIC) 2023, Suplemento de Saneamento, aba «Resíduos Sólidos»
(dados-brutos/ibge/munic-saneamento-2023/), sobre a malha municipal de 2025 da série dos estados.
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
    AREA_BR, GEO, RAIZ, TINTA, estilo_contorno, estilo_regras, gravar_cache, gravar_estilos, igual, para_d3, zipar,
)
from estilos import preenchimento  # noqa: E402

SERIE = {s["tema"]: s for s in json.loads((Path(__file__).parent / "serie.json").read_text(encoding="utf-8"))}
MALHA_BR = RAIZ / "scripts" / "estados" / "cache" / "brasil_0_004.gpkg"
MUNIC = RAIZ / "dados-brutos" / "ibge" / "munic-saneamento-2023" / "Base_de_Dados_Suplemento_de_Saneamento_2023.xlsx"
CACHE_MUNIC = RAIZ / "scripts" / "colecoes" / "cache" / "residuo-organico-br-munic-rs.csv"
REGIOES = {"1": "Norte", "2": "Nordeste", "3": "Sudeste", "4": "Sul", "5": "Centro-Oeste"}
REGIAO_EN = {"Norte": "North", "Nordeste": "Northeast", "Sudeste": "Southeast", "Sul": "South", "Centro-Oeste": "Centre-West"}
ORDEM_REG = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"]
FAIXAS = [  # Faixa_pop da MUNIC → rótulos curtos
    ("1 - Até 5000", "até 5 mil", "up to 5 k"), ("2 - 5001 até 10000", "5 a 10 mil", "5–10 k"),
    ("3 - 10001 até 20000", "10 a 20 mil", "10–20 k"), ("4 - 20001 até 50000", "20 a 50 mil", "20–50 k"),
    ("5 - 50001 até 100000", "50 a 100 mil", "50–100 k"), ("6 - 100001 até 500000", "100 a 500 mil", "100–500 k"),
    ("7 - Maior que 500000", "mais de 500 mil", "over 500 k"),
]
SEM_DADO = "#d5d9dd"
# Colunas da MUNIC usadas (dicionário na aba «Dicionário»).
COLS = {
    "SMRS27": "coleta_convencional", "SMRS28": "coleta_seletiva", "SMRS32": "trata_organicos", "SMRS31": "trata_secos",
    "SMRS41": "bota_fora", "SMRS42": "vazadouro", "SMRS43": "vazadouro_alagavel", "SMRS44": "aterro_controlado",
    "SMRS45": "aterro_sanitario", "SMRS46": "unidade_compostagem", "SMRS13": "plano_residuos",
    "SMRS65": "regionalizado", "SMRS6511": "reg_metropolitana", "SMRS6512": "reg_unidade_regional", "SMRS6513": "reg_bloco",
    "SMRS6515": "consorcio", "SMRS6516": "reg_compartilhamento", "SMRS671": "cons_coleta", "SMRS674": "cons_seletiva",
    "SMRS679": "cons_organicos", "SMRS6710": "cons_transbordo", "SMRS6711": "cons_disposicao",
    "SMRS59": "entidades_catadores", "SMRS75": "cobranca", "SMRS751": "cobranca_instrumento", "SMRS752": "cobranca_cobre_custos",
    "SMRS761": "nao_cobra_resistencia", "SMRS762": "nao_cobra_parametros", "SMRS763": "nao_cobra_lei",
}


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


def munic() -> pd.DataFrame:
    """Aba «Resíduos Sólidos» da MUNIC 2023 (lida uma vez e guardada em CSV no cache)."""
    if not CACHE_MUNIC.exists():
        r = pd.read_excel(MUNIC, sheet_name="Resíduos Sólidos", dtype=str)
        r = r[["Codmun", "Uf", "Mun", "PopMun", "Faixa_pop", "Regiao", *COLS]]
        r.to_csv(CACHE_MUNIC, index=False, encoding="utf-8")
    r = pd.read_csv(CACHE_MUNIC, dtype=str, encoding="utf-8")
    assert len(r) == 5570 and r["Codmun"].is_unique
    r = r.rename(columns={"Codmun": "CD_MUN", "PopMun": "pop_2022", **COLS})
    r["pop_2022"] = pd.to_numeric(r["pop_2022"])
    for c in COLS.values():
        r[c] = r[c].str.strip()
    # Resposta válida: o município tem o serviço e respondeu (14 não: 8 sem o serviço, 5 recusas, 1 não informou).
    r["respondeu"] = r["coleta_convencional"].eq("Sim")
    r["situacao_munic"] = np.where(r["respondeu"], "respondeu", r["coleta_convencional"])
    for c in COLS.values():
        if c not in ("cobranca_instrumento", "plano_residuos"):
            r[f"_{c}"] = r[c].eq("Sim")
    r["lixao"] = r["_vazadouro"] | r["_vazadouro_alagavel"]
    return r


def municipios() -> gpd.GeoDataFrame:
    """Municípios da malha simplificada da série dos estados (2025), com UF e região."""
    m = gpd.read_file(MALHA_BR, engine="pyogrio").set_crs(GEO, allow_override=True)
    m = m[m["CD_MUN"].str.match(r"^\d{7}$") & m["CD_RGINT"].notna()][["CD_MUN", "NM_MUN", "SIGLA_UF", "geometry"]]
    m["regiao"] = m["CD_MUN"].str[0].map(REGIOES)
    return m.reset_index(drop=True)


def juntar() -> tuple[gpd.GeoDataFrame, pd.DataFrame]:
    m = municipios()
    r = munic()
    fora = sorted(set(r["CD_MUN"]) - set(m["CD_MUN"]))
    assert not fora, fora
    print("na malha, fora da MUNIC 2023:", m.loc[~m["CD_MUN"].isin(r["CD_MUN"]), ["CD_MUN", "NM_MUN", "SIGLA_UF"]].to_dict("records"))
    g = m.merge(r.drop(columns=["Uf", "Regiao"]), on="CD_MUN", how="left")
    g["respondeu"] = g["respondeu"].fillna(False).astype(bool)
    g["situacao_munic"] = g["situacao_munic"].fillna("criado depois de 2023")
    pos = g.geometry.to_crs(AREA_BR).representative_point().to_crs(GEO)
    g["lon"], g["lat"] = pos.x.round(3), pos.y.round(3)
    return g, r


def ufs_brasil(m: gpd.GeoDataFrame) -> tuple[gpd.GeoDataFrame, gpd.GeoDataFrame]:
    ufs = m.dissolve(by=["SIGLA_UF", "regiao"], as_index=False)[["SIGLA_UF", "regiao", "geometry"]]
    lim = m.assign(pais="Brasil").dissolve(by="pais", as_index=False)[["pais", "geometry"]]
    return ufs, lim


def faixa_rot(f: str) -> tuple[str, str]:
    return next((pt, en) for k, pt, en in FAIXAS if k == f)


def pct(a, b) -> float:
    return round(float(a) / float(b) * 100, 1) if b else 0.0


def cidade(g: pd.Series) -> dict:
    return {"cd": g.CD_MUN, "nome": g.NM_MUN, "uf": g.SIGLA_UF, "pop": int(g.pop_2022), "coord": [float(g.lon), float(g.lat)]}


def regras_classes(classes: list[tuple], campo: str = "classe") -> list:
    r = [(igual(campo, k), rot, preenchimento(cor, "#ffffff", 0.05)) for k, rot, _, cor in classes]
    r.append((igual(campo, -2), "sem informação na MUNIC 2023", preenchimento(SEM_DADO, "#ffffff", 0.05)))
    return r


def comum_cache(g: gpd.GeoDataFrame, classes: list[tuple]) -> dict:
    """Contagem de municípios e população por classe, e o desenho dos municípios para a prancha."""
    ok = g[g["classe"] != -2]
    pop = float(ok["pop_2022"].sum())
    return {
        "municipios": para_d3(g, ["CD_MUN", "classe"], tol=0.012, casas=3),
        "classes": [{"classe": k, "rotulo": r, "rotulo_en": en, "cor": cor, "municipios": int((g["classe"] == k).sum()),
                     "pop": int(g.loc[g["classe"] == k, "pop_2022"].sum()),
                     "pop_pct": pct(g.loc[g["classe"] == k, "pop_2022"].sum(), pop)} for k, r, en, cor in classes],
        "sem_dado": g.loc[g["classe"] == -2, ["CD_MUN", "NM_MUN", "SIGLA_UF", "situacao_munic"]].to_dict("records"),
        "respondentes": int(len(ok)), "pop_respondentes": int(pop), "municipios_malha": int(len(g)),
    }


# ------------------------------------------------------------------ 1 quem faz composto
CLASSES_COMPOSTO = [
    (0, "trata orgânicos e tem unidade de compostagem", "treats organics and has a composting unit", "#3f6b2e"),
    (1, "trata orgânicos, sem unidade no município", "treats organics, no unit in town", "#9dbb73"),
    (2, "só a unidade, sem tratamento municipal", "a unit only, no municipal treatment", "#d9bf73"),
    (3, "não trata orgânicos", "no organic-waste treatment", "#f3f1ea"),
]


def composto() -> None:
    g, _ = juntar()
    org, uni = g["_trata_organicos"].fillna(False).astype(bool), g["_unidade_compostagem"].fillna(False).astype(bool)
    g["classe"] = np.select([~g["respondeu"], org & uni, org, uni], [-2, 0, 1, 2], 3).astype(int)
    ok = g[g["respondeu"]].copy()
    ok["org"] = ok["_trata_organicos"].astype(bool)
    pop = ok["pop_2022"].sum()

    fx = ok.groupby("Faixa_pop").agg(n=("CD_MUN", "size"), org=("org", "sum"))
    reg = ok.groupby("regiao").apply(lambda d: pd.Series({
        "n": len(d), "org": int(d["org"].sum()), "pop": d["pop_2022"].sum(), "pop_org": d.loc[d["org"], "pop_2022"].sum()}))
    uf = ok.groupby("SIGLA_UF").agg(n=("CD_MUN", "size"), org=("org", "sum"), pop=("pop_2022", "sum"))
    uf["pct"] = uf["org"] / uf["n"] * 100
    grandes = ok.sort_values("pop_2022", ascending=False)
    sem_grandes = grandes[~grandes["org"]].head(6)
    com_lixao = ok[ok["org"] & ok["lixao"]]
    tem_seletiva = ok[ok["org"]]["_coleta_seletiva"].mean() * 100

    ufs, lim = ufs_brasil(g)
    cols = ["CD_MUN", "NM_MUN", "SIGLA_UF", "regiao", "pop_2022", "Faixa_pop", "situacao_munic", "trata_organicos",
            "unidade_compostagem", "coleta_seletiva", "vazadouro", "aterro_sanitario", "classe"]
    g["faixa_classe"] = g["classe"].map({k: r for k, r, *_ in CLASSES_COMPOSTO}).fillna("sem informação")
    cols.append("faixa_classe")
    estilos = {
        "municipios": [("tratamento", "Tratamento de resíduos orgânicos, MUNIC 2023", estilo_regras("poligono", regras_classes(CLASSES_COMPOSTO)), True)],
        "ufs": [("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    gm = g[cols + ["lon", "lat", "geometry"]].sort_values("CD_MUN").reset_index(drop=True)
    tam = gravar("composto", {"municipios": gm, "ufs": ufs, "limite_nacional": lim}, estilos, gm.drop(columns="geometry"))

    gravar_cache("residuo-organico-br-composto", {
        **comum_cache(gm, CLASSES_COMPOSTO),
        "org": int(ok["org"].sum()), "org_pct": pct(ok["org"].sum(), len(ok)),
        "pop_org": int(ok.loc[ok["org"], "pop_2022"].sum()), "pop_org_pct": pct(ok.loc[ok["org"], "pop_2022"].sum(), pop),
        "unidades": int(ok["_unidade_compostagem"].sum()),
        "faixas": [{"rotulo": faixa_rot(k)[0], "rotulo_en": faixa_rot(k)[1], "n": int(v.n), "org": int(v.org), "pct": pct(v.org, v.n)}
                   for k, v in fx.iterrows()],
        "regioes": [{"regiao": k, "regiao_en": REGIAO_EN[k], "n": int(reg.at[k, "n"]), "org": int(reg.at[k, "org"]),
                     "pct": pct(reg.at[k, "org"], reg.at[k, "n"]), "pop_pct": pct(reg.at[k, "pop_org"], reg.at[k, "pop"])} for k in ORDEM_REG],
        "ufs": [{"uf": k, "n": int(v.n), "org": int(v.org), "pct": round(float(v.pct), 1)} for k, v in uf.sort_values("pct", ascending=False).iterrows()],
        "maiores_sem": [cidade(r) for _, r in sem_grandes.iterrows()],
        "capitais_sem_pop": int(sem_grandes.head(3)["pop_2022"].sum()),
        "org_com_lixao": int(len(com_lixao)), "org_com_seletiva_pct": round(float(tem_seletiva), 1),
        "tamanhos": tam,
    })
    print(tam)
    print(gm["classe"].value_counts().sort_index().to_string())
    print(fx.assign(p=fx.org / fx.n * 100).round(1).to_string())
    print(reg.to_string())
    print(uf.sort_values("pct", ascending=False).round(1).to_string())
    print(sem_grandes[["NM_MUN", "SIGLA_UF", "pop_2022"]].to_string())
    print("org", ok["org"].sum(), "pop%", pct(ok.loc[ok["org"], "pop_2022"].sum(), pop), "com lixão", len(com_lixao), "seletiva%", tem_seletiva)


# ------------------------------------------------------------------ 2 o lixo em consórcio
CLASSES_CONSORCIO = [
    (0, "consórcio público de resíduos", "public waste consortium", "#2f4f6f"),
    (1, "outro arranjo regional, sem consórcio", "other regional arrangement, no consortium", "#8fb0c9"),
    (2, "cuida do lixo sozinho", "manages its waste alone", "#f3f1ea"),
]
SERVICOS = [("cons_disposicao", "disposição final no solo", "final disposal on land"), ("cons_coleta", "coleta convencional", "kerbside collection"),
            ("cons_transbordo", "transporte e transbordo", "transport and transfer"), ("cons_seletiva", "coleta seletiva", "separate collection"),
            ("cons_organicos", "tratamento de orgânicos", "organic-waste treatment")]


def consorcio() -> None:
    g, _ = juntar()
    cons = g["_consorcio"].fillna(False).astype(bool)
    reg_ = g["_regionalizado"].fillna(False).astype(bool)
    g["classe"] = np.select([~g["respondeu"], cons, reg_], [-2, 0, 1], 2).astype(int)
    ok = g[g["respondeu"]].copy()
    ok["cons"] = ok["classe"] == 0
    ok["so"] = ok["classe"] == 2
    pop = ok["pop_2022"].sum()

    uf = ok.groupby("SIGLA_UF").agg(n=("CD_MUN", "size"), cons=("cons", "sum"), outro=("classe", lambda s: int((s == 1).sum())))
    uf["pct"] = uf["cons"] / uf["n"] * 100
    # Lixão no território, por porte: com consórcio × sozinho (o consórcio é coisa de cidade pequena).
    fx = ok.groupby("Faixa_pop").apply(lambda d: pd.Series({
        "n_cons": int(d["cons"].sum()), "lix_cons": int((d["cons"] & d["lixao"]).sum()),
        "n_so": int(d["so"].sum()), "lix_so": int((d["so"] & d["lixao"]).sum())}))
    c = ok[ok["cons"]]
    servicos = [{"chave": k, "rotulo": r, "rotulo_en": en, "n": int(c[f"_{k}"].sum()), "pct": pct(c[f"_{k}"].sum(), len(c))} for k, r, en in SERVICOS]
    lix = {k: {"n": int(d.shape[0]), "lixao": int(d["lixao"].sum()), "pct": pct(d["lixao"].sum(), len(d)),
               "aterro_pct": pct(d["_aterro_sanitario"].sum(), len(d))}
           for k, d in (("cons", c), ("outro", ok[ok["classe"] == 1]), ("so", ok[ok["so"]]))}
    pequenos = ok[ok["pop_2022"] <= 20000]
    lix_peq = {k: pct((d["lixao"]).sum(), len(d)) for k, d in (("cons", pequenos[pequenos["cons"]]), ("so", pequenos[pequenos["so"]]))}
    maior = c.sort_values("pop_2022", ascending=False).iloc[0]
    reg = ok.groupby("regiao").agg(n=("CD_MUN", "size"), cons=("cons", "sum"))

    ufs, lim = ufs_brasil(g)
    ufs["municipios"] = ufs["SIGLA_UF"].map(uf["n"]).fillna(0).astype(int)
    ufs["em_consorcio"] = ufs["SIGLA_UF"].map(uf["cons"]).fillna(0).astype(int)
    ufs["em_consorcio_pct"] = ufs["SIGLA_UF"].map(uf["pct"]).round(1)
    g["arranjo"] = g["classe"].map({k: r for k, r, *_ in CLASSES_CONSORCIO}).fillna("sem informação")
    cols = ["CD_MUN", "NM_MUN", "SIGLA_UF", "regiao", "pop_2022", "Faixa_pop", "situacao_munic", "regionalizado", "consorcio",
            "reg_metropolitana", "reg_unidade_regional", "reg_bloco", "reg_compartilhamento", "cons_coleta", "cons_seletiva",
            "cons_organicos", "cons_transbordo", "cons_disposicao", "vazadouro", "vazadouro_alagavel", "aterro_sanitario", "classe", "arranjo"]
    estilos = {
        "municipios": [("arranjo", "Gestão regionalizada dos resíduos sólidos, MUNIC 2023", estilo_regras("poligono", regras_classes(CLASSES_CONSORCIO)), True)],
        "ufs": [("ufs", "Municípios em consórcio por UF (%)", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    gm = g[cols + ["lon", "lat", "geometry"]].sort_values("CD_MUN").reset_index(drop=True)
    tam = gravar("consorcio", {"municipios": gm, "ufs": ufs[["SIGLA_UF", "regiao", "municipios", "em_consorcio", "em_consorcio_pct", "geometry"]],
                               "limite_nacional": lim}, estilos, gm.drop(columns="geometry"))
    gravar_cache("residuo-organico-br-consorcio", {
        **comum_cache(gm, CLASSES_CONSORCIO),
        "cons": int(len(c)), "cons_pct": pct(len(c), len(ok)), "pop_cons_pct": pct(c["pop_2022"].sum(), pop),
        "pop_cons": int(c["pop_2022"].sum()), "mediana_pop_cons": int(c["pop_2022"].median()),
        "mediana_pop_so": int(ok.loc[ok["so"], "pop_2022"].median()),
        "regionalizado": int(ok["_regionalizado"].sum()),
        "ufs": [{"uf": k, "n": int(v.n), "cons": int(v.cons), "pct": round(float(v.pct), 1)} for k, v in uf.sort_values("pct", ascending=False).iterrows()],
        "regioes": [{"regiao": k, "regiao_en": REGIAO_EN[k], "n": int(reg.at[k, "n"]), "cons": int(reg.at[k, "cons"]),
                     "pct": pct(reg.at[k, "cons"], reg.at[k, "n"])} for k in ORDEM_REG],
        "faixas": [{"rotulo": faixa_rot(k)[0], "rotulo_en": faixa_rot(k)[1], **{a: int(b) for a, b in v.items()},
                    "pct_cons": pct(v.lix_cons, v.n_cons), "pct_so": pct(v.lix_so, v.n_so)} for k, v in fx.iterrows()],
        "lixao": lix, "lixao_pequenos": lix_peq, "servicos": servicos,
        "maior_cons": cidade(maior),
        "tamanhos": tam,
    })
    print(tam)
    print(gm["classe"].value_counts().sort_index().to_string())
    print(uf.sort_values("pct", ascending=False).round(1).to_string())
    print(fx.to_string())
    print(lix, lix_peq)
    print(servicos)
    print("medianas", c["pop_2022"].median(), ok.loc[ok["so"], "pop_2022"].median(), "maior", maior.NM_MUN, maior.SIGLA_UF, maior.pop_2022)
    print(pd.crosstab(ok["_consorcio"], ok["_cons_disposicao"]))


# ------------------------------------------------------------------ 3 a taxa e o lixão
CLASSES_TAXA = [
    (0, "sem taxa, sem lixão", "no fee, no dump", "#f3f1ea"),
    (1, "cobra taxa, sem lixão", "charges a fee, no dump", "#7fa3a6"),
    (2, "sem taxa, com lixão", "no fee, has a dump", "#d39a6a"),
    (3, "cobra taxa e tem lixão", "charges a fee and has a dump", "#6b3348"),
]


def taxa() -> None:
    g, _ = juntar()
    cob = g["_cobranca"].fillna(False).astype(bool)
    lix = g["lixao"].fillna(False).astype(bool)
    g["classe"] = np.where(~g["respondeu"], -2, cob.astype(int) + 2 * lix.astype(int)).astype(int)
    ok = g[g["respondeu"]].copy()
    ok["cob"] = ok["_cobranca"].astype(bool)
    ok["lix"] = ok["lixao"].astype(bool)
    pop = ok["pop_2022"].sum()
    reg = pd.crosstab(ok["regiao"], ok["classe"]).reindex(ORDEM_REG).reindex(columns=[0, 1, 2, 3], fill_value=0)
    fx = ok.groupby("Faixa_pop").apply(lambda d: pd.Series({"n": len(d), "cob": int(d["cob"].sum()), "lix": int(d["lix"].sum()),
                                                             "ambos": int((d["cob"] & d["lix"]).sum())}))
    sem = ok[~ok["cob"]]
    com = ok[ok["cob"]]
    ambos = ok[ok["cob"] & ok["lix"]].sort_values("pop_2022", ascending=False)
    uf_amb = ambos.groupby("SIGLA_UF").size().sort_values(ascending=False)
    norte_sem_lix = ok[(ok["regiao"] == "Norte")]
    ufs, lim = ufs_brasil(g)
    g["combinacao"] = g["classe"].map({k: r for k, r, *_ in CLASSES_TAXA}).fillna("sem informação")
    cols = ["CD_MUN", "NM_MUN", "SIGLA_UF", "regiao", "pop_2022", "Faixa_pop", "situacao_munic", "cobranca", "cobranca_instrumento",
            "cobranca_cobre_custos", "vazadouro", "vazadouro_alagavel", "bota_fora", "aterro_controlado", "aterro_sanitario",
            "nao_cobra_resistencia", "nao_cobra_parametros", "nao_cobra_lei", "classe", "combinacao"]
    estilos = {
        "municipios": [("taxa_lixao", "Cobrança pelo manejo de resíduos × vazadouro a céu aberto no município, MUNIC 2023",
                        estilo_regras("poligono", regras_classes(CLASSES_TAXA)), True)],
        "ufs": [("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    gm = g[cols + ["lon", "lat", "geometry"]].sort_values("CD_MUN").reset_index(drop=True)
    tam = gravar("taxa", {"municipios": gm, "ufs": ufs, "limite_nacional": lim}, estilos, gm.drop(columns="geometry"))
    motivos = [{"chave": k, "rotulo": r, "rotulo_en": en, "n": int(sem[f"_{k}"].sum()), "pct": pct(sem[f"_{k}"].sum(), len(sem))}
               for k, r, en in (("nao_cobra_lei", "falta lei municipal", "no municipal law"),
                                ("nao_cobra_resistencia", "resistência da população", "residents push back"),
                                ("nao_cobra_parametros", "faltam dados para fixar o valor", "no data to set the amount"))]
    gravar_cache("residuo-organico-br-taxa", {
        **comum_cache(gm, CLASSES_TAXA),
        "cobra": int(len(com)), "cobra_pct": pct(len(com), len(ok)), "pop_cobra_pct": pct(com["pop_2022"].sum(), pop),
        "lixao": int(ok["lix"].sum()), "lixao_pct": pct(ok["lix"].sum(), len(ok)), "pop_lixao": int(ok.loc[ok["lix"], "pop_2022"].sum()),
        "lixao_sem_taxa_pct": pct(sem["lix"].sum(), len(sem)), "lixao_com_taxa_pct": pct(com["lix"].sum(), len(com)),
        "ambos": int(len(ambos)), "pop_ambos": int(ambos["pop_2022"].sum()),
        "cobre_custos": int(com["_cobranca_cobre_custos"].sum()), "cobre_custos_pct": pct(com["_cobranca_cobre_custos"].sum(), len(com)),
        "com_lei": int((com["cobranca_instrumento"] == "Com legislação específica").sum()),
        "sem_taxa": int(len(sem)), "motivos": motivos,
        "regioes": [{"regiao": k, "regiao_en": REGIAO_EN[k], "n": int(reg.loc[k].sum()), **{f"c{c}": int(reg.at[k, c]) for c in range(4)}}
                    for k in ORDEM_REG],
        "faixas": [{"rotulo": faixa_rot(k)[0], "rotulo_en": faixa_rot(k)[1], **{a: int(b) for a, b in v.items()}} for k, v in fx.iterrows()],
        "maiores_ambos": [cidade(r) for _, r in ambos.head(5).iterrows()],
        "ufs_ambos": {k: int(v) for k, v in uf_amb.items()},
        "norte_sem_taxa_com_lixao_pct": pct((norte_sem_lix["classe"] == 2).sum(), len(norte_sem_lix)),
        "tamanhos": tam,
    })
    print(tam)
    print(gm["classe"].value_counts().sort_index().to_string())
    print(reg.to_string())
    print(fx.to_string())
    print(ambos.head(8)[["NM_MUN", "SIGLA_UF", "pop_2022"]].to_string())
    print(uf_amb.head(8).to_string())
    print(motivos, "cobre", com["_cobranca_cobre_custos"].sum(), "lixão sem/com", pct(sem["lix"].sum(), len(sem)), pct(com["lix"].sum(), len(com)))


if __name__ == "__main__":
    temas = {"composto": composto, "consorcio": consorcio, "taxa": taxa}
    ap = argparse.ArgumentParser()
    ap.add_argument("tema", choices=list(temas))
    temas[ap.parse_args().tema]()
