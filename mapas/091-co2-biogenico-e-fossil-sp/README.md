---
numero: 91
titulo: "Biogênico contra fóssil"
subtitulo: "Nas grandes fontes fixas do estado, metade do CO₂ vem da cana"
data: 2026-10-20
categoria: energia
colecao: carbono-sp
tags: [carbono-sp, sao-paulo, co2-biogenico, co2-fossil, gas-natural, industria, etanol, semil]

contexto: >-
  O gás que sai da dorna de etanol é quase 100 % CO₂; o de uma chaminé de combustão tem de 3 % a 15 %. Por isso as usinas estão entre as fontes mais fáceis de capturar. Em 2024, as dornas paulistas soltaram cerca de 10,1 milhões de t de CO₂ biogênico. O gás natural da indústria, da cogeração e das termelétricas, o óleo combustível e o coque somaram 9,3 milhões de t de CO₂ fóssil, pelo Anuário de Energéticos da SEMIL e pelos fatores do IPCC. Nessas grandes fontes fixas, 52 % do CO₂ vem da cana. O mapa se divide: no interior canavieiro, 116 municípios têm mais CO₂ biogênico que fóssil; o fóssil se concentra na capital (850 mil t), em Cubatão (738 mil), Santa Gertrudes, Paulínia e Jacareí. Em Piracicaba, as duas fontes se misturam: 34 % é biogênico. O fóssil aqui é um piso. Terceira prancha da coleção «Carbono biogênico».

imagem: ./mapa_preview.png
imagem_alt: "Mapa de São Paulo com círculos proporcionais ao CO₂ de 2024 das grandes fontes fixas de cada município, somando dornas de etanol e queima de gás natural, óleo combustível e coque, coloridos pela parte biogênica: do roxo, quase todo fóssil, ao verde-escuro, quase todo biogênico. Os verdes cobrem o interior, no norte e no oeste; os roxos se concentram na Grande São Paulo, em Cubatão, em Campinas e no Vale do Paraíba. Chamadas apontam Cubatão, com 738 mil t de CO₂ fóssil, Guaíra, com 310 mil t, todo das dornas, e Piracicaba, com 34 % biogênico. No painel, barras comparam as dornas, o biogás possível, o fóssil das fontes fixas e toda a energia fóssil do estado, 77 milhões de t."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "SEMIL (SP) — Anuário de Energéticos por Município do Estado de São Paulo 2025, ano base 2024 (consumo de gás natural e de derivados por município)"
    nome_en: "SEMIL (SP) — Energy Yearbook by Municipality of São Paulo State 2025, base year 2024 (natural gas and oil product use by municipality)"
    url: https://semil.sp.gov.br/anuario-de-energeticos-por-municipios-do-estado-de-sao-paulo/
    ano: 2025
  - nome: "ANP — Painel Dinâmico de Produtores de Etanol (produção de 2024 e capacidade por usina)"
    nome_en: "ANP — Ethanol Producers Dynamic Panel (2024 output and capacity by mill)"
    url: https://www.gov.br/anp/pt-br/assuntos/producao-e-fornecimento-de-biocombustiveis/etanol/arquivos-etanol/pb-da-etanol.zip
    ano: 2026
  - nome: "IPCC (2006) — Diretrizes para inventários nacionais, vol. 2, cap. 1, Tabela 1.4 (fatores de emissão de CO₂ da combustão estacionária)"
    nome_en: "IPCC (2006) — Guidelines for National Greenhouse Gas Inventories, vol. 2, ch. 1, Table 1.4 (stationary combustion CO₂ emission factors)"
    ano: 2006
  - nome: "IPCC (2005) — Relatório Especial sobre Captura e Armazenamento de CO₂, Tabela 2.1 (concentração de CO₂ por tipo de fonte)"
    nome_en: "IPCC (2005) — Special Report on Carbon Dioxide Capture and Storage, Table 2.1 (CO₂ concentration by source type)"
    ano: 2005
  - nome: "EPE — Balanço Energético Nacional 2025 (poderes caloríficos inferiores)"
    nome_en: "EPE — Brazilian Energy Balance 2025 (net calorific values)"
    ano: 2025
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "CO₂ fóssil de 2024 por município: consumo industrial, de cogeração e de termogeração de gás natural e consumo de óleo combustível e de coque de petróleo (Anuário de Energéticos da SEMIL), vezes o poder calorífico do BEN e o fator de emissão do IPCC 2006; CO₂ biogênico de 2024: fermentação do etanol estimada como na prancha 089; parte biogênica = biogênico ÷ (biogênico + fóssil)."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#5d4a6b", descricao: "645 municípios: CO₂ fóssil (gás, óleo, coque e toda a energia), CO₂ das dornas em 2024 e parte biogênica (mesmo GPKG da prancha 089)", descricao_en: "645 municipalities: fossil CO₂ (gas, oil, coke and all energy), vat CO₂ in 2024 and biogenic share (same GPKG as plate 089)" }

