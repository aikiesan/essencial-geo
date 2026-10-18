---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The cuestas of São Paulo"
subtitulo: "The basalt step"

contexto: >-
  In the middle of the state, the western São Paulo plateau ends in a step: the cuestas, scarps where the layers of basalt and sandstone break off all at once, facing the Peripheral Depression. Profile A–B leaves the depression near São Pedro, at 500 m, rises to a first plateau at 956 m, dips into a valley at 537 m and climbs the Itirapina cuesta: 543 m of climb in 5 km, up to 1,081 m. On the far side, the ground falls to the Corumbataí valley, at around 640 m. The highest point in the frame, 1,084 m, is right there, in Itirapina; between it and the lowest point lie 671 m. In the south-west, the Botucatu cuesta draws the same step. In the 15,399 km² frame, only 12.3% of the ground lies above 800 m. Third plate of the collection “The relief of São Paulo”.

imagem: ./mapa_preview.en.png
imagem_alt: "Shaded relief map of central São Paulo, between Jaú, São Carlos, Piracicaba and Botucatu, in ochre and cream hypsometric tints, with relief exaggerated four times. In the north and south-west, the higher, smoother plateaus, in darker ochre, end in jagged, deeply shadowed edges facing east: the Itirapina and Botucatu cuestas. In the centre and south-east, the lower, wrinkled depression, cut by the Tietê and Piracicaba rivers. A dashed line joins A, near São Pedro, to B, near Corumbataí, passing the highest point, in Itirapina, marked by a triangle and a callout: 1,084 m, with 543 m of climb in 5 km. In the panel, the elevation scale and profile A–B, with two peaks and the climb up the cuesta highlighted."

recorte: "Central São Paulo state, between Jaú, São Carlos, Piracicaba and Botucatu (SP)"
metodo: "Copernicus DEM GLO-90 tiles mosaicked, lit from the north-west with relief exaggerated 4 times and coloured by elevation band; profile A–B sampled at 600 points, drawn through the frame’s steepest local relief."
---

# The cuestas of central São Paulo

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 041, the last of three in the collection **The relief of São Paulo**: after the two
eastern ranges, the quieter step of the interior, where the western plateau meets the Peripheral
Depression.

## What the files contain

| File / layer | Geometry | Contents |
| --- | --- | --- |
| `cuestas_relevo.tif` | raster | elevation in whole metres, 90 m pixels (3 arc-seconds), clipped to the frame |
| `faixas_altitude` | polygon | 7 bands every 100 m: `classe`, `min_m`, `max_m`, `rotulo`, `area_km2` |
| `perfil` | line | the A–B line: `de`, `para`, `comp_km` |
| `ponto_mais_alto` | point | `altitude_m`, `nome` |
| `municipios` | polygon | municipalities clipped to the frame: `CD_MUN`, `NM_MUN` |

The **GPKG** and the **GeoTIFF** are zipped and attached to the
[`relevo-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/relevo-2026).
The GPKG carries the plate’s **QGIS styles**; the GeoTIFF comes with a `.qml` of the same name,
which QGIS applies on its own when the file is opened. The profile **CSV** sits in this folder,
in UTF-8, with `km`, `lon`, `lat` and `altitude_m`.

## Method

1. 1° × 1° tiles of the Copernicus DEM GLO-90 mosaicked over the frame’s window.
2. The frame is 125 km tall, centred on 48.15° W and 22.62° S, in a Transverse Mercator
   projection.
3. **Hillshade**: light from the north-west, with relief exaggerated 4 times, more than on the
   collection’s other plates, because the differences in height here are smaller; the
   hypsometric tints use the same scale on all three plates.
4. **Profile A–B**: the line passes through the frame’s steepest local relief, searched in a 3 km
   window over the whole grid, with the direction chosen among several to cross the scarp. It has
   600 points interpolated between A (48.08° W, 22.596° S) and B (47.62° W, 22.306° S), with
   distance measured on the ellipsoid. The climb in 5 km is the largest difference between the
   highest and lowest points in a 5 km window sliding along the profile.
5. **Elevation bands**: the grid reduced to 180 m (mean of 2 × 2 pixels), split every 100 m and
   turned into simplified polygons.
6. HydroRIVERS rivers, only those with a mean discharge of 3 m³/s or more, for reference.

## Limitations

- GLO-90 is a **surface** model: it measures the top of the forest, the eucalyptus stands and the
  buildings, not the ground. Over plantations, elevation may sit more than ten metres above the
  terrain.
- The 90 m pixel smooths the scarp edges, which are narrow: the real climb in 5 km may be greater.
- The fourfold exaggeration makes the cuestas look higher than they are; compare the three plates
  by the colour scale and the profiles, not by the shadows.
- The frame’s lowest point falls on the rivers and reservoirs, where the model measures the water
  surface.

## Data licence

Copernicus DEM: © DLR e.V. 2010–2014 and © Airbus Defence and Space GmbH 2014–2018, provided
under COPERNICUS by the European Union and ESA. The plate and the derived layers follow the
atlas’s CC BY 4.0 licence, with this attribution.
