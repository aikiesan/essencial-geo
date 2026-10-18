#!/usr/bin/env node
/**
 * Coleção «Favelas e comunidades urbanas» (favelas-sp) — prepara os dados das pranchas 067 a 070 (uso interno).
 *
 *   node --max-old-space-size=8192 scripts/colecoes/favelas-sp/preparar.mjs [fcu|entorno|dentro|gpkg ...]
 *
 * Censo 2022: agregados por setor (dados-brutos/ibge/sp: basico, domicilio1, domicilio2, renda), em que
 * cada setor está dentro ou fora de uma Favela e Comunidade Urbana (CD_FCU); e a Pesquisa Urbanística do
 * Entorno dos Domicílios nas FCU, no SIDRA (dados-brutos/ibge/sidra-sp): 10340 (moradores, por município)
 * e 10339 (moradores, Brasil e UF).
 *
 * Sigilo: nas variáveis de domicílio, o IBGE troca por "X" as contagens pequenas do setor; nos dados de SP
 * um X vale 1 ou 2 (não aparece nenhum 1 nem 2 publicado). Nas somas, o X entra como intervalo (1 a 2) e o
 * número só é dado quando os dois extremos arredondam para o mesmo valor. O X nunca vira zero.
 */
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, copyFileSync } from 'node:fs';
import { RAIZ, BRUTOS, linhasXlsx, gravarCache, gravarGpkg, gravarCsv, zipar, tamanho, mb } from '../lib/dados.mjs';
import { lerInfo, lerGeo, tabelaCenso, basico } from '../lib/setores-sp.mjs';
import { NOME_MUN, malhaMunicipios, camadasReferencia, baseJanela } from '../lib/cruzamentos.mjs';
import { estiloGraduado, estiloRegras, preenchimento } from '../lib/estilos-qgis.mjs';

const MAPAS = join(RAIZ, 'mapas');
const PASTA = { fcu: '067-favelas-sp', metropole: '068-favelas-na-metropole-sp', entorno: '069-entorno-das-favelas-sp', dentro: '070-dentro-e-fora-das-favelas-sp' };
const SIDRA = join(BRUTOS, 'ibge', 'sidra-sp');
const r1 = (v) => Math.round(v * 10) / 10;
const arred = (c) => (typeof c === 'number' ? Math.round(c * 1e5) / 1e5 : c.map(arred));
const semAcento = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const CD_POR_NOME = new Map([...NOME_MUN].map(([cd, n]) => [semAcento(n), cd]));

export const LIM_FCU = [2, 5, 10, 15, 20];
export const CORES_FCU = ['#f4ece3', '#e9d2bd', '#d8ad8a', '#bf8159', '#97573a', '#62351f'];
export const LIM_ENT = [10, 20, 35, 50, 70];
export const CORES_ENT = ['#f3eee6', '#e4d6c1', '#cdb08f', '#a9845f', '#7c5a3c', '#4d3522'];

const D1 = ['V00001', 'V00049', 'V00070', 'V00071'];
const COR = { branca: ['V00090', 'V00095', 'V00100'], preta: ['V00091', 'V00096', 'V00101'], amarela: ['V00092', 'V00097', 'V00102'], parda: ['V00093', 'V00098', 'V00103'], indigena: ['V00094', 'V00099', 'V00104'] };
const D2 = ['V00111', 'V00309', 'V00310', 'V00397', 'V00398', 'V00238', ...Object.values(COR).flat()];

/* ------------------------------------------------------------------ setores */
async function setores() {
  const b = await basico();
  const d1 = await tabelaCenso('domicilio1', D1);
  const d2 = await tabelaCenso('domicilio2', D2);
  const r = await tabelaCenso('renda', ['V06001', 'V06004']);
  const out = new Map();
  for (const [cd, bb] of b) out.set(cd, { cd, b: bb, d1: d1.get(cd) ?? null, d2: d2.get(cd) ?? null, r: r.get(cd) ?? null });
  return out;
}

