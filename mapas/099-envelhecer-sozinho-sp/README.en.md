---
# English version (EN-UK). Numbers, files and layers come from README.md.
titulo: "Growing old alone"
subtitulo: "Where the population is older, more homes have a single resident"

contexto: >-
  Where the population is older, more homes have a single resident. The rank correlation between the share of people aged 60 or over and that of homes with a single resident (2022 Census) is 0.60 across the 645 municipalities and 0.55 net of urbanisation, density and income; 125 municipalities are in the top third of both. The pair holds outside the São Paulo region (partial 0.57) and within towns: across the state’s 2,517 weighting areas, 0.65. Santos has 25% of homes with one resident and 25% older people. The aggregate cannot tell whether those living alone are the elderly; widowhood and children moving out are the usual hypotheses. Seventh plate of the collection “The Census, crossed”.

imagem: ./mapa_preview.en.png
imagem_alt: "Bivariate map of São Paulo’s municipalities in nine colours from a three-by-three grid: ochre grows along the axis of people aged 60 or over and lilac along that of one-person homes; dark brown marks municipalities in the top third of both. Dark brown dominates the north-west and west. Callouts point to Santos, with 25% of homes with one resident and 25% of people aged 60 or over; Ubatuba, with 20% and only 15%; and Dracena, with 23% older people and 20% of homes with one resident. In the panel, the grid with the number of municipalities in each cell, the tercile limits and the table of correlations."

recorte: "São Paulo State (SP)"
metodo: "People aged 60 or over and one-person homes by municipality (IBGE), each split into thirds; the cross gives nine classes. Spearman rank correlation, partial net of the controls, effective sample corrected for spatial autocorrelation and bivariate LISA."
---

# Older people and one-person homes across São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 099, the seventh of ten in the collection **The Census, crossed**; the previous one is [plate 098](../098-a-cor-da-juventude-sp/README.en.md); the next, [plate 100](../100-letras-e-enxada-sp/README.en.md).

The collection grew out of a screen: 4,455 pairs of municipal variables (the 2022 Census and the
bases of other plates in the atlas), of which 4,114 link different families. 834 have a rank
correlation of 0.3 or more and pass the test with the effective sample corrected for spatial
autocorrelation (q < 0.05, Benjamini–Hochberg); 277 stay above 0.3 net of urbanisation, density and
income. Nine of the ten plates come from that last group; the open-truck plate sits just below it
(partial 0.27) and is in for its rare data.

The map’s callouts point to Santos, with 25% of homes with one resident and 25% of people aged 60 or
over; Ubatuba, with 20% and only 15%; and Dracena, with 23% older people and 20% of homes with one
resident.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities with the variables of all ten plates; for this one, `pct_60mais`, `pct_unipessoal`, the class `b099` (11 to 33: tens = third of people aged 60 or over, units = third of one-person homes) and the cluster `lisa099` |
| `apond` | polygon | The state’s 2,535 weighting areas with age, colour or race, homes and household heads’ income |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The **GPKG** is the same for all ten plates and carries a QGIS style for each. The **CSV** has the
municipal table, without geometry. LISA clusters come as `AA` (high-high), `BB` (low-low), `AB`
(first variable high, second low), `BA` and `ns` (not significant).

## Method

1. `pct_60mais`: people aged 60 or over over the resident population (2022 Census, full count).
2. `pct_unipessoal`: occupied private homes with a single resident (2022 Census, full count).
3. Thirds of the municipalities with data, closed on the right: aged 60+ up to 17.7%, 17.7% to 20.7%
   and over 20.7%; one resident up to 17.5%, 17.5% to 19.5% and over 19.5%. The class combines both
   thirds (125 municipalities in the top third of both, 141 in the bottom third of both).
4. Spearman rank correlation (0.60, 645 municipalities) and partial correlation: the correlation
   between the residuals of each variable’s ranks regressed on the ranks of the controls, urbanisation
   (residents in urban areas), log of population density and log of household income per head. Result:
   0.55; 0.57 without the São Paulo Intermediate Region.
5. Effective sample under spatial autocorrelation: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), where Iₓ and Iᵧ are
   the Moran’s I of the partial residuals over a 6-nearest-municipality neighbourhood. Here, 533
   effective municipalities; the partial’s test with that sample gives p < 0.001.
6. Bivariate Moran (0.33) and bivariate LISA on standardised ranks, 6 neighbours, 999 permutations
   (seed 20261019), p < 0.05: 99 municipalities in high-high clusters and 103 in low-low.
7. Supporting pairs in the plate’s table: the same correlation across the state’s 2,517 weighting
   areas: 0.65.

## Limitations

- Ecological reading: the map compares municipalities, not people. A correlation between
  municipalities does not say that the same people have both traits, nor that one causes the other;
  income, age, settlement history and town size may lie behind both.
- The aggregate Census counts older people and one-person homes separately: the map does not show
  how many older people live alone. That count needs the sample microdata, which are not used here.
- One-person homes also grow with young people living alone in university towns and flat-dominated
  districts; Ubatuba shows another case, a coast with many small houses.
- Both variables come from the full count of the 2022 Census (or from administrative and
  satellite-mapping bases), with no sampling error; where IBGE marks X (confidentiality), the field is
  left empty, never zero.
- The thirds are relative to São Paulo’s municipalities: São Paulo’s bottom third may sit above the
  average of other states.
