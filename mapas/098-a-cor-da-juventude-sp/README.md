---
numero: 98
titulo: "A cor da juventude"
subtitulo: "Na metrópole, as áreas com mais crianças são as mais negras; quanto menor a escala, mais forte o laço"
data: 2026-10-27
categoria: censo-renda
colecao: censo-cruzado-sp
tags: [censo-cruzado-sp, sao-paulo, censo-2022, juventude, cor-ou-raca, areas-de-ponderacao, metropole, maup]
rascunho: true                      # fora do ar: resguardo de artigo em preparação

contexto: >-
  Na metrópole de São Paulo e na Baixada Santista, as áreas com mais crianças são as mais negras. Nas 825 áreas de ponderação do Censo 2022 dos 44 municípios das duas concentrações urbanas, a correlação de postos entre a parte de pessoas de 0 a 14 anos e a de pretos e pardos é 0,85; nas 2.470 áreas do estado, 0,73; nos 44 municípios da metrópole, 0,64; nos 640 municípios do estado, 0,50. Quanto menor a unidade, mais forte o laço: a escala muda a medida. Em Caieiras, uma área tem 28% de crianças e 68% de pretos e pardos; em Santos, 10% e 15%. Sexta prancha da coleção «O Censo cruzado».

imagem: ./mapa_preview.png
imagem_alt: "Mapa bivariado das áreas de ponderação dos municípios das concentrações urbanas de São Paulo e de Santos, em nove cores: o ocre cresce com a parte de pessoas de 0 a 14 anos e o lilás, com a de pretos e pardos; o marrom-escuro marca as áreas no terço de cima dos dois. O centro expandido da capital fica no terço de baixo dos dois, em cinza-claro; o marrom-escuro forma um anel nas bordas da metrópole e na Baixada Santista. Chamadas apontam uma área de Caieiras, com 28% de pessoas de 0 a 14 anos e 68% de pretos e pardos (a mais jovem da metrópole), e uma de Santos, com 10% e 15% (a com menos crianças). No painel, a grade dos terços e barras com a mesma correlação em quatro escalas, de 0,50 nos municípios a 0,85 nas áreas da metrópole."

recorte: "Concentrações urbanas de São Paulo e de Santos (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022: agregados por setores censitários"
    nome_en: "IBGE — 2022 Population Census: aggregates by census tract"
    url: https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "IBGE — Malha de setores censitários e áreas de ponderação 2022"
    nome_en: "IBGE — 2022 census tract and weighting area mesh"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/26565-malhas-de-setores-censitarios-divisoes-intramunicipais.html
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Pessoas de 0 a 14 anos e pessoas pretas e pardas por área de ponderação (IBGE), cada um dividido em terços; o cruzamento dá nove classes. Correlação de postos de Spearman, parcial descontados os controles, amostra efetiva corrigida pela autocorrelação espacial e LISA bivariado."

