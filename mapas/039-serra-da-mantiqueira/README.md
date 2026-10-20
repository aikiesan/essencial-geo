---
numero: 39
titulo: "Serra da Mantiqueira"
subtitulo: "A muralha sobre o vale do Paraíba"
data: 2026-10-20
categoria: altimetria-relevo
colecao: relevo
tags: [relevo, sao-paulo, mantiqueira, vale-do-paraiba, pedra-da-mina, altitude, hipsometria, copernicus-dem]

contexto: >-
  O perfil A–B corre 61 km do sul do vale do Paraíba até a crista da Mantiqueira. Por quase 40 km o terreno mal muda, e o rio Paraíba do Sul passa no ponto mais baixo, a 501 m. Depois a serra se levanta de uma vez: no trecho mais íngreme, o chão sobe 1.332 m em 5 km, até 2.581 m na crista. No alto fica a Pedra da Mina, em Queluz, na divisa com Minas, o ponto mais alto de São Paulo: 2.785 m no modelo de 90 m. Do outro lado do vale, a Serra do Mar fecha o corredor por onde passam o rio, a Via Dutra e as cidades. No quadro de 10.866 km², a altitude média é de 1.007 m e 12,9% do terreno passa de 1.500 m. Primeira prancha da coleção «Relevo paulista».

imagem: ./mapa_preview.png
imagem_alt: "Mapa de relevo sombreado do vale do Paraíba e da Serra da Mantiqueira, entre Taubaté, Campos do Jordão e Queluz, em cores hipsométricas que vão do verde-claro das baixadas ao castanho das cristas e ao quase branco dos picos acima de 2.700 m. O vale aparece como uma faixa clara e plana que atravessa o mapa na diagonal, com o rio Paraíba do Sul; ao norte, a muralha escura da Mantiqueira, com a divisa de Minas Gerais correndo pela crista; ao sul, os morros da Serra do Mar. Uma linha tracejada de A, perto de Guaratinguetá, a B, além da Pedra da Mina, marca o perfil, e uma chamada aponta o ponto mais alto, 2.785 m, em Queluz. No painel, a régua de altitudes e o perfil A–B, quase plano por 40 km e depois subindo de uma vez até 2.581 m."

recorte: "Vale do Paraíba e Serra da Mantiqueira, entre Taubaté e Queluz (SP), com partes de Minas Gerais e do Rio de Janeiro"
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
metodo: "Folhas do Copernicus DEM GLO-90 em mosaico, sombreadas de noroeste com relevo exagerado 1,6 vez e coloridas por faixas de altitude; perfil A–B amostrado em 600 pontos."

camadas:
  - { nome: relevo, tipo: raster, descricao: "GeoTIFF da altitude em metros (pixel de 90 m) recortado no quadro, com a rampa hipsométrica da prancha num estilo .qml", descricao_en: "GeoTIFF of elevation in metres (90 m pixels) clipped to the frame, with the plate’s hypsometric ramp in a .qml style" }
  - { nome: faixas_altitude, tipo: poligono, cor: "#bb946c", descricao: "13 faixas de altitude, de 200 em 200 m, com a área de cada uma", descricao_en: "13 elevation bands, every 200 m, with the area of each" }
  - { nome: perfil, tipo: linha, cor: "#1a1c1e", descricao: "A linha do perfil A–B, 61,0 km", descricao_en: "The A–B profile line, 61.0 km" }
  - { nome: ponto_mais_alto, tipo: ponto, cor: "#1a1c1e", descricao: "Pedra da Mina, 2.785 m no modelo", descricao_en: "Pedra da Mina, 2,785 m in the model" }
  - { nome: municipios, tipo: poligono, cor: "#4a4e52", descricao: "Os 25 municípios paulistas do quadro", descricao_en: "The 25 São Paulo municipalities in the frame" }

