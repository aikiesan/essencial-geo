# Site que ensina: o que foi feito e o que fica proposto

Rodada de interface do atlas (novembro de 2026), sobre o que já existia em `main`: abas de versão da
prancha, visor com zoom, faixa de downloads, trilha, anterior/próxima e a galeria com busca e filtros.
Todo texto novo existe em PT-BR e EN-GB. Nenhum README, campo do esquema, prancha ou dado foi alterado.

## O que entrou

| | Onde | O que faz |
| --- | --- | --- |
| **Identidade de prancha** | `src/styles/global.css` (`.moldura`, `.coord`, `.regua`) | A abertura da página inicial ganha a moldura das pranchas, com tiques de graticule na borda e as coordenadas de Campinas (22° 54′ S, 47° 04′ O/W). Todo cabeçalho de página termina na escala gráfica das pranchas, com o colofão “Composto em Campinas, SP”. Fundos continuam neutros; a paleta do palácio só em linhas, tiques e ornamento. |
| **Comece por uma pergunta** | `src/components/Perguntas.astro`, `src/lib/guia.ts` → `PERGUNTAS` | Oito perguntas (“Para onde vai o lixo e o esgoto?”, “Quem faz o biocombustível do Brasil?”…) na página inicial e no guia. Cada uma lista as coleções que a respondem, em ordem, com o número de pranchas. Só aparecem coleções no ar. |
| **O mapa dos mapas** | `src/components/MapaDosMapas.astro`, `GRADE_UF` | As 27 UFs numa grade 6 × 8, cada uma onde fica, com quantas pranchas têm recorte nela; um estado com uma prancha leva direto a ela, São Paulo leva à galeria filtrada. Ao lado: o Brasil inteiro e os recortes dentro de SP (RMC, Baixada…). |
| **Novo esta semana** | `src/vistas/Inicio.astro` | Faixa com as pranchas que entraram no ar nos últimos sete dias, lida das datas. Se a semana não teve nenhuma, vira “As últimas no ar”, com a leva mais recente. Agendadas e rascunhos ficam de fora (no build, já nem existem). |
| **Coleção como percurso** | `src/vistas/Colecao.astro` | O sumário em grade virou um itinerário: estações numeradas sobre um trilho, cada uma com miniatura, “Prancha 2/4 · Nº 090”, título e a frase do que ela acrescenta (o subtítulo, ou a primeira frase do contexto). As agendadas aparecem no fim, tracejadas, com a data. Botão “Começar pela primeira prancha”. |
| **Como ler esta prancha** | `src/components/ComoLer.astro`, na página de cada mapa | Um `<details>` logo abaixo da imagem, com a chave de leitura no formato do colofão: recorte, coordenadas e projeção (Albers ou Mercator quando a descrição da imagem diz), escala, camadas do GeoPackage e fontes, cada linha com uma nota curta de como ler. Embaixo, os termos do glossário que a prancha usa, detectados no texto dela. |
| **Guia de leitura** | `/guia/` e `/en/guide/` (`src/vistas/Guia.astro`), no menu do topo e da barra | Anatomia de uma prancha, com dez marcas numeradas sobre a Nº 089 que acendem junto com a lista; as três versões da imagem; as perguntas; o glossário em cinco grupos (cartografia, cana, biogás e resíduos, política, fontes), com âncora por termo. Entrou no `sitemap.xml`. |
| **Movimento leve** | `src/scripts/cliente.ts` | As estações do percurso entram suavemente ao rolar; a troca entre Prancha, Figura e Sem mapa de base faz um esmaecimento curto; o “Como ler” abre deslizando. Tudo desligado com `prefers-reduced-motion`, e sem JavaScript nada fica escondido. |

### Para manter

- **Glossário** (`GLOSSARIO` em `src/lib/guia.ts`): cada termo tem `padrao`, a expressão que o encontra no
  título, subtítulo, contexto, método e descrição da imagem. Termo novo numa coleção nova → uma entrada aqui.
  As definições foram escritas a partir das pranchas; vale uma revisão sua, em especial IQR, CBIO,
  nota de eficiência e os limites da geração distribuída.
- **Perguntas** (`PERGUNTAS`): coleção nova entra na pergunta que ela responde. Coleção fora de toda
  pergunta não aparece nessa entrada (continua na galeria e em Coleções).
- **Anatomia**: as marcas usam posições em % sobre a prancha `089-co2-das-dornas-sp`
  (`MARCAS` em `src/vistas/Guia.astro`). Se o desenho do painel mudar, ajuste ali. Sem essa prancha no
  ar, a seção some sozinha.
- **Mapa dos mapas**: a UF sai do sufixo “(XX)” do recorte em português; recorte “Brasil” conta no
  Brasil inteiro.

## Ideias que deixei para você decidir

1. **Mapa dos mapas de verdade.** Trocar a grade por um mapa do Brasil desenhado com `d3-geo` no build
   (já está nas dependências), com o retângulo de cada recorte. Mais bonito, mas pede a malha das UFs no
   repositório.
2. **Uma linha própria por prancha no percurso.** Hoje a frase vem do subtítulo. Um campo opcional
   (`acrescenta:` / `adds:`) no README daria controle fino, mas muda o esquema; por isso não fiz.
3. **Termos sublinhados no próprio texto.** Marcar ATR, CBIO etc. dentro do parágrafo do cartão, com a
   definição numa nota ao passar o mouse. Mexe no componente mais lido do site; preferi a lista separada.
4. **“Vem aí” por coleção na barra lateral**, com a contagem regressiva da próxima prancha de cada série.
5. **Pergunta como filtro da galeria** (`?pergunta=lixo`), para a pergunta abrir todas as pranchas das
   suas coleções numa grade só.
6. **Transições entre páginas** (View Transitions do Astro) da miniatura para a prancha. Bonito, mas
   pesa no celular e precisa de teste com o visor.
7. **Guia em PDF de uma página** para aula: a anatomia e o glossário prontos para imprimir.
