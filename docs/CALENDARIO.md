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

## Próximas semanas (a partir de 17/10/2026)

As datas são as de saída; os temas são **sugestões de pauta** a partir das fontes abertas, ligadas às suas
linhas de pesquisa (energia, biomassa, biogás, território). Nenhum resultado está antecipado aqui: cada
número sai dos dados quando o mapa for feito.

| Data | Dia | Pauta sugerida | Categoria | Fontes |
| --- | --- | --- | --- | --- |
| 17/10 | sáb | **Nota:** “Essencial Geo entra no ar” (já agendada) | — | — |
| 18–25/10 | | **Semana de preparação:** Zenodo, ORCID/DataCite, segredos; lote 1 | — | — |
| 26/10 | seg | Usinas de biogás em operação no estado de São Paulo | energia | ANEEL — SIGA |
| 28/10 | qua | Cana-de-açúcar por município: área colhida e produção | uso-do-solo | IBGE — PAM |
| 30/10 | sex | Rebanhos bovino, suíno e de aves por município | energia | IBGE — PPM |
| 31/10 | sáb | **Nota (agenda):** o que sai em novembro | — | — |
| 02/11 | seg | Bacias hidrográficas do estado de São Paulo (Finados: saída automática, divulgue no dia 3) | hidrografia | ANA — BHO |
| 04/11 | qua | Uso e cobertura da terra na Região Metropolitana de Campinas | uso-do-solo | MapBiomas (coleção mais recente) |
| 06/11 | sex | Densidade de domicílios na RMC, grade estatística | censo-renda | IBGE — Censo 2022 |
| 09/11 | seg | Relevo da Serra da Mantiqueira paulista | altimetria-relevo | Copernicus DEM GLO-30 |
| 11/11 | qua | Malha viária do centro de Campinas em DXF | infraestrutura-dxf | OpenStreetMap |
| 13/11 | sex | Biomas do Brasil e a transição Cerrado–Mata Atlântica em SP | biomas | IBGE — Biomas 1:250.000 |
| 14/11 | sáb | **Nota (método):** como as pranchas são exportadas em duas línguas | — | — |
| 16/11 | seg | Unidades de conservação no estado de São Paulo | biomas | MMA — CNUC |
| 18/11 | qua | Linhas de transmissão e subestações em SP | energia | EPE — WebMap / ANEEL — SIGEL |
| 20/11 | sex | Comunidades quilombolas no Censo 2022 (Dia da Consciência Negra) | censo-renda | IBGE — Censo 2022, INCRA |
| 23/11 | seg | Renda domiciliar na RMC | censo-renda | IBGE — Censo 2022 |
| 25/11 | qua | Rede hidrográfica e APPs de um município da RMC | hidrografia | ANA, FBDS |
| 27/11 | sex | Usinas sucroenergéticas e área de cana: onde o resíduo está | energia | ANEEL — SIGA, IBGE — PAM |
| 30/11 | seg | **Nota (agenda)** + mapa: a definir com o que surgir em outubro | — | — |

**Séries.** As pautas de energia formam uma série (biogás → rebanhos → cana → usinas), e as da RMC outra.
Vale numerar a série no subtítulo (“Bioenergia em SP, 1/4”) e anunciar a sequência numa nota.

**As pranchas-modelo 001–004** (dados sintéticos) continuam no ar até a primeira prancha real. No commit do
mapa de 26/10, marque as quatro com `rascunho: true` — ou mantenha-as, com o selo, como mostruário das séries.
