#!/usr/bin/env node
/**
 * Coleção «Bioenergia cruzada» (bioenergia-cruzada-sp) — prepara os dados das pranchas 111 a 115 (uso interno).
 *
 *   node scripts/colecoes/bioenergia-cruzada-sp/base.mjs                                     (1) base municipal
 *   node --max-old-space-size=8192 scripts/colecoes/bioenergia-cruzada-sp/triagem.mjs        (2) testes de todos os pares
 *   node scripts/colecoes/bioenergia-cruzada-sp/lisa.mjs scripts/colecoes/bioenergia-cruzada-sp/pares_lisa.json   (3) LISA
 *   node scripts/colecoes/bioenergia-cruzada-sp/preparar.mjs [dados] [gpkg]
 *
 * Cada prancha é um mapa só. O cache traz, por município, os indicadores e as classes de cada mapa, os testes dos
 * pares e os números dos painéis; as linhas de gasoduto vêm do cache das pranchas 055–059.
 */
import { join } from 'node:path';
import { readFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { RAIZ, BRUTOS, gravarCache, lerCache, gravarGpkg, gravarCsv, zipar, tamanho, mb } from '../lib/dados.mjs';
import { NOME_MUN, RGINT_MUN, NOME_RGINT, malhaMunicipios, camadasReferencia } from '../lib/cruzamentos.mjs';
import { estiloRegras, preenchimento, hachura, linha } from '../lib/estilos-qgis.mjs';

const MAPAS = join(RAIZ, 'mapas');
const DIR = join(BRUTOS, 'analises');
export const SERIE = JSON.parse(readFileSync(join(RAIZ, 'scripts', 'colecoes', 'bioenergia-cruzada-sp', 'serie.json'), 'utf8'));
const PASTA = Object.fromEntries(SERIE.map((s) => [s.tema, s.pasta]));

/* ------------------------------------------------------------------ classes e cores (exportadas para a prancha) */
/** Paleta bivariada 3 × 3 (Stevens, roxo × dourado), a mesma das coleções 093–110: BIV[terço de y][terço de x]. */
export const BIV = [
  ['#e8e8e8', '#e4d9ac', '#c8b35a'],
  ['#cbb8d7', '#c8ada0', '#af8e53'],
  ['#9972af', '#976b82', '#804d36'],
];
/** 112: biometano sobre o diesel vendido (razão de energia). Abaixo de 1, ocres; de 1 para cima, verdes; teto em 2. */
export const LIM_DIESEL = [0.1, 0.25, 0.5, 1, 2];
export const COR_DIESEL = ['#a68647', '#c9b37d', '#e2d8bd', '#f2efe6', '#a7c9b2', '#4b8565'];
/** 115: os pequenos cheios de gás e longe do gasoduto, pela forma de prestar o serviço de resíduos (MUNIC 2023). */
export const COR_115 = { consorcio: '#5f3d80', regional: '#a585bf', sozinho: '#b8934a', semInfo: null, outro: '#e3e6e3' };
export const LIM_POP_115 = 20000, LIM_KM_115 = 50;
export const classe = (v, lim) => { let i = 0; while (i < lim.length && v >= lim[i] - 1e-9) i++; return i; };

const r2 = (v) => (v == null || !Number.isFinite(v) ? null : Math.round(v * 100) / 100);
const r4 = (v) => (v == null || !Number.isFinite(v) ? null : +v.toPrecision(6));
const ter = (v) => { const a = [...v].sort((x, y) => x - y); return [a[Math.floor(a.length / 3)], a[Math.floor((2 * a.length) / 3)]]; };
const terco = (v, t) => (v < t[0] ? 0 : v < t[1] ? 1 : 2);
const mediana = (v) => { const a = [...v].sort((x, y) => x - y); const n = a.length; return n % 2 ? a[n >> 1] : (a[n / 2 - 1] + a[n / 2]) / 2; };
const quantil = (v, q) => { const a = [...v].sort((x, y) => x - y); return a[Math.min(a.length - 1, Math.floor(q * a.length))]; };

function lerCsvSimples(arq) {
  const L = readFileSync(arq, 'utf8').trim().split(/\r?\n/);
  const cab = L[0].split(',');
  return L.slice(1).map((l) => {
    const c = l.match(/("([^"]|"")*"|[^,]*)(,|$)/g).map((x) => x.replace(/,$/, ''));
    return Object.fromEntries(cab.map((k, i) => [k, c[i] === '' || c[i] == null ? null : c[i].startsWith('"') ? c[i].slice(1, -1) : Number.isFinite(Number(c[i])) ? Number(c[i]) : c[i]]));
  });
}

/* ------------------------------------------------------------------ dados */
function dados() {
  const base = new Map(lerCsvSimples(join(DIR, 'base', 'municipios.csv')).map((o) => [String(o.cd), o]));
  const bio = new Map(lerCsvSimples(join(DIR, 'bioenergia', 'base_bio.csv')).map((o) => [String(o.cd), o]));
  const ext = JSON.parse(readFileSync(join(DIR, 'bioenergia', 'extras_bio.json'), 'utf8'));
  const lisaMun = new Map(lerCsvSimples(join(DIR, 'bioenergia', 'triagem', 'lisa_municipios.csv')).map((o) => [String(o.cd), o]));
  const lisaRes = JSON.parse(readFileSync(join(DIR, 'bioenergia', 'triagem', 'lisa.json'), 'utf8'));
  const pares = lerCsvSimples(join(DIR, 'bioenergia', 'triagem', 'pares.csv'));
  const BT = lerCache('biogas-territorio-sp');
  const bt = new Map(BT.linhas.map((l) => [l.CD_MUN, l]));

  /** Teste de um par, na ordem pedida (o pares.csv guarda a ordem da triagem). */
  const par = (x, y) => {
    const p = pares.find((r) => (r.x === x && r.y === y) || (r.x === y && r.y === x));
    if (!p) throw new Error(`par ausente: ${x} × ${y}`);
    return { x, y, n: p.n, rho: p.rho, parcial: p.rho_parcial, controles: String(p.controles).split('+'), n_eff: Math.round(p.n_eff), p_eff: p.p_eff, q: p.q_eff,
      sem_capital: p.rho_parcial_sem_capital, sem_rgint_sp: p.rho_parcial_sem_rgint_sp, I_biv: p.moran_biv, lisa: lisaRes[`${x}~${y}`] ?? lisaRes[`${y}~${x}`] ?? null };
  };

  const MUN = [...NOME_MUN.keys()].map((cd) => {
    const b = base.get(cd), v = bio.get(cd), e = ext[cd], l = bt.get(cd), lm = lisaMun.get(cd) ?? {};
    const o = { CD_MUN: cd, NM_MUN: NOME_MUN.get(cd), CD_RGINT: RGINT_MUN.get(cd), NM_RGINT: NOME_RGINT.get(RGINT_MUN.get(cd)), pessoas: b.pessoas, area_km2: r2(l.area_km2) };
    // 111
    o.pct_area_cana = r2(b.pct_area_cana); o.etanol_l = e.etanol_l ?? null; o.gasolina_l = e.gasolina_l ?? null; o.pct_etanol_otto = r2(v.pct_etanol_otto);
    o.lisa111 = lm['pct_area_cana~pct_etanol_otto'] ?? null;
    // 112
    o.biometano_m3d = Math.round(l.biometano_m3d); o.diesel_l = e.diesel_l ?? null; o.cobertura_diesel = r4(v.cobertura_diesel);
    o.caminhoes = e.caminhoes ?? null; o.onibus = e.onibus ?? null;
    // 113
    o.pct_area_nativa = r2(b.pct_area_nativa); o.madeira_papel_m3 = e.madeira_papel_m3 ?? null;
    o.madeira_papel_m3_km2 = o.madeira_papel_m3 == null ? null : r4(o.madeira_papel_m3 / l.area_km2);
    o.lisa113 = lm['pct_area_nativa~log_madeira_papel_km2'] ?? null;
    // 114
    o.bovinos_km2 = b.log_dens_bovino == null ? null : r2(10 ** b.log_dens_bovino); o.n_kg_ha_agro = r2(b.n_kg_ha_agro);
    o.estab_agro = e.estab_adubo ?? null; o.estab_adubo_organico = e.estab_adubo_organico ?? null; o.pct_estab_adubo_organico = r2(v.pct_estab_adubo_organico);
    o.lisa114 = lm['pct_estab_adubo_organico~log_dens_bovino'] ?? null;
    // 115
    o.km_gasoduto_transporte = r2(l.km_gasoduto_transporte); o.km_gasoduto_distribuicao = r2(l.km_gasoduto_distribuicao); o.tem_gas_canalizado = v.tem_gas_canalizado;
    for (const k of ['rs_consorcio', 'rs_regionalizado', 'rs_trat_organicos', 'rs_compostagem', 'rs_aterro_sanitario', 'rs_coleta_seletiva']) o[k] = v[k];
    return o;
  });
  const POR = new Map(MUN.map((o) => [o.CD_MUN, o]));
  const SP = POR.get('3550308');
  const naRgSp = (o) => o.CD_RGINT === RGINT_MUN.get('3550308');
  const somaDe = (l, k) => l.reduce((t, o) => t + (o[k] ?? 0), 0);

  /* ---------- 111 cana × etanol: terços dos dois; parte do etanol, em energia, por terço da área de cana */
  const otto = (l) => { const et = somaDe(l, 'etanol_l') * 21.3, ga = somaDe(l, 'gasolina_l') * 32.2; return (100 * et) / (et + ga); };
  const ok111 = MUN.filter((o) => o.pct_area_cana != null && o.pct_etanol_otto != null);
  const t111 = { x: ter(ok111.map((o) => o.pct_area_cana)), y: ter(ok111.map((o) => o.pct_etanol_otto)) };
  const casas111 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const o of ok111) { const a = terco(o.pct_etanol_otto, t111.y), b = terco(o.pct_area_cana, t111.x); o.b111 = 10 * (b + 1) + (a + 1); casas111[a][b]++; }
  const porTercoCana = [0, 1, 2].map((k) => { const l = ok111.filter((o) => terco(o.pct_area_cana, t111.x) === k); return { n: l.length, otto: otto(l), med: mediana(l.map((o) => o.pct_etanol_otto)) }; });
  const e111 = { ...par('pct_area_cana', 'pct_etanol_otto'), casas: casas111, ter_x: t111.x, ter_y: t111.y, porTercoCana, estado: otto(ok111), capital: SP.pct_etanol_otto,
    etanol_bi_l: somaDe(ok111, 'etanol_l') / 1e9, gasolina_bi_l: somaDe(ok111, 'gasolina_l') / 1e9 };

  /* ---------- 112 diesel que o biometano cobriria */
  const ok112 = MUN.filter((o) => o.cobertura_diesel != null);
  const cobre = (l) => (somaDe(l, 'biometano_m3d') * 365 * 0.98) / somaDe(l, 'diesel_l');
  const regioes112 = [...new Set(MUN.map((o) => o.CD_RGINT))].map((cd) => { const l = ok112.filter((o) => o.CD_RGINT === cd); return { cd, nome: NOME_RGINT.get(cd), n: l.length, cobre: cobre(l) }; }).sort((a, b) => b.cobre - a.cobre);
  const cont112 = new Array(LIM_DIESEL.length + 1).fill(0);
  for (const o of ok112) cont112[classe(o.cobertura_diesel, LIM_DIESEL)]++;
  const e112 = {
    bm_bi_m3_ano: (somaDe(MUN, 'biometano_m3d') * 365) / 1e9, diesel_bi_l: somaDe(ok112, 'diesel_l') / 1e9, estado: cobre(ok112), fora_rgint_sp: cobre(ok112.filter((o) => !naRgSp(o))),
    n: ok112.length, ge1: ok112.filter((o) => o.cobertura_diesel >= 1).length, ge05: ok112.filter((o) => o.cobertura_diesel >= 0.5).length, mediana: mediana(ok112.map((o) => o.cobertura_diesel)),
    cont: cont112, regioes: regioes112, caminhoes: somaDe(MUN, 'caminhoes'), onibus: somaDe(MUN, 'onibus'), sem: MUN.length - ok112.length,
    bm_caminhoes: par('log_bm_total', 'caminhoes_mil_hab'), bm_diesel: par('log_bm_total', 'log_diesel_l_hab'), usinas_diesel: par('usinas_10mil', 'log_diesel_l_hab'),
  };

  /* ---------- 113 mata × madeira para celulose: terços da mata; madeira em três degraus (nada, metade de baixo e de cima dos que produzem) */
  const ok113 = MUN.filter((o) => o.madeira_papel_m3 != null && o.pct_area_nativa != null);
  const prod = ok113.filter((o) => o.madeira_papel_m3 > 0);
  const medProd = mediana(prod.map((o) => o.madeira_papel_m3_km2));
  const tx113 = ter(ok113.map((o) => o.pct_area_nativa));
  const casas113 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const o of ok113) { const a = o.madeira_papel_m3 === 0 ? 0 : o.madeira_papel_m3_km2 < medProd ? 1 : 2, b = terco(o.pct_area_nativa, tx113); o.b113 = 10 * (b + 1) + (a + 1); casas113[a][b]++; }
  const regLisa = (k) => { const r = {}; for (const o of MUN) if (o[k] === 'AA') r[o.NM_RGINT] = (r[o.NM_RGINT] ?? 0) + 1; return Object.entries(r).sort((a, b) => b[1] - a[1]); };
  const e113 = { ...par('pct_area_nativa', 'log_madeira_papel_km2'), casas: casas113, ter_x: tx113, med_prod: medProd, n_dados: ok113.length, n_prod: prod.length, sem: MUN.length - ok113.length,
    madeira_mi_m3: somaDe(prod, 'madeira_papel_m3') / 1e6, regioesAA: regLisa('lisa113'),
    nativa_prod: mediana(prod.map((o) => o.pct_area_nativa)), nativa_nao: mediana(ok113.filter((o) => o.madeira_papel_m3 === 0).map((o) => o.pct_area_nativa)) };

  /* ---------- 114 bovinos × adubo orgânico */
  const ok114 = MUN.filter((o) => o.bovinos_km2 != null && o.pct_estab_adubo_organico != null);
  const t114 = { x: ter(ok114.map((o) => o.bovinos_km2)), y: ter(ok114.map((o) => o.pct_estab_adubo_organico)) };
  const casas114 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const o of ok114) { const a = terco(o.pct_estab_adubo_organico, t114.y), b = terco(o.bovinos_km2, t114.x); o.b114 = 10 * (b + 1) + (a + 1); casas114[a][b]++; }
  const quartis = (k) => { const q1 = quantil(ok114.map((o) => o[k]), 0.25), q3 = quantil(ok114.map((o) => o[k]), 0.75); const pc = (l) => (100 * somaDe(l, 'estab_adubo_organico')) / somaDe(l, 'estab_agro');
    return { q1, q3, baixo: pc(ok114.filter((o) => o[k] < q1)), alto: pc(ok114.filter((o) => o[k] >= q3)), medBaixo: mediana(ok114.filter((o) => o[k] < q1).map((o) => o.pct_estab_adubo_organico)), medAlto: mediana(ok114.filter((o) => o[k] >= q3).map((o) => o.pct_estab_adubo_organico)) }; };
  const okN = ok114.filter((o) => o.n_kg_ha_agro != null);
  const qN = (() => { const q1 = quantil(okN.map((o) => o.n_kg_ha_agro), 0.25), q3 = quantil(okN.map((o) => o.n_kg_ha_agro), 0.75); return { q1, q3, medBaixo: mediana(okN.filter((o) => o.n_kg_ha_agro < q1).map((o) => o.pct_estab_adubo_organico)), medAlto: mediana(okN.filter((o) => o.n_kg_ha_agro >= q3).map((o) => o.pct_estab_adubo_organico)) }; })();
  const regBA = {}; for (const o of MUN) if (o.lisa114 === 'BA') regBA[o.NM_RGINT] = (regBA[o.NM_RGINT] ?? 0) + 1;
  const e114 = { ...par('pct_estab_adubo_organico', 'log_dens_bovino'), casas: casas114, ter_x: t114.x, ter_y: t114.y, bov: quartis('bovinos_km2'), nitro: qN,
    mediana: mediana(MUN.filter((o) => o.pct_estab_adubo_organico != null).map((o) => o.pct_estab_adubo_organico)),
    estado: (100 * somaDe(MUN, 'estab_adubo_organico')) / somaDe(MUN.filter((o) => o.estab_adubo_organico != null), 'estab_agro'),
    n_adubo: MUN.filter((o) => o.pct_estab_adubo_organico != null).length, regioesBA: Object.entries(regBA).sort((a, b) => b[1] - a[1]), sem: MUN.length - ok114.length };

  /* ---------- 115 pequenos, cheios de gás e sozinhos */
  const p75 = quantil(MUN.map((o) => o.biometano_m3d), 0.75);
  const total = somaDe(MUN, 'biometano_m3d');
  for (const o of MUN) {
    o.cheio115 = o.biometano_m3d >= p75 ? 1 : 0;
    o.alvo115 = o.cheio115 && o.pessoas < LIM_POP_115 && o.km_gasoduto_transporte > LIM_KM_115 ? 1 : 0;
    o.arranjo115 = !o.alvo115 ? null : o.rs_regionalizado == null ? 'sem_informacao' : o.rs_consorcio === 1 ? 'consorcio' : o.rs_regionalizado === 1 ? 'regional' : 'sozinho';
  }
  const alvo = MUN.filter((o) => o.alvo115);
  const conta = (l, f) => l.filter(f).length;
  const reg115 = {}; for (const o of alvo) reg115[o.NM_RGINT] = (reg115[o.NM_RGINT] ?? 0) + 1;
  const e115 = {
    p75, n: alvo.length, bm: somaDe(alvo, 'biometano_m3d'), pct_bm: (100 * somaDe(alvo, 'biometano_m3d')) / total, pessoas: somaDe(alvo, 'pessoas'),
    consorcio: conta(alvo, (o) => o.arranjo115 === 'consorcio'), regional: conta(alvo, (o) => o.arranjo115 === 'regional'), sozinho: conta(alvo, (o) => o.arranjo115 === 'sozinho'), sem_info: conta(alvo, (o) => o.arranjo115 === 'sem_informacao'),
    trat_org: conta(alvo, (o) => o.rs_trat_organicos === 1), compostagem: conta(alvo, (o) => o.rs_compostagem === 1), aterro: conta(alvo, (o) => o.rs_aterro_sanitario === 1), seletiva: conta(alvo, (o) => o.rs_coleta_seletiva === 1),
    gas_canalizado: conta(alvo, (o) => o.tem_gas_canalizado === 1),
    est_consorcio: conta(MUN, (o) => o.rs_consorcio === 1), est_regional: conta(MUN, (o) => o.rs_regionalizado === 1), est_trat_org: conta(MUN, (o) => o.rs_trat_organicos === 1), est_munic: conta(MUN, (o) => o.rs_regionalizado != null),
    sem_gas_pct: (100 * somaDe(MUN.filter((o) => o.tem_gas_canalizado !== 1), 'biometano_m3d')) / total, sem_gas_n: conta(MUN, (o) => o.tem_gas_canalizado !== 1),
    longe_pct: (100 * somaDe(MUN.filter((o) => o.km_gasoduto_transporte > LIM_KM_115), 'biometano_m3d')) / total,
    cheios_n: conta(MUN, (o) => o.cheio115), regioes: Object.entries(reg115).sort((a, b) => b[1] - a[1]),
    maiores: [...alvo].sort((a, b) => b.biometano_m3d - a.biometano_m3d).slice(0, 10).map((o) => [o.NM_MUN, o.biometano_m3d, o.pessoas, o.km_gasoduto_transporte, o.arranjo115]),
    bm_gasoduto: par('log_bm_total', 'km_gasoduto_transporte'),
  };

  /* ---------- destaques para as chamadas */
  const ver = (rot, l, ks) => console.log(rot, l.slice(0, 8).map((o) => `${o.NM_MUN} (${ks.map((k) => (typeof o[k] === 'number' ? +o[k].toFixed(2) : o[k])).join(' · ')}; ${o.pessoas})`).join(' | '));
  const ord = (l, k, s = -1) => [...l].sort((a, b) => s * (a[k] - b[k]));
  const p10 = (o) => o.pessoas >= 10000;
  ver('111 etanol alto ≥10k', ord(ok111.filter(p10), 'pct_etanol_otto'), ['pct_etanol_otto', 'pct_area_cana', 'b111']);
  ver('111 etanol baixo ≥10k', ord(ok111.filter(p10), 'pct_etanol_otto', 1), ['pct_etanol_otto', 'pct_area_cana', 'b111']);
  ver('112 cobertura alta', ord(ok112, 'cobertura_diesel'), ['cobertura_diesel', 'biometano_m3d']);
  ver('112 cobertura alta ≥50k', ord(ok112.filter((o) => o.pessoas >= 50000), 'cobertura_diesel'), ['cobertura_diesel', 'biometano_m3d']);
  ver('113 madeira alta', ord(prod, 'madeira_papel_m3_km2'), ['madeira_papel_m3_km2', 'madeira_papel_m3', 'pct_area_nativa', 'lisa113']);
  ver('113 madeira total', ord(prod, 'madeira_papel_m3'), ['madeira_papel_m3', 'pct_area_nativa', 'lisa113']);
  ver('114 adubo alto', ord(ok114.filter(p10), 'pct_estab_adubo_organico'), ['pct_estab_adubo_organico', 'bovinos_km2', 'b114']);
  ver('114 bovinos alto, adubo baixo', ord(ok114.filter((o) => o.b114 === 31), 'bovinos_km2'), ['pct_estab_adubo_organico', 'bovinos_km2', 'estab_agro']);
  ver('115 maiores', ord(alvo, 'biometano_m3d'), ['biometano_m3d', 'km_gasoduto_transporte', 'arranjo115']);
  console.log('111', JSON.stringify({ ter: t111, casas: casas111, porTercoCana, estado: e111.estado, capital: e111.capital }));
  console.log('112', JSON.stringify({ ...e112, regioes: e112.regioes.map((r) => `${r.nome} ${(100 * r.cobre).toFixed(0)}`) }).slice(0, 900));
  console.log('113', JSON.stringify({ casas: casas113, tx113, medProd, n: ok113.length, prod: prod.length, reg: e113.regioesAA, nativa_prod: e113.nativa_prod, nativa_nao: e113.nativa_nao }));
  console.log('114', JSON.stringify({ casas: casas114, t114, bov: e114.bov, nitro: qN, med: e114.mediana, est: e114.estado, ba: e114.regioesBA.slice(0, 4) }));
  console.log('115', JSON.stringify({ ...e115, maiores: e115.maiores.slice(0, 5) }));

  // Linhas de gás para o mapa da 115 (simplificadas no cache 055–059).
  const gas = { transporte: BT.desenho.transporte.features, distribuicao: BT.desenho.distribuicao.features };
  const c = { mun: MUN, e111, e112, e113, e114, e115, gas };
  gravarCache('bioenergia-cruzada-sp', c);
  return c;
}

