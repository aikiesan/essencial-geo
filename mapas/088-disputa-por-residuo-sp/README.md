---
numero: 88
titulo: "Disputa por resíduo"
subtitulo: "Onde as usinas dividem o raio de coleta, e onde o gás não tem usina"
data: 2026-10-20
categoria: energia
colecao: suprimento-sp
tags: [suprimento-sp, sao-paulo, biometano, biogas, anp, aneel, geracao-distribuida, cp2b, raio-de-coleta]

contexto: >-
  Onde as plantas que já existem disputariam o mesmo resíduo, e onde há gás sem planta? Tomando como usina os 28 municípios com planta de biometano autorizada pela ANP (9) ou geração distribuída a biogás registrada na ANEEL (24) e um raio de coleta de 30 km, 71% do potencial do estado não tem nenhuma delas por perto, e só 8,4% está ao alcance de duas ou mais. A disputa se concentra entre Campinas, Piracicaba e a capital: Elias Fausto tem outros seis municípios com usina a menos de 60 km e divide 99% do seu raio; Paulínia e Caieiras, cerca de 90%. Fora do alcance fica justamente o maior potencial do estado: Sertãozinho, com 1,06 milhão de m³ por dia a 30 km, seguido de Pindorama e Morro Agudo. As plantas da ANP somam 558 mil m³ por dia, 3,3% do potencial. Última prancha da coleção «Bacias de suprimento».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo em que os pontos sem usina a até 30 km aparecem em beges e marrons, mais escuros onde há mais biometano a 30 km, com o marrom mais forte no norte, em torno de Sertãozinho; os pontos ao alcance de uma, duas ou três usinas aparecem em azuis cada vez mais escuros, em discos que se sobrepõem sobretudo entre Campinas, Piracicaba e a capital. Círculos azul-escuros marcam as plantas de biometano da ANP e anéis cor de argila, a geração distribuída a biogás. Uma chamada aponta Sertãozinho, com 1,06 milhão de m³ por dia e nenhuma usina perto; outra, Elias Fausto, com 99% do raio dividido. No painel, barras com a capacidade de cada planta da ANP diante do potencial a 30 km."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "ANP — Biometano: instalações autorizadas e produção mensal (abril de 2026)"
    nome_en: "ANP — Biomethane: authorised plants and monthly output (April 2026)"
    url: https://www.gov.br/anp/pt-br/assuntos/producao-e-fornecimento-de-biocombustiveis/biometano
    ano: 2026
  - nome: "ANEEL — Relação de empreendimentos de geração distribuída (dados abertos, outubro de 2026)"
    nome_en: "ANEEL — List of distributed generation units (open data, October 2026)"
    url: https://dadosabertos.aneel.gov.br/dataset/relacao-de-empreendimentos-de-geracao-distribuida
    ano: 2026
  - nome: "CP2B (Unicamp) — potencial de biogás e biometano por município, método v5.1"
    nome_en: "CP2B (Unicamp) — biogas and biomethane potential by municipality, method v5.1"
    ano: 2026
  - nome: "MapBiomas — Coleção 10 da Série Anual de Mapas de Uso e Cobertura da Terra do Brasil, 2024"
    nome_en: "MapBiomas — Collection 10 of the Annual Series of Land Use and Land Cover Maps of Brazil, 2024"
    url: https://brasil.mapbiomas.org/colecoes-mapbiomas/
    ano: 2024
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Municípios com planta de biometano da ANP (abril de 2026) ou geração distribuída a biogás da ANEEL (outubro de 2026), no ponto interno do município; para cada célula de cerca de 1 km, o número desses municípios a até 30 km em linha reta, sobre o potencial de biometano do CP2B (v5.1, nível N4, cenário de referência) a até 30 km."

camadas:
  - { nome: usinas, tipo: ponto, cor: "#234e70", descricao: "28 municípios com usina: plantas e empresas da ANP, capacidade de biometano, unidades e potência de GD, biometano a até 30 km por fonte, parte do raio dividida e municípios com usina a até 60 km", descricao_en: "28 municipalities with plants: ANP plants and companies, biomethane capacity, DG units and capacity, biomethane within 30 km by source, share of the radius shared and municipalities with plants within 60 km" }
  - { nome: grade, tipo: poligono, cor: "#88b0c6", descricao: "Células com municipios_com_usina_30km e o biometano a até 30 km; estilo usinas_30km (mesmo GPKG da prancha 085)", descricao_en: "Cells with municipios_com_usina_30km and biomethane within 30 km; style usinas_30km (same GPKG as plate 085)" }