/** Soma de variáveis num conjunto de setores, com X entre 1 e 2: [mín, máx]. */
function somar(lista, tab, vs) {
  let lo = 0, hi = 0;
  for (const s of lista) {
    const o = s[tab];
    if (!o) continue;
    for (const v of vs) { const x = o[v]; if (x === null || x === undefined) { lo += 1; hi += 2; } else { lo += x; hi += x; } }
  }
  return [lo, hi];
}
/** Parte (%) de um numerador-intervalo sobre um denominador-intervalo: o meio do intervalo (uma casa) se os extremos arredondam igual em `casas`; senão, o intervalo. */
function parte(num, den, casas = 0) {
  const a = (100 * num[0]) / den[1], z = (100 * num[1]) / den[0];
  const f = 10 ** casas;
  return Math.round(a * f) === Math.round(z * f) ? r1((a + z) / 2) : { de: a, ate: z };
}

/* ------------------------------------------------------------------ 067 e 068 onde estão */
async function fcu(S) {
  const info = lerInfo();
  const geo = lerGeo();
  const porMun = new Map(), porFcu = new Map();
  let pes = 0, tot = 0, dpo = 0, n = 0;
  for (const s of S.values()) {
    const m = s.b.CD_MUN;
    if (!porMun.has(m)) porMun.set(m, { CD_MUN: m, NM_MUN: NOME_MUN.get(m), pessoas: 0, pessoas_fcu: 0, setores_fcu: 0, fcus: new Set() });
    const pm = porMun.get(m);
    pm.pessoas += s.b.pessoas ?? 0;
    tot += s.b.pessoas ?? 0;
    if (!s.b.CD_FCU) continue;
    n++; pes += s.b.pessoas ?? 0; dpo += s.b.dpo ?? 0;
    pm.pessoas_fcu += s.b.pessoas ?? 0; pm.setores_fcu++; pm.fcus.add(s.b.CD_FCU);
    if (!porFcu.has(s.b.CD_FCU)) porFcu.set(s.b.CD_FCU, { CD_FCU: s.b.CD_FCU, NM_FCU: s.b.NM_FCU, CD_MUN: m, NM_MUN: NOME_MUN.get(m), pessoas: 0, setores: 0, pts: [] });
    const f = porFcu.get(s.b.CD_FCU);
    f.pessoas += s.b.pessoas ?? 0; f.setores++;
    if (info[s.cd]?.pt) f.pts.push([info[s.cd].pt, s.b.pessoas ?? 0]);
  }
  const mun = [...porMun.values()].map((m) => ({ CD_MUN: m.CD_MUN, NM_MUN: m.NM_MUN, pessoas: m.pessoas, pessoas_fcu: m.pessoas_fcu, setores_fcu: m.setores_fcu, n_fcu: m.fcus.size, pct_fcu: m.pessoas ? r1((100 * m.pessoas_fcu) / m.pessoas) : 0 }));
  const com = mun.filter((m) => m.pessoas_fcu > 0);
  // Centro de cada FCU: média dos pontos internos dos setores, ponderada pela população.
  const fcus = [...porFcu.values()].map((f) => {
    const w = f.pts.reduce((a, [, p]) => a + Math.max(p, 1), 0);
    const pt = [0, 1].map((k) => f.pts.reduce((a, [q, p]) => a + q[k] * Math.max(p, 1), 0) / w);
    return { CD_FCU: f.CD_FCU, NM_FCU: f.NM_FCU, CD_MUN: f.CD_MUN, NM_MUN: f.NM_MUN, pessoas: f.pessoas, setores: f.setores, pt: arred(pt) };
  }).sort((a, z) => z.pessoas - a.pessoas);
  // Setores de FCU (geometria simplificada) para a prancha da metrópole e o GPKG.
  const feats = [...S.values()].filter((s) => s.b.CD_FCU && geo[s.cd]).map((s) => ({ type: 'Feature', properties: { CD_SETOR: s.cd, CD_FCU: s.b.CD_FCU, NM_FCU: s.b.NM_FCU, CD_MUN: s.b.CD_MUN, NM_MUN: s.b.NM_MUN, pessoas: s.b.pessoas ?? 0, dppo: s.b.dpo ?? 0 }, geometry: geo[s.cd] }));
  const porTam = [[0, 1000], [1000, 5000], [5000, 10000], [10000, Infinity]].map(([a, z]) => { const l = fcus.filter((f) => f.pessoas >= a && f.pessoas < z); return { de: a, ate: z, n: l.length, pessoas: l.reduce((x, f) => x + f.pessoas, 0) }; });
  const c = {
    lim: LIM_FCU, cores: CORES_FCU, setores: n, pessoas: pes, dpo, tot, pct: (100 * pes) / tot, n_fcu: fcus.length, n_mun: com.length,
    mun, mun_pct: [...com].sort((a, z) => z.pct_fcu - a.pct_fcu).slice(0, 8), mun_abs: [...com].sort((a, z) => z.pessoas_fcu - a.pessoas_fcu).slice(0, 8),
    fcus_top: fcus.slice(0, 12), todas: fcus, por_tamanho: porTam,
    capital: com.find((m) => m.CD_MUN === '3550308'),
  };
  // Janela da metrópole (068): os municípios das concentrações de São Paulo e de Santos com 20 mil ou mais em favelas.
  const conc = new Set([...S.values()].filter((s) => ['3550308', '3548500'].includes(s.b.CD_CONCURB)).map((s) => s.b.CD_MUN));
  const cds = com.filter((m) => conc.has(m.CD_MUN) && m.pessoas_fcu >= 20000).map((m) => m.CD_MUN);
  baseJanela('favelas-sp-metropole', 'SP', cds, { oceano: [-46.25, -24.08], passo: 0.25, folga: 0.04 });
  console.log(' janela', cds.map((cd) => NOME_MUN.get(cd)).join(', '));
  gravarCache('favelas-sp-fcu', c);
  gravarCache('favelas-sp-setores-fcu', { feats: feats.map((f) => ({ ...f, geometry: { type: f.geometry.type, coordinates: JSON.parse(JSON.stringify(f.geometry.coordinates), (k, v) => (typeof v === 'number' ? Math.round(v * 1e4) / 1e4 : v)) } })) });
  console.log('fcu', { setores: n, pes, dpo, tot, pct: c.pct, n_fcu: c.n_fcu, n_mun: c.n_mun, porTam });
  console.log(' pct', c.mun_pct.map((m) => `${m.NM_MUN} ${m.pct_fcu}`).join(', '));
  console.log(' abs', c.mun_abs.map((m) => `${m.NM_MUN} ${m.pessoas_fcu}`).join(', '));
  console.log(' fcus', c.fcus_top.slice(0, 8).map((f) => `${f.NM_FCU} (${f.NM_MUN}) ${f.pessoas}`).join(' | '));
  return { c, feats };
}

