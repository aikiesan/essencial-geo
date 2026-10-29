---
numero: 62
titulo: "Renda e telhado solar"
subtitulo: "O sol dos telhados não segue o dinheiro"
data: 2026-10-20
categoria: energia
colecao: renda-solar-sp
tags: [renda-solar-sp, sao-paulo, geracao-distribuida, energia-solar, renda, censo-2022, aneel, bivariado]

contexto: >-
  São Paulo tem 664 mil sistemas de energia solar de classe residencial registrados na ANEEL, com 4,4 GW: 4,1 para cada 100 domicílios ocupados. Seria de esperar que estivessem nas cidades mais ricas. Não estão. Entre os 645 municípios, a correlação de postos entre a renda média do responsável e os sistemas por domicílio é de −0,01, isto é, nenhuma. No terço de renda mais alta, são 3,8 sistemas por 100 domicílios; no mais baixo, 4,2. O mapa acende em ocre e marrom no oeste e no noroeste, onde Dracena chega a 26 por 100 e Santo Expedito, com renda média de 1,8 salário mínimo, também. A capital, com renda média de 4 salários mínimos e mais sistemas que qualquer outra cidade (22 mil), tem só 0,5 por 100 domicílios, como Santos: onde se mora em prédio, falta telhado. A prancha 044 mostra a geração solar distribuída no Brasil. Última prancha da coleção «Renda e sol nos telhados».

imagem: ./mapa_preview.png
imagem_alt: "Mapa dos municípios de São Paulo em nove cores, cruzando terços de renda média do responsável (do creme ao violeta) e terços de sistemas solares residenciais por domicílio (do creme ao ocre); onde os dois são altos, marrom-arroxeado. O oeste e o noroeste ficam em ocre e marrom; o leste, a Grande São Paulo e o litoral, em violetas; o sul e o Vale do Ribeira, em creme. Chamadas apontam Dracena, com 26 sistemas por 100 domicílios, e a capital, com 0,5. No painel, a grade de três por três com o número de municípios em cada casa, espalhados e não na diagonal, barras com os sistemas por 100 domicílios em cada terço de renda e os municípios de maior adoção."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "ANEEL — Relação de empreendimentos de geração distribuída (dados abertos, outubro de 2026)"
    nome_en: "ANEEL — List of distributed generation units (open data, October 2026)"
    url: https://dadosabertos.aneel.gov.br/dataset/relacao-de-empreendimentos-de-geracao-distribuida
    ano: 2026
  - nome: "IBGE — Censo Demográfico 2022: agregados por setor censitário (renda do responsável e domicílios)"
    nome_en: "IBGE — 2022 Population Census: census tract aggregates (household head income and households)"
    url: https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Sistemas de geração distribuída solar fotovoltaica de classe residencial da ANEEL por 100 domicílios particulares permanentes ocupados do Censo 2022, e renda média dos responsáveis com rendimento, cada um em terços dos 645 municípios, cruzados num mapa bivariado de nove classes; correlação de postos de Spearman."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#ae8545", descricao: "645 municípios: domicílios, renda média, sistemas solares residenciais, kW, sistemas por 100 domicílios, W por domicílio, terços e grupo", descricao_en: "645 municipalities: households, mean income, residential solar systems, kW, systems per 100 homes, W per home, thirds and group" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "Sistemas solares residenciais por terço de renda do município"
    rotulo_en: "Residential solar systems by municipal income third"
    unidade: "sistemas"
    unidade_en: "systems"
    itens:
      - { rotulo: "renda baixa", rotulo_en: "low income", valor: 45954, cor: "#d9a441" }
      - { rotulo: "renda média", rotulo_en: "mid income", valor: 115453, cor: "#ae8545" }
      - { rotulo: "renda alta", rotulo_en: "high income", valor: 502798, cor: "#6b4e55" }
  - tipo: numero
    rotulo: "Sistemas solares residenciais por 100 domicílios"
    rotulo_en: "Residential solar systems per 100 homes"
    valor: 4.1
    unidade: "sistemas"
    unidade_en: "systems"
    nota: "664.205 sistemas e 16,2 milhões de domicílios"
    nota_en: "664,205 systems and 16.2 million homes"
  - tipo: numero
    rotulo: "Correlação de postos entre renda e adoção"
    rotulo_en: "Rank correlation between income and uptake"
    valor: -0.01
    unidade: "ρ de Spearman"
    unidade_en: "Spearman’s ρ"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/renda-solar-sp-2026/sp_renda_solar.gpkg.zip
    rotulo: "Municípios com renda e geração solar residencial, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities with income and residential solar, SIRGAS 2000, with QGIS styles"
    tamanho: "4,5 MB"
  - formato: csv
    arquivo: dados/sp_renda_solar.csv
    rotulo: "Tabela dos municípios"
    rotulo_en: "Municipal table"
    tamanho: "47 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/renda-solar-sp-2026/sp_renda_solar_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/renda-solar-sp-2026/sp_renda_solar_prancha.en.svg
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
doi: 10.5281/zenodo.23540297
discussoes: []
---

# Renda e geração solar residencial nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 062, a última de três da coleção **Renda e sol nos telhados**: a renda das
[pranchas 060](../060-renda-mediana-sp/README.md) e [061](../061-renda-na-metropole-sp/README.md)
cruzada com os sistemas solares nos telhados das casas. A geração solar distribuída do país, por
habitante, está na [prancha 044](../044-geracao-solar-distribuida-brasil/README.md).

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `pessoas`, `dppo` (domicílios particulares permanentes ocupados), `responsaveis`, `renda_media` (R$) e `renda_media_sm`, `solar_sistemas` e `solar_kw` (residenciais), `sistemas_100_dom`, `w_por_dom`, `terco_renda`, `terco_solar` e `grupo` (terço solar e terço de renda, de 11 a 33) |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

A camada `municipios` traz três **estilos do QGIS**: `renda_e_solar` (o da prancha),
`solar_por_100_domicilios` e `renda_media_sm`. O **CSV** tem a mesma tabela, sem geometria.

## Método

1. ANEEL: empreendimentos de geração distribuída de fonte solar fotovoltaica e classe de consumo
   residencial em SP, na relação de outubro de 2026, contados e somados (kW) pelo município da
   unidade. Só campos agregáveis: sem nomes, CPF ou CEP.
2. Censo 2022: domicílios particulares permanentes ocupados e renda média dos responsáveis com
   rendimento, média dos setores com informação ponderada pelos responsáveis.
3. Terços: cada medida é cortada em três grupos de cerca de 215 municípios (renda até 1,91 SM, de 1,91 a
   2,24 e acima; sistemas até 5,35 por 100 domicílios, de 5,35 a 10,93 e acima).
4. Correlação de Spearman entre os postos das duas medidas nos 645 municípios.

## Limitações

- Um sistema não é um domicílio: há casas com mais de um registro, e 130.061 sistemas (20%) são
  de autoconsumo remoto, que pode estar num município e abater a conta de outro.
- A classe residencial não separa casa de prédio; um sistema de condomínio conta como um só.
- A renda é a do Censo 2022 e os sistemas, de 2026; a comparação é de lugares, não de famílias:
  não diz quem, dentro de cada cidade, pôs placa no telhado.
- O tipo de moradia é uma leitura do mapa, não uma medida desta prancha.
