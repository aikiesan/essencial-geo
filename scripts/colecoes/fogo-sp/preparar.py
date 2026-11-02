"""
Coleção «Biomassa que vira fumaça» (SP) — prepara os dados de uma prancha (uso interno).

    .venv-geo/Scripts/python -I -X utf8 scripts/colecoes/fogo-sp/preparar.py agosto|mes|lugar|todos < /dev/null

Focos de calor do satélite de referência do INPE (BDQueimadas, arquivos anuais de 2003 a 2024 em
dados-brutos/inpe-queimadas/) com estado == "SÃO PAULO", ligados ao município da Malha Municipal 2025 do IBGE
pelo ponto. Cobertura da terra: MapBiomas coleção 10, 2024 (grade de 120 m e área por município de
scripts/colecoes/cache/downloads/mapbiomas/, de agro-sp/preparar.py baixar).

Saídas: mapas/<pasta>/dados/<base>.gpkg.zip (com estilos do QGIS), <base>.csv
e scripts/colecoes/cache/fogo-sp-<tema>.json (para a prancha e a ficha).
"""

from __future__ import annotations

import argparse
import json
import math
import sys
import zipfile
from pathlib import Path

import geopandas as gpd
import numpy as np
import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from comum import (  # noqa: E402
    CACHE, GEO, RAIZ, TINTA, estilo_contorno, estilo_regras, gravar_cache, gravar_estilos, gravar_grade, igual,
    malha_uf, marcador, para_d3, zipar,
)
from estilos import preenchimento  # noqa: E402

SERIE = {s["tema"]: s for s in json.loads((Path(__file__).parent / "serie.json").read_text(encoding="utf-8"))}
BRUTOS = RAIZ / "dados-brutos" / "inpe-queimadas"
MB_120 = CACHE / "downloads" / "mapbiomas" / "sp_coverage_2024_120m.tif"   # moda de 4 × 4 pixels de 30 m
MB_KM2 = CACHE / "downloads" / "mapbiomas" / "sp_coverage_2024_mun_km2.csv"  # km² por município e classe (30 m)
ANOS = range(2003, 2025)
ANTES = (2003, 2007)   # a queima da palha ainda era a regra na colheita
DEPOIS = (2020, 2024)  # depois dos prazos do Protocolo Agroambiental (2014 e 2017)
MEIA = 4               # janela de 9 × 9 células de 120 m (~1 km²), o pixel nominal do MODIS
MIN_FOCOS = 10         # focos no quinquênio para a data média valer
P_RAYLEIGH = 0.05      # e as datas precisam ter estação (teste de Rayleigh)
SEM_INFO = "#ffffff"

# Cobertura da terra em oito grupos, a partir da legenda da coleção 10 (código → grupo).
GRUPOS = [  # (chave, rótulo, rótulo EN, cor, códigos)
    ("cana", "Cana", "Sugarcane", "#c08a2e", [20]),
    ("pastagem", "Pastagem", "Pasture", "#9c4a32", [15]),
    ("mosaico", "Mosaico de usos", "Mosaic of uses", "#6b3d5c", [21]),
    ("lavouras", "Soja e outras lavouras", "Soya and other crops", "#234e70", [39, 40, 41, 62, 46, 47, 48, 35]),
    ("silvicultura", "Silvicultura", "Tree plantation", "#7d8a3c", [9]),
    ("floresta", "Floresta nativa", "Native forest", "#2f5d3a", [3, 5, 6, 49]),
    ("campo", "Cerrado, campo e várzea", "Savanna, grassland, wetland", "#5f9e95", [4, 11, 12, 13, 29, 32, 50]),
    ("outros", "Cidade, água e outros", "Urban, water and other", "#4a4e52", [22, 23, 24, 25, 30, 31, 33, 75]),
]
CHAVES = [g[0] for g in GRUPOS]


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
    tam = {z.name: z.stat().st_size, arq_csv.name: arq_csv.stat().st_size}
    print(f"  {s['pasta']}: " + " · ".join(f"{k} {v / 1e6:.2f} MB" for k, v in tam.items()))
    return tam


# ------------------------------------------------------------------ peças comuns
def municipios() -> gpd.GeoDataFrame:
    return malha_uf("SP")


def focos() -> gpd.GeoDataFrame:
    """Focos de SP de 2003 a 2024, com o município do IBGE em que o ponto cai (cache/fogo-sp-focos.parquet)."""
    arq = CACHE / "fogo-sp-focos.parquet"
    if arq.exists():
        return gpd.read_parquet(arq)
    partes = []
    for ano in ANOS:
        with zipfile.ZipFile(BRUTOS / f"focos_br_ref_{ano}.zip") as z:
            nome = next(n for n in z.namelist() if n.endswith(".csv"))
            df = pd.read_csv(z.open(nome), dtype=str, encoding="utf-8")
        df.columns = [c.strip() for c in df.columns]
        df = df.apply(lambda s: s.str.strip())
        df = df[df["estado"].str.upper() == "SÃO PAULO"].copy()
        df["ano"] = ano
        partes.append(df)
        print(f"  {ano}: {len(df)} focos em SP", flush=True)
    f = pd.concat(partes, ignore_index=True)
    f["lat"] = f["lat"].astype(float)
    f["lon"] = f["lon"].astype(float)
    # data_pas vem em UTC, das 16 às 18 h (a passagem da tarde do Aqua): a data UTC é a data local.
    f["data"] = f["data_pas"].str[:10]
    f["hora_utc"] = f["data_pas"].str[11:16]
    assert (f["data"].str[:4].astype(int) == f["ano"]).all()
    g = gpd.GeoDataFrame(f, geometry=gpd.points_from_xy(f["lon"], f["lat"]), crs=GEO)
    m = municipios()[["CD_MUN", "NM_MUN", "CD_RGINT", "NM_RGINT", "geometry"]]
    g = gpd.sjoin(g, m, how="left", predicate="within").drop(columns="index_right")
    assert g["CD_MUN"].notna().all(), "foco de SP fora da malha do IBGE"
    g = g.rename(columns={"municipio": "municipio_inpe", "bioma": "bioma_inpe"})
    g = g[["foco_id", "ano", "data", "hora_utc", "lat", "lon", "municipio_inpe", "bioma_inpe",
           "CD_MUN", "NM_MUN", "CD_RGINT", "NM_RGINT", "geometry"]]
    g = g.sort_values(["data", "foco_id"]).reset_index(drop=True)
    CACHE.mkdir(parents=True, exist_ok=True)
    g.to_parquet(arq)
    return g


