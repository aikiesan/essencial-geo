---
numero: 115
titulo: "Pequenos, cheios de gás e sozinhos"
subtitulo: "48 municípios de menos de 20 mil habitantes têm 21 % do potencial de biometano e ficam longe do gasoduto"
data: 2026-11-03
categoria: energia
colecao: bioenergia-cruzada-sp
tags: [bioenergia-cruzada-sp, sao-paulo, biometano, cp2b, residuos-solidos, consorcios, gasodutos, munic]

contexto: >-
  48 municípios paulistas reúnem três coisas: potencial de biometano no quarto de cima do estado, menos de 20.000 habitantes e mais de 50 km do gasoduto de transporte. Juntos, têm 21 % do potencial acessível do estado, 3,53 milhões de m³ por dia, para 487 mil habitantes, sobretudo da cana. Pela MUNIC 2023, 34 deles prestam sozinhos o serviço de resíduos sólidos, 9 têm outra forma regionalizada e 5 estão em consórcio público; nenhum consome gás canalizado. Ficar sozinho é tão comum no grupo quanto no estado: é retrato descritivo, sem teste. Ariranha, com 7.602 habitantes, tem o maior potencial do grupo, 176 mil m³/dia. Quinta prancha da coleção «Bioenergia cruzada».

imagem: ./mapa_preview.png
imagem_alt: "Mapa de São Paulo com os 48 municípios pequenos, de muito potencial de biometano e longe do gasoduto, em três cores pela forma de prestar o serviço de resíduos: ocre para quem presta sozinho, lilás-claro para outra forma regionalizada e roxo para consórcio público. Os outros 114 municípios do quarto de cima do potencial ficam em cinza-claro, e o resto em branco. Uma linha preta grossa marca o gasoduto de transporte, que corta o estado de oeste a leste, e linhas cinza finas a rede de distribuição, concentrada no leste. O ocre domina o norte e o noroeste. Chamadas apontam Ariranha, Tarumã e Maracaí. No painel, a legenda e uma tabela da MUNIC 2023 comparando o grupo com o estado."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "CP2B (Unicamp) — potencial de biogás e biometano por município, método v5.1, nível N4, cenário de referência"
    nome_en: "CP2B (Unicamp) — biogas and biomethane potential by municipality, method v5.1, level N4, reference scenario"
    ano: 2026
  - nome: "IBGE — Pesquisa de Informações Básicas Municipais (MUNIC) 2023, suplemento de saneamento: manejo de resíduos sólidos"
    nome_en: "IBGE — Survey of Basic Municipal Information (MUNIC) 2023, sanitation supplement: solid waste management"
    ano: 2023
  - nome: "EPE — WebMap: gasodutos de transporte e de distribuição existentes, na versão da base de infraestrutura do MapBiomas"
    nome_en: "EPE — WebMap: existing transmission and distribution gas pipelines, as published in the MapBiomas infrastructure database"
    url: https://gisepeprd2.epe.gov.br/WebMapEPE/
    ano: 2022
  - nome: "SEMIL/SP, Anuário de Energéticos por Município 2025 (ano-base 2024): vendas de etanol hidratado, gasolina C, óleo diesel e gás natural canalizado por município"
    nome_en: "SEMIL/SP, Municipal Energy Yearbook 2025 (base year 2024): sales of hydrous ethanol, petrol C, diesel oil and piped natural gas by municipality"
    url: https://semil.sp.gov.br/anuario-de-energeticos-por-municipios-do-estado-de-sao-paulo/
    ano: 2025
  - nome: "IBGE — Censo Demográfico 2022 (população, urbanização e renda dos municípios)"
    nome_en: "IBGE — 2022 Population Census (population, urbanisation and income by municipality)"
    url: https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Municípios com potencial de biometano do CP2B (v5.1, N4, cenário de referência) no quarto de cima do estado (30.798 m³/dia ou mais), menos de 20.000 habitantes (Censo 2022) e mais de 50 km em linha reta do gasoduto de transporte (EPE), classificados pela forma de prestar o manejo de resíduos sólidos declarada na MUNIC 2023; sem teste estatístico."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#b8934a", descricao: "645 municípios com as variáveis das cinco pranchas, as classes bivariadas e os aglomerados LISA (mesmo GPKG das pranchas 111 a 115)", descricao_en: "645 municipalities with the variables of all five plates, the bivariate classes and the LISA clusters (same GPKG as plates 111 to 115)" }
  - { nome: gasodutos, tipo: linha, cor: "#1a211a", descricao: "Gasodutos de transporte e rede de distribuição de gás (EPE)", descricao_en: "Gas transmission pipelines and distribution network (EPE)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Municípios pequenos, de muito potencial e longe do gasoduto"
    rotulo_en: "Small, high-potential municipalities far from the pipeline"
    valor: 48
    unidade: "municípios"
    unidade_en: "municipalities"
    nota: "de 162 no quarto de cima do potencial"
    nota_en: "of 162 in the top quarter of potential"
  - tipo: numero
    rotulo: "Parte do potencial acessível do estado"
    rotulo_en: "Share of the state’s accessible potential"
    valor: 20.9
    unidade: "%"
    unidade_en: "%"
    nota: "3,53 milhões de m³/dia"
    nota_en: "3.53 million m³/day"
  - tipo: numero
    rotulo: "Prestam sozinhos o serviço de resíduos"
    rotulo_en: "Run waste services on their own"
    valor: 34
    unidade: "municípios"
    unidade_en: "municipalities"
    nota: "de 48; 5 em consórcio público"
    nota_en: "of 48; 5 in a public consortium"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-cruzada-sp-2026/sp_bioenergia_cruzada.gpkg.zip
    rotulo: "Municípios e gasodutos com as variáveis das cinco pranchas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities and pipelines with the variables of all five plates, SIRGAS 2000, with QGIS styles"
    tamanho: "4,7 MB"
  - formato: csv
    arquivo: dados/sp_bioenergia_cruzada_municipios.csv
    rotulo: "Tabela dos municípios (a mesma nas cinco pranchas)"
    rotulo_en: "Municipal table (the same on all five plates)"
    tamanho: "120 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-cruzada-sp-2026/sp_pequenos_longe_do_gas_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-cruzada-sp-2026/sp_pequenos_longe_do_gas_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,4 MB"
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

# Municípios pequenos com muito potencial de biometano, longe do gasoduto, pela forma de prestar o serviço de resíduos

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 115, a quinta de cinco da coleção **Bioenergia cruzada**; a anterior é a [prancha 114](../114-esterco-longe-de-quem-aduba-sp/README.md).

A coleção cruza a bioenergia paulista com o que se vende nos postos, com o campo e com as
prefeituras, nos 645 municípios de São Paulo. Os pares saíram de uma triagem de correlações entre o
potencial de biometano do CP2B, as vendas de combustíveis do Anuário da SEMIL, a silvicultura, o
rebanho, o Censo Agropecuário, a frota e a MUNIC. Cada par passou por correlação de postos bruta e
parcial (descontadas urbanização, densidade e renda), amostra efetiva corrigida pela autocorrelação
espacial, valores q de Benjamini–Hochberg e LISA bivariado. A última prancha é descritiva, sem
teste, e o texto diz isso.

As chamadas do mapa apontam Ariranha, com 176 mil m³/dia, 7.602 habitantes e 66 km do gasoduto, o
maior potencial do grupo, que presta o serviço sozinha; Tarumã, com 150 mil m³/dia a 146 km do
gasoduto de transporte, também sozinha; e Maracaí, com 114 mil m³/dia, um dos 5 do grupo em
consórcio público.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios com cana e etanol, biometano e diesel, frota, mata nativa e madeira para celulose, bovinos e adubo orgânico, distâncias ao gasoduto, gás canalizado e as respostas da MUNIC sobre resíduos; classes `b111`, `b113`, `b114`, `arranjo115` e aglomerados `lisa111`, `lisa113`, `lisa114` |
| `gasodutos` | linha | gasodutos de transporte e rede de distribuição (`tipo`) |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

O **GPKG** é o mesmo nas cinco pranchas e traz um estilo do QGIS para cada uma. O **CSV** tem a
tabela dos municípios, sem geometria. Campos vazios são falta de dado, não zero. Os aglomerados LISA
vêm como `AA` (alto-alto), `BB` (baixo-baixo), `AB`, `BA` e `ns` (não significativo); a primeira
letra é a variável do município, a segunda a dos vizinhos.

## Método

1. `cheio115`: potencial de biometano (`biometano_m3d`, CP2B v5.1, N4, referência) no quarto de cima
   dos 645 municípios, 30.798 m³/dia ou mais (162 municípios). `alvo115`: além disso, menos de 20.000
   habitantes no Censo 2022 (`pessoas`) e `km_gasoduto_transporte` acima de 50 km.
2. `km_gasoduto_transporte` e `km_gasoduto_distribuicao`: distância em linha reta do ponto interno
   do município ao gasoduto de transporte e à rede de distribuição mais próximos (EPE, na base de
   infraestrutura do MapBiomas; prancha 057).
3. `arranjo115` (só no grupo): `consorcio` quando a MUNIC 2023 diz que o serviço de resíduos sólidos
   é prestado de forma regionalizada por consórcio público; `regional` para outra forma regionalizada;
   `sozinho` quando não é regionalizado; `sem_informacao` quando a prefeitura não respondeu (nenhum
   caso). `rs_consorcio`, `rs_regionalizado`, `rs_trat_organicos`, `rs_compostagem`,
   `rs_aterro_sanitario` e `rs_coleta_seletiva` trazem as respostas de todos os municípios (1 sim, 0
   não).
4. No grupo e no estado (643 municípios responderam à MUNIC): consórcio público 5 de 48 (10 %)
   contra 81 de 643 (13 %); alguma forma regionalizada 14 de 48 (29 %) contra 167 de 643 (26 %); tratam
   resíduos orgânicos 10 de 48 (21 %) contra 91 de 643 (14 %); compostagem 5 de 48 (10 %); aterro
   sanitário no município 23 de 48 (48 %); coleta seletiva 38 de 48 (79 %).
5. `tem_gas_canalizado`: consumo de gás natural canalizado no Anuário da SEMIL (2024). No grupo, 0
   de 48; no estado, 134 de 645. Por região intermediária, o grupo fica em São José do Rio Preto (20),
   Ribeirão Preto (14), Marília (5), Presidente Prudente (4) e Araçatuba (3).

## Limitações

- O CP2B é um modelo: o potencial é a estimativa do que os resíduos renderiam no nível N4
  (acessível, depois da coleta, dos usos concorrentes, da estocagem e do frete), não biometano
  produzido.
- O potencial do grupo vem sobretudo da cana, cujos resíduos dependem da usina, não da prefeitura: o
  serviço municipal de resíduos é só uma das portas para um projeto de biogás. O mapa não diz que um
  consórcio faria o biogás sair.
- Os cortes (quarto de cima, 20 mil habitantes, 50 km) são escolhas de leitura; outros cortes mudam
  a lista. Distâncias em linha reta, não por estrada. A MUNIC é o que a prefeitura declara.
