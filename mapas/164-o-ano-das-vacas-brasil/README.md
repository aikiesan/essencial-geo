---
numero: 164
titulo: "O ano das vacas"
subtitulo: "Em 2025, 47% dos bovinos abatidos eram fêmeas, o máximo da série iniciada em 1997, e o rebanho encolheu"
data: 2027-02-24
rascunho: true
categoria: energia
colecao: abate-br
tags: [abate-br, brasil, abate, bovinos, ciclo-pecuario, femeas, rebanho, ibge]

contexto: >-
  Em 2025, o Brasil abateu sob inspeção 42,95 milhões de bovinos, 55% a mais que em 2021, e 46,9% deles eram vacas e novilhas, o máximo da série iniciada em 1997; o pico anterior foi de 43,4%, em 2006, e o mínimo recente, de 33,7%, em 2021. É o ciclo do boi: com o bezerro barato, o criador vende a matriz, o abate cresce e o rebanho encolhe, de 238,6 milhões de cabeças em 2023 para 234,3 milhões em 2025 (−1,8%). No Pará, as fêmeas passaram de 32% para 56% do abate; em São Paulo, onde os frigoríficos recebem bois de outras UFs, ficaram em 35%. No primeiro semestre de 2026, a parcela ainda era de 49,5%, contra 50,0% um ano antes. Frango e porco não têm esse ciclo e cresceram sem pausa. Terceira prancha da coleção «Onde o bicho vira resíduo».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil por UF colorido pela parcela de vacas e novilhas no abate de bovinos em 2025, em cinco classes de bege-claro (menos de 35%) a marrom-escuro (55% ou mais), com hachura nas UFs de dado inibido pelo IBGE, e anéis proporcionais ao total de bovinos abatidos. Pará e Piauí aparecem no tom mais escuro; Mato Grosso, Maranhão, Rio Grande do Sul e Santa Catarina no seguinte; São Paulo, Ceará e Sergipe em bege; Amazonas, Rondônia, Tocantins e Bahia hachurados. Uma chamada aponta o Pará, com 56% de fêmeas contra 32% em 2021, e outra São Paulo, com 35%. No painel, a linha da parcela de fêmeas sobre barras do abate de bovinos no país de 1997 a 2025, com o pico anterior de 43,4% em 2006, o mínimo de 33,7% em 2021 e 46,9% em 2025, e linhas do abate de suínos, bovinos e frangos com 2015 igual a 100."

recorte: "Brasil"
fontes:
  - nome: "IBGE — Pesquisa Trimestral do Abate de Animais, tabelas 1092, 1093 e 1094 do SIDRA: cabeças abatidas por UF, trimestre, tipo de inspeção e tipo de rebanho bovino (acesso em 01/11/2026)"
    nome_en: "IBGE — Quarterly Survey of Animal Slaughter, SIDRA tables 1092, 1093 and 1094: head slaughtered by state, quarter, type of inspection and type of cattle (accessed 01/11/2026)"
    url: https://sidra.ibge.gov.br/pesquisa/abate/tabelas
    ano: 2026
  - nome: "IBGE — Pesquisa da Pecuária Municipal, tabela 3939 do SIDRA: efetivo de bovinos, 2015 a 2025 (acesso em 01/11/2026)"
    nome_en: "IBGE — Municipal Livestock Survey, SIDRA table 3939: cattle herd, 2015 to 2025 (accessed 01/11/2026)"
    url: https://sidra.ibge.gov.br/tabela/3939
    ano: 2025
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
metodo: "Parcela de fêmeas = (vacas + novilhas) ÷ total de bovinos abatidos, no total de tipos de inspeção, somando os quatro trimestres do ano (IBGE, tabela 1092); por UF em 2021 e 2025, e para o Brasil de 1997 a 2025 e nos primeiros semestres de 2025 e 2026. Rebanho bovino da Pesquisa da Pecuária Municipal."

