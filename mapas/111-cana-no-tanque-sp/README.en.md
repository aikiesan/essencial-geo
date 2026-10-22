---
# English version (EN-UK). Numbers, files and layers come from README.md.
titulo: "Cane in the tank"
subtitulo: "Where there is more cane, ethanol weighs more in what filling stations sell"

contexto: >-
  In São Paulo municipalities with more cane, ethanol weighs more in the fuel sold for petrol and flex-fuel engines. In energy, hydrous ethanol was 43% of Otto-cycle sales statewide in 2024; in the third of municipalities with least cane, 38%; in the third with most, 52%. The rank correlation is 0.70 and stays at 0.59 net of urbanisation, density and income. In Ibaté, with cane on 51% of its area, ethanol reaches 69%; in São Luiz do Paraitinga, with no cane, it is 16%. Sales are not consumption, and prices, the fleet and distance from mills may lie behind it. First plate of the collection “Bioenergy, crossed”.

imagem: ./mapa_preview.en.png
imagem_alt: "Bivariate map of São Paulo’s 643 municipalities in nine colours, crossing thirds of area under cane (light to ochre) with thirds of ethanol’s share of Otto-cycle sales (light to lilac); where both are high, dark brown. Brown dominates the cane belt in the centre and north-west; light grey, little cane and little ethanol, covers Greater São Paulo, the Paraíba Valley and the Ribeira Valley. Two municipalities with no fuel sales in the Yearbook are hatched. Callouts point to Ibaté, with 69% ethanol, São Luiz do Paraitinga, with 16%, and São Paulo, with 39%. In the panel, the 3 × 3 grid with the number of municipalities in each cell and the table of correlations."

recorte: "São Paulo State (SP)"
metodo: "Share of municipal area under sugar cane (MapBiomas, collection 10, 2024) and hydrous ethanol’s share of the energy sold in the Otto cycle (ethanol and petrol C, SEMIL/SP, base year 2024), each in thirds of municipalities, crossed in a 3 × 3 bivariate map; Spearman rank correlations, raw and partial, and bivariate LISA."
---

# Area under cane and ethanol’s share of what filling stations sell, across São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 111, the first of five in the collection **Bioenergy, crossed**; the next, [plate 112](../112-diesel-que-o-biometano-cobriria-sp/README.en.md).

The collection crosses São Paulo’s bioenergy with what filling stations sell, with the countryside
and with town halls, across the state’s 645 municipalities. The pairs came from a correlation screen
between CP2B biomethane potential, fuel sales in the SEMIL Yearbook, plantation forestry, the cattle
herd, the Agricultural Census, the vehicle fleet and MUNIC. Each pair went through raw and partial
rank correlation (net of urbanisation, density and income), an effective sample corrected for
spatial autocorrelation, Benjamini–Hochberg q values and bivariate LISA. The last plate is
descriptive, with no test, and the text says so.

The map’s callouts point to Ibaté, where ethanol is 69% of the energy sold in the Otto cycle (the
highest among municipalities of 10,000 or more) and cane covers 51% of the area; São Luiz do
Paraitinga, with no cane and 16% (the lowest); and São Paulo, at 39%, just below the state.

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

1. `pct_area_cana`: area under sugar cane (MapBiomas, collection 10, 2024) over municipal area, in
   %.
2. `etanol_l` and `gasolina_l`: litres of hydrous ethanol and petrol C sold in the municipality in
   2024 (SEMIL/SP, Municipal Energy Yearbook 2025). `pct_etanol_otto` = ethanol × 21.3 MJ/L ÷ (ethanol
   × 21.3 + petrol C × 32.2 MJ/L), in %; petrol C already carries blended anhydrous ethanol, which
   stays in the petrol share.
3. Thirds of cane: up to 3.4%, 3.4% to 35.6% and over 35.6%; of ethanol: up to 39.8%, 39.8% to 52.5%
   and over 52.5%. `b111`: bivariate class, tens = third of cane (1 to 3), units = third of ethanol (1
   to 3). From bottom to top and left to right, the nine cells hold 169, 39, 6; 38, 102, 74; 7, 73, 135
   municipalities. Anhumas and Redenção da Serra have no fuel sales in the Yearbook and are left out
   (643 municipalities).
4. Cane × ethanol in the Otto cycle: Spearman rank correlation 0.70 (643 municipalities), partial
   0.59, effective sample 310, p < 0.001, q < 0.001. Without the capital, 0.59; outside the São Paulo
   intermediate region, partial 0.56.
5. `lisa111`: bivariate LISA clusters (cane in the municipality × ethanol in its neighbours): 179
   high-high, 176 low-low, 2 high-low and 8 low-high; bivariate Moran’s I 0.68.
6. Partial correlation: the correlation between the residuals of each variable’s ranks regressed on
   the ranks of the controls, which are urbanisation (residents in urban areas), log of population
   density and log of income per head (2022 Census). Effective sample under spatial autocorrelation:
   n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), where Iₓ and Iᵧ are the Moran’s I of the residuals over a
   6-nearest-neighbour neighbourhood; Benjamini–Hochberg q values across all pairs in the screen.
   Bivariate LISA: the municipality’s value against the mean of its 6 neighbours on the other variable,
   999 permutations, seed 20261019, p < 0.05.

## Limitations

- Sales are not consumption: the SEMIL Yearbook counts what filling stations and distributors sell
  in the municipality, including to people just driving through or to fleets based elsewhere. Towns on
  busy highways may sell far more diesel than they use.
- Relative pump prices, the flex-fuel fleet and distance to the nearest mill may lie behind the
  link; the map does not separate these effects. Ethanol’s share is measured in energy, not litres: in
  litres it would be larger.
- Ecological reading: the map compares municipalities, not people or farms. A correlation between
  municipalities does not say that the same farms or drivers have both traits, nor that one causes the
  other.
