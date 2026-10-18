"""
Coleção «Bioenergia em SP» — prepara os dados de uma prancha (uso interno).

    .venv-geo/Scripts/python scripts/colecoes/bioenergia-sp/preparar.py rebanhos
    .venv-geo/Scripts/python scripts/colecoes/bioenergia-sp/preparar.py cana

Saídas: mapas/<pasta>/dados/<base>.gpkg.zip (com estilos do QGIS), <base>.csv
e scripts/colecoes/cache/bioenergia-sp-<tema>.json (para a prancha e a ficha).
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import geopandas as gpd
import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from comum import (  # noqa: E402
    DADOS, MINERAIS, PLASMA, RAIZ, VIRIDIS, TINTA, classe, estilo_contorno, estilo_graduado, estilo_regras, gravar_cache,
    igual, infra, marcador, siga,
    gravar_estilos, malha_uf, quebras, sidra, valor_sidra, zipar,
)

PASTAS = {
    "biogas": "028-usinas-de-biogas-sp",
    "rebanhos": "029-rebanhos-sp",
    "cana": "030-cana-de-acucar-sp",
    "usinas": "031-usinas-e-cana-sp",
}
ANO = 2024


def base_territorial(mun: gpd.GeoDataFrame):
    rgint = mun.dissolve(by=["CD_RGINT", "NM_RGINT"], as_index=False)[["CD_RGINT", "NM_RGINT", "geometry"]]
    limite = mun.assign(SIGLA_UF="SP").dissolve(by="SIGLA_UF", as_index=False)[["SIGLA_UF", "geometry"]]
    return rgint, limite


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


def topo(df: pd.DataFrame, campo: str, n: int = 5) -> list[dict]:
    t = df[df[campo].notna()].sort_values(campo, ascending=False).head(n)
    return [{"cd": r.CD_MUN, "nome": r.NM_MUN, "valor": float(getattr(r, campo))} for r in t.itertuples()]


# ------------------------------------------------------------------ rebanhos (PPM)
REBANHOS = [
    ("bovino", "Bovino", "bovinos", "cattle"),
    ("suino", "Suíno - total", "suínos", "pigs"),
    ("galinaceos", "Galináceos - total", "galináceos", "poultry"),
]


def rebanhos() -> None:
    mun = malha_uf("SP")
    tab, variavel = sidra(DADOS / "raw" / "ibge_ppm" / "TABELA_3939_PPM_2008A2024.xlsx")
    tab = tab[tab.index.str.startswith("35")][ANO]
    df = mun.drop(columns="geometry").copy()
    estilos_mun, quebras_ = [], {}
    for campo, coluna, _, _ in REBANHOS:
        vals = [valor_sidra(tab.at[c, coluna]) if c in tab.index else (None, "fora_da_tabela") for c in df["CD_MUN"]]
        df[campo] = [v for v, _ in vals]
        df[f"sit_{campo}"] = [s for _, s in vals]
        df[f"dens_{campo}"] = (df[campo] / df["area_km2"]).round(2)
    for campo, _, pt, en in REBANHOS:
        lim = quebras(df[f"dens_{campo}"])
        quebras_[campo] = lim
        df[f"cl_{campo}"] = [classe(v, lim) for v in df[f"dens_{campo}"]]
        cores = PLASMA[: len(lim)]
        estilos_mun.append((
            f"densidade_{campo}", f"Densidade de {pt} (cabeças/km²), PPM {ANO}",
            estilo_graduado(f"dens_{campo}", lim, cores, casas=2 if lim[0] < 1 else 1 if lim[0] < 10 else 0, rotulo_campo="NM_MUN"), campo == "bovino",
        ))
    rgint, limite = base_territorial(mun)
    cols = ["CD_MUN", "NM_MUN", "CD_RGINT", "NM_RGINT", "area_km2"] + [
        c for campo, *_ in REBANHOS for c in (campo, f"dens_{campo}")
    ]
    camada = gpd.GeoDataFrame(df[cols], geometry=mun.geometry.values, crs=mun.crs)
    arquivos = gravar(
        "rebanhos", f"sp_rebanhos_{ANO}",
        {"municipios": camada, "regioes_intermediarias": rgint, "limite_estadual": limite},
        {
            "municipios": estilos_mun,
            "regioes_intermediarias": [("contorno", "Limites e nomes das regiões intermediárias",
                                        estilo_contorno("#1a211a", 0.45, "NM_RGINT"), True)],
            "limite_estadual": [("contorno", "Limite estadual", estilo_contorno(TINTA, 0.8), True)],
        },
        df[cols].sort_values("NM_MUN"),
    )
    sem_info = df[df["bovino"].isna()]
    gravar_cache("bioenergia-sp-rebanhos", {
        "ano": ANO, "variavel": variavel, "preliminar": True,
        "municipios": len(df),
        "sem_informacao": [{"cd": r.CD_MUN, "nome": r.NM_MUN} for r in sem_info.itertuples()],
        "rebanhos": {
            campo: {
                "rotulo": pt, "rotulo_en": en,
                "total": float(df[campo].sum()),
                "municipios_com": int((df[campo] > 0).sum()),
                "quebras": quebras_[campo],
                "maiores": topo(df, campo),
                "mais_densos": topo(df, f"dens_{campo}"),
            } for campo, _, pt, en in REBANHOS
        },
        "valores": {r.CD_MUN: {c: getattr(r, f"cl_{c}") for c, *_ in REBANHOS} for r in df.itertuples()},
        "arquivos": arquivos,
    })
    print(f"rebanhos: {len(df)} municípios, {len(sem_info)} sem informação · {arquivos}")


# ------------------------------------------------------------------ cana (PAM)
def cana() -> None:
    mun = malha_uf("SP")
    arq = DADOS / "raw" / "pam" / "TABELA_1612_2024_A_2021.xlsx"
    colhida, v_area = sidra(arq, 1)
    prod, v_prod = sidra(arq, 2)
    colhida = colhida[colhida.index.str.startswith("35")][ANO]
    prod = prod[prod.index.str.startswith("35")][ANO]
    df = mun.drop(columns="geometry").copy()
    for campo, tab in (("area_colhida_ha", colhida), ("producao_t", prod)):
        vals = [valor_sidra(tab.at[c, "Cana-de-açúcar"]) if c in tab.index else (None, "fora_da_tabela") for c in df["CD_MUN"]]
        df[campo] = [v for v, _ in vals]
        df[f"sit_{campo}"] = [s for _, s in vals]
    # Parte do território municipal colhida com cana (1 km² = 100 ha).
    df["pct_area"] = (df["area_colhida_ha"] / (df["area_km2"] * 100) * 100).round(2)
    df["rendimento_t_ha"] = (df["producao_t"] / df["area_colhida_ha"]).where(df["area_colhida_ha"] > 0).round(1)
    lim = quebras(df["pct_area"])
    lim[-1] = round(lim[-1], 2)
    df["cl"] = [classe(v, lim) for v in df["pct_area"]]
    rgint, limite = base_territorial(mun)
    cols = ["CD_MUN", "NM_MUN", "CD_RGINT", "NM_RGINT", "area_km2", "area_colhida_ha", "producao_t", "pct_area", "rendimento_t_ha"]
    camada = gpd.GeoDataFrame(df[cols], geometry=mun.geometry.values, crs=mun.crs)
    lim_prod = quebras(df["producao_t"])
    arquivos = gravar(
        "cana", f"sp_cana_{ANO}",
        {"municipios": camada, "regioes_intermediarias": rgint, "limite_estadual": limite},
        {
            "municipios": [
                ("parte_do_territorio", f"Área colhida de cana como parte do território municipal (%), PAM {ANO}",
                 estilo_graduado("pct_area", lim, VIRIDIS[: len(lim)], casas=1, rotulo_campo="NM_MUN"), True),
                ("producao", f"Produção de cana-de-açúcar (t), PAM {ANO}",
                 estilo_graduado("producao_t", lim_prod, VIRIDIS[: len(lim_prod)], rotulo_campo="NM_MUN"), False),
            ],
            "regioes_intermediarias": [("contorno", "Limites e nomes das regiões intermediárias",
                                        estilo_contorno("#1a211a", 0.45, "NM_RGINT"), True)],
            "limite_estadual": [("contorno", "Limite estadual", estilo_contorno(TINTA, 0.8), True)],
        },
        df[cols].sort_values("NM_MUN"),
    )
    com = df[df["area_colhida_ha"] > 0]
    gravar_cache("bioenergia-sp-cana", {
        "ano": ANO, "variaveis": [v_area, v_prod], "municipios": len(df),
        "area_colhida_ha": float(df["area_colhida_ha"].sum()),
        "producao_t": float(df["producao_t"].sum()),
        "area_sp_km2": float(df["area_km2"].sum()),
        "municipios_com_cana": int(len(com)),
        "municipios_zero": int((df["area_colhida_ha"] == 0).sum()),
        "sem_informacao": [{"cd": r.CD_MUN, "nome": r.NM_MUN} for r in df[df["area_colhida_ha"].isna()].itertuples()],
        "acima_de_50pct": int((df["pct_area"] > 50).sum()),
        "acima_de_50pct_cds": df.loc[df["pct_area"] > 50, "CD_MUN"].tolist(),
        "quebras": lim,
        "maiores_producao": topo(df, "producao_t"),
        "maior_parte": topo(df, "pct_area"),
        "valores": {r.CD_MUN: r.cl for r in df.itertuples()},
        "arquivos": arquivos,
    })
    print(f"cana: {len(com)} municípios com cana · {arquivos}")


# ------------------------------------------------------------------ pontos comuns
def no_municipio(pts: gpd.GeoDataFrame, mun: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Código e nome do município onde cai cada ponto (junção espacial com a malha do IBGE)."""
    j = gpd.sjoin(pts, mun[["CD_MUN", "NM_MUN", "geometry"]], how="left", predicate="within")
    return j.drop(columns="index_right")


