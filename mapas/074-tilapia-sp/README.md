---
numero: 74
titulo: "Tilápia"
subtitulo: "Quase todo peixe criado no estado é tilápia"
data: 2026-12-04
categoria: uso-do-solo
colecao: animal-sp
tags: [animal-sp, sao-paulo, tilapia, aquicultura, piscicultura, represas, mapbiomas, ibge, ppm]

contexto: >-
  São Paulo criou 67 mil toneladas de tilápia em 2024, 2,8 vezes o volume de 2013, primeiro ano da série de aquicultura da Pesquisa da Pecuária Municipal. A tilápia é 95% de todo o peixe criado no estado. O Brasil cresceu ainda mais, de 169 para 499 mil toneladas, e a parte paulista ficou em 13,4%. A criação é concentrada: 134 municípios declaram produção, e os dez maiores fazem 72%. Os maiores ficam à beira das represas dos rios Grande e Paraná. Rifaina, na divisa com Minas Gerais, lidera com 10 mil toneladas, seguida de Rubinéia, Santa Clara d'Oeste, Panorama e Riolândia. A região de São José do Rio Preto, no noroeste, faz sozinha 42% do total. No mapa, a água do MapBiomas mostra os rios e as represas, e as listras marcam os 476 municípios sem produção informada. Quarta prancha da coleção «Leite, ovos, mel e peixe».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com os municípios coloridos pela produção de tilápia em 2024, em seis classes do azul muito claro ao azul-petróleo escuro (até 3,1 toneladas, até 10, 22, 73, 360 e de 360 a 10 mil toneladas), sobre um fundo listrado: a maior parte do estado não aparece na tabela do IBGE. Rios e represas do MapBiomas, em azul, desenham o Tietê, o Paranapanema e as represas das divisas. Os tons mais escuros ficam na borda noroeste, ao longo do Paraná e do Grande, de Panorama a Rubinéia, Santa Clara d'Oeste e Riolândia, e na ponta norte, em Rifaina; há manchas médias no leste e no sul. Chamada: Rifaina, 10 mil toneladas, o maior produtor de tilápia do estado em 2024. No painel, colunas da produção paulista de 2013 a 2024, de 24 para 67 mil toneladas, e os cinco maiores produtores."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Pesquisa da Pecuária Municipal (PPM), tabela 3940: produção da aquicultura"
    nome_en: "IBGE — Municipal Livestock Survey (PPM), table 3940: aquaculture production"
    url: https://sidra.ibge.gov.br/tabela/3940
    ano: "2013 a 2024"
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
software: ["Python", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Produção de tilápia da PPM 2024 por município em seis classes por quantis; série estadual de 2013 a 2024; rios, lagos e represas das classes de água do MapBiomas 2024 sobre o mapa."

camadas:
  - { nome: municipios, tipo: poligono, descricao: "645 municípios: produção de tilápia em 2013 e 2024 (kg) e situação do dado em 2024", descricao_en: "645 municipalities: tilapia production in 2013 and 2024 (kg) and data status in 2024" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Tilápia em 2024"
    rotulo_en: "Tilapia in 2024"
    valor: 67058737
    unidade: "kg"
    nota: "Em 2013 foram 24.329.347 kg; a parte do Brasil passou de 14,4% para 13,4%"
    nota_en: "In 2013 it was 24,329,347 kg; the share of Brazil went from 14.4% to 13.4%"
  - tipo: numero
    rotulo: "Parte da tilápia no peixe criado em SP"
    rotulo_en: "Tilapia’s share of farmed fish in SP"
    valor: 95.1
    unidade: "%"
    nota: "De 70.548.417 kg de peixes de todas as espécies em 2024"
    nota_en: "Out of 70,548,417 kg of fish of all species in 2024"
  - tipo: barras
    rotulo: "Maiores produtores em 2024"
    rotulo_en: "Largest producers in 2024"
    unidade: "kg"
    itens:
      - { rotulo: "Rifaina", valor: 10000000, cor: "#2b7a8f" }
      - { rotulo: "Rubinéia", valor: 8718900, cor: "#2b7a8f" }
      - { rotulo: "Santa Clara d'Oeste", valor: 6250000, cor: "#2b7a8f" }
      - { rotulo: "Panorama", valor: 4500000, cor: "#2b7a8f" }
      - { rotulo: "Riolândia", valor: 4379950, cor: "#2b7a8f" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/animal-sp-2026/sp_tilapia_2024.gpkg.zip
    rotulo: "Três camadas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Three layers, SIRGAS 2000, with QGIS styles"
    tamanho: "18,5 MB"
  - formato: csv
    arquivo: dados/sp_tilapia_2024.csv
    rotulo: "Tilápia em 2013 e 2024 por município"
    rotulo_en: "Tilapia in 2013 and 2024 by municipality"
    tamanho: "37 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/animal-sp-2026/sp_tilapia_2024_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/animal-sp-2026/sp_tilapia_2024_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,3 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

versao: "1.0.0"
discussoes: []
---

# Tilápia em São Paulo, 2024

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 074, a quarta de cinco da coleção **Leite, ovos, mel e peixe**: o peixe das represas,
criado em poucos municípios e quase sempre à beira d'água.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `CD_MUN`, `NM_MUN`, região intermediária, `producao_2013` e `producao_2024` (kg de tilápia) e `situacao_2024` (`valor`, `zero`, `nao_disponivel` ou `fora_da_tabela`) |
| `regioes_intermediarias` | polígono | 11 regiões geográficas intermediárias |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `animal-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/animal-sp-2026).
A camada `municipios` já abre no QGIS com as classes da prancha (estilo `producao`). A água do
MapBiomas não vem no GPKG; o raster de 2024 recortado para o estado está na prancha 045.

O **CSV** traz a tabela dos municípios, em UTF-8, sem geometria. Célula vazia quer dizer sem
informação; 0 quer dizer zero.

## Método

1. Tabela 3940 da Pesquisa da Pecuária Municipal no SIDRA: *Produção da aquicultura*, produto
   *Tilápia* (quilogramas), anos 2013 a 2024, nível município, estado de São Paulo. O total do
   Brasil, para a parte paulista, soma todos os municípios do país na mesma tabela.
2. Peixe criado no estado = soma das espécies de peixe da tabela em 2024 (70.548.417 kg), sem
   camarão nem ostras.
3. Produção de 2024 em seis classes por quantis dos municípios com produção positiva, com limites
   arredondados a dois algarismos significativos.
4. Situação do dado: `zero` onde o IBGE publica um traço (35 municípios); `nao_disponivel` onde
   publica «X» ou «...» (91); `fora_da_tabela` onde o município não aparece (385). A prancha
   lista os dois últimos juntos.
5. Água: classes *rio, lago e oceano* (33) e *aquicultura* (31) do MapBiomas Coleção 10, 2024,
   sobre o mapa, a partir do mesmo recorte de 120 m da prancha 045.

## Limitações

- A tabela 3940 só traz municípios em que o IBGE registrou aquicultura; os ausentes não são
  necessariamente zero.
- A PPM é uma estimativa municipal feita com informantes locais; valores redondos, como os
  10.000.000 kg de Rifaina, indicam estimativa, não pesagem.
- A produção é atribuída ao município, não à represa: tanques numa margem podem estar registrados
  no município vizinho.

## Licença dos dados

Dados abertos do IBGE, de uso livre com citação da fonte. MapBiomas: CC BY 4.0, «Projeto
MapBiomas — Coleção 10 da Série Anual de Mapas de Uso e Cobertura da Terra do Brasil».
