---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The CO₂ from the vats"
subtitulo: "Every ethanol mill gives off an almost pure gas that now goes into the air"

contexto: >-
  In the fermentation vat, yeast turns cane sugar into ethanol and releases CO₂ in step: 0.955 kg of gas per kg of alcohol, about 0.75 t per m³. It is almost pure CO₂, of biological origin, and today it goes into the air. In the 2025/26 harvest, São Paulo’s mills made 12.1 billion litres of ethanol; by stoichiometry, about 8.9 million tonnes of CO₂ left the vats, from 145 mills in 119 municipalities. Guaíra, with three mills, leads with about 271,000 t; Pitangueiras, Sertãozinho and Buritizal each pass 190,000. The gas follows the crushing season: 1.4 million t in August and almost nothing from December to March. As ANP publishes output only by state, each mill’s share is estimated from its authorised capacity; everything here is an estimate. First plate of the collection “Biogenic carbon”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state with brick-red circles, proportional to the fermentation CO₂ estimated in each municipality in the 2025/26 harvest, over lightly tinted municipalities that have a mill. The circles cluster in the north and centre of the state, around Ribeirão Preto, and thin out to the east and south. A callout points to Guaíra, with 271 kt from three mills, the largest point in the state; another points to Piracicaba, with 115 kt, 10 km from a gas pipeline. In the panel, monthly bars show the CO₂ concentrated from May to October and almost nil from December to March, and further bars list the six largest municipalities."

recorte: "São Paulo State (SP)"
metodo: "São Paulo’s anhydrous and hydrous ethanol output in the 2025/26 harvest (ANP, by month) shared out among mills by their authorised capacity in each month, converted to mass by the density in the ANP specification and to CO₂ by the stoichiometry of alcoholic fermentation (0.955 kg of CO₂ per kg of ethanol); summed by municipality."
---

# The CO₂ from ethanol vats in São Paulo

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 089, the first of four in the collection **Biogenic carbon**: how much CO₂ ethanol
fermentation releases in each São Paulo municipality in one harvest.

## What the files contain

- `dados/sp_co2_fermentacao_usinas.csv`: one row per mill, with CNPJ (company tax number), company
  name, municipality, authorised anhydrous and hydrous capacity (m³/day), months with capacity in
  the harvest, share of the apportionment (%), estimated ethanol (m³), estimated CO₂ (t) and the
  municipality’s distance to the nearest gas pipeline (km).
- `sp_carbono_biogenico.gpkg.zip` (in the `carbono-sp-2026` release): the same GPKG as plates 089
  to 092. This plate uses the `usinas_etanol` layer (style `co2`) and, in the `municipios` layer,
  the fields `usinas_etanol`, `etanol_m3_safra`, `co2_fermentacao_t` and `co2_fermentacao_2024_t`.

## Method

1. Output: ANP publishes anhydrous and hydrous ethanol output by state and month. We summed São
   Paulo’s from April 2025 to March 2026 (the 2025/26 harvest): 5,141,755 m³ of anhydrous and
   6,952,582 m³ of hydrous. For plate 091 we also used the year 2024: 13,729,549 m³.
2. Apportionment: the same database gives, month by month, each mill’s authorised capacity. A
   mill’s weight is the sum, over the harvest months, of the larger of its two capacities
   (anhydrous or hydrous); the state’s output is divided by that weight.
3. Mass: anhydrous at 785.96 kg of ethanol per m³ (791.5 kg/m³, the density limit at 20 °C, times
   99.3% m/m, the minimum content); hydrous at 756.07 kg of ethanol per m³ (density 805.2 to
   811.2 kg/m³ with 92.5 to 94.6% m/m ethanol, at the mid-points). Source: ANP Resolution
   No. 907/2022, Table 1.
4. CO₂: in alcoholic fermentation, C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂. With IUPAC molar masses (CO₂
   44.009 g/mol, ethanol 46.068 g/mol), this gives 0.9553 kg of CO₂ per kg of ethanol, as in
   Kheshgi and Prince (2005): 0.751 t of CO₂ per m³ of anhydrous and 0.722 t per m³ of hydrous.
5. Distance: from the municipality’s interior point to the nearest transmission or distribution
   pipeline (EPE, via MapBiomas, the same database as plate 057).

A correction on the coefficient: the “about 0.76” figure often quoted is per **litre** of ethanol,
not per kg. By mass, stoichiometry gives 0.955 kg of CO₂ per kg of ethanol; by volume,
0.955 × 0.79 kg/L ≈ 0.75 kg of CO₂ per litre.

## Data downloaded

- ANP, `pb-da-etanol.zip`, linked from the Ethanol Producers Dynamic Panel page:
  <https://www.gov.br/anp/pt-br/assuntos/producao-e-fornecimento-de-biocombustiveis/etanol/arquivos-etanol/pb-da-etanol.zip>,
  downloaded on 18/10/2026 (files `Etanol_Capacidade 2021_2026.csv`, `Etanol_Produção.csv` and
  `Etanol_MatériaPrima.csv`).

## Limitations

- It is an estimate. Each mill’s actual output is not public; apportioning by authorised capacity
  assumes all mills use the same share of their capacity over the harvest.
- Each mill’s point is the municipality’s interior point, not the plant. Municipalities with
  several mills add them all at the same point.
- Only fermentation CO₂ is counted; the CO₂ from burning bagasse in the boilers, also biogenic,
  is left out.
- The CO₂ is released only during crushing, concentrated from May to October: any use or capture
  would need storage or seasonal operation.
- In the 2025/26 harvest the feedstock was almost all cane (131 million t) and molasses
  (7.4 million t); corn ethanol in São Paulo is marginal (24,000 t of corn).
