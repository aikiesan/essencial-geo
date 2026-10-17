"""
Série «Brasil, estado por estado» — prepara os dados de UMA unidade da federação.

    .venv-geo/Scripts/python scripts/estados/preparar.py SP --pasta 001-estado-sao-paulo

Entradas (caminhos por variável de ambiente, com os padrões desta máquina):
    ESSENCIAL_MALHA      IBGE, Malha Municipal 2025 (BR_Municipios_2025.shp)
    ESSENCIAL_RODOVIAS   pasta com structure_federal_highway/ e structure_state_highway/

Saídas:
    mapas/<pasta>/dados/<uf>_divisao_territorial.gpkg.zip   camadas em SIRGAS 2000 geográfico (EPSG:4674)
    mapas/<pasta>/dados/<uf>_municipios.csv             tabela dos municípios
    scripts/estados/cache/<uf>.json                     geometrias simplificadas para a prancha (não versionado)

Nada é estimado: todo número da ficha sai deste script.
"""

from __future__ import annotations

import argparse
import json
import os
import zipfile
from pathlib import Path

import geopandas as gpd
import pandas as pd
import shapely
from shapely.geometry.polygon import orient

RAIZ = Path(__file__).resolve().parents[2]
MALHA = os.environ.get(
    "ESSENCIAL_MALHA",
    "A:/Pilar-2b-cp2b/cp2b-workspace/NewLook/backend/data/shapefiles/BR_Municipios_2025.shp",
)
RODOVIAS = os.environ.get(
    "ESSENCIAL_RODOVIAS",
    "A:/Pilar-2b-cp2b/cp2b-workspace/NewLook/backend/data/shapefiles/mapbiomas_infra",
)

GEO = "EPSG:4674"  # SIRGAS 2000 geográfico — o da malha do IBGE
AREA = "+proj=aea +lat_1=-2 +lat_2=-22 +lat_0=-12 +lon_0=-54 +ellps=GRS80 +units=m"  # Albers do IBGE, para km

# Município-sede da capital de cada UF (código IBGE de 7 dígitos), conferido pelo nome.
CAPITAIS = {
    "RO": ("1100205", "Porto Velho"), "AC": ("1200401", "Rio Branco"), "AM": ("1302603", "Manaus"),
    "RR": ("1400100", "Boa Vista"), "PA": ("1501402", "Belém"), "AP": ("1600303", "Macapá"),
    "TO": ("1721000", "Palmas"), "MA": ("2111300", "São Luís"), "PI": ("2211001", "Teresina"),
    "CE": ("2304400", "Fortaleza"), "RN": ("2408102", "Natal"), "PB": ("2507507", "João Pessoa"),
    "PE": ("2611606", "Recife"), "AL": ("2704302", "Maceió"), "SE": ("2800308", "Aracaju"),
    "BA": ("2927408", "Salvador"), "MG": ("3106200", "Belo Horizonte"), "ES": ("3205309", "Vitória"),
    "RJ": ("3304557", "Rio de Janeiro"), "SP": ("3550308", "São Paulo"), "PR": ("4106902", "Curitiba"),
    "SC": ("4205407", "Florianópolis"), "RS": ("4314902", "Porto Alegre"), "MS": ("5002704", "Campo Grande"),
    "MT": ("5103403", "Cuiabá"), "GO": ("5208707", "Goiânia"), "DF": ("5300108", "Brasília"),
}

# Tolerâncias de simplificação da prancha (graus). Só para desenhar: os arquivos
# para download mantêm a geometria original do IBGE.
TOL_ESTADO = 0.004   # ~400 m: invisível numa prancha de 2400 px
TOL_CONTEXTO = 0.02  # vizinhos e mapa de localização


def ler_malha() -> gpd.GeoDataFrame:
    m = gpd.read_file(MALHA, engine="pyogrio")
    m = m.set_crs(GEO, allow_override=True)
    # A malha traz duas lagoas (Patos e Mirim) como "municípios" sem código de UF válido.
    return m[m["CD_MUN"].str.match(r"^\d{7}$")].copy()


