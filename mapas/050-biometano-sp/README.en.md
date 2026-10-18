---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Biomethane in SP"
subtitulo: "The gas already in the field"

contexto: >-
  Adding up all residues, São Paulo could produce 16.9 million m³ of biomethane a day at the accessible level of the CP2B method, which deducts what must stay on the soil, the uses already competing for each residue and the distance to where the gas would be made. Sugarcane accounts for 82%: the straw left in the cane fields alone would give 6.9 million. The potential is concentrated in the north of the state. The Ribeirão Preto and São José do Rio Preto regions add up to 41%, 68 municipalities hold half the total, and Guaíra leads, with 333,000 m³ a day. Sugarcane is the largest source in 370 municipalities; waste and sewage in 105, 86 of them in the São Paulo, Campinas and São José dos Campos regions. From theoretical to accessible potential, a quarter remains. Last plate of the collection “From field to biomethane”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state with one circle per municipality, sized by the biomethane its residues could give per day (20,000 to 300,000 m³ in the legend) and coloured by the largest source: green for sugarcane, ochre for other crops, clay for livestock and blue for waste and sewage. Large green circles cover the north, centre and west of the state, densest around Ribeirão Preto; the ochre ones sit in the south-west, near Itapeva; the clay ones around Bastos and in the centre-east; the blue ones in São Paulo, Campinas and the Paraíba valley. The Ribeira valley has almost no circles. A callout points to Guaíra, in the north: 333,000 m³ a day, the largest potential in the state. In the panel, a bar chart shows the potential falling from 64.8 million m³ of methane a day at the theoretical level to 16.4 million at the accessible level."

recorte: "São Paulo state (SP)"
metodo: "Biomethane potential of 17 residues at the accessible level of the CP2B method, added up into four groups by municipality; circles sized by the total and coloured by the group with the largest potential."
---

# Biomethane in São Paulo: the potential of all residues, municipality by municipality

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 050, the last of six in the collection **From field to biomethane**: sugarcane, other
crops, livestock and the cities brought together in one map.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `potencial` | point | 618 municipalities with potential above zero, one point inside each, with the same table as the `municipios` layer |
| `municipios` | polygon | 645 municipalities: `CD_MUN`, `NM_MUN`, intermediate region, `cana_m3_dia` (sugarcane), `lavouras_m3_dia` (other crops), `pecuaria_m3_dia` (livestock), `urbano_m3_dia` (waste and sewage), `total_m3_dia`, `dominante` (group with the largest potential) and `parte_dominante` (% of the total) |
| `regioes_intermediarias` | polygon | 11 intermediate geographic regions |
| `limite_estadual` | polygon | outline of the state |

The **GPKG** is zipped and attached to the
[`agro-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/agro-sp-2026).
The `potencial` layer opens with the plate’s circles, in the `circulos` **QGIS style**.

The **CSV** holds the municipal table, in UTF-8, without geometry. In the 27 municipalities with
no potential, `dominante` and `parte_dominante` are empty.

## Method

1. Potential of 17 residues in the CP2B method v5.1 (Unicamp, version of 24/09/2026), reference
   scenario, level N4 (accessible), in m³ of biomethane equivalent per day.
2. Four groups:
   - **sugarcane**: straw, bagasse, filter cake and vinasse;
   - **other crops**: maize straw, soybean straw, orange bagasse and coffee husk;
   - **livestock**: broilers, laying hens, dairy cattle, feedlot cattle, grazing cattle and pigs;
   - **waste and sewage**: organic waste, sewage sludge and urban prunings.
3. Circle area proportional to the municipality’s total, coloured by the group with the largest
   potential.
4. From theoretical to accessible: the method’s four levels, in m³ of methane per day. N1 is
   theoretical, N2 available, N3 mobilisable and N4 accessible, which also accounts for the
   distance to where the gas would be produced. Biomethane equivalent is methane divided by 0.97.

## Limitations

- The CP2B potential is modelled, not measured: it says how much gas the residues could give, not
  how much is produced today.
- At the accessible level, grazing cattle give zero across the state, and 27 municipalities have
  no potential at all, most of them in the Ribeira and Paraíba valleys.
- Orange bagasse is allocated to the juice mills, not to the groves (see plate No. 047).
- The groups add up different residues that call for different technologies: straw, bagasse,
  coffee husk and prunings, 61% of the total, are fibrous materials, harder to digest than manure
  or vinasse.

## Data licence

The CP2B (Unicamp) potential is published here with the centre’s permission; cite “CP2B (Unicamp),
method v5.1, 2026”. IBGE municipal mesh, free to use with attribution.
