---
numero: 29
titulo: "Rebanhos"
subtitulo: "Três rebanhos, três geografias"
data: 2026-10-29
categoria: energia
colecao: bioenergia-sp
tags: [bioenergia-sp, sao-paulo, pecuaria, bovinos, suinos, galinaceos, biogas, ibge, ppm]

contexto: >-
  Em 2024, São Paulo contava 10,8 milhões de bovinos, 1,5 milhão de suínos e 205 milhões de galináceos. Postos lado a lado, os três rebanhos ocupam o estado de jeitos diferentes: o boi se espalha pelo Oeste Paulista, com Presidente Bernardes (151.407 cabeças) e Mirante do Paranapanema (138.268) à frente; o porco se concentra em poucos polos, como Itu e Cerqueira César, cada um com mais de 100 mil cabeças; e as aves se aglomeram em granjas, com Bastos sozinho somando 13,7 milhões. Para quem pensa em biogás, a densidade conta mais que o total: muitos animais em pouca área concentram também o esterco. Segunda prancha da coleção «Bioenergia em SP».

imagem: ./mapa_preview.png
imagem_alt: "Quatro quadros do estado de São Paulo. Três mapas mostram os municípios coloridos pela densidade de bovinos, de suínos e de galináceos (cabeças por km², seis classes da paleta plasma, do amarelo ao azul-escuro), com os três maiores efetivos de cada rebanho nomeados; os municípios sem informação aparecem hachurados, quase todos na Grande São Paulo e na Baixada Santista. O quarto quadro traz o mapa de localização, a seta do norte em forma de folha e as notas de leitura."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Pesquisa da Pecuária Municipal (PPM), tabela 3939: efetivo dos rebanhos"
    nome_en: "IBGE — Municipal Livestock Survey (PPM), table 3939: herd size"
    url: https://sidra.ibge.gov.br/tabela/3939
    ano: 2024
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Efetivo de bovinos, suínos e galináceos da PPM 2024 juntado à Malha Municipal pelo código IBGE e dividido pela área do município; seis classes por quantis."

camadas:
  - { nome: municipios, tipo: poligono, descricao: "645 municípios: efetivo e densidade (cabeças/km²) de bovinos, suínos e galináceos", descricao_en: "645 municipalities: herd size and density (head/km²) of cattle, pigs and poultry" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Bovinos"
    rotulo_en: "Cattle"
    valor: 10756815
    unidade: "cabeças"
    unidade_en: "head"
    nota: "617 municípios com bovinos; maior efetivo: Presidente Bernardes (151.407)"
    nota_en: "617 municipalities with cattle; largest herd: Presidente Bernardes (151,407)"
  - tipo: numero
    rotulo: "Suínos"
    rotulo_en: "Pigs"
    valor: 1480785
    unidade: "cabeças"
    unidade_en: "head"
    nota: "584 municípios com suínos; maior efetivo: Itu (117.600)"
    nota_en: "584 municipalities with pigs; largest herd: Itu (117,600)"
  - tipo: numero
    rotulo: "Galináceos"
    rotulo_en: "Poultry"
    valor: 205018513
    unidade: "cabeças"
    unidade_en: "head"
    nota: "572 municípios com galináceos; maior efetivo: Bastos (13.650.920)"
    nota_en: "572 municipalities with poultry; largest flock: Bastos (13,650,920)"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-sp-2026/sp_rebanhos_2024.gpkg.zip
    rotulo: "Três camadas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Three layers, SIRGAS 2000, with QGIS styles"
    tamanho: "18,5 MB"
  - formato: csv
    arquivo: dados/sp_rebanhos_2024.csv
    rotulo: "Efetivo e densidade por município"
    rotulo_en: "Herd size and density by municipality"
    tamanho: "55 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-sp-2026/sp_rebanhos_2024_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-sp-2026/sp_rebanhos_2024_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "5,8 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

versao: "1.0.0"
discussoes: []
---

# Rebanhos — bovinos, suínos e galináceos em São Paulo, 2024

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 029, a segunda de quatro da coleção **Bioenergia em SP**: depois das usinas de
biogás, onde estão os animais cujo esterco pode alimentá-las.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `CD_MUN`, `NM_MUN`, região intermediária, `area_km2`, efetivo (`bovino`, `suino`, `galinaceos`) e densidade em cabeças/km² (`dens_bovino`, `dens_suino`, `dens_galinaceos`) |
| `regioes_intermediarias` | polígono | 11 regiões geográficas intermediárias |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `bioenergia-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/bioenergia-sp-2026)
do repositório, junto com os das outras pranchas da coleção.

O GPKG traz os **estilos do QGIS** gravados nas camadas. A camada `municipios` tem três:
`densidade_bovino` (o padrão, que abre ao arrastar o arquivo para o QGIS),
`densidade_suino` e `densidade_galinaceos`. Para trocar, abra as propriedades da camada e
escolha outro estilo em *Estilo › Estilos*. As classes e as cores são as da prancha; zero
aparece em cinza-claro e “sem informação” em branco, cada um com sua linha na legenda.

O **CSV** traz a mesma tabela dos municípios, em UTF-8, sem geometria. Nos dois arquivos,
célula vazia (NULL) quer dizer sem informação, e 0 quer dizer zero declarado pelo IBGE.

## Método

1. Tabela 3939 da Pesquisa da Pecuária Municipal no SIDRA: variável *Efetivo dos rebanhos*
   (cabeças, em 31 de dezembro de 2024), produtos *Bovino*, *Suíno – total* e
   *Galináceos – total*, nível município, estado de São Paulo.
2. Junção à Malha Municipal 2025 do IBGE pelo código de sete dígitos.
3. Densidade = efetivo ÷ área oficial do município (`area_km2`, da própria malha), com
   duas casas decimais.
4. Classes: seis quantis dos municípios com efetivo positivo, calculados separadamente para
   cada rebanho; os limites são arredondados a dois algarismos significativos, e o último é o
   máximo observado. O símbolo “-” da tabela (zero absoluto) vira 0; “...” (não disponível)
   e os municípios ausentes da tabela viram sem informação.
5. Regiões intermediárias e limite estadual obtidos por dissolução dos municípios.
6. Na prancha, as geometrias são simplificadas como cobertura; os arquivos para download
   mantêm a geometria original do IBGE.

## Limitações

- Os números de 2024 são **resultados preliminares** da PPM e podem ser revistos pelo IBGE.
- O efetivo é um retrato em 31 de dezembro, não o total abatido no ano. Na avicultura de
  corte, que faz vários lotes por ano, o retrato fica abaixo do número de aves que passam
  pela granja.
- A densidade usa a área total do município, não a área de pastagem ou de granja.
- 28 municípios ficam sem informação: 26 com “...” na tabela e 2 (Águas de São Pedro e São
  Caetano do Sul) ausentes dela. Quase todos estão na Grande São Paulo e na Baixada Santista.
- *Galináceos – total* soma galos, galinhas, frangas, frangos e pintos: aves de postura e de
  corte juntas.
