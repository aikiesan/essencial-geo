---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "What CO₂ could become"
subtitulo: "With green hydrogen, the cane would yield almost twice the gas the state uses"

contexto: >-
  With hydrogen, biogenic CO₂ can become fuel. One tonne of CO₂ plus 183 kg of H₂ gives 365 kg of methane, about 509 m³; with 137 kg of H₂, it gives 728 kg of methanol. Adding the vat CO₂ of the 2025/26 harvest (8.9 million t) to what upgrading the possible biogas would separate (9.1 million), São Paulo would have 18 million t a year: enough for 25 million m³ of e-methane a day, almost twice the natural gas the state used in 2024, or for 13 million t of methanol. But the sum calls for 3.3 million t of green hydrogen and 182 TWh of electricity, 1.2 times the state’s use. The Ribeirão Preto region holds 26% of the total, and 60% of the vat CO₂ lies over 50 km from a gas pipeline. It is a theoretical calculation and an estimate. Last plate of the collection “Biogenic carbon”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo with the eleven intermediate regions in five shades of grey-blue by the possible e-methane from biogenic CO₂, darkest in the north, in Ribeirão Preto and São José do Rio Preto, and almost white in São Paulo and São José dos Campos. On top, transmission pipelines in plum, along an axis from the west to Campinas and on to the capital and the Paraíba Valley, distribution networks in ochre, and brick-red circles in municipalities with over 100 kt of vat CO₂ a harvest, almost all in the north, far from the pipelines. A callout points to Guaíra, 150 km from the nearest pipeline. In the panel, the sum per tonne of CO₂ and bars of possible e-methane by region, split between vats and biogas."

recorte: "São Paulo State (SP)"
metodo: "Biogenic CO₂ by intermediate region (vats in the 2025/26 harvest, plate 089, plus upgrading of the possible biogas, plate 090), converted into e-methane (CO₂ + 4 H₂ → CH₄ + 2 H₂O) and e-methanol (CO₂ + 3 H₂ → CH₃OH + H₂O) at full conversion, with the hydrogen turned into electricity at 55 kWh per kg (electrolysis); distance from each municipality to the nearest gas pipeline."
---

# What São Paulo’s biogenic CO₂ could become

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 092, the last of four in the collection **Biogenic carbon**: how much fuel the CO₂ from
vats and biogas would make with green hydrogen, and how much electricity that would take.

## What the files contain

- `dados/sp_carbono_regioes.csv`: one row per intermediate region, with `co2_fermentacao_t`,
  `co2_biogas_t`, `co2_biogenico_t`, `h2_t` (hydrogen needed to methanate all the CO₂),
  `eletricidade_gwh`, `emetano_nm3_dia`, `emetano_mi_m3_ano`, `emetanol_t` (if the same CO₂ became
  methanol), `co2_fermentacao_ate_25km_t` (vat CO₂ in municipalities within 25 km of a pipeline)
  and `maior_fonte` (the municipality with the most vat CO₂).
- `sp_carbono_biogenico.gpkg.zip` (in the `carbono-sp-2026` release): the `regioes_carbono` layer
  (style `emetano`, with the map’s classes), the mills and the pipelines; in the `municipios`
  layer, `emetano_nm3_dia`, `km_gasoduto` and `km_gasoduto_transporte`.

## Assumptions

| | per t of CO₂ | source |
|---|---|---|
| Methanation (Sabatier): CO₂ + 4 H₂ → CH₄ + 2 H₂O | 183 kg of H₂ → 365 kg of CH₄ = 509 m³ (0 °C, 1 atm) | stoichiometry, IUPAC molar masses |
| Methanol synthesis: CO₂ + 3 H₂ → CH₃OH + H₂O | 137 kg of H₂ → 728 kg of methanol | stoichiometry |
| Water electrolysis | 55 kWh per kg of H₂ (range of 50 to 83 kWh/kg for today’s electrolysers) | IRENA (2020) |
| Electricity per t of CO₂ | 10.1 MWh (e-methane) or 7.6 MWh (e-methanol) | 55 kWh/kg × H₂ |

Conversion is taken as complete, with no losses in the reactor, compression or capture; the
figures are therefore a theoretical ceiling.

## Method

1. Biogenic CO₂: that of the vats in the 2025/26 harvest (plate 089, 8.88 million t) plus that of
   upgrading the possible biogas (plate 090, 9.13 million t), summed by IBGE intermediate region:
   18.0 million t a year in the state.
2. Fuel: e-methane and, alternatively, e-methanol, with the ratios in the table; e-methane per day
   is the annual figure divided by 365.
3. Comparison: with the natural gas used in São Paulo in 2024, 4.78 billion m³ (13.1 million m³ a
   day), and with electricity use, 146.9 TWh (SEMIL Energy Yearbook, base year 2024, converted at
   0.086 toe per MWh). The possible e-methane would give 25.1 million m³ a day, 1.9 times the
   state’s gas; that from the vats alone, 12.4 million m³, 95%. The electricity needed, 182 TWh, is
   1.2 times the state’s use; for the vats alone, 89.5 TWh, 61%.
4. Pipelines: distance from each municipality’s interior point to the nearest pipeline (EPE, via
   MapBiomas, plate 057), in four bands. Of the 8.9 million t of vat CO₂, 1.2 million lies within
   10 km of a pipeline, 1.1 at 10 to 25 km, 1.2 at 25 to 50 km and 5.3 million (60%) over 50 km.
   Guaíra, the largest source, is 150 km away.

## Limitations

- It is a theoretical calculation, an estimate: it does not say such plants are viable, only how
  much the carbon would yield.
- Vat CO₂ comes only in the harvest, from April to November; a continuous plant would need to
  store CO₂ or hydrogen, or stand idle part of the year.
- Green hydrogen would require new renewable generation; the electricity in the sum exceeds the
  state’s current use.
- Biogas CO₂ is a potential (plate 090): it exists only if the biogas is produced and upgraded.
- The Yearbook measures natural gas in commercial, not normal, cubic metres; the comparison with
  e-methane is approximate.
- The other route for this CO₂, geological storage (BECCS), depends on a surveyed reservoir and is
  not part of the sum.