def areas_mapbiomas() -> pd.DataFrame:
    """km² por município e grupo de cobertura (MapBiomas 2024, contados em 30 m), sem os pixels sem classe."""
    km = pd.read_csv(MB_KM2, dtype={"CD_MUN": str})
    km = km[km["codigo"] != 0]
    grupo_de = {c: k for k, *_, cods in GRUPOS for c in cods}
    sem = sorted(set(km["codigo"]) - set(grupo_de))
    assert not sem, f"códigos sem grupo: {sem}"
    km["grupo"] = km["codigo"].map(grupo_de)
    pv = km.pivot_table(index="CD_MUN", columns="grupo", values="km2", aggfunc="sum", fill_value=0)
    return pv.reindex(columns=CHAVES, fill_value=0)


def grade_grupos() -> tuple[np.ndarray, object]:
    """Grade de 120 m com o índice do grupo (1..8; 0 fora de SP ou sem classe) e a transformação."""
    import rasterio
    from rasterio.features import rasterize

    with rasterio.open(MB_120) as s:
        a = s.read(1)
        tr = s.transform
    dentro = rasterize([(g, 1) for g in municipios().geometry], out_shape=a.shape, transform=tr, fill=0, dtype="uint8")
    tab = np.zeros(256, dtype="uint8")
    for i, (*_, cods) in enumerate(GRUPOS):
        tab[cods] = i + 1
    g = tab[np.where(dentro == 1, a, 0)]
    return g, tr


def composicao(lon: np.ndarray, lat: np.ndarray, grade: np.ndarray, tr) -> tuple[np.ndarray, np.ndarray]:
    """Parte de cada grupo nas células de SP da janela de 9 × 9 em volta de cada ponto, e o grupo no ponto."""
    ii = np.floor((np.asarray(lon) - tr.c) / tr.a).astype(int)
    jj = np.floor((tr.f - np.asarray(lat)) / -tr.e).astype(int)
    comp = np.zeros((len(ii), len(GRUPOS)))
    for n, (y, x) in enumerate(zip(jj, ii)):
        w = grade[y - MEIA:y + MEIA + 1, x - MEIA:x + MEIA + 1].ravel()
        w = w[w > 0]
        comp[n] = np.bincount(w, minlength=len(GRUPOS) + 1)[1:] / len(w)
    return comp, grade[jj, ii]


def posicao(m: gpd.GeoDataFrame) -> pd.Series:
    """Ponto interno de cada município (para chamadas), em SIRGAS 2000."""
    return m.set_index("CD_MUN").geometry.to_crs("EPSG:31983").representative_point().to_crs(GEO)


def coord(p) -> list[float]:
    return [round(p.x, 4), round(p.y, 4)]


# ------------------------------------------------------------------ 141 o que queimou em agosto
DIAS = ["2024-08-22", "2024-08-23", "2024-08-24"]


