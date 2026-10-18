---
numero: 87
titulo: "Biometano à porta da rede"
subtitulo: "As bacias dos pontos de entrega de gás e das subestações"
data: 2026-12-17
categoria: energia
colecao: suprimento-sp
tags: [suprimento-sp, sao-paulo, biometano, biogas, cp2b, pontos-de-entrega, subestacoes, voronoi]

contexto: >-
  A que porta da rede chegaria o biometano? Dando cada célula de 1 km ao ponto de entrega de gás mais próximo, 43 pontos ficam com uma bacia em São Paulo, mas o potencial se concentra em poucos: os cinco maiores, todos no gasoduto Bolívia-Brasil, no centro e no oeste do estado, somam 65% dele. O de Boa Esperança do Sul, sozinho, tem 3,44 milhões de m³ por dia na bacia, 20% do potencial, a 104 km em média. Sem a cana, a ordem muda: Itapetininga lidera com 566 mil, de lavouras e dejetos do sudoeste, seguida de Bilac e Guaiçara. Na rede elétrica, 111 subestações da rede básica dividem o estado em bacias menores; a maior é a de Morro Agudo, com 1,99 milhão de m³ por dia a 38 km em média. Terceira prancha da coleção «Bacias de suprimento».

imagem: ./mapa_preview.png
imagem_alt: "Três mapas do estado de São Paulo divididos em bacias, em verdes pelo biometano de cada uma. No primeiro, as bacias dos pontos de entrega de gás são longas faixas que cortam o oeste e o centro, porque os pontos estão em fila no gasoduto Bolívia-Brasil; a mais escura, a de Boa Esperança do Sul, tem 3,44 milhões de m³ por dia. No segundo, as bacias das subestações são polígonos menores e mais regulares, com a de Morro Agudo, no norte, à frente. No terceiro, as bacias de gás sem a cana, com a de Itapetininga, no sudoeste, em destaque. No quarto quadro, barras com as maiores bacias elétricas."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "CP2B (Unicamp) — potencial de biogás e biometano por município, método v5.1"
    nome_en: "CP2B (Unicamp) — biogas and biomethane potential by municipality, method v5.1"
    ano: 2026
  - nome: "EPE — WebMap: pontos de entrega de gás e subestações existentes, na versão da base de infraestrutura do MapBiomas"
    nome_en: "EPE — WebMap: existing gas delivery points and substations, as published in the MapBiomas infrastructure database"
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
metodo: "Bacias de Voronoi dos pontos de entrega de gás e das subestações da rede básica (EPE, via MapBiomas), em SP e no entorno, recortadas pelo limite do estado; cada bacia soma o potencial de biometano do CP2B (v5.1, nível N4, cenário de referência) das células de cerca de 1 km mais próximas daquele ponto."

camadas:
  - { nome: bacias_pontos_entrega, tipo: poligono, cor: "#7f9d63", descricao: "43 bacias de pontos de entrega com área em SP: biometano total e por fonte, fora da cana, distância média e parte do estado", descricao_en: "43 delivery point catchments with area in SP: total biomethane and by source, outside cane, mean distance and share of the state" }
  - { nome: bacias_subestacoes, tipo: poligono, cor: "#7f9d63", descricao: "110 bacias de subestações da rede básica com área em SP, com os mesmos campos", descricao_en: "110 basic-grid substation catchments with area in SP, with the same fields" }
  - { nome: pontos_entrega, tipo: ponto, cor: "#6b3d5c", descricao: "55 pontos de entrega de gás, com o biometano da bacia (mesmo GPKG da prancha 085)", descricao_en: "55 gas delivery points, with the catchment’s biomethane (same GPKG as plate 085)" }
  - { nome: subestacoes, tipo: ponto, cor: "#1a1c1e", descricao: "183 subestações da rede básica, com tensão e o biometano da bacia", descricao_en: "183 basic-grid substations, with voltage and the catchment’s biomethane" }

