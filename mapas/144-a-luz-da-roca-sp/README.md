---
numero: 144
titulo: "A luz da roça"
subtitulo: "Onde cada ligação rural gasta muito mais que a média"
data: 2027-01-08
rascunho: true
categoria: energia
colecao: energia-municipal-sp
tags: [energia-municipal-sp, sao-paulo, eletricidade, consumo-rural, irrigacao, agroindustria, semil, anuario-de-energeticos]

contexto: >-
  Em 2024, cada ligação rural de São Paulo gastou em média 12.852 kWh de eletricidade, 5,3 vezes o consumo de uma casa (2.409 kWh). A média esconde extremos: 83 municípios ficam com o dobro dela ou mais e, com 9,5% das ligações rurais, levam 39,5% da luz da roça; no município mediano, a ligação rural gasta 9.157 kWh. Em Itaí, as 45 ligações rurais gastam 822 MWh cada uma, 64 vezes a média, e somam 59% da eletricidade da cidade; Paranapanema vem logo atrás, com 515 MWh por ligação. No outro extremo, Piedade tem o maior número de ligações rurais do estado, 5.361, com 6,2 MWh cada. A classe rural do Anuário junta lavoura, criação, irrigação, parte da agroindústria e as casas da roça, e poucas ligações grandes bastam para puxar a média de um município pequeno.

imagem: ./mapa_preview.png
imagem_alt: "Mapa coroplético dos 645 municípios de São Paulo pela eletricidade por ligação rural em 2024, dividida pela média do estado (12.852 kWh). Sete classes vão do azul-escuro (menos da metade da média) ao marrom-escuro (quatro vezes a média ou mais); doze municípios ficam hachurados, sem consumidor rural ou com erro no Anuário. O azul domina o oeste, o Vale do Ribeira e o litoral norte; os marrons se juntam no nordeste, entre Ribeirão Preto e a divisa com Minas Gerais, e no sudoeste, em volta de Itaí, Paranapanema e Avaré. Duas chamadas: Itaí, 822 MWh por ligação, 45 ligações, 59% da eletricidade da cidade; Piedade, 5.361 ligações rurais, 6,2 MWh cada. No painel, a legenda com o número de municípios por classe e as barras dos seis maiores consumos por ligação."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "SEMIL/SP, Anuário de Energéticos por Município 2025 (ano-base 2024): consumidores e consumo de energia elétrica por classe e por município"
    nome_en: "SEMIL/SP, Municipal Energy Yearbook 2025 (base year 2024): electricity consumers and consumption by class and municipality"
    url: https://semil.sp.gov.br/anuario-de-energeticos-por-municipios-do-estado-de-sao-paulo/
    ano: 2024
  - nome: "IBGE — Malha Municipal 2025 e Censo Demográfico 2022 (população)"
    nome_en: "IBGE — Municipal Mesh 2025 and 2022 Demographic Census (population)"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "pandas", "GeoPandas", "xpdf (pdftotext)", "QGIS", "Node.js", "d3-geo"]
