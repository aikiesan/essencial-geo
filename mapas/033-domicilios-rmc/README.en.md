---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Households per km²"
subtitulo: "Half the homes on 3.4 % of the ground"

contexto: >-
  The 2022 Census counted 1,157,476 occupied households in the 20 municipalities of the Campinas Metropolitan Region, home to 3,179,156 people. Half of those homes fit into 129 km², 3.4% of the region’s area. The map colours each of the 6,548 census tracts by households per km² and shows the city in layers: central Campinas and the neighbourhoods of Sumaré, Hortolândia and Americana above 5,000, the fringe of housing estates between 1,000 and 5,000 and, all around, the countryside, below 100. Hortolândia is the densest municipality, with 1,295 households per km²; Morungaba the least dense, with 33. Second plate of the collection “Campinas Metropolitan Region”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of the Campinas Metropolitan Region with its 6,548 census tracts coloured by occupied households per km² in 2022, on a viridis ramp: cream up to 100, green from 100 to 1,000, teal and petrol blue from 1,000 to 5,000, indigo and deep purple above 5,000. Purple and blue gather in central Campinas and in the cores of Hortolândia, Sumaré, Americana, Santa Bárbara d'Oeste and Indaiatuba; cream covers the countryside, especially in the east. A callout points to Hortolândia, the densest municipality, with 1,295 households per km². In the panel, each class has a bar with its share of the region’s households, and another list compares the municipalities."

recorte: "Campinas Metropolitan Region (SP)"
metodo: "Occupied private households in each 2022 Census tract divided by the tract’s area, in six fixed-break classes."
---

# Households per km² in the census tracts of the Campinas Metropolitan Region

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 033, the second of four in the collection **Campinas Metropolitan Region**: after the
ground seen from the satellite, where people live, tract by tract.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `setores` | polygon | 6,548 tracts: `CD_SETOR`, `CD_MUN`, `NM_MUN`, `NM_BAIRRO`, `situacao` (urban or rural), `area_km2`, `pessoas` (people), `domicilios_ocupados`, `dom_km2` |
| `municipios` | polygon | 20 municipalities: `domicilios`, `pessoas`, `area_km2`, `setores`, `dom_km2` |

The **GPKG** is zipped and attached to the
[`rmc-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/rmc-2026).
The `setores` layer carries the plate’s **QGIS style** (`densidade`), and `municipios` an outline
style with each municipality’s name, to lay on top.

The **CSV** holds the tract table in UTF-8, without geometry.

## Method

1. IBGE’s 2022 Census Tract Mesh, filtered to the region’s 20 municipalities.
2. People and occupied private households in each tract, from the 2022 Census tract aggregates.
3. Density = occupied households ÷ tract area (the area given by IBGE in the mesh).
4. Six round, fixed breaks: up to 100, 100 to 1,000, 1,000 to 2,500, 2,500 to 5,000, 5,000 to
   10,000 and over 10,000 households per km². The breaks are the same across the region, so that
   municipalities can be compared.
5. Half the households: tracts are sorted from densest to least dense, and their areas added up
   until they hold 50% of the households.
6. In the panel, the density of a whole municipality adds up the households and areas of its
   tracts.

## Limitations

- A census tract is a collection unit, not a regular grid: large rural tracts dilute a whole
  village into a low density, and small urban tracts of tower blocks jump to the top class.
- Only **occupied private** households are counted; vacant, occasional-use and collective
  dwellings (care homes, barracks, lodgings) are left out.
- 176 tracts have no occupied household (industrial areas, parks and other places without homes)
  and appear in light grey.
- IBGE’s statistical grid, in regular cells, would give a different picture; the tract was kept
  because that is where the Census publishes the income shown in the next plate.
