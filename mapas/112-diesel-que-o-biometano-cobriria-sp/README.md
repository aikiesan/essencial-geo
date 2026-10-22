---
numero: 112
titulo: "O diesel que o biometano cobriria"
subtitulo: "Em 300 municípios, o potencial de biometano passa, em energia, do diesel que os postos vendem"
data: 2026-11-17
categoria: energia
colecao: bioenergia-cruzada-sp
tags: [bioenergia-cruzada-sp, sao-paulo, biometano, diesel, cp2b, combustiveis, potencial]

contexto: >-
  Se todo o potencial acessível de biometano de São Paulo virasse combustível, 6,16 bilhões de m³ por ano, ele cobriria em energia 44 % dos 13,6 bilhões de litros de diesel vendidos no estado em 2024; fora da região intermediária de São Paulo, 61 %. Em 300 dos 643 municípios o potencial passa do diesel vendido, e no município mediano chega a 80 %. Sertãozinho cobriria o próprio diesel e sobraria um terço; a região de Presidente Prudente inteira chega a 125 %; a capital, a 3 %. É conta de energia, não plano: o CP2B é modelo, e venda de diesel não é consumo. Segunda prancha da coleção «Bioenergia cruzada».

imagem: ./mapa_preview.png
imagem_alt: "Mapa coroplético dos 645 municípios de São Paulo em seis classes da razão entre o potencial de biometano e o diesel vendido, em energia: três tons de ocre para menos de 0,5, bege de 0,5 a 1 e dois tons de verde para 1 ou mais. O verde cobre a maior parte do interior; o ocre, a Grande São Paulo, o Vale do Paraíba, o litoral e as cidades de rodovia; dois municípios sem venda de diesel no Anuário estão hachurados. Chamadas apontam Sertãozinho, com 1,35, Presidente Prudente, com 0,20, e São Paulo, com 0,03. No painel, a legenda com o número de municípios por classe e barras com a razão de cada região intermediária."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "CP2B (Unicamp) — potencial de biogás e biometano por município, método v5.1, nível N4, cenário de referência"
    nome_en: "CP2B (Unicamp) — biogas and biomethane potential by municipality, method v5.1, level N4, reference scenario"
    ano: 2026
  - nome: "SEMIL/SP, Anuário de Energéticos por Município 2025 (ano-base 2024): vendas de etanol hidratado, gasolina C, óleo diesel e gás natural canalizado por município"
    nome_en: "SEMIL/SP, Municipal Energy Yearbook 2025 (base year 2024): sales of hydrous ethanol, petrol C, diesel oil and piped natural gas by municipality"
    url: https://semil.sp.gov.br/anuario-de-energeticos-por-municipios-do-estado-de-sao-paulo/
    ano: 2025
  - nome: "SENATRAN — frota de veículos por município, dezembro de 2025 (IBGE Cidades)"
    nome_en: "SENATRAN — vehicle fleet by municipality, December 2025 (IBGE Cidades)"
    url: https://cidades.ibge.gov.br/
    ano: 2025
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Potencial de biometano do CP2B (v5.1, nível N4, cenário de referência) em m³ por ano, convertido em litros de diesel equivalentes em energia (1 m³ ≈ 0,98 L), sobre o óleo diesel vendido no município (SEMIL/SP, ano-base 2024); seis classes da razão; somas por região intermediária."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#4b8565", descricao: "645 municípios com as variáveis das cinco pranchas, as classes bivariadas e os aglomerados LISA (mesmo GPKG das pranchas 111 a 115)", descricao_en: "645 municipalities with the variables of all five plates, the bivariate classes and the LISA clusters (same GPKG as plates 111 to 115)" }
  - { nome: gasodutos, tipo: linha, cor: "#1a211a", descricao: "Gasodutos de transporte e rede de distribuição de gás (EPE)", descricao_en: "Gas transmission pipelines and distribution network (EPE)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Diesel do estado que o biometano cobriria, em energia"
    rotulo_en: "State diesel that biomethane could cover, in energy"
    valor: 44.4
    unidade: "%"
    unidade_en: "%"
    nota: "61 % fora da região de São Paulo"
    nota_en: "61% outside the São Paulo region"
  - tipo: numero
    rotulo: "Municípios em que o potencial passa do diesel vendido"
    rotulo_en: "Municipalities where potential exceeds diesel sold"
    valor: 300
    unidade: "municípios"
    unidade_en: "municipalities"
    nota: "de 643"
    nota_en: "out of 643"
  - tipo: numero
    rotulo: "Razão no município mediano"
    rotulo_en: "Ratio in the median municipality"
    valor: 0.8

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
    url: https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-cruzada-sp-2026/sp_biometano_sobre_diesel_2024_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-cruzada-sp-2026/sp_biometano_sobre_diesel_2024_prancha.en.svg
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

# Potencial de biometano sobre o diesel vendido, em energia, nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 112, a segunda de cinco da coleção **Bioenergia cruzada**; a anterior é a [prancha 111](../111-cana-no-tanque-sp/README.md); a seguinte, a [prancha 113](../113-eucalipto-encostado-na-mata-sp/README.md).

A coleção cruza a bioenergia paulista com o que se vende nos postos, com o campo e com as
prefeituras, nos 645 municípios de São Paulo. Os pares saíram de uma triagem de correlações entre o
potencial de biometano do CP2B, as vendas de combustíveis do Anuário da SEMIL, a silvicultura, o
rebanho, o Censo Agropecuário, a frota e a MUNIC. Cada par passou por correlação de postos bruta e
parcial (descontadas urbanização, densidade e renda), amostra efetiva corrigida pela autocorrelação
espacial, valores q de Benjamini–Hochberg e LISA bivariado. A última prancha é descritiva, sem
teste, e o texto diz isso.

As chamadas do mapa apontam Sertãozinho, onde o potencial cobriria 135 % do diesel vendido;
Presidente Prudente, cidade de muito diesel vendido (razão 0,20) numa região intermediária que chega
a 125 %; e São Paulo, com 3 %.

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

1. `biometano_m3d`: potencial de biometano do CP2B, v5.1, nível N4 (acessível), cenário de
   referência, em m³ por dia (o mesmo das pranchas 055 a 059).
2. `diesel_l`: litros de óleo diesel vendidos no município em 2024 (SEMIL/SP, Anuário de Energéticos
   por Município 2025).
3. `cobertura_diesel` = biometano_m3d × 365 × 0,98 ÷ diesel_l. O fator 0,98 L de diesel por m³ de
   biometano iguala a energia dos dois (poder calorífico inferior). Classes: menos de 0,1 (169); 0,1 a
   0,25 (47); 0,25 a 0,5 (53); 0,5 a 1 (74); 1 a 2 (97); 2 ou mais (203); 2 sem venda de diesel
   (Anhumas e Redenção da Serra).
4. Por região intermediária: Presidente Prudente 125 %; Araçatuba 108 %; Ribeirão Preto 104 %; Bauru
   93 %; Marília 93 %; São José do Rio Preto 91 %; Araraquara 72 %; Sorocaba 29 %; Campinas 23 %; São
   Paulo 2 %; São José dos Campos 2 %.
5. `caminhoes` e `onibus`: caminhões e caminhões-trator, ônibus e micro-ônibus registrados no
   município (SENATRAN, dezembro de 2025); o estado tem 978.415 caminhões. Biometano (log) × caminhões
   por mil habitantes: correlação de postos de Spearman 0,35 (645 municípios), parcial 0,39, amostra
   efetiva 522, p < 0,001, q < 0,001; biometano × diesel por habitante: correlação de postos de
   Spearman 0,40 (644 municípios), parcial 0,35, amostra efetiva 619, p < 0,001, q < 0,001; empregos em
   usinas × diesel por habitante: correlação de postos de Spearman 0,43 (644 municípios), parcial 0,41,
   amostra efetiva 643, p < 0,001, q < 0,001.
6. Correlação parcial: correlação entre os resíduos dos postos de cada variável regredidos nos
   postos dos controles, que são urbanização (parte de moradores em situação urbana), log da densidade
   demográfica e log da renda por habitante (Censo 2022). Amostra efetiva sob autocorrelação espacial:
   n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), com Iₓ e Iᵧ o I de Moran dos resíduos numa vizinhança dos 6 vizinhos mais
   próximos; valores q de Benjamini–Hochberg sobre todos os pares da triagem. LISA bivariado: valor do
   município contra a média dos 6 vizinhos na outra variável, 999 permutações, semente 20261019, p <
   0,05.

## Limitações

- O CP2B é um modelo: o potencial é a estimativa do que os resíduos renderiam no nível N4
  (acessível, depois da coleta, dos usos concorrentes, da estocagem e do frete), não biometano
  produzido.
- Venda não é consumo: o Anuário da SEMIL conta o que postos e distribuidoras vendem no município,
  inclusive a quem só passa pela estrada ou abastece frotas de fora. Municípios com rodovia
  movimentada podem vender bem mais diesel do que gastam.
- A razão compara energia; não diz que o biometano chegaria aos 978.415 caminhões do estado, que
  exigem motor ou kit a gás, posto de abastecimento e logística. O biometano também disputa usos:
  injeção na rede, indústria e geração de eletricidade.
- Leitura ecológica: o mapa compara municípios, não pessoas nem fazendas. Uma correlação entre
  municípios não diz que as mesmas propriedades ou os mesmos motoristas têm as duas características,
  nem que uma causa a outra.
