---
numero: 148
titulo: "Gerar aqui, consumir lá"
subtitulo: "41% da potência a biogás abate a conta de outras unidades; na solar, 33%"
data: 2027-01-18
rascunho: true
categoria: energia
colecao: gd-biogas-br
tags: [gd-biogas-br, brasil, biogas, geracao-distribuida, autoconsumo-remoto, geracao-compartilhada, aneel]

contexto: >-
  Na geração distribuída, a energia não precisa ser usada onde é gerada: no autoconsumo remoto e na geração compartilhada, ela vira crédito na conta de outras unidades consumidoras da mesma distribuidora. O biogás usa mais esse caminho do que a solar. Das 529 usinas a biogás, 160 creditam outras unidades e somam 61,3 MW, 41% da potência a biogás; na solar, a parte é de 33%. A geração compartilhada, em que consórcios e cooperativas dividem a energia entre os associados, tem 18% do biogás e só 6,3% da solar. Ao todo, 25.619 unidades recebem crédito de usinas a biogás, e metade delas, 12.971, de cinco consórcios em Cariacica (ES). O registro diz quantas unidades recebem o crédito, mas não onde elas estão.

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers com as UFs pintadas em cinco tons de azul pela parte da potência a biogás da geração distribuída que credita outras unidades, do azul-gelo (nenhuma) ao azul-noite (75% ou mais); as UFs sem biogás ficam brancas. Maranhão, Espírito Santo e Paraná estão no tom mais escuro; Mato Grosso, Rondônia, Paraíba, Pernambuco e Tocantins no mais claro. Sobre o mapa, para cada município com usina, um anel preto proporcional à potência total a biogás e, dentro dele, um disco azul proporcional à parte que credita outras unidades. Duas chamadas: Cariacica (ES), com 12.971 unidades creditadas por cinco consórcios, e São Paulo, com 4.133 unidades creditadas por duas usinas comerciais. No painel, barras que comparam as modalidades do biogás e da solar, a lista dos municípios cujas usinas creditam mais unidades e uma nota de que o registro não diz onde ficam as unidades que recebem o crédito."

recorte: "Brasil"
fontes:
  - nome: "ANEEL — Relação de empreendimentos de geração distribuída (dados abertos, referência 10/2026)"
    nome_en: "ANEEL — List of distributed generation units (open data, reference 10/2026)"
    url: https://dadosabertos.aneel.gov.br/dataset/relacao-de-empreendimentos-de-geracao-distribuida
    ano: 2026
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
metodo: "Usinas a biogás da geração distribuída separadas pela modalidade do registro da ANEEL; a potência em autoconsumo remoto e em geração compartilhada foi somada por município da usina e por UF e comparada com a da solar."

