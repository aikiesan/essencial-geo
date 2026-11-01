---
numero: 152
titulo: "Quem produz, quem consome"
subtitulo: "O biodiesel nasce no Centro-Oeste e no Sul e viaja para o Sudeste"
data: 2027-01-27
rascunho: true
categoria: energia
colecao: biodiesel-br
tags: [biodiesel-br, brasil, biodiesel, diesel, mistura-obrigatoria, sao-paulo, mato-grosso, anp]

contexto: >-
  O diesel da bomba leva 15% de biodiesel desde agosto de 2025. Nos doze meses até setembro de 2026, o Brasil vendeu 70 milhões de m³ de diesel e 10,2 milhões de m³ de biodiesel, 14,6% do total. Só 6 UFs fazem mais biodiesel do que o diesel delas pede: Mato Grosso e Rio Grande do Sul sobram, cada um, mais de 1,7 milhão de m³, e Goiás, 0,9 milhão. São Paulo produz 15% do que precisa e fica devendo 1,75 milhão de m³; Minas Gerais, 1,18 milhão. 13 UFs não têm usina. Das vendas de biodiesel, 44% cruzaram a fronteira de uma região: 1,7 milhão de m³ do Sul para o Sudeste e 1,5 milhão do Centro-Oeste para o Sudeste. Terceira e última prancha da coleção «De onde vem o biodiesel».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers com as UFs coloridas pelo saldo de biodiesel em 10/2025–09/2026, a produção estimada menos o diesel vendido × 15%, em sete classes de verde (sobra) a marrom (falta). Mato Grosso e Rio Grande do Sul estão no verde mais escuro; São Paulo e Minas Gerais, no marrom mais escuro. Setas curvas entre as regiões mostram as vendas de biodiesel do produtor ao distribuidor, as maiores do Sul e do Centro-Oeste para o Sudeste; chamadas apontam Mato Grosso, que produz 3,7 vezes o que usa, e São Paulo, que produz 15%. No painel, a tabela das cinco regiões com produção, demanda, o que fica e o que sai, e barras do saldo das UFs com sobra e das cinco maiores faltas."

recorte: "Brasil"
fontes:
  - nome: "ANP — Painel Dinâmico de Produtores de Biodiesel, dados abertos: produção, matéria-prima e vendas de biodiesel por região e mês (pb-da-biodiesel.zip, acesso em 01/11/2026)"
    nome_en: "ANP — Biodiesel Producers Dynamic Panel, open data: biodiesel output, feedstock and sales by region and month (pb-da-biodiesel.zip, accessed 01/11/2026)"
    url: https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos/arquivos/pb-da-biodiesel.zip
    ano: 2026
  - nome: "ANP — Vendas de derivados de petróleo e etanol por UF, 1990 a 2026: óleo diesel (acesso em 01/11/2026)"
    nome_en: "ANP — Sales of petroleum products and ethanol by state, 1990 to 2026: diesel oil (accessed 01/11/2026)"
    url: https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos/arquivos/vdpb/vendas-derivados-petroleo-e-etanol/vendas-combustiveis-m3-1990-2025.csv
    ano: 2026
  - nome: "ANP — Biodiesel: mistura obrigatória de 15% desde 01/08/2025 (Resolução CNPE nº 9/2025)"
    nome_en: "ANP — Biodiesel: mandatory 15% blend since 01/08/2025 (CNPE Resolution No. 9/2025)"
    url: https://www.gov.br/anp/pt-br/assuntos/producao-e-fornecimento-de-biocombustiveis/biodiesel
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
metodo: "Saldo de cada UF em 10/2025–09/2026 = produção estimada de biodiesel (matéria-prima da UF × produção ÷ matéria-prima da região) menos a demanda estimada (diesel vendido na UF × 15%); setas = vendas de biodiesel entre regiões, do produtor ao distribuidor (ANP)."

