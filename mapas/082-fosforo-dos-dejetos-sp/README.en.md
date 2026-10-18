---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The phosphorus in manure"
subtitulo: "In 177 municipalities, farms yield more phosphorus than the harvest removes"

contexto: >-
  Poultry, pigs and dairy cows live in sheds and byres, and their manure can be collected: about 88,500 tonnes of P₂O₅ a year in São Paulo, 5.2 kg per farmland hectare. Broilers give 45%, milked cows 33%, laying hens 12% and pigs 10%. Phosphorus builds up where farms cluster: Bastos has 188 kg of P₂O₅ per hectare, Cerquilho 131, Jumirim 98, Cabreúva and Porangaba 81. In 177 municipalities, manure phosphorus exceeds what the municipality’s own harvests remove; together they hold 51,000 tonnes of P₂O₅ in manure, 33,000 more than their crops take. In Bastos, manure holds 130 times the phosphorus of the harvest; in Mococa, with 6.75 million broilers, twice as much. Second plate of the collection “Manure that feeds the soil”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo’s municipalities in six shades from pink to wine, by the phosphorus (P₂O₅) in poultry, pig and dairy manure per hectare of farmland, with fine stripes on the 177 municipalities where that phosphorus exceeds what local harvests remove. The darkest shades form a belt from Sorocaba to Campinas and patches at Bastos and Mococa; the west and the sugarcane north are pale. Callouts point to Bastos, with 2,761 tonnes of P₂O₅, 130 times what its crops remove, and Mococa, with twice as much. In the panel, the share of phosphorus in each class and the phosphorus by herd."

recorte: "São Paulo State (SP)"
metodo: "Head counts of hens, broilers, pigs, sows and milked cows in the 2024 PPM times the P₂O₅ excreted per head per year (IPCC 2019 nitrogen times the MWPS-18 P₂O₅/N ratio), per hectare of 2024 MapBiomas farmland, in six classes; stripes where that P₂O₅ exceeds the municipality’s crop removal (2024 PAM × IPNI contents)."
---

# The phosphorus in poultry, pig and dairy manure

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 082, the second of four in the collection **Manure that feeds the soil**. Nitrogen from all
herds is on [plate 081](../081-nitrogenio-dos-dejetos-sp/README.en.md), with the collection’s GPKG
and the coefficients table.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: 2024 PPM herds; `n_conf_t`, `p2o5_conf_t` and `k2o_conf_t` (manure of hens, broilers, pigs, sows and milked cows); `p2o5_kg_ha_agro`; `p2o5_exporta_t` (crop removal, plate 083); the collection’s other fields |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The **GPKG** and **CSV** are the collection’s, published with plate 081 and repeated here; this
plate’s QGIS style is `p2o5_kg_ha_agro`.

## Method

1. **Housed herds only.** Poultry, pigs and dairy cows are kept in sheds, pens and byres, and their
   manure is collected, stored and carted. Beef cattle and small ruminants, which leave their manure
   on pasture, are left out of this plate.
2. **P₂O₅ per head.** Each animal’s nitrogen (IPCC 2019, as on plate 081) times the P₂O₅/N ratio of
   as-excreted manure in table 6 of MWPS-18 (2004). Per head per year: milked cow 37.2 kg; sow 12.2;
   pig 5.2; hen 0.18; broiler 0.27.
3. **Per hectare.** Sum over the 2024 MapBiomas farmland, in six classes closed on the right: up to 1,
   1 to 3, 3 to 6, 6 to 12, 12 to 25 and over 25 kg of P₂O₅ per hectare.
4. **Stripes.** Where the P₂O₅ in that manure exceeds the P₂O₅ the municipality’s harvests remove, by
   the plate 083 calculation (2024 PAM production times IPNI Brazil contents in the harvested product).

## Limitations

- **These are estimates.** The P₂O₅/N ratio comes from North American herds (MWPS-18); feed and the
  use of phytase change manure phosphorus. Table 3 in Gatiboni and Nicoloso (Embrapa, 2019), based on
  Brazilian data, gives 36.8 kg of P₂O₅ a year for a dairy cow, close to the 37.2 used here.
- More phosphorus in manure than in the harvest does not mean pollution: soil holds phosphorus, and
  manure can leave the municipality. The stripes show where the local account does not balance.
- The PPM counts animals on a single day; broiler farms raise several flocks a year.
- 28 municipalities with no PPM data are hatched as no data, never as zero.
