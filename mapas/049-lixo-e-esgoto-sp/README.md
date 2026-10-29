---
numero: 49
titulo: "Lixo e esgoto"
subtitulo: "A cidade também é lavoura de gás"
data: 2026-10-20
categoria: energia
colecao: agro-sp
tags: [agro-sp, sao-paulo, residuos-solidos, esgoto, biogas, biometano, cp2b, ana]

contexto: >-
  O lixo orgânico, o lodo de esgoto e a poda das cidades paulistas dariam 621 mil m³ de biometano por dia no método CP2B: 434 mil do lixo, 121 mil do lodo e 66 mil da poda. É pouco perto do campo, menos de 4% do total do estado, mas está onde mora quase todo mundo. A cidade de São Paulo responde por 23% e a sua região por 39%. Metade do metano que o lixo poderia gerar já é aproveitada em aterros, e o método desconta essa parte. O mapa também mostra as 873 estações de tratamento de esgoto cadastradas pela ANA, que atendem 608 municípios. A maioria trata o esgoto em lagoas (552); 87 usam reator anaeróbio, que produz biogás no próprio tratamento. Quinta prancha da coleção «Do campo ao biometano».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com os municípios coloridos pelo biometano que o lixo, o esgoto e a poda dariam por dia, em seis classes de azul-petróleo, do mais claro (até 37 m³) ao mais escuro (de 1.100 a 143.796 m³). Os tons escuros dominam a Grande São Paulo e o eixo de Campinas a Sorocaba e aparecem também nas cidades médias do interior; o Vale do Ribeira e o alto Vale do Paraíba ficam em cinza, com zero. Sobre o mapa, 873 pontos de estações de tratamento de esgoto: pequenos, em azul (lagoas), cinza-escuro (lodos ativados) e cinza-claro (outros processos), e 87 maiores, cor de argila, com reator anaeróbio, mais densos entre Campinas, Piracicaba e São Paulo. Uma chamada aponta São Paulo: 144 mil m³ por dia, 23% do biometano urbano do estado."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "CP2B (Unicamp) — potencial de biogás e biometano por município, método v5.1"
    nome_en: "CP2B (Unicamp) — biogas and biomethane potential by municipality, method v5.1"
    ano: 2026
  - nome: "ANA — Estações de tratamento de esgoto (base de 2019)"
    nome_en: "ANA — Sewage treatment plants (2019 database)"
    ano: 2019
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Potencial de biometano do lixo orgânico, do lodo de esgoto e da poda urbana no nível acessível do método CP2B, por município, em seis classes por quantis; estações de tratamento de esgoto da ANA, uma por código, coloridas pela família de processo."

