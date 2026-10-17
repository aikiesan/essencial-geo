# Estilo: o site e as pranchas

O Essencial Geo deve parecer feito num ateliê de cartografia, não gerado por um painel corporativo.
Referências: pranchas de arquitetura, atlas impressos, o selo (carimbo) de desenho técnico, a planta de
Nolli, as ilustrações de Saint-Exupéry — estas só como eco distante (uma estrela, um pequeno planeta).

## Regras que não se negociam

1. **Cantos vivos.** `border-radius: 0` em tudo. Está forçado no CSS global.
2. **Linhas de 1px.** Molduras, separadores e botões usam traço fino. Hierarquia vem da cor da linha
   (`--linha` para estrutura, `--linha-fina` para guias), nunca da espessura exagerada.
3. **Sem efeitos.** Nada de gradiente decorativo, brilho, sombra flutuante, vidro fosco ou neon.
   As únicas transições são de cor, em 120 ms, lineares.
4. **Fundos neutros.** Branco-gelo no tema claro, grafite neutro no escuro — nunca papel envelhecido,
   sépia ou bege. Um fundo tingido altera a percepção das cores do mapa (contraste simultâneo) e
   compromete as paletas perceptualmente uniformes. A prancha em si é sempre exportada sobre branco puro.
5. **Cor é dado.** A interface fala em tons baixos — nanquim, trigo, cinza-vale — para que as cores
   saturadas sejam do mapa. O único acento vivo é o Blue Nile, e só em links, foco e indicadores.

## Paleta

Inspirada nos muros e beirais de um palácio coreano: madeira, papel de arroz, telha e um azul de esmalte.
Os tons quentes ficam **nas linhas, nos selos e nos ornamentos — nunca no fundo**.

| Nome | Hex | Papel na interface |
| --- | --- | --- |
| Underworld | `#1a211a` | Texto principal e traço estrutural; o fundo dos painéis no tema escuro |
| Forest Night | `#444235` | Texto secundário; estado “confirmado” (citação copiada) |
| Queen Valley | `#6d7165` | Rótulos técnicos e metadados |
| Blue Nile | `#749fb7` | Preenchimento de barras e indicadores; acento no tema escuro |
| Blue Nile aprofundado | `#3d6a82` | Links, hover e foco no tema claro (contraste 5,5:1) |
| Basket Beige | `#bfa88a` | Estrelas, meandro, segunda série dos gráficos |
| Wheat Sheaf | `#dfd5c4` | Seleção de texto, aba ativa, língua ativa, selos; o texto no tema escuro |

## Tokens (`src/styles/global.css`)

| Token | Claro | Escuro | Uso |
| --- | --- | --- | --- |
| `--papel` | `#f6f7f8` | `#16181a` | Fundo do feed, branco-gelo |
| `--painel` | `#ffffff` | `#1a211a` | Colunas laterais, como os painéis de um SIG web |
| `--papel-2` | `#edeff1` | `#1e2120` | Áreas recuadas: código |
| `--folha` | `#ffffff` | `#1f2326` | A moldura em volta da prancha |
| `--tinta` | `#1a211a` | `#dfd5c4` | Texto e linhas estruturais |
| `--tinta-2` | `#444235` | `#bfa88a` | Texto secundário |
| `--tinta-3` | `#6d7165` | `#9a9d92` | Rótulos técnicos |
| `--linha-fina` | `#d6d9d4` | `#343a33` | Guias, separadores |
| `--trigo` | `#dfd5c4` | `#2f3529` | Seleção, aba e língua ativas, selos |
| `--cesto` / `--estrela` | `#bfa88a` | `#bfa88a` | Estrelas, meandro |
| `--nilo` | `#749fb7` | `#749fb7` | Barras e roscas |
| `--nilo-tinta` / `--acento` / `--foco` | `#3d6a82` | `#749fb7` | Links, hover, foco |
| `--floresta` | `#444235` | `#5a5a47` | Confirmação |
| `--argila` | `#9c4a32` | `#d47a5c` | A página 404 e o selo “Tradução pendente” |

O tema escuro segue o sistema operacional e pode ser trocado no botão de tema da coluna esquerda.

## Ornamento: o meandro

Uma faixa de meandro (`.meandro`, 10 px, em Basket Beige) separa os blocos da coluna esquerda — o eco do
friso de madeira do palácio. É o único ornamento repetido do site: não use em cartões, fichas ou pranchas.

## Tipografia

| Papel | Fonte | Onde |
| --- | --- | --- |
| Títulos | **Playfair Display** | Títulos de mapa, nome da marca (versal espaçada), lema em itálico |
| Texto | **Lora** | Parágrafos de contexto, manifesto, notas de método |
| Técnica | **JetBrains Mono** | Rótulos em versalete (`.rotulo`), coordenadas, CRS, tamanhos, citação ABNT/BibTeX |

As fontes são servidas pelo próprio site (pacotes `@fontsource`), sem chamadas a serviços externos.

