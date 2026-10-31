---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The forest that is planted"
subtitulo: "Eucalyptus in the Cerrado, pine in the South"
contexto: >-
  Brazil had 10.4 million hectares of planted forest at the end of 2025, 1.2% of its land area, and 79% of it is eucalyptus. Eucalyptus is spreading across the Cerrado: Minas Gerais has 2.2 million hectares and Mato Grosso do Sul 1.9 million, almost all in a handful of municipalities along the Paraná river. Ribas do Rio Pardo (MS) has the country’s largest planted area, 537,000 hectares, eucalyptus on 31% of the municipality, next to one of the world’s largest pulp mills. Pine sits in the cool South and shrank by 10% in ten years; Arroio Trinta (SC) has 74% of its area planted, almost all with pine. Pulpwood logs rose from 77 million to 130 million m³ in ten years, up 70%.
imagem_alt: "Choropleth map of Brazil in Albers conic projection, with municipalities shaded by the share of their area under planted forest in 2025, in four bands (1 to 5%, 5 to 15%, 15 to 30% and 30% or more), in the hue of the species with the largest area: greens for eucalyptus, blues for pine and ochres for other species. Municipalities under 1% are pale grey-green, those with no planted forest recorded almost white, those without data grey. A dark-green block marks eastern Mato Grosso do Sul; greens cover Minas Gerais, inland São Paulo, southern Bahia and Espírito Santo; blues gather in Paraná and Santa Catarina. Two callouts: Ribas do Rio Pardo, in Mato Grosso do Sul, with 537,000 hectares, the largest planted area, and Arroio Trinta, in Santa Catarina, with 74% of the municipality planted, almost all with pine. The panel holds the grid legend by species and band, bars of each species’ area in 2015 and 2025 and the six states with the most planted forest."
metodo: "Planted forest area on 31/12/2025 from the PEVS divided by each municipality’s area, in four bands above 1%, in the hue of the species with the largest area (eucalyptus, pine or other)."
---

# The forest that is planted: planted forest by municipality in Brazil

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 130, the fifth in the **Biomass monitor** collection. Planted forest supplies pulp,
charcoal and firewood, and the black liquor of pulp mills is the second fuel of biomass
electricity (plate 127).

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 5,571 municipalities: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `area_km2`, `floresta_2015_ha`, `floresta_2025_ha`, `eucalipto_2025_ha`, `pinus_2025_ha`, `outras_2025_ha`, `situacao_pevs` (value, not available, not recorded), `especie_lider`, `pct_area`, `classe`, `faixa` |
| `ufs` | polygon | 27 states, with their region |
| `limite_nacional` | polygon | national boundary |

The **GPKG** is zipped and attached to the
[`biomassa-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/biomassa-br-2026).
The `municipios` layer carries the plate’s **QGIS style**. The **CSV** sits in this folder, in
UTF-8, with the same table without geometry.

## Method

1. Total forestry area on 31/12, by species (eucalyptus, pine and other), in 2015 and 2025, from
   IBGE’s Forestry and Plant Extraction Production survey (PEVS) (SIDRA, table 5930).
2. **Share of municipal area**: planted forest in 2025 divided by the municipality’s area
   (computed in the Albers projection). Four bands above 1% (1 to 5%, 5 to 15%, 15 to 30% and 30%
   or more), in the hue of the species with the largest area.
3. The 1,769 municipalities missing from the table have no forestry recorded in the PEVS and are
   grouped with the 18 with zero area. The 243 marked «...» (not available) are grey.
4. Pulpwood logs come from forestry output (SIDRA, table 291), in m³.

## Limitations

- The PEVS is a municipal estimate made with local informants (companies, cooperatives,
  environmental agencies), not a satellite survey.
- The area is recorded in the municipality where it is planted; the wood may be processed far
  away.
- «Other species» groups acacia, teak, rubber tree, paricá and others, each with little area.

## Data licence

IBGE open data, free to use with attribution.
