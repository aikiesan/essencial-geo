---
numero: 89
titulo: "O CO₂ das dornas"
subtitulo: "Toda usina de etanol solta um gás quase puro, que hoje vai para o ar"
data: 2026-10-20
categoria: energia
colecao: carbono-sp
tags: [carbono-sp, sao-paulo, etanol, fermentacao, co2-biogenico, captura-de-carbono, usinas, anp]

contexto: >-
  Na dorna, a levedura transforma o açúcar da cana em etanol e solta CO₂ na mesma conta: 0,955 kg de gás por kg de álcool, cerca de 0,75 t por m³. É CO₂ quase puro, de origem biológica, e hoje vai para o ar. Na safra 2025/26, as usinas paulistas fizeram 12,1 bilhões de litros de etanol; pela estequiometria, saíram das dornas cerca de 8,9 milhões de toneladas de CO₂, de 145 usinas em 119 municípios. Guaíra, com três usinas, lidera, com cerca de 271 mil t; Pitangueiras, Sertãozinho e Buritizal passam de 190 mil. O gás segue a moagem: 1,4 milhão de t em agosto e quase nada de dezembro a março. Como a ANP publica a produção só por estado, a de cada usina é estimada pela capacidade autorizada; tudo aqui é estimativa. Primeira prancha da coleção «Carbono biogênico».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com círculos cor de tijolo, proporcionais ao CO₂ de fermentação estimado em cada município na safra 2025/26, sobre os municípios com usina levemente tingidos. Os círculos se adensam no norte e no centro do estado, em volta de Ribeirão Preto, e rareiam a leste e no sul. Uma chamada aponta Guaíra, com 271 mil t em três usinas, o maior ponto do estado; outra aponta Piracicaba, com 115 mil t, a 10 km de um gasoduto. No painel, barras mensais mostram o CO₂ concentrado de maio a outubro e quase nulo de dezembro a março, e outras barras listam os seis maiores municípios."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "ANP — Painel Dinâmico de Produtores de Etanol: capacidade autorizada por usina e produção por estado e mês (pb-da-etanol.zip)"
    nome_en: "ANP — Ethanol Producers Dynamic Panel: authorised capacity by mill and output by state and month (pb-da-etanol.zip)"
    url: https://www.gov.br/anp/pt-br/assuntos/producao-e-fornecimento-de-biocombustiveis/etanol/arquivos-etanol/pb-da-etanol.zip
    ano: 2026
  - nome: "ANP — Resolução nº 907/2022, Tabela 1 (massa específica e teor alcoólico do etanol anidro e do hidratado)"
    nome_en: "ANP — Resolution No. 907/2022, Table 1 (density and alcohol content of anhydrous and hydrous ethanol)"
    ano: 2022
  - nome: "Kheshgi, H. S. e Prince, R. C. (2005). Sequestration of fermentation CO₂ from ethanol production. Energy, 30, 1865–1871"
    nome_en: "Kheshgi, H. S. and Prince, R. C. (2005). Sequestration of fermentation CO₂ from ethanol production. Energy, 30, 1865–1871"
    ano: 2005
  - nome: "EPE — WebMap: gasodutos existentes, na versão da base de infraestrutura do MapBiomas (distância ao gasoduto)"
    nome_en: "EPE — WebMap: existing gas pipelines, as published in the MapBiomas infrastructure database (distance to pipeline)"
    url: https://gisepeprd2.epe.gov.br/WebMapEPE/
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Produção de etanol anidro e hidratado de SP na safra 2025/26 (ANP, por mês) rateada entre as usinas pela capacidade autorizada em cada mês, convertida em massa pela densidade da especificação da ANP e em CO₂ pela estequiometria da fermentação alcoólica (0,955 kg de CO₂ por kg de etanol); somada por município."

camadas:
  - { nome: usinas_etanol, tipo: ponto, cor: "#7a3b2c", descricao: "145 usinas de SP com capacidade autorizada na safra: etanol e CO₂ estimados, no ponto interno do município", descricao_en: "145 SP mills with authorised capacity in the harvest: estimated ethanol and CO₂, at the municipality’s interior point" }
  - { nome: municipios, tipo: poligono, cor: "#7a3b2c", descricao: "645 municípios: CO₂ de fermentação (safra 2025/26 e 2024), do biogás, fóssil e e-metano possível", descricao_en: "645 municipalities: fermentation CO₂ (2025/26 harvest and 2024), biogas, fossil and possible e-methane" }

