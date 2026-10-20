---
numero: 68
titulo: "As favelas da metrópole"
subtitulo: "Nas margens, nas encostas e nos mangues"
data: 2026-10-20
categoria: censo-renda
colecao: favelas-sp
tags: [favelas-sp, sao-paulo, favelas, comunidades-urbanas, regiao-metropolitana-de-sao-paulo, baixada-santista, censo-2022, setores-censitarios]

contexto: >-
  Vistas setor por setor, as favelas da Grande São Paulo e da Baixada Santista não formam uma mancha, mas centenas de fragmentos nos fundos de vale, nas encostas e nas beiras de represa, de córrego e de mangue. Na janela do mapa, de Francisco Morato ao Guarujá, estão 92% dos moradores de favelas do estado, em 2.747 comunidades de 51 municípios. As duas maiores ficam na capital: Paraisópolis, com 59 mil moradores, ao lado do Morumbi, e Heliópolis, com 56 mil, na zona sul, junto a São Caetano do Sul. Depois vêm Vila São Pedro, em São Bernardo do Campo, com 28 mil, e Chafik/Macuco e Jardim Oratório, em Mauá. No estado, só 19 favelas passam de 10 mil moradores e reúnem 403 mil pessoas; a maioria é pequena: 2.167 têm menos de mil moradores, e o grosso da população, 1,78 milhão, vive nas 876 que têm de mil a 5 mil.

imagem: ./mapa_preview.png
imagem_alt: "Mapa da Grande São Paulo e da Baixada Santista em fundo cinza-claro, com os limites municipais em linha preta e os setores censitários em favelas e comunidades urbanas em marrom. Os setores formam centenas de manchas pequenas, mais densas no sul e no leste da capital, em Guarulhos, no ABC, em Osasco e nos morros e mangues de Santos, São Vicente, Cubatão e Guarujá. Chamadas apontam Paraisópolis, a maior favela do estado, com 59 mil moradores, e Heliópolis, com 56 mil. No painel, as oito maiores favelas em barras e as favelas do estado por tamanho, de menos de mil a mais de 10 mil moradores."

recorte: "Grande São Paulo e Baixada Santista (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022: agregados por setor censitário (características básicas), com a identificação das Favelas e Comunidades Urbanas"
    nome_en: "IBGE — 2022 Population Census: census tract aggregates (basic characteristics), with the Favelas and Urban Communities identifier"
    url: https://www.ibge.gov.br/estatisticas/sociais/populacao/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "IBGE — Malha de Setores Censitários 2022"
    nome_en: "IBGE — 2022 Census Tract Mesh"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/26565-malhas-de-setores-censitarios-divisoes-intramunicipais.html
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Setores censitários com código de Favela ou Comunidade Urbana nos agregados do Censo 2022, desenhados sobre a malha municipal; moradores de cada comunidade = soma das pessoas dos seus setores."

camadas:
  - { nome: setores_fcu, tipo: poligono, cor: "#97573a", descricao: "8.008 setores em Favelas e Comunidades Urbanas: código e nome da comunidade, município, pessoas e domicílios ocupados", descricao_en: "8,008 tracts in Favelas and Urban Communities: community code and name, municipality, people and occupied households" }
  - { nome: municipios, tipo: poligono, cor: "#62351f", descricao: "645 municípios: pessoas, pessoas em favelas, número de comunidades e parte da população", descricao_en: "645 municipalities: people, people in favelas, number of communities and population share" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "Moradores de favelas pelo tamanho da favela, no estado"
    rotulo_en: "Favela residents by favela size, statewide"
    unidade: "pessoas"
    unidade_en: "people"
    itens:
      - { rotulo: "menos de mil", rotulo_en: "under 1,000", valor: 944458, cor: "#d8ad8a" }
      - { rotulo: "1 a 5 mil", rotulo_en: "1,000 to 5,000", valor: 1782711, cor: "#bf8159" }
      - { rotulo: "5 a 10 mil", rotulo_en: "5,000 to 10,000", valor: 501106, cor: "#97573a" }
      - { rotulo: "mais de 10 mil", rotulo_en: "over 10,000", valor: 402879, cor: "#62351f" }
  - tipo: numero
    rotulo: "Moradores de favelas do estado nesta janela"
    rotulo_en: "The state’s favela residents in this window"
    valor: 92
    unidade: "%"
    nota: "2.747 favelas e comunidades em 51 municípios"
    nota_en: "2,747 favelas and communities in 51 municipalities"
  - tipo: numero
    rotulo: "Moradores de Paraisópolis"
    rotulo_en: "Residents of Paraisópolis"
    valor: 58527
    unidade: "pessoas"
    unidade_en: "people"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/favelas-sp-2026/sp_favelas_2022.gpkg.zip
    rotulo: "Setores em favelas e municípios, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Favela tracts and municipalities, SIRGAS 2000, with QGIS styles"
    tamanho: "5,5 MB"
  - formato: csv
    arquivo: dados/sp_favelas_lista_2022.csv
    rotulo: "Lista das 3.136 favelas e comunidades, com moradores e coordenadas"
    rotulo_en: "List of the 3,136 favelas and communities, with residents and coordinates"
    tamanho: "240 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/favelas-sp-2026/sp_favelas_metropole_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/favelas-sp-2026/sp_favelas_metropole_2022_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,0 MB"
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

# As Favelas e Comunidades Urbanas da Grande São Paulo e da Baixada Santista

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 068, a segunda de quatro da coleção **Favelas e comunidades urbanas**. O estado, município
por município, está na [prancha 067](../067-favelas-sp/README.md).

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `setores_fcu` | polígono | 8.008 setores: `CD_SETOR`, `CD_FCU`, `NM_FCU`, `CD_MUN`, `NM_MUN`, `pessoas`, `dppo` |
| `municipios` | polígono | 645 municípios, com `pessoas_fcu`, `n_fcu` e `pct_fcu` |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

É o **GPKG** da [prancha 067](../067-favelas-sp/README.md), com o **estilo do QGIS** `setores_fcu`.
O **CSV** lista as 3.136 comunidades do estado: `CD_FCU`, `NM_FCU`, `CD_MUN`, `NM_MUN`, `pessoas`,
`setores` e o ponto médio dos setores, ponderado pelas pessoas (`lon`, `lat`).

## Método

1. Setores com código de Favela ou Comunidade Urbana nos agregados por setor do Censo 2022, ligados
   à malha de setores pelo código.
2. Janela: os municípios das concentrações urbanas de São Paulo e de Santos com ao menos 20 mil
   moradores em favelas (19 municípios), com uma margem que mostra os vizinhos.
3. Moradores de cada comunidade = soma das pessoas dos seus setores; as contagens por tamanho são do
   estado todo.

## Limitações

- O nome é o que o IBGE publicou; várias comunidades vizinhas podem ter sido reunidas sob um só nome
  (como Chafik/Macuco) ou um bairro conhecido pode ter sido partido em mais de uma.
- O setor inteiro aparece pintado mesmo quando a favela ocupa só parte dele.
- A escala da prancha não separa as comunidades vizinhas: para ler uma a uma, abra o GPKG.
