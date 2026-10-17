# Publicar no Essencial Geo

Três guias trabalham juntos:

- **este** — a rotina de cada mapa, do QGIS ao Lattes;
- [`ZENODO.md`](ZENODO.md) — configuração do Zenodo, tokens, ORCID e DOI;
- [`CALENDARIO.md`](CALENDARIO.md) — cadência, agendamento e pautas das próximas semanas.

Princípios que valem para tudo:

1. **Duas línguas.** Todo mapa e toda nota saem em português do Brasil e em inglês britânico. O build de
   produção falha se faltar a versão em inglês.
2. **Data de notícia.** Todo item tem `data:`. Data futura = agendado (entra no ar às 9h de Brasília).
3. **Commit é publicação.** Não há CMS: uma pasta em `mapas/` com `rascunho: false` é um mapa publicado.

---

## Configuração (já feita)

| | Estado |
| --- | --- |
| Autoria e ORCID (`src/site.config.ts`, `.zenodo.json`, `CITATION.cff`) | Preenchidos |
| Repositório e GitHub Pages (fonte: GitHub Actions) | No ar em https://aikiesan.github.io/essencial-geo/ |
| Recompilação diária às 9h05 (agenda) | `.github/workflows/deploy.yml` |
| Zenodo, comunidade, tokens, ORCID ↔ DataCite | **A fazer** — siga [`ZENODO.md`](ZENODO.md) |

**Domínio próprio (opcional):** em `astro.config.mjs`, troque `site` pelo domínio e `base` por `'/'`;
crie `public/CNAME` com o domínio e configure o DNS conforme a documentação do GitHub Pages.

---

## A rotina de cada mapa

### 1. Criar a pasta

```bash
npm run novo-mapa -- "Usinas de biogás em São Paulo" energia --en "Biogas plants in São Paulo" --data 2026-10-26
```

| Opção | |
| --- | --- |
| 1º argumento | Título em português (gera o nome da pasta: `005-usinas-biogas-sao-paulo`) |
| 2º argumento | Categoria: `uso-do-solo`, `censo-renda`, `altimetria-relevo`, `infraestrutura-dxf`, `hidrografia`, `biomas`, `energia` |
| `--en` | Título em inglês (pode ficar para depois, no `README.en.md`) |
| `--data` | Dia de saída. Sem ela, hoje. |

A pasta nasce com `README.md`, `README.en.md` e `rascunho: true`. Para criar categorias, edite
`CATEGORIA_IDS` em `src/site.config.ts`, os nomes em `src/i18n/ui.ts` (`categorias`, nas duas línguas) e a
lista em `scripts/novo-mapa.mjs`.

### 2. Exportar do QGIS

Monte **um layout por língua** (duplique o layout e troque os textos: título, legenda, carimbo, fonte). As
camadas e a simbologia são as mesmas.

| Saída | Como | Onde |
| --- | --- | --- |
| Prévia PT | Layout PT → *Export as Image*, PNG, **~2400 px** de largura | `mapa_preview.png` |
| Prévia EN | Layout EN → idem | `mapa_preview.en.png` |
| Prancha impressa | *Export as PDF*, “Always export as vectors”, texto como texto | `prancha_impressao.pdf` e `prancha_impressao.en.pdf` |
| GeoPackage | *Export → Save Features As…*, GeoPackage, SIRGAS 2000 (EPSG:4674 ou UTM 31978–31985) | `dados/<pasta>.gpkg`, compactado em `.zip` |
| DXF | *Project → Import/Export → Export Project to DXF*, “Feature symbology”, uma camada por tema | `dados/<pasta>.dxf` |

Os **dados não se traduzem**: um GPKG, um DXF, com nomes de camadas e colunas em português. Assim scripts,
estilos e modelos de CAD servem às duas versões.

Pela linha de comando, com GDAL:

```bash
ogr2ogr -f DXF dados/mapa.dxf dados/mapa.gpkg -t_srs EPSG:31983
```

**Projeção.** SIRGAS 2000. País inteiro: cônica equivalente (Albers, parâmetros do IBGE). Municípios e
regiões metropolitanas: UTM da zona (em SP, 22S = EPSG:31982 ou 23S = EPSG:31983). DXF sempre em metros.

