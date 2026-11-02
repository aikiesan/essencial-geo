---
numero: 166
titulo: "Um mapa por combustível"
subtitulo: "Fora da cana e da celulose, quase oito em cada dez megawatts ainda queimam madeira"
data: 2027-03-01
rascunho: true
categoria: energia
colecao: combustivel-biomassa-br
tags: [combustivel-biomassa-br, brasil, biomassa, lenha, casca-de-arroz, biogas, aterro, aneel]

contexto: >-
  Tirando o bagaço de cana e o licor negro das fábricas de celulose, sobram 202 usinas a biomassa em operação no Brasil, com 1,89 GW. Quase oito em cada dez desses megawatts (78%) queimam madeira: cavaco e resíduos florestais, lenha, carvão vegetal e o gás dos altos-fornos a carvão. Parte da lenha nova vai para o etanol de milho: só a Inpasa tem seis usinas, com 315 MW, no Centro-Oeste, na Bahia e no Maranhão. A casca de arroz é do Sul: 11 das 16 usinas e 90% da potência ficam no Rio Grande do Sul. Roraima tem 80 MW em sete usinas de capim-elefante, palma e cavaco, seis delas de 2022 e 2023. O lixo e o esgoto somam 243 MW, quase todo em biogás de aterro, com a maior usina em Caieiras (SP). Segunda prancha da coleção «O que mais a usina queima».

imagem: ./mapa_preview.png
imagem_alt: "Três mapas do Brasil em projeção cônica de Albers com círculos proporcionais à potência das usinas a biomassa que não queimam bagaço de cana nem licor negro, um mapa por família de combustível. No primeiro, a madeira: cavaco e resíduos florestais em verde, lenha em ocre e carvão vegetal em cinza-escuro, espalhados do Sul a Mato Grosso, com uma chamada para as seis usinas da Inpasa. No segundo, a lavoura e a granja: casca de arroz em amarelo concentrada no Rio Grande do Sul, capim-elefante e palma em Roraima e no Pará, biogás rural no Sul e em São Paulo, com chamadas para o Rio Grande do Sul e Roraima. No terceiro, o lixo e o esgoto: biogás de aterro em azul nas capitais do litoral e em São Paulo, com uma chamada para Caieiras. No quarto quadro, uma barra de potência por combustível; no painel, a maior usina de cada um."

