---
numero: 97
titulo: "O prédio e a desigualdade"
subtitulo: "Quanto mais a cidade sobe, mais a renda varia de um bairro para outro"
data: 2026-10-27
categoria: censo-renda
colecao: censo-cruzado-sp
tags: [censo-cruzado-sp, sao-paulo, censo-2022, verticalizacao, desigualdade, renda, apartamentos, setores-censitarios, municipios]

contexto: >-
  Quanto mais a cidade sobe, mais a renda varia de um bairro para outro. A correlação de postos entre a desigualdade de renda entre setores censitários (coeficiente de variação ponderado do rendimento dos responsáveis) e a parte dos domicílios em apartamento (Censo 2022) é 0,69 em 570 municípios e 0,45 descontadas urbanização, densidade e renda. São Paulo tem 36% dos domicílios em apartamento e coeficiente 0,94; Barueri, 31% e 1,02. Em 253 municípios não há nenhum domicílio em apartamento. O prédio marca a cidade que se divide em bairros ricos e pobres, sem que o mapa diga qual veio antes. Quinta prancha da coleção «O Censo cruzado».

imagem: ./mapa_preview.png
imagem_alt: "Mapa bivariado dos municípios de São Paulo em nove cores, de uma grade de três por três: o ocre cresce no eixo de desigualdade de renda entre setores e o lilás, no de domicílios em apartamento; o marrom-escuro marca os municípios no terço de cima dos dois. O marrom-escuro se concentra no leste, da Grande São Paulo a Campinas e ao Vale do Paraíba; os municípios com menos de 10 setores aparecem hachurados. Chamadas apontam São Paulo, com 36% dos domicílios em apartamento e coeficiente de 0,94; Barueri, com 31% e 1,02, o maior acima de 200 mil habitantes; e Cordeirópolis, com 6,2% e renda parecida em toda a cidade. No painel, a grade com o número de municípios em cada casa, os limites dos terços e a tabela das correlações."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022: agregados por setores censitários"
    nome_en: "IBGE — 2022 Population Census: aggregates by census tract"
    url: https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Desigualdade de renda entre setores e domicílios em apartamento por município (IBGE), cada um dividido em terços; o cruzamento dá nove classes. Correlação de postos de Spearman, parcial descontados os controles, amostra efetiva corrigida pela autocorrelação espacial e LISA bivariado."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#804d36", descricao: "645 municípios com as variáveis das dez pranchas, as classes bivariadas (b093 a b101) e os aglomerados LISA (lisa093 a lisa102)", descricao_en: "645 municipalities with the variables of all ten plates, the bivariate classes (b093 to b101) and the LISA clusters (lisa093 to lisa102)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Correlação de postos entre desigualdade e apartamentos"
    rotulo_en: "Rank correlation between inequality and flats"
    valor: 0.69
    nota: "parcial 0,45"
    nota_en: "partial 0.45"
  - tipo: numero
    rotulo: "Municípios no terço de cima dos dois"
    rotulo_en: "Municipalities in the top third of both"
    valor: 143
    unidade: "municípios"
    unidade_en: "municipalities"
  - tipo: numero
    rotulo: "Municípios sem nenhum domicílio em apartamento"
    rotulo_en: "Municipalities with no homes in flats"
    valor: 253
    unidade: "municípios"
    unidade_en: "municipalities"

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
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/censo-cruzado-sp-2026/sp_apartamentos_e_desigualdade_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/censo-cruzado-sp-2026/sp_apartamentos_e_desigualdade_2022_prancha.en.svg
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

# Verticalização e desigualdade de renda entre setores nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 097, a quinta de dez da coleção **O Censo cruzado**; a anterior é a [prancha 096](../096-segregacao-e-desigualdade-racial-sp/README.md); a seguinte, a [prancha 098](../098-a-cor-da-juventude-sp/README.md).