camadas:
  - { nome: apond, tipo: poligono, cor: "#804d36", descricao: "2.535 áreas de ponderação do estado, com idade, cor ou raça e a classe bivariada da metrópole (b098)", descricao_en: "The state’s 2,535 weighting areas, with age, colour or race and the metropolitan bivariate class (b098)" }
  - { nome: municipios, tipo: poligono, cor: "#1a211a", descricao: "645 municípios com as variáveis das dez pranchas, as classes bivariadas (b093 a b101) e os aglomerados LISA (lisa093 a lisa102)", descricao_en: "645 municipalities with the variables of all ten plates, the bivariate classes (b093 to b101) and the LISA clusters (lisa093 to lisa102)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Correlação de postos nas áreas de ponderação da metrópole"
    rotulo_en: "Rank correlation across the metropolitan weighting areas"
    valor: 0.85
    nota: "825 áreas"
    nota_en: "825 areas"
  - tipo: numero
    rotulo: "Correlação de postos nos municípios do estado"
    rotulo_en: "Rank correlation across the state’s municipalities"
    valor: 0.5
    nota: "parcial 0,35"
    nota_en: "partial 0.35"
  - tipo: numero
    rotulo: "Áreas no terço de cima dos dois"
    rotulo_en: "Areas in the top third of both"
    valor: 203
    unidade: "áreas de ponderação"
    unidade_en: "weighting areas"

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
  - formato: csv
    arquivo: dados/sp_censo_cruzado_apond_2022.csv
    rotulo: "Tabela das áreas de ponderação"
    rotulo_en: "Weighting area table"
    tamanho: "230 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/censo-cruzado-sp-2026/sp_criancas_e_cor_apond_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/censo-cruzado-sp-2026/sp_criancas_e_cor_apond_2022_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,4 MB"
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

# Crianças e população preta e parda nas áreas de ponderação da metrópole de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 098, a sexta de dez da coleção **O Censo cruzado**; a anterior é a [prancha 097](../097-verticalizacao-e-desigualdade-sp/README.md); a seguinte, a [prancha 099](../099-envelhecer-sozinho-sp/README.md).

A coleção nasceu de uma triagem: 4.455 pares de variáveis municipais (Censo 2022 e as bases de
outras pranchas do atlas), dos quais 4.114 ligam famílias diferentes. 834 têm correlação de postos
de 0,3 ou mais e passam no teste com a amostra efetiva corrigida pela autocorrelação espacial (q <
0,05, Benjamini–Hochberg); 277 seguem acima de 0,3 descontadas urbanização, densidade e renda. Nove
das dez pranchas saem desse último grupo; a do pau de arara fica um pouco abaixo (parcial 0,27) e
entra pelo dado raro.

As chamadas do mapa apontam uma área de Caieiras, com 28% de pessoas de 0 a 14 anos e 68% de pretos
e pardos (a mais jovem da metrópole), e uma de Santos, com 10% e 15% (a com menos crianças).

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios com as variáveis das dez pranchas; nesta, `pct_0a14` e `pct_pretos_pardos` no nível municipal |
| `apond` | polígono | 2.535 áreas de ponderação do estado com idade, cor ou raça, domicílios e renda dos responsáveis; `metropole` marca as da janela e `b098` traz a classe bivariada |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

O **GPKG** é o mesmo nas dez pranchas e traz um estilo do QGIS para cada uma. O **CSV** tem a tabela
dos municípios, sem geometria; o segundo CSV, a das áreas de ponderação. Os aglomerados LISA vêm
como `AA` (alto-alto), `BB` (baixo-baixo), `AB` (primeira variável alta, segunda baixa), `BA` e `ns`
(não significativo).

## Método

1. `pct_0a14`: pessoas de 0 a 14 anos sobre a população residente (Censo 2022, universo).
2. `pct_pretos_pardos`: pessoas de cor ou raça preta ou parda sobre a população residente (Censo
   2022, universo).
3. Unidade: área de ponderação (APOND) de 2022, montada pela soma dos setores censitários de cada
   área. A janela do mapa reúne os 44 municípios das concentrações urbanas de São Paulo e de Santos;
   entram as 825 áreas com mil moradores ou mais.
4. Terços dos áreas de ponderação com dado, fechados à direita: 0 a 14 anos até 17,1%, 17,1% a 20,1%
   e mais de 20,1%; pretos e pardos até 42,6%, 42,6% a 55,9% e mais de 55,9%. A classe junta os dois
   terços (203 áreas de ponderação no terço de cima dos dois, 224 no de baixo dos dois).
5. Correlação de postos de Spearman nas 825 áreas da metrópole (0,85), nas 2.470 do estado (0,73),
   nos 44 municípios da metrópole (0,64) e nos 640 do estado (0,50).
6. No nível municipal, correlação parcial de Spearman: correlação entre os resíduos dos postos de
   cada variável regredidos nos postos dos controles (urbanização (moradores em situação urbana), log
   da densidade demográfica e log da renda domiciliar per capita). Resultado: 0,35; 0,31 sem a Região
   Intermediária de São Paulo. Amostra efetiva 471, pela fórmula n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), com Iₓ e Iᵧ
   o I de Moran dos resíduos (6 vizinhos mais próximos).

## Limitações

- Escala (o problema da unidade de área modificável): o mesmo par dá 0,50 nos 640 municípios do
  estado, 0,64 nos 44 municípios da metrópole, 0,73 nas 2.470 áreas de ponderação do estado e 0,85 nas
  825 da metrópole. Nenhum desses números é o “verdadeiro”: cada um responde a uma pergunta sobre uma
  unidade diferente.
- Leitura ecológica: o mapa compara áreas, não pessoas. Uma correlação entre áreas não diz que as
  mesmas pessoas têm as duas características, nem que uma causa a outra; renda, idade, história de
  ocupação e o tamanho da cidade podem estar por trás das duas. Fecundidade maior, renda menor e
  moradia mais barata nas bordas da metrópole podem pesar juntas; no município, descontadas
  urbanização, densidade e renda, a correlação cai para 0,35.
- As duas variáveis vêm do universo do Censo 2022 (ou de bases administrativas e de mapeamento por
  satélite), sem erro amostral; onde o IBGE marca X (sigilo), o campo fica vazio, nunca zero.
- Os terços são relativos aos áreas da metrópole: o terço de baixo daqui pode ser alto em outra
  metrópole.
