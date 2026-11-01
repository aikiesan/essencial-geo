---
numero: 132
titulo: "O etanol muda de endereço"
subtitulo: "A capacidade sobe para o Centro-Oeste, e o centro de gravidade vai junto"
data: 2026-12-07
rascunho: true
categoria: energia
colecao: etanol-br
tags: [etanol-br, brasil, etanol, destilarias, capacidade-autorizada, centro-de-gravidade, mato-grosso, anp]

contexto: >-
  Em agosto de 2026, as 370 destilarias com autorização da ANP somavam 283 mil m³ de etanol por dia, 19% a mais que em dezembro de 2018. O crescimento não foi para onde já havia cana: Mato Grosso passou de 9,6 mil para 31,3 mil m³/dia, Goiás e Mato Grosso do Sul ganharam mais de 7 mil cada, e São Paulo, com 39% da capacidade do país, ficou praticamente onde estava. Vinte e oito municípios sem destilaria em 2018 passaram a ter uma, nove deles em Mato Grosso; Sinop, que não tinha nenhuma, tem hoje a maior capacidade municipal do país. Pesado pela capacidade, o centro de gravidade do etanol andou 95 km para noroeste, de Prata para Ituiutaba, no Triângulo Mineiro. Primeira prancha da coleção «A nova geografia do etanol».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers com um círculo por município com destilaria de etanol, de área proporcional à capacidade autorizada em 08/2026, com um anel para a de 12/2018. As cores separam os municípios que ganharam destilaria (azul-escuro), cresceram (azul), não mudaram (cinza), encolheram (ocre) e perderam toda a capacidade (castanho). Os cinzentos se amontoam no interior de São Paulo; os azuis-escuros, de quem ganhou destilaria, se espalham por Mato Grosso, e os azuis, de quem cresceu, por Goiás, Mato Grosso do Sul e Minas Gerais. Um traço preto no Triângulo Mineiro marca o centro de gravidade da capacidade, de dezembro a dezembro, e uma lupa no canto mostra o trajeto de 95 km de Prata a Ituiutaba. Duas chamadas: Sinop, com 6.606 m³/dia e nenhuma destilaria em 2018, e São Paulo, de 111,4 para 110,6 mil m³/dia. No painel, a tabela das cinco categorias e as barras do ganho e da perda por UF."

recorte: "Brasil"
fontes:
  - nome: "ANP — Painel Dinâmico de Produtores de Etanol: capacidade autorizada por usina e mês (pb-da-etanol.zip)"
    nome_en: "ANP — Ethanol Producers Dynamic Panel: authorised capacity by plant and month (pb-da-etanol.zip)"
    url: https://www.gov.br/anp/pt-br/assuntos/producao-e-fornecimento-de-biocombustiveis/etanol/arquivos-etanol/pb-da-etanol.zip
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
metodo: "Capacidade autorizada de cada destilaria (a maior entre anidro e hidratado) no painel da ANP, somada por município do IBGE em 12/2018 e em 08/2026; centro de gravidade como média das posições municipais pesada pela capacidade, na projeção de Albers, a cada dezembro e em 08/2026."

