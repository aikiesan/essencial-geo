---
numero: 83
titulo: "Dejetos e colheitas"
subtitulo: "O esterco confinado repõe 46% do fósforo que as colheitas levam, 25% do nitrogênio"
data: 2026-12-13
categoria: uso-do-solo
colecao: nutrientes-sp
tags: [nutrientes-sp, sao-paulo, dejetos, colheitas, nitrogenio, fosforo, potassio, balanco-de-nutrientes, municipios]

contexto: >-
  As colheitas paulistas levam do solo, a cada ano, cerca de 700 mil toneladas de nitrogênio, 194 mil de P₂O₅ e 555 mil de K₂O, pela produção da PAM 2024 e os teores do IPNI. O esterco de aves, suínos e vacas de leite, o que se pode recolher, tem 172 mil, 89 mil e 87 mil: repõe 46% do fósforo, 25% do nitrogênio e 16% do potássio. A cana pesa na conta: leva metade do nitrogênio e 71% do potássio exportados, e parte disso volta ao canavial com a vinhaça e a torta de filtro. Dos 527 municípios com ao menos mil hectares colhidos, 114 têm esterco para repor todo o fósforo, 54 todo o nitrogênio e 36 todo o potássio. Nas regiões de grãos, a conta não fecha: Itapeva exporta 21,8 mil toneladas de N na colheita, e o esterco local cobre 3,3%. Terceira prancha da coleção «Dejetos que adubam».

