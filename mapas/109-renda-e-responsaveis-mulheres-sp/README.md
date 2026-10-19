---
numero: 109
titulo: "Onde elas ganham mais perto deles"
subtitulo: "Onde a renda das mulheres chega mais perto da dos homens, há mais casas com responsável mulher"
data: 2027-01-08
categoria: censo-renda
colecao: mulheres-responsaveis-sp
tags: [mulheres-responsaveis-sp, sao-paulo, censo-2022, renda, genero, bivariado, municipios]

contexto: >-
  Onde a renda média das mulheres de 14 anos ou mais chega mais perto da dos homens, há mais casas com responsável mulher: correlação de postos de 0,25 nos 645 municípios e 0,35 descontadas urbanização e densidade, a relação mais firme da coleção. Em 98 municípios os dois estão no terço de cima. Em Lucélia, as mulheres ganham 87% do que ganham os homens e 49% das casas têm responsável mulher; em Pilar do Sul, 51% e 39%. No município mediano, elas ganham 63%. A razão vem da amostra e compara todas as mulheres com todos os homens, não as responsáveis: o Censo 2022 não publica renda por sexo do responsável no município. Sétima prancha da coleção «Mulheres responsáveis pelo domicílio».

imagem: ./mapa_preview.png
imagem_alt: "Mapa bivariado dos municípios de São Paulo em nove cores, de uma grade de três por três: o lilás cresce no eixo da parte de domicílios com responsável mulher e o ocre, no da razão entre a renda média das mulheres e a dos homens; o marrom-escuro marca os 98 municípios no terço de cima dos dois, frequentes no litoral, na metrópole e no oeste. Chamadas apontam Lucélia, com 87% e 49% de responsáveis mulheres, e Pilar do Sul, com 51% e 39%. No painel, a grade com o número de municípios em cada casa, os limites dos terços e a tabela das correlações."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022, SIDRA tabela 10299 (rendimento médio das pessoas de 14 anos ou mais por sexo, amostra)"
    nome_en: "IBGE — 2022 Population Census, SIDRA table 10299 (mean income of people aged 14 or over by sex, sample)"
    url: https://sidra.ibge.gov.br/tabela/10299
    ano: 2022
  - nome: "IBGE — Censo Demográfico 2022: agregados por setores censitários (domicílio, parte 2; renda do responsável)"
    nome_en: "IBGE — 2022 Population Census: aggregates by census tract (households, part 2; income of the responsible person)"
    url: https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Parte de domicílios com responsável mulher (setores do Censo 2022, universo) e razão entre o rendimento médio das mulheres e o dos homens de 14 anos ou mais (SIDRA 10299, amostra), por município, cada uma dividida em terços; o cruzamento dá nove classes. Correlação de postos de Spearman, parcial, amostra efetiva corrigida pela autocorrelação espacial e LISA bivariado."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#804d36", descricao: "645 municípios com as variáveis das oito pranchas, a classe bivariada b109 e os aglomerados LISA lisa103 e lisa109", descricao_en: "645 municipalities with the variables of all eight plates, the bivariate class b109 and the LISA clusters lisa103 and lisa109" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Correlação de postos entre responsáveis mulheres e razão de renda"
    rotulo_en: "Rank correlation between women responsible and the income ratio"
    valor: 0.25
    nota: "parcial 0,35"
    nota_en: "partial 0.35"
  - tipo: numero
    rotulo: "Municípios no terço de cima dos dois"
    rotulo_en: "Municipalities in the top third of both"
    valor: 98
    unidade: "municípios"
    unidade_en: "municipalities"
  - tipo: numero
    rotulo: "Renda das mulheres sobre a dos homens, no município mediano"
    rotulo_en: "Women’s income as a share of men’s, in the median municipality"
    valor: 63
    unidade: "%"
    unidade_en: "%"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/mulheres-responsaveis-sp-2026/sp_mulheres_responsaveis_2022.gpkg.zip
    rotulo: "Municípios e áreas de ponderação com as variáveis das oito pranchas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities and weighting areas with the variables of all eight plates, SIRGAS 2000, with QGIS styles"
    tamanho: "11,8 MB"
  - formato: csv
    arquivo: dados/sp_mulheres_responsaveis_municipios_2022.csv
    rotulo: "Tabela dos municípios"
    rotulo_en: "Municipal table"
    tamanho: "230 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/mulheres-responsaveis-sp-2026/sp_responsaveis_mulheres_e_renda_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/mulheres-responsaveis-sp-2026/sp_responsaveis_mulheres_e_renda_2022_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,2 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

versao: "1.0.0"
discussoes: []
---

# Responsáveis mulheres e a razão de renda entre mulheres e homens nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 109, a sétima de oito da coleção **Mulheres responsáveis pelo domicílio**; a anterior é a [prancha 108](../108-luz-na-rua-sp/README.md); a seguinte, a [prancha 110](../110-na-mesma-rua-sp/README.md).

