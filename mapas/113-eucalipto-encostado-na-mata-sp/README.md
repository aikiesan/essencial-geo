---
numero: 113
titulo: "Eucalipto encostado na mata"
subtitulo: "Onde sobra mais vegetação nativa, mais madeira sai para o papel e a celulose"
data: 2026-11-17
categoria: energia
colecao: bioenergia-cruzada-sp
tags: [bioenergia-cruzada-sp, sao-paulo, silvicultura, eucalipto, celulose, vegetacao-nativa, mapbiomas, correlacao]

contexto: >-
  Nos municípios paulistas que tiram madeira de silvicultura para papel e celulose, quanto mais vegetação nativa resta, mais madeira sai por km². Nos 366 municípios da PEVS 2024, a correlação de postos é 0,42, e 0,47 descontadas urbanização, densidade e renda. O produtor mediano tem 18,7 % da área em mata nativa; os municípios da pesquisa que não produzem, 9,8 %. Os 127 produtores tiraram 24,8 milhões de m³, sobretudo no sudoeste, em Sorocaba, e no centro-oeste, em Bauru. Capão Bonito soma 39 % de mata e 1,70 milhão de m³. Relevo e solo que afastam a cana podem estar por trás das duas coisas. Terceira prancha da coleção «Bioenergia cruzada».