camadas:
  - { nome: ufs, tipo: poligono, cor: "#9c4f35", descricao: "27 UFs: bovinos abatidos em 2021 e 2025, fêmeas abatidas e parcela de fêmeas em 2025, parcela em 2021 e classe (−1 = inibido)", descricao_en: "27 states: cattle slaughtered in 2021 and 2025, females slaughtered and female share in 2025, share in 2021 and class (−1 = withheld)" }
  - { nome: abate_bovinos, tipo: ponto, cor: "#1a1c1e", descricao: "24 UFs com o total de bovinos abatidos em 2025, para os anéis proporcionais", descricao_en: "24 states with total cattle slaughtered in 2025, for the proportional rings" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Fêmeas no abate de bovinos, Brasil, 2025"
    rotulo_en: "Females in cattle slaughter, Brazil, 2025"
    valor: 46.9
    unidade: "%"
    nota: "o máximo desde 1997; 33,7% em 2021 e 43,4% em 2006, o pico anterior"
    nota_en: "the highest since 1997; 33.7% in 2021 and 43.4% in 2006, the previous peak"
  - tipo: numero
    rotulo: "Bovinos abatidos sob inspeção, Brasil, 2025"
    rotulo_en: "Cattle slaughtered under inspection, Brazil, 2025"
    valor: 42.95
    unidade: "milhões de cabeças"
    nota: "+55% sobre 2021; rebanho de 234,3 milhões, −1,8% desde 2023"
    nota_en: "+55% on 2021; herd of 234.3 million, −1.8% since 2023"
  - tipo: barras
    rotulo: "Fêmeas no abate de bovinos nas oito UFs que mais abatem, 2025"
    rotulo_en: "Females in cattle slaughter in the eight states that slaughter most, 2025"
    unidade: "%"
    itens:
      - { rotulo: "Pará", valor: 55.7, cor: "#5c2a1c" }
      - { rotulo: "Rio Grande do Sul", valor: 54.7, cor: "#9c4f35" }
      - { rotulo: "Mato Grosso", valor: 48.7, cor: "#9c4f35" }
      - { rotulo: "Paraná", valor: 47.5, cor: "#c4866a" }
      - { rotulo: "Mato Grosso do Sul", valor: 46.3, cor: "#c4866a" }
      - { rotulo: "Goiás", valor: 45.6, cor: "#c4866a" }
      - { rotulo: "Minas Gerais", valor: 42.9, cor: "#c4866a" }
      - { rotulo: "São Paulo", valor: 35.0, cor: "#e2c4ad" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/abate-br-2026/br_abate_femeas.gpkg.zip
    rotulo: "UFs com o abate de bovinos e a parcela de fêmeas, pontos do abate e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "States with cattle slaughter and female share, slaughter points and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,1 MB"
  - formato: csv
    arquivo: dados/br_abate_femeas.csv
    rotulo: "As 27 UFs, com bovinos abatidos e parcela de fêmeas em 2021 e 2025"
    rotulo_en: "The 27 states, with cattle slaughtered and female share in 2021 and 2025"
    tamanho: "1 kB"
  - formato: csv
    arquivo: dados/br_abate_femeas_brasil.csv
    rotulo: "Série do Brasil, 1997 a 2025 e primeiros semestres de 2025 e 2026: bovinos, fêmeas, suínos, frangos e rebanho"
    rotulo_en: "National series, 1997 to 2025 and first halves of 2025 and 2026: cattle, females, pigs, chickens and herd"
    tamanho: "2 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/abate-br-2026/br_abate_femeas_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/abate-br-2026/br_abate_femeas_prancha.en.svg
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

# O ano das vacas: fêmeas no abate de bovinos por UF, 2025, e a série desde 1997

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 164, a terceira da coleção **Onde o bicho vira resíduo**. O abate de bois não cresce em
linha reta como o de frangos e porcos: segue o ciclo do rebanho. Quando o criador vende as matrizes,
o abate sobe, e com ele o que sobra nos frigoríficos; anos depois, o rebanho segura as fêmeas e o
abate cai.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `ufs` | polígono | 27 UFs: `bovinos_abatidos_2021`, `bovinos_abatidos_2025`, `femeas_2025`, `femeas_pct_2021`, `femeas_pct_2025`, `classe` (−1 = inibido) |
| `abate_bovinos` | ponto | 24 UFs com `bovinos_abatidos_2025`, no ponto interno da UF |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `abate-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/abate-br-2026),
com os **estilos do QGIS** gravados (cor pela classe, anel pelo total abatido). Os **CSV** ficam
nesta pasta, em UTF-8: o das UFs e a série do Brasil.

## Método

1. Pesquisa Trimestral do Abate de Animais do IBGE (tabela 1092 do SIDRA, baixada pela API em
   01/11/2026): bovinos abatidos por tipo de rebanho (bois, vacas, novilhos, novilhas), UF e
   trimestre, no total de tipos de inspeção.
2. Parcela de fêmeas = (vacas + novilhas) ÷ total abatido, somando os quatro trimestres do ano. Se
   algum trimestre de uma UF está inibido («X»), a parcela fica sem valor. Classes: menos de 35%;
   35 a 42%; 42 a 48%; 48 a 55%; 55% ou mais.
3. Série do Brasil de 1997 a 2025 pela mesma conta, mais os primeiros semestres de 2025 e 2026. O
   abate de suínos e frangos (tabelas 1093 e 1094) entra como índice com 2015 igual a 100.
4. Rebanho bovino do Brasil da Pesquisa da Pecuária Municipal (tabela 3939), de 2015 a 2025.

## Leitura

- Em 2025, 46,85% dos 42,95 milhões de bovinos abatidos eram vacas e novilhas, o máximo desde
  1997. O pico anterior foi de 43,4%, em 2006; o mínimo recente, 33,7%, em 2021.
- O abate de bovinos cresceu 55% entre 2021 (27,7 milhões) e 2025. O rebanho subiu até 238,6
  milhões em 2023 e caiu a 234,3 milhões em 2025 (−1,8%).
- No primeiro semestre de 2026, a parcela de fêmeas foi de 49,5%, contra 50,0% no primeiro semestre
  de 2025: o descarte de matrizes continua alto.
- No Pará, as fêmeas passaram de 32,0% do abate em 2021 para 55,7% em 2025, com 3,99 milhões de
  cabeças abatidas. Piauí (75,5%), Rio Grande do Sul (54,7%), Maranhão (49,6%) e Mato Grosso
  (48,7%) também ficam altos.
- São Paulo fica em 35,0% (26,1% em 2021): os frigoríficos paulistas recebem sobretudo bois e
  novilhos de outras UFs (prancha 163). Pernambuco (21,5%) e Rio Grande do Norte (34,0%) ficam
  abaixo de 35%.
- Com 2015 igual a 100, o abate de suínos chegou a 155 em 2025, o de bovinos a 140 e o de frangos
  a 116.

## Limitações

- O IBGE só conta o abate sob inspeção (federal, estadual ou municipal).
- Ficam sem valor as UFs com algum trimestre inibido: RO, TO, BA, AC, AM, ES, RJ, AP, DF e PB.
  Rondônia, Tocantins e Bahia abatem muito, mas não entram no mapa de cor; os anéis mostram o total
  abatido onde ele é publicado.
- A parcela de fêmeas é da UF onde o animal é abatido, não de onde foi criado.
- O ciclo pecuário é descrito de forma qualitativa; a prancha não projeta o abate nem o rebanho.

## Licença dos dados

Dados abertos do IBGE, de uso livre com citação da fonte.
