---
numero: 105
titulo: "Responsável não é mãe solo"
subtitulo: "44% das mulheres responsáveis vivem com cônjuge, e são mais onde elas são mais"
data: 2026-11-03
categoria: censo-renda
colecao: mulheres-responsaveis-sp
tags: [mulheres-responsaveis-sp, sao-paulo, censo-2022, domicilios, genero, familia, municipios]
rascunho: true                      # fora do ar: resguardo de artigo em preparação

contexto: >-
  Pessoa responsável não é sinônimo de mãe solo. Das casas paulistas com responsável mulher, 44,0% têm cônjuge (nas de responsável homem, 71,3%) e 27,7% são de mulher sem cônjuge com filhos ou enteados. Ainda assim, 86% dos lares sem cônjuge com filhos têm uma mulher à frente. Nos municípios, onde há mais responsáveis mulheres, mais delas vivem com cônjuge (correlação de postos 0,50; parcial 0,56) e menos são sem cônjuge com filhos (−0,43). Em Itupeva, 63% vivem com cônjuge; em Santos, 35%. Terceira prancha da coleção «Mulheres responsáveis pelo domicílio».

imagem: ./mapa_preview.png
imagem_alt: "Mapa coroplético dos 645 municípios de São Paulo em cinco tons de ocre, do claro (menos de 40% das responsáveis mulheres vivendo com cônjuge) ao escuro (55% ou mais). Os tons claros aparecem na capital, na Baixada Santista e em cidades maiores. Chamadas apontam Itupeva, com 63%, e Santos, com 35%. No painel, duas barras comparam a composição das casas com responsável mulher e com responsável homem no estado (com cônjuge, sem cônjuge com filhos, outras), e uma tabela traz as correlações."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022, SIDRA tabela 9882 (domicílios por presença de cônjuge e filhos e sexo do responsável, universo)"
    nome_en: "IBGE — 2022 Population Census, SIDRA table 9882 (households by presence of spouse and children and sex of the responsible person, full count)"
    url: https://sidra.ibge.gov.br/tabela/9882
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Domicílios com responsável mulher em que há cônjuge (com ou sem filhos), sobre todos os domicílios com responsável mulher, por município (SIDRA 9882, universo); cinco classes; correlações de postos de Spearman com a parte de responsáveis mulheres, brutas e parciais."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#b8934a", descricao: "645 municípios com as variáveis das oito pranchas, a classe bivariada b109 e os aglomerados LISA lisa103 e lisa109", descricao_en: "645 municipalities with the variables of all eight plates, the bivariate class b109 and the LISA clusters lisa103 and lisa109" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Responsáveis mulheres que vivem com cônjuge"
    rotulo_en: "Women responsible who live with a spouse"
    valor: 44
    unidade: "%"
    unidade_en: "%"
    nota: "homens: 71,3%"
    nota_en: "men: 71.3%"
  - tipo: numero
    rotulo: "Lares sem cônjuge com filhos que têm uma mulher à frente"
    rotulo_en: "Homes without a spouse but with children headed by a woman"
    valor: 86
    unidade: "%"
    unidade_en: "%"
  - tipo: numero
    rotulo: "Correlação entre responsáveis mulheres e a parte delas com cônjuge"
    rotulo_en: "Correlation between women responsible and the share of them with a spouse"
    valor: 0.5
    nota: "parcial 0,56"
    nota_en: "partial 0.56"

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
    url: https://github.com/aikiesan/essencial-geo/releases/download/mulheres-responsaveis-sp-2026/sp_responsaveis_mulheres_conjuge_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/mulheres-responsaveis-sp-2026/sp_responsaveis_mulheres_conjuge_2022_prancha.en.svg
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

# Mulheres responsáveis que vivem com cônjuge nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 105, a terceira de oito da coleção **Mulheres responsáveis pelo domicílio**; a anterior é a [prancha 104](../104-dez-pontos-em-doze-anos-sp/README.md); a seguinte, a [prancha 106](../106-esgoto-e-responsaveis-mulheres-sp/README.md).

A coleção cruza a parte de domicílios com responsável mulher com os serviços da casa e da rua e com
a renda, nos 645 municípios de São Paulo. Antes dos mapas vieram os testes: correlação de postos
bruta e parcial (descontadas urbanização, densidade e renda), amostra efetiva corrigida pela
autocorrelação espacial, valores q de Benjamini–Hochberg, I de Moran, LISA, e a comparação entre
municípios e áreas de ponderação. A maior parte das relações com os serviços some quando se desconta
a urbanização: responsáveis mulheres são mais comuns nas cidades, e as cidades têm mais rede. As
relações fracas também viram mapa, como retrato descritivo, e o texto diz que são fracas.

As chamadas do mapa apontam Itupeva, onde 63% das responsáveis vivem com cônjuge (a maior parte
entre os de 20 mil habitantes ou mais), e Santos, com 35%, numa cidade de muitas idosas que moram
sós.

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

1. `pct_mulher_com_conjuge` e `pct_homem_com_conjuge`: domicílios com cônjuge (com ou sem filhos)
   sobre os domicílios com responsável do mesmo sexo (SIDRA 9882, Censo 2022, universo). «Filhos»
   inclui enteados, de qualquer idade.
2. `pct_mulher_sem_conjuge_filhos`: domicílios de responsável mulher sem cônjuge e com filhos ou
   enteados, sobre os de responsável mulher.
3. No estado: com responsável mulher, 44,0% com cônjuge (15,1% sem filhos), 27,7% sem cônjuge com
   filhos e 28,3% em outras composições (quem mora só, com parentes ou não parentes); com responsável
   homem, 71,3% com cônjuge e 4,3% sem cônjuge com filhos.
4. Classes: menos de 40%, 40 a 45%, 45 a 50%, 50 a 55% e 55% ou mais. No município mediano, 46,9%
   das responsáveis mulheres vivem com cônjuge (homens: 73,5%).
5. Parte de responsáveis mulheres × parte delas com cônjuge: correlação de postos de Spearman 0,50
   (645 municípios), parcial 0,56, amostra efetiva 618, p < 0,001; × parte sem cônjuge com filhos:
   correlação de postos de Spearman −0,43 (645 municípios), parcial −0,55, amostra efetiva 596, p <
   0,001.
6. Correlação parcial: correlação entre os resíduos dos postos de cada variável regredidos nos
   postos dos controles, que são urbanização (parte de moradores em situação urbana), log da densidade
   demográfica e log da renda média dos responsáveis; sai o controle da mesma família da variável.
   Amostra efetiva sob autocorrelação espacial: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), com Iₓ e Iᵧ o I de Moran dos
   resíduos numa vizinhança dos 6 vizinhos mais próximos; valores q de Benjamini–Hochberg sobre todos
   os testes da coleção.

## Limitações

- O Censo registra a composição no dia da entrevista: «sem cônjuge com filhos» inclui viúvas com
  filhos adultos, não só mães jovens criando filhos sozinhas.
- A alta de responsáveis mulheres com cônjuge sugere que parte do aumento desde 2010 vem de casais
  que passaram a apontar a mulher como responsável; o Censo não pergunta o motivo.
- Leitura ecológica: o mapa compara lugares, não pessoas. Uma correlação entre municípios não diz
  que as mesmas casas têm as duas características, nem que uma causa a outra; urbanização, renda e
  idade podem estar por trás das duas.
