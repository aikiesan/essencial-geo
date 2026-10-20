---
numero: 108
titulo: "Luz na rua"
subtitulo: "O Censo 2022 não perguntou pela energia elétrica; a iluminação pública não segue o sexo do responsável"
data: 2026-11-03
categoria: censo-renda
colecao: mulheres-responsaveis-sp
tags: [mulheres-responsaveis-sp, sao-paulo, censo-2022, iluminacao-publica, energia, entorno, genero, municipios]

contexto: >-
  O Censo 2022 não perguntou pela energia elétrica; em 2010, 99,88% dos domicílios paulistas tinham energia (15 mil sem). O substituto mais próximo é a iluminação pública da Pesquisa Urbanística do Entorno: 2,1% das casas pesquisadas (325 mil) ficam em face de quadra sem luz na rua, e em 23 municípios são 10% ou mais (Sete Barras, 26%; Juquitiba, 22%). A pesquisa cobre os setores que o IBGE percorreu, quase todos urbanos, e não separa por sexo do responsável. A relação com a parte de responsáveis mulheres é fraca e não passa no teste (ρ −0,08; parcial −0,02): o mapa fica como retrato descritivo. Sexta prancha da coleção «Mulheres responsáveis pelo domicílio».

imagem: ./mapa_preview.png
imagem_alt: "Mapa coroplético dos 645 municípios de São Paulo em cinco tons de ocre-amarronzado, do claro (menos de 1% dos domicílios pesquisados sem iluminação pública) ao escuro (10% ou mais). Os tons escuros se juntam no sul e no sudeste do estado, no Vale do Ribeira e na serra perto da metrópole; o oeste é quase todo claro. Chamadas apontam Sete Barras, com 26%, e Juquitiba, com 22%. No painel, os números de 2010 sobre energia elétrica, a legenda com o número de municípios por classe e a correlação, fraca, com a parte de responsáveis mulheres."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022, SIDRA tabela 9583 (iluminação pública no entorno dos domicílios, Pesquisa Urbanística do Entorno)"
    nome_en: "IBGE — 2022 Population Census, SIDRA table 9583 (street lighting around homes, Urban Surroundings Survey)"
    url: https://sidra.ibge.gov.br/tabela/9583
    ano: 2022
  - nome: "IBGE — Censo Demográfico 2022, SIDRA tabela 9882 (domicílios por presença de cônjuge e filhos e sexo do responsável, universo)"
    nome_en: "IBGE — 2022 Population Census, SIDRA table 9882 (households by presence of spouse and children and sex of the responsible person, full count)"
    url: https://sidra.ibge.gov.br/tabela/9882
    ano: 2022
  - nome: "IBGE — Censo Demográfico 2010, SIDRA tabela 3217 (domicílios por existência de energia elétrica, universo)"
    nome_en: "IBGE — 2010 Population Census, SIDRA table 3217 (households by access to electricity, full count)"
    url: https://sidra.ibge.gov.br/tabela/3217
    ano: 2010
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Domicílios em face de quadra sem iluminação pública sobre os domicílios dos setores da Pesquisa Urbanística do Entorno, por município (SIDRA 9583, Censo 2022); cinco classes; correlação de postos de Spearman com a parte de responsáveis mulheres, bruta e parcial. Energia elétrica de 2010 (SIDRA 3217) como referência."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#a68647", descricao: "645 municípios com as variáveis das oito pranchas, a classe bivariada b109 e os aglomerados LISA lisa103 e lisa109", descricao_en: "645 municipalities with the variables of all eight plates, the bivariate class b109 and the LISA clusters lisa103 and lisa109" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Domicílios pesquisados sem iluminação pública"
    rotulo_en: "Surveyed homes without street lighting"
    valor: 2.1
    unidade: "%"
    unidade_en: "%"
    nota: "325 mil domicílios"
    nota_en: "325 thousand homes"
  - tipo: numero
    rotulo: "Domicílios com energia elétrica em 2010"
    rotulo_en: "Homes with electricity in 2010"
    valor: 99.88
    unidade: "%"
    unidade_en: "%"
    nota: "15.084 sem"
    nota_en: "15,084 without"
  - tipo: numero
    rotulo: "Correlação com a parte de responsáveis mulheres"
    rotulo_en: "Correlation with the share of women responsible"
    valor: -0.08
    nota: "parcial −0,02; não significativa"
    nota_en: "partial −0.02; not significant"

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
    url: https://github.com/aikiesan/essencial-geo/releases/download/mulheres-responsaveis-sp-2026/sp_iluminacao_publica_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/mulheres-responsaveis-sp-2026/sp_iluminacao_publica_2022_prancha.en.svg
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

