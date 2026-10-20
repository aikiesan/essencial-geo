---
numero: 48
titulo: "Milho e soja"
subtitulo: "A soja passou o milho, e a palha ficou no chão"
data: 2026-10-20
categoria: uso-do-solo
colecao: agro-sp
tags: [agro-sp, sao-paulo, soja, milho, graos, agricultura, biometano, cp2b, ibge, pam]

contexto: >-
  Em 2008, São Paulo colheu 525.940 hectares de soja e 965.907 de milho. Em 2024, 1,36 milhão de hectares de soja, 2,6 vezes mais, e 723.128 de milho, 25% menos; a soja passou o milho em 2017. Ela se espalhou de 304 para 483 municípios e cresceu sobretudo no sul do estado. Na região de Sorocaba, a área foi de 82 mil para 468 mil hectares, e Itapeva é o maior produtor dos dois grãos. Em Ibirarema e Salto Grande, a soja colhida cobre quase dois terços do município. As palhas dos dois grãos dariam 1,03 milhão de m³ de biometano por dia no método CP2B, 41% delas na região de Sorocaba. É o que sobra depois de deixar no campo a parte que protege o solo. Quarta prancha da coleção «Do campo ao biometano».

imagem: ./mapa_preview.png
imagem_alt: "Três mapas do estado de São Paulo e um gráfico. O primeiro mostra a área colhida de soja em 2024 como parte do território, em seis classes do creme ao marrom; o marrom-escuro cobre o sudoeste, o sul e o nordeste do estado. O segundo mostra o milho, do amarelo-claro ao verde-oliva, mais escuro no sudoeste e no sul. O terceiro mostra, em azul-petróleo, o biometano que as palhas de milho e soja dariam por dia, com Itapeva e Buri nomeados no sudoeste. No quarto quadro, duas linhas de 2008 a 2024: a da soja sobe de cerca de 500 mil para 1,36 milhão de hectares e cruza a do milho, que oscila em torno de 800 mil, em 2017, marcado com um círculo."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Produção Agrícola Municipal (PAM), tabela 1612: lavouras temporárias"
    nome_en: "IBGE — Municipal Agricultural Production (PAM), table 1612: temporary crops"
    url: https://sidra.ibge.gov.br/tabela/1612
    ano: "2008 a 2024"
  - nome: "CP2B (Unicamp) — potencial de biogás e biometano por município, método v5.1"
    nome_en: "CP2B (Unicamp) — biogas and biomethane potential by municipality, method v5.1"
    ano: 2026
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Área colhida de soja e de milho da PAM 2024 dividida pela área do município, em seis classes por quantis; potencial de biometano das palhas no nível acessível do método CP2B, em seis classes por quantis."

