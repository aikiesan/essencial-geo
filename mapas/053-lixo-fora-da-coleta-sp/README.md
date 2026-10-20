---
numero: 53
titulo: "Lixo fora da coleta"
subtitulo: "Onde o caminhão não passa, o lixo queima"
data: 2026-10-20
categoria: censo-renda
colecao: saneamento-sp
tags: [saneamento-sp, sao-paulo, censo-2022, lixo, residuos-solidos, coleta, setores-censitarios]

contexto: >-
  Quase todo o lixo paulista é coletado: em 2022, só 0,99% dos domicílios, 160 mil, davam outro destino a ele. Mas esse 1% não está espalhado. Ele está no campo, onde o caminhão não chega, e o destino mais comum é o fogo: 110 mil domicílios queimavam o lixo na propriedade. Pintado setor por setor, o mapa mostra o estado ao avesso: as cidades ficam claras, com coleta para todos, e o interior rural escurece. Em 1.734 setores, mais da metade dos domicílios não tinha coleta. Marabá Paulista, no Pontal do Paranapanema, tem a maior parte do município fora da coleta (46%); a capital, o maior número absoluto (12.094). O lixo que não é coletado também não chega a aterro nem a biodigestor. Terceira prancha da coleção «Saneamento e biometano».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com os setores censitários coloridos pela parte dos domicílios que queimam, enterram ou jogam o lixo em terreno baldio, ou lhe dão outro destino, em 2022, em cinco classes do creme (até 1%) ao marrom-escuro (mais de 50%), e cinza-claro onde todos têm coleta. O interior rural fica em marrom, mais escuro no oeste e no Pontal do Paranapanema; as cidades e a Grande São Paulo ficam claras. Setores com a classe em sigilo vão hachurados. Uma chamada aponta Marabá Paulista, com 46% dos domicílios sem coleta. No painel, cada classe tem uma barra com a parte dos domicílios do estado, e barras mostram o que se faz com o lixo não coletado: queimado, outro destino, terreno baldio e enterrado."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022: características dos domicílios por setor censitário"
    nome_en: "IBGE — 2022 Population Census: household characteristics by census tract"
    url: https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "IBGE — SIDRA, tabela 6892: domicílios por destino do lixo"
    nome_en: "IBGE — SIDRA, table 6892: households by rubbish destination"
    url: https://sidra.ibge.gov.br/tabela/6892
    ano: 2022
  - nome: "IBGE — Malha de Setores Censitários 2022"
    nome_en: "IBGE — 2022 Census Tract Mesh"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/26565-malhas-de-setores-censitarios-divisoes-intramunicipais.html
    ano: 2022
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Parte dos domicílios particulares permanentes ocupados de cada setor censitário com o lixo queimado, enterrado, jogado em terreno baldio, encosta ou área pública, ou com outro destino, em cinco classes e zero; setores com valor em sigilo só recebem classe quando ela não depende do valor omitido."

camadas:
  - { nome: setores, tipo: poligono, cor: "#9c4a32", descricao: "103.319 setores censitários: domicílios por destino do lixo e classe do lixo fora da coleta (mesmo GPKG da prancha 051)", descricao_en: "103,319 census tracts: households by rubbish destination and uncollected-rubbish class (same GPKG as plate 051)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "Domicílios pela parte do setor com lixo fora da coleta"
    rotulo_en: "Households, by the share of their tract with uncollected rubbish"
    unidade: "domicílios"
    unidade_en: "households"
    itens:
      - { rotulo: "nenhum", rotulo_en: "none", valor: 14318442, cor: "#eef0f1" }
      - { rotulo: "até 1%", rotulo_en: "up to 1%", valor: 626591, cor: "#f1dcb0" }
      - { rotulo: "1 a 5%", rotulo_en: "1 to 5%", valor: 381080, cor: "#e2b06a" }
      - { rotulo: "5 a 20%", rotulo_en: "5 to 20%", valor: 227800, cor: "#c27a3a" }
      - { rotulo: "20 a 50%", rotulo_en: "20 to 50%", valor: 142406, cor: "#9c4a32" }
      - { rotulo: "mais de 50%", rotulo_en: "over 50%", valor: 97033, cor: "#5e2a22" }
  - tipo: numero
    rotulo: "Domicílios com lixo fora da coleta"
    rotulo_en: "Households with uncollected rubbish"
    valor: 0.99
    unidade: "%"
    nota: "160.093 de 16.224.248 (SIDRA 6892)"
    nota_en: "160,093 of 16,224,248 (SIDRA 6892)"
  - tipo: numero
    rotulo: "Domicílios que queimam o lixo na propriedade"
    rotulo_en: "Households burning rubbish on the property"
    valor: 109624
    unidade: "domicílios"
    unidade_en: "households"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/saneamento-sp-2026/sp_saneamento_setores_2022.gpkg.zip
    rotulo: "Setores (mesmo arquivo das pranchas 051 e 052), regiões e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Tracts (same file as plates 051 and 052), regions and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "23,9 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/saneamento-sp-2026/sp_lixo_fora_coleta_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/saneamento-sp-2026/sp_lixo_fora_coleta_2022_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "5,5 MB"
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

# Lixo fora da coleta nos setores censitários de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 053, a terceira de quatro da coleção **Saneamento e biometano**: o lixo que não chega
ao caminhão, e portanto a nenhum aterro ou biodigestor.

## O que vem nos arquivos

O GPKG é o mesmo da [prancha 051](../051-esgoto-na-rede-sp/README.md): a camada `setores` traz o
número de domicílios por destino do lixo (`lixo_coletado`, `lixo_cacamba`, `lixo_queimado`,
`lixo_enterrado`, `lixo_terreno`, `lixo_outro`) e o campo `classe_lixo` (0 = nenhum; 1 a 5 = até
1%, 1 a 5%, 5 a 20%, 20 a 50%, mais de 50%). O estilo do QGIS desta prancha é
`lixo_fora_da_coleta`.

## Método

1. Agregados por setor do Censo 2022: domicílios particulares permanentes ocupados por destino do
   lixo.
2. Fora da coleta: queimado na propriedade, enterrado na propriedade, jogado em terreno baldio,
   encosta ou área pública, e outro destino. Coletado: no domicílio ou em caçamba do serviço de
   limpeza.
3. Sigilo, como na prancha 051: o `X` esconde 1 ou 2 e nunca vira zero; o setor só recebe uma
   classe quando ela não depende do valor omitido. Aqui a regra pesa mais, porque os destinos
   fora da coleta são raros e caem muito em sigilo: 5.168 setores (427.767 domicílios) vão
   hachurados.
4. Os setores sem domicílio ocupado ficam no mesmo cinza-claro dos setores com coleta para todos.
5. Totais do estado e dos municípios: tabela 6892 do SIDRA.

## Limitações

- O destino é o declarado ao recenseador; o Censo não diz se a coleta é regular nem para onde o
  caminhão leva o lixo.
- Um setor rural grande pesa muito no mapa e pouco nos números: o marrom cobre boa parte do
  estado, mas os domicílios sem coleta são 1%.
