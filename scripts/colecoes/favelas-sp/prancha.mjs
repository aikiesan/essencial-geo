#!/usr/bin/env node
/**
 * Coleção «Favelas e comunidades urbanas» — desenha uma prancha a partir do cache de preparar.mjs (uso interno).
 *
 *   node --max-old-space-size=8192 scripts/colecoes/favelas-sp/prancha.mjs fcu|metropole|entorno|dentro
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { RAIZ, LP, SERIF, MONO, TINTA, CINZA, esc, nf, f1, largura, gerarPrancha, rotuloPainel, usarRegiao } from '../lib/prancha-sp.mjs';
import { L, NEUTRO, ZERO, pct, grande, barras, legendaBarras, legendaCategorias, caixaLegenda, nota } from '../lib/painel.mjs';
import { LIM_FCU, CORES_FCU, LIM_ENT, CORES_ENT } from './preparar.mjs';

const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'favelas-sp', 'serie.json'), 'utf8'));
const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `favelas-sp-${nome}.json`), 'utf8'));
const serie = (i) => () => L(`FAVELAS E COMUNIDADES URBANAS · ${i}/4`, `FAVELAS AND URBAN COMMUNITIES · ${i}/4`);
const classe = (v, lim) => { let i = 0; while (i < lim.length && v > lim[i] + 1e-9) i++; return i; };
const SEM_FCU = () => L('sem favela registrada pelo IBGE', 'no favela recorded by IBGE');
/** Percentual que pode vir como intervalo (sigilo): "40 a 41 %". */
const pc = (v) => (typeof v === 'number' ? pct(v, 0) : L(`${nf(Math.floor(v.de))} a ${nf(Math.ceil(v.ate))} %`, `${nf(Math.floor(v.de))} to ${nf(Math.ceil(v.ate))}%`));
const val = (v) => (typeof v === 'number' ? v : (v.de + v.ate) / 2);

/** Legenda da figura de reuso: as classes da legenda do painel, sem barras nem contagens, e as caixas
 * avulsas ([cor, rótulo]) logo abaixo. */
function legendaReuso(titulo, cores, rotulos, avulsas = []) {
  const g = legendaCategorias(cores.map((k, i) => [k, rotulos[i]]), 0, { titulo });
  const s = [g.svg];
  let y = g.y;
  for (const [cor, rot] of avulsas) { s.push(caixaLegenda(cor, rot, y)); y += 25; }
  const larg = Math.max(largura(titulo, 15, { mono: true, espaco: 2.4 }), ...[...rotulos, ...avulsas.map((a) => a[1])].map((r) => 42 + largura(r, 16)));
  return { svg: s.join('\n'), altura: y - 25 + 6, largura: Math.ceil(larg) };
}

/** Faixa de cores contínua, com os limites nas junções. */
function faixa(cores, limites, { larg = 64 } = {}) {
  const s = [];
  cores.forEach((c, i) => s.push(`<rect x="${i * larg}" y="0" width="${larg}" height="14" fill="${c}" stroke="#1a211a" stroke-width=".6"/>`));
  limites.forEach((l, i) => s.push(`<text x="${(i + 1) * larg}" y="32" text-anchor="middle" font-family="${MONO}" font-size="12">${esc(l)}</text>`));
  s.push(`<rect x="${cores.length * larg + 24}" y="0" width="38" height="14" fill="${NEUTRO}" stroke="#1a211a" stroke-width=".6"/>`);
  s.push(`<text x="${cores.length * larg + 72}" y="12" font-family="${MONO}" font-size="12" fill="${CINZA}">${esc(L('sem favela', 'no favela'))}</text>`);
  return s.join('\n');
}

