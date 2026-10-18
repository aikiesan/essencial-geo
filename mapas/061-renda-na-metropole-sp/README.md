---
numero: 61
titulo: "A renda na metrópole"
subtitulo: "Do Itaim Bibi ao Jardim Ângela, onze vezes"
data: 2026-11-21
categoria: censo-renda
colecao: renda-solar-sp
tags: [renda-solar-sp, sao-paulo, renda, censo-2022, areas-de-ponderacao, grande-sao-paulo, baixada-santista, desigualdade]

contexto: >-
  A Grande São Paulo e a Baixada Santista somam 44 municípios e 22,3 milhões de pessoas. O IBGE as divide em 841 áreas de ponderação com gente, e em cada uma dá para calcular a renda média de quem responde pela casa. A mais rica é a do Itaim Bibi, na capital: R$ 17.804 por mês, 14,7 salários mínimos de 2022. A 20 km dali, na mesma cidade, a área do Jardim Ângela tem R$ 1.655, 1,4 salário mínimo: a distância é de 10,8 vezes, a maior entre os municípios paulistas com cinco áreas ou mais. Barueri vem depois, de Alphaville ao Engenho Novo (7,6 vezes), e Santos, da Ponta da Praia ao Rádio Clube (6,1). O mapa mostra o centro rico da capital, que se estende a sudoeste até Alphaville, cercado por um anel claro que vai de Francisco Morato a Itaquaquecetuba e desce a serra até o litoral. Segunda prancha da coleção «Renda e sol nos telhados».

imagem: ./mapa_preview.png
imagem_alt: "Mapa da Grande São Paulo e da Baixada Santista com as áreas de ponderação em seis tons, do creme ao ameixa-escuro, pela renda média do responsável em salários mínimos. O centro expandido da capital e Alphaville, em Barueri, aparecem em ameixa-escuro; as bordas norte, leste e sul e o litoral sul ficam claros; a orla de Santos e do Guarujá escurece. Contornos pretos marcam os municípios e há nomes de Barueri, Osasco, Guarulhos, Mogi das Cruzes, Santo André e Santos. Duas chamadas apontam o Itaim Bibi, com R$ 17.804, e o Jardim Ângela, com R$ 1.655. No painel, a parte dos responsáveis em cada classe e barras com a razão entre a área mais rica e a mais pobre de São Paulo, Barueri, São José do Rio Preto e Santos."

recorte: "Concentrações urbanas de São Paulo e de Santos (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022: agregados por setor censitário (renda do responsável)"
    nome_en: "IBGE — 2022 Population Census: census tract aggregates (household head income)"
    url: https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "IBGE — Áreas de Ponderação do Censo 2022 e correspondência com os setores"
    nome_en: "IBGE — 2022 Census Weighting Areas and tract correspondence"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/26565-malhas-de-setores-censitarios-divisoes-intramunicipais.html
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Renda média dos responsáveis com rendimento por área de ponderação do Censo 2022: média dos setores com informação, ponderada pelo número de responsáveis, em salários mínimos de 2022 (R$ 1.212), nos 44 municípios das concentrações urbanas de São Paulo e de Santos."

