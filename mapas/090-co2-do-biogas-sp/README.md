---
numero: 90
titulo: "O CO₂ do biogás"
subtitulo: "Para virar biometano, o biogás solta o CO₂, quase metade do volume"
data: 2026-10-20
categoria: energia
colecao: carbono-sp
tags: [carbono-sp, sao-paulo, biogas, biometano, purificacao, co2-biogenico, cp2b]

contexto: >-
  O biogás sai do biodigestor com metano e CO₂; o CO₂ ocupa de 32 % a 48 % do volume, conforme o resíduo. Para virar biometano, que entra no gasoduto, o biogás passa por uma purificação que separa esse CO₂, um gás concentrado e biogênico. Se todo o biogás possível em São Paulo fosse feito e purificado, pelo potencial do CP2B (nível N4, cenário de referência), sairiam cerca de 9,1 milhões de t de CO₂ por ano, quase o mesmo que as dornas de etanol soltam numa safra. 82 % viria dos resíduos da cana: vinhaça, torta de filtro, bagaço e palha. Guaíra lidera, com 178 mil t, seguida por Morro Agudo, com 154 mil, e Sertãozinho, com 136 mil; a capital chega a 72 mil t com lixo orgânico, poda e lodo de esgoto. É um potencial, não uma emissão de hoje, e uma estimativa. Segunda prancha da coleção «Carbono biogênico».

imagem: ./mapa_preview.png
imagem_alt: "Mapa coroplético dos municípios de São Paulo em seis tons de marrom, do creme ao marrom-escuro, pelo CO₂ que a purificação do biogás possível separaria por ano. Os tons escuros cobrem quase todo o interior canavieiro, no norte, no oeste e no centro; os claros ficam no litoral, no Vale do Ribeira e no Vale do Paraíba. A capital aparece escura no meio dos vizinhos claros. Uma chamada aponta Guaíra, com 178 mil t por ano, o maior potencial do estado; outra aponta São Paulo, com 72 mil t, do lixo orgânico, da poda e do lodo de esgoto. No painel, barras mostram que 82 % do CO₂ viria dos resíduos da cana e outras dão a parte de CO₂ no biogás de cada resíduo."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "CP2B (Unicamp) — potencial de biogás e biometano por município, método v5.1 (nível N4, cenário de referência)"
    nome_en: "CP2B (Unicamp) — biogas and biomethane potential by municipality, method v5.1 (level N4, reference scenario)"
    ano: 2026
  - nome: "NIST — Chemistry WebBook (massa específica do CO₂ a 0 °C e 1 atm)"
    nome_en: "NIST — Chemistry WebBook (CO₂ density at 0 °C and 1 atm)"
    url: https://webbook.nist.gov/chemistry/
    ano: 2023
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Para cada município e resíduo, o biogás do potencial CP2B v5.1 (nível N4, cenário de referência) vezes a fração do volume que não é metano (1 − fração de CH₄ do resíduo), convertida em massa a 1,977 kg de CO₂ por m³ normal; somado por município e por grupo de resíduo."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#836a44", descricao: "645 municípios: CO₂ da purificação do biogás, total e por grupo (cana, lavouras, pecuária, urbano), e biogás N4 (mesmo GPKG da prancha 089)", descricao_en: "645 municipalities: biogas upgrading CO₂, total and by group (cane, crops, livestock, urban), and N4 biogas (same GPKG as plate 089)" }

