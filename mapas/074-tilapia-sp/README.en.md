---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Tilapia"
subtitulo: "Almost every farmed fish in the state is tilapia"

contexto: >-
  São Paulo farmed 67,000 tonnes of tilapia in 2024, 2.8 times the volume of 2013, the first year of the Municipal Livestock Survey’s aquaculture series. Tilapia is 95% of all fish farmed in the state. Brazil grew even faster, from 169,000 to 499,000 tonnes, and the state’s share stood at 13.4%. Farming is concentrated: 134 municipalities report production, and the ten largest account for 72%. The largest sit on the reservoirs of the Grande and Paraná rivers. Rifaina, on the border with Minas Gerais, leads with 10,000 tonnes, followed by Rubinéia, Santa Clara d'Oeste, Panorama and Riolândia. The São José do Rio Preto region, in the north-west, produces 42% of the total on its own. On the map, MapBiomas water shows the rivers and reservoirs, and hatching marks the 476 municipalities with no reported production. Fourth plate of the collection “Milk, eggs, honey and fish”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state with municipalities coloured by tilapia production in 2024, in six classes from very pale blue to dark teal (up to 3.1 tonnes, up to 10, 22, 73, 360 and from 360 to 10,000 tonnes), over a hatched background: most of the state does not appear in the IBGE table. MapBiomas rivers and reservoirs, in blue, trace the Tietê, the Paranapanema and the border reservoirs. The darkest tones lie along the north-western edge, by the Paraná and Grande rivers, from Panorama to Rubinéia, Santa Clara d'Oeste and Riolândia, and at the northern tip, in Rifaina; there are mid-tone patches in the east and south. Callout: Rifaina, 10,000 tonnes, the state’s largest tilapia producer in 2024. The panel shows columns of state production from 2013 to 2024, from 24,000 to 67,000 tonnes, and the five largest producers."

recorte: "São Paulo state (SP)"
metodo: "Tilapia production from PPM 2024 by municipality in six quantile classes; state series from 2013 to 2024; rivers, lakes and reservoirs from the MapBiomas 2024 water classes over the map."
---

# Tilapia in São Paulo, 2024

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 074, the fourth of five in the collection **Milk, eggs, honey and fish**: the reservoir
fish, farmed in few municipalities and almost always by the water.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `CD_MUN`, `NM_MUN`, intermediate region, `producao_2013` and `producao_2024` (kg of tilapia) and `situacao_2024` (`valor`, `zero`, `nao_disponivel` or `fora_da_tabela`) |
| `regioes_intermediarias` | polygon | 11 intermediate geographic regions |
| `limite_estadual` | polygon | outline of the state |

The **GPKG** is zipped and attached to the
[`animal-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/animal-sp-2026).
The `municipios` layer opens in QGIS with the plate’s classes (style `producao`). The MapBiomas
water is not in the GPKG; the 2024 raster clipped to the state comes with plate 045.

The **CSV** holds the municipal table, in UTF-8, without geometry. An empty cell means no data;
0 means zero.

## Method

1. Table 3940 of the Municipal Livestock Survey on SIDRA: *Aquaculture production*, product
   *Tilapia* (kilograms), years 2013 to 2024, municipal level, São Paulo state. Brazil’s total,
   for the state’s share, adds up every municipality in the country in the same table.
2. Fish farmed in the state = sum of the table’s fish species in 2024 (70,548,417 kg), without
   shrimp or oysters.
3. 2024 production in six quantile classes of the municipalities with positive production, with
   limits rounded to two significant figures.
4. Data status: `zero` where IBGE publishes a dash (35 municipalities); `nao_disponivel` where it
   publishes “X” or “...” (91); `fora_da_tabela` where the municipality is missing (385). The
   plate shows the last two together.
5. Water: classes *river, lake and ocean* (33) and *aquaculture* (31) of MapBiomas Collection 10,
   2024, over the map, from the same 120 m clip as plate 045.

## Limitations

- Table 3940 only lists municipalities where IBGE recorded aquaculture; those missing are not
  necessarily zero.
- PPM is a municipal estimate based on local informants; round figures, such as Rifaina’s
  10,000,000 kg, point to estimates, not weighing.
- Production is attributed to the municipality, not the reservoir: cages off one bank may be
  recorded in the neighbouring municipality.

## Data licence

Open data from IBGE, free to use with attribution. MapBiomas: CC BY 4.0, “MapBiomas Project —
Collection 10 of the Annual Series of Land Use and Land Cover Maps of Brazil”.
