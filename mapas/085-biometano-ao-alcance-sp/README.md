---
numero: 85
titulo: "Biometano a 30 km"
subtitulo: "Num raio de caminhão, três quartos do estado juntam gás para uma planta"
data: 2026-12-15
categoria: energia
colecao: suprimento-sp
tags: [suprimento-sp, sao-paulo, biometano, biogas, cp2b, mapbiomas, raio-de-coleta, logistica]

contexto: >-
  Uma planta de biometano precisa de resíduo a uma distância que o caminhão pague. Somando o potencial do CP2B a até 30 km de cada ponto do estado, 73% da área de São Paulo junta 60 mil m³ por dia ou mais, a mediana das nove plantas paulistas autorizadas pela ANP. Quase tudo é cana: sem ela, só 17% da área chega lá. O máximo fica em Sertãozinho, com 1,06 milhão de m³ por dia a 30 km, 98% da cana. Fora dela, os maiores alcances são o lixo, a poda e o esgoto da capital (206 mil), os dejetos em torno de Cesário Lange (155 mil) e as outras lavouras de Itapeva (107 mil). Só 13% da área, sobretudo no Vale do Ribeira, no litoral e no Vale do Paraíba, junta menos de 10 mil. Primeira prancha da coleção «Bacias de suprimento».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo em verdes contínuos: quanto mais escuro, mais biometano a até 30 km de cada ponto. Quase todo o interior passa de 60 mil m³ por dia, com o verde mais escuro no nordeste, em torno de Sertãozinho; o Vale do Ribeira, o litoral, o Vale do Paraíba e a ponta oeste ficam em bege claro. Uma chamada aponta Sertãozinho, com 1,06 milhão de m³ por dia; outra, a capital, com 206 mil de lixo, poda e esgoto; outra, Itapeva, com 107 mil de outras lavouras. No painel, barras com a parte da área que junta 60 mil m³ por dia em cada fonte."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "CP2B (Unicamp) — potencial de biogás e biometano por município, método v5.1"
    nome_en: "CP2B (Unicamp) — biogas and biomethane potential by municipality, method v5.1"
    ano: 2026
  - nome: "MapBiomas — Coleção 10 da Série Anual de Mapas de Uso e Cobertura da Terra do Brasil, 2024"
    nome_en: "MapBiomas — Collection 10 of the Annual Series of Land Use and Land Cover Maps of Brazil, 2024"
    url: https://brasil.mapbiomas.org/colecoes-mapbiomas/
    ano: 2024
  - nome: "ANP — Biometano: instalações autorizadas (abril de 2026), para o porte de referência"
    nome_en: "ANP — Biomethane: authorised plants (April 2026), for the reference size"
    url: https://www.gov.br/anp/pt-br/assuntos/producao-e-fornecimento-de-biocombustiveis/biometano
    ano: 2026
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Node.js", "d3-geo", "QGIS"]
metodo: "Potencial de biometano do CP2B (v5.1, nível N4, cenário de referência) espalhado dentro de cada município pelo uso da terra que gera cada resíduo (MapBiomas 2024), somado em células de cerca de 1 km e, depois, num disco de 30 km em linha reta em torno de cada célula."

camadas:
  - { nome: grade, tipo: poligono, cor: "#5f8a52", descricao: "12.187 células de cerca de 4,5 km: potencial na célula por fonte e por km², biometano a até 30 km (total, por fonte e fora da cana), distância e nome do ponto de entrega e da subestação mais próximos, municípios com usina a até 30 km", descricao_en: "12,187 cells of about 4.5 km: potential in the cell by source and per km², biomethane within 30 km (total, by source and outside cane), distance to and name of the nearest delivery point and substation, municipalities with a plant within 30 km" }
  - { nome: bacias_pontos_entrega, tipo: poligono, cor: "#7f9d63", descricao: "43 bacias de pontos de entrega de gás com área em SP (prancha 087)", descricao_en: "43 gas delivery point catchments with area in SP (plate 087)" }
  - { nome: bacias_subestacoes, tipo: poligono, cor: "#7f9d63", descricao: "110 bacias de subestações da rede básica com área em SP (prancha 087)", descricao_en: "110 basic-grid substation catchments with area in SP (plate 087)" }
  - { nome: pontos_entrega, tipo: ponto, cor: "#6b3d5c", descricao: "55 pontos de entrega de gás existentes, depois de juntar os repetidos", descricao_en: "55 existing gas delivery points, after merging duplicates" }
  - { nome: subestacoes, tipo: ponto, cor: "#1a1c1e", descricao: "183 subestações da rede básica, depois de juntar as repetidas", descricao_en: "183 basic-grid substations, after merging duplicates" }
  - { nome: usinas, tipo: ponto, cor: "#234e70", descricao: "28 municípios com planta de biometano da ANP ou GD a biogás da ANEEL (prancha 088)", descricao_en: "28 municipalities with an ANP biomethane plant or ANEEL biogas DG (plate 088)" }
  - { nome: gasodutos_transporte, tipo: linha, cor: "#6b3d5c", descricao: "Gasodutos de transporte existentes", descricao_en: "Existing transmission gas pipelines" }

