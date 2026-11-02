---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "When each fuel arrived"
subtitulo: "Since 2015, non-cane biomass has added more capacity than bagasse"
contexto: >-
  Sugarcane bagasse drove Brazil’s biomass electricity until 2014: between 2010 and 2014 alone, 4.46 GW of bagasse plants came online. Then cane nearly stalled, and the other fuels pulled ahead. From 2015 onwards, 3.09 GW of non-cane biomass plants started operating, against 1.86 GW of bagasse; since 2020, 1.87 GW against 1.25 GW. Today 55% of non-cane capacity came online in 2015 or later. Pulp mills’ black liquor leads, with Suzano’s Ribas do Rio Pardo (MS), 384 MW in 2025, but firewood is the youngest fuel of all: half its plants started in 2021 or later, several at corn-ethanol plants. The oldest still running dates from 1955, Klabin’s Otacílio Costa (SC). Third and last plate in the collection «What else the plant burns».
imagem_alt: "Map of Brazil in Albers conic projection with circles proportional to the capacity of the 225 operating biomass plants that do not burn cane bagasse, coloured by period of entry: beige before 2000, light blue 2000 to 2009, blue 2010 to 2014, orange 2015 to 2019 and dark red 2020 to 2026. Reds and oranges dominate Mato Grosso, Mato Grosso do Sul and Roraima; beige and blue stay in the South-East and South. One callout points to Suzano’s plant in Ribas do Rio Pardo (MS), 384 MW in 2025, another to Klabin’s Otacílio Costa (SC), from 1955. In the panel, bars of the megawatts added in each five-year block, bagasse against the other fuels, and a timeline with each plant at its start year, one row per fuel."
metodo: "Operating biomass plants in SIGA, by licensed capacity and the registry’s start-of-operation date (1900-01-03 is treated as no date); the 225 that do not burn cane bagasse are mapped by period, and the 432 bagasse plants enter only the panel comparison, summed in five-year blocks."
---

# When each fuel arrived: the age of the biomass plants that do not burn cane

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 167, the third and last in the collection **What else the plant burns**. After where each
fuel is (plates 165 and 166), when it reached the grid.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `usinas` | point | 225 operating non-cane plants: `nome`, `ceg`, `uf`, `municipio`, `combustivel`, `grupo`, `potencia_kw` (licensed), `ano_inicio`, `periodo`, `proprietario`, `regime`, `posicao` |
| `usinas_cana` | point | 432 operating cane-bagasse plants, with the same fields |
| `ufs` | polygon | 27 states |
| `limite_nacional` | polygon | national outline |

The **GPKG** is zipped and attached to the
[`combustivel-biomassa-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/combustivel-biomassa-br-2026),
with **QGIS styles** stored inside (circles by period, sized by capacity). The **CSV** sits in this
folder, in UTF-8, with all 657 plants (the field `grupo` = `cana` marks the bagasse ones).

## Method

1. ANEEL’s register of generation projects (SIGA, open data generated on 01/10/2026, downloaded on
   01/11/2026): operating biomass plants, with `DatEntradaOperacao`. SIGA uses 1900-01-03 when it has
   no date; those plants are left «no date» (9 non-cane, with 17 MW).
2. Period of entry: before 2000, 2000–2009, 2010–2014, 2015–2019 and 2020–2026.
3. Panel: licensed capacity added in each five-year block from 1970 to 2026 (the last block holds only
   2025 and 2026), for bagasse and for all other fuels together; and each non-cane plant as a dot at
   its start year, one row per fuel group (plate 166’s groups, plus black liquor).

## Reading

- Operating non-cane biomass plants: 225, with 5.61 GW. Before 2000: 905 MW; 2000 to 2009: 949 MW;
  2010 to 2014: 648 MW; 2015 to 2019: 1,218 MW; 2020 to 2026: 1,872 MW.
- Bagasse peaked earlier: 4.46 GW came online between 2010 and 2014, against 0.65 GW of the other
  fuels. From 2015 the picture flips: 3.09 GW non-cane against 1.86 GW of bagasse; since 2020,
  1.87 GW against 1.25 GW.
- Black liquor has the oldest plants, Klabin’s Otacílio Costa (SC), 1955, and Klabin’s Telêmaco Borba
  (PR), 1961, and also the largest recent one, Suzano’s Ribas do Rio Pardo (MS), 384 MW in 2025.
- Firewood is the youngest fuel: the median start year of its 17 plants is 2021. The first year of
  each fuel in the register: black liquor 1955, forest residue 1970, firewood 1987, rice husk 1995,
  charcoal and landfill biogas 2002, farm biogas 2008, elephant grass 2010, palm and waste 2011.

## Limitations

- SIGA gives one date per plant, its start of operation; later expansions and fuel switches are
  hidden behind the original date. Plants that closed do not appear: the register shows who is
  there, not who has been.
- Licensed capacity is not generation.
- SIGA’s «no date» removes 9 non-cane plants (17 MW) and 20 bagasse plants (287 MW) from the
  period counts.

## Data licence

ANEEL and IBGE open data, free to use with attribution.
