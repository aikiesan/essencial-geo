---
numero: 170
titulo: "Carvão da mata, carvão plantado"
subtitulo: "Em 1986, 63 % do carvão vegetal vinha da mata nativa; em 2025, 7 %"
data: 2027-03-10
rascunho: true
categoria: energia
colecao: biomassa-da-mata-br
tags: [biomassa-da-mata-br, brasil, carvao-vegetal, extrativismo, silvicultura, minas-gerais, cerrado, pevs]

contexto: >-
  O carvão vegetal que abastece os altos-fornos da siderurgia saía, nos anos 1980, sobretudo da mata nativa de Minas Gerais e Goiás, terras de Cerrado. Em 1986, a extração vegetal deu 3,36 milhões de toneladas de carvão, 63% do total do país; a floresta plantada, 2,01 milhões. Em 2025, o carvão de mata nativa caiu a 481 mil toneladas, 7%, e o de eucalipto e outras plantadas subiu a 6,30 milhões. A última vez que a mata deu mais carvão que a floresta plantada foi em 2005. Minas Gerais tirava 1,85 milhão de toneladas por ano da mata em 1986–1990; em 2021–2025, 5,8 mil, enquanto o carvão plantado mineiro chegou a 5,84 milhões. O carvão nativo que resta mudou de lugar: 68% dele sai hoje do Maranhão, Pará, Piauí e Tocantins. Terceira prancha da coleção «O que se colhe na mata».

imagem: ./mapa_preview.png
imagem_alt: "Três mapas do Brasil em projeção cônica de Albers, na mesma escala, com círculos proporcionais à média anual de carvão vegetal por município: o primeiro, em terracota, do carvão de mata nativa em 1986–1990, com uma nuvem densa de círculos em Minas Gerais, Goiás e Mato Grosso do Sul e pontos no Maranhão, em Santa Catarina e no Nordeste; o segundo, do carvão nativo em 2021–2025, quase vazio no Sudeste e no Centro-Oeste, com o que resta no leste do Pará, no Maranhão e no Piauí; o terceiro, em verde, do carvão de floresta plantada em 2021–2025, concentrado no centro e no norte de Minas Gerais. No quarto quadro, uma linha do carvão nativo que cai de 3,7 milhões de toneladas em 1988 a 0,48 milhão em 2025 e uma do plantado que sobe a 6,3 milhões, cruzando-se pela última vez em 2005. No painel, uma tabela por UF."

recorte: "Brasil"
fontes:
  - nome: "IBGE — Produção da Extração Vegetal e da Silvicultura (PEVS), tabela 289 do SIDRA: carvão vegetal da extração vegetal por município, 1986–2025 (acesso em 01/11/2026)"
    nome_en: "IBGE — Forestry and Plant Extraction Survey (PEVS), SIDRA table 289: charcoal from plant extraction by municipality, 1986–2025 (accessed 01/11/2026)"
    url: https://sidra.ibge.gov.br/tabela/289
    ano: 2026
  - nome: "IBGE — Produção da Extração Vegetal e da Silvicultura (PEVS), tabela 291 do SIDRA: carvão vegetal da silvicultura por município, 1986–2025 (acesso em 01/11/2026)"
    nome_en: "IBGE — Forestry and Plant Extraction Survey (PEVS), SIDRA table 291: charcoal from silviculture by municipality, 1986–2025 (accessed 01/11/2026)"
    url: https://sidra.ibge.gov.br/tabela/291
    ano: 2026
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
  - nome: "Natural Earth — países vizinhos (via world-atlas)"
    nome_en: "Natural Earth — neighbouring countries (via world-atlas)"
    url: https://www.naturalearthdata.com/
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "pandas", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Toneladas de carvão vegetal por município: da extração vegetal, isto é, mata nativa (PEVS, tabela 289), e da silvicultura, isto é, floresta plantada (tabela 291), 1986–2025; médias anuais de 1986–1990 e 2021–2025; parte nativa = nativo ÷ (nativo + plantado)."