imagem: ./mapa_preview.png
imagem_alt: "Três mapas dos municípios de São Paulo em seis tons de verde, pela parte do nitrogênio, do fósforo e do potássio exportados pelas colheitas que o esterco de aves, suínos e vacas de leite repõe; municípios com menos de mil hectares colhidos em cinza claro. O fósforo é o mapa mais escuro, com verde-escuro no centro-leste e no oeste; o potássio, o mais claro. Chamadas apontam Itapeva, onde o esterco cobre 3,3% do nitrogênio, Bastos, com 129 vezes o fósforo da colheita, e Guaíra, com 0,6% do potássio. No quarto quadro, barras do esterco e da exportação no estado, com a parte da cana."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Produção Agrícola Municipal 2024 (SIDRA, tabelas 1612 e 1613, variáveis 214 e 216; obtidas em https://apisidra.ibge.gov.br/values/t/1612/n6/in%20n3%2035/v/214/p/2024/c81/all e equivalentes em 18/10/2026)"
    nome_en: "IBGE — 2024 Municipal Agricultural Production (SIDRA, tables 1612 and 1613, variables 214 and 216; retrieved from https://apisidra.ibge.gov.br/values/t/1612/n6/in%20n3%2035/v/214/p/2024/c81/all and equivalents on 18/10/2026)"
    url: https://sidra.ibge.gov.br/pesquisa/pam
    ano: 2024
  - nome: "IPNI Brasil/NPCT — Calculadora de Balanço de Nutrientes (teores no produto colhido; Cunha, Casarin e Prochnow, Informações Agronômicas 130 e 145)"
    nome_en: "IPNI Brazil/NPCT — Nutrient Balance Calculator (contents in the harvested product; Cunha, Casarin and Prochnow, Informações Agronômicas 130 and 145)"
    url: https://www.npct.com.br/npctweb/npct.nsf/article/calculadora
    ano: 2014
  - nome: "IBGE — Pesquisa da Pecuária Municipal 2024 (SIDRA, tabelas 3939 e 94; tabela 94 obtida em https://apisidra.ibge.gov.br/values/t/94/n6/in%20n3%2035/v/all/p/2024 em 18/10/2026)"
    nome_en: "IBGE — 2024 Municipal Livestock Survey (SIDRA, tables 3939 and 94; table 94 retrieved from https://apisidra.ibge.gov.br/values/t/94/n6/in%20n3%2035/v/all/p/2024 on 18/10/2026)"
    url: https://sidra.ibge.gov.br/pesquisa/ppm
    ano: 2024
  - nome: "IPCC — 2019 Refinement to the 2006 IPCC Guidelines for National Greenhouse Gas Inventories, vol. 4, cap. 10 (tabelas 10.19 e 10A.5)"
    nome_en: "IPCC — 2019 Refinement to the 2006 IPCC Guidelines for National Greenhouse Gas Inventories, vol. 4, ch. 10 (tables 10.19 and 10A.5)"
    url: https://www.ipcc-nggip.iges.or.jp/public/2019rf/pdf/4_Volume4/19R_V4_Ch10_Livestock.pdf
    ano: 2019
  - nome: "MidWest Plan Service — MWPS-18, Manure Characteristics, seção 1, 2ª ed. (tabela 6)"
    nome_en: "MidWest Plan Service — MWPS-18, Manure Characteristics, section 1, 2nd ed. (table 6)"
    ano: 2004
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "N, P₂O₅ e K₂O dos dejetos de aves, suínos e vacas de leite (PPM 2024 × IPCC 2019 e MWPS-18) sobre o N, P₂O₅ e K₂O exportados pelas lavouras temporárias e permanentes do município (produção da PAM 2024 × teores no produto colhido do IPNI Brasil), em seis classes, nos municípios com ao menos mil hectares colhidos."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#467a55", descricao: "645 municípios: dejetos confinados, exportação de N, P₂O₅ e K₂O pelas colheitas e cobertura (mesmo GPKG da prancha 081)", descricao_en: "645 municipalities: housed-herd manure, crop removal of N, P₂O₅ and K₂O and coverage (same GPKG as plate 081)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: barras
    rotulo: "Parte da exportação pelas colheitas que o esterco confinado repõe, no estado"
    rotulo_en: "Share of crop removal that housed-herd manure replaces, statewide"
    unidade: "%"
    itens:
      - { rotulo: "fósforo (P₂O₅)", rotulo_en: "phosphorus (P₂O₅)", valor: 45.5, cor: "#467a55" }
      - { rotulo: "nitrogênio (N)", rotulo_en: "nitrogen (N)", valor: 24.6, cor: "#76a07d" }
      - { rotulo: "potássio (K₂O)", rotulo_en: "potassium (K₂O)", valor: 15.6, cor: "#a7c1a9" }
  - tipo: barras
    rotulo: "Exportação pelas colheitas e esterco confinado"
    rotulo_en: "Crop removal and housed-herd manure"
    unidade: "mil t por ano"
    unidade_en: "thousand t a year"
    itens:
      - { rotulo: "N exportado", rotulo_en: "N removed", valor: 699.7, cor: "#c9b58c" }
      - { rotulo: "N no esterco", rotulo_en: "N in manure", valor: 171.8, cor: "#467a55" }
      - { rotulo: "P₂O₅ exportado", rotulo_en: "P₂O₅ removed", valor: 194.4, cor: "#c9b58c" }
      - { rotulo: "P₂O₅ no esterco", rotulo_en: "P₂O₅ in manure", valor: 88.5, cor: "#467a55" }
      - { rotulo: "K₂O exportado", rotulo_en: "K₂O removed", valor: 554.6, cor: "#c9b58c" }
      - { rotulo: "K₂O no esterco", rotulo_en: "K₂O in manure", valor: 86.6, cor: "#467a55" }
  - tipo: numero
    rotulo: "Municípios agrícolas com esterco para todo o fósforo da colheita"
    rotulo_en: "Farming municipalities with manure for all the harvest’s phosphorus"
    valor: 114
    unidade: "de 527"
    unidade_en: "of 527"
    nota: "com ao menos mil hectares colhidos"
    nota_en: "with at least 1,000 hectares harvested"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/nutrientes-sp-2026/sp_nutrientes_dejetos_2024.gpkg.zip
    rotulo: "Municípios com rebanhos, nutrientes dos dejetos, exportação e digestato, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities with herds, manure nutrients, crop removal and digestate, SIRGAS 2000, with QGIS styles"
    tamanho: "4,6 MB"
  - formato: csv
    arquivo: dados/sp_nutrientes_dejetos_2024.csv
    rotulo: "Tabela dos municípios"
    rotulo_en: "Municipal table"
    tamanho: "120 kB"
  - formato: csv
    arquivo: dados/sp_nutrientes_coeficientes.csv
    rotulo: "Coeficientes usados (excreção por cabeça e teores nas colheitas), com a fonte de cada um"
    rotulo_en: "Coefficients used (excretion per head and crop contents), each with its source"
    tamanho: "4 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/nutrientes-sp-2026/sp_dejetos_e_colheitas_2024_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/nutrientes-sp-2026/sp_dejetos_e_colheitas_2024_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "5,8 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

versao: "1.0.0"
discussoes: []
---

# Dejetos e colheitas: quanto do que a lavoura leva o esterco devolve

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 083, a terceira de quatro da coleção **Dejetos que adubam**: o balanço bruto de
nutrientes da Eurostat e da OCDE, simplificado a duas parcelas, a entrada pelo esterco e a saída pela
colheita. O esterco vem das pranchas [081](../081-nitrogenio-dos-dejetos-sp/README.md) e
[082](../082-fosforo-dos-dejetos-sp/README.md).

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `n_conf_t`, `p2o5_conf_t`, `k2o_conf_t` (esterco de aves, suínos e vacas de leite); `n_exporta_t`, `p2o5_exporta_t`, `k2o_exporta_t` (exportação pelas colheitas); `cob_n_pct`, `cob_p2o5_pct`, `cob_k2o_pct` (esterco sobre exportação); `area_lavoura_ha`; demais campos da coleção |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

O **GPKG** e o **CSV** são os da coleção, publicados na prancha 081; os estilos do QGIS desta
prancha são `cob_n_pct`, `cob_p2o5_pct` e `cob_k2o_pct`. O CSV de **coeficientes** traz o teor de
cada lavoura.

## Método

1. **Saída: a exportação pela colheita.** Quantidade produzida de cada lavoura temporária e
   permanente na PAM 2024 (tabelas 1612 e 1613, obtidas pela API do SIDRA em 18/10/2026) vezes o
   teor de N, P e K no produto colhido da calculadora de balanço do IPNI Brasil (hoje NPCT), com P e K
   convertidos em P₂O₅ (× 2,2914) e K₂O (× 1,2046). Entram 19 lavouras, 97,8% da área colhida do
   estado; tangerina e limão usam o teor da laranja. Por tonelada colhida, por exemplo: cana 0,83 kg de
   N, 0,25 de P₂O₅ e 0,94 de K₂O; soja 59,2, 12,6 e 22,6; milho 13,5, 4,8 e 3,7.
2. **Entrada: o esterco recolhível.** N, P₂O₅ e K₂O dos dejetos de galinhas, frangos, suínos,
   matrizes e vacas ordenhadas, como na prancha 082 (K₂O/N também da tabela 6 do MWPS-18).
3. **Cobertura.** Esterco sobre exportação, por nutriente, em seis classes fechadas à direita: até 5,
   5 a 15, 15 a 30, 30 a 60, 60 a 100 e mais de 100%. Os municípios com menos de mil hectares
   colhidos ficam em cinza: neles a razão perde sentido (na capital, por exemplo, passaria de 600%).

## Limitações

- **É estimativa**, e a conta é parcial. O balanço completo soma também adubo mineral, fixação
  biológica, deposição e sementes, e desconta perdas. O adubo mineral não entra porque a ANDA não
  publica a entrega por município em dados abertos.
- O teor do produto colhido varia com variedade, produtividade e manejo; os do IPNI são médias. O
  sorgo, com 7,5 g de P por kg na tabela do IPNI, tem um teor alto para o grão, e vai como publicado.
- A soja tira quase todo o seu nitrogênio do ar, pela fixação biológica; a exportação de N das regiões
  de grãos não é toda ela um nitrogênio a repor.
- Na cana, vinhaça, torta de filtro e palha já devolvem ao canavial parte do potássio e do nitrogênio;
  a conta não as inclui.
- A cobertura supõe que o esterco fica no município onde nasce; na prática, cama de frango e esterco
  de galinha viajam centenas de quilômetros.
