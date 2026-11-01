---
numero: 147
titulo: "Onde o biogás entra na rede"
subtitulo: "529 pequenas usinas, 150,6 MW: 0,28% da geração distribuída do país"
data: 2027-01-15
rascunho: true
categoria: energia
colecao: gd-biogas-br
tags: [gd-biogas-br, brasil, biogas, geracao-distribuida, micro-e-minigeracao, aneel, municipios]

contexto: >-
  A geração distribuída brasileira tem 4,67 milhões de usinas e 54,1 GW, e 99,4% dessa potência é solar. O biogás é uma fração pequena dela: 529 usinas e 150,6 MW, 0,28% do total, em 260 municípios de 16 UFs. Quase três quartos dessas usinas, 393, estão ligadas a unidades rurais, quase sempre pequenas; a mediana é de 75 kW. Mas 85% da potência está nas 212 usinas de minigeração, acima de 75 kW, e as 118 usinas comerciais e industriais somam 94,7 MW. Minas Gerais tem 209 usinas, 40% do total, e Pará de Minas sozinha tem 30, todas rurais. A capital paulista tem a maior potência municipal, 8,1 MW em duas usinas.

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers com 260 círculos, um por município com geração distribuída a biogás, de tamanho proporcional à potência instalada e cor da classe de consumo com mais kW no município: verde-oliva para rural, azul para comercial, vermelho-tijolo para industrial e ocre-claro para poder público e residencial. Os círculos verdes, pequenos, se espalham por Minas Gerais, oeste do Paraná, Santa Catarina, Goiás e Mato Grosso; os azuis e vermelhos, maiores, ficam perto das capitais do Sudeste, no Maranhão, na Paraíba e em Rondônia. A Amazônia e quase todo o Nordeste ficam vazios. Duas chamadas: Pará de Minas (MG), com 30 usinas rurais, e São Paulo, com 8,1 MW em duas usinas. No painel, a potência e o número de usinas por classe de consumo, as seis UFs com mais potência e a fonte do biogás como declarada no registro."

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
metodo: "Usinas de micro e minigeração distribuída do registro da ANEEL com fonte declarada de biogás, somadas por município, desenhadas no ponto interno do município com círculo proporcional à potência instalada e cor da classe de consumo com mais kW."