camadas:
  - { nome: municipios, tipo: ponto, cor: "#9c4a32", descricao: "3.804 municípios com carvão vegetal em 1986–1990 ou 2021–2025: nativo e plantado em 1986 e 2025, médias dos dois quinquênios e parte nativa em 2021–2025; três estilos (nativo 1986–1990, nativo 2021–2025, plantado 2021–2025)", descricao_en: "3,804 municipalities with charcoal in 1986–1990 or 2021–2025: native and planted in 1986 and 2025, means for both five-year periods and native share in 2021–2025; three styles (native 1986–1990, native 2021–2025, planted 2021–2025)" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 UFs: médias de carvão nativo e plantado nos dois quinquênios e toneladas em 2025", descricao_en: "27 states: means of native and planted charcoal in both five-year periods and tonnes in 2025" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Parte do carvão vegetal vinda da mata nativa, 2025"
    rotulo_en: "Share of charcoal from native forest, 2025"
    valor: 7.1
    unidade: "%"
    nota: "62,6% em 1986"
    nota_en: "62.6% in 1986"
  - tipo: numero
    rotulo: "Queda do carvão de mata nativa, 1988–2025"
    rotulo_en: "Fall in native-forest charcoal, 1988–2025"
    valor: -87.1
    unidade: "%"
    nota: "3,73 milhões de t em 1988, 0,48 milhão em 2025"
    nota_en: "3.73 million t in 1988, 0.48 million in 2025"
  - tipo: barras
    rotulo: "Carvão de mata nativa por UF, média anual 2021–2025"
    rotulo_en: "Native-forest charcoal by state, yearly mean 2021–2025"
    unidade: "mil t"
    itens:
      - { rotulo: "Maranhão", valor: 143.3, cor: "#9c4a32" }
      - { rotulo: "Pará", valor: 123.5, cor: "#9c4a32" }
      - { rotulo: "Bahia", valor: 47.4, cor: "#9c4a32" }
      - { rotulo: "Mato Grosso do Sul", valor: 46.9, cor: "#9c4a32" }
      - { rotulo: "Piauí", valor: 40.0, cor: "#9c4a32" }
      - { rotulo: "Minas Gerais", valor: 5.8, cor: "#9c4a32" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-da-mata-br-2026/br_carvao_nativo_plantado.gpkg.zip
    rotulo: "Municípios com carvão vegetal, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities with charcoal, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,4 MB"
  - formato: csv
    arquivo: dados/br_carvao_nativo_plantado.csv
    rotulo: "Os 3.804 municípios, com carvão nativo e plantado"
    rotulo_en: "The 3,804 municipalities, with native and planted charcoal"
    tamanho: "343 kB"
  - formato: csv
    arquivo: dados/br_carvao_nativo_plantado_serie.csv
    rotulo: "Série nacional, 1986–2025: carvão nativo e plantado e municípios"
    rotulo_en: "National series, 1986–2025: native and planted charcoal and municipalities"
    tamanho: "2 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-da-mata-br-2026/br_carvao_nativo_plantado_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-da-mata-br-2026/br_carvao_nativo_plantado_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "8,8 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

doi_automatico: false
versao: "1.0.0"
discussoes: []
---

# Carvão da mata, carvão plantado: carvão vegetal por município, 1986–1990 e 2021–2025

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 170, a terceira da coleção **O que se colhe na mata**. As pranchas 130 e 131 trataram da
floresta plantada e da lenha; esta compara as duas origens do carvão vegetal ao longo de quarenta
anos.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | ponto | 3.804 municípios com carvão em 1986–1990 ou 2021–2025: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `nativo_1986`, `plantado_1986`, `nativo_1986_1990`, `plantado_1986_1990`, `nativo_2021_2025`, `plantado_2021_2025`, `nativo_2025`, `plantado_2025` (t), `pct_nativo_2021_2025`, `lon`, `lat` |
| `ufs` | polígono | 27 UFs: as mesmas médias e as toneladas de 2025, somadas por UF |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `biomassa-da-mata-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/biomassa-da-mata-br-2026),
com três **estilos do QGIS** na camada dos municípios, um para cada mapa da prancha. Os dois **CSV**
ficam nesta pasta, em UTF-8.

## Método

1. PEVS, tabelas 289 (extração vegetal, produto «carvão vegetal») e 291 (silvicultura, produto
   «carvão vegetal», que soma eucalipto, pinus e outras espécies plantadas), em toneladas, por
   município, de 1986 a 2025, baixadas pela API do SIDRA em 01/11/2026. «-» é zero; células sem
   informação contam como sem produção; não há células inibidas.
2. Médias anuais por município em 1986–1990 e 2021–2025. Os três mapas usam a mesma escala de
   círculos; municípios abaixo de 200 t por ano ficam de fora do desenho (estão nos dados).
3. Série nacional: soma dos municípios em cada ano.

## Leitura

- 1986: 3.364.859 t de carvão de mata nativa e 2.010.565 t de floresta plantada; a mata deu 62,6%.
  2025: 481.432 t nativas e 6.295.267 t plantadas; a mata deu 7,1%.
- O carvão nativo chegou ao máximo em 1988 (3.726.638 t) e caiu 87,1% até 2025. A floresta
  plantada passou à frente em 1993 (fora o registro atípico de 1987), a mata voltou a dar mais entre 2003 e 2005, e desde 2006 o
  plantado lidera sem interrupção.
- Minas Gerais: 1,85 milhão de t nativas por ano em 1986–1990 e 5,8 mil t em 2021–2025; o carvão
  plantado mineiro é de 5,84 milhões de t por ano, 87% do plantado do país. Goiás foi de 460 mil t
  nativas por ano a 1 mil t.
- Em 2021–2025, 68% do carvão nativo (456 mil t por ano) saiu do Maranhão, Pará, Piauí e
  Tocantins. O maior município é Paragominas (PA), com 52,1 mil t por ano; o maior do plantado,
  João Pinheiro (MG), com 399 mil t por ano.
- Os municípios com carvão nativo declarado caíram de 2.541 em 1986 para 1.424 em 2025; os com
  carvão plantado subiram de 375 para 772.

## Limitações

- Em 1987, Bom Despacho (MG) declarou 2,9 milhões de t de carvão plantado, contra 137 mil t em 1986
  e 6 mil t em 1988; o pico da linha nesse ano é esse registro, mantido como publicado.
- «Extração vegetal» é a pesquisa do carvão feito de mata nativa, legal ou não, segundo o que os
  informantes declaram; o carvão de desmatamento não declarado não aparece.
- A tabela não diz para onde vai o carvão; a ligação com a siderurgia vem do uso conhecido do
  produto, não destes dados.
- Não há na prancha nenhuma estimativa de energia.

## Licença dos dados

Dados abertos do IBGE, de uso livre com citação da fonte.
