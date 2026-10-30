#!/usr/bin/env node
/**
 * Coleção «Bioeconomia no trabalho» — desenha uma prancha a partir do cache de preparar.mjs (uso interno).
 *
 *   node scripts/colecoes/bioeconomia-sp/prancha.mjs emprego|perfil|geradores|encontro|residuos
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { RAIZ, LP, SERIF, MONO, TINTA, CINZA, esc, nf, f1, gerarPrancha, rotuloPainel, municipios } from '../lib/prancha-sp.mjs';
import { L, NEUTRO, pct, grande, barras, fita, legendaBarras, legendaCategorias, nota } from '../lib/painel.mjs';
import { pontoInterno } from '../lib/dados.mjs';
import { LIM_BIO, CORES_BIO, COR_SEG, COR_GER, LIM_RES, CORES_RES } from './preparar.mjs';
import { SEGMENTOS } from './cnae.mjs';
import { friso } from './friso.mjs';

const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'bioeconomia-sp', 'serie.json'), 'utf8'));
const C = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', 'bioeconomia-sp.json'), 'utf8'));
const POR = new Map(C.mun.map((m) => [m.CD_MUN, m]));
const CENTRO = new Map(municipios.map((f) => [f.properties.CD_MUN, pontoInterno(f.geometry)]));
const serie = (i) => () => L(`BIOECONOMIA NO TRABALHO · ${i}/5`, `THE BIOECONOMY AT WORK · ${i}/5`);
const classe = (v, lim) => { let i = 0; while (i < lim.length && v > lim[i] + 1e-9) i++; return i; };
const FONTES = () => [
  L('MTE, RAIS 2025: estabelecimentos (PDET)', 'MTE, RAIS 2025: establishments (PDET)'),
  L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
];
const NOME_SEG = () => ({
  agro: L('agropecuária, floresta e pesca', 'farming, forestry and fishing'),
  alimentos: L('alimentos, bebidas e fumo', 'food, drink and tobacco'),
  madeira: L('madeira, papel e móveis', 'wood, paper and furniture'),
  fibras: L('fibras naturais e couro', 'natural fibres and leather'),
  biocombustiveis: L('etanol e outros biocombustíveis', 'ethanol and other biofuels'),
});
const NOME_GER = () => ({
  acucar_etanol: L('açúcar e etanol', 'sugar and ethanol'),
  abate: L('abate e carnes', 'slaughter and meat'),
  laticinios: L('laticínios', 'dairy'),
  frutas: L('sucos e conservas', 'juices and preserves'),
  bebidas: L('cervejas e bebidas', 'beer and drinks'),
  graos_racoes: L('moagem, amidos e rações', 'milling, starch and feed'),
  oleos: L('óleos vegetais', 'vegetable oils'),
});
const mil = (v) => grande(v);
const T = C.tot;

/* ------------------------------------------------------------------ 1/5 a parte da bioeconomia no emprego */
function emprego() {
  const rot = L(['até 3 %', '3 a 6 %', '6 a 12 %', '12 a 20 %', '20 a 35 %', 'mais de 35 %'], ['up to 3%', '3 to 6%', '6 to 12%', '12 to 20%', '20 to 35%', 'over 35%']);
  const vin = new Array(6).fill(0), nm = new Array(6).fill(0);
  for (const m of C.mun) { const k = classe(m.pct_bio, LIM_BIO); vin[k] += m.bio; nm[k]++; }
  const alto = C.mun.filter((m) => m.vinculos >= 3000).sort((a, b) => b.pct_bio - a.pct_bio)[0];
  const cap = POR.get('3550308');
  const n35 = C.mun.filter((m) => m.pct_bio > 35).length;
  const reg = C.regioes;
  return () => ({
    layout: 'um',
    motivo: friso,
    serie: serie(1),
    titulo: () => L('A bioeconomia no emprego', 'The bioeconomy in jobs'),
    subtitulo: () => L('Um em cada quinze empregos formais vem da biomassa', 'One formal job in fifteen comes from biomass'),
    descricao: () => L(
      'Vínculos ativos em 31/12/2025 nos setores que produzem biomassa ou a transformam por inteiro, sobre todos os vínculos formais de cada município (RAIS 2025, recorte do JRC europeu)',
      'Active jobs on 31/12/2025 in sectors that produce biomass or wholly convert it, over all formal jobs in each municipality (RAIS 2025, European JRC scope)'),
    mapa: () => ({
      preencher: (cd) => { const m = POR.get(cd); return m ? CORES_BIO[classe(m.pct_bio, LIM_BIO)] : null; },
      bordaMunicipio: 0.5,
      chamadas: [
        {
          cd: alto.CD_MUN, dx: -240, dy: -240, tamanho: 16,
          titulo: L(`${alto.NM_MUN.toUpperCase()} · ${pct(alto.pct_bio, 0)}`, `${alto.NM_MUN.toUpperCase()} · ${nf(alto.pct_bio, 0)}%`),
          linhas: L([`dos ${nf(alto.vinculos)} vínculos formais`, 'estão na bioeconomia'], [`of ${nf(alto.vinculos)} formal jobs`, 'are in the bioeconomy']),
        },
        {
          cd: cap.CD_MUN, dx: 160, dy: 230, tamanho: 16,
          titulo: L(`SÃO PAULO · ${pct(cap.pct_bio, 1)}`, `SÃO PAULO · ${nf(cap.pct_bio, 1)}%`),
          linhas: L([`mas são ${mil(cap.bio)} vínculos,`, 'o maior número do estado'], [`but that is ${mil(cap.bio)} jobs,`, 'the most in the state']),
        },
      ],
    }),
    numeros: () => [
      [grande(T.bio), [L('vínculos na bioeconomia,', 'bioeconomy jobs,'), L(`${pct(T.pct_bio, 1)} do emprego formal`, `${nf(T.pct_bio, 1)}% of formal jobs`)]],
      [pct(C.br.pct_bio, 1), [L('é a parte no Brasil;', 'is the share in Brazil;'), L(`SP tem ${pct((100 * T.bio) / C.br.bio, 0)} dos vínculos do país`, `SP has ${nf((100 * T.bio) / C.br.bio, 0)}% of the country’s`)]],
      [nf(n35), [L('municípios com mais de', 'municipalities with over'), L('um terço dos vínculos nela', 'a third of jobs in it')]],
      [pct(reg[0].pct_bio, 0), [L(`na região de ${reg[0].NM_RGINT};`, `in the ${reg[0].NM_RGINT} region;`), L(`${pct(reg.at(-1).pct_bio, 1)} na de ${reg.at(-1).NM_RGINT}`, `${nf(reg.at(-1).pct_bio, 1)}% in ${reg.at(-1).NM_RGINT}`)]],
    ],
    painel: (y) => {
      const itens = CORES_BIO.map((k, i) => [k, `${rot[i]} · ${nf(nm[i])} ${L('mun.', 'mun.')}`, vin[i], T.bio]);
      const lg = legendaBarras(itens, y, { titulo: L('PARTE DOS VÍNCULOS NA BIOECONOMIA', 'SHARE OF JOBS IN THE BIOECONOMY'), rotuloValor: L('parte dos vínculos da bioeconomia do estado', 'share of the state’s bioeconomy jobs') });
      const s = [lg.svg];
      let yy = lg.y + 6;
      s.push(rotuloPainel(L('POR REGIÃO INTERMEDIÁRIA', 'BY INTERMEDIATE REGION'), yy));
      const b = barras(reg.map((r) => [r.NM_RGINT, r.pct_bio, CORES_BIO[classe(r.pct_bio, LIM_BIO)], `${pct(r.pct_bio, 1)} · ${mil(r.bio)}`]), yy + 14, { max: reg[0].pct_bio * 1.35, x0: 210, passo: 17 });
      s.push(b.svg);
      const n = nota(L('Entram agropecuária, floresta, pesca, alimentos, bebidas, fumo, madeira, papel, fibras naturais, couro e biocombustíveis. A RAIS conta só o emprego formal, no endereço do estabelecimento.',
        'Included: farming, forestry, fishing, food, drink, tobacco, wood, paper, natural fibres, leather and biofuels. RAIS counts only formal jobs, at the establishment’s address.'), b.y + 14, { tamanho: 14 });
      s.push(n.svg);
      return { svg: s.join('\n'), y: n.y };
    },
    // Figura: só as classes, sem contagens nem barras; os rótulos saem aqui, já na língua da figura.
    legendaFigura: () => {
      const r = L(['até 3 %', '3 a 6 %', '6 a 12 %', '12 a 20 %', '20 a 35 %', 'mais de 35 %'], ['up to 3%', '3 to 6%', '6 to 12%', '12 to 20%', '20 to 35%', 'over 35%']);
      const lg = legendaCategorias(CORES_BIO.map((k, i) => [k, r[i]]), 0, { titulo: L('PARTE DOS VÍNCULOS NA BIOECONOMIA', 'SHARE OF JOBS IN THE BIOECONOMY') });
      return { svg: lg.svg, altura: lg.y - 22, largura: 420 };
    },
    fontes: FONTES,
  });
}

