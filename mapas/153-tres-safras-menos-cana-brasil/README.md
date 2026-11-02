---
numero: 153
titulo: "Três safras, menos cana"
subtitulo: "O país moeu 48 milhões de toneladas a menos, e São Paulo responde por 86 % da queda"
data: 2027-01-29
rascunho: true
categoria: energia
colecao: sapcana-br
tags: [sapcana-br, brasil, cana-de-acucar, moagem, safra, sao-paulo, mapa]

contexto: >-
  Da safra 2023/24 à 2025/26, a cana moída no Brasil caiu de 712,0 para 663,8 milhões de toneladas: 48,2 milhões a menos (−6,8%). Quase toda a queda tem endereço: São Paulo moeu 41,6 milhões de toneladas a menos (−10,8%), 86% do total, e Minas Gerais, 6,2 milhões a menos; Goiás, Mato Grosso do Sul e Mato Grosso, juntos, moeram 3,0 milhões a mais. A diferença não veio aos poucos: até outubro, 2025/26 andava a 7 milhões de toneladas de 2023/24; em novembro e dezembro de 2025, as usinas moeram 37 milhões a menos que nos mesmos meses de 2023, e a distância chegou a 44 milhões. Os números vêm dos relatórios mensais do SAPCana, do Ministério da Agricultura, que publica a produção por UF, não por usina. Primeira prancha da coleção «A safra de cada estado».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers com um círculo por UF proporcional à cana moída na safra 2025/26 (disco) e na 2023/24 (anel), colorido em quatro categorias de variação: cresceu mais de 2%, ficou entre −2 e +2%, caiu de 2 a 10% e caiu mais de 10%. O maior círculo, vermelho-escuro, fica em São Paulo, com o anel de 2023/24 visível em volta; Minas Gerais aparece em laranja, Goiás, Mato Grosso do Sul e Paraná em cinza-esverdeado, Mato Grosso em verde. Uma chamada aponta São Paulo, com 41,6 milhões de toneladas a menos (−10,8%), 86% da queda do país; outra aponta Mato Grosso, lembrando que GO, MS e MT moeram 3,0 milhões de toneladas a mais. No painel, a tabela da cana moída por UF nas três safras com barras da variação em %, e barras mensais da diferença acumulada entre 2025/26 e 2023/24, perto de zero até outubro (−7) e funda a partir de novembro (−44 em dezembro)."

