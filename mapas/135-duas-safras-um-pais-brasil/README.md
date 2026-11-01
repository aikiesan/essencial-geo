---
numero: 135
titulo: "Duas safras, um país"
subtitulo: "Uma safra no inverno, outra no verão"
data: 2026-12-14
rascunho: true
categoria: energia
colecao: ritmo-biomassa-br
tags: [ritmo-biomassa-br, brasil, biomassa, eletricidade, termeletricas, bagaco-de-cana, safra, sazonalidade, ons, aneel, siga]

contexto: >-
  A eletricidade da biomassa segue a colheita. Das 51 unidades a biomassa que o ONS mede uma a uma, 37 queimam bagaço de cana, todas no Centro-Sul, e 25 delas geram mais entre junho e agosto: 88% do que produzem sai de abril a novembro, a safra da região. No Nordeste a cana é colhida de setembro a março, mas nenhuma usina de lá tem série usável no ONS; o que se vê são as pequenas térmicas somadas por estado, de combustível não informado, que geram 74% do ano nesses meses. Em Alagoas, onde 91% da potência térmica de até 30 MW é de bagaço, 93% da geração cai de setembro a março e nada de junho a agosto. Quatro das seis unidades de celulose, que queimam licor negro, não têm estação marcada.

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers com 51 círculos, um por usina ou conjunto a biomassa medido pelo ONS, de tamanho proporcional aos MW médios gerados e cor do mês de maior geração, numa roda de doze cores: azuis em janeiro e fevereiro, verdes em março e abril, amarelos e laranjas de maio a agosto, vermelhos e roxos de setembro a novembro e azul-anil em dezembro; cinza para quem não tem estação marcada. Os estados levam, mais claro, o mês de pico das pequenas térmicas do ONS. Os círculos laranja e amarelos se juntam em São Paulo, Goiás, Mato Grosso do Sul e no Triângulo Mineiro, e São Paulo, Paraná e o Centro-Oeste aparecem em laranja-claro, pico em julho; Pernambuco, Paraíba, Alagoas e Sergipe aparecem em azul-arroxeado, pico em dezembro. As fábricas de celulose, grandes, ficam cinza. Três chamadas: as 37 unidades de cana, com pico em julho e 88% da geração de abril a novembro; Alagoas, com 93% de setembro a março e 0% de junho a agosto; e a Suzano, no Maranhão, sem estação. No painel, três rosas com a parcela de cada mês (cana do Centro-Sul, pequenas térmicas do Centro-Sul e do Nordeste) e a faixa mensal das pequenas térmicas de cada estado."

recorte: "Brasil"
fontes:
  - nome: "ONS — Geração por usina em base horária, dados abertos, 2015–2024"
    nome_en: "ONS — Hourly generation by plant, open data, 2015–2024"
    url: https://dados.ons.org.br/dataset/geracao-usina-2
    ano: "2015–2024"
  - nome: "ANEEL — Sistema de Informações de Geração (SIGA), empreendimentos de geração, dados abertos de 01/10/2026"
    nome_en: "ANEEL — Generation Information System (SIGA), generation projects, open data of 01/10/2026"
    url: https://dadosabertos.aneel.gov.br/dataset/siga-sistema-de-informacoes-de-geracao-da-aneel
    ano: 2026
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
  - nome: "Natural Earth — países vizinhos (via world-atlas)"
    nome_en: "Natural Earth — neighbouring countries (via world-atlas)"
    url: https://www.naturalearthdata.com/
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "pandas", "PyArrow", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Geração horária do ONS de 2015 a 2024 somada por mês nas usinas a biomassa ligadas ao SIGA pelo CEG; o perfil de cada unidade é a média dos anos válidos, e o mês de maior geração dá a cor do círculo, cinza quando o pico não passa de 1,3 vez a média do ano."