/* ------------------------------------------------------------------ 2/5 que bioeconomia */
function perfil() {
  const NS = NOME_SEG();
  const nm = {}; for (const m of C.mun) nm[m.dominante] = (nm[m.dominante] ?? 0) + 1;
  const madeira = C.mun.filter((m) => m.dominante === 'madeira').sort((a, b) => b.madeira - a.madeira)[0];
  const bioc = C.mun.filter((m) => m.dominante === 'biocombustiveis').sort((a, b) => b.biocombustiveis - a.biocombustiveis)[0];
  const reg = [...C.regioes].sort((a, b) => b.bio - a.bio);
  return () => ({
    layout: 'um',
    motivo: friso,
    serie: serie(2),
    titulo: () => L('Que bioeconomia', 'Which bioeconomy'),
    subtitulo: () => L('O campo lidera no interior e no Vale do Ribeira; a fábrica de alimentos, em volta das cidades', 'Farming leads inland and in the Ribeira Valley; food factories, around the towns'),
    descricao: () => L(
      'Segmento da bioeconomia com mais vínculos formais ativos em cada município, em 31/12/2025 (RAIS 2025)',
      'Bioeconomy segment with the most active formal jobs in each municipality, on 31/12/2025 (RAIS 2025)'),
    mapa: () => ({
      preencher: (cd) => { const m = POR.get(cd); return m?.dominante ? COR_SEG[m.dominante] : null; },
      bordaMunicipio: 0.5,
      chamadas: [
        {
          cd: madeira.CD_MUN, dx: 190, dy: 250, tamanho: 16,
          titulo: L(`${madeira.NM_MUN.toUpperCase()} · ${nf(madeira.madeira)}`, `${madeira.NM_MUN.toUpperCase()} · ${nf(madeira.madeira)}`),
          linhas: L(['vínculos em madeira e papel'], ['jobs in wood and paper']),
        },
        {
          cd: bioc.CD_MUN, dx: -60, dy: -260, tamanho: 16,
          titulo: L(`${bioc.NM_MUN.toUpperCase()} · ${nf(bioc.biocombustiveis)}`, `${bioc.NM_MUN.toUpperCase()} · ${nf(bioc.biocombustiveis)}`),
          linhas: L(['vínculos em usinas de etanol,', 'o maior número do estado'], ['jobs in ethanol plants,', 'the most in the state']),
        },
      ],
    }),
    numeros: () => [
      [nf(nm.agro), [L('municípios onde o campo', 'municipalities where farming'), L('emprega mais', 'employs most')]],
      [nf(nm.alimentos), [L('onde a indústria de', 'where the food and drink'), L('alimentos e bebidas lidera', 'industry leads')]],
      [grande(T.alimentos), [L('vínculos em alimentos, bebidas', 'jobs in food, drink'), L(`e fumo, ${pct((100 * T.alimentos) / T.bio, 0)} da bioeconomia`, `and tobacco, ${nf((100 * T.alimentos) / T.bio, 0)}% of the bioeconomy`)]],
      [grande(T.biocombustiveis), [L('vínculos em usinas de etanol', 'jobs in ethanol and other'), L('e outros biocombustíveis', 'biofuel plants')]],
    ],
    painel: (y) => {
      const s = [];
      const lg = legendaCategorias(SEGMENTOS.map((k) => [COR_SEG[k], NS[k], `${nf(nm[k] ?? 0)} mun. · ${mil(T[k])}`]), y, { titulo: L('SEGMENTO COM MAIS VÍNCULOS', 'SEGMENT WITH MOST JOBS'), passo: 24 });
      s.push(lg.svg);
      let yy = lg.y + 10;
      s.push(rotuloPainel(L('COMPOSIÇÃO DA BIOECONOMIA, POR REGIÃO', 'BIOECONOMY MIX, BY REGION'), yy));
      yy += 14;
      const x0 = 210, larg = LP - x0;
      const linhas = [{ NM_RGINT: L('Brasil', 'Brazil'), ...C.br }, { NM_RGINT: L('Estado de SP', 'São Paulo State'), ...T }, ...reg];
      for (const r of linhas) {
        s.push(`<text x="${x0 - 10}" y="${yy + 11}" text-anchor="end" font-family="${SERIF}" font-size="14"${r.CD_RGINT ? '' : ' font-weight="bold"'}>${esc(r.NM_RGINT)}</text>`);
        let x = x0;
        for (const k of SEGMENTOS) { const w = (r[k] / r.bio) * larg; s.push(`<rect x="${f1(x)}" y="${yy + 1}" width="${f1(Math.max(w, 0))}" height="12" fill="${COR_SEG[k]}"/>`); x += w; }
        yy += r.CD_RGINT ? 17 : 19;
      }
      const n = nota(L('Cada barra soma 100 % dos vínculos da bioeconomia da região. O açúcar entra em alimentos; o etanol, em biocombustíveis.',
        'Each bar adds up to 100% of the region’s bioeconomy jobs. Sugar counts as food; ethanol as biofuel.'), yy + 10, { tamanho: 14 });
      s.push(n.svg);
      return { svg: s.join('\n'), y: n.y };
    },
    // Figura: os segmentos, sem contagens nem a composição por região.
    legendaFigura: () => {
      const ns = NOME_SEG();
      const lg = legendaCategorias(SEGMENTOS.map((k) => [COR_SEG[k], ns[k]]), 0, { titulo: L('SEGMENTO COM MAIS VÍNCULOS', 'SEGMENT WITH MOST JOBS'), passo: 24 });
      return { svg: lg.svg, altura: lg.y - 21, largura: 420 };
    },
    fontes: FONTES,
  });
}

