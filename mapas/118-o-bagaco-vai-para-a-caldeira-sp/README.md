---
numero: 118
titulo: "O bagaço vai para a caldeira"
subtitulo: "Nove décimos do bagaço já viram vapor e eletricidade nas usinas; para o biodigestor sobra o excedente"
data: 2026-11-10
categoria: energia
colecao: funil-sp
tags: [funil-sp, sao-paulo, biogas, biometano, bagaco, cogeracao, usos-concorrentes, cp2b]

contexto: >-
  O segundo passo do funil do biometano tira do potencial o que já tem outro destino: 8,2 bilhões de m³ de metano por ano, 35 % do teórico de São Paulo (CP2B, do N2 ao N3, cenário de referência). Quase tudo, 7,5 bilhões, é bagaço de cana, que as usinas queimam nas caldeiras para gerar vapor e eletricidade; o método respeita esse uso e só conta como disponível o excedente, 10 % do bagaço. O resto do passo é pequeno: 0,37 bilhão de palha, grãos, cama de aviário e poda com outro uso, 0,12 de bagaço de laranja que vira ração e 0,23 que já vira biogás hoje, 71 % dele do lixo dos aterros. O mapa segue a cana: Guaíra e Sertãozinho passam de 240 milhões de m³ cada; a Região Metropolitana e o Vale do Paraíba quase não aparecem, a não ser pelo biogás que já existe, 70 milhões de m³ na capital. É modelo, não medição. Terceira prancha da coleção «O funil do biometano».

imagem: ./mapa_preview.png
imagem_alt: "Mapa coroplético dos municípios de São Paulo em seis tons, do amarelo-claro ao vinho, pelo metano que o resíduo recolhido daria mas que já tem outro destino. O vinho, de mais de 100 milhões de m³ por ano, forma manchas no norte, em volta de Guaíra, Barretos e Ribeirão Preto, e no oeste, perto de Araçatuba e de Presidente Prudente; o leste, a Região Metropolitana, o Vale do Paraíba, o Vale do Ribeira e o litoral ficam em amarelo-claro. Anéis azuis marcam o biogás que já existe, o maior na capital. Chamadas apontam Guaíra, com 244 milhões de m³ de metano do bagaço que vai para a caldeira, Guariba, com 37 milhões de m³ de vinhaça, torta, bagaço e palha que já viram biogás, e São Paulo, com 70 milhões de m³ do lixo que já é captado. No painel, barras mostram para onde vai: 7,47 bilhões de m³ do bagaço para caldeira e cogeração, 0,37 de palha, grãos, aves e poda, 0,12 de bagaço de laranja para ração, 0,02 de casca de café para secadores e 0,23 que já vira biogás."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "CP2B (Unicamp) — potencial de biogás e biometano por município e resíduo, níveis N2 e N3, método v5.1; fração disponível (FCo) por resíduo e uso existente de biogás (ANEEL, SIGA)"
    nome_en: "CP2B (Unicamp) — biogas and biomethane potential by municipality and residue, levels N2 and N3, method v5.1; available fraction (FCo) by residue and existing biogas use (ANEEL, SIGA)"
    ano: 2026
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Para cada município e resíduo, o potencial técnico (N2) vezes um menos a fração disponível (FCo) do CP2B v5.1, em m³ normais de metano por ano, cenário de referência: o metano dos usos concorrentes, agrupado por destino (bagaço de cana, bagaço de laranja, casca de café, outros). Os anéis são o que já vira biogás e o método desconta para chegar ao N3."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#a0243a", descricao: "645 municípios; o estilo usos_concorrentes reproduz as classes do mapa (mesmo GPKG das pranchas 116 a 120)", descricao_en: "645 municipalities; the usos_concorrentes style reproduces the map’s classes (same GPKG as plates 116 to 120)" }

