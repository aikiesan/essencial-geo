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
    nome_en: "Synthetic data — Essencial Geo (scripts/gerar-exemplos.mjs)"
    url: https://github.com/aikiesan/essencial-geo/blob/main/scripts/gerar-exemplos.mjs
    ano: 2026
  - nome: "Modelo de referência: OpenStreetMap (ODbL)"
    nome_en: "Reference model: OpenStreetMap (ODbL)"
    url: https://www.openstreetmap.org/
crs: "SIRGAS 2000 / UTM zona 23S"
epsg: 31983
escala: "1:50.000"
software: ["Node.js", "d3-delaunay"]
metodo: "Voronoi de duas malhas (orgânica e ortogonal rotacionada) com recuo de 70 m para o leito viário."

camadas:
  - { nome: QUADRAS, tipo: poligono, cor: "#1a1c1e", descricao: "Quadras edificáveis (figura)", descricao_en: "Built blocks (figure)" }
  - { nome: PRACAS, tipo: poligono, cor: "#ffffff", descricao: "Praças", descricao_en: "Squares" }
  - { nome: AREAS_VERDES, tipo: poligono, cor: "#7f9a52", descricao: "Parques e margens do rio", descricao_en: "Parks and riverbanks" }
  - { nome: EIXOS_VIARIOS, tipo: linha, cor: "#6d7165", descricao: "Eixos das avenidas", descricao_en: "Avenue centrelines" }
  - { nome: HIDROGRAFIA, tipo: linha, cor: "#1f3a5f", descricao: "Eixo do rio", descricao_en: "River centreline" }

indicadores:
  - tipo: numero
    rotulo: "Quadras edificáveis"
    rotulo_en: "Built blocks"
    valor: 751
    nota: "em dois tecidos: núcleo orgânico e grelha a 18°"
    nota_en: "in two fabrics: an organic core and a grid at 18°"
  - tipo: barras
    rotulo: "Feições por camada"
    rotulo_en: "Features per layer"
    itens:
      - { rotulo: "Quadras", rotulo_en: "Blocks", valor: 751, cor: "#1a211a" }
      - { rotulo: "Áreas verdes", rotulo_en: "Green spaces", valor: 116, cor: "#6d7165" }
      - { rotulo: "Praças", rotulo_en: "Squares", valor: 35, cor: "#bfa88a" }
      - { rotulo: "Avenidas", rotulo_en: "Avenues", valor: 3, cor: "#749fb7" }

downloads:
  - formato: dxf
    arquivo: dados/figura_fundo_sintetica.dxf
    rotulo: "Quadras, eixos e verdes"
    rotulo_en: "Blocks, axes and green spaces"
    tamanho: "0,4 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

versao: "0.1.0"
discussoes: []
---

# Figura-fundo da malha urbana

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

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