camadas:
  - { nome: municipios, tipo: poligono, descricao: "645 municípios: área colhida e produção de soja e milho em 2008 e 2024, parte do território em 2024 (%) e biometano das palhas (m³/dia)", descricao_en: "645 municipalities: harvested area and production of soybean and maize in 2008 and 2024, share of territory in 2024 (%) and straw biomethane (m³/day)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Área colhida de soja em 2024"
    rotulo_en: "Harvested soybean area in 2024"
    valor: 1355595
    unidade: "ha"
    nota: "Eram 525.940 ha em 2008; o milho caiu de 965.907 para 723.128 ha"
    nota_en: "It was 525,940 ha in 2008; maize fell from 965,907 to 723,128 ha"
  - tipo: numero
    rotulo: "Biometano das palhas de milho e soja"
    rotulo_en: "Biomethane from maize and soybean straw"
    valor: 1031325
    unidade: "m³/dia"
    unidade_en: "m³/day"
    nota: "Nível acessível do método CP2B, cenário de referência: 528.467 do milho e 502.858 da soja"
    nota_en: "Accessible level of the CP2B method, reference scenario: 528,467 from maize and 502,858 from soybean"
  - tipo: barras
    rotulo: "Maiores produtores de soja em 2024"
    rotulo_en: "Largest soybean growers in 2024"
    unidade: "t"
    itens:
      - { rotulo: "Itapeva", valor: 241819, cor: "#6b4a1a" }
      - { rotulo: "Capão Bonito", valor: 130500, cor: "#6b4a1a" }
      - { rotulo: "Buri", valor: 126558, cor: "#6b4a1a" }
      - { rotulo: "Itaberá", valor: 103650, cor: "#6b4a1a" }
      - { rotulo: "Itapetininga", valor: 99000, cor: "#6b4a1a" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/agro-sp-2026/sp_milho_soja_2024.gpkg.zip
    rotulo: "Três camadas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Three layers, SIRGAS 2000, with QGIS styles"
    tamanho: "18,5 MB"
  - formato: csv
    arquivo: dados/sp_milho_soja_2024.csv
    rotulo: "Soja e milho em 2008 e 2024 e biometano das palhas por município"
    rotulo_en: "Soybean and maize in 2008 and 2024 and straw biomethane by municipality"
    tamanho: "77 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/agro-sp-2026/sp_milho_soja_2024_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/agro-sp-2026/sp_milho_soja_2024_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "5,8 MB"
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

# Milho e soja em São Paulo, 2024, e o biometano das palhas

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 048, a quarta de seis da coleção **Do campo ao biometano**: os dois grãos que dividem
o sul do estado, e a palha que fica no campo depois da colheita.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `CD_MUN`, `NM_MUN`, região intermediária, `area_km2`; para `soja` e `milho`, área colhida (`_area_2008_ha`, `_area_2024_ha`) e produção (`_producao_2008_t`, `_producao_2024_t`); `soja_pct` e `milho_pct` (área colhida em 2024 ÷ área do município, em %); `palha_milho_m3_dia`, `palha_soja_m3_dia` e `palhas_m3_dia` |
| `regioes_intermediarias` | polígono | 11 regiões geográficas intermediárias |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `agro-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/agro-sp-2026).
A camada `municipios` traz os três **estilos do QGIS** da prancha: `soja` (o padrão), `milho` e
`palhas`.

O **CSV** traz a mesma tabela, em UTF-8, sem geometria. Célula vazia quer dizer sem informação;
0 quer dizer zero.

## Método

1. Tabela 1612 da Produção Agrícola Municipal no SIDRA: *Área colhida* e *Quantidade produzida*,
   produtos *Soja (em grão)* e *Milho (em grão)*, anos 2008 a 2024, nível município, estado de
   São Paulo. O milho soma as duas safras do ano.
2. Parte do território = área colhida em 2024 ÷ (área do município × 100), em %, em seis classes
   por quantis dos municípios com área positiva.
3. Palhas: potencial dos substratos *palha de milho* e *palha de soja* no método CP2B v5.1
   (Unicamp, versão de 24/09/2026), cenário de referência, nível N4 (acessível), em m³ de
   biometano equivalente por dia, em seis classes por quantis.
4. O gráfico do quarto quadro soma a área colhida do estado ano a ano; o círculo marca o
   primeiro ano em que a soja superou o milho.

## Limitações

- O potencial do CP2B é modelado: parte da palha que a colheita deixa, desconta a fração que
  precisa ficar sobre o solo e o que se perde na coleta, e considera a distância até onde o gás
  seria produzido. Em 108 municípios, as palhas dão zero no nível acessível.
- A colheita de soja de 2024 foi de 3,63 milhões de toneladas, 27% abaixo da de 2023; o mapa
  mostra área colhida, que oscila menos que a produção de um ano para o outro.
- 45 municípios ficam sem informação na PAM de 2024, a maioria na Grande São Paulo e no litoral.
- Área colhida de soja e de milho pode se sobrepor: o mesmo talhão pode dar soja no verão e milho
  na segunda safra.

## Licença dos dados

Dados abertos do IBGE, de uso livre com citação da fonte. O potencial do CP2B (Unicamp) é
publicado aqui com autorização do centro; cite «CP2B (Unicamp), método v5.1, 2026».
