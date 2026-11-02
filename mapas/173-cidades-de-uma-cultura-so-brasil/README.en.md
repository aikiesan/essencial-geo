---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "One-crop towns"
subtitulo: "Towns with over half their land under soy went from 5 to 285, and cane towns from 33 to 161"
contexto: >-
  In 1985, 5 Brazilian municipalities had more than half their land under soy; in 2025, 285, nearly all in Rio Grande do Sul (142) and Paraná (106). Cane towns went from 33 to 161, and 142 of them are in São Paulo, 50 of which were pasture towns in 1985. Pasture remains by far the largest single crop: 1,434 municipalities in 1985, 1,792 at the 1999 peak and 1,348 today, but it has moved: the Southeast lost 429 pasture towns while the Northeast and the North gained 398. In all, 629 municipalities stopped being pasture towns. The soy towns hold only 24% of Brazil’s soy: they are small. Third plate in the collection «Forty years of biomass».
imagem_alt: "Map of Brazil in Albers conic projection showing municipalities where a single MapBiomas crop, pasture or planted-forest class covers more than half the area, in nine categories: soy (gold), cane (wine red) and pasture (brown), each in a dark shade if it was already so in 1985 and a light shade if it became so later, planted forest or another crop (green), those that were one-crop towns in 1985 and no longer are (beige) and the rest (near white). Soy forms patches in northern Rio Grande do Sul and western Paraná; cane a block in northern São Paulo and a strip along the coast of Alagoas and Pernambuco; pasture covers Minas Gerais, Espírito Santo, eastern Bahia, Goiás, Mato Grosso do Sul and eastern Pará, and the beige spreads over western São Paulo and the Triângulo Mineiro. Callouts point to Boa Esperança (Paraná), 87% soy, and to São Paulo’s 142 cane towns. In the panel, bars by category, lines of the number of pasture, soy and cane towns from 1985 to 2025 and a table by region."
metodo: "For each municipality, in 1985 and in 2025, the largest class among soybean, sugar cane, pasture, planted forest and other temporary crops (MapBiomas, collection 11, biomes summed); the municipality is a «one-crop town» when that class covers more than 50% of its total area."
---

# One-crop towns: municipalities with over half their land under one crop or pasture, 1985 and 2025

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 173, the third in the collection **Forty years of biomass**. Where a whole municipality’s
landscape has turned into one thing, and where it has stopped being so.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 5,570 municipalities: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `dominante_1985`, `pct_1985`, `dominante_2025`, `pct_2025` (`nenhuma` when no class passes 50%), `soja_2025_pct`, `cana_2025_pct`, `pastagem_2025_pct`, `categoria`, `lon`, `lat` |
| `ufs` | polygon | 27 states |
| `limite_nacional` | polygon | national boundary |

The **GPKG** is zipped and attached to the
[`quarenta-anos-de-biomassa-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/quarenta-anos-de-biomassa-br-2026),
with **QGIS styles** embedded. The **CSV** sits in this folder, UTF-8, with the municipal table and
no geometry.

## Method

1. MapBiomas land cover and land use statistics, collection 11, sheet `COVERAGE_11`: hectares of each
   class by municipality and year, biomes summed; a municipality’s total area is the sum of all
   classes, water and native vegetation included.
2. Candidate classes: soybean (39), sugar cane (20), pasture (15), forest plantation (9) and other
   temporary crops (41). Mosaic of uses (21) is left out: it is not a crop.
3. Each year, the candidate class with the largest area; if it covers more than 50% of the
   municipality, that is a «one-crop town» of that class.
4. Map category: the 2025 class (soy, cane or pasture), split into «already in 1985» (same class in
   1985) and «since after 1985»; planted forest or another crop; «was in 1985, no longer» (a one-crop
   town in 1985, of none in 2025); and the rest.
5. The panel series repeats the count for every year from 1985 to 2025.

## Reading the map

- In all, 1,527 municipalities were one-crop towns in 1985 and 1,800 in 2025.
- Soy: from 5 to 285 municipalities; 142 in Rio Grande do Sul, 106 in Paraná, 11 in São Paulo, 9 in
  Goiás, 8 in Mato Grosso do Sul and 6 in Mato Grosso. Boa Esperança (Paraná) has 87.3% of its area
  under soy. These 285 municipalities hold only 24.2% of Brazil’s soy: Cerrado municipalities are
  large and, even with a lot of soy, keep native vegetation and other uses.
- Cane: from 33 to 161 municipalities; 142 in São Paulo (up from 26), 9 in Alagoas, 7 in Pernambuco
  and 3 in Paraná. Of São Paulo’s new cane towns, 50 were pasture towns in 1985. Campo Alegre
  (Alagoas) has 80.6% of its area under cane (69.5% in 1985).
- Pasture: 1,434 municipalities in 1985, 1,792 in 1999, the peak, and 1,348 in 2025. The Southeast
  went from 937 to 508 and the South from 111 to 33; the Northeast rose from 239 to 531 and the North
  from 2 to 108. Of the 1,434 of 1985, 629 stopped being pasture towns: 565 now have no class above
  50%, 53 became cane towns and 9 soy towns.

## Limitations

- The 50% threshold is of the municipality’s total area, water and forest included; a town with a lot
  of cropland and a large reservoir may fall short.
- In the early years of the series, some of the South’s soy sits in «other temporary crops»: 54
  municipalities belonged to that class in 1985 (30 in Rio Grande do Sul, 20 in Paraná) and 49 of
  them are soy towns today. So the jump from 5 to 285 soy towns somewhat overstates the real change
  in the South.
- A crop above 50% says nothing about who farms it or about rotation: summer soy often shares the
  year with maize or wheat, which the annual map does not show.
- Satellite-mapped area, not IBGE harvested area. Fernando de Noronha has no statistics.

## Data licence

MapBiomas (CC BY 4.0) and IBGE data, free to use with attribution.
