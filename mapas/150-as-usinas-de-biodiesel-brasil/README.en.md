---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The biodiesel plants"
subtitulo: "Capacity has doubled since 2018, and a third of it sits idle"
contexto: >-
  Brazil has 59 biodiesel plants authorised by the ANP, with 44.2 thousand m³ a day of capacity, double the 21.8 thousand m³ of January 2018. They cluster in the Centre-West and the South: Mato Grosso has 17 plants and 24% of capacity, with Rio Grande do Sul, Goiás and Paraná close behind. Since 2018, 17 municipalities have gained their first plant and 8 have lost theirs. In the twelve months to September 2026, the plants made 10.4 million m³, 66% of what their capacity would allow; the South and the Northeast used about 73%, the North and the Southeast 56%. In 2022, when the blend went back to 10%, use fell to 47%. First plate in the collection «Where biodiesel comes from».
imagem_alt: "Map of Brazil in Albers conic projection with circles proportional to authorised biodiesel capacity in each municipality, in September 2026 (disc) and January 2018 (ring), coloured in five categories: gained a plant, grew, unchanged, shrank and lost its plant. The circles cluster in Mato Grosso, Goiás, Paraná and Rio Grande do Sul; one callout points to Rondonópolis (MT), with 3,002 m³ a day in three plants, and another to the South, which used 73% of its capacity. In the panel, bars of capacity by state, bars of output against capacity in each region and a line of national capacity use from 2018 to the last twelve months, with a low of 47% in 2022."
metodo: "Authorised capacity of each biodiesel plant (ANP) summed by municipality in 01/2018 and 09/2026; capacity use = the region’s output in the twelve months from 10/2025 to 09/2026 divided by the month-by-month sum of authorised capacity × days in the month."
---

# The biodiesel plants: capacity by municipality, 2018 to 2026, and how much of it is used

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 150, the first in the collection **Where biodiesel comes from**. Before the feedstock and
the fuel’s journey, where the factories are and how much of their capacity turns into biodiesel.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | point | 61 municipalities with a plant in 01/2018 or 09/2026: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `usinas_2018`, `cap_2018`, `usinas_2026`, `cap_2026` (m³/day), `variacao_m3d`, `categoria`, `lon`, `lat` |
| `regioes` | polygon | 5 macro-regions: `capacidade_m3_12m` (capacity × days), `producao_m3_12m`, `uso_pct_12m` (10/2025–09/2026) |
| `ufs` | polygon | 27 states: `usinas_2026`, `cap_2026`, `cap_2018` (m³/day) |
| `limite_nacional` | polygon | national outline |

The **GPKG** is zipped and attached to the
[`biodiesel-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/biodiesel-br-2026),
with **QGIS styles** stored inside (circles by category, sized by capacity). The **CSV** sits in this
folder, in UTF-8, with the municipality table and no geometry.

## Method

1. Open data from the ANP Biodiesel Producers Dynamic Panel (`pb-da-biodiesel.zip`, downloaded on
   01/11/2026, files dated 27/10/2026): `Biodiesel_DadosAbertos_CSV_Capacidade.csv`, authorised
   capacity in m³/day by plant (CNPJ), municipality and month, from 01/2018 to 09/2026, and
   `Biodiesel_DadosAbertos_CSV_Produção.csv`, output in m³ by macro-region and month.
2. Capacity by municipality: sum of the plants in 01/2018 (49 plants, 21.8 thousand m³/day) and in
   09/2026 (59 plants from 48 companies by CNPJ root, 44.2 thousand m³/day, in 53 municipalities).
   Each municipality is drawn at a point inside its polygon; all ANP names match IBGE’s.
3. Categories: gained a plant (no capacity in 01/2018), lost its plant (no capacity in 09/2026),
   grew, shrank or unchanged.
4. Capacity use: the ANP publishes output by region, not by plant or state. For each region, output
   over the twelve months from 10/2025 to 09/2026 divided by the month-by-month sum of the region’s
   authorised capacity times the days in the month. The panel line does the same sum for Brazil in
   each year from 2018 to 2025 and in those twelve months.

## Reading

- Mato Grosso has 17 plants and 10.8 thousand m³/day (24% of the country); Rio Grande do Sul, 9
  plants and 9.4 thousand; Goiás, 8 and 6.4 thousand; Paraná, 4 and 4.5 thousand.
- Rondonópolis (MT) is the municipality with the most capacity: 3 plants, 3,002 m³/day (1,512 in
  01/2018). The largest single plant is in Lapa (PR), with 2,500 m³/day; the median is 625 m³/day.
- Between 01/2018 and 09/2026, 17 municipalities gained their first plant (10.8 thousand m³/day), 24
  grew (+12.8 thousand), 11 did not change, 1 shrank and 8 lost their plant (−1.3 thousand m³/day).
- In the twelve months to 09/2026, the plants made 10.4 million m³, 66.3% of what their capacity
  would allow. By region: Northeast 73.6%, South 72.8%, Centre-West 62.5%, Southeast 56.3%, North
  55.6%.
- National use stood at 63% to 65% between 2018 and 2020, fell to 47.4% in 2022, a year with a 10%
  blend throughout, and rose again with the 14% blend (from 03/2024) and the 15% blend (from
  08/2025): 66.3% in the last twelve months.

## Limitations

- Authorised capacity is not effective capacity: it is the ceiling the ANP authorises a plant to
  produce.
- Use is worked out by region, because the ANP does not publish output by plant or state; within a
  region, some plants stand idle and others run full.
- The capacity panel starts in 01/2018; plants closed before then do not appear.
- A plant that changes CNPJ in the same municipality shows as «unchanged» if its capacity stays the
  same; the category belongs to the municipality, not the company.

## Data licence

ANP and IBGE open data, free to use with attribution.
