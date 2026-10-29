---
numero: 103
titulo: "Quase metade das casas"
subtitulo: "Em 2022, 49% dos domicílios paulistas tinham uma mulher como responsável"
data: 2026-11-03
categoria: censo-renda
colecao: mulheres-responsaveis-sp
tags: [mulheres-responsaveis-sp, sao-paulo, censo-2022, domicilios, genero, areas-de-ponderacao]
rascunho: true                      # fora do ar: resguardo de artigo em preparação

contexto: >-
  Em 2022, 49,2% dos domicílios paulistas (7,99 milhões de 16,24 milhões) tinham uma mulher como pessoa responsável; em 2010 eram 39,0%. Por área de ponderação, a parte é maior nas cidades e nos bairros densos: correlação de postos de 0,51 com a urbanização e 0,59 com a densidade, nas 2.520 áreas. Entre os municípios, vai de 25% a 65%. Responsável é quem os moradores apontam ao recenseador: não quer dizer quem sustenta a casa, nem mãe solo. Primeira prancha da coleção «Mulheres responsáveis pelo domicílio», que cruza esse dado com esgoto, água, iluminação e renda, sempre comparando lugares, não pessoas.

imagem: ./mapa_preview.png
imagem_alt: "Mapa coroplético das 2.520 áreas de ponderação de São Paulo em seis tons de lilás, do claro (menos de 40% de domicílios com responsável mulher) ao escuro (56% ou mais); 15 áreas sem dado aparecem hachuradas. Os tons escuros aparecem sobretudo nas manchas urbanas, e a capital forma um mosaico de áreas pequenas. Chamadas apontam a área de Ourinhos, com 63%, a maior entre as de 5 mil moradores ou mais, e a de Alumínio, com 23%, a menor. No painel, a legenda com o número de áreas por classe e a tabela das correlações com urbanização, densidade e renda."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022: agregados por setores censitários (domicílio, parte 2; renda do responsável)"
    nome_en: "IBGE — 2022 Population Census: aggregates by census tract (households, part 2; income of the responsible person)"
    url: https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "IBGE — Malha de setores censitários e áreas de ponderação 2022"
    nome_en: "IBGE — 2022 census tract and weighting area mesh"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/26565-malhas-de-setores-censitarios-divisoes-intramunicipais.html
    ano: 2022
  - nome: "IBGE — Censo Demográfico 2022, SIDRA tabela 9882 (domicílios por presença de cônjuge e filhos e sexo do responsável, universo)"
    nome_en: "IBGE — 2022 Population Census, SIDRA table 9882 (households by presence of spouse and children and sex of the responsible person, full count)"
    url: https://sidra.ibge.gov.br/tabela/9882
    ano: 2022
  - nome: "IBGE — Censo Demográfico 2010, SIDRA tabela 3221 (domicílios por sexo da pessoa responsável, universo)"
    nome_en: "IBGE — 2010 Population Census, SIDRA table 3221 (households by sex of the responsible person, full count)"
    url: https://sidra.ibge.gov.br/tabela/3221
    ano: 2010
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Domicílios com pessoa responsável mulher sobre o total, por área de ponderação, a partir da soma dos setores censitários do Censo 2022 (universo); seis classes de 4 pontos; correlações de postos de Spearman com urbanização, densidade e renda, brutas e parciais."

