---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Biogas on the electricity bill"
subtitulo: "By year of last registry update, biogas climbs until 2020 and nearly vanishes after 2023"
contexto: >-
  ANEEL’s distributed generation register does not give plants’ connection dates, only the date of their last registry update, which approximates the year of entry. By that date, the oldest biogas plant is from 2013: 32 kW from Sanepar in Foz do Iguaçu (PR). By 2017 there were 66 plants in 46 municipalities, 44 of them in Minas Gerais. The peak is in 2020, with 95 plants and 32.1 MW; by then biogas reached 150 municipalities in 14 states. The count then falls: 30 plants in 2024, 14 in 2025 and none in 2026, a year in which 487 thousand solar plants were updated up to 31/08. By update year, biogas was 4.0% of distributed generation kW in 2016 and 0.11% in 2025.
imagem_alt: "Three small maps of Brazil in Albers conic projection, with the municipalities that have a biogas distributed-generation plant, by year of last registry update: up to 2017, up to 2020 and up to September 2025. Each municipality is a circle proportional to the capacity accumulated by the cut-off, coloured by the period of the earliest update among its plants: night blue up to 2017, mid blue from 2018 to 2020 and light blue from 2021 to 2025. The first map has a few dark dots, almost all in Minas Gerais and Paraná; in the second, mid blues spread through São Paulo, Rio de Janeiro, Espírito Santo, Mato Grosso, Rondônia and Maranhão; in the third, light blues fill western Paraná and Santa Catarina and reach Paraíba and Ceará. The fourth panel has columns of capacity by year of last registry update, 2013 to 2025, split by consumer class, highest in 2020. The side panel holds the year-by-year table and each state’s earliest update year."
metodo: "Biogas plants in distributed generation dated by their last update in ANEEL’s register, which approximates the year of entry but is not the connection date; by municipality, the earliest update year and the capacity accumulated up to 2017, up to 2020 and up to the latest update, in three maps at the same scale."
---

# Biogas on the electricity bill: biogas distributed generation by update year, 2013–2025

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 149, the third in the **Biogas in distributed generation** collection. The three maps draw
an approximate diffusion front: each municipality enters with the colour of the period of the
earliest registry update among its plants, and the circles grow with accumulated capacity. The
register’s date is not the grid connection date (see Method).

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | point | 260 municipalities: `primeiro_ano` and `primeira_atualizacao` (earliest registry update), `periodo` (up to 2017, 2018 to 2020, 2021 to 2025), `n_usinas`, `kw_total`, `usinas_ate_2017`, `kw_ate_2017`, `usinas_ate_2020`, `kw_ate_2020` |
| `usinas` | point | 529 plants, with the same fields as plate 147 (`data_atualizacao` and `ano` of the last update, `classe`, `kw`…) |
| `ufs` | polygon | 27 states |
| `limite_nacional` | polygon | national boundary |

The **GPKG** is zipped and attached to the
[`gd-biogas-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/gd-biogas-br-2026),
with the plate’s **QGIS style** on the `municipios` and `usinas` layers. The **CSV** sits in this
folder, in UTF-8, with the municipal table without geometry.

## Method

1. The 529 biogas plants of plate 147, from ANEEL’s distributed generation register (reference
   10/2026; the file’s most recent update, of any source, is 31/08/2026).
2. The only date in the file is `DthAtualizaCadastralEmpreend`, which ANEEL’s data dictionary
   defines as the date of the plant’s last registry update. It approximates the plant’s year of
   entry, but it is not the connection date: a plant connected in 2016 and updated in 2024 counts
   as 2024.
3. By municipality: the earliest update year among its plants and the capacity accumulated by the
   end of 2017, of 2020 and up to the latest biogas update (22/09/2025). The three maps share one
   circle scale.
4. The yearly biogas share divides the biogas kW last updated in the year by the kW of all sources
   last updated in the same year.
5. No earlier snapshot of the register, nor another official source with each plant’s connection
   date, was at hand in open data; so the plate keeps the update date.

## Limitations

- Updates push old plants into recent years: the early years may be understated, and recent ones
  inflated or emptied as records are revised. The patterns (a rise to 2020, a fall after 2023)
  hold as an approximation, not as exact dates.
- The register is a snapshot of 10/2026: plants that left it do not appear.
- The data do not say why biogas plants nearly vanish from recent years. Law 14,300, of January
  2022, changed the net-metering rules for access requests filed from January 2023, but these data
  are not enough to attribute the fall to it.
- Installed capacity is not energy generated.
- The plate does not estimate biogas potential.

## Data licence

Open data from ANEEL and IBGE, free to use with attribution.
