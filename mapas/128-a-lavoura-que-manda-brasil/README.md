---
numero: 128
titulo: "A lavoura que manda"
subtitulo: "A cultura de maior área em cada município"
data: 2026-12-03
rascunho: true                      # prévia: aguarda a aprovação da coleção e a data no calendário
categoria: uso-do-solo
colecao: biomassa-br
tags: [biomassa-br, brasil, biomassa, agricultura, lavouras, soja, milho, cana-de-acucar, pam, municipios]

contexto: >-
  Em 1.582 dos 5.571 municípios brasileiros, a lavoura de maior área é a soja. Ela ocupa 46,2 milhões de hectares, quase metade dos 97,3 milhões plantados no país, e manda do Rio Grande do Sul a Roraima. O milho lidera em 1.222 municípios e a cana-de-açúcar em 752, quase todos no interior de São Paulo, no Triângulo Mineiro e na Zona da Mata nordestina. No Nordeste e no Norte aparecem o feijão, a mandioca, o caju e o cacau; nas serras de Minas, o café. Sorriso (MT) tem o maior campo de soja do país, 600 mil hectares, e Uruguaiana (RS) planta quase só arroz. Cada lavoura deixa palha, bagaço, casca e sabugo: a biomassa que vem depois da colheita.

imagem: ./mapa_preview.png
imagem_alt: "Mapa coroplético do Brasil em projeção cônica de Albers, com os 5.571 municípios pintados pela lavoura de maior área em 2024: verde-oliva para soja, amarelo para milho, verde-escuro para cana-de-açúcar, terracota para feijão, bege para mandioca, marrom para café, verde-claro para banana, azul para arroz, roxo para cacau, rosa para castanha de caju, laranja para laranja e cinza para outras lavouras. A soja cobre o Centro-Oeste, o oeste da Bahia, o Matopiba e o Sul; o milho se espalha pelo Paraná, por Minas e pelo Nordeste; a cana forma uma mancha no interior paulista e uma faixa no litoral nordestino. Duas chamadas: Sorriso, em Mato Grosso, com 600 mil hectares de soja, o maior campo do país, e Uruguaiana, no Rio Grande do Sul, com 94% da área em arroz. No painel, a lista das lavouras com o número de municípios onde cada uma lidera e a área no país."

recorte: "Brasil"
fontes:
  - nome: "IBGE — Produção Agrícola Municipal 2024, lavouras temporárias (área plantada) e permanentes (área destinada à colheita) (SIDRA, tabelas 1612 e 1613)"
    nome_en: "IBGE — Municipal Agricultural Production 2024, temporary crops (planted area) and permanent crops (area for harvest) (SIDRA, tables 1612 and 1613)"
    url: https://sidra.ibge.gov.br/pesquisa/pam/tabelas
    ano: 2024
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
metodo: "Para cada município, a lavoura com mais hectares em 2024 entre as temporárias (área plantada) e as permanentes (área destinada à colheita) da Produção Agrícola Municipal; as onze que lideram em mais municípios ganham cor própria."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#8a9a3c", descricao: "5.571 municípios: área em lavouras, lavoura líder, área e parcela dela, e as áreas de soja, milho e cana", descricao_en: "5,571 municipalities: crop area, leading crop, its area and share, and the soya, maize and cane areas" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 unidades da federação", descricao_en: "27 states" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Municípios onde a soja é a maior lavoura"
    rotulo_en: "Municipalities where soya is the largest crop"
    valor: 1582
    unidade: "municípios"
    nota: "46,2 milhões de hectares de soja, 47% da área em lavouras"
    nota_en: "46.2 million hectares of soya, 47% of the crop area"
  - tipo: barras
    rotulo: "Municípios onde cada lavoura lidera"
    rotulo_en: "Municipalities where each crop leads"
    unidade: "municípios"
    itens:
      - { rotulo: "soja", rotulo_en: "soya", valor: 1582, cor: "#8a9a3c" }
      - { rotulo: "milho", rotulo_en: "maize", valor: 1222, cor: "#e6c35c" }
      - { rotulo: "cana-de-açúcar", rotulo_en: "sugarcane", valor: 752, cor: "#3f6e4a" }
      - { rotulo: "feijão", rotulo_en: "beans", valor: 427, cor: "#9c4a32" }
      - { rotulo: "mandioca", rotulo_en: "cassava", valor: 362, cor: "#d9a77a" }
      - { rotulo: "café", rotulo_en: "coffee", valor: 356, cor: "#5a3420" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-br-2026/br_lavoura_lider.gpkg.zip
    rotulo: "Municípios, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "9,9 MB"
  - formato: csv
    arquivo: dados/br_lavoura_lider.csv
    rotulo: "Os 5.571 municípios, sem geometria"
    rotulo_en: "All 5,571 municipalities, without geometry"
    tamanho: "0,5 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-br-2026/br_lavoura_lider_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-br-2026/br_lavoura_lider_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "6,2 MB"
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

# A lavoura que manda: a cultura de maior área em cada município

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 128, a terceira da coleção **Monitor da biomassa**. Cada lavoura deixa resíduo no
campo e na indústria; antes de medir o resíduo, o mapa mostra qual lavoura ocupa a terra.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 5.571 municípios: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `area_lavouras_ha`, `lavoura_lider` (nome da PAM), `area_lider_ha`, `parcela_lider` (%), `grupo`, `area_soja_ha`, `area_milho_ha`, `area_cana_ha` |
| `ufs` | polígono | 27 unidades da federação, com a região |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `biomassa-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/biomassa-br-2026).
A camada `municipios` traz o **estilo do QGIS** da prancha. O **CSV** fica nesta pasta, em UTF-8,
com a mesma tabela sem geometria.

## Método

1. Área plantada das lavouras temporárias (SIDRA, tabela 1612) e área destinada à colheita das
   permanentes (tabela 1613), em 2024, por município, em hectares. Do café entra só o total, sem
   as parcelas de arábica e canéfora.
2. A lavoura líder é a de maior área no município. As onze que lideram em mais municípios têm cor
   própria; as outras (açaí, fumo, trigo, algodão, sorgo e mais) ficam em cinza, com o nome na
   coluna `lavoura_lider`.
3. «Sem lavoura» são os 60 municípios com área zero em todas as culturas; os 8 fora das tabelas
   ficam como sem dado.
4. As áreas do painel somam todo o país, inclusive onde a lavoura não lidera.

## Limitações

- Área plantada conta duas vezes a terra com duas safras no ano (soja e depois milho safrinha); a
  liderança compara áreas, não produção nem valor.
- Pastagem e floresta plantada não são lavouras na PAM e ficam fora da conta (a floresta está na
  prancha 130).
- A PAM é uma estimativa municipal feita com informantes locais.

## Licença dos dados

Dados abertos do IBGE, de uso livre com citação da fonte.
