---
numero: 32
titulo: "Uso e cobertura da terra"
subtitulo: "Entre a cana e a cidade, ilhas de mata"
data: 2026-10-20
categoria: uso-do-solo
colecao: rmc
tags: [rmc, campinas, uso-do-solo, cobertura-da-terra, mapbiomas, urbanizacao, cana-de-acucar, mata-atlantica, fragmentos-florestais]

contexto: >-
  A mancha cinza da cidade já cobre 21,1% dos 3.791 km² da Região Metropolitana de Campinas, e 72,6% de Hortolândia. A oeste, a cana ocupa metade de Santa Bárbara d'Oeste (49,3%) e 39,7% de Cosmópolis. A leste, nos morros de Morungaba, Itatiba e Pedreira, a mata resiste em ilhas: 7.743 fragmentos de formação florestal, só 31 com mais de 1 km². O maior deles, em Itatiba, tem 8,6 km². A classe que mais aparece não é nenhuma dessas, e sim o mosaico de usos (29,3%): pastos, roças e chácaras que o satélite não separa a 30 m. Primeira prancha da coleção «Região Metropolitana de Campinas».

imagem: ./mapa_preview.png
imagem_alt: "Mapa dos 20 municípios da Região Metropolitana de Campinas, em projeção transversa de Mercator, coberto pela classificação do MapBiomas em 2024, pixel a pixel. O cinza-escuro da área urbanizada forma um eixo contínuo de Americana e Santa Bárbara d'Oeste a Campinas, Valinhos e Vinhedo, com outra mancha em Indaiatuba. O ocre da cana domina o oeste; o creme do mosaico de usos e o amarelo-palha das pastagens cobrem o leste, salpicado de verde-escuro de mata em Morungaba, Itatiba e Pedreira. Uma chamada aponta o maior fragmento florestal, de 8,6 km², em Itatiba. No painel, uma fita divide a área da região pelas dez classes e barras mostram a parte urbanizada de seis municípios."

recorte: "Região Metropolitana de Campinas (SP)"
fontes:
  - nome: "MapBiomas — Coleção 10 dos mapas anuais de cobertura e uso da terra do Brasil"
    nome_en: "MapBiomas — Collection 10 of the annual land cover and land use maps of Brazil"
    url: https://brasil.mapbiomas.org/
    ano: 2024
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "rasterio", "GeoPandas", "SciPy", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Classificação de 2024 da Coleção 10 do MapBiomas, pixel de 30 m, agrupada em dez classes; área de cada pixel no elipsoide, somada na região e em cada município."

camadas:
  - { nome: cobertura_2024, tipo: raster, descricao: "GeoTIFF da classificação de 2024 recortado na RMC, com os códigos originais do MapBiomas e a paleta da prancha num estilo .qml", descricao_en: "GeoTIFF of the 2024 classification clipped to the region, with the original MapBiomas codes and the plate’s palette in a .qml style" }
  - { nome: municipios, tipo: poligono, cor: "#4a4e52", descricao: "20 municípios: área e km² e % de cada uma das dez classes", descricao_en: "20 municipalities: area and km² and % of each of the ten classes" }
  - { nome: limite_rmc, tipo: poligono, cor: "#1a1c1e", descricao: "Contorno da região", descricao_en: "Outline of the region" }

