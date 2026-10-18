---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Inside and outside the favela"
subtitulo: "In the same town, two fifths of the income"

contexto: >-
  In the 92 São Paulo municipalities that have favelas, the mean income of the household head is R$ 1,697 in the favelas and R$ 4,342 in the rest of the same town: 2.6 times as much. Inside, 73% of homes have sewage to the mains, against 94% outside; 68% of household heads are Black or brown, against about 40%; 16% of residents are aged 9 or under, against 11%; and almost no one lives in a flat (0.5%, against 28%). The map compares income inside and outside in each of the 45 municipalities with at least 5,000 favela residents. The gap is widest in rich towns: in Santos and São Paulo, income in the favela is 31% of that outside; in Ribeirão Preto and São José dos Campos, 33%. It narrows where the whole town is poor, as in Francisco Morato, Itaquaquecetuba and Rio Grande da Serra, at 81%. Last plate of the collection “Favelas and urban communities”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo with the 45 municipalities that have at least 5,000 favela residents in five shades, from cream to dark brown, by mean income in favelas over mean income outside them; the rest in grey. The capital, the ABC towns, Santos and mid-sized inland towns are dark brown. Callouts point to Santos, with R$ 1,895 in the favela and R$ 6,030 outside it, and Francisco Morato, at 81%. In the panel, bars compare inside and outside: income, sewage to the mains, Black or brown household heads, children aged up to 9, residents per home and flats."

recorte: "São Paulo State (SP)"
metodo: "Mean income of household heads with income in tracts of Favelas and Urban Communities over that of the other tracts of the same municipality, from the 2022 Census tract aggregates, in municipalities with at least 5,000 favela residents, in five classes."
---

# Income, sanitation and housing inside and outside São Paulo’s favelas

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 070, the last of four in the collection **Favelas and urban communities**. The favela
street is on [plate 069](../069-entorno-das-favelas-sp/README.en.md).

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `renda_media_dentro`, `renda_media_fora` (R$ per month), `razao_renda`, plus `pessoas_fcu`, `pct_fcu` and the surroundings |
| `setores_fcu` | polygon | 8,008 tracts in favelas |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

It is the **GPKG** of [plate 067](../067-favelas-sp/README.en.md). The **CSV** has the municipal
table, without geometry.

## Method

1. 2022 Census tract aggregates, split by the Favela or Urban Community code: inside = tracts in
   favelas; outside = the other tracts of the 92 municipalities that have favelas.
2. Mean income = sum, over tracts, of the mean monthly nominal income of household heads with
   income times their number, over all household heads with income. Tracts without the figure are
   left out (19 inside and 792 outside).
3. Sewage to the mains = public or storm sewer, or a septic tank connected to it; water = mains as
   the main source; colour or race = the household head’s; children = residents aged 9 or under;
   flat = type of dwelling.
4. Where statistical confidentiality hides a cell (X), it is worth 1 or 2; the sum becomes a range,
   and the panel shows the range when both ends give different percentages.
5. Map: ratio of income inside to income outside in the 45 municipalities with at least 5,000
   favela residents, in five classes: up to 35%, 35 to 45%, 45 to 55%, 55 to 65% and over 65%.

## Limitations

- It is the household head’s income, not income per head; and outside includes other poor
  neighbourhoods that IBGE did not class as favelas.
- The comparison is between sets of tracts, not people: it does not say what a favela family earns,
  only the mean of the tracts.
- The outside of each municipality varies greatly in size: in Guarujá the favela is over a third of
  the town; in Campinas, an eighth.
