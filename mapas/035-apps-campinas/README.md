---
numero: 35
titulo: "APPs de Campinas"
subtitulo: "Onde a água nasce, a mata falta"
data: 2026-10-20
categoria: hidrografia
colecao: rmc
tags: [rmc, campinas, app, area-de-preservacao-permanente, codigo-florestal, nascentes, mata-ciliar, fbds, hidrografia]

contexto: >-
  O Código Florestal manda proteger uma faixa de mata ao longo de cada rio, em volta de cada nascente e na margem das represas: são as áreas de preservação permanente, as APPs. Em Campinas, elas somam 108 km², 13,6% do município, desenhadas sobre 1.682 km de córregos e 1.671 nascentes. Só 26,4% dessa faixa tem formação florestal. O resto é pasto, roça e solo exposto (57,9%) ou cidade (14,3%). Das nascentes, 325 estão em mata e 1.261 em área antropizada; 49 ficaram sob ruas e telhados da mancha urbana. No mapa, o verde se adensa no leste, nos morros de Sousas e Joaquim Egídio, e some no centro, onde os córregos correm entre casas. Quarta prancha da coleção «Região Metropolitana de Campinas».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do município de Campinas, em projeção transversa de Mercator, com a rede de córregos desenhada como faixas finas coloridas pelo uso do solo dentro da área de preservação permanente: verde-escuro para formação florestal, amarelo-palha para área antropizada, cinza-escuro para área edificada. Pequenos pontos azuis marcam 1.671 nascentes, e lagos e represas aparecem em azul-claro. O verde domina a rede densa do leste; o cinza ocupa os córregos do centro e do oeste urbanos; o amarelo se espalha pelo sul e pelo norte rurais. Uma chamada aponta uma nascente no centro: 49 nascentes sob a cidade. No painel, uma fita divide a área de APP pelas classes de uso, e barras mostram em que classe caem as nascentes."

recorte: "Município de Campinas (SP)"
fontes:
  - nome: "FBDS — Fundação Brasileira para o Desenvolvimento Sustentável: mapeamento de uso do solo, hidrografia e APPs em alta resolução"
    nome_en: "FBDS — Brazilian Foundation for Sustainable Development: high-resolution mapping of land use, hydrography and riparian reserves"
    url: https://geo.fbds.org.br/
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "APPs, rede hidrográfica, nascentes e uso do solo dentro das APPs do mapeamento da FBDS para Campinas; área de cada classe de uso somada e nascentes atribuídas à classe em que caem."

camadas:
  - { nome: app_uso, tipo: poligono, cor: "#2f5d3a", descricao: "Uso do solo dentro das APPs, em cinco classes, com a área em hectares", descricao_en: "Land use inside the reserves, in five classes, with area in hectares" }
  - { nome: app, tipo: poligono, cor: "#234e70", descricao: "2.657 faixas de APP, com a origem (curso d’água, massa d’água, nascente) e a largura em metros", descricao_en: "2,657 reserve strips, with their origin (stream, water body, spring) and width in metres" }
  - { nome: rios, tipo: linha, cor: "#234e70", descricao: "5.351 trechos de curso d’água de margem simples, com a classe de largura e o comprimento", descricao_en: "5,351 single-line stream segments, with width class and length" }
  - { nome: rios_duplos, tipo: poligono, cor: "#234e70", descricao: "114 trechos de rio de margem dupla", descricao_en: "114 double-bank river reaches" }
  - { nome: massas_dagua, tipo: poligono, cor: "#5f8fae", descricao: "967 lagos e represas, 956 deles artificiais", descricao_en: "967 lakes and reservoirs, 956 of them artificial" }
  - { nome: nascentes, tipo: ponto, cor: "#234e70", descricao: "1.671 nascentes", descricao_en: "1,671 springs" }
  - { nome: limite_municipal, tipo: poligono, cor: "#1a1c1e", descricao: "Limite de Campinas", descricao_en: "Boundary of Campinas" }

