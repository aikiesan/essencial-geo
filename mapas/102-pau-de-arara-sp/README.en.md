---
# English version (EN-UK). Numbers, files and layers come from README.md.
titulo: "The open truck to work"
subtitulo: "Riding to work in the back of a truck is still a matter of the countryside and of less schooling"

contexto: >-
  Riding to work in the back of an adapted pickup or lorry, the pau de arara, is still a matter of the countryside and of less schooling. In 135 of São Paulo’s municipalities, 1% or more of employed people who commute travel this way (2022 Census, sample); in 32, the sample found none. Herculândia has the highest rate among municipalities of 5,000 inhabitants or more: 4.8%. The rank correlation with the share of adults without completed primary schooling is 0.41 (0.27 net of urbanisation, density and income) and, with formal jobs in the bioeconomy, 0.38. These are few people and sample data: the map uses broad classes and reads as a pattern between municipalities. Tenth and last plate of the collection “The Census, crossed”.

imagem: ./mapa_preview.en.png
imagem_alt: "Choropleth map of São Paulo’s municipalities in six shades from beige to brown, of the share of workers who ride to work in an open truck: zero, up to 0.25%, 0.25 to 0.5%, 0.5 to 1%, 1 to 2% and over 2%. Dark shades spread across the west and south of the state; the capital and the coast stay light. A callout points to Herculândia, with 4.8% of workers riding to work in an open truck, the highest rate among municipalities of 5,000 inhabitants or more. In the panel, the legend with the number of municipalities in each class and bars with the mean by third of schooling, area under cane and bioeconomy jobs."

recorte: "São Paulo State (SP)"
metodo: "Employed people who travel to work by adapted pickup or lorry over those who commute to work (2022 Census, sample), in six broad classes; means by third of schooling, cane and bioeconomy, and Spearman rank correlations."
---

# Commuting by adapted pickup or lorry across São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 102, the tenth of ten in the collection **The Census, crossed**; the previous one is [plate 101](../101-casas-de-veraneio-sem-esgoto-sp/README.en.md).

The collection grew out of a screen: 4,455 pairs of municipal variables (the 2022 Census and the
bases of other plates in the atlas), of which 4,114 link different families. 834 have a rank
correlation of 0.3 or more and pass the test with the effective sample corrected for spatial
autocorrelation (q < 0.05, Benjamini–Hochberg); 277 stay above 0.3 net of urbanisation, density and
income. Nine of the ten plates come from that last group; the open-truck plate sits just below it
(partial 0.27) and is in for its rare data.

The map’s callout points to Herculândia, with 4.8% of workers riding to work in an open truck, the
highest rate among municipalities of 5,000 inhabitants or more.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities with the variables of all ten plates; for this one, `pct_pau_de_arara`, `pct_sem_fundamental`, `pct_area_cana`, `pct_bioeconomia` and the cluster `lisa102` |
| `apond` | polygon | The state’s 2,535 weighting areas with age, colour or race, homes and household heads’ income |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The **GPKG** is the same for all ten plates and carries a QGIS style for each. The **CSV** has the
municipal table, without geometry. LISA clusters come as `AA` (high-high), `BB` (low-low), `AB`
(open trucks high, schooling low), `BA` and `ns` (not significant).

## Method

1. `pct_pau_de_arara`: employed people who travel to work by adapted pickup or lorry (the pau de
   arara) over employed people who commute to work (2022 Census, sample, SIDRA 10332).
2. Six broad classes: zero, up to 0.25%, 0.25 to 0.5%, 0.5 to 1%, 1 to 2% and over 2%. Zero is kept
   apart because, in sample data, it means “did not turn up in the sample”.
3. Simple mean of the open-truck rate in the bottom, middle and top thirds of municipalities, by: no
   completed primary schooling, aged 25 or over (SIDRA 10061, sample): 0.43%, 0.76%, 0.93%; area under
   cane (MapBiomas): 0.58%, 0.79%, 0.75%; formal jobs in the bioeconomy (RAIS 2025, plate 076): 0.45%,
   0.80%, 0.86%.
4. Spearman rank correlations: with no completed primary schooling, 0.41 (partial 0.27, effective
   sample 588); with the bioeconomy, 0.38 (partial 0.23); with cane, 0.24 (partial 0.24); with farm
   workers, 0.35 (partial 0.17). Controls: urbanisation, log of density and log of income per head.
5. Bivariate LISA with no completed primary schooling (6 neighbours, 999 permutations, p < 0.05): 48
   high-high municipalities and 84 low-low.

## Limitations

- The share of workers riding open trucks (and that of adults without completed primary schooling)
  comes from the 2022 Census sample: these are estimates expanded by IBGE, with sampling error that
  grows as the municipality shrinks. Small differences between small municipalities may be noise;
  hence the broad classes. Where IBGE marks X (confidentiality), the field is left empty, never zero.
  This is an extreme case: the rate covers few people, and in a small municipality one truck more or
  less changes the class. The 32 municipalities at zero mean “the sample found none”, not “nobody
  travels this way”.
- The Census asks for the main means of transport; people who combine an open truck and a bus may
  appear in another category.
- The partial correlation (0.27) sits below the screen’s 0.3 cut-off: net of urbanisation and
  income, schooling explains little. The plate is in the collection for its rare data, not for the
  strength of the link.
- Ecological reading: the map compares municipalities, not people. A correlation between
  municipalities does not say that the same people have both traits, nor that one causes the other;
  income, age, settlement history and town size may lie behind both.
