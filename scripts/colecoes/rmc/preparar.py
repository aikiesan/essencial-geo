"""
Coleção «RMC» (Região Metropolitana de Campinas) — prepara os dados de uma prancha (uso interno).

    .venv-geo/Scripts/python scripts/colecoes/rmc/preparar.py base|uso|domicilios|renda|app

Entradas em scripts/colecoes/cache/downloads/ (mapbiomas, ibge, fbds). Saídas: mapas/<pasta>/dados/
(GPKG com estilos do QGIS, CSV e, no uso da terra, o GeoTIFF com o estilo .qml ao lado, num ZIP)
e scripts/colecoes/cache/rmc-<tema>.json (para a prancha e a ficha).
"""

from __future__ import annotations

import argparse
import sys
import zipfile
from pathlib import Path

import geopandas as gpd
import numpy as np
import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from comum import (  # noqa: E402
    AREA_BR, CACHE, GEO, MALHA, MINERAIS, RAIZ, TINTA, base_regional, estilo_contorno, estilo_graduado, estilo_regras,
    gravar_cache, gravar_estilos, gravar_grade, igual, km2, km_geodesico, linha, marcador, para_d3, preenchimento, quebras,
    zipar,
)

PASTAS = {
    "uso": "032-uso-da-terra-rmc",
    "domicilios": "033-domicilios-rmc",
    "renda": "034-renda-rmc",
    "app": "035-apps-campinas",
}
DL = CACHE / "downloads"
# Os 20 municípios da RMC (Lei Complementar estadual 870/2000, com Morungaba desde 2014).
RMC = ["3501608", "3503802", "3509502", "3512803", "3515152", "3519055", "3519071", "3520509", "3523404", "3524709",
       "3531803", "3532009", "3533403", "3536505", "3537107", "3545803", "3548005", "3552403", "3556206", "3556701"]
CAMPINAS = "3509502"
SEDE_CAMPINAS = {"nome": "Campinas", "coord": [-47.0608, -22.9056]}  # Catedral Metropolitana


def municipios_rmc() -> gpd.GeoDataFrame:
    m = gpd.read_file(MALHA, engine="pyogrio").set_crs(GEO, allow_override=True)
    r = m[m["CD_MUN"].isin(RMC)][["CD_MUN", "NM_MUN", "geometry"]].reset_index(drop=True)
    assert len(r) == 20
    return r


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


# ------------------------------------------------------------------ base
def base() -> None:
    base_regional("rmc", "RMC", cds=RMC, rotular_unidades=True, capital=SEDE_CAMPINAS, passo=0.25)
    base_regional("campinas", "CAMPINAS", cds=[CAMPINAS], capital=SEDE_CAMPINAS, passo=0.1)
    print("bases ok")


# ------------------------------------------------------------------ 1/4 uso e cobertura da terra
# Classes da prancha a partir da legenda da Coleção 10 do MapBiomas (código → grupo).
GRUPOS = [  # (chave, rótulo, rótulo EN, cor, códigos)
    ("floresta", "Formação florestal", "Forest", MINERAIS["verde_mata"], [3, 4, 5, 6, 49]),
    ("campo", "Campo e área úmida", "Grassland and wetland", "#a9b287", [11, 12, 29, 32, 50]),
    ("silvicultura", "Silvicultura", "Tree plantation", MINERAIS["oliva"], [9]),
    ("pastagem", "Pastagem", "Pasture", MINERAIS["palha"], [15]),
    ("mosaico", "Mosaico de usos", "Mosaic of uses", "#ece3c2", [21]),
    ("cana", "Cana", "Sugarcane", MINERAIS["ocre"], [20]),
    ("lavouras", "Soja e outras lavouras", "Soy and other crops", MINERAIS["argila"], [39, 40, 41, 46, 47, 48, 62, 35, 36]),
    ("urbano", "Área urbanizada", "Urban area", MINERAIS["grafite"], [24]),
    ("agua", "Água", "Water", MINERAIS["azul_profundo"], [33, 31]),
    ("outras", "Mineração e outras áreas sem vegetação", "Mining and other non-vegetated areas", MINERAIS["ameixa"], [25, 30, 23]),
]
NOMES_MB = {3: "Formação Florestal", 4: "Formação Savânica", 9: "Silvicultura", 11: "Campo Alagado e Área Pantanosa",
            12: "Formação Campestre", 15: "Pastagem", 20: "Cana", 21: "Mosaico de Usos", 24: "Área Urbanizada",
            25: "Outras Áreas não Vegetadas", 29: "Afloramento Rochoso", 30: "Mineração", 31: "Aquicultura",
            33: "Rio, Lago e Oceano", 39: "Soja", 41: "Outras Lavouras Temporárias", 46: "Café", 47: "Citrus",
            48: "Outras Lavouras Perenes"}


