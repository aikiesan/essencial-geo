---
numero: 59
titulo: "Biogás em operação"
subtitulo: "Do potencial, o que já virou planta"
data: 2026-10-20
categoria: energia
colecao: biogas-territorio-sp
tags: [biogas-territorio-sp, sao-paulo, biometano, biogas, anp, aneel, geracao-distribuida, cp2b]

contexto: >-
  Do potencial de 16,9 milhões de m³ de biometano por dia, quanto já virou planta? Em abril de 2026, nove plantas de biometano paulistas informaram produção à ANP. Somadas, têm 558 mil m³ por dia de capacidade autorizada, 3,3% do potencial, e no mês processaram só 15% do biogás que poderiam tratar: três delas ficaram perto de zero. A maior, da Raízen e da Geo em Piracicaba, tem 130 mil m³ por dia autorizados, a partir da vinhaça e da torta de filtro; a do aterro de Caieiras é a que mais roda, com 45% de uso. Na eletricidade, a ANEEL registra 32 unidades de geração distribuída a biogás no estado, com 21,9 MW, em 24 municípios: a maior parte em aterros da capital e de São José dos Campos e numa usina de Narandiba; as outras, menores, sobretudo com dejetos de granjas. As termelétricas a biogás maiores estão na prancha 028. Última prancha da coleção «Biogás no território».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com os municípios em verdes claros pelo potencial de biometano. Círculos azul-escuros, proporcionais à capacidade autorizada, marcam nove plantas de biometano da ANP, de Narandiba e Paraguaçu Paulista, no oeste, a Américo Brasiliense, Piracicaba, Elias Fausto, Paulínia, Caieiras, São Paulo e Jambeiro. Anéis cor de argila, proporcionais à potência, marcam a geração distribuída a biogás em 24 municípios, o maior na capital. Uma chamada aponta Piracicaba, com 130 mil m³ por dia autorizados, a maior capacidade. No painel, barras com a capacidade de cada planta e a parte do biogás processada no mês."

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
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Plantas de biometano de SP que informaram produção à ANP em abril de 2026, com capacidade autorizada e biogás processado, e unidades de geração distribuída a biogás da ANEEL somadas por município, sobre o potencial de biometano (método CP2B v5.1, nível N4, cenário de referência)."

camadas:
  - { nome: plantas_biometano, tipo: ponto, cor: "#234e70", descricao: "9 plantas de biometano: razão social, CNPJ, capacidade de biometano e de biogás, biogás processado e uso no mês", descricao_en: "9 biomethane plants: company name, CNPJ, biomethane and biogas capacity, biogas processed and use in the month" }
  - { nome: gd_biogas, tipo: ponto, cor: "#9c4a32", descricao: "24 municípios com geração distribuída a biogás: unidades e potência (kW) por tipo de resíduo", descricao_en: "24 municipalities with biogas distributed generation: units and capacity (kW) by residue type" }
  - { nome: municipios, tipo: poligono, cor: "#93ab7f", descricao: "645 municípios: potencial, capacidade da ANP e potência de GD (mesmo GPKG da prancha 055)", descricao_en: "645 municipalities: potential, ANP capacity and DG capacity (same GPKG as plate 055)" }

indicadores:
  - tipo: proporcao
    rotulo: "Capacidade autorizada das plantas de biometano"
    rotulo_en: "Authorised capacity of biomethane plants"
    unidade: "m³/dia"
    unidade_en: "m³/day"
    itens:
      - { rotulo: "Piracicaba", rotulo_en: "Piracicaba", valor: 130368, cor: "#234e70" }
      - { rotulo: "Paulínia", rotulo_en: "Paulínia", valor: 106867, cor: "#2f5f86" }
      - { rotulo: "Américo Brasiliense", rotulo_en: "Américo Brasiliense", valor: 82575, cor: "#3d6f97" }
      - { rotulo: "Caieiras", rotulo_en: "Caieiras", valor: 67200, cor: "#5582a6" }
      - { rotulo: "Paraguaçu Paulista", rotulo_en: "Paraguaçu Paulista", valor: 60000, cor: "#6f95b4" }
      - { rotulo: "outras quatro", rotulo_en: "other four", valor: 110806, cor: "#9dbdcc" }
  - tipo: numero
    rotulo: "Capacidade autorizada sobre o potencial do estado"
    rotulo_en: "Authorised capacity over the state’s potential"
    valor: 3.3
    unidade: "%"
    nota: "557.816 de 16,9 milhões de m³/dia"
    nota_en: "557,816 of 16.9 million m³/day"
  - tipo: numero
    rotulo: "Geração distribuída a biogás"
    rotulo_en: "Biogas distributed generation"
    valor: 21.9
    unidade: "MW"
    nota: "32 unidades em 24 municípios"
    nota_en: "32 units in 24 municipalities"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biogas-territorio-sp-2026/sp_biogas_territorio.gpkg.zip
    rotulo: "Municípios e infraestrutura (mesmo arquivo das pranchas 055 a 059), SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities and infrastructure (same file as plates 055 to 059), SIRGAS 2000, with QGIS styles"
    tamanho: "4,9 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biogas-territorio-sp-2026/sp_biogas_em_operacao_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/biogas-territorio-sp-2026/sp_biogas_em_operacao_prancha.en.svg
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

# Biogás em operação em São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 059, a última de cinco da coleção **Biogás no território**: depois do potencial, da
fonte e da distância à rede, o que já funciona. As usinas de biogás do MapBiomas e as
termelétricas a biogás do SIGA estão na [prancha 028](../028-usinas-de-biogas-sp/README.md).

## O que vem nos arquivos

O GPKG e o CSV são os da [prancha 055](../055-densidade-do-biometano-sp/README.md). Esta prancha
usa as camadas `plantas_biometano` (`capacidade_m3d`, `capacidade_biogas_m3d`,
`biogas_processado_m3d`, `utilizacao_pct`, `referencia`) e `gd_biogas` (`unidades`,
`potencia_kw` e a potência por tipo: `residuos_animais`, `residuos_urbanos`, `agroindustrial`,
`florestal`). Os pontos ficam no ponto interno do município, não no endereço da planta.

## Método

1. ANP: instalações de biometano de SP no último mês informado, abril de 2026. Fica de fora uma
   instalação autorizada na capital cujo último informe é de junho de 2022, sem produção.
2. Uso: biogás processado no mês dividido pela capacidade de processamento de biogás autorizada.
3. ANEEL: unidades de geração distribuída de fonte térmica a biogás em SP, na relação de
   empreendimentos de outubro de 2026, somadas por município. Os nomes dos titulares não entram,
   porque muitos são pessoas físicas.

## Limitações

- Um mês de produção é um retrato: plantas em partida ou em manutenção aparecem com uso baixo.
- A capacidade autorizada é de biometano; o potencial do CP2B também é em biometano equivalente,
  mas nem todo potencial precisa virar biometano para ser aproveitado.
- As termelétricas a biogás fora da geração distribuída, como as de aterro da capital, estão na
  prancha 028 e não aqui.