camadas:
  - { nome: areas_de_ponderacao, tipo: poligono, cor: "#7a5474", descricao: "2.535 áreas de ponderação do estado: bairro ou distrito principal, pessoas, responsáveis, renda média em reais e em salários mínimos", descricao_en: "2,535 weighting areas statewide: main neighbourhood or district, people, household heads, mean income in reais and in minimum wages" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "Responsáveis pela renda média da área de ponderação"
    rotulo_en: "Household heads by the weighting area’s mean income"
    unidade: "responsáveis"
    unidade_en: "household heads"
    itens:
      - { rotulo: "até 1,5 SM", rotulo_en: "up to 1.5 min. wages", valor: 235184, cor: "#f3ece4" }
      - { rotulo: "1,5 a 2 SM", rotulo_en: "1.5 to 2 min. wages", valor: 2637594, cor: "#e2cfc9" }
      - { rotulo: "2 a 3 SM", rotulo_en: "2 to 3 min. wages", valor: 2324166, cor: "#c9a7ae" }
      - { rotulo: "3 a 5 SM", rotulo_en: "3 to 5 min. wages", valor: 1509934, cor: "#a67d92" }
      - { rotulo: "5 a 8 SM", rotulo_en: "5 to 8 min. wages", valor: 919875, cor: "#7a5474" }
      - { rotulo: "mais de 8 SM", rotulo_en: "over 8 min. wages", valor: 574778, cor: "#4b2f4f" }
  - tipo: numero
    rotulo: "Itaim Bibi sobre Jardim Ângela, renda média"
    rotulo_en: "Itaim Bibi over Jardim Ângela, mean income"
    valor: 10.8
    unidade: "vezes"
    unidade_en: "times"
    nota: "R$ 17.804 e R$ 1.655 por mês"
    nota_en: "R$ 17,804 and R$ 1,655 a month"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/renda-solar-sp-2026/sp_renda_apond_2022.gpkg.zip
    rotulo: "Áreas de ponderação do estado com renda, SIRGAS 2000, com estilo do QGIS"
    rotulo_en: "Statewide weighting areas with income, SIRGAS 2000, with QGIS style"
    tamanho: "10,3 MB"
  - formato: csv
    arquivo: dados/sp_renda_apond_2022.csv
    rotulo: "Tabela das áreas de ponderação"
    rotulo_en: "Weighting area table"
    tamanho: "187 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/renda-solar-sp-2026/sp_renda_metropole_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/renda-solar-sp-2026/sp_renda_metropole_2022_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,4 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

doi_automatico: true
versao: "1.0.0"
discussoes: []
---

# Renda por área de ponderação na Grande São Paulo e na Baixada Santista

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 061, a segunda de três da coleção **Renda e sol nos telhados**: a renda da
[prancha 060](../060-renda-mediana-sp/README.md) agregada nas áreas de ponderação, de perto, na
metrópole. O recorte reúne as concentrações urbanas de São Paulo (37 municípios) e de Santos (7),
como o IBGE as define.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `areas_de_ponderacao` | polígono | as 2.535 áreas do estado: `CD_APOND`, `CD_MUN`, `NM_MUN`, `bairro_principal`, `area_km2`, `setores`, `setores_sem_info`, `pessoas`, `responsaveis`, `renda_media` (R$), `renda_media_sm`, `classe` (1 a 6) e `concentracao` (1 no recorte do mapa) |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

O GPKG cobre o estado inteiro, com o **estilo do QGIS** da prancha. O **CSV** traz a mesma tabela,
sem geometria.

## Método

1. Cada setor censitário vai para a sua área de ponderação pela tabela de correspondência do IBGE.
2. Renda média da área: soma, nos setores com informação, da renda média dos responsáveis
   multiplicada pelo número de responsáveis, dividida pelo total de responsáveis desses setores.
3. Seis classes em salários mínimos de 2022 (R$ 1.212): até 1,5, 1,5 a 2, 2 a 3, 3 a 5, 5 a 8 e
   mais de 8.
4. Nome da área: o bairro mais populoso dela, ou o distrito, onde não há bairro (a capital não
   tem bairros na base do Censo).
5. Razão de cada município: a área de maior renda média sobre a de menor, nos 116 municípios do
   estado com cinco áreas ou mais.

## Limitações

- A média sobe com poucos muito ricos; numa área com condomínios de luxo e favela, ela fica entre
  os dois e não descreve nenhum.
- Os setores em sigilo ("X") saem da média, sem virar zero. As 14 áreas do recorte sem domicílio
  ocupado ficam em cinza.
- O peso é o número de responsáveis do setor; o IBGE não publica quantos deles têm rendimento.
- O nome do bairro principal é só um rótulo: a área costuma ter vários bairros.
