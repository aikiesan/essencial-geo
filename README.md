# ESSENCIAL

*O essencial é invisível aos olhos — até ser traduzido em um mapa.*

**Português** · [English](#in-english)

Feed cartográfico, repositório de dados abertos e portfólio contínuo de mapas temáticos do Brasil.
Um mapa novo a cada dois dias, em **português e inglês**, cada um com a prancha final, as bases vetoriais
(GeoPackage e DXF), o sistema de referência declarado e uma citação com DOI.

**Site:** https://aikiesan.github.io/essencial-geo/ ([em inglês](https://aikiesan.github.io/essencial-geo/en/)) · **Acervo:** [Comunidade Zenodo](https://zenodo.org/communities/essencial-geo) · **Licença:** [CC BY 4.0](LICENSE)

---

## Manifesto

Saint-Exupéry escreveu que o essencial não se vê. Waldo Tobler, em 1970, deu à geografia a sua primeira
lei: todas as coisas se relacionam, mas as próximas se relacionam mais do que as distantes. Este atlas
trabalha entre as duas frases — procura nos dados abertos do Brasil as proximidades e as ausências que uma
planilha não mostra, e as desenha com rigor suficiente para que outros possam reutilizar.

Três leitores, um mesmo arquivo:

| Quem | O que encontra |
| --- | --- |
| **Arquitetos e urbanistas** | Bases vetoriais limpas em `.gpkg` e `.dxf`, por camada, prontas para a prancha |
| **Pesquisadores** | Dados com método declarado, SIRGAS 2000 e DOI permanente — citáveis no Lattes e no ORCID |
| **Quem só quer olhar** | Um feed de mapas com um parágrafo de contexto, à maneira de r/MapPorn e r/dataisbeautiful |

## Estrutura do repositório

```text
essencial-geo/
├── README.md                ← você está aqui
├── LICENSE                  ← CC BY 4.0
├── CITATION.cff             ← citação do atlas como um todo (GitHub mostra "Cite this repository")
├── .zenodo.json             ← autoria e comunidade usadas pelo Zenodo
├── .github/workflows/
│   ├── deploy.yml           ← compila e publica o site no GitHub Pages
│   └── zenodo.yml           ← publica UM mapa no Zenodo e grava o DOI no README dele
│
├── mapas/                   ← o atlas: uma pasta por prancha
│   └── 001-estado-sao-paulo/
│       ├── README.md        ← ficha técnica (frontmatter) + notas de método — fonte única de verdade
│       ├── README.en.md     ← o mesmo texto em inglês (título, contexto, notas de método)
│       ├── mapa_preview.png ← imagem do feed (~2400 px), e mapa_preview.en.png em inglês
│       └── dados/           ← .csv (GPKG e SVG vão como anexos de release)
│
├── notas/                   ← novidades, bastidores, método: uma pasta por nota, pt.md + en.md
├── templates/mapa/          ← modelo copiado por `npm run novo-mapa`
├── scripts/                 ← novo mapa, sincronização, série dos estados, Zenodo
├── src/                     ← site (Astro): páginas, componentes, estilos, textos da interface (src/i18n)
└── docs/                    ← guias de publicação, conteúdo e estilo
```

O `README.md` de cada pasta é lido duas vezes: o GitHub o mostra como ficha técnica e o site o usa como
conteúdo. Não há banco de dados nem CMS — publicar um mapa é fazer commit de uma pasta.

## Começar

Requer Node.js 20 ou superior.

```bash
npm install
npm run dev          # http://localhost:4321/essencial-geo/
```

Criar o próximo mapa:

```bash
npm run novo-mapa -- "Renda domiciliar na RMC" censo-renda --en "Household income in the Campinas region" --data 2026-11-23
```

Uma `--data` futura agenda o mapa: ele entra no ar às 9h de Brasília desse dia, na recompilação diária do site.

Outros comandos:

| Comando | O que faz |
| --- | --- |
| `npm run build` | Valida todos os frontmatters, exige a versão em inglês de cada mapa e nota publicados, e gera o site estático em `dist/` |
| `npm run preview` | Serve `dist/` localmente |
| `npm run zenodo -- <pasta> --simular` | Mostra o que seria enviado ao Zenodo, sem enviar |

## Fluxo de publicação

1. **GitHub** — a pasta do mapa, com `README.md` e `README.en.md`, entra em `mapas/` (commit na `main`).
2. **Pages** — a Action `deploy.yml` recompila o site a cada push e todo dia às 9h17 (reserva às 10h47); a prancha aparece no
   topo do feed nas duas línguas no dia da sua `data`.
3. **Zenodo** — Actions → *Publicar no Zenodo* → informe a pasta. O mapa ganha um DOI próprio, gravado de
   volta no `README.md`; o site passa a exibir a citação com DOI.
4. **ORCID / Lattes** — o DOI aparece no ORCID automaticamente (via DataCite) e é registrado no Lattes como
   produção técnica.

O passo a passo completo está em [`docs/PUBLICAR.md`](docs/PUBLICAR.md); a configuração do Zenodo e do ORCID,
em [`docs/ZENODO.md`](docs/ZENODO.md).

## Documentação

- [`docs/PUBLICAR.md`](docs/PUBLICAR.md) — a rotina de cada mapa, nas duas línguas (QGIS → GitHub → Zenodo → Lattes)
- [`docs/ZENODO.md`](docs/ZENODO.md) — comunidade, tokens, DOI por mapa, ORCID via DataCite
- [`docs/CALENDARIO.md`](docs/CALENDARIO.md) — cadência, agendamento por data e pautas das próximas semanas
- [`docs/CONTEUDO.md`](docs/CONTEUDO.md) — referência de todos os campos do frontmatter, `README.en.md`, notas e tom de voz
- [`docs/ESTILO.md`](docs/ESTILO.md) — paleta, sistema visual do site e convenções cartográficas das pranchas

## Série «Brasil, estado por estado»

As pranchas 001 a 027 formam a primeira série: uma base cartográfica de cada unidade da federação —
municípios, regiões geográficas imediatas e intermediárias, limite e rodovias —, com os mesmos arquivos e o
mesmo desenho, publicada às segundas, quartas e sextas de 17/10 a 23/12/2026. Tudo sai de quatro scripts em
[`scripts/estados/`](scripts/estados/): `preparar.py` (dados), `prancha.mjs` (prancha PT e EN), `estilos.py`
(estilos do QGIS gravados no GeoPackage, com as cores da prancha) e `readme.mjs` (fichas). O GeoPackage de
cada estado, compactado, fica nos anexos da release
[`estados-2025`](https://github.com/aikiesan/essencial-geo/releases/tag/estados-2025).

## Licença

Pranchas, dados derivados e textos: [Creative Commons Atribuição 4.0 Internacional (CC BY 4.0)](LICENSE).
Você pode copiar, adaptar e usar comercialmente — numa prancha de projeto, num relatório, num artigo — desde
que cite a fonte. Os dados de origem (IBGE, INPE, MapBiomas, OpenStreetMap…) seguem as licenças dos seus
produtores, indicadas em cada ficha.

Como citar o atlas como um todo: use o botão *Cite this repository* do GitHub (gerado a partir de
[`CITATION.cff`](CITATION.cff)). Para um mapa específico, use a citação ABNT, APA ou BibTeX da ficha técnica dele.

---

## In English

*What is essential is invisible to the eye — until it is drawn as a map.*

A cartographic feed, open-data repository and ongoing portfolio of thematic maps of Brazil, published in
**Brazilian Portuguese and British English**. A new map every two days, each with the final plate, vector
data (GeoPackage and DXF), a declared reference system and a citation with a DOI.

**Site:** https://aikiesan.github.io/essencial-geo/en/ · **Archive:** [Zenodo community](https://zenodo.org/communities/essencial-geo) · **Licence:** [CC BY 4.0](LICENSE)

Each map lives in its own folder under `mapas/`: `README.md` holds the technical sheet and the Portuguese
text, `README.en.md` the English text, and the data files are shared by both. Layer and file names stay in
Portuguese so that scripts, QGIS styles and CAD templates work with either version. Every map and note is
dated like a news item, and each map gets its own DOI on Zenodo.

Plates 001–004 are **sample plates built from synthetic data** and do not depict real places.

Plates, derived data and texts are released under
[Creative Commons Attribution 4.0 International (CC BY 4.0)](LICENSE). Source data (IBGE, INPE, MapBiomas,
OpenStreetMap…) keep their producers’ licences, listed in each technical sheet.
