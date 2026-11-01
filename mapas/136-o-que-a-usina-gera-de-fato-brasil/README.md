---
numero: 136
titulo: "O que a usina gera de fato"
subtitulo: "A potência no papel e a energia que chega à rede"
data: 2026-12-16
rascunho: true
categoria: energia
colecao: ritmo-biomassa-br
tags: [ritmo-biomassa-br, brasil, biomassa, eletricidade, termeletricas, fator-de-capacidade, bagaco-de-cana, licor-negro, ons, aneel, siga]

contexto: >-
  Potência instalada não é energia gerada. As 37 usinas a biomassa que o ONS mede uma a uma somam 2,8 GW de potência fiscalizada no SIGA, mas entregaram em média 0,96 GW nos anos válidos de 2015 a 2024: um fator de capacidade de 36%. As 25 usinas de cana ficam em 30%, porque a caldeira para na entressafra; as quatro de celulose, que queimam licor negro o ano todo, chegam a 43%, e a Suzano, no Maranhão, a 72%, o maior fator entre as usinas de 100 MW ou mais. Na CMPC, em Guaíba (RS), o ONS registra só 3% da potência: é a maior distância entre o papel e a rede. Essas 37 usinas têm 16% da potência a biomassa em operação no país, e nenhuma das 55 usinas a biogás do SIGA aparece uma a uma no ONS.

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers com 37 usinas a biomassa medidas pelo ONS, cada uma desenhada como um anel e um disco: o anel tem a área da potência fiscalizada no SIGA, o disco a da geração média, e a cor do disco, de cinza-claro a azul-escuro, dá o fator de capacidade, de menos de 20% a 65% ou mais. Os anéis largos com discos pequenos se juntam em São Paulo, Goiás e Mato Grosso do Sul, as usinas de cana; os discos que quase enchem o anel, em azul-escuro, são as fábricas de celulose da Klabin, no Paraná, e da Suzano, no Maranhão. Quatro chamadas: a Klabin, com 330 MW de potência e 205 MW médios gerados; a CMPC, em Guaíba, com 265 MW e 8 MW, fator de 3%; a Suzano, com 72%; e as 25 usinas de cana, com 30%. No painel, os pontos do fator de cada usina por combustível, as barras da potência a biomassa de cada estado no SIGA contra a que o ONS mede e a gerada, e a chave de cores."

