---
numero: 37
titulo: "Rede de drenagem"
subtitulo: "Os rios que dão as costas ao mar"
data: 2026-10-20
categoria: hidrografia
colecao: agua-sp
tags: [agua-sp, sao-paulo, rios, rede-de-drenagem, tiete, bacia-do-prata, hydrosheds, hydrorivers, strahler]

contexto: >-
  O Tietê nasce a 12,5 km do mar e corre 982 km na direção oposta, para o interior, até o rio Paraná. Não está sozinho: 85,7% da área drenada pelos rios de São Paulo verte para o interior e segue pelo Paraná até o Rio da Prata, entre a Argentina e o Uruguai. A Serra do Mar e a Mantiqueira dividem as águas. Só a faixa do litoral, o Ribeira de Iguape e o vale do Paraíba do Sul mandam a chuva direto para o Atlântico, em 123 fozes na costa paulista. O mapa desenha 61.009 km de rios, cada trecho com a espessura da vazão média: dos córregos de cabeceira ao Paraná na divisa, com 8.490 m³/s. Segunda prancha da coleção «Água em SP».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com a rede de rios do HydroRIVERS desenhada em fios cuja espessura cresce com a vazão média. Os rios que correm para o interior, rumo à bacia do Prata, vão em azul-escuro e cobrem quase todo o estado, num leque de afluentes que descem para o noroeste até o Paraná, na divisa; os que vão direto para o Atlântico, em vermelho-argila, ocupam o vale do Paraíba do Sul, o litoral e o vale do Ribeira. O Tietê é destacado, com o nome escrito no meio do curso. Fora do estado, os rios maiores aparecem em cinza. Duas chamadas: a cabeceira do Tietê, a 12,5 km do mar, e a maior vazão média, 8.490 m³/s, no Paraná. No painel, a legenda das vertentes, a régua de espessura pela vazão e barras com os quilômetros de rio por ordem de Strahler."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "WWF / HydroSHEDS — HydroRIVERS v1.0, América do Sul (Lehner e Grill, 2013)"
    nome_en: "WWF / HydroSHEDS — HydroRIVERS v1.0, South America (Lehner and Grill, 2013)"
    url: https://www.hydrosheds.org/products/hydrorivers
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Trechos do HydroRIVERS recortados por São Paulo, com a espessura pela vazão média modelada e a vertente pela foz do sistema fluvial; Tietê traçado da foz à cabeceira pelo trecho de maior área a montante."

