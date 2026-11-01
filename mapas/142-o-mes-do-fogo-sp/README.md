---
numero: 142
titulo: "O mês do fogo"
subtitulo: "A temporada se juntou no fim da seca"
data: 2027-01-04
rascunho: true
categoria: biomas
colecao: fogo-sp
tags: [fogo-sp, sao-paulo, focos-de-calor, queimadas, sazonalidade, cana, queima-da-palha, inpe]

contexto: >-
  De 2003 a 2007, quando a palha da cana ainda se queimava na colheita, a data média dos focos de calor no estado de São Paulo caía em 5 de agosto; de 2020 a 2024 caiu em 23 de agosto, 18 dias depois, com quase o mesmo número de focos (23.605 e 23.569). A temporada se juntou: agosto e setembro passaram de 40% para 63% dos focos, e os focos de maio a julho caíram de 8.232 para 4.701. Dos 367 municípios com estação de fogo nítida nos dois períodos, 262 queimam mais tarde; a mediana andou 15 dias. Sem 2024, o ano recorde da série, a mudança continua: de 5 de agosto (2003–2006) para 22 de agosto (2020–2023). A data média também varia muito de um ano para outro, mesmo nos anos recentes (23 de julho em 2018, 31 de agosto em 2020), e a prancha não separa as causas. Foco de calor é fogo ativo visto do satélite, não área queimada.

imagem: ./mapa_preview.png
imagem_alt: "Prancha com três mapas do estado de São Paulo e um quadro de notas. Nos dois primeiros, cada município tem a cor da data média dos seus focos de calor numa paleta circular do ano: bege-claro no verão, azuis no outono, roxo em junho, vinho em julho, vermelho em agosto, laranja em setembro e laranja-claro em outubro; municípios com menos de 10 focos ou sem estação nítida vão hachurados. Em 2003–2007 predominam o vinho e o roxo; em 2020–2024, o vermelho e o laranja. O terceiro mapa mostra quantos dias a data média andou, de azul (mais cedo) a terracota (mais tarde): terracota no norte e no oeste, azuis no sul, na região de Sorocaba, e perto da capital. No quarto quadro, um relógio do fogo com a parte dos focos de cada mês nos dois períodos e as datas médias do estado, 5 de agosto e 23 de agosto. No painel, a data média do estado ano a ano, de 2003 a 2024, e colunas com a parte dos focos de cada ano que caiu de maio a julho."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "INPE — Programa Queimadas (BDQueimadas), focos de calor do satélite de referência, arquivos anuais de 2003 a 2024"
    nome_en: "INPE — Queimadas Programme (BDQueimadas), reference-satellite hotspots, annual files 2003 to 2024"
    url: https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/anual/Brasil_sat_ref/
    ano: 2024
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "pandas", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Focos do satélite de referência do INPE em 2003–2007 e 2020–2024; em cada município e período, a média circular das datas (o dia do ano como ângulo); municípios com menos de 10 focos ou sem estação nítida (teste de Rayleigh, p ≥ 0,05) vão hachurados."

