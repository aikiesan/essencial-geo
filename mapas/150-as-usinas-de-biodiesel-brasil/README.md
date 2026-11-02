---
numero: 150
titulo: "As usinas de biodiesel"
subtitulo: "A capacidade dobrou desde 2018, e um terço dela fica parada"
data: 2027-01-22
rascunho: true
categoria: energia
colecao: biodiesel-br
tags: [biodiesel-br, brasil, biodiesel, usinas, capacidade, mato-grosso, anp]

contexto: >-
  O Brasil tem 59 usinas de biodiesel autorizadas pela ANP, com 44,2 mil m³ por dia de capacidade, o dobro dos 21,8 mil m³ de janeiro de 2018. Elas se concentram no Centro-Oeste e no Sul: Mato Grosso tem 17 usinas e 24% da capacidade, e Rio Grande do Sul, Goiás e Paraná vêm logo atrás. Desde 2018, 17 municípios ganharam a primeira usina e 8 perderam a sua. Nos doze meses até setembro de 2026, as usinas produziram 10,4 milhões de m³, 66% do que a capacidade permitiria; o Sul e o Nordeste usaram cerca de 73%, o Norte e o Sudeste, 56%. Em 2022, quando a mistura voltou a 10%, o uso caiu a 47%. Primeira prancha da coleção «De onde vem o biodiesel».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers com círculos proporcionais à capacidade autorizada de biodiesel em cada município, em setembro de 2026 (disco) e janeiro de 2018 (anel), coloridos em cinco categorias: ganhou usina, cresceu, não mudou, encolheu e perdeu a usina. Os círculos se concentram em Mato Grosso, Goiás, Paraná e Rio Grande do Sul; uma chamada aponta Rondonópolis (MT), com 3.002 m³ por dia em três usinas, e outra o Sul, que usou 73% da capacidade. No painel, barras da capacidade por UF, barras da produção contra a capacidade em cada região e uma linha do uso da capacidade no país de 2018 aos últimos doze meses, com o mínimo de 47% em 2022."

recorte: "Brasil"
fontes:
  - nome: "ANP — Painel Dinâmico de Produtores de Biodiesel, dados abertos: capacidade autorizada por usina e mês, produção por região e mês (pb-da-biodiesel.zip, acesso em 01/11/2026)"
    nome_en: "ANP — Biodiesel Producers Dynamic Panel, open data: authorised capacity by plant and month, output by region and month (pb-da-biodiesel.zip, accessed 01/11/2026)"
    url: https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos/arquivos/pb-da-biodiesel.zip
    ano: 2026
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
metodo: "Capacidade autorizada de cada usina de biodiesel (ANP) somada por município em 01/2018 e 09/2026; uso da capacidade = produção da região nos doze meses de 10/2025 a 09/2026 dividida pela soma, mês a mês, da capacidade autorizada × dias do mês."

