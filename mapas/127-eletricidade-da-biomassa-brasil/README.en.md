---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Electricity from biomass"
subtitulo: "The bagasse that lights the grid"
contexto: >-
  Brazil has 695 biomass thermal power plants registered with ANEEL; 657 are in operation, with 18.4 GW, 8.3% of the country’s electricity capacity. Almost 70% of that capacity burns sugarcane bagasse, in the sugar and ethanol mills that spread from inland São Paulo to Goiás and Mato Grosso do Sul; another 20% burns black liquor, the residue of pulp mills. The country’s largest biomass plant is Bracell’s, in Lençóis Paulista (SP), with 409 MW, and the five largest are all pulp mills. São Paulo alone has 7.2 GW, 39% of the total. Biogas is still small: 57 plants and 0.25 GW, the largest at the Caieiras landfill (SP).
imagem_alt: "Map of Brazil in Albers conic projection with 695 circles, one per biomass thermal power plant, sized by licensed capacity and coloured by fuel: ochre for sugarcane bagasse, purple for black liquor, dark green for wood, blue for biogas, grey for urban waste and olive for rice husk and others. The ochre circles cluster in inland São Paulo, the Triângulo Mineiro, Goiás and Mato Grosso do Sul; the larger purple ones mark the pulp mills. Plants under construction are drawn hollow. Two callouts: Bracell, in Lençóis Paulista, with 409 MW, the largest, and São Paulo, with 7.2 GW, 39% of the country’s biomass capacity. The panel holds the capacity band by fuel, the list with the number of plants and columns of the capacity that entered operation in each decade, with the leap of the 2000s and 2010s."
metodo: "ANEEL SIGA plants whose fuel origin is «Biomass», grouped into six fuels and drawn at the registered coordinates, with circles proportional to licensed capacity; plants without coordinates go to the centre of their municipality."
---

# Electricity from biomass: biomass thermal power plants in Brazil

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 127, the second in the **Biomass monitor** collection. After cattle, the electricity
that already comes from biomass: almost all of it from sugarcane bagasse and black liquor, the
leftovers of sugar and pulp.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `usinas` | point | 695 plants: `nome`, `ceg`, `uf`, `municipio`, `fase` (operating, under construction, construction not started), `combustivel` (as in the SIGA), `grupo`, `potencia_kw` (licensed), `inicio_operacao`, `proprietario`, `posicao` |
| `ufs` | polygon | 27 states, with their region |
| `limite_nacional` | polygon | national boundary |

The **GPKG** is zipped and attached to the
[`biomassa-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/biomassa-br-2026).
The `usinas` layer carries the plate’s **QGIS style**, with circles proportional to capacity. The
**CSV** sits in this folder, in UTF-8, with the same table without geometry.

## Method

1. Generation projects from ANEEL’s SIGA (open data of 01/10/2026) whose fuel origin is
   «Biomass», in every phase.
2. The SIGA fuels were gathered into six groups: sugarcane bagasse; black liquor; wood (forest
   residues, firewood, charcoal and biomass blast-furnace gas); biogas (from farm, urban and forest
   waste); burnt urban waste; and rice husk, elephant grass, ethanol and vegetable oils.
3. Each plant sits at its SIGA coordinates. The 19 without coordinates (zero or empty) were placed
   at the central point of the first municipality listed, flagged in the `posicao` column.
4. The panel and fact-sheet totals use only plants in operation. The national share compares
   them with the capacity of every operating plant in the SIGA (221.4 GW).
5. The panel columns add up capacity by each plant’s year of entry into operation.

## Limitations

- Licensed capacity is not energy generated: cane mills burn bagasse only during the harvest, and
  part of the electricity is used by the mill itself.
- The SIGA records each plant with its main fuel; some burn more than one.
- The start date is the plant’s; later expansions do not show in the columns.

## Data licence

ANEEL and IBGE open data, free to use with attribution.
