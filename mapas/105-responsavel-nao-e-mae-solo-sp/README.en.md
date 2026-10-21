---
# English version (EN-UK). Numbers, files and layers come from README.md.
titulo: "Responsible is not lone mother"
subtitulo: "44% of women responsible live with a spouse, and more so where there are more of them"

contexto: >-
  The responsible person is not the same as a lone mother. Of São Paulo homes with a woman responsible, 44.0% include a spouse (with a man responsible, 71.3%) and 27.7% are a woman without a spouse with children or stepchildren. Even so, 86% of homes without a spouse but with children have a woman at the head. Across municipalities, where more women are responsible, more of them live with a spouse (rank correlation 0.50; partial 0.56) and fewer are without a spouse with children (−0.43). In Itupeva, 63% live with a spouse; in Santos, 35%. Third plate of the collection “Women heading households”.

imagem: ./mapa_preview.en.png
imagem_alt: "Choropleth map of São Paulo’s 645 municipalities in five shades of ochre, from light (under 40% of women responsible living with a spouse) to dark (55% or more). Light shades appear in the capital, the Santos coast and larger towns. Callouts point to Itupeva, at 63%, and Santos, at 35%. In the panel, two bars compare the make-up of homes with a woman and with a man responsible statewide (with spouse, without spouse with children, other), and a table gives the correlations."

recorte: "São Paulo State (SP)"
metodo: "Households with a woman responsible that include a spouse (with or without children), over all households with a woman responsible, by municipality (SIDRA 9882, full count); five classes; Spearman rank correlations with the share of women responsible, raw and partial."
---

# Women responsible who live with a spouse across São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 105, the third of eight in the collection **Women heading households**; the previous one is [plate 104](../104-dez-pontos-em-doze-anos-sp/README.en.md); the next, [plate 106](../106-esgoto-e-responsaveis-mulheres-sp/README.en.md).

The collection crosses the share of households with a woman responsible with home and street
services and with income, across São Paulo’s 645 municipalities. The tests came before the maps: raw
and partial rank correlation (net of urbanisation, density and income), effective sample corrected
for spatial autocorrelation, Benjamini–Hochberg q values, Moran’s I, LISA, and a comparison between
municipalities and weighting areas. Most relationships with services vanish once urbanisation is
netted out: women responsible are more common in towns, and towns have more network. Weak
relationships also become maps, as descriptive portraits, and the text says they are weak.

The map’s callouts point to Itupeva, where 63% of women responsible live with a spouse (the highest
share among towns of 20,000 or more), and Santos, at 35%, a city with many older women living alone.

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

1. `pct_mulher_com_conjuge` and `pct_homem_com_conjuge`: homes with a spouse (with or without
   children) over homes with a responsible person of the same sex (SIDRA 9882, 2022 Census, full
   count). “Children” includes stepchildren, of any age.
2. `pct_mulher_sem_conjuge_filhos`: homes with a woman responsible, no spouse and children or
   stepchildren, over homes with a woman responsible.
3. Statewide: with a woman responsible, 44.0% with a spouse (15.1% without children), 27.7% without
   a spouse with children and 28.3% in other arrangements (living alone, with relatives or
   non-relatives); with a man responsible, 71.3% with a spouse and 4.3% without a spouse with children.
4. Classes: under 40%, 40 to 45%, 45 to 50%, 50 to 55% and 55% or more. In the median municipality,
   46.9% of women responsible live with a spouse (men: 73.5%).
5. Share of women responsible × share of them with a spouse: Spearman rank correlation 0.50 (645
   municipalities), partial 0.56, effective sample 618, p < 0.001; × share without a spouse with
   children: Spearman rank correlation −0.43 (645 municipalities), partial −0.55, effective sample 596,
   p < 0.001.
6. Partial correlation: the correlation between the residuals of each variable’s ranks regressed on
   the ranks of the controls, which are urbanisation (residents in urban areas), log of population
   density and log of mean income of the responsible person; the control from the variable’s own family
   is dropped. Effective sample under spatial autocorrelation: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), where Iₓ and
   Iᵧ are the Moran’s I of the residuals over a 6-nearest-neighbour neighbourhood; Benjamini–Hochberg q
   values across all tests in the collection.

## Limitations

- The Census records the household on the day of the interview: “without a spouse with children”
  includes widows with adult children, not only young mothers raising children alone.
- The rise of women responsible who have a spouse suggests that part of the increase since 2010
  comes from couples who now name the woman as responsible; the Census does not ask why.
- Ecological reading: the map compares places, not people. A correlation between municipalities does
  not say that the same homes have both traits, nor that one causes the other; urbanisation, income
  and age may lie behind both.
