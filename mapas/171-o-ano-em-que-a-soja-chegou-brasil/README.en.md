---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The year soy arrived"
subtitulo: "Soy passed 5% of the land in 1,009 municipalities after 1985; in the last decade, from Rio Grande do Sul to Roraima"
contexto: >-
  In 1985 soy covered 5% or more of the land in 402 municipalities, nearly all in the South. Over the next forty years it crossed that line in another 1,009: 320 between 1986 and 1995, 232 by 2005, 222 by 2015 and 235 from 2016 to 2025. The planted area went from 4.5 to 44.2 million hectares in MapBiomas’ mapping. The last decade was not only about the northern frontier, with Paragominas (Pará) in 2018 and Boa Vista (Roraima) in 2022: São Paulo had 47 arrivals, Santa Catarina 33 and Goiás 32, as soy moved onto former pasture and cane. First plate in the collection «Forty years of biomass».
imagem_alt: "Map of Brazil in Albers conic projection with municipalities coloured by the period in which soy passed 5% of their area: dark brown for those that already had soy in 1985, in Paraná, Rio Grande do Sul, southern Mato Grosso do Sul and Goiás and south-western Mato Grosso, and ever lighter shades, down to yellow, for 1986–1995, 1996–2005, 2006–2015 and 2016–2025, spreading through Mato Grosso, Goiás, western Bahia, Maranhão, Piauí, Tocantins, Pará and Roraima. One callout points to Boa Vista (Roraima), a 2022 arrival and the northernmost, another to Paragominas (Pará), from 2018. In the panel, bars of municipalities by period, a histogram of arrivals by year, peaking at 127 in 1986 and 101 in 2014–2015, and a table by region and period."
metodo: "Soy area (MapBiomas class 39, collection 11) in each municipality and year from 1985 to 2025, biomes summed, divided by the area of all the municipality’s classes; year of arrival = first year with 5% or more for three years running (or up to 2025)."
---

# The year soy arrived: soy above 5% of the land, municipality by municipality, 1985 to 2025

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 171, the first in the collection **Forty years of biomass**. Instead of today’s soy area,
the date on which soy became part of each municipality’s landscape: a frontier drawn in time.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 5,571 municipalities: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `area_ha`, `soja_1985_ha`, `soja_1985_pct`, `soja_2025_ha`, `soja_2025_pct`, `soja_max_pct`, `ano_chegada` (0 = never; −1 = no statistics), `periodo` (0 = already in 1985 … 4 = 2016–2025; −1 = never), `faixa`, `abaixo_em_2025`, `lon`, `lat` |
| `ufs` | polygon | 27 states |
| `limite_nacional` | polygon | national boundary |

The **GPKG** is zipped and attached to the
[`quarenta-anos-de-biomassa-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/quarenta-anos-de-biomassa-br-2026),
with **QGIS styles** embedded. The **CSV** sits in this folder, UTF-8, with the municipal table and
no geometry.

## Method

1. MapBiomas land cover and land use statistics, collection 11 (August 2026), sheet `COVERAGE_11`:
   area in hectares of each class by biome, state and municipality, for every year from 1985 to
   2025. Municipalities that straddle two biomes appear on more than one row; the rows were summed.
2. Soy share: area of class 39 (soybean) divided by the area of all classes in the municipality in
   the same year. The Patos and Mirim lagoons (codes 4300001 and 4300002) are left out; Fernando de
   Noronha has no statistics.
3. Year of arrival: the first year in which soy covers 5% or more of the area and stays above it for
   the next two years (for 2024, through 2025; for 2025, that year alone). The three-year rule drops
   one-year jumps.
4. Period: already in 1985; 1986–1995; 1996–2005; 2006–2015; 2016–2025. Median latitude and arrivals
   by region come from the same table.

## Reading the map

- In 1985, 402 municipalities already had soy over 5% of their area: 364 in the South, 28 in the
  Centre-West and 10 in the Southeast. Today they hold 12.0 of the 44.2 million hectares of soy.
- After that, soy crossed the line in 1,009 municipalities: 320 in 1986–1995, 232 in 1996–2005,
  222 in 2006–2015 and 235 in 2016–2025. The year with most arrivals was 1986 (127), then 2014 and
  2015 (101 across both years).
- Mapped soy grew from 4.5 million hectares in 1985 to 44.2 million in 2025.
- In the last decade the North had 29 arrivals and the Northeast 14; the northernmost was Boa Vista
  (Roraima), in 2022 (9.3% of its area in 2025), and the one with most soy was Paragominas (Pará), in
  2018, with 146 thousand ha. But most recent arrivals were in the Centre-South: São Paulo 47, Santa
  Catarina 33, Goiás 32, Mato Grosso 22.
- 1,384 municipalities have soy above 5% in 2025; 27 crossed the line at some point and are now below.

## Limitations

- The threshold is relative to municipal area. The huge municipalities of the Cerrado and the Amazon
  need a lot of soy to pass 5%, the small ones in the South very little; 2.8 million hectares of soy
  lie in municipalities that never crossed it.
- Soy in the early years of the series is mapped less accurately: some of it may sit in «other
  temporary crops», and the 1986 peak owes much to the start of the series, not only to real growth.
- This is satellite-mapped area, not IBGE harvested area; the two do not match year by year.
- «Arriving» means passing 5% of the area, not the first planting.

## Data licence

MapBiomas (CC BY 4.0) and IBGE data, free to use with attribution.
