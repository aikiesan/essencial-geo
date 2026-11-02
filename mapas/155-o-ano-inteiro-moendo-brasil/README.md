---
numero: 155
titulo: "O ano inteiro moendo"
subtitulo: "Quando o Centro-Sul para, o litoral do Nordeste mói quatro em cada cinco toneladas"
data: 2027-02-03
rascunho: true
categoria: energia
colecao: sapcana-br
tags: [sapcana-br, brasil, cana-de-acucar, moagem, calendario, safra, nordeste, mapa]

contexto: >-
  O Brasil mói cana o ano inteiro, mas não no mesmo lugar. No Centro-Sul, a safra começa em abril, chega ao pico em julho e quase para de dezembro a março: São Paulo mói 79% da sua cana de abril a setembro. No litoral do Nordeste, o calendário é o inverso: Alagoas, Sergipe e Pernambuco moem de 84% a 92% da cana de outubro a março, com a safra começando em setembro. Por isso, em janeiro e fevereiro, 80% da cana moída no país sai de Alagoas, Pernambuco, Paraíba, Rio Grande do Norte e Sergipe, que no ano inteiro respondem por só 6,5%. O maior mês das três safras foi julho de 2023, com 105,9 milhões de toneladas; o menor, fevereiro de 2025, com 5,0 milhões. A moagem de cada mês sai da diferença entre os acumulados dos relatórios do SAPCana, do Ministério da Agricultura. Terceira prancha da coleção «A safra de cada estado».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers com as UFs coloridas pela parte da cana moída de outubro a março, somando as safras 2023/24 a 2025/26, em quatro classes: menos de 25% (verde-claro), 25 a 50% (verde), 50 a 75% (ocre-claro) e 75% ou mais (marrom-alaranjado), e branco para as UFs sem cana. O Centro-Sul inteiro (SP, MG, GO, MT, PR, RJ, TO) fica no verde-claro; Maranhão, Piauí, Pará, Bahia, Mato Grosso do Sul e Espírito Santo no verde; Amazonas, Paraíba e Rio Grande do Norte no ocre-claro; Pernambuco, Alagoas e Sergipe no tom mais escuro. Uma chamada aponta Alagoas, com 90% da moagem de outubro a março; outra aponta São Paulo, com 79% de abril a setembro e pico em julho. No painel, um mapa de calor das 19 UFs pelos doze meses, com a moagem concentrada de maio a outubro no Centro-Sul e de outubro a fevereiro no litoral nordestino, e barras da moagem média do país por mês, com a parte do litoral do Nordeste chegando a 78% em janeiro e 83% em fevereiro."

