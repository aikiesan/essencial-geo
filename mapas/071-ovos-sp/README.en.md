---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Eggs"
subtitulo: "One in five of São Paulo’s eggs comes from Bastos"

contexto: >-
  São Paulo produced 1.27 billion dozen hen eggs in 2024, 52% more than in 2008 and 23.6% of Brazil’s total. Bastos alone, in the Marília region, produced 270 million dozen, one in five of the state’s eggs. With Tupã and its neighbours, the Marília region accounts for 42% of production, and the ten largest municipalities for 54%. Even so, 540 municipalities report some production, and eggs appear across almost the whole map; only Greater São Paulo and the coast lack data. Laying-hen manure is also a residue: by the CP2B method it could yield 296,000 m³ of biomethane a day across the state, 62,600 of them in Bastos. Quail eggs went the other way, falling from 82.8 to 37.3 million dozen. First plate of the collection “Milk, eggs, honey and fish”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state with municipalities coloured by hen egg production in 2024, in six classes from cream to brown (up to 6,000 dozen, up to 14,000, 39,000, 100,000, 1.3 million and from 1.3 million to 270 million). Almost the whole state is coloured; the darkest tones form patches in the centre-west, around Bastos, Tupã and Queiroz, in the centre and in the south-east, near Porto Feliz. Greater São Paulo and part of the coast are hatched, with no data, and grey municipalities, with zero production, are scattered across the west. Callout: Bastos, 270 million dozen, 21% of the state’s hen eggs. The panel shows columns of state production from 2008 to 2024, from 838 to 1,274 million dozen, and the five largest producers."

recorte: "São Paulo state (SP)"
metodo: "Hen egg production from PPM 2024 by municipality in six quantile classes; state series from 2008 to 2024; biomethane potential of laying-hen manure at the accessible level of the CP2B method."
---

# Hen eggs in São Paulo, 2024

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 071, the first of five in the collection **Milk, eggs, honey and fish**: the most
valuable animal product in the state, concentrated in a handful of municipalities in the
centre-west.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `CD_MUN`, `NM_MUN`, intermediate region, `producao_2008` and `producao_2024` (thousand dozen hen eggs), `situacao_2024` (`valor`, `zero`, `nao_disponivel` or `fora_da_tabela`) and `biometano_m3_dia` |
| `regioes_intermediarias` | polygon | 11 intermediate geographic regions |
| `limite_estadual` | polygon | outline of the state |

The **GPKG** is zipped and attached to the
[`animal-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/animal-sp-2026).
The `municipios` layer opens in QGIS with the plate’s classes (style `producao`).

The **CSV** holds the municipal table, in UTF-8, without geometry. An empty cell means no data;
0 means zero.

## Method

1. Table 74 of the Municipal Livestock Survey on SIDRA: *Animal products*, product *Hen eggs*
   (thousand dozen), years 2008 to 2024, municipal level, São Paulo state. Brazil’s total, for
   the state’s share, adds up every municipality in the country in the same table.
2. 2024 production in six quantile classes of the municipalities with positive production, with
   limits rounded to two significant figures.
3. Data status: `zero` where IBGE publishes a dash; `nao_disponivel` where it publishes “X” or
   “...”; `fora_da_tabela` where the municipality is missing.
4. Biomethane: potential of the *laying-hen manure* substrate in the CP2B method v5.1 (Unicamp,
   version of 24/09/2026), reference scenario, level N4 (accessible), in m³ of biomethane
   equivalent per day.
5. Quail eggs (same table) appear only in the text: 82,836 thousand dozen in 2008 and 37,288 in
   2024.

## Limitations

- PPM is an IBGE municipal estimate based on local informants, not a count of farms; a
  municipality’s volume may reflect where a company is registered.
- 32 municipalities have no data in 2024, almost all in Greater São Paulo and on the coast.
- The CP2B potential is modelled, not measured: it is the biomethane the manure would give if
  digested, after deducting competing uses and collection losses.

## Data licence

Open data from IBGE, free to use with attribution. The CP2B (Unicamp) potential is published here
with the centre’s permission; cite “CP2B (Unicamp), method v5.1, 2026”.
