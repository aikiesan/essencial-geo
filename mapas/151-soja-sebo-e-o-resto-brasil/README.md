---
numero: 151
titulo: "Soja, sebo e o resto"
subtitulo: "Um litro em cada cem do diesel da bomba vem da gordura do boi"
data: 2027-01-25
rascunho: true
categoria: energia
colecao: biodiesel-br
tags: [biodiesel-br, brasil, biodiesel, materia-prima, soja, sebo-bovino, rebanho, anp]

contexto: >-
  Nos doze meses até setembro de 2026, as usinas brasileiras usaram 10,6 milhões de m³ de matéria-prima para fazer biodiesel: 72,7% de óleo de soja e 6,9% de sebo bovino, 733 mil m³. Com 15% de biodiesel no diesel da bomba, cerca de um litro em cada cem vem da gordura do boi. A parte do sebo era de 14,3% em 2017 e caiu a 5,8% em 2023, mas o volume cresceu 27% desde 2017. Em Rondônia, 60% do biodiesel vem do sebo; em Minas Gerais, 35%; no Pará, 31%. A Bahia é a UF que mais usa sebo, com 154 mil m³. Piauí, Tocantins e Mato Grosso do Sul fazem biodiesel quase só de soja. Segunda prancha da coleção «De onde vem o biodiesel».

imagem: ./mapa_preview.png
imagem_alt: "Três mapas do Brasil em projeção cônica de Albers, por UF, em 10/2025–09/2026: a parte do óleo de soja na matéria-prima do biodiesel, mais escura em Piauí, Tocantins e Mato Grosso do Sul; a parte do sebo bovino, mais escura em Rondônia, Minas Gerais e Pará; e o rebanho bovino de 2024 com círculos do sebo usado em cada UF, os maiores na Bahia e no Rio Grande do Sul. No quarto quadro, barras empilhadas da mistura de matérias-primas no país de 2017 aos últimos doze meses, com a parte do sebo caindo de 14,3% a 6,9%. No painel, a mistura de cada uma das 14 UFs que fazem biodiesel, com a parte do sebo e o rebanho."

recorte: "Brasil"
fontes:
  - nome: "ANP — Painel Dinâmico de Produtores de Biodiesel, dados abertos: matéria-prima por UF e mês (pb-da-biodiesel.zip, acesso em 01/11/2026)"
    nome_en: "ANP — Biodiesel Producers Dynamic Panel, open data: feedstock by state and month (pb-da-biodiesel.zip, accessed 01/11/2026)"
    url: https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos/arquivos/pb-da-biodiesel.zip
    ano: 2026
  - nome: "IBGE — Pesquisa da Pecuária Municipal 2024, tabela 3939 (efetivo de bovinos)"
    nome_en: "IBGE — Municipal Livestock Survey 2024, table 3939 (cattle herd)"
    url: https://sidra.ibge.gov.br/tabela/3939
    ano: 2024
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
metodo: "Matéria-prima declarada pelas usinas à ANP, em m³ por UF e produto, somada nos doze meses de 10/2025 a 09/2026 e agrupada em seis classes; a parte de cada classe é o volume dela sobre o total da UF. Rebanho bovino de 2024 da PPM/IBGE, somado por UF."