recorte: "Brasil"
fontes:
  - nome: "MAPA — Acompanhamento da produção sucroalcooleira (SAPCana): relatórios mensais por UF das safras 2023/2024, 2024/2025 e 2025/2026, com cana moída, açúcar e etanol anidro e hidratado acumulados desde 01/04 (36 arquivos .xls, acesso em 01/11/2026)"
    nome_en: "MAPA (Ministry of Agriculture) — Sugar and ethanol production monitoring (SAPCana): monthly reports by state for the 2023/2024, 2024/2025 and 2025/2026 harvests, with cane crushed, sugar and anhydrous and hydrated ethanol accumulated since 1 April (36 .xls files, accessed 01/11/2026)"
    url: https://www.gov.br/agricultura/pt-br/assuntos/sustentabilidade/agroenergia/acompanhamento-da-producao-sucroalcooleira
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
software: ["Python", "pandas", "GeoPandas", "xlrd", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Cana moída por UF no fechamento de cada safra (relatório com o acumulado de 01/04 a 31/03) do SAPCana/MAPA, 2023/24 a 2025/26; variação entre 2023/24 e 2025/26; diferença acumulada nacional mês a mês. Cada UF é desenhada num ponto interno do seu polígono."

camadas:
  - { nome: moagem_uf, tipo: ponto, cor: "#9c4a32", descricao: "19 UFs com cana moída: toneladas nas três safras, variação em t e em %, parte na queda do país e categoria", descricao_en: "19 states with cane crushed: tonnes in the three harvests, change in t and in %, share of the national drop and category" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 UFs: cana moída nas três safras, variação e categoria", descricao_en: "27 states: cane crushed in the three harvests, change and category" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Cana moída no Brasil, safra 2025/26"
    rotulo_en: "Cane crushed in Brazil, 2025/26 harvest"
    valor: 663.8
    unidade: "milhões de t"
    nota: "712,0 em 2023/24 e 676,3 em 2024/25 (−6,8% em duas safras)"
    nota_en: "712.0 in 2023/24 and 676.3 in 2024/25 (−6.8% over two harvests)"
  - tipo: numero
    rotulo: "Parte de São Paulo na queda, 2023/24 → 2025/26"
    rotulo_en: "São Paulo’s share of the drop, 2023/24 → 2025/26"
    valor: 86
    unidade: "%"
    nota: "41,6 dos 48,2 milhões de t a menos; o estado caiu 10,8%"
    nota_en: "41.6 of the 48.2 million t fewer; the state fell 10.8%"
  - tipo: barras
    rotulo: "Variação da cana moída, 2023/24 → 2025/26"
    rotulo_en: "Change in cane crushed, 2023/24 → 2025/26"
    unidade: "milhões de t"
    itens:
      - { rotulo: "São Paulo", valor: -41.6, cor: "#9c4a32" }
      - { rotulo: "Minas Gerais", valor: -6.2, cor: "#d29a5c" }
      - { rotulo: "Alagoas", valor: -1.5, cor: "#d29a5c" }
      - { rotulo: "Pernambuco", valor: -0.8, cor: "#d29a5c" }
      - { rotulo: "Paraná", valor: -0.6, cor: "#b8bd9e" }
      - { rotulo: "Mato Grosso do Sul", valor: 0.8, cor: "#b8bd9e" }
      - { rotulo: "Mato Grosso", valor: 0.9, cor: "#5f7f3a" }
      - { rotulo: "Goiás", valor: 1.2, cor: "#b8bd9e" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/sapcana-br-2026/br_sapcana_moagem.gpkg.zip
    rotulo: "UFs (pontos e polígonos) e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "States (points and polygons) and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,1 MB"
  - formato: csv
    arquivo: dados/br_sapcana_moagem.csv
    rotulo: "As 19 UFs, com a cana moída nas três safras e a variação"
    rotulo_en: "The 19 states, with cane crushed in the three harvests and the change"
    tamanho: "2 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/sapcana-br-2026/br_sapcana_moagem_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/sapcana-br-2026/br_sapcana_moagem_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "3,4 MB"
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

# Três safras, menos cana: a moagem de cada UF de 2023/24 a 2025/26

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 153, a primeira da coleção **A safra de cada estado**. Antes de perguntar o que a cana
vira e quando ela é moída, quanto cada estado moeu em três safras seguidas.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `moagem_uf` | ponto | 19 UFs com cana moída: `SIGLA_UF`, `regiao`, `cana_2023_24`, `cana_2024_25`, `cana_2025_26` (t), `variacao_t`, `variacao_pct`, `parte_perda_pct` (% da queda do país), `categoria`, `lon`, `lat` |
| `ufs` | polígono | 27 UFs: cana moída nas três safras, `variacao_t`, `categoria` (`sem_cana` nas 8 sem moagem) |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `sapcana-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/sapcana-br-2026),
com os **estilos do QGIS** gravados (círculos por categoria, com o tamanho pela cana de 2025/26). O
**CSV** fica nesta pasta, em UTF-8, com a tabela das UFs sem geometria.

## Método

1. Relatórios mensais de acompanhamento da produção sucroalcooleira do Ministério da Agricultura
   (SAPCana), baixados em 01/11/2026: 36 planilhas `.xls`, uma por mês, de 05/2023 a 04/2026. Cada
   uma traz, por UF, o acumulado da safra desde 01/04 (cana moída em t, açúcar em t, etanol anidro e
   hidratado em m³). Desde 2023/24, o sistema usa a janela de 01/04 a 31/03 para todas as UFs,
   inclusive as do Nordeste.
2. As planilhas foram lidas com o `xlrd` (Python do sistema, `converter_xls.py`) e passadas a um
   CSV longo; o resto do cálculo roda no ambiente do projeto (`preparar.py`).
3. Fechamento de cada safra: o relatório com período final em 31/03 (arquivos de 01/04/2024,
   01/04/2025 e 01/04/2026). Variação = 2025/26 menos 2023/24, em t e em %.
4. Categorias pela variação em %: cresceu mais de 2%, ficou entre −2 e +2%, caiu de 2 a 10%, caiu mais
   de 10%. Cada UF é desenhada num ponto interno do seu polígono.
5. Diferença acumulada: a soma nacional do acumulado de cada mês em 2025/26 menos a do mesmo mês em
   2023/24.

## Leitura

- O país moeu 712,0 milhões de t em 2023/24, 676,3 em 2024/25 e 663,8 em 2025/26: 48,2 milhões a
  menos em duas safras (−6,8%).
- São Paulo passou de 386,9 para 345,3 milhões de t (−41,6 milhões, −10,8%): 86% da queda do país.
  Minas Gerais perdeu 6,2 milhões (−7,8%) e Alagoas, 1,5 milhão (−7,6%).
- Goiás (+1,2 milhão, +1,6%), Mato Grosso do Sul (+0,8, +1,6%) e Mato Grosso (+0,9, +5,3%)
  moeram, juntos, 3,0 milhões de t a mais. O Espírito Santo cresceu 16,9%, de uma base pequena.
- Quatro UFs caíram mais de 10% (SP, SE, TO e PI) e quatro cresceram mais de 2% (MT, ES, PA e AM).
- Até outubro, a safra 2025/26 andava a 7 milhões de t da 2023/24. Em novembro e dezembro de 2025,
  as usinas moeram 61,3 milhões de t, contra 98,0 nos mesmos meses de 2023: a distância chegou a
  44 milhões em dezembro e fechou em 48 milhões em março.

## Limitações

- O SAPCana publica os números por UF; não há dado por usina nesses relatórios, e por isso o mapa não
  separa as usinas que pararam das que só moeram menos.
- São números declarados pelas usinas e consolidados pelo MAPA; os relatórios mensais podem ser
  revistos depois (houve quatro pequenas revisões para baixo entre meses seguidos nesses arquivos).
- A janela de 01/04 a 31/03 corta ao meio a safra do litoral do Nordeste (setembro a agosto); nas UFs
  de lá, o total da «safra» é o de abril a março.
- A prancha não diz por que a moagem caiu; a cana moída depende da área colhida, do clima e do fogo,
  que estes relatórios não trazem.

## Licença dos dados

Dados públicos do MAPA e do IBGE, de uso livre com citação da fonte.
