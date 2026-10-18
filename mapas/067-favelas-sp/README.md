---
numero: 67
titulo: "Favelas e comunidades urbanas"
subtitulo: "Um em cada doze paulistas, quase todos na metrópole e no litoral"
data: 2026-11-27
categoria: censo-renda
colecao: favelas-sp
tags: [favelas-sp, sao-paulo, favelas, comunidades-urbanas, censo-2022, municipios]

contexto: >-
  Em 2022, 3,63 milhões de paulistas moravam em setores que o IBGE classificou como Favelas e Comunidades Urbanas: 8,2% da população, um em cada doze. São 3.136 favelas e comunidades em 92 dos 645 municípios. A capital tem 1,73 milhão de moradores nelas, quase metade do total do estado, em 1.363 comunidades: 15% da cidade. Na parte da população, quem lidera é o litoral: no Guarujá, 37% dos moradores vivem em favelas; em Cubatão, 33%; em São Sebastião, 30%. Fora da capital, a cidade com mais gente em favelas é Guarulhos, com 216 mil, à frente de São Bernardo do Campo e Campinas. No interior, a exceção é Campinas, com 12% da população em favelas; em Ribeirão Preto são 3%, em Sorocaba, 2%. Primeira prancha da coleção «Favelas e comunidades urbanas».

imagem: ./mapa_preview.png
imagem_alt: "Mapa dos municípios de São Paulo em seis tons, do creme ao marrom-escuro, pela parte da população que mora em favelas e comunidades urbanas. A Grande São Paulo e a Baixada Santista são marrom-escuras; o interior, quase todo sem favela, aparece em cinza, com manchas claras em cidades médias. Chamadas apontam a capital, com 1,73 milhão de moradores em 1.363 favelas e comunidades, e o Guarujá, com 37% da população em favelas. No painel, a parte dos moradores de favelas do estado em cada classe, os municípios com a maior parte da população em favelas e os com mais moradores em favelas fora da capital."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022: agregados por setor censitário (características básicas), com a identificação das Favelas e Comunidades Urbanas"
    nome_en: "IBGE — 2022 Population Census: census tract aggregates (basic characteristics), with the Favelas and Urban Communities identifier"
    url: https://www.ibge.gov.br/estatisticas/sociais/populacao/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "IBGE — Malha de Setores Censitários 2022"
    nome_en: "IBGE — 2022 Census Tract Mesh"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/26565-malhas-de-setores-censitarios-divisoes-intramunicipais.html
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Pessoas nos setores censitários com código de Favela ou Comunidade Urbana sobre o total de pessoas de cada município, nos agregados por setor do Censo 2022, em seis classes; municípios sem favela registrada à parte."

camadas:
  - { nome: setores_fcu, tipo: poligono, cor: "#97573a", descricao: "8.008 setores em Favelas e Comunidades Urbanas: código e nome da comunidade, município, pessoas e domicílios ocupados", descricao_en: "8,008 tracts in Favelas and Urban Communities: community code and name, municipality, people and occupied households" }
  - { nome: municipios, tipo: poligono, cor: "#62351f", descricao: "645 municípios: pessoas, pessoas em favelas, número de comunidades, parte da população, entorno e renda dentro e fora", descricao_en: "645 municipalities: people, people in favelas, number of communities, population share, surroundings and income inside and outside" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "Moradores de favelas pela parte da população do município em favelas"
    rotulo_en: "Favela residents by the municipality’s share of population in favelas"
    unidade: "pessoas"
    unidade_en: "people"
    itens:
      - { rotulo: "até 2 %", rotulo_en: "up to 2%", valor: 52839, cor: "#f4ece3" }
      - { rotulo: "2 a 5 %", rotulo_en: "2 to 5%", valor: 152817, cor: "#e9d2bd" }
      - { rotulo: "5 a 10 %", rotulo_en: "5 to 10%", valor: 83380, cor: "#d8ad8a" }
      - { rotulo: "10 a 15 %", rotulo_en: "10 to 15%", valor: 453608, cor: "#bf8159" }
      - { rotulo: "15 a 20 %", rotulo_en: "15 to 20%", valor: 2271240, cor: "#97573a" }
      - { rotulo: "mais de 20 %", rotulo_en: "over 20%", valor: 617270, cor: "#62351f" }
  - tipo: numero
    rotulo: "Pessoas em favelas e comunidades urbanas"
    rotulo_en: "People in favelas and urban communities"
    valor: 8.2
    unidade: "%"
    nota: "3,63 milhões de pessoas"
    nota_en: "3.63 million people"
  - tipo: numero
    rotulo: "Favelas e comunidades urbanas"
    rotulo_en: "Favelas and urban communities"
    valor: 3136
    unidade: "comunidades"
    unidade_en: "communities"
    nota: "em 92 municípios"
    nota_en: "in 92 municipalities"

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
    url: https://github.com/aikiesan/essencial-geo/releases/download/favelas-sp-2026/sp_favelas_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/favelas-sp-2026/sp_favelas_2022_prancha.en.svg
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

# Favelas e Comunidades Urbanas nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 067, a primeira de quatro da coleção **Favelas e comunidades urbanas**. As comunidades,
uma a uma, estão na [prancha 068](../068-favelas-na-metropole-sp/README.md).

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `setores_fcu` | polígono | 8.008 setores: `CD_SETOR`, `CD_FCU`, `NM_FCU` (código e nome da comunidade), `CD_MUN`, `NM_MUN`, `pessoas`, `dppo` (domicílios particulares permanentes ocupados) |
| `municipios` | polígono | 645 municípios: `pessoas`, `pessoas_fcu`, `setores_fcu`, `n_fcu`, `pct_fcu`; o entorno da prancha 069 (`sem_iluminacao`, `sem_pavimentacao`, `sem_calcada` e outros) e a renda da prancha 070 (`renda_media_dentro`, `renda_media_fora`, `razao_renda`) |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

O **GPKG** é o mesmo das quatro pranchas, com os **estilos do QGIS** de cada uma (`pct_fcu`,
`sem_iluminacao`, `sem_pavimentacao`, `sem_calcada` e o dos setores). O **CSV** tem a tabela dos
municípios, sem geometria.

## Método

1. Agregados por setor do Censo 2022: o setor em Favela ou Comunidade Urbana traz o código
   (`CD_FCU`) e o nome da comunidade; cada setor pertence a uma só.
2. Pessoas em favelas = soma das pessoas desses setores; parte = sobre o total de pessoas do
   município, em seis classes fechadas à direita: até 2%, 2 a 5%, 5 a 10%, 10 a 15%, 15 a 20% e
   mais de 20%.
3. Os 553 municípios sem nenhum setor em favela ficam em cinza.

## Limitações

- A favela é a do IBGE: áreas de moradia popular com insegurança da posse e ausência ou
  precariedade de serviços, de infraestrutura ou de urbanização. Loteamentos irregulares e cortiços
  fora dessas áreas não entram, e os critérios de cada prefeitura podem dar contagens diferentes.
- As comunidades seguem os limites dos setores: uma favela pequena dentro de um setor maior pode não
  ter sido delimitada.
- O mapa por município pinta toda a área com a mesma cor; as favelas ocupam só uma pequena parte de
  cada um, como mostra a prancha 068.
