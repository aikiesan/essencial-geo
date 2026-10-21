---
# English version (EN-UK). Numbers, files and layers come from README.md.
titulo: "Sewerage and the address"
subtitulo: "Homes with a woman responsible are more often on mains sewerage because they sit more in town"

contexto: >-
  Statewide, 92.4% of homes with a woman responsible are on mains sewerage, against 90.1% of those with a man responsible: +2.2 points. Nearly all of it (+2.17) is address: women’s homes sit more in urban tracts already on the network. Compared with men’s homes in the same census tract, +0.07 point is left. Women’s homes have more sewerage in 611 of the 645 municipalities; Cunha has the widest gap (73% against 47%), and in Cubatão women’s homes have less (−2.4). Net of urbanisation, the share of women responsible is unrelated to coverage (partial −0.04). Fourth plate of the collection “Women heading households”.

imagem: ./mapa_preview.en.png
imagem_alt: "Choropleth map of São Paulo’s 645 municipalities by the gap, in percentage points, between the share of homes with a woman and with a man responsible that are on mains sewerage: ochre where women’s homes have 1 point less or more, grey between −1 and +1, and four shades of lilac from +1 to +20 points or more. Almost the whole state is lilac, darker in municipalities with large rural areas. Callouts point to Cunha, at +27 points, and Cubatão, at −2.4. In the panel, the state gap broken down into address and within the tract."

recorte: "São Paulo State (SP)"
metodo: "Share of homes with a woman and with a man responsible on mains sewerage, from summed 2022 Census tracts (full count); gap in percentage points, broken down into address and within the tract; six classes; Spearman rank correlations, raw and partial."
---

# Mains sewerage by sex of the responsible person across São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 106, the fourth of eight in the collection **Women heading households**; the previous one is [plate 105](../105-responsavel-nao-e-mae-solo-sp/README.en.md); the next, [plate 107](../107-agua-e-responsaveis-mulheres-sp/README.en.md).

The collection crosses the share of households with a woman responsible with home and street
services and with income, across São Paulo’s 645 municipalities. The tests came before the maps: raw
and partial rank correlation (net of urbanisation, density and income), effective sample corrected
for spatial autocorrelation, Benjamini–Hochberg q values, Moran’s I, LISA, and a comparison between
municipalities and weighting areas. Most relationships with services vanish once urbanisation is
netted out: women responsible are more common in towns, and towns have more network. Weak
relationships also become maps, as descriptive portraits, and the text says they are weak.

The map’s callouts point to Cunha, where 73% of women’s homes and 47% of men’s are on mains sewerage
(+27 points, of which −0.1 within the tract), and Cubatão, where women’s homes have less (−2.4
points, between −2.8 and −2.0 given confidentiality).

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

1. `esgoto_rede_homem`, `esgoto_rede_mulher`, `esgoto_rede_dif` (with `_lo` and `_hi`),
   `esgoto_rede_dif_composicao` and `esgoto_rede_dif_setor`: homes with sewage to the general or storm
   network or to a septic tank linked to it, as % of homes with a man and a woman responsible, and the
   gaps in percentage points (2022 Census tracts, full count).
2. Gap classes: women 1 point lower or more; −1 to +1; +1 to +5; +5 to +10; +10 to +20; +20 or more.
   Median municipal gap: +6.8 points (address +6.5, within the tract +0.2).
3. Sign robust to confidentiality: women’s homes have more in 611 municipalities and less in 13 even
   in the worst case; in 3 (Cubatão, Guarujá and Taquarivaí) the shortfall exceeds 1 point. The median
   width of the confidentiality interval is 0.8 point.
4. Decomposition of the gap between women and men: the “address” part (where they live) is the
   coverage women’s homes would have if, in each census tract, they had the same rate as men’s homes in
   that tract, minus men’s coverage; the “within the tract” part is the rest. The tract is the smallest
   published area; within it, the Census does not say which home stands where.
5. Share of women responsible × mains sewerage (total): Spearman rank correlation 0.15 (645
   municipalities), partial −0.04, effective sample 543, p < 0.001; across weighting areas, 0.24
   (partial −0.05). Share of women responsible × gap: Spearman rank correlation −0.26 (645
   municipalities), partial −0.08, effective sample 583, p < 0.001.
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
- The map compares women’s and men’s homes within each municipality; it does not say that a woman
  who becomes responsible gets sewerage. The gap follows where homes are: in towns with large rural
  areas (Cunha, the Ribeira Valley), men’s homes are more often in the countryside, off the network.
- The responsible person is whoever the residents name as such to the enumerator. It does not mean
  the breadwinner, nor a lone mother: of São Paulo homes with a woman responsible, 44% include a
  spouse.
- Ecological reading: the map compares places, not people. A correlation between municipalities does
  not say that the same homes have both traits, nor that one causes the other; urbanisation, income
  and age may lie behind both.
