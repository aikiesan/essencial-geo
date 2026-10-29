---
# English version (EN-UK). Numbers, files and layers come from README.md.
titulo: "Small, gas-rich and on their own"
subtitulo: "48 towns of under 20,000 people hold 21% of the biomethane potential and lie far from the pipeline"

contexto: >-
  48 São Paulo municipalities combine three things: biomethane potential in the state’s top quarter, fewer than 20,000 people and over 50 km from the transmission pipeline. Together they hold 21% of the state’s accessible potential, 3.53 million m³ a day, for 487 thousand people, mostly from cane. According to MUNIC 2023, 34 of them run solid-waste services on their own, 9 have another regional arrangement and 5 are in a public consortium; none uses piped gas. Going it alone is as common in the group as statewide: this is a descriptive portrait, with no test. Ariranha, with 7,602 people, has the group’s largest potential, 176 thousand m³/day. Fifth plate of the collection “Bioenergy, crossed”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo with the 48 small, biomethane-rich municipalities far from the pipeline in three colours by how they run waste services: ochre for those running them alone, light lilac for another regional arrangement and purple for a public consortium. The other 114 municipalities in the top quarter of potential are light grey, and the rest white. A thick black line marks the transmission pipeline, crossing the state from west to east, and thin grey lines the distribution network, concentrated in the east. Ochre dominates the north and north-west. Callouts point to Ariranha, Tarumã and Maracaí. In the panel, the legend and a MUNIC 2023 table comparing the group with the state."

recorte: "São Paulo State (SP)"
metodo: "Municipalities with CP2B biomethane potential (v5.1, N4, reference scenario) in the state’s top quarter (30,798 m³/day or more), fewer than 20,000 people (2022 Census) and over 50 km in a straight line from the transmission pipeline (EPE), classified by how they run solid-waste management as declared in MUNIC 2023; no statistical test."
---

# Small municipalities with high biomethane potential, far from the pipeline, by how they run waste services

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 115, the fifth of five in the collection **Bioenergy, crossed**; the previous one is [plate 114](../114-esterco-longe-de-quem-aduba-sp/README.en.md).

The collection crosses São Paulo’s bioenergy with what filling stations sell, with the countryside
and with town halls, across the state’s 645 municipalities. The pairs came from a correlation screen
between CP2B biomethane potential, fuel sales in the SEMIL Yearbook, plantation forestry, the cattle
herd, the Agricultural Census, the vehicle fleet and MUNIC. Each pair went through raw and partial
rank correlation (net of urbanisation, density and income), an effective sample corrected for
spatial autocorrelation, Benjamini–Hochberg q values and bivariate LISA. The last plate is
descriptive, with no test, and the text says so.

The map’s callouts point to Ariranha, with 176 thousand m³/day, 7,602 people and 66 km from the
pipeline, the group’s largest potential, which runs its services alone; Tarumã, with 150 thousand
m³/day 146 km from the transmission pipeline, also alone; and Maracaí, with 114 thousand m³/day, one
of the group’s 5 in a public consortium.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities with cane and ethanol, biomethane and diesel, the fleet, native cover and pulpwood, cattle and organic fertiliser, distances to the pipeline, piped gas and the MUNIC answers on waste; classes `b111`, `b113`, `b114`, `arranjo115` and clusters `lisa111`, `lisa113`, `lisa114` |
| `gasodutos` | line | transmission pipelines and distribution network (`tipo`) |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The **GPKG** is the same for all five plates and carries a QGIS style for each. The **CSV** has the
municipal table, without geometry. Empty fields are missing data, not zero. LISA clusters come as
`AA` (high-high), `BB` (low-low), `AB`, `BA` and `ns` (not significant); the first letter is the
municipality’s variable, the second its neighbours’.

## Method

1. `cheio115`: biomethane potential (`biometano_m3d`, CP2B v5.1, N4, reference) in the top quarter
   of the 645 municipalities, 30,798 m³/day or more (162 municipalities). `alvo115`: in addition, fewer
   than 20,000 people in the 2022 Census (`pessoas`) and `km_gasoduto_transporte` above 50 km.
2. `km_gasoduto_transporte` and `km_gasoduto_distribuicao`: straight-line distance from the
   municipality’s interior point to the nearest transmission pipeline and distribution network (EPE, in
   the MapBiomas infrastructure database; plate 057).
3. `arranjo115` (group only): `consorcio` when MUNIC 2023 says solid-waste services are run
   regionally through a public consortium; `regional` for another regional arrangement; `sozinho` when
   they are not regionalised; `sem_informacao` when the town hall did not answer (no cases).
   `rs_consorcio`, `rs_regionalizado`, `rs_trat_organicos`, `rs_compostagem`, `rs_aterro_sanitario` and
   `rs_coleta_seletiva` carry every municipality’s answers (1 yes, 0 no).
4. In the group and statewide (643 municipalities answered MUNIC): public consortium 5 of 48 (10%)
   against 81 of 643 (13%); any regional arrangement 14 of 48 (29%) against 167 of 643 (26%); treat
   organic waste 10 of 48 (21%) against 91 of 643 (14%); composting 5 of 48 (10%); sanitary landfill in
   the municipality 23 of 48 (48%); separate collection 38 of 48 (79%).
5. `tem_gas_canalizado`: piped natural gas consumption in the SEMIL Yearbook (2024). In the group, 0
   of 48; statewide, 134 of 645. By intermediate region, the group lies in São José do Rio Preto (20),
   Ribeirão Preto (14), Marília (5), Presidente Prudente (4) and Araçatuba (3).

## Limitations

- CP2B is a model: the potential estimates what residues would yield at level N4 (accessible, after
  collection, competing uses, storage and haulage), not biomethane actually produced.
- The group’s potential comes mostly from cane, whose residues depend on the mill, not the town
  hall: the municipal waste service is only one of the doors to a biogas project. The map does not say
  a consortium would make the biogas happen.
- The cut-offs (top quarter, 20,000 people, 50 km) are reading choices; other cut-offs change the
  list. Distances are straight-line, not by road. MUNIC is what each town hall declares.
