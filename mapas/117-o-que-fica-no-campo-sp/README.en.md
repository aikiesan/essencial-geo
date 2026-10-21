---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "What stays in the field"
subtitulo: "Straw protects the soil and grazing manure is never gathered: a third of the theoretical never leaves the land"

contexto: >-
  The first step of the biomethane funnel is the widest: 8.4 billion m³ of methane a year, 36% of São Paulo’s theoretical potential, stays in the field because the residue cannot or should not be collected (CP2B, from N1 to N2, reference scenario). More than half, 5.0 billion, is cane straw: the method collects 40% of it and leaves the rest covering the soil, against erosion and moisture loss. Another 1.38 billion is manure from grazing cattle, which spreads out and is never gathered; 0.95 billion is soy and maize straw. Cane straw is the largest cause in 350 municipalities, led by Morro Agudo and Guaíra with about 104 million m³ each; grazing manure leads in 165, where there is little cane: the Paraíba Valley, the east and south of the state and the Pontal do Paranapanema. It is a model, not a measurement. Second plate of “The biomethane funnel”.

imagem: ./mapa_preview.en.png
imagem_alt: "Proportional circle map over São Paulo municipalities in light grey: each circle’s area is the methane that stays in the field, and its colour the largest cause. Large straw-coloured circles cover the cane-growing north and centre; smaller brick-red circles, grazing manure, sit in the far west, in the Paraíba Valley and scattered across the east and south; olive-green circles, soy and maize straw, in the south-west, near Itapeva; grey circles, other residues, in the capital, around it and in inland towns. Callouts point to Morro Agudo, with 104 million m³ of straw left in the cane fields, and Presidente Bernardes, with 19 million m³ of manure spread over pasture. In the panel, bars show the four causes: 5.05 billion m³ of cane straw, 1.38 of grazing manure, 0.95 of grain straw and 1.06 of other residues."

recorte: "São Paulo State (SP)"
metodo: "For each municipality and residue, CP2B v5.1’s theoretical potential (N1) less the technical potential (N2), in normal m³ of methane a year, reference scenario; summed by municipality and grouped into four causes (cane straw, manure from grazing cattle, soy and maize straw, others). The circle sits on the municipality’s interior point and takes the colour of the largest cause."
---

# The methane that stays in the field in São Paulo

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 117, the second of five in the collection **The biomethane funnel**: the first step of the
funnel, from theoretical (N1) to technical potential (N2), and what stays in the field in each municipality.

## What the files contain

- `dados/sp_funil_municipios.csv`: one row per municipality. This plate uses `perda_coleta_m3` (N1 − N2),
  `coleta_palha_cana_m3`, `coleta_esterco_pasto_m3`, `coleta_palha_graos_m3`, `coleta_outros_m3`,
  `causa_coleta` (the largest of the four) and `perda_coleta_pct` (share of N1).
- `sp_funil_biometano.gpkg.zip` (in the `funil-sp-2026` release): the `perda_na_coleta` layer carries the
  `coleta` style, with circles sized and coloured as on the plate.

## Method

1. For each municipality and residue, the difference between CP2B v5.1’s theoretical (N1) and technical
   (N2) levels, in the reference scenario. N2 is N1 times the residue’s collection factor (FC).
2. The reference scenario’s collection factors: 40% of cane straw, 30% of soy straw, 40% of maize straw,
   50% of dairy cow manure, 65% of feedlot cattle, 85% of pigs, 65% of organic waste and none of the
   manure from grazing cattle (up to 10% in the maximum scenario, for the pen in mixed systems).
3. Four causes: cane straw, manure from grazing cattle, soy and maize straw, and other residues (waste,
   sludge, prunings, poultry and pig farms, vinasse, bagasse). The circle’s colour is the largest in the
   municipality.

## Limitations

- Leaving straw on the soil is not a loss for the farming system: it protects against erosion, holds water
  and returns carbon and nutrients. The collection factor is an agronomic choice, not waste.
- Grazing manure is counted in N1 to show the size of what is not gathered; it is not a potential.
- The circle sits on the municipality’s interior point, not where the crop or the herd is.
- It is a model, not a measurement; plate 120 shows how much the result changes between scenarios.
