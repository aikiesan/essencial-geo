---
numero: 66
titulo: "Urbano e rural"
subtitulo: "Três em cada cem paulistas moram no campo"
data: 2026-10-20
categoria: censo-renda
colecao: gente-sp
tags: [gente-sp, sao-paulo, populacao-rural, urbano-e-rural, censo-2022, municipios]

contexto: >-
  Dos 44,1 milhões de moradores de domicílios particulares de São Paulo, 1,30 milhão vive em situação rural: 2,9%, três em cada cem. O campo paulista se concentra no sul e no leste: na região intermediária de Sorocaba, 11% dos moradores são rurais; na de Presidente Prudente, 8%; na de São Paulo, 0,7%. O mapa escurece no Vale do Ribeira e no alto Paranapanema, na Mantiqueira e na Serra do Mar, onde as cidades são pequenas e as casas, espalhadas. Pedra Bela, na divisa com Minas Gerais, tem 73% dos moradores no campo, e 14 municípios têm maioria rural. Em número, o maior campo é o de Mogi das Cruzes, com 27 mil moradores rurais, à frente de Ibiúna e Piedade; a capital tem 16 mil. Cinco municípios da Grande São Paulo e Águas de São Pedro não têm nenhum. Última prancha da coleção «Gente no território».

imagem: ./mapa_preview.png
imagem_alt: "Mapa dos municípios de São Paulo em seis tons, do creme ao marrom-escuro, pela parte dos moradores em domicílios rurais. O sul, o Vale do Ribeira, a Serra do Mar e a Mantiqueira são marrom-escuros; o centro-norte e a Grande São Paulo, claros. Chamadas apontam Pedra Bela, com 73% dos moradores no campo, e Mogi das Cruzes, com 27 mil moradores rurais. No painel, a parte dos moradores rurais do estado em cada classe, com o número de municípios, barras por região intermediária, de 11% em Sorocaba a 0,7% em São Paulo, e os municípios com mais moradores rurais."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022: tabela 9922 (domicílios e moradores por situação do domicílio)"
    nome_en: "IBGE — 2022 Population Census: table 9922 (households and residents by urban/rural status)"
    url: https://sidra.ibge.gov.br/tabela/9922
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Moradores em domicílios particulares permanentes ocupados de situação rural sobre o total de moradores desses domicílios, por município, do SIDRA 9922, em seis classes; municípios sem morador rural à parte."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#87692d", descricao: "645 municípios: domicílios e moradores urbanos e rurais, parte rural, idade e sexo (a mesma camada da prancha 064)", descricao_en: "645 municipalities: urban and rural households and residents, rural share, age and sex (the same layer as plate 064)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "Moradores rurais pela parte rural do município"
    rotulo_en: "Rural residents by the municipality’s rural share"
    unidade: "pessoas"
    unidade_en: "people"
    itens:
      - { rotulo: "até 2 %", rotulo_en: "up to 2%", valor: 144454, cor: "#f2efe6" }
      - { rotulo: "2 a 5 %", rotulo_en: "2 to 5%", valor: 192617, cor: "#e6dcb6" }
      - { rotulo: "5 a 10 %", rotulo_en: "5 to 10%", valor: 287468, cor: "#d0be7f" }
      - { rotulo: "10 a 20 %", rotulo_en: "10 to 20%", valor: 252445, cor: "#b3964d" }
      - { rotulo: "20 a 40 %", rotulo_en: "20 to 40%", valor: 265828, cor: "#87692d" }
      - { rotulo: "mais de 40 %", rotulo_en: "over 40%", valor: 156940, cor: "#56411a" }
  - tipo: numero
    rotulo: "Moradores em domicílios rurais"
    rotulo_en: "Residents of rural households"
    valor: 2.9
    unidade: "%"
    nota: "1,30 milhão de 44,1 milhões"
    nota_en: "1.30 million of 44.1 million"
  - tipo: numero
    rotulo: "Municípios com maioria rural"
    rotulo_en: "Municipalities with a rural majority"
    valor: 14
    unidade: "municípios"
    unidade_en: "municipalities"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/gente-sp-2026/sp_gente_municipios_2022.gpkg.zip
    rotulo: "Municípios com idade, sexo e situação do domicílio, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities with age, sex and urban/rural status, SIRGAS 2000, with QGIS styles"
    tamanho: "4,5 MB"
  - formato: csv
    arquivo: dados/sp_gente_municipios_2022.csv
    rotulo: "Tabela dos municípios"
    rotulo_en: "Municipal table"
    tamanho: "70 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/gente-sp-2026/sp_urbano_rural_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/gente-sp-2026/sp_urbano_rural_2022_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,2 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

doi_automatico: true
versao: "1.0.0"
doi: 10.5281/zenodo.23540400
discussoes: []
---

# População urbana e rural nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 066, a última de quatro da coleção **Gente no território**. A densidade, setor por
setor, está na [prancha 063](../063-densidade-sp/README.md).

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `dppo`, `dppo_urbana`, `dppo_rural` (domicílios particulares permanentes ocupados), `moradores`, `moradores_urbana`, `moradores_rural`, `pct_rural`, além da idade e do sexo da prancha 064 |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

É o mesmo **GPKG** da [prancha 064](../064-idade-e-sexo-sp/README.md), com o **estilo do QGIS**
`moradores_rurais`. O **CSV** tem a mesma tabela, sem geometria.

## Método

1. SIDRA 9922: domicílios particulares permanentes ocupados e seus moradores, por situação do
   domicílio (urbana ou rural), em cada município.
2. Parte rural = moradores rurais sobre o total, em seis classes fechadas à direita: até 2%, 2 a 5%,
   5 a 10%, 10 a 20%, 20 a 40% e mais de 40%. Os seis municípios sem nenhum morador rural ficam em
   cinza.
3. Regiões intermediárias: soma dos moradores rurais sobre a soma dos moradores.

## Limitações

- Urbano e rural seguem os perímetros definidos por lei municipal: uma casa no meio do campo, dentro
  do perímetro urbano, conta como urbana, e um condomínio fora dele, como rural.
- A tabela conta só moradores de domicílios particulares permanentes; ficam de fora os domicílios
  coletivos e os improvisados (cerca de 294 mil pessoas no estado).
- O mapa por município pinta toda a área com a mesma cor; dentro de cada um, o campo e a cidade
  estão em lugares diferentes, como mostra a prancha 063.
