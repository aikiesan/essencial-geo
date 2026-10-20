---
numero: 78
titulo: "As fábricas do resíduo orgânico"
subtitulo: "Usinas, frigoríficos, laticínios, sucos e cervejarias: onde a indústria deixa resíduo orgânico"
data: 2026-10-20
categoria: energia
colecao: bioeconomia-sp
tags: [bioeconomia-sp, sao-paulo, bioeconomia, residuos-organicos, agroindustria, biogas, rais, municipios]

contexto: >-
  Algumas indústrias deixam resíduo orgânico em volume: vinhaça, torta e bagaço nas usinas; sangue, rúmen e efluente gorduroso nos frigoríficos; soro nos laticínios; bagaço e casca nas fábricas de suco; levedura e bagaço de malte nas cervejarias. Em São Paulo, 364.647 vínculos formais trabalham nessas indústrias, em 3.692 estabelecimentos e 531 municípios. Açúcar e etanol somam 46%; o abate, 23%. A capital tem mais vínculos, 16.133, repartidos entre laticínios, óleos, abate e bebidas. No interior quem manda é a usina: em Guaíra, 87% dos 7.588 vínculos são de açúcar e etanol; Sertãozinho e Araras vêm logo atrás. O abate lidera em 124 municípios, as usinas em 116 e os laticínios em 89. O CP2B já conta os resíduos da cana; o efluente das outras indústrias fica fora. Terceira prancha da coleção «Bioeconomia no trabalho».

imagem: ./mapa_preview.png
imagem_alt: "Mapa de São Paulo com os municípios em cinza e círculos proporcionais aos vínculos formais nas indústrias que geram resíduo orgânico, coloridos pelo ramo com mais vínculos: amarelo para açúcar e etanol, vermelho-tijolo para abate, azul para laticínios, laranja para frutas e sucos, roxo para bebidas, bege para grãos e rações e verde para óleos. Círculos amarelos grandes se espalham pelo norte e pelo oeste; os vermelhos aparecem no oeste e no noroeste; a capital tem o maior círculo. Chamadas apontam Guaíra, com 7.588 vínculos, 87% em açúcar e etanol, e a capital, com 16.133. No painel, a legenda dos ramos com os vínculos de cada um, os municípios com mais vínculos e uma nota sobre o que o CP2B já conta."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "MTE/PDET — RAIS 2025: estabelecimentos (RAIS ESTAB PUB), vínculos ativos em 31/12 por subclasse CNAE 2.0 e município"
    nome_en: "MTE/PDET — RAIS 2025: establishments (RAIS ESTAB PUB), active jobs on 31/12 by CNAE 2.0 subclass and municipality"
    url: https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/microdados-rais-e-caged
    ano: 2025
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Vínculos ativos em 31/12/2025 em sete ramos da indústria que geram efluente e resíduo orgânico em volume (abate, laticínios, frutas e sucos, açúcar e etanol, óleos, bebidas, grãos e rações), por classe CNAE e município; círculo proporcional ao total, com a cor do ramo com mais vínculos."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#c9a227", descricao: "645 municípios: vínculos e estabelecimentos nas indústrias geradoras, por ramo, e o ramo dominante (mesmo GPKG da prancha 076)", descricao_en: "645 municipalities: jobs and establishments in generating industries, by branch, and the dominant branch (same GPKG as plate 076)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "Vínculos nas indústrias geradoras de resíduo orgânico, por ramo"
    rotulo_en: "Jobs in organic-waste-generating industries, by branch"
    unidade: "vínculos"
    unidade_en: "jobs"
    itens:
      - { rotulo: "Açúcar e etanol", rotulo_en: "Sugar and ethanol", valor: 165954, cor: "#c9a227" }
      - { rotulo: "Abate", rotulo_en: "Slaughter", valor: 83696, cor: "#9a4a3a" }
      - { rotulo: "Bebidas", rotulo_en: "Drinks", valor: 33261, cor: "#7a5a8a" }
      - { rotulo: "Grãos e rações", rotulo_en: "Grain and feed", valor: 32164, cor: "#a59a6a" }
      - { rotulo: "Laticínios", rotulo_en: "Dairy", valor: 23287, cor: "#6f8fb0" }
      - { rotulo: "Frutas e sucos", rotulo_en: "Fruit and juice", valor: 17777, cor: "#d08a3a" }
      - { rotulo: "Óleos", rotulo_en: "Oils", valor: 8508, cor: "#5f7a4a" }
  - tipo: numero
    rotulo: "Estabelecimentos das indústrias geradoras"
    rotulo_en: "Establishments in generating industries"
    valor: 3692
    unidade: "estabelecimentos"
    unidade_en: "establishments"
    nota: "em 531 municípios"
    nota_en: "in 531 municipalities"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/bioeconomia-sp-2026/sp_bioeconomia_rais_2025.gpkg.zip
    rotulo: "Municípios com a bioeconomia da RAIS e o potencial do CP2B, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities with the RAIS bioeconomy and the CP2B potential, SIRGAS 2000, with QGIS styles"
    tamanho: "4,5 MB"
  - formato: csv
    arquivo: dados/sp_bioeconomia_municipios_2025.csv
    rotulo: "Tabela dos municípios"
    rotulo_en: "Municipal table"
    tamanho: "90 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/bioeconomia-sp-2026/sp_industrias_residuo_organico_2025_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/bioeconomia-sp-2026/sp_industrias_residuo_organico_2025_prancha.en.svg
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

