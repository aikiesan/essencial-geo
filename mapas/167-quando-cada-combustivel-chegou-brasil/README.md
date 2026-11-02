---
numero: 167
titulo: "Quando cada combustível chegou"
subtitulo: "Desde 2015, a biomassa sem cana ganhou mais potência que o bagaço"
data: 2027-03-03
rascunho: true
categoria: energia
colecao: combustivel-biomassa-br
tags: [combustivel-biomassa-br, brasil, biomassa, licor-negro, lenha, bagaco, linha-do-tempo, aneel]

contexto: >-
  O bagaço de cana fez a eletricidade de biomassa do Brasil crescer até 2014: só entre 2010 e 2014 entraram 4,46 GW de usinas a bagaço. Depois, a cana quase parou, e os outros combustíveis passaram à frente. De 2015 para cá, entraram em operação 3,09 GW de usinas a biomassa sem cana, contra 1,86 GW de bagaço; desde 2020, 1,87 GW contra 1,25 GW. Hoje, 55% da potência sem cana entrou em operação de 2015 para cá. O licor negro das fábricas de celulose puxa a fila, com a Suzano de Ribas do Rio Pardo (MS), 384 MW em 2025, mas a lenha é a mais nova de todas: metade das usinas a lenha entrou em 2021 ou depois, várias em usinas de etanol de milho. A mais antiga ainda em operação é de 1955, a Klabin de Otacílio Costa (SC). Terceira e última prancha da coleção «O que mais a usina queima».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers com círculos proporcionais à potência das 225 usinas a biomassa em operação que não queimam bagaço de cana, coloridos pelo período de entrada em operação: bege antes de 2000, azul-claro de 2000 a 2009, azul de 2010 a 2014, laranja de 2015 a 2019 e vermelho-escuro de 2020 a 2026. Os vermelhos e laranjas dominam Mato Grosso, Mato Grosso do Sul e Roraima; os bege e azuis ficam no Sudeste e no Sul. Uma chamada aponta a usina da Suzano em Ribas do Rio Pardo (MS), 384 MW em 2025, e outra a Klabin de Otacílio Costa (SC), de 1955. No painel, barras dos MW que entraram a cada cinco anos, bagaço contra os outros combustíveis, e uma linha do tempo com cada usina no ano em que entrou, uma linha por combustível."

