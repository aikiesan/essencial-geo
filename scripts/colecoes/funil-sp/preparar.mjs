#!/usr/bin/env node
/**
 * Coleção «O funil do biometano» (funil-sp) — prepara os dados das pranchas 116 a 120 (uso interno).
 *
 *   node scripts/colecoes/funil-sp/preparar.mjs
 *
 * Fonte: CP2B v5.1 (Unicamp), potencial por município, substrato, nível e cenário
 * (cp2b_municipio_substrato_niveis.csv). Os quatro níveis do método, em m³ normais de METANO por ano:
 *   N1 teórico      rebanho ou colheita × geração de resíduo × sólidos × BMP
 *   N2 técnico      N1 × FC (o que se consegue recolher)
 *   N3 mobilizável  N2 × FCo (o que sobra dos usos que excluem o biodigestor) − o que já vira biogás hoje
 *   N4 acessível    N3 × FS × FL (perdas na estocagem e fator logístico calculado na malha viária)
 * Cada passo do funil é a diferença entre dois níveis; os fatores estão em cp2b_parametros.csv.
 */
import { join } from 'node:path';
import { mkdirSync, readFileSync, copyFileSync } from 'node:fs';
import { RAIZ, lerCsv, gravarCache, gravarGpkg, gravarCsv, zipar, tamanho, mb, kb, soma, pontoInterno } from '../lib/dados.mjs';
import { NOME_MUN, RGINT_MUN, NOME_RGINT, SP, DADOS_CP2B, GRUPO_SUBSTRATO, malhaMunicipios, camadasReferencia } from '../lib/cruzamentos.mjs';
import { estiloGraduado, estiloRegras, marcador, preenchimento } from '../lib/estilos-qgis.mjs';
import { CORES_RET, LIM_RET, CORES_COLETA, CORES_USOS, CORES_ESTRADA, LIM_ESTRADA, CORES_N4 } from './cores.mjs';

const SERIE = JSON.parse(readFileSync(join(RAIZ, 'scripts', 'colecoes', 'funil-sp', 'serie.json'), 'utf8'));
const PASTA = Object.fromEntries(SERIE.map((s) => [s.tema, join(RAIZ, 'mapas', s.pasta, 'dados')]));
const ARQ = join(DADOS_CP2B, 'raw', 'cp2b_potential', '2026', 'cp2b_municipio_substrato_niveis.csv');

const r0 = (v) => Math.round(v);
const r1 = (v) => Math.round(v * 10) / 10;

/* ------------------------------------------------------------------ causas de cada passo */
// Coleta (N1 → N2): o que fica no campo.
const CAUSA_COLETA ={ PALHA: 'palha_cana', BOV_PASTO_MISTO: 'esterco_pasto', PALHA_SOJA: 'palha_graos', PALHA_MILHO: 'palha_graos' };
// Usos concorrentes (N2 → N3): o que já tem outro destino.
const CAUSA_USO ={ BAGACO: 'bagaco', BAGACO_CITROS: 'citros', CASCA_CAFE: 'cafe' };
const causa = (mapa, sub) => mapa[sub] ?? 'outros';

/* ------------------------------------------------------------------ leitura */
const linhasCp2b = await lerCsv(ARQ, { sep: ',' });
const vazio = () => ({ n1: 0, n2: 0, n3a: 0, exist: 0, n3: 0, n4: 0, bio4: 0 });
const mun = new Map(); // cd → { min, med, max, coleta{}, uso{}, estrada{}, exist{} }
const sub = new Map(); // `${cenario}|${substrato}` → níveis
let versao = null;
for (const l of linhasCp2b) {
  const cd = String(l.ibge_code);
  if (!cd.startsWith('35')) continue;
  versao ??= l.method_version;
  const s = l.scenario;
  const v = {
    n1: Number(l.n1_ch4_nm3_year), n2: Number(l.n2_ch4_nm3_year), n3a: Number(l.n3_before_existing_use_ch4_nm3_year),
    exist: Number(l.existing_use_subtracted_ch4_nm3_year), n3: Number(l.n3_ch4_nm3_year), n4: Number(l.n4_ch4_nm3_year),
    bio4: Number(l.n4_biomethane_eq_nm3_year),
  };
  if (!mun.has(cd)) mun.set(cd, { min: vazio(), med: vazio(), max: vazio(), coleta: {}, uso: {}, estrada: {}, exist: {}, grupos4: {} });
  const m = mun.get(cd);
  for (const k of Object.keys(v)) m[s][k] += v[k];
  const ks = `${s}|${l.substrate}`;
  if (!sub.has(ks)) sub.set(ks, { cenario: s, substrato: l.substrate, grupo: GRUPO_SUBSTRATO[l.substrate], ...vazio() });
  for (const k of Object.keys(v)) sub.get(ks)[k] += v[k];
  if (s !== 'med') continue;
  const g = GRUPO_SUBSTRATO[l.substrate];
  if (!g) throw new Error(`substrato sem grupo: ${l.substrate}`);
  const add = (o, k, x) => { o[k] = (o[k] ?? 0) + x; };
  add(m.coleta, causa(CAUSA_COLETA, l.substrate), v.n1 - v.n2);
  add(m.uso, causa(CAUSA_USO, l.substrate), v.n2 - v.n3a);
  add(m.exist, l.substrate, v.exist);
  add(m.estrada, g, v.n3 - v.n4);
  add(m.grupos4, g, v.n4);
}
if (mun.size !== 645) throw new Error(`esperados 645 municípios, vieram ${mun.size}`);

