---
numero: 55
titulo: "Biometano por km² e por pessoa"
subtitulo: "O gás está onde a gente não está"
data: 2026-11-15
categoria: energia
colecao: biogas-territorio-sp
tags: [biogas-territorio-sp, sao-paulo, biometano, biogas, cp2b, densidade, censo-2022, municipios]

contexto: >-
  Os resíduos de São Paulo dariam 16,9 milhões de m³ de biometano por dia no nível acessível do método CP2B. Dividido pela população, isso dá 0,38 m³ por pessoa por dia. Mas o gás não mora onde mora a gente. Por km², o potencial é mais denso no norte canavieiro: Ariranha chega a 1.326 m³ por dia em cada km². Por habitante, os campeões são municípios pequenos e cheios de cana, como Borá, com 41 m³ por pessoa por dia, enquanto a capital, que tem o maior potencial urbano, fica em 0,013. O potencial também é concentrado: 25 municípios somam um quarto do total, 68 somam metade e 148, três quartos. A prancha 050 mostra quanto cada município tem; esta mostra quanto isso pesa no chão e por pessoa. Primeira prancha da coleção «Biogás no território».

imagem: ./mapa_preview.png
imagem_alt: "Prancha com três mapas municipais de São Paulo e um gráfico. No primeiro, o biometano por km² em verdes, mais escuro no norte e no centro do estado. No segundo, o biometano por habitante, do creme ao marrom-escuro: o interior fica escuro e a Grande São Paulo, o litoral e o Vale do Ribeira ficam claros; uma chamada mostra a capital com 0,013 m³ por habitante por dia. No terceiro, os municípios em quatro tons de verde pelo quarto do potencial do estado a que pertencem: 25 municípios no primeiro quarto, 43 no segundo, 80 no terceiro e 470 no último. O gráfico é a curva de concentração do potencial, com os pontos de 25, 68 e 148 municípios. No painel, barras com os seis municípios de maior potencial por km², liderados por Ariranha."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "CP2B (Unicamp) — potencial de biogás e biometano por município, método v5.1"
    nome_en: "CP2B (Unicamp) — biogas and biomethane potential by municipality, method v5.1"
    ano: 2026
  - nome: "IBGE — Censo Demográfico 2022: agregados por setor censitário (população)"
    nome_en: "IBGE — 2022 Population Census: census tract aggregates (population)"
    url: https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025 (área dos municípios)"
    nome_en: "IBGE — Municipal Mesh 2025 (municipal area)"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Potencial de biometano de 17 resíduos por município (método CP2B v5.1, nível N4, cenário de referência), dividido pela área da Malha Municipal 2025 e pela população do Censo 2022; municípios ordenados pelo potencial e agrupados pelo quarto do total do estado a que pertencem."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#2f5d3a", descricao: "645 municípios: potencial por grupo e por fonte, por km² e por habitante, quarto do potencial, maior fonte fora da cana e distâncias à infraestrutura", descricao_en: "645 municipalities: potential by group and source, per km² and per inhabitant, quarter of the potential, largest non-cane source and distances to infrastructure" }
  - { nome: gasodutos_transporte, tipo: linha, cor: "#6b3d5c", descricao: "13 gasodutos de transporte existentes em SP e no entorno", descricao_en: "13 existing transmission gas pipelines in and around SP" }
  - { nome: gasodutos_distribuicao, tipo: linha, cor: "#c08a2e", descricao: "Redes de 8 distribuidoras de gás em SP e no entorno", descricao_en: "Networks of 8 gas distributors in and around SP" }
  - { nome: pontos_entrega, tipo: ponto, cor: "#6b3d5c", descricao: "62 pontos de entrega de gás existentes", descricao_en: "62 existing gas delivery points" }
  - { nome: linhas_transmissao, tipo: linha, cor: "#9c4a32", descricao: "493 linhas de transmissão da rede básica (230 kV ou mais)", descricao_en: "493 basic-grid transmission lines (230 kV or more)" }
  - { nome: subestacoes, tipo: ponto, cor: "#1a1c1e", descricao: "185 subestações da rede básica", descricao_en: "185 basic-grid substations" }
  - { nome: plantas_biometano, tipo: ponto, cor: "#234e70", descricao: "9 plantas de biometano da ANP, no município", descricao_en: "9 ANP biomethane plants, at the municipality" }
  - { nome: gd_biogas, tipo: ponto, cor: "#9c4a32", descricao: "Geração distribuída a biogás da ANEEL somada por município (24)", descricao_en: "ANEEL biogas distributed generation summed by municipality (24)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "Municípios por quarto do potencial do estado"
    rotulo_en: "Municipalities by quarter of the state’s potential"
    unidade: "municípios"
    unidade_en: "municipalities"
    itens:
      - { rotulo: "1º quarto", rotulo_en: "1st quarter", valor: 25, cor: "#2f5d3a" }
      - { rotulo: "2º quarto", rotulo_en: "2nd quarter", valor: 43, cor: "#6f9468" }
      - { rotulo: "3º quarto", rotulo_en: "3rd quarter", valor: 80, cor: "#b3c39c" }
      - { rotulo: "4º quarto", rotulo_en: "4th quarter", valor: 470, cor: "#e3e8d6" }
      - { rotulo: "sem potencial", rotulo_en: "no potential", valor: 27, cor: "#eef0f1" }
  - tipo: numero
    rotulo: "Biometano por habitante, média do estado"
    rotulo_en: "Biomethane per inhabitant, state average"
    valor: 0.38
    unidade: "m³/dia"
    unidade_en: "m³/day"
  - tipo: numero
    rotulo: "Maior densidade (Ariranha)"
    rotulo_en: "Highest density (Ariranha)"
    valor: 1326
    unidade: "m³/dia por km²"
    unidade_en: "m³/day per km²"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biogas-territorio-sp-2026/sp_biogas_territorio.gpkg.zip
    rotulo: "Municípios, gasodutos, pontos de entrega, linhas, subestações, plantas e GD (pranchas 055 a 059), SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities, pipelines, delivery points, lines, substations, plants and DG (plates 055 to 059), SIRGAS 2000, with QGIS styles"
    tamanho: "4,9 MB"
  - formato: csv
    arquivo: dados/sp_biogas_territorio_municipios.csv
    rotulo: "Tabela dos municípios (pranchas 055 a 059)"
    rotulo_en: "Municipal table (plates 055 to 059)"
    tamanho: "100 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/biogas-territorio-sp-2026/sp_biometano_densidade_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/biogas-territorio-sp-2026/sp_biometano_densidade_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "5,8 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

versao: "1.0.0"
discussoes: []
---

# Biometano por km² e por pessoa nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 055, a primeira de cinco da coleção **Biogás no território**, que leva o potencial de
biometano das pranchas [049](../049-lixo-e-esgoto-sp/README.md) e [050](../050-biometano-sp/README.md)
para o chão: quanto pesa por km² e por pessoa, de que fonte vem fora da cana, a que distância
está dos gasodutos e da rede elétrica e quanto já virou planta.

## O que vem nos arquivos

Um só GeoPackage serve as cinco pranchas da coleção.

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `pessoas`, `area_km2`, `biometano_m3d` e os grupos (`cana_m3d`, `lavouras_m3d`, `pecuaria_m3d`, `urbano_m3d`), as fontes fora da cana (`graos_m3d`, `citros_m3d`, `cafe_m3d`, `aves_m3d`, `bovinos_m3d`, `suinos_m3d`, `lixo_m3d`, `esgoto_m3d`), `m3d_por_km2`, `m3d_por_hab`, `concentracao` (1 a 4), `pct_cana`, `lider_fora_da_cana`, distâncias em km (`km_gasoduto_transporte`, `km_gasoduto_distribuicao`, `km_gasoduto`, `km_ponto_entrega`, `km_subestacao`, `km_linha_transmissao`), `anp_capacidade_m3d` e `gd_biogas_kw` |
| `gasodutos_transporte`, `gasodutos_distribuicao` | linha | gasodutos existentes em SP e até cerca de 60 km da divisa; `em_sp` = 1 quando entram no estado |
| `pontos_entrega` | ponto | pontos de entrega de gás existentes |
| `linhas_transmissao`, `subestacoes` | linha, ponto | rede básica existente, com tensão e ano de operação |
| `plantas_biometano` | ponto | plantas de biometano da ANP: capacidade autorizada, biogás processado e uso no mês |
| `gd_biogas` | ponto | geração distribuída a biogás somada por município, por tipo de resíduo |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

A camada `municipios` traz sete **estilos do QGIS** (`por_km2` é o padrão). O **CSV** tem a mesma
tabela, sem geometria. Os municípios em `plantas_biometano` e `gd_biogas` ficam num ponto
interno do município, não no endereço da planta.

## Método

1. Potencial: CP2B (Unicamp), método v5.1, nível N4 (acessível), cenário de referência, em m³ de
   biometano equivalente por dia, somado nos 17 resíduos do modelo.
2. Por km²: sobre a área oficial da Malha Municipal 2025. Por habitante: sobre a população do
   Censo 2022, somada dos setores censitários.
3. Concentração: municípios do maior potencial ao menor; cada um recebe o quarto do total do
   estado em que começa (25 municípios no primeiro, 43 no segundo, 80 no terceiro, 470 no último).
4. Classes dos dois primeiros mapas: quantis dos 618 municípios com potencial.

## Limitações

- Por habitante não quer dizer que o gás seria usado ali: um município pequeno e canavieiro tem
  muito gás por pessoa e pouca gente para consumi-lo.
- O potencial é técnico e modelado: diz quanto gás os resíduos dariam, não quanto se produz.
