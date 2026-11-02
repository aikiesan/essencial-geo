---
numero: 140
titulo: "Os aterros que já acendem a luz"
subtitulo: "Só 6 dos 301 municípios com aterro queimam o gás do lixo para gerar eletricidade"
data: 2026-12-28
rascunho: true
categoria: energia
colecao: lixo-sp
tags: [lixo-sp, sao-paulo, residuos-solidos, aterros, biogas, eletricidade, termeletricas, cetesb, aneel, siga]

contexto: >-
  Dos 301 municípios paulistas com aterro em uso em 2023, seis têm usina a biogás de lixo em operação no SIGA da ANEEL: São Paulo, Caieiras, Santana de Parnaíba, Guatapará, Tremembé e Catanduva. Para eles vão 41,9% do lixo do estado. O estado tem 10 usinas a biogás de lixo em operação, com 78,6 MW; 74,5 MW ficam nesses seis, a maior parte em Caieiras (29,5 MW, Termoverde) e na capital (29,3 MW, São João e Bandeirantes). As outras três, com 4,1 MW, estão em Carapicuíba, Ribeirão Preto e Barueri, sem aterro em uso. Outras três, com 10,5 MW, aparecem no SIGA com outro combustível de lixo: Veolia Iperó, Cdr Pedreira I (capital) e USITRAR (Cabreúva). Os maiores destinos de lixo sem usina em operação são Paulínia, com 2.621 t/dia de 30 municípios, Mauá, Guarulhos, Santos e Jambeiro.

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com um círculo na sede de cada um dos 301 municípios com aterro em uso, de tamanho proporcional ao lixo recebido por dia: azul nos seis que têm usina a biogás de lixo em operação, cinza nos demais. Anéis abertos marcam as 13 usinas a lixo em operação no SIGA da ANEEL: azuis as de biogás, grafite as registradas com outro combustível de lixo. Rótulos dão o município e a potência: Caieiras com 29,5 MW, São Paulo com 29,3 MW mais 3,1 MW de outro combustível de lixo, Guatapará com 5,7 MW, Santana de Parnaíba e Tremembé com 4,3 MW, Iperó com 4,7 MW de outro combustível de lixo, Catanduva com 1,4 MW. Uma lupa amplia a Grande São Paulo e a Baixada Santista. Uma chamada aponta Paulínia, o maior destino sem usina em operação, com 2.621 t/dia de 30 municípios. No painel, as barras do lixo recebido pelos seis municípios com usina, com os MW de cada um, e pelos três maiores sem usina."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "CETESB — Inventário Estadual de Resíduos Sólidos Urbanos 2023, anexo de enquadramento dos municípios"
    nome_en: "CETESB — São Paulo State Urban Solid Waste Inventory 2023, annex on municipal compliance"
    url: https://cetesb.sp.gov.br/residuossolidos/publicacoes-e-relatorios/
    ano: 2023
  - nome: "ANEEL — Sistema de Informações de Geração (SIGA), empreendimentos de geração, dados abertos de 01/10/2026"
    nome_en: "ANEEL — Generation Information System (SIGA), generation projects, open data of 01/10/2026"
    url: https://dadosabertos.aneel.gov.br/dataset/siga-sistema-de-informacoes-de-geracao-da-aneel
    ano: 2026
  - nome: "IBGE — Localidades 2022 (sedes municipais)"
    nome_en: "IBGE — Localities 2022 (municipal seats)"
    url: https://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/localidades/
    ano: 2022
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "pandas", "GeoPandas", "xpdf", "QGIS", "Node.js", "d3-geo"]
metodo: "Municípios com aterro do inventário da CETESB (2023), com o lixo recebido, e usinas a lixo em operação no SIGA da ANEEL (01/10/2026), na coordenada registrada; aterro e usina se ligam pelo município. Só o que existe: sem estimativa de potencial."

