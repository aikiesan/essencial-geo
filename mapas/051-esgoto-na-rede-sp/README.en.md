---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Sewage on the mains"
subtitulo: "The mains cover the city; the countryside stays on the tank"

contexto: >-
  In 2022, 91.3% of households in São Paulo state had their sewage connected to the mains, to the storm drain or to a septic tank linked to the mains: 14.8 million out of 16.2 million. 1.41 million were missing. Painted tract by tract, the map shows the mains as an urban thing: three households in four live in tracts where over 99% are connected, but those tracts are small, and the cream of the rural tracts, where almost no one is on the mains, covers most of the state. The city of São Paulo has 205,630 households off the mains, the largest absolute number; among towns with more than 20,000 households, Ibiúna has the largest share off the mains (71%). First plate of the collection “Sanitation and biomethane”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state with its 103,000 census tracts coloured by the share of households whose sewage went to the mains, the storm drain or a tank linked to the mains in 2022, in six classes from cream (up to 10%) to dark blue (over 99%). The cream of rural tracts covers most of the territory; dark blue forms patches in the towns, the largest in Greater São Paulo. Tracts whose class is withheld are hatched. A callout points to Ibiúna, with 71% of households off the mains. In the panel, each class has a bar with its share of the state’s households, and the six towns with the most households off the mains appear as bars, led by São Paulo with 205,630."

recorte: "São Paulo State (SP)"
metodo: "Share of each census tract’s occupied permanent private households whose sewage goes to the mains, the storm drain or a tank linked to the mains, in six classes; tracts with withheld values get a class only when it does not depend on the omitted value."
---

# Sewage on the mains: São Paulo’s census tracts in 2022

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 051, the first of four in the collection **Sanitation and biomethane**: before asking how
much gas sewage could yield, where it reaches the mains.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `setores` | polygon | 103,319 tracts: `CD_SETOR`, `CD_MUN`, `NM_MUN`, `situacao`, `dppo` (occupied permanent private households), households by sewage destination (`esgoto_rede` mains, `esgoto_ligada` tank linked to mains, `esgoto_septica` septic tank, `esgoto_rudimentar` pit, `esgoto_vala` ditch, `esgoto_rio` river, `esgoto_outra` other, `esgoto_sem` no toilet) and by rubbish destination (`lixo_coletado` collected, `lixo_cacamba` skip, `lixo_queimado` burnt, `lixo_enterrado` buried, `lixo_terreno` dumped, `lixo_outro` other), `classe_rede` (1 to 6), `destino` (leading), `classe_lixo` (0 to 5) and `sem_domicilio` |
| `regioes_intermediarias` | polygon | 11 intermediate geographic regions |
| `limite_estadual` | polygon | state outline |

The **GPKG** is shared by plates 051, 052 and 053 and is zipped and attached to the
[`saneamento-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/saneamento-sp-2026).
The `setores` layer carries three **QGIS styles**, one per plate (`esgoto_na_rede` is the default).
Polygons were simplified to about 10 m. Withheld counts are empty (`NULL`).

## Method

1. 2022 Census tract aggregates (household characteristics, parts 1 and 2): occupied permanent
   private households and where the sewage from the bathroom or toilet goes.
2. Connected: sewage to the mains or storm drain, or to a septic tank linked to the mains, over the
   tract’s total households. Six classes: up to 10%, 10 to 50%, 50 to 80%, 80 to 95%, 95 to 99%
   and over 99%.
3. **Confidentiality.** IBGE replaces small tract counts with `X`. In the variables used here, no 1
   or 2 appears in São Paulo’s data, while 3 and 4 appear thousands of times; an `X` therefore
   hides a 1 or a 2. An `X` is never read as zero: a tract gets a class only when the class is the
   same with `X` = 1 and with `X` = 2. The 3,209 tracts whose class depends on the omitted value
   (163,490 households) are hatched as no data.
4. Tracts become a 0.002° grid (about 200 m) to fit the state-wide plate; the 2,391 tracts with no
   occupied household are light grey.
5. State and municipal totals: SIDRA table 6805, without confidentiality cuts.

## Limitations

- The Census asks where sewage goes, not whether it is treated. Connected does not mean treated.
- A large rural tract weighs a lot on the map and little in the numbers, which is why the panel
  measures the classes in households, not area.
- The 200 m grid loses the smallest urban tracts; the GPKG has them all.
