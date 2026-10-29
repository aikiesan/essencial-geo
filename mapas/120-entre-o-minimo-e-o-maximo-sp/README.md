---
numero: 120
titulo: "Entre o mínimo e o máximo"
subtitulo: "O mesmo estado, os mesmos resíduos: trocar as hipóteses multiplica o potencial por oito"
data: 2026-11-10
categoria: energia
colecao: funil-sp
tags: [funil-sp, sao-paulo, biogas, biometano, cenarios, incerteza, cp2b]
rascunho: true                      # fora do ar: resguardo de artigo em preparação

contexto: >-
  As quatro pranchas anteriores usam o cenário de referência do CP2B. Mas cada fator do método, da geração de resíduo à coleta, aos usos concorrentes e à logística, tem uma faixa na literatura, e o método calcula também um cenário com todos no fim baixo e outro com todos no fim alto. O metano acessível (N4) de São Paulo vai de 1,9 bilhão de m³ por ano no mínimo a 15,6 bilhões no máximo, 8,3 vezes mais; no teórico (N1), a faixa é de 3,7 vezes, porque as perdas de cada passo também mudam. No mínimo, 145 municípios ficam sem nada acessível, sobretudo no leste e no sul; no máximo, nenhum. Na pecuária, o máximo é 26 vezes o mínimo, porque o esterco que se recolhe e o raio da usina variam muito; na cana, 6,7 vezes. Os cenários são extremos, não intervalos de confiança. Quinta e última prancha da coleção «O funil do biometano».

imagem: ./mapa_preview.png
imagem_alt: "Três mapas coropléticos dos municípios de São Paulo com as mesmas sete classes da paleta viridis, do cinza ao roxo, pelo metano acessível em cada cenário do CP2B. No mínimo, com 1,9 bilhão de m³, predominam o amarelo e o verde-claro, e o leste do estado, o Vale do Ribeira e o Vale do Paraíba ficam em cinza, sem nada acessível. Na referência, com 6,0 bilhões, o interior fica verde e azul, com roxo no norte canavieiro. No máximo, com 15,6 bilhões, o azul e o roxo cobrem quase todo o interior, e até o Vale do Paraíba fica verde. No quarto quadro, barras mostram a faixa por grupo, do mínimo ao máximo, com um traço na referência: resíduos da cana de 1,77 a 11,81 bilhões de m³, outras lavouras de 0,02 a 1,17, pecuária de 0,07 a 1,72 e lixo, poda e esgoto de 0,02 a 0,88. No painel, uma tabela dá os quatro níveis nos três cenários."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "CP2B (Unicamp) — potencial de biogás e biometano por município e resíduo, níveis N1 a N4, cenários mínimo, de referência e máximo, método v5.1"
    nome_en: "CP2B (Unicamp) — biogas and biomethane potential by municipality and residue, levels N1 to N4, low, reference and high scenarios, method v5.1"
    ano: 2026
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Para cada município, a soma dos 17 resíduos do CP2B v5.1 no nível acessível (N4), em m³ normais de metano por ano, nos três cenários do método: mínimo, com todos os fatores no fim baixo da faixa da literatura; referência; e máximo, com todos no fim alto. Os três mapas usam as mesmas classes. A largura da faixa é (máximo − mínimo) ÷ referência."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#472d7b", descricao: "645 municípios; os estilos n4_min, n4_ref e n4_max reproduzem os três mapas (mesmo GPKG das pranchas 116 a 120)", descricao_en: "645 municipalities; the n4_min, n4_ref and n4_max styles reproduce the three maps (same GPKG as plates 116 to 120)" }

