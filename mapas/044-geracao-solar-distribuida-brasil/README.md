---
numero: 44
titulo: "Geração solar distribuída"
subtitulo: "O sol que mora nos telhados"
data: 2026-11-28
categoria: energia
colecao: energia-eletrica
tags: [energia-eletrica, brasil, solar, fotovoltaica, geracao-distribuida, micro-e-minigeracao, aneel, censo-2022, municipios]

contexto: >-
  São 4,67 milhões de sistemas fotovoltaicos em 5.567 municípios: placas em telhados de casas, lojas e sítios e pequenas usinas de até 5 MW que abatem a conta de luz de quem as instalou. Somam 53,8 GW, 265 W por habitante, 52% deles em residências. O sol de telhado é mais forte no Centro-Oeste e no oeste do Paraná: Mato Grosso tem 872 W por habitante, e Foz do Iguaçu, 1.408 W, lidera entre as cidades de mais de 100 mil habitantes. São Paulo tem a maior potência, 7,6 GW, mas só 170 W por habitante; Taboão da Serra fica em 11 W. No outro extremo, os 20,6 MW de Santa Clara d’Oeste dão 7.939 W a cada um dos seus 2.598 moradores. Última prancha da coleção «Energia elétrica no Brasil».

imagem: ./mapa_preview.png
imagem_alt: "Mapa coroplético do Brasil em projeção cônica de Albers, com os 5.571 municípios pintados por watts de geração solar distribuída por habitante, em sete classes do creme ao marrom-barro. O Amazonas e boa parte do Norte ficam quase todos no creme mais claro, abaixo de 50 W; Mato Grosso, Mato Grosso do Sul, Rondônia e o oeste do Paraná concentram os tons mais escuros; o Nordeste e o Sudeste formam um mosaico de tons médios, mais claros nas regiões metropolitanas. Os limites estaduais vão em cinza-escuro, com as siglas. Duas chamadas: Santa Clara d’Oeste, em São Paulo, com 7.939 W por habitante, o maior valor do país, e Taboão da Serra, com 11 W, o menor entre as cidades de mais de 100 mil habitantes. No painel, a legenda das classes com o número de municípios em cada uma e colunas com os gigawatts registrados por ano, de 2015 a 2026, com o pico em 2024."

