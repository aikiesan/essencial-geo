---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Rubbish kilometres"
subtitulo: "Towns that send their rubbish far almost always reach a well-rated landfill; the poor ones serve towns that bury it at home"
contexto: >-
  Adding up the trips to the landfill, São Paulo’s waste covers 647 thousand tonne-kilometres a day in a straight line, 16.5 km per tonne. The capital accounts for 17%: of the 10,970 t/day it produces, 4,143 go to Caieiras, 27 km away, and the rest stays in town. Next come Ribeirão Preto, which takes its waste 43 km to Guatapará, then Sorocaba, Campinas, Mogi das Cruzes and Suzano. In 163 towns the waste travels over 40 km on average; they hold 13.1% of the state’s waste. The longest trip within the state is Apiaí–Iperó, 174 km. Of the 157 towns sending waste over 40 km to a landfill in SP, 149 reach landfills with an IQR of 9.1 to 10, and none an inadequate one. The 32 that use an inadequate landfill (IQR up to 7.0) use their own town’s; the largest is Votorantim’s, with 111 t/day and a score of 2.5.
imagem_alt: "Map of São Paulo state with its 645 municipalities coloured on a three-by-three grid that crosses the mean distance from waste to landfill (at home, up to 40 km, over 40 km) with the landfill’s score on CETESB’s 2023 IQR (up to 7.0, 7.1 to 9.0, 9.1 to 10). Blues mark well-rated landfills, ochres the middling ones and terracotta the inadequate ones; within each colour, the darker the shade, the farther the waste goes. The nine municipalities that landfill in another state are grey. Open rings, proportional to tonne-kilometres per day, mark the seats; the largest sits on the capital. Dark blue and beige alternate across the interior, and terracotta appears in isolated patches. Three callouts: Votorantim, with 111 t/day in a landfill scoring 2.5; Apiaí, whose waste travels 174 km to Iperó; and São Paulo, with 112,698 tonne-kilometres per day. The panel holds the legend grid with the number of municipalities in each colour and bars for the six municipalities with most tonne-kilometres."
metodo: "Straight-line distance from each municipality’s seat to the seat of its landfill’s municipality, weighted by the tonnages of CETESB’s 2023 inventory, crossed in nine colours with the landfill’s score (2023 IQR); rings proportional to tonne-kilometres per day."
---

# Rubbish kilometres: distance to the landfill and the landfill’s score in São Paulo

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 139, the second in the **Where the rubbish goes** collection. After the routes, the distance:
how far each town’s waste travels and what kind of landfill it reaches.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `rsu_t_dia`, `destinos`, `t_fora_dia`, `km_medio` (weighted by tonnes), `t_km_dia`, `iqr_2022`, `iqr_2023` (the worst destination), `enquadramento`, `classe_km` and `classe_iqr` (0 to 2; −1 outside the state), `faixa_km`, `faixa_iqr` |
| `toneladas_km` | point | 347 seats of municipalities that send waste away: `rsu_t_dia`, `km_medio`, `t_km_dia` |
| `limite_estadual` | polygon | state boundary |

The **GPKG** is zipped and attached to the
[`lixo-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/lixo-sp-2026).
The `municipios` layer carries the **QGIS style** with the plate’s nine colours, and `toneladas_km` the
proportional rings. The **CSV** sits in this folder, in UTF-8, with the municipal table without
geometry.

## Method

1. The records of plate 138: the annex of CETESB’s 2023 waste inventory, one per municipality and
   destination, with the IBGE codes of origin and destination.
2. Distance is geodesic, in a straight line, between the municipality’s seat and the seat of the
   landfill’s municipality (IBGE localities, 2022). Landfilling in the town itself counts as 0 km.
3. Tonne-kilometres per day = t/day × km for each record, summed by municipality. A municipality’s mean
   distance is that sum divided by its tonnes; the state figure (16.5 km) divides the 647,380 t·km by
   the 39,144.35 t/day.
4. The score is the 2023 IQR of the destination landfill. With two destinations, the lower one counts:
   that rule reproduces CETESB’s 604 municipalities in adequate condition and 32 in inadequate.
5. The grid crosses three distance classes (at home, up to 40 km, over 40 km) with three score classes
   (up to 7.0; 7.1 to 9.0; 9.1 to 10). The 7.0 cut-off is CETESB’s line between inadequate and adequate;
   the 40 km and 9.0 cut-offs are this plate’s, to set apart long trips and the highest scores.
6. The nine municipalities that landfill in another state are grey, outside the grid: CETESB does not
   score those landfills. They count among the 163 municipalities that send their waste more than 40 km
   on average.

## Limitations

- Tonnages are CETESB’s estimates (urban population times 0.7 to 1.1 kg per person per day; for the
  capital, the concession holders’ figures). CETESB warns that the inventory should not be used as a
  source of the quantities actually generated.
- The straight line between seats underestimates the trip: the landfill may lie far from the seat, and
  the lorry follows the road. Collection within the town and the lorry’s return are not counted either.
- Tonne-kilometres measure the load carried; they are neither cost nor emissions.
- The IQR is the score from CETESB’s inspection that year; landfills change score from year to year.
- Embu das Artes uses its own landfill, rated inadequate, and sends another part of its waste to
  Santana de Parnaíba. Under the lower-score rule it sits in the inadequate row and the «up to 40 km»
  column.

## Data licence

CETESB public data and IBGE open data, free to use with attribution.
