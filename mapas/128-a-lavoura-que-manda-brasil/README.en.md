---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The crop in charge"
subtitulo: "The crop with the largest area in each municipality"
contexto: >-
  In 1,582 of Brazil’s 5,571 municipalities, the crop with the largest area is soya. It covers 46.2 million hectares, nearly half of the 97.3 million planted in the country, and leads from Rio Grande do Sul to Roraima. Maize leads in 1,222 municipalities and sugarcane in 752, almost all in inland São Paulo, the Triângulo Mineiro and the north-eastern Zona da Mata. In the Northeast and the North come beans, cassava, cashew and cocoa; in the hills of Minas Gerais, coffee. Sorriso (MT) has the country’s largest soya field, 600,000 hectares, and Uruguaiana (RS) grows almost only rice. Every crop leaves straw, bagasse, husks and cobs: the biomass that comes after the harvest.
imagem_alt: "Choropleth map of Brazil in Albers conic projection, with the 5,571 municipalities shaded by the crop with the largest area in 2024: olive for soya, yellow for maize, dark green for sugarcane, terracotta for beans, beige for cassava, brown for coffee, light green for banana, blue for rice, purple for cocoa, pink for cashew nut, orange for orange and grey for other crops. Soya covers the Centre-West, western Bahia, Matopiba and the South; maize spreads through Paraná, Minas Gerais and the Northeast; cane forms a patch in inland São Paulo and a strip along the north-eastern coast. Two callouts: Sorriso, in Mato Grosso, with 600,000 hectares of soya, the country’s largest field, and Uruguaiana, in Rio Grande do Sul, with 94% of its crop area in rice. The panel lists the crops with the number of municipalities each one leads and its area in Brazil."
metodo: "For each municipality, the crop with the most hectares in 2024 among temporary crops (planted area) and permanent crops (area for harvest) in the Municipal Agricultural Production survey; the eleven that lead in the most municipalities get their own colour."
---

# The crop in charge: the crop with the largest area in each municipality

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 128, the third in the **Biomass monitor** collection. Every crop leaves residue in the
field and at the mill; before measuring the residue, the map shows which crop holds the land.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 5,571 municipalities: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `area_lavouras_ha`, `lavoura_lider` (PAM name), `area_lider_ha`, `parcela_lider` (%), `grupo`, `area_soja_ha`, `area_milho_ha`, `area_cana_ha` |
| `ufs` | polygon | 27 states, with their region |
| `limite_nacional` | polygon | national boundary |

The **GPKG** is zipped and attached to the
[`biomassa-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/biomassa-br-2026).
The `municipios` layer carries the plate’s **QGIS style**. The **CSV** sits in this folder, in
UTF-8, with the same table without geometry.

## Method

1. Planted area of temporary crops (SIDRA, table 1612) and area for harvest of permanent crops
   (table 1613), in 2024, by municipality, in hectares. Coffee enters only as its total, without
   the arabica and robusta parts.
2. The leading crop is the one with the largest area in the municipality. The eleven that lead in
   the most municipalities have their own colour; the others (açaí, tobacco, wheat, cotton,
   sorghum and more) are grey, with the name in the `lavoura_lider` column.
3. «No crops» are the 60 municipalities with zero area in every crop; the 8 missing from the
   tables are shown as no data.
4. The panel areas add up the whole country, including where the crop does not lead.

## Limitations

- Planted area counts twice the land with two harvests a year (soya followed by second-crop
  maize); the ranking compares areas, not output or value.
- Pasture and planted forest are not crops in the PAM and are left out (forest is on plate 130).
- The PAM is a municipal estimate made with local informants.

## Data licence

IBGE open data, free to use with attribution.
