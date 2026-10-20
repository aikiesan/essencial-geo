---
numero: 82
titulo: "O fósforo dos dejetos"
subtitulo: "Em 177 municípios, as granjas dão mais fósforo do que a colheita leva"
data: 2026-10-20
categoria: uso-do-solo
colecao: nutrientes-sp
tags: [nutrientes-sp, sao-paulo, dejetos, fosforo, avicultura, suinocultura, leite, balanco-de-nutrientes, municipios]

contexto: >-
  Aves, suínos e vacas de leite vivem em galpões e estábulos, e o esterco deles se pode recolher: são cerca de 88,5 mil toneladas de P₂O₅ por ano em São Paulo, 5,2 kg por hectare agropecuário. Os frangos de corte dão 45%, as vacas ordenhadas 33%, as galinhas poedeiras 12% e os suínos 10%. O fósforo se acumula onde as granjas se concentram: Bastos tem 188 kg de P₂O₅ por hectare, Cerquilho 131, Jumirim 98, Cabreúva e Porangaba 81. Em 177 municípios, o fósforo dos dejetos passa o que as colheitas do próprio município exportam; juntos, eles têm 51 mil toneladas de P₂O₅ no esterco, 33 mil a mais do que as suas lavouras levam. Em Bastos, o esterco tem 130 vezes o fósforo da colheita; em Mococa, com 6,75 milhões de frangos, o dobro. Segunda prancha da coleção «Dejetos que adubam».

