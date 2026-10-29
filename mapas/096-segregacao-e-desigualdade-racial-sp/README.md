---
numero: 96
titulo: "Separados e desiguais"
subtitulo: "Nas cidades mais segregadas, a renda dos brancos fica mais longe da dos pardos"
data: 2026-10-27
categoria: censo-renda
colecao: censo-cruzado-sp
tags: [censo-cruzado-sp, sao-paulo, censo-2022, segregacao, desigualdade-racial, renda, cor-ou-raca, setores-censitarios, municipios]
rascunho: true                      # fora do ar: resguardo de artigo em preparação

contexto: >-
  Nas cidades onde brancos e não brancos moram mais separados, a renda dos brancos fica mais longe da dos pardos. A correlação de postos entre o índice de dissimilaridade, medido nos setores censitários, e a razão entre a renda domiciliar per capita mediana de brancos e de pardos (Censo 2022) é 0,43 em 588 municípios e 0,38 descontadas urbanização e densidade. Campinas tem índice 34 e renda dos brancos 1,7 vez a dos pardos; Diadema, índice 14 e razão 1,17. O mapa não diz se a segregação produz a desigualdade, se a desigualdade produz a segregação ou se as duas vêm da mesma história. Quarta prancha da coleção «O Censo cruzado».

imagem: ./mapa_preview.png
imagem_alt: "Mapa bivariado dos municípios de São Paulo em nove cores, de uma grade de três por três: o ocre cresce no eixo de segregação entre brancos e não brancos e o lilás, no de razão de renda entre brancos e pardos; o marrom-escuro marca os municípios no terço de cima dos dois. Os municípios com menos de 10 setores aparecem hachurados. Chamadas apontam Campinas, com índice de dissimilaridade 34 e renda dos brancos 1,7 vez a dos pardos, e Diadema, com índice 14 e razão de 1,17. No painel, a grade com o número de municípios em cada casa, os limites dos terços e a tabela das correlações."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022: agregados por setores censitários"
    nome_en: "IBGE — 2022 Population Census: aggregates by census tract"
    url: https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "IBGE — Censo Demográfico 2022, SIDRA tabela 10295 (rendimento domiciliar per capita por cor ou raça, amostra)"
    nome_en: "IBGE — 2022 Population Census, SIDRA table 10295 (household income per head by colour or race, sample)"
    url: https://sidra.ibge.gov.br/tabela/10295
    ano: 2022
  - nome: "IBGE — Censo Demográfico 2022, SIDRA tabela 10062 (anos de estudo por cor ou raça, amostra)"
    nome_en: "IBGE — 2022 Population Census, SIDRA table 10062 (years of schooling by colour or race, sample)"
    url: https://sidra.ibge.gov.br/tabela/10062
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Segregação entre brancos e não brancos e razão de renda entre brancos e pardos por município (IBGE), cada um dividido em terços; o cruzamento dá nove classes. Correlação de postos de Spearman, parcial descontados os controles, amostra efetiva corrigida pela autocorrelação espacial e LISA bivariado."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#804d36", descricao: "645 municípios com as variáveis das dez pranchas, as classes bivariadas (b093 a b101) e os aglomerados LISA (lisa093 a lisa102)", descricao_en: "645 municipalities with the variables of all ten plates, the bivariate classes (b093 to b101) and the LISA clusters (lisa093 to lisa102)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Correlação de postos entre segregação e razão de renda"
    rotulo_en: "Rank correlation between segregation and income ratio"
    valor: 0.43
    nota: "parcial 0,38"
    nota_en: "partial 0.38"
  - tipo: numero
    rotulo: "Municípios no terço de cima dos dois"
    rotulo_en: "Municipalities in the top third of both"
    valor: 103
    unidade: "municípios"
    unidade_en: "municipalities"
  - tipo: numero
    rotulo: "Índice de dissimilaridade em Campinas"
    rotulo_en: "Dissimilarity index in Campinas"
    valor: 34

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
    url: https://github.com/aikiesan/essencial-geo/releases/download/censo-cruzado-sp-2026/sp_segregacao_e_renda_racial_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/censo-cruzado-sp-2026/sp_segregacao_e_renda_racial_2022_prancha.en.svg
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

# Segregação residencial e desigualdade de renda entre brancos e pardos nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 096, a quarta de dez da coleção **O Censo cruzado**; a anterior é a [prancha 095](../095-o-oeste-do-boi-envelhece-sp/README.md); a seguinte, a [prancha 097](../097-verticalizacao-e-desigualdade-sp/README.md).

