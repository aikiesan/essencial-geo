---
numero: 101
titulo: "Veraneio sem esgoto"
subtitulo: "Onde há mais casas de uso ocasional, menos domicílios estão ligados à rede de esgoto"
data: 2026-12-31
categoria: censo-renda
colecao: censo-cruzado-sp
tags: [censo-cruzado-sp, sao-paulo, censo-2022, saneamento, esgoto, segunda-residencia, litoral, domicilios, municipios]

contexto: >-
  Onde há mais casas de veraneio, menos domicílios estão ligados à rede de esgoto. A correlação de postos entre a parte dos domicílios de uso ocasional e a dos domicílios ocupados sem esgoto na rede geral (Censo 2022) é 0,64 nos 645 municípios e 0,41 descontadas urbanização, densidade e renda; 139 municípios estão no terço de cima dos dois. Ibiúna tem 71% dos domicílios fora da rede e 32% de casas de uso ocasional; Ubatuba, 50% e 62%. Praia Grande, com 42% de uso ocasional e 2% fora da rede, mostra que dá para ter as duas coisas. Nona prancha da coleção «O Censo cruzado».

imagem: ./mapa_preview.png
imagem_alt: "Mapa bivariado dos municípios de São Paulo em nove cores, de uma grade de três por três: o ocre cresce no eixo de domicílios de uso ocasional e o lilás, no de domicílios fora da rede de esgoto; o marrom-escuro marca os municípios no terço de cima dos dois. O marrom-escuro cobre o litoral sul, o Vale do Ribeira e a serra a sudeste da capital. Chamadas apontam Ibiúna, com 71% dos domicílios fora da rede e 32% de uso ocasional; Praia Grande, com 42% de uso ocasional e só 2% fora da rede; e Ubatuba, com 50% e 62%. No painel, a grade com o número de municípios em cada casa, os limites dos terços e a tabela das correlações."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022: agregados por setores censitários"
    nome_en: "IBGE — 2022 Population Census: aggregates by census tract"
    url: https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "IBGE — Censo Demográfico 2022, SIDRA tabela 6805 (esgotamento sanitário)"
    nome_en: "IBGE — 2022 Population Census, SIDRA table 6805 (sewage disposal)"
    url: https://sidra.ibge.gov.br/tabela/6805
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Domicílios de uso ocasional e domicílios fora da rede de esgoto por município (IBGE), cada um dividido em terços; o cruzamento dá nove classes. Correlação de postos de Spearman, parcial descontados os controles, amostra efetiva corrigida pela autocorrelação espacial e LISA bivariado."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#804d36", descricao: "645 municípios com as variáveis das dez pranchas, as classes bivariadas (b093 a b101) e os aglomerados LISA (lisa093 a lisa102)", descricao_en: "645 municipalities with the variables of all ten plates, the bivariate classes (b093 to b101) and the LISA clusters (lisa093 to lisa102)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Correlação de postos entre uso ocasional e falta de rede"
    rotulo_en: "Rank correlation between occasional use and lack of mains"
    valor: 0.64
    nota: "parcial 0,41"
    nota_en: "partial 0.41"
  - tipo: numero
    rotulo: "Municípios no terço de cima dos dois"
    rotulo_en: "Municipalities in the top third of both"
    valor: 139
    unidade: "municípios"
    unidade_en: "municipalities"
  - tipo: numero
    rotulo: "Domicílios fora da rede em Ibiúna"
    rotulo_en: "Homes off the mains in Ibiúna"
    valor: 71
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
    url: https://github.com/aikiesan/essencial-geo/releases/download/censo-cruzado-sp-2026/sp_uso_ocasional_e_esgoto_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/censo-cruzado-sp-2026/sp_uso_ocasional_e_esgoto_2022_prancha.en.svg
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

# Domicílios de uso ocasional e esgoto fora da rede nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 101, a nona de dez da coleção **O Censo cruzado**; a anterior é a [prancha 100](../100-letras-e-enxada-sp/README.md); a seguinte, a [prancha 102](../102-pau-de-arara-sp/README.md).

