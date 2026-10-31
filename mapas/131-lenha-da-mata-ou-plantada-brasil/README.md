---
numero: 131
titulo: "Lenha da mata ou plantada"
subtitulo: "O Sul queima eucalipto; o Sertão, a mata"
data: 2026-12-06
rascunho: true                      # prévia: aguarda a aprovação da coleção e a data no calendário
categoria: energia
colecao: biomassa-br
tags: [biomassa-br, brasil, biomassa, lenha, carvao-vegetal, extracao-vegetal, silvicultura, caatinga, pevs, municipios]

contexto: >-
  O Brasil produziu 76 milhões de m³ de lenha em 2025. Quase três quartos (72%) vêm de floresta plantada, quase toda de eucalipto, e queimam no Sul e no Centro-Sul, para secar grão, curar fumo e tocar caldeiras: o Paraná sozinho produziu 14,4 milhões de m³, 96% plantados. O resto, 21 milhões de m³ (28%), ainda sai da mata nativa, em dois lugares: no norte de Mato Grosso, na fronteira do desmatamento, e no Sertão nordestino, onde a lenha da caatinga abastece padarias, cerâmicas e casas. Nova Maringá (MT) é o maior produtor de lenha do país, 892 mil m³, 96% de mata nativa. Em 1.754 municípios a lenha é quase toda nativa. No carvão vegetal a virada já aconteceu: 93% vem de floresta plantada.

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers com 4.299 círculos, um por município que produziu lenha em 2025, de tamanho proporcional ao volume e cor da origem, em quatro classes: verde-escuro para quase toda plantada, verde-claro para mais plantada, bege para mais nativa e marrom-avermelhado para quase toda nativa. Os círculos verdes cobrem o Sul, São Paulo, Minas Gerais e Goiás; os marrons, menores e muito juntos, enchem o Sertão nordestino, do Ceará à Bahia, e se espalham pela Amazônia; no norte de Mato Grosso aparecem os maiores círculos marrons. Duas chamadas: Nova Maringá, em Mato Grosso, com 892 mil m³, a maior do país, 96% tirada da mata nativa, e Butiá, no Rio Grande do Sul, com 794 mil m³ de lenha de eucalipto. No painel, as classes com o número de municípios e o volume, barras da lenha e do carvão vegetal de origem nativa e plantada em 2015 e 2025, e a legenda dos círculos."

recorte: "Brasil"
fontes:
  - nome: "IBGE — Produção da Extração Vegetal e da Silvicultura 2015 e 2025, quantidade produzida na extração vegetal, madeiras (SIDRA, tabela 289)"
    nome_en: "IBGE — Forestry and Plant Extraction Production 2015 and 2025, plant extraction output, wood (SIDRA, table 289)"
    url: https://sidra.ibge.gov.br/tabela/289
    ano: 2025
  - nome: "IBGE — Produção da Extração Vegetal e da Silvicultura 2015 e 2025, quantidade produzida na silvicultura (SIDRA, tabela 291)"
    nome_en: "IBGE — Forestry and Plant Extraction Production 2015 and 2025, forestry output (SIDRA, table 291)"
    url: https://sidra.ibge.gov.br/tabela/291
    ano: 2025
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
  - nome: "Natural Earth — países vizinhos (via world-atlas)"
    nome_en: "Natural Earth — neighbouring countries (via world-atlas)"
    url: https://www.naturalearthdata.com/
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "pandas", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Lenha de 2025 da extração vegetal (mata nativa) e da silvicultura (floresta plantada), somadas por município e desenhadas em círculos proporcionais ao volume, na cor da parte que vem da mata nativa."

