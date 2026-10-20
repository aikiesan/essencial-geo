---
numero: 100
titulo: "As letras e a enxada"
subtitulo: "Onde mais gente trabalha no campo, maior o hiato entre o analfabetismo de negros e o de brancos"
data: 2026-10-27
categoria: censo-renda
colecao: censo-cruzado-sp
tags: [censo-cruzado-sp, sao-paulo, censo-2022, analfabetismo, desigualdade-racial, trabalho-rural, educacao, municipios]

contexto: >-
  Onde mais gente trabalha no campo, maior a distância entre o analfabetismo de negros e o de brancos. A correlação de postos entre a parte dos ocupados como trabalhadores qualificados da agropecuária e o hiato, em pontos percentuais, entre a taxa de analfabetismo de pretos e pardos e a de brancos de 15 anos ou mais (Censo 2022) é 0,51 nos 645 municípios e 0,33 descontadas urbanização, densidade e renda; 122 municípios estão no terço de cima dos dois. Dois Córregos tem hiato de 5,8 pontos e 6,5% dos ocupados no campo; São Paulo, 2,0. O mapa não diz que o trabalho rural produza o hiato: os dois carregam a mesma história de escola desigual no interior. Oitava prancha da coleção «O Censo cruzado».

imagem: ./mapa_preview.png
imagem_alt: "Mapa bivariado dos municípios de São Paulo em nove cores, de uma grade de três por três: o ocre cresce no eixo de ocupados na agropecuária e o lilás, no de hiato racial de analfabetismo; o marrom-escuro marca os municípios no terço de cima dos dois. Chamadas apontam Dois Córregos, com hiato de 5,8 pontos e 6,5% dos ocupados no campo; São Miguel Arcanjo, com 19% dos ocupados no campo e hiato de 1,8 ponto; e São Paulo, com 2,0 pontos. No painel, a grade com o número de municípios em cada casa, os limites dos terços e a tabela das correlações."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022, SIDRA tabela 9542 (alfabetização por cor ou raça, universo)"
    nome_en: "IBGE — 2022 Population Census, SIDRA table 9542 (literacy by colour or race, full count)"
    url: https://sidra.ibge.gov.br/tabela/9542
    ano: 2022
  - nome: "IBGE — Censo Demográfico 2022, SIDRA tabela 10264 (ocupação por grupos, amostra)"
    nome_en: "IBGE — 2022 Population Census, SIDRA table 10264 (occupation by group, sample)"
    url: https://sidra.ibge.gov.br/tabela/10264
    ano: 2022
  - nome: "MapBiomas — Coleção 10 da Série Anual de Mapas de Uso e Cobertura da Terra do Brasil, 2024"
    nome_en: "MapBiomas — Collection 10 of the Annual Series of Land Use and Land Cover Maps of Brazil, 2024"
    url: https://brasil.mapbiomas.org/colecoes-mapbiomas/
    ano: 2024
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Ocupados na agropecuária e hiato racial de analfabetismo por município (IBGE, MapBiomas), cada um dividido em terços; o cruzamento dá nove classes. Correlação de postos de Spearman, parcial descontados os controles, amostra efetiva corrigida pela autocorrelação espacial e LISA bivariado."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#804d36", descricao: "645 municípios com as variáveis das dez pranchas, as classes bivariadas (b093 a b101) e os aglomerados LISA (lisa093 a lisa102)", descricao_en: "645 municipalities with the variables of all ten plates, the bivariate classes (b093 to b101) and the LISA clusters (lisa093 to lisa102)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Correlação de postos entre trabalho no campo e hiato"
    rotulo_en: "Rank correlation between farm work and the gap"
    valor: 0.51
    nota: "parcial 0,33"
    nota_en: "partial 0.33"
  - tipo: numero
    rotulo: "Municípios no terço de cima dos dois"
    rotulo_en: "Municipalities in the top third of both"
    valor: 122
    unidade: "municípios"
    unidade_en: "municipalities"
  - tipo: numero
    rotulo: "Hiato de analfabetismo em Dois Córregos"
    rotulo_en: "Illiteracy gap in Dois Córregos"
    valor: 5.8
    unidade: "pontos"
    unidade_en: "points"

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
    url: https://github.com/aikiesan/essencial-geo/releases/download/censo-cruzado-sp-2026/sp_analfabetismo_racial_e_agro_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/censo-cruzado-sp-2026/sp_analfabetismo_racial_e_agro_2022_prancha.en.svg
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

# Trabalho na agropecuária e hiato racial de analfabetismo nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 100, a oitava de dez da coleção **O Censo cruzado**; a anterior é a [prancha 099](../099-envelhecer-sozinho-sp/README.md); a seguinte, a [prancha 101](../101-casas-de-veraneio-sem-esgoto-sp/README.md).

