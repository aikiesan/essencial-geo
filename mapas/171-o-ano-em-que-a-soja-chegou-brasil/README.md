---
numero: 171
titulo: "O ano em que a soja chegou"
subtitulo: "Em 1.009 municípios a soja passou de 5 % da terra depois de 1985; na última década, do Rio Grande do Sul a Roraima"
data: 2027-03-12
rascunho: true
categoria: uso-do-solo
colecao: quarenta-anos-de-biomassa-br
tags: [quarenta-anos-de-biomassa-br, brasil, soja, fronteira-agricola, uso-da-terra, mapbiomas, serie-historica]

contexto: >-
  Em 1985, a soja cobria 5% ou mais da terra de 402 municípios, quase todos no Sul. Nos quarenta anos seguintes, ela passou desse limiar em mais 1.009: 320 entre 1986 e 1995, 232 até 2005, 222 até 2015 e 235 de 2016 a 2025. A área plantada foi de 4,5 para 44,2 milhões de hectares no mapeamento do MapBiomas. A última década não foi só a da fronteira norte, com Paragominas (PA) em 2018 e Boa Vista (RR) em 2022: São Paulo teve 47 chegadas, Santa Catarina 33 e Goiás 32, a soja entrando onde antes havia pasto e cana. Primeira prancha da coleção «Quarenta anos de biomassa».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers com os municípios coloridos pelo período em que a soja passou de 5% da área: marrom-escuro para os que já tinham soja em 1985, no Paraná, no Rio Grande do Sul, no sul de Mato Grosso do Sul e de Goiás e no sudoeste de Mato Grosso, e tons cada vez mais claros, até o amarelo, para 1986–1995, 1996–2005, 2006–2015 e 2016–2025, que avançam por Mato Grosso, Goiás, oeste da Bahia, Maranhão, Piauí, Tocantins, Pará e Roraima. Uma chamada aponta Boa Vista (RR), chegada de 2022, a mais ao norte, e outra Paragominas (PA), de 2018. No painel, barras dos municípios por período, um histograma das chegadas por ano, com o pico de 127 em 1986 e 101 em 2014–2015, e uma tabela por região e período."

