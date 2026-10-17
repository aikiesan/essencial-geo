---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Figure–ground of the urban fabric"
subtitulo: "Solids and voids of a city that grew in two eras"

contexto: >-
  In 1748, Giambattista Nolli drew Rome by shading everything built and leaving
  white everything open to the public — streets, squares and even the interiors of
  churches. The technique has survived because it answers a question no table
  answers well: where does the city breathe? In this synthetic fabric, an organic
  core sits beside an expansion on a rotated grid, and the river appears as the
  largest void of all. The atlas’s infrastructure series will use this reading, with
  blocks, axes and green spaces on separate DXF layers.

imagem: ./mapa_preview.en.png
imagem_alt: "Black-and-white figure–ground map: irregular black blocks in a core on the left, rectangular blocks on a tilted grid around it, white diagonal avenues, hatched green spaces and a pale river winding from top to bottom."

recorte: "Fictional city (synthetic data)"
escala: "1:50,000"
metodo: "Voronoi of two point sets (organic and rotated orthogonal) with a 70 m setback for the roadway."
---

# Figure–ground of the urban fabric

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

> **Sample plate.** The city is synthetic and does not represent any real place.

## Method

1. Two point clouds: one jittered (old core, organic layout) and one grid rotated by
   18° (planned expansion).
2. The Voronoi diagram of these clouds gives the blocks; each polygon is inset by
   7 px (70 m at the synthetic scale) to open up the street bed.
3. Cells near the river or in high-noise patches become parks (hatched); a small
   fraction becomes squares (dashed outline).
4. Three avenues are drawn on top, as cuts through the fabric.

## For CAD

| DXF layer | Contents |
| --- | --- |
| `QUADRAS` | Closed polygons of the built blocks |
| `PRACAS` | Squares |
| `AREAS_VERDES` | Parks and riverbanks |
| `EIXOS_VIARIOS` | Avenue centrelines (open polylines) |
| `HIDROGRAFIA` | River centreline |

For a real figure–ground plate from an OpenStreetMap extract:

```bash
ogr2ogr -f DXF quadras.dxf osm_recorte.gpkg multipolygons \
  -where "building IS NOT NULL" -t_srs EPSG:31983
```
