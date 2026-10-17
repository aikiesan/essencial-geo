# Calendário editorial

O Essencial Geo publica como um jornal: **todo mapa e toda nota têm data**, e a data aparece no topo, como
linha de data de notícia (“Publicado em segunda-feira, 26 de outubro de 2026”). A data não é enfeite. Ela:

- diz ao leitor **quando** aquele retrato do território foi feito, e com dados de que ano;
- fixa a **data de acesso** de uma citação ABNT e a data de publicação do DOI;
- separa versões: uma correção ganha `atualizado:` e nova `versao`, e o original continua citável.

## Como funciona o agendamento

| | |
| --- | --- |
| **Campo** | `data:` no `README.md` do mapa (ou no `pt.md`/`en.md` da nota) |
| **Data passada ou hoje** | Publicado |
| **Data futura** | Agendado: entra no ar às **9h de Brasília** (12h UTC) desse dia |
| **Quem publica** | A recompilação diária do site (`deploy.yml`, todo dia às 9h05) |
| **No `npm run dev`** | Agendados aparecem, com o selo “Agendado”, para revisão |

Brasília não tem horário de verão desde 2019: 12h UTC é 9h o ano todo.

Duas ressalvas do GitHub Actions:

1. **Atrasos.** Em horários de pico, o agendamento do GitHub pode atrasar de alguns minutos a uma hora.
   Se um mapa precisa sair num minuto exato, rode *Actions → Site (GitHub Pages) → Run workflow* à mão.
2. **60 dias de silêncio.** Em repositórios públicos, o GitHub desliga workflows agendados depois de 60 dias
   sem atividade no repositório. Com a cadência deste atlas isso não acontece; numa pausa longa, confira em
   *Actions* se o agendamento continua ativo.

## A rotina: produção em lote, publicação em dias fixos

**Cadência:** segunda, quarta e sexta, 9h — três mapas por semana, “um a cada dois dias”.

| Quando | O quê |
| --- | --- |
| **Sábado ou domingo** (ou o seu dia de oficina) | Produção do lote da **semana seguinte**: 3 mapas. QGIS → pranchas PT e EN, dados, os dois READMEs, `data:` já com o dia de saída. Um commit por mapa; push. Nada aparece antes da hora. |
| **Segunda, quarta, sexta — 9h** | O mapa entra no ar sozinho. |
| **Mesmo dia, depois das 9h** | Divulgação (Reddit, LinkedIn, Bluesky) com o link da página em cada língua. Depois, `discussoes:` no README. |
| **Mesmo dia ou no seguinte** | DOI: *Actions → Publicar no Zenodo* (veja [`ZENODO.md`](ZENODO.md)). |
| **Último dia útil do mês** | Lattes: registrar de uma vez os DOIs do mês. Nota “agenda” com o que vem no mês seguinte. |

**Colchão de uma semana.** Mantenha sempre o lote da semana seguinte pronto e agendado. Uma semana
apertada não quebra a cadência; ela só consome o colchão, que você repõe depois.

**Lote de 3, não de 1.** Exportar, traduzir e revisar três mapas de uma vez é mais rápido do que três vezes
um; e o texto em inglês sai melhor quando é revisado em sequência, com o glossário fresco.

### Checklist do lote (sábado)

- [ ] 3 pastas criadas com `npm run novo-mapa -- "Título" categoria --en "English title" --data AAAA-MM-DD`
- [ ] Para cada mapa: `mapa_preview.png` + `mapa_preview.en.png`, PDF, GPKG, DXF
- [ ] `README.md` e `README.en.md` completos; camadas e indicadores com números dos dados
- [ ] `rascunho: false`
- [ ] `npm run dev` → conferir em `/essencial-geo/` e `/essencial-geo/en/` (selo “Agendado”)
- [ ] `npm run build` sem erro → commit → push

## Notas

As notas datadas (`notas/AAAA-MM-DD-slug/`) contam o que não cabe num mapa:

| Tipo | Para quê | Frequência sugerida |
| --- | --- | --- |
| `novidade` | Lançamentos, nova série, marcos (“50 mapas”, “primeiro DOI”) | quando houver |
| `agenda` | O que sai no mês seguinte | mensal, no último dia útil |
| `metodo` | Uma técnica: classificação, projeção, como montar o DXF | quinzenal |
| `bastidores` | Erros, escolhas descartadas, a prancha que não deu certo | quando houver |

Notas seguem o mesmo agendamento dos mapas. Sábado é um bom dia para elas: não disputam espaço com os mapas.

---

## Série «Brasil, estado por estado» (17/10 a 23/12/2026)

A primeira série do atlas: uma base de cada unidade da federação — municípios, regiões imediatas e
intermediárias, limite e rodovias —, toda gerada por `scripts/estados/` e já agendada (`data:` em cada
`README.md`). São Paulo abre a série no dia do lançamento; as demais saem às segundas, quartas e sextas,
do Sudeste ao Norte.

