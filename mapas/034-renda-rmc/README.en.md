---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Household head income"
subtitulo: "Income draws another border"

contexto: >-
  In 2022, the Brazilian minimum wage was R$ 1,212 a month. In the Campinas Metropolitan Region, 47% of household heads lived in census tracts where the heads’ median income did not exceed two minimum wages; 8.2% lived in tracts above five. The map colours each tract by median income and draws a border that is not the municipal one: in Vinhedo, Valinhos and Indaiatuba, one head in three lives in tracts above three minimum wages; in Hortolândia and Sumaré, one in ten; in Monte Mor, under 3%. The highest median, R$ 28,000 (23 minimum wages), belongs to a tract in Indaiatuba. Third plate of the collection “Campinas Metropolitan Region”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of the Campinas Metropolitan Region with its 6,548 census tracts coloured by the median monthly nominal income of the household head in 2022, in minimum wages, on a viridis ramp from yellow (up to 1 minimum wage) to deep purple (over 5). The teal of 2 to 3 minimum wages dominates the urban patches; blue and purple gather in Campinas, Valinhos, Vinhedo, Paulínia and Indaiatuba; the light green of 1 to 2 minimum wages appears in the west and on the rural edges. Tracts without data are hatched. A callout points to a tract in Indaiatuba with a median of R$ 28,000. In the panel, each class has a bar with its share of the region’s household heads."

recorte: "Campinas Metropolitan Region (SP)"
metodo: "Median monthly nominal income of household heads with income, by 2022 Census tract, in six classes measured in 2022 minimum wages (R$ 1,212)."
---

# Household head income in the census tracts of the Campinas Metropolitan Region

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 034, the third of four in the collection **Campinas Metropolitan Region**: in the same
tracts as the previous plate, what the person who answers for the home earns.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `setores` | polygon | 6,548 tracts: `CD_SETOR`, `CD_MUN`, `NM_MUN`, `NM_BAIRRO`, `situacao`, `responsaveis` (heads), `moradores` (residents), `renda_media` and `renda_mediana` (R$ a month, heads with income) |
| `municipios` | polygon | outline of the 20 municipalities |

The **GPKG** is zipped and attached to the
[`rmc-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/rmc-2026).
The `setores` layer carries the plate’s **QGIS style** (`mediana`), with the classes in reais.

The **CSV** holds the tract table in UTF-8, without geometry.

## Method

1. 2022 Census household head income aggregates by tract: household heads, residents, and the
   mean and median monthly nominal income of heads with income, in occupied permanent private
   households.
2. Joined to the 2022 Census Tract Mesh by tract code, in the region’s 20 municipalities.
3. Six classes of median income, in 2022 minimum wages (R$ 1,212): up to 1, 1 to 1.5, 1.5 to 2,
   2 to 3, 3 to 5 and over 5.
4. Each class’s share adds up the heads of the tracts in that class, over the total of tracts with
   data.

## Limitations

- The median covers heads **with income**: those with no income at all are left out, so the
  median of the poorest tracts sits above what it would be if everyone were counted.
- Income is **nominal**, as declared to the enumerator, and the head’s income is not the income of
  the whole household.
- 241 tracts have no income data (no occupied household, or a value withheld by IBGE for
  confidentiality) and are hatched.
- A tract median hides the mix within the tract: a gated estate and a neighbouring informal
  settlement may fall in the same polygon.
