---
numero: 58
titulo: "Biometano e rede elétrica"
subtitulo: "O fio chega mais perto do que o cano"
data: 2026-11-18
categoria: energia
colecao: biogas-territorio-sp
tags: [biogas-territorio-sp, sao-paulo, biogas, biometano, transmissao, subestacoes, infraestrutura, cp2b, epe]

contexto: >-
  Quando não há gasoduto, o biogás pode virar eletricidade no próprio lugar e seguir pelo fio. Em São Paulo, a rede básica, de 230 kV para cima, soma 19,1 mil km de linhas e 91 subestações, e cobre o estado muito melhor do que os gasodutos: 58% do potencial de biometano fica a até 10 km de uma linha de transmissão, e só 1% a mais de 50 km. O gargalo é a subestação, onde a energia entra na rede: 65% do potencial fica a mais de 25 km de uma delas, medido do centro do município. Valparaíso, no oeste, tem 197 mil m³ de biometano possível por dia a 2,6 km de uma linha, mas a 52 km da subestação mais próxima. Na prancha anterior, o gás do norte canavieiro ficava longe do cano; aqui, o fio passa por cima dele. Quarta prancha da coleção «Biogás no território».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com os municípios em verdes pelo potencial de biometano, mais escuros no norte e no centro. Por cima, as linhas de transmissão da rede básica, em ocre (até 230 kV), argila (345 e 440 kV) e ameixa (500 kV ou mais), cruzam o estado em todas as direções, mais densas do noroeste à capital; pontos pretos marcam as subestações. Uma chamada aponta Valparaíso, a 52 km da subestação mais próxima, com 197 mil m³ por dia de potencial. No painel, dois conjuntos de barras mostram a parte do potencial por distância à linha e à subestação."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "CP2B (Unicamp) — potencial de biogás e biometano por município, método v5.1"
    nome_en: "CP2B (Unicamp) — biogas and biomethane potential by municipality, method v5.1"
    ano: 2026
  - nome: "EPE — WebMap: linhas de transmissão e subestações existentes, na versão da base de infraestrutura do MapBiomas"
    nome_en: "EPE — WebMap: existing transmission lines and substations, as published in the MapBiomas infrastructure database"
    url: https://gisepeprd2.epe.gov.br/WebMapEPE/
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Distância em linha reta do ponto interno de cada município à linha de transmissão e à subestação da rede básica mais próximas, em quatro faixas, cruzada com o potencial de biometano (método CP2B v5.1, nível N4, cenário de referência)."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#3f6a42", descricao: "645 municípios: potencial e distâncias à linha e à subestação (mesmo GPKG da prancha 055)", descricao_en: "645 municipalities: potential and distances to lines and substations (same GPKG as plate 055)" }
  - { nome: linhas_transmissao, tipo: linha, cor: "#9c4a32", descricao: "493 linhas de 230 kV ou mais, 19,1 mil km dentro de SP", descricao_en: "493 lines of 230 kV or more, 19,100 km inside SP" }
  - { nome: subestacoes, tipo: ponto, cor: "#1a1c1e", descricao: "185 subestações da rede básica, 91 em SP", descricao_en: "185 basic-grid substations, 91 in SP" }

indicadores:
  - tipo: proporcao
    rotulo: "Biometano pela distância à linha de transmissão mais próxima"
    rotulo_en: "Biomethane by distance to the nearest transmission line"
    unidade: "m³/dia"
    unidade_en: "m³/day"
    itens:
      - { rotulo: "até 10 km", rotulo_en: "up to 10 km", valor: 9738996, cor: "#2f5d3a" }
      - { rotulo: "10 a 25 km", rotulo_en: "10 to 25 km", valor: 5865211, cor: "#87a374" }
      - { rotulo: "25 a 50 km", rotulo_en: "25 to 50 km", valor: 1109727, cor: "#d9c27a" }
      - { rotulo: "mais de 50 km", rotulo_en: "over 50 km", valor: 158178, cor: "#c08a2e" }
  - tipo: proporcao
    rotulo: "Biometano pela distância à subestação mais próxima"
    rotulo_en: "Biomethane by distance to the nearest substation"
    unidade: "m³/dia"
    unidade_en: "m³/day"
    itens:
      - { rotulo: "até 10 km", rotulo_en: "up to 10 km", valor: 1160028, cor: "#2f5d3a" }
      - { rotulo: "10 a 25 km", rotulo_en: "10 to 25 km", valor: 4663996, cor: "#87a374" }
      - { rotulo: "25 a 50 km", rotulo_en: "25 to 50 km", valor: 8002364, cor: "#d9c27a" }
      - { rotulo: "mais de 50 km", rotulo_en: "over 50 km", valor: 3045724, cor: "#c08a2e" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biogas-territorio-sp-2026/sp_biogas_territorio.gpkg.zip
    rotulo: "Municípios e infraestrutura (mesmo arquivo das pranchas 055 a 059), SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities and infrastructure (same file as plates 055 to 059), SIRGAS 2000, with QGIS styles"
    tamanho: "4,9 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biogas-territorio-sp-2026/sp_biometano_rede_eletrica_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/biogas-territorio-sp-2026/sp_biometano_rede_eletrica_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,5 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,5 MB"

versao: "1.0.0"
discussoes: []
---

# Biometano e rede elétrica em São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 058, a quarta de cinco da coleção **Biogás no território**: a mesma pergunta da
[prancha 057](../057-biometano-e-gasodutos-sp/README.md), agora para o biogás que vira
eletricidade. A rede inteira do país está na [prancha 042](../042-transmissao-brasil/README.md).

## O que vem nos arquivos

O GPKG e o CSV são os da [prancha 055](../055-densidade-do-biometano-sp/README.md). Esta prancha
usa as camadas `linhas_transmissao` e `subestacoes` e, na camada `municipios`, os campos
`km_linha_transmissao` e `km_subestacao`. Os estilos do QGIS são `potencial` e
`distancia_subestacao`.

## Método

1. Infraestrutura: linhas de transmissão e subestações existentes do WebMap da EPE, na versão da
   base de infraestrutura do MapBiomas (a mesma da prancha 042); ficam as que estão em SP ou a até
   cerca de 60 km da divisa.
2. Distância: em linha reta, do ponto interno de cada município à linha e à subestação mais
   próximas, em km.
3. Faixas: até 10 km, de 10 a 25, de 25 a 50 e mais de 50 km; em cada faixa, a soma do potencial
   (CP2B v5.1, nível N4, cenário de referência).

## Limitações

- A base cobre a rede básica, de 230 kV para cima. As linhas de 138 e 88 kV e as subestações das
  distribuidoras, onde as usinas pequenas costumam se ligar, não estão nela; com elas, as
  distâncias seriam menores.
- A distância é medida do centro do município, não de cada usina.
- Linha perto não quer dizer conexão possível: o acesso depende de capacidade da rede e de
  parecer do operador.