def agosto() -> None:
    f = focos()
    f24 = f[f["ano"] == 2024].copy().reset_index(drop=True)
    grade, tr = grade_grupos()
    comp, centro = composicao(f24["lon"], f24["lat"], grade, tr)
    assert (centro > 0).all()
    f24["destaque_22a24"] = f24["data"].isin(DIAS)
    f24["classe_dominante"] = [CHAVES[i] for i in comp.argmax(axis=1)]
    f24["classe_no_ponto"] = [CHAVES[i - 1] for i in centro]
    for i, k in enumerate(CHAVES):
        f24[f"pct_{k}"] = np.round(comp[:, i] * 100).astype(int)
    d = f24["destaque_22a24"].to_numpy()

    pv = areas_mapbiomas()
    area = pv.sum()
    area_pct = area / area.sum() * 100
    m = municipios()
    m["pct_cana_2024"] = (m["CD_MUN"].map(pv["cana"]) / m["CD_MUN"].map(pv.sum(axis=1)) * 100).round(1)
    m["focos_2024"] = m["CD_MUN"].map(f24.groupby("CD_MUN").size()).fillna(0).astype(int)
    m["focos_22a24_ago"] = m["CD_MUN"].map(f24[d].groupby("CD_MUN").size()).fillna(0).astype(int)

    grupos = []
    for i, (k, r, r_en, cor, cods) in enumerate(GRUPOS):
        grupos.append({
            "chave": k, "rotulo": r, "rotulo_en": r_en, "cor": cor, "codigos": cods,
            "area_km2": round(float(area[k]), 1), "area_pct": round(float(area_pct[k]), 2),
            "sob_22a24_pct": round(float(comp[d, i].mean() * 100), 2),
            "sob_2024_pct": round(float(comp[:, i].mean() * 100), 2),
            "ponto_22a24_pct": round(float((centro[d] == i + 1).mean() * 100), 2),
            "dominante_22a24": int((comp[d].argmax(axis=1) == i).sum()),
            "dominante_2024": int((comp.argmax(axis=1) == i).sum()),
        })
    cana = grupos[0]
    print(f"  141: 2024 {len(f24)} focos · 22–24/08 {int(d.sum())} ({d.mean() * 100:.1f} %)")
    print(f"  cana: área {cana['area_pct']:.1f} % · sob os focos 22–24 {cana['sob_22a24_pct']:.1f} % "
          f"(no ponto {cana['ponto_22a24_pct']:.1f} %) · 2024 {cana['sob_2024_pct']:.1f} % · "
          f"dominante {cana['dominante_22a24']} focos")

    # Agosto de 2024, dia a dia, e os municípios com mais focos nos três dias.
    dia = f24[f24["data"].str[:7] == "2024-08"].groupby("data").size()
    agosto_dias = [int(dia.get(f"2024-08-{i:02d}", 0)) for i in range(1, 32)]
    meses = [int((f24["data"].str[5:7] == f"{i:02d}").sum()) for i in range(1, 13)]
    pos = posicao(m)
    top = (f24[d].groupby(["CD_MUN", "NM_MUN"]).size().sort_values(ascending=False).head(10).reset_index(name="focos"))
    maiores = []
    for r in top.itertuples():
        sel = d & (f24["CD_MUN"] == r.CD_MUN).to_numpy()
        maiores.append({"cd": r.CD_MUN, "nome": r.NM_MUN, "focos": int(r.focos), "coord": coord(pos[r.CD_MUN]),
                        "pct_cana_municipio": float(m.set_index("CD_MUN").at[r.CD_MUN, "pct_cana_2024"]),
                        "sob": {k: round(float(comp[sel, i].mean() * 100), 1) for i, k in enumerate(CHAVES)}})
    regioes = f24[d].groupby("NM_RGINT").size().sort_values(ascending=False)

    # Base da prancha: a cana de 2024 no estado (grade de 120 m).
    gravar_grade("fogo-sp-cana", (grade == 1).astype("uint8"), tr, nodata=0)

    # GPKG, CSV e estilos.
    pts = f24.drop(columns=["CD_RGINT"]).copy()
    pts["data"] = pts["data"].astype(str)
    regras = [(f'{igual("classe_dominante", k)} AND &quot;destaque_22a24&quot;', f"{r} (22 a 24/08)",
               marcador(cor, 1.6, largura_borda=0.15)) for k, r, _, cor, _ in GRUPOS]
    regras.append(("NOT &quot;destaque_22a24&quot;", "outros focos de 2024", marcador("#b9bfc5", 0.8, largura_borda=0.05, alfa=0.7)))
    regras_ponto = [(igual("classe_no_ponto", k), r, marcador(cor, 1.2, largura_borda=0.1)) for k, r, _, cor, _ in GRUPOS]
    estilos = {
        "focos_2024": [
            ("classe_dominante", "Focos de 2024; 22 a 24/08 pela classe dominante no km em volta",
             estilo_regras("ponto", regras, ordem='"destaque_22a24" ASC'), True),
            ("classe_no_ponto", "Focos de 2024 pela classe da célula de 120 m do ponto", estilo_regras("ponto", regras_ponto), False),
        ],
        "municipios": [("municipios", "Municípios", estilo_contorno("#9aa1a8", 0.15), True)],
        "limite_estadual": [("limite", "Limite estadual", estilo_contorno(TINTA, 0.6), True)],
    }
    lim = m.dissolve()[["geometry"]].assign(nome="São Paulo")
    cols_m = ["CD_MUN", "NM_MUN", "NM_RGINT", "area_km2", "pct_cana_2024", "focos_2024", "focos_22a24_ago"]
    pct_cols = [f"pct_{k}" for k in CHAVES]
    csv = pts[["data", "hora_utc", "lat", "lon", "CD_MUN", "NM_MUN", "destaque_22a24", "classe_dominante",
               "classe_no_ponto", *pct_cols]]
    gpkg_pts = pts[["foco_id", "data", "hora_utc", "lat", "lon", "municipio_inpe", "bioma_inpe", "CD_MUN", "NM_MUN",
                    "NM_RGINT", "destaque_22a24", "classe_dominante", "classe_no_ponto", *pct_cols, "geometry"]]
    tam = gravar("agosto", {"focos_2024": gpkg_pts, "municipios": m[cols_m + ["geometry"]], "limite_estadual": lim},
                 estilos, csv)

    # Pontos para a prancha, numa ordem fixa sem relação com o lugar (o id do INPE), para nenhuma classe
    # ficar sempre por cima.
    ordem = f24.sort_values("foco_id").index
    gravar_cache("fogo-sp-agosto", {
        "n_2024": int(len(f24)), "n_22a24": int(d.sum()), "dias": DIAS,
        "agosto_dias": agosto_dias, "meses_2024": meses,
        "grupos": grupos, "area_total_km2": round(float(area.sum()), 1),
        "maiores": maiores, "regioes_22a24": {k: int(v) for k, v in regioes.items()},
        "pontos": [[round(float(f24.at[i, "lon"]), 4), round(float(f24.at[i, "lat"]), 4),
                    int(comp[i].argmax()), int(f24.at[i, "destaque_22a24"])] for i in ordem],
        "arquivos": tam,
    })