**Tamanho.** O GitHub avisa acima de 50 MB e recusa acima de 100 MB por arquivo. Arquivos grandes vão para
uma release do GitHub ou só para o Zenodo, com `url:` em vez de `arquivo:`.

### 3. Escrever a ficha, nas duas línguas

Referência completa dos campos em [`CONTEUDO.md`](CONTEUDO.md).

**`README.md`** — ficha completa:

- `contexto` — **um** parágrafo, até 900 caracteres;
- `imagem_alt`, `fontes` (com `nome_en`), `crs`, `epsg`, `escala`, `software`;
- `camadas` — o painel de camadas (nome, tipo de geometria, descrição PT/EN);
- `indicadores` — a leitura rápida (número, barras, rosca), **só com números calculados dos dados**;
- `downloads` — com `arquivo_en` para a prancha e o PDF em inglês.

**`README.en.md`** — só o texto: `titulo`, `subtitulo`, `contexto`, `imagem: ./mapa_preview.en.png`,
`imagem_alt`, e o corpo (*Method*, *Files*, *How to reproduce*). Inglês britânico: *colour, centre, licence*.

Escreva primeiro em português; traduza com o mapa aberto ao lado, não só o texto. Se usar tradução
automática como rascunho, revise cada frase — principalmente nomes de fontes e termos técnicos.

### 4. Conferir

```bash
npm run dev
```

- `http://localhost:4321/essencial-geo/` e `…/essencial-geo/en/` — o cartão nas duas línguas.
- Data futura mostra o selo **Agendado**; falta de `README.en.md` mostra **Tradução pendente**.
- Se um campo estiver errado, o terminal diz qual.

```bash
npm run build
```

O build de produção é o juiz final: ele falha se um mapa publicado não tiver versão em inglês.

### 5. Publicar (ou agendar)

1. Mude `rascunho: true` para `false`.
2. Commit e push:
   ```bash
   git add mapas/005-usinas-biogas-sao-paulo
   git commit -m "Nº 005: Usinas de biogás em São Paulo"
   git push
   ```
3. `data` de hoje (antes das 9h, sai às 9h; depois, sai em ~1 minuto) ou futura (sai às 9h do dia).

### 6. DOI

Depois que o mapa estiver no ar: *Actions → Publicar no Zenodo*, primeiro no sandbox, depois de verdade.
Detalhes em [`ZENODO.md`](ZENODO.md).

### 7. Lattes

**Produção técnica → Demais tipos de produção técnica → Cartas, mapas ou similares** (os nomes podem variar
entre versões da Plataforma). Título, ano, meio de divulgação “Meio digital” e
`https://doi.org/<doi>`. Uma vez por mês, todos os DOIs do mês de uma vez.

### 8. Divulgar

No dia de saída, depois das 9h: r/MapPorn, r/dataisbeautiful (exige `[OC]` e um comentário com fonte e
ferramenta — a ficha já tem os dois), LinkedIn. Use a página em inglês nos espaços internacionais. Depois:

```yaml
discussoes:
  - onde: r/MapPorn
    url: https://www.reddit.com/r/MapPorn/comments/…
```

## Série «Brasil, estado por estado»

As 27 pranchas não passam pelo QGIS: saem de três scripts, na ordem, a partir dos dados do IBGE e do
MapBiomas. A lista (número, pasta e data de saída) está em `scripts/estados/serie.json`.

```bash
.venv-geo/Scripts/python scripts/estados/preparar.py RJ --pasta 002-estado-rio-de-janeiro
node scripts/estados/prancha.mjs RJ --pasta 002-estado-rio-de-janeiro --numero 2 --data 2026-10-26
node scripts/estados/readme.mjs RJ
```

1. `preparar.py` grava em `dados/` o CSV e o GPKG e o DXF compactados, e o cache da prancha em
   `scripts/estados/cache/` (fora do Git). `--so-prancha` refaz só o cache.
2. `prancha.mjs` desenha a prancha em português e em inglês (PNG e SVG). Rotulagem, cores e cantos
   (localizador, norte em folha, ilhas oceânicas) são escolhidos pelo script; confira a prancha ampliada.
3. `readme.mjs` escreve `README.md` e `README.en.md` com os números do cache. O contexto de SP e do DF é
   escrito à mão, dentro do script; os demais seguem um molde. Revise o texto antes do commit.