camadas:
  - { nome: apond, tipo: poligono, cor: "#835ea3", descricao: "2.520 áreas de ponderação com a parte de responsáveis mulheres, urbanização, renda e as diferenças de água e esgoto", descricao_en: "2,520 weighting areas with the share of women responsible, urbanisation, income and the water and sewerage gaps" }
  - { nome: municipios, tipo: poligono, cor: "#1a211a", descricao: "645 municípios com as variáveis das oito pranchas, a classe bivariada b109 e os aglomerados LISA lisa103 e lisa109", descricao_en: "645 municipalities with the variables of all eight plates, the bivariate class b109 and the LISA clusters lisa103 and lisa109" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Domicílios com responsável mulher no estado"
    rotulo_en: "Households with a woman responsible statewide"
    valor: 49.2
    unidade: "%"
    unidade_en: "%"
    nota: "7,99 milhões; 39,0% em 2010"
    nota_en: "7.99 million; 39.0% in 2010"
  - tipo: numero
    rotulo: "Correlação com a urbanização, nas áreas de ponderação"
    rotulo_en: "Correlation with urbanisation, across weighting areas"
    valor: 0.51
    nota: "parcial 0,04"
    nota_en: "partial 0.04"
  - tipo: numero
    rotulo: "Correlação com a densidade, nas áreas de ponderação"
    rotulo_en: "Correlation with density, across weighting areas"
    valor: 0.59
    nota: "parcial 0,33"
    nota_en: "partial 0.33"

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
  - formato: csv
    arquivo: dados/sp_mulheres_responsaveis_apond_2022.csv
    rotulo: "Tabela das áreas de ponderação"
    rotulo_en: "Weighting area table"
    tamanho: "210 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/mulheres-responsaveis-sp-2026/sp_responsaveis_mulheres_apond_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/mulheres-responsaveis-sp-2026/sp_responsaveis_mulheres_apond_2022_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "8,5 MB"
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

# Domicílios com responsável mulher em São Paulo, por área de ponderação

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 103, a primeira de oito da coleção **Mulheres responsáveis pelo domicílio**; a seguinte, a [prancha 104](../104-dez-pontos-em-doze-anos-sp/README.md).

A coleção cruza a parte de domicílios com responsável mulher com os serviços da casa e da rua e com
a renda, nos 645 municípios de São Paulo. Antes dos mapas vieram os testes: correlação de postos
bruta e parcial (descontadas urbanização, densidade e renda), amostra efetiva corrigida pela
autocorrelação espacial, valores q de Benjamini–Hochberg, I de Moran, LISA, e a comparação entre
municípios e áreas de ponderação. A maior parte das relações com os serviços some quando se desconta
a urbanização: responsáveis mulheres são mais comuns nas cidades, e as cidades têm mais rede. As
relações fracas também viram mapa, como retrato descritivo, e o texto diz que são fracas.

As chamadas do mapa apontam a área de ponderação de Ourinhos, com 63% de domicílios com responsável
mulher (a maior entre as de 5 mil moradores ou mais), e a de Alumínio, com 23% (a menor).

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios com as variáveis das oito pranchas: parte de responsáveis mulheres em 2010 e 2022, composição das casas, água, esgoto, lixo, banheiro e água encanada por sexo do responsável, iluminação pública, renda por sexo, `b109`, `lisa103` e `lisa109` |
| `apond` | polígono | 2.520 áreas de ponderação com a parte de responsáveis mulheres, urbanização, renda dos responsáveis e as diferenças de água e esgoto |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

O **GPKG** é o mesmo nas oito pranchas e traz um estilo do QGIS para cada uma. O **CSV** tem a
tabela dos municípios, sem geometria; o segundo CSV, a das áreas de ponderação. Nas colunas, `_lo` e
`_hi` são os limites do sigilo; os aglomerados LISA vêm como `AA` (alto-alto), `BB` (baixo-baixo),
`AB`, `BA` e `ns` (não significativo).

## Método

1. `pct_resp_mulher`: domicílios particulares permanentes ocupados com pessoa responsável mulher
   sobre o total (setores do Censo 2022, domicílio parte 2, universo), somados por área de ponderação;
   `pct_resp_mulher_lo` e `_hi` trazem os limites do sigilo.
2. Seis classes: menos de 40%, 40 a 44%, 44 a 48%, 48 a 52%, 52 a 56% e 56% ou mais. Áreas com menos
   de 80% dos domicílios em setores com dado ficam sem cor (15 áreas).
3. Com a urbanização (moradores em situação urbana): correlação de postos de Spearman 0,51 (2.520
   áreas), parcial 0,04, amostra efetiva 1.825, p < 0,001; com o log da densidade: correlação de postos
   de Spearman 0,59 (2.520 áreas), parcial 0,33, amostra efetiva 1.439, p < 0,001; com a renda média
   dos responsáveis: correlação de postos de Spearman −0,03 (2.520 áreas), parcial −0,24, amostra
   efetiva 1.529, p = 0,287.
4. Nos 645 municípios, com a urbanização: correlação de postos de Spearman 0,26 (645 municípios),
   parcial 0,20, amostra efetiva 566, p < 0,001. I de Moran da parte de responsáveis mulheres: 0,39 nas
   áreas e 0,17 nos municípios; LISA univariado nos municípios (6 vizinhos, 999 permutações, semente
   20261019, p < 0,05): 72 alto-alto e 49 baixo-baixo (`lisa103`).
5. Correlação parcial: correlação entre os resíduos dos postos de cada variável regredidos nos
   postos dos controles, que são urbanização (parte de moradores em situação urbana), log da densidade
   demográfica e log da renda média dos responsáveis; sai o controle da mesma família da variável.
   Amostra efetiva sob autocorrelação espacial: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), com Iₓ e Iᵧ o I de Moran dos
   resíduos numa vizinhança dos 6 vizinhos mais próximos; valores q de Benjamini–Hochberg sobre todos
   os testes da coleção.

## Limitações

- Pessoa responsável é quem os moradores apontam como tal ao recenseador. Não quer dizer quem
  sustenta a casa, nem mãe solo: das casas paulistas com responsável mulher, 44% têm cônjuge.
- Nos setores, o IBGE troca por X as células de 1 ou 2 domicílios (nas categorias raras, os valores
  1 e 2 nunca aparecem publicados). Aqui o X vale 1,5, e cada taxa e diferença traz os limites com X =
  1 e X = 2 no pior caso (colunas `_lo` e `_hi`); setores inteiros em X ficam de fora. A soma dos
  setores reproduz a parte de responsáveis mulheres da tabela 9882 em cada município com erro de no
  máximo 0,45 ponto (mediana 0,01).
- A parcial com a urbanização cai para perto de zero nas áreas de ponderação porque a densidade
  carrega quase tudo: o que pesa é o tipo de bairro, não só o rótulo urbano ou rural.
- Leitura ecológica: o mapa compara lugares, não pessoas. Uma correlação entre municípios não diz
  que as mesmas casas têm as duas características, nem que uma causa a outra; urbanização, renda e
  idade podem estar por trás das duas.
