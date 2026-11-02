---
numero: 156
titulo: "A nota de cada usina"
subtitulo: "O biometano e metade do biodiesel tiram perto de 80; o etanol de cana fica em 61"
data: 2027-02-05
rascunho: true
categoria: energia
colecao: renovabio-br
tags: [renovabio-br, brasil, renovabio, cbio, etanol, biodiesel, biometano, usinas, anp]

contexto: >-
  No RenovaBio, cada usina recebe da ANP uma nota: quantos gramas de CO₂ equivalente o seu biocombustível emite a menos que o fóssil que substitui, por megajoule. Em 27/10/2026, 338 usinas no Brasil tinham certificado válido, em 285 municípios de 22 UFs. O etanol de cana, com 266 usinas, tem nota mediana de 61,3; o biometano, com 10, de 78,0. O biodiesel se parte em dois grupos do mesmo tamanho: 21 usinas abaixo de 50, com mediana 45, e 21 acima de 70, com mediana 80. No etanol, Mato Grosso do Sul, Goiás e São Paulo têm medianas perto de 62; Paraíba e Alagoas, perto de 54. A maior nota do etanol, 70,9, é de uma usina de cana e milho em Quirinópolis (GO). Primeira prancha da coleção «A nota de cada usina».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers com as 338 usinas certificadas no RenovaBio na sede do seu município: a cor dá a nota em seis classes, do vermelho-tijolo (abaixo de 45) ao verde-escuro (75 ou mais), e a forma dá a rota: círculo para etanol de cana, quadrado para etanol de milho, triângulo para biodiesel e losango para biometano. Os círculos se adensam em São Paulo, Goiás, Minas Gerais, Mato Grosso do Sul e no litoral do Nordeste; triângulos verde-escuros e cor de areia se misturam em Mato Grosso e no Rio Grande do Sul. Uma chamada aponta Quirinópolis (GO), com a maior nota do etanol, 70,9, e outra Alagoas, com a mediana de 54,1. No painel, uma faixa de pontos com a nota de cada usina por rota, em que o biodiesel aparece em dois grupos, perto de 45 e de 80, e barras da nota mediana do etanol por UF."

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
metodo: "Nota de Eficiência Energético-Ambiental (gCO₂eq/MJ) de cada certificado válido do RenovaBio em 27/10/2026, do combustível principal (etanol hidratado, biodiesel ou biometano); usina localizada pelo CNPJ nos painéis de produtores da ANP ou pelo endereço do certificado, e desenhada na sede do município."