# ------------------------------------------------------------------ 142 o mês do fogo
def oklab_hex(L: float, a: float, b: float) -> str:
    l_, m_, s_ = (L + 0.3963377774 * a + 0.2158037573 * b, L - 0.1055613458 * a - 0.0638541728 * b,
                  L - 0.0894841775 * a - 1.2914855480 * b)
    l, m, s = l_ ** 3, m_ ** 3, s_ ** 3
    rgb = (4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
           -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
           -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)
    gama = lambda x: 12.92 * x if x <= 0.0031308 else 1.055 * x ** (1 / 2.4) - 0.055  # noqa: E731
    return "#" + "".join(f"{round(gama(min(max(v, 0.0), 1.0)) * 255):02x}" for v in rgb)


# Paleta cíclica do ano (OKLCH nas âncoras, interpolada em OKLab): as águas em tons claros e frios, a seca
# escurecendo até julho e voltando pelo vermelho e pelo laranja de agosto e setembro.
ANCORAS = [  # (fração do ano, L, C, matiz)
    (0.00, 0.93, 0.03, 95), (0.17, 0.80, 0.07, 235), (0.33, 0.60, 0.12, 262), (0.45, 0.42, 0.12, 300),
    (0.53, 0.36, 0.12, 350), (0.61, 0.50, 0.16, 28), (0.70, 0.68, 0.15, 58), (0.81, 0.84, 0.09, 82),
]


def ciclo(t: float) -> str:
    t %= 1.0
    pts = [(f, L, C * math.cos(math.radians(h)), C * math.sin(math.radians(h))) for f, L, C, h in ANCORAS]
    pts.append((1.0, *pts[0][1:]))
    for (f0, *c0), (f1, *c1) in zip(pts, pts[1:]):
        if f0 <= t <= f1:
            u = (t - f0) / (f1 - f0)
            return oklab_hex(*[x + (y - x) * u for x, y in zip(c0, c1)])
    return oklab_hex(*pts[0][1:])


def rayleigh_p(n: int, r: float) -> float:
    """p do teste de Rayleigh (aproximação de Zar, 1999): datas espalhadas pelo ano dão p alto."""
    rn = n * r
    return float(min(1.0, math.exp(math.sqrt(1 + 4 * n + 4 * (n * n - rn * rn)) - (1 + 2 * n))))


def angulo(datas: pd.Series) -> np.ndarray:
    d = pd.to_datetime(datas)
    nd = np.where(d.dt.is_leap_year, 366, 365)
    return 2 * np.pi * (d.dt.dayofyear.to_numpy() - 0.5) / nd


def circular(ang: np.ndarray) -> tuple[float, float]:
    """(ângulo médio em [0, 2π), comprimento do vetor médio R)."""
    c, s = np.cos(ang).mean(), np.sin(ang).mean()
    return float(np.arctan2(s, c) % (2 * np.pi)), float(np.hypot(c, s))


def dia_do_ano(a: float) -> float:
    """Ângulo → dia do ano (1 a 365, num ano de 365 dias)."""
    return a / (2 * np.pi) * 365 + 0.5


def rotulo_dia(d: float) -> str:
    t = pd.Timestamp("2023-01-01") + pd.Timedelta(days=int(round(d)) - 1)
    return t.strftime("%d/%m")


LIM_DESLOC = [-60, -30, -10, 10, 30, 60]
CORES_DESLOC = ["#234e70", "#5b84a3", "#a8c1d3", "#f1f0ec", "#e2b6a3", "#c07a5f", "#9c4a32"]
ROTULOS_DESLOC = [
    ("mais de 60 dias antes", "over 60 days earlier"), ("30 a 60 dias antes", "30 to 60 days earlier"),
    ("10 a 30 dias antes", "10 to 30 days earlier"), ("até 10 dias de diferença", "within 10 days"),
    ("10 a 30 dias depois", "10 to 30 days later"), ("30 a 60 dias depois", "30 to 60 days later"),
    ("mais de 60 dias depois", "over 60 days later"),
]


