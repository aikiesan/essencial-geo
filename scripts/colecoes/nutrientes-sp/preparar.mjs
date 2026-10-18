#!/usr/bin/env node
/**
 * Coleção «Dejetos que adubam» (nutrientes-sp) — prepara os dados das pranchas 081 a 084 (uso interno).
 *
 *   node scripts/colecoes/nutrientes-sp/preparar.mjs
 *
 * Um balanço de nutrientes à moda do Gross Nutrient Balance (Eurostat/OECD), por município, com os
 * números que existem no Brasil:
 *   rebanhos   IBGE, PPM 2024: tabela 3939 (efetivo, cópia local do CP2B) e tabela 94 (vacas ordenhadas,
 *              API do SIDRA, em dados-brutos/ibge/sidra-sp/tabela94_MUN_35_2024.json);
 *   lavouras   IBGE, PAM 2024: tabelas 1612 e 1613, quantidade produzida (v214) e área colhida (v216),
 *              API do SIDRA (dados-brutos/ibge/sidra-sp/tabela161x_v21x_MUN_35_2024.json);
 *   área agropecuária  MapBiomas Coleção 10 (2024), já somado por município na prancha 045 (agro-sp);
 *   biogás     CP2B v5.1 (Unicamp), cenário de referência, nível N4, só os substratos da pecuária.
 *
 * Coeficientes (todos são estimativas; ver o README de cada prancha):
 *   N excretado      IPCC 2019 Refinement, vol. 4, cap. 10: Nrate da tabela 10.19 × massa típica da
 *                    tabela 10A.5, América Latina, média (Tier 1);
 *   P2O5 e K2O       razões P2O5/N e K2O/N do esterco como excretado, MWPS-18 seção 1 (2004), tabela 6
 *                    (valores da ASAE D384), aplicadas ao N do IPCC;
 *   exportação       N, P e K no produto colhido (kg/t), calculadora de Balanço de Nutrientes do
 *                    IPNI Brasil/NPCT (base de Cunha et al., Informações Agronômicas 130 e 145).
 */
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { RAIZ, linhasXlsx, lerCsv, gravarCache, gravarGpkg, gravarCsv, zipar, tamanho, mb, kb } from '../lib/dados.mjs';
import { NOME_MUN, DADOS_CP2B, malhaMunicipios, camadasReferencia, sidraMun } from '../lib/cruzamentos.mjs';
import { estiloGraduado } from '../lib/estilos-qgis.mjs';

const SERIE = JSON.parse(readFileSync(join(RAIZ, 'scripts', 'colecoes', 'nutrientes-sp', 'serie.json'), 'utf8'));
const PASTA = Object.fromEntries(SERIE.map((s) => [s.tema, s.pasta]));
const ANO = 2024;
const r1 = (v) => Math.round(v * 10) / 10;
const r0 = (v) => Math.round(v);

/* ------------------------------------------------------------------ coeficientes */
// [Nrate kg N/(1000 kg·dia), massa típica kg] — IPCC 2019, tabelas 10.19 e 10A.5, América Latina (média).
// Ovinos, caprinos e equinos: o valor único das demais regiões (a América Latina entra nele).
const IPCC = {
  vacas: [0.39, 508], // Dairy cattle
  bovinos: [0.31, 303], // Other cattle
  bubalinos: [0.41, 315], // Buffalo
  equinos: [0.46, 238], // Horses
  matrizes: [0.35, 143], // Swine, breeding
  suinos: [0.73, 51], // Swine, finishing
  galinhas: [1.17, 1.4], // Hens >= 1 yr
  frangos: [1.23, 0.9], // Broilers
  ovinos: [0.32, 31], // Sheep
  caprinos: [0.34, 24], // Goats
};
// Bovinos confinados (CP2B BOV_CONFINADO): Other cattle, sistema de alta produtividade (0,36 × 329 kg).
const IPCC_CONFINADO = [0.36, 329];
// P2O5/N e K2O/N do esterco como excretado (MWPS-18, tabela 6, por cabeça e dia).
const RAZAO = {
  vacas: [0.37 / 0.72, 0.40 / 0.72], // vaca em lactação, 1.000 lb
  bovinos: [0.18 / 0.35, 0.29 / 0.35], // vaca de corte (confinamento), 1.000 lb
  confinado: [0.12 / 0.40, 0.25 / 0.40], // bovino em terminação, 1.100 lb
  bubalinos: [0.18 / 0.35, 0.29 / 0.35],
  equinos: [0.06 / 0.18, 0.06 / 0.18], // cavalo sedentário
  matrizes: [0.04 / 0.06, 0.05 / 0.06], // porca em gestação, 400 lb
  suinos: [0.05 / 0.13, 0.06 / 0.13], // suíno em terminação, 220 lb
  galinhas: [0.0008 / 0.0026, 0.0012 / 0.0026], // poedeira
  frangos: [0.0014 / 0.0021, 0.0010 / 0.0021], // frango de corte
  ovinos: [0.02 / 0.04, 0.04 / 0.04], // cordeiro
  caprinos: [0.02 / 0.04, 0.04 / 0.04],
};
const porCabeca = ([nrate, massa]) => (nrate * massa * 365) / 1000;
/** kg por cabeça e ano: { n, p (P2O5), k (K2O) }. */
export const COEF = Object.fromEntries(Object.entries(IPCC).map(([k, v]) => {
  const n = porCabeca(v);
  return [k, { n, p: n * RAZAO[k][0], k: n * RAZAO[k][1] }];
}));
COEF.confinado = (() => { const n = porCabeca(IPCC_CONFINADO); return { n, p: n * RAZAO.confinado[0], k: n * RAZAO.confinado[1] }; })();