/* ------------------------------------------------------------------ tabela municipal */
const malha = malhaMunicipios();
const ponto = new Map(malha.map((f) => [String(f.properties.CD_MUN), pontoInterno(f.geometry)]));
const area = new Map(malha.map((f) => [String(f.properties.CD_MUN), Number(f.properties.AREA_KM2)]));
const maior = (o) => Object.entries(o).sort((a, z) => z[1] - a[1])[0]?.[0] ?? null;
const linhas = [];
for (const f of malha) {
  const cd = String(f.properties.CD_MUN);
  const m = mun.get(cd);
  if (!m) throw new Error(`município sem CP2B: ${NOME_MUN.get(cd)}`);
  const d = m.med;
  linhas.push({
    CD_MUN: cd, NM_MUN: NOME_MUN.get(cd), CD_RGINT: RGINT_MUN.get(cd), NM_RGINT: NOME_RGINT.get(RGINT_MUN.get(cd)), area_km2: r1(area.get(cd)),
    // Níveis, cenário de referência (m³ de metano por ano).
    n1_m3: r0(d.n1), n2_m3: r0(d.n2), n3_m3: r0(d.n3), n4_m3: r0(d.n4),
    n4_biometano_m3_dia: r0(d.bio4 / 365),
    retencao_pct: d.n1 > 0 ? r1((100 * d.n4) / d.n1) : null,
    // Passo 1: coleta.
    perda_coleta_m3: r0(d.n1 - d.n2),
    coleta_palha_cana_m3: r0(m.coleta.palha_cana ?? 0), coleta_esterco_pasto_m3: r0(m.coleta.esterco_pasto ?? 0),
    coleta_palha_graos_m3: r0(m.coleta.palha_graos ?? 0), coleta_outros_m3: r0(m.coleta.outros ?? 0),
    causa_coleta: d.n1 - d.n2 > 0 ? maior(m.coleta) : null,
    perda_coleta_pct: d.n1 > 0 ? r1((100 * (d.n1 - d.n2)) / d.n1) : null,
    // Passo 2: usos concorrentes e o que já opera.
    perda_usos_m3: r0(d.n2 - d.n3a),
    usos_bagaco_m3: r0(m.uso.bagaco ?? 0), usos_citros_m3: r0(m.uso.citros ?? 0), usos_cafe_m3: r0(m.uso.cafe ?? 0), usos_outros_m3: r0(m.uso.outros ?? 0),
    ja_em_uso_m3: r0(d.exist), ja_em_uso_rsu_m3: r0(m.exist.RSU_ORGANICO ?? 0),
    // Passo 3: estocagem e logística.
    perda_estrada_m3: r0(d.n3 - d.n4),
    perda_estrada_pct: d.n3 > 0 ? r1((100 * (d.n3 - d.n4)) / d.n3) : null,
    estrada_cana_m3: r0(m.estrada.cana ?? 0), estrada_lavouras_m3: r0(m.estrada.lavouras ?? 0), estrada_pecuaria_m3: r0(m.estrada.pecuaria ?? 0), estrada_urbano_m3: r0(m.estrada.urbano ?? 0),
    // Cenários (N4).
    n4_min_m3: r0(m.min.n4), n4_max_m3: r0(m.max.n4),
    n3_min_m3: r0(m.min.n3), n3_max_m3: r0(m.max.n3),
    // Largura da faixa entre os cenários, em vezes o valor de referência: (máx − mín) / ref.
    faixa_n4_rel: d.n4 > 0 ? Math.round(((m.max.n4 - m.min.n4) / d.n4) * 100) / 100 : null,
  });
}
linhas.sort((a, z) => a.NM_MUN.localeCompare(z.NM_MUN, 'pt-BR'));

