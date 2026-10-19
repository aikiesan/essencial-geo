#!/usr/bin/env node
/**
 * Coleção «Mulheres responsáveis pelo domicílio» (mulheres-responsaveis-sp) — prepara os dados das pranchas 103 a 110 (uso interno).
 *
 *   node scripts/colecoes/mulheres-responsaveis-sp/sidra.mjs                                (1) tabelas municipais do SIDRA
 *   node --max-old-space-size=8192 scripts/colecoes/mulheres-responsaveis-sp/base.mjs       (2) base por município e APOND
 *   node --max-old-space-size=8192 scripts/colecoes/mulheres-responsaveis-sp/analise.mjs    (3) estatística
 *   node --max-old-space-size=8192 scripts/colecoes/mulheres-responsaveis-sp/preparar.mjs [dados|gpkg ...]
 *
 * Cada prancha é um mapa só. O cache traz, por município, os indicadores e as classes de cada mapa; por APOND, a
 * geometria simplificada e a parte de responsáveis mulheres; e os números dos painéis.
 */
import { join } from 'node:path';
import { readFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { RAIZ, BRUTOS, gravarCache, gravarGpkg, gravarCsv, lerCsv, zipar, tamanho, mb, lerGpkg, simplificar, pontoInterno } from '../lib/dados.mjs';
import { NOME_MUN, RGINT_MUN, NOME_RGINT, malhaMunicipios, camadasReferencia } from '../lib/cruzamentos.mjs';
import { estiloGraduado, estiloRegras, preenchimento, hachura } from '../lib/estilos-qgis.mjs';

const MAPAS = join(RAIZ, 'mapas');
const DIR = join(BRUTOS, 'analises', 'mulheres');
export const SERIE = JSON.parse(readFileSync(join(RAIZ, 'scripts', 'colecoes', 'mulheres-responsaveis-sp', 'serie.json'), 'utf8'));
const PASTA = Object.fromEntries(SERIE.map((s) => [s.tema, s.pasta]));

/* ------------------------------------------------------------------ classes e cores (exportadas para a prancha) */
/** Sequencial lilás (responsáveis mulheres) e ocre (cônjuge); divergente para as diferenças mulheres − homens. */
export const LILAS = ['#f3eff6', '#ddd0e6', '#c4add6', '#a585bf', '#835ea3', '#5f3d80'];
export const OCRE = ['#f6f0e1', '#e8d7ad', '#d5b874', '#b8934a', '#8d6a2f'];
export const LIM_F = [40, 44, 48, 52, 56];
export const LIM_VAR = [5, 10, 15, 20];
export const COR_VAR = ['#ddd0e6', '#c4add6', '#a585bf', '#835ea3', '#5f3d80'];
export const COR_QUEDA = '#c8b35a';
export const LIM_CONJ = [40, 45, 50, 55];
// Diferença (pp): abaixo de −1, de −1 a 1, 1 a 5, 5 a 10, 10 a 20, 20 ou mais.
export const LIM_DIF = [-1, 1, 5, 10, 20];
export const COR_DIF = ['#b8934a', '#eef0f1', '#ddd0e6', '#c4add6', '#9972af', '#6b4a8c'];
export const LIM_LUZ = [1, 2, 5, 10];
export const COR_LUZ = ['#f2efe6', '#e2d8bd', '#c9b37d', '#a68647', '#6f5527'];
export const BIV = [
  ['#e8e8e8', '#e4d9ac', '#c8b35a'],
  ['#cbb8d7', '#c8ada0', '#af8e53'],
  ['#9972af', '#976b82', '#804d36'],
];
export const classe = (v, lim) => { let i = 0; while (i < lim.length && v >= lim[i] - 1e-9) i++; return i; };

const r2 = (v) => (v == null || !Number.isFinite(v) ? null : Math.round(v * 100) / 100);
const ter = (v) => { const a = [...v].sort((x, y) => x - y); return [a[Math.floor(a.length / 3)], a[Math.floor((2 * a.length) / 3)]]; };
const terco = (v, t) => (v < t[0] ? 0 : v < t[1] ? 1 : 2);

/* ------------------------------------------------------------------ dados */
async function dados() {
  const MUN = Object.values(JSON.parse(readFileSync(join(DIR, 'municipios-sidra.json'), 'utf8')));
  const E = JSON.parse(readFileSync(join(DIR, 'estatistica.json'), 'utf8'));

  // Variação 2010–2022 com o mesmo universo (domicílios particulares permanentes ocupados): soma dos setores em 2022.
  for (const o of MUN) {
    o.CD_MUN = o.cd; o.NM_MUN = NOME_MUN.get(o.cd); o.CD_RGINT = RGINT_MUN.get(o.cd); o.NM_RGINT = NOME_RGINT.get(o.CD_RGINT);
    o.var_resp_mulher = o.pct_resp_mulher != null && o.pct_resp_mulher_2010 != null ? o.pct_resp_mulher - o.pct_resp_mulher_2010 : null;
    o.pct_sem_iluminacao = o.pct_iluminacao != null ? 100 - o.pct_iluminacao : null;
    // Síntese: média das diferenças dentro do setor nos três serviços de rede (água, esgoto, lixo).
    const ds = ['agua_rede', 'esgoto_rede', 'lixo_coletado'].map((s) => o[`${s}_dif_setor`]);
    o.dif_setor_media = ds.every((v) => v != null) ? ds.reduce((a, b) => a + b, 0) / 3 : null;
    const dt = ['agua_rede', 'esgoto_rede', 'lixo_coletado'].map((s) => o[`${s}_dif`]);
    o.dif_media = dt.every((v) => v != null) ? dt.reduce((a, b) => a + b, 0) / 3 : null;
  }
  // 109: terços de responsáveis mulheres (x) e da razão de renda mulheres/homens (y).
  const okR = MUN.filter((o) => o.pct_resp_mulher != null && o.razao_renda_sexo != null);
  const tx = ter(okR.map((o) => o.pct_resp_mulher)), ty = ter(okR.map((o) => o.razao_renda_sexo));
  const casas = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const o of okR) { const a = terco(o.razao_renda_sexo, ty), b = terco(o.pct_resp_mulher, tx); o.b109 = 10 * (b + 1) + (a + 1); casas[a][b]++; }
  const lisaR = E.lisas['municipios|pct_resp_mulher|razao_renda_sexo'];
  const lisaF = E.lisas['municipios|pct_resp_mulher|pct_resp_mulher'];
  for (const o of MUN) { o.lisa109 = lisaR.classe[o.cd] ?? null; o.lisa103 = lisaF.classe[o.cd] ?? null; }

  // Estado: somas.
  const soma = (k) => MUN.reduce((t, o) => t + (o[k] ?? 0), 0);
  const est = { domM: soma('dom_resp_homem'), domF: soma('dom_resp_mulher') };
  est.pct = (100 * est.domF) / (est.domM + est.domF);
  const S = JSON.parse(readFileSync(join(BRUTOS, 'ibge', 'sidra-sp', 'mulheres', 'indicadores.json'), 'utf8'));
  const somaS = (re) => Object.values(S).reduce((t, o) => t + Object.entries(o).filter(([k]) => re.test(k)).reduce((u, [, v]) => u + (v ?? 0), 0), 0);
  est.f2010 = somaS(/^resp_sexo_2010\|96\|.*11561:100681/); est.t2010 = somaS(/^resp_sexo_2010\|96\|.*11561:0(\/|$)/);
  est.pct2010 = (100 * est.f2010) / est.t2010;
  const cf = (cat, sx) => somaS(new RegExp(`^conjuge_filhos\\|800\\|1887:${cat}/11561:${sx}$`));
  est.sidraF = cf(72603, 100681); est.sidraT = cf(72603, 100679); est.sidraM = cf(72603, 100680);
  est.f_conjuge = (100 * (cf(72604, 100681) + cf(72605, 100681) + cf(72606, 100681))) / est.sidraF;
  est.m_conjuge = (100 * (cf(72604, 100680) + cf(72605, 100680) + cf(72606, 100680))) / est.sidraM;
  est.f_sem_conjuge_filhos = (100 * cf(72607, 100681)) / est.sidraF;
  est.f_outras = (100 * cf(72608, 100681)) / est.sidraF;
  est.f_conjuge_sem_filhos = (100 * cf(72604, 100681)) / est.sidraF;
  est.m_sem_conjuge_filhos = (100 * cf(72607, 100680)) / est.sidraM;
  est.monoparental_mulher_share = (100 * cf(72607, 100681)) / (cf(72607, 100681) + cf(72607, 100680));
  est.energia2010 = (100 * somaS(/^energia_2010\|96\|.*309:3011/)) / somaS(/^energia_2010\|96\|.*309:0(\/|$)/);
  est.sem_energia2010 = somaS(/^energia_2010\|96\|.*309:3018/);
  est.ilum_tot = somaS(/^iluminacao\|9599\|14:200\//); est.ilum_sim = somaS(/^iluminacao\|9599\|14:72254\//); est.ilum_nao = somaS(/^iluminacao\|9599\|14:72255\//);
  // Serviços no estado, com a decomposição.
  for (const s of ['agua_rede', 'agua_dentro', 'esgoto_rede', 'lixo_coletado', 'banheiro']) {
    const semH = soma(`${s}_sem_homem`), semM = soma(`${s}_sem_mulher`);
    est[s] = { sem_homem: semH, sem_mulher: semM };
  }
  console.log('estado', est);

  // Destaques para as chamadas.
  const com = (k, f = () => true) => MUN.filter((o) => o[k] != null && f(o));
  const ord = (k, s = -1, f) => [...com(k, f)].sort((a, b) => s * (a[k] - b[k]));
  const p5 = (o) => o.pessoas >= 5000, p20 = (o) => o.pessoas >= 20000, p50 = (o) => o.pessoas >= 50000;
  const ver = (rot, l, ks) => console.log(rot, l.slice(0, 6).map((o) => `${o.NM_MUN} (${ks.map((k) => (typeof o[k] === 'number' ? o[k].toFixed(1) : o[k])).join(' · ')}; ${o.pessoas})`).join(' | '));
  ver('f alto ≥20k', ord('pct_resp_mulher', -1, p20), ['pct_resp_mulher']);
  ver('f baixo ≥20k', ord('pct_resp_mulher', 1, p20), ['pct_resp_mulher']);
  ver('f alto', ord('pct_resp_mulher', -1), ['pct_resp_mulher']);
  ver('f baixo', ord('pct_resp_mulher', 1), ['pct_resp_mulher']);
  ver('var alta ≥20k', ord('var_resp_mulher', -1, p20), ['var_resp_mulher', 'pct_resp_mulher_2010', 'pct_resp_mulher']);
  ver('var baixa', ord('var_resp_mulher', 1), ['var_resp_mulher', 'pct_resp_mulher_2010', 'pct_resp_mulher']);
  ver('conj alto ≥20k', ord('pct_mulher_com_conjuge', -1, p20), ['pct_mulher_com_conjuge', 'pct_resp_mulher']);
  ver('conj baixo ≥20k', ord('pct_mulher_com_conjuge', 1, p20), ['pct_mulher_com_conjuge', 'pct_resp_mulher']);
  ver('esgoto dif alto ≥20k', ord('esgoto_rede_dif', -1, p20), ['esgoto_rede_dif', 'esgoto_rede_dif_composicao', 'esgoto_rede_dif_setor', 'pct_urbana']);
  ver('esgoto dif negativo', ord('esgoto_rede_dif', 1), ['esgoto_rede_dif', 'esgoto_rede_dif_lo', 'esgoto_rede_dif_hi']);
  ver('agua dif alto ≥20k', ord('agua_rede_dif', -1, p20), ['agua_rede_dif', 'agua_rede_dif_composicao', 'agua_rede_dif_setor', 'pct_urbana']);
  ver('agua dif negativo', ord('agua_rede_dif', 1), ['agua_rede_dif', 'agua_rede_dif_lo', 'agua_rede_dif_hi']);
  ver('sem luz alto ≥5k', ord('pct_sem_iluminacao', -1, p5), ['pct_sem_iluminacao', 'cobertura_entorno']);
  ver('razão renda alta ≥20k', ord('razao_renda_sexo', -1, p20), ['razao_renda_sexo', 'pct_resp_mulher']);
  ver('razão renda baixa ≥20k', ord('razao_renda_sexo', 1, p20), ['razao_renda_sexo', 'pct_resp_mulher']);
  ver('dif setor alta', ord('dif_setor_media', -1), ['dif_setor_media', 'dif_media']);
  ver('dif setor baixa', ord('dif_setor_media', 1), ['dif_setor_media', 'dif_media']);
  const SP = MUN.find((o) => o.cd === '3550308');
  console.log('capital', ['pct_resp_mulher', 'pct_resp_mulher_2010', 'var_resp_mulher', 'pct_mulher_com_conjuge', 'esgoto_rede_dif', 'agua_rede_dif', 'pct_sem_iluminacao', 'razao_renda_sexo', 'dif_setor_media'].map((k) => `${k} ${SP[k]?.toFixed?.(2)}`).join(' · '));

  // APOND: geometria simplificada e parte de responsáveis mulheres.
  const AP = new Map((await lerCsv(join(DIR, 'apond.csv'), { sep: ',' })).map((o) => [o.cd, o]));
  const apGeo = await lerGpkg(join(BRUTOS, 'ibge', 'malhas-sp', 'APONDs2022_35_SP.gpkg'));
  const leve = (g) => ({ type: g.type, coordinates: JSON.parse(JSON.stringify(g.coordinates), (k, v) => (typeof v === 'number' ? Math.round(v * 1e4) / 1e4 : v)) });
  const apFeats = [], apLinhas = [];
  for (const f of apGeo) {
    const cd = f.properties.cd_apond, o = AP.get(cd) ?? {};
    const n = (k) => (o[k] === '' || o[k] == null ? null : Number(o[k]));
    const linha = {
      CD_APOND: cd, CD_MUN: f.properties.CD_MUN, NM_MUN: f.properties.NM_MUN, pessoas: n('pessoas'), dom: n('dom'),
      dom_resp_mulher: n('dom_resp_mulher') == null ? null : Math.round(n('dom_resp_mulher')), pct_resp_mulher: n('pct_resp_mulher'),
      pct_urbana: n('pct_urbana'), renda_resp_media: n('renda_resp_media'),
      esgoto_rede_dif: n('esgoto_rede_dif'), esgoto_rede_dif_setor: n('esgoto_rede_dif_setor'), agua_rede_dif: n('agua_rede_dif'), agua_rede_dif_setor: n('agua_rede_dif_setor'),
    };
    apLinhas.push(linha);
    apFeats.push({ type: 'Feature', properties: linha, geometry: simplificar(f.geometry, 0.0002) });
  }
  const apComF = apLinhas.filter((o) => o.pct_resp_mulher != null);
  const nAp = new Array(LIM_F.length + 1).fill(0);
  for (const o of apComF) nAp[classe(o.pct_resp_mulher, LIM_F)]++;
  const apOrd = [...apComF].filter((o) => o.pessoas >= 5000).sort((a, b) => b.pct_resp_mulher - a.pct_resp_mulher);
  const ptAp = (cd) => pontoInterno(apGeo.find((f) => f.properties.cd_apond === cd).geometry);
  console.log('APOND alto', apOrd.slice(0, 6).map((o) => `${o.CD_APOND} ${o.NM_MUN} ${o.pct_resp_mulher} (${o.pessoas})`).join(' | '));
  console.log('APOND baixo', apOrd.slice(-6).map((o) => `${o.CD_APOND} ${o.NM_MUN} ${o.pct_resp_mulher} (${o.pessoas})`).join(' | '));
  const apAlta = { ...apOrd[0], pt: ptAp(apOrd[0].CD_APOND) }, apBaixa = { ...apOrd.at(-1), pt: ptAp(apOrd.at(-1).CD_APOND) };

  // Contagens por classe nos mapas municipais.
  const conta = (k, lim) => { const n = new Array(lim.length + 1).fill(0); for (const o of com(k)) n[classe(o[k], lim)]++; return n; };
  const cont = {
    var: conta('var_resp_mulher', LIM_VAR), queda: com('var_resp_mulher').filter((o) => o.var_resp_mulher < 0).length,
    conj: conta('pct_mulher_com_conjuge', LIM_CONJ),
    esgoto: conta('esgoto_rede_dif', LIM_DIF), agua: conta('agua_rede_dif', LIM_DIF), setor: conta('dif_setor_media', LIM_DIF),
    luz: conta('pct_sem_iluminacao', LIM_LUZ), luzZero: com('pct_sem_iluminacao').filter((o) => o.pct_sem_iluminacao === 0).length,
    f: conta('pct_resp_mulher', LIM_F), apond: nAp,
  };
  console.log('contagens', cont);

  const testes = Object.fromEntries(E.testes.map((t) => [`${t.nivel}|${t.x}|${t.y}`, t]));
  const estServ = JSON.parse(readFileSync(join(DIR, 'estado.json'), 'utf8'));
  const c = {
    est, estServ, mun: MUN.map((o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === 'number' ? r2(v) : v]))), cont, testes, resumo: E.resumo,
    biv: { tx, ty, casas, lisa: lisaR.cont, I: lisaR.I, pI: lisaR.pI }, lisaF: { cont: lisaF.cont, I: lisaF.I },
    apond: { feats: apFeats.map((f) => ({ type: 'Feature', properties: { f: f.properties.pct_resp_mulher }, geometry: leve(f.geometry) })), alta: apAlta, baixa: apBaixa, n: apComF.length, sem: apLinhas.length - apComF.length },
  };
  gravarCache('mulheres-responsaveis-sp', c);
  return { ...c, apFeats };
}

