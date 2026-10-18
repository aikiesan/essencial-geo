---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Favelas and urban communities"
subtitulo: "One in twelve people in São Paulo, nearly all in the metropolis and on the coast"

contexto: >-
  In 2022, 3.63 million people in São Paulo lived in tracts that IBGE classed as Favelas and Urban Communities: 8.2% of the population, one in twelve. There are 3,136 favelas and communities in 92 of the 645 municipalities. The capital has 1.73 million residents in them, nearly half the state’s total, in 1,363 communities: 15% of the city. By share of population, the coast leads: in Guarujá, 37% of residents live in favelas; in Cubatão, 33%; in São Sebastião, 30%. Outside the capital, the town with most people in favelas is Guarulhos, with 216,000, ahead of São Bernardo do Campo and Campinas. Inland, the exception is Campinas, with 12% of its population in favelas; in Ribeirão Preto it is 3%, in Sorocaba 2%. First plate of the collection “Favelas and urban communities”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo’s municipalities in six shades, from cream to dark brown, by the share of the population living in favelas and urban communities. Greater São Paulo and the Santos coast are dark brown; the interior, mostly without favelas, is grey, with pale patches in mid-sized towns. Callouts point to the capital, with 1.73 million residents in 1,363 favelas and communities, and Guarujá, with 37% of its population in favelas. In the panel, the share of the state’s favela residents in each class, the municipalities with the largest share of population in favelas and those with most favela residents outside the capital."

recorte: "São Paulo State (SP)"
metodo: "People in census tracts coded as a Favela or Urban Community over all people in each municipality, from the 2022 Census tract aggregates, in six classes; municipalities with no recorded favela shown apart."
---

# Favelas and Urban Communities in São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 067, the first of four in the collection **Favelas and urban communities**. The
communities, one by one, are on [plate 068](../068-favelas-na-metropole-sp/README.en.md).

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `setores_fcu` | polygon | 8,008 tracts: `CD_SETOR`, `CD_FCU`, `NM_FCU` (community code and name), `CD_MUN`, `NM_MUN`, `pessoas`, `dppo` (occupied permanent private households) |
| `municipios` | polygon | 645 municipalities: `pessoas`, `pessoas_fcu`, `setores_fcu`, `n_fcu`, `pct_fcu`; the surroundings of plate 069 (`sem_iluminacao`, `sem_pavimentacao`, `sem_calcada` and others) and the income of plate 070 (`renda_media_dentro`, `renda_media_fora`, `razao_renda`) |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The **GPKG** is the same for all four plates, with each one’s **QGIS style** (`pct_fcu`,
`sem_iluminacao`, `sem_pavimentacao`, `sem_calcada` and the tract style). The **CSV** has the
municipal table, without geometry.

## Method

1. 2022 Census tract aggregates: a tract in a Favela or Urban Community carries the community’s
   code (`CD_FCU`) and name; each tract belongs to one community only.
2. People in favelas = sum of people in those tracts; share = over all people in the municipality,
   in six classes closed on the right: up to 2%, 2 to 5%, 5 to 10%, 10 to 15%, 15 to 20% and over
   20%.
3. The 553 municipalities with no tract in a favela are grey.

## Limitations

- The favela is IBGE’s: areas of low-income housing with insecure tenure and missing or poor
  services, infrastructure or urbanisation. Irregular subdivisions and tenements outside those areas
  are left out, and each city hall’s criteria may give different counts.
- Communities follow tract boundaries: a small favela inside a larger tract may not have been
  delineated.
- The municipal map paints the whole area in one colour; favelas take up only a small part of each,
  as plate 068 shows.