/* ------------------------------------------------------------------ 069 entorno (Pesquisa Urbanística do Entorno) */
// Colunas do bloco Total das tabelas 10339 e 10340 (a 1ª coluna é o nome).
const ENT = {
  total: 1, moto: 4, nd_via: 6,
  pav: [7, 8, 9], bueiro: [10, 11, 12], luz: [13, 14, 15], onibus: [16, 17, 18], ciclo: [19, 20, 21],
  calcada: [22, 23, 24], rampa: [28, 29, 30], arvores: [32, 31, 36],
};
function entornoLinha(v) {
  const num = (i) => (v[i] === '-' ? 0 : Number(v[i]));
  const o = { moradores: num(ENT.total) };
  o.so_moto = r1((100 * num(ENT.moto)) / (num(ENT.total) - num(ENT.nd_via)));
  for (const k of ['pav', 'bueiro', 'luz', 'onibus', 'ciclo', 'calcada', 'rampa', 'arvores']) {
    const [sim, nao, nd] = ENT[k].map(num);
    const base = num(ENT.total) - nd;
    o[`sem_${k}`] = base > 0 ? r1((100 * nao) / base) : null;
  }
  return o;
}
async function entorno() {
  const mun = new Map();
  let uf = null;
  for await (const l of linhasXlsx(join(SIDRA, 'tabela10340_UF_35_MUN.xlsx'))) {
    const nome = String(l[0] ?? '').trim();
    if (nome === 'São Paulo' && /^\d+$/.test(l[1])) { uf = entornoLinha(l); continue; }
    const m = nome.match(/^(.*) \(SP\)$/);
    if (!m) continue;
    const cd = CD_POR_NOME.get(semAcento(m[1]));
    if (!cd) throw new Error(`município sem código: ${nome}`);
    mun.set(cd, { CD_MUN: cd, NM_MUN: NOME_MUN.get(cd), ...entornoLinha(l) });
  }
  const br = {};
  for await (const l of linhasXlsx(join(SIDRA, 'tabela10339_BR_GR_UF.xlsx'))) {
    const nome = String(l[0] ?? '').trim();
    if (['Brasil', 'São Paulo', 'Rio de Janeiro'].includes(nome) && /^\d+$/.test(l[1])) br[nome] = entornoLinha(l);
  }
  const linhas = [...mun.values()];
  const grandes = linhas.filter((l) => l.moradores >= 10000);
  const ord = (k) => [...grandes].sort((a, z) => z[k] - a[k]);
  const c = { uf, br, linhas, n_mun: linhas.length, grandes: grandes.length, sem_pav: ord('sem_pav').slice(0, 6), sem_luz: ord('sem_luz').slice(0, 6), sem_calcada: ord('sem_calcada').slice(0, 6), lim: LIM_ENT, cores: CORES_ENT };
  gravarCache('favelas-sp-entorno', c);
  console.log('entorno uf', uf);
  console.log(' br', br);
  console.log(' sem pav', c.sem_pav.map((l) => `${l.NM_MUN} ${l.sem_pav} (${l.moradores})`).join(', '));
  console.log(' sem luz', c.sem_luz.map((l) => `${l.NM_MUN} ${l.sem_luz}`).join(', '));
  console.log(' sem calçada', c.sem_calcada.map((l) => `${l.NM_MUN} ${l.sem_calcada}`).join(', '));
  return c;
}

