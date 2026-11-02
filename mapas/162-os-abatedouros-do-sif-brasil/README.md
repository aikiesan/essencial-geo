---
numero: 162
titulo: "Os abatedouros do SIF"
subtitulo: "O frango e o porco se abatem no Sul; o boi, no Centro-Oeste e na borda da Amazônia"
data: 2027-02-19
rascunho: true
categoria: energia
colecao: abate-br
tags: [abate-br, brasil, abate, abatedouros, frigorificos, sif, residuos-organicos, mapa]

contexto: >-
  O Brasil tem 3.143 estabelecimentos ativos sob o Serviço de Inspeção Federal, e 411 deles são abatedouros, em 329 municípios: 173 de bovinos, 122 de aves, 54 de suínos e os demais de várias ou de outras espécies. O frango e o porco se abatem no Sul, que reúne 69 dos 122 abatedouros de aves e 38 dos 54 de suínos; o boi, no Centro-Oeste e na borda da Amazônia, com Mato Grosso à frente (30 abatedouros), Mato Grosso do Sul (22), Pará e São Paulo (18 cada). Em 2025, passaram pelo SIF 30,4 milhões de bovinos, 48,5 milhões de suínos e 5,72 bilhões de frangos. Cada abate deixa sangue, vísceras, conteúdo ruminal, penas e água de lavagem num ponto só; 196 fábricas de produtos não comestíveis transformam parte disso em sebo e farinhas. Primeira prancha da coleção «Onde o bicho vira resíduo».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers com os estabelecimentos sob inspeção federal: abatedouros como discos coloridos pela espécie (bovinos em vermelho-tijolo, aves em ocre, suínos em rosa, várias espécies em roxo, outras em cinza), agrupados em volta do município, fábricas de produtos não comestíveis como anéis pretos e o resto da cadeia como pontos cinza. Os discos de aves e suínos se adensam no Paraná, em Santa Catarina e no Rio Grande do Sul; os de bovinos se espalham por Mato Grosso, Mato Grosso do Sul, Rondônia e o sul do Pará. Uma chamada aponta o Sul, com 69 dos 122 abatedouros de aves, e outra Mato Grosso, com 30 abatedouros de bovinos. No painel, barras empilhadas de abatedouros por UF e espécie, os animais abatidos sob SIF em 2025 e uma nota sobre o resíduo do abate."

recorte: "Brasil"
fontes:
  - nome: "MAPA — Serviço de Inspeção Federal (SIGSIF), dados abertos: estabelecimentos registrados no SIF e relatório de abates por ano e UF (acesso em 01/11/2026)"
    nome_en: "MAPA — Federal Inspection Service (SIGSIF), open data: establishments registered with the SIF and slaughter report by year and state (accessed 01/11/2026)"
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
metodo: "Cadastro de estabelecimentos do SIGSIF (10/2026) reduzido a uma linha por número de SIF e classificado num grupo pela categoria e classe (abatedouro pela espécie abatida, fábrica de produtos não comestíveis, leite, carne processada, ovos, pescado, mel); cada estabelecimento é posto no ponto interno do seu município. Abatidos sob SIF em 2025 somados do relatório de abates por UF de procedência."

