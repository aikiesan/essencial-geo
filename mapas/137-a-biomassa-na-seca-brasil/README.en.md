---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Dry-season biomass"
subtitulo: "Bagasse generates as the reservoirs fall"
contexto: >-
  Biomass generates when water runs short. From 2015 to 2024, 77% of SIN biomass generation came from May to November, the months when stored energy in the reservoirs falls from 57% to 35% of maximum; in July biomass reaches 2.3% of the system’s generation, against 0.5% in January. Of the 37 Centre-South cane units measured by ONS, 25 generate 75% or more of their year in those seven months, and the median is 83%. A year with no season would give 58%, and that is close to where the pulp mills sit, between 57% and 61%. In the Northeast the account turns over: the small thermal plants of Alagoas, a state where 91% of thermal capacity up to 30 MW runs on bagasse, generate only 35% of their year from May to November, because the harvest there runs from September to March.
imagem: ./mapa_preview.en.png
imagem_alt: "Map of Brazil in Albers conic projection with 51 circles, one per biomass plant or plant group measured by ONS, sized by average MW and coloured by the share of the year’s generation that comes from May to November, on a scale from terracotta (under 45%) to dark blue (85% or more), with beige in the middle, near the 58% of a year with no season. States carry, in a lighter shade, the same share for the ONS small thermal plants. The dark blue circles cluster in São Paulo, Goiás and Mato Grosso do Sul, and São Paulo, Paraná, Goiás, Tocantins and Piauí are blue; Alagoas and Sergipe are terracotta, and Pernambuco, Rio Grande do Norte and Pará pinkish. Three callouts: Centre-South cane, with a median of 83%; Alagoas, with 35%; and the pulp mills, between 57% and 61%. The panel holds the mean SIN year from 2015 to 2024, with the line of stored energy in the reservoirs over bars of biomass’s share in each month, and the strip of dots for each unit by fuel."
metodo: "Share of the year’s generation that comes from May to November at each biomass plant ONS measures one by one, averaged over the valid years from 2015 to 2024, beside the mean SIN year: biomass share of generation and stored energy in the reservoirs."
---

# Dry-season biomass: biomass power generation from May to November in Brazil

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 137, the third and last in **The rhythm of biomass** collection. The Centre-South cane
harvest falls in the months when the SIN reservoirs draw down, and bagasse generates just as water
runs short.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `usinas` | point | 51 plants and plant groups: `nome` (SIGA), `nome_ons`, `conjunto`, `uf`, `municipio`, `regiao`, `combustivel` (SIGA), `grupo`, `combustivel_ons`, `modalidade` (ONS operating mode), `ceg_siga`, `posicao`, `anos_validos`, `anos`, `mw_medio`, `seca` (% of the year from May to November), `classe`, `pico` (month, 1 to 12), `p01` to `p12` (% of the year in each month) |
| `ufs` | polygon | 27 states: `pqu_mw_medio`, `pqu_seca` and `pqu_pico`, for the ONS small thermal plants (2022–2024); `siga_bagaco_pct` and `siga_ate30_bagaco_pct`, for the thermal capacity in operation in SIGA; `classe` |
| `limite_nacional` | polygon | national boundary |

The **GPKG** is zipped and attached to the
[`ritmo-biomassa-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/ritmo-biomassa-br-2026).
The `usinas` and `ufs` layers carry the plate’s **QGIS style**. The **CSV** sits in this folder, in
UTF-8, with the plant table without geometry.

## Method

1. Units, valid years and the SIGA join are those of plate 135: ONS hourly generation from 2015 to
   2024 (without 2025 and October 2021), «Biomassa» plants and pulp mills linked to the SIGA of
   01/10/2026 on the CEG core, plant groups at the centre of the municipality of the plant with the
   same name, and at least two valid years and 1 average MW per unit.
2. Each unit’s dry share is the sum of May to November in its mean profile. With no season, seven
   months out of twelve would give 58%. The classes run from under 45% to 85% or more, with the 55 to
   62% band around the no-season year.
3. The states carry the same share for the ONS «PQU … TERM – CARGA GLOBAL» series, small thermal
   plants summed by state, fuel not reported, from 2022 to 2024.
4. The SIN year in the panel uses all ONS generation summed by fuel and month. Each year’s
   generation from the «Biomassa» fuel was divided by that year’s mean, and the mean of the ten years
   gives the profile from which the May-to-November share (77%) comes. Biomass’s share in each month
   is «Biomassa» generation over total SIN generation, averaged over the years.
5. Stored energy (EAR) adds up, day by day, the verified energy of the four subsystems and divides it
   by the sum of their maximum capacities; the mean of each month, over the 3,653 days from 2015 to
   2024, gives the line.

## Limitations

- ONS measures only some biomass plants one by one and undercounts the small plants it does not
  dispatch; plants ONS does not measure are missing from the map and from the SIN series.
- The SIN «Biomassa» series leaves out the pulp mills, which ONS classes as «Resíduos Industriais»,
  and the small thermal plants summed by state; it includes the near-constant years dropped from the
  map.
- The Northeast appears only in the state series, fuel not reported; no cane mill there has a usable
  ONS series.
- Biomass and water move on the same calendar, but the plate does not measure how much one replaces
  the other: it only shows that Centre-South bagasse generates more in the months of falling
  reservoirs.
- 23 of the 51 units have only two or three valid years (column `anos_validos`).

## Data licence

ONS, ANEEL and IBGE open data, free to use with attribution.