/** Criação confinada: o esterco é recolhido no galpão, no chiqueiro ou na sala de ordenha. */
export const CONFINADOS = ['galinhas', 'frangos', 'suinos', 'matrizes', 'vacas'];
/** Grupos para as pranchas: [chave, categorias, cor, pt, en]. */
export const GRUPOS = [
  ['bovinos', ['bovinos', 'bubalinos'], '#7c5a3c', 'bovinos de corte e búfalos', 'beef cattle and buffalo'],
  ['leite', ['vacas'], '#a9845f', 'vacas ordenhadas', 'milked cows'],
  ['aves', ['galinhas', 'frangos'], '#c9879a', 'galinhas e frangos', 'hens and broilers'],
  ['suinos', ['suinos', 'matrizes'], '#8e5b6e', 'suínos', 'pigs'],
  ['outros', ['equinos', 'ovinos', 'caprinos'], '#b7b09c', 'cavalos, ovelhas e cabras', 'horses, sheep and goats'],
];

// N, P e K no produto colhido (g/kg = kg/t), IPNI Brasil/NPCT, P e K na forma de elemento.
const EXPORTA = {
  'Cana-de-açúcar': [0.83, 0.11, 0.78],
  'Soja (em grão)': [59.2, 5.5, 18.8],
  'Milho (em grão)': [13.5, 2.1, 3.1],
  'Sorgo (em grão)': [15.0, 7.5, 3.93],
  'Feijão (em grão)': [34.9, 4.0, 15.4],
  'Arroz (em casca)': [12.5, 2.24, 4.42],
  'Algodão herbáceo (em caroço)': [33.9, 5.4, 18.3],
  'Amendoim (em casca)': [34.0, 2.0, 9.0],
  'Trigo (em grão)': [20.1, 3.2, 3.5],
  'Batata-inglesa': [3.6, 0.22, 3.3],
  'Tomate': [2.4, 0.36, 2.46],
  'Mandioca': [2.1, 0.21, 1.95],
  'Fumo (em folha)': [39.0, 6.7, 45.0],
  'Mamona (baga)': [29.0, 3.7, 7.2],
  'Laranja': [1.9, 0.173, 1.51],
  'Tangerina': [1.9, 0.173, 1.51], // coeficiente da laranja
  'Limão': [1.9, 0.173, 1.51], // coeficiente da laranja
  'Café (em grão) Total': [17.1, 1.0, 15.5],
  'Banana (cacho)': [1.9, 0.265, 8.22],
};
const P2O5 = 2.2914, K2O = 1.2046;

/** Limite de referência da Diretiva Nitratos (91/676/CEE): 170 kg de N de estrume por hectare e ano. */
export const DIRETIVA = 170;

/* ------------------------------------------------------------------ rebanhos (PPM) */
const PPM_COL = { Bovino: 'bovino_total', Bubalino: 'bubalinos', Equino: 'equinos', 'Suíno - total': 'suino_total', 'Suíno - matrizes de suínos': 'matrizes', Caprino: 'caprinos', Ovino: 'ovinos', 'Galináceos - total': 'galinaceos', 'Galináceos - galinhas': 'galinhas', Codornas: 'codornas' };
const sidraValor = (v) => (v === '-' ? 0 : /^-?\d+(\.\d+)?$/.test(String(v).trim()) ? Number(v) : null);
/** sidraMun lê "..." (não disponível) como NaN: aqui vira null. */
function sidra(arquivo, col = 'D4N') {
  const m = sidraMun(arquivo, col);
  for (const o of m.values()) for (const k of Object.keys(o)) if (!Number.isFinite(o[k])) o[k] = null;
  return m;
}

