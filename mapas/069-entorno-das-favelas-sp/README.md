---
numero: 69
titulo: "A rua da favela"
subtitulo: "Sem luz pública na porta: 15 % nas favelas paulistas, 9 % nas do país"
data: 2026-11-29
categoria: censo-renda
colecao: favelas-sp
tags: [favelas-sp, sao-paulo, favelas, comunidades-urbanas, iluminacao-publica, pavimentacao, calcada, entorno-dos-domicilios, censo-2022, municipios]

contexto: >-
  No Censo 2022, a Pesquisa Urbanística do Entorno dos Domicílios olhou a face de quadra em frente a cada casa. Nas favelas paulistas, 15% dos moradores não têm iluminação pública na porta, contra 9% nas favelas do Rio e nas do país. A pavimentação está melhor que a média: 19% moram em via sem pavimento, contra 22% no Brasil. Mas 45% não têm calçada, 56% não têm bueiro e 67% não têm uma árvore na face de quadra, e para 22% a via só deixa passar moto, bicicleta ou quem anda a pé. Entre os 34 municípios com ao menos 10 mil moradores em favelas, Ribeirão Preto lidera na falta de luz, com 51% dos moradores no escuro; Bertioga, na rua de terra, com 80%; e Cubatão, na falta de calçada, com 78%, à frente de Bertioga e Santos. Os três mapas mostram o mesmo recorte: só os 92 municípios com favela.

imagem: ./mapa_preview.png
imagem_alt: "Três mapas de São Paulo com os 92 municípios que têm favela em seis tons de marrom e os demais em cinza: a parte dos moradores de favelas sem iluminação pública, em via sem pavimentação e sem calçada na face de quadra. Chamadas apontam Ribeirão Preto, com 51% sem iluminação pública, Bertioga, com 80% em rua sem pavimento, e Cubatão, com 78% sem calçada. No quarto quadro, barras comparam os moradores de favelas de São Paulo, do Rio de Janeiro e do Brasil em seis itens do entorno. No painel, os cinco municípios com a maior parte de moradores sem cada item."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022: tabela 10340 (moradores em Favelas e Comunidades Urbanas por características do entorno, por município)"
    nome_en: "IBGE — 2022 Population Census: table 10340 (residents of Favelas and Urban Communities by surroundings, by municipality)"
    url: https://sidra.ibge.gov.br/tabela/10340
    ano: 2022
  - nome: "IBGE — Censo Demográfico 2022: tabela 10339 (o mesmo, por unidade da federação)"
    nome_en: "IBGE — 2022 Population Census: table 10339 (the same, by federative unit)"
    url: https://sidra.ibge.gov.br/tabela/10339
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Moradores de Favelas e Comunidades Urbanas cuja face de quadra não tem iluminação pública, pavimentação ou calçada sobre os moradores com a característica declarada, por município, do SIDRA 10340, em seis classes; municípios sem favela à parte."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#7c5a3c", descricao: "645 municípios: moradores de favelas com entorno pesquisado e as partes sem iluminação, pavimentação, bueiro, calçada e árvore, e em via só para moto ou pedestre", descricao_en: "645 municipalities: favela residents with surveyed surroundings and the shares without street lighting, paving, storm drains, pavement and trees, and on streets for motorbikes or pedestrians only" }
  - { nome: setores_fcu, tipo: poligono, cor: "#97573a", descricao: "8.008 setores em Favelas e Comunidades Urbanas", descricao_en: "8,008 tracts in Favelas and Urban Communities" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Moradores de favelas sem iluminação pública na face de quadra"
    rotulo_en: "Favela residents with no street lighting on their block face"
    valor: 15.4
    unidade: "%"
    nota: "8,9 % no Brasil e no Rio de Janeiro"
    nota_en: "8.9% in Brazil and in Rio de Janeiro"
  - tipo: numero
    rotulo: "Moradores de favelas sem calçada"
    rotulo_en: "Favela residents with no pavement"
    valor: 45.4
    unidade: "%"
    nota: "46,1 % no Brasil"
    nota_en: "46.1% in Brazil"
  - tipo: numero
    rotulo: "Moradores de favelas em via sem pavimentação"
    rotulo_en: "Favela residents on unpaved streets"
    valor: 18.5
    unidade: "%"
    nota: "21,7 % no Brasil"
    nota_en: "21.7% in Brazil"

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
    url: https://github.com/aikiesan/essencial-geo/releases/download/favelas-sp-2026/sp_entorno_favelas_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/favelas-sp-2026/sp_entorno_favelas_2022_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "5,8 MB"
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

# Iluminação pública, pavimentação e calçada nas favelas de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 069, a terceira de quatro da coleção **Favelas e comunidades urbanas**. As favelas,
município por município, estão na [prancha 067](../067-favelas-sp/README.md).

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `moradores_entorno` (moradores de favelas com entorno pesquisado), `sem_iluminacao`, `sem_pavimentacao`, `sem_calcada`, `sem_bueiro`, `sem_arvores`, `via_so_moto_pedestre` (em %), além de `pct_fcu` e da renda |
| `setores_fcu` | polígono | 8.008 setores em favelas |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

É o **GPKG** da [prancha 067](../067-favelas-sp/README.md), com os **estilos do QGIS**
`sem_iluminacao`, `sem_pavimentacao` e `sem_calcada`. O **CSV** tem a tabela dos municípios, sem
geometria.

## Método

1. SIDRA 10340: moradores em domicílios particulares permanentes ocupados de Favelas e Comunidades
   Urbanas, pela existência de cada item na face de quadra, em cada município. A 10339 dá os mesmos
   números para o estado, o Rio de Janeiro e o Brasil.
2. Parte sem o item = moradores sem ele sobre os moradores com resposta (existe ou não existe); os
   casos não declarados ficam fora da conta.
3. Seis classes fechadas à direita: até 10%, 10 a 20%, 20 a 35%, 35 a 50%, 50 a 70% e mais de 70%.
   As barras do painel listam só os 34 municípios com ao menos 10 mil moradores em favelas.

## Limitações

- A pesquisa olha só a face de quadra do domicílio: um poste na esquina, do outro lado, não conta.
- Nos municípios com poucos moradores em favelas, uma única comunidade decide a cor; por isso as
  listas do painel ficam com os de 10 mil ou mais.
- Os itens descrevem a rua, não a casa; a água, o esgoto e o lixo de cada domicílio estão na
  [prancha 070](../070-dentro-e-fora-das-favelas-sp/README.md).
