---
numero: 93
titulo: "O sol segue o canavial"
subtitulo: "Onde há mais cana, há mais watts solares por casa, mesmo descontada a renda"
data: 2026-12-23
categoria: censo-renda
colecao: censo-cruzado-sp
tags: [censo-cruzado-sp, sao-paulo, censo-2022, energia-solar, cana-de-acucar, mapbiomas, aneel, municipios]

contexto: >-
  Onde a cana ocupa mais área, as casas têm mais painel solar. A correlação de postos entre a parte do município em cana (MapBiomas) e a potência solar residencial de geração distribuída por domicílio (ANEEL e Censo 2022) é 0,55 nos 645 municípios e fica em 0,44 descontadas urbanização, densidade e renda. Em 102 municípios os dois estão no terço de cima. Jaboticabal, com 72% da área em cana, tem 957 W por domicílio; Santa Fé do Sul, quase sem cana, tem 1.400 W; São Paulo, 38 W. A renda sozinha explica pouco (ρ 0,23). É um padrão entre municípios, não uma causa. Primeira prancha da coleção «O Censo cruzado».

imagem: ./mapa_preview.png
imagem_alt: "Mapa bivariado dos municípios de São Paulo em nove cores, de uma grade de três por três: o ocre cresce no eixo de área com cana e o lilás, no de potência solar por domicílio; o marrom-escuro marca os municípios no terço de cima dos dois. Chamadas apontam Jaboticabal, com 957 W por domicílio e 72% da área em cana; Santa Fé do Sul, com 1.400 W e quase nenhuma cana; e São Paulo, com 38 W. No painel, a grade com o número de municípios em cada casa, os limites dos terços e a tabela das correlações."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "ANEEL — Relação de empreendimentos de geração distribuída (dados abertos, outubro de 2026)"
    nome_en: "ANEEL — Register of distributed generation plants (open data, October 2026)"
    url: https://dadosabertos.aneel.gov.br/dataset/relacao-de-empreendimentos-de-geracao-distribuida
    ano: 2026
  - nome: "MapBiomas — Coleção 10 da Série Anual de Mapas de Uso e Cobertura da Terra do Brasil, 2024"
    nome_en: "MapBiomas — Collection 10 of the Annual Series of Land Use and Land Cover Maps of Brazil, 2024"
    url: https://brasil.mapbiomas.org/colecoes-mapbiomas/
    ano: 2024
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
metodo: "Área com cana e potência solar por domicílio por município (ANEEL, MapBiomas, IBGE), cada um dividido em terços; o cruzamento dá nove classes. Correlação de postos de Spearman, parcial descontados os controles, amostra efetiva corrigida pela autocorrelação espacial e LISA bivariado."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#804d36", descricao: "645 municípios com as variáveis das dez pranchas, as classes bivariadas (b093 a b101) e os aglomerados LISA (lisa093 a lisa102)", descricao_en: "645 municipalities with the variables of all ten plates, the bivariate classes (b093 to b101) and the LISA clusters (lisa093 to lisa102)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Correlação de postos entre cana e solar"
    rotulo_en: "Rank correlation between cane and solar"
    valor: 0.55
    nota: "parcial 0,44, descontadas urbanização, densidade e renda"
    nota_en: "partial 0.44, net of urbanisation, density and income"
  - tipo: numero
    rotulo: "Municípios no terço de cima dos dois"
    rotulo_en: "Municipalities in the top third of both"
    valor: 102
    unidade: "municípios"
    unidade_en: "municipalities"
  - tipo: numero
    rotulo: "Potência solar por domicílio em Jaboticabal"
    rotulo_en: "Solar power per home in Jaboticabal"
    valor: 957
    unidade: "W"
    unidade_en: "W"

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
    url: https://github.com/aikiesan/essencial-geo/releases/download/censo-cruzado-sp-2026/sp_solar_e_cana_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/censo-cruzado-sp-2026/sp_solar_e_cana_2022_prancha.en.svg
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

# Cana-de-açúcar e energia solar residencial nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 093, a primeira de dez da coleção **O Censo cruzado**; a seguinte, a [prancha 094](../094-cana-e-esgoto-sp/README.md).

