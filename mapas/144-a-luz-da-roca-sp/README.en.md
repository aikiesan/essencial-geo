---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Lights on the farm"
subtitulo: "Where each rural connection uses far more than the mean"
contexto: >-
  In 2024, each rural electricity connection in São Paulo used 12,852 kWh on average, 5.3 times a home’s consumption (2,409 kWh). The mean hides extremes: 83 municipalities sit at twice the mean or more and, with 9.5% of rural connections, take 39.5% of farm electricity; in the median municipality a rural connection uses 9,157 kWh. In Itaí, the 45 rural connections use 822 MWh each, 64 times the mean, and add up to 59% of the town’s electricity; Paranapanema comes next, at 515 MWh per connection. At the other end, Piedade has the state’s largest number of rural connections, 5,361, at 6.2 MWh each. The Yearbook’s rural class covers crops, livestock, irrigation, part of agro-industry and farm homes, and a few large connections are enough to pull up the mean of a small municipality.
imagem: ./mapa_preview.en.png
imagem_alt: "Choropleth map of São Paulo’s 645 municipalities by electricity per rural connection in 2024, divided by the state mean (12,852 kWh). Seven classes run from dark blue (less than half the mean) to dark brown (four times the mean or more); twelve municipalities are hatched, with no rural consumers or a Yearbook error. Blue dominates the west, the Ribeira Valley and the north coast; the browns gather in the north-east, between Ribeirão Preto and the Minas Gerais border, and in the south-west, around Itaí, Paranapanema and Avaré. Two callouts: Itaí, 822 MWh per connection, 45 connections, 59% of the town’s electricity; Piedade, 5,361 rural connections, 6.2 MWh each. The panel holds the legend with the number of municipalities per class and bars of the six largest uses per connection."
metodo: "Rural-class consumption (kWh) divided by the number of rural consumers in each municipality, from SEMIL/SP’s 2025 Municipal Energy Yearbook, and the result divided by the state mean; six municipalities whose rural kWh repeats another cell of the table are left out."
---

# Lights on the farm: electricity per rural connection in São Paulo’s municipalities in 2024

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 144, the first in the **Each town’s energy** collection. SEMIL/SP’s Municipal Energy
Yearbook counts, for each of the 645 municipalities, how many electricity consumers there are in each
class and how much each class used. The question here is how much each rural-class connection uses on
average, and where that number strays from the state mean.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `CD_MUN`, `NM_MUN`, `CD_RGINT`, `NM_RGINT`, `populacao_2022`, `rural_nc` (rural consumers), `rural_kwh`, `total_kwh` (all classes), `kwh_por_ligacao_rural`, `razao_media` (over 12,852 kWh), `pct_rural_na_eletricidade`, `classe` (0 to 6, empty with no data) and `aviso` (warning) |
| `regioes_intermediarias` | polygon | IBGE’s 11 intermediate regions: `CD_RGINT`, `NM_RGINT` |
| `limite_estadual` | polygon | state outline |

The **GPKG** is zipped and attached to the
[`energia-municipal-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/energia-municipal-sp-2026),
with the plate’s **QGIS style** on the `municipios` layer. The **CSV** sits in this folder, UTF-8,
without geometry. Field names and warnings are in Portuguese.

## Method

1. **Reading the Yearbook.** The PDF of the 2025 Yearbook (base year 2024) was turned into text with
   xpdf’s `pdftotext -table`, which keeps column positions. Empty cells vanish from running text, so
   each number was placed in its column by position, compared with the complete rows on the same page.
   All 645 municipalities were read and checked: in each row the classes add up to the total, and the
   sum of the municipalities matches the state row.
2. **The page that is an image.** The last page of the electricity table (page 42 of the PDF) has no
   text. The 20 municipalities from Uchôa to Zacarias were transcribed by hand from the image and checked
   against the row sums, the state totals (consumers exact; kWh within 17 kWh, from the Yearbook’s own
   rounding) and the electricity in toe from the total-consumption table (largest deviation 0.19%).
3. **kWh per rural connection** = rural-class consumption ÷ rural consumers. The state mean,
   12,852 kWh, is the ratio of the sums (3,228 GWh ÷ 251,193 connections), without the municipalities
   in step 4.
4. **Yearbook copy errors.** In Ribeirão Preto, Rifaina and Rincão the rural kWh is 233,962,584, which
   is Ribeirão Preto’s industrial consumption. In Restinga, Reginópolis and Sales Oliveira the rural kWh
   repeats a neighbouring cell in the same row. The rule used: rural kWh of 1 million or more equal to
   another kWh cell in the table. These six are hatched and left out of the mean; with them, the mean
   would be 15,645 kWh. The other six hatched municipalities (Osasco, São Caetano do Sul, Santo André,
   Diadema, Barueri and Taboão da Serra) have no rural consumers.
5. **Classes** by the ratio to the mean: 0.5, 0.75, 1, 1.5, 2 and 4. A home’s consumption (2,409 kWh)
   is the same sum for the residential class.

## Limitations

- **A connection is not a property.** The Yearbook counts consumers (metered units). A farm may have
  several connections, and one connection may serve an irrigation pivot, a poultry shed or a house.
- **The rural class is broad.** Under ANEEL’s rules it covers farming, irrigation, part of
  agro-industry and rural homes. One agro-industry on the rural class weighs heavily in a municipality
  with few connections; the plate does not say which activity uses the energy.
- The copy errors in step 4 were found with a simple rule; an error that does not repeat another cell
  goes unnoticed.
- The electricity comes from the distributors. Anyone who generates their own power (solar panels,
  bagasse) and uses it without going through the grid does not appear.

## Data licence

SEMIL/SP’s Municipal Energy Yearbook and IBGE’s municipal mesh and Census: public data, free to use with
attribution.
