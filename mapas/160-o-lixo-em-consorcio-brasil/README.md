---
numero: 160
titulo: "O lixo em consórcio"
subtitulo: "Um município em seis divide o lixo com os vizinhos, e tem lixão com metade da frequência"
data: 2027-02-15
rascunho: true
categoria: energia
colecao: residuo-organico-br
tags: [residuo-organico-br, brasil, residuos-solidos, consorcios-publicos, regionalizacao, lixao, munic, saneamento, municipios]

contexto: >-
  Em 2023, 858 dos 5.556 municípios que responderam à MUNIC do IBGE cuidavam do lixo por consórcio público, 15% do total; outros 372 usavam outro arranjo regional, e 4.326 se viravam sozinhos. O consórcio é coisa de cidade pequena: a mediana dos consorciados tem 11 mil habitantes, e eles somam só 9,7% da população. Em Rondônia, 73% dos municípios estão em consórcio; em Alagoas e Sergipe, 63%. No Maranhão, nenhum dos 217, nem no Amazonas, no Acre, no Amapá e em Roraima. O que mais se divide é o destino final, em 73% dos casos; os orgânicos, em 10%. E os consorciados têm menos lixão: 20% declaram um no território, contra 37% dos que estão sós, e a diferença se mantém nas cidades de até 20 mil habitantes (18% e 38%). Segunda prancha da coleção «O que a prefeitura faz com o resto».

