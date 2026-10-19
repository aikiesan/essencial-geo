---
# English version (EN-UK). Numbers, files and layers come from README.md.
titulo: "The colour of youth"
subtitulo: "In the metropolis, the areas with most children are the blackest; the finer the scale, the stronger the link"

contexto: >-
  In the São Paulo metropolis and the Santos lowlands, the areas with most children are the blackest. Across the 825 2022 Census weighting areas in the 44 municipalities of the two urban concentrations, the rank correlation between the share of people aged 0 to 14 and that of black and brown people is 0.85; across the state’s 2,470 areas, 0.73; across the 44 metropolitan municipalities, 0.64; across the state’s 640 municipalities, 0.50. The smaller the unit, the stronger the link: scale changes the measure. In Caieiras, one area has 28% children and 68% black and brown people; in Santos, 10% and 15%. Sixth plate of the collection “The Census, crossed”.

imagem: ./mapa_preview.en.png
imagem_alt: "Bivariate map of the weighting areas in the municipalities of the São Paulo and Santos urban concentrations, in nine colours: ochre grows with the share of people aged 0 to 14 and lilac with that of black and brown people; dark brown marks areas in the top third of both. The capital’s expanded centre sits in the bottom third of both, in light grey; dark brown forms a ring on the metropolitan fringe and in the Santos lowlands. Callouts point to an area in Caieiras, with 28% of people aged 0 to 14 and 68% black and brown people (the youngest in the metropolis), and one in Santos, with 10% and 15% (the one with fewest children). In the panel, the tercile grid and bars with the same correlation at four scales, from 0.50 by municipality to 0.85 across the metropolitan areas."

recorte: "São Paulo and Santos urban concentrations (SP)"
metodo: "People aged 0 to 14 and black and brown people by weighting area (IBGE), each split into thirds; the cross gives nine classes. Spearman rank correlation, partial net of the controls, effective sample corrected for spatial autocorrelation and bivariate LISA."
---

# Children and the black and brown population across the São Paulo metropolis’s weighting areas

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 098, the sixth of ten in the collection **The Census, crossed**; the previous one is [plate 097](../097-verticalizacao-e-desigualdade-sp/README.en.md); the next, [plate 099](../099-envelhecer-sozinho-sp/README.en.md).

The collection grew out of a screen: 4,455 pairs of municipal variables (the 2022 Census and the
bases of other plates in the atlas), of which 4,114 link different families. 834 have a rank
correlation of 0.3 or more and pass the test with the effective sample corrected for spatial
autocorrelation (q < 0.05, Benjamini–Hochberg); 277 stay above 0.3 net of urbanisation, density and
income. Nine of the ten plates come from that last group; the open-truck plate sits just below it
(partial 0.27) and is in for its rare data.

The map’s callouts point to an area in Caieiras, with 28% of people aged 0 to 14 and 68% black and
brown people (the youngest in the metropolis), and one in Santos, with 10% and 15% (the one with
fewest children).

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities with the variables of all ten plates; for this one, `pct_0a14` and `pct_pretos_pardos` at municipal level |
| `apond` | polygon | The state’s 2,535 weighting areas with age, colour or race, homes and household heads’ income; `metropole` flags those in the window and `b098` holds the bivariate class |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The **GPKG** is the same for all ten plates and carries a QGIS style for each. The **CSV** has the
municipal table, without geometry; the second CSV, the weighting area table. LISA clusters come as
`AA` (high-high), `BB` (low-low), `AB` (first variable high, second low), `BA` and `ns` (not
significant).

## Method

1. `pct_0a14`: people aged 0 to 14 over the resident population (2022 Census, full count).
2. `pct_pretos_pardos`: people of black or brown (preto or pardo) colour or race over the resident
   population (2022 Census, full count).
3. Unit: the 2022 weighting area (APOND), built by summing the census tracts in each area. The map
   window brings together the 44 municipalities of the São Paulo and Santos urban concentrations; the
   825 areas with 1,000 residents or more count.
4. Thirds of the weighting areas with data, closed on the right: aged 0 to 14 up to 17.1%, 17.1% to
   20.1% and over 20.1%; black and brown up to 42.6%, 42.6% to 55.9% and over 55.9%. The class combines
   both thirds (203 weighting areas in the top third of both, 224 in the bottom third of both).
5. Spearman rank correlation across the 825 metropolitan areas (0.85), the state’s 2,470 areas
   (0.73), the 44 metropolitan municipalities (0.64) and the state’s 640 municipalities (0.50).
6. At municipal level, partial Spearman correlation: the correlation between the residuals of each
   variable’s ranks regressed on the ranks of the controls (urbanisation (residents in urban areas),
   log of population density and log of household income per head). Result: 0.35; 0.31 without the São
   Paulo Intermediate Region. Effective sample 471, by n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), where Iₓ and Iᵧ are
   the Moran’s I of the residuals (6 nearest neighbours).

## Limitations

- Scale (the modifiable areal unit problem): the same pair gives 0.50 across the state’s 640
  municipalities, 0.64 across the 44 metropolitan municipalities, 0.73 across the state’s 2,470
  weighting areas and 0.85 across the 825 metropolitan ones. None of these numbers is the “true” one:
  each answers a question about a different unit.
- Ecological reading: the map compares areas, not people. A correlation between areas does not say
  that the same people have both traits, nor that one causes the other; income, age, settlement
  history and town size may lie behind both. Higher fertility, lower income and cheaper housing on the
  metropolitan fringe may weigh together; by municipality, net of urbanisation, density and income,
  the correlation drops to 0.35.
- Both variables come from the full count of the 2022 Census (or from administrative and
  satellite-mapping bases), with no sampling error; where IBGE marks X (confidentiality), the field is
  left empty, never zero.
- The thirds are relative to the metropolitan areas: the bottom third here may be high in another
  metropolis.
