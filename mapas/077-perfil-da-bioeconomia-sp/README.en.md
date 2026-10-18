---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Which bioeconomy"
subtitulo: "Farming leads inland and in the Ribeira Valley; food factories, around the towns"

contexto: >-
  São Paulo’s bioeconomy is, above all, a food factory: food, drink and tobacco account for 496,000 of the 1.05 million formal jobs, 47%, against 45% in Brazil. Farming, fishing and forestry have 350,000, 33%, below the country’s 38%. Wood, paper and wooden furniture have 147,000; biofuels, 43,000; natural fibres and leather, 18,000. By municipality, farming leads in 376 of the 645, nearly all small, in the west and the Ribeira Valley. The food industry leads in 203, around the mid-sized towns and the metropolis. Wood and paper lead in 44, such as Suzano, with 3,866 jobs. Ethanol mills lead in 17, among them Guaíra, with 6,245 jobs in biofuels. Fibres and leather lead in 5. Second plate of the collection “The bioeconomy at work”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo’s municipalities in five colours by the bioeconomy segment with most formal jobs: olive green for farming, ochre for food, brown for wood and paper, lilac for fibres and leather and yellow for biofuels. Olive green covers most of the west and the Ribeira Valley; ochre forms patches around the inland towns and the metropolis; yellow appears in spots across the cane-growing north. Callouts point to Guaíra, with 6,245 jobs in biofuels, and Suzano, with 3,866 in wood and paper. In the panel, the legend with the number of municipalities for each segment and stacked bars comparing the make-up of the bioeconomy in Brazil, in SP and in each intermediate region."

recorte: "São Paulo State (SP)"
metodo: "Bioeconomy active jobs on 31/12/2025, within the European JRC scope, split into five segments by CNAE subclass; each municipality takes the colour of the segment with most jobs."
---

# The bioeconomy’s segments across São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 077, the second of five in the collection **The bioeconomy at work**. How much the
bioeconomy weighs in each municipality is on [plate 076](../076-bioeconomia-no-emprego-sp/README.en.md).

The JRC dashboard shows, for each European region, the make-up of the bioeconomy: how much is
farming, how much is food, how much is wood and paper, how much is energy. This plate reads São
Paulo’s municipalities and regions the same way.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `agro`, `alimentos`, `madeira`, `fibras`, `biocombustiveis`, `bio` and `dominante` |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

It is the **GPKG** of [plate 076](../076-bioeconomia-no-emprego-sp/README.en.md), with the **QGIS
style** `dominante`. The **CSV** has the municipal table, without geometry.

## Method

1. Active jobs on 31/12/2025 (RAIS 2025, establishments), in the bioeconomy CNAE subclasses set out
   on plate 076.
2. Five segments: **agro** (divisions 01 to 03); **alimentos**, food, drink and tobacco (10 to 12,
   including sugar); **madeira**, wood, paper and wooden furniture (16, 17 and 3101-2); **fibras**,
   natural fibres and leather (13.11, 13.12, 13.21, 13.22 and 15.10); **biocombustiveis**, biofuels
   (19.31 and 19.32: ethanol and biodiesel).
3. Each municipality takes the colour of the segment with most jobs. The panel bars show the whole
   make-up, as 100%, for Brazil, SP and each intermediate region.

## Limitations

- The dominant segment hides the mix: a municipality with 51% farming and 49% food takes the
  farming colour. The fractions are in the CSV.
- A sugar and ethanol mill splits across two segments: sugar (CNAE 10.71) goes to food and alcohol
  (19.31) to biofuels, according to the main activity declared.
- RAIS counts formal jobs only; informal and family farming do not appear.
