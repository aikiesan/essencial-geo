---
numero: 127
titulo: "A eletricidade da biomassa"
subtitulo: "O bagaço que acende a rede"
data: 2026-12-02
rascunho: true                      # prévia: aguarda a aprovação da coleção e a data no calendário
categoria: energia
colecao: biomassa-br
tags: [biomassa-br, brasil, biomassa, eletricidade, termeletricas, bagaco-de-cana, licor-negro, biogas, aneel, siga]

contexto: >-
  O Brasil tem 695 usinas térmicas a biomassa registradas na ANEEL; 657 estão em operação e somam 18,4 GW, 8,3% da potência elétrica do país. Quase 70% dessa potência queima bagaço de cana, nas usinas de açúcar e etanol que se espalham do interior paulista a Goiás e ao Mato Grosso do Sul; outros 20% queimam licor negro, o resíduo das fábricas de celulose. A maior usina a biomassa do país é a da Bracell, em Lençóis Paulista (SP), com 409 MW, e as cinco maiores são todas de celulose. São Paulo sozinho tem 7,2 GW, 39% do total. O biogás ainda é pequeno: 57 usinas e 0,25 GW, a maior delas no aterro de Caieiras (SP).

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers com 695 círculos, um por usina térmica a biomassa, de tamanho proporcional à potência outorgada e cor do combustível: ocre para bagaço de cana, roxo para licor negro, verde-escuro para madeira, azul para biogás, cinza para lixo urbano e verde-oliva para casca de arroz e outros. Os círculos ocre se amontoam no interior de São Paulo, no Triângulo Mineiro, em Goiás e no Mato Grosso do Sul; os roxos, maiores, marcam as fábricas de celulose. Usinas em obra aparecem vazadas. Duas chamadas: a Bracell, em Lençóis Paulista, com 409 MW, a maior, e São Paulo, com 7,2 GW, 39% da potência a biomassa do país. No painel, a faixa da potência por combustível, a lista com o número de usinas e as colunas da potência que entrou em operação em cada década, com o salto dos anos 2000 e 2010."

recorte: "Brasil"
fontes:
  - nome: "ANEEL — Sistema de Informações de Geração (SIGA), empreendimentos de geração, dados abertos de 01/10/2026"
    nome_en: "ANEEL — Generation Information System (SIGA), generation projects, open data of 01/10/2026"
    url: https://dadosabertos.aneel.gov.br/dataset/siga-sistema-de-informacoes-de-geracao-da-aneel
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
metodo: "Usinas do SIGA da ANEEL com origem do combustível «Biomassa», agrupadas em seis combustíveis e desenhadas na coordenada registrada, com círculo proporcional à potência outorgada; usinas sem coordenada vão para o centro do município."

camadas:
  - { nome: usinas, tipo: ponto, cor: "#c08a2e", descricao: "695 usinas a biomassa: combustível, fase, potência outorgada, início da operação e proprietário", descricao_en: "695 biomass plants: fuel, phase, licensed capacity, start of operation and owner" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 unidades da federação", descricao_en: "27 states" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Potência a biomassa em operação"
    rotulo_en: "Biomass capacity in operation"
    valor: 18.4
    unidade: "GW"
    nota: "657 usinas, 8,3% da potência elétrica do país"
    nota_en: "657 plants, 8.3% of national electricity capacity"
  - tipo: barras
    rotulo: "Potência em operação por combustível"
    rotulo_en: "Operating capacity by fuel"
    unidade: "GW"
    itens:
      - { rotulo: "bagaço de cana", rotulo_en: "sugarcane bagasse", valor: 12.77, cor: "#c08a2e" }
      - { rotulo: "licor negro", rotulo_en: "black liquor", valor: 3.72, cor: "#6b3d5c" }
      - { rotulo: "madeira", rotulo_en: "wood", valor: 1.48, cor: "#2f5d3a" }
      - { rotulo: "biogás", rotulo_en: "biogas", valor: 0.25, cor: "#234e70" }
      - { rotulo: "casca de arroz e outros", rotulo_en: "rice husk and others", valor: 0.13, cor: "#7d8a3c" }
      - { rotulo: "lixo urbano", rotulo_en: "urban waste", valor: 0.03, cor: "#4a4e52" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-br-2026/br_usinas_biomassa.gpkg.zip
    rotulo: "Usinas, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Plants, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,2 MB"
  - formato: csv
    arquivo: dados/br_usinas_biomassa.csv
    rotulo: "As 695 usinas, com coordenadas no SIGA"
    rotulo_en: "All 695 plants, as in the SIGA"
    tamanho: "0,1 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-br-2026/br_usinas_biomassa_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/biomassa-br-2026/br_usinas_biomassa_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "3,3 MB"
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

# A eletricidade da biomassa: usinas térmicas a biomassa no Brasil

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 127, a segunda da coleção **Monitor da biomassa**. Depois do boi, a eletricidade que já
sai da biomassa: quase toda de bagaço de cana e de licor negro, os restos do açúcar e da celulose.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `usinas` | ponto | 695 usinas: `nome`, `ceg`, `uf`, `municipio`, `fase` (operação, construção, construção não iniciada), `combustivel` (como no SIGA), `grupo`, `potencia_kw` (outorgada), `inicio_operacao`, `proprietario`, `posicao` |
| `ufs` | polígono | 27 unidades da federação, com a região |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `biomassa-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/biomassa-br-2026).
A camada `usinas` traz o **estilo do QGIS** da prancha, com círculos proporcionais à potência. O
**CSV** fica nesta pasta, em UTF-8, com a mesma tabela sem geometria.

## Método

1. Empreendimentos de geração do SIGA da ANEEL (dados abertos de 01/10/2026) com origem do
   combustível «Biomassa», em todas as fases.
2. Os combustíveis do SIGA foram reunidos em seis grupos: bagaço de cana; licor negro; madeira
   (resíduos florestais, lenha, carvão vegetal e gás de alto-forno de biomassa); biogás (de
   resíduos agropecuários, urbanos e florestais); lixo urbano queimado; e casca de arroz, capim-
   elefante, etanol e óleos vegetais.
3. Cada usina fica na coordenada do SIGA. As 19 sem coordenada (zero ou vazia) foram para o ponto
   central do primeiro município listado, marcado na coluna `posicao`.
4. Os totais do painel e da ficha usam só as usinas em operação. A parcela do país compara com a
   potência de todas as usinas em operação no SIGA (221,4 GW).
5. As colunas do painel somam a potência pelo ano de entrada em operação de cada usina.

## Limitações

- Potência outorgada não é energia gerada: as usinas de cana só queimam bagaço na safra, e parte
  da eletricidade é consumida na própria indústria.
- O SIGA registra a usina com o combustível principal; algumas queimam mais de um.
- A data de entrada em operação é a da usina; ampliações posteriores não aparecem nas colunas.

## Licença dos dados

Dados abertos da ANEEL e do IBGE, de uso livre com citação da fonte.