recorte: "Brasil"
fontes:
  - nome: "ANEEL — Sistema de Informações de Geração (SIGA), empreendimentos de geração, dados abertos de 01/10/2026 (acesso em 01/11/2026)"
    nome_en: "ANEEL — Generation Information System (SIGA), generation projects, open data of 01/10/2026 (accessed 01/11/2026)"
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
software: ["Python", "pandas", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Usinas a biomassa em operação no SIGA, pela potência outorgada e pela data de entrada em operação do cadastro (a de 1900-01-03 é tratada como sem data); as 225 que não queimam bagaço de cana vão ao mapa por período, e as 432 a bagaço entram só na comparação do painel, somadas em blocos de cinco anos."

camadas:
  - { nome: usinas, tipo: ponto, cor: "#8a2f1d", descricao: "225 usinas a biomassa em operação sem bagaço de cana: nome, CEG, UF, município, combustível, grupo, potência outorgada, ano de entrada em operação, período, dono", descricao_en: "225 operating biomass plants with no cane bagasse: name, CEG code, state, municipality, fuel, group, licensed capacity, start year, period, owner" }
  - { nome: usinas_cana, tipo: ponto, cor: "#c08a2e", descricao: "432 usinas a bagaço de cana em operação, para a comparação (não desenhadas no mapa)", descricao_en: "432 operating cane-bagasse plants, for the comparison (not drawn on the map)" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 UFs", descricao_en: "27 states" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Potência a biomassa sem cana que entrou em operação de 2015 a 2026"
    rotulo_en: "Non-cane biomass capacity that came online from 2015 to 2026"
    valor: 3.09
    unidade: "GW"
    nota: "55% da potência sem cana em operação; o bagaço ganhou 1,86 GW no mesmo período"
    nota_en: "55% of operating non-cane capacity; bagasse added 1.86 GW over the same period"
  - tipo: barras
    rotulo: "Potência sem cana em operação, pelo período de entrada"
    rotulo_en: "Operating non-cane capacity, by period of entry"
    unidade: "MW"
    itens:
      - { rotulo: "antes de 2000", valor: 905, cor: "#d7d2c4" }
      - { rotulo: "2000 a 2009", valor: 949, cor: "#b7c7cf" }
      - { rotulo: "2010 a 2014", valor: 648, cor: "#7f9fb0" }
      - { rotulo: "2015 a 2019", valor: 1218, cor: "#c07a3a" }
      - { rotulo: "2020 a 2026", valor: 1872, cor: "#8a2f1d" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/combustivel-biomassa-br-2026/br_biomassa_sem_cana_inicio.gpkg.zip
    rotulo: "Usinas sem cana por período, usinas a bagaço, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Non-cane plants by period, bagasse plants, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,2 MB"
  - formato: csv
    arquivo: dados/br_biomassa_sem_cana_inicio.csv
    rotulo: "As 657 usinas a biomassa em operação (225 sem cana e 432 a bagaço), com combustível, potência, ano e coordenadas"
    rotulo_en: "The 657 operating biomass plants (225 non-cane and 432 bagasse), with fuel, capacity, year and coordinates"
    tamanho: "117 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/combustivel-biomassa-br-2026/br_biomassa_sem_cana_inicio_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/combustivel-biomassa-br-2026/br_biomassa_sem_cana_inicio_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "3,3 MB"
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

# Quando cada combustível chegou: a idade das usinas a biomassa que não queimam cana

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 167, a terceira e última da coleção **O que mais a usina queima**. Depois de onde está
cada combustível (pranchas 165 e 166), quando ele chegou à rede.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `usinas` | ponto | 225 usinas sem cana em operação: `nome`, `ceg`, `uf`, `municipio`, `combustivel`, `grupo`, `potencia_kw` (outorgada), `ano_inicio`, `periodo`, `proprietario`, `regime`, `posicao` |
| `usinas_cana` | ponto | 432 usinas a bagaço de cana em operação, com os mesmos campos |
| `ufs` | polígono | 27 UFs |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `combustivel-biomassa-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/combustivel-biomassa-br-2026),
com os **estilos do QGIS** gravados (círculos por período, com o tamanho pela potência). O **CSV**
fica nesta pasta, em UTF-8, com as 657 usinas (o campo `grupo` = `cana` separa as de bagaço).

## Método

1. Cadastro de empreendimentos de geração da ANEEL (SIGA, dados abertos gerados em 01/10/2026,
   baixados em 01/11/2026): as usinas a biomassa em operação, com `DatEntradaOperacao`. O SIGA usa
   1900-01-03 quando não tem a data; essas usinas ficam «sem data» (9 sem cana, com 17 MW).
2. Período de entrada: antes de 2000, 2000–2009, 2010–2014, 2015–2019 e 2020–2026.
3. Painel: potência outorgada que entrou a cada cinco anos, de 1970 a 2026 (o último bloco só tem
   2025 e 2026), para o bagaço e para todos os outros combustíveis juntos; e cada usina sem cana como
   um ponto no ano de entrada, uma linha por grupo de combustível (os grupos da prancha 166, mais o
   licor negro).

## Leitura

- Usinas a biomassa sem cana em operação: 225, com 5,61 GW. Entraram antes de 2000: 905 MW; de 2000
  a 2009: 949 MW; de 2010 a 2014: 648 MW; de 2015 a 2019: 1.218 MW; de 2020 a 2026: 1.872 MW.
- O bagaço viveu o auge antes: 4,46 GW entraram entre 2010 e 2014, contra 0,65 GW dos outros
  combustíveis. De 2015 para cá, o quadro se inverte: 3,09 GW sem cana contra 1,86 GW de bagaço;
  desde 2020, 1,87 GW contra 1,25 GW.
- O licor negro tem as usinas mais antigas, Klabin de Otacílio Costa (SC), 1955, e Klabin de Telêmaco
  Borba (PR), 1961, e também a maior recente, a Suzano de Ribas do Rio Pardo (MS), 384 MW em 2025.
- A lenha é o combustível mais novo: o ano mediano das 17 usinas a lenha é 2021. O primeiro ano de cada
  combustível no cadastro: licor negro 1955, resíduos florestais 1970, lenha 1987, casca de arroz 1995,
  carvão vegetal e biogás de aterro 2002, biogás rural 2008, capim-elefante 2010, palma e lixo 2011.

## Limitações

- O SIGA dá uma data por usina, a da entrada em operação; ampliações e trocas de combustível depois
  dela ficam escondidas na data original. Usinas que fecharam não aparecem: o cadastro mostra quem
  está, não quem já esteve.
- Potência outorgada não é geração.
- O «sem data» do SIGA tira 9 usinas sem cana (17 MW) e 20 a bagaço (287 MW) das contas por período.

## Licença dos dados

Dados abertos da ANEEL e do IBGE, de uso livre com citação da fonte.
