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
    url: https://github.com/aikiesan/essencial-geo/blob/main/scripts/gerar-exemplos.mjs
    ano: 2026
  - nome: "Modelo de referência: MapBiomas — Coleção de cobertura e uso"
    url: https://mapbiomas.org/
crs: "SIRGAS 2000 / UTM zona 23S"
epsg: 31983
escala: "1:50.000"
software: ["Node.js", "d3-delaunay"]
metodo: "Polígonos de Voronoi classificados por três campos de ruído e pela distância ao rio."

downloads:
  - formato: dxf
    arquivo: dados/uso_solo_sintetico.dxf
    rotulo: "Classes por camada"
    tamanho: "1,6 MB"
  - formato: csv
    arquivo: dados/uso_solo_areas.csv
    rotulo: "Áreas por classe (ha)"
    tamanho: "1 kB"
  - formato: png
    arquivo: mapa_preview.png
    rotulo: "Prancha (PNG 2400 px)"
    tamanho: "0,4 MB"

versao: "0.1.0"
discussoes: []
---

# Mosaico de uso e cobertura do solo

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
