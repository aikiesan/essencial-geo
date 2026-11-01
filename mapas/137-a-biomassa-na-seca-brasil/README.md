---
numero: 137
titulo: "A biomassa na seca"
subtitulo: "O bagaço gera quando os reservatórios baixam"
data: 2026-12-18
rascunho: true
categoria: energia
colecao: ritmo-biomassa-br
tags: [ritmo-biomassa-br, brasil, biomassa, eletricidade, termeletricas, bagaco-de-cana, estacao-seca, reservatorios, sin, ons, aneel, siga]

contexto: >-
  A biomassa gera quando a água falta. De 2015 a 2024, 77% da geração a biomassa do SIN saiu de maio a novembro, os meses em que a energia armazenada nos reservatórios cai de 57% para 35% do máximo; em julho a biomassa chega a 2,3% da geração do sistema, contra 0,5% em janeiro. Das 37 unidades de cana do Centro-Sul medidas pelo ONS, 25 geram 75% ou mais do ano nesses sete meses, e a mediana é de 83%. Um ano sem estação daria 58%, e é perto disso que ficam as fábricas de celulose, entre 57% e 61%. No Nordeste a conta se inverte: as pequenas térmicas de Alagoas, estado onde 91% da potência térmica de até 30 MW é de bagaço, geram só 35% do ano de maio a novembro, porque lá a safra vai de setembro a março.

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers com 51 círculos, um por usina ou conjunto a biomassa medido pelo ONS, de tamanho proporcional aos MW médios e cor da parcela da geração do ano que sai de maio a novembro, numa escala do terracota (menos de 45%) ao azul-escuro (85% ou mais), com bege no meio, perto dos 58% de um ano sem estação. Os estados levam, mais claro, a mesma parcela das pequenas térmicas do ONS. Os círculos azul-escuros se juntam em São Paulo, Goiás e Mato Grosso do Sul, e São Paulo, Paraná, Goiás, Tocantins e Piauí aparecem em azul; Alagoas e Sergipe aparecem em terracota, e Pernambuco, Rio Grande do Norte e Pará em rosado. Três chamadas: a cana do Centro-Sul, com mediana de 83%; Alagoas, com 35%; e as fábricas de celulose, entre 57% e 61%. No painel, o ano médio do SIN de 2015 a 2024, com a linha da energia armazenada nos reservatórios sobre as barras da parcela da biomassa em cada mês, e a faixa de pontos de cada unidade por combustível."

