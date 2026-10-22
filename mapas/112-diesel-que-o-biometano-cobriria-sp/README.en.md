---
# English version (EN-UK). Numbers, files and layers come from README.md.
titulo: "The diesel biomethane could cover"
subtitulo: "In 300 municipalities, biomethane potential exceeds, in energy, the diesel sold at the pumps"

contexto: >-
  If all of São Paulo’s accessible biomethane potential became fuel, 6.16 billion m³ a year, it would cover in energy 44% of the 13.6 billion litres of diesel sold in the state in 2024; outside the São Paulo intermediate region, 61%. In 300 of the 643 municipalities the potential exceeds the diesel sold, and in the median municipality it reaches 80%. Sertãozinho would cover its own diesel with a third to spare; the whole Presidente Prudente region reaches 125%; the capital, 3%. It is an energy sum, not a plan: CP2B is a model, and diesel sales are not consumption. Second plate of the collection “Bioenergy, crossed”.

imagem: ./mapa_preview.en.png
imagem_alt: "Choropleth map of São Paulo’s 645 municipalities in six classes of the ratio between biomethane potential and diesel sold, in energy: three shades of ochre below 0.5, beige from 0.5 to 1 and two shades of green for 1 or more. Green covers most of the interior; ochre, Greater São Paulo, the Paraíba Valley, the coast and highway towns; two municipalities with no diesel sales in the Yearbook are hatched. Callouts point to Sertãozinho, at 1.35, Presidente Prudente, at 0.20, and São Paulo, at 0.03. In the panel, the legend with the number of municipalities per class and bars with each intermediate region’s ratio."

recorte: "São Paulo State (SP)"
metodo: "CP2B biomethane potential (v5.1, level N4, reference scenario) in m³ a year, converted into energy-equivalent litres of diesel (1 m³ ≈ 0.98 L), over the diesel oil sold in the municipality (SEMIL/SP, base year 2024); six classes of the ratio; sums by intermediate region."
---

# Biomethane potential over diesel sold, in energy, across São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 112, the second of five in the collection **Bioenergy, crossed**; the previous one is [plate 111](../111-cana-no-tanque-sp/README.en.md); the next, [plate 113](../113-eucalipto-encostado-na-mata-sp/README.en.md).

The collection crosses São Paulo’s bioenergy with what filling stations sell, with the countryside
and with town halls, across the state’s 645 municipalities. The pairs came from a correlation screen
between CP2B biomethane potential, fuel sales in the SEMIL Yearbook, plantation forestry, the cattle
herd, the Agricultural Census, the vehicle fleet and MUNIC. Each pair went through raw and partial
rank correlation (net of urbanisation, density and income), an effective sample corrected for
spatial autocorrelation, Benjamini–Hochberg q values and bivariate LISA. The last plate is
descriptive, with no test, and the text says so.

The map’s callouts point to Sertãozinho, where the potential would cover 135% of the diesel sold;
Presidente Prudente, a city selling a lot of diesel (ratio 0.20) in an intermediate region that
reaches 125%; and São Paulo, at 3%.

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

1. `biometano_m3d`: CP2B biomethane potential, v5.1, level N4 (accessible), reference scenario, in
   m³ a day (the same as plates 055 to 059).
2. `diesel_l`: litres of diesel oil sold in the municipality in 2024 (SEMIL/SP, Municipal Energy
   Yearbook 2025).
3. `cobertura_diesel` = biometano_m3d × 365 × 0.98 ÷ diesel_l. The factor of 0.98 L of diesel per m³
   of biomethane equates their energy (lower heating value). Classes: under 0.1 (169); 0.1 to 0.25
   (47); 0.25 to 0.5 (53); 0.5 to 1 (74); 1 to 2 (97); 2 or more (203); 2 with no diesel sales (Anhumas
   and Redenção da Serra).
4. By intermediate region: Presidente Prudente 125%; Araçatuba 108%; Ribeirão Preto 104%; Bauru 93%;
   Marília 93%; São José do Rio Preto 91%; Araraquara 72%; Sorocaba 29%; Campinas 23%; São Paulo 2%;
   São José dos Campos 2%.
5. `caminhoes` and `onibus`: lorries and tractor units, buses and minibuses registered in the
   municipality (SENATRAN, December 2025); the state has 978,415 lorries. Biomethane (log) × lorries
   per thousand people: Spearman rank correlation 0.35 (645 municipalities), partial 0.39, effective
   sample 522, p < 0.001, q < 0.001; biomethane × diesel per head: Spearman rank correlation 0.40 (644
   municipalities), partial 0.35, effective sample 619, p < 0.001, q < 0.001; jobs at mills × diesel
   per head: Spearman rank correlation 0.43 (644 municipalities), partial 0.41, effective sample 643, p
   < 0.001, q < 0.001.
6. Partial correlation: the correlation between the residuals of each variable’s ranks regressed on
   the ranks of the controls, which are urbanisation (residents in urban areas), log of population
   density and log of income per head (2022 Census). Effective sample under spatial autocorrelation:
   n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), where Iₓ and Iᵧ are the Moran’s I of the residuals over a
   6-nearest-neighbour neighbourhood; Benjamini–Hochberg q values across all pairs in the screen.
   Bivariate LISA: the municipality’s value against the mean of its 6 neighbours on the other variable,
   999 permutations, seed 20261019, p < 0.05.

## Limitations

- CP2B is a model: the potential estimates what residues would yield at level N4 (accessible, after
  collection, competing uses, storage and haulage), not biomethane actually produced.
- Sales are not consumption: the SEMIL Yearbook counts what filling stations and distributors sell
  in the municipality, including to people just driving through or to fleets based elsewhere. Towns on
  busy highways may sell far more diesel than they use.
- The ratio compares energy; it does not say biomethane would reach the state’s 978,415 lorries,
  which need gas engines or conversion kits, filling stations and logistics. Biomethane also has
  competing uses: grid injection, industry and power generation.
- Ecological reading: the map compares municipalities, not people or farms. A correlation between
  municipalities does not say that the same farms or drivers have both traits, nor that one causes the
  other.
