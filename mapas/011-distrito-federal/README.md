---
numero: 11
titulo: "Distrito Federal"
subtitulo: "Divisão territorial e rodovias"
data: 2026-11-16
categoria: divisao-territorial
tags: [brasil-estado-por-estado, distrito-federal, municipios, regioes-geograficas, rodovias, ibge]

contexto: >-
  O Distrito Federal não se divide em municípios: na malha do IBGE ele é um só, Brasília, com 5.761 km². É também, sozinho, uma região imediata e uma região intermediária. A menor unidade da federação fica no Planalto Central, entre Goiás e Minas Gerais, e dela partem as rodovias federais radiais, numeradas de BR-010 a BR-080. Parte da série «Brasil, estado por estado»: uma base limpa, com os limites oficiais e a malha rodoviária, para começar um mapa sem perder a primeira tarde reunindo arquivos.

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Distrito Federal com seu único município, Brasília; rodovias federais em vermelho-terracota com escudos BR, estaduais em cinza-escuro e a capital marcada por uma estrela. Ao redor, as unidades vizinhas em cinza-claro; um mapa de localização do Brasil no canto inferior direito e uma seta do norte em forma de folha no canto superior direito."

recorte: "Distrito Federal (DF)"
fontes:
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
  - nome: "IBGE — Divisão Regional do Brasil em Regiões Geográficas Imediatas e Intermediárias"
    nome_en: "IBGE — Regional Division of Brazil into Immediate and Intermediate Geographic Regions"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/divisao-regional/15778-divisoes-regionais-do-brasil.html
    ano: 2017
  - nome: "MapBiomas — Infraestrutura: rodovias federais e estaduais"
    nome_en: "MapBiomas — Infrastructure: federal and state highways"
    url: https://mapbiomas.org/
  - nome: "Natural Earth — países (só na prancha)"
    nome_en: "Natural Earth — countries (plate only)"
    url: https://www.naturalearthdata.com/
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Limites da Malha Municipal do IBGE, dissolvidos em regiões imediatas, intermediárias e limite estadual; rodovias recortadas pelo limite da unidade."