indicadores:
  - tipo: proporcao
    rotulo: "Para onde vai o metano com outro destino"
    rotulo_en: "Where the methane with another use goes"
    unidade: "bilhões de m³ por ano"
    unidade_en: "billion m³ a year"
    itens:
      - { rotulo: "bagaço: caldeira e cogeração", rotulo_en: "bagasse: boilers and cogeneration", valor: 7.47, cor: "#5c1340" }
      - { rotulo: "palha, grãos, aves e poda", rotulo_en: "straw, grain, poultry and prunings", valor: 0.37, cor: "#d4512f" }
      - { rotulo: "bagaço de laranja: ração", rotulo_en: "orange bagasse: animal feed", valor: 0.12, cor: "#f08c3f" }
      - { rotulo: "casca de café: secadores", rotulo_en: "coffee husk: dryers", valor: 0.02, cor: "#fbc76a" }
      - { rotulo: "já vira biogás hoje", rotulo_en: "already becomes biogas", valor: 0.23, cor: "#2a788e" }
  - tipo: barras
    rotulo: "Maiores municípios"
    rotulo_en: "Largest municipalities"
    unidade: "milhões de m³ de metano por ano"
    unidade_en: "million m³ of methane a year"
    itens:
      - { rotulo: "Guaíra", valor: 244.4, cor: "#5c1340" }
      - { rotulo: "Sertãozinho", valor: 241.8, cor: "#5c1340" }
      - { rotulo: "Ariranha", valor: 190.9, cor: "#5c1340" }
      - { rotulo: "Pontal", valor: 183.8, cor: "#5c1340" }
      - { rotulo: "Pirassununga", valor: 167.1, cor: "#5c1340" }

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
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/funil-sp-2026/sp_funil_usos_concorrentes_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/funil-sp-2026/sp_funil_usos_concorrentes_prancha.en.svg
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

# O bagaço que vai para a caldeira em São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 118, a terceira de cinco da coleção **O funil do biometano**: o segundo passo do funil, do
potencial técnico (N2) ao mobilizável (N3), e o metano que já tem outro destino em cada município.

## O que vem nos arquivos

- `dados/sp_funil_municipios.csv`: uma linha por município. Esta prancha usa `perda_usos_m3` (usos
  concorrentes), `usos_bagaco_m3`, `usos_citros_m3`, `usos_cafe_m3`, `usos_outros_m3`, `ja_em_uso_m3`
  (o que já vira biogás) e `ja_em_uso_rsu_m3` (a parte que vem do lixo).
- `sp_funil_biometano.gpkg.zip` (na release `funil-sp-2026`): na camada `municipios`, o estilo
  `usos_concorrentes` reproduz as classes do mapa.

## Método

1. Para cada município e resíduo, o N2 do CP2B v5.1 vezes um menos a fração disponível (FCo): o que
   vai para usos que excluem o biodigestor. No cenário de referência, o FCo do bagaço de cana é 10 %
   (5 % no mínimo, 15 % no máximo): o resto vai para as caldeiras.
2. Os destinos: bagaço de cana (caldeira e cogeração), bagaço de laranja (ração), casca de café
   (secadores) e outros (palha, grãos, cama de aviário e poda).
3. Do que sobra, o método desconta o que já vira biogás hoje (aterros, estações de esgoto, usinas),
   para não contar duas vezes; isso dá o N3. Os anéis do mapa mostram esse desconto quando passa de
   2 milhões de m³.

## Limitações

- O uso concorrente não é desperdício: o bagaço queimado gera a energia das próprias usinas e a
  eletricidade que elas vendem. O mapa mostra o que o biodigestor não disputa, não o que se perde.
- O FCo é um fator por resíduo, igual em todo o estado; uma usina que já tem excedente de bagaço ou
  que já faz biogás de vinhaça não aparece diferente das outras, a não ser pelo desconto do biogás
  existente.
- É modelo, não medição; a prancha 120 mostra quanto o resultado muda entre os cenários.
