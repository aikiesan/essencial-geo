---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The year of the cows"
subtitulo: "In 2025, 47% of the cattle slaughtered were female, the highest in a series begun in 1997, and the herd shrank"
contexto: >-
  In 2025, Brazil slaughtered 42.95 million cattle under inspection, 55% more than in 2021, and 46.9% of them were cows and heifers, the highest share in a series begun in 1997; the previous peak was 43.4%, in 2006, and the recent low 33.7%, in 2021. This is the cattle cycle: when calves fetch little, ranchers sell their breeding cows, slaughter rises and the herd shrinks, from 238.6 million head in 2023 to 234.3 million in 2025 (−1.8%). In Pará, females went from 32% to 56% of slaughter; in São Paulo, whose plants take in steers from other states, they stayed at 35%. In the first half of 2026 the share was still 49.5%, against 50.0% a year earlier. Chicken and pork have no such cycle and grew without a pause. Third plate in the collection «Where livestock becomes residue».
imagem_alt: "Map of Brazil by state coloured by the share of cows and heifers in cattle slaughter in 2025, in five classes from pale beige (under 35%) to dark brown (55% or more), with hatching on states whose data the IBGE withholds, and rings proportional to total cattle slaughtered. Pará and Piauí show in the darkest shade; Mato Grosso, Maranhão, Rio Grande do Sul and Santa Catarina in the next; São Paulo, Ceará and Sergipe in beige; Amazonas, Rondônia, Tocantins and Bahia hatched. One callout points to Pará, with 56% female against 32% in 2021, and another to São Paulo, with 35%. In the panel, a line of the female share over bars of national cattle slaughter from 1997 to 2025, marking the previous peak of 43.4% in 2006, the low of 33.7% in 2021 and 46.9% in 2025, and lines of pig, cattle and chicken slaughter with 2015 equal to 100."
metodo: "Female share = (cows + heifers) ÷ total cattle slaughtered, across all types of inspection, summing the year’s four quarters (IBGE, table 1092); by state in 2021 and 2025, and for Brazil from 1997 to 2025 and in the first halves of 2025 and 2026. Cattle herd from the Municipal Livestock Survey."
---

# The year of the cows: females in cattle slaughter by state, 2025, and the series since 1997

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 164, the third in the collection **Where livestock becomes residue**. Cattle slaughter does
not climb in a straight line like chicken and pork: it follows the herd cycle. When ranchers sell
their breeding cows, slaughter rises, and with it what is left behind at the plants; years later,
the herd holds on to its females and slaughter falls.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `ufs` | polygon | 27 states: `bovinos_abatidos_2021`, `bovinos_abatidos_2025`, `femeas_2025`, `femeas_pct_2021`, `femeas_pct_2025`, `classe` (−1 = withheld) |
| `abate_bovinos` | point | 24 states with `bovinos_abatidos_2025`, at the state’s interior point |
| `limite_nacional` | polygon | national outline |

The **GPKG** is zipped and attached to the
[`abate-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/abate-br-2026),
with **QGIS styles** stored inside (colour by class, ring by total slaughtered). The **CSVs** sit in
this folder, in UTF-8: the states and the national series.

## Method

1. IBGE Quarterly Survey of Animal Slaughter (SIDRA table 1092, fetched through the API on
   01/11/2026): cattle slaughtered by type (steers, cows, bullocks, heifers), state and quarter,
   across all types of inspection.
2. Female share = (cows + heifers) ÷ total slaughtered, summing the year’s four quarters. If any
   quarter in a state is withheld («X»), the share is left blank. Classes: under 35%; 35 to 42%; 42
   to 48%; 48 to 55%; 55% or more.
3. National series from 1997 to 2025 by the same sum, plus the first halves of 2025 and 2026. Pig
   and chicken slaughter (tables 1093 and 1094) appear as an index with 2015 equal to 100.
4. National cattle herd from the Municipal Livestock Survey (table 3939), 2015 to 2025.

## Reading

- In 2025, 46.85% of the 42.95 million cattle slaughtered were cows and heifers, the highest since
  1997. The previous peak was 43.4%, in 2006; the recent low, 33.7%, in 2021.
- Cattle slaughter grew 55% between 2021 (27.7 million) and 2025. The herd rose to 238.6 million in
  2023 and fell to 234.3 million in 2025 (−1.8%).
- In the first half of 2026 the female share was 49.5%, against 50.0% in the first half of 2025:
  breeding cows are still going to slaughter in large numbers.
- In Pará, females went from 32.0% of slaughter in 2021 to 55.7% in 2025, with 3.99 million head
  slaughtered. Piauí (75.5%), Rio Grande do Sul (54.7%), Maranhão (49.6%) and Mato Grosso (48.7%)
  are also high.
- São Paulo stands at 35.0% (26.1% in 2021): its plants take in mostly steers and bullocks from
  other states (plate 163). Pernambuco (21.5%) and Rio Grande do Norte (34.0%) sit under 35%.
- With 2015 equal to 100, pig slaughter reached 155 in 2025, cattle 140 and chickens 116.

## Limitations

- The IBGE only counts inspected slaughter (federal, state or municipal).
- States with any quarter withheld are left blank: RO, TO, BA, AC, AM, ES, RJ, AP, DF and PB.
  Rondônia, Tocantins and Bahia slaughter a great deal but are left out of the colour map; the rings
  show the total slaughtered wherever it is published.
- The female share belongs to the state where the animal is slaughtered, not where it was raised.
- The cattle cycle is described in qualitative terms; the plate projects neither slaughter nor herd.

## Data licence

IBGE open data, free to use with attribution.
