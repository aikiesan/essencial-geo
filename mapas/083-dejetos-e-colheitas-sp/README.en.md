---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Manure and harvests"
subtitulo: "Housed-herd manure replaces 46% of the phosphorus harvests remove, 25% of the nitrogen"

contexto: >-
  São Paulo’s harvests take from the soil, every year, about 700,000 tonnes of nitrogen, 194,000 of P₂O₅ and 555,000 of K₂O, by 2024 PAM production and IPNI contents. The manure of poultry, pigs and dairy cows, the part that can be collected, holds 172,000, 89,000 and 87,000: it replaces 46% of the phosphorus, 25% of the nitrogen and 16% of the potassium. Sugarcane weighs on the account: it removes half the nitrogen and 71% of the potassium, and part of that returns to the canefields with vinasse and filter cake. Of the 527 municipalities with at least 1,000 hectares harvested, 114 have manure to replace all the phosphorus, 54 all the nitrogen and 36 all the potassium. In the grain regions the account does not balance: Itapeva removes 21,800 tonnes of N at harvest, and local manure covers 3.3%. Third plate of the collection “Manure that feeds the soil”.

imagem: ./mapa_preview.en.png
imagem_alt: "Three maps of São Paulo’s municipalities in six shades of green, by the share of the nitrogen, phosphorus and potassium removed by harvests that poultry, pig and dairy manure replaces; municipalities with under 1,000 harvested hectares in pale grey. Phosphorus is the darkest map, with dark green in the centre-east and the west; potassium the palest. Callouts point to Itapeva, where manure covers 3.3% of the nitrogen, Bastos, with 129 times the harvest’s phosphorus, and Guaíra, with 0.6% of the potassium. In the fourth frame, bars of manure and removal statewide, with the sugarcane share."

recorte: "São Paulo State (SP)"
metodo: "N, P₂O₅ and K₂O in poultry, pig and dairy manure (2024 PPM × IPCC 2019 and MWPS-18) over the N, P₂O₅ and K₂O removed by the municipality’s temporary and permanent crops (2024 PAM production × IPNI Brazil contents in the harvested product), in six classes, in municipalities with at least 1,000 hectares harvested."
---

# Manure and harvests: how much of what crops take the manure gives back

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 083, the third of four in the collection **Manure that feeds the soil**: the Eurostat and
OECD gross nutrient balance, reduced to two terms, input from manure and output at harvest. The manure
comes from plates [081](../081-nitrogenio-dos-dejetos-sp/README.en.md) and
[082](../082-fosforo-dos-dejetos-sp/README.en.md).

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `n_conf_t`, `p2o5_conf_t`, `k2o_conf_t` (poultry, pig and dairy manure); `n_exporta_t`, `p2o5_exporta_t`, `k2o_exporta_t` (crop removal); `cob_n_pct`, `cob_p2o5_pct`, `cob_k2o_pct` (manure over removal); `area_lavoura_ha`; the collection’s other fields |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The **GPKG** and **CSV** are the collection’s, published with plate 081; this plate’s QGIS styles are
`cob_n_pct`, `cob_p2o5_pct` and `cob_k2o_pct`. The **coefficients** CSV gives each crop’s contents.

## Method

1. **Output: removal at harvest.** Production of each temporary and permanent crop in the 2024 PAM
   (tables 1612 and 1613, retrieved through the SIDRA API on 18/10/2026) times the N, P and K content
   of the harvested product from the IPNI Brazil (now NPCT) balance calculator, with P and K converted
   to P₂O₅ (× 2.2914) and K₂O (× 1.2046). Nineteen crops are included, 97.8% of the state’s harvested
   area; tangerine and lime use the orange contents. Per tonne harvested, for instance: sugarcane
   0.83 kg of N, 0.25 of P₂O₅ and 0.94 of K₂O; soy 59.2, 12.6 and 22.6; maize 13.5, 4.8 and 3.7.
2. **Input: collectable manure.** N, P₂O₅ and K₂O in the manure of hens, broilers, pigs, sows and
   milked cows, as on plate 082 (K₂O/N also from table 6 of MWPS-18).
3. **Coverage.** Manure over removal, by nutrient, in six classes closed on the right: up to 5, 5 to
   15, 15 to 30, 30 to 60, 60 to 100 and over 100%. Municipalities with under 1,000 harvested hectares
   are grey: there the ratio loses meaning (in the capital, for instance, it would exceed 600%).

## Limitations

- **These are estimates**, and the account is partial. The full balance also adds mineral fertiliser,
  biological fixation, deposition and seed, and subtracts losses. Mineral fertiliser is left out
  because ANDA does not publish deliveries by municipality as open data.
- Harvested-product contents vary with variety, yield and management; IPNI’s are means. Sorghum, at
  7.5 g of P per kg in the IPNI table, is high for the grain, and is used as published.
- Soy takes nearly all its nitrogen from the air through biological fixation; N removal in the grain
  regions is not all nitrogen that needs replacing.
- On sugarcane, vinasse, filter cake and straw already return part of the potassium and nitrogen to
  the fields; the account leaves them out.
- Coverage assumes manure stays in the municipality where it arises; in practice, poultry litter and
  hen manure travel hundreds of kilometres.
