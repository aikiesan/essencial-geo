"""
Coleção «Leite, ovos, mel e peixe» — prepara os dados de uma prancha (uso interno).

    .venv-geo/Scripts/python scripts/colecoes/animal-sp/preparar.py ovos|leite|mel|tilapia|valor

Entradas: Pesquisa da Pecuária Municipal do IBGE (tabela 74, produção de origem animal, 2008 a 2024;
tabela 3940, aquicultura, 2013 a 2024), exportadas do SIDRA para o Brasil inteiro; potencial de biometano
do CP2B v5.1 (N4, cenário de referência). Saídas: mapas/<pasta>/dados/<base>.gpkg.zip (com estilos do
QGIS), <base>.csv e scripts/colecoes/cache/animal-sp-<tema>.json (para a prancha e a ficha).
"""

from __future__ import annotations

import argparse
import sys
from functools import lru_cache
from pathlib import Path

import geopandas as gpd
import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from comum import (  # noqa: E402
    DADOS, RAIZ, TINTA, classe, estilo_contorno, estilo_graduado, estilo_regras, gravar_cache, gravar_estilos, igual,
    malha_uf, marcador, quebras, sidra, valor_sidra, zipar,
)

PASTAS = {
    "ovos": "071-ovos-sp",
    "leite": "072-leite-sp",
    "mel": "073-mel-sp",
    "tilapia": "074-tilapia-sp",
    "valor": "075-producao-animal-sp",
}
PPM = DADOS / "raw" / "ibge_ppm"
T74 = PPM / "TABELA_74_2008A2024.xlsx"
T3940 = PPM / "TABELA_3940_2008A2024.xlsx"
CP2B = DADOS / "raw" / "cp2b_potential" / "2026" / "cp2b_municipio_substrato_niveis.csv"
CENARIO = "med"
ANO0, ANO1 = 2008, 2024

OVOS = ["#fdf6dc", "#fbe6a6", "#f6cd6b", "#eaa93a", "#cc7d1c", "#93520f"]
LEITE = ["#eef2f6", "#cfdbe6", "#a6bfd3", "#7697b5", "#4a6f93", "#26476a"]
MEL = ["#fbf3d6", "#f4dc96", "#e8bd54", "#d29a26", "#a8711a", "#6e4610"]
PEIXE = ["#e8f2f4", "#bfdde3", "#8cc1cc", "#559eae", "#2b7a8f", "#12536b"]
PRODUTOS = {  # chave → (rótulo, rótulo EN, cor)
    "leite": ("Leite", "Milk", LEITE[4]),
    "ovos": ("Ovos", "Eggs", OVOS[3]),
    "mel": ("Mel", "Honey", MEL[4]),
    "casulos": ("Casulos do bicho-da-seda", "Silkworm cocoons", "#8a6a9c"),
    "aquicultura": ("Aquicultura", "Aquaculture", PEIXE[4]),
}


# ------------------------------------------------------------------ leitura
@lru_cache(maxsize=None)
def _aba(arq: Path, aba: int) -> pd.DataFrame:
    t, _ = sidra(arq, aba)
    return t


def ppm(arq: Path, aba: int, produto: str, uf: str | None = "35") -> tuple[pd.DataFrame, pd.DataFrame]:
    """Municípios × anos de um produto (valores e situação do IBGE); uf=None devolve o Brasil."""
    t = _aba(arq, aba)
    if uf:
        t = t[t.index.str.startswith(uf)]
    vals, sits = {}, {}
    for ano, p in t.columns:
        if p == produto:
            par = t[(ano, p)].map(valor_sidra)
            vals[ano] = par.map(lambda x: x[0])
            sits[ano] = par.map(lambda x: x[1])
    return pd.DataFrame(vals).sort_index(axis=1), pd.DataFrame(sits).sort_index(axis=1)


def brasil(arq: Path, aba: int, produto: str) -> dict[int, float]:
    t, _ = ppm(arq, aba, produto, uf=None)
    return {int(a): float(t[a].sum()) for a in t.columns}


@lru_cache(maxsize=1)
def cp2b_pivo() -> pd.DataFrame:
    n = pd.read_csv(CP2B, dtype={"ibge_code": str})
    n = n[n["scenario"] == CENARIO]
    return (n.pivot_table(index="ibge_code", columns="substrate", values="n4_biomethane_eq_nm3_year", aggfunc="sum")
            / 365).fillna(0)


# ------------------------------------------------------------------ comum
def base_territorial(mun: gpd.GeoDataFrame):
    rgint = mun.dissolve(by=["CD_RGINT", "NM_RGINT"], as_index=False)[["CD_RGINT", "NM_RGINT", "geometry"]]
    limite = mun.assign(SIGLA_UF="SP").dissolve(by="SIGLA_UF", as_index=False)[["SIGLA_UF", "geometry"]]
    return rgint, limite


def estilos_base() -> dict:
    return {
        "regioes_intermediarias": [("contorno", "Limites e nomes das regiões intermediárias",
                                    estilo_contorno("#1a211a", 0.45, "NM_RGINT"), True)],
        "limite_estadual": [("contorno", "Limite estadual", estilo_contorno(TINTA, 0.8), True)],
    }


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


