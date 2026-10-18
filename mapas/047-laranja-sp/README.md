---
numero: 47
titulo: "O cinturão da laranja"
subtitulo: "O pomar no campo, o bagaço na fábrica"
data: 2026-11-07
categoria: uso-do-solo
colecao: agro-sp
tags: [agro-sp, sao-paulo, laranja, citros, agricultura, biometano, cp2b, ibge, pam]

contexto: >-
  São Paulo colheu 12,0 milhões de toneladas de laranja em 2024, em 354.562 hectares. Em 2008 eram 14,5 milhões de toneladas em 592.566 hectares: a área caiu 40%, e cada hectare passou a dar 34 toneladas em vez de 25. O cinturão também desceu para o sudoeste. A região de Araraquara colhia 3,4 milhões de toneladas e hoje colhe 1,2; a de Sorocaba subiu de 1,0 para 2,4 milhões e é a maior do estado. Casa Branca lidera, com 550 mil toneladas, seguida de Botucatu e Avaré, e 82 municípios deixaram a laranja. O bagaço, porém, fica onde a fruta vira suco. O método CP2B o põe em 14 municípios com fábrica, e Matão, que colhe 108 mil toneladas, recebe o maior potencial: 22.752 m³ de biometano por dia, de um total de 101.834. Terceira prancha da coleção «Do campo ao biometano».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com os municípios coloridos pela produção de laranja em 2024, em seis classes do creme ao vermelho-escuro (até 360 toneladas, até 3,6 mil, 11 mil, 25 mil, 64 mil e de 64 mil a 550 mil). O vermelho-escuro forma um arco do norte, perto de Colômbia, pelo centro até o sudoeste, onde se concentram Botucatu, Avaré e Iaras; o oeste, o Vale do Paraíba e o litoral ficam quase vazios. Listras alaranjadas marcam os 82 municípios que colhiam laranja em 2008 e não colhem mais, espalhados pelas bordas do cinturão. Catorze círculos azul-petróleo, proporcionais ao biometano que o bagaço daria, ficam no centro-norte do estado, em volta de Matão, Araraquara e Bebedouro, longe dos maiores pomares. Chamadas: Casa Branca, 550 mil toneladas, o maior produtor; Matão, 22.752 m³ por dia, onde a laranja vira suco."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Produção Agrícola Municipal (PAM), tabela 1613: lavouras permanentes"
    nome_en: "IBGE — Municipal Agricultural Production (PAM), table 1613: permanent crops"
    url: https://sidra.ibge.gov.br/tabela/1613
    ano: "2008 a 2024"
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
metodo: "Produção de laranja da PAM 2024 por município em seis classes por quantis; listras onde houve área colhida em 2008 e nenhuma em 2024; círculos com o potencial de biometano do bagaço no nível acessível do método CP2B, alocado às fábricas de suco."

