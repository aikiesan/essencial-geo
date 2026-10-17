---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Protected areas"
subtitulo: "Where the forest still keeps the spring"

contexto: >-
  In the Litoral Norte, 73% of the basin lies in strictly protected areas, most of it in the Serra do Mar State Park. In the west of the state, three basins — Baixo Tietê, São José dos Dourados and Baixo Pardo/Grande — have none at all. Taken together, the 270 protected areas in the CNUC for São Paulo cover 15.1% of the territory, but only 4.0% under strict protection; nearly all the rest are Environmental Protection Areas, which allow settlement under rules. Over the 22 basins, the map shows where protected forest still keeps the springs: in the Serra do Mar and the Ribeira valley. Final plate of the collection “Water in São Paulo”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state in light grey with the 22 UGRHIs outlined in blue and numbered. Strictly protected areas are forest green, concentrated in the Serra do Mar and the Ribeira valley; sustainable-use areas are olive; and Environmental Protection Areas are hatched in ochre, scattered across the centre and east. The west is almost empty. An arrowed callout points to the Litoral Norte: 73% strictly protected. In the panel, horizontal bars rank the 22 basins by protected share, from 73% down to zero."

recorte: "São Paulo state (SP)"
metodo: "CNUC protected areas clipped to São Paulo’s territory; areas dissolved so overlaps are not counted twice, and crossed with the 22 UGRHIs."
---

# Protected areas over São Paulo’s river basins

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 038, the last of three in the collection **Water in São Paulo**: after the basins and the
drainage, how much of each basin is protected.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `unidades_conservacao` | polygon | 270 units: `cd_cnuc`, `nome_uc`, `nome_abrev`, `categoria`, `grupo`, `esfera`, `cria_ano`, `cria_ato`, `org_gestor`, `area_cnuc_ha` (area declared in the register, whole unit), `area_sp_km2` (part in SP), `apa`, `grupo_mapa` |
| `ugrhi` | polygon | 22 UGRHIs: `km2_protecao_integral`, `km2_qualquer_uc`, `pct_protecao_integral`, `pct_qualquer_uc`, `ucs` (units touching the basin) |
| `limite_estadual` | polygon | outline of the state |

The **GPKG** is zipped and attached to the
[`agua-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/agua-sp-2026).
Its **QGIS styles** match the plate: strict protection in forest green, sustainable use in olive and
APAs in translucent straw, with the largest underneath. The `ugrhi` layer opens as an outline and
has a second style, `protecao_integral`, which colours the basins by percentage.

The **CSV** holds the table of the 270 units, in UTF-8, without geometry.

## Method

1. Federal, state and municipal protected areas, strict-protection and sustainable-use, from the
   CNUC as published by GeoSEADE (2024 edition): 270 units, all active.
2. Each polygon is repaired where invalid and clipped to São Paulo’s territory (the 2025 Municipal
   Mesh boundary). Units crossing the state line, such as the Serra da Mantiqueira APA, enter with
   their São Paulo part only.
3. Areas are dissolved before measuring, so overlapping units (a park inside an APA, for instance)
   are not counted twice. Areas in km² in the Albers equal-area conic projection IBGE uses.
4. Each UGRHI’s share under strict protection and in any protected area is the dissolved area inside
   the basin divided by the basin’s area within São Paulo.

## Limitations

- The marine part of the units is left out: the clip is the municipalities’ territory. The Marine
  APAs of the Litoral Norte, Centro and Sul appear only where they touch land.
- `area_cnuc_ha` is the area declared in the register, for the whole unit; `area_sp_km2` is measured
  here, in São Paulo only. The two may differ.
- Private Natural Heritage Reserves (84) are small and barely show at the plate’s scale, but they
  are in the GPKG.
- The CNUC depends on submissions from the managing bodies: recent municipal units may be missing.