camadas:
  - { nome: municipios, tipo: poligono, descricao: "1 município, com código IBGE, regiões, concentração urbana e área (km²)", descricao_en: "1 municipality, with IBGE code, regions, urban concentration and area (km²)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "1 região geográfica intermediária", descricao_en: "1 intermediate geographic region" }
  - { nome: regioes_imediatas, tipo: poligono, cor: "#5f6458", descricao: "1 região geográfica imediata", descricao_en: "1 immediate geographic region" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite da unidade da federação", descricao_en: "Boundary of the federative unit" }
  - { nome: rodovias, tipo: linha, cor: "#9c4a32", descricao: "Rodovias federais e estaduais: sigla, revestimento, situação física, pistas", descricao_en: "Federal and state highways: route number, surface, physical status, carriageways" }
  - { nome: capital, tipo: ponto, descricao: "Ponto indicativo da capital (não é a sede exata)", descricao_en: "Indicative point for the capital (not the exact seat)" }

indicadores:
  - tipo: barras
    rotulo: "Municípios por região intermediária"
    rotulo_en: "Municipalities per intermediate region"
    unidade: "municípios"
    unidade_en: "municipalities"
    itens:
      - { rotulo: "Distrito Federal", valor: 1, cor: "#c3d5e0" }
  - tipo: numero
    rotulo: "Área"
    rotulo_en: "Area"
    valor: 5761
    unidade: "km²"
  - tipo: numero
    rotulo: "Rodovias pavimentadas"
    rotulo_en: "Paved highways"
    valor: 935
    unidade: "km"
    nota: "175 km federais e 1.230 km estaduais, pavimentadas ou não"
    nota_en: "175 km federal and 1,230 km state highways, paved or not"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/estados-2025/df_divisao_territorial.gpkg.zip
    rotulo: "Seis camadas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Six layers, SIRGAS 2000, with QGIS styles"
    tamanho: "0,5 MB"
  - formato: csv
    arquivo: dados/df_municipios.csv
    rotulo: "Municípios com códigos e regiões"
    rotulo_en: "Municipalities with codes and regions"
    tamanho: "1 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/estados-2025/df_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/estados-2025/df_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "0,4 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,1 MB"

versao: "1.0.0"
discussoes: []
---

# Distrito Federal — divisão territorial e rodovias

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 011 da série **Brasil, estado por estado**: uma base cartográfica de cada
unidade da federação, com os mesmos arquivos, as mesmas camadas e o mesmo desenho,
para baixar e começar a trabalhar.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 1 município: `CD_MUN`, `NM_MUN`, regiões imediata e intermediária, concentração urbana, `area_km2`, `capital` |
| `regioes_intermediarias` | polígono | 1 região, com o número de municípios |
| `regioes_imediatas` | polígono | 1 região, com o número de municípios |
| `limite_estadual` | polígono | contorno da unidade |
| `rodovias` | linha | federais e estaduais: `sigla`, `revestimento`, `situacao_fisica`, `n_pistas`, `pavimentada` |
| `capital` | ponto | ponto indicativo, dentro do município (não é a sede) |

O **GPKG** vai compactado (ZIP) e fica nos anexos da
[release `estados-2025`](https://github.com/aikiesan/essencial-geo/releases/tag/estados-2025)
do repositório, junto com os das outras 26 unidades.

O GPKG já traz os **estilos do QGIS**, gravados como estilo padrão de cada camada: ao
arrastar o arquivo para o QGIS, os municípios aparecem com as cores das regiões
intermediárias, os limites e as rodovias com o traço da prancha e os nomes com halo.
Os trechos de rodovia sem situação física confirmada ficam numa regra desligada da
legenda, como na prancha; basta marcá-la para vê-los. Em outros SIGs as camadas abrem
normalmente, sem o estilo. Para repetir a ordem da prancha, empilhe de cima para baixo
`capital`, `rodovias`, `limite_estadual`, `regioes_intermediarias`,
`regioes_imediatas` e `municipios`.

O **CSV** traz a tabela dos municípios, em UTF-8, pronta para cruzar com dados do
Censo ou de qualquer base que use o código IBGE de sete dígitos.

## Método

1. Malha Municipal 2025 do IBGE, sem alteração de geometria nos arquivos para download.
2. Regiões imediatas, intermediárias e limite obtidos por dissolução dos municípios —
   as bordas coincidem exatamente.
3. Rodovias federais e estaduais da base de infraestrutura do MapBiomas, recortadas
   pelo limite da unidade. A prancha mostra só os trechos construídos.
4. Áreas em km² calculadas pelo IBGE; a soma confere com o cálculo em Albers
   (5.760,8 km²).
5. Na prancha, as geometrias são simplificadas como cobertura (≈ 400 m), para que
   a unidade, as vizinhas e o litoral compartilhem as mesmas bordas.

Scripts: [`scripts/estados/preparar.py`](https://github.com/aikiesan/essencial-geo/blob/main/scripts/estados/preparar.py) (dados),
[`scripts/estados/estilos.py`](https://github.com/aikiesan/essencial-geo/blob/main/scripts/estados/estilos.py) (estilos do QGIS),
[`scripts/estados/prancha.mjs`](https://github.com/aikiesan/essencial-geo/blob/main/scripts/estados/prancha.mjs) (prancha) e
[`scripts/estados/readme.mjs`](https://github.com/aikiesan/essencial-geo/blob/main/scripts/estados/readme.mjs) (esta ficha).

## Limitações

- A camada `rodovias` tem o campo `n_pistas` incompleto; não use a base para medir
  extensão de pistas duplicadas.
- O ponto da capital é indicativo (um ponto interno do polígono do município).