/* ------------------------------------------------------------------ totais e resumos */
const tot = (k) => soma(linhas.map((l) => l[k]));
const cen = Object.fromEntries(['min', 'med', 'max'].map((s) => [s, Object.fromEntries(Object.keys(vazio()).map((k) => [k, soma([...mun.values()].map((m) => m[s][k]))]))]));
const substratos = [...sub.values()].map((x) => ({
  cenario: x.cenario, substrato: x.substrato, grupo: x.grupo,
  n1_m3: r0(x.n1), n2_m3: r0(x.n2), n3_antes_do_uso_existente_m3: r0(x.n3a), ja_em_uso_m3: r0(x.exist), n3_m3: r0(x.n3), n4_m3: r0(x.n4),
  retencao_pct: x.n1 > 0 ? r1((100 * x.n4) / x.n1) : null,
})).sort((a, z) => (a.cenario === z.cenario ? z.n1_m3 - a.n1_m3 : ['min', 'med', 'max'].indexOf(a.cenario) - ['min', 'med', 'max'].indexOf(z.cenario)));
const subMed = substratos.filter((s) => s.cenario === 'med');
const top = (k, n = 8, f = () => true) => [...linhas].filter(f).sort((a, z) => z[k] - a[k]).slice(0, n).map((l) => ({ CD_MUN: l.CD_MUN, NM_MUN: l.NM_MUN, v: l[k], NM_RGINT: l.NM_RGINT }));
const regioes = [...NOME_RGINT].map(([cd, nome]) => {
  const ls = linhas.filter((l) => l.CD_RGINT === cd);
  const s = (k) => soma(ls.map((l) => l[k]));
  return { CD_RGINT: cd, NM_RGINT: nome, n1_m3: s('n1_m3'), n2_m3: s('n2_m3'), n3_m3: s('n3_m3'), n4_m3: s('n4_m3'), n4_min_m3: s('n4_min_m3'), n4_max_m3: s('n4_max_m3'), retencao_pct: r1((100 * s('n4_m3')) / s('n1_m3')) };
}).sort((a, z) => z.retencao_pct - a.retencao_pct);
// Por grupo de resíduo, nos três cenários (N4).
const grupos = ['cana', 'lavouras', 'pecuaria', 'urbano'].map((g) => {
  const o = { g };
  for (const s of ['min', 'med', 'max']) { o[`n1_${s}`] = soma(substratos.filter((x) => x.cenario === s && x.grupo === g).map((x) => x.n1_m3)); o[s] = soma(substratos.filter((x) => x.cenario === s && x.grupo === g).map((x) => x.n4_m3)); }
  return o;
});
const quantil = (vs, p) => { const a = vs.filter((v) => v !== null).sort((x, y) => x - y); return a[Math.min(a.length - 1, Math.floor(p * (a.length - 1)))]; };
const ret = linhas.map((l) => l.retencao_pct);