indicadores:
  - tipo: proporcao
    rotulo: "Biometano nas bacias dos pontos de entrega de gás"
    rotulo_en: "Biomethane in the gas delivery point catchments"
    unidade: "m³/dia"
    unidade_en: "m³/day"
    itens:
      - { rotulo: "Boa Esperança do Sul", rotulo_en: "Boa Esperança do Sul", valor: 3439469, cor: "#2f5530" }
      - { rotulo: "Guaiçara", rotulo_en: "Guaiçara", valor: 2202896, cor: "#557a43" }
      - { rotulo: "Ibitinga", rotulo_en: "Ibitinga", valor: 1902103, cor: "#7f9d63" }
      - { rotulo: "Bilac", rotulo_en: "Bilac", valor: 1837059, cor: "#adbf8e" }
      - { rotulo: "Valparaíso", rotulo_en: "Valparaíso", valor: 1631972, cor: "#d5dcbd" }
      - { rotulo: "outros 38 pontos", rotulo_en: "other 38 points", valor: 5858613, cor: "#eef0e2" }
  - tipo: numero
    rotulo: "Maior bacia de gás sem a cana (Itapetininga)"
    rotulo_en: "Largest gas catchment leaving cane out (Itapetininga)"
    valor: 565718
    unidade: "m³/dia"
    unidade_en: "m³/day"
  - tipo: numero
    rotulo: "Maior bacia elétrica (SE Morro Agudo, 500/138 kV)"
    rotulo_en: "Largest power catchment (Morro Agudo substation, 500/138 kV)"
    valor: 1.99
    unidade: "milhão de m³/dia"
    unidade_en: "million m³/day"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/suprimento-sp-2026/sp_suprimento_biometano.gpkg.zip
    rotulo: "Grade, bacias, pontos de entrega, subestações e usinas (pranchas 085 a 088), SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Grid, catchments, delivery points, substations and plants (plates 085 to 088), SIRGAS 2000, with QGIS styles"
    tamanho: "1,2 MB"
  - formato: csv
    arquivo: dados/sp_biometano_bacias_da_rede.csv
    rotulo: "Tabela das bacias: pontos de entrega e subestações"
    rotulo_en: "Catchment table: delivery points and substations"
    tamanho: "22 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/suprimento-sp-2026/sp_biometano_bacias_da_rede_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/suprimento-sp-2026/sp_biometano_bacias_da_rede_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "5,7 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,2 MB"

doi_automatico: true
versao: "1.0.0"
discussoes: []
---

# Biometano à porta da rede em São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 087, a terceira de quatro da coleção **Bacias de suprimento**. A
[prancha 086](../086-curva-de-oferta-do-biometano-sp/README.md) mede quanto potencial há a cada
distância da rede; esta pergunta a qual ponto da rede ele chegaria primeiro e quais pontos teriam
mais biometano à porta.

## O que vem nos arquivos

O CSV traz uma linha por bacia com área em SP (`rede` = `ponto_entrega` ou `subestacao`): nome,
município e UF do ponto, operador, tensão (subestações), `em_sp`, coordenadas, `area_km2`,
`biometano_m3d` e por fonte, `fora_da_cana_m3d`, `km_medio` (distância média, ponderada pelo
potencial, das células da bacia ao ponto) e `pct_estado`. No GPKG da
[prancha 085](../085-biometano-ao-alcance-sp/README.md), as camadas `bacias_pontos_entrega` e
`bacias_subestacoes` têm os polígonos, com estilo graduado pelo biometano.

## Método

1. Pontos de entrega de gás e subestações da rede básica da EPE (na versão do MapBiomas), em SP e
   no entorno; pontos a menos de 100 m uns dos outros viram um só (55 pontos de entrega e 183
   subestações).
2. Polígonos de Voronoi num plano local (longitude escalada pelo cosseno da latitude média),
   recortados pelo limite de SP. A área dos polígonos confere com a da grade (247,3 mil km²).
3. Cada célula de cerca de 1 km do potencial distribuído (prancha 085) vai para o ponto mais
   próximo em linha reta; a bacia soma o potencial e a distância média ponderada.

## Limitações

- A bacia é geométrica: não sabe de estradas, de capacidade do ponto de entrega nem de contratos.
  Um ponto com bacia grande não está, por isso, apto a receber todo esse gás.
- Os pontos de entrega estão em fila nos gasodutos, por isso as bacias de gás viram faixas longas
  e a distância média chega a 100 km.
- Pontos do outro lado da divisa ficam com bacias em SP, mas o potencial do lado de lá não entra.
