---
numero: 133
titulo: "O milho entra na destilaria"
subtitulo: "Em oito anos, um quarto do etanol passou a sair do grão"
data: 2026-12-09
rascunho: true
categoria: energia
colecao: etanol-br
tags: [etanol-br, brasil, etanol, etanol-de-milho, milho, destilarias, mato-grosso, anp]

contexto: >-
  Em 2018, o milho fazia cerca de 2,5% do etanol brasileiro; nos doze meses até agosto de 2026, fez 26%. As destilarias processaram 24,4 milhões de toneladas do grão, quase treze vezes o de 2018, e como uma tonelada de milho rende cerca de 5,7 vezes o etanol de uma tonelada de cana, o milho, com só 6,7% das toneladas processadas, já responde por um quarto do combustível. A mudança tem endereço: em Mato Grosso, 83% do etanol já sai do milho, e no Maranhão, 82%; Mato Grosso do Sul e Bahia passam de um terço, Goiás chega a 16%, e São Paulo, o maior produtor, segue na cana. A ANP não publica a matéria-prima por destilaria; a parte de cada UF é estimada pelo rendimento observado nos meses em que uma UF só processou milho. Segunda prancha da coleção «A nova geografia do etanol».

imagem: ./mapa_preview.png
imagem_alt: "Três mapas do Brasil em projeção cônica de Albers, na mesma escala, com as UFs coloridas pela parte estimada do etanol feita de milho: 2018, 2022 e os doze meses de 09/2025 a 08/2026, em cinco classes de bege a marrom-escuro, cinza para as UFs que fazem etanol sem milho e branco para as que não fazem etanol. Em 2018, só Mato Grosso (33%) e Goiás (5%) aparecem tingidos de verdade, com um tom claro em São Paulo e no Paraná; em 2022, Mato Grosso escurece e Mato Grosso do Sul entra; no último período, Mato Grosso e Maranhão ficam no tom mais escuro, Mato Grosso do Sul e Bahia no do meio, Goiás e Pará no claro. No terceiro mapa, círculos marcam a capacidade das destilarias por município nessas UFs, cheios onde não havia destilaria em 2018. No quarto quadro, uma linha mostra a parte do milho no etanol do país subindo de 2,5% em 2018 a 26,3%; no painel, a tabela das oito UFs que processam milho."

