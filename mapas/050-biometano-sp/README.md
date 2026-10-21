---
numero: 50
titulo: "Biometano em SP"
subtitulo: "O gás que já está no campo"
data: 2026-10-20
categoria: energia
colecao: agro-sp
tags: [agro-sp, sao-paulo, biometano, biogas, residuos, cana, pecuaria, cp2b, municipios]
rascunho: true                      # fora do ar: resguardo de artigo em preparação

contexto: >-
  Somados todos os resíduos, São Paulo poderia produzir 16,9 milhões de m³ de biometano por dia no nível acessível do método CP2B, que desconta o que precisa ficar no solo, os usos que já disputam cada resíduo e a distância até onde o gás seria feito. A cana responde por 82%: só a palha deixada no canavial daria 6,9 milhões. O potencial se concentra no norte do estado. As regiões de Ribeirão Preto e São José do Rio Preto somam 41%, 68 municípios reúnem metade do total, e Guaíra lidera, com 333 mil m³ por dia. A cana é a maior fonte em 370 municípios; o lixo e o esgoto, em 105, 86 deles nas regiões de São Paulo, Campinas e São José dos Campos. Do potencial teórico ao acessível, sobra um quarto. Última prancha da coleção «Do campo ao biometano».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com um círculo por município, proporcional ao biometano que os resíduos dariam por dia (de 20 mil a 300 mil m³ na legenda), colorido pela maior fonte: verde para a cana, ocre para as outras lavouras, cor de argila para a pecuária e azul para o lixo e o esgoto. Círculos verdes grandes cobrem o norte, o centro e o oeste do estado, mais densos em volta de Ribeirão Preto; os ocres ficam no sudoeste, perto de Itapeva; os cor de argila, em volta de Bastos e no centro-leste; os azuis, em São Paulo, Campinas e no Vale do Paraíba. O Vale do Ribeira quase não tem círculos. Uma chamada aponta Guaíra, no norte: 333 mil m³ por dia, o maior potencial do estado. No painel, um gráfico de barras mostra o potencial caindo de 64,8 milhões de m³ de metano por dia no nível teórico para 16,4 milhões no acessível."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "CP2B (Unicamp) — potencial de biogás e biometano por município, método v5.1"
    nome_en: "CP2B (Unicamp) — biogas and biomethane potential by municipality, method v5.1"
    ano: 2026
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Potencial de biometano de 17 resíduos no nível acessível do método CP2B, somado em quatro grupos por município; círculos proporcionais ao total, coloridos pelo grupo de maior potencial."