def serie(tab: pd.DataFrame) -> dict[int, float]:
    return {int(a): float(tab[a].sum()) for a in tab.columns}


def produto_municipal(tema: str, arq: Path, produto: str, unidade: str, cores: list[str], rotulo: str,
                      ano0: int = ANO0, extra: dict | None = None, cp2b: str | None = None) -> None:
    """Prancha de um produto: produção do último ano em classes por quantis, série estadual e parte do Brasil."""
    mun = malha_uf("SP")
    prod, sit = ppm(arq, 0, produto)
    br = brasil(arq, 0, produto)
    df = mun.drop(columns="geometry")[["CD_MUN", "NM_MUN", "CD_RGINT", "NM_RGINT"]].copy()
    c0, c1 = f"producao_{ano0}", f"producao_{ANO1}"
    df[c0] = df["CD_MUN"].map(prod[ano0])
    df[c1] = df["CD_MUN"].map(prod[ANO1])
    df["situacao_" + str(ANO1)] = df["CD_MUN"].map(sit[ANO1]).fillna("fora_da_tabela")
    if cp2b:
        df["biometano_m3_dia"] = df["CD_MUN"].map(cp2b_pivo()[cp2b]).fillna(0).round(1)
    lim = quebras(df[c1])
    df["cl"] = [classe(v, lim) for v in df[c1]]
    cols = [c for c in df.columns if c != "cl"]
    rgint, limite = base_territorial(mun)
    camada = gpd.GeoDataFrame(df[cols], geometry=mun.geometry.values, crs=mun.crs)
    estilos = {"municipios": [("producao", f"{rotulo} ({unidade}), PPM {ANO1}",
                               estilo_graduado(c1, lim, cores, rotulo_campo="NM_MUN"), True)], **estilos_base()}
    base = SERIE[tema]["base"]
    arquivos = gravar(tema, base, {"municipios": camada, "regioes_intermediarias": rgint, "limite_estadual": limite},
                      estilos, df[cols].sort_values("NM_MUN"))
    tot0, tot1 = float(df[c0].sum()), float(df[c1].sum())
    regioes = df.groupby("NM_RGINT")[c1].sum().sort_values(ascending=False)
    cache = {
        "anos": [ano0, ANO1], "municipios": len(df), "unidade": unidade,
        "total": {str(ano0): tot0, str(ANO1): tot1},
        "brasil": {str(ano0): br[ano0], str(ANO1): br[ANO1]},
        "parte_brasil": {str(ano0): tot0 / br[ano0] * 100, str(ANO1): tot1 / br[ANO1] * 100},
        "produtores": {str(ano0): int((df[c0] > 0).sum()), str(ANO1): int((df[c1] > 0).sum())},
        "sem_info": int(df[c1].isna().sum()),
        "serie": serie(prod), "serie_brasil": {str(k): v for k, v in br.items()},
        "maiores": topo(df, c1, 6),
        "maior_pct": float(df[c1].max() / tot1 * 100),
        "top10_pct": float(df[c1].nlargest(10).sum() / tot1 * 100),
        "regioes": {r: float(v) for r, v in regioes.items()},
        "quebras": lim,
        "valores": {r.CD_MUN: r.cl for r in df.itertuples()},
        "arquivos": arquivos,
    }
    if cp2b:
        cache["biometano_m3_dia"] = float(df["biometano_m3_dia"].sum())
        cache["biometano_maiores"] = topo(df, "biometano_m3_dia")
    cache.update(extra or {})
    gravar_cache(f"animal-sp-{tema}", cache)
    print(f"{tema}: {tot1:,.0f} {unidade} em {ANO1} ({tot1 / br[ANO1] * 100:.1f}% do Brasil) · {arquivos}")


SERIE = {e["tema"]: e for e in pd.read_json(Path(__file__).with_name("serie.json")).to_dict("records")}


# ------------------------------------------------------------------ temas
def ovos() -> None:
    cod, _ = ppm(T74, 0, "Ovos de codorna (Mil dúzias)")
    cod_br = brasil(T74, 0, "Ovos de codorna (Mil dúzias)")
    extra = {"codorna": {str(a): float(cod[a].sum()) for a in (ANO0, ANO1)},
             "codorna_parte_brasil": {str(a): float(cod[a].sum()) / cod_br[a] * 100 for a in (ANO0, ANO1)},
             "codorna_maiores": [{"cd": cd, "valor": float(v)} for cd, v in cod[ANO1].nlargest(3).items()]}
    produto_municipal("ovos", T74, "Ovos de galinha (Mil dúzias)", "mil dúzias", OVOS, "Ovos de galinha",
                      extra=extra, cp2b="AVES_POSTURA")


def leite() -> None:
    produto_municipal("leite", T74, "Leite (Mil litros)", "mil litros", LEITE, "Leite", cp2b="BOV_LEITE")


