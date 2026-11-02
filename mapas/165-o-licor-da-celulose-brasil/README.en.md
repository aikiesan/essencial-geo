---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The pulp mills’ liquor"
subtitulo: "23 pulp mills hold two-thirds of Brazil’s non-cane biomass power"
contexto: >-
  Leave sugarcane bagasse aside and the fuel that makes most biomass electricity in Brazil is black liquor, the residue left when pulp mills cook wood. Twenty-three plants run on it, with 3.72 GW in operation: 66% of all biomass capacity that is not cane. Suzano owns 41% of it, across six mills. Três Lagoas (MS), with three mills and 659 MW, is the municipality with the most biomass power in the country, cane included. The wood travels a short way: of the 130 million m³ of roundwood cut for pulp and paper in 2025, 93% came from municipalities within 200 km of one of these mills. Mato Grosso do Sul cuts the most, 30 million m³, runs 1.04 GW on black liquor and has another 420 MW being built in Inocência. First plate in the collection «What else the plant burns».
imagem_alt: "Map of Brazil in Albers conic projection with municipalities shaded in five greens by the roundwood cut for pulp and paper in 2025, concentrated in Mato Grosso do Sul, eastern São Paulo, Paraná, southern Bahia, Espírito Santo and Rio Grande do Sul, and purple circles proportional to the capacity of the 23 black-liquor plants, nearly all inside or beside the green patches; a hollow ring marks the mill under construction in Inocência (MS). One callout points to Três Lagoas (MS), with three mills and 659 MW, another to Ortigueira (PR), with Klabin’s 465 MW. In the panel, bars of black-liquor capacity and pulpwood by state, and a bar split among the owners of that capacity, led by Suzano."
metodo: "SIGA plants whose fuel is «Licor Negro» (24, 23 operating), by licensed capacity and registry coordinates; roundwood for pulp and paper cut in each municipality in 2025 (PEVS, table 291); distance from each municipality’s interior point to the nearest operating black-liquor plant, in Albers projection."
---

# The pulp mills’ liquor: black-liquor power plants and the wood that feeds them

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 165, the first in the collection **What else the plant burns**. Plate 127 showed that
sugarcane bagasse dominates biomass electricity; this one looks at the runner-up, which comes not from
the field but from the pulp mill.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `fabricas` | point | 24 black-liquor plants: `nome`, `ceg`, `uf`, `municipio`, `fase`, `potencia_kw` (licensed), `ano_inicio`, `proprietario`, `regime` (APE, PIE, REG), `posicao` |
| `municipios` | polygon | 5,571 municipalities: `celulose_2015_m3`, `celulose_2025_m3` (roundwood for pulp and paper), `situacao_pevs`, `classe`, `km_fabrica` |
| `ufs` | polygon | 27 states: `licor_kw_op`, `celulose_2025_m3` |
| `limite_nacional` | polygon | national outline |

The **GPKG** is zipped and attached to the
[`combustivel-biomassa-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/combustivel-biomassa-br-2026),
with **QGIS styles** stored inside (circles sized by capacity, municipalities in m³ classes). The
**CSV** sits in this folder, in UTF-8, with the plant table and no geometry.

## Method

1. ANEEL’s register of generation projects (SIGA, open data generated on 01/10/2026, downloaded on
   01/11/2026): plants with `DscOrigemCombustivel` = «Biomassa» and `NomFonteCombustivel` =
   «Licor Negro». Capacity is licensed capacity; position is the registry coordinate.
2. Roundwood for pulp and paper (PEVS 2025, SIDRA table 291, product 1.3.1), in m³, by municipality.
   Municipalities missing from the table have no recorded forestry and count as zero; the 861 marked
   «...» (not available) are left as no data.
3. Distance from each municipality to the nearest operating black-liquor plant: from the polygon’s
   interior point to the plant, in Albers projection. «Within 200 km» sums the wood of municipalities
   up to 200 km away.
4. Shares of «non-cane biomass» use every operating biomass plant in SIGA except the bagasse ones:
   225 plants, 5.61 GW (the other 202 are on plate 166).

## Reading

- 23 operating black-liquor plants add up to 3.72 GW: 66% of non-cane biomass capacity and 20% of
  all biomass capacity in Brazil (18.4 GW). One more, Arauco’s Sucuriú in Inocência (MS), has 420 MW
  under construction.
- The owners: Suzano, 1,536 MW in six mills (41%); Klabin, 650 MW in five; Bracell, 446 MW in two;
  CMPC, 265 MW; Eldorado, 214 MW; eight others, 609 MW.
- Três Lagoas (MS) has three mills and 659 MW on black liquor (715 MW counting the town’s other
  biomass plants, such as the wood-chip Onça Pintada), more than any municipality in the country,
  cane towns included. Next come Ortigueira (PR), 465 MW, and Lençóis Paulista (SP), 446 MW.
- Mato Grosso do Sul has 1.04 GW on black liquor and cut 29.9 million m³ of pulpwood in 2025, more
  than any other state; São Paulo, 23.7 million; Paraná, 19.1; Bahia, 17.4.
- Brazil cut 130.3 million m³ in 2025, 70% more than the 76.8 million of 2015. 93% came from
  municipalities within 200 km of a black-liquor plant. The largest: Três Lagoas, Brasilândia and
  Ribas do Rio Pardo, all in MS.
- 54% of black-liquor capacity (2.0 GW) came online from 2015 onwards.

## Limitations

- Licensed capacity is not generation: a pulp mill uses most of the electricity it makes, and only
  part reaches the grid. This plate does not measure output.
- SIGA gives one start-of-operation date per plant; later expansions keep the original date.
- The PEVS records where wood was cut, not which mill it went to. Proximity is a hint, not a
  measured flow.
- Some SIGA plants lack coordinates; in those cases the point goes to the centre of the
  municipality.

## Data licence

ANEEL and IBGE open data, free to use with attribution.
