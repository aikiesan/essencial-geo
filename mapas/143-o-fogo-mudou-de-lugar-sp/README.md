---
numero: 143
titulo: "O fogo mudou de lugar"
subtitulo: "O mesmo número de focos, mais perto da cana"
data: 2027-01-06
rascunho: true
categoria: uso-do-solo
colecao: fogo-sp
tags: [fogo-sp, sao-paulo, focos-de-calor, queimadas, cana, queima-da-palha, protocolo-agroambiental, inpe, mapbiomas]

contexto: >-
  O satélite de referência do INPE registrou 23.605 focos de calor no estado de São Paulo de 2003 a 2007 e 23.569 de 2020 a 2024: 1,9 por 100 km² por ano nos dois períodos. O total ficou igual, mas o lugar mudou. Na região intermediária de Sorocaba, com 3% da terra em cana, os focos caíram 55%; nas de Ribeirão Preto e São José do Rio Preto, onde a cana cobre metade e 39% da terra, subiram 47%. Nos municípios com menos de 10% de cana a densidade caiu 32%; nos que têm de 25% a 50%, subiu 32%. Parte do empate vem de 2024, o ano recorde da série, com 8.712 focos: comparando 2003–2006 com 2020–2023, o estado tem 22% menos focos, mas o norte canavieiro fica no mesmo nível e o resto cai. A queima da palha foi proibida aos poucos pela Lei estadual 11.241/2002 e pelo Protocolo Agroambiental de 2007; a prancha mostra onde o fogo está, não o que o causou. Foco de calor não é área queimada.

