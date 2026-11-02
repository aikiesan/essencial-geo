---
numero: 165
titulo: "O licor da celulose"
subtitulo: "23 fábricas de celulose têm dois terços da eletricidade de biomassa que não é cana"
data: 2027-02-26
rascunho: true
categoria: energia
colecao: combustivel-biomassa-br
tags: [combustivel-biomassa-br, brasil, biomassa, licor-negro, celulose, eucalipto, aneel, pevs]

contexto: >-
  Fora do bagaço de cana, o combustível que mais gera eletricidade de biomassa no Brasil é o licor negro, a sobra do cozimento da madeira nas fábricas de celulose. São 23 usinas com 3,72 GW em operação, 66% de toda a potência a biomassa que não é cana. A Suzano tem 41% dela, em seis fábricas. Três Lagoas (MS), com três fábricas e 659 MW, é o município com mais potência a biomassa do país, cana incluída. A madeira vem de perto: dos 130 milhões de m³ de madeira em tora colhidos para papel e celulose em 2025, 93% saíram de municípios a até 200 km de uma dessas fábricas. Mato Grosso do Sul colhe a maior parte, 30 milhões de m³, tem 1,04 GW a licor negro e mais 420 MW em obra em Inocência. Primeira prancha da coleção «O que mais a usina queima».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers com os municípios coloridos em cinco tons de verde pela madeira em tora colhida para papel e celulose em 2025, concentrada em Mato Grosso do Sul, no leste de São Paulo, no Paraná, no sul da Bahia, no Espírito Santo e no Rio Grande do Sul, e círculos roxos proporcionais à potência das 23 usinas a licor negro, quase todas dentro ou ao lado das manchas verdes; um anel vazado marca a fábrica em obra em Inocência (MS). Uma chamada aponta Três Lagoas (MS), com três fábricas e 659 MW, e outra Ortigueira (PR), com 465 MW da Klabin. No painel, barras da potência a licor negro e da madeira para celulose por UF e uma barra dividida entre os donos da potência, com a Suzano à frente."

recorte: "Brasil"
fontes:
  - nome: "ANEEL — Sistema de Informações de Geração (SIGA), empreendimentos de geração, dados abertos de 01/10/2026 (acesso em 01/11/2026)"
    nome_en: "ANEEL — Generation Information System (SIGA), generation projects, open data of 01/10/2026 (accessed 01/11/2026)"
    url: https://dadosabertos.aneel.gov.br/dataset/siga-sistema-de-informacoes-de-geracao-da-aneel
    ano: 2026
  - nome: "IBGE — Produção da Extração Vegetal e da Silvicultura (PEVS) 2025, tabela 291: madeira em tora para papel e celulose, por município (SIDRA, acesso em 01/11/2026)"
    nome_en: "IBGE — Plant Extraction and Forestry Production (PEVS) 2025, table 291: roundwood for pulp and paper, by municipality (SIDRA, accessed 01/11/2026)"
    url: https://sidra.ibge.gov.br/tabela/291
    ano: 2025
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
metodo: "Usinas do SIGA com combustível «Licor Negro» (24, 23 em operação), pela potência outorgada e pela coordenada do cadastro; madeira em tora para papel e celulose colhida em cada município em 2025 (PEVS, tabela 291); distância do ponto interno de cada município à usina a licor negro em operação mais próxima, em projeção de Albers."

