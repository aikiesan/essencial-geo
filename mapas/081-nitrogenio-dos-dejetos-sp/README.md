---
numero: 81
titulo: "O nitrogênio dos dejetos"
subtitulo: "Meio milhão de toneladas por ano; em Bastos, três vezes o teto europeu"
data: 2026-12-11
categoria: uso-do-solo
colecao: nutrientes-sp
tags: [nutrientes-sp, sao-paulo, dejetos, nitrogenio, pecuaria, balanco-de-nutrientes, municipios]

contexto: >-
  Os rebanhos paulistas excretam cerca de 535 mil toneladas de nitrogênio por ano, na conta feita com o efetivo da PPM 2024 e os coeficientes do IPCC. Sobre os 16,9 milhões de hectares de área agropecuária do MapBiomas, são 31,5 kg de N por hectare; a mediana dos municípios é 29 kg. Quase dois terços (65%) vêm do gado de corte, espalhado pelos pastos; as aves dão 18%, as vacas de leite 11% e os suínos 4%. A Diretiva Nitratos da União Europeia limita a 170 kg de N por hectare o estrume aplicado nas zonas vulneráveis. Quatro municípios paulistas passam disso: Bastos, a capital do ovo, com 579 kg/ha, e Cerquilho (232), Jumirim (219) e Porangaba (171), com granjas de frango. Presidente Bernardes, no Pontal, tem o maior total depois de Bastos: 5,6 mil toneladas, quase todas de gado no pasto. Primeira prancha da coleção «Dejetos que adubam».

