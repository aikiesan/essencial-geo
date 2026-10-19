---
numero: 95
titulo: "O oeste do boi envelhece"
subtitulo: "Onde há mais boi por quilômetro quadrado, há mais gente com 60 anos ou mais"
data: 2026-12-25
categoria: censo-renda
colecao: censo-cruzado-sp
tags: [censo-cruzado-sp, sao-paulo, censo-2022, envelhecimento, pecuaria, bovinos, ppm, municipios]

contexto: >-
  Onde há mais boi por quilômetro quadrado, a população é mais velha. A correlação de postos entre a densidade de bovinos (Pesquisa da Pecuária Municipal 2024) e a parte das pessoas com 60 anos ou mais (Censo 2022) é 0,52 em 617 municípios e 0,41 descontadas urbanização, densidade e renda; 120 municípios estão no terço de cima dos dois. Jales tem 110 bois por km² e 22,2% de idosos. A cana não mostra o mesmo laço (ρ 0,09): o padrão é do pasto, que emprega pouca gente por hectare. Os jovens saem e quem fica envelhece é uma hipótese que o mapa sustenta, mas não prova. Terceira prancha da coleção «O Censo cruzado».

imagem: ./mapa_preview.png
imagem_alt: "Mapa bivariado dos municípios de São Paulo em nove cores, de uma grade de três por três: o ocre cresce no eixo de bovinos por km² e o lilás, no de pessoas com 60 anos ou mais; o marrom-escuro marca os municípios no terço de cima dos dois. Os municípios sem rebanho informado aparecem hachurados. Chamadas apontam Jales, com 110 bois por km² e 22,2% de pessoas com 60 anos ou mais; São José dos Campos, com 75 bois por km² e só 17,0%; e Socorro, com 23,4% entre pastos de morro. No painel, a grade com o número de municípios em cada casa, os limites dos terços e a tabela das correlações."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Pesquisa da Pecuária Municipal 2024, tabela 3939 (efetivo dos rebanhos)"
    nome_en: "IBGE — Municipal Livestock Survey 2024, table 3939 (herd size)"
    url: https://sidra.ibge.gov.br/tabela/3939
    ano: 2024
  - nome: "IBGE — Censo Demográfico 2022: agregados por setores censitários"
    nome_en: "IBGE — 2022 Population Census: aggregates by census tract"
    url: https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "IBGE — Censo Demográfico 2022, SIDRA tabela 9514 (população por idade)"
    nome_en: "IBGE — 2022 Population Census, SIDRA table 9514 (population by age)"
    url: https://sidra.ibge.gov.br/tabela/9514
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
metodo: "Bovinos por km² e pessoas com 60 anos ou mais por município (IBGE, MapBiomas), cada um dividido em terços; o cruzamento dá nove classes. Correlação de postos de Spearman, parcial descontados os controles, amostra efetiva corrigida pela autocorrelação espacial e LISA bivariado."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#804d36", descricao: "645 municípios com as variáveis das dez pranchas, as classes bivariadas (b093 a b101) e os aglomerados LISA (lisa093 a lisa102)", descricao_en: "645 municipalities with the variables of all ten plates, the bivariate classes (b093 to b101) and the LISA clusters (lisa093 to lisa102)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Correlação de postos entre bovinos e 60 anos ou mais"
    rotulo_en: "Rank correlation between cattle and aged 60+"
    valor: 0.52
    nota: "parcial 0,41"
    nota_en: "partial 0.41"
  - tipo: numero
    rotulo: "Municípios no terço de cima dos dois"
    rotulo_en: "Municipalities in the top third of both"
    valor: 120
    unidade: "municípios"
    unidade_en: "municipalities"
  - tipo: numero
    rotulo: "Correlação entre cana e 60 anos ou mais"
    rotulo_en: "Correlation between cane and aged 60+"
    valor: 0.09
    nota: "não significativa"
    nota_en: "not significant"

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
    url: https://github.com/aikiesan/essencial-geo/releases/download/censo-cruzado-sp-2026/sp_bovinos_e_idosos_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/censo-cruzado-sp-2026/sp_bovinos_e_idosos_2022_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,2 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

versao: "1.0.0"
discussoes: []
---

# Rebanho bovino e envelhecimento nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 095, a terceira de dez da coleção **O Censo cruzado**; a anterior é a [prancha 094](../094-cana-e-esgoto-sp/README.md); a seguinte, a [prancha 096](../096-segregacao-e-desigualdade-racial-sp/README.md).