recorte: "Brasil"
fontes:
  - nome: "MapBiomas — Coleção 11 da série anual de mapas de cobertura e uso da terra do Brasil, estatísticas de cobertura por bioma, estado e município, 1985–2025 (MAPBIOMAS_BRAZIL-COL.11-BIOME_STATE_MUNICIPALITY.xlsx, acesso em 01/11/2026)"
    nome_en: "MapBiomas — Collection 11 of the annual land cover and land use maps of Brazil, coverage statistics by biome, state and municipality, 1985–2025 (MAPBIOMAS_BRAZIL-COL.11-BIOME_STATE_MUNICIPALITY.xlsx, accessed 01/11/2026)"
    url: https://brasil.mapbiomas.org/estatisticas/
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
metodo: "Área de soja (classe 39 do MapBiomas, coleção 11) de cada município em cada ano de 1985 a 2025, somados os biomas, dividida pela área de todas as classes do município; ano de chegada = primeiro ano com 5% ou mais por três anos seguidos (ou até 2025)."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#b5762a", descricao: "5.571 municípios: área, soja em 1985 e 2025 (ha e %), máximo da série, ano e período de chegada", descricao_en: "5,571 municipalities: area, soy in 1985 and 2025 (ha and %), series maximum, year and period of arrival" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 UFs", descricao_en: "27 states" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Municípios em que a soja passou de 5% da área depois de 1985"
    rotulo_en: "Municipalities where soy passed 5% of the land after 1985"
    valor: 1009
    unidade: "municípios"
    nota: "402 já tinham soja acima de 5% em 1985; 1.384 estão acima em 2025"
    nota_en: "402 already had over 5% soy in 1985; 1,384 are above it in 2025"
  - tipo: numero
    rotulo: "Área de soja no Brasil, 2025"
    rotulo_en: "Soy area in Brazil, 2025"
    valor: 44.2
    unidade: "milhões de ha"
    nota: "4,5 milhões em 1985 (9,9 vezes)"
    nota_en: "4.5 million in 1985 (9.9-fold)"
  - tipo: barras
    rotulo: "Municípios por período de chegada da soja"
    rotulo_en: "Municipalities by period of soy arrival"
    unidade: "municípios"
    itens:
      - { rotulo: "já em 1985", valor: 402, cor: "#3b2a14" }
      - { rotulo: "1986–1995", valor: 320, cor: "#7a4e1d" }
      - { rotulo: "1996–2005", valor: 232, cor: "#b5762a" }
      - { rotulo: "2006–2015", valor: 222, cor: "#dca543" }
      - { rotulo: "2016–2025", valor: 235, cor: "#f3d77a" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/quarenta-anos-de-biomassa-br-2026/br_soja_ano_de_chegada.gpkg.zip
    rotulo: "Municípios com o ano de chegada da soja, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities with the year soy arrived, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "9,9 MB"
  - formato: csv
    arquivo: dados/br_soja_ano_de_chegada.csv
    rotulo: "Os 5.571 municípios, com a soja em 1985 e 2025 e o ano de chegada"
    rotulo_en: "The 5,571 municipalities, with soy in 1985 and 2025 and the year of arrival"
    tamanho: "622 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/quarenta-anos-de-biomassa-br-2026/br_soja_ano_de_chegada_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/quarenta-anos-de-biomassa-br-2026/br_soja_ano_de_chegada_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "6,2 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

doi_automatico: false
versao: "1.0.0"
discussoes: []
---

# O ano em que a soja chegou: a soja acima de 5 % da terra, município a município, 1985 a 2025

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 171, a primeira da coleção **Quarenta anos de biomassa**. Em vez da área de soja de hoje,
a data em que ela se tornou parte da paisagem de cada município: uma fronteira desenhada no tempo.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 5.571 municípios: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `area_ha`, `soja_1985_ha`, `soja_1985_pct`, `soja_2025_ha`, `soja_2025_pct`, `soja_max_pct`, `ano_chegada` (0 = nunca; −1 = sem estatística), `periodo` (0 = já em 1985 … 4 = 2016–2025; −1 = nunca), `faixa`, `abaixo_em_2025`, `lon`, `lat` |
| `ufs` | polígono | 27 UFs |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `quarenta-anos-de-biomassa-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/quarenta-anos-de-biomassa-br-2026),
com os **estilos do QGIS** gravados. O **CSV** fica nesta pasta, em UTF-8, com a tabela dos
municípios sem geometria.

## Método

1. Estatísticas de cobertura e uso da terra do MapBiomas, coleção 11 (agosto de 2026), aba
   `COVERAGE_11`: área em hectares de cada classe por bioma, estado e município, em cada ano de 1985
   a 2025. Os municípios que cruzam dois biomas aparecem em mais de uma linha; as linhas foram somadas.
2. Parte da soja: área da classe 39 (soja) dividida pela área de todas as classes do município no
   mesmo ano. As lagoas dos Patos e Mirim (códigos 4300001 e 4300002) ficam de fora; Fernando de
   Noronha não tem estatística.
3. Ano de chegada: o primeiro ano em que a soja cobre 5 % ou mais da área e continua acima disso nos
   dois anos seguintes (em 2024, só em 2025; em 2025, só naquele ano). A exigência de três anos tira
   da conta os saltos de um ano só.
4. Período: já em 1985; 1986–1995; 1996–2005; 2006–2015; 2016–2025. A mediana de latitude e o
   número de chegadas por região saem da mesma tabela.

## Leitura

- Em 1985, 402 municípios já tinham soja acima de 5 % da área: 364 no Sul, 28 no Centro-Oeste e
  10 no Sudeste. Esses municípios têm hoje 12,0 dos 44,2 milhões de hectares de soja.
- Depois disso, a soja passou do limiar em 1.009 municípios: 320 em 1986–1995, 232 em 1996–2005,
  222 em 2006–2015 e 235 em 2016–2025. O ano com mais chegadas foi 1986 (127); depois, 2014 e 2015
  (101 nos dois anos).
- A área de soja do mapeamento foi de 4,5 milhões de hectares em 1985 para 44,2 milhões em 2025.
- Na última década, o Norte teve 29 chegadas e o Nordeste 14; a mais ao norte foi Boa Vista (RR),
  em 2022 (9,3 % da área em 2025), e a de mais soja, Paragominas (PA), em 2018, com 146 mil ha.
  Mas a maior parte das chegadas recentes foi no Centro-Sul: São Paulo 47, Santa Catarina 33,
  Goiás 32, Mato Grosso 22.
- 1.384 municípios têm soja acima de 5 % em 2025; 27 passaram do limiar em algum momento e hoje
  estão abaixo.

## Limitações

- O limiar é relativo à área do município. Municípios enormes do cerrado e da Amazônia precisam de
  muita soja para passar de 5 %, e os pequenos do Sul, de pouca; 2,8 milhões de hectares de soja
  estão em municípios que nunca passaram do limiar.
- A soja dos primeiros anos da série é mapeada com menos acerto: parte dela pode estar em «outras
  lavouras temporárias», e o pico de 1986 deve muito ao começo da série, não só à expansão real.
- É a área mapeada por satélite, não a área colhida do IBGE; as duas não coincidem ano a ano.
- «Chegar» quer dizer passar de 5 % da área, não o primeiro plantio.

## Licença dos dados

Dados do MapBiomas (CC BY 4.0) e do IBGE, de uso livre com citação da fonte.