## Componentes

| Componente | Arquivo | Ideia |
| --- | --- | --- |
| Cartão de mapa | `src/components/CartaoMapa.astro` | Cabeçalho técnico (Nº / categoria, selos), **linha de data** de notícia (“Publicado em segunda-feira, 26 de outubro de 2026 · Atualizado em …”), título, prancha com moldura dupla, legenda de figura em mono, um parágrafo, discussões |
| Ficha técnica | `src/components/Ficha.astro` | Leitura rápida, painel de camadas, lista de definições com filetes, downloads como linhas de tabela técnica (`[GPKG] GeoPackage … 4,2 MB ↓`), citação com abas ABNT/APA/BibTeX e botão de copiar |
| Leitura rápida | `src/components/LeituraRapida.astro` | Indicadores à maneira dos *widgets* de um SIG web: número de destaque, barras horizontais, rosca. Sem eixos, sem grade; o número sempre escrito |
| Painel de camadas | `Ficha.astro` (`.camada`) | Lista de camadas com selo do tipo de geometria (● ponto, ╱ linha, ▰ polígono, ▦ grade, ▩ raster) e a cor da camada |
| Coluna esquerda | `src/components/BarraEsquerda.astro` | Marca, lema, seletor **PT · EN**, manifesto, estado (com a próxima publicação), última nota, índice do atlas, ligações; blocos separados pelo meandro |
| Selos | `.selo` (em `CartaoMapa.astro`) | Mono em versalete. *Prancha-modelo · dados sintéticos*: fundo trigo, contorno tracejado. *Agendado*: contorno Blue Nile. *Tradução pendente*: contorno argila (estes dois só aparecem no `npm run dev`) |
| Painel direito | `src/components/PainelFichas.astro` | A ficha do cartão em foco; acompanha a rolagem |
| Visualizador | `src/layouts/Base.astro` + `src/scripts/visor.ts` | Tela cheia sobre papel milimetrado; roda, pinça, arrasto, duplo clique, teclado |
| Divisor | `.divisor` | Filete com uma estrela no centro, entre cartões |

## Layout

| Largura | Colunas |
| --- | --- |
| < 860 px | Uma coluna. A coluna esquerda vira cabeçalho com botão “Índice”; a ficha técnica fica recolhida dentro de cada cartão. |
| 860–1239 px | Navegação + feed. A ficha continua dentro do cartão. |
| ≥ 1240 px | Navegação (272 px) + feed (até 760 px) + ficha técnica (344 px), as laterais fixas. |

---

## Convenções das pranchas

As pranchas-modelo 001–004 (`scripts/gerar-exemplos.mjs`) fixam a linguagem que os mapas reais devem
seguir no layout do QGIS.

**Formato.** Paisagem 4:3 (ex.: A3 ou 2400 × 1800 px na prévia). Área do mapa à esquerda; à direita, uma
faixa vertical com: “ESSENCIAL GEO” em versal espaçada, número da prancha grande, título, subtítulo em
itálico, legenda, norte e escala gráfica, e o **carimbo** (Projeto, Prancha, Data, CRS, Fonte, Licença).

**Moldura.** Linha de esquadria dupla (externa grossa, interna fina). Cruzes de grade a cada intervalo
regular de coordenadas e marcas de graduação na moldura.

**Cor.**

| Tipo de dado | Paleta |
| --- | --- |
| Contínuo / sequencial | Viridis, Cividis ou Plasma (perceptualmente uniformes, seguras para daltônicos). Sobre fundo claro, inverta para o escuro carregar o valor alto. |
| Divergente | Argila ↔ azul-profundo, com centro em papel |
| Relevo | Tintas hipsométricas terrosas: verde-mata → ocre → argila → cinza-rosado |
| Categórico (uso do solo) | Tons minerais: verde-mata, oliva, palha, ocre, argila, ameixa, grafite, azul-profundo |
| Infraestrutura / figura-fundo | Nanquim sobre papel; verde só em hachura |

**Tipografia nas pranchas.** Títulos em serifada (Playfair Display ou Georgia); rótulos, carimbo e escala em
mono. Nunca mais de duas famílias numa prancha.

**Sempre presentes:** norte, escala gráfica, CRS, fonte com ano, licença, número da prancha.

**Duas línguas.** Cada prancha é exportada duas vezes, do mesmo projeto: `mapa_preview.png` (PT) e
`mapa_preview.en.png` (EN). Traduzem-se título, subtítulo, legenda, carimbo (*Project, Plate, Date, CRS,
Source, Licence*) e a escala (`1:50.000` → `1:50,000`). Não se traduzem nomes próprios nem os nomes das
camadas nos dados.

**A paleta da interface não entra na prancha.** Os tons do palácio servem à moldura do site; as cores do
mapa obedecem ao dado (tabela acima). Quando um indicador da leitura rápida repete a legenda, ele usa as
cores da prancha, não as da interface.
