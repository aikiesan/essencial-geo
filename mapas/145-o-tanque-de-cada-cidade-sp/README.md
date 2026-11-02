---
numero: 145
titulo: "O tanque de cada cidade"
subtitulo: "Etanol, gasolina e diesel: quem foge da mistura do estado"
data: 2027-01-11
rascunho: true
categoria: energia
colecao: energia-municipal-sp
tags: [energia-municipal-sp, sao-paulo, combustiveis, etanol, gasolina, diesel, gnv, mapa-ternario, semil, anuario-de-energeticos]

contexto: >-
  Em 2024, os postos e distribuidoras de São Paulo venderam etanol hidratado, gasolina C e óleo diesel que, somados em energia, dão 22,6 GJ por habitante. A mistura do estado é 22% etanol, 30% gasolina e 48% diesel; o GNV fica em 0,5%. O diesel é a maior parte da energia vendida em 436 dos 645 municípios, a gasolina em 152 e o etanol em 56. Entre as cidades de 20 mil habitantes ou mais, Santa Rita do Passa Quatro tem a maior parte de etanol (49%) e Potim, no Vale do Paraíba, a maior de gasolina (76%), mas vende só 2,2 GJ por morador: o tanque se enche na cidade vizinha. Em Américo Brasiliense, 94% da energia é diesel, e a venda chega a 195 GJ por habitante, 9 vezes o estado. As regiões se parecem no etanol (de 18% a 25%) e se separam no diesel, de 38% na região de São Paulo a 65% na de Araçatuba.

imagem: ./mapa_preview.png
imagem_alt: "Mapa ternário dos 645 municípios de São Paulo pela energia vendida em 2024 de etanol hidratado, gasolina C e óleo diesel. A cor mede o desvio da mistura do estado (22% etanol, 30% gasolina, 48% diesel), que fica cinza-claro: verde puxa para o etanol, vermelho para a gasolina, azul para o diesel, e a cor fica mais forte quanto maior o desvio. O azul domina o oeste e o norte; tons de verde-oliva salpicam o centro e o noroeste; o leste, da capital ao Vale do Paraíba e ao litoral, fica rosado, puxado pela gasolina. Redenção da Serra, sem venda, fica hachurada. Três chamadas: Santa Rita do Passa Quatro, 49% etanol; Américo Brasiliense, 94% diesel e 195 GJ por habitante; Potim, 76% gasolina. No painel, o triângulo de cores com os municípios em pontos e as barras empilhadas da mistura de cada região intermediária."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "SEMIL/SP, Anuário de Energéticos por Município 2025 (ano-base 2024): vendas de etanol hidratado, gasolina C, óleo diesel e gás natural por município"
    nome_en: "SEMIL/SP, Municipal Energy Yearbook 2025 (base year 2024): sales of hydrous ethanol, petrol C, diesel oil and natural gas by municipality"
    url: https://semil.sp.gov.br/anuario-de-energeticos-por-municipios-do-estado-de-sao-paulo/
    ano: 2024
  - nome: "IBGE — Malha Municipal 2025 e Censo Demográfico 2022 (população)"
    nome_en: "IBGE — Municipal Mesh 2025 and 2022 Demographic Census (population)"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "pandas", "GeoPandas", "xpdf (pdftotext)", "QGIS", "Node.js", "d3-geo"]
