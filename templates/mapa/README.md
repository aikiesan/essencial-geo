---
# ── Identificação ─────────────────────────────────────────────
numero: {{numero}}
titulo: "{{titulo}}"
subtitulo: ""                       # opcional, uma linha
data: {{data}}                      # data de publicação (AAAA-MM-DD)
categoria: {{categoria}}            # uso-do-solo | censo-renda | altimetria-relevo | infraestrutura-dxf | hidrografia | biomas
tags: []
rascunho: true                      # mude para false para publicar

# ── O parágrafo do feed (exatamente um, até ~900 caracteres) ──
contexto: >-
  Escreva aqui um único parágrafo: o que o mapa revela, por que isso importa
  no contexto brasileiro e o que o leitor deve procurar na imagem.

# ── Imagem do feed ─────────────────────────────────────────────
imagem: ./mapa_preview.png          # PNG ou JPG, ~2400 px de largura
imagem_alt: "Descreva o mapa para quem usa leitor de tela: recorte, variável e padrão principal."

# ── Ficha técnica ──────────────────────────────────────────────
recorte: "Município, UF"
fontes:
  - nome: "IBGE — Censo Demográfico 2022"
    url: https://www.ibge.gov.br/
    ano: 2022
crs: "SIRGAS 2000 / UTM zona 23S"
epsg: 31983
escala: "1:50.000"
software: ["QGIS 3.40"]
metodo: ""

# ── Downloads (arquivo: relativo a esta pasta | url: release/Zenodo) ──
downloads:
  - formato: gpkg
    arquivo: dados/{{pasta}}.gpkg.zip
    tamanho: ""
  - formato: dxf
    arquivo: dados/{{pasta}}.dxf
    tamanho: ""
  - formato: pdf
    arquivo: prancha_impressao.pdf
    tamanho: ""

# ── Citação ────────────────────────────────────────────────────
versao: "1.0.0"
# doi: 10.5281/zenodo.0000000      # preenchido pela Action "Publicar no Zenodo"

# ── Discussões ─────────────────────────────────────────────────
discussoes: []
#  - onde: r/MapPorn
#    url: https://www.reddit.com/r/MapPorn/comments/...
---

# {{titulo}}

## Método

1. Origem e recorte dos dados.
2. Tratamento (junções, reprojeção, classificação).
3. Simbologia: paleta, quebras de classe e por quê.

## Arquivos

| Arquivo | Conteúdo |
| --- | --- |
| `dados/{{pasta}}.gpkg.zip` | Camadas vetoriais em SIRGAS 2000 |
| `dados/{{pasta}}.dxf` | Mesmas geometrias para CAD, por camada |
| `prancha_impressao.pdf` | Prancha vetorial final |

## Como reproduzir

```r
# trecho mínimo em R (sf + geobr), ou descreva os passos no QGIS
```