def area_linhas(transform, altura: int) -> np.ndarray:
    """Área (km²) de um pixel em cada linha da grade em graus, no elipsoide GRS80."""
    from pyproj import Geod
    g = Geod(ellps="GRS80")
    dx, dy = transform.a, -transform.e
    out = np.empty(altura)
    for j in range(altura):
        lat0 = transform.f - j * dy
        lat1 = lat0 - dy
        a, _ = g.polygon_area_perimeter([0, dx, dx, 0], [lat1, lat1, lat0, lat0])
        out[j] = abs(a) / 1e6
    return out


def qml_paletado(entradas: list[tuple[int, str, str]]) -> str:
    linhas = "\n".join(f'        <paletteEntry value="{v}" color="{c}" alpha="255" label="{r}"/>' for v, c, r in entradas)
    return f"""<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis version="3.34" styleCategories="AllStyleCategories">
  <pipe>
    <rasterrenderer type="paletted" band="1" opacity="1" alphaBand="-1" nodataColor="">
      <rasterTransparency/>
      <colorPalette>
{linhas}
      </colorPalette>
    </rasterrenderer>
  </pipe>
</qgis>
"""


def uso() -> None:
    import rasterio
    from rasterio.features import rasterize
    from scipy import ndimage

    mun = municipios_rmc()
    with rasterio.open(DL / "mapbiomas" / "rmc_coverage_2024.tif") as s:
        a = s.read(1)
        tr = s.transform
        prof = s.profile.copy()
    idx = rasterize([(g, i + 1) for i, g in enumerate(mun.geometry)], out_shape=a.shape, transform=tr, fill=0, dtype="uint8")
    dentro = idx > 0
    area_px = area_linhas(tr, a.shape[0])[:, None] * np.ones((1, a.shape[1]))
    grupo_de = {c: k for k, *_ , cods in GRUPOS for c in cods}
    codigos = np.unique(a[dentro])
    sem_grupo = [int(c) for c in codigos if c and int(c) not in grupo_de]
    assert not sem_grupo, f"códigos sem grupo: {sem_grupo}"

    # Área por grupo, no conjunto e por município.
    total = area_px[dentro].sum()
    linhas_mun = []
    for i, r in mun.iterrows():
        sel = idx == i + 1
        am = area_px[sel].sum()
        d = {"CD_MUN": r.CD_MUN, "NM_MUN": r.NM_MUN, "area_km2": round(am, 2)}
        for k, *_ , cods in GRUPOS:
            v = area_px[sel & np.isin(a, cods)].sum()
            d[f"km2_{k}"] = round(v, 2)
            d[f"pct_{k}"] = round(v / am * 100, 2)
        linhas_mun.append(d)
    tab = pd.DataFrame(linhas_mun)
    grupos = []
    for k, rot, rot_en, cor, cods in GRUPOS:
        v = area_px[dentro & np.isin(a, cods)].sum()
        grupos.append({"chave": k, "rotulo": rot, "rotulo_en": rot_en, "cor": cor, "codigos": cods,
                       "km2": round(v, 2), "pct": round(v / total * 100, 2)})

    # Maior fragmento de floresta (8 vizinhos), dentro da RMC.
    flo = dentro & np.isin(a, [3, 4])
    lab, n = ndimage.label(flo, structure=np.ones((3, 3)))
    areas = ndimage.sum(area_px, lab, index=np.arange(1, n + 1))
    k = int(np.argmax(areas)) + 1
    jj, ii = np.nonzero(lab == k)
    lon_c = tr.c + (ii.mean() + 0.5) * tr.a
    lat_c = tr.f + (jj.mean() + 0.5) * tr.e
    mun_frag = mun.iloc[np.bincount(idx[lab == k]).argmax() - 1].NM_MUN
    frag = {"km2": round(float(areas[k - 1]), 2), "coord": [round(lon_c, 4), round(lat_c, 4)], "municipio": mun_frag,
            "n_fragmentos": int(n), "frag_maior_1km2": int((areas >= 1).sum())}

    # Grade para a prancha (a janela inteira, para os vizinhos também) e GeoTIFF recortado na RMC.
    gravar_grade("grade-rmc-uso", a, tr, nodata=0)
    destino = RAIZ / "mapas" / PASTAS["uso"] / "dados"
    destino.mkdir(parents=True, exist_ok=True)
    tif = destino / "rmc_uso_cobertura_2024.tif"
    prof.update(driver="GTiff", compress="deflate", tiled=True, blockxsize=256, blockysize=256, nodata=0)
    with rasterio.open(tif, "w", **prof) as o:
        o.write(np.where(dentro, a, 0).astype("uint8"), 1)
    cor_de = {c: cor for _, _, _, cor, cods in GRUPOS for c in cods}
    qml = tif.with_suffix(".qml")
    qml.write_text(qml_paletado([(int(c), cor_de[int(c)], f"{int(c)} · {NOMES_MB.get(int(c), str(int(c)))}")
                                 for c in codigos if c]), encoding="utf-8")
    zp = destino / "rmc_uso_cobertura_2024.tif.zip"
    with zipfile.ZipFile(zp, "w", zipfile.ZIP_DEFLATED) as z:
        z.write(tif, tif.name)
        z.write(qml, qml.name)
    tif.unlink()
    qml.unlink()

    camadas = {
        "municipios": gpd.GeoDataFrame(tab.merge(mun[["CD_MUN", "geometry"]], on="CD_MUN"), geometry="geometry", crs=GEO),
        "limite_rmc": mun.dissolve()[["geometry"]].assign(nome="Região Metropolitana de Campinas"),
    }
    lim_urb = quebras(tab["pct_urbano"], 5)
    estilos = {
        "municipios": [
            ("urbano", "Parte urbanizada do município (%)", estilo_graduado("pct_urbano", lim_urb, ["#e4e5e6", "#c3c6c9", "#9a9fa4", "#6f757b", MINERAIS["grafite"]], casas=0, rotulo_campo="NM_MUN"), True),
            ("floresta", "Parte em formação florestal (%)", estilo_graduado("pct_floresta", quebras(tab["pct_floresta"], 5), ["#e6ece4", "#bccbb9", "#8ea98b", "#5f8462", MINERAIS["verde_mata"]], casas=0, rotulo_campo="NM_MUN"), False),
        ],
        "limite_rmc": [("limite", "Limite da RMC", estilo_contorno(TINTA, 0.6), True)],
    }
    tam = gravar("uso", "rmc_uso_cobertura_2024", camadas, estilos, tab)
    tam[zp.name] = zp.stat().st_size
    tab_o = tab.sort_values("pct_urbano", ascending=False)
    gravar_cache("rmc-uso", {
        "total_km2": round(total, 2), "grupos": grupos, "fragmento": frag,
        "municipios": tab_o[["CD_MUN", "NM_MUN", "area_km2", "pct_urbano", "pct_floresta", "pct_cana", "pct_mosaico", "pct_pastagem"]].to_dict("records"),
        "tamanhos": tam,
    })
    print(round(total, 1), [(g["chave"], g["pct"]) for g in grupos], frag, tam)


