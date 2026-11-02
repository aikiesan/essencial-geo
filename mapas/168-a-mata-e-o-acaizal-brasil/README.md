---
numero: 168
titulo: "A mata e o açaizal"
subtitulo: "O açaí cultivado já é 8 vezes o colhido na mata"
data: 2027-03-05
rascunho: true
categoria: biomas
colecao: biomassa-da-mata-br
tags: [biomassa-da-mata-br, brasil, acai, extrativismo, para, pevs, pam]

contexto: >-
  Em 2025, o Brasil colheu 251 mil toneladas de açaí na mata e 2,02 milhões de toneladas em lavoura: o açaí cultivado já é 8 vezes o extraído. Em 2015, primeiro ano em que a Produção Agrícola Municipal conta o açaí, a mata dava 18% do total; em 2025, 11%. A extração não encolheu: subiu 82% desde 1986, de 138 mil para 251 mil toneladas, e passou de 79 para 321 municípios. Só que o cultivo cresceu muito mais. O Pará responde por 90% de todo o açaí, e Igarapé-Miri sozinho cultivou 421 mil toneladas, 1,7 vez o açaí de mata do país inteiro. No Amazonas, 37% ainda vem da mata. Do fruto, a polpa é a parte fina; o caroço, a maior parte da massa, sobra na batedeira. Primeira prancha da coleção «O que se colhe na mata».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers com círculos proporcionais às toneladas de açaí de 2025 em cada município (mata mais cultivo), coloridos pela parte que veio da mata: verde-escuro para 90% ou mais, verde-claro de 50 a 90%, lilás de 10 a 50% e roxo para menos de 10%. Os círculos maiores, roxos, se amontoam no nordeste do Pará, em torno de Belém e do baixo Tocantins; há pontos verdes espalhados pelo Amazonas, Amapá e Maranhão. Uma chamada aponta Igarapé-Miri (PA), com 421 mil toneladas cultivadas, e outra o Amazonas, onde 37% do açaí vem da mata. No painel, uma linha da extração de 1986 a 2025, quase plana perto de 250 mil toneladas, e uma área roxa do cultivo que sobe de 1 milhão em 2015 a 2 milhões em 2025, e barras empilhadas dos dez maiores municípios, todos no Pará."

recorte: "Brasil"
fontes:
  - nome: "IBGE — Produção da Extração Vegetal e da Silvicultura (PEVS), tabela 289 do SIDRA: quantidade de açaí (fruto) extraído por município, 1986–2025 (acesso em 01/11/2026)"
    nome_en: "IBGE — Forestry and Plant Extraction Survey (PEVS), SIDRA table 289: açaí fruit gathered by municipality, 1986–2025 (accessed 01/11/2026)"
    url: https://sidra.ibge.gov.br/tabela/289
    ano: 2026
  - nome: "IBGE — Produção Agrícola Municipal (PAM), tabela 5457 do SIDRA: açaí cultivado por município, 2015–2025 (acesso em 01/11/2026)"
    nome_en: "IBGE — Municipal Agricultural Survey (PAM), SIDRA table 5457: cultivated açaí by municipality, 2015–2025 (accessed 01/11/2026)"
    url: https://sidra.ibge.gov.br/tabela/5457
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
metodo: "Toneladas de açaí (fruto) por município em 2025: extração vegetal (PEVS, tabela 289) mais lavoura (PAM, tabela 5457); parte da mata = extração ÷ (extração + cultivo). Série nacional = soma dos municípios, 1986–2025 para a extração e 2015–2025 para o cultivo."