camadas:
  - { nome: municipios, tipo: ponto, cor: "#6f7d2e", descricao: "260 municípios: número de usinas, potência total e por classe de consumo (kW), classe dominante e data da atualização cadastral mais antiga", descricao_en: "260 municipalities: number of plants, total capacity and capacity by consumer class (kW), dominant class and date of the earliest registry update" }
  - { nome: usinas, tipo: ponto, cor: "#234e70", descricao: "529 usinas a biogás, no ponto do município: classe, fonte, modalidade, porte, potência, unidades que recebem crédito e data da última atualização cadastral", descricao_en: "529 biogas plants, at the municipality’s point: class, fuel, modality, size, capacity, units receiving credit and date of last registry update" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 unidades da federação, com usinas e potência a biogás", descricao_en: "27 states, with biogas plants and capacity" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Potência a biogás na geração distribuída"
    rotulo_en: "Biogas capacity in distributed generation"
    valor: 150.6
    unidade: "MW"
    nota: "529 usinas, 0,28% da potência da GD do país"
    nota_en: "529 plants, 0.28% of national DG capacity"
  - tipo: barras
    rotulo: "Potência por classe de consumo"
    rotulo_en: "Capacity by consumer class"
    unidade: "MW"
    itens:
      - { rotulo: "comercial", rotulo_en: "commercial", valor: 60.7, cor: "#234e70" }
      - { rotulo: "rural", rotulo_en: "rural", valor: 49.3, cor: "#6f7d2e" }
      - { rotulo: "industrial", rotulo_en: "industrial", valor: 34.0, cor: "#9c4a32" }
      - { rotulo: "poder público e residencial", rotulo_en: "public and residential", valor: 6.6, cor: "#b3a06a" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/gd-biogas-br-2026/br_gd_biogas_municipios.gpkg.zip
    rotulo: "Municípios, usinas, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities, plants, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,2 MB"
  - formato: csv
    arquivo: dados/br_gd_biogas_municipios.csv
    rotulo: "Os 260 municípios com geração distribuída a biogás"
    rotulo_en: "The 260 municipalities with biogas distributed generation"
    tamanho: "0,03 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/gd-biogas-br-2026/br_gd_biogas_municipios_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/gd-biogas-br-2026/br_gd_biogas_municipios_prancha.en.svg
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

# Onde o biogás entra na rede: geração distribuída a biogás no Brasil

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 147, a primeira da coleção **O biogás na geração distribuída**. A geração distribuída
são as usinas pequenas, de até 5 MW, ligadas à rede da distribuidora para abater a conta de luz de
quem as instala. A prancha 044 mostrou a solar, que é quase tudo; esta separa o biogás, que é
pouco, mas está em outro lugar: nas granjas e laticínios do interior e em algumas usinas grandes de
empresas.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | ponto | 260 municípios: `n_usinas`, `kw_total`, `kw_rural`, `kw_comercial`, `kw_industrial`, `kw_outras`, `classe_dominante`, `classes` (quantas classes há no município), `primeira_atualizacao` (atualização cadastral mais antiga entre as usinas) |
| `usinas` | ponto | 529 usinas: `cod_empreendimento`, `classe_consumo` (como no registro), `classe`, `subgrupo`, `tipo_titular` (PF ou PJ), `titular` (pessoa física vem mascarada como «***»), `fonte_registro`, `fonte`, `modalidade_registro`, `modalidade`, `porte`, `kw`, `uc_credito`, `data_atualizacao`, `ano` |
| `ufs` | polígono | 27 unidades da federação, com `usinas_biogas` e `kw_biogas` |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `gd-biogas-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/gd-biogas-br-2026).
As camadas `municipios` e `usinas` trazem o **estilo do QGIS** da prancha, com círculos
proporcionais à potência. O **CSV** fica nesta pasta, em UTF-8, com a tabela dos municípios sem
geometria.

## Método

1. Relação de empreendimentos de geração distribuída da ANEEL (dados abertos, referência 10/2026,
   gerada em 10/10/2026): 4.666.785 usinas e 54,1 GW. O arquivo, em UTF-8 e separado por ponto e
   vírgula, traz uma linha por usina, com município, classe de consumo, modalidade, fonte, porte e
   potência instalada.
2. Biogás é a fonte declarada (`DscFonteGeracao`) «Biogás - RA» (resíduos animais), «Biogás - RU»
   (resíduos urbanos), «Biogás-AGR» (agroindustrial) e «Biogás - Floresta» (florestal): 529 usinas.
3. A potência foi somada por município (código do IBGE do registro). O registro não traz a
   coordenada da usina: o círculo fica no ponto interno do município.
4. A cor é a classe de consumo com mais kW no município. Em 27 dos 260 municípios há mais de uma
   classe; as colunas `kw_*` trazem a divisão.
5. A parcela do país compara com a potência de todas as usinas do registro (54,1 GW).

## Limitações

- Potência instalada não é energia gerada: o registro não diz quanto cada usina produz.
- A fonte do biogás é a declarada no cadastro e nem sempre bate com a atividade: 67 usinas ligadas
  a unidades rurais aparecem com «resíduos urbanos». Por isso a prancha colore pela classe de
  consumo, e não pela fonte.
- O registro é uma foto das usinas cadastradas em 10/2026; usinas desligadas não aparecem.
- A classe de consumo é a da unidade onde a usina se liga, não necessariamente a de quem recebe o
  crédito (ver a prancha 148).
- A prancha não estima potencial de biogás: mostra só o que está ligado à rede.

## Licença dos dados

Dados abertos da ANEEL e do IBGE, de uso livre com citação da fonte.