indicadores:
  - tipo: barras
    rotulo: "Metano acessível (N4) nos três cenários"
    rotulo_en: "Accessible methane (N4) in the three scenarios"
    unidade: "bilhões de m³ por ano"
    unidade_en: "billion m³ a year"
    itens:
      - { rotulo: "mínimo", rotulo_en: "low", valor: 1.88, cor: "#b5de2b" }
      - { rotulo: "referência", rotulo_en: "reference", valor: 5.97, cor: "#2c728e" }
      - { rotulo: "máximo", rotulo_en: "high", valor: 15.58, cor: "#472d7b" }
  - tipo: barras
    rotulo: "Metano teórico (N1) nos três cenários"
    rotulo_en: "Theoretical methane (N1) in the three scenarios"
    unidade: "bilhões de m³ por ano"
    unidade_en: "billion m³ a year"
    itens:
      - { rotulo: "mínimo", rotulo_en: "low", valor: 11.61, cor: "#b5de2b" }
      - { rotulo: "referência", rotulo_en: "reference", valor: 23.64, cor: "#2c728e" }
      - { rotulo: "máximo", rotulo_en: "high", valor: 43.00, cor: "#472d7b" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/funil-sp-2026/sp_funil_biometano.gpkg.zip
    rotulo: "Municípios e pontos da coleção inteira (pranchas 116 a 120), SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities and points for the whole collection (plates 116 to 120), SIRGAS 2000, with QGIS styles"
    tamanho: "4,6 MB"
  - formato: csv
    arquivo: dados/sp_funil_municipios.csv
    rotulo: "Tabela dos municípios (a mesma nas cinco pranchas)"
    rotulo_en: "Municipal table (the same on all five plates)"
    tamanho: "156 kB"
  - formato: csv
    arquivo: dados/sp_funil_substratos.csv
    rotulo: "Os quatro níveis por resíduo e cenário, total do estado"
    rotulo_en: "The four levels by residue and scenario, state total"
    tamanho: "4 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/funil-sp-2026/sp_funil_cenarios_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/funil-sp-2026/sp_funil_cenarios_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "5,8 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,4 MB"

doi_automatico: false
versao: "1.0.0"
discussoes: []
---

# O metano acessível de São Paulo entre o mínimo e o máximo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 120, a última de cinco da coleção **O funil do biometano**: o mesmo nível acessível (N4) nos
três cenários do CP2B, para mostrar quanto o resultado depende das hipóteses.

## O que vem nos arquivos

- `dados/sp_funil_municipios.csv`: uma linha por município. Esta prancha usa `n4_min_m3`, `n4_m3`
  (referência) e `n4_max_m3`, `n3_min_m3` e `n3_max_m3`, e `faixa_n4_rel`, a largura da faixa,
  (máximo − mínimo) ÷ referência.
- `dados/sp_funil_substratos.csv`: os quatro níveis de cada um dos 17 resíduos no total do estado, nos
  três cenários (coluna `cenario`: `min`, `med`, `max`).
- `sp_funil_biometano.gpkg.zip` (na release `funil-sp-2026`): na camada `municipios`, os estilos
  `n4_min`, `n4_ref` e `n4_max` reproduzem os três mapas, com as mesmas classes.

## Método

1. O CP2B v5.1 calcula cada nível em três cenários. No mínimo, todos os fatores do método (geração de
   resíduo, sólidos, potencial bioquímico de metano, coleta, usos concorrentes, estocagem e logística)
   ficam no fim baixo da faixa da literatura; no máximo, no fim alto; a referência fica entre eles.
2. Os três mapas usam as mesmas classes de N4, em m³ normais de metano por ano, para que a diferença de
   cor seja diferença de potencial.
3. As barras do quarto quadro somam o N4 por grupo de resíduo (cana; outras lavouras; pecuária; lixo,
   poda e esgoto) nos três cenários.

## Limitações

- Os cenários são extremos, não intervalos de confiança: é improvável que todos os fatores fiquem ao
  mesmo tempo no fim baixo ou no fim alto. O valor real tende a ficar dentro da faixa, mas a faixa não
  tem probabilidade.
- Onde o mínimo é zero ou quase zero, a razão entre máximo e mínimo não diz nada; por isso a tabela usa
  a largura relativa à referência.
- O método é da versão 5.1 do CP2B (24/09/2026); os números podem mudar em versões seguintes.
