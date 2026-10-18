---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The farming patchwork"
subtitulo: "Almost a quarter of the state is sugarcane"

contexto: >-
  In 2024, 72% of São Paulo’s territory was cropland, pasture, tree plantation or a mosaic of these uses, according to MapBiomas. Sugarcane is the largest class: 58,000 km², almost a quarter of the state, and the leading use in 255 of the 645 municipalities. In the Ribeirão Preto region it covers half the land, and in Dumont, 80%. Soybean and other annual crops add up to 7%, mostly in the south, in the Marília region and around Itapeva. Pasture, at 15%, dominates the west: it covers 36% of the Presidente Prudente region. Oranges, coffee and other perennial crops take up less than 2%. Native vegetation, 22% of the state, lies mostly in the Serra do Mar and the Ribeira valley. First plate of the collection “From field to biomethane”, which follows the crops to the gas their residues could give.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state with land use and land cover in 2024, in eleven colours. The light green of sugarcane covers almost all of the centre and north of the state, most continuous around Ribeirão Preto. The light brown of soybean and other annual crops forms patches in the south, from Itapeva to Assis. The straw yellow of pasture and the cream of the mosaic of uses prevail in the west and in the Paraíba valley. Orange patches of citrus are scattered across the centre-north, and the dark brown of coffee appears in the north-east, near Franca. The greyish green of native vegetation fills the Serra do Mar and the Ribeira valley, in the south-east; the grey of the cities marks Greater São Paulo, and the blue of the reservoirs traces the Tietê and Paraná rivers. Callouts: Dumont, 80% in sugarcane; Itapeva, 664 km² of soybean and other annual crops."

recorte: "São Paulo state (SP)"
metodo: "MapBiomas 2024 classification (Collection 10), 30 m pixels, grouped into eleven classes; areas by municipality counted on the 30 m pixels, on the GRS80 ellipsoid; map drawn with the most frequent class in blocks of 4 × 4 pixels (120 m)."
---

# Land use and land cover in São Paulo, 2024: the farming patchwork

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 045, the first of six in the collection **From field to biomethane**: the whole state
seen from above, before following each crop to the gas its residues could give.

## What the files contain

| File / layer | Geometry | Contents |
| --- | --- | --- |
| `municipios` (GPKG) | polygon | 645 municipalities: `CD_MUN`, `NM_MUN`, intermediate region, `area_km2`; for each class, `km2_<class>` and `pct_<class>` (cana = sugarcane, temporarias = annual crops, citros = citrus, perenes = perennial crops, silvicultura = tree plantation, pastagem = pasture, mosaico = mosaic, nativa = native vegetation, urbano = urban, agua = water, outras = other); `pct_agro` (the first seven added up) and `maior_classe` (largest class) |
| `regioes_intermediarias` (GPKG) | polygon | 11 intermediate geographic regions |
| `limite_estadual` (GPKG) | polygon | outline of the state |
| `sp_uso_agropecuario_2024.tif` | grid | MapBiomas classification with the original codes, 120 m, in WGS 84 (EPSG:4326) like the original, clipped to the state, with the plate’s `.qml` style |

The **GPKG** and the **GeoTIFF** are zipped and attached to the
[`agro-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/agro-sp-2026).
The `municipios` layer carries three **QGIS styles**: `cana` (the default), `temporarias` and
`pastagem`, as a share of the municipality.

The **CSV** holds the municipal table, in UTF-8, without geometry.

## Method

1. MapBiomas Collection 10 land use and land cover map for 2024, 30 m pixels, read from the public
   file for Brazil only in the blocks that cover the state.
2. MapBiomas codes grouped into eleven classes:
   - **sugarcane** (20);
   - **soybean and other annual crops** (soybean, rice, cotton and other annual crops);
   - **oranges and other citrus**;
   - **coffee and other perennial crops**;
   - **tree plantation**;
   - **pasture**;
   - **mosaic of uses**, where the satellite cannot tell crops from pasture;
   - **native vegetation** (forest, savanna and grassland formations, mangrove, restinga and
     wetlands);
   - **urban area**;
   - **water**;
   - **mining and other non-vegetated areas**, including beaches, dunes and solar farms.
3. Area of each class by municipality counted on the 30 m pixels, with each pixel’s area on the
   GRS80 ellipsoid. The total is 248,217 km²; 2.6 km² of unclassified coastal pixels are left out.
4. The map and the GeoTIFF use the most frequent class in each block of 4 × 4 pixels (120 m). Small
   crops, such as coffee on hillsides, therefore show less on the map than in the figures.

## Limitations

- This is an automatic classification of satellite images, with errors that vary from class to
  class; MapBiomas publishes the accuracy of each one.
- The mosaic of uses, 20% of the state, combines crops and pasture that the satellite cannot
  separate; the 72% in farming uses includes this mosaic.
- Land with two harvests a year appears once, with the class MapBiomas assigned for 2024.
- PAM harvested area (in the following plates) and the area mapped by MapBiomas measure different
  things and need not match.

## Data licence

MapBiomas data under a CC BY 4.0 licence; cite “MapBiomas Project — Collection 10 of the Annual
Series of Land Use and Land Cover Maps of Brazil”. IBGE municipal mesh, free to use with
attribution.
