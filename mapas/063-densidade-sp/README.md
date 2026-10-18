---
numero: 63
titulo: "Onde mora a gente"
subtitulo: "Metade dos paulistas cabe em meio por cento do estado"
data: 2026-11-23
categoria: censo-renda
colecao: gente-sp
tags: [gente-sp, sao-paulo, densidade-demografica, populacao, censo-2022, setores-censitarios]

contexto: >-
  São Paulo tem 44,4 milhões de habitantes em 248 mil km², 179 por km² em média. Mas a média engana. Metade da população mora em setores censitários que, somados, ocupam 1.238 km², 0,5% do estado; 90% ocupam 2,1%. No outro extremo, 81% da área tem menos de 10 moradores por km² e guarda 1,3% da gente. O mapa é quase todo creme, com pontos escuros nas cidades e uma mancha contínua na Grande São Paulo, que se estende rumo a Campinas, Sorocaba e o Vale do Paraíba. O município mais denso é Taboão da Serra, com 13.428 moradores por km², seguido de Diadema e Carapicuíba; a capital tem 7.521. O menos denso é Iporanga, no Vale do Ribeira, com 3,5. Primeira prancha da coleção «Gente no território».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com os setores censitários em seis tons, do creme ao verde-oliva quase preto, pelo número de moradores por km². O estado é quase todo creme; as cidades aparecem como pontos escuros, e a Grande São Paulo como uma mancha escura contínua que se estende para Campinas, Sorocaba e o Vale do Paraíba. Chamadas apontam Taboão da Serra, com 13.428 moradores por km², e Iporanga, com 3,5. No painel, a parte da população e a parte da área em cada classe, e os cinco municípios mais densos."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022: agregados por setor censitário (características básicas e demografia)"
    nome_en: "IBGE — 2022 Population Census: census tract aggregates (basic characteristics and demography)"
    url: https://www.ibge.gov.br/estatisticas/sociais/populacao/22827-censo-demografico-2022.html
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
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Pessoas residentes por km² de cada setor censitário do Censo 2022 (área do próprio setor), em seis classes; parte da população e da área do estado em cada classe; área acumulada dos setores do mais denso ao menos denso até somar metade e 90% da população."

camadas:
  - { nome: setores, tipo: poligono, cor: "#5b6142", descricao: "103.319 setores: área, pessoas, moradores por km², pessoas por grupo de idade e classes de densidade e de 60 anos ou mais", descricao_en: "103,319 tracts: area, people, residents per km², people by age group and density and 60-plus classes" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "População pela densidade do setor (moradores por km²)"
    rotulo_en: "Population by tract density (residents per km²)"
    unidade: "pessoas"
    unidade_en: "people"
    itens:
      - { rotulo: "até 10", rotulo_en: "up to 10", valor: 575585, cor: "#f2efe6" }
      - { rotulo: "10 a 100", rotulo_en: "10 to 100", valor: 637668, cor: "#dcd6bf" }
      - { rotulo: "100 a 1.000", rotulo_en: "100 to 1,000", valor: 1697936, cor: "#b9b48f" }
      - { rotulo: "1.000 a 5.000", rotulo_en: "1,000 to 5,000", valor: 9973053, cor: "#8a8a62" }
      - { rotulo: "5.000 a 15.000", rotulo_en: "5,000 to 15,000", valor: 17481900, cor: "#5b6142" }
      - { rotulo: "mais de 15.000", rotulo_en: "over 15,000", valor: 14045096, cor: "#2f3826" }
  - tipo: numero
    rotulo: "Parte do território onde mora metade da população"
    rotulo_en: "Share of the land where half the population lives"
    valor: 0.5
    unidade: "%"
    nota: "1.238 km² de 248.219 km²"
    nota_en: "1,238 km² of 248,219 km²"
  - tipo: numero
    rotulo: "Moradores por km² no estado"
    rotulo_en: "Residents per km² in the state"
    valor: 179
    unidade: "pessoas por km²"
    unidade_en: "people per km²"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/gente-sp-2026/sp_gente_setores_2022.gpkg.zip
    rotulo: "Setores censitários com população, densidade e idade, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Census tracts with population, density and age, SIRGAS 2000, with QGIS styles"
    tamanho: "26,0 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/gente-sp-2026/sp_densidade_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/gente-sp-2026/sp_densidade_2022_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "3,0 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

versao: "1.0.0"
discussoes: []
---

# Densidade demográfica por setor censitário em São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 063, a primeira de quatro da coleção **Gente no território**: onde mora a gente de
São Paulo, a idade e o sexo por município, os de 60 anos ou mais setor por setor e o campo.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `setores` | polígono | 103.319 setores: `CD_SETOR`, `CD_MUN`, `NM_MUN`, `situacao` (urbana/rural), `area_km2`, `pessoas`, `hab_km2`, pessoas por grupo de idade (`idade_0_a_4` … `idade_70_ou_mais`), `classe_densidade` (1 a 6) e `classe_60_mais` (1 a 6, da prancha 065) |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

O **GPKG** vai compactado nos assets da
[release `gente-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/gente-sp-2026),
com dois **estilos do QGIS**: `densidade` (o desta prancha) e `60_anos_ou_mais` (o da
[prancha 065](../065-idosos-sp/README.md)). Os grupos de idade ficam vazios onde o IBGE pôs sigilo.

## Método

1. Agregados por setor do Censo 2022: pessoas residentes e área do setor (km²), da malha de setores.
2. Moradores por km² em seis classes, fechadas à direita: até 10, 10 a 100, 100 a 1.000, 1.000 a
   5.000, 5.000 a 15.000 e mais de 15.000. Setores sem morador (2.391) ficam em cinza.
3. Parte da população e da área em cada classe. Para a área de metade e de 90% da gente, os setores
   são ordenados do mais denso ao menos denso e a área é somada até a população acumulada chegar
   à fração.
4. Municípios: pessoas dos setores sobre a área da Malha Municipal 2025.
5. Na prancha, os setores viram uma grade de cerca de 200 m para caber o estado inteiro; o GPKG tem
   os polígonos.

## Limitações

- A densidade é a do setor, que mistura quadras, praças, rios e terrenos vazios; nos setores
  pequenos do centro de São Paulo ela passa de um milhão por km², por serem quase só um prédio.
- A área de metade da população depende do tamanho dos setores: com unidades menores, ela seria
  menor ainda.
- A população é a de residentes: quem trabalha ou estuda num lugar e mora em outro conta onde mora.