A coleção nasceu de uma triagem: 4.455 pares de variáveis municipais (Censo 2022 e as bases de
outras pranchas do atlas), dos quais 4.114 ligam famílias diferentes. 834 têm correlação de postos
de 0,3 ou mais e passam no teste com a amostra efetiva corrigida pela autocorrelação espacial (q <
0,05, Benjamini–Hochberg); 277 seguem acima de 0,3 descontadas urbanização, densidade e renda. Nove
das dez pranchas saem desse último grupo; a do pau de arara fica um pouco abaixo (parcial 0,27) e
entra pelo dado raro.

As chamadas do mapa apontam São Paulo, com 36% dos domicílios em apartamento e coeficiente de 0,94;
Barueri, com 31% e 1,02, o maior acima de 200 mil habitantes; e Cordeirópolis, com 6,2% e renda
parecida em toda a cidade.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios com as variáveis das dez pranchas; nesta, `cv_renda_setores`, `pct_apartamento`, a classe `b097` (11 a 33: dezena = terço de desigualdade de renda entre setores, unidade = terço de domicílios em apartamento) e o aglomerado `lisa097` |
| `apond` | polígono | 2.535 áreas de ponderação do estado com idade, cor ou raça, domicílios e renda dos responsáveis |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

O **GPKG** é o mesmo nas dez pranchas e traz um estilo do QGIS para cada uma. O **CSV** tem a tabela
dos municípios, sem geometria. Os aglomerados LISA vêm como `AA` (alto-alto), `BB` (baixo-baixo),
`AB` (primeira variável alta, segunda baixa), `BA` e `ns` (não significativo).

## Método

1. `cv_renda_setores`: coeficiente de variação do rendimento médio dos responsáveis pelos domicílios
   entre os setores censitários do município, ponderado pelo número de responsáveis (um por domicílio)
   de cada setor (Censo 2022, universo). Só entram municípios com 10 setores com dado ou mais.
2. `pct_apartamento`: domicílios particulares ocupados do tipo apartamento (Censo 2022, universo).
3. Terços dos municípios com dado, fechados à direita: coeficiente até 0,25, 0,25 a 0,40 e mais de
   0,40; apartamentos: nenhum, até 1,5% e mais de 1,5% (o terço de baixo é o dos municípios sem
   apartamento). A classe junta os dois terços (143 municípios no terço de cima dos dois, 130 no de
   baixo dos dois).
4. Correlação de postos de Spearman (0,69, 570 municípios) e correlação parcial: correlação entre os
   resíduos dos postos de cada variável regredidos nos postos dos controles, urbanização (moradores em
   situação urbana), log da densidade demográfica e log da renda domiciliar per capita. Resultado:
   0,45; 0,45 sem a Região Intermediária de São Paulo.
5. Amostra efetiva sob autocorrelação espacial: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), com Iₓ e Iᵧ o I de Moran
   dos resíduos parciais numa vizinhança dos 6 municípios mais próximos. Aqui, 519 municípios efetivos;
   o teste da parcial com essa amostra dá p < 0,001.
6. Moran bivariado (0,25) e LISA bivariado sobre os postos padronizados, 6 vizinhos, 999 permutações
   (semente 20261019), p < 0,05: 91 municípios em aglomerados alto-alto e 54 em baixo-baixo.
7. Pares de apoio na tabela da prancha: desigualdade × renda per capita: 0,50 (parcial 0,30);
   desigualdade × moradores em favelas: 0,40 (parcial 0,17).

## Limitações

- Leitura ecológica: o mapa compara municípios, não pessoas. Uma correlação entre municípios não diz
  que as mesmas pessoas têm as duas características, nem que uma causa a outra; renda, idade, história
  de ocupação e o tamanho da cidade podem estar por trás das duas.
- O coeficiente cresce com o número de setores e, portanto, com o tamanho da cidade; o controle por
  urbanização e densidade reduz esse efeito, mas não o elimina.
- O rendimento dos responsáveis é o do universo do Censo, sem erro amostral, mas não inclui a renda
  dos outros moradores.
- As duas variáveis vêm do universo do Censo 2022 (ou de bases administrativas e de mapeamento por
  satélite), sem erro amostral; onde o IBGE marca X (sigilo), o campo fica vazio, nunca zero.
- Os terços são relativos aos municípios paulistas: o terço de baixo de São Paulo pode estar acima
  da média de outros estados.