# As indústrias que geram resíduo orgânico nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 078, a terceira de cinco da coleção **Bioeconomia no trabalho**. Onde essas indústrias
encontram a biomassa do campo está na [prancha 079](../079-biomassa-e-industria-sp/README.md).

Os inventários europeus de biogás localizam os efluentes da agroindústria pela planta que os gera:
frigoríficos, laticínios, cervejarias, fábricas de suco. No Brasil, o potencial de biogás costuma
ser estimado pelo rebanho e pela lavoura. Esta prancha usa o emprego formal como indicador de onde
estão essas fábricas.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `ger` (vínculos nas indústrias geradoras), `estab_ger`, os ramos `g_abate`, `g_laticinios`, `g_frutas`, `g_acucar_etanol`, `g_oleos`, `g_bebidas`, `g_graos_racoes` e o `g_dominante` |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

É o **GPKG** da [prancha 076](../076-bioeconomia-no-emprego-sp/README.md), com o **estilo do QGIS**
`g_dominante`. O **CSV** tem a tabela dos municípios, sem geometria.

## Método

1. Vínculos ativos em 31/12/2025 e estabelecimentos com vínculos (RAIS 2025), por classe CNAE.
2. Sete ramos: **abate** (10.11, 10.12, 10.13 e 10.20, com pescado); **laticínios** (10.51 a
   10.53); **frutas** e sucos (10.31 a 10.33); **açúcar e etanol** (10.71, 10.72 e 19.31);
   **óleos** (10.41 a 10.43); **bebidas** (11.11 a 11.13, 11.21 e 11.22); **grãos e rações**
   (10.61 a 10.66 e 10.69).
3. Círculo no centro do município, com área proporcional aos vínculos dos sete ramos e a cor do ramo
   com mais vínculos.

## Limitações

- O emprego indica onde está a fábrica, não quanto resíduo ela gera: uma usina automatizada gera
  muito mais vinhaça por vínculo do que um frigorífico gera de efluente. Para estimar o volume, falta
  um coeficiente de resíduo por produto em cada ramo.
- O potencial do CP2B (prancha 050 e pranchas 055 a 059) já conta a vinhaça, a torta de filtro e o bagaço das
  usinas. O efluente de frigoríficos, laticínios, sucos e cervejarias fica fora dele: é um potencial
  ainda não somado.
- A RAIS põe o vínculo no município do estabelecimento declarante; empresas que declaram pela sede
  deslocam os empregos.
