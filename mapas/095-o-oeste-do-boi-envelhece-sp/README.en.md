---
# English version (EN-UK). Numbers, files and layers come from README.md.
titulo: "Cattle country is greying"
subtitulo: "Where there are more cattle per square kilometre, there are more people aged 60 or over"

contexto: >-
  Where there are more cattle per square kilometre, the population is older. The rank correlation between cattle density (Municipal Livestock Survey 2024) and the share of people aged 60 or over (2022 Census) is 0.52 across 617 municipalities and 0.41 net of urbanisation, density and income; 120 municipalities are in the top third of both. Jales has 110 head of cattle per km² and 22.2% older people. Cane shows no such link (ρ 0.09): the pattern belongs to pasture, which employs few people per hectare. That the young leave and those who stay grow old is a hypothesis the map supports but does not prove. Third plate of the collection “The Census, crossed”.

imagem: ./mapa_preview.en.png
imagem_alt: "Bivariate map of São Paulo’s municipalities in nine colours from a three-by-three grid: ochre grows along the axis of cattle per km² and lilac along that of people aged 60 or over; dark brown marks municipalities in the top third of both. Municipalities with no reported herd are hatched. Callouts point to Jales, with 110 cattle per km² and 22.2% of people aged 60 or over; São José dos Campos, with 75 cattle per km² and only 17.0%; and Socorro, with 23.4% among hillside pastures. In the panel, the grid with the number of municipalities in each cell, the tercile limits and the table of correlations."

recorte: "São Paulo State (SP)"
metodo: "Cattle per km² and people aged 60 or over by municipality (IBGE, MapBiomas), each split into thirds; the cross gives nine classes. Spearman rank correlation, partial net of the controls, effective sample corrected for spatial autocorrelation and bivariate LISA."
---

# Cattle herds and ageing across São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 095, the third of ten in the collection **The Census, crossed**; the previous one is [plate 094](../094-cana-e-esgoto-sp/README.en.md); the next, [plate 096](../096-segregacao-e-desigualdade-racial-sp/README.en.md).

The collection grew out of a screen: 4,455 pairs of municipal variables (the 2022 Census and the
bases of other plates in the atlas), of which 4,114 link different families. 834 have a rank
correlation of 0.3 or more and pass the test with the effective sample corrected for spatial
autocorrelation (q < 0.05, Benjamini–Hochberg); 277 stay above 0.3 net of urbanisation, density and
income. Nine of the ten plates come from that last group; the open-truck plate sits just below it
(partial 0.27) and is in for its rare data.

The map’s callouts point to Jales, with 110 cattle per km² and 22.2% of people aged 60 or over; São
José dos Campos, with 75 cattle per km² and only 17.0%; and Socorro, with 23.4% among hillside
pastures.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities with the variables of all ten plates; for this one, `dens_bovino`, `pct_60mais`, the class `b095` (11 to 33: tens = third of cattle per km², units = third of people aged 60 or over) and the cluster `lisa095` |
| `apond` | polygon | The state’s 2,535 weighting areas with age, colour or race, homes and household heads’ income |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The **GPKG** is the same for all ten plates and carries a QGIS style for each. The **CSV** has the
municipal table, without geometry. LISA clusters come as `AA` (high-high), `BB` (low-low), `AB`
(first variable high, second low), `BA` and `ns` (not significant).

## Method

1. `dens_bovino`: cattle herd on 31/12/2024 (PPM, table 3939) divided by the municipal area in the
   2025 Municipal Mesh, in head per km².
2. `pct_60mais`: people aged 60 or over over the resident population (2022 Census, full count, tract
   aggregates).
3. Thirds of the municipalities with data, closed on the right: cattle up to 22, 22 to 60 and over
   60 per km²; aged 60+ up to 17.8%, 17.8% to 20.8% and over 20.8%. The 28 municipalities with no
   reported herd are left out and hatched. The class combines both thirds (120 municipalities in the
   top third of both, 112 in the bottom third of both).
4. Spearman rank correlation (0.52, 617 municipalities) and partial correlation: the correlation
   between the residuals of each variable’s ranks regressed on the ranks of the controls, urbanisation
   (residents in urban areas), log of population density and log of household income per head. Result:
   0.41; 0.43 without the São Paulo Intermediate Region.
5. Effective sample under spatial autocorrelation: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), where Iₓ and Iᵧ are
   the Moran’s I of the partial residuals over a 6-nearest-municipality neighbourhood. Here, 370
   effective municipalities; the partial’s test with that sample gives p < 0.001.
6. Bivariate Moran (0.45) and bivariate LISA on standardised ranks, 6 neighbours, 999 permutations
   (seed 20261019), p < 0.05: 113 municipalities in high-high clusters and 99 in low-low.
7. Supporting pairs in the plate’s table: pasture × median age: 0.42 (partial 0.30); cattle × aged 0
   to 14: −0.38 (partial −0.36); cane × aged 60+: 0.09 (partial 0.02, not significant).

## Limitations

- Ecological reading: the map compares municipalities, not people. A correlation between
  municipalities does not say that the same people have both traits, nor that one causes the other;
  income, age, settlement history and town size may lie behind both.
- Herds are from 2024 and ages from 2022; cattle density changes slowly, but it is not the same
  snapshot.
- Out-migration of the young is the most cited hypothesis for the ageing of cattle country, but the
  aggregate Census does not follow people: the map does not show who left.
- Both variables come from the full count of the 2022 Census (or from administrative and
  satellite-mapping bases), with no sampling error; where IBGE marks X (confidentiality), the field is
  left empty, never zero.
- The thirds are relative to São Paulo’s municipalities: São Paulo’s bottom third may sit above the
  average of other states.
