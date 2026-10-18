---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Biogenic versus fossil"
subtitulo: "In the state’s large fixed sources, half the CO₂ comes from sugarcane"

contexto: >-
  The gas leaving an ethanol vat is almost 100% CO₂; a combustion stack carries 3% to 15%. That is why mills are among the easiest sources to capture. In 2024, São Paulo’s vats released about 10.1 million t of biogenic CO₂. Natural gas burnt by industry, cogeneration and power plants, fuel oil and coke added up to 9.3 million t of fossil CO₂, on the SEMIL Energy Yearbook and IPCC factors. In these large fixed sources, 52% of the CO₂ comes from sugarcane. The map splits: across the cane-growing interior, 116 municipalities have more biogenic than fossil CO₂; fossil CO₂ concentrates in the capital (850,000 t), Cubatão (738,000), Santa Gertrudes, Paulínia and Jacareí. In Piracicaba the two mix: 34% is biogenic. The fossil figure here is a floor. Third plate of the collection “Biogenic carbon”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo with circles proportional to the 2024 CO₂ from each municipality’s large fixed sources, adding ethanol vats and the burning of natural gas, fuel oil and coke, coloured by biogenic share: from purple, almost all fossil, to dark green, almost all biogenic. The greens cover the interior, in the north and west; the purples cluster in Greater São Paulo, Cubatão, Campinas and the Paraíba Valley. Callouts point to Cubatão, with 738 kt of fossil CO₂, Guaíra, with 310 kt, all from the vats, and Piracicaba, 34% biogenic. In the panel, bars compare the vats, the possible biogas, fossil fixed sources and all the state’s fossil energy, 77 million t."

recorte: "São Paulo State (SP)"
metodo: "Fossil CO₂ in 2024 by municipality: industrial, cogeneration and power-generation natural gas use and fuel oil and petroleum coke use (SEMIL Energy Yearbook), times the BEN net calorific value and the IPCC 2006 emission factor; biogenic CO₂ in 2024: ethanol fermentation estimated as in plate 089; biogenic share = biogenic ÷ (biogenic + fossil)."
---

# Biogenic and fossil CO₂ in São Paulo’s large fixed sources

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 091, the third of four in the collection **Biogenic carbon**: how much of the state’s
concentrated CO₂ comes from sugarcane, and how much from burning fossil fuel in fixed sources.

## What the files contain

- `dados/sp_carbono_municipios.csv`: this plate’s fields are `co2_fermentacao_2024_t`,
  `co2_fossil_gas_t`, `co2_fossil_oleo_t`, `co2_fossil_coque_t`, `co2_fossil_estacionario_t` (the
  sum of the three), `co2_fossil_energia_t` (CO₂ from all energy, from the Yearbook’s Table 9) and
  `pct_biogenico_grandes`, empty where there is neither a vat nor a fixed fossil source.
- `sp_carbono_biogenico.gpkg.zip` (in the `carbono-sp-2026` release): in the `municipios` layer,
  the `pct_biogenico` and `co2_fossil_estacionario` styles.

## Method

1. Fossil use: from the Energy Yearbook by Municipality 2025 (base year 2024), natural gas for the
   industrial, cogeneration and power-generation sectors (Table 4, in m³) and fuel oil and
   petroleum coke (oil products table, in kg). Residential, commercial and vehicle gas is left
   out: these are small, scattered sources.
2. Factors: natural gas at 8,800 kcal/m³, fuel oil at 9,590 kcal/kg and coke at 8,390 kcal/kg (net
   calorific values from BEN 2025), times 56,100, 77,400 and 97,500 kg of CO₂ per TJ (IPCC 2006,
   vol. 2, Table 1.4): 2.067 kg of CO₂ per m³ of gas, 3.108 kg per kg of oil and 3.425 kg per kg
   of coke.
3. Biogenic: fermentation CO₂ in 2024, estimated as in plate 089, with that year’s output
   (13.7 billion litres).
4. Biogenic share: biogenic ÷ (biogenic + fixed fossil), in the 248 municipalities with at least
   one of the two. Statewide, 10.1 ÷ (10.1 + 9.3) = 52.1%.
5. Purity: the IPCC (2005, Table 2.1) gives about 100% CO₂ in bioethanol fermentation gas,
   against about 3% to 15% in combustion flue gases.
6. Check: the municipal natural gas total matches the state row in the Yearbook’s Table 3
   (4.78 billion m³), and CO₂ from all energy matches Table 7 (77.4 million t).

## Data downloaded

- SEMIL, Energy Yearbook by Municipality of São Paulo State 2025, base year 2024 (PDF), linked from
  <https://semil.sp.gov.br/anuario-de-energeticos-por-municipios-do-estado-de-sao-paulo/>:
  <https://smastr16.blob.core.windows.net/home/2026/03/Anuario-de-Energeticos-por-Municipios-do-Estado-de-Sao-Paulo-2025-ano-base-2024-1.pdf>,
  downloaded on 18/10/2026; the tables were read from the PDF’s text.
- ANP, `pb-da-etanol.zip` (see plate 089), downloaded on 18/10/2026.

## Limitations

- The fossil figure is a floor, and the biogenic share a ceiling. The Yearbook sees fuel sold in
  each municipality; refineries’ own use (Paulínia, Cubatão, São José dos Campos, Mauá), mineral
  coal and coke in steelmaking, and process CO₂ from cement and lime calcination, which does not
  come from fuel, are all left out.
- CO₂ from burning bagasse in the mills’ boilers, also biogenic, is not included: only
  fermentation CO₂, which is the concentrated stream.
- Fermentation is estimated, not measured (see plate 089), and each municipality’s point is its
  interior point, not the plant.
- Municipalities are the Yearbook’s smallest unit; one large factory and many small ones look the
  same.
