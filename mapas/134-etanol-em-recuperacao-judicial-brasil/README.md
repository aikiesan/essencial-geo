---
numero: 134
titulo: "Produzir em recuperação judicial"
subtitulo: "41 das 43 destilarias com a marca já a carregavam em 12/2018"
data: 2026-12-11
rascunho: true
categoria: energia
colecao: etanol-br
tags: [etanol-br, brasil, etanol, destilarias, recuperacao-judicial, capacidade-autorizada, parana, anp]

contexto: >-
  Em agosto de 2026, 43 das 370 destilarias autorizadas pela ANP tinham «em recuperação judicial» no nome empresarial registrado: 7,7% da capacidade de etanol do país, 21,7 mil m³ por dia, de 31 empresas. Não é uma onda recente: 41 delas já carregavam a marca em dezembro de 2018, quando eram 58 e somavam 11,4% da capacidade; desde então, 13 saíram do registro, 4 trocaram de CNPJ e só 2 entraram. O peso maior está no Paraná, onde as 12 destilarias com a marca, dez delas da mesma empresa, têm 37% da capacidade do estado; em São Paulo são outras 12, mas só 6,9%. Em Sergipe, no Rio Grande do Norte e no Rio de Janeiro, uma única destilaria com a marca tem perto de metade da capacidade estadual. A marca vem do nome registrado, que a lei manda usar durante o processo; a prancha não confere cada caso na Justiça. Terceira prancha da coleção «A nova geografia do etanol».

imagem: ./mapa_preview.png
imagem_alt: "Mapa do Brasil em projeção cônica de Albers com as UFs coloridas pela parte da capacidade de etanol em destilarias cujo nome traz «em recuperação judicial», em quatro tons de rosa a castanho, cinza-claro para as UFs com destilaria mas nenhuma com a marca e branco para as sem destilaria. Paraná, Rio de Janeiro, Sergipe e Rio Grande do Norte aparecem no tom mais escuro, Alagoas no seguinte, São Paulo e Goiás no médio e Minas Gerais, Mato Grosso e Mato Grosso do Sul no mais claro. Por cima, círculos por município, de área proporcional à capacidade: roxos cheios para as destilarias com a marca e anéis cinzentos para as demais, amontoados em São Paulo, Goiás e no norte do Paraná. Duas chamadas: Paraná, com 37% da capacidade e 12 destilarias com a marca, 10 delas da mesma empresa, e São Paulo, com 12 destilarias e 7,7 mil m³/dia, 6,9% da capacidade paulista. No painel, as classes com as UFs, as barras das 58 destilarias com a marca em 12/2018 e das 43 em 08/2026 e a linha mensal da parte da capacidade do país, de 11,4% a 7,7%."

recorte: "Brasil"
fontes:
  - nome: "ANP — Painel Dinâmico de Produtores de Etanol: capacidade autorizada por usina e mês, com a razão social registrada (pb-da-etanol.zip)"
    nome_en: "ANP — Ethanol Producers Dynamic Panel: authorised capacity by plant and month, with the registered company name (pb-da-etanol.zip)"
    url: https://www.gov.br/anp/pt-br/assuntos/producao-e-fornecimento-de-biocombustiveis/etanol/arquivos-etanol/pb-da-etanol.zip
    ano: 2026
  - nome: "Lei nº 11.101/2005 (recuperação judicial e falência), art. 69"
    nome_en: "Law No. 11,101/2005 (judicial recovery and bankruptcy), art. 69"
    url: https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2005/lei/l11101.htm
    ano: 2005
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
metodo: "Destilarias do painel da ANP em 08/2026 cuja razão social registrada contém «em recuperação judicial», com a capacidade autorizada (a maior entre anidro e hidratado) somada por UF e comparada à capacidade total da UF; o fluxo por CNPJ compara 12/2018 e 08/2026."