camadas:
  - { nome: bagaco_nas_fabricas, tipo: ponto, descricao: "14 municípios que recebem o bagaço no método CP2B, com o biometano (m³/dia)", descricao_en: "14 municipalities that receive the bagasse in the CP2B method, with the biomethane (m³/day)" }
  - { nome: municipios, tipo: poligono, descricao: "645 municípios: área colhida e produção de laranja em 2008 e 2024, parte do território, se deixou a laranja e biometano do bagaço", descricao_en: "645 municipalities: harvested area and orange production in 2008 and 2024, share of territory, whether oranges were given up, and bagasse biomethane" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Produção de laranja em 2024"
    rotulo_en: "Orange production in 2024"
    valor: 12002362
    unidade: "t"
    nota: "Em 2008 foram 14.537.610 t, colhidas em 592.566 ha; em 2024, em 354.562 ha"
    nota_en: "In 2008 it was 14,537,610 t, harvested from 592,566 ha; in 2024, from 354,562 ha"
  - tipo: numero
    rotulo: "Biometano do bagaço de laranja"
    rotulo_en: "Biomethane from orange bagasse"
    valor: 101834
    unidade: "m³/dia"
    unidade_en: "m³/day"
    nota: "Nível acessível do método CP2B, no cenário de referência, em 14 municípios com fábrica de suco"
    nota_en: "Accessible level of the CP2B method, reference scenario, in 14 municipalities with juice mills"
  - tipo: barras
    rotulo: "Maiores produtores em 2024"
    rotulo_en: "Largest growers in 2024"
    unidade: "t"
    itens:
      - { rotulo: "Casa Branca", valor: 550000, cor: "#b30000" }
      - { rotulo: "Botucatu", valor: 436780, cor: "#b30000" }
      - { rotulo: "Avaré", valor: 414710, cor: "#b30000" }
      - { rotulo: "Iaras", valor: 346800, cor: "#b30000" }
      - { rotulo: "Colômbia", valor: 337621, cor: "#b30000" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/agro-sp-2026/sp_laranja_2024.gpkg.zip
    rotulo: "Quatro camadas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Four layers, SIRGAS 2000, with QGIS styles"
    tamanho: "18,5 MB"
  - formato: csv
    arquivo: dados/sp_laranja_2024.csv
    rotulo: "Laranja em 2008 e 2024 e biometano do bagaço por município"
    rotulo_en: "Oranges in 2008 and 2024 and bagasse biomethane by municipality"
    tamanho: "53 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/agro-sp-2026/sp_laranja_2024_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/agro-sp-2026/sp_laranja_2024_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,3 MB"
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

# Laranja em São Paulo, 2024, e o biometano do bagaço

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 047, a terceira de seis da coleção **Do campo ao biometano**: a lavoura cujo resíduo
não fica no pomar, e sim na fábrica de suco.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `bagaco_nas_fabricas` | ponto | 14 municípios que recebem o bagaço no método CP2B: `CD_MUN`, `NM_MUN`, `producao_2024_t` e `biometano_m3_dia`; um ponto dentro de cada município |
| `municipios` | polígono | 645 municípios: `CD_MUN`, `NM_MUN`, região intermediária, `area_km2`, `area_2008_ha`, `producao_2008_t`, `area_2024_ha`, `producao_2024_t`, `pct_area` (área colhida em 2024 ÷ área do município, em %), `deixou` (colhia em 2008 e não colhe em 2024) e `biometano_m3_dia` |
| `regioes_intermediarias` | polígono | 11 regiões geográficas intermediárias |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `agro-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/agro-sp-2026).
A camada `municipios` traz três **estilos do QGIS**: `producao` (o padrão), `biometano` e
`deixou`; a camada de pontos já abre com os círculos proporcionais da prancha.

O **CSV** traz a tabela dos municípios, em UTF-8, sem geometria. Célula vazia quer dizer sem
informação; 0 quer dizer zero.

## Método

1. Tabela 1613 da Produção Agrícola Municipal no SIDRA: *Área colhida* (hectares) e *Quantidade
   produzida* (toneladas), produto *Laranja*, anos 2008 a 2024, nível município, estado de São
   Paulo. As colunas do painel somam a área colhida do estado ano a ano.
2. Produção de 2024 em seis classes por quantis dos municípios com produção positiva, com
   limites arredondados a dois algarismos significativos.
3. Listras: municípios com área colhida maior que zero em 2008 e igual a zero em 2024.
4. Biometano: potencial do substrato *bagaço de laranja* no método CP2B v5.1 (Unicamp, versão de
   24/09/2026), cenário de referência, nível N4 (acessível), em m³ de biometano equivalente por
   dia. O método parte da laranja colhida em todo o estado e aloca o bagaço às fábricas de suco;
   por isso os círculos ficam onde estão as fábricas, e não os pomares.
5. Rendimento do estado = produção ÷ área colhida, em toneladas por hectare.

## Limitações

- O potencial do CP2B é modelado, não medido: é o biometano que o bagaço daria se fosse
  digerido, depois de descontados os usos que já o disputam (ração, pectina, óleo essencial) e as
  perdas de coleta.
- A alocação às fábricas é a do método e pode não corresponder à capacidade atual de cada uma.
- 77 municípios ficam sem informação na PAM de 2024, a maioria na Grande São Paulo e no litoral.
- A PAM conta pomares em produção; pés novos, que ainda não dão fruta, não entram na área
  colhida.

## Licença dos dados

Dados abertos do IBGE, de uso livre com citação da fonte. O potencial do CP2B (Unicamp) é
publicado aqui com autorização do centro; cite «CP2B (Unicamp), método v5.1, 2026».
