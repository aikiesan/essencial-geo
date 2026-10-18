---
numero: 60
titulo: "Quanto ganha quem responde pela casa"
subtitulo: "O salário mínimo é a régua de um terço do estado"
data: 2026-11-20
categoria: censo-renda
colecao: renda-solar-sp
tags: [renda-solar-sp, sao-paulo, renda, censo-2022, setores-censitarios, salario-minimo, desigualdade]

contexto: >-
  Em cada setor censitário de São Paulo, quanto ganha a pessoa que responde pelo domicílio? O Censo 2022 dá a mediana do rendimento dos responsáveis com renda, e o salário mínimo da época, R$ 1.212, serve de régua: em 4.904 setores a mediana é exatamente um salário mínimo. Um terço dos 16,2 milhões de responsáveis do estado vive em setores com mediana de até 1,5 salário mínimo. O mapa clareia no Vale do Ribeira e no oeste: na região de Presidente Prudente, 48% dos responsáveis vivem em setores assim; na de Campinas, 21%. Em Iguape são 79%, e em Francisco Morato, na Grande São Paulo, 78%. No outro extremo, 1,08 milhão de responsáveis moram em setores de mais de 5 salários mínimos; as maiores partes estão em São Caetano do Sul (23%), Santana de Parnaíba e Vinhedo. A prancha 034 mostra o mesmo dado na Região Metropolitana de Campinas. Primeira prancha da coleção «Renda e sol nos telhados».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com os setores censitários em seis tons, do creme ao ameixa-escuro, pela renda mediana do responsável em salários mínimos. O interior é um mosaico de rosas médios; o Vale do Ribeira, o sul e o litoral sul ficam claros; manchas escuras marcam a capital, o eixo até Campinas e os centros das cidades médias. Setores em sigilo vão hachurados. Uma chamada aponta Iguape, com 79% dos responsáveis em setores de até 1,5 salário mínimo. No painel, uma legenda com a parte dos responsáveis em cada classe e barras com essa parte por região intermediária, de 48% em Presidente Prudente a 21% em Campinas."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022: agregados por setor censitário (renda do responsável)"
    nome_en: "IBGE — 2022 Population Census: census tract aggregates (household head income)"
    url: https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "IBGE — Malha de Setores Censitários 2022"
    nome_en: "IBGE — 2022 Census Tract Mesh"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/26565-malhas-de-setores-censitarios-divisoes-intramunicipais.html
    ano: 2022
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Rendimento nominal mediano mensal dos responsáveis com rendimento, por setor censitário do Censo 2022, em seis classes medidas em salários mínimos de 2022 (R$ 1.212); setores com valor em sigilo ficam sem informação."

camadas:
  - { nome: setores, tipo: poligono, cor: "#7a5474", descricao: "103.319 setores: responsáveis, renda média e mediana em reais e em salários mínimos, classe", descricao_en: "103,319 tracts: household heads, mean and median income in reais and in minimum wages, class" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "Responsáveis pela mediana do setor"
    rotulo_en: "Household heads by tract median"
    unidade: "responsáveis"
    unidade_en: "household heads"
    itens:
      - { rotulo: "até 1 SM", rotulo_en: "up to 1 min. wage", valor: 1079657, cor: "#f3ece4" }
      - { rotulo: "1 a 1,5 SM", rotulo_en: "1 to 1.5 min. wages", valor: 4315502, cor: "#e2cfc9" }
      - { rotulo: "1,5 a 2 SM", rotulo_en: "1.5 to 2 min. wages", valor: 4592598, cor: "#c9a7ae" }
      - { rotulo: "2 a 3 SM", rotulo_en: "2 to 3 min. wages", valor: 3417796, cor: "#a67d92" }
      - { rotulo: "3 a 5 SM", rotulo_en: "3 to 5 min. wages", valor: 1735366, cor: "#7a5474" }
      - { rotulo: "mais de 5 SM", rotulo_en: "over 5 min. wages", valor: 1079204, cor: "#4b2f4f" }
  - tipo: numero
    rotulo: "Responsáveis em setores de até 1,5 salário mínimo"
    rotulo_en: "Household heads in tracts of up to 1.5 minimum wages"
    valor: 33
    unidade: "%"
    nota: "5,40 milhões de 16,2 milhões"
    nota_en: "5.40 million of 16.2 million"
  - tipo: numero
    rotulo: "Setores com mediana de um salário mínimo exato"
    rotulo_en: "Tracts with a median of exactly one minimum wage"
    valor: 4904
    unidade: "setores"
    unidade_en: "tracts"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/renda-solar-sp-2026/sp_renda_setores_2022.gpkg.zip
    rotulo: "Setores censitários com renda, SIRGAS 2000, com estilo do QGIS"
    rotulo_en: "Census tracts with income, SIRGAS 2000, with QGIS style"
    tamanho: "24,3 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/renda-solar-sp-2026/sp_renda_mediana_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/renda-solar-sp-2026/sp_renda_mediana_2022_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "3,9 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,4 MB"

doi_automatico: true
versao: "1.0.0"
discussoes: []
---

# Renda mediana do responsável por setor censitário em São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 060, a primeira de três da coleção **Renda e sol nos telhados**: a renda de quem
responde pela casa, setor por setor, depois por área de ponderação na metrópole e, por fim,
cruzada com os sistemas solares nos telhados. A
[prancha 034](../034-renda-rmc/README.md) traz o mesmo dado, com mais detalhe, na Região
Metropolitana de Campinas.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `setores` | polígono | 103.319 setores: `CD_SETOR`, `CD_MUN`, `NM_MUN`, `NM_BAIRRO`, `situacao`, `pessoas`, `responsaveis`, `renda_media` e `renda_mediana` (R$ por mês, dos responsáveis com rendimento), `renda_mediana_sm`, `classe_sm` (1 a 6) e `sem_domicilio` |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `renda-solar-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/renda-solar-sp-2026),
com o **estilo do QGIS** da prancha (`renda_mediana_sm`). Os campos de renda ficam vazios nos
setores em sigilo.

## Método

1. Agregados de renda do responsável por setor do Censo 2022: pessoas responsáveis e rendimento
   nominal médio e mediano mensal dos responsáveis com rendimento, em domicílios particulares
   permanentes ocupados.
2. Seis classes da mediana, em salários mínimos de 2022 (R$ 1.212), fechadas à direita: até 1
   (inclui o próprio salário mínimo), 1 a 1,5, 1,5 a 2, 2 a 3, 3 a 5 e mais de 5.
3. A parte de cada classe soma os responsáveis dos setores dela. As regiões intermediárias somam
   os responsáveis dos setores de até 1,5 salário mínimo.
4. Na prancha, os setores viram uma grade de cerca de 200 m, para caber no desenho do estado; o
   GPKG traz os polígonos.

## Limitações

- O IBGE omite ("X") a renda dos setores pequenos, por sigilo: 1.462 setores, com 73.517
  pessoas, ficam hachurados como sem informação, nunca como renda zero. Outros 2.634 setores não
  têm domicílio ocupado.
- A mediana é a dos responsáveis **com rendimento**: quem não tem renda nenhuma fica de fora, e a
  mediana dos setores mais pobres sai acima do que seria contando todos.
- O rendimento é nominal e declarado, e a renda do responsável não é a do domicílio inteiro.
- A mediana de um setor esconde a mistura de dentro dele.
