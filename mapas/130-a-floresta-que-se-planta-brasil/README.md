---
numero: 130
titulo: "A floresta que se planta"
subtitulo: "Eucalipto no Cerrado, pínus no Sul"
data: 2026-12-05
rascunho: false
categoria: uso-do-solo
colecao: biomassa-br
tags: [biomassa-br, brasil, biomassa, silvicultura, floresta-plantada, eucalipto, pinus, celulose, pevs, municipios]

contexto: >-
  O Brasil tinha 10,4 milhões de hectares de floresta plantada no fim de 2025, 1,2% do território, e 79% dela é eucalipto. O eucalipto avança pelo Cerrado: Minas Gerais tem 2,2 milhões de hectares e o Mato Grosso do Sul, 1,9 milhão, quase tudo em meia dúzia de municípios na beira do rio Paraná. Ribas do Rio Pardo (MS) tem a maior área plantada do país, 537 mil hectares, eucalipto em 31% do município, ao lado de uma das maiores fábricas de celulose do mundo. O pínus fica no Sul frio e encolheu 10% em dez anos; Arroio Trinta (SC) tem 74% da área plantada, quase toda de pínus. A tora para celulose passou de 77 milhões para 130 milhões de m³ em dez anos, mais 70%.

imagem: ./mapa_preview.png
imagem_alt: "Mapa coroplético do Brasil em projeção cônica de Albers, com os municípios pintados pela parte da área coberta por floresta plantada em 2025, em quatro faixas (1 a 5%, 5 a 15%, 15 a 30% e 30% ou mais), com o matiz da espécie de maior área: verdes para eucalipto, azuis para pínus e ocres para outras espécies. Municípios com menos de 1% ficam em cinza-esverdeado claro, os sem floresta plantada registrada quase brancos, os sem dado em cinza. Um bloco verde-escuro marca o leste do Mato Grosso do Sul; verdes cobrem Minas Gerais, o interior paulista, o sul da Bahia e o Espírito Santo; azuis se concentram no Paraná e em Santa Catarina. Duas chamadas: Ribas do Rio Pardo, no Mato Grosso do Sul, com 537 mil hectares, a maior área plantada, e Arroio Trinta, em Santa Catarina, com 74% do município plantado, quase todo de pínus. No painel, a legenda em grade por espécie e faixa, barras da área de cada espécie em 2015 e 2025 e as seis UFs com mais floresta plantada."

recorte: "Brasil"
fontes:
  - nome: "IBGE — Produção da Extração Vegetal e da Silvicultura 2015 e 2025, área de silvicultura por espécie florestal (SIDRA, tabela 5930)"
    nome_en: "IBGE — Forestry and Plant Extraction Production 2015 and 2025, forestry area by species (SIDRA, table 5930)"
    url: https://sidra.ibge.gov.br/tabela/5930
    ano: 2025
  - nome: "IBGE — Produção da Extração Vegetal e da Silvicultura 2015 e 2025, quantidade produzida na silvicultura (SIDRA, tabela 291)"
    nome_en: "IBGE — Forestry and Plant Extraction Production 2015 and 2025, forestry output (SIDRA, table 291)"
    url: https://sidra.ibge.gov.br/tabela/291
    ano: 2025
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
  - nome: "Natural Earth — países vizinhos (via world-atlas)"
    nome_en: "Natural Earth — neighbouring countries (via world-atlas)"
    url: https://www.naturalearthdata.com/
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "pandas", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Área de floresta plantada em 31/12/2025 da PEVS dividida pela área de cada município, em quatro faixas acima de 1%, com o matiz da espécie de maior área (eucalipto, pínus ou outras)."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#5a8f4e", descricao: "5.571 municípios: floresta plantada em 2015 e 2025, área por espécie, espécie líder, parte da área do município e classe", descricao_en: "5,571 municipalities: planted forest in 2015 and 2025, area by species, leading species, share of municipal area and class" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 unidades da federação", descricao_en: "27 states" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Floresta plantada no Brasil, 31/12/2025"
    rotulo_en: "Planted forest in Brazil, 31/12/2025"
    valor: 10.4
    unidade: "milhões de hectares"
    nota: "1,2% do território; 79% é eucalipto"
    nota_en: "1.2% of the land area; 79% is eucalyptus"
  - tipo: barras
    rotulo: "Floresta plantada, as seis maiores UFs"
    rotulo_en: "Planted forest, the six largest states"
    unidade: "mil hectares"
    itens:
      - { rotulo: "MG", valor: 2216, cor: "#5a8f4e" }
      - { rotulo: "MS", valor: 1903, cor: "#5a8f4e" }
      - { rotulo: "PR", valor: 1172, cor: "#4f8494" }
      - { rotulo: "SP", valor: 1161, cor: "#5a8f4e" }
      - { rotulo: "RS", valor: 996, cor: "#5a8f4e" }
      - { rotulo: "SC", valor: 963, cor: "#4f8494" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-br-2026/br_floresta_plantada.gpkg.zip
    rotulo: "Municípios, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "9,9 MB"
  - formato: csv
    arquivo: dados/br_floresta_plantada.csv
    rotulo: "Os 5.571 municípios, sem geometria"
    rotulo_en: "All 5,571 municipalities, without geometry"
    tamanho: "0,6 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-br-2026/br_floresta_plantada_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-br-2026/br_floresta_plantada_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "6,2 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

doi_automatico: true
versao: "1.0.0"
discussoes: []
---

# A floresta que se planta: floresta plantada por município no Brasil

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 130, a quinta da coleção **Monitor da biomassa**. A floresta plantada dá celulose,
carvão e lenha, e o licor negro das fábricas de celulose é o segundo combustível da eletricidade
a biomassa (prancha 127).

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 5.571 municípios: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `area_km2`, `floresta_2015_ha`, `floresta_2025_ha`, `eucalipto_2025_ha`, `pinus_2025_ha`, `outras_2025_ha`, `situacao_pevs` (valor, não disponível, sem registro), `especie_lider`, `pct_area`, `classe`, `faixa` |
| `ufs` | polígono | 27 unidades da federação, com a região |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `biomassa-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/biomassa-br-2026).
A camada `municipios` traz o **estilo do QGIS** da prancha. O **CSV** fica nesta pasta, em UTF-8,
com a mesma tabela sem geometria.

## Método

1. Área total existente em 31/12 dos efetivos da silvicultura, por espécie (eucalipto, pínus e
   outras), em 2015 e 2025, da Produção da Extração Vegetal e da Silvicultura (PEVS) do IBGE
   (SIDRA, tabela 5930).
2. **Parte da área do município**: floresta plantada em 2025 dividida pela área do município
   (calculada na projeção de Albers). Quatro faixas acima de 1% (1 a 5%, 5 a 15%, 15 a 30% e 30%
   ou mais), com o matiz da espécie de maior área.
3. Os 1.769 municípios que não aparecem na tabela não têm silvicultura registrada na PEVS e ficam
   juntos com os 18 de área zero. Os 243 com «...» (dado não disponível) ficam em cinza.
4. A tora para celulose vem da quantidade produzida na silvicultura (SIDRA, tabela 291), em m³.

## Limitações

- A PEVS é uma estimativa municipal feita com informantes locais (empresas, cooperativas,
  órgãos ambientais), não um levantamento por imagem de satélite.
- A área fica no município do plantio; a madeira pode ser processada longe dali.
- «Outras espécies» junta acácia, teca, seringueira, paricá e outras, com pouca área cada.

## Licença dos dados

Dados abertos do IBGE, de uso livre com citação da fonte.
