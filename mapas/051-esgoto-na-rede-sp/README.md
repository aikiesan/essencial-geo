---
numero: 51
titulo: "Esgoto na rede"
subtitulo: "A rede cobre a cidade; o campo fica na fossa"
data: 2026-11-11
categoria: censo-renda
colecao: saneamento-sp
tags: [saneamento-sp, sao-paulo, censo-2022, esgoto, saneamento, setores-censitarios]

contexto: >-
  Em 2022, 91,3% dos domicílios paulistas tinham o esgoto ligado à rede geral, à rede pluvial ou a uma fossa ligada à rede: 14,8 milhões de 16,2 milhões. Faltavam 1,41 milhão. Pintado setor por setor, o mapa mostra a rede como coisa de cidade: três em cada quatro domicílios vivem em setores onde mais de 99% estão ligados, mas esses setores são pequenos, e o creme dos setores rurais, onde quase ninguém está na rede, cobre a maior parte do estado. A cidade de São Paulo tem 205.630 domicílios fora da rede, o maior número absoluto; entre as cidades com mais de 20 mil domicílios, Ibiúna tem a maior parte fora (71%). Primeira prancha da coleção «Saneamento e biometano».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com os 103 mil setores censitários coloridos pela parte dos domicílios com esgoto na rede geral, na rede pluvial ou em fossa ligada à rede em 2022, em seis classes, do creme (até 10%) ao azul-escuro (mais de 99%). O creme dos setores rurais cobre a maior parte do território; o azul-escuro forma manchas nas cidades, a maior delas na Grande São Paulo. Setores com a classe em sigilo vão hachurados. Uma chamada aponta Ibiúna, com 71% dos domicílios fora da rede. No painel, cada classe tem uma barra com a parte dos domicílios do estado, e as seis cidades com mais domicílios fora da rede aparecem em barras, São Paulo à frente, com 205.630."

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
metodo: "Parte dos domicílios particulares permanentes ocupados de cada setor censitário com o esgoto na rede geral, na rede pluvial ou em fossa ligada à rede, em seis classes; setores com valor em sigilo só recebem classe quando ela não depende do valor omitido."

