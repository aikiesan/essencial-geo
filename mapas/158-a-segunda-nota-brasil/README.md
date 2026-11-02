---
numero: 158
titulo: "A segunda nota"
subtitulo: "Na renovação, a nota mediana do milho subiu 15 pontos; no Nordeste, a maioria caiu"
data: 2027-02-10
rascunho: true
categoria: energia
colecao: renovabio-br
tags: [renovabio-br, brasil, renovabio, cbio, certificacao, etanol, milho, biodiesel, nordeste, anp]

contexto: >-
  O certificado do RenovaBio vale três anos; na renovação, a usina refaz a conta e recebe uma nota nova. Das 338 usinas certificadas em 27/10/2026, 309 já tinham passado por isso, a maioria com o primeiro certificado de 2020. Comparada com a do primeiro certificado, a nota subiu em 189 delas (61%) e caiu em 120; a mudança mediana foi de +1,1, de 60,2 para 61,9. O salto maior foi o do etanol de milho: a nota mediana das 8 usinas foi de 45,9 para 60,9, e a fração elegível, de 48% para 72%. No Centro-Oeste, 59 usinas subiram e 24 caíram; no Nordeste, 24 das 40 caíram, com mediana de −1,0. A maior alta foi de uma usina de cana em Santa Rita (PB), de 37,0 para 60,9; a maior queda, de uma de biodiesel em Rondonópolis (MT), de 80,2 para 44,5. Terceira prancha da coleção «A nota de cada usina».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers com as 309 usinas certificadas no RenovaBio que já renovaram o certificado, cada uma um círculo na sede do município, colorido pela diferença entre a nota em vigor e a do primeiro certificado: azul-escuro (subiu mais de 5), azul-claro (subiu 1 a 5), cinza (quase igual), salmão (caiu 1 a 5) e tijolo (caiu mais de 5). Os azuis predominam em São Paulo, Goiás e Mato Grosso do Sul; no litoral do Nordeste, entre Rio Grande do Norte e Alagoas, há mais círculos salmão e tijolo. Uma chamada aponta Santa Rita (PB), de 37,0 para 60,9, e outra Rondonópolis (MT), de 80,2 para 44,5. No painel, linhas da nota mediana de cada rota do primeiro certificado ao atual, com o milho subindo de 45,9 para 60,9, um histograma da mudança por usina e barras de quantas subiram e caíram em cada região."

recorte: "Brasil"
fontes:
  - nome: "ANP — Certificados da Produção ou Importação Eficiente de Biocombustíveis, planilha de certificados aprovados, abas «Válidos» e «Cancelados ou Suspensos» (certificados-aprovados-producao.xlsx, atualizada em 27/10/2026, acesso em 01/11/2026)"
    nome_en: "ANP — Efficient Biofuel Production or Import Certificates, spreadsheet of approved certificates, sheets «Válidos» and «Cancelados ou Suspensos» (certificados-aprovados-producao.xlsx, updated 27/10/2026, accessed 01/11/2026)"
    url: https://www.gov.br/anp/pt-br/assuntos/renovabio/certificados-producao-importacao-eficiente-biocombustiveis
    ano: 2026
  - nome: "ANP — Painéis Dinâmicos de Produtores de Etanol e de Biodiesel, dados abertos: município por CNPJ (acesso em 01/11/2026)"
    nome_en: "ANP — Ethanol and Biodiesel Producers Dynamic Panels, open data: municipality by CNPJ (accessed 01/11/2026)"
    url: https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos/producao-de-biocombustiveis
    ano: 2026
  - nome: "IBGE — Localidades 2022 (sedes municipais)"
    nome_en: "IBGE — Localities 2022 (municipal seats)"
    url: https://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/localidades/
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
  - nome: "Natural Earth — países vizinhos (via world-atlas)"
    nome_en: "Natural Earth — neighbouring countries (via world-atlas)"
    url: https://www.naturalearthdata.com/
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "pandas", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Para cada usina com certificado válido em 27/10/2026, a nota (gCO₂eq/MJ) do combustível principal menos a do primeiro certificado do mesmo CNPJ aprovado entre 2019 e 2026 (abas de cancelados, vencidos ou suspensos); classes de −5, −1, +1 e +5 pontos."