camadas:
  - { nome: ufs, tipo: poligono, cor: "#8c3f2b", descricao: "27 UFs: matéria-prima em m³ e % por classe (soja, sebo, outras gorduras, outros óleos, fritura, outros materiais), rebanho de 2024 e litros de sebo por cabeça", descricao_en: "27 states: feedstock in m³ and % by class (soy, tallow, other fats, other oils, cooking oil, other materials), 2024 herd and litres of tallow per head" }
  - { nome: sebo_volume, tipo: ponto, cor: "#8c3f2b", descricao: "10 UFs que usaram sebo bovino: volume em m³, % e rebanho", descricao_en: "10 states that used beef tallow: volume in m³, share and herd" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Sebo bovino na matéria-prima do biodiesel, 10/2025–09/2026"
    rotulo_en: "Beef tallow in biodiesel feedstock, 10/2025–09/2026"
    valor: 6.9
    unidade: "%"
    nota: "733 mil m³; 14,3% em 2017"
    nota_en: "733 thousand m³; 14.3% in 2017"
  - tipo: numero
    rotulo: "Óleo de soja na matéria-prima do biodiesel, 10/2025–09/2026"
    rotulo_en: "Soybean oil in biodiesel feedstock, 10/2025–09/2026"
    valor: 72.7
    unidade: "%"
    nota: "de 10,6 milhões de m³ de matéria-prima"
    nota_en: "of 10.6 million m³ of feedstock"
  - tipo: barras
    rotulo: "Parte do sebo bovino na matéria-prima do biodiesel, por ano"
    rotulo_en: "Beef tallow’s share of biodiesel feedstock, by year"
    unidade: "%"
    itens:
      - { rotulo: "2017", valor: 14.3, cor: "#8c3f2b" }
      - { rotulo: "2018", valor: 13.3, cor: "#8c3f2b" }
      - { rotulo: "2019", valor: 11.3, cor: "#8c3f2b" }
      - { rotulo: "2020", valor: 8.6, cor: "#8c3f2b" }
      - { rotulo: "2021", valor: 7.7, cor: "#8c3f2b" }
      - { rotulo: "2022", valor: 7.9, cor: "#8c3f2b" }
      - { rotulo: "2023", valor: 5.8, cor: "#8c3f2b" }
      - { rotulo: "2024", valor: 6.4, cor: "#8c3f2b" }
      - { rotulo: "2025", valor: 6.8, cor: "#8c3f2b" }
      - { rotulo: "10/2025–09/2026", valor: 6.9, cor: "#8c3f2b" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biodiesel-br-2026/br_biodiesel_materia_prima.gpkg.zip
    rotulo: "UFs, pontos do sebo e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "States, tallow points and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,1 MB"
  - formato: csv
    arquivo: dados/br_biodiesel_materia_prima.csv
    rotulo: "As 27 UFs, com a matéria-prima por classe e o rebanho"
    rotulo_en: "The 27 states, with feedstock by class and the herd"
    tamanho: "3 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biodiesel-br-2026/br_biodiesel_materia_prima_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/biodiesel-br-2026/br_biodiesel_materia_prima_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "8,9 MB"
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

# Soja, sebo e o resto: a matéria-prima do biodiesel por UF e o rebanho bovino

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 151, a segunda da coleção **De onde vem o biodiesel**. Depois das usinas, o que entra
nelas: quanto é soja, quanto é sebo de boi e quanto é o resto.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `ufs` | polígono | 27 UFs: `mp_total_m3`; para cada classe (`soja`, `sebo`, `outras_gorduras`, `outros_oleos`, `fritura`, `outros_materiais`), `_m3` e `_pct`; `bovinos_2024`, `sebo_l_por_boi`, `classe_sebo`, `classe_soja`, `classe_boi` |
| `sebo_volume` | ponto | 10 UFs com sebo no biodiesel: `SIGLA_UF`, `sebo_m3`, `sebo_pct`, `bovinos_2024` |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `biodiesel-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/biodiesel-br-2026),
com três **estilos do QGIS** na camada `ufs` (sebo, soja e rebanho) e os círculos do sebo. O
**CSV** fica nesta pasta, em UTF-8, com a tabela das UFs sem geometria.

## Método

1. Dados abertos do Painel Dinâmico de Produtores de Biodiesel da ANP (`pb-da-biodiesel.zip`,
   baixado em 01/11/2026, arquivos de 27/10/2026): `Biodiesel_DadosAbertos_CSV_MatériaPrima.csv`,
   matéria-prima em m³ por UF, produto e mês, de 2017 a 09/2026.
2. Os produtos da ANP foram agrupados em seis classes: óleo de soja (com o ácido graxo de soja);
   sebo bovino (gordura bovina); gordura de porco e de frango; outros óleos vegetais (algodão, palma
   e dendê, palmiste, milho, canola e girassol); óleo de fritura usado; e «outros materiais graxos»
   com «outros ácidos graxos», categorias da própria ANP sem origem declarada.
3. A parte de cada classe é o volume dela sobre o total da UF nos doze meses de 10/2025 a 09/2026.
   O quarto quadro faz a mesma conta para o país em cada ano de 2017 a 2025 e nesses doze meses.
4. Rebanho bovino de 2024 da Pesquisa da Pecuária Municipal (tabela 3939 do SIDRA), somado por UF.
   28 municípios com o valor sigiloso («...») ficam de fora da soma; a maioria fica em São Paulo.
5. A frase «um litro em cada cem» multiplica a parte do sebo (6,9%) pela mistura obrigatória de 15%
   de biodiesel no diesel, em vigor desde 08/2025: cerca de 1,0%.

## Leitura

- Dos 10,6 milhões de m³ de matéria-prima, 72,7% foram óleo de soja, 14,5% outros materiais
  graxos, 6,9% sebo bovino, 3,3% outros óleos vegetais, 1,5% gordura de porco e de frango e 1,1%
  óleo de fritura usado.
- O sebo foi 14,3% da matéria-prima em 2017 (577 mil m³) e caiu a 5,8% em 2023; o volume, porém,
  cresceu 27% até os últimos doze meses (733 mil m³), porque o biodiesel cresceu mais.
- Em Rondônia, 60,0% da matéria-prima é sebo; em Minas Gerais, 35,1%; no Pará, 31,3%; na Bahia,
  18,2%. Em volume, a Bahia lidera (154 mil m³), seguida do Rio Grande do Sul (141 mil) e de Mato
  Grosso (112 mil).
- Piauí faz biodiesel só de soja (100%), Tocantins quase (98,1%), Mato Grosso do Sul também
  (95,3%). Rio de Janeiro e Minas Gerais não usam soja.
- O Brasil tinha 238 milhões de bois em 2024; as 14 UFs que fazem biodiesel somam 205 milhões. Mato
  Grosso tem o maior rebanho (32,9 milhões), mas usa 3,4 litros de sebo por cabeça; o Rio Grande do
  Sul, 12,2.

## Limitações

- A matéria-prima é a da UF da usina, não a da UF onde o boi foi abatido; o sebo viaja.
- «Outros materiais graxos» (14,5% do país, 65,5% em São Paulo e 58,4% em Santa Catarina) não diz
  de onde vem e pode esconder mais sebo, gordura animal ou óleo usado.
- O volume é o declarado à ANP, em m³ de matéria-prima, não em m³ de biodiesel; a diferença é
  pequena, mas existe.
- O rebanho de 2024 é um retrato de fim de ano; não é o número de bois abatidos.

## Licença dos dados

Dados abertos da ANP e do IBGE, de uso livre com citação da fonte.