camadas:
  - { nome: ufs, tipo: poligono, cor: "#3f5a2a", descricao: "27 UFs: diesel vendido, demanda estimada, produção estimada, saldo, cobertura e classe", descricao_en: "27 states: diesel sold, estimated demand, estimated output, balance, coverage and class" }
  - { nome: fluxos, tipo: linha, cor: "#1a1c1e", descricao: "Vendas de biodiesel entre regiões, do produtor ao distribuidor, em m³", descricao_en: "Biodiesel sales between regions, from producer to distributor, in m³" }
  - { nome: regioes, tipo: poligono, cor: "#1a1c1e", descricao: "5 grandes regiões: produção, demanda, vendas por origem e destino e o que fica na região", descricao_en: "5 macro-regions: output, demand, sales by origin and destination and what stays in the region" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Falta de biodiesel em São Paulo, 10/2025–09/2026"
    rotulo_en: "São Paulo’s biodiesel shortfall, 10/2025–09/2026"
    valor: 1.75
    unidade: "milhão de m³"
    nota: "produz 0,32 milhão de m³; o diesel pede 2,07 milhões"
    nota_en: "makes 0.32 million m³; its diesel calls for 2.07 million"
  - tipo: numero
    rotulo: "Vendas de biodiesel que cruzaram a fronteira de uma região"
    rotulo_en: "Biodiesel sales that crossed a regional border"
    valor: 44
    unidade: "%"
    nota: "4,5 milhões de 10,2 milhões de m³"
    nota_en: "4.5 million of 10.2 million m³"
  - tipo: barras
    rotulo: "Saldo de biodiesel por UF, 10/2025–09/2026"
    rotulo_en: "Biodiesel balance by state, 10/2025–09/2026"
    unidade: "mil m³"
    itens:
      - { rotulo: "Mato Grosso", valor: 1764, cor: "#3f5a2a" }
      - { rotulo: "Rio Grande do Sul", valor: 1715, cor: "#3f5a2a" }
      - { rotulo: "Goiás", valor: 859, cor: "#7f9a5a" }
      - { rotulo: "Paraná", valor: 298, cor: "#b9c99a" }
      - { rotulo: "Bahia", valor: 277, cor: "#b9c99a" }
      - { rotulo: "Rio de Janeiro", valor: -304, cor: "#e3b9a5" }
      - { rotulo: "Minas Gerais", valor: -1184, cor: "#7e3b28" }
      - { rotulo: "São Paulo", valor: -1754, cor: "#7e3b28" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biodiesel-br-2026/br_biodiesel_balanco.gpkg.zip
    rotulo: "UFs, fluxos entre regiões, regiões e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "States, flows between regions, regions and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,6 MB"
  - formato: csv
    arquivo: dados/br_biodiesel_balanco.csv
    rotulo: "As 27 UFs, com diesel, demanda, produção estimada e saldo"
    rotulo_en: "The 27 states, with diesel, demand, estimated output and balance"
    tamanho: "2 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biodiesel-br-2026/br_biodiesel_balanco_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/biodiesel-br-2026/br_biodiesel_balanco_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "3,4 MB"
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

# Quem produz, quem consome: o saldo de biodiesel de cada UF e o caminho entre as regiões

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 152, a terceira e última da coleção **De onde vem o biodiesel**. Depois das usinas e da
matéria-prima, a conta de cada UF: quanto biodiesel ela faz e quanto o diesel dela pede.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `ufs` | polígono | 27 UFs: `diesel_m3`, `demanda_m3` (diesel × 15%), `producao_m3` (estimada), `saldo_m3`, `cobertura_pct` (produção ÷ demanda), `classe` |
| `fluxos` | linha | vendas de biodiesel entre regiões: `origem`, `destino`, `vendas_m3`, entre pontos escolhidos em cada região |
| `regioes` | polígono | 5 grandes regiões: `producao_m3`, `demanda_m3`, `vendas_origem_m3`, `vendas_destino_m3`, `fica_na_regiao_m3` |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `biodiesel-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/biodiesel-br-2026),
com os **estilos do QGIS** gravados (saldo em sete classes e as linhas dos fluxos). O **CSV** fica
nesta pasta, em UTF-8, com a tabela das UFs sem geometria.

## Método

1. Diesel: vendas de óleo diesel por UF e mês da ANP (`vendas-combustiveis-m3-1990-2025.csv`, que
   vai até 09/2026), somadas nos doze meses de 10/2025 a 09/2026: 70,0 milhões de m³.
2. Demanda estimada de biodiesel = diesel vendido × 15%, a mistura obrigatória desde 01/08/2025
   (Resolução CNPE nº 9/2025). A mistura efetiva no país, vendas de biodiesel ÷ vendas de diesel,
   foi de 14,6% nesses doze meses, entre 14,2% e 15,0% de um mês para outro.
3. Produção por UF: a ANP publica a produção só por região. A produção de cada UF foi estimada pela
   matéria-prima declarada na UF (prancha 151) vezes a razão produção ÷ matéria-prima da região, que
   fica perto de 1 (de 0,963 no Sul a 1,006 no Norte).
4. Saldo = produção estimada − demanda estimada; cobertura = produção ÷ demanda. Sete classes, de
   «falta mais de 1 milhão de m³» a «sobra mais de 1 milhão de m³», com ±100 mil m³ como equilíbrio.
5. Fluxos: `Biodiesel_DadosAbertos_CSV_Vendas.csv`, vendas de biodiesel da região do produtor para
   a região do distribuidor, somadas nos doze meses. As setas mostram os fluxos acima de 20 mil m³.

## Leitura

- No país, foram vendidos 10,2 milhões de m³ de biodiesel e produzidos 10,4 milhões nos doze meses.
- Mato Grosso produz 2,41 milhões de m³ e o diesel dele pede 0,65 milhão: sobra 1,76 milhão, 3,7
  vezes o que usa. O Rio Grande do Sul sobra 1,71 milhão; Goiás, 0,86 milhão; Paraná, 0,30; Bahia,
  0,28; Mato Grosso do Sul, 0,09.
- São Paulo produz 0,32 milhão de m³ e o diesel dele pede 2,07 milhões: faltam 1,75 milhão (15%
  de cobertura). Minas Gerais fica devendo 1,18 milhão; Rio de Janeiro, 0,30; Maranhão, 0,27; Pará,
  0,26. 13 UFs não têm usina.
- Por região, em milhares de m³ (produção / demanda): Centro-Oeste 4.236 / 1.588; Sul 4.096 /
  2.102; Nordeste 928 / 1.702; Sudeste 591 / 4.047; Norte 536 / 1.060.
- 4,5 milhões de m³, 44% das vendas, cruzaram a fronteira de uma região: 1,67 milhão do Sul para o
  Sudeste, 1,46 milhão do Centro-Oeste para o Sudeste, 666 mil do Centro-Oeste para o Norte, 417
  mil do Centro-Oeste para o Nordeste e 127 mil do Norte para o Nordeste.

## Limitações

- A produção por UF é estimada; a ANP só publica a produção por região.
- A demanda usa a mistura nominal de 15%; a efetiva foi de 14,6%, o que tira uns 2,4% da demanda de
  cada UF.
- As vendas vão do produtor ao distribuidor: a região do distribuidor não é, necessariamente, onde o
  diesel é queimado. 6,9 mil m³ têm destino «não informado».
- O diesel vendido numa UF pode ser queimado em outra (caminhões em viagem); a demanda é a das
  vendas, não a do consumo.

## Licença dos dados

Dados abertos da ANP e do IBGE, de uso livre com citação da fonte.