recorte: "Brasil"
fontes:
  - nome: "ONS — Geração por usina em base horária, dados abertos, 2015–2024"
    nome_en: "ONS — Hourly generation by plant, open data, 2015–2024"
    url: https://dados.ons.org.br/dataset/geracao-usina-2
    ano: "2015–2024"
  - nome: "ONS — Energia armazenada (EAR) diária por subsistema, dados abertos, 2015–2024"
    nome_en: "ONS — Daily stored energy (EAR) by subsystem, open data, 2015–2024"
    url: https://dados.ons.org.br/dataset/ear-diario-por-subsistema
    ano: "2015–2024"
  - nome: "ANEEL — Sistema de Informações de Geração (SIGA), empreendimentos de geração, dados abertos de 01/10/2026"
    nome_en: "ANEEL — Generation Information System (SIGA), generation projects, open data of 01/10/2026"
    url: https://dadosabertos.aneel.gov.br/dataset/siga-sistema-de-informacoes-de-geracao-da-aneel
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
software: ["Python", "pandas", "PyArrow", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Parcela da geração do ano que sai de maio a novembro em cada usina a biomassa que o ONS mede uma a uma, na média dos anos válidos de 2015 a 2024, ao lado do ano médio do SIN: parcela da biomassa na geração e energia armazenada nos reservatórios."

camadas:
  - { nome: usinas, tipo: ponto, cor: "#234e70", descricao: "51 usinas e conjuntos a biomassa do ONS: parcela da geração de maio a novembro, mês de pico e parcela de cada mês", descricao_en: "51 ONS biomass plants and plant groups: May-to-November share of generation, peak month and share of each month" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 unidades da federação, com a parcela de maio a novembro das pequenas térmicas do ONS (2022–2024) e a parcela de bagaço na potência térmica do SIGA", descricao_en: "27 states, with the May-to-November share of ONS small thermal plants (2022–2024) and the bagasse share of SIGA thermal capacity" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Geração a biomassa do SIN de maio a novembro"
    rotulo_en: "SIN biomass generation from May to November"
    valor: 77.1
    unidade: "%"
    nota: "combustível «Biomassa» do ONS, média de 2015 a 2024"
    nota_en: "ONS «Biomassa» fuel, mean of 2015 to 2024"
  - tipo: barras
    rotulo: "Parcela da biomassa na geração do SIN, por mês"
    rotulo_en: "Biomass share of SIN generation, by month"
    unidade: "%"
    itens:
      - { rotulo: "jan", rotulo_en: "Jan", valor: 0.5, cor: "#c08a2e" }
      - { rotulo: "fev", rotulo_en: "Feb", valor: 0.5, cor: "#c08a2e" }
      - { rotulo: "mar", rotulo_en: "Mar", valor: 0.7, cor: "#c08a2e" }
      - { rotulo: "abr", rotulo_en: "Apr", valor: 1.4, cor: "#c08a2e" }
      - { rotulo: "mai", rotulo_en: "May", valor: 1.9, cor: "#c08a2e" }
      - { rotulo: "jun", rotulo_en: "Jun", valor: 2.1, cor: "#c08a2e" }
      - { rotulo: "jul", rotulo_en: "Jul", valor: 2.3, cor: "#c08a2e" }
      - { rotulo: "ago", rotulo_en: "Aug", valor: 2.2, cor: "#c08a2e" }
      - { rotulo: "set", rotulo_en: "Sep", valor: 2.1, cor: "#c08a2e" }
      - { rotulo: "out", rotulo_en: "Oct", valor: 1.8, cor: "#c08a2e" }
      - { rotulo: "nov", rotulo_en: "Nov", valor: 1.6, cor: "#c08a2e" }
      - { rotulo: "dez", rotulo_en: "Dec", valor: 0.9, cor: "#c08a2e" }
  - tipo: barras
    rotulo: "Energia armazenada nos reservatórios do SIN, por mês"
    rotulo_en: "Stored energy in SIN reservoirs, by month"
    unidade: "% do máximo"
    unidade_en: "% of maximum"
    itens:
      - { rotulo: "jan", rotulo_en: "Jan", valor: 37.3, cor: "#234e70" }
      - { rotulo: "fev", rotulo_en: "Feb", valor: 43.9, cor: "#234e70" }
      - { rotulo: "mar", rotulo_en: "Mar", valor: 51.1, cor: "#234e70" }
      - { rotulo: "abr", rotulo_en: "Apr", valor: 55.6, cor: "#234e70" }
      - { rotulo: "mai", rotulo_en: "May", valor: 56.7, cor: "#234e70" }
      - { rotulo: "jun", rotulo_en: "Jun", valor: 56.7, cor: "#234e70" }
      - { rotulo: "jul", rotulo_en: "Jul", valor: 54.4, cor: "#234e70" }
      - { rotulo: "ago", rotulo_en: "Aug", valor: 49.4, cor: "#234e70" }
      - { rotulo: "set", rotulo_en: "Sep", valor: 43.2, cor: "#234e70" }
      - { rotulo: "out", rotulo_en: "Oct", valor: 37.3, cor: "#234e70" }
      - { rotulo: "nov", rotulo_en: "Nov", valor: 34.6, cor: "#234e70" }
      - { rotulo: "dez", rotulo_en: "Dec", valor: 34.9, cor: "#234e70" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/ritmo-biomassa-br-2026/br_biomassa_meses_secos.gpkg.zip
    rotulo: "Usinas, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Plants, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,2 MB"
  - formato: csv
    arquivo: dados/br_biomassa_meses_secos.csv
    rotulo: "As 51 unidades, com a parcela de maio a novembro"
    rotulo_en: "All 51 units, with the May-to-November share"
    tamanho: "15 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/ritmo-biomassa-br-2026/br_biomassa_meses_secos_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/ritmo-biomassa-br-2026/br_biomassa_meses_secos_prancha.en.svg
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

# A biomassa na seca: a geração das usinas a biomassa de maio a novembro no Brasil

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 137, a terceira e última da coleção **O ritmo da biomassa**. A safra de cana do
Centro-Sul cai nos meses em que os reservatórios do SIN se esvaziam, e o bagaço gera justo quando a
água falta.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `usinas` | ponto | 51 usinas e conjuntos: `nome` (SIGA), `nome_ons`, `conjunto`, `uf`, `municipio`, `regiao`, `combustivel` (SIGA), `grupo`, `combustivel_ons`, `modalidade` (de operação no ONS), `ceg_siga`, `posicao`, `anos_validos`, `anos`, `mw_medio`, `seca` (% do ano de maio a novembro), `classe`, `pico` (mês de 1 a 12), `p01` a `p12` (% do ano em cada mês) |
| `ufs` | polígono | 27 unidades da federação: `pqu_mw_medio`, `pqu_seca` e `pqu_pico`, das pequenas térmicas do ONS (2022–2024); `siga_bagaco_pct` e `siga_ate30_bagaco_pct`, da potência térmica em operação no SIGA; `classe` |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `ritmo-biomassa-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/ritmo-biomassa-br-2026).
As camadas `usinas` e `ufs` trazem o **estilo do QGIS** da prancha. O **CSV** fica nesta pasta, em
UTF-8, com a tabela das usinas sem geometria.

## Método

1. As unidades, os anos válidos e a ligação com o SIGA são os da prancha 135: geração horária do ONS
   de 2015 a 2024 (sem 2025 e sem outubro de 2021), usinas «Biomassa» e fábricas de celulose ligadas
   ao SIGA de 01/10/2026 pelo núcleo do CEG, conjuntos no centro do município da usina de mesmo nome,
   e pelo menos dois anos válidos e 1 MW médio por unidade.
2. A parcela seca de cada unidade é a soma dos meses de maio a novembro no perfil médio dela. Sem
   estação, sete meses em doze dariam 58%. As classes vão de menos de 45% a 85% ou mais, com a faixa
   de 55 a 62% em torno do ano sem estação.
3. Os estados levam a mesma parcela das séries «PQU … TERM – CARGA GLOBAL» do ONS, as pequenas
   térmicas somadas por estado, de combustível não informado, de 2022 a 2024.
4. O ano do SIN, no painel, usa toda a geração do ONS somada por combustível e mês. A geração do
   combustível «Biomassa» de cada ano foi dividida pela média daquele ano, e a média dos dez anos dá o
   perfil de que sai a parcela de maio a novembro (77%). A parcela da biomassa em cada mês é a geração
   «Biomassa» sobre a geração total do SIN, na média dos anos.
5. A energia armazenada (EAR) soma, dia a dia, a energia verificada dos quatro subsistemas e divide
   pela soma das capacidades máximas; a média de cada mês, nos 3.653 dias de 2015 a 2024, dá a linha.

## Limitações

- O ONS mede uma a uma só parte das usinas a biomassa e conta a menos as pequenas, que não despacha;
  as usinas que o ONS não mede não entram no mapa nem na série do SIN.
- A série «Biomassa» do SIN não inclui as fábricas de celulose, que o ONS classifica como «Resíduos
  Industriais», nem as pequenas térmicas somadas por estado; inclui os anos de geração quase
  constante descartados no mapa.
- O Nordeste aparece só nas séries por estado, de combustível não informado; nenhuma usina de cana de
  lá tem série usável no ONS.
- A biomassa e a água variam no mesmo calendário, mas a prancha não mede quanto uma substitui a
  outra: mostra só que o bagaço do Centro-Sul gera mais nos meses de reservatório em queda.
- 23 das 51 unidades têm só dois ou três anos válidos (coluna `anos_validos`).

## Licença dos dados

Dados abertos do ONS, da ANEEL e do IBGE, de uso livre com citação da fonte.
