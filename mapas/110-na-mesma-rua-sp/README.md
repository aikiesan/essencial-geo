---
numero: 110
titulo: "Na mesma rua"
subtitulo: "Ao lado da casa de um homem responsável, a casa de uma mulher tem a mesma água, esgoto e coleta"
data: 2027-01-09
categoria: censo-renda
colecao: mulheres-responsaveis-sp
tags: [mulheres-responsaveis-sp, sao-paulo, censo-2022, saneamento, agua, esgoto, coleta-de-lixo, genero, setores-censitarios, municipios]

contexto: >-
  Comparadas, dentro de cada setor censitário, às casas com responsável homem, as casas com responsável mulher têm quase a mesma cobertura: +0,15 ponto na água da rede, +0,07 no esgoto e +0,03 na coleta de lixo, no estado. Em 595 dos 645 municípios, a média das três fica entre −1 e +1 ponto. A vantagem das casas delas nas pranchas 106 e 107 vem do endereço: elas moram mais nos setores urbanos, onde a rede já chegou. Banheiro de uso exclusivo e água encanada dentro de casa quase não variam. Taquarivaí tem a maior diferença dentro do setor (+3,9). O setor é a menor área publicada; dentro dele, o Censo não diz qual casa fica onde. Oitava e última prancha da coleção «Mulheres responsáveis pelo domicílio».

imagem: ./mapa_preview.png
imagem_alt: "Mapa coroplético dos 645 municípios de São Paulo pela diferença dentro do setor censitário entre as casas com responsável mulher e com responsável homem, média de água da rede, esgoto e lixo coletado. Quase todo o estado é cinza (entre −1 e +1 ponto, 595 municípios); 48 aparecem em lilás claro (+1 a +5) e 2 em ocre (elas com 1 ponto a menos ou mais). Chamadas apontam Taquarivaí, com +3,9, e Cunha, com −0,4 dentro do setor e +23 no município inteiro. No painel, barras decompõem a diferença de cada serviço no estado em endereço e dentro do setor."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Censo Demográfico 2022: agregados por setores censitários (domicílio, parte 2; renda do responsável)"
    nome_en: "IBGE — 2022 Population Census: aggregates by census tract (households, part 2; income of the responsible person)"
    url: https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html
    ano: 2022
  - nome: "IBGE — Censo Demográfico 2022, SIDRA tabela 9882 (domicílios por presença de cônjuge e filhos e sexo do responsável, universo)"
    nome_en: "IBGE — 2022 Population Census, SIDRA table 9882 (households by presence of spouse and children and sex of the responsible person, full count)"
    url: https://sidra.ibge.gov.br/tabela/9882
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Diferença entre as casas com responsável mulher e com responsável homem do mesmo setor censitário, em pontos percentuais, média de água da rede, esgoto na rede e lixo coletado, por município (setores do Censo 2022, universo); seis classes; decomposição da diferença do estado em endereço e dentro do setor."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#ddd0e6", descricao: "645 municípios com as variáveis das oito pranchas, a classe bivariada b109 e os aglomerados LISA lisa103 e lisa109", descricao_en: "645 municipalities with the variables of all eight plates, the bivariate class b109 and the LISA clusters lisa103 and lisa109" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Municípios entre −1 e +1 ponto dentro do setor"
    rotulo_en: "Municipalities between −1 and +1 point within the tract"
    valor: 595
    unidade: "municípios"
    unidade_en: "municipalities"
    nota: "de 645"
    nota_en: "out of 645"
  - tipo: numero
    rotulo: "Água da rede, diferença dentro do setor no estado"
    rotulo_en: "Mains water, within-tract gap statewide"
    valor: 0.15
    unidade: "pontos percentuais"
    unidade_en: "percentage points"
    nota: "diferença total +2,41"
    nota_en: "total gap +2.41"
  - tipo: numero
    rotulo: "Esgoto na rede, diferença dentro do setor no estado"
    rotulo_en: "Mains sewerage, within-tract gap statewide"
    valor: 0.07
    unidade: "pontos percentuais"
    unidade_en: "percentage points"
    nota: "diferença total +2,24"
    nota_en: "total gap +2.24"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/mulheres-responsaveis-sp-2026/sp_mulheres_responsaveis_2022.gpkg.zip
    rotulo: "Municípios e áreas de ponderação com as variáveis das oito pranchas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities and weighting areas with the variables of all eight plates, SIRGAS 2000, with QGIS styles"
    tamanho: "11,8 MB"
  - formato: csv
    arquivo: dados/sp_mulheres_responsaveis_municipios_2022.csv
    rotulo: "Tabela dos municípios"
    rotulo_en: "Municipal table"
    tamanho: "230 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/mulheres-responsaveis-sp-2026/sp_servicos_dentro_do_setor_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/mulheres-responsaveis-sp-2026/sp_servicos_dentro_do_setor_2022_prancha.en.svg
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

# Diferença de serviços entre casas de mulheres e de homens responsáveis dentro do mesmo setor censitário, São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 110, a oitava de oito da coleção **Mulheres responsáveis pelo domicílio**; a anterior é a [prancha 109](../109-renda-e-responsaveis-mulheres-sp/README.md).

