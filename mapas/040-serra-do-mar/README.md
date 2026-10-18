---
numero: 40
titulo: "Serra do Mar"
subtitulo: "Oitocentos metros entre o porto e o planalto"
data: 2026-11-18
categoria: altimetria-relevo
colecao: relevo
tags: [relevo, sao-paulo, serra-do-mar, baixada-santista, cubatao, planalto-paulistano, altitude, hipsometria, copernicus-dem]

contexto: >-
  O perfil A–B sai da praia de Santos e anda 15 km pela baixada, entre o mangue e o porto; tirando um morro de 109 m logo no começo, fica a poucos metros do nível do mar. Então a Serra do Mar se ergue sobre Cubatão: são 769 m de desnível em 5 km, e no alto começa o planalto, que segue ondulado, em torno de 760 m, até São Bernardo do Campo e São Paulo. Toda a encosta, de 20 a 700 m, ocupa só 596 km² nas faixas de altitude do quadro, 14% da terra; 72,5% do terreno fica acima de 700 m. Por essa parede passam a Anchieta, a Imigrantes e a ferrovia, e descem as águas da Billings bombeadas para Cubatão. O ponto mais alto do quadro, 1.185 m, fica em Mogi das Cruzes. Segunda prancha da coleção «Relevo paulista».

imagem: ./mapa_preview.png
imagem_alt: "Mapa de relevo sombreado da Baixada Santista e do planalto paulistano, entre Praia Grande, Santos, Bertioga e São Paulo, em cores hipsométricas: a baixada e as ilhas em verde-claro, o mar em azul acinzentado e o planalto em ocre. A escarpa da Serra do Mar corta o mapa na diagonal, de sudoeste a nordeste, como uma faixa estreita e enrugada de sombras fortes. Uma linha tracejada liga A, na praia de Santos, a B, no planalto de São Bernardo do Campo, e uma chamada marca a escarpa sobre Cubatão, com 769 m de desnível em 5 km. Um triângulo indica o ponto mais alto, em Mogi das Cruzes. No painel, a régua de altitudes e o perfil A–B: 15 km quase no nível do mar, uma subida quase vertical e o planalto em torno de 760 m."

recorte: "Baixada Santista, Serra do Mar e planalto paulistano, entre Mongaguá, Bertioga e São Paulo (SP)"
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
metodo: "Folhas do Copernicus DEM GLO-90 em mosaico, sombreadas de noroeste com relevo exagerado 1,8 vez e coloridas por faixas de altitude; perfil A–B amostrado em 600 pontos."

camadas:
  - { nome: relevo, tipo: raster, descricao: "GeoTIFF da altitude em metros (pixel de 90 m) recortado no quadro, com a rampa hipsométrica da prancha num estilo .qml", descricao_en: "GeoTIFF of elevation in metres (90 m pixels) clipped to the frame, with the plate’s hypsometric ramp in a .qml style" }
  - { nome: faixas_altitude, tipo: poligono, cor: "#e3d2a2", descricao: "10 faixas de altitude, mais finas perto do mar, com a área de cada uma", descricao_en: "10 elevation bands, finer near the sea, with the area of each" }
  - { nome: perfil, tipo: linha, cor: "#1a1c1e", descricao: "A linha do perfil A–B, 35,7 km", descricao_en: "The A–B profile line, 35.7 km" }
  - { nome: ponto_mais_alto, tipo: ponto, cor: "#1a1c1e", descricao: "Ponto mais alto do quadro, 1.185 m, em Mogi das Cruzes", descricao_en: "Highest point in the frame, 1,185 m, in Mogi das Cruzes" }
  - { nome: municipios, tipo: poligono, cor: "#4a4e52", descricao: "Os 25 municípios paulistas do quadro", descricao_en: "The 25 São Paulo municipalities in the frame" }

