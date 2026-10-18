---
numero: 76
titulo: "A bioeconomia no emprego"
subtitulo: "Um em cada quinze empregos formais vem da biomassa"
data: 2026-12-06
categoria: energia
colecao: bioeconomia-sp
tags: [bioeconomia-sp, sao-paulo, bioeconomia, emprego, rais, biomassa, municipios]

contexto: >-
  Em 31/12/2025, 1,05 milhão de vínculos formais de São Paulo estavam na bioeconomia: no campo, na pesca e na floresta, e nas indústrias que transformam biomassa por inteiro, como alimentos, bebidas, madeira, papel, fibras naturais, couro e biocombustíveis. É o recorte que o Centro Comum de Investigação (JRC) da Comissão Europeia usa para medir a bioeconomia da União Europeia. São 6,5% dos 16,16 milhões de vínculos do estado, abaixo dos 7,9% do Brasil, mas SP reúne 22% da bioeconomia formal do país. A parte cresce para o oeste: na região de Marília são 20,7%; na de São Paulo, 1,7%. Em 146 municípios, mais de 35% dos empregos formais vêm da biomassa; em Planalto, 80%. A capital tem a maior quantidade, 66 mil vínculos, mas só 1,2% dos seus. Primeira prancha da coleção «Bioeconomia no trabalho».

imagem: ./mapa_preview.png
imagem_alt: "Mapa dos municípios de São Paulo em seis tons de verde, do creme ao verde-escuro, pela parte dos vínculos formais que está na bioeconomia. O oeste e o noroeste são quase todos verde-escuros; a Grande São Paulo, o Vale do Paraíba e o litoral ficam claros. Chamadas apontam Planalto, com 80% dos vínculos na bioeconomia, e a capital, com 1,2% e 66 mil vínculos. No painel, os vínculos da bioeconomia em cada classe e a parte da bioeconomia em cada região intermediária, de 20,7% em Marília a 1,7% em São Paulo."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "MTE/PDET — RAIS 2025: estabelecimentos (RAIS ESTAB PUB), vínculos ativos em 31/12 por subclasse CNAE 2.0 e município"
    nome_en: "MTE/PDET — RAIS 2025: establishments (RAIS ESTAB PUB), active jobs on 31/12 by CNAE 2.0 subclass and municipality"
    url: https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/microdados-rais-e-caged
    ano: 2025
  - nome: "JRC (Comissão Europeia) — Jobs and wealth in the European Union bioeconomy: recorte dos setores da bioeconomia"
    nome_en: "JRC (European Commission) — Jobs and wealth in the European Union bioeconomy: scope of bioeconomy sectors"
    url: https://datam.jrc.ec.europa.eu/datam/mashup/BIOECONOMICS/
    ano: 2024
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Vínculos ativos em 31/12/2025 nas subclasses CNAE da bioeconomia (agropecuária, pesca e floresta; alimentos, bebidas e fumo; madeira, papel e móveis de madeira; fibras naturais e couro; biocombustíveis), no recorte do JRC europeu, sobre todos os vínculos ativos de cada município, em seis classes."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#3b4a22", descricao: "645 municípios: vínculos, vínculos da bioeconomia por segmento, parte e quociente locacional, indústrias geradoras de resíduo orgânico, resíduos e esgoto, potencial de biometano do CP2B e população", descricao_en: "645 municipalities: jobs, bioeconomy jobs by segment, share and location quotient, organic-waste-generating industries, waste and sewage, CP2B biomethane potential and population" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "Vínculos da bioeconomia pela parte da bioeconomia nos vínculos do município"
    rotulo_en: "Bioeconomy jobs by the bioeconomy’s share of the municipality’s jobs"
    unidade: "vínculos"
    unidade_en: "jobs"
    itens:
      - { rotulo: "até 3 %", rotulo_en: "up to 3%", valor: 132856, cor: "#f1efe4" }
      - { rotulo: "3 a 6 %", rotulo_en: "3 to 6%", valor: 109616, cor: "#dcdcbf" }
      - { rotulo: "6 a 12 %", rotulo_en: "6 to 12%", valor: 165914, cor: "#b9bf8e" }
      - { rotulo: "12 a 20 %", rotulo_en: "12 to 20%", valor: 157115, cor: "#8e9c5f" }
      - { rotulo: "20 a 35 %", rotulo_en: "20 to 35%", valor: 215412, cor: "#62743c" }
      - { rotulo: "mais de 35 %", rotulo_en: "over 35%", valor: 272403, cor: "#3b4a22" }
  - tipo: numero
    rotulo: "Vínculos formais na bioeconomia"
    rotulo_en: "Formal jobs in the bioeconomy"
    valor: 6.5
    unidade: "%"
    nota: "1,05 milhão de vínculos; Brasil, 7,9%"
    nota_en: "1.05 million jobs; Brazil, 7.9%"
  - tipo: numero
    rotulo: "Parte de SP na bioeconomia formal do Brasil"
    rotulo_en: "SP’s share of Brazil’s formal bioeconomy"
    valor: 22
    unidade: "%"
    nota: "de 4,74 milhões de vínculos"
    nota_en: "of 4.74 million jobs"

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
    url: https://github.com/aikiesan/essencial-geo/releases/download/bioeconomia-sp-2026/sp_bioeconomia_emprego_2025_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/bioeconomia-sp-2026/sp_bioeconomia_emprego_2025_prancha.en.svg
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