async function rebanhos() {
  const arq = join(DADOS_CP2B, 'raw', 'ibge_ppm', 'TABELA_3939_PPM_2008A2024.xlsx');
  let anos = null, prods = null;
  const out = new Map();
  let i = 0;
  for await (const l of linhasXlsx(arq)) {
    if (i === 3) { let a = ''; anos = l.map((v) => (a = v || a)); }
    if (i === 4) { prods = l; while (anos.length < l.length) anos.push(anos.at(-1)); }
    i++;
    if (l[0] !== 'MU' || !String(l[1]).startsWith('35')) continue;
    const o = {};
    for (let j = 3; j < l.length; j++) if (Number(anos[j]) === ANO && PPM_COL[prods[j]]) o[PPM_COL[prods[j]]] = sidraValor(l[j]);
    out.set(String(l[1]), o);
  }
  const vacas = sidra('tabela94_MUN_35_2024.json', 'D2N');
  for (const [cd, o] of out) {
    o.vacas = vacas.get(cd)?.['Vacas ordenhadas'] ?? null;
    o.bovinos = o.bovino_total == null ? null : Math.max(0, o.bovino_total - (o.vacas ?? 0));
    o.suinos = o.suino_total == null ? null : Math.max(0, o.suino_total - (o.matrizes ?? 0));
    o.frangos = o.galinaceos == null ? null : Math.max(0, o.galinaceos - (o.galinhas ?? 0));
  }
  return out;
}

/* ------------------------------------------------------------------ lavouras (PAM) */
function lavouras() {
  const prod = new Map(), area = new Map();
  for (const t of ['1612', '1613']) {
    const q = sidra(`tabela${t}_v214_MUN_35_${ANO}.json`);
    const a = sidra(`tabela${t}_v216_MUN_35_${ANO}.json`);
    for (const [cd, o] of q) { if (!prod.has(cd)) prod.set(cd, {}); Object.assign(prod.get(cd), o); }
    for (const [cd, o] of a) {
      if (!area.has(cd)) area.set(cd, { total: 0, coberta: 0, cana: 0 });
      const z = area.get(cd);
      z.total += o.Total ?? 0;
      for (const [p, v] of Object.entries(o)) { if (p !== 'Total' && EXPORTA[p] && v) z.coberta += v; }
      z.cana += o['Cana-de-açúcar'] ?? 0;
    }
  }
  const exp = new Map();
  for (const [cd, o] of prod) {
    const e = { n: 0, p: 0, k: 0, cana_n: 0, cana_k: 0 };
    for (const [p, [n, pp, k]] of Object.entries(EXPORTA)) {
      const t = o[p];
      if (!t) continue;
      e.n += t * n; e.p += t * pp * P2O5; e.k += t * k * K2O;
      if (p === 'Cana-de-açúcar') { e.cana_n += t * n; e.cana_k += t * k * K2O; }
    }
    exp.set(cd, e);
  }
  return { area, exp, prod };
}

/* ------------------------------------------------------------------ área agropecuária (MapBiomas, prancha 045) */
async function areaAgro() {
  const l = await lerCsv(join(RAIZ, 'mapas', '045-tabuleiro-agricola-sp', 'dados', 'sp_uso_agropecuario_2024.csv'), { sep: ',' });
  const AGRO = ['cana', 'temporarias', 'citros', 'perenes', 'pastagem', 'mosaico'];
  return new Map(l.map((r) => [String(r.CD_MUN), { agro_ha: 100 * AGRO.reduce((a, k) => a + Number(r[`km2_${k}`]), 0), pastagem_ha: 100 * Number(r.km2_pastagem), area_ha: 100 * Number(r.area_km2) }]));
}

/* ------------------------------------------------------------------ digestato (CP2B N4, pecuária) */
// Substrato CP2B → categoria de coeficiente.
const SUBST = { AVES_CORTE: 'frangos', AVES_POSTURA: 'galinhas', SUINOS: 'suinos', BOV_LEITE: 'vacas', BOV_CONFINADO: 'confinado', BOV_PASTO_MISTO: 'bovinos' };
async function digestato() {
  const dir = join(DADOS_CP2B, 'raw', 'cp2b_potential', '2026');
  // Metano por cabeça e ano no método CP2B: g (t/cabeça·ano) × ST × SV × BMP (Nm³ CH4/t SV), valores de referência.
  const par = await lerCsv(join(dir, 'cp2b_parametros.csv'), { sep: ',' });
  const v = (cod, el) => Number(par.find((p) => p.codigo === cod && p.elemento === el)?.med);
  const ch4Cab = Object.fromEntries(Object.keys(SUBST).map((s) => [s, v(s, 'g') * v(s, 'ST') * v(s, 'SV') * v(s, 'BMP')]));
  for (const [s, x] of Object.entries(ch4Cab)) if (!(x > 0)) throw new Error(`parâmetro ausente: ${s}`);
  const linhas = await lerCsv(join(dir, 'cp2b_municipio_substrato_niveis.csv'), { sep: ',' });
  const out = new Map();
  let versao = null;
  for (const l of linhas) {
    if (l.scenario !== 'med' || !String(l.ibge_code).startsWith('35') || !SUBST[l.substrate]) continue;
    versao ??= l.method_version;
    const cd = String(l.ibge_code);
    if (!out.has(cd)) out.set(cd, { n: 0, p: 0, k: 0, ch4: 0, bm: 0, aves: 0, suinos: 0, bovinos: 0 });
    const o = out.get(cd);
    const ch4 = Number(l.n4_ch4_nm3_year);
    if (!ch4) continue;
    const c = COEF[SUBST[l.substrate]];
    const cab = ch4 / ch4Cab[l.substrate];
    o.n += cab * c.n; o.p += cab * c.p; o.k += cab * c.k; o.ch4 += ch4; o.bm += Number(l.n4_biomethane_eq_nm3_year);
    o[l.substrate.startsWith('AVES') ? 'aves' : l.substrate === 'SUINOS' ? 'suinos' : 'bovinos'] += cab * c.n;
  }
  out.versao = versao;
  return out;
}