camadas:
  - { nome: fabricas, tipo: ponto, cor: "#6b3d5c", descricao: "24 usinas a licor negro do SIGA (23 em operação, 1 em obra): nome, CEG, UF, município, fase, potência outorgada, ano de entrada em operação, dono", descricao_en: "24 black-liquor plants in SIGA (23 operating, 1 under construction): name, CEG code, state, municipality, phase, licensed capacity, start year, owner" }
  - { nome: municipios, tipo: poligono, cor: "#4f7a4a", descricao: "5.571 municípios: madeira em tora para papel e celulose em 2015 e 2025 (m³), classe e distância à usina a licor negro mais próxima (km)", descricao_en: "5,570 municipalities: roundwood for pulp and paper in 2015 and 2025 (m³), class and distance to the nearest black-liquor plant (km)" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 UFs: potência a licor negro em operação e madeira para celulose em 2025", descricao_en: "27 states: operating black-liquor capacity and pulpwood harvested in 2025" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Potência a licor negro em operação, 01/10/2026"
    rotulo_en: "Operating black-liquor capacity, 01/10/2026"
    valor: 3.72
    unidade: "GW"
    nota: "23 usinas; 66% da potência a biomassa que não é bagaço de cana (5,61 GW)"
    nota_en: "23 plants; 66% of non-bagasse biomass capacity (5.61 GW)"
  - tipo: numero
    rotulo: "Madeira para celulose colhida a até 200 km de uma usina a licor negro, 2025"
    rotulo_en: "Pulpwood harvested within 200 km of a black-liquor plant, 2025"
    valor: 93.2
    unidade: "%"
    nota: "de 130,3 milhões de m³ no país (76,8 milhões em 2015)"
    nota_en: "of 130.3 million m³ nationwide (76.8 million in 2015)"
  - tipo: barras
    rotulo: "Potência a licor negro em operação por dono"
    rotulo_en: "Operating black-liquor capacity by owner"
    unidade: "MW"
    itens:
      - { rotulo: "Suzano (6 fábricas)", valor: 1536, cor: "#6b3d5c" }
      - { rotulo: "Klabin (5)", valor: 650, cor: "#8a5a7b" }
      - { rotulo: "Bracell (2)", valor: 446, cor: "#a87d99" }
      - { rotulo: "CMPC (1)", valor: 265, cor: "#c4a3b8" }
      - { rotulo: "Eldorado (1)", valor: 214, cor: "#dcc7d4" }
      - { rotulo: "outras 8", valor: 609, cor: "#ece3e8" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/combustivel-biomassa-br-2026/br_licor_negro_celulose.gpkg.zip
    rotulo: "Usinas a licor negro, municípios com a madeira para celulose, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Black-liquor plants, municipalities with pulpwood, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "10,3 MB"
  - formato: csv
    arquivo: dados/br_licor_negro_celulose.csv
    rotulo: "As 24 usinas a licor negro, com potência, ano, dono e coordenadas"
    rotulo_en: "The 24 black-liquor plants, with capacity, year, owner and coordinates"
    tamanho: "4 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/combustivel-biomassa-br-2026/br_licor_negro_celulose_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/combustivel-biomassa-br-2026/br_licor_negro_celulose_prancha.en.svg
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

# O licor da celulose: as usinas a licor negro e a madeira que as alimenta

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 165, a primeira da coleção **O que mais a usina queima**. A prancha 127 mostrou que o
bagaço de cana domina a eletricidade de biomassa; esta olha para o segundo combustível, que não vem
da lavoura, mas da fábrica de celulose.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `fabricas` | ponto | 24 usinas a licor negro: `nome`, `ceg`, `uf`, `municipio`, `fase`, `potencia_kw` (outorgada), `ano_inicio`, `proprietario`, `regime` (APE, PIE, REG), `posicao` |
| `municipios` | polígono | 5.571 municípios: `celulose_2015_m3`, `celulose_2025_m3` (madeira em tora para papel e celulose), `situacao_pevs`, `classe`, `km_fabrica` |
| `ufs` | polígono | 27 UFs: `licor_kw_op`, `celulose_2025_m3` |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `combustivel-biomassa-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/combustivel-biomassa-br-2026),
com os **estilos do QGIS** gravados (círculos pela potência, municípios em classes de m³). O **CSV**
fica nesta pasta, em UTF-8, com a tabela das usinas sem geometria.

## Método

1. Cadastro de empreendimentos de geração da ANEEL (SIGA, dados abertos gerados em 01/10/2026,
   baixados em 01/11/2026): as usinas com `DscOrigemCombustivel` = «Biomassa» e
   `NomFonteCombustivel` = «Licor Negro». Potência é a outorgada; a posição é a coordenada do cadastro.
2. Madeira em tora para papel e celulose (PEVS 2025, tabela 291 do SIDRA, produto 1.3.1), em m³, por
   município. Municípios fora da tabela não têm silvicultura registrada e contam como zero; os 861
   marcados «...» (não disponível) ficam como sem dado.
3. Distância de cada município à usina a licor negro em operação mais próxima: do ponto interno do
   polígono ao ponto da usina, em projeção de Albers. «A até 200 km» soma a madeira dos municípios
   com distância de até 200 km.
4. As porcentagens sobre a «biomassa que não é cana» usam todas as usinas a biomassa em operação do
   SIGA menos as de bagaço de cana: 225 usinas, 5,61 GW (as outras 202 estão na prancha 166).

## Leitura

- 23 usinas a licor negro em operação somam 3,72 GW: 66% da potência a biomassa sem cana e 20% de
  toda a potência a biomassa do país (18,4 GW). Mais uma, Sucuriú, da Arauco em Inocência (MS), tem
  420 MW em obra.
- Os donos: Suzano, 1.536 MW em seis fábricas (41%); Klabin, 650 MW em cinco; Bracell, 446 MW em
  duas; CMPC, 265 MW; Eldorado, 214 MW; outras oito, 609 MW.
- Três Lagoas (MS) tem três fábricas e 659 MW a licor negro (715 MW contando as outras usinas a biomassa do município,
  como a Onça Pintada, a cavaco), mais do que qualquer município do país, inclusive os da cana. Seguem Ortigueira (PR),
  465 MW, e Lençóis Paulista (SP), 446 MW.
- Mato Grosso do Sul tem 1,04 GW a licor negro e colheu 29,9 milhões de m³ de madeira para celulose
  em 2025, mais que qualquer UF; São Paulo, 23,7 milhões; Paraná, 19,1; Bahia, 17,4.
- O país colheu 130,3 milhões de m³ em 2025, 70% mais que os 76,8 milhões de 2015. 93% saíram de
  municípios a até 200 km de uma usina a licor negro. Os maiores: Três Lagoas, Brasilândia e Ribas do
  Rio Pardo, todos em MS.
- 54% da potência a licor negro (2,0 GW) entrou em operação de 2015 para cá.

## Limitações

- Potência outorgada não é geração: a fábrica de celulose usa a maior parte da eletricidade que faz,
  e só parte dela chega à rede. Esta prancha não mede o que é gerado.
- O SIGA dá uma data de entrada em operação por usina; ampliações posteriores ficam na data original.
- A PEVS registra onde a madeira foi colhida, não para qual fábrica foi. A proximidade é uma
  indicação, não um fluxo medido.
- Algumas usinas do SIGA não trazem coordenada; nesses casos, o ponto vai ao centro do município.

## Licença dos dados

Dados abertos da ANEEL e do IBGE, de uso livre com citação da fonte.