camadas:
  - { nome: aterros, tipo: ponto, cor: "#234e70", descricao: "301 municípios com aterro em uso em 2023, na sede: t/dia recebida, municípios atendidos, lixo próprio e de fora, locais de disposição, IQR 2023, MW a biogás e a outro combustível de lixo e nomes das usinas", descricao_en: "301 municipalities with a landfill in use in 2023, at the seat: t/day received, towns served, own and outside waste, disposal sites, 2023 IQR, MW from biogas and from other waste fuels, and plant names" }
  - { nome: usinas, tipo: ponto, cor: "#234e70", descricao: "13 usinas a lixo em operação: nome, CEG, combustível no SIGA, grupo, potência outorgada, início da operação, proprietário, posição e município", descricao_en: "13 waste-fuelled plants in operation: name, CEG code, SIGA fuel, group, licensed capacity, start of operation, owner, position and municipality" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado de São Paulo", descricao_en: "São Paulo state boundary" }

indicadores:
  - tipo: numero
    rotulo: "Potência a biogás de lixo em operação"
    rotulo_en: "Waste-biogas capacity in operation"
    valor: 78.6
    unidade: "MW"
    nota: "10 usinas; 74,5 MW em 6 dos 301 municípios com aterro"
    nota_en: "10 plants; 74.5 MW in 6 of the 301 towns with a landfill"
  - tipo: barras
    rotulo: "Potência a biogás de lixo por município"
    rotulo_en: "Waste-biogas capacity by municipality"
    unidade: "MW"
    itens:
      - { rotulo: "Caieiras", valor: 29.5, cor: "#234e70" }
      - { rotulo: "São Paulo", valor: 29.3, cor: "#234e70" }
      - { rotulo: "Guatapará", valor: 5.7, cor: "#234e70" }
      - { rotulo: "Santana de Parnaíba", valor: 4.3, cor: "#234e70" }
      - { rotulo: "Tremembé", valor: 4.3, cor: "#234e70" }
      - { rotulo: "Carapicuíba", valor: 2.6, cor: "#9aa3ab" }
      - { rotulo: "Ribeirão Preto", valor: 1.5, cor: "#9aa3ab" }
      - { rotulo: "Catanduva", valor: 1.4, cor: "#234e70" }
      - { rotulo: "Barueri", valor: 0.03, cor: "#9aa3ab" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/lixo-sp-2026/sp_aterros_energia_2023.gpkg.zip
    rotulo: "Aterros, usinas e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Landfills, plants and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "0,7 MB"
  - formato: csv
    arquivo: dados/sp_aterros_energia_2023.csv
    rotulo: "Os 301 municípios com aterro, com o lixo recebido e as usinas"
    rotulo_en: "The 301 municipalities with a landfill, with waste received and plants"
    tamanho: "0,02 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/lixo-sp-2026/sp_aterros_energia_2023_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/lixo-sp-2026/sp_aterros_energia_2023_prancha.en.svg
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

# Os aterros que já acendem a luz: usinas a gás de lixo nos aterros de São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 140, a terceira e última da coleção **Para onde vai o lixo**. No fim do caminho, o aterro:
quais já queimam o gás do lixo para gerar eletricidade e quais dos maiores ainda não.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `aterros` | ponto | 301 municípios com aterro, na sede: `t_recebida`, `municipios`, `de_outros`, `t_propria`, `locais`, `iqr_2023`, `mw_biogas`, `mw_rsu`, `usinas`, `usina_biogas` |
| `usinas` | ponto | 13 usinas: `nome`, `ceg`, `combustivel` (como no SIGA), `grupo` (biogás ou outro combustível de lixo), `potencia_kw` (outorgada), `inicio_operacao`, `municipio_siga`, `proprietario`, `posicao`, `CD_MUN`, `NM_MUN`, `aterro_no_municipio` |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `lixo-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/lixo-sp-2026).
As camadas trazem os **estilos do QGIS**: aterros com círculos proporcionais ao lixo recebido e usinas
pelo grupo de combustível. O **CSV** fica nesta pasta, em UTF-8, com a tabela dos aterros sem geometria.

## Método

1. Os municípios com aterro são os destinos paulistas da prancha 138 (inventário de resíduos da CETESB,
   2023): 301 municípios, com o lixo que recebem por dia, o próprio e o de fora.
2. As usinas vêm do SIGA da ANEEL (dados abertos de 01/10/2026): estado de São Paulo, fase «Operação»
   e combustível «Biogás - RU», «Resíduos Sólidos Urbanos - RU» ou «Carvão - RU». São 13: dez a biogás
   (78,6 MW) e três a outro combustível de lixo (10,5 MW).
3. Cada usina fica na coordenada do SIGA e cai no município pela Malha Municipal do IBGE. A TECIPAR, sem
   coordenada, foi para a sede de Santana de Parnaíba, o município que o SIGA registra (coluna
   `posicao`).
4. Usina e aterro se ligam pelo município: conta como «com usina» o município com aterro em uso que tem
   usina a biogás em operação. A parcela do lixo (41,9%) divide o que esses seis recebem pelo total do
   estado, 39.144,35 t/dia.
5. A potência é a outorgada, em MW.

## Limitações

- A ligação é por município, não por aterro: uma usina pode queimar o gás de um aterro antigo, já
  encerrado, e não o do aterro que recebe lixo hoje. É o caso das usinas São João e Bandeirantes, na
  capital, instaladas em aterros que deixaram de receber lixo antes de 2023.
- «Biogás - RU» é o rótulo do SIGA para biogás de resíduos urbanos; as três usinas em municípios sem
  aterro em uso (Carapicuíba, Ribeirão Preto e Barueri) podem queimar gás de outra origem.
- Potência outorgada não é energia gerada.
- Só entram usinas em operação. O SIGA registra outros projetos a lixo em São Paulo: Barueri, em
  construção, e Paulínia Energia, URE Valoriza Santos e URE Lara (Mauá), com construção não iniciada.
- As toneladas recebidas são as estimativas da CETESB, que avisa que o inventário não deve ser usado
  como fonte das quantidades efetivamente geradas.
- A prancha mostra só o que existe: não há estimativa do gás ou da eletricidade que os outros aterros
  poderiam dar.

## Licença dos dados

Dados públicos da CETESB e dados abertos da ANEEL e do IBGE, de uso livre com citação da fonte.
