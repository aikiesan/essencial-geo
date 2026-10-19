---
# English version (EN-UK). Numbers, files and layers come from README.md.
titulo: "Where women earn closer to men"
subtitulo: "Where women’s income comes closer to men’s, more homes have a woman responsible"

contexto: >-
  Where the mean income of women aged 14 or over comes closer to men’s, more homes have a woman responsible: a rank correlation of 0.25 across the 645 municipalities and 0.35 net of urbanisation and density, the firmest relationship in the collection. In 98 municipalities both are in the top third. In Lucélia, women earn 87% of what men earn and 49% of homes have a woman responsible; in Pilar do Sul, 51% and 39%. In the median municipality, women earn 63%. The ratio comes from the sample and compares all women with all men, not those responsible: the 2022 Census does not publish municipal income by sex of the responsible person. Seventh plate of the collection “Women heading households”.

imagem: ./mapa_preview.en.png
imagem_alt: "Bivariate map of São Paulo’s municipalities in nine colours from a three-by-three grid: lilac grows along the axis of the share of households with a woman responsible and ochre along that of women’s mean income as a share of men’s; dark brown marks the 98 municipalities in the top third of both, frequent on the coast, in the metropolis and in the west. Callouts point to Lucélia, at 87% and 49% women responsible, and Pilar do Sul, at 51% and 39%. In the panel, the grid with the number of municipalities in each cell, the tercile limits and the table of correlations."

recorte: "São Paulo State (SP)"
metodo: "Share of households with a woman responsible (2022 Census tracts, full count) and the ratio of women’s to men’s mean income among people aged 14 or over (SIDRA 10299, sample), by municipality, each split into thirds; the cross gives nine classes. Spearman rank correlation, partial, effective sample corrected for spatial autocorrelation and bivariate LISA."
---

# Women responsible and the women-to-men income ratio across São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 109, the seventh of eight in the collection **Women heading households**; the previous one is [plate 108](../108-luz-na-rua-sp/README.en.md); the next, [plate 110](../110-na-mesma-rua-sp/README.en.md).

The collection crosses the share of households with a woman responsible with home and street
services and with income, across São Paulo’s 645 municipalities. The tests came before the maps: raw
and partial rank correlation (net of urbanisation, density and income), effective sample corrected
for spatial autocorrelation, Benjamini–Hochberg q values, Moran’s I, LISA, and a comparison between
municipalities and weighting areas. Most relationships with services vanish once urbanisation is
netted out: women responsible are more common in towns, and towns have more network. Weak
relationships also become maps, as descriptive portraits, and the text says they are weak.

The map’s callouts point to Lucélia, where women earn 87% of men’s income and 49% of homes have a
woman responsible (top third of both), and Pilar do Sul, at 51% and 39% (bottom third of both).

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

1. `pct_resp_mulher`: households with a woman as the responsible person over all households (2022
   Census tracts, full count).
2. `renda_mulheres`, `renda_homens` and `razao_renda_sexo`: mean monthly nominal income of people
   aged 14 or over, women and men (SIDRA 10299, sample), and the ratio between them, in %.
3. Thirds of the 645 municipalities, closed on the right: women responsible up to 43%, 43% to 48%
   and over 48%; income ratio up to 61%, 61% to 66% and over 66%. The class `b109` combines both (11 to
   33: tens = third of women responsible, units = third of the income ratio): 98 municipalities in the
   top third of both and 97 in the bottom third of both.
4. Share of women responsible × income ratio: Spearman rank correlation 0.25 (645 municipalities),
   partial 0.35, effective sample 624, p < 0.001; controls are urbanisation and density only, since
   income is the variable itself.
5. Bivariate Moran 0.05 (p = 0.022) and bivariate LISA on standardised ranks, 6 neighbours, 999
   permutations (seed 20261019), p < 0.05: 45 high-high municipalities and 49 low-low (`lisa109`).
6. Supporting pairs: women responsible × mean income of the responsible person: Spearman rank
   correlation 0.02 (645 municipalities), partial −0.18, effective sample 579, p = 0.681; across
   weighting areas, −0.03 (partial −0.24); women responsible × women’s income: Spearman rank
   correlation 0.10 (645 municipalities), partial 0.16, effective sample 593, p = 0.014.
7. Partial correlation: the correlation between the residuals of each variable’s ranks regressed on
   the ranks of the controls, which are urbanisation (residents in urban areas), log of population
   density and log of mean income of the responsible person; the control from the variable’s own family
   is dropped. Effective sample under spatial autocorrelation: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), where Iₓ and
   Iᵧ are the Moran’s I of the residuals over a 6-nearest-neighbour neighbourhood; Benjamini–Hochberg q
   values across all tests in the collection.

## Limitations

- The 2022 Census does not publish, by municipality, income by sex of the responsible person. The
  ratio compares all women with all men aged 14 or over; it says how income splits between the sexes
  in a place, not how much women responsible earn.
- The ratio comes from the 2022 Census sample: these are estimates expanded by IBGE, with sampling
  error that grows as the municipality shrinks. In a small town it swings widely (the maximum, 242% in
  Balbinos, is almost certainly noise); hence the thirds rather than fine classes.
- Mean income in the sample tables may change depending on whether people with no income are
  included; the note to table 10299 could not be checked, and the ratio uses the same rule for both
  sexes.
- Net of urbanisation, where more women are responsible the mean income of the responsible person is
  slightly lower (partial −0.18); this plate’s relationship is with the gap between the sexes, not
  with the level of income.
- Ecological reading: the map compares places, not people. A correlation between municipalities does
  not say that the same homes have both traits, nor that one causes the other; urbanisation, income
  and age may lie behind both.
- The thirds are relative to São Paulo’s municipalities: São Paulo’s bottom third may sit above the
  average of other states.
