---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Where the manure is"
subtitulo: "Cattle, pigs and hens in one sum"
contexto: >-
  Added up in FAO livestock units, which put cattle, pigs and hens in the same sum, Brazil’s herds reach 202 million LU, 24 per square kilometre on average. Cattle make up 83% of them and spread their manure across pasture, where it is not collected. The manure that can be collected is where animals live packed together: in the poultry sheds and pig farms of western Santa Catarina, Paraná and the Gaúcha highlands, and in the egg capital, Bastos (SP), with 13.65 million hens and 883 LU per km². Cunhataí (SC) has 111,000 pigs on 55 km². Santa Catarina and Paraná are the most densely stocked states; Amazonas the least. It is the map of where manure-based biogas has feedstock at hand.
imagem_alt: "Choropleth map of Brazil in Albers conic projection, with the 5,571 municipalities shaded by livestock units per square kilometre in seven classes, from cream to near-black brown. Amazonas, Roraima, Amapá and western Pará are pale; middle tones cover the Centre-West and the Northeast; the darkest gather in western Santa Catarina and Paraná, the Gaúcha highlands, western São Paulo, Rondônia and the Triângulo Mineiro. Two callouts: Bastos, in São Paulo, with 883 LU per km² and 13.65 million hens, and Cunhataí, in Santa Catarina, with 703 LU per km² and 111,655 pigs. The panel holds the class legend with the number of municipalities, the band of livestock units by species, with cattle at 83%, and the four largest species with their FAO coefficient."
metodo: "Head counts of seven species from the 2024 Municipal Livestock Survey multiplied by FAO livestock unit coefficients for South America, added up and divided by each municipality’s area in km²."
---

# Where the manure is: livestock units per km² in Brazil

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 129, the fourth in the **Biomass monitor** collection. Cattle, pigs and hens added up
in one unit, to see where animals, and their manure, are concentrated.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 5,571 municipalities: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `area_km2`, head (`cab_*`) and LU (`ua_*`) of cattle, buffalo, pigs, poultry, horses, sheep and goats, `ua`, `ua_km2`, `especie_lider`, `classe`, `faixa_ua_km2` |
| `ufs` | polygon | 27 states, with their region |
| `limite_nacional` | polygon | national boundary |

The **GPKG** is zipped and attached to the
[`biomassa-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/biomassa-br-2026).
The `municipios` layer carries the plate’s **QGIS style**, with the seven classes. The **CSV** sits
in this folder, in UTF-8, with the same table without geometry.

## Method

1. 2024 herd sizes by municipality from the Municipal Livestock Survey (SIDRA, table 3939):
   cattle, buffalo, pigs (total), poultry (total), horses, sheep and goats.
2. FAO **livestock units (LU)** for South America: cattle and buffalo 0.70; horses 0.65; pigs
   0.25; sheep and goats 0.10; poultry 0.01. The LU approximates live weight and, with it,
   manure.
3. Total LU divided by the municipality’s area (km², computed in the Albers projection). Seven
   classes, with breaks at 2, 5, 10, 20, 40 and 80 LU per km².
4. The 32 municipalities without PPM data (almost all in Greater São Paulo and the Santos
   lowlands) are grey.

## Limitations

- The LU measures herd size, not collectable manure: grazing cattle leave manure in the field,
  while housed pigs and poultry leave it in the shed.
- FAO coefficients are regional averages; breeds and farming systems vary.
- The PPM is a municipal estimate made with local informants, and records the herd in the
  municipality of the farm.
- Poultry adds broilers and laying hens under a single coefficient.

## Data licence

IBGE open data, free to use with attribution; FAO coefficients.
