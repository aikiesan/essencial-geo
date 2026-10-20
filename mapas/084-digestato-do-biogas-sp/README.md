---
numero: 84
titulo: "O digestato do biogás"
subtitulo: "Se os dejetos passassem pelo biodigestor, voltariam ao campo 98 mil t de N e 49 mil t de P₂O₅ por ano"
data: 2026-10-20
categoria: energia
colecao: nutrientes-sp
tags: [nutrientes-sp, sao-paulo, biogas, biometano, digestato, cp2b, dejetos, balanco-de-nutrientes, municipios]

contexto: >-
  O potencial de biometano dos dejetos de aves, suínos e bovinos em São Paulo, no nível acessível do CP2B, é de 1,29 milhão de m³ por dia. O digestato que sobra desse biogás guarda os nutrientes do esterco: cerca de 98 mil toneladas de nitrogênio, 49 mil de P₂O₅ e 48 mil de K₂O por ano, o equivalente a 25% do fósforo, 14% do nitrogênio e 9% do potássio que as colheitas do estado exportam. Três quartos do nitrogênio viriam das granjas de aves. Em 61 municípios com ao menos mil hectares colhidos, o digestato daria todo o P₂O₅ da colheita. Bastos teria 2,2 mil toneladas de P₂O₅ no digestato, cem vezes o que a sua lavoura leva; Botucatu, com 43 mil hectares de lavoura, 117%. A cana, que responde pela maior parte do potencial do CP2B, fica fora: vinhaça, torta e palha já voltam ao canavial. Quarta e última prancha da coleção «Dejetos que adubam».

imagem: ./mapa_preview.png
imagem_alt: "Mapa dos municípios de São Paulo em seis tons de verde, pela parte do fósforo exportado pelas colheitas que o digestato do biogás dos dejetos repõe, com círculos vazados em vinho do tamanho do P₂O₅ no digestato. O verde-escuro se concentra no centro-leste, de Sorocaba a Campinas, em Bastos e em Mococa; o oeste e o norte são claros. Chamadas apontam Bastos, com 2.198 toneladas de P₂O₅ e 73 mil m³ de biometano por dia, e Botucatu, onde o digestato cobre 117% do fósforo da colheita. No painel, as classes, a legenda dos círculos e a origem do nitrogênio do digestato."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "CP2B (Unicamp) — potencial de biogás e biometano por município, método v5.1 (24/09/2026), nível N4 acessível, cenário de referência"
    nome_en: "CP2B (Unicamp) — biogas and biomethane potential by municipality, method v5.1 (24/09/2026), accessible level N4, reference scenario"
    ano: 2026
  - nome: "IBGE — Produção Agrícola Municipal 2024 (SIDRA, tabelas 1612 e 1613, variáveis 214 e 216; obtidas em https://apisidra.ibge.gov.br/values/t/1612/n6/in%20n3%2035/v/214/p/2024/c81/all e equivalentes em 18/10/2026)"
    nome_en: "IBGE — 2024 Municipal Agricultural Production (SIDRA, tables 1612 and 1613, variables 214 and 216; retrieved from https://apisidra.ibge.gov.br/values/t/1612/n6/in%20n3%2035/v/214/p/2024/c81/all and equivalents on 18/10/2026)"
    url: https://sidra.ibge.gov.br/pesquisa/pam
    ano: 2024
  - nome: "IBGE — Pesquisa da Pecuária Municipal 2024 (SIDRA, tabelas 3939 e 94)"
    nome_en: "IBGE — 2024 Municipal Livestock Survey (SIDRA, tables 3939 and 94)"
    url: https://sidra.ibge.gov.br/pesquisa/ppm
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
metodo: "Metano do nível N4 do CP2B v5.1 (cenário de referência) para os dejetos de aves de corte e de postura, suínos, bovinos de leite, de confinamento e de pasto, convertido em cabeças equivalentes pelos parâmetros médios de cada substrato e multiplicado pelo N, P₂O₅ e K₂O excretados por cabeça (IPCC 2019 e MWPS-18); o digestato conserva esses nutrientes. Cor: digestato sobre o P₂O₅ exportado pelas colheitas do município (PAM 2024 × IPNI), em seis classes; círculos: toneladas de P₂O₅."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#1f4f33", descricao: "645 municípios: N, P₂O₅ e K₂O no digestato dos dejetos (CP2B N4), biometano, e a parte da exportação pelas colheitas que ele repõe (mesmo GPKG da prancha 081)", descricao_en: "645 municipalities: N, P₂O₅ and K₂O in manure digestate (CP2B N4), biomethane, and the share of crop removal it replaces (same GPKG as plate 081)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: barras
    rotulo: "Nutrientes no digestato dos dejetos"
    rotulo_en: "Nutrients in manure digestate"
    unidade: "mil t por ano"
    unidade_en: "thousand t a year"
    itens:
      - { rotulo: "nitrogênio (N)", rotulo_en: "nitrogen (N)", valor: 98.3, cor: "#1f4f33" }
      - { rotulo: "fósforo (P₂O₅)", rotulo_en: "phosphorus (P₂O₅)", valor: 49.4, cor: "#467a55" }
      - { rotulo: "potássio (K₂O)", rotulo_en: "potassium (K₂O)", valor: 48.1, cor: "#76a07d" }
  - tipo: proporcao
    rotulo: "Origem do nitrogênio do digestato"
    rotulo_en: "Origin of the digestate nitrogen"
    unidade: "%"
    itens:
      - { rotulo: "aves", rotulo_en: "poultry", valor: 74.9, cor: "#c9879a" }
      - { rotulo: "bovinos", rotulo_en: "cattle", valor: 16.5, cor: "#7c5a3c" }
      - { rotulo: "suínos", rotulo_en: "pigs", valor: 8.6, cor: "#8e5b6e" }
  - tipo: numero
    rotulo: "P₂O₅ do digestato sobre o exportado pelas colheitas do estado"
    rotulo_en: "Digestate P₂O₅ over the state’s crop removal"
    valor: 25.4
    unidade: "%"
    nota: "1,29 milhão de m³ de biometano por dia no mesmo potencial"
    nota_en: "1.29 million m³ of biomethane a day from the same potential"

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
    url: https://github.com/aikiesan/essencial-geo/releases/download/nutrientes-sp-2026/sp_digestato_biogas_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/nutrientes-sp-2026/sp_digestato_biogas_prancha.en.svg
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

