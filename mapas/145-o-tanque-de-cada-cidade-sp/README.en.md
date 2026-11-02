---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Every town’s tank"
subtitulo: "Ethanol, petrol and diesel: who strays from the state’s mix"
contexto: >-
  In 2024, São Paulo’s filling stations and distributors sold hydrous ethanol, petrol C and diesel oil that, added up as energy, come to 22.6 GJ per person. The state’s mix is 22% ethanol, 30% petrol and 48% diesel; CNG stays at 0.5%. Diesel is the largest share of energy sold in 436 of the 645 municipalities, petrol in 152 and ethanol in 56. Among towns of 20,000 people or more, Santa Rita do Passa Quatro has the largest ethanol share (49%) and Potim, in the Paraíba Valley, the largest petrol share (76%), but it sells only 2.2 GJ per resident: the tank is filled in the next town. In Américo Brasiliense, 94% of the energy is diesel, and sales reach 195 GJ per person, 9 times the state. The regions look alike in ethanol (18% to 25%) and part ways on diesel, from 38% in the São Paulo region to 65% in Araçatuba’s.
imagem: ./mapa_preview.en.png
imagem_alt: "Ternary map of São Paulo’s 645 municipalities by the energy sold in 2024 as hydrous ethanol, petrol C and diesel oil. Colour measures the departure from the state’s mix (22% ethanol, 30% petrol, 48% diesel), shown in light grey: green pulls towards ethanol, red towards petrol, blue towards diesel, and the colour grows stronger with the departure. Blue dominates the west and north; olive-green tones dot the centre and north-west; the east, from the capital to the Paraíba Valley and the coast, turns pink, pulled by petrol. Redenção da Serra, with no sales, is hatched. Three callouts: Santa Rita do Passa Quatro, 49% ethanol; Américo Brasiliense, 94% diesel and 195 GJ per person; Potim, 76% petrol. The panel holds the colour triangle with municipalities as dots and stacked bars of each intermediate region’s mix."
metodo: "Volumes of hydrous ethanol, petrol C and diesel oil sold per municipality (SEMIL/SP, base year 2024), converted to toe with the Yearbook’s own factors and summed; each one’s share of the total becomes a colour in a ternary scheme centred on the state’s mix (Schöley, 2021)."
---

# Every town’s tank: ethanol, petrol and diesel sold in São Paulo’s municipalities in 2024

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 145, the second in the **Each town’s energy** collection. Three fuels fill almost all of the
tank of São Paulo’s vehicles. Here each municipality is a mix of them, and the colour shows which way
that mix strays from the state average. Plate 111, “Cane in the tank”, looked only at the Otto cycle
(ethanol against petrol); this one brings diesel into the sum.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `CD_MUN`, `NM_MUN`, `CD_RGINT`, `NM_RGINT`, `populacao_2022`, `etanol_l`, `gasolina_l`, `diesel_l` (litres), `gnv_m3`, `etanol_toe` … `gnv_toe`, `pct_etanol`, `pct_gasolina`, `pct_diesel` (shares of the three, summing to 100), `pct_gnv` (over all four), `gj_hab` (all four, per person) and `cor` (the plate’s hex colour) |
| `regioes_intermediarias` | polygon | IBGE’s 11 intermediate regions: `CD_RGINT`, `NM_RGINT` |
| `limite_estadual` | polygon | state outline |

The **GPKG** is zipped and attached to the
[`energia-municipal-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/energia-municipal-sp-2026).
The `municipios` layer carries two **QGIS styles**: the plate’s, which fills each polygon from the
`cor` field, and another by the fuel with the largest share. The **CSV** sits in this folder, UTF-8,
without geometry. Field names are in Portuguese (`etanol` ethanol, `gasolina` petrol, `gnv` CNG).

## Method

1. **Reading the Yearbook** as for plate 144: `pdftotext -table`, numbers placed in their column by
   position and checked against row sums and the state row.
2. **From volume to energy.** The Yearbook gives litres and also each product’s energy in toe. The
   implicit factors were taken from its own tables by least squares: 0.770 toe per thousand litres of
   petrol C, 0.848 of diesel and 0.510 of hydrous ethanol; 0.993 toe per thousand m³ of natural gas.
   1 toe = 41.868 GJ.
3. **The mix** of each municipality is the share of ethanol, petrol C and diesel in the sum of the
   three, as energy. CNG (0.5% of the state total, sold in 69 municipalities) stays out of the triangle
   but counts in the GJ per person.
4. **Centred ternary colour** (Schöley, 2021). Each mix is divided, share by share, by the state’s mix
   and renormalised, so the centre of the triangle becomes the state rather than ⅓–⅓–⅓. The colour comes
   from OKLCh: the hue follows the direction of the departure (ethanol green, petrol red, diesel blue),
   and the strength grows with the distance from the centre up to the 95th percentile, where it
   saturates.
5. **Highlights** (callouts and largest shares) only among towns of 20,000 people or more, so that one
   roadside filling station in a small town does not take the place.

## Limitations

- **Sales are not consumption.** The Yearbook counts where fuel was sold, not where it was burned.
  Diesel sold at a road junction fills lorries passing through; people in a small town fill up in the
  next one. That is why GJ per person runs from almost nothing (Potim, 2.2 GJ) to 195 GJ (Américo
  Brasiliense), and the map shows each municipality’s market, not its residents’ habits.
- Petrol C already carries anhydrous ethanol, over a quarter of the volume; here it counts in full as
  petrol C, and the ethanol share is hydrous ethanol only.
- Diesel for farm use, for own fleets or bought outside the state may not pass through municipal sales.
- Redenção da Serra has no sales recorded in the Yearbook and is hatched.

## Data licence

SEMIL/SP’s Municipal Energy Yearbook and IBGE’s municipal mesh and Census: public data, free to use with
attribution.
