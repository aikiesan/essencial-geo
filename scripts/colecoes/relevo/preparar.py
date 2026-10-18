"""
Coleção «Relevo paulista» — prepara os dados de uma prancha (uso interno).

    .venv-geo/Scripts/python scripts/colecoes/relevo/preparar.py mantiqueira|serra-do-mar|cuestas

Entrada: folhas do Copernicus DEM GLO-90 em scripts/colecoes/cache/downloads/copernicus/.
Saídas: mapas/<pasta>/dados/<base>.gpkg.zip (faixas de altitude, perfil e ponto mais alto, com estilos do QGIS),
<base>.tif.zip (modelo de elevação recortado, com estilo .qml), <base>_perfil.csv,
e no cache: grade-relevo-<area> (para a prancha), relevo-<area>-base.json e relevo-<area>.json.
"""

from __future__ import annotations

import argparse
import json
import sys
import zipfile
from pathlib import Path

import geopandas as gpd
import numpy as np
import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from comum import (  # noqa: E402
    AREA_BR, GEO, MINERAIS, RAIZ, TINTA, base_regional, caixa_quadro, estilo_contorno, estilo_regras, gravar_cache,
    gravar_estilos, gravar_grade, igual, linha, malha_uf, marcador, preenchimento, zipar,
)

DL = RAIZ / "scripts" / "colecoes" / "cache" / "downloads" / "copernicus"
SERIE = json.loads((Path(__file__).parent / "serie.json").read_text(encoding="utf-8"))

# Rampa hipsométrica da coleção (m → cor): verdes baixos, palhas e terras no meio, névoa no alto.
RAMPA = [
    (0, "#cfdcc5"), (200, "#dbe3c4"), (500, "#e6e2b8"), (800, "#e2cf9e"), (1100, "#d1b184"),
    (1400, "#bb946c"), (1800, "#a07a62"), (2200, "#8c6e66"), (2800, "#efe9e3"),
]

AREAS = {
    "mantiqueira": {
        "sigla": "MANTIQUEIRA", "centro": (-45.2, -22.68), "altura_km": 105, "passo": 0.25,
        "perfil": [(-45.10, -22.83), (-44.79, -22.36)], "faixas": list(range(500, 2801, 200)),
        "capital": {"nome": "Campos do Jordão", "coord": [-45.5911, -22.7394]},
        "rotulos": [["MINAS GERAIS", "MINAS GERAIS", [-45.25, -22.32]], ["RIO DE JANEIRO", "RIO DE JANEIRO", [-44.72, -22.75]]],
        "picos": {"Pedra da Mina": (-44.840, -22.426)},
        "limiar": 1500,
    },
    "serra-do-mar": {
        "sigla": "SERRA DO MAR", "centro": (-46.35, -23.85), "altura_km": 80, "passo": 0.25,
        "perfil": [(-46.33, -23.985), (-46.53, -23.72)], "faixas": [0, 20, 100, 200, 400, 600, 700, 800, 900, 1000, 1200],
        "capital": {"nome": "Santos", "coord": [-46.3336, -23.9608]},
        "oceano": [-46.05, -24.12], "rotulos": [],
        "picos": {},
        "limiar": 700,
    },
    "cuestas": {
        "sigla": "CUESTAS", "centro": (-48.15, -22.62), "altura_km": 125, "passo": 0.25,
        "perfil": [(-48.08, -22.596), (-47.62, -22.306)], "faixas": list(range(400, 1201, 100)),
        "capital": {"nome": "Botucatu", "coord": [-48.4450, -22.8858]},
        "rotulos": [], "picos": {},
        "limiar": 800,
    },
}
NODATA = -32768


def mosaico(bounds: tuple[float, float, float, float]):
    import rasterio
    from rasterio.merge import merge

    x0, y0, x1, y1 = bounds
    folhas = []
    for f in sorted(DL.glob("Copernicus_DSM_COG_30_*_DEM.tif")):
        with rasterio.open(f) as s:
            b = s.bounds
            if b.left < x1 and b.right > x0 and b.bottom < y1 and b.top > y0:
                folhas.append(f)
    srcs = [rasterio.open(f) for f in folhas]
    try:
        arr, tr = merge(srcs, bounds=bounds, nodata=np.nan, dtype="float32")
    finally:
        for s in srcs:
            s.close()
    a = arr[0]
    dem = np.where(np.isnan(a), NODATA, np.round(np.maximum(a, 0))).astype("int16")
    return dem, tr, [f.name for f in folhas]


