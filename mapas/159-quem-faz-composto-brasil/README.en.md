---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Who makes compost"
subtitulo: "Only one town in seven treats its organic waste, but a third of Brazilians live in them"
contexto: >-
  In 2023, 759 of the 5,556 municipalities that answered IBGE's MUNIC survey said they treat organic waste, by composting or another process: one in seven. Because big cities are likelier to do it, these towns are home to 35% of the population, 70 million people. Among the 41 cities of over 500,000 people the share reaches 59%; in towns of 5,000 to 50,000 it hovers around 12%, below even the smallest places. The South treats organics in 23% of its municipalities, the Northeast in 9%, and Maranhão, Tocantins and Roraima hardly at all. Salvador, Curitiba and Goiânia, with 5.6 million residents, declared no treatment whatsoever. Only 480 municipalities have a composting unit on their land. First plate in the collection «The town hall and the leftovers».
imagem_alt: "Choropleth map of Brazil in Albers conic projection with municipalities shaded in four classes of organic-waste treatment in 2023: dark green where the town hall treats organics and there is a composting unit, light green where it treats them without a unit in town, ochre where there is only the unit, and cream where there is no treatment. Cream dominates the North and Northeast; green patches cluster in the South, São Paulo and Minas Gerais. One callout points to Salvador, Curitiba and Goiânia, with 5.6 million residents and no treatment declared, and another to the South, where 23% of towns treat organics against 9% in the Northeast. In the panel, the classes with their number of municipalities and share of the population, bars of the share treating organics by town size, from 12% in mid-sized towns to 59% in cities over 500,000, and bars by region comparing towns and people."
metodo: "Municipal answers to the 2023 MUNIC survey: an organic-waste treatment service in the municipality (SMRS32) crossed with a composting unit found on its land (SMRS46), in four classes; 2022 Census population as published by IBGE in 2023."
---

# Who makes compost: organic-waste treatment in Brazil's municipalities, 2023

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 159, the first in the collection **The town hall and the leftovers**: what
Brazil's 5,570 municipalities say they do with their rubbish, according to IBGE's 2023 MUNIC survey.
It starts with the part that could become fertiliser, the organic fraction, which is close to half
of household waste.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 5,571 municipalities: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `pop_2022`, `Faixa_pop`, `situacao_munic`, `trata_organicos`, `unidade_compostagem`, `coleta_seletiva`, `vazadouro`, `aterro_sanitario` (MUNIC answers as published, in Portuguese), `classe`, `faixa_classe`, `lon`, `lat` |
| `ufs` | polygon | 27 states, with their region |
| `limite_nacional` | polygon | national outline |

The **GPKG** is zipped and attached to the
[`residuo-organico-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/residuo-organico-br-2026).
The `municipios` layer carries the plate's **QGIS style**, with the four classes. The **CSV** sits in
this folder, in UTF-8, with the same table and no geometry.

## Method

1. Database of the 2023 MUNIC Sanitation Supplement («Resíduos Sólidos» sheet), read with the
   workbook's own dictionary. Two questions: whether the municipality runs an **organic-waste
   treatment** service (SMRS32, composting and the like) and whether there is an **organic-waste
   composting unit** on its land (SMRS46).
2. Four classes: treats and has a unit (344 municipalities); treats with no unit in town (415, which
   may send organics to a neighbouring unit or use another process); a unit only, with no municipal
   service (136, usually private yards or another town's); neither (4,661).
3. Grey marks the 14 municipalities with no valid answer (8 without any waste service, 5 refusals and
   1 not informed) and Boa Esperança do Norte (MT), created after the survey.
4. Population: the 2022 Census figure, published by IBGE in 2023 and carried in the MUNIC itself.
   Population shares count only the 5,556 municipalities that answered (203.1 million people).

## Reading

- 759 municipalities treat organic waste, 13.7% of those that answered, and they are home to 70.3
  million people, 34.8% of the population.
- The share only climbs with size above 50,000 people: 14.0% up to 5,000, about 12% from 5,000 to
  50,000, 17.5% from 50,000 to 100,000, 25.2% from 100,000 to 500,000 and 58.5% (24 of 41) above
  500,000.
- By region: South 22.6% of municipalities, Southeast 14.9%, Centre-West 10.3%, North 9.2% and
  Northeast 8.6%. Paraná (23.5%), Rio Grande do Sul (22.8%) and Santa Catarina (21.0%) lead among
  states with many towns; Maranhão (4 of 217), Tocantins (2 of 139) and Roraima (0 of 15) trail.
- The largest cities with no declared treatment are Salvador (2.42 million), Curitiba (1.77
  million), Goiânia (1.44 million) and Belém (1.30 million).
- 146 of the 759 municipalities that treat organics also report an open dump on their land; 85.5% of
  them run separate collection.

## Limitations

- The MUNIC records what the town hall declares. It does not say how much organic waste is treated:
  a town with a school garden making compost and one with a composting plant fall in the same class.
- The composting unit is the one «found in the municipality», public or private, and need not take
  the town hall's waste.
- The survey does not ask about separate collection of organics, nor about anaerobic digestion on
  its own; organic treatment is a single answer.
- It is a 2023 snapshot: units opened or closed since then do not appear.

## Data licence

IBGE open data, free to use with attribution.
