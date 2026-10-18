---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The Serra do Mar"
subtitulo: "Eight hundred metres between port and plateau"

contexto: >-
  Profile A–B leaves the beach at Santos and runs 15 km across the lowland, between the mangroves and the port; apart from a 109 m hill right at the start, it stays a few metres above sea level. Then the Serra do Mar rises over Cubatão: 769 m of climb in 5 km, and at the top begins the plateau, which rolls on at around 760 m to São Bernardo do Campo and São Paulo. The whole slope, from 20 to 700 m, takes up only 596 km² in the frame’s elevation bands, 14% of the land; 72.5% of the ground lies above 700 m. The Anchieta and Imigrantes motorways and the railway climb this wall, and the Billings reservoir’s water is pumped down it to Cubatão. The highest point in the frame, 1,185 m, is in Mogi das Cruzes. Second plate of the collection “The relief of São Paulo”.

imagem: ./mapa_preview.en.png
imagem_alt: "Shaded relief map of the Santos lowland and the São Paulo plateau, between Praia Grande, Santos, Bertioga and São Paulo, in hypsometric tints: the lowland and islands in pale green, the sea in greyish blue and the plateau in ochre. The Serra do Mar scarp crosses the map diagonally, from south-west to north-east, as a narrow, wrinkled band of deep shadow. A dashed line joins A, on the beach at Santos, to B, on the plateau in São Bernardo do Campo, and a callout marks the scarp above Cubatão, with 769 m of climb in 5 km. A triangle shows the highest point, in Mogi das Cruzes. In the panel, the elevation scale and profile A–B: 15 km almost at sea level, an almost vertical climb and the plateau at around 760 m."

recorte: "Santos lowland, Serra do Mar and São Paulo plateau, between Mongaguá, Bertioga and São Paulo (SP)"
metodo: "Copernicus DEM GLO-90 tiles mosaicked, lit from the north-west with relief exaggerated 1.8 times and coloured by elevation band; profile A–B sampled at 600 points."
---

# The Serra do Mar between Santos and the plateau

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 040, the second of three in the collection **The relief of São Paulo**: after the
Mantiqueira, the state’s other wall, the one that divides the coast from the plateau.

## What the files contain

| File / layer | Geometry | Contents |
| --- | --- | --- |
| `serra_do_mar_relevo.tif` | raster | elevation in whole metres, 90 m pixels (3 arc-seconds), clipped to the frame; the sea is 0 |
| `faixas_altitude` | polygon | 10 bands, with limits at 20, 100, 200, 400, 600, 700, 800, 900, 1,000 and 1,200 m: `classe`, `min_m`, `max_m`, `rotulo`, `area_km2` |
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
2. The frame is 80 km tall, centred on 46.35° W and 23.85° S, in a Transverse Mercator
   projection.
3. **Hillshade**: light from the north-west, with relief exaggerated 1.8 times, blended with the
   hypsometric tints of the panel’s scale. The bands are finer at the bottom, so that the lowland
   is not all one colour.
4. **Profile A–B**: 600 points interpolated between A (46.33° W, 23.985° S), on the beach at
   Santos, and B (46.53° W, 23.72° S), on the plateau, with distance measured on the ellipsoid.
   The climb in 5 km is the largest difference between the highest and lowest points in a 5 km
   window sliding along the profile.
5. **Elevation bands**: the grid reduced to 180 m (mean of 2 × 2 pixels), split at the limits in
   the table and turned into simplified polygons; the sea is left out. The share above 700 m given
   in the text is counted pixel by pixel, on the frame’s land.
6. HydroRIVERS rivers, only those with a mean discharge of 3 m³/s or more, for reference.

## Limitations

- GLO-90 is a **surface** model: it measures the top of the forest and the buildings, not the
  ground. In the Atlantic Forest on the slope and among the buildings of Santos, elevation may sit
  a few metres above the terrain.
- The 90 m pixel smooths the scarp: the steepest slopes look less abrupt than they are, and the
  real climb in 5 km may be greater.
- Reservoirs such as the Billings show the elevation of the water surface, not the bottom.
- The vertical exaggeration of the hillshade is a design choice: it helps read the shapes, but
  makes the relief look rougher than it is.

## Data licence

Copernicus DEM: © DLR e.V. 2010–2014 and © Airbus Defence and Space GmbH 2014–2018, provided
under COPERNICUS by the European Union and ESA. The plate and the derived layers follow the
atlas’s CC BY 4.0 licence, with this attribution.
