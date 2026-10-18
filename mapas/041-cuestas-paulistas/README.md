---
numero: 41
titulo: "Cuestas paulistas"
subtitulo: "O degrau do basalto"
data: 2026-11-01
categoria: altimetria-relevo
colecao: relevo
tags: [relevo, sao-paulo, cuestas, botucatu, itirapina, sao-pedro, depressao-periferica, altitude, hipsometria, copernicus-dem]

contexto: >-
  No meio do estado, o planalto do oeste paulista termina num degrau: as cuestas, escarpas onde as camadas de basalto e arenito se interrompem de uma vez, voltadas para a Depressão Periférica. O perfil A–B sai da depressão perto de São Pedro, a 500 m, sobe a um primeiro patamar de 956 m, mergulha num vale a 537 m e escala a cuesta de Itirapina: 543 m de desnível em 5 km, até 1.081 m. Do outro lado, o terreno desce para o vale do Corumbataí, em torno de 640 m. O ponto mais alto do quadro, 1.084 m, fica ali, em Itirapina; entre ele e o ponto mais baixo são 671 m. No sudoeste, a cuesta de Botucatu desenha o mesmo degrau. No quadro de 15.399 km², só 12,3% do terreno passa de 800 m. Terceira prancha da coleção «Relevo paulista».

imagem: ./mapa_preview.png
imagem_alt: "Mapa de relevo sombreado do centro de São Paulo, entre Jaú, São Carlos, Piracicaba e Botucatu, em cores hipsométricas ocre e creme, com o relevo exagerado quatro vezes. No norte e no sudoeste, os planaltos mais altos e lisos, em ocre mais escuro, terminam em bordas recortadas, de sombras fortes, voltadas para o leste: as cuestas de Itirapina e de Botucatu. No centro e no sudeste, a depressão mais baixa e enrugada, cortada pelos rios Tietê e Piracicaba. Uma linha tracejada liga A, perto de São Pedro, a B, perto de Corumbataí, passando pelo ponto mais alto, em Itirapina, marcado por um triângulo e por uma chamada: 1.084 m, com 543 m de desnível em 5 km. No painel, a régua de altitudes e o perfil A–B, com dois picos e a subida da cuesta destacada."

recorte: "Centro do estado de São Paulo, entre Jaú, São Carlos, Piracicaba e Botucatu (SP)"
fontes:
  - nome: "Copernicus DEM GLO-90 (ESA, União Europeia), modelo digital de superfície, pixel de 90 m"
    nome_en: "Copernicus DEM GLO-90 (ESA, European Union), digital surface model, 90 m pixels"
    url: https://dataspace.copernicus.eu/explore-data/data-collections/copernicus-contributing-missions/collections-description/COP-DEM
  - nome: "WWF / HydroSHEDS — HydroRIVERS v1.0, América do Sul (Lehner e Grill, 2013)"
    nome_en: "WWF / HydroSHEDS — HydroRIVERS v1.0, South America (Lehner and Grill, 2013)"
    url: https://www.hydrosheds.org/products/hydrorivers
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "rasterio", "GeoPandas", "SciPy", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Folhas do Copernicus DEM GLO-90 em mosaico, sombreadas de noroeste com relevo exagerado 4 vezes e coloridas por faixas de altitude; perfil A–B amostrado em 600 pontos, traçado pelo trecho de maior desnível local do quadro."

camadas:
  - { nome: relevo, tipo: raster, descricao: "GeoTIFF da altitude em metros (pixel de 90 m) recortado no quadro, com a rampa hipsométrica da prancha num estilo .qml", descricao_en: "GeoTIFF of elevation in metres (90 m pixels) clipped to the frame, with the plate’s hypsometric ramp in a .qml style" }
  - { nome: faixas_altitude, tipo: poligono, cor: "#e3d2a2", descricao: "7 faixas de altitude, de 100 em 100 m, com a área de cada uma", descricao_en: "7 elevation bands, every 100 m, with the area of each" }
  - { nome: perfil, tipo: linha, cor: "#1a1c1e", descricao: "A linha do perfil A–B, 57,2 km", descricao_en: "The A–B profile line, 57.2 km" }
  - { nome: ponto_mais_alto, tipo: ponto, cor: "#1a1c1e", descricao: "Ponto mais alto do quadro, 1.084 m, em Itirapina", descricao_en: "Highest point in the frame, 1,084 m, in Itirapina" }
  - { nome: municipios, tipo: poligono, cor: "#4a4e52", descricao: "Os 58 municípios do quadro", descricao_en: "The 58 municipalities in the frame" }

