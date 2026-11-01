---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Distilling under court protection"
subtitulo: "41 of the 43 distilleries with the tag already carried it in 12/2018"
contexto: >-
  In August 2026, 43 of the 370 distilleries authorised by the ANP had «em recuperação judicial» (in judicial recovery) in their registered company name: 7.7% of the country’s ethanol capacity, 21.7 thousand m³ a day, from 31 companies. It is not a recent wave: 41 of them already carried the tag in December 2018, when there were 58 holding 11.4% of capacity; since then, 13 left the register, 4 changed CNPJ and only 2 came in. The weight is greatest in Paraná, where the 12 tagged distilleries, ten from one company, hold 37% of the state’s capacity; São Paulo has another 12, but only 6.9%. In Sergipe, Rio Grande do Norte and Rio de Janeiro, a single tagged distillery holds close to half of state capacity. The tag comes from the registered name, required by law during the proceedings; the plate does not check each case in court. Third plate in the collection «The new geography of ethanol».
imagem_alt: "Map of Brazil in Albers conic projection with the states coloured by the share of ethanol capacity in distilleries whose name carries «em recuperação judicial», in four tones from pink to brown, light grey for states with distilleries but none tagged and white for those with no distillery. Paraná, Rio de Janeiro, Sergipe and Rio Grande do Norte take the darkest tone, Alagoas the next, São Paulo and Goiás the middle one and Minas Gerais, Mato Grosso and Mato Grosso do Sul the lightest. On top, circles by municipality, their area proportional to capacity: filled purple for the tagged distilleries and grey rings for the others, crowded in São Paulo, Goiás and northern Paraná. Two callouts: Paraná, with 37% of capacity and 12 tagged distilleries, 10 of them from one company, and São Paulo, with 12 distilleries and 7.7 thousand m³/day, 6.9% of São Paulo’s capacity. The panel holds the classes with their states, bars of the 58 tagged distilleries in 12/2018 and the 43 in 08/2026, and the monthly line of the national capacity share, from 11.4% to 7.7%."
metodo: "Distilleries in the ANP panel in 08/2026 whose registered company name contains «em recuperação judicial», with authorised capacity (the larger of anhydrous and hydrous) summed by state and compared with the state’s total capacity; the flow by CNPJ compares 12/2018 and 08/2026."
---

# Distilling under court protection: distilleries with the tag in their name, by state, 2018 and 2026

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 134, the third in the **The new geography of ethanol** collection. While capacity climbs
into the Centre-West, part of it remains in companies under court protection — almost always the
same ones since 2018, and more in Paraná and the North-East than in the Centre-West.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `usinas` | point | 370 distilleries of 08/2026: `cnpj`, `razao_social` (as registered with the ANP), `SIGLA_UF`, `CD_MUN`, `NM_MUN`, `regiao`, `anidro_m3d`, `hidratado_m3d`, `capacidade_m3d`, `recuperacao_judicial` |
| `ufs` | polygon | 27 states: `SIGLA_UF`, `regiao`, `cap_total_m3d`, `usinas_rj`, `cap_rj_m3d`, `pct_rj` and `classe` (−1 no tagged distillery, −2 no distillery) |
| `limite_nacional` | polygon | national boundary |

The **GPKG** is zipped and attached to the
[`etanol-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/etanol-br-2026).
The layers carry the plate’s **QGIS style**. The **CSV** sits in this folder, in UTF-8, with the
distilleries table without geometry. The files reproduce the ANP’s public register, with company
name and CNPJ; the plate shows only counts and capacities, without naming companies.

## Method

1. The ANP Ethanol Producers Dynamic Panel (`pb-da-etanol.zip`, downloaded on 18/10/2026), files
   `Etanol_Capacidade 2018_2020.csv` and `Etanol_Capacidade 2021_2026.csv`: one row per distillery
   (CNPJ) and month, with the registered company name and authorised capacity for anhydrous and
   hydrous ethanol, in m³/day. Each distillery’s capacity is the larger of the two.
2. Tag: the company name, without accents and in capitals, contains «RECUPERACAO JUDICIAL». Law
   11,101/2005, art. 69, requires «em Recuperação Judicial» to be added to the company name in every
   act of the debtor during the proceedings.
3. By state, the capacity of the tagged distilleries divided by the capacity of all the state’s
   distilleries in 08/2026. Classes: up to 5%, 5 to 15%, 15 to 30% and 30% or more.
4. Companies counted by CNPJ root (the first eight digits): 31 among the 43 tagged distilleries,
   279 among the 370.
5. Flow by CNPJ between 12/2018 and 08/2026. Of the 58 distilleries tagged in 12/2018, 41 still
   carry the tag, none dropped it from their name while staying registered and 17 left the register.
   Of those 17, 4 were counted as «new CNPJ»: in the same municipality, a CNPJ that did not exist in
   12/2018 appears in 08/2026 with the same capacity — probably a change of operator, not a
   closure. Two distilleries tagged in 08/2026 were not on the register in 12/2018.
6. The monthly series (share of national capacity with the tag) starts in 12/2018: throughout 2018,
   the panel takes in distilleries (273 in January, 371 in December).
7. Each municipality is drawn at an interior point of its polygon; municipalities with several
   distilleries add them all at one point.

## Reading

- Tagged distilleries are smaller than the rest: 506 m³/day on average, against 800.
- The tag is old: at least half of the 43 carry it in all 104 months of the panel, from 01/2018 to
  08/2026, and 29 already had it in the first month.
- By region, the South-East has 15 tagged distilleries (9.0 thousand m³/day), the South 12 (5.0
  thousand), the Centre-West 10 (5.6 thousand) and the North-East 6 (2.1 thousand); the North, none.
- The national share fell from 11.4% (12/2018) to 7.7% (08/2026), more through exits and the growth
  of the other distilleries than through companies leaving the proceedings.

## Limitations

- The tag comes from the name registered with the ANP, which may lag the courts: a company that has
  left recovery may keep the old name for a while, and the reverse. The plate does not check each
  case.
- Authorised capacity is not output: a distillery in recovery may be idle, and the map does not
  say how much each one produces.
- Leaving the register does not tell closure, sale or merger apart; the «new CNPJ» rule only catches
  changes with the same municipality and the same capacity.
- Judicial recovery is not bankruptcy: it is the process in which a company keeps operating while
  it renegotiates its debts.

## Data licence

ANP and IBGE open data, free to use with attribution.