/* ------------------------------------------------------------------ gpkg */
const COLUNAS = ['area_km2',
  'pct_area_cana', 'etanol_l', 'gasolina_l', 'pct_etanol_otto', 'b111', 'lisa111',
  'biometano_m3d', 'diesel_l', 'cobertura_diesel', 'caminhoes', 'onibus',
  'pct_area_nativa', 'madeira_papel_m3', 'madeira_papel_m3_km2', 'b113', 'lisa113',
  'bovinos_km2', 'n_kg_ha_agro', 'estab_agro', 'estab_adubo_organico', 'pct_estab_adubo_organico', 'b114', 'lisa114',
  'km_gasoduto_transporte', 'km_gasoduto_distribuicao', 'tem_gas_canalizado', 'rs_consorcio', 'rs_regionalizado', 'rs_trat_organicos', 'rs_compostagem', 'rs_aterro_sanitario', 'rs_coleta_seletiva',
  'cheio115', 'alvo115', 'arranjo115'];
export const CAMPOS = ['CD_MUN', 'NM_MUN', 'CD_RGINT', 'NM_RGINT', 'pessoas', ...COLUNAS];
export const GPKG = 'sp_bioenergia_cruzada.gpkg';
export const CSV = 'sp_bioenergia_cruzada_municipios.csv';

