---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Piped gas, bottled gas"
subtitulo: "Where gas comes by pipe, where by cylinder"
contexto: >-
  In 2024, fixed-use piped natural gas (no CNG, no power plants) reached 133 of São Paulo’s 645 municipalities, home to 77% of the population; in the other 512, gas means LPG. In energy, piped gas sells 4.3 times as much as LPG, but 85% of it goes to industry, and only 85 municipalities have residential piped gas. Santa Gertrudes takes 509 GJ per person, 164 times the median of the towns served (3.1 GJ). LPG adds up to 1.76 million tonnes, 39.7 kg per person; 26% of it is sold in towns with no pipes, which hold 23% of the population. In 131 municipalities without piped gas, LPG per person sits in the top third. Jardinópolis, with 45,000 people and no pipes, sells 434 kg per person, 11 times the state average. LPG sold is not LPG burned there: the figure covers every use, and many cylinders are bought in the next town.
imagem: ./mapa_preview.en.png
imagem_alt: "Bivariate 3 × 3 map of São Paulo’s 645 municipalities in 2024: fixed-use piped natural gas per person (none, up to the median of the towns served, above it) crossed with LPG per person in thirds (up to 16, 16 to 38, over 38 kg). Towns without piped gas run from light grey to orange with LPG; towns with piped gas run from light blue to dark brown. The west and south stay grey, cream and orange, with no pipes; the blues and browns cluster along the axis from the capital to Campinas, Piracicaba and Ribeirão Preto and in the Paraíba Valley. Three callouts: Jardinópolis, 434 kg of LPG per person, no piped gas; Santa Gertrudes, 509 GJ of piped gas per person; São Paulo, 1.9 GJ and 23 kg per person. The panel holds the 3 × 3 grid with the number of municipalities in each cell and bars of LPG per person in the largest towns with no pipes."
metodo: "Fixed-use piped natural gas (total minus automotive and thermal generation) and LPG sold in each municipality (SEMIL/SP, base year 2024), per person from the 2022 Census; piped gas in three classes (none, up to the median of the towns served, above) and LPG in thirds of the municipalities, crossed in a 3 × 3 bivariate map."
---

# Piped gas, bottled gas: piped natural gas and LPG per person in São Paulo’s municipalities in 2024

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 146, the third and last in the **Each town’s energy** collection. In São Paulo, gas arrives
by two routes: through the natural-gas utilities’ pipes or in LPG cylinders. The map crosses the two,
per person, to show where the network has reached and where the cylinder stands in for it.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `CD_MUN`, `NM_MUN`, `CD_RGINT`, `NM_RGINT`, `populacao_2022`, `gn_consumidores`, `gn_residencial_nc`, `gn_residencial_m3`, `gn_comercial_m3`, `gn_industrial_m3`, `gn_automotivo_m3`, `gn_cogeracao_m3`, `gn_termogeracao_m3`, `gn_total_m3`, `gn_fixo_m3` (fixed use), `gn_fixo_gj_hab`, `glp_kg`, `glp_kg_hab`, `glp_gj_hab`, `classe_gn` (0 to 2), `classe_glp` (0 to 2), `classe` (3 × `classe_gn` + `classe_glp`) and `cor` |
| `regioes_intermediarias` | polygon | IBGE’s 11 intermediate regions: `CD_RGINT`, `NM_RGINT` |
| `limite_estadual` | polygon | state outline |

The **GPKG** is zipped and attached to the
[`energia-municipal-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/energia-municipal-sp-2026),
with the plate’s **QGIS style** (the nine cells of the grid) on the `municipios` layer. The **CSV** sits
in this folder, UTF-8, without geometry. Field names are in Portuguese (`gn` natural gas, `glp` LPG,
`hab` per person).

## Method

1. **Reading the Yearbook** as for plate 144: `pdftotext -table`, numbers placed in their column by
   position and checked against row sums and the state row.
2. **Fixed-use gas** = total piped natural gas − automotive (CNG) − thermal generation (power plants).
   What remains is industrial, residential, commercial and cogeneration: 4,632 million m³ in the state.
   Converted to energy at 0.993 toe per thousand m³ (a factor taken from the Yearbook’s tables) and
   1 toe = 41.868 GJ.
3. **LPG** in kg per person, from sales in tonnes; in energy, 0.611 toe per tonne, found the same way.
   The table’s only negative value (−907 kg, in one municipality) was set to zero.
4. **Classes.** Piped gas: none; up to the median of the 133 towns served (3.10 GJ per person); above
   it. LPG: thirds of the 645 municipalities, cut at 16.4 and 38.3 kg per person.
5. **Comparisons.** “4.3 times” compares fixed-use gas (4.60 million toe) with LPG (1.08 million toe).
   Population is from the 2022 Census.

## Limitations

- **LPG sold is not LPG burned there.** The Yearbook assigns each sale to the municipality where the
  distributor records it, and many cylinders are bought in the next town. Borá, with 907 people, shows
  2,405 kg per person; Aguaí, at 1,183 kg, and Borebi, at 726 kg, are also far above what a household
  uses.
- **LPG covers every use**: cooking, shops, industry, grain drying, forklifts. The Yearbook does not
  split LPG by sector, so there is no telling how much goes to homes.
- Fixed-use piped gas is dominated by industry (85%). A municipality above the median may have one
  large factory and no homes connected: only 85 municipalities have residential piped gas.
- The two piped-gas classes use the median of the towns served; the scale is relative to the state, not
  to an access target.

## Data licence

SEMIL/SP’s Municipal Energy Yearbook and IBGE’s municipal mesh and Census: public data, free to use with
attribution.
