---
numero: 45
titulo: "O tabuleiro agrícola"
subtitulo: "Quase um quarto do estado é cana"
data: 2026-10-20
categoria: uso-do-solo
colecao: agro-sp
tags: [agro-sp, sao-paulo, uso-da-terra, agricultura, cana, soja, pastagem, mapbiomas]

contexto: >-
  Em 2024, 72% do território paulista era lavoura, pasto, silvicultura ou um mosaico desses usos, segundo o MapBiomas. A cana é a maior classe: 58 mil km², quase um quarto do estado, e é o uso que mais ocupa 255 dos 645 municípios. Na região de Ribeirão Preto ela cobre metade do chão, e em Dumont, 80%. A soja e as outras lavouras temporárias somam 7%, mais no sul, na região de Marília e em volta de Itapeva. A pastagem, com 15%, domina o oeste: cobre 36% da região de Presidente Prudente. Laranja, café e outras lavouras perenes ocupam menos de 2%. A vegetação nativa, 22% do estado, está sobretudo na Serra do Mar e no Vale do Ribeira. Primeira prancha da coleção «Do campo ao biometano», que segue as lavouras até o gás que os seus resíduos dariam.

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com o uso e a cobertura da terra em 2024, em onze cores. O verde-claro da cana cobre quase todo o centro e o norte do estado, mais contínuo em volta de Ribeirão Preto. O marrom-claro da soja e das outras lavouras temporárias forma manchas no sul, de Itapeva a Assis. O amarelo-palha da pastagem e o creme do mosaico de usos predominam no oeste e no Vale do Paraíba. Manchas laranja de citros se espalham pelo centro-norte, e o marrom-escuro do café aparece no nordeste, perto de Franca. O verde-acinzentado da vegetação nativa ocupa a Serra do Mar e o Vale do Ribeira, no sudeste; o cinza das cidades marca a Grande São Paulo, e o azul dos reservatórios desenha os rios Tietê e Paraná. Chamadas: Dumont, 80% em cana; Itapeva, 664 km² de soja e outras lavouras temporárias."