camadas:
  - { nome: municipios, tipo: ponto, cor: "#6b3d5c", descricao: "437 municípios com açaí em 2025: toneladas da mata e de lavoura em 2015 e 2025, extração em 1986, parte da mata e classe", descricao_en: "437 municipalities with açaí in 2025: tonnes from the forest and from orchards in 2015 and 2025, extraction in 1986, forest share and class" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 UFs: açaí da mata e cultivado em 2015 e 2025", descricao_en: "27 states: forest and cultivated açaí in 2015 and 2025" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Açaí cultivado ÷ açaí da mata, 2025"
    rotulo_en: "Cultivated ÷ forest açaí, 2025"
    valor: 8.0
    unidade: "vezes"
    nota: "2,02 milhões de t cultivadas e 251 mil t extraídas"
    nota_en: "2.02 million t cultivated and 251 thousand t gathered"
  - tipo: numero
    rotulo: "Parte do açaí que veio da mata, 2025"
    rotulo_en: "Share of açaí from the forest, 2025"
    valor: 11.1
    unidade: "%"
    nota: "17,6% em 2015"
    nota_en: "17.6% in 2015"
  - tipo: barras
    rotulo: "Açaí por UF, 2025 (mata + cultivo)"
    rotulo_en: "Açaí by state, 2025 (forest + cultivated)"
    unidade: "mil t"
    itens:
      - { rotulo: "Pará", valor: 2042.4, cor: "#6b3d5c" }
      - { rotulo: "Amazonas", valor: 153.7, cor: "#b48aa5" }
      - { rotulo: "Amapá", valor: 34.5, cor: "#6b3d5c" }
      - { rotulo: "Maranhão", valor: 19.7, cor: "#2f5d3a" }
      - { rotulo: "outras 11 UFs", valor: 19.4, cor: "#b8bd9e" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-da-mata-br-2026/br_acai_mata_cultivo.gpkg.zip
    rotulo: "Municípios com açaí, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities with açaí, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,2 MB"
  - formato: csv
    arquivo: dados/br_acai_mata_cultivo.csv
    rotulo: "Os 437 municípios, com açaí da mata e cultivado em 2015 e 2025"
    rotulo_en: "The 437 municipalities, with forest and cultivated açaí in 2015 and 2025"
    tamanho: "40 kB"
  - formato: csv
    arquivo: dados/br_acai_mata_cultivo_serie.csv
    rotulo: "Série nacional, 1986–2025: toneladas e municípios, da mata e de lavoura"
    rotulo_en: "National series, 1986–2025: tonnes and municipalities, forest and orchard"
    tamanho: "1 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-da-mata-br-2026/br_acai_mata_cultivo_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-da-mata-br-2026/br_acai_mata_cultivo_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "3,3 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,2 MB"

doi_automatico: false
versao: "1.0.0"
discussoes: []
---

# A mata e o açaizal: açaí extraído e cultivado por município, 2025, e a série desde 1986

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 168, a primeira da coleção **O que se colhe na mata**. O açaí é o produto extrativo de
maior volume do país, mas a maior parte do fruto já vem de açaizais declarados como lavoura.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | ponto | 437 municípios com açaí em 2025: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `extrativo_1986`, `extrativo_2015`, `cultivado_2015`, `total_2015`, `extrativo_2025`, `cultivado_2025`, `total_2025` (t), `pct_mata_2025`, `classe` (0 = 90% ou mais da mata … 3 = menos de 10%), `lon`, `lat` |
| `ufs` | polígono | 27 UFs: `extrativo_2015`, `cultivado_2015`, `extrativo_2025`, `cultivado_2025`, `total_2025` (t) |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `biomassa-da-mata-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/biomassa-da-mata-br-2026),
com os **estilos do QGIS** gravados (círculos pela classe, com o tamanho pelas toneladas). Os dois
**CSV** ficam nesta pasta, em UTF-8: os municípios e a série anual do país.

## Método

1. PEVS, tabela 289 do SIDRA: quantidade de açaí (fruto) extraída por município, em toneladas, de
   1986 a 2025. PAM, tabela 5457: quantidade de açaí produzida em lavoura por município, de 2015
   (primeiro ano do produto na PAM) a 2025. Baixadas pela API do SIDRA em 01/11/2026.
2. «-» na tabela é zero; células sem informação («..», «...») contam como sem produção. Não há
   células inibidas. Todo município com produção existe na malha de 2025.
3. Total do município = extração + cultivo; parte da mata = extração ÷ total. Quatro classes:
   90% ou mais, 50 a 90%, 10 a 50% e menos de 10%.
4. Série nacional: soma dos municípios em cada ano. Ela difere em poucas toneladas do total
   nacional publicado na tabela 289 (251.041 t contra 251.032 t em 2025), por arredondamento.

## Leitura

- 2025: 251.041 t de açaí da mata e 2.018.693 t de lavoura; o cultivo é 8,0 vezes a extração. A
  mata deu 11,1% do total, contra 17,6% em 2015 (216 mil t contra 1,01 milhão de t).
- A extração subiu 82% desde 1986 (137.599 t) e se espalhou de 79 para 321 municípios. O cultivo
  passou de 113 municípios em 2015 a 329 em 2025.
- Dos 437 municípios com açaí em 2025, 120 tiram 90% ou mais da mata, 46 entre 50 e 90%, 71 entre
  10 e 50% e 200 menos de 10%; esses 200 somam 1,70 milhão de t.
- O Pará tem 90% de todo o açaí e 67% do açaí de mata. Os dez maiores municípios são todos
  paraenses; Igarapé-Miri cultivou 421.304 t, 1,7 vez toda a extração do país. Limoeiro do Ajuru
  é o maior extrator (49 mil t da mata e 66 mil cultivadas).
- No Amazonas, 37% do açaí ainda vem da mata (57,5 mil t de 153,7 mil); Codajás extraiu 12,5 mil t
  e cultivou 33 mil.
- Do fruto, a polpa é a parte fina; o caroço, a maior parte da massa, sobra na batedeira e vira
  resíduo. Os números são do fruto inteiro.

## Limitações

- Na várzea, a fronteira entre mata e lavoura é tênue: açaizais nativos manejados podem ser
  declarados como cultivo. A diferença entre as duas tabelas é de pesquisa, não necessariamente de
  paisagem.
- A PAM só registra açaí a partir de 2015; antes disso, o cultivo existia mas não era contado, e a
  série da prancha não permite dizer quando ele passou a extração.
- As pesquisas são estimativas municipais a partir de informantes, não medições.
- A conta é do fruto; não há na prancha nenhuma estimativa de polpa, de caroço ou de energia.

## Licença dos dados

Dados abertos do IBGE, de uso livre com citação da fonte.
