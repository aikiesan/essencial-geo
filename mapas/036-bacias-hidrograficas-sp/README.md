---
numero: 36
titulo: "Bacias hidrográficas"
subtitulo: "Vinte e duas casas para a mesma chuva"
data: 2026-10-27
categoria: hidrografia
colecao: agua-sp
tags: [agua-sp, sao-paulo, bacias-hidrograficas, ugrhi, recursos-hidricos, censo-2022, hidrovia, seade]

contexto: >-
  Para cuidar da água, São Paulo não usa o mapa dos municípios, e sim o das bacias: 22 Unidades de Gerenciamento de Recursos Hídricos, as UGRHIs. Pintadas pela população do Censo 2022, elas mostram um estado desigual diante da mesma chuva. Os municípios do Alto Tietê, em volta da capital, somam 20,5 milhões de pessoas, 46,1% dos paulistas, em 2,4% do território: 3.456 habitantes por km². No Pontal do Paranapanema, são 20,8. Pelo Tietê e pelo Paraná corre ainda a hidrovia, com oito eclusas desenhadas no mapa. Primeira prancha da coleção «Água em SP».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo dividido nas 22 UGRHIs, numeradas em selos brancos e coloridas pela densidade de população em 2022, numa rampa viridis do amarelo (menos de 43 habitantes por km², no sul e no oeste) ao roxo-escuro (mais de 190, no Alto Tietê, em Piracicaba/Capivari/Jundiaí e na Baixada Santista). Uma linha azul com losangos marca a hidrovia Tietê-Paraná e suas oito eclusas. Uma chamada com seta aponta o Alto Tietê: 46,1% da população em 2,4% do território. No painel, um índice lista as 22 bacias pelo número."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "SEADE — GeoSEADE: Unidades de Gerenciamento de Recursos Hídricos (UGRHIs), divisão do Conselho Estadual de Recursos Hídricos"
    nome_en: "SEADE — GeoSEADE: Water Resources Management Units (UGRHIs), as defined by the State Water Resources Council"
    url: https://geo.seade.gov.br/
  - nome: "IBGE — Censo Demográfico 2022: agregados por município"
    nome_en: "IBGE — 2022 Population Census: aggregates by municipality"
    url: https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "MapBiomas — base de infraestrutura: hidrovias e eclusas"
    nome_en: "MapBiomas — infrastructure database: waterways and locks"
    url: https://mapbiomas.org/
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Cada município atribuído à UGRHI que cobre a maior parte do seu território; população do Censo 2022 somada por UGRHI e dividida pela área da bacia, em seis classes por quantis."

