---
numero: 43
titulo: "Usinas por fonte"
subtitulo: "Água, vento, sol e fogo"
data: 2026-11-03
categoria: energia
colecao: energia-eletrica
tags: [energia-eletrica, brasil, usinas, hidreletricas, eolicas, solar, termeletricas, aneel, siga, matriz-eletrica]

contexto: >-
  Belo Monte, no Xingu, tem 11.233 MW de potência outorgada: é a maior das 16.118 usinas de energia elétrica registradas na ANEEL, em operação ou em obra. A água ainda domina: hidrelétricas e pequenas centrais somam 58,8% dos 184 GW em operação. Nos círculos menores, o mapa conta outras histórias. O vento enfileira no Nordeste 89% dos 993 parques eólicos; o bagaço de cana move 427 das 627 termelétricas a biomassa, 237 delas em São Paulo; e Angra 3 segue em obra ao lado das outras duas. Das 11.391 usinas solares, 10.941 têm menos de 5 kW: sistemas individuais registrados um a um pelas distribuidoras, quase todos no Pará e no Pantanal sul-mato-grossense. Segunda prancha da coleção «Energia elétrica no Brasil».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers, com milhares de círculos proporcionais à potência e coloridos pela fonte: azul-profundo para as hidrelétricas, azul-claro para as pequenas centrais, verde-mata para as eólicas, ocre para as solares, verde-oliva para a biomassa, grafite para as termelétricas fósseis e ameixa para as nucleares. Os maiores círculos azuis ficam no Pará, em Rondônia, no Paraná e no rio São Francisco; as eólicas formam um colar verde no litoral e no interior do Nordeste; a biomassa se adensa em São Paulo. Duas manchas de pontinhos ocre aparecem no Pará e no Pantanal. Chamadas com seta destacam Belo Monte, 11.233 MW, e os 1.622 pontos solares do Pantanal. No painel, uma fita mostra a matriz em operação, dividida pela potência de cada fonte."

recorte: "Brasil"
fontes:
  - nome: "ANEEL — Sistema de Informações de Geração (SIGA), na versão da base de infraestrutura do MapBiomas"
    nome_en: "ANEEL — Generation Information System (SIGA), as published in the MapBiomas infrastructure database"
    url: https://dadosabertos.aneel.gov.br/dataset/6d90b77c-c5f5-4d81-bdec-7bc619494bb9
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025 (limites estaduais e nacional)"
    nome_en: "IBGE — Municipal Mesh 2025 (state and national boundaries)"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
  - nome: "Natural Earth — países vizinhos (via world-atlas)"
    nome_en: "Natural Earth — neighbouring countries (via world-atlas)"
    url: https://www.naturalearthdata.com/
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Usinas do SIGA em operação e em construção, agrupadas em sete fontes, com círculos de área proporcional à potência outorgada."

