---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The month of fire"
subtitulo: "The season gathered at the end of the dry months"
contexto: >-
  From 2003 to 2007, when cane straw was still burnt at harvest, the mean date of hotspots in São Paulo state fell on 5 August; from 2020 to 2024 it fell on 23 August, 18 days later, with almost the same number of hotspots (23,605 and 23,569). The season gathered: August and September went from 40% to 63% of hotspots, and hotspots from May to July fell from 8,232 to 4,701. Of the 367 municipalities with a clear fire season in both periods, 262 now burn later; the median moved 15 days. Without 2024, the series’ record year, the change holds: from 5 August (2003–2006) to 22 August (2020–2023). The mean date also varies widely from year to year, even in recent years (23 July in 2018, 31 August in 2020), and the plate does not separate the causes. A hotspot is active fire seen from the satellite, not burned area.
imagem: ./mapa_preview.en.png
imagem_alt: "Plate with three maps of São Paulo state and a notes panel. In the first two, each municipality takes the colour of its mean hotspot date on a circular palette of the year: pale beige in summer, blues in autumn, purple in June, wine in July, red in August, orange in September and light orange in October; municipalities with fewer than 10 hotspots or no clear season are hatched. In 2003–2007 wine and purple prevail; in 2020–2024, red and orange. The third map shows how many days the mean date moved, from blue (earlier) to terracotta (later): terracotta in the north and west, blues in the south, in the Sorocaba region, and near the capital. The fourth panel holds a fire clock with each month’s share of hotspots in both periods and the state’s mean dates, 5 August and 23 August. The side panel shows the state’s mean date year by year, from 2003 to 2024, and columns with the share of each year’s hotspots that fell from May to July."
metodo: "INPE reference-satellite hotspots in 2003–2007 and 2020–2024; for each municipality and period, the circular mean of the dates (day of year as an angle); municipalities with fewer than 10 hotspots or no clear season (Rayleigh test, p ≥ 0.05) are hatched."
---

# The month of fire: mean hotspot date in São Paulo, 2003–2007 and 2020–2024

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 142, the second in the **Biomass gone up in smoke** collection. Not how much burns, but
when: the fire calendar of each municipality, before and after the end of cane-straw burning.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `CD_MUN`, `NM_MUN`, `CD_RGI`, `NM_RGI`, `CD_RGINT`, `NM_RGINT`, `area_km2` and, for each period (`_2003_2007`, `_2020_2024`): `focos_` (hotspots), `dia_medio_` (day of year, 1 to 365), `data_media_` (dd/mm), `concentracao_` (mean resultant length, 0 to 1), `p_rayleigh_`, `estacao_` (true with 10 or more hotspots and p < 0.05); plus `deslocamento_dias` (shift in days) and `classe_deslocamento` (0 to 6) |
| `focos` | point | 47,174 hotspots of both periods: `foco_id`, `periodo`, `ano`, `data`, `hora_utc`, `lat`, `lon`, `CD_MUN`, `NM_MUN` |
| `limite_estadual` | polygon | state outline |

The **GPKG** is zipped and attached to the
[`fogo-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/fogo-sp-2026).
The `municipios` layer carries three **QGIS styles**: the 2020–2024 mean date (default), the 2003–2007
one, in 24 half-months on the plate’s palette, and the shift in days. The **CSV** sits in this folder,
UTF-8, with the municipalities table without geometry.

## Method

1. Hotspots from INPE’s annual reference-satellite files (BDQueimadas), with `estado` equal to
   “SÃO PAULO”, joined to their municipality in the IBGE 2025 Municipal Mesh by the point. All come
   from the afternoon pass (16:00–18:00 UTC), so the UTC date is the local date.
2. Two five-year periods: **2003–2007**, when straw burning was still common in the cane harvest, and
   **2020–2024**, after the Agro-environmental Protocol deadlines (2014 and 2017) and the State Law
   11,241/2002 deadline for mechanisable land (2021). The choice of windows is this plate’s.
3. **Circular mean.** Each date becomes an angle on the circle of the year (2π × (day of year − 0.5) ÷
   days in the year), and the mean date is the direction of the mean vector, converted back to a
   365-day calendar. So 30 December and 2 January sit close together, not half a year apart. The
   length of the mean vector (`concentracao`, 0 to 1) tells how tightly the dates gather around the mean.
4. **Clear season.** The Rayleigh test (Zar’s approximation) checks whether the dates spread over the
   year with no direction. A municipality enters a period’s map if it has **10 or more hotspots** and
   **p < 0.05**; the others are hatched. In 2003–2007 there were 440 municipalities with a season, 148
   with fewer than 10 hotspots and 57 with no clear season; in 2020–2024, 452, 172 and 21.
5. **Shift.** In the 367 municipalities with a season in both periods, the difference between the
   mean dates, from −182 to +182 days (half a year either way), in seven classes (breaks at ±10, ±30
   and ±60 days).
6. The clock in the fourth panel shows each period’s share of hotspots in each month of the year
   (2003–2007 as outline, 2020–2024 in colour) and the state’s mean dates. The side panel shows the
   state’s mean date in each year from 2003 to 2024 and the share of each year’s hotspots that fell
   from May to July (34.9% in 2003–2007, 19.9% in 2020–2024; 56% in 2018).
7. **Check without 2024.** 2024 had 8,712 hotspots, 37% of those in 2020–2024, 70% of them in August
   and September. Comparing four years with four, 2003–2006 gives 5 August and 2020–2023 gives
   22 August; August and September go from 40.8% to 57.9% of hotspots.

## Limitations

- **A hotspot is not burned area.** It is a ~1 km pixel where the sensor saw active fire during the
  satellite pass. A large fire can produce dozens of hotspots; a short, night-time, cloud-covered or
  small fire may produce none. A burn that starts and ends between two passes does not appear.
- A municipality’s mean date weighs every hotspot equally: a single large fire can pull it.
- The pass time has drifted later in recent years (more hotspots at 17:00 and 18:00 UTC in 2020–2024),
  which may change how much of the afternoon fire the satellite sees.
- The state’s mean date varies widely from year to year (from 3 July in 2009 to 2 September in 2012);
  five years on each side dampen this variation but do not remove it. The plate shows the change in
  the calendar, not its cause.

## Data licence

INPE hotspots and IBGE municipal mesh: open data, free to use with attribution.