const c = {
  versao, cen, substratos: subMed, grupos, regioes,
  T: {
    coleta: tot('perda_coleta_m3'), coleta_palha_cana: tot('coleta_palha_cana_m3'), coleta_esterco_pasto: tot('coleta_esterco_pasto_m3'), coleta_palha_graos: tot('coleta_palha_graos_m3'), coleta_outros: tot('coleta_outros_m3'),
    usos: tot('perda_usos_m3'), usos_bagaco: tot('usos_bagaco_m3'), usos_citros: tot('usos_citros_m3'), usos_cafe: tot('usos_cafe_m3'), usos_outros: tot('usos_outros_m3'),
    ja_em_uso: tot('ja_em_uso_m3'), ja_em_uso_rsu: tot('ja_em_uso_rsu_m3'),
    estrada: tot('perda_estrada_m3'), estrada_cana: tot('estrada_cana_m3'), estrada_lavouras: tot('estrada_lavouras_m3'), estrada_pecuaria: tot('estrada_pecuaria_m3'), estrada_urbano: tot('estrada_urbano_m3'),
    n4_biometano_m3_dia: tot('n4_biometano_m3_dia'),
  },
  ret_quantis: { p05: quantil(ret, 0.05), p25: quantil(ret, 0.25), p50: quantil(ret, 0.5), p75: quantil(ret, 0.75), p95: quantil(ret, 0.95) },
  n_sem_n4: linhas.filter((l) => l.n4_m3 === 0).length,
  top_n1: top('n1_m3'), top_n4: top('n4_m3'), top_coleta: top('perda_coleta_m3'), top_usos: top('perda_usos_m3'), top_exist: top('ja_em_uso_m3'),
  top_estrada: top('perda_estrada_m3'), top_estrada_pct: top('perda_estrada_pct', 8, (l) => l.n3_m3 > 5e6),
  top_ret: top('retencao_pct', 8, (l) => l.n1_m3 > 2e7), baixo_ret: [...linhas].filter((l) => l.n1_m3 > 2e7).sort((a, z) => a.retencao_pct - z.retencao_pct).slice(0, 8).map((l) => ({ CD_MUN: l.CD_MUN, NM_MUN: l.NM_MUN, v: l.retencao_pct, n1: l.n1_m3 })),
  top_faixa: top('faixa_n4_rel', 8, (l) => l.n4_m3 > 1e6),
  faixa_quantis: { p05: quantil(linhas.map((l) => l.faixa_n4_rel), 0.05), p50: quantil(linhas.map((l) => l.faixa_n4_rel), 0.5), p95: quantil(linhas.map((l) => l.faixa_n4_rel), 0.95) },
  pontos: Object.fromEntries([...ponto].map(([cd, p]) => [cd, p.map((v) => Math.round(v * 1e4) / 1e4)])),
  linhas,
};
gravarCache('funil-sp', c);
const bi = (v) => Math.round(v / 1e7) / 100;
console.log({
  versao,
  cenarios: Object.fromEntries(Object.entries(cen).map(([s, o]) => [s, Object.fromEntries(Object.entries(o).map(([k, v]) => [k, bi(v)]))])),
  passos_bi: Object.fromEntries(Object.entries(c.T).map(([k, v]) => [k, k.endsWith('dia') ? r0(v) : bi(v)])),
  ret_quantis: c.ret_quantis, n_sem_n4: c.n_sem_n4,
  grupos: grupos.map((g) => `${g.g}: N1 ${bi(g.n1_med)} · N4 ${bi(g.min)}/${bi(g.med)}/${bi(g.max)}`),
  regioes: regioes.map((r) => `${r.NM_RGINT} ${r.retencao_pct}% (${bi(r.n1_m3)}→${bi(r.n4_m3)})`),
  top_n1: c.top_n1.map((t) => `${t.NM_MUN} ${bi(t.v)}`), top_n4: c.top_n4.map((t) => `${t.NM_MUN} ${bi(t.v)}`),
  top_coleta: c.top_coleta.map((t) => `${t.NM_MUN} ${bi(t.v)}`), top_usos: c.top_usos.map((t) => `${t.NM_MUN} ${bi(t.v)}`),
  top_exist: c.top_exist.map((t) => `${t.NM_MUN} ${r0(t.v / 1e6)} mi`), top_estrada_pct: c.top_estrada_pct.map((t) => `${t.NM_MUN} ${t.v}%`),
  top_ret: c.top_ret.map((t) => `${t.NM_MUN} ${t.v}%`), baixo_ret: c.baixo_ret.map((t) => `${t.NM_MUN} ${t.v}% (${bi(t.n1)})`),
  top_faixa: c.top_faixa.map((t) => `${t.NM_MUN} ${t.v}x`), faixa_quantis: c.faixa_quantis,
  substratos: c.substratos.map((s) => `${s.substrato} ${bi(s.n1_m3)}→${bi(s.n4_m3)} (${s.retencao_pct}%)`),
});

/* ------------------------------------------------------------------ GeoPackage e CSV */
const rot = (lim, suf) => [0, ...lim].map((a, i) => (i === 0 ? `até ${lim[0]}${suf}` : i === lim.length ? `mais de ${a}${suf}` : `${a} a ${lim[i]}${suf}`));
const regrasPct = (campo, lim, cores, suf = ' %') => {
  const rs = rot(lim, suf);
  return [0, ...lim].map((a, i) => [i === 0 ? `"${campo}" <= ${lim[0]}` : i === lim.length ? `"${campo}" > ${a}` : `"${campo}" > ${a} AND "${campo}" <= ${lim[i]}`, rs[i], cores[i]]);
};
const regrasPoligono = (rs) => rs.map(([f, r, cor]) => [f, r, preenchimento(cor, '#ffffff', 0.05)]);
const LIM_USOS = [1e6, 5e6, 2e7, 5e7, 1e8, Math.max(...linhas.map((l) => l.perda_usos_m3))];
const LIM_N4 = [1e6, 5e6, 1e7, 2e7, 4e7, 8e7, Math.max(...linhas.map((l) => l.n4_max_m3))];
c.lim_usos = LIM_USOS; c.lim_n4 = LIM_N4;
gravarCache('funil-sp', c);