# O digestato do biogás dos dejetos

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 084, a quarta e última da coleção **Dejetos que adubam**. O que o esterco devolve sem
biodigestor está na [prancha 083](../083-dejetos-e-colheitas-sp/README.md).

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `dig_n_t`, `dig_p2o5_t`, `dig_k2o_t` (nutrientes no digestato); `dig_biometano_m3_dia`; `dig_cob_n_pct`, `dig_cob_p2o5_pct`, `dig_cob_k2o_pct` (digestato sobre a exportação pelas colheitas); demais campos da coleção |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

O **GPKG** e o **CSV** são os da coleção, publicados na prancha 081; o estilo do QGIS desta prancha é
o `dig_cob_p2o5_pct`.

## Método

1. **Potencial.** Metano por ano no nível N4 (acessível) do CP2B v5.1, cenário de referência, para os
   seis substratos de dejetos: aves de corte, aves de postura, suínos, bovinos de leite, bovinos de
   confinamento e bovinos de pasto. O biometano é o equivalente que o CP2B publica.
2. **Cabeças equivalentes.** Metano dividido pelo metano de uma cabeça, pelos parâmetros médios do
   próprio CP2B para cada substrato (dejeto por cabeça, sólidos totais, sólidos voláteis e potencial
   bioquímico de metano). Cada substrato fica ligado a uma categoria de rebanho: frango, galinha,
   suíno, vaca ordenhada, bovino de confinamento (coeficiente do IPCC para sistema de alta
   produtividade) e bovino de corte.
3. **Nutrientes.** Cabeças equivalentes vezes o N, P₂O₅ e K₂O excretados por cabeça (IPCC 2019 e
   MWPS-18, como nas pranchas 081 e 082). A biodigestão tira carbono como metano e gás carbônico e
   conserva o nitrogênio, o fósforo e o potássio, que saem no digestato.
4. **Comparação.** Digestato sobre o P₂O₅ exportado pelas colheitas do município (prancha 083), em seis
   classes fechadas à direita: até 5, 5 a 15, 15 a 30, 30 a 60, 60 a 100 e mais de 100%. Municípios sem
   potencial nos dejetos ou com menos de mil hectares colhidos ficam em cinza. Círculos para os
   municípios com ao menos 50 toneladas de P₂O₅ no digestato.

## Limitações

- **É estimativa.** O potencial do CP2B é técnico, não um parque de biodigestores; os nutrientes vêm
  de coeficientes médios por cabeça e da conversão de volta do metano em cabeças, e herdam as
  incertezas de ambos.
- Só dejetos de animais. Ficam de fora a cana (82% do potencial do CP2B no estado, cujos resíduos,
  vinhaça, torta de filtro e palha, já voltam ao canavial), as outras lavouras e o lixo e o esgoto
  urbanos.
- Parte do nitrogênio se perde como amônia na estocagem e na aplicação do digestato; o valor é o do
  nitrogênio que entra no biodigestor.
- O fertilizante mineral entregue no estado não entra na comparação: a ANDA não publica a entrega por
  município em dados abertos. A comparação é com o que as colheitas exportam.
