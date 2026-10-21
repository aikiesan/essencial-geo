---
numero: 116
titulo: "O funil do biometano"
subtitulo: "De cada quatro metros cúbicos teóricos, só um chega ao alcance de uma usina"
data: 2026-11-10
categoria: energia
colecao: funil-sp
tags: [funil-sp, sao-paulo, biogas, biometano, potencial, cp2b, metodo]

contexto: >-
  Somados os resíduos da cana, das lavouras, dos rebanhos e das cidades, o metano teórico de São Paulo passa de 23,6 bilhões de m³ por ano no cenário de referência do CP2B (nível N1). Depois vem o funil do método: 8,4 bilhões ficam no campo, porque não se recolhem; 8,2 bilhões já têm outro destino, quase todo o bagaço que vai para as caldeiras; e 1,0 bilhão se perde na estocagem e na estrada. No nível acessível (N4) sobram 6,0 bilhões, 25 % do teórico, ou 16,9 milhões de m³ de biometano por dia. A retenção varia muito: 71 % em Bastos, onde a cama e o esterco das granjas se recolhem quase inteiros; 24 % em Guaíra, o maior potencial teórico do estado; 3 % em Guariba, onde os resíduos da cana já alimentam um biodigestor; e zero em 27 municípios do Vale do Ribeira e do fundo do Vale do Paraíba. É modelo, não medição. Primeira prancha da coleção «O funil do biometano».

imagem: ./mapa_preview.png
imagem_alt: "Mapa coroplético dos municípios de São Paulo em seis tons da paleta viridis, do amarelo ao roxo, pela parte do potencial teórico de metano que chega ao potencial acessível. O roxo, de mais de 35 %, aparece em manchas em volta de Campinas, de Sorocaba e de Rio Claro e em Bastos; o verde e o azul, de 20 a 35 %, cobrem a maior parte do interior; o amarelo, de até 10 %, domina o Pontal do Paranapanema e o Vale do Paraíba; o Vale do Ribeira e o fundo do Vale do Paraíba ficam em cinza, sem nada no nível acessível. Chamadas apontam Guaíra, com 24 %, Bastos, com 71 %, e Guariba, com 3 %. No painel, quatro barras centradas desenham o funil: 23,6 bilhões de m³ no N1, 15,2 no N2, 7,0 no N3 e 6,0 no N4, com o que se perde em cada passo."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "CP2B (Unicamp) — potencial de biogás e biometano por município e resíduo, níveis N1 a N4, método v5.1"
    nome_en: "CP2B (Unicamp) — biogas and biomethane potential by municipality and residue, levels N1 to N4, method v5.1"
    ano: 2026
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Para cada município, a soma dos 17 resíduos do CP2B v5.1 em cada nível (m³ normais de metano por ano, cenário de referência): N1 teórico, N2 técnico (depois da coleta), N3 mobilizável (depois dos usos concorrentes e do que já vira biogás) e N4 acessível (depois da estocagem e do fator logístico). A retenção é N4 ÷ N1."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#2a788e", descricao: "645 municípios: os quatro níveis, a retenção, as perdas de cada passo por causa e o N4 nos três cenários (mesmo GPKG das pranchas 116 a 120)", descricao_en: "645 municipalities: the four levels, retention, each step’s losses by cause and N4 in the three scenarios (same GPKG as plates 116 to 120)" }
  - { nome: perda_na_coleta, tipo: ponto, cor: "#b08d3c", descricao: "Ponto interno de cada município, com o metano que fica no campo e a maior causa (prancha 117)", descricao_en: "Interior point of each municipality, with the methane left in the field and its largest cause (plate 117)" }