indicadores:
  - tipo: proporcao
    rotulo: "Área do estado pelo biometano a até 30 km"
    rotulo_en: "State area by biomethane within 30 km"
    unidade: "km²"
    unidade_en: "km²"
    itens:
      - { rotulo: "menos de 10 mil m³/dia", rotulo_en: "under 10,000 m³/day", valor: 32179, cor: "#f4f2ea" }
      - { rotulo: "10 a 30 mil", rotulo_en: "10,000 to 30,000", valor: 19178, cor: "#e7e3d2" }
      - { rotulo: "30 a 60 mil", rotulo_en: "30,000 to 60,000", valor: 16011, cor: "#d8d1b6" }
      - { rotulo: "60 a 100 mil", rotulo_en: "60,000 to 100,000", valor: 24516, cor: "#b9c79a" }
      - { rotulo: "100 a 300 mil", rotulo_en: "100,000 to 300,000", valor: 101326, cor: "#8fab72" }
      - { rotulo: "300 a 600 mil", rotulo_en: "300,000 to 600,000", valor: 49709, cor: "#5f8a52" }
      - { rotulo: "mais de 600 mil", rotulo_en: "over 600,000", valor: 4812, cor: "#33603a" }
  - tipo: numero
    rotulo: "Área que junta 60 mil m³/dia a 30 km sem contar a cana"
    rotulo_en: "Area gathering 60,000 m³/day within 30 km leaving cane out"
    valor: 17.2
    unidade: "%"
    nota: "42.633 de 247.731 km²"
    nota_en: "42,633 of 247,731 km²"
  - tipo: numero
    rotulo: "Maior alcance de 30 km (Sertãozinho)"
    rotulo_en: "Largest 30 km catchment (Sertãozinho)"
    valor: 1.06
    unidade: "milhão de m³/dia"
    unidade_en: "million m³/day"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/suprimento-sp-2026/sp_suprimento_biometano.gpkg.zip
    rotulo: "Grade, bacias, pontos de entrega, subestações e usinas (pranchas 085 a 088), SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Grid, catchments, delivery points, substations and plants (plates 085 to 088), SIRGAS 2000, with QGIS styles"
    tamanho: "1,2 MB"
  - formato: csv
    arquivo: dados/sp_biometano_alcance_30km_municipios.csv
    rotulo: "Tabela dos municípios: potencial, alcance de 30 km e distâncias"
    rotulo_en: "Municipal table: potential, 30 km catchment and distances"
    tamanho: "54 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/suprimento-sp-2026/sp_biometano_alcance_30km_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/suprimento-sp-2026/sp_biometano_alcance_30km_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,3 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,2 MB"

versao: "1.0.0"
discussoes: []
---

# Biometano a 30 km em São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 085, a primeira de quatro da coleção **Bacias de suprimento**, que olha o potencial de
biometano do jeito das curvas de oferta por condado do *Billion-Ton Report* (DOE, EUA) e da análise
de custo e oferta do S2Biom (UE): não por município, mas pelo que um caminhão consegue juntar. A
densidade do potencial e a fonte principal de cada município estão nas pranchas
[055](../055-densidade-do-biometano-sp/README.md) e [056](../056-alem-da-cana-sp/README.md).

## O que vem nos arquivos

O GPKG serve às quatro pranchas da coleção. A camada `grade` traz, para cada célula de cerca de
4,5 km, o potencial na célula (`biometano_m3d`, por fonte em `cana_m3d`, `lavouras_m3d`,
`pecuaria_m3d`, `urbano_m3d`, e `m3d_por_km2`) e o que há a até 30 km do seu centro
(`alcance30_m3d`, `alcance30_<fonte>_m3d`, `alcance30_fora_da_cana_m3d`). O estilo padrão do QGIS
repete as classes desta prancha. O CSV traz, por município, o potencial, o alcance de 30 km no
ponto interno e o máximo dentro do município (`alcance30_max_m3d`), a parte da área que junta
60 mil m³/dia (`pct_area_alcance_ref`) e as distâncias usadas nas pranchas 086 e 088.

## Método

1. Potencial do CP2B (método v5.1, nível N4, acessível, cenário de referência) por município e por
   substrato, em quatro grupos: cana-de-açúcar; outras lavouras; dejetos animais; lixo, poda e esgoto.
2. Distribuição dasimétrica: dentro de cada município, cada grupo vai para os pixels de 30 m do
   MapBiomas 2024 (reamostrados a cerca de 120 m) da classe que o produz: cana (classe 20); lavouras
   temporárias, café e citros (39, 40, 41, 62, 46, 47); pastagem e mosaico de usos para os dejetos
   (15, 21); área urbana para lixo, poda e esgoto (24). Se o município não tem a classe, o potencial
   se espalha por todo ele.
3. Soma em células de 10 × 10 pixels (cerca de 1,1 × 1,2 km) e, para cada célula, soma das células a
   até 30 km em linha reta do seu centro.
4. Porte de referência: 60 mil m³/dia, a mediana arredondada da capacidade autorizada das nove
   plantas de biometano paulistas que informaram produção à ANP em abril de 2026 (de 24 a 130 mil).

## Limitações

- Os 30 km são em linha reta; pela estrada, o raio efetivo é menor. O raio é uma convenção de
  leitura, não um custo de frete calculado.
- O CP2B cobre só SP: perto da divisa, o resíduo do outro lado não entra e o alcance fica menor.
- O nível N4 já desconta usos existentes do resíduo, mas não as plantas em operação: quem já
  coleta num raio aparece na prancha 088.
- A distribuição dentro do município segue o uso da terra, não a localização das usinas, granjas
  ou aterros; dentro de cada município, o desenho é uma estimativa.
- 0,1% do potencial de outras lavouras (1,2 mil m³/dia) caiu em municípios sem a classe e foi
  espalhado por todo o município.