# ------------------------------------------------------------------ setores do Censo 2022
def setores_rmc() -> gpd.GeoDataFrame:
    s = gpd.read_file(DL / "ibge" / "SP_setores_CD2022.gpkg", engine="pyogrio", where=f"CD_MUN IN ({','.join(repr(c) for c in RMC)})")
    s = s.to_crs(GEO)
    assert s["CD_MUN"].nunique() == 20
    for c in ["v0001", "v0002", "v0003", "v0007"]:
        s[c] = pd.to_numeric(s[c], errors="coerce")
    s["AREA_KM2"] = pd.to_numeric(s["AREA_KM2"], errors="coerce")
    return s


def domicilios() -> None:
    s = setores_rmc()
    s["dom_km2"] = (s["v0007"] / s["AREA_KM2"]).where(s["AREA_KM2"] > 0)
    lim = [100, 1000, 2500, 5000, 10000]
    cores = ["#fde725", "#7ad151", "#22a884", "#2a788e", "#414487", "#440154"]
    com = s[s["v0007"] > 0]
    por_mun = s.groupby(["CD_MUN", "NM_MUN"], as_index=False).agg(domicilios=("v0007", "sum"), pessoas=("v0001", "sum"), area_km2=("AREA_KM2", "sum"), setores=("CD_SETOR", "count"))
    por_mun["dom_km2"] = por_mun["domicilios"] / por_mun["area_km2"]
    # Quanto do território concentra metade dos domicílios: setores do mais denso ao menos denso.
    o = com.sort_values("dom_km2", ascending=False)
    acum = o["v0007"].cumsum() / o["v0007"].sum()
    metade_km2 = float(o.loc[acum <= 0.5, "AREA_KM2"].sum())
    camadas = {
        "setores": s[["CD_SETOR", "CD_MUN", "NM_MUN", "NM_BAIRRO", "SITUACAO", "AREA_KM2", "v0001", "v0007", "dom_km2", "geometry"]].rename(columns={
            "SITUACAO": "situacao", "AREA_KM2": "area_km2", "v0001": "pessoas", "v0007": "domicilios_ocupados"}),
        "municipios": gpd.GeoDataFrame(por_mun.merge(municipios_rmc()[["CD_MUN", "geometry"]], on="CD_MUN"), geometry="geometry", crs=GEO),
    }
    estilos = {
        "setores": [("densidade", "Domicílios ocupados por km²", estilo_graduado("dom_km2", lim, cores, casas=0), True)],
        "municipios": [("contorno", "Municípios da RMC", estilo_contorno(TINTA, 0.5, "NM_MUN"), True)],
    }
    csv = camadas["setores"].drop(columns="geometry")
    tam = gravar("domicilios", "rmc_domicilios_2022", camadas, estilos, csv)
    s_d3 = s.assign(d=s["dom_km2"].round(1))[["CD_SETOR", "d", "geometry"]]
    gravar_cache("rmc-domicilios", {
        "setores": para_d3(s_d3, ["CD_SETOR", "d"], tol=0.00008, casas=5, cobertura=False),
        "limites": lim, "cores": cores,
        "n_setores": int(len(s)), "domicilios": int(s["v0007"].sum()), "pessoas": int(s["v0001"].sum()),
        "area_km2": round(float(s["AREA_KM2"].sum()), 1), "metade_km2": round(metade_km2, 1),
        "sem_domicilio": int((s["v0007"] == 0).sum()),
        "setores_por_classe": np.bincount(np.digitize(com["dom_km2"], lim, right=True), minlength=6).tolist(),
        "dom_por_classe": [int(com.loc[np.digitize(com["dom_km2"], lim, right=True) == i, "v0007"].sum()) for i in range(6)],
        "por_municipio": por_mun.sort_values("domicilios", ascending=False).round(1).to_dict("records"),
        "tamanhos": tam,
    })
    print(len(s), int(s["v0007"].sum()), round(metade_km2, 1), por_mun.sort_values("dom_km2").iloc[-1].to_dict(), tam)


