---
numero: 28
titulo: "Usinas de biogás"
subtitulo: "Onde o lixo e o esterco viram luz"
data: 2026-10-27
categoria: energia
colecao: bioenergia-sp
tags: [bioenergia-sp, sao-paulo, biogas, aterro-sanitario, residuos, energia, aneel, mapbiomas]

contexto: >-
  No alto de um aterro em Caieiras, na Grande São Paulo, o gás que sobe do lixo move a maior termelétrica a biogás do estado: 29,5 MW de potência outorgada. Ela é uma das 13 termelétricas a biogás registradas na ANEEL em São Paulo, que somam 108,2 MW. O MapBiomas mapeia outras formas de aproveitar o mesmo gás: 51 usinas no estado, 44 em operação, que queimam esterco de granjas, efluentes de indústrias e o que sai de aterros e estações de esgoto para gerar eletricidade, calor ou biometano. No mapa, elas se juntam em volta da capital e ao longo dos polos agroindustriais do interior. Primeira prancha da coleção «Bioenergia em SP», que segue o resíduo até a energia.

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo, com os municípios em cinza-claro e os limites das regiões intermediárias. Pontos coloridos marcam 51 usinas de biogás: verde-mata para a agropecuária, ameixa para a indústria e azul-profundo para aterros e esgoto, com tamanho pelo porte e vazados quando fora de operação. Anéis cor de argila, proporcionais à potência, marcam as 13 termelétricas a biogás registradas na ANEEL; a maior, Termoverde Caieiras, recebe uma chamada com seta. As usinas se concentram em volta da cidade de São Paulo e no centro-norte do estado."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "MapBiomas — base de infraestrutura: usinas de biogás"
    nome_en: "MapBiomas — infrastructure database: biogas plants"
    url: https://mapbiomas.org/
  - nome: "ANEEL — Sistema de Informações de Geração (SIGA), na versão da base de infraestrutura do MapBiomas"
    nome_en: "ANEEL — Generation Information System (SIGA), as published in the MapBiomas infrastructure database"
    url: https://dadosabertos.aneel.gov.br/dataset/6d90b77c-c5f5-4d81-bdec-7bc619494bb9
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Usinas de biogás do MapBiomas e termelétricas a biogás do SIGA recortadas pelo limite de São Paulo e atribuídas ao município por junção espacial."

camadas:
  - { nome: usinas_biogas, tipo: ponto, cor: "#2f5d3a", descricao: "51 usinas de biogás: categoria, uso principal, situação, porte e início de operação", descricao_en: "51 biogas plants: category, main use, status, scale and start of operations" }
  - { nome: ute_biogas, tipo: ponto, cor: "#9c4a32", descricao: "13 termelétricas a biogás registradas na ANEEL, com potência (kW)", descricao_en: "13 biogas power stations registered with ANEEL, with capacity (kW)" }
  - { nome: municipios, tipo: poligono, descricao: "645 municípios, com o número de usinas e a potência a biogás", descricao_en: "645 municipalities, with the number of plants and biogas capacity" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: barras
    rotulo: "Usinas de biogás por origem do resíduo"
    rotulo_en: "Biogas plants by waste source"
    unidade: "usinas"
    unidade_en: "plants"
    itens:
      - { rotulo: "Agropecuária", rotulo_en: "Farming", valor: 24, cor: "#2f5d3a" }
      - { rotulo: "Indústria", rotulo_en: "Industry", valor: 14, cor: "#6b3d5c" }
      - { rotulo: "Aterro ou esgoto", rotulo_en: "Landfill or sewage", valor: 13, cor: "#234e70" }
  - tipo: numero
    rotulo: "Termelétricas a biogás (ANEEL)"
    rotulo_en: "Biogas power stations (ANEEL)"
    valor: 108.2
    unidade: "MW"
    nota: "13 usinas; a maior é Termoverde Caieiras (29,5 MW)"
    nota_en: "13 stations; the largest is Termoverde Caieiras (29.5 MW)"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-sp-2026/sp_usinas_biogas.gpkg.zip
    rotulo: "Cinco camadas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Five layers, SIRGAS 2000, with QGIS styles"
    tamanho: "18,5 MB"
  - formato: csv
    arquivo: dados/sp_usinas_biogas.csv
    rotulo: "As 64 usinas, com coordenadas"
    rotulo_en: "All 64 plants, with coordinates"
    tamanho: "10 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-sp-2026/sp_usinas_biogas_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-sp-2026/sp_usinas_biogas_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,2 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

versao: "1.0.0"
discussoes: []
---

# Usinas de biogás no estado de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 028, a primeira de quatro da coleção **Bioenergia em SP**: onde o biogás já é
aproveitado. As próximas mostram de onde vem a matéria-prima — rebanhos e cana — e onde o
bagaço vira eletricidade.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `usinas_biogas` | ponto | 51 usinas do MapBiomas: `categoria` (agropecuária, indústria, aterro ou esgoto), `uso_principal`, usos de energia (`energia_eletrica`, `energia_termica`, `energia_mecanica`, `biometano`), `situacao`, `porte`, `inicio_operacao`, município |
| `ute_biogas` | ponto | 13 termelétricas a biogás do SIGA: `nome`, `ceg`, `combustivel`, `fase`, `potencia_kw` (outorgada), `potencia_fiscalizada_kw`, `inicio_operacao`, `proprietario`, município |
| `municipios` | polígono | 645 municípios: `usinas_biogas` (número) e `ute_biogas_kw` (potência somada) |
| `regioes_intermediarias` | polígono | 11 regiões geográficas intermediárias |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `bioenergia-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/bioenergia-sp-2026).
Ele traz os **estilos do QGIS**: as usinas com a cor da categoria e o tamanho do porte (vazadas
quando fora de operação), e as termelétricas como anéis proporcionais à potência, com o nome.

O **CSV** junta as duas camadas de pontos (coluna `camada`), com longitude e latitude em graus
decimais, em UTF-8.

## Método

1. Usinas de biogás da base de infraestrutura do MapBiomas, filtradas pelo campo de estado (SP).
   A camada não informa a produção de biogás (o campo vem zerado em todas as usinas), por isso o
   tamanho do ponto segue o **porte** declarado.
2. Termelétricas do SIGA (ANEEL) com combustível de biogás — *Biogás – RU*, *Biogás-AGR* e
   *Biogás – Floresta* —, na versão publicada pelo MapBiomas. A potência é a outorgada, em kW.
3. Cada ponto recebe o código do município onde cai, por junção espacial com a Malha Municipal
   2025 do IBGE.
4. Na prancha, os anéis têm área proporcional à potência; as duas camadas aparecem juntas porque
   uma mesma usina pode estar nas duas bases.

## Limitações

- As duas bases não têm um identificador comum: não dá para afirmar quais usinas do MapBiomas
  correspondem a quais termelétricas da ANEEL, e somar as duas contagens duplicaria parte delas.
- A camada do MapBiomas registra início de operação até outubro de 2019; a do SIGA, até junho de
  2022. Usinas mais novas não aparecem. A versão atual do SIGA, nos dados abertos da ANEEL, permite
  atualizar a camada `ute_biogas`.
- Usinas que só queimam o biogás em flare, sem aproveitamento energético, não entram em nenhuma
  das bases.
