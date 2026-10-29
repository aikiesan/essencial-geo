---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The bagasse goes to the boiler"
subtitulo: "Nine tenths of the bagasse already becomes steam and electricity at the mills; the digester gets the surplus"

contexto: >-
  The second step of the biomethane funnel removes what already has another use: 8.2 billion m³ of methane a year, 35% of São Paulo’s theoretical (CP2B, from N2 to N3, reference scenario). Almost all of it, 7.5 billion, is sugarcane bagasse, which the mills burn in their boilers for steam and electricity; the method respects that use and only counts the surplus, 10% of the bagasse, as available. The rest of the step is small: 0.37 billion of straw, grain, poultry litter and prunings with another use, 0.12 of orange bagasse that becomes animal feed and 0.23 that already becomes biogas, 71% of it from landfill waste. The map follows the cane: Guaíra and Sertãozinho exceed 240 million m³ each; the Metropolitan Region and the Paraíba Valley barely show, except for existing biogas, 70 million m³ in the capital. It is a model, not a measurement. Third plate of “The biomethane funnel”.

imagem: ./mapa_preview.en.png
imagem_alt: "Choropleth map of São Paulo municipalities in six shades, from pale yellow to wine, by the methane the collected residue would yield but that already has another use. Wine, over 100 million m³ a year, forms patches in the north, around Guaíra, Barretos and Ribeirão Preto, and in the west, near Araçatuba and Presidente Prudente; the east, the Metropolitan Region, the Paraíba Valley, the Ribeira Valley and the coast are pale yellow. Blue rings mark the biogas that already exists, the largest in the capital. Callouts point to Guaíra, with 244 million m³ of methane from bagasse that goes to the boiler, Guariba, with 37 million m³ of vinasse, filter cake, bagasse and straw that already become biogas, and São Paulo, with 70 million m³ from waste that is already captured. In the panel, bars show where it goes: 7.47 billion m³ of bagasse to boilers and cogeneration, 0.37 of straw, grain, poultry and prunings, 0.12 of orange bagasse to animal feed, 0.02 of coffee husk to dryers and 0.23 that already becomes biogas."

recorte: "São Paulo State (SP)"
metodo: "For each municipality and residue, the technical potential (N2) times one minus CP2B v5.1’s available fraction (FCo), in normal m³ of methane a year, reference scenario: the methane of competing uses, grouped by destination (cane bagasse, orange bagasse, coffee husk, others). The rings are what already becomes biogas, which the method deducts to reach N3."
---

# The bagasse that goes to the boiler in São Paulo

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 118, the third of five in the collection **The biomethane funnel**: the second step of the
funnel, from technical (N2) to mobilisable potential (N3), and the methane that already has another use
in each municipality.

## What the files contain

- `dados/sp_funil_municipios.csv`: one row per municipality. This plate uses `perda_usos_m3` (competing
  uses), `usos_bagaco_m3`, `usos_citros_m3`, `usos_cafe_m3`, `usos_outros_m3`, `ja_em_uso_m3` (what
  already becomes biogas) and `ja_em_uso_rsu_m3` (the part that comes from waste).
- `sp_funil_biometano.gpkg.zip` (in the `funil-sp-2026` release): in the `municipios` layer, the
  `usos_concorrentes` style reproduces the map’s classes.

## Method

1. For each municipality and residue, CP2B v5.1’s N2 times one minus the available fraction (FCo): what
   goes to uses that exclude the digester. In the reference scenario, the FCo of cane bagasse is 10%
   (5% at the minimum, 15% at the maximum): the rest goes to the boilers.
2. The destinations: cane bagasse (boilers and cogeneration), orange bagasse (animal feed), coffee husk
   (dryers) and others (straw, grain, poultry litter and prunings).
3. From what remains, the method deducts what already becomes biogas today (landfills, sewage works,
   mills), so as not to count it twice; this gives N3. The map’s rings show that deduction where it
   exceeds 2 million m³.

## Limitations

- A competing use is not waste: the bagasse burnt powers the mills themselves and the electricity they
  sell. The map shows what the digester does not compete for, not what is lost.
- FCo is one factor per residue, the same across the state; a mill that already has surplus bagasse or
  already makes biogas from vinasse looks no different from the others, except for the deduction of
  existing biogas.
- It is a model, not a measurement; plate 120 shows how much the result changes between scenarios.