indicadores:
  - tipo: proporcao
    rotulo: "Uso do solo dentro das APPs (km²)"
    rotulo_en: "Land use inside the reserves (km²)"
    unidade: "km²"
    itens:
      - { rotulo: "Área antropizada", valor: 62.63, cor: "#d9c27a" }
      - { rotulo: "Formação florestal", valor: 28.56, cor: "#2f5d3a" }
      - { rotulo: "Área edificada", valor: 15.41, cor: "#4a4e52" }
      - { rotulo: "Formação não florestal", valor: 1.00, cor: "#a9b287" }
      - { rotulo: "Silvicultura", valor: 0.51, cor: "#7d8a3c" }
  - tipo: barras
    rotulo: "Nascentes, pela classe de uso em que caem"
    rotulo_en: "Springs, by the land use class they fall in"
    unidade: "nascentes"
    unidade_en: "springs"
    itens:
      - { rotulo: "Área antropizada", valor: 1261, cor: "#d9c27a" }
      - { rotulo: "Formação florestal", valor: 325, cor: "#2f5d3a" }
      - { rotulo: "Área edificada", valor: 49, cor: "#4a4e52" }
      - { rotulo: "Silvicultura", valor: 27, cor: "#7d8a3c" }
  - tipo: numero
    rotulo: "APP coberta por formação florestal"
    rotulo_en: "Reserve area covered by forest"
    valor: 26.4
    unidade: "%"
    nota: "28,6 dos 108,1 km² de APP do município"
    nota_en: "28.6 of the municipality’s 108.1 km² of reserves"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/rmc-2026/campinas_apps_fbds.gpkg.zip
    rotulo: "Sete camadas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Seven layers, SIRGAS 2000, with QGIS styles"
    tamanho: "16,5 MB"
  - formato: csv
    arquivo: dados/campinas_apps_fbds.csv
    rotulo: "Área de cada classe de uso dentro das APPs"
    rotulo_en: "Area of each land use class inside the reserves"
    tamanho: "0,2 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/rmc-2026/campinas_apps_fbds_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/rmc-2026/campinas_apps_fbds_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "4,7 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,5 MB"

doi_automatico: true
versao: "1.0.0"
discussoes: []
---

# As áreas de preservação permanente de Campinas e o uso do solo dentro delas

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 035, a última de quatro da coleção **Região Metropolitana de Campinas**: uma aproximação
ao município-sede, para ver as margens dos rios que as pranchas da região não alcançam.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `app_uso` | polígono | 23.490 polígonos de uso do solo dentro das APPs: `classe_uso`, `area_ha` |
| `app` | polígono | 2.657 faixas de APP: `origem` (curso d’água por classe de largura, massa d’água ou nascente), `largura_m`, `area_ha` |
| `rios` | linha | 5.351 trechos de margem simples: `classe` (largura do curso), `comp_km` |
| `rios_duplos` | polígono | 114 trechos de rio de margem dupla: `classe`, `area_ha` |
| `massas_dagua` | polígono | 967 lagos e represas: `classe`, `natureza` (natural ou artificial), `area_ha` |
| `nascentes` | ponto | 1.671 nascentes |
| `limite_municipal` | polígono | limite de Campinas (IBGE) |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `rmc-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/rmc-2026).
Cada camada traz o seu **estilo do QGIS**: `app_uso` com as cinco classes nas cores da prancha, as
águas em azul e as faixas de APP só no contorno.

O **CSV** traz a área de cada classe de uso dentro das APPs, em UTF-8.

## Método

1. Camadas do mapeamento da FBDS para o município de Campinas (código IBGE 3509502): APPs, uso do
   solo dentro das APPs, cursos d’água de margem simples e dupla, massas d’água e nascentes,
   reprojetadas de SIRGAS 2000 / UTM 23S para SIRGAS 2000 geográfico.
2. As faixas seguem as larguras do Código Florestal (Lei 12.651/2012) adotadas pela FBDS: 30 m de
   cada lado nos cursos de até 10 m de largura, 50 m nos de 10 a 50 m, 100 m nos de 50 a 200 m,
   15 ou 30 m em volta das massas d’água e um raio de 50 m em volta das nascentes.
3. Área de cada classe de uso dentro das APPs, em km², na projeção equivalente de Albers.
4. Cada nascente é atribuída à classe de uso do polígono em que cai; 7 nascentes não caem em
   nenhum polígono de uso.
5. Comprimento dos cursos d’água medido sobre o elipsoide.
6. Na prancha, a faixa de 30 m mede pouco mais de 2 px: cada classe ganhou um contorno da própria
   cor para que se leia. A largura desenhada é exagerada; as áreas do painel e dos arquivos são as
   reais.

## Limitações

- O mapeamento da FBDS é um retrato de uma data só, feito sobre imagens de satélite de alta
  resolução de cerca de uma década atrás; a cidade cresceu e algumas matas se recompuseram desde
  então.
- **Área antropizada** junta pasto, lavoura, solo exposto e outros usos não construídos: a FBDS
  não os separa.
- A APP é a faixa que a lei manda proteger, não um cadastro do que está legalmente ocupado: casas e
  ruas anteriores às regras, áreas urbanas consolidadas e regularizações seguem regras próprias.
- Os 1.682 km são só os córregos de margem simples; os 114 trechos de rio de margem dupla
  entram como polígonos.
