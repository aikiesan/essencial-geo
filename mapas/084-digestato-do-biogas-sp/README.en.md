---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Biogas digestate"
subtitulo: "If manure went through digesters, 98,000 t of N and 49,000 t of P₂O₅ a year would return to the fields"

contexto: >-
  The biomethane potential of poultry, pig and cattle manure in São Paulo, at CP2B’s accessible level, is 1.29 million m³ a day. The digestate left by that biogas keeps the manure’s nutrients: about 98,000 tonnes of nitrogen, 49,000 of P₂O₅ and 48,000 of K₂O a year, equal to 25% of the phosphorus, 14% of the nitrogen and 9% of the potassium that the state’s harvests remove. Three quarters of the nitrogen would come from poultry farms. In 61 municipalities with at least 1,000 hectares harvested, digestate would supply all the P₂O₅ of the harvest. Bastos would have 2,200 tonnes of P₂O₅ in digestate, a hundred times what its crops remove; Botucatu, with 43,000 hectares of crops, 117%. Sugarcane, which makes up most of CP2B’s potential, is left out: vinasse, filter cake and straw already go back to the fields. Fourth and last plate of the collection “Manure that feeds the soil”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo’s municipalities in six shades of green, by the share of the phosphorus removed by harvests that manure biogas digestate replaces, with hollow wine-coloured circles sized by the P₂O₅ in the digestate. Dark green concentrates in the centre-east, from Sorocaba to Campinas, at Bastos and at Mococa; the west and north are pale. Callouts point to Bastos, with 2,198 tonnes of P₂O₅ and 73,000 m³ of biomethane a day, and Botucatu, where digestate covers 117% of the harvest’s phosphorus. In the panel, the classes, the circle key and the origin of the digestate nitrogen."

recorte: "São Paulo State (SP)"
metodo: "Methane at level N4 of CP2B v5.1 (reference scenario) for manure from broilers and laying hens, pigs, and dairy, feedlot and grazing cattle, converted into equivalent head with each substrate’s mean parameters and multiplied by the N, P₂O₅ and K₂O excreted per head (IPCC 2019 and MWPS-18); digestate keeps these nutrients. Colour: digestate over the P₂O₅ removed by the municipality’s harvests (2024 PAM × IPNI), in six classes; circles: tonnes of P₂O₅."
---

# Biogas digestate from manure

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 084, the fourth and last in the collection **Manure that feeds the soil**. What manure gives
back without a digester is on [plate 083](../083-dejetos-e-colheitas-sp/README.en.md).

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `dig_n_t`, `dig_p2o5_t`, `dig_k2o_t` (nutrients in digestate); `dig_biometano_m3_dia`; `dig_cob_n_pct`, `dig_cob_p2o5_pct`, `dig_cob_k2o_pct` (digestate over crop removal); the collection’s other fields |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The **GPKG** and **CSV** are the collection’s, published with plate 081; this plate’s QGIS style is
`dig_cob_p2o5_pct`.

## Method

1. **Potential.** Methane per year at the accessible level N4 of CP2B v5.1, reference scenario, for
   the six manure substrates: broilers, laying hens, pigs, dairy cattle, feedlot cattle and grazing
   cattle. Biomethane is the equivalent CP2B publishes.
2. **Equivalent head.** Methane divided by one animal’s methane, using CP2B’s own mean parameters for
   each substrate (manure per head, total solids, volatile solids and biochemical methane potential).
   Each substrate maps to a herd category: broiler, hen, pig, milked cow, feedlot animal (IPCC
   coefficient for high-productivity systems) and beef animal.
3. **Nutrients.** Equivalent head times the N, P₂O₅ and K₂O excreted per head (IPCC 2019 and MWPS-18,
   as on plates 081 and 082). Digestion removes carbon as methane and carbon dioxide and keeps the
   nitrogen, phosphorus and potassium, which leave in the digestate.
4. **Comparison.** Digestate over the P₂O₅ removed by the municipality’s harvests (plate 083), in six
   classes closed on the right: up to 5, 5 to 15, 15 to 30, 30 to 60, 60 to 100 and over 100%.
   Municipalities with no manure potential or under 1,000 harvested hectares are grey. Circles for
   municipalities with at least 50 tonnes of P₂O₅ in digestate.

## Limitations

- **These are estimates.** CP2B’s potential is technical, not an installed fleet of digesters; the
  nutrients come from mean per-head coefficients and from converting methane back into head, and
  carry the uncertainty of both.
- Animal manure only. Sugarcane (82% of CP2B’s potential in the state, whose residues, vinasse, filter
  cake and straw, already go back to the fields), other crops and urban waste and sewage are left out.
- Part of the nitrogen is lost as ammonia when digestate is stored and spread; the figure is the
  nitrogen that enters the digester.
- Mineral fertiliser delivered in the state is not compared: ANDA does not publish deliveries by
  municipality as open data. The comparison is with what harvests remove.
