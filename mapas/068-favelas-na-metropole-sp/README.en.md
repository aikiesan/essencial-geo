---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The favelas of the metropolis"
subtitulo: "On the banks, the slopes and the mangroves"

contexto: >-
  Seen tract by tract, the favelas of Greater São Paulo and the Santos coast are not one patch but hundreds of fragments on valley floors, hillsides and the edges of reservoirs, streams and mangroves. The map window, from Francisco Morato to Guarujá, holds 92% of the state’s favela residents, in 2,747 communities across 51 municipalities. The two largest are in the capital: Paraisópolis, with 59,000 residents, beside Morumbi, and Heliópolis, with 56,000, in the south, next to São Caetano do Sul. Then come Vila São Pedro, in São Bernardo do Campo, with 28,000, and Chafik/Macuco and Jardim Oratório, in Mauá. In the state, only 19 favelas exceed 10,000 residents, with 403,000 people between them; most are small: 2,167 have fewer than 1,000 residents, and the bulk of the population, 1.78 million, lives in the 876 with 1,000 to 5,000.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of Greater São Paulo and the Santos coast on a light grey background, with municipal boundaries in black and census tracts in favelas and urban communities in brown. The tracts form hundreds of small patches, densest in the south and east of the capital, in Guarulhos, the ABC towns, Osasco and the hills and mangroves of Santos, São Vicente, Cubatão and Guarujá. Callouts point to Paraisópolis, the state’s largest favela, with 59,000 residents, and Heliópolis, with 56,000. In the panel, the eight largest favelas as bars and the state’s favelas by size, from under 1,000 to over 10,000 residents."

recorte: "Greater São Paulo and the Santos coast (SP)"
metodo: "Census tracts coded as a Favela or Urban Community in the 2022 Census aggregates, drawn over the municipal mesh; residents of each community = sum of people in its tracts."
---

# The Favelas and Urban Communities of Greater São Paulo and the Santos coast

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 068, the second of four in the collection **Favelas and urban communities**. The state,
municipality by municipality, is on [plate 067](../067-favelas-sp/README.en.md).

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `setores_fcu` | polygon | 8,008 tracts: `CD_SETOR`, `CD_FCU`, `NM_FCU`, `CD_MUN`, `NM_MUN`, `pessoas`, `dppo` |
| `municipios` | polygon | 645 municipalities, with `pessoas_fcu`, `n_fcu` and `pct_fcu` |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

It is the **GPKG** of [plate 067](../067-favelas-sp/README.en.md), with the **QGIS style**
`setores_fcu`. The **CSV** lists the state’s 3,136 communities: `CD_FCU`, `NM_FCU`, `CD_MUN`,
`NM_MUN`, `pessoas`, `setores` and the mean point of the tracts, weighted by people (`lon`, `lat`).

## Method

1. Tracts coded as a Favela or Urban Community in the 2022 Census tract aggregates, joined to the
   tract mesh by code.
2. Window: the municipalities of the São Paulo and Santos urban concentrations with at least 20,000
   favela residents (19 municipalities), with a margin that shows their neighbours.
3. Residents of each community = sum of people in its tracts; the counts by size cover the whole
   state.

## Limitations

- The name is the one IBGE published; several neighbouring communities may have been grouped under
  one name (such as Chafik/Macuco), or a well-known neighbourhood may have been split into more than
  one.
- The whole tract is shaded even when the favela covers only part of it.
- At the plate’s scale neighbouring communities merge: to read them one by one, open the GPKG.
