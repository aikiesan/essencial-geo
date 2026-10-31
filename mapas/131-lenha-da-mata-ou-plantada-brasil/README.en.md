---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Firewood: native or planted"
subtitulo: "The South burns eucalyptus; the Sertão, native wood"
contexto: >-
  Brazil produced 76 million m³ of firewood in 2025. Almost three quarters (72%) comes from planted forest, almost all eucalyptus, and burns in the South and Centre-South, to dry grain, cure tobacco and fire boilers: Paraná alone produced 14.4 million m³, 96% of it planted. The rest, 21 million m³ (28%), is still cut from native forest, in two places: northern Mato Grosso, on the deforestation frontier, and the north-eastern Sertão, where caatinga firewood feeds bakeries, brickworks and homes. Nova Maringá (MT) is the country’s largest firewood producer, 892,000 m³, 96% from native forest. In 1,754 municipalities firewood is almost all native. Charcoal has already turned: 93% comes from planted forest.
imagem_alt: "Map of Brazil in Albers conic projection with 4,299 circles, one per municipality that produced firewood in 2025, sized by volume and coloured by origin in four classes: dark green for almost all planted, light green for mostly planted, beige for mostly native and reddish brown for almost all native. Green circles cover the South, São Paulo, Minas Gerais and Goiás; brown ones, smaller and tightly packed, fill the north-eastern Sertão, from Ceará to Bahia, and scatter across the Amazon; the largest brown circles appear in northern Mato Grosso. Two callouts: Nova Maringá, in Mato Grosso, with 892,000 m³, the country’s largest, 96% cut from native forest, and Butiá, in Rio Grande do Sul, with 794,000 m³ of eucalyptus firewood. The panel holds the classes with the number of municipalities and volume, bars of native and planted firewood and charcoal in 2015 and 2025, and the circle legend."
metodo: "2025 firewood from plant extraction (native forest) and forestry (planted forest), added up by municipality and drawn as circles proportional to volume, coloured by the share that comes from native forest."
---

# Firewood: native or planted, by municipality in Brazil

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 131, the sixth and last in the **Biomass monitor** collection. Firewood is the oldest
biomass and still one of the most burnt; the map separates what comes from planted forest from
what is cut from native forest.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `lenha` | point | 4,299 municipalities with firewood in 2025, at the central point of each: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `lenha_nativa_2015_m3`, `lenha_plantada_2015_m3`, `lenha_nativa_2025_m3`, `lenha_plantada_2025_m3`, `lenha_2025_m3`, `parcela_nativa`, `classe`, `faixa`, `carvao_nativo_2025_t`, `carvao_plantado_2025_t` |
| `ufs` | polygon | 27 states, with their region |
| `limite_nacional` | polygon | national boundary |

The **GPKG** is zipped and attached to the
[`biomassa-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/biomassa-br-2026).
The `lenha` layer carries the plate’s **QGIS style**, with circles proportional to volume. The
**CSV** sits in this folder, in UTF-8, with the same table without geometry.

## Method

1. **Native firewood**: plant extraction output, firewood, in m³ (SIDRA, table 289). **Planted
   firewood**: forestry output, firewood, in m³ (table 291). Years 2015 and 2025. «-» is zero;
   «...» and «..» are left empty and do not enter the sums.
2. **Native share**: native firewood divided by the sum of both, in 2025. Four classes, with
   breaks at 10%, 50% and 90%.
3. Each municipality with firewood in 2025 becomes a circle at its central point, with area
   proportional to total volume.
4. Charcoal, in tonnes, comes from the same tables and appears in the panel and the table, not on
   the map.

## Limitations

- The PEVS is a municipal estimate made with local informants. Native firewood cut without a
  permit, or burnt at home without reaching a market, tends to be left out.
- Firewood is counted where it is cut, not where it is burnt.
- Firewood in m³ and charcoal in tonnes cannot be added up; charcoal has separate bars.

## Data licence

IBGE open data, free to use with attribution.