A coleção nasceu de uma triagem: 4.455 pares de variáveis municipais (Censo 2022 e as bases de
outras pranchas do atlas), dos quais 4.114 ligam famílias diferentes. 834 têm correlação de postos
de 0,3 ou mais e passam no teste com a amostra efetiva corrigida pela autocorrelação espacial (q <
0,05, Benjamini–Hochberg); 277 seguem acima de 0,3 descontadas urbanização, densidade e renda. Nove
das dez pranchas saem desse último grupo; a do pau de arara fica um pouco abaixo (parcial 0,27) e
entra pelo dado raro.

As chamadas do mapa apontam Ibiúna, com 71% dos domicílios fora da rede e 32% de uso ocasional;
Praia Grande, com 42% de uso ocasional e só 2% fora da rede; e Ubatuba, com 50% e 62%.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios com as variáveis das dez pranchas; nesta, `pct_uso_ocasional`, `pct_sem_esgoto_rede`, a classe `b101` (11 a 33: dezena = terço de domicílios de uso ocasional, unidade = terço de domicílios fora da rede de esgoto) e o aglomerado `lisa101` |
| `apond` | polígono | 2.535 áreas de ponderação do estado com idade, cor ou raça, domicílios e renda dos responsáveis |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

O **GPKG** é o mesmo nas dez pranchas e traz um estilo do QGIS para cada uma. O **CSV** tem a tabela
dos municípios, sem geometria. Os aglomerados LISA vêm como `AA` (alto-alto), `BB` (baixo-baixo),
`AB` (primeira variável alta, segunda baixa), `BA` e `ns` (não significativo).

## Método

1. `pct_uso_ocasional`: domicílios particulares não ocupados de uso ocasional sobre o total de
   domicílios particulares (Censo 2022, universo, agregados por setor).
2. `pct_sem_esgoto_rede`: domicílios particulares ocupados sem esgoto na rede geral ou pluvial nem
   em fossa séptica ligada à rede, isto é, 100 menos `pct_esgoto_rede` (Censo 2022, universo).
3. Terços dos municípios com dado, fechados à direita: uso ocasional até 5,4%, 5,4% a 9,5% e mais de
   9,5%; fora da rede até 7,2%, 7,2% a 16,3% e mais de 16,3%. A classe junta os dois terços (139
   municípios no terço de cima dos dois, 142 no de baixo dos dois).
4. Correlação de postos de Spearman (0,64, 645 municípios) e correlação parcial: correlação entre os
   resíduos dos postos de cada variável regredidos nos postos dos controles, urbanização (moradores em
   situação urbana), log da densidade demográfica e log da renda domiciliar per capita. Resultado:
   0,41; 0,49 sem a Região Intermediária de São Paulo.
5. Amostra efetiva sob autocorrelação espacial: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), com Iₓ e Iᵧ o I de Moran
   dos resíduos parciais numa vizinhança dos 6 municípios mais próximos. Aqui, 516 municípios efetivos;
   o teste da parcial com essa amostra dá p < 0,001.
6. Moran bivariado (0,28) e LISA bivariado sobre os postos padronizados, 6 vizinhos, 999 permutações
   (semente 20261019), p < 0,05: 86 municípios em aglomerados alto-alto e 90 em baixo-baixo.
7. Pares de apoio na tabela da prancha: uso ocasional × fossa rudimentar: 0,53 (parcial 0,15); uso
   ocasional × água de poço: 0,51 (parcial 0,06, não significativo).

## Limitações

- Leitura ecológica: o mapa compara municípios, não pessoas. Uma correlação entre municípios não diz
  que as mesmas pessoas têm as duas características, nem que uma causa a outra; renda, idade, história
  de ocupação e o tamanho da cidade podem estar por trás das duas.
- O esgoto do Censo conta só os domicílios ocupados: a casa de veraneio vazia no dia da coleta não
  entra nele. O mapa liga o veraneio ao saneamento de quem mora no município, não ao da própria casa
  de veraneio.
- Fossa rudimentar e poço acompanham o uso ocasional, mas quase somem descontada a urbanização: são
  marcas do município rural e disperso, mais do que do veraneio.
- As duas variáveis vêm do universo do Censo 2022 (ou de bases administrativas e de mapeamento por
  satélite), sem erro amostral; onde o IBGE marca X (sigilo), o campo fica vazio, nunca zero.
- Os terços são relativos aos municípios paulistas: o terço de baixo de São Paulo pode estar acima
  da média de outros estados.
