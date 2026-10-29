---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The road takes its toll"
subtitulo: "Far from where a plant would make sense, the available residue is lost along the way"

contexto: >-
  The last step of the biomethane funnel is the smallest in total and the most uneven on the map: 1.0 billion m³ of methane a year, 15% of São Paulo’s mobilisable potential, is lost in storage and on the way to a plant (CP2B, from N3 to N4, reference scenario). The method’s logistic factor measures, on the road network, how much of the residue fits within a plant’s economic radius. Dairy cow manure loses 70%, because there is little per cow and it is scattered across many smallholdings; organic waste only 5%, because it already arrives together at the landfill. In 126 municipalities the road takes more than half of the mobilisable potential, such as Anhembi, at 94%, and Presidente Epitácio, at 91%; in 27, in the Ribeira Valley and the upper Paraíba Valley, it takes everything. It is a model, not a measurement. Fourth plate of “The biomethane funnel”.

imagem: ./mapa_preview.en.png
imagem_alt: "Choropleth map of São Paulo municipalities in six shades of the cividis palette, from yellow to navy, by the share of the mobilisable methane potential lost before the accessible level. Yellow, up to 10%, covers the cane-growing centre and north and the capital; grey and blue, 25 to 90%, appear in bands in the west and centre-west; navy, over 90%, covers the Ribeira Valley, the southern coast and the upper Paraíba Valley, and spots in the far west. Callouts point to Presidente Epitácio at 91%, Anhembi at 94% and São Paulo at 1.5%, where waste already arrives concentrated. In the panel, bars show the loss by residue: 70% of dairy cow manure, 49% of pig slurry, 26% of soy straw, 19% of cane straw, 16% of sewage sludge, 10% of filter cake, 8% of vinasse and 5% of organic waste."

recorte: "São Paulo State (SP)"
metodo: "For each municipality, CP2B v5.1’s mobilisable potential (N3) less the accessible potential (N4), in normal m³ of methane a year, reference scenario, as a share of N3. N4 is N3 times storage losses (FS) and the logistic factor (FL), which the method computes on the road network for each municipality and residue."
---

# The methane the road takes in São Paulo

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 119, the fourth of five in the collection **The biomethane funnel**: the last step of the
funnel, from mobilisable (N3) to accessible potential (N4), and how much of each municipality lies far
from a plant.

## What the files contain

- `dados/sp_funil_municipios.csv`: one row per municipality. This plate uses `perda_estrada_pct` (share
  of N3 lost before N4), `perda_estrada_m3` and the loss by residue group, `estrada_cana_m3`,
  `estrada_lavouras_m3`, `estrada_pecuaria_m3` and `estrada_urbano_m3`.
- `sp_funil_biometano.gpkg.zip` (in the `funil-sp-2026` release): in the `municipios` layer, the
  `logistica` style reproduces the map’s classes.

## Method

1. For each municipality and residue, CP2B v5.1’s N4 is N3 times the storage factor (FS), the losses
   while the residue waits, and the logistic factor (FL).
2. The method computes FL on the road network: the share of each municipality’s residue that fits within
   the economic radius of a co-digestion plant. Light, scattered residue, such as dairy manure, fits less;
   residue that already gathers in one place, such as waste and vinasse, fits almost entirely.
3. The plate shows the loss as a share of the municipality’s N3. The panel’s bars are the same ratio for
   the state total, by residue.

## Limitations

- The economic radius is a parameter of the method, not a real plant; the map shows where the residue
  lies far away, not where a plant should be.
- In municipalities with a small N3, a few m³ change the colour a lot; the loss in m³ is in the table.
- It is a model, not a measurement; plate 120 shows how much the result changes between scenarios.
