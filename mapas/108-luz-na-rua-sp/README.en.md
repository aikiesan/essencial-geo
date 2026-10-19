---
# English version (EN-UK). Numbers, files and layers come from README.md.
titulo: "Light in the street"
subtitulo: "The 2022 Census did not ask about electricity; street lighting does not follow the sex of the responsible person"

contexto: >-
  The 2022 Census did not ask about electricity; in 2010, 99.88% of São Paulo’s households had it (15 thousand without). The nearest substitute is street lighting from the Urban Surroundings Survey: 2.1% of surveyed homes (325 thousand) sit on a block face with no street light, and in 23 municipalities it is 10% or more (Sete Barras, 26%; Juquitiba, 22%). The survey covers the tracts IBGE walked, almost all urban, and does not split by sex of the responsible person. The relationship with the share of women responsible is weak and fails the test (ρ −0.08; partial −0.02): the map stands as a descriptive portrait. Sixth plate of the collection “Women heading households”.

imagem: ./mapa_preview.en.png
imagem_alt: "Choropleth map of São Paulo’s 645 municipalities in five shades of brownish ochre, from light (under 1% of surveyed homes without street lighting) to dark (10% or more). Dark shades cluster in the south and south-east of the state, the Ribeira Valley and the hills near the metropolis; the west is almost all light. Callouts point to Sete Barras, at 26%, and Juquitiba, at 22%. In the panel, the 2010 figures on electricity, the legend with the number of municipalities per class and the weak correlation with the share of women responsible."

recorte: "São Paulo State (SP)"
metodo: "Homes on a block face without street lighting over homes in the tracts of the Urban Surroundings Survey, by municipality (SIDRA 9583, 2022 Census); five classes; Spearman rank correlation with the share of women responsible, raw and partial. 2010 electricity (SIDRA 3217) as a reference."
---

# Households without street lighting across São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 108, the sixth of eight in the collection **Women heading households**; the previous one is [plate 107](../107-agua-e-responsaveis-mulheres-sp/README.en.md); the next, [plate 109](../109-renda-e-responsaveis-mulheres-sp/README.en.md).

The collection crosses the share of households with a woman responsible with home and street
services and with income, across São Paulo’s 645 municipalities. The tests came before the maps: raw
and partial rank correlation (net of urbanisation, density and income), effective sample corrected
for spatial autocorrelation, Benjamini–Hochberg q values, Moran’s I, LISA, and a comparison between
municipalities and weighting areas. Most relationships with services vanish once urbanisation is
netted out: women responsible are more common in towns, and towns have more network. Weak
relationships also become maps, as descriptive portraits, and the text says they are weak.

The map’s callouts point to Sete Barras, with 26% of surveyed homes without street lighting (the
highest share among towns of 5,000 or more), and Juquitiba, at 22%, with smallholdings and hillside
plots in the metropolis.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities with the variables of all eight plates: share of women responsible in 2010 and 2022, household make-up, water, sewerage, refuse, bathroom and indoor piped water by sex of the responsible person, street lighting, income by sex, `b109`, `lisa103` and `lisa109` |
| `apond` | polygon | 2,520 weighting areas with the share of women responsible, urbanisation, income of the responsible person and the water and sewerage gaps |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The **GPKG** is the same for all eight plates and carries a QGIS style for each. The **CSV** has the
municipal table, without geometry. In the columns, `_lo` and `_hi` are the confidentiality limits;
LISA clusters come as `AA` (high-high), `BB` (low-low), `AB`, `BA` and `ns` (not significant).

## Method

1. Electricity: the 2022 questionnaire does not include the question, and neither the tract
   dictionary nor the SIDRA catalogue carries the variable for 2022. In 2010 (SIDRA 3217, full count),
   99.88% of São Paulo’s households had electricity and 15,084 did not.
2. `pct_iluminacao` and `pct_sem_iluminacao`: occupied permanent private households on a block face
   with and without street lighting, over all households in the surveyed tracts (SIDRA 9583, Urban
   Surroundings Survey, 2022 Census). `cobertura_entorno` is the share of the municipality’s households
   in those tracts.
3. Classes: under 1%, 1 to 2%, 2 to 5%, 5 to 10% and 10% or more. 62 municipalities have no surveyed
   home without a street light. In the median municipality, 89% of homes are in the survey (minimum
   23%).
4. Share of women responsible × share with street lighting: Spearman rank correlation −0.08 (645
   municipalities), partial −0.02, effective sample 564, p = 0.069; q of the partial 0.65.
5. Partial correlation: the correlation between the residuals of each variable’s ranks regressed on
   the ranks of the controls, which are urbanisation (residents in urban areas), log of population
   density and log of mean income of the responsible person; the control from the variable’s own family
   is dropped. Effective sample under spatial autocorrelation: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), where Iₓ and
   Iᵧ are the Moran’s I of the residuals over a 6-nearest-neighbour neighbourhood; Benjamini–Hochberg q
   values across all tests in the collection.

## Limitations

- Street lighting is not electricity: it describes the street, not the home. It is the nearest
  substitute published for 2022, but a different thing.
- The Urban Surroundings Survey covers the tracts IBGE walked, almost all urban; in municipalities
  with large rural areas, many homes are left out, and the rate describes only the urban part.
- The table does not split by sex of the responsible person; the comparison with women responsible
  can only be between municipalities, and none shows up.
- Ecological reading: the map compares places, not people. A correlation between municipalities does
  not say that the same homes have both traits, nor that one causes the other; urbanisation, income
  and age may lie behind both.
