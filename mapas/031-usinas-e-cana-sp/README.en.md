---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Mills and cane"
subtitulo: "The harvest that lights the grid"

contexto: >-
  After crushing, sugarcane bagasse goes into the boiler, and the steam makes the mill’s own electricity plus a surplus for the grid. In São Paulo, 211 bagasse power stations are registered with ANEEL, 206 of them in operation, with 6.18 GW of licensed capacity; the largest, Barra Bioenergia in Barra Bonita, has 136 MW. Over the map of cane harvested in 2024, the circles show that the energy is born where the crop is: the 140 municipalities with at least one such station accounted for 48.8% of the cane harvested in the state. There, between cane field and substation, waste becomes grid. Final plate of the collection “Bioenergy in São Paulo”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state with municipalities coloured by cane production in 2024, on a light ramp from cream to olive green, and clay-coloured circles, proportional to capacity, marking 211 sugarcane-bagasse power stations; the five being built are hollow. The circles cover the north, centre and west of the state, where cane is densest, and thin out in the east, the Ribeira valley and Greater São Paulo. An arrowed callout picks out the largest station, Barra Bioenergia (136 MW)."

recorte: "São Paulo state (SP)"
metodo: "SIGA bagasse power stations, by licensed capacity, over PAM 2024 cane production by municipality, in six quantile classes."
---

# Mills and cane — bagasse power stations over cane production in São Paulo

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 031, the last of four in the collection **Bioenergy in São Paulo**: after biogas,
livestock and cane, where cane-field waste becomes electricity.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `ute_bagaco` | point | 211 SIGA bagasse power stations: `nome`, `ceg`, `fase`, `potencia_kw` (licensed), `potencia_fiscalizada_kw`, `inicio_operacao`, `proprietario`, municipality |
| `usinas_epe_2018` | point | 161 mills from the EPE WebMap: `tipo`, `situacao`, `classe_moagem_t_safra`, `etanol_anidro_m3_dia`, `etanol_hidratado_m3_dia`, `inicio`, municipality |
| `municipios` | polygon | 645 municipalities: `producao_t` (cane, PAM 2024), `ute_bagaco_n` and `ute_bagaco_kw` |
| `regioes_intermediarias` | polygon | 11 intermediate geographic regions |
| `limite_estadual` | polygon | outline of the state |

The **GPKG** is zipped and attached to the
[`bioenergia-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/bioenergia-sp-2026).
Its **QGIS styles** match the plate: municipalities on the light production ramp, power stations as
circles proportional to capacity (hollow while being built). The EPE layer comes with small
crosses, so you can check which sugar-energy mills have no registered power station.

The **CSV** lists the 211 power stations, with longitude and latitude in decimal degrees, in UTF-8.

## Method

1. SIGA (ANEEL) power stations fuelled by *Bagaço de Cana de Açúcar* in São Paulo, in the version
   published by MapBiomas; licensed capacity in kW.
2. Sugarcane production by municipality from PAM table 1612 (2024), joined to IBGE’s 2025
   Municipal Mesh by the seven-digit code; six quantile classes of producing municipalities, limits
   rounded to two significant figures.
3. Each power station receives the municipality it falls in, by spatial join. The share of cane in
   municipalities with a station is the sum of those municipalities’ production divided by the
   state total.
4. Sugar-energy mills from the EPE WebMap (2018), also via MapBiomas, clipped to São Paulo.

## Limitations

- Licensed capacity is what is authorised, not what is generated; this ANEEL database does not say
  how much each station exports to the grid.
- Cane ignores municipal boundaries: a mill crushes cane from several neighbouring municipalities,
  and the 48.8% share does not say where each mill’s cane comes from.
- This SIGA version runs to June 2022; the EPE layer is from 2018. They share no identifier.
- Nothing here estimates available bagasse: that would need coefficients that are not in the tables.
