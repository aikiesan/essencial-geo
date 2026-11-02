---
numero: 159
titulo: "Quem faz composto"
subtitulo: "Só um município em sete trata o lixo orgânico, mas um terço do país mora neles"
data: 2027-02-12
rascunho: true
categoria: energia
colecao: residuo-organico-br
tags: [residuo-organico-br, brasil, residuos-solidos, compostagem, residuos-organicos, munic, saneamento, municipios]

contexto: >-
  Em 2023, 759 dos 5.556 municípios que responderam à MUNIC do IBGE declararam tratar os resíduos orgânicos, por compostagem ou outro processo: um em sete. Como as cidades grandes tratam mais, neles mora 35% da população, 70 milhões de pessoas. Nas 41 cidades com mais de 500 mil habitantes, a parte chega a 59%; nas de 5 mil a 50 mil, fica perto de 12%, abaixo até das menores. O Sul trata em 23% dos municípios, o Nordeste em 9%, e Maranhão, Tocantins e Roraima quase não tratam. Salvador, Curitiba e Goiânia, com 5,6 milhões de moradores, não declararam tratamento algum. Só 480 municípios têm unidade de compostagem no território. Primeira prancha da coleção «O que a prefeitura faz com o resto».

imagem: ./mapa_preview.png
imagem_alt: "Mapa coroplético do Brasil em projeção cônica de Albers com os municípios pintados em quatro classes de tratamento de resíduos orgânicos em 2023: verde-escuro onde a prefeitura trata orgânicos e há unidade de compostagem, verde-claro onde trata sem unidade no município, ocre onde só há a unidade e creme onde não há tratamento. O creme domina o Norte e o Nordeste; as manchas verdes se adensam no Sul, em São Paulo e em Minas Gerais. Uma chamada aponta Salvador, Curitiba e Goiânia, com 5,6 milhões de moradores e nenhum tratamento declarado, e outra o Sul, onde 23% dos municípios tratam orgânicos, contra 9% no Nordeste. No painel, as classes com o número de municípios e a parte da população, barras da parte que trata orgânicos por porte, de 12% nas cidades médias a 59% nas de mais de 500 mil habitantes, e barras por região comparando municípios e população."

