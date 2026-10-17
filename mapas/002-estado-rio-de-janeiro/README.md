---
numero: 2
titulo: "Rio de Janeiro"
subtitulo: "Divisão territorial e rodovias"
data: 2026-10-26
categoria: divisao-territorial
tags: [brasil-estado-por-estado, rio-de-janeiro, municipios, regioes-geograficas, rodovias, ibge]

contexto: >-
  O Rio de Janeiro tem 92 municípios em 44 mil km², 0,5% do território brasileiro. O IBGE os agrupa em 14 regiões imediatas, desenhadas em torno das cidades que oferecem trabalho, comércio e serviços ao entorno, e em 5 regiões intermediárias, que articulam essas redes. A região intermediária de Rio de Janeiro é a que reúne mais municípios (26); a de Macaé - Rio das Ostras - Cabo Frio, a que reúne menos (12). O maior município é Campos dos Goytacazes (4.033 km²); o menor, Nilópolis (19 km²). Parte da série «Brasil, estado por estado»: uma base limpa, com os limites oficiais e a malha rodoviária, para começar um mapa sem perder a primeira tarde reunindo arquivos.

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Rio de Janeiro com os 92 municípios coloridos pelas 5 regiões geográficas intermediárias e os limites das regiões imediatas; rodovias federais em vermelho-terracota com escudos BR, estaduais em cinza-escuro e a capital marcada por uma estrela. Ao redor, as unidades vizinhas em cinza-claro e o Oceano Atlântico em azul-pálido; um mapa de localização do Brasil no canto inferior direito e uma seta do norte em forma de folha no canto superior direito."

recorte: "Estado do Rio de Janeiro (RJ)"
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
crs: "SIRGAS 2000 (EPSG:4674) · DXF em Policônica SIRGAS (EPSG:5880)"
epsg: 4674
software: ["Python", "GeoPandas", "GDAL", "Node.js", "d3-geo"]
metodo: "Limites da Malha Municipal do IBGE, dissolvidos em regiões imediatas, intermediárias e limite estadual; rodovias recortadas pelo limite da unidade."

