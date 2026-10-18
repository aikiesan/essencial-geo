---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Rubbish outside collection"
subtitulo: "Where the truck does not pass, rubbish burns"

contexto: >-
  Nearly all of São Paulo’s rubbish is collected: in 2022, only 0.99% of households, 160,000, disposed of it otherwise. But that 1% is not spread out. It is in the countryside, where the truck does not reach, and the most common destination is fire: 110,000 households burnt their rubbish on the property. Painted tract by tract, the map shows the state inside out: the towns are pale, with collection for everyone, and the rural interior darkens. In 1,734 tracts, more than half the households had no collection. Marabá Paulista, in the Pontal do Paranapanema, has the largest share of its households outside collection (46%); the capital has the largest number (12,094). Rubbish that is not collected does not reach a landfill or a digester either. Third plate of the collection “Sanitation and biomethane”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state with census tracts coloured by the share of households that burn or bury their rubbish, dump it on vacant land or dispose of it otherwise, in 2022, in five classes from cream (up to 1%) to dark brown (over 50%), and light grey where everyone has collection. The rural interior is brown, darker in the west and the Pontal do Paranapanema; the towns and Greater São Paulo are pale. Tracts whose class is withheld are hatched. A callout points to Marabá Paulista, with 46% of households without collection. In the panel, each class has a bar with its share of the state’s households, and bars show what happens to uncollected rubbish: burnt, other, vacant land and buried."

recorte: "São Paulo State (SP)"
metodo: "Share of each census tract’s occupied permanent private households that burn or bury their rubbish, dump it on vacant land, slopes or public areas, or dispose of it otherwise, in five classes and zero; tracts with withheld values get a class only when it does not depend on the omitted value."
---

# Rubbish outside collection in São Paulo’s census tracts

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 053, the third of four in the collection **Sanitation and biomethane**: the rubbish that
never reaches the truck, and therefore no landfill or digester.

## What the files contain

The GPKG is the same as [plate 051](../051-esgoto-na-rede-sp/README.en.md): the `setores` layer
holds households by rubbish destination (`lixo_coletado` collected, `lixo_cacamba` skip,
`lixo_queimado` burnt, `lixo_enterrado` buried, `lixo_terreno` dumped, `lixo_outro` other) and the
`classe_lixo` field (0 = none; 1 to 5 = up to 1%, 1 to 5%, 5 to 20%, 20 to 50%, over 50%). This
plate’s QGIS style is `lixo_fora_da_coleta`.

## Method

1. 2022 Census tract aggregates: occupied permanent private households by rubbish destination.
2. Outside collection: burnt on the property, buried on the property, dumped on vacant land, slopes
   or public areas, and other. Collected: at the door or in a cleaning-service skip.
3. Confidentiality, as on plate 051: `X` hides a 1 or a 2 and never becomes zero; a tract gets a
   class only when it does not depend on the omitted value. The rule weighs more here, because
   uncollected destinations are rare and often withheld: 5,168 tracts (427,767 households) are
   hatched.
4. Tracts with no occupied household share the light grey of tracts with full collection.
5. State and municipal totals: SIDRA table 6892.

## Limitations

- The destination is as declared to the enumerator; the Census does not say whether collection is
  regular or where the truck takes the rubbish.
- A large rural tract weighs a lot on the map and little in the numbers: brown covers much of the
  state, but households without collection are 1%.
