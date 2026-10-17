---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Urban density on a regular grid"
subtitulo: "The municipality without the arbitrary edges of census tracts"

contexto: >-
  Census tracts are shaped like administrative drawers: they are drawn for an
  enumerator to walk, not to describe where people live. When the population is
  redistributed onto a regular grid — as the IBGE Statistical Grid does — the
  municipality loses its arbitrary boundaries and density reappears as relief: a
  compact core, subcentres pulling the city outwards and a road axis stitching it
  all together. This sample plate, made with synthetic data, sets the language of
  the series: proportional squares, inverted Viridis and no cell larger than the
  data behind it.

imagem: ./mapa_preview.en.png
imagem_alt: "Plate showing an irregular municipal outline covered by a grid of proportional squares; the largest and darkest, in purple, form a central core and three smaller subcentres joined by a diagonal corridor."

recorte: "Fictional municipality (synthetic data)"
escala: "1:50,000"
metodo: "Sum of Gaussian kernels plus fractal noise, aggregated into 220 m cells."
---

# Urban density on a regular grid

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

> **Sample plate.** The values are synthetic and do not represent any real place.
> The plate exists to set the visual language of the density series.

## Method

1. A fictional municipal outline is drawn as a circle deformed by fractal noise.
2. Density is the sum of five Gaussian kernels (one centre and four subcentres), a
   diagonal road corridor and low-frequency noise.
3. The value is aggregated into a regular 22 px grid (220 m at the synthetic scale).
4. Each cell becomes a square whose side is proportional to the square root of the
   value — so the **area**, not the side, is proportional to density.
5. Colour uses inverted Viridis: the dark end carries the data on light paper.

## Version with real data

The real series will use the IBGE Statistical Grid (200 m cells in urban areas) with
population from the 2022 Census. A starting point in R:

```r
library(geobr)
library(sf)

muni  <- read_municipality(code_muni = "SP", year = 2022)
muni  <- muni[muni$name_muni == "Campinas", ]
grade <- read_statistical_grid(code_grid = "all")
grade <- st_filter(st_transform(grade, 31983), st_transform(muni, 31983))
```

## Files

| File | Contents |
| --- | --- |
| `dados/grade_densidade_sintetica.dxf` | `LIMITE` (boundary) and `GRADE_DENSIDADE` (elevation = index) |
| `dados/grade_densidade_sintetica.csv` | `id;x_m;y_m;indice_densidade` |
| `mapa_preview.png` · `mapa_preview.en.png` | Plate in Portuguese and English, 2400 × 1800 px |

Layer and column names stay in Portuguese in every language, so that scripts and CAD
templates work with both versions.
