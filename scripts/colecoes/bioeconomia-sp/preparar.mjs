#!/usr/bin/env node
/**
 * Coleção «Bioeconomia no trabalho» (bioeconomia-sp) — prepara os dados das pranchas 076 a 080 (uso interno).
 *
 *   node scripts/colecoes/bioeconomia-sp/preparar.mjs [dados|gpkg ...]
 *
 * RAIS 2025, arquivo público de estabelecimentos do PDET/MTE (vínculos ativos em 31/12/2025), recortado
 * para SP por scripts/colecoes/lib/rais-sp.mjs em dados-brutos/rais/. A classificação da bioeconomia está
 * em cnae.mjs. População: Censo 2022 (tabela da prancha 064). Biometano: CP2B v5.1, N4, referência.
 */
import { join } from 'node:path';
import { readFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { RAIZ, BRUTOS, gravarCache, lerCache, gravarGpkg, gravarCsv, zipar, tamanho, mb } from '../lib/dados.mjs';
import { NOME_MUN, RGINT_MUN, NOME_RGINT, malhaMunicipios, camadasReferencia, cp2b } from '../lib/cruzamentos.mjs';
import { estiloGraduado, estiloRegras, preenchimento } from '../lib/estilos-qgis.mjs';
import { SEGMENTOS, segmento, residuos, gerador, GERADORES } from './cnae.mjs';

const MAPAS = join(RAIZ, 'mapas');
export const PASTA = {
  emprego: '076-bioeconomia-no-emprego-sp',
  perfil: '077-perfil-da-bioeconomia-sp',
  geradores: '078-industrias-do-residuo-organico-sp',
  encontro: '079-biomassa-e-industria-sp',
  residuos: '080-quem-trata-o-residuo-sp',
};
const r1 = (v) => Math.round(v * 10) / 10;
const r2 = (v) => Math.round(v * 100) / 100;

export const LIM_BIO = [3, 6, 12, 20, 35];
export const CORES_BIO = ['#f1efe4', '#dcdcbf', '#b9bf8e', '#8e9c5f', '#62743c', '#3b4a22'];
export const COR_SEG = { agro: '#8e9c5f', alimentos: '#c0884f', madeira: '#7a5a3a', fibras: '#9c8fb0', biocombustiveis: '#c9a227' };
export const COR_GER = { acucar_etanol: '#c9a227', abate: '#9a4a3a', laticinios: '#6f8fb0', frutas: '#d08a3a', bebidas: '#7a5a8a', graos_racoes: '#a59a6a', oleos: '#5f7a4a' };
export const LIM_RES = [2, 5, 10, 20, 40];
export const CORES_RES = ['#eef0ee', '#d3ddd8', '#a9c0b6', '#7a9c8f', '#4f7668', '#2b4c40'];

/** Código de 6 dígitos da RAIS → CD_MUN de 7 dígitos. */
const CD7 = new Map([...NOME_MUN.keys()].map((cd) => [cd.slice(0, 6), cd]));

function pessoas() {
  const arq = join(MAPAS, '064-idade-e-sexo-sp', 'dados', 'sp_gente_municipios_2022.csv');
  const [cab, ...ls] = readFileSync(arq, 'utf8').trim().split('\n');
  const k = cab.split(',');
  const iCd = k.indexOf('CD_MUN'), iP = k.indexOf('pessoas');
  return new Map(ls.map((l) => { const c = l.split(','); return [c[iCd], Number(c[iP])]; }));
}

/* ------------------------------------------------------------------ dados */
async function dados() {
  const pop = pessoas();
  const bio = await cp2b();
  const mun = new Map([...NOME_MUN].map(([cd, nm]) => [cd, {
    CD_MUN: cd, NM_MUN: nm, CD_RGINT: RGINT_MUN.get(cd), pessoas: pop.get(cd) ?? null, vinculos: 0, estab: 0,
    bio: 0, ...Object.fromEntries(SEGMENTOS.map((s) => [s, 0])),
    ger: 0, ...Object.fromEntries(Object.keys(GERADORES).map((g) => [`g_${g}`, 0])), estab_ger: 0,
    res: 0, res_coleta: 0, res_tratamento: 0, res_esgoto: 0, res_recuperacao: 0,
  }]));
  const linhas = readFileSync(join(BRUTOS, 'rais', 'rais_estab_sp.csv'), 'utf8').trim().split('\n').slice(1);
  let semMun = 0;
  for (const l of linhas) {
    const c = l.split(',');
    const cd = CD7.get(c[2]);
    if (!cd) { semMun += Number(c[3]); continue; }
    const o = mun.get(cd);
    const v = Number(c[3]);
    o.vinculos += v;
    if (c[10] !== '1') o.estab++;
    const s = segmento(c[0]);
    if (s) { o[s] += v; o.bio += v; }
    const g = gerador(c[0]);
    if (g) { o[`g_${g}`] += v; o.ger += v; if (v > 0) o.estab_ger++; }
    const r = residuos(c[0]);
    if (r) { o[`res_${r}`] += v; o.res += v; }
  }
  if (semMun) console.log(`vínculos sem município casado: ${semMun}`);
  const lista = [...mun.values()];
  for (const o of lista) {
    const b = bio.get(o.CD_MUN) ?? { total: 0, urbano: 0, cana: 0, pecuaria: 0, lavouras: 0 };
    o.biometano = r1(b.total); o.biometano_urbano = r1(b.urbano); o.biometano_cana = r1(b.cana); o.biometano_pecuaria = r1(b.pecuaria);
    o.pct_bio = o.vinculos ? r1((100 * o.bio) / o.vinculos) : null;
    o.dominante = o.bio ? SEGMENTOS.reduce((a, s) => (o[s] > o[a] ? s : a), SEGMENTOS[0]) : null;
    o.g_dominante = o.ger ? Object.keys(GERADORES).reduce((a, g) => (o[`g_${g}`] > o[`g_${a}`] ? g : a), 'abate') : null;
    o.res_10mil = o.pessoas ? r1((1e4 * o.res) / o.pessoas) : null;
  }
  const soma = (k, l = lista) => l.reduce((a, o) => a + (o[k] ?? 0), 0);
  const tot = { vinculos: soma('vinculos'), bio: soma('bio'), ger: soma('ger'), res: soma('res'), estab_ger: soma('estab_ger'), pessoas: soma('pessoas'), biometano: soma('biometano'), biometano_urbano: soma('biometano_urbano') };
  for (const s of SEGMENTOS) tot[s] = soma(s);
  for (const g of Object.keys(GERADORES)) tot[`g_${g}`] = soma(`g_${g}`);
  for (const r of ['coleta', 'tratamento', 'esgoto', 'recuperacao']) tot[`res_${r}`] = soma(`res_${r}`);
  tot.pct_bio = r1((100 * tot.bio) / tot.vinculos);

  // Brasil, para o quociente locacional.
  const br = { vinculos: 0, bio: 0 };
  for (const s of SEGMENTOS) br[s] = 0;
  for (const l of readFileSync(join(BRUTOS, 'rais', 'rais_br_subclasse.csv'), 'utf8').trim().split('\n').slice(1)) {
    const [sub, , v] = l.split(',');
    br.vinculos += Number(v);
    const s = segmento(sub);
    if (s) { br[s] += Number(v); br.bio += Number(v); }
  }
  br.pct_bio = r1((100 * br.bio) / br.vinculos);
  for (const o of lista) o.ql_bio = o.vinculos ? r2((o.bio / o.vinculos) / (br.bio / br.vinculos)) : null;

  // Regiões intermediárias.
  const rg = new Map();
  for (const o of lista) {
    const k = o.CD_RGINT;
    if (!rg.has(k)) rg.set(k, { CD_RGINT: k, NM_RGINT: NOME_RGINT.get(k), lista: [] });
    rg.get(k).lista.push(o);
  }
  const regioes = [...rg.values()].map((r) => {
    const o = { CD_RGINT: r.CD_RGINT, NM_RGINT: r.NM_RGINT, vinculos: soma('vinculos', r.lista), bio: soma('bio', r.lista), res: soma('res', r.lista), pessoas: soma('pessoas', r.lista), biometano: soma('biometano', r.lista), biometano_urbano: soma('biometano_urbano', r.lista), ger: soma('ger', r.lista) };
    for (const s of SEGMENTOS) o[s] = soma(s, r.lista);
    for (const g of Object.keys(GERADORES)) o[`g_${g}`] = soma(`g_${g}`, r.lista);
    o.pct_bio = r1((100 * o.bio) / o.vinculos);
    o.res_10mil = r1((1e4 * o.res) / o.pessoas);
    return o;
  }).sort((a, b) => b.pct_bio - a.pct_bio);

  const c = { mun: lista, tot, br, regioes, versao_cp2b: bio.versao };
  gravarCache('bioeconomia-sp', c);
  console.log('SP', tot, '\nBR', br);
  const top = (k, n = 8, f = () => true) => lista.filter(f).sort((a, b) => b[k] - a[k]).slice(0, n).map((o) => `${o.NM_MUN} ${o[k]}`).join('; ');
  console.log('pct_bio (≥ 1000 vínculos):', top('pct_bio', 10, (o) => o.vinculos >= 1000));
  console.log('bio abs:', top('bio'));
  console.log('ger abs:', top('ger', 12));
  console.log('res/10mil (≥ 20 mil hab):', top('res_10mil', 10, (o) => o.pessoas >= 20000));
  console.log('regiões:', regioes.map((r) => `${r.NM_RGINT} ${r.pct_bio}`).join('; '));
  const dom = {}; for (const o of lista) dom[o.dominante] = (dom[o.dominante] ?? 0) + 1; console.log('dominante', dom);
  return c;
}

/* ------------------------------------------------------------------ gpkg */
const CAMPOS = ['CD_MUN', 'NM_MUN', 'pessoas', 'vinculos', 'estab', 'bio', 'pct_bio', 'ql_bio', ...SEGMENTOS, 'dominante',
  'ger', ...Object.keys(GERADORES).map((g) => `g_${g}`), 'estab_ger', 'g_dominante',
  'res', 'res_coleta', 'res_tratamento', 'res_esgoto', 'res_recuperacao', 'res_10mil',
  'biometano', 'biometano_urbano', 'biometano_cana', 'biometano_pecuaria'];

async function gpkg(c) {
  const por = new Map(c.mun.map((o) => [o.CD_MUN, o]));
  const feats = malhaMunicipios().map((f) => {
    const o = por.get(f.properties.CD_MUN);
    return { type: 'Feature', geometry: f.geometry, properties: Object.fromEntries(CAMPOS.map((k) => [k, o?.[k] ?? null])) };
  });
  const ref = camadasReferencia();
  const cat = (campo, cores) => estiloRegras('poligono', Object.entries(cores).map(([k, cor]) => [`"${campo}" = '${k}'`, k, preenchimento(cor, '#ffffff', 0.2)]));
  const estilos = {
    municipios: [
      ['pct_bio', 'Nº 076 · Vínculos da bioeconomia (% dos vínculos formais)', estiloGraduado('pct_bio', [...LIM_BIO, 100], CORES_BIO, { casas: 0, sufixo: ' %' }), true],
      ['dominante', 'Nº 077 · Segmento da bioeconomia com mais vínculos', cat('dominante', COR_SEG), false],
      ['g_dominante', 'Nº 078 · Indústria geradora de resíduo orgânico com mais vínculos', cat('g_dominante', COR_GER), false],
      ['res_10mil', 'Nº 080 · Vínculos em resíduos e esgoto por 10 mil habitantes', estiloGraduado('res_10mil', [...LIM_RES, 1e6], CORES_RES, { casas: 0 }), false],
    ],
    ...ref.estilos,
  };
  const dir = join(MAPAS, PASTA.emprego, 'dados');
  mkdirSync(dir, { recursive: true });
  const arq = join(dir, 'sp_bioeconomia_rais_2025.gpkg');
  await gravarGpkg(arq, { municipios: { feats, campos: CAMPOS }, ...ref.camadas }, estilos);
  const zip = zipar(arq);
  const csv = join(dir, 'sp_bioeconomia_municipios_2025.csv');
  gravarCsv(csv, c.mun.map((o) => Object.fromEntries(CAMPOS.map((k) => [k, o[k]]))), CAMPOS);
  for (const p of Object.values(PASTA).slice(1)) {
    mkdirSync(join(MAPAS, p, 'dados'), { recursive: true });
    copyFileSync(csv, join(MAPAS, p, 'dados', 'sp_bioeconomia_municipios_2025.csv'));
  }
  console.log(`✓ ${zip} · ${mb(tamanho(zip))} · CSV ${mb(tamanho(csv))}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const cmds = process.argv.slice(2);
  const fazer = cmds.length ? cmds : ['dados', 'gpkg'];
  let c = null;
  if (fazer.includes('dados')) c = await dados();
  if (fazer.includes('gpkg')) await gpkg(c ?? lerCache('bioeconomia-sp'));
}
