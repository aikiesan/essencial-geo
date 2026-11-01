---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "What a plant really yields"
subtitulo: "Capacity on paper, energy on the grid"
contexto: >-
  Installed capacity is not energy generated. The 37 biomass plants that ONS measures one by one add up to 2.8 GW of inspected capacity in SIGA, but delivered an average of 0.96 GW over their valid years from 2015 to 2024: a capacity factor of 36%. The 25 cane mills sit at 30%, because the boilers stop between harvests; the four pulp mills, which burn black liquor all year, reach 43%, and Suzano, in Maranhão, 72%, the highest factor among plants of 100 MW or more. At CMPC, in Guaíba (RS), ONS records only 3% of capacity: the widest gap between paper and grid. These 37 plants hold 16% of the country’s operating biomass capacity, and none of SIGA’s 55 biogas plants appears one by one in ONS.
imagem: ./mapa_preview.en.png
imagem_alt: "Map of Brazil in Albers conic projection with 37 biomass plants measured by ONS, each drawn as a ring and a disc: the ring’s area is the inspected capacity in SIGA, the disc’s is mean generation, and the disc colour, from light grey to dark blue, gives the capacity factor, from under 20% to 65% or more. Wide rings with small discs cluster in São Paulo, Goiás and Mato Grosso do Sul, the cane mills; the dark blue discs that almost fill their rings are the Klabin pulp mill, in Paraná, and Suzano’s, in Maranhão. Four callouts: Klabin, with 330 MW of capacity and 205 average MW generated; CMPC, in Guaíba, with 265 MW and 8 MW, a 3% factor; Suzano, with 72%; and the 25 cane mills, with 30%. The panel holds the dots of each plant’s factor by fuel, bars of each state’s biomass capacity in SIGA against the capacity ONS measures and the generation, and the colour key."
metodo: "Capacity factor of each biomass plant that ONS measures one by one: energy generated in the valid years from 2015 to 2024 divided by the inspected capacity in SIGA times the hours of those years."
---

# What a plant really yields: the capacity factor of biomass power plants in Brazil

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 136, the second in **The rhythm of biomass** collection. After the calendar, the account:
how much of the registered capacity becomes energy on the grid over the year.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `usinas` | point | 37 plants: `nome` (SIGA), `nome_ons`, `uf`, `municipio`, `regiao`, `combustivel` (SIGA), `grupo`, `combustivel_ons`, `modalidade` (ONS operating mode), `ceg_siga`, `posicao`, `anos_validos`, `anos`, `mw_instalado` (inspected capacity in SIGA), `mw_gerado` (average MW over the valid years), `fator` (%), `classe`, `mw_mes_pico` (average MW of the profile’s highest month), `pico_acima_da_potencia`, `fase_siga` |
| `ufs` | polygon | 27 states: `siga_biomassa_mw` (biomass capacity in operation in SIGA), `ons_usinas`, `ons_mw_instalado`, `ons_mw_gerado` |
| `limite_nacional` | polygon | national boundary |

The **GPKG** is zipped and attached to the
[`ritmo-biomassa-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/ritmo-biomassa-br-2026).
The `usinas` layer carries the plate’s **QGIS style**. The **CSV** sits in this folder, in UTF-8,
with the plant table without geometry.

## Method

1. Plants, valid years and the SIGA join are those of plate 135: ONS hourly generation from 2015 to
   2024 (without 2025 and October 2021), «Biomassa» plants and pulp mills linked to the SIGA of
   01/10/2026 on the CEG core, years with records in every month, generation in at least six and
   some variation, and at least two valid years and 1 average MW per plant.
2. Left out are the 14 ONS plant groups, which sum several plants with no single capacity (693
   average MW generated), and plants with no inspected capacity in SIGA.
3. Capacity factor = energy generated in the valid years (MWh) ÷ (inspected SIGA capacity in MW ×
   hours of those years). A group’s factor adds up the energy and the capacity × hours of all its
   plants, so larger plants weigh more.
4. On the map, the ring’s area is capacity and the disc’s is mean generation, on the same scale; the
   disc colour is the factor class (under 20%, 20 to 35%, 35 to 50%, 50 to 65% and 65% or more).
5. The state bars compare the biomass capacity in operation in SIGA (18.1 GW in 657 plants) with the
   capacity of the plants ONS measures and their mean generation.

## Limitations

- ONS measures only some biomass plants one by one; small plants, which it does not dispatch, are
  left out. The 37 plants on the plate hold 16% of the country’s operating biomass capacity, and
  none of the 55 biogas plants in operation in SIGA has its own ONS series.
- Capacity is SIGA’s 2026 inspected figure, set against generation from 2015 to 2024; a plant
  expanded during the period shows a lower factor than it had.
- Energy a plant uses in its own mill may not show in the ONS data. This may be the case of CMPC, in
  Guaíba (RS), with a 3% factor, and Barra Bioenergia (SP), also at 3%.
- At two plants the profile’s highest month exceeds the SIGA capacity (Cocal II, in Narandiba, SP,
  with an 88% factor, and Vale do Verdão, in Turvelândia, GO, with 64%): the registered capacity may
  not be the same unit ONS measures. They are flagged in `pico_acima_da_potencia`.
- 17 of the 37 plants have only two or three valid years (column `anos_validos`).

## Data licence

ONS, ANEEL and IBGE open data, free to use with attribution.
