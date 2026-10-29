---
numero: 38
titulo: "Unidades de conservação"
subtitulo: "Onde a floresta ainda guarda a nascente"
data: 2026-10-20
categoria: biomas
colecao: agua-sp
tags: [agua-sp, sao-paulo, unidades-de-conservacao, cnuc, protecao-integral, apa, bacias-hidrograficas, ugrhi]

contexto: >-
  No Litoral Norte, 73% da bacia está em unidades de proteção integral, a maior parte no Parque Estadual da Serra do Mar. No oeste do estado, três bacias — Baixo Tietê, São José dos Dourados e Baixo Pardo/Grande — não têm nenhuma. Somadas, as 270 unidades de conservação do CNUC em São Paulo cobrem 15,1% do território, mas só 4,0% em proteção integral; quase todo o resto são Áreas de Proteção Ambiental, que admitem ocupação com regras. Sobre as 22 bacias, o mapa mostra onde a floresta protegida ainda guarda as nascentes: na Serra do Mar e no Vale do Ribeira. Última prancha da coleção «Água em SP».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo em cinza-claro com as 22 UGRHIs contornadas em azul e numeradas. As unidades de proteção integral aparecem em verde-mata, concentradas na Serra do Mar e no Vale do Ribeira; as de uso sustentável, em verde-oliva; e as Áreas de Proteção Ambiental, hachuradas em ocre, espalhadas pelo centro e pelo leste. O oeste fica quase vazio. Uma chamada com seta aponta o Litoral Norte: 73% em proteção integral. No painel, barras horizontais ordenam as 22 bacias pela parte protegida, de 73% a zero."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "MMA — Cadastro Nacional de Unidades de Conservação (CNUC), na versão do GeoSEADE"
    nome_en: "MMA — National Register of Protected Areas (CNUC), as published by GeoSEADE"
    url: https://geo.seade.gov.br/
    ano: 2024
  - nome: "SEADE — GeoSEADE: Unidades de Gerenciamento de Recursos Hídricos (UGRHIs)"
    nome_en: "SEADE — GeoSEADE: Water Resources Management Units (UGRHIs)"
    url: https://geo.seade.gov.br/
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Unidades de conservação do CNUC recortadas pelo território paulista; áreas dissolvidas para não contar duas vezes as sobreposições e cruzadas com as 22 UGRHIs."

camadas:
  - { nome: unidades_conservacao, tipo: poligono, cor: "#2f5d3a", descricao: "270 unidades de conservação: categoria, grupo, esfera, ato de criação e área em SP", descricao_en: "270 protected areas: category, group, sphere, founding act and area in SP" }
  - { nome: ugrhi, tipo: poligono, cor: "#234e70", descricao: "22 UGRHIs com a área e a porcentagem em proteção integral e em qualquer unidade", descricao_en: "22 UGRHIs with the area and share under strict protection and in any protected area" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: barras
    rotulo: "Parte da bacia em proteção integral (as seis maiores)"
    rotulo_en: "Share of basin under strict protection (top six)"
    unidade: "%"
    itens:
      - { rotulo: "3 · Litoral Norte", valor: 73.45, cor: "#2f5d3a" }
      - { rotulo: "7 · Baixada Santista", valor: 44.83, cor: "#2f5d3a" }
      - { rotulo: "11 · Ribeira de Iguape/Litoral Sul", valor: 25.88, cor: "#2f5d3a" }
      - { rotulo: "1 · Mantiqueira", valor: 17.67, cor: "#2f5d3a" }
      - { rotulo: "6 · Alto Tietê", valor: 6.08, cor: "#2f5d3a" }
      - { rotulo: "2 · Paraíba do Sul", valor: 5.98, cor: "#2f5d3a" }
  - tipo: numero
    rotulo: "Território paulista em unidades de conservação"
    rotulo_en: "São Paulo’s territory in protected areas"
    valor: 15.1
    unidade: "%"
    nota: "4,0% em proteção integral; 51 APAs entre as 270 unidades"
    nota_en: "4.0% strictly protected; 51 APAs among the 270 units"

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/agua-sp-2026/sp_unidades_conservacao.gpkg.zip
    rotulo: "Três camadas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Three layers, SIRGAS 2000, with QGIS styles"
    tamanho: "5,6 MB"
  - formato: csv
    arquivo: dados/sp_unidades_conservacao.csv
    rotulo: "As 270 unidades, sem geometria"
    rotulo_en: "All 270 units, without geometry"
    tamanho: "73 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/agua-sp-2026/sp_unidades_conservacao_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/agua-sp-2026/sp_unidades_conservacao_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,6 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

doi_automatico: true
versao: "1.0.0"
doi: 10.5281/zenodo.23539373
discussoes: []
---

# Unidades de conservação sobre as bacias hidrográficas de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 038, a última de três da coleção **Água em SP**: depois das bacias e da drenagem,
quanto de cada bacia está protegido.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `unidades_conservacao` | polígono | 270 unidades: `cd_cnuc`, `nome_uc`, `nome_abrev`, `categoria`, `grupo`, `esfera`, `cria_ano`, `cria_ato`, `org_gestor`, `area_cnuc_ha` (área declarada no cadastro, inteira), `area_sp_km2` (parte em SP), `apa`, `grupo_mapa` |
| `ugrhi` | polígono | 22 UGRHIs: `km2_protecao_integral`, `km2_qualquer_uc`, `pct_protecao_integral`, `pct_qualquer_uc`, `ucs` (unidades que tocam a bacia) |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `agua-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/agua-sp-2026).
Os **estilos do QGIS** repetem a prancha: proteção integral em verde-mata, uso sustentável em
verde-oliva e APAs em palha translúcido, com as maiores por baixo. A camada `ugrhi` abre só com o
contorno e tem um segundo estilo, `protecao_integral`, que pinta as bacias pela porcentagem.

O **CSV** traz a tabela das 270 unidades, em UTF-8, sem geometria.

## Método

1. Unidades de conservação federais, estaduais e municipais, de proteção integral e de uso
   sustentável, do CNUC publicado pelo GeoSEADE (base de 2024): 270 unidades, todas ativas.
2. Cada polígono é corrigido, quando inválido, e recortado pelo território de São Paulo (limite
   da Malha Municipal 2025). Unidades que passam a divisa, como a APA da Serra da Mantiqueira,
   entram só com a parte paulista.
3. As áreas são dissolvidas antes de medir, para que unidades sobrepostas (um parque dentro de uma
   APA, por exemplo) não contem duas vezes. Áreas em km² na projeção cônica equivalente de Albers
   usada pelo IBGE.
4. A parte de cada UGRHI em proteção integral e em qualquer unidade é a área dissolvida dentro da
   bacia dividida pela área da bacia no território paulista.

## Limitações

- A parte marinha das unidades fica de fora: o recorte é o território dos municípios. As APAs
  Marinhas do Litoral Norte, Centro e Sul aparecem só com o que toca a terra.
- `area_cnuc_ha` é a área declarada no cadastro, para a unidade inteira; `area_sp_km2` é a medida
  aqui, só em São Paulo. As duas podem diferir.
- Reservas Particulares do Patrimônio Natural (84) são pequenas e quase não aparecem na escala da
  prancha, mas estão no GPKG.
- O CNUC depende do envio dos órgãos gestores: unidades municipais recentes podem faltar.