camadas:
  - { nome: municipios, tipo: ponto, cor: "#234e70", descricao: "260 municípios com usina a biogás: potência total, na própria unidade, em autoconsumo remoto e compartilhada (kW), parte que credita outras unidades e unidades que recebem crédito", descricao_en: "260 municipalities with a biogas plant: total, on-site, remote self-consumption and shared capacity (kW), share credited elsewhere and units receiving credit" }
  - { nome: usinas, tipo: ponto, cor: "#6b3d5c", descricao: "529 usinas a biogás, no ponto do município, por modalidade", descricao_en: "529 biogas plants, at the municipality’s point, by modality" }
  - { nome: ufs, tipo: poligono, cor: "#3d6e93", descricao: "27 unidades da federação: potência a biogás, parte que credita outras unidades e unidades que recebem crédito", descricao_en: "27 states: biogas capacity, share credited elsewhere and units receiving credit" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Potência a biogás que credita outras unidades"
    rotulo_en: "Biogas capacity credited to other units"
    valor: 41
    unidade: "%"
    nota: "61,3 MW em 160 usinas; na solar, 33%"
    nota_en: "61.3 MW in 160 plants; for solar, 33%"
  - tipo: barras
    rotulo: "Potência a biogás por modalidade"
    rotulo_en: "Biogas capacity by modality"
    unidade: "MW"
    itens:
      - { rotulo: "na própria unidade", rotulo_en: "on site", valor: 89.2, cor: "#b3bac1" }
      - { rotulo: "autoconsumo remoto", rotulo_en: "remote self-consumption", valor: 33.8, cor: "#234e70" }
      - { rotulo: "geração compartilhada", rotulo_en: "shared generation", valor: 27.5, cor: "#6b3d5c" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/gd-biogas-br-2026/br_gd_biogas_credito_remoto.gpkg.zip
    rotulo: "Municípios, usinas, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities, plants, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,2 MB"
  - formato: csv
    arquivo: dados/br_gd_biogas_credito_remoto.csv
    rotulo: "Os 260 municípios, com a potência por modalidade"
    rotulo_en: "The 260 municipalities, with capacity by modality"
    tamanho: "0,02 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/gd-biogas-br-2026/br_gd_biogas_credito_remoto_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/gd-biogas-br-2026/br_gd_biogas_credito_remoto_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "3,3 MB"
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

# Gerar aqui, consumir lá: o crédito remoto do biogás na geração distribuída

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 148, a segunda da coleção **O biogás na geração distribuída**. A usina a biogás nem
sempre abate a conta de quem a hospeda: em quatro de cada dez quilowatts, a energia vira crédito
em outras unidades, às vezes centenas delas, de uma mesma empresa ou dos associados de um consórcio.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | ponto | 260 municípios: `n_usinas`, `kw_total`, `kw_propria`, `kw_remoto`, `kw_compartilhada`, `kw_fora` (remoto + compartilhada), `pct_fora`, `uc_credito_fora` (unidades que recebem crédito das usinas remotas e compartilhadas) |
| `usinas` | ponto | 529 usinas, com os mesmos campos da prancha 147 (`modalidade`, `uc_credito`, `titular`…) |
| `ufs` | polígono | 27 UFs: `usinas_biogas`, `kw_biogas`, `kw_fora`, `pct_fora`, `uc_credito_fora`, `classe` |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `gd-biogas-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/gd-biogas-br-2026),
com o **estilo do QGIS** da prancha nas camadas `ufs` e `municipios` (disco da potência que credita
outras unidades; o anel da potência total é um estilo alternativo). O **CSV** fica nesta pasta, em
UTF-8, com a tabela dos municípios sem geometria.

## Método

1. As 529 usinas a biogás da prancha 147, do registro de geração distribuída da ANEEL (referência
   10/2026).
2. A modalidade é a do registro (`DscModalidadeHabilitado`): «Geracao na propria UC» (na própria
   unidade), «Auto consumo remoto» e «Compartilhada». «Condomínio» (múltiplas unidades) só aparece
   em usinas solares.
3. «Credita outras unidades» soma o autoconsumo remoto e a geração compartilhada. A parte é a da
   potência instalada, não da energia.
4. A comparação com a solar usa todas as 4.665.874 usinas fotovoltaicas do mesmo registro (53,8 GW).
   507 delas, 16 MW, vêm sem modalidade e ficam no denominador.
5. As unidades que recebem crédito são o campo `QtdUCRecebeCredito`. Nas usinas que geram na
   própria unidade, ele vale 1 e não entra na conta.
6. As UFs ganharam cinco classes pela parte da potência a biogás que credita outras unidades:
   nenhuma, até 25%, 25 a 50%, 50 a 75% e 75% ou mais.

## Limitações

- O registro não traz a localização das unidades que recebem o crédito, só quantas são. A regra
  exige que estejam na área de concessão da mesma distribuidora, mas a distância real entre usina e
  consumo não pode ser medida com estes dados.
- A classe de consumo é a da unidade onde a usina se liga: das 160 usinas remotas e compartilhadas,
  as comerciais têm 33,8 MW, 55% da potência, mas as unidades creditadas podem ser de outra classe.
- Potência instalada não é energia gerada; a parte da energia creditada fora pode ser outra.
- Com poucas usinas, a parte de uma UF muda muito com uma só: o Maranhão tem quatro, todas
  compartilhadas.

## Licença dos dados

Dados abertos da ANEEL e do IBGE, de uso livre com citação da fonte.
