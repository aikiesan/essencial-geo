---
numero: 65
titulo: "Os de 60 anos ou mais"
subtitulo: "Um em cada seis paulistas, e um em cada três nas cidades pequenas do noroeste"
data: 2026-11-25
categoria: censo-renda
colecao: gente-sp
tags: [gente-sp, sao-paulo, idosos, envelhecimento, idade, censo-2022, setores-censitarios]

contexto: >-
  Em 2022, 7,65 milhões de paulistas tinham 60 anos ou mais: 17,2% da população, um em cada seis. Mais de um milhão passava dos 80. Setor por setor, o mapa mostra onde eles moram. O azul-escuro, de setores com mais de 30% de pessoas de 60 anos ou mais, onde vivem 3,4 milhões de pessoas, se espalha pelo noroeste e pelo oeste: na região de Presidente Prudente, são 20,1% de 60 anos ou mais; na de São Paulo, 16,6%. Em cidades pequenas como Turmalina, Nova Canaã Paulista e Santana da Ponte Pensa, quase um em cada três; em Águas de São Pedro, 34%, a maior parte do estado. Cajamar, na Grande São Paulo, é a mais jovem das cidades de mais de 50 mil habitantes, com 10,6%. A prancha 064 mostra a idade mediana e o índice de envelhecimento por município. Terceira prancha da coleção «Gente no território».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com os setores censitários em seis tons de azul, do quase branco ao petróleo, pela parte de moradores de 60 anos ou mais. O noroeste e o oeste são um mosaico escuro; a Grande São Paulo e o entorno de Campinas ficam mais claros, com pontos escuros. Setores em sigilo vão hachurados. Chamadas apontam Águas de São Pedro, com 34%, e Cajamar, com 10,6%. No painel, a parte da população em cada classe e barras com a parte de 60 anos ou mais por região intermediária, de 20,1% em Presidente Prudente a 16,6% em São Paulo."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022: agregados por setor censitário (demografia)"
    nome_en: "IBGE — 2022 Population Census: census tract aggregates (demography)"
    url: https://www.ibge.gov.br/estatisticas/sociais/populacao/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "IBGE — Censo Demográfico 2022: tabela 9514 (população residente por sexo e idade)"
    nome_en: "IBGE — 2022 Population Census: table 9514 (resident population by sex and age)"
    url: https://sidra.ibge.gov.br/tabela/9514
    ano: 2022
  - nome: "IBGE — Malha de Setores Censitários 2022"
    nome_en: "IBGE — 2022 Census Tract Mesh"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/26565-malhas-de-setores-censitarios-divisoes-intramunicipais.html
    ano: 2022
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Pessoas de 60 a 69 e de 70 anos ou mais sobre a população de cada setor censitário do Censo 2022, em seis classes; contagens em sigilo valem 1 ou 2, e o setor só recebe classe quando ela é a mesma nos dois casos; totais do estado, dos municípios e das regiões pelo SIDRA 9514, sem sigilo."

camadas:
  - { nome: setores, tipo: poligono, cor: "#3f7686", descricao: "103.319 setores: pessoas por grupo de idade e classe de 60 anos ou mais (a mesma camada da prancha 063)", descricao_en: "103,319 tracts: people by age group and 60-plus class (the same layer as plate 063)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "População pela parte de 60 anos ou mais no setor"
    rotulo_en: "Population by share aged 60 or over in the tract"
    unidade: "pessoas"
    unidade_en: "people"
    itens:
      - { rotulo: "até 10 %", rotulo_en: "up to 10%", valor: 9252550, cor: "#eef2f3" }
      - { rotulo: "10 a 15 %", rotulo_en: "10 to 15%", valor: 9991000, cor: "#cddfe2" }
      - { rotulo: "15 a 20 %", rotulo_en: "15 to 20%", valor: 9683839, cor: "#9ec3c9" }
      - { rotulo: "20 a 25 %", rotulo_en: "20 to 25%", valor: 7383911, cor: "#6b9fab" }
      - { rotulo: "25 a 30 %", rotulo_en: "25 to 30%", valor: 4507319, cor: "#3f7686" }
      - { rotulo: "mais de 30 %", rotulo_en: "over 30%", valor: 3419051, cor: "#1f4a5a" }
  - tipo: numero
    rotulo: "Pessoas de 60 anos ou mais"
    rotulo_en: "People aged 60 or over"
    valor: 17.2
    unidade: "%"
    nota: "7,65 milhões de 44,4 milhões"
    nota_en: "7.65 million of 44.4 million"
  - tipo: numero
    rotulo: "Pessoas de 80 anos ou mais"
    rotulo_en: "People aged 80 or over"
    valor: 1067356
    unidade: "pessoas"
    unidade_en: "people"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/gente-sp-2026/sp_gente_setores_2022.gpkg.zip
    rotulo: "Setores censitários com população, densidade e idade, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Census tracts with population, density and age, SIRGAS 2000, with QGIS styles"
    tamanho: "26,0 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/gente-sp-2026/sp_60_mais_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/gente-sp-2026/sp_60_mais_2022_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "4,7 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,4 MB"

versao: "1.0.0"
discussoes: []
---

# Pessoas de 60 anos ou mais por setor censitário em São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 065, a terceira de quatro da coleção **Gente no território**. A idade mediana e o índice
de envelhecimento por município estão na [prancha 064](../064-idade-e-sexo-sp/README.md).

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `setores` | polígono | 103.319 setores: `pessoas`, pessoas por grupo de idade (`idade_0_a_4` … `idade_60_a_69`, `idade_70_ou_mais`) e `classe_60_mais` (1 a 6); também a densidade da prancha 063 |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

É o mesmo **GPKG** da [prancha 063](../063-densidade-sp/README.md), nos assets da
[release `gente-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/gente-sp-2026),
com o **estilo do QGIS** `60_anos_ou_mais`.

## Método

1. Agregados por setor do Censo 2022, grupo demografia: pessoas residentes (V01006) e pessoas de 60
   a 69 anos (V01040) e de 70 anos ou mais (V01041).
2. Parte de 60 anos ou mais em seis classes, fechadas à direita: até 10%, 10 a 15%, 15 a 20%,
   20 a 25%, 25 a 30% e mais de 30%.
3. Sigilo: o IBGE troca por "X" as contagens pequenas. Nos dados de SP não aparece nenhum 1 nem 2
   nessas variáveis, então um X vale 1 ou 2. A classe é calculada com X = 1 e com X = 2; se der a
   mesma, o setor a recebe; se não, fica sem informação. O X nunca vira zero.
4. Os totais do estado, dos municípios e das regiões intermediárias vêm do SIDRA 9514, que não tem
   sigilo.
5. Na prancha, os setores viram uma grade de cerca de 200 m para caber o estado inteiro.

## Limitações

- 2.731 setores, com 173.568 pessoas, ficam hachurados como sem informação: setores pequenos em que
  o sigilo deixa a classe em aberto.
- Em setores com pouca gente, uma família muda a classe; os tons mais fortes do interior rural
  somam muitos setores pequenos.
- Instituições de longa permanência para idosos contam como domicílios coletivos e entram na
  população do setor onde ficam.
