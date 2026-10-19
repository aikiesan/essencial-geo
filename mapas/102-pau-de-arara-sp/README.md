---
numero: 102
titulo: "O pau de arara"
subtitulo: "Ir trabalhar na carroceria ainda é coisa do campo e de quem estudou menos"
data: 2027-01-01
categoria: censo-renda
colecao: censo-cruzado-sp
tags: [censo-cruzado-sp, sao-paulo, censo-2022, mobilidade, trabalho-rural, deslocamento, escolaridade, municipios]

contexto: >-
  Ir trabalhar na carroceria de caminhonete ou caminhão adaptado, o pau de arara, ainda é coisa do campo e de quem estudou menos. Em 135 municípios paulistas, 1% ou mais dos ocupados que se deslocam ao trabalho vão assim (Censo 2022, amostra); em 32, a amostra não achou nenhum. Herculândia tem a maior taxa entre os municípios de 5 mil habitantes ou mais: 4,8%. A correlação de postos com a parte dos adultos sem fundamental completo é 0,41 (0,27 descontadas urbanização, densidade e renda) e, com o emprego formal na bioeconomia, 0,38. São poucas pessoas e dado de amostra: o mapa usa classes largas e se lê como padrão entre municípios. Décima e última prancha da coleção «O Censo cruzado».

imagem: ./mapa_preview.png
imagem_alt: "Mapa coroplético dos municípios de São Paulo em seis tons de bege a marrom, da parte dos ocupados que vão ao trabalho de pau de arara: zero, até 0,25%, 0,25 a 0,5%, 0,5 a 1%, 1 a 2% e mais de 2%. Os tons escuros se espalham pelo oeste e pelo sul do estado; a capital e o litoral ficam claros. Uma chamada aponta Herculândia, com 4,8% dos ocupados indo ao trabalho de pau de arara, a maior taxa entre os municípios de 5 mil habitantes ou mais. No painel, a legenda com o número de municípios em cada classe e barras com a média por terço de escolaridade, de área com cana e de emprego na bioeconomia."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022, SIDRA tabela 10332 (deslocamento para o trabalho por meio de transporte, amostra)"
    nome_en: "IBGE — 2022 Population Census, SIDRA table 10332 (commuting by means of transport, sample)"
    url: https://sidra.ibge.gov.br/tabela/10332
    ano: 2022
  - nome: "IBGE — Censo Demográfico 2022, SIDRA tabela 10061 (nível de instrução, amostra)"
    nome_en: "IBGE — 2022 Population Census, SIDRA table 10061 (educational attainment, sample)"
    url: https://sidra.ibge.gov.br/tabela/10061
    ano: 2022
  - nome: "MTE/PDET — RAIS 2025: vínculos ativos em 31/12 (bioeconomia, como na prancha 076)"
    nome_en: "MTE/PDET — RAIS 2025: active jobs on 31/12 (bioeconomy, as on plate 076)"
    url: https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/microdados-rais-e-caged
    ano: 2025
  - nome: "MapBiomas — Coleção 10 da Série Anual de Mapas de Uso e Cobertura da Terra do Brasil, 2024"
    nome_en: "MapBiomas — Collection 10 of the Annual Series of Land Use and Land Cover Maps of Brazil, 2024"
    url: https://brasil.mapbiomas.org/colecoes-mapbiomas/
    ano: 2024
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Ocupados que vão ao trabalho de caminhonete ou caminhão adaptado sobre os que se deslocam para trabalhar (Censo 2022, amostra), em seis classes largas; médias por terço de escolaridade, cana e bioeconomia, e correlações de postos de Spearman."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#b3834a", descricao: "645 municípios com as variáveis das dez pranchas, as classes bivariadas (b093 a b101) e os aglomerados LISA (lisa093 a lisa102)", descricao_en: "645 municipalities with the variables of all ten plates, the bivariate classes (b093 to b101) and the LISA clusters (lisa093 to lisa102)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Municípios com 1% ou mais dos ocupados no pau de arara"
    rotulo_en: "Municipalities with 1% or more of workers in open trucks"
    valor: 135
    unidade: "municípios"
    unidade_en: "municipalities"
  - tipo: numero
    rotulo: "Correlação de postos com a falta de fundamental completo"
    rotulo_en: "Rank correlation with no completed primary schooling"
    valor: 0.41
    nota: "parcial 0,27"
    nota_en: "partial 0.27"
  - tipo: numero
    rotulo: "Ocupados que vão de pau de arara em Herculândia"
    rotulo_en: "Workers riding open trucks in Herculândia"
    valor: 4.8
    unidade: "%"
    unidade_en: "%"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/censo-cruzado-sp-2026/sp_censo_cruzado_2022.gpkg.zip
    rotulo: "Municípios e áreas de ponderação com as variáveis das dez pranchas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities and weighting areas with the variables of all ten plates, SIRGAS 2000, with QGIS styles"
    tamanho: "14,9 MB"
  - formato: csv
    arquivo: dados/sp_censo_cruzado_municipios_2022.csv
    rotulo: "Tabela dos municípios"
    rotulo_en: "Municipal table"
    tamanho: "190 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/censo-cruzado-sp-2026/sp_pau_de_arara_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/censo-cruzado-sp-2026/sp_pau_de_arara_2022_prancha.en.svg
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

