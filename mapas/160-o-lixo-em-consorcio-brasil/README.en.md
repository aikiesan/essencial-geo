---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Waste by consortium"
subtitulo: "One town in six shares its waste with its neighbours; among them, open dumps are half as common"
contexto: >-
  In 2023, 858 of the 5,556 municipalities that answered IBGE's MUNIC survey handled their waste through a public consortium, 15% of the total; another 372 used some other regional arrangement, and 4,326 went it alone. Consortia are a small-town affair: the median member has 11,000 inhabitants, and together they hold only 9.7% of the population. In Rondônia 73% of municipalities belong to one; in Alagoas and Sergipe, 63%. In Maranhão none of the 217 do, nor any in Amazonas, Acre, Amapá or Roraima. What members share most is final disposal, in 73% of cases; organic waste, in 10%. And members have fewer open dumps: 20% report one on their land, against 37% of towns acting alone, and the gap holds in towns of up to 20,000 people (18% and 38%). Second plate in the collection «The town hall and the leftovers».
imagem_alt: "Choropleth map of Brazil in Albers conic projection with municipalities in three classes of solid-waste management in 2023: dark blue for a public consortium, light blue for another regional arrangement and cream for towns managing their waste alone. Solid dark-blue patches cover Rondônia, Alagoas, Sergipe and much of Ceará, with many consortia scattered across Minas Gerais and the South; the North and Maranhão are almost all cream. One callout points to Rondônia, with 38 of 52 municipalities in a consortium, and another to Maranhão, with none. In the panel, the classes with their number of municipalities and share of the population, bars of the share of towns in a consortium in each state, and paired bars of the share with an open dump by town size, comparing consortium members with towns on their own."
metodo: "Municipal answers to the 2023 MUNIC survey: regionalised solid-waste management (SMRS65) and, within it, a public consortium (SMRS6515), in three classes; regionalised services (SMRS671 to SMRS6711) and an open dump on the municipality's land (SMRS42 and SMRS43), compared by town size."
---

# Waste by consortium: regional solid-waste management in Brazil's municipalities, 2023

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 160, the second in the collection **The town hall and the leftovers**. A
sanitary landfill is expensive for a town of 10,000 people; a public consortium is the way to split
the bill with the neighbours. Who does it, and whether it makes a difference.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 5,571 municipalities: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `pop_2022`, `Faixa_pop`, `situacao_munic`, `regionalizado`, `consorcio`, `reg_metropolitana`, `reg_unidade_regional`, `reg_bloco`, `reg_compartilhamento`, `cons_coleta`, `cons_seletiva`, `cons_organicos`, `cons_transbordo`, `cons_disposicao`, `vazadouro`, `vazadouro_alagavel`, `aterro_sanitario` (MUNIC answers as published, in Portuguese), `classe`, `arranjo`, `lon`, `lat` |
| `ufs` | polygon | 27 states: `municipios`, `em_consorcio`, `em_consorcio_pct` |
| `limite_nacional` | polygon | national outline |

The **GPKG** is zipped and attached to the
[`residuo-organico-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/residuo-organico-br-2026).
The `municipios` layer carries the plate's **QGIS style**, with the three classes. The **CSV** sits
in this folder, in UTF-8, with the same table and no geometry.

## Method

1. Database of the 2023 MUNIC Sanitation Supplement («Resíduos Sólidos» sheet). The key question:
   whether the municipality «belongs to a regionalised structure» for waste services (SMRS65) and,
   if so, of which kind (SMRS6511 to SMRS6518), with the public consortium in SMRS6515.
2. Three classes: public consortium (858 municipalities, with or without another arrangement as
   well); another regional arrangement without a consortium, such as a metropolitan region, a
   regional unit or shared equipment (372); and towns managing their waste alone (4,326). Grey marks
   the 14 with no valid answer and Boa Esperança do Norte (MT), created after the survey.
3. **Open dump**: an open-air dumping ground found on the municipality's land, dry or floodable
   (SMRS42 or SMRS43). The «bota-fora», usually for rubble, is left out.
4. Since consortia gather small towns, the dump comparison is also made by size, using the MUNIC's
   own population bands (2022 Census).

## Reading

- 858 municipalities belong to a public waste consortium, 15.4% of the 5,556 that answered, with
  19.6 million residents (9.7% of the population). The median member has 11,171 inhabitants; the
  largest is Santo André (SP), with 749,000.
- By state: Rondônia 73% (38 of 52), Alagoas and Sergipe 63%, Ceará 38%, Minas Gerais 24% (201
  municipalities, the largest number). None in Maranhão, Amazonas, Acre, Amapá or Roraima.
- What members share: final disposal on land (72.5%), kerbside collection (44.6%), transport and
  transfer (33.2%), separate collection (22.5%) and organic-waste treatment (9.6%).
- An open dump on their land: 20.5% of consortium members, 15.9% of towns in another regional
  arrangement and 37.2% of towns on their own. In towns of up to 20,000 people, 18.5% against 37.8%;
  from 20,000 to 50,000, 26% against 43%.

## Limitations

- The MUNIC does not name the consortium. There is no way to draw who is with whom or link the
  members of the same consortium; the map shows membership, not the group.
- Comparison is not proof of cause: consortia may reduce dumps, or towns that already had a landfill
  may have been likelier to join.
- The dump is what the town hall reports on its land, including old sites not yet restored; it is not
  necessarily where the town's own rubbish went in 2023.
- A 2023 snapshot: consortia formed or dissolved since then do not appear.

## Data licence

IBGE open data, free to use with attribution.
