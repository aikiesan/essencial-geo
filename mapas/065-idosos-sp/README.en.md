---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Those aged 60 and over"
subtitulo: "One in six people in São Paulo, and one in three in the small towns of the north-west"

contexto: >-
  In 2022, 7.65 million people in São Paulo were aged 60 or over: 17.2% of the population, one in six. Over a million were past 80. Tract by tract, the map shows where they live. The dark blue of tracts where over 30% are 60 or older, home to 3.4 million people, spreads across the north-west and west: in the Presidente Prudente region, 20.1% are 60 or over; in the São Paulo region, 16.6%. In small towns such as Turmalina, Nova Canaã Paulista and Santana da Ponte Pensa, almost one in three; in Águas de São Pedro, 34%, the highest share in the state. Cajamar, in Greater São Paulo, is the youngest of the towns of over 50,000 people, with 10.6%. Plate 064 shows median age and the ageing index by municipality. Third plate of the collection “People across the land”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state with census tracts in six shades of blue, from near-white to petrol, by the share of residents aged 60 or over. The north-west and west are a dark mosaic; Greater São Paulo and the area around Campinas are paler, with dark dots. Confidential tracts are hatched. Callouts point to Águas de São Pedro, with 34%, and Cajamar, with 10.6%. In the panel, the share of population in each class and bars with the share aged 60 or over by intermediate region, from 20.1% in Presidente Prudente to 16.6% in São Paulo."

recorte: "São Paulo State (SP)"
metodo: "People aged 60 to 69 and 70 or over as a share of each 2022 Census tract’s population, in six classes; confidential counts are worth 1 or 2, and a tract gets a class only when it is the same in both cases; state, municipal and regional totals from SIDRA 9514, without confidentiality."
---

# People aged 60 or over by census tract in São Paulo

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 065, the third of four in the collection **People across the land**. Median age and the
ageing index by municipality are on [plate 064](../064-idade-e-sexo-sp/README.en.md).

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `setores` | polygon | 103,319 tracts: `pessoas` (people), people by age group (`idade_0_a_4` … `idade_60_a_69`, `idade_70_ou_mais`) and `classe_60_mais` (1 to 6); also the density of plate 063 |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

It is the same **GPKG** as [plate 063](../063-densidade-sp/README.en.md), in the assets of the
[`gente-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/gente-sp-2026),
with the **QGIS style** `60_anos_ou_mais`.

## Method

1. 2022 Census tract aggregates, demography group: resident people (V01006) and people aged 60 to 69
   (V01040) and 70 or over (V01041).
2. Share aged 60 or over in six classes, closed on the right: up to 10%, 10 to 15%, 15 to 20%,
   20 to 25%, 25 to 30% and over 30%.
3. Confidentiality: IBGE replaces small counts with “X”. In the SP data no 1 or 2 appears in these
   variables, so an X is worth 1 or 2. The class is computed with X = 1 and with X = 2; if it is the
   same, the tract gets it; if not, it is left as no data. An X never becomes zero.
4. State, municipal and intermediate-region totals come from SIDRA 9514, which has no
   confidentiality.
5. On the plate, tracts become a grid of about 200 m so the whole state can be drawn.

## Limitations

- 2,731 tracts, with 173,568 people, are hatched as no data: small tracts where confidentiality
  leaves the class open.
- In tracts with few people, one family changes the class; the strongest tones of the rural
  interior add up many small tracts.
- Long-term care homes for older people count as collective dwellings and are part of the population
  of the tract where they stand.