A coleção nasceu de uma triagem: 4.455 pares de variáveis municipais (Censo 2022 e as bases de
outras pranchas do atlas), dos quais 4.114 ligam famílias diferentes. 834 têm correlação de postos
de 0,3 ou mais e passam no teste com a amostra efetiva corrigida pela autocorrelação espacial (q <
0,05, Benjamini–Hochberg); 277 seguem acima de 0,3 descontadas urbanização, densidade e renda. Nove
das dez pranchas saem desse último grupo; a do pau de arara fica um pouco abaixo (parcial 0,27) e
entra pelo dado raro.

As chamadas do mapa apontam Campinas, com índice de dissimilaridade 34 e renda dos brancos 1,7 vez a
dos pardos, e Diadema, com índice 14 e razão de 1,17.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios com as variáveis das dez pranchas; nesta, `segregacao_racial`, `razao_renda_raca`, a classe `b096` (11 a 33: dezena = terço de segregação entre brancos e não brancos, unidade = terço de razão de renda entre brancos e pardos) e o aglomerado `lisa096` |
| `apond` | polígono | 2.535 áreas de ponderação do estado com idade, cor ou raça, domicílios e renda dos responsáveis |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

O **GPKG** é o mesmo nas dez pranchas e traz um estilo do QGIS para cada uma. O **CSV** tem a tabela
dos municípios, sem geometria. Os aglomerados LISA vêm como `AA` (alto-alto), `BB` (baixo-baixo),
`AB` (primeira variável alta, segunda baixa), `BA` e `ns` (não significativo).

## Método

1. `segregacao_racial`: índice de dissimilaridade entre pessoas brancas e não brancas, as não
   brancas sendo a população menos as brancas (pretas, pardas, amarelas e indígenas), calculado sobre
   os setores censitários de cada município, de 0 (mesma composição em todos os setores) a 100
   (separação total). Só entram municípios com 10 setores com dado ou mais e 200 pessoas ou mais em
   cada grupo.
2. `razao_renda_raca`: rendimento domiciliar per capita mediano das pessoas brancas dividido pelo
   das pessoas pardas (Censo 2022, amostra). A comparação é com os pardos, o maior grupo não branco do
   estado, o que deixa a estimativa de amostra mais estável.
3. Terços dos municípios com dado, fechados à direita: dissimilaridade até 15,4, 15,4 a 20,1 e mais
   de 20,1; razão de renda até 1,20, 1,20 a 1,30 e mais de 1,30. Os 57 municípios com menos de 10
   setores ficam hachurados. A classe junta os dois terços (103 municípios no terço de cima dos dois,
   104 no de baixo dos dois).
4. Correlação de postos de Spearman (0,43, 588 municípios) e correlação parcial: correlação entre os
   resíduos dos postos de cada variável regredidos nos postos dos controles, urbanização e densidade (a
   renda fica de fora, porque a variável do eixo vertical já é de renda). Resultado: 0,38; 0,33 sem a
   Região Intermediária de São Paulo.
5. Amostra efetiva sob autocorrelação espacial: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), com Iₓ e Iᵧ o I de Moran
   dos resíduos parciais numa vizinhança dos 6 municípios mais próximos. Aqui, 579 municípios efetivos;
   o teste da parcial com essa amostra dá p < 0,001.
6. Moran bivariado (0,14) e LISA bivariado sobre os postos padronizados, 6 vizinhos, 999 permutações
   (semente 20261019), p < 0,05: 30 municípios em aglomerados alto-alto e 41 em baixo-baixo.
7. Pares de apoio na tabela da prancha: segregação × hiato de anos de estudo entre brancos e pardos:
   0,44 (parcial 0,39).

## Limitações

- Leitura ecológica: o mapa compara municípios, não pessoas. Uma correlação entre municípios não diz
  que as mesmas pessoas têm as duas características, nem que uma causa a outra; renda, idade, história
  de ocupação e o tamanho da cidade podem estar por trás das duas.
- O índice depende do tamanho dos setores e do número deles: cidades com poucos setores tendem a
  índices mais baixos ou instáveis, e por isso as de menos de 10 setores ficam de fora.
- O Moran bivariado é baixo (0,14): o par não forma grandes regiões no mapa, aparece em cidades
  espalhadas pelo estado.
- A razão de renda (e o hiato de anos de estudo da tabela) vem da amostra do Censo 2022: são
  estimativas expandidas pelo IBGE, com erro amostral que cresce quanto menor o município. Diferenças
  pequenas entre municípios pequenos podem ser ruído; por isso a prancha usa terços, e não classes
  finas. Onde o IBGE marca X (sigilo), o campo fica vazio, nunca zero.
- A dissimilaridade mede separação entre setores, não convivência no trabalho, na escola ou na rua.
- Os terços são relativos aos municípios paulistas: o terço de baixo de São Paulo pode estar acima
  da média de outros estados.