A coleção cruza a parte de domicílios com responsável mulher com os serviços da casa e da rua e com
a renda, nos 645 municípios de São Paulo. Antes dos mapas vieram os testes: correlação de postos
bruta e parcial (descontadas urbanização, densidade e renda), amostra efetiva corrigida pela
autocorrelação espacial, valores q de Benjamini–Hochberg, I de Moran, LISA, e a comparação entre
municípios e áreas de ponderação. A maior parte das relações com os serviços some quando se desconta
a urbanização: responsáveis mulheres são mais comuns nas cidades, e as cidades têm mais rede. As
relações fracas também viram mapa, como retrato descritivo, e o texto diz que são fracas.

As chamadas do mapa apontam Taquarivaí, com a maior diferença dentro do setor (+3,9 pontos; +5,9 sem
descontar o endereço), e Cunha, com −0,4 na mesma rua e +23 no município inteiro, a maior diferença
das pranchas 106 e 107.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios com as variáveis das oito pranchas: parte de responsáveis mulheres em 2010 e 2022, composição das casas, água, esgoto, lixo, banheiro e água encanada por sexo do responsável, iluminação pública, renda por sexo, `b109`, `lisa103` e `lisa109` |
| `apond` | polígono | 2.520 áreas de ponderação com a parte de responsáveis mulheres, urbanização, renda dos responsáveis e as diferenças de água e esgoto |
| `regioes_intermediarias`, `limite_estadual` | polígono | referência |

O **GPKG** é o mesmo nas oito pranchas e traz um estilo do QGIS para cada uma. O **CSV** tem a
tabela dos municípios, sem geometria. Nas colunas, `_lo` e `_hi` são os limites do sigilo; os
aglomerados LISA vêm como `AA` (alto-alto), `BB` (baixo-baixo), `AB`, `BA` e `ns` (não
significativo).

## Método

1. `dif_setor_media`: média simples de `agua_rede_dif_setor`, `esgoto_rede_dif_setor` e
   `lixo_coletado_dif_setor`; `dif_media`, a mesma média das diferenças totais.
2. Decomposição da diferença entre mulheres e homens: a parte de «endereço» (onde elas moram) é a
   cobertura que as casas delas teriam se, em cada setor censitário, tivessem a mesma taxa das casas de
   homens do setor, menos a cobertura dos homens; a parte «dentro do setor» é o resto. O setor é a
   menor área publicada; dentro dele, o Censo não diz qual casa fica onde.
3. No estado, por serviço: água da rede geral: 96,9% nas casas delas e 94,5% nas deles (+2,41
   pontos; endereço +2,26, dentro do setor +0,15); esgoto na rede: 92,4% nas casas delas e 90,1% nas
   deles (+2,24 pontos; endereço +2,17, dentro do setor +0,07); lixo coletado: 99,4% nas casas delas e
   98,6% nas deles (+0,72 ponto; endereço +0,69, dentro do setor +0,03); banheiro de uso exclusivo:
   99,9% nas casas delas e 99,9% nas deles (+0,05 ponto; endereço +0,00, dentro do setor +0,05); água
   encanada dentro de casa: 99,6% nas casas delas e 99,5% nas deles (+0,12 ponto; endereço +0,07,
   dentro do setor +0,06).
4. Classes: elas com 1 ponto a menos ou mais (2 municípios); −1 a +1 (595); +1 a +5 (48); +5 a +10,
   +10 a +20 e +20 ou mais (nenhum).
5. Banheiro de uso exclusivo: `banheiro_*` (domicílios com banheiro de uso exclusivo); água encanada
   dentro de casa: `agua_dentro_*` (canalizada até dentro do domicílio). Lixo coletado:
   `lixo_coletado_*` (coletado no domicílio por serviço de limpeza ou depositado em caçamba). Todos com
   as mesmas colunas `_homem`, `_mulher`, `_dif`, `_dif_lo`, `_dif_hi`, `_dif_composicao` e
   `_dif_setor`.

## Limitações

- Diferença dentro do setor perto de zero não prova que não haja desigualdade: o setor tem em média
  algumas centenas de casas, e a rua dentro dele pode separar. Ela mostra que, no menor recorte
  publicado, a casa de uma mulher e a de um homem quase não se distinguem nos serviços de rede.
- Nos setores, o IBGE troca por X as células de 1 ou 2 domicílios (nas categorias raras, os valores
  1 e 2 nunca aparecem publicados). Aqui o X vale 1,5, e cada taxa e diferença traz os limites com X =
  1 e X = 2 no pior caso (colunas `_lo` e `_hi`); setores inteiros em X ficam de fora. A soma dos
  setores reproduz a parte de responsáveis mulheres da tabela 9882 em cada município com erro de no
  máximo 0,45 ponto (mediana 0,01).
- Pessoa responsável é quem os moradores apontam como tal ao recenseador. Não quer dizer quem
  sustenta a casa, nem mãe solo: das casas paulistas com responsável mulher, 44% têm cônjuge.
- Leitura ecológica: o mapa compara lugares, não pessoas. Uma correlação entre municípios não diz
  que as mesmas casas têm as duas características, nem que uma causa a outra; urbanização, renda e
  idade podem estar por trás das duas.
