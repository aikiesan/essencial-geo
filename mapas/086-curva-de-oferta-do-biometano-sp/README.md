---
numero: 86
titulo: "A curva de oferta"
subtitulo: "Metade do biometano fica a mais de 76 km de um ponto de entrega de gás"
data: 2026-10-20
categoria: energia
colecao: suprimento-sp
tags: [suprimento-sp, sao-paulo, biometano, biogas, cp2b, gasodutos, pontos-de-entrega, curva-de-oferta]

contexto: >-
  Quanto do biometano fica perto de onde o gás entra na rede? Medindo a distância em linha reta de cada célula de 1 km ao ponto de entrega de gás existente mais próximo, só 14% do potencial do estado fica a até 25 km e 33% a até 50 km; metade está a mais de 76 km, e um décimo, a mais de 157 km. A curva muda com a fonte: 57% do lixo, poda e esgoto fica a até 25 km, porque cidades e gasodutos andam juntos; metade dos dejetos está a até 59 km, a da cana a até 80 km e a das outras lavouras a até 101 km. A rede elétrica é mais densa: metade do potencial está a até 33 km de uma subestação da rede básica. O fim da curva é o norte canavieiro, como Igarapava, a 226 km do ponto de entrega mais próximo. Segunda prancha da coleção «Bacias de suprimento».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com a distância ao ponto de entrega de gás mais próximo, de verde-escuro (até 10 km) a marrom (mais de 150 km), em tons fortes onde está a maior parte do potencial e em tons claros no resto. Os gasodutos de transporte e os pontos de entrega aparecem em vinho, numa diagonal que vai de Mato Grosso do Sul à capital e segue para o Vale do Paraíba; os verdes acompanham essa linha e o norte e o oeste ficam em laranja e marrom. Uma chamada aponta Igarapava, a 226 km. No painel, curvas da parte acumulada do potencial pela distância, uma para cada fonte, com a curva tracejada da distância à subestação."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "CP2B (Unicamp) — potencial de biogás e biometano por município, método v5.1"
    nome_en: "CP2B (Unicamp) — biogas and biomethane potential by municipality, method v5.1"
    ano: 2026
  - nome: "EPE — WebMap: gasodutos de transporte, pontos de entrega e subestações existentes, na versão da base de infraestrutura do MapBiomas"
    nome_en: "EPE — WebMap: existing transmission gas pipelines, delivery points and substations, as published in the MapBiomas infrastructure database"
    url: https://gisepeprd2.epe.gov.br/WebMapEPE/
    ano: 2022
  - nome: "MapBiomas — Coleção 10 da Série Anual de Mapas de Uso e Cobertura da Terra do Brasil, 2024"
    nome_en: "MapBiomas — Collection 10 of the Annual Series of Land Use and Land Cover Maps of Brazil, 2024"
    url: https://brasil.mapbiomas.org/colecoes-mapbiomas/
    ano: 2024
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Potencial de biometano do CP2B (v5.1, nível N4, cenário de referência), distribuído pelo uso da terra em células de cerca de 1 km, acumulado pela distância em linha reta de cada célula ao ponto de entrega de gás existente mais próximo (e, à parte, à subestação da rede básica mais próxima), dos dois lados da divisa."

camadas:
  - { nome: grade, tipo: poligono, cor: "#a9bf86", descricao: "Células com a distância e o nome do ponto de entrega mais próximo (km_ponto_entrega, ponto_entrega) e da subestação mais próxima (km_subestacao, subestacao); estilos ponto_entrega e subestacao (mesmo GPKG da prancha 085)", descricao_en: "Cells with the distance to and name of the nearest delivery point (km_ponto_entrega, ponto_entrega) and substation (km_subestacao, subestacao); styles ponto_entrega and subestacao (same GPKG as plate 085)" }
  - { nome: gasodutos_transporte, tipo: linha, cor: "#6b3d5c", descricao: "Gasodutos de transporte existentes", descricao_en: "Existing transmission gas pipelines" }
  - { nome: pontos_entrega, tipo: ponto, cor: "#6b3d5c", descricao: "55 pontos de entrega de gás existentes, 38 em SP, depois de juntar os repetidos", descricao_en: "55 existing gas delivery points, 38 in SP, after merging duplicates" }

