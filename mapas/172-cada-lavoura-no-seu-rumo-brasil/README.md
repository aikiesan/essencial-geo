---
numero: 172
titulo: "Cada lavoura no seu rumo"
subtitulo: "Em quarenta anos, o centro da soja subiu 621 km para o norte e o da cana desceu 520 km para o sudoeste"
data: 2027-03-15
rascunho: true
categoria: uso-do-solo
colecao: quarenta-anos-de-biomassa-br
tags: [quarenta-anos-de-biomassa-br, brasil, soja, cana-de-acucar, pastagem, silvicultura, centro-de-gravidade, mapbiomas, serie-historica]

contexto: >-
  Se toda a soja do Brasil fosse pesada numa balança, o ponto de equilíbrio estaria em 1985 no noroeste do Paraná; em 2025, no sudoeste de Goiás, 621 km ao norte. O da cana fez o caminho contrário: saiu do norte de Minas, puxado pela cana do litoral nordestino, e foi 520 km para o sudoeste, até o Triângulo Mineiro, atraído por São Paulo. O do pasto andou 523 km rumo ao norte de Goiás, e o da silvicultura, só 160 km, no interior paulista, embora a área tenha crescido 5,3 vezes. A soja foi de 4,5 para 44,2 milhões de hectares; o pasto, de 104 para 166. Segunda prancha da coleção «Quarenta anos de biomassa».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers, com fundo neutro, sobre o qual cinco trajetórias coloridas ligam o centro de gravidade de cada classe de cobertura do MapBiomas em 1985 (círculo vazado) ao de 2025 (círculo cheio), com pontos a cada cinco anos: a soja, em dourado, sobe do noroeste do Paraná ao sudoeste de Goiás; a cana, em vinho, desce do norte de Minas Gerais ao Triângulo Mineiro; a pastagem, em marrom, sobe do leste ao norte de Goiás, passando por Brasília; a silvicultura, em verde-escuro, anda pouco no interior de São Paulo; a formação florestal, tracejada, quase não sai do lugar no sul do Pará. Duas chamadas dão os 621 km da soja e os 520 km da cana. No painel, uma tabela do deslocamento para norte e leste de cada classe, uma rosa com as quatro setas a partir de uma origem comum e linhas da área de soja, cana e silvicultura de 1985 a 2025."

recorte: "Brasil"
fontes:
  - nome: "MapBiomas — Coleção 11 da série anual de mapas de cobertura e uso da terra do Brasil, estatísticas de cobertura por bioma, estado e município, 1985–2025 (MAPBIOMAS_BRAZIL-COL.11-BIOME_STATE_MUNICIPALITY.xlsx, acesso em 01/11/2026)"
    nome_en: "MapBiomas — Collection 11 of the annual land cover and land use maps of Brazil, coverage statistics by biome, state and municipality, 1985–2025 (MAPBIOMAS_BRAZIL-COL.11-BIOME_STATE_MUNICIPALITY.xlsx, accessed 01/11/2026)"
    url: https://brasil.mapbiomas.org/estatisticas/
    ano: 2026
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
metodo: "Para cada classe e ano de 1985 a 2025, média das coordenadas dos centroides dos municípios na projeção cônica equivalente de Albers do Brasil, pesada pela área da classe em cada município (MapBiomas, coleção 11); deslocamentos medidos nessa projeção, em km."

