---
numero: 4
titulo: "Figura-fundo da malha urbana"
subtitulo: "Cheios e vazios de uma cidade que cresceu em dois tempos"
data: 2026-10-16
categoria: infraestrutura-dxf
tags: [figura-fundo, nolli, malha-urbana, dxf, prancha-modelo]
exemplo: true

contexto: >-
  Em 1748, Giambattista Nolli desenhou Roma pintando de escuro o que era construído
  e deixando em branco tudo o que era de acesso público — ruas, praças e até o
  interior das igrejas. A técnica sobreviveu porque responde a uma pergunta que
  nenhuma tabela responde bem: onde a cidade respira? Nesta malha sintética, um
  núcleo orgânico convive com uma expansão em xadrez rotacionado, e o rio aparece
  como o maior vazio de todos. A série de infraestrutura do atlas usará essa
  leitura, com quadras, eixos e áreas verdes separados por camada no DXF.

imagem: ./mapa_preview.png
imagem_alt: "Mapa figura-fundo em preto e branco: quadras pretas irregulares num núcleo à esquerda, quadras retangulares em grelha inclinada ao redor, avenidas brancas diagonais, áreas verdes hachuradas e um rio claro serpenteando de cima a baixo."

recorte: "Cidade fictícia (dados sintéticos)"
fontes:
  - nome: "Dados sintéticos — Essencial Geo (scripts/gerar-exemplos.mjs)"
    url: https://github.com/aikiesan/essencial-geo/blob/main/scripts/gerar-exemplos.mjs
    ano: 2026
  - nome: "Modelo de referência: OpenStreetMap (ODbL)"
    url: https://www.openstreetmap.org/
crs: "SIRGAS 2000 / UTM zona 23S"
epsg: 31983
escala: "1:50.000"
software: ["Node.js", "d3-delaunay"]
metodo: "Voronoi de duas malhas (orgânica e ortogonal rotacionada) com recuo de 70 m para o leito viário."

downloads:
  - formato: dxf
    arquivo: dados/figura_fundo_sintetica.dxf
    rotulo: "Quadras, eixos e verdes"
    tamanho: "0,4 MB"
  - formato: png
    arquivo: mapa_preview.png
    rotulo: "Prancha (PNG 2400 px)"
    tamanho: "0,3 MB"

versao: "0.1.0"
discussoes: []
---

# Figura-fundo da malha urbana

> **Prancha-modelo.** A cidade é sintética e não representa nenhum lugar real.

## Método

1. Duas nuvens de pontos: uma perturbada (núcleo antigo, traçado orgânico) e uma
   grelha rotacionada em 18° (expansão planejada).
2. O diagrama de Voronoi dessas nuvens dá os quarteirões; cada polígono é recuado
   7 px (70 m na escala sintética) para abrir o leito das ruas.
3. Células próximas ao rio ou em manchas de ruído alto viram parque (hachura);
   uma pequena fração vira praça (contorno tracejado).
4. Três avenidas são desenhadas por cima, como cortes no tecido.

## Para o CAD

| Camada DXF | Conteúdo |
| --- | --- |
| `QUADRAS` | Polígonos fechados das quadras edificáveis |
| `PRACAS` | Praças |
| `AREAS_VERDES` | Parques e margens do rio |
| `EIXOS_VIARIOS` | Eixos das avenidas (polilinhas abertas) |
| `HIDROGRAFIA` | Eixo do rio |

Para uma prancha figura-fundo real a partir de um recorte do OpenStreetMap:

```bash
ogr2ogr -f DXF quadras.dxf osm_recorte.gpkg multipolygons \
  -where "building IS NOT NULL" -t_srs EPSG:31983
```