camadas:
  - { nome: municipios, tipo: poligono, descricao: "92 municípios, com código IBGE, regiões, concentração urbana e área (km²)", descricao_en: "92 municipalities, with IBGE code, regions, urban concentration and area (km²)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "5 regiões geográficas intermediárias", descricao_en: "5 intermediate geographic regions" }
  - { nome: regioes_imediatas, tipo: poligono, cor: "#5f6458", descricao: "14 regiões geográficas imediatas", descricao_en: "14 immediate geographic regions" }
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
      - { rotulo: "Rio de Janeiro", valor: 26, cor: "#efd59a" }
      - { rotulo: "Petrópolis", valor: 19, cor: "#c3d5e0" }
      - { rotulo: "Campos dos Goytacazes", valor: 18, cor: "#d8c3b7" }
      - { rotulo: "Volta Redonda - Barra Mansa", valor: 17, cor: "#e6c3ae" }
      - { rotulo: "Macaé - Rio das Ostras - Cabo Frio", valor: 12, cor: "#c9d6b8" }
  - tipo: numero
    rotulo: "Área"
    rotulo_en: "Area"
    valor: 43750
    unidade: "km²"
    nota: "Maior município: Campos dos Goytacazes (4.033 km²); menor: Nilópolis (19 km²)"
    nota_en: "Largest municipality: Campos dos Goytacazes (4,033 km²); smallest: Nilópolis (19 km²)"
  - tipo: numero
    rotulo: "Rodovias pavimentadas"
    rotulo_en: "Paved highways"
    valor: 6279
    unidade: "km"
    nota: "1.739 km federais e 5.469 km estaduais, pavimentadas ou não"
    nota_en: "1,739 km federal and 5,469 km state highways, paved or not"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/estados-2025/rj_divisao_territorial.gpkg.zip
    rotulo: "Seis camadas, SIRGAS 2000"
    rotulo_en: "Six layers, SIRGAS 2000"
    tamanho: "12,1 MB"
  - formato: dxf
    url: https://github.com/aikiesan/essencial-geo/releases/download/estados-2025/rj_divisao_territorial.dxf.zip
    rotulo: "Limites, rodovias e nomes, em metros (EPSG:5880)"
    rotulo_en: "Boundaries, highways and names, in metres (EPSG:5880)"
    tamanho: "11,8 MB"
  - formato: csv
    arquivo: dados/rj_municipios.csv
    rotulo: "Municípios com códigos e regiões"
    rotulo_en: "Municipalities with codes and regions"
    tamanho: "9 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/estados-2025/rj_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/estados-2025/rj_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "1,3 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

versao: "1.0.0"
discussoes: []
---

# Rio de Janeiro — divisão territorial e rodovias

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 002 da série **Brasil, estado por estado**: uma base cartográfica de cada
unidade da federação, com os mesmos arquivos, as mesmas camadas e o mesmo desenho,
para baixar e começar a trabalhar.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 92 municípios: `CD_MUN`, `NM_MUN`, regiões imediata e intermediária, concentração urbana, `area_km2`, `capital` |
| `regioes_intermediarias` | polígono | 5 regiões, com o número de municípios |
| `regioes_imediatas` | polígono | 14 regiões, com o número de municípios |
| `limite_estadual` | polígono | contorno da unidade |
| `rodovias` | linha | federais e estaduais: `sigla`, `revestimento`, `situacao_fisica`, `n_pistas`, `pavimentada` |
| `capital` | ponto | ponto indicativo, dentro do município (não é a sede) |

O **GPKG** e o **DXF** vão compactados (ZIP) e ficam nos anexos da
[release `estados-2025`](https://github.com/aikiesan/essencial-geo/releases/tag/estados-2025)
do repositório, junto com os das outras 26 unidades.

O **DXF** está em metros (SIRGAS 2000 / Policônica, EPSG:5880 — o mesmo sistema para as
27 unidades, de modo que as bases se encaixam no CAD). As camadas são
`MUNICIPIOS_LIMITES`, `REGIOES_IMEDIATAS_LIMITES`, `REGIOES_INTERMEDIARIAS_LIMITES`,
`LIMITE_ESTADUAL`, `RODOVIAS_FEDERAIS`, `RODOVIAS_ESTADUAIS`, `CAPITAL` e
`MUNICIPIOS_NOMES` (texto). Cada limite comum aparece uma só vez, como uma polilinha.

O **CSV** traz a tabela dos municípios, em UTF-8, pronta para cruzar com dados do
Censo ou de qualquer base que use o código IBGE de sete dígitos.

## Método

1. Malha Municipal 2025 do IBGE, sem alteração de geometria nos arquivos para download.
2. Regiões imediatas, intermediárias e limite obtidos por dissolução dos municípios —
   as bordas coincidem exatamente.
3. Rodovias federais e estaduais da base de infraestrutura do MapBiomas, recortadas
   pelo limite da unidade. A prancha mostra só os trechos construídos.
4. Áreas em km² calculadas pelo IBGE; a soma confere com o cálculo em Albers
   (43.750,4 km²).
5. Na prancha, as geometrias são simplificadas como cobertura (≈ 400 m), para que
   a unidade, as vizinhas e o litoral compartilhem as mesmas bordas.

Scripts: [`scripts/estados/preparar.py`](https://github.com/aikiesan/essencial-geo/blob/main/scripts/estados/preparar.py) (dados),
[`scripts/estados/prancha.mjs`](https://github.com/aikiesan/essencial-geo/blob/main/scripts/estados/prancha.mjs) (prancha) e
[`scripts/estados/readme.mjs`](https://github.com/aikiesan/essencial-geo/blob/main/scripts/estados/readme.mjs) (esta ficha).

## Limitações

- A camada `rodovias` tem o campo `n_pistas` incompleto; não use a base para medir
  extensão de pistas duplicadas.
- O ponto da capital é indicativo (um ponto interno do polígono do município).
