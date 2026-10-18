---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The orange belt"
subtitulo: "The grove in the field, the bagasse at the mill"

contexto: >-
  São Paulo harvested 12.0 million tonnes of oranges in 2024, from 354,562 hectares. In 2008 it was 14.5 million tonnes from 592,566 hectares: the area fell by 40%, and each hectare now gives 34 tonnes instead of 25. The belt has also moved south-west. The Araraquara region harvested 3.4 million tonnes and now harvests 1.2; the Sorocaba region rose from 1.0 to 2.4 million and is the state’s largest. Casa Branca leads, with 550,000 tonnes, followed by Botucatu and Avaré, and 82 municipalities have given up oranges. The bagasse, however, stays where the fruit becomes juice. The CP2B method places it in 14 municipalities with mills, and Matão, which harvests 108,000 tonnes, receives the largest potential: 22,752 m³ of biomethane a day, out of 101,834. Third plate of the collection “From field to biomethane”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state with municipalities coloured by orange production in 2024, in six classes from cream to dark red (up to 360 tonnes, up to 3,600, 11,000, 25,000, 64,000 and from 64,000 to 550,000). Dark red forms an arc from the north, near Colômbia, through the centre to the south-west, where Botucatu, Avaré and Iaras cluster; the west, the Paraíba valley and the coast are almost empty. Orange stripes mark the 82 municipalities that harvested oranges in 2008 and no longer do, scattered along the edges of the belt. Fourteen teal circles, sized by the biomethane the bagasse could give, sit in the centre-north of the state, around Matão, Araraquara and Bebedouro, away from the largest groves. Callouts: Casa Branca, 550,000 tonnes, the largest grower; Matão, 22,752 m³ a day, where oranges become juice."

recorte: "São Paulo state (SP)"
metodo: "Orange production from PAM 2024 by municipality in six quantile classes; stripes where there was harvested area in 2008 and none in 2024; circles with the bagasse biomethane potential at the accessible level of the CP2B method, allocated to the juice mills."
---

# Oranges in São Paulo, 2024, and the biomethane in the bagasse

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 047, the third of six in the collection **From field to biomethane**: the crop whose
residue does not stay in the grove, but at the juice mill.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `bagaco_nas_fabricas` | point | 14 municipalities that receive the bagasse in the CP2B method: `CD_MUN`, `NM_MUN`, `producao_2024_t` and `biometano_m3_dia`; one point inside each municipality |
| `municipios` | polygon | 645 municipalities: `CD_MUN`, `NM_MUN`, intermediate region, `area_km2`, `area_2008_ha`, `producao_2008_t`, `area_2024_ha`, `producao_2024_t`, `pct_area` (harvested area in 2024 ÷ municipal area, in %), `deixou` (harvested in 2008, not in 2024) and `biometano_m3_dia` |
| `regioes_intermediarias` | polygon | 11 intermediate geographic regions |
| `limite_estadual` | polygon | outline of the state |

The **GPKG** is zipped and attached to the
[`agro-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/agro-sp-2026).
The `municipios` layer carries three **QGIS styles**: `producao` (the default), `biometano` and
`deixou`; the point layer opens with the plate’s proportional circles.

The **CSV** holds the municipal table, in UTF-8, without geometry. An empty cell means no data;
0 means zero.

## Method

1. Table 1613 of the Municipal Agricultural Production survey on SIDRA: *Harvested area*
   (hectares) and *Quantity produced* (tonnes), product *Orange*, years 2008 to 2024, municipal
   level, São Paulo state. The panel’s columns add up the state’s harvested area year by year.
2. 2024 production in six quantile classes of the municipalities with positive production, with
   limits rounded to two significant figures.
3. Stripes: municipalities with harvested area above zero in 2008 and equal to zero in 2024.
4. Biomethane: potential of the *orange bagasse* substrate in the CP2B method v5.1 (Unicamp,
   version of 24/09/2026), reference scenario, level N4 (accessible), in m³ of biomethane
   equivalent per day. The method starts from the oranges harvested across the state and
   allocates the bagasse to the juice mills; that is why the circles sit where the mills are,
   not the groves.
5. State yield = production ÷ harvested area, in tonnes per hectare.

## Limitations

- The CP2B potential is modelled, not measured: it is the biomethane the bagasse would give if
  digested, after deducting the uses already competing for it (feed, pectin, essential oil) and
  collection losses.
- The allocation to mills is the method’s and may not match each mill’s current capacity.
- 77 municipalities have no data in the 2024 PAM, most of them in Greater São Paulo and on the
  coast.
- PAM counts groves in production; young trees not yet bearing fruit are not in the harvested
  area.

## Data licence

Open data from IBGE, free to use with attribution. The CP2B (Unicamp) potential is published here
with the centre’s permission; cite “CP2B (Unicamp), method v5.1, 2026”.