camadas:
  - { nome: estabelecimentos, tipo: ponto, cor: "#8c3f2b", descricao: "3.143 estabelecimentos ativos sob SIF: número do SIF, razão social (em branco quando o cadastro traz CPF), município, UF, grupo, espécies abatidas, áreas e data de registro", descricao_en: "3,143 active plants under federal inspection: SIF number, company name (blank when the registry shows a personal tax number), municipality, state, group, species slaughtered, areas and registration date" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 UFs: estabelecimentos e abatedouros por grupo", descricao_en: "27 states: plants and slaughterhouses by group" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Abatedouros sob inspeção federal, 10/2026"
    rotulo_en: "Slaughterhouses under federal inspection, 10/2026"
    valor: 411
    unidade: "abatedouros"
    nota: "173 de bovinos, 122 de aves, 54 de suínos; em 329 municípios; 3.143 estabelecimentos sob SIF no total"
    nota_en: "173 cattle, 122 poultry, 54 pig plants; in 329 municipalities; 3,143 plants under federal inspection in all"
  - tipo: numero
    rotulo: "Abatedouros de aves no Sul"
    rotulo_en: "Poultry slaughterhouses in the South"
    valor: 57
    unidade: "%"
    nota: "69 dos 122; e 38 dos 54 abatedouros de suínos (70%)"
    nota_en: "69 of 122; and 38 of the 54 pig slaughterhouses (70%)"
  - tipo: barras
    rotulo: "Abatedouros por UF, 10/2026"
    rotulo_en: "Slaughterhouses by state, 10/2026"
    unidade: "abatedouros"
    itens:
      - { rotulo: "Paraná", valor: 63, cor: "#8c3f2b" }
      - { rotulo: "Rio Grande do Sul", valor: 47, cor: "#8c3f2b" }
      - { rotulo: "Minas Gerais", valor: 42, cor: "#8c3f2b" }
      - { rotulo: "São Paulo", valor: 42, cor: "#8c3f2b" }
      - { rotulo: "Santa Catarina", valor: 40, cor: "#8c3f2b" }
      - { rotulo: "Mato Grosso", valor: 40, cor: "#8c3f2b" }
      - { rotulo: "Mato Grosso do Sul", valor: 32, cor: "#8c3f2b" }
      - { rotulo: "outras 12 UFs", valor: 105, cor: "#b9a59a" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/abate-br-2026/br_abate_estabelecimentos_sif.gpkg.zip
    rotulo: "Estabelecimentos sob SIF, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Plants under federal inspection, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,4 MB"
  - formato: csv
    arquivo: dados/br_abate_estabelecimentos_sif.csv
    rotulo: "Os 3.143 estabelecimentos, com grupo, espécies, município e coordenadas"
    rotulo_en: "The 3,143 plants, with group, species, municipality and coordinates"
    tamanho: "345 kB"
  - formato: csv
    arquivo: dados/br_abate_estabelecimentos_sif_abatidos_2025.csv
    rotulo: "Bovinos, suínos e frangos abatidos sob SIF em 2025, por UF de procedência"
    rotulo_en: "Cattle, pigs and chickens slaughtered under federal inspection in 2025, by state of origin"
    tamanho: "1 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/abate-br-2026/br_abate_estabelecimentos_sif_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/abate-br-2026/br_abate_estabelecimentos_sif_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "3,5 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

doi_automatico: false
versao: "1.0.0"
discussoes: []
---

# Os abatedouros do SIF: onde o abate inspecionado acontece

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 162, a primeira da coleção **Onde o bicho vira resíduo**. O abatedouro é uma fonte
pontual: o que o animal deixa de sangue, vísceras, conteúdo ruminal, penas e água de lavagem se
concentra num endereço. Aqui, onde ficam esses endereços sob inspeção federal.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `estabelecimentos` | ponto | 3.143 estabelecimentos: `NR_SIF`, `razao_social`, `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `grupo`, `especies_abate` (códigos de classe do SIGSIF), `areas`, `registro`, `lon`, `lat` |
| `ufs` | polígono | 27 UFs: `abatedouros`, `estabelecimentos` e uma coluna por grupo |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `abate-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/abate-br-2026),
com os **estilos do QGIS** gravados (pontos coloridos pelo grupo). Os **CSV** ficam nesta pasta, em
UTF-8: o dos estabelecimentos sem geometria e o dos animais abatidos sob SIF em 2025 por UF de
procedência.

## Método

1. Dados abertos do SIGSIF (MAPA/DIPOA), baixados em 01/11/2026:
   `sigsifestabelecimentosregistradosnosif.csv` (recurso de 02/10/2026, 36.639 linhas, uma por
   categoria, classe e ocorrência) e `sigsifrelatorioabatesporanouf.csv` (cabeças abatidas sob SIF
   por mês, UF de procedência e categoria).
2. O cadastro foi reduzido a uma linha por número de SIF (3.143, todos com situação ativa). Cada
   estabelecimento entra num só grupo, nesta ordem: abatedouro de bovinos, de aves, de suínos, de
   mais de uma espécie, de outra espécie ou sem a espécie no cadastro (pelas classes de abatedouro),
   fábrica de produtos não comestíveis, carne processada, leite, ovos, pescado e mel.
3. Os municípios do cadastro casam com a Malha Municipal 2025 pelo nome e pela UF; sete grafias
   foram corrigidas à mão. Cada estabelecimento fica no ponto interno do seu município; os
   abatedouros de um mesmo município são arrumados em volta desse ponto.
4. Telefone, e-mail e CPF/CNPJ não são publicados; a razão social fica em branco nos 262
   estabelecimentos registrados por CPF.
5. Abatidos sob SIF em 2025: soma dos meses de 2025 do relatório por UF de procedência, para
   bovinos, suínos e frangos.

## Leitura

- 411 abatedouros em 329 municípios: 173 de bovinos, 122 de aves, 54 de suínos, 26 de mais de uma
  espécie e 36 de outras espécies ou sem a espécie no cadastro.
- O Paraná tem mais abatedouros (63, dos quais 35 de aves), seguido do Rio Grande do Sul (47), de
  Minas Gerais e São Paulo (42 cada), Santa Catarina e Mato Grosso (40 cada).
- O Sul reúne 69 dos 122 abatedouros de aves (57%) e 38 dos 54 de suínos (70%).
- Os abatedouros de bovinos ficam em Mato Grosso (30), Mato Grosso do Sul (22), Pará e São Paulo
  (18 cada), Goiás (17) e Rondônia (14). Várzea Grande (MT) tem 5 abatedouros; Chapecó (SC),
  Xinguara (PA) e Araguaína (TO), 4 cada.
- As 196 fábricas de produtos não comestíveis (graxarias: sebo, farinhas de carne, osso, sangue e
  penas) seguem os abatedouros: São Paulo 32, Paraná 23, Goiás e Rio Grande do Sul 20 cada.
- Em 2025, passaram pelo SIF 30,4 milhões de bovinos, 48,5 milhões de suínos e 5,72 bilhões de
  frangos.

## Limitações

- Só o abate sob inspeção federal. Os abatedouros com inspeção estadual (SIE) ou municipal (SIM)
  não estão no cadastro do SIGSIF.
- O cadastro não traz capacidade nem volume abatido por estabelecimento: um disco é um abatedouro,
  qualquer que seja o tamanho. 28 abatedouros não têm a espécie no cadastro.
- A posição é a do município, não a do endereço.
- O dicionário do MAPA não deixa claro se a «UF de procedência» do relatório de abates é a da
  origem do animal ou a do estabelecimento; a conferência da prancha 163 a lê como origem.
- O resíduo do abate é descrito só de forma qualitativa; a prancha não estima volumes nem
  aproveitamento energético.

## Licença dos dados

Dados abertos do MAPA e do IBGE, de uso livre com citação da fonte.
