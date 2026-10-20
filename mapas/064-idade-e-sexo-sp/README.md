---
numero: 64
titulo: "Idade e sexo"
subtitulo: "O noroeste envelhece, a metrópole é jovem e os presídios são homens"
data: 2026-10-20
categoria: censo-renda
colecao: gente-sp
tags: [gente-sp, sao-paulo, idade, envelhecimento, razao-de-sexo, piramide-etaria, censo-2022, municipios]

contexto: >-
  A idade mediana dos paulistas é de 36 anos: metade tem menos, metade tem mais. Mas o estado envelhece de forma desigual. No noroeste, em cidades pequenas como Turmalina (51 anos), Floreal e Santana da Ponte Pensa (47), já há mais gente de 65 anos ou mais que crianças de até 14: são 90 municípios assim. Na Grande São Paulo, o índice cai a 32 em Itapevi, três crianças por idoso. Em 446 dos 645 municípios há mais mulheres que homens; Santos tem 83 homens por 100 mulheres. O mapa da razão de sexo tem manchas azul-escuras: Balbinos tem 444 homens por 100 mulheres, e 65% dos seus residentes vivem em domicílios coletivos. Das 29 cidades com mais de 10% da população nesses domicílios, como presídios, 27 passam de 110 homens por 100 mulheres. Segunda prancha da coleção «Gente no território».

imagem: ./mapa_preview.png
imagem_alt: "Três mapas dos municípios de São Paulo e uma pirâmide etária. A idade mediana, em verdes, é mais alta no noroeste, com chamada para Turmalina, 51 anos. O índice de envelhecimento, em azuis, escurece no noroeste e clareia na Grande São Paulo, com chamada para Itapevi, 32. A razão de sexo, do ameixa (mais mulheres) ao azul-escuro (mais homens), é um mosaico, com chamada para Balbinos, 444 homens por 100 mulheres. A pirâmide do estado tem a base estreita e o maior volume entre 35 e 44 anos. No painel, os municípios mais velhos, os mais jovens e os de mais homens por mulher, com a parte dos residentes em domicílios coletivos."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022: tabela 9514 (população residente por sexo e idade)"
    nome_en: "IBGE — 2022 Population Census: table 9514 (resident population by sex and age)"
    url: https://sidra.ibge.gov.br/tabela/9514
    ano: 2022
  - nome: "IBGE — Censo Demográfico 2022: tabela 9515 (índice de envelhecimento, idade mediana e razão de sexo)"
    nome_en: "IBGE — 2022 Population Census: table 9515 (ageing index, median age and sex ratio)"
    url: https://sidra.ibge.gov.br/tabela/9515
    ano: 2022
  - nome: "IBGE — Censo Demográfico 2022: tabela 9922 (domicílios e moradores por situação)"
    nome_en: "IBGE — 2022 Population Census: table 9922 (households and residents by urban/rural status)"
    url: https://sidra.ibge.gov.br/tabela/9922
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Idade mediana, índice de envelhecimento (pessoas de 65 anos ou mais por 100 de até 14) e razão de sexo (homens por 100 mulheres) da população residente por município, do SIDRA 9515, em seis classes cada; pirâmide do estado do SIDRA 9514; residentes fora dos domicílios particulares permanentes ocupados = população (9514) menos moradores desses domicílios (9922)."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#557552", descricao: "645 municípios: pessoas, homens, mulheres, idade mediana, índice de envelhecimento, razão de sexo, até 14 e 60 anos ou mais, domicílios e moradores urbanos e rurais, residentes fora dos domicílios particulares", descricao_en: "645 municipalities: people, men, women, median age, ageing index, sex ratio, aged up to 14 and 60 or over, urban and rural households and residents, residents outside private households" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "Municípios pela idade mediana"
    rotulo_en: "Municipalities by median age"
    unidade: "municípios"
    unidade_en: "municipalities"
    itens:
      - { rotulo: "até 32 anos", rotulo_en: "up to 32 years", valor: 17, cor: "#f1efe6" }
      - { rotulo: "33 a 35", rotulo_en: "33 to 35", valor: 142, cor: "#d9dcc4" }
      - { rotulo: "36 a 38", rotulo_en: "36 to 38", valor: 277, cor: "#b2bd9c" }
      - { rotulo: "39 a 41", rotulo_en: "39 to 41", valor: 159, cor: "#829a76" }
      - { rotulo: "42 a 44", rotulo_en: "42 to 44", valor: 38, cor: "#557552" }
      - { rotulo: "45 ou mais", rotulo_en: "45 or over", valor: 12, cor: "#2f4d33" }
  - tipo: numero
    rotulo: "Idade mediana do estado"
    rotulo_en: "Median age in the state"
    valor: 36
    unidade: "anos"
    unidade_en: "years"
  - tipo: numero
    rotulo: "Municípios com mais pessoas de 65 anos ou mais que de até 14"
    rotulo_en: "Municipalities with more people aged 65 or over than aged up to 14"
    valor: 90
    unidade: "municípios"
    unidade_en: "municipalities"
  - tipo: numero
    rotulo: "Municípios com mais mulheres que homens"
    rotulo_en: "Municipalities with more women than men"
    valor: 446
    unidade: "municípios"
    unidade_en: "municipalities"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/gente-sp-2026/sp_gente_municipios_2022.gpkg.zip
    rotulo: "Municípios com idade, sexo e situação do domicílio, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities with age, sex and urban/rural status, SIRGAS 2000, with QGIS styles"
    tamanho: "4,5 MB"
  - formato: csv
    arquivo: dados/sp_gente_municipios_2022.csv
    rotulo: "Tabela dos municípios"
    rotulo_en: "Municipal table"
    tamanho: "70 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/gente-sp-2026/sp_idade_e_sexo_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/gente-sp-2026/sp_idade_e_sexo_2022_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "5,8 MB"
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