camadas:
  - { nome: municipios, tipo: ponto, cor: "#3f5a2a", descricao: "61 municípios com usina em 01/2018 ou 09/2026: capacidade e número de usinas nos dois meses, variação e categoria", descricao_en: "61 municipalities with a plant in 01/2018 or 09/2026: capacity and number of plants in both months, change and category" }
  - { nome: regioes, tipo: poligono, cor: "#1a1c1e", descricao: "5 grandes regiões: capacidade × dias, produção e uso da capacidade em 10/2025–09/2026", descricao_en: "5 macro-regions: capacity × days, output and capacity use in 10/2025–09/2026" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 UFs: usinas e capacidade em 09/2026 e capacidade em 01/2018", descricao_en: "27 states: plants and capacity in 09/2026 and capacity in 01/2018" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Capacidade autorizada de biodiesel, 09/2026"
    rotulo_en: "Authorised biodiesel capacity, 09/2026"
    valor: 44.2
    unidade: "mil m³/dia"
    nota: "59 usinas; 21,8 mil m³/dia e 49 usinas em 01/2018 (+103%)"
    nota_en: "59 plants; 21.8 thousand m³/day and 49 plants in 01/2018 (+103%)"
  - tipo: numero
    rotulo: "Uso da capacidade, 10/2025–09/2026"
    rotulo_en: "Capacity use, 10/2025–09/2026"
    valor: 66.3
    unidade: "%"
    nota: "10,4 milhões de m³ produzidos; 47,4% em 2022"
    nota_en: "10.4 million m³ produced; 47.4% in 2022"
  - tipo: barras
    rotulo: "Capacidade autorizada por UF, 09/2026"
    rotulo_en: "Authorised capacity by state, 09/2026"
    unidade: "mil m³/dia"
    itens:
      - { rotulo: "Mato Grosso", valor: 10.8, cor: "#8aa05a" }
      - { rotulo: "Rio Grande do Sul", valor: 9.4, cor: "#8aa05a" }
      - { rotulo: "Goiás", valor: 6.4, cor: "#8aa05a" }
      - { rotulo: "Paraná", valor: 4.5, cor: "#8aa05a" }
      - { rotulo: "Bahia", valor: 3.5, cor: "#8aa05a" }
      - { rotulo: "Mato Grosso do Sul", valor: 2.0, cor: "#8aa05a" }
      - { rotulo: "Santa Catarina", valor: 1.9, cor: "#8aa05a" }
      - { rotulo: "outras 7 UFs", valor: 5.8, cor: "#b8bd9e" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biodiesel-br-2026/br_biodiesel_usinas.gpkg.zip
    rotulo: "Municípios com usina, regiões, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities with a plant, regions, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,6 MB"
  - formato: csv
    arquivo: dados/br_biodiesel_usinas.csv
    rotulo: "Os 61 municípios, com capacidade e usinas em 01/2018 e 09/2026"
    rotulo_en: "The 61 municipalities, with capacity and plants in 01/2018 and 09/2026"
    tamanho: "5 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biodiesel-br-2026/br_biodiesel_usinas_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/biodiesel-br-2026/br_biodiesel_usinas_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "3,4 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,2 MB"

doi_automatico: false
versao: "1.0.0"
discussoes: []
---

# As usinas de biodiesel: capacidade por município, 2018 a 2026, e quanto dela se usa

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 150, a primeira da coleção **De onde vem o biodiesel**. Antes da matéria-prima e do
caminho do combustível, onde estão as fábricas e quanto da capacidade delas vira biodiesel.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | ponto | 61 municípios com usina em 01/2018 ou 09/2026: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `usinas_2018`, `cap_2018`, `usinas_2026`, `cap_2026` (m³/dia), `variacao_m3d`, `categoria`, `lon`, `lat` |
| `regioes` | polígono | 5 grandes regiões: `capacidade_m3_12m` (capacidade × dias), `producao_m3_12m`, `uso_pct_12m` (10/2025–09/2026) |
| `ufs` | polígono | 27 UFs: `usinas_2026`, `cap_2026`, `cap_2018` (m³/dia) |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `biodiesel-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/biodiesel-br-2026),
com os **estilos do QGIS** gravados (círculos por categoria, com o tamanho pela capacidade). O
**CSV** fica nesta pasta, em UTF-8, com a tabela dos municípios sem geometria.

## Método

1. Dados abertos do Painel Dinâmico de Produtores de Biodiesel da ANP (`pb-da-biodiesel.zip`,
   baixado em 01/11/2026, arquivos de 27/10/2026): `Biodiesel_DadosAbertos_CSV_Capacidade.csv`,
   capacidade autorizada em m³/dia por usina (CNPJ), município e mês, de 01/2018 a 09/2026, e
   `Biodiesel_DadosAbertos_CSV_Produção.csv`, produção em m³ por grande região e mês.
2. Capacidade por município: soma das usinas em 01/2018 (49 usinas, 21,8 mil m³/dia) e em 09/2026
   (59 usinas de 48 empresas pela raiz do CNPJ, 44,2 mil m³/dia, em 53 municípios). Cada município
   é desenhado num ponto interno do seu polígono; os nomes da ANP casam todos com os do IBGE.
3. Categorias: ganhou usina (sem capacidade em 01/2018), perdeu a usina (sem capacidade em
   09/2026), cresceu, encolheu ou não mudou.
4. Uso da capacidade: a ANP publica a produção por região, não por usina nem por UF. Para cada
   região, a produção dos doze meses de 10/2025 a 09/2026 dividida pela soma, mês a mês, da
   capacidade autorizada das usinas da região multiplicada pelos dias do mês. A linha do painel faz
   a mesma conta para o país em cada ano de 2018 a 2025 e nesses doze meses.

## Leitura

- Mato Grosso tem 17 usinas e 10,8 mil m³/dia (24% do país); Rio Grande do Sul, 9 usinas e
  9,4 mil; Goiás, 8 e 6,4 mil; Paraná, 4 e 4,5 mil.
- Rondonópolis (MT) é o município com mais capacidade: 3 usinas, 3.002 m³/dia (1.512 em 01/2018).
  A maior usina sozinha fica na Lapa (PR), com 2.500 m³/dia; a mediana é de 625 m³/dia.
- Entre 01/2018 e 09/2026, 17 municípios ganharam a primeira usina (10,8 mil m³/dia), 24 cresceram
  (+12,8 mil), 11 não mudaram, 1 encolheu e 8 perderam a usina (−1,3 mil m³/dia).
- Nos doze meses até 09/2026, as usinas produziram 10,4 milhões de m³, 66,3% do que a capacidade
  permitiria. Por região: Nordeste 73,6%, Sul 72,8%, Centro-Oeste 62,5%, Sudeste 56,3%, Norte 55,6%.
- O uso do país foi de 63% a 65% entre 2018 e 2020, caiu a 47,4% em 2022, ano todo com mistura
  de 10%, e subiu de novo com a mistura de 14% (desde 03/2024) e de 15% (desde 08/2025): 66,3% nos
  últimos doze meses.

## Limitações

- Capacidade autorizada não é capacidade efetiva: é o teto que a ANP autoriza a usina a produzir.
- O uso é calculado por região, porque a ANP não publica a produção por usina ou por UF; dentro de
  uma região, há usinas paradas e usinas cheias.
- O painel de capacidade começa em 01/2018; usinas fechadas antes não aparecem.
- Uma usina que troca de CNPJ no mesmo município aparece como «não mudou» se a capacidade for a
  mesma; a categoria é do município, não da empresa.

## Licença dos dados

Dados abertos da ANP e do IBGE, de uso livre com citação da fonte.
