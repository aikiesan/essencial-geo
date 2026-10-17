---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Roraima"
subtitulo: "Territorial divisions and highways"

contexto: >-
  Roraima has 15 municipalities across 224,000 km², 2.6 per cent of Brazil. IBGE groups them into 4 immediate regions, drawn around the towns that supply jobs, trade and services to their surroundings, and into 2 intermediate regions that tie those networks together. Boa Vista is the intermediate region with the most municipalities (9); Rorainópolis - Caracaraí, the one with the fewest (6). The largest municipality is Caracaraí (47,385 km²); the smallest, São Luiz do Anauá (1,527 km²). Part of the series “Brazil, state by state”: a clean base, with official boundaries and the road network, to start a map without losing the first afternoon gathering files.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of Roraima with its 15 municipalities coloured by the 2 intermediate geographic regions and the immediate-region boundaries; federal highways in terracotta red with BR shields, state highways in dark grey and the capital marked with a star. Around it, neighbouring units in light grey; a locator map of Brazil in the lower-right corner and a leaf-shaped north arrow in the upper-right corner."

recorte: "Roraima state (RR)"
metodo: "IBGE Municipal Mesh boundaries, dissolved into immediate and intermediate regions and the unit boundary; highways clipped to the unit."
---

# Roraima — territorial divisions and highways

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 025 of the series **Brazil, state by state**: a cartographic base for each
of the 27 federative units, with the same files, the same layers and the same design,
ready to download and get to work.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `municipios` | polygon | 15 municipalities: `CD_MUN`, `NM_MUN`, immediate and intermediate regions, urban concentration, `area_km2`, `capital` |
| `regioes_intermediarias` | polygon | 2 regions, with their number of municipalities |
| `regioes_imediatas` | polygon | 4 regions, with their number of municipalities |
| `limite_estadual` | polygon | outline of the unit |
| `rodovias` | line | federal and state highways: `sigla`, `revestimento`, `situacao_fisica`, `n_pistas`, `pavimentada` |
| `capital` | point | indicative point inside the municipality (not the seat) |

The **GPKG** is zipped and attached to the repository’s
[`estados-2025` release](https://github.com/aikiesan/essencial-geo/releases/tag/estados-2025),
together with those of the other 26 units.

The GPKG carries its own **QGIS styles**, saved as each layer’s default style: drag the
file into QGIS and the municipalities appear in the colours of their intermediate
regions, boundaries and highways with the plate’s strokes, and names with a halo.
Highway sections without a confirmed physical status sit in a legend rule that is
switched off, as on the plate; tick it to see them. Other GIS software opens the layers
as usual, without the style. To match the plate, stack them from top to bottom:
`capital`, `rodovias`, `limite_estadual`, `regioes_intermediarias`,
`regioes_imediatas` and `municipios`.

The **CSV** holds the municipal table in UTF-8, ready to join with Census data or any
dataset keyed on the seven-digit IBGE code.

## Method

1. IBGE Municipal Mesh 2025, with geometry unchanged in the downloadable files.
2. Immediate and intermediate regions and the boundary are dissolved from the
   municipalities, so their edges match exactly.
3. Federal and state highways from MapBiomas’ infrastructure base, clipped to the
   boundary. The plate shows built sections only.
4. Areas in km² as computed by IBGE; the total matches an Albers calculation
   (223,505.1 km²).
5. On the plate, geometries are simplified as a coverage (≈ 400 m), so the unit, its
   neighbours and the coastline share the same edges.

## Limitations

- The `rodovias` layer has an incomplete `n_pistas` field; do not use it to measure
  dual-carriageway length.
- The capital point is indicative (an interior point of the municipal polygon).
