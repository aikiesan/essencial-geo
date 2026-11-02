---
numero: 141
titulo: "O que queimou em agosto"
subtitulo: "Três dias de 2024 e a terra sob os focos"
data: 2026-12-30
rascunho: true
categoria: uso-do-solo
colecao: fogo-sp
tags: [fogo-sp, sao-paulo, focos-de-calor, queimadas, incendios, cana, cobertura-da-terra, inpe, mapbiomas]

contexto: >-
  Entre 22 e 24 de agosto de 2024, o satélite de referência do INPE registrou 2.621 focos de calor no estado de São Paulo, 30% dos 8.712 do ano inteiro; só no dia 23 foram 1.886, mais que em todo o ano de 2022 ou de 2023. Na terra em volta desses focos, 48% era cana-de-açúcar, que cobre 23% do estado: o dobro do seu peso no território. A cana foi a cobertura principal em volta de 1.556 deles (59%). Pastagem, lavouras, silvicultura e floresta nativa aparecem sob os focos em parte menor que a sua área no estado; além da cana, só cerrado, campo e várzea pesam mais (2,5% contra 1,5%). Os focos se juntaram no norte: 844 na região intermediária de Ribeirão Preto. Em Altinópolis, 86 focos caíram sobre um mosaico de mata, cerrado, silvicultura e cana. Foco de calor é fogo ativo visto do satélite, não área queimada.

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com a cana de 2024 em ocre muito claro ao fundo e os focos de calor de 2024 em pontos. Os 6.091 focos fora de 22 a 24 de agosto são pontos cinza pequenos; os 2.621 desses três dias são pontos maiores, coloridos pela classe da MapBiomas que cobre a maior parte do km² em volta: ocre para cana, terracota para pastagem, roxo para mosaico de usos, azul para lavouras, verde-oliva para silvicultura, verde-escuro para floresta nativa, verde-água para cerrado, campo e várzea e cinza-escuro para cidade, água e outros. Os pontos ocre se amontoam no norte, entre Ribeirão Preto, Sertãozinho e Pitangueiras; os verdes e roxos ficam a leste, perto de Minas Gerais e da capital. Duas chamadas: Pitangueiras, 88 focos, 81% de cana sob eles; Altinópolis, 86 focos, com 38% de vegetação nativa, 15% de silvicultura e 23% de cana. No painel, as barras da parte de cada classe sob os focos contra a sua parte no estado e as colunas dos focos por dia de agosto, com o salto de 22 a 24."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "INPE — Programa Queimadas (BDQueimadas), focos de calor do satélite de referência, arquivo anual de 2024"
    nome_en: "INPE — Queimadas Programme (BDQueimadas), reference-satellite hotspots, 2024 annual file"
    url: https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/anual/Brasil_sat_ref/
    ano: 2024
  - nome: "MapBiomas — Coleção 10 da Série Anual de Mapas de Uso e Cobertura da Terra do Brasil, 2024"
    nome_en: "MapBiomas — Collection 10 of the Annual Series of Land Use and Land Cover Maps of Brazil, 2024"
    url: https://brasil.mapbiomas.org/colecoes-mapbiomas/
    ano: 2024
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "pandas", "GeoPandas", "rasterio", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Focos de 2024 do satélite de referência do INPE no estado; para cada um, a composição da cobertura da terra MapBiomas 2024 numa janela de 9 × 9 células de 120 m (~1 km²) em volta do ponto; a cor é a classe que cobre a maior parte da janela, e o painel usa a média das composições."