# A bioeconomia no emprego formal dos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 076, a primeira de cinco da coleção **Bioeconomia no trabalho**. Que bioeconomia é essa,
município por município, está na [prancha 077](../077-perfil-da-bioeconomia-sp/README.md).

Na Europa, o JRC e o nova-Institute medem desde 2017 os empregos e o valor adicionado da bioeconomia
de cada país e de cada região (NUTS 2), num painel público. No Brasil não há uma conta assim, nem por
estado nem por município. Esta coleção aplica o mesmo recorte de setores à RAIS 2025, que traz os
vínculos formais de cada estabelecimento.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `vinculos`, `estab`, `bio`, `pct_bio`, `ql_bio` (quociente locacional diante do Brasil), os segmentos `agro`, `alimentos`, `madeira`, `fibras`, `biocombustiveis` e o `dominante`; as indústrias da prancha 078 (`ger`, `g_*`, `g_dominante`), os resíduos da prancha 080 (`res_*`, `res_10mil`), o potencial do CP2B (`biometano`, `biometano_urbano`, `biometano_cana`, `biometano_pecuaria`) e `pessoas` |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

O **GPKG** é o mesmo das cinco pranchas, com os **estilos do QGIS** `pct_bio`, `dominante`,
`g_dominante` e `res_10mil`. O **CSV** tem a tabela dos municípios, sem geometria.

## Método

1. RAIS 2025, arquivo de estabelecimentos (RAIS ESTAB PUB): vínculos ativos em 31/12/2025 por
   subclasse CNAE 2.0 e município; estabelecimentos com RAIS negativa entram com zero. O total do
   Brasil, 59.970.945 vínculos, bate com o estoque da apresentação oficial da RAIS 2025.
2. Bioeconomia, no recorte do JRC: os setores que produzem biomassa (divisões 01 a 03 da CNAE) e os
   que a transformam por inteiro: alimentos, bebidas e fumo (10 a 12); madeira, papel e móveis de
   madeira (16, 17 e 3101-2); fibras naturais e couro (13.11, 13.12, 13.21, 13.22 e 15.10); e
   biocombustíveis (19.31 e 19.32).
3. Parte = vínculos da bioeconomia sobre todos os vínculos ativos do município, em seis classes
   fechadas à direita: até 3%, 3 a 6%, 6 a 12%, 12 a 20%, 20 a 35% e mais de 35%.

## Limitações

- O JRC também conta uma fração dos setores só em parte biológicos, como química, plásticos e
  farmacêutica, pela parte da biomassa nos seus insumos. Sem esses coeficientes para o Brasil, eles
  ficam fora, e a bioeconomia aqui é um piso.
- A RAIS conta só o emprego formal. No campo, onde a informalidade e o trabalho familiar pesam mais,
  a bioeconomia real é maior do que a do mapa.
- O vínculo fica no município do estabelecimento declarante: uma empresa com várias unidades que
  declara tudo pela sede leva os empregos para lá.