camadas:
  - { nome: etes, tipo: ponto, descricao: "873 estações de tratamento de esgoto: nome, situação, processo, família, remoção de DBO e municípios atendidos", descricao_en: "873 sewage treatment plants: name, status, process, family, BOD removal and municipalities served" }
  - { nome: municipios, tipo: poligono, descricao: "645 municípios: biometano do lixo, do lodo e da poda (m³/dia) e metano do lixo já aproveitado em aterros", descricao_en: "645 municipalities: biomethane from waste, sludge and prunings (m³/day) and waste methane already used at landfills" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: proporcao
    rotulo: "De onde vem o biometano urbano"
    rotulo_en: "Where urban biomethane comes from"
    unidade: "m³/dia"
    unidade_en: "m³/day"
    itens:
      - { rotulo: "Lixo orgânico", rotulo_en: "Organic waste", valor: 434026, cor: "#174f66" }
      - { rotulo: "Lodo de esgoto", rotulo_en: "Sewage sludge", valor: 121403, cor: "#4f9ea8" }
      - { rotulo: "Poda urbana", rotulo_en: "Urban prunings", valor: 66025, cor: "#bcdcdc" }
  - tipo: numero
    rotulo: "Metano do lixo já aproveitado"
    rotulo_en: "Waste methane already used"
    valor: 446934
    unidade: "m³ CH₄/dia"
    unidade_en: "m³ CH₄/day"
    nota: "50% dos 889.450 m³ de metano por dia que o lixo orgânico poderia gerar, descontados pelo método"
    nota_en: "50% of the 889,450 m³ of methane a day that organic waste could generate, deducted by the method"
  - tipo: barras
    rotulo: "Maiores potenciais urbanos"
    rotulo_en: "Largest urban potentials"
    unidade: "m³/dia"
    unidade_en: "m³/day"
    itens:
      - { rotulo: "São Paulo", valor: 143796, cor: "#174f66" }
      - { rotulo: "Campinas", valor: 28064, cor: "#174f66" }
      - { rotulo: "Sorocaba", valor: 18094, cor: "#174f66" }
      - { rotulo: "Piracicaba", valor: 12561, cor: "#174f66" }
      - { rotulo: "São José do Rio Preto", valor: 12338, cor: "#174f66" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/agro-sp-2026/sp_lixo_esgoto.gpkg.zip
    rotulo: "Quatro camadas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Four layers, SIRGAS 2000, with QGIS styles"
    tamanho: "18,6 MB"
  - formato: csv
    arquivo: dados/sp_lixo_esgoto.csv
    rotulo: "Biometano urbano por município"
    rotulo_en: "Urban biomethane by municipality"
    tamanho: "42 kB"
  - formato: csv
    arquivo: dados/sp_etes_2019.csv
    rotulo: "Estações de tratamento de esgoto, com coordenadas"
    rotulo_en: "Sewage treatment plants, with coordinates"
    tamanho: "152 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/agro-sp-2026/sp_lixo_esgoto_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/agro-sp-2026/sp_lixo_esgoto_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,3 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

doi_automatico: false
versao: "1.0.0"
doi: 10.5281/zenodo.23539847
discussoes: []
---

# Lixo, esgoto e poda em São Paulo: o biometano das cidades

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 049, a quinta de seis da coleção **Do campo ao biometano**: depois das lavouras, os
resíduos que as cidades produzem todos os dias.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `etes` | ponto | 873 estações: `codigo`, `nome`, `situacao`, `tratamento` (processo declarado), `familia_ana`, `familia` (reator, lagoa, lodos, outros), `remocao_dbo`, município-sede (`CD_MUN`, `NM_MUN`) e `municipios_atendidos` |
| `municipios` | polígono | 645 municípios: `CD_MUN`, `NM_MUN`, região intermediária, `lixo_m3_dia`, `lodo_m3_dia`, `poda_m3_dia`, `urbano_m3_dia` e `lixo_ja_usado_ch4_m3_dia` (metano, não biometano) |
| `regioes_intermediarias` | polígono | 11 regiões geográficas intermediárias |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `agro-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/agro-sp-2026),
com os **estilos do QGIS** da prancha. Há dois **CSV** em UTF-8: um com a tabela dos municípios e
outro com as estações e suas coordenadas.

## Método

1. Potencial dos substratos *lixo orgânico*, *lodo de esgoto* e *poda urbana* no método CP2B v5.1
   (Unicamp, versão de 24/09/2026), cenário de referência, nível N4 (acessível), em m³ de
   biometano equivalente por dia, somados por município e divididos em seis classes por quantis.
2. Metano já aproveitado: a parcela que o método desconta do lixo orgânico por já ser captada em
   aterros com aproveitamento energético, em m³ de metano por dia, comparada ao potencial antes
   desse desconto.
3. Estações de tratamento de esgoto da base da ANA de 2019. A base repete as estações que atendem
   vários municípios, uma vez por município, com o mesmo código; fica um ponto por código, no
   registro do município-sede, e a coluna `municipios_atendidos` guarda quantos ele atende (a ETE
   Barueri, a que mais atende, serve 11).
4. Famílias de processo, como a ANA as agrupa: reatores anaeróbios, sistemas de lagoas, lodos
   ativados e os demais (processos simplificados, químicos e mistos).

## Limitações

- O potencial do CP2B é modelado, não medido. Ele considera a distância até onde o gás seria
  produzido. Em 33 municípios, a maioria no Vale do Ribeira e no Vale do Paraíba, o nível
  acessível dá zero, e o mapa os mostra em cinza: não quer dizer que não haja resíduo.
- O lodo só entra onde há tratamento de esgoto; 517 municípios dão zero para o lodo.
- A base de estações é de 2019 e não traz vazão nem população atendida para a maioria delas;
  por isso todos os pontos têm o mesmo tamanho, e o reator anaeróbio aparece maior só para ser
  visto.
- Reator anaeróbio produz biogás, mas a base não diz se ele é queimado, aproveitado ou
  purificado em biometano.

## Licença dos dados

Dados públicos da ANA, de uso livre com citação da fonte. O potencial do CP2B (Unicamp) é
publicado aqui com autorização do centro; cite «CP2B (Unicamp), método v5.1, 2026».
