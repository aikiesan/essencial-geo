---
numero: 30
titulo: "Cana-de-açúcar"
subtitulo: "Um mar verde sobre um quinto do estado"
data: 2026-11-03
categoria: uso-do-solo
colecao: bioenergia-sp
tags: [bioenergia-sp, sao-paulo, cana-de-acucar, agricultura, etanol, bagaco, ibge, pam]

contexto: >-
  Em 2024, os canaviais paulistas colheram 5,40 milhões de hectares, 21,7% do território do estado, e produziram 418,6 milhões de toneladas de cana. Em 88 municípios a área colhida passa da metade do território; em Areiópolis chega a 82%, e em Jaboticabal a 81%. O mapa mostra a mancha escura que cobre o norte e o centro do estado e tem Morro Agudo como maior produtor (7,0 milhões de toneladas), e mostra onde ela acaba: no Vale do Paraíba, no Vale do Ribeira e na Grande São Paulo, a cana quase some. Cada tonelada colhida deixa bagaço e palha, e cada litro de etanol deixa vinhaça; é sobre esse mapa que a bioenergia paulista se apoia. Terceira prancha da coleção «Bioenergia em SP».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com os municípios coloridos pela parte do território ocupada por cana colhida em 2024, em seis classes da paleta viridis, do amarelo (até 4,1%) ao roxo-escuro (51% a 82,1%). Uma mancha roxa contínua cobre o norte e o centro do estado; o leste, o Vale do Ribeira e a Grande São Paulo ficam em amarelo, cinza (zero) ou hachurados (sem informação). Os cinco maiores produtores estão nomeados: Morro Agudo, Barretos, Guaíra, Jaboticabal e Rancharia."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Produção Agrícola Municipal (PAM), tabela 1612: lavouras temporárias"
    nome_en: "IBGE — Municipal Agricultural Production (PAM), table 1612: temporary crops"
    url: https://sidra.ibge.gov.br/tabela/1612
    ano: 2024
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Área colhida e produção de cana da PAM 2024 juntadas à Malha Municipal pelo código IBGE; área colhida dividida pela área do município, em seis classes por quantis."

camadas:
  - { nome: municipios, tipo: poligono, descricao: "645 municípios: área colhida (ha), produção (t), parte do território (%) e rendimento (t/ha)", descricao_en: "645 municipalities: harvested area (ha), production (t), share of territory (%) and yield (t/ha)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Área colhida"
    rotulo_en: "Harvested area"
    valor: 5398676
    unidade: "ha"
    nota: "21,7% do território paulista; 508 municípios com cana colhida"
    nota_en: "21.7% of the state’s territory; 508 municipalities with harvested cane"
  - tipo: numero
    rotulo: "Produção"
    rotulo_en: "Production"
    valor: 418569112
    unidade: "t"
    nota: "Em 88 municípios, a cana colhida ocupa mais da metade do território"
    nota_en: "In 88 municipalities, harvested cane covers more than half the territory"
  - tipo: barras
    rotulo: "Maiores produtores"
    rotulo_en: "Largest producers"
    unidade: "t"
    itens:
      - { rotulo: "Morro Agudo", valor: 6974210, cor: "#440154" }
      - { rotulo: "Barretos", valor: 6452296, cor: "#440154" }
      - { rotulo: "Guaíra", valor: 5207000, cor: "#440154" }
      - { rotulo: "Jaboticabal", valor: 4719100, cor: "#440154" }
      - { rotulo: "Rancharia", valor: 4650776, cor: "#440154" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-sp-2026/sp_cana_2024.gpkg.zip
    rotulo: "Três camadas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Three layers, SIRGAS 2000, with QGIS styles"
    tamanho: "18,5 MB"
  - formato: csv
    arquivo: dados/sp_cana_2024.csv
    rotulo: "Área colhida, produção e rendimento por município"
    rotulo_en: "Harvested area, production and yield by municipality"
    tamanho: "46 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-sp-2026/sp_cana_2024_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-sp-2026/sp_cana_2024_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "2,2 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,3 MB"

versao: "1.0.0"
discussoes: []
---

# Cana-de-açúcar — área colhida e produção em São Paulo, 2024

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 030, a terceira de quatro da coleção **Bioenergia em SP**: a lavoura que, depois de
colhida, deixa no campo e na usina a maior parte da biomassa do estado.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `CD_MUN`, `NM_MUN`, região intermediária, `area_km2`, `area_colhida_ha`, `producao_t`, `pct_area` (área colhida ÷ área do município, em %) e `rendimento_t_ha` |
| `regioes_intermediarias` | polígono | 11 regiões geográficas intermediárias |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `bioenergia-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/bioenergia-sp-2026)
do repositório, junto com os das outras pranchas da coleção.

O GPKG traz os **estilos do QGIS** gravados nas camadas. A camada `municipios` tem dois:
`parte_do_territorio` (o padrão, igual à prancha) e `producao` (toneladas colhidas, em seis
classes por quantis). Para trocar, abra as propriedades da camada e escolha o outro estilo em
*Estilo › Estilos*. Zero aparece em cinza-claro e “sem informação” em branco, cada um com sua
linha na legenda.

O **CSV** traz a mesma tabela dos municípios, em UTF-8, sem geometria. Nos dois arquivos,
célula vazia (NULL) quer dizer sem informação, e 0 quer dizer zero declarado pelo IBGE.

## Método

1. Tabela 1612 da Produção Agrícola Municipal no SIDRA: variáveis *Área colhida* (hectares) e
   *Quantidade produzida* (toneladas), produto *Cana-de-açúcar*, ano 2024, nível município,
   estado de São Paulo.
2. Junção à Malha Municipal 2025 do IBGE pelo código de sete dígitos.
3. Parte do território = área colhida ÷ (área oficial do município × 100), em %, com duas
   casas decimais. Rendimento = produção ÷ área colhida.
4. Classes: seis quantis dos municípios com área colhida positiva; os limites são arredondados
   a dois algarismos significativos, e o último é o máximo observado. O símbolo “-” da tabela
   (zero absoluto) vira 0; “...” e os municípios ausentes da tabela viram sem informação.
5. Regiões intermediárias e limite estadual obtidos por dissolução dos municípios.
6. Na prancha, as geometrias são simplificadas como cobertura; os arquivos para download
   mantêm a geometria original do IBGE.

## Limitações

- Área colhida não é área plantada: canaviais em reforma ou que não foram cortados no ano
  ficam de fora, e a ocupação real do solo pela cana tende a ser maior que a do mapa.
- A PAM é declarada por município e não diz onde, dentro dele, ficam os talhões; para isso,
  use um mapa de uso e cobertura da terra.
- 45 municípios ficam sem informação, a maioria na Grande São Paulo e na Baixada Santista;
  outros 92 declaram zero.
- A prancha não calcula bagaço, palha ou vinhaça: esses números dependem de coeficientes que
  não estão na tabela do IBGE.