camadas:
  - { nome: trajetorias, tipo: linha, cor: "#c08a1e", descricao: "5 trajetórias de 1985 a 2025 (soja, cana, pastagem, silvicultura, formação florestal): caminho, deslocamento líquido, direção e área em 1985 e 2025", descricao_en: "5 paths from 1985 to 2025 (soy, cane, pasture, planted forest, forest formation): path length, net shift, heading and area in 1985 and 2025" }
  - { nome: centros_anuais, tipo: ponto, cor: "#c08a1e", descricao: "205 centros de gravidade (5 classes × 41 anos), com a área da classe no ano", descricao_en: "205 centres of gravity (5 classes × 41 years), with the class area that year" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 UFs", descricao_en: "27 states" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Deslocamento do centro da soja, 1985–2025"
    rotulo_en: "Shift of the centre of soy, 1985–2025"
    valor: 621
    unidade: "km"
    nota: "615 km para o norte e 87 para o leste; 767 km de caminho ano a ano"
    nota_en: "615 km north and 87 east; a 767 km year-by-year path"
  - tipo: numero
    rotulo: "Deslocamento do centro da cana, 1985–2025"
    rotulo_en: "Shift of the centre of sugar cane, 1985–2025"
    valor: 520
    unidade: "km"
    nota: "230 km para o sul e 466 para o oeste"
    nota_en: "230 km south and 466 west"
  - tipo: barras
    rotulo: "Deslocamento líquido do centro de gravidade, 1985–2025"
    rotulo_en: "Net shift of the centre of gravity, 1985–2025"
    unidade: "km"
    itens:
      - { rotulo: "soja", valor: 621, cor: "#c08a1e" }
      - { rotulo: "pastagem", valor: 523, cor: "#7d6a4a" }
      - { rotulo: "cana-de-açúcar", valor: 520, cor: "#a8325e" }
      - { rotulo: "silvicultura", valor: 160, cor: "#2f6b5a" }
      - { rotulo: "formação florestal", valor: 75, cor: "#5d7f45" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/quarenta-anos-de-biomassa-br-2026/br_biomassa_centro_de_gravidade.gpkg.zip
    rotulo: "Trajetórias, centros anuais, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Paths, yearly centres, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,2 MB"
  - formato: csv
    arquivo: dados/br_biomassa_centro_de_gravidade.csv
    rotulo: "Os 205 centros de gravidade, por classe e ano, com a área da classe"
    rotulo_en: "The 205 centres of gravity, by class and year, with the class area"
    tamanho: "10 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/quarenta-anos-de-biomassa-br-2026/br_biomassa_centro_de_gravidade_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/quarenta-anos-de-biomassa-br-2026/br_biomassa_centro_de_gravidade_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "3,4 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,2 MB"

doi_automatico: false
versao: "1.0.0"
discussoes: []
---

# Cada lavoura no seu rumo: o centro de gravidade da soja, da cana, do pasto e da silvicultura, 1985 a 2025

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 172, a segunda da coleção **Quarenta anos de biomassa**. Cada classe de uso da terra
resumida num só ponto por ano, para ver para onde a terra que produz biomassa se moveu.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `trajetorias` | linha | 5 classes: `classe`, `rotulo`, `caminho_km` (soma dos passos anuais), `liquido_km` (1985 → 2025), `direcao`, `area_1985_mha`, `area_2025_mha` |
| `centros_anuais` | ponto | 205 pontos: `classe`, `rotulo`, `ano`, `lon`, `lat`, `area_mha` |
| `ufs` | polígono | 27 UFs |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `quarenta-anos-de-biomassa-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/quarenta-anos-de-biomassa-br-2026),
com os **estilos do QGIS** gravados. O **CSV** fica nesta pasta, em UTF-8, com os pontos anuais.

## Método

1. Estatísticas de cobertura e uso da terra do MapBiomas, coleção 11, aba `COVERAGE_11`: hectares de
   cada classe por município e ano, de 1985 a 2025, somados os biomas. Classes: soja (39),
   cana-de-açúcar (20), pastagem (15), silvicultura (9) e, como referência, formação florestal (3).
2. Centro de cada município: o centroide do polígono da malha municipal de 2025 na projeção cônica
   equivalente de Albers do Brasil (φ₁ 2° S, φ₂ 22° S, λ₀ 54° O).
3. Centro de gravidade de uma classe num ano: a média das coordenadas desses centros, pesada pelos
   hectares da classe em cada município. Os 41 centros de cada classe, ligados, formam a trajetória.
4. Deslocamento líquido: a distância em linha reta entre o centro de 1985 e o de 2025, nessa
   projeção, decomposta em norte e leste; caminho: a soma das 40 distâncias de um ano ao seguinte.

## Leitura

- Soja: de 4,5 para 44,2 milhões de hectares (9,9 vezes). O centro saiu do noroeste do Paraná
  (52,8° O, 23,9° S) e chegou ao sudoeste de Goiás (52,0° O, 18,4° S): 615 km para o norte e 87 para
  o leste, 621 km em linha reta e 767 km de caminho.
- Cana-de-açúcar: de 2,2 para 11,2 milhões de hectares (5,2 vezes). Em 1985, a cana do litoral de
  Pernambuco e Alagoas e a de São Paulo deixavam o centro no norte de Minas Gerais (44,0° O, 17,4° S);
  com a expansão paulista e goiana, ele foi 230 km para o sul e 466 para o oeste, até o Triângulo
  Mineiro (48,4° O, 19,6° S): 520 km.
- Pastagem: de 104,0 para 165,6 milhões de hectares. O centro foi do leste de Goiás (47,2° O,
  17,6° S) ao norte do estado (49,0° O, 13,2° S), 491 km para o norte e 180 para o oeste: 523 km,
  puxado pelos pastos novos do Pará (+17,9 milhões de ha), de Mato Grosso (+14,2), do Maranhão e de
  Rondônia, enquanto São Paulo perdeu 7,3 milhões de hectares de pasto.
- Silvicultura: de 1,9 para 9,9 milhões de hectares (5,3 vezes), mas o centro andou só 160 km, de
  perto de Piracicaba para o norte do interior paulista: a floresta plantada cresceu em todas as
  direções, em Minas, no Mato Grosso do Sul e no Sul.
- Formação florestal: de 424,6 para 359,5 milhões de hectares; o centro andou 75 km, no sul do Pará.

## Limitações

- O centro de gravidade é uma média: pode cair onde a classe quase não existe, como o da cana em 1985,
  entre o Nordeste e São Paulo. Ele mostra o rumo do conjunto, não onde a classe está.
- O município entra pelo seu centroide; em municípios muito grandes, a classe pode estar longe dele.
- Os primeiros anos da série têm mais erro de classificação; o maior passo anual da soja (85 km, de
  1985 para 1986) e o da pastagem (36 km) são do começo da série.
- Área mapeada por satélite, não a área colhida do IBGE.

## Licença dos dados

Dados do MapBiomas (CC BY 4.0) e do IBGE, de uso livre com citação da fonte.
