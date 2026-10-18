---
numero: 73
titulo: "Mel"
subtitulo: "Mais que triplicou em dezesseis anos"
data: 2026-12-03
categoria: uso-do-solo
colecao: animal-sp
tags: [animal-sp, sao-paulo, mel, apicultura, pecuaria, ibge, ppm]

contexto: >-
  São Paulo produziu 6,8 mil toneladas de mel em 2024, 3,3 vezes o que produzia em 2008. A produção cresceu em quase todos os anos e saltou 23% só de 2023 para 2024. No Brasil, o crescimento foi menor, de 37,8 para 67,3 mil toneladas, e a parte paulista quase dobrou, de 5,4% para 10,1%. O mel se concentra no centro-sul do estado, em volta de Botucatu: a região intermediária de Bauru faz 43% do total. Itatinga, com 750 toneladas, e Botucatu, com 725, somam 22% do mel paulista; Cabrália Paulista, Agudos e Capão Bonito vêm em seguida, e os dez maiores fazem 49%. O número de municípios produtores é o mesmo nos dois anos, 408: o crescimento veio de quem já produzia. O oeste, ao contrário, quase não aparece. Terceira prancha da coleção «Leite, ovos, mel e peixe».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do estado de São Paulo com os municípios coloridos pela produção de mel em 2024, em seis classes do creme ao marrom-escuro (até 440 quilos, até 1,3 tonelada, 3,5, 6,7, 16 e de 16 a 750 toneladas). O marrom-escuro ocupa o centro e o sul do estado, de Agudos e Botucatu até Capão Bonito e a divisa com o Paraná, além de manchas no nordeste e no Vale do Paraíba; o oeste fica claro ou cinza, com produção pequena ou zero, e a Grande São Paulo aparece listrada, sem informação. Chamada: Itatinga, 750 toneladas, o maior produtor de mel do estado em 2024. No painel, colunas da produção paulista de 2008 a 2024, de 2.061 para 6.772 toneladas, e os cinco maiores produtores."

recorte: "Estado de São Paulo (SP)"
fontes:
  - nome: "IBGE — Pesquisa da Pecuária Municipal (PPM), tabela 74: produção de origem animal"
    nome_en: "IBGE — Municipal Livestock Survey (PPM), table 74: animal products"
    url: https://sidra.ibge.gov.br/tabela/74
    ano: "2008 a 2024"
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Produção de mel de abelha da PPM 2024 por município em seis classes por quantis; série estadual de 2008 a 2024."

camadas:
  - { nome: municipios, tipo: poligono, descricao: "645 municípios: produção de mel em 2008 e 2024 (kg) e situação do dado em 2024", descricao_en: "645 municipalities: honey production in 2008 and 2024 (kg) and data status in 2024" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }

indicadores:
  - tipo: numero
    rotulo: "Mel em 2024"
    rotulo_en: "Honey in 2024"
    valor: 6772329
    unidade: "kg"
    nota: "Em 2008 foram 2.061.425 kg; a parte do Brasil passou de 5,4% para 10,1%"
    nota_en: "In 2008 it was 2,061,425 kg; the share of Brazil went from 5.4% to 10.1%"
  - tipo: numero
    rotulo: "Mel na região intermediária de Bauru"
    rotulo_en: "Honey in the Bauru intermediate region"
    valor: 43.3
    unidade: "%"
    nota: "2.930.210 kg em 2024"
    nota_en: "2,930,210 kg in 2024"
  - tipo: barras
    rotulo: "Maiores produtores em 2024"
    rotulo_en: "Largest producers in 2024"
    unidade: "kg"
    itens:
      - { rotulo: "Itatinga", valor: 750000, cor: "#a8711a" }
      - { rotulo: "Botucatu", valor: 725000, cor: "#a8711a" }
      - { rotulo: "Cabrália Paulista", valor: 343000, cor: "#a8711a" }
      - { rotulo: "Agudos", valor: 317018, cor: "#a8711a" }
      - { rotulo: "Capão Bonito", valor: 270000, cor: "#a8711a" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/animal-sp-2026/sp_mel_2024.gpkg.zip
    rotulo: "Três camadas, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Three layers, SIRGAS 2000, with QGIS styles"
    tamanho: "18,5 MB"
  - formato: csv
    arquivo: dados/sp_mel_2024.csv
    rotulo: "Mel em 2008 e 2024 por município"
    rotulo_en: "Honey in 2008 and 2024 by municipality"
    tamanho: "37 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/animal-sp-2026/sp_mel_2024_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/animal-sp-2026/sp_mel_2024_prancha.en.svg
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

# Mel em São Paulo, 2024

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 073, a terceira de cinco da coleção **Leite, ovos, mel e peixe**: a produção animal que
mais cresceu no estado desde 2008.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `municipios` | polígono | 645 municípios: `CD_MUN`, `NM_MUN`, região intermediária, `producao_2008` e `producao_2024` (kg de mel de abelha) e `situacao_2024` (`valor`, `zero`, `nao_disponivel` ou `fora_da_tabela`) |
| `regioes_intermediarias` | polígono | 11 regiões geográficas intermediárias |
| `limite_estadual` | polígono | contorno do estado |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `animal-sp-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/animal-sp-2026).
A camada `municipios` já abre no QGIS com as classes da prancha (estilo `producao`).

O **CSV** traz a tabela dos municípios, em UTF-8, sem geometria. Célula vazia quer dizer sem
informação; 0 quer dizer zero.

## Método

1. Tabela 74 da Pesquisa da Pecuária Municipal no SIDRA: *Produção de origem animal*, produto
   *Mel de abelha* (quilogramas), anos 2008 a 2024, nível município, estado de São Paulo. O total
   do Brasil, para a parte paulista, soma todos os municípios do país na mesma tabela.
2. Produção de 2024 em seis classes por quantis dos municípios com produção positiva, com limites
   arredondados a dois algarismos significativos. A legenda da prancha mostra os limites em kg.
3. Situação do dado: `zero` onde o IBGE publica um traço; `nao_disponivel` onde publica «X» ou
   «...»; `fora_da_tabela` onde o município não aparece.

## Limitações

- A PPM é uma estimativa municipal do IBGE feita com informantes locais; o mel é contado onde as
  colmeias estão segundo esses informantes, e apiários que migram com a florada podem ser
  registrados num só município.
- Valores redondos, como os 750.000 kg de Itatinga e os 725.000 kg de Botucatu, indicam
  estimativa, não pesagem.
- 32 municípios ficam sem informação em 2024, quase todos na Grande São Paulo e no litoral.

## Licença dos dados

Dados abertos do IBGE, de uso livre com citação da fonte.
