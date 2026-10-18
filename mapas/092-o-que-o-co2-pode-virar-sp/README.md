---
numero: 92
titulo: "O que o CO₂ poderia virar"
subtitulo: "Com hidrogênio verde, a cana renderia quase duas vezes o gás consumido no estado"
data: 2026-12-22
categoria: energia
colecao: carbono-sp
tags: [carbono-sp, sao-paulo, co2-biogenico, hidrogenio-verde, e-metano, e-metanol, power-to-x, gasodutos]

contexto: >-
  Com hidrogênio, o CO₂ biogênico pode virar combustível. Uma tonelada de CO₂ mais 183 kg de H₂ dá 365 kg de metano, cerca de 509 m³; com 137 kg de H₂, dá 728 kg de metanol. Somando o CO₂ das dornas na safra 2025/26 (8,9 milhões de t) e o que a purificação do biogás possível separaria (9,1 milhões), São Paulo teria 18 milhões de t por ano: o bastante para 25 milhões de m³ de e-metano por dia, quase o dobro do gás natural que o estado consumiu em 2024, ou para 13 milhões de t de metanol. Mas a conta pede 3,3 milhões de t de hidrogênio verde e 182 TWh de eletricidade, 1,2 vez o consumo do estado. A região de Ribeirão Preto reúne 26 % do possível, e 60 % do CO₂ das dornas fica a mais de 50 km de um gasoduto. É um cálculo teórico e uma estimativa. Última prancha da coleção «Carbono biogênico».

imagem: ./mapa_preview.png
imagem_alt: "Mapa de São Paulo com as onze regiões intermediárias em cinco tons de azul-acinzentado pelo e-metano possível com o CO₂ biogênico, mais escuras no norte, em Ribeirão Preto e São José do Rio Preto, e quase brancas em São Paulo e São José dos Campos. Por cima, os gasodutos de transporte em ameixa, num eixo do oeste a Campinas e daí à capital e ao Vale do Paraíba, as redes de distribuição em ocre e círculos cor de tijolo nos municípios com mais de 100 mil t de CO₂ de dorna por safra, quase todos no norte, longe dos gasodutos. Uma chamada aponta Guaíra, a 150 km do gasoduto mais próximo. No painel, a conta por tonelada de CO₂ e barras do e-metano possível por região, divididas entre dornas e biogás."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "ANP — Painel Dinâmico de Produtores de Etanol (produção e capacidade por usina)"
    nome_en: "ANP — Ethanol Producers Dynamic Panel (output and capacity by mill)"
    url: https://www.gov.br/anp/pt-br/assuntos/producao-e-fornecimento-de-biocombustiveis/etanol/arquivos-etanol/pb-da-etanol.zip
    ano: 2026
  - nome: "CP2B (Unicamp) — potencial de biogás e biometano por município, método v5.1 (nível N4, cenário de referência)"
    nome_en: "CP2B (Unicamp) — biogas and biomethane potential by municipality, method v5.1 (level N4, reference scenario)"
    ano: 2026
  - nome: "IRENA (2020) — Green Hydrogen Cost Reduction: Scaling up Electrolysers to Meet the 1.5 °C Climate Goal (consumo de eletricidade da eletrólise)"
    nome_en: "IRENA (2020) — Green Hydrogen Cost Reduction: Scaling up Electrolysers to Meet the 1.5 °C Climate Goal (electrolysis power use)"
    url: https://www.irena.org/publications/2020/Dec/Green-hydrogen-cost-reduction
    ano: 2020
  - nome: "SEMIL (SP) — Anuário de Energéticos por Município do Estado de São Paulo 2025, ano base 2024 (consumo de gás natural e de eletricidade)"
    nome_en: "SEMIL (SP) — Energy Yearbook by Municipality of São Paulo State 2025, base year 2024 (natural gas and electricity use)"
    url: https://semil.sp.gov.br/anuario-de-energeticos-por-municipios-do-estado-de-sao-paulo/
    ano: 2025
  - nome: "EPE — WebMap: gasodutos de transporte e de distribuição existentes, na versão da base de infraestrutura do MapBiomas"
    nome_en: "EPE — WebMap: existing transmission and distribution gas pipelines, as published in the MapBiomas infrastructure database"
    url: https://gisepeprd2.epe.gov.br/WebMapEPE/
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025 e regiões geográficas intermediárias"
    nome_en: "IBGE — Municipal Mesh 2025 and intermediate geographic regions"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "CO₂ biogênico por região intermediária (dornas na safra 2025/26, prancha 089, mais a purificação do biogás possível, prancha 090), convertido em e-metano (CO₂ + 4 H₂ → CH₄ + 2 H₂O) e em e-metanol (CO₂ + 3 H₂ → CH₃OH + H₂O) com conversão completa, e o hidrogênio em eletricidade a 55 kWh por kg (eletrólise); distância de cada município ao gasoduto mais próximo."

