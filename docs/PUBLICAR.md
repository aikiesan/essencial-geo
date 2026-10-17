# Publicar no Essencial Geo

Este guia tem duas partes: a **configuração inicial** (uma vez só) e a **rotina** de cada mapa
(a cada dois dias).

---

## Parte 1 — Configuração inicial

### 1.1 Identidade e autoria

Edite três arquivos com seus dados reais:

| Arquivo | Campos |
| --- | --- |
| `src/site.config.ts` | `AUTORIA` (sobrenome, nome, ORCID) e `LINKS` (Lattes, ORCID, Zenodo, GitHub) |
| `.zenodo.json` | `creators[0].name` no formato `Sobrenome, Nome`; acrescente `"orcid": "0000-…"` |
| `CITATION.cff` | `family-names`, `given-names`, `orcid` |

O sobrenome vai em caixa normal (`Silva`); a citação ABNT converte para `SILVA` sozinha.

### 1.2 Primeiro push

```bash
git init
git add .
git commit -m "Essencial Geo: estrutura inicial"
git branch -M main
git remote add origin https://github.com/aikiesan/essencial-geo.git
git push -u origin main
```

### 1.3 GitHub Pages

1. No repositório: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. O próximo push na `main` dispara `deploy.yml`. Em ~1 minuto o site está em
   `https://aikiesan.github.io/essencial-geo/`.

**Domínio próprio (opcional):** em `astro.config.mjs`, troque `site` pelo domínio e `base` por `'/'`;
crie `public/CNAME` com o domínio e configure o DNS conforme a documentação do GitHub Pages.

### 1.4 Zenodo

