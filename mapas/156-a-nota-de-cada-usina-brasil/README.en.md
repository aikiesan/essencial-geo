---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Each plant’s score"
subtitulo: "Biomethane and half the biodiesel score close to 80; cane ethanol sits at 61"
contexto: >-
  Under RenovaBio, the ANP gives every biofuel plant a score: how many grams of CO₂ equivalent its fuel saves, per megajoule, against the fossil fuel it replaces. On 27/10/2026, 338 plants in Brazil held a valid certificate, in 285 municipalities across 22 states. Cane ethanol, with 266 plants, has a median score of 61.3; biomethane, with 10, scores 78.0. Biodiesel splits into two groups of equal size: 21 plants below 50, with a median of 45, and 21 above 70, with a median of 80. In ethanol, Mato Grosso do Sul, Goiás and São Paulo have medians close to 62; Paraíba and Alagoas, close to 54. The top ethanol score, 70.9, belongs to a cane-and-corn plant in Quirinópolis (GO). First plate in the collection «Each plant’s score».
imagem_alt: "Map of Brazil in Albers conic projection with the 338 RenovaBio-certified plants at the seat of their municipality: colour gives the score in six classes, from brick red (below 45) to dark green (75 or more), and shape gives the route: circle for cane ethanol, square for corn ethanol, triangle for biodiesel and diamond for biomethane. The circles crowd into São Paulo, Goiás, Minas Gerais, Mato Grosso do Sul and the Northeast coast; dark green and sand-coloured triangles mix in Mato Grosso and Rio Grande do Sul. One callout points to Quirinópolis (GO), with the top ethanol score, 70.9, and another to Alagoas, with a median of 54.1. In the panel, a strip of dots with each plant’s score by route, where biodiesel falls into two groups, near 45 and near 80, and bars of the median ethanol score by state."
metodo: "Energy-Environmental Efficiency Score (gCO₂eq/MJ) of each valid RenovaBio certificate on 27/10/2026, for the main fuel (hydrous ethanol, biodiesel or biomethane); plant located by CNPJ in the ANP producer panels or by the certificate address, and drawn at the municipal seat."
---

# Each plant’s score: the Energy-Environmental Efficiency Score of RenovaBio-certified plants

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 156, the first in the collection **Each plant’s score**. RenovaBio rewards biofuel plants with
decarbonisation credits (CBIOs) according to a score given to each of them. This plate shows the score
of every plant with a valid certificate, and where they are.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `usinas` | point | 338 plants: `cnpj14`, `nome`, `rota` (cane, corn, flex, biodiesel, biomethane), `nota` and `nota_anidro` (gCO₂eq/MJ), `eleg` (eligible volume, %), `fator` (tCO₂eq per litre), `cbio_m3`, `aprov`, `validade`, `firma`, `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `cap_m3d`, `mes_cap`, `localizacao`, `classe_nota`, `lon`, `lat` |
| `ufs` | polygon | 27 states: `usinas`, `nota_mediana`, `etanol_usinas`, `etanol_nota_mediana` |
| `limite_nacional` | polygon | national outline |

The **GPKG** is zipped and attached to the
[`renovabio-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/renovabio-br-2026),
with **QGIS styles** stored inside (colour by score class, shape by route). The **CSV** sits in this
folder, in UTF-8, with the plant table and no geometry.

## Method

1. The ANP spreadsheet of approved certificates (`certificados-aprovados-producao.xlsx`, updated on
   27/10/2026, downloaded on 01/11/2026), sheet «Válidos»: 339 certificates, one per CNPJ. The only import
   certificate (corn ethanol from Plymouth Energy, in the USA, score 23.9) is left out, leaving 338 plants.
2. The score is the certificate’s Energy-Environmental Efficiency Score, in gCO₂eq/MJ: the carbon
   intensity of the fossil substitute minus that of the biofuel, as computed in RenovaCalc. For ethanol
   plants the hydrous-ethanol score is used (the anhydrous one, in the CSV, differs by a few tenths).
3. Route: as given in the spreadsheet, grouped into cane, corn, cane and corn in an integrated plant
   (flex), biodiesel and biomethane. The first- and second-generation cane plant (Costa Pinto,
   Piracicaba) counts as cane.
4. Municipality: by CNPJ, in the last month the plant appears in the ANP ethanol or biodiesel producer
   panel (327 plants); for the 10 biomethane plants and one ethanol plant missing from the panels, from
   the issuer’s address in the certificate itself. Each plant is drawn at the municipal seat (IBGE,
   Localities 2022); plants in the same municipality overlap.
5. State medians only for ethanol, and only in states with 5 plants or more.

## Reading

- 338 certified plants: 266 cane ethanol, 11 corn ethanol, 6 cane and corn, 45 biodiesel and 10
  biomethane, in 285 municipalities across 22 states.
- Median score: biomethane 78.0; cane-and-corn ethanol 66.4; cane ethanol 61.3; biodiesel 59.4; corn
  ethanol 57.8.
- Cane ethanol is narrow: half the plants lie between 56.7 and 64.2. Biodiesel has no middle: 21 plants
  below 50 (median 45.0), 21 above 70 (median 80.3) and only 3 in between.
- The top ethanol score is 70.9, at a cane-and-corn plant in Quirinópolis (GO); the lowest, 32.8, at a
  cane mill registered by the ANP in Uruaçu (GO).
- In ethanol, medians run from 62.8 in Mato Grosso do Sul, 62.2 in Goiás and 62.1 in São Paulo down to
  54.5 in Paraíba and 54.1 in Alagoas.

## Limitations

- The score is the certificate’s, computed from data the plant itself declares and an inspection firm
  checks; it is not a measurement of emissions.
- The spreadsheet does not give each biodiesel plant’s feedstock, so the two groups of scores cannot be
  explained from these data alone.
- The score is per litre (or m³) and says nothing about how much a plant makes; the map does not weight
  plants by volume.
- Biomethane appears only as points, with no capacity or production potential. One biomethane plant
  (Biometano Sul) gives an office address in Piracicaba (SP) on its certificate, and that is where it is drawn.
- CBIO issuance by plant is only in the ANP’s Power BI panel, with no open file, and is not used.

## Data licence

Open data from the ANP and the IBGE, free to use with attribution.
