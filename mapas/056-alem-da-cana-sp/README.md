---
numero: 56
titulo: "Além da cana"
subtitulo: "Sem a cana, aparecem o milho, a granja e a cidade"
data: 2026-10-20
categoria: energia
colecao: biogas-territorio-sp
tags: [biogas-territorio-sp, sao-paulo, biometano, biogas, cp2b, milho, soja, aves, residuos-urbanos, municipios]

contexto: >-
  A cana é a maior fonte de biometano em 370 municípios paulistas e responde por 82% do potencial do estado. Os outros 18%, 3,09 milhões de m³ por dia, desenham outro mapa. Tirada a cana, a palha de milho e soja lidera em 192 municípios, espalhados pelo oeste e contínuos no sul e no sudoeste, de Itapeva a Itapetininga; o lixo orgânico e a poda urbana lideram em 174, da Grande São Paulo ao Vale do Paraíba e às cidades médias do interior; as granjas de aves, em 170, sobretudo no centro e no norte do estado, de Bastos a Mococa. O gado de leite e confinado lidera em 48 municípios, o café em 16, a laranja em 13. A capital tem o maior potencial fora da cana, 144 mil m³ por dia, do lixo e do esgoto; no interior, o maior é Bastos, com 73 mil, das granjas. Segunda prancha da coleção «Biogás no território».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com os municípios coloridos pela maior fonte de biometano sem contar a cana: amarelo-ouro para palha de milho e soja, que domina o sul e o sudoeste; azul-escuro para lixo orgânico e poda, que cobre a Grande São Paulo, o litoral e o Vale do Paraíba e salpica o oeste; cor de argila para aves, no centro e no norte; ameixa para bovinos; marrom para café, no nordeste; laranja para bagaço de laranja, no centro; rosa para suínos; e azul-claro para lodo de esgoto, só em Taubaté. Chamadas apontam Bastos, com 73 mil m³ por dia das granjas de aves, e Itapeva, com 72 mil da palha de milho e soja. No painel, a legenda traz quantos municípios cada fonte lidera e quanto biometano soma no estado, e barras mostram os seis municípios com mais biometano fora da cana."

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
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Potencial de biometano por município e por resíduo (método CP2B v5.1, nível N4, cenário de referência), sem os quatro resíduos da cana, somado em oito fontes; cada município recebe a fonte de maior potencial."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#d9a441", descricao: "645 municípios: potencial por fonte fora da cana e maior fonte (mesmo GPKG da prancha 055)", descricao_en: "645 municipalities: potential by non-cane source and largest source (same GPKG as plate 055)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "Municípios pela maior fonte fora da cana"
    rotulo_en: "Municipalities by largest source outside sugarcane"
    unidade: "municípios"
    unidade_en: "municipalities"
    itens:
      - { rotulo: "palha de milho e soja", rotulo_en: "maize and soy straw", valor: 192, cor: "#d9a441" }
      - { rotulo: "lixo orgânico e poda urbana", rotulo_en: "organic waste and tree pruning", valor: 174, cor: "#234e70" }
      - { rotulo: "aves de corte e postura", rotulo_en: "broilers and layers", valor: 170, cor: "#9c4a32" }
      - { rotulo: "bovinos de leite e confinados", rotulo_en: "dairy and feedlot cattle", valor: 48, cor: "#6b3d5c" }
      - { rotulo: "casca de café", rotulo_en: "coffee husk", valor: 16, cor: "#7a5230" }
      - { rotulo: "bagaço de laranja", rotulo_en: "orange bagasse", valor: 13, cor: "#e07b39" }
      - { rotulo: "suínos", rotulo_en: "pigs", valor: 3, cor: "#c9879a" }
      - { rotulo: "lodo de esgoto", rotulo_en: "sewage sludge", valor: 1, cor: "#5f9fb5" }
      - { rotulo: "só cana, ou sem potencial", rotulo_en: "cane only, or no potential", valor: 28, cor: "#eef0f1" }
  - tipo: numero
    rotulo: "Potencial de biometano fora da cana"
    rotulo_en: "Biomethane potential outside sugarcane"
    valor: 3089988
    unidade: "m³/dia"
    unidade_en: "m³/day"
    nota: "18% dos 16,9 milhões de m³/dia do estado"
    nota_en: "18% of the state’s 16.9 million m³/day"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biogas-territorio-sp-2026/sp_biogas_territorio.gpkg.zip
    rotulo: "Municípios e infraestrutura (mesmo arquivo das pranchas 055 a 059), SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities and infrastructure (same file as plates 055 to 059), SIRGAS 2000, with QGIS styles"
    tamanho: "4,9 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biogas-territorio-sp-2026/sp_biometano_alem_da_cana_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/biogas-territorio-sp-2026/sp_biometano_alem_da_cana_prancha.en.svg
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

# Além da cana: a maior fonte de biometano fora do canavial

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 056, a segunda de cinco da coleção **Biogás no território**. A
[prancha 050](../050-biometano-sp/README.md) mostra que a cana lidera em 370 municípios; esta
tira a cana da conta e pergunta o que vem depois.

## O que vem nos arquivos

O GPKG e o CSV são os da [prancha 055](../055-densidade-do-biometano-sp/README.md). Na camada
`municipios`, o campo `lider_fora_da_cana` traz a fonte que lidera (`graos`, `citros`, `cafe`,
`aves`, `bovinos`, `suinos`, `lixo`, `esgoto`), e os campos `*_m3d` trazem o potencial de cada
uma. O estilo do QGIS desta prancha é `fora_da_cana`.

## Método

1. Potencial por resíduo: CP2B (Unicamp), método v5.1, nível N4 (acessível), cenário de
   referência, em m³ de biometano por dia.
2. Fora da cana: tudo menos palha, bagaço, torta de filtro e vinhaça.
3. Oito fontes: palha de milho e soja; bagaço de laranja; casca de café; aves de corte e postura;
   bovinos de leite, confinados e de pasto misto; suínos; lixo orgânico e poda urbana; lodo de
   esgoto.
4. Cada município recebe a fonte de maior potencial. Os 28 municípios só com cana ou sem potencial
   ficam em cinza-claro.

## Limitações

- Liderar não quer dizer ser muito: em boa parte dos municípios, a fonte que lidera fora da cana
  é pequena perto da cana.
- No nível acessível, o gado a pasto dá zero no estado; os bovinos que aparecem são de leite e
  confinados.
- O bagaço de laranja é alocado às fábricas de suco, e não aos pomares (veja a prancha Nº 047).