def renda() -> None:
    s = setores_rmc()
    with zipfile.ZipFile(DL / "ibge" / "renda_setores.zip") as z:
        nome = z.namelist()[0]
        r = pd.read_csv(z.open(nome), sep=";", dtype=str, encoding="latin1")
    r = r[r["CD_SETOR"].isin(s["CD_SETOR"])]
    for c in ["V06001", "V06002", "V06004", "V06006"]:
        r[c] = pd.to_numeric(r[c].str.replace(",", "."), errors="coerce")
    s = s.merge(r[["CD_SETOR", "V06001", "V06002", "V06004", "V06006"]], on="CD_SETOR", how="left")
    s = s.rename(columns={"V06001": "responsaveis", "V06002": "moradores", "V06004": "renda_media", "V06006": "renda_mediana"})
    SM = 1212  # salário mínimo de 2022, referência do Censo (R$)
    lim = [SM, 1.5 * SM, 2 * SM, 3 * SM, 5 * SM]
    cores = ["#fde725", "#7ad151", "#22a884", "#2a788e", "#414487", "#440154"]
    com = s[s["renda_mediana"].notna()]
    cls = np.digitize(com["renda_mediana"], lim, right=True)
    resp_por_classe = [int(com.loc[cls == i, "responsaveis"].sum()) for i in range(6)]
    alto = com.sort_values("renda_mediana", ascending=False).iloc[0]
    camadas = {
        "setores": s[["CD_SETOR", "CD_MUN", "NM_MUN", "NM_BAIRRO", "SITUACAO", "responsaveis", "moradores", "renda_media", "renda_mediana", "geometry"]].rename(columns={"SITUACAO": "situacao"}),
        "municipios": gpd.GeoDataFrame(municipios_rmc(), geometry="geometry", crs=GEO),
    }
    estilos = {
        "setores": [("mediana", "Rendimento mediano do responsável (R$)", estilo_graduado("renda_mediana", lim, cores, casas=0), True)],
        "municipios": [("contorno", "Municípios da RMC", estilo_contorno(TINTA, 0.5, "NM_MUN"), True)],
    }
    tam = gravar("renda", "rmc_renda_2022", camadas, estilos, camadas["setores"].drop(columns="geometry"))
    s_d3 = s.assign(m=s["renda_mediana"])[["CD_SETOR", "m", "geometry"]]
    gravar_cache("rmc-renda", {
        "setores": para_d3(s_d3, ["CD_SETOR", "m"], tol=0.00008, casas=5, cobertura=False),
        "limites": lim, "cores": cores, "sm": SM,
        "n_setores": int(len(s)), "n_com_renda": int(len(com)), "sem_renda": int(s["renda_mediana"].isna().sum()),
        "responsaveis": int(com["responsaveis"].sum()), "resp_por_classe": resp_por_classe,
        "mais_alto": {"municipio": alto.NM_MUN, "bairro": alto.NM_BAIRRO, "mediana": float(alto.renda_mediana),
                      "coord": [round(alto.geometry.representative_point().x, 4), round(alto.geometry.representative_point().y, 4)]},
        "tamanhos": tam,
    })
    print(len(s), len(com), resp_por_classe, alto.NM_MUN, alto.NM_BAIRRO, alto.renda_mediana, tam)


