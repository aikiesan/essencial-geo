---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Two harvests, one country"
subtitulo: "One harvest in winter, the other in summer"
contexto: >-
  Biomass electricity follows the harvest. Of the 51 biomass units that ONS measures one by one, 37 burn sugarcane bagasse, all of them in the Centre-South, and 25 of these peak between June and August: 88% of their output comes from April to November, the region’s harvest. In the Northeast cane is cut from September to March, but no mill there has a usable ONS series; what shows are the small thermal plants summed by state, fuel not reported, which generate 74% of their year in those months. In Alagoas, where 91% of thermal capacity up to 30 MW runs on bagasse, 93% of output falls from September to March and none from June to August. Four of the six pulp units, which burn black liquor, have no marked season.
imagem: ./mapa_preview.en.png
imagem_alt: "Map of Brazil in Albers conic projection with 51 circles, one per biomass plant or plant group measured by ONS, sized by average MW generated and coloured by peak month on a twelve-colour wheel: blues in January and February, greens in March and April, yellows and oranges from May to August, reds and purples from September to November and indigo in December; grey for units with no marked season. States carry, in a lighter shade, the peak month of the ONS small thermal plants. The orange and yellow circles cluster in São Paulo, Goiás, Mato Grosso do Sul and the Triângulo Mineiro, and São Paulo, Paraná and the Centre-West are light orange, peaking in July; Pernambuco, Paraíba, Alagoas and Sergipe are purplish blue, peaking in December. The large pulp mills are grey. Three callouts: the 37 cane units, peaking in July with 88% of output from April to November; Alagoas, with 93% from September to March and 0% from June to August; and Suzano, in Maranhão, with no season. The panel holds three roses with each month’s share (Centre-South cane, Centre-South and Northeast small thermal plants) and the monthly strip of each state’s small thermal plants."
metodo: "ONS hourly generation from 2015 to 2024, summed by month for the biomass plants linked to SIGA through their CEG; each unit’s profile is the mean of its valid years, and the peak month gives the circle its colour, grey when the peak is no more than 1.3 times the yearly mean."
---

# Two harvests, one country: the peak month of biomass power plants in Brazil

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 135, the first in **The rhythm of biomass** collection. Bagasse electricity keeps a
calendar: in the Centre-South it rises with the April-to-November harvest; in the Northeast, with
the September-to-March one.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `usinas` | point | 51 plants and plant groups: `nome` (SIGA), `nome_ons`, `conjunto`, `uf`, `municipio`, `regiao`, `combustivel` (SIGA), `grupo`, `combustivel_ons`, `modalidade` (ONS operating mode), `ceg_siga`, `posicao`, `anos_validos`, `anos`, `mw_medio`, `pico` (month, 1 to 12), `forca` (peak-month output ÷ mean of the months), `seca` (% of the year from May to November), `classe`, `p01` to `p12` (% of the year in each month) |
| `ufs` | polygon | 27 states: `pqu_mw_medio`, `pqu_pico`, `pqu_forca`, `pqu_seca` and `pqu_p01` to `pqu_p12`, for the ONS small thermal plants (2022–2024); `siga_termicas_mw`, `siga_bagaco_pct`, `siga_ate30_mw` and `siga_ate30_bagaco_pct`, for the thermal capacity in operation in SIGA; `classe` |
| `limite_nacional` | polygon | national boundary |

The **GPKG** is zipped and attached to the
[`ritmo-biomassa-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/ritmo-biomassa-br-2026).
The `usinas` and `ufs` layers carry the plate’s **QGIS style**. The **CSV** sits in this folder, in
UTF-8, with the plant table without geometry.

## Method

1. ONS hourly generation by plant (open data), from 2015 to 2024, summed by plant and month. Left
   out are 2025, when almost every type II-B biomass plant shows zero generation for whole months
   and the plant groups drop from 15 to 2 in October (an artefact of how ONS published the data, not
   the harvest), and October 2021, a month missing entirely from the files.
2. Included are plants with fuel «Biomassa» and a CEG, and «Resíduos Industriais» plants whose CEG
   belongs to a biomass plant in SIGA (the six pulp mills). Left out are the steelworks (CSP, CST, Do
   Atlântico and Sol) and the aggregates of small plants at the Londrina and Maringá substations and
   at CELESC.
3. Join with ANEEL’s SIGA (01/10/2026) on the CEG core: 62 of the 69 ONS «Biomassa» CEGs are among
   SIGA’s biomass plants and account for 97.8% of the energy. The other 7 are left out (in ONS:
   Cidade Nova, Mauá Blocks 1 and 5A, PIE-RP, Predilecta, Rondon II, Sykué I and São Fernando Açúcar
   e Álcool).
4. ONS plant groups have no CEG: each is placed at the centre of the municipality of the SIGA plant
   with the same name, and takes its fuel (column `posicao`). Three with no match in SIGA are left
   out: Biopav, Dourados and Votuporanga 2.
5. A year counts for a unit if it has records in every month, generation in at least six of them and
   some variation: 31 plant-years with almost constant generation (gap between the highest and lowest
   month below 3% of the mean) were discarded.
6. Each unit’s profile is the month-by-month mean of average MW over its valid years. The map shows
   units with at least two valid years and 1 average MW. The colour is the peak month; when that
   month is no more than 1.3 times the mean of the months, the unit is grey, with no marked season.
7. The states carry the ONS «PQU … TERM – CARGA GLOBAL» series, which sum each state’s small thermal
   plants without reporting the fuel, from 2022 to 2024 (the series starts in 2021). To read these
   series, the table brings from SIGA how much of the state’s operating thermal capacity runs on
   bagasse, in total and for plants up to 30 MW only.
8. The panel roses add up the profiles: the 37 cane units, all of them in the Centre-South, and the
   small thermal plants of the Centre-South and Northeast states.

## Limitations

- ONS measures only some biomass plants one by one and undercounts the small plants it does not
  dispatch: the 37 plants with SIGA capacity on plate 136 hold 16% of the country’s operating
  biomass capacity. The rest are missing from the data or appear, if at all, in the state sums.
- No Northeast cane mill has a usable ONS series (the only one linked to SIGA has only zeros). The
  Northeast reading rests on the state series, fuel not reported; SIGA supports it (in Alagoas, 91%
  of thermal capacity up to 30 MW runs on bagasse) but does not prove it.
- 23 of the 51 units have only two or three valid years (column `anos_validos`).
- Energy a plant uses in its own mill may not show in the ONS data.

## Data licence

ONS, ANEEL and IBGE open data, free to use with attribution.
