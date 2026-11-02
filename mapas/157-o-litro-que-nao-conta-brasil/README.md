---
numero: 157
titulo: "O litro que não conta"
subtitulo: "No biodiesel, menos da metade do volume certificado rende crédito de carbono"
data: 2027-02-08
rascunho: true
categoria: energia
colecao: renovabio-br
tags: [renovabio-br, brasil, renovabio, cbio, volume-elegivel, etanol, biodiesel, anp]

contexto: >-
  Uma usina certificada no RenovaBio não recebe CBIO por todo litro que vende: só pela parte feita com biomassa elegível, que cumpre as regras do programa. Aplicada à capacidade autorizada pela ANP, essa fração dá 81,5% elegível nas 327 usinas de etanol e biodiesel com capacidade conhecida: 234 de 287 mil m³ por dia. No etanol de cana, 89,2%; no de milho, 73,6%; no biodiesel, só 44,6%, e 29 das 45 usinas ficam abaixo da metade. Por isso o mapa se divide: São Paulo, quase só cana, tem 93% elegível; Mato Grosso, com milho e biodiesel, 72%; Rio Grande do Sul, quase só biodiesel, 40%. Entre usinas de biodiesel com frações parecidas, a nota pesa: as de nota acima de 70 emitem 0,42 CBIO por m³ vendido, as de nota abaixo de 50, 0,24. Segunda prancha da coleção «A nota de cada usina».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers com as UFs coloridas pelo volume elegível ponderado pela capacidade, em cinco classes de abaixo de 60% (terracota) a 92% ou mais (verde), e cada usina certificada de etanol e biodiesel desenhada na sede do município como um anel proporcional à capacidade autorizada com um disco interno proporcional à parte elegível, colorido pela rota; losangos marcam as usinas de biometano, sem capacidade. São Paulo é a única UF na classe mais alta; Rio Grande do Sul, Santa Catarina, Tocantins, Piauí, Rio Grande do Norte e Sergipe ficam na mais baixa. Uma chamada aponta São Paulo, com 93%, e outra o Rio Grande do Sul, com 40%. No painel, barras de capacidade e parte elegível por rota, com 89% na cana e 45% no biodiesel, e barras do percentual elegível nas 14 UFs com mais capacidade."

recorte: "Brasil"
fontes:
  - nome: "ANP — Certificados da Produção ou Importação Eficiente de Biocombustíveis, planilha de certificados aprovados (certificados-aprovados-producao.xlsx, atualizada em 27/10/2026, acesso em 01/11/2026)"
    nome_en: "ANP — Efficient Biofuel Production or Import Certificates, spreadsheet of approved certificates (certificados-aprovados-producao.xlsx, updated 27/10/2026, accessed 01/11/2026)"
    url: https://www.gov.br/anp/pt-br/assuntos/renovabio/certificados-producao-importacao-eficiente-biocombustiveis
    ano: 2026
  - nome: "ANP — Painéis Dinâmicos de Produtores de Etanol e de Biodiesel, dados abertos: município e capacidade autorizada por CNPJ (acesso em 01/11/2026)"
    nome_en: "ANP — Ethanol and Biodiesel Producers Dynamic Panels, open data: municipality and authorised capacity by CNPJ (accessed 01/11/2026)"
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
metodo: "Volume elegível (%) do certificado válido de cada usina em 27/10/2026 multiplicado pela capacidade autorizada da usina no último mês dos painéis da ANP (etanol: a maior entre anidro e hidratado); percentual da UF e da rota = capacidade elegível ÷ capacidade autorizada."

