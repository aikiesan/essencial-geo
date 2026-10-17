---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Land use and land cover mosaic"
subtitulo: "A Cerrado type-landscape: veredas, pastures and pivots"

contexto: >-
  In the Cerrado, water draws the landscape before any fence does: gallery forests
  follow the rivers like a dark outline, and it is away from them that pastures and
  crops advance — sometimes in perfect circles, the signature of centre pivots seen
  from above. This type-landscape is synthetic, but it uses the grammar of land
  cover classifications such as MapBiomas, and the mineral colours the atlas will
  adopt for them. The mosaic of polygons is a reminder that every land use map is,
  first of all, a decision about where one thing ends and another begins.

imagem: ./mapa_preview.en.png
imagem_alt: "Mosaic of coloured polygons: a winding river lined with dark green gallery forest crosses the plate; around it, patches of savanna, pasture, clay-coloured cropland with circular centre pivots and a small grey urban area."

recorte: "Fictional Cerrado landscape (synthetic data)"
escala: "1:50,000"
metodo: "Voronoi polygons classified by three noise fields and by distance to the river."
---

# Land use and land cover mosaic

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

> **Sample plate.** The landscape is synthetic and does not represent any real place.

## Method

1. Around 3,000 randomly jittered points generate a Voronoi mosaic.
2. Each cell receives a class from three noise fields (moisture, agricultural
   suitability, forestry patches) and from its distance to a winding river — near the
   water, the class is always forest formation (gallery forest).
3. Centre pivots are placed only over cropland patches, without overlapping.

## Palette

| Class | Colour |
| --- | --- |
| Forest formation | `#2e5a3c` |
| Savanna formation | `#7f9a52` |
| Grassland formation | `#cfc78e` |
| Pasture | `#e2c48a` |
| Temporary crops | `#c07a45` |
| Forestry plantation | `#6b5577` |
| Urban area | `#4a4540` |
| Water body | `#1f3a5f` |

## Files

The DXF has one layer per class (`USO_FLORESTAL`, `USO_PASTAGEM`…), plus `PIVOS` and
`HIDROGRAFIA` — just freeze layers in CAD to isolate a class. The CSV
`dados/uso_solo_areas.csv` lists the area (ha) and share of each class; class names
stay in Portuguese so that the file is identical in both languages.