**Arquivos grandes na release.** Os `*_divisao_territorial.{gpkg,dxf}.zip` e as pranchas em vetor
(`*_prancha.svg`, `*_prancha.en.svg`) ficam fora do Git (`.gitignore`): as fichas apontam para os anexos da
release `estados-2025`. No repositório ficam só a prévia em PNG e o CSV. Para criar a release com os 27
estados (uma vez, depois do push):

```bash
gh release create estados-2025 mapas/*/dados/*_divisao_territorial.*.zip mapas/*/dados/*_prancha*.svg --title "Brasil, estado por estado — bases 2025" --notes "GeoPackage (EPSG:4674), DXF (EPSG:5880) e prancha em SVG (PT e EN) de cada unidade da federação. Fichas em https://aikiesan.github.io/essencial-geo/"
```

Para trocar o arquivo de um estado depois (correção): `gh release upload estados-2025 <arquivo> --clobber`.
O `zenodo-publicar.mjs` baixa esses anexos sozinho quando eles não estão na pasta, de modo que o DOI de
cada estado leva o GPKG, o DXF e o SVG.

---

## Buscadores (uma vez)

O site gera sozinho o que os indexadores leem:

| O quê | Para quem |
| --- | --- |
| `sitemap.xml` com os pares PT/EN de cada página | Google, Bing |
| schema.org/Dataset em cada mapa (DOI, licença, autor com ORCID, arquivos, recorte) | **Google Dataset Search** |
| Etiquetas `citation_*` (título, autor, data, DOI, PDF) | Google Scholar, Zotero, Mendeley |
| schema.org/BlogPosting nas notas; WebSite + Person na página inicial | Google |

Pranchas-modelo (`exemplo: true`) ficam de fora do Dataset e das etiquetas de citação.

**O que é seu:** cadastrar o site no [Google Search Console](https://search.google.com/search-console)
(propriedade do tipo *prefixo do URL*: `https://aikiesan.github.io/essencial-geo/`, verificação pela
etiqueta HTML: copie só o valor de `content="…"` para `SITE.verificacao.google` em `src/site.config.ts`, faça commit e push, e clique em *Verificar*) e enviar
`https://aikiesan.github.io/essencial-geo/sitemap.xml` em *Sitemaps*. Depois, o mesmo no
[Bing Webmaster Tools](https://www.bing.com/webmasters), que importa do Search Console.

> **robots.txt:** num site de projeto do GitHub Pages, buscadores só leem `aikiesan.github.io/robots.txt`.
> O `robots.txt` gerado aqui passa a valer com um domínio próprio; até lá, o sitemap vai pelo Search Console.

Para testar um mapa: [Rich Results Test](https://search.google.com/test/rich-results) ou
[validator.schema.org](https://validator.schema.org) com o endereço da página.

## Correções

Um mapa publicado não é apagado nem reescrito em silêncio, como numa redação:

1. Corrija; aumente `versao` e preencha `atualizado:` (aparece como “Atualizado em …” ao lado da data).
2. Acrescente uma seção `## Histórico` nos dois READMEs dizendo o que mudou e por quê.
3. Nova versão no Zenodo (*nova versão* marcado na Action).

## Notas

```text
notas/2026-10-31-agenda-novembro/
├── pt.md
└── en.md
```

Mesmo frontmatter nas duas (`titulo`, `resumo`, `data`, `tipo`, `tags`), texto em cada língua. Tipos e
frequência em [`CALENDARIO.md`](CALENDARIO.md).

---

## Checklist do mapa

- [ ] SIRGAS 2000 declarado (`crs` e `epsg`)
- [ ] Fonte com ano, link e `nome_en`
- [ ] Paleta perceptualmente uniforme para dados contínuos
- [ ] `contexto` com um único parágrafo, sem jargão desnecessário — nas duas línguas
- [ ] `imagem_alt` descreve o padrão principal — nas duas línguas
- [ ] `mapa_preview.png` e `mapa_preview.en.png` (~2400 px); PDFs vetoriais
- [ ] GeoPackage e DXF em coordenadas projetadas, uma camada por tema
- [ ] `camadas` e `indicadores` conferidos contra os dados
- [ ] `data` certa (hoje ou o dia agendado) e `rascunho: false`
- [ ] `npm run build` sem erro
- [ ] DOI gerado (depois de no ar) e registrado no Lattes