camadas:
  - { nome: focos_2024, tipo: ponto, cor: "#c08a2e", descricao: "8.712 focos de 2024: data, hora, município, se caiu de 22 a 24/08, classe dominante e composição da cobertura no km² em volta", descricao_en: "8,712 hotspots of 2024: date, time, municipality, whether it fell on 22–24 Aug, dominant class and land-cover composition of the surrounding km²" }
  - { nome: municipios, tipo: poligono, cor: "#c08a2e", descricao: "645 municípios: área, parte em cana em 2024, focos de 2024 e de 22 a 24/08", descricao_en: "645 municipalities: area, share in cane in 2024, hotspots in 2024 and on 22–24 Aug" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Focos de 22 a 24 de agosto de 2024"
    rotulo_en: "Hotspots on 22–24 August 2024"
    valor: 2621
    unidade: "focos"
    nota: "30% dos 8.712 focos de 2024 no estado"
    nota_en: "30% of the state’s 8,712 hotspots in 2024"
  - tipo: barras
    rotulo: "A terra no km² em volta dos focos de 22 a 24/08"
    rotulo_en: "The land in the km² around the 22–24 Aug hotspots"
    unidade: "%"
    itens:
      - { rotulo: "cana", rotulo_en: "sugarcane", valor: 48.0, cor: "#c08a2e" }
      - { rotulo: "mosaico de usos", rotulo_en: "mosaic of uses", valor: 18.7, cor: "#6b3d5c" }
      - { rotulo: "floresta nativa", rotulo_en: "native forest", valor: 13.0, cor: "#2f5d3a" }
      - { rotulo: "pastagem", rotulo_en: "pasture", valor: 8.0, cor: "#9c4a32" }
      - { rotulo: "soja e outras lavouras", rotulo_en: "soya and other crops", valor: 5.2, cor: "#234e70" }
      - { rotulo: "cerrado, campo e várzea", rotulo_en: "savanna, grassland, wetland", valor: 2.5, cor: "#5f9e95" }
      - { rotulo: "cidade, água e outros", rotulo_en: "urban, water and other", valor: 2.5, cor: "#4a4e52" }
      - { rotulo: "silvicultura", rotulo_en: "tree plantation", valor: 2.1, cor: "#7d8a3c" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/fogo-sp-2026/sp_focos_agosto_2024_cobertura.gpkg.zip
    rotulo: "Focos de 2024, municípios e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "2024 hotspots, municipalities and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "17,0 MB"
  - formato: csv
    arquivo: dados/sp_focos_agosto_2024_cobertura.csv
    rotulo: "Os 8.712 focos de 2024, com a cobertura em volta"
    rotulo_en: "All 8,712 hotspots of 2024, with the surrounding land cover"
    tamanho: "0,8 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/fogo-sp-2026/sp_focos_agosto_2024_cobertura_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/fogo-sp-2026/sp_focos_agosto_2024_cobertura_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "3,4 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,4 MB"

doi_automatico: false
versao: "1.0.0"
discussoes: []
---

# O que queimou em agosto: a cobertura da terra sob os focos de calor de 22 a 24 de agosto de 2024 em SP

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 141, a primeira da coleção **Biomassa que vira fumaça**. Três dias de agosto de 2024
concentraram 30% dos focos de calor do ano em São Paulo. A pergunta aqui é o que havia no chão em volta
de cada foco.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `focos_2024` | ponto | 8.712 focos do satélite de referência em 2024: `foco_id`, `data`, `hora_utc`, `lat`, `lon`, `municipio_inpe`, `bioma_inpe` (como no BDQueimadas), `CD_MUN`, `NM_MUN`, `NM_RGINT` (pela malha do IBGE), `destaque_22a24`, `classe_dominante` (classe que cobre a maior parte da janela de ~1 km²), `classe_no_ponto` (classe da célula de 120 m do ponto) e `pct_cana` … `pct_outros` (composição da janela, em % inteiros) |
| `municipios` | polígono | 645 municípios: `CD_MUN`, `NM_MUN`, `NM_RGINT`, `area_km2`, `pct_cana_2024`, `focos_2024`, `focos_22a24_ago` |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `fogo-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/fogo-sp-2026).
A camada `focos_2024` traz dois **estilos do QGIS**: o da prancha (22 a 24/08 pela classe dominante, os
outros em cinza) e outro pela classe da célula do ponto. O **CSV** fica nesta pasta, em UTF-8, com os
focos sem geometria.

Os grupos de classes da MapBiomas (coleção 10) usados aqui:

| Grupo | Códigos MapBiomas |
| --- | --- |
| cana | 20 |
| pastagem | 15 |
| mosaico de usos | 21 |
| soja e outras lavouras | 39, 40, 41, 62, 46, 47, 48, 35 |
| silvicultura | 9 |
| floresta nativa | 3, 5, 6, 49 |
| cerrado, campo e várzea | 4, 11, 12, 13, 29, 32, 50 |
| cidade, água e outros | 22, 23, 24, 25, 30, 31, 33, 75 |

## Método

1. Focos do arquivo anual de 2024 do satélite de referência do INPE (BDQueimadas), com `estado` igual
   a «SÃO PAULO»: 8.712 focos. Cada um foi ligado ao município da Malha Municipal 2025 do IBGE pelo
   ponto. O satélite de referência passa à tarde (entre 16h e 18h UTC, 13h e 15h em Brasília), e a data
   UTC é a mesma data local.
2. Cobertura da terra: MapBiomas, coleção 10, 2024, na grade de 120 m (moda de 4 × 4 pixels de 30 m),
   recortada pelo limite do estado. A parte de cada classe no estado (23,4% de cana, 58.095 km²) vem da
   tabela de área por município da mesma coleção, contada em 30 m.
3. **Janela em volta do foco.** O foco marca o centro de um pixel de cerca de 1 km do sensor MODIS, e a
   célula de 120 m do ponto é ruidosa. Por isso cada foco recebeu a composição de uma janela de 9 × 9
   células de 120 m (cerca de 1,1 km de lado) centrada no ponto, só com as células dentro do estado.
   - O **painel** usa a média dessas composições: é a parte de cada classe na terra em volta dos focos,
     sem o viés de contar só a classe majoritária.
   - A **cor do ponto** é a classe que cobre a maior parte da janela (`classe_dominante`). Essa contagem
     puxa para as classes que formam grandes manchas, como a cana: 59% dos focos de 22 a 24/08 têm a
     cana como classe dominante, contra 48% de cana na terra em volta.
   - Conferência: pela célula do ponto (`classe_no_ponto`), a cana fica com 47,96% dos focos de 22 a
     24/08, a menos de 0,1 ponto da média das janelas.
4. A comparação «focos ÷ estado» divide a parte da classe sob os focos pela sua parte na área do estado.
5. O fundo de cana do mapa é a classe 20 da mesma grade de 120 m.

## Limitações

- **Foco de calor não é área queimada.** É um pixel de ~1 km em que o sensor viu fogo ativo na
  passagem do satélite. Um incêndio grande pode gerar dezenas de focos; um fogo curto, de noite, sob
  nuvem ou pequeno pode não gerar nenhum. Área queimada é outro produto (cicatrizes de queimada, como
  as do MapBiomas Fogo).
- A cobertura é a de 2024, o ano inteiro; a terra em volta do foco não diz o que pegou fogo primeiro,
  nem de onde o fogo veio. Um incêndio que começa no pasto e entra no canavial aparece como fogo na cana.
- A janela de ~1 km² mistura classes vizinhas; as bordas do estado ficam só com as células de dentro.
- A prancha não trata das causas nem da autoria do fogo.

## Licença dos dados

Focos do INPE e malha municipal do IBGE: dados abertos, de uso livre com citação da fonte. Dados do
MapBiomas sob licença CC BY 4.0; cite «Projeto MapBiomas — Coleção 10 da Série Anual de Mapas de Uso e
Cobertura da Terra do Brasil».
