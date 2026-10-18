---
numero: 72
titulo: "Leite"
subtitulo: "Em quase todo o estado, no menor volume da série"
data: 2026-12-02
categoria: uso-do-solo
colecao: animal-sp
tags: [animal-sp, sao-paulo, leite, bovinos, pecuaria, biometano, cp2b, ibge, ppm]

contexto: >-
  São Paulo produziu 1,51 bilhão de litros de leite de vaca em 2024, o menor volume desde 2008. O pico foi em 2015, com 1,77 bilhão; desde então a produção caiu 15%, enquanto a do Brasil subiu até 35,7 bilhões de litros. A parte paulista passou de 5,8% em 2008 para 4,2%. O leite é a produção animal mais espalhada do estado: 603 dos 645 municípios declaram alguma, e os dez maiores somam só 18%. Tapiratiba, no nordeste, lidera com 41,5 milhões de litros, 2,8% do total, seguida de Araras, Descalvado e Cunha. Os tons mais escuros aparecem no oeste, no nordeste e no Vale do Paraíba, onde Cunha e São Luiz do Paraitinga estão entre os seis maiores. As regiões de Campinas e de São José dos Campos fazem um terço do leite paulista. Segunda prancha da coleção «Leite, ovos, mel e peixe».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com os municípios coloridos pela produção de leite de vaca em 2024, em seis classes do cinza-azulado claro ao azul-marinho (até 180 mil litros, até 500 mil, 1,1 milhão, 2 milhões, 3,9 milhões e de 3,9 milhões a 41,5 milhões). Quase todo o estado tem cor. O azul-escuro cobre boa parte do oeste e do noroeste, a divisa nordeste com Minas Gerais e o Vale do Paraíba até a ponta leste; o centro, a Grande São Paulo e o sul do estado ficam mais claros, e a capital e parte do litoral aparecem listradas, sem informação. Chamada: Tapiratiba, 41,5 milhões de litros, o maior produtor, com 2,8% do leite do estado. No painel, colunas da produção paulista de 2008 a 2024, com o pico de 1.768 milhões de litros em 2015 e 1.505 em 2024, e os cinco maiores produtores."

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
metodo: "Produção de leite de vaca da PPM 2024 por município em seis classes por quantis; série estadual de 2008 a 2024; potencial de biometano do esterco do gado leiteiro (só nos arquivos) no nível acessível do método CP2B."

camadas:
  - { nome: municipios, tipo: poligono, descricao: "645 municípios: produção de leite em 2008 e 2024 (mil litros), situação do dado em 2024 e biometano do gado leiteiro", descricao_en: "645 municipalities: milk production in 2008 and 2024 (thousand litres), data status in 2024 and dairy-cattle biomethane" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Leite de vaca em 2024"
    rotulo_en: "Cow’s milk in 2024"
    valor: 1505077
    unidade: "mil litros"
    unidade_en: "thousand litres"
    nota: "Em 2008 foram 1.588.943 mil litros, e no pico, em 2015, 1.768.416; a parte do Brasil passou de 5,8% para 4,2%"
    nota_en: "In 2008 it was 1,588,943 thousand litres, and at the 2015 peak 1,768,416; the share of Brazil went from 5.8% to 4.2%"
  - tipo: numero
    rotulo: "Municípios que produzem leite"
    rotulo_en: "Municipalities producing milk"
    valor: 603
    nota: "De 645; os dez maiores fazem 17,7% do total"
    nota_en: "Out of 645; the ten largest account for 17.7% of the total"
  - tipo: barras
    rotulo: "Maiores produtores em 2024"
    rotulo_en: "Largest producers in 2024"
    unidade: "mil litros"
    unidade_en: "thousand litres"
    itens:
      - { rotulo: "Tapiratiba", valor: 41500, cor: "#4a6f93" }
      - { rotulo: "Araras", valor: 36567, cor: "#4a6f93" }
      - { rotulo: "Descalvado", valor: 36457, cor: "#4a6f93" }
      - { rotulo: "Cunha", valor: 32000, cor: "#4a6f93" }
      - { rotulo: "Mogi Mirim", valor: 25853, cor: "#4a6f93" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/animal-sp-2026/sp_leite_2024.gpkg.zip
    rotulo: "Três camadas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Three layers, SIRGAS 2000, with QGIS styles"
    tamanho: "18,5 MB"
  - formato: csv
    arquivo: dados/sp_leite_2024.csv
    rotulo: "Leite em 2008 e 2024 e biometano do gado leiteiro por município"
    rotulo_en: "Milk in 2008 and 2024 and dairy-cattle biomethane by municipality"
    tamanho: "41 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/animal-sp-2026/sp_leite_2024_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/animal-sp-2026/sp_leite_2024_prancha.en.svg
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

# Leite em São Paulo, 2024

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 072, a segunda de cinco da coleção **Leite, ovos, mel e peixe**: a produção animal
presente em quase todos os municípios, e que encolhe desde 2015.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `CD_MUN`, `NM_MUN`, região intermediária, `producao_2008` e `producao_2024` (mil litros de leite de vaca), `situacao_2024` (`valor`, `zero`, `nao_disponivel` ou `fora_da_tabela`) e `biometano_m3_dia` |
| `regioes_intermediarias` | polígono | 11 regiões geográficas intermediárias |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `animal-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/animal-sp-2026).
A camada `municipios` já abre no QGIS com as classes da prancha (estilo `producao`).

O **CSV** traz a tabela dos municípios, em UTF-8, sem geometria. Célula vazia quer dizer sem
informação; 0 quer dizer zero.

## Método

1. Tabela 74 da Pesquisa da Pecuária Municipal no SIDRA: *Produção de origem animal*, produto
   *Leite* (mil litros), anos 2008 a 2024, nível município, estado de São Paulo. O total do
   Brasil, para a parte paulista, soma todos os municípios do país na mesma tabela.
2. Produção de 2024 em seis classes por quantis dos municípios com produção positiva, com limites
   arredondados a dois algarismos significativos.
3. Situação do dado: `zero` onde o IBGE publica um traço; `nao_disponivel` onde publica «X» ou
   «...»; `fora_da_tabela` onde o município não aparece.
4. Biometano (só nos arquivos): potencial do substrato *esterco de bovinos de leite* no método
   CP2B v5.1 (Unicamp, versão de 24/09/2026), cenário de referência, nível N4 (acessível), em m³
   de biometano equivalente por dia. No estado, soma 66.965 m³/dia.

## Limitações

- A PPM é uma estimativa municipal do IBGE feita com informantes locais, não uma contagem de
  fazendas nem de leite entregue a laticínios.
- 32 municípios ficam sem informação em 2024, quase todos na Grande São Paulo e no litoral.
- O biometano do CP2B não é calculado a partir do volume de leite desta prancha, e a ordem dos
  municípios nas duas colunas não coincide.

## Licença dos dados

Dados abertos do IBGE, de uso livre com citação da fonte. O potencial do CP2B (Unicamp) é
publicado aqui com autorização do centro; cite «CP2B (Unicamp), método v5.1, 2026».