recorte: "Brasil"
fontes:
  - nome: "ANEEL — Sistema de Informações de Geração (SIGA), empreendimentos de geração, dados abertos de 01/10/2026 (acesso em 01/11/2026)"
    nome_en: "ANEEL — Generation Information System (SIGA), generation projects, open data of 01/10/2026 (accessed 01/11/2026)"
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
software: ["Python", "pandas", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Usinas a biomassa do SIGA cujo combustível não é bagaço de cana nem licor negro (224, 202 em operação), com os 14 combustíveis do cadastro reunidos em nove grupos e três famílias (madeira, lavoura e granja, lixo e esgoto), pela potência outorgada e pela coordenada do cadastro."

camadas:
  - { nome: usinas, tipo: ponto, cor: "#2f5d3a", descricao: "224 usinas a biomassa sem cana nem licor negro (202 em operação): nome, CEG, UF, município, fase, combustível do SIGA, grupo, família, potência outorgada, ano de entrada em operação, dono", descricao_en: "224 biomass plants with no cane or black liquor (202 operating): name, CEG code, state, municipality, phase, SIGA fuel, group, family, licensed capacity, start year, owner" }
  - { nome: ufs, tipo: poligono, cor: "#5c6166", descricao: "27 UFs", descricao_en: "27 states" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Potência a biomassa sem cana nem licor negro, em operação, 01/10/2026"
    rotulo_en: "Operating biomass capacity with no cane or black liquor, 01/10/2026"
    valor: 1.89
    unidade: "GW"
    nota: "202 usinas; 78% delas queimam madeira"
    nota_en: "202 plants; 78% of the capacity burns wood"
  - tipo: barras
    rotulo: "Potência em operação por combustível"
    rotulo_en: "Operating capacity by fuel"
    unidade: "MW"
    itens:
      - { rotulo: "cavaco e resíduos florestais", valor: 967, cor: "#2f5d3a" }
      - { rotulo: "lenha", valor: 354, cor: "#a0783c" }
      - { rotulo: "biogás de aterro e esgoto", valor: 210, cor: "#234e70" }
      - { rotulo: "carvão vegetal e gás de alto-forno", valor: 154, cor: "#3d3a36" }
      - { rotulo: "casca de arroz", valor: 89, cor: "#d4a62a" }
      - { rotulo: "biogás de granja e agroindústria", valor: 42, cor: "#4f8494" }
      - { rotulo: "lixo queimado ou carbonizado", valor: 33, cor: "#8a8f94" }
      - { rotulo: "óleo de palma e etanol", valor: 21, cor: "#d9622b" }
      - { rotulo: "capim-elefante", valor: 20, cor: "#7fae4e" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/combustivel-biomassa-br-2026/br_biomassa_sem_cana_combustiveis.gpkg.zip
    rotulo: "Usinas por combustível, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Plants by fuel, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,2 MB"
  - formato: csv
    arquivo: dados/br_biomassa_sem_cana_combustiveis.csv
    rotulo: "As 224 usinas, com combustível, potência, ano, dono e coordenadas"
    rotulo_en: "The 224 plants, with fuel, capacity, year, owner and coordinates"
    tamanho: "42 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/combustivel-biomassa-br-2026/br_biomassa_sem_cana_combustiveis_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/combustivel-biomassa-br-2026/br_biomassa_sem_cana_combustiveis_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "8,9 MB"
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

# Um mapa por combustível: as usinas a biomassa que não queimam cana nem licor negro

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 166, a segunda da coleção **O que mais a usina queima**. Depois do licor negro da
prancha 165, o resto: tudo o que as térmicas a biomassa do país queimam além do bagaço e da celulose.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `usinas` | ponto | 224 usinas: `nome`, `ceg`, `uf`, `municipio`, `fase`, `combustivel` (como no SIGA), `grupo`, `familia`, `potencia_kw` (outorgada), `ano_inicio`, `proprietario`, `regime`, `posicao` |
| `ufs` | polígono | 27 UFs |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `combustivel-biomassa-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/combustivel-biomassa-br-2026),
com os **estilos do QGIS** gravados (círculos por grupo, com o tamanho pela potência). O **CSV** fica
nesta pasta, em UTF-8, com a tabela das usinas sem geometria.

## Método

1. Cadastro de empreendimentos de geração da ANEEL (SIGA, dados abertos gerados em 01/10/2026,
   baixados em 01/11/2026): as usinas com `DscOrigemCombustivel` = «Biomassa», menos as de bagaço de
   cana e as de licor negro. Ficam 224, das quais 202 em operação e 22 em obra ou com obra não iniciada.
2. Os 14 combustíveis do SIGA viram nove grupos: cavaco e resíduos florestais («Resíduos
   Florestais»); lenha; carvão vegetal e gás de alto-forno («Carvão Vegetal», «Gás de Alto Forno -
   Biomassa»); casca de arroz; capim-elefante; óleo de palma e etanol («Óleos vegetais», «Etanol»);
   biogás de granja e agroindústria («Biogás-AGR», «Biogás - RA», «Biogás - Floresta»); biogás de
   aterro e esgoto («Biogás - RU»); lixo queimado ou carbonizado («Resíduos Sólidos Urbanos - RU»,
   «Carvão - RU»).
3. Três famílias, um mapa cada: madeira (os três primeiros grupos), lavoura e granja (os quatro
   seguintes) e lixo e esgoto (os dois últimos). Os três mapas usam a mesma escala de círculos.
4. Potência é a outorgada; a posição é a coordenada do cadastro ou, sem ela, o centro do município.

## Leitura

- As 202 usinas em operação somam 1,89 GW: madeira 1.475 MW (78%), lixo e esgoto 243 MW (13%),
  lavoura e granja 172 MW (9%).
- Cavaco e resíduos florestais: 77 usinas, 967 MW, a maior em Jacareí (SP), 108 MW, numa fábrica de celulose
  e papel da Suzano. Lenha: 17 usinas, 354 MW, a maior na usina de etanol de milho da Inpasa em Sinop
  (MT), 83 MW. As seis usinas da Inpasa somam 315 MW a lenha e cavaco.
- Carvão vegetal e gás de alto-forno: 18 usinas, 154 MW; 12 delas, com 120 MW, em Minas Gerais, a maioria
  em siderúrgicas. A maior é a da Usiminas em Ipatinga, 63 MW.
- Casca de arroz: 16 usinas, 89 MW; 11 delas, com 80 MW, no Rio Grande do Sul.
- Roraima tem sete usinas e 80 MW: uma de capim-elefante (BBF Baliza, 18 MW), uma de óleo de palma
  (Palmaplan, 12 MW) e cinco a cavaco; seis delas entraram em operação em 2022 e 2023.
- Biogás de aterro e esgoto: 27 usinas, 210 MW, a maior em Caieiras (SP), 30 MW. Biogás de granja e
  agroindústria: 28 usinas, 42 MW, a maior em Guariba (SP), 21 MW, da Raízen, com resíduos da
  cana.

## Limitações

- Potência outorgada não é geração; esta prancha mostra o que está instalado, não o que se queima de
  fato em cada mês.
- O combustível é o que o SIGA registra como principal; usinas que misturam combustíveis aparecem com
  um só.
- «Gás de Alto Forno - Biomassa» é a classe que a ANEEL dá ao gás dos altos-fornos a carvão vegetal;
  a prancha segue o cadastro.
- Nenhum número aqui é estimativa de potencial: só usinas registradas.

## Licença dos dados

Dados abertos da ANEEL e do IBGE, de uso livre com citação da fonte.
