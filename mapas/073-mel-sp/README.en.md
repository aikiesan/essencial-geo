---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Honey"
subtitulo: "More than tripled in sixteen years"

contexto: >-
  São Paulo produced 6,800 tonnes of honey in 2024, 3.3 times what it produced in 2008. Production grew in almost every year and jumped by 23% from 2023 to 2024 alone. In Brazil the growth was smaller, from 37,800 to 67,300 tonnes, and the state’s share almost doubled, from 5.4% to 10.1%. Honey is concentrated in the centre-south of the state, around Botucatu: the Bauru intermediate region produces 43% of the total. Itatinga, with 750 tonnes, and Botucatu, with 725, add up to 22% of the state’s honey; Cabrália Paulista, Agudos and Capão Bonito follow, and the ten largest produce 49%. The number of producing municipalities is the same in both years, 408: the growth came from those already producing. The west, by contrast, barely shows. Third plate of the collection “Milk, eggs, honey and fish”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state with municipalities coloured by honey production in 2024, in six classes from cream to dark brown (up to 440 kilograms, up to 1.3 tonnes, 3.5, 6.7, 16 and from 16 to 750 tonnes). Dark brown fills the centre and south of the state, from Agudos and Botucatu to Capão Bonito and the border with Paraná, with patches in the north-east and the Paraíba valley; the west is pale or grey, with small or zero production, and Greater São Paulo is hatched, with no data. Callout: Itatinga, 750 tonnes, the state’s largest honey producer in 2024. The panel shows columns of state production from 2008 to 2024, from 2,061 to 6,772 tonnes, and the five largest producers."

recorte: "São Paulo state (SP)"
metodo: "Honey production from PPM 2024 by municipality in six quantile classes; state series from 2008 to 2024."
---

# Honey in São Paulo, 2024

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 073, the third of five in the collection **Milk, eggs, honey and fish**: the animal
product that has grown most in the state since 2008.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `CD_MUN`, `NM_MUN`, intermediate region, `producao_2008` and `producao_2024` (kg of honey) and `situacao_2024` (`valor`, `zero`, `nao_disponivel` or `fora_da_tabela`) |
| `regioes_intermediarias` | polygon | 11 intermediate geographic regions |
| `limite_estadual` | polygon | outline of the state |

The **GPKG** is zipped and attached to the
[`animal-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/animal-sp-2026).
The `municipios` layer opens in QGIS with the plate’s classes (style `producao`).

The **CSV** holds the municipal table, in UTF-8, without geometry. An empty cell means no data;
0 means zero.

## Method

1. Table 74 of the Municipal Livestock Survey on SIDRA: *Animal products*, product *Honey*
   (kilograms), years 2008 to 2024, municipal level, São Paulo state. Brazil’s total, for the
   state’s share, adds up every municipality in the country in the same table.
2. 2024 production in six quantile classes of the municipalities with positive production, with
   limits rounded to two significant figures. The plate’s legend shows the limits in kg.
3. Data status: `zero` where IBGE publishes a dash; `nao_disponivel` where it publishes “X” or
   “...”; `fora_da_tabela` where the municipality is missing.

## Limitations

- PPM is an IBGE municipal estimate based on local informants; honey is counted where the hives
  are according to those informants, and apiaries that move with the flowering may be recorded
  in a single municipality.
- Round figures, such as Itatinga’s 750,000 kg and Botucatu’s 725,000 kg, point to estimates, not
  weighing.
- 32 municipalities have no data in 2024, almost all in Greater São Paulo and on the coast.

## Data licence

Open data from IBGE, free to use with attribution.
