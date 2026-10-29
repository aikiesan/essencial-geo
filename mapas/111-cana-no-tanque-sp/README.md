---
numero: 111
titulo: "Cana no tanque"
subtitulo: "Onde há mais canavial, o etanol pesa mais no que os postos vendem"
data: 2026-11-03
categoria: energia
colecao: bioenergia-cruzada-sp
tags: [bioenergia-cruzada-sp, sao-paulo, cana, etanol, combustiveis, mapbiomas, correlacao]

contexto: >-
  Nos municípios paulistas com mais canavial, o etanol pesa mais no combustível vendido para os motores a gasolina e flex. Em energia, o etanol hidratado foi 43 % das vendas do ciclo Otto no estado em 2024; no terço dos municípios com menos cana, 38 %; no terço com mais, 52 %. A correlação de postos é 0,70 e fica em 0,59 descontadas urbanização, densidade e renda. Em Ibaté, com cana em 51 % da área, o etanol chega a 69 %; em São Luiz do Paraitinga, sem cana, fica em 16 %. Venda não é consumo, e preço, frota e distância da usina podem estar por trás. Primeira prancha da coleção «Bioenergia cruzada».

imagem: ./mapa_preview.png
imagem_alt: "Mapa bivariado dos 643 municípios de São Paulo em nove cores, cruzando terços da área com cana (do claro ao ocre) com terços da parte do etanol nas vendas do ciclo Otto (do claro ao lilás); onde os dois são altos, marrom-escuro. O marrom domina o centro e o noroeste canavieiros; o cinza-claro, de pouca cana e pouco etanol, a Grande São Paulo, o Vale do Paraíba e o Vale do Ribeira. Dois municípios sem venda de derivados no Anuário aparecem hachurados. Chamadas apontam Ibaté, com 69 % de etanol, São Luiz do Paraitinga, com 16 %, e São Paulo, com 39 %. No painel, a grade 3 × 3 com o número de municípios em cada casa e a tabela das correlações."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "SEMIL/SP, Anuário de Energéticos por Município 2025 (ano-base 2024): vendas de etanol hidratado, gasolina C, óleo diesel e gás natural canalizado por município"
    nome_en: "SEMIL/SP, Municipal Energy Yearbook 2025 (base year 2024): sales of hydrous ethanol, petrol C, diesel oil and piped natural gas by municipality"
    url: https://semil.sp.gov.br/anuario-de-energeticos-por-municipios-do-estado-de-sao-paulo/
    ano: 2025
  - nome: "MapBiomas — Coleção 10 de cobertura e uso da terra (2024)"
    nome_en: "MapBiomas — Land cover and land use Collection 10 (2024)"
    url: https://brasil.mapbiomas.org/colecoes-mapbiomas/
    ano: 2024
  - nome: "IBGE — Censo Demográfico 2022 (população, urbanização e renda dos municípios)"
    nome_en: "IBGE — 2022 Population Census (population, urbanisation and income by municipality)"
    url: https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Parte da área do município com cana-de-açúcar (MapBiomas, coleção 10, 2024) e parte do etanol hidratado na energia vendida no ciclo Otto (etanol e gasolina C, SEMIL/SP, ano-base 2024), cada uma em terços dos municípios, cruzadas num mapa bivariado 3 × 3; correlações de postos de Spearman, brutas e parciais, e LISA bivariado."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#804d36", descricao: "645 municípios com as variáveis das cinco pranchas, as classes bivariadas e os aglomerados LISA (mesmo GPKG das pranchas 111 a 115)", descricao_en: "645 municipalities with the variables of all five plates, the bivariate classes and the LISA clusters (same GPKG as plates 111 to 115)" }
  - { nome: gasodutos, tipo: linha, cor: "#1a211a", descricao: "Gasodutos de transporte e rede de distribuição de gás (EPE)", descricao_en: "Gas transmission pipelines and distribution network (EPE)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Correlação de postos entre cana e etanol"
    rotulo_en: "Rank correlation between cane and ethanol"
    valor: 0.7
    nota: "parcial 0,59; 643 municípios"
    nota_en: "partial 0.59; 643 municipalities"
  - tipo: numero
    rotulo: "Etanol nas vendas do ciclo Otto, terço com mais cana"
    rotulo_en: "Ethanol in Otto-cycle sales, most-cane third"
    valor: 52
    unidade: "%"
    unidade_en: "%"
    nota: "38 % no terço com menos cana; 43 % no estado"
    nota_en: "38% in the least-cane third; 43% statewide"
  - tipo: numero
    rotulo: "Municípios no terço de cima dos dois"
    rotulo_en: "Municipalities in the top third of both"
    valor: 135
    unidade: "municípios"
    unidade_en: "municipalities"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-cruzada-sp-2026/sp_bioenergia_cruzada.gpkg.zip
    rotulo: "Municípios e gasodutos com as variáveis das cinco pranchas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities and pipelines with the variables of all five plates, SIRGAS 2000, with QGIS styles"
    tamanho: "4,7 MB"
  - formato: csv
    arquivo: dados/sp_bioenergia_cruzada_municipios.csv
    rotulo: "Tabela dos municípios (a mesma nas cinco pranchas)"
    rotulo_en: "Municipal table (the same on all five plates)"
    tamanho: "120 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-cruzada-sp-2026/sp_cana_e_etanol_2024_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-cruzada-sp-2026/sp_cana_e_etanol_2024_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,2 MB"
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

# Área com cana e parte do etanol no que os postos vendem, nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 111, a primeira de cinco da coleção **Bioenergia cruzada**; a seguinte, a [prancha 112](../112-diesel-que-o-biometano-cobriria-sp/README.md).

A coleção cruza a bioenergia paulista com o que se vende nos postos, com o campo e com as
prefeituras, nos 645 municípios de São Paulo. Os pares saíram de uma triagem de correlações entre o
potencial de biometano do CP2B, as vendas de combustíveis do Anuário da SEMIL, a silvicultura, o
rebanho, o Censo Agropecuário, a frota e a MUNIC. Cada par passou por correlação de postos bruta e
parcial (descontadas urbanização, densidade e renda), amostra efetiva corrigida pela autocorrelação
espacial, valores q de Benjamini–Hochberg e LISA bivariado. A última prancha é descritiva, sem
teste, e o texto diz isso.

As chamadas do mapa apontam Ibaté, onde o etanol é 69 % da energia vendida no ciclo Otto (a maior
parte entre os municípios de 10 mil habitantes ou mais) e a cana cobre 51 % da área; São Luiz do
Paraitinga, sem cana e com 16 % (a menor); e São Paulo, com 39 %, pouco abaixo do estado.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios com cana e etanol, biometano e diesel, frota, mata nativa e madeira para celulose, bovinos e adubo orgânico, distâncias ao gasoduto, gás canalizado e as respostas da MUNIC sobre resíduos; classes `b111`, `b113`, `b114`, `arranjo115` e aglomerados `lisa111`, `lisa113`, `lisa114` |
| `gasodutos` | linha | gasodutos de transporte e rede de distribuição (`tipo`) |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

O **GPKG** é o mesmo nas cinco pranchas e traz um estilo do QGIS para cada uma. O **CSV** tem a
tabela dos municípios, sem geometria. Campos vazios são falta de dado, não zero. Os aglomerados LISA
vêm como `AA` (alto-alto), `BB` (baixo-baixo), `AB`, `BA` e `ns` (não significativo); a primeira
letra é a variável do município, a segunda a dos vizinhos.

## Método

1. `pct_area_cana`: área com cana-de-açúcar (MapBiomas, coleção 10, 2024) sobre a área do município,
   em %.
2. `etanol_l` e `gasolina_l`: litros de etanol hidratado e de gasolina C vendidos no município em
   2024 (SEMIL/SP, Anuário de Energéticos por Município 2025). `pct_etanol_otto` = etanol × 21,3 MJ/L ÷
   (etanol × 21,3 + gasolina C × 32,2 MJ/L), em %; a gasolina C já traz etanol anidro misturado, que
   fica na parte da gasolina.
3. Terços de cana: até 3,4 %, de 3,4 % a 35,6 % e mais de 35,6 %; de etanol: até 39,8 %, de 39,8 % a
   52,5 % e mais de 52,5 %. `b111`: classe bivariada, dezena = terço de cana (1 a 3), unidade = terço
   de etanol (1 a 3). De baixo para cima e da esquerda para a direita, as nove casas têm 169, 39, 6;
   38, 102, 74; 7, 73, 135 municípios. Anhumas e Redenção da Serra não têm venda de derivados no
   Anuário e ficam de fora (643 municípios).
4. Cana × etanol no ciclo Otto: correlação de postos de Spearman 0,70 (643 municípios), parcial
   0,59, amostra efetiva 310, p < 0,001, q < 0,001. Sem a capital, 0,59; fora da região intermediária
   de São Paulo, parcial 0,56.
5. `lisa111`: aglomerados LISA bivariados (cana no município × etanol nos vizinhos): 179 alto-alto,
   176 baixo-baixo, 2 alto-baixo e 8 baixo-alto; I de Moran bivariado 0,68.
6. Correlação parcial: correlação entre os resíduos dos postos de cada variável regredidos nos
   postos dos controles, que são urbanização (parte de moradores em situação urbana), log da densidade
   demográfica e log da renda por habitante (Censo 2022). Amostra efetiva sob autocorrelação espacial:
   n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), com Iₓ e Iᵧ o I de Moran dos resíduos numa vizinhança dos 6 vizinhos mais
   próximos; valores q de Benjamini–Hochberg sobre todos os pares da triagem. LISA bivariado: valor do
   município contra a média dos 6 vizinhos na outra variável, 999 permutações, semente 20261019, p <
   0,05.

## Limitações

- Venda não é consumo: o Anuário da SEMIL conta o que postos e distribuidoras vendem no município,
  inclusive a quem só passa pela estrada ou abastece frotas de fora. Municípios com rodovia
  movimentada podem vender bem mais diesel do que gastam.
- O preço relativo na bomba, a frota flex e a distância da usina mais próxima podem estar por trás
  da relação; o mapa não separa esses efeitos. A parte do etanol é medida em energia, não em litros:
  em litros, ela seria maior.
- Leitura ecológica: o mapa compara municípios, não pessoas nem fazendas. Uma correlação entre
  municípios não diz que as mesmas propriedades ou os mesmos motoristas têm as duas características,
  nem que uma causa a outra.
