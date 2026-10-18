---
numero: 46
titulo: "Cana: 2008 × 2024"
subtitulo: "Em dezesseis anos, a mancha andou para o oeste"
data: 2026-11-06
categoria: uso-do-solo
colecao: agro-sp
tags: [agro-sp, sao-paulo, cana-de-acucar, agricultura, serie-historica, ibge, pam]

contexto: >-
  Em 2008, os canaviais paulistas colheram 4,53 milhões de hectares; em 2024, 5,40 milhões, 19% a mais, e a cana passou de 18,3% para 21,7% do território do estado. A área colhida chegou ao máximo em 2017, com 5,69 milhões de hectares, e desde então recua devagar. A prancha põe os dois anos lado a lado, com as mesmas classes, e mostra a diferença: 150 municípios ganharam mais de 10 pontos percentuais de território em cana, 104 deles nas regiões de São José do Rio Preto, Araçatuba e Presidente Prudente, no oeste; Rancharia colheu 47.812 hectares a mais. A região de Campinas foi a única a perder muito: 63.632 hectares a menos, com as maiores quedas em Nova Odessa e Sumaré. Segunda prancha da coleção «Do campo ao biometano».

imagem: ./mapa_preview.png
imagem_alt: "Três mapas do estado de São Paulo e um quadro de notas. Os dois de cima mostram, em 2008 e em 2024, a parte do território de cada município colhida com cana, em seis classes do creme ao verde-escuro (até 5%, 5 a 15%, 15 a 30%, 30 a 45%, 45 a 60% e mais de 60%). Em 2008, o verde-escuro se concentra no nordeste do estado; em 2024, a mancha média se espalha também pelo oeste e pelo noroeste. O terceiro mapa mostra a diferença em pontos percentuais, do marrom (perda de mais de 10 pontos) ao verde-azulado (ganho de mais de 20): o oeste e o noroeste ficam verdes, e manchas marrons aparecem no centro e em volta de Campinas. Estão nomeados Balbinos e São João do Pau d’Alho, os maiores ganhos, e Nova Odessa, a maior perda."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Produção Agrícola Municipal (PAM), tabela 1612: lavouras temporárias"
    nome_en: "IBGE — Municipal Agricultural Production (PAM), table 1612: temporary crops"
    url: https://sidra.ibge.gov.br/tabela/1612
    ano: "2008 a 2024"
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Área colhida de cana da PAM em 2008 e em 2024 dividida pela área do município, nas mesmas seis classes nos dois anos; a diferença é dada em pontos percentuais do território."

