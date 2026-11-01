---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Maize enters the distillery"
subtitulo: "In eight years, a quarter of ethanol came to be made from grain"
contexto: >-
  In 2018, maize made about 2.5% of Brazil’s ethanol; in the twelve months to August 2026, it made 26%. Distilleries processed 24.4 million tonnes of the grain, almost thirteen times the 2018 amount, and since a tonne of maize yields about 5.7 times the ethanol of a tonne of cane, maize, with only 6.7% of the tonnes processed, already accounts for a quarter of the fuel. The change has an address: in Mato Grosso, 83% of ethanol now comes from maize, and in Maranhão, 82%; Mato Grosso do Sul and Bahia are above a third, Goiás reaches 16%, and São Paulo, the largest producer, sticks to cane. The ANP does not publish feedstock by distillery; each state’s share is estimated from the yield seen in months when a state processed only maize. Second plate in the collection «The new geography of ethanol».
imagem_alt: "Three maps of Brazil in Albers conic projection, at the same scale, with the states coloured by the estimated share of ethanol made from maize: 2018, 2022 and the twelve months from 09/2025 to 08/2026, in five classes from beige to dark brown, grey for states that make ethanol without maize and white for those that make none. In 2018, only Mato Grosso (33%) and Goiás (5%) are really tinted, with a pale tone in São Paulo and Paraná; in 2022, Mato Grosso darkens and Mato Grosso do Sul comes in; in the latest period, Mato Grosso and Maranhão take the darkest tone, Mato Grosso do Sul and Bahia the middle one, Goiás and Pará the light one. On the third map, circles mark distillery capacity by municipality in those states, filled where there was no distillery in 2018. In the fourth frame, a line shows maize’s share of national ethanol rising from 2.5% in 2018 to 26.3%; the panel holds the table of the eight maize-processing states."
metodo: "Tonnes of maize processed in each state (ANP) converted into ethanol at the median yield of the state-months in which maize was the only feedstock (0.43 m³/t), capped at the state’s output and divided by it, in 2018, 2022 and 09/2025–08/2026."
---

# Maize enters the distillery: maize’s share of each state’s ethanol, 2018 to 2026

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 133, the second in the **The new geography of ethanol** collection. After where capacity
sits, what it is made from: the maize that has entered the distilleries of the Centre-West and of
Matopiba.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `ufs` | polygon | 27 states: `SIGLA_UF`, `regiao` and, for `2018`, `2022` and `12m` (09/2025–08/2026), `milho_t_*`, `etanol_m3_*`, `pct_milho_t_*`, `pct_milho_etanol_*` (estimate) and `classe_*` (−1 no maize, −2 no ethanol) |
| `destilarias` | point | 231 municipalities in the maize-processing states: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `cap_2026`, `usinas_2026`, `cap_2018` (m³/day), `estreante` (no capacity in 12/2018), `lon`, `lat` |
| `limite_nacional` | polygon | national boundary |

The **GPKG** is zipped and attached to the
[`etanol-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/etanol-br-2026).
The `ufs` layer carries three **QGIS styles**, one per period (the default is the latest twelve
months), and `destilarias` the filled and hollow circles. The **CSV** sits in this folder, in
UTF-8, with the states table without geometry.

## Method

1. The ANP Ethanol Producers Dynamic Panel (`pb-da-etanol.zip`, downloaded on 18/10/2026):
   `Etanol_MatériaPrima.csv`, tonnes processed by state, month and feedstock (sugarcane, molasses,
   maize, cane bagasse or straw, and others), and `Etanol_Produção.csv`, anhydrous and hydrous
   ethanol produced by state and month, in m³. Both files are used from 01/2018 to 08/2026. For
   2017, the feedstock file records 640 million t of cane, almost double any later year, for less
   ethanol; that year was left out.
2. Yield: in the state-months in which maize was the only feedstock processed and there was
   output, m³ of ethanol per tonne of maize. Median 0.43 m³/t (quartiles 0.408 and 0.453; 29
   state-months, in Bahia, Goiás, Maranhão, Mato Grosso and Paraná). By the same rule, cane gives
   0.075 m³/t (quartiles 0.064 and 0.086; 464 state-months): maize yields about 5.7 times more per
   tonne.
3. Maize ethanol for each state and period: tonnes of maize × 0.43, capped at the state’s output.
   Maize’s share is that volume divided by output. The maps use 2018, 2022 and the twelve months
   from 09/2025 to 08/2026; the line in the fourth frame, each year from 2018 to 2025 and those
   twelve months.
4. Classes: up to 5%, 5 to 20%, 20 to 50%, 50 to 80% and 80% or more. Grey: the state made ethanol
   without maize; white: it made no ethanol in the period.
5. Distilleries on the third map: authorised capacity (the larger of anhydrous and hydrous) summed
   by municipality in 08/2026, in the eight states that processed maize in the last twelve months —
   274 distilleries in 231 municipalities, 239.3 thousand m³/day. The circle is filled where the
   municipality had no capacity in 12/2018 (18 municipalities, 23.1 thousand m³/day). One
   distillery registered in Bauru (SP) with zero capacity is left out. Each municipality is drawn at
   an interior point of its polygon.

## Reading

- In 2018, only Mato Grosso had a sizeable share (33%); Goiás came next, with 5%. By 2022, Mato
  Grosso already made 75% of its ethanol from maize and Mato Grosso do Sul, 15%.
- In the twelve months to 08/2026, maize was 53% of the tonnes processed in Mato Grosso and
  Maranhão; since it yields more, it became 82–83% of those states’ ethanol.
- São Paulo processed 23 thousand t of maize in the period, 0.02% of its tonnes.

## Limitations

- It is an estimate. The ANP publishes feedstock and output by state and month, not by distillery;
  the calculation assumes that the yield of maize-only months holds for the states and months in
  which maize shares the distillery with cane.
- The distilleries map does not say which of them use maize: it shows capacity in the states that
  process maize and where that capacity is new. Flex plants, which crush cane in the harvest and
  maize in the off-season, look like any other.
- The cap at the state’s output trims overshoots of the estimate; in states where maize is almost
  everything, the real share may be slightly higher or lower.
- Authorised capacity is not output.

## Data licence

ANP and IBGE open data, free to use with attribution.
