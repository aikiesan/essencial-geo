---
# English version (EN-UK). Numbers, files and layers come from README.md.
titulo: "Holiday homes, no mains"
subtitulo: "Where there are more occasional-use homes, fewer homes are connected to the sewer network"

contexto: >-
  Where there are more holiday homes, fewer homes are connected to the sewer network. The rank correlation between the share of occasional-use homes and that of occupied homes with no sewage to the mains (2022 Census) is 0.64 across the 645 municipalities and 0.41 net of urbanisation, density and income; 139 municipalities are in the top third of both. Ibiúna has 71% of homes off the mains and 32% occasional-use homes; Ubatuba, 50% and 62%. Praia Grande, with 42% occasional use and 2% off the mains, shows that both can go together. Ninth plate of the collection “The Census, crossed”.

imagem: ./mapa_preview.en.png
imagem_alt: "Bivariate map of São Paulo’s municipalities in nine colours from a three-by-three grid: ochre grows along the axis of occasional-use homes and lilac along that of homes off the sewer mains; dark brown marks municipalities in the top third of both. Dark brown covers the south coast, the Ribeira Valley and the hills south-east of the capital. Callouts point to Ibiúna, with 71% of homes off the mains and 32% occasional use; Praia Grande, with 42% occasional use and only 2% off the mains; and Ubatuba, with 50% and 62%. In the panel, the grid with the number of municipalities in each cell, the tercile limits and the table of correlations."

recorte: "São Paulo State (SP)"
metodo: "Occasional-use homes and homes off the sewer mains by municipality (IBGE), each split into thirds; the cross gives nine classes. Spearman rank correlation, partial net of the controls, effective sample corrected for spatial autocorrelation and bivariate LISA."
---

# Occasional-use homes and homes off the sewer mains across São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 101, the ninth of ten in the collection **The Census, crossed**; the previous one is [plate 100](../100-letras-e-enxada-sp/README.en.md); the next, [plate 102](../102-pau-de-arara-sp/README.en.md).

The collection grew out of a screen: 4,455 pairs of municipal variables (the 2022 Census and the
bases of other plates in the atlas), of which 4,114 link different families. 834 have a rank
correlation of 0.3 or more and pass the test with the effective sample corrected for spatial
autocorrelation (q < 0.05, Benjamini–Hochberg); 277 stay above 0.3 net of urbanisation, density and
income. Nine of the ten plates come from that last group; the open-truck plate sits just below it
(partial 0.27) and is in for its rare data.

The map’s callouts point to Ibiúna, with 71% of homes off the mains and 32% occasional use; Praia
Grande, with 42% occasional use and only 2% off the mains; and Ubatuba, with 50% and 62%.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities with the variables of all ten plates; for this one, `pct_uso_ocasional`, `pct_sem_esgoto_rede`, the class `b101` (11 to 33: tens = third of occasional-use homes, units = third of homes off the sewer mains) and the cluster `lisa101` |
| `apond` | polygon | The state’s 2,535 weighting areas with age, colour or race, homes and household heads’ income |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The **GPKG** is the same for all ten plates and carries a QGIS style for each. The **CSV** has the
municipal table, without geometry. LISA clusters come as `AA` (high-high), `BB` (low-low), `AB`
(first variable high, second low), `BA` and `ns` (not significant).

## Method

1. `pct_uso_ocasional`: unoccupied private homes for occasional use over all private homes (2022
   Census, full count, tract aggregates).
2. `pct_sem_esgoto_rede`: occupied private homes with sewage neither to the general or storm network
   nor to a septic tank linked to it, i.e. 100 minus `pct_esgoto_rede` (2022 Census, full count).
3. Thirds of the municipalities with data, closed on the right: occasional use up to 5.4%, 5.4% to
   9.5% and over 9.5%; off the mains up to 7.2%, 7.2% to 16.3% and over 16.3%. The class combines both
   thirds (139 municipalities in the top third of both, 142 in the bottom third of both).
4. Spearman rank correlation (0.64, 645 municipalities) and partial correlation: the correlation
   between the residuals of each variable’s ranks regressed on the ranks of the controls, urbanisation
   (residents in urban areas), log of population density and log of household income per head. Result:
   0.41; 0.49 without the São Paulo Intermediate Region.
5. Effective sample under spatial autocorrelation: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), where Iₓ and Iᵧ are
   the Moran’s I of the partial residuals over a 6-nearest-municipality neighbourhood. Here, 516
   effective municipalities; the partial’s test with that sample gives p < 0.001.
6. Bivariate Moran (0.28) and bivariate LISA on standardised ranks, 6 neighbours, 999 permutations
   (seed 20261019), p < 0.05: 86 municipalities in high-high clusters and 90 in low-low.
7. Supporting pairs in the plate’s table: occasional use × cesspit: 0.53 (partial 0.15); occasional
   use × well water: 0.51 (partial 0.06, not significant).

## Limitations

- Ecological reading: the map compares municipalities, not people. A correlation between
  municipalities does not say that the same people have both traits, nor that one causes the other;
  income, age, settlement history and town size may lie behind both.
- Census sewerage counts only occupied homes: a holiday home empty on collection day is not in it.
  The map links holiday homes to the sanitation of the people who live in the municipality, not to
  that of the holiday home itself.
- Cesspits and wells track occasional use but almost vanish net of urbanisation: they mark the
  rural, scattered municipality more than holiday homes.
- Both variables come from the full count of the 2022 Census (or from administrative and
  satellite-mapping bases), with no sampling error; where IBGE marks X (confidentiality), the field is
  left empty, never zero.
- The thirds are relative to São Paulo’s municipalities: São Paulo’s bottom third may sit above the
  average of other states.
