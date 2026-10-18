---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Who treats the waste"
subtitulo: "Urban waste is everywhere; those who treat it are in few places"

contexto: >-
  São Paulo’s organic rubbish, sewage sludge and prunings would yield 621,000 m³ of biomethane a day at CP2B’s accessible level, and that matter is in every town. Those who treat it are not. Only 71 of the 645 municipalities have formal jobs in waste treatment and disposal, landfills, composting and biogas plants: 7,555 in the state, against 52,000 in collection. The capital has 23% of urban biomethane and 1,861 of those jobs; São José dos Campos, Arujá and Caieiras come next. Yet 44% of urban biomethane lies in municipalities with no treatment jobs at all: Piracicaba has 13,000 m³ a day and none; São José do Rio Preto, 12,000 and none. There, waste travels to a landfill in another municipality or is handled by the council, outside the private count. Fifth and last plate of the collection “The bioeconomy at work”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo’s municipalities in five shades of grey-green by the biomethane potential of organic rubbish, sewage sludge and prunings, darker in the large towns, with brick-coloured circles proportional to formal jobs in waste treatment and disposal. The circles are few and gathered in Greater São Paulo, the Paraíba Valley and some inland towns; many dark mid-sized towns have no circle. Callouts point to the capital, with 23% of urban biomethane and 1,861 treatment jobs, and Piracicaba, with 13,000 m³ a day and no jobs. In the panel, the legend, the reference circles and bars with waste and sewage jobs per 10,000 people in each intermediate region."

recorte: "São Paulo State (SP)"
metodo: "Urban-waste biomethane potential by municipality (CP2B v5.1, level N4, reference scenario: organic waste, sewage sludge and prunings), in five classes, and circles proportional to active jobs on 31/12/2025 in waste treatment and disposal (CNAE 38.21 and 38.22, RAIS 2025)."
---

# Urban waste and who treats it across São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 080, the last of five in the collection **The bioeconomy at work**. The bioeconomy’s
weight in each municipality is on [plate 076](../076-bioeconomia-no-emprego-sp/README.en.md);
sanitation, on plates 051 to 054.

In the United Kingdom, anaerobic digestion maps set installed treatment capacity beside the food
waste each region generates, to show where plants are missing. This plate reads São Paulo in a
similar way: the potential of urban waste underneath and, on top, where people work to treat it.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `res`, `res_esgoto`, `res_coleta`, `res_tratamento`, `res_recuperacao`, `res_10mil` (waste and sewage jobs per 10,000 people), `pessoas` and `biometano_urbano` (m³/day) |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

It is the **GPKG** of [plate 076](../076-bioeconomia-no-emprego-sp/README.en.md), with the **QGIS
style** `res_10mil`. The **CSV** has the municipal table, without geometry.

## Method

1. Urban waste: CP2B biomethane potential (method v5.1, level N4, reference scenario) from the
   organic fraction of municipal solid waste, sewage sludge and prunings, in m³ per day, in five
   classes: up to 500, 500 to 1,500, 1,500 to 4,000, 4,000 to 10,000 and over 10,000.
2. Who treats it: active jobs on 31/12/2025 (RAIS 2025) in CNAE classes 38.21 and 38.22 (treatment
   and disposal of non-hazardous and hazardous waste), as circles of proportional area.
3. In the panel, all waste and sewage jobs (CNAE 37.01, 37.02, 38.11, 38.12, 38.21, 38.22, 38.31,
   38.32 and 38.39) per 10,000 people from the 2022 Census, by intermediate region.

## Limitations

- RAIS only counts firms and bodies reporting jobs in these classes. A council that runs its own
  landfill with civil servants shows up in another class, and treatment disappears from the map.
- A job sits at the establishment’s address: a regional landfill appears in one municipality only,
  and a concession at its head office.
- Employment measures the size of the operation, not where the waste ends up: landfill, composting
  and digestion are counted together.
