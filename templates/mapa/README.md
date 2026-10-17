---
# ── Identificação ─────────────────────────────────────────────
numero: {{numero}}
titulo: "{{titulo}}"
subtitulo: ""                       # opcional, uma linha
data: {{data}}                      # dia de publicação (AAAA-MM-DD). Data futura = agendado: entra no ar às 9h de Brasília desse dia
# atualizado: AAAA-MM-DD            # preencha ao corrigir/atualizar — aparece como "Atualizado em"
categoria: {{categoria}}            # uso-do-solo | censo-renda | altimetria-relevo | infraestrutura-dxf | hidrografia | biomas | energia
tags: []
rascunho: true                      # mude para false para publicar (e confira o README.en.md)

# ── O parágrafo do feed (exatamente um, até ~900 caracteres) ──
contexto: >-
  Escreva aqui um único parágrafo: o que o mapa revela, por que isso importa
  no contexto brasileiro e o que o leitor deve procurar na imagem.

# ── Imagem do feed ─────────────────────────────────────────────
imagem: ./mapa_preview.png          # PNG ou JPG, ~2400 px de largura (a versão em inglês: mapa_preview.en.png)
imagem_alt: "Descreva o mapa para quem usa leitor de tela: recorte, variável e padrão principal."

# ── Ficha técnica ──────────────────────────────────────────────
recorte: "Município, UF"
fontes:
  - nome: "IBGE — Censo Demográfico 2022"
    nome_en: "IBGE — 2022 Demographic Census"
    url: https://www.ibge.gov.br/
    ano: 2022
crs: "SIRGAS 2000 / UTM zona 23S"
epsg: 31983
escala: "1:50.000"
software: ["QGIS 3.40"]
metodo: ""

# ── Camadas (painel de camadas da ficha) ───────────────────────
# tipo: ponto | linha | poligono | grade | raster
camadas: []
#  - nome: SETORES
#    tipo: poligono
#    cor: "#749fb7"
#    descricao: "Setores censitários com população"
#    descricao_en: "Census tracts with population"

# ── Leitura rápida (indicadores) ───────────────────────────────
# Só números que saem dos seus dados. tipo: numero | barras | proporcao
indicadores: []
#  - tipo: numero
#    rotulo: "População"
#    rotulo_en: "Population"
#    valor: 0
#    nota: "Censo 2022"
#    nota_en: "2022 Census"
#  - tipo: barras
#    rotulo: "Classes"
#    rotulo_en: "Classes"
#    unidade: "ha"
#    itens:
#      - { rotulo: "Classe A", rotulo_en: "Class A", valor: 0 }

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
    arquivo_en: prancha_impressao.en.pdf
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

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

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