def amostrar(dem, tr, lon, lat):
    from scipy.ndimage import map_coordinates
    col = (np.asarray(lon) - tr.c) / tr.a - 0.5
    lin = (np.asarray(lat) - tr.f) / tr.e - 0.5
    return map_coordinates(dem.astype("float32"), [lin, col], order=1, mode="nearest")


def qml_relevo(paradas: list[tuple[int, str]], zmin: float, zmax: float) -> str:
    itens = "\n".join(f'          <item value="{v}" color="{c}" alpha="255" label="{v} m"/>' for v, c in paradas)
    return f"""<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis version="3.34" styleCategories="AllStyleCategories">
  <pipe>
    <rasterrenderer type="singlebandpseudocolor" band="1" opacity="1" alphaBand="-1" classificationMin="{zmin}" classificationMax="{zmax}" nodataColor="">
      <rasterTransparency/>
      <rastershader>
        <colorrampshader colorRampType="INTERPOLATED" classificationMode="1" clip="0" minimumValue="{zmin}" maximumValue="{zmax}">
{itens}
        </colorrampshader>
      </rastershader>
    </rasterrenderer>
    <brightnesscontrast brightness="0" contrast="0" gamma="1"/>
    <huesaturation saturation="0" grayscaleMode="0" colorizeOn="0"/>
    <rasterresampler maxOversample="2" zoomedInResampler="bilinear"/>
  </pipe>
  <blendMode>0</blendMode>
</qgis>
"""


def cor_rampa(v: float) -> str:
    for (v0, c0), (v1, c1) in zip(RAMPA, RAMPA[1:]):
        if v <= v1:
            t = max(0.0, (v - v0) / (v1 - v0))
            a = [int(c0[k:k + 2], 16) for k in (1, 3, 5)]
            b = [int(c1[k:k + 2], 16) for k in (1, 3, 5)]
            return "#" + "".join(f"{round(x + (y - x) * t):02x}" for x, y in zip(a, b))
    return RAMPA[-1][1]


