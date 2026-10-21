---
# English version (EN-UK). Numbers, files and layers come from README.md.
titulo: "Letters and the hoe"
subtitulo: "Where more people work the land, the wider the gap between black and white illiteracy"

contexto: >-
  Where more people work the land, the wider the gap between black and white illiteracy. The rank correlation between the share of employed people working as skilled farm workers and the gap, in percentage points, between the illiteracy rate of black and brown people and that of white people aged 15 or over (2022 Census) is 0.51 across the 645 municipalities and 0.33 net of urbanisation, density and income; 122 municipalities are in the top third of both. Dois Córregos has a gap of 5.8 points and 6.5% of workers on the land; São Paulo, 2.0. The map does not say that farm work produces the gap: both carry the same history of unequal schooling in the interior. Eighth plate of the collection “The Census, crossed”.

imagem: ./mapa_preview.en.png
imagem_alt: "Bivariate map of São Paulo’s municipalities in nine colours from a three-by-three grid: ochre grows along the axis of farm workers and lilac along that of racial illiteracy gap; dark brown marks municipalities in the top third of both. Callouts point to Dois Córregos, with a gap of 5.8 points and 6.5% of workers on the land; São Miguel Arcanjo, with 19% of workers on the land and a gap of 1.8 points; and São Paulo, with 2.0 points. In the panel, the grid with the number of municipalities in each cell, the tercile limits and the table of correlations."

recorte: "São Paulo State (SP)"
metodo: "Farm workers and racial illiteracy gap by municipality (IBGE, MapBiomas), each split into thirds; the cross gives nine classes. Spearman rank correlation, partial net of the controls, effective sample corrected for spatial autocorrelation and bivariate LISA."
---

# Farm work and the racial illiteracy gap across São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 100, the eighth of ten in the collection **The Census, crossed**; the previous one is [plate 099](../099-envelhecer-sozinho-sp/README.en.md); the next, [plate 101](../101-casas-de-veraneio-sem-esgoto-sp/README.en.md).

The collection grew out of a screen: 4,455 pairs of municipal variables (the 2022 Census and the
bases of other plates in the atlas), of which 4,114 link different families. 834 have a rank
correlation of 0.3 or more and pass the test with the effective sample corrected for spatial
autocorrelation (q < 0.05, Benjamini–Hochberg); 277 stay above 0.3 net of urbanisation, density and
income. Nine of the ten plates come from that last group; the open-truck plate sits just below it
(partial 0.27) and is in for its rare data.

The map’s callouts point to Dois Córregos, with a gap of 5.8 points and 6.5% of workers on the land;
São Miguel Arcanjo, with 19% of workers on the land and a gap of 1.8 points; and São Paulo, with 2.0
points.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities with the variables of all ten plates; for this one, `pct_ocup_agro`, `hiato_analfabetismo`, the class `b100` (11 to 33: tens = third of farm workers, units = third of racial illiteracy gap) and the cluster `lisa100` |
| `apond` | polygon | The state’s 2,535 weighting areas with age, colour or race, homes and household heads’ income |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The **GPKG** is the same for all ten plates and carries a QGIS style for each. The **CSV** has the
municipal table, without geometry. LISA clusters come as `AA` (high-high), `BB` (low-low), `AB`
(first variable high, second low), `BA` and `ns` (not significant).

## Method

1. `pct_ocup_agro`: employed people in the major group “skilled agricultural, forestry, hunting and
   fishery workers” over all employed people (2022 Census, sample).
2. `hiato_analfabetismo`: illiteracy rate of black and brown people aged 15 or over minus that of
   white people, in percentage points (2022 Census, full count). It counts only where both groups have
   200 people or more.
3. Thirds of the municipalities with data, closed on the right: farm workers up to 2.7%, 2.7% to
   6.2% and over 6.2%; gap up to 2.2, 2.2 to 3.2 and over 3.2 points. The class combines both thirds
   (122 municipalities in the top third of both, 125 in the bottom third of both).
4. Spearman rank correlation (0.51, 645 municipalities) and partial correlation: the correlation
   between the residuals of each variable’s ranks regressed on the ranks of the controls, urbanisation
   (residents in urban areas), log of population density and log of household income per head. Result:
   0.33; 0.32 without the São Paulo Intermediate Region.
5. Effective sample under spatial autocorrelation: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), where Iₓ and Iᵧ are
   the Moran’s I of the partial residuals over a 6-nearest-municipality neighbourhood. Here, 598
   effective municipalities; the partial’s test with that sample gives p < 0.001.
6. Bivariate Moran (0.24) and bivariate LISA on standardised ranks, 6 neighbours, 999 permutations
   (seed 20261019), p < 0.05: 41 municipalities in high-high clusters and 80 in low-low.
7. Supporting pairs in the plate’s table: farm work × overall illiteracy: 0.67 (partial 0.28); cane
   × illiteracy gap: 0.22 (partial 0.24).

## Limitations

- Ecological reading: the map compares municipalities, not people. A correlation between
  municipalities does not say that the same people have both traits, nor that one causes the other;
  income, age, settlement history and town size may lie behind both.
- The gap grows in part because overall illiteracy is higher where farm work is more common (ρ
  0.67): where nearly everyone can read, the gap between groups is small by construction.
- The rate is of self-reported illiteracy, concentrated in older generations; it measures the
  schools of the past more than those of today.
- The share of farm workers comes from the 2022 Census sample: these are estimates expanded by IBGE,
  with sampling error that grows as the municipality shrinks. Small differences between small
  municipalities may be noise; hence the thirds rather than fine classes. Where IBGE marks X
  (confidentiality), the field is left empty, never zero.
- The thirds are relative to São Paulo’s municipalities: São Paulo’s bottom third may sit above the
  average of other states.
