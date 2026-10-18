---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Urban and rural"
subtitulo: "Three in every hundred people in São Paulo live in the countryside"

contexto: >-
  Of the 44.1 million residents of private households in São Paulo, 1.30 million live in rural areas: 2.9%, three in every hundred. The state’s countryside is concentrated in the south and east: in the Sorocaba intermediate region, 11% of residents are rural; in Presidente Prudente, 8%; in São Paulo, 0.7%. The map darkens in the Ribeira Valley and the upper Paranapanema, the Mantiqueira and the Serra do Mar, where towns are small and homes scattered. Pedra Bela, on the border with Minas Gerais, has 73% of its residents in the countryside, and 14 municipalities have a rural majority. In numbers, the largest countryside is Mogi das Cruzes’s, with 27,000 rural residents, ahead of Ibiúna and Piedade; the capital has 16,000. Five municipalities in Greater São Paulo, and Águas de São Pedro, have none. Last plate of the collection “People across the land”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo’s municipalities in six shades, from cream to dark brown, by the share of residents in rural households. The south, the Ribeira Valley, the Serra do Mar and the Mantiqueira are dark brown; the centre-north and Greater São Paulo are pale. Callouts point to Pedra Bela, with 73% of residents in the countryside, and Mogi das Cruzes, with 27,000 rural residents. In the panel, the share of the state’s rural residents in each class, with the number of municipalities, bars by intermediate region, from 11% in Sorocaba to 0.7% in São Paulo, and the municipalities with most rural residents."

recorte: "São Paulo State (SP)"
metodo: "Residents of occupied permanent private households in rural areas over all residents of those households, by municipality, from SIDRA 9922, in six classes; municipalities with no rural residents shown apart."
---

# Urban and rural population in São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 066, the last of four in the collection **People across the land**. Density, tract by
tract, is on [plate 063](../063-densidade-sp/README.en.md).

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `dppo`, `dppo_urbana`, `dppo_rural` (occupied permanent private households), `moradores`, `moradores_urbana`, `moradores_rural` (their residents), `pct_rural`, plus the age and sex of plate 064 |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

It is the same **GPKG** as [plate 064](../064-idade-e-sexo-sp/README.en.md), with the **QGIS style**
`moradores_rurais`. The **CSV** has the same table, without geometry.

## Method

1. SIDRA 9922: occupied permanent private households and their residents, by urban or rural status,
   in each municipality.
2. Rural share = rural residents over the total, in six classes closed on the right: up to 2%, 2 to
   5%, 5 to 10%, 10 to 20%, 20 to 40% and over 40%. The six municipalities with no rural residents
   are grey.
3. Intermediate regions: sum of rural residents over the sum of residents.

## Limitations

- Urban and rural follow perimeters set by municipal law: a house in open country inside the urban
  perimeter counts as urban, and a gated estate outside it as rural.
- The table counts only residents of permanent private households; collective and makeshift
  dwellings are left out (about 294,000 people in the state).
- The municipal map paints the whole area in one colour; within each, countryside and town are in
  different places, as plate 063 shows.
