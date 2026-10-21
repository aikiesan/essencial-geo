---
numero: 94
titulo: "Cana e esgoto"
subtitulo: "As cidades do canavial estão entre as mais ligadas à rede de esgoto"
data: 2026-10-27
categoria: censo-renda
colecao: censo-cruzado-sp
tags: [censo-cruzado-sp, sao-paulo, censo-2022, saneamento, esgoto, cana-de-acucar, mapbiomas, municipios]
rascunho: true                      # fora do ar: resguardo de artigo em preparação

contexto: >-
  As cidades do canavial estão entre as mais ligadas à rede de esgoto. A correlação de postos entre a parte do município em cana (MapBiomas) e os domicílios com esgoto na rede geral (Censo 2022) é 0,55 nos 645 municípios e 0,50 descontadas urbanização, densidade e renda; 121 municípios estão no terço de cima dos dois. Sertãozinho, com 68% da área em cana, tem 99,3% dos domicílios na rede; Atibaia, sem cana, 61%. A cana desenha cidades médias, compactas e operárias (cana × operários 0,48), mas o mapa não diz que ela traga o esgoto. Segunda prancha da coleção «O Censo cruzado».

imagem: ./mapa_preview.png
imagem_alt: "Mapa bivariado dos municípios de São Paulo em nove cores, de uma grade de três por três: o ocre cresce no eixo de área com cana e o lilás, no de esgoto na rede; o marrom-escuro marca os municípios no terço de cima dos dois. Chamadas apontam Sertãozinho, com 99,3% dos domicílios na rede; Atibaia, com 61% e quase nenhuma cana; e Paulicéia, com 49% na rede e 36% da área em cana. No painel, a grade com o número de municípios em cada casa, os limites dos terços e a tabela das correlações."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "MapBiomas — Coleção 10 da Série Anual de Mapas de Uso e Cobertura da Terra do Brasil, 2024"
    nome_en: "MapBiomas — Collection 10 of the Annual Series of Land Use and Land Cover Maps of Brazil, 2024"
    url: https://brasil.mapbiomas.org/colecoes-mapbiomas/
    ano: 2024
  - nome: "IBGE — Censo Demográfico 2022: agregados por setores censitários"
    nome_en: "IBGE — 2022 Population Census: aggregates by census tract"
    url: https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "IBGE — Censo Demográfico 2022, SIDRA tabela 6805 (esgotamento sanitário)"
    nome_en: "IBGE — 2022 Population Census, SIDRA table 6805 (sewage disposal)"
    url: https://sidra.ibge.gov.br/tabela/6805
    ano: 2022
  - nome: "IBGE — Censo Demográfico 2022, SIDRA tabela 10264 (ocupação, amostra)"
    nome_en: "IBGE — 2022 Population Census, SIDRA table 10264 (occupation, sample)"
    url: https://sidra.ibge.gov.br/tabela/10264
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Área com cana e esgoto na rede por município (MapBiomas, IBGE), cada um dividido em terços; o cruzamento dá nove classes. Correlação de postos de Spearman, parcial descontados os controles, amostra efetiva corrigida pela autocorrelação espacial e LISA bivariado."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#804d36", descricao: "645 municípios com as variáveis das dez pranchas, as classes bivariadas (b093 a b101) e os aglomerados LISA (lisa093 a lisa102)", descricao_en: "645 municipalities with the variables of all ten plates, the bivariate classes (b093 to b101) and the LISA clusters (lisa093 to lisa102)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Correlação de postos entre cana e esgoto na rede"
    rotulo_en: "Rank correlation between cane and mains sewerage"
    valor: 0.55
    nota: "parcial 0,50"
    nota_en: "partial 0.50"
  - tipo: numero
    rotulo: "Municípios no terço de cima dos dois"
    rotulo_en: "Municipalities in the top third of both"
    valor: 121
    unidade: "municípios"
    unidade_en: "municipalities"
  - tipo: numero
    rotulo: "Domicílios na rede em Sertãozinho"
    rotulo_en: "Homes on the mains in Sertãozinho"
    valor: 99.3
    unidade: "%"
    unidade_en: "%"

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
    url: https://github.com/aikiesan/essencial-geo/releases/download/censo-cruzado-sp-2026/sp_cana_e_esgoto_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/censo-cruzado-sp-2026/sp_cana_e_esgoto_2022_prancha.en.svg
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