def mes() -> None:
    f = focos()
    f["ang"] = angulo(f["data"])
    m = municipios()
    res = m[["CD_MUN", "NM_MUN", "NM_RGINT", "area_km2"]].copy().set_index("CD_MUN")
    estado = {}
    for (a0, a1) in (ANTES, DEPOIS):
        suf = f"{a0}_{a1}"
        k = f[f["ano"].between(a0, a1)]
        n = k.groupby("CD_MUN").size()
        res[f"focos_{suf}"] = n.reindex(res.index).fillna(0).astype(int)
        stats = k.groupby("CD_MUN")["ang"].apply(lambda x: circular(x.to_numpy()))
        ang = stats.map(lambda t: t[0]).reindex(res.index)
        r = stats.map(lambda t: t[1]).reindex(res.index)
        res[f"dia_medio_{suf}"] = dia_do_ano(ang).round(1)
        res[f"data_media_{suf}"] = [rotulo_dia(v) if pd.notna(v) else None for v in res[f"dia_medio_{suf}"]]
        res[f"concentracao_{suf}"] = r.round(3)
        res[f"p_rayleigh_{suf}"] = [rayleigh_p(int(nn), rr) if nn > 0 else None for nn, rr in zip(res[f"focos_{suf}"], r)]
        res[f"estacao_{suf}"] = (res[f"focos_{suf}"] >= MIN_FOCOS) & (res[f"p_rayleigh_{suf}"].fillna(1) < P_RAYLEIGH)
        a, rr = circular(k["ang"].to_numpy())
        meses = k["data"].str[5:7].astype(int).value_counts().reindex(range(1, 13), fill_value=0)
        estado[suf] = {
            "focos": int(len(k)), "dia_medio": round(dia_do_ano(a), 1), "data_media": rotulo_dia(dia_do_ano(a)),
            "concentracao": round(rr, 3), "meses": [int(v) for v in meses],
            "meses_pct": [round(float(v) / len(k) * 100, 2) for v in meses],
            "municipios_com_estacao": int(res[f"estacao_{suf}"].sum()),
            "municipios_poucos_focos": int((res[f"focos_{suf}"] < MIN_FOCOS).sum()),
            "municipios_sem_estacao": int(((res[f"focos_{suf}"] >= MIN_FOCOS) & ~res[f"estacao_{suf}"]).sum()),
        }
        print(f"  142 {suf}: {len(k)} focos · data média {estado[suf]['data_media']} · R {rr:.2f} · "
              f"{estado[suf]['municipios_com_estacao']} municípios com estação")
    sa, sd = (f"{a}_{b}" for a, b in (ANTES, DEPOIS))
    ambos = res[f"estacao_{sa}"] & res[f"estacao_{sd}"]
    desl = ((res[f"dia_medio_{sd}"] - res[f"dia_medio_{sa}"] + 182.5) % 365) - 182.5
    res["deslocamento_dias"] = desl.where(ambos).round(1)
    res["classe_deslocamento"] = [int(np.digitize(v, LIM_DESLOC)) if pd.notna(v) else None for v in res["deslocamento_dias"]]
    d = res.loc[ambos, "deslocamento_dias"]
    desloc = {
        "municipios": int(ambos.sum()), "mediana": round(float(d.median()), 1),
        "mais_tarde": int((d > 0).sum()), "mais_cedo": int((d < 0).sum()),
        "mais_de_10_tarde": int((d > 10).sum()), "mais_de_10_cedo": int((d < -10).sum()),
        "classes": [int((res["classe_deslocamento"] == i).sum()) for i in range(len(CORES_DESLOC))],
        "estado_dias": round(((estado[sd]["dia_medio"] - estado[sa]["dia_medio"] + 182.5) % 365) - 182.5, 1),
    }
    print(f"  deslocamento: {desloc['municipios']} municípios · mediana {desloc['mediana']} dias · "
          f"{desloc['mais_tarde']} mais tarde · estado {desloc['estado_dias']} dias")
    # O estado ano a ano: data média, concentração e a parte dos focos de maio a julho.
    por_ano = []
    for ano, g in f.groupby("ano"):
        a, rr = circular(g["ang"].to_numpy())
        mj = g["data"].str[5:7].isin(["05", "06", "07"]).mean()
        por_ano.append({"ano": int(ano), "focos": int(len(g)), "dia_medio": round(dia_do_ano(a), 1),
                        "data_media": rotulo_dia(dia_do_ano(a)), "concentracao": round(rr, 3),
                        "maio_julho_pct": round(float(mj) * 100, 1)})

    # Conferência: 2024 é o recorde da série; sem ele, 2020–2023 contra 2003–2006 (quatro anos cada).
    def resumo(a0: int, a1: int) -> dict:
        g = f[f["ano"].between(a0, a1)]
        a, rr = circular(g["ang"].to_numpy())
        ms = g["data"].str[5:7]
        return {"anos": f"{a0}_{a1}", "focos": int(len(g)), "dia_medio": round(dia_do_ano(a), 1),
                "data_media": rotulo_dia(dia_do_ano(a)), "concentracao": round(rr, 3),
                "ago_set_pct": round(float(ms.isin(["08", "09"]).mean()) * 100, 1),
                "maio_julho_pct": round(float(ms.isin(["05", "06", "07"]).mean()) * 100, 1)}
    sem_2024 = [resumo(2003, 2006), resumo(2020, 2023)]
    print("    sem 2024: " + " · ".join(f"{r['anos']} {r['data_media']} R {r['concentracao']:.2f} ago-set {r['ago_set_pct']} %" for r in sem_2024))

    # Paleta: uma cor por dia do ano (prancha); 24 quinzenas no estilo do QGIS.
    paleta = [ciclo((i + 0.5) / 365) for i in range(365)]
    m = m.merge(res.drop(columns=["NM_MUN", "NM_RGINT", "area_km2"]).reset_index(), on="CD_MUN")

    def regras_ciclo(campo: str, flag: str) -> list:
        q = f"&quot;{campo}&quot;"
        out = []
        for i in range(24):
            d0, d1 = i * 365 / 24 + 0.5, (i + 1) * 365 / 24 + 0.5
            filtro = f"&quot;{flag}&quot; AND {q} &gt;= {d0:.2f} AND {q} &lt; {d1:.2f}"
            mes_, quinz = divmod(i, 2)
            rot = f"{['1ª', '2ª'][quinz]} quinzena de {['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'][mes_]}"
            out.append((filtro, rot, preenchimento(ciclo((i + 0.5) / 24), "#ffffff", 0.05)))
        out.append((f"NOT &quot;{flag}&quot;", "poucos focos ou sem estação", preenchimento(SEM_INFO, "#c9ced3", 0.05)))
        return out

    regras_d = [(f"&quot;classe_deslocamento&quot; = {i}", ROTULOS_DESLOC[i][0], preenchimento(c, "#ffffff", 0.05))
                for i, c in enumerate(CORES_DESLOC)]
    regras_d.append(("&quot;classe_deslocamento&quot; IS NULL", "sem comparação", preenchimento(SEM_INFO, "#c9ced3", 0.05)))
    estilos = {
        "municipios": [
            (f"data_media_{sd}", f"Data média dos focos, {DEPOIS[0]}–{DEPOIS[1]}",
             estilo_regras("poligono", regras_ciclo(f"dia_medio_{sd}", f"estacao_{sd}")), True),
            (f"data_media_{sa}", f"Data média dos focos, {ANTES[0]}–{ANTES[1]}",
             estilo_regras("poligono", regras_ciclo(f"dia_medio_{sa}", f"estacao_{sa}")), False),
            ("deslocamento", "Deslocamento da data média (dias)", estilo_regras("poligono", regras_d), False),
        ],
        "focos": [("periodo", "Focos dos dois quinquênios",
                   estilo_regras("ponto", [(igual("periodo", f"{ANTES[0]}–{ANTES[1]}"), f"{ANTES[0]}–{ANTES[1]}", marcador("#234e70", 0.9, largura_borda=0.05, alfa=0.6)),
                                           (igual("periodo", f"{DEPOIS[0]}–{DEPOIS[1]}"), f"{DEPOIS[0]}–{DEPOIS[1]}", marcador("#9c4a32", 0.9, largura_borda=0.05, alfa=0.6))]), True)],
        "limite_estadual": [("limite", "Limite estadual", estilo_contorno(TINTA, 0.6), True)],
    }
    k = f[f["ano"].between(*ANTES) | f["ano"].between(*DEPOIS)].copy()
    k["periodo"] = np.where(k["ano"] <= ANTES[1], f"{ANTES[0]}–{ANTES[1]}", f"{DEPOIS[0]}–{DEPOIS[1]}")
    pts = k[["foco_id", "periodo", "ano", "data", "hora_utc", "lat", "lon", "CD_MUN", "NM_MUN", "geometry"]]
    lim = m.dissolve()[["geometry"]].assign(nome="São Paulo")
    tam = gravar("mes", {"municipios": m, "focos": pts, "limite_estadual": lim}, estilos, m.drop(columns="geometry"))

    def maior(campo: str) -> dict:
        r = res.loc[res[campo].idxmax()]
        return {"cd": r.name, "nome": r["NM_MUN"], "valor": float(r[campo]), "coord": coord(posicao(municipios())[r.name])}

    gravar_cache("fogo-sp-mes", {
        "periodos": {sa: estado[sa], sd: estado[sd]}, "antes": sa, "depois": sd,
        "min_focos": MIN_FOCOS, "p_rayleigh": P_RAYLEIGH,
        "deslocamento": desloc, "por_ano": por_ano, "sem_2024": sem_2024, "lim_desloc": LIM_DESLOC, "cores_desloc": CORES_DESLOC,
        "rotulos_desloc": ROTULOS_DESLOC, "paleta": paleta,
        "municipios": {cd: [None if pd.isna(r[f"dia_medio_{sa}"]) or not r[f"estacao_{sa}"] else float(r[f"dia_medio_{sa}"]),
                            None if pd.isna(r[f"dia_medio_{sd}"]) or not r[f"estacao_{sd}"] else float(r[f"dia_medio_{sd}"]),
                            None if pd.isna(r["classe_deslocamento"]) else int(r["classe_deslocamento"])]
                       for cd, r in res.iterrows()},
        "mais_tarde": maior("deslocamento_dias"),
        "arquivos": tam,
    })


