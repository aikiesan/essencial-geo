"""
Coleção «Água em SP» — prepara os dados de uma prancha (uso interno).

    .venv-geo/Scripts/python scripts/colecoes/agua-sp/preparar.py bacias
    .venv-geo/Scripts/python scripts/colecoes/agua-sp/preparar.py ucs
    .venv-geo/Scripts/python scripts/colecoes/agua-sp/preparar.py drenagem

Saídas: mapas/<pasta>/dados/<base>.gpkg.zip (com estilos do QGIS), <base>.csv
e scripts/colecoes/cache/agua-sp-<tema>.json (para a prancha e a ficha).
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import geopandas as gpd
import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from comum import (  # noqa: E402
    AREA_BR, DADOS, GEO, MINERAIS, RAIZ, TINTA, VIRIDIS, classe, estilo_contorno, estilo_graduado, estilo_regras,
    gravar_cache, gravar_estilos, igual, infra, km2, km_geodesico, linha, malha_uf, marcador, para_d3, preenchimento,
    quebras, zipar,
)
from estilos import qml, rgba, rotulo, simbolo, unico  # noqa: E402

PASTAS = {
    "bacias": "036-bacias-hidrograficas-sp",
    "ucs": "038-unidades-de-conservacao-sp",
    "drenagem": "037-drenagem-sp",
}
SEADE = Path("A:/Project_Twin/Project_Twin/data/raw/seade_geo_ambiente_transporte")
CENSO = DADOS / "raw" / "ibge_censo2022" / "Agregados_por_municipios_basico_BR.csv"
AZUL = MINERAIS["azul_profundo"]

# Nomes oficiais das 22 UGRHIs (a tabela da SEADE vem em caixa alta e sem um acento).
NOMES = {
    1: "Mantiqueira", 2: "Paraíba do Sul", 3: "Litoral Norte", 4: "Pardo", 5: "Piracicaba/Capivari/Jundiaí",
    6: "Alto Tietê", 7: "Baixada Santista", 8: "Sapucaí/Grande", 9: "Mogi-Guaçu", 10: "Tietê/Sorocaba",
    11: "Ribeira de Iguape/Litoral Sul", 12: "Baixo Pardo/Grande", 13: "Tietê/Jacaré", 14: "Alto Paranapanema",
    15: "Turvo/Grande", 16: "Tietê/Batalha", 17: "Médio Paranapanema", 18: "São José dos Dourados",
    19: "Baixo Tietê", 20: "Aguapeí", 21: "Peixe", 22: "Pontal do Paranapanema",
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


def ugrhis() -> gpd.GeoDataFrame:
    u = gpd.read_file(f"zip://{SEADE / 'ambiente_ugrhi.zip'}", engine="pyogrio").to_crs(GEO)
    assert len(u) == 22 and sorted(u["Codigo"].astype(int)) == list(range(1, 23))
    u = u.assign(codigo=u["Codigo"].astype(int))
    for c, n in NOMES.items():  # confere a grafia contra a tabela original
        orig = u.loc[u["codigo"] == c, "Nome"].iloc[0]
        assert orig.replace("Í", "I").upper() == n.upper().replace("Í", "I"), (c, orig, n)
    u["nome"] = u["codigo"].map(NOMES)
    u["area_km2"] = km2(u).round(1)
    return u[["codigo", "nome", "area_km2", "geometry"]].sort_values("codigo").reset_index(drop=True)


def estilo_ugrhi_contorno() -> str:
    rot = rotulo("concat(\"codigo\", ' · ', \"nome\")", tamanho=9, cor=AZUL, expressao=True, buffer=1, prioridade=8)
    return qml(unico(simbolo("fill", "0", preenchimento(None, AZUL, 0.5))), "poligono", rot)


def limite_sp(mun: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    return mun.assign(SIGLA_UF="SP").dissolve(by="SIGLA_UF", as_index=False)[["SIGLA_UF", "geometry"]]


# ------------------------------------------------------------------ bacias (UGRHI)
def bacias() -> None:
    mun = malha_uf("SP")
    u = ugrhis()
    # Cada município entra na UGRHI que cobre a maior parte do seu território.
    inter = gpd.overlay(mun[["CD_MUN", "geometry"]].to_crs(AREA_BR), u[["codigo", "geometry"]].to_crs(AREA_BR),
                        how="intersection", keep_geom_type=True)
    inter["a"] = inter.area
    tot = inter.groupby("CD_MUN")["a"].sum()
    melhor = inter.sort_values("a", ascending=False).drop_duplicates("CD_MUN").set_index("CD_MUN")
    mun["ugrhi_codigo"] = mun["CD_MUN"].map(melhor["codigo"]).astype(int)
    mun["ugrhi_nome"] = mun["ugrhi_codigo"].map(NOMES)
    mun["fracao_na_ugrhi"] = (mun["CD_MUN"].map(melhor["a"]) / mun["CD_MUN"].map(tot)).round(3)
    censo = pd.read_csv(CENSO, sep=";", encoding="latin1", dtype=str)
    censo = censo[censo["CD_UF"] == "35"].set_index("CD_MUN")
    mun["populacao_2022"] = mun["CD_MUN"].map(censo["v0001"].astype(int))
    assert mun["populacao_2022"].notna().all() and len(mun) == 645

    g = mun.groupby("ugrhi_codigo").agg(municipios=("CD_MUN", "size"), populacao_2022=("populacao_2022", "sum"))
    u = u.merge(g, left_on="codigo", right_index=True)
    u["densidade_hab_km2"] = (u["populacao_2022"] / u["area_km2"]).round(1)
    u["pct_populacao"] = (100 * u["populacao_2022"] / u["populacao_2022"].sum()).round(2)
    u["pct_area"] = (100 * u["area_km2"] / u["area_km2"].sum()).round(2)
    lim = quebras(u["densidade_hab_km2"])
    u["classe"] = [classe(v, lim) for v in u["densidade_hab_km2"]]

    limite = limite_sp(mun)
    hid = infra("structure_waterway")
    hid = hid[hid["nome"].str.contains("Tietê - Paraná", na=False)]
    hid = gpd.clip(hid, limite.geometry.iloc[0].buffer(0.02))
    hid = hid.dissolve(by="nome", as_index=False)[["nome", "geometry"]].explode(index_parts=False)
    hid = hid.assign(nome="Hidrovia Tietê-Paraná")[["nome", "geometry"]].reset_index(drop=True)
    ecl = infra("structure_lock")
    ecl = ecl[ecl.within(limite.geometry.iloc[0].buffer(0.02))][["nome", "geometry"]].reset_index(drop=True)
    ecl["nome"] = ecl["nome"].str.replace(r"^Eclusa (de )?", "", regex=True)

    estilos = {
        "ugrhi": [
            ("densidade", "População por km² (Censo 2022)", estilo_graduado("densidade_hab_km2", lim, VIRIDIS, casas=0,
                                                                            rotulo_campo="nome"), True),
            ("contorno", "Só o contorno, com número e nome", estilo_ugrhi_contorno(), False),
        ],
        "municipios": [("ugrhi", "Contorno fino dos municípios", estilo_contorno("#9aa3ab", 0.15, "NM_MUN"), True)],
        "hidrovia": [("hidrovia", "Hidrovia Tietê-Paraná",
                      qml(unico(simbolo("line", "0", linha(AZUL, 0.9))), "linha"), True)],
        "eclusas": [("eclusas", "Eclusas", qml(unico(simbolo("marker", "0", marcador(PAPEL_, 2.2, borda=AZUL,
                     largura_borda=0.5, forma="square", alfa=1))), "ponto",
                     rotulo("nome", tamanho=7, cor=AZUL, prioridade=6)), True)],
        "limite_estadual": [("limite", "Limite do estado", estilo_contorno(TINTA, 0.6), True)],
    }
    camadas = {
        "ugrhi": u.drop(columns="classe"),
        "municipios": mun[["CD_MUN", "NM_MUN", "ugrhi_codigo", "ugrhi_nome", "fracao_na_ugrhi", "populacao_2022", "geometry"]],
        "hidrovia": hid, "eclusas": ecl, "limite_estadual": limite,
    }
    csv = u.drop(columns=["geometry", "classe"])
    tam = gravar("bacias", "sp_bacias_hidrograficas", camadas, estilos, csv)

    reps = u.to_crs(AREA_BR).representative_point().to_crs(GEO)
    gravar_cache("agua-sp-bacias", {
        "ugrhi": para_d3(u, ["codigo", "nome", "densidade_hab_km2", "classe"], tol=0.004),
        "pontos": {int(c): [round(p.x, 4), round(p.y, 4)] for c, p in zip(u["codigo"], reps)},
        "tabela": csv.to_dict(orient="records"),
        "quebras": lim,
        "hidrovia": para_d3(hid, ["nome"], tol=0.002),
        "eclusas": [{"nome": r.nome, "coord": [round(r.geometry.x, 4), round(r.geometry.y, 4)]} for r in ecl.itertuples()],
        "hidrovia_km": round(km_geodesico(hid), 0),
        "populacao": int(u["populacao_2022"].sum()),
        "area_km2": float(u["area_km2"].sum()),
        "municipios_divididos": int((mun["fracao_na_ugrhi"] < 0.9).sum()),
        "tamanhos": tam,
    })
    print(csv.sort_values("codigo").to_string())
    print("quebras", lim, "hidrovia km", km_geodesico(hid), "eclusas", ecl["nome"].tolist(), tam)


# ------------------------------------------------------------------ unidades de conservação (CNUC via SEADE)
ARQ_UC = [(e, g) for e in ("federal", "estadual", "municipal") for g in ("pi", "us")]


def ucs() -> None:
    mun = malha_uf("SP")
    limite = limite_sp(mun)
    lim_a = limite.to_crs(AREA_BR).geometry.iloc[0]
    partes = []
    for esfera, grupo in ARQ_UC:
        g = gpd.read_file(f"zip://{SEADE / f'ambiente_unid_conservacao_{esfera}_{grupo}.zip'}", engine="pyogrio")
        partes.append(g.to_crs(GEO))
    uc = pd.concat(partes, ignore_index=True)
    assert not uc["cd_cnuc"].duplicated().any()
    uc = gpd.GeoDataFrame(uc, geometry="geometry", crs=GEO)
    uc_a = uc.to_crs(AREA_BR)
    uc_a["geometry"] = uc_a.geometry.make_valid().intersection(lim_a)
    uc_a = uc_a[~uc_a.is_empty & uc_a.geom_type.isin(["Polygon", "MultiPolygon", "GeometryCollection"])].copy()
    uc_a["geometry"] = uc_a.geometry.apply(
        lambda x: x if x.geom_type != "GeometryCollection" else
        gpd.GeoSeries([p for p in x.geoms if p.geom_type in ("Polygon", "MultiPolygon")]).union_all())
    uc_a["area_sp_km2"] = (uc_a.area / 1e6).round(2)
    uc_a["apa"] = uc_a["categoria"].eq("Área de Proteção Ambiental")
    uc_a["grupo_mapa"] = uc_a["grupo"].map({"Proteção Integral": "pi", "Uso Sustentável": "us"})
    uc_a.loc[uc_a["apa"], "grupo_mapa"] = "apa"
    assert uc_a["grupo_mapa"].notna().all()

    pi = uc_a[uc_a["grupo_mapa"] == "pi"].union_all()
    qualquer = uc_a.union_all()
    us_sem_pi = uc_a[uc_a["grupo_mapa"] != "pi"].union_all().difference(pi)
    area_sp = lim_a.area
    u = ugrhis()
    ua = u.to_crs(AREA_BR)
    linhas = []
    for x in ua.itertuples():
        g = x.geometry.intersection(lim_a)
        a = g.area
        linhas.append({
            "codigo": x.codigo,
            "km2_protecao_integral": round(g.intersection(pi).area / 1e6, 1),
            "km2_qualquer_uc": round(g.intersection(qualquer).area / 1e6, 1),
            "pct_protecao_integral": round(100 * g.intersection(pi).area / a, 2),
            "pct_qualquer_uc": round(100 * g.intersection(qualquer).area / a, 2),
            "ucs": int(uc_a.intersects(x.geometry).sum()),
        })
    u = u.merge(pd.DataFrame(linhas), on="codigo")
    lim = quebras(u["pct_protecao_integral"])

    campos = ["cd_cnuc", "nome_uc", "NomeAbrev", "categoria", "grupo", "esfera", "cria_ano", "cria_ato", "org_gestor",
              "area_ha", "area_sp_km2", "apa", "grupo_mapa"]
    camada_uc = uc_a[campos + ["geometry"]].rename(columns={"NomeAbrev": "nome_abrev", "area_ha": "area_cnuc_ha"}).to_crs(GEO)
    camada_uc = camada_uc.sort_values("area_sp_km2", ascending=False).reset_index(drop=True)

    def cor_fill(cor, alfa, borda, larg):
        return (f'<layer class="SimpleFill" enabled="1" locked="0" pass="0">'
                f'<Option type="Map"><Option name="color" value="{rgba(cor, alfa)}" type="QString"/>'
                f'<Option name="style" value="solid" type="QString"/><Option name="outline_color" value="{rgba(borda)}" type="QString"/>'
                f'<Option name="outline_width" value="{larg}" type="QString"/><Option name="outline_width_unit" value="MM" type="QString"/>'
                f'<Option name="joinstyle" value="round" type="QString"/></Option></layer>')

    estilo_uc = estilo_regras("poligono", [
        (igual("grupo_mapa", "apa"), "Área de Proteção Ambiental (uso sustentável)", cor_fill(MINERAIS["palha"], 0.45, MINERAIS["ocre"], 0.2)),
        (igual("grupo_mapa", "us"), "Outras de uso sustentável", cor_fill(MINERAIS["oliva"], 0.85, PAPEL_, 0.1)),
        (igual("grupo_mapa", "pi"), "Proteção integral", cor_fill(MINERAIS["verde_mata"], 0.95, PAPEL_, 0.1)),
    ], rotulo_campo="nome_abrev", ordem='"area_sp_km2" DESC')
    estilos = {
        "unidades_conservacao": [("grupo", "Proteção integral, uso sustentável e APAs", estilo_uc, True)],
        "ugrhi": [
            ("contorno", "Contorno das UGRHIs, com número e nome", estilo_ugrhi_contorno(), True),
            ("protecao_integral", "% da área em proteção integral",
             estilo_graduado("pct_protecao_integral", lim, VIRIDIS, casas=1, rotulo_campo="nome"), False),
        ],
        "limite_estadual": [("limite", "Limite do estado", estilo_contorno(TINTA, 0.6), True)],
    }
    camadas = {"unidades_conservacao": camada_uc, "ugrhi": u, "limite_estadual": limite}
    csv = camada_uc.drop(columns="geometry")
    tam = gravar("ucs", "sp_unidades_conservacao", camadas, estilos, csv)

    resumo = {
        "n": len(camada_uc),
        "por_grupo": camada_uc.groupby("grupo").size().to_dict(),
        "por_esfera": camada_uc.groupby("esfera").size().to_dict(),
        "por_categoria": camada_uc.groupby("categoria").size().to_dict(),
        "apa_n": int(camada_uc["apa"].sum()),
        "area_sp_km2": round(area_sp / 1e6, 1),
        "pct_pi": round(100 * pi.area / area_sp, 2),
        "pct_qualquer": round(100 * qualquer.area / area_sp, 2),
        "pct_us_sem_pi": round(100 * us_sem_pi.area / area_sp, 2),
        "km2_pi": round(pi.area / 1e6, 1),
        "km2_qualquer": round(qualquer.area / 1e6, 1),
        "maiores": camada_uc.head(8)[["nome_abrev", "grupo", "esfera", "area_sp_km2"]].to_dict(orient="records"),
        "maiores_pi": camada_uc[camada_uc["grupo_mapa"] == "pi"].head(5)[["nome_abrev", "esfera", "area_sp_km2"]].to_dict(orient="records"),
    }
    reps = u.to_crs(AREA_BR).representative_point().to_crs(GEO)
    gravar_cache("agua-sp-ucs", {
        "ucs": para_d3(camada_uc, ["nome_abrev", "grupo_mapa", "area_sp_km2"], tol=0.0015, cobertura=False),
        "ugrhi": para_d3(u, ["codigo", "nome", "pct_protecao_integral", "pct_qualquer_uc"], tol=0.004),
        "pontos": {int(c): [round(p.x, 4), round(p.y, 4)] for c, p in zip(u["codigo"], reps)},
        "tabela": u.drop(columns="geometry").to_dict(orient="records"),
        "quebras": lim,
        "resumo": resumo,
        "tamanhos": tam,
    })
    print(u.drop(columns="geometry").sort_values("pct_protecao_integral", ascending=False).to_string())
    print(resumo, tam)


# ------------------------------------------------------------------ rede de drenagem (HydroRIVERS)
HYDRORIVERS = RAIZ / "scripts" / "colecoes" / "cache" / "downloads" / "hydrorivers" / "HydroRIVERS_v10_sa_shp.zip"
VERTENTE_COR = {"prata": AZUL, "atlantico": MINERAIS["argila"]}
VERTENTE_ROT = {"prata": "Bacia do Prata (para o interior)", "atlantico": "Direto para o Atlântico"}


def drenagem() -> None:
    from shapely.geometry import Point
    from shapely.ops import nearest_points

    mun = malha_uf("SP")
    limite = limite_sp(mun)
    lim_a = limite.to_crs(AREA_BR).geometry.iloc[0]
    faixa_a = lim_a.buffer(1500)  # rios de divisa (Paraná, Grande, Paranapanema) correm sobre o limite
    x0, y0, x1, y1 = limite.total_bounds
    r = gpd.read_file(f"zip://{HYDRORIVERS.as_posix()}!HydroRIVERS_v10_sa_shp/HydroRIVERS_v10_sa.shp", engine="pyogrio",
                      bbox=(x0 - 0.6, y0 - 0.6, x1 + 0.6, y1 + 0.6)).set_crs(4326, allow_override=True).to_crs(GEO)
    por_id = r.set_index("HYRIV_ID")
    # Tronco do Paraná: os trechos de maior área a montante na janela; a sua foz define a bacia do Prata.
    tronco = r[r["UPLAND_SKM"] > 300_000]
    prata = int(tronco["MAIN_RIV"].mode().iloc[0])
    r["vertente"] = (r["MAIN_RIV"] == prata).map({True: "prata", False: "atlantico"})
    # Tietê: o afluente do tronco com foz perto de Itapura, subindo sempre pelo trecho de maior área a montante.
    afl = r[r["NEXT_DOWN"].isin(tronco["HYRIV_ID"]) & ~r["HYRIV_ID"].isin(tronco["HYRIV_ID"])].copy()
    fim = afl.geometry.apply(lambda g: g.coords[-1])
    afl["d_itapura"] = [((x + 51.51) ** 2 + (y + 20.65) ** 2) ** 0.5 for x, y in fim]
    foz = afl[afl["d_itapura"] < 0.4].sort_values("UPLAND_SKM", ascending=False).iloc[0]
    assert 60_000 < foz.UPLAND_SKM < 80_000, foz.UPLAND_SKM
    montante = r.groupby("NEXT_DOWN").groups
    caminho = [int(foz.HYRIV_ID)]
    while caminho[-1] in montante:
        acima = r.loc[montante[caminho[-1]]]
        caminho.append(int(acima.sort_values("UPLAND_SKM", ascending=False).iloc[0].HYRIV_ID))
    tiete = r[r["HYRIV_ID"].isin(caminho)]
    tiete_km = float(tiete["LENGTH_KM"].sum())
    nasc = por_id.loc[caminho[-1]].geometry.coords[0]
    assert -46.2 < nasc[0] < -45.5 and -23.8 < nasc[1] < -23.3, nasc  # cabeceira perto de Salesópolis
    p_nasc = gpd.GeoSeries([Point(nasc)], crs=GEO).to_crs(AREA_BR).iloc[0]
    costa = nearest_points(p_nasc, lim_a.boundary)[1]
    costa_geo = gpd.GeoSeries([costa], crs=AREA_BR).to_crs(GEO).iloc[0]
    assert costa_geo.y < -23.6, costa_geo  # o ponto mais próximo do limite é a costa, ao sul
    nasc_mar_km = p_nasc.distance(costa) / 1000

    # Recorte: dentro do estado (com a faixa de divisa) e, fora dele, só os rios de ordem 3 ou mais, em cinza.
    ra = r.to_crs(AREA_BR)
    dentro = ra[ra.intersects(faixa_a)].copy()
    dentro["geometry"] = dentro.geometry.intersection(faixa_a)
    dentro = dentro[~dentro.is_empty]
    fora = ra[ra["ORD_STRA"] >= 3].copy()
    fora["geometry"] = fora.geometry.difference(faixa_a)
    fora = fora[~fora.is_empty]
    # Comprimentos só dentro do limite (sem a faixa).
    so_sp = ra[ra.intersects(lim_a)].copy()
    so_sp["geometry"] = so_sp.geometry.intersection(lim_a)
    so_sp = so_sp[~so_sp.is_empty].to_crs(GEO)
    so_sp["km"] = [km_geodesico(gpd.GeoSeries([g], crs=GEO)) for g in so_sp.geometry]
    km_total = float(so_sp["km"].sum())
    km_ordem = {int(k): int(round(v)) for k, v in so_sp.groupby("ORD_STRA")["km"].sum().items()}
    km_vert = so_sp.groupby("vertente")["km"].sum().to_dict()
    # Área drenada: bacia local de cada trecho cujo meio cai em SP.
    meio = gpd.GeoSeries(so_sp.geometry.interpolate(0.5, normalized=True), crs=GEO).to_crs(AREA_BR)
    no_sp = so_sp[meio.within(lim_a).values]
    area_vert = no_sp.groupby("vertente")["CATCH_SKM"].sum()
    pct_prata = float(area_vert.get("prata", 0) / area_vert.sum() * 100)
    dentro_g = dentro.to_crs(GEO)
    foz_mar = dentro_g[(dentro_g["NEXT_DOWN"] == 0) & (dentro_g["vertente"] == "atlantico")]
    maior_q = dentro_g.sort_values("DIS_AV_CMS", ascending=False).iloc[0]
    mq = maior_q.geometry.interpolate(0.5, normalized=True)

    cols = ["HYRIV_ID", "NEXT_DOWN", "MAIN_RIV", "LENGTH_KM", "DIST_DN_KM", "DIST_UP_KM", "CATCH_SKM", "UPLAND_SKM",
            "DIS_AV_CMS", "ORD_STRA", "vertente"]
    rios = dentro_g[cols + ["geometry"]].rename(columns=str.lower)
    tiete_g = tiete[["geometry"]].dissolve().assign(nome="Tietê", comp_km=round(tiete_km, 1))
    camadas = {
        "rios": rios,
        "tiete": tiete_g,
        "limite_estadual": limite[["SIGLA_UF", "geometry"]],
    }
    larg = {1: 0.1, 2: 0.15, 3: 0.2, 4: 0.3, 5: 0.45, 6: 0.65, 7: 0.9, 8: 1.2}
    regras = [(f"{igual('vertente', v)} AND {igual('ord_stra', o)}", f"{VERTENTE_ROT[v]} · ordem {o}", linha(VERTENTE_COR[v], w))
              for v in VERTENTE_COR for o, w in larg.items()]
    estilos = {
        "rios": [("vertente", "Rios pela vertente e pela ordem de Strahler", estilo_regras("linha", regras, ordem='"ord_stra" ASC'), True)],
        "tiete": [("tiete", "Tietê", estilo_regras("linha", [("TRUE", "Tietê", linha(AZUL, 1.4))]), True)],
        "limite_estadual": [("limite", "Limite do estado", estilo_contorno(TINTA, 0.6), True)],
    }
    tabela = rios.drop(columns="geometry").sort_values("hyriv_id")
    tam = gravar("drenagem", "sp_drenagem", camadas, estilos, tabela)
    d3 = dentro_g.assign(q=dentro_g["DIS_AV_CMS"].round(2), o=dentro_g["ORD_STRA"], v=dentro_g["vertente"].str[0])
    gravar_cache("agua-sp-drenagem", {
        "rios": para_d3(d3[["q", "o", "v", "geometry"]], ["q", "o", "v"], tol=0.003, casas=4, cobertura=False),
        "fora": para_d3(fora.to_crs(GEO).assign(o=fora["ORD_STRA"])[["o", "geometry"]], ["o"], tol=0.004, casas=4, cobertura=False),
        "tiete": para_d3(tiete_g[["geometry"]].assign(k=1), ["k"], tol=0.002, casas=4, cobertura=False),
        "nascente_tiete": [round(nasc[0], 4), round(nasc[1], 4)],
        "tiete_km": round(tiete_km, 0), "nascente_mar_km": round(nasc_mar_km, 1),
        "km_total": round(km_total, 0), "km_ordem": km_ordem,
        "km_vertente": {k: round(v, 0) for k, v in km_vert.items()},
        "pct_prata": round(pct_prata, 1), "n_trechos": int(len(so_sp)),
        "fozes_mar": int(len(foz_mar)),
        "maior_vazao": {"q": round(float(maior_q.DIS_AV_CMS), 0), "coord": [round(mq.x, 4), round(mq.y, 4)]},
        "tamanhos": tam,
    })
    print(len(r), len(dentro), len(fora), prata, foz.UPLAND_SKM, tiete_km, len(caminho), nasc, round(nasc_mar_km, 1))
    print(round(km_total), km_ordem, km_vert, round(pct_prata, 1), len(foz_mar), maior_q.DIS_AV_CMS, tam)


PAPEL_ = "#ffffff"

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("tema", choices=["bacias", "ucs", "drenagem"])
    {"bacias": bacias, "ucs": ucs, "drenagem": drenagem}[ap.parse_args().tema]()
