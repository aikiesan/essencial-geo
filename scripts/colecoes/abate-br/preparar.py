"""
Coleção «Onde o bicho vira resíduo» (Brasil) — prepara os dados de uma prancha (uso interno).

    .venv-geo/Scripts/python scripts/colecoes/abate-br/preparar.py sif|rebanho|ciclo

Saídas: mapas/<pasta>/dados/<base>.gpkg.zip (com estilos do QGIS), <base>.csv
e scripts/colecoes/cache/abate-br-<tema>.json (para a prancha e a ficha).
Fontes: SIGSIF do MAPA, dados abertos (dados-brutos/mapa-sif/), Pesquisa Trimestral do Abate de Animais
(SIDRA 1092, 1093, 1094) e Pesquisa da Pecuária Municipal (SIDRA 3939), do IBGE (dados-brutos/ibge/abate/).
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

SERIE = {s["tema"]: s for s in json.loads((Path(__file__).parent / "serie.json").read_text(encoding="utf-8"))}
MALHA_BR = RAIZ / "scripts" / "estados" / "cache" / "brasil_0_004.gpkg"
SIF = RAIZ / "dados-brutos" / "mapa-sif"
ABATE = RAIZ / "dados-brutos" / "ibge" / "abate"
REGIOES = {"1": "Norte", "2": "Nordeste", "3": "Sudeste", "4": "Sul", "5": "Centro-Oeste"}
UF_COD = {"11": "RO", "12": "AC", "13": "AM", "14": "RR", "15": "PA", "16": "AP", "17": "TO", "21": "MA", "22": "PI", "23": "CE",
          "24": "RN", "25": "PB", "26": "PE", "27": "AL", "28": "SE", "29": "BA", "31": "MG", "32": "ES", "33": "RJ", "35": "SP",
          "41": "PR", "42": "SC", "43": "RS", "50": "MS", "51": "MT", "52": "GO", "53": "DF"}
ANO = "2025"  # último ano completo do abate (IBGE) e da PPM


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


def chave(uf: str, nome: str) -> str:
    s = unicodedata.normalize("NFD", str(nome)).encode("ascii", "ignore").decode().upper()
    s = re.sub(r"[^A-Z0-9 ]", " ", s.replace("'", "").replace("-", " "))
    return f"{uf}|{re.sub(r'\s+', ' ', s).strip()}"


def municipios() -> gpd.GeoDataFrame:
    m = gpd.read_file(MALHA_BR, engine="pyogrio").set_crs(GEO, allow_override=True)
    m = m[m["CD_MUN"].str.match(r"^\d{7}$") & m["CD_RGINT"].notna()][["CD_MUN", "NM_MUN", "SIGLA_UF", "geometry"]]
    m["regiao"] = m["CD_MUN"].str[0].map(REGIOES)
    pos = m.geometry.to_crs(AREA_BR).representative_point().to_crs(GEO)
    m["lon"], m["lat"] = pos.x.round(4), pos.y.round(4)
    return m.reset_index(drop=True)


def ufs_brasil(m: gpd.GeoDataFrame):
    ufs = m.dissolve(by=["SIGLA_UF", "regiao"], as_index=False)[["SIGLA_UF", "regiao", "geometry"]]
    lim = m.assign(pais="Brasil").dissolve(by="pais", as_index=False)[["pais", "geometry"]]
    return ufs, lim


def csv_extra(tema: str, nome: str, d: pd.DataFrame) -> None:
    """Tabela complementar da prancha, ao lado do CSV principal."""
    arq = RAIZ / "mapas" / SERIE[tema]["pasta"] / "dados" / f"{SERIE[tema]['base']}_{nome}.csv"
    d.to_csv(arq, index=False, encoding="utf-8")


def sidra_json(nome: str) -> pd.DataFrame:
    """Tabela da API do SIDRA (primeira linha = cabeçalho). «X» (inibido), «-» (zero) e «...» ficam como texto em V."""
    d = pd.DataFrame(json.loads((ABATE / nome).read_text(encoding="utf-8"))[1:])
    d["v"] = pd.to_numeric(d["V"].replace({"-": "0"}), errors="coerce")
    return d


# ------------------------------------------------------------------ 1 os abatedouros do SIF
# Grupo de cada estabelecimento (um por número de SIF), em ordem de prioridade.
GRUPOS = [
    ("bovinos", "abatedouro de bovinos", "cattle slaughterhouse", "#8c3f2b"),
    ("aves", "abatedouro de aves", "poultry slaughterhouse", "#c99a2e"),
    ("suinos", "abatedouro de suínos", "pig slaughterhouse", "#c46f86"),
    ("mista", "abatedouro de mais de uma espécie", "multi-species slaughterhouse", "#4f3a5c"),
    ("outra", "abatedouro de outras espécies ou sem a espécie no cadastro", "other or unlisted species", "#7a8189"),
    ("graxaria", "fábrica de produtos não comestíveis", "inedible by-products plant", "#1a1c1e"),
    ("carne", "carne processada, entreposto ou câmara fria", "meat processing, depot or cold store", "#b9a59a"),
    ("leite", "leite e derivados", "milk and dairy", "#9fb3c1"),
    ("ovos", "ovos e granjas avícolas", "eggs and poultry farms", "#d9c78f"),
    ("pescado", "pescado", "fish and seafood", "#7fa39a"),
    ("mel", "mel e produtos das abelhas", "honey and bee products", "#e0b25c"),
]
ESPECIE = {"AB": "bovinos", "AA": "aves", "AS": "suinos"}
CORRECOES_MUN = {  # grafias do SIGSIF que não casam com a malha do IBGE
    "MT|MIRASSOL D OESTE": "MT|MIRASSOL DOESTE", "PA|SANTA ISABEL DO PARA": "PA|SANTA IZABEL DO PARA",
    "SP|EMBU": "SP|EMBU DAS ARTES", "RJ|PARATI": "RJ|PARATY", "MT|SANTO ANTONIO DO LEVERGER": "MT|SANTO ANTONIO DE LEVERGER",
    "MG|ITABIRINHA DE MANTENA": "MG|ITABIRINHA", "PA|ELDORADO DOS CARAJAS": "PA|ELDORADO DO CARAJAS",
}


def estabelecimentos(m: gpd.GeoDataFrame) -> pd.DataFrame:
    e = pd.read_csv(SIF / "sigsifestabelecimentosregistradosnosif.csv", sep=";", dtype=str, encoding="utf-8")
    assert (e["SITUACAO"] == "A").all()
    e["categoria"] = e["CATEGORIA_CLASSE"].str.split(" / ").str[0].fillna("")
    e["classe"] = e["CATEGORIA_CLASSE"].str.split(" / ").str[1].str.split(" - ").str[0].str.strip().fillna("")
    e["abate"] = e["categoria"].str.startswith("ABATEDOURO FRIGORÍFICO - C15")

    def resumo(g: pd.DataFrame) -> pd.Series:
        areas = set(g["AREA_CATEGORIA"].dropna())
        cats = set(g["categoria"])
        esp = sorted({c[:2] for c in g.loc[g["abate"], "classe"] if c and c != "MSD"})
        if g["abate"].any():
            principais = [ESPECIE[c] for c in esp if c in ESPECIE]
            outras = [c for c in esp if c not in ESPECIE]
            if len(esp) == 0 or (not principais):
                grupo = "outra"
            elif len(principais) == 1 and not outras:
                grupo = principais[0]
            elif len(principais) == 1 and outras:
                grupo = principais[0] if len(esp) == 1 else "mista"
            else:
                grupo = "mista"
        elif any(c.startswith("UNIDADE DE BENEF. DE PROD. NÃO COMESTÍVEIS") for c in cats) or "NÃO COMESTÍVEL" in areas:
            grupo = "graxaria"
        elif areas & {"CARNE", "ESTOCAGEM"}:
            grupo = "carne"
        elif "LEITE" in areas:
            grupo = "leite"
        elif "OVOS" in areas:
            grupo = "ovos"
        elif "PESCADO" in areas:
            grupo = "pescado"
        elif "MEL" in areas:
            grupo = "mel"
        else:
            raise ValueError(areas)
        cnpj = re.sub(r"\D", "", str(g["CPF_CNPJ"].iloc[0]))
        return pd.Series({
            "razao_social": g["RAZAO_SOCIAL"].iloc[0] if len(cnpj) == 14 else "",  # pessoa física: sem nome
            "municipio_sif": g["MUNICIPIO"].iloc[0], "SIGLA_UF": g["UF"].iloc[0], "grupo": grupo,
            "especies_abate": " ".join(esp), "areas": " ".join(sorted(areas)),
            "registro": str(g["DT_REGISTRO"].iloc[0])[:10],
        })

    s = e.groupby("NR_SIF", sort=False).apply(resumo, include_groups=False).reset_index()
    s["NR_SIF"] = s["NR_SIF"].astype(int)
    cd = dict(zip([chave(u, n) for u, n in zip(m["SIGLA_UF"], m["NM_MUN"])], m["CD_MUN"]))
    k = s.apply(lambda r: CORRECOES_MUN.get(chave(r.SIGLA_UF, r.municipio_sif), chave(r.SIGLA_UF, r.municipio_sif)), axis=1)
    s["CD_MUN"] = k.map(cd)
    falta = s[s["CD_MUN"].isna()]
    assert falta.empty, falta[["NR_SIF", "municipio_sif", "SIGLA_UF"]].to_string()
    return s


def sif() -> None:
    m = municipios()
    s = estabelecimentos(m)
    s = s[s["CD_MUN"].notna()].copy()
    s = s.merge(m[["CD_MUN", "NM_MUN", "regiao", "lon", "lat"]], on="CD_MUN", how="left")
    ordem = {g: i for i, (g, *_) in enumerate(GRUPOS)}
    s["ordem"] = s["grupo"].map(ordem)
    s = s.sort_values(["ordem", "SIGLA_UF", "NM_MUN", "NR_SIF"]).reset_index(drop=True)
    abate = s["ordem"] <= 4

    # Abates sob SIF em 2025, por UF de procedência e espécie (relatório do SIGSIF).
    r = pd.read_csv(SIF / "sigsifrelatorioabatesporanouf.csv", sep=";", dtype=str)
    r["q"] = pd.to_numeric(r["QTD"])
    r25 = r[r["MES_ANO"].str[3:] == ANO]
    abatidos = {"bovinos": float(r25.loc[r25["CATEGORIA"] == "Bovino", "q"].sum()),
                "suinos": float(r25.loc[r25["CATEGORIA"] == "Suíno", "q"].sum()),
                "frangos": float(r25.loc[r25["CATEGORIA"] == "Frango", "q"].sum())}

    sel = r25[r25["CATEGORIA"].isin(["Bovino", "Suíno", "Frango"])]
    tab = sel.pivot_table(index="UF_PROCEDENCIA", columns="CATEGORIA", values="q", aggfunc="sum", fill_value=0)
    tab = tab.rename(columns={"Bovino": "bovinos", "Suíno": "suinos", "Frango": "frangos"}).reset_index()
    tab = tab.rename(columns={"UF_PROCEDENCIA": "uf_procedencia"})[["uf_procedencia", "bovinos", "suinos", "frangos"]]

    ufs, lim = ufs_brasil(m)
    cont = s.pivot_table(index="SIGLA_UF", columns="grupo", values="NR_SIF", aggfunc="size", fill_value=0)
    cont = cont.reindex(columns=[g for g, *_ in GRUPOS], fill_value=0)
    for g, *_ in GRUPOS:
        ufs[g] = ufs["SIGLA_UF"].map(cont[g]).fillna(0).astype(int)
    ufs["abatedouros"] = ufs[[g for g, *_ in GRUPOS[:5]]].sum(axis=1)
    ufs["estabelecimentos"] = ufs[[g for g, *_ in GRUPOS]].sum(axis=1)

    pts = gpd.GeoDataFrame(s, geometry=gpd.points_from_xy(s["lon"], s["lat"]), crs=GEO)
    cols = ["NR_SIF", "razao_social", "CD_MUN", "NM_MUN", "SIGLA_UF", "regiao", "grupo", "especies_abate", "areas", "registro", "lon", "lat"]
    pts = pts[cols + ["geometry"]]
    regras = [(igual("grupo", g), r, marcador(cor, 3.0 if i <= 4 else 1.4, vazado=(g == "graxaria")))
              for i, (g, r, _, cor) in enumerate(GRUPOS)]
    estilos = {
        "estabelecimentos": [("grupo", "Estabelecimentos sob inspeção federal (SIF), por tipo", estilo_regras("ponto", regras), True)],
        "ufs": [("ufs", "Limites estaduais", estilo_contorno("#5c6166", 0.3, "SIGLA_UF"), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    ucols = ["SIGLA_UF", "regiao", "abatedouros", "estabelecimentos"] + [g for g, *_ in GRUPOS]
    tam = gravar("sif", {"estabelecimentos": pts, "ufs": ufs[ucols + ["geometry"]], "limite_nacional": lim}, estilos,
                 pts.drop(columns="geometry"))
    csv_extra("sif", f"abatidos_{ANO}", tab.sort_values("bovinos", ascending=False))

    ab = s[abate]
    por_mun = ab.groupby(["CD_MUN", "NM_MUN", "SIGLA_UF"]).size().sort_values(ascending=False)
    sul = ab["SIGLA_UF"].isin(["PR", "SC", "RS"])
    tot = s["grupo"].value_counts()
    gravar_cache("abate-br-sif", {
        "grupos": [{"chave": g, "rotulo": r, "rotulo_en": en, "cor": cor, "n": int(tot.get(g, 0))} for g, r, en, cor in GRUPOS],
        # [grupo, lon, lat, CD_MUN]
        "pontos": [[r.grupo, float(r.lon), float(r.lat), r.CD_MUN] for r in s.itertuples()],
        "total": int(len(s)), "abatedouros": int(abate.sum()),
        "ufs": [{"uf": u, **{g: int(cont.at[u, g]) for g, *_ in GRUPOS}} for u in cont.index],
        "sul_aves": int((sul & (ab["grupo"] == "aves")).sum()), "aves": int((ab["grupo"] == "aves").sum()),
        "sul_suinos": int((sul & (ab["grupo"] == "suinos")).sum()), "suinos": int((ab["grupo"] == "suinos").sum()),
        "bovinos": int((ab["grupo"] == "bovinos").sum()),
        "bov_uf": ab[ab["grupo"] == "bovinos"]["SIGLA_UF"].value_counts().to_dict(),
        "aves_uf": ab[ab["grupo"] == "aves"]["SIGLA_UF"].value_counts().to_dict(),
        "mun_top": [{"cd": k[0], "nome": k[1], "uf": k[2], "n": int(v)} for k, v in por_mun.head(8).items()],
        "municipios_abate": int(ab["CD_MUN"].nunique()),
        "abatidos_2025": abatidos,
        "tamanhos": tam,
    })
    print(tam)
    print(s["grupo"].value_counts().to_string())
    print(cont.assign(ab=cont[[g for g, *_ in GRUPOS[:5]]].sum(axis=1)).sort_values("ab", ascending=False).to_string())
    print(por_mun.head(12).to_string())
    print(abatidos)


# ------------------------------------------------------------------ comum às pranchas 2 e 3: o abate do IBGE
TABELAS = {"bovinos": 1092, "suinos": 1093, "frangos": 1094}


def abate_uf(especie: str, ano: str = ANO) -> pd.Series:
    """Cabeças abatidas no ano, por UF, todas as inspeções (IBGE). UF com algum trimestre inibido («X») ou sem
    dado («...») fica NaN; «-» é zero."""
    d = sidra_json(f"t{TABELAS[especie]}_uf_2015-2026.json")
    insp = "D6N" if especie == "bovinos" else "D5N"
    x = d[(d["D2C"] == "284") & (d["D4N"] == "Total do trimestre") & (d["D3C"].str[:4] == ano) & (d[insp] == "Total")]
    assert x.groupby("D1C").size().eq(4).all()
    s = x.groupby(x["D1C"].map(UF_COD))["v"].sum(min_count=4)
    return s.reindex(sorted(UF_COD.values()))


def abate_br_anual(especie: str) -> pd.Series:
    """Cabeças abatidas por ano no Brasil, todas as inspeções (anos com os quatro trimestres)."""
    d = sidra_json(f"t{TABELAS[especie]}_br_1997-2026.json")
    x = d[d["D4N"] == "Total do trimestre"]
    g = x.groupby(x["D3C"].str[:4])["v"]
    return g.sum()[g.size() == 4]


def ppm_uf(ano: str = ANO) -> pd.DataFrame:
    p = sidra_json("t3939_uf_2015-2025.json")
    p = p[p["D3N"] == ano]
    t = p.pivot_table(index=p["D1C"].map(UF_COD), columns="D4N", values="v", aggfunc="sum")
    return pd.DataFrame({"bovinos": t["Bovino"], "suinos": t["Suíno - total"],
                         "frangos": t["Galináceos - total"] - t["Galináceos - galinhas"]})


# ------------------------------------------------------------------ 2 criado aqui, abatido lá
LIMITES_IDX = [0.25, 0.67, 1.5, 3.0]
CORES_IDX = ["#4f6a3a", "#a3b585", "#eeefe9", "#d9a38a", "#8c3f2b"]
ROTULOS_IDX = [("menos de 0,25", "under 0.25"), ("0,25 a 0,67", "0.25 to 0.67"), ("0,67 a 1,5", "0.67 to 1.5"),
               ("1,5 a 3", "1.5 to 3"), ("3 ou mais", "3 or more")]
ESPECIES = [("bovinos", "bovinos", "cattle"), ("suinos", "suínos", "pigs"), ("frangos", "frangos", "chickens")]


def rebanho() -> None:
    m = municipios()
    ufs, lim = ufs_brasil(m)
    reb = ppm_uf()
    out = {}
    for e, *_ in ESPECIES:
        ab = abate_uf(e)
        br_ab = float(abate_br_anual(e)[ANO])
        br_reb = float(reb[e].sum())
        taxa = br_ab / br_reb
        idx = (ab / reb[e]) / taxa
        cls = pd.Series(np.digitize(idx.fillna(0), LIMITES_IDX), index=idx.index).where(idx.notna(), -1)
        cls[(reb[e] == 0)] = -1
        ufs[f"{e}_abate"] = ufs["SIGLA_UF"].map(ab)
        ufs[f"{e}_rebanho"] = ufs["SIGLA_UF"].map(reb[e])
        ufs[f"{e}_indice"] = ufs["SIGLA_UF"].map(idx).round(2)
        ufs[f"{e}_classe"] = ufs["SIGLA_UF"].map(cls).astype(int)
        # Parte do abate do país feita em cada UF, contra a parte do rebanho.
        out[e] = {"br_abate": br_ab, "br_rebanho": br_reb, "taxa": taxa,
                  "soma_ufs_abate": float(ab.sum()), "inibidas": sorted(ab.index[ab.isna()].tolist()),
                  "ufs": [{"uf": u, "abate": None if pd.isna(ab[u]) else float(ab[u]), "rebanho": float(reb.at[u, e]),
                           "indice": None if pd.isna(idx[u]) else round(float(idx[u]), 3), "classe": int(cls[u])}
                          for u in reb.index]}
        print(e, "BR abate", br_ab, "rebanho", br_reb, "taxa", round(taxa, 3), "soma UFs", ab.sum())
        print(pd.DataFrame({"abate": ab, "reb": reb[e], "idx": idx.round(2), "cls": cls}).sort_values("abate", ascending=False).head(14).to_string())

    # Conferência pela outra ponta: bovinos e suínos abatidos sob SIF em 2025 pela UF de procedência (MAPA)
    # contra os abatidos sob SIF em estabelecimentos da UF (IBGE, inspeção federal).
    r = pd.read_csv(SIF / "sigsifrelatorioabatesporanouf.csv", sep=";", dtype=str)
    r["q"] = pd.to_numeric(r["QTD"])
    r25 = r[r["MES_ANO"].str[3:] == ANO]
    conf = {}
    for e, cat in (("bovinos", "Bovino"), ("suinos", "Suíno")):
        d = sidra_json(f"t{TABELAS[e]}_uf_2015-2026.json")
        insp = "D6N" if e == "bovinos" else "D5N"
        x = d[(d["D2C"] == "284") & (d["D4N"] == "Total do trimestre") & (d["D3C"].str[:4] == ANO) & (d[insp] == "Federal")]
        fed = x.groupby(x["D1C"].map(UF_COD))["v"].sum(min_count=4)
        proc = r25[r25["CATEGORIA"] == cat].groupby("UF_PROCEDENCIA")["q"].sum()
        c = pd.DataFrame({"abatido_na_uf": fed, "vindo_da_uf": proc}).dropna()
        c = c[c["abatido_na_uf"] > 0]
        c["saldo"] = c["abatido_na_uf"] - c["vindo_da_uf"]
        c = c.sort_values("saldo")
        conf[e] = [{"uf": u, "abatido": float(v.abatido_na_uf), "vindo": float(v.vindo_da_uf), "saldo": float(v.saldo)} for u, v in c.iterrows()]
        print(e, "SIF"); print(c.round(0).to_string())
        for k in ("abatido_na_uf", "vindo_da_uf", "saldo"):
            ufs[f"{e}_sif_{k}"] = ufs["SIGLA_UF"].map(c[k])

    def regras(campo):
        r_ = [(igual(campo, i), ROTULOS_IDX[i][0], preenchimento(cor, "#ffffff", 0.2)) for i, cor in enumerate(CORES_IDX)]
        r_.append((igual(campo, -1), "dado inibido pelo IBGE", preenchimento("#ffffff", "#c9ced3", 0.2)))
        return r_

    estilos = {
        "ufs": [(e, f"Índice abate ÷ rebanho de {rot} (Brasil = 1), {ANO}", estilo_regras("poligono", regras(f"{e}_classe"), rotulo_campo="SIGLA_UF"), i == 0)
                for i, (e, rot, _) in enumerate(ESPECIES)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    cols = ["SIGLA_UF", "regiao"] + [f"{e}_{k}" for e, *_ in ESPECIES for k in ("abate", "rebanho", "indice", "classe")] + \
           [f"{e}_sif_{k}" for e in ("bovinos", "suinos") for k in ("abatido_na_uf", "vindo_da_uf", "saldo")]
    csv_extra("rebanho", "brasil", pd.DataFrame([{"especie": e, "abatidos_br": out[e]["br_abate"], "rebanho_br": out[e]["br_rebanho"],
                                                   "abatidos_por_cabeca": round(out[e]["taxa"], 4)} for e, *_ in ESPECIES]))
    tam = gravar("rebanho", {"ufs": ufs[cols + ["geometry"]], "limite_nacional": lim}, estilos, ufs[cols].sort_values("SIGLA_UF"))
    gravar_cache("abate-br-rebanho", {
        "ano": ANO, "classes": [{"rotulo": r_, "rotulo_en": en, "cor": c} for (r_, en), c in zip(ROTULOS_IDX, CORES_IDX)],
        "especies": [{"chave": e, "rotulo": r_, "rotulo_en": en, **out[e]} for e, r_, en in ESPECIES],
        "sif": conf, "tamanhos": tam,
    })
    print(tam)


# ------------------------------------------------------------------ 3 o ano das vacas
LIMITES_FEM = [35, 42, 48, 55]
CORES_FEM = ["#f1e6dc", "#dfbfa6", "#c4896a", "#9c5338", "#5f2a1a"]
ROTULOS_FEM = [("menos de 35 %", "under 35%"), ("35 a 42 %", "35 to 42%"), ("42 a 48 %", "42 to 48%"), ("48 a 55 %", "48 to 55%"),
               ("55 % ou mais", "55% or more")]


def femeas(d: pd.DataFrame, por: list[str]) -> pd.DataFrame:
    x = d[d["D4N"] == "Total do trimestre"].copy()
    x["ano"] = x["D3C"].str[:4]
    p = x.pivot_table(index=por + ["ano"], columns="D5N", values="v", aggfunc="sum", min_count=4)
    n = x.groupby(por + ["ano", "D5N"]).size().unstack()
    p = p.where(n.eq(4))
    p["femeas"] = p["Vacas"] + p["Novilhas"]
    p["pct"] = p["femeas"] / p["Total"] * 100
    return p


def ciclo() -> None:
    m = municipios()
    ufs, lim = ufs_brasil(m)
    d = sidra_json("t1092_uf_rebanho_2015-2026.json")
    d["uf"] = d["D1C"].map(UF_COD)
    p = femeas(d, ["uf"])
    pct = p["pct"].unstack()
    tot = p["Total"].unstack()
    tot_any = abate_uf("bovinos")  # total do ano (mesmo quando uma categoria está inibida)
    b = sidra_json("t1092_br_rebanho_1997-2026.json")
    pb = femeas(b, [])
    pb.index = pb.index.astype(str)
    # 1º semestre de 2026 (dois trimestres publicados).
    x = b[(b["D4N"] == "Total do trimestre") & (b["D3C"].str[:4] == "2026")]
    s26 = x.groupby("D5N")["v"].sum()
    assert x["D3C"].nunique() == 2
    h1 = {"total": float(s26["Total"]), "pct": float((s26["Vacas"] + s26["Novilhas"]) / s26["Total"] * 100)}
    # Mesmo semestre de 2025, para comparar.
    y = b[(b["D4N"] == "Total do trimestre") & (b["D3C"].isin(["202501", "202502"]))].groupby("D5N")["v"].sum()
    h1_25 = {"total": float(y["Total"]), "pct": float((y["Vacas"] + y["Novilhas"]) / y["Total"] * 100)}

    reb = sidra_json("t3939_uf_2015-2025.json")
    reb_br = reb[reb["D4N"] == "Bovino"].groupby("D3N")["v"].sum()
    especies = {e: abate_br_anual(e) for e in TABELAS}

    ufs["femeas_pct_2025"] = ufs["SIGLA_UF"].map(pct[ANO]).round(1)
    ufs["femeas_pct_2021"] = ufs["SIGLA_UF"].map(pct["2021"]).round(1)
    ufs["bovinos_abatidos_2025"] = ufs["SIGLA_UF"].map(tot_any)
    ufs["bovinos_abatidos_2021"] = ufs["SIGLA_UF"].map(abate_uf("bovinos", "2021"))
    ufs["femeas_2025"] = ufs["SIGLA_UF"].map(p["femeas"].unstack()[ANO])
    v = ufs["femeas_pct_2025"]
    ufs["classe"] = np.where(v.notna(), np.digitize(v.fillna(0), LIMITES_FEM), -1).astype(int)
    pos = ufs.geometry.to_crs(AREA_BR).representative_point().to_crs(GEO)
    pts = gpd.GeoDataFrame(ufs[["SIGLA_UF", "bovinos_abatidos_2025"]].copy(), geometry=pos.values, crs=GEO)
    pts = pts[pts["bovinos_abatidos_2025"].notna()]

    regras = [(igual("classe", i), ROTULOS_FEM[i][0], preenchimento(c, "#ffffff", 0.2)) for i, c in enumerate(CORES_FEM)]
    regras.append((igual("classe", -1), "dado inibido pelo IBGE", preenchimento("#ffffff", "#c9ced3", 0.2)))
    estilos = {
        "ufs": [("femeas", f"Vacas e novilhas, % dos bovinos abatidos, {ANO}", estilo_regras("poligono", regras, rotulo_campo="SIGLA_UF"), True)],
        "abate_bovinos": [("abate", f"Bovinos abatidos, {ANO} (cabeças)", estilo_regras("ponto", [
            ("TRUE", "cabeças abatidas", marcador("#1a1c1e", 2, vazado=True, tamanho_expr='1 + 0.004 * sqrt("bovinos_abatidos_2025")'))]), True)],
        "limite_nacional": [("limite", "Limite do país", estilo_contorno(TINTA, 0.6), True)],
    }
    cols = ["SIGLA_UF", "regiao", "bovinos_abatidos_2021", "bovinos_abatidos_2025", "femeas_2025", "femeas_pct_2021", "femeas_pct_2025", "classe"]
    tam = gravar("ciclo", {"ufs": ufs[cols + ["geometry"]], "abate_bovinos": pts, "limite_nacional": lim}, estilos,
                 ufs[cols].sort_values("bovinos_abatidos_2025", ascending=False))

    anos = [a for a in pb.index if a <= ANO]
    serie_br = pd.DataFrame({"ano": anos, "bovinos_abatidos": [pb.at[a, "Total"] for a in anos],
                             "femeas_abatidas": [pb.at[a, "femeas"] for a in anos],
                             "femeas_pct": [round(float(pb.at[a, "pct"]), 2) for a in anos]})
    serie_br.loc[len(serie_br)] = ["2025-S1", h1_25["total"], None, round(h1_25["pct"], 2)]
    serie_br.loc[len(serie_br)] = ["2026-S1", h1["total"], None, round(h1["pct"], 2)]
    serie_br["suinos_abatidos"] = serie_br["ano"].map(especies["suinos"])
    serie_br["frangos_abatidos"] = serie_br["ano"].map(especies["frangos"])
    serie_br["rebanho_bovino_ppm"] = serie_br["ano"].map(reb_br)
    csv_extra("ciclo", "brasil", serie_br)
    gravar_cache("abate-br-ciclo", {
        "ano": ANO,
        "classes": [{"rotulo": r_, "rotulo_en": en, "cor": c} for (r_, en), c in zip(ROTULOS_FEM, CORES_FEM)],
        "ufs": {r.SIGLA_UF: {"classe": int(r.classe), "pct": None if pd.isna(r.femeas_pct_2025) else float(r.femeas_pct_2025),
                             "pct21": None if pd.isna(r.femeas_pct_2021) else float(r.femeas_pct_2021),
                             "total": None if pd.isna(r.bovinos_abatidos_2025) else float(r.bovinos_abatidos_2025),
                             "total21": None if pd.isna(r.bovinos_abatidos_2021) else float(r.bovinos_abatidos_2021)} for r in ufs.itertuples()},
        "pontos": [[r.SIGLA_UF, float(g.x), float(g.y), float(r.bovinos_abatidos_2025)] for r, g in zip(pts.itertuples(), pts.geometry)],
        "brasil": [{"ano": a, "total": float(pb.at[a, "Total"]), "femeas": float(pb.at[a, "femeas"]), "pct": round(float(pb.at[a, "pct"]), 2)} for a in anos],
        "h1_2026": h1, "h1_2025": h1_25,
        "rebanho": {k: float(v_) for k, v_ in reb_br.items()},
        "especies": {e: {k: float(v_) for k, v_ in s.items() if k >= "2015"} for e, s in especies.items()},
        "tamanhos": tam,
    })
    print(tam)
    print(pb[["Total", "femeas", "pct"]].round(1).tail(12).to_string())
    print("H1 2026", h1, "H1 2025", h1_25)
    print(reb_br.to_string())
    print(ufs[cols].sort_values("bovinos_abatidos_2025", ascending=False).to_string())
    print({e: s.tail(6).to_dict() for e, s in especies.items()})


if __name__ == "__main__":
    temas = {"sif": sif, "rebanho": rebanho, "ciclo": ciclo}
    ap = argparse.ArgumentParser()
    ap.add_argument("tema", choices=list(temas))
    temas[ap.parse_args().tema]()
