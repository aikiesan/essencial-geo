---
# English version (EN-UK). Only text lives here; numbers, files, DOI, layers and
# indicators come from README.md. Every published map needs this file.
titulo: "{{titulo_en}}"
subtitulo: ""                       # optional, one line

# ── The feed paragraph (exactly one, up to ~900 characters) ──
contexto: >-
  Write a single paragraph here: what the map reveals, why it matters in the
  Brazilian context and what the reader should look for in the image.

imagem: ./mapa_preview.en.png       # the plate exported with English labels
imagem_alt: "Describe the map for screen-reader users: extent, variable and main pattern."

# Optional overrides (otherwise the Portuguese values are used):
# recorte: "Municipality, State"
# escala: "1:50,000"
# metodo: ""
---

# {{titulo_en}}

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

## Method

1. Origin and extent of the data.
2. Processing (joins, reprojection, classification).
3. Symbology: palette, class breaks and why.

## Files

| File | Contents |
| --- | --- |
| `dados/{{pasta}}.gpkg.zip` | Vector layers in SIRGAS 2000 |
| `dados/{{pasta}}.dxf` | Same geometries for CAD, by layer |
| `prancha_impressao.pdf` | Final vector plate |

Layer and column names stay in Portuguese in both languages.
