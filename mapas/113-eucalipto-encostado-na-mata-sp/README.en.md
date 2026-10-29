---
# English version (EN-UK). Numbers, files and layers come from README.md.
titulo: "Eucalyptus against the forest"
subtitulo: "Where more native vegetation remains, more wood goes to paper and pulp"

contexto: >-
  In São Paulo municipalities that harvest plantation wood for paper and pulp, the more native vegetation remains, the more wood comes out per km². Across the 366 municipalities in PEVS 2024, the rank correlation is 0.42, and 0.47 net of urbanisation, density and income. The median producer has 18.7% of its area under native vegetation; surveyed municipalities that do not produce, 9.8%. The 127 producers harvested 24.8 million m³, mostly in the south-west, around Sorocaba, and the centre-west, around Bauru. Capão Bonito combines 39% native cover with 1.70 million m³. Relief and soils that keep cane away may lie behind both. Third plate of the collection “Bioenergy, crossed”.

imagem: ./mapa_preview.en.png
imagem_alt: "Bivariate map of São Paulo in nine colours, crossing thirds of native vegetation (light to ochre) with three steps of pulpwood per km² (none, below and above the producers’ median, light to lilac); where both are high, dark brown. The 279 municipalities outside PEVS 2024 are hatched, with no data. Brown gathers in the south-west, around Capão Bonito, in the centre-west, near Agudos, and in the Paraíba Valley. Callouts point to Capão Bonito, with 39% native cover and 1.70 million m³, and Agudos, with 21% and 845 thousand m³. In the panel, the 3 × 3 grid and the table of correlations."

recorte: "São Paulo State (SP)"
metodo: "Share of municipal area under native vegetation (MapBiomas, collection 10, 2024), in thirds, crossed with plantation roundwood for paper and pulp per km² (IBGE, PEVS 2024): none, below and above the producers’ median; 3 × 3 bivariate map only in PEVS municipalities; Spearman rank correlations, raw and partial, and bivariate LISA."
---

# Native vegetation and wood for paper and pulp across São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 113, the third of five in the collection **Bioenergy, crossed**; the previous one is [plate 112](../112-diesel-que-o-biometano-cobriria-sp/README.en.md); the next, [plate 114](../114-esterco-longe-de-quem-aduba-sp/README.en.md).

The collection crosses São Paulo’s bioenergy with what filling stations sell, with the countryside
and with town halls, across the state’s 645 municipalities. The pairs came from a correlation screen
between CP2B biomethane potential, fuel sales in the SEMIL Yearbook, plantation forestry, the cattle
herd, the Agricultural Census, the vehicle fleet and MUNIC. Each pair went through raw and partial
rank correlation (net of urbanisation, density and income), an effective sample corrected for
spatial autocorrelation, Benjamini–Hochberg q values and bivariate LISA. The last plate is
descriptive, with no test, and the text says so.

The map’s callouts point to Capão Bonito, with 39% of its area under native vegetation and 1.70
million m³ of pulpwood in 2024 (top third of both), and Agudos, in the centre-west, with 21% and 845
thousand m³.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities with cane and ethanol, biomethane and diesel, the fleet, native cover and pulpwood, cattle and organic fertiliser, distances to the pipeline, piped gas and the MUNIC answers on waste; classes `b111`, `b113`, `b114`, `arranjo115` and clusters `lisa111`, `lisa113`, `lisa114` |
| `gasodutos` | line | transmission pipelines and distribution network (`tipo`) |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The **GPKG** is the same for all five plates and carries a QGIS style for each. The **CSV** has the
municipal table, without geometry. Empty fields are missing data, not zero. LISA clusters come as
`AA` (high-high), `BB` (low-low), `AB`, `BA` and `ns` (not significant); the first letter is the
municipality’s variable, the second its neighbours’.

## Method

1. `pct_area_nativa`: native vegetation, MapBiomas natural formations (collection 10, 2024), over
   municipal area, in %.
2. `madeira_papel_m3` and `madeira_papel_m3_km2`: plantation roundwood for paper and pulp in 2024,
   in m³ and per km² of municipal area (IBGE, PEVS, SIDRA 291).
3. Thirds of native cover: up to 9.2%, 9.2% to 18.1% and over 18.1%. Wood: none; up to 165.8 m³/km²
   (median of the 127 producers); more than that. `b113`: bivariate class, tens = third of native cover
   (1 to 3), units = third of wood (1 to 3). From bottom to top and left to right, the nine cells hold
   113, 73, 53; 8, 29, 26; 1, 20, 43 municipalities.
4. PEVS publishes 366 São Paulo municipalities for this variable; the other 279 have no data, not
   zero, and the map hatches them. Native cover × pulpwood per km² (log): Spearman rank correlation
   0.42 (366 municipalities), partial 0.47, effective sample 167, p < 0.001, q < 0.001.
5. `lisa113`: bivariate LISA clusters (native cover in the municipality × wood in its neighbours):
   65 high-high, 0 low-low, 0 high-low and 13 low-high; bivariate Moran’s I 0.37. High-high by
   intermediate region: Sorocaba (23), Bauru (18), São José dos Campos (8) and Marília (7).
6. Partial correlation: the correlation between the residuals of each variable’s ranks regressed on
   the ranks of the controls, which are urbanisation (residents in urban areas), log of population
   density and log of income per head (2022 Census). Effective sample under spatial autocorrelation:
   n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), where Iₓ and Iᵧ are the Moran’s I of the residuals over a
   6-nearest-neighbour neighbourhood; Benjamini–Hochberg q values across all pairs in the screen.
   Bivariate LISA: the municipality’s value against the mean of its 6 neighbours on the other variable,
   999 permutations, seed 20261019, p < 0.05.

## Limitations

- PEVS covers 366 of the 645 municipalities and does not give the species: eucalyptus dominates São
  Paulo’s plantations, but the south-west also grows pine. Pulpwood is not all plantation wood:
  firewood and sawlogs are left out.
- Rugged relief and soils that keep cane and machinery away may explain both; the map does not say
  that plantations protect the forest, nor that they threaten it.
- Ecological reading: the map compares municipalities, not people or farms. A correlation between
  municipalities does not say that the same farms or drivers have both traits, nor that one causes the
  other.
