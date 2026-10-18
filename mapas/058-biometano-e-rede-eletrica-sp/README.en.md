---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Biomethane and the power grid"
subtitulo: "The wire reaches closer than the pipe"

contexto: >-
  Where there is no pipeline, biogas can become electricity on the spot and leave by wire. In São Paulo, the basic grid, from 230 kV up, adds up to 19,100 km of lines and 91 substations, and covers the state far better than gas pipelines: 58% of the biomethane potential lies within 10 km of a transmission line, and only 1% over 50 km. The bottleneck is the substation, where power enters the grid: 65% of the potential lies over 25 km from one, measured from the municipality’s centre. Valparaíso, in the west, has 197,000 m³ of possible biomethane a day 2.6 km from a line, but 52 km from the nearest substation. On the previous plate, gas from the sugarcane north lay far from the pipe; here, the wire runs right over it. Fourth plate of the collection “Biogas on the ground”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state with municipalities in greens by biomethane potential, darker in the north and centre. On top, basic-grid transmission lines in ochre (up to 230 kV), clay (345 and 440 kV) and plum (500 kV or more) cross the state in every direction, densest from the north-west to the capital; black dots mark substations. A callout points to Valparaíso, 52 km from the nearest substation, with 197,000 m³ a day of potential. In the panel, two sets of bars show the share of the potential by distance to a line and to a substation."

recorte: "São Paulo State (SP)"
metodo: "Straight-line distance from each municipality’s interior point to the nearest basic-grid transmission line and substation, in four bands, crossed with the biomethane potential (CP2B method v5.1, level N4, reference scenario)."
---

# Biomethane and the power grid in São Paulo

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 058, the fourth of five in the collection **Biogas on the ground**: the same question as
[plate 057](../057-biometano-e-gasodutos-sp/README.en.md), now for biogas that becomes electricity.
The country’s whole grid is on [plate 042](../042-transmissao-brasil/README.en.md).

## What the files contain

The GPKG and CSV are those of [plate 055](../055-densidade-do-biometano-sp/README.en.md). This plate
uses the `linhas_transmissao` and `subestacoes` layers and, in the `municipios` layer, the
`km_linha_transmissao` and `km_subestacao` fields. Its QGIS styles are `potencial` and
`distancia_subestacao`.

## Method

1. Infrastructure: existing transmission lines and substations from the EPE WebMap, as published
   in the MapBiomas infrastructure database (the same as plate 042); those in SP or up to about
   60 km beyond its border are kept.
2. Distance: straight-line, from each municipality’s interior point to the nearest line and
   substation, in km.
3. Bands: up to 10 km, 10 to 25, 25 to 50 and over 50 km; in each, the sum of the potential (CP2B
   v5.1, level N4, reference scenario).

## Limitations

- The database covers the basic grid, from 230 kV up. The 138 and 88 kV lines and the
  distributors’ substations, where small plants usually connect, are not in it; with them,
  distances would be shorter.
- Distance is measured from the municipality’s centre, not from each plant.
- A nearby line does not mean a possible connection: access depends on grid capacity and the
  operator’s assessment.
