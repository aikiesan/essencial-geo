---
# English version (EN-UK). Numbers, files and layers come from README.md.
titulo: "Apart and unequal"
subtitulo: "In the more segregated towns, white incomes sit further above brown ones"

contexto: >-
  In towns where white and non-white residents live further apart, white incomes sit further above brown ones. The rank correlation between the dissimilarity index, measured across census tracts, and the ratio of white to brown (pardo) median household income per head (2022 Census) is 0.43 across 588 municipalities and 0.38 net of urbanisation and density. Campinas has an index of 34 and white income 1.7 times brown income; Diadema, an index of 14 and a ratio of 1.17. The map does not say whether segregation produces inequality, inequality produces segregation, or both come from the same history. Fourth plate of the collection “The Census, crossed”.

imagem: ./mapa_preview.en.png
imagem_alt: "Bivariate map of São Paulo’s municipalities in nine colours from a three-by-three grid: ochre grows along the axis of segregation between white and non-white residents and lilac along that of white-to-brown income ratio; dark brown marks municipalities in the top third of both. Municipalities with fewer than 10 tracts are hatched. Callouts point to Campinas, with a dissimilarity index of 34 and white income 1.7 times brown income, and Diadema, with an index of 14 and a ratio of 1.17. In the panel, the grid with the number of municipalities in each cell, the tercile limits and the table of correlations."

recorte: "São Paulo State (SP)"
metodo: "Segregation between white and non-white residents and white-to-brown income ratio by municipality (IBGE), each split into thirds; the cross gives nine classes. Spearman rank correlation, partial net of the controls, effective sample corrected for spatial autocorrelation and bivariate LISA."
---

# Residential segregation and the white–brown income gap across São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 096, the fourth of ten in the collection **The Census, crossed**; the previous one is [plate 095](../095-o-oeste-do-boi-envelhece-sp/README.en.md); the next, [plate 097](../097-verticalizacao-e-desigualdade-sp/README.en.md).

The collection grew out of a screen: 4,455 pairs of municipal variables (the 2022 Census and the
bases of other plates in the atlas), of which 4,114 link different families. 834 have a rank
correlation of 0.3 or more and pass the test with the effective sample corrected for spatial
autocorrelation (q < 0.05, Benjamini–Hochberg); 277 stay above 0.3 net of urbanisation, density and
income. Nine of the ten plates come from that last group; the open-truck plate sits just below it
(partial 0.27) and is in for its rare data.

The map’s callouts point to Campinas, with a dissimilarity index of 34 and white income 1.7 times
brown income, and Diadema, with an index of 14 and a ratio of 1.17.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities with the variables of all ten plates; for this one, `segregacao_racial`, `razao_renda_raca`, the class `b096` (11 to 33: tens = third of segregation between white and non-white residents, units = third of white-to-brown income ratio) and the cluster `lisa096` |
| `apond` | polygon | The state’s 2,535 weighting areas with age, colour or race, homes and household heads’ income |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The **GPKG** is the same for all ten plates and carries a QGIS style for each. The **CSV** has the
municipal table, without geometry. LISA clusters come as `AA` (high-high), `BB` (low-low), `AB`
(first variable high, second low), `BA` and `ns` (not significant).

## Method

1. `segregacao_racial`: dissimilarity index between white and non-white people, non-white being the
   population minus white people (black, brown, Asian and Indigenous), computed across each
   municipality’s census tracts, from 0 (same make-up in every tract) to 100 (total separation). Only
   municipalities with 10 or more tracts with data and 200 or more people in each group count.
2. `razao_renda_raca`: median household income per head of white people divided by that of brown
   (pardo) people (2022 Census, sample). The comparison is with brown people, the state’s largest
   non-white group, which keeps the sample estimate steadier.
3. Thirds of the municipalities with data, closed on the right: dissimilarity up to 15.4, 15.4 to
   20.1 and over 20.1; income ratio up to 1.20, 1.20 to 1.30 and over 1.30. The 57 municipalities with
   fewer than 10 tracts are hatched. The class combines both thirds (103 municipalities in the top
   third of both, 104 in the bottom third of both).
4. Spearman rank correlation (0.43, 588 municipalities) and partial correlation: the correlation
   between the residuals of each variable’s ranks regressed on the ranks of the controls, urbanisation
   and density (income is left out, because the vertical-axis variable is already an income measure).
   Result: 0.38; 0.33 without the São Paulo Intermediate Region.
5. Effective sample under spatial autocorrelation: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), where Iₓ and Iᵧ are
   the Moran’s I of the partial residuals over a 6-nearest-municipality neighbourhood. Here, 579
   effective municipalities; the partial’s test with that sample gives p < 0.001.
6. Bivariate Moran (0.14) and bivariate LISA on standardised ranks, 6 neighbours, 999 permutations
   (seed 20261019), p < 0.05: 30 municipalities in high-high clusters and 41 in low-low.
7. Supporting pairs in the plate’s table: segregation × gap in years of schooling between white and
   brown people: 0.44 (partial 0.39).

## Limitations

- Ecological reading: the map compares municipalities, not people. A correlation between
  municipalities does not say that the same people have both traits, nor that one causes the other;
  income, age, settlement history and town size may lie behind both.
- The index depends on the size and number of tracts: towns with few tracts tend to have lower or
  unstable indices, which is why those with fewer than 10 are left out.
- Bivariate Moran is low (0.14): the pair does not form large regions on the map, it appears in
  towns scattered across the state.
- The income ratio (and the schooling gap in the table) comes from the 2022 Census sample: these are
  estimates expanded by IBGE, with sampling error that grows as the municipality shrinks. Small
  differences between small municipalities may be noise; hence the thirds rather than fine classes.
  Where IBGE marks X (confidentiality), the field is left empty, never zero.
- Dissimilarity measures separation between tracts, not mixing at work, at school or in the street.
- The thirds are relative to São Paulo’s municipalities: São Paulo’s bottom third may sit above the
  average of other states.
