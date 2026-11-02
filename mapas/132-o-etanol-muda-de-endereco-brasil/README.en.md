---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Ethanol moves house"
subtitulo: "Capacity climbs into the Centre-West, and the centre of gravity follows"
contexto: >-
  In August 2026, the 370 distilleries authorised by the ANP could make 283 thousand m³ of ethanol a day, 19% more than in December 2018. The growth did not go where the cane already was: Mato Grosso rose from 9.6 thousand to 31.3 thousand m³/day, Goiás and Mato Grosso do Sul gained more than 7 thousand each, and São Paulo, with 39% of the country’s capacity, stayed almost where it was. Twenty-eight municipalities with no distillery in 2018 now have one, nine of them in Mato Grosso; Sinop, which had none, now has the largest municipal capacity in Brazil. Weighted by capacity, ethanol’s centre of gravity moved 95 km to the north-west, from Prata to Ituiutaba, in the Triângulo Mineiro. First plate in the collection «The new geography of ethanol».
imagem_alt: "Map of Brazil in Albers conic projection with one circle per municipality with an ethanol distillery, its area proportional to authorised capacity in 08/2026, and a ring for 12/2018. Colours separate the municipalities that gained a distillery (dark blue), grew (blue), did not change (grey), shrank (ochre) and lost all capacity (brown). The grey circles crowd inland São Paulo; the dark blue ones, of those that gained a distillery, spread across Mato Grosso, and the blue ones, of those that grew, across Goiás, Mato Grosso do Sul and Minas Gerais. A black line in the Triângulo Mineiro marks the capacity’s centre of gravity, December to December, and an inset in the corner shows its 95 km track from Prata to Ituiutaba. Two callouts: Sinop, with 6,606 m³/day and no distillery in 2018, and São Paulo, from 111.4 to 110.6 thousand m³/day. The panel holds the table of the five categories and bars of the gain and loss by state."
metodo: "Authorised capacity of each distillery (the larger of anhydrous and hydrous) in the ANP panel, summed by IBGE municipality in 12/2018 and 08/2026; centre of gravity as the capacity-weighted mean of the municipal positions, in the Albers projection, each December and in 08/2026."
---

# Ethanol moves house: distillery capacity by municipality, 2018 and 2026

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 132, the first in the **The new geography of ethanol** collection. Where Brazil’s capacity
to make ethanol sits, where it has grown since 2018 and where that pushes the centre of the map.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | point | 339 municipalities: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `usinas_2018`, `cap_2018`, `usinas_2026`, `cap_2026` (m³/day), `anidro_2026`, `hidratado_2026`, `variacao_m3d`, `categoria` (`nova`, `cresceu`, `igual`, `encolheu`, `zerou`), `lon`, `lat` |
| `centro_gravidade` | point | 9 positions: `mes`, `capacidade_m3d`, `usinas`, `passo_km` (from the previous position), `desde_2018_km`, `municipio` |
| `trajeto` | line | the path from 12/2018 to 08/2026: `km_em_linha_reta`, `km_percorridos`, `rumo_graus` |
| `ufs` | polygon | 27 states, with their region |
| `limite_nacional` | polygon | national boundary |

The **GPKG** is zipped and attached to the
[`etanol-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/etanol-br-2026).
The layers carry the plate’s **QGIS style**: circles proportional to 2026 capacity, coloured by
category, and the track of the centre of gravity. The **CSV** sits in this folder, in UTF-8, with
the municipalities table without geometry.

## Method

1. The ANP Ethanol Producers Dynamic Panel (`pb-da-etanol.zip`, downloaded on 18/10/2026), files
   `Etanol_Capacidade 2018_2020.csv` and `Etanol_Capacidade 2021_2026.csv`: one row per distillery
   (CNPJ) and month, with authorised capacity for anhydrous and hydrous ethanol, in m³/day.
2. Each distillery’s capacity is the larger of the two, not their sum: the same distillation
   columns make one or the other (the same rule as plate 089).
3. The municipality registered with the ANP was matched to IBGE’s 2025 Municipal Mesh by name and
   state, without accents or punctuation; one name was fixed by hand (Muquém do São Francisco, BA).
   Every row matched.
4. The comparison runs from 12/2018 to 08/2026. The panel starts in 01/2018, but it takes in
   distilleries throughout that year (273 in January, 371 in December); starting earlier would
   confuse registration with expansion.
5. Categories, by the capacity summed in the municipality: gained a distillery (none in 12/2018),
   grew, unchanged, shrank and lost all capacity (none in 08/2026). One distillery registered in
   Bauru (SP) with zero capacity in 08/2026 is left out of the categories.
6. Each municipality is drawn at an interior point of its polygon, not at the town seat or the plant.
7. Centre of gravity: the capacity-weighted mean of the municipal positions, computed in the plate’s
   Albers equal-area conic projection (SIRGAS 2000, standard parallels 2° S and 22° S, central
   meridian 54° W), in each December from 2018 to 2025 and in 08/2026. The municipality named is the
   one containing the point. Between the ends, 94.8 km in a straight line, bearing 322° (north-west);
   adding up the steps, 105.9 km.

## Reading

- Of the 44.4 thousand m³/day gained, 24.2 thousand came from the 28 municipalities that gained a
  distillery and 35.1 thousand from the 81 that grew; the 31 that lost all capacity took away 11.5
  thousand, and the 14 that shrank, 3.4 thousand. Another 185 did not change.
- Mato Grosso alone added 21.6 thousand m³/day (×3.2). Sinop, Nova Mutum and Primavera do Leste had
  no distillery in 12/2018; Sorriso went from 110 to 3,899 m³/day.
- São Paulo stood still in total (111.4 → 110.6 thousand m³/day), but moved inside: 26 municipalities
  grew, 8 shrank and 13 lost their last distillery.

## Limitations

- Authorised capacity is not output: the ANP authorises what a distillery can make per day, not
  what it makes, and many stop in the off-season.
- The ANP records each distillery in its registered municipality; the position on the map is the
  municipality’s, and municipalities with several distilleries add them all at one point.
- The centre of gravity sums the map up in one point: it shows where capacity leans, not a place
  where it sits. With 39% of capacity in São Paulo, the point moves slowly even when the Centre-West
  grows fast.
- A distillery that changes CNPJ shows up as an exit and an entry; in the municipality, the capacity
  stays.
- The map does not say what each distillery distils: plate 133 deals with maize.

## Data licence

ANP and IBGE open data, free to use with attribution.
