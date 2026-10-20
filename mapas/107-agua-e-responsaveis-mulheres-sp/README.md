---
numero: 107
titulo: "A água chega pelo endereço"
subtitulo: "Em quase todo município, as casas delas têm mais água da rede; quase tudo é onde ficam"
data: 2026-11-03
categoria: censo-renda
colecao: mulheres-responsaveis-sp
tags: [mulheres-responsaveis-sp, sao-paulo, censo-2022, saneamento, agua, genero, setores-censitarios, municipios]

contexto: >-
  No estado, 96,9% das casas com responsável mulher recebem água da rede geral, contra 94,5% das com responsável homem: +2,4 pontos, dos quais +2,26 são endereço e +0,15 sobram dentro do mesmo setor censitário. Elas têm mais água da rede em 620 dos 645 municípios, de forma robusta ao sigilo. Em Cunha são 77% contra 48%; em Piedade, 67% contra 50%; no Guarujá, uma das exceções, elas têm um pouco menos. Descontada a urbanização, a parte de responsáveis mulheres quase não se relaciona com a cobertura (parcial 0,07). Quinta prancha da coleção «Mulheres responsáveis pelo domicílio».

imagem: ./mapa_preview.png
imagem_alt: "Mapa coroplético dos 645 municípios de São Paulo pela diferença, em pontos percentuais, entre a parte das casas com responsável mulher e com responsável homem que recebem água da rede geral: cinza entre −1 e +1 e quatro tons de lilás de +1 a +20 pontos ou mais. Quase todo o estado é lilás, mais escuro nos municípios com zona rural grande. Chamadas apontam Cunha, com +29 pontos, Piedade, com +17, e o Guarujá, com −0,4. No painel, a decomposição da diferença do estado em endereço e dentro do setor."

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
metodo: "Parte das casas com responsável mulher e com responsável homem abastecidas pela rede geral, pela soma dos setores censitários do Censo 2022 (universo); diferença em pontos percentuais, decomposta em endereço e dentro do setor; seis classes; correlações de postos de Spearman, brutas e parciais."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#9972af", descricao: "645 municípios com as variáveis das oito pranchas, a classe bivariada b109 e os aglomerados LISA lisa103 e lisa109", descricao_en: "645 municipalities with the variables of all eight plates, the bivariate class b109 and the LISA clusters lisa103 and lisa109" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Diferença no estado, mulheres − homens"
    rotulo_en: "Gap statewide, women − men"
    valor: 2.41
    unidade: "pontos percentuais"
    unidade_en: "percentage points"
    nota: "endereço +2,26; dentro do setor +0,15"
    nota_en: "address +2.26; within the tract +0.15"
  - tipo: numero
    rotulo: "Municípios em que as casas delas têm mais água da rede"
    rotulo_en: "Municipalities where women’s homes have more mains water"
    valor: 620
    unidade: "municípios"
    unidade_en: "municipalities"
    nota: "robusto ao sigilo"
    nota_en: "robust to confidentiality"
  - tipo: numero
    rotulo: "Correlação parcial com a parte de responsáveis mulheres"
    rotulo_en: "Partial correlation with the share of women responsible"
    valor: 0.07
    nota: "bruta 0,26"
    nota_en: "raw 0.26"

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
    url: https://github.com/aikiesan/essencial-geo/releases/download/mulheres-responsaveis-sp-2026/sp_agua_por_sexo_do_responsavel_2022_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/mulheres-responsaveis-sp-2026/sp_agua_por_sexo_do_responsavel_2022_prancha.en.svg
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

# Água da rede geral por sexo do responsável nos municípios de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 107, a quinta de oito da coleção **Mulheres responsáveis pelo domicílio**; a anterior é a [prancha 106](../106-esgoto-e-responsaveis-mulheres-sp/README.md); a seguinte, a [prancha 108](../108-luz-na-rua-sp/README.md).

