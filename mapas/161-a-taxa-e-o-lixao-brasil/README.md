---
numero: 161
titulo: "A taxa e o lixão"
subtitulo: "Onde ninguém paga pelo lixo, metade dos municípios tem lixão"
data: 2027-02-17
rascunho: true
categoria: energia
colecao: residuo-organico-br
tags: [residuo-organico-br, brasil, residuos-solidos, lixao, taxa-do-lixo, cobranca, munic, saneamento, municipios]

contexto: >-
  Em 2023, 2.353 dos 5.556 municípios que responderam à MUNIC do IBGE cobravam pelo manejo do lixo, por taxa ou tarifa, e 1.844 declaravam ter lixão no território. As duas coisas andam em sentido oposto: 48% dos que não cobram têm lixão, contra 13% dos que cobram. O mapa se parte em dois: no Norte, 298 dos 448 municípios não cobram e têm lixão; no Sul, 936 de 1.186 cobram e não têm. Há 305 municípios que cobram e ainda assim declaram lixão, com 10,2 milhões de moradores; o maior é Duque de Caxias (RJ). E cobrar não fecha a conta: só 19% das cobranças pagaram o custo do serviço em 2022. Entre os que não cobram, 72% dizem que falta lei municipal, e 42% citam a resistência da população. Terceira e última prancha da coleção «O que a prefeitura faz com o resto».