A coleção nasceu de uma triagem: 4.455 pares de variáveis municipais (Censo 2022 e as bases de
outras pranchas do atlas), dos quais 4.114 ligam famílias diferentes. 834 têm correlação de postos
de 0,3 ou mais e passam no teste com a amostra efetiva corrigida pela autocorrelação espacial (q <
0,05, Benjamini–Hochberg); 277 seguem acima de 0,3 descontadas urbanização, densidade e renda. Nove
das dez pranchas saem desse último grupo; a do pau de arara fica um pouco abaixo (parcial 0,27) e
entra pelo dado raro.

As chamadas do mapa apontam Jales, com 110 bois por km² e 22,2% de pessoas com 60 anos ou mais; São
José dos Campos, com 75 bois por km² e só 17,0%; e Socorro, com 23,4% entre pastos de morro.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios com as variáveis das dez pranchas; nesta, `dens_bovino`, `pct_60mais`, a classe `b095` (11 a 33: dezena = terço de bovinos por km², unidade = terço de pessoas com 60 anos ou mais) e o aglomerado `lisa095` |
| `apond` | polígono | 2.535 áreas de ponderação do estado com idade, cor ou raça, domicílios e renda dos responsáveis |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

O **GPKG** é o mesmo nas dez pranchas e traz um estilo do QGIS para cada uma. O **CSV** tem a tabela
dos municípios, sem geometria. Os aglomerados LISA vêm como `AA` (alto-alto), `BB` (baixo-baixo),
`AB` (primeira variável alta, segunda baixa), `BA` e `ns` (não significativo).

## Método

1. `dens_bovino`: efetivo de bovinos em 31/12/2024 (PPM, tabela 3939) dividido pela área do
   município na Malha Municipal 2025, em cabeças por km².
2. `pct_60mais`: pessoas com 60 anos ou mais sobre a população residente (Censo 2022, universo,
   agregados por setor).
3. Terços dos municípios com dado, fechados à direita: bovinos até 22, 22 a 60 e mais de 60 por km²;
   60 anos ou mais até 17,8%, 17,8% a 20,8% e mais de 20,8%. Os 28 municípios sem rebanho informado
   ficam fora e aparecem hachurados. A classe junta os dois terços (120 municípios no terço de cima dos
   dois, 112 no de baixo dos dois).
4. Correlação de postos de Spearman (0,52, 617 municípios) e correlação parcial: correlação entre os
   resíduos dos postos de cada variável regredidos nos postos dos controles, urbanização (moradores em
   situação urbana), log da densidade demográfica e log da renda domiciliar per capita. Resultado:
   0,41; 0,43 sem a Região Intermediária de São Paulo.
5. Amostra efetiva sob autocorrelação espacial: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), com Iₓ e Iᵧ o I de Moran
   dos resíduos parciais numa vizinhança dos 6 municípios mais próximos. Aqui, 370 municípios efetivos;
   o teste da parcial com essa amostra dá p < 0,001.
6. Moran bivariado (0,45) e LISA bivariado sobre os postos padronizados, 6 vizinhos, 999 permutações
   (semente 20261019), p < 0,05: 113 municípios em aglomerados alto-alto e 99 em baixo-baixo.
7. Pares de apoio na tabela da prancha: pastagem × idade mediana: 0,42 (parcial 0,30); bovinos × 0 a
   14 anos: −0,38 (parcial −0,36); cana × 60 anos ou mais: 0,09 (parcial 0,02, não significativo).

## Limitações

- Leitura ecológica: o mapa compara municípios, não pessoas. Uma correlação entre municípios não diz
  que as mesmas pessoas têm as duas características, nem que uma causa a outra; renda, idade, história
  de ocupação e o tamanho da cidade podem estar por trás das duas.
- Os rebanhos são de 2024 e as idades, de 2022; a densidade de bois muda devagar, mas não é a mesma
  fotografia.
- A migração dos jovens é a hipótese mais citada para o envelhecimento do interior pecuário, mas o
  Censo agregado não segue as pessoas: o mapa não mostra quem saiu.
- As duas variáveis vêm do universo do Censo 2022 (ou de bases administrativas e de mapeamento por
  satélite), sem erro amostral; onde o IBGE marca X (sigilo), o campo fica vazio, nunca zero.
- Os terços são relativos aos municípios paulistas: o terço de baixo de São Paulo pode estar acima
  da média de outros estados.
