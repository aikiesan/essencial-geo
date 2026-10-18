---
numero: 71
titulo: "Ovos"
subtitulo: "Um em cada cinco ovos paulistas sai de Bastos"
data: 2026-12-01
categoria: uso-do-solo
colecao: animal-sp
tags: [animal-sp, sao-paulo, ovos, avicultura, pecuaria, biometano, cp2b, ibge, ppm]

contexto: >-
  São Paulo produziu 1,27 bilhão de dúzias de ovos de galinha em 2024, 52% a mais que em 2008 e 23,6% do total do Brasil. Só Bastos, na região de Marília, produziu 270 milhões de dúzias, um em cada cinco ovos do estado. Com Tupã e os vizinhos, a região de Marília soma 42% da produção, e os dez maiores municípios fazem 54%. Ainda assim, 540 municípios declaram alguma produção, e o ovo aparece em quase todo o mapa; só a Grande São Paulo e o litoral ficam sem o dado. O esterco das poedeiras também é resíduo: pelo método CP2B, daria 296 mil m³ de biometano por dia no estado, 62,6 mil deles em Bastos. Os ovos de codorna seguiram o caminho oposto e caíram de 82,8 para 37,3 milhões de dúzias. Primeira prancha da coleção «Leite, ovos, mel e peixe».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com os municípios coloridos pela produção de ovos de galinha em 2024, em seis classes do creme ao marrom (até 6 mil dúzias, até 14 mil, 39 mil, 100 mil, 1,3 milhão e de 1,3 milhão a 270 milhões). Quase todo o estado tem cor; os tons mais escuros formam manchas no centro-oeste, em volta de Bastos, Tupã e Queiroz, no centro e no sudeste, perto de Porto Feliz. A Grande São Paulo e parte do litoral aparecem listradas, sem informação, e há municípios cinza, com produção zero, espalhados pelo oeste. Chamada: Bastos, 270 milhões de dúzias, 21% dos ovos de galinha do estado. No painel, colunas da produção paulista de 2008 a 2024, de 838 para 1.274 milhões de dúzias, e os cinco maiores produtores."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Pesquisa da Pecuária Municipal (PPM), tabela 74: produção de origem animal"
    nome_en: "IBGE — Municipal Livestock Survey (PPM), table 74: animal products"
    url: https://sidra.ibge.gov.br/tabela/74
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
metodo: "Produção de ovos de galinha da PPM 2024 por município em seis classes por quantis; série estadual de 2008 a 2024; potencial de biometano do esterco de poedeiras no nível acessível do método CP2B."

camadas:
  - { nome: municipios, tipo: poligono, descricao: "645 municípios: produção de ovos de galinha em 2008 e 2024 (mil dúzias), situação do dado em 2024 e biometano das poedeiras", descricao_en: "645 municipalities: hen egg production in 2008 and 2024 (thousand dozen), data status in 2024 and laying-hen biomethane" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Ovos de galinha em 2024"
    rotulo_en: "Hen eggs in 2024"
    valor: 1274158
    unidade: "mil dúzias"
    unidade_en: "thousand dozen"
    nota: "Em 2008 foram 837.888 mil dúzias; a parte do Brasil passou de 27,3% para 23,6%"
    nota_en: "In 2008 it was 837,888 thousand dozen; the share of Brazil went from 27.3% to 23.6%"
  - tipo: numero
    rotulo: "Biometano do esterco de poedeiras"
    rotulo_en: "Biomethane from laying-hen manure"
    valor: 296316
    unidade: "m³/dia"
    unidade_en: "m³/day"
    nota: "Nível acessível do método CP2B, no cenário de referência; 62.572 m³/dia em Bastos"
    nota_en: "Accessible level of the CP2B method, reference scenario; 62,572 m³/day in Bastos"
  - tipo: barras
    rotulo: "Maiores produtores em 2024"
    rotulo_en: "Largest producers in 2024"
    unidade: "mil dúzias"
    unidade_en: "thousand dozen"
    itens:
      - { rotulo: "Bastos", valor: 270050, cor: "#cc7d1c" }
      - { rotulo: "Tupã", valor: 82482, cor: "#cc7d1c" }
      - { rotulo: "Guararapes", valor: 59041, cor: "#cc7d1c" }
      - { rotulo: "Queiroz", valor: 47323, cor: "#cc7d1c" }
      - { rotulo: "Porto Feliz", valor: 46061, cor: "#cc7d1c" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/animal-sp-2026/sp_ovos_2024.gpkg.zip
    rotulo: "Três camadas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Three layers, SIRGAS 2000, with QGIS styles"
    tamanho: "18,5 MB"
  - formato: csv
    arquivo: dados/sp_ovos_2024.csv
    rotulo: "Ovos de galinha em 2008 e 2024 e biometano das poedeiras por município"
    rotulo_en: "Hen eggs in 2008 and 2024 and laying-hen biomethane by municipality"
    tamanho: "39 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/animal-sp-2026/sp_ovos_2024_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/animal-sp-2026/sp_ovos_2024_prancha.en.svg
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

# Ovos de galinha em São Paulo, 2024

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 071, a primeira de cinco da coleção **Leite, ovos, mel e peixe**: o produto animal que
mais vale no estado, e que se concentra num punhado de municípios do centro-oeste.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `CD_MUN`, `NM_MUN`, região intermediária, `producao_2008` e `producao_2024` (mil dúzias de ovos de galinha), `situacao_2024` (`valor`, `zero`, `nao_disponivel` ou `fora_da_tabela`) e `biometano_m3_dia` |
| `regioes_intermediarias` | polígono | 11 regiões geográficas intermediárias |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `animal-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/animal-sp-2026).
A camada `municipios` já abre no QGIS com as classes da prancha (estilo `producao`).

O **CSV** traz a tabela dos municípios, em UTF-8, sem geometria. Célula vazia quer dizer sem
informação; 0 quer dizer zero.

## Método

1. Tabela 74 da Pesquisa da Pecuária Municipal no SIDRA: *Produção de origem animal*, produto
   *Ovos de galinha* (mil dúzias), anos 2008 a 2024, nível município, estado de São Paulo. O total
   do Brasil, para a parte paulista, soma todos os municípios do país na mesma tabela.
2. Produção de 2024 em seis classes por quantis dos municípios com produção positiva, com limites
   arredondados a dois algarismos significativos.
3. Situação do dado: `zero` onde o IBGE publica um traço; `nao_disponivel` onde publica «X» ou
   «...»; `fora_da_tabela` onde o município não aparece.
4. Biometano: potencial do substrato *esterco de aves de postura* no método CP2B v5.1 (Unicamp,
   versão de 24/09/2026), cenário de referência, nível N4 (acessível), em m³ de biometano
   equivalente por dia.
5. Ovos de codorna (mesma tabela) entram só no texto: 82.836 mil dúzias em 2008 e 37.288 em 2024.

## Limitações

- A PPM é uma estimativa municipal do IBGE feita com informantes locais, não uma contagem de
  granjas; o volume de um município pode refletir a sede da empresa.
- 32 municípios ficam sem informação em 2024, quase todos na Grande São Paulo e no litoral.
- O potencial do CP2B é modelado, não medido: é o biometano que o esterco daria se fosse
  digerido, depois de descontados os usos que já o disputam e as perdas de coleta.

## Licença dos dados

Dados abertos do IBGE, de uso livre com citação da fonte. O potencial do CP2B (Unicamp) é
publicado aqui com autorização do centro; cite «CP2B (Unicamp), método v5.1, 2026».