camadas:
  - { nome: lenha, tipo: ponto, cor: "#2f6f5e", descricao: "4.299 municípios com lenha em 2025: lenha nativa e plantada em 2015 e 2025, parcela nativa, classe e carvão vegetal de 2025", descricao_en: "4,299 municipalities with firewood in 2025: native and planted firewood in 2015 and 2025, native share, class and 2025 charcoal" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 unidades da federação", descricao_en: "27 states" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Lenha produzida no Brasil, 2025"
    rotulo_en: "Firewood produced in Brazil, 2025"
    valor: 76.3
    unidade: "milhões de m³"
    nota: "28% da mata nativa (33% em 2015)"
    nota_en: "28% from native forest (33% in 2015)"
  - tipo: barras
    rotulo: "Lenha nativa e plantada, as oito maiores UFs"
    rotulo_en: "Native and planted firewood, the eight largest states"
    unidade: "milhões de m³"
    itens:
      - { rotulo: "PR", valor: 15.05, cor: "#2f6f5e" }
      - { rotulo: "RS", valor: 11.42, cor: "#2f6f5e" }
      - { rotulo: "SC", valor: 8.70, cor: "#2f6f5e" }
      - { rotulo: "MT", valor: 8.06, cor: "#d9a77a" }
      - { rotulo: "MG", valor: 5.05, cor: "#2f6f5e" }
      - { rotulo: "GO", valor: 4.05, cor: "#2f6f5e" }
      - { rotulo: "SP", valor: 3.91, cor: "#2f6f5e" }
      - { rotulo: "CE", valor: 3.13, cor: "#8a3b1f" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-br-2026/br_lenha_origem.gpkg.zip
    rotulo: "Municípios com lenha (pontos), UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities with firewood (points), states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,4 MB"
  - formato: csv
    arquivo: dados/br_lenha_origem.csv
    rotulo: "Os 4.299 municípios com lenha, sem geometria"
    rotulo_en: "The 4,299 municipalities with firewood, without geometry"
    tamanho: "0,4 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-br-2026/br_lenha_origem_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-br-2026/br_lenha_origem_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "3,8 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

doi_automatico: true
versao: "1.0.0"
discussoes: []
---

# Lenha da mata ou plantada: a origem da lenha por município no Brasil

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 131, a sexta e última da coleção **Monitor da biomassa**. A lenha é a biomassa mais
antiga e ainda uma das mais queimadas; o mapa separa a que vem de floresta plantada da que sai da
mata nativa.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `lenha` | ponto | 4.299 municípios com lenha em 2025, no ponto central de cada um: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `lenha_nativa_2015_m3`, `lenha_plantada_2015_m3`, `lenha_nativa_2025_m3`, `lenha_plantada_2025_m3`, `lenha_2025_m3`, `parcela_nativa`, `classe`, `faixa`, `carvao_nativo_2025_t`, `carvao_plantado_2025_t` |
| `ufs` | polígono | 27 unidades da federação, com a região |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `biomassa-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/biomassa-br-2026).
A camada `lenha` traz o **estilo do QGIS** da prancha, com círculos proporcionais ao volume. O
**CSV** fica nesta pasta, em UTF-8, com a mesma tabela sem geometria.

## Método

1. **Lenha nativa**: quantidade produzida na extração vegetal, lenha, em m³ (SIDRA, tabela 289).
   **Lenha plantada**: quantidade produzida na silvicultura, lenha, em m³ (tabela 291). Anos 2015 e
   2025. «-» é zero; «...» e «..» ficam vazios e não entram na soma.
2. **Parcela nativa**: lenha nativa dividida pela soma das duas, em 2025. Quatro classes, com
   limites em 10%, 50% e 90%.
3. Cada município com lenha em 2025 vira um círculo no ponto central do município, com área
   proporcional ao volume total.
4. O carvão vegetal, em toneladas, vem das mesmas tabelas e entra no painel e na tabela, não no
   mapa.

## Limitações

- A PEVS é uma estimativa municipal feita com informantes locais. A lenha nativa tirada sem
  autorização, ou queimada em casa sem passar pelo mercado, tende a ficar de fora.
- A lenha é contada onde é cortada, não onde é queimada.
- Lenha em m³ e carvão em toneladas não se somam; o carvão fica em barras separadas.

## Licença dos dados

Dados abertos do IBGE, de uso livre com citação da fonte.