recorte: "Brasil"
fontes:
  - nome: "ANEEL — Relação de empreendimentos de geração distribuída (dados abertos, referência 10/2026)"
    nome_en: "ANEEL — List of distributed generation units (open data, reference 10/2026)"
    url: https://dadosabertos.aneel.gov.br/dataset/relacao-de-empreendimentos-de-geracao-distribuida
    ano: 2026
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
metodo: "Potência dos sistemas fotovoltaicos de micro e minigeração distribuída somada por município, dividida pela população do Censo 2022 e agrupada em sete classes de watts por habitante."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#c58739", descricao: "5.571 municípios: população, número de sistemas solares, potência total, por porte, residencial e de autoconsumo remoto (kW), unidades que recebem crédito, watts por habitante e classe", descricao_en: "5,571 municipalities: population, number of solar systems, total capacity, by size, residential and remote self-consumption (kW), units receiving credit, watts per inhabitant and class" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 unidades da federação", descricao_en: "27 states" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Potência solar em geração distribuída"
    rotulo_en: "Solar capacity in distributed generation"
    valor: 53.8
    unidade: "GW"
    nota: "4.665.874 sistemas, 265 W por habitante"
    nota_en: "4,665,874 systems, 265 W per inhabitant"
  - tipo: proporcao
    rotulo: "Potência por classe de consumo (GW)"
    rotulo_en: "Capacity by consumer class (GW)"
    unidade: "GW"
    itens:
      - { rotulo: "Residencial", valor: 28.13, cor: "#c58739" }
      - { rotulo: "Comercial", valor: 14.30, cor: "#a8642a" }
      - { rotulo: "Rural", valor: 6.65, cor: "#7d8a3c" }
      - { rotulo: "Industrial", valor: 3.67, cor: "#4a4e52" }
      - { rotulo: "Poder público", valor: 0.62, cor: "#234e70" }
      - { rotulo: "Outras", valor: 0.42, cor: "#9aa3ab" }
  - tipo: barras
    rotulo: "Watts por habitante, as cinco maiores e as cinco menores UFs"
    rotulo_en: "Watts per inhabitant, the five highest and five lowest states"
    unidade: "W"
    itens:
      - { rotulo: "MT", valor: 872.4, cor: "#7c4423" }
      - { rotulo: "MS", valor: 699.5, cor: "#a8642a" }
      - { rotulo: "PR", valor: 599.7, cor: "#a8642a" }
      - { rotulo: "TO", valor: 503.4, cor: "#c58739" }
      - { rotulo: "RO", valor: 492.2, cor: "#c58739" }
      - { rotulo: "PB", valor: 164.9, cor: "#e3c98a" }
      - { rotulo: "MA", valor: 163.6, cor: "#e3c98a" }
      - { rotulo: "SE", valor: 144.2, cor: "#e3c98a" }
      - { rotulo: "RJ", valor: 127.9, cor: "#e3c98a" }
      - { rotulo: "AM", valor: 115.4, cor: "#e3c98a" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/energia-eletrica-2026/br_geracao_distribuida.gpkg.zip
    rotulo: "Municípios, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "10,0 MB"
  - formato: csv
    arquivo: dados/br_geracao_distribuida.csv
    rotulo: "Os 5.571 municípios, sem geometria"
    rotulo_en: "All 5,571 municipalities, without geometry"
    tamanho: "0,5 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/energia-eletrica-2026/br_geracao_distribuida_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/energia-eletrica-2026/br_geracao_distribuida_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "6,2 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,4 MB"

versao: "1.0.0"
discussoes: []
---

# Geração solar distribuída no Brasil, por município

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 044, a última de três da coleção **Energia elétrica no Brasil**: depois dos fios e das
grandes usinas, a energia que nasce perto de quem a usa.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 5.571 municípios: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `pop_2022`, `n_sistemas`, `kw_total`, `kw_micro` (até 75 kW), `kw_mini` (acima de 75 kW), `kw_residencial`, `kw_remoto` (autoconsumo remoto, compartilhada e condomínio), `uc_credito` (unidades consumidoras que recebem os créditos), `w_hab`, `classe`, `faixa_w_hab` |
| `ufs` | polígono | 27 unidades da federação, com a região |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `energia-eletrica-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/energia-eletrica-2026).
A camada `municipios` traz o **estilo do QGIS** da prancha, com as sete classes de watts por
habitante. O **CSV** fica nesta pasta, em UTF-8, com a mesma tabela sem geometria.

A base da ANEEL tem um registro por sistema, com dados de pessoas físicas e empresas; aqui só
entram somas por município.

## Método

1. Todos os empreendimentos de micro e minigeração distribuída da base de dados abertos da ANEEL,
   na referência de outubro de 2026, filtrados pela usina solar fotovoltaica (UFV). As outras
   fontes (biogás, pequenas hidrelétricas, eólicas) somam 0,3 GW e ficam de fora.
2. Potência instalada somada pelo código IBGE do município onde o sistema está conectado. Nos
   sistemas de autoconsumo remoto, o crédito pode ir para contas em outro lugar; o mapa mostra
   onde fica a placa.
3. **Watts por habitante**: potência do município dividida pela população do Censo 2022. Classes
   com limites em 50, 100, 200, 400, 800 e 1.600 W, que dobram a cada passo.
4. Boa Esperança do Norte (MT), criado depois do Censo, não tem população e vai em cinza.
5. As colunas do painel somam a potência pelo ano da data de atualização cadastral de cada
   sistema, de 2015 a 2026.

## Limitações

- A data usada nas colunas é a da última atualização do cadastro, que na maioria dos sistemas
  coincide com a conexão, mas pode ser posterior. O ano de 2026 vai só até agosto.
- Watts por habitante exageram os municípios pequenos: uma única usina de 5 MW num município de
  2 mil habitantes já passa de 2.000 W. Nas cidades grandes, prédios de apartamentos deixam pouca
  área de telhado por morador.
- A potência é a nominal declarada na conexão, não a energia gerada, que depende do sol de cada
  lugar.
- A população é a de 2022, e a potência, de 2026.

## Licença dos dados

Dados abertos da ANEEL e do IBGE, de uso livre com citação da fonte.