indicadores:
  - tipo: proporcao
    rotulo: "A região pelas classes de uso e cobertura (km²)"
    rotulo_en: "The region by land use and cover class (km²)"
    unidade: "km²"
    itens:
      - { rotulo: "Mosaico de usos", valor: 1109.37, cor: "#ece3c2" }
      - { rotulo: "Área urbanizada", valor: 799.54, cor: "#4a4e52" }
      - { rotulo: "Pastagem", valor: 596.61, cor: "#d9c27a" }
      - { rotulo: "Cana", valor: 451.97, cor: "#c08a2e" }
      - { rotulo: "Soja e outras lavouras", valor: 345.61, cor: "#9c4a32" }
      - { rotulo: "Formação florestal", valor: 344.44, cor: "#2f5d3a" }
      - { rotulo: "Silvicultura", valor: 60.17, cor: "#7d8a3c" }
      - { rotulo: "Água", valor: 43.38, cor: "#234e70" }
      - { rotulo: "Campo e área úmida", valor: 29.78, cor: "#a9b287" }
      - { rotulo: "Mineração e outras áreas sem vegetação", valor: 9.80, cor: "#6b3d5c" }
  - tipo: barras
    rotulo: "Parte urbanizada do município (as cinco maiores)"
    rotulo_en: "Urban share of the municipality (top five)"
    unidade: "%"
    itens:
      - { rotulo: "Hortolândia", valor: 72.65, cor: "#4a4e52" }
      - { rotulo: "Americana", valor: 42.94, cor: "#4a4e52" }
      - { rotulo: "Vinhedo", valor: 36.85, cor: "#4a4e52" }
      - { rotulo: "Paulínia", valor: 35.62, cor: "#4a4e52" }
      - { rotulo: "Sumaré", valor: 34.63, cor: "#4a4e52" }
  - tipo: numero
    rotulo: "Maior fragmento de formação florestal"
    rotulo_en: "Largest forest fragment"
    valor: 8.57
    unidade: "km²"
    nota: "Em Itatiba; são 7.743 fragmentos, 31 com mais de 1 km²"
    nota_en: "In Itatiba; there are 7,743 fragments, 31 of them over 1 km²"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/rmc-2026/rmc_uso_cobertura_2024.gpkg.zip
    rotulo: "Municípios e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities and outline, SIRGAS 2000, with QGIS styles"
    tamanho: "0,6 MB"
  - formato: tif
    url: https://github.com/aikiesan/essencial-geo/releases/download/rmc-2026/rmc_uso_cobertura_2024.tif.zip
    rotulo: "Classificação de 2024 na RMC (GeoTIFF, 30 m) com estilo .qml"
    rotulo_en: "2024 classification for the region (GeoTIFF, 30 m) with a .qml style"
    tamanho: "0,6 MB"
  - formato: csv
    arquivo: dados/rmc_uso_cobertura_2024.csv
    rotulo: "Os 20 municípios: km² e % de cada classe"
    rotulo_en: "The 20 municipalities: km² and % of each class"
    tamanho: "3 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/rmc-2026/rmc_uso_cobertura_2024_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/rmc-2026/rmc_uso_cobertura_2024_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "3,0 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,6 MB"

doi_automatico: true
versao: "1.0.0"
discussoes: []
---

# Uso e cobertura da terra na Região Metropolitana de Campinas em 2024

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 032, a primeira de quatro da coleção **Região Metropolitana de Campinas**: o chão dos 20
municípios, visto do satélite. As próximas contam os domicílios, a renda e as margens dos rios.

## O que vem nos arquivos

| Arquivo / camada | Geometria | Conteúdo |
| --- | --- | --- |
| `rmc_uso_cobertura_2024.tif` | raster | classificação de 2024, pixel de 30 m, recortada na RMC, com os códigos da legenda do MapBiomas (0 = fora da região) |
| `municipios` (GPKG) | polígono | 20 municípios: `CD_MUN`, `NM_MUN`, `area_km2` e, para cada classe, `km2_<classe>` e `pct_<classe>` |
| `limite_rmc` (GPKG) | polígono | contorno da região |

O **GPKG** e o **GeoTIFF** vão compactados (ZIP) nos anexos da
[release `rmc-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/rmc-2026).
A camada `municipios` traz dois **estilos do QGIS**: `urbano` (o padrão, a parte urbanizada de cada
município) e `floresta`. O ZIP do GeoTIFF leva ao lado um estilo `.qml` com a paleta da prancha e o
nome de cada código; basta abrir o `.tif` no QGIS com o `.qml` na mesma pasta.

O **CSV** traz a tabela dos 20 municípios, em UTF-8, sem geometria.

## Método

1. Mapa de cobertura e uso da terra de 2024 da Coleção 10 do MapBiomas, lido só na janela da
   região, em SIRGAS 2000, pixel de 0,00027° (cerca de 30 m).
2. As classes da legenda do MapBiomas viram dez classes na prancha: formação florestal (inclui
   formação savânica), campo e área úmida, silvicultura, pastagem, mosaico de usos, cana, soja e
   outras lavouras (temporárias e perenes), área urbanizada, água e mineração com outras áreas sem
   vegetação.
3. Cada pixel entra com a sua área real no elipsoide GRS80, calculada linha a linha (o pixel em
   graus encolhe com a latitude). Os pixels são atribuídos aos municípios pelo seu centro.
4. Fragmentos florestais: pixels de formação florestal e savânica ligados entre si, inclusive pelos
   cantos (oito vizinhos), dentro da região.
5. A prancha desenha a grade amostrada na projeção do mapa; os limites municipais vão por cima, em
   vetor.

## Limitações

- O MapBiomas classifica imagens Landsat de 30 m: chácaras, quintais e matas ciliares estreitas
  se misturam, e boa parte disso cai no **mosaico de usos**, a maior classe da região.
- A **área urbanizada** do MapBiomas é a mancha construída vista do satélite, não o perímetro
  urbano da lei municipal.
- Um fragmento florestal pode continuar do outro lado do limite da RMC; aqui ele é medido só dentro
  da região.
- A soma das áreas dos pixels (3.790,7 km²) difere um pouco da área oficial dos municípios, por
  causa da borda em pixels.
