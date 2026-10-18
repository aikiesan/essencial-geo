---
numero: 42
titulo: "Linhas de transmissão"
subtitulo: "Os fios que costuram o país"
data: 2026-11-02
categoria: energia
colecao: energia-eletrica
tags: [energia-eletrica, brasil, transmissao, linhas-de-transmissao, subestacoes, corrente-continua, epe, mapbiomas]

contexto: >-
  Do Xingu ao Rio de Janeiro, uma linha de 800 kV em corrente contínua atravessa 2.552 km para levar ao Sudeste a energia de Belo Monte: é a mais longa das 1.712 linhas de transmissão existentes no mapeamento da EPE. Somados os circuitos, são 170,2 mil km de linhas e 780 subestações. As de 500 a 765 kV formam a maior parte da extensão, 68,0 mil km; as onze de corrente contínua, 19,5 mil km, trazem ao Sudeste a energia de Itaipu, das usinas do Madeira e de Belo Monte. No mapa, a rede se adensa no Sudeste, no Sul e no litoral do Nordeste e chega à Amazônia por poucos fios. Primeira prancha da coleção «Energia elétrica no Brasil».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers, com os países vizinhos em cinza e o oceano em azul-claro. As linhas de transmissão aparecem coloridas pela tensão: ocre para até 230 kV, argila para 345 e 440 kV, ameixa para 500 a 765 kV e azul-profundo, mais grossas, para as linhas de corrente contínua. Pontos escuros marcam as 780 subestações. A rede é densa no Sudeste, no Sul e no litoral do Nordeste e rala na Amazônia, cortada por linhas longas que descem do Pará e de Rondônia ao Sudeste. Uma chamada com seta destaca a linha mais longa, de 2.552 km e 800 kV. No painel, barras comparam a extensão de cada faixa de tensão e uma lista traz as quatro linhas mais longas."

recorte: "Brasil"
fontes:
  - nome: "EPE — WebMap: linhas de transmissão e subestações existentes, na versão da base de infraestrutura do MapBiomas"
    nome_en: "EPE — WebMap: existing transmission lines and substations, as published in the MapBiomas infrastructure database"
    url: https://gisepeprd2.epe.gov.br/WebMapEPE/
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025 (limites estaduais e nacional)"
    nome_en: "IBGE — Municipal Mesh 2025 (state and national boundaries)"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
  - nome: "Natural Earth — países vizinhos (via world-atlas)"
    nome_en: "Natural Earth — neighbouring countries (via world-atlas)"
    url: https://www.naturalearthdata.com/
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Linhas de transmissão e subestações existentes da EPE, agrupadas em quatro faixas de tensão; extensão declarada pela EPE e conferida pela medida geodésica."

camadas:
  - { nome: linhas_transmissao, tipo: linha, cor: "#6b3d5c", descricao: "1.712 linhas: tensão, extensão, ano de operação, concessionária e faixa", descricao_en: "1,712 lines: voltage, length, year in service, concession holder and voltage class" }
  - { nome: subestacoes, tipo: ponto, cor: "#1a1c1e", descricao: "780 subestações: tensões, ano de operação, concessionária e UF", descricao_en: "780 substations: voltages, year in service, concession holder and state" }
  - { nome: ufs, tipo: poligono, cor: "#9aa3ab", descricao: "27 unidades da federação", descricao_en: "27 states" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: barras
    rotulo: "Extensão por faixa de tensão (mil km, somados os circuitos)"
    rotulo_en: "Length by voltage class (thousand km, adding up circuits)"
    unidade: "mil km"
    itens:
      - { rotulo: "até 230 kV", valor: 65.7, cor: "#c08a2e" }
      - { rotulo: "345 e 440 kV", valor: 17.0, cor: "#9c4a32" }
      - { rotulo: "500 a 765 kV", valor: 68.0, cor: "#6b3d5c" }
      - { rotulo: "600 e 800 kV, corrente contínua", valor: 19.5, cor: "#234e70" }
  - tipo: numero
    rotulo: "A linha mais longa: Xingu – Terminal Rio, 800 kV em corrente contínua"
    rotulo_en: "The longest line: Xingu – Terminal Rio, 800 kV direct current"
    valor: 2552
    unidade: "km"
    nota: "em operação desde 2019"
    nota_en: "in service since 2019"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/energia-eletrica-2026/br_transmissao.gpkg.zip
    rotulo: "Quatro camadas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Four layers, SIRGAS 2000, with QGIS styles"
    tamanho: "3,3 MB"
  - formato: csv
    arquivo: dados/br_transmissao.csv
    rotulo: "As 1.712 linhas, sem geometria"
    rotulo_en: "All 1,712 lines, without geometry"
    tamanho: "0,2 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/energia-eletrica-2026/br_transmissao_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/energia-eletrica-2026/br_transmissao_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "3,8 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

versao: "1.0.0"
discussoes: []
---

# Linhas de transmissão de energia elétrica no Brasil

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 042, a primeira de três da coleção **Energia elétrica no Brasil**: antes das usinas,
os fios que levam a energia de onde ela nasce até onde é usada.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `linhas_transmissao` | linha | 1.712 linhas: `nome`, `concessionaria`, `tensao_kv`, `extensao_km` (declarada pela EPE), `ano_operacao`, `faixa`, `corrente_continua` |
| `subestacoes` | ponto | 780 subestações: `nome`, `concessionaria`, `tensao_kv` (todas as tensões, como no original), `tensao_max_kv`, `ano_operacao`, `uf` |
| `ufs` | polígono | 27 unidades da federação, com a região |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `energia-eletrica-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/energia-eletrica-2026).
Os **estilos do QGIS** repetem a prancha: as linhas pintadas e engrossadas pela faixa de tensão, as
de corrente contínua em azul-profundo, e as subestações como pontos claros com borda escura.

O **CSV** traz a tabela das 1.712 linhas, em UTF-8, sem geometria.

## Método

1. Linhas de transmissão e subestações classificadas como existentes no WebMap da EPE, na cópia
   publicada pela base de infraestrutura do MapBiomas (situação de 2022).
2. As linhas são agrupadas em quatro faixas de tensão: até 230 kV; 345 e 440 kV; 500 a 765 kV; e
   600 e 800 kV, que no Brasil são as linhas de corrente contínua de Itaipu, do Madeira e de Belo
   Monte. A de 765 kV, também de Itaipu, é de corrente alternada e fica na terceira faixa.
3. A extensão é a declarada pela EPE para cada linha: 170,2 mil km no total. A medida geodésica
   dos traçados, no elipsoide GRS80, dá 169,2 mil km, perto da declarada.
4. Das linhas com ano de operação registrado, 52% da extensão entrou em operação na década de 2010.

## Limitações

- Cada circuito é uma linha: uma travessia com dois circuitos conta duas vezes na extensão. Os
  bipolos de corrente contínua do Madeira e de Xingu – Estreito aparecem como dois registros cada.
- 430 linhas, com 31,9 mil km, não têm ano de operação; por isso a conta por década vale só para as
  que têm.
- A base é uma fotografia de 2022: linhas inauguradas depois não estão no mapa.
- O mapeamento da EPE cobre a transmissão; as redes de distribuição ficam de fora.