indicadores:
  - tipo: barras
    rotulo: "O funil, no cenário de referência"
    rotulo_en: "The funnel, in the reference scenario"
    unidade: "bilhões de m³ de metano por ano"
    unidade_en: "billion m³ of methane a year"
    itens:
      - { rotulo: "N1 · teórico", rotulo_en: "N1 · theoretical", valor: 23.64, cor: "#6ece58" }
      - { rotulo: "N2 · técnico", rotulo_en: "N2 · technical", valor: 15.21, cor: "#26a784" }
      - { rotulo: "N3 · mobilizável", rotulo_en: "N3 · mobilisable", valor: 7.00, cor: "#2a788e" }
      - { rotulo: "N4 · acessível", rotulo_en: "N4 · accessible", valor: 5.97, cor: "#433e85" }
  - tipo: proporcao
    rotulo: "Para onde vai o metano teórico"
    rotulo_en: "Where the theoretical methane goes"
    unidade: "bilhões de m³ por ano"
    unidade_en: "billion m³ a year"
    itens:
      - { rotulo: "fica no campo", rotulo_en: "stays in the field", valor: 8.43, cor: "#b08d3c" }
      - { rotulo: "já tem outro destino", rotulo_en: "already has a use", valor: 8.21, cor: "#a0243a" }
      - { rotulo: "estocagem e estrada", rotulo_en: "storage and road", valor: 1.03, cor: "#3b4c75" }
      - { rotulo: "chega ao N4", rotulo_en: "reaches N4", valor: 5.97, cor: "#433e85" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/funil-sp-2026/sp_funil_biometano.gpkg.zip
    rotulo: "Municípios e pontos da coleção inteira (pranchas 116 a 120), SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities and points for the whole collection (plates 116 to 120), SIRGAS 2000, with QGIS styles"
    tamanho: "4,6 MB"
  - formato: csv
    arquivo: dados/sp_funil_municipios.csv
    rotulo: "Tabela dos municípios (a mesma nas cinco pranchas)"
    rotulo_en: "Municipal table (the same on all five plates)"
    tamanho: "156 kB"
  - formato: csv
    arquivo: dados/sp_funil_substratos.csv
    rotulo: "Os quatro níveis por resíduo e cenário, total do estado"
    rotulo_en: "The four levels by residue and scenario, state total"
    tamanho: "4 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/funil-sp-2026/sp_funil_biometano_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/funil-sp-2026/sp_funil_biometano_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,2 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

versao: "1.0.0"
discussoes: []
---

# O funil do biometano em São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 116, a primeira de cinco da coleção **O funil do biometano**: quanto do potencial teórico de
metano de cada município sobra depois de cada passo do método do CP2B.

## O que vem nos arquivos

- `dados/sp_funil_municipios.csv`: uma linha por município, com todos os campos da coleção. Esta prancha
  usa `n1_m3`, `n2_m3`, `n3_m3`, `n4_m3` (m³ normais de metano por ano), `retencao_pct` (N4 ÷ N1) e
  `n4_biometano_m3_dia`.
- `dados/sp_funil_substratos.csv`: os níveis de cada um dos 17 resíduos no total do estado, nos três
  cenários, com `ja_em_uso_m3` (o que já vira biogás e sai da conta).
- `sp_funil_biometano.gpkg.zip` (na release `funil-sp-2026`): na camada `municipios`, o estilo
  `retencao` reproduz as classes do mapa; os outros estilos são os das pranchas 118 a 120.

## Método

O CP2B (Unicamp) calcula o potencial em quatro níveis,
sempre em m³ normais de metano por ano:

1. **N1, teórico**: o rebanho ou a colheita (IBGE e GEDAVE) vezes a geração de resíduo, os sólidos
   totais e voláteis e o potencial bioquímico de metano (BMP) de cada resíduo.
2. **N2, técnico**: N1 vezes o fator de coleta (FC), o que se consegue recolher. Prancha 117.
3. **N3, mobilizável**: N2 vezes a fração disponível (FCo), o que sobra dos usos que excluem o
   biodigestor, menos o que já vira biogás hoje. Prancha 118.
4. **N4, acessível**: N3 vezes as perdas na estocagem (FS) e o fator logístico (FL), calculado na
   malha viária. Prancha 119.

Os fatores de cada resíduo, com a fonte, estão na tabela de parâmetros do CP2B. Esta prancha usa o
cenário de referência; a prancha 120 mostra o mínimo e o máximo. O biometano por dia é o equivalente
que o próprio método calcula para o N4 (perda de 1 % na purificação e produto com 96 % de metano).

## Limitações

- É modelo, não medição: cada nível depende de fatores tirados da literatura, e o N4 não diz que
  uma usina seria viável, só que o resíduo está ao alcance de uma.
- A retenção é uma razão. Em municípios de potencial pequeno, poucos m³ mudam muito a cor; leia o mapa
  com as perdas em m³ das pranchas 117 a 119.
- O método é da versão 5.1 do CP2B (24/09/2026); os números podem mudar em versões seguintes.
