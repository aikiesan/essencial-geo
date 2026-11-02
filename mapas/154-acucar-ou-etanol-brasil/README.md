---
numero: 154
titulo: "Açúcar ou etanol"
subtitulo: "São Paulo tira 76 kg de açúcar de cada tonelada de cana; Goiás, 39; Tocantins, nenhum"
data: 2027-02-01
rascunho: true
categoria: energia
colecao: sapcana-br
tags: [sapcana-br, brasil, cana-de-acucar, acucar, etanol, mix, sao-paulo, mapa]

contexto: >-
  Na safra 2025/26, o Brasil fez 43,4 milhões de toneladas de açúcar com 663,8 milhões de toneladas de cana: 65 kg por tonelada. Mas a conta muda de estado para estado. Alagoas, Paraná, São Paulo, Piauí e Minas Gerais tiram 72 a 81 kg de açúcar de cada tonelada; Goiás, Mato Grosso do Sul e Mato Grosso, de 32 a 40, e mandam o resto para o etanol; Tocantins não faz açúcar. São Paulo, com 52% da cana moída, fez 60% do açúcar do país. Em Mato Grosso e no Maranhão, as usinas que moem cana declararam 387 e 422 litros de etanol por tonelada, quatro vezes o que a cana rende: é o milho entrando nas mesmas usinas. Em duas safras, o açúcar caiu 5,3%, menos que a cana (−6,8%). Dados por UF dos relatórios mensais do SAPCana, do Ministério da Agricultura. Segunda prancha da coleção «A safra de cada estado».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers com as UFs coloridas pelos quilos de açúcar por tonelada de cana moída na safra 2025/26, em cinco classes de bege a marrom-escuro (nenhum açúcar, até 30, 30 a 50, 50 a 70 e 70 kg ou mais) e branco para as UFs sem cana. São Paulo, Minas Gerais, Paraná, Alagoas e Piauí ficam no tom mais escuro; Goiás, Mato Grosso, Mato Grosso do Sul, Paraíba, Rio Grande do Norte e Sergipe no tom do meio; Bahia, Maranhão e Rio de Janeiro no claro; Tocantins no bege de nenhum açúcar. Mato Grosso, Mato Grosso do Sul e Maranhão levam hachura, por declararem mais de 90 litros de etanol por tonelada de cana. Uma chamada aponta São Paulo, com 76 kg por tonelada e 60% do açúcar do país; outra aponta Mato Grosso, com 32 kg de açúcar e 387 litros de etanol por tonelada. No painel, um gráfico de halteres com os kg de açúcar e os litros de etanol por tonelada em cada UF, de 2023/24 a 2025/26, e a tabela do país nas três safras."

