---
# English version (EN-UK). Numbers, files and layers come from README.md.
titulo: "Cane and sewers"
subtitulo: "Cane-belt towns are among the best connected to the sewer network"

contexto: >-
  Cane-belt towns are among the best connected to the sewer network. The rank correlation between the share of municipal area under cane (MapBiomas) and homes with sewage to the mains (2022 Census) is 0.55 across the 645 municipalities and 0.50 net of urbanisation, density and income; 121 municipalities are in the top third of both. Sertãozinho, with 68% of its area under cane, has 99.3% of homes on the mains; Atibaia, with no cane, 61%. Cane shapes compact, working-class mid-sized towns (cane × operatives 0.48), but the map does not say that cane brings sewers. Second plate of the collection “The Census, crossed”.

imagem: ./mapa_preview.en.png
imagem_alt: "Bivariate map of São Paulo’s municipalities in nine colours from a three-by-three grid: ochre grows along the axis of area under cane and lilac along that of mains sewerage; dark brown marks municipalities in the top third of both. Callouts point to Sertãozinho, with 99.3% of homes on the mains; Atibaia, with 61% and almost no cane; and Paulicéia, with 49% on the mains and 36% of its area under cane. In the panel, the grid with the number of municipalities in each cell, the tercile limits and the table of correlations."

recorte: "São Paulo State (SP)"
metodo: "Area under cane and mains sewerage by municipality (MapBiomas, IBGE), each split into thirds; the cross gives nine classes. Spearman rank correlation, partial net of the controls, effective sample corrected for spatial autocorrelation and bivariate LISA."
---

# Sugar cane and mains sewerage across São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 094, the second of ten in the collection **The Census, crossed**; the previous one is [plate 093](../093-solar-segue-o-agro-sp/README.en.md); the next, [plate 095](../095-o-oeste-do-boi-envelhece-sp/README.en.md).

The collection grew out of a screen: 4,455 pairs of municipal variables (the 2022 Census and the
bases of other plates in the atlas), of which 4,114 link different families. 834 have a rank
correlation of 0.3 or more and pass the test with the effective sample corrected for spatial
autocorrelation (q < 0.05, Benjamini–Hochberg); 277 stay above 0.3 net of urbanisation, density and
income. Nine of the ten plates come from that last group; the open-truck plate sits just below it
(partial 0.27) and is in for its rare data.

The map’s callouts point to Sertãozinho, with 99.3% of homes on the mains; Atibaia, with 61% and
almost no cane; and Paulicéia, with 49% on the mains and 36% of its area under cane.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities with the variables of all ten plates; for this one, `pct_area_cana`, `pct_esgoto_rede`, the class `b094` (11 to 33: tens = third of area under cane, units = third of mains sewerage) and the cluster `lisa094` |
| `apond` | polygon | The state’s 2,535 weighting areas with age, colour or race, homes and household heads’ income |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The **GPKG** is the same for all ten plates and carries a QGIS style for each. The **CSV** has the
municipal table, without geometry. LISA clusters come as `AA` (high-high), `BB` (low-low), `AB`
(first variable high, second low), `BA` and `ns` (not significant).

## Method

1. `pct_area_cana`: share of municipal area under sugar cane in MapBiomas, collection 10, year 2024.
2. `pct_esgoto_rede`: occupied private homes with sewage to the general or storm network or to a
   septic tank linked to it (2022 Census, full count).
3. Thirds of the municipalities with data, closed on the right: cane up to 3.4%, 3.4% to 35.6% and
   over 35.6%; mains up to 83.7%, 83.7% to 92.9% and over 92.9%. The class combines both thirds (121
   municipalities in the top third of both, 133 in the bottom third of both).
4. Spearman rank correlation (0.55, 645 municipalities) and partial correlation: the correlation
   between the residuals of each variable’s ranks regressed on the ranks of the controls, urbanisation
   (residents in urban areas), log of population density and log of household income per head. Result:
   0.50; 0.41 without the São Paulo Intermediate Region.
5. Effective sample under spatial autocorrelation: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), where Iₓ and Iᵧ are
   the Moran’s I of the partial residuals over a 6-nearest-municipality neighbourhood. Here, 389
   effective municipalities; the partial’s test with that sample gives p < 0.001.
6. Bivariate Moran (0.49) and bivariate LISA on standardised ranks, 6 neighbours, 999 permutations
   (seed 20261019), p < 0.05: 111 municipalities in high-high clusters and 109 in low-low.
7. Supporting pairs in the plate’s table: cane × employed as operatives: 0.48 (partial 0.49); cane ×
   residents of favelas and urban communities: −0.38 (partial −0.47).

## Limitations

- Ecological reading: the map compares municipalities, not people. A correlation between
  municipalities does not say that the same people have both traits, nor that one causes the other;
  income, age, settlement history and town size may lie behind both.
- Sanitation depends on the utility company, the terrain and the age of the town; cane is a marker
  of compact mid-sized towns, not an explanation.
- The main pair comes from the Census full count and MapBiomas, with no sampling error. The share
  employed as operatives, used only in the table, comes from the 2022 Census sample: these are
  estimates expanded by IBGE, with sampling error that grows as the municipality shrinks. Small
  differences between small municipalities may be noise; hence the thirds rather than fine classes.
  Where IBGE marks X (confidentiality), the field is left empty, never zero.
- The thirds are relative to São Paulo’s municipalities: São Paulo’s bottom third may sit above the
  average of other states.