camadas:
  - { nome: setores, tipo: poligono, cor: "#1d3f5e", descricao: "103.319 setores censitários: domicílios por destino do esgoto e do lixo, classe de ligação à rede, destino predominante e classe do lixo fora da coleta", descricao_en: "103,319 census tracts: households by sewage and rubbish destination, mains-connection class, leading destination and uncollected-rubbish class" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "Domicílios pela parte do setor ligada à rede de esgoto"
    rotulo_en: "Households, by the share of their tract connected to the sewer mains"
    unidade: "domicílios"
    unidade_en: "households"
    itens:
      - { rotulo: "até 10%", rotulo_en: "up to 10%", valor: 685034, cor: "#f3ecd4" }
      - { rotulo: "10 a 50%", rotulo_en: "10 to 50%", valor: 573152, cor: "#dcd3a6" }
      - { rotulo: "50 a 80%", rotulo_en: "50 to 80%", valor: 508100, cor: "#a9bfa6" }
      - { rotulo: "80 a 95%", rotulo_en: "80 to 95%", valor: 935531, cor: "#6f9ea6" }
      - { rotulo: "95 a 99%", rotulo_en: "95 to 99%", valor: 1514386, cor: "#3a6f8c" }
      - { rotulo: "mais de 99%", rotulo_en: "over 99%", valor: 11841426, cor: "#1d3f5e" }
  - tipo: numero
    rotulo: "Domicílios com esgoto na rede ou em fossa ligada à rede"
    rotulo_en: "Households with sewage on the mains or a tank linked to the mains"
    valor: 91.3
    unidade: "%"
    nota: "14.813.509 de 16.224.248 domicílios (SIDRA 6805)"
    nota_en: "14,813,509 of 16,224,248 households (SIDRA 6805)"
  - tipo: numero
    rotulo: "Domicílios fora da rede na cidade de São Paulo"
    rotulo_en: "Households off the mains in the city of São Paulo"
    valor: 205630
    unidade: "domicílios"
    unidade_en: "households"
    nota: "4,8% dos domicílios da capital"
    nota_en: "4.8% of the capital’s households"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/saneamento-sp-2026/sp_saneamento_setores_2022.gpkg.zip
    rotulo: "Setores (com os dados das pranchas 051 a 053), regiões e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Tracts (with the data of plates 051 to 053), regions and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "23,9 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/saneamento-sp-2026/sp_esgoto_rede_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/saneamento-sp-2026/sp_esgoto_rede_2022_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "4,5 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,4 MB"

versao: "1.0.0"
discussoes: []
---

# Esgoto na rede: os setores censitários de São Paulo em 2022

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 051, a primeira de quatro da coleção **Saneamento e biometano**: antes de perguntar
quanto gás o esgoto daria, onde ele chega à rede.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `setores` | polígono | 103.319 setores: `CD_SETOR`, `CD_MUN`, `NM_MUN`, `situacao`, `dppo` (domicílios particulares permanentes ocupados), domicílios por destino do esgoto (`esgoto_rede`, `esgoto_ligada`, `esgoto_septica`, `esgoto_rudimentar`, `esgoto_vala`, `esgoto_rio`, `esgoto_outra`, `esgoto_sem`) e do lixo (`lixo_coletado`, `lixo_cacamba`, `lixo_queimado`, `lixo_enterrado`, `lixo_terreno`, `lixo_outro`), `classe_rede` (1 a 6), `destino` (predominante), `classe_lixo` (0 a 5) e `sem_domicilio` |
| `regioes_intermediarias` | polígono | 11 regiões geográficas intermediárias |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** é um só para as pranchas 051, 052 e 053 e vai compactado (ZIP) nos anexos da
[release `saneamento-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/saneamento-sp-2026).
A camada `setores` traz três **estilos do QGIS**, um por prancha (`esgoto_na_rede` é o padrão).
Os polígonos foram simplificados a cerca de 10 m. As contagens em sigilo ficam vazias (`NULL`).

## Método

1. Agregados por setor do Censo 2022 (características do domicílio, partes 1 e 2): domicílios
   particulares permanentes ocupados (DPPO) e o destino do esgoto do banheiro ou sanitário.
2. Ligados à rede: esgoto na rede geral ou pluvial, ou em fossa séptica ligada à rede, sobre o
   total de DPPO do setor. Seis classes: até 10%, 10 a 50%, 50 a 80%, 80 a 95%, 95 a 99% e mais
   de 99%.
3. **Sigilo.** O IBGE troca por `X` as contagens pequenas de um setor. Nas variáveis usadas aqui,
   nenhum 1 ou 2 aparece nos dados de São Paulo, e o 3 e o 4 aparecem milhares de vezes; um `X`,
   portanto, esconde 1 ou 2. O `X` nunca é lido como zero: o setor só recebe uma classe quando
   ela é a mesma com `X` = 1 e com `X` = 2. Os 3.209 setores em que a classe depende do valor
   omitido (163.490 domicílios) vão hachurados como sem informação.
4. Os setores viram uma grade de 0,002° (cerca de 200 m) para caber na prancha do estado; os
   2.391 setores sem domicílio ocupado ficam em cinza-claro.
5. Totais do estado e dos municípios: tabela 6805 do SIDRA, sem sigilo.

## Limitações

- O Censo pergunta para onde vai o esgoto, não se ele é tratado. Ligado à rede não quer dizer
  tratado.
- Um setor rural grande pesa muito no mapa e pouco nos números: por isso o painel mede as
  classes em domicílios, não em área.
- A grade de 200 m some com os setores urbanos menores; o GPKG traz todos.
