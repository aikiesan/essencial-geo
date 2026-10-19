---
# English version (EN-UK). Numbers, files and layers come from README.md.
titulo: "Nearly half the homes"
subtitulo: "In 2022, 49% of São Paulo’s households named a woman as the person responsible"

contexto: >-
  In 2022, 49.2% of São Paulo’s households (7.99 million out of 16.24 million) named a woman as the responsible person; in 2010 it was 39.0%. By weighting area, the share is higher in towns and dense neighbourhoods: a rank correlation of 0.51 with urbanisation and 0.59 with density, across 2,520 areas. Across municipalities it runs from 25% to 65%. The responsible person is whoever the residents name to the enumerator: it does not mean the breadwinner, nor a lone mother. First plate of the collection “Women heading households”, which crosses this figure with sewerage, water, lighting and income, always comparing places, not people.

imagem: ./mapa_preview.en.png
imagem_alt: "Choropleth map of São Paulo’s 2,520 weighting areas in six shades of lilac, from light (under 40% of households with a woman responsible) to dark (56% or more); 15 areas without data are hatched. Dark shades appear mostly in urban patches, and the capital forms a mosaic of small areas. Callouts point to the Ourinhos area, at 63%, the highest among areas of 5,000+ residents, and the Alumínio area, at 23%, the lowest. In the panel, the legend with the number of areas per class and the table of correlations with urbanisation, density and income."

recorte: "São Paulo State (SP)"
metodo: "Households with a woman as the responsible person over all households, by weighting area, from summed 2022 Census tracts (full count); six classes of 4 points; Spearman rank correlations with urbanisation, density and income, raw and partial."
---

# Households with a woman responsible in São Paulo, by weighting area

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 103, the first of eight in the collection **Women heading households**; the next, [plate 104](../104-dez-pontos-em-doze-anos-sp/README.en.md).

The collection crosses the share of households with a woman responsible with home and street
services and with income, across São Paulo’s 645 municipalities. The tests came before the maps: raw
and partial rank correlation (net of urbanisation, density and income), effective sample corrected
for spatial autocorrelation, Benjamini–Hochberg q values, Moran’s I, LISA, and a comparison between
municipalities and weighting areas. Most relationships with services vanish once urbanisation is
netted out: women responsible are more common in towns, and towns have more network. Weak
relationships also become maps, as descriptive portraits, and the text says they are weak.

The map’s callouts point to the Ourinhos weighting area, with 63% of households with a woman
responsible (the highest among areas of 5,000+ residents), and the Alumínio area, with 23% (the
lowest).

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities with the variables of all eight plates: share of women responsible in 2010 and 2022, household make-up, water, sewerage, refuse, bathroom and indoor piped water by sex of the responsible person, street lighting, income by sex, `b109`, `lisa103` and `lisa109` |
| `apond` | polygon | 2,520 weighting areas with the share of women responsible, urbanisation, income of the responsible person and the water and sewerage gaps |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The **GPKG** is the same for all eight plates and carries a QGIS style for each. The **CSV** has the
municipal table, without geometry; the second CSV, the weighting area table. In the columns, `_lo`
and `_hi` are the confidentiality limits; LISA clusters come as `AA` (high-high), `BB` (low-low),
`AB`, `BA` and `ns` (not significant).

## Method

1. `pct_resp_mulher`: occupied permanent private households with a woman as the responsible person
   over all households (2022 Census tracts, households part 2, full count), summed by weighting area;
   `pct_resp_mulher_lo` and `_hi` carry the confidentiality limits.
2. Six classes: under 40%, 40 to 44%, 44 to 48%, 48 to 52%, 52 to 56% and 56% or more. Areas with
   under 80% of households in tracts with data are left blank (15 areas).
3. With urbanisation (residents in urban areas): Spearman rank correlation 0.51 (2,520 areas),
   partial 0.04, effective sample 1,825, p < 0.001; with log of density: Spearman rank correlation 0.59
   (2,520 areas), partial 0.33, effective sample 1,439, p < 0.001; with mean income of the responsible
   person: Spearman rank correlation −0.03 (2,520 areas), partial −0.24, effective sample 1,529, p =
   0.287.
4. Across the 645 municipalities, with urbanisation: Spearman rank correlation 0.26 (645
   municipalities), partial 0.20, effective sample 566, p < 0.001. Moran’s I of the share of women
   responsible: 0.39 across areas and 0.17 across municipalities; univariate LISA across municipalities
   (6 neighbours, 999 permutations, seed 20261019, p < 0.05): 72 high-high and 49 low-low (`lisa103`).
5. Partial correlation: the correlation between the residuals of each variable’s ranks regressed on
   the ranks of the controls, which are urbanisation (residents in urban areas), log of population
   density and log of mean income of the responsible person; the control from the variable’s own family
   is dropped. Effective sample under spatial autocorrelation: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), where Iₓ and
   Iᵧ are the Moran’s I of the residuals over a 6-nearest-neighbour neighbourhood; Benjamini–Hochberg q
   values across all tests in the collection.

## Limitations

- The responsible person is whoever the residents name as such to the enumerator. It does not mean
  the breadwinner, nor a lone mother: of São Paulo homes with a woman responsible, 44% include a
  spouse.
- In census tracts, IBGE replaces cells of 1 or 2 households with X (in the rare categories, the
  values 1 and 2 never appear in print). Here an X counts as 1.5, and every rate and gap carries the
  worst-case limits with X = 1 and X = 2 (columns `_lo` and `_hi`); tracts that are wholly X are left
  out. Summed tracts reproduce the share of women responsible in table 9882 for every municipality
  within 0.45 point (median 0.01).
- The partial with urbanisation falls close to zero across weighting areas because density carries
  nearly all of it: what matters is the kind of neighbourhood, not just the urban or rural label.
- Ecological reading: the map compares places, not people. A correlation between municipalities does
  not say that the same homes have both traits, nor that one causes the other; urbanisation, income
  and age may lie behind both.