# ------------------------------------------------------------------ 143 o fogo mudou de lugar
LIM_DIF = [-3, -1.5, -0.5, 0.5, 1.5, 3]
CORES_DIF = CORES_DESLOC
ROTULOS_DIF = [
    ("3 ou mais a menos", "3 or more fewer"), ("1,5 a 3 a menos", "1.5 to 3 fewer"), ("0,5 a 1,5 a menos", "0.5 to 1.5 fewer"),
    ("até 0,5 de diferença", "within 0.5"), ("0,5 a 1,5 a mais", "0.5 to 1.5 more"), ("1,5 a 3 a mais", "1.5 to 3 more"),
    ("3 ou mais a mais", "3 or more more"),
]
FAIXAS_CANA = [(0, 10, "menos de 10 %", "under 10%"), (10, 25, "10 a 25 %", "10 to 25%"),
               (25, 50, "25 a 50 %", "25 to 50%"), (50, 101, "50 % ou mais", "50% or more")]


CANA_ANO = RAIZ / "dados-brutos" / "mapbiomas" / "sp_cana_120m"  # animacoes/40-anos-de-cana/baixar.mjs (coleção 10)


def cana_por_ano(f: gpd.GeoDataFrame) -> list[dict]:
    """
    Teste de contexto da 143: em cada ano, a parte de cana na área do estado (mapa de cana daquele ano) e a parte
    de cana no km² em volta dos focos (janela de 9 × 9 células, como na 141). As células trazem a fração de cana
    em quartos, o que arredonda a área de cana para cima em ~2 %. Sem a pasta, devolve lista vazia.
    """
    import gzip

    from pyproj import Geod
    from rasterio.features import rasterize
    from rasterio.transform import Affine

    if not (CANA_ANO / "meta.json").exists():
        return []
    meta = json.loads((CANA_ANO / "meta.json").read_text(encoding="utf-8"))
    w, h = meta["largura"], meta["altura"]
    tr = Affine(meta["dx"], 0, meta["x0"], 0, -meta["dy"], meta["y0"])
    sp = rasterize([(g, 1) for g in municipios().geometry], out_shape=(h, w), transform=tr, fill=0, dtype="uint8") == 1
    geod = Geod(ellps="GRS80")
    lin = np.array([abs(geod.polygon_area_perimeter([0, meta["dx"], meta["dx"], 0],
                                                    [meta["y0"] - (r + 1) * meta["dy"]] * 2 + [meta["y0"] - r * meta["dy"]] * 2)[0])
                    for r in range(h)])
    peso = sp * lin[:, None]
    saida = []
    for ano in ANOS:
        q = np.frombuffer(gzip.decompress((CANA_ANO / f"{ano}.bin.gz").read_bytes()), dtype="uint8").reshape(h, w)
        frac = q.astype("float32") / 4
        k = f[f["ano"] == ano]
        ii = ((k["lon"].to_numpy() - tr.c) / tr.a).astype(int)
        jj = ((tr.f - k["lat"].to_numpy()) / -tr.e).astype(int)
        sob = []
        for y, x in zip(jj, ii):
            jan = frac[y - MEIA:y + MEIA + 1, x - MEIA:x + MEIA + 1]
            msk = sp[y - MEIA:y + MEIA + 1, x - MEIA:x + MEIA + 1]
            if msk.any():
                sob.append(float(jan[msk].mean()))
        area = float((frac * peso).sum() / peso.sum() * 100)
        sob_pct = float(np.mean(sob) * 100)
        saida.append({"ano": ano, "focos": int(len(k)), "cana_area_pct": round(area, 2),
                      "cana_sob_focos_pct": round(sob_pct, 2), "razao": round(sob_pct / area, 3)})
    print("    cana sob os focos ÷ cana na área: " + " ".join(f"{s['ano']}:{s['razao']:.2f}" for s in saida))
    return saida


