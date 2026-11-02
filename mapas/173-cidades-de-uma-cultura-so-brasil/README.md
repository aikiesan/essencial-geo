---
numero: 173
titulo: "Cidades de uma cultura só"
subtitulo: "Os municípios com mais da metade da terra em soja foram de 5 a 285, e os da cana, de 33 a 161"
data: 2027-03-17
rascunho: true
categoria: uso-do-solo
colecao: quarenta-anos-de-biomassa-br
tags: [quarenta-anos-de-biomassa-br, brasil, monocultura, soja, cana-de-acucar, pastagem, uso-da-terra, mapbiomas]

contexto: >-
  Em 1985, 5 municípios brasileiros tinham mais da metade da terra em soja; em 2025, 285, quase todos no Rio Grande do Sul (142) e no Paraná (106). Os de cana foram de 33 para 161, e 142 deles estão em São Paulo, 50 dos quais eram de pasto em 1985. O pasto segue de longe a maior cultura única: 1.434 municípios em 1985, 1.792 no auge de 1999 e 1.348 hoje, mas mudou de lugar: o Sudeste perdeu 429 municípios de pasto e o Nordeste e o Norte ganharam 398. Ao todo, 629 municípios deixaram de ser de pasto. Os de soja têm só 24% da soja do país: são pequenos. Terceira prancha da coleção «Quarenta anos de biomassa».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers com os municípios em que uma só classe de lavoura, pasto ou silvicultura do MapBiomas cobre mais de metade da área, em nove categorias: soja (dourado), cana (vinho) e pastagem (marrom), cada uma em tom escuro se já era assim em 1985 e em tom claro se passou a ser depois, silvicultura ou outra lavoura (verde), os que eram de uma cultura só em 1985 e deixaram de ser (bege) e os demais (quase branco). A soja forma manchas no norte do Rio Grande do Sul e no oeste do Paraná; a cana, um bloco no norte de São Paulo e uma faixa no litoral de Alagoas e Pernambuco; o pasto ocupa Minas Gerais, o Espírito Santo, o leste da Bahia, Goiás, o Mato Grosso do Sul e o leste do Pará, e o bege se espalha pelo oeste de São Paulo e o Triângulo Mineiro. Chamadas apontam Boa Esperança (PR), com 87% de soja, e os 142 municípios de cana de São Paulo. No painel, barras por categoria, linhas do número de municípios de pasto, soja e cana de 1985 a 2025 e uma tabela por região."

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
metodo: "Para cada município, em 1985 e em 2025, a classe de maior área entre soja, cana-de-açúcar, pastagem, silvicultura e outras lavouras temporárias (MapBiomas, coleção 11, biomas somados); o município é «de uma cultura só» quando essa classe cobre mais de 50% da área total."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#c08a1e", descricao: "5.570 municípios: classe dominante e % da área em 1985 e 2025, % de soja, cana e pastagem em 2025, categoria", descricao_en: "5,570 municipalities: dominant class and % of area in 1985 and 2025, % soy, cane and pasture in 2025, category" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 UFs", descricao_en: "27 states" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Municípios com mais de 50% da área em soja, 2025"
    rotulo_en: "Municipalities with over 50% of their land under soy, 2025"
    valor: 285
    unidade: "municípios"
    nota: "5 em 1985; 142 no Rio Grande do Sul e 106 no Paraná"
    nota_en: "5 in 1985; 142 in Rio Grande do Sul and 106 in Paraná"
  - tipo: numero
    rotulo: "Municípios com mais de 50% da área em cana, 2025"
    rotulo_en: "Municipalities with over 50% of their land under cane, 2025"
    valor: 161
    unidade: "municípios"
    nota: "33 em 1985; 142 em São Paulo"
    nota_en: "33 in 1985; 142 in São Paulo"
  - tipo: barras
    rotulo: "Municípios de uma cultura só, 1985 e 2025"
    rotulo_en: "One-crop towns, 1985 and 2025"
    unidade: "municípios"
    itens:
      - { rotulo: "pastagem, 1985", valor: 1434, cor: "#7d6a4a" }
      - { rotulo: "pastagem, 2025", valor: 1348, cor: "#7d6a4a" }
      - { rotulo: "soja, 1985", valor: 5, cor: "#c08a1e" }
      - { rotulo: "soja, 2025", valor: 285, cor: "#c08a1e" }
      - { rotulo: "cana, 1985", valor: 33, cor: "#a8325e" }
      - { rotulo: "cana, 2025", valor: 161, cor: "#a8325e" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/quarenta-anos-de-biomassa-br-2026/br_municipios_de_uma_cultura.gpkg.zip
    rotulo: "Municípios com a classe dominante em 1985 e 2025, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities with the dominant class in 1985 and 2025, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "10,0 MB"
  - formato: csv
    arquivo: dados/br_municipios_de_uma_cultura.csv
    rotulo: "Os 5.570 municípios, com a classe dominante e a categoria"
    rotulo_en: "The 5,570 municipalities, with dominant class and category"
    tamanho: "541 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/quarenta-anos-de-biomassa-br-2026/br_municipios_de_uma_cultura_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/quarenta-anos-de-biomassa-br-2026/br_municipios_de_uma_cultura_prancha.en.svg
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

# Cidades de uma cultura só: municípios com mais da metade da terra numa só lavoura ou no pasto, 1985 e 2025

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 173, a terceira da coleção **Quarenta anos de biomassa**. Onde a paisagem do município
inteiro virou uma coisa só, e onde deixou de ser.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 5.570 municípios: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `dominante_1985`, `pct_1985`, `dominante_2025`, `pct_2025` (`nenhuma` quando nenhuma classe passa de 50 %), `soja_2025_pct`, `cana_2025_pct`, `pastagem_2025_pct`, `categoria`, `lon`, `lat` |
| `ufs` | polígono | 27 UFs |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `quarenta-anos-de-biomassa-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/quarenta-anos-de-biomassa-br-2026),
com os **estilos do QGIS** gravados. O **CSV** fica nesta pasta, em UTF-8, com a tabela dos
municípios sem geometria.

## Método

1. Estatísticas de cobertura e uso da terra do MapBiomas, coleção 11, aba `COVERAGE_11`: hectares de
   cada classe por município e ano, somados os biomas; a área total do município é a soma de todas as
   classes, inclusive água e vegetação nativa.
2. Classes candidatas: soja (39), cana-de-açúcar (20), pastagem (15), silvicultura (9) e outras
   lavouras temporárias (41). O mosaico de usos (21) fica de fora: não é uma cultura.
3. Em cada ano, a classe candidata de maior área; se ela cobre mais de 50 % do município, ele é «de
   uma cultura só» daquela classe.
4. Categoria do mapa: a classe de 2025 (soja, cana ou pastagem), separada em «já em 1985» (a mesma
   classe em 1985) e «desde depois de 1985»; silvicultura ou outra lavoura; «era em 1985, deixou de
   ser» (de uma cultura só em 1985, de nenhuma em 2025); e os demais.
5. A série do painel repete a conta em cada ano de 1985 a 2025.

## Leitura

- Ao todo, 1.527 municípios eram de uma cultura só em 1985 e 1.800 em 2025.
- Soja: de 5 para 285 municípios; 142 no Rio Grande do Sul, 106 no Paraná, 11 em São Paulo, 9 em
  Goiás, 8 no Mato Grosso do Sul e 6 em Mato Grosso. Boa Esperança (PR) tem 87,3 % da área em soja.
  Esses 285 municípios somam só 24,2 % da soja do país: os municípios do cerrado são grandes e,
  mesmo com muita soja, guardam vegetação nativa e outros usos.
- Cana: de 33 para 161 municípios; 142 em São Paulo (eram 26), 9 em Alagoas, 7 em Pernambuco e 3 no
  Paraná. Dos novos municípios de cana paulistas, 50 eram de pasto em 1985. Campo Alegre (AL) tem
  80,6 % da área em cana (69,5 % em 1985).
- Pastagem: 1.434 municípios em 1985, 1.792 em 1999, o auge, e 1.348 em 2025. O Sudeste foi de 937
  para 508 e o Sul de 111 para 33; o Nordeste foi de 239 para 531 e o Norte de 2 para 108. Dos 1.434
  de 1985, 629 deixaram de ser de pasto: 565 não têm hoje nenhuma classe acima de 50 %, 53 viraram de
  cana e 9 de soja.

## Limitações

- O limiar de 50 % é da área total do município, inclusive água e mata; um município com muita
  lavoura e uma represa grande pode ficar de fora.
- Nos primeiros anos da série, parte da soja do Sul está em «outras lavouras temporárias»: 54
  municípios eram dessa classe em 1985 (30 no RS, 20 no PR) e 49 deles são de soja hoje. Por isso, o
  salto de 5 para 285 municípios de soja exagera um pouco a mudança real no Sul.
- Uma cultura acima de 50 % não diz nada sobre quem planta nem sobre a rotação: a soja de verão
  costuma dividir o ano com milho ou trigo, que o mapa anual não mostra.
- Área mapeada por satélite, não a área colhida do IBGE. Fernando de Noronha não tem estatística.

## Licença dos dados

Dados do MapBiomas (CC BY 4.0) e do IBGE, de uso livre com citação da fonte.
