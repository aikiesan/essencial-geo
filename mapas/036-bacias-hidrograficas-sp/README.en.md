---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "River basins"
subtitulo: "Twenty-two homes for the same rain"

contexto: >-
  To look after its water, São Paulo does not use the map of municipalities but the map of basins: 22 Water Resources Management Units, the UGRHIs. Coloured by the 2022 Census population, they show a state that is unequal under the same rain. The municipalities of Alto Tietê, around the capital, hold 20.5 million people, 46.1% of the state’s population, on 2.4% of its land: 3,456 people per km². In Pontal do Paranapanema there are 20.8. Along the Tietê and the Paraná runs the waterway too, with its eight locks drawn on the map. First plate of the collection “Water in São Paulo”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state divided into its 22 UGRHIs, numbered in white seals and coloured by population density in 2022, on a viridis ramp from yellow (under 43 people per km², in the south and west) to dark purple (over 190, in Alto Tietê, Piracicaba/Capivari/Jundiaí and Baixada Santista). A blue line with diamonds marks the Tietê-Paraná waterway and its eight locks. An arrowed callout points to Alto Tietê: 46.1% of the people on 2.4% of the land. In the panel, an index lists the 22 basins by number."

recorte: "São Paulo state (SP)"
metodo: "Each municipality assigned to the UGRHI covering most of its territory; 2022 Census population summed by UGRHI and divided by basin area, in six quantile classes."
---

# River basins — São Paulo’s 22 UGRHIs and the people in each one

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 036, the first of three in the collection **Water in São Paulo**: the basins the state
uses to manage its water. The next plates follow the drainage network and the protected areas.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `ugrhi` | polygon | 22 UGRHIs: `codigo`, `nome`, `area_km2`, `municipios`, `populacao_2022`, `densidade_hab_km2`, `pct_populacao`, `pct_area` |
| `municipios` | polygon | 645 municipalities: `ugrhi_codigo`, `ugrhi_nome`, `fracao_na_ugrhi` (share of the municipality inside the assigned UGRHI), `populacao_2022` |
| `hidrovia` | line | Tietê-Paraná waterway |
| `eclusas` | point | Barra Bonita, Bariri, Ibitinga, Promissão, Nova Avanhandava, Três Irmãos, Jupiá and Porto Primavera |
| `limite_estadual` | polygon | outline of the state |

The **GPKG** is zipped and attached to the
[`agua-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/agua-sp-2026).
The `ugrhi` layer carries two **QGIS styles**: `densidade` (the default, as on the plate) and
`contorno`, with outlines, number and name only, to lay over other maps.

The **CSV** holds the table of the 22 UGRHIs, in UTF-8, without geometry.

## Method

1. Polygons of the 22 UGRHIs from GeoSEADE (as defined by the State Water Resources Council). Names
   follow the official spelling; the original table is in capitals.
2. Area of each UGRHI in km², computed in the Albers equal-area conic projection IBGE uses for
   Brazil.
3. Each municipality in the 2025 Municipal Mesh is assigned to the UGRHI covering most of its
   territory, by overlaying the geometries.
4. Resident population from the 2022 Census (IBGE aggregates by municipality), summed by UGRHI;
   density = population ÷ UGRHI area.
5. Classes: six quantiles of the 22 densities, limits rounded to two significant figures; the last
   one is the maximum.
6. Waterway and locks from the MapBiomas infrastructure database, clipped to São Paulo (including
   the stretches of the Paraná river on the border).

## Limitations

- 179 municipalities have less than 90% of their territory in the UGRHI they were given: their
  whole population counts for a single basin. The official State Water Resources Council division,
  which assigns each municipality by its seat, may differ in a few cases.
- Density uses the basin’s total area, reservoirs, floodplains and protected areas included.
- The GeoSEADE UGRHI outlines and the 2025 Municipal Mesh boundary do not match exactly along the
  coast and the borders; the sum of UGRHI areas differs slightly from the state’s area.