indicadores:
  - tipo: proporcao
    rotulo: "Biometano pela distância ao ponto de entrega de gás mais próximo"
    rotulo_en: "Biomethane by distance to the nearest gas delivery point"
    unidade: "m³/dia"
    unidade_en: "m³/day"
    itens:
      - { rotulo: "até 10 km", rotulo_en: "up to 10 km", valor: 579111, cor: "#2f4f3a" }
      - { rotulo: "10 a 25 km", rotulo_en: "10 to 25 km", valor: 1722948, cor: "#5f8a5a" }
      - { rotulo: "25 a 50 km", rotulo_en: "25 to 50 km", valor: 3294592, cor: "#a9bf86" }
      - { rotulo: "50 a 100 km", rotulo_en: "50 to 100 km", valor: 5081745, cor: "#e0cf8f" }
      - { rotulo: "100 a 150 km", rotulo_en: "100 to 150 km", valor: 3932707, cor: "#c98f4a" }
      - { rotulo: "mais de 150 km", rotulo_en: "over 150 km", valor: 2261009, cor: "#8f4f2e" }
  - tipo: numero
    rotulo: "Distância que junta metade do biometano: ponto de entrega"
    rotulo_en: "Distance gathering half the biomethane: delivery point"
    valor: 76
    unidade: "km"
  - tipo: numero
    rotulo: "Distância que junta metade do biometano: subestação"
    rotulo_en: "Distance gathering half the biomethane: substation"
    valor: 33
    unidade: "km"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/suprimento-sp-2026/sp_suprimento_biometano.gpkg.zip
    rotulo: "Grade, bacias, pontos de entrega, subestações e usinas (pranchas 085 a 088), SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Grid, catchments, delivery points, substations and plants (plates 085 to 088), SIRGAS 2000, with QGIS styles"
    tamanho: "1,2 MB"
  - formato: csv
    arquivo: dados/sp_biometano_curva_de_oferta.csv
    rotulo: "Curva de oferta, km a km, por fonte"
    rotulo_en: "Supply curve, km by km, by source"
    tamanho: "14 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/suprimento-sp-2026/sp_biometano_curva_de_oferta_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/suprimento-sp-2026/sp_biometano_curva_de_oferta_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,5 MB"
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

# A curva de oferta do biometano em São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 086, a segunda de quatro da coleção **Bacias de suprimento**. É a versão paulista da
curva de oferta das análises de biomassa do DOE (EUA) e do S2Biom (UE), com a distância no lugar do
custo: quanto biometano se junta à medida que se aceita ir mais longe da rede de gás. A distância
de cada município à rede está nas pranchas [057](../057-biometano-e-gasodutos-sp/README.md) e
[058](../058-biometano-e-rede-eletrica-sp/README.md); aqui a conta é por célula de 1 km e
acumulada.

## O que vem nos arquivos

O CSV traz, de 0 a 234 km, o biometano acumulado a até cada distância do ponto de entrega mais
próximo, no total e por fonte (`biometano_ate_ponto_entrega_m3d`, `cana_…`, `lavouras_…`,
`pecuaria_…`, `urbano_…`), a parte do total (`pct_ate_ponto_entrega`) e a mesma conta para a
subestação (`biometano_ate_subestacao_m3d`, `pct_ate_subestacao`). No GPKG da
[prancha 085](../085-biometano-ao-alcance-sp/README.md), a camada `grade` tem a distância e o nome
do ponto de entrega e da subestação mais próximos de cada célula.

## Método

1. Potencial do CP2B (v5.1, N4, cenário de referência) distribuído pelo uso da terra em células de
   cerca de 1 km, como na prancha 085.
2. Pontos de entrega de gás e subestações da rede básica da EPE (na versão do MapBiomas), em SP e
   no entorno, para que a célula perto da divisa possa usar o ponto do outro lado. Pontos a menos de
   100 m uns dos outros (registros repetidos) viram um só: 55 pontos de entrega e 183 subestações.
3. Distância em linha reta do centro de cada célula ao ponto mais próximo, em quilômetros, e soma
   acumulada do potencial por distância, quilômetro a quilômetro.
4. No mapa, as cores fortes marcam as células mais densas, que somam 75% do potencial
   (89 m³/dia por km² ou mais, 24% da área).

## Limitações

- A distância é em linha reta e ao ponto de entrega existente; não diz se o ponto tem capacidade
  ou contrato para receber biometano, nem considera gasodutos de distribuição.
- A curva não é de custo: o frete, a compressão e a injeção dependem da escala e do modo de
  transporte, que esta prancha não estima.
- O potencial é o do CP2B em SP; o do outro lado da divisa não entra.
