---
# English version (EN-UK). Numbers, files and layers come from README.md.
titulo: "Water arrives by address"
subtitulo: "In almost every town, women’s homes have more mains water; nearly all of it is where they are"

contexto: >-
  Statewide, 96.9% of homes with a woman responsible get mains water, against 94.5% of those with a man responsible: +2.4 points, of which +2.26 is address and +0.15 is left within the same census tract. Women’s homes have more mains water in 620 of the 645 municipalities, robust to confidentiality. In Cunha it is 77% against 48%; in Piedade, 67% against 50%; in Guarujá, one of the exceptions, women’s homes have slightly less. Net of urbanisation, the share of women responsible is barely related to coverage (partial 0.07). Fifth plate of the collection “Women heading households”.

imagem: ./mapa_preview.en.png
imagem_alt: "Choropleth map of São Paulo’s 645 municipalities by the gap, in percentage points, between the share of homes with a woman and with a man responsible that get mains water: grey between −1 and +1 and four shades of lilac from +1 to +20 points or more. Almost the whole state is lilac, darker in municipalities with large rural areas. Callouts point to Cunha, at +29 points, Piedade, at +17, and Guarujá, at −0.4. In the panel, the state gap broken down into address and within the tract."

recorte: "São Paulo State (SP)"
metodo: "Share of homes with a woman and with a man responsible supplied by the general network, from summed 2022 Census tracts (full count); gap in percentage points, broken down into address and within the tract; six classes; Spearman rank correlations, raw and partial."
---

# Mains water by sex of the responsible person across São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 107, the fifth of eight in the collection **Women heading households**; the previous one is [plate 106](../106-esgoto-e-responsaveis-mulheres-sp/README.en.md); the next, [plate 108](../108-luz-na-rua-sp/README.en.md).

The collection crosses the share of households with a woman responsible with home and street
services and with income, across São Paulo’s 645 municipalities. The tests came before the maps: raw
and partial rank correlation (net of urbanisation, density and income), effective sample corrected
for spatial autocorrelation, Benjamini–Hochberg q values, Moran’s I, LISA, and a comparison between
municipalities and weighting areas. Most relationships with services vanish once urbanisation is
netted out: women responsible are more common in towns, and towns have more network. Weak
relationships also become maps, as descriptive portraits, and the text says they are weak.

The map’s callouts point to Cunha (+29 points, the widest gap), Piedade (+17: 67% of women’s homes
and 50% of men’s) and Guarujá (−0.4), one of the few where women’s homes have less.

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

1. `agua_rede_homem`, `agua_rede_mulher`, `agua_rede_dif` (with `_lo` and `_hi`),
   `agua_rede_dif_composicao` and `agua_rede_dif_setor`: homes supplied by the general distribution
   network, as % of homes with a man and a woman responsible, and the gaps in percentage points (2022
   Census tracts, full count).
2. Gap classes: women 1 point lower or more; −1 to +1; +1 to +5; +5 to +10; +10 to +20; +20 or more.
   Median municipal gap: +6.7 points (address +6.5, within the tract +0.2).
3. Sign robust to confidentiality: women’s homes have more in 620 municipalities and less in 2 even
   in the worst case; in none does the shortfall exceed 1 point. The median width of the
   confidentiality interval is 0.8 point.
4. Decomposition of the gap between women and men: the “address” part (where they live) is the
   coverage women’s homes would have if, in each census tract, they had the same rate as men’s homes in
   that tract, minus men’s coverage; the “within the tract” part is the rest. The tract is the smallest
   published area; within it, the Census does not say which home stands where.
5. Share of women responsible × mains water (total): Spearman rank correlation 0.26 (645
   municipalities), partial 0.07, effective sample 569, p < 0.001; across weighting areas, 0.46
   (partial 0.03). Share of women responsible × gap: Spearman rank correlation −0.26 (645
   municipalities), partial −0.09, effective sample 582, p < 0.001.
6. Partial correlation: the correlation between the residuals of each variable’s ranks regressed on
   the ranks of the controls, which are urbanisation (residents in urban areas), log of population
   density and log of mean income of the responsible person; the control from the variable’s own family
   is dropped. Effective sample under spatial autocorrelation: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), where Iₓ and
   Iᵧ are the Moran’s I of the residuals over a 6-nearest-neighbour neighbourhood; Benjamini–Hochberg q
   values across all tests in the collection.

## Limitations

- In census tracts, IBGE replaces cells of 1 or 2 households with X (in the rare categories, the
  values 1 and 2 never appear in print). Here an X counts as 1.5, and every rate and gap carries the
  worst-case limits with X = 1 and X = 2 (columns `_lo` and `_hi`); tracts that are wholly X are left
  out. Summed tracts reproduce the share of women responsible in table 9882 for every municipality
  within 0.45 point (median 0.01).
- Off the general network are wells, springs, water trucks and other sources; in the countryside, a
  well does not mean a lack of water. The gap measures access to the network, not the quality or
  regularity of supply.
- The responsible person is whoever the residents name as such to the enumerator. It does not mean
  the breadwinner, nor a lone mother: of São Paulo homes with a woman responsible, 44% include a
  spouse.
- Ecological reading: the map compares places, not people. A correlation between municipalities does
  not say that the same homes have both traits, nor that one causes the other; urbanisation, income
  and age may lie behind both.
