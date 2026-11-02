---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The second score"
subtitulo: "On renewal, corn ethanol’s median score rose 15 points; in the Northeast, most plants fell"
contexto: >-
  A RenovaBio certificate lasts three years; on renewal, the plant redoes its sums and gets a new score. Of the 338 plants certified on 27/10/2026, 309 had already been through this, most of them first certified in 2020. Against the first certificate, the score rose at 189 of them (61%) and fell at 120; the median change was +1.1, from 60.2 to 61.9. The biggest leap came in corn ethanol: the median score of its 8 plants went from 45.9 to 60.9, and the eligible share from 48% to 72%. In the Centre-West, 59 plants rose and 24 fell; in the Northeast, 24 of 40 fell, with a median of −1.0. The largest rise was at a cane mill in Santa Rita (PB), from 37.0 to 60.9; the largest drop, at a biodiesel plant in Rondonópolis (MT), from 80.2 to 44.5. Third plate in the collection «Each plant’s score».
imagem_alt: "Map of Brazil in Albers conic projection with the 309 RenovaBio-certified plants that have renewed their certificate, each a circle at its municipal seat, coloured by the difference between the current score and the first certificate’s: dark blue (rose by more than 5), light blue (rose 1 to 5), grey (about the same), salmon (fell 1 to 5) and brick (fell by more than 5). Blues dominate in São Paulo, Goiás and Mato Grosso do Sul; on the Northeast coast, from Rio Grande do Norte to Alagoas, salmon and brick circles are more common. One callout points to Santa Rita (PB), from 37.0 to 60.9, and another to Rondonópolis (MT), from 80.2 to 44.5. In the panel, lines of each route’s median score from first certificate to current, with corn rising from 45.9 to 60.9, a histogram of the change by plant and bars of how many rose and fell in each region."
metodo: "For each plant with a valid certificate on 27/10/2026, the score (gCO₂eq/MJ) of the main fuel minus that of the first certificate of the same CNPJ approved between 2019 and 2026 (sheets of cancelled, expired or suspended certificates); classes at −5, −1, +1 and +5 points."
---

# The second score: how RenovaBio plant scores changed between the first certificate and the current one

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 158, the third and last in the collection **Each plant’s score**. RenovaBio began certifying
plants at the end of 2019; the first certificates expired in 2023 and were renewed with new scores. This
plate compares, plant by plant, today’s score with the first one.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `usinas` | point | 309 plants: the fields of No. 156 plus `nota_0`, `eleg_0`, `aprov_0` (first certificate), `certificados_anteriores`, `delta_nota`, `delta_eleg`, `classe_delta` |
| `ufs` | polygon | 27 states: `usinas_renovadas`, `delta_nota_mediano` |
| `limite_nacional` | polygon | national outline |

The **GPKG** is zipped and attached to the
[`renovabio-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/renovabio-br-2026),
with **QGIS styles** stored inside (colour by change class). The **CSV** sits in this folder, in UTF-8,
with the plant table and no geometry.

## Method

1. Valid certificates on 27/10/2026 (sheet «Válidos» of the ANP spreadsheet): 338 plants in Brazil, as in
   No. 156.
2. History: sheet «Cancelados ou Suspensos», with certificates cancelled on renewal, expired, suspended or
   transferred to a new owner. For each CNPJ, the oldest certificate approved between 2019 and 2026 (two
   rows with invalid approval dates, 1970 and 2015, are left out).
3. Change = current certificate score − first certificate score, for the main fuel (hydrous ethanol,
   biodiesel or biomethane). 309 plants have both; 29 are on their first certificate.
4. The match is by CNPJ: a plant that changed hands and CNPJ shows up as a first certification.

## Reading

- 189 of the 309 plants (61%) raised their score and 120 lowered it. Median change +1.1; the median score
  went from 60.2 to 61.9. 60 rose by more than 5 points and 36 fell by more than 5.
- Corn ethanol (8 plants): median score from 45.9 to 60.9, 6 rose, and the median eligible share went from
  48% to 72%. Cane and corn (6): from 60.5 to 66.4, all rose. Cane (249): from 60.0 to 61.8, 62% rose.
- Biodiesel (41): median change −0.2, 20 rose. The group median falls from 77.1 to 65.9 because four plants
  that stood near 80 dropped to between 44.5 and 65.9; at three of them the eligible share rose at the same
  time.
- By region: Centre-West 59 rose and 24 fell (+2.0), Southeast 95 and 55 (+1.5), South 15 and 15 (−0.4),
  Northeast 16 and 24 (−1.0).
- Largest rise: Companhia Usina São João, in Santa Rita (PB), from 37.0 to 60.9. Largest drop: Caibiense
  Gran Vita, in Rondonópolis (MT), biodiesel, from 80.2 to 44.5, with its eligible share going from 19% to
  80%.

## Limitations

- Scores change for different reasons: real process improvement, better data from the plant or its
  suppliers, a change of feedstock or of RenovaCalc version. The spreadsheet does not separate them.
- The first score is that of the oldest certificate found for the CNPJ; plants renewed more than once may
  have had different scores in between.
- Route medians compare identical sets of plants (the same at both moments), but small ones for corn (8),
  flex (6) and biomethane (5).

## Data licence

Open data from the ANP and the IBGE, free to use with attribution.