camadas:
  - { nome: regioes_carbono, tipo: poligono, cor: "#46697f", descricao: "11 regiões intermediárias: CO₂ biogênico, H₂, eletricidade, e-metano e e-metanol possíveis e a maior fonte", descricao_en: "11 intermediate regions: biogenic CO₂, H₂, electricity, possible e-methane and e-methanol, and the largest source" }
  - { nome: usinas_etanol, tipo: ponto, cor: "#7a3b2c", descricao: "145 usinas de etanol, com o CO₂ estimado (prancha 089)", descricao_en: "145 ethanol mills, with estimated CO₂ (plate 089)" }
  - { nome: gasodutos_transporte, tipo: linha, cor: "#6b3d5c", descricao: "Gasodutos de transporte existentes (mesma base da prancha 057)", descricao_en: "Existing transmission pipelines (same database as plate 057)" }
  - { nome: gasodutos_distribuicao, tipo: linha, cor: "#c08a2e", descricao: "Redes de distribuição de gás canalizado", descricao_en: "Piped gas distribution networks" }

indicadores:
  - tipo: barras
    rotulo: "e-metano possível por região"
    rotulo_en: "Possible e-methane by region"
    unidade: "mil m³ por dia"
    unidade_en: "thousand m³ a day"
    itens:
      - { rotulo: "Ribeirão Preto", valor: 6485, cor: "#46697f" }
      - { rotulo: "São José do Rio Preto", valor: 4485, cor: "#46697f" }
      - { rotulo: "Bauru", valor: 2593, cor: "#7598ab" }
      - { rotulo: "Araçatuba", valor: 2492, cor: "#7598ab" }
      - { rotulo: "Campinas", valor: 2065, cor: "#7598ab" }
      - { rotulo: "Presidente Prudente", valor: 1921, cor: "#a9bfcb" }
      - { rotulo: "Marília", valor: 1897, cor: "#a9bfcb" }
      - { rotulo: "Araraquara", valor: 1669, cor: "#a9bfcb" }
      - { rotulo: "Sorocaba", valor: 1288, cor: "#a9bfcb" }
      - { rotulo: "São Paulo", valor: 182, cor: "#d3dde3" }
      - { rotulo: "São José dos Campos", valor: 26, cor: "#eef1f3" }
  - tipo: proporcao
    rotulo: "CO₂ das dornas pela distância ao gasoduto"
    rotulo_en: "Vat CO₂ by distance to the gas pipeline"
    unidade: "t por safra"
    unidade_en: "t a harvest"
    itens:
      - { rotulo: "até 10 km", rotulo_en: "up to 10 km", valor: 1202191, cor: "#3d5e34" }
      - { rotulo: "10 a 25 km", rotulo_en: "10 to 25 km", valor: 1099139, cor: "#6f8f5a" }
      - { rotulo: "25 a 50 km", rotulo_en: "25 to 50 km", valor: 1238203, cor: "#cbbd97" }
      - { rotulo: "mais de 50 km", rotulo_en: "over 50 km", valor: 5342754, cor: "#7a3b2c" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/carbono-sp-2026/sp_carbono_biogenico.gpkg.zip
    rotulo: "Usinas, municípios, regiões e gasodutos (mesmo arquivo das pranchas 089 a 092), SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Mills, municipalities, regions and pipelines (same file as plates 089 to 092), SIRGAS 2000, with QGIS styles"
    tamanho: "4,7 MB"
  - formato: csv
    arquivo: dados/sp_carbono_regioes.csv
    rotulo: "Tabela das regiões intermediárias"
    rotulo_en: "Intermediate region table"
    tamanho: "1 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/carbono-sp-2026/sp_co2_power_to_x_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/carbono-sp-2026/sp_co2_power_to_x_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,4 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

versao: "1.0.0"
discussoes: []
---

# O que o CO₂ biogênico de São Paulo poderia virar

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 092, a última de quatro da coleção **Carbono biogênico**: quanto combustível o CO₂ das
dornas e do biogás daria com hidrogênio verde, e quanta eletricidade isso pediria.

## O que vem nos arquivos

- `dados/sp_carbono_regioes.csv`: uma linha por região intermediária, com `co2_fermentacao_t`,
  `co2_biogas_t`, `co2_biogenico_t`, `h2_t` (hidrogênio necessário para metanar todo o CO₂),
  `eletricidade_gwh`, `emetano_nm3_dia`, `emetano_mi_m3_ano`, `emetanol_t` (se o mesmo CO₂ virasse
  metanol), `co2_fermentacao_ate_25km_t` (CO₂ de dorna em municípios a até 25 km de um gasoduto)
  e `maior_fonte` (o município com mais CO₂ de dorna).
- `sp_carbono_biogenico.gpkg.zip` (na release `carbono-sp-2026`): a camada `regioes_carbono`
  (estilo `emetano`, com as classes do mapa), as usinas e os gasodutos; na camada `municipios`,
  `emetano_nm3_dia`, `km_gasoduto` e `km_gasoduto_transporte`.

## Hipóteses

| | por t de CO₂ | fonte |
|---|---|---|
| Metanação (Sabatier): CO₂ + 4 H₂ → CH₄ + 2 H₂O | 183 kg de H₂ → 365 kg de CH₄ = 509 m³ (0 °C, 1 atm) | estequiometria, massas molares da IUPAC |
| Síntese do metanol: CO₂ + 3 H₂ → CH₃OH + H₂O | 137 kg de H₂ → 728 kg de metanol | estequiometria |
| Eletrólise da água | 55 kWh por kg de H₂ (faixa de 50 a 83 kWh/kg nos eletrolisadores atuais) | IRENA (2020) |
| Eletricidade por t de CO₂ | 10,1 MWh (e-metano) ou 7,6 MWh (e-metanol) | 55 kWh/kg × H₂ |

A conversão é tomada como completa, sem perdas no reator, na compressão ou na captura; os números
são, portanto, um teto teórico.

## Método

1. CO₂ biogênico: o das dornas na safra 2025/26 (prancha 089, 8,88 milhões de t) mais o da
   purificação do biogás possível (prancha 090, 9,13 milhões de t), somado por região
   intermediária do IBGE: 18,0 milhões de t por ano no estado.
2. Combustível: e-metano e, alternativamente, e-metanol, com as relações da tabela; e-metano por
   dia é o anual dividido por 365.
3. Comparação: com o gás natural consumido em SP em 2024, 4,78 bilhões de m³ (13,1 milhões de m³
   por dia), e com a eletricidade consumida, 146,9 TWh (Anuário de Energéticos da SEMIL, ano base
   2024, convertido a 0,086 tep por MWh). O e-metano possível daria 25,1 milhões de m³ por dia, 1,9
   vez o gás do estado; só o das dornas, 12,4 milhões de m³, 95 %. A eletricidade necessária, 182
   TWh, é 1,2 vez o consumo do estado; só para as dornas, 89,5 TWh, 61 %.
4. Gasodutos: a distância do ponto interno de cada município ao gasoduto mais próximo (EPE, via
   MapBiomas, prancha 057), em quatro faixas. Das 8,9 milhões de t de CO₂ das dornas, 1,2 milhão
   está a até 10 km de um gasoduto, 1,1 de 10 a 25 km, 1,2 de 25 a 50 km e 5,3 milhões (60 %) a
   mais de 50 km. Guaíra, a maior fonte, fica a 150 km.

## Limitações

- É um cálculo teórico, uma estimativa: não diz que essas plantas são viáveis, só quanto o carbono
  daria.
- O CO₂ das dornas sai só na safra, de abril a novembro; uma planta contínua precisaria guardar
  CO₂ ou hidrogênio, ou ficar parada parte do ano.
- O hidrogênio verde exigiria geração renovável nova; a eletricidade da conta supera o consumo
  atual do estado.
- O CO₂ do biogás é potencial (prancha 090): só existe se o biogás for produzido e purificado.
- O gás natural do Anuário é medido em m³ comerciais, não normais; a comparação com o e-metano é
  aproximada.
- A outra saída para esse CO₂, o armazenamento geológico (BECCS), depende de reservatório estudado
  e não entra na conta.
