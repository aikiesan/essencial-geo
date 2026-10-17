---
numero: 31
titulo: "Usinas e cana"
subtitulo: "A colheita que acende a rede"
data: 2026-11-05
categoria: energia
colecao: bioenergia-sp
tags: [bioenergia-sp, sao-paulo, cana-de-acucar, bagaco, cogeracao, termeletricas, aneel, ibge, pam]

contexto: >-
  Depois da moagem, o bagaço da cana vai para a caldeira, e o vapor gera a eletricidade da própria usina e a que sobra para a rede. Em São Paulo, 211 termelétricas a bagaço estão registradas na ANEEL, 206 delas em operação, com 6,18 GW de potência outorgada; a maior, Barra Bioenergia, em Barra Bonita, tem 136 MW. Sobre o mapa da cana colhida em 2024, os círculos mostram que a energia nasce onde a lavoura está: os 140 municípios com ao menos uma dessas usinas responderam por 48,8% da cana colhida no estado. É ali, entre o canavial e a subestação, que o resíduo vira rede. Última prancha da coleção «Bioenergia em SP».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com os municípios coloridos pela produção de cana em 2024, numa rampa clara do creme ao verde-oliva, e círculos cor de argila, proporcionais à potência, marcando 211 termelétricas a bagaço de cana; as cinco em construção aparecem vazadas. Os círculos cobrem o norte, o centro e o oeste do estado, onde a cana é mais densa, e rareiam no leste, no Vale do Ribeira e na Grande São Paulo. Uma chamada com seta destaca a maior usina, Barra Bioenergia (136 MW)."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "ANEEL — Sistema de Informações de Geração (SIGA), na versão da base de infraestrutura do MapBiomas"
    nome_en: "ANEEL — Generation Information System (SIGA), as published in the MapBiomas infrastructure database"
    url: https://dadosabertos.aneel.gov.br/dataset/6d90b77c-c5f5-4d81-bdec-7bc619494bb9
    ano: 2022
  - nome: "IBGE — Produção Agrícola Municipal (PAM), tabela 1612"
    nome_en: "IBGE — Municipal Agricultural Production (PAM), table 1612"
    url: https://sidra.ibge.gov.br/tabela/1612
    ano: 2024
  - nome: "EPE — WebMap: usinas de etanol e açúcar (camada extra do GPKG)"
    nome_en: "EPE — WebMap: ethanol and sugar mills (extra GPKG layer)"
    url: https://gisepeprd2.epe.gov.br/WebMapEPE/
    ano: 2018
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Termelétricas a bagaço do SIGA, por potência outorgada, sobre a produção de cana da PAM 2024 por município, em seis classes por quantis."

