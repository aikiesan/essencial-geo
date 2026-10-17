---
numero: 8
titulo: "Mato Grosso do Sul"
subtitulo: "Divisão territorial e rodovias"
data: 2026-11-09
categoria: divisao-territorial
tags: [brasil-estado-por-estado, mato-grosso-do-sul, municipios, regioes-geograficas, rodovias, ibge]

contexto: >-
  O Mato Grosso do Sul tem 79 municípios em 357 mil km², 4,2% do território brasileiro. O IBGE os agrupa em 12 regiões imediatas, desenhadas em torno das cidades que oferecem trabalho, comércio e serviços ao entorno, e em 3 regiões intermediárias, que articulam essas redes. A região intermediária de Dourados é a que reúne mais municípios (34); a de Corumbá, a que reúne menos (13). O maior município é Corumbá (64.431 km²); o menor, Douradina (280 km²). Parte da série «Brasil, estado por estado»: uma base limpa, com os limites oficiais e a malha rodoviária, para começar um mapa sem perder a primeira tarde reunindo arquivos.

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Mato Grosso do Sul com os 79 municípios coloridos pelas 3 regiões geográficas intermediárias e os limites das regiões imediatas; rodovias federais em vermelho-terracota com escudos BR, estaduais em cinza-escuro e a capital marcada por uma estrela. Ao redor, as unidades vizinhas em cinza-claro; um mapa de localização do Brasil no canto inferior direito e uma seta do norte em forma de folha no canto superior direito."

recorte: "Estado do Mato Grosso do Sul (MS)"
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
  - { nome: municipios, tipo: poligono, descricao: "79 municípios, com código IBGE, regiões, concentração urbana e área (km²)", descricao_en: "79 municipalities, with IBGE code, regions, urban concentration and area (km²)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "3 regiões geográficas intermediárias", descricao_en: "3 intermediate geographic regions" }
  - { nome: regioes_imediatas, tipo: poligono, cor: "#5f6458", descricao: "12 regiões geográficas imediatas", descricao_en: "12 immediate geographic regions" }
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
      - { rotulo: "Dourados", valor: 34, cor: "#efd59a" }
      - { rotulo: "Campo Grande", valor: 32, cor: "#c3d5e0" }
      - { rotulo: "Corumbá", valor: 13, cor: "#c9d6b8" }
  - tipo: numero
    rotulo: "Área"
    rotulo_en: "Area"
    valor: 357142
    unidade: "km²"
    nota: "Maior município: Corumbá (64.431 km²); menor: Douradina (280 km²)"
    nota_en: "Largest municipality: Corumbá (64,431 km²); smallest: Douradina (280 km²)"
  - tipo: numero
    rotulo: "Rodovias pavimentadas"
    rotulo_en: "Paved highways"
    valor: 7962
    unidade: "km"
    nota: "3.798 km federais e 11.355 km estaduais, pavimentadas ou não"
    nota_en: "3,798 km federal and 11,355 km state highways, paved or not"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/estados-2025/ms_divisao_territorial.gpkg.zip
    rotulo: "Seis camadas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Six layers, SIRGAS 2000, with QGIS styles"
    tamanho: "14,5 MB"
  - formato: csv
    arquivo: dados/ms_municipios.csv
    rotulo: "Municípios com códigos e regiões"
    rotulo_en: "Municipalities with codes and regions"
    tamanho: "6 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/estados-2025/ms_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/estados-2025/ms_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "1,5 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

versao: "1.0.0"
discussoes: []
---

# Mato Grosso do Sul — divisão territorial e rodovias

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 008 da série **Brasil, estado por estado**: uma base cartográfica de cada
unidade da federação, com os mesmos arquivos, as mesmas camadas e o mesmo desenho,
para baixar e começar a trabalhar.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 79 municípios: `CD_MUN`, `NM_MUN`, regiões imediata e intermediária, concentração urbana, `area_km2`, `capital` |
| `regioes_intermediarias` | polígono | 3 regiões, com o número de municípios |
| `regioes_imediatas` | polígono | 12 regiões, com o número de municípios |
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
   (357.142,0 km²).
5. Na prancha, as geometrias são simplificadas como cobertura (≈ 400 m), para que
   a unidade, as vizinhas e o litoral compartilhem as mesmas bordas.

## Limitações

- A camada `rodovias` tem o campo `n_pistas` incompleto; não use a base para medir
  extensão de pistas duplicadas.
- O ponto da capital é indicativo (um ponto interno do polígono do município).
