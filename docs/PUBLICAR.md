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

---

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