imagem: ./mapa_preview.png
imagem_alt: "Mapa dos municípios de São Paulo em seis tons de rosa a vinho, pelo fósforo (P₂O₅) dos dejetos de aves, suínos e vacas de leite por hectare de área agropecuária, com listras finas nos 177 municípios onde esse fósforo passa o que as colheitas locais exportam. Os tons mais escuros formam um cinturão de Sorocaba a Campinas e manchas em Bastos e Mococa; o oeste e o norte canavieiro são claros. Chamadas apontam Bastos, com 2.761 toneladas de P₂O₅, 130 vezes o que as lavouras do município levam, e Mococa, com o dobro. No painel, a parte do fósforo em cada classe e o fósforo por rebanho."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Pesquisa da Pecuária Municipal 2024 (SIDRA, tabelas 3939 e 94; tabela 94 obtida em https://apisidra.ibge.gov.br/values/t/94/n6/in%20n3%2035/v/all/p/2024 em 18/10/2026)"
    nome_en: "IBGE — 2024 Municipal Livestock Survey (SIDRA, tables 3939 and 94; table 94 retrieved from https://apisidra.ibge.gov.br/values/t/94/n6/in%20n3%2035/v/all/p/2024 on 18/10/2026)"
    url: https://sidra.ibge.gov.br/pesquisa/ppm
    ano: 2024
  - nome: "IBGE — Produção Agrícola Municipal 2024 (SIDRA, tabelas 1612 e 1613, variáveis 214 e 216; obtidas em https://apisidra.ibge.gov.br/values/t/1612/n6/in%20n3%2035/v/214/p/2024/c81/all e equivalentes em 18/10/2026)"
    nome_en: "IBGE — 2024 Municipal Agricultural Production (SIDRA, tables 1612 and 1613, variables 214 and 216; retrieved from https://apisidra.ibge.gov.br/values/t/1612/n6/in%20n3%2035/v/214/p/2024/c81/all and equivalents on 18/10/2026)"
    url: https://sidra.ibge.gov.br/pesquisa/pam
    ano: 2024
  - nome: "MapBiomas — Coleção 10 da Série Anual de Mapas de Uso e Cobertura da Terra do Brasil, 2024 (área agropecuária por município, da prancha 045)"
    nome_en: "MapBiomas — Collection 10 of the Annual Series of Land Use and Land Cover Maps of Brazil, 2024 (farmland by municipality, from plate 045)"
    url: https://brasil.mapbiomas.org/
    ano: 2024
  - nome: "IPCC — 2019 Refinement to the 2006 IPCC Guidelines for National Greenhouse Gas Inventories, vol. 4, cap. 10 (tabelas 10.19 e 10A.5)"
    nome_en: "IPCC — 2019 Refinement to the 2006 IPCC Guidelines for National Greenhouse Gas Inventories, vol. 4, ch. 10 (tables 10.19 and 10A.5)"
    url: https://www.ipcc-nggip.iges.or.jp/public/2019rf/pdf/4_Volume4/19R_V4_Ch10_Livestock.pdf
    ano: 2019
  - nome: "MidWest Plan Service — MWPS-18, Manure Characteristics, seção 1, 2ª ed. (tabela 6)"
    nome_en: "MidWest Plan Service — MWPS-18, Manure Characteristics, section 1, 2nd ed. (table 6)"
    ano: 2004
  - nome: "IPNI Brasil/NPCT — Calculadora de Balanço de Nutrientes (teores no produto colhido; Cunha, Casarin e Prochnow, Informações Agronômicas 130 e 145)"
    nome_en: "IPNI Brazil/NPCT — Nutrient Balance Calculator (contents in the harvested product; Cunha, Casarin and Prochnow, Informações Agronômicas 130 and 145)"
    url: https://www.npct.com.br/npctweb/npct.nsf/article/calculadora
    ano: 2014
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Cabeças de galinhas, frangos, suínos, matrizes e vacas ordenhadas da PPM 2024 vezes o P₂O₅ excretado por cabeça e por ano (nitrogênio do IPCC 2019 vezes a razão P₂O₅/N do MWPS-18), por hectare de área agropecuária do MapBiomas 2024, em seis classes; listras onde esse P₂O₅ passa o exportado pelas colheitas do município (PAM 2024 × teores do IPNI)."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#844a6d", descricao: "645 municípios: rebanhos, N, P₂O₅ e K₂O dos dejetos confinados, P₂O₅ por hectare e exportação pelas colheitas (mesmo GPKG da prancha 081)", descricao_en: "645 municipalities: herds, housed-herd manure N, P₂O₅ and K₂O, P₂O₅ per hectare and crop removal (same GPKG as plate 081)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "P₂O₅ dos dejetos confinados pela classe de kg por hectare do município"
    rotulo_en: "Housed-herd manure P₂O₅ by the municipality’s kg per hectare class"
    unidade: "t de P₂O₅ por ano"
    unidade_en: "t P₂O₅ a year"
    itens:
      - { rotulo: "até 1 kg/ha", rotulo_en: "up to 1 kg/ha", valor: 1675, cor: "#f4eef2" }
      - { rotulo: "1 a 3 kg/ha", rotulo_en: "1 to 3 kg/ha", valor: 12221, cor: "#e3cfda" }
      - { rotulo: "3 a 6 kg/ha", rotulo_en: "3 to 6 kg/ha", valor: 15311, cor: "#cba3b8" }
      - { rotulo: "6 a 12 kg/ha", rotulo_en: "6 to 12 kg/ha", valor: 18223, cor: "#ab7393" }
      - { rotulo: "12 a 25 kg/ha", rotulo_en: "12 to 25 kg/ha", valor: 24633, cor: "#844a6d" }
      - { rotulo: "mais de 25 kg/ha", rotulo_en: "over 25 kg/ha", valor: 16467, cor: "#55283f" }
  - tipo: barras
    rotulo: "P₂O₅ dos dejetos por rebanho"
    rotulo_en: "Manure P₂O₅ by herd"
    unidade: "mil t de P₂O₅ por ano"
    unidade_en: "thousand t P₂O₅ a year"
    itens:
      - { rotulo: "frangos de corte", rotulo_en: "broilers", valor: 39.9, cor: "#c9879a" }
      - { rotulo: "vacas ordenhadas", rotulo_en: "milked cows", valor: 29.4, cor: "#a9845f" }
      - { rotulo: "galinhas poedeiras", rotulo_en: "laying hens", valor: 10.4, cor: "#ddb3c1" }
      - { rotulo: "suínos", rotulo_en: "pigs", valor: 8.8, cor: "#8e5b6e" }
  - tipo: numero
    rotulo: "Municípios onde o fósforo dos dejetos passa o exportado pela colheita"
    rotulo_en: "Municipalities where manure phosphorus exceeds crop removal"
    valor: 177
    unidade: "municípios"
    unidade_en: "municipalities"
    nota: "33 mil t de P₂O₅ a mais do que as colheitas levam"
    nota_en: "33,000 t of P₂O₅ beyond what the harvests remove"

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
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/nutrientes-sp-2026/sp_fosforo_dejetos_2024_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/nutrientes-sp-2026/sp_fosforo_dejetos_2024_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,4 MB"
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

# O fósforo dos dejetos de aves, suínos e vacas de leite

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 082, a segunda de quatro da coleção **Dejetos que adubam**. O nitrogênio de todos os
rebanhos está na [prancha 081](../081-nitrogenio-dos-dejetos-sp/README.md), com o GPKG da coleção e
a tabela de coeficientes.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: rebanhos da PPM 2024; `n_conf_t`, `p2o5_conf_t` e `k2o_conf_t` (dejetos de galinhas, frangos, suínos, matrizes e vacas ordenhadas); `p2o5_kg_ha_agro`; `p2o5_exporta_t` (exportação pelas colheitas, prancha 083); demais campos da coleção |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

O **GPKG** e o **CSV** são os da coleção, publicados na prancha 081 e repetidos aqui; o estilo do
QGIS desta prancha é o `p2o5_kg_ha_agro`.

## Método

1. **Só os rebanhos confinados.** Aves, suínos e vacas de leite ficam em galpões, pocilgas e
   estábulos, e o esterco deles se recolhe, armazena e transporta. O gado de corte e os pequenos
   ruminantes, que deixam o esterco no pasto, ficam fora desta prancha.
2. **P₂O₅ por cabeça.** O nitrogênio de cada cabeça (IPCC 2019, como na prancha 081) vezes a razão
   P₂O₅/N do esterco como excretado, da tabela 6 do MWPS-18 (2004). Por cabeça e por ano: vaca
   ordenhada 37,2 kg; matriz suína 12,2; suíno 5,2; galinha 0,18; frango 0,27.
3. **Por hectare.** Soma sobre a área agropecuária do MapBiomas 2024, em seis classes fechadas à
   direita: até 1, 1 a 3, 3 a 6, 6 a 12, 12 a 25 e mais de 25 kg de P₂O₅ por hectare.
4. **Listras.** Onde o P₂O₅ desse esterco passa o P₂O₅ que as colheitas do município exportam, pela
   conta da prancha 083 (produção da PAM 2024 vezes os teores no produto colhido do IPNI Brasil).

## Limitações

- **É estimativa.** A razão P₂O₅/N vem de rebanhos norte-americanos (MWPS-18); a ração e o uso de
  fitase mudam o fósforo do esterco. A tabela 3 de Gatiboni e Nicoloso (Embrapa, 2019), feita com
  dados brasileiros, dá para a vaca de leite 36,8 kg de P₂O₅ por ano, perto dos 37,2 usados aqui.
- Mais fósforo no esterco do que na colheita não quer dizer contaminação: o solo retém fósforo, e o
  esterco pode sair do município. A listra mostra onde a conta local não fecha.
- A PPM conta o efetivo num dia do ano; granjas de frango têm vários lotes por ano.
- 28 municípios sem dado da PPM ficam hachurados, sem informação, nunca como zero.