camadas:
  - { nome: usinas, tipo: ponto, cor: "#6b3d5c", descricao: "370 destilarias registradas em 08/2026, no ponto do município: CNPJ, razão social, capacidade e a marca de recuperação judicial", descricao_en: "370 distilleries registered in 08/2026, at the municipality point: CNPJ, company name, capacity and the judicial-recovery tag" }
  - { nome: ufs, tipo: poligono, cor: "#b8735a", descricao: "27 UFs: capacidade total, destilarias e capacidade com a marca e parte da capacidade da UF", descricao_en: "27 states: total capacity, distilleries and capacity with the tag, and share of state capacity" }
  - { nome: limite_nacional, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do país", descricao_en: "National boundary" }

indicadores:
  - tipo: numero
    rotulo: "Capacidade em destilarias com «em recuperação judicial» no nome, 08/2026"
    rotulo_en: "Capacity in distilleries with «em recuperação judicial» in their name, 08/2026"
    valor: 7.7
    unidade: "% do país"
    nota: "43 de 370 destilarias, 21,7 mil m³/dia, 31 empresas"
    nota_en: "43 of 370 distilleries, 21.7 thousand m³/day, 31 companies"
  - tipo: numero
    rotulo: "Destilarias com a marca em 12/2018"
    rotulo_en: "Distilleries with the tag in 12/2018"
    valor: 58
    unidade: "destilarias"
    nota: "11,4% da capacidade; 41 ainda com a marca em 08/2026"
    nota_en: "11.4% of capacity; 41 still tagged in 08/2026"
  - tipo: barras
    rotulo: "Parte da capacidade da UF com a marca, 08/2026"
    rotulo_en: "Share of state capacity with the tag, 08/2026"
    unidade: "%"
    itens:
      - { rotulo: "Rio de Janeiro", valor: 53.6, cor: "#7e3b28" }
      - { rotulo: "Sergipe", valor: 50.1, cor: "#7e3b28" }
      - { rotulo: "Rio Grande do Norte", valor: 46.0, cor: "#7e3b28" }
      - { rotulo: "Paraná", valor: 37.4, cor: "#7e3b28" }
      - { rotulo: "Alagoas", valor: 22.0, cor: "#b8735a" }
      - { rotulo: "Goiás", valor: 10.4, cor: "#ddb09c" }
      - { rotulo: "São Paulo", valor: 6.9, cor: "#ddb09c" }
      - { rotulo: "Minas Gerais", valor: 2.9, cor: "#f2dfd6" }
      - { rotulo: "Mato Grosso", valor: 1.9, cor: "#f2dfd6" }
      - { rotulo: "Mato Grosso do Sul", valor: 1.3, cor: "#f2dfd6" }

downloads:
  - formato: gpkg
    url: https://github.com/aikiesan/essencial-geo/releases/download/etanol-br-2026/br_etanol_recuperacao_judicial.gpkg.zip
    rotulo: "Destilarias, UFs e limite, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "Distilleries, states and boundary, SIRGAS 2000, with QGIS styles"
    tamanho: "1,2 MB"
  - formato: csv
    arquivo: dados/br_etanol_recuperacao_judicial.csv
    rotulo: "As 370 destilarias de 08/2026, como no registro da ANP"
    rotulo_en: "All 370 distilleries of 08/2026, as in the ANP register"
    tamanho: "37 kB"
  - formato: svg
    url: https://github.com/aikiesan/essencial-geo/releases/download/etanol-br-2026/br_etanol_recuperacao_judicial_prancha.svg
    url_en: https://github.com/aikiesan/essencial-geo/releases/download/etanol-br-2026/br_etanol_recuperacao_judicial_prancha.en.svg
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

# Produzir em recuperação judicial: destilarias com a marca no nome, por UF, 2018 e 2026

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº 134, a terceira da coleção **A nova geografia do etanol**. Enquanto a capacidade sobe
para o Centro-Oeste, uma parte dela segue em empresas sob proteção da Justiça — quase sempre as
mesmas desde 2018, e mais no Paraná e no Nordeste que no Centro-Oeste.

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| `usinas` | ponto | 370 destilarias de 08/2026: `cnpj`, `razao_social` (como registrada na ANP), `SIGLA_UF`, `CD_MUN`, `NM_MUN`, `regiao`, `anidro_m3d`, `hidratado_m3d`, `capacidade_m3d`, `recuperacao_judicial` |
| `ufs` | polígono | 27 UFs: `SIGLA_UF`, `regiao`, `cap_total_m3d`, `usinas_rj`, `cap_rj_m3d`, `pct_rj` e `classe` (−1 sem destilaria com a marca, −2 sem destilaria) |
| `limite_nacional` | polígono | contorno do país |

O **GPKG** vai compactado (ZIP) nos anexos da
[release `etanol-br-2026`](https://github.com/aikiesan/essencial-geo/releases/tag/etanol-br-2026).
As camadas trazem o **estilo do QGIS** da prancha. O **CSV** fica nesta pasta, em UTF-8, com a
tabela das destilarias sem geometria. Os arquivos reproduzem o registro público da ANP, com a razão
social e o CNPJ; a prancha mostra só contagens e capacidades, sem nomear empresas.

## Método

1. Painel Dinâmico de Produtores de Etanol da ANP (`pb-da-etanol.zip`, baixado em 18/10/2026),
   arquivos `Etanol_Capacidade 2018_2020.csv` e `Etanol_Capacidade 2021_2026.csv`: uma linha por
   destilaria (CNPJ) e mês, com a razão social registrada e a capacidade autorizada de anidro e de
   hidratado, em m³/dia. A capacidade de cada destilaria é a maior das duas.
2. Marca: a razão social, sem acentos e em maiúsculas, contém «RECUPERACAO JUDICIAL». A Lei
   11.101/2005, art. 69, manda acrescentar «em Recuperação Judicial» ao nome empresarial em todos
   os atos do devedor durante o processo.
3. Por UF, a capacidade das destilarias com a marca dividida pela capacidade de todas as
   destilarias da UF em 08/2026. Classes: até 5%, 5 a 15%, 15 a 30% e 30% ou mais.
4. Empresas contadas pela raiz do CNPJ (os oito primeiros dígitos): 31 entre as 43 destilarias com
   a marca, 279 entre as 370.
5. Fluxo por CNPJ entre 12/2018 e 08/2026. Das 58 destilarias com a marca em 12/2018, 41 seguem
   com ela, nenhuma tirou a marca do nome sem sair do registro e 17 saíram do registro. Dessas 17, 4
   foram contadas como «outro CNPJ»: no mesmo município aparece em 08/2026 um CNPJ que não existia
   em 12/2018, com a mesma capacidade — provável troca de titular, não fechamento. Duas destilarias
   com a marca em 08/2026 não estavam no registro em 12/2018.
6. A série mensal (parte da capacidade nacional com a marca) começa em 12/2018: ao longo de 2018, o
   painel vai incorporando destilarias (273 em janeiro, 371 em dezembro).
7. Cada município é desenhado num ponto interno do seu polígono; municípios com várias destilarias
   somam todas no mesmo ponto.

## Leitura

- As destilarias com a marca são menores que as demais: 506 m³/dia em média, contra 800.
- A marca é antiga: pelo menos metade das 43 aparece com ela em todos os 104 meses do painel, de 01/2018 a
  08/2026, e 29 já a tinham no primeiro mês.
- Por região, o Sudeste soma 15 destilarias com a marca (9,0 mil m³/dia), o Sul 12 (5,0 mil), o
  Centro-Oeste 10 (5,6 mil) e o Nordeste 6 (2,1 mil); o Norte, nenhuma.
- A parte nacional caiu de 11,4% (12/2018) para 7,7% (08/2026), mais pelas saídas e pelo
  crescimento das outras destilarias do que por empresas que saíram do processo.

## Limitações

- A marca vem do nome registrado na ANP, que pode se atrasar em relação à Justiça: uma empresa que
  saiu da recuperação pode seguir com o nome antigo por um tempo, e o contrário. A prancha não
  confere cada processo.
- Capacidade autorizada não é produção: uma destilaria em recuperação pode estar parada, e o mapa
  não diz quanto cada uma produz.
- A saída do registro não distingue fechamento, venda ou incorporação; a regra do «outro CNPJ»
  pega só as trocas com o mesmo município e a mesma capacidade.
- Recuperação judicial não é falência: é o processo em que a empresa segue operando enquanto
  renegocia as dívidas.

## Licença dos dados

Dados abertos da ANP e do IBGE, de uso livre com citação da fonte.
