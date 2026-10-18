---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Drainage network"
subtitulo: "Rivers that turn their backs on the sea"

contexto: >-
  The Tietê rises 12.5 km from the sea and runs 982 km the other way, inland, to the Paraná. It is not alone: 85.7% of the area drained by São Paulo’s rivers flows inland and on down the Paraná to the River Plate, between Argentina and Uruguay. The Serra do Mar and the Mantiqueira divide the waters. Only the coastal strip, the Ribeira de Iguape and the Paraíba do Sul valley send their rain straight to the Atlantic, through 123 river mouths on the São Paulo coast. The map draws 61,009 km of rivers, each reach as wide as its mean discharge: from headwater streams to the Paraná on the state border, with 8,490 m³/s. Second plate of the collection “Water in São Paulo”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of the state of São Paulo with the HydroRIVERS river network drawn as threads that thicken with mean discharge. Rivers flowing inland, towards the River Plate basin, are dark blue and cover almost the whole state, in a fan of tributaries running north-west to the Paraná on the border; those flowing straight to the Atlantic, in clay red, fill the Paraíba do Sul valley, the coast and the Ribeira valley. The Tietê is highlighted, with its name written mid-course. Outside the state, the larger rivers appear in grey. Two callouts: the Tietê’s source, 12.5 km from the sea, and the largest mean discharge, 8,490 m³/s, on the Paraná. In the panel, the slope legend, a width scale by discharge, and bars with the kilometres of river by Strahler order."

recorte: "State of São Paulo (SP)"
metodo: "HydroRIVERS reaches clipped to São Paulo, with width by modelled mean discharge and slope by the outlet of the river system; the Tietê traced from mouth to source along the reach with the largest upstream area."
---

# São Paulo’s drainage network and the two slopes of its water

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 037, the second of three in the collection **Water in São Paulo**: after the outline of
the basins, the rivers that run inside them, and where they go.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `rios` | line | 16,999 reaches: `hyriv_id`, `next_down` (next reach downstream), `main_riv` (outlet of the system), `length_km`, `dist_dn_km` and `dist_up_km` (distance to the outlet and to the farthest source), `catch_skm` (local catchment), `upland_skm` (upstream area), `dis_av_cms` (mean discharge, m³/s), `ord_stra` (Strahler order), `vertente` (slope: `prata` or `atlantico`) |
| `tiete` | line | the Tietê traced from mouth to source: `nome`, `comp_km` |
| `limite_estadual` | polygon | outline of the state |

The **GPKG** is zipped and attached to the
[`agua-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/agua-sp-2026).
The `rios` layer carries the plate’s **QGIS style**: blue for the Plate, clay for the Atlantic, and
width growing with Strahler order.

The **CSV**, also in the release, holds the reach table in UTF-8, without geometry; fields keep
their HydroRIVERS names, in lower case.

## Method

1. River reaches from HydroRIVERS v1.0 (South America), read within the state’s window. The
   dataset is derived from HydroSHEDS terrain at 15 arc-seconds (about 500 m) and includes rivers
   with a catchment of at least 10 km² or a mean discharge of at least 0.1 m³/s.
2. Clipped to the state boundary widened by 1.5 km, so as not to cut the rivers that run along the
   border (Paraná, Grande, Paranapanema). Outside the state, rivers of order 3 or more are drawn in
   grey, as context only.
3. **Slope**: a reach belongs to the Plate when its river system (`main_riv`) ends at the same
   outlet as the Paraná trunk; the others flow straight to the Atlantic.
4. **Tietê**: starting from the Paraná tributary whose mouth lies near Itapura, with 72 thousand km²
   upstream, the trace climbs upriver, always taking the reach with the largest upstream area, up
   to the source. The distance to the sea is the shortest distance from the source to the coast.
5. Lengths measured on the ellipsoid, only inside the state boundary. The share of area flowing
   each way adds up the local catchments of reaches whose midpoint falls in São Paulo.
6. On the plate, each reach’s width grows with the logarithm of its mean discharge.

## Limitations

- HydroRIVERS is a global model: its courses follow 500 m terrain, simplify meanders and may shift a
  river by a few hundred metres. The Tietê’s 982 km fall slightly short of official measurements,
  which follow the detailed course.
- **Mean discharge** is modelled (WaterGAP) for the 1971–2000 climate, without dams, transfers or
  abstractions: the Upper Tietê water pumped into the Billings reservoir and over the Serra do Mar
  does not appear, and the Tietê runs whole towards the interior.
- The Tietê’s source is that of the HydroRIVERS trace, which starts where the catchment passes
  10 km²; the recognised spring, at Salesópolis, lies a few kilometres from it.
- Streams with catchments under 10 km² are left out: the real network, like the one in the Campinas
  riparian reserves plate, is much denser.
- The split between slopes holds for rainwater on the natural terrain, not for water piped through
  the cities.