camadas:
  - { nome: usinas, tipo: ponto, cor: "#e2913a", descricao: "51 usinas e conjuntos a biomassa do ONS: mês de pico, força do pico, parcela de cada mês e anos usados", descricao_en: "51 ONS biomass plants and plant groups: peak month, peak strength, share of each month and years used" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 unidades da federação, com o perfil mensal das pequenas térmicas do ONS (2022–2024) e a parcela de bagaço na potência térmica do SIGA", descricao_en: "27 states, with the monthly profile of ONS small thermal plants (2022–2024) and the bagasse share of SIGA thermal capacity" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Geração da cana do Centro-Sul de abril a novembro"
    rotulo_en: "Centre-South cane generation from April to November"
    valor: 87.7
    unidade: "%"
    nota: "37 unidades de cana medidas pelo ONS, média de 2015 a 2024"
    nota_en: "37 cane units measured by ONS, mean of 2015 to 2024"
  - tipo: barras
    rotulo: "Cana do Centro-Sul: parcela de cada mês na geração do ano"
    rotulo_en: "Centre-South cane: each month’s share of the year’s output"
    unidade: "%"
    itens:
      - { rotulo: "jan", rotulo_en: "Jan", valor: 1.9, cor: "#2b5c8a" }
      - { rotulo: "fev", rotulo_en: "Feb", valor: 2.1, cor: "#3d86a8" }
      - { rotulo: "mar", rotulo_en: "Mar", valor: 3.6, cor: "#5ca7a2" }
      - { rotulo: "abr", rotulo_en: "Apr", valor: 7.7, cor: "#86b06e" }
      - { rotulo: "mai", rotulo_en: "May", valor: 11.1, cor: "#bcb64f" }
      - { rotulo: "jun", rotulo_en: "Jun", valor: 12.1, cor: "#e0b23f" }
      - { rotulo: "jul", rotulo_en: "Jul", valor: 12.7, cor: "#e2913a" }
      - { rotulo: "ago", rotulo_en: "Aug", valor: 12.2, cor: "#cf6c34" }
      - { rotulo: "set", rotulo_en: "Sep", valor: 11.9, cor: "#b04a3c" }
      - { rotulo: "out", rotulo_en: "Oct", valor: 10.8, cor: "#8c3d5c" }
      - { rotulo: "nov", rotulo_en: "Nov", valor: 9.1, cor: "#64407a" }
      - { rotulo: "dez", rotulo_en: "Dec", valor: 4.7, cor: "#3f4a85" }
  - tipo: barras
    rotulo: "Pequenas térmicas do Nordeste: parcela de cada mês na geração do ano"
    rotulo_en: "Northeast small thermal plants: each month’s share of the year’s output"
    unidade: "%"
    itens:
      - { rotulo: "jan", rotulo_en: "Jan", valor: 11.0, cor: "#2b5c8a" }
      - { rotulo: "fev", rotulo_en: "Feb", valor: 10.4, cor: "#3d86a8" }
      - { rotulo: "mar", rotulo_en: "Mar", valor: 8.8, cor: "#5ca7a2" }
      - { rotulo: "abr", rotulo_en: "Apr", valor: 6.4, cor: "#86b06e" }
      - { rotulo: "mai", rotulo_en: "May", valor: 5.4, cor: "#bcb64f" }
      - { rotulo: "jun", rotulo_en: "Jun", valor: 4.6, cor: "#e0b23f" }
      - { rotulo: "jul", rotulo_en: "Jul", valor: 4.2, cor: "#e2913a" }
      - { rotulo: "ago", rotulo_en: "Aug", valor: 5.2, cor: "#cf6c34" }
      - { rotulo: "set", rotulo_en: "Sep", valor: 7.3, cor: "#b04a3c" }
      - { rotulo: "out", rotulo_en: "Oct", valor: 11.3, cor: "#8c3d5c" }
      - { rotulo: "nov", rotulo_en: "Nov", valor: 12.8, cor: "#64407a" }
      - { rotulo: "dez", rotulo_en: "Dec", valor: 12.5, cor: "#3f4a85" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/ritmo-biomassa-br-2026/br_biomassa_mes_de_pico.gpkg.zip
    rotulo: "Usinas, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Plants, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,2 MB"
  - formato: csv
    arquivo: dados/br_biomassa_mes_de_pico.csv
    rotulo: "As 51 unidades, com o perfil de cada mês"
    rotulo_en: "All 51 units, with each month’s share"
    tamanho: "15 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/ritmo-biomassa-br-2026/br_biomassa_mes_de_pico_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/ritmo-biomassa-br-2026/br_biomassa_mes_de_pico_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "3,3 MB"
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

# Duas safras, um país: o mês de maior geração das usinas a biomassa no Brasil

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 135, a primeira da coleção **O ritmo da biomassa**. A eletricidade do bagaço tem
calendário: no Centro-Sul ela sobe com a safra de abril a novembro; no Nordeste, com a de setembro a
março.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `usinas` | ponto | 51 usinas e conjuntos: `nome` (SIGA), `nome_ons`, `conjunto`, `uf`, `municipio`, `regiao`, `combustivel` (SIGA), `grupo`, `combustivel_ons`, `modalidade` (de operação no ONS), `ceg_siga`, `posicao`, `anos_validos`, `anos`, `mw_medio`, `pico` (mês de 1 a 12), `forca` (geração do mês de pico ÷ média dos meses), `seca` (% do ano de maio a novembro), `classe`, `p01` a `p12` (% do ano em cada mês) |
| `ufs` | polígono | 27 unidades da federação: `pqu_mw_medio`, `pqu_pico`, `pqu_forca`, `pqu_seca` e `pqu_p01` a `pqu_p12`, das pequenas térmicas do ONS (2022–2024); `siga_termicas_mw`, `siga_bagaco_pct`, `siga_ate30_mw` e `siga_ate30_bagaco_pct`, da potência térmica em operação no SIGA; `classe` |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `ritmo-biomassa-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/ritmo-biomassa-br-2026).
As camadas `usinas` e `ufs` trazem o **estilo do QGIS** da prancha. O **CSV** fica nesta pasta, em
UTF-8, com a tabela das usinas sem geometria.

## Método

1. Geração por usina em base horária do ONS (dados abertos), de 2015 a 2024, somada por usina e mês.
   Ficam de fora 2025, em que quase todas as usinas a biomassa do tipo II-B aparecem com geração zero
   o mês inteiro e os conjuntos de usinas caem de 15 para 2 em outubro (é a forma como o ONS publicou,
   não a safra), e outubro de 2021, mês que falta inteiro nos arquivos.
2. Entram as usinas de combustível «Biomassa» com CEG e as de «Resíduos Industriais» cujo CEG é de
   usina a biomassa no SIGA (as seis fábricas de celulose). Ficam de fora as siderúrgicas (CSP, CST,
   Do Atlântico e Sol) e os agregados de pequenas usinas das SEs Londrina e Maringá e da CELESC.
3. Ligação com o SIGA da ANEEL (01/10/2026) pelo núcleo do CEG: 62 dos 69 CEGs «Biomassa» do ONS
   estão entre as usinas a biomassa do SIGA e respondem por 97,8% da energia. Os 7 restantes ficam
   de fora (no ONS: Cidade Nova, Mauá Blocos 1 e 5A, PIE-RP, Predilecta, Rondon II, Sykué I e São
   Fernando Açúcar e Álcool).
4. Os conjuntos de usinas do ONS não têm CEG: cada um vai para o centro do município da usina do SIGA
   de mesmo nome, com o combustível dela (coluna `posicao`). Três sem par no SIGA ficam de fora:
   Biopav, Dourados e Votuporanga 2.
5. Um ano conta para a unidade se tem registro em todos os meses, geração em pelo menos seis deles e
   alguma variação: 31 anos-usina com geração quase constante (diferença entre o maior e o menor mês
   abaixo de 3% da média) foram descartados.
6. O perfil de cada unidade é a média, mês a mês, dos MW médios dos anos válidos. Entram no mapa as
   unidades com pelo menos dois anos válidos e 1 MW médio. A cor é o mês de maior geração; quando
   esse mês não passa de 1,3 vez a média dos meses, a unidade fica cinza, sem estação marcada.
7. Os estados levam as séries «PQU … TERM – CARGA GLOBAL» do ONS, que somam as pequenas térmicas de
   cada estado sem informar o combustível, de 2022 a 2024 (a série começa em 2021). Para ler essas
   séries, a tabela traz do SIGA quanto da potência térmica em operação do estado é de bagaço, no
   total e só nas usinas de até 30 MW.
8. As rosas do painel somam os perfis: as 37 unidades de cana, que estão todas no Centro-Sul, e as
   pequenas térmicas dos estados do Centro-Sul e do Nordeste.

## Limitações

- O ONS mede uma a uma só parte das usinas a biomassa e conta a menos as pequenas, que não despacha:
  as 37 usinas com potência no SIGA da prancha 136 têm 16% da potência a biomassa em operação no
  país. As outras ficam fora dos dados ou entram, quando entram, nas séries somadas por estado.
- Nenhuma usina de cana do Nordeste tem série usável no ONS (a única ligada ao SIGA só tem zeros). A
  leitura do Nordeste depende das séries por estado, de combustível não informado; o SIGA sustenta a
  leitura (em Alagoas, 91% da potência térmica de até 30 MW é de bagaço), mas não a prova.
- 23 das 51 unidades têm só dois ou três anos válidos (coluna `anos_validos`).
- A energia que a usina consome na própria indústria pode não aparecer nos dados do ONS.

## Licença dos dados

Dados abertos do ONS, da ANEEL e do IBGE, de uso livre com citação da fonte.