A coleção nasceu de uma triagem: 4.455 pares de variáveis municipais (Censo 2022 e as bases de
outras pranchas do atlas), dos quais 4.114 ligam famílias diferentes. 834 têm correlação de postos
de 0,3 ou mais e passam no teste com a amostra efetiva corrigida pela autocorrelação espacial (q <
0,05, Benjamini–Hochberg); 277 seguem acima de 0,3 descontadas urbanização, densidade e renda. Nove
das dez pranchas saem desse último grupo; a do pau de arara fica um pouco abaixo (parcial 0,27) e
entra pelo dado raro.

As chamadas do mapa apontam Dois Córregos, com hiato de 5,8 pontos e 6,5% dos ocupados no campo; São
Miguel Arcanjo, com 19% dos ocupados no campo e hiato de 1,8 ponto; e São Paulo, com 2,0 pontos.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios com as variáveis das dez pranchas; nesta, `pct_ocup_agro`, `hiato_analfabetismo`, a classe `b100` (11 a 33: dezena = terço de ocupados na agropecuária, unidade = terço de hiato racial de analfabetismo) e o aglomerado `lisa100` |
| `apond` | polígono | 2.535 áreas de ponderação do estado com idade, cor ou raça, domicílios e renda dos responsáveis |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

O **GPKG** é o mesmo nas dez pranchas e traz um estilo do QGIS para cada uma. O **CSV** tem a tabela
dos municípios, sem geometria. Os aglomerados LISA vêm como `AA` (alto-alto), `BB` (baixo-baixo),
`AB` (primeira variável alta, segunda baixa), `BA` e `ns` (não significativo).

## Método

1. `pct_ocup_agro`: pessoas ocupadas no grande grupo “trabalhadores qualificados da agropecuária,
   florestais, da caça e da pesca” sobre o total de ocupados (Censo 2022, amostra).
2. `hiato_analfabetismo`: taxa de analfabetismo das pessoas pretas e pardas de 15 anos ou mais menos
   a das brancas, em pontos percentuais (Censo 2022, universo). Só entra onde os dois grupos somam 200
   pessoas ou mais.
3. Terços dos municípios com dado, fechados à direita: ocupados no campo até 2,7%, 2,7% a 6,2% e
   mais de 6,2%; hiato até 2,2, 2,2 a 3,2 e mais de 3,2 pontos. A classe junta os dois terços (122
   municípios no terço de cima dos dois, 125 no de baixo dos dois).
4. Correlação de postos de Spearman (0,51, 645 municípios) e correlação parcial: correlação entre os
   resíduos dos postos de cada variável regredidos nos postos dos controles, urbanização (moradores em
   situação urbana), log da densidade demográfica e log da renda domiciliar per capita. Resultado:
   0,33; 0,32 sem a Região Intermediária de São Paulo.
5. Amostra efetiva sob autocorrelação espacial: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), com Iₓ e Iᵧ o I de Moran
   dos resíduos parciais numa vizinhança dos 6 municípios mais próximos. Aqui, 598 municípios efetivos;
   o teste da parcial com essa amostra dá p < 0,001.
6. Moran bivariado (0,24) e LISA bivariado sobre os postos padronizados, 6 vizinhos, 999 permutações
   (semente 20261019), p < 0,05: 41 municípios em aglomerados alto-alto e 80 em baixo-baixo.
7. Pares de apoio na tabela da prancha: campo × analfabetismo geral: 0,67 (parcial 0,28); cana ×
   hiato de analfabetismo: 0,22 (parcial 0,24).

## Limitações

- Leitura ecológica: o mapa compara municípios, não pessoas. Uma correlação entre municípios não diz
  que as mesmas pessoas têm as duas características, nem que uma causa a outra; renda, idade, história
  de ocupação e o tamanho da cidade podem estar por trás das duas.
- O hiato cresce, em parte, porque o analfabetismo geral é maior onde há mais trabalho rural (ρ
  0,67): onde quase todos sabem ler, a diferença entre grupos é pequena por construção.
- A taxa é de analfabetismo declarado, concentrado nas gerações mais velhas; ela mede a escola do
  passado mais do que a de hoje.
- A parte dos ocupados na agropecuária vem da amostra do Censo 2022: são estimativas expandidas pelo
  IBGE, com erro amostral que cresce quanto menor o município. Diferenças pequenas entre municípios
  pequenos podem ser ruído; por isso a prancha usa terços, e não classes finas. Onde o IBGE marca X
  (sigilo), o campo fica vazio, nunca zero.
- Os terços são relativos aos municípios paulistas: o terço de baixo de São Paulo pode estar acima
  da média de outros estados.
