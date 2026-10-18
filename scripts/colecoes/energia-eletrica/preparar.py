"""
Coleção «Energia elétrica no Brasil» — prepara os dados de uma prancha (uso interno).

    .venv-geo/Scripts/python scripts/colecoes/energia-eletrica/preparar.py base
    .venv-geo/Scripts/python scripts/colecoes/energia-eletrica/preparar.py transmissao
    .venv-geo/Scripts/python scripts/colecoes/energia-eletrica/preparar.py usinas
    .venv-geo/Scripts/python -I scripts/colecoes/energia-eletrica/preparar.py solar

Saídas: mapas/<pasta>/dados/<base>.gpkg.zip (com estilos do QGIS), <base>.csv
e scripts/colecoes/cache/energia-eletrica-<tema>.json (para a prancha e a ficha).
`base` grava scripts/colecoes/cache/brasil-base.json (UFs, regiões e limite para a prancha nacional).
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import geopandas as gpd
import pandas as pd
import shapely

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from comum import (  # noqa: E402
    AREA_BR, DADOS, GEO, MINERAIS, RAIZ, TINTA, estilo_contorno, estilo_regras, gravar_cache, gravar_estilos, igual,
    km_geodesico, linha, marcador, para_d3, siga, zipar,
)
from estilos import preenchimento, qml, rotulo, simbolo, unico  # noqa: E402

PASTAS = {
    "transmissao": "042-transmissao-brasil",
    "usinas": "043-usinas-por-fonte-brasil",
    "solar": "044-geracao-solar-distribuida-brasil",
}
MALHA_BR = RAIZ / "scripts" / "estados" / "cache" / "brasil_0_004.gpkg"
INFRA_REDE = DADOS / "shapefiles" / "mapbiomas_infra"
GD_ZIP = RAIZ / "scripts" / "colecoes" / "cache" / "downloads" / "aneel_gd" / "empreendimento-geracao-distribuida.csv"  # é um ZIP
CENSO = DADOS / "raw" / "ibge_censo2022" / "Agregados_por_municipios_basico_BR.csv"
REGIOES = {"1": "Norte", "2": "Nordeste", "3": "Sudeste", "4": "Sul", "5": "Centro-Oeste"}
PAPEL_ = "#ffffff"


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


def ufs_brasil() -> tuple[gpd.GeoDataFrame, gpd.GeoDataFrame, gpd.GeoDataFrame]:
    """UFs, grandes regiões e limite do país, da malha municipal simplificada da série dos estados."""
    m = gpd.read_file(MALHA_BR, engine="pyogrio").set_crs(GEO, allow_override=True)
    m = m[m["CD_MUN"].str.match(r"^\d{7}$") & m["CD_RGINT"].notna()]  # fora: lagoas sem município
    m["regiao"] = m["CD_MUN"].str[0].map(REGIOES)
    ufs = m.dissolve(by=["SIGLA_UF", "NM_UF", "regiao"], as_index=False)[["SIGLA_UF", "NM_UF", "regiao", "geometry"]]
    reg = m.dissolve(by="regiao", as_index=False)[["regiao", "geometry"]]
    lim = m.assign(pais="Brasil").dissolve(by="pais", as_index=False)[["pais", "geometry"]]
    assert len(ufs) == 27 and len(reg) == 5
    return ufs, reg, lim


def base() -> None:
    ufs, reg, lim = ufs_brasil()
    rot = ufs.to_crs(AREA_BR).representative_point().to_crs(GEO)
    df = ufs[ufs["SIGLA_UF"] == "DF"].to_crs(AREA_BR).representative_point().to_crs(GEO).iloc[0]
    ufs = ufs.assign(rotulo=[[round(p.x, 3), round(p.y, 3)] for p in rot])
    gravar_cache("brasil-base", {
        "ufs": para_d3(ufs, ["SIGLA_UF", "NM_UF", "regiao", "rotulo"], tol=0.02),
        "regioes": para_d3(reg, ["regiao"], tol=0.02),
        "limite": para_d3(lim, ["pais"], tol=0.02),
        "capital": {"nome": "Brasília", "coord": [round(df.x, 3), round(df.y, 3)]},
    })
    print("base ok")


def sigla_uf(pts: gpd.GeoDataFrame, ufs: gpd.GeoDataFrame) -> pd.Series:
    j = gpd.sjoin(pts[["geometry"]], ufs[["SIGLA_UF", "geometry"]], how="left", predicate="within")
    j = j[~j.index.duplicated()]
    return j["SIGLA_UF"]


# ------------------------------------------------------------------ 1/3 transmissão
FAIXAS = [  # (rótulo, cor, largura na prancha)
    ("até 230 kV", MINERAIS["ocre"], 0.9),
    ("345 e 440 kV", MINERAIS["argila"], 1.4),
    ("500 a 765 kV", MINERAIS["ameixa"], 1.9),
    ("600 e 800 kV, corrente contínua", MINERAIS["azul_profundo"], 2.8),
]


def faixa(kv: float) -> str:
    """As linhas de 600 e 800 kV do Brasil são em corrente contínua (Itaipu, Madeira, Belo Monte); 765 kV é alternada."""
    if kv <= 230:
        return FAIXAS[0][0]
    if kv <= 440:
        return FAIXAS[1][0]
    if kv in (600, 800):
        return FAIXAS[3][0]
    return FAIXAS[2][0]


def transmissao() -> None:
    ufs, _, lim = ufs_brasil()
    lt = gpd.read_file(INFRA_REDE / "structure_transmission_line" / "LT_EXISTENTE.shp", engine="pyogrio", encoding="latin1")
    lt = lt.set_crs(GEO, allow_override=True)
    lt = gpd.GeoDataFrame({
        "nome": lt["Nome"].str.strip(), "concessionaria": lt["Concession"].str.strip(), "tensao_kv": lt["Tensao"],
        "extensao_km": lt["Extensao"].round(2), "ano_operacao": lt["Ano_Opera"].where(lt["Ano_Opera"] > 0),
    }, geometry=lt.geometry.values, crs=GEO)
    lt["faixa"] = lt["tensao_kv"].map(faixa)
    lt["corrente_continua"] = lt["tensao_kv"].isin([600, 800])  # Itaipu, Madeira e Belo Monte
    se = gpd.read_file(INFRA_REDE / "structure_substation" / "SE_EXISTENTE.shp", engine="pyogrio", encoding="latin1")
    se = gpd.GeoDataFrame({
        "nome": se["Nome"].str.strip(), "concessionaria": se["Concession"].str.strip(), "tensao_kv": se["Tensao"],
        "ano_operacao": pd.to_numeric(se["Ano_Opera"], errors="coerce"),
    }, geometry=se.geometry.values, crs=GEO).set_crs(GEO, allow_override=True)
    se["tensao_max_kv"] = se["tensao_kv"].str.replace(",", ".").str.split("/").map(lambda xs: max(float(x) for x in xs if x.strip()))
    se["uf"] = sigla_uf(se, ufs)

    estilo_lt = estilo_regras("linha", [
        (f"&quot;faixa&quot; = '{r}'", r, linha(c, round(w * 0.32, 2))) for r, c, w in FAIXAS
    ], ordem='"tensao_kv" ASC')
    estilo_se = qml(unico(simbolo("marker", "0", marcador(PAPEL_, 1.4, borda=TINTA, largura_borda=0.3, alfa=1))), "ponto",
                    rotulo("nome", tamanho=6, cor="#33373a", escala_max=3_000_000, prioridade=3))
    estilos = {
        "linhas_transmissao": [("tensao", "Faixas de tensão, como na prancha", estilo_lt, True)],
        "subestacoes": [("subestacoes", "Subestações", estilo_se, True)],
        "ufs": [("ufs", "Limites estaduais", estilo_contorno("#9aa3ab", 0.25, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    camadas = {"linhas_transmissao": lt, "subestacoes": se, "ufs": ufs, "limite_nacional": lim}
    csv = lt.drop(columns="geometry")
    tam = gravar("transmissao", "br_transmissao", camadas, estilos, csv)

    por_faixa = {r: {"trechos": int((lt["faixa"] == r).sum()), "km": round(float(lt.loc[lt["faixa"] == r, "extensao_km"].sum()), 0)}
                 for r, *_ in FAIXAS}
    cc = lt[lt["faixa"] == FAIXAS[3][0]]
    assert cc["corrente_continua"].all() and cc["nome"].str.contains("Foz do Igua|Coletora|Xingu").all(), "faixa CC"
    longas = lt.sort_values("extensao_km", ascending=False).drop_duplicates("nome").head(6)
    meio = lambda g: g.interpolate(0.5, normalized=True)  # noqa: E731
    gravar_cache("energia-eletrica-transmissao", {
        "linhas": para_d3(lt.sort_values("tensao_kv"), ["faixa", "tensao_kv"], tol=0.01),
        "subestacoes": [[round(p.x, 3), round(p.y, 3)] for p in se.geometry],
        "faixas": [{"rotulo": r, "cor": c, "largura": w, **por_faixa[r]} for r, c, w in FAIXAS],
        "trechos": len(lt), "km_campo": round(float(lt["extensao_km"].sum()), 0), "km_geodesico": round(km_geodesico(lt), 0),
        "subestacoes_n": len(se), "ano_max": int(lt["ano_operacao"].max()), "sem_ano": int(lt["ano_operacao"].isna().sum()),
        "longas": [{"nome": r.nome, "tensao_kv": r.tensao_kv, "km": r.extensao_km, "ano": None if pd.isna(r.ano_operacao) else int(r.ano_operacao),
                    "meio": [round(meio(r.geometry).x, 3), round(meio(r.geometry).y, 3)]} for r in longas.itertuples()],
        "se_por_uf": se["uf"].value_counts().to_dict(),
        "tamanhos": tam,
    })
    print(por_faixa, len(lt), len(se), lt["extensao_km"].sum(), km_geodesico(lt), tam)
    print(longas[["nome", "tensao_kv", "extensao_km", "ano_operacao"]].to_string())


# ------------------------------------------------------------------ 2/3 usinas por fonte
FONTES = [  # (chave, camada do MapBiomas, rótulo, rótulo EN, cor)
    ("uhe", "structure_hydroelectric_power_plant", "Hidrelétrica (UHE)", "Large hydro (UHE)", MINERAIS["azul_profundo"]),
    ("pch", "structure_small_hydropower_plant", "Pequena central hidrelétrica (PCH)", "Small hydro (PCH)", "#5f8fae"),
    ("eol", "structure_wind_power_plant", "Eólica", "Wind", MINERAIS["verde_mata"]),
    ("ufv", "structure_photovoltaic_solar_power_plant", "Solar fotovoltaica", "Solar photovoltaic", MINERAIS["ocre"]),
    ("bio", "structure_biomass_thermal_power_plant", "Termelétrica a biomassa", "Biomass thermal", MINERAIS["oliva"]),
    ("fossil", "structure_fossil_fuel_thermal_power_plant", "Termelétrica fóssil", "Fossil thermal", MINERAIS["grafite"]),
    ("nuclear", "structure_thermonuclear_power_plant", "Termonuclear", "Nuclear", MINERAIS["ameixa"]),
]


def usinas() -> None:
    ufs, _, lim = ufs_brasil()
    partes = []
    for chave, camada, rot, _, _ in FONTES:
        g = siga(camada)
        g["fonte_mapa"] = chave
        g["fonte_rotulo"] = rot
        partes.append(g)
    u = gpd.GeoDataFrame(pd.concat(partes, ignore_index=True), geometry="geometry", crs=GEO)
    u["uf_mapa"] = sigla_uf(u, ufs)
    u["operacao"] = u["fase"].eq("Operação")
    cols = ["nome", "ceg", "fonte_mapa", "fonte_rotulo", "tipo", "combustivel", "fase", "operacao", "potencia_kw",
            "potencia_fiscalizada_kw", "inicio_operacao", "proprietario", "municipio_siga", "uf", "uf_mapa", "geometry"]
    u = u[cols].sort_values("potencia_kw", ascending=False).reset_index(drop=True)

    expr = '1.0 + 0.012 * sqrt("potencia_kw")'
    itens = [(igual("fonte_mapa", k), r, marcador(c, 1.2, alfa=0.85, tamanho_expr=expr)) for k, _, r, _, c in FONTES]
    estilos = {
        "usinas": [("fonte", "Fonte, círculos pela potência outorgada", estilo_regras("ponto", itens, ordem='"potencia_kw" DESC'), True)],
        "ufs": [("ufs", "Limites estaduais", estilo_contorno("#9aa3ab", 0.25, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    csv = u.assign(lon=u.geometry.x.round(5), lat=u.geometry.y.round(5)).drop(columns="geometry")
    tam = gravar("usinas", "br_usinas_por_fonte", {"usinas": u, "ufs": ufs, "limite_nacional": lim}, estilos, csv)

    resumo = []
    for k, _, rot, en, c in FONTES:
        x = u[u["fonte_mapa"] == k]
        op = x[x["operacao"]]
        resumo.append({"chave": k, "rotulo": rot, "rotulo_en": en, "cor": c, "n": len(x), "n_operacao": len(op),
                       "kw": float(x["potencia_kw"].sum()), "kw_operacao": float(op["potencia_kw"].sum())})
    op = u[u["operacao"]]
    por_uf = op.groupby("uf")["potencia_kw"].sum().sort_values(ascending=False)  # UF declarada no SIGA
    gravar_cache("energia-eletrica-usinas", {
        "pontos": [[k, round(p.x, 3), round(p.y, 3), round(float(kw)), int(o)] for k, p, kw, o in
                   zip(u["fonte_mapa"], u.geometry, u["potencia_kw"], u["operacao"])],
        "fontes": resumo,
        "n": len(u), "kw": float(u["potencia_kw"].sum()), "kw_operacao": float(op["potencia_kw"].sum()),
        "maiores": [{"nome": r.nome, "fonte": r.fonte_mapa, "kw": float(r.potencia_kw), "uf": r.uf,
                     "coord": [round(r.geometry.x, 3), round(r.geometry.y, 3)], "fase": r.fase} for r in u.head(8).itertuples()],
        "por_uf": [{"uf": k, "kw": float(v)} for k, v in por_uf.items()],
        "inicio_max": str(u["inicio_operacao"].max().date()),
        "fora_do_mapa": int(u["uf_mapa"].isna().sum()),
        "tamanhos": tam,
    })
    print(pd.DataFrame(resumo).to_string(), len(u), u["potencia_kw"].sum(), tam)
    print(u.head(8)[["nome", "fonte_mapa", "potencia_kw", "uf", "fase"]].to_string())
    print(por_uf.head(6), "fora", u["uf_mapa"].isna().sum())

# ------------------------------------------------------------------ 3/3 geração solar distribuída
# Watts de GD solar por habitante: limites das classes e cores (do creme ao barro).
CLASSES_W = [50, 100, 200, 400, 800, 1600]
CORES_W = ["#f3eedf", "#ece0b8", "#e3c98a", "#d7ab5c", "#c58739", "#a8642a", "#7c4423"]
CLASSES_CONSUMO = [  # (classe da ANEEL, rótulo, rótulo EN)
    ("Residencial", "Residencial", "Residential"), ("Comercial", "Comercial", "Commercial"), ("Rural", "Rural", "Rural"),
    ("Industrial", "Industrial", "Industrial"), ("Poder Público", "Poder público", "Public authorities"),
]


def rotulo_w(i: int, en: bool = False) -> str:
    sep = "," if en else "."
    f = lambda v: f"{v:,}".replace(",", sep)  # noqa: E731
    if i == 0:
        return f"less than {CLASSES_W[0]}" if en else f"menos de {CLASSES_W[0]}"
    if i == len(CLASSES_W):
        return f"{f(CLASSES_W[-1])} or more" if en else f"{f(CLASSES_W[-1])} ou mais"
    return f"{f(CLASSES_W[i - 1])} to {f(CLASSES_W[i])}" if en else f"{f(CLASSES_W[i - 1])} a {f(CLASSES_W[i])}"


def ler_gd() -> pd.DataFrame:
    """Empreendimentos de GD da ANEEL (um por linha). Só os campos agregáveis: sem CPF/CNPJ, nomes nem CEP."""
    import zipfile

    cols = ["AnmPeriodoReferencia", "CodMunicipioIbge", "SigUF", "DscClasseConsumo", "SigTipoGeracao", "DscPorte",
            "MdaPotenciaInstaladaKW", "QtdUCRecebeCredito", "DthAtualizaCadastralEmpreend", "DscModalidadeHabilitado"]
    z = zipfile.ZipFile(GD_ZIP)
    with z.open(z.infolist()[0]) as f:
        d = pd.concat(pd.read_csv(f, sep=";", usecols=cols, dtype=str, chunksize=500_000, encoding="utf-8"), ignore_index=True)
    d["kw"] = pd.to_numeric(d["MdaPotenciaInstaladaKW"].str.replace(",", ".", regex=False))
    d["uc_credito"] = pd.to_numeric(d["QtdUCRecebeCredito"], errors="coerce").fillna(0)
    d["ano"] = pd.to_datetime(d["DthAtualizaCadastralEmpreend"], errors="coerce").dt.year
    return d.drop(columns=["MdaPotenciaInstaladaKW", "QtdUCRecebeCredito"])


def solar() -> None:
    import numpy as np

    d = ler_gd()
    periodo = d["AnmPeriodoReferencia"].iloc[0]
    kw_gd_total = float(d["kw"].sum())
    u = d[d["SigTipoGeracao"] == "UFV"].copy()
    u["remoto"] = u["DscModalidadeHabilitado"] != "Geracao na propria UC"
    g = u.groupby("CodMunicipioIbge")
    mun_gd = pd.DataFrame({
        "n_sistemas": g.size(), "kw_total": g["kw"].sum(),
        "kw_micro": u[u["DscPorte"] == "Microgeracao"].groupby("CodMunicipioIbge")["kw"].sum(),
        "kw_mini": u[u["DscPorte"] == "Minigeracao"].groupby("CodMunicipioIbge")["kw"].sum(),
        "kw_residencial": u[u["DscClasseConsumo"] == "Residencial"].groupby("CodMunicipioIbge")["kw"].sum(),
        "kw_remoto": u[u["remoto"]].groupby("CodMunicipioIbge")["kw"].sum(),
        "uc_credito": g["uc_credito"].sum(),
    }).fillna(0)

    censo = pd.read_csv(CENSO, sep=";", encoding="latin1", dtype=str, usecols=["CD_MUN", "v0001"])
    censo["pop_2022"] = pd.to_numeric(censo["v0001"])
    m = gpd.read_file(MALHA_BR, engine="pyogrio").set_crs(GEO, allow_override=True)
    m = m[m["CD_MUN"].str.match(r"^\d{7}$") & m["CD_RGINT"].notna()][["CD_MUN", "NM_MUN", "SIGLA_UF", "geometry"]]
    m = m.merge(censo[["CD_MUN", "pop_2022"]], on="CD_MUN", how="left").merge(mun_gd, left_on="CD_MUN", right_index=True, how="left")
    for c in mun_gd.columns:
        m[c] = m[c].fillna(0)
    m["n_sistemas"] = m["n_sistemas"].astype(int)
    m["uc_credito"] = m["uc_credito"].astype(int)
    for c in ["kw_total", "kw_micro", "kw_mini", "kw_residencial", "kw_remoto"]:
        m[c] = m[c].round(2)
    m["w_hab"] = (m["kw_total"] * 1000 / m["pop_2022"]).round(1)
    m["classe"] = np.where(m["w_hab"].isna(), -1, np.digitize(m["w_hab"].fillna(0), CLASSES_W)).astype(int)
    m["faixa_w_hab"] = [rotulo_w(c) if c >= 0 else "sem população no Censo 2022" for c in m["classe"]]
    fora_malha = sorted(set(mun_gd.index) - set(m["CD_MUN"]))
    sem_pop = m[m["pop_2022"].isna()]

    ufs, _, lim = ufs_brasil()
    regras = [(igual("classe", i), rotulo_w(i) + " W por habitante", preenchimento(c, "#ffffff", 0.05)) for i, c in enumerate(CORES_W)]
    regras.append((igual("classe", -1), "sem população no Censo 2022", preenchimento("#d5d9dd", "#ffffff", 0.05)))
    estilos = {
        "municipios": [("w_hab", "Watts de GD solar por habitante", estilo_regras("poligono", regras), True)],
        "ufs": [("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    cols = ["CD_MUN", "NM_MUN", "SIGLA_UF", "pop_2022", "n_sistemas", "kw_total", "kw_micro", "kw_mini", "kw_residencial",
            "kw_remoto", "uc_credito", "w_hab", "classe", "faixa_w_hab"]
    m = m[cols + ["geometry"]].sort_values("CD_MUN").reset_index(drop=True)
    tam = gravar("solar", "br_geracao_distribuida", {"municipios": m, "ufs": ufs, "limite_nacional": lim}, estilos,
                 m.drop(columns="geometry"))

    com_pop = m[m["pop_2022"].notna()]
    grandes = com_pop[com_pop["pop_2022"] >= 100_000]
    por_classe = [{"classe": i, "rotulo": rotulo_w(i), "rotulo_en": rotulo_w(i, True), "cor": c,
                   "municipios": int((m["classe"] == i).sum()), "pop": int(com_pop.loc[com_pop["classe"] == i, "pop_2022"].sum())}
                  for i, c in enumerate(CORES_W)]
    consumo = []
    for k, r, en in CLASSES_CONSUMO:
        consumo.append({"classe": k, "rotulo": r, "rotulo_en": en, "kw": float(u.loc[u["DscClasseConsumo"] == k, "kw"].sum()),
                        "n": int((u["DscClasseConsumo"] == k).sum())})
    outras = u[~u["DscClasseConsumo"].isin([k for k, _, _ in CLASSES_CONSUMO])]
    consumo.append({"classe": "outras", "rotulo": "Outras", "rotulo_en": "Other", "kw": float(outras["kw"].sum()), "n": len(outras)})
    anos = u[u["ano"].between(2015, 2026)].groupby("ano")["kw"].sum()
    pos = m.set_index("CD_MUN").geometry.to_crs(AREA_BR).representative_point().to_crs(GEO)
    ponto = lambda cd: [round(pos[cd].x, 3), round(pos[cd].y, 3)]  # noqa: E731

    def reg(r):
        return {"cd": r.CD_MUN, "nome": r.NM_MUN, "uf": r.SIGLA_UF, "pop": int(r.pop_2022), "kw": float(r.kw_total),
                "n": int(r.n_sistemas), "w_hab": float(r.w_hab), "coord": ponto(r.CD_MUN),
                "remoto_pct": round(float(r.kw_remoto / r.kw_total * 100), 1) if r.kw_total else 0.0}

    topo = com_pop.sort_values("w_hab", ascending=False)
    uf_pop = com_pop.groupby("SIGLA_UF").agg(kw=("kw_total", "sum"), pop=("pop_2022", "sum"))
    uf_pop["w_hab"] = uf_pop["kw"] * 1000 / uf_pop["pop"]
    gravar_cache("energia-eletrica-solar", {
        "municipios": para_d3(m, ["CD_MUN", "classe"], tol=0.012, casas=3),
        "classes": por_classe,
        "periodo": periodo,
        "n": int(len(u)), "kw": float(u["kw"].sum()), "kw_gd_total": kw_gd_total, "n_gd_total": int(len(d)),
        "uc_credito": int(u["uc_credito"].sum()),
        "kw_micro": float(u.loc[u["DscPorte"] == "Microgeracao", "kw"].sum()),
        "kw_mini": float(u.loc[u["DscPorte"] == "Minigeracao", "kw"].sum()),
        "n_mini": int((u["DscPorte"] == "Minigeracao").sum()),
        "kw_remoto": float(u.loc[u["remoto"], "kw"].sum()),
        "w_hab_brasil": float(com_pop["kw_total"].sum() * 1000 / com_pop["pop_2022"].sum()),
        "mediana_w_hab": float(com_pop["w_hab"].median()),
        "municipios_com": int((m["n_sistemas"] > 0).sum()), "municipios_total": int(len(m)),
        "consumo": consumo,
        "anos": [{"ano": int(a), "kw": float(v)} for a, v in anos.items()],
        "topo": [reg(r) for r in topo.head(10).itertuples()],
        "topo_grandes": [reg(r) for r in grandes.sort_values("w_hab", ascending=False).head(6).itertuples()],
        "base_grandes": [reg(r) for r in grandes.sort_values("w_hab").head(6).itertuples()],
        "maiores_kw": [reg(r) for r in com_pop.sort_values("kw_total", ascending=False).head(6).itertuples()],
        "ufs": [{"uf": k, "kw": float(v.kw), "w_hab": round(float(v.w_hab), 1)} for k, v in uf_pop.sort_values("w_hab", ascending=False).iterrows()],
        "fora_malha": fora_malha, "kw_fora_malha": float(mun_gd.loc[fora_malha, "kw_total"].sum()) if fora_malha else 0.0,
        "sem_pop": [{"cd": r.CD_MUN, "nome": r.NM_MUN, "uf": r.SIGLA_UF, "kw": float(r.kw_total)} for r in sem_pop.itertuples()],
        "tamanhos": tam,
    })
    print(periodo, len(u), round(u["kw"].sum() / 1e6, 2), "GW;", "fora da malha", fora_malha, "sem pop", len(sem_pop), tam)
    print(pd.DataFrame(por_classe)[["rotulo", "municipios", "pop"]].to_string())
    print(topo.head(5)[["NM_MUN", "SIGLA_UF", "pop_2022", "kw_total", "w_hab", "kw_remoto"]].to_string())


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("tema", choices=["base", "transmissao", "usinas", "solar"])
    {"base": base, "transmissao": transmissao, "usinas": usinas, "solar": solar}[ap.parse_args().tema]()
