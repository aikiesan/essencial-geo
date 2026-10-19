---
# English version (EN-UK). Numbers, files and layers come from README.md.
titulo: "Ten points in twelve years"
subtitulo: "From 2010 to 2022, the share of homes with a woman responsible rose in country and town alike"

contexto: >-
  From 2010 to 2022, the share of São Paulo’s households with a woman responsible rose from 39.0% to 49.2%: +10.3 points and 60% more homes (from 5.00 to 7.99 million). It rose in 627 of the 645 municipalities; the 18 where it fell are small. Morro Agudo went from 23% to 49%, the biggest jump among towns of 20,000 or more; the capital, already at 44%, reached 53%. The rise does not follow urbanisation (ρ −0.07) and was larger where the share was lower in 2010 (ρ −0.58). Both Censuses use the same concept of responsible person and the same universe of households. Second plate of the collection “Women heading households”.

imagem: ./mapa_preview.en.png
imagem_alt: "Choropleth map of São Paulo’s 645 municipalities in five shades of lilac, from a rise of 0 to 5 percentage points (light) to 20 points or more (dark), with the 18 municipalities where the share of households with a woman responsible fell from 2010 to 2022 in ochre. Middle shades cover almost the whole state. Callouts point to Morro Agudo, from 23% to 49%, and São Paulo, from 44% to 53%. In the panel, the legend with the number of municipalities per class and a comparison of the state, the median municipality and the capital."

recorte: "São Paulo State (SP)"
metodo: "Difference, in percentage points, between the share of households with a woman responsible in 2022 (summed tracts) and in 2010 (SIDRA 3221), by municipality, both full count; five classes of rise and one of fall; Spearman rank correlations."
---

# Change in the share of households with a woman responsible in São Paulo, 2010–2022

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 104, the second of eight in the collection **Women heading households**; the previous one is [plate 103](../103-quase-metade-das-casas-sp/README.en.md); the next, [plate 105](../105-responsavel-nao-e-mae-solo-sp/README.en.md).

The collection crosses the share of households with a woman responsible with home and street
services and with income, across São Paulo’s 645 municipalities. The tests came before the maps: raw
and partial rank correlation (net of urbanisation, density and income), effective sample corrected
for spatial autocorrelation, Benjamini–Hochberg q values, Moran’s I, LISA, and a comparison between
municipalities and weighting areas. Most relationships with services vanish once urbanisation is
netted out: women responsible are more common in towns, and towns have more network. Weak
relationships also become maps, as descriptive portraits, and the text says they are weak.

The map’s callouts point to Morro Agudo, which went from 23% to 49% (+26 points, the biggest jump
among towns of 20,000 or more), and São Paulo, from 44% to 53%.

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

1. `pct_resp_mulher_2010`: permanent private households with a woman as the responsible person over
   all households, 2010 Census (SIDRA 3221, full count). The table’s state total, 12,827,153
   households, matches table 3217, which confirms the full count.
2. `pct_resp_mulher`: the same in 2022, from summed census tracts (households, part 2, full count).
3. `var_resp_mulher`: the difference in percentage points. Classes: fall; 0 to 5; 5 to 10; 10 to 15;
   15 to 20; 20 or more. In the median municipality, +11.9 points (from 32.7% to 45.4%).
4. Change × urbanisation: Spearman rank correlation −0.07 (645 municipalities), partial 0.04,
   effective sample 624, p = 0.066; change × 2010 share: Spearman rank correlation −0.58 (645
   municipalities), partial −0.60, effective sample 634, p < 0.001.
5. Partial correlation: the correlation between the residuals of each variable’s ranks regressed on
   the ranks of the controls, which are urbanisation (residents in urban areas), log of population
   density and log of mean income of the responsible person; the control from the variable’s own family
   is dropped. Effective sample under spatial autocorrelation: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), where Iₓ and
   Iᵧ are the Moran’s I of the residuals over a 6-nearest-neighbour neighbourhood; Benjamini–Hochberg q
   values across all tests in the collection.

## Limitations

- The comparison is direct because both Censuses use the same concept of responsible person, the
  same universe (occupied permanent private households) and the same list of 645 municipalities. The
  mesh is the 2025 one; no São Paulo municipality was created or split in the period.
- The 18 municipalities where the share fell are small (the largest has 7,369 residents); in them, a
  few dozen homes move the rate.
- The rise may come from changes in families (more women living without a spouse, more widowed older
  women) and also from changes in whom the family names as responsible. The Census does not separate
  the two.
- The responsible person is whoever the residents name as such to the enumerator. It does not mean
  the breadwinner, nor a lone mother: of São Paulo homes with a woman responsible, 44% include a
  spouse.
- Ecological reading: the map compares places, not people. A correlation between municipalities does
  not say that the same homes have both traits, nor that one causes the other; urbanisation, income
  and age may lie behind both.
