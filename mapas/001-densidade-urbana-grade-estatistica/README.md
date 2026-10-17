---
numero: 1
titulo: "Densidade urbana em grade regular"
subtitulo: "O município sem os contornos arbitrários dos setores"
data: 2026-10-10
categoria: censo-renda
tags: [densidade, grade-estatistica, censo-2022, prancha-modelo]
exemplo: true

contexto: >-
  Setores censitários têm forma de gaveta administrativa: são desenhados para o
  recenseador percorrer, não para descrever onde as pessoas vivem. Quando a
  população é redistribuída numa grade regular — como faz a Grade Estatística do
  IBGE — o município perde suas fronteiras arbitrárias e a densidade reaparece
  como relevo: um núcleo compacto, subcentros que puxam a cidade para fora e um
  eixo viário que costura tudo. Esta prancha-modelo, feita com dados sintéticos,
  fixa a linguagem da série: quadrados proporcionais, Viridis invertida e nenhuma
  célula maior do que o dado que a sustenta.

imagem: ./mapa_preview.png
imagem_alt: "Prancha com um recorte municipal irregular coberto por uma grade de quadrados proporcionais; os maiores e mais escuros, em roxo, formam um núcleo central e três subcentros menores, ligados por um corredor diagonal."

recorte: "Município fictício (dados sintéticos)"
fontes:
  - nome: "Dados sintéticos — Essencial Geo (scripts/gerar-exemplos.mjs)"
    url: https://github.com/aikiesan/essencial-geo/blob/main/scripts/gerar-exemplos.mjs
    ano: 2026
  - nome: "Modelo de referência: IBGE — Grade Estatística"
crs: "SIRGAS 2000 / UTM zona 23S"
epsg: 31983
escala: "1:50.000"
software: ["Node.js", "d3-scale-chromatic"]
metodo: "Soma de núcleos gaussianos + ruído fractal, agregada em células de 220 m."

downloads:
  - formato: gpkg
  - formato: dxf
    arquivo: dados/grade_densidade_sintetica.dxf
    tamanho: "0,6 MB"
  - formato: csv
    arquivo: dados/grade_densidade_sintetica.csv
    tamanho: "62 kB"
  - formato: png
    arquivo: mapa_preview.png
    rotulo: "Prancha (PNG 2400 px)"
    tamanho: "0,1 MB"

versao: "0.1.0"
discussoes: []
---

# Densidade urbana em grade regular

> **Prancha-modelo.** Os valores são sintéticos e não representam nenhum lugar real.
> A prancha existe para fixar a linguagem visual da série de densidade.

## Método

1. Um recorte municipal fictício é desenhado como um círculo deformado por ruído fractal.
2. A densidade é a soma de cinco núcleos gaussianos (um centro e quatro subcentros), de um
   corredor viário diagonal e de ruído de baixa frequência.
3. O valor é agregado numa grade regular de 22 px (220 m na escala sintética).
4. Cada célula vira um quadrado de lado proporcional à raiz do valor — assim a **área**,
   e não o lado, é proporcional à densidade.
5. A cor usa Viridis invertida: o escuro carrega o dado sobre o papel claro.

## Versão com dados reais

A série real usará a Grade Estatística do IBGE (células de 200 m em áreas urbanas)
com a população do Censo 2022. Um ponto de partida em R:

```r
library(geobr)
library(sf)

muni  <- read_municipality(code_muni = "SP", year = 2022)
muni  <- muni[muni$name_muni == "Campinas", ]
grade <- read_statistical_grid(code_grid = "all")
grade <- st_filter(st_transform(grade, 31983), st_transform(muni, 31983))
```

## Arquivos

| Arquivo | Conteúdo |
| --- | --- |
| `dados/grade_densidade_sintetica.dxf` | `LIMITE` e `GRADE_DENSIDADE` (elevação = índice) |
| `dados/grade_densidade_sintetica.csv` | `id;x_m;y_m;indice_densidade` |
| `mapa_preview.png` | Prancha, 2400 × 1800 px |
