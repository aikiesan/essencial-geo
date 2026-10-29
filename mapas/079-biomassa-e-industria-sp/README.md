---
numero: 79
titulo: "Onde a biomassa encontra a fábrica"
subtitulo: "Os polos que já têm resíduo e indústria, e os que só têm um dos dois"
data: 2026-10-20
categoria: energia
colecao: bioeconomia-sp
tags: [bioeconomia-sp, sao-paulo, bioeconomia, biometano, cp2b, agroindustria, rais, municipios]

contexto: >-
  Um polo de bioeconomia precisa de duas coisas no mesmo lugar: biomassa e quem saiba transformá-la. A prancha cruza o potencial de biometano dos resíduos (CP2B, nível acessível, cenário de referência) com os vínculos formais da indústria de base biológica (alimentos, bebidas, madeira, papel, fibras e biocombustíveis), cada um em terços dos municípios. Em 115 municípios os dois estão no terço de cima: são os polos, com 61% do biometano do estado e 55% desses vínculos, quase todos no norte e no centro canavieiros. Em 28, sobra biomassa e falta indústria: Brejo Alegre tem 77 mil m³ de biometano por dia e 4 vínculos industriais. Em 43, a indústria é forte e a biomassa é pouca, sobretudo na metrópole: Barueri tem 4.554 vínculos e pouco resíduo próprio. Quarta prancha da coleção «Bioeconomia no trabalho».

imagem: ./mapa_preview.png
imagem_alt: "Mapa bivariado dos municípios de São Paulo em nove cores, de uma grade de três por três: o verde cresce com o potencial de biometano e o ocre, com os vínculos na indústria de base biológica; o marrom-escuro marca os municípios no terço de cima dos dois. O marrom-escuro cobre boa parte do norte e do centro; o verde puro aparece no noroeste e no oeste; o ocre puro, na Grande São Paulo. Chamadas apontam Brejo Alegre, com 77 mil m³ de biometano por dia e 4 vínculos na indústria, e Barueri, com 4.554 vínculos e pouca biomassa. No painel, a grade com o número de municípios em cada célula, os limites dos terços e duas listas: os municípios com muita biomassa e pouca indústria e os com muita indústria e pouca biomassa."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "CP2B (Unicamp) — potencial de biogás e biometano por município, método v5.1"
    nome_en: "CP2B (Unicamp) — biogas and biomethane potential by municipality, method v5.1"
    ano: 2026
  - nome: "MTE/PDET — RAIS 2025: estabelecimentos (RAIS ESTAB PUB), vínculos ativos em 31/12 por subclasse CNAE 2.0 e município"
    nome_en: "MTE/PDET — RAIS 2025: establishments (RAIS ESTAB PUB), active jobs on 31/12 by CNAE 2.0 subclass and municipality"
    url: https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/microdados-rais-e-caged
    ano: 2025
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Potencial de biometano por município (CP2B v5.1, nível N4, cenário de referência) e vínculos ativos em 31/12/2025 na indústria de base biológica (RAIS 2025), cada um dividido em terços dos municípios com valor; o cruzamento dá nove classes."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#6b5f35", descricao: "645 municípios: potencial de biometano do CP2B e vínculos na indústria de base biológica por segmento (mesmo GPKG da prancha 076)", descricao_en: "645 municipalities: CP2B biomethane potential and bio-based industry jobs by segment (same GPKG as plate 076)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Municípios no terço de cima do biometano e da indústria"
    rotulo_en: "Municipalities in the top third for both biomethane and industry"
    valor: 115
    unidade: "municípios"
    unidade_en: "municipalities"
    nota: "61% do biometano e 55% dos vínculos industriais"
    nota_en: "61% of the biomethane and 55% of the industry jobs"
  - tipo: numero
    rotulo: "Municípios com muita biomassa e pouca indústria"
    rotulo_en: "Municipalities with plenty of biomass and little industry"
    valor: 28
    unidade: "municípios"
    unidade_en: "municipalities"
  - tipo: numero
    rotulo: "Municípios com indústria forte e pouca biomassa"
    rotulo_en: "Municipalities with strong industry and little biomass"
    valor: 43
    unidade: "municípios"
    unidade_en: "municipalities"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/bioeconomia-sp-2026/sp_bioeconomia_rais_2025.gpkg.zip
    rotulo: "Municípios com a bioeconomia da RAIS e o potencial do CP2B, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities with the RAIS bioeconomy and the CP2B potential, SIRGAS 2000, with QGIS styles"
    tamanho: "4,5 MB"
  - formato: csv
    arquivo: dados/sp_bioeconomia_municipios_2025.csv
    rotulo: "Tabela dos municípios"
    rotulo_en: "Municipal table"
    tamanho: "90 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/bioeconomia-sp-2026/sp_biomassa_e_industria_2025_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/bioeconomia-sp-2026/sp_biomassa_e_industria_2025_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,2 MB"
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

# Biomassa e indústria de base biológica nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 079, a quarta de cinco da coleção **Bioeconomia no trabalho**. Quem trata o resíduo
urbano está na [prancha 080](../080-quem-trata-o-residuo-sp/README.md).

Na Europa, os estudos de regiões da bioeconomia (o BioRegEU do JRC e os mapas de oferta do S2Biom)
cruzam a biomassa disponível com a indústria capaz de usá-la, para achar os polos e as regiões em
que um dos dois falta. A prancha faz esse cruzamento com o potencial do CP2B e a RAIS.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `biometano`, `biometano_cana`, `biometano_pecuaria`, `biometano_urbano` (m³/dia) e os segmentos `alimentos`, `madeira`, `fibras`, `biocombustiveis` |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

É o **GPKG** da [prancha 076](../076-bioeconomia-no-emprego-sp/README.md). A classe bivariada sai
dos campos acima; o **CSV** tem a tabela dos municípios, sem geometria.

## Método

1. Biomassa: potencial de biometano dos 17 resíduos do CP2B, método v5.1, nível N4 (acessível),
   cenário de referência, em m³ por dia.
2. Indústria de base biológica: vínculos ativos em 31/12/2025 (RAIS 2025) nos segmentos
   alimentos, madeira, fibras e biocombustíveis da prancha 077, sem o campo.
3. Terços dos municípios com valor, fechados à direita: biometano até 5,3 mil, 5,3 a 20,8 mil e
   mais de 20,8 mil m³/dia; indústria até 87, 88 a 886 e mais de 886 vínculos. Os 27 municípios sem
   potencial e os 38 sem vínculo industrial ficam no terço de baixo.
4. Nove classes do cruzamento; a parte dos polos soma o biometano e os vínculos dos 115 municípios
   no terço de cima dos dois.

## Limitações

- O cruzamento é de vizinhança no mapa, não de cadeia: a usina pode estar num município e o resíduo
  que ela usa, no vizinho. Os polos reais se estendem além do limite municipal.
- A indústria é medida pelo emprego formal, que não diz se a fábrica usa ou poderia usar a
  biomassa local.
- Os terços são relativos ao estado: o terço de cima começa em 20,8 mil m³/dia de biometano, que
  já é muito diante de outros estados.
