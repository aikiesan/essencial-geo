---
numero: 104
titulo: "Dez pontos em doze anos"
subtitulo: "De 2010 a 2022, a parte de casas com responsável mulher subiu no campo e na cidade"
data: 2027-01-03
categoria: censo-renda
colecao: mulheres-responsaveis-sp
tags: [mulheres-responsaveis-sp, sao-paulo, censo-2022, domicilios, genero, censo-2010, municipios]

contexto: >-
  De 2010 a 2022, a parte dos domicílios paulistas com responsável mulher subiu de 39,0% para 49,2%: +10,3 pontos e 60% mais casas (de 5,00 para 7,99 milhões). Subiu em 627 dos 645 municípios; os 18 em que caiu são pequenos. Morro Agudo foi de 23% para 49%, o maior salto entre os de 20 mil habitantes ou mais; a capital, que já partia de 44%, chegou a 53%. O aumento não segue a urbanização (ρ −0,07) e foi maior onde a parte era menor em 2010 (ρ −0,58). Os dois Censos usam o mesmo conceito de responsável e o mesmo universo de domicílios. Segunda prancha da coleção «Mulheres responsáveis pelo domicílio».

imagem: ./mapa_preview.png
imagem_alt: "Mapa coroplético dos 645 municípios de São Paulo em cinco tons de lilás, da alta de 0 a 5 pontos percentuais (claro) à de 20 pontos ou mais (escuro), e em ocre os 18 municípios em que a parte de domicílios com responsável mulher caiu de 2010 a 2022. Os tons médios cobrem quase todo o estado. Chamadas apontam Morro Agudo, de 23% para 49%, e São Paulo, de 44% para 53%. No painel, a legenda com o número de municípios por classe e a comparação entre o estado, o município mediano e a capital."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2010, SIDRA tabela 3221 (domicílios por sexo da pessoa responsável, universo)"
    nome_en: "IBGE — 2010 Population Census, SIDRA table 3221 (households by sex of the responsible person, full count)"
    url: https://sidra.ibge.gov.br/tabela/3221
    ano: 2010
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
metodo: "Diferença, em pontos percentuais, entre a parte de domicílios com responsável mulher em 2022 (soma dos setores) e em 2010 (SIDRA 3221), por município, ambos do universo; cinco classes de alta e uma de queda; correlações de postos de Spearman."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#835ea3", descricao: "645 municípios com as variáveis das oito pranchas, a classe bivariada b109 e os aglomerados LISA lisa103 e lisa109", descricao_en: "645 municipalities with the variables of all eight plates, the bivariate class b109 and the LISA clusters lisa103 and lisa109" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Variação no estado, 2010–2022"
    rotulo_en: "Change statewide, 2010–2022"
    valor: 10.3
    unidade: "pontos percentuais"
    unidade_en: "percentage points"
    nota: "de 39,0% para 49,2%"
    nota_en: "from 39.0% to 49.2%"
  - tipo: numero
    rotulo: "Aumento dos domicílios com responsável mulher"
    rotulo_en: "Rise in households with a woman responsible"
    valor: 60
    unidade: "%"
    unidade_en: "%"
    nota: "5,00 → 7,99 milhões"
    nota_en: "5.00 → 7.99 million"
  - tipo: numero
    rotulo: "Municípios em que a parte subiu"
    rotulo_en: "Municipalities where the share rose"
    valor: 627
    unidade: "municípios"
    unidade_en: "municipalities"
    nota: "de 645"
    nota_en: "out of 645"

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
    url: https://github.com/aikiesan/essencial-geo/releases/download/mulheres-responsaveis-sp-2026/sp_responsaveis_mulheres_2010_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/mulheres-responsaveis-sp-2026/sp_responsaveis_mulheres_2010_2022_prancha.en.svg
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

# Variação da parte de domicílios com responsável mulher em São Paulo, 2010–2022

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 104, a segunda de oito da coleção **Mulheres responsáveis pelo domicílio**; a anterior é a [prancha 103](../103-quase-metade-das-casas-sp/README.md); a seguinte, a [prancha 105](../105-responsavel-nao-e-mae-solo-sp/README.md).

A coleção cruza a parte de domicílios com responsável mulher com os serviços da casa e da rua e com
a renda, nos 645 municípios de São Paulo. Antes dos mapas vieram os testes: correlação de postos
bruta e parcial (descontadas urbanização, densidade e renda), amostra efetiva corrigida pela
autocorrelação espacial, valores q de Benjamini–Hochberg, I de Moran, LISA, e a comparação entre
municípios e áreas de ponderação. A maior parte das relações com os serviços some quando se desconta
a urbanização: responsáveis mulheres são mais comuns nas cidades, e as cidades têm mais rede. As
relações fracas também viram mapa, como retrato descritivo, e o texto diz que são fracas.

As chamadas do mapa apontam Morro Agudo, que foi de 23% para 49% (+26 pontos, o maior salto entre os
de 20 mil habitantes ou mais), e São Paulo, de 44% para 53%.

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

1. `pct_resp_mulher_2010`: domicílios particulares permanentes com pessoa responsável mulher sobre o
   total, Censo 2010 (SIDRA 3221, universo). O total estadual da tabela, 12.827.153 domicílios, é o
   mesmo da tabela 3217, o que confirma o universo.
2. `pct_resp_mulher`: o mesmo em 2022, pela soma dos setores censitários (domicílio, parte 2,
   universo).
3. `var_resp_mulher`: a diferença em pontos percentuais. Classes: queda; 0 a 5; 5 a 10; 10 a 15; 15
   a 20; 20 ou mais. No município mediano, +11,9 pontos (de 32,7% para 45,4%).
4. Variação × urbanização: correlação de postos de Spearman −0,07 (645 municípios), parcial 0,04,
   amostra efetiva 624, p = 0,066; variação × parte em 2010: correlação de postos de Spearman −0,58
   (645 municípios), parcial −0,60, amostra efetiva 634, p < 0,001.
5. Correlação parcial: correlação entre os resíduos dos postos de cada variável regredidos nos
   postos dos controles, que são urbanização (parte de moradores em situação urbana), log da densidade
   demográfica e log da renda média dos responsáveis; sai o controle da mesma família da variável.
   Amostra efetiva sob autocorrelação espacial: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), com Iₓ e Iᵧ o I de Moran dos
   resíduos numa vizinhança dos 6 vizinhos mais próximos; valores q de Benjamini–Hochberg sobre todos
   os testes da coleção.

## Limitações

- A comparação é direta porque os dois Censos usam o mesmo conceito de pessoa responsável, o mesmo
  universo (domicílios particulares permanentes ocupados) e a mesma lista de 645 municípios. A malha é
  a de 2025; nenhum município paulista foi criado ou desmembrado no período.
- Os 18 municípios em que a parte caiu são pequenos (o maior tem 7.369 moradores); neles, poucas
  dezenas de casas mudam a taxa.
- O aumento pode vir de mudança na família (mais mulheres morando sem cônjuge, mais idosas viúvas) e
  também de mudança em quem a família aponta como responsável. O Censo não separa as duas coisas.
- Pessoa responsável é quem os moradores apontam como tal ao recenseador. Não quer dizer quem
  sustenta a casa, nem mãe solo: das casas paulistas com responsável mulher, 44% têm cônjuge.
- Leitura ecológica: o mapa compara lugares, não pessoas. Uma correlação entre municípios não diz
  que as mesmas casas têm as duas características, nem que uma causa a outra; urbanização, renda e
  idade podem estar por trás das duas.