# Idade mediana, envelhecimento e razão de sexo nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 064, a segunda de quatro da coleção **Gente no território**. A parte de pessoas de 60
anos ou mais, setor por setor, está na [prancha 065](../065-idosos-sp/README.md).

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `pessoas`, `homens`, `mulheres`, `idade_mediana`, `indice_envelhecimento`, `razao_sexo`, `ate14`, `de60`, `pct_60_mais`, `dppo`, `dppo_urbana`, `dppo_rural`, `moradores`, `moradores_urbana`, `moradores_rural`, `pct_rural` (da prancha 066), `fora_dppo` e `pct_fora_dppo` (residentes fora dos domicílios particulares permanentes ocupados) |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

A camada `municipios` traz quatro **estilos do QGIS**: `idade_mediana`, `indice_envelhecimento`,
`razao_sexo` e `moradores_rurais`. O **CSV** tem a mesma tabela, sem geometria.

## Método

1. SIDRA 9515: idade mediana, índice de envelhecimento e razão de sexo de cada município, como o
   IBGE os publica. O índice é o número de pessoas de 65 anos ou mais para cada 100 de até 14.
2. Classes: idade mediana até 32, 33 a 35, 36 a 38, 39 a 41, 42 a 44 e 45 anos ou mais; índice
   até 50, 50 a 75, 75 a 100, 100 a 125, 125 a 150 e mais; razão de sexo até 94, 94 a 97, 97 a 100,
   100 a 103, 103 a 110 e mais de 110, em escala divergente com o centro em 100.
3. Pirâmide: SIDRA 9514, população do estado por sexo em grupos de cinco anos, com 90 anos ou mais
   juntos.
4. Residentes fora dos domicílios particulares permanentes ocupados: população residente (9514)
   menos os moradores desses domicílios (9922). São, sobretudo, os moradores de domicílios
   coletivos (presídios, asilos, quartéis, alojamentos) e de domicílios improvisados.

## Limitações

- O Censo conta as pessoas presas no município do presídio. Onde a população carcerária é grande
  diante da cidade, ela domina a razão de sexo e baixa a parte de idosos.
- O Censo não separa, nestas tabelas, o tipo de domicílio coletivo; ligar a razão de sexo aos
  presídios é leitura do mapa, apoiada na parte de residentes fora dos domicílios particulares.
- Em municípios muito pequenos, poucas pessoas mudam a idade mediana em um ano.