recorte: "Brasil"
fontes:
  - nome: "MAPA — Acompanhamento da produção sucroalcooleira (SAPCana): relatórios mensais por UF das safras 2023/2024, 2024/2025 e 2025/2026, com cana moída, açúcar e etanol anidro e hidratado acumulados desde 01/04 (36 arquivos .xls, acesso em 01/11/2026)"
    nome_en: "MAPA (Ministry of Agriculture) — Sugar and ethanol production monitoring (SAPCana): monthly reports by state for the 2023/2024, 2024/2025 and 2025/2026 harvests, with cane crushed, sugar and anhydrous and hydrated ethanol accumulated since 1 April (36 .xls files, accessed 01/11/2026)"
    url: https://www.gov.br/agricultura/pt-br/assuntos/sustentabilidade/agroenergia/acompanhamento-da-producao-sucroalcooleira
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
software: ["Python", "pandas", "GeoPandas", "xlrd", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Açúcar (t) e etanol anidro + hidratado (m³) divididos pela cana moída (t) de cada UF no fechamento das safras 2023/24 e 2025/26 (SAPCana/MAPA, acumulado de 01/04 a 31/03), em kg e litros por tonelada; hachura onde o etanol passa de 90 L/t, acima do rendimento da cana."

camadas:
  - { nome: ufs, tipo: poligono, cor: "#a8712c", descricao: "27 UFs: cana, açúcar e etanol em 2023/24 e 2025/26, kg de açúcar e litros de etanol por t de cana, parte no açúcar e na cana do país, etanol além da cana e classe", descricao_en: "27 states: cane, sugar and ethanol in 2023/24 and 2025/26, kg of sugar and litres of ethanol per t of cane, share of Brazil’s sugar and cane, ethanol beyond cane and class" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Açúcar produzido no Brasil, safra 2025/26"
    rotulo_en: "Sugar made in Brazil, 2025/26 harvest"
    valor: 43.4
    unidade: "milhões de t"
    nota: "65,4 kg por t de cana; 45,9 milhões de t e 64,4 kg/t em 2023/24"
    nota_en: "65.4 kg per t of cane; 45.9 million t and 64.4 kg/t in 2023/24"
  - tipo: numero
    rotulo: "Parte de São Paulo no açúcar do país, 2025/26"
    rotulo_en: "São Paulo’s share of Brazil’s sugar, 2025/26"
    valor: 60.4
    unidade: "%"
    nota: "com 52,0% da cana moída; 76,0 kg de açúcar por t"
    nota_en: "with 52.0% of the cane crushed; 76.0 kg of sugar per t"
  - tipo: barras
    rotulo: "Açúcar por tonelada de cana, 2025/26"
    rotulo_en: "Sugar per tonne of cane, 2025/26"
    unidade: "kg/t"
    itens:
      - { rotulo: "Alagoas", valor: 80.5, cor: "#6b4415" }
      - { rotulo: "Paraná", valor: 79.7, cor: "#6b4415" }
      - { rotulo: "São Paulo", valor: 76.0, cor: "#6b4415" }
      - { rotulo: "Minas Gerais", valor: 72.3, cor: "#6b4415" }
      - { rotulo: "Mato Grosso do Sul", valor: 39.7, cor: "#d4a55a" }
      - { rotulo: "Goiás", valor: 39.0, cor: "#d4a55a" }
      - { rotulo: "Mato Grosso", valor: 32.3, cor: "#d4a55a" }
      - { rotulo: "Tocantins", valor: 0, cor: "#e8e2d0" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/sapcana-br-2026/br_sapcana_acucar.gpkg.zip
    rotulo: "UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "States and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,1 MB"
  - formato: csv
    arquivo: dados/br_sapcana_acucar.csv
    rotulo: "As 19 UFs com cana, com açúcar e etanol por tonelada em 2023/24 e 2025/26"
    rotulo_en: "The 19 states with cane, with sugar and ethanol per tonne in 2023/24 and 2025/26"
    tamanho: "2 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/sapcana-br-2026/br_sapcana_acucar_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/sapcana-br-2026/br_sapcana_acucar_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "3,4 MB"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "0,2 MB"

doi_automatico: false
versao: "1.0.0"
discussoes: []
---

# Açúcar ou etanol: quanto açúcar cada UF tira da tonelada de cana

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 154, a segunda da coleção **A safra de cada estado**. A mesma tonelada de cana pode virar
açúcar ou etanol; o mapa mostra para que lado pende cada estado.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `ufs` | polígono | 27 UFs: `cana_2023_24`, `acucar_2023_24`, `etanol_2023_24`, `kg_acucar_t_2023_24`, `l_etanol_t_2023_24` e o mesmo para `2025_26` (t, t, m³, kg/t, L/t), `parte_acucar_br_pct`, `parte_cana_br_pct`, `etanol_alem_da_cana` (mais de 90 L/t), `classe` (−1 = sem cana) |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `sapcana-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/sapcana-br-2026),
com os **estilos do QGIS** gravados. O **CSV** fica nesta pasta, em UTF-8, com as 19 UFs que moem
cana, sem geometria.

## Método

1. Relatórios mensais do SAPCana (MAPA), baixados em 01/11/2026; o fechamento de cada safra é o
   relatório com o acumulado de 01/04 a 31/03 (ver a prancha 153).
2. Açúcar por tonelada = açúcar (t) ÷ cana moída (t) × 1.000; etanol por tonelada = etanol anidro +
   hidratado (m³) ÷ cana moída (t) × 1.000. São razões entre números declarados, sem fator de
   conversão.
3. Classes de açúcar: nenhum, até 30, 30 a 50, 50 a 70 e 70 kg/t ou mais.
4. Hachura: UFs com mais de 90 L de etanol por tonelada de cana. A cana rende, no máximo, perto disso
   (cerca de 150 kg de ATR por tonelada, todo em etanol hidratado, a 1,69 kg de ATR por litro);
   acima, o etanol declarado vem de outra matéria-prima nas mesmas usinas, em geral o milho.

## Leitura

- O país fez 45,9 milhões de t de açúcar em 2023/24 e 43,4 milhões em 2025/26 (−5,3%), com a cana
  caindo 6,8%: o açúcar por tonelada subiu de 64,4 para 65,4 kg.
- São Paulo moeu 52,0% da cana e fez 60,4% do açúcar (26,2 milhões de t), com 76,0 kg por tonelada
  (73,6 em 2023/24).
- No tom mais escuro: Alagoas (80,5 kg/t), Paraná (79,7), São Paulo (76,0), Piauí (73,1) e Minas
  Gerais (72,3, ante 68,9). Goiás tira 39,0 kg/t (35,4 em 2023/24), Mato Grosso do Sul 39,7 (43,2) e
  Mato Grosso 32,3. Tocantins não fez açúcar em nenhuma das três safras.
- O etanol por tonelada de cana passou de 75 para 95 L em Mato Grosso do Sul, de 322 para 387 L em
  Mato Grosso e de 77 para 422 L no Maranhão, onde o milho entrou em 2025/26.
- Pernambuco (73,4 → 68,0 kg/t), Rio Grande do Norte (56,2 → 47,1) e Sergipe (48,1 → 44,0) puseram
  menos cana no açúcar em 2025/26.

## Limitações

- O etanol do SAPCana é o declarado pelas usinas que moem cana, e inclui o de milho que elas fazem;
  as destilarias só de milho ficam de fora. A matéria-prima por UF está na prancha 133.
- Quilos de açúcar por tonelada dependem também do teor de açúcar (ATR) da cana, que varia com o clima
  e a região; a razão mostra a soma do «mix» e da riqueza da cana, não só a escolha da usina.
- Os relatórios são por UF; dentro de um estado convivem usinas de açúcar e destilarias.
- A janela de 01/04 a 31/03 corta ao meio a safra do litoral do Nordeste (setembro a agosto).

## Licença dos dados

Dados públicos do MAPA e do IBGE, de uso livre com citação da fonte.