imagem: ./mapa_preview.png
imagem_alt: "Mapa dos municípios de São Paulo em seis tons de bege a marrom-escuro, pelo nitrogênio dos dejetos dos rebanhos por hectare de área agropecuária. O oeste e o Vale do Paraíba, de pastagens, ficam em tons médios; o centro-norte canavieiro, claro; a Grande São Paulo e o litoral, sem dado da pecuária, hachurados. Chamadas apontam Bastos, com 579 kg de N por hectare, 91% das aves; Presidente Bernardes, com o maior total depois de Bastos, quase todo de gado no pasto; e Cerquilho, Jumirim e Porangaba, também acima de 170 kg/ha. No painel, a parte do nitrogênio em cada classe e o nitrogênio por rebanho."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Pesquisa da Pecuária Municipal 2024 (SIDRA, tabelas 3939 e 94; tabela 94 obtida em https://apisidra.ibge.gov.br/values/t/94/n6/in%20n3%2035/v/all/p/2024 em 18/10/2026)"
    nome_en: "IBGE — 2024 Municipal Livestock Survey (SIDRA, tables 3939 and 94; table 94 retrieved from https://apisidra.ibge.gov.br/values/t/94/n6/in%20n3%2035/v/all/p/2024 on 18/10/2026)"
    url: https://sidra.ibge.gov.br/pesquisa/ppm
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
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Cabeças de cada rebanho da PPM 2024 vezes o nitrogênio excretado por cabeça e por ano (IPCC 2019, médias da América Latina), somado por município e dividido pela área agropecuária do MapBiomas 2024 (pastagem, lavouras temporárias e perenes, cana, citros e mosaico de usos), em seis classes; a última começa no teto de 170 kg de N por hectare da Diretiva Nitratos."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#7f6238", descricao: "645 municípios: rebanhos da PPM 2024, área agropecuária e de lavoura; N, P₂O₅ e K₂O dos dejetos; exportação pelas colheitas; cobertura; digestato do CP2B", descricao_en: "645 municipalities: 2024 PPM herds, farmland and cropland; manure N, P₂O₅ and K₂O; crop removal; coverage; CP2B digestate" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "Nitrogênio dos dejetos pela classe de kg de N por hectare do município"
    rotulo_en: "Manure nitrogen by the municipality’s kg N per hectare class"
    unidade: "t de N por ano"
    unidade_en: "t N a year"
    itens:
      - { rotulo: "até 10 kg/ha", rotulo_en: "up to 10 kg/ha", valor: 15556, cor: "#f2efe6" }
      - { rotulo: "10 a 25 kg/ha", rotulo_en: "10 to 25 kg/ha", valor: 88395, cor: "#e2d8bf" }
      - { rotulo: "25 a 50 kg/ha", rotulo_en: "25 to 50 kg/ha", valor: 243451, cor: "#c9b58c" }
      - { rotulo: "50 a 100 kg/ha", rotulo_en: "50 to 100 kg/ha", valor: 162896, cor: "#a98c5c" }
      - { rotulo: "100 a 170 kg/ha", rotulo_en: "100 to 170 kg/ha", valor: 8424, cor: "#7f6238" }
      - { rotulo: "mais de 170 kg/ha", rotulo_en: "over 170 kg/ha", valor: 15853, cor: "#4a3418" }
  - tipo: barras
    rotulo: "Nitrogênio dos dejetos por rebanho"
    rotulo_en: "Manure nitrogen by herd"
    unidade: "mil t de N por ano"
    unidade_en: "thousand t N a year"
    itens:
      - { rotulo: "bovinos de corte e búfalos", rotulo_en: "beef cattle and buffalo", valor: 347.3, cor: "#7c5a3c" }
      - { rotulo: "galinhas e frangos", rotulo_en: "hens and broilers", valor: 93.8, cor: "#c9879a" }
      - { rotulo: "vacas ordenhadas", rotulo_en: "milked cows", valor: 57.1, cor: "#a9845f" }
      - { rotulo: "suínos", rotulo_en: "pigs", valor: 20.8, cor: "#8e5b6e" }
      - { rotulo: "cavalos, ovelhas e cabras", rotulo_en: "horses, sheep and goats", valor: 15.5, cor: "#b7b09c" }
  - tipo: numero
    rotulo: "Nitrogênio dos dejetos por hectare agropecuário"
    rotulo_en: "Manure nitrogen per farmland hectare"
    valor: 31.5
    unidade: "kg/ha"
    nota: "535 mil t de N por ano, estimadas"
    nota_en: "535,000 t N a year, estimated"

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
    url: https://github.com/aikiesan/essencial-geo/releases/download/nutrientes-sp-2026/sp_nitrogenio_dejetos_2024_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/nutrientes-sp-2026/sp_nitrogenio_dejetos_2024_prancha.en.svg
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

# O nitrogênio dos dejetos dos rebanhos paulistas

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 081, a primeira de quatro da coleção **Dejetos que adubam**, à maneira do balanço bruto de
nutrientes da Eurostat e da OCDE e dos mapas de densidade pecuária da Agência Europeia do Ambiente.
O fósforo vem na [prancha 082](../082-fosforo-dos-dejetos-sp/README.md); a comparação com as
colheitas, na [083](../083-dejetos-e-colheitas-sp/README.md); o digestato do biogás, na
[084](../084-digestato-do-biogas-sp/README.md).

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios. Rebanhos da PPM 2024 (`bovinos` sem as vacas ordenhadas, `vacas_ordenhadas`, `bubalinos`, `equinos`, `suinos` sem as matrizes, `matrizes`, `galinhas`, `frangos` = galináceos menos galinhas, `ovinos`, `caprinos`, `codornas`); `area_agro_ha` (MapBiomas) e `area_lavoura_ha` (PAM); `n_dejetos_t` e a parte de cada rebanho (`n_bovinos_t`, `n_leite_t`, `n_aves_t`, `n_suinos_t`, `n_outros_t`); `n_kg_ha_agro`; os campos das pranchas 082 a 084; `sem_info_ppm` |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

O **GPKG** é o mesmo das quatro pranchas, com os **estilos do QGIS** de cada uma (`n_kg_ha_agro`,
`p2o5_kg_ha_agro`, `cob_n_pct`, `cob_p2o5_pct`, `cob_k2o_pct`, `dig_cob_p2o5_pct`). O **CSV** tem
a tabela dos municípios, sem geometria; o dos **coeficientes** traz cada número usado na conta, com a
fonte.

## Método

1. **Rebanhos.** Efetivo de 31/12/2024 da PPM (tabela 3939) por município; vacas ordenhadas da
   tabela 94, obtida pela API do SIDRA em 18/10/2026. Vacas ordenhadas saem do total de bovinos,
   matrizes do total de suínos e galinhas do total de galináceos (o resto é frango). Onde o IBGE não
   publica as vacas ordenhadas (42 municípios), todo o rebanho conta como gado de corte.
2. **Nitrogênio por cabeça.** Taxa de excreção (kg de N por mil kg de peso vivo por dia, tabela 10.19)
   vezes a massa típica (tabela 10A.5), médias da América Latina do IPCC 2019, vezes 365. Por cabeça e
   por ano: vaca ordenhada 72,3 kg; bovino de corte 34,3; búfalo 47,1; cavalo 40,0; matriz suína 18,3;
   suíno 13,6; galinha 0,60; frango 0,40; ovelha 3,6; cabra 3,0. Os coeficientes estão no CSV.
3. **Por hectare.** Soma dos rebanhos sobre a área agropecuária do MapBiomas 2024 (pastagem, lavouras
   temporárias e perenes, cana, citros e mosaico de usos), a mesma da prancha 045. Seis classes,
   fechadas à direita: até 10, 10 a 25, 25 a 50, 50 a 100, 100 a 170 e mais de 170 kg de N por
   hectare.
4. **O teto europeu.** A Diretiva Nitratos (91/676/CEE) limita a 170 kg de N por hectare e por ano o
   estrume aplicado nas zonas vulneráveis. Aqui ele serve só de régua: o limite vale para o estrume
   espalhado, não para o excretado no pasto, e não há regra equivalente no Brasil.

## Limitações

- **É estimativa.** O nitrogênio vem de coeficientes médios por cabeça, não de medições nas
  propriedades; dieta, raça, peso e produtividade mudam a excreção. Os números mostram a ordem de
  grandeza e onde a carga se concentra.
- O nitrogênio excretado não é o que chega ao solo: parte se perde como amônia e óxido nitroso no
  galpão, na esterqueira e no campo. Uma conta de nitrogênio disponível pediria fatores de perda por
  sistema de manejo.
- O gado de corte deixa o esterco no próprio pasto, espalhado; a carga dele por hectare não se
  compara à de uma granja, que concentra o esterco num só lugar.
- 28 municípios da Grande São Paulo e do litoral não têm dado da PPM e ficam hachurados, sem
  informação, nunca como zero.
- A PPM conta o efetivo num dia do ano (31/12); granjas de frango têm vários lotes por ano, e o
  coeficiente por cabeça já supõe um animal presente o ano todo.
