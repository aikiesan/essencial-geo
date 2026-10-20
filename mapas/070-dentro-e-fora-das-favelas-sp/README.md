---
numero: 70
titulo: "Dentro e fora da favela"
subtitulo: "Na mesma cidade, dois quintos da renda"
data: 2026-10-20
categoria: censo-renda
colecao: favelas-sp
tags: [favelas-sp, sao-paulo, favelas, comunidades-urbanas, renda, desigualdade, saneamento, censo-2022, municipios]

contexto: >-
  Nos 92 municípios paulistas que têm favela, a renda média de quem responde pelo domicílio é de R$ 1.697 nas favelas e de R$ 4.342 no resto da mesma cidade: 2,6 vezes mais. Dentro, 73% das casas têm esgoto na rede, contra 94% fora; 68% dos responsáveis são pretos ou pardos, contra cerca de 40%; 16% dos moradores têm até 9 anos, contra 11%; e quase ninguém mora em apartamento (0,5%, contra 28%). O mapa compara a renda dentro e fora em cada um dos 45 municípios com ao menos 5 mil moradores em favelas. A distância é maior nas cidades ricas: em Santos e em São Paulo, a renda na favela é 31% da de fora; em Ribeirão Preto e São José dos Campos, 33%. Ela encolhe onde a cidade toda é pobre, como Francisco Morato, Itaquaquecetuba e Rio Grande da Serra, com 81%. Última prancha da coleção «Favelas e comunidades urbanas».

imagem: ./mapa_preview.png
imagem_alt: "Mapa de São Paulo com os 45 municípios que têm ao menos 5 mil moradores em favelas em cinco tons, do creme ao marrom-escuro, pela renda média nas favelas sobre a renda média fora delas; os demais em cinza. A capital, o ABC, Santos e cidades médias do interior são marrom-escuras. Chamadas apontam Santos, com R$ 1.895 na favela e R$ 6.030 fora dela, e Francisco Morato, com 81%. No painel, barras comparam dentro e fora: renda, esgoto na rede, responsáveis pretos ou pardos, crianças de até 9 anos, moradores por domicílio e apartamentos."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022: agregados por setor censitário (domicílios, cor ou raça e rendimento do responsável), com a identificação das Favelas e Comunidades Urbanas"
    nome_en: "IBGE — 2022 Population Census: census tract aggregates (households, colour or race and household head’s income), with the Favelas and Urban Communities identifier"
    url: https://www.ibge.gov.br/estatisticas/sociais/populacao/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Renda média dos responsáveis com rendimento nos setores em Favelas e Comunidades Urbanas sobre a dos demais setores do mesmo município, com os agregados por setor do Censo 2022, nos municípios com ao menos 5 mil moradores em favelas, em cinco classes."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#62351f", descricao: "645 municípios: renda média dentro e fora das favelas e a razão entre elas, além das pessoas em favelas e do entorno", descricao_en: "645 municipalities: mean income inside and outside favelas and the ratio between them, plus people in favelas and surroundings" }
  - { nome: setores_fcu, tipo: poligono, cor: "#97573a", descricao: "8.008 setores em Favelas e Comunidades Urbanas", descricao_en: "8,008 tracts in Favelas and Urban Communities" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "Municípios pela renda na favela sobre a renda fora"
    rotulo_en: "Municipalities by income in the favela over income outside"
    unidade: "municípios"
    unidade_en: "municipalities"
    itens:
      - { rotulo: "até 35 %", rotulo_en: "up to 35%", valor: 6, cor: "#62351f" }
      - { rotulo: "35 a 45 %", rotulo_en: "35 to 45%", valor: 9, cor: "#97573a" }
      - { rotulo: "45 a 55 %", rotulo_en: "45 to 55%", valor: 9, cor: "#bf8159" }
      - { rotulo: "55 a 65 %", rotulo_en: "55 to 65%", valor: 13, cor: "#d8ad8a" }
      - { rotulo: "mais de 65 %", rotulo_en: "over 65%", valor: 8, cor: "#efe0cf" }
  - tipo: numero
    rotulo: "Renda média do responsável na favela"
    rotulo_en: "Mean household-head income in the favela"
    valor: 1697
    unidade: "R$"
    nota: "R$ 4.342 fora, nos mesmos municípios"
    nota_en: "R$ 4,342 outside, in the same municipalities"
  - tipo: numero
    rotulo: "Domicílios de favela com esgoto na rede"
    rotulo_en: "Favela homes with sewage to the mains"
    valor: 73
    unidade: "%"
    nota: "94 % fora"
    nota_en: "94% outside"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/favelas-sp-2026/sp_favelas_2022.gpkg.zip
    rotulo: "Setores em favelas e municípios, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Favela tracts and municipalities, SIRGAS 2000, with QGIS styles"
    tamanho: "5,5 MB"
  - formato: csv
    arquivo: dados/sp_favelas_municipios_2022.csv
    rotulo: "Tabela dos municípios"
    rotulo_en: "Municipal table"
    tamanho: "32 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/favelas-sp-2026/sp_dentro_e_fora_favelas_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/favelas-sp-2026/sp_dentro_e_fora_favelas_2022_prancha.en.svg
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
discussoes: []
---

# Renda, saneamento e moradia dentro e fora das favelas de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 070, a última de quatro da coleção **Favelas e comunidades urbanas**. A rua das favelas
está na [prancha 069](../069-entorno-das-favelas-sp/README.md).

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `renda_media_dentro`, `renda_media_fora` (R$ por mês), `razao_renda`, além de `pessoas_fcu`, `pct_fcu` e do entorno |
| `setores_fcu` | polígono | 8.008 setores em favelas |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

É o **GPKG** da [prancha 067](../067-favelas-sp/README.md). O **CSV** tem a tabela dos municípios,
sem geometria.

## Método

1. Agregados por setor do Censo 2022, separados pelo código de Favela ou Comunidade Urbana: dentro =
   setores em favelas; fora = os demais setores dos 92 municípios que têm favela.
2. Renda média = soma, nos setores, do rendimento nominal médio mensal dos responsáveis com
   rendimento vezes o número deles, sobre o total de responsáveis com rendimento. Setores sem o dado
   ficam fora (19 dentro e 792 fora).
3. Esgoto na rede = rede geral, pluvial ou fossa ligada à rede; água = rede geral como forma
   principal; cor ou raça = a do responsável; crianças = moradores de até 9 anos; apartamento = tipo
   do domicílio.
4. Onde o sigilo estatístico esconde uma célula (X), ela vale 1 ou 2; a soma vira um intervalo, e o
   painel mostra o intervalo quando os dois extremos dão percentuais diferentes.
5. Mapa: razão entre a renda dentro e fora nos 45 municípios com ao menos 5 mil moradores em
   favelas, em cinco classes: até 35%, 35 a 45%, 45 a 55%, 55 a 65% e mais de 65%.

## Limitações

- É a renda do responsável pelo domicílio, não a renda per capita; e o fora inclui outros bairros
  pobres que o IBGE não classificou como favela.
- A comparação é entre conjuntos de setores, não entre pessoas: não diz quanto ganha uma família da
  favela, só a média dos setores.
- O fora de cada município tem tamanho muito diferente: em Guarujá a favela é mais de um terço da
  cidade; em Campinas, um oitavo.