/* ------------------------------------------------------------------ montagem */
const CATS = Object.keys(IPCC);
export const LIM_N = [10, 25, 50, 100, DIRETIVA];
export const CORES_N = ['#f2efe6', '#e2d8bf', '#c9b58c', '#a98c5c', '#7f6238', '#4a3418'];
export const LIM_P = [1, 3, 6, 12, 25];
export const CORES_P = ['#f4eef2', '#e3cfda', '#cba3b8', '#ab7393', '#844a6d', '#55283f'];
export const LIM_C = [5, 15, 30, 60, 100];
export const CORES_C = ['#eef2ee', '#d0ddd0', '#a7c1a9', '#76a07d', '#467a55', '#1f4f33'];

function somaCats(o, cats, k) { let s = 0; for (const c of cats) s += (o[c] ?? 0) * COEF[c][k]; return s; }

async function montar() {
  const R = await rebanhos();
  const { area, exp } = lavouras();
  const A = await areaAgro();
  const D = await digestato();
  const linhas = [];
  for (const [cd, nome] of NOME_MUN) {
    const r = R.get(cd) ?? {};
    // Vacas ordenhadas sem informação na PPM 94 ("..."): o rebanho bovino inteiro entra como bovino de corte.
    const sem = CATS.filter((c) => c !== 'vacas').some((c) => r[c] === null || r[c] === undefined);
    const a = A.get(cd) ?? { agro_ha: 0, pastagem_ha: 0, area_ha: 0 };
    const lav = area.get(cd) ?? { total: 0, coberta: 0, cana: 0 };
    const e = exp.get(cd) ?? { n: 0, p: 0, k: 0, cana_n: 0, cana_k: 0 };
    const d = D.get(cd) ?? { n: 0, p: 0, k: 0, ch4: 0, bm: 0, aves: 0, suinos: 0, bovinos: 0 };
    const n = somaCats(r, CATS, 'n');
    const conf = { n: somaCats(r, CONFINADOS, 'n'), p: somaCats(r, CONFINADOS, 'p'), k: somaCats(r, CONFINADOS, 'k') };
    const grupos = Object.fromEntries(GRUPOS.map(([g, cs]) => [g, somaCats(r, cs, 'n')]));
    const o = {
      CD_MUN: cd, NM_MUN: nome,
      bovinos: r.bovinos ?? null, vacas_ordenhadas: r.vacas ?? null, bubalinos: r.bubalinos ?? null, equinos: r.equinos ?? null,
      suinos: r.suino_total ?? null, matrizes: r.matrizes ?? null, galinhas: r.galinhas ?? null, frangos: r.frangos ?? null,
      ovinos: r.ovinos ?? null, caprinos: r.caprinos ?? null, codornas: r.codornas ?? null,
      area_agro_ha: r0(a.agro_ha), area_lavoura_ha: r0(lav.total),
      n_dejetos_t: r1(n / 1000),
      n_bovinos_t: r1(grupos.bovinos / 1000), n_leite_t: r1(grupos.leite / 1000), n_aves_t: r1(grupos.aves / 1000), n_suinos_t: r1(grupos.suinos / 1000), n_outros_t: r1(grupos.outros / 1000),
      n_kg_ha_agro: a.agro_ha > 0 ? r1(n / a.agro_ha) : null,
      n_conf_t: r1(conf.n / 1000), p2o5_conf_t: r1(conf.p / 1000), k2o_conf_t: r1(conf.k / 1000),
      p2o5_kg_ha_agro: a.agro_ha > 0 ? r1(conf.p / a.agro_ha) : null,
      n_exporta_t: r1(e.n / 1000), p2o5_exporta_t: r1(e.p / 1000), k2o_exporta_t: r1(e.k / 1000),
      cob_n_pct: e.n > 0 ? r1((100 * conf.n) / e.n) : null, cob_p2o5_pct: e.p > 0 ? r1((100 * conf.p) / e.p) : null, cob_k2o_pct: e.k > 0 ? r1((100 * conf.k) / e.k) : null,
      dig_n_t: r1(d.n / 1000), dig_p2o5_t: r1(d.p / 1000), dig_k2o_t: r1(d.k / 1000),
      dig_biometano_m3_dia: r0(d.bm / 365),
      dig_cob_n_pct: e.n > 0 ? r1((100 * d.n) / e.n) : null, dig_cob_p2o5_pct: e.p > 0 ? r1((100 * d.p) / e.p) : null, dig_cob_k2o_pct: e.k > 0 ? r1((100 * d.k) / e.k) : null,
      sem_info_ppm: sem ? 1 : 0,
    };
    // Sem PPM (municípios metropolitanos e do litoral que a pesquisa não cobre): sem informação, nunca zero.
    if (sem) for (const k of ['n_dejetos_t', 'n_bovinos_t', 'n_leite_t', 'n_aves_t', 'n_suinos_t', 'n_outros_t', 'n_kg_ha_agro', 'n_conf_t', 'p2o5_conf_t', 'k2o_conf_t', 'p2o5_kg_ha_agro', 'cob_n_pct', 'cob_p2o5_pct', 'cob_k2o_pct']) o[k] = null;
    o._ = { n, conf, e, d, a, lav, grupos };
    linhas.push(o);
  }
  return { linhas, versao: D.versao };
}