indicadores:
  - tipo: numero
    rotulo: "CO₂ de fermentação na safra 2025/26"
    rotulo_en: "Fermentation CO₂ in the 2025/26 harvest"
    valor: 8.9
    unidade: "milhões de t"
    unidade_en: "million t"
  - tipo: barras
    rotulo: "Maiores municípios"
    rotulo_en: "Largest municipalities"
    unidade: "t de CO₂ por safra"
    unidade_en: "t of CO₂ a harvest"
    itens:
      - { rotulo: "Guaíra", valor: 271110, cor: "#7a3b2c" }
      - { rotulo: "Pitangueiras", valor: 200298, cor: "#7a3b2c" }
      - { rotulo: "Sertãozinho", valor: 198274, cor: "#7a3b2c" }
      - { rotulo: "Buritizal", valor: 194228, cor: "#7a3b2c" }
      - { rotulo: "Pontal", valor: 192609, cor: "#7a3b2c" }
      - { rotulo: "Barra Bonita", valor: 178042, cor: "#7a3b2c" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/carbono-sp-2026/sp_carbono_biogenico.gpkg.zip
    rotulo: "Usinas, municípios, regiões e gasodutos (mesmo arquivo das pranchas 089 a 092), SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Mills, municipalities, regions and pipelines (same file as plates 089 to 092), SIRGAS 2000, with QGIS styles"
    tamanho: "4,7 MB"
  - formato: csv
    arquivo: dados/sp_co2_fermentacao_usinas.csv
    rotulo: "Tabela das usinas"
    rotulo_en: "Mill table"
    tamanho: "17 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/carbono-sp-2026/sp_co2_dornas_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/carbono-sp-2026/sp_co2_dornas_prancha.en.svg
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

# O CO₂ das dornas de etanol em São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 089, a primeira de quatro da coleção **Carbono biogênico**: quanto CO₂ a fermentação
do etanol solta em cada município paulista, numa safra.

## O que vem nos arquivos

- `dados/sp_co2_fermentacao_usinas.csv`: uma linha por usina, com CNPJ, razão social, município,
  capacidade autorizada de anidro e de hidratado (m³/dia), meses com capacidade na safra, parte
  do rateio (%), etanol estimado (m³), CO₂ estimado (t) e distância do município ao gasoduto
  mais próximo (km).
- `sp_carbono_biogenico.gpkg.zip` (na release `carbono-sp-2026`): o mesmo GPKG das pranchas 089
  a 092. Esta prancha usa a camada `usinas_etanol` (estilo `co2`) e, na camada `municipios`, os
  campos `usinas_etanol`, `etanol_m3_safra`, `co2_fermentacao_t` e `co2_fermentacao_2024_t`.

## Método

1. Produção: a ANP publica a produção de etanol anidro e hidratado por estado e mês. Somamos a
   de SP de abril de 2025 a março de 2026 (safra 2025/26): 5.141.755 m³ de anidro e 6.952.582 m³
   de hidratado. Para a prancha 091, usamos também o ano de 2024: 13.729.549 m³.
2. Rateio: a mesma base traz, mês a mês, a capacidade autorizada de cada usina. O peso de uma
   usina é a soma, nos meses da safra, da maior das duas capacidades (anidro ou hidratado); a
   produção do estado é dividida por esse peso.
3. Massa: anidro a 785,96 kg de etanol por m³ (791,5 kg/m³, o limite de massa específica a 20 °C, vezes 99,3 % m/m, o teor mínimo);
   hidratado a 756,07 kg de etanol por m³ (massa específica de 805,2 a 811,2 kg/m³ com 92,5 a
   94,6 % m/m de etanol, pelos valores médios). Fonte: Resolução ANP nº 907/2022, Tabela 1.
4. CO₂: na fermentação alcoólica, C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂. Com as massas molares da IUPAC
   (CO₂ 44,009 g/mol, etanol 46,068 g/mol), saem 0,9553 kg de CO₂ por kg de etanol, como em
   Kheshgi e Prince (2005). Isso dá 0,751 t de CO₂ por m³ de anidro e 0,722 t por m³ de hidratado.
5. Distância: do ponto interno do município ao gasoduto de transporte ou de distribuição mais
   próximo (EPE, via MapBiomas, a mesma base da prancha 057).

Uma correção sobre o coeficiente: o valor de "cerca de 0,76" que costuma circular é por **litro**
de etanol, não por kg. Por massa, a estequiometria dá 0,955 kg de CO₂ por kg de etanol; por
volume, 0,955 × 0,79 kg/L ≈ 0,75 kg de CO₂ por litro.

## Dados baixados

- ANP, `pb-da-etanol.zip`, ligado à página do Painel Dinâmico de Produtores de Etanol:
  <https://www.gov.br/anp/pt-br/assuntos/producao-e-fornecimento-de-biocombustiveis/etanol/arquivos-etanol/pb-da-etanol.zip>,
  baixado em 18/10/2026 (arquivos `Etanol_Capacidade 2021_2026.csv`, `Etanol_Produção.csv` e
  `Etanol_MatériaPrima.csv`).

## Limitações

- É uma estimativa. A produção real de cada usina não é pública; o rateio pela capacidade
  autorizada supõe que todas usam a mesma fração da sua capacidade ao longo da safra.
- O ponto de cada usina é o ponto interno do município, não a planta. Municípios com várias
  usinas somam todas no mesmo ponto.
- A conta considera o CO₂ da fermentação só; o da queima do bagaço nas caldeiras, também
  biogênico, não entra.
- O CO₂ sai só durante a moagem, concentrado de maio a outubro: qualquer uso ou captura
  precisaria de armazenamento ou de operação sazonal.
- Na safra 2025/26, a matéria-prima foi quase toda cana (131 milhões de t) e melaço (7,4 milhões
  de t); o etanol de milho em SP é residual (24 mil t de milho).
