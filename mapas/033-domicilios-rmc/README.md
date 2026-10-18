---
numero: 33
titulo: "Domicílios por km²"
subtitulo: "Metade dos lares em 3,4 % do chão"
data: 2026-10-24
categoria: censo-renda
colecao: rmc
tags: [rmc, campinas, censo-2022, domicilios, densidade, setores-censitarios, urbanizacao]

contexto: >-
  O Censo 2022 contou 1.157.476 domicílios ocupados nos 20 municípios da Região Metropolitana de Campinas, onde vivem 3.179.156 pessoas. Metade desses lares cabe em 129 km², 3,4% da área da região. O mapa pinta cada um dos 6.548 setores censitários pelo número de domicílios por km² e mostra a cidade em camadas: o centro de Campinas e os bairros de Sumaré, Hortolândia e Americana acima de 5.000, a franja dos loteamentos entre 1.000 e 5.000 e, em volta, o campo, com menos de 100. Hortolândia é o município mais denso, com 1.295 domicílios por km²; Morungaba, o menos, com 33. Segunda prancha da coleção «Região Metropolitana de Campinas».

imagem: ./mapa_preview.png
imagem_alt: "Mapa da Região Metropolitana de Campinas com os 6.548 setores censitários coloridos pelo número de domicílios ocupados por km² em 2022, numa rampa viridis: creme até 100, verde de 100 a 1.000, verde-azulado e azul-petróleo de 1.000 a 5.000, azul-anil e roxo-escuro acima de 5.000. O roxo e o azul se concentram no centro de Campinas e nos núcleos de Hortolândia, Sumaré, Americana, Santa Bárbara d'Oeste e Indaiatuba; o creme cobre o campo, sobretudo no leste. Uma chamada aponta Hortolândia, o município mais denso, com 1.295 domicílios por km². No painel, cada classe tem uma barra com a parte dos domicílios da região, e outra lista compara os municípios."

recorte: "Região Metropolitana de Campinas (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022: agregados por setores censitários"
    nome_en: "IBGE — 2022 Population Census: aggregates by census tract"
    url: https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "IBGE — Malha de Setores Censitários 2022"
    nome_en: "IBGE — 2022 Census Tract Mesh"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/26565-malhas-de-setores-censitarios-divisoes-intramunicipais.html
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Domicílios particulares ocupados de cada setor censitário do Censo 2022 divididos pela área do setor, em seis classes de limites fixos."

camadas:
  - { nome: setores, tipo: poligono, cor: "#2a788e", descricao: "6.548 setores censitários: situação, área, pessoas, domicílios ocupados e domicílios por km²", descricao_en: "6,548 census tracts: urban/rural status, area, people, occupied households and households per km²" }
  - { nome: municipios, tipo: poligono, cor: "#1a1c1e", descricao: "20 municípios: domicílios, pessoas, área, setores e domicílios por km²", descricao_en: "20 municipalities: households, people, area, tracts and households per km²" }