metodo: "Volumes vendidos de etanol hidratado, gasolina C e óleo diesel por município (SEMIL/SP, ano-base 2024), passados a tep pelos fatores do próprio Anuário e somados; a parte de cada um no total vira cor num esquema ternário centrado na mistura do estado (Schöley, 2021)."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#4a6fa5", descricao: "645 municípios: litros de etanol, gasolina C e diesel, m³ de GNV, tep de cada um, partes em %, GJ por habitante e a cor da prancha", descricao_en: "645 municipalities: litres of ethanol, petrol C and diesel, m³ of CNG, toe of each, shares in %, GJ per person and the plate’s colour" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões intermediárias do IBGE", descricao_en: "IBGE’s 11 intermediate regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Energia de etanol, gasolina C, diesel e GNV vendida por habitante em 2024"
    rotulo_en: "Energy sold as ethanol, petrol C, diesel and CNG per person in 2024"
    valor: 22.6
    unidade: "GJ"
    nota: "mediana dos municípios: 20,8 GJ"
    nota_en: "median municipality: 20.8 GJ"
  - tipo: barras
    rotulo: "A mistura do estado, em energia"
    rotulo_en: "The state’s mix, in energy"
    unidade: "%"
    itens:
      - { rotulo: "óleo diesel", rotulo_en: "diesel oil", valor: 48.3, cor: "#4a6fa5" }
      - { rotulo: "gasolina C", rotulo_en: "petrol C", valor: 29.6, cor: "#b0574f" }
      - { rotulo: "etanol hidratado", rotulo_en: "hydrous ethanol", valor: 22.0, cor: "#4f8a4a" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/energia-municipal-sp-2026/sp_combustiveis_rodoviarios_2024.gpkg.zip
    rotulo: "Municípios, regiões intermediárias e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities, intermediate regions and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "18,5 MB"
  - formato: csv
    arquivo: dados/sp_combustiveis_rodoviarios_2024.csv
    rotulo: "Vendas de combustíveis dos 645 municípios em 2024"
    rotulo_en: "Fuel sales in the 645 municipalities in 2024"
    tamanho: "0,1 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/energia-municipal-sp-2026/sp_combustiveis_rodoviarios_2024_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/energia-municipal-sp-2026/sp_combustiveis_rodoviarios_2024_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,3 MB"
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

# O tanque de cada cidade: etanol, gasolina e diesel vendidos nos municípios de SP em 2024

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 145, a segunda da coleção **A energia de cada município**. Três combustíveis enchem quase
todo o tanque dos veículos paulistas. Aqui, cada município é uma mistura deles, e a cor diz para que
lado essa mistura foge da média do estado. A prancha 111, «Cana no tanque», olhou só o ciclo Otto
(etanol contra gasolina); esta põe o diesel na conta.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `CD_MUN`, `NM_MUN`, `CD_RGINT`, `NM_RGINT`, `populacao_2022`, `etanol_l`, `gasolina_l`, `diesel_l` (litros), `gnv_m3`, `etanol_toe` … `gnv_toe`, `pct_etanol`, `pct_gasolina`, `pct_diesel` (partes dos três, somam 100), `pct_gnv` (sobre os quatro), `gj_hab` (os quatro, por habitante) e `cor` (hex da prancha) |
| `regioes_intermediarias` | polígono | as 11 regiões intermediárias do IBGE: `CD_RGINT`, `NM_RGINT` |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `energia-municipal-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/energia-municipal-sp-2026).
A camada `municipios` traz dois **estilos do QGIS**: o da prancha, que pinta cada polígono com o campo
`cor`, e outro pelo combustível com a maior parte. O **CSV** fica nesta pasta, em UTF-8, sem geometria.

## Método

1. **Leitura do Anuário** como na prancha 144: `pdftotext -table`, números postos na coluna pela
   posição e conferidos pela soma das linhas e pela linha do estado.
2. **De volume para energia.** O Anuário dá litros e também a energia de cada derivado em tep. Os
   fatores implícitos foram tirados das próprias tabelas por mínimos quadrados: 0,770 tep por mil litros
   de gasolina C, 0,848 de diesel e 0,510 de etanol hidratado; 0,993 tep por mil m³ de gás natural.
   1 tep = 41,868 GJ.
3. **A mistura** de cada município é a parte de etanol, gasolina C e diesel na soma dos três, em
   energia. O GNV (0,5% do total do estado, vendido em 69 municípios) fica fora do triângulo, mas entra
   nos GJ por habitante.
4. **Cor ternária centrada** (Schöley, 2021). Cada mistura é dividida, parte por parte, pela mistura do
   estado e renormalizada; assim o centro do triângulo passa a ser o estado, e não o 1/3–1/3–1/3. A cor
   sai do OKLCh: o matiz segue a direção do desvio (etanol verde, gasolina vermelha, diesel azul), e a
   força cresce com a distância ao centro até o percentil 95, onde satura.
5. **Destaques** (chamadas e maiores partes) só entre as cidades de 20 mil habitantes ou mais, para que
   um posto de beira de estrada numa cidade pequena não tome o lugar.

## Limitações

- **Venda não é consumo.** O Anuário conta onde o combustível foi vendido, não onde foi queimado. O
  diesel vendido num entroncamento abastece caminhões de passagem; quem mora numa cidade pequena enche
  o tanque na vizinha. Por isso os GJ por habitante vão de quase nada (Potim, 2,2 GJ) a 195 GJ (Américo
  Brasiliense), e o mapa mostra o mercado de cada município, não o hábito dos seus moradores.
- A gasolina C já leva etanol anidro misturado, mais de um quarto do volume; aqui ela conta inteira
  como gasolina C, e a parte do etanol é só a do hidratado.
- Diesel de uso agrícola, de frota própria ou comprado fora do estado pode não passar pela venda
  municipal.
- Redenção da Serra não tem venda registrada no Anuário e fica hachurada.

## Licença dos dados

Anuário de Energéticos por Município da SEMIL/SP e malha municipal e Censo do IBGE: dados públicos, de
uso livre com citação da fonte.
