---
numero: 99
titulo: "Envelhecer sozinho"
subtitulo: "Onde a população é mais velha, mais casas têm um morador só"
data: 2026-12-29
categoria: censo-renda
colecao: censo-cruzado-sp
tags: [censo-cruzado-sp, sao-paulo, censo-2022, envelhecimento, domicilios, arranjos-domiciliares, areas-de-ponderacao, municipios]

contexto: >-
  Onde a população é mais velha, mais casas têm um morador só. A correlação de postos entre a parte das pessoas com 60 anos ou mais e a dos domicílios com um único morador (Censo 2022) é 0,60 nos 645 municípios e 0,55 descontadas urbanização, densidade e renda; 125 municípios estão no terço de cima dos dois. O par se mantém fora da região de São Paulo (parcial 0,57) e dentro das cidades: nas 2.517 áreas de ponderação do estado, 0,65. Santos tem 25% das casas com um morador e 25% de idosos. O agregado não diz se quem mora só é o idoso; viuvez e saída dos filhos são as hipóteses de sempre. Sétima prancha da coleção «O Censo cruzado».

imagem: ./mapa_preview.png
imagem_alt: "Mapa bivariado dos municípios de São Paulo em nove cores, de uma grade de três por três: o ocre cresce no eixo de pessoas com 60 anos ou mais e o lilás, no de domicílios com um morador; o marrom-escuro marca os municípios no terço de cima dos dois. O marrom-escuro domina o noroeste e o oeste. Chamadas apontam Santos, com 25% das casas com um morador e 25% de pessoas com 60 anos ou mais; Ubatuba, com 20% e só 15%; e Dracena, com 23% de idosos e 20% das casas com um morador. No painel, a grade com o número de municípios em cada casa, os limites dos terços e a tabela das correlações."

recorte: "Estado de São Paulo (SP)"
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
metodo: "Pessoas com 60 anos ou mais e domicílios com um morador por município (IBGE), cada um dividido em terços; o cruzamento dá nove classes. Correlação de postos de Spearman, parcial descontados os controles, amostra efetiva corrigida pela autocorrelação espacial e LISA bivariado."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#804d36", descricao: "645 municípios com as variáveis das dez pranchas, as classes bivariadas (b093 a b101) e os aglomerados LISA (lisa093 a lisa102)", descricao_en: "645 municipalities with the variables of all ten plates, the bivariate classes (b093 to b101) and the LISA clusters (lisa093 to lisa102)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Correlação de postos entre 60 anos ou mais e casas de um morador"
    rotulo_en: "Rank correlation between aged 60+ and one-person homes"
    valor: 0.6
    nota: "parcial 0,55"
    nota_en: "partial 0.55"
  - tipo: numero
    rotulo: "Municípios no terço de cima dos dois"
    rotulo_en: "Municipalities in the top third of both"
    valor: 125
    unidade: "municípios"
    unidade_en: "municipalities"
  - tipo: numero
    rotulo: "Correlação nas áreas de ponderação do estado"
    rotulo_en: "Correlation across the state’s weighting areas"
    valor: 0.65
    nota: "2.517 áreas"
    nota_en: "2,517 areas"

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
    url: https://github.com/aikiesan/essencial-geo/releases/download/censo-cruzado-sp-2026/sp_idosos_e_unipessoais_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/censo-cruzado-sp-2026/sp_idosos_e_unipessoais_2022_prancha.en.svg
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

# Idosos e domicílios de um morador nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 099, a sétima de dez da coleção **O Censo cruzado**; a anterior é a [prancha 098](../098-a-cor-da-juventude-sp/README.md); a seguinte, a [prancha 100](../100-letras-e-enxada-sp/README.md).