function estiloBiv(campo, [rx, ry]) {
  const n = ['baixo', 'médio', 'alto'];
  const itens = [];
  for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) itens.push([`"${campo}" = ${10 * (b + 1) + (a + 1)}`, `${rx} ${n[b]} · ${ry} ${n[a]}`, preenchimento(BIV[a][b], '#ffffff', 0.2)]);
  itens.push([`"${campo}" IS NULL`, 'sem informação', hachura()]);
  return estiloRegras('poligono', itens);
}

async function gpkg(c) {
  const por = new Map(c.mun.map((o) => [o.CD_MUN, o]));
  const feats = malhaMunicipios().map((f) => {
    const o = por.get(String(f.properties.CD_MUN));
    return { type: 'Feature', geometry: f.geometry, properties: Object.fromEntries(CAMPOS.map((k) => [k, o?.[k] ?? null])) };
  });
  const ref = camadasReferencia();
  const N = Object.fromEntries(SERIE.map((s) => [s.tema, String(s.numero).padStart(3, '0')]));
  const rotD = ['menos de 0,1', '0,1 a 0,25', '0,25 a 0,5', '0,5 a 1', '1 a 2', '2 ou mais'];
  const regrasDiesel = LIM_DIESEL.concat(Infinity).map((l, i) => [
    i === 0 ? `"cobertura_diesel" < ${l}` : `"cobertura_diesel" >= ${LIM_DIESEL[i - 1]}${Number.isFinite(l) ? ` AND "cobertura_diesel" < ${l}` : ''}`, rotD[i], preenchimento(COR_DIESEL[i], '#ffffff', 0.2)]);
  regrasDiesel.push(['"cobertura_diesel" IS NULL', 'sem informação', hachura()]);
  const regras115 = [
    ['"arranjo115" = \'consorcio\'', 'pequeno, cheio de gás e longe: em consórcio', preenchimento(COR_115.consorcio, '#ffffff', 0.2)],
    ['"arranjo115" = \'regional\'', 'pequeno, cheio de gás e longe: outra forma regionalizada', preenchimento(COR_115.regional, '#ffffff', 0.2)],
    ['"arranjo115" = \'sozinho\'', 'pequeno, cheio de gás e longe: presta sozinho', preenchimento(COR_115.sozinho, '#ffffff', 0.2)],
    ['"arranjo115" = \'sem_informacao\'', 'pequeno, cheio de gás e longe: sem resposta na MUNIC', hachura()],
    ['"alvo115" = 0 AND "cheio115" = 1', 'outros com potencial no quartil de cima', preenchimento(COR_115.outro, '#ffffff', 0.2)],
    ['"alvo115" = 0 AND "cheio115" = 0', 'demais', preenchimento('#f1f2f3', '#ffffff', 0.2)],
  ];
  const estilos = {
    municipios: [
      ['b111', `Nº ${N.cana} · Área com cana × parte do etanol no ciclo Otto, em terços`, estiloBiv('b111', ['cana', 'etanol']), true],
      ['cobertura_diesel', `Nº ${N.diesel} · Biometano N4 sobre o diesel vendido, em energia (razão)`, estiloRegras('poligono', regrasDiesel), false],
      ['b113', `Nº ${N.eucalipto} · Vegetação nativa (terços) × madeira para celulose (nada, metade de baixo, metade de cima)`, estiloBiv('b113', ['mata', 'madeira']), false],
      ['b114', `Nº ${N.esterco} · Bovinos por km² × estabelecimentos com adubo orgânico, em terços`, estiloBiv('b114', ['bovinos', 'adubo orgânico']), false],
      ['arranjo115', `Nº ${N.pequenos} · Pequenos, cheios de gás e longe do gasoduto, pela forma de prestar o serviço de resíduos`, estiloRegras('poligono', regras115), false],
    ],
    gasodutos: [['gasodutos', 'Gasodutos (transporte e distribuição)', estiloRegras('linha', [
      ['"tipo" = \'transporte\'', 'gasoduto de transporte', linha('#1a1c1e', 0.7)],
      ['"tipo" = \'distribuicao\'', 'rede de distribuição', linha('#7a8189', 0.3)],
    ]), true]],
    ...ref.estilos,
  };
  const gasFeats = [
    ...c.gas.transporte.map((f) => ({ type: 'Feature', geometry: f.geometry, properties: { tipo: 'transporte', nome: f.properties.nome ?? null } })),
    ...c.gas.distribuicao.map((f) => ({ type: 'Feature', geometry: f.geometry, properties: { tipo: 'distribuicao', nome: f.properties.distribuidora ?? null } })),
  ];
  const dir = join(MAPAS, PASTA.cana, 'dados');
  mkdirSync(dir, { recursive: true });
  const arq = join(dir, GPKG);
  await gravarGpkg(arq, { municipios: { feats, campos: CAMPOS }, gasodutos: { feats: gasFeats, campos: ['tipo', 'nome'] }, ...ref.camadas }, estilos);
  const zip = zipar(arq);
  const csv = join(dir, CSV);
  gravarCsv(csv, c.mun.map((o) => Object.fromEntries(CAMPOS.map((k) => [k, o[k]]))), CAMPOS);
  for (const p of Object.values(PASTA).slice(1)) {
    mkdirSync(join(MAPAS, p, 'dados'), { recursive: true });
    copyFileSync(csv, join(MAPAS, p, 'dados', CSV));
  }
  console.log(`✓ ${zip} · ${mb(tamanho(zip))} · CSV ${mb(tamanho(csv))}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const cmds = process.argv.slice(2);
  const fazer = cmds.length ? cmds : ['dados', 'gpkg'];
  const c = fazer.includes('dados') ? dados() : lerCache('bioenergia-cruzada-sp');
  if (fazer.includes('gpkg')) await gpkg(c);
}
