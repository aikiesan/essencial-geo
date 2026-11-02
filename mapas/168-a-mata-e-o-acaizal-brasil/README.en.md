---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Forest and orchard"
subtitulo: "Cultivated açaí is now 8 times the forest harvest"
contexto: >-
  In 2025 Brazil gathered 251 thousand tonnes of açaí in the forest and grew 2.02 million tonnes in orchards: cultivated açaí is now 8 times the wild harvest. In 2015, the first year the Municipal Agricultural Survey counted açaí, the forest supplied 18% of the total; by 2025, 11%. Gathering has not shrunk: it is up 82% since 1986, from 138 thousand to 251 thousand tonnes, and has spread from 79 to 321 municipalities. Cultivation simply grew far faster. Pará yields 90% of all açaí, and Igarapé-Miri alone grew 421 thousand tonnes, 1.7 times the forest açaí of the whole country. In Amazonas, 37% still comes from the forest. The pulp is the thin part of the fruit; the pit, most of its mass, is left behind at the pulping shop. First plate in the collection «Gathered from the forest».
imagem_alt: "Map of Brazil in Albers conic projection with circles proportional to the tonnes of açaí in 2025 in each municipality (forest plus cultivated), coloured by the share that came from the forest: dark green for 90% or more, light green for 50 to 90%, lilac for 10 to 50% and purple for under 10%. The largest circles, purple, crowd north-eastern Pará around Belém and the lower Tocantins; green dots are scattered across Amazonas, Amapá and Maranhão. One callout points to Igarapé-Miri (PA), with 421 thousand tonnes cultivated, and another to Amazonas, where 37% of açaí comes from the forest. In the panel, a line of forest gathering from 1986 to 2025, nearly flat at about 250 thousand tonnes, a purple area of cultivation rising from 1 million in 2015 to 2 million in 2025, and stacked bars for the ten largest municipalities, all in Pará."
metodo: "Tonnes of açaí fruit by municipality in 2025: plant extraction (PEVS, table 289) plus orchards (PAM, table 5457); forest share = extraction ÷ (extraction + cultivation). National series = sum of municipalities, 1986–2025 for extraction and 2015–2025 for cultivation."
---

# Forest and orchard: açaí gathered and cultivated by municipality, 2025, and the series since 1986

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 168, the first in the collection **Gathered from the forest**. Açaí is Brazil’s
largest extractive product by volume, yet most of the fruit now comes from stands reported as
orchards.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `municipios` | point | 437 municipalities with açaí in 2025: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `extrativo_1986`, `extrativo_2015`, `cultivado_2015`, `total_2015`, `extrativo_2025`, `cultivado_2025`, `total_2025` (t), `pct_mata_2025`, `classe` (0 = 90% or more from the forest … 3 = under 10%), `lon`, `lat` |
| `ufs` | polygon | 27 states: `extrativo_2015`, `cultivado_2015`, `extrativo_2025`, `cultivado_2025`, `total_2025` (t) |
| `limite_nacional` | polygon | national boundary |

The **GPKG** is zipped in the assets of the
[`biomassa-da-mata-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/biomassa-da-mata-br-2026),
with the **QGIS styles** saved inside (circles by class, sized by tonnes). The two **CSV** files sit
in this folder, in UTF-8: the municipalities and the national yearly series.

## Method

1. PEVS, SIDRA table 289: tonnes of açaí fruit gathered by municipality, 1986 to 2025. PAM, table
   5457: tonnes of açaí grown in orchards by municipality, from 2015 (the product’s first year in
   the PAM) to 2025. Downloaded from the SIDRA API on 01/11/2026.
2. «-» in the tables is zero; cells with no information («..», «...») count as no output. No cells
   are suppressed. Every municipality with output exists in the 2025 mesh.
3. Municipal total = extraction + cultivation; forest share = extraction ÷ total. Four classes: 90%
   or more, 50 to 90%, 10 to 50% and under 10%.
4. National series: the sum of municipalities each year. It differs by a few tonnes from the
   national total published in table 289 (251,041 t against 251,032 t in 2025), through rounding.

## Reading

- 2025: 251,041 t of forest açaí and 2,018,693 t from orchards; cultivation is 8.0 times
  extraction. The forest gave 11.1% of the total, against 17.6% in 2015 (216 thousand t against
  1.01 million t).
- Gathering is up 82% since 1986 (137,599 t) and has spread from 79 to 321 municipalities.
  Cultivation went from 113 municipalities in 2015 to 329 in 2025.
- Of the 437 municipalities with açaí in 2025, 120 take 90% or more from the forest, 46 between 50
  and 90%, 71 between 10 and 50% and 200 under 10%; those 200 add up to 1.70 million t.
- Pará has 90% of all açaí and 67% of forest açaí. The ten largest municipalities are all in Pará;
  Igarapé-Miri grew 421,304 t, 1.7 times all the gathering in Brazil. Limoeiro do Ajuru is the
  largest gatherer (49 thousand t from the forest and 66 thousand cultivated).
- In Amazonas, 37% of açaí still comes from the forest (57.5 thousand t of 153.7 thousand); Codajás
  gathered 12.5 thousand t and grew 33 thousand.
- The pulp is the thin part of the fruit; the pit, most of its mass, is left behind at the pulping
  shop as waste. The figures are for the whole fruit.

## Limitations

- On the floodplain the line between forest and orchard is thin: managed native açaí stands may be
  reported as cultivation. The split between the two tables is one of survey, not necessarily of
  landscape.
- The PAM records açaí only from 2015; cultivation existed before but was not counted, so the
  series cannot say when it overtook gathering.
- Both surveys are municipal estimates from informants, not measurements.
- The figures are for the fruit; the plate makes no estimate of pulp, pit or energy.

## Data licence

IBGE open data, free to use with attribution.
