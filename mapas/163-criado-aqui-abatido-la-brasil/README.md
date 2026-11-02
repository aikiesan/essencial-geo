---
numero: 163
titulo: "Criado aqui, abatido lá"
subtitulo: "São Paulo abate 2,5 vezes o que o seu rebanho de bois daria; o Nordeste cria porcos que o abate inspecionado não vê"
data: 2027-02-22
rascunho: true
categoria: energia
colecao: abate-br
tags: [abate-br, brasil, abate, rebanho, bovinos, suinos, frangos, ibge, sif]

contexto: >-
  Dividir as cabeças abatidas em 2025 em cada UF pelo rebanho da UF, com o Brasil igual a 1, mostra para onde o animal viaja antes de virar carne e resíduo. São Paulo abate 4,77 milhões de bois com 10,3 milhões no pasto: índice 2,5, o maior do país, e os dados do SIF dizem que 428 mil bois abatidos lá em 2025 vieram de outras UFs. No porco, o Paraná recebe 792 mil cabeças de fora e o Rio Grande do Sul manda 616 mil. Na outra ponta, Bahia, Ceará e Pernambuco criam porcos que quase não aparecem no abate inspecionado (índice abaixo de 0,25): o abate é sem inspeção ou fora da UF. No frango, Santa Catarina e Mato Grosso têm os maiores índices. Segunda prancha da coleção «Onde o bicho vira resíduo».

imagem: ./mapa_preview.png
imagem_alt: "Três mapas do Brasil por UF, para bovinos, suínos e frangos, coloridos pelo índice de abate sobre rebanho em 2025, com o Brasil igual a 1, numa escala divergente de verde (abate menor que o rebanho daria) a vermelho-tijolo (maior), e hachura nas UFs com dado inibido. No mapa dos bovinos, São Paulo aparece em vermelho e o Nordeste em verde-claro; no dos suínos, Bahia, Pernambuco, Ceará e vizinhos em verde-escuro e a Amazônia hachurada; no dos frangos, Maranhão e Piauí em verde-escuro. No quarto quadro, barras divergentes dos seis maiores saldos do SIF por UF, para bovinos (São Paulo +428 mil) e suínos (Paraná +792 mil, Rio Grande do Sul −616 mil). No painel, as quatro UFs com mais abate de cada espécie, com a parte do abate e a do rebanho do país."

recorte: "Brasil"
fontes:
  - nome: "IBGE — Pesquisa Trimestral do Abate de Animais, tabelas 1092, 1093 e 1094 do SIDRA: cabeças abatidas por UF, trimestre e tipo de inspeção (acesso em 01/11/2026)"
    nome_en: "IBGE — Quarterly Survey of Animal Slaughter, SIDRA tables 1092, 1093 and 1094: head slaughtered by state, quarter and type of inspection (accessed 01/11/2026)"
    url: https://sidra.ibge.gov.br/pesquisa/abate/tabelas
    ano: 2026
  - nome: "IBGE — Pesquisa da Pecuária Municipal 2025, tabela 3939 do SIDRA: efetivo dos rebanhos por UF (acesso em 01/11/2026)"
    nome_en: "IBGE — Municipal Livestock Survey 2025, SIDRA table 3939: herd size by state (accessed 01/11/2026)"
    url: https://sidra.ibge.gov.br/tabela/3939
    ano: 2025
  - nome: "MAPA — Serviço de Inspeção Federal (SIGSIF), dados abertos: relatório de abates por ano e UF (acesso em 01/11/2026)"
    nome_en: "MAPA — Federal Inspection Service (SIGSIF), open data: slaughter report by year and state (accessed 01/11/2026)"
    url: https://dados.agricultura.gov.br/dataset/servico-de-inspecao-federal-sif
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
metodo: "Índice = (cabeças abatidas na UF em 2025 ÷ rebanho da UF em 2025) ÷ (o mesmo no Brasil), para bovinos, suínos e frangos (galináceos menos galinhas); abate do IBGE, todos os tipos de inspeção, somando os quatro trimestres. Saldo do SIF = abatidos sob inspeção federal na UF (IBGE) menos abatidos sob SIF vindos da UF (MAPA)."

