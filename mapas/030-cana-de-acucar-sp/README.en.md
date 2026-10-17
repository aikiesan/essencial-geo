---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Sugarcane"
subtitulo: "Bioenergy in São Paulo, 3/4"

contexto: >-
  In 2024, São Paulo’s cane fields were harvested over 5.40 million hectares, 21.7% of the state, and yielded 418.6 million tonnes of cane. In 88 municipalities the harvested area exceeds half the territory; in Areiópolis it reaches 82%, and in Jaboticabal 81%. The map shows the dark patch that covers the north and centre of the state and has Morro Agudo as its largest producer (7.0 million tonnes), and it shows where the patch ends: in the Paraíba valley, the Ribeira valley and Greater São Paulo, cane all but disappears. Every tonne harvested leaves bagasse and straw, and every litre of ethanol leaves vinasse; this is the map São Paulo’s bioenergy rests on. Third plate of the collection “Bioenergy in São Paulo”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state with municipalities coloured by the share of their territory under harvested cane in 2024, in six classes of the viridis palette, from yellow (up to 4.1%) to dark purple (51% to 82.1%). A continuous purple patch covers the north and centre of the state; the east, the Ribeira valley and Greater São Paulo are yellow, grey (zero) or hatched (no data). The five largest producers are named: Morro Agudo, Barretos, Guaíra, Jaboticabal and Rancharia."

recorte: "São Paulo state (SP)"
metodo: "Harvested area and production of sugarcane from PAM 2024 joined to the Municipal Mesh by IBGE code; harvested area divided by municipal area, in six quantile classes."
---

# Sugarcane — harvested area and production in São Paulo, 2024

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 030, the third of four in the collection **Bioenergy in São Paulo**: the crop that,
once harvested, leaves most of the state’s biomass in the field and at the mill.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `CD_MUN`, `NM_MUN`, intermediate region, `area_km2`, `area_colhida_ha`, `producao_t`, `pct_area` (harvested area ÷ municipal area, in %) and `rendimento_t_ha` |
| `regioes_intermediarias` | polygon | 11 intermediate geographic regions |
| `limite_estadual` | polygon | outline of the state |

The **GPKG** is zipped and attached to the repository’s
[`bioenergia-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/bioenergia-sp-2026),
together with those of the other plates in the collection.

The GPKG carries its own **QGIS styles**. The `municipios` layer has two:
`parte_do_territorio` (the default, matching the plate) and `producao` (tonnes harvested, in six
quantile classes). To switch, open the layer properties and pick the other style under
*Style › Styles*. Zero shows in light grey and “no data” in white, each with its own line in the
legend.

The **CSV** holds the same municipal table, in UTF-8, without geometry. In both files an empty
cell (NULL) means no data, and 0 means a zero reported by IBGE.

## Method

1. Table 1612 of the Municipal Agricultural Production survey on SIDRA: variables *Área colhida*
   (hectares) and *Quantidade produzida* (tonnes), product *Cana-de-açúcar*, year 2024,
   municipal level, São Paulo state.
2. Joined to IBGE’s 2025 Municipal Mesh by the seven-digit code.
3. Share of territory = harvested area ÷ (official municipal area × 100), in %, to two decimal
   places. Yield = production ÷ harvested area.
4. Classes: six quantiles of the municipalities with a positive harvested area; limits are
   rounded to two significant figures, and the last one is the observed maximum. The table’s
   “-” symbol (absolute zero) becomes 0; “...” and municipalities missing from the table become
   no data.
5. Intermediate regions and the state boundary are dissolved from the municipalities.
6. On the plate, geometries are simplified as a coverage; the downloadable files keep IBGE’s
   original geometry.

## Limitations

- Harvested area is not planted area: fields being replanted or left uncut that year are
  excluded, so cane’s real footprint tends to be larger than the map shows.
- PAM is reported by municipality and does not say where, within it, the fields lie; for that,
  use a land use and land cover map.
- 45 municipalities have no data, most of them in Greater São Paulo and on the Santos coast; another
  92 report zero.
- The plate does not compute bagasse, straw or vinasse: those figures depend on coefficients that
  are not in IBGE’s table.
