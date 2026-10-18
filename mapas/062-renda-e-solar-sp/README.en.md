---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Income and rooftop solar"
subtitulo: "Rooftop sun does not follow the money"

contexto: >-
  São Paulo has 664,000 residential solar systems registered with ANEEL, with 4.4 GW: 4.1 for every 100 occupied homes. One would expect them in the richest towns. They are not there. Across the 645 municipalities, the rank correlation between household heads’ mean income and systems per home is −0.01, that is, none. In the highest income third there are 3.8 systems per 100 homes; in the lowest, 4.2. The map lights up in ochre and brown in the west and north-west, where Dracena reaches 26 per 100, and so does Santo Expedito, with a mean income of 1.8 minimum wages. The capital, with a mean income of 4 minimum wages and more systems than any other city (22,000), has only 0.5 per 100 homes, like Santos: where people live in flats, there is no roof. Plate 044 shows distributed solar generation across Brazil. Last plate of the collection “Income and rooftop solar”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo municipalities in nine colours, crossing thirds of household heads’ mean income (cream to violet) and thirds of residential solar systems per home (cream to ochre); where both are high, purplish brown. The west and north-west are ochre and brown; the east, Greater São Paulo and the coast, violet; the south and the Ribeira Valley, cream. Callouts point to Dracena, with 26 systems per 100 homes, and the capital, with 0.5. In the panel, the three-by-three grid with the number of municipalities in each cell, spread out rather than on the diagonal, bars with systems per 100 homes in each income third and the municipalities with the highest uptake."

recorte: "São Paulo State (SP)"
metodo: "ANEEL residential distributed photovoltaic systems per 100 occupied permanent private homes of the 2022 Census, and mean income of household heads with income, each in thirds of the 645 municipalities, crossed in a nine-class bivariate map; Spearman rank correlation."
---

# Income and residential solar generation in São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 062, the last of three in the collection **Income and rooftop solar**: the income of
[plates 060](../060-renda-mediana-sp/README.en.md) and [061](../061-renda-na-metropole-sp/README.en.md)
crossed with solar systems on house roofs. Distributed solar generation per inhabitant across the
country is on [plate 044](../044-geracao-solar-distribuida-brasil/README.en.md).

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `pessoas` (people), `dppo` (occupied permanent private homes), `responsaveis` (household heads), `renda_media` (R$) and `renda_media_sm` (minimum wages), `solar_sistemas` and `solar_kw` (residential), `sistemas_100_dom` (per 100 homes), `w_por_dom` (W per home), `terco_renda`, `terco_solar` and `grupo` (solar third and income third, 11 to 33) |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The `municipios` layer has three **QGIS styles**: `renda_e_solar` (the plate’s),
`solar_por_100_domicilios` and `renda_media_sm`. The **CSV** has the same table, without geometry.

## Method

1. ANEEL: distributed generation units with a photovoltaic source and residential consumer class in
   SP, in the October 2026 list, counted and summed (kW) by the unit’s municipality. Aggregable
   fields only: no names, tax IDs or postcodes.
2. 2022 Census: occupied permanent private homes and mean income of household heads with income,
   the mean of tracts with data weighted by household heads.
3. Thirds: each measure is cut into three groups of about 215 municipalities (income up to 1.91
   minimum wages, 1.91 to 2.24 and above; systems up to 5.35 per 100 homes, 5.35 to 10.93 and above).
4. Spearman correlation between the ranks of the two measures in the 645 municipalities.

## Limitations

- A system is not a home: some houses have more than one record, and 130,061 systems (20%) are
  remote self-consumption, which may sit in one municipality and offset a bill in another.
- The residential class does not tell houses from blocks of flats; a condominium system counts as one.
- Income is from the 2022 Census and systems from 2026; the comparison is between places, not
  families: it does not say who, within each town, put panels on the roof.
- Housing type is a reading of the map, not a measure on this plate.
