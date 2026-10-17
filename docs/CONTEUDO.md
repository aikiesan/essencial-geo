# Conteúdo: ficha técnica e tom de voz

## Referência do frontmatter

Cada `mapas/<pasta>/README.md` começa com um bloco YAML. O build falha — e diz por quê — se um campo
obrigatório faltar ou estiver no formato errado (o esquema está em `src/content.config.ts`).

### Identificação

| Campo | Obrigatório | Exemplo | Notas |
| --- | --- | --- | --- |
| `numero` | sim | `5` | Número da prancha. A pasta usa o mesmo número com três dígitos. |
| `titulo` | sim | `"Renda domiciliar na RMC"` | Curto. O que é, não o que significa. |
| `subtitulo` | não | `"Onde a média esconde a distância"` | Uma linha. Aqui pode haver poesia. |
| `data` | sim | `2026-10-18` | Data de publicação. Define a ordem do feed. |
| `atualizado` | não | `2026-11-02` | Última revisão. |
| `categoria` | sim | `censo-renda` | Uma das chaves de `CATEGORIAS` em `src/site.config.ts`. |
| `tags` | não | `[renda, censo-2022]` | Viram palavras-chave no Zenodo e categorias no RSS. |
| `rascunho` | não | `true` | Esconde do site publicado (aparece no `npm run dev`). |
| `exemplo` | não | `true` | Selo “dados sintéticos”; bloqueia o envio ao Zenodo. |

### Texto e imagem

| Campo | Obrigatório | Notas |
| --- | --- | --- |
| `contexto` | sim | **Um único parágrafo**, até 900 caracteres. É o texto do feed e a descrição no Zenodo. Use `>-` no YAML para escrever em várias linhas. |
| `imagem` | sim | Caminho relativo: `./mapa_preview.png`. O site gera versões WebP responsivas e uma de alta resolução para o visualizador. |
| `imagem_alt` | sim | Descrição para leitores de tela: recorte, variável, padrão principal. |

### Ficha técnica

| Campo | Obrigatório | Exemplo |
| --- | --- | --- |
| `recorte` | sim | `"Região Metropolitana de Campinas (SP)"` |
| `fontes` | sim | lista de `{ nome, url?, ano? }` |
| `crs` | sim | `"SIRGAS 2000 / UTM zona 23S"` |
| `epsg` | não | `31983` (vira link para epsg.io) |
| `escala` | não | `"1:250.000"` |
| `software` | não | `["QGIS 3.40", "R 4.4 (sf, tmap)"]` |
| `metodo` | não | Uma frase. O detalhe vai no corpo do README. |

### Downloads

```yaml
downloads:
  - formato: gpkg                       # gpkg | dxf | pdf | png | csv | tif | qgz | r
    arquivo: dados/renda_rmc.gpkg.zip   # relativo à pasta do mapa…
    tamanho: "4,2 MB"
  - formato: pdf
    url: https://zenodo.org/records/…/files/prancha.pdf   # …ou um endereço externo
    rotulo: "Prancha A1 vetorial"       # opcional; substitui o rótulo padrão do formato
```

Um item sem `arquivo` nem `url`, ou com `arquivo` que ainda não existe na pasta, aparece como botão
tracejado “em breve”.

### Citação e discussão

| Campo | Notas |
| --- | --- |
| `versao` | Versão semântica (`1.0.0`). Aumente ao corrigir dados. |
| `doi` | Sem `https://doi.org/`. Preenchido pela Action do Zenodo. |
| `autores` | Opcional. Lista de `{ sobrenome, nome, orcid? }`. Se ausente, usa `AUTORIA` do `site.config.ts`. |
| `discussoes` | Lista de `{ onde, url }` — viram botões no cartão (r/MapPorn, r/dataisbeautiful…). |

### Corpo do README

Depois do frontmatter, o corpo em Markdown vira as **Notas de método** na página do mapa (o `# Título`
inicial é para o GitHub e não se repete no site). Seções sugeridas: *Método*, *Arquivos*, *Como reproduzir*.

---

## Tom de voz

**Técnico, poético, preciso, acessível.** Autoridade geográfica sem burocracia acadêmica.

O parágrafo de contexto segue quase sempre o mesmo arco:

1. **Um gancho concreto** — uma imagem, um fato, um contraste. Não comece com “Este mapa mostra…”.
2. **O que o dado revela** — o padrão que o mapa torna visível e que a tabela escondia.
3. **Por que importa no Brasil** — a consequência territorial, social ou de projeto.
4. **(Opcional) Como ler** — o que procurar na imagem.

| Evite | Prefira |
| --- | --- |
| “Este mapa apresenta a distribuição espacial da variável renda…” | “Em [cidade], [x] quilômetros separam bairros cuja renda difere por um fator de [n].” (com os números reais) |
| Jargão sem necessidade (“heterogeneidade intraurbana”) | A palavra comum que diz o mesmo (“a diferença dentro da cidade”) |
| Adjetivos de impacto (“chocante”, “incrível”) | O número, e deixar o leitor sentir |
| Afirmar causalidade que o mapa não sustenta | “coincide com”, “acompanha”, “aparece junto de” |

**Saint-Exupéry e Tobler são tempero, não prato.** A referência ao *Pequeno Príncipe* aparece no lema,
no manifesto e em pequenos detalhes visuais (estrelas, o asteroide da marca). Nos textos dos mapas,
no máximo uma alusão de vez em quando — nunca personagens, nunca tom infantil.

**Foco territorial:** 100% Brasil — municípios, estados, biomas, bacias, regiões metropolitanas.