camadas:
  - { nome: municipios, tipo: poligono, cor: "#c65c29", descricao: "645 municípios: focos, data média, concentração e teste de Rayleigh em 2003–2007 e 2020–2024, e o deslocamento em dias", descricao_en: "645 municipalities: hotspots, mean date, concentration and Rayleigh test for 2003–2007 and 2020–2024, and the shift in days" }
  - { nome: focos, tipo: ponto, cor: "#9c4a32", descricao: "47.174 focos dos dois períodos, com data e hora", descricao_en: "47,174 hotspots of both periods, with date and time" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Deslocamento da data média dos focos no estado"
    rotulo_en: "Shift in the state’s mean hotspot date"
    valor: 18
    unidade: "dias"
    nota: "de 5 de agosto (2003–2007) para 23 de agosto (2020–2024)"
    nota_en: "from 5 August (2003–2007) to 23 August (2020–2024)"
  - tipo: barras
    rotulo: "Parte dos focos em agosto e setembro"
    rotulo_en: "Share of hotspots in August and September"
    unidade: "%"
    itens:
      - { rotulo: "2003–2007", rotulo_en: "2003–2007", valor: 39.6, cor: "#9a2c35" }
      - { rotulo: "2020–2024", rotulo_en: "2020–2024", valor: 62.5, cor: "#bc4c2a" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/fogo-sp-2026/sp_focos_data_media.gpkg.zip
    rotulo: "Municípios, focos e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Municipalities, hotspots and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "19,4 MB"
  - formato: csv
    arquivo: dados/sp_focos_data_media.csv
    rotulo: "Os 645 municípios, com a data média nos dois períodos"
    rotulo_en: "All 645 municipalities, with the mean date in both periods"
    tamanho: "0,1 MB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/fogo-sp-2026/sp_focos_data_media_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/fogo-sp-2026/sp_focos_data_media_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "5,8 MB"
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

# O mês do fogo: a data média dos focos de calor em SP, 2003–2007 e 2020–2024

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 142, a segunda da coleção **Biomassa que vira fumaça**. Não quanto queima, mas quando:
o calendário do fogo em cada município, antes e depois do fim da queima da palha da cana.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `CD_MUN`, `NM_MUN`, `CD_RGI`, `NM_RGI`, `CD_RGINT`, `NM_RGINT`, `area_km2` e, para cada período (`_2003_2007`, `_2020_2024`): `focos_`, `dia_medio_` (dia do ano, 1 a 365), `data_media_` (dd/mm), `concentracao_` (comprimento do vetor médio, 0 a 1), `p_rayleigh_`, `estacao_` (verdadeiro se há 10 focos ou mais e p < 0,05); e `deslocamento_dias` e `classe_deslocamento` (0 a 6) |
| `focos` | ponto | 47.174 focos dos dois períodos: `foco_id`, `periodo`, `ano`, `data`, `hora_utc`, `lat`, `lon`, `CD_MUN`, `NM_MUN` |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `fogo-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/fogo-sp-2026).
A camada `municipios` traz três **estilos do QGIS**: a data média de 2020–2024 (padrão), a de
2003–2007, em 24 quinzenas na paleta da prancha, e o deslocamento em dias. O **CSV** fica nesta pasta,
em UTF-8, com a tabela dos municípios sem geometria.

## Método

1. Focos dos arquivos anuais do satélite de referência do INPE (BDQueimadas), com `estado` igual a
   «SÃO PAULO», ligados ao município da Malha Municipal 2025 do IBGE pelo ponto. Todos são da passagem
   da tarde (16h a 18h UTC), e a data UTC é a data local.
2. Dois quinquênios: **2003–2007**, quando a queima da palha ainda era comum na colheita da cana, e
   **2020–2024**, depois dos prazos do Protocolo Agroambiental (2014 e 2017) e do prazo da Lei estadual
   11.241/2002 para as áreas mecanizáveis (2021). A escolha das janelas é desta prancha.
3. **Média circular.** Cada data vira um ângulo no círculo do ano (2π × (dia do ano − 0,5) ÷ dias do
   ano), e a data média é a direção do vetor médio, convertida de volta para um calendário de 365 dias.
   Assim, 30 de dezembro e 2 de janeiro ficam perto, e não a meio ano de distância. O comprimento do
   vetor médio (`concentracao`, de 0 a 1) diz quanto as datas se juntam em volta da média.
4. **Estação nítida.** O teste de Rayleigh (aproximação de Zar) verifica se as datas se espalham pelo
   ano sem direção. O município entra no mapa do período se tiver **10 focos ou mais** e **p < 0,05**;
   os outros vão hachurados. Em 2003–2007 foram 440 municípios com estação, 148 com menos de 10 focos
   e 57 sem estação nítida; em 2020–2024, 452, 172 e 21.
5. **Deslocamento.** Nos 367 municípios com estação nos dois períodos, a diferença entre as datas
   médias, de −182 a +182 dias (meio ano para cada lado), em sete classes (limites em ±10, ±30 e ±60 dias).
6. O relógio do quarto quadro mostra a parte dos focos de cada quinquênio em cada mês do ano (2003–2007
   em contorno, 2020–2024 em cor) e as datas médias do estado. O painel mostra a data média do estado
   em cada ano de 2003 a 2024 e a parte dos focos de cada ano que caiu de maio a julho (34,9% em
   2003–2007, 19,9% em 2020–2024; 56% em 2018).
7. **Conferência sem 2024.** 2024 teve 8.712 focos, 37% dos de 2020–2024, 70% deles em agosto e
   setembro. Comparando quatro anos com quatro, 2003–2006 dá 5 de agosto e 2020–2023 dá 22 de agosto;
   agosto e setembro passam de 40,8% para 57,9% dos focos.

## Limitações

- **Foco de calor não é área queimada.** É um pixel de ~1 km em que o sensor viu fogo ativo na
  passagem do satélite. Um incêndio grande pode gerar dezenas de focos; um fogo curto, de noite, sob
  nuvem ou pequeno pode não gerar nenhum. Uma queima que começa e termina entre duas passagens não
  aparece.
- A data média de um município pesa cada foco igualmente: um só incêndio grande pode puxá-la.
- A hora da passagem ficou mais tarde nos últimos anos (mais focos às 17h e 18h UTC em 2020–2024), o
  que pode mudar o quanto o satélite vê do fogo da tarde.
- A data média do estado varia muito de ano para ano (de 3 de julho em 2009 a 2 de setembro em 2012);
  cinco anos de cada lado amortecem essa variação, não a eliminam. A prancha mostra a mudança de calendário, não a sua causa.

## Licença dos dados

Focos do INPE e malha municipal do IBGE: dados abertos, de uso livre com citação da fonte.
