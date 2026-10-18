---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Maize and soybean"
subtitulo: "Soybean overtook maize, and the straw stayed on the ground"

contexto: >-
  In 2008, São Paulo harvested 525,940 hectares of soybean and 965,907 of maize. In 2024, 1.36 million hectares of soybean, 2.6 times more, and 723,128 of maize, 25% less; soybean overtook maize in 2017. It spread from 304 to 483 municipalities and grew above all in the south of the state. In the Sorocaba region the area went from 82,000 to 468,000 hectares, and Itapeva is the largest grower of both grains. In Ibirarema and Salto Grande, harvested soybean covers almost two thirds of the municipality. The straw of both grains could give 1.03 million m³ of biomethane a day under the CP2B method, 41% of it in the Sorocaba region. That is what remains after leaving on the field the share that protects the soil. Fourth plate of the collection “From field to biomethane”.

imagem: ./mapa_preview.en.png
imagem_alt: "Three maps of São Paulo state and a chart. The first shows harvested soybean area in 2024 as a share of territory, in six classes from cream to brown; dark brown covers the south-west, the south and the north-east of the state. The second shows maize, from pale yellow to olive green, darker in the south-west and south. The third shows, in teal, the biomethane that maize and soybean straw could give per day, with Itapeva and Buri named in the south-west. In the fourth panel, two lines from 2008 to 2024: soybean rises from about 500,000 to 1.36 million hectares and crosses maize, which hovers around 800,000, in 2017, marked with a circle."

recorte: "São Paulo state (SP)"
metodo: "Harvested soybean and maize area from PAM 2024 divided by municipal area, in six quantile classes; straw biomethane potential at the accessible level of the CP2B method, in six quantile classes."
---

# Maize and soybean in São Paulo, 2024, and the biomethane in the straw

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 048, the fourth of six in the collection **From field to biomethane**: the two grains
that share the south of the state, and the straw left on the field after harvest.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `CD_MUN`, `NM_MUN`, intermediate region, `area_km2`; for `soja` (soybean) and `milho` (maize), harvested area (`_area_2008_ha`, `_area_2024_ha`) and production (`_producao_2008_t`, `_producao_2024_t`); `soja_pct` and `milho_pct` (harvested area in 2024 ÷ municipal area, in %); `palha_milho_m3_dia`, `palha_soja_m3_dia` and `palhas_m3_dia` |
| `regioes_intermediarias` | polygon | 11 intermediate geographic regions |
| `limite_estadual` | polygon | outline of the state |

The **GPKG** is zipped and attached to the
[`agro-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/agro-sp-2026).
The `municipios` layer carries the plate’s three **QGIS styles**: `soja` (the default), `milho`
and `palhas`.

The **CSV** holds the same table, in UTF-8, without geometry. An empty cell means no data; 0 means
zero.

## Method

1. Table 1612 of the Municipal Agricultural Production survey on SIDRA: *Harvested area* and
   *Quantity produced*, products *Soybean (grain)* and *Maize (grain)*, years 2008 to 2024,
   municipal level, São Paulo state. Maize adds up both crops of the year.
2. Share of territory = harvested area in 2024 ÷ (municipal area × 100), in %, in six quantile
   classes of the municipalities with positive area.
3. Straw: potential of the *maize straw* and *soybean straw* substrates in the CP2B method v5.1
   (Unicamp, version of 24/09/2026), reference scenario, level N4 (accessible), in m³ of
   biomethane equivalent per day, in six quantile classes.
4. The chart in the fourth panel adds up the state’s harvested area year by year; the circle marks
   the first year soybean exceeded maize.

## Limitations

- The CP2B potential is modelled: it starts from the straw the harvest leaves, deducts the share
  that must stay on the soil and what is lost in collection, and accounts for the distance to
  where the gas would be produced. In 108 municipalities the straw gives zero at the accessible
  level.
- The 2024 soybean harvest was 3.63 million tonnes, 27% below 2023; the map shows harvested area,
  which varies less than production from one year to the next.
- 45 municipalities have no data in the 2024 PAM, most of them in Greater São Paulo and on the
  coast.
- Soybean and maize areas can overlap: the same field can give soybean in summer and maize as a
  second crop.

## Data licence

Open data from IBGE, free to use with attribution. The CP2B (Unicamp) potential is published here
with the centre’s permission; cite “CP2B (Unicamp), method v5.1, 2026”.
