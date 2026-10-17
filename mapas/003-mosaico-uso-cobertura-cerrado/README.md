---
numero: 3
titulo: "Mosaico de uso e cobertura do solo"
subtitulo: "Uma paisagem-tipo do Cerrado: veredas, pastos e pivôs"
data: 2026-10-14
categoria: uso-do-solo
tags: [cerrado, uso-do-solo, cobertura, pivo-central, prancha-modelo]
exemplo: true

contexto: >-
  No Cerrado, a água desenha a paisagem antes de qualquer cerca: matas de galeria
  acompanham os rios como um contorno escuro, e é longe deles que avançam as
  pastagens e as lavouras — às vezes em círculos perfeitos, a assinatura dos pivôs
  centrais vista do alto. Esta paisagem-tipo é sintética, mas usa a gramática das
  classificações de cobertura do solo, como a do MapBiomas, e as cores minerais que
  o atlas adotará para elas. O mosaico de polígonos lembra que todo mapa de uso do
  solo é, antes, uma decisão sobre onde termina uma coisa e começa outra.

imagem: ./mapa_preview.png
imagem_alt: "Mosaico de polígonos coloridos: um rio sinuoso cercado por mata de galeria verde-escura atravessa a prancha; ao redor, manchas de savana, pastagem, lavoura cor de argila com círculos de pivôs centrais e uma pequena área urbana cinza."

recorte: "Paisagem fictícia do Cerrado (dados sintéticos)"
fontes:
  - nome: "Dados sintéticos — Essencial Geo (scripts/gerar-exemplos.mjs)"
    nome_en: "Synthetic data — Essencial Geo (scripts/gerar-exemplos.mjs)"
    url: https://github.com/aikiesan/essencial-geo/blob/main/scripts/gerar-exemplos.mjs
    ano: 2026
  - nome: "Modelo de referência: MapBiomas — Coleção de cobertura e uso"
    nome_en: "Reference model: MapBiomas — Land cover and use collection"
    url: https://mapbiomas.org/
crs: "SIRGAS 2000 / UTM zona 23S"
epsg: 31983
escala: "1:50.000"
software: ["Node.js", "d3-delaunay"]
metodo: "Polígonos de Voronoi classificados por três campos de ruído e pela distância ao rio."

camadas:
  - { nome: USO_FLORESTAL, tipo: poligono, cor: "#2e5a3c", descricao: "Formação florestal (mata de galeria)", descricao_en: "Forest formation (gallery forest)" }
  - { nome: USO_SAVANICA, tipo: poligono, cor: "#7f9a52", descricao: "Formação savânica", descricao_en: "Savanna formation" }
  - { nome: USO_CAMPESTRE, tipo: poligono, cor: "#cfc78e", descricao: "Formação campestre", descricao_en: "Grassland formation" }
  - { nome: USO_PASTAGEM, tipo: poligono, cor: "#e2c48a", descricao: "Pastagem", descricao_en: "Pasture" }
  - { nome: USO_AGRICULTURA, tipo: poligono, cor: "#c07a45", descricao: "Agricultura temporária", descricao_en: "Temporary crops" }
  - { nome: USO_SILVICULTURA, tipo: poligono, cor: "#6b5577", descricao: "Silvicultura", descricao_en: "Forestry plantation" }
  - { nome: USO_URBANO, tipo: poligono, cor: "#4a4540", descricao: "Área urbanizada", descricao_en: "Urban area" }
  - { nome: PIVOS, tipo: poligono, cor: "#d99a5c", descricao: "Pivôs centrais de irrigação", descricao_en: "Centre-pivot irrigation" }
  - { nome: HIDROGRAFIA, tipo: linha, cor: "#1f3a5f", descricao: "Eixo do rio", descricao_en: "River centreline" }

indicadores:
  - tipo: proporcao
    rotulo: "Cobertura e uso"
    rotulo_en: "Land cover and use"
    unidade: "% da área"
    unidade_en: "% of area"
    itens:
      - { rotulo: "Agricultura temporária", rotulo_en: "Temporary crops", valor: 9630.0, cor: "#c07a45" }
      - { rotulo: "Formação savânica", rotulo_en: "Savanna formation", valor: 7216.4, cor: "#7f9a52" }
      - { rotulo: "Pastagem", rotulo_en: "Pasture", valor: 5133.7, cor: "#e2c48a" }
      - { rotulo: "Formação florestal", rotulo_en: "Forest formation", valor: 2355.9, cor: "#2e5a3c" }
      - { rotulo: "Formação campestre", rotulo_en: "Grassland formation", valor: 1860.4, cor: "#cfc78e" }
      - { rotulo: "Área urbanizada", rotulo_en: "Urban area", valor: 665.2, cor: "#4a4540" }
      - { rotulo: "Silvicultura", rotulo_en: "Forestry plantation", valor: 428.1, cor: "#6b5577" }
  - tipo: numero
    rotulo: "Área classificada"
    rotulo_en: "Classified area"
    valor: 27290
    unidade: "ha"
    nota: "16 pivôs centrais sobre manchas agrícolas"
    nota_en: "16 centre pivots over cropland patches"

downloads:
  - formato: dxf
    arquivo: dados/uso_solo_sintetico.dxf
    rotulo: "Classes por camada"
    rotulo_en: "One layer per class"
    tamanho: "1,6 MB"
  - formato: csv
    arquivo: dados/uso_solo_areas.csv
    rotulo: "Áreas por classe (ha)"
    rotulo_en: "Area per class (ha)"
    tamanho: "1 kB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,4 MB"

versao: "0.1.0"
discussoes: []
---

# Mosaico de uso e cobertura do solo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

> **Prancha-modelo.** A paisagem é sintética e não representa nenhum lugar real.

## Método

1. Cerca de 3.000 pontos com perturbação aleatória geram um mosaico de Voronoi.
2. Cada célula recebe uma classe a partir de três campos de ruído (umidade, aptidão
   agrícola, manchas de silvicultura) e da distância a um rio sinuoso — perto da água,
   a classe é sempre formação florestal (mata de galeria).
3. Pivôs centrais são sorteados apenas sobre manchas agrícolas, sem sobreposição.

## Paleta

| Classe | Cor |
| --- | --- |
| Formação florestal | `#2e5a3c` |
| Formação savânica | `#7f9a52` |
| Formação campestre | `#cfc78e` |
| Pastagem | `#e2c48a` |
| Agricultura temporária | `#c07a45` |
| Silvicultura | `#6b5577` |
| Área urbanizada | `#4a4540` |
| Corpo d’água | `#1f3a5f` |

## Arquivos

O DXF traz uma camada por classe (`USO_FLORESTAL`, `USO_PASTAGEM`…), além de `PIVOS`
e `HIDROGRAFIA` — basta congelar camadas no CAD para isolar uma classe.
