---
numero: 117
titulo: "O que fica no campo"
subtitulo: "A palha protege o solo e o esterco do pasto não se recolhe: um terço do teórico nunca sai da terra"
data: 2026-11-10
categoria: energia
colecao: funil-sp
tags: [funil-sp, sao-paulo, biogas, biometano, palha, esterco, coleta, cp2b]
rascunho: true                      # fora do ar: resguardo de artigo em preparação

contexto: >-
  O primeiro passo do funil do biometano é o mais largo: 8,4 bilhões de m³ de metano por ano, 36 % do potencial teórico de São Paulo, ficam no campo porque o resíduo não pode ou não deve ser recolhido (CP2B, do N1 ao N2, cenário de referência). Mais da metade, 5,0 bilhões, é palha de cana: o método recolhe 40 % dela e deixa o resto cobrindo o solo, contra a erosão e a perda de umidade. Outros 1,38 bilhão são o esterco do gado no pasto, que se espalha e não se junta; 0,95 bilhão é palha de soja e de milho. A palha de cana é a maior causa em 350 municípios, com Morro Agudo e Guaíra à frente, cerca de 104 milhões de m³ cada; o esterco de pasto lidera em 165, onde há pouca cana: no Vale do Paraíba, no leste e no sul do estado e no Pontal do Paranapanema. É modelo, não medição. Segunda prancha da coleção «O funil do biometano».

imagem: ./mapa_preview.png
imagem_alt: "Mapa de círculos proporcionais sobre os municípios de São Paulo em cinza-claro: cada círculo tem a área do metano que fica no campo e a cor da maior causa. Círculos grandes cor de palha cobrem o norte e o centro canavieiros; círculos menores cor de tijolo, de esterco no pasto, ficam no extremo oeste, no Vale do Paraíba e espalhados pelo leste e pelo sul; círculos verde-oliva, de palha de soja e milho, no sudoeste, perto de Itapeva; círculos cinza, de outros resíduos, na capital, em volta dela e em cidades do interior. Chamadas apontam Morro Agudo, com 104 milhões de m³ de palha que fica no canavial, e Presidente Bernardes, com 19 milhões de m³ de esterco espalhado no pasto. No painel, barras mostram as quatro causas: 5,05 bilhões de m³ de palha de cana, 1,38 de esterco de pasto, 0,95 de palha de grãos e 1,06 de outros resíduos."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "CP2B (Unicamp) — potencial de biogás e biometano por município e resíduo, níveis N1 e N2, método v5.1; fator de coleta (FC) por resíduo"
    nome_en: "CP2B (Unicamp) — biogas and biomethane potential by municipality and residue, levels N1 and N2, method v5.1; collection factor (FC) by residue"
    ano: 2026
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Para cada município e resíduo, o potencial teórico (N1) menos o técnico (N2) do CP2B v5.1, em m³ normais de metano por ano, cenário de referência; somado por município e agrupado em quatro causas (palha de cana, esterco de gado no pasto, palha de soja e milho, outros). O círculo fica no ponto interno do município e tem a cor da causa de maior volume."

camadas:
  - { nome: perda_na_coleta, tipo: ponto, cor: "#b08d3c", descricao: "Ponto interno de cada município com metano que fica no campo, por causa, e a maior causa", descricao_en: "Interior point of each municipality with methane left in the field, by cause, and the largest cause" }
  - { nome: municipios, tipo: poligono, cor: "#2a788e", descricao: "645 municípios com todos os campos da coleção (mesmo GPKG das pranchas 116 a 120)", descricao_en: "645 municipalities with all the collection’s fields (same GPKG as plates 116 to 120)" }

indicadores:
  - tipo: proporcao
    rotulo: "Por que o metano fica no campo"
    rotulo_en: "Why the methane stays in the field"
    unidade: "bilhões de m³ por ano"
    unidade_en: "billion m³ a year"
    itens:
      - { rotulo: "palha de cana deixada no solo", rotulo_en: "cane straw left on the soil", valor: 5.05, cor: "#b08d3c" }
      - { rotulo: "esterco do gado no pasto", rotulo_en: "manure from grazing cattle", valor: 1.38, cor: "#8c4a3a" }
      - { rotulo: "palha de soja e de milho", rotulo_en: "soy and maize straw", valor: 0.95, cor: "#6f7f3a" }
      - { rotulo: "outros resíduos", rotulo_en: "other residues", valor: 1.06, cor: "#5f6670" }
  - tipo: barras
    rotulo: "Maiores municípios"
    rotulo_en: "Largest municipalities"
    unidade: "milhões de m³ de metano por ano"
    unidade_en: "million m³ of methane a year"
    itens:
      - { rotulo: "Morro Agudo", valor: 104.4, cor: "#b08d3c" }
      - { rotulo: "Guaíra", valor: 103.6, cor: "#b08d3c" }
      - { rotulo: "Barretos", valor: 90.6, cor: "#b08d3c" }
      - { rotulo: "Rancharia", valor: 82.0, cor: "#b08d3c" }
      - { rotulo: "Itapeva", valor: 66.2, cor: "#6f7f3a" }

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
    url: https://github.com/aikiesan/essencial-geo/releases/download/funil-sp-2026/sp_funil_coleta_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/funil-sp-2026/sp_funil_coleta_prancha.en.svg
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

# O metano que fica no campo em São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 117, a segunda de cinco da coleção **O funil do biometano**: o primeiro passo do funil, do
potencial teórico (N1) ao técnico (N2), e o que fica no campo em cada município.

## O que vem nos arquivos

- `dados/sp_funil_municipios.csv`: uma linha por município. Esta prancha usa `perda_coleta_m3` (N1 − N2),
  `coleta_palha_cana_m3`, `coleta_esterco_pasto_m3`, `coleta_palha_graos_m3`, `coleta_outros_m3`,
  `causa_coleta` (a maior das quatro) e `perda_coleta_pct` (parte do N1).
- `sp_funil_biometano.gpkg.zip` (na release `funil-sp-2026`): a camada `perda_na_coleta` traz o estilo
  `coleta`, com círculos do tamanho e da cor da prancha.

## Método

1. Para cada município e resíduo, a diferença entre o nível teórico (N1) e o técnico (N2) do CP2B v5.1,
   no cenário de referência. O N2 é o N1 vezes o fator de coleta (FC) do resíduo.
2. Os fatores de coleta do cenário de referência: 40 % da palha de cana, 30 % da palha de soja, 40 % da de milho, 50 % do esterco de vacas de leite,
   65 % do gado confinado, 85 % dos suínos, 65 % do lixo orgânico e nada do esterco do gado em pasto
   (até 10 % no cenário máximo, para o curral do sistema misto).
3. Quatro causas: palha de cana, esterco de gado no pasto, palha de soja e de milho, e outros resíduos
   (lixo, lodo, poda, granjas, vinhaça, bagaço). A cor do círculo é a de maior volume no município.

## Limitações

- Deixar palha no solo não é perda para o sistema agrícola: ela protege contra a erosão, guarda água e
  devolve carbono e nutrientes. O fator de coleta é uma escolha agronômica, não um desperdício.
- O esterco de pasto é contado no N1 para mostrar o tamanho do que não se recolhe; não é um potencial.
- O círculo fica no ponto interno do município, não onde está a lavoura ou o rebanho.
- É modelo, não medição; a prancha 120 mostra quanto o resultado muda entre os cenários.