camadas:
  - { nome: ugrhi, tipo: poligono, cor: "#2a788e", descricao: "22 UGRHIs: área, municípios, população 2022 e densidade", descricao_en: "22 UGRHIs: area, municipalities, 2022 population and density" }
  - { nome: municipios, tipo: poligono, descricao: "645 municípios, com a UGRHI atribuída, a fração do território nela e a população 2022", descricao_en: "645 municipalities, with the assigned UGRHI, the share of territory in it and the 2022 population" }
  - { nome: hidrovia, tipo: linha, cor: "#234e70", descricao: "Hidrovia Tietê-Paraná", descricao_en: "Tietê-Paraná waterway" }
  - { nome: eclusas, tipo: ponto, cor: "#234e70", descricao: "8 eclusas da hidrovia", descricao_en: "8 locks on the waterway" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: barras
    rotulo: "Parte da população paulista, por UGRHI (as cinco maiores)"
    rotulo_en: "Share of São Paulo’s population, by UGRHI (top five)"
    unidade: "%"
    itens:
      - { rotulo: "6 · Alto Tietê", valor: 46.09, cor: "#440154" }
      - { rotulo: "5 · Piracicaba/Capivari/Jundiaí", valor: 12.93, cor: "#440154" }
      - { rotulo: "10 · Tietê/Sorocaba", valor: 5.12, cor: "#440154" }
      - { rotulo: "2 · Paraíba do Sul", valor: 5.10, cor: "#414487" }
      - { rotulo: "7 · Baixada Santista", valor: 4.07, cor: "#440154" }
  - tipo: numero
    rotulo: "Densidade no Alto Tietê"
    rotulo_en: "Density in Alto Tietê"
    valor: 3456.1
    unidade: "hab./km²"
    unidade_en: "people/km²"
    nota: "No Pontal do Paranapanema: 20,8 hab./km²"
    nota_en: "In Pontal do Paranapanema: 20.8 people/km²"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/agua-sp-2026/sp_bacias_hidrograficas.gpkg.zip
    rotulo: "Cinco camadas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Five layers, SIRGAS 2000, with QGIS styles"
    tamanho: "16,4 MB"
  - formato: csv
    arquivo: dados/sp_bacias_hidrograficas.csv
    rotulo: "As 22 UGRHIs: área, municípios, população e densidade"
    rotulo_en: "The 22 UGRHIs: area, municipalities, population and density"
    tamanho: "1 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/agua-sp-2026/sp_bacias_hidrograficas_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/agua-sp-2026/sp_bacias_hidrograficas_prancha.en.svg
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
discussoes: []
---

# Bacias hidrográficas — as 22 UGRHIs de São Paulo e a população de cada uma

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 036, a primeira de três da coleção **Água em SP**: o desenho das bacias com que o
estado gere a água. As próximas seguem a rede de drenagem e as unidades de conservação.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `ugrhi` | polígono | 22 UGRHIs: `codigo`, `nome`, `area_km2`, `municipios`, `populacao_2022`, `densidade_hab_km2`, `pct_populacao`, `pct_area` |
| `municipios` | polígono | 645 municípios: `ugrhi_codigo`, `ugrhi_nome`, `fracao_na_ugrhi` (parte do território do município dentro da UGRHI atribuída), `populacao_2022` |
| `hidrovia` | linha | hidrovia Tietê-Paraná |
| `eclusas` | ponto | Barra Bonita, Bariri, Ibitinga, Promissão, Nova Avanhandava, Três Irmãos, Jupiá e Porto Primavera |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `agua-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/agua-sp-2026).
A camada `ugrhi` traz dois **estilos do QGIS**: `densidade` (o padrão, igual ao da prancha) e
`contorno`, só com as bordas, o número e o nome, para usar sobre outros mapas.

O **CSV** traz a tabela das 22 UGRHIs, em UTF-8, sem geometria.

## Método

1. Polígonos das 22 UGRHIs do GeoSEADE (divisão do Conselho Estadual de Recursos Hídricos). Os
   nomes seguem a grafia oficial; a tabela original vem em caixa alta.
2. Área de cada UGRHI em km², calculada na projeção cônica equivalente de Albers usada pelo IBGE
   para o Brasil.
3. Cada município da Malha Municipal 2025 é atribuído à UGRHI que cobre a maior parte do seu
   território, por sobreposição das geometrias.
4. População residente do Censo 2022 (agregados por município do IBGE), somada por UGRHI;
   densidade = população ÷ área da UGRHI.
5. Classes: seis quantis das 22 densidades, limites arredondados a dois algarismos significativos;
   o último é o máximo.
6. Hidrovia e eclusas da base de infraestrutura do MapBiomas, recortadas por São Paulo (com os
   trechos do rio Paraná na divisa).

## Limitações

- 179 municípios têm menos de 90% do território na UGRHI que receberam: a população deles conta
  inteira para uma só bacia. A divisão oficial do Conselho Estadual de Recursos Hídricos, que
  atribui cada município pela sede, pode diferir em alguns casos.
- A densidade usa a área total da bacia, com represas, várzeas e áreas protegidas.
- O traçado das UGRHIs do GeoSEADE e o limite da Malha Municipal 2025 não coincidem exatamente na
  costa e nas divisas; a soma das áreas das UGRHIs difere um pouco da área do estado.
