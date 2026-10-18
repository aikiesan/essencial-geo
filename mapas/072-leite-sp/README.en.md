---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Milk"
subtitulo: "Almost everywhere, at the lowest volume on record"

contexto: >-
  São Paulo produced 1.51 billion litres of cow’s milk in 2024, the lowest volume since 2008. The peak came in 2015, at 1.77 billion; since then production has fallen by 15%, while Brazil’s rose to 35.7 billion litres. The state’s share went from 5.8% in 2008 to 4.2%. Milk is the most widespread animal product in the state: 603 of the 645 municipalities report some, and the ten largest add up to only 18%. Tapiratiba, in the north-east, leads with 41.5 million litres, 2.8% of the total, followed by Araras, Descalvado and Cunha. The darkest tones appear in the west, the north-east and the Paraíba valley, where Cunha and São Luiz do Paraitinga are among the six largest. The Campinas and São José dos Campos regions produce a third of the state’s milk. Second plate of the collection “Milk, eggs, honey and fish”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state with municipalities coloured by cow’s milk production in 2024, in six classes from pale bluish grey to navy (up to 180,000 litres, up to 500,000, 1.1 million, 2 million, 3.9 million and from 3.9 million to 41.5 million). Almost the whole state is coloured. Dark blue covers much of the west and north-west, the north-eastern border with Minas Gerais and the Paraíba valley to the eastern tip; the centre, Greater São Paulo and the south of the state are lighter, and the capital and part of the coast are hatched, with no data. Callout: Tapiratiba, 41.5 million litres, the largest producer, with 2.8% of the state’s milk. The panel shows columns of state production from 2008 to 2024, with the peak of 1,768 million litres in 2015 and 1,505 in 2024, and the five largest producers."

recorte: "São Paulo state (SP)"
metodo: "Cow’s milk production from PPM 2024 by municipality in six quantile classes; state series from 2008 to 2024; biomethane potential of dairy-cattle manure (in the files only) at the accessible level of the CP2B method."
---

# Milk in São Paulo, 2024

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 072, the second of five in the collection **Milk, eggs, honey and fish**: the animal
product found in almost every municipality, and shrinking since 2015.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `CD_MUN`, `NM_MUN`, intermediate region, `producao_2008` and `producao_2024` (thousand litres of cow’s milk), `situacao_2024` (`valor`, `zero`, `nao_disponivel` or `fora_da_tabela`) and `biometano_m3_dia` |
| `regioes_intermediarias` | polygon | 11 intermediate geographic regions |
| `limite_estadual` | polygon | outline of the state |

The **GPKG** is zipped and attached to the
[`animal-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/animal-sp-2026).
The `municipios` layer opens in QGIS with the plate’s classes (style `producao`).

The **CSV** holds the municipal table, in UTF-8, without geometry. An empty cell means no data;
0 means zero.

## Method

1. Table 74 of the Municipal Livestock Survey on SIDRA: *Animal products*, product *Milk*
   (thousand litres), years 2008 to 2024, municipal level, São Paulo state. Brazil’s total, for
   the state’s share, adds up every municipality in the country in the same table.
2. 2024 production in six quantile classes of the municipalities with positive production, with
   limits rounded to two significant figures.
3. Data status: `zero` where IBGE publishes a dash; `nao_disponivel` where it publishes “X” or
   “...”; `fora_da_tabela` where the municipality is missing.
4. Biomethane (files only): potential of the *dairy-cattle manure* substrate in the CP2B method
   v5.1 (Unicamp, version of 24/09/2026), reference scenario, level N4 (accessible), in m³ of
   biomethane equivalent per day. Across the state it adds up to 66,965 m³/day.

## Limitations

- PPM is an IBGE municipal estimate based on local informants, not a count of farms or of milk
  delivered to dairies.
- 32 municipalities have no data in 2024, almost all in Greater São Paulo and on the coast.
- The CP2B biomethane is not calculated from the milk volume on this plate, and the order of
  municipalities in the two columns differs.

## Data licence

Open data from IBGE, free to use with attribution. The CP2B (Unicamp) potential is published here
with the centre’s permission; cite “CP2B (Unicamp), method v5.1, 2026”.