recorte: "Brasil"
fontes:
  - nome: "IBGE — Pesquisa de Informações Básicas Municipais (MUNIC) 2023, Suplemento de Saneamento, base de dados (aba Resíduos Sólidos, acesso em 01/11/2026)"
    nome_en: "IBGE — Survey of Basic Municipal Information (MUNIC) 2023, Sanitation Supplement, database (Solid Waste sheet, accessed 01/11/2026)"
    url: https://www.ibge.gov.br/estatisticas/sociais/saude/10586-pesquisa-de-informacoes-basicas-municipais.html
    ano: 2023
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
metodo: "Respostas dos municípios à MUNIC 2023: serviço de tratamento de resíduos orgânicos existente no município (SMRS32) cruzado com unidade de compostagem encontrada no território (SMRS46), em quatro classes; população do Censo 2022 publicada pelo IBGE em 2023."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#3f6b2e", descricao: "5.571 municípios: população, porte, situação na MUNIC, tratamento de orgânicos, unidade de compostagem, coleta seletiva, lixão, aterro sanitário e classe", descricao_en: "5,571 municipalities: population, size band, MUNIC status, organic-waste treatment, composting unit, separate collection, open dump, sanitary landfill and class" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 unidades da federação", descricao_en: "27 states" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Municípios que tratam resíduos orgânicos, 2023"
    rotulo_en: "Municipalities treating organic waste, 2023"
    valor: 759
    unidade: "municípios"
    nota: "13,7% dos 5.556 que responderam; 34,8% da população (70,3 milhões)"
    nota_en: "13.7% of the 5,556 that answered; 34.8% of the population (70.3 million)"
  - tipo: barras
    rotulo: "Parte dos municípios que trata orgânicos, por porte (habitantes)"
    rotulo_en: "Share of municipalities treating organics, by size (inhabitants)"
    unidade: "%"
    itens:
      - { rotulo: "até 5 mil", valor: 14.0, cor: "#3f6b2e" }
      - { rotulo: "5 a 10 mil", valor: 11.6, cor: "#3f6b2e" }
      - { rotulo: "10 a 20 mil", valor: 12.0, cor: "#3f6b2e" }
      - { rotulo: "20 a 50 mil", valor: 11.7, cor: "#3f6b2e" }
      - { rotulo: "50 a 100 mil", valor: 17.5, cor: "#3f6b2e" }
      - { rotulo: "100 a 500 mil", valor: 25.2, cor: "#3f6b2e" }
      - { rotulo: "mais de 500 mil", valor: 58.5, cor: "#3f6b2e" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/residuo-organico-br-2026/br_residuo_organico_tratamento.gpkg.zip
    rotulo: "Municípios, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "9,9 MB"
  - formato: csv
    arquivo: dados/br_residuo_organico_tratamento.csv
    rotulo: "Os 5.571 municípios, sem geometria"
    rotulo_en: "All 5,571 municipalities, without geometry"
    tamanho: "0,8 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/residuo-organico-br-2026/br_residuo_organico_tratamento_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/residuo-organico-br-2026/br_residuo_organico_tratamento_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "6,2 MB"
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

# Quem faz composto: tratamento de resíduos orgânicos nos municípios do Brasil, 2023

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 159, a primeira da coleção **O que a prefeitura faz com o resto**: o que os 5.570
municípios dizem fazer com o lixo, segundo a MUNIC 2023 do IBGE. Começa pela parte que poderia
virar adubo, a orgânica, que é perto da metade do lixo de casa.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 5.571 municípios: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `pop_2022`, `Faixa_pop`, `situacao_munic`, `trata_organicos`, `unidade_compostagem`, `coleta_seletiva`, `vazadouro`, `aterro_sanitario` (respostas da MUNIC, como publicadas), `classe`, `faixa_classe`, `lon`, `lat` |
| `ufs` | polígono | 27 unidades da federação, com a região |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `residuo-organico-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/residuo-organico-br-2026).
A camada `municipios` traz o **estilo do QGIS** da prancha, com as quatro classes. O **CSV** fica
nesta pasta, em UTF-8, com a mesma tabela sem geometria.

## Método

1. Base de dados do Suplemento de Saneamento da MUNIC 2023 (aba «Resíduos Sólidos»), com o
   dicionário da própria planilha. Duas perguntas: se o município tem serviço de **tratamento de
   resíduos orgânicos** (SMRS32, compostagem e afins) e se há **unidade de compostagem de
   resíduos orgânicos** no território (SMRS46).
2. Quatro classes: trata e tem unidade (344 municípios); trata sem unidade no município (415, que
   podem levar o orgânico a uma unidade vizinha ou usar outro processo); só a unidade, sem o
   serviço municipal (136, em geral pátios privados ou de outro município); nenhum dos dois
   (4.661).
3. Ficam em cinza os 14 municípios sem resposta válida (8 sem o serviço de manejo de resíduos, 5
   recusas e 1 sem informação) e Boa Esperança do Norte (MT), criado depois da pesquisa.
4. População: a do Censo 2022, publicada pelo IBGE em 2023 e trazida na própria MUNIC. As partes
   da população somam só os 5.556 municípios que responderam (203,1 milhões de pessoas).

## Leitura

- 759 municípios tratam orgânicos, 13,7% dos que responderam, e neles moram 70,3 milhões de
  pessoas, 34,8% da população.
- A parte cresce com o porte só a partir de 50 mil habitantes: 14,0% até 5 mil, perto de 12% de
  5 mil a 50 mil, 17,5% de 50 mil a 100 mil, 25,2% de 100 mil a 500 mil e 58,5% (24 de 41) acima
  de 500 mil.
- Por região: Sul 22,6% dos municípios, Sudeste 14,9%, Centro-Oeste 10,3%, Norte 9,2% e Nordeste
  8,6%. Paraná (23,5%), Rio Grande do Sul (22,8%) e Santa Catarina (21,0%) lideram entre as UFs
  com muitos municípios; Maranhão (4 de 217), Tocantins (2 de 139) e Roraima (0 de 15) ficam no
  fim.
- As maiores cidades sem tratamento declarado são Salvador (2,42 milhões), Curitiba (1,77
  milhão), Goiânia (1,44 milhão) e Belém (1,30 milhão).
- 146 dos 759 municípios que tratam orgânicos também declaram lixão no território; 85,5% deles
  têm coleta seletiva.

## Limitações

- A MUNIC registra o que a prefeitura declara. Não diz quanto do orgânico é tratado: um município
  com uma horta escolar que faz composto e outro com uma usina de compostagem caem na mesma classe.
- A unidade de compostagem é a «encontrada no município», pública ou privada, e não precisa
  receber o lixo da prefeitura.
- A pesquisa não pergunta pela coleta separada de orgânicos nem pela biodigestão em separado; o
  tratamento de orgânicos é uma resposta só.
- É um retrato de 2023: unidades abertas ou fechadas depois não aparecem.

## Licença dos dados

Dados abertos do IBGE, de uso livre com citação da fonte.
