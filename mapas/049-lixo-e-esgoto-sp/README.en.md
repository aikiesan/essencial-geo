---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Waste and sewage"
subtitulo: "The city is a gas crop too"

contexto: >-
  The organic waste, sewage sludge and prunings of São Paulo’s towns and cities could give 621,000 m³ of biomethane a day under the CP2B method: 434,000 from waste, 121,000 from sludge and 66,000 from prunings. That is little next to the countryside, under 4% of the state total, but it lies where almost everyone lives. The city of São Paulo accounts for 23% and its region for 39%. Half the methane the waste could generate is already captured at landfills, and the method deducts that share. The map also shows the 873 sewage treatment plants registered by ANA, serving 608 municipalities. Most treat sewage in ponds (552); 87 use anaerobic reactors, which produce biogas during treatment. Fifth plate of the collection “From field to biomethane”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state with municipalities coloured by the biomethane that waste, sewage and prunings could give per day, in six teal classes, from the lightest (up to 37 m³) to the darkest (1,100 to 143,796 m³). Dark tones dominate Greater São Paulo and the Campinas–Sorocaba axis and also appear in the mid-sized towns of the interior; the Ribeira valley and the upper Paraíba valley are grey, with zero. Over the map, 873 sewage treatment plants: small dots in blue (ponds), dark grey (activated sludge) and light grey (other processes), and 87 larger clay-coloured dots with anaerobic reactors, densest between Campinas, Piracicaba and São Paulo. A callout points to São Paulo: 144,000 m³ a day, 23% of the state’s urban biomethane."

recorte: "São Paulo state (SP)"
metodo: "Biomethane potential of organic waste, sewage sludge and urban prunings at the accessible level of the CP2B method, by municipality, in six quantile classes; ANA sewage treatment plants, one per code, coloured by process family."
---

# Waste, sewage and prunings in São Paulo: the biomethane of the cities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 049, the fifth of six in the collection **From field to biomethane**: after the crops,
the residues that towns and cities produce every day.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `etes` | point | 873 plants: `codigo`, `nome`, `situacao`, `tratamento` (declared process), `familia_ana`, `familia` (reactor, pond, activated sludge, other), `remocao_dbo` (BOD removal), host municipality (`CD_MUN`, `NM_MUN`) and `municipios_atendidos` (municipalities served) |
| `municipios` | polygon | 645 municipalities: `CD_MUN`, `NM_MUN`, intermediate region, `lixo_m3_dia` (waste), `lodo_m3_dia` (sludge), `poda_m3_dia` (prunings), `urbano_m3_dia` and `lixo_ja_usado_ch4_m3_dia` (methane, not biomethane) |
| `regioes_intermediarias` | polygon | 11 intermediate geographic regions |
| `limite_estadual` | polygon | outline of the state |

The **GPKG** is zipped and attached to the
[`agro-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/agro-sp-2026),
with the plate’s **QGIS styles**. There are two **CSV** files in UTF-8: one with the municipal
table and one with the plants and their coordinates.

## Method

1. Potential of the *organic waste*, *sewage sludge* and *urban prunings* substrates in the CP2B
   method v5.1 (Unicamp, version of 24/09/2026), reference scenario, level N4 (accessible), in m³
   of biomethane equivalent per day, added up by municipality and split into six quantile
   classes.
2. Methane already used: the share the method deducts from organic waste because it is already
   captured at landfills with energy recovery, in m³ of methane per day, compared with the
   potential before that deduction.
3. Sewage treatment plants from ANA’s 2019 database. The database repeats plants that serve
   several municipalities, once per municipality, with the same code; one point is kept per code,
   at the host municipality’s record, and the `municipios_atendidos` column holds how many it
   serves (the Barueri plant, which serves the most, serves 11).
4. Process families, as ANA groups them: anaerobic reactors, pond systems, activated sludge and
   the rest (simplified, chemical and mixed processes).

## Limitations

- The CP2B potential is modelled, not measured. It accounts for the distance to where the gas
  would be produced. In 33 municipalities, most of them in the Ribeira and Paraíba valleys, the
  accessible level gives zero, and the map shows them in grey: it does not mean there is no
  waste.
- Sludge only counts where sewage is treated; 517 municipalities give zero for sludge.
- The plant database dates from 2019 and has neither flow nor population served for most plants;
  that is why all dots are the same size, and anaerobic reactors are drawn larger only to be
  seen.
- An anaerobic reactor produces biogas, but the database does not say whether it is flared, used
  or upgraded to biomethane.

## Data licence

Public data from ANA, free to use with attribution. The CP2B (Unicamp) potential is published here
with the centre’s permission; cite “CP2B (Unicamp), method v5.1, 2026”.