camadas:
  - { nome: municipios, tipo: ponto, cor: "#234e70", descricao: "339 municípios com capacidade em 12/2018 ou em 08/2026: destilarias e capacidade nos dois meses, variação e categoria", descricao_en: "339 municipalities with capacity in 12/2018 or 08/2026: distilleries and capacity in both months, change and category" }
  - { nome: centro_gravidade, tipo: ponto, cor: "#1a1c1e", descricao: "Centro de gravidade da capacidade em cada dezembro de 2018 a 2025 e em 08/2026, com a distância andada", descricao_en: "Centre of gravity of capacity in each December from 2018 to 2025 and in 08/2026, with the distance moved" }
  - { nome: trajeto, tipo: linha, cor: "#1a1c1e", descricao: "Trajeto do centro de gravidade, 12/2018 → 08/2026, com a distância em linha reta e o rumo", descricao_en: "Track of the centre of gravity, 12/2018 → 08/2026, with the straight-line distance and bearing" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 unidades da federação", descricao_en: "27 states" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Capacidade autorizada de etanol, 08/2026"
    rotulo_en: "Authorised ethanol capacity, 08/2026"
    valor: 283.3
    unidade: "mil m³/dia"
    nota: "19% a mais que em 12/2018 (238,9 mil m³/dia)"
    nota_en: "19% more than in 12/2018 (238.9 thousand m³/day)"
  - tipo: numero
    rotulo: "Deslocamento do centro de gravidade, 12/2018 → 08/2026"
    rotulo_en: "Shift of the centre of gravity, 12/2018 → 08/2026"
    valor: 95
    unidade: "km"
    nota: "para noroeste, de Prata para Ituiutaba (MG)"
    nota_en: "to the north-west, from Prata to Ituiutaba (MG)"
  - tipo: barras
    rotulo: "UFs que mais ganharam capacidade, 12/2018 → 08/2026"
    rotulo_en: "States that gained most capacity, 12/2018 → 08/2026"
    unidade: "mil m³/dia"
    unidade_en: "thousand m³/day"
    itens:
      - { rotulo: "Mato Grosso", valor: 21.6, cor: "#234e70" }
      - { rotulo: "Goiás", valor: 8.2, cor: "#234e70" }
      - { rotulo: "Mato Grosso do Sul", valor: 7.2, cor: "#234e70" }
      - { rotulo: "Minas Gerais", valor: 4.6, cor: "#234e70" }
      - { rotulo: "Maranhão", valor: 2.8, cor: "#234e70" }
      - { rotulo: "Bahia", valor: 2.8, cor: "#234e70" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/etanol-br-2026/br_etanol_capacidade.gpkg.zip
    rotulo: "Municípios, centro de gravidade, trajeto, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities, centre of gravity, track, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,2 MB"
  - formato: csv
    arquivo: dados/br_etanol_capacidade.csv
    rotulo: "Os 339 municípios, com a capacidade em 12/2018 e em 08/2026"
    rotulo_en: "All 339 municipalities, with capacity in 12/2018 and 08/2026"
    tamanho: "31 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/etanol-br-2026/br_etanol_capacidade_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/etanol-br-2026/br_etanol_capacidade_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "3,8 MB"
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

# O etanol muda de endereço: capacidade das destilarias por município, 2018 e 2026

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 132, a primeira da coleção **A nova geografia do etanol**. Onde está a capacidade de
fazer etanol no Brasil, onde ela cresceu desde 2018 e para onde isso empurra o centro do mapa.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | ponto | 339 municípios: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `usinas_2018`, `cap_2018`, `usinas_2026`, `cap_2026` (m³/dia), `anidro_2026`, `hidratado_2026`, `variacao_m3d`, `categoria` (`nova`, `cresceu`, `igual`, `encolheu`, `zerou`), `lon`, `lat` |
| `centro_gravidade` | ponto | 9 posições: `mes`, `capacidade_m3d`, `usinas`, `passo_km` (desde a posição anterior), `desde_2018_km`, `municipio` |
| `trajeto` | linha | o caminho de 12/2018 a 08/2026: `km_em_linha_reta`, `km_percorridos`, `rumo_graus` |
| `ufs` | polígono | 27 unidades da federação, com a região |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `etanol-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/etanol-br-2026).
As camadas trazem o **estilo do QGIS** da prancha: círculos proporcionais à capacidade de 2026,
coloridos pela categoria, e o trajeto do centro de gravidade. O **CSV** fica nesta pasta, em UTF-8,
com a tabela dos municípios sem geometria.

## Método

1. Painel Dinâmico de Produtores de Etanol da ANP (`pb-da-etanol.zip`, baixado em 18/10/2026),
   arquivos `Etanol_Capacidade 2018_2020.csv` e `Etanol_Capacidade 2021_2026.csv`: uma linha por
   destilaria (CNPJ) e mês, com a capacidade autorizada de etanol anidro e de hidratado, em m³/dia.
2. A capacidade de cada destilaria é a maior das duas, não a soma: as mesmas colunas de destilação
   fazem um ou outro (o mesmo critério da prancha 089).
3. O município registrado na ANP foi casado com a Malha Municipal 2025 do IBGE pelo nome e pela UF,
   sem acentos nem pontuação; um nome foi corrigido à mão (Muquém do São Francisco, BA). Todas as
   linhas casaram.
4. A comparação vai de 12/2018 a 08/2026. O painel começa em 01/2018, mas vai incorporando
   destilarias ao longo daquele ano (273 em janeiro, 371 em dezembro); começar antes confundiria
   cadastro com expansão.
5. Categorias, pela capacidade somada no município: ganhou destilaria (nenhuma em 12/2018),
   cresceu, não mudou, encolheu e perdeu toda a capacidade (nenhuma em 08/2026). Uma destilaria
   registrada em Bauru (SP) com capacidade zero em 08/2026 fica fora das categorias.
6. Cada município é desenhado num ponto interno do seu polígono, não na sede nem na usina.
7. Centro de gravidade: média das posições municipais pesada pela capacidade, calculada na projeção
   cônica equivalente de Albers da prancha (SIRGAS 2000, paralelos-padrão 2° S e 22° S, meridiano
   central 54° O), em cada dezembro de 2018 a 2025 e em 08/2026. O município citado é o que contém o
   ponto. Entre as pontas, 94,8 km em linha reta, rumo 322° (noroeste); somando os passos, 105,9 km.

## Leitura

- Dos 44,4 mil m³/dia ganhos, 24,2 mil vieram dos 28 municípios que ganharam destilaria e 35,1 mil
  dos 81 que cresceram; os 31 que perderam toda a capacidade tiraram 11,5 mil, e os 14 que
  encolheram, 3,4 mil. Outros 185 não mudaram.
- Mato Grosso sozinho somou 21,6 mil m³/dia (×3,2). Sinop, Nova Mutum e Primavera do Leste não
  tinham destilaria em 12/2018; Sorriso passou de 110 para 3.899 m³/dia.
- São Paulo ficou parado no total (111,4 → 110,6 mil m³/dia), mas por dentro se mexeu: 26 municípios
  cresceram, 8 encolheram e 13 perderam a última destilaria.

## Limitações

- Capacidade autorizada não é produção: a ANP autoriza o que a destilaria pode fazer por dia, não o
  que ela faz, e muitas param na entressafra.
- A ANP registra a destilaria no município do cadastro; a posição no mapa é a do município, e
  municípios com várias destilarias somam todas no mesmo ponto.
- O centro de gravidade resume o mapa num ponto: ele mostra para onde a capacidade pende, não um
  lugar onde ela esteja. Com 39% da capacidade em São Paulo, o ponto anda devagar mesmo quando o
  Centro-Oeste cresce depressa.
- Uma destilaria que troca de CNPJ aparece como saída e entrada; no município, a capacidade fica.
- O mapa não diz o que cada destilaria destila: a prancha 133 trata do milho.

## Licença dos dados

Dados abertos da ANP e do IBGE, de uso livre com citação da fonte.