const malhaPor = new Map(malha.map((f) => [String(f.properties.CD_MUN), f.geometry]));
const feats = linhas.map((l) => ({ type: 'Feature', properties: l, geometry: malhaPor.get(l.CD_MUN) }));
const camposPt = ['CD_MUN', 'NM_MUN', 'perda_coleta_m3', 'causa_coleta', 'coleta_palha_cana_m3', 'coleta_esterco_pasto_m3', 'coleta_palha_graos_m3', 'coleta_outros_m3'];
const pts = linhas.filter((l) => l.perda_coleta_m3 > 0).map((l) => ({ type: 'Feature', properties: Object.fromEntries(camposPt.map((k) => [k, l[k]])), geometry: { type: 'Point', coordinates: ponto.get(l.CD_MUN) } }));
const maxColeta = Math.max(...pts.map((p) => p.properties.perda_coleta_m3));
const tamColeta = `coalesce(scale_linear(sqrt("perda_coleta_m3"), 0, sqrt(${maxColeta}), 0.6, 10), 0.6)`;
const ROT_COLETA = { palha_cana: 'palha de cana deixada no solo', esterco_pasto: 'esterco de gado no pasto', palha_graos: 'palha de soja e milho', outros: 'outros resíduos' };
const ref = camadasReferencia();
const estilos = {
  municipios: [
    ['retencao', 'Nº 116 · Parte do potencial teórico (N1) que chega ao acessível (N4), %', estiloRegras('poligono', regrasPoligono(regrasPct('retencao_pct', LIM_RET, CORES_RET))), true],
    ['usos_concorrentes', 'Nº 118 · Metano que já tem outro destino (N2 − N3), m³/ano', estiloGraduado('perda_usos_m3', LIM_USOS, CORES_USOS, { casas: 0 }), false],
    ['logistica', 'Nº 119 · Perda na estocagem e no transporte (N3 → N4), %', estiloRegras('poligono', regrasPoligono(regrasPct('perda_estrada_pct', LIM_ESTRADA, CORES_ESTRADA))), false],
    ['n4_min', 'Nº 120 · N4, cenário mínimo, m³/ano', estiloGraduado('n4_min_m3', LIM_N4, CORES_N4, { casas: 0 }), false],
    ['n4_ref', 'Nº 120 · N4, cenário de referência, m³/ano', estiloGraduado('n4_m3', LIM_N4, CORES_N4, { casas: 0 }), false],
    ['n4_max', 'Nº 120 · N4, cenário máximo, m³/ano', estiloGraduado('n4_max_m3', LIM_N4, CORES_N4, { casas: 0 }), false],
  ],
  perda_na_coleta: [['coleta', 'Nº 117 · Metano que fica no campo (N1 − N2), m³/ano, pela maior causa',
    estiloRegras('ponto', Object.entries(CORES_COLETA).map(([k, cor]) => [`"causa_coleta" = '${k}'`, ROT_COLETA[k], marcador(cor, 3, { tamanhoExpr: tamColeta })]), { ordem: '"perda_coleta_m3" DESC' }), true]],
  ...ref.estilos,
};
mkdirSync(PASTA.funil, { recursive: true });
const arq = join(PASTA.funil, 'sp_funil_biometano.gpkg');
await gravarGpkg(arq, {
  municipios: { feats, campos: Object.keys(linhas[0]) },
  perda_na_coleta: { feats: pts, campos: camposPt },
  ...ref.camadas,
}, estilos);
const z = zipar(arq);
const csvM = join(PASTA.funil, 'sp_funil_municipios.csv');
gravarCsv(csvM, linhas);
const csvS = join(PASTA.funil, 'sp_funil_substratos.csv');
gravarCsv(csvS, substratos);
for (const t of ['campo', 'caldeira', 'estrada', 'cenarios']) {
  mkdirSync(PASTA[t], { recursive: true });
  copyFileSync(csvM, join(PASTA[t], 'sp_funil_municipios.csv'));
}
copyFileSync(csvS, join(PASTA.cenarios, 'sp_funil_substratos.csv'));
console.log(`✓ ${z} · ${mb(tamanho(z))} · municípios ${kb(tamanho(csvM))} · substratos ${kb(tamanho(csvS))}`);
console.log({ lim_usos: LIM_USOS, lim_n4: LIM_N4 });