# Deslocamento ao trabalho em caminhonete ou caminhão adaptado nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 102, a décima de dez da coleção **O Censo cruzado**; a anterior é a [prancha 101](../101-casas-de-veraneio-sem-esgoto-sp/README.md).

A coleção nasceu de uma triagem: 4.455 pares de variáveis municipais (Censo 2022 e as bases de
outras pranchas do atlas), dos quais 4.114 ligam famílias diferentes. 834 têm correlação de postos
de 0,3 ou mais e passam no teste com a amostra efetiva corrigida pela autocorrelação espacial (q <
0,05, Benjamini–Hochberg); 277 seguem acima de 0,3 descontadas urbanização, densidade e renda. Nove
das dez pranchas saem desse último grupo; a do pau de arara fica um pouco abaixo (parcial 0,27) e
entra pelo dado raro.

A chamada do mapa aponta Herculândia, com 4,8% dos ocupados indo ao trabalho de pau de arara, a
maior taxa entre os municípios de 5 mil habitantes ou mais.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios com as variáveis das dez pranchas; nesta, `pct_pau_de_arara`, `pct_sem_fundamental`, `pct_area_cana`, `pct_bioeconomia` e o aglomerado `lisa102` |
| `apond` | polígono | 2.535 áreas de ponderação do estado com idade, cor ou raça, domicílios e renda dos responsáveis |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

O **GPKG** é o mesmo nas dez pranchas e traz um estilo do QGIS para cada uma. O **CSV** tem a tabela
dos municípios, sem geometria. Os aglomerados LISA vêm como `AA` (alto-alto), `BB` (baixo-baixo),
`AB` (pau de arara alto, escolaridade baixa), `BA` e `ns` (não significativo).

## Método

1. `pct_pau_de_arara`: ocupados que vão ao trabalho de caminhonete ou caminhão adaptado (o pau de
   arara) sobre os ocupados que se deslocam para trabalhar (Censo 2022, amostra, SIDRA 10332).
2. Seis classes largas: zero, até 0,25%, 0,25 a 0,5%, 0,5 a 1%, 1 a 2% e mais de 2%. O zero é
   separado porque, em dado de amostra, ele quer dizer “não apareceu na amostra”.
3. Média simples da taxa de pau de arara nos terços de baixo, do meio e de cima dos municípios, por:
   sem fundamental completo, 25 anos ou mais (SIDRA 10061, amostra): 0,43%, 0,76%, 0,93%; área com cana
   (MapBiomas): 0,58%, 0,79%, 0,75%; emprego formal na bioeconomia (RAIS 2025, prancha 076): 0,45%,
   0,80%, 0,86%.
4. Correlações de postos de Spearman: com a falta de fundamental completo, 0,41 (parcial 0,27,
   amostra efetiva 588); com a bioeconomia, 0,38 (parcial 0,23); com a cana, 0,24 (parcial 0,24); com
   os ocupados na agropecuária, 0,35 (parcial 0,17). Controles: urbanização, log da densidade e log da
   renda per capita.
5. LISA bivariado com a falta de fundamental completo (6 vizinhos, 999 permutações, p < 0,05): 48
   municípios alto-alto e 84 baixo-baixo.

## Limitações

- A parte dos ocupados que vão de pau de arara (e a dos adultos sem fundamental completo) vem da
  amostra do Censo 2022: são estimativas expandidas pelo IBGE, com erro amostral que cresce quanto
  menor o município. Diferenças pequenas entre municípios pequenos podem ser ruído; por isso o mapa
  usa classes largas. Onde o IBGE marca X (sigilo), o campo fica vazio, nunca zero. O caso é extremo:
  a taxa trata de poucas pessoas, e em município pequeno um caminhão a mais ou a menos muda a classe.
  Os 32 municípios com zero são “a amostra não achou”, não “ninguém vai assim”.
- O Censo pergunta pelo meio de transporte principal; quem combina pau de arara e ônibus pode
  aparecer em outra categoria.
- A correlação parcial (0,27) fica abaixo do corte de 0,3 da triagem: descontadas urbanização e
  renda, a escolaridade explica pouco. A prancha entra na coleção pelo dado raro, não pela força do
  laço.
- Leitura ecológica: o mapa compara municípios, não pessoas. Uma correlação entre municípios não diz
  que as mesmas pessoas têm as duas características, nem que uma causa a outra; renda, idade, história
  de ocupação e o tamanho da cidade podem estar por trás das duas.
