---
numero: 139
titulo: "Quilômetros do lixo"
subtitulo: "Quem leva o lixo para longe quase sempre chega a um aterro bem avaliado; os aterros ruins ficam com quem aterra em casa"
data: 2026-12-23
rascunho: true
categoria: energia
colecao: lixo-sp
tags: [lixo-sp, sao-paulo, residuos-solidos, lixo, aterros, distancia, iqr, cetesb, ibge]

contexto: >-
  Somadas as viagens até o aterro, o lixo paulista percorre 647 mil toneladas-quilômetro por dia em linha reta, 16,5 km por tonelada. A capital responde por 17%: das 10.970 t/dia que gera, 4.143 vão a Caieiras, a 27 km, e o resto fica na cidade. Depois vêm Ribeirão Preto, que leva o lixo 43 km até Guatapará, e Sorocaba, Campinas, Mogi das Cruzes e Suzano. Em 163 municípios o lixo viaja em média mais de 40 km; somam 13,1% do lixo do estado. A viagem mais longa no estado é Apiaí–Iperó, 174 km. Dos 157 municípios que mandam o lixo a mais de 40 km para um aterro paulista, 149 chegam a aterros com IQR de 9,1 a 10, e nenhum a aterro inadequado. Os 32 que usam aterro inadequado (IQR até 7,0) usam o da própria cidade; o maior é o de Votorantim, com 111 t/dia e nota 2,5.

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com os 645 municípios coloridos numa grade de três por três cores, que cruza a distância média do lixo até o aterro (em casa, até 40 km, mais de 40 km) com a nota do aterro no IQR 2023 da CETESB (até 7,0, de 7,1 a 9,0, de 9,1 a 10). Azuis marcam aterros bem avaliados, ocres os de nota intermediária e terracota os inadequados; dentro de cada cor, quanto mais escuro, mais longe vai o lixo. Os nove municípios que aterram em outro estado ficam em cinza. Anéis abertos, proporcionais às toneladas-quilômetro por dia, marcam as sedes; o maior fica sobre a capital. Azul-escuro e bege se alternam pelo interior, e o terracota aparece em manchas isoladas. Três chamadas: Votorantim, com 111 t/dia num aterro de nota 2,5; Apiaí, cujo lixo viaja 174 km até Iperó; e São Paulo, com 112.698 toneladas-quilômetro por dia. No painel, a grade da legenda com o número de municípios em cada cor e as barras dos seis municípios com mais toneladas-quilômetro."

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
metodo: "Distância em linha reta da sede de cada município à do município do aterro, ponderada pelas toneladas do inventário da CETESB (2023), cruzada em nove cores com a nota do aterro (IQR 2023); anéis proporcionais às toneladas-quilômetro por dia."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#24507a", descricao: "645 municípios: lixo gerado (t/dia), destinos, t/dia levadas para fora, distância média ponderada, t·km por dia, IQR 2022 e 2023 do pior destino, enquadramento e as classes e faixas da grade de cores", descricao_en: "645 municipalities: waste generated (t/day), destinations, t/day sent away, weighted mean distance, t·km per day, 2022 and 2023 IQR of the worst destination, compliance, and the classes and bands of the colour grid" }
  - { nome: toneladas_km, tipo: ponto, cor: "#1a1c1e", descricao: "347 sedes de municípios que levam lixo para fora: t/dia, distância média e toneladas-quilômetro por dia", descricao_en: "347 seats of municipalities that send waste away: t/day, mean distance and tonne-kilometres per day" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado de São Paulo", descricao_en: "São Paulo state boundary" }

indicadores:
  - tipo: numero
    rotulo: "Distância média do lixo até o aterro"
    rotulo_en: "Mean distance from waste to landfill"
    valor: 16.5
    unidade: "km por tonelada"
    unidade_en: "km per tonne"
    nota: "647 mil toneladas-quilômetro por dia, em linha reta"
    nota_en: "647 thousand tonne-kilometres a day, as the crow flies"
  - tipo: barras
    rotulo: "Os municípios com mais toneladas-quilômetro"
    rotulo_en: "The municipalities with most tonne-kilometres"
    unidade: "t·km por dia"
    unidade_en: "t·km per day"
    itens:
      - { rotulo: "São Paulo", valor: 112698, cor: "#7aa0bf" }
      - { rotulo: "Ribeirão Preto", valor: 32799, cor: "#7aa0bf" }
      - { rotulo: "Sorocaba", valor: 24426, cor: "#7aa0bf" }
      - { rotulo: "Campinas", valor: 22658, cor: "#7aa0bf" }
      - { rotulo: "Mogi das Cruzes", valor: 21904, cor: "#7aa0bf" }
      - { rotulo: "Suzano", valor: 18980, cor: "#7aa0bf" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/lixo-sp-2026/sp_lixo_distancia_2023.gpkg.zip
    rotulo: "Municípios, toneladas-quilômetro e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities, tonne-kilometres and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "16,1 MB"
  - formato: csv
    arquivo: dados/sp_lixo_distancia_2023.csv
    rotulo: "Os 645 municípios, com distância, toneladas-quilômetro, nota e cor"
    rotulo_en: "All 645 municipalities, with distance, tonne-kilometres, score and colour"
    tamanho: "0,1 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/lixo-sp-2026/sp_lixo_distancia_2023_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/lixo-sp-2026/sp_lixo_distancia_2023_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,1 MB"
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

# Quilômetros do lixo: a distância até o aterro e a nota do aterro em São Paulo

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 139, a segunda da coleção **Para onde vai o lixo**. Depois dos caminhos, a distância: quanto
o lixo de cada cidade viaja e em que aterro chega.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `rsu_t_dia`, `destinos`, `t_fora_dia`, `km_medio` (ponderado pelas toneladas), `t_km_dia`, `iqr_2022`, `iqr_2023` (o pior destino), `enquadramento`, `classe_km` e `classe_iqr` (0 a 2; −1 fora do estado), `faixa_km`, `faixa_iqr` |
| `toneladas_km` | ponto | 347 sedes de municípios que levam lixo para fora: `rsu_t_dia`, `km_medio`, `t_km_dia` |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `lixo-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/lixo-sp-2026).
A camada `municipios` traz o **estilo do QGIS** com as nove cores da prancha, e `toneladas_km`, os anéis
proporcionais. O **CSV** fica nesta pasta, em UTF-8, com a tabela dos municípios sem geometria.

## Método

1. Os registros da prancha 138: o anexo do inventário de resíduos da CETESB (2023), um por município e
   destino, com o código do IBGE de origem e de destino.
2. A distância é geodésica, em linha reta, entre a sede do município e a sede do município do aterro
   (localidades do IBGE, 2022). Aterrar no próprio município conta 0 km.
3. Toneladas-quilômetro por dia = t/dia × km de cada registro, somadas por município. A distância média
   do município é essa soma dividida pelas suas toneladas; a do estado (16,5 km) divide as 647.380 t·km
   pelas 39.144,35 t/dia.
4. A nota é o IQR 2023 do aterro de destino. Com dois destinos, vale a menor: é a regra que reproduz os
   604 municípios em situação adequada e os 32 em inadequada da CETESB.
5. A grade cruza três classes de distância (em casa, até 40 km, mais de 40 km) com três de nota (até
   7,0; 7,1 a 9,0; 9,1 a 10). O corte de 7,0 é o da CETESB entre inadequado e adequado; os de 40 km e
   9,0 são desta prancha, para separar quem vai longe e as notas mais altas.
6. Os nove municípios que aterram em outro estado ficam em cinza, fora da grade: a CETESB não dá nota
   a esses aterros. Eles entram nos 163 municípios que mandam o lixo, em média, a mais de 40 km.

## Limitações

- As toneladas são as estimativas da CETESB (população urbana vezes 0,7 a 1,1 kg por habitante por dia;
  para a capital, as quantidades das concessionárias). A CETESB avisa que o inventário não deve ser usado
  como fonte das quantidades efetivamente geradas.
- A linha reta entre sedes subestima a viagem: o aterro pode ficar longe da sede, e o caminhão segue a
  estrada. A coleta dentro da cidade e a volta do caminhão também não entram.
- Toneladas-quilômetro medem a carga transportada; não são custo nem emissão.
- O IQR é a nota da inspeção da CETESB no ano; aterros mudam de nota de um ano para outro.
- Embu das Artes usa o próprio aterro, inadequado, e manda outra parte do lixo a Santana de Parnaíba.
  Pela regra da menor nota, fica na linha dos inadequados e na coluna «até 40 km».

## Licença dos dados

Dados públicos da CETESB e dados abertos do IBGE, de uso livre com citação da fonte.