# Domicílios sem iluminação pública nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 108, a sexta de oito da coleção **Mulheres responsáveis pelo domicílio**; a anterior é a [prancha 107](../107-agua-e-responsaveis-mulheres-sp/README.md); a seguinte, a [prancha 109](../109-renda-e-responsaveis-mulheres-sp/README.md).

A coleção cruza a parte de domicílios com responsável mulher com os serviços da casa e da rua e com
a renda, nos 645 municípios de São Paulo. Antes dos mapas vieram os testes: correlação de postos
bruta e parcial (descontadas urbanização, densidade e renda), amostra efetiva corrigida pela
autocorrelação espacial, valores q de Benjamini–Hochberg, I de Moran, LISA, e a comparação entre
municípios e áreas de ponderação. A maior parte das relações com os serviços some quando se desconta
a urbanização: responsáveis mulheres são mais comuns nas cidades, e as cidades têm mais rede. As
relações fracas também viram mapa, como retrato descritivo, e o texto diz que são fracas.

As chamadas do mapa apontam Sete Barras, com 26% das casas pesquisadas sem luz na rua (a maior parte
entre os de 5 mil habitantes ou mais), e Juquitiba, com 22%, de chácaras e loteamentos da serra na
metrópole.

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

1. Energia elétrica: o questionário de 2022 não tem a pergunta, e nem o dicionário dos setores nem o
   catálogo do SIDRA trazem a variável para 2022. Em 2010 (SIDRA 3217, universo), 99,88% dos domicílios
   paulistas tinham energia e 15.084 não tinham.
2. `pct_iluminacao` e `pct_sem_iluminacao`: domicílios particulares permanentes ocupados em face de
   quadra com e sem iluminação pública, sobre o total dos domicílios dos setores pesquisados (SIDRA
   9583, Pesquisa Urbanística do Entorno, Censo 2022). `cobertura_entorno` é a parte dos domicílios do
   município que está nesses setores.
3. Classes: menos de 1%, 1 a 2%, 2 a 5%, 5 a 10% e 10% ou mais. 62 municípios não têm nenhuma casa
   pesquisada sem luz na rua. No município mediano, 89% das casas estão na pesquisa (mínimo 23%).
4. Parte de responsáveis mulheres × parte com iluminação pública: correlação de postos de Spearman
   −0,08 (645 municípios), parcial −0,02, amostra efetiva 564, p = 0,069; q da parcial 0,65.
5. Correlação parcial: correlação entre os resíduos dos postos de cada variável regredidos nos
   postos dos controles, que são urbanização (parte de moradores em situação urbana), log da densidade
   demográfica e log da renda média dos responsáveis; sai o controle da mesma família da variável.
   Amostra efetiva sob autocorrelação espacial: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), com Iₓ e Iᵧ o I de Moran dos
   resíduos numa vizinhança dos 6 vizinhos mais próximos; valores q de Benjamini–Hochberg sobre todos
   os testes da coleção.

## Limitações

- Iluminação pública não é energia elétrica: fala da rua, não da casa. É o substituto mais próximo
  publicado em 2022, mas outra coisa.
- A Pesquisa Urbanística do Entorno cobre os setores que o IBGE percorreu, quase todos urbanos; em
  municípios com zona rural grande, boa parte das casas fica de fora, e a taxa descreve só a parte
  urbana.
- A tabela não separa por sexo do responsável; a comparação com as responsáveis mulheres só pode ser
  entre municípios, e ela não aparece.
- Leitura ecológica: o mapa compara lugares, não pessoas. Uma correlação entre municípios não diz
  que as mesmas casas têm as duas características, nem que uma causa a outra; urbanização, renda e
  idade podem estar por trás das duas.