camadas:
  - { nome: ute_bagaco, tipo: ponto, cor: "#9c4a32", descricao: "211 termelétricas a bagaço de cana: fase, potência (kW), início de operação", descricao_en: "211 sugarcane-bagasse power stations: phase, capacity (kW), start of operations" }
  - { nome: usinas_epe_2018, tipo: ponto, cor: "#1a1c1e", descricao: "161 usinas sucroenergéticas do WebMap EPE 2018: tipo, classe de moagem, capacidade de etanol", descricao_en: "161 sugar-energy mills from the EPE WebMap 2018: type, crushing class, ethanol capacity" }
  - { nome: municipios, tipo: poligono, cor: "#9cad69", descricao: "645 municípios: produção de cana (t), número e potência das termelétricas", descricao_en: "645 municipalities: cane production (t), number and capacity of power stations" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Potência a bagaço em operação"
    rotulo_en: "Bagasse capacity in operation"
    valor: 6179
    unidade: "MW"
    nota: "206 usinas em operação e 5 em construção"
    nota_en: "206 stations in operation and 5 being built"
  - tipo: barras
    rotulo: "Maiores termelétricas a bagaço"
    rotulo_en: "Largest bagasse power stations"
    unidade: "MW"
    itens:
      - { rotulo: "Barra Bioenergia", valor: 136.0, cor: "#9c4a32" }
      - { rotulo: "Cocal II", valor: 131.3, cor: "#9c4a32" }
      - { rotulo: "Bonfim", valor: 111.0, cor: "#9c4a32" }
      - { rotulo: "Conquista do Pontal", valor: 110.0, cor: "#9c4a32" }
      - { rotulo: "Vale do Rosário", valor: 97.0, cor: "#9c4a32" }
  - tipo: numero
    rotulo: "Cana em municípios com usina"
    rotulo_en: "Cane in municipalities with a station"
    valor: 48.8
    unidade: "%"
    nota: "140 municípios com ao menos uma termelétrica a bagaço"
    nota_en: "140 municipalities with at least one bagasse power station"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-sp-2026/sp_usinas_cana.gpkg.zip
    rotulo: "Cinco camadas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Five layers, SIRGAS 2000, with QGIS styles"
    tamanho: "18,5 MB"
  - formato: csv
    arquivo: dados/sp_usinas_cana.csv
    rotulo: "As 211 termelétricas, com coordenadas"
    rotulo_en: "All 211 power stations, with coordinates"
    tamanho: "34 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-sp-2026/sp_usinas_cana_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-sp-2026/sp_usinas_cana_prancha.en.svg
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

# Usinas e cana — termelétricas a bagaço sobre a produção de cana em São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 031, a última de quatro da coleção **Bioenergia em SP**: depois do biogás, dos
rebanhos e da cana, onde o resíduo do canavial vira eletricidade.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `ute_bagaco` | ponto | 211 termelétricas a bagaço do SIGA: `nome`, `ceg`, `fase`, `potencia_kw` (outorgada), `potencia_fiscalizada_kw`, `inicio_operacao`, `proprietario`, município |
| `usinas_epe_2018` | ponto | 161 usinas do WebMap EPE: `tipo`, `situacao`, `classe_moagem_t_safra`, `etanol_anidro_m3_dia`, `etanol_hidratado_m3_dia`, `inicio`, município |
| `municipios` | polígono | 645 municípios: `producao_t` (cana, PAM 2024), `ute_bagaco_n` e `ute_bagaco_kw` |
| `regioes_intermediarias` | polígono | 11 regiões geográficas intermediárias |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `bioenergia-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/bioenergia-sp-2026).
Os **estilos do QGIS** repetem a prancha: municípios na rampa clara da produção, termelétricas
como círculos proporcionais à potência (vazados quando em construção). A camada da EPE vem com
cruzes pequenas, para conferir quais usinas sucroenergéticas não têm termelétrica registrada.

O **CSV** traz as 211 termelétricas, com longitude e latitude em graus decimais, em UTF-8.

## Método

1. Termelétricas do SIGA (ANEEL) com combustível *Bagaço de Cana de Açúcar* em São Paulo, na
   versão publicada pelo MapBiomas; potência outorgada em kW.
2. Produção de cana-de-açúcar por município da tabela 1612 da PAM (2024), juntada à Malha
   Municipal 2025 do IBGE pelo código de sete dígitos; seis classes por quantis dos municípios
   com produção, limites arredondados a dois algarismos significativos.
3. Cada termelétrica recebe o município onde cai, por junção espacial. A parte da cana em
   municípios com usina é a soma da produção desses municípios dividida pelo total do estado.
4. Usinas sucroenergéticas do WebMap EPE (2018), também via MapBiomas, recortadas por São Paulo.

## Limitações

- A potência outorgada é a autorizada, não a gerada; a ANEEL não informa, nesta base, quanto
  cada usina exporta para a rede.
- A cana não respeita limite municipal: uma usina mói cana de vários municípios vizinhos, e a
  proporção de 48,8% não diz de onde vem a cana de cada uma.
- O SIGA desta versão vai até junho de 2022; a camada da EPE é de 2018. As duas não têm
  identificador comum.
- Ninguém aqui calcula bagaço disponível: isso exigiria coeficientes que não estão nas tabelas.