camadas:
  - { nome: usinas, tipo: ponto, cor: "#2f5f86", descricao: "309 usinas renovadas: os campos da Nº 156 e mais nota_0, eleg_0, aprov_0 (primeiro certificado), certificados_anteriores, delta_nota, delta_eleg e classe_delta", descricao_en: "309 renewed plants: the fields of No. 156 plus nota_0, eleg_0, aprov_0 (first certificate), certificados_anteriores, delta_nota, delta_eleg and classe_delta" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 UFs: usinas renovadas e mudança mediana da nota", descricao_en: "27 states: renewed plants and median score change" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Usinas que subiram a nota na renovação"
    rotulo_en: "Plants that raised their score on renewal"
    valor: 189
    unidade: "de 309"
    nota: "61%; 120 caíram; mudança mediana +1,1"
    nota_en: "61%; 120 fell; median change +1.1"
  - tipo: numero
    rotulo: "Nota mediana do etanol de milho, primeiro certificado → em vigor"
    rotulo_en: "Median corn ethanol score, first certificate → current"
    valor: 60.9
    unidade: "gCO₂eq/MJ"
    nota: "45,9 no primeiro certificado; 8 usinas; elegível de 48% para 72%"
    nota_en: "45.9 on the first certificate; 8 plants; eligible share from 48% to 72%"
  - tipo: barras
    rotulo: "Mudança mediana da nota por região"
    rotulo_en: "Median score change by region"
    unidade: "gCO₂eq/MJ"
    itens:
      - { rotulo: "Centro-Oeste (83)", valor: 2.0, cor: "#2f5f86" }
      - { rotulo: "Sudeste (150)", valor: 1.5, cor: "#8fb0c6" }
      - { rotulo: "Norte (6)", valor: 0.2, cor: "#d3d6d9" }
      - { rotulo: "Sul (30)", valor: -0.4, cor: "#d3d6d9" }
      - { rotulo: "Nordeste (40)", valor: -1.0, cor: "#e0ad83" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/renovabio-br-2026/br_renovabio_renovacao.gpkg.zip
    rotulo: "Usinas renovadas, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Renewed plants, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,2 MB"
  - formato: csv
    arquivo: dados/br_renovabio_renovacao.csv
    rotulo: "As 309 usinas, com a primeira nota, a nota em vigor e a diferença"
    rotulo_en: "The 309 plants, with first score, current score and the difference"
    tamanho: "95 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/renovabio-br-2026/br_renovabio_renovacao_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/renovabio-br-2026/br_renovabio_renovacao_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "3,4 MB"
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

# A segunda nota: como mudou a nota das usinas do RenovaBio entre o primeiro certificado e o atual

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 158, a terceira e última da coleção **A nota de cada usina**. O RenovaBio começou a
certificar usinas no fim de 2019; os primeiros certificados venceram em 2023 e foram renovados com
notas novas. Esta prancha compara, usina a usina, a nota de hoje com a primeira.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `usinas` | ponto | 309 usinas: os campos da Nº 156 e mais `nota_0`, `eleg_0`, `aprov_0` (primeiro certificado), `certificados_anteriores`, `delta_nota`, `delta_eleg`, `classe_delta` |
| `ufs` | polígono | 27 UFs: `usinas_renovadas`, `delta_nota_mediano` |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `renovabio-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/renovabio-br-2026),
com os **estilos do QGIS** gravados (cor pela classe da mudança). O **CSV** fica nesta pasta, em UTF-8,
com a tabela das usinas sem geometria.

## Método

1. Certificados válidos em 27/10/2026 (aba «Válidos» da planilha da ANP): 338 usinas no Brasil, como na
   Nº 156.
2. Histórico: aba «Cancelados ou Suspensos», com os certificados cancelados por renovação, vencidos,
   suspensos ou trocados de titular. Para cada CNPJ, o certificado mais antigo aprovado entre 2019 e
   2026 (duas linhas com data de aprovação inválida, 1970 e 2015, ficam de fora).
3. Mudança = nota do certificado em vigor − nota do primeiro certificado, no combustível principal
   (etanol hidratado, biodiesel ou biometano). 309 usinas têm as duas; 29 estão no primeiro certificado.
4. A comparação é pelo CNPJ: uma usina que trocou de dono e de CNPJ aparece como primeira certificação.

## Leitura

- 189 das 309 usinas (61%) subiram a nota e 120 caíram. Mudança mediana +1,1; a nota mediana foi de 60,2
  para 61,9. 60 subiram mais de 5 pontos e 36 caíram mais de 5.
- Etanol de milho (8 usinas): nota mediana de 45,9 para 60,9, 6 subiram, e a fração elegível mediana
  passou de 48% para 72%. Cana e milho (6): de 60,5 para 66,4, todas subiram. Cana (249): de 60,0 para
  61,8, 62% subiram.
- Biodiesel (41): mudança mediana −0,2, 20 subiram. A mediana do grupo cai de 77,1 para 65,9 porque
  quatro usinas que estavam perto de 80 caíram para entre 44,5 e 65,9; em três delas a
  fração elegível subiu ao mesmo tempo.
- Por região: Centro-Oeste 59 subiram e 24 caíram (+2,0), Sudeste 95 e 55 (+1,5), Sul 15 e 15 (−0,4),
  Nordeste 16 e 24 (−1,0).
- A maior alta: Companhia Usina São João, em Santa Rita (PB), de 37,0 para 60,9. A maior queda:
  Caibiense Gran Vita, em Rondonópolis (MT), biodiesel, de 80,2 para 44,5, com a fração elegível de 19%
  para 80%.

## Limitações

- A nota muda por motivos diferentes: melhora real do processo, dados melhores da usina ou dos
  fornecedores, mudança da matéria-prima ou da versão da RenovaCalc. A planilha não separa os motivos.
- A primeira nota é a do certificado mais antigo encontrado para o CNPJ; usinas com várias renovações
  podem ter tido notas intermediárias diferentes.
- As medianas por rota comparam conjuntos de usinas iguais (as mesmas nos dois momentos), mas pequenos
  no milho (8), no flex (6) e no biometano (5).

## Licença dos dados

Dados abertos da ANP e do IBGE, de uso livre com citação da fonte.