indicadores:
  - tipo: proporcao
    rotulo: "Domicílios da RMC, pela densidade do setor (domicílios por km²)"
    rotulo_en: "The region’s households, by tract density (households per km²)"
    unidade: "domicílios"
    unidade_en: "households"
    itens:
      - { rotulo: "até 100", valor: 23980, cor: "#f3edc8" }
      - { rotulo: "100 – 1.000", valor: 152901, cor: "#7ad151" }
      - { rotulo: "1.000 – 2.500", valor: 377573, cor: "#22a884" }
      - { rotulo: "2.500 – 5.000", valor: 383913, cor: "#2a788e" }
      - { rotulo: "5.000 – 10.000", valor: 105068, cor: "#414487" }
      - { rotulo: "mais de 10.000", valor: 114041, cor: "#440154" }
  - tipo: barras
    rotulo: "Domicílios por km², no município inteiro (os cinco mais densos)"
    rotulo_en: "Households per km², whole municipality (five densest)"
    unidade: "dom./km²"
    unidade_en: "households/km²"
    itens:
      - { rotulo: "Hortolândia", valor: 1295.1, cor: "#2a788e" }
      - { rotulo: "Americana", valor: 666.4, cor: "#2a788e" }
      - { rotulo: "Sumaré", valor: 642.4, cor: "#2a788e" }
      - { rotulo: "Campinas", valor: 541.0, cor: "#2a788e" }
      - { rotulo: "Vinhedo", valor: 338.7, cor: "#2a788e" }
  - tipo: numero
    rotulo: "Área que abriga metade dos domicílios"
    rotulo_en: "Area holding half the households"
    valor: 128.9
    unidade: "km²"
    nota: "3,4% dos 3.791 km² da região"
    nota_en: "3.4% of the region’s 3,791 km²"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/rmc-2026/rmc_domicilios_2022.gpkg.zip
    rotulo: "Setores e municípios, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Tracts and municipalities, SIRGAS 2000, with QGIS styles"
    tamanho: "4,6 MB"
  - formato: csv
    arquivo: dados/rmc_domicilios_2022.csv
    rotulo: "Os 6.548 setores: área, pessoas, domicílios e densidade"
    rotulo_en: "The 6,548 tracts: area, people, households and density"
    tamanho: "0,6 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/rmc-2026/rmc_domicilios_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/rmc-2026/rmc_domicilios_2022_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,6 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,4 MB"

versao: "1.0.0"
discussoes: []
---

# Domicílios por km² nos setores censitários da Região Metropolitana de Campinas

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 033, a segunda de quatro da coleção **Região Metropolitana de Campinas**: depois do chão
visto do satélite, onde moram as pessoas, setor a setor.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `setores` | polígono | 6.548 setores: `CD_SETOR`, `CD_MUN`, `NM_MUN`, `NM_BAIRRO`, `situacao` (urbana ou rural), `area_km2`, `pessoas`, `domicilios_ocupados`, `dom_km2` |
| `municipios` | polígono | 20 municípios: `domicilios`, `pessoas`, `area_km2`, `setores`, `dom_km2` |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `rmc-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/rmc-2026).
A camada `setores` traz o **estilo do QGIS** da prancha (`densidade`), e `municipios` um estilo de
contorno com o nome de cada município, para pôr por cima.

O **CSV** traz a tabela dos setores, em UTF-8, sem geometria.

## Método

1. Malha de Setores Censitários 2022 do IBGE, filtrada pelos 20 municípios da RMC.
2. Pessoas e domicílios particulares ocupados de cada setor, dos agregados por setor do Censo 2022.
3. Densidade = domicílios ocupados ÷ área do setor (a área informada pelo IBGE na malha).
4. Seis classes de limites fixos e redondos: até 100, 100 a 1.000, 1.000 a 2.500, 2.500 a 5.000,
   5.000 a 10.000 e mais de 10.000 domicílios por km². Os limites são os mesmos para toda a região,
   para comparar um município com outro.
5. Metade dos domicílios: os setores são ordenados do mais denso ao menos denso, e as áreas somadas
   até reunir 50% dos domicílios.
6. No painel, a densidade do município inteiro soma os domicílios e as áreas dos seus setores.

## Limitações

- O setor censitário é uma unidade de coleta, não uma grade regular: setores rurais grandes diluem
  um povoado inteiro numa densidade baixa, e setores urbanos pequenos de condomínios verticais
  saltam para a classe mais alta.
- Conta só domicílios **particulares ocupados**; domicílios vagos, de uso ocasional e coletivos
  (asilos, quartéis, alojamentos) ficam de fora.
- 176 setores não têm nenhum domicílio ocupado (áreas industriais, parques e outros espaços sem moradia) e aparecem em
  cinza-claro.
- A grade estatística do IBGE, em células regulares, daria outro desenho; aqui ficou o setor porque
  é nele que o Censo publica a renda da prancha seguinte.