recorte: "Brasil"
fontes:
  - nome: "ONS — Geração por usina em base horária, dados abertos, 2015–2024"
    nome_en: "ONS — Hourly generation by plant, open data, 2015–2024"
    url: https://dados.ons.org.br/dataset/geracao-usina-2
    ano: "2015–2024"
  - nome: "ANEEL — Sistema de Informações de Geração (SIGA), empreendimentos de geração, dados abertos de 01/10/2026"
    nome_en: "ANEEL — Generation Information System (SIGA), generation projects, open data of 01/10/2026"
    url: https://dadosabertos.aneel.gov.br/dataset/siga-sistema-de-informacoes-de-geracao-da-aneel
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
software: ["Python", "pandas", "PyArrow", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Fator de capacidade de cada usina a biomassa que o ONS mede uma a uma: energia gerada nos anos válidos de 2015 a 2024 dividida pela potência fiscalizada no SIGA vezes as horas desses anos."

camadas:
  - { nome: usinas, tipo: ponto, cor: "#3f6f96", descricao: "37 usinas a biomassa do ONS com potência no SIGA: potência, geração média, fator de capacidade e anos usados", descricao_en: "37 ONS biomass plants with SIGA capacity: capacity, mean generation, capacity factor and years used" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 unidades da federação, com a potência a biomassa em operação no SIGA e a potência e a geração das usinas que o ONS mede", descricao_en: "27 states, with biomass capacity in operation in SIGA and the capacity and generation of the plants ONS measures" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Fator de capacidade das 37 usinas, somadas"
    rotulo_en: "Capacity factor of the 37 plants combined"
    valor: 35.8
    unidade: "%"
    nota: "2,8 GW de potência no SIGA, 0,96 GW médios gerados (ONS, 2015–2024)"
    nota_en: "2.8 GW of SIGA capacity, 0.96 average GW generated (ONS, 2015–2024)"
  - tipo: barras
    rotulo: "Fator de capacidade por combustível"
    rotulo_en: "Capacity factor by fuel"
    unidade: "%"
    itens:
      - { rotulo: "licor negro (4 usinas)", rotulo_en: "black liquor (4 plants)", valor: 42.7, cor: "#6b3d5c" }
      - { rotulo: "madeira (6 usinas)", rotulo_en: "wood (6 plants)", valor: 40.1, cor: "#2f5d3a" }
      - { rotulo: "bagaço de cana (25 usinas)", rotulo_en: "sugarcane bagasse (25 plants)", valor: 30.3, cor: "#c08a2e" }
      - { rotulo: "casca de arroz e outros (2 usinas)", rotulo_en: "rice husk and others (2 plants)", valor: 23.5, cor: "#7d8a3c" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/ritmo-biomassa-br-2026/br_biomassa_fator_de_capacidade.gpkg.zip
    rotulo: "Usinas, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Plants, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,1 MB"
  - formato: csv
    arquivo: dados/br_biomassa_fator_de_capacidade.csv
    rotulo: "As 37 usinas, com potência, geração e fator"
    rotulo_en: "All 37 plants, with capacity, generation and factor"
    tamanho: "9 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/ritmo-biomassa-br-2026/br_biomassa_fator_de_capacidade_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/ritmo-biomassa-br-2026/br_biomassa_fator_de_capacidade_prancha.en.svg
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

# O que a usina gera de fato: o fator de capacidade das usinas a biomassa no Brasil

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 136, a segunda da coleção **O ritmo da biomassa**. Depois do calendário, a conta: quanto
da potência registrada vira energia na rede ao longo do ano.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `usinas` | ponto | 37 usinas: `nome` (SIGA), `nome_ons`, `uf`, `municipio`, `regiao`, `combustivel` (SIGA), `grupo`, `combustivel_ons`, `modalidade` (de operação no ONS), `ceg_siga`, `posicao`, `anos_validos`, `anos`, `mw_instalado` (potência fiscalizada no SIGA), `mw_gerado` (MW médios nos anos válidos), `fator` (%), `classe`, `mw_mes_pico` (MW médios do mês mais alto do perfil), `pico_acima_da_potencia`, `fase_siga` |
| `ufs` | polígono | 27 unidades da federação: `siga_biomassa_mw` (potência a biomassa em operação no SIGA), `ons_usinas`, `ons_mw_instalado`, `ons_mw_gerado` |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `ritmo-biomassa-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/ritmo-biomassa-br-2026).
A camada `usinas` traz o **estilo do QGIS** da prancha. O **CSV** fica nesta pasta, em UTF-8, com a
tabela das usinas sem geometria.

## Método

1. As usinas, os anos válidos e a ligação com o SIGA são os da prancha 135: geração horária do ONS de
   2015 a 2024 (sem 2025 e sem outubro de 2021), usinas «Biomassa» e fábricas de celulose ligadas ao
   SIGA de 01/10/2026 pelo núcleo do CEG, anos com registro em todos os meses, geração em pelo menos
   seis e alguma variação, e pelo menos dois anos válidos e 1 MW médio por usina.
2. Ficam de fora os 14 conjuntos de usinas do ONS, que somam várias usinas sem uma potência única
   (693 MW médios gerados), e as usinas sem potência fiscalizada no SIGA.
3. Fator de capacidade = energia gerada nos anos válidos (MWh) ÷ (potência fiscalizada no SIGA em MW
   × horas desses anos). O fator de um grupo soma a energia e as potências × horas de todas as usinas
   dele, e assim pesa mais as maiores.
4. No mapa, o anel tem a área da potência e o disco a da geração média, na mesma escala; a cor do
   disco é a classe do fator (menos de 20%, 20 a 35%, 35 a 50%, 50 a 65% e 65% ou mais).
5. As barras por estado comparam a potência a biomassa em operação no SIGA (18,1 GW em 657 usinas)
   com a potência das usinas que o ONS mede e a geração média delas.

## Limitações

- O ONS mede uma a uma só parte das usinas a biomassa; as pequenas, que não despacha, ficam de fora.
  As 37 usinas da prancha têm 16% da potência a biomassa em operação no país, e nenhuma das 55
  usinas a biogás em operação no SIGA tem série própria no ONS.
- A potência é a fiscalizada no SIGA de 2026, comparada com a geração de 2015 a 2024; uma usina
  ampliada no período aparece com fator menor do que teve.
- A energia que a usina consome na própria indústria pode não aparecer nos dados do ONS. Pode ser o
  caso da CMPC, em Guaíba (RS), com fator de 3%, e da Barra Bioenergia (SP), também com 3%.
- Em duas usinas o mês mais alto do perfil passa da potência do SIGA (Cocal II, em Narandiba, SP,
  com fator de 88%, e Vale do Verdão, em Turvelândia, GO, com 64%): a potência registrada pode não
  ser a mesma unidade que o ONS mede. Ficam marcadas em `pico_acima_da_potencia`.
- 17 das 37 usinas têm só dois ou três anos válidos (coluna `anos_validos`).

## Licença dos dados

Dados abertos do ONS, da ANEEL e do IBGE, de uso livre com citação da fonte.
