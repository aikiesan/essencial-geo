"""
Coleção «Monitor da biomassa» (Brasil) — prepara os dados de uma prancha (uso interno).

    .venv-geo/Scripts/python scripts/colecoes/biomassa-br/preparar.py boi

Saídas: mapas/<pasta>/dados/<base>.gpkg.zip (com estilos do QGIS), <base>.csv
e scripts/colecoes/cache/biomassa-br-<tema>.json (para a prancha e a ficha).
Usa a base nacional de scripts/colecoes/cache/brasil-base.json (energia-eletrica/preparar.py base).
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
    AREA_BR, DADOS, GEO, RAIZ, TINTA, estilo_contorno, estilo_regras, gravar_cache, gravar_estilos, igual, marcador, para_d3,
    sidra, valor_sidra, zipar,
)
from estilos import preenchimento  # noqa: E402

SERIE = {s["tema"]: s for s in json.loads((Path(__file__).parent / "serie.json").read_text(encoding="utf-8"))}
MALHA_BR = RAIZ / "scripts" / "estados" / "cache" / "brasil_0_004.gpkg"
CENSO = DADOS / "raw" / "ibge_censo2022" / "Agregados_por_municipios_basico_BR.csv"
PPM = DADOS / "raw" / "ibge_ppm" / "TABELA_3939_PPM_2008A2024.xlsx"
REGIOES = {"1": "Norte", "2": "Nordeste", "3": "Sudeste", "4": "Sul", "5": "Centro-Oeste"}


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
    """Municípios da malha simplificada da série dos estados, com UF, região e população do Censo 2022."""
    m = gpd.read_file(MALHA_BR, engine="pyogrio").set_crs(GEO, allow_override=True)
    m = m[m["CD_MUN"].str.match(r"^\d{7}$") & m["CD_RGINT"].notna()][["CD_MUN", "NM_MUN", "SIGLA_UF", "geometry"]]
    m["regiao"] = m["CD_MUN"].str[0].map(REGIOES)
    censo = pd.read_csv(CENSO, sep=";", encoding="latin1", dtype=str, usecols=["CD_MUN", "v0001"])
    censo["pop_2022"] = pd.to_numeric(censo["v0001"])
    return m.merge(censo[["CD_MUN", "pop_2022"]], on="CD_MUN", how="left")


def ufs_brasil(m: gpd.GeoDataFrame) -> tuple[gpd.GeoDataFrame, gpd.GeoDataFrame]:
    ufs = m.dissolve(by=["SIGLA_UF", "regiao"], as_index=False)[["SIGLA_UF", "regiao", "geometry"]]
    lim = m.assign(pais="Brasil").dissolve(by="pais", as_index=False)[["pais", "geometry"]]
    return ufs, lim


# ------------------------------------------------------------------ 1 mais boi que gente
# Bois por habitante: abaixo de 1 há mais gente que boi (tons frios); acima, mais boi (tons de terra).
LIMITES_BOI = [0.1, 0.5, 1, 2, 5, 20]
CORES_BOI = ["#6f8ba3", "#a9bccb", "#dde3e8", "#ecd9a6", "#d6a95e", "#a8642a", "#6b3a1f"]
ROTULOS_BOI = [
    ("menos de 0,1", "under 0.1"), ("0,1 a 0,5", "0.1 to 0.5"), ("0,5 a 1", "0.5 to 1"), ("1 a 2", "1 to 2"),
    ("2 a 5", "2 to 5"), ("5 a 20", "5 to 20"), ("20 ou mais", "20 or more"),
]
SEM_BOI = "#f6f6f4"
SEM_DADO = "#d5d9dd"


def boi() -> None:
    m = municipios()
    tab, variavel = sidra(PPM)
    for ano in (2014, 2024):
        if (ano, "Bovino") not in tab.columns:
            continue
        vals = [valor_sidra(tab.at[c, (ano, "Bovino")]) if c in tab.index else (None, "fora_da_tabela") for c in m["CD_MUN"]]
        m[f"bovinos_{ano}"] = [v for v, _ in vals]
        if ano == 2024:
            m["situacao_ppm"] = [s for _, s in vals]
    m["bois_hab"] = (m["bovinos_2024"] / m["pop_2022"]).round(3)
    sem = m["bovinos_2024"].isna() | m["pop_2022"].isna()
    m["classe"] = np.where(sem, -2, np.where(m["bovinos_2024"] == 0, -1, np.digitize(m["bois_hab"].fillna(0), LIMITES_BOI)))
    m["classe"] = m["classe"].astype(int)

    def rotulo(c: int, en: bool = False) -> str:
        if c == -2:
            return "no data" if en else "sem dado"
        if c == -1:
            return "no cattle" if en else "sem bovinos"
        return ROTULOS_BOI[c][1 if en else 0]

    m["faixa_bois_hab"] = [rotulo(c) for c in m["classe"]]
    m["mais_boi"] = m["bois_hab"] > 1

    ufs, lim = ufs_brasil(m)
    regras = [(igual("classe", i), f"{ROTULOS_BOI[i][0]} boi por habitante", preenchimento(c, "#ffffff", 0.05))
              for i, c in enumerate(CORES_BOI)]
    regras += [(igual("classe", -1), "sem bovinos", preenchimento(SEM_BOI, "#ffffff", 0.05)),
               (igual("classe", -2), "sem dado", preenchimento(SEM_DADO, "#ffffff", 0.05))]
    estilos = {
        "municipios": [("bois_hab", "Bovinos por habitante", estilo_regras("poligono", regras), True)],
        "ufs": [("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    cols = ["CD_MUN", "NM_MUN", "SIGLA_UF", "regiao", "pop_2022", "bovinos_2014", "bovinos_2024", "situacao_ppm",
            "bois_hab", "mais_boi", "classe", "faixa_bois_hab"]
    m = m[cols + ["geometry"]].sort_values("CD_MUN").reset_index(drop=True)
    tam = gravar("boi", {"municipios": m, "ufs": ufs, "limite_nacional": lim}, estilos, m.drop(columns="geometry"))

    ok = m[m["classe"] >= -1]
    pos = m.set_index("CD_MUN").geometry.to_crs(AREA_BR).representative_point().to_crs(GEO)

    def reg(r) -> dict:
        return {"cd": r.CD_MUN, "nome": r.NM_MUN, "uf": r.SIGLA_UF, "pop": int(r.pop_2022), "bois": int(r.bovinos_2024),
                "bois_hab": float(r.bois_hab), "coord": [round(pos[r.CD_MUN].x, 3), round(pos[r.CD_MUN].y, 3)]}

    por_classe = [{"classe": i, "rotulo": ROTULOS_BOI[i][0], "rotulo_en": ROTULOS_BOI[i][1], "cor": c,
                   "municipios": int((m["classe"] == i).sum()), "bois": int(m.loc[m["classe"] == i, "bovinos_2024"].sum()),
                   "pop": int(m.loc[m["classe"] == i, "pop_2022"].sum())} for i, c in enumerate(CORES_BOI)]
    uf = ok.groupby("SIGLA_UF").agg(bois=("bovinos_2024", "sum"), pop=("pop_2022", "sum"),
                                    mun=("CD_MUN", "size"), mais_boi=("mais_boi", "sum"))
    uf["bois_hab"] = uf["bois"] / uf["pop"]
    reg_ = ok.groupby("regiao").agg(b14=("bovinos_2014", "sum"), b24=("bovinos_2024", "sum"), pop=("pop_2022", "sum"))
    mais = ok[ok["mais_boi"]]
    gravar_cache("biomassa-br-boi", {
        "municipios": para_d3(m, ["CD_MUN", "classe"], tol=0.012, casas=3),
        "classes": por_classe,
        "variavel": variavel,
        "bois": int(ok["bovinos_2024"].sum()), "bois_2014": int(ok["bovinos_2014"].sum()),
        "pop": int(ok["pop_2022"].sum()), "pop_brasil": int(m["pop_2022"].sum()),
        "municipios_total": int(len(m)), "municipios_mais_boi": int(len(mais)),
        "area_mais_boi_pct": round(float(m[m["mais_boi"]].to_crs(AREA_BR).area.sum() / m.to_crs(AREA_BR).area.sum() * 100), 1),
        "pop_mais_boi": int(mais["pop_2022"].sum()), "bois_em_mais_boi": int(mais["bovinos_2024"].sum()),
        "sem_bovinos": int((m["classe"] == -1).sum()), "sem_dado": m.loc[m["classe"] == -2, ["CD_MUN", "NM_MUN", "SIGLA_UF"]].to_dict("records"),
        "maior_rebanho": [reg(r) for r in ok.sort_values("bovinos_2024", ascending=False).head(6).itertuples()],
        "mais_bois_hab": [reg(r) for r in ok[ok["pop_2022"] > 0].sort_values("bois_hab", ascending=False).head(6).itertuples()],
        "ufs": [{"uf": k, "bois": int(v.bois), "pop": int(v["pop"]), "bois_hab": round(float(v.bois_hab), 2),
                 "mun": int(v.mun), "mais_boi": int(v.mais_boi)} for k, v in uf.sort_values("bois_hab", ascending=False).iterrows()],
        "regioes": [{"regiao": k, "bois_2014": int(v.b14), "bois_2024": int(v.b24), "pop": int(v["pop"])} for k, v in reg_.iterrows()],
        "tamanhos": tam,
    })
    print(variavel, "bois", int(ok["bovinos_2024"].sum()), "pop", int(ok["pop_2022"].sum()), "mais boi", len(mais), tam)
    print(pd.DataFrame(por_classe)[["rotulo", "municipios", "bois", "pop"]].to_string())
    print(uf.sort_values("bois_hab", ascending=False).head(8).to_string())
    print(ok.sort_values("bovinos_2024", ascending=False).head(4)[["NM_MUN", "SIGLA_UF", "bovinos_2024", "pop_2022", "bois_hab"]].to_string())
    print(ok.sort_values("bois_hab", ascending=False).head(4)[["NM_MUN", "SIGLA_UF", "bovinos_2024", "pop_2022", "bois_hab"]].to_string())
    print(m[m["classe"] == -2][["NM_MUN", "SIGLA_UF", "pop_2022", "situacao_ppm"]].to_string())


# ------------------------------------------------------------------ 2 eletricidade da biomassa
SIGA_CSV = RAIZ / "scripts" / "colecoes" / "cache" / "downloads" / "aneel_siga" / "siga-empreendimentos-geracao.csv"
# Grupos de combustível: (chave, rótulo, rótulo em inglês, cor, combustíveis do SIGA).
GRUPOS_BIO = [
    ("cana", "bagaço de cana", "sugarcane bagasse", "#c08a2e", ["Bagaço de Cana de Açúcar"]),
    ("licor", "licor negro (celulose)", "black liquor (pulp)", "#6b3d5c", ["Licor Negro"]),
    ("madeira", "madeira: resíduos, lenha, carvão", "wood: residues, firewood, charcoal",
     "#2f5d3a", ["Resíduos Florestais", "Lenha", "Carvão Vegetal", "Gás de Alto Forno - Biomassa"]),
    ("biogas", "biogás", "biogas", "#234e70", ["Biogás-AGR", "Biogás - RA", "Biogás - RU", "Biogás - Floresta"]),
    ("rsu", "lixo urbano queimado", "burnt urban waste", "#4a4e52", ["Resíduos Sólidos Urbanos - RU", "Carvão - RU"]),
    ("outros", "casca de arroz e outros", "rice husk and others", "#7d8a3c",
     ["Casca de Arroz", "Capim Elefante", "Etanol", "Óleos vegetais"]),
]


def _num(s: pd.Series) -> pd.Series:
    """'1.234,5' ou '-20,48' → float."""
    return pd.to_numeric(s.str.replace(".", "", regex=False).str.replace(",", ".", regex=False), errors="coerce")


def eletricidade() -> None:
    d = pd.read_csv(SIGA_CSV, sep=";", dtype=str, encoding="utf-8")
    referencia = d["DatGeracaoConjuntoDados"].iloc[0]
    d["kw"] = _num(d["MdaPotenciaOutorgadaKw"])
    d["operacao"] = d["DscFaseUsina"] == "Operação"
    kw_op_brasil = float(d.loc[d["operacao"], "kw"].sum())
    b = d[d["DscOrigemCombustivel"] == "Biomassa"].copy()
    grupo = {c: g[0] for g in GRUPOS_BIO for c in g[4]}
    b["grupo"] = b["NomFonteCombustivel"].map(grupo)
    assert b["grupo"].notna().all(), b.loc[b["grupo"].isna(), "NomFonteCombustivel"].unique()
    b["lat"] = _num(b["NumCoordNEmpreendimento"].str.replace(".", ",", regex=False))
    b["lon"] = _num(b["NumCoordEEmpreendimento"].str.replace(".", ",", regex=False))
    b["inicio"] = pd.to_datetime(b["DatEntradaOperacao"], errors="coerce")
    # Sem coordenada no SIGA (vem 0 ou vazio): o ponto vai para o centro do primeiro município listado.
    m = municipios()
    b["posicao"] = "coordenada do SIGA"
    sem = b["lat"].isna() | b["lon"].isna() | ((b["lat"] == 0) & (b["lon"] == 0))
    centro = m.set_index(m["NM_MUN"] + " - " + m["SIGLA_UF"]).geometry.to_crs(AREA_BR).representative_point().to_crs(GEO)
    primeiro = b["DscMuninicpios"].str.split(",").str[0].str.strip()
    b.loc[sem, "lon"] = primeiro[sem].map(lambda k: centro[k].x)
    b.loc[sem, "lat"] = primeiro[sem].map(lambda k: centro[k].y)
    b.loc[sem, "posicao"] = "centro do município"
    pts = gpd.GeoDataFrame({
        "nome": b["NomEmpreendimento"].str.strip(), "ceg": b["CodCEG"], "uf": b["SigUFPrincipal"],
        "municipio": b["DscMuninicpios"], "fase": b["DscFaseUsina"], "combustivel": b["NomFonteCombustivel"],
        "grupo": b["grupo"], "potencia_kw": b["kw"].round(1), "inicio_operacao": b["inicio"].dt.strftime("%Y-%m-%d"),
        "proprietario": b["DscPropriRegimePariticipacao"], "posicao": b["posicao"],
    }, geometry=gpd.points_from_xy(b["lon"], b["lat"]), crs=GEO)
    pts = pts.sort_values("potencia_kw", ascending=False).reset_index(drop=True)

    ufs, lim = ufs_brasil(m)
    fora = pts[~pts.within(lim.geometry.iloc[0].buffer(0.05))]
    regras = [(igual("grupo", k), r, marcador(cor, 2.4, tamanho_expr='1 + 0.02 * sqrt("potencia_kw")'))
              for k, r, _, cor, _ in GRUPOS_BIO]
    estilos = {
        "usinas": [("grupo", "Usinas a biomassa por combustível", estilo_regras("ponto", regras, ordem='"potencia_kw" DESC'), True)],
        "ufs": [("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    tam = gravar("eletricidade", {"usinas": pts, "ufs": ufs, "limite_nacional": lim}, estilos, pts.drop(columns="geometry"))

    op = pts[pts["fase"] == "Operação"]
    grupos = []
    for k, r, en, cor, _ in GRUPOS_BIO:
        g = pts[pts["grupo"] == k]
        go = op[op["grupo"] == k]
        grupos.append({"chave": k, "rotulo": r, "rotulo_en": en, "cor": cor, "n": int(len(g)),
                       "kw": float(g["potencia_kw"].sum()), "kw_operacao": float(go["potencia_kw"].sum())})
    decadas = op.assign(dec=(pd.to_datetime(op["inicio_operacao"]).dt.year // 10 * 10)).groupby(["dec", "grupo"])["potencia_kw"].sum()
    uf = op.groupby("uf")["potencia_kw"].sum().sort_values(ascending=False)

    def reg(r) -> dict:
        return {"nome": r.nome, "uf": r.uf, "municipio": r.municipio, "kw": float(r.potencia_kw), "combustivel": r.combustivel,
                "grupo": r.grupo, "coord": [round(r.geometry.x, 3), round(r.geometry.y, 3)]}

    gravar_cache("biomassa-br-eletricidade", {
        "referencia": referencia,
        "pontos": [[r.grupo, round(r.geometry.x, 3), round(r.geometry.y, 3), float(r.potencia_kw), r.fase == "Operação"]
                   for r in pts.itertuples()],
        "grupos": grupos,
        "n": int(len(pts)), "n_operacao": int(len(op)), "kw_operacao": float(op["potencia_kw"].sum()),
        "kw_op_brasil": kw_op_brasil,
        "maiores": [reg(r) for r in op.head(8).itertuples()],
        "maiores_por_grupo": {k: reg(op[op["grupo"] == k].iloc[0]) for k, *_ in GRUPOS_BIO if (op["grupo"] == k).any()},
        "decadas": [{"decada": int(dec), "grupo": g, "kw": float(v)} for (dec, g), v in decadas.items()],
        "ufs": [{"uf": k, "kw": float(v)} for k, v in uf.items()],
        "fora": len(fora),
        "tamanhos": tam,
    })
    print(referencia, len(pts), "op", len(op), round(op["potencia_kw"].sum() / 1e6, 2), "GW de", round(kw_op_brasil / 1e6, 1), "fora", len(fora), tam)
    print(pd.DataFrame(grupos)[["chave", "n", "kw_operacao"]].to_string())
    print(op.head(6)[["nome", "uf", "municipio", "combustivel", "potencia_kw"]].to_string())
    print(uf.head(6).to_string())


# ------------------------------------------------------------------ 3 a lavoura que manda
PAM_TEMP = DADOS / "raw" / "pam" / "TABELA_1612_2024_A_2021.xlsx"
PAM_PERM = DADOS / "raw" / "pam" / "TABELA_1613_2024.xlsx"
# Lavouras com cor própria (as que lideram em mais municípios); o resto vai para «outras».
LAVOURAS = [
    ("soja", "Soja (em grão)", "soja", "soya", "#8a9a3c"),
    ("milho", "Milho (em grão)", "milho", "maize", "#e6c35c"),
    ("cana", "Cana-de-açúcar", "cana-de-açúcar", "sugarcane", "#3f6e4a"),
    ("feijao", "Feijão (em grão)", "feijão", "beans", "#9c4a32"),
    ("mandioca", "Mandioca", "mandioca", "cassava", "#d9a77a"),
    ("cafe", "Café (em grão) Total", "café", "coffee", "#5a3420"),
    ("banana", "Banana (cacho)", "banana", "banana", "#a7c4a0"),
    ("arroz", "Arroz (em casca)", "arroz", "rice", "#7fa3c0"),
    ("cacau", "Cacau (em amêndoa)", "cacau", "cocoa", "#6b3d5c"),
    ("caju", "Castanha de caju", "castanha de caju", "cashew nut", "#c9707a"),
    ("laranja", "Laranja", "laranja", "orange", "#e07b39"),
]
COR_OUTRAS = "#b8bec4"
SEM_LAVOURA = "#f6f6f4"


def lavoura() -> None:
    temp, _ = sidra(PAM_TEMP, 0)
    perm, _ = sidra(PAM_PERM, 0)
    num = lambda df: df.apply(lambda c: c.map(lambda v: valor_sidra(v)[0] or 0.0))  # noqa: E731
    # Café: só o total (arábica e canéfora são parcelas dele). Área plantada das temporárias e
    # área destinada à colheita das permanentes, as duas em hectares.
    t = num(temp[2024].drop(columns=["Total"], errors="ignore"))
    p = num(perm[2024].drop(columns=["Total", "Café (em grão) Arábica", "Café (em grão) Canephora"], errors="ignore"))
    a = pd.concat([t, p], axis=1).fillna(0)
    lider = a.idxmax(axis=1).where(a.max(axis=1) > 0)
    chave = {nome: k for k, nome, *_ in LAVOURAS}

    m = municipios()
    m["area_lavouras_ha"] = m["CD_MUN"].map(a.sum(axis=1)).round(0)
    m["lavoura_lider"] = m["CD_MUN"].map(lider)
    m["area_lider_ha"] = m["CD_MUN"].map(a.max(axis=1)).round(0)
    m["parcela_lider"] = (m["area_lider_ha"] / m["area_lavouras_ha"] * 100).round(1)
    m["grupo"] = m["lavoura_lider"].map(lambda v: chave.get(v, "outras") if isinstance(v, str) else "sem")
    m.loc[m["CD_MUN"].map(lambda c: c not in a.index), "grupo"] = "sem_dado"
    for k, nome, *_ in LAVOURAS[:3]:
        m[f"area_{k}_ha"] = m["CD_MUN"].map(a[nome]).round(0)

    ufs, lim = ufs_brasil(m)
    cores = {k: cor for k, *_, cor in LAVOURAS} | {"outras": COR_OUTRAS, "sem": SEM_LAVOURA, "sem_dado": "#d5d9dd"}
    rot = {k: r for k, _, r, _, _ in LAVOURAS} | {"outras": "outras lavouras", "sem": "sem lavoura", "sem_dado": "sem dado"}
    regras = [(igual("grupo", k), rot[k], preenchimento(c, "#ffffff", 0.05)) for k, c in cores.items()]
    estilos = {
        "municipios": [("lavoura", "Lavoura de maior área", estilo_regras("poligono", regras), True)],
        "ufs": [("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    cols = ["CD_MUN", "NM_MUN", "SIGLA_UF", "regiao", "area_lavouras_ha", "lavoura_lider", "area_lider_ha", "parcela_lider",
            "grupo", "area_soja_ha", "area_milho_ha", "area_cana_ha"]
    m = m[cols + ["geometry"]].sort_values("CD_MUN").reset_index(drop=True)
    tam = gravar("lavoura", {"municipios": m, "ufs": ufs, "limite_nacional": lim}, estilos, m.drop(columns="geometry"))

    pos = m.set_index("CD_MUN").geometry.to_crs(AREA_BR).representative_point().to_crs(GEO)
    ponto = lambda cd: [round(pos[cd].x, 3), round(pos[cd].y, 3)]  # noqa: E731
    total = float(a.values.sum())
    grupos = []
    for k, nome, r, en, cor in LAVOURAS:
        grupos.append({"chave": k, "rotulo": r, "rotulo_en": en, "cor": cor, "municipios": int((m["grupo"] == k).sum()),
                       "area_ha": float(a[nome].sum())})
    grupos.append({"chave": "outras", "rotulo": "outras lavouras", "rotulo_en": "other crops", "cor": COR_OUTRAS,
                   "municipios": int((m["grupo"] == "outras").sum()),
                   "area_ha": total - sum(g["area_ha"] for g in grupos)})
    soja = a["Soja (em grão)"].sort_values(ascending=False)
    mono = m[(m["area_lavouras_ha"] > 50_000)].sort_values("parcela_lider", ascending=False)
    gravar_cache("biomassa-br-lavoura", {
        "municipios": para_d3(m, ["CD_MUN", "grupo"], tol=0.012, casas=3),
        "grupos": grupos,
        "area_total_ha": total,
        "sem_lavoura": int((m["grupo"] == "sem").sum()), "sem_dado": int((m["grupo"] == "sem_dado").sum()),
        "municipios_total": int(len(m)),
        "soja_maior": {"cd": soja.index[0], "nome": m.set_index("CD_MUN").at[soja.index[0], "NM_MUN"],
                       "uf": m.set_index("CD_MUN").at[soja.index[0], "SIGLA_UF"], "ha": float(soja.iloc[0]), "coord": ponto(soja.index[0])},
        "mais_mono": [{"cd": r.CD_MUN, "nome": r.NM_MUN, "uf": r.SIGLA_UF, "lavoura": r.lavoura_lider, "parcela": float(r.parcela_lider),
                       "ha": float(r.area_lavouras_ha), "coord": ponto(r.CD_MUN)} for r in mono.head(6).itertuples()],
        "tamanhos": tam,
    })
    print(len(m), "sem", (m["grupo"] == "sem").sum(), "sem dado", (m["grupo"] == "sem_dado").sum(), round(total / 1e6, 1), "Mha", tam)
    print(pd.DataFrame(grupos)[["chave", "municipios", "area_ha"]].to_string())
    print(soja.head(3), mono.head(4)[["NM_MUN", "SIGLA_UF", "lavoura_lider", "parcela_lider", "area_lavouras_ha"]].to_string())


# ------------------------------------------------------------------ 4 onde está o esterco
# Unidades animais (UA) da FAO para a América do Sul (Guidelines for the preparation of livestock
# sector reviews, 2011): um coeficiente por cabeça, que põe boi, porco e galinha na mesma conta.
UA = [
    ("Bovino", "bovinos", "cattle", 0.70, "#a8642a"),
    ("Bubalino", "búfalos", "buffalo", 0.70, "#7c4423"),
    ("Suíno - total", "suínos", "pigs", 0.25, "#c9707a"),
    ("Galináceos - total", "galináceos", "poultry", 0.01, "#d9c27a"),
    ("Equino", "equinos", "horses", 0.65, "#7d8a3c"),
    ("Ovino", "ovinos", "sheep", 0.10, "#9aa3ab"),
    ("Caprino", "caprinos", "goats", 0.10, "#6f8ba3"),
]
LIMITES_UA = [2, 5, 10, 20, 40, 80]
CORES_UA = ["#f3ead7", "#ead2a4", "#d9b26a", "#c08a2e", "#a8642a", "#7c4423", "#4a2814"]
ROTULOS_UA = [("menos de 2", "under 2"), ("2 a 5", "2 to 5"), ("5 a 10", "5 to 10"), ("10 a 20", "10 to 20"),
              ("20 a 40", "20 to 40"), ("40 a 80", "40 to 80"), ("80 ou mais", "80 or more")]


def esterco() -> None:
    tab, _ = sidra(PPM)
    m = municipios()
    m["area_km2"] = (m.to_crs(AREA_BR).area / 1e6).round(1)
    m["ua"] = 0.0
    for prod, chave, _, coef, _ in UA:
        vals = [valor_sidra(tab.at[c, (2024, prod)])[0] if c in tab.index else None for c in m["CD_MUN"]]
        m[f"cab_{chave}"] = vals
        m[f"ua_{chave}"] = (m[f"cab_{chave}"].fillna(0) * coef).round(1)
        m["ua"] += m[f"ua_{chave}"]
    sem = m["cab_bovinos"].isna() & m["cab_galináceos"].isna() & m["cab_suínos"].isna()
    m["ua"] = m["ua"].where(~sem).round(1)
    m["ua_km2"] = (m["ua"] / m["area_km2"]).round(2)
    m["classe"] = np.where(m["ua_km2"].isna(), -2, np.digitize(m["ua_km2"].fillna(0), LIMITES_UA)).astype(int)
    ua_cols = [f"ua_{u[1]}" for u in UA]
    m["especie_lider"] = m[ua_cols].idxmax(axis=1).str.replace("ua_", "", regex=False).where(m["ua"] > 0)
    m["faixa_ua_km2"] = [ROTULOS_UA[c][0] if c >= 0 else "sem dado" for c in m["classe"]]

    ufs, lim = ufs_brasil(m)
    regras = [(igual("classe", i), f"{ROTULOS_UA[i][0]} UA/km²", preenchimento(c, "#ffffff", 0.05)) for i, c in enumerate(CORES_UA)]
    regras.append((igual("classe", -2), "sem dado", preenchimento("#d5d9dd", "#ffffff", 0.05)))
    estilos = {
        "municipios": [("ua_km2", "Unidades animais por km²", estilo_regras("poligono", regras), True)],
        "ufs": [("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    cols = (["CD_MUN", "NM_MUN", "SIGLA_UF", "regiao", "area_km2"] + [f"cab_{u[1]}" for u in UA] + ua_cols
            + ["ua", "ua_km2", "especie_lider", "classe", "faixa_ua_km2"])
    m = m[cols + ["geometry"]].sort_values("CD_MUN").reset_index(drop=True)
    tam = gravar("esterco", {"municipios": m, "ufs": ufs, "limite_nacional": lim}, estilos, m.drop(columns="geometry"))

    pos = m.set_index("CD_MUN").geometry.to_crs(AREA_BR).representative_point().to_crs(GEO)
    ok = m[m["classe"] >= 0]
    especies = [{"chave": u[1], "rotulo": u[1], "rotulo_en": u[2], "coef": u[3], "cor": u[4],
                 "cabecas": float(ok[f"cab_{u[1]}"].sum()), "ua": float(ok[f"ua_{u[1]}"].sum())} for u in UA]
    topo = ok.sort_values("ua_km2", ascending=False)

    def reg(r) -> dict:
        return {"nome": r.NM_MUN, "uf": r.SIGLA_UF, "ua_km2": float(r.ua_km2), "lider": r.especie_lider,
                "suinos": float(getattr(r, "cab_suínos") or 0), "galinaceos": float(getattr(r, "cab_galináceos") or 0),
                "bovinos": float(r.cab_bovinos or 0), "coord": [round(pos[r.CD_MUN].x, 3), round(pos[r.CD_MUN].y, 3)]}

    gravar_cache("biomassa-br-esterco", {
        "municipios": para_d3(m, ["CD_MUN", "classe"], tol=0.012, casas=3),
        "classes": [{"classe": i, "rotulo": r, "rotulo_en": en, "cor": c, "municipios": int((m["classe"] == i).sum()),
                     "ua": float(m.loc[m["classe"] == i, "ua"].sum())} for i, ((r, en), c) in enumerate(zip(ROTULOS_UA, CORES_UA))],
        "especies": especies,
        "ua": float(ok["ua"].sum()), "area_km2": float(m["area_km2"].sum()),
        "sem_dado": int((m["classe"] == -2).sum()),
        "topo": [reg(r) for r in topo.head(8).itertuples()],
        "uf": [{"uf": k, "ua_km2": round(float(v), 2)} for k, v in (ok.groupby("SIGLA_UF")["ua"].sum() / ok.groupby("SIGLA_UF")["area_km2"].sum()).sort_values(ascending=False).items()],
        "tamanhos": tam,
    })
    print(round(ok["ua"].sum() / 1e6, 1), "mi UA", tam)
    print(pd.DataFrame(especies)[["chave", "cabecas", "ua"]].to_string())
    print(topo.head(6)[["NM_MUN", "SIGLA_UF", "ua_km2", "especie_lider", "cab_suínos", "cab_galináceos"]].to_string())


if __name__ == "__main__":
    temas = {"boi": boi, "eletricidade": eletricidade, "lavoura": lavoura, "esterco": esterco}
    ap = argparse.ArgumentParser()
    ap.add_argument("tema", choices=list(temas))
    temas[ap.parse_args().tema]()
