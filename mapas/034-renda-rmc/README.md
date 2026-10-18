---
numero: 34
titulo: "Renda do responsável"
subtitulo: "A renda desenha outra fronteira"
data: 2026-10-25
categoria: censo-renda
colecao: rmc
tags: [rmc, campinas, censo-2022, renda, desigualdade, setores-censitarios, salario-minimo]

contexto: >-
  Em 2022, o salário mínimo era de R$ 1.212. Na Região Metropolitana de Campinas, 47% das pessoas responsáveis por domicílio viviam em setores censitários onde a renda mediana do responsável não passava de dois mínimos; 8,2% viviam em setores acima de cinco. O mapa pinta cada setor pela renda mediana e desenha uma fronteira que não é a dos municípios: em Vinhedo, Valinhos e Indaiatuba, um em cada três responsáveis vive em setores acima de três mínimos; em Hortolândia e Sumaré, um em cada dez; em Monte Mor, menos de 3%. A maior mediana, R$ 28.000 (23 salários mínimos), é a de um setor de Indaiatuba. Terceira prancha da coleção «Região Metropolitana de Campinas».

imagem: ./mapa_preview.png
imagem_alt: "Mapa da Região Metropolitana de Campinas com os 6.548 setores censitários coloridos pela renda nominal mediana mensal do responsável pelo domicílio em 2022, em salários mínimos, numa rampa viridis do amarelo (até 1 salário mínimo) ao roxo-escuro (mais de 5). O verde-azulado de 2 a 3 mínimos domina as manchas urbanas; o azul e o roxo se concentram em Campinas, Valinhos, Vinhedo, Paulínia e Indaiatuba; o verde-claro de 1 a 2 mínimos aparece no oeste e nas bordas rurais. Setores sem informação vão hachurados. Uma chamada aponta um setor de Indaiatuba com mediana de R$ 28.000. No painel, cada classe tem uma barra com a parte dos responsáveis da região."

recorte: "Região Metropolitana de Campinas (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022: rendimento do responsável por setor censitário"
    nome_en: "IBGE — 2022 Population Census: household head income by census tract"
    url: https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "IBGE — Malha de Setores Censitários 2022"
    nome_en: "IBGE — 2022 Census Tract Mesh"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/26565-malhas-de-setores-censitarios-divisoes-intramunicipais.html
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Rendimento nominal mediano mensal dos responsáveis com rendimento, por setor censitário do Censo 2022, em seis classes medidas em salários mínimos de 2022 (R$ 1.212)."

camadas:
  - { nome: setores, tipo: poligono, cor: "#2a788e", descricao: "6.548 setores censitários: responsáveis, moradores, renda média e renda mediana do responsável", descricao_en: "6,548 census tracts: household heads, residents, mean and median household head income" }
  - { nome: municipios, tipo: poligono, cor: "#1a1c1e", descricao: "Contorno dos 20 municípios", descricao_en: "Outline of the 20 municipalities" }

indicadores:
  - tipo: proporcao
    rotulo: "Responsáveis por domicílio, pela renda mediana do setor (salários mínimos)"
    rotulo_en: "Household heads, by the tract’s median income (minimum wages)"
    unidade: "pessoas"
    unidade_en: "people"
    itens:
      - { rotulo: "até 1 SM", valor: 24803, cor: "#fde725" }
      - { rotulo: "1 a 1,5 SM", valor: 188017, cor: "#7ad151" }
      - { rotulo: "1,5 a 2 SM", valor: 335894, cor: "#22a884" }
      - { rotulo: "2 a 3 SM", valor: 346813, cor: "#2a788e" }
      - { rotulo: "3 a 5 SM", valor: 166073, cor: "#414487" }
      - { rotulo: "mais de 5 SM", valor: 95222, cor: "#440154" }
  - tipo: numero
    rotulo: "Responsáveis em setores com mediana de até 2 salários mínimos"
    rotulo_en: "Household heads in tracts with a median of up to 2 minimum wages"
    valor: 47.4
    unidade: "%"
    nota: "548.714 dos 1.156.822 responsáveis em setores com informação"
    nota_en: "548,714 of the 1,156,822 heads in tracts with data"
  - tipo: numero
    rotulo: "Maior renda mediana de um setor"
    rotulo_en: "Highest tract median income"
    valor: 28000
    unidade: "R$"
    nota: "Em Indaiatuba: 23 salários mínimos"
    nota_en: "In Indaiatuba: 23 minimum wages"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/rmc-2026/rmc_renda_2022.gpkg.zip
    rotulo: "Setores e municípios, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Tracts and municipalities, SIRGAS 2000, with QGIS styles"
    tamanho: "4,6 MB"
  - formato: csv
    arquivo: dados/rmc_renda_2022.csv
    rotulo: "Os 6.548 setores: responsáveis, moradores, renda média e mediana"
    rotulo_en: "The 6,548 tracts: heads, residents, mean and median income"
    tamanho: "0,5 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/rmc-2026/rmc_renda_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/rmc-2026/rmc_renda_2022_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,6 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,4 MB"

doi_automatico: true
versao: "1.0.0"
discussoes: []
---

# Renda do responsável pelo domicílio nos setores da Região Metropolitana de Campinas

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 034, a terceira de quatro da coleção **Região Metropolitana de Campinas**: nos mesmos
setores da prancha anterior, quanto ganha quem responde pela casa.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `setores` | polígono | 6.548 setores: `CD_SETOR`, `CD_MUN`, `NM_MUN`, `NM_BAIRRO`, `situacao`, `responsaveis`, `moradores`, `renda_media` e `renda_mediana` (R$ por mês, dos responsáveis com rendimento) |
| `municipios` | polígono | contorno dos 20 municípios |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `rmc-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/rmc-2026).
A camada `setores` traz o **estilo do QGIS** da prancha (`mediana`), com as classes em reais.

O **CSV** traz a tabela dos setores, em UTF-8, sem geometria.

## Método

1. Agregados de rendimento do responsável por setor censitário do Censo 2022: pessoas
   responsáveis, moradores e rendimento nominal médio e mediano mensal dos responsáveis com
   rendimento, em domicílios particulares permanentes ocupados.
2. Ligação com a Malha de Setores Censitários 2022 pelo código do setor, nos 20 municípios da RMC.
3. Seis classes da renda mediana, em salários mínimos de 2022 (R$ 1.212): até 1, 1 a 1,5, 1,5 a 2,
   2 a 3, 3 a 5 e mais de 5.
4. A parte de cada classe soma os responsáveis dos setores daquela classe, sobre o total dos
   setores com informação.

## Limitações

- A mediana é a dos responsáveis **com rendimento**: quem não tem renda nenhuma não entra no
  cálculo, e a mediana dos setores mais pobres fica acima do que seria contando todos.
- O rendimento é **nominal**, declarado ao recenseador, e a renda do responsável não é a renda do
  domicílio inteiro.
- 241 setores não têm informação de renda (sem domicílio ocupado ou com valor omitido pelo IBGE
  para proteger o sigilo) e vão hachurados.
- Uma mediana de setor esconde a mistura de dentro do setor: um condomínio e uma ocupação vizinhos
  podem cair no mesmo polígono.