camadas:
  - { nome: usinas, tipo: ponto, cor: "#6f8f3a", descricao: "327 usinas de etanol e biodiesel com capacidade: nota, volume elegível, capacidade autorizada, capacidade elegível e fora (m³/dia), CBIO por m³, município", descricao_en: "327 ethanol and biodiesel plants with capacity data: score, eligible volume, authorised capacity, eligible and non-eligible capacity (m³/day), CBIO per m³, municipality" }
  - { nome: biometano, tipo: ponto, cor: "#8c3f2b", descricao: "10 usinas de biometano certificadas, sem capacidade nos painéis da ANP", descricao_en: "10 certified biomethane plants, with no capacity in the ANP panels" }
  - { nome: ufs, tipo: poligono, cor: "#a9c29a", descricao: "27 UFs: usinas, capacidade autorizada e elegível (m³/dia) e volume elegível ponderado (%)", descricao_en: "27 states: plants, authorised and eligible capacity (m³/day) and weighted eligible volume (%)" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Capacidade certificada elegível, etanol e biodiesel"
    rotulo_en: "Eligible certified capacity, ethanol and biodiesel"
    valor: 81.5
    unidade: "%"
    nota: "234 de 287 mil m³/dia, em 327 usinas"
    nota_en: "234 of 287 thousand m³/day, across 327 plants"
  - tipo: numero
    rotulo: "Capacidade elegível no biodiesel"
    rotulo_en: "Eligible capacity in biodiesel"
    valor: 44.6
    unidade: "%"
    nota: "29 das 45 usinas abaixo de 50%; etanol, 86,9%"
    nota_en: "29 of 45 plants below 50%; ethanol, 86.9%"
  - tipo: barras
    rotulo: "Volume elegível ponderado pela capacidade, por rota"
    rotulo_en: "Capacity-weighted eligible volume, by route"
    unidade: "%"
    itens:
      - { rotulo: "Etanol de cana (265)", valor: 89.2, cor: "#6f8f3a" }
      - { rotulo: "Etanol de milho (11)", valor: 73.6, cor: "#c9a227" }
      - { rotulo: "Etanol de cana e milho (6)", valor: 73.6, cor: "#9a7b2e" }
      - { rotulo: "Biodiesel (45)", valor: 44.6, cor: "#4f7590" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/renovabio-br-2026/br_renovabio_volume_elegivel.gpkg.zip
    rotulo: "Usinas, biometano, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Plants, biomethane, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,2 MB"
  - formato: csv
    arquivo: dados/br_renovabio_volume_elegivel.csv
    rotulo: "As 327 usinas com capacidade, volume elegível e capacidade elegível"
    rotulo_en: "The 327 plants with capacity, eligible volume and eligible capacity"
    tamanho: "96 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/renovabio-br-2026/br_renovabio_volume_elegivel_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/renovabio-br-2026/br_renovabio_volume_elegivel_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "3,5 MB"
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

# O litro que não conta: volume elegível das usinas certificadas no RenovaBio, por rota e por UF

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 157, a segunda da coleção **A nota de cada usina**. A nota (Nº 156) diz quanto carbono
cada litro evita; o volume elegível diz quantos litros contam. O CBIO que a usina pode emitir é o
volume vendido × a fração elegível × o fator do certificado, que vem da nota.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `usinas` | ponto | 327 usinas de etanol e biodiesel: os campos da Nº 156 e mais `cap_elegivel_m3d` e `cap_fora_m3d` (capacidade × fração elegível e o resto, m³/dia) |
| `biometano` | ponto | 10 usinas de biometano, sem capacidade |
| `ufs` | polígono | 27 UFs: `usinas`, `cap_m3d`, `cap_elegivel_m3d`, `eleg_ponderado_pct` |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `renovabio-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/renovabio-br-2026),
com os **estilos do QGIS** gravados (UFs pelo percentual elegível; anel da capacidade e disco da parte
elegível). O **CSV** fica nesta pasta, em UTF-8, com a tabela das usinas sem geometria.

## Método

1. Volume elegível (%) do certificado válido de cada usina, na planilha da ANP de 27/10/2026: a parte da
   produção feita com biomassa que cumpre os critérios de elegibilidade do RenovaBio, comprovados
   fornecedor a fornecedor. O restante é vendido normalmente, mas não gera CBIO.
2. Capacidade autorizada (m³/dia) pelo CNPJ, no último mês da usina nos painéis da ANP (etanol: 08/2026,
   a maior entre anidro e hidratado, como na coleção do etanol; biodiesel: 09/2026). Uma usina só aparece
   num mês anterior e entra com a última capacidade publicada.
3. Capacidade elegível = capacidade × volume elegível. O percentual de uma UF ou rota é a soma da
   capacidade elegível dividida pela soma da capacidade: uma média ponderada pelo tamanho das usinas.
4. Ficam fora da conta as 10 usinas de biometano e uma de etanol que não estão nos painéis (sem
   capacidade); as de biometano aparecem como losangos, sem tamanho.
5. CBIO por m³ = fator de emissão do certificado (tCO₂eq por litro) × 1.000 × volume elegível.

## Leitura

- 81,5% da capacidade certificada é elegível: 234,2 de 287,4 mil m³/dia. No etanol, 86,9% (217,8 de
  250,6 mil); no biodiesel, 44,6% (16,4 de 36,9 mil).
- Por rota: etanol de cana 89,2% (mediana por usina 93,0%), etanol de milho 73,6%, cana e milho 73,6%,
  biodiesel 44,6% (mediana 39,7%). 29 das 45 usinas de biodiesel e 8 das 265 de cana ficam abaixo de 50%.
- Por UF, entre as de mais capacidade: São Paulo 93,0%, Minas Gerais 88,4%, Paraná 85,1%, Mato Grosso do
  Sul 79,9%, Goiás 78,8%, Mato Grosso 72,4%, Bahia 62,1%, Rio Grande do Sul 39,7%, Santa Catarina 29,8%.
- As 21 usinas de biodiesel de nota acima de 70 e as 21 de nota abaixo de 50 têm frações elegíveis
  medianas quase iguais (39,7% e 39,2%), mas emitem 0,42 e 0,24 CBIO por m³ vendido (medianas).

## Limitações

- Capacidade autorizada não é produção: o percentual mostra como seria se todas as usinas trabalhassem
  na mesma proporção da capacidade. A ANP não publica produção por usina.
- A fração elegível é a do certificado em vigor; a usina pode atualizá-la entre certificações.
- A planilha não diz por que o volume não é elegível (fornecedor sem cadastro, área desmatada, compra
  sem rastreio); a prancha não separa os motivos.
- Não há dados abertos de CBIO emitido por usina (só no painel em Power BI da ANP); a conta de CBIO por
  m³ é a que o certificado permite, não a efetivamente emitida.

## Licença dos dados

Dados abertos da ANP e do IBGE, de uso livre com citação da fonte.
