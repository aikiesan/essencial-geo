---
numero: 126
titulo: "Mais boi que gente"
subtitulo: "O rebanho que pasta onde mora pouca gente"
data: 2026-12-01
rascunho: true                      # prévia: aguarda a aprovação da coleção e a data no calendário
categoria: energia
colecao: biomassa-br
tags: [biomassa-br, brasil, biomassa, pecuaria, bovinos, rebanho, ppm, censo-2022, municipios]

contexto: >-
  O Brasil tem 238 milhões de bovinos para 203 milhões de pessoas. Em 3.197 dos 5.571 municípios há mais boi que gente: eles cobrem 68% do território e guardam 89% do rebanho, com 21% da população. O boi pasta onde mora pouca gente: Rondônia tem 11,5 cabeças por habitante, Mato Grosso 9,0 e Tocantins 7,7; São Paulo fica em 0,3, e o Distrito Federal em 0,03. São Félix do Xingu, no Pará, tem o maior rebanho do país, 2,52 milhões de cabeças, 39 por morador, e Rondolândia (MT) chega a 96. Em dez anos o rebanho do Norte cresceu 41%, e o do Sul encolheu 10%. Primeira prancha da coleção «Monitor da biomassa»: o boi é também esterco, matéria-prima do biogás.

imagem: ./mapa_preview.png
imagem_alt: "Mapa coroplético do Brasil em projeção cônica de Albers, com os 5.571 municípios pintados por bovinos por habitante, em sete classes: três tons de azul-acinzentado onde há mais gente que boi e quatro tons de terra, do creme ao marrom-escuro, onde há mais boi que gente. O Amazonas, o Amapá, o litoral e as regiões metropolitanas ficam em azul; um arco marrom-escuro atravessa Rondônia, Mato Grosso, o sul do Pará, o Tocantins e o Mato Grosso do Sul. Duas chamadas: São Félix do Xingu, no Pará, com 2,52 milhões de cabeças, o maior rebanho do país, e Rondolândia, em Mato Grosso, com 96 bois por habitante. No painel, a legenda das classes com o número de municípios em cada uma e barras do rebanho de cada região em 2014 e 2024, com o Norte crescendo 41% e o Sul caindo 10%."

recorte: "Brasil"
fontes:
  - nome: "IBGE — Pesquisa da Pecuária Municipal 2014 e 2024, efetivo dos rebanhos (SIDRA, tabela 3939)"
    nome_en: "IBGE — Municipal Livestock Survey 2014 and 2024, herd size (SIDRA, table 3939)"
    url: https://sidra.ibge.gov.br/tabela/3939
    ano: 2024
  - nome: "IBGE — Censo Demográfico 2022, agregados por município (população)"
    nome_en: "IBGE — 2022 Population Census, municipal aggregates (population)"
    url: https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html
    ano: 2022
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
metodo: "Efetivo de bovinos de 2024 da Pesquisa da Pecuária Municipal dividido pela população do Censo 2022 em cada município e agrupado em sete classes, com o empate (um boi por habitante) no meio da escala."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#a8642a", descricao: "5.571 municípios: população, bovinos em 2014 e 2024, situação na PPM, bois por habitante e classe", descricao_en: "5,571 municipalities: population, cattle in 2014 and 2024, PPM status, cattle per inhabitant and class" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 unidades da federação", descricao_en: "27 states" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Bovinos no Brasil, 2024"
    rotulo_en: "Cattle in Brazil, 2024"
    valor: 238.2
    unidade: "milhões"
    nota: "1,17 por habitante; 3.197 municípios com mais boi que gente"
    nota_en: "1.17 per inhabitant; 3,197 municipalities with more cattle than people"
  - tipo: barras
    rotulo: "Bois por habitante, as cinco maiores e as cinco menores UFs"
    rotulo_en: "Cattle per inhabitant, the five highest and five lowest states"
    unidade: "por habitante"
    itens:
      - { rotulo: "RO", valor: 11.52, cor: "#6b3a1f" }
      - { rotulo: "MT", valor: 8.98, cor: "#a8642a" }
      - { rotulo: "TO", valor: 7.69, cor: "#a8642a" }
      - { rotulo: "MS", valor: 6.80, cor: "#a8642a" }
      - { rotulo: "AC", valor: 6.25, cor: "#a8642a" }
      - { rotulo: "SP", valor: 0.30, cor: "#a9bccb" }
      - { rotulo: "PE", valor: 0.29, cor: "#a9bccb" }
      - { rotulo: "RJ", valor: 0.17, cor: "#a9bccb" }
      - { rotulo: "AP", valor: 0.08, cor: "#6f8ba3" }
      - { rotulo: "DF", valor: 0.03, cor: "#6f8ba3" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-br-2026/br_bois_por_habitante.gpkg.zip
    rotulo: "Municípios, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "9,9 MB"
  - formato: csv
    arquivo: dados/br_bois_por_habitante.csv
    rotulo: "Os 5.571 municípios, sem geometria"
    rotulo_en: "All 5,571 municipalities, without geometry"
    tamanho: "0,5 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-br-2026/br_bois_por_habitante_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-br-2026/br_bois_por_habitante_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "6,2 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,4 MB"

doi_automatico: true
versao: "1.0.0"
discussoes: []
---

# Mais boi que gente: bovinos por habitante no Brasil

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 126, a primeira da coleção **Monitor da biomassa**: o que o Brasil produz de biomassa,
município a município, com dados abertos que se renovam todo ano. Começa pelo boi, que também é
esterco.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 5.571 municípios: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `pop_2022`, `bovinos_2014`, `bovinos_2024`, `situacao_ppm` (valor, zero, não disponível, fora da tabela), `bois_hab`, `mais_boi`, `classe`, `faixa_bois_hab` |
| `ufs` | polígono | 27 unidades da federação, com a região |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `biomassa-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/biomassa-br-2026).
A camada `municipios` traz o **estilo do QGIS** da prancha, com as sete classes. O **CSV** fica nesta
pasta, em UTF-8, com a mesma tabela sem geometria.

## Método

1. Efetivo de bovinos por município da Pesquisa da Pecuária Municipal (PPM) do IBGE, em 2014 e
   2024 (SIDRA, tabela 3939), com os símbolos do IBGE mantidos: «-» é zero; «...» é dado não
   disponível e fica em cinza, nunca como zero.
2. **Bois por habitante**: rebanho de 2024 dividido pela população do Censo 2022. Sete classes,
   com limites em 0,1, 0,5, 1, 2, 5 e 20. O 1, o empate, separa os tons frios (mais gente que boi)
   dos tons de terra (mais boi que gente).
3. Os números do painel e da ficha somam só os municípios com dado na PPM. Os 32 sem dado (quase
   todos da Grande São Paulo e da Baixada Santista, mais Boa Esperança do Norte, criado depois do
   Censo) somam 8,3 milhões de moradores e ficam fora das razões, mas dentro dos 203 milhões.
4. As barras do painel comparam o rebanho de cada região em 2014 e em 2024.

## Limitações

- A PPM é uma estimativa municipal feita pelo IBGE com informantes locais (sindicatos, órgãos de
  defesa agropecuária, empresas), não uma contagem de animais.
- O rebanho fica no município da propriedade; o boi pode passar a vida em mais de um lugar.
- A população é a de 2022, e o rebanho, de 2024.
- Bois por habitante não medem o tamanho do rebanho: a razão alta pode vir de pouca gente.
  Para o volume, use a coluna `bovinos_2024`.

## Licença dos dados

Dados abertos do IBGE, de uso livre com citação da fonte.
