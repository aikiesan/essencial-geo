---
numero: 80
titulo: "Quem trata o resíduo"
subtitulo: "O resíduo urbano está em toda parte; quem o trata, em poucos lugares"
data: 2026-12-10
categoria: energia
colecao: bioeconomia-sp
tags: [bioeconomia-sp, sao-paulo, bioeconomia, residuos-solidos, saneamento, biometano, cp2b, rais, municipios]

contexto: >-
  O lixo orgânico, o lodo de esgoto e a poda de São Paulo dariam 621 mil m³ de biometano por dia no nível acessível do CP2B, e essa matéria está em todas as cidades. Quem a trata, não. Só 71 dos 645 municípios têm vínculos formais em tratamento e disposição de resíduos, aterros, usinas de compostagem e de biogás: são 7.555 no estado, contra 52 mil na coleta. A capital tem 23% do biometano urbano e 1.861 desses vínculos; São José dos Campos, Arujá e Caieiras vêm depois. Mas 44% do biometano urbano fica em municípios sem nenhum vínculo em tratamento: Piracicaba tem 13 mil m³ por dia e nenhum; São José do Rio Preto, 12 mil e nenhum. Lá, o resíduo viaja até um aterro de outro município ou é tratado pela prefeitura, fora da conta privada. Quinta e última prancha da coleção «Bioeconomia no trabalho».

imagem: ./mapa_preview.png
imagem_alt: "Mapa dos municípios de São Paulo em cinco tons de verde-acinzentado pelo potencial de biometano do lixo orgânico, do lodo de esgoto e da poda, mais escuro nas cidades grandes, com círculos cor de tijolo proporcionais aos vínculos formais em tratamento e disposição de resíduos. Os círculos são poucos e concentrados na Grande São Paulo, no Vale do Paraíba e em algumas cidades do interior; muitas cidades médias escuras não têm círculo. Chamadas apontam a capital, com 23% do biometano urbano e 1.861 vínculos em tratamento, e Piracicaba, com 13 mil m³ por dia e nenhum vínculo. No painel, a legenda, os círculos de referência e barras com os vínculos em resíduos e esgoto por 10 mil habitantes em cada região intermediária."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "MTE/PDET — RAIS 2025: estabelecimentos (RAIS ESTAB PUB), vínculos ativos em 31/12 por subclasse CNAE 2.0 e município"
    nome_en: "MTE/PDET — RAIS 2025: establishments (RAIS ESTAB PUB), active jobs on 31/12 by CNAE 2.0 subclass and municipality"
    url: https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/microdados-rais-e-caged
    ano: 2025
  - nome: "CP2B (Unicamp) — potencial de biogás e biometano por município, método v5.1"
    nome_en: "CP2B (Unicamp) — biogas and biomethane potential by municipality, method v5.1"
    ano: 2026
  - nome: "IBGE — Censo Demográfico 2022: população dos municípios"
    nome_en: "IBGE — 2022 Population Census: municipal population"
    url: https://www.ibge.gov.br/estatisticas/sociais/populacao/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Potencial de biometano dos resíduos urbanos por município (CP2B v5.1, nível N4, cenário de referência: resíduo orgânico, lodo de esgoto e poda), em cinco classes, e círculos proporcionais aos vínculos ativos em 31/12/2025 em tratamento e disposição de resíduos (CNAE 38.21 e 38.22, RAIS 2025)."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#4f7668", descricao: "645 municípios: vínculos em esgoto, coleta, tratamento e recuperação, vínculos por 10 mil habitantes e potencial de biometano urbano (mesmo GPKG da prancha 076)", descricao_en: "645 municipalities: jobs in sewage, collection, treatment and recovery, jobs per 10,000 people and urban biomethane potential (same GPKG as plate 076)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "Vínculos em resíduos e esgoto, por atividade"
    rotulo_en: "Waste and sewage jobs, by activity"
    unidade: "vínculos"
    unidade_en: "jobs"
    itens:
      - { rotulo: "Coleta", rotulo_en: "Collection", valor: 51739, cor: "#a9c0b6" }
      - { rotulo: "Recuperação de materiais", rotulo_en: "Materials recovery", valor: 12090, cor: "#7a9c8f" }
      - { rotulo: "Tratamento e disposição", rotulo_en: "Treatment and disposal", valor: 7555, cor: "#4f7668" }
      - { rotulo: "Esgoto", rotulo_en: "Sewage", valor: 4910, cor: "#2b4c40" }
  - tipo: numero
    rotulo: "Biometano urbano em municípios sem vínculo em tratamento"
    rotulo_en: "Urban biomethane in municipalities with no treatment jobs"
    valor: 44
    unidade: "%"
    nota: "de 621 mil m³/dia; 574 municípios"
    nota_en: "of 621,000 m³/day; 574 municipalities"

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
    url: https://github.com/aikiesan/essencial-geo/releases/download/bioeconomia-sp-2026/sp_tratamento_residuos_2025_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/bioeconomia-sp-2026/sp_tratamento_residuos_2025_prancha.en.svg
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

# O resíduo urbano e quem o trata nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 080, a última de cinco da coleção **Bioeconomia no trabalho**. O peso da bioeconomia em
cada município está na [prancha 076](../076-bioeconomia-no-emprego-sp/README.md); o saneamento, nas
pranchas 051 a 054.

No Reino Unido, os mapas de digestão anaeróbia põem a capacidade instalada de tratamento ao lado do
resíduo alimentar que cada região gera, para mostrar onde falta planta. A prancha faz a leitura
parecida: o potencial do resíduo urbano no fundo e, por cima, onde há gente trabalhando para
tratá-lo.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `res`, `res_esgoto`, `res_coleta`, `res_tratamento`, `res_recuperacao`, `res_10mil` (vínculos em resíduos e esgoto por 10 mil habitantes), `pessoas` e `biometano_urbano` (m³/dia) |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

É o **GPKG** da [prancha 076](../076-bioeconomia-no-emprego-sp/README.md), com o **estilo do QGIS**
`res_10mil`. O **CSV** tem a tabela dos municípios, sem geometria.

## Método

1. Resíduo urbano: potencial de biometano do CP2B (método v5.1, nível N4, cenário de referência) da
   fração orgânica dos resíduos sólidos urbanos, do lodo de esgoto e da poda, em m³ por dia, em cinco
   classes: até 500, 500 a 1.500, 1.500 a 4.000, 4.000 a 10.000 e mais de 10.000.
2. Quem trata: vínculos ativos em 31/12/2025 (RAIS 2025) nas classes CNAE 38.21 e 38.22
   (tratamento e disposição de resíduos não perigosos e perigosos), em círculos de área
   proporcional.
3. No painel, todos os vínculos em resíduos e esgoto (CNAE 37.01, 37.02, 38.11, 38.12, 38.21,
   38.22, 38.31, 38.32 e 38.39) por 10 mil habitantes do Censo 2022, por região intermediária.

## Limitações

- A RAIS conta só empresas e órgãos que declaram vínculos nessas classes. Uma prefeitura que opera o
  próprio aterro com servidores da administração aparece em outra classe, e o tratamento some do
  mapa.
- O vínculo fica no endereço do estabelecimento: um aterro regional aparece num só município, e uma
  concessionária, na sua sede.
- O emprego mede o tamanho da operação, não o destino do resíduo: aterro, compostagem e biodigestão
  ficam na mesma conta.
