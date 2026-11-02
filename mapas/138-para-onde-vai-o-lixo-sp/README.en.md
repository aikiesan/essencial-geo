---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Where each town’s rubbish goes"
subtitulo: "Over half the rubbish leaves its home town; nearly half ends up in five municipalities"
contexto: >-
  By CETESB’s estimate, São Paulo state’s 645 municipalities produce 39.1 thousand tonnes of urban waste a day. In 347 of them, all or part of it goes to a landfill in another town; the other 298 bury everything at home. Together these trips take 21.0 thousand t/day, 54% of the state’s waste, out of the municipality where it was produced. Arrival is concentrated: the landfills of São Paulo, Caieiras, Paulínia, Mauá and Guarulhos take 48.8% of the state’s waste, and the ten largest destinations 64%. Caieiras receives 5.5 thousand t/day from 19 municipalities, 74 times what it produces; Jambeiro, in the Paraíba Valley, receives 1.2 thousand t/day, 561 times its own waste. The largest single flow runs from the capital to Caieiras: 4.1 thousand t/day over 27 km. Nine municipalities landfill in another state, and Ribeira’s waste travels 184 km as the crow flies to Rio Negrinho (SC).
imagem_alt: "Map of São Paulo state in transverse Mercator projection. Municipalities that send waste to another town are beige; those that bury all of it at home are light grey. Curved blue lines join each municipality’s seat to the seat of the landfill’s municipality, with width proportional to tonnes per day; clay-coloured lines lead to other states. Circles proportional to the waste landfilled mark the destinations: ochre for those that take waste from other towns, graphite for those that bury only their own. The fans of lines converge on hubs labelled with the number of towns served, such as Catanduva and Paulínia (30), Piratininga (28) and Onda Verde (20). An inset enlarges Greater São Paulo and the Santos coast, where a thick band joins the capital to Caieiras. Three callouts: Paulínia, with 2,621 t/day from 30 municipalities; Jambeiro, which receives 561 times the waste it produces; and Ribeira, whose waste travels 184 km to Rio Negrinho (SC). The panel holds the key figures and bars for the seven largest destinations, split between the town’s own waste and waste from outside."
metodo: "Annex of CETESB’s 2023 waste inventory read from the PDF and checked against the report’s totals; each municipality joined to its landfill’s municipality by a line between seats, with width proportional to tonnes per day."
---

# Where each town’s rubbish goes: the routes of urban waste in São Paulo

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 138, the first in the **Where the rubbish goes** collection. The starting point: which
municipality each São Paulo town’s waste leaves from, and where it is buried.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `agencia`, `ugrhi`, `rsu_t_dia` (waste generated), `destinos`, `exporta`, `t_fora_dia` (taken to another town), `km_medio`, `iqr_2023` (the worst destination), `enquadramento` |
| `fluxos` | line | 349 flows to another municipality: `cd_mun`, `nm_mun`, `cd_destino`, `nm_destino`, `uf_destino`, `local_destino` (as in the inventory), `tipo_destino` (private, public, other state), `rsu_t_dia`, `km_reta`, `iqr_2023` |
| `destinos` | point | 305 municipalities with a landfill, at the seat: `t_recebida`, `municipios` (served), `de_outros`, `t_propria`, `t_de_outros`, `t_gerada`, `vezes_o_que_gera`, `locais`, `iqr_2023`, `recebe_de_outros` |
| `limite_estadual` | polygon | state boundary |

The **GPKG** is zipped and attached to the
[`lixo-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/lixo-sp-2026).
The layers carry the plate’s **QGIS styles**: flows with width proportional to tonnes and destinations
with circles proportional to the waste received. The **CSV** sits in this folder, in UTF-8, with the 649
annex records (one per municipality and destination), IBGE codes, straight-line distance and
tonne-kilometres per day.

## Method

1. The inventory annex that lists municipalities alphabetically gives, for each one, the environmental
   agency, the water-management unit (UGRHI), waste in t/day, the 2022 and 2023 IQR of the disposal site
   and the field «dispõe em» (disposes at). It was read from the PDF with `pdftotext` (xpdf, `-table`
   mode) and checked against the totals printed in the report: 39,038.08 t/day landfilled in SP, of which
   38,402.69 in adequate landfills and 635.39 in inadequate ones; 604 municipalities in adequate
   condition and 32 in inadequate; and the nine municipalities that landfill in another state.
2. CETESB’s names were matched to IBGE’s 2025 Municipal Mesh with a key stripped of accents, spaces
   and punctuation, with two spellings fixed by hand (Embu das Artes and São Luiz do Paraitinga).
3. An empty «dispõe em» means the waste stays in the municipality. A name («Caieiras - A.P.», «São Paulo
   - CDR», «Uberaba - MG») gives the landfill’s municipality; «A.P.» and «CDR» are private landfills.
   Four municipalities appear in two annex rows, one per destination, each with its own tonnage: São
   Paulo, Embu das Artes, Praia Grande and São Sebastião.
4. Each flow is a line from the seat of the municipality of origin to the seat of the landfill’s
   municipality (IBGE localities, 2022), with width proportional to tonnes per day. Distance is
   geodesic, in a straight line.
5. The state total, 39,144.35 t/day, includes the 106.25 t/day landfilled outside SP; it is the base for
   the plate’s shares. The share of private landfills (61%, in 37 of the 302 landfills) uses only the
   waste landfilled in SP.
6. A municipality is a hub when it takes waste from at least one other town: there are 38 in SP. The
   number beside the name on the map counts the towns served, itself included.

## Limitations

- Tonnages are CETESB estimates, not weighings: urban population (the latest Census population with
  the 2010 urbanisation rate) times 0.7 to 1.1 kg per person per day, depending on town size. The
  capital is the exception: it uses the amounts reported by the concession holders, without street
  sweeping, pruning and public-space cleaning. CETESB itself warns that the inventory tracks landfill
  conditions and should not be used as a source of the quantities actually generated.
- The line joins municipal seats: the landfill may lie far from the seat, and the lorry follows the
  road. The real journey is longer.
- Transfer stations do not appear: the flow goes straight to the landfill’s municipality.
- Destinations are those of 2023; disposal contracts change from year to year.
- On the plate, municipalities that bury only their own waste also get a proportional circle
  (graphite), so readers can compare their size with the hubs.

## Data licence

CETESB public data and IBGE open data, free to use with attribution.
