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

**Cadência:** um mapa por dia, às 9h de Brasília (12h UTC). Os estados e as coleções se alternam.

| Quando | O quê |
| --- | --- |
| **Sábado ou domingo** (ou o seu dia de oficina) | Produção do lote da **semana seguinte**: 7 mapas. QGIS → pranchas PT e EN, dados, os dois READMEs, `data:` já com o dia de saída. Um commit por mapa; push. Nada aparece antes da hora. |
| **Todo dia — 9h** | O mapa entra no ar sozinho; às 9h05 a conferência lê o site no ar (páginas, sitemap, downloads). |
| **Mesmo dia, depois das 9h** | Divulgação (Reddit, LinkedIn, Bluesky) com o link da página em cada língua. Depois, `discussoes:` no README. |
| **Mesmo dia** | DOI: sozinho, se o README tem `doi_automatico: true`; senão, com o comando que sai no resumo da execução (veja [`PUBLICAR.md`](PUBLICAR.md#6-doi)). |
| **Último dia útil do mês** | Lattes: registrar de uma vez os DOIs do mês. Nota “agenda” com o que vem no mês seguinte. |

**Colchão de uma semana.** Mantenha sempre o lote da semana seguinte pronto e agendado. Uma semana
apertada não quebra a cadência; ela só consome o colchão, que você repõe depois.

**Lote, não um por um.** Exportar, traduzir e revisar vários mapas de uma vez é mais rápido do que três vezes
um; e o texto em inglês sai melhor quando é revisado em sequência, com o glossário fresco.

### Checklist do lote (sábado)

- [ ] As pastas da semana criadas com `npm run novo-mapa -- "Título" categoria --en "English title" --data AAAA-MM-DD`
- [ ] Para cada mapa: `mapa_preview.png` + `mapa_preview.en.png`, SVG, GPKG com estilo do QGIS
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

## Série «Brasil, estado por estado» (17/10 a 29/11/2026)

A primeira série do atlas: uma base de cada unidade da federação — municípios, regiões imediatas e
intermediárias, limite e rodovias —, toda gerada por `scripts/estados/` e já agendada (`data:` em cada
`README.md`). São Paulo abre a série no dia do lançamento; as demais se alternam com as coleções, um mapa por dia,
do Sudeste ao Norte.

| Data | Dia | Nº | Unidade | Pasta |
| --- | --- | --- | --- | --- |
| 17/10 | sáb | 001 | São Paulo (SP) | `001-estado-sao-paulo` |
| 18/10 | dom | 002 | Rio de Janeiro (RJ) | `002-estado-rio-de-janeiro` |
| 20/10 | ter | 003 | Minas Gerais (MG) | `003-estado-minas-gerais` |
| 22/10 | qui | 004 | Espírito Santo (ES) | `004-estado-espirito-santo` |
| 23/10 | sex | 005 | Paraná (PR) | `005-estado-parana` |
| 25/10 | dom | 006 | Santa Catarina (SC) | `006-estado-santa-catarina` |
| 27/10 | ter | 007 | Rio Grande do Sul (RS) | `007-estado-rio-grande-do-sul` |
| 28/10 | qua | 008 | Mato Grosso do Sul (MS) | `008-estado-mato-grosso-do-sul` |
| 30/10 | sex | 009 | Mato Grosso (MT) | `009-estado-mato-grosso` |
| 01/11 | dom | 010 | Goiás (GO) | `010-estado-goias` |
| 02/11 | seg | 011 | Distrito Federal (DF) | `011-distrito-federal` |
| 04/11 | qua | 012 | Bahia (BA) | `012-estado-bahia` |
| 06/11 | sex | 013 | Sergipe (SE) | `013-estado-sergipe` |
| 07/11 | sáb | 014 | Alagoas (AL) | `014-estado-alagoas` |
| 09/11 | seg | 015 | Pernambuco (PE) | `015-estado-pernambuco` |
| 11/11 | qua | 016 | Paraíba (PB) | `016-estado-paraiba` |
| 12/11 | qui | 017 | Rio Grande do Norte (RN) | `017-estado-rio-grande-do-norte` |
| 14/11 | sáb | 018 | Ceará (CE) | `018-estado-ceara` |
| 16/11 | seg | 019 | Piauí (PI) | `019-estado-piaui` |
| 17/11 | ter | 020 | Maranhão (MA) | `020-estado-maranhao` |
| 19/11 | qui | 021 | Tocantins (TO) | `021-estado-tocantins` |
| 21/11 | sáb | 022 | Pará (PA) | `022-estado-para` |
| 22/11 | dom | 023 | Amapá (AP) | `023-estado-amapa` |
| 24/11 | ter | 024 | Amazonas (AM) | `024-estado-amazonas` |
| 26/11 | qui | 025 | Roraima (RR) | `025-estado-roraima` |
| 27/11 | sex | 026 | Acre (AC) | `026-estado-acre` |
| 29/11 | dom | 027 | Rondônia (RO) | `027-estado-rondonia` |

**Antes de cada saída:** o GPKG compactado daquele estado precisa estar nos anexos da release
`estados-2025` (veja [`PUBLICAR.md`](PUBLICAR.md#série-brasil-estado-por-estado)). Como a release sobe de
uma vez, isso vale para a série inteira no primeiro push.

**Notas sugeridas no meio da série:** 31/10 (agenda de novembro), 14/11 (método: como a prancha escolhe
cores, rótulos e cantos sozinha), 28/11 (agenda de dezembro), 26/12 (bastidores: a série inteira numa
prancha só).

## Coleções temáticas (19/10 a 28/11/2026)

Nos dias entre os estados saem as **coleções**: grupos de pranchas
sobre um mesmo tema, reunidos numa página própria pelo campo `colecao:` do README (`/colecoes/<id>/`).
O número da prancha na coleção vai no cabeçalho («BIOENERGIA EM SP · 1/4»); o subtítulo fica livre para
uma frase («A colheita que acende a rede»), e cada coleção tem um friso desenhado no painel. Uma coleção sai inteira antes da seguinte, sempre às
9h de Brasília (12h UTC).

| Data | Dia | Nº | Coleção (`colecao:`) | Prancha | Fontes |
| --- | --- | --- | --- | --- | --- |
| 19/10 | seg | 028 | Bioenergia em SP (`bioenergia-sp`) 1/4 | Usinas de biogás em operação | MapBiomas, ANEEL — SIGA |
| 21/10 | qua | 029 | Bioenergia em SP 2/4 | Rebanhos bovino, suíno e de galináceos | IBGE — PPM 2024 |
| 24/10 | sáb | 030 | Bioenergia em SP 3/4 | Cana-de-açúcar: área colhida e produção | IBGE — PAM 2024 |
| 26/10 | seg | 031 | Bioenergia em SP 4/4 | Usinas sucroenergéticas e onde o resíduo está | ANEEL — SIGA, IBGE — PAM, EPE |
| 29/10 | qui | 032 | RMC (`rmc`) 1/4 | Uso e cobertura da terra | MapBiomas — Coleção 10 (2024) |
| 31/10 | sáb | 033 | RMC 2/4 | Densidade de domicílios por setor censitário | IBGE — Censo 2022 |
| 03/11 | ter | 034 | RMC 3/4 | Renda do responsável pelo domicílio | IBGE — Censo 2022 (setores) |
| 05/11 | qui | 035 | RMC 4/4 | Hidrografia, nascentes e APPs de Campinas | FBDS |
| 08/11 | dom | 036 | Água em SP (`agua-sp`) 1/3 | Bacias hidrográficas (UGRHIs) | SEADE, IBGE — Censo 2022, MapBiomas |
| 10/11 | ter | 037 | Água em SP 2/3 | Rede de drenagem e as vertentes | WWF/HydroSHEDS — HydroRIVERS |
| 13/11 | sex | 038 | Água em SP 3/3 | Unidades de conservação sobre as bacias | MMA — CNUC (via SEADE), SEADE |
| 15/11 | dom | 039 | Relevo (`relevo`) 1/3 | Serra da Mantiqueira | Copernicus DEM GLO-90 |
| 18/11 | qua | 040 | Relevo 2/3 | Serra do Mar | Copernicus DEM GLO-90 |
| 20/11 | sex | 041 | Relevo 3/3 | Cuestas paulistas | Copernicus DEM GLO-90 |
| 23/11 | seg | 042 | Energia elétrica no Brasil (`energia-eletrica`) 1/3 | Linhas de transmissão e subestações | EPE (via MapBiomas) |
| 25/11 | qua | 043 | Energia elétrica no Brasil 2/3 | Usinas por fonte | ANEEL — SIGA (via MapBiomas) |
| 28/11 | sáb | 044 | Energia elétrica no Brasil 3/3 | Geração solar distribuída por habitante | ANEEL — GD (10/2026), IBGE — Censo 2022 |

**Antes de cada saída:** os GPKG compactados e as pranchas em SVG de cada coleção vão para os anexos de
uma release própria (`bioenergia-sp-2026`, `rmc-2026`, `agua-sp-2026`, `relevo-2026`,
`energia-eletrica-2026`), referenciada por `url:`/`url_en:` nos READMEs. Suba a release da coleção antes
do push da primeira prancha dela.

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
Elas viraram as coleções acima: o número vai no cabeçalho da prancha e a sequência pode ser anunciada numa nota.