# ------------------------------------------------------------------ 4/4 APPs de Campinas (FBDS)
CLASSES_APP = [  # (classe FBDS, rótulo, EN, cor)
    ("formação florestal", "Formação florestal", "Forest", MINERAIS["verde_mata"]),
    ("formação não florestal", "Formação não florestal", "Non-forest natural vegetation", "#a9b287"),
    ("silvicultura", "Silvicultura", "Tree plantation", MINERAIS["oliva"]),
    ("área antropizada", "Área antropizada", "Human-altered land", MINERAIS["palha"]),
    ("área edificada", "Área edificada", "Built-up area", MINERAIS["grafite"]),
]


def app() -> None:
    d = DL / "fbds"
    ler = lambda n: gpd.read_file(d / f"SP_3509502_{n}.shp", engine="pyogrio").to_crs(GEO)  # noqa: E731
    uso_app = ler("APP_USO")
    rios = ler("RIOS_SIMPLES")
    duplos = ler("RIOS_DUPLOS")
    massas = ler("MASSAS_DAGUA")
    nasc = ler("NASCENTES")
    app_ = ler("APP")
    uso_app["CLASSE_USO"] = uso_app["CLASSE_USO"].str.strip()
    area_cls = km2(uso_app).groupby(uso_app["CLASSE_USO"]).sum()
    tot = float(area_cls.sum())
    classes = [{"classe": c, "rotulo": r, "rotulo_en": e, "cor": cor, "km2": round(float(area_cls.get(c, 0)), 3),
                "pct": round(float(area_cls.get(c, 0)) / tot * 100, 2)} for c, r, e, cor in CLASSES_APP]
    assert abs(sum(x["km2"] for x in classes) - tot) < 0.01
    mun_km2 = float(km2(municipios_rmc().query("CD_MUN == @CAMPINAS")).iloc[0])
    rios_km = km_geodesico(rios.geometry)
    nasc_flo = gpd.sjoin(nasc, uso_app[uso_app["CLASSE_USO"] == "formação florestal"][["geometry"]], predicate="within", how="inner")
    n_nasc_flo = int(nasc_flo.index.unique().size)
    # Nascente em cada classe de uso (o círculo de 50 m da APP cai numa só classe na maior parte dos casos).
    nj = gpd.sjoin(nasc[["geometry"]], uso_app[["CLASSE_USO", "geometry"]], predicate="within", how="left")
    nj = nj[~nj.index.duplicated(keep="first")]
    nasc_cls = {c: int((nj["CLASSE_USO"] == c).sum()) for c, *_ in CLASSES_APP}
    nasc_cls["sem classe"] = int(nj["CLASSE_USO"].isna().sum())
    assert nasc_cls["formação florestal"] == n_nasc_flo
    # Chamada: a nascente edificada mais próxima da mediana das nascentes edificadas.
    ed = nj[nj["CLASSE_USO"] == "área edificada"].geometry.force_2d()
    mx, my = float(ed.x.median()), float(ed.y.median())
    alvo = ed.iloc[int(((ed.x - mx) ** 2 + (ed.y - my) ** 2).values.argmin())]
    camadas = {
        "app_uso": uso_app[["CLASSE_USO", "AREA_HA", "geometry"]].rename(columns={"CLASSE_USO": "classe_uso", "AREA_HA": "area_ha"}),
        "app": app_[["HIDRO", "APP_M", "AREA_HA", "geometry"]].rename(columns={"HIDRO": "origem", "APP_M": "largura_m", "AREA_HA": "area_ha"}),
        "rios": rios[["HIDRO", "COMP_KM", "geometry"]].rename(columns={"HIDRO": "classe", "COMP_KM": "comp_km"}),
        "rios_duplos": duplos[["HIDRO", "AREA_HA", "geometry"]].rename(columns={"HIDRO": "classe", "AREA_HA": "area_ha"}),
        "massas_dagua": massas[["HIDRO", "NATUREZA", "AREA_HA", "geometry"]].rename(columns={"HIDRO": "classe", "NATUREZA": "natureza", "AREA_HA": "area_ha"}),
        "nascentes": nasc[["HIDRO", "geometry"]].rename(columns={"HIDRO": "classe"}),
        "limite_municipal": municipios_rmc().query("CD_MUN == @CAMPINAS")[["CD_MUN", "NM_MUN", "geometry"]],
    }
    cheio = lambda cor: preenchimento(cor, cor, 0)  # noqa: E731
    estilos = {
        "app_uso": [("uso", "Uso do solo nas APPs (FBDS)", estilo_regras("poligono", [(igual("classe_uso", c), r, cheio(cor)) for c, r, _, cor in CLASSES_APP]), True)],
        "app": [("contorno", "Faixa de APP", estilo_contorno(MINERAIS["azul_profundo"], 0.15), True)],
        "rios": [("rios", "Cursos d'água", estilo_regras("linha", [("TRUE", "Curso d'água", linha(MINERAIS["azul_profundo"], 0.3))]), True)],
        "rios_duplos": [("rios", "Rios de margem dupla", estilo_regras("poligono", [("TRUE", "Rio de margem dupla", cheio(MINERAIS["azul_profundo"]))]), True)],
        "massas_dagua": [("massas", "Lagos e represas", estilo_regras("poligono", [("TRUE", "Massa d'água", cheio("#5f8fae"))]), True)],
        "nascentes": [("nascentes", "Nascentes", estilo_regras("ponto", [("TRUE", "Nascente", marcador(MINERAIS["azul_profundo"], 1.2))]), True)],
        "limite_municipal": [("limite", "Limite de Campinas", estilo_contorno(TINTA, 0.6), True)],
    }
    csv = pd.DataFrame(classes)[["rotulo", "km2", "pct"]]
    tam = gravar("app", "campinas_apps_fbds", camadas, estilos, csv)
    gravar_cache("rmc-app", {
        "classes": classes, "app_km2": round(tot, 2), "municipio_km2": round(mun_km2, 1),
        "rios_km": round(rios_km, 1), "nascentes": int(len(nasc)), "nascentes_floresta": n_nasc_flo, "nascentes_por_classe": nasc_cls,
        "nascente_edificada": [round(alvo.x, 5), round(alvo.y, 5)],
        "massas": int(len(massas)), "massas_artificiais": int((massas["NATUREZA"] == "artificial").sum()),
        "uso": para_d3(uso_app.dissolve(by="CLASSE_USO", as_index=False)[["CLASSE_USO", "geometry"]], ["CLASSE_USO"], tol=0.00005, casas=5, cobertura=False),
        "rios": para_d3(rios[["geometry"]].assign(k=1), ["k"], tol=0.00005, casas=5, cobertura=False),
        "agua": para_d3(pd.concat([duplos[["geometry"]], massas[["geometry"]]]).pipe(gpd.GeoDataFrame, crs=GEO).assign(k=1), ["k"], tol=0.00005, casas=5, cobertura=False),
        "nascentes_pts": [[round(p.x, 5), round(p.y, 5)] for p in nasc.geometry.force_2d()],
        "tamanhos": tam,
    })
    print(round(tot, 2), classes, round(rios_km, 1), len(nasc), n_nasc_flo, tam)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("tema", choices=["base", "uso", "domicilios", "renda", "app"])
    {"base": base, "uso": uso, "domicilios": domicilios, "renda": renda, "app": app}[ap.parse_args().tema]()
