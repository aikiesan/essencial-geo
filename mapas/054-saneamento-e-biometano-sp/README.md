---
numero: 54
titulo: "Esgoto, rede e biometano"
subtitulo: "O gás do lodo só existe onde o esgoto chega à estação"
data: 2026-10-20
categoria: energia
colecao: saneamento-sp
tags: [saneamento-sp, sao-paulo, censo-2022, esgoto, biometano, biogas, lodo, cp2b, municipios]

contexto: >-
  O lodo das estações de esgoto vira biometano, mas só onde o esgoto é coletado e tratado numa estação que comporta digestão. No método CP2B, isso dá 121 mil m³ de biometano por dia em São Paulo, em só 128 dos 645 municípios, e a capital responde por 51%. Ao lado, o Censo 2022: 349 municípios ainda têm menos de 90% dos domicílios na rede, a meta do marco legal do saneamento para 2033. O cruzamento separa quatro grupos. 77 municípios, com 28,2 milhões de pessoas, já passam da meta e têm lodo; 297, com 4,36 milhões, ficam abaixo da meta e sem lodo nenhum, e somam 437 mil domicílios fora da rede. Levar a rede a esses lugares é a condição para que o esgoto deles entre na conta do gás. Última prancha da coleção «Saneamento e biometano».

imagem: ./mapa_preview.png
imagem_alt: "Prancha com três mapas municipais de São Paulo. No primeiro, a parte dos domicílios fora da rede de esgoto em 2022, do cinza (zero) ao marrom-escuro (mais de 50%): o Vale do Ribeira, o litoral e o entorno da capital ficam escuros; o norte do estado, claro. No segundo, o biometano do lodo de esgoto em m³ por dia, em tons de verde-azulado, presente só em 128 municípios, com a capital somando 51%. No terceiro, quatro grupos: azul-escuro para rede acima de 90% com lodo, azul-claro para rede acima de 90% sem lodo, ocre para rede abaixo de 90% com lodo e cor de argila para rede abaixo de 90% sem lodo, que cobre o sul e o oeste. No painel, barras com os seis municípios com mais biometano do lodo e com a população de cada grupo."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — SIDRA, tabela 6805: domicílios por tipo de esgotamento sanitário (Censo 2022)"
    nome_en: "IBGE — SIDRA, table 6805: households by type of sewage disposal (2022 Census)"
    url: https://sidra.ibge.gov.br/tabela/6805
    ano: 2022
  - nome: "IBGE — SIDRA, tabela 6892: domicílios por destino do lixo (Censo 2022)"
    nome_en: "IBGE — SIDRA, table 6892: households by rubbish destination (2022 Census)"
    url: https://sidra.ibge.gov.br/tabela/6892
    ano: 2022
  - nome: "CP2B (Unicamp) — potencial de biogás e biometano por município, método v5.1"
    nome_en: "CP2B (Unicamp) — biogas and biomethane potential by municipality, method v5.1"
    ano: 2026
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Parte dos domicílios fora da rede de esgoto (SIDRA 6805) e biometano do lodo de esgoto no método CP2B v5.1, nível N4 (acessível), cenário de referência, por município; os municípios são cruzados pela meta de 90% na rede e pela existência de lodo no potencial."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#234e70", descricao: "645 municípios: pessoas, domicílios, esgoto fora da rede, lixo fora da coleta, biometano do lodo e do lixo e grupo do cruzamento", descricao_en: "645 municipalities: people, households, sewage off the mains, uncollected rubbish, biomethane from sludge and rubbish, and crossing group" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "Pessoas por grupo de rede e lodo"
    rotulo_en: "People by mains and sludge group"
    unidade: "pessoas"
    unidade_en: "people"
    itens:
      - { rotulo: "rede ≥ 90% · com lodo", rotulo_en: "mains ≥ 90% · with sludge", valor: 28192584, cor: "#234e70" }
      - { rotulo: "rede ≥ 90% · lodo zero", rotulo_en: "mains ≥ 90% · no sludge", valor: 6365928, cor: "#9dbdcc" }
      - { rotulo: "rede < 90% · com lodo", rotulo_en: "mains < 90% · with sludge", valor: 5488427, cor: "#c08a2e" }
      - { rotulo: "rede < 90% · lodo zero", rotulo_en: "mains < 90% · no sludge", valor: 4364299, cor: "#9c4a32" }
  - tipo: numero
    rotulo: "Biometano do lodo de esgoto"
    rotulo_en: "Biomethane from sewage sludge"
    valor: 121403
    unidade: "m³/dia"
    unidade_en: "m³/day"
    nota: "128 municípios; 61.965 m³/dia na capital"
    nota_en: "128 municipalities; 61,965 m³/day in the capital"
  - tipo: numero
    rotulo: "Municípios abaixo de 90% dos domicílios na rede"
    rotulo_en: "Municipalities below 90% of households on the mains"
    valor: 349
    unidade: "municípios"
    unidade_en: "municipalities"
    nota: "9,84 milhões de pessoas"
    nota_en: "9.84 million people"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/saneamento-sp-2026/sp_saneamento_biometano.gpkg.zip
    rotulo: "Municípios, regiões e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities, regions and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "4,5 MB"
  - formato: csv
    arquivo: dados/sp_saneamento_biometano.csv
    rotulo: "Tabela dos municípios"
    rotulo_en: "Municipal table"
    tamanho: "51 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/saneamento-sp-2026/sp_saneamento_biometano_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/saneamento-sp-2026/sp_saneamento_biometano_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "5,8 MB"
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

