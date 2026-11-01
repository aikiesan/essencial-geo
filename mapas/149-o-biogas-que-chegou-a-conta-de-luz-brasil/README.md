---
numero: 149
titulo: "O biogás que chegou à conta de luz"
subtitulo: "Pelo ano da última atualização no registro, o biogás sobe até 2020 e quase some depois de 2023"
data: 2027-01-20
rascunho: true
categoria: energia
colecao: gd-biogas-br
tags: [gd-biogas-br, brasil, biogas, geracao-distribuida, difusao, series-temporais, aneel, municipios]

contexto: >-
  O registro de geração distribuída da ANEEL não traz a data de ligação das usinas, só a da última atualização cadastral, que aproxima o ano de entrada. Por essa data, a usina a biogás mais antiga é de 2013: 32 kW da Sanepar em Foz do Iguaçu (PR). Até 2017 eram 66 usinas em 46 municípios, 44 delas em Minas Gerais. O máximo está em 2020, com 95 usinas e 32,1 MW; até ali, o biogás chegava a 150 municípios de 14 UFs. Depois o número cai: 30 usinas em 2024, 14 em 2025 e nenhuma em 2026, ano em que 487 mil usinas solares foram atualizadas até 31/08. Por ano de atualização, o biogás era 4,0% dos kW da geração distribuída em 2016 e 0,11% em 2025.

imagem: ./mapa_preview.png
imagem_alt: "Três mapas pequenos do Brasil em projeção cônica de Albers, com os municípios que têm usina a biogás na geração distribuída, pelo ano da última atualização cadastral: até 2017, até 2020 e até setembro de 2025. Cada município é um círculo proporcional à potência acumulada até o corte, colorido pelo período da atualização mais antiga entre as suas usinas: azul-noite até 2017, azul-médio de 2018 a 2020 e azul-claro de 2021 a 2025. No primeiro mapa, poucos pontos escuros, quase todos em Minas Gerais e no Paraná; no segundo, os azuis médios se espalham por São Paulo, Rio de Janeiro, Espírito Santo, Mato Grosso, Rondônia e Maranhão; no terceiro, os azuis-claros preenchem o oeste do Paraná e de Santa Catarina e chegam à Paraíba e ao Ceará. No quarto quadro, colunas da potência por ano da última atualização cadastral, de 2013 a 2025, divididas por classe de consumo, com o máximo em 2020. No painel, a tabela ano a ano e o ano de atualização mais antigo de cada UF."

recorte: "Brasil"
fontes:
  - nome: "ANEEL — Relação de empreendimentos de geração distribuída (dados abertos, referência 10/2026)"
    nome_en: "ANEEL — List of distributed generation units (open data, reference 10/2026)"
    url: https://dadosabertos.aneel.gov.br/dataset/relacao-de-empreendimentos-de-geracao-distribuida
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
metodo: "Usinas a biogás da geração distribuída datadas pela última atualização cadastral do registro da ANEEL, que aproxima o ano de entrada mas não é a data de ligação; por município, o ano de atualização mais antigo e a potência acumulada até 2017, até 2020 e até a atualização mais recente, em três mapas na mesma escala."

