---
numero: 57
titulo: "Biometano e gasodutos"
subtitulo: "O gás do campo fica longe do cano"
data: 2026-10-20
categoria: energia
colecao: biogas-territorio-sp
tags: [biogas-territorio-sp, sao-paulo, biometano, gasodutos, gas-natural, infraestrutura, cp2b, epe]

contexto: >-
  Biometano é gás natural renovável: para chegar a quem o usa, precisa de um gasoduto, ou de caminhão. Em São Paulo, os gasodutos de transporte somam 1.892 km, num eixo que vem do Mato Grosso do Sul pelo Gasbol, passa por Campinas e desce à capital e ao Vale do Paraíba; as redes de distribuição da Comgás, da Gás Brasiliano e da Naturgy se adensam em volta dele. O potencial, não. Medida do centro de cada município até o gasoduto mais próximo, 55% do biometano possível no estado fica a mais de 50 km de um cano; só 18% fica a até 10 km, em 156 municípios onde moram 32 milhões de pessoas. Guaíra, o maior potencial do estado, com 333 mil m³ por dia, está a 150 km do gasoduto mais próximo; Morro Agudo, o segundo, a 103 km. O norte canavieiro é um campo de gás sem cano. Terceira prancha da coleção «Biogás no território».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com os municípios em verdes pelo potencial de biometano, mais escuros no norte e no centro. Por cima, os gasodutos de transporte em ameixa, com pontos de entrega, num eixo que entra pelo oeste, cruza o centro até Campinas e segue para a capital, o litoral e o Vale do Paraíba, e as redes de distribuição em ocre, adensadas em volta de Campinas, Sorocaba e da Grande São Paulo. O norte, o mais verde, não tem gasoduto. Uma chamada aponta Guaíra, a 150 km do gasoduto mais próximo, com o maior potencial do estado: 333 mil m³ por dia. No painel, barras mostram a parte do potencial a até 10 km, de 10 a 25, de 25 a 50 e a mais de 50 km de um gasoduto."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "CP2B (Unicamp) — potencial de biogás e biometano por município, método v5.1"
    nome_en: "CP2B (Unicamp) — biogas and biomethane potential by municipality, method v5.1"
    ano: 2026
  - nome: "EPE — WebMap: gasodutos de transporte e de distribuição e pontos de entrega existentes, na versão da base de infraestrutura do MapBiomas"
    nome_en: "EPE — WebMap: existing transmission and distribution gas pipelines and delivery points, as published in the MapBiomas infrastructure database"
    url: https://gisepeprd2.epe.gov.br/WebMapEPE/
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Distância em linha reta do ponto interno de cada município ao gasoduto de transporte ou de distribuição existente mais próximo, em quatro faixas, cruzada com o potencial de biometano (método CP2B v5.1, nível N4, cenário de referência)."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#3f6a42", descricao: "645 municípios: potencial e distâncias ao gasoduto e ao ponto de entrega (mesmo GPKG da prancha 055)", descricao_en: "645 municipalities: potential and distances to pipelines and delivery points (same GPKG as plate 055)" }
  - { nome: gasodutos_transporte, tipo: linha, cor: "#6b3d5c", descricao: "13 gasodutos de transporte existentes, 1.892 km dentro de SP", descricao_en: "13 existing transmission pipelines, 1,892 km inside SP" }
  - { nome: gasodutos_distribuicao, tipo: linha, cor: "#c08a2e", descricao: "Redes de distribuição (Comgás, Gás Brasiliano, Naturgy e vizinhas)", descricao_en: "Distribution networks (Comgás, Gás Brasiliano, Naturgy and neighbours)" }
  - { nome: pontos_entrega, tipo: ponto, cor: "#6b3d5c", descricao: "62 pontos de entrega existentes, 39 em SP", descricao_en: "62 existing delivery points, 39 in SP" }

indicadores:
  - tipo: proporcao
    rotulo: "Biometano pela distância ao gasoduto mais próximo"
    rotulo_en: "Biomethane by distance to the nearest pipeline"
    unidade: "m³/dia"
    unidade_en: "m³/day"
    itens:
      - { rotulo: "até 10 km", rotulo_en: "up to 10 km", valor: 2986082, cor: "#2f5d3a" }
      - { rotulo: "10 a 25 km", rotulo_en: "10 to 25 km", valor: 2537493, cor: "#87a374" }
      - { rotulo: "25 a 50 km", rotulo_en: "25 to 50 km", valor: 2036038, cor: "#d9c27a" }
      - { rotulo: "mais de 50 km", rotulo_en: "over 50 km", valor: 9312498, cor: "#c08a2e" }
  - tipo: numero
    rotulo: "Distância de Guaíra, o maior potencial, ao gasoduto mais próximo"
    rotulo_en: "Distance from Guaíra, the largest potential, to the nearest pipeline"
    valor: 150
    unidade: "km"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biogas-territorio-sp-2026/sp_biogas_territorio.gpkg.zip
    rotulo: "Municípios e infraestrutura (mesmo arquivo das pranchas 055 a 059), SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities and infrastructure (same file as plates 055 to 059), SIRGAS 2000, with QGIS styles"
    tamanho: "4,9 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biogas-territorio-sp-2026/sp_biometano_gasodutos_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/biogas-territorio-sp-2026/sp_biometano_gasodutos_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,4 MB"
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

# Biometano e gasodutos em São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 057, a terceira de cinco da coleção **Biogás no território**: a que distância do
gasoduto está o biometano que os resíduos dariam.

## O que vem nos arquivos

O GPKG e o CSV são os da [prancha 055](../055-densidade-do-biometano-sp/README.md). Esta prancha
usa as camadas `gasodutos_transporte`, `gasodutos_distribuicao` e `pontos_entrega` e, na camada
`municipios`, os campos `km_gasoduto` (o menor entre `km_gasoduto_transporte` e
`km_gasoduto_distribuicao`) e `km_ponto_entrega`. Os estilos do QGIS são `potencial` e
`distancia_gasoduto`.

## Método

1. Infraestrutura: gasodutos de transporte e de distribuição e pontos de entrega existentes do
   WebMap da EPE, na versão da base de infraestrutura do MapBiomas; ficam os que estão em SP ou a
   até cerca de 60 km da divisa, porque a rede vizinha também serve.
2. Distância: em linha reta, do ponto interno de cada município (perto do centro do polígono) à
   linha mais próxima, em km.
3. Faixas: até 10 km, de 10 a 25, de 25 a 50 e mais de 50 km; em cada faixa, a soma do potencial
   (CP2B v5.1, nível N4, cenário de referência) e da população.
4. Comprimento em SP: soma dos trechos com as duas pontas dentro do estado.

## Limitações

- A rede de distribuição da base é a informada à EPE pelas distribuidoras em 2022; os ramais
  menores e as obras posteriores podem faltar.
- A distância é medida do centro do município, não de cada usina ou granja; um município grande
  pode ter parte do território bem mais perto do gasoduto.
- Gasoduto perto não quer dizer conexão possível: a injeção depende de pressão, qualidade do gás
  e contrato. O biometano também pode andar comprimido ou liquefeito, de caminhão.