def estilo_contorno_mun() -> str:
    return estilo_contorno("#c9ced3", 0.1)


SIGA_FONTE = "structure_biomass_thermal_power_plant"


def usinas_siga_sp(prefixo: str, mun: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    u = siga(SIGA_FONTE)
    u = u[(u["uf"] == "SP") & u["combustivel"].str.startswith(prefixo)].copy()
    u = no_municipio(u, mun)
    return u.sort_values("potencia_kw", ascending=False).reset_index(drop=True)


def resumo_siga(u: gpd.GeoDataFrame) -> list[dict]:
    return [{
        "nome": r.nome, "cd": r.CD_MUN, "municipio": r.NM_MUN, "combustivel": r.combustivel, "fase": r.fase,
        "potencia_kw": r.potencia_kw, "inicio": None if pd.isna(r.inicio_operacao) else r.inicio_operacao.strftime("%Y-%m-%d"),
        "coord": [round(r.geometry.x, 5), round(r.geometry.y, 5)],
    } for r in u.itertuples()]


# ------------------------------------------------------------------ biogás (MapBiomas/CIBiogás + SIGA)
CATEGORIAS_BIOGAS = [
    ("Agropecuária", "agropecuaria", "Agropecuária", "Farming", MINERAIS["verde_mata"]),
    ("Indústria", "industria", "Indústria", "Industry", MINERAIS["ameixa"]),
    ("RSU ou Esgoto", "rsu_esgoto", "Aterro ou esgoto", "Landfill or sewage", MINERAIS["azul_profundo"]),
]
PORTES = [("Pequeno porte", "pequeno", 2.4, 7), ("Médio porte", "medio", 3.4, 10), ("Grande porte", "grande", 4.6, 14)]


def biogas() -> None:
    mun = malha_uf("SP")
    b = infra("structure_biogas_plant")
    b = b[b["Estado"] == "SP"].copy()
    cat = {o: k for o, k, *_ in CATEGORIAS_BIOGAS}
    porte = {o: k for o, k, *_ in PORTES}
    sim = lambda s: s.eq("Sim")  # noqa: E731
    pts = gpd.GeoDataFrame({
        "categoria": b["Categoria"].map(cat),
        "uso_principal": b["Principal_"],
        "energia_eletrica": sim(b["Energia_el"]), "energia_termica": sim(b["Energia_te"]),
        "energia_mecanica": sim(b["Energia_me"]), "biometano": sim(b["GNR_Biomet"]),
        "situacao": b["Situacao"], "porte": b["Escala_pro"].map(porte),
        "inicio_operacao": pd.to_datetime(b["Inicio_ope"], errors="coerce").where(lambda s: s.dt.year > 1900),
    }, geometry=b.geometry.values, crs=b.crs)
    assert pts["categoria"].notna().all() and pts["porte"].notna().all()
    pts = no_municipio(pts, mun).reset_index(drop=True)
    ute = usinas_siga_sp("Biog", mun)
    rgint, limite = base_territorial(mun)
    n_mun = pts.groupby("CD_MUN").size()
    camada_mun = gpd.GeoDataFrame(mun[["CD_MUN", "NM_MUN", "CD_RGINT", "NM_RGINT"]].assign(
        usinas_biogas=mun["CD_MUN"].map(n_mun).fillna(0).astype(int),
        ute_biogas_kw=mun["CD_MUN"].map(ute.groupby("CD_MUN")["potencia_kw"].sum()).fillna(0)),
        geometry=mun.geometry.values, crs=mun.crs)
    # Estilos: cor pela categoria, tamanho pelo porte; usinas fora de operação vazadas.
    itens = []
    for _, k, pt, _, cor in CATEGORIAS_BIOGAS:
        for _, kp, mm, _ in PORTES:
            base = f"{igual('categoria', k)} AND {igual('porte', kp)}"
            itens.append((f"{base} AND {igual('situacao', 'Em operação')}", f"{pt} · {kp}", marcador(cor, mm)))
            itens.append((f"{base} AND &quot;situacao&quot; &lt;&gt; 'Em operação'", f"{pt} · {kp} · fora de operação",
                          marcador(cor, mm, vazado=True)))
    estilo_ute = estilo_regras("ponto", [
        ("&quot;potencia_kw&quot; IS NOT NULL", "Usina termelétrica a biogás (ANEEL), círculo ∝ potência",
         marcador(MINERAIS["argila"], 4, vazado=True, tamanho_expr='1.2 + 0.06 * sqrt("potencia_kw")')),
    ], rotulo_campo="nome", ordem='"potencia_kw" DESC')
    cols_pts = ["categoria", "uso_principal", "energia_eletrica", "energia_termica", "energia_mecanica", "biometano",
                "situacao", "porte", "inicio_operacao", "CD_MUN", "NM_MUN"]
    cols_ute = ["nome", "ceg", "combustivel", "fase", "potencia_kw", "potencia_fiscalizada_kw", "inicio_operacao",
                "proprietario", "CD_MUN", "NM_MUN"]
    csv = pd.concat([
        pts[cols_pts].assign(camada="usinas_biogas", lon=pts.geometry.x.round(6), lat=pts.geometry.y.round(6)),
        ute[cols_ute].assign(camada="ute_biogas", lon=ute.geometry.x.round(6), lat=ute.geometry.y.round(6)),
    ], ignore_index=True)
    arquivos = gravar(
        "biogas", "sp_usinas_biogas",
        {"usinas_biogas": pts[cols_pts + ["geometry"]], "ute_biogas": ute[cols_ute + ["geometry"]],
         "municipios": camada_mun, "regioes_intermediarias": rgint, "limite_estadual": limite},
        {
            "usinas_biogas": [("categoria_e_porte", "Usinas de biogás por categoria (cor) e porte (tamanho)",
                               estilo_regras("ponto", itens), True)],
            "ute_biogas": [("potencia", "Termelétricas a biogás registradas na ANEEL, por potência", estilo_ute, True)],
            "municipios": [("contorno", "Limites municipais", estilo_contorno_mun(), True)],
            "regioes_intermediarias": [("contorno", "Limites e nomes das regiões intermediárias",
                                        estilo_contorno("#1a211a", 0.45, "NM_RGINT"), True)],
            "limite_estadual": [("contorno", "Limite estadual", estilo_contorno(TINTA, 0.8), True)],
        },
        csv,
    )
    ini = pts["inicio_operacao"].dropna()
    gravar_cache("bioenergia-sp-biogas", {
        "usinas": len(pts),
        "por_categoria": pts["categoria"].value_counts().to_dict(),
        "por_situacao": pts["situacao"].value_counts().to_dict(),
        "por_porte": pts["porte"].value_counts().to_dict(),
        "por_uso": pts["uso_principal"].value_counts().to_dict(),
        "municipios_com_usina": int(pts["CD_MUN"].nunique()),
        "inicio_mais_recente": ini.max().strftime("%Y-%m-%d"),
        "inicio_mais_antigo": ini.min().strftime("%Y-%m-%d"),
        "pontos": [{"categoria": r.categoria, "porte": r.porte, "operacao": r.situacao == "Em operação",
                    "cd": r.CD_MUN, "coord": [round(r.geometry.x, 5), round(r.geometry.y, 5)]} for r in pts.itertuples()],
        "ute": resumo_siga(ute),
        "ute_total_kw": float(ute["potencia_kw"].sum()),
        "ute_inicio_mais_recente": ute["inicio_operacao"].max().strftime("%Y-%m-%d"),
        "siga_inicio_mais_recente": siga(SIGA_FONTE)["inicio_operacao"].max().strftime("%Y-%m-%d"),
        "arquivos": arquivos,
    })
    print(f"biogás: {len(pts)} usinas, {len(ute)} UTE · {arquivos}")


# ------------------------------------------------------------------ usinas a bagaço (SIGA) sobre a cana (PAM)
def usinas() -> None:
    mun = malha_uf("SP")
    ute = usinas_siga_sp("Bagaço", mun)
    arq = DADOS / "raw" / "pam" / "TABELA_1612_2024_A_2021.xlsx"
    prod, _ = sidra(arq, 2)
    prod = prod[prod.index.str.startswith("35")][ANO]
    df = mun.drop(columns="geometry").copy()
    vals = [valor_sidra(prod.at[c, "Cana-de-açúcar"]) if c in prod.index else (None, "fora_da_tabela") for c in df["CD_MUN"]]
    df["producao_t"] = [v for v, _ in vals]
    lim = quebras(df["producao_t"])
    df["cl"] = [classe(v, lim) for v in df["producao_t"]]
    pot = ute.groupby("CD_MUN")["potencia_kw"]
    df["ute_bagaco_n"] = df["CD_MUN"].map(pot.size()).fillna(0).astype(int)
    df["ute_bagaco_kw"] = df["CD_MUN"].map(pot.sum()).fillna(0)
    # Usinas sucroenergéticas do WebMap EPE (2018): capacidade de moagem e de etanol.
    e = infra("structure_ethanol_plant")
    e = e[e["UF"] == "SP"]
    c = list(e.columns)
    pega = lambda p: next(x for x in c if x.startswith(p))  # noqa: E731
    epe = gpd.GeoDataFrame({
        "nome": e["Nome"], "cidade": e["Cidade"], "tipo": e["Tipo"], "situacao": e["Situacao"],
        "classe_moagem_t_safra": e["Classecap"], "etanol_anidro_m3_dia": e["Cpanhm3d"],
        "etanol_hidratado_m3_dia": e["Cphidrm3d"], "inicio": pd.to_numeric(e[pega("Início")], errors="coerce").astype("Int64"),
    }, geometry=e.geometry.values, crs=e.crs)
    epe = no_municipio(epe, mun)
    rgint, limite = base_territorial(mun)
    cols_mun = ["CD_MUN", "NM_MUN", "CD_RGINT", "NM_RGINT", "producao_t", "ute_bagaco_n", "ute_bagaco_kw"]
    camada_mun = gpd.GeoDataFrame(df[cols_mun], geometry=mun.geometry.values, crs=mun.crs)
    cols_ute = ["nome", "ceg", "fase", "potencia_kw", "potencia_fiscalizada_kw", "inicio_operacao", "proprietario",
                "CD_MUN", "NM_MUN"]
    estilo_ute = estilo_regras("ponto", [
        (igual("fase", "Operação"), "Em operação (círculo ∝ potência)",
         marcador(MINERAIS["argila"], 3, alfa=0.82, tamanho_expr='1 + 0.045 * sqrt("potencia_kw")')),
        ("&quot;fase&quot; &lt;&gt; 'Operação'", "Em construção",
         marcador(MINERAIS["argila"], 3, vazado=True, tamanho_expr='1 + 0.045 * sqrt("potencia_kw")')),
    ], ordem='"potencia_kw" DESC')
    estilo_epe = estilo_regras("ponto", [("1 = 1", "Usina sucroenergética (EPE 2018)",
                                          marcador(TINTA, 1.2, forma="cross2", borda=TINTA, largura_borda=0.3))])
    arquivos = gravar(
        "usinas", "sp_usinas_cana",
        {"ute_bagaco": ute[cols_ute + ["geometry"]], "usinas_epe_2018": epe.drop(columns="index_right", errors="ignore"),
         "municipios": camada_mun, "regioes_intermediarias": rgint, "limite_estadual": limite},
        {
            "ute_bagaco": [("potencia", "Termelétricas a bagaço de cana registradas na ANEEL", estilo_ute, True)],
            "usinas_epe_2018": [("cruz", "Usinas sucroenergéticas do WebMap EPE 2018", estilo_epe, True)],
            "municipios": [("producao", f"Produção de cana-de-açúcar (t), PAM {ANO}",
                            estilo_graduado("producao_t", lim, CANA_CLARO[: len(lim)], rotulo_campo="NM_MUN"), True)],
            "regioes_intermediarias": [("contorno", "Limites e nomes das regiões intermediárias",
                                        estilo_contorno("#1a211a", 0.45, "NM_RGINT"), True)],
            "limite_estadual": [("contorno", "Limite estadual", estilo_contorno(TINTA, 0.8), True)],
        },
        ute[cols_ute].assign(lon=ute.geometry.x.round(6), lat=ute.geometry.y.round(6)),
    )
    op = ute[ute["fase"] == "Operação"]
    gravar_cache("bioenergia-sp-usinas", {
        "ano_pam": ANO,
        "ute": resumo_siga(ute),
        "ute_n": len(ute), "ute_operacao_n": len(op), "ute_construcao_n": int(len(ute) - len(op)),
        "ute_operacao_kw": float(op["potencia_kw"].sum()), "ute_total_kw": float(ute["potencia_kw"].sum()),
        "ute_municipios": int(ute["CD_MUN"].nunique()),
        "ute_inicio_mais_recente": ute["inicio_operacao"].max().strftime("%Y-%m-%d"),
        "epe_n": len(epe),
        "producao_t": float(df["producao_t"].sum()),
        "producao_em_municipios_com_ute": float(df.loc[df["ute_bagaco_n"] > 0, "producao_t"].sum()),
        "quebras": lim,
        "valores": {r.CD_MUN: r.cl for r in df.itertuples()},
        "arquivos": arquivos,
    })
    print(f"usinas: {len(ute)} UTE a bagaço, {len(epe)} usinas EPE · {arquivos}")


# Rampa clara para a cana sob os pontos (palha → oliva): o fundo informa sem disputar com os círculos.
CANA_CLARO = ["#f3efd9", "#e6e2b8", "#d2d39a", "#b9c27f", "#9cad69", "#7f9656"]


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("tema", choices=["biogas", "rebanhos", "cana", "usinas"])
    {"biogas": biogas, "rebanhos": rebanhos, "cana": cana, "usinas": usinas}[ap.parse_args().tema]()
