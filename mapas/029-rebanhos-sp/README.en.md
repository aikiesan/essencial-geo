---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Livestock"
subtitulo: "Three herds, three geographies"

contexto: >-
  In 2024, São Paulo state held 10.8 million cattle, 1.5 million pigs and 205 million poultry. Side by side, the three herds occupy the state in different ways: cattle spread across the west, led by Presidente Bernardes (151,407 head) and Mirante do Paranapanema (138,268); pigs gather in a few hubs, such as Itu and Cerqueira César, each with over 100,000 head; and poultry cluster in farms, with Bastos alone holding 13.7 million birds. For anyone thinking about biogas, density matters more than the total: many animals on little land also concentrate the manure. Second plate of the collection “Bioenergy in São Paulo”.

imagem: ./mapa_preview.en.png
imagem_alt: "Four panels of São Paulo state. Three maps show the municipalities coloured by the density of cattle, pigs and poultry (head per km², six classes of the plasma palette, from yellow to dark blue), with the three largest herds of each kind named; municipalities without data are hatched, nearly all of them in Greater São Paulo and on the Santos coast. The fourth panel holds the locator map, the leaf-shaped north arrow and notes on how to read the maps."

recorte: "São Paulo state (SP)"
metodo: "Cattle, pig and poultry numbers from PPM 2024 joined to the Municipal Mesh by IBGE code and divided by municipal area; six quantile classes."
---

# Livestock — cattle, pigs and poultry in São Paulo, 2024

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 029, the second of four in the collection **Bioenergy in São Paulo**: after the
biogas plants, where the animals are whose manure can feed them.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `CD_MUN`, `NM_MUN`, intermediate region, `area_km2`, herd size (`bovino`, `suino`, `galinaceos`) and density in head/km² (`dens_bovino`, `dens_suino`, `dens_galinaceos`) |
| `regioes_intermediarias` | polygon | 11 intermediate geographic regions |
| `limite_estadual` | polygon | outline of the state |

The **GPKG** is zipped and attached to the repository’s
[`bioenergia-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/bioenergia-sp-2026),
together with those of the other plates in the collection.

The GPKG carries its own **QGIS styles**. The `municipios` layer has three:
`densidade_bovino` (the default, which opens when you drag the file into QGIS),
`densidade_suino` and `densidade_galinaceos`. To switch, open the layer properties and pick
another style under *Style › Styles*. Classes and colours match the plate; zero shows in light
grey and “no data” in white, each with its own line in the legend.

The **CSV** holds the same municipal table, in UTF-8, without geometry. In both files an empty
cell (NULL) means no data, and 0 means a zero reported by IBGE.

## Method

1. Table 3939 of the Municipal Livestock Survey on SIDRA: variable *Efetivo dos rebanhos*
   (head, on 31 December 2024), products *Bovino*, *Suíno – total* and *Galináceos – total*,
   municipal level, São Paulo state.
2. Joined to IBGE’s 2025 Municipal Mesh by the seven-digit code.
3. Density = herd size ÷ official municipal area (`area_km2`, from the mesh itself), to two
   decimal places.
4. Classes: six quantiles of the municipalities with a positive herd, computed separately for
   each kind; limits are rounded to two significant figures, and the last one is the observed
   maximum. The table’s “-” symbol (absolute zero) becomes 0; “...” (not available) and
   municipalities missing from the table become no data.
5. Intermediate regions and the state boundary are dissolved from the municipalities.
6. On the plate, geometries are simplified as a coverage; the downloadable files keep IBGE’s
   original geometry.

## Limitations

- The 2024 figures are **preliminary results** of the PPM and may be revised by IBGE.
- Herd size is a snapshot on 31 December, not the number slaughtered during the year. In
  broiler farming, which raises several batches a year, the snapshot falls short of the number
  of birds that pass through the farm.
- Density uses the municipality’s total area, not the area of pasture or farms.
- 28 municipalities have no data: 26 marked “...” in the table and 2 (Águas de São Pedro and
  São Caetano do Sul) missing from it. Nearly all are in Greater São Paulo and on the Santos coast.
- *Galináceos – total* adds up cocks, hens, pullets, broilers and chicks: laying and meat birds
  together.