def mel() -> None:
    produto_municipal("mel", T74, "Mel de abelha (Quilogramas)", "kg", MEL, "Mel de abelha")


def tilapia() -> None:
    peixes, _ = ppm(T3940, 0, "Tilápia (Quilogramas)")
    # Peixes = soma das espécies em quilogramas (sem camarão nem moluscos).
    especies = sorted({p for a, p in _aba(T3940, 0).columns if a == ANO1 and p.endswith("(Quilogramas)")
                       and not p.startswith(("Camarão", "Ostras", "Peixes"))})
    tot = sum(ppm(T3940, 0, e)[0][ANO1].fillna(0) for e in especies)
    extra = {"peixes_total": float(tot.sum()), "tilapia_pct_peixes": float(peixes[ANO1].sum() / tot.sum() * 100),
             "especies": especies}
    produto_municipal("tilapia", T3940, "Tilápia (Quilogramas)", "kg", PEIXE, "Tilápia", ano0=2013, extra=extra)


def valor() -> None:
    """Valor da produção de origem animal e da aquicultura em 2024, por produto e município."""
    mun = malha_uf("SP")
    df = mun.drop(columns="geometry")[["CD_MUN", "NM_MUN", "CD_RGINT", "NM_RGINT"]].copy()
    fontes = {
        "leite": [(T74, "Leite")],
        "ovos": [(T74, "Ovos de galinha"), (T74, "Ovos de codorna")],
        "mel": [(T74, "Mel de abelha")],
        "casulos": [(T74, "Casulos do bicho-da-seda")],
        "aquicultura": [(T3940, "Total")],
    }
    for k, itens in fontes.items():
        s = None
        for arq, p in itens:
            t, _ = ppm(arq, 1, p)
            v = df["CD_MUN"].map(t[ANO1])
            s = v if s is None else s.add(v, fill_value=0)
        df[f"{k}_mil_reais"] = s.round(0)
    cols_v = [f"{k}_mil_reais" for k in PRODUTOS]
    df["total_mil_reais"] = df[cols_v].sum(axis=1, min_count=1).round(0)
    df["dominante"] = df[cols_v].fillna(0).idxmax(axis=1).str.replace("_mil_reais", "")
    df.loc[~(df["total_mil_reais"] > 0), "dominante"] = None
    df["parte_dominante"] = (df[cols_v].max(axis=1) / df["total_mil_reais"] * 100).round(1)
    cols = ["CD_MUN", "NM_MUN", "CD_RGINT", "NM_RGINT"] + cols_v + ["total_mil_reais", "dominante", "parte_dominante"]
    rgint, limite = base_territorial(mun)
    camada = gpd.GeoDataFrame(df[cols], geometry=mun.geometry.values, crs=mun.crs)
    tem = df["total_mil_reais"] > 0
    pts = gpd.GeoDataFrame(df.loc[tem, cols], crs=mun.crs,
                           geometry=mun.loc[tem].to_crs("EPSG:5880").representative_point().to_crs(mun.crs).values)
    itens = [(igual("dominante", k), f"{r}: o maior valor do município",
              marcador(cor, 2, alfa=0.82, tamanho_expr='0.6 + 0.05 * sqrt("total_mil_reais")')) for k, (r, _, cor) in PRODUTOS.items()]
    estilos = {
        "valor": [("circulos", f"Valor da produção animal e da aquicultura em {ANO1} (círculo ∝ mil R$; cor = maior produto)",
                   estilo_regras("ponto", itens, ordem='"total_mil_reais" DESC'), True)],
        "municipios": [("contorno", "Limites municipais", estilo_contorno("#c9ced3", 0.1), True)],
        **estilos_base(),
    }
    arquivos = gravar("valor", SERIE["valor"]["base"], {"valor": pts, "municipios": camada, "regioes_intermediarias": rgint,
                                                       "limite_estadual": limite}, estilos, df[cols].sort_values("NM_MUN"))
    tot = float(df["total_mil_reais"].sum())
    gravar_cache("animal-sp-valor", {
        "ano": ANO1, "municipios": len(df), "total_mil_reais": tot,
        "produtos": {k: float(df[f"{k}_mil_reais"].sum()) for k in PRODUTOS},
        "dominante": df["dominante"].value_counts().to_dict(),
        "sem_valor": int((~tem).sum()),
        "maiores": topo(df, "total_mil_reais", 6),
        "top10_pct": float(df["total_mil_reais"].nlargest(10).sum() / tot * 100),
        "pontos": [{"cd": r.CD_MUN, "nome": r.NM_MUN, "v": float(r.total_mil_reais), "g": r.dominante,
                    "coord": [round(p.x, 5), round(p.y, 5)]} for r, p in zip(pts.itertuples(), pts.geometry)],
        "arquivos": arquivos,
    })
    print(f"valor: R$ {tot / 1e6:,.2f} bi em {ANO1} · {arquivos}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    temas = {"ovos": ovos, "leite": leite, "mel": mel, "tilapia": tilapia, "valor": valor}
    ap.add_argument("tema", choices=list(temas))
    temas[ap.parse_args().tema]()
