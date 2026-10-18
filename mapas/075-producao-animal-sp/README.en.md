---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The value of animal products"
subtitulo: "Milk is everywhere; the money is in eggs"

contexto: >-
  Milk, eggs, honey, silkworm cocoons and farmed fish were worth R$ 12.0 billion in São Paulo in 2024, according to the Municipal Livestock Survey. Eggs accounted for 61% of that value (R$ 7.3 billion), milk for 33% (R$ 3.9 billion), aquaculture for 6% and honey for less than 1%. On the map, however, the colour seen most is milk’s: it is the most valuable product in 423 municipalities, against 139 for eggs, 29 for aquaculture and 22 for honey. The egg money is concentrated in a few hubs. Bastos alone adds up to R$ 1.26 billion, 10% of the state, followed by Tupã, Mirassolândia and Itirapina; in the last two, eggs are more than 98% of the value. The ten largest municipalities account for 31% of the total. The survey does not include meat: the value of slaughtered animals is left out. Fifth and last plate of the collection “Milk, eggs, honey and fish”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state with a circle in each municipality, its area proportional to the value of milk, eggs, honey, cocoons and aquaculture in 2024, coloured by the most valuable product: orange for eggs, greyish blue for milk, teal for aquaculture and ochre for honey. Small and medium blue circles cover almost the whole state; the orange ones are few and large, the largest of all in Bastos, in the centre-west, surrounded by Tupã, Queiroz and Iacri, with other large ones in Mirassolândia, to the north, Itirapina, in the centre, and Porto Feliz and Tatuí, to the south-east. Teal circles appear on the north-western edge, by the reservoirs. Callout: Bastos, R$ 1.26 billion, 10% of the state’s value. The panel shows bars with each product’s value in the state and the number of municipalities where each is the largest."

recorte: "São Paulo state (SP)"
metodo: "Value of milk, hen and quail eggs, honey and cocoons (table 74) and aquaculture (table 3940) from PPM 2024, added up by municipality; circles with area proportional to the total, coloured by the most valuable product."
---

# The value of animal products in São Paulo, 2024

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 075, the last of five in the collection **Milk, eggs, honey and fish**: the four
previous plates added up in reais, municipality by municipality.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `valor` | point | 613 municipalities with reported value: `CD_MUN`, `NM_MUN`, intermediate region, `leite_mil_reais`, `ovos_mil_reais`, `mel_mil_reais`, `casulos_mil_reais`, `aquicultura_mil_reais`, `total_mil_reais`, `dominante` (the most valuable product) and `parte_dominante` (% of the total); one point inside each municipality |
| `municipios` | polygon | 645 municipalities, with the same fields |
| `regioes_intermediarias` | polygon | 11 intermediate geographic regions |
| `limite_estadual` | polygon | outline of the state |

The **GPKG** is zipped and attached to the
[`animal-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/animal-sp-2026).
The `valor` layer opens in QGIS with the plate’s circles (style `circulos`).

The **CSV** holds the municipal table, in UTF-8, without geometry. An empty cell means no data;
0 means zero.

## Method

1. Table 74 of the Municipal Livestock Survey on SIDRA, variable *Production value* (thousand
   reais), year 2024: *Milk*, *Hen eggs* and *Quail eggs* (added together in `ovos`), *Honey* and
   *Silkworm cocoons*.
2. Table 3940, variable *Production value* (thousand reais), year 2024: aquaculture total (fish,
   shrimp, oysters and others).
3. Total = sum of the five products; dominant product = the most valuable in the municipality.
4. Circles with area proportional to the total, at a point inside each municipality.

## Limitations

- PPM does not measure meat or animals sold: slaughtered cattle, chickens and pigs are not in the
  value, which is limited to what animals produce.
- Values in current 2024 reais, reported by municipality; they are not net income.
- 32 municipalities have no reported value, almost all in Greater São Paulo and on the coast.

## Data licence

Open data from IBGE, free to use with attribution.
