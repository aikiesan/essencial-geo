# ESSENCIAL GEO

*O essencial é invisível aos olhos — até ser traduzido em um mapa.*

Feed cartográfico, repositório de dados abertos e portfólio contínuo de mapas temáticos do Brasil.
Um mapa novo a cada dois dias, cada um com a prancha final, as bases vetoriais (GeoPackage e DXF),
o sistema de referência declarado e uma citação com DOI.

**Site:** https://aikiesan.github.io/essencial-geo/ · **Acervo:** [Comunidade Zenodo](https://zenodo.org/communities/essencial-geo) · **Licença:** [CC BY 4.0](LICENSE)

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
│   └── 001-densidade-urbana-grade-estatistica/
│       ├── README.md        ← ficha técnica (frontmatter) + notas de método — fonte única de verdade
│       ├── mapa_preview.png ← imagem do feed (~2400 px)
│       ├── prancha_impressao.pdf
│       └── dados/           ← .gpkg(.zip), .dxf, .csv
│
├── templates/mapa/          ← modelo copiado por `npm run novo-mapa`
├── scripts/                 ← novo mapa, sincronização, exemplos, Zenodo
├── src/                     ← site (Astro): layout, componentes, estilos
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
npm run novo-mapa -- "Renda domiciliar na RMC" censo-renda
```

Outros comandos:

| Comando | O que faz |
| --- | --- |
| `npm run build` | Valida todos os frontmatters e gera o site estático em `dist/` |
| `npm run preview` | Serve `dist/` localmente |
| `npm run exemplos` | Regenera as quatro pranchas-modelo (dados sintéticos) |
| `npm run zenodo -- <pasta> --simular` | Mostra o que seria enviado ao Zenodo, sem enviar |

## Fluxo de publicação

1. **GitHub** — a pasta do mapa entra em `mapas/` (commit na `main`).
2. **Pages** — a Action `deploy.yml` recompila o site; a prancha aparece no topo do feed.
3. **Zenodo** — Actions → *Publicar no Zenodo* → informe a pasta. O mapa ganha um DOI próprio, gravado de
   volta no `README.md`; o site passa a exibir a citação com DOI.
4. **ORCID / Lattes** — o DOI aparece no ORCID automaticamente (via DataCite) e é registrado no Lattes como
   produção técnica.

O passo a passo completo, incluindo a configuração inicial do GitHub Pages, do Zenodo e do ORCID, está em
[`docs/PUBLICAR.md`](docs/PUBLICAR.md).

## Documentação

- [`docs/PUBLICAR.md`](docs/PUBLICAR.md) — configuração inicial e rotina de publicação (QGIS → GitHub → Zenodo → Lattes)
- [`docs/CONTEUDO.md`](docs/CONTEUDO.md) — referência de todos os campos do frontmatter, tom de voz e checklist
- [`docs/ESTILO.md`](docs/ESTILO.md) — sistema visual do site e convenções cartográficas das pranchas

## As pranchas 001–004

As quatro primeiras pranchas são **pranchas-modelo com dados sintéticos** (ruído fractal semeado, gerado por
`scripts/gerar-exemplos.mjs`). Elas fixam a linguagem visual de cada série e demonstram o feed e os
downloads; nenhuma representa um lugar real, e todas levam o selo “dados sintéticos”. Substitua-as ou
marque `rascunho: true` quando os primeiros mapas reais estiverem prontos.

## Licença

Pranchas, dados derivados e textos: [Creative Commons Atribuição 4.0 Internacional (CC BY 4.0)](LICENSE).
Você pode copiar, adaptar e usar comercialmente — numa prancha de projeto, num relatório, num artigo — desde
que cite a fonte. Os dados de origem (IBGE, INPE, MapBiomas, OpenStreetMap…) seguem as licenças dos seus
produtores, indicadas em cada ficha.

Como citar o atlas como um todo: use o botão *Cite this repository* do GitHub (gerado a partir de
[`CITATION.cff`](CITATION.cff)). Para um mapa específico, use a citação ABNT/BibTeX da ficha técnica dele.