indicadores:
  - tipo: numero
    rotulo: "Maior desnível em 5 km no perfil A–B"
    rotulo_en: "Largest climb in 5 km along profile A–B"
    valor: 769
    unidade: "m"
    nota: "Na escarpa sobre Cubatão, já em São Bernardo do Campo"
    nota_en: "On the scarp above Cubatão, inside São Bernardo do Campo"
  - tipo: numero
    rotulo: "Terra do quadro acima de 700 m"
    rotulo_en: "Land in the frame above 700 m"
    valor: 72.5
    unidade: "%"
  - tipo: barras
    rotulo: "Área de terra do quadro por faixa de altitude"
    rotulo_en: "Land area of the frame by elevation band"
    unidade: "km²"
    itens:
      - { rotulo: "0–20 m", valor: 598.1, cor: "#d0dcc5" }
      - { rotulo: "20–100", valor: 154.4, cor: "#d3dec5" }
      - { rotulo: "100–200", valor: 132.7, cor: "#d8e1c4" }
      - { rotulo: "200–400", valor: 151.8, cor: "#dfe3c0" }
      - { rotulo: "400–600", valor: 107.4, cor: "#e6e2b8" }
      - { rotulo: "600–700", valor: 50.0, cor: "#e4d8ab" }
      - { rotulo: "700–800", valor: 2309.5, cor: "#e3d2a2" }
      - { rotulo: "800–900", valor: 661.6, cor: "#dfca9a" }
      - { rotulo: "900–1.000", valor: 86.6, cor: "#dac091" }
      - { rotulo: "1.000–1.200", valor: 31.7, cor: "#d1b184" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/relevo-2026/serra_do_mar_relevo.gpkg.zip
    rotulo: "Faixas de altitude, perfil, ponto mais alto e municípios, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Elevation bands, profile, highest point and municipalities, SIRGAS 2000, with QGIS styles"
    tamanho: "0,9 MB"
  - formato: tif
    url: https://github.com/aikiesan/essencial-geo/releases/download/relevo-2026/serra_do_mar_relevo.tif.zip
    rotulo: "Altitude no quadro (GeoTIFF, 90 m) com estilo .qml"
    rotulo_en: "Elevation in the frame (GeoTIFF, 90 m) with a .qml style"
    tamanho: "0,6 MB"
  - formato: csv
    arquivo: dados/serra_do_mar_relevo_perfil.csv
    rotulo: "Perfil A–B: 600 pontos com distância, coordenadas e altitude"
    rotulo_en: "Profile A–B: 600 points with distance, coordinates and elevation"
    tamanho: "18 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/relevo-2026/serra_do_mar_relevo_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/relevo-2026/serra_do_mar_relevo_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,7 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "1,5 MB"

versao: "1.0.0"
discussoes: []
---

# A Serra do Mar entre Santos e o planalto

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 040, a segunda de três da coleção **Relevo paulista**: depois da Mantiqueira, a outra
muralha do estado, a que separa o litoral do planalto.

## O que vem nos arquivos

| Arquivo / camada | Geometria | Conteúdo |
| --- | --- | --- |
| `serra_do_mar_relevo.tif` | raster | altitude em metros, inteiros, pixel de 90 m (3 segundos de arco), recortada no quadro; o mar vale 0 |
| `faixas_altitude` | polígono | 10 faixas, com limites em 20, 100, 200, 400, 600, 700, 800, 900, 1.000 e 1.200 m: `classe`, `min_m`, `max_m`, `rotulo`, `area_km2` |
| `perfil` | linha | a linha A–B: `de`, `para`, `comp_km` |
| `ponto_mais_alto` | ponto | `altitude_m`, `nome` |
| `municipios` | polígono | municípios paulistas recortados no quadro: `CD_MUN`, `NM_MUN` |

O **GPKG** e o **GeoTIFF** vão compactados (ZIP) nos anexos da
[release `relevo-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/relevo-2026).
O GPKG traz os **estilos do QGIS** da prancha; o GeoTIFF vem com um `.qml` de mesmo nome, que o
QGIS aplica sozinho ao abrir o arquivo. O **CSV** do perfil fica nesta pasta, em UTF-8, com
`km`, `lon`, `lat` e `altitude_m`.

## Método

1. Folhas de 1° × 1° do Copernicus DEM GLO-90 juntadas em mosaico na janela do quadro. As
   altitudes negativas e o mar (zero no modelo) ficam em 0.
2. O quadro tem 80 km de altura, centrado em 46,35° O e 23,85° S, na Transversa de Mercator.
3. **Sombreamento**: luz de noroeste, com o relevo exagerado 1,8 vez, combinado às cores
   hipsométricas da régua do painel. As faixas são mais finas embaixo, para que a baixada não
   fique toda da mesma cor.
4. **Perfil A–B**: 600 pontos interpolados entre A (46,33° O, 23,985° S), na praia de Santos, e
   B (46,53° O, 23,72° S), no planalto, com a distância medida sobre o elipsoide. O desnível em
   5 km é a maior diferença entre o ponto mais alto e o mais baixo numa janela de 5 km que corre
   ao longo do perfil.
5. **Faixas de altitude**: a grade reduzida a 180 m (média de 2 × 2 pixels), dividida nos
   limites da tabela e convertida em polígonos simplificados; o mar fica de fora. A parte acima
   de 700 m citada no texto é contada pixel a pixel, na terra do quadro.
6. Rios do HydroRIVERS, só os de vazão média a partir de 3 m³/s, como referência.

## Limitações

- O GLO-90 é um modelo de **superfície**: mede o topo da mata e dos prédios, não o chão. Na
  Mata Atlântica da encosta e entre os prédios de Santos, a altitude pode ficar alguns metros
  acima do terreno.
- O pixel de 90 m alisa a escarpa: as encostas mais íngremes aparecem menos abruptas do que são,
  e o desnível real em 5 km pode ser maior.
- Represas como a Billings aparecem com a altitude da lâmina d’água, sem o fundo.
- O exagero vertical do sombreamento é escolha de desenho: ajuda a ler as formas, mas faz o
  relevo parecer mais áspero do que é.

## Licença dos dados

Copernicus DEM: © DLR e.V. 2010–2014 e © Airbus Defence and Space GmbH 2014–2018, fornecido
no âmbito do programa COPERNICUS pela União Europeia e pela ESA. A prancha e as camadas
derivadas seguem a licença CC BY 4.0 do atlas, com essa atribuição.