camadas:
  - { nome: usinas, tipo: ponto, cor: "#234e70", descricao: "16.118 usinas: fonte, combustível, fase, potência outorgada e fiscalizada (kW), início de operação, proprietário e UF", descricao_en: "16,118 power plants: source, fuel, phase, licensed and inspected capacity (kW), start of operations, owner and state" }
  - { nome: ufs, tipo: poligono, cor: "#9aa3ab", descricao: "27 unidades da federação", descricao_en: "27 states" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "Matriz em operação, pela potência outorgada (GW)"
    rotulo_en: "Operating mix, by licensed capacity (GW)"
    unidade: "GW"
    itens:
      - { rotulo: "Hidrelétrica (UHE)", valor: 102.33, cor: "#234e70" }
      - { rotulo: "Pequena central hidrelétrica", valor: 5.98, cor: "#5f8fae" }
      - { rotulo: "Eólica", valor: 21.93, cor: "#2f5d3a" }
      - { rotulo: "Solar fotovoltaica", valor: 5.32, cor: "#c08a2e" }
      - { rotulo: "Termelétrica a biomassa", valor: 16.70, cor: "#7d8a3c" }
      - { rotulo: "Termelétrica fóssil", valor: 30.04, cor: "#4a4e52" }
      - { rotulo: "Termonuclear", valor: 1.99, cor: "#6b3d5c" }
  - tipo: numero
    rotulo: "Belo Monte, a maior usina registrada"
    rotulo_en: "Belo Monte, the largest registered plant"
    valor: 11233
    unidade: "MW"
    nota: "depois vêm Tucuruí (8.535 MW) e a parte brasileira de Itaipu (7.000 MW)"
    nota_en: "followed by Tucuruí (8,535 MW) and the Brazilian share of Itaipu (7,000 MW)"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/energia-eletrica-2026/br_usinas_por_fonte.gpkg.zip
    rotulo: "Três camadas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Three layers, SIRGAS 2000, with QGIS styles"
    tamanho: "2,3 MB"
  - formato: csv
    url: https://github.com/aikiesan/essencial-geo/releases/download/energia-eletrica-2026/br_usinas_por_fonte.csv
    rotulo: "As 16.118 usinas, com longitude e latitude"
    rotulo_en: "All 16,118 plants, with longitude and latitude"
    tamanho: "3,8 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/energia-eletrica-2026/br_usinas_por_fonte_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/energia-eletrica-2026/br_usinas_por_fonte_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "5,3 MB"
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

# Usinas de energia elétrica do Brasil, por fonte

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 043, a segunda de três da coleção **Energia elétrica no Brasil**: depois dos fios, onde
a energia nasce e de quê.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `usinas` | ponto | 16.118 usinas: `nome`, `ceg` (código da ANEEL), `fonte_mapa`, `fonte_rotulo`, `tipo`, `combustivel`, `fase`, `operacao`, `potencia_kw` (outorgada), `potencia_fiscalizada_kw`, `inicio_operacao`, `proprietario`, `municipio_siga`, `uf` (declarada no SIGA), `uf_mapa` (do polígono onde o ponto cai) |
| `ufs` | polígono | 27 unidades da federação, com a região |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `energia-eletrica-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/energia-eletrica-2026).
Os **estilos do QGIS** repetem a prancha: cada fonte com a sua cor, círculos que crescem com a raiz
da potência e as maiores usinas desenhadas por baixo.

O **CSV**, também na release, traz a tabela das 16.118 usinas em UTF-8, com longitude e latitude.

## Método

1. Usinas registradas no SIGA da ANEEL, na cópia publicada pela base de infraestrutura do
   MapBiomas: hidrelétricas, pequenas centrais, eólicas, solares, termelétricas e nucleares, em
   operação ou em construção. As inaugurações mais recentes da base são de junho de 2022.
2. Sete fontes no mapa: UHE, PCH, eólica, solar fotovoltaica, termelétrica a biomassa (bagaço,
   resíduos florestais, biogás, licor negro…), termelétrica fóssil (diesel, gás natural, carvão,
   óleo) e termonuclear.
3. A área de cada círculo é proporcional à potência outorgada; as usinas em obra com 50 MW ou
   mais aparecem vazadas.
4. A matriz em operação soma a potência outorgada das usinas em operação de cada fonte: 184,3 GW
   no total, ou 202,9 GW com as que estão em obra.
5. Os totais por estado usam a UF declarada no SIGA, e não o polígono onde o ponto cai: usinas de
   divisa, como Ilha Solteira, entram no estado registrado.

## Limitações

- A base é uma fotografia de 2022, e o SIGA muda todo mês: a solar e a eólica cresceram muito
  desde então.
- As 10.941 «usinas» solares de menos de 5 kW (de 0,26 a 4,32 kW, 11,7 MW somados) são sistemas
  individuais: 9.227 da distribuidora do Pará, 1.621 da de Mato Grosso do Sul e 78 da do Amazonas.
  Elas inflam a contagem de usinas solares, mas pesam pouco na potência.
- As centrais geradoras hidrelétricas (CGH), de até 5 MW, não estão na base.
- A geração distribuída nos telhados (micro e minigeração) é outro cadastro e fica para a próxima
  prancha.
- 24 usinas caem fora dos polígonos estaduais, quase todas junto à costa ou na água, como os
  navios-usina da baía de Sepetiba; ficam no GPKG com `uf_mapa` vazio.
- Itaipu entra só com a parte brasileira, 7.000 MW.