A coleção cruza a parte de domicílios com responsável mulher com os serviços da casa e da rua e com
a renda, nos 645 municípios de São Paulo. Antes dos mapas vieram os testes: correlação de postos
bruta e parcial (descontadas urbanização, densidade e renda), amostra efetiva corrigida pela
autocorrelação espacial, valores q de Benjamini–Hochberg, I de Moran, LISA, e a comparação entre
municípios e áreas de ponderação. A maior parte das relações com os serviços some quando se desconta
a urbanização: responsáveis mulheres são mais comuns nas cidades, e as cidades têm mais rede. As
relações fracas também viram mapa, como retrato descritivo, e o texto diz que são fracas.

As chamadas do mapa apontam Cunha (+29 pontos, a maior diferença), Piedade (+17: 67% das casas delas
e 50% das deles) e o Guarujá (−0,4), um dos poucos em que elas têm menos.

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

1. `agua_rede_homem`, `agua_rede_mulher`, `agua_rede_dif` (com `_lo` e `_hi`),
   `agua_rede_dif_composicao` e `agua_rede_dif_setor`: domicílios abastecidos pela rede geral de
   distribuição, em % das casas com responsável homem e mulher, e as diferenças em pontos percentuais
   (setores do Censo 2022, universo).
2. Classes da diferença: elas com 1 ponto a menos ou mais; −1 a +1; +1 a +5; +5 a +10; +10 a +20;
   +20 ou mais. Diferença mediana nos municípios: +6,7 pontos (endereço +6,5, dentro do setor +0,2).
3. Sinal robusto ao sigilo: elas têm mais em 620 municípios e menos em 2 mesmo no pior caso; em
   nenhum a falta passa de 1 ponto. A largura mediana do intervalo do sigilo é de 0,8 ponto.
4. Decomposição da diferença entre mulheres e homens: a parte de «endereço» (onde elas moram) é a
   cobertura que as casas delas teriam se, em cada setor censitário, tivessem a mesma taxa das casas de
   homens do setor, menos a cobertura dos homens; a parte «dentro do setor» é o resto. O setor é a
   menor área publicada; dentro dele, o Censo não diz qual casa fica onde.
5. Parte de responsáveis mulheres × água da rede (total): correlação de postos de Spearman 0,26 (645
   municípios), parcial 0,07, amostra efetiva 569, p < 0,001; nas áreas de ponderação, 0,46 (parcial
   0,03). Parte de responsáveis mulheres × diferença: correlação de postos de Spearman −0,26 (645
   municípios), parcial −0,09, amostra efetiva 582, p < 0,001.
6. Correlação parcial: correlação entre os resíduos dos postos de cada variável regredidos nos
   postos dos controles, que são urbanização (parte de moradores em situação urbana), log da densidade
   demográfica e log da renda média dos responsáveis; sai o controle da mesma família da variável.
   Amostra efetiva sob autocorrelação espacial: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), com Iₓ e Iᵧ o I de Moran dos
   resíduos numa vizinhança dos 6 vizinhos mais próximos; valores q de Benjamini–Hochberg sobre todos
   os testes da coleção.

## Limitações

- Nos setores, o IBGE troca por X as células de 1 ou 2 domicílios (nas categorias raras, os valores
  1 e 2 nunca aparecem publicados). Aqui o X vale 1,5, e cada taxa e diferença traz os limites com X =
  1 e X = 2 no pior caso (colunas `_lo` e `_hi`); setores inteiros em X ficam de fora. A soma dos
  setores reproduz a parte de responsáveis mulheres da tabela 9882 em cada município com erro de no
  máximo 0,45 ponto (mediana 0,01).
- Fora da rede geral estão poço, nascente, carro-pipa e outras formas; no campo, poço não quer dizer
  falta de água. A diferença mede o acesso à rede, não a qualidade nem a regularidade do
  abastecimento.
- Pessoa responsável é quem os moradores apontam como tal ao recenseador. Não quer dizer quem
  sustenta a casa, nem mãe solo: das casas paulistas com responsável mulher, 44% têm cônjuge.
- Leitura ecológica: o mapa compara lugares, não pessoas. Uma correlação entre municípios não diz
  que as mesmas casas têm as duas características, nem que uma causa a outra; urbanização, renda e
  idade podem estar por trás das duas.
