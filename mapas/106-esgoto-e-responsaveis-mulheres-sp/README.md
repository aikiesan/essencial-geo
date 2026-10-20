---
numero: 106
titulo: "O esgoto e o endereço"
subtitulo: "As casas com responsável mulher têm mais esgoto na rede porque ficam mais na cidade"
data: 2027-01-05
categoria: censo-renda
colecao: mulheres-responsaveis-sp
tags: [mulheres-responsaveis-sp, sao-paulo, censo-2022, saneamento, esgoto, genero, setores-censitarios, municipios]

contexto: >-
  No estado, 92,4% das casas com responsável mulher têm esgoto na rede, contra 90,1% das com responsável homem: +2,2 pontos. Quase tudo (+2,17) é endereço: as casas delas ficam mais nos setores urbanos já ligados à rede. Comparadas às casas de homens do mesmo setor censitário, sobram +0,07 ponto. Elas têm mais esgoto em 611 dos 645 municípios; Cunha tem a maior diferença (73% contra 47%), e em Cubatão elas têm menos (−2,4). Descontada a urbanização, a parte de responsáveis mulheres não se relaciona com a cobertura (parcial −0,04). Quarta prancha da coleção «Mulheres responsáveis pelo domicílio».

imagem: ./mapa_preview.png
imagem_alt: "Mapa coroplético dos 645 municípios de São Paulo pela diferença, em pontos percentuais, entre a parte das casas com responsável mulher e com responsável homem que têm esgoto na rede: ocre onde elas têm 1 ponto a menos ou mais, cinza entre −1 e +1, e quatro tons de lilás de +1 a +20 pontos ou mais. Quase todo o estado é lilás, mais escuro nos municípios com zona rural grande. Chamadas apontam Cunha, com +27 pontos, e Cubatão, com −2,4. No painel, a decomposição da diferença do estado em endereço e dentro do setor."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022: agregados por setores censitários (domicílio, parte 2; renda do responsável)"
    nome_en: "IBGE — 2022 Population Census: aggregates by census tract (households, part 2; income of the responsible person)"
    url: https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html
    ano: 2022
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
metodo: "Parte das casas com responsável mulher e com responsável homem com esgoto na rede, pela soma dos setores censitários do Censo 2022 (universo); diferença em pontos percentuais, decomposta em endereço e dentro do setor; seis classes; correlações de postos de Spearman, brutas e parciais."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#9972af", descricao: "645 municípios com as variáveis das oito pranchas, a classe bivariada b109 e os aglomerados LISA lisa103 e lisa109", descricao_en: "645 municipalities with the variables of all eight plates, the bivariate class b109 and the LISA clusters lisa103 and lisa109" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Diferença no estado, mulheres − homens"
    rotulo_en: "Gap statewide, women − men"
    valor: 2.24
    unidade: "pontos percentuais"
    unidade_en: "percentage points"
    nota: "endereço +2,17; dentro do setor +0,07"
    nota_en: "address +2.17; within the tract +0.07"
  - tipo: numero
    rotulo: "Municípios em que as casas delas têm mais esgoto na rede"
    rotulo_en: "Municipalities where women’s homes have more mains sewerage"
    valor: 611
    unidade: "municípios"
    unidade_en: "municipalities"
    nota: "menos em 13, robusto ao sigilo"
    nota_en: "less in 13, robust to confidentiality"
  - tipo: numero
    rotulo: "Correlação parcial com a parte de responsáveis mulheres"
    rotulo_en: "Partial correlation with the share of women responsible"
    valor: -0.04
    nota: "bruta 0,15"
    nota_en: "raw 0.15"

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
    url: https://github.com/aikiesan/essencial-geo/releases/download/mulheres-responsaveis-sp-2026/sp_esgoto_por_sexo_do_responsavel_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/mulheres-responsaveis-sp-2026/sp_esgoto_por_sexo_do_responsavel_2022_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,2 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

doi_automatico: true
versao: "1.0.0"
discussoes: []
---

# Esgoto na rede por sexo do responsável nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 106, a quarta de oito da coleção **Mulheres responsáveis pelo domicílio**; a anterior é a [prancha 105](../105-responsavel-nao-e-mae-solo-sp/README.md); a seguinte, a [prancha 107](../107-agua-e-responsaveis-mulheres-sp/README.md).

