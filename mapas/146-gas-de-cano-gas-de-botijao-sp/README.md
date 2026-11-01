---
numero: 146
titulo: "Gás de cano, gás de botijão"
subtitulo: "Onde o gás vem pela rede, onde vem no botijão"
data: 2027-01-13
rascunho: true
categoria: energia
colecao: energia-municipal-sp
tags: [energia-municipal-sp, sao-paulo, gas-natural, gas-canalizado, glp, botijao, mapa-bivariado, semil, anuario-de-energeticos]

contexto: >-
  Em 2024, o gás natural canalizado de uso fixo (sem GNV e sem usinas térmicas) chegou a 133 dos 645 municípios de São Paulo, onde mora 77% da população; nos outros 512, o gás é o GLP. Em energia, o gás de cano vende 4,3 vezes mais que o GLP, mas 85% dele vai para a indústria, e só 85 municípios têm gás de cano residencial. Santa Gertrudes recebe 509 GJ por habitante, 164 vezes a mediana dos municípios atendidos (3,1 GJ). O GLP soma 1,76 milhão de toneladas, 39,7 kg por habitante; 26% dele é vendido nos municípios sem rede, que têm 23% da população. Em 131 municípios sem gás de cano, o GLP por habitante fica no terço de cima. Jardinópolis, com 45 mil habitantes e sem rede, vende 434 kg por pessoa, 11 vezes a média do estado. GLP vendido não é GLP queimado ali: o número junta todos os usos, e muito botijão se compra na cidade vizinha.

imagem: ./mapa_preview.png
imagem_alt: "Mapa bivariado 3 × 3 dos 645 municípios de São Paulo em 2024: gás natural canalizado de uso fixo por habitante (nenhum, até a mediana dos atendidos, acima dela) cruzado com GLP por habitante em terços (até 16, de 16 a 38, mais de 38 kg). Os sem gás de cano vão do cinza-claro ao laranja conforme o GLP; os com gás de cano vão do azul-claro ao marrom-escuro. O oeste e o sul ficam em cinza, creme e laranja, sem rede; os azuis e marrons se concentram no eixo da capital a Campinas, Piracicaba e Ribeirão Preto e no Vale do Paraíba. Três chamadas: Jardinópolis, 434 kg de GLP por habitante, sem gás de cano; Santa Gertrudes, 509 GJ de gás de cano por habitante; São Paulo, 1,9 GJ e 23 kg por habitante. No painel, a grade 3 × 3 com o número de municípios em cada casa e as barras do GLP por habitante nas maiores cidades sem rede."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "SEMIL/SP, Anuário de Energéticos por Município 2025 (ano-base 2024): gás natural canalizado por classe de consumo e vendas de GLP por município"
    nome_en: "SEMIL/SP, Municipal Energy Yearbook 2025 (base year 2024): piped natural gas by consumer class and LPG sales by municipality"
    url: https://semil.sp.gov.br/anuario-de-energeticos-por-municipios-do-estado-de-sao-paulo/
    ano: 2024
  - nome: "IBGE — Malha Municipal 2025 e Censo Demográfico 2022 (população)"
    nome_en: "IBGE — Municipal Mesh 2025 and 2022 Demographic Census (population)"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "pandas", "GeoPandas", "xpdf (pdftotext)", "QGIS", "Node.js", "d3-geo"]