recorte: "Brasil"
fontes:
  - nome: "ANP — Painel Dinâmico de Produtores de Etanol: matéria-prima processada e produção por estado e mês, capacidade autorizada por usina (pb-da-etanol.zip)"
    nome_en: "ANP — Ethanol Producers Dynamic Panel: feedstock processed and output by state and month, authorised capacity by plant (pb-da-etanol.zip)"
    url: https://www.gov.br/anp/pt-br/assuntos/producao-e-fornecimento-de-biocombustiveis/etanol/arquivos-etanol/pb-da-etanol.zip
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
software: ["Python", "pandas", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Toneladas de milho processadas em cada UF (ANP) convertidas em etanol pelo rendimento mediano dos meses-UF em que o milho foi a única matéria-prima (0,43 m³/t), limitadas à produção da UF e divididas por ela, em 2018, 2022 e 09/2025–08/2026."

camadas:
  - { nome: ufs, tipo: poligono, cor: "#c08a2e", descricao: "27 UFs: milho processado, etanol produzido e parte estimada do milho em 2018, 2022 e 09/2025–08/2026, com um estilo do QGIS para cada período", descricao_en: "27 states: maize processed, ethanol produced and estimated maize share in 2018, 2022 and 09/2025–08/2026, with a QGIS style for each period" }
  - { nome: destilarias, tipo: ponto, cor: "#1a1c1e", descricao: "231 municípios com destilaria nas UFs que processam milho: capacidade em 08/2026 e em 12/2018", descricao_en: "231 municipalities with a distillery in the maize-processing states: capacity in 08/2026 and 12/2018" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Etanol feito de milho, 09/2025–08/2026 (estimativa)"
    rotulo_en: "Ethanol made from maize, 09/2025–08/2026 (estimate)"
    valor: 26.3
    unidade: "% do etanol do país"
    nota: "2,5% em 2018; 10,5 milhões de m³ em 39,9 milhões"
    nota_en: "2.5% in 2018; 10.5 million m³ out of 39.9 million"
  - tipo: numero
    rotulo: "Milho processado nas destilarias, 09/2025–08/2026"
    rotulo_en: "Maize processed by distilleries, 09/2025–08/2026"
    valor: 24.4
    unidade: "milhões de t"
    nota: "1,9 milhão de t em 2018; 6,7% das toneladas de matéria-prima"
    nota_en: "1.9 million t in 2018; 6.7% of feedstock tonnes"
  - tipo: barras
    rotulo: "Parte do etanol feita de milho por UF, 09/2025–08/2026 (estimativa)"
    rotulo_en: "Share of ethanol made from maize by state, 09/2025–08/2026 (estimate)"
    unidade: "%"
    itens:
      - { rotulo: "Mato Grosso", valor: 82.8, cor: "#4f3210" }
      - { rotulo: "Maranhão", valor: 82.4, cor: "#4f3210" }
      - { rotulo: "Mato Grosso do Sul", valor: 38.4, cor: "#c08a2e" }
      - { rotulo: "Bahia", valor: 35.7, cor: "#c08a2e" }
      - { rotulo: "Goiás", valor: 15.9, cor: "#e2bf5a" }
      - { rotulo: "Pará", valor: 10.8, cor: "#e2bf5a" }
      - { rotulo: "Paraná", valor: 1.0, cor: "#f1e3ad" }
      - { rotulo: "São Paulo", valor: 0.1, cor: "#f1e3ad" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/etanol-br-2026/br_etanol_milho.gpkg.zip
    rotulo: "UFs, destilarias por município e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "States, distilleries by municipality and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,2 MB"
  - formato: csv
    arquivo: dados/br_etanol_milho.csv
    rotulo: "As 27 UFs, com milho, etanol e parte do milho nos três períodos"
    rotulo_en: "All 27 states, with maize, ethanol and maize share in the three periods"
    tamanho: "2 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/etanol-br-2026/br_etanol_milho_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/etanol-br-2026/br_etanol_milho_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "8,9 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,2 MB"

doi_automatico: false
versao: "1.0.0"
discussoes: []
---

# O milho entra na destilaria: a parte do milho no etanol de cada UF, 2018 a 2026

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 133, a segunda da coleção **A nova geografia do etanol**. Depois de onde está a
capacidade, de que ela é feita: o milho que entrou nas destilarias do Centro-Oeste e do Matopiba.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `ufs` | polígono | 27 UFs: `SIGLA_UF`, `regiao` e, para `2018`, `2022` e `12m` (09/2025–08/2026), `milho_t_*`, `etanol_m3_*`, `pct_milho_t_*`, `pct_milho_etanol_*` (estimativa) e `classe_*` (−1 sem milho, −2 sem etanol) |
| `destilarias` | ponto | 231 municípios nas UFs que processam milho: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `cap_2026`, `usinas_2026`, `cap_2018` (m³/dia), `estreante` (sem capacidade em 12/2018), `lon`, `lat` |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `etanol-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/etanol-br-2026).
A camada `ufs` traz três **estilos do QGIS**, um por período (o padrão é o dos últimos doze
meses), e a `destilarias`, o dos círculos cheios e vazados. O **CSV** fica nesta pasta, em UTF-8,
com a tabela das UFs sem geometria.

## Método

1. Painel Dinâmico de Produtores de Etanol da ANP (`pb-da-etanol.zip`, baixado em 18/10/2026):
   `Etanol_MatériaPrima.csv`, toneladas processadas por UF, mês e matéria-prima (cana-de-açúcar,
   melaço, milho, bagaço ou palha de cana e outras), e `Etanol_Produção.csv`, etanol anidro e
   hidratado produzido por UF e mês, em m³. Os dois arquivos vão de 01/2018 a 08/2026 na conta.
   Em 2017, o arquivo de matéria-prima registra 640 milhões de t de cana, quase o dobro de
   qualquer ano seguinte, para menos etanol; esse ano ficou de fora.
2. Rendimento: nos meses-UF em que o milho foi a única matéria-prima processada e houve produção,
   m³ de etanol por tonelada de milho. Mediana de 0,43 m³/t (quartis 0,408 e 0,453; 29 meses-UF,
   na Bahia, em Goiás, no Maranhão, em Mato Grosso e no Paraná). Pelo mesmo critério, a cana dá
   0,075 m³/t (quartis 0,064 e 0,086; 464 meses-UF): o milho rende cerca de 5,7 vezes mais por
   tonelada.
3. Etanol de milho de cada UF e período: toneladas de milho × 0,43, limitado à produção da UF. A
   parte do milho é esse volume dividido pela produção. Os mapas usam 2018, 2022 e os doze meses
   de 09/2025 a 08/2026; a linha do quarto quadro, cada ano de 2018 a 2025 e esses doze meses.
4. Classes: até 5%, 5 a 20%, 20 a 50%, 50 a 80% e 80% ou mais. Cinza: a UF fez etanol sem milho;
   branco: não fez etanol no período.
5. Destilarias do terceiro mapa: capacidade autorizada (a maior entre anidro e hidratado) somada
   por município em 08/2026, nas oito UFs que processaram milho nos últimos doze meses — 274
   destilarias em 231 municípios, 239,3 mil m³/dia. O círculo é cheio onde o município não tinha
   capacidade em 12/2018 (18 municípios, 23,1 mil m³/dia). Uma destilaria registrada em Bauru (SP)
   com capacidade zero fica de fora. Cada município é desenhado num ponto interno do seu polígono.

## Leitura

- Em 2018, só Mato Grosso tinha uma parte relevante (33%); Goiás vinha atrás, com 5%. Em 2022,
  Mato Grosso já fazia 75% do seu etanol com milho e Mato Grosso do Sul, 15%.
- Nos doze meses até 08/2026, o milho foi 53% das toneladas processadas em Mato Grosso e no
  Maranhão; como rende mais, virou 82–83% do etanol desses estados.
- São Paulo processou 23 mil t de milho no período, 0,02% das suas toneladas.

## Limitações

- É uma estimativa. A ANP publica a matéria-prima e a produção por UF e mês, não por destilaria; a
  conta supõe que o rendimento dos meses só de milho vale para as UFs e os meses em que o milho
  divide a destilação com a cana.
- O mapa das destilarias não diz qual delas usa milho: mostra a capacidade nas UFs que processam
  milho e onde ela é nova. Usinas flex, que moem cana na safra e milho na entressafra, aparecem
  como qualquer outra.
- O teto na produção da UF corta excessos da estimativa; nos estados em que o milho é quase tudo,
  a parte real pode estar um pouco acima ou abaixo.
- Capacidade autorizada não é produção.

## Licença dos dados

Dados abertos da ANP e do IBGE, de uso livre com citação da fonte.