def ler_rodovias(limite: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    partes = []
    for pasta, arquivo, jur in [
        ("structure_federal_highway", "rodovia-federal.shp", "federal"),
        ("structure_state_highway", "rodovia-estadual.shp", "estadual"),
    ]:
        caminho = Path(RODOVIAS) / pasta / arquivo
        r = gpd.read_file(caminho, engine="pyogrio", encoding="cp1252", bbox=tuple(limite.total_bounds))
        r = r.set_crs(GEO, allow_override=True)
        r = gpd.clip(r, limite)
        r = r[~r.geometry.is_empty & r.geometry.notna()]
        r = r.explode(index_parts=False)
        r = r[r.geom_type == "LineString"]
        r["jurisdicao_mapa"] = jur
        partes.append(r)
    rod = pd.concat(partes, ignore_index=True)
    rod["pavimentada"] = rod["revestimen"].eq("Pavimentado")
    rod["duplicada"] = rod["nrpistas"].fillna(1).ge(2) | rod["tipovia"].eq("Autoestrada")
    rod = rod.rename(
        columns={
            "tipovia": "tipo_via", "administra": "administracao", "concession": "concessionaria",
            "revestimen": "revestimento", "situacaofi": "situacao_fisica", "nrpistas": "n_pistas",
            "nrfaixas": "n_faixas", "codtrechor": "cod_trecho",
        }
    )
    cols = ["sigla", "jurisdicao_mapa", "tipo_via", "administracao", "concessionaria", "revestimento",
            "situacao_fisica", "n_pistas", "n_faixas", "cod_trecho", "pavimentada", "duplicada", "geometry"]
    return gpd.GeoDataFrame(rod[cols], geometry="geometry", crs=GEO)


def malha_simplificada(malha: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Malha nacional simplificada como cobertura (guardada em cache: leva ~1 min)."""
    cache = RAIZ / "scripts" / "estados" / "cache" / f"brasil_{str(TOL_ESTADO).replace('.', '_')}.gpkg"
    if cache.exists():
        return gpd.read_file(cache, engine="pyogrio").set_crs(GEO, allow_override=True)
    s = malha[["CD_MUN", "NM_MUN", "CD_RGI", "CD_RGINT", "NM_RGINT", "SIGLA_UF", "NM_UF", "geometry"]].copy()
    s["geometry"] = shapely.coverage_simplify(shapely.make_valid(s.geometry.values), TOL_ESTADO)
    cache.parent.mkdir(parents=True, exist_ok=True)
    s.to_file(cache, driver="GPKG", engine="pyogrio")
    return s


def km(g: gpd.GeoSeries) -> float:
    return float(g.to_crs(AREA).length.sum() / 1000)


def horario(geom):
    """d3-geo espera o anel externo no sentido horário (o contrário da RFC 7946)."""
    if geom is None or geom.is_empty:
        return geom
    if geom.geom_type == "Polygon":
        return orient(geom, sign=-1.0)
    if geom.geom_type == "MultiPolygon":
        return shapely.MultiPolygon([orient(p, sign=-1.0) for p in geom.geoms])
    return geom


def valor(v):
    """Valor de atributo pronto para JSON (listas passam; NaN vira null; numpy vira Python)."""
    if isinstance(v, (list, tuple)):
        return list(v)
    if v is None or (not isinstance(v, str) and pd.isna(v)):
        return None
    return v.item() if hasattr(v, "item") else v


def coletanea(gdf: gpd.GeoDataFrame, props: list[str]) -> dict:
    feats = []
    for _, linha in gdf.iterrows():
        g = linha.geometry
        if g is None or g.is_empty:
            continue
        feats.append({
            "type": "Feature",
            "properties": {p: valor(linha[p]) for p in props},
            "geometry": shapely.geometry.mapping(horario(g)),
        })
    return {"type": "FeatureCollection", "features": feats}


def arredondar(obj, casas=5):
    if isinstance(obj, float):
        return round(obj, casas)
    if isinstance(obj, (list, tuple)):
        return [arredondar(v, casas) for v in obj]
    if isinstance(obj, dict):
        return {k: arredondar(v, casas) for k, v in obj.items()}
    return obj


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("uf")
    ap.add_argument("--pasta", required=True, help="pasta do mapa em /mapas")
    ap.add_argument("--so-prancha", action="store_true", help="só refaz o cache da prancha")
    a = ap.parse_args()
    uf = a.uf.upper()
    cod_cap, nome_cap = CAPITAIS[uf]

    malha = ler_malha()
    mun = malha[malha["SIGLA_UF"] == uf].copy()
    assert len(mun), f"UF {uf} não encontrada"
    cap = mun[mun["CD_MUN"] == cod_cap]
    assert len(cap) == 1 and cap.iloc[0]["NM_MUN"] == nome_cap, f"capital de {uf} não confere"
    nome_uf = mun.iloc[0]["NM_UF"]
    mun["capital"] = mun["CD_MUN"].eq(cod_cap)
    # "Áreas operacionais" do IBGE (as lagoas dos Patos e Mirim, no RS): estão na malha e na área
    # do estado, mas não são municípios nem pertencem a região alguma.
    todos = mun
    agua = mun[mun["CD_RGINT"].isna()]
    mun = mun[mun["CD_RGINT"].notna()].copy()

    # ---- camadas na geometria original ---------------------------------
    limite = todos.dissolve(by=["CD_UF", "NM_UF", "SIGLA_UF"], as_index=False)[["CD_UF", "NM_UF", "SIGLA_UF", "geometry"]]
    rgint = mun.dissolve(by=["CD_RGINT", "NM_RGINT"], as_index=False, aggfunc={"CD_MUN": "count"})
    rgint = rgint.rename(columns={"CD_MUN": "n_municipios"})[["CD_RGINT", "NM_RGINT", "n_municipios", "geometry"]]
    rgi = mun.dissolve(by=["CD_RGI", "NM_RGI", "CD_RGINT"], as_index=False, aggfunc={"CD_MUN": "count"})
    rgi = rgi.rename(columns={"CD_MUN": "n_municipios"})[["CD_RGI", "NM_RGI", "CD_RGINT", "n_municipios", "geometry"]]
    ponto_cap = gpd.GeoDataFrame(
        {"CD_MUN": [cod_cap], "NM_MUN": [nome_cap], "posicao": ["ponto interno do polígono municipal (indicativo, não é a sede)"]},
        geometry=[cap.geometry.iloc[0].representative_point()], crs=GEO,
    )
    rod = ler_rodovias(limite)

    municipios = mun[["CD_MUN", "NM_MUN", "CD_RGI", "NM_RGI", "CD_RGINT", "NM_RGINT", "CD_CONCURB", "NM_CONCURB", "AREA_KM2", "capital", "geometry"]].rename(
        columns={"AREA_KM2": "area_km2"}
    )

    destino = RAIZ / "mapas" / a.pasta / "dados"
    destino.mkdir(parents=True, exist_ok=True)
    base = uf.lower() + "_divisao_territorial"

    if not a.so_prancha:  # arquivos para download (lento: ~2 min)
        # ---- GeoPackage ----------------------------------------------------
        gpkg = destino / f"{base}.gpkg"
        gpkg.unlink(missing_ok=True)
        for nome, camada in [
            ("municipios", municipios), ("limite_estadual", limite), ("regioes_intermediarias", rgint),
            ("regioes_imediatas", rgi), ("capital", ponto_cap), ("rodovias", rod),
        ] + ([("areas_operacionais", agua[["CD_MUN", "NM_MUN", "AREA_KM2", "geometry"]].rename(columns={"AREA_KM2": "area_km2"}))] if len(agua) else []):
            camada.to_file(gpkg, layer=nome, driver="GPKG", engine="pyogrio")

        # O GPKG vai compactado (metade do tamanho); o original sai da pasta.
        # Os estilos do QGIS entram depois da prancha, com as mesmas cores: scripts/estados/estilos.py.
        with zipfile.ZipFile(f"{gpkg}.zip", "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
            z.write(gpkg, gpkg.name)
        gpkg.unlink()

        # ---- CSV -----------------------------------------------------------
        municipios.drop(columns="geometry").sort_values("NM_MUN").to_csv(destino / f"{uf.lower()}_municipios.csv", index=False, encoding="utf-8")

    # ---- prancha: geometrias simplificadas ---------------------------------
    # A malha NACIONAL é simplificada de uma vez, como cobertura: estado, vizinhos e
    # litoral saem das mesmas bordas, sem frestas nem sobreposições na prancha.
    brasil = malha_simplificada(malha)
    simples_todos = brasil[brasil["SIGLA_UF"] == uf].copy()
    s_agua = simples_todos[simples_todos["CD_RGINT"].isna()]
    simples = simples_todos[simples_todos["CD_RGINT"].notna()].copy()
    simples["capital"] = simples["CD_MUN"].eq(cod_cap)
    s_rgint = simples.dissolve(by=["CD_RGINT", "NM_RGINT"], as_index=False)[["CD_RGINT", "NM_RGINT", "geometry"]]
    s_rgi = simples.dissolve(by="CD_RGI", as_index=False)[["CD_RGI", "geometry"]]
    s_lim = simples_todos.dissolve(by="SIGLA_UF", as_index=False)[["SIGLA_UF", "geometry"]]

    # Vizinhança: UFs que aparecem no enquadramento (extensão do estado + 60%).
    x0, y0, x1, y1 = mun.total_bounds
    folga = 0.6 * max(x1 - x0, y1 - y0)
    janela = shapely.box(x0 - folga, y0 - folga, x1 + folga, y1 + folga)
    todas = brasil.dissolve(by=["SIGLA_UF", "NM_UF"], as_index=False)[["SIGLA_UF", "NM_UF", "geometry"]]
    ufs_det = todas[todas.intersects(janela)]

    # Localizador: o Brasil inteiro, bem mais simplificado.
    ufs = todas.copy()
    ufs["geometry"] = shapely.coverage_simplify(todas.geometry.values, TOL_CONTEXTO)
    ufs["rotulo"] = ufs.geometry.apply(lambda g: list(shapely.get_coordinates(g.representative_point())[0]))

    rod_s = rod.copy()
    rod_s["geometry"] = rod_s.geometry.simplify(TOL_ESTADO / 2)
    rod_s = rod_s[rod_s["situacao_fisica"].eq("Construída")]

    def centroide_rotulo(g):
        """Centro do maior círculo inscrito: o ponto mais "dentro" da região, bom para rótulo."""
        return list(shapely.get_coordinates(shapely.maximum_inscribed_circle(g, 0.005))[0])


    # ---- números da ficha ------------------------------------------------
    area_total = float(todos.to_crs(AREA).area.sum() / 1e6)
    maior = mun.loc[mun["AREA_KM2"].idxmax()]
    menor = mun.loc[mun["AREA_KM2"].idxmin()]
    por_rgint = (
        mun.groupby(["CD_RGINT", "NM_RGINT"]).size().reset_index(name="n").sort_values(["n", "NM_RGINT"], ascending=[False, True])
    )
    pav = rod[rod["pavimentada"]]
    numeros = {
        "uf": uf, "nome": nome_uf, "capital": nome_cap,
        "municipios": int(len(mun)),
        "area_km2_ibge": round(float(todos["AREA_KM2"].sum()), 1),
        "areas_operacionais": [{"nome": r.NM_MUN, "area_km2": round(float(r.AREA_KM2), 1)} for r in agua.itertuples()],
        "area_km2_calculada": round(area_total, 1),
        "regioes_intermediarias": int(rgint.shape[0]),
        "regioes_imediatas": int(rgi.shape[0]),
        "maior_municipio": {"nome": maior["NM_MUN"], "area_km2": round(float(maior["AREA_KM2"]), 1)},
        "menor_municipio": {"nome": menor["NM_MUN"], "area_km2": round(float(menor["AREA_KM2"]), 1)},
        "municipios_por_rgint": [{"codigo": r.CD_RGINT, "nome": r.NM_RGINT, "n": int(r.n)} for r in por_rgint.itertuples()],
        "rodovias_km": {
            "federais": round(km(rod[rod["jurisdicao_mapa"] == "federal"].geometry), 0),
            "estaduais": round(km(rod[rod["jurisdicao_mapa"] == "estadual"].geometry), 0),
            "pavimentadas": round(km(pav.geometry), 0),
            "duplicadas": round(km(rod[rod["duplicada"]].geometry), 0),
        },
        "extensao_graus": [round(v, 4) for v in mun.total_bounds.tolist()],
    }

    cache = {
        "numeros": numeros,
        "municipios": coletanea(simples, ["CD_MUN", "NM_MUN", "CD_RGINT", "capital"]),
        "rgint": coletanea(s_rgint, ["CD_RGINT", "NM_RGINT"]),
        "rgi": coletanea(s_rgi, ["CD_RGI"]),
        "agua": coletanea(s_agua, ["CD_MUN", "NM_MUN"]),
        "limite": coletanea(s_lim, ["SIGLA_UF"]),
        "vizinhos": coletanea(ufs_det, ["SIGLA_UF", "NM_UF"]),
        "ufs": coletanea(ufs, ["SIGLA_UF", "NM_UF", "rotulo"]),
        "rodovias": coletanea(rod_s, ["sigla", "jurisdicao_mapa", "pavimentada", "duplicada"]),
        "capital": {"nome": nome_cap, "coord": list(shapely.get_coordinates(ponto_cap.geometry.iloc[0])[0])},
        "rotulos_rgint": [
            {"codigo": r.CD_RGINT, "nome": r.NM_RGINT, "coord": centroide_rotulo(r.geometry)} for r in s_rgint.itertuples()
        ],
    }
    pasta_cache = RAIZ / "scripts" / "estados" / "cache"
    pasta_cache.mkdir(parents=True, exist_ok=True)
    (pasta_cache / f"{uf.lower()}.json").write_text(json.dumps(arredondar(cache), ensure_ascii=False), encoding="utf-8")

    tamanhos = {p.name: f"{p.stat().st_size / 1e6:.1f} MB" for p in sorted(destino.iterdir())}
    print(json.dumps({"numeros": numeros, "arquivos": tamanhos}, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