/* ------------------------------------------------------------------ 1/4 onde estão, por município */
async function fcu() {
  const c = await ler('fcu');
  const por = new Map(c.mun.map((m) => [m.CD_MUN, m]));
  const rot = () => L(['até 2 %', '2 a 5 %', '5 a 10 %', '10 a 15 %', '15 a 20 %', 'mais de 20 %'], ['up to 2%', '2 to 5%', '5 to 10%', '10 to 15%', '15 to 20%', 'over 20%']);
  const cl = new Array(6).fill(0), nm = new Array(6).fill(0);
  for (const m of c.mun) if (m.pessoas_fcu > 0) { const k = classe(m.pct_fcu, LIM_FCU); cl[k] += m.pessoas_fcu; nm[k]++; }
  const topo = c.mun_pct[0], cap = c.capital;
  const t = c.por_tamanho;
  return () => ({
    layout: 'um',
    motivo: 'morro',
    serie: serie(1),
    titulo: () => L('Favelas e comunidades urbanas', 'Favelas and urban communities'),
    subtitulo: () => L('Um em cada doze paulistas, quase todos na metrópole e no litoral', 'One in twelve people in São Paulo, nearly all in the metropolis and on the coast'),
    descricao: () => L(
      'Parte da população de cada município que mora em setores censitários de Favelas e Comunidades Urbanas, como o IBGE as delimitou no Censo 2022',
      'Share of each municipality’s population living in census tracts of Favelas and Urban Communities, as delimited by IBGE in the 2022 Census'),
    mapa: () => ({
      preencher: (cd) => { const m = por.get(cd); return !m ? null : m.pessoas_fcu > 0 ? CORES_FCU[classe(m.pct_fcu, LIM_FCU)] : NEUTRO; },
      bordaMunicipio: 0.5,
      chamadas: [
        {
          cd: topo.CD_MUN, dx: 120, dy: 190, tamanho: 16,
          titulo: L(`${topo.NM_MUN.toUpperCase()} · ${pct(topo.pct_fcu, 0)}`, `${topo.NM_MUN.toUpperCase()} · ${nf(topo.pct_fcu, 0)}%`),
          linhas: L(['da população em favelas,', 'a maior parte do estado'], ['of the population in favelas,', 'the largest share in the state']),
        },
        {
          cd: cap.CD_MUN, dx: -260, dy: 210, tamanho: 16,
          titulo: L(`SÃO PAULO · ${grande(cap.pessoas_fcu).toUpperCase()}`, `SÃO PAULO · ${grande(cap.pessoas_fcu).toUpperCase()}`),
          linhas: L([`em ${nf(cap.n_fcu)} favelas e comunidades,`, `${pct(cap.pct_fcu, 0)} da cidade`], [`in ${nf(cap.n_fcu)} favelas and communities,`, `${nf(cap.pct_fcu, 0)}% of the city`]),
        },
      ],
    }),
    legendaFigura: () => legendaReuso(L('PARTE DA POPULAÇÃO EM FAVELAS', 'SHARE OF POPULATION IN FAVELAS'), CORES_FCU, rot(), [[NEUTRO, SEM_FCU()]]),
    numeros: () => [
      [grande(c.pessoas), [L('pessoas em favelas e', 'people in favelas and'), L(`comunidades, ${pct(c.pct, 1)} do estado`, `communities, ${nf(c.pct, 1)}% of the state`)]],
      [nf(c.n_fcu), [L('favelas e comunidades', 'favelas and communities'), L(`em ${nf(c.n_mun)} municípios`, `in ${nf(c.n_mun)} municipalities`)]],
      [pct((100 * cap.pessoas_fcu) / c.pessoas, 0), [L('delas moram na capital', 'of them live in the capital'), L(`(${grande(cap.pessoas_fcu)})`, `(${grande(cap.pessoas_fcu)})`)]],
      [nf(t[3].n), [L('favelas de mais de 10 mil', 'favelas of over 10,000'), L(`moradores; ${nf(t[0].n)} têm menos de mil`, `people; ${nf(t[0].n)} have under 1,000`)]],
    ],
    painel: (y) => {
      const itens = CORES_FCU.map((k, i) => [k, `${rot()[i]} · ${nf(nm[i])} ${L('mun.', 'mun.')}`, cl[i], c.pessoas]);
      const lg = legendaBarras(itens, y, { titulo: L('PARTE DA POPULAÇÃO EM FAVELAS', 'SHARE OF POPULATION IN FAVELAS'), rotuloValor: L('parte dos moradores de favelas do estado', 'share of the state’s favela residents') });
      let yy = lg.y + 4;
      const s = [lg.svg, caixaLegenda(NEUTRO, SEM_FCU(), yy)];
      yy += 42;
      s.push(rotuloPainel(L('MAIOR PARTE DA POPULAÇÃO EM FAVELAS', 'LARGEST SHARE OF POPULATION IN FAVELAS'), yy));
      const b = barras(c.mun_pct.slice(0, 4).map((m) => [m.NM_MUN, m.pct_fcu, CORES_FCU[5], `${pct(m.pct_fcu, 0)} · ${grande(m.pessoas_fcu)}`]), yy + 14, { max: topo.pct_fcu * 1.5, x0: 200 });
      s.push(b.svg);
      yy = b.y + 24;
      s.push(rotuloPainel(L('MAIS MORADORES EM FAVELAS, FORA A CAPITAL', 'MOST FAVELA RESIDENTS, OUTSIDE THE CAPITAL'), yy));
      const abs = c.mun_abs.filter((m) => m.CD_MUN !== cap.CD_MUN).slice(0, 4);
      const b2 = barras(abs.map((m) => [m.NM_MUN, m.pessoas_fcu, CORES_FCU[4], grande(m.pessoas_fcu)]), yy + 14, { max: abs[0].pessoas_fcu * 1.3, x0: 200 });
      s.push(b2.svg);
      return { svg: s.join('\n'), y: b2.y + 6 };
    },
    fontes: () => [
      L('IBGE, Censo 2022: agregados por setor', 'IBGE, 2022 Census: tract aggregates'),
      L('IBGE, Favelas e Comunidades Urbanas 2022', 'IBGE, 2022 Favelas and Urban Communities'),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ 2/4 na metrópole e na Baixada */
async function metropole() {
  await usarRegiao('favelas-sp-metropole');
  const c = await ler('fcu');
  const { feats } = await ler('setores-fcu');
  const base = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', 'favelas-sp-metropole-base.json'), 'utf8'));
  const naJanela = new Set(base.unidades.features.map((f) => String(f.properties.CD_MUN)));
  const sf = feats.filter((f) => naJanela.has(f.properties.CD_MUN));
  const munJ = c.mun.filter((m) => naJanela.has(m.CD_MUN) && m.pessoas_fcu > 0);
  const pesJ = munJ.reduce((a, m) => a + m.pessoas_fcu, 0);
  const nJ = c.todas.filter((f) => naJanela.has(f.CD_MUN)).length;
  const [p1, p2] = c.fcus_top;
  const top = c.fcus_top.slice(0, 8);
  const DESTAQUES = [['3518800', 'GUARULHOS'], ['3548708', 'SÃO BERNARDO'], ['3529401', 'MAUÁ'], ['3518701', 'GUARUJÁ'], ['3551009', 'SÃO VICENTE'], ['3513504', 'CUBATÃO'], ['3534401', 'OSASCO']];
  return () => ({
    layout: 'um',
    motivo: 'morro',
    serie: serie(2),
    pad: 20,
    titulo: () => L('As favelas da metrópole', 'The favelas of the metropolis'),
    subtitulo: () => L('Nas margens, nas encostas e nos mangues', 'On the edges, the hillsides and the mangroves'),
    descricao: () => L(
      'Setores censitários em Favelas e Comunidades Urbanas do Censo 2022 nos municípios das concentrações urbanas de São Paulo e de Santos e seus vizinhos',
      'Census tracts in Favelas and Urban Communities of the 2022 Census in the municipalities of the São Paulo and Santos urban concentrations and their neighbours'),
    mapa: () => ({
      preencher: () => NEUTRO,
      bordaMunicipio: 0.6,
      semRgint: true,
      tamanhoCapital: 18,
      camadas: [
        { feats: sf, cor: CORES_FCU[4], borda: CORES_FCU[5], largura: 0.3 },
        { feats: base.unidades.features, cor: 'none', borda: TINTA, largura: 0.9, opacidade: 1 },
      ],
      destaques: DESTAQUES.map(([cd, t]) => ({ cd, texto: t })),
      tamanhoDestaque: 13,
      chamadas: [
        {
          coord: p1.pt, dx: -150, dy: 330, tamanho: 16,
          titulo: L(`${p1.NM_FCU.toUpperCase()} · ${grande(p1.pessoas).toUpperCase()}`, `${p1.NM_FCU.toUpperCase()} · ${grande(p1.pessoas).toUpperCase()}`),
          linhas: L(['a maior favela do estado, ao lado', 'do Morumbi'], ['the largest favela in the state,', 'next to Morumbi']),
        },
        {
          coord: p2.pt, dx: 300, dy: -280, tamanho: 16,
          titulo: L(`${p2.NM_FCU.toUpperCase()} · ${grande(p2.pessoas).toUpperCase()}`, `${p2.NM_FCU.toUpperCase()} · ${grande(p2.pessoas).toUpperCase()}`),
          linhas: L(['a segunda, na zona sul,', 'junto a São Caetano do Sul'], ['the second, in the south zone,', 'by São Caetano do Sul']),
        },
      ],
    }),
    // Uma camada só: a caixa basta, com a linha de base em y = 0 (no recorte regional, na coluna à direita).
    legendaFigura: () => {
      const rot = L('setor em favela ou comunidade urbana', 'tract in a favela or urban community');
      return { svg: caixaLegenda(CORES_FCU[4], rot, 0), altura: 6, largura: Math.ceil(42 + largura(rot, 16)) };
    },
    numeros: () => [
      [pct((100 * pesJ) / c.pessoas, 0), [L('dos moradores de favelas', 'of the state’s favela residents'), L('do estado estão neste recorte', 'are in this map')]],
      [nf(nJ), [L('favelas e comunidades', 'favelas and communities'), L(`em ${nf(munJ.length)} municípios`, `in ${nf(munJ.length)} municipalities`)]],
      [grande(p1.pessoas), [L(`em ${p1.NM_FCU},`, `in ${p1.NM_FCU},`), L(`e ${grande(p2.pessoas)} em ${p2.NM_FCU}`, `and ${grande(p2.pessoas)} in ${p2.NM_FCU}`)]],
      [nf(c.por_tamanho[3].n), [L('favelas passam de', 'favelas exceed'), L('10 mil moradores', '10,000 residents')]],
    ],
    painel: (y) => {
      const s = [caixaLegenda(CORES_FCU[4], L('setor em favela ou comunidade urbana', 'tract in a favela or urban community'), y + 4)];
      let yy = y + 46;
      s.push(rotuloPainel(L('AS MAIORES (MORADORES)', 'THE LARGEST (RESIDENTS)'), yy));
      const b = barras(top.map((f) => [f.NM_FCU.length > 26 ? `${f.NM_FCU.slice(0, 25)}…` : f.NM_FCU, f.pessoas, CORES_FCU[4], `${grande(f.pessoas)} · ${f.NM_MUN}`]), yy + 14, { max: p1.pessoas * 1.7, x0: 250, passo: 20 });
      s.push(b.svg);
      yy = b.y + 24;
      s.push(rotuloPainel(L('FAVELAS PELO TAMANHO', 'FAVELAS BY SIZE'), yy));
      const tam = c.por_tamanho;
      const rotT = L(['menos de mil', '1 a 5 mil', '5 a 10 mil', 'mais de 10 mil'], ['under 1,000', '1,000 to 5,000', '5,000 to 10,000', 'over 10,000']);
      const b2 = barras(tam.map((t, i) => [rotT[i], t.pessoas, CORES_FCU[2 + i], L(`${nf(t.n)} favelas · ${grande(t.pessoas)} pessoas`, `${nf(t.n)} favelas · ${grande(t.pessoas)} people`)]), yy + 14, { max: Math.max(...tam.map((t) => t.pessoas)) * 1.9, x0: 200, passo: 20 });
      s.push(b2.svg);
      const n = nota(L('Contagens de todo o estado. A favela é a do IBGE: área de moradia popular com insegurança da posse e serviços ou urbanização incompletos.',
        'Statewide counts. A favela is IBGE’s: an area of low-income housing with insecure tenure and incomplete services or urbanisation.'), b2.y + 12, { tamanho: 14 });
      s.push(n.svg);
      return { svg: s.join('\n'), y: n.y + 4 };
    },
    fontes: () => [
      L('IBGE, Censo 2022: agregados por setor', 'IBGE, 2022 Census: tract aggregates'),
      L('IBGE, Malha de Setores 2022', 'IBGE, 2022 Census Tract Mesh'),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ 3/4 o entorno */
async function entorno() {
  const c = await ler('entorno');
  const por = new Map(c.linhas.map((l) => [l.CD_MUN, l]));
  const cor = (cd, k) => { const l = por.get(cd); return !l ? NEUTRO : l[k] === null ? null : CORES_ENT[classe(l[k], LIM_ENT)]; };
  const lim = LIM_ENT.map((v) => nf(v));
  const sp = c.br['São Paulo'], br = c.br.Brasil, rj = c.br['Rio de Janeiro'];
  const luz = c.sem_luz[0], pav = c.sem_pav[0], cal = c.sem_calcada[0];
  const ITENS = [
    ['sem_luz', L('sem iluminação pública', 'no street lighting')],
    ['sem_pav', L('via sem pavimentação', 'unpaved street')],
    ['sem_calcada', L('sem calçada', 'no pavement')],
    ['sem_bueiro', L('sem bueiro', 'no storm drain')],
    ['sem_arvores', L('sem árvore na face', 'no tree on the block face')],
    ['so_moto', L('só passa moto ou a pé', 'motorcycles or on foot only')],
  ];
  return () => ({
    layout: 'quatro',
    motivo: 'morro',
    serie: serie(3),
    titulo: () => L('A rua da favela', 'The favela street'),
    subtitulo: () => L('Sem luz pública na porta: 15 % nas favelas paulistas, 9 % nas do país', 'No street light at the door: 15% in São Paulo’s favelas, 9% in Brazil’s'),
    descricao: () => L(
      'Parte dos moradores de Favelas e Comunidades Urbanas cuja face de quadra não tem iluminação pública, pavimentação ou calçada, por município; Pesquisa Urbanística do Entorno dos Domicílios, Censo 2022',
      'Share of residents of Favelas and Urban Communities whose block face has no street lighting, paving or pavement, by municipality; Urban Survey of Household Surroundings, 2022 Census'),
    mapas: () => [
      {
        titulo: L('SEM ILUMINAÇÃO PÚBLICA · % DOS MORADORES', 'NO STREET LIGHTING · % OF RESIDENTS'),
        preencher: (cd) => cor(cd, 'sem_luz'),
        legenda: faixa(CORES_ENT, lim),
        chamadas: [{ cd: luz.CD_MUN, dx: 60, dy: -200, tamanho: 14, titulo: L(`${luz.NM_MUN.toUpperCase()} · ${pct(luz.sem_luz, 0)}`, `${luz.NM_MUN.toUpperCase()} · ${nf(luz.sem_luz, 0)}%`), linhas: L(['a maior parte entre as cidades', 'com 10 mil moradores em favela'], ['the largest share among towns', 'with 10,000 favela residents']) }],
      },
      {
        titulo: L('VIA SEM PAVIMENTAÇÃO · % DOS MORADORES', 'UNPAVED STREET · % OF RESIDENTS'),
        preencher: (cd) => cor(cd, 'sem_pav'),
        legenda: faixa(CORES_ENT, lim),
        chamadas: [{ cd: pav.CD_MUN, dx: 40, dy: 170, tamanho: 14, titulo: L(`${pav.NM_MUN.toUpperCase()} · ${pct(pav.sem_pav, 0)}`, `${pav.NM_MUN.toUpperCase()} · ${nf(pav.sem_pav, 0)}%`), linhas: L(['em rua de terra'], ['on dirt roads']) }],
      },
      {
        titulo: L('SEM CALÇADA · % DOS MORADORES', 'NO PAVEMENT · % OF RESIDENTS'),
        preencher: (cd) => cor(cd, 'sem_calcada'),
        legenda: faixa(CORES_ENT, lim),
        chamadas: [{ cd: cal.CD_MUN, dx: 40, dy: 170, tamanho: 14, titulo: L(`${cal.NM_MUN.toUpperCase()} · ${pct(cal.sem_calcada, 0)}`, `${cal.NM_MUN.toUpperCase()} · ${nf(cal.sem_calcada, 0)}%`), linhas: L(['sem calçada na porta'], ['with no pavement at the door']) }],
      },
    ],
    quartoQuadro: (w) => {
      const s = [`<text x="0" y="0" font-family="${MONO}" font-size="13" letter-spacing="2.4" fill="${CINZA}">${L('MORADORES DE FAVELAS: SÃO PAULO, RIO E BRASIL', 'FAVELA RESIDENTS: SÃO PAULO, RIO AND BRAZIL')}</text>`];
      const x0 = 250, larg = w - x0 - 60;
      let y = 26;
      const LEG = [[CORES_ENT[4], 'SP'], [CORES_ENT[2], 'RJ'], ['#9aa1a8', L('Brasil', 'Brazil')]];
      LEG.forEach(([k, t], i) => { s.push(`<rect x="${x0 + i * 110}" y="${y - 10}" width="14" height="10" fill="${k}"/><text x="${x0 + i * 110 + 20}" y="${y}" font-family="${MONO}" font-size="12">${esc(t)}</text>`); });
      y += 18;
      for (const [k, rot] of ITENS) {
        s.push(`<text x="${x0 - 12}" y="${y + 20}" text-anchor="end" font-family="${SERIF}" font-size="15">${esc(rot)}</text>`);
        [[sp, CORES_ENT[4]], [rj, CORES_ENT[2]], [br, '#9aa1a8']].forEach(([o, k2], i) => {
          const bw = (o[k] / 100) * larg;
          s.push(`<rect x="${x0}" y="${y + i * 11}" width="${f1(Math.max(bw, 1))}" height="9" fill="${k2}"/>`);
          s.push(`<text x="${f1(x0 + bw + 6)}" y="${y + i * 11 + 9}" font-family="${MONO}" font-size="10">${esc(pct(o[k], 0))}</text>`);
        });
        y += 46;
      }
      const n = nota(L('A pesquisa olha a face de quadra em frente a cada domicílio. Partes sobre os moradores com resposta declarada.',
        'The survey looks at the block face in front of each home. Shares of residents with a declared answer.'), y + 4, { tamanho: 14, max: w });
      s.push(n.svg);
      return s.join('\n');
    },
    numeros: () => [
      [pct(sp.sem_luz, 0), [L('dos moradores de favela sem', 'of favela residents with no'), L(`luz pública; ${pct(br.sem_luz, 0)} no Brasil`, `street light; ${nf(br.sem_luz, 0)}% in Brazil`)]],
      [pct(sp.sem_calcada, 0), [L('sem calçada na', 'with no pavement on'), L('face da quadra', 'the block face')]],
      [pct(sp.sem_pav, 0), [L('em via sem', 'on an unpaved'), L('pavimentação', 'street')]],
      [pct(sp.so_moto, 0), [L('em via onde só passa', 'on a street only motorcycles'), L('moto, bicicleta ou a pé', 'bicycles or walkers can use')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('MAIS SEM ILUMINAÇÃO PÚBLICA', 'MOST WITHOUT STREET LIGHTING'), y)];
      const b1 = barras(c.sem_luz.slice(0, 5).map((l) => [l.NM_MUN, l.sem_luz, CORES_ENT[4], pct(l.sem_luz, 0)]), y + 14, { max: 100, x0: 230 });
      s.push(b1.svg);
      let yy = b1.y + 24;
      s.push(rotuloPainel(L('MAIS EM VIA SEM PAVIMENTAÇÃO', 'MOST ON UNPAVED STREETS'), yy));
      const b2 = barras(c.sem_pav.slice(0, 5).map((l) => [l.NM_MUN, l.sem_pav, CORES_ENT[4], pct(l.sem_pav, 0)]), yy + 14, { max: 100, x0: 230 });
      s.push(b2.svg);
      yy = b2.y + 24;
      s.push(rotuloPainel(L('MAIS SEM CALÇADA', 'MOST WITHOUT PAVEMENT'), yy));
      const b3 = barras(c.sem_calcada.slice(0, 5).map((l) => [l.NM_MUN, l.sem_calcada, CORES_ENT[4], pct(l.sem_calcada, 0)]), yy + 14, { max: 100, x0: 230 });
      s.push(b3.svg);
      const n = nota(L(`Municípios com ao menos 10 mil moradores em favelas (${nf(c.grandes)} dos ${nf(c.n_mun)} com favela).`, `Municipalities with at least 10,000 favela residents (${nf(c.grandes)} of the ${nf(c.n_mun)} with favelas).`), b3.y + 10, { tamanho: 14 });
      s.push(n.svg);
      return { svg: s.join('\n'), y: n.y + 4 };
    },
    fontes: () => [
      L('IBGE, Censo 2022: SIDRA 10339 e 10340', 'IBGE, 2022 Census: SIDRA 10339 and 10340'),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ 4/4 dentro e fora */
async function dentro() {
  const c = await ler('dentro');
  const fc = await ler('fcu');
  const por = new Map(c.mun.filter((m) => m.pessoas_fcu >= 5000 && m.razao_renda).map((m) => [m.CD_MUN, m]));
  const comFcu = new Set(c.mun.map((m) => m.CD_MUN));
  const LIM_R = [0.35, 0.45, 0.55, 0.65];
  const CORES_R = ['#62351f', '#97573a', '#bf8159', '#d8ad8a', '#efe0cf'];
  const rotR = () => L(['até 35 %', '35 a 45 %', '45 a 55 %', '55 a 65 %', 'mais de 65 %'], ['up to 35%', '35 to 45%', '45 to 55%', '55 to 65%', 'over 65%']);
  const d = c.dentro, f = c.fora;
  const min = c.razao_min[0], max = c.razao_max[0];
  const PARES = [
    [L('renda média do responsável', 'mean income of household head'), d.renda_media, f.renda_media, (v) => `R$ ${nf(v)}`, Math.max(d.renda_media, f.renda_media)],
    [L('esgoto na rede', 'sewage to the mains'), val(d.pct_esgoto_rede), val(f.pct_esgoto_rede), null, 100, d.pct_esgoto_rede, f.pct_esgoto_rede],
    [L('responsável preto ou pardo', 'Black or brown household head'), val(d.pct_resp_pretos_pardos), val(f.pct_resp_pretos_pardos), null, 100, d.pct_resp_pretos_pardos, f.pct_resp_pretos_pardos],
    [L('crianças de até 9 anos', 'children aged up to 9'), d.pct_criancas, f.pct_criancas, null, 100, d.pct_criancas, f.pct_criancas],
    [L('moradores por domicílio', 'residents per home'), d.moradores_dom, f.moradores_dom, (v) => nf(v, 2), 4],
    [L('em apartamento', 'in a flat'), val(d.pct_apartamento), val(f.pct_apartamento), null, 100, d.pct_apartamento, f.pct_apartamento],
  ];
  return () => ({
    layout: 'um',
    motivo: 'morro',
    serie: serie(4),
    titulo: () => L('Dentro e fora da favela', 'Inside and outside the favela'),
    subtitulo: () => L('Na mesma cidade, dois quintos da renda', 'In the same town, two fifths of the income'),
    descricao: () => L(
      'Renda média dos responsáveis com rendimento nos setores de Favelas e Comunidades Urbanas sobre a renda dos demais setores do mesmo município, nos municípios com ao menos 5 mil moradores em favelas, Censo 2022',
      'Mean income of household heads with income in tracts of Favelas and Urban Communities over that of the other tracts of the same municipality, in municipalities with at least 5,000 favela residents, 2022 Census'),
    mapa: () => ({
      preencher: (cd) => { const m = por.get(cd); return m ? CORES_R[classe(m.razao_renda, LIM_R)] : comFcu.has(cd) ? ZERO : NEUTRO; },
      bordaMunicipio: 0.5,
      chamadas: [
        {
          cd: min.CD_MUN, dx: 120, dy: 200, tamanho: 16,
          titulo: L(`${min.NM_MUN.toUpperCase()} · ${nf(min.razao_renda * 100)} %`, `${min.NM_MUN.toUpperCase()} · ${nf(min.razao_renda * 100)}%`),
          linhas: L([`R$ ${nf(min.renda_dentro)} na favela e`, `R$ ${nf(min.renda_fora)} fora dela`], [`R$ ${nf(min.renda_dentro)} in the favela and`, `R$ ${nf(min.renda_fora)} outside it`]),
        },
        {
          cd: max.CD_MUN, dx: -250, dy: -230, tamanho: 16,
          titulo: L(`${max.NM_MUN.toUpperCase()} · ${nf(max.razao_renda * 100)} %`, `${max.NM_MUN.toUpperCase()} · ${nf(max.razao_renda * 100)}%`),
          linhas: L(['onde a cidade toda é pobre,', 'a distância encolhe'], ['where the whole town is poor,', 'the gap shrinks']),
        },
      ],
    }),
    legendaFigura: () => legendaReuso(L('RENDA NA FAVELA SOBRE A RENDA FORA', 'INCOME IN THE FAVELA OVER INCOME OUTSIDE'), CORES_R, rotR(),
      [[ZERO, L('menos de 5 mil moradores em favelas', 'under 5,000 favela residents')], [NEUTRO, SEM_FCU()]]),
    numeros: () => [
      [pct((100 * d.renda_media) / f.renda_media, 0), [L('da renda média de fora:', 'of the mean income outside:'), L(`R$ ${nf(d.renda_media)} e R$ ${nf(f.renda_media)}`, `R$ ${nf(d.renda_media)} and R$ ${nf(f.renda_media)}`)]],
      [pc(d.pct_esgoto_rede), [L('dos domicílios com esgoto', 'of homes with sewage to'), L(`na rede; ${pc(f.pct_esgoto_rede)} fora`, `the mains; ${pc(f.pct_esgoto_rede)} outside`)]],
      [pc(d.pct_resp_pretos_pardos), [L('dos responsáveis são pretos', 'of household heads are Black'), L(`ou pardos; ${pc(f.pct_resp_pretos_pardos)} fora`, `or brown; ${pc(f.pct_resp_pretos_pardos)} outside`)]],
      [nf(d.moradores_dom, 2), [L('moradores por domicílio,', 'residents per home,'), L(`e ${nf(f.moradores_dom, 2)} fora`, `and ${nf(f.moradores_dom, 2)} outside`)]],
    ],
    painel: (y) => {
      const rot = rotR();
      const nCl = new Array(5).fill(0);
      for (const m of por.values()) nCl[classe(m.razao_renda, LIM_R)]++;
      const s = [rotuloPainel(L('RENDA NA FAVELA SOBRE A RENDA FORA', 'INCOME IN THE FAVELA OVER INCOME OUTSIDE'), y)];
      let yy = y + 24;
      CORES_R.forEach((k, i) => { s.push(caixaLegenda(k, `${rot[i]} · ${nf(nCl[i])} ${L('municípios', 'municipalities')}`, yy)); yy += 25; });
      s.push(caixaLegenda(ZERO, L('menos de 5 mil moradores em favelas', 'under 5,000 favela residents'), yy)); yy += 25;
      s.push(caixaLegenda(NEUTRO, SEM_FCU(), yy)); yy += 34;
      s.push(rotuloPainel(L('DENTRO E FORA, NOS MUNICÍPIOS COM FAVELA', 'INSIDE AND OUTSIDE, IN TOWNS WITH FAVELAS'), yy));
      yy += 14;
      s.push(`<rect x="230" y="${yy}" width="14" height="10" fill="${CORES_FCU[4]}"/><text x="250" y="${yy + 9}" font-family="${MONO}" font-size="12">${L('na favela', 'in the favela')}</text><rect x="370" y="${yy}" width="14" height="10" fill="#9aa1a8"/><text x="390" y="${yy + 9}" font-family="${MONO}" font-size="12">${L('fora', 'outside')}</text>`);
      yy += 20;
      const larg = LP - 230 - 100;
      for (const [r, a, b, fmt, mx, ra, rb] of PARES) {
        s.push(`<text x="220" y="${yy + 15}" text-anchor="end" font-family="${SERIF}" font-size="14">${esc(r)}</text>`);
        [[a, CORES_FCU[4], ra], [b, '#9aa1a8', rb]].forEach(([v, k, raw], i) => {
          const bw = (v / mx) * larg;
          s.push(`<rect x="230" y="${yy + i * 11}" width="${f1(Math.max(bw, 1))}" height="9" fill="${k}"/>`);
          s.push(`<text x="${f1(230 + bw + 6)}" y="${yy + i * 11 + 9}" font-family="${MONO}" font-size="10">${esc(fmt ? fmt(v) : pc(raw))}</text>`);
        });
        yy += 28;
      }
      const n = nota(L(`Fora = setores fora de favelas dos ${nf(fc.n_mun)} municípios que têm favela. Onde o sigilo deixa o total em aberto, vai o intervalo.`,
        `Outside = tracts outside favelas in the ${nf(fc.n_mun)} municipalities that have favelas. Where confidentiality leaves the total open, the range is shown.`), yy + 6, { tamanho: 14 });
      s.push(n.svg);
      return { svg: s.join('\n'), y: n.y + 4 };
    },
    fontes: () => [
      L('IBGE, Censo 2022: agregados por setor', 'IBGE, 2022 Census: tract aggregates'),
      L('IBGE, Favelas e Comunidades Urbanas 2022', 'IBGE, 2022 Favelas and Urban Communities'),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { fcu, metropole, entorno, dentro };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/favelas-sp/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
const e = SERIE.find((s) => s.tema === nome);
const fazer = await TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => fazer() });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `favelas-sp-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