/* ------------------------------------------------------------------ gpkg */
const COLUNAS = ['pct_resp_mulher', 'pct_resp_mulher_lo', 'pct_resp_mulher_hi', 'dom_resp_homem', 'dom_resp_mulher', 'pct_resp_mulher_2010', 'var_resp_mulher',
  'pct_mulher_com_conjuge', 'pct_homem_com_conjuge', 'pct_mulher_sem_conjuge_filhos',
  ...['agua_rede', 'agua_dentro', 'esgoto_rede', 'lixo_coletado', 'banheiro'].flatMap((s) => [`${s}_homem`, `${s}_mulher`, `${s}_dif`, `${s}_dif_lo`, `${s}_dif_hi`, `${s}_dif_composicao`, `${s}_dif_setor`]),
  'dif_media', 'dif_setor_media', 'pct_iluminacao', 'pct_sem_iluminacao', 'cobertura_entorno', 'renda_homens', 'renda_mulheres', 'razao_renda_sexo',
  'renda_resp_media', 'pct_urbana', 'b109', 'lisa109', 'lisa103'];
const CAMPOS = ['CD_MUN', 'NM_MUN', 'CD_RGINT', 'NM_RGINT', 'pessoas', 'dom', ...COLUNAS];
const CAMPOS_AP = ['CD_APOND', 'CD_MUN', 'NM_MUN', 'pessoas', 'dom', 'dom_resp_mulher', 'pct_resp_mulher', 'pct_urbana', 'renda_resp_media', 'esgoto_rede_dif', 'esgoto_rede_dif_setor', 'agua_rede_dif', 'agua_rede_dif_setor'];