indicadores:
  - tipo: proporcao
    rotulo: "CO₂ das grandes fontes fixas em 2024"
    rotulo_en: "CO₂ from large fixed sources in 2024"
    unidade: "t"
    unidade_en: "t"
    itens:
      - { rotulo: "dornas de etanol (biogênico)", rotulo_en: "ethanol vats (biogenic)", valor: 10072615, cor: "#3d5e34" }
      - { rotulo: "gás, óleo e coque (fóssil)", rotulo_en: "gas, oil and coke (fossil)", valor: 9265202, cor: "#5d4a6b" }
  - tipo: barras
    rotulo: "Maiores fontes fósseis fixas"
    rotulo_en: "Largest fixed fossil sources"
    unidade: "t de CO₂ em 2024"
    unidade_en: "t of CO₂ in 2024"
    itens:
      - { rotulo: "São Paulo", valor: 849580, cor: "#5d4a6b" }
      - { rotulo: "Cubatão", valor: 738384, cor: "#5d4a6b" }
      - { rotulo: "Santa Gertrudes", valor: 597415, cor: "#5d4a6b" }
      - { rotulo: "Paulínia", valor: 513832, cor: "#5d4a6b" }
      - { rotulo: "Jacareí", valor: 489794, cor: "#5d4a6b" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/carbono-sp-2026/sp_carbono_biogenico.gpkg.zip
    rotulo: "Usinas, municípios, regiões e gasodutos (mesmo arquivo das pranchas 089 a 092), SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Mills, municipalities, regions and pipelines (same file as plates 089 to 092), SIRGAS 2000, with QGIS styles"
    tamanho: "4,7 MB"
  - formato: csv
    arquivo: dados/sp_carbono_municipios.csv
    rotulo: "Tabela dos municípios (a mesma da prancha 090)"
    rotulo_en: "Municipal table (the same as plate 090)"
    tamanho: "74 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/carbono-sp-2026/sp_co2_biogenico_fossil_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/carbono-sp-2026/sp_co2_biogenico_fossil_prancha.en.svg
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

# CO₂ biogênico e fóssil nas grandes fontes fixas de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 091, a terceira de quatro da coleção **Carbono biogênico**: quanto do CO₂ concentrado
do estado vem da cana, e quanto da queima de combustível fóssil em fontes fixas.

## O que vem nos arquivos

- `dados/sp_carbono_municipios.csv`: os campos desta prancha são `co2_fermentacao_2024_t`,
  `co2_fossil_gas_t`, `co2_fossil_oleo_t`, `co2_fossil_coque_t`, `co2_fossil_estacionario_t`
  (a soma dos três), `co2_fossil_energia_t` (o CO₂ de toda a energia, da Tabela 9 do Anuário) e
  `pct_biogenico_grandes`, vazio onde não há nem dorna nem fonte fóssil fixa.
- `sp_carbono_biogenico.gpkg.zip` (na release `carbono-sp-2026`): na camada `municipios`, os
  estilos `pct_biogenico` e `co2_fossil_estacionario`.

## Método

1. Consumo fóssil: do Anuário de Energéticos por Município 2025 (ano base 2024), o gás natural
   dos setores industrial, de cogeração e de termogeração (Tabela 4, em m³) e o óleo combustível e
   o coque de petróleo (tabela de derivados, em kg). Gás de uso residencial, comercial e
   automotivo fica de fora: são fontes pequenas e espalhadas.
2. Fatores: gás natural a 8.800 kcal/m³, óleo combustível a 9.590 kcal/kg e coque a 8.390 kcal/kg
   (poderes caloríficos inferiores do BEN 2025), vezes 56.100, 77.400 e 97.500 kg de CO₂ por TJ
   (IPCC 2006, vol. 2, Tabela 1.4): 2,067 kg de CO₂ por m³ de gás, 3,108 kg por kg de óleo e
   3,425 kg por kg de coque.
3. Biogênico: o CO₂ da fermentação em 2024, estimado como na prancha 089, com a produção do ano
   (13,7 bilhões de litros).
4. Parte biogênica: biogênico ÷ (biogênico + fóssil fixo), nos 248 municípios com ao menos uma das
   duas fontes. No estado, 10,1 ÷ (10,1 + 9,3) = 52,1 %.
5. Pureza: o IPCC (2005, Tabela 2.1) dá cerca de 100 % de CO₂ no gás da fermentação do bioetanol,
   contra cerca de 3 % a 15 % nos gases de combustão.
6. Conferência: a soma do gás natural dos municípios bate com a linha do estado na Tabela 3 do
   Anuário (4,78 bilhões de m³), e o CO₂ de toda a energia, com a Tabela 7 (77,4 milhões de t).

## Dados baixados

- SEMIL, Anuário de Energéticos por Município do Estado de São Paulo 2025, ano base 2024 (PDF),
  ligado a <https://semil.sp.gov.br/anuario-de-energeticos-por-municipios-do-estado-de-sao-paulo/>:
  <https://smastr16.blob.core.windows.net/home/2026/03/Anuario-de-Energeticos-por-Municipios-do-Estado-de-Sao-Paulo-2025-ano-base-2024-1.pdf>,
  baixado em 18/10/2026; as tabelas foram lidas do texto do PDF.
- ANP, `pb-da-etanol.zip` (ver prancha 089), baixado em 18/10/2026.

## Limitações

- O fóssil é um piso, e a parte biogênica, um teto. O Anuário vê o combustível vendido nos
  municípios; ficam fora o consumo próprio das refinarias (Paulínia, Cubatão, São José dos Campos,
  Mauá), o carvão mineral e o coque de carvão da siderurgia e o CO₂ de processo da calcinação do
  cimento e da cal, que não vem de combustível.
- O CO₂ da queima do bagaço nas caldeiras das usinas, também biogênico, não entra: só o da
  fermentação, que é o concentrado.
- A fermentação é estimada, não medida (ver prancha 089), e o ponto de cada município é o seu
  ponto interno, não a fábrica.
- Os municípios são a menor unidade do Anuário; uma fábrica grande e muitas pequenas aparecem do
  mesmo jeito.
