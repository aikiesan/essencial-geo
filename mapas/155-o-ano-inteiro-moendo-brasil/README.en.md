---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Crushing all year round"
subtitulo: "When the Centre-South stops, the north-eastern coast crushes four tonnes in five"
contexto: >-
  Brazil crushes cane all year round, but not in the same place. In the Centre-South, the harvest starts in April, peaks in July and almost stops from December to March: São Paulo crushes 79% of its cane between April and September. On the north-eastern coast the calendar is reversed: Alagoas, Sergipe and Pernambuco crush 84% to 92% of their cane from October to March, with the harvest starting in September. So in January and February, 80% of the cane crushed in Brazil comes from Alagoas, Pernambuco, Paraíba, Rio Grande do Norte and Sergipe, which account for only 6.5% over the whole year. The biggest month of the three harvests was July 2023, with 105.9 million tonnes; the smallest, February 2025, with 5.0 million. Monthly crush comes from the running totals in the Ministry of Agriculture’s SAPCana reports. Third plate in the collection «Each state’s cane harvest».
imagem_alt: "Map of Brazil in Albers conic projection with states coloured by the share of cane crushed from October to March, adding up the 2023/24 to 2025/26 harvests, in four classes: under 25% (light green), 25 to 50% (green), 50 to 75% (light ochre) and 75% or more (orange-brown), and white for states with no cane. The whole Centre-South (SP, MG, GO, MT, PR, RJ, TO) is light green; Maranhão, Piauí, Pará, Bahia, Mato Grosso do Sul and Espírito Santo green; Amazonas, Paraíba and Rio Grande do Norte light ochre; Pernambuco, Alagoas and Sergipe in the darkest shade. One callout points to Alagoas, with 90% of its crush from October to March; another to São Paulo, with 79% from April to September and a peak in July. In the panel, a heat map of the 19 states over the twelve months, with crushing concentrated from May to October in the Centre-South and from October to February on the north-eastern coast, and bars of Brazil’s average crush by month, with the north-eastern coast’s share reaching 78% in January and 83% in February."
metodo: "Each month’s crush = the harvest running total in the SAPCana/MAPA report minus that of the previous month, by state, from 04/2023 to 03/2026 (36 months); each state’s yearly profile adding up the three harvests; share crushed October to March; the north-eastern coast’s (AL, PE, PB, RN, SE) share of Brazil’s crush by month."
---

# Crushing all year round: each state’s crushing calendar

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 155, the third and last in the collection **Each state’s cane harvest**. After how much
and what for, when: Brazil has two cane calendars, and they take turns.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `ufs` | polygon | 27 states: `cana_3_safras` (t), `fora_pct` (% crushed October to March), `mes_pico`, `pico_pct`, `meses_ativos` (months with 5% or more of the crush), `m04_pct` … `m03_pct` (% of the crush in each month, three harvests added), `classe` (−1 = no cane) |
| `limite_nacional` | polygon | national outline |

The **GPKG** is zipped and attached to the
[`sapcana-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/sapcana-br-2026),
with **QGIS styles** stored inside. The **CSV** sits in this folder, in UTF-8, in long format: one
row per state and month, with the cane crushed (t), sugar (t) and ethanol (m³) of that month.

## Method

1. Monthly SAPCana reports (MAPA), downloaded on 01/11/2026: the harvest running total by state
   since 1 April, one report a month (see plate 153).
2. Month’s crush = the report’s running total minus the previous report’s, within the same harvest
   (the first month of each harvest is the total itself). Four negative differences, mill revisions
   between one month and the next, are set to zero; for cane, only one (RJ, 03/2024, −38 t).
3. Each state’s profile: the crush of each calendar month (April to March) added over the three
   harvests and divided by the three-harvest total. October-to-March share = October, November,
   December, January, February and March added up.
4. North-eastern coast: Alagoas, Pernambuco, Paraíba, Rio Grande do Norte and Sergipe, the states the
   report itself places in the September-to-August harvest (Bahia is listed there too, but mostly
   crushes on the Centre-South calendar). Their share of Brazil’s crush is worked out month by month
   and by calendar month, over the three harvests added up.

## Reading

- São Paulo crushes 79.1% of its cane between April and September, peaking in July (15.9% of the
  year). Paraná, Goiás, Mato Grosso, Minas Gerais and Tocantins have almost identical profiles: 16% to
  20% of the crush from October to March.
- On the north-eastern coast the calendar is reversed: Sergipe crushes 91.7% of its cane from October
  to March, Alagoas 90.4%, Pernambuco 83.5%, Rio Grande do Norte 73.9% and Paraíba 72.7%.
- In January and February, 79.6% of the cane crushed in Brazil came from these five states (78% in
  January, 83% in February); from December to March, 48.1%. Over the whole year they crush 6.5%.
- The biggest month of the three harvests was 07/2023, with 105.9 million t; the smallest, 02/2025,
  with 5.0 million, 4.3 million of it on the north-eastern coast.
- Amazonas crushes from August to November (55% from October to March); Piauí and Maranhão from June
  to October.

## Limitations

- A month’s crush is a difference between running totals; a correction made by a mill in one month
  shows up as more or less crushing in that month.
- The report uses the 1 April–31 March window for every state; the profile adds up calendar months
  and does not depend on where the harvest starts.
- The data are by state: Bahia mixes mills in the south, on the Centre-South calendar, with mills in
  the north, on the coastal one.

## Data licence

Public data from MAPA and IBGE, free to use with attribution.