imagem: ./mapa_preview.png
imagem_alt: "Mapa coroplético dos municípios do estado de São Paulo com a diferença nos focos de calor por 100 km² por ano entre 2003–2007 e 2020–2024, em sete classes: azuis para menos focos, quase branco para pouca mudança e terracota para mais focos. Um contorno preto grosso marca os municípios com metade ou mais da terra em cana em 2024. A terracota cobre o norte e o noroeste, de Ribeirão Preto a São José do Rio Preto e Araçatuba; os azuis cobrem o sul e o sudeste, do Vale do Ribeira à região de Sorocaba, com os mais escuros no alto Ribeira. Duas chamadas: Itapirapuã Paulista, sem cana, de 194 para 5 focos; Lourdes, com 41% da terra em cana, de 11 para 72. No painel, a legenda, as colunas dos focos de cada ano de 2003 a 2024 com os marcos do Protocolo Agroambiental e da lei, e as barras da densidade de focos nos dois períodos por faixa de cana."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "INPE — Programa Queimadas (BDQueimadas), focos de calor do satélite de referência, arquivos anuais de 2003 a 2024"
    nome_en: "INPE — Queimadas Programme (BDQueimadas), reference-satellite hotspots, annual files 2003 to 2024"
    url: https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/anual/Brasil_sat_ref/
    ano: 2024
  - nome: "MapBiomas — Coleção 10 da Série Anual de Mapas de Uso e Cobertura da Terra do Brasil, 2003 a 2024"
    nome_en: "MapBiomas — Collection 10 of the Annual Series of Land Use and Land Cover Maps of Brazil, 2003 to 2024"
    url: https://brasil.mapbiomas.org/colecoes-mapbiomas/
    ano: 2024
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "pandas", "GeoPandas", "rasterio", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Focos do satélite de referência do INPE em 2003–2007 e 2020–2024, contados por município e divididos pela área e pelos cinco anos; a cor é a diferença entre os dois períodos; o contorno marca os municípios com metade ou mais da terra em cana em 2024 (MapBiomas)."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#9c4a32", descricao: "645 municípios: parte em cana em 2024, focos e focos por 100 km² por ano nos dois períodos, diferença e razão", descricao_en: "645 municipalities: share in cane in 2024, hotspots and hotspots per 100 km² per year in both periods, difference and ratio" }
  - { nome: cana_metade_ou_mais, tipo: poligono, cor: "#1a1c1e", descricao: "Contorno dos municípios com 50% ou mais da terra em cana em 2024", descricao_en: "Outline of the municipalities with 50% or more of their land in cane in 2024" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#5c6166", descricao: "11 regiões intermediárias: focos nos dois períodos, razão, razão sem 2024 e parte em cana", descricao_en: "11 intermediate regions: hotspots in both periods, ratio, ratio without 2024 and share in cane" }

indicadores:
  - tipo: numero
    rotulo: "Focos de calor em 2020–2024"
    rotulo_en: "Hotspots in 2020–2024"
    valor: 23569
    unidade: "focos"
    nota: "23.605 em 2003–2007; 1,9 por 100 km² por ano nos dois períodos"
    nota_en: "23,605 in 2003–2007; 1.9 per 100 km² per year in both periods"
  - tipo: barras
    rotulo: "Focos de 2020–2024 em relação aos de 2003–2007, por região intermediária"
    rotulo_en: "Hotspots in 2020–2024 relative to 2003–2007, by intermediate region"
    unidade: "×"
    itens:
      - { rotulo: "Sorocaba", rotulo_en: "Sorocaba", valor: 0.45, cor: "#234e70" }
      - { rotulo: "São José dos Campos", rotulo_en: "São José dos Campos", valor: 0.77, cor: "#5b84a3" }
      - { rotulo: "São Paulo", rotulo_en: "São Paulo", valor: 0.77, cor: "#5b84a3" }
      - { rotulo: "Bauru", rotulo_en: "Bauru", valor: 0.84, cor: "#5b84a3" }
      - { rotulo: "Presidente Prudente", rotulo_en: "Presidente Prudente", valor: 0.88, cor: "#5b84a3" }
      - { rotulo: "Marília", rotulo_en: "Marília", valor: 0.93, cor: "#a8c1d3" }
      - { rotulo: "Campinas", rotulo_en: "Campinas", valor: 1.02, cor: "#a8c1d3" }
      - { rotulo: "Araraquara", rotulo_en: "Araraquara", valor: 1.17, cor: "#e2b6a3" }
      - { rotulo: "Araçatuba", rotulo_en: "Araçatuba", valor: 1.43, cor: "#9c4a32" }
      - { rotulo: "Ribeirão Preto", rotulo_en: "Ribeirão Preto", valor: 1.47, cor: "#9c4a32" }
      - { rotulo: "São José do Rio Preto", rotulo_en: "São José do Rio Preto", valor: 1.47, cor: "#9c4a32" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/fogo-sp-2026/sp_focos_densidade_mudanca.gpkg.zip
    rotulo: "Municípios, mancha de cana e regiões, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities, cane outline and regions, SIRGAS 2000, with QGIS styles"
    tamanho: "18,4 MB"
  - formato: csv
    arquivo: dados/sp_focos_densidade_mudanca.csv
    rotulo: "Os 645 municípios, com os focos nos dois períodos"
    rotulo_en: "All 645 municipalities, with hotspots in both periods"
    tamanho: "0,1 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/fogo-sp-2026/sp_focos_densidade_mudanca_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/fogo-sp-2026/sp_focos_densidade_mudanca_prancha.en.svg
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

# O fogo mudou de lugar: focos de calor por município em SP, 2003–2007 e 2020–2024

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 143, a terceira da coleção **Biomassa que vira fumaça**. O mesmo número de focos nos dois
quinquênios, em outro mapa: menos no sul e no sudeste, mais no norte canavieiro.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `CD_MUN`, `NM_MUN`, `CD_RGINT`, `NM_RGINT`, `area_km2`, `pct_cana_2024`, `faixa_cana`, `focos_2003_2007`, `focos_2020_2024`, `focos_100km2_ano_2003_2007`, `focos_100km2_ano_2020_2024`, `diferenca_100km2_ano` (2020–2024 menos 2003–2007), `razao` (focos de 2020–2024 ÷ focos de 2003–2007; vazio se não houve foco no primeiro período), `classe_diferenca` (0 a 6) |
| `cana_metade_ou_mais` | polígono | 16 manchas contínuas dos municípios com 50% ou mais da terra em cana em 2024 |
| `regioes_intermediarias` | polígono | 11 regiões intermediárias do IBGE: `focos_2003_2007`, `focos_2020_2024`, `razao`, `pct_cana`, `razao_sem_2024` (focos de 2020–2023 ÷ focos de 2003–2006) |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `fogo-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/fogo-sp-2026),
com os **estilos do QGIS** da prancha. O **CSV** fica nesta pasta, em UTF-8, com a tabela dos
municípios sem geometria.

## Método

1. Focos dos arquivos anuais do satélite de referência do INPE (BDQueimadas), com `estado` igual a
   «SÃO PAULO», ligados ao município da Malha Municipal 2025 do IBGE pelo ponto: 87.730 focos de 2003
   a 2024, todos da passagem da tarde.
2. Em cada município, os focos de 2003–2007 e de 2020–2024, divididos pela área do município (km²) e
   por cinco anos. A cor é a diferença, em sete classes (limites em ±0,5, ±1,5 e ±3 focos por 100 km²
   por ano). A diferença absoluta evita que municípios com poucos focos no primeiro período apareçam
   com saltos de várias vezes.
3. Parte em cana: área da classe 20 (cana) da MapBiomas, coleção 10, 2024, sobre a área total do
   município, da tabela de área por município contada em 30 m. As faixas são menos de 10%, 10% a 25%,
   25% a 50% e 50% ou mais.
4. As colunas do painel são os focos de cada ano no estado; em escuro, os dois quinquênios. Os marcos
   são datas da regra da queima da palha da cana (ver abaixo); estão lá como referência, não como causa.
5. **Conferência sem 2024.** 2024 é o ano com mais focos da série (8.712, 37% de 2020–2024). Comparando
   2003–2006 com 2020–2023, o estado passa de 19.129 para 14.857 focos (−22%). A região de Sorocaba
   fica com 0,40 vez os focos do primeiro período; Ribeirão Preto e São José do Rio Preto, com 1,06;
   Araçatuba, com 1,02. A mudança de lugar se mantém; o empate do total, não.
6. **Teste à parte: a cana sob os focos ano a ano.** Com os mapas anuais de cana da mesma coleção
   (fração de cana em células de 120 m) e a mesma janela de ~1 km² da prancha 141, a parte de cana em
   volta dos focos ficou acima da parte de cana na área do estado em todos os anos: de 1,15 vez (2023)
   a 1,90 vez (2005); 1,4 em 2007, 1,5 em 2014 e 1,6 em 2024. Não há queda visível depois do
   Protocolo. Os valores estão em `fogo-sp-lugar.json` (cache do pipeline), não nos arquivos baixáveis.

### A regra da queima da palha

- **Lei estadual 11.241, de 19 de setembro de 2002**, regulamentada pelo Decreto 47.700/2003: fim
  gradual da queima da palha da cana, até 2021 nas áreas mecanizáveis e até 2031 nas não mecanizáveis
  (declividade acima de 12%).
- **Protocolo Agroambiental do setor sucroenergético (2007)**, acordo voluntário do governo do estado
  com a UNICA e, depois, com os fornecedores de cana: antecipou os prazos, para os signatários, para
  2014 nas áreas mecanizáveis e 2017 nas demais.

A prancha não testa o efeito dessas regras. Os focos de calor juntam queima autorizada, queima
ilegal e incêndio, em cana e fora dela, e o período mistura essas mudanças com a expansão da cana
(de 14% do estado em 2003 para 24% em 2024 nos mapas anuais de 120 m, que arredondam a cana um
pouco para cima) e com anos secos e úmidos.

## Limitações

- **Foco de calor não é área queimada.** É um pixel de ~1 km em que o sensor viu fogo ativo na
  passagem do satélite. Um incêndio grande pode gerar dezenas de focos; um fogo curto, de noite, sob
  nuvem ou pequeno pode não gerar nenhum.
- A parte em cana é a de 2024. Em 2003 a cana cobria 14% do estado, pelos mapas anuais: muitos
  municípios das faixas altas não eram, então, tão canavieiros.
- A hora da passagem ficou mais tarde nos últimos anos (mais focos às 17h e 18h UTC em 2020–2024), o
  que pode mudar o quanto o satélite vê do fogo da tarde.
- Em municípios pequenos, poucos focos mudam muito a densidade.

## Licença dos dados

Focos do INPE e malha municipal do IBGE: dados abertos, de uso livre com citação da fonte. Dados do
MapBiomas sob licença CC BY 4.0; cite «Projeto MapBiomas — Coleção 10 da Série Anual de Mapas de Uso e
Cobertura da Terra do Brasil».