camadas:
  - { nome: ufs, tipo: poligono, cor: "#8c3f2b", descricao: "27 UFs: abate, rebanho, índice e classe de bovinos, suínos e frangos em 2025; abatidos sob SIF na UF, vindos da UF e saldo, para bovinos e suínos", descricao_en: "27 states: slaughter, herd, index and class for cattle, pigs and chickens in 2025; head slaughtered under federal inspection in the state, coming from the state, and the balance, for cattle and pigs" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Índice de abate sobre rebanho de bovinos em São Paulo, 2025"
    rotulo_en: "Cattle slaughter-to-herd index in São Paulo, 2025"
    valor: 2.5
    unidade: "Brasil = 1"
    nota: "4,77 milhões de bois abatidos, 10,3 milhões no rebanho; no Brasil, 0,18 abatido por cabeça"
    nota_en: "4.77 million cattle slaughtered, 10.3 million in the herd; in Brazil, 0.18 slaughtered per head"
  - tipo: numero
    rotulo: "Suínos de outras UFs abatidos sob SIF no Paraná, 2025"
    rotulo_en: "Pigs from other states slaughtered under federal inspection in Paraná, 2025"
    valor: 792
    unidade: "mil cabeças"
    nota: "o Rio Grande do Sul mandou 616 mil; São Paulo recebeu 428 mil bois"
    nota_en: "Rio Grande do Sul sent out 616 thousand; São Paulo took in 428 thousand cattle"
  - tipo: barras
    rotulo: "Índice de abate sobre rebanho de bovinos, 2025 (Brasil = 1)"
    rotulo_en: "Cattle slaughter-to-herd index, 2025 (Brazil = 1)"
    unidade: "Brasil = 1"
    itens:
      - { rotulo: "São Paulo", valor: 2.53, cor: "#8c3f2b" }
      - { rotulo: "Sergipe", valor: 1.31, cor: "#d9a08a" }
      - { rotulo: "Mato Grosso", valor: 1.26, cor: "#d9a08a" }
      - { rotulo: "Mato Grosso do Sul", valor: 1.19, cor: "#d9a08a" }
      - { rotulo: "Rondônia", valor: 1.15, cor: "#d9a08a" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/abate-br-2026/br_abate_rebanho.gpkg.zip
    rotulo: "UFs com abate, rebanho, índice e saldo do SIF, e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "States with slaughter, herd, index and SIF balance, and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,1 MB"
  - formato: csv
    arquivo: dados/br_abate_rebanho.csv
    rotulo: "As 27 UFs, com abate, rebanho, índice e saldo do SIF por espécie"
    rotulo_en: "The 27 states, with slaughter, herd, index and SIF balance by species"
    tamanho: "3 kB"
  - formato: csv
    arquivo: dados/br_abate_rebanho_brasil.csv
    rotulo: "Abate, rebanho e abatidos por cabeça no Brasil, 2025"
    rotulo_en: "Slaughter, herd and head slaughtered per head of stock in Brazil, 2025"
    tamanho: "0,2 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/abate-br-2026/br_abate_rebanho_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/abate-br-2026/br_abate_rebanho_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "8,9 MB"
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

# Criado aqui, abatido lá: abate sobre rebanho por UF, 2025

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 163, a segunda da coleção **Onde o bicho vira resíduo**. O resíduo do abate fica onde o
animal é abatido, não onde foi criado. Comparar o abate de cada UF com o seu rebanho mostra quem
recebe animais de fora e quem os manda embora.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `ufs` | polígono | 27 UFs: para `bovinos`, `suinos` e `frangos`, `_abate`, `_rebanho`, `_indice` e `_classe` (−1 = inibido); para bovinos e suínos, `_sif_abatido_na_uf`, `_sif_vindo_da_uf` e `_sif_saldo` |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `abate-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/abate-br-2026),
com os **estilos do QGIS** gravados (um estilo por espécie). Os **CSV** ficam nesta pasta, em UTF-8:
o das UFs e o dos totais do Brasil.

## Método

1. Pesquisa Trimestral do Abate de Animais do IBGE (tabelas 1092, 1093 e 1094 do SIDRA, baixadas
   pela API em 01/11/2026): cabeças abatidas por UF e trimestre, no total de tipos de inspeção
   (federal, estadual e municipal). O abate de 2025 é a soma dos quatro trimestres; se algum
   trimestre está inibido («X»), a UF fica sem valor.
2. Pesquisa da Pecuária Municipal 2025 (tabela 3939): efetivo de bovinos, suínos e galináceos por
   UF. Para comparar com o abate de frangos, o rebanho é o de galináceos menos as galinhas
   poedeiras.
3. Índice = (abate ÷ rebanho da UF) ÷ (abate ÷ rebanho do Brasil). No Brasil, em 2025, 0,18 bovino
   foi abatido por cabeça do rebanho, 1,38 suíno e 5,09 frangos. Classes: menos de 0,25; 0,25 a
   0,67; 0,67 a 1,5; 1,5 a 3; 3 ou mais.
4. Conferência pelo SIF: o IBGE dá os abatidos sob inspeção federal nos estabelecimentos de cada UF;
   o relatório de abates do SIGSIF (MAPA) dá os abatidos sob SIF por UF de procedência. A diferença
   é o saldo: positivo, a UF abate animais vindos de fora; negativo, manda animais para fora.

## Leitura

- São Paulo tem o maior índice dos bovinos, 2,53: abateu 4,77 milhões de cabeças em 2025 com um
  rebanho de 10,3 milhões (11,1% do abate do país, 4,4% do rebanho). Pelo SIF, 428 mil dos bois
  abatidos lá vieram de outras UFs, 12% do abate federal paulista. Maranhão (−77 mil), Goiás
  (−65 mil) e Mato Grosso do Sul (−57 mil) são os que mais mandam.
- Depois de São Paulo vêm Sergipe (1,31), Mato Grosso (1,26), Mato Grosso do Sul (1,19) e Rondônia
  (1,15). Na Bahia, no Ceará, no Maranhão, no Piauí, no Rio Grande do Norte, no Rio de Janeiro e em
  Roraima, o índice fica entre 0,25 e 0,67.
- Nos suínos, o Paraná recebeu 792 mil cabeças de fora sob SIF, São Paulo 509 mil e Minas Gerais
  488 mil; o Rio Grande do Sul mandou 616 mil, Santa Catarina 279 mil e Mato Grosso 215 mil.
- Bahia (0,18), Ceará (0,13) e Pernambuco (0,07) têm porcos no rebanho que quase não aparecem no
  abate inspecionado: o abate é sem inspeção ou noutra UF.
- Nos frangos, os maiores índices são de Santa Catarina (1,45), Mato Grosso (1,36), Tocantins (1,32)
  e Goiás (1,31); Maranhão e Piauí ficam abaixo de 0,25.

## Limitações

- O IBGE só conta o abate sob inspeção. Um índice baixo pode ser animal vendido para outra UF ou
  abatido sem inspeção; o mapa não distingue os dois.
- Ficam sem valor as UFs com algum trimestre inibido: AP, DF e PB nos bovinos; AC, AM, AP, PA, RR,
  SE e TO nos suínos; AC, AL, AM, AP, DF, RN, RR e SE nos frangos.
- O rebanho é um estoque em 31/12 e o abate um fluxo do ano; o índice compara os dois só em relação
  à média do país.
- O rebanho de frangos é o de galináceos menos as galinhas, uma aproximação do plantel de corte.
- O dicionário do MAPA não deixa claro se a «UF de procedência» é a da origem do animal; a
  conferência a lê assim. Os dois lados do saldo vêm de pesquisas diferentes e não fecham exatamente.

## Licença dos dados

Dados abertos do IBGE e do MAPA, de uso livre com citação da fonte.