def preparar(area: str) -> None:
    import rasterio
    from pyproj import Geod
    from rasterio.features import shapes
    from rasterio.mask import mask as rmask  # noqa: F401
    from shapely.geometry import LineString, Point, shape

    cfg = AREAS[area]
    e = next(s for s in SERIE if s["tema"] == area)
    lon0, lat0 = cfg["centro"]
    quadro = caixa_quadro(lon0, lat0, cfg["altura_km"])
    janela = caixa_quadro(lon0, lat0, cfg["altura_km"], folga=0.08)
    x0, y0, x1, y1 = janela.total_bounds
    dem, tr, folhas = mosaico((x0, y0, x1, y1))
    gravar_grade(f"grade-relevo-{area}", dem, tr, nodata=NODATA)
    base_regional(f"relevo-{area}", cfg["sigla"], centro=cfg["centro"], altura_km=cfg["altura_km"], passo=cfg["passo"],
                  rotulos=cfg["rotulos"], capital=cfg["capital"], oceano=cfg.get("oceano", [lon0 + 5, lat0 - 5]),
                  rotular_unidades=True)

    # Estatísticas dentro do quadro, só em terra (> 0).
    from rasterio.features import geometry_mask
    dentro = geometry_mask([quadro.iloc[0]], out_shape=dem.shape, transform=tr, invert=True)
    terra = dentro & (dem > 0) & (dem != NODATA)
    z = dem[terra]
    jj, ii = np.unravel_index(np.argmax(np.where(terra, dem, -1)), dem.shape)
    alto = [round(tr.c + (ii + 0.5) * tr.a, 4), round(tr.f + (jj + 0.5) * tr.e, 4)]
    nome_alto = next((n for n, (px, py) in cfg["picos"].items() if abs(px - alto[0]) < 0.02 and abs(py - alto[1]) < 0.02), None)
    jb, ib = np.unravel_index(np.argmin(np.where(terra, dem, 32767)), dem.shape)
    sp = malha_uf("SP")
    sp_lim = sp.dissolve()[["geometry"]]
    no_sp = geometry_mask([sp_lim.geometry.iloc[0]], out_shape=dem.shape, transform=tr, invert=True)
    z_sp = dem[terra & no_sp]
    j_sp, i_sp = np.unravel_index(np.argmax(np.where(terra & no_sp, dem, -1)), dem.shape)
    alto_sp = [round(tr.c + (i_sp + 0.5) * tr.a, 4), round(tr.f + (j_sp + 0.5) * tr.e, 4)]
    hist = {int(f): round(float((z >= f).mean() * 100), 1) for f in cfg["faixas"]}

    # Perfil A → B: 600 pontos, distância geodésica.
    (ax, ay), (bx, by) = cfg["perfil"]
    n = 600
    lons = np.linspace(ax, bx, n)
    lats = np.linspace(ay, by, n)
    zs = amostrar(dem, tr, lons, lats)
    zs = np.maximum(zs, 0)
    g = Geod(ellps="GRS80")
    _, _, dist = g.inv(np.full(n, ax), np.full(n, ay), lons, lats)
    km = dist / 1000
    passo_km = km[1] - km[0]
    w = max(1, int(round(5 / passo_km)))
    desniveis = np.array([zs[i:i + w + 1].max() - zs[i:i + w + 1].min() for i in range(n - w)])
    k = int(np.argmax(desniveis))
    seg = zs[k:k + w + 1]
    i_lo, i_hi = k + int(np.argmin(seg)), k + int(np.argmax(seg))
    subida = {"desnivel_m": int(round(desniveis[k])), "km": 5, "coord": [round(float(lons[i_hi]), 4), round(float(lats[i_hi]), 4)],
              "de_km": round(float(km[min(i_lo, i_hi)]), 1), "ate_km": round(float(km[max(i_lo, i_hi)]), 1)}

    mun_de = lambda xy: next(iter(sp[sp.contains(Point(xy))]["NM_MUN"]), None)  # noqa: E731
    subida["municipio"] = mun_de(subida["coord"])

    # Faixas de altitude em vetor, a partir da grade reduzida a 180 m (média 2 × 2), recortada no quadro.
    h2, w2 = dem.shape[0] // 2 * 2, dem.shape[1] // 2 * 2
    d = dem[:h2, :w2].astype("float32")
    d[d == NODATA] = np.nan
    d2 = np.nanmean(d.reshape(h2 // 2, 2, w2 // 2, 2), axis=(1, 3))
    tr2 = tr * tr.scale(2, 2)
    lim = cfg["faixas"]
    cls = np.digitize(np.nan_to_num(d2, nan=-1), lim).astype("int16")  # 0 = abaixo do 1º limite
    cls[np.isnan(d2) | (d2 < 1)] = -1  # mar (0 no Copernicus) fica de fora
    ms = geometry_mask([quadro.iloc[0]], out_shape=d2.shape, transform=tr2, invert=True)
    polys = [(shape(gg), int(v)) for gg, v in shapes(cls, mask=ms & (cls >= 0), transform=tr2)]
    fx = gpd.GeoDataFrame({"classe": [v for _, v in polys]}, geometry=[p for p, _ in polys], crs=GEO)
    fx = fx.dissolve(by="classe", as_index=False)
    fx["geometry"] = fx.geometry.simplify(0.0006, preserve_topology=True)
    bordas = [0] + lim
    fx["min_m"] = [bordas[c] if c < len(bordas) else lim[-1] for c in fx["classe"]]
    fx["max_m"] = [lim[c] if c < len(lim) else None for c in fx["classe"]]
    fx["max_m"] = fx["max_m"].astype("Int64")
    fx["rotulo"] = [f"{int(a)}–{int(b)} m" if not pd.isna(b) else f"acima de {int(a)} m" for a, b in zip(fx["min_m"], fx["max_m"])]
    if lim[0] > 0:
        fx.loc[fx["classe"] == 0, "rotulo"] = f"abaixo de {lim[0]} m"
    fx["cor"] = [cor_rampa((int(a) + (int(b) if not pd.isna(b) else int(a) + 200)) / 2) for a, b in zip(fx["min_m"], fx["max_m"])]
    fx["area_km2"] = (fx.to_crs(AREA_BR).area / 1e6).round(1)

    destino = RAIZ / "mapas" / e["pasta"] / "dados"
    destino.mkdir(parents=True, exist_ok=True)
    nome = e["base"]
    perfil_g = gpd.GeoDataFrame({"de": ["A"], "para": ["B"], "comp_km": [round(float(km[-1]), 1)]},
                                geometry=[LineString(cfg["perfil"])], crs=GEO)
    pico = gpd.GeoDataFrame({"altitude_m": [int(dem[jj, ii])], "nome": [nome_alto or ""]}, geometry=[Point(alto)], crs=GEO)
    municipios = sp[sp.intersects(quadro.iloc[0])][["CD_MUN", "NM_MUN", "geometry"]].copy()
    municipios["geometry"] = municipios.intersection(quadro.iloc[0])
    camadas = {
        "faixas_altitude": fx[["classe", "min_m", "max_m", "rotulo", "area_km2", "geometry"]],
        "perfil": perfil_g,
        "ponto_mais_alto": pico,
        "municipios": municipios,
    }
    regras = [(igual("classe", int(c)), r, preenchimento(cor, cor, 0)) for c, r, cor in zip(fx["classe"], fx["rotulo"], fx["cor"])]
    estilos = {
        "faixas_altitude": [("altitude", "Faixas de altitude", estilo_regras("poligono", regras), True)],
        "perfil": [("perfil", "Linha do perfil", estilo_regras("linha", [("TRUE", "Perfil A–B", linha(TINTA, 0.5, "2;1"))]), True)],
        "ponto_mais_alto": [("pico", "Ponto mais alto", estilo_regras("ponto", [("TRUE", "Ponto mais alto", marcador(TINTA, 2.6, forma="triangle"))]), True)],
        "municipios": [("contorno", "Municípios paulistas", estilo_contorno(TINTA, 0.3, "NM_MUN", alfa=0.6), True)],
    }
    gpkg = destino / f"{nome}.gpkg"
    gpkg.unlink(missing_ok=True)
    for c, gdf in camadas.items():
        gdf.to_file(gpkg, layer=c, driver="GPKG", engine="pyogrio")
    gravar_estilos(gpkg, estilos)
    zg = zipar(gpkg)

    # GeoTIFF recortado no quadro (com folga), com o estilo hipsométrico.
    tif = destino / f"{nome}.tif"
    prof = {"driver": "GTiff", "dtype": "int16", "count": 1, "height": dem.shape[0], "width": dem.shape[1], "crs": "EPSG:4674",
            "transform": tr, "nodata": NODATA, "compress": "deflate", "predictor": 2, "tiled": True}
    with rasterio.open(tif, "w", **prof) as o:
        o.write(dem, 1)
    zmax = int(z.max())
    qml = tif.with_suffix(".qml")
    qml.write_text(qml_relevo([(v, c) for v, c in RAMPA if v <= zmax + 400], 0, zmax), encoding="utf-8")
    zt = destino / f"{nome}.tif.zip"
    with zipfile.ZipFile(zt, "w", zipfile.ZIP_DEFLATED) as zz:
        zz.write(tif, tif.name)
        zz.write(qml, qml.name)
    tif.unlink()
    qml.unlink()
    csv = destino / f"{nome}_perfil.csv"
    pd.DataFrame({"km": km.round(3), "lon": lons.round(5), "lat": lats.round(5), "altitude_m": zs.round(0).astype(int)}).to_csv(csv, index=False)

    tam = {zg.name: zg.stat().st_size, zt.name: zt.stat().st_size, csv.name: csv.stat().st_size}
    gravar_cache(f"relevo-{area}", {
        "rampa": RAMPA, "faixas": lim,
        "alto": {"z": int(dem[jj, ii]), "coord": alto, "nome": nome_alto, "municipio": mun_de(alto)},
        "alto_sp": {"z": int(dem[j_sp, i_sp]), "coord": alto_sp},
        "baixo": {"z": int(dem[jb, ib])},
        "amplitude": int(z.max() - z.min()),
        "media": int(round(float(z.mean()))),
        "pct_acima": hist, "limiar": cfg["limiar"], "pct_limiar": round(float((z >= cfg["limiar"]).mean() * 100), 1),
        "pct_limiar_sp": round(float((z_sp >= cfg["limiar"]).mean() * 100), 1),
        "area_km2": round(float(gpd.GeoSeries([quadro.iloc[0]], crs=GEO).to_crs(AREA_BR).area.iloc[0] / 1e6), 0),
        "perfil": [[round(float(a), 2), int(round(float(b)))] for a, b in zip(km[::3], zs[::3])],
        "perfil_ab": [list(p) for p in cfg["perfil"]],
        "perfil_km": round(float(km[-1]), 1),
        "subida": subida,
        "folhas": folhas,
        "faixas_area": fx[["classe", "rotulo", "area_km2", "cor"]].to_dict("records"),
        "tamanhos": tam,
    })
    print(area, folhas, dem.shape)
    print("alto", int(dem[jj, ii]), alto, nome_alto, "alto_sp", int(dem[j_sp, i_sp]), alto_sp, "baixo", int(dem[jb, ib]),
          "media", int(z.mean()), "limiar", cfg["limiar"], round(float((z >= cfg["limiar"]).mean() * 100), 1))
    print("perfil", round(float(km[-1]), 1), "km; subida", subida, tam)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("area", choices=list(AREAS))
    preparar(ap.parse_args().area)
