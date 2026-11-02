"""
Coleção «O que mais a usina queima» (Brasil) — prepara os dados de uma prancha (uso interno).

    .venv-geo/Scripts/python -I -X utf8 scripts/colecoes/combustivel-biomassa-br/preparar.py licor|combustiveis|chegada < /dev/null

Saídas: mapas/<pasta>/dados/<base>.gpkg.zip (com estilos do QGIS), <base>.csv
e scripts/colecoes/cache/combustivel-biomassa-br-<tema>.json (para a prancha e a ficha).
Fontes: o cadastro de usinas da ANEEL (SIGA, o mesmo arquivo da prancha 127, em
scripts/colecoes/cache/downloads/aneel_siga/) e a PEVS do IBGE (tabela 291, madeira em tora para papel e
celulose, o mesmo arquivo da prancha 130, em scripts/colecoes/cache/downloads/ibge_pevs/).
Só o que está instalado e registrado: nenhuma estimativa de potencial.
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
    AREA_BR, GEO, RAIZ, TINTA, estilo_contorno, estilo_regras, gravar_cache, gravar_estilos, igual, marcador, para_d3,
    zipar,
)
from estilos import preenchimento  # noqa: E402

SERIE = {s["tema"]: s for s in json.loads((Path(__file__).parent / "serie.json").read_text(encoding="utf-8"))}
MALHA_BR = RAIZ / "scripts" / "estados" / "cache" / "brasil_0_004.gpkg"
SIGA_CSV = RAIZ / "scripts" / "colecoes" / "cache" / "downloads" / "aneel_siga" / "siga-empreendimentos-geracao.csv"
PEVS = RAIZ / "scripts" / "colecoes" / "cache" / "downloads" / "ibge_pevs"
REGIOES = {"1": "Norte", "2": "Nordeste", "3": "Sudeste", "4": "Sul", "5": "Centro-Oeste"}
CANA = "Bagaço de Cana de Açúcar"

# Combustíveis do SIGA que não são bagaço de cana, em dez grupos: (chave, rótulo, rótulo em inglês, cor, família,
# combustíveis do SIGA). Família: o mapa da prancha 166 em que o grupo aparece.
GRUPOS = [
    ("licor", "licor negro", "black liquor", "#6b3d5c", "celulose", ["Licor Negro"]),
    ("residuos", "cavaco e resíduos florestais", "wood chips and forest residue", "#2f5d3a", "madeira", ["Resíduos Florestais"]),
    ("lenha", "lenha", "firewood", "#a0783c", "madeira", ["Lenha"]),
    ("carvao", "carvão vegetal e gás de alto-forno", "charcoal and blast-furnace gas", "#3d3a36", "madeira",
     ["Carvão Vegetal", "Gás de Alto Forno - Biomassa"]),
    ("arroz", "casca de arroz", "rice husk", "#d4a62a", "lavoura", ["Casca de Arroz"]),
    ("capim", "capim-elefante", "elephant grass", "#7fae4e", "lavoura", ["Capim Elefante"]),
    ("oleos", "óleo de palma e etanol", "palm oil and ethanol", "#d9622b", "lavoura", ["Óleos vegetais", "Etanol"]),
    ("biogas_rural", "biogás de granja e agroindústria", "farm and agro-industry biogas", "#4f8494", "lavoura",
     ["Biogás-AGR", "Biogás - RA", "Biogás - Floresta"]),
    ("aterro", "biogás de aterro e esgoto", "landfill and sewage biogas", "#234e70", "lixo", ["Biogás - RU"]),
    ("lixo", "lixo queimado ou carbonizado", "burnt or carbonised waste", "#8a8f94", "lixo",
     ["Resíduos Sólidos Urbanos - RU", "Carvão - RU"]),
]
CHAVE_DE = {c: g[0] for g in GRUPOS for c in g[5]}
FAMILIA_DE = {g[0]: g[4] for g in GRUPOS}


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
    m = gpd.read_file(MALHA_BR, engine="pyogrio").set_crs(GEO, allow_override=True)
    m = m[m["CD_MUN"].str.match(r"^\d{7}$") & m["CD_RGINT"].notna()][["CD_MUN", "NM_MUN", "SIGLA_UF", "geometry"]]
    m["regiao"] = m["CD_MUN"].str[0].map(REGIOES)
    return m.reset_index(drop=True)


def ufs_brasil(m: gpd.GeoDataFrame) -> tuple[gpd.GeoDataFrame, gpd.GeoDataFrame]:
    ufs = m.dissolve(by=["SIGLA_UF", "regiao"], as_index=False)[["SIGLA_UF", "regiao", "geometry"]]
    lim = m.assign(pais="Brasil").dissolve(by="pais", as_index=False)[["pais", "geometry"]]
    return ufs, lim


def _num(s: pd.Series) -> pd.Series:
    """'1.234,5' ou '-20,48' → float."""
    return pd.to_numeric(s.str.replace(".", "", regex=False).str.replace(",", ".", regex=False), errors="coerce")


def siga(m: gpd.GeoDataFrame) -> tuple[gpd.GeoDataFrame, dict]:
    """Todas as usinas a biomassa do SIGA, com grupo de combustível, ano de entrada em operação e ponto."""
    d = pd.read_csv(SIGA_CSV, sep=";", dtype=str, encoding="utf-8")
    referencia = d["DatGeracaoConjuntoDados"].iloc[0]
    d["kw"] = _num(d["MdaPotenciaOutorgadaKw"])
    b = d[d["DscOrigemCombustivel"] == "Biomassa"].copy()
    b["grupo"] = b["NomFonteCombustivel"].map(CHAVE_DE).where(b["NomFonteCombustivel"] != CANA, "cana")
    assert b["grupo"].notna().all(), b.loc[b["grupo"].isna(), "NomFonteCombustivel"].unique()
    b["lat"] = _num(b["NumCoordNEmpreendimento"].str.replace(".", ",", regex=False))
    b["lon"] = _num(b["NumCoordEEmpreendimento"].str.replace(".", ",", regex=False))
    # Data de entrada em operação: o SIGA usa 1900-01-03 (ou vazio) quando não a tem.
    ini = pd.to_datetime(b["DatEntradaOperacao"], errors="coerce")
    b["ano_inicio"] = ini.dt.year.where(ini.dt.year > 1900)
    b["posicao"] = "coordenada do SIGA"
    sem = b["lat"].isna() | b["lon"].isna() | ((b["lat"] == 0) & (b["lon"] == 0))
    centro = m.set_index(m["NM_MUN"] + " - " + m["SIGLA_UF"]).geometry.to_crs(AREA_BR).representative_point().to_crs(GEO)
    primeiro = b["DscMuninicpios"].str.split(",").str[0].str.strip()
    assert primeiro[sem].isin(centro.index).all(), primeiro[sem & ~primeiro.isin(centro.index)].tolist()
    b.loc[sem, "lon"] = primeiro[sem].map(lambda k: centro[k].x)
    b.loc[sem, "lat"] = primeiro[sem].map(lambda k: centro[k].y)
    b.loc[sem, "posicao"] = "centro do município"
    dono = b["DscPropriRegimePariticipacao"].str.extract(r"para (.+?) - ")[0].str.strip()
    pts = gpd.GeoDataFrame({
        "nome": b["NomEmpreendimento"].str.strip(), "ceg": b["CodCEG"], "uf": b["SigUFPrincipal"],
        "municipio": b["DscMuninicpios"], "fase": b["DscFaseUsina"], "combustivel": b["NomFonteCombustivel"],
        "grupo": b["grupo"], "potencia_kw": b["kw"].round(1), "ano_inicio": b["ano_inicio"].astype("Int64"),
        "proprietario": dono, "regime": b["DscPropriRegimePariticipacao"].str.extract(r"\((\w+)\)\s*$")[0],
        "posicao": b["posicao"],
    }, geometry=gpd.points_from_xy(b["lon"], b["lat"]), crs=GEO)
    pts = pts.sort_values("potencia_kw", ascending=False).reset_index(drop=True)
    return pts, {"referencia": referencia, "kw_op_brasil": float(d.loc[d["DscFaseUsina"] == "Operação", "kw"].sum())}


def info_grupos() -> list[dict]:
    return [{"chave": k, "rotulo": r, "rotulo_en": en, "cor": cor, "familia": f} for k, r, en, cor, f, _ in GRUPOS]


def reg(r) -> dict:
    return {"nome": r.nome, "uf": r.uf, "municipio": r.municipio.split(",")[0].rsplit(" - ", 1)[0], "kw": float(r.potencia_kw),
            "grupo": r.grupo, "ano": None if pd.isna(r.ano_inicio) else int(r.ano_inicio), "dono": r.proprietario,
            "fase": r.fase, "coord": [round(r.geometry.x, 3), round(r.geometry.y, 3)]}


def estilo_pontos(titulo: str, chaves: list[str]) -> list:
    regras = [(igual("grupo", k), r, marcador(cor, 2.4, tamanho_expr='1 + 0.02 * sqrt("potencia_kw")'))
              for k, r, _, cor, _, _ in GRUPOS if k in chaves]
    return [("grupo", titulo, estilo_regras("ponto", regras, ordem='"potencia_kw" DESC'), True)]


# ------------------------------------------------------------------ 1 o licor da celulose
LIMITES_POLPA = [100_000, 500_000, 1_500_000, 3_000_000]  # m³ de madeira em tora para celulose, 2025
CORES_POLPA = ["#e3ead9", "#b9cda4", "#86a873", "#4f7a4a", "#24472c"]
ROTULOS_POLPA = [("até 100 mil m³", "up to 100k m³"), ("100 a 500 mil", "100k to 500k"), ("500 mil a 1,5 mi", "500k to 1.5M"),
                 ("1,5 a 3 mi", "1.5M to 3M"), ("3 mi ou mais", "3M or more")]
SEM_POLPA = "#f4f5f3"
SEM_DADO = "#dfe2e5"
RAIO_KM = 200  # distância da madeira à fábrica, para a conta de «perto de uma fábrica»


def pevs_celulose(ano: int) -> pd.Series:
    d = pd.DataFrame(json.loads((PEVS / "t291_quantidade.json").read_text(encoding="utf-8"))[1:])
    d = d[(d["D3C"] == str(ano)) & (d["D4C"] == "3458")]
    v = pd.to_numeric(d["V"], errors="coerce").where(d["V"] != "-", 0.0)
    return pd.Series(v.values, index=d["D1C"].values)


def licor() -> None:
    m = municipios()
    pts, meta = siga(m)
    op = pts[pts["fase"] == "Operação"]
    nc = op[op["grupo"] != "cana"]
    lic = pts[pts["grupo"] == "licor"].copy()
    lic_op = lic[lic["fase"] == "Operação"]

    polpa = pevs_celulose(2025)
    polpa15 = pevs_celulose(2015)
    m["celulose_2025_m3"] = m["CD_MUN"].map(polpa)
    m["celulose_2015_m3"] = m["CD_MUN"].map(polpa15)
    # Fora da tabela: sem registro de silvicultura na PEVS, conta como zero (como na prancha 130).
    # «...» (não disponível) fica como sem dado.
    na = m["CD_MUN"].isin(polpa.index) & m["celulose_2025_m3"].isna()
    m["celulose_2025_m3"] = m["celulose_2025_m3"].where(na | m["CD_MUN"].isin(polpa.index), 0.0)
    m["situacao_pevs"] = np.where(na, "nao disponivel", np.where(m["CD_MUN"].isin(polpa.index), "valor", "sem registro"))
    v = m["celulose_2025_m3"]
    m["classe"] = np.where(na, -2, np.where(v.fillna(0) == 0, -1, np.digitize(v.fillna(0), LIMITES_POLPA))).astype(int)
    m["cor"] = [CORES_POLPA[k] if k >= 0 else (SEM_POLPA if k == -1 else SEM_DADO) for k in m["classe"]]
    # Distância do ponto interno do município à fábrica de licor negro em operação mais próxima.
    pm = m.geometry.to_crs(AREA_BR).representative_point()
    fab = lic_op.to_crs(AREA_BR).geometry
    dist = np.array([fab.distance(p).min() for p in pm]) / 1000
    m["km_fabrica"] = dist.round(0)
    perto = float(m.loc[m["km_fabrica"] <= RAIO_KM, "celulose_2025_m3"].sum())
    total = float(v.sum())

    ufs, lim = ufs_brasil(m)
    ufs["licor_kw_op"] = ufs["SIGLA_UF"].map(lic_op.groupby("uf")["potencia_kw"].sum()).fillna(0)
    ufs["celulose_2025_m3"] = ufs["SIGLA_UF"].map(m.groupby("SIGLA_UF")["celulose_2025_m3"].sum()).fillna(0)
    regras_m = [(igual("classe", i), r, preenchimento(cor, "#ffffff", 0.05)) for i, ((r, _), cor) in enumerate(zip(ROTULOS_POLPA, CORES_POLPA))]
    regras_m += [(igual("classe", -1), "sem madeira para celulose", preenchimento(SEM_POLPA, "#ffffff", 0.05)),
                 (igual("classe", -2), "sem dado", preenchimento(SEM_DADO, "#ffffff", 0.05))]
    regras_p = [(igual("fase", "Operação"), "em operação", marcador("#6b3d5c", 2.4, tamanho_expr='1 + 0.02 * sqrt("potencia_kw")')),
                ("&quot;fase&quot; &lt;&gt; 'Operação'", "em obra",
                 marcador("#6b3d5c", 2.4, vazado=True, tamanho_expr='1 + 0.02 * sqrt("potencia_kw")'))]
    estilos = {
        "fabricas": [("fase", "Usinas a licor negro (potência outorgada)", estilo_regras("ponto", regras_p, ordem='"potencia_kw" DESC'), True)],
        "municipios": [("classe", "Madeira em tora para papel e celulose, 2025 (m³)", estilo_regras("poligono", regras_m), True)],
        "ufs": [("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    cols_m = ["CD_MUN", "NM_MUN", "SIGLA_UF", "regiao", "celulose_2015_m3", "celulose_2025_m3", "situacao_pevs", "classe", "km_fabrica"]
    cols_p = ["nome", "ceg", "uf", "municipio", "fase", "potencia_kw", "ano_inicio", "proprietario", "regime", "posicao"]
    tam = gravar("licor", {"fabricas": lic[cols_p + ["geometry"]], "municipios": m[cols_m + ["geometry"]],
                           "ufs": ufs, "limite_nacional": lim}, estilos, lic[cols_p + ["combustivel"]].assign(
                               lon=lic.geometry.x.round(5), lat=lic.geometry.y.round(5)))

    donos = lic_op.groupby("proprietario")["potencia_kw"].agg(["sum", "size"]).sort_values("sum", ascending=False)
    porm = lic_op.groupby("municipio")["potencia_kw"].agg(["sum", "size"]).sort_values("sum", ascending=False)
    bio_mun = op.groupby("municipio")["potencia_kw"].sum().sort_values(ascending=False)
    uf_l = lic_op.groupby("uf")["potencia_kw"].sum().sort_values(ascending=False)
    uf_c = m.groupby("SIGLA_UF")["celulose_2025_m3"].sum()
    gravar_cache("combustivel-biomassa-br-licor", {
        "referencia": meta["referencia"],
        "municipios": para_d3(m, ["CD_MUN", "cor"], tol=0.012, casas=3),
        "classes": [{"classe": i, "rotulo": r, "rotulo_en": en, "cor": c} for i, ((r, en), c) in enumerate(zip(ROTULOS_POLPA, CORES_POLPA))],
        "sem_polpa": SEM_POLPA, "sem_dado": SEM_DADO, "n_sem_dado": int(na.sum()),
        "fabricas": [reg(r) for r in lic.itertuples()],
        "n_op": int(len(lic_op)), "kw_op": float(lic_op["potencia_kw"].sum()),
        "kw_obra": float(lic.loc[lic["fase"] != "Operação", "potencia_kw"].sum()),
        "kw_nao_cana_op": float(nc["potencia_kw"].sum()), "n_nao_cana_op": int(len(nc)),
        "kw_biomassa_op": float(op["potencia_kw"].sum()),
        "kw_desde_2013": float(lic_op.loc[lic_op["ano_inicio"] >= 2013, "potencia_kw"].sum()),
        "donos": [{"dono": k, "kw": float(r["sum"]), "n": int(r["size"])} for k, r in donos.iterrows()],
        "municipios_top": [{"municipio": k, "kw": float(r["sum"]), "n": int(r["size"])} for k, r in porm.head(5).iterrows()],
        "maior_municipio_biomassa": {"municipio": bio_mun.index[0], "kw": float(bio_mun.iloc[0])},
        "ufs": [{"uf": k, "kw": float(val), "m3": float(uf_c.get(k, 0))} for k, val in uf_l.items()],
        "ufs_madeira": [{"uf": k, "m3": float(val)} for k, val in uf_c.sort_values(ascending=False).head(10).items()],
        "celulose_2025": total, "celulose_2015": float(m["celulose_2015_m3"].sum()),
        "perto_m3": perto, "raio_km": RAIO_KM,
        "municipios_com_madeira": int((m["classe"] >= 0).sum()),
        "top_madeira": [{"nome": r.NM_MUN, "uf": r.SIGLA_UF, "m3": float(r.celulose_2025_m3), "km": float(r.km_fabrica)}
                        for r in m.sort_values("celulose_2025_m3", ascending=False).head(6).itertuples()],
        "tamanhos": tam,
    })
    print(meta["referencia"], tam)
    print("licor op", len(lic_op), round(lic_op["potencia_kw"].sum() / 1e3), "MW de", round(nc["potencia_kw"].sum() / 1e3), "não cana; biomassa", round(op["potencia_kw"].sum() / 1e3))
    print(donos.head(5).to_string())
    print(porm.head(5).to_string())
    print("maior município de biomassa", bio_mun.head(3).to_string())
    print("polpa 2025", round(total / 1e6, 1), "Mm³; 2015", round(m["celulose_2015_m3"].sum() / 1e6, 1), "perto", round(perto / total * 100, 1), "%")
    print(m["classe"].value_counts().sort_index().to_string())
    print(m.sort_values("celulose_2025_m3", ascending=False).head(8)[["NM_MUN", "SIGLA_UF", "celulose_2025_m3", "km_fabrica"]].to_string())
    print(uf_c.sort_values(ascending=False).head(8).to_string())


# ------------------------------------------------------------------ 2 um mapa por combustível
FAMILIAS = [("madeira", "A MADEIRA FORA DA CELULOSE", "WOOD BEYOND THE PULP MILLS"),
            ("lavoura", "DA LAVOURA E DA GRANJA", "FROM FIELD AND FARM"),
            ("lixo", "DO LIXO E DO ESGOTO", "FROM RUBBISH AND SEWAGE")]


def combustiveis() -> None:
    m = municipios()
    pts, meta = siga(m)
    op = pts[pts["fase"] == "Operação"]
    nc = op[op["grupo"] != "cana"]
    sel = pts[~pts["grupo"].isin(["cana", "licor"])].copy()
    sel["familia"] = sel["grupo"].map(FAMILIA_DE)
    sop = sel[sel["fase"] == "Operação"]
    ufs, lim = ufs_brasil(m)
    estilos = {
        "usinas": estilo_pontos("Usinas a biomassa sem cana nem licor negro, por combustível", [g[0] for g in GRUPOS[1:]]),
        "ufs": [("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    cols = ["nome", "ceg", "uf", "municipio", "fase", "combustivel", "grupo", "familia", "potencia_kw", "ano_inicio",
            "proprietario", "regime", "posicao"]
    tam = gravar("combustiveis", {"usinas": sel[cols + ["geometry"]], "ufs": ufs, "limite_nacional": lim}, estilos,
                 sel[cols].assign(lon=sel.geometry.x.round(5), lat=sel.geometry.y.round(5)))

    grupos = []
    for g in info_grupos()[1:]:
        k = g["chave"]
        go = sop[sop["grupo"] == k]
        ga = sel[sel["grupo"] == k]
        por_uf = go.groupby("uf")["potencia_kw"].agg(["sum", "size"]).sort_values("sum", ascending=False)
        grupos.append({**g, "n_op": int(len(go)), "kw_op": float(go["potencia_kw"].sum()),
                       "n_obra": int(len(ga) - len(go)), "kw_obra": float(ga["potencia_kw"].sum() - go["potencia_kw"].sum()),
                       "maior": reg(go.iloc[0]) if len(go) else None,
                       "uf_lider": {"uf": por_uf.index[0], "kw": float(por_uf["sum"].iloc[0]), "n": int(por_uf["size"].iloc[0])} if len(go) else None,
                       "ufs": int(go["uf"].nunique())})
    rr = sop[sop["uf"] == "RR"]
    rs_arroz = sop[(sop["grupo"] == "arroz") & (sop["uf"] == "RS")]
    inpasa = sop[sop["proprietario"].fillna("").str.contains("INPASA")]
    fs = sop[sop["proprietario"].fillna("").str.match(r"^FS ")]
    gravar_cache("combustivel-biomassa-br-combustiveis", {
        "referencia": meta["referencia"],
        "pontos": [[r.grupo, round(r.geometry.x, 3), round(r.geometry.y, 3), float(r.potencia_kw), r.fase == "Operação"]
                   for r in sel.itertuples()],
        "grupos": grupos,
        "familias": [{"chave": k, "titulo": t, "titulo_en": te,
                      "kw_op": float(sop.loc[sop["familia"] == k, "potencia_kw"].sum()), "n_op": int((sop["familia"] == k).sum())}
                     for k, t, te in FAMILIAS],
        "n_op": int(len(sop)), "kw_op": float(sop["potencia_kw"].sum()), "n_obra": int(len(sel) - len(sop)),
        "kw_nao_cana_op": float(nc["potencia_kw"].sum()),
        "roraima": {"n": int(len(rr)), "kw": float(rr["potencia_kw"].sum()),
                    "grupos": sorted(rr["grupo"].unique().tolist()), "desde": int(rr["ano_inicio"].min()),
                    "n_2022": int((rr["ano_inicio"] >= 2022).sum())},
        "arroz_rs": {"n": int(len(rs_arroz)), "kw": float(rs_arroz["potencia_kw"].sum())},
        "inpasa": {"n": int(len(inpasa)), "kw": float(inpasa["potencia_kw"].sum()),
                   "ufs": sorted(inpasa["uf"].unique().tolist())},
        "fs": {"n": int(len(fs)), "kw": float(fs["potencia_kw"].sum())},
        "tamanhos": tam,
    })
    print(meta["referencia"], tam, "sem cana nem licor:", len(sop), round(sop["potencia_kw"].sum() / 1e3, 1), "MW")
    print(pd.DataFrame(grupos)[["chave", "n_op", "kw_op", "n_obra", "kw_obra", "ufs"]].to_string())
    print("RR", len(rr), rr["potencia_kw"].sum(), rr["grupo"].tolist(), "arroz RS", len(rs_arroz), rs_arroz["potencia_kw"].sum())
    print("inpasa", len(inpasa), inpasa["potencia_kw"].sum(), inpasa[["nome", "grupo", "uf"]].values.tolist())
    print("fs", len(fs), fs["potencia_kw"].sum())


# ------------------------------------------------------------------ 3 quando cada combustível chegou
PERIODOS = [("antes", "antes de 2000", "before 2000", 0, 1999, "#d7d2c4"),
            ("2000", "2000 a 2009", "2000 to 2009", 2000, 2009, "#b7c7cf"),
            ("2010", "2010 a 2014", "2010 to 2014", 2010, 2014, "#7f9fb0"),
            ("2015", "2015 a 2019", "2015 to 2019", 2015, 2019, "#c07a3a"),
            ("2020", "2020 a 2026", "2020 to 2026", 2020, 2026, "#8a2f1d")]
BLOCOS = list(range(1955, 2030, 5))  # blocos de cinco anos para o gráfico de barras


def periodo(ano) -> str:
    if pd.isna(ano):
        return "sem data"
    return next(k for k, _, _, a, b, _ in PERIODOS if a <= ano <= b)


def chegada() -> None:
    m = municipios()
    pts, meta = siga(m)
    op = pts[pts["fase"] == "Operação"].copy()
    op["periodo"] = op["ano_inicio"].map(periodo)
    nc = op[op["grupo"] != "cana"].copy()
    cana = op[op["grupo"] == "cana"]
    ufs, lim = ufs_brasil(m)
    regras = [(igual("periodo", k), r, marcador(cor, 2.4, tamanho_expr='1 + 0.02 * sqrt("potencia_kw")'))
              for k, r, _, _, _, cor in PERIODOS]
    regras.append((igual("periodo", "sem data"), "sem data no SIGA", marcador("#7a8189", 2.4, vazado=True, tamanho_expr='1 + 0.02 * sqrt("potencia_kw")')))
    estilos = {
        "usinas": [("periodo", "Usinas a biomassa sem cana, pelo ano de entrada em operação", estilo_regras("ponto", regras, ordem='"potencia_kw" DESC'), True)],
        "ufs": [("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    cols = ["nome", "ceg", "uf", "municipio", "combustivel", "grupo", "potencia_kw", "ano_inicio", "periodo", "proprietario", "regime", "posicao"]
    # O CSV leva também as usinas a bagaço em operação (para a comparação do painel); o mapa, só as sem cana.
    estilos["usinas_cana"] = [("cana", "Usinas a bagaço de cana (comparação)", estilo_regras("ponto", [
        ("TRUE", "bagaço de cana", marcador("#c08a2e", 2.4, tamanho_expr='1 + 0.02 * sqrt("potencia_kw")'))], ordem='"potencia_kw" DESC'), True)]
    todas = pd.concat([nc, cana])
    tam = gravar("chegada", {"usinas": nc[cols + ["geometry"]], "usinas_cana": cana[cols + ["geometry"]], "ufs": ufs, "limite_nacional": lim},
                 estilos, todas[cols].assign(lon=todas.geometry.x.round(5), lat=todas.geometry.y.round(5)))

    def soma(d: pd.DataFrame, a: int, b: int) -> float:
        return float(d.loc[(d["ano_inicio"] >= a) & (d["ano_inicio"] <= b), "potencia_kw"].sum())

    blocos = [{"de": a, "ate": a + 4, "nao_cana": soma(nc, a, a + 4), "cana": soma(cana, a, a + 4),
               "por_grupo": {g[0]: soma(nc[nc["grupo"] == g[0]], a, a + 4) for g in GRUPOS}} for a in BLOCOS]
    grupos = []
    for g in info_grupos():
        d = nc[nc["grupo"] == g["chave"]]
        dd = d.dropna(subset=["ano_inicio"])
        primeiro = dd.sort_values(["ano_inicio", "potencia_kw"], ascending=[True, False]).iloc[0]
        grupos.append({**g, "n": int(len(d)), "kw": float(d["potencia_kw"].sum()), "sem_data": int(d["ano_inicio"].isna().sum()),
                       "primeiro": reg(primeiro), "mediana_ano": float(dd["ano_inicio"].median()),
                       "kw_desde_2015": soma(d, 2015, 2026),
                       "usinas": [[int(r.ano_inicio), float(r.potencia_kw)] for r in dd.itertuples()]})
    per = nc.groupby("periodo")["potencia_kw"].agg(["sum", "size"])
    mais_nova = nc.dropna(subset=["ano_inicio"]).sort_values(["ano_inicio", "potencia_kw"], ascending=[False, False])
    gravar_cache("combustivel-biomassa-br-chegada", {
        "referencia": meta["referencia"],
        "periodos": [{"chave": k, "rotulo": r, "rotulo_en": en, "cor": cor, "kw": float(per["sum"].get(k, 0)), "n": int(per["size"].get(k, 0))}
                     for k, r, en, _, _, cor in PERIODOS],
        "sem_data": {"n": int(per["size"].get("sem data", 0)), "kw": float(per["sum"].get("sem data", 0))},
        "pontos": [[r.periodo, round(r.geometry.x, 3), round(r.geometry.y, 3), float(r.potencia_kw)] for r in nc.itertuples()],
        "blocos": blocos, "grupos": grupos,
        "kw_nao_cana": float(nc["potencia_kw"].sum()), "n_nao_cana": int(len(nc)),
        "kw_cana": float(cana["potencia_kw"].sum()), "n_cana": int(len(cana)),
        "nao_cana_desde_2015": soma(nc, 2015, 2026), "cana_desde_2015": soma(cana, 2015, 2026),
        "nao_cana_desde_2020": soma(nc, 2020, 2026), "cana_desde_2020": soma(cana, 2020, 2026),
        "n_nao_cana_desde_2015": int((nc["ano_inicio"] >= 2015).sum()), "n_cana_desde_2015": int((cana["ano_inicio"] >= 2015).sum()),
        "mais_antiga": reg(nc.dropna(subset=["ano_inicio"]).sort_values("ano_inicio").iloc[0]),
        "mais_novas": [reg(r) for r in mais_nova[mais_nova["ano_inicio"] >= 2025].sort_values("potencia_kw", ascending=False).head(5).itertuples()],
        "maior_recente": reg(nc[nc["ano_inicio"] >= 2020].iloc[0]),
        "tamanhos": tam,
    })
    print(meta["referencia"], tam)
    print(per.to_string())
    print("desde 2015: não cana", soma(nc, 2015, 2026), "cana", soma(cana, 2015, 2026), "| desde 2020", soma(nc, 2020, 2026), soma(cana, 2020, 2026))
    print(pd.DataFrame(blocos)[["de", "nao_cana", "cana"]].to_string())
    print(pd.DataFrame(grupos)[["chave", "n", "kw", "sem_data", "mediana_ano", "kw_desde_2015"]].to_string())
    print([(g["chave"], g["primeiro"]["nome"], g["primeiro"]["ano"]) for g in grupos])


if __name__ == "__main__":
    temas = {"licor": licor, "combustiveis": combustiveis, "chegada": chegada}
    ap = argparse.ArgumentParser()
    ap.add_argument("tema", choices=list(temas))
    temas[ap.parse_args().tema]()
