---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Each crop on its own heading"
subtitulo: "In forty years the centre of soy moved 621 km north, and that of cane 520 km south-west"
contexto: >-
  If all of Brazil’s soy were set on a balance, the point of equilibrium in 1985 would have been in north-western Paraná; in 2025, in south-western Goiás, 621 km further north. Cane went the other way: its centre left northern Minas Gerais, where the north-eastern coastal cane belt had pulled it, and moved 520 km south-west to the Triângulo Mineiro, drawn by São Paulo. Pasture’s centre travelled 523 km towards northern Goiás, while planted forest’s moved only 160 km within inland São Paulo, although its area grew 5.3-fold. Soy went from 4.5 to 44.2 million hectares; pasture from 104 to 166. Second plate in the collection «Forty years of biomass».
imagem_alt: "Map of Brazil in Albers conic projection, on a neutral background, with five coloured paths linking the centre of gravity of each MapBiomas land cover class in 1985 (open circle) to that of 2025 (filled circle), with dots every five years: soy, in gold, climbs from north-western Paraná to south-western Goiás; cane, in wine red, runs from northern Minas Gerais down to the Triângulo Mineiro; pasture, in brown, climbs from eastern to northern Goiás, past Brasília; planted forest, in dark green, barely moves inside São Paulo state; forest formation, dashed, hardly leaves its place in southern Pará. Two callouts give soy’s 621 km and cane’s 520 km. In the panel, a table of each class’s northward and eastward shift, a rose with the four arrows from a common origin and lines of soy, cane and planted-forest area from 1985 to 2025."
metodo: "For each class and year from 1985 to 2025, the mean of municipal centroid coordinates in Brazil’s Albers equal-area conic projection, weighted by the class area in each municipality (MapBiomas, collection 11); shifts measured in that projection, in km."
---

# Each crop on its own heading: the centre of gravity of soy, cane, pasture and planted forest, 1985 to 2025

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 172, the second in the collection **Forty years of biomass**. Each land use class boiled
down to a single point per year, to see where Brazil’s biomass-producing land has moved.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `trajetorias` | line | 5 classes: `classe`, `rotulo`, `caminho_km` (sum of yearly steps), `liquido_km` (1985 → 2025), `direcao`, `area_1985_mha`, `area_2025_mha` |
| `centros_anuais` | point | 205 points: `classe`, `rotulo`, `ano`, `lon`, `lat`, `area_mha` |
| `ufs` | polygon | 27 states |
| `limite_nacional` | polygon | national boundary |

The **GPKG** is zipped and attached to the
[`quarenta-anos-de-biomassa-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/quarenta-anos-de-biomassa-br-2026),
with **QGIS styles** embedded. The **CSV** sits in this folder, UTF-8, with the yearly points.

## Method

1. MapBiomas land cover and land use statistics, collection 11, sheet `COVERAGE_11`: hectares of each
   class by municipality and year, 1985 to 2025, biomes summed. Classes: soybean (39), sugar cane
   (20), pasture (15), forest plantation (9) and, as a reference, forest formation (3).
2. Centre of each municipality: the centroid of its 2025 municipal polygon in Brazil’s Albers
   equal-area conic projection (φ₁ 2° S, φ₂ 22° S, λ₀ 54° W).
3. Centre of gravity of a class in a year: the mean of those centres weighted by the class hectares
   in each municipality. Each class’s 41 centres, joined up, make its path.
4. Net shift: the straight-line distance between the 1985 and 2025 centres in that projection, split
   into north and east; path: the sum of the 40 year-to-year distances.

## Reading the map

- Soy: from 4.5 to 44.2 million hectares (9.9-fold). Its centre left north-western Paraná (52.8° W,
  23.9° S) and reached south-western Goiás (52.0° W, 18.4° S): 615 km north and 87 east, 621 km in a
  straight line and a 767 km path.
- Sugar cane: from 2.2 to 11.2 million hectares (5.2-fold). In 1985 the cane of coastal Pernambuco
  and Alagoas, set against São Paulo’s, put the centre in northern Minas Gerais (44.0° W, 17.4° S);
  with expansion in São Paulo and Goiás it moved 230 km south and 466 west, to the Triângulo Mineiro
  (48.4° W, 19.6° S): 520 km.
- Pasture: from 104.0 to 165.6 million hectares. Its centre went from eastern Goiás (47.2° W,
  17.6° S) to the north of the state (49.0° W, 13.2° S), 491 km north and 180 west: 523 km, pulled by
  new pasture in Pará (+17.9 million ha), Mato Grosso (+14.2), Maranhão and Rondônia, while São Paulo
  lost 7.3 million hectares of it.
- Planted forest: from 1.9 to 9.9 million hectares (5.3-fold), but its centre moved only 160 km, from
  near Piracicaba to the north of inland São Paulo: plantations grew in every direction, in Minas
  Gerais, Mato Grosso do Sul and the South.
- Forest formation: from 424.6 to 359.5 million hectares; its centre moved 75 km, in southern Pará.

## Limitations

- A centre of gravity is an average: it can fall where the class barely exists, as cane’s did in
  1985, between the Northeast and São Paulo. It shows where the whole is heading, not where the class
  is.
- Each municipality counts at its centroid; in very large municipalities the class may lie far from it.
- The early years of the series carry more classification error; soy’s largest yearly step (85 km,
  1985 to 1986) and pasture’s (36 km) both come at the start of the series.
- Satellite-mapped area, not IBGE harvested area.

## Data licence

MapBiomas (CC BY 4.0) and IBGE data, free to use with attribution.
