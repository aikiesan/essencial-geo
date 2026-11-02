"""
Coleção «A nota de cada usina» (Brasil, RenovaBio) — prepara os dados de uma prancha (uso interno).

    .venv-geo/Scripts/python -I -X utf8 scripts/colecoes/renovabio-br/preparar.py nota|elegivel|renovacao

Saídas: mapas/<pasta>/dados/<base>.gpkg.zip (com estilos do QGIS), <base>.csv
e scripts/colecoes/cache/renovabio-br-<tema>.json (para a prancha e a ficha).
Fontes: planilha da ANP dos Certificados da Produção ou Importação Eficiente de Biocombustíveis
(dados-brutos/anp-renovabio/), painéis de produtores de etanol e de biodiesel da ANP (município e capacidade
por CNPJ), localidades e malha do IBGE.
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
from comum import (  # noqa: E402
    AREA_BR, GEO, RAIZ, TINTA, estilo_contorno, estilo_regras, gravar_cache, gravar_estilos, igual, marcador, zipar,
)
from estilos import preenchimento  # noqa: E402
from comum import simbolo, qml, rotulo  # noqa: E402

SERIE = {s["tema"]: s for s in json.loads((Path(__file__).parent / "serie.json").read_text(encoding="utf-8"))}
MALHA_BR = RAIZ / "scripts" / "estados" / "cache" / "brasil_0_004.gpkg"
PLANILHA = RAIZ / "dados-brutos" / "anp-renovabio" / "certificados-aprovados-producao.xlsx"
ETANOL = RAIZ / "dados-brutos" / "anp" / "etanol" / "pb-da-etanol"
BIODIESEL = RAIZ / "dados-brutos" / "anp-biodiesel" / "pb-da-biodiesel" / "Biodiesel_DadosAbertos_CSV_Capacidade.csv"
LOCALIDADES = RAIZ / "dados-brutos" / "ibge-localidades" / "Localidades_Brasil_gpkg.zip"
REGIOES = {"1": "Norte", "2": "Nordeste", "3": "Sudeste", "4": "Sul", "5": "Centro-Oeste"}
UF = {
    "Acre": "AC", "Alagoas": "AL", "Amapá": "AP", "Amazonas": "AM", "Bahia": "BA", "Ceará": "CE", "Distrito Federal": "DF",
    "Espírito Santo": "ES", "Goiás": "GO", "Maranhão": "MA", "Mato Grosso": "MT", "Mato Grosso do Sul": "MS",
    "Minas Gerais": "MG", "Pará": "PA", "Paraíba": "PB", "Paraná": "PR", "Pernambuco": "PE", "Piauí": "PI",
    "Rio de Janeiro": "RJ", "Rio Grande do Norte": "RN", "Rio Grande do Sul": "RS", "Rondônia": "RO", "Roraima": "RR",
    "Santa Catarina": "SC", "São Paulo": "SP", "Sergipe": "SE", "Tocantins": "TO",
}
NOMES_ANP = {"BA|MUQUEM DE SAO FRANCISCO": "BA|MUQUEM DO SAO FRANCISCO"}
# Emissores que não estão nos painéis de produtores da ANP (biometano e uma usina de etanol): município lido no
# endereço do emissor primário da própria planilha. Biometano Sul: o endereço é de escritório em Piracicaba.
MANUAL = {
    "05340860000125": ("SP", "Ourinhos"),            # Usina São Luiz S.A., Fazenda Santa Maria, Ourinhos/SP
    "11131464000587": ("RJ", "Seropédica"),          # Gás Verde
    "14788495000170": ("SP", "Narandiba"),           # Cocal Energia
    "17173460000203": ("RJ", "São Pedro da Aldeia"),  # GNR Dois Arcos
    "45281972000130": ("SP", "Piracicaba"),          # Raízen-Geo Biogás Costa Pinto
    "35536099000125": ("RS", "Triunfo"),             # CTR Resíduo Zero (Bioo)
    "20287659000188": ("CE", "Caucaia"),             # GNR Fortaleza
    "47360931000164": ("SP", "Piracicaba"),          # Biometano Sul (endereço de escritório)
    "12415018000214": ("PR", "Tamboara"),            # Geo Elétrica Tamboara
    "38615333000106": ("SP", "Elias Fausto"),        # CRI Geo Biogás
    "48119972000126": ("SP", "Caieiras"),            # Essencis Biometano
}
ATUALIZACAO = "27/10/2026"  # data da planilha da ANP (página consultada em 01/11/2026)

ROTAS = [
    # chave, rótulo PT, rótulo EN, cor (prancha 157), forma (prancha 156)
    ("cana", "etanol de cana", "cane ethanol", "#6f8f3a", "circulo"),
    ("milho", "etanol de milho", "corn ethanol", "#c9a227", "quadrado"),
    ("flex", "etanol de cana e milho", "cane-and-corn ethanol", "#9a7b2e", "quadrado"),
    ("biodiesel", "biodiesel", "biodiesel", "#4f7590", "triangulo"),
    ("biometano", "biometano", "biomethane", "#8c3f2b", "losango"),
]
NOME_ROTA = {k: (pt, en) for k, pt, en, *_ in ROTAS}


def chave(uf: str, nome: str) -> str:
    s = unicodedata.normalize("NFD", str(nome)).encode("ascii", "ignore").decode().upper()
    s = re.sub(r"[^A-Z0-9 ]", " ", s.replace("'", "").replace("-", " "))
    return f"{uf}|{re.sub(r'\s+', ' ', s).strip()}"


def numero_br(s: pd.Series) -> pd.Series:
    return pd.to_numeric(s.astype(str).str.replace(".", "", regex=False).str.replace(",", ".", regex=False))


def num(x) -> float | None:
    """Célula numérica da planilha; algumas vêm como texto ('\\t\\n100,00')."""
    if isinstance(x, (int, float, np.floating)):
        return None if pd.isna(x) else float(x)
    s = re.sub(r"[^\d,\.]", "", str(x)).replace(",", ".")
    return float(s) if s else None


def limpa(s) -> str:
    return re.sub(r"\s+", " ", str(s).replace("​", "")).strip()


def rota(r: str) -> str:
    r = str(r).lower()
    if "biodiesel" in r:
        return "biodiesel"
    if "biometano" in r:
        return "biometano"
    if "internacional" in r:
        return "importado"
    if "integrada" in r and "milho" in r:
        return "flex"
    if "milho" in r:
        return "milho"
    return "cana"  # inclui a usina integrada de primeira e segunda geração de cana (Raízen Costa Pinto)


# ------------------------------------------------------------------ leitura da planilha
COLS = ["n", "nome", "cnpj", "processo", "biocomb", "rota_anp", "nota", "eleg", "fator", "l_cbio", "aprov", "validade",
        "firma", "endereco", "motivo"]


def aba(nome: str) -> pd.DataFrame:
    """Uma linha por combustível de cada certificado; campos do certificado repetidos nas linhas do anidro."""
    d = pd.read_excel(PLANILHA, sheet_name=nome, header=1, engine="openpyxl")
    n = 14 if nome == "Válidos" else 15
    d = d.iloc[:, :n]
    d.columns = COLS[:n]
    lg = d.index[d["n"].astype(str).str.strip() == "Legenda"]
    if len(lg):
        d = d.loc[: lg[0] - 1]
    d = d[d[["nome", "biocomb", "nota"]].notna().any(axis=1)].copy()
    d["cert"] = d["processo"].notna().cumsum()
    for c in [x for x in d.columns if x not in ("biocomb", "nota", "fator", "l_cbio", "cert")]:
        d[c] = d.groupby("cert")[c].ffill()
    d["cnpj14"] = d["cnpj"].astype(str).str.replace(r"\D", "", regex=True).str.zfill(14)
    d["biocomb"] = d["biocomb"].astype(str).str.lower().str.strip()
    for k in ("nota", "eleg", "fator"):
        d[k] = d[k].map(num)
    d["aprov"] = pd.to_datetime(d["aprov"], errors="coerce")
    d["validade"] = pd.to_datetime(d["validade"], errors="coerce")
    d["rota"] = d["rota_anp"].map(rota)
    return d


def por_certificado(d: pd.DataFrame) -> pd.DataFrame:
    """Uma linha por certificado: nota e fator do combustível principal (hidratado, biodiesel ou biometano)."""
    d = d.copy()
    d["principal"] = ~d["biocomb"].str.contains("anidro")
    d = d.sort_values(["cert", "principal"], ascending=[True, False])
    p = d.groupby("cert").first()
    ani = d[d["biocomb"].str.contains("anidro")].groupby("cert")["nota"].first()
    p["nota_anidro"] = ani
    return p


def sedes() -> gpd.GeoDataFrame:
    g = gpd.read_file(f"zip://{LOCALIDADES}!BR_localidades_2022.gpkg", engine="pyogrio",
                      where="SCT_LOCALIDADE = 'Sede Municipal'")
    g = g[["CD_MUN", "geometry"]].to_crs(GEO).drop_duplicates("CD_MUN").set_index("CD_MUN")
    return g


def malha() -> gpd.GeoDataFrame:
    m = gpd.read_file(MALHA_BR, engine="pyogrio").set_crs(GEO, allow_override=True)
    m = m[m["CD_MUN"].str.match(r"^\d{7}$") & m["CD_RGINT"].notna()][["CD_MUN", "NM_MUN", "SIGLA_UF", "geometry"]]
    m["regiao"] = m["CD_MUN"].str[0].map(REGIOES)
    return m.reset_index(drop=True)


def paineis() -> pd.DataFrame:
    """Último mês de cada CNPJ nos painéis de etanol e de biodiesel: município e capacidade autorizada (m³/dia)."""
    arqs = sorted(ETANOL.glob("Etanol_Capacidade *.csv"))
    e = pd.concat([pd.read_csv(a, encoding="utf-8-sig", dtype=str) for a in arqs], ignore_index=True)
    e.columns = ["mes", "razao_social", "cnpj", "regiao_anp", "estado", "municipio_anp", "anidro", "hidratado"]
    e["cap_m3d"] = pd.concat([numero_br(e["anidro"]), numero_br(e["hidratado"])], axis=1).max(axis=1)
    e["painel"] = "etanol"
    b = pd.read_csv(BIODIESEL, encoding="utf-8-sig", dtype=str)
    b.columns = ["mes", "razao_social", "cnpj", "regiao_anp", "estado", "municipio_anp", "cap"]
    b["cap_m3d"] = numero_br(b["cap"])
    b["painel"] = "biodiesel"
    p = pd.concat([e, b], ignore_index=True)
    p["data"] = pd.to_datetime(p["mes"], format="%m/%Y")
    p["cnpj14"] = p["cnpj"].str.zfill(14)
    p["uf"] = p["estado"].map(UF)
    assert p["uf"].notna().all()
    p = p.sort_values("data").groupby(["painel", "cnpj14"]).last().reset_index()
    p["chave"] = [NOMES_ANP.get(chave(u, n), chave(u, n)) for u, n in zip(p["uf"], p["municipio_anp"])]
    fim = p.groupby("painel")["data"].max()
    p["no_ultimo_mes"] = p["data"] == p["painel"].map(fim)
    return p[["painel", "cnpj14", "chave", "cap_m3d", "mes", "no_ultimo_mes"]]


def base() -> dict:
    """Certificados válidos (usinas no Brasil) com município, sede, capacidade e o primeiro certificado do CNPJ."""
    v = aba("Válidos")
    c = aba("Cancelados ou Suspensos")
    p = por_certificado(v)
    assert not p["cnpj14"].duplicated().any()
    imp = p[p["rota"] == "importado"]
    p = p[p["rota"] != "importado"].copy()
    m = malha()
    cd = dict(zip([chave(u, n) for u, n in zip(m["SIGLA_UF"], m["NM_MUN"])], m["CD_MUN"]))
    pn = paineis()
    # Rota diz o painel: biodiesel no de biodiesel, etanol no de etanol.
    pn_e = pn[pn["painel"] == "etanol"].set_index("cnpj14")
    pn_b = pn[pn["painel"] == "biodiesel"].set_index("cnpj14")
    linhas = []
    for r in p.itertuples():
        fonte = pn_b if r.rota == "biodiesel" else pn_e
        if r.cnpj14 in MANUAL:
            uf, nm = MANUAL[r.cnpj14]
            k, cap, mes, ult, loc = chave(uf, nm), None, None, None, "endereço do certificado"
        elif r.cnpj14 in fonte.index:
            x = fonte.loc[r.cnpj14]
            k, cap, mes, ult, loc = x["chave"], float(x["cap_m3d"]), x["mes"], bool(x["no_ultimo_mes"]), "painel da ANP"
        else:
            raise SystemExit(f"sem município: {r.cnpj14} {r.nome!r}")
        linhas.append({"cert": r.Index, "CD_MUN": cd.get(k), "chave": k, "cap_m3d": cap, "mes_cap": mes, "cap_no_ultimo_mes": ult,
                       "localizacao": loc})
    loc = pd.DataFrame(linhas).set_index("cert")
    assert loc["CD_MUN"].notna().all(), loc[loc["CD_MUN"].isna()]
    p = p.join(loc)
    p = p.merge(m.drop(columns="geometry"), on="CD_MUN", how="left").set_index(p.index)
    s = sedes()
    p["lon"] = p["CD_MUN"].map(s.geometry.x).round(4)
    p["lat"] = p["CD_MUN"].map(s.geometry.y).round(4)
    assert p["lon"].notna().all()
    p["nome"] = p["nome"].map(limpa)
    p["firma"] = p["firma"].map(limpa)

    # Primeiro certificado de cada CNPJ (abas de cancelados, vencidos ou suspensos), combustível principal.
    h = por_certificado(c)
    h = h[h["aprov"].dt.year.between(2019, 2026)]
    h = h.sort_values("aprov")
    h0 = h.groupby("cnpj14").first()
    nh = h.groupby("cnpj14").size()
    p["nota_0"] = p["cnpj14"].map(h0["nota"])
    p["eleg_0"] = p["cnpj14"].map(h0["eleg"])
    p["aprov_0"] = p["cnpj14"].map(h0["aprov"])
    p["certificados_anteriores"] = p["cnpj14"].map(nh).fillna(0).astype(int)
    # Volume elegível × fator: CBIO por m³ de biocombustível vendido.
    p["cbio_m3"] = p["fator"] * 1000 * p["eleg"] / 100
    p = p.reset_index(drop=True)
    return {"p": p, "importados": imp, "validos_linhas": v, "hist": h}


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


def ufs_lim() -> tuple[gpd.GeoDataFrame, gpd.GeoDataFrame]:
    m = malha()
    ufs = m.dissolve(by=["SIGLA_UF", "regiao"], as_index=False)[["SIGLA_UF", "regiao", "geometry"]]
    lim = m.assign(pais="Brasil").dissolve(by="pais", as_index=False)[["pais", "geometry"]]
    return ufs, lim


CAMPOS = ["cnpj14", "nome", "rota", "nota", "nota_anidro", "eleg", "fator", "cbio_m3", "aprov", "validade", "firma",
          "CD_MUN", "NM_MUN", "SIGLA_UF", "regiao", "cap_m3d", "mes_cap", "localizacao", "lon", "lat"]


def pontos(p: pd.DataFrame, campos: list[str]) -> gpd.GeoDataFrame:
    d = p[campos].copy()
    for k in ("aprov", "validade", "aprov_0"):
        if k in d:
            d[k] = d[k].dt.strftime("%Y-%m-%d")
    return gpd.GeoDataFrame(d, geometry=gpd.points_from_xy(d["lon"], d["lat"]), crs=GEO)


def estilo_uf_regras(campo: str, limites: list[float], cores: list[str], rotulos: list[str], sem: str) -> str:
    q = f"&quot;{campo}&quot;"
    itens = [(f"{q} IS NULL", sem, simbolo("fill", "0", preenchimento("#ffffff", "#9aa1a8", 0.15)))]
    ini = [-1e9] + limites
    fim = limites + [1e9]
    for i, (a, b, cor, r) in enumerate(zip(ini, fim, cores, rotulos)):
        itens.append((f"{q} &gt;= {a!r} AND {q} &lt; {b!r}", r, simbolo("fill", str(i + 1), preenchimento(cor, "#9aa1a8", 0.15))))
    regras = "".join(f'<rule key="r{i}" filter="{f}" label="{r}" symbol="{i}"/>' for i, (f, r, _) in enumerate(itens))
    simb = "".join(s for _, _, s in itens)
    renderer = (f'<renderer-v2 type="RuleRenderer" symbollevels="0" forceraster="0" enableorderby="0">'
                f'<rules key="root">{regras}</rules><symbols>{simb}</symbols></renderer-v2>')
    return qml(renderer, "poligono", rotulo("SIGLA_UF", tamanho=7, cor="#33373a", prioridade=3))


FORMA_QGIS = {"circulo": "circle", "quadrado": "square", "triangulo": "triangle", "losango": "diamond"}


# ------------------------------------------------------------------ 1 a nota de cada usina
CLASSES_NOTA = [45, 55, 60, 65, 75]
CORES_NOTA = ["#9c4a32", "#d6a96a", "#e6dcb4", "#a9c08a", "#5f8a4a", "#24472a"]
ROTULOS_NOTA = [("abaixo de 45", "below 45"), ("45 a 55", "45 to 55"), ("55 a 60", "55 to 60"), ("60 a 65", "60 to 65"),
                ("65 a 75", "65 to 75"), ("75 ou mais", "75 or more")]


def classe_nota(v: float) -> int:
    return int(np.searchsorted(CLASSES_NOTA, v, side="right"))


def nota() -> None:
    b = base()
    p = b["p"]
    p["classe_nota"] = p["nota"].map(classe_nota)
    ufs, lim = ufs_lim()
    por_uf = p.groupby("SIGLA_UF").agg(usinas=("nota", "size"), nota_mediana=("nota", "median"))
    eta = p[p["rota"].isin(["cana", "milho", "flex"])].groupby("SIGLA_UF")["nota"].agg(["median", "size"])
    ufs["usinas"] = ufs["SIGLA_UF"].map(por_uf["usinas"]).fillna(0).astype(int)
    ufs["nota_mediana"] = ufs["SIGLA_UF"].map(por_uf["nota_mediana"]).round(2)
    ufs["etanol_usinas"] = ufs["SIGLA_UF"].map(eta["size"]).fillna(0).astype(int)
    ufs["etanol_nota_mediana"] = ufs["SIGLA_UF"].map(eta["median"]).round(2)
    pts = pontos(p, CAMPOS + ["classe_nota"]).sort_values("nota", ascending=False).reset_index(drop=True)

    regras = []
    for k, pt, _, _, forma in ROTAS:
        for i, cor in enumerate(CORES_NOTA):
            regras.append((f"{igual('rota', k)} AND &quot;classe_nota&quot; = {i}", f"{pt} · nota {ROTULOS_NOTA[i][0]}",
                           marcador(cor, 2.6, forma=FORMA_QGIS[forma], borda="#1a1c1e", largura_borda=0.15)))
    estilos = {
        "usinas": [("nota", "Nota de Eficiência Energético-Ambiental (gCO2eq/MJ), cor; rota, forma",
                    estilo_regras("ponto", regras, ordem='"nota" ASC'), True)],
        "ufs": [("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    tam = gravar("nota", {"usinas": pts, "ufs": ufs, "limite_nacional": lim}, estilos, pts.drop(columns="geometry"))

    rotas = []
    for k, pt, en, cor, forma in ROTAS:
        x = p[p["rota"] == k]
        rotas.append({"chave": k, "rotulo": pt, "rotulo_en": en, "forma": forma, "n": int(len(x)),
                      "mediana": round(float(x["nota"].median()), 2), "min": float(x["nota"].min()), "max": float(x["nota"].max()),
                      "notas": sorted(round(float(v), 2) for v in x["nota"]),
                      "l_cbio_mediana": round(float((1 / x["fator"]).median()), 0) if k != "biometano" else None})
    bd = p[p["rota"] == "biodiesel"]
    alto = bd[bd["nota"] >= 70]
    baixo = bd[bd["nota"] < 50]
    eta_all = p[p["rota"].isin(["cana", "milho", "flex"])]
    top_eta = eta_all.sort_values("nota", ascending=False).iloc[0]
    fundo_eta = eta_all.sort_values("nota").iloc[0]
    uf_tab = (eta_all.groupby("SIGLA_UF")["nota"].agg(["median", "size"]).query("size >= 5")
              .sort_values("median", ascending=False))
    gravar_cache("renovabio-br-nota", {
        "atualizacao": ATUALIZACAO,
        "classes": [{"cor": c_, "rotulo": r[0], "rotulo_en": r[1]} for c_, r in zip(CORES_NOTA, ROTULOS_NOTA)],
        "rotas": rotas,
        "pontos": [[r.rota, float(r.lon), float(r.lat), float(r.nota), int(r.classe_nota), r.NM_MUN, r.SIGLA_UF] for r in pts.itertuples()],
        "total": int(len(p)), "municipios": int(p["CD_MUN"].nunique()), "ufs": int(p["SIGLA_UF"].nunique()),
        "importados": [{"nome": limpa(r.nome), "nota": float(r.nota)} for r in b["importados"].itertuples()],
        "biodiesel_alto": {"n": int(len(alto)), "mediana": round(float(alto["nota"].median()), 2)},
        "biodiesel_baixo": {"n": int(len(baixo)), "mediana": round(float(baixo["nota"].median()), 2)},
        "biodiesel_meio": int(len(bd) - len(alto) - len(baixo)),
        "etanol_topo": {"nome": top_eta["nome"], "nota": float(top_eta["nota"]), "mun": top_eta["NM_MUN"], "uf": top_eta["SIGLA_UF"],
                        "lon": float(top_eta["lon"]), "lat": float(top_eta["lat"]), "rota": top_eta["rota"]},
        "etanol_fundo": {"nome": fundo_eta["nome"], "nota": float(fundo_eta["nota"]), "mun": fundo_eta["NM_MUN"], "uf": fundo_eta["SIGLA_UF"],
                         "lon": float(fundo_eta["lon"]), "lat": float(fundo_eta["lat"]), "rota": fundo_eta["rota"]},
        "etanol_ufs": [{"uf": k, "mediana": round(float(v["median"]), 2), "n": int(v["size"])} for k, v in uf_tab.iterrows()],
        "etanol_mediana": round(float(eta_all["nota"].median()), 2), "etanol_n": int(len(eta_all)),
        "tamanhos": tam,
    })
    print(tam)
    print(pd.DataFrame(rotas).drop(columns="notas").to_string())
    print(uf_tab.round(2).to_string())
    print("topo", top_eta[["nome", "nota", "NM_MUN", "SIGLA_UF"]].to_dict(), "fundo", fundo_eta[["nome", "nota", "NM_MUN", "SIGLA_UF"]].to_dict())
    print("biodiesel ≥70:", len(alto), alto["nota"].median(), "<50:", len(baixo), baixo["nota"].median())
    print("classes", p["classe_nota"].value_counts().sort_index().to_dict())
    print(p["localizacao"].value_counts().to_dict())


# ------------------------------------------------------------------ 2 o litro que não conta
CLASSES_ELEG = [60, 75, 85, 92]
CORES_ELEG = ["#d98b6c", "#efc4a5", "#f4ead6", "#d3dfc6", "#a9c29a"]
ROTULOS_ELEG = [("abaixo de 60 %", "below 60%"), ("60 a 75 %", "60 to 75%"), ("75 a 85 %", "75 to 85%"), ("85 a 92 %", "85 to 92%"),
                ("92 % ou mais", "92% or more")]


def elegivel() -> None:
    b = base()
    p = b["p"]
    cp = p[p["cap_m3d"].notna() & (p["cap_m3d"] > 0)].copy()
    cp["cap_elegivel_m3d"] = cp["cap_m3d"] * cp["eleg"] / 100
    cp["cap_fora_m3d"] = cp["cap_m3d"] - cp["cap_elegivel_m3d"]
    ufs, lim = ufs_lim()
    g = cp.groupby("SIGLA_UF").agg(usinas=("eleg", "size"), cap=("cap_m3d", "sum"), cap_el=("cap_elegivel_m3d", "sum"))
    g["eleg_pond"] = g["cap_el"] / g["cap"] * 100
    ufs["usinas"] = ufs["SIGLA_UF"].map(g["usinas"]).fillna(0).astype(int)
    ufs["cap_m3d"] = ufs["SIGLA_UF"].map(g["cap"]).round(1)
    ufs["cap_elegivel_m3d"] = ufs["SIGLA_UF"].map(g["cap_el"]).round(1)
    ufs["eleg_ponderado_pct"] = ufs["SIGLA_UF"].map(g["eleg_pond"]).round(1)
    campos = CAMPOS + ["cap_elegivel_m3d", "cap_fora_m3d"]
    pts = pontos(cp, campos).sort_values("cap_m3d", ascending=False).reset_index(drop=True)
    # Biometano: sem capacidade nos painéis da ANP; vai no GPKG como ponto, sem tamanho.
    bm = pontos(p[p["rota"] == "biometano"], CAMPOS)

    def grupo(sel: pd.Series) -> dict:
        x = cp[sel]
        return {"n": int(len(x)), "cap": float(x["cap_m3d"].sum()), "cap_el": float(x["cap_elegivel_m3d"].sum()),
                "pct": round(float(x["cap_elegivel_m3d"].sum() / x["cap_m3d"].sum() * 100), 1),
                "mediana": round(float(x["eleg"].median()), 1), "abaixo_50": int((x["eleg"] < 50).sum())}

    eta = cp["rota"].isin(["cana", "milho", "flex"])
    bd = cp["rota"] == "biodiesel"
    rot = {k: grupo(cp["rota"] == k) for k in ("cana", "milho", "flex", "biodiesel")}
    # Biodiesel: a nota e a fração andam em sentidos opostos.
    x = cp[bd]
    corr = float(np.corrcoef(x["nota"], x["eleg"])[0, 1])
    alto = x[x["nota"] >= 70]
    baixo = x[x["nota"] < 50]
    cbio_alto = float((alto["fator"] * 1000 * alto["eleg"] / 100).median())
    cbio_baixo = float((baixo["fator"] * 1000 * baixo["eleg"] / 100).median())
    paradoxo = x.sort_values("nota", ascending=False).iloc[0]

    regras = []
    for k, pt, _, cor, _ in ROTAS[:4]:
        regras.append((igual("rota", k), f"{pt}: capacidade (anel)", marcador(cor, 2, vazado=True, tamanho_expr='1 + 0.12 * sqrt("cap_m3d")')))
    for k, pt, _, cor, _ in ROTAS[:4]:
        regras.append((igual("rota", k), f"{pt}: parte elegível (disco)", marcador(cor, 2, alfa=0.85, tamanho_expr='1 + 0.12 * sqrt("cap_elegivel_m3d")')))
    estilos = {
        "usinas": [("elegivel", "Capacidade autorizada (anel) e parte elegível (disco), m³/dia",
                    estilo_regras("ponto", regras, ordem='"cap_m3d" DESC'), True)],
        "biometano": [("biometano", "Usinas de biometano certificadas (sem capacidade nos painéis)",
                       estilo_regras("ponto", [("1 = 1", "biometano", marcador("#8c3f2b", 2.6, forma="diamond"))]), True)],
        "ufs": [("eleg", "Volume elegível ponderado pela capacidade, % (etanol e biodiesel)",
                 estilo_uf_regras("eleg_ponderado_pct", CLASSES_ELEG, CORES_ELEG, [r[0] for r in ROTULOS_ELEG], "sem usina com capacidade"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    tam = gravar("elegivel", {"usinas": pts, "biometano": bm, "ufs": ufs, "limite_nacional": lim}, estilos, pts.drop(columns="geometry"))

    cls = lambda v: None if pd.isna(v) else int(np.searchsorted(CLASSES_ELEG, v, side="right"))  # noqa: E731
    uf_lista = g.sort_values("cap", ascending=False)
    gravar_cache("renovabio-br-elegivel", {
        "atualizacao": ATUALIZACAO,
        "classes": [{"cor": c_, "rotulo": r[0], "rotulo_en": r[1]} for c_, r in zip(CORES_ELEG, ROTULOS_ELEG)],
        "rotas": [{"chave": k, "rotulo": pt, "rotulo_en": en, "cor": cor, **rot[k]} for k, pt, en, cor, _ in ROTAS[:4]],
        "pontos": [[r.rota, float(r.lon), float(r.lat), float(r.cap_m3d), float(r.cap_elegivel_m3d), float(r.eleg), r.NM_MUN, r.SIGLA_UF]
                   for r in pts.itertuples()],
        "biometano": [[float(r.lon), float(r.lat)] for r in bm.itertuples()],
        "ufs": {k: {"classe": cls(v.eleg_pond), "pct": round(float(v.eleg_pond), 1), "cap": float(v.cap), "n": int(v.usinas)}
                for k, v in g.iterrows()},
        "uf_lista": [{"uf": k, "pct": round(float(v.eleg_pond), 1), "cap": float(v.cap), "cap_el": float(v.cap_el), "n": int(v.usinas)}
                     for k, v in uf_lista.iterrows()],
        "total": grupo(cp["rota"].notna()), "etanol": grupo(eta), "biodiesel": grupo(bd),
        "sem_capacidade": int(p["cap_m3d"].isna().sum() + (p["cap_m3d"] == 0).sum()),
        "fora_do_ultimo_mes": int((cp["cap_no_ultimo_mes"] == False).sum()),  # noqa: E712
        "biodiesel_corr": round(corr, 2),
        "biodiesel_alto": {"n": int(len(alto)), "nota": round(float(alto["nota"].median()), 1), "eleg": round(float(alto["eleg"].median()), 1),
                           "cbio_m3": round(cbio_alto, 2)},
        "biodiesel_baixo": {"n": int(len(baixo)), "nota": round(float(baixo["nota"].median()), 1), "eleg": round(float(baixo["eleg"].median()), 1),
                            "cbio_m3": round(cbio_baixo, 2)},
        "biodiesel_pontos": [[float(r.nota), float(r.eleg)] for r in x.itertuples()],
        "paradoxo": {"nome": paradoxo["nome"], "nota": float(paradoxo["nota"]), "eleg": float(paradoxo["eleg"]), "mun": paradoxo["NM_MUN"],
                     "uf": paradoxo["SIGLA_UF"], "lon": float(paradoxo["lon"]), "lat": float(paradoxo["lat"])},
        "tamanhos": tam,
    })
    print(tam)
    print(pd.DataFrame(rot).T.to_string())
    print("total", grupo(cp["rota"].notna()), "eta", grupo(eta), "bd", grupo(bd))
    print(uf_lista.round(1).to_string())
    print("corr", corr, "alto", len(alto), alto[["nota", "eleg"]].median().to_dict(), cbio_alto, "baixo", len(baixo),
          baixo[["nota", "eleg"]].median().to_dict(), cbio_baixo)
    print("sem cap", p["cap_m3d"].isna().sum(), (p["cap_m3d"] == 0).sum(), "fora do último mês", (cp["cap_no_ultimo_mes"] == False).sum())  # noqa: E712
    print(paradoxo[["nome", "nota", "eleg", "NM_MUN", "SIGLA_UF"]].to_dict())


# ------------------------------------------------------------------ 3 a segunda nota
CLASSES_DELTA = [-5, -1, 1, 5]
CORES_DELTA = ["#9c4a32", "#e0ad83", "#d3d6d9", "#8fb0c6", "#2f5f86"]
ROTULOS_DELTA = [("caiu mais de 5", "fell by more than 5"), ("caiu 1 a 5", "fell 1 to 5"), ("quase igual (±1)", "about the same (±1)"),
                 ("subiu 1 a 5", "rose 1 to 5"), ("subiu mais de 5", "rose by more than 5")]


def renovacao() -> None:
    b = base()
    p = b["p"]
    r = p[p["nota_0"].notna()].copy()
    r["delta_nota"] = (r["nota"] - r["nota_0"]).round(2)
    r["delta_eleg"] = (r["eleg"] - r["eleg_0"]).round(2)
    r["classe_delta"] = r["delta_nota"].map(lambda v: int(np.searchsorted(CLASSES_DELTA, v, side="left")) if v > 0
                                             else int(np.searchsorted(CLASSES_DELTA, v, side="right")))
    # Bordas: −5 e −1 caem em «caiu»; +1 e +5 em «subiu 1 a 5» / «mais de 5» abertos à direita.
    r["classe_delta"] = np.select([r["delta_nota"] < -5, r["delta_nota"] < -1, r["delta_nota"] <= 1, r["delta_nota"] <= 5], [0, 1, 2, 3], 4)
    ufs, lim = ufs_lim()
    g = r.groupby("SIGLA_UF").agg(usinas=("delta_nota", "size"), delta_mediano=("delta_nota", "median"))
    ufs["usinas_renovadas"] = ufs["SIGLA_UF"].map(g["usinas"]).fillna(0).astype(int)
    ufs["delta_nota_mediano"] = ufs["SIGLA_UF"].map(g["delta_mediano"]).round(2)
    campos = CAMPOS + ["nota_0", "eleg_0", "aprov_0", "certificados_anteriores", "delta_nota", "delta_eleg", "classe_delta"]
    pts = pontos(r, campos).sort_values("delta_nota").reset_index(drop=True)
    regras = [(f"&quot;classe_delta&quot; = {i}", ROTULOS_DELTA[i][0], marcador(cor, 2.8, borda="#1a1c1e", largura_borda=0.15))
              for i, cor in enumerate(CORES_DELTA)]
    estilos = {
        "usinas": [("delta", "Nota do certificado em vigor − nota do primeiro certificado (gCO2eq/MJ)",
                    estilo_regras("ponto", regras, ordem='"classe_delta" ASC'), True)],
        "ufs": [("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    tam = gravar("renovacao", {"usinas": pts, "ufs": ufs, "limite_nacional": lim}, estilos, pts.drop(columns="geometry"))

    rotas = []
    for k, pt, en, cor, _ in ROTAS:
        x = r[r["rota"] == k]
        if not len(x):
            continue
        rotas.append({"chave": k, "rotulo": pt, "rotulo_en": en, "n": int(len(x)),
                      "nota_0": round(float(x["nota_0"].median()), 2), "nota": round(float(x["nota"].median()), 2),
                      "delta": round(float(x["delta_nota"].median()), 2), "subiu": int((x["delta_nota"] > 0).sum()),
                      "eleg_0": round(float(x["eleg_0"].median()), 1), "eleg": round(float(x["eleg"].median()), 1)})
    cls = r["classe_delta"].value_counts().reindex(range(5), fill_value=0)
    anos = r.groupby(r["aprov_0"].dt.year).agg(n=("delta_nota", "size"), nota_0=("nota_0", "median"), nota=("nota", "median"))
    milho = r[r["rota"] == "milho"]
    cana = r[r["rota"] == "cana"]
    maior = r.sort_values("delta_nota").iloc[-1]
    queda = r.sort_values("delta_nota").iloc[0]
    # Distribuição da mudança, de 2 em 2 pontos (histograma do painel).
    bins = list(range(-36, 26, 2))
    hist = np.histogram(r["delta_nota"].clip(-35.9, 23.9), bins=bins)[0]
    gravar_cache("renovabio-br-renovacao", {
        "atualizacao": ATUALIZACAO,
        "classes": [{"cor": c_, "rotulo": rr[0], "rotulo_en": rr[1], "n": int(cls[i])} for i, (c_, rr) in enumerate(zip(CORES_DELTA, ROTULOS_DELTA))],
        "rotas": rotas,
        "pontos": [[int(x.classe_delta), float(x.lon), float(x.lat), float(x.delta_nota), x.rota] for x in pts.itertuples()],
        "n": int(len(r)), "total_validos": int(len(p)), "primeira": int(len(p) - len(r)),
        "subiu": int((r["delta_nota"] > 0).sum()), "caiu": int((r["delta_nota"] < 0).sum()),
        "mediana_delta": round(float(r["delta_nota"].median()), 2),
        "mediana_0": round(float(r["nota_0"].median()), 2), "mediana_1": round(float(r["nota"].median()), 2),
        "anos_primeiro": [{"ano": int(k), "n": int(v.n)} for k, v in anos.iterrows()],
        "hist": {"bins": bins, "n": [int(v) for v in hist]},
        "milho": {"n": int(len(milho)), "nota_0": round(float(milho["nota_0"].median()), 2), "nota": round(float(milho["nota"].median()), 2),
                  "eleg_0": round(float(milho["eleg_0"].median()), 1), "eleg": round(float(milho["eleg"].median()), 1)},
        "cana_subiu_pct": round(float((cana["delta_nota"] > 0).mean() * 100), 1),
        "regioes": [{"regiao": k, "n": int(len(x)), "subiu": int((x["delta_nota"] > 0).sum()), "caiu": int((x["delta_nota"] < 0).sum()),
                     "delta": round(float(x["delta_nota"].median()), 2)}
                    for k, x in r.groupby("regiao")],
        "maior": {"nome": maior["nome"], "nota_0": float(maior["nota_0"]), "nota": float(maior["nota"]), "mun": maior["NM_MUN"], "uf": maior["SIGLA_UF"],
                  "lon": float(maior["lon"]), "lat": float(maior["lat"]), "rota": maior["rota"]},
        "queda": {"nome": queda["nome"], "nota_0": float(queda["nota_0"]), "nota": float(queda["nota"]), "mun": queda["NM_MUN"], "uf": queda["SIGLA_UF"],
                  "lon": float(queda["lon"]), "lat": float(queda["lat"]), "rota": queda["rota"], "eleg_0": float(queda["eleg_0"]), "eleg": float(queda["eleg"])},
        "tamanhos": tam,
    })
    print(tam)
    print(pd.DataFrame(rotas).to_string())
    print(cls.to_dict(), "n", len(r), "subiu", (r["delta_nota"] > 0).sum(), "mediana", r["delta_nota"].median())
    print(anos.to_string())
    print("maior", maior[["nome", "nota_0", "nota", "NM_MUN", "SIGLA_UF", "rota"]].to_dict())
    print("queda", queda[["nome", "nota_0", "nota", "eleg_0", "eleg", "NM_MUN", "SIGLA_UF", "rota"]].to_dict())
    print(g.sort_values("usinas", ascending=False).round(2).to_string())


if __name__ == "__main__":
    temas = {"nota": nota, "elegivel": elegivel, "renovacao": renovacao}
    ap = argparse.ArgumentParser()
    ap.add_argument("tema", choices=list(temas))
    temas[ap.parse_args().tema]()