A coleção nasceu de uma triagem: 4.455 pares de variáveis municipais (Censo 2022 e as bases de
outras pranchas do atlas), dos quais 4.114 ligam famílias diferentes. 834 têm correlação de postos
de 0,3 ou mais e passam no teste com a amostra efetiva corrigida pela autocorrelação espacial (q <
0,05, Benjamini–Hochberg); 277 seguem acima de 0,3 descontadas urbanização, densidade e renda. Nove
das dez pranchas saem desse último grupo; a do pau de arara fica um pouco abaixo (parcial 0,27) e
entra pelo dado raro.

As chamadas do mapa apontam Santos, com 25% das casas com um morador e 25% de pessoas com 60 anos ou
mais; Ubatuba, com 20% e só 15%; e Dracena, com 23% de idosos e 20% das casas com um morador.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios com as variáveis das dez pranchas; nesta, `pct_60mais`, `pct_unipessoal`, a classe `b099` (11 a 33: dezena = terço de pessoas com 60 anos ou mais, unidade = terço de domicílios com um morador) e o aglomerado `lisa099` |
| `apond` | polígono | 2.535 áreas de ponderação do estado com idade, cor ou raça, domicílios e renda dos responsáveis |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

O **GPKG** é o mesmo nas dez pranchas e traz um estilo do QGIS para cada uma. O **CSV** tem a tabela
dos municípios, sem geometria. Os aglomerados LISA vêm como `AA` (alto-alto), `BB` (baixo-baixo),
`AB` (primeira variável alta, segunda baixa), `BA` e `ns` (não significativo).

## Método

1. `pct_60mais`: pessoas com 60 anos ou mais sobre a população residente (Censo 2022, universo).
2. `pct_unipessoal`: domicílios particulares ocupados com um único morador (Censo 2022, universo).
3. Terços dos municípios com dado, fechados à direita: 60 anos ou mais até 17,7%, 17,7% a 20,7% e
   mais de 20,7%; um morador até 17,5%, 17,5% a 19,5% e mais de 19,5%. A classe junta os dois terços
   (125 municípios no terço de cima dos dois, 141 no de baixo dos dois).
4. Correlação de postos de Spearman (0,60, 645 municípios) e correlação parcial: correlação entre os
   resíduos dos postos de cada variável regredidos nos postos dos controles, urbanização (moradores em
   situação urbana), log da densidade demográfica e log da renda domiciliar per capita. Resultado:
   0,55; 0,57 sem a Região Intermediária de São Paulo.
5. Amostra efetiva sob autocorrelação espacial: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), com Iₓ e Iᵧ o I de Moran
   dos resíduos parciais numa vizinhança dos 6 municípios mais próximos. Aqui, 533 municípios efetivos;
   o teste da parcial com essa amostra dá p < 0,001.
6. Moran bivariado (0,33) e LISA bivariado sobre os postos padronizados, 6 vizinhos, 999 permutações
   (semente 20261019), p < 0,05: 99 municípios em aglomerados alto-alto e 103 em baixo-baixo.
7. Pares de apoio na tabela da prancha: a mesma correlação nas 2.517 áreas de ponderação do estado:
   0,65.

## Limitações

- Leitura ecológica: o mapa compara municípios, não pessoas. Uma correlação entre municípios não diz
  que as mesmas pessoas têm as duas características, nem que uma causa a outra; renda, idade, história
  de ocupação e o tamanho da cidade podem estar por trás das duas.
- O Censo agregado conta idosos e domicílios de um morador separadamente: o mapa não mostra quantos
  idosos moram sós. Essa conta exige os microdados da amostra, que não entram aqui.
- Casas de um morador também crescem com jovens que moram sozinhos em cidades universitárias e em
  bairros de apartamento; Ubatuba mostra outro caso, o de um litoral com muitas casas pequenas.
- As duas variáveis vêm do universo do Censo 2022 (ou de bases administrativas e de mapeamento por
  satélite), sem erro amostral; onde o IBGE marca X (sigilo), o campo fica vazio, nunca zero.
- Os terços são relativos aos municípios paulistas: o terço de baixo de São Paulo pode estar acima
  da média de outros estados.
