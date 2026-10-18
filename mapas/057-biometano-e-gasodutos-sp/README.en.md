---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Biomethane and gas pipelines"
subtitulo: "Countryside gas lies far from the pipe"

contexto: >-
  Biomethane is renewable natural gas: to reach its users it needs a pipeline, or a lorry. In São Paulo, transmission pipelines add up to 1,892 km, along an axis that comes from Mato Grosso do Sul on the Gasbol, passes Campinas and runs down to the capital and the Paraíba Valley; the distribution networks of Comgás, Gás Brasiliano and Naturgy cluster around it. The potential does not. Measured from the centre of each municipality to the nearest pipeline, 55% of the state’s possible biomethane lies over 50 km from a pipe; only 18% lies within 10 km, in 156 municipalities home to 32 million people. Guaíra, the state’s largest potential at 333,000 m³ a day, is 150 km from the nearest pipeline; Morro Agudo, the second, 103 km. The sugarcane north is a gas field without a pipe. Third plate of the collection “Biogas on the ground”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state with municipalities in greens by biomethane potential, darker in the north and centre. On top, transmission pipelines in plum, with delivery points, along an axis that enters from the west, crosses the centre to Campinas and continues to the capital, the coast and the Paraíba Valley, and distribution networks in ochre, dense around Campinas, Sorocaba and Greater São Paulo. The north, the greenest part, has no pipeline. A callout points to Guaíra, 150 km from the nearest pipeline, with the state’s largest potential: 333,000 m³ a day. In the panel, bars show the share of the potential within 10 km, 10 to 25, 25 to 50 and over 50 km from a pipeline."

recorte: "São Paulo State (SP)"
metodo: "Straight-line distance from each municipality’s interior point to the nearest existing transmission or distribution gas pipeline, in four bands, crossed with the biomethane potential (CP2B method v5.1, level N4, reference scenario)."
---

# Biomethane and gas pipelines in São Paulo

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 057, the third of five in the collection **Biogas on the ground**: how far from a
pipeline lies the biomethane that residues could yield.

## What the files contain

The GPKG and CSV are those of [plate 055](../055-densidade-do-biometano-sp/README.en.md). This plate
uses the `gasodutos_transporte`, `gasodutos_distribuicao` and `pontos_entrega` layers and, in the
`municipios` layer, the `km_gasoduto` field (the smaller of `km_gasoduto_transporte` and
`km_gasoduto_distribuicao`) and `km_ponto_entrega`. Its QGIS styles are `potencial` and
`distancia_gasoduto`.

## Method

1. Infrastructure: existing transmission and distribution pipelines and delivery points from the
   EPE WebMap, as published in the MapBiomas infrastructure database; those in SP or up to about
   60 km beyond its border are kept, since the neighbouring network also serves.
2. Distance: straight-line, from each municipality’s interior point (near the centre of the
   polygon) to the nearest line, in km.
3. Bands: up to 10 km, 10 to 25, 25 to 50 and over 50 km; in each, the sum of the potential (CP2B
   v5.1, level N4, reference scenario) and of the population.
4. Length in SP: sum of segments with both ends inside the state.

## Limitations

- The distribution network in the database is what distributors reported to EPE in 2022; smaller
  branches and later works may be missing.
- Distance is measured from the municipality’s centre, not from each mill or farm; a large
  municipality may have part of its land much closer to the pipeline.
- A nearby pipeline does not mean a possible connection: injection depends on pressure, gas
  quality and contract. Biomethane can also travel compressed or liquefied, by lorry.