/* ------------------------------------------------------------------ 070 dentro e fora */
function indicadores(lista) {
  const dppo = somar(lista, 'd1', ['V00001']);
  const mor = somar(lista, 'd1', ['V00070']);
  const cri = somar(lista, 'd1', ['V00071']);
  const ap = somar(lista, 'd1', ['V00049']);
  const agua = somar(lista, 'd2', ['V00111']);
  const esg = somar(lista, 'd2', ['V00309', 'V00310']);
  const lixo = somar(lista, 'd2', ['V00397', 'V00398']);
  const corTot = somar(lista, 'd2', Object.values(COR).flat());
  const pp = somar(lista, 'd2', [...COR.preta, ...COR.parda]);
  // Renda média dos responsáveis com rendimento: média dos setores com valor, ponderada pelos responsáveis.
  let rs = 0, rn = 0, rx = 0;
  for (const s of lista) { const o = s.r; if (!o) continue; if (o.V06004 === null || o.V06001 === null) { rx++; continue; } rs += o.V06004 * o.V06001; rn += o.V06001; }
  return {
    dppo: dppo[0], moradores_dom: Math.round((100 * mor[0]) / dppo[0]) / 100,
    pct_criancas: parte(cri, mor), pct_apartamento: parte(ap, dppo), pct_agua_rede: parte(agua, dppo), pct_esgoto_rede: parte(esg, dppo),
    pct_lixo_coletado: parte(lixo, dppo), pct_resp_pretos_pardos: parte(pp, corTot),
    renda_media: rn ? Math.round(rs / rn) : null, setores_renda_sigilo: rx,
  };
}
async function dentro(S) {
  const todos = [...S.values()].filter((s) => s.d1 && s.b.dpo > 0);
  const den = todos.filter((s) => s.b.CD_FCU), fora = todos.filter((s) => !s.b.CD_FCU);
  // Só os municípios com favela: a comparação justa é dentro e fora na mesma cidade.
  const munFcu = new Set(den.map((s) => s.b.CD_MUN));
  const foraMesmos = fora.filter((s) => munFcu.has(s.b.CD_MUN));
  const c = { dentro: indicadores(den), fora: indicadores(foraMesmos), fora_estado: indicadores(fora) };
  // Por município (com ao menos 5 mil moradores em FCU): renda média dentro sobre fora.
  const porMun = new Map();
  for (const s of todos) { if (!munFcu.has(s.b.CD_MUN)) continue; if (!porMun.has(s.b.CD_MUN)) porMun.set(s.b.CD_MUN, { d: [], f: [] }); porMun.get(s.b.CD_MUN)[s.b.CD_FCU ? 'd' : 'f'].push(s); }
  c.mun = [...porMun].map(([cd, { d, f }]) => {
    const a = indicadores(d), b = indicadores(f);
    const pes = d.reduce((x, s) => x + (s.b.pessoas ?? 0), 0);
    return { CD_MUN: cd, NM_MUN: NOME_MUN.get(cd), pessoas_fcu: pes, renda_dentro: a.renda_media, renda_fora: b.renda_media, razao_renda: a.renda_media && b.renda_media ? Math.round((100 * a.renda_media) / b.renda_media) / 100 : null, esgoto_dentro: typeof a.pct_esgoto_rede === 'number' ? a.pct_esgoto_rede : null, esgoto_fora: typeof b.pct_esgoto_rede === 'number' ? b.pct_esgoto_rede : null };
  });
  const g = c.mun.filter((m) => m.pessoas_fcu >= 5000 && m.razao_renda);
  c.razao_min = [...g].sort((a, z) => a.razao_renda - z.razao_renda).slice(0, 6);
  c.razao_max = [...g].sort((a, z) => z.razao_renda - a.razao_renda).slice(0, 4);
  gravarCache('favelas-sp-dentro', c);
  console.log('dentro', c.dentro);
  console.log('fora (mesmos municípios)', c.fora);
  console.log('fora (estado)', c.fora_estado);
  console.log(' razão renda (min)', c.razao_min.map((m) => `${m.NM_MUN} ${m.razao_renda} (${m.renda_dentro}/${m.renda_fora})`).join(', '));
  console.log(' razão renda (max)', c.razao_max.map((m) => `${m.NM_MUN} ${m.razao_renda}`).join(', '), '| n', g.length);
  return c;
}