A coleção cruza a parte de domicílios com responsável mulher com os serviços da casa e da rua e com
a renda, nos 645 municípios de São Paulo. Antes dos mapas vieram os testes: correlação de postos
bruta e parcial (descontadas urbanização, densidade e renda), amostra efetiva corrigida pela
autocorrelação espacial, valores q de Benjamini–Hochberg, I de Moran, LISA, e a comparação entre
municípios e áreas de ponderação. A maior parte das relações com os serviços some quando se desconta
a urbanização: responsáveis mulheres são mais comuns nas cidades, e as cidades têm mais rede. As
relações fracas também viram mapa, como retrato descritivo, e o texto diz que são fracas.

As chamadas do mapa apontam Lucélia, onde as mulheres ganham 87% da renda dos homens e 49% das casas
têm responsável mulher (terço de cima nos dois), e Pilar do Sul, com 51% e 39% (terço de baixo nos
dois).

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios com as variáveis das oito pranchas: parte de responsáveis mulheres em 2010 e 2022, composição das casas, água, esgoto, lixo, banheiro e água encanada por sexo do responsável, iluminação pública, renda por sexo, `b109`, `lisa103` e `lisa109` |
| `apond` | polígono | 2.520 áreas de ponderação com a parte de responsáveis mulheres, urbanização, renda dos responsáveis e as diferenças de água e esgoto |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

O **GPKG** é o mesmo nas oito pranchas e traz um estilo do QGIS para cada uma. O **CSV** tem a
tabela dos municípios, sem geometria. Nas colunas, `_lo` e `_hi` são os limites do sigilo; os
aglomerados LISA vêm como `AA` (alto-alto), `BB` (baixo-baixo), `AB`, `BA` e `ns` (não
significativo).

## Método

1. `pct_resp_mulher`: domicílios com pessoa responsável mulher sobre o total (setores do Censo 2022,
   universo).
2. `renda_mulheres`, `renda_homens` e `razao_renda_sexo`: rendimento nominal médio mensal das
   pessoas de 14 anos ou mais, mulheres e homens (SIDRA 10299, amostra), e a razão entre os dois, em %.
3. Terços dos 645 municípios, fechados à direita: responsáveis mulheres até 43%, 43% a 48% e mais de
   48%; razão de renda até 61%, 61% a 66% e mais de 66%. A classe `b109` junta os dois (11 a 33: dezena
   = terço de responsáveis mulheres, unidade = terço da razão de renda): 98 municípios no terço de cima
   dos dois e 97 no de baixo dos dois.
4. Parte de responsáveis mulheres × razão de renda: correlação de postos de Spearman 0,25 (645
   municípios), parcial 0,35, amostra efetiva 624, p < 0,001; controles só urbanização e densidade,
   porque a renda é a própria variável.
5. Moran bivariado 0,05 (p = 0,022) e LISA bivariado sobre os postos padronizados, 6 vizinhos, 999
   permutações (semente 20261019), p < 0,05: 45 municípios alto-alto e 49 baixo-baixo (`lisa109`).
6. Pares de apoio: responsáveis mulheres × renda média do responsável: correlação de postos de
   Spearman 0,02 (645 municípios), parcial −0,18, amostra efetiva 579, p = 0,681; nas áreas de
   ponderação, −0,03 (parcial −0,24); responsáveis mulheres × renda das mulheres: correlação de postos
   de Spearman 0,10 (645 municípios), parcial 0,16, amostra efetiva 593, p = 0,014.
7. Correlação parcial: correlação entre os resíduos dos postos de cada variável regredidos nos
   postos dos controles, que são urbanização (parte de moradores em situação urbana), log da densidade
   demográfica e log da renda média dos responsáveis; sai o controle da mesma família da variável.
   Amostra efetiva sob autocorrelação espacial: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), com Iₓ e Iᵧ o I de Moran dos
   resíduos numa vizinhança dos 6 vizinhos mais próximos; valores q de Benjamini–Hochberg sobre todos
   os testes da coleção.

## Limitações

- O Censo 2022 não publica, por município, a renda por sexo do responsável. A razão compara todas as
  mulheres com todos os homens de 14 anos ou mais; diz como a renda se divide entre os sexos no lugar,
  não quanto ganham as responsáveis.
- A razão vem da amostra do Censo 2022: são estimativas expandidas pelo IBGE, com erro amostral que
  cresce quanto menor o município. Em município pequeno ela oscila muito (o máximo, 242% em Balbinos,
  é quase certamente ruído); por isso a prancha usa terços, e não classes finas.
- O rendimento médio das tabelas da amostra pode mudar conforme a inclusão de quem não tem renda; a
  nota da tabela 10299 não pôde ser conferida, e a razão usa o mesmo critério para os dois sexos.
- Descontada a urbanização, onde há mais responsáveis mulheres a renda média dos responsáveis é um
  pouco menor (parcial −0,18); a relação desta prancha é com a distância entre os sexos, não com o
  nível de renda.
- Leitura ecológica: o mapa compara lugares, não pessoas. Uma correlação entre municípios não diz
  que as mesmas casas têm as duas características, nem que uma causa a outra; urbanização, renda e
  idade podem estar por trás das duas.
- Os terços são relativos aos municípios paulistas: o terço de baixo de São Paulo pode estar acima
  da média de outros estados.
