---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The landfills that already light up"
subtitulo: "Only 6 of the 301 towns with a landfill burn rubbish gas to make electricity"
contexto: >-
  Of the 301 São Paulo municipalities with a landfill in use in 2023, six have a waste-biogas plant in operation in ANEEL’s SIGA: São Paulo, Caieiras, Santana de Parnaíba, Guatapará, Tremembé and Catanduva. They receive 41.9% of the state’s waste. The state has 10 waste-biogas plants in operation, with 78.6 MW; 74.5 MW sit in those six, most of it in Caieiras (29.5 MW, Termoverde) and the capital (29.3 MW, São João and Bandeirantes). The other three, with 4.1 MW, are in Carapicuíba, Ribeirão Preto and Barueri, with no landfill in use. Three more, with 10.5 MW, appear in the SIGA with another waste fuel: Veolia Iperó, Cdr Pedreira I (capital) and USITRAR (Cabreúva). The largest destinations with no plant running are Paulínia, with 2,621 t/day from 30 towns, Mauá, Guarulhos, Santos and Jambeiro.
imagem_alt: "Map of São Paulo state with a circle at the seat of each of the 301 municipalities with a landfill in use, sized by the waste received per day: blue for the six with a waste-biogas plant in operation, grey for the rest. Open rings mark the 13 waste-fuelled plants in operation in ANEEL’s SIGA: blue for biogas, graphite for those registered with another waste fuel. Labels give the municipality and capacity: Caieiras with 29.5 MW, São Paulo with 29.3 MW plus 3.1 MW from another waste fuel, Guatapará with 5.7 MW, Santana de Parnaíba and Tremembé with 4.3 MW, Iperó with 4.7 MW from another waste fuel, Catanduva with 1.4 MW. An inset enlarges Greater São Paulo and the Santos coast. A callout points to Paulínia, the largest destination with no plant in operation, with 2,621 t/day from 30 municipalities. The panel holds bars for the waste received by the six municipalities with a plant, with each one’s MW, and by the three largest without one."
metodo: "Municipalities with a landfill from CETESB’s 2023 inventory, with the waste they receive, and waste-fuelled plants in operation in ANEEL’s SIGA (01/10/2026), at their registered coordinates; landfill and plant are linked by municipality. Only what exists: no estimate of potential."
---

# The landfills that already light up: landfill-gas plants at São Paulo’s landfills

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 140, the third and last in the **Where the rubbish goes** collection. At the end of the
route, the landfill: which ones already burn rubbish gas to make electricity, and which of the largest
do not yet.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `aterros` | point | 301 municipalities with a landfill, at the seat: `t_recebida`, `municipios`, `de_outros`, `t_propria`, `locais`, `iqr_2023`, `mw_biogas`, `mw_rsu`, `usinas`, `usina_biogas` |
| `usinas` | point | 13 plants: `nome`, `ceg`, `combustivel` (as in the SIGA), `grupo` (biogas or other waste fuel), `potencia_kw` (licensed), `inicio_operacao`, `municipio_siga`, `proprietario`, `posicao`, `CD_MUN`, `NM_MUN`, `aterro_no_municipio` |
| `limite_estadual` | polygon | state boundary |

The **GPKG** is zipped and attached to the
[`lixo-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/lixo-sp-2026).
The layers carry the **QGIS styles**: landfills with circles proportional to the waste received and
plants by fuel group. The **CSV** sits in this folder, in UTF-8, with the landfill table without
geometry.

## Method

1. The municipalities with a landfill are the São Paulo destinations of plate 138 (CETESB’s 2023 waste
   inventory): 301 municipalities, with the waste they receive per day, their own and from outside.
2. The plants come from ANEEL’s SIGA (open data of 01/10/2026): São Paulo state, phase «Operação»
   (in operation) and fuel «Biogás - RU», «Resíduos Sólidos Urbanos - RU» or «Carvão - RU». There are
   13: ten on biogas (78.6 MW) and three on other waste fuels (10.5 MW).
3. Each plant sits at its SIGA coordinates and falls in a municipality through IBGE’s Municipal Mesh.
   TECIPAR, which has no coordinates, was placed at the seat of Santana de Parnaíba, the municipality the
   SIGA records (`posicao` column).
4. Plant and landfill are linked by municipality: a municipality with a landfill in use counts as «with a
   plant» when it has a biogas plant in operation. The waste share (41.9%) divides what those six receive
   by the state total, 39,144.35 t/day.
5. Capacity is licensed capacity, in MW.

## Limitations

- The link is by municipality, not by landfill: a plant may burn gas from an old, closed landfill rather
  than from the one taking waste today. That is the case of the São João and Bandeirantes plants, in the
  capital, set up at landfills that had stopped taking waste before 2023.
- «Biogás - RU» is the SIGA label for biogas from urban waste; the three plants in municipalities with no
  landfill in use (Carapicuíba, Ribeirão Preto and Barueri) may burn gas from another source.
- Licensed capacity is not energy generated.
- Only plants in operation are included. The SIGA records other waste projects in São Paulo: Barueri,
  under construction, and Paulínia Energia, URE Valoriza Santos and URE Lara (Mauá), with construction
  not started.
- The tonnages received are CETESB’s estimates; CETESB warns that the inventory should not be used as a
  source of the quantities actually generated.
- The plate shows only what exists: there is no estimate of the gas or electricity the other landfills
  could provide.

## Data licence

CETESB public data and ANEEL and IBGE open data, free to use with attribution.