camadas:
  - { nome: potencial, tipo: ponto, descricao: "618 municípios com potencial: biometano por grupo e total (m³/dia), grupo dominante e sua parte", descricao_en: "618 municipalities with potential: biomethane by group and total (m³/day), dominant group and its share" }
  - { nome: municipios, tipo: poligono, descricao: "645 municípios, com a mesma tabela", descricao_en: "645 municipalities, with the same table" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "De onde vem o biometano"
    rotulo_en: "Where the biomethane comes from"
    unidade: "m³/dia"
    unidade_en: "m³/day"
    itens:
      - { rotulo: "Cana", rotulo_en: "Sugarcane", valor: 13782126, cor: "#5b7f3a" }
      - { rotulo: "Pecuária", rotulo_en: "Livestock", valor: 1285018, cor: "#9c4a32" }
      - { rotulo: "Outras lavouras", rotulo_en: "Other crops", valor: 1183514, cor: "#c99a2e" }
      - { rotulo: "Lixo e esgoto", rotulo_en: "Waste and sewage", valor: 621454, cor: "#234e70" }
  - tipo: numero
    rotulo: "Metano acessível"
    rotulo_en: "Accessible methane"
    valor: 16360836
    unidade: "m³ CH₄/dia"
    unidade_en: "m³ CH₄/day"
    nota: "25% dos 64,8 milhões de m³ por dia do potencial teórico (N1); 41,7 milhões no disponível (N2) e 19,2 milhões no mobilizável (N3)"
    nota_en: "25% of the 64.8 million m³ a day of theoretical potential (N1); 41.7 million available (N2) and 19.2 million mobilisable (N3)"
  - tipo: barras
    rotulo: "Maiores potenciais municipais"
    rotulo_en: "Largest municipal potentials"
    unidade: "m³/dia"
    unidade_en: "m³/day"
    itens:
      - { rotulo: "Guaíra", valor: 332550, cor: "#5b7f3a" }
      - { rotulo: "Morro Agudo", valor: 283859, cor: "#5b7f3a" }
      - { rotulo: "Sertãozinho", valor: 258623, cor: "#5b7f3a" }
      - { rotulo: "Pontal", valor: 227352, cor: "#5b7f3a" }
      - { rotulo: "Pitangueiras", valor: 212196, cor: "#5b7f3a" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/agro-sp-2026/sp_biometano_cp2b.gpkg.zip
    rotulo: "Quatro camadas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Four layers, SIRGAS 2000, with QGIS styles"
    tamanho: "18,6 MB"
  - formato: csv
    arquivo: dados/sp_biometano_cp2b.csv
    rotulo: "Biometano por grupo de resíduo e município"
    rotulo_en: "Biomethane by residue group and municipality"
    tamanho: "52 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/agro-sp-2026/sp_biometano_cp2b_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/agro-sp-2026/sp_biometano_cp2b_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,3 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

doi_automatico: false
versao: "1.0.0"
discussoes: []
---

# Biometano em São Paulo: o potencial de todos os resíduos, município a município

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 050, a última de seis da coleção **Do campo ao biometano**: a síntese da cana, das
outras lavouras, da pecuária e das cidades em um só mapa.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `potencial` | ponto | 618 municípios com potencial acima de zero, um ponto dentro de cada um, com a mesma tabela da camada `municipios` |
| `municipios` | polígono | 645 municípios: `CD_MUN`, `NM_MUN`, região intermediária, `cana_m3_dia`, `lavouras_m3_dia`, `pecuaria_m3_dia`, `urbano_m3_dia`, `total_m3_dia`, `dominante` (grupo de maior potencial) e `parte_dominante` (% do total) |
| `regioes_intermediarias` | polígono | 11 regiões geográficas intermediárias |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `agro-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/agro-sp-2026).
A camada `potencial` já abre com os círculos da prancha, no **estilo do QGIS** `circulos`.

O **CSV** traz a tabela dos municípios, em UTF-8, sem geometria. Nos 27 municípios sem potencial,
`dominante` e `parte_dominante` ficam vazios.

## Método

1. Potencial de 17 resíduos no método CP2B v5.1 (Unicamp, versão de 24/09/2026), cenário de
   referência, nível N4 (acessível), em m³ de biometano equivalente por dia.
2. Quatro grupos:
   - **cana**: palha, bagaço, torta de filtro e vinhaça;
   - **outras lavouras**: palha de milho, palha de soja, bagaço de laranja e casca de café;
   - **pecuária**: frango de corte, galinhas poedeiras, gado leiteiro, gado confinado, gado a
     pasto e suínos;
   - **lixo e esgoto**: lixo orgânico, lodo de esgoto e poda urbana.
3. Círculo com área proporcional ao total do município, colorido pelo grupo de maior potencial.
4. Do teórico ao acessível: os quatro níveis do método, em m³ de metano por dia. N1 é o teórico,
   N2 o disponível, N3 o mobilizável e N4 o acessível, que também considera a distância até onde
   o gás seria produzido. O biometano equivalente é o metano dividido por 0,97.

## Limitações

- O potencial do CP2B é modelado, não medido: diz quanto gás os resíduos dariam, não quanto se
  produz hoje.
- No nível acessível, o gado a pasto dá zero no estado, e 27 municípios ficam sem potencial
  nenhum, a maioria no Vale do Ribeira e no Vale do Paraíba.
- O bagaço de laranja é alocado às fábricas de suco, e não aos pomares (veja a prancha Nº 047).
- Os grupos somam resíduos diferentes, que pedem tecnologias diferentes: as palhas, os bagaços,
  a casca de café e a poda, 61% do total, são materiais fibrosos, mais difíceis de digerir que o
  esterco ou a vinhaça.

## Licença dos dados

O potencial do CP2B (Unicamp) é publicado aqui com autorização do centro; cite «CP2B (Unicamp),
método v5.1, 2026». Malha municipal do IBGE, de uso livre com citação da fonte.