indicadores:
  - tipo: proporcao
    rotulo: "Potencial de biometano pelo número de municípios com usina a até 30 km"
    rotulo_en: "Biomethane potential by number of municipalities with plants within 30 km"
    unidade: "m³/dia"
    unidade_en: "m³/day"
    itens:
      - { rotulo: "nenhum", rotulo_en: "none", valor: 11968294, cor: "#ddb986" }
      - { rotulo: "um", rotulo_en: "one", valor: 3478502, cor: "#c6d9e2" }
      - { rotulo: "dois", rotulo_en: "two", valor: 1121337, cor: "#88b0c6" }
      - { rotulo: "três ou mais", rotulo_en: "three or more", valor: 303979, cor: "#3f7396" }
  - tipo: numero
    rotulo: "Maior alcance de 30 km sem usina (Sertãozinho)"
    rotulo_en: "Largest 30 km catchment with no plant (Sertãozinho)"
    valor: 1.06
    unidade: "milhão de m³/dia"
    unidade_en: "million m³/day"
  - tipo: numero
    rotulo: "Capacidade autorizada das plantas da ANP sobre o potencial do estado"
    rotulo_en: "Authorised capacity of ANP plants over the state’s potential"
    valor: 3.3
    unidade: "%"
    nota: "557.816 de 16,9 milhões de m³/dia"
    nota_en: "557,816 of 16.9 million m³/day"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/suprimento-sp-2026/sp_suprimento_biometano.gpkg.zip
    rotulo: "Grade, bacias, pontos de entrega, subestações e usinas (pranchas 085 a 088), SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Grid, catchments, delivery points, substations and plants (plates 085 to 088), SIRGAS 2000, with QGIS styles"
    tamanho: "1,2 MB"
  - formato: csv
    arquivo: dados/sp_biometano_disputa_usinas.csv
    rotulo: "Tabela dos 28 municípios com usina"
    rotulo_en: "Table of the 28 municipalities with plants"
    tamanho: "3 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/suprimento-sp-2026/sp_biometano_disputa_por_residuo_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/suprimento-sp-2026/sp_biometano_disputa_por_residuo_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,3 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,2 MB"

doi_automatico: true
versao: "1.0.0"
discussoes: []
---

# Disputa por resíduo em São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 088, a última de quatro da coleção **Bacias de suprimento**. As plantas e a geração
distribuída são as da [prancha 059](../059-biogas-em-operacao-sp/README.md); aqui elas ganham um
raio de coleta, sobre o alcance de 30 km da [prancha 085](../085-biometano-ao-alcance-sp/README.md).

## O que vem nos arquivos

O CSV traz os 28 municípios com usina: `plantas_anp`, `empresas_anp`, `capacidade_biometano_m3d`,
`gd_unidades`, `gd_potencia_kw`, o biometano a até 30 km no total e por fonte (`alcance30_…`),
`pct_raio_disputado` (parte desse potencial que outro município com usina também alcança),
`municipios_com_usina_60km` e as coordenadas do ponto interno. No GPKG, a mesma tabela está na
camada `usinas`, e a camada `grade` traz `municipios_com_usina_30km` em cada célula.

## Método

1. ANP: plantas de biometano de SP no último mês informado (abril de 2026), com a capacidade
   autorizada. ANEEL: unidades de geração distribuída a biogás de SP (outubro de 2026), somadas por
   município. Os dois juntos dão 28 municípios: 9 com planta da ANP, 24 com GD e 5 com as duas.
2. Cada município com usina vira um ponto, no ponto interno do município, com raio de coleta de
   30 km em linha reta, o mesmo da prancha 085.
3. Para cada célula de cerca de 1 km, conta-se quantos desses pontos estão a até 30 km; o potencial
   da célula entra na classe correspondente. Nas células sem nenhum, a cor segue o biometano a até
   30 km, com o corte de 60 mil m³/dia (a mediana das plantas da ANP) e o de 300 mil.
4. O raio disputado de cada usina é a parte do potencial a até 30 km dela que fica em células
   alcançadas por mais de um município com usina.

## Limitações

- O ponto é o do município, não o endereço da planta: dentro de um município grande, a posição
  real pode mudar a conta.
- Uma GD de 75 kW e uma planta de 130 mil m³/dia contam igual como usina; a disputa é pelo raio,
  não pelo volume que cada uma consome.
- As termelétricas a biogás fora da geração distribuída e o inventário de usinas de biogás do
  MapBiomas, da [prancha 028](../028-usinas-de-biogas-sp/README.md), não entram: «sem usina» quer
  dizer sem planta da ANP nem GD da ANEEL a até 30 km. Usinas de açúcar e etanol que queimam ou
  aproveitam biogás sem registro nessas duas bases podem estar em áreas que aparecem como livres.
- O potencial é o nível N4 do CP2B, que já desconta usos existentes do resíduo; a sobreposição
  mostra competição possível, não contratos de fornecimento.
