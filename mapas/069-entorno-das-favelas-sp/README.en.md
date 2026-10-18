---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The favela street"
subtitulo: "No street light at the door: 15% in São Paulo’s favelas, 9% in Brazil’s"

contexto: >-
  In the 2022 Census, the Urban Survey of Household Surroundings looked at the block face in front of each home. In São Paulo’s favelas, 15% of residents have no street lighting at the door, against 9% in the favelas of Rio and of Brazil as a whole. Paving is better than average: 19% live on an unpaved street, against 22% in Brazil. But 45% have no pavement to walk on, 56% no storm drain and 67% not a single tree on the block face, and for 22% the street only lets through motorbikes, bicycles or people on foot. Among the 34 municipalities with at least 10,000 favela residents, Ribeirão Preto leads on missing light, with 51% of residents in the dark; Bertioga on dirt roads, with 80%; and Cubatão on missing pavements, with 78%, ahead of Bertioga and Santos. The three maps share one frame: only the 92 municipalities with favelas.

imagem: ./mapa_preview.en.png
imagem_alt: "Three maps of São Paulo with the 92 municipalities that have favelas in six shades of brown and the rest in grey: the share of favela residents with no street lighting, on an unpaved street and with no pavement on their block face. Callouts point to Ribeirão Preto, with 51% without street lighting, Bertioga, with 80% on unpaved streets, and Cubatão, with 78% without a pavement. In the fourth frame, bars compare favela residents in São Paulo, Rio de Janeiro and Brazil on six features of the surroundings. In the panel, the five municipalities with the largest share of residents lacking each feature."

recorte: "São Paulo State (SP)"
metodo: "Residents of Favelas and Urban Communities whose block face has no street lighting, paving or pavement over residents with the feature declared, by municipality, from SIDRA 10340, in six classes; municipalities without favelas shown apart."
---

# Street lighting, paving and pavements in São Paulo’s favelas

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 069, the third of four in the collection **Favelas and urban communities**. The favelas,
municipality by municipality, are on [plate 067](../067-favelas-sp/README.en.md).

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `moradores_entorno` (favela residents with surveyed surroundings), `sem_iluminacao`, `sem_pavimentacao`, `sem_calcada`, `sem_bueiro`, `sem_arvores`, `via_so_moto_pedestre` (in %), plus `pct_fcu` and income |
| `setores_fcu` | polygon | 8,008 tracts in favelas |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

It is the **GPKG** of [plate 067](../067-favelas-sp/README.en.md), with the **QGIS styles**
`sem_iluminacao`, `sem_pavimentacao` and `sem_calcada`. The **CSV** has the municipal table, without
geometry.

## Method

1. SIDRA 10340: residents of occupied permanent private households in Favelas and Urban
   Communities, by whether each feature exists on the block face, in each municipality. Table 10339
   gives the same figures for the state, Rio de Janeiro and Brazil.
2. Share without the feature = residents without it over residents with an answer (exists or does
   not); undeclared cases are left out.
3. Six classes closed on the right: up to 10%, 10 to 20%, 20 to 35%, 35 to 50%, 50 to 70% and over
   70%. The panel’s bars list only the 34 municipalities with at least 10,000 favela residents.

## Limitations

- The survey looks only at the home’s block face: a lamp post on the corner, across the street, does
  not count.
- In municipalities with few favela residents, a single community decides the colour; hence the
  panel’s lists keep to those with 10,000 or more.
- The features describe the street, not the home; each household’s water, sewage and rubbish are
  on [plate 070](../070-dentro-e-fora-das-favelas-sp/README.en.md).