imagem: ./mapa_preview.png
imagem_alt: "Mapa bivariado de São Paulo em nove cores, cruzando terços da vegetação nativa (do claro ao ocre) com três degraus de madeira para papel e celulose por km² (nenhuma, abaixo e acima da mediana dos produtores, do claro ao lilás); onde os dois são altos, marrom-escuro. Os 279 municípios fora da PEVS 2024 aparecem hachurados, sem dado. O marrom se junta no sudoeste, em volta de Capão Bonito, no centro-oeste, perto de Agudos, e no Vale do Paraíba. Chamadas apontam Capão Bonito, com 39 % de mata e 1,70 milhão de m³, e Agudos, com 21 % e 845 mil m³. No painel, a grade 3 × 3 e a tabela das correlações."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Produção da Extração Vegetal e da Silvicultura (PEVS) 2024, SIDRA tabela 291 (madeira em tora para papel e celulose)"
    nome_en: "IBGE — Forestry and Plant Extraction Survey (PEVS) 2024, SIDRA table 291 (roundwood for paper and pulp)"
    url: https://sidra.ibge.gov.br/tabela/291
    ano: 2024
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
metodo: "Parte da área do município com vegetação nativa (MapBiomas, coleção 10, 2024), em terços, cruzada com a madeira em tora de silvicultura para papel e celulose por km² (IBGE, PEVS 2024): nenhuma, abaixo e acima da mediana dos produtores; mapa bivariado 3 × 3 só nos municípios da PEVS; correlações de postos de Spearman, brutas e parciais, e LISA bivariado."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#804d36", descricao: "645 municípios com as variáveis das cinco pranchas, as classes bivariadas e os aglomerados LISA (mesmo GPKG das pranchas 111 a 115)", descricao_en: "645 municipalities with the variables of all five plates, the bivariate classes and the LISA clusters (same GPKG as plates 111 to 115)" }
  - { nome: gasodutos, tipo: linha, cor: "#1a211a", descricao: "Gasodutos de transporte e rede de distribuição de gás (EPE)", descricao_en: "Gas transmission pipelines and distribution network (EPE)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Correlação de postos entre mata nativa e madeira para celulose"
    rotulo_en: "Rank correlation between native cover and pulpwood"
    valor: 0.42
    nota: "parcial 0,47; 366 municípios da PEVS"
    nota_en: "partial 0.47; 366 PEVS municipalities"
  - tipo: numero
    rotulo: "Vegetação nativa no produtor mediano"
    rotulo_en: "Native cover in the median producer"
    valor: 18.7
    unidade: "%"
    unidade_en: "%"
    nota: "9,8 % nos que não produzem"
    nota_en: "9.8% in non-producers"
  - tipo: numero
    rotulo: "Madeira para papel e celulose em 2024"
    rotulo_en: "Pulpwood in 2024"
    valor: 24.8
    unidade: "milhões de m³"
    unidade_en: "million m³"
    nota: "127 municípios produtores"
    nota_en: "127 producing municipalities"

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
    url: https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-cruzada-sp-2026/sp_mata_e_madeira_para_celulose_2024_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-cruzada-sp-2026/sp_mata_e_madeira_para_celulose_2024_prancha.en.svg
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

# Vegetação nativa e madeira para papel e celulose nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 113, a terceira de cinco da coleção **Bioenergia cruzada**; a anterior é a [prancha 112](../112-diesel-que-o-biometano-cobriria-sp/README.md); a seguinte, a [prancha 114](../114-esterco-longe-de-quem-aduba-sp/README.md).

A coleção cruza a bioenergia paulista com o que se vende nos postos, com o campo e com as
prefeituras, nos 645 municípios de São Paulo. Os pares saíram de uma triagem de correlações entre o
potencial de biometano do CP2B, as vendas de combustíveis do Anuário da SEMIL, a silvicultura, o
rebanho, o Censo Agropecuário, a frota e a MUNIC. Cada par passou por correlação de postos bruta e
parcial (descontadas urbanização, densidade e renda), amostra efetiva corrigida pela autocorrelação
espacial, valores q de Benjamini–Hochberg e LISA bivariado. A última prancha é descritiva, sem
teste, e o texto diz isso.

As chamadas do mapa apontam Capão Bonito, com 39 % da área em vegetação nativa e 1,70 milhão de m³
de madeira para celulose em 2024 (terço de cima nos dois), e Agudos, no centro-oeste, com 21 % e 845
mil m³.

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

1. `pct_area_nativa`: vegetação nativa, as formações naturais do MapBiomas (coleção 10, 2024), sobre
   a área do município, em %.
2. `madeira_papel_m3` e `madeira_papel_m3_km2`: madeira em tora de silvicultura para papel e
   celulose em 2024, em m³ e por km² da área do município (IBGE, PEVS, SIDRA 291).
3. Terços de mata: até 9,2 %, de 9,2 % a 18,1 % e mais de 18,1 %. Madeira: nenhuma; até 165,8 m³/km²
   (mediana dos 127 produtores); mais que isso. `b113`: classe bivariada, dezena = terço de mata (1 a
   3), unidade = terço de madeira (1 a 3). De baixo para cima e da esquerda para a direita, as nove
   casas têm 113, 73, 53; 8, 29, 26; 1, 20, 43 municípios.
4. A PEVS publica 366 municípios paulistas para essa variável; os outros 279 ficam sem dado, não
   zero, e o mapa os hachura. Mata nativa × madeira para celulose por km² (log): correlação de postos
   de Spearman 0,42 (366 municípios), parcial 0,47, amostra efetiva 167, p < 0,001, q < 0,001.
5. `lisa113`: aglomerados LISA bivariados (mata no município × madeira nos vizinhos): 65 alto-alto,
   0 baixo-baixo, 0 alto-baixo e 13 baixo-alto; I de Moran bivariado 0,37. Alto-alto por região
   intermediária: Sorocaba (23), Bauru (18), São José dos Campos (8) e Marília (7).
6. Correlação parcial: correlação entre os resíduos dos postos de cada variável regredidos nos
   postos dos controles, que são urbanização (parte de moradores em situação urbana), log da densidade
   demográfica e log da renda por habitante (Censo 2022). Amostra efetiva sob autocorrelação espacial:
   n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), com Iₓ e Iᵧ o I de Moran dos resíduos numa vizinhança dos 6 vizinhos mais
   próximos; valores q de Benjamini–Hochberg sobre todos os pares da triagem. LISA bivariado: valor do
   município contra a média dos 6 vizinhos na outra variável, 999 permutações, semente 20261019, p <
   0,05.

## Limitações

- A PEVS cobre 366 dos 645 municípios e não diz a espécie: o eucalipto domina a silvicultura
  paulista, mas no sudoeste há também pinus. Madeira para celulose não é toda a madeira de
  silvicultura: lenha e toras para serraria ficam de fora.
- Relevo acidentado e solos que afastam a cana e a mecanização podem explicar as duas coisas; o mapa
  não diz que a silvicultura protege a mata, nem que a ameaça.
- Leitura ecológica: o mapa compara municípios, não pessoas nem fazendas. Uma correlação entre
  municípios não diz que as mesmas propriedades ou os mesmos motoristas têm as duas características,
  nem que uma causa a outra.
