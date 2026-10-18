---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Age and sex"
subtitulo: "The north-west grows old, the metropolis is young and prisons are men"

contexto: >-
  The median age in São Paulo is 36: half the people are younger, half older. But the state is ageing unevenly. In the north-west, in small towns such as Turmalina (51), Floreal and Santana da Ponte Pensa (47), there are already more people aged 65 or over than children up to 14: 90 municipalities are like this. In Greater São Paulo the index falls to 32 in Itapevi, three children per older person. In 446 of the 645 municipalities there are more women than men; Santos has 83 men per 100 women. The sex ratio map has dark blue patches: Balbinos has 444 men per 100 women, and 65% of its residents live in collective dwellings. Of the 29 towns with over 10% of their people in such dwellings, prisons among them, 27 exceed 110 men per 100 women. Second plate of the collection “People across the land”.

imagem: ./mapa_preview.en.png
imagem_alt: "Three maps of São Paulo’s municipalities and an age pyramid. Median age, in greens, is highest in the north-west, with a callout to Turmalina, 51. The ageing index, in blues, darkens in the north-west and pales in Greater São Paulo, with a callout to Itapevi, 32. The sex ratio, from plum (more women) to dark blue (more men), is a mosaic, with a callout to Balbinos, 444 men per 100 women. The state’s pyramid has a narrow base and its bulk between 35 and 44. In the panel, the oldest and youngest municipalities and those with most men per woman, with the share of residents in collective dwellings."

recorte: "São Paulo State (SP)"
metodo: "Median age, ageing index (people aged 65 or over per 100 aged up to 14) and sex ratio (men per 100 women) of the resident population by municipality, from SIDRA 9515, in six classes each; the state’s pyramid from SIDRA 9514; residents outside occupied permanent private households = population (9514) minus residents of those households (9922)."
---

# Median age, ageing and sex ratio in São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 064, the second of four in the collection **People across the land**. The share of people
aged 60 or over, tract by tract, is on [plate 065](../065-idosos-sp/README.en.md).

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `pessoas` (people), `homens` (men), `mulheres` (women), `idade_mediana`, `indice_envelhecimento`, `razao_sexo`, `ate14`, `de60`, `pct_60_mais`, `dppo`, `dppo_urbana`, `dppo_rural` (occupied permanent private households), `moradores`, `moradores_urbana`, `moradores_rural` (their residents), `pct_rural` (from plate 066), `fora_dppo` and `pct_fora_dppo` (residents outside those households) |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The `municipios` layer has four **QGIS styles**: `idade_mediana`, `indice_envelhecimento`,
`razao_sexo` and `moradores_rurais`. The **CSV** has the same table, without geometry.

## Method

1. SIDRA 9515: each municipality’s median age, ageing index and sex ratio, as IBGE publishes them.
   The index is the number of people aged 65 or over for every 100 aged up to 14.
2. Classes: median age up to 32, 33 to 35, 36 to 38, 39 to 41, 42 to 44 and 45 or over; index up to
   50, 50 to 75, 75 to 100, 100 to 125, 125 to 150 and above; sex ratio up to 94, 94 to 97, 97 to 100,
   100 to 103, 103 to 110 and over 110, on a diverging scale centred on 100.
3. Pyramid: SIDRA 9514, the state’s population by sex in five-year groups, with 90 or over together.
4. Residents outside occupied permanent private households: resident population (9514) minus the
   residents of those households (9922). They are mostly people in collective dwellings (prisons,
   care homes, barracks, lodgings) and in makeshift homes.

## Limitations

- The Census counts prisoners in the municipality of the prison. Where the prison population is
  large relative to the town, it dominates the sex ratio and lowers the share of older people.
- These tables do not split collective dwellings by type; linking the sex ratio to prisons is a
  reading of the map, backed by the share of residents outside private households.
- In very small municipalities, a few people shift the median age by a year.