# Cana-de-açúcar e esgoto na rede nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 094, a segunda de dez da coleção **O Censo cruzado**; a anterior é a [prancha 093](../093-solar-segue-o-agro-sp/README.md); a seguinte, a [prancha 095](../095-o-oeste-do-boi-envelhece-sp/README.md).

A coleção nasceu de uma triagem: 4.455 pares de variáveis municipais (Censo 2022 e as bases de
outras pranchas do atlas), dos quais 4.114 ligam famílias diferentes. 834 têm correlação de postos
de 0,3 ou mais e passam no teste com a amostra efetiva corrigida pela autocorrelação espacial (q <
0,05, Benjamini–Hochberg); 277 seguem acima de 0,3 descontadas urbanização, densidade e renda. Nove
das dez pranchas saem desse último grupo; a do pau de arara fica um pouco abaixo (parcial 0,27) e
entra pelo dado raro.

As chamadas do mapa apontam Sertãozinho, com 99,3% dos domicílios na rede; Atibaia, com 61% e quase
nenhuma cana; e Paulicéia, com 49% na rede e 36% da área em cana.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios com as variáveis das dez pranchas; nesta, `pct_area_cana`, `pct_esgoto_rede`, a classe `b094` (11 a 33: dezena = terço de área com cana, unidade = terço de esgoto na rede) e o aglomerado `lisa094` |
| `apond` | polígono | 2.535 áreas de ponderação do estado com idade, cor ou raça, domicílios e renda dos responsáveis |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

O **GPKG** é o mesmo nas dez pranchas e traz um estilo do QGIS para cada uma. O **CSV** tem a tabela
dos municípios, sem geometria. Os aglomerados LISA vêm como `AA` (alto-alto), `BB` (baixo-baixo),
`AB` (primeira variável alta, segunda baixa), `BA` e `ns` (não significativo).

## Método

1. `pct_area_cana`: parte da área do município com cana-de-açúcar no MapBiomas, coleção 10, ano
   2024.
2. `pct_esgoto_rede`: domicílios particulares ocupados com esgoto na rede geral ou pluvial ou em
   fossa séptica ligada à rede (Censo 2022, universo).
3. Terços dos municípios com dado, fechados à direita: cana até 3,4%, 3,4% a 35,6% e mais de 35,6%;
   rede até 83,7%, 83,7% a 92,9% e mais de 92,9%. A classe junta os dois terços (121 municípios no
   terço de cima dos dois, 133 no de baixo dos dois).
4. Correlação de postos de Spearman (0,55, 645 municípios) e correlação parcial: correlação entre os
   resíduos dos postos de cada variável regredidos nos postos dos controles, urbanização (moradores em
   situação urbana), log da densidade demográfica e log da renda domiciliar per capita. Resultado:
   0,50; 0,41 sem a Região Intermediária de São Paulo.
5. Amostra efetiva sob autocorrelação espacial: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), com Iₓ e Iᵧ o I de Moran
   dos resíduos parciais numa vizinhança dos 6 municípios mais próximos. Aqui, 389 municípios efetivos;
   o teste da parcial com essa amostra dá p < 0,001.
6. Moran bivariado (0,49) e LISA bivariado sobre os postos padronizados, 6 vizinhos, 999 permutações
   (semente 20261019), p < 0,05: 111 municípios em aglomerados alto-alto e 109 em baixo-baixo.
7. Pares de apoio na tabela da prancha: cana × ocupados como operários: 0,48 (parcial 0,49); cana ×
   moradores em favelas e comunidades urbanas: −0,38 (parcial −0,47).

## Limitações

- Leitura ecológica: o mapa compara municípios, não pessoas. Uma correlação entre municípios não diz
  que as mesmas pessoas têm as duas características, nem que uma causa a outra; renda, idade, história
  de ocupação e o tamanho da cidade podem estar por trás das duas.
- O saneamento depende da concessionária, da topografia e da idade da cidade; a cana é um marcador
  de cidades médias e compactas, não uma explicação.
- O par principal vem do universo do Censo e do MapBiomas, sem erro amostral. A parte de ocupados
  como operários, usada só na tabela, vem da amostra do Censo 2022: são estimativas expandidas pelo
  IBGE, com erro amostral que cresce quanto menor o município. Diferenças pequenas entre municípios
  pequenos podem ser ruído; por isso a prancha usa terços, e não classes finas. Onde o IBGE marca X
  (sigilo), o campo fica vazio, nunca zero.
- Os terços são relativos aos municípios paulistas: o terço de baixo de São Paulo pode estar acima
  da média de outros estados.
