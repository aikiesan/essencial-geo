---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The supply curve"
subtitulo: "Half the biomethane lies over 76 km from a gas delivery point"

contexto: >-
  How much biomethane lies close to where gas enters the grid? Measuring the straight-line distance from each 1 km cell to the nearest existing gas delivery point, only 14% of the state’s potential lies within 25 km and 33% within 50 km; half lies over 76 km away, and a tenth over 157 km. The curve changes with the source: 57% of waste, pruning and sewage lies within 25 km, because cities and pipelines go together; half of the manure lies within 59 km, half of the cane within 80 km and half of the other crops within 101 km. The power grid is denser: half the potential lies within 33 km of a basic-grid substation. The end of the curve is the cane-growing north, such as Igarapava, 226 km from the nearest delivery point. Second plate of the collection “Supply catchments”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state with the distance to the nearest gas delivery point, from dark green (up to 10 km) to brown (over 150 km), in strong tones where most of the potential lies and pale tones elsewhere. Transmission pipelines and delivery points appear in wine red, on a diagonal from Mato Grosso do Sul to the capital and on to the Paraíba Valley; the greens follow this line and the north and west are orange and brown. A callout points to Igarapava, 226 km away. In the panel, curves of the cumulative share of potential by distance, one per source, with a dashed curve for distance to a substation."

recorte: "São Paulo State (SP)"
metodo: "CP2B biomethane potential (v5.1, level N4, reference scenario), distributed by land use in cells of about 1 km, accumulated by straight-line distance from each cell to the nearest existing gas delivery point (and, separately, to the nearest basic-grid substation), on both sides of the state border."
---

# The biomethane supply curve in São Paulo

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 086, the second of four in the collection **Supply catchments**. It is the São Paulo
version of the supply curve in the biomass analyses of the DOE (USA) and S2Biom (EU), with distance
in place of cost: how much biomethane can be gathered as one accepts going further from the gas
grid. Each municipality’s distance to the grid is on plates
[057](../057-biometano-e-gasodutos-sp/README.en.md) and
[058](../058-biometano-e-rede-eletrica-sp/README.en.md); here the count is per 1 km cell and
cumulative.

## What the files contain

The CSV holds, from 0 to 234 km, the biomethane accumulated within each distance of the nearest
delivery point, in total and by source (`biometano_ate_ponto_entrega_m3d`, `cana_…` cane,
`lavouras_…` other crops, `pecuaria_…` manure, `urbano_…` urban), the share of the total
(`pct_ate_ponto_entrega`) and the same count for substations (`biometano_ate_subestacao_m3d`,
`pct_ate_subestacao`). In the GPKG of [plate 085](../085-biometano-ao-alcance-sp/README.en.md),
the `grade` layer has the distance to and name of each cell’s nearest delivery point and
substation.

## Method

1. CP2B potential (v5.1, N4, reference scenario) distributed by land use in cells of about 1 km,
   as on plate 085.
2. EPE gas delivery points and basic-grid substations (in the MapBiomas version), in SP and around
   it, so that a cell near the border can use a point on the other side. Points less than 100 m
   apart (duplicate records) become one: 55 delivery points and 183 substations.
3. Straight-line distance from each cell’s centre to the nearest point, in kilometres, and
   cumulative sum of the potential by distance, kilometre by kilometre.
4. On the map, strong colours mark the densest cells, which hold 75% of the potential
   (89 m³/day per km² or more, 24% of the area).

## Limitations

- Distance is in a straight line and to the existing delivery point; it says nothing about whether
  the point has capacity or a contract to take biomethane, and distribution pipelines are not
  considered.
- The curve is not a cost curve: haulage, compression and injection depend on scale and transport
  mode, which this plate does not estimate.
- The potential is CP2B’s, for SP only; potential across the border is left out.
