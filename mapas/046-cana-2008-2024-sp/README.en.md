---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Cane: 2008 × 2024"
subtitulo: "In sixteen years, the patch moved west"

contexto: >-
  In 2008, São Paulo’s cane fields were harvested over 4.53 million hectares; in 2024, over 5.40 million, 19% more, and cane went from 18.3% to 21.7% of the state’s territory. Harvested area peaked in 2017, at 5.69 million hectares, and has been slowly receding since. The plate sets the two years side by side, with the same classes, and maps the difference: 150 municipalities gained more than 10 percentage points of territory under cane, 104 of them in the São José do Rio Preto, Araçatuba and Presidente Prudente regions, in the west; Rancharia harvested 47,812 hectares more. The Campinas region was the only one to lose much: 63,632 hectares fewer, with the steepest falls in Nova Odessa and Sumaré. Second plate of the collection “From field to biomethane”.

imagem: ./mapa_preview.en.png
imagem_alt: "Three maps of São Paulo state and a notes panel. The top two show, for 2008 and 2024, the share of each municipality’s territory harvested as cane, in six classes from cream to dark green (up to 5%, 5 to 15%, 15 to 30%, 30 to 45%, 45 to 60% and over 60%). In 2008 the dark green is concentrated in the north-east of the state; in 2024 the middle tones also spread across the west and north-west. The third map shows the change in percentage points, from brown (loss of more than 10 points) to blue-green (gain of more than 20): the west and north-west turn green, and brown patches appear in the centre and around Campinas. Balbinos and São João do Pau d’Alho, the largest gains, and Nova Odessa, the largest loss, are named."

recorte: "São Paulo state (SP)"
metodo: "Harvested cane area from PAM in 2008 and 2024 divided by municipal area, in the same six classes for both years; the change is given in percentage points of territory."
---

# Sugarcane in São Paulo, 2008 and 2024

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 046, the second of six in the collection **From field to biomethane**: before measuring
the gas the residues could give, a look at how the crop that leaves the most residue has moved
across the state.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `CD_MUN`, `NM_MUN`, intermediate region, `area_km2`, `area_2008_ha`, `area_2024_ha`, `producao_2008_t`, `producao_2024_t`, `pct_2008` and `pct_2024` (harvested area ÷ municipal area, in %) and `var_pp` (change, in percentage points) |
| `regioes_intermediarias` | polygon | 11 intermediate geographic regions |
| `limite_estadual` | polygon | outline of the state |

The **GPKG** is zipped and attached to the
[`agro-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/agro-sp-2026),
together with those of the other plates in the collection.

The `municipios` layer carries three **QGIS styles**: `parte_2024` (the default), `parte_2008`
and `variacao`. To switch, open the layer properties and pick the style under *Style › Styles*.

The **CSV** holds the same table, in UTF-8, without geometry. An empty cell means no data; 0 means
zero as declared by IBGE.

## Method

1. Table 1612 of the Municipal Agricultural Production survey on SIDRA: *Harvested area*
   (hectares) and *Quantity produced* (tonnes), product *Sugarcane*, years 2008 to 2024,
   municipal level, São Paulo state.
2. Joined to IBGE’s 2025 Municipal Mesh by the seven-digit code. The state has the same 645
   municipalities in both years.
3. Share of territory = harvested area ÷ (official municipal area × 100), in %. Fixed classes,
   the same on both maps: up to 5%, 5 to 15%, 15 to 30%, 30 to 45%, 45 to 60% and above 60%.
4. Change = share in 2024 − share in 2008, in percentage points, in six classes: loss of more than
   10, loss of 3 to 10, stable (±3), gain of 3 to 10, of 10 to 20 and of more than 20.
5. The panel’s columns add up the state’s harvested area year by year, from 2008 to 2024.

## Limitations

- Harvested area is not planted area: fields being replanted or not cut in the year are left out.
- The 2025 municipal area is used for both years; boundary changes between municipalities since
  2008 are not corrected.
- 53 municipalities have no data in 2008 and 45 in 2024, most of them in Greater São Paulo and on
  the Santos coast; the change is computed only where both years exist.
- In small municipalities, a few thousand hectares shift many percentage points. That is why the
  panel lists the largest gains in points, and the factsheet the largest in hectares.
- The plate does not say what was there before the cane or what replaced it; that takes a land
  use and land cover map.

## Data licence

Open data from IBGE, free to use with attribution.
