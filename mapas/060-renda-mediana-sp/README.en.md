---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "What the head of household earns"
subtitulo: "The minimum wage is the yardstick for a third of the state"

contexto: >-
  In each census tract of São Paulo, what does the person responsible for the household earn? The 2022 Census gives the median income of household heads with income, and the minimum wage of the time, R$ 1,212, works as a yardstick: in 4,904 tracts the median is exactly one minimum wage. A third of the state’s 16.2 million household heads live in tracts with a median of up to 1.5 minimum wages. The map pales in the Ribeira Valley and the west; in the Presidente Prudente region, 48% of household heads live in such tracts; in the Campinas region, 21%. In Iguape it is 79%; in Francisco Morato, in Greater São Paulo, 78%. At the other end, 1.08 million household heads live in tracts of over 5 minimum wages; the largest shares are in São Caetano do Sul (23%), Santana de Parnaíba and Vinhedo. Plate 034 zooms in on the Campinas region. First plate of the collection “Income and rooftop solar”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state with census tracts in six shades, from cream to dark plum, by the median income of household heads in minimum wages. The interior is a mosaic of mid pinks; the Ribeira Valley, the south and the southern coast are pale; dark patches mark the capital, the corridor to Campinas and the centres of mid-sized cities. Confidential tracts are hatched. A callout points to Iguape, with 79% of household heads in tracts of up to 1.5 minimum wages. In the panel, a legend with the share of household heads in each class and bars with that share by intermediate region, from 48% in Presidente Prudente to 21% in Campinas."

recorte: "São Paulo State (SP)"
metodo: "Median monthly nominal income of household heads with income, by 2022 Census tract, in six classes measured in 2022 minimum wages (R$ 1,212); tracts with confidential values are left as no data."
---

# Median income of household heads by census tract in São Paulo

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 060, the first of three in the collection **Income and rooftop solar**: the income of
whoever answers for the home, tract by tract, then by weighting area in the metropolis and,
finally, crossed with solar systems on rooftops. [Plate 034](../034-renda-rmc/README.en.md) shows
the same data, in more detail, for the Campinas Metropolitan Region.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `setores` | polygon | 103,319 tracts: `CD_SETOR`, `CD_MUN`, `NM_MUN`, `NM_BAIRRO` (neighbourhood), `situacao` (urban/rural), `pessoas` (people), `responsaveis` (household heads), `renda_media` and `renda_mediana` (mean and median, R$ a month, of household heads with income), `renda_mediana_sm` (in minimum wages), `classe_sm` (1 to 6) and `sem_domicilio` (no occupied home) |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The **GPKG** is zipped in the assets of the
[`renda-solar-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/renda-solar-sp-2026),
with the plate’s **QGIS style** (`renda_mediana_sm`). Income fields are empty in confidential tracts.

## Method

1. 2022 Census tract aggregates on household head income: household heads and the mean and median
   monthly nominal income of those with income, in occupied permanent private households.
2. Six classes of the median, in 2022 minimum wages (R$ 1,212), closed on the right: up to 1
   (including the minimum wage itself), 1 to 1.5, 1.5 to 2, 2 to 3, 3 to 5 and over 5.
3. Each class’s share adds up the household heads of its tracts. Intermediate regions add up the
   household heads of tracts of up to 1.5 minimum wages.
4. On the plate, tracts become a grid of about 200 m so the whole state can be drawn; the GPKG has
   the polygons.

## Limitations

- IBGE withholds (“X”) the income of small tracts for confidentiality: 1,462 tracts, with 73,517
  people, are hatched as no data, never as zero income. Another 2,634 tracts have no occupied home.
- The median is that of household heads **with income**: those with no income at all are left out,
  so the median of the poorest tracts comes out higher than it would counting everyone.
- Income is nominal and self-reported, and the household head’s income is not the whole household’s.
- A tract median hides the mix within it.
