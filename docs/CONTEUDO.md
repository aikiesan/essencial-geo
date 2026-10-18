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
| `data` | sim | `2026-10-18` | Dia de publicação. Define a ordem do feed e a linha de data (“Publicado em domingo, 18 de outubro de 2026”). **Data futura = agendado:** o mapa entra no ar às 9h de Brasília desse dia. |
| `atualizado` | não | `2026-11-02` | Última revisão. Aparece como “Atualizado em …” ao lado da data de publicação. |
| `categoria` | sim | `censo-renda` | Uma das chaves de `CATEGORIAS` em `src/site.config.ts`. |
| `colecao` | não | `bioenergia-sp` | Série a que o mapa pertence: uma das chaves de `COLECOES` em `src/site.config.ts` (título e resumo nas duas línguas ficam lá). O mapa entra na página da coleção (`/colecoes/<id>/`, `/en/collections/<id>/`), em ordem de número, e o cartão mostra “Coleção 3/27”. A coleção só ganha página quando a primeira prancha entra no ar. |
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
| `fontes` | sim | lista de `{ nome, nome_en?, url?, ano? }` |
| `crs` | sim | `"SIRGAS 2000 / UTM zona 23S"` |
| `epsg` | não | `31983` (vira link para epsg.io) |
| `escala` | não | `"1:250.000"` |
| `software` | não | `["QGIS 3.40", "R 4.4 (sf, tmap)"]` |
| `metodo` | não | Uma frase. O detalhe vai no corpo do README. |

### Camadas e leitura rápida

A ficha abre com dois painéis à maneira de um SIG web: a **lista de camadas** (com o tipo de geometria)
e a **leitura rápida** (indicadores). Os dois são opcionais. **Só entram números que saem dos seus dados**
— nada de estimativa de cabeça.

```yaml
camadas:
  - nome: SETORES_RENDA            # o nome da camada no GPKG/DXF (igual nas duas línguas)
    tipo: poligono                 # ponto | linha | poligono | grade | raster
    cor: "#749fb7"                 # opcional: a cor da camada na prancha
    descricao: "Setores com renda média domiciliar"
    descricao_en: "Census tracts with mean household income"

indicadores:
  - tipo: numero                   # um número de destaque
    rotulo: "Domicílios"
    rotulo_en: "Households"
    valor: 412345
    nota: "Censo 2022"
    nota_en: "2022 Census"
  - tipo: barras                   # barras horizontais
    rotulo: "Domicílios por faixa de renda"
    rotulo_en: "Households by income band"
    unidade: "mil"
    unidade_en: "thousand"
    itens:
      - { rotulo: "até 1 SM", rotulo_en: "up to 1 MW", valor: 120, cor: "#749fb7" }
  - tipo: proporcao                # rosca (os valores viram percentuais)
    rotulo: "Uso do solo"
    rotulo_en: "Land use"
    itens:
      - { rotulo: "Pastagem", rotulo_en: "Pasture", valor: 5133.7, cor: "#e2c48a" }
```

Sem `cor`, os itens percorrem a paleta da interface (Blue Nile, Basket Beige, Queen Valley…). Quando o
gráfico repete a legenda do mapa, use as **mesmas cores da prancha**.

### Downloads

```yaml
downloads:
  - formato: gpkg                       # gpkg | dxf | pdf | png | svg | csv | tif | qgz | r
    arquivo: dados/renda_rmc.gpkg.zip   # relativo à pasta do mapa…
    tamanho: "4,2 MB"
  - formato: pdf
    url: https://zenodo.org/records/…/files/prancha.pdf   # …ou um endereço externo
    rotulo: "Prancha A1 vetorial"       # opcional; substitui o rótulo padrão do formato
    rotulo_en: "A1 vector plate"        # o mesmo rótulo em inglês
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png     # nas páginas em inglês, baixa a prancha em inglês
  - formato: svg
    url: https://github.com/…/releases/download/estados-2025/sp_prancha.svg
    url_en: https://github.com/…/releases/download/estados-2025/sp_prancha.en.svg   # idem, para url
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
inicial é para o GitHub e não se repete no site). Seções sugeridas: *O que vem nos arquivos*, *Método*,
*Limitações*.

A publicação leva **as camadas e a descrição do método**, nunca o código: a ficha não cita nem linka os
scripts que geraram o mapa (eles ficam em `scripts/`, para uso interno), e o Zenodo recebe só os arquivos da
pasta do mapa. O método se escreve em passos que qualquer pessoa repete num SIG — fonte, recorte,
operação, classificação.

---

## Duas línguas: `README.en.md`

Todo mapa publicado sai em **português do Brasil** e em **inglês britânico**. A versão em inglês fica
ao lado, em `mapas/<pasta>/README.en.md`, e traz **só o texto** — números, arquivos, camadas,
indicadores e DOI continuam vindo do `README.md`, sem duplicação.

| Campo | Obrigatório | Notas |
| --- | --- | --- |
| `titulo` | sim | Título em inglês. |
| `subtitulo` | não | |
| `contexto` | sim | Um único parágrafo, como em português. |
| `imagem` | não | `./mapa_preview.en.png` — a prancha exportada com textos em inglês. Sem ela, usa a prancha em português. |
| `imagem_alt` | sim | Descrição para leitores de tela, em inglês. |
| `recorte`, `escala`, `metodo` | não | Substituem os valores em português (ex.: `1:50,000` com vírgula). |

O corpo do `README.en.md` vira as *Method notes* da página em inglês. Logo abaixo do `# Título`, os dois
READMEs trazem a linha `<p class="so-github">Português · English</p>`, que no GitHub liga uma versão à
outra e no site fica escondida.

**O build de produção falha se um mapa publicado não tiver `README.en.md`** — de propósito. Rascunhos
(`rascunho: true`) podem ficar só em português enquanto são escritos; no `npm run dev`, o cartão em inglês
mostra o selo “Translation pending”.

Nomes de camadas, colunas e arquivos ficam **em português nas duas línguas**: assim scripts, estilos do
QGIS e modelos de CAD funcionam com as duas versões.

### Inglês britânico

Grafia britânica (*colour, centre, licence, metre*), datas no formato `16 October 2026`, aspas
tipográficas (‘ ’ “ ”). Nomes próprios brasileiros não se traduzem (*Cerrado, veredas, IBGE*); quando
ajudar, explique na primeira menção (*the Cerrado, Brazil’s tropical savanna*).

---

## Notas e novidades

Além dos mapas, o atlas publica **notas** datadas — novidades, bastidores, notas de método, agenda —
em `notas/AAAA-MM-DD-slug/pt.md` e `en.md`:

```yaml
---
titulo: "Essencial Geo entra no ar"
resumo: "Uma ou duas frases — aparecem na lista, na barra lateral e no RSS."
data: 2026-10-17
tipo: novidade        # novidade | bastidores | metodo | agenda
tags: [lancamento]
# atualizado: 2026-10-20
# rascunho: true
---
```

As notas seguem as mesmas regras dos mapas: data futura agenda, e o build falha se faltar uma das línguas.

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
