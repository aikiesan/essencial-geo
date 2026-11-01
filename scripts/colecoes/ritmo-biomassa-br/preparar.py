"""
Coleção «O ritmo da biomassa» (Brasil) — prepara os dados de uma prancha (uso interno).

    .venv-geo/Scripts/python -I -X utf8 scripts/colecoes/ritmo-biomassa-br/preparar.py safras|fator|seca < /dev/null

Lê os resumos mensais do ONS de extrair_ons.py (scripts/colecoes/cache/ritmo-biomassa-br-ons-*.csv), o SIGA da
ANEEL e, para a seca, a energia armazenada dos reservatórios (ONS, EAR diário por subsistema).
Saídas: mapas/<pasta>/dados/<base>.gpkg.zip (com estilos do QGIS), <base>.csv
e scripts/colecoes/cache/ritmo-biomassa-br-<tema>.json (para a prancha e a ficha).
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

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "estados"))
from estilos import preenchimento  # noqa: E402
from comum import (  # noqa: E402
    AREA_BR, CACHE, GEO, RAIZ, TINTA, estilo_contorno, estilo_regras, gravar_cache, gravar_estilos, igual, marcador, zipar,
)

SERIE = {s["tema"]: s for s in json.loads((Path(__file__).parent / "serie.json").read_text(encoding="utf-8"))}
MALHA_BR = RAIZ / "scripts" / "estados" / "cache" / "brasil_0_004.gpkg"
SIGA_CSV = CACHE / "downloads" / "aneel_siga" / "siga-empreendimentos-geracao.csv"
ONS_USINAS = CACHE / "ritmo-biomassa-br-ons-usinas.csv"
ONS_FONTES = CACHE / "ritmo-biomassa-br-ons-fontes.csv"
EAR = CACHE / "downloads" / "ons"
REGIOES = {"1": "Norte", "2": "Nordeste", "3": "Sudeste", "4": "Sul", "5": "Centro-Oeste"}

# Anos usados: 2015 a 2024. Em 2025 quase todas as usinas a biomassa do tipo II-B aparecem com geração zero o mês
# inteiro e os «Conjuntos de Usinas» a biomassa caem de 15 para 2 em outubro: é a forma como o ONS publicou,
# não a safra (ver animacoes/safra-e-seca/LEIA-ME.md). Outubro de 2021 é lacuna de um mês inteiro.
ANOS = list(range(2015, 2025))
LACUNAS = {"2021-10"}
# Grupos de combustível do SIGA (os mesmos da prancha 127): (chave, rótulo, rótulo em inglês, cor, combustíveis do SIGA).
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
GRUPO = {c: g[0] for g in GRUPOS_BIO for c in g[4]}


def _num(s: pd.Series) -> pd.Series:
    """'1.234,5' ou '-20,48' → float."""
    return pd.to_numeric(s.str.replace(".", "", regex=False).str.replace(",", ".", regex=False), errors="coerce")


def sem_acento(s: str) -> str:
    return unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode().lower()


def nucleo(ceg: str) -> str | None:
    """Núcleo do CEG (seis dígitos): o ONS escreve «UTE.AI.SP.030047-0.01», o SIGA «UTE.AI.SP.030047-0.1»."""
    m = re.search(r"\.(\d{6})-\d", str(ceg))
    return m.group(1) if m else None


def municipios() -> gpd.GeoDataFrame:
    m = gpd.read_file(MALHA_BR, engine="pyogrio").set_crs(GEO, allow_override=True)
    m = m[m["CD_MUN"].str.match(r"^\d{7}$") & m["CD_RGINT"].notna()][["CD_MUN", "NM_MUN", "SIGLA_UF", "geometry"]]
    m["regiao"] = m["CD_MUN"].str[0].map(REGIOES)
    return m


def ufs_brasil(m: gpd.GeoDataFrame) -> tuple[gpd.GeoDataFrame, gpd.GeoDataFrame]:
    ufs = m.dissolve(by=["SIGLA_UF", "regiao"], as_index=False)[["SIGLA_UF", "regiao", "geometry"]]
    lim = m.assign(pais="Brasil").dissolve(by="pais", as_index=False)[["pais", "geometry"]]
    return ufs, lim


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


def siga() -> pd.DataFrame:
    d = pd.read_csv(SIGA_CSV, sep=";", dtype=str, encoding="utf-8")
    d["kw_fiscalizada"] = _num(d["MdaPotenciaFiscalizadaKw"])
    d["kw_outorgada"] = _num(d["MdaPotenciaOutorgadaKw"])
    d["lat"] = _num(d["NumCoordNEmpreendimento"].str.replace(".", ",", regex=False))
    d["lon"] = _num(d["NumCoordEEmpreendimento"].str.replace(".", ",", regex=False))
    d["grupo"] = d["NomFonteCombustivel"].map(GRUPO).where(d["DscOrigemCombustivel"] == "Biomassa")
    return d


# ------------------------------------------------------------------ unidades do ONS
# Conjuntos de usinas: o ONS soma várias usinas sob um nome e sem CEG. Cada conjunto vai para o centro do município
# da usina do SIGA de mesmo nome (ou, quando nenhuma tem o nome, da que fica no município do nome), com o combustível
# dela. Ficam de fora os três sem par no SIGA: Conj. Biopav, Conj. Dourados e Conj. Votuporanga 2.
CONJUNTOS = {
    "Conj. Alta Mogiana": "000060", "Conj. Bio Ipê": "030268", "Conj. Bracell": "043249",
    "Conj. Cachoeira Dourada": "030033", "Conj. Chapadão": "030269", "Conj. Da Mata": "029774", "Conj. Edéia": "030080",
    "Conj. Guarani Tanabi": "030095", "Conj. Interlagos": "029461", "Conj. Ivinhema 2": "030115", "Conj. Jataí": "030043",
    "Conj. Quirinópolis": "029268", "Conj. Rio Brilhante": "029718", "Conj. Rio Vermelho": "030543",
    "Conj. Viralcool Castilho": "030445", "Conj. Fíbria": "029694", "Conj. Klabin Celulose": "031098",
}
PQU = re.compile(r"^PQU .+ TERM?\b")
MIN_MESES = 6  # um ano conta para a usina se ela gerou em pelo menos seis meses dele (ver unidades())


def horas_mes(mes: pd.Series) -> np.ndarray:
    return pd.PeriodIndex(mes, freq="M").days_in_month.values * 24


def ons() -> pd.DataFrame:
    """Resumo mensal do ONS de 2015 a 2024, sem o mês de lacuna, com o núcleo do CEG e as horas do mês."""
    u = pd.read_csv(ONS_USINAS, dtype={"ceg": str, "id_ons": str})
    u = u[u["mes"].str[:4].astype(int).isin(ANOS) & ~u["mes"].isin(LACUNAS)].copy()
    u["ano"] = u["mes"].str[:4].astype(int)
    u["m"] = u["mes"].str[5:].astype(int)
    u["nucleo"] = u["ceg"].map(nucleo)
    u["horas_mes"] = horas_mes(u["mes"])
    return u


def unidades(d: pd.DataFrame | None = None) -> tuple[pd.DataFrame, pd.DataFrame, dict]:
    """
    Usinas e conjuntos a biomassa que o ONS acompanha um a um, com o par no SIGA.
    Devolve (unidades, meses, contagem): uma linha por unidade; uma por unidade × mês (MWh, MW médios, ano válido).
    Entram: combustível «Biomassa» do ONS com CEG; «Resíduos Industriais» com CEG de usina a biomassa no SIGA
    (as fábricas de celulose; as siderúrgicas ficam de fora); os conjuntos de CONJUNTOS.
    """
    d = siga() if d is None else d
    s = d.drop_duplicates("IdeNucleoCEG").set_index("IdeNucleoCEG")  # três PCHs repetidas no SIGA; nenhuma a biomassa
    bio = s.index[s["grupo"].notna()]
    u = ons()
    ind = u[u["nucleo"].notna() & (u["nom_tipocombustivel"] == "Biomassa")]
    cel = u[u["nucleo"].isin(bio) & (u["nom_tipocombustivel"] == "Resíduos Industriais")]
    con = u[u["nom_usina"].isin(CONJUNTOS)]
    x = pd.concat([ind, cel, con])
    x["chave"] = np.where(x["nucleo"].notna(), "ceg:" + x["nucleo"].fillna(""), "conj:" + x["nom_usina"])
    x["ancora"] = x["nucleo"].fillna(x["nom_usina"].map(CONJUNTOS))
    x["conjunto"] = x["nucleo"].isna()
    # Uma linha por unidade × mês (a mesma usina pode mudar de modalidade ao longo dos anos).
    meses = x.groupby(["chave", "mes", "ano", "m", "horas_mes"], as_index=False).agg(
        mwh=("mwh", "sum"), horas=("horas", "sum"), horas_pos=("horas_pos", "sum"))
    meses["mw"] = meses["mwh"] / meses["horas_mes"]
    meses["com_dado"] = meses["horas"] > 0
    meses["gerou"] = meses["mwh"] > 0
    # Ano válido: registro em todos os meses (fora a lacuna), geração em pelo menos MIN_MESES deles e alguma variação
    # de um mês para outro. Anos inteiros zerados (usinas que o ONS passou a somar num conjunto, ou que deixou de
    # medir), anos de entrada e saída da série e anos com o mesmo valor em todas as horas (de 2015 a 2020, o ONS
    # repete um número fixo para algumas usinas do tipo III) ficam de fora; zeros na entressafra, dentro de um ano
    # válido, contam como zero.
    porano = meses.groupby(["chave", "ano"]).agg(registros=("com_dado", "sum"), gerou=("gerou", "sum"),
                                                 mw_max=("mw", "max"), mw_min=("mw", "min"), mw_med=("mw", "mean"))
    porano["esperado"] = [12 - sum(1 for l in LACUNAS if int(l[:4]) == a) for a in porano.index.get_level_values("ano")]
    porano["constante"] = (porano["mw_max"] - porano["mw_min"]) < 0.03 * porano["mw_med"]
    porano["valido"] = (porano["registros"] >= porano["esperado"]) & (porano["gerou"] >= MIN_MESES) & ~porano["constante"]
    meses = meses.merge(porano["valido"].reset_index(), on=["chave", "ano"])

    meta = x.sort_values("mes").groupby("chave").agg(
        nome_ons=("nom_usina", "last"), ancora=("ancora", "first"), conjunto=("conjunto", "first"),
        combustivel_ons=("nom_tipocombustivel", "last"), modalidade=("cod_modalidadeoperacao", "last"),
        uf_ons=("id_estado", "last"), subsistema=("id_subsistema", "last"),
        primeiro_mes=("mes", "first"), ultimo_mes=("mes", "last"))
    va = porano[porano["valido"]].reset_index().groupby("chave")["ano"]
    meta["anos_validos"] = va.size()
    meta["anos_validos"] = meta["anos_validos"].fillna(0).astype(int)
    meta["anos"] = va.apply(lambda a: ",".join(str(v) for v in sorted(a)))
    meta["no_siga"] = meta["ancora"].isin(bio)
    j = meta["ancora"].where(meta["no_siga"])
    meta["nome"] = np.where(meta["conjunto"], meta["nome_ons"], j.map(s["NomEmpreendimento"]).str.strip())
    meta["nome"] = meta["nome"].where(meta["nome"].notna(), meta["nome_ons"])
    meta["ceg_siga"] = np.where(meta["conjunto"], None, j.map(s["CodCEG"]))
    meta["uf"] = j.map(s["SigUFPrincipal"]).fillna(meta["uf_ons"])
    meta["municipio"] = j.map(s["DscMuninicpios"])
    meta["combustivel"] = j.map(s["NomFonteCombustivel"])
    meta["grupo"] = j.map(s["grupo"])
    meta["fase_siga"] = j.map(s["DscFaseUsina"])
    meta["kw_siga"] = np.where(meta["conjunto"], np.nan, j.map(s["kw_fiscalizada"]))
    meta["lon"] = j.map(s["lon"])
    meta["lat"] = j.map(s["lat"])
    meta["posicao"] = np.where(meta["conjunto"], "centro do município (conjunto do ONS)", "coordenada do SIGA")
    # Conjuntos e usinas sem coordenada no SIGA: centro do primeiro município listado.
    m = municipios()
    centro = m.set_index(m["NM_MUN"] + " - " + m["SIGLA_UF"]).geometry.to_crs(AREA_BR).representative_point().to_crs(GEO)
    sem = meta["no_siga"] & (meta["conjunto"] | meta["lat"].isna() | ((meta["lat"] == 0) & (meta["lon"] == 0)))
    primeiro = meta["municipio"].str.split(",").str[0].str.strip()
    meta.loc[sem, "lon"] = primeiro[sem].map(lambda k: centro[k].x)
    meta.loc[sem, "lat"] = primeiro[sem].map(lambda k: centro[k].y)
    meta.loc[sem & ~meta["conjunto"], "posicao"] = "centro do município"
    meta["regiao"] = meta["uf"].map(m.drop_duplicates("SIGLA_UF").set_index("SIGLA_UF")["regiao"])

    ind_ons = ind.groupby("nucleo")["mwh"].sum()
    no_siga = ind_ons.index.isin(bio)
    contagem = {
        "ons_biomassa_com_ceg": int(len(ind_ons)),
        "ons_biomassa_com_ceg_no_siga": int(no_siga.sum()),
        "ons_biomassa_mwh_no_siga_pct": round(float(ind_ons[no_siga].sum() / ind_ons.sum() * 100), 1),
        "ons_biomassa_fora_do_siga": sorted(ind[ind["nucleo"].isin(ind_ons.index[~no_siga])]["nom_usina"].unique().tolist()),
        "celulose_com_ceg": int(cel["nucleo"].nunique()),
        "siderurgicas_fora": sorted(u[(u["nom_tipocombustivel"] == "Resíduos Industriais") & u["nucleo"].notna()
                                      & ~u["nucleo"].isin(bio)]["nom_usina"].unique().tolist()),
        "conjuntos": int(con["nom_usina"].nunique()),
        "conjuntos_fora": sorted(set(u.loc[(u["cod_modalidadeoperacao"] == "Conjunto de Usinas")
                                           & (u["nom_tipocombustivel"] == "Biomassa"), "nom_usina"]) - set(CONJUNTOS)),
        "agregados_fora": sorted(u.loc[(u["cod_modalidadeoperacao"] == "Pequenas Usinas (Tipo III)")
                                       & (u["nom_tipocombustivel"] == "Biomassa"), "nom_usina"].unique().tolist()),
        "anos_constantes": int((porano["constante"] & (porano["registros"] >= porano["esperado"])).sum()),
        "usinas_com_ano_constante": sorted(meta.loc[porano[porano["constante"] & (porano["registros"] >= porano["esperado"])]
                                                    .index.get_level_values("chave").unique(), "nome"].tolist()),
    }
    return meta.reset_index(), meses, contagem


def perfis(meses: pd.DataFrame) -> pd.DataFrame:
    """MW médios de cada mês do calendário, na média dos anos válidos da unidade (colunas 1 a 12)."""
    v = meses[meses["valido"]]
    return v.groupby(["chave", "m"])["mw"].mean().unstack().reindex(columns=range(1, 13))


def pequenas_termicas(u: pd.DataFrame | None = None) -> pd.DataFrame:
    """Séries «PQU <área> TERM - CARGA GLOBAL» (pequenas térmicas que o ONS soma por estado, combustível não
    informado), de 2022 a 2024 (a série começa em março de 2021): MW médios por estado × mês, na média dos anos."""
    u = ons() if u is None else u
    p = u[u["nom_usina"].str.match(PQU) & (u["ano"] >= 2022)]
    t = p.groupby(["id_estado", "ano", "m", "horas_mes"])["mwh"].sum().reset_index()
    t["mw"] = t["mwh"] / t["horas_mes"]
    return t.groupby(["id_estado", "m"])["mw"].mean().unstack().reindex(columns=range(1, 13)).fillna(0)


# ------------------------------------------------------------------ comum às três pranchas
# Paleta cíclica dos meses (janeiro → dezembro): azuis no verão chuvoso, amarelos e laranjas no inverno seco,
# roxos na volta; dezembro encosta em janeiro.
CORES_MES = ["#2b5c8a", "#3d86a8", "#5ca7a2", "#86b06e", "#bcb64f", "#e0b23f",
             "#e2913a", "#cf6c34", "#b04a3c", "#8c3d5c", "#64407a", "#3f4a85"]
MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]
SECOS = list(range(5, 12))  # maio a novembro: a estação seca do SIN; num ano sem estação, 7/12 = 58,3% da geração
MIN_ANOS = 2     # anos válidos para a unidade entrar no mapa
MIN_MW = 1.0     # MW médios para a unidade entrar no mapa
FORCA_MIN = 1.3  # mês de pico abaixo de 1,3 vez a média do ano: sem estação marcada (cinza no mapa 135)
SEM_ESTACAO = "#b8bec4"
UF_SEM_ESTACAO = "#e2e5e8"
CENTRO_SUL = {"Sudeste", "Sul", "Centro-Oeste"}


def clarear(cor: str, f: float) -> str:
    """Mistura a cor com branco (f = 0 → cor; 1 → branco)."""
    r, g, b = (int(cor[i:i + 2], 16) for i in (1, 3, 5))
    return "#" + "".join(f"{round(c + (255 - c) * f):02x}" for c in (r, g, b))


def perfilado(d: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame, dict, pd.DataFrame]:
    """Unidades com o perfil do ano (parcela de cada mês, %), o mês de pico, a força do pico e a parcela seca."""
    meta, meses, cont = unidades(d)
    meta = meta.set_index("chave")
    pf = perfis(meses)
    sh = pf.div(pf.sum(axis=1), axis=0)
    meta["mw_medio"] = pf.mean(axis=1)
    meta["pico"] = sh.idxmax(axis=1)
    meta["forca"] = sh.max(axis=1) * 12
    meta["seca"] = sh[SECOS].sum(axis=1) * 100
    for m in range(1, 13):
        meta[f"p{m:02d}"] = sh[m] * 100
    meta["no_mapa"] = (meta["anos_validos"] >= MIN_ANOS) & (meta["mw_medio"] >= MIN_MW) & meta["no_siga"]
    return meta, meses, cont, pf


def estados(d: pd.DataFrame) -> pd.DataFrame:
    """Pequenas térmicas do ONS por estado (perfil, pico, força, parcela seca) e, do SIGA, quanto da potência térmica
    em operação do estado queima bagaço (para ler a série, que não informa o combustível)."""
    pq = pequenas_termicas()
    pq = pq[pq.mean(axis=1) > 0]
    pq = pq[pq.index.str.fullmatch(r"[A-Z]{2}")]
    sh = pq.div(pq.sum(axis=1), axis=0)
    t = pd.DataFrame({"pqu_mw_medio": pq.mean(axis=1), "pqu_pico": sh.idxmax(axis=1),
                      "pqu_forca": sh.max(axis=1) * 12, "pqu_seca": sh[SECOS].sum(axis=1) * 100})
    for m in range(1, 13):
        t[f"pqu_p{m:02d}"] = sh[m] * 100
    ute = d[(d["SigTipoGeracao"] == "UTE") & (d["DscFaseUsina"] == "Operação")]
    kw = ute.groupby("SigUFPrincipal")["kw_fiscalizada"].sum()
    bag = ute[ute["NomFonteCombustivel"] == "Bagaço de Cana de Açúcar"].groupby("SigUFPrincipal")["kw_fiscalizada"].sum()
    t["siga_termicas_mw"] = kw / 1000
    t["siga_bagaco_pct"] = (bag.reindex(kw.index).fillna(0) / kw * 100)
    # Só as térmicas de até 30 MW, mais perto das que o ONS soma na série de pequenas usinas.
    pe = ute[ute["kw_fiscalizada"] <= 30000]
    kw30 = pe.groupby("SigUFPrincipal")["kw_fiscalizada"].sum()
    bag30 = pe[pe["NomFonteCombustivel"] == "Bagaço de Cana de Açúcar"].groupby("SigUFPrincipal")["kw_fiscalizada"].sum()
    t["siga_ate30_mw"] = kw30 / 1000
    t["siga_ate30_bagaco_pct"] = (bag30.reindex(kw30.index).fillna(0) / kw30 * 100)
    return t


def pontos_gdf(x: pd.DataFrame, cols: list[str]) -> gpd.GeoDataFrame:
    return gpd.GeoDataFrame(x[cols].reset_index(), geometry=gpd.points_from_xy(x["lon"], x["lat"]), crs=GEO)


COLS_BASE = ["nome", "nome_ons", "conjunto", "uf", "municipio", "regiao", "combustivel", "grupo", "combustivel_ons",
             "modalidade", "ceg_siga", "posicao", "anos_validos", "anos"]


def _r(v, casas=1):
    return None if pd.isna(v) else round(float(v), casas)


# ------------------------------------------------------------------ 135 duas safras, um país
def safras() -> None:
    d = siga()
    meta, meses, cont, pf = perfilado(d)
    x = meta[meta["no_mapa"]].sort_values("mw_medio", ascending=False).copy()
    x["classe"] = np.where(x["forca"] >= FORCA_MIN, x["pico"].map(lambda m: MESES[int(m) - 1]), "sem_estacao")
    perfil = [f"p{m:02d}" for m in range(1, 13)]
    pts = pontos_gdf(x, COLS_BASE + ["mw_medio", "pico", "forca", "seca", "classe"] + perfil)
    for c in ["mw_medio", "forca", "seca"] + perfil:
        pts[c] = pts[c].round(2)
    pts["pico"] = pts["pico"].astype(int)

    m = municipios()
    ufs, lim = ufs_brasil(m)
    e = estados(d)
    ufs = ufs.merge(e, left_on="SIGLA_UF", right_index=True, how="left")
    ufs["classe"] = np.where(ufs["pqu_forca"] >= FORCA_MIN, ufs["pqu_pico"].map(lambda v: MESES[int(v) - 1] if pd.notna(v) else ""),
                             np.where(ufs["pqu_mw_medio"].notna(), "sem_estacao", "sem_serie"))
    for c in ufs.columns:
        if c.startswith(("pqu_", "siga_")):
            ufs[c] = ufs[c].round(2)

    regras = [(igual("classe", k), f"pico em {k}", marcador(c, 2.4, tamanho_expr='1.2 + 0.55 * sqrt("mw_medio")'))
              for k, c in zip(MESES, CORES_MES)]
    regras.append((igual("classe", "sem_estacao"), f"sem estação marcada (pico < {FORCA_MIN} × a média)",
                   marcador(SEM_ESTACAO, 2.4, tamanho_expr='1.2 + 0.55 * sqrt("mw_medio")')))
    regras_uf = [(igual("classe", k), f"pequenas térmicas: pico em {k}", preenchimento(clarear(c, 0.55), "#5c6166", 0.3))
                 for k, c in zip(MESES, CORES_MES)]
    regras_uf += [(igual("classe", "sem_estacao"), "pequenas térmicas sem estação marcada", preenchimento(UF_SEM_ESTACAO, "#5c6166", 0.3)),
                  (igual("classe", "sem_serie"), "sem série de pequenas térmicas", preenchimento("#f6f6f4", "#5c6166", 0.3))]
    estilos = {
        "usinas": [("pico", "Mês de maior geração (média dos anos válidos)", estilo_regras("ponto", regras, ordem='"mw_medio" DESC'), True)],
        "ufs": [("pico_pequenas", "Pequenas térmicas do ONS: mês de maior geração, 2022–2024", estilo_regras("poligono", regras_uf, rotulo_campo="SIGLA_UF"), True),
                ("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), False)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    tam = gravar("safras", {"usinas": pts, "ufs": ufs, "limite_nacional": lim}, estilos, pts.drop(columns="geometry"))

    cana = x[x["grupo"] == "cana"]
    soma = lambda q: (q / q.sum() * 100).round(2).tolist()  # noqa: E731
    pc = pf.loc[cana.index].sum()
    pq = pequenas_termicas()
    pq = pq[pq.index.isin(e.index)]
    reg = pq.index.map(m.drop_duplicates("SIGLA_UF").set_index("SIGLA_UF")["regiao"])
    ne = pq[reg == "Nordeste"].sum()
    cs = pq[reg.isin(CENTRO_SUL)].sum()
    ne_cana = meta[(meta["regiao"] == "Nordeste") & (meta["grupo"] == "cana")]
    safra_cs = [4, 5, 6, 7, 8, 9, 10, 11]
    safra_ne = [9, 10, 11, 12, 1, 2, 3]
    regiao_uf = m.drop_duplicates("SIGLA_UF").set_index("SIGLA_UF")["regiao"]
    ufs_out = []
    for uf, r in e.sort_values("pqu_mw_medio", ascending=False).iterrows():
        ufs_out.append({"uf": uf, "regiao": regiao_uf[uf], "mw": _r(r.pqu_mw_medio),
                        "pico": int(r.pqu_pico), "forca": _r(r.pqu_forca, 2), "seca": _r(r.pqu_seca),
                        "perfil": [_r(r[f"pqu_p{k:02d}"], 2) for k in range(1, 13)], "bagaco_pct": _r(r.siga_bagaco_pct, 0),
                        "bagaco_ate30_pct": _r(r.siga_ate30_bagaco_pct, 0)})
    gravar_cache("ritmo-biomassa-br-safras", {
        "referencia": d["DatGeracaoConjuntoDados"].iloc[0],
        "cores_mes": CORES_MES, "forca_min": FORCA_MIN,
        "pontos": [[round(r.geometry.x, 3), round(r.geometry.y, 3), float(r.mw_medio), int(r.pico), float(r.forca), r.grupo, bool(r.conjunto), r.nome, r.uf]
                   for r in pts.itertuples()],
        "ufs": ufs_out,
        "rosas": {"cana_cs": soma(pc), "pqu_cs": soma(cs), "pqu_ne": soma(ne)},
        "n_mapa": int(len(x)), "n_cana": int(len(cana)), "n_conjuntos": int(x["conjunto"].sum()),
        "grupos": {k: int(v) for k, v in x["grupo"].value_counts().items()},
        "cana_pico_jun_ago": int(cana["pico"].isin([6, 7, 8]).sum()),
        "cana_pico_safra": int(cana["pico"].isin(safra_cs).sum()),
        "cana_cs_safra_pct": round(float(pc[safra_cs].sum() / pc.sum() * 100), 1),
        "cana_cs_pico": int(pc.idxmax()),
        "pqu_ne_safra_pct": round(float(ne[safra_ne].sum() / ne.sum() * 100), 1),
        "pqu_cs_safra_pct": round(float(cs[safra_cs].sum() / cs.sum() * 100), 1),
        "pqu_ne_pico": int(ne.idxmax()), "pqu_cs_pico": int(cs.idxmax()),
        "pqu_ne_mw": round(float(ne.mean()), 1), "pqu_cs_mw": round(float(cs.mean()), 1),
        "ne_cana_unidades": ne_cana["nome"].tolist(), "ne_cana_com_ano_valido": int((ne_cana["anos_validos"] > 0).sum()),
        "fracos": x.loc[x["forca"] < FORCA_MIN, ["nome", "uf", "grupo"]].to_dict("records"),
        "contagem": cont,
        "tamanhos": tam,
    })
    print(tam, len(x), x["grupo"].value_counts().to_dict())
    print(pd.Series(soma(pc), index=MESES).to_string())
    print(e.round(1).to_string())


# ------------------------------------------------------------------ 136 o que a usina gera de fato
FATOR_LIM = [20, 35, 50, 65]
FATOR_CORES = ["#e3e8ec", "#b3c6d5", "#7a9fbd", "#3f6f96", "#1c4166"]
FATOR_ROT = ["menos de 20%", "20 a 35%", "35 a 50%", "50 a 65%", "65% ou mais"]


def fator() -> None:
    d = siga()
    meta, meses, cont, pf = perfilado(d)
    v = meses[meses["valido"]].groupby("chave").agg(mwh=("mwh", "sum"), horas=("horas_mes", "sum"))
    x = meta.join(v, how="inner")
    conj = x[x["no_mapa"] & x["conjunto"]]
    x = x[x["no_mapa"] & ~x["conjunto"] & (x["kw_siga"] > 0)].copy()
    x["mw_instalado"] = x["kw_siga"] / 1000
    x["mw_gerado"] = x["mwh"] / x["horas"]
    x["fator"] = x["mw_gerado"] / x["mw_instalado"] * 100
    x["mw_mes_pico"] = pf.max(axis=1).reindex(x.index)
    x["pico_acima_da_potencia"] = x["mw_mes_pico"] > x["mw_instalado"]
    x["classe"] = np.digitize(x["fator"], FATOR_LIM)
    x = x.sort_values("mw_instalado", ascending=False)
    cols = COLS_BASE + ["mw_instalado", "mw_gerado", "fator", "classe", "mw_mes_pico", "pico_acima_da_potencia", "fase_siga"]
    pts = pontos_gdf(x, cols)
    for c in ["mw_instalado", "mw_gerado", "fator", "mw_mes_pico"]:
        pts[c] = pts[c].round(2)

    m = municipios()
    ufs, lim = ufs_brasil(m)
    op = d[(d["grupo"].notna()) & (d["DscFaseUsina"] == "Operação")]
    siga_uf = op.groupby("SigUFPrincipal")["kw_fiscalizada"].sum() / 1000
    t = x.groupby("uf").agg(ons_usinas=("nome", "size"), ons_mw_instalado=("mw_instalado", "sum"), ons_mw_gerado=("mw_gerado", "sum"))
    ufs["siga_biomassa_mw"] = ufs["SIGLA_UF"].map(siga_uf).round(1)
    ufs = ufs.merge(t.round(1), left_on="SIGLA_UF", right_index=True, how="left")
    ufs["ons_usinas"] = ufs["ons_usinas"].fillna(0).astype(int)

    tam_expr = '1.2 + 0.32 * sqrt("mw_instalado")'
    regras = [(f"&quot;classe&quot; = {i}", f"fator de capacidade: {r}", marcador(c, 2.4, borda="#5c6166", tamanho_expr=tam_expr))
              for i, (r, c) in enumerate(zip(FATOR_ROT, FATOR_CORES))]
    estilos = {
        "usinas": [("fator", "Fator de capacidade (geração média ÷ potência fiscalizada)", estilo_regras("ponto", regras, ordem='"mw_instalado" DESC'), True)],
        "ufs": [("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    tam = gravar("fator", {"usinas": pts, "ufs": ufs, "limite_nacional": lim}, estilos, pts.drop(columns="geometry"))

    grupos = []
    for k, r, en, cor, _ in GRUPOS_BIO:
        g = x[x["grupo"] == k]
        grupos.append({"chave": k, "rotulo": r, "rotulo_en": en, "cor": cor, "n": int(len(g)),
                       "mw_instalado": float(g["mw_instalado"].sum()), "mw_gerado": float(g["mw_gerado"].sum()),
                       "fator": _r(g["mwh"].sum() / (g["mw_instalado"] * g["horas"]).sum() * 100) if len(g) else None,
                       "usinas": [[u.nome, u.uf, round(float(u.fator), 1), round(float(u.mw_instalado), 1)] for u in g.itertuples()],
                       "siga_n": int((op["grupo"] == k).sum()), "siga_mw": float(op.loc[op["grupo"] == k, "kw_fiscalizada"].sum() / 1000)})
    ufs_out = pd.DataFrame({"siga": siga_uf}).join(t, how="left").fillna(0).sort_values("siga", ascending=False)

    def reg(r) -> dict:
        return {"nome": r.nome, "uf": r.uf, "municipio": r.municipio, "grupo": r.grupo, "mw_instalado": round(float(r.mw_instalado), 1),
                "mw_gerado": round(float(r.mw_gerado), 1), "fator": round(float(r.fator), 1), "anos": r.anos,
                "coord": [round(float(r.lon), 3), round(float(r.lat), 3)]}

    gravar_cache("ritmo-biomassa-br-fator", {
        "referencia": d["DatGeracaoConjuntoDados"].iloc[0],
        "classes": [{"rotulo": r, "cor": c} for r, c in zip(FATOR_ROT, FATOR_CORES)], "limites": FATOR_LIM,
        "pontos": [[round(r.geometry.x, 3), round(r.geometry.y, 3), float(r.mw_instalado), float(r.mw_gerado), int(r.classe), r.grupo]
                   for r in pts.itertuples()],
        "n": int(len(x)), "mw_instalado": float(x["mw_instalado"].sum()), "mw_gerado": float(x["mw_gerado"].sum()),
        "fator": round(float(x["mwh"].sum() / (x["mw_instalado"] * x["horas"]).sum() * 100), 1),
        "fator_mediana": round(float(x["fator"].median()), 1),
        "grupos": grupos,
        "ufs": [{"uf": k, "siga": float(r.siga), "ons_n": int(r.ons_usinas), "ons_mw": float(r.ons_mw_instalado), "ons_ger": float(r.ons_mw_gerado)}
                for k, r in ufs_out.iterrows()],
        "siga_mw": float(siga_uf.sum()), "siga_n": int(len(op)),
        "conjuntos_fora": int(len(conj)), "conjuntos_mw_gerado": round(float((conj["mwh"] / conj["horas"]).sum()), 1),
        "pico_acima": [reg(r) for r in x[x["pico_acima_da_potencia"]].itertuples()],
        "usinas": [reg(r) for r in x.itertuples()],
        "contagem": cont,
        "tamanhos": tam,
    })
    print(tam, len(x), round(x["mw_instalado"].sum()), round(x["mw_gerado"].sum()), "conjuntos fora", len(conj))
    print(pd.DataFrame(grupos)[["chave", "n", "mw_instalado", "mw_gerado", "fator", "siga_n", "siga_mw"]].round(1).to_string())
    print(x[x["pico_acima_da_potencia"]][["nome", "mw_instalado", "mw_mes_pico", "fator"]].round(1).to_string())
    print(ufs_out.head(12).round(0).to_string())


# ------------------------------------------------------------------ 137 a biomassa na seca
SECA_LIM = [45, 55, 62, 75, 85]
SECA_CORES = ["#9c4a32", "#d29a7e", "#efe9df", "#a9c1d3", "#5f8db0", "#234e70"]
SECA_ROT = ["menos de 45%", "45 a 55%", "55 a 62% (ano sem estação: 58%)", "62 a 75%", "75 a 85%", "85% ou mais"]


def sin_mensal() -> dict:
    """Perfil do ano no SIN, 2015–2024: geração do combustível «Biomassa» (cada ano dividido pela média dele),
    parcela da biomassa e da água na geração do mês e energia armazenada nos reservatórios (EAR, % do máximo)."""
    f = pd.read_csv(ONS_FONTES)
    f = f[f["mes"].str[:4].astype(int).isin(ANOS) & ~f["mes"].isin(LACUNAS)].copy()
    f["ano"] = f["mes"].str[:4].astype(int)
    f["m"] = f["mes"].str[5:].astype(int)
    f["mw"] = f["mwh"] / horas_mes(f["mes"])
    tot = f.groupby(["ano", "m"])["mw"].sum()
    bio = f[f["nom_tipocombustivel"] == "Biomassa"].groupby(["ano", "m"])["mw"].sum()
    hid = f[f["nom_tipocombustivel"] == "Hidráulica"].groupby(["ano", "m"])["mw"].sum()
    idx = bio / bio.groupby("ano").transform("mean")
    perfil = idx.groupby("m").mean()
    perfil = perfil / perfil.sum() * 100
    e = pd.concat([pd.read_csv(EAR / f"EAR_DIARIO_SUBSISTEMA_{a}.csv", sep=";") for a in ANOS])
    dia = e.groupby("ear_data")[["ear_verif_subsistema_mwmes", "ear_max_subsistema"]].sum()
    dia["pct"] = dia["ear_verif_subsistema_mwmes"] / dia["ear_max_subsistema"] * 100
    dia.index = pd.to_datetime(dia.index)
    porano = dia["pct"].groupby([dia.index.year, dia.index.month]).mean()
    ear = porano.groupby(level=1).mean()
    return {
        "bio_perfil": perfil.round(2).tolist(),
        "bio_seca_pct": round(float(perfil[SECOS].sum()), 1),
        "bio_parcela": (bio / tot * 100).groupby("m").mean().round(2).tolist(),
        "hid_parcela": (hid / tot * 100).groupby("m").mean().round(1).tolist(),
        "bio_mw_medio": round(float(bio.mean()), 0),
        "ear": ear.round(1).tolist(),
        "ear_min_ano": porano.groupby(level=1).min().round(1).tolist(),
        "ear_max_ano": porano.groupby(level=1).max().round(1).tolist(),
        "dias_ear": int(len(dia)),
    }


def seca() -> None:
    d = siga()
    meta, meses, cont, pf = perfilado(d)
    x = meta[meta["no_mapa"]].sort_values("mw_medio", ascending=False).copy()
    x["classe"] = np.digitize(x["seca"], SECA_LIM)
    perfil = [f"p{m:02d}" for m in range(1, 13)]
    pts = pontos_gdf(x, COLS_BASE + ["mw_medio", "seca", "classe", "pico"] + perfil)
    for c in ["mw_medio", "seca"] + perfil:
        pts[c] = pts[c].round(2)
    pts["pico"] = pts["pico"].astype(int)

    m = municipios()
    ufs, lim = ufs_brasil(m)
    e = estados(d)
    ufs = ufs.merge(e[["pqu_mw_medio", "pqu_seca", "pqu_pico", "siga_bagaco_pct", "siga_ate30_bagaco_pct"]], left_on="SIGLA_UF", right_index=True, how="left")
    ufs["classe"] = np.where(ufs["pqu_seca"].notna(), np.digitize(ufs["pqu_seca"].fillna(0), SECA_LIM), -1)
    for c in ["pqu_mw_medio", "pqu_seca", "siga_bagaco_pct", "siga_ate30_bagaco_pct"]:
        ufs[c] = ufs[c].round(2)

    tam_expr = '1.2 + 0.55 * sqrt("mw_medio")'
    regras = [(f"&quot;classe&quot; = {i}", f"maio a novembro: {r}", marcador(c, 2.4, borda="#5c6166", tamanho_expr=tam_expr))
              for i, (r, c) in enumerate(zip(SECA_ROT, SECA_CORES))]
    regras_uf = [(f"&quot;classe&quot; = {i}", f"pequenas térmicas, maio a novembro: {r}", preenchimento(clarear(c, 0.5), "#5c6166", 0.3))
                 for i, (r, c) in enumerate(zip(SECA_ROT, SECA_CORES))]
    regras_uf.append(("&quot;classe&quot; = -1", "sem série de pequenas térmicas", preenchimento("#f6f6f4", "#5c6166", 0.3)))
    estilos = {
        "usinas": [("seca", "Parcela da geração do ano em maio a novembro", estilo_regras("ponto", regras, ordem='"mw_medio" DESC'), True)],
        "ufs": [("seca_pequenas", "Pequenas térmicas do ONS: parcela de maio a novembro, 2022–2024", estilo_regras("poligono", regras_uf, rotulo_campo="SIGLA_UF"), True),
                ("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), False)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    tam = gravar("seca", {"usinas": pts, "ufs": ufs, "limite_nacional": lim}, estilos, pts.drop(columns="geometry"))

    sin = sin_mensal()
    cana = x[x["grupo"] == "cana"]
    cel = x[x["grupo"] == "licor"]
    pc = pf.loc[x.index].sum()
    gravar_cache("ritmo-biomassa-br-seca", {
        "referencia": d["DatGeracaoConjuntoDados"].iloc[0],
        "classes": [{"rotulo": r, "cor": c} for r, c in zip(SECA_ROT, SECA_CORES)], "limites": SECA_LIM,
        "pontos": [[round(r.geometry.x, 3), round(r.geometry.y, 3), float(r.mw_medio), int(r.classe), float(r.seca), r.grupo, r.nome, r.uf]
                   for r in pts.itertuples()],
        "ufs": [{"uf": k, "seca": _r(r.pqu_seca), "mw": _r(r.pqu_mw_medio), "classe": int(np.digitize(r.pqu_seca, SECA_LIM)),
                 "bagaco_pct": _r(r.siga_bagaco_pct, 0), "bagaco_ate30_pct": _r(r.siga_ate30_bagaco_pct, 0)}
                for k, r in e.sort_values("pqu_seca").iterrows()],
        "sin": sin,
        "n_mapa": int(len(x)),
        "unidades_seca_pct": round(float(pc[SECOS].sum() / pc.sum() * 100), 1),
        "cana_n": int(len(cana)), "cana_mediana": round(float(cana["seca"].median()), 1),
        "cana_75": int((cana["seca"] >= 75).sum()),
        "celulose": [[r.nome, r.uf, round(float(r.seca), 1)] for r in cel.itertuples()],
        "acima_75": int((x["seca"] >= 75).sum()),
        "abaixo_55": [[r.nome, r.uf, r.grupo, round(float(r.seca), 1)] for r in x[x["seca"] < 55].itertuples()],
        "contagem": cont,
        "tamanhos": tam,
    })
    print(tam, len(x), json.dumps(sin))
    print(e[["pqu_seca", "pqu_mw_medio", "siga_bagaco_pct", "siga_ate30_bagaco_pct"]].sort_values("pqu_seca").round(1).to_string())


if __name__ == "__main__":
    temas = {"safras": safras, "fator": fator, "seca": seca}
    ap = argparse.ArgumentParser()
    ap.add_argument("tema", choices=list(temas))
    temas[ap.parse_args().tema]()
