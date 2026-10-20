---
numero: 52
titulo: "Para onde vai o esgoto"
subtitulo: "Rede na cidade, fossa no campo, rio na beira"
data: 2026-10-20
categoria: censo-renda
colecao: saneamento-sp
tags: [saneamento-sp, sao-paulo, censo-2022, esgoto, fossa, saneamento, setores-censitarios]

contexto: >-
  Fora da rede, o esgoto paulista vai para três lugares. Em 2022, 569 mil domicílios usavam fossa séptica, 455 mil fossa rudimentar ou buraco e 385 mil lançavam em vala, rio, lago, córrego, mar ou outro destino. O mapa pinta cada setor censitário pelo destino da maioria dos domicílios. A rede fica à frente em só 11% da área, mas ali moram 93% dos domicílios; a fossa rudimentar lidera em 56% da área e a séptica em 33%, num mosaico que cobre o interior. O esgoto lançado em rio, lago, córrego ou mar é urbano: dos 307 mil domicílios que fazem isso, 124 mil estão na capital e três quartos do resto na região intermediária de São Paulo. Segunda prancha da coleção «Saneamento e biometano».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com os setores censitários coloridos pelo destino do esgoto da maioria dos domicílios em 2022: azul-escuro para rede geral, pluvial ou fossa ligada, verde-oliva para fossa séptica, ocre para fossa rudimentar ou buraco, cor de argila para vala, rio, lago, córrego, mar ou outra forma e ameixa para sem banheiro. O ocre e o verde-oliva dividem o interior num mosaico; o azul marca as cidades, com a maior mancha na Grande São Paulo. Setores em empate ou com valores em sigilo vão hachurados. Uma chamada aponta a capital: 123.932 domicílios lançam o esgoto em rio, córrego, lago ou mar. No painel, uma fita mostra a parte da área de cada destino, e barras mostram as seis cidades com mais domicílios que lançam esgoto em rio, lago, córrego ou mar."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022: características dos domicílios por setor censitário"
    nome_en: "IBGE — 2022 Population Census: household characteristics by census tract"
    url: https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "IBGE — SIDRA, tabela 6805: domicílios por tipo de esgotamento sanitário"
    nome_en: "IBGE — SIDRA, table 6805: households by type of sewage disposal"
    url: https://sidra.ibge.gov.br/tabela/6805
    ano: 2022
  - nome: "IBGE — Malha de Setores Censitários 2022"
    nome_en: "IBGE — 2022 Census Tract Mesh"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/26565-malhas-de-setores-censitarios-divisoes-intramunicipais.html
    ano: 2022
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Destino do esgoto da maioria dos domicílios particulares permanentes ocupados de cada setor censitário, em cinco grupos; o grupo só vence quando o seu mínimo passa o máximo de todos os outros, contando os valores em sigilo como 1 ou 2."

camadas:
  - { nome: setores, tipo: poligono, cor: "#d9a441", descricao: "103.319 setores censitários: domicílios por destino do esgoto e destino predominante (mesmo GPKG da prancha 051)", descricao_en: "103,319 census tracts: households by sewage destination and leading destination (same GPKG as plate 051)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "Domicílios por destino do esgoto no estado"
    rotulo_en: "Households by sewage destination in the state"
    unidade: "domicílios"
    unidade_en: "households"
    itens:
      - { rotulo: "Rede geral, pluvial ou fossa ligada", rotulo_en: "Mains, storm drain or linked tank", valor: 14813509, cor: "#234e70" }
      - { rotulo: "Fossa séptica não ligada", rotulo_en: "Septic tank not linked", valor: 569417, cor: "#7d8a3c" }
      - { rotulo: "Fossa rudimentar ou buraco", rotulo_en: "Rudimentary pit or hole", valor: 454989, cor: "#d9a441" }
      - { rotulo: "Vala, rio, lago, córrego, mar ou outra", rotulo_en: "Ditch, river, lake, stream, sea or other", valor: 384659, cor: "#9c4a32" }
      - { rotulo: "Sem banheiro nem sanitário", rotulo_en: "No bathroom or toilet", valor: 1674, cor: "#6b3d5c" }
  - tipo: numero
    rotulo: "Área dos setores com a fossa rudimentar à frente"
    rotulo_en: "Tract area where rudimentary pits lead"
    valor: 56
    unidade: "%"
    nota: "129 mil km² de 231 mil km² de setores com destino definido"
    nota_en: "129,000 km² of 231,000 km² of tracts with a defined leader"
  - tipo: numero
    rotulo: "Domicílios da capital que lançam o esgoto em rio, lago, córrego ou mar"
    rotulo_en: "Households in the capital discharging sewage into rivers, lakes, streams or the sea"
    valor: 123932
    unidade: "domicílios"
    unidade_en: "households"
    nota: "40% dos 306.691 do estado"
    nota_en: "40% of the state’s 306,691"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/saneamento-sp-2026/sp_saneamento_setores_2022.gpkg.zip
    rotulo: "Setores (mesmo arquivo das pranchas 051 e 053), regiões e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Tracts (same file as plates 051 and 053), regions and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "23,9 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/saneamento-sp-2026/sp_esgoto_destino_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/saneamento-sp-2026/sp_esgoto_destino_2022_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "4,1 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,4 MB"

doi_automatico: true
versao: "1.0.0"
discussoes: []
---

# Para onde vai o esgoto dos setores censitários de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 052, a segunda de quatro da coleção **Saneamento e biometano**: o que acontece com o
esgoto que não entra na rede.

## O que vem nos arquivos

O GPKG é o mesmo da [prancha 051](../051-esgoto-na-rede-sp/README.md): a camada `setores` traz o
número de domicílios em cada destino e o campo `destino` (`rede`, `septica`, `rudimentar`,
`aberto`, `sem` ou vazio). O estilo do QGIS desta prancha é `destino_do_esgoto`.

## Método

1. Agregados por setor do Censo 2022: domicílios particulares permanentes ocupados por destino do
   esgoto do banheiro ou sanitário.
2. Cinco grupos: rede (rede geral ou pluvial e fossa ligada à rede); fossa séptica não ligada;
   fossa rudimentar ou buraco; esgoto a céu aberto (vala; rio, lago, córrego ou mar; outra
   forma); e sem banheiro nem sanitário.
3. O destino predominante é o grupo com mais domicílios. Os valores em sigilo (`X`, que nos dados
   de São Paulo escondem 1 ou 2) entram como intervalo: um grupo só vence quando o seu mínimo
   passa o máximo de todos os outros. Os 1.925 setores em empate ou sem decisão vão hachurados.
4. Fita do painel: a área dos setores de cada destino predominante (231 mil km² com destino
   definido). Totais por destino: tabela 6805 do SIDRA.

## Limitações

- Predominante quer dizer só que é o maior grupo: um setor azul pode ter um terço dos domicílios
  em fossa.
- A diferença entre fossa séptica e rudimentar é a declarada ao recenseador.
- Um setor rural grande pesa muito no mapa e pouco nos números.