recorte: "Brasil"
fontes:
  - nome: "MAPA — Acompanhamento da produção sucroalcooleira (SAPCana): relatórios mensais por UF das safras 2023/2024, 2024/2025 e 2025/2026, com cana moída, açúcar e etanol anidro e hidratado acumulados desde 01/04 (36 arquivos .xls, acesso em 01/11/2026)"
    nome_en: "MAPA (Ministry of Agriculture) — Sugar and ethanol production monitoring (SAPCana): monthly reports by state for the 2023/2024, 2024/2025 and 2025/2026 harvests, with cane crushed, sugar and anhydrous and hydrated ethanol accumulated since 1 April (36 .xls files, accessed 01/11/2026)"
    url: https://www.gov.br/agricultura/pt-br/assuntos/sustentabilidade/agroenergia/acompanhamento-da-producao-sucroalcooleira
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
software: ["Python", "pandas", "GeoPandas", "xlrd", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Moagem de cada mês = acumulado da safra no relatório do SAPCana/MAPA menos o do mês anterior, por UF, de 04/2023 a 03/2026 (36 meses); perfil do ano de cada UF somando as três safras; parte moída de outubro a março; parte do litoral do Nordeste (AL, PE, PB, RN, SE) na moagem do país por mês."

camadas:
  - { nome: ufs, tipo: poligono, cor: "#a8692e", descricao: "27 UFs: cana moída nas três safras, % moída de outubro a março, mês e % do pico, meses com 5% ou mais da moagem, % de cada mês (m04_pct a m03_pct) e classe", descricao_en: "27 states: cane crushed over the three harvests, % crushed October to March, peak month and %, months with 5% or more of the crush, % in each month (m04_pct to m03_pct) and class" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Parte do litoral do Nordeste na cana moída em janeiro e fevereiro"
    rotulo_en: "North-eastern coast’s share of cane crushed in January and February"
    valor: 79.6
    unidade: "%"
    nota: "AL, PE, PB, RN e SE, safras 2023/24 a 2025/26; 6,5% da moagem do ano inteiro"
    nota_en: "AL, PE, PB, RN and SE, 2023/24 to 2025/26 harvests; 6.5% of the whole year’s crush"
  - tipo: numero
    rotulo: "Cana de São Paulo moída de abril a setembro"
    rotulo_en: "São Paulo cane crushed from April to September"
    valor: 79.1
    unidade: "%"
    nota: "pico em julho, com 15,9% da cana do ano"
    nota_en: "peak in July, with 15.9% of the year’s cane"
  - tipo: barras
    rotulo: "Cana moída de outubro a março, safras 2023/24 a 2025/26"
    rotulo_en: "Cane crushed from October to March, 2023/24 to 2025/26 harvests"
    unidade: "% da moagem da UF"
    itens:
      - { rotulo: "Sergipe", valor: 91.7, cor: "#a8692e" }
      - { rotulo: "Alagoas", valor: 90.4, cor: "#a8692e" }
      - { rotulo: "Pernambuco", valor: 83.5, cor: "#a8692e" }
      - { rotulo: "Rio Grande do Norte", valor: 73.9, cor: "#d9b77a" }
      - { rotulo: "Paraíba", valor: 72.7, cor: "#d9b77a" }
      - { rotulo: "Bahia", valor: 37.1, cor: "#a9bd8c" }
      - { rotulo: "São Paulo", valor: 20.9, cor: "#dfe6d3" }
      - { rotulo: "Paraná", valor: 18.9, cor: "#dfe6d3" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/sapcana-br-2026/br_sapcana_calendario.gpkg.zip
    rotulo: "UFs com o perfil mensal da moagem e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "States with the monthly crush profile and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,1 MB"
  - formato: csv
    arquivo: dados/br_sapcana_calendario.csv
    rotulo: "Cana, açúcar e etanol de cada UF em cada mês, de 04/2023 a 03/2026"
    rotulo_en: "Cane, sugar and ethanol of each state in each month, 04/2023 to 03/2026"
    tamanho: "30 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/sapcana-br-2026/br_sapcana_calendario_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/sapcana-br-2026/br_sapcana_calendario_prancha.en.svg
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

# O ano inteiro moendo: o calendário da moagem de cada UF

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 155, a terceira e última da coleção **A safra de cada estado**. Depois de quanto e de para
quê, quando: o Brasil tem dois calendários de cana, e eles se revezam.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `ufs` | polígono | 27 UFs: `cana_3_safras` (t), `fora_pct` (% moída de outubro a março), `mes_pico`, `pico_pct`, `meses_ativos` (meses com 5% ou mais da moagem), `m04_pct` … `m03_pct` (% da moagem em cada mês, três safras somadas), `classe` (−1 = sem cana) |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `sapcana-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/sapcana-br-2026),
com os **estilos do QGIS** gravados. O **CSV** fica nesta pasta, em UTF-8, em formato longo: uma
linha por UF e mês, com a cana moída (t), o açúcar (t) e o etanol (m³) do mês.

## Método

1. Relatórios mensais do SAPCana (MAPA), baixados em 01/11/2026: o acumulado da safra por UF desde
   01/04, um relatório por mês (ver a prancha 153).
2. Moagem do mês = acumulado do relatório menos o do relatório anterior, na mesma safra (o primeiro
   mês de cada safra é o próprio acumulado). Quatro diferenças negativas, revisões das usinas entre
   um mês e outro, viram zero; na cana, só uma (RJ, 03/2024, −38 t).
3. Perfil de cada UF: a moagem de cada mês do calendário (abril a março) somada nas três safras e
   dividida pelo total das três. Parte de outubro a março = soma de outubro, novembro, dezembro,
   janeiro, fevereiro e março.
4. Litoral do Nordeste: Alagoas, Pernambuco, Paraíba, Rio Grande do Norte e Sergipe, as UFs que o
   próprio relatório põe na safra de setembro a agosto (a Bahia aparece lá também, mas mói, na maior
   parte, no calendário do Centro-Sul). A parte delas no país é calculada mês a mês e por mês do
   calendário, nas três safras somadas.

## Leitura

- São Paulo mói 79,1% da sua cana de abril a setembro, com o pico em julho (15,9% do ano). Paraná,
  Goiás, Mato Grosso, Minas Gerais e Tocantins têm perfis quase iguais: de 16% a 20% da moagem de
  outubro a março.
- No litoral do Nordeste, o calendário se inverte: Sergipe mói 91,7% da cana de outubro a março,
  Alagoas 90,4%, Pernambuco 83,5%, Rio Grande do Norte 73,9% e Paraíba 72,7%.
- Em janeiro e fevereiro, 79,6% da cana moída no país saiu dessas cinco UFs (78% em janeiro, 83% em
  fevereiro); de dezembro a março, 48,1%. No ano inteiro, elas moem 6,5%.
- O maior mês das três safras foi 07/2023, com 105,9 milhões de t; o menor, 02/2025, com
  5,0 milhões, dos quais 4,3 milhões no litoral do Nordeste.
- O Amazonas mói de agosto a novembro (55% de outubro a março); Piauí e Maranhão, de junho a outubro.

## Limitações

- A moagem do mês é uma diferença entre relatórios acumulados; uma correção feita pela usina num mês
  aparece como moagem a mais ou a menos naquele mês.
- O relatório usa a janela de 01/04 a 31/03 para todas as UFs; o perfil soma meses do calendário e
  não depende de onde a safra começa.
- Os dados são por UF: a Bahia junta usinas do sul do estado, no calendário do Centro-Sul, e do
  norte, no do litoral.

## Licença dos dados

Dados públicos do MAPA e do IBGE, de uso livre com citação da fonte.
