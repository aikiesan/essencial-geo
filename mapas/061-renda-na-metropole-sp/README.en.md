---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Income in the metropolis"
subtitulo: "From Itaim Bibi to Jardim Ângela, eleven times over"

contexto: >-
  Greater São Paulo and the Santos lowlands add up to 44 municipalities and 22.3 million people. IBGE divides them into 841 inhabited weighting areas, and in each one the mean income of household heads can be worked out. The richest is Itaim Bibi, in the capital: R$ 17,804 a month, 14.7 minimum wages of 2022. Twenty kilometres away, in the same city, the Jardim Ângela area has R$ 1,655, 1.4 minimum wages: a gap of 10.8 times, the largest among São Paulo municipalities with five areas or more. Barueri comes next, from Alphaville to Engenho Novo (7.6 times), and Santos, from Ponta da Praia to Rádio Clube (6.1). The map shows the capital’s rich centre, stretching south-west to Alphaville, ringed by a pale belt that runs from Francisco Morato to Itaquaquecetuba and down the escarpment to the coast. Second plate of the collection “Income and rooftop solar”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of Greater São Paulo and the Santos lowlands with weighting areas in six shades, from cream to dark plum, by the mean income of household heads in minimum wages. The capital’s expanded centre and Alphaville, in Barueri, are dark plum; the northern, eastern and southern edges and the southern coast are pale; the Santos and Guarujá seafront darkens. Black outlines mark municipalities, with the names of Barueri, Osasco, Guarulhos, Mogi das Cruzes, Santo André and Santos. Two callouts point to Itaim Bibi, with R$ 17,804, and Jardim Ângela, with R$ 1,655. In the panel, the share of household heads in each class and bars with the ratio between the richest and poorest area of São Paulo, Barueri, São José do Rio Preto and Santos."

recorte: "São Paulo and Santos urban concentrations (SP)"
metodo: "Mean income of household heads with income by 2022 Census weighting area: mean of tracts with data, weighted by the number of household heads, in 2022 minimum wages (R$ 1,212), in the 44 municipalities of the São Paulo and Santos urban concentrations."
---

# Income by weighting area in Greater São Paulo and the Santos lowlands

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 061, the second of three in the collection **Income and rooftop solar**: the income of
[plate 060](../060-renda-mediana-sp/README.en.md) aggregated into weighting areas, close up, in the
metropolis. The frame brings together the São Paulo (37 municipalities) and Santos (7) urban
concentrations, as defined by IBGE.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `areas_de_ponderacao` | polygon | the state’s 2,535 areas: `CD_APOND`, `CD_MUN`, `NM_MUN`, `bairro_principal` (main neighbourhood or district), `area_km2`, `setores` (tracts), `setores_sem_info` (confidential tracts), `pessoas` (people), `responsaveis` (household heads), `renda_media` (R$), `renda_media_sm` (minimum wages), `classe` (1 to 6) and `concentracao` (1 inside the map’s frame) |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The GPKG covers the whole state, with the plate’s **QGIS style**. The **CSV** has the same table,
without geometry.

## Method

1. Each census tract goes to its weighting area through IBGE’s correspondence table.
2. Mean income of the area: across tracts with data, the household heads’ mean income times the
   number of household heads, summed and divided by those tracts’ total household heads.
3. Six classes in 2022 minimum wages (R$ 1,212): up to 1.5, 1.5 to 2, 2 to 3, 3 to 5, 5 to 8 and
   over 8.
4. Area name: its most populous neighbourhood or, where there are none, its district (the capital
   has no neighbourhoods in the Census base).
5. Each municipality’s ratio: the area with the highest mean income over the lowest, in the state’s
   116 municipalities with five areas or more.

## Limitations

- A mean rises with a few very rich people; in an area with luxury condominiums and a favela, it
  lands between the two and describes neither.
- Confidential tracts (“X”) are left out of the mean, never counted as zero. The 14 areas in the
  frame with no occupied home are grey.
- The weight is the tract’s number of household heads; IBGE does not publish how many of them have
  an income.
- The main neighbourhood’s name is only a label: an area usually spans several.
