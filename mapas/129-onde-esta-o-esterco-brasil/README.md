---
numero: 129
titulo: "Onde está o esterco"
subtitulo: "Boi, porco e galinha na mesma conta"
data: 2026-12-04
rascunho: false
categoria: energia
colecao: biomassa-br
tags: [biomassa-br, brasil, biomassa, pecuaria, esterco, biogas, unidade-animal, suinos, galinaceos, ppm, municipios]

contexto: >-
  Somados em unidades animais da FAO, que põem boi, porco e galinha na mesma conta, os rebanhos brasileiros chegam a 202 milhões de UA, 24 por quilômetro quadrado na média do país. Os bovinos são 83% delas e espalham o esterco pelo pasto, onde ele não se recolhe. O esterco que se recolhe está onde os animais vivem apertados: nos galpões de aves e nas granjas de porcos do oeste de Santa Catarina, do Paraná e da serra gaúcha, e na capital do ovo, Bastos (SP), com 13,65 milhões de galinhas e 883 UA por km². Cunhataí (SC) tem 111 mil porcos em 55 km². Santa Catarina e o Paraná são os estados mais adensados; o Amazonas, o menos. É o mapa de onde o biogás de dejetos tem matéria-prima à mão.

imagem: ./mapa_preview.png
imagem_alt: "Mapa coroplético do Brasil em projeção cônica de Albers, com os 5.571 municípios pintados por unidades animais por quilômetro quadrado em sete classes, do creme ao marrom quase preto. O Amazonas, Roraima, o Amapá e o oeste do Pará ficam claros; tons médios cobrem o Centro-Oeste e o Nordeste; os mais escuros se juntam no oeste de Santa Catarina e do Paraná, na serra gaúcha, no oeste paulista, em Rondônia e no Triângulo Mineiro. Duas chamadas: Bastos, em São Paulo, com 883 UA por km² e 13,65 milhões de galinhas, e Cunhataí, em Santa Catarina, com 703 UA por km² e 111.655 porcos. No painel, a legenda das classes com o número de municípios, a faixa das unidades animais por espécie, com os bovinos em 83%, e as quatro maiores espécies com o coeficiente da FAO."

recorte: "Brasil"
fontes:
  - nome: "IBGE — Pesquisa da Pecuária Municipal 2024, efetivo dos rebanhos (SIDRA, tabela 3939)"
    nome_en: "IBGE — Municipal Livestock Survey 2024, herd size (SIDRA, table 3939)"
    url: https://sidra.ibge.gov.br/tabela/3939
    ano: 2024
  - nome: "FAO — Guidelines for the preparation of livestock sector reviews (2011), coeficientes de unidade animal para a América do Sul"
    nome_en: "FAO — Guidelines for the preparation of livestock sector reviews (2011), livestock unit coefficients for South America"
    url: https://www.fao.org/4/i2294e/i2294e00.htm
    ano: 2011
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
metodo: "Cabeças de sete espécies da Pesquisa da Pecuária Municipal de 2024 multiplicadas pelos coeficientes de unidade animal da FAO para a América do Sul, somadas e divididas pela área de cada município em km²."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#a8642a", descricao: "5.571 municípios: área, cabeças e UA de cada espécie, UA total, UA por km², espécie líder e classe", descricao_en: "5,571 municipalities: area, head and LU of each species, total LU, LU per km², leading species and class" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 unidades da federação", descricao_en: "27 states" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Unidades animais no Brasil, 2024"
    rotulo_en: "Livestock units in Brazil, 2024"
    valor: 202.0
    unidade: "milhões de UA"
    nota: "24 UA por km² na média do país; 83% são bovinos"
    nota_en: "24 LU per km² on average; 83% are cattle"
  - tipo: barras
    rotulo: "Unidades animais por espécie"
    rotulo_en: "Livestock units by species"
    unidade: "milhões de UA"
    itens:
      - { rotulo: "bovinos", rotulo_en: "cattle", valor: 166.7, cor: "#a8642a" }
      - { rotulo: "galináceos", rotulo_en: "poultry", valor: 15.8, cor: "#d9c27a" }
      - { rotulo: "suínos", rotulo_en: "pigs", valor: 11.0, cor: "#c9707a" }
      - { rotulo: "equinos", rotulo_en: "horses", valor: 3.7, cor: "#7d8a3c" }
      - { rotulo: "ovinos", rotulo_en: "sheep", valor: 2.2, cor: "#9aa3ab" }
      - { rotulo: "caprinos", rotulo_en: "goats", valor: 1.3, cor: "#6f8ba3" }
      - { rotulo: "búfalos", rotulo_en: "buffalo", valor: 1.3, cor: "#7c4423" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-br-2026/br_unidades_animais.gpkg.zip
    rotulo: "Municípios, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "10,2 MB"
  - formato: csv
    arquivo: dados/br_unidades_animais.csv
    rotulo: "Os 5.571 municípios, sem geometria"
    rotulo_en: "All 5,571 municipalities, without geometry"
    tamanho: "0,9 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-br-2026/br_unidades_animais_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-br-2026/br_unidades_animais_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "6,2 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,4 MB"

doi_automatico: true
versao: "1.0.0"
discussoes: []
---

# Onde está o esterco: unidades animais por km² no Brasil

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 129, a quarta da coleção **Monitor da biomassa**. Boi, porco e galinha somados numa
mesma unidade, para ver onde os animais, e o esterco deles, se concentram.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 5.571 municípios: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `area_km2`, cabeças (`cab_*`) e UA (`ua_*`) de bovinos, búfalos, suínos, galináceos, equinos, ovinos e caprinos, `ua`, `ua_km2`, `especie_lider`, `classe`, `faixa_ua_km2` |
| `ufs` | polígono | 27 unidades da federação, com a região |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `biomassa-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/biomassa-br-2026).
A camada `municipios` traz o **estilo do QGIS** da prancha, com as sete classes. O **CSV** fica nesta
pasta, em UTF-8, com a mesma tabela sem geometria.

## Método

1. Efetivo dos rebanhos de 2024 por município da Pesquisa da Pecuária Municipal (SIDRA, tabela
   3939): bovinos, bubalinos, suínos (total), galináceos (total), equinos, ovinos e caprinos.
2. **Unidades animais (UA)** da FAO para a América do Sul: bovino e búfalo 0,70; equino 0,65;
   suíno 0,25; ovino e caprino 0,10; galináceo 0,01. A UA aproxima o peso vivo e, com ele, o
   esterco.
3. UA total dividida pela área do município (km², calculada na projeção de Albers). Sete classes,
   com limites em 2, 5, 10, 20, 40 e 80 UA por km².
4. Os 32 municípios sem dado na PPM (quase todos da Grande São Paulo e da Baixada Santista) ficam
   em cinza.

## Limitações

- A UA mede o tamanho do rebanho, não o esterco recolhível: o boi a pasto deixa o esterco no
  campo, e o porco e a galinha confinados o deixam no galpão.
- Os coeficientes da FAO são médias regionais; raças e sistemas de criação variam.
- A PPM é uma estimativa municipal feita com informantes locais, e conta o rebanho no município
  da propriedade.
- Galináceos somam frangos de corte e galinhas de postura num mesmo coeficiente.

## Licença dos dados

Dados abertos do IBGE, de uso livre com citação da fonte; coeficientes da FAO.