metodo: "Consumo da classe rural (kWh) dividido pelo número de consumidores rurais de cada município, no Anuário de Energéticos por Município 2025 da SEMIL/SP, e o resultado dividido pela média do estado; seis municípios com o kWh rural repetido de outra célula da tabela ficam de fora."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#b06a2a", descricao: "645 municípios: consumidores e kWh rurais, kWh total, kWh por ligação rural, razão sobre a média, parte rural na eletricidade, classe e aviso", descricao_en: "645 municipalities: rural consumers and kWh, total kWh, kWh per rural connection, ratio to the mean, rural share of electricity, class and warning" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões intermediárias do IBGE", descricao_en: "IBGE’s 11 intermediate regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "kWh por ligação rural em 2024"
    rotulo_en: "kWh per rural connection in 2024"
    valor: 12852
    unidade: "kWh"
    nota: "5,3 vezes o consumo de uma ligação residencial (2.409 kWh)"
    nota_en: "5.3 times a residential connection (2,409 kWh)"
  - tipo: barras
    rotulo: "Municípios por classe de kWh por ligação rural"
    rotulo_en: "Municipalities by class of kWh per rural connection"
    unidade: "municípios"
    itens:
      - { rotulo: "menos da metade da média", rotulo_en: "less than half the mean", valor: 200, cor: "#3d6f8e" }
      - { rotulo: "0,5 a 0,75 × a média", rotulo_en: "0.5 to 0.75 × the mean", valor: 133, cor: "#86abc0" }
      - { rotulo: "0,75 a 1 × a média", rotulo_en: "0.75 to 1 × the mean", valor: 92, cor: "#c9d9e2" }
      - { rotulo: "1 a 1,5 × a média", rotulo_en: "1 to 1.5 × the mean", valor: 89, cor: "#efdcae" }
      - { rotulo: "1,5 a 2 × a média", rotulo_en: "1.5 to 2 × the mean", valor: 36, cor: "#dcaa5e" }
      - { rotulo: "2 a 4 × a média", rotulo_en: "2 to 4 × the mean", valor: 50, cor: "#b06a2a" }
      - { rotulo: "4 × a média ou mais", rotulo_en: "4 × the mean or more", valor: 33, cor: "#6b3518" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/energia-municipal-sp-2026/sp_eletricidade_rural_2024.gpkg.zip
    rotulo: "Municípios, regiões intermediárias e limite, SIRGAS 2000, com estilo do QGIS"
    rotulo_en: "Municipalities, intermediate regions and boundary, SIRGAS 2000, with QGIS style"
    tamanho: "18,5 MB"
  - formato: csv
    arquivo: dados/sp_eletricidade_rural_2024.csv
    rotulo: "Eletricidade rural dos 645 municípios em 2024"
    rotulo_en: "Rural electricity in the 645 municipalities in 2024"
    tamanho: "0,1 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/energia-municipal-sp-2026/sp_eletricidade_rural_2024_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/energia-municipal-sp-2026/sp_eletricidade_rural_2024_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,2 MB"
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

# A luz da roça: eletricidade por ligação rural nos municípios de SP em 2024

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 144, a primeira da coleção **A energia de cada município**. O Anuário de Energéticos por
Município da SEMIL/SP conta, para cada um dos 645 municípios, quantos consumidores de eletricidade há em
cada classe e quanto cada classe gastou. Aqui a pergunta é quanto gasta, em média, cada ligação da
classe rural, e onde esse número foge da média do estado.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `CD_MUN`, `NM_MUN`, `CD_RGINT`, `NM_RGINT`, `populacao_2022`, `rural_nc` (consumidores rurais), `rural_kwh`, `total_kwh` (todas as classes), `kwh_por_ligacao_rural`, `razao_media` (sobre 12.852 kWh), `pct_rural_na_eletricidade`, `classe` (0 a 6, vazia sem dado) e `aviso` |
| `regioes_intermediarias` | polígono | as 11 regiões intermediárias do IBGE: `CD_RGINT`, `NM_RGINT` |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `energia-municipal-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/energia-municipal-sp-2026),
com o **estilo do QGIS** da prancha na camada `municipios`. O **CSV** fica nesta pasta, em UTF-8, sem
geometria.

## Método

1. **Leitura do Anuário.** O PDF do Anuário 2025 (ano-base 2024) foi convertido em texto com o
   `pdftotext -table` do xpdf, que guarda a posição das colunas. Células vazias somem do texto corrido;
   por isso cada número foi posto na sua coluna pela posição, comparada com as linhas completas da
   mesma página. Os 645 municípios foram lidos e conferidos: em cada linha, as classes somam o total, e
   a soma dos municípios bate com a linha do estado.
2. **A página que é imagem.** A última página da tabela de eletricidade (página 42 do PDF) não tem
   texto. Os 20 municípios de Uchôa a Zacarias foram transcritos à mão da imagem e conferidos pela soma
   das linhas, pelos totais do estado (consumidores exatos; kWh com diferença de até 17 kWh, do
   arredondamento do próprio Anuário) e pela eletricidade em tep da tabela de consumo total (desvio
   máximo de 0,19%).
3. **kWh por ligação rural** = consumo da classe rural ÷ consumidores rurais. A média do estado,
   12.852 kWh, é a razão das somas (3.228 GWh ÷ 251.193 ligações), sem os municípios do passo 4.
4. **Erros de cópia do Anuário.** Em Ribeirão Preto, Rifaina e Rincão, o kWh rural é 233.962.584, o
   número do consumo industrial de Ribeirão Preto. Em Restinga, Reginópolis e Sales Oliveira, o kWh
   rural repete uma célula vizinha da mesma linha. A regra usada: kWh rural de 1 milhão ou mais igual a
   outra célula de kWh da tabela. Esses seis ficam hachurados e fora da média; com eles, a média seria
   15.645 kWh. Os outros seis municípios hachurados (Osasco, São Caetano do Sul, Santo André, Diadema,
   Barueri e Taboão da Serra) não têm consumidor rural.
5. **Classes** pela razão sobre a média: 0,5; 0,75; 1; 1,5; 2 e 4. O consumo de uma casa (2.409 kWh)
   é a mesma conta para a classe residencial.

## Limitações

- **Ligação não é propriedade.** O Anuário conta consumidores (unidades com medidor). Uma fazenda pode
  ter várias ligações, e uma ligação pode atender um pivô de irrigação, um aviário ou uma casa.
- **A classe rural é larga.** Pela regra da ANEEL, ela junta a produção agropecuária, a irrigação, parte
  da agroindústria e as moradias rurais. Uma agroindústria ligada na classe rural pesa muito num
  município com poucas ligações; a prancha não diz qual atividade gasta a energia.
- Os erros de cópia do passo 4 foram achados por uma regra simples; um erro que não repete outra célula
  passa sem ser visto.
- A eletricidade vem das distribuidoras. Quem gera a própria energia (painel solar, bagaço) e consome
  sem passar pela rede não aparece.

## Licença dos dados

Anuário de Energéticos por Município da SEMIL/SP e malha municipal e Censo do IBGE: dados públicos, de
uso livre com citação da fonte.