const soma = (ls, f) => ls.reduce((a, l) => a + f(l), 0);
/** Municípios com ao menos mil hectares de lavoura colhida: abaixo disso, a razão perde sentido. */
const LAV_MIN = 1000;
const comLavoura = (l) => l._.lav.total >= LAV_MIN;
const topo = (ls, f, n = 8) => [...ls].filter((l) => f(l) !== null && f(l) > 0).sort((a, z) => f(z) - f(a)).slice(0, n);
const enxuto = (l, extra = {}) => ({ CD_MUN: l.CD_MUN, NM_MUN: l.NM_MUN, ...extra });

/* ------------------------------------------------------------------ resumos por prancha */
function resumo({ linhas, versao }) {
  const tN = soma(linhas, (l) => l._.n);
  const tAgro = soma(linhas, (l) => l._.a.agro_ha);
  const tLav = soma(linhas, (l) => l._.lav.total);
  const g = Object.fromEntries(GRUPOS.map(([k]) => [k, soma(linhas, (l) => l._.grupos[k])]));
  const acima = linhas.filter((l) => l.n_kg_ha_agro !== null && l.n_kg_ha_agro > DIRETIVA);
  const cl = (v, lim) => { let i = 0; while (i < lim.length && v > lim[i] + 1e-9) i++; return i; };
  const classesN = new Array(6).fill(0), munN = new Array(6).fill(0);
  for (const l of linhas) if (l.n_kg_ha_agro !== null) { const k = cl(l.n_kg_ha_agro, LIM_N); classesN[k] += l._.n; munN[k]++; }
  const n081 = {
    total_t: tN / 1000, agro_ha: tAgro, kg_ha: tN / tAgro, grupos: Object.fromEntries(Object.entries(g).map(([k, v]) => [k, v / 1000])),
    acima: acima.sort((a, z) => z.n_kg_ha_agro - a.n_kg_ha_agro).map((l) => enxuto(l, { kg_ha: l.n_kg_ha_agro, n_t: l.n_dejetos_t, aves: l._.grupos.aves / l._.n, agro_ha: l.area_agro_ha })),
    maiores: topo(linhas, (l) => l._.n).map((l) => enxuto(l, { n_t: l.n_dejetos_t, kg_ha: l.n_kg_ha_agro })),
    densos: topo(linhas, (l) => l.n_kg_ha_agro, 10).map((l) => enxuto(l, { kg_ha: l.n_kg_ha_agro, n_t: l.n_dejetos_t })),
    classes: classesN.map((v) => v / 1000), mun_classes: munN,
    mediana: (() => { const v = linhas.map((l) => l.n_kg_ha_agro).filter((x) => x !== null).sort((a, z) => a - z); return v[Math.floor(v.length / 2)]; })(),
    sem_info: linhas.filter((l) => l.sem_info_ppm).map((l) => l.NM_MUN),
    sem_vacas: linhas.filter((l) => l.vacas_ordenhadas === null).length,
  };
  const tConf = { n: soma(linhas, (l) => l._.conf.n), p: soma(linhas, (l) => l._.conf.p), k: soma(linhas, (l) => l._.conf.k) };
  const pGrupos = Object.fromEntries([['aves', ['galinhas', 'frangos']], ['suinos', ['suinos', 'matrizes']], ['leite', ['vacas']], ['galinhas', ['galinhas']], ['frangos', ['frangos']]].map(([k, cs]) => [k, soma(linhas, (l) => {
    const r = { galinhas: l.galinhas, frangos: l.frangos, suinos: l.suinos == null ? null : Math.max(0, l.suinos - (l.matrizes ?? 0)), matrizes: l.matrizes, vacas: l.vacas_ordenhadas };
    return somaCats(r, cs, 'p');
  }) / 1000]));
  const classesP = new Array(6).fill(0), munP = new Array(6).fill(0);
  for (const l of linhas) if (l.p2o5_kg_ha_agro !== null && l._.conf.p > 0) { const k = cl(l.p2o5_kg_ha_agro, LIM_P); classesP[k] += l._.conf.p; munP[k]++; }
  const tExp = { n: soma(linhas, (l) => l._.e.n), p: soma(linhas, (l) => l._.e.p), k: soma(linhas, (l) => l._.e.k), cana_n: soma(linhas, (l) => l._.e.cana_n), cana_k: soma(linhas, (l) => l._.e.cana_k) };
  const sobra = linhas.filter((l) => l._.e.p > 0 && l._.conf.p > l._.e.p);
  const n082 = {
    p_t: tConf.p / 1000, n_t: tConf.n / 1000, k_t: tConf.k / 1000, lavoura_ha: tLav, agro_ha: tAgro, kg_ha: tConf.p / tAgro, grupos: pGrupos,
    densos: topo(linhas, (l) => (l._.conf.p > 0 ? l.p2o5_kg_ha_agro : null), 10).map((l) => enxuto(l, { kg_ha: l.p2o5_kg_ha_agro, p_t: l.p2o5_conf_t, agro_ha: l.area_agro_ha, aves: l._.conf.p ? somaCats({ galinhas: l.galinhas, frangos: l.frangos }, ['galinhas', 'frangos'], 'p') / l._.conf.p : 0 })),
    maiores: topo(linhas, (l) => l._.conf.p).map((l) => enxuto(l, { p_t: l.p2o5_conf_t, kg_ha: l.p2o5_kg_ha_agro })),
    classes: classesP.map((v) => v / 1000), mun_classes: munP,
    mediana: (() => { const v = linhas.map((l) => l.p2o5_kg_ha_agro).filter((x) => x !== null).sort((a, z) => a - z); return v[Math.floor(v.length / 2)]; })(),
    sobra: sobra.map((l) => enxuto(l, { p_t: l.p2o5_conf_t, exp_t: l.p2o5_exporta_t })).sort((a, z) => z.p_t - a.p_t),
    p_sobra_t: soma(sobra, (l) => l._.conf.p) / 1000,
    p_excesso_t: soma(sobra, (l) => l._.conf.p - l._.e.p) / 1000,
  };
  const n083 = {
    oferta: { n: tConf.n / 1000, p: tConf.p / 1000, k: tConf.k / 1000 },
    exporta: { n: tExp.n / 1000, p: tExp.p / 1000, k: tExp.k / 1000, cana_n: tExp.cana_n / 1000, cana_k: tExp.cana_k / 1000 },
    cobertura: { n: (100 * tConf.n) / tExp.n, p: (100 * tConf.p) / tExp.p, k: (100 * tConf.k) / tExp.k },
    area_coberta_pct: (100 * soma(linhas, (l) => l._.lav.coberta)) / soma(linhas, (l) => l._.lav.total),
    acima100: Object.fromEntries(['n', 'p2o5', 'k2o'].map((k) => [k, linhas.filter((l) => l[`cob_${k}_pct`] !== null && l[`cob_${k}_pct`] >= 100).length])),
    acima100_lav: Object.fromEntries(['n', 'p2o5', 'k2o'].map((k) => [k, linhas.filter((l) => comLavoura(l) && l[`cob_${k}_pct`] >= 100).length])),
    n_lav: linhas.filter(comLavoura).length,
    com_exp: linhas.filter((l) => l._.e.p > 0).length,
    top_p: topo(linhas.filter(comLavoura), (l) => l.cob_p2o5_pct, 8).map((l) => enxuto(l, { cob: l.cob_p2o5_pct, p_t: l.p2o5_conf_t, exp_t: l.p2o5_exporta_t })),
    top_n: topo(linhas.filter(comLavoura), (l) => l.cob_n_pct, 8).map((l) => enxuto(l, { cob: l.cob_n_pct })),
    top_k: topo(linhas.filter(comLavoura), (l) => l.cob_k2o_pct, 8).map((l) => enxuto(l, { cob: l.cob_k2o_pct })),
    maior_exp_n: topo(linhas, (l) => l._.e.n, 6).map((l) => enxuto(l, { exp_t: l.n_exporta_t, cob: l.cob_n_pct })),
  };
  const tDig = { n: soma(linhas, (l) => l._.d.n), p: soma(linhas, (l) => l._.d.p), k: soma(linhas, (l) => l._.d.k), ch4: soma(linhas, (l) => l._.d.ch4), bm: soma(linhas, (l) => l._.d.bm), aves: soma(linhas, (l) => l._.d.aves), suinos: soma(linhas, (l) => l._.d.suinos), bovinos: soma(linhas, (l) => l._.d.bovinos) };
  const n084 = {
    versao, n_t: tDig.n / 1000, p_t: tDig.p / 1000, k_t: tDig.k / 1000, biometano_m3_dia: tDig.bm / 365,
    origem: { aves: tDig.aves / tDig.n, suinos: tDig.suinos / tDig.n, bovinos: tDig.bovinos / tDig.n },
    sobre_conf: { n: (100 * tDig.n) / tConf.n, p: (100 * tDig.p) / tConf.p, k: (100 * tDig.k) / tConf.k },
    sobre_exp: { n: (100 * tDig.n) / tExp.n, p: (100 * tDig.p) / tExp.p, k: (100 * tDig.k) / tExp.k },
    mun: linhas.filter((l) => l._.d.n > 0).length,
    maiores: topo(linhas, (l) => l._.d.p, 10).map((l) => enxuto(l, { n_t: l.dig_n_t, p_t: l.dig_p2o5_t, k_t: l.dig_k2o_t, cob_p: l.dig_cob_p2o5_pct, m3: l.dig_biometano_m3_dia, lav_ha: l.area_lavoura_ha })),
    acima100_lav: linhas.filter((l) => comLavoura(l) && l.dig_cob_p2o5_pct >= 100).length,
    acima100: linhas.filter((l) => l.dig_cob_p2o5_pct !== null && l.dig_cob_p2o5_pct >= 100).length,
    sem_lavoura: linhas.filter((l) => l._.d.p > 0 && !(l._.e.p > 0)).map((l) => enxuto(l, { p_t: l.dig_p2o5_t })),
  };
  return { n081, n082, n083, n084 };
}