indicadores:
  - tipo: proporcao
    rotulo: "De onde viria o CO₂ do biogás"
    rotulo_en: "Where the biogas CO₂ would come from"
    unidade: "t por ano"
    unidade_en: "t a year"
    itens:
      - { rotulo: "resíduos da cana", rotulo_en: "sugarcane residues", valor: 7510094, cor: "#5a4628" }
      - { rotulo: "outras lavouras", rotulo_en: "other crops", valor: 671947, cor: "#836a44" }
      - { rotulo: "pecuária", rotulo_en: "livestock", valor: 593822, cor: "#ab9467" }
      - { rotulo: "lixo, poda e esgoto", rotulo_en: "waste, pruning and sewage", valor: 358123, cor: "#5f7f8f" }
  - tipo: barras
    rotulo: "Maiores municípios"
    rotulo_en: "Largest municipalities"
    unidade: "t de CO₂ por ano"
    unidade_en: "t of CO₂ a year"
    itens:
      - { rotulo: "Guaíra", valor: 177918, cor: "#5a4628" }
      - { rotulo: "Morro Agudo", valor: 154321, cor: "#5a4628" }
      - { rotulo: "Sertãozinho", valor: 136382, cor: "#5a4628" }
      - { rotulo: "Pontal", valor: 119943, cor: "#5a4628" }
      - { rotulo: "Pitangueiras", valor: 112591, cor: "#5a4628" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/carbono-sp-2026/sp_carbono_biogenico.gpkg.zip
    rotulo: "Usinas, municípios, regiões e gasodutos (mesmo arquivo das pranchas 089 a 092), SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Mills, municipalities, regions and pipelines (same file as plates 089 to 092), SIRGAS 2000, with QGIS styles"
    tamanho: "4,7 MB"
  - formato: csv
    arquivo: dados/sp_carbono_municipios.csv
    rotulo: "Tabela dos municípios (a mesma da prancha 091)"
    rotulo_en: "Municipal table (the same as plate 091)"
    tamanho: "74 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/carbono-sp-2026/sp_co2_biogas_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/carbono-sp-2026/sp_co2_biogas_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,2 MB"
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

# O CO₂ da purificação do biogás em São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 090, a segunda de quatro da coleção **Carbono biogênico**: quanto CO₂ sairia da
purificação do biogás possível em cada município, se ele fosse feito e virasse biometano.

## O que vem nos arquivos

- `dados/sp_carbono_municipios.csv`: uma linha por município, com todos os campos da coleção.
  Esta prancha usa `co2_biogas_t` (total), `co2_biogas_cana_t`, `co2_biogas_lavouras_t`,
  `co2_biogas_pecuaria_t`, `co2_biogas_urbano_t` e `biogas_n4_nm3_ano` (biogás do potencial, em
  m³ normais por ano).
- `sp_carbono_biogenico.gpkg.zip` (na release `carbono-sp-2026`): na camada `municipios`, o
  estilo `co2_biogas` reproduz as classes do mapa.

## Método

1. Biogás: o potencial do CP2B, método v5.1, nível N4 (o acessível: do teórico, descontados o
   que não está disponível, o que não se mobiliza e a distância até onde o gás seria produzido),
   no cenário de referência, por município e resíduo.
2. CO₂: o biogás é tomado como metano mais CO₂. O volume de CO₂ é o biogás vezes
   (1 − fração de metano do resíduo), com as frações do CP2B: de 0,52 de metano no lixo orgânico
   (48 % de CO₂) a 0,68 no lodo de esgoto (32 % de CO₂); 0,575 na vinhaça e 0,55 no bagaço e na
   palha.
3. Massa: 1,977 kg de CO₂ por m³ normal (0 °C e 1 atm), pela massa específica do NIST.
4. Grupos: cana (vinhaça, torta de filtro, bagaço e palha), outras lavouras, pecuária e urbano
   (lixo orgânico, poda e lodo de esgoto).

## Limitações

- É potencial, não emissão. O CO₂ só existe se o biogás for produzido e purificado; hoje, a
  maior parte desses resíduos não passa por biodigestor.
- O biogás real tem também vapor d’água, H₂S, nitrogênio e outros traços; tomá-lo como só metano
  e CO₂ superestima um pouco o CO₂.
- Nem toda purificação entrega um CO₂ aproveitável: na separação por membranas ou por lavagem
  com água, a corrente de CO₂ leva parte do metano e precisa de tratamento antes de qualquer uso.
- O CO₂ do biogás da cana e o das dornas (prancha 089) saem da mesma usina, mas de processos
  diferentes; somá-los, como na prancha 092, supõe que ambos sejam aproveitados.
