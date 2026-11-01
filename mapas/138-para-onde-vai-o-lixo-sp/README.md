---
numero: 138
titulo: "Para onde vai o lixo de cada cidade"
subtitulo: "Mais da metade do lixo sai da cidade onde nasce; quase metade acaba em cinco municípios"
data: 2026-12-21
rascunho: true
categoria: energia
colecao: lixo-sp
tags: [lixo-sp, sao-paulo, residuos-solidos, lixo, aterros, fluxos, cetesb, ibge]

contexto: >-
  Pela estimativa da CETESB, os 645 municípios paulistas geram 39,1 mil toneladas de lixo urbano por dia. Em 347 deles, todo o lixo ou parte dele segue para um aterro em outra cidade; os outros 298 aterram tudo em casa. Somadas, essas viagens tiram 21,0 mil t/dia, 54% do lixo do estado, do município onde ele foi gerado. A chegada é concentrada: os aterros de São Paulo, Caieiras, Paulínia, Mauá e Guarulhos recebem 48,8% do lixo do estado, e os dez maiores destinos, 64%. Caieiras recebe 5,5 mil t/dia de 19 municípios, 74 vezes o que gera; Jambeiro, no Vale do Paraíba, recebe 1,2 mil t/dia, 561 vezes o próprio lixo. O maior fluxo é o da capital para Caieiras: 4,1 mil t/dia por 27 km. Nove municípios aterram em outro estado, e o lixo de Ribeira viaja 184 km em linha reta até Rio Negrinho (SC).

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo em projeção transversa de Mercator. Os municípios que mandam lixo para outra cidade aparecem em bege, e os que aterram tudo em casa, em cinza-claro. Linhas azuis curvas ligam a sede de cada município à do município do aterro, com espessura proporcional às toneladas por dia; linhas cor de argila levam a outros estados. Círculos proporcionais ao lixo aterrado marcam os destinos: ocre os que recebem lixo de outras cidades, grafite os que aterram só o próprio lixo. Os leques de linhas convergem para polos rotulados com o número de municípios atendidos, como Catanduva e Paulínia (30), Piratininga (28) e Onda Verde (20). Uma lupa amplia a Grande São Paulo e a Baixada Santista, onde uma faixa grossa liga a capital a Caieiras. Três chamadas: Paulínia, com 2.621 t/dia de 30 municípios; Jambeiro, que recebe 561 vezes o lixo que gera; e Ribeira, cujo lixo viaja 184 km até Rio Negrinho (SC). No painel, os números-chave e as barras dos sete maiores destinos, divididas entre o lixo da própria cidade e o que vem de fora."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "CETESB — Inventário Estadual de Resíduos Sólidos Urbanos 2023, anexo de enquadramento dos municípios"
    nome_en: "CETESB — São Paulo State Urban Solid Waste Inventory 2023, annex on municipal compliance"
    url: https://cetesb.sp.gov.br/residuossolidos/publicacoes-e-relatorios/
    ano: 2023
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
software: ["Python", "pandas", "GeoPandas", "pyproj", "xpdf", "QGIS", "Node.js", "d3-geo"]
metodo: "Anexo do inventário de resíduos da CETESB (2023) lido do PDF e conferido com os totais do relatório; cada município ligado ao município do aterro por uma linha entre as sedes, com largura proporcional às toneladas por dia."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#ece3d0", descricao: "645 municípios: agência e UGRHI da CETESB, lixo gerado (t/dia), destinos, se manda lixo para fora, t/dia levadas para fora, distância média, IQR 2023 e enquadramento", descricao_en: "645 municipalities: CETESB agency and water-management unit, waste generated (t/day), destinations, whether it sends waste away, t/day sent away, mean distance, 2023 IQR and compliance" }
  - { nome: fluxos, tipo: linha, cor: "#234e70", descricao: "349 fluxos de lixo levado a outro município, da sede de origem à sede do destino: t/dia, km em linha reta e IQR 2023 do aterro", descricao_en: "349 flows of waste taken to another municipality, from seat of origin to seat of destination: t/day, straight-line km and the landfill's 2023 IQR" }
  - { nome: destinos, tipo: ponto, cor: "#c08a2e", descricao: "305 municípios onde o lixo é aterrado (301 em SP e 4 em outros estados), na sede: t/dia recebida, municípios atendidos, lixo próprio e de fora, quantas vezes o que o município gera e IQR 2023", descricao_en: "305 municipalities where waste is landfilled (301 in SP and 4 in other states), at the seat: t/day received, towns served, own and outside waste, how many times what the town generates, and 2023 IQR" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado de São Paulo", descricao_en: "São Paulo state boundary" }

indicadores:
  - tipo: numero
    rotulo: "Lixo que sai do município onde foi gerado"
    rotulo_en: "Waste that leaves the town where it was produced"
    valor: 53.7
    unidade: "%"
    nota: "21,0 mil t/dia, de 347 dos 645 municípios"
    nota_en: "21.0 thousand t/day, from 347 of the 645 towns"
  - tipo: barras
    rotulo: "Os maiores destinos do lixo"
    rotulo_en: "The largest waste destinations"
    unidade: "t/dia"
    unidade_en: "t/day"
    itens:
      - { rotulo: "São Paulo", valor: 7368.6, cor: "#c08a2e" }
      - { rotulo: "Caieiras", valor: 5523.1, cor: "#c08a2e" }
      - { rotulo: "Paulínia", valor: 2620.9, cor: "#c08a2e" }
      - { rotulo: "Mauá", valor: 2153.4, cor: "#c08a2e" }
      - { rotulo: "Guarulhos", valor: 1421.0, cor: "#c08a2e" }
      - { rotulo: "Santos", valor: 1306.3, cor: "#c08a2e" }
      - { rotulo: "Santana de Parnaíba", valor: 1290.5, cor: "#c08a2e" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/lixo-sp-2026/sp_lixo_fluxos_2023.gpkg.zip
    rotulo: "Municípios, fluxos, destinos e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities, flows, destinations and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "16,2 MB"
  - formato: csv
    arquivo: dados/sp_lixo_fluxos_2023.csv
    rotulo: "Os 649 registros do anexo, um por município e destino, com códigos do IBGE e distâncias"
    rotulo_en: "The 649 annex records, one per municipality and destination, with IBGE codes and distances"
    tamanho: "0,1 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/lixo-sp-2026/sp_lixo_fluxos_2023_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/lixo-sp-2026/sp_lixo_fluxos_2023_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,5 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,4 MB"

doi_automatico: false
versao: "1.0.0"
discussoes: []
---

# Para onde vai o lixo de cada cidade: os caminhos do lixo urbano em São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 138, a primeira da coleção **Para onde vai o lixo**. O ponto de partida: de que município
sai o lixo de cada cidade paulista e em qual ele é aterrado.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `agencia`, `ugrhi`, `rsu_t_dia` (lixo gerado), `destinos`, `exporta`, `t_fora_dia` (levado a outro município), `km_medio`, `iqr_2023` (o pior destino), `enquadramento` |
| `fluxos` | linha | 349 fluxos para outro município: `cd_mun`, `nm_mun`, `cd_destino`, `nm_destino`, `uf_destino`, `local_destino` (como no inventário), `tipo_destino` (particular, público, outro estado), `rsu_t_dia`, `km_reta`, `iqr_2023` |
| `destinos` | ponto | 305 municípios com aterro, na sede: `t_recebida`, `municipios` (atendidos), `de_outros`, `t_propria`, `t_de_outros`, `t_gerada`, `vezes_o_que_gera`, `locais`, `iqr_2023`, `recebe_de_outros` |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `lixo-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/lixo-sp-2026).
As camadas trazem os **estilos do QGIS** da prancha: fluxos com largura proporcional às toneladas e
destinos com círculos proporcionais ao lixo recebido. O **CSV** fica nesta pasta, em UTF-8, com os 649
registros do anexo (um por município e destino), os códigos do IBGE, a distância em linha reta e as
toneladas-quilômetro por dia.

## Método

1. O anexo do inventário que enquadra os municípios em ordem alfabética traz, para cada um, a agência
   ambiental, a UGRHI, o lixo em t/dia, o IQR de 2022 e de 2023 do local de disposição e o campo
   «dispõe em». Foi lido do PDF com o `pdftotext` (xpdf, modo `-table`) e conferido com os totais
   impressos no relatório: 39.038,08 t/dia aterradas em SP, das quais 38.402,69 em aterros adequados e
   635,39 em inadequados; 604 municípios em situação adequada e 32 em inadequada; e os nove municípios
   que aterram em outro estado.
2. Os nomes da CETESB foram casados com a Malha Municipal 2025 do IBGE por uma chave sem acentos,
   espaços e pontuação, com duas grafias acertadas à mão (Embu das Artes e São Luiz do Paraitinga).
3. Com «dispõe em» vazio, o lixo fica no próprio município. Com um nome («Caieiras - A.P.», «São Paulo -
   CDR», «Uberaba - MG»), o destino é o município do aterro; «A.P.» e «CDR» são aterros particulares.
   Quatro municípios aparecem em duas linhas do anexo, uma por destino, cada uma com a sua tonelagem:
   São Paulo, Embu das Artes, Praia Grande e São Sebastião.
4. Cada fluxo é uma linha da sede do município de origem à sede do município do aterro (localidades do
   IBGE, 2022), com largura proporcional às toneladas por dia. A distância é geodésica, em linha reta.
5. O total do estado, 39.144,35 t/dia, soma as 106,25 t/dia aterradas fora de SP; é a base das
   parcelas da prancha. A parcela dos aterros particulares (61%, em 37 dos 302 aterros) usa só o lixo
   aterrado em SP.
6. Um município é polo quando recebe lixo de pelo menos uma outra cidade: são 38 em SP. O número ao lado
   do nome, no mapa, conta os municípios atendidos, o próprio incluído.

## Limitações

- As toneladas são estimativas da CETESB, não pesagens: a população urbana (população do último Censo
  com a taxa de urbanização de 2010) vezes 0,7 a 1,1 kg por habitante por dia, conforme o porte da
  cidade. A capital é exceção: entram as quantidades informadas pelas concessionárias, sem os resíduos
  de varrição, poda e limpeza de logradouros. A própria CETESB avisa que o inventário acompanha as
  condições dos aterros e não deve ser usado como fonte das quantidades efetivamente geradas.
- A linha liga sedes municipais: o aterro pode ficar longe da sede, e o caminhão segue a estrada. A
  viagem real é mais longa.
- Estações de transbordo não aparecem: o fluxo vai direto ao município do aterro.
- Os destinos são os de 2023; contratos de disposição mudam de um ano para outro.
- Na prancha, os municípios que aterram só o próprio lixo também ganham círculo proporcional
  (grafite), para que o leitor compare o tamanho com os polos.

## Licença dos dados

Dados públicos da CETESB e dados abertos do IBGE, de uso livre com citação da fonte.