metodo: "Gás natural canalizado de uso fixo (total menos o automotivo e a termogeração) e GLP vendidos em cada município (SEMIL/SP, ano-base 2024), por habitante do Censo 2022; o gás de cano em três classes (nenhum, até a mediana dos atendidos, acima) e o GLP em terços dos municípios, cruzados num mapa bivariado 3 × 3."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#b98a55", descricao: "645 municípios: consumidores e m³ de gás canalizado por classe, gás de uso fixo, kg de GLP, valores por habitante, classes e a cor da prancha", descricao_en: "645 municipalities: piped-gas consumers and m³ by class, fixed-use gas, kg of LPG, per-person values, classes and the plate’s colour" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões intermediárias do IBGE", descricao_en: "IBGE’s 11 intermediate regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Municípios com gás natural canalizado de uso fixo em 2024"
    rotulo_en: "Municipalities with fixed-use piped natural gas in 2024"
    valor: 133
    unidade: "municípios"
    nota: "onde mora 77% da população do estado"
    nota_en: "home to 77% of the state’s population"
  - tipo: barras
    rotulo: "Gás canalizado de uso fixo, por classe de consumo"
    rotulo_en: "Fixed-use piped gas, by consumer class"
    unidade: "%"
    itens:
      - { rotulo: "industrial", rotulo_en: "industrial", valor: 84.9, cor: "#6b5546" }
      - { rotulo: "residencial", rotulo_en: "residential", valor: 7.4, cor: "#7b9cc0" }
      - { rotulo: "cogeração", rotulo_en: "cogeneration", valor: 4.2, cor: "#7f879a" }
      - { rotulo: "comercial", rotulo_en: "commercial", valor: 3.5, cor: "#c3d1de" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/energia-municipal-sp-2026/sp_gas_canalizado_e_glp_2024.gpkg.zip
    rotulo: "Municípios, regiões intermediárias e limite, SIRGAS 2000, com estilo do QGIS"
    rotulo_en: "Municipalities, intermediate regions and boundary, SIRGAS 2000, with QGIS style"
    tamanho: "18,5 MB"
  - formato: csv
    arquivo: dados/sp_gas_canalizado_e_glp_2024.csv
    rotulo: "Gás canalizado e GLP dos 645 municípios em 2024"
    rotulo_en: "Piped gas and LPG in the 645 municipalities in 2024"
    tamanho: "0,1 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/energia-municipal-sp-2026/sp_gas_canalizado_e_glp_2024_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/energia-municipal-sp-2026/sp_gas_canalizado_e_glp_2024_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,2 MB"
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

# Gás de cano, gás de botijão: gás natural canalizado e GLP por habitante nos municípios de SP em 2024

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 146, a terceira e última da coleção **A energia de cada município**. Em São Paulo, o gás
chega por dois caminhos: pela rede das concessionárias de gás natural ou no botijão e no cilindro de
GLP. O mapa cruza os dois, por habitante, para mostrar onde a rede chegou e onde o botijão faz as vezes
dela.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `CD_MUN`, `NM_MUN`, `CD_RGINT`, `NM_RGINT`, `populacao_2022`, `gn_consumidores`, `gn_residencial_nc`, `gn_residencial_m3`, `gn_comercial_m3`, `gn_industrial_m3`, `gn_automotivo_m3`, `gn_cogeracao_m3`, `gn_termogeracao_m3`, `gn_total_m3`, `gn_fixo_m3` (uso fixo), `gn_fixo_gj_hab`, `glp_kg`, `glp_kg_hab`, `glp_gj_hab`, `classe_gn` (0 a 2), `classe_glp` (0 a 2), `classe` (3 × `classe_gn` + `classe_glp`) e `cor` |
| `regioes_intermediarias` | polígono | as 11 regiões intermediárias do IBGE: `CD_RGINT`, `NM_RGINT` |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `energia-municipal-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/energia-municipal-sp-2026),
com o **estilo do QGIS** da prancha (as nove casas da grade) na camada `municipios`. O **CSV** fica nesta
pasta, em UTF-8, sem geometria.

## Método

1. **Leitura do Anuário** como na prancha 144: `pdftotext -table`, números postos na coluna pela
   posição e conferidos pela soma das linhas e pela linha do estado.
2. **Gás de uso fixo** = gás natural canalizado total − automotivo (GNV) − termogeração (usinas
   elétricas). Ficam o industrial, o residencial, o comercial e a cogeração: 4.632 milhões de m³ no
   estado. Passado a energia por 0,993 tep por mil m³ (fator tirado das tabelas do Anuário) e
   1 tep = 41,868 GJ.
3. **GLP** em kg por habitante, a partir das vendas em toneladas; em energia, 0,611 tep por tonelada,
   do mesmo modo. O único valor negativo da tabela (−907 kg, num município) foi levado a zero.
4. **Classes.** Gás de cano: nenhum; até a mediana dos 133 municípios atendidos (3,10 GJ por
   habitante); acima dela. GLP: terços dos 645 municípios, com cortes em 16,4 e 38,3 kg por habitante.
5. **Comparações.** «4,3 vezes» compara o gás de uso fixo (4,60 milhões de tep) com o GLP (1,08 milhão
   de tep). A população é a do Censo 2022.

## Limitações

- **GLP vendido não é GLP queimado ali.** O Anuário atribui a venda ao município onde a distribuidora a
  registra, e muito botijão se compra na cidade vizinha. Borá, com 907 habitantes, aparece com 2.405 kg
  por pessoa; Aguaí, com 1.183 kg, e Borebi, com 726 kg, também ficam muito acima do que uma casa gasta.
- **O GLP junta todos os usos**: cozinha, comércio, indústria, secagem de grãos, empilhadeiras. O
  Anuário não separa o GLP por setor, e por isso não dá para saber quanto vai para as casas.
- O gás de cano de uso fixo é dominado pela indústria (85%). Um município acima da mediana pode ter
  uma única fábrica grande e nenhuma casa ligada: só 85 municípios têm gás canalizado residencial.
- As duas classes de gás de cano usam a mediana dos atendidos; a escala é relativa ao estado, não a uma
  meta de acesso.

## Licença dos dados

Anuário de Energéticos por Município da SEMIL/SP e malha municipal e Censo do IBGE: dados públicos, de
uso livre com citação da fonte.