/* ------------------------------------------------------------------ GeoPackage e CSV */
async function gpkg(linhas) {
  const ref = camadasReferencia();
  const campos = linhas.map(({ _, ...o }) => o);
  const por = new Map(campos.map((l) => [l.CD_MUN, l]));
  const mun = malhaMunicipios().map((f) => ({ type: 'Feature', properties: por.get(String(f.properties.CD_MUN)), geometry: f.geometry }));
  const rotN = ['até 10', '10 a 25', '25 a 50', '50 a 100', '100 a 170', 'mais de 170'];
  const estilos = {
    municipios: [
      ['n_kg_ha_agro', 'Nº 081 · N dos dejetos por hectare agropecuário (kg/ha)', estiloGraduado('n_kg_ha_agro', [...LIM_N, 100000], CORES_N, { rotulos: rotN }), true],
      ['p2o5_kg_ha_agro', 'Nº 082 · P2O5 da criação confinada por hectare agropecuário (kg/ha)', estiloGraduado('p2o5_kg_ha_agro', [...LIM_P, 1e7], CORES_P, { casas: 0 }), false],
      ['cob_n_pct', 'Nº 083 · N dos dejetos confinados sobre o N exportado pelas colheitas (%)', estiloGraduado('cob_n_pct', [...LIM_C, 1e7], CORES_C, { sufixo: ' %' }), false],
      ['cob_p2o5_pct', 'Nº 083 · P2O5 dos dejetos confinados sobre o P2O5 exportado (%)', estiloGraduado('cob_p2o5_pct', [...LIM_C, 1e7], CORES_C, { sufixo: ' %' }), false],
      ['cob_k2o_pct', 'Nº 083 · K2O dos dejetos confinados sobre o K2O exportado (%)', estiloGraduado('cob_k2o_pct', [...LIM_C, 1e7], CORES_C, { sufixo: ' %' }), false],
      ['dig_cob_p2o5_pct', 'Nº 084 · P2O5 do digestato (CP2B N4) sobre o P2O5 exportado (%)', estiloGraduado('dig_cob_p2o5_pct', [...LIM_C, 1e7], CORES_C, { sufixo: ' %' }), false],
    ],
    ...ref.estilos,
  };
  const pasta = join(RAIZ, 'mapas', PASTA.nitrogenio, 'dados');
  mkdirSync(pasta, { recursive: true });
  const arq = join(pasta, 'sp_nutrientes_dejetos_2024.gpkg');
  await gravarGpkg(arq, { municipios: { feats: mun, campos: Object.keys(campos[0]) }, ...ref.camadas }, estilos);
  const z = zipar(arq);
  const csv = join(pasta, 'sp_nutrientes_dejetos_2024.csv');
  gravarCsv(csv, campos);
  for (const t of ['fosforo', 'balanco', 'digestato']) {
    const d = join(RAIZ, 'mapas', PASTA[t], 'dados');
    mkdirSync(d, { recursive: true });
    copyFileSync(csv, join(d, 'sp_nutrientes_dejetos_2024.csv'));
  }
  // Tabela de coeficientes, para quem quiser refazer a conta.
  const coef = join(pasta, 'sp_nutrientes_coeficientes.csv');
  gravarCsv(coef, [
    ...Object.entries(COEF).map(([k, c]) => ({ tipo: 'excrecao_kg_cabeca_ano', item: k, n: +c.n.toFixed(3), p2o5: +c.p.toFixed(3), k2o: +c.k.toFixed(3), fonte: 'N: IPCC 2019 Refinement (tab. 10.19 × 10A.5, América Latina); P2O5/N e K2O/N: MWPS-18 (2004), tab. 6' })),
    ...Object.entries(EXPORTA).map(([k, [n, p, kk]]) => ({ tipo: 'exportacao_kg_t', item: k, n, p2o5: +(p * P2O5).toFixed(3), k2o: +(kk * K2O).toFixed(3), fonte: 'IPNI Brasil/NPCT, calculadora de Balanço de Nutrientes (P e K convertidos em P2O5 e K2O)' })),
  ]);
  copyFileSync(coef, join(RAIZ, 'mapas', PASTA.balanco, 'dados', 'sp_nutrientes_coeficientes.csv'));
  console.log(`✓ ${z} · ${mb(tamanho(z))} · CSV ${kb(tamanho(csv))} · coeficientes ${kb(tamanho(coef))}`);
  return { gpkg: tamanho(z), csv: tamanho(csv), coef: tamanho(coef) };
}