# Esgoto, rede e biometano nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 054, a última de quatro da coleção **Saneamento e biometano**: as três primeiras mostram
onde o esgoto e o lixo escapam; esta pergunta o que isso tira do potencial de biometano.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `CD_MUN`, `NM_MUN`, `pessoas`, `dppo` (domicílios particulares permanentes ocupados), `esgoto_rede`, `esgoto_fora`, `pct_esgoto_rede`, `pct_esgoto_fora`, `lixo_fora`, `pct_lixo_fora`, `biometano_lodo_m3d`, `biometano_lixo_m3d` e `grupo` (`rede_lodo`, `rede_sem_lodo`, `falta_lodo`, `falta_sem_lodo`) |
| `regioes_intermediarias` | polígono | 11 regiões geográficas intermediárias |
| `limite_estadual` | polígono | contorno do estado |

A camada `municipios` traz três **estilos do QGIS**, um por mapa (`rede_e_lodo` é o padrão). O
**CSV** tem os mesmos campos, sem geometria.

## Método

1. Esgoto: tabela 6805 do SIDRA. Na rede quer dizer rede geral, pluvial ou fossa ligada à rede,
   como nas pranchas 051 e 052.
2. Biometano: potencial do CP2B (Unicamp), método v5.1, nível N4 (acessível), cenário de
   referência, convertido de m³ por ano para m³ por dia. O lodo de esgoto só entra onde há coleta,
   tratamento e estação compatível com digestão anaeróbia: daí os 517 municípios com zero. O
   campo `biometano_lixo_m3d` traz também a fração orgânica do lixo (434 mil m³/dia no estado),
   que não está no mapa.
3. Grupos: rede a partir de 90% dos domicílios (a meta da Lei 14.026/2020 para 2033) ou abaixo,
   cruzada com lodo acima de zero ou zero.
4. Lixo fora da coleta (`lixo_fora`): tabela 6892 do SIDRA, como na prancha 053.

## Limitações

- O Censo mede a ligação à rede, não o tratamento; o CP2B parte dos índices de tratamento, por
  isso um município pode ter rede alta e lodo zero.
- O potencial é técnico: diz quanto gás o lodo poderia dar, não quanto se produz hoje.
- Entre os municípios grandes abaixo da meta e com lodo estão Cotia (65% na rede), Atibaia (61%),
  Itapecerica da Serra (64%) e Itanhaém (63%).
