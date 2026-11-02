---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Raised here, slaughtered there"
subtitulo: "São Paulo slaughters 2.5 times what its cattle herd would supply; the Northeast raises pigs that inspected slaughter never sees"
contexto: >-
  Dividing the head slaughtered in each state in 2025 by the state’s herd, with Brazil equal to 1, shows where animals travel before they become meat and residue. São Paulo slaughters 4.77 million cattle from 10.3 million on pasture: an index of 2.5, the highest in Brazil, and federal inspection data say that 428 thousand of the cattle killed there in 2025 came from other states. For pigs, Paraná takes in 792 thousand head from elsewhere and Rio Grande do Sul sends out 616 thousand. At the other end, Bahia, Ceará and Pernambuco raise pigs that barely show up in inspected slaughter (an index under 0.25): they are killed without inspection or in another state. For chickens, Santa Catarina and Mato Grosso have the highest indices. Second plate in the collection «Where livestock becomes residue».
imagem_alt: "Three maps of Brazil by state, for cattle, pigs and chickens, coloured by the 2025 slaughter-to-herd index, with Brazil equal to 1, on a diverging scale from green (less slaughter than the herd would supply) to brick red (more), with hatching on states whose data are withheld. On the cattle map, São Paulo shows in red and the Northeast in light green; on the pig map, Bahia, Pernambuco, Ceará and their neighbours in dark green and the Amazon hatched; on the chicken map, Maranhão and Piauí in dark green. In the fourth frame, diverging bars of the six largest federal-inspection balances by state, for cattle (São Paulo +428 thousand) and pigs (Paraná +792 thousand, Rio Grande do Sul −616 thousand). In the panel, the four states with the most slaughter of each species, with their share of the country’s slaughter and herd."
metodo: "Index = (head slaughtered in the state in 2025 ÷ the state’s 2025 herd) ÷ (the same for Brazil), for cattle, pigs and chickens (all fowl minus laying hens); IBGE slaughter, all types of inspection, summing the four quarters. SIF balance = head slaughtered under federal inspection in the state (IBGE) minus head slaughtered under federal inspection coming from the state (MAPA)."
---

# Raised here, slaughtered there: slaughter against herd by state, 2025

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 163, the second in the collection **Where livestock becomes residue**. Slaughter residue
stays where the animal is killed, not where it was raised. Setting each state’s slaughter against
its herd shows who takes in animals from elsewhere and who sends them away.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `ufs` | polygon | 27 states: for `bovinos`, `suinos` and `frangos`, `_abate`, `_rebanho`, `_indice` and `_classe` (−1 = withheld); for cattle and pigs, `_sif_abatido_na_uf`, `_sif_vindo_da_uf` and `_sif_saldo` |
| `limite_nacional` | polygon | national outline |

The **GPKG** is zipped and attached to the
[`abate-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/abate-br-2026),
with **QGIS styles** stored inside (one style per species). The **CSVs** sit in this folder, in
UTF-8: the states and the national totals.

## Method

1. IBGE Quarterly Survey of Animal Slaughter (SIDRA tables 1092, 1093 and 1094, fetched through the
   API on 01/11/2026): head slaughtered by state and quarter, across all types of inspection
   (federal, state and municipal). Slaughter in 2025 is the sum of the four quarters; if any quarter
   is withheld («X»), the state is left blank.
2. IBGE Municipal Livestock Survey 2025 (table 3939): cattle, pig and fowl herds by state. To compare
   with chicken slaughter, the stock is all fowl minus laying hens.
3. Index = (slaughter ÷ herd in the state) ÷ (slaughter ÷ herd in Brazil). In Brazil, in 2025, 0.18
   head of cattle was slaughtered per head of stock, 1.38 pigs and 5.09 chickens. Classes: under
   0.25; 0.25 to 0.67; 0.67 to 1.5; 1.5 to 3; 3 or more.
4. Federal-inspection check: the IBGE gives the head slaughtered under federal inspection in each
   state’s plants; the SIGSIF slaughter report (MAPA) gives the head slaughtered under federal
   inspection by state of origin. The difference is the balance: positive, the state kills animals
   from elsewhere; negative, it sends animals out.

## Reading

- São Paulo has the highest cattle index, 2.53: it slaughtered 4.77 million head in 2025 from a
  herd of 10.3 million (11.1% of national slaughter, 4.4% of the herd). By federal inspection data,
  428 thousand of the cattle killed there came from other states, 12% of São Paulo’s federally
  inspected slaughter. Maranhão (−77 thousand), Goiás (−65 thousand) and Mato Grosso do Sul
  (−57 thousand) send out the most.
- After São Paulo come Sergipe (1.31), Mato Grosso (1.26), Mato Grosso do Sul (1.19) and Rondônia
  (1.15). In Bahia, Ceará, Maranhão, Piauí, Rio Grande do Norte, Rio de Janeiro and Roraima the
  index lies between 0.25 and 0.67.
- For pigs, Paraná took in 792 thousand head from elsewhere under federal inspection, São Paulo 509
  thousand and Minas Gerais 488 thousand; Rio Grande do Sul sent out 616 thousand, Santa Catarina
  279 thousand and Mato Grosso 215 thousand.
- Bahia (0.18), Ceará (0.13) and Pernambuco (0.07) have pigs in the herd that barely appear in
  inspected slaughter: they are killed without inspection or in another state.
- For chickens, the highest indices are Santa Catarina (1.45), Mato Grosso (1.36), Tocantins (1.32)
  and Goiás (1.31); Maranhão and Piauí sit under 0.25.

## Limitations

- The IBGE only counts inspected slaughter. A low index may mean animals sold to another state or
  killed without inspection; the map cannot tell the two apart.
- States with any quarter withheld are left blank: AP, DF and PB for cattle; AC, AM, AP, PA, RR, SE
  and TO for pigs; AC, AL, AM, AP, DF, RN, RR and SE for chickens.
- The herd is a stock on 31 December and slaughter a flow over the year; the index compares the two
  only against the national average.
- The chicken stock is all fowl minus laying hens, an approximation of the broiler flock.
- MAPA’s data dictionary does not make clear whether «UF de procedência» is the animal’s state of
  origin; the check reads it that way. The two sides of the balance come from different surveys and
  do not match exactly.

## Data licence

IBGE and MAPA open data, free to use with attribution.
