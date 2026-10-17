---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Riparian reserves of Campinas"
subtitulo: "Where water rises, the forest is missing"

contexto: >-
  Brazil’s Forest Code requires a strip of protected vegetation along every river, around every spring and on the shores of reservoirs: the permanent preservation areas, or APPs. In Campinas they add up to 108 km², 13.6% of the municipality, drawn over 1,682 km of streams and 1,671 springs. Only 26.4% of that strip is forest. The rest is pasture, cropland and bare soil (57.9%) or city (14.3%). Of the springs, 325 lie in forest and 1,261 in human-altered land; 49 have ended up under the streets and roofs of the urban area. On the map, green thickens in the east, in the hills of Sousas and Joaquim Egídio, and vanishes in the centre, where the streams run between houses. Fourth plate of the collection “Campinas Metropolitan Region”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of the municipality of Campinas, in transverse Mercator projection, with the stream network drawn as thin strips coloured by land use inside the permanent preservation area: dark green for forest, straw yellow for human-altered land, dark grey for built-up area. Small blue dots mark 1,671 springs, and lakes and reservoirs appear in light blue. Green dominates the dense network in the east; grey fills the streams of the urban centre and west; yellow spreads across the rural south and north. A callout points to a spring in the centre: 49 springs under the city. In the panel, a strip splits the reserve area by land use class, and bars show which class the springs fall in."

recorte: "Municipality of Campinas (SP)"
metodo: "Reserves, stream network, springs and land use inside the reserves from the FBDS mapping of Campinas; area of each land use class summed and springs assigned to the class they fall in."
---

# The permanent preservation areas of Campinas and the land use inside them

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 035, the last of four in the collection **Campinas Metropolitan Region**: a close-up of the
core municipality, to see the riverbanks that the regional plates cannot reach.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `app_uso` | polygon | 23,490 land use polygons inside the reserves: `classe_uso`, `area_ha` |
| `app` | polygon | 2,657 reserve strips: `origem` (stream by width class, water body or spring), `largura_m` (width), `area_ha` |
| `rios` | line | 5,351 single-line segments: `classe` (stream width), `comp_km` |
| `rios_duplos` | polygon | 114 double-bank river reaches: `classe`, `area_ha` |
| `massas_dagua` | polygon | 967 lakes and reservoirs: `classe`, `natureza` (natural or artificial), `area_ha` |
| `nascentes` | point | 1,671 springs |
| `limite_municipal` | polygon | boundary of Campinas (IBGE) |

The **GPKG** is zipped and attached to the
[`rmc-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/rmc-2026).
Each layer carries its own **QGIS style**: `app_uso` with the five classes in the plate’s colours,
water in blue and the reserve strips as outlines only.

The **CSV** holds the area of each land use class inside the reserves, in UTF-8.

## Method

1. Layers from the FBDS mapping of the municipality of Campinas (IBGE code 3509502): reserves, land
   use inside the reserves, single- and double-bank streams, water bodies and springs, reprojected
   from SIRGAS 2000 / UTM 23S to geographic SIRGAS 2000.
2. The strips follow the Forest Code widths (Law 12,651/2012) adopted by FBDS: 30 m on each side of
   streams up to 10 m wide, 50 m for those 10 to 50 m wide, 100 m for those 50 to 200 m wide, 15 or
   30 m around water bodies, and a 50 m radius around springs.
3. Area of each land use class inside the reserves, in km², in the Albers equal-area projection.
4. Each spring is assigned to the land use class of the polygon it falls in; 7 springs fall in no
   land use polygon.
5. Stream length measured on the ellipsoid.
6. On the plate, a 30 m strip is little more than 2 px wide: each class was given an outline in its
   own colour so that it can be read. The drawn width is exaggerated; the areas in the panel and the
   files are the true ones.

## Limitations

- The FBDS mapping is a snapshot of a single date, made from high-resolution satellite imagery
  from about a decade ago; the city has grown and some forest has recovered since.
- **Human-altered land** lumps together pasture, cropland, bare soil and other unbuilt uses: FBDS
  does not separate them.
- An APP is the strip the law requires to be protected, not a register of what is legally
  occupied: houses and streets older than the rules, consolidated urban areas and regularisation
  schemes follow rules of their own.
- The 1,682 km cover only single-line streams; the 114 double-bank river reaches enter as polygons.