indicadores:
  - tipo: numero
    rotulo: "Maior desnível em 5 km no perfil A–B"
    rotulo_en: "Largest climb in 5 km along profile A–B"
    valor: 543
    unidade: "m"
    nota: "Na cuesta de Itirapina"
    nota_en: "On the Itirapina cuesta"
  - tipo: numero
    rotulo: "Diferença entre o ponto mais alto e o mais baixo do quadro"
    rotulo_en: "Difference between the highest and lowest points in the frame"
    valor: 671
    unidade: "m"
  - tipo: barras
    rotulo: "Área do quadro por faixa de altitude"
    rotulo_en: "Area of the frame by elevation band"
    unidade: "km²"
    itens:
      - { rotulo: "400–500 m", valor: 2627.5, cor: "#e4e2ba" }
      - { rotulo: "500–600", valor: 6014.6, cor: "#e5dfb4" }
      - { rotulo: "600–700", valor: 2643.1, cor: "#e4d8ab" }
      - { rotulo: "700–800", valor: 2223.7, cor: "#e3d2a2" }
      - { rotulo: "800–900", valor: 1539.8, cor: "#dfca9a" }
      - { rotulo: "900–1.000", valor: 327.3, cor: "#dac091" }
      - { rotulo: "1.000–1.100", valor: 22.1, cor: "#d4b688" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/relevo-2026/cuestas_relevo.gpkg.zip
    rotulo: "Faixas de altitude, perfil, ponto mais alto e municípios, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Elevation bands, profile, highest point and municipalities, SIRGAS 2000, with QGIS styles"
    tamanho: "1,1 MB"
  - formato: tif
    url: https://github.com/aikiesan/essencial-geo/releases/download/relevo-2026/cuestas_relevo.tif.zip
    rotulo: "Altitude no quadro (GeoTIFF, 90 m) com estilo .qml"
    rotulo_en: "Elevation in the frame (GeoTIFF, 90 m) with a .qml style"
    tamanho: "1,7 MB"
  - formato: csv
    arquivo: dados/cuestas_relevo_perfil.csv
    rotulo: "Perfil A–B: 600 pontos com distância, coordenadas e altitude"
    rotulo_en: "Profile A–B: 600 points with distance, coordinates and elevation"
    tamanho: "19 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/relevo-2026/cuestas_relevo_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/relevo-2026/cuestas_relevo_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "3,8 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "2,3 MB"

versao: "1.0.0"
discussoes: []
---

# As cuestas do centro paulista

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 041, a última de três da coleção **Relevo paulista**: depois das duas serras do leste,
o degrau mais discreto do interior, onde o planalto ocidental encontra a Depressão Periférica.

## O que vem nos arquivos

| Arquivo / camada | Geometria | Conteúdo |
| --- | --- | --- |
| `cuestas_relevo.tif` | raster | altitude em metros, inteiros, pixel de 90 m (3 segundos de arco), recortada no quadro |
| `faixas_altitude` | polígono | 7 faixas de 100 em 100 m: `classe`, `min_m`, `max_m`, `rotulo`, `area_km2` |
| `perfil` | linha | a linha A–B: `de`, `para`, `comp_km` |
| `ponto_mais_alto` | ponto | `altitude_m`, `nome` |
| `municipios` | polígono | municípios recortados no quadro: `CD_MUN`, `NM_MUN` |

O **GPKG** e o **GeoTIFF** vão compactados (ZIP) nos anexos da
[release `relevo-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/relevo-2026).
O GPKG traz os **estilos do QGIS** da prancha; o GeoTIFF vem com um `.qml` de mesmo nome, que o
QGIS aplica sozinho ao abrir o arquivo. O **CSV** do perfil fica nesta pasta, em UTF-8, com
`km`, `lon`, `lat` e `altitude_m`.

## Método

1. Folhas de 1° × 1° do Copernicus DEM GLO-90 juntadas em mosaico na janela do quadro.
2. O quadro tem 125 km de altura, centrado em 48,15° O e 22,62° S, na Transversa de Mercator.
3. **Sombreamento**: luz de noroeste, com o relevo exagerado 4 vezes, mais que nas outras
   pranchas da coleção, porque os desníveis aqui são menores; as cores hipsométricas usam a mesma
   régua das três pranchas.
4. **Perfil A–B**: o traçado passa pelo trecho de maior desnível local do quadro, procurado numa
   janela de 3 km sobre toda a grade, com a direção escolhida entre várias para cruzar a
   escarpa. São 600 pontos interpolados entre A (48,08° O, 22,596° S) e B (47,62° O, 22,306° S),
   com a distância medida sobre o elipsoide. O desnível em 5 km é a maior diferença entre o
   ponto mais alto e o mais baixo numa janela de 5 km que corre ao longo do perfil.
5. **Faixas de altitude**: a grade reduzida a 180 m (média de 2 × 2 pixels), dividida de 100 em
   100 m e convertida em polígonos simplificados.
6. Rios do HydroRIVERS, só os de vazão média a partir de 3 m³/s, como referência.

## Limitações

- O GLO-90 é um modelo de **superfície**: mede o topo da mata, dos eucaliptais e dos prédios,
  não o chão. Em talhões de silvicultura, a altitude pode ficar mais de dez metros acima do
  terreno.
- O pixel de 90 m alisa as bordas das escarpas, que são estreitas: o desnível real em 5 km pode
  ser maior.
- O exagero de 4 vezes faz as cuestas parecerem mais altas do que são; a comparação entre as três
  pranchas deve ser feita pela régua de cores e pelos perfis, não pelas sombras.
- O ponto mais baixo do quadro cai nos rios e nas represas, onde o modelo mede a lâmina d’água.

## Licença dos dados

Copernicus DEM: © DLR e.V. 2010–2014 e © Airbus Defence and Space GmbH 2014–2018, fornecido
no âmbito do programa COPERNICUS pela União Europeia e pela ESA. A prancha e as camadas
derivadas seguem a licença CC BY 4.0 do atlas, com essa atribuição.
