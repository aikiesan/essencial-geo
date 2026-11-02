---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Fewer nuts cracked"
subtitulo: "Babassu kernel output is down 88% since 1988, yet no fewer towns gather it"
contexto: >-
  Babassu is the palm of the quebradeiras de coco of Maranhão, Piauí and Tocantins, the women who crack the hard nut by hand to free the kernel. In 1988 Brazil recorded 200 thousand tonnes of kernels; in 2025, 24.3 thousand, a fall of 88%. The number of municipalities reporting babassu, however, has not fallen: 231 in 1986, 278 in 2025. What shrank is the amount from each, from 819 to 88 tonnes per municipality. Codó, the largest producer, went from 14.3 thousand tonnes a year in 1986–1990 to 498 in 2021–2025. In Tocantins the fall was 98.6%, from 37.4 thousand to 507 tonnes a year. Maranhão, with 75% of the kernels in 1986, now has 87%. The survey counts tonnes; it does not say why they fell. Second plate in the collection «Gathered from the forest».
imagem_alt: "Map of Brazil in Albers conic projection with rings proportional to the yearly mean of babassu kernels in 1986–1990 and discs proportional to that of 2021–2025 in each municipality, the disc coloured by the change: fell by over 90%, fell by 50 to 90%, fell by under half or grew, started reporting and stopped reporting. The symbols cluster in Maranhão, northern Piauí and the Bico do Papagaio in Tocantins, where large, nearly empty rings remain. One callout points to Codó (MA), down from 14.3 thousand to 498 tonnes a year, and another to Tocantins, down 98.6%. In the panel, a stacked area by state falling from 200 thousand tonnes in 1988 to 24 thousand in 2025, and bars for the eight largest municipalities of 1986–1990 with the little that is left."
metodo: "Tonnes of babassu kernels gathered by municipality (PEVS, table 289), 1986–2025; yearly mean for 1986–1990 against that for 2021–2025, with years without data counted as zero; categories from the ratio of the two means."
---

# Fewer nuts cracked: babassu kernels by municipality, 1986–1990 and 2021–2025

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 169, the second in the collection **Gathered from the forest**. Babassu is still
gathered in almost as many towns as before, but in far smaller amounts.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `municipios` | point | 363 municipalities with babassu in 1986–1990 or 2021–2025: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `t_1986`, `t_1988`, `media_1986_1990`, `media_2021_2025`, `t_2025` (t), `variacao_pct`, `categoria`, `lon`, `lat` |
| `ufs` | polygon | 27 states: `media_1986_1990`, `media_2021_2025`, `t_2025` (t) |
| `limite_nacional` | polygon | national boundary |

The **GPKG** is zipped in the assets of the
[`biomassa-da-mata-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/biomassa-da-mata-br-2026),
with the **QGIS styles** saved inside. The two **CSV** files sit in this folder, in UTF-8: the
municipalities and the national yearly series by state.

## Method

1. PEVS, SIDRA table 289: babassu kernels, in tonnes, by municipality, 1986 to 2025, downloaded
   from the SIDRA API on 01/11/2026. «-» is zero; cells with no information count as no output; no
   cells are suppressed.
2. Yearly mean for each municipality in 1986–1990 and 2021–2025 (sum of the five years ÷ 5).
3. Categories: started reporting (no babassu in 1986–1990), stopped reporting (none in 2021–2025),
   fell by over 90%, fell by 50 to 90%, and fell by under half or grew.
4. National series: the sum of municipalities each year, by state (Maranhão, Piauí, Tocantins and
   the rest).

## Reading

- Kernels totalled 189,100 t in 1986 and peaked in 1988 at 200,037 t. In 2025 there were 24,337 t,
  87.8% below the peak.
- Municipalities reporting babassu numbered 231 in 1986 and 278 in 2025; the mean per municipality
  fell from 818.6 t to 87.5 t.
- Of the 363 municipalities on the map, 99 fell by over 90%, 68 by 50 to 90%, 17 fell by under
  half or grew, 117 started reporting and 62 stopped.
- Codó (MA), the largest producer of 1986–1990, went from 14,283 t a year to 498 t; Coroatá (MA),
  from 10,406 t to 448 t. The largest today is Vargem Grande (MA), with 993 t a year.
- Tocantins fell 98.6%, from 37,379 t a year to 507 t; Tocantinópolis from 10,000 t to 93 t.
  Maranhão went from 141 thousand t a year to 24.5 thousand and rose from 75% to 87% of the
  national total.
- The series falls in two steps: between 1992 and 1995 (from 169 thousand to 99 thousand t) and
  from 2015 onwards (from 78 thousand to 24 thousand t in ten years).

## Limitations

- The PEVS records what informants report for each municipality; it does not say why the amount
  fell, nor how many people crack the nuts.
- Many municipalities in Maranhão, Piauí and Tocantins were carved out of others after 1986; some
  of the «started reporting» and of the fall in the parent towns is just the redrawing of borders.
  The national series is unaffected.
- The kernel is only part of the nut; the husk and the mesocarp, which also have uses, are not
  counted.

## Data licence

IBGE open data, free to use with attribution.
