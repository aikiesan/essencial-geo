---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Native wood, planted wood"
subtitulo: "In 1986, 63% of Brazil’s charcoal came from native forest; in 2025, 7%"
contexto: >-
  In the 1980s, the charcoal that feeds Brazil’s blast furnaces came mostly from the native woodland of Minas Gerais and Goiás, Cerrado country. In 1986 plant extraction yielded 3.36 million tonnes of charcoal, 63% of the national total; planted forest, 2.01 million. By 2025 native-forest charcoal had fallen to 481 thousand tonnes, 7%, while charcoal from eucalyptus and other plantations had risen to 6.30 million. The last year native wood out-produced planted wood was 2005. Minas Gerais took 1.85 million tonnes a year from native forest in 1986–1990; in 2021–2025, 5.8 thousand, while its planted charcoal reached 5.84 million. The native charcoal that remains has moved: 68% of it now comes from Maranhão, Pará, Piauí and Tocantins. Third plate in the collection «Gathered from the forest».
imagem_alt: "Three maps of Brazil in Albers conic projection, at the same scale, with circles proportional to the yearly mean of charcoal by municipality: the first, in terracotta, of native-forest charcoal in 1986–1990, with a dense cloud of circles over Minas Gerais, Goiás and Mato Grosso do Sul and dots in Maranhão, Santa Catarina and the Northeast; the second, of native charcoal in 2021–2025, almost empty in the Southeast and Centre-West, with what is left in eastern Pará, Maranhão and Piauí; the third, in green, of planted-forest charcoal in 2021–2025, concentrated in central and northern Minas Gerais. In the fourth frame, a line of native charcoal falling from 3.7 million tonnes in 1988 to 0.48 million in 2025 and one of planted charcoal rising to 6.3 million, crossing for the last time in 2005. In the panel, a table by state."
metodo: "Tonnes of charcoal by municipality: from plant extraction, i.e. native forest (PEVS, table 289), and from silviculture, i.e. planted forest (table 291), 1986–2025; yearly means for 1986–1990 and 2021–2025; native share = native ÷ (native + planted)."
---

# Native wood, planted wood: charcoal by municipality, 1986–1990 and 2021–2025

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 170, the third in the collection **Gathered from the forest**. Plates 130 and 131
covered planted forest and firewood; this one compares the two sources of charcoal over forty
years.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `municipios` | point | 3,804 municipalities with charcoal in 1986–1990 or 2021–2025: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `nativo_1986`, `plantado_1986`, `nativo_1986_1990`, `plantado_1986_1990`, `nativo_2021_2025`, `plantado_2021_2025`, `nativo_2025`, `plantado_2025` (t), `pct_nativo_2021_2025`, `lon`, `lat` |
| `ufs` | polygon | 27 states: the same means and the 2025 tonnes, summed by state |
| `limite_nacional` | polygon | national boundary |

The **GPKG** is zipped in the assets of the
[`biomassa-da-mata-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/biomassa-da-mata-br-2026),
with three **QGIS styles** on the municipalities layer, one for each map on the plate. The two
**CSV** files sit in this folder, in UTF-8.

## Method

1. PEVS, tables 289 (plant extraction, product «charcoal») and 291 (silviculture, product
   «charcoal», which adds up eucalyptus, pine and other planted species), in tonnes, by
   municipality, 1986 to 2025, downloaded from the SIDRA API on 01/11/2026. «-» is zero; cells with
   no information count as no output; no cells are suppressed.
2. Yearly means by municipality for 1986–1990 and 2021–2025. The three maps share one circle
   scale; municipalities under 200 t a year are left off the drawing (they are in the data).
3. National series: the sum of municipalities each year.

## Reading

- 1986: 3,364,859 t of native-forest charcoal and 2,010,565 t from planted forest; native wood gave
  62.6%. 2025: 481,432 t native and 6,295,267 t planted; native wood gave 7.1%.
- Native charcoal peaked in 1988 (3,726,638 t) and fell 87.1% by 2025. Planted forest moved ahead
  in 1993 (leaving aside the odd 1987 figure), native wood led again from 2003 to 2005, and since
  2006 planted wood has led without a break.
- Minas Gerais: 1.85 million t of native charcoal a year in 1986–1990 and 5.8 thousand t in
  2021–2025; its planted charcoal is 5.84 million t a year, 87% of Brazil’s planted total. Goiás
  went from 460 thousand t of native charcoal a year to 1 thousand t.
- In 2021–2025, 68% of native charcoal (456 thousand t a year) came from Maranhão, Pará, Piauí and
  Tocantins. The largest municipality is Paragominas (PA), with 52.1 thousand t a year; the largest
  for planted charcoal is João Pinheiro (MG), with 399 thousand t a year.
- Municipalities reporting native charcoal fell from 2,541 in 1986 to 1,424 in 2025; those reporting
  planted charcoal rose from 375 to 772.

## Limitations

- In 1987, Bom Despacho (MG) reported 2.9 million t of planted charcoal, against 137 thousand t in
  1986 and 6 thousand t in 1988; the spike in the line that year is that record, kept as published.
- «Plant extraction» is the survey of charcoal made from native forest, legal or not, as
  informants report it; unreported charcoal from clearing does not appear.
- The table does not say where the charcoal goes; the link to steelmaking comes from the product’s
  known use, not from these data.
- The plate makes no energy estimate.

## Data licence

IBGE open data, free to use with attribution.
