---
numero: 169
titulo: "Menos coco quebrado"
subtitulo: "A amêndoa de babaçu caiu 88 % desde 1988, sem que caísse o número de municípios"
data: 2027-03-08
rascunho: true
categoria: biomas
colecao: biomassa-da-mata-br
tags: [biomassa-da-mata-br, brasil, babacu, extrativismo, maranhao, tocantins, piaui, pevs]

contexto: >-
  O babaçu é a palmeira das quebradeiras de coco do Maranhão, do Piauí e do Tocantins, que tiram a amêndoa do coco à mão. Em 1988, o país registrou 200 mil toneladas de amêndoa; em 2025, 24,3 mil, uma queda de 88%. O número de municípios que declaram babaçu, porém, não caiu: eram 231 em 1986 e são 278 em 2025. O que encolheu foi a quantidade de cada um, de 819 para 88 toneladas por município. Codó, o maior produtor, passou de 14,3 mil toneladas por ano em 1986–1990 a 498 em 2021–2025. No Tocantins, a queda foi de 98,6%, de 37,4 mil para 507 toneladas por ano. O Maranhão, que tinha 75% da amêndoa em 1986, tem hoje 87%. A pesquisa conta toneladas, não diz por que elas caíram. Segunda prancha da coleção «O que se colhe na mata».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers com anéis proporcionais à média anual de amêndoa de babaçu em 1986–1990 e discos proporcionais à de 2021–2025 em cada município, com o disco colorido pela mudança: caiu mais de 90%, caiu de 50 a 90%, caiu menos da metade ou cresceu, passou a declarar e deixou de declarar. Os símbolos se concentram no Maranhão, no norte do Piauí e no Bico do Papagaio, no Tocantins, onde restam anéis grandes quase vazios. Uma chamada aponta Codó (MA), de 14,3 mil para 498 toneladas por ano, e outra o Tocantins, com queda de 98,6%. No painel, uma área empilhada por UF que cai de 200 mil toneladas em 1988 a 24 mil em 2025 e barras dos oito maiores municípios de 1986–1990 com o pouco que restou."

recorte: "Brasil"
fontes:
  - nome: "IBGE — Produção da Extração Vegetal e da Silvicultura (PEVS), tabela 289 do SIDRA: babaçu (amêndoa) extraído por município, 1986–2025 (acesso em 01/11/2026)"
    nome_en: "IBGE — Forestry and Plant Extraction Survey (PEVS), SIDRA table 289: babassu kernels gathered by municipality, 1986–2025 (accessed 01/11/2026)"
    url: https://sidra.ibge.gov.br/tabela/289
    ano: 2026
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
metodo: "Toneladas de amêndoa de babaçu extraídas por município (PEVS, tabela 289), 1986–2025; média anual de 1986–1990 contra a de 2021–2025, com anos sem dado contados como zero; categorias pela razão entre as duas médias."

