---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Transmission lines"
subtitulo: "The wires that stitch the country together"

contexto: >-
  From the Xingu to Rio de Janeiro, an 800 kV direct-current line runs 2,552 km to carry Belo Monte’s power to the South-East: it is the longest of the 1,712 existing transmission lines mapped by EPE. Adding up circuits, they come to 170.2 thousand km of lines and 780 substations. Lines of 500 to 765 kV make up most of the length, 68.0 thousand km; the eleven direct-current lines, 19.5 thousand km, bring the power of Itaipu, the Madeira plants and Belo Monte to the South-East. On the map, the grid thickens in the South-East, the South and along the north-eastern coast, and reaches the Amazon through a handful of wires. First plate of the collection “Electricity in Brazil”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of Brazil in Albers conic projection, with neighbouring countries in grey and the ocean in pale blue. Transmission lines are coloured by voltage: ochre up to 230 kV, clay for 345 and 440 kV, plum for 500 to 765 kV and, thicker, deep blue for the direct-current lines. Dark dots mark the 780 substations. The grid is dense in the South-East, the South and along the north-eastern coast and sparse in the Amazon, crossed by long lines running from Pará and Rondônia down to the South-East. An arrowed callout points to the longest line, 2,552 km at 800 kV. In the panel, bars compare the length of each voltage class and a list gives the four longest lines."

recorte: "Brazil"
metodo: "EPE’s existing transmission lines and substations, grouped into four voltage classes; length as declared by EPE and checked against the geodesic measurement."
---

# Electricity transmission lines in Brazil

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 042, the first of three in the collection **Electricity in Brazil**: before the power
plants, the wires that carry power from where it is made to where it is used.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `linhas_transmissao` | line | 1,712 lines: `nome`, `concessionaria`, `tensao_kv`, `extensao_km` (declared by EPE), `ano_operacao`, `faixa`, `corrente_continua` |
| `subestacoes` | point | 780 substations: `nome`, `concessionaria`, `tensao_kv` (all voltages, as in the source), `tensao_max_kv`, `ano_operacao`, `uf` |
| `ufs` | polygon | 27 states, with their region |
| `limite_nacional` | polygon | outline of the country |

The **GPKG** is zipped and attached to the
[`energia-eletrica-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/energia-eletrica-2026).
Its **QGIS styles** match the plate: lines coloured and thickened by voltage class, the
direct-current ones in deep blue, and substations as light dots with a dark outline.

The **CSV** holds the table of the 1,712 lines, in UTF-8, without geometry.

## Method

1. Transmission lines and substations classed as existing in EPE’s WebMap, in the copy published by
   the MapBiomas infrastructure database (situation in 2022).
2. Lines are grouped into four voltage classes: up to 230 kV; 345 and 440 kV; 500 to 765 kV; and
   600 and 800 kV, which in Brazil are the direct-current lines from Itaipu, the Madeira and Belo
   Monte. The 765 kV line, also from Itaipu, is alternating current and sits in the third class.
3. Length is the one EPE declares for each line: 170.2 thousand km in all. The geodesic measurement
   of the routes, on the GRS80 ellipsoid, gives 169.2 thousand km, close to the declared figure.
4. Of the lines with a recorded year in service, 52% of the length entered service in the 2010s.

## Limitations

- Each circuit is a line: a route with two circuits counts twice in the length. The Madeira and
  Xingu – Estreito direct-current bipoles appear as two records each.
- 430 lines, 31.9 thousand km, have no year in service, so the count by decade covers only those
  that do.
- The database is a snapshot of 2022: lines opened later are not on the map.
- EPE’s mapping covers transmission; distribution networks are left out.