/* ------------------------------------------------------------------ 3/5 indústrias do resíduo orgânico */
function geradores() {
  const NG = NOME_GER();
  const grupos = Object.keys(COR_GER).sort((a, b) => T[`g_${b}`] - T[`g_${a}`]);
  const maxG = Math.max(...C.mun.map((m) => m.ger));
  const rMax = 30;
  const raio = (v) => rMax * Math.sqrt(v / maxG);
  const top = C.mun.filter((m) => m.CD_MUN !== '3550308').sort((a, b) => b.ger - a.ger);
  const cap = POR.get('3550308');
  const um = top[0];
  return () => ({
    layout: 'um',
    motivo: friso,
    serie: serie(3),
    titulo: () => L('As fábricas do resíduo orgânico', 'The organic-waste factories'),
    subtitulo: () => L('Usinas, frigoríficos, laticínios, sucos e cervejarias: onde a indústria deixa resíduo orgânico', 'Mills, slaughterhouses, dairies, juice plants and breweries: where industry leaves organic waste'),
    descricao: () => L(
      'Vínculos formais nas indústrias que geram efluente e resíduo orgânico em volume, por município, com a cor do ramo com mais vínculos (RAIS 2025)',
      'Formal jobs in industries that generate organic effluent and waste in volume, by municipality, coloured by the branch with most jobs (RAIS 2025)'),
    mapa: () => ({
      preencher: () => NEUTRO,
      bordaMunicipio: 0.4,
      pontos: C.mun.filter((m) => m.ger > 0).map((m) => ({ coord: CENTRO.get(m.CD_MUN), r: Math.max(raio(m.ger), 1.6), cor: COR_GER[m.g_dominante], opacidade: 0.85 })),
      chamadas: [
        {
          cd: um.CD_MUN, dx: -200, dy: -250, tamanho: 16,
          titulo: L(`${um.NM_MUN.toUpperCase()} · ${nf(um.ger)}`, `${um.NM_MUN.toUpperCase()} · ${nf(um.ger)}`),
          linhas: L([`vínculos, ${pct((100 * um[`g_${um.g_dominante}`]) / um.ger, 0)} em ${NG[um.g_dominante]}`], [`jobs, ${nf((100 * um[`g_${um.g_dominante}`]) / um.ger, 0)}% in ${NG[um.g_dominante]}`]),
        },
        {
          cd: cap.CD_MUN, dx: 170, dy: 230, tamanho: 16,
          titulo: L(`SÃO PAULO · ${nf(cap.ger)}`, `SÃO PAULO · ${nf(cap.ger)}`),
          linhas: L(['vínculos repartidos entre laticínios,', 'óleos, abate e bebidas'], ['jobs split between dairy,', 'oils, meat and drinks']),
        },
      ],
    }),
    numeros: () => [
      [grande(T.ger), [L('vínculos nessas indústrias,', 'jobs in these industries,'), L(`em ${nf(T.estab_ger)} estabelecimentos`, `in ${nf(T.estab_ger)} establishments`)]],
      [pct((100 * T.g_acucar_etanol) / T.ger, 0), [L('estão nas usinas de', 'are in sugar and'), L('açúcar e etanol', 'ethanol mills')]],
      [grande(T.g_abate), [L('vínculos em abate e carnes,', 'jobs in slaughter and meat,'), L('o segundo ramo', 'the second branch')]],
      [nf(C.mun.filter((m) => m.ger > 0).length), [L('municípios têm ao menos', 'municipalities have at least'), L('uma dessas indústrias', 'one of these industries')]],
    ],
    painel: (y) => {
      const s = [];
      const lg = legendaCategorias(grupos.map((g) => [COR_GER[g], NG[g], `${mil(T[`g_${g}`])} ${L('vínculos', 'jobs')}`]), y, { titulo: L('RAMO COM MAIS VÍNCULOS (COR DO CÍRCULO)', 'BRANCH WITH MOST JOBS (CIRCLE COLOUR)'), passo: 24 });
      s.push(lg.svg);
      let yy = lg.y + 6;
      // Escala dos círculos.
      s.push(rotuloPainel(L('VÍNCULOS (ÁREA DO CÍRCULO)', 'JOBS (CIRCLE AREA)'), yy));
      let x = 20;
      for (const v of [500, 2000, 8000]) {
        const r = raio(v);
        s.push(`<circle cx="${f1(x + r)}" cy="${f1(yy + 14 + 2 * rMax - r)}" r="${f1(r)}" fill="none" stroke="${TINTA}" stroke-width=".8"/>`);
        s.push(`<text x="${f1(x + r)}" y="${f1(yy + 30 + 2 * rMax)}" text-anchor="middle" font-family="${MONO}" font-size="12">${nf(v)}</text>`);
        x += 2 * r + 46;
      }
      yy += 2 * rMax + 50;
      s.push(rotuloPainel(L('MAIS VÍNCULOS, FORA A CAPITAL', 'MOST JOBS, OUTSIDE THE CAPITAL'), yy));
      const b = barras(top.slice(0, 6).map((m) => [m.NM_MUN, m.ger, COR_GER[m.g_dominante], `${nf(m.ger)} · ${NG[m.g_dominante]}`]), yy + 14, { max: top[0].ger * 1.6, x0: 200, passo: 17 });
      s.push(b.svg);
      const n = nota(L('O potencial de biometano das pranchas 055 a 059 já conta a vinhaça, a torta e o bagaço das usinas; o efluente de frigoríficos, laticínios, sucos e cervejarias fica fora dele.',
        'The biomethane potential on plates 055 to 059 already counts mill vinasse, filter cake and bagasse; effluent from slaughterhouses, dairies, juice plants and breweries is not in it.'), b.y + 12, { tamanho: 14 });
      s.push(n.svg);
      return { svg: s.join('\n'), y: n.y };
    },
    // Figura: os ramos e a escala dos círculos, sem os vínculos de cada ramo nem a lista.
    legendaFigura: () => {
      const ng = NOME_GER();
      const lg = legendaCategorias(grupos.map((g) => [COR_GER[g], ng[g]]), 0, { titulo: L('RAMO COM MAIS VÍNCULOS (COR DO CÍRCULO)', 'BRANCH WITH MOST JOBS (CIRCLE COLOUR)'), passo: 24 });
      const s = [lg.svg];
      const yy = lg.y + 6;
      s.push(rotuloPainel(L('VÍNCULOS (ÁREA DO CÍRCULO)', 'JOBS (CIRCLE AREA)'), yy));
      let x = 20;
      for (const v of [500, 2000, 8000]) {
        const r = raio(v);
        s.push(`<circle cx="${f1(x + r)}" cy="${f1(yy + 14 + 2 * rMax - r)}" r="${f1(r)}" fill="none" stroke="${TINTA}" stroke-width=".8"/>`);
        s.push(`<text x="${f1(x + r)}" y="${f1(yy + 30 + 2 * rMax)}" text-anchor="middle" font-family="${MONO}" font-size="12">${nf(v)}</text>`);
        x += 2 * r + 46;
      }
      return { svg: s.join('\n'), altura: yy + 34 + 2 * rMax, largura: 460 };
    },
    fontes: FONTES,
  });
}