recorte: "Estado de São Paulo (SP)"
fontes:
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
software: ["Python", "rasterio", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Classificação de 2024 do MapBiomas (Coleção 10), pixels de 30 m, agrupada em onze classes; áreas por município contadas nos pixels de 30 m, no elipsoide GRS80; mapa desenhado com a classe mais frequente em blocos de 4 × 4 pixels (120 m)."

camadas:
  - { nome: municipios, tipo: poligono, descricao: "645 municípios: área (km²) e parte do município (%) de cada uma das onze classes, soma dos usos agropecuários e classe de maior área", descricao_en: "645 municipalities: area (km²) and share of the municipality (%) of each of the eleven classes, total of farming uses and class with the largest area" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "O estado por uso da terra"
    rotulo_en: "The state by land use"
    unidade: "km²"
    itens:
      - { rotulo: "Cana", rotulo_en: "Sugarcane", valor: 58095, cor: "#86ad5f" }
      - { rotulo: "Vegetação nativa", rotulo_en: "Native vegetation", valor: 53393, cor: "#b3c0ad" }
      - { rotulo: "Mosaico de usos", rotulo_en: "Mosaic of uses", valor: 49922, cor: "#ece3c2" }
      - { rotulo: "Pastagem", rotulo_en: "Pasture", valor: 38376, cor: "#d9c27a" }
      - { rotulo: "Soja e outras temporárias", rotulo_en: "Soybean and other annual crops", valor: 18243, cor: "#c39a4c" }
      - { rotulo: "Silvicultura", rotulo_en: "Tree plantation", valor: 10181, cor: "#7d8a3c" }
      - { rotulo: "Área urbanizada", rotulo_en: "Urban area", valor: 8587, cor: "#8d9196" }
      - { rotulo: "Água", rotulo_en: "Water", valor: 6128, cor: "#b9cfe0" }
      - { rotulo: "Citros, café e outras perenes", rotulo_en: "Citrus, coffee and other perennials", valor: 4852, cor: "#fc8d59" }
      - { rotulo: "Outras áreas sem vegetação", rotulo_en: "Other non-vegetated areas", valor: 441, cor: "#c9b8c4" }
  - tipo: barras
    rotulo: "Maior parte do município em cana"
    rotulo_en: "Largest share of the municipality in sugarcane"
    unidade: "%"
    itens:
      - { rotulo: "Dumont", valor: 79.6, cor: "#86ad5f" }
      - { rotulo: "Guariba", valor: 77.6, cor: "#86ad5f" }
      - { rotulo: "Pontal", valor: 77.3, cor: "#86ad5f" }
      - { rotulo: "Dobrada", valor: 75.8, cor: "#86ad5f" }
      - { rotulo: "Ariranha", valor: 75.0, cor: "#86ad5f" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/agro-sp-2026/sp_uso_agropecuario_2024.gpkg.zip
    rotulo: "Três camadas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Three layers, SIRGAS 2000, with QGIS styles"
    tamanho: "18,6 MB"
  - formato: tif
    url: https://github.com/aikiesan/essencial-geo/releases/download/agro-sp-2026/sp_uso_agropecuario_2024.tif.zip
    rotulo: "Classificação de 2024 em SP (GeoTIFF, 120 m) com estilo .qml"
    rotulo_en: "2024 classification for SP (GeoTIFF, 120 m) with a .qml style"
    tamanho: "3,9 MB"
  - formato: csv
    arquivo: dados/sp_uso_agropecuario_2024.csv
    rotulo: "Área de cada classe por município"
    rotulo_en: "Area of each class by municipality"
    tamanho: "110 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/agro-sp-2026/sp_uso_agropecuario_2024_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/agro-sp-2026/sp_uso_agropecuario_2024_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "3,2 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,6 MB"

doi_automatico: true
versao: "1.0.0"
discussoes: []
---

# Uso e cobertura da terra em São Paulo, 2024: o tabuleiro agrícola

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 045, a primeira de seis da coleção **Do campo ao biometano**: o estado inteiro visto
de cima, antes de seguir cada lavoura até o gás que os seus resíduos dariam.

## O que vem nos arquivos

| Arquivo / camada | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` (GPKG) | polígono | 645 municípios: `CD_MUN`, `NM_MUN`, região intermediária, `area_km2`; para cada classe, `km2_<classe>` e `pct_<classe>` (cana, temporarias, citros, perenes, silvicultura, pastagem, mosaico, nativa, urbano, agua, outras); `pct_agro` (as sete primeiras somadas) e `maior_classe` |
| `regioes_intermediarias` (GPKG) | polígono | 11 regiões geográficas intermediárias |
| `limite_estadual` (GPKG) | polígono | contorno do estado |
| `sp_uso_agropecuario_2024.tif` | grade | classificação do MapBiomas com os códigos originais, 120 m, em WGS 84 (EPSG:4326) como o original, recortada no estado, com o estilo `.qml` da prancha |

O **GPKG** e o **GeoTIFF** vão compactados (ZIP) nos anexos da
[release `agro-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/agro-sp-2026).
A camada `municipios` traz três **estilos do QGIS**: `cana` (o padrão), `temporarias` e
`pastagem`, em parte do município.

O **CSV** traz a tabela dos municípios, em UTF-8, sem geometria.

## Método

1. Mapa de uso e cobertura da terra de 2024 da Coleção 10 do MapBiomas, pixels de 30 m, lido do
   arquivo público do Brasil só nos blocos que cobrem o estado.
2. Os códigos do MapBiomas agrupados em onze classes:
   - **cana** (20);
   - **soja e outras lavouras temporárias** (soja, arroz, algodão e outras temporárias);
   - **laranja e outros citros** (citrus);
   - **café e outras lavouras perenes**;
   - **silvicultura**;
   - **pastagem**;
   - **mosaico de usos**, onde o satélite não separa a lavoura do pasto;
   - **vegetação nativa** (formações florestais, savânicas e campestres, mangue, restinga e áreas
     úmidas);
   - **área urbanizada**;
   - **água**;
   - **mineração e outras áreas sem vegetação**, com praias, dunas e usinas fotovoltaicas.
3. Área de cada classe por município contada nos pixels de 30 m, com a área de cada pixel no
   elipsoide GRS80. O total dá 248.217 km²; ficam de fora 2,6 km² de pixels sem classe no litoral.
4. O mapa e o GeoTIFF usam a classe mais frequente em cada bloco de 4 × 4 pixels (120 m). Por isso
   lavouras pequenas, como o café em encosta, aparecem menos no mapa do que nas contas.

## Limitações

- É uma classificação automática de imagens de satélite, com erros que variam de classe para
  classe; o MapBiomas publica a acurácia de cada uma.
- O mosaico de usos, 20% do estado, junta lavoura e pasto que o satélite não separa; os 72%
  agropecuários incluem esse mosaico.
- Uma área com duas safras no ano aparece uma vez só, com a classe que o MapBiomas atribuiu a 2024.
- A área colhida da PAM (pranchas seguintes) e a área mapeada pelo MapBiomas medem coisas
  diferentes e não precisam bater.

## Licença dos dados

Dados do MapBiomas sob licença CC BY 4.0; cite «Projeto MapBiomas — Coleção 10 da Série Anual de
Mapas de Uso e Cobertura da Terra do Brasil». Malha municipal do IBGE, de uso livre com citação da
fonte.