function estiloBiv(campo, [rx, ry]) {
  const n = ['baixo', 'médio', 'alto'];
  const itens = [];
  for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) itens.push([`"${campo}" = ${10 * (b + 1) + (a + 1)}`, `${rx} ${n[b]} · ${ry} ${n[a]}`, preenchimento(BIV[a][b], '#ffffff', 0.2)]);
  itens.push([`"${campo}" IS NULL`, 'sem informação', hachura()]);
  return estiloRegras('poligono', itens);
}
const difRot = ['mulheres com menos de 1 pp a menos', '−1 a 1 pp', '1 a 5 pp a mais', '5 a 10 pp a mais', '10 a 20 pp a mais', '20 pp ou mais a mais'];

async function gpkg(c) {
  const por = new Map(c.mun.map((o) => [o.CD_MUN, o]));
  const feats = malhaMunicipios().map((f) => {
    const o = por.get(String(f.properties.CD_MUN));
    return { type: 'Feature', geometry: f.geometry, properties: Object.fromEntries(CAMPOS.map((k) => [k, o?.[k] ?? null])) };
  });
  const apFeats = c.apFeats;
  const ref = camadasReferencia();
  const N = Object.fromEntries(SERIE.map((s) => [s.tema, String(s.numero).padStart(3, '0')]));
  const estilos = {
    municipios: [
      ['var_resp_mulher', `Nº ${N.crescimento} · Variação da parte de responsáveis mulheres, 2010–2022 (pontos percentuais)`, estiloGraduado('var_resp_mulher', [...LIM_VAR, 100], COR_VAR, { casas: 0, sufixo: ' pp', inferior: 0 }), true],
      ['pct_mulher_com_conjuge', `Nº ${N.conjuge} · Responsáveis mulheres que vivem com cônjuge (%)`, estiloGraduado('pct_mulher_com_conjuge', [...LIM_CONJ, 100], OCRE, { casas: 0, sufixo: ' %' }), false],
      ['esgoto_rede_dif', `Nº ${N.esgoto} · Esgoto na rede: mulheres − homens responsáveis (pp)`, estiloRegras('poligono', LIM_DIF.concat(Infinity).map((l, i) => [i === 0 ? `"esgoto_rede_dif" < ${l}` : `"esgoto_rede_dif" >= ${LIM_DIF[i - 1]}${Number.isFinite(l) ? ` AND "esgoto_rede_dif" < ${l}` : ''}`, difRot[i], preenchimento(COR_DIF[i], '#ffffff', 0.2)])), false],
      ['agua_rede_dif', `Nº ${N.agua} · Água da rede geral: mulheres − homens responsáveis (pp)`, estiloRegras('poligono', LIM_DIF.concat(Infinity).map((l, i) => [i === 0 ? `"agua_rede_dif" < ${l}` : `"agua_rede_dif" >= ${LIM_DIF[i - 1]}${Number.isFinite(l) ? ` AND "agua_rede_dif" < ${l}` : ''}`, difRot[i], preenchimento(COR_DIF[i], '#ffffff', 0.2)])), false],
      ['pct_sem_iluminacao', `Nº ${N.iluminacao} · Domicílios sem iluminação pública na face de quadra (%)`, estiloGraduado('pct_sem_iluminacao', [...LIM_LUZ, 100], COR_LUZ, { casas: 0, sufixo: ' %' }), false],
      ['b109', `Nº ${N.renda} · Responsáveis mulheres × razão de renda mulheres/homens, em terços`, estiloBiv('b109', ['responsáveis mulheres', 'razão de renda']), false],
      ['dif_setor_media', `Nº ${N.sintese} · Diferença dentro do setor, média de água, esgoto e lixo (pp)`, estiloRegras('poligono', LIM_DIF.concat(Infinity).map((l, i) => [i === 0 ? `"dif_setor_media" < ${l}` : `"dif_setor_media" >= ${LIM_DIF[i - 1]}${Number.isFinite(l) ? ` AND "dif_setor_media" < ${l}` : ''}`, difRot[i], preenchimento(COR_DIF[i], '#ffffff', 0.2)])), false],
    ],
    apond: [['pct_resp_mulher', `Nº ${N.distribuicao} · Domicílios com responsável mulher (%)`, estiloGraduado('pct_resp_mulher', [...LIM_F, 100], LILAS, { casas: 0, sufixo: ' %' }), true]],
    ...ref.estilos,
  };
  const dir = join(MAPAS, PASTA.distribuicao, 'dados');
  mkdirSync(dir, { recursive: true });
  const arq = join(dir, 'sp_mulheres_responsaveis_2022.gpkg');
  await gravarGpkg(arq, { municipios: { feats, campos: CAMPOS }, apond: { feats: apFeats, campos: CAMPOS_AP }, ...ref.camadas }, estilos);
  const zip = zipar(arq);
  const csv = join(dir, 'sp_mulheres_responsaveis_municipios_2022.csv');
  gravarCsv(csv, c.mun.map((o) => Object.fromEntries(CAMPOS.map((k) => [k, o[k]]))), CAMPOS);
  for (const p of Object.values(PASTA).slice(1)) {
    mkdirSync(join(MAPAS, p, 'dados'), { recursive: true });
    copyFileSync(csv, join(MAPAS, p, 'dados', 'sp_mulheres_responsaveis_municipios_2022.csv'));
  }
  const csvAp = join(dir, 'sp_mulheres_responsaveis_apond_2022.csv');
  gravarCsv(csvAp, apFeats.map((f) => f.properties), CAMPOS_AP);
  console.log(`✓ ${zip} · ${mb(tamanho(zip))} · CSV ${mb(tamanho(csv))} · APOND ${mb(tamanho(csvAp))}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const cmds = process.argv.slice(2);
  const fazer = cmds.length ? cmds : ['dados', 'gpkg'];
  let c = null;
  if (fazer.includes('dados')) c = await dados();
  if (fazer.includes('gpkg')) {
    if (!c) { console.error('o gpkg precisa de "dados" na mesma chamada (geometria das APOND)'); process.exit(1); }
    await gpkg(c);
  }
}
