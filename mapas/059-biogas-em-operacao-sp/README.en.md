---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Biogas in operation"
subtitulo: "Of the potential, what has already become a plant"

contexto: >-
  Of a potential of 16.9 million m³ of biomethane a day, how much has already become a plant? In April 2026, nine biomethane plants in São Paulo reported output to ANP. Together they hold 558,000 m³ a day of authorised capacity, 3.3% of the potential, and that month processed only 15% of the biogas they could treat: three of them stood near zero. The largest, Raízen and Geo’s plant in Piracicaba, has 130,000 m³ a day authorised, from vinasse and filter cake; the Caieiras landfill plant runs the most, at 45% use. In electricity, ANEEL lists 32 biogas distributed generation units in the state, with 21.9 MW, in 24 municipalities: most of it at landfills in the capital and São José dos Campos and at a mill in Narandiba; the rest, smaller, mostly from farm manure. The larger biogas power stations are on plate 028. Last plate of the collection “Biogas on the ground”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state with municipalities in pale greens by biomethane potential. Dark blue circles, proportional to authorised capacity, mark nine ANP biomethane plants, from Narandiba and Paraguaçu Paulista in the west to Américo Brasiliense, Piracicaba, Elias Fausto, Paulínia, Caieiras, São Paulo and Jambeiro. Clay-red rings, proportional to capacity, mark biogas distributed generation in 24 municipalities, the largest in the capital. A callout points to Piracicaba, with 130,000 m³ a day authorised, the largest capacity. In the panel, bars show each plant’s capacity and the share of biogas processed that month."

recorte: "São Paulo State (SP)"
metodo: "SP biomethane plants that reported output to ANP in April 2026, with authorised capacity and biogas processed, and ANEEL biogas distributed generation units summed by municipality, over the biomethane potential (CP2B method v5.1, level N4, reference scenario)."
---

# Biogas in operation in São Paulo

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 059, the last of five in the collection **Biogas on the ground**: after the potential,
the source and the distance to the grid, what already works. MapBiomas biogas plants and SIGA
biogas power stations are on [plate 028](../028-usinas-de-biogas-sp/README.en.md).

## What the files contain

The GPKG and CSV are those of [plate 055](../055-densidade-do-biometano-sp/README.en.md). This plate
uses the `plantas_biometano` layer (`capacidade_m3d`, `capacidade_biogas_m3d`,
`biogas_processado_m3d`, `utilizacao_pct`, `referencia`) and `gd_biogas` (`unidades`,
`potencia_kw` and capacity by type: `residuos_animais` animal, `residuos_urbanos` urban,
`agroindustrial`, `florestal` forestry). Points sit at the municipality’s interior point, not at
the plant’s address.

## Method

1. ANP: SP biomethane plants in the latest month reported, April 2026. One plant authorised in the
   capital whose last report dates from June 2022, with no output, is left out.
2. Use: biogas processed in the month divided by the authorised biogas processing capacity.
3. ANEEL: biogas-fired distributed generation units in SP, in the October 2026 list, summed by
   municipality. Holders’ names are left out, since many are private individuals.

## Limitations

- One month of output is a snapshot: plants starting up or under maintenance show low use.
- Authorised capacity is in biomethane; the CP2B potential is also in biomethane equivalent, but
  not all potential needs to become biomethane to be used.
- Biogas power stations outside distributed generation, such as the capital’s landfill plants,
  are on plate 028, not here.
