---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Land use and land cover"
subtitulo: "Between cane and city, islands of forest"

contexto: >-
  The grey patch of the city already covers 21.1% of the 3,791 km² of the Campinas Metropolitan Region, and 72.6% of Hortolândia. To the west, sugarcane takes half of Santa Bárbara d'Oeste (49.3%) and 39.7% of Cosmópolis. To the east, in the hills of Morungaba, Itatiba and Pedreira, the forest holds out in islands: 7,743 forest fragments, only 31 of them larger than 1 km². The largest, in Itatiba, covers 8.6 km². The most common class is none of these but the mosaic of uses (29.3%): pastures, small fields and country plots that the satellite cannot tell apart at 30 m. First plate of the collection “Campinas Metropolitan Region”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of the 20 municipalities of the Campinas Metropolitan Region, in transverse Mercator projection, covered pixel by pixel by the MapBiomas 2024 classification. The dark grey of urban areas forms a continuous axis from Americana and Santa Bárbara d'Oeste to Campinas, Valinhos and Vinhedo, with another patch at Indaiatuba. The ochre of sugarcane dominates the west; the cream of the mosaic of uses and the straw yellow of pasture cover the east, dotted with the dark green of forest in Morungaba, Itatiba and Pedreira. A callout points to the largest forest fragment, 8.6 km², in Itatiba. In the panel, a strip splits the region’s area into the ten classes, and bars show the urban share of six municipalities."

recorte: "Campinas Metropolitan Region (SP)"
metodo: "MapBiomas Collection 10 classification for 2024, 30 m pixels, grouped into ten classes; each pixel’s area measured on the ellipsoid and summed for the region and for each municipality."
---

# Land use and land cover in the Campinas Metropolitan Region, 2024

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 032, the first of four in the collection **Campinas Metropolitan Region**: the ground of
its 20 municipalities, seen from the satellite. The next plates count households, income and the
banks of the rivers.

## What the files contain

| File / layer | Geometry | Contents |
| --- | --- | --- |
| `rmc_uso_cobertura_2024.tif` | raster | 2024 classification, 30 m pixels, clipped to the region, with the MapBiomas legend codes (0 = outside the region) |
| `municipios` (GPKG) | polygon | 20 municipalities: `CD_MUN`, `NM_MUN`, `area_km2` and, for each class, `km2_<class>` and `pct_<class>` |
| `limite_rmc` (GPKG) | polygon | outline of the region |

The **GPKG** and the **GeoTIFF** are zipped and attached to the
[`rmc-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/rmc-2026).
The `municipios` layer carries two **QGIS styles**: `urbano` (the default, each municipality’s urban
share) and `floresta`. The GeoTIFF’s ZIP includes a `.qml` style with the plate’s palette and the
name of each code; open the `.tif` in QGIS with the `.qml` in the same folder.

The **CSV** holds the table of the 20 municipalities in UTF-8, without geometry.

## Method

1. MapBiomas Collection 10 land cover and land use map for 2024, read only within the region’s
   window, in SIRGAS 2000, with 0.00027° pixels (about 30 m).
2. The MapBiomas legend classes become ten classes on the plate: forest (including savanna
   formation), grassland and wetland, tree plantation, pasture, mosaic of uses, sugarcane, soy and
   other crops (annual and perennial), urban area, water, and mining with other non-vegetated
   areas.
3. Each pixel counts with its true area on the GRS80 ellipsoid, computed row by row (a pixel in
   degrees shrinks with latitude). Pixels are assigned to municipalities by their centre.
4. Forest fragments: forest and savanna pixels joined to one another, corners included (eight
   neighbours), within the region.
5. The plate draws the grid resampled into the map projection; the municipal boundaries go on top,
   as vectors.

## Limitations

- MapBiomas classifies 30 m Landsat imagery: country plots, back gardens and narrow riparian
  strips blend together, and much of this falls into the **mosaic of uses**, the region’s largest
  class.
- MapBiomas **urban area** is the built-up patch seen from the satellite, not the urban perimeter
  set by municipal law.
- A forest fragment may continue across the region’s boundary; here it is measured only inside.
- The sum of pixel areas (3,790.7 km²) differs slightly from the official area of the
  municipalities, because of the pixelated edge.
