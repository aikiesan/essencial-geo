---
numero: 119
titulo: "A estrada cobra"
subtitulo: "Longe de onde uma usina faria sentido, o resíduo disponível fica pelo caminho"
data: 2026-11-10
categoria: energia
colecao: funil-sp
tags: [funil-sp, sao-paulo, biogas, biometano, logistica, estrada, cp2b]
rascunho: true                      # fora do ar: resguardo de artigo em preparação

contexto: >-
  O último passo do funil do biometano é o menor no total e o mais desigual no mapa: 1,0 bilhão de m³ de metano por ano, 15 % do potencial mobilizável de São Paulo, se perde na estocagem e no caminho até uma usina (CP2B, do N3 ao N4, cenário de referência). O fator logístico do método mede, na malha viária, quanto do resíduo cabe no raio econômico de uma usina. O esterco de vaca de leite perde 70 %, porque vem pouco por vaca e espalhado em muitos sítios; o lixo orgânico, só 5 %, porque já chega junto ao aterro. Em 126 municípios a estrada leva mais da metade do mobilizável, como Anhembi, com 94 %, e Presidente Epitácio, com 91 %; em 27, no Vale do Ribeira e no fundo do Vale do Paraíba, leva tudo. É modelo, não medição. Quarta prancha da coleção «O funil do biometano».

imagem: ./mapa_preview.png
imagem_alt: "Mapa coroplético dos municípios de São Paulo em seis tons da paleta cividis, do amarelo ao azul-marinho, pela parte do potencial mobilizável de metano que se perde até o acessível. O amarelo, de até 10 %, cobre o centro e o norte canavieiros e a capital; o cinza e o azul, de 25 a 90 %, aparecem em faixas no oeste e no centro-oeste; o azul-marinho, de mais de 90 %, cobre o Vale do Ribeira, o litoral sul e o fundo do Vale do Paraíba e pontos no extremo oeste. Chamadas apontam Presidente Epitácio, com 91 %, Anhembi, com 94 %, e São Paulo, com 1,5 %, onde o lixo já chega concentrado. No painel, barras mostram a perda por resíduo: 70 % do esterco de vaca de leite, 49 % dos dejetos de suínos, 26 % da palha de soja, 19 % da palha de cana, 16 % do lodo de esgoto, 10 % da torta de filtro, 8 % da vinhaça e 5 % do lixo orgânico."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "CP2B (Unicamp) — potencial de biogás e biometano por município e resíduo, níveis N3 e N4, método v5.1; fatores de estocagem (FS) e logístico (FL)"
    nome_en: "CP2B (Unicamp) — biogas and biomethane potential by municipality and residue, levels N3 and N4, method v5.1; storage (FS) and logistic (FL) factors"
    ano: 2026
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Para cada município, o potencial mobilizável (N3) menos o acessível (N4) do CP2B v5.1, em m³ normais de metano por ano, cenário de referência, como parte do N3. O N4 é o N3 vezes as perdas na estocagem (FS) e o fator logístico (FL), calculado pelo método na malha viária para cada município e resíduo."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#3b4c75", descricao: "645 municípios; o estilo logistica reproduz as classes do mapa (mesmo GPKG das pranchas 116 a 120)", descricao_en: "645 municipalities; the logistica style reproduces the map’s classes (same GPKG as plates 116 to 120)" }

indicadores:
  - tipo: barras
    rotulo: "Perda na estocagem e na estrada, por resíduo"
    rotulo_en: "Storage and road loss, by residue"
    unidade: "% do N3"
    unidade_en: "% of N3"
    itens:
      - { rotulo: "esterco de vaca de leite", rotulo_en: "dairy cow manure", valor: 70, cor: "#3b4c75" }
      - { rotulo: "dejetos de suínos", rotulo_en: "pig slurry", valor: 49, cor: "#6b6b77" }
      - { rotulo: "palha de soja", rotulo_en: "soy straw", valor: 26, cor: "#6b6b77" }
      - { rotulo: "palha de cana", rotulo_en: "cane straw", valor: 19, cor: "#959079" }
      - { rotulo: "lodo de esgoto", rotulo_en: "sewage sludge", valor: 16, cor: "#959079" }
      - { rotulo: "torta de filtro", rotulo_en: "filter cake", valor: 10, cor: "#c8bc6e" }
      - { rotulo: "vinhaça", rotulo_en: "vinasse", valor: 8, cor: "#fdea45" }
      - { rotulo: "lixo orgânico", rotulo_en: "organic waste", valor: 5, cor: "#fdea45" }
  - tipo: proporcao
    rotulo: "O que a estrada leva, por grupo"
    rotulo_en: "What the road takes, by group"
    unidade: "milhões de m³ por ano"
    unidade_en: "million m³ a year"
    itens:
      - { rotulo: "cana", rotulo_en: "sugarcane", valor: 775, cor: "#959079" }
      - { rotulo: "lavouras", rotulo_en: "crops", valor: 134, cor: "#c8bc6e" }
      - { rotulo: "pecuária", rotulo_en: "livestock", valor: 103, cor: "#3b4c75" }
      - { rotulo: "cidades", rotulo_en: "towns", valor: 18, cor: "#fdea45" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/funil-sp-2026/sp_funil_biometano.gpkg.zip
    rotulo: "Municípios e pontos da coleção inteira (pranchas 116 a 120), SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities and points for the whole collection (plates 116 to 120), SIRGAS 2000, with QGIS styles"
    tamanho: "4,6 MB"
  - formato: csv
    arquivo: dados/sp_funil_municipios.csv
    rotulo: "Tabela dos municípios (a mesma nas cinco pranchas)"
    rotulo_en: "Municipal table (the same on all five plates)"
    tamanho: "156 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/funil-sp-2026/sp_funil_logistica_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/funil-sp-2026/sp_funil_logistica_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,2 MB"
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

# O metano que a estrada leva em São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 119, a quarta de cinco da coleção **O funil do biometano**: o último passo do funil, do
potencial mobilizável (N3) ao acessível (N4), e quanto de cada município fica longe de uma usina.

## O que vem nos arquivos

- `dados/sp_funil_municipios.csv`: uma linha por município. Esta prancha usa `perda_estrada_pct`
  (parte do N3 perdida até o N4), `perda_estrada_m3` e a perda por grupo de resíduo,
  `estrada_cana_m3`, `estrada_lavouras_m3`, `estrada_pecuaria_m3` e `estrada_urbano_m3`.
- `sp_funil_biometano.gpkg.zip` (na release `funil-sp-2026`): na camada `municipios`, o estilo
  `logistica` reproduz as classes do mapa.

## Método

1. Para cada município e resíduo, o N4 do CP2B v5.1 é o N3 vezes o fator de estocagem (FS), as perdas
   enquanto o resíduo espera, e o fator logístico (FL).
2. O FL é calculado pelo método na malha viária: a parte do resíduo de cada município que cabe no raio
   econômico de uma usina de codigestão. Resíduo leve e espalhado, como o esterco de leite, cabe menos;
   resíduo que já se junta num lugar, como o lixo e a vinhaça, cabe quase todo.
3. A prancha mostra a perda como parte do N3 do município. As barras do painel são a mesma razão no
   total do estado, por resíduo.

## Limitações

- O raio econômico é um parâmetro do método, não uma usina de verdade; o mapa diz onde o resíduo fica
  longe, não onde uma usina deveria estar.
- Em municípios com N3 pequeno, poucos m³ mudam muito a cor; a perda em m³ está na tabela.
- É modelo, não medição; a prancha 120 mostra quanto o resultado muda entre os cenários.