| Data | Dia | Nº | Unidade | Pasta |
| --- | --- | --- | --- | --- |
| 17/10 | sáb | 001 | São Paulo (SP) | `001-estado-sao-paulo` |
| 26/10 | seg | 002 | Rio de Janeiro (RJ) | `002-estado-rio-de-janeiro` |
| 28/10 | qua | 003 | Minas Gerais (MG) | `003-estado-minas-gerais` |
| 30/10 | sex | 004 | Espírito Santo (ES) | `004-estado-espirito-santo` |
| 02/11 | seg | 005 | Paraná (PR) | `005-estado-parana` |
| 04/11 | qua | 006 | Santa Catarina (SC) | `006-estado-santa-catarina` |
| 06/11 | sex | 007 | Rio Grande do Sul (RS) | `007-estado-rio-grande-do-sul` |
| 09/11 | seg | 008 | Mato Grosso do Sul (MS) | `008-estado-mato-grosso-do-sul` |
| 11/11 | qua | 009 | Mato Grosso (MT) | `009-estado-mato-grosso` |
| 13/11 | sex | 010 | Goiás (GO) | `010-estado-goias` |
| 16/11 | seg | 011 | Distrito Federal (DF) | `011-distrito-federal` |
| 18/11 | qua | 012 | Bahia (BA) | `012-estado-bahia` |
| 20/11 | sex | 013 | Sergipe (SE) | `013-estado-sergipe` |
| 23/11 | seg | 014 | Alagoas (AL) | `014-estado-alagoas` |
| 25/11 | qua | 015 | Pernambuco (PE) | `015-estado-pernambuco` |
| 27/11 | sex | 016 | Paraíba (PB) | `016-estado-paraiba` |
| 30/11 | seg | 017 | Rio Grande do Norte (RN) | `017-estado-rio-grande-do-norte` |
| 02/12 | qua | 018 | Ceará (CE) | `018-estado-ceara` |
| 04/12 | sex | 019 | Piauí (PI) | `019-estado-piaui` |
| 07/12 | seg | 020 | Maranhão (MA) | `020-estado-maranhao` |
| 09/12 | qua | 021 | Tocantins (TO) | `021-estado-tocantins` |
| 11/12 | sex | 022 | Pará (PA) | `022-estado-para` |
| 14/12 | seg | 023 | Amapá (AP) | `023-estado-amapa` |
| 16/12 | qua | 024 | Amazonas (AM) | `024-estado-amazonas` |
| 18/12 | sex | 025 | Roraima (RR) | `025-estado-roraima` |
| 21/12 | seg | 026 | Acre (AC) | `026-estado-acre` |
| 23/12 | qua | 027 | Rondônia (RO) | `027-estado-rondonia` |

**Antes de cada saída:** o GPKG compactado daquele estado precisa estar nos anexos da release
`estados-2025` (veja [`PUBLICAR.md`](PUBLICAR.md#série-brasil-estado-por-estado)). Como a release sobe de
uma vez, isso vale para a série inteira no primeiro push.

**Notas sugeridas no meio da série:** 31/10 (agenda de novembro), 14/11 (método: como a prancha escolhe
cores, rótulos e cantos sozinha), 28/11 (agenda de dezembro), 26/12 (bastidores: a série inteira numa
prancha só).

## Pautas para depois da série

Sugestões a partir das fontes abertas, ligadas às linhas de pesquisa (energia, biomassa, biogás,
território). Nenhum resultado está antecipado aqui: cada número sai dos dados quando o mapa for feito.

| Pauta sugerida | Categoria | Fontes |
| --- | --- | --- |
| Usinas de biogás em operação no estado de São Paulo | energia | ANEEL — SIGA |
| Cana-de-açúcar por município: área colhida e produção | uso-do-solo | IBGE — PAM |
| Rebanhos bovino, suíno e de aves por município | energia | IBGE — PPM |
| Bacias hidrográficas do estado de São Paulo | hidrografia | ANA — BHO |
| Uso e cobertura da terra na Região Metropolitana de Campinas | uso-do-solo | MapBiomas (coleção mais recente) |
| Densidade de domicílios na RMC, grade estatística | censo-renda | IBGE — Censo 2022 |
| Relevo da Serra da Mantiqueira paulista | altimetria-relevo | Copernicus DEM GLO-30 |
| Malha viária do centro de Campinas em DXF | infraestrutura-dxf | OpenStreetMap |
| Biomas do Brasil e a transição Cerrado–Mata Atlântica em SP | biomas | IBGE — Biomas 1:250.000 |
| Unidades de conservação no estado de São Paulo | biomas | MMA — CNUC |
| Linhas de transmissão e subestações em SP | energia | EPE — WebMap / ANEEL — SIGEL |
| Comunidades quilombolas no Censo 2022 | censo-renda | IBGE — Censo 2022, INCRA |
| Renda domiciliar na RMC | censo-renda | IBGE — Censo 2022 |
| Rede hidrográfica e APPs de um município da RMC | hidrografia | ANA, FBDS |
| Usinas sucroenergéticas e área de cana: onde o resíduo está | energia | ANEEL — SIGA, IBGE — PAM |

**Séries.** As pautas de energia formam uma série (biogás → rebanhos → cana → usinas), e as da RMC outra.
Vale numerar a série no subtítulo (“Bioenergia em SP, 1/4”) e anunciar a sequência numa nota.
