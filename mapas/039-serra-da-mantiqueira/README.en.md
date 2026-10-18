---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The Mantiqueira range"
subtitulo: "The wall above the Paraíba valley"

contexto: >-
  Profile A–B runs 61 km from the south side of the Paraíba valley to the crest of the Mantiqueira. For almost 40 km the ground barely changes, and the Paraíba do Sul river passes at the lowest point, 501 m. Then the range rises all at once: on the steepest stretch the ground climbs 1,332 m in 5 km, up to 2,581 m on the crest. At the top stands Pedra da Mina, in Queluz, on the Minas Gerais border, the highest point in São Paulo: 2,785 m in the 90 m model. Across the valley, the Serra do Mar closes the corridor through which the river, the Via Dutra motorway and the towns run. In the 10,866 km² frame, mean elevation is 1,007 m and 12.9% of the ground lies above 1,500 m. First plate of the collection “The relief of São Paulo”.

imagem: ./mapa_preview.en.png
imagem_alt: "Shaded relief map of the Paraíba valley and the Mantiqueira range, between Taubaté, Campos do Jordão and Queluz, in hypsometric tints from the pale green of the lowlands to the brown of the ridges and the near-white of the peaks above 2,700 m. The valley is a pale, flat band crossing the map diagonally, with the Paraíba do Sul river; to the north rises the dark wall of the Mantiqueira, with the Minas Gerais border running along the crest; to the south, the hills of the Serra do Mar. A dashed line from A, near Guaratinguetá, to B, beyond Pedra da Mina, marks the profile, and a callout points to the highest point, 2,785 m, in Queluz. In the panel, the elevation scale and profile A–B, almost flat for 40 km and then rising all at once to 2,581 m."

recorte: "Paraíba valley and Mantiqueira range, between Taubaté and Queluz (SP), with parts of Minas Gerais and Rio de Janeiro"
metodo: "Copernicus DEM GLO-90 tiles mosaicked, lit from the north-west with relief exaggerated 1.6 times and coloured by elevation band; profile A–B sampled at 600 points."
---

# The Mantiqueira range above the Paraíba valley

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 039, the first of three in the collection **The relief of São Paulo**: three of the
state’s landscapes read through elevation, each with a profile across its main step.

## What the files contain

| File / layer | Geometry | Contents |
| --- | --- | --- |
| `mantiqueira_relevo.tif` | raster | elevation in whole metres, 90 m pixels (3 arc-seconds), clipped to the frame |
| `faixas_altitude` | polygon | 13 bands every 200 m: `classe`, `min_m`, `max_m`, `rotulo`, `area_km2` |
| `perfil` | line | the A–B line: `de`, `para`, `comp_km` |
| `ponto_mais_alto` | point | `altitude_m`, `nome` |
| `municipios` | polygon | São Paulo municipalities clipped to the frame: `CD_MUN`, `NM_MUN` |

The **GPKG** and the **GeoTIFF** are zipped and attached to the
[`relevo-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/relevo-2026).
The GPKG carries the plate’s **QGIS styles**; the GeoTIFF comes with a `.qml` of the same name,
which QGIS applies on its own when the file is opened. The profile **CSV** sits in this folder,
in UTF-8, with `km`, `lon`, `lat` and `altitude_m`.

## Method

1. 1° × 1° tiles of the Copernicus DEM GLO-90 mosaicked over the frame’s window. Negative
   elevations and the sea (zero in the model) are set to 0.
2. The frame is 105 km tall, centred on 45.2° W and 22.68° S, in a Transverse Mercator
   projection.
3. **Hillshade**: light from the north-west, with relief exaggerated 1.6 times, blended with the
   hypsometric tints of the panel’s scale.
4. **Profile A–B**: 600 points interpolated between A (45.10° W, 22.83° S) and B (44.79° W,
   22.36° S), with distance measured on the ellipsoid. The climb in 5 km is the largest difference
   between the highest and lowest points in a 5 km window sliding along the profile.
5. **Elevation bands**: the grid reduced to 180 m (mean of 2 × 2 pixels), split at 200 m
   intervals and turned into simplified polygons.
6. HydroRIVERS rivers, only those with a mean discharge of 3 m³/s or more, for reference.

## Limitations

- GLO-90 is a **surface** model: it measures the top of the forest and the buildings, not the
  ground. In the forested parts of the range, elevation may sit a few metres above the terrain.
- The 90 m pixel smooths narrow peaks and valleys. Pedra da Mina shows as 2,785 m, below the
  2,798 m surveyed in the field; the same applies to the profile’s climb.
- The vertical exaggeration of the hillshade is a design choice: it helps read the shapes, but
  makes the relief look rougher than it is.
- The colour scale is the same on all three plates of the collection, so that elevations can be
  compared between them.

## Data licence

Copernicus DEM: © DLR e.V. 2010–2014 and © Airbus Defence and Space GmbH 2014–2018, provided
under COPERNICUS by the European Union and ESA. The plate and the derived layers follow the
atlas’s CC BY 4.0 licence, with this attribution.
