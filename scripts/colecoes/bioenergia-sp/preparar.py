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
    DADOS, PLASMA, RAIZ, VIRIDIS, TINTA, classe, estilo_contorno, estilo_graduado, gravar_cache,
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
        "quebras": lim,
        "maiores_producao": topo(df, "producao_t"),
        "maior_parte": topo(df, "pct_area"),
        "valores": {r.CD_MUN: r.cl for r in df.itertuples()},
        "arquivos": arquivos,
    })
    print(f"cana: {len(com)} municípios com cana · {arquivos}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("tema", choices=["rebanhos", "cana"])
    {"rebanhos": rebanhos, "cana": cana}[ap.parse_args().tema]()