/* ------------------------------------------------------------------ 4/5 biomassa e indústria */
export const BIV = [
  ['#ebe8dd', '#e0c7a1', '#c99a63'],
  ['#c9d2b2', '#c0ad83', '#a87d4c'],
  ['#9db386', '#8d9563', '#6b5f35'],
];
function encontro() {
  const ind = (m) => m.alimentos + m.madeira + m.fibras + m.biocombustiveis;
  const ter = (vals) => { const v = vals.filter((x) => x > 0).sort((a, b) => a - b); return [v[Math.floor(v.length / 3)], v[Math.floor((2 * v.length) / 3)]]; };
  const tP = ter(C.mun.map((m) => m.biometano));
  const tI = ter(C.mun.map(ind));
  const cl = (v, t) => (v <= 0 ? 0 : v <= t[0] ? 0 : v <= t[1] ? 1 : 2);
  const cel = new Map(C.mun.map((m) => [m.CD_MUN, [cl(m.biometano, tP), cl(ind(m), tI)]]));
  const n = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const [p, i] of cel.values()) n[p][i]++;
  const soBio = C.mun.filter((m) => cel.get(m.CD_MUN)[0] === 2 && cel.get(m.CD_MUN)[1] === 0).sort((a, b) => b.biometano - a.biometano);
  const soInd = C.mun.filter((m) => cel.get(m.CD_MUN)[0] === 0 && cel.get(m.CD_MUN)[1] === 2).sort((a, b) => ind(b) - ind(a));
  const juntos = C.mun.filter((m) => cel.get(m.CD_MUN)[0] === 2 && cel.get(m.CD_MUN)[1] === 2);
  const bioJ = juntos.reduce((a, m) => a + m.biometano, 0), indJ = juntos.reduce((a, m) => a + ind(m), 0);
  const indT = C.mun.reduce((a, m) => a + ind(m), 0);
  const a = soBio[0], b = soInd[0];
  return () => ({
    layout: 'um',
    motivo: friso,
    serie: serie(4),
    titulo: () => L('Onde a biomassa encontra a fábrica', 'Where biomass meets the factory'),
    subtitulo: () => L('Os polos que já têm resíduo e indústria, e os que só têm um dos dois', 'The hubs that already have both residue and industry, and those with only one'),
    descricao: () => L(
      'Potencial de biometano do CP2B (nível N4, cenário de referência) cruzado com os vínculos formais da indústria de base biológica (alimentos, bebidas, madeira, papel, fibras e biocombustíveis), cada um em terços dos municípios',
      'CP2B biomethane potential (level N4, reference scenario) crossed with formal jobs in bio-based industry (food, drink, wood, paper, fibres and biofuels), each in thirds of the municipalities'),
    mapa: () => ({
      preencher: (cd) => { const c = cel.get(cd); return c ? BIV[c[0]][c[1]] : null; },
      bordaMunicipio: 0.5,
      chamadas: [
        {
          cd: a.CD_MUN, dx: -230, dy: -230, tamanho: 16,
          titulo: L(`${a.NM_MUN.toUpperCase()}`, `${a.NM_MUN.toUpperCase()}`),
          linhas: L([`${nf(Math.round(a.biometano / 1e3))} mil m³/dia de biometano`, `e ${nf(ind(a))} vínculos na indústria`], [`${nf(Math.round(a.biometano / 1e3))} thousand m³/day of biomethane`, `and ${nf(ind(a))} industry jobs`]),
        },
        {
          cd: b.CD_MUN, dx: 200, dy: 220, tamanho: 16,
          titulo: L(`${b.NM_MUN.toUpperCase()}`, `${b.NM_MUN.toUpperCase()}`),
          linhas: L([`${nf(ind(b))} vínculos na indústria`, 'e pouca biomassa própria'], [`${nf(ind(b))} industry jobs`, 'and little biomass of its own']),
        },
      ],
    }),
    numeros: () => [
      [nf(n[2][2]), [L('municípios no terço de cima', 'municipalities in the top third'), L('dos dois: os polos', 'of both: the hubs')]],
      [pct((100 * bioJ) / T.biometano, 0), [L('do biometano do estado', 'of the state’s biomethane'), L(`e ${pct((100 * indJ) / indT, 0)} desses vínculos`, `and ${nf((100 * indJ) / indT, 0)}% of these jobs`)]],
      [nf(n[2][0]), [L('com muita biomassa e', 'with plenty of biomass and'), L('pouca indústria', 'little industry')]],
      [nf(n[0][2]), [L('com indústria forte e', 'with strong industry and'), L('pouca biomassa', 'little biomass')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('BIOMETANO × INDÚSTRIA DE BASE BIOLÓGICA', 'BIOMETHANE × BIO-BASED INDUSTRY'), y)];
      const q = 54, x0 = 120, y0 = y + 30;
      for (let p = 0; p < 3; p++) for (let i = 0; i < 3; i++) {
        const xx = x0 + i * q, yy = y0 + (2 - p) * q;
        s.push(`<rect x="${xx}" y="${yy}" width="${q}" height="${q}" fill="${BIV[p][i]}" stroke="#ffffff" stroke-width="1"/>`);
        s.push(`<text x="${xx + q / 2}" y="${yy + q / 2 + 5}" text-anchor="middle" font-family="${MONO}" font-size="13" fill="${p + i >= 3 ? '#ffffff' : TINTA}">${n[p][i]}</text>`);
      }
      s.push(`<path d="M${x0} ${y0 + 3 * q + 10}h${3 * q}" stroke="${TINTA}" stroke-width="1"/><path d="M${x0 + 3 * q - 6} ${y0 + 3 * q + 6}l6 4l-6 4" fill="none" stroke="${TINTA}"/>`);
      s.push(`<text x="${x0 + 1.5 * q}" y="${y0 + 3 * q + 30}" text-anchor="middle" font-family="${MONO}" font-size="12">${esc(L('vínculos na indústria →', 'industry jobs →'))}</text>`);
      s.push(`<path d="M${x0 - 10} ${y0 + 3 * q}v${-3 * q}" stroke="${TINTA}" stroke-width="1"/><path d="M${x0 - 14} ${y0 + 6}l4 -6l4 6" fill="none" stroke="${TINTA}"/>`);
      s.push(`<text x="${x0 - 22}" y="${y0 + 1.5 * q}" text-anchor="middle" font-family="${MONO}" font-size="12" transform="rotate(-90 ${x0 - 22} ${y0 + 1.5 * q})">${esc(L('biometano →', 'biomethane →'))}</text>`);
      const tx = x0 + 3 * q + 34;
      const lin = L([`terços do biometano: até ${nf(Math.round(tP[0] / 1e3))} mil,`, `${nf(Math.round(tP[0] / 1e3))} a ${nf(Math.round(tP[1] / 1e3))} mil e mais de`, `${nf(Math.round(tP[1] / 1e3))} mil m³/dia`, '', `terços da indústria: até ${nf(tI[0])},`, `${nf(tI[0])} a ${nf(tI[1])} e mais de ${nf(tI[1])} vínculos`, '', 'número de municípios em cada casa'],
        [`biomethane thirds: up to ${nf(Math.round(tP[0] / 1e3))} thousand,`, `${nf(Math.round(tP[0] / 1e3))} to ${nf(Math.round(tP[1] / 1e3))} thousand and over`, `${nf(Math.round(tP[1] / 1e3))} thousand m³/day`, '', `industry thirds: up to ${nf(tI[0])},`, `${nf(tI[0])} to ${nf(tI[1])} and over ${nf(tI[1])} jobs`, '', 'number of municipalities in each cell']);
      lin.forEach((l, k) => s.push(`<text x="${tx}" y="${y0 + 12 + k * 18}" font-family="${MONO}" font-size="12" fill="${CINZA}">${esc(l)}</text>`));
      let yy = y0 + 3 * q + 56;
      s.push(rotuloPainel(L('MUITA BIOMASSA, POUCA INDÚSTRIA', 'PLENTY OF BIOMASS, LITTLE INDUSTRY'), yy));
      const b1 = barras(soBio.slice(0, 4).map((m) => [m.NM_MUN, m.biometano, BIV[2][0], `${nf(Math.round(m.biometano / 1e3))} mil m³/dia · ${nf(ind(m))} vínc.`]), yy + 14, { max: soBio[0].biometano * 1.9, x0: 200, passo: 17 });
      s.push(b1.svg);
      yy = b1.y + 18;
      s.push(rotuloPainel(L('MUITA INDÚSTRIA, POUCA BIOMASSA', 'PLENTY OF INDUSTRY, LITTLE BIOMASS'), yy));
      const b2 = barras(soInd.slice(0, 4).map((m) => [m.NM_MUN, ind(m), BIV[0][2], `${nf(ind(m))} vínc. · ${nf(Math.round(m.biometano / 1e3))} mil m³/dia`]), yy + 14, { max: ind(soInd[0]) * 1.9, x0: 200, passo: 17 });
      s.push(b2.svg);
      return { svg: s.join('\n'), y: b2.y };
    },
    // Figura: a grade bivariada com os eixos e os limites dos terços, sem o número de municípios nem as listas.
    legendaFigura: () => {
      const s = [rotuloPainel(L('BIOMETANO × INDÚSTRIA DE BASE BIOLÓGICA', 'BIOMETHANE × BIO-BASED INDUSTRY'), 0)];
      const q = 54, x0 = 40, y0 = 30;
      for (let p = 0; p < 3; p++) for (let i = 0; i < 3; i++)
        s.push(`<rect x="${x0 + i * q}" y="${y0 + (2 - p) * q}" width="${q}" height="${q}" fill="${BIV[p][i]}" stroke="#ffffff" stroke-width="1"/>`);
      s.push(`<path d="M${x0} ${y0 + 3 * q + 10}h${3 * q}" stroke="${TINTA}" stroke-width="1"/><path d="M${x0 + 3 * q - 6} ${y0 + 3 * q + 6}l6 4l-6 4" fill="none" stroke="${TINTA}"/>`);
      s.push(`<text x="${x0 + 1.5 * q}" y="${y0 + 3 * q + 30}" text-anchor="middle" font-family="${MONO}" font-size="12">${esc(L('vínculos na indústria →', 'industry jobs →'))}</text>`);
      s.push(`<path d="M${x0 - 10} ${y0 + 3 * q}v${-3 * q}" stroke="${TINTA}" stroke-width="1"/><path d="M${x0 - 14} ${y0 + 6}l4 -6l4 6" fill="none" stroke="${TINTA}"/>`);
      s.push(`<text x="${x0 - 22}" y="${y0 + 1.5 * q}" text-anchor="middle" font-family="${MONO}" font-size="12" transform="rotate(-90 ${x0 - 22} ${y0 + 1.5 * q})">${esc(L('biometano →', 'biomethane →'))}</text>`);
      const tx = x0 + 3 * q + 34;
      const lin = L([`terços do biometano: até ${nf(Math.round(tP[0] / 1e3))} mil,`, `${nf(Math.round(tP[0] / 1e3))} a ${nf(Math.round(tP[1] / 1e3))} mil e mais de`, `${nf(Math.round(tP[1] / 1e3))} mil m³/dia`, '', `terços da indústria: até ${nf(tI[0])},`, `${nf(tI[0])} a ${nf(tI[1])} e mais de ${nf(tI[1])} vínculos`],
        [`biomethane thirds: up to ${nf(Math.round(tP[0] / 1e3))} thousand,`, `${nf(Math.round(tP[0] / 1e3))} to ${nf(Math.round(tP[1] / 1e3))} thousand and over`, `${nf(Math.round(tP[1] / 1e3))} thousand m³/day`, '', `industry thirds: up to ${nf(tI[0])},`, `${nf(tI[0])} to ${nf(tI[1])} and over ${nf(tI[1])} jobs`]);
      lin.forEach((l, k) => s.push(`<text x="${tx}" y="${y0 + 12 + k * 18}" font-family="${MONO}" font-size="12" fill="${CINZA}">${esc(l)}</text>`));
      return { svg: s.join('\n'), altura: y0 + 3 * q + 34, largura: tx + 330 };
    },
    fontes: () => [
      L('MTE, RAIS 2025: estabelecimentos (PDET)', 'MTE, RAIS 2025: establishments (PDET)'),
      L('CP2B (Unicamp), potencial de biometano, v5.1', 'CP2B (Unicamp), biomethane potential, v5.1'),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ 5/5 quem trata o resíduo */
function residuos() {
  const LIM_U = [500, 1500, 4000, 10000];
  const CORES_U = ['#eef0ee', '#d3ddd8', '#a9c0b6', '#7a9c8f', '#4f7668'];
  const trat = C.mun.filter((m) => m.res_tratamento > 0);
  const maxT = Math.max(...trat.map((m) => m.res_tratamento));
  const rMax = 26;
  const raio = (v) => rMax * Math.sqrt(v / maxT);
  const urbT = T.biometano_urbano;
  const cap = POR.get('3550308');
  const semTrat = C.mun.filter((m) => m.res_tratamento === 0);
  const urbSem = semTrat.reduce((a, m) => a + m.biometano_urbano, 0);
  const grandesSem = semTrat.filter((m) => m.biometano_urbano >= 4000).sort((a, b) => b.biometano_urbano - a.biometano_urbano);
  const topT = [...trat].sort((a, b) => b.res_tratamento - a.res_tratamento);
  const reg = [...C.regioes].sort((a, b) => b.res_10mil - a.res_10mil);
  const g = grandesSem[0];
  return () => ({
    layout: 'um',
    motivo: friso,
    serie: serie(5),
    titulo: () => L('Quem trata o resíduo', 'Who treats the waste'),
    subtitulo: () => L('O resíduo urbano está em toda parte; quem o trata, em poucos lugares', 'Urban waste is everywhere; those who treat it are in few places'),
    descricao: () => L(
      'Potencial de biometano do lixo orgânico, do lodo de esgoto e da poda (CP2B, N4, referência) e vínculos formais em tratamento e disposição de resíduos (CNAE 3821 e 3822, RAIS 2025), por município',
      'Biomethane potential from organic rubbish, sewage sludge and prunings (CP2B, N4, reference) and formal jobs in waste treatment and disposal (CNAE 3821 and 3822, RAIS 2025), by municipality'),
    mapa: () => ({
      preencher: (cd) => { const m = POR.get(cd); return m ? CORES_U[classe(m.biometano_urbano, LIM_U)] : null; },
      bordaMunicipio: 0.5,
      pontos: trat.map((m) => ({ coord: CENTRO.get(m.CD_MUN), r: Math.max(raio(m.res_tratamento), 2), cor: '#8a4a2a', opacidade: 0.85 })),
      chamadas: [
        {
          cd: cap.CD_MUN, dx: 170, dy: 240, tamanho: 16,
          titulo: L(`SÃO PAULO · ${pct((100 * cap.biometano_urbano) / urbT, 0)}`, `SÃO PAULO · ${nf((100 * cap.biometano_urbano) / urbT, 0)}%`),
          linhas: L(['do biometano urbano do estado', `e ${nf(cap.res_tratamento)} vínculos em tratamento`], ['of the state’s urban biomethane', `and ${nf(cap.res_tratamento)} jobs in treatment`]),
        },
        ...(g ? [{
          cd: g.CD_MUN, dx: -230, dy: -230, tamanho: 16,
          titulo: L(`${g.NM_MUN.toUpperCase()}`, `${g.NM_MUN.toUpperCase()}`),
          linhas: L([`${nf(Math.round(g.biometano_urbano / 1e3))} mil m³/dia no resíduo urbano`, 'e nenhum vínculo em tratamento'], [`${nf(Math.round(g.biometano_urbano / 1e3))} thousand m³/day in urban waste`, 'and no jobs in treatment']),
        }] : []),
      ],
    }),
    numeros: () => [
      [nf(trat.length), [L('municípios com vínculos em', 'municipalities with jobs in'), L('tratamento e disposição', 'treatment and disposal')]],
      [grande(T.res_tratamento), [L('vínculos nessas atividades;', 'jobs in these activities;'), L(`${mil(T.res_coleta)} na coleta`, `${mil(T.res_coleta)} in collection`)]],
      [pct((100 * urbSem) / urbT, 0), [L('do biometano urbano fica', 'of urban biomethane lies'), L('em municípios sem nenhum', 'in municipalities with none')]],
      [grande(urbT), [L('m³/dia de biometano no lixo,', 'm³/day of biomethane in rubbish,'), L('no lodo e na poda (CP2B)', 'sludge and prunings (CP2B)')]],
    ],
    painel: (y) => {
      const s = [];
      const rot = L(['até 500', '500 a 1.500', '1.500 a 4.000', '4.000 a 10.000', 'mais de 10.000'], ['up to 500', '500 to 1,500', '1,500 to 4,000', '4,000 to 10,000', 'over 10,000']);
      const lg = legendaCategorias(CORES_U.map((k, i) => [k, rot[i]]), y, { titulo: L('BIOMETANO URBANO (M³/DIA)', 'URBAN BIOMETHANE (M³/DAY)'), passo: 23 });
      s.push(lg.svg);
      let yy = lg.y + 4;
      s.push(rotuloPainel(L('VÍNCULOS EM TRATAMENTO (ÁREA)', 'JOBS IN TREATMENT (AREA)'), yy));
      let x = 20;
      for (const v of [50, 300, 1500]) {
        const r = raio(v);
        s.push(`<circle cx="${f1(x + r)}" cy="${f1(yy + 14 + 2 * rMax - r)}" r="${f1(r)}" fill="#8a4a2a" fill-opacity=".85" stroke="#ffffff"/>`);
        s.push(`<text x="${f1(x + r)}" y="${f1(yy + 30 + 2 * rMax)}" text-anchor="middle" font-family="${MONO}" font-size="12">${nf(v)}</text>`);
        x += 2 * r + 46;
      }
      yy += 2 * rMax + 50;
      s.push(rotuloPainel(L('VÍNCULOS EM RESÍDUOS E ESGOTO POR 10 MIL HABITANTES', 'WASTE AND SEWAGE JOBS PER 10,000 PEOPLE'), yy));
      const b = barras(reg.slice(0, 11).map((r) => [r.NM_RGINT, r.res_10mil, '#7a9c8f', nf(r.res_10mil, 1)]), yy + 14, { max: reg[0].res_10mil * 1.25, x0: 210, passo: 16 });
      s.push(b.svg);
      const n = nota(L('A RAIS põe o vínculo no endereço da empresa: um aterro regional aparece num só município, e uma concessionária, na sua sede.',
        'RAIS places each job at the company’s address: a regional landfill shows in one municipality, a concession at its head office.'), b.y + 10, { tamanho: 14 });
      s.push(n.svg);
      return { svg: s.join('\n'), y: n.y };
    },
    // Figura: as classes e a escala dos círculos, sem as barras por região nem a nota.
    legendaFigura: () => {
      const rot = L(['até 500', '500 a 1.500', '1.500 a 4.000', '4.000 a 10.000', 'mais de 10.000'], ['up to 500', '500 to 1,500', '1,500 to 4,000', '4,000 to 10,000', 'over 10,000']);
      const lg = legendaCategorias(CORES_U.map((k, i) => [k, rot[i]]), 0, { titulo: L('BIOMETANO URBANO (M³/DIA)', 'URBAN BIOMETHANE (M³/DAY)'), passo: 23 });
      const s = [lg.svg];
      const yy = lg.y + 4;
      s.push(rotuloPainel(L('VÍNCULOS EM TRATAMENTO (ÁREA)', 'JOBS IN TREATMENT (AREA)'), yy));
      let x = 20;
      for (const v of [50, 300, 1500]) {
        const r = raio(v);
        s.push(`<circle cx="${f1(x + r)}" cy="${f1(yy + 14 + 2 * rMax - r)}" r="${f1(r)}" fill="#8a4a2a" fill-opacity=".85" stroke="#ffffff"/>`);
        s.push(`<text x="${f1(x + r)}" y="${f1(yy + 30 + 2 * rMax)}" text-anchor="middle" font-family="${MONO}" font-size="12">${nf(v)}</text>`);
        x += 2 * r + 46;
      }
      return { svg: s.join('\n'), altura: yy + 34 + 2 * rMax, largura: 420 };
    },
    fontes: () => [
      L('MTE, RAIS 2025: estabelecimentos (PDET)', 'MTE, RAIS 2025: establishments (PDET)'),
      L('CP2B (Unicamp), potencial de biometano, v5.1', 'CP2B (Unicamp), biomethane potential, v5.1'),
      L('IBGE, Censo 2022; Malha Municipal 2025', 'IBGE, 2022 Census; Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { emprego, perfil, geradores, encontro, residuos };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/bioeconomia-sp/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
const e = SERIE.find((s) => s.tema === nome);
const fazer = TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => fazer() });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `bioeconomia-sp-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
