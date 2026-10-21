---
# English version (EN-UK). Numbers, files and layers come from README.md.
titulo: "Solar follows the cane"
subtitulo: "Where there is more cane, there are more solar watts per home, even net of income"

contexto: >-
  Where cane covers more land, homes have more solar panels. The rank correlation between the share of municipal area under cane (MapBiomas) and residential distributed solar power per home (ANEEL and the 2022 Census) is 0.55 across the 645 municipalities and stays at 0.44 net of urbanisation, density and income. In 102 municipalities both are in the top third. Jaboticabal, with 72% of its area under cane, has 957 W per home; Santa Fé do Sul, with almost no cane, has 1,400 W; São Paulo, 38 W. Income alone explains little (ρ 0.23). It is a pattern between municipalities, not a cause. First plate of the collection “The Census, crossed”.

imagem: ./mapa_preview.en.png
imagem_alt: "Bivariate map of São Paulo’s municipalities in nine colours from a three-by-three grid: ochre grows along the axis of area under cane and lilac along that of solar power per home; dark brown marks municipalities in the top third of both. Callouts point to Jaboticabal, with 957 W per home and 72% of its area under cane; Santa Fé do Sul, with 1,400 W and almost no cane; and São Paulo, with 38 W. In the panel, the grid with the number of municipalities in each cell, the tercile limits and the table of correlations."

recorte: "São Paulo State (SP)"
metodo: "Area under cane and solar power per home by municipality (ANEEL, MapBiomas, IBGE), each split into thirds; the cross gives nine classes. Spearman rank correlation, partial net of the controls, effective sample corrected for spatial autocorrelation and bivariate LISA."
---

# Sugar cane and residential solar power across São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 093, the first of ten in the collection **The Census, crossed**; the next, [plate 094](../094-cana-e-esgoto-sp/README.en.md).

The collection grew out of a screen: 4,455 pairs of municipal variables (the 2022 Census and the
bases of other plates in the atlas), of which 4,114 link different families. 834 have a rank
correlation of 0.3 or more and pass the test with the effective sample corrected for spatial
autocorrelation (q < 0.05, Benjamini–Hochberg); 277 stay above 0.3 net of urbanisation, density and
income. Nine of the ten plates come from that last group; the open-truck plate sits just below it
(partial 0.27) and is in for its rare data.

The map’s callouts point to Jaboticabal, with 957 W per home and 72% of its area under cane; Santa
Fé do Sul, with 1,400 W and almost no cane; and São Paulo, with 38 W.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities with the variables of all ten plates; for this one, `pct_area_cana`, `solar_w_dom`, the class `b093` (11 to 33: tens = third of area under cane, units = third of solar power per home) and the cluster `lisa093` |
| `apond` | polygon | The state’s 2,535 weighting areas with age, colour or race, homes and household heads’ income |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The **GPKG** is the same for all ten plates and carries a QGIS style for each. The **CSV** has the
municipal table, without geometry. LISA clusters come as `AA` (high-high), `BB` (low-low), `AB`
(first variable high, second low), `BA` and `ns` (not significant).

## Method

1. `pct_area_cana`: share of municipal area under sugar cane in MapBiomas, collection 10, year 2024
   (base of plate 045).
2. `solar_w_dom`: installed residential distributed solar power (ANEEL, October 2026, base of plate
   062), in watts, divided by occupied private homes in the 2022 Census.
3. Thirds of the municipalities with data, closed on the right: cane up to 3.4%, 3.4% to 35.6% and
   over 35.6%; solar up to 347 W, 347 to 654 W and over 654 W per home. The class combines both thirds
   (102 municipalities in the top third of both, 160 in the bottom third of both).
4. Spearman rank correlation (0.55, 645 municipalities) and partial correlation: the correlation
   between the residuals of each variable’s ranks regressed on the ranks of the controls, urbanisation
   (residents in urban areas), log of population density and log of household income per head. Result:
   0.44; 0.36 without the São Paulo Intermediate Region.
5. Effective sample under spatial autocorrelation: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), where Iₓ and Iᵧ are
   the Moran’s I of the partial residuals over a 6-nearest-municipality neighbourhood. Here, 322
   effective municipalities; the partial’s test with that sample gives p < 0.001.
6. Bivariate Moran (0.57) and bivariate LISA on standardised ranks, 6 neighbours, 999 permutations
   (seed 20261019), p < 0.05: 149 municipalities in high-high clusters and 158 in low-low.
7. Supporting pairs in the plate’s table: solar × native vegetation: −0.55 (partial −0.50); solar ×
   income per head: 0.23 (partial 0.40).

## Limitations

- Ecological reading: the map compares municipalities, not people. A correlation between
  municipalities does not say that the same people have both traits, nor that one causes the other;
  income, age, settlement history and town size may lie behind both.
- Solar irradiance also rises westwards, where cane and pasture are; the map does not separate the
  effect of sunshine from that of the farm economy.
- ANEEL power is from October 2026 and homes are from 2022; in municipalities that have grown a lot
  since the Census, the ratio is slightly inflated.
- Both variables come from the full count of the 2022 Census (or from administrative and
  satellite-mapping bases), with no sampling error; where IBGE marks X (confidentiality), the field is
  left empty, never zero.
- The thirds are relative to São Paulo’s municipalities: São Paulo’s bottom third may sit above the
  average of other states.
