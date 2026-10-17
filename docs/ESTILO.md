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
4. **Cor é dado.** No site, a interface é papel e nanquim; cor aparece nos mapas e em um único acento
   (argila para foco/hover, ocre para as estrelas).

## Tokens (`src/styles/global.css`)

| Token | Papel (claro) | Nanquim (escuro) | Uso |
| --- | --- | --- | --- |
| `--papel` | `#f3eee3` | `#16181a` | Fundo geral (com grão sutil) |
| `--papel-2` | `#ebe4d4` | `#1c1f22` | Áreas recuadas: citação, código |
| `--folha` | `#faf7f0` | `#1f2326` | A folha dentro da moldura da prancha |
| `--tinta` | `#1d1b18` | `#e7e1d3` | Texto e linhas estruturais |
| `--tinta-2` | `#4f4a41` | `#bdb5a5` | Texto secundário, subtítulos |
| `--tinta-3` | `#857d70` | `#8a8377` | Rótulos técnicos, metadados |
| `--linha-fina` | `#c9c0ad` | `#3a3e42` | Guias, separadores de lista |
| `--argila` | `#9c4a32` | `#d47a5c` | Acento de interação |
| `--ocre` / `--estrela` | `#b07d26` / `#c99a2e` | `#d3a24a` / `#e2bb5a` | Seleção; as pequenas estrelas |
| `--azul-profundo` | `#1f3a5f` | `#8fb0d9` | Foco de teclado |
| `--verde-mata` | `#2e5a3c` | `#86b892` | Confirmação (“citação copiada”) |

O tema escuro segue o sistema operacional e pode ser trocado no botão “Tema: papel / nanquim”.

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
| Cartão de mapa | `src/components/CartaoMapa.astro` | Cabeçalho técnico (Nº / data / categoria), título, prancha com moldura dupla (linha de esquadria), legenda de figura em mono, um parágrafo, discussões |
| Ficha técnica | `src/components/Ficha.astro` | Lista de definições com filetes, downloads como linhas de tabela técnica (`[GPKG] GeoPackage … 4,2 MB ↓`), citação com abas ABNT/BibTeX e botão de copiar |
| Coluna esquerda | `src/components/BarraEsquerda.astro` | Marca, lema, manifesto, estado, índice do atlas com guias pontilhadas, ligações |
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