indicadores:
  - tipo: numero
    rotulo: "Ponto mais alto de São Paulo, Pedra da Mina"
    rotulo_en: "Highest point in São Paulo, Pedra da Mina"
    valor: 2785
    unidade: "m"
    nota: "No modelo de 90 m, em Queluz, na divisa com Minas Gerais"
    nota_en: "In the 90 m model, in Queluz, on the Minas Gerais border"
  - tipo: numero
    rotulo: "Maior desnível em 5 km no perfil A–B"
    rotulo_en: "Largest climb in 5 km along profile A–B"
    valor: 1332
    unidade: "m"
  - tipo: barras
    rotulo: "Área do quadro por faixa de altitude"
    rotulo_en: "Area of the frame by elevation band"
    unidade: "km²"
    itens:
      - { rotulo: "< 500 m", valor: 82.6, cor: "#dde3c2" }
      - { rotulo: "500–700", valor: 2842.3, cor: "#e5dcaf" }
      - { rotulo: "700–900", valor: 1796.9, cor: "#e2cf9e" }
      - { rotulo: "900–1.100", valor: 2510.2, cor: "#d7bb8d" }
      - { rotulo: "1.100–1.300", valor: 1188.3, cor: "#caa77c" }
      - { rotulo: "1.300–1.500", valor: 1049.7, cor: "#bb946c" }
      - { rotulo: "1.500–1.700", valor: 775.0, cor: "#ae8767" }
      - { rotulo: "1.700–1.900", valor: 441.0, cor: "#a07a62" }
      - { rotulo: "1.900–2.100", valor: 112.8, cor: "#967464" }
      - { rotulo: "> 2.100 m", valor: 67.9, cor: "#8c6e66" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/relevo-2026/mantiqueira_relevo.gpkg.zip
    rotulo: "Faixas de altitude, perfil, ponto mais alto e municípios, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Elevation bands, profile, highest point and municipalities, SIRGAS 2000, with QGIS styles"
    tamanho: "1,0 MB"
  - formato: tif
    url: https://github.com/aikiesan/essencial-geo/releases/download/relevo-2026/mantiqueira_relevo.tif.zip
    rotulo: "Altitude no quadro (GeoTIFF, 90 m) com estilo .qml"
    rotulo_en: "Elevation in the frame (GeoTIFF, 90 m) with a .qml style"
    tamanho: "1,6 MB"
  - formato: csv
    arquivo: dados/mantiqueira_relevo_perfil.csv
    rotulo: "Perfil A–B: 600 pontos com distância, coordenadas e altitude"
    rotulo_en: "Profile A–B: 600 points with distance, coordinates and elevation"
    tamanho: "19 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/relevo-2026/mantiqueira_relevo_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/relevo-2026/mantiqueira_relevo_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "4,0 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "2,2 MB"

doi_automatico: true
versao: "1.0.0"
discussoes: []
---

# A Serra da Mantiqueira sobre o vale do Paraíba

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 039, a primeira de três da coleção **Relevo paulista**: três paisagens do estado
lidas pela altitude, cada uma com um perfil que atravessa o seu degrau principal.

## O que vem nos arquivos

| Arquivo / camada | Geometria | Conteúdo |
| --- | --- | --- |
| `mantiqueira_relevo.tif` | raster | altitude em metros, inteiros, pixel de 90 m (3 segundos de arco), recortada no quadro |
| `faixas_altitude` | polígono | 13 faixas de 200 em 200 m: `classe`, `min_m`, `max_m`, `rotulo`, `area_km2` |
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
2. O quadro tem 105 km de altura, centrado em 45,2° O e 22,68° S, na Transversa de Mercator.
3. **Sombreamento**: luz de noroeste, com o relevo exagerado 1,6 vez, combinado às cores
   hipsométricas da régua do painel.
4. **Perfil A–B**: 600 pontos interpolados entre A (45,10° O, 22,83° S) e B (44,79° O, 22,36° S),
   com a distância medida sobre o elipsoide. O desnível em 5 km é a maior diferença entre o ponto
   mais alto e o mais baixo numa janela de 5 km que corre ao longo do perfil.
5. **Faixas de altitude**: a grade reduzida a 180 m (média de 2 × 2 pixels), dividida nos
   limites de 200 em 200 m e convertida em polígonos simplificados.
6. Rios do HydroRIVERS, só os de vazão média a partir de 3 m³/s, como referência.

## Limitações

- O GLO-90 é um modelo de **superfície**: mede o topo da mata e dos prédios, não o chão. Nas
  áreas de floresta da serra, a altitude pode ficar alguns metros acima do terreno.
- O pixel de 90 m alisa picos e vales estreitos. A Pedra da Mina aparece com 2.785 m, abaixo dos
  2.798 m medidos em campo; o mesmo vale para o desnível do perfil.
- O exagero vertical do sombreamento é escolha de desenho: ajuda a ler as formas, mas faz o
  relevo parecer mais áspero do que é.
- A régua de cores é a mesma nas três pranchas da coleção, para que as altitudes se comparem
  entre elas.

## Licença dos dados

Copernicus DEM: © DLR e.V. 2010–2014 e © Airbus Defence and Space GmbH 2014–2018, fornecido
no âmbito do programa COPERNICUS pela União Europeia e pela ESA. A prancha e as camadas
derivadas seguem a licença CC BY 4.0 do atlas, com essa atribuição.