camadas:
  - { nome: municipios, tipo: ponto, cor: "#4f86ad", descricao: "260 municípios: ano e data da atualização cadastral mais antiga, período, número de usinas e potência hoje, até 2017 e até 2020", descricao_en: "260 municipalities: year and date of the earliest registry update, period, number of plants and capacity now, up to 2017 and up to 2020" }
  - { nome: usinas, tipo: ponto, cor: "#1d3b52", descricao: "529 usinas a biogás, no ponto do município, com a data da última atualização cadastral", descricao_en: "529 biogas plants, at the municipality’s point, with date of last registry update" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 unidades da federação", descricao_en: "27 states" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Usinas a biogás com última atualização em 2020, o máximo"
    rotulo_en: "Biogas plants last updated in 2020, the most"
    valor: 95
    unidade: "usinas"
    nota: "32,1 MW; nenhuma usina a biogás atualizada em 2026 (registro até 31/08/2026)"
    nota_en: "32.1 MW; no biogas plant updated in 2026 (register up to 31/08/2026)"
  - tipo: barras
    rotulo: "Potência a biogás por ano da última atualização cadastral"
    rotulo_en: "Biogas capacity by year of last registry update"
    unidade: "MW"
    itens:
      - { rotulo: "2016", rotulo_en: "2016", valor: 3.0, cor: "#1d3b52" }
      - { rotulo: "2017", rotulo_en: "2017", valor: 6.8, cor: "#1d3b52" }
      - { rotulo: "2018", rotulo_en: "2018", valor: 8.3, cor: "#4f86ad" }
      - { rotulo: "2019", rotulo_en: "2019", valor: 16.5, cor: "#4f86ad" }
      - { rotulo: "2020", rotulo_en: "2020", valor: 32.1, cor: "#4f86ad" }
      - { rotulo: "2021", rotulo_en: "2021", valor: 21.2, cor: "#a9cbe0" }
      - { rotulo: "2022", rotulo_en: "2022", valor: 22.3, cor: "#a9cbe0" }
      - { rotulo: "2023", rotulo_en: "2023", valor: 24.0, cor: "#a9cbe0" }
      - { rotulo: "2024", rotulo_en: "2024", valor: 4.9, cor: "#a9cbe0" }
      - { rotulo: "2025", rotulo_en: "2025", valor: 10.8, cor: "#a9cbe0" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/gd-biogas-br-2026/br_gd_biogas_por_ano.gpkg.zip
    rotulo: "Municípios, usinas, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities, plants, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,2 MB"
  - formato: csv
    arquivo: dados/br_gd_biogas_por_ano.csv
    rotulo: "Os 260 municípios, com o ano de atualização mais antigo"
    rotulo_en: "The 260 municipalities, with their earliest update year"
    tamanho: "0,03 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/gd-biogas-br-2026/br_gd_biogas_por_ano_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/gd-biogas-br-2026/br_gd_biogas_por_ano_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "8,9 MB"
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

# O biogás que chegou à conta de luz: a geração distribuída a biogás por ano de atualização, 2013–2025

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 149, a terceira da coleção **O biogás na geração distribuída**. Os três mapas desenham
uma frente de difusão aproximada: cada município entra com a cor do período da atualização
cadastral mais antiga entre as suas usinas, e os círculos crescem com a potência acumulada. A data
do registro não é a de ligação à rede (ver Método).

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | ponto | 260 municípios: `primeiro_ano` e `primeira_atualizacao` (atualização cadastral mais antiga), `periodo` (até 2017, 2018 a 2020, 2021 a 2025), `n_usinas`, `kw_total`, `usinas_ate_2017`, `kw_ate_2017`, `usinas_ate_2020`, `kw_ate_2020` |
| `usinas` | ponto | 529 usinas, com os mesmos campos da prancha 147 (`data_atualizacao` e `ano` da última atualização, `classe`, `kw`…) |
| `ufs` | polígono | 27 unidades da federação |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `gd-biogas-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/gd-biogas-br-2026),
com o **estilo do QGIS** da prancha nas camadas `municipios` e `usinas`. O **CSV** fica nesta
pasta, em UTF-8, com a tabela dos municípios sem geometria.

## Método

1. As 529 usinas a biogás da prancha 147, do registro de geração distribuída da ANEEL (referência
   10/2026; a atualização mais recente do arquivo, de qualquer fonte, é de 31/08/2026).
2. A única data do arquivo é `DthAtualizaCadastralEmpreend`, que o dicionário de dados da ANEEL
   define como a data da última atualização cadastral do empreendimento. Ela aproxima o ano de
   entrada da usina, mas não é a data de ligação: uma usina ligada em 2016 e atualizada em 2024
   conta como 2024.
3. Por município: o ano de atualização mais antigo entre as suas usinas e a potência acumulada até
   o fim de 2017, de 2020 e até a atualização a biogás mais recente (22/09/2025). Os três mapas
   usam a mesma escala de círculos.
4. A parte do biogás em cada ano divide os kW a biogás com última atualização no ano pelos kW de
   todas as fontes com última atualização no mesmo ano.
5. Não havia, nos dados abertos à mão, um retrato anterior do registro nem outra fonte oficial com
   a data de ligação de cada usina; por isso a prancha fica com a data de atualização.

## Limitações

- Atualizações empurram usinas antigas para anos recentes: os primeiros anos podem estar
  subestimados, e os recentes, inflados ou esvaziados conforme os cadastros são revistos. Os
  padrões (subida até 2020, queda depois de 2023) valem como aproximação, não como datas exatas.
- O registro é uma foto de 10/2026: usinas que saíram dele não aparecem.
- Os dados não dizem por que as usinas a biogás quase somem dos anos recentes. A Lei 14.300, de
  janeiro de 2022, mudou as regras de compensação para os pedidos de acesso protocolados a partir
  de janeiro de 2023, mas estes dados não bastam para atribuir a queda a ela.
- Potência instalada não é energia gerada.
- A prancha não estima potencial de biogás.

## Licença dos dados

Dados abertos da ANEEL e do IBGE, de uso livre com citação da fonte.