camadas:
  - { nome: municipios, tipo: ponto, cor: "#9c4a32", descricao: "363 municípios com babaçu em 1986–1990 ou 2021–2025: toneladas em 1986, 1988 e 2025, médias dos dois quinquênios, variação e categoria", descricao_en: "363 municipalities with babassu in 1986–1990 or 2021–2025: tonnes in 1986, 1988 and 2025, means of both five-year periods, change and category" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 UFs: médias de 1986–1990 e 2021–2025 e toneladas em 2025", descricao_en: "27 states: means for 1986–1990 and 2021–2025 and tonnes in 2025" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Queda da amêndoa de babaçu, 1988–2025"
    rotulo_en: "Fall in babassu kernels, 1988–2025"
    valor: -87.8
    unidade: "%"
    nota: "200.037 t em 1988, 24.337 t em 2025"
    nota_en: "200,037 t in 1988, 24,337 t in 2025"
  - tipo: numero
    rotulo: "Amêndoa por município que declara babaçu, 2025"
    rotulo_en: "Kernels per reporting municipality, 2025"
    valor: 87.5
    unidade: "t"
    nota: "278 municípios; 818,6 t em 231 municípios em 1986"
    nota_en: "278 municipalities; 818.6 t across 231 in 1986"
  - tipo: barras
    rotulo: "Amêndoa de babaçu por UF, média anual 2021–2025"
    rotulo_en: "Babassu kernels by state, yearly mean 2021–2025"
    unidade: "mil t"
    itens:
      - { rotulo: "Maranhão", valor: 24.5, cor: "#9c4a32" }
      - { rotulo: "Piauí", valor: 2.7, cor: "#d6a96a" }
      - { rotulo: "Tocantins", valor: 0.5, cor: "#7d8a3c" }
      - { rotulo: "outras UFs", valor: 0.1, cor: "#b9bdc1" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-da-mata-br-2026/br_babacu_amendoa.gpkg.zip
    rotulo: "Municípios com babaçu, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities with babassu, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,2 MB"
  - formato: csv
    arquivo: dados/br_babacu_amendoa.csv
    rotulo: "Os 363 municípios, com as médias de 1986–1990 e 2021–2025"
    rotulo_en: "The 363 municipalities, with the 1986–1990 and 2021–2025 means"
    tamanho: "32 kB"
  - formato: csv
    arquivo: dados/br_babacu_amendoa_serie.csv
    rotulo: "Série nacional, 1986–2025: toneladas por UF e municípios que declaram"
    rotulo_en: "National series, 1986–2025: tonnes by state and reporting municipalities"
    tamanho: "2 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-da-mata-br-2026/br_babacu_amendoa_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-da-mata-br-2026/br_babacu_amendoa_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "3,3 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,2 MB"

doi_automatico: false
versao: "1.0.0"
discussoes: []
---

# Menos coco quebrado: amêndoa de babaçu por município, 1986–1990 e 2021–2025

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 169, a segunda da coleção **O que se colhe na mata**. O babaçu continua sendo colhido em
quase tantos municípios quanto antes, mas em quantidades muito menores.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | ponto | 363 municípios com babaçu em 1986–1990 ou 2021–2025: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `t_1986`, `t_1988`, `media_1986_1990`, `media_2021_2025`, `t_2025` (t), `variacao_pct`, `categoria`, `lon`, `lat` |
| `ufs` | polígono | 27 UFs: `media_1986_1990`, `media_2021_2025`, `t_2025` (t) |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `biomassa-da-mata-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/biomassa-da-mata-br-2026),
com os **estilos do QGIS** gravados. Os dois **CSV** ficam nesta pasta, em UTF-8: os municípios e a
série anual do país, por UF.

## Método

1. PEVS, tabela 289 do SIDRA: babaçu (amêndoa), em toneladas, por município, de 1986 a 2025,
   baixada pela API do SIDRA em 01/11/2026. «-» é zero; células sem informação contam como sem
   produção; não há células inibidas.
2. Média anual de cada município em 1986–1990 e em 2021–2025 (soma dos cinco anos ÷ 5).
3. Categorias: passou a declarar (sem babaçu em 1986–1990), deixou de declarar (sem babaçu em
   2021–2025), caiu mais de 90%, caiu de 50 a 90%, e caiu menos da metade ou cresceu.
4. Série nacional: soma dos municípios em cada ano, por UF (Maranhão, Piauí, Tocantins e as demais).

## Leitura

- A amêndoa somou 189.100 t em 1986 e chegou ao máximo da série em 1988, com 200.037 t. Em 2025
  foram 24.337 t, 87,8% abaixo do pico.
- Os municípios que declaram babaçu eram 231 em 1986 e são 278 em 2025; a média por município caiu
  de 818,6 t para 87,5 t.
- Dos 363 municípios do mapa, 99 caíram mais de 90%, 68 caíram de 50 a 90%, 17 caíram menos da
  metade ou cresceram, 117 passaram a declarar e 62 deixaram de declarar.
- Codó (MA), o maior produtor de 1986–1990, passou de 14.283 t por ano a 498 t; Coroatá (MA), de
  10.406 t a 448 t. Hoje o maior é Vargem Grande (MA), com 993 t por ano.
- O Tocantins caiu 98,6%, de 37.379 t por ano para 507 t; Tocantinópolis, de 10.000 t para 93 t.
  O Maranhão foi de 141 mil t por ano para 24,5 mil e passou de 75% para 87% da amêndoa do país.
- A série tem dois degraus: entre 1992 e 1995 (de 169 mil para 99 mil t) e a partir de 2015 (de
  78 mil para 24 mil t em dez anos).

## Limitações

- A PEVS registra o que os informantes declaram para cada município; não diz por que a quantidade
  caiu, nem quantas pessoas quebram coco.
- Muitos municípios do Maranhão, Piauí e Tocantins foram criados depois de 1986 a partir de outros;
  parte dos «passou a declarar» e da queda dos municípios de origem é só a divisão do território.
  A série nacional não é afetada.
- A amêndoa é só uma parte do coco; a casca e o mesocarpo, que também têm uso, não entram na conta.

## Licença dos dados

Dados abertos do IBGE, de uso livre com citação da fonte.
