---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Fire moved"
subtitulo: "The same number of hotspots, closer to the cane"
contexto: >-
  INPE’s reference satellite recorded 23,605 hotspots in São Paulo state from 2003 to 2007 and 23,569 from 2020 to 2024: 1.9 per 100 km² per year in both periods. The total stayed the same, but the place changed. In the Sorocaba intermediate region, with 3% of its land in cane, hotspots fell by 55%; in the Ribeirão Preto and São José do Rio Preto regions, where cane covers half and 39% of the land, they rose by 47%. In municipalities with under 10% cane, density fell by 32%; in those with 25% to 50%, it rose by 32%. Part of the tie comes from 2024, the series’ record year, with 8,712 hotspots: comparing 2003–2006 with 2020–2023, the state has 22% fewer hotspots, but the cane north stays level while the rest falls. Straw burning was phased out by State Law 11,241/2002 and the 2007 Agro-environmental Protocol; the plate shows where fire is, not what caused it. A hotspot is not burned area.
imagem: ./mapa_preview.en.png
imagem_alt: "Choropleth map of the municipalities of São Paulo state with the change in hotspots per 100 km² per year between 2003–2007 and 2020–2024, in seven classes: blues for fewer hotspots, near white for little change and terracotta for more hotspots. A thick black outline marks the municipalities with half or more of their land in cane in 2024. Terracotta covers the north and north-west, from Ribeirão Preto to São José do Rio Preto and Araçatuba; blues cover the south and south-east, from the Ribeira valley to the Sorocaba region, darkest in the upper Ribeira. Two callouts: Itapirapuã Paulista, with no cane, from 194 to 5 hotspots; Lourdes, with 41% of its land in cane, from 11 to 72. The panel holds the legend, columns of hotspots in each year from 2003 to 2024 with the Agro-environmental Protocol and law milestones, and bars of hotspot density in both periods by cane band."
metodo: "INPE reference-satellite hotspots in 2003–2007 and 2020–2024, counted by municipality and divided by area and by the five years; the colour is the difference between the two periods; the outline marks the municipalities with half or more of their land in cane in 2024 (MapBiomas)."
---

# Fire moved: hotspots by municipality in São Paulo, 2003–2007 and 2020–2024

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 143, the third in the **Biomass gone up in smoke** collection. The same number of hotspots
in both five-year periods, on a different map: fewer in the south and south-east, more in the cane
north.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `CD_MUN`, `NM_MUN`, `CD_RGINT`, `NM_RGINT`, `area_km2`, `pct_cana_2024`, `faixa_cana`, `focos_2003_2007`, `focos_2020_2024`, `focos_100km2_ano_2003_2007`, `focos_100km2_ano_2020_2024`, `diferenca_100km2_ano` (2020–2024 minus 2003–2007), `razao` (2020–2024 hotspots ÷ 2003–2007 hotspots; empty if there were none in the first period), `classe_diferenca` (0 to 6) |
| `cana_metade_ou_mais` | polygon | 16 contiguous patches of the municipalities with 50% or more of their land in cane in 2024 |
| `regioes_intermediarias` | polygon | 11 IBGE intermediate regions: `focos_2003_2007`, `focos_2020_2024`, `razao`, `pct_cana`, `razao_sem_2024` (2020–2023 hotspots ÷ 2003–2006 hotspots) |

The **GPKG** is zipped and attached to the
[`fogo-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/fogo-sp-2026),
with the plate’s **QGIS styles**. The **CSV** sits in this folder, UTF-8, with the municipalities table
without geometry. Field names are in Portuguese (`focos` hotspots, `cana` sugarcane, `razao` ratio).

## Method

1. Hotspots from INPE’s annual reference-satellite files (BDQueimadas), with `estado` equal to
   “SÃO PAULO”, joined to their municipality in the IBGE 2025 Municipal Mesh by the point: 87,730
   hotspots from 2003 to 2024, all from the afternoon pass.
2. For each municipality, the hotspots of 2003–2007 and of 2020–2024, divided by the municipality’s area
   (km²) and by five years. The colour is the difference, in seven classes (breaks at ±0.5, ±1.5 and ±3
   hotspots per 100 km² per year). The absolute difference keeps municipalities with few hotspots in
   the first period from showing jumps of several times.
3. Share in cane: area of MapBiomas class 20 (sugarcane), collection 10, 2024, over the municipality’s
   total area, from the area-by-municipality table counted at 30 m. The bands are under 10%, 10% to
   25%, 25% to 50% and 50% or more.
4. The panel’s columns are the state’s hotspots in each year; the two five-year periods in dark. The
   milestones are dates in the rules on cane-straw burning (see below); they are there for reference,
   not as a cause.
5. **Check without 2024.** 2024 is the year with most hotspots in the series (8,712, 37% of
   2020–2024). Comparing 2003–2006 with 2020–2023, the state goes from 19,129 to 14,857 hotspots
   (−22%). The Sorocaba region keeps 0.40 times the first period’s hotspots; Ribeirão Preto and São
   José do Rio Preto, 1.06; Araçatuba, 1.02. The change of place holds; the tie in the total does not.
6. **Side test: cane under the hotspots, year by year.** With the same collection’s annual cane maps
   (cane fraction in 120 m cells) and the same ~1 km² window as plate 141, the share of cane around the
   hotspots was above the share of cane in the state’s area in every year: from 1.15 times (2023) to
   1.90 times (2005); 1.4 in 2007, 1.5 in 2014 and 1.6 in 2024. There is no visible drop after the
   Protocol. The values are in `fogo-sp-lugar.json` (the pipeline cache), not in the downloadable files.

### The rules on straw burning

- **State Law 11,241 of 19 September 2002**, regulated by Decree 47,700/2003: gradual end of cane-straw
  burning, by 2021 on mechanisable land and by 2031 on non-mechanisable land (slopes over 12%).
- **Agro-environmental Protocol of the sugar-energy sector (2007)**, a voluntary agreement between the
  state government and UNICA and, later, the cane suppliers: it brought the deadlines forward, for
  signatories, to 2014 on mechanisable land and 2017 elsewhere.

The plate does not test the effect of these rules. Hotspots combine authorised burning, illegal
burning and wildfire, in cane and outside it, and the period mixes these changes with the expansion of
cane (from 14% of the state in 2003 to 24% in 2024 on the 120 m annual maps, which round cane slightly
upwards) and with dry and wet years.

## Limitations

- **A hotspot is not burned area.** It is a ~1 km pixel where the sensor saw active fire during the
  satellite pass. A large fire can produce dozens of hotspots; a short, night-time, cloud-covered or
  small fire may produce none.
- The share in cane is 2024’s. In 2003 cane covered 14% of the state, on the annual maps: many
  municipalities in the higher bands were not, then, as given over to cane.
- The pass time has drifted later in recent years (more hotspots at 17:00 and 18:00 UTC in 2020–2024),
  which may change how much of the afternoon fire the satellite sees.
- In small municipalities, a few hotspots change the density a lot.

## Data licence

INPE hotspots and IBGE municipal mesh: open data, free to use with attribution. MapBiomas data under a
CC BY 4.0 licence; cite “MapBiomas Project — Collection 10 of the Annual Series of Land Use and Land
Cover Maps of Brazil”.
