---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Rondônia"
subtitulo: "Territorial divisions and highways"

contexto: >-
  Rondônia has 52 municipalities across 238,000 km², 2.8 per cent of Brazil. IBGE groups them into 6 immediate regions, drawn around the towns that supply jobs, trade and services to their surroundings, and into 2 intermediate regions that tie those networks together. Ji-Paraná is the intermediate region with the most municipalities (34); Porto Velho, the one with the fewest (18). The largest municipality is Porto Velho (34,091 km²); the smallest, Teixeirópolis (460 km²). Part of the series “Brazil, state by state”: a clean base, with official boundaries and the road network, to start a map without losing the first afternoon gathering files.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of Rondônia with its 52 municipalities coloured by the 2 intermediate geographic regions and the immediate-region boundaries; federal highways in terracotta red with BR shields, state highways in dark grey and the capital marked with a star. Around it, neighbouring units in light grey; a locator map of Brazil in the lower-left corner and a leaf-shaped north arrow in the upper-right corner."

recorte: "Rondônia state (RO)"
metodo: "IBGE Municipal Mesh boundaries, dissolved into immediate and intermediate regions and the unit boundary; highways clipped to the unit."
---

# Rondônia — territorial divisions and highways

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 027 of the series **Brazil, state by state**: a cartographic base for each
of the 27 federative units, with the same files, the same layers and the same design,
ready to download and get to work.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `municipios` | polygon | 52 municipalities: `CD_MUN`, `NM_MUN`, immediate and intermediate regions, urban concentration, `area_km2`, `capital` |
| `regioes_intermediarias` | polygon | 2 regions, with their number of municipalities |
| `regioes_imediatas` | polygon | 6 regions, with their number of municipalities |
| `limite_estadual` | polygon | outline of the unit |
| `rodovias` | line | federal and state highways: `sigla`, `revestimento`, `situacao_fisica`, `n_pistas`, `pavimentada` |
| `capital` | point | indicative point inside the municipality (not the seat) |

The **GPKG** and **DXF** are zipped and attached to the repository’s
[`estados-2025` release](https://github.com/aikiesan/essencial-geo/releases/tag/estados-2025),
together with those of the other 26 units.

The **DXF** is in metres (SIRGAS 2000 / Brazil Polyconic, EPSG:5880 — the same system
for all 27 units, so the bases fit together in CAD). Its layers are
`MUNICIPIOS_LIMITES`, `REGIOES_IMEDIATAS_LIMITES`, `REGIOES_INTERMEDIARIAS_LIMITES`,
`LIMITE_ESTADUAL`, `RODOVIAS_FEDERAIS`, `RODOVIAS_ESTADUAIS`, `CAPITAL` and
`MUNICIPIOS_NOMES` (text). Every shared boundary appears once, as a single polyline.

The **CSV** holds the municipal table in UTF-8, ready to join with Census data or any
dataset keyed on the seven-digit IBGE code.

## Method

1. IBGE Municipal Mesh 2025, with geometry unchanged in the downloadable files.
2. Immediate and intermediate regions and the boundary are dissolved from the
   municipalities, so their edges match exactly.
3. Federal and state highways from MapBiomas’ infrastructure base, clipped to the
   boundary. The plate shows built sections only.
4. Areas in km² as computed by IBGE; the total matches an Albers calculation
   (237,753.4 km²).
5. On the plate, geometries are simplified as a coverage (≈ 400 m), so the unit, its
   neighbours and the coastline share the same edges.

Scripts: [`scripts/estados/preparar.py`](https://github.com/aikiesan/essencial-geo/blob/main/scripts/estados/preparar.py) (data),
[`scripts/estados/prancha.mjs`](https://github.com/aikiesan/essencial-geo/blob/main/scripts/estados/prancha.mjs) (plate) and
[`scripts/estados/readme.mjs`](https://github.com/aikiesan/essencial-geo/blob/main/scripts/estados/readme.mjs) (this sheet).

## Limitations

- The `rodovias` layer has an incomplete `n_pistas` field; do not use it to measure
  dual-carriageway length.
- The capital point is indicative (an interior point of the municipal polygon).
