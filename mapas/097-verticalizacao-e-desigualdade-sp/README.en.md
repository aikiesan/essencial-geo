---
# English version (EN-UK). Numbers, files and layers come from README.md.
titulo: "High-rises and inequality"
subtitulo: "The higher a town builds, the more income varies from one neighbourhood to the next"

contexto: >-
  The higher a town builds, the more income varies from one neighbourhood to the next. The rank correlation between income inequality across census tracts (weighted coefficient of variation of household heads’ income) and the share of homes in flats (2022 Census) is 0.69 across 570 municipalities and 0.45 net of urbanisation, density and income. São Paulo has 36% of homes in flats and a coefficient of 0.94; Barueri, 31% and 1.02. In 253 municipalities there is not a single home in a flat. High-rises mark the town that splits into rich and poor districts, without the map saying which came first. Fifth plate of the collection “The Census, crossed”.

imagem: ./mapa_preview.en.png
imagem_alt: "Bivariate map of São Paulo’s municipalities in nine colours from a three-by-three grid: ochre grows along the axis of income inequality between tracts and lilac along that of homes in flats; dark brown marks municipalities in the top third of both. Dark brown clusters in the east, from Greater São Paulo to Campinas and the Paraíba Valley; municipalities with fewer than 10 tracts are hatched. Callouts point to São Paulo, with 36% of homes in flats and a coefficient of 0.94; Barueri, with 31% and 1.02, the highest above 200,000 inhabitants; and Cordeirópolis, with 6.2% and similar incomes across town. In the panel, the grid with the number of municipalities in each cell, the tercile limits and the table of correlations."

recorte: "São Paulo State (SP)"
metodo: "Income inequality between tracts and homes in flats by municipality (IBGE), each split into thirds; the cross gives nine classes. Spearman rank correlation, partial net of the controls, effective sample corrected for spatial autocorrelation and bivariate LISA."
---

# High-rise housing and income inequality between tracts across São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 097, the fifth of ten in the collection **The Census, crossed**; the previous one is [plate 096](../096-segregacao-e-desigualdade-racial-sp/README.en.md); the next, [plate 098](../098-a-cor-da-juventude-sp/README.en.md).

The collection grew out of a screen: 4,455 pairs of municipal variables (the 2022 Census and the
bases of other plates in the atlas), of which 4,114 link different families. 834 have a rank
correlation of 0.3 or more and pass the test with the effective sample corrected for spatial
autocorrelation (q < 0.05, Benjamini–Hochberg); 277 stay above 0.3 net of urbanisation, density and
income. Nine of the ten plates come from that last group; the open-truck plate sits just below it
(partial 0.27) and is in for its rare data.

The map’s callouts point to São Paulo, with 36% of homes in flats and a coefficient of 0.94;
Barueri, with 31% and 1.02, the highest above 200,000 inhabitants; and Cordeirópolis, with 6.2% and
similar incomes across town.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities with the variables of all ten plates; for this one, `cv_renda_setores`, `pct_apartamento`, the class `b097` (11 to 33: tens = third of income inequality between tracts, units = third of homes in flats) and the cluster `lisa097` |
| `apond` | polygon | The state’s 2,535 weighting areas with age, colour or race, homes and household heads’ income |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The **GPKG** is the same for all ten plates and carries a QGIS style for each. The **CSV** has the
municipal table, without geometry. LISA clusters come as `AA` (high-high), `BB` (low-low), `AB`
(first variable high, second low), `BA` and `ns` (not significant).

## Method

1. `cv_renda_setores`: coefficient of variation of household heads’ mean income across the
   municipality’s census tracts, weighted by the number of household heads (one per home) in each tract
   (2022 Census, full count). Only municipalities with 10 or more tracts with data count.
2. `pct_apartamento`: occupied private homes of the flat type (2022 Census, full count).
3. Thirds of the municipalities with data, closed on the right: coefficient up to 0.25, 0.25 to 0.40
   and over 0.40; flats: none, up to 1.5% and over 1.5% (the bottom third is the municipalities with no
   flats). The class combines both thirds (143 municipalities in the top third of both, 130 in the
   bottom third of both).
4. Spearman rank correlation (0.69, 570 municipalities) and partial correlation: the correlation
   between the residuals of each variable’s ranks regressed on the ranks of the controls, urbanisation
   (residents in urban areas), log of population density and log of household income per head. Result:
   0.45; 0.45 without the São Paulo Intermediate Region.
5. Effective sample under spatial autocorrelation: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), where Iₓ and Iᵧ are
   the Moran’s I of the partial residuals over a 6-nearest-municipality neighbourhood. Here, 519
   effective municipalities; the partial’s test with that sample gives p < 0.001.
6. Bivariate Moran (0.25) and bivariate LISA on standardised ranks, 6 neighbours, 999 permutations
   (seed 20261019), p < 0.05: 91 municipalities in high-high clusters and 54 in low-low.
7. Supporting pairs in the plate’s table: inequality × income per head: 0.50 (partial 0.30);
   inequality × favela residents: 0.40 (partial 0.17).

## Limitations

- Ecological reading: the map compares municipalities, not people. A correlation between
  municipalities does not say that the same people have both traits, nor that one causes the other;
  income, age, settlement history and town size may lie behind both.
- The coefficient grows with the number of tracts and therefore with town size; controlling for
  urbanisation and density reduces this effect but does not remove it.
- Household heads’ income comes from the Census full count, with no sampling error, but leaves out
  the income of other residents.
- Both variables come from the full count of the 2022 Census (or from administrative and
  satellite-mapping bases), with no sampling error; where IBGE marks X (confidentiality), the field is
  left empty, never zero.
- The thirds are relative to São Paulo’s municipalities: São Paulo’s bottom third may sit above the
  average of other states.
