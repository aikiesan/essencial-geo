---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "What August burned"
subtitulo: "Three days of 2024 and the land under the hotspots"
contexto: >-
  Between 22 and 24 August 2024, INPE’s reference satellite recorded 2,621 hotspots in São Paulo state, 30% of the 8,712 for the whole year; on the 23rd alone there were 1,886, more than in the whole of 2022 or 2023. Of the land around those hotspots, 48% was sugarcane, which covers 23% of the state: twice its weight in the territory. Cane was the main cover around 1,556 of them (59%). Pasture, crops, tree plantations and native forest appear under the hotspots in a smaller share than their area in the state; besides cane, only savanna, grassland and wetland weigh more (2.5% against 1.5%). The hotspots gathered in the north: 844 in the Ribeirão Preto intermediate region. In Altinópolis, 86 hotspots fell on a mosaic of forest, savanna, tree plantation and cane. A hotspot is active fire seen from the satellite, not burned area.
imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state with 2024 sugarcane in very pale ochre in the background and the 2024 hotspots as dots. The 6,091 hotspots outside 22–24 August are small grey dots; the 2,621 from those three days are larger dots, coloured by the MapBiomas class covering most of the surrounding km²: ochre for sugarcane, terracotta for pasture, purple for mosaic of uses, blue for crops, olive for tree plantation, dark green for native forest, teal for savanna, grassland and wetland and dark grey for urban, water and other. The ochre dots cluster in the north, between Ribeirão Preto, Sertãozinho and Pitangueiras; the green and purple ones lie to the east, near Minas Gerais and the capital. Two callouts: Pitangueiras, 88 hotspots, 81% sugarcane under them; Altinópolis, 86 hotspots, with 38% native vegetation, 15% tree plantation and 23% cane. The panel holds bars of each class’s share under the hotspots against its share of the state and columns of hotspots per day in August, with the jump on 22–24."
metodo: "2024 reference-satellite hotspots from INPE in the state; for each one, the composition of MapBiomas 2024 land cover in a window of 9 × 9 cells of 120 m (~1 km²) around the point; the colour is the class covering most of the window, and the panel uses the mean of the compositions."
---

# What August burned: land cover under the hotspots of 22–24 August 2024 in São Paulo

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 141, the first in the **Biomass gone up in smoke** collection. Three days of August 2024
held 30% of the year’s hotspots in São Paulo. The question here is what was on the ground around each
hotspot.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `focos_2024` | point | 8,712 reference-satellite hotspots in 2024: `foco_id`, `data`, `hora_utc`, `lat`, `lon`, `municipio_inpe`, `bioma_inpe` (as in BDQueimadas), `CD_MUN`, `NM_MUN`, `NM_RGINT` (from the IBGE mesh), `destaque_22a24`, `classe_dominante` (class covering most of the ~1 km² window), `classe_no_ponto` (class of the point’s 120 m cell) and `pct_cana` … `pct_outros` (window composition, whole %) |
| `municipios` | polygon | 645 municipalities: `CD_MUN`, `NM_MUN`, `NM_RGINT`, `area_km2`, `pct_cana_2024`, `focos_2024`, `focos_22a24_ago` |
| `limite_estadual` | polygon | state outline |

The **GPKG** is zipped and attached to the
[`fogo-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/fogo-sp-2026).
The `focos_2024` layer carries two **QGIS styles**: the plate’s (22–24 Aug by dominant class, the rest
in grey) and another by the class of the point’s cell. The **CSV** sits in this folder, UTF-8, with the
hotspots without geometry. Field names and class keys are in Portuguese (`cana` sugarcane, `pastagem`
pasture, `mosaico` mosaic of uses, `lavouras` crops, `silvicultura` tree plantation, `floresta` native
forest, `campo` savanna, grassland and wetland, `outros` urban, water and other).

The MapBiomas (collection 10) class groups used here:

| Group | MapBiomas codes |
| --- | --- |
| sugarcane | 20 |
| pasture | 15 |
| mosaic of uses | 21 |
| soya and other crops | 39, 40, 41, 62, 46, 47, 48, 35 |
| tree plantation | 9 |
| native forest | 3, 5, 6, 49 |
| savanna, grassland, wetland | 4, 11, 12, 13, 29, 32, 50 |
| urban, water and other | 22, 23, 24, 25, 30, 31, 33, 75 |

## Method

1. Hotspots from INPE’s 2024 annual reference-satellite file (BDQueimadas), with `estado` equal to
   “SÃO PAULO”: 8,712 hotspots. Each was joined to its municipality in the IBGE 2025 Municipal Mesh by
   the point. The reference satellite passes in the afternoon (16:00–18:00 UTC, 13:00–15:00 in
   Brasília), so the UTC date is the local date.
2. Land cover: MapBiomas, collection 10, 2024, on the 120 m grid (mode of 4 × 4 pixels of 30 m),
   clipped to the state boundary. Each class’s share of the state (23.4% sugarcane, 58,095 km²) comes
   from the same collection’s area-by-municipality table, counted at 30 m.
3. **Window around the hotspot.** A hotspot marks the centre of a MODIS pixel of about 1 km, and the
   point’s 120 m cell is noisy. So each hotspot was given the composition of a window of 9 × 9 cells of
   120 m (about 1.1 km across) centred on the point, using only cells inside the state.
   - The **panel** uses the mean of these compositions: each class’s share of the land around the
     hotspots, without the bias of counting only the majority class.
   - The **dot colour** is the class covering most of the window (`classe_dominante`). This count leans
     towards classes that form large patches, such as cane: 59% of the 22–24 Aug hotspots have cane as
     dominant class, against 48% cane in the surrounding land.
   - Check: by the point’s cell (`classe_no_ponto`), cane takes 47.96% of the 22–24 Aug hotspots, less
     than 0.1 point from the window mean.
4. The “hotspots ÷ state” ratio divides the class’s share under the hotspots by its share of the
   state’s area.
5. The map’s cane background is class 20 on the same 120 m grid.

## Limitations

- **A hotspot is not burned area.** It is a ~1 km pixel where the sensor saw active fire during the
  satellite pass. A large fire can produce dozens of hotspots; a short, night-time, cloud-covered or
  small fire may produce none. Burned area is a different product (burn scars, such as MapBiomas Fogo).
- The land cover is for 2024 as a whole; the land around the hotspot does not tell what caught fire
  first, nor where the fire came from. A fire that starts in pasture and spreads into a cane field shows
  up as fire in cane.
- The ~1 km² window mixes neighbouring classes; at the state edges it keeps only the cells inside.
- The plate does not address the causes of the fire or who set it.

## Data licence

INPE hotspots and IBGE municipal mesh: open data, free to use with attribution. MapBiomas data under a
CC BY 4.0 licence; cite “MapBiomas Project — Collection 10 of the Annual Series of Land Use and Land
Cover Maps of Brazil”.