1. Entre em [zenodo.org](https://zenodo.org) com a conta do GitHub ou do ORCID.
2. **Comunidade:** *Communities → New community*, identificador `essencial-geo`. Se escolher outro
   identificador, ajuste `.zenodo.json` e `LINKS.zenodo`.
3. **Token:** *Account → Applications → Personal access tokens → New token*, com os escopos
   `deposit:write` e `deposit:actions`.
4. No GitHub: **Settings → Secrets and variables → Actions → New repository secret**, nome
   `ZENODO_TOKEN`.
5. **Sandbox para testes:** crie também uma conta em [sandbox.zenodo.org](https://sandbox.zenodo.org),
   gere um token lá e salve como `ZENODO_SANDBOX_TOKEN`. Os DOIs do sandbox não são reais — servem para
   ensaiar sem sujar o acervo.

> **DOI por mapa vs. DOI do atlas.** A integração nativa GitHub→Zenodo (*Account → GitHub*, ligar o
> repositório) arquiva o repositório inteiro a cada *release* — um DOI para o atlas como um todo. Ela é
> opcional e convive com a Action `zenodo.yml`, que dá a **cada mapa** o seu próprio registro e DOI. Para o
> Lattes, o que importa é o DOI de cada mapa.

### 1.5 ORCID

No ORCID: **Works → Add → Search & link → DataCite**, e autorize o DataCite a atualizar seu registro
automaticamente. A partir daí, todo DOI do Zenodo que tenha o seu ORCID entre os autores aparece no seu
ORCID sozinho. Por isso o ORCID precisa estar no `.zenodo.json`.

---

## Parte 2 — A rotina de cada mapa

### 2.1 Criar a pasta

```bash
npm run novo-mapa -- "Título do mapa" categoria
```

Categorias: `uso-do-solo`, `censo-renda`, `altimetria-relevo`, `infraestrutura-dxf`, `hidrografia`,
`biomas` (para criar outras, edite `CATEGORIAS` em `src/site.config.ts` e a lista em
`scripts/novo-mapa.mjs`).

A pasta nasce com `rascunho: true` — aparece em `npm run dev`, mas não no site publicado.

### 2.2 Exportar do QGIS

| Saída | Como | Onde |
| --- | --- | --- |
| Prévia do feed | Layout → *Export as Image*, PNG, **~2400 px** de largura (≈ 200 dpi numa A4 paisagem) | `mapa_preview.png` |
| Prancha impressa | Layout → *Export as PDF*, “Always export as vectors”, texto como texto | `prancha_impressao.pdf` |
| Prancha 300 dpi | Layout → *Export as Image*, 300 dpi (opcional; arquivo grande) | anexo de release ou Zenodo |
| GeoPackage | Camadas → *Export → Save Features As…*, GeoPackage, CRS SIRGAS 2000 (EPSG:4674 ou UTM 31978–31985) | `dados/<pasta>.gpkg`, compactado em `.zip` |
| DXF | *Project → Import/Export → Export Project to DXF*, modo de simbologia “Feature symbology”, uma camada por tema | `dados/<pasta>.dxf` |

Ou na linha de comando, com GDAL:

```bash
ogr2ogr -f DXF dados/mapa.dxf dados/mapa.gpkg -t_srs EPSG:31983
```

**Projeção.** Use SIRGAS 2000. Para o país inteiro, uma cônica equivalente (Albers com parâmetros do IBGE);
para municípios e regiões metropolitanas, UTM da zona correspondente (no estado de SP, 22S = EPSG:31982 ou
23S = EPSG:31983). O DXF deve sempre estar em coordenadas projetadas (metros), nunca em graus.

**Tamanho.** O GitHub avisa acima de 50 MB e recusa acima de 100 MB por arquivo. Para arquivos grandes,
não faça commit: anexe-os a uma release do GitHub ou deixe-os só no Zenodo e use `url:` em vez de
`arquivo:` no frontmatter.

### 2.3 Preencher a ficha

Abra `mapas/<pasta>/README.md` e preencha o frontmatter (referência completa em
[`CONTEUDO.md`](CONTEUDO.md)). O mais importante:

- `contexto` — **um** parágrafo, até 900 caracteres. É o texto do feed.
- `imagem_alt` — descrição do mapa para leitores de tela.
- `fontes`, `crs`, `epsg`, `escala`, `software`.
- `downloads` — um item por arquivo. Arquivo listado e ainda não presente na pasta aparece como
  “em breve”, nunca como link quebrado.

Confira com `npm run dev`. Se algum campo estiver errado, o terminal diz qual.

### 2.4 Publicar

1. Mude `rascunho: true` para `false`.
2. `git add mapas/<pasta> && git commit -m "Nº 005: título" && git push`
3. Em ~1 minuto o mapa está no topo do feed.

### 2.5 DOI

1. **Actions → Publicar no Zenodo → Run workflow.**
2. Informe a pasta (ex.: `005-renda-domiciliar-rmc`).
3. Primeira vez com um mapa: deixe **sandbox** marcado, confira o registro em sandbox.zenodo.org.
4. Rode de novo com **sandbox desmarcado**. A Action publica, recebe o DOI e faz um commit gravando
   `doi:` no README do mapa. O site se recompila e a citação passa a mostrar o DOI.

Para corrigir um mapa já publicado: aumente `versao` no frontmatter (ex.: `1.0.0` → `1.1.0`), faça commit,
e rode a Action com **nova versão** marcado. O Zenodo mantém as duas versões ligadas por um DOI-conceito.

Mapas com `exemplo: true` (dados sintéticos) são recusados pelo script de propósito.

### 2.6 Lattes

No Currículo Lattes: **Atualizar currículo → Produção técnica → Demais tipos de produção técnica →
Cartas, mapas ou similares** (os nomes das seções podem variar entre versões da Plataforma). Preencha título,
ano, e no campo de DOI/endereço eletrônico informe `https://doi.org/<doi>`. Em “meio de divulgação”, use
“Meio digital”.

### 2.7 Redes

Publique a prévia em r/MapPorn ou r/dataisbeautiful (este exige o marcador `[OC]` e um comentário com fonte
e ferramenta — a ficha técnica já tem os dois). Depois, acrescente o link da discussão ao frontmatter:

```yaml
discussoes:
  - onde: r/MapPorn
    url: https://www.reddit.com/r/MapPorn/comments/…
```

O botão aparece no cartão do feed no próximo deploy.

---

## Checklist do mapa

- [ ] SIRGAS 2000 declarado (`crs` e `epsg`)
- [ ] Fonte com ano e link
- [ ] Paleta perceptualmente uniforme para dados contínuos
- [ ] `contexto` com um único parágrafo, sem jargão desnecessário
- [ ] `imagem_alt` descreve o padrão principal, não só o título
- [ ] Prévia PNG ~2400 px; PDF vetorial
- [ ] GeoPackage e DXF em coordenadas projetadas, uma camada por tema
- [ ] `rascunho: false`
- [ ] DOI gerado e registrado no Lattes