/* ------------------------------------------------------------------ */
// Só roda a preparação quando chamado direto; prancha.mjs importa as constantes daqui.
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const M = await montar();
  const res = resumo(M);
  const valores = Object.fromEntries(M.linhas.map(({ _, ...o }) => [o.CD_MUN, o]));
  gravarCache('nutrientes-sp', { ano: ANO, coef: COEF, ...res, valores });
  const t = await gpkg(M.linhas);
  gravarCache('nutrientes-sp-arquivos', t);
  const f = (v, c = 0) => v.toLocaleString('pt-BR', { maximumFractionDigits: c });
  console.log('coeficientes kg/cab·ano', Object.fromEntries(Object.entries(COEF).map(([k, c]) => [k, `${f(c.n, 2)} N · ${f(c.p, 2)} P2O5 · ${f(c.k, 2)} K2O`])));
  const { n081, n082, n083, n084 } = res;
  console.log('081 N dejetos', f(n081.total_t), 't · agro', f(n081.agro_ha), 'ha ·', f(n081.kg_ha, 1), 'kg/ha · mediana', n081.mediana, '· grupos', Object.fromEntries(Object.entries(n081.grupos).map(([k, v]) => [k, f(v)])));
  console.log('   acima de 170:', n081.acima.map((l) => `${l.NM_MUN} ${l.kg_ha} (aves ${f(100 * l.aves)} %)`).join(', '));
  console.log('   maiores:', n081.maiores.map((l) => `${l.NM_MUN} ${f(l.n_t)} t`).join(', '));
  console.log('   classes (t N):', n081.classes.map((v) => f(v)).join(' | '), 'mun', n081.mun_classes.join(' | '), '· sem info', n081.sem_info.length);
  console.log('082 P2O5 confinados', f(n082.p_t), 't · lavoura', f(n082.lavoura_ha), 'ha ·', f(n082.kg_ha, 1), 'kg/ha · grupos', Object.fromEntries(Object.entries(n082.grupos).map(([k, v]) => [k, f(v)])));
  console.log('   densos:', n082.densos.map((l) => `${l.NM_MUN} ${l.kg_ha} (${f(l.agro_ha)} ha, aves ${f(100 * l.aves)} %)`).join(', '));
  console.log('   sobra P > exportação:', n082.sobra.length, 'mun,', f(n082.p_sobra_t), 't, excesso', f(n082.p_excesso_t), 't ·', n082.sobra.slice(0, 8).map((l) => `${l.NM_MUN} ${f(l.p_t)}/${f(l.exp_t)}`).join(', '));
  console.log('   classes:', n082.classes.map((v) => f(v)).join(' | '), 'mun', n082.mun_classes.join(' | '), '· mediana', n082.mediana);
  console.log('083 oferta', n083.oferta, 'exporta', n083.exporta, 'cobertura', n083.cobertura, 'área coberta', f(n083.area_coberta_pct, 1), '%');
  console.log('   ≥100 %:', n083.acima100, 'de', n083.com_exp, '· top P', n083.top_p.map((l) => `${l.NM_MUN} ${l.cob}`).join(', '));
  console.log('   top N', n083.top_n.map((l) => `${l.NM_MUN} ${l.cob}`).join(', '), '· top K', n083.top_k.map((l) => `${l.NM_MUN} ${l.cob}`).join(', '));
  console.log('   maior exportação N', n083.maior_exp_n.map((l) => `${l.NM_MUN} ${f(l.exp_t)} t (${l.cob} %)`).join(', '));
  console.log('084', { n: f(n084.n_t), p: f(n084.p_t), k: f(n084.k_t), m3dia: f(n084.biometano_m3_dia), origem: n084.origem, sobre_conf: n084.sobre_conf, sobre_exp: n084.sobre_exp, mun: n084.mun, acima100: n084.acima100 });
  console.log('   maiores', n084.maiores.map((l) => `${l.NM_MUN} ${f(l.p_t)} t P2O5 (${l.cob_p} %)`).join(', '));
}
