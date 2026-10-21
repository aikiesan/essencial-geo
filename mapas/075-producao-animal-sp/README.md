---
numero: 75
titulo: "O valor da produção animal"
subtitulo: "O leite está em toda parte; o dinheiro, nos ovos"
data: 2026-10-20
categoria: uso-do-solo
colecao: animal-sp
tags: [animal-sp, sao-paulo, pecuaria, ovos, leite, mel, aquicultura, valor-da-producao, ibge, ppm]

contexto: >-
  Leite, ovos, mel, casulos do bicho-da-seda e peixe criado valeram R$ 12,0 bilhões em São Paulo em 2024, segundo a Pesquisa da Pecuária Municipal. Os ovos responderam por 61% desse valor (R$ 7,3 bilhões), o leite por 33% (R$ 3,9 bilhões), a aquicultura por 6% e o mel por menos de 1%. No mapa, porém, a cor que mais aparece é a do leite: ele é o produto de maior valor em 423 municípios, contra 139 dos ovos, 29 da aquicultura e 22 do mel. O dinheiro dos ovos se concentra em poucos polos. Só Bastos soma R$ 1,26 bilhão, 10% do estado, e vem seguido de Tupã, Mirassolândia e Itirapina; nas duas últimas, os ovos passam de 98% do valor. Os dez maiores municípios fazem 31% do total. A pesquisa não inclui a carne: o valor dos animais abatidos fica de fora. Quinta e última prancha da coleção «Leite, ovos, mel e peixe».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com um círculo em cada município, de área proporcional ao valor de leite, ovos, mel, casulos e aquicultura em 2024, e cor do produto de maior valor: laranja para ovos, azul-acinzentado para leite, azul-petróleo para aquicultura e ocre para mel. Os círculos azuis, pequenos e médios, cobrem quase todo o estado; os laranja são poucos e grandes, com o maior de todos em Bastos, no centro-oeste, cercado por Tupã, Queiroz e Iacri, e outros grandes em Mirassolândia, ao norte, Itirapina, no centro, e Porto Feliz e Tatuí, a sudeste. Círculos azul-petróleo aparecem na borda noroeste, junto às represas. Chamada: Bastos, R$ 1,26 bilhão, 10% do valor do estado. No painel, barras com o valor de cada produto no estado e o número de municípios em que cada um é o maior."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Pesquisa da Pecuária Municipal (PPM), tabela 74: produção de origem animal"
    nome_en: "IBGE — Municipal Livestock Survey (PPM), table 74: animal products"
    url: https://sidra.ibge.gov.br/tabela/74
    ano: 2024
  - nome: "IBGE — Pesquisa da Pecuária Municipal (PPM), tabela 3940: produção da aquicultura"
    nome_en: "IBGE — Municipal Livestock Survey (PPM), table 3940: aquaculture production"
    url: https://sidra.ibge.gov.br/tabela/3940
    ano: 2024
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Valor da produção de leite, ovos de galinha e de codorna, mel e casulos (tabela 74) e da aquicultura (tabela 3940) da PPM 2024, somado por município; círculos de área proporcional ao total, coloridos pelo produto de maior valor."