/* ------------------------------------------------------------------ GeoPackages */
async function gpkg(F, E, D) {
  const ref = camadasReferencia();
  // Setores de FCU, com a geometria simplificada.
  const geo = lerGeo();
  const pasta = join(MAPAS, PASTA.fcu, 'dados');
  mkdirSync(pasta, { recursive: true });
  const setores = F.feats.map((f) => ({ ...f, geometry: geo[f.properties.CD_SETOR] }));
  const porEnt = new Map(E.linhas.map((l) => [l.CD_MUN, l]));
  const porDen = new Map(D.mun.map((m) => [m.CD_MUN, m]));
  const linhas = F.c.mun.map((m) => {
    const e = porEnt.get(m.CD_MUN) ?? {}, d = porDen.get(m.CD_MUN) ?? {};
    return {
      ...m,
      moradores_entorno: e.moradores ?? null, sem_pavimentacao: e.sem_pav ?? null, sem_bueiro: e.sem_bueiro ?? null, sem_iluminacao: e.sem_luz ?? null,
      sem_calcada: e.sem_calcada ?? null, sem_arvores: e.sem_arvores ?? null, via_so_moto_pedestre: e.so_moto ?? null,
      renda_media_dentro: d.renda_dentro ?? null, renda_media_fora: d.renda_fora ?? null, razao_renda: d.razao_renda ?? null,
    };
  });
  const malha = malhaMunicipios();
  const por = new Map(linhas.map((l) => [l.CD_MUN, l]));
  const mun = malha.map((f) => ({ type: 'Feature', properties: por.get(String(f.properties.CD_MUN)), geometry: f.geometry }));
  const estilos = {
    setores_fcu: [['setores_fcu', 'Nº 068 · Setores em Favelas e Comunidades Urbanas', estiloRegras('poligono', [['"pessoas" >= 0', 'setor em FCU', preenchimento('#97573a', '#ffffff', 0.05)]]), true]],
    municipios: [
      ['pct_fcu', 'Nº 067 · Pessoas em Favelas e Comunidades Urbanas (%)', estiloGraduado('pct_fcu', [...LIM_FCU, 100], CORES_FCU, { casas: 0, sufixo: ' %' }), true],
      ['sem_pavimentacao', 'Nº 069 · Moradores de FCU em via sem pavimentação (%)', estiloGraduado('sem_pavimentacao', [...LIM_ENT, 100], CORES_ENT, { casas: 0, sufixo: ' %' }), false],
      ['sem_iluminacao', 'Nº 069 · Moradores de FCU sem iluminação pública na face (%)', estiloGraduado('sem_iluminacao', [...LIM_ENT, 100], CORES_ENT, { casas: 0, sufixo: ' %' }), false],
      ['sem_calcada', 'Nº 069 · Moradores de FCU sem calçada na face (%)', estiloGraduado('sem_calcada', [...LIM_ENT, 100], CORES_ENT, { casas: 0, sufixo: ' %' }), false],
    ],
    ...ref.estilos,
  };
  const arq = join(pasta, 'sp_favelas_2022.gpkg');
  await gravarGpkg(arq, {
    setores_fcu: { feats: setores, campos: Object.keys(setores[0].properties) },
    municipios: { feats: mun, campos: Object.keys(linhas[0]) },
    ...ref.camadas,
  }, estilos);
  const z = zipar(arq);
  const csv = join(pasta, 'sp_favelas_municipios_2022.csv');
  gravarCsv(csv, linhas);
  for (const p of [PASTA.entorno, PASTA.dentro]) { mkdirSync(join(MAPAS, p, 'dados'), { recursive: true }); copyFileSync(csv, join(MAPAS, p, 'dados', 'sp_favelas_municipios_2022.csv')); }
  const csvF = join(MAPAS, PASTA.metropole, 'dados');
  mkdirSync(csvF, { recursive: true });
  const fc = join(csvF, 'sp_favelas_lista_2022.csv');
  gravarCsv(fc, F.c.todas.map(({ pt, ...r }) => ({ ...r, lon: pt[0], lat: pt[1] })));
  console.log(`✓ ${z} · ${mb(tamanho(z))} · CSV ${mb(tamanho(csv))} · lista ${mb(tamanho(fc))}`);
}

/* ------------------------------------------------------------------ */
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const pedidos = process.argv.slice(2);
  const quer = (k) => !pedidos.length || pedidos.includes(k);
  const S = quer('fcu') || quer('dentro') || quer('gpkg') ? await setores() : null;
  const F = quer('fcu') || quer('gpkg') ? await fcu(S) : null;
  const E = quer('entorno') || quer('gpkg') ? await entorno() : null;
  const D = quer('dentro') || quer('gpkg') ? await dentro(S) : null;
  if (quer('gpkg')) await gpkg(F, E, D);
}
