---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Three harvests, less cane"
subtitulo: "Brazil crushed 48 million tonnes less, and São Paulo accounts for 86% of the drop"
contexto: >-
  From the 2023/24 to the 2025/26 harvest, the cane crushed in Brazil fell from 712.0 to 663.8 million tonnes: 48.2 million fewer (−6.8%). Almost all of the drop has one address: São Paulo crushed 41.6 million tonnes less (−10.8%), 86% of the total, and Minas Gerais 6.2 million less; Goiás, Mato Grosso do Sul and Mato Grosso together crushed 3.0 million more. The gap did not build up gradually: until October, 2025/26 was running 7 million tonnes behind 2023/24; in November and December 2025 the mills crushed 37 million less than in the same months of 2023, and the gap reached 44 million. The figures come from the monthly SAPCana reports of the Ministry of Agriculture, which publishes output by state, not by mill. First plate in the collection «Each state’s cane harvest».
imagem_alt: "Map of Brazil in Albers conic projection with one circle per state proportional to the cane crushed in the 2025/26 harvest (disc) and in 2023/24 (ring), coloured in four categories of change: grew by over 2%, within ±2%, fell by 2 to 10% and fell by over 10%. The largest circle, dark red, sits on São Paulo, with the 2023/24 ring visible around it; Minas Gerais is orange, Goiás, Mato Grosso do Sul and Paraná greyish green, Mato Grosso green. One callout points to São Paulo, with 41.6 million tonnes less (−10.8%), 86% of Brazil’s drop; another points to Mato Grosso, noting that GO, MS and MT crushed 3.0 million tonnes more. In the panel, a table of cane crushed by state in the three harvests with bars of the change in %, and monthly bars of the cumulative gap between 2025/26 and 2023/24, close to zero until October (−7) and deep from November onwards (−44 in December)."
metodo: "Cane crushed by state at the close of each harvest (the report accumulating 1 April to 31 March) from SAPCana/MAPA, 2023/24 to 2025/26; change between 2023/24 and 2025/26; national cumulative gap month by month. Each state is drawn at a point inside its polygon."
---

# Three harvests, less cane: each state’s crush from 2023/24 to 2025/26

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 153, the first in the collection **Each state’s cane harvest**. Before asking what the
cane turns into and when it is crushed, how much each state crushed in three harvests in a row.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `moagem_uf` | point | 19 states with cane crushed: `SIGLA_UF`, `regiao`, `cana_2023_24`, `cana_2024_25`, `cana_2025_26` (t), `variacao_t`, `variacao_pct`, `parte_perda_pct` (% of the national drop), `categoria`, `lon`, `lat` |
| `ufs` | polygon | 27 states: cane crushed in the three harvests, `variacao_t`, `categoria` (`sem_cana` for the 8 with no crush) |
| `limite_nacional` | polygon | national outline |

The **GPKG** is zipped and attached to the
[`sapcana-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/sapcana-br-2026),
with **QGIS styles** stored inside (circles by category, sized by the 2025/26 crush). The **CSV**
sits in this folder, in UTF-8, with the state table and no geometry.

## Method

1. Monthly sugar and ethanol production monitoring reports from the Ministry of Agriculture
   (SAPCana), downloaded on 01/11/2026: 36 `.xls` spreadsheets, one a month, from 05/2023 to
   04/2026. Each gives, by state, the harvest total since 1 April (cane crushed in t, sugar in t,
   anhydrous and hydrated ethanol in m³). Since 2023/24 the system uses the 1 April–31 March window
   for every state, the Northeast included.
2. The spreadsheets were read with `xlrd` (system Python, `converter_xls.py`) into a long CSV; the
   rest of the calculation runs in the project environment (`preparar.py`).
3. Close of each harvest: the report ending on 31 March (files of 01/04/2024, 01/04/2025 and
   01/04/2026). Change = 2025/26 minus 2023/24, in t and in %.
4. Categories by % change: grew by over 2%, within ±2%, fell by 2 to 10%, fell by over 10%. Each state
   is drawn at a point inside its polygon.
5. Cumulative gap: Brazil’s month-by-month running total in 2025/26 minus that of the same month in
   2023/24.

## Reading

- Brazil crushed 712.0 million t in 2023/24, 676.3 in 2024/25 and 663.8 in 2025/26: 48.2 million
  fewer over two harvests (−6.8%).
- São Paulo went from 386.9 to 345.3 million t (−41.6 million, −10.8%): 86% of the national drop.
  Minas Gerais lost 6.2 million (−7.8%) and Alagoas 1.5 million (−7.6%).
- Goiás (+1.2 million, +1.6%), Mato Grosso do Sul (+0.8, +1.6%) and Mato Grosso (+0.9, +5.3%)
  together crushed 3.0 million t more. Espírito Santo grew 16.9%, from a small base.
- Four states fell by over 10% (SP, SE, TO and PI) and four grew by over 2% (MT, ES, PA and AM).
- Until October, the 2025/26 harvest was 7 million t behind 2023/24. In November and December 2025
  the mills crushed 61.3 million t, against 98.0 in the same months of 2023: the gap reached
  44 million in December and closed at 48 million in March.

## Limitations

- SAPCana publishes the figures by state; these reports have no data by mill, so the map cannot tell
  mills that stopped from mills that merely crushed less.
- The figures are declared by the mills and compiled by MAPA; monthly reports can be revised later
  (there were four small downward revisions between consecutive months in these files).
- The 1 April–31 March window cuts the north-eastern coast’s harvest (September to August) in two;
  for those states, the «harvest» total is April to March.
- The plate does not say why the crush fell; cane crushed depends on harvested area, weather and
  fire, which these reports do not cover.

## Data licence

Public data from MAPA and IBGE, free to use with attribution.