A coleção cruza a parte de domicílios com responsável mulher com os serviços da casa e da rua e com
a renda, nos 645 municípios de São Paulo. Antes dos mapas vieram os testes: correlação de postos
bruta e parcial (descontadas urbanização, densidade e renda), amostra efetiva corrigida pela
autocorrelação espacial, valores q de Benjamini–Hochberg, I de Moran, LISA, e a comparação entre
municípios e áreas de ponderação. A maior parte das relações com os serviços some quando se desconta
a urbanização: responsáveis mulheres são mais comuns nas cidades, e as cidades têm mais rede. As
relações fracas também viram mapa, como retrato descritivo, e o texto diz que são fracas.

As chamadas do mapa apontam Cunha, onde 73% das casas delas e 47% das deles têm esgoto na rede (+27
pontos, dos quais −0,1 dentro do setor), e Cubatão, onde elas têm menos (−2,4 pontos, entre −2,8 e
−2,0 com o sigilo).

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

1. `esgoto_rede_homem`, `esgoto_rede_mulher`, `esgoto_rede_dif` (com `_lo` e `_hi`),
   `esgoto_rede_dif_composicao` e `esgoto_rede_dif_setor`: domicílios com esgoto na rede geral ou
   pluvial ou em fossa séptica ligada à rede, em % das casas com responsável homem e mulher, e as
   diferenças em pontos percentuais (setores do Censo 2022, universo).
2. Classes da diferença: elas com 1 ponto a menos ou mais; −1 a +1; +1 a +5; +5 a +10; +10 a +20;
   +20 ou mais. Diferença mediana nos municípios: +6,8 pontos (endereço +6,5, dentro do setor +0,2).
3. Sinal robusto ao sigilo: elas têm mais em 611 municípios e menos em 13 mesmo no pior caso; em 3
   (Cubatão, Guarujá e Taquarivaí) a falta passa de 1 ponto. A largura mediana do intervalo do sigilo é
   de 0,8 ponto.
4. Decomposição da diferença entre mulheres e homens: a parte de «endereço» (onde elas moram) é a
   cobertura que as casas delas teriam se, em cada setor censitário, tivessem a mesma taxa das casas de
   homens do setor, menos a cobertura dos homens; a parte «dentro do setor» é o resto. O setor é a
   menor área publicada; dentro dele, o Censo não diz qual casa fica onde.
5. Parte de responsáveis mulheres × esgoto na rede (total): correlação de postos de Spearman 0,15
   (645 municípios), parcial −0,04, amostra efetiva 543, p < 0,001; nas áreas de ponderação, 0,24
   (parcial −0,05). Parte de responsáveis mulheres × diferença: correlação de postos de Spearman −0,26
   (645 municípios), parcial −0,08, amostra efetiva 583, p < 0,001.
6. Correlação parcial: correlação entre os resíduos dos postos de cada variável regredidos nos
   postos dos controles, que são urbanização (parte de moradores em situação urbana), log da densidade
   demográfica e log da renda média dos responsáveis; sai o controle da mesma família da variável.
   Amostra efetiva sob autocorrelação espacial: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), com Iₓ e Iᵧ o I de Moran dos
   resíduos numa vizinhança dos 6 vizinhos mais próximos; valores q de Benjamini–Hochberg sobre todos
   os testes da coleção.

## Limitações

- Nos setores, o IBGE troca por X as células de 1 ou 2 domicílios (nas categorias raras, os valores
  1 e 2 nunca aparecem publicados). Aqui o X vale 1,5, e cada taxa e diferença traz os limites com X =
  1 e X = 2 no pior caso (colunas `_lo` e `_hi`); setores inteiros em X ficam de fora. A soma dos
  setores reproduz a parte de responsáveis mulheres da tabela 9882 em cada município com erro de no
  máximo 0,45 ponto (mediana 0,01).
- O mapa compara as casas delas e as deles dentro de cada município; não diz que uma mulher que vira
  responsável passa a ter esgoto. A diferença acompanha onde as casas estão: nas cidades com zona
  rural grande (Cunha, Vale do Ribeira), as casas de homens ficam mais no campo, fora da rede.
- Pessoa responsável é quem os moradores apontam como tal ao recenseador. Não quer dizer quem
  sustenta a casa, nem mãe solo: das casas paulistas com responsável mulher, 44% têm cônjuge.
- Leitura ecológica: o mapa compara lugares, não pessoas. Uma correlação entre municípios não diz
  que as mesmas casas têm as duas características, nem que uma causa a outra; urbanização, renda e
  idade podem estar por trás das duas.