imagem: ./mapa_preview.png
imagem_alt: "Mapa coroplético bivariado do Brasil em projeção cônica de Albers, com os municípios em quatro combinações de cobrança pelo lixo e lixão no território em 2023: creme para sem taxa e sem lixão, verde-azulado para quem cobra e não tem lixão, laranja-terroso para quem não cobra e tem lixão e vinho para quem cobra e tem lixão. O laranja cobre quase todo o Norte e boa parte do Nordeste; o verde-azulado domina o Sul, São Paulo e o sul de Minas Gerais; manchas cor de vinho aparecem em Mato Grosso, Rondônia, no Pará e em Mato Grosso do Sul. Uma chamada aponta Duque de Caxias (RJ), a maior cidade que cobra e declara lixão, e outra o Norte, onde 298 de 448 municípios não cobram e têm lixão. No painel, uma matriz dois por dois com o número de municípios e a parte da população em cada combinação, barras empilhadas por região e barras dos motivos para não cobrar."

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
metodo: "Respostas dos municípios à MUNIC 2023: cobrança pelo serviço de limpeza urbana e manejo de resíduos sólidos (SMRS75) cruzada com vazadouro a céu aberto no território, em área seca ou alagável (SMRS42 ou SMRS43), em quatro combinações; cobertura dos custos em 2022 (SMRS752) e motivos para não cobrar (SMRS761 a SMRS763)."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#6b3348", descricao: "5.571 municípios: população, porte, situação na MUNIC, cobrança, instrumento, cobertura dos custos, lixão, bota-fora, aterros, motivos para não cobrar e combinação", descricao_en: "5,571 municipalities: population, size band, MUNIC status, fee, legal instrument, cost coverage, open dump, rubble tip, landfills, reasons for not charging and combination" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 unidades da federação", descricao_en: "27 states" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Municípios que cobram pelo lixo e têm lixão, 2023"
    rotulo_en: "Municipalities that charge for waste and have an open dump, 2023"
    valor: 305
    unidade: "municípios"
    nota: "10,2 milhões de moradores; 1.539 não cobram e têm lixão"
    nota_en: "10.2 million residents; 1,539 charge nothing and have a dump"
  - tipo: barras
    rotulo: "Municípios com lixão no território"
    rotulo_en: "Municipalities with an open dump on their land"
    unidade: "%"
    itens:
      - { rotulo: "não cobram pelo lixo", valor: 48.0, cor: "#d39a6a" }
      - { rotulo: "cobram pelo lixo", valor: 13.0, cor: "#7fa3a6" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/residuo-organico-br-2026/br_residuos_taxa_lixao.gpkg.zip
    rotulo: "Municípios, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "10,0 MB"
  - formato: csv
    arquivo: dados/br_residuos_taxa_lixao.csv
    rotulo: "Os 5.571 municípios, sem geometria"
    rotulo_en: "All 5,571 municipalities, without geometry"
    tamanho: "0,9 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/residuo-organico-br-2026/br_residuos_taxa_lixao_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/residuo-organico-br-2026/br_residuos_taxa_lixao_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "6,2 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,4 MB"

doi_automatico: false
versao: "1.0.0"
discussoes: []
---

# A taxa e o lixão: cobrança pelo lixo e vazadouros a céu aberto nos municípios do Brasil, 2023

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 161, a terceira e última da coleção **O que a prefeitura faz com o resto**. Aterro
sanitário custa dinheiro, e a lei do saneamento (Lei 14.026/2020) manda cobrar pelo serviço. O mapa
cruza as duas respostas: a prefeitura cobra? tem lixão?

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 5.571 municípios: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `pop_2022`, `Faixa_pop`, `situacao_munic`, `cobranca`, `cobranca_instrumento`, `cobranca_cobre_custos`, `vazadouro`, `vazadouro_alagavel`, `bota_fora`, `aterro_controlado`, `aterro_sanitario`, `nao_cobra_resistencia`, `nao_cobra_parametros`, `nao_cobra_lei` (respostas da MUNIC, como publicadas), `classe`, `combinacao`, `lon`, `lat` |
| `ufs` | polígono | 27 unidades da federação, com a região |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `residuo-organico-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/residuo-organico-br-2026).
A camada `municipios` traz o **estilo do QGIS** da prancha, com as quatro combinações. O **CSV**
fica nesta pasta, em UTF-8, com a mesma tabela sem geometria.

## Método

1. Base de dados do Suplemento de Saneamento da MUNIC 2023 (aba «Resíduos Sólidos»).
   **Cobrança**: «cobrança pelo serviço de limpeza urbana e manejo de resíduos sólidos –
   existência» (SMRS75), por taxa, tarifa ou outro meio, com ou sem lei própria (SMRS751).
   **Lixão**: vazadouro a céu aberto encontrado no território, em área seca ou alagável (SMRS42 ou
   SMRS43). O bota-fora (SMRS41), em geral de entulho, e o aterro controlado (SMRS44) ficam de fora.
2. Quatro combinações, num mapa bivariado: sem taxa e sem lixão (1.664 municípios), cobra e não tem
   lixão (2.048), não cobra e tem lixão (1.539), cobra e tem lixão (305). Em cinza, os 14 sem
   resposta válida e Boa Esperança do Norte (MT), criado depois da pesquisa.
3. Cobertura dos custos: «valor arrecadado cobriu o total dos custos em 2022» (SMRS752), entre os
   que cobram. Motivos para não cobrar (SMRS761 a SMRS763): mais de um por município.

## Leitura

- 2.353 municípios cobram pelo lixo (42,4% dos que responderam, com 57,4% da população); 1.844 têm
  lixão no território (33,2%), com 39,6 milhões de moradores.
- Têm lixão 48,0% dos que não cobram e 13,0% dos que cobram.
- Por região, a parte que não cobra e tem lixão: Norte 66,5% (298 de 448), Nordeste 50,0%,
  Centro-Oeste 38,8%, Sudeste 8,4% e Sul 2,0%. A parte que cobra e não tem: Sul 78,9% (936 de
  1.186), Sudeste 47,6%.
- 305 municípios cobram e têm lixão, com 10,2 milhões de moradores. Os maiores: Duque de Caxias
  (RJ, 808 mil), Belford Roxo (RJ), Santos (SP), Mauá (SP) e Petrópolis (RJ). Por UF, Minas Gerais
  (53), Mato Grosso (38, de 140) e Paraná (34) têm mais casos; em Mato Grosso, mais de um em cada quatro
  municípios.
- Só 437 das 2.353 cobranças (18,6%) pagaram todo o custo em 2022; 1.799 têm lei específica.
- Dos 3.203 que não cobram, 72,3% dizem que falta lei municipal, 42,5% citam a resistência da
  população e 35,1% a falta de dados para fixar o valor.

## Limitações

- O lixão é o «encontrado no município», segundo a prefeitura: pode ser uma área antiga, desativada
  e não recuperada, ou receber o lixo de outro município. Duque de Caxias, por exemplo, abriga o
  antigo aterro de Jardim Gramacho, fechado em 2012.
- A MUNIC não diz quanto se cobra nem quanto lixo vai para o lixão; a classe é sim ou não.
- O cruzamento mostra uma associação, não uma causa: a renda e o porte do município pesam nas duas
  coisas.
- Retrato de 2023: o prazo legal para fechar os lixões venceu em 2024, depois da pesquisa.

## Licença dos dados

Dados abertos do IBGE, de uso livre com citação da fonte.