camadas:
  - { nome: usinas, tipo: ponto, cor: "#24472a", descricao: "338 usinas com certificado válido: CNPJ, nome, rota, nota (hidratado e anidro), volume elegível, fator de emissão de CBIO, datas, firma inspetora, município, capacidade e classe da nota", descricao_en: "338 plants with a valid certificate: CNPJ, name, route, score (hydrous and anhydrous), eligible volume, CBIO emission factor, dates, inspection firm, municipality, capacity and score class" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 UFs: usinas certificadas e nota mediana, total e do etanol", descricao_en: "27 states: certified plants and median score, overall and for ethanol" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Usinas com certificado do RenovaBio válido, 27/10/2026"
    rotulo_en: "Plants with a valid RenovaBio certificate, 27/10/2026"
    valor: 338
    unidade: "usinas"
    nota: "em 285 municípios de 22 UFs; mais 1 importador (etanol de milho dos EUA)"
    nota_en: "in 285 municipalities across 22 states; plus 1 importer (US corn ethanol)"
  - tipo: numero
    rotulo: "Nota mediana do etanol de cana"
    rotulo_en: "Median score of cane ethanol"
    valor: 61.3
    unidade: "gCO₂eq/MJ"
    nota: "266 usinas; biometano 78,0 (10 usinas)"
    nota_en: "266 plants; biomethane 78.0 (10 plants)"
  - tipo: barras
    rotulo: "Nota mediana por rota"
    rotulo_en: "Median score by route"
    unidade: "gCO₂eq/MJ"
    itens:
      - { rotulo: "Biometano (10)", valor: 78.0, cor: "#24472a" }
      - { rotulo: "Etanol de cana e milho (6)", valor: 66.4, cor: "#5f8a4a" }
      - { rotulo: "Etanol de cana (266)", valor: 61.3, cor: "#a9c08a" }
      - { rotulo: "Biodiesel (45)", valor: 59.4, cor: "#e6dcb4" }
      - { rotulo: "Etanol de milho (11)", valor: 57.8, cor: "#e6dcb4" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/renovabio-br-2026/br_renovabio_notas.gpkg.zip
    rotulo: "Usinas certificadas, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Certified plants, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,2 MB"
  - formato: csv
    arquivo: dados/br_renovabio_notas.csv
    rotulo: "As 338 usinas, com nota, rota, volume elegível e município"
    rotulo_en: "The 338 plants, with score, route, eligible volume and municipality"
    tamanho: "91 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/renovabio-br-2026/br_renovabio_notas_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/renovabio-br-2026/br_renovabio_notas_prancha.en.svg
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

# A nota de cada usina: a Nota de Eficiência Energético-Ambiental das usinas certificadas no RenovaBio

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 156, a primeira da coleção **A nota de cada usina**. O RenovaBio paga as usinas de
biocombustível em créditos de descarbonização (CBIO) conforme uma nota dada a cada uma. Esta prancha
mostra a nota de todas as usinas com certificado válido e onde estão.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `usinas` | ponto | 338 usinas: `cnpj14`, `nome`, `rota` (cana, milho, flex, biodiesel, biometano), `nota` e `nota_anidro` (gCO₂eq/MJ), `eleg` (volume elegível, %), `fator` (tCO₂eq por litro), `cbio_m3`, `aprov`, `validade`, `firma`, `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `cap_m3d`, `mes_cap`, `localizacao`, `classe_nota`, `lon`, `lat` |
| `ufs` | polígono | 27 UFs: `usinas`, `nota_mediana`, `etanol_usinas`, `etanol_nota_mediana` |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `renovabio-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/renovabio-br-2026),
com os **estilos do QGIS** gravados (cor pela classe da nota, forma pela rota). O **CSV** fica nesta
pasta, em UTF-8, com a tabela das usinas sem geometria.

## Método

1. Planilha de certificados aprovados da ANP (`certificados-aprovados-producao.xlsx`, atualizada em
   27/10/2026, baixada em 01/11/2026), aba «Válidos»: 339 certificados, um por CNPJ. Sai o único
   certificado de importação (etanol de milho de Plymouth Energy, nos EUA, nota 23,9); ficam 338 usinas.
2. A nota é a Nota de Eficiência Energético-Ambiental do certificado, em gCO₂eq/MJ: a intensidade de
   carbono do fóssil substituto menos a do biocombustível, calculada na RenovaCalc. Nas usinas de etanol
   vale a nota do hidratado (a do anidro, no CSV, difere poucos décimos).
3. Rota: a da planilha, agrupada em cana, milho, cana e milho em usina integrada (flex), biodiesel e
   biometano. A usina de primeira e segunda geração de cana (Costa Pinto, Piracicaba) conta como cana.
4. Município: pelo CNPJ, no último mês em que a usina aparece no painel de produtores de etanol ou de
   biodiesel da ANP (327 usinas); nas 10 de biometano e numa de etanol que não estão nos painéis, pelo
   endereço do emissor no próprio certificado. Cada usina é desenhada na sede do município (IBGE,
   Localidades 2022); usinas do mesmo município ficam sobrepostas.
5. Medianas por UF só para o etanol e só nas UFs com 5 usinas ou mais.

## Leitura

- 338 usinas certificadas: 266 de etanol de cana, 11 de etanol de milho, 6 de cana e milho, 45 de
  biodiesel e 10 de biometano, em 285 municípios de 22 UFs.
- Nota mediana: biometano 78,0; etanol de cana e milho 66,4; etanol de cana 61,3; biodiesel 59,4;
  etanol de milho 57,8.
- O etanol de cana é estreito: metade das usinas fica entre 56,7 e 64,2. O biodiesel não tem meio:
  21 usinas abaixo de 50 (mediana 45,0), 21 acima de 70 (mediana 80,3) e só 3 entre os dois.
- A maior nota do etanol é 70,9, de uma usina de cana e milho em Quirinópolis (GO); a menor, 32,8,
  de uma usina de cana registrada pela ANP em Uruaçu (GO).
- No etanol, as medianas vão de 62,8 em Mato Grosso do Sul, 62,2 em Goiás e 62,1 em São Paulo a 54,5
  na Paraíba e 54,1 em Alagoas.

## Limitações

- A nota é a do certificado, calculada com dados que a própria usina declara e que uma firma
  inspetora confere; não é uma medição de emissões.
- A planilha não diz a matéria-prima de cada usina de biodiesel, por isso os dois grupos de notas
  não podem ser explicados só com estes dados.
- A nota vale por litro (ou m³) e não diz quanto a usina produz; o mapa não pesa as usinas pelo volume.
- O biometano entra só como ponto, sem capacidade nem potencial de produção. Uma usina de biometano
  (Biometano Sul) tem no certificado endereço de escritório em Piracicaba (SP), e é ali que ela aparece.
- A emissão de CBIO por usina só está no painel em Power BI da ANP, sem arquivo aberto, e não entra.

## Licença dos dados

Dados abertos da ANP e do IBGE, de uso livre com citação da fonte.
