---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "More cattle than people"
subtitulo: "The herd grazes where few people live"
contexto: >-
  Brazil has 238 million head of cattle for 203 million people. In 3,197 of its 5,571 municipalities there are more cattle than people: they cover 68% of the country and hold 89% of the herd, with 21% of the population. Cattle graze where few people live: Rondônia has 11.5 head per inhabitant, Mato Grosso 9.0 and Tocantins 7.7; São Paulo has 0.3, and the Federal District 0.03. São Félix do Xingu, in Pará, has the country’s largest herd, 2.52 million head, 39 per resident, and Rondolândia (MT) reaches 96. In ten years the North’s herd grew by 41%, while the South’s shrank by 10%. First plate of the «Biomass monitor» collection: cattle are also manure, a feedstock for biogas.
imagem_alt: "Choropleth map of Brazil in Albers conic projection, with the 5,571 municipalities shaded by cattle per inhabitant in seven classes: three blue-grey tones where people outnumber cattle and four earth tones, from cream to dark brown, where cattle outnumber people. Amazonas, Amapá, the coast and the metropolitan regions are blue; a dark-brown arc runs through Rondônia, Mato Grosso, southern Pará, Tocantins and Mato Grosso do Sul. Two callouts: São Félix do Xingu, in Pará, with 2.52 million head, the largest herd in the country, and Rondolândia, in Mato Grosso, with 96 cattle per inhabitant. The panel holds the class legend with the number of municipalities in each and bars for each region’s herd in 2014 and 2024, with the North up 41% and the South down 10%."
metodo: "Cattle numbers for 2024 from the Municipal Livestock Survey divided by the 2022 Census population of each municipality and grouped into seven classes, with parity (one head per inhabitant) in the middle of the scale."
---

# More cattle than people: cattle per inhabitant in Brazil

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 126, the first in the **Biomass monitor** collection: what Brazil produces as biomass,
municipality by municipality, with open data renewed every year. It starts with cattle, which are
also manure.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 5,571 municipalities: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `pop_2022`, `bovinos_2014`, `bovinos_2024`, `situacao_ppm` (value, zero, not available, not in table), `bois_hab` (cattle per inhabitant), `mais_boi` (more cattle than people), `classe`, `faixa_bois_hab` |
| `ufs` | polygon | 27 states, with their region |
| `limite_nacional` | polygon | national boundary |

The **GPKG** is zipped and attached to the
[`biomassa-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/biomassa-br-2026).
The `municipios` layer carries the plate’s **QGIS style**, with the seven classes. The **CSV** sits
in this folder, in UTF-8, with the same table without geometry.

## Method

1. Cattle numbers by municipality from IBGE’s Municipal Livestock Survey (PPM), 2014 and 2024
   (SIDRA, table 3939), keeping IBGE’s symbols: «-» is zero; «...» is not available and is shown
   in grey, never as zero.
2. **Cattle per inhabitant**: the 2024 herd divided by the 2022 Census population. Seven classes,
   with breaks at 0.1, 0.5, 1, 2, 5 and 20. Parity, at 1, separates the cool tones (more people
   than cattle) from the earth tones (more cattle than people).
3. The panel and fact-sheet figures add up only municipalities with PPM data. The 32 without data
   (almost all in Greater São Paulo and the Santos lowlands, plus Boa Esperança do Norte, created
   after the Census) have 8.3 million residents and are left out of the ratios, but counted in the
   203 million.
4. The panel bars compare each region’s herd in 2014 and 2024.

## Limitations

- The PPM is a municipal estimate made by IBGE with local informants (unions, animal-health
  agencies, companies), not a head count.
- The herd is recorded in the municipality of the farm; an animal may spend its life in more than
  one place.
- Population is from 2022, the herd from 2024.
- Cattle per inhabitant does not measure herd size: a high ratio can come from few people. For
  volume, use the `bovinos_2024` column.

## Data licence

IBGE open data, free to use with attribution.
