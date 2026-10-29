---
numero: 114
titulo: "O esterco longe de quem aduba"
subtitulo: "Onde há mais boi por km², menos estabelecimentos usam adubo orgânico"
data: 2026-11-03
categoria: energia
colecao: bioenergia-cruzada-sp
tags: [bioenergia-cruzada-sp, sao-paulo, bovinos, adubo-organico, esterco, censo-agro-2017, correlacao]

contexto: >-
  Onde há mais boi por km², menos estabelecimentos agropecuários usam adubo orgânico. Nos 617 municípios paulistas com dado, a correlação de postos entre o rebanho bovino de 2024 e a parte dos estabelecimentos que adubaram com orgânico no Censo Agropecuário de 2017 é −0,41, e −0,32 descontadas urbanização, densidade e renda. No quarto dos municípios com menos boi, a mediana é 32 %; no quarto com mais, 18 %. O gado solto deixa o esterco no pasto, e o adubo orgânico inclui o composto das hortas perto das cidades: Ferraz de Vasconcelos, com 2,2 bois por km², tem 81 %; Presidente Bernardes, com 202, 16 %. Quarta prancha da coleção «Bioenergia cruzada».

imagem: ./mapa_preview.png
imagem_alt: "Mapa bivariado dos municípios de São Paulo em nove cores, cruzando terços de bovinos por km² (do claro ao ocre) com terços da parte dos estabelecimentos com adubo orgânico (do claro ao lilás). O ocre de muito boi e pouco adubo cobre o oeste e o noroeste, do Pontal a São José do Rio Preto; o lilás de pouco boi e muito adubo, o entorno da capital, o Vale do Ribeira e o Alto Tietê; o marrom de muito dos dois, o Vale do Paraíba. Os 28 municípios sem dado, quase todos na Grande São Paulo e no litoral, aparecem hachurados. Chamadas apontam Ferraz de Vasconcelos, com 81 % dos estabelecimentos com adubo orgânico, e Presidente Bernardes, com 202 bois por km² e 16 %. No painel, a grade 3 × 3 e a tabela das correlações."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Pesquisa da Pecuária Municipal (PPM) 2024, tabela 3939: efetivo dos rebanhos"
    nome_en: "IBGE — Municipal Livestock Survey (PPM) 2024, table 3939: herd size"
    url: https://sidra.ibge.gov.br/tabela/3939
    ano: 2024
  - nome: "IBGE — Censo Agropecuário 2017, SIDRA tabela 6847 (estabelecimentos por uso de adubação)"
    nome_en: "IBGE — 2017 Agricultural Census, SIDRA table 6847 (holdings by use of fertiliser)"
    url: https://sidra.ibge.gov.br/tabela/6847
    ano: 2017
  - nome: "IBGE — Censo Demográfico 2022 (população, urbanização e renda dos municípios)"
    nome_en: "IBGE — 2022 Population Census (population, urbanisation and income by municipality)"
    url: https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Bovinos por km² (IBGE, PPM 2024) e parte dos estabelecimentos agropecuários que fizeram adubação orgânica, só ou com a química (IBGE, Censo Agropecuário 2017), cada uma em terços dos municípios, cruzadas num mapa bivariado 3 × 3; correlações de postos de Spearman, brutas e parciais, e LISA bivariado."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#c8b35a", descricao: "645 municípios com as variáveis das cinco pranchas, as classes bivariadas e os aglomerados LISA (mesmo GPKG das pranchas 111 a 115)", descricao_en: "645 municipalities with the variables of all five plates, the bivariate classes and the LISA clusters (same GPKG as plates 111 to 115)" }
  - { nome: gasodutos, tipo: linha, cor: "#1a211a", descricao: "Gasodutos de transporte e rede de distribuição de gás (EPE)", descricao_en: "Gas transmission pipelines and distribution network (EPE)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Correlação de postos entre bovinos e adubo orgânico"
    rotulo_en: "Rank correlation between cattle and organic fertiliser"
    valor: -0.41
    nota: "parcial −0,32; 617 municípios"
    nota_en: "partial −0.32; 617 municipalities"
  - tipo: numero
    rotulo: "Estabelecimentos com adubo orgânico, quarto com mais boi (mediana)"
    rotulo_en: "Holdings using organic fertiliser, most-cattle quarter (median)"
    valor: 17.9
    unidade: "%"
    unidade_en: "%"
    nota: "32 % no quarto com menos boi"
    nota_en: "32% in the fewest-cattle quarter"
  - tipo: numero
    rotulo: "Municípios de pouco adubo cercados de muito boi (LISA)"
    rotulo_en: "Municipalities with little fertiliser amid many cattle (LISA)"
    valor: 136
    unidade: "municípios"
    unidade_en: "municipalities"
    nota: "sobretudo em São José do Rio Preto (50) e Presidente Prudente (36)"
    nota_en: "mostly in São José do Rio Preto (50) and Presidente Prudente (36)"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-cruzada-sp-2026/sp_bioenergia_cruzada.gpkg.zip
    rotulo: "Municípios e gasodutos com as variáveis das cinco pranchas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities and pipelines with the variables of all five plates, SIRGAS 2000, with QGIS styles"
    tamanho: "4,7 MB"
  - formato: csv
    arquivo: dados/sp_bioenergia_cruzada_municipios.csv
    rotulo: "Tabela dos municípios (a mesma nas cinco pranchas)"
    rotulo_en: "Municipal table (the same on all five plates)"
    tamanho: "120 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-cruzada-sp-2026/sp_bovinos_e_adubo_organico_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-cruzada-sp-2026/sp_bovinos_e_adubo_organico_prancha.en.svg
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

# Bovinos por km² e estabelecimentos com adubo orgânico nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 114, a quarta de cinco da coleção **Bioenergia cruzada**; a anterior é a [prancha 113](../113-eucalipto-encostado-na-mata-sp/README.md); a seguinte, a [prancha 115](../115-pequenos-longe-do-gas-sp/README.md).

A coleção cruza a bioenergia paulista com o que se vende nos postos, com o campo e com as
prefeituras, nos 645 municípios de São Paulo. Os pares saíram de uma triagem de correlações entre o
potencial de biometano do CP2B, as vendas de combustíveis do Anuário da SEMIL, a silvicultura, o
rebanho, o Censo Agropecuário, a frota e a MUNIC. Cada par passou por correlação de postos bruta e
parcial (descontadas urbanização, densidade e renda), amostra efetiva corrigida pela autocorrelação
espacial, valores q de Benjamini–Hochberg e LISA bivariado. A última prancha é descritiva, sem
teste, e o texto diz isso.

As chamadas do mapa apontam Ferraz de Vasconcelos, no cinturão de hortas da metrópole, onde 81 % dos
estabelecimentos usaram adubo orgânico com 2,2 bois por km², e Presidente Bernardes, no Pontal, com
202 bois por km² e 16 %: um dos 136 municípios de pouco adubo cercados de muito boi.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios com cana e etanol, biometano e diesel, frota, mata nativa e madeira para celulose, bovinos e adubo orgânico, distâncias ao gasoduto, gás canalizado e as respostas da MUNIC sobre resíduos; classes `b111`, `b113`, `b114`, `arranjo115` e aglomerados `lisa111`, `lisa113`, `lisa114` |
| `gasodutos` | linha | gasodutos de transporte e rede de distribuição (`tipo`) |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

O **GPKG** é o mesmo nas cinco pranchas e traz um estilo do QGIS para cada uma. O **CSV** tem a
tabela dos municípios, sem geometria. Campos vazios são falta de dado, não zero. Os aglomerados LISA
vêm como `AA` (alto-alto), `BB` (baixo-baixo), `AB`, `BA` e `ns` (não significativo); a primeira
letra é a variável do município, a segunda a dos vizinhos.

## Método

1. `bovinos_km2`: efetivo de bovinos em 31/12/2024 (IBGE, PPM, tabela 3939) sobre a área do
   município.
2. `estab_agro`, `estab_adubo_organico` e `pct_estab_adubo_organico`: estabelecimentos
   agropecuários, os que fizeram adubação orgânica ou química e orgânica, e a parte, em % (IBGE, Censo
   Agropecuário 2017, SIDRA 6847).
3. Terços de bovinos: até 22,0, de 22,0 a 59,7 e mais de 59,7 cabeças por km²; de adubo orgânico:
   até 20,1 %, de 20,1 % a 33,3 % e mais de 33,3 %. `b114`: classe bivariada, dezena = terço de bovinos
   (1 a 3), unidade = terço de adubo orgânico (1 a 3). De baixo para cima e da esquerda para a direita,
   as nove casas têm 37, 54, 114; 70, 77, 58; 98, 75, 34 municípios. No estado, 28,7 % dos
   estabelecimentos usaram adubo orgânico; 28 municípios ficam sem dado, quase todos na Grande São
   Paulo e no litoral: a PPM não publica rebanho bovino neles, e em alguns o Censo Agropecuário também
   não tem dado. Falta de dado não é zero.
4. `n_kg_ha_agro`: nitrogênio dos dejetos dos rebanhos por hectare de área agropecuária (prancha
   081). Pelos quartos de nitrogênio, a mediana do adubo orgânico cai de 30,8 % para 21,6 %.
5. Adubo orgânico × bovinos por km² (log): correlação de postos de Spearman −0,41 (617 municípios),
   parcial −0,32, amostra efetiva 351, p < 0,001, q < 0,001. `lisa114`: aglomerados LISA bivariados
   (adubo orgânico no município × bovinos nos vizinhos): 46 alto-alto, 62 baixo-baixo, 113 alto-baixo e
   136 baixo-alto; I de Moran bivariado −0,39. Baixo-alto por região intermediária: São José do Rio
   Preto (50), Presidente Prudente (36) e Araçatuba (26).
6. Correlação parcial: correlação entre os resíduos dos postos de cada variável regredidos nos
   postos dos controles, que são urbanização (parte de moradores em situação urbana), log da densidade
   demográfica e log da renda por habitante (Censo 2022). Amostra efetiva sob autocorrelação espacial:
   n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), com Iₓ e Iᵧ o I de Moran dos resíduos numa vizinhança dos 6 vizinhos mais
   próximos; valores q de Benjamini–Hochberg sobre todos os pares da triagem. LISA bivariado: valor do
   município contra a média dos 6 vizinhos na outra variável, 999 permutações, semente 20261019, p <
   0,05.

## Limitações

- O Censo Agropecuário é de 2017 e o rebanho, de 2024: sete anos separam as duas medidas.
- Adubo orgânico não é só esterco: inclui composto e outros resíduos, e o Censo conta
  estabelecimentos, não toneladas nem hectares. O pasto quase não recebe adubo, e o esterco do gado
  solto fica no campo, sem ser recolhido; o mapa mostra onde o esterco existe e onde ele é usado como
  adubo, não quanto dele se perde.
- Leitura ecológica: o mapa compara municípios, não pessoas nem fazendas. Uma correlação entre
  municípios não diz que as mesmas propriedades ou os mesmos motoristas têm as duas características,
  nem que uma causa a outra.