camadas:
  - { nome: municipios, tipo: poligono, descricao: "645 municípios: área colhida e produção de cana em 2008 e 2024, parte do território em cada ano (%) e diferença (p.p.)", descricao_en: "645 municipalities: harvested area and production of cane in 2008 and 2024, share of territory in each year (%) and change (p.p.)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Área colhida em 2024"
    rotulo_en: "Harvested area in 2024"
    valor: 5398676
    unidade: "ha"
    nota: "Eram 4.530.784 ha em 2008: 19% a mais em dezesseis anos"
    nota_en: "It was 4,530,784 ha in 2008: 19% more in sixteen years"
  - tipo: numero
    rotulo: "Municípios que ganharam mais de 10 p.p."
    rotulo_en: "Municipalities that gained over 10 p.p."
    valor: 150
    nota: "Outros 52 perderam mais de 10 pontos percentuais do território em cana"
    nota_en: "Another 52 lost more than 10 percentage points of territory under cane"
  - tipo: barras
    rotulo: "Maiores ganhos de área colhida, 2008–2024"
    rotulo_en: "Largest gains in harvested area, 2008–2024"
    unidade: "ha"
    itens:
      - { rotulo: "Rancharia", valor: 47812, cor: "#2b6233" }
      - { rotulo: "Cafelândia", valor: 31118, cor: "#2b6233" }
      - { rotulo: "José Bonifácio", valor: 28000, cor: "#2b6233" }
      - { rotulo: "Martinópolis", valor: 25500, cor: "#2b6233" }
      - { rotulo: "Mirandópolis", valor: 23000, cor: "#2b6233" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/agro-sp-2026/sp_cana_2008_2024.gpkg.zip
    rotulo: "Três camadas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Three layers, SIRGAS 2000, with QGIS styles"
    tamanho: "18,5 MB"
  - formato: csv
    arquivo: dados/sp_cana_2008_2024.csv
    rotulo: "Área colhida, produção e parte do território por município, 2008 e 2024"
    rotulo_en: "Harvested area, production and share of territory by municipality, 2008 and 2024"
    tamanho: "59 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/agro-sp-2026/sp_cana_2008_2024_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/agro-sp-2026/sp_cana_2008_2024_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "5,8 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

versao: "1.0.0"
discussoes: []
---

# Cana-de-açúcar em São Paulo, 2008 e 2024

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 046, a segunda de seis da coleção **Do campo ao biometano**: antes de medir o gás que
os resíduos dariam, ver como a lavoura que mais deixa resíduo se moveu pelo estado.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `CD_MUN`, `NM_MUN`, região intermediária, `area_km2`, `area_2008_ha`, `area_2024_ha`, `producao_2008_t`, `producao_2024_t`, `pct_2008` e `pct_2024` (área colhida ÷ área do município, em %) e `var_pp` (diferença, em pontos percentuais) |
| `regioes_intermediarias` | polígono | 11 regiões geográficas intermediárias |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `agro-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/agro-sp-2026)
do repositório, junto com os das outras pranchas da coleção.

A camada `municipios` traz três **estilos do QGIS**: `parte_2024` (o padrão), `parte_2008` e
`variacao`. Para trocar, abra as propriedades da camada e escolha o estilo em *Estilo › Estilos*.

O **CSV** traz a mesma tabela, em UTF-8, sem geometria. Célula vazia quer dizer sem informação;
0 quer dizer zero declarado pelo IBGE.

## Método

1. Tabela 1612 da Produção Agrícola Municipal no SIDRA: *Área colhida* (hectares) e *Quantidade
   produzida* (toneladas), produto *Cana-de-açúcar*, anos 2008 a 2024, nível município, estado
   de São Paulo.
2. Junção à Malha Municipal 2025 do IBGE pelo código de sete dígitos. O estado tem os mesmos
   645 municípios nos dois anos.
3. Parte do território = área colhida ÷ (área oficial do município × 100), em %. Classes fixas,
   iguais nos dois mapas: até 5%, 5 a 15%, 15 a 30%, 30 a 45%, 45 a 60% e acima de 60%.
4. Diferença = parte em 2024 − parte em 2008, em pontos percentuais, em seis classes: perda de
   mais de 10, perda de 3 a 10, estável (±3), ganho de 3 a 10, de 10 a 20 e de mais de 20.
5. As colunas do painel somam a área colhida do estado ano a ano, de 2008 a 2024.

## Limitações

- Área colhida não é área plantada: canaviais em reforma ou não cortados no ano ficam de fora.
- Usa-se a área do município de 2025 nos dois anos; mudanças de limite entre municípios desde
  2008 não são corrigidas.
- 53 municípios ficam sem informação em 2008 e 45 em 2024, a maioria na Grande São Paulo e na
  Baixada Santista; a diferença só é calculada onde há os dois anos.
- Em municípios pequenos, poucos milhares de hectares mudam muitos pontos percentuais. Por isso
  o painel mostra os maiores ganhos em pontos, e a ficha, os maiores em hectares.
- A prancha não diz o que havia antes da cana nem o que veio depois dela; para isso, é preciso
  um mapa de uso e cobertura da terra.

## Licença dos dados

Dados abertos do IBGE, de uso livre com citação da fonte.