def lugar() -> None:
    f = focos()
    m = municipios()
    pv = areas_mapbiomas()
    m["pct_cana_2024"] = (m["CD_MUN"].map(pv["cana"]) / m["CD_MUN"].map(pv.sum(axis=1)) * 100).round(1)
    m["faixa_cana"] = [next(i for i, (a, b, *_) in enumerate(FAIXAS_CANA) if a <= v < b) for v in m["pct_cana_2024"]]
    sa, sd = (f"{a}_{b}" for a, b in (ANTES, DEPOIS))
    for (a0, a1), suf in ((ANTES, sa), (DEPOIS, sd)):
        n = f[f["ano"].between(a0, a1)].groupby("CD_MUN").size()
        m[f"focos_{suf}"] = m["CD_MUN"].map(n).fillna(0).astype(int)
        m[f"focos_100km2_ano_{suf}"] = (m[f"focos_{suf}"] / (a1 - a0 + 1) / m["area_km2"] * 100).round(3)
    m["diferenca_100km2_ano"] = (m[f"focos_100km2_ano_{sd}"] - m[f"focos_100km2_ano_{sa}"]).round(3)
    m["razao"] = (m[f"focos_{sd}"] / m[f"focos_{sa}"].replace(0, np.nan)).round(3)
    m["classe_diferenca"] = np.digitize(m["diferenca_100km2_ano"], LIM_DIF).astype(int)
    area_tot = float(m["area_km2"].sum())
    na, nd = int(m[f"focos_{sa}"].sum()), int(m[f"focos_{sd}"].sum())
    print(f"  143: {sa} {na} focos ({na / 5 / area_tot * 100:.2f}/100 km²/ano) · {sd} {nd} ({nd / 5 / area_tot * 100:.2f})")

    # Por faixa de cana e por região intermediária; e o ano a ano de cada faixa.
    faixas = []
    for i, (a, b, r, r_en) in enumerate(FAIXAS_CANA):
        s = m[m["faixa_cana"] == i]
        anos = f[f["CD_MUN"].isin(s["CD_MUN"])].groupby("ano").size().reindex(ANOS, fill_value=0)
        faixas.append({"faixa": i, "rotulo": r, "rotulo_en": r_en, "municipios": int(len(s)),
                       "area_km2": round(float(s["area_km2"].sum()), 1),
                       "antes": int(s[f"focos_{sa}"].sum()), "depois": int(s[f"focos_{sd}"].sum()),
                       "dens_antes": round(float(s[f"focos_{sa}"].sum()) / 5 / float(s["area_km2"].sum()) * 100, 3),
                       "dens_depois": round(float(s[f"focos_{sd}"].sum()) / 5 / float(s["area_km2"].sum()) * 100, 3),
                       "anos_100km2": [round(float(v) / float(s["area_km2"].sum()) * 100, 3) for v in anos]})
        print(f"    cana {r}: {len(s)} mun · {faixas[-1]['antes']} → {faixas[-1]['depois']} focos")
    rg = m.groupby("NM_RGINT").agg(area_km2=("area_km2", "sum"), antes=(f"focos_{sa}", "sum"),
                                   depois=(f"focos_{sd}", "sum"), cana_km2=("CD_MUN", lambda s: float(pv["cana"].reindex(s).sum())))
    rg["razao"] = rg["depois"] / rg["antes"]
    sem24 = {}
    for nome, g in f.groupby("NM_RGINT"):
        sem24[nome] = round(float(g["ano"].between(2020, 2023).sum()) / float(g["ano"].between(2003, 2006).sum()), 3)
    regioes = [{"nome": k, "area_km2": round(float(r.area_km2), 1), "antes": int(r.antes), "depois": int(r.depois),
                "razao": round(float(r.razao), 3), "pct_cana": round(r.cana_km2 / r.area_km2 * 100, 1),
                "razao_sem_2024": sem24[k]} for k, r in rg.sort_values("razao").iterrows()]
    for r in regioes:
        print(f"    {r['nome']}: {r['antes']} → {r['depois']} (× {r['razao']:.2f}; sem 2024 × {r['razao_sem_2024']:.2f})")

    # A mancha de cana: municípios com metade ou mais da terra em cana em 2024.
    cint = m[m["faixa_cana"] == 3].dissolve()[["geometry"]].explode(index_parts=False).reset_index(drop=True)
    cint["descricao"] = "municípios com 50 % ou mais da terra em cana em 2024 (MapBiomas)"
    rgint = m.dissolve(by=["CD_RGINT", "NM_RGINT"], as_index=False)[["CD_RGINT", "NM_RGINT", "geometry"]]
    rgint = rgint.merge(pd.DataFrame(regioes).rename(columns={"nome": "NM_RGINT", "antes": f"focos_{sa}", "depois": f"focos_{sd}"})
                        .drop(columns="area_km2"), on="NM_RGINT")

    regras = [(f"&quot;classe_diferenca&quot; = {i}", f"{ROTULOS_DIF[i][0]} focos por 100 km² por ano", preenchimento(c, "#ffffff", 0.05))
              for i, c in enumerate(CORES_DIF)]
    estilos = {
        "municipios": [("diferenca", f"Focos por 100 km² por ano: {DEPOIS[0]}–{DEPOIS[1]} menos {ANTES[0]}–{ANTES[1]}",
                        estilo_regras("poligono", regras), True)],
        "cana_metade_ou_mais": [("cana", "Metade ou mais da terra em cana (2024)", estilo_contorno(TINTA, 0.5), True)],
        "regioes_intermediarias": [("rgint", "Regiões intermediárias", estilo_contorno("#1a211a", 0.35, "NM_RGINT"), True)],
    }
    cols = ["CD_MUN", "NM_MUN", "CD_RGINT", "NM_RGINT", "area_km2", "pct_cana_2024", "faixa_cana",
            f"focos_{sa}", f"focos_{sd}", f"focos_100km2_ano_{sa}", f"focos_100km2_ano_{sd}",
            "diferenca_100km2_ano", "razao", "classe_diferenca"]
    mm = m[cols + ["geometry"]].copy()
    mm["faixa_cana"] = mm["faixa_cana"].map(lambda i: FAIXAS_CANA[i][2])
    tam = gravar("lugar", {"municipios": mm, "cana_metade_ou_mais": cint, "regioes_intermediarias": rgint},
                 estilos, mm.drop(columns="geometry"))

    pos = posicao(m)
    idx = m.set_index("CD_MUN")

    def mun(cd: str) -> dict:
        r = idx.loc[cd]
        return {"cd": cd, "nome": r["NM_MUN"], "antes": int(r[f"focos_{sa}"]), "depois": int(r[f"focos_{sd}"]),
                "dens_antes": float(r[f"focos_100km2_ano_{sa}"]), "dens_depois": float(r[f"focos_100km2_ano_{sd}"]),
                "pct_cana": float(r["pct_cana_2024"]), "coord": coord(pos[cd])}

    ordem = m.sort_values("diferenca_100km2_ano")
    anos = f.groupby("ano").size().reindex(ANOS, fill_value=0)
    gravar_cache("fogo-sp-lugar", {
        "antes": sa, "depois": sd, "focos_antes": na, "focos_depois": nd, "area_km2": round(area_tot, 1),
        "dens_antes": round(na / 5 / area_tot * 100, 3), "dens_depois": round(nd / 5 / area_tot * 100, 3),
        "anos": {str(a): int(v) for a, v in anos.items()},
        "lim": LIM_DIF, "cores": CORES_DIF, "rotulos": ROTULOS_DIF,
        "classes": [int((m["classe_diferenca"] == i).sum()) for i in range(len(CORES_DIF))],
        "municipios": {r.CD_MUN: int(r.classe_diferenca) for r in m.itertuples()},
        "mais": int((m["diferenca_100km2_ano"] > 0).sum()), "menos": int((m["diferenca_100km2_ano"] < 0).sum()),
        "faixas": faixas, "regioes": regioes,
        "maiores_quedas": [mun(cd) for cd in ordem["CD_MUN"].head(5)],
        "maiores_altas": [mun(cd) for cd in ordem["CD_MUN"].tail(5)[::-1]],
        "cana_metade": para_d3(cint, [], tol=0.004, casas=4),
        "cana_ano": cana_por_ano(f),
        "arquivos": tam,
    })


TEMAS = {"agosto": agosto, "mes": mes, "lugar": lugar}

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("tema", choices=[*TEMAS, "todos"])
    a = ap.parse_args()
    for nome, fn in TEMAS.items():
        if a.tema in (nome, "todos"):
            print(f"· {nome}", flush=True)
            fn()