A coleção nasceu de uma triagem: 4.455 pares de variáveis municipais (Censo 2022 e as bases de
outras pranchas do atlas), dos quais 4.114 ligam famílias diferentes. 834 têm correlação de postos
de 0,3 ou mais e passam no teste com a amostra efetiva corrigida pela autocorrelação espacial (q <
0,05, Benjamini–Hochberg); 277 seguem acima de 0,3 descontadas urbanização, densidade e renda. Nove
das dez pranchas saem desse último grupo; a do pau de arara fica um pouco abaixo (parcial 0,27) e
entra pelo dado raro.

As chamadas do mapa apontam Jaboticabal, com 957 W por domicílio e 72% da área em cana; Santa Fé do
Sul, com 1.400 W e quase nenhuma cana; e São Paulo, com 38 W.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios com as variáveis das dez pranchas; nesta, `pct_area_cana`, `solar_w_dom`, a classe `b093` (11 a 33: dezena = terço de área com cana, unidade = terço de potência solar por domicílio) e o aglomerado `lisa093` |
| `apond` | polígono | 2.535 áreas de ponderação do estado com idade, cor ou raça, domicílios e renda dos responsáveis |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

O **GPKG** é o mesmo nas dez pranchas e traz um estilo do QGIS para cada uma. O **CSV** tem a tabela
dos municípios, sem geometria. Os aglomerados LISA vêm como `AA` (alto-alto), `BB` (baixo-baixo),
`AB` (primeira variável alta, segunda baixa), `BA` e `ns` (não significativo).

## Método

1. `pct_area_cana`: parte da área do município com cana-de-açúcar no MapBiomas, coleção 10, ano 2024
   (base da prancha 045).
2. `solar_w_dom`: potência instalada de geração distribuída solar na classe residencial (ANEEL,
   outubro de 2026, base da prancha 062), em watts, dividida pelos domicílios particulares ocupados do
   Censo 2022.
3. Terços dos municípios com dado, fechados à direita: cana até 3,4%, 3,4% a 35,6% e mais de 35,6%;
   solar até 347 W, 347 a 654 W e mais de 654 W por domicílio. A classe junta os dois terços (102
   municípios no terço de cima dos dois, 160 no de baixo dos dois).
4. Correlação de postos de Spearman (0,55, 645 municípios) e correlação parcial: correlação entre os
   resíduos dos postos de cada variável regredidos nos postos dos controles, urbanização (moradores em
   situação urbana), log da densidade demográfica e log da renda domiciliar per capita. Resultado:
   0,44; 0,36 sem a Região Intermediária de São Paulo.
5. Amostra efetiva sob autocorrelação espacial: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), com Iₓ e Iᵧ o I de Moran
   dos resíduos parciais numa vizinhança dos 6 municípios mais próximos. Aqui, 322 municípios efetivos;
   o teste da parcial com essa amostra dá p < 0,001.
6. Moran bivariado (0,57) e LISA bivariado sobre os postos padronizados, 6 vizinhos, 999 permutações
   (semente 20261019), p < 0,05: 149 municípios em aglomerados alto-alto e 158 em baixo-baixo.
7. Pares de apoio na tabela da prancha: solar × vegetação nativa: −0,55 (parcial −0,50); solar ×
   renda per capita: 0,23 (parcial 0,40).

## Limitações

- Leitura ecológica: o mapa compara municípios, não pessoas. Uma correlação entre municípios não diz
  que as mesmas pessoas têm as duas características, nem que uma causa a outra; renda, idade, história
  de ocupação e o tamanho da cidade podem estar por trás das duas.
- A irradiação solar também cresce para o oeste, onde estão a cana e o pasto; o mapa não separa o
  efeito do sol do efeito da economia agrícola.
- A potência da ANEEL é de outubro de 2026 e os domicílios são de 2022; nos municípios que cresceram
  muito desde o Censo, a razão fica um pouco inflada.
- As duas variáveis vêm do universo do Censo 2022 (ou de bases administrativas e de mapeamento por
  satélite), sem erro amostral; onde o IBGE marca X (sigilo), o campo fica vazio, nunca zero.
- Os terços são relativos aos municípios paulistas: o terço de baixo de São Paulo pode estar acima
  da média de outros estados.