camadas:
  - { nome: valor, tipo: ponto, descricao: "613 municípios com valor informado: valor de cada produto e total (mil reais), produto dominante e sua parte", descricao_en: "613 municipalities with reported value: value of each product and total (thousand reais), dominant product and its share" }
  - { nome: municipios, tipo: poligono, descricao: "645 municípios, com os mesmos campos", descricao_en: "645 municipalities, with the same fields" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Valor da produção animal em 2024"
    rotulo_en: "Value of animal products in 2024"
    valor: 12028732
    unidade: "mil reais"
    unidade_en: "thousand reais"
    nota: "Leite, ovos, mel, casulos e aquicultura; sem carne"
    nota_en: "Milk, eggs, honey, cocoons and aquaculture; meat not included"
  - tipo: numero
    rotulo: "Municípios em que o leite é o produto de maior valor"
    rotulo_en: "Municipalities where milk is the most valuable product"
    valor: 423
    nota: "Ovos em 139, aquicultura em 29 e mel em 22; 32 sem valor informado"
    nota_en: "Eggs in 139, aquaculture in 29 and honey in 22; 32 with no reported value"
  - tipo: barras
    rotulo: "Valor por produto em 2024"
    rotulo_en: "Value by product in 2024"
    unidade: "mil reais"
    unidade_en: "thousand reais"
    itens:
      - { rotulo: "Ovos", rotulo_en: "Eggs", valor: 7284736, cor: "#eaa93a" }
      - { rotulo: "Leite", rotulo_en: "Milk", valor: 3941474, cor: "#4a6f93" }
      - { rotulo: "Aquicultura", rotulo_en: "Aquaculture", valor: 706286, cor: "#2b7a8f" }
      - { rotulo: "Mel", rotulo_en: "Honey", valor: 92598, cor: "#a8711a" }
      - { rotulo: "Casulos", rotulo_en: "Cocoons", valor: 3638, cor: "#8a6a9c" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/animal-sp-2026/sp_producao_animal_2024.gpkg.zip
    rotulo: "Quatro camadas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Four layers, SIRGAS 2000, with QGIS styles"
    tamanho: "18,5 MB"
  - formato: csv
    arquivo: dados/sp_producao_animal_2024.csv
    rotulo: "Valor de cada produto animal por município em 2024"
    rotulo_en: "Value of each animal product by municipality in 2024"
    tamanho: "52 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/animal-sp-2026/sp_producao_animal_2024_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/animal-sp-2026/sp_producao_animal_2024_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,3 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

doi_automatico: true
versao: "1.0.0"
doi: 10.5281/zenodo.23540722
discussoes: []
---

# O valor da produção animal em São Paulo, 2024

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 075, a última de cinco da coleção **Leite, ovos, mel e peixe**: as quatro pranchas
anteriores somadas em reais, município a município.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `valor` | ponto | 613 municípios com valor informado: `CD_MUN`, `NM_MUN`, região intermediária, `leite_mil_reais`, `ovos_mil_reais`, `mel_mil_reais`, `casulos_mil_reais`, `aquicultura_mil_reais`, `total_mil_reais`, `dominante` (o produto de maior valor) e `parte_dominante` (% do total); um ponto dentro de cada município |
| `municipios` | polígono | 645 municípios, com os mesmos campos |
| `regioes_intermediarias` | polígono | 11 regiões geográficas intermediárias |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `animal-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/animal-sp-2026).
A camada `valor` já abre no QGIS com os círculos da prancha (estilo `circulos`).

O **CSV** traz a tabela dos municípios, em UTF-8, sem geometria. Célula vazia quer dizer sem
informação; 0 quer dizer zero.

## Método

1. Tabela 74 da Pesquisa da Pecuária Municipal no SIDRA, variável *Valor da produção* (mil
   reais), ano 2024: *Leite*, *Ovos de galinha* e *Ovos de codorna* (somados em `ovos`), *Mel de
   abelha* e *Casulos do bicho-da-seda*.
2. Tabela 3940, variável *Valor da produção* (mil reais), ano 2024: total da aquicultura (peixes,
   camarão, ostras e outros).
3. Total = soma dos cinco produtos; produto dominante = o de maior valor no município.
4. Círculos de área proporcional ao total, num ponto dentro de cada município.

## Limitações

- A PPM não mede carne nem animais vendidos: bovinos, frangos e suínos abatidos não entram no
  valor, que fica restrito ao que os animais produzem.
- Valores em reais correntes de 2024, informados por município; não são receita líquida.
- 32 municípios ficam sem valor informado, quase todos na Grande São Paulo e no litoral.

## Licença dos dados

Dados abertos do IBGE, de uso livre com citação da fonte.