imagem: ./mapa_preview.png
imagem_alt: "Mapa coroplético do Brasil em projeção cônica de Albers com os municípios em três classes de gestão dos resíduos sólidos em 2023: azul-escuro para consórcio público, azul-claro para outro arranjo regional e creme para quem cuida do lixo sozinho. Manchas contínuas de azul-escuro cobrem Rondônia, Alagoas, Sergipe e boa parte do Ceará, e há muitos consórcios espalhados por Minas Gerais e pelo Sul; o Norte e o Maranhão ficam quase todos em creme. Uma chamada aponta Rondônia, com 38 de 52 municípios em consórcio, e outra o Maranhão, sem nenhum. No painel, as classes com o número de municípios e a parte da população, barras da parte dos municípios em consórcio em cada UF e barras pareadas da parte com lixão por porte, comparando consorciados e municípios sozinhos."

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
metodo: "Respostas dos municípios à MUNIC 2023: prestação regionalizada do manejo de resíduos sólidos (SMRS65) e, nela, consórcio público (SMRS6515), em três classes; serviços regionalizados (SMRS671 a SMRS6711) e vazadouro a céu aberto no território (SMRS42 e SMRS43), comparados por porte."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#2f4f6f", descricao: "5.571 municípios: população, porte, situação na MUNIC, arranjo regional (consórcio, região metropolitana, unidade regional, bloco, compartilhamento), serviços divididos, lixão, aterro sanitário e classe", descricao_en: "5,571 municipalities: population, size band, MUNIC status, regional arrangement (consortium, metropolitan region, regional unit, block, shared equipment), shared services, open dump, sanitary landfill and class" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 UFs: municípios que responderam, em consórcio e a parte em consórcio", descricao_en: "27 states: responding municipalities, those in a consortium and the share" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Municípios em consórcio público de resíduos, 2023"
    rotulo_en: "Municipalities in a public waste consortium, 2023"
    valor: 858
    unidade: "municípios"
    nota: "15,4% dos 5.556 que responderam; 9,7% da população"
    nota_en: "15.4% of the 5,556 that answered; 9.7% of the population"
  - tipo: barras
    rotulo: "Municípios com lixão no território, por arranjo"
    rotulo_en: "Municipalities with an open dump on their land, by arrangement"
    unidade: "%"
    itens:
      - { rotulo: "consórcio público", valor: 20.5, cor: "#2f4f6f" }
      - { rotulo: "outro arranjo regional", valor: 15.9, cor: "#8fb0c9" }
      - { rotulo: "sozinho", valor: 37.2, cor: "#b5643a" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/residuo-organico-br-2026/br_residuos_consorcio.gpkg.zip
    rotulo: "Municípios, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "10,0 MB"
  - formato: csv
    arquivo: dados/br_residuos_consorcio.csv
    rotulo: "Os 5.571 municípios, sem geometria"
    rotulo_en: "All 5,571 municipalities, without geometry"
    tamanho: "0,9 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/residuo-organico-br-2026/br_residuos_consorcio_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/residuo-organico-br-2026/br_residuos_consorcio_prancha.en.svg
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

# O lixo em consórcio: gestão regionalizada dos resíduos nos municípios do Brasil, 2023

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 160, a segunda da coleção **O que a prefeitura faz com o resto**. Um aterro sanitário
custa caro para uma cidade de 10 mil habitantes; o consórcio público é o jeito de dividir a conta
com os vizinhos. Quem faz isso, e se faz diferença.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 5.571 municípios: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `pop_2022`, `Faixa_pop`, `situacao_munic`, `regionalizado`, `consorcio`, `reg_metropolitana`, `reg_unidade_regional`, `reg_bloco`, `reg_compartilhamento`, `cons_coleta`, `cons_seletiva`, `cons_organicos`, `cons_transbordo`, `cons_disposicao`, `vazadouro`, `vazadouro_alagavel`, `aterro_sanitario` (respostas da MUNIC, como publicadas), `classe`, `arranjo`, `lon`, `lat` |
| `ufs` | polígono | 27 UFs: `municipios`, `em_consorcio`, `em_consorcio_pct` |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `residuo-organico-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/residuo-organico-br-2026).
A camada `municipios` traz o **estilo do QGIS** da prancha, com as três classes. O **CSV** fica
nesta pasta, em UTF-8, com a mesma tabela sem geometria.

## Método

1. Base de dados do Suplemento de Saneamento da MUNIC 2023 (aba «Resíduos Sólidos»). Pergunta
   central: se o município «se insere em estrutura de prestação regionalizada» do manejo de
   resíduos (SMRS65) e, se sim, de que tipo (SMRS6511 a SMRS6518), com o consórcio público em
   SMRS6515.
2. Três classes: consórcio público (858 municípios, com ou sem outro arranjo junto); outro arranjo
   regional sem consórcio, como região metropolitana, unidade regional ou uso compartilhado de
   equipamento (372); e quem cuida do lixo sozinho (4.326). Em cinza, os 14 sem resposta válida e
   Boa Esperança do Norte (MT), criado depois da pesquisa.
3. **Lixão**: vazadouro a céu aberto encontrado no território, em área seca ou alagável (SMRS42 ou
   SMRS43). O bota-fora, em geral de entulho, fica de fora.
4. Como o consórcio reúne cidades pequenas, a comparação do lixão é feita também por porte, com as
   faixas de população da própria MUNIC (Censo 2022).

## Leitura

- 858 municípios estão em consórcio público de resíduos, 15,4% dos 5.556 que responderam, com 19,6
  milhões de moradores (9,7% da população). A mediana do consorciado tem 11.171 habitantes; o
  maior é Santo André (SP), com 749 mil.
- Por UF: Rondônia 73% (38 de 52), Alagoas e Sergipe 63%, Ceará 38%, Minas Gerais 24% (201
  municípios, o maior número). Nenhum no Maranhão, no Amazonas, no Acre, no Amapá e em Roraima.
- O que os consorciados dividem: o destino final no solo (72,5%), a coleta convencional (44,6%), o
  transporte e transbordo (33,2%), a coleta seletiva (22,5%) e o tratamento de orgânicos (9,6%).
- Lixão no território: 20,5% dos consorciados, 15,9% dos que têm outro arranjo regional e 37,2% dos
  que estão sós. Nas cidades de até 20 mil habitantes, 18,5% contra 37,8%; de 20 mil a 50 mil, 26%
  contra 43%.

## Limitações

- A MUNIC não identifica o consórcio. Não dá para desenhar quem está com quem nem ligar os
  municípios de um mesmo consórcio; o mapa mostra a adesão, não o grupo.
- Comparar não é provar causa: o consórcio pode reduzir o lixão, ou os municípios que já tinham
  aterro podem ter entrado mais nos consórcios.
- O lixão é o que a prefeitura declara existir no território, inclusive áreas antigas ainda não
  recuperadas; não é necessariamente o destino do lixo do próprio município em 2023.
- Retrato de 2023: consórcios criados ou desfeitos depois não aparecem.

## Licença dos dados

Dados abertos do IBGE, de uso livre com citação da fonte.
