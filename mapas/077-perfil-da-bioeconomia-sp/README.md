---
numero: 77
titulo: "Que bioeconomia"
subtitulo: "O campo lidera no interior e no Vale do Ribeira; a fábrica de alimentos, em volta das cidades"
data: 2026-12-07
categoria: energia
colecao: bioeconomia-sp
tags: [bioeconomia-sp, sao-paulo, bioeconomia, emprego, rais, agroindustria, municipios]

contexto: >-
  A bioeconomia paulista é, antes de tudo, fábrica de comida: alimentos, bebidas e fumo somam 496 mil dos 1,05 milhão de vínculos formais, 47%, contra 45% no Brasil. O campo, com agropecuária, pesca e floresta, tem 350 mil, 33%, abaixo dos 38% do país. Madeira, papel e móveis de madeira têm 147 mil; biocombustíveis, 43 mil; fibras naturais e couro, 18 mil. Por município, o campo lidera em 376 dos 645, quase todos pequenos, no oeste e no Vale do Ribeira. A indústria de alimentos lidera em 203, em volta das cidades médias e da metrópole. Madeira e papel mandam em 44, como Suzano, com 3.866 vínculos. As usinas de etanol lideram em 17, entre eles Guaíra, com 6.245 vínculos em biocombustíveis. As fibras e o couro lideram em 5. Segunda prancha da coleção «Bioeconomia no trabalho».

imagem: ./mapa_preview.png
imagem_alt: "Mapa dos municípios de São Paulo em cinco cores pelo segmento da bioeconomia com mais vínculos formais: verde-oliva para o campo, ocre para alimentos, marrom para madeira e papel, lilás para fibras e couro e amarelo para biocombustíveis. O verde-oliva cobre a maior parte do oeste e o Vale do Ribeira; o ocre forma manchas em volta das cidades do interior e da metrópole; o amarelo aparece em pontos do norte canavieiro. Chamadas apontam Guaíra, com 6.245 vínculos em biocombustíveis, e Suzano, com 3.866 em madeira e papel. No painel, a legenda com o número de municípios de cada segmento e barras empilhadas que comparam a composição da bioeconomia no Brasil, em SP e em cada região intermediária."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "MTE/PDET — RAIS 2025: estabelecimentos (RAIS ESTAB PUB), vínculos ativos em 31/12 por subclasse CNAE 2.0 e município"
    nome_en: "MTE/PDET — RAIS 2025: establishments (RAIS ESTAB PUB), active jobs on 31/12 by CNAE 2.0 subclass and municipality"
    url: https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/microdados-rais-e-caged
    ano: 2025
  - nome: "JRC (Comissão Europeia) — Jobs and wealth in the European Union bioeconomy: recorte dos setores da bioeconomia"
    nome_en: "JRC (European Commission) — Jobs and wealth in the European Union bioeconomy: scope of bioeconomy sectors"
    url: https://datam.jrc.ec.europa.eu/datam/mashup/BIOECONOMICS/
    ano: 2024
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Vínculos ativos em 31/12/2025 da bioeconomia, no recorte do JRC europeu, divididos em cinco segmentos por subclasse CNAE; cada município recebe a cor do segmento com mais vínculos."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#8e9c5f", descricao: "645 municípios: vínculos da bioeconomia por segmento e segmento dominante (mesmo GPKG da prancha 076)", descricao_en: "645 municipalities: bioeconomy jobs by segment and dominant segment (same GPKG as plate 076)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "Vínculos da bioeconomia por segmento"
    rotulo_en: "Bioeconomy jobs by segment"
    unidade: "vínculos"
    unidade_en: "jobs"
    itens:
      - { rotulo: "Alimentos, bebidas e fumo", rotulo_en: "Food, drink and tobacco", valor: 496128, cor: "#c0884f" }
      - { rotulo: "Agropecuária, pesca e floresta", rotulo_en: "Farming, fishing and forestry", valor: 349914, cor: "#8e9c5f" }
      - { rotulo: "Madeira e papel", rotulo_en: "Wood and paper", valor: 146549, cor: "#7a5a3a" }
      - { rotulo: "Biocombustíveis", rotulo_en: "Biofuels", valor: 42644, cor: "#c9a227" }
      - { rotulo: "Fibras e couro", rotulo_en: "Fibres and leather", valor: 18081, cor: "#9c8fb0" }
  - tipo: numero
    rotulo: "Municípios onde o campo é o segmento com mais vínculos"
    rotulo_en: "Municipalities where farming is the segment with most jobs"
    valor: 376
    unidade: "municípios"
    unidade_en: "municipalities"
    nota: "de 645; alimentos lideram em 203"
    nota_en: "of 645; food leads in 203"

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
    url: https://github.com/aikiesan/essencial-geo/releases/download/bioeconomia-sp-2026/sp_bioeconomia_perfil_2025_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/bioeconomia-sp-2026/sp_bioeconomia_perfil_2025_prancha.en.svg
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

# Os segmentos da bioeconomia nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 077, a segunda de cinco da coleção **Bioeconomia no trabalho**. Quanto a bioeconomia pesa
em cada município está na [prancha 076](../076-bioeconomia-no-emprego-sp/README.md).

O painel do JRC mostra, para cada região europeia, a composição da bioeconomia: quanto é campo,
quanto é comida, quanto é madeira e papel, quanto é energia. A prancha faz a mesma leitura para os
municípios e as regiões de São Paulo.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `agro`, `alimentos`, `madeira`, `fibras`, `biocombustiveis`, `bio` e `dominante` |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

É o **GPKG** da [prancha 076](../076-bioeconomia-no-emprego-sp/README.md), com o **estilo do QGIS**
`dominante`. O **CSV** tem a tabela dos municípios, sem geometria.

## Método

1. Vínculos ativos em 31/12/2025 (RAIS 2025, estabelecimentos), nas subclasses CNAE da
   bioeconomia descritas na prancha 076.
2. Cinco segmentos: **agro** (divisões 01 a 03); **alimentos**, bebidas e fumo (10 a 12, com o
   açúcar); **madeira**, papel e móveis de madeira (16, 17 e 3101-2); **fibras** naturais e couro
   (13.11, 13.12, 13.21, 13.22 e 15.10); **biocombustíveis** (19.31 e 19.32: etanol e biodiesel).
3. Cada município recebe a cor do segmento com mais vínculos. As barras do painel mostram a
   composição inteira, em 100%, do Brasil, de SP e de cada região intermediária.

## Limitações

- O segmento dominante esconde a mistura: um município com 51% de campo e 49% de alimentos fica
  com a cor do campo. As frações estão no CSV.
- A usina de açúcar e etanol se divide entre dois segmentos: o açúcar (CNAE 10.71) fica em
  alimentos e o álcool (19.31), em biocombustíveis, conforme a atividade principal declarada.
- A RAIS conta só o emprego formal; o campo informal e familiar não aparece.