camadas:
  - { nome: rios, tipo: linha, cor: "#234e70", descricao: "16.999 trechos de rio no estado e na divisa: comprimento, área a montante, vazão média, ordem de Strahler e vertente", descricao_en: "16,999 river reaches in the state and on its border: length, upstream area, mean discharge, Strahler order and slope" }
  - { nome: tiete, tipo: linha, cor: "#234e70", descricao: "O Tietê da cabeceira ao Paraná, 982 km", descricao_en: "The Tietê from its source to the Paraná, 982 km" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "Quilômetros de rio em SP, pela vertente"
    rotulo_en: "Kilometres of river in São Paulo, by slope"
    unidade: "km"
    itens:
      - { rotulo: "Para o interior, bacia do Prata", valor: 49703, cor: "#234e70" }
      - { rotulo: "Direto para o Atlântico", valor: 11306, cor: "#9c4a32" }
  - tipo: barras
    rotulo: "Quilômetros de rio por ordem de Strahler"
    rotulo_en: "Kilometres of river by Strahler order"
    unidade: "km"
    itens:
      - { rotulo: "1", valor: 30724, cor: "#234e70" }
      - { rotulo: "2", valor: 15472, cor: "#234e70" }
      - { rotulo: "3", valor: 7764, cor: "#234e70" }
      - { rotulo: "4", valor: 3310, cor: "#234e70" }
      - { rotulo: "5", valor: 2114, cor: "#234e70" }
      - { rotulo: "6", valor: 517, cor: "#234e70" }
      - { rotulo: "7", valor: 946, cor: "#234e70" }
      - { rotulo: "8", valor: 162, cor: "#234e70" }
  - tipo: numero
    rotulo: "Área drenada que verte para o interior"
    rotulo_en: "Drained area flowing inland"
    valor: 85.7
    unidade: "%"
    nota: "O resto vai direto para o Atlântico, em 123 fozes na costa paulista"
    nota_en: "The rest flows straight to the Atlantic, through 123 mouths on the São Paulo coast"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/agua-sp-2026/sp_drenagem.gpkg.zip
    rotulo: "Rios, Tietê e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Rivers, Tietê and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "2,1 MB"
  - formato: csv
    url: https://github.com/aikiesan/essencial-geo/releases/download/agua-sp-2026/sp_drenagem.csv
    rotulo: "Os 16.999 trechos, sem geometria"
    rotulo_en: "The 16,999 reaches, without geometry"
    tamanho: "1,2 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/agua-sp-2026/sp_drenagem_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/agua-sp-2026/sp_drenagem_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "4,2 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,5 MB"

doi_automatico: true
versao: "1.0.0"
discussoes: []
---

# A rede de drenagem de São Paulo e as duas vertentes da água

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 037, a segunda de três da coleção **Água em SP**: depois do desenho das bacias, os rios
que correm dentro delas, e para onde vão.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `rios` | linha | 16.999 trechos: `hyriv_id`, `next_down` (trecho seguinte, rio abaixo), `main_riv` (foz do sistema), `length_km`, `dist_dn_km` e `dist_up_km` (distância até a foz e até a cabeceira mais distante), `catch_skm` (bacia local), `upland_skm` (área a montante), `dis_av_cms` (vazão média, m³/s), `ord_stra` (ordem de Strahler), `vertente` (`prata` ou `atlantico`) |
| `tiete` | linha | o Tietê traçado da foz à cabeceira: `nome`, `comp_km` |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `agua-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/agua-sp-2026).
A camada `rios` traz o **estilo do QGIS** da prancha: azul para o Prata, argila para o Atlântico e
a espessura crescendo com a ordem de Strahler.

O **CSV**, também na release, traz a tabela dos trechos em UTF-8, sem geometria; os campos mantêm
os nomes do HydroRIVERS, em minúsculas.

## Método

1. Trechos de rio do HydroRIVERS v1.0 (América do Sul), lidos na janela do estado. A base é
   derivada do relevo do HydroSHEDS, com resolução de 15 segundos de arco (cerca de 500 m), e
   inclui os rios com bacia de pelo menos 10 km² ou vazão média de pelo menos 0,1 m³/s.
2. Recorte pelo limite do estado alargado 1,5 km, para não cortar os rios que correm sobre a divisa
   (Paraná, Grande, Paranapanema). Fora do estado, os rios de ordem 3 ou mais vão em cinza, só como
   contexto.
3. **Vertente**: um trecho é do Prata quando o seu sistema fluvial (`main_riv`) termina na mesma foz
   do tronco do Paraná; os demais vão direto para o Atlântico.
4. **Tietê**: a partir do afluente do Paraná com foz perto de Itapura e área a montante de 72 mil
   km², o traçado sobe rio acima escolhendo sempre o trecho de maior área a montante, até a
   cabeceira. A distância ao mar é a menor distância da cabeceira até a costa.
5. Comprimentos medidos sobre o elipsoide, só dentro do limite do estado. A parte da área que verte
   para cada lado soma a bacia local dos trechos cujo ponto médio cai em São Paulo.
6. Na prancha, a espessura de cada trecho cresce com o logaritmo da vazão média.

## Limitações

- O HydroRIVERS é um modelo global: o traçado segue um relevo de 500 m, simplifica meandros e pode
  deslocar um rio de algumas centenas de metros. Os 982 km do Tietê ficam um pouco abaixo das
  medidas oficiais, que seguem o curso detalhado.
- A **vazão média** é modelada (WaterGAP) para o clima de 1971 a 2000, sem as represas, as
  transposições e as captações: a água do Alto Tietê bombeada para a Billings e a Serra do Mar não
  aparece, e o Tietê corre inteiro rumo ao interior.
- A cabeceira do Tietê é a do traçado do HydroRIVERS, que começa onde a bacia passa de 10 km²; a
  nascente reconhecida, em Salesópolis, fica a alguns quilômetros dela.
- Os córregos com menos de 10 km² de bacia não entram: a rede real, como a da prancha das APPs de
  Campinas, é muito mais densa.
- A divisão entre vertentes vale para a água da chuva no relevo natural, não para a água
  distribuída nas cidades.
