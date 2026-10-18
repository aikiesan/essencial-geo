---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Biomethane within 30 km"
subtitulo: "Within a lorry’s radius, three quarters of the state gather gas for a plant"

contexto: >-
  A biomethane plant needs residue within a distance a lorry can pay for. Adding up the CP2B potential within 30 km of each point of the state, 73% of São Paulo’s area gathers 60,000 m³ a day or more, the median of the nine São Paulo plants authorised by ANP. Almost all of it is cane: without it, only 17% of the area gets there. The maximum lies at Sertãozinho, with 1.06 million m³ a day within 30 km, 98% from cane. Beyond cane, the largest catchments are the capital’s waste, pruning and sewage (206,000), manure around Cesário Lange (155,000) and other crops at Itapeva (107,000). Only 13% of the area, mostly in the Ribeira Valley, on the coast and in the Paraíba Valley, gathers under 10,000. First plate of the collection “Supply catchments”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state in continuous greens: the darker, the more biomethane within 30 km of each point. Almost the whole interior exceeds 60,000 m³ a day, with the darkest green in the north-east, around Sertãozinho; the Ribeira Valley, the coast, the Paraíba Valley and the western tip are pale beige. A callout points to Sertãozinho, with 1.06 million m³ a day; another to the capital, with 206,000 from waste, pruning and sewage; another to Itapeva, with 107,000 from other crops. In the panel, bars show the share of the area gathering 60,000 m³ a day from each source."

recorte: "São Paulo State (SP)"
metodo: "CP2B biomethane potential (v5.1, level N4, reference scenario) spread within each municipality over the land use that produces each residue (MapBiomas 2024), summed in cells of about 1 km and then over a 30 km straight-line disc around each cell."
---

# Biomethane within 30 km in São Paulo

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 085, the first of four in the collection **Supply catchments**, which reads biomethane
potential the way the county supply curves of the *Billion-Ton Report* (DOE, USA) and the S2Biom
cost-supply analysis (EU) do: not by municipality, but by what a lorry can gather. Potential
density and each municipality’s main source are on plates
[055](../055-densidade-do-biometano-sp/README.en.md) and [056](../056-alem-da-cana-sp/README.en.md).

## What the files contain

The GPKG serves all four plates of the collection. The `grade` layer holds, for each cell of about
4.5 km, the potential in the cell (`biometano_m3d`, by source in `cana_m3d` cane, `lavouras_m3d`
other crops, `pecuaria_m3d` manure, `urbano_m3d` urban, and `m3d_por_km2`) and what lies within
30 km of its centre (`alcance30_m3d`, `alcance30_<source>_m3d`, `alcance30_fora_da_cana_m3d`
outside cane). The default QGIS style repeats this plate’s classes. The CSV holds, by
municipality, the potential, the 30 km catchment at the interior point and the maximum within the
municipality (`alcance30_max_m3d`), the share of area gathering 60,000 m³/day
(`pct_area_alcance_ref`) and the distances used on plates 086 and 088.

## Method

1. CP2B potential (method v5.1, level N4, accessible, reference scenario) by municipality and
   substrate, in four groups: sugarcane; other crops; animal manure; waste, pruning and sewage.
2. Dasymetric distribution: within each municipality, each group goes to the MapBiomas 2024 pixels
   (resampled to about 120 m) of the class that produces it: cane (class 20); temporary crops,
   coffee and citrus (39, 40, 41, 62, 46, 47); pasture and mosaic of uses for manure (15, 21);
   urban area for waste, pruning and sewage (24). Where a municipality lacks the class, the
   potential is spread over all of it.
3. Sum in cells of 10 × 10 pixels (about 1.1 × 1.2 km) and, for each cell, sum of the cells within
   30 km in a straight line of its centre.
4. Reference size: 60,000 m³/day, the rounded median authorised capacity of the nine São Paulo
   biomethane plants that reported output to ANP in April 2026 (from 24,000 to 130,000).

## Limitations

- The 30 km are in a straight line; by road the effective radius is smaller. The radius is a
  reading convention, not a computed haulage cost.
- CP2B covers only SP: near the border, residue on the other side is left out and the catchment
  shrinks.
- Level N4 already discounts existing uses of the residue, but not the plants in operation: who
  already collects within a radius appears on plate 088.
- The distribution within the municipality follows land use, not the location of mills, farms or
  landfills; within each municipality the pattern is an estimate.
- 0.1% of the other-crops potential (1,200 m³/day) fell in municipalities without the class and was
  spread over the whole municipality.
