---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The fee and the dump"
subtitulo: "Where nobody pays for rubbish collection, half the towns have an open dump"
contexto: >-
  In 2023, 2,353 of the 5,556 municipalities that answered IBGE's MUNIC survey charged for waste services, through a fee or tariff, and 1,844 reported an open dump on their land. The two pull in opposite directions: 48% of towns that charge nothing have a dump, against 13% of those that charge. The map splits in two: in the North, 298 of 448 municipalities charge nothing and have a dump; in the South, 936 of 1,186 charge and have none. There are 305 towns that charge and still report a dump, home to 10.2 million people; the largest is Duque de Caxias (RJ). Nor does charging balance the books: only 19% of fees covered the cost of the service in 2022. Among towns that charge nothing, 72% say there is no municipal law, and 42% cite residents' resistance. Third and last plate in the collection «The town hall and the leftovers».
imagem_alt: "Bivariate choropleth map of Brazil in Albers conic projection, with municipalities in four combinations of a waste fee and an open dump on their land in 2023: cream for no fee and no dump, blue-green for a fee and no dump, earthy orange for no fee and a dump, and wine for a fee and a dump. Orange covers almost all of the North and much of the Northeast; blue-green dominates the South, São Paulo and southern Minas Gerais; wine-coloured patches appear in Mato Grosso, Rondônia, Pará and Mato Grosso do Sul. One callout points to Duque de Caxias (RJ), the largest town that charges and reports a dump, and another to the North, where 298 of 448 municipalities charge nothing and have a dump. In the panel, a two-by-two matrix with the number of municipalities and share of the population in each combination, stacked bars by region and bars of the reasons for not charging."
metodo: "Municipal answers to the 2023 MUNIC survey: charging for urban cleaning and solid-waste services (SMRS75) crossed with an open dump on the municipality's land, dry or floodable (SMRS42 or SMRS43), in four combinations; cost coverage in 2022 (SMRS752) and reasons for not charging (SMRS761 to SMRS763)."
---

# The fee and the dump: waste charges and open dumps in Brazil's municipalities, 2023

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 161, the third and last in the collection **The town hall and the leftovers**.
A sanitary landfill costs money, and the sanitation law (Law 14,026/2020) requires towns to charge
for the service. The map crosses the two answers: does the town hall charge? Does it have a dump?

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 5,571 municipalities: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `pop_2022`, `Faixa_pop`, `situacao_munic`, `cobranca`, `cobranca_instrumento`, `cobranca_cobre_custos`, `vazadouro`, `vazadouro_alagavel`, `bota_fora`, `aterro_controlado`, `aterro_sanitario`, `nao_cobra_resistencia`, `nao_cobra_parametros`, `nao_cobra_lei` (MUNIC answers as published, in Portuguese), `classe`, `combinacao`, `lon`, `lat` |
| `ufs` | polygon | 27 states, with their region |
| `limite_nacional` | polygon | national outline |

The **GPKG** is zipped and attached to the
[`residuo-organico-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/residuo-organico-br-2026).
The `municipios` layer carries the plate's **QGIS style**, with the four combinations. The **CSV**
sits in this folder, in UTF-8, with the same table and no geometry.

## Method

1. Database of the 2023 MUNIC Sanitation Supplement («Resíduos Sólidos» sheet). **Fee**: «charging
   for urban cleaning and solid-waste services – existence» (SMRS75), by fee, tariff or other means,
   with or without a specific law (SMRS751). **Open dump**: an open-air dumping ground found on the
   municipality's land, dry or floodable (SMRS42 or SMRS43). The rubble tip («bota-fora», SMRS41)
   and the controlled landfill (SMRS44) are left out.
2. Four combinations, in a bivariate map: no fee and no dump (1,664 municipalities), a fee and no
   dump (2,048), no fee and a dump (1,539), a fee and a dump (305). Grey marks the 14 with no valid
   answer and Boa Esperança do Norte (MT), created after the survey.
3. Cost coverage: «the amount collected covered total costs in 2022» (SMRS752), among towns that
   charge. Reasons for not charging (SMRS761 to SMRS763): more than one per town.

## Reading

- 2,353 municipalities charge for waste (42.4% of those that answered, with 57.4% of the
  population); 1,844 have an open dump on their land (33.2%), with 39.6 million residents.
- 48.0% of towns that charge nothing have a dump, against 13.0% of those that charge.
- By region, the share that charges nothing and has a dump: North 66.5% (298 of 448), Northeast
  50.0%, Centre-West 38.8%, Southeast 8.4% and South 2.0%. The share that charges and has none:
  South 78.9% (936 of 1,186), Southeast 47.6%.
- 305 municipalities charge and have a dump, home to 10.2 million people. The largest: Duque de
  Caxias (RJ, 808,000), Belford Roxo (RJ), Santos (SP), Mauá (SP) and Petrópolis (RJ). By state,
  Minas Gerais (53), Mato Grosso (38, of 140) and Paraná (34) have the most cases; in Mato Grosso,
  more than one town in four.
- Only 437 of the 2,353 fees (18.6%) covered the full cost in 2022; 1,799 rest on a specific law.
- Of the 3,203 towns that charge nothing, 72.3% say there is no municipal law, 42.5% cite residents'
  resistance and 35.1% the lack of data to set the amount.

## Limitations

- The dump is the one «found in the municipality», according to the town hall: it may be an old site,
  closed and not restored, or take another town's rubbish. Duque de Caxias, for instance, is home to
  the former Jardim Gramacho landfill, closed in 2012.
- The MUNIC does not say how much is charged or how much rubbish goes to the dump; each class is a
  yes or a no.
- The cross shows an association, not a cause: a town's income and size weigh on both.
- A 2023 snapshot: the legal deadline to close open dumps expired in 2024, after the survey.

## Data licence

IBGE open data, free to use with attribution.
