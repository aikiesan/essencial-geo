#!/usr/bin/env node
/**
 * Coleção «Saneamento e biometano» (saneamento-sp) — prepara os dados das pranchas 051 a 054 (uso interno).
 *
 *   node scripts/colecoes/saneamento-sp/preparar.mjs [esgoto|destino|lixo|municipios|gpkg ...]
 *
 * Censo 2022, agregados por setor (dados-brutos/ibge/sp, de censo-extrair-sp.mjs): destino do esgoto e
 * do lixo dos domicílios particulares permanentes ocupados (DPPO). Totais do estado e dos municípios:
 * SIDRA 6805 (esgotamento) e 6892 (lixo). Potencial de biometano: CP2B v5.1, nível N4, cenário de referência.
 *
 * Sigilo: o IBGE troca por "X" as contagens pequenas de um setor. Nos dados de SP não aparece nenhum
 * 1 nem 2 nas variáveis usadas aqui (o 0 aparece como 0, e o 3 e o 4 aparecem milhares de vezes), então
 * um X vale 1 ou 2. O X nunca vira zero: o setor só recebe uma classe quando ela é a mesma com X = 1 e
 * com X = 2; se a classe depender do valor escondido, o setor fica como "sem informação".
 */
import { join } from 'node:path';
import { mkdirSync, readFileSync } from 'node:fs';
import { RAIZ, gravarCache, gravarGpkg, gravarCsv, zipar, tamanho, mb, soma, quebras } from '../lib/dados.mjs';
import { lerInfo, lerGeo, gradeTema, tabelaCenso, basico } from '../lib/setores-sp.mjs';
import { NOME_MUN, malhaMunicipios, camadasReferencia, cp2b, sidraMun } from '../lib/cruzamentos.mjs';
import { estiloCategorias, estiloGraduado } from '../lib/estilos-qgis.mjs';

const MAPAS = join(RAIZ, 'mapas');
const PASTA = { esgoto: '051-esgoto-na-rede-sp', destino: '052-destino-do-esgoto-sp', lixo: '053-lixo-fora-da-coleta-sp', municipios: '054-saneamento-e-biometano-sp' };

const ESG = { rede: ['V00309'], ligada: ['V00310'], septica: ['V00311'], rudimentar: ['V00312'], vala: ['V00313'], rio: ['V00314'], outra: ['V00315'], sem: ['V00316'] };
const LIXO = { coletado: ['V00397'], cacamba: ['V00398'], queimado: ['V00399'], enterrado: ['V00400'], terreno: ['V00401'], outro: ['V00402'] };
const VARS = [...Object.values(ESG).flat(), ...Object.values(LIXO).flat()];

/** Intervalo [mín, máx] da soma de variáveis com X valendo 1 ou 2. */
function intervalo(o, vs) {
  let lo = 0, hi = 0;
  for (const v of vs) { const x = o[v]; if (x === null) { lo += 1; hi += 2; } else { lo += x; hi += x; } }
  return [lo, hi];
}
const temX = (o, vs) => vs.some((v) => o[v] === null);

/** Classe de uma taxa (%) pelos limites superiores `lim` (fechados à direita); 1..n. */
const classeTaxa = (v, lim) => { let i = 0; while (i < lim.length && v > lim[i] + 1e-9) i++; return i + 1; };

/* ------------------------------------------------------------------ dados por setor */
async function setores() {
  const d2 = await tabelaCenso('domicilio2', VARS);
  const d1 = await tabelaCenso('domicilio1', ['V00001']);
  const b = await basico();
  const out = new Map();
  for (const [cd, bb] of b) {
    const o = d2.get(cd);
    const dppo = d1.get(cd)?.V00001;
    out.set(cd, { cd, b: bb, o: o ?? null, dppo: o ? dppo : 0 });
  }
  return out;
}

const LIM_REDE = [10, 50, 80, 95, 99];
const CORES_REDE = ['#f3ecd4', '#dcd3a6', '#a9bfa6', '#6f9ea6', '#3a6f8c', '#1d3f5e'];
const CORES_FORA = ['#f3ecd4', '#e2c98a', '#c99a52', '#a8653a', '#7a3b2c', '#4a2420'];
const CORES_LODO = ['#e6f0ef', '#b9d6d3', '#82b5b4', '#4f8f95', '#2a6874', '#16414d'];
const LIM_LIXO = [1, 5, 20, 50];
const CORES_LIXO = ['#f1dcb0', '#e2b06a', '#c27a3a', '#9c4a32', '#5e2a22'];
const DESTINOS = [
  ['rede', ['V00309', 'V00310'], '#234e70', 'Rede geral, pluvial ou fossa ligada à rede', 'Mains, storm drain or tank linked to mains'],
  ['septica', ['V00311'], '#7d8a3c', 'Fossa séptica não ligada à rede', 'Septic tank not linked to mains'],
  ['rudimentar', ['V00312'], '#d9a441', 'Fossa rudimentar ou buraco', 'Rudimentary pit or hole'],
  ['aberto', ['V00313', 'V00314', 'V00315'], '#9c4a32', 'Vala, rio, lago, córrego, mar ou outra', 'Ditch, river, lake, stream, sea or other'],
  ['sem', ['V00316'], '#6b3d5c', 'Sem banheiro nem sanitário', 'No bathroom or toilet'],
];

/** Classe (1..6) da parte dos DPPO com esgoto na rede; null = sem informação; 0 = sem DPPO. */
function classeRede(s) {
  if (!s.o) return 0;
  if (!s.dppo) return null;
  const [lo, hi] = intervalo(s.o, ['V00309', 'V00310']);
  const a = classeTaxa((100 * lo) / s.dppo, LIM_REDE);
  const z = classeTaxa((100 * Math.min(hi, s.dppo)) / s.dppo, LIM_REDE);
  return a === z ? a : null;
}

function classeLixo(s) {
  if (!s.o) return -1;
  if (!s.dppo) return null;
  const vs = ['V00399', 'V00400', 'V00401', 'V00402'];
  const [lo, hi] = intervalo(s.o, vs);
  const c = (n) => (n === 0 ? 0 : classeTaxa((100 * n) / s.dppo, LIM_LIXO));
  const a = c(lo), z = c(Math.min(hi, s.dppo));
  return a === z ? a : null;
}

/** Destino predominante: o grupo cujo mínimo passa o máximo de todos os outros; null = indefinido. */
function destinoPredominante(s) {
  if (!s.o) return -1;
  if (!s.dppo) return null;
  const iv = DESTINOS.map(([, vs]) => intervalo(s.o, vs));
  for (let g = 0; g < iv.length; g++) if (iv.every(([, hi], h) => h === g || iv[g][0] > hi)) return g;
  return null;
}

/* ------------------------------------------------------------------ helpers */
function semInfoFeats(lista, geo) {
  return lista.map((cd) => geo[cd]).filter(Boolean).map((g) => ({ type: 'Feature', properties: {}, geometry: g }));
}

/** Arredondamento das coordenadas da hachura (menos bytes na prancha). */
const leve = (fc) => fc.map((f) => ({ ...f, geometry: { type: f.geometry.type, coordinates: JSON.parse(JSON.stringify(f.geometry.coordinates), (k, v) => (typeof v === 'number' ? Math.round(v * 1e4) / 1e4 : v)) } }));

const SIDRA_ESG = () => sidraMun('tabela6805_MUN_35.json');
const SIDRA_LIXO = () => sidraMun('tabela6892_MUN_35.json');
const UF = (arq) => Object.fromEntries(JSON.parse(readFileSync(join(RAIZ, 'dados-brutos', 'ibge', 'sidra-sp', arq), 'utf8')).slice(1).map((r) => [r.D4N, Number(r.V)]));
/** As sete formas de esgotamento que somam o total de DPPO (sem os subtotais da tabela 6805). */
const FORMAS_ESG = ['Rede geral, rede pluvial ou fossa ligada à rede', 'Fossa séptica ou fossa filtro não ligada à rede', 'Fossa rudimentar ou buraco', 'Vala', 'Rio, lago, córrego ou mar', 'Outra forma', 'Não tinham banheiro nem sanitário'];
const somaFormas = (o) => FORMAS_ESG.reduce((a, k) => a + (o[k] ?? 0), 0);

/* ------------------------------------------------------------------ 051 esgoto na rede */
async function esgoto(S) {
  const geo = lerGeo();
  const cls = new Map();
  for (const [cd, s] of S) cls.set(cd, classeRede(s));
  gradeTema('grade-saneamento-sp-esgoto', (cd) => { const c = cls.get(cd); return c === undefined ? null : c === null ? 254 : c === 0 ? 253 : c; });
  const domPorClasse = new Array(6).fill(0), setPorClasse = new Array(6).fill(0);
  let semInfo = [], semInfoDom = 0, semDom = 0;
  for (const [cd, c] of cls) {
    const s = S.get(cd);
    if (c === 0) { semDom++; continue; }
    if (c === null) { semInfo.push(cd); semInfoDom += s.dppo ?? 0; continue; }
    domPorClasse[c - 1] += s.dppo; setPorClasse[c - 1]++;
  }
  const uf = UF('tabela6805_UF_SP.json');
  const total = somaFormas(uf);
  const rede = uf['Rede geral, rede pluvial ou fossa ligada à rede'];
  // Municípios: fora da rede (SIDRA 6805).
  const sm = SIDRA_ESG();
  const mun = [...sm].map(([cd, o]) => {
    const r = o['Rede geral, rede pluvial ou fossa ligada à rede'];
    const t = somaFormas(o);
    return { CD_MUN: cd, NM_MUN: NOME_MUN.get(cd), dppo: t, rede: r, fora: t - r, pct_fora: (100 * (t - r)) / t };
  });
  const foraAbs = [...mun].sort((a, z) => z.fora - a.fora).slice(0, 6);
  const grandes = mun.filter((m) => m.dppo >= 50000).sort((a, z) => z.pct_fora - a.pct_fora).slice(0, 5);
  // Chamada: o município com 20 mil DPPO ou mais que tem a maior parte fora da rede.
  const destaque = mun.filter((m) => m.dppo >= 20000).sort((a, z) => z.pct_fora - a.pct_fora)[0];
  const c = {
    lim: LIM_REDE, cores: CORES_REDE, dom_por_classe: domPorClasse, setores_por_classe: setPorClasse,
    sem_info: semInfo.length, sem_info_dom: semInfoDom, sem_dom: semDom, n_setores: S.size,
    dppo_setores: soma(domPorClasse) + semInfoDom,
    uf: { total, rede, fora: total - rede, pct_rede: (100 * rede) / total },
    fora_abs: foraAbs, grandes, destaque,
    semInfoFeats: leve(semInfoFeats(semInfo, geo)),
  };
  gravarCache('saneamento-sp-esgoto', c);
  console.log('esgoto', { domPorClasse, setPorClasse, semInfo: semInfo.length, semInfoDom, semDom, uf: c.uf, destaque, foraAbs: foraAbs.map((m) => `${m.NM_MUN} ${m.fora}`), grandes: grandes.map((m) => `${m.NM_MUN} ${m.pct_fora.toFixed(1)}`) });
  return cls;
}

/* ------------------------------------------------------------------ 052 destino predominante */
async function destino(S) {
  const geo = lerGeo();
  const cls = new Map();
  for (const [cd, s] of S) cls.set(cd, destinoPredominante(s));
  gradeTema('grade-saneamento-sp-destino', (cd) => { const c = cls.get(cd); return c === undefined ? null : c === null ? 254 : c === -1 ? 253 : c + 1; });
  const setores = new Array(DESTINOS.length).fill(0), dom = new Array(DESTINOS.length).fill(0);
  const semInfo = [];
  let semDom = 0, semInfoDom = 0;
  for (const [cd, c] of cls) {
    const s = S.get(cd);
    if (c === -1) { semDom++; continue; }
    if (c === null) { semInfo.push(cd); semInfoDom += s.dppo ?? 0; continue; }
    setores[c]++; dom[c] += s.dppo;
  }
  const uf = UF('tabela6805_UF_SP.json');
  const ufGrupos = {
    rede: uf['Rede geral, rede pluvial ou fossa ligada à rede'], septica: uf['Fossa séptica ou fossa filtro não ligada à rede'],
    rudimentar: uf['Fossa rudimentar ou buraco'], aberto: uf.Vala + uf['Rio, lago, córrego ou mar'] + uf['Outra forma'], sem: uf['Não tinham banheiro nem sanitário'],
  };
  // Por região intermediária: setores com destino predominante fora da rede (área), para o texto.
  const info = lerInfo();
  const areaPorDestino = new Array(DESTINOS.length).fill(0);
  for (const [cd, c] of cls) if (c !== null && c >= 0) areaPorDestino[c] += info[cd]?.area ?? 0;
  const sm = SIDRA_ESG();
  const rio = [...sm].map(([cd, o]) => ({ CD_MUN: cd, NM_MUN: NOME_MUN.get(cd), rio: o['Rio, lago, córrego ou mar'] ?? 0, rudimentar: o['Fossa rudimentar ou buraco'] ?? 0 }));
  const c = {
    destinos: DESTINOS.map(([k, , cor, pt, en]) => ({ k, cor, pt, en })), setores, dom, area: areaPorDestino,
    sem_info: semInfo.length, sem_info_dom: semInfoDom, sem_dom: semDom, uf: ufGrupos, uf_detalhe: uf,
    rio_top: rio.sort((a, z) => z.rio - a.rio).slice(0, 6),
    rudimentar_top: [...rio].sort((a, z) => z.rudimentar - a.rudimentar).slice(0, 6),
    semInfoFeats: leve(semInfoFeats(semInfo, geo)),
  };
  gravarCache('saneamento-sp-destino', c);
  console.log('destino', { setores, dom, area: areaPorDestino.map(Math.round), semInfo: semInfo.length, semInfoDom, ufGrupos, rio: c.rio_top.map((m) => `${m.NM_MUN} ${m.rio}`) });
  return cls;
}

/* ------------------------------------------------------------------ 053 lixo fora da coleta */
async function lixo(S) {
  const geo = lerGeo();
  const cls = new Map();
  for (const [cd, s] of S) cls.set(cd, classeLixo(s));
  gradeTema('grade-saneamento-sp-lixo', (cd) => { const c = cls.get(cd); return c === undefined ? null : c === null ? 254 : c === -1 ? 253 : c === 0 ? 252 : c; });
  const setores = new Array(LIM_LIXO.length + 2).fill(0), dom = new Array(LIM_LIXO.length + 2).fill(0);
  const semInfo = [];
  let semDom = 0, semInfoDom = 0;
  for (const [cd, c] of cls) {
    const s = S.get(cd);
    if (c === -1) { semDom++; continue; }
    if (c === null) { semInfo.push(cd); semInfoDom += s.dppo ?? 0; continue; }
    setores[c]++; dom[c] += s.dppo;
  }
  const uf = UF('tabela6892_UF_SP.json');
  const fora = uf['Queimado na propriedade'] + uf['Enterrado na propriedade'] + uf['Jogado em terreno baldio, encosta ou área pública'] + uf['Outro destino'];
  const total = uf.Coletado + fora;
  const sm = SIDRA_LIXO();
  const mun = [...sm].map(([cd, o]) => {
    const f = (o['Queimado na propriedade'] ?? 0) + (o['Enterrado na propriedade'] ?? 0) + (o['Jogado em terreno baldio, encosta ou área pública'] ?? 0) + (o['Outro destino'] ?? 0);
    const t = (o.Coletado ?? 0) + f;
    return { CD_MUN: cd, NM_MUN: NOME_MUN.get(cd), dppo: t, fora: f, queimado: o['Queimado na propriedade'] ?? 0, pct_fora: (100 * f) / t };
  });
  const c = {
    lim: LIM_LIXO, cores: CORES_LIXO, setores, dom, sem_info: semInfo.length, sem_info_dom: semInfoDom, sem_dom: semDom,
    uf: { total, fora, coletado: uf.Coletado, queimado: uf['Queimado na propriedade'], enterrado: uf['Enterrado na propriedade'], terreno: uf['Jogado em terreno baldio, encosta ou área pública'], outro: uf['Outro destino'], cacamba: uf['Depositado em caçamba de serviço de limpeza'] },
    pct_top: [...mun].sort((a, z) => z.pct_fora - a.pct_fora).slice(0, 6),
    abs_top: [...mun].sort((a, z) => z.fora - a.fora).slice(0, 6),
    semInfoFeats: leve(semInfoFeats(semInfo, geo)),
  };
  gravarCache('saneamento-sp-lixo', c);
  console.log('lixo', { setores, dom, semInfo: semInfo.length, uf: c.uf, pct: c.pct_top.map((m) => `${m.NM_MUN} ${m.pct_fora.toFixed(1)}`), abs: c.abs_top.map((m) => `${m.NM_MUN} ${m.fora}`) });
  return cls;
}

/* ------------------------------------------------------------------ 054 municípios × biometano */
/** Meta do novo marco do saneamento (Lei 14.026/2020): 90 % da população com coleta e tratamento de esgoto até 2033. */
const META = 90;
const GRUPOS = [
  ['rede_lodo', '#234e70', 'Rede ≥ 90 %, lodo no potencial', 'Mains ≥ 90%, sludge in the potential'],
  ['rede_sem_lodo', '#9dbdcc', 'Rede ≥ 90 %, lodo zero', 'Mains ≥ 90%, zero sludge'],
  ['falta_lodo', '#c08a2e', 'Rede < 90 %, lodo no potencial', 'Mains < 90%, sludge in the potential'],
  ['falta_sem_lodo', '#9c4a32', 'Rede < 90 %, lodo zero', 'Mains < 90%, zero sludge'],
];
async function municipios() {
  const b = await basico();
  const pop = new Map();
  for (const s of b.values()) pop.set(s.CD_MUN, (pop.get(s.CD_MUN) ?? 0) + (s.pessoas ?? 0));
  const se = SIDRA_ESG();
  const sl = SIDRA_LIXO();
  const cp = await cp2b();
  const linhas = [];
  for (const [cd, nome] of NOME_MUN) {
    const o = se.get(cd) ?? {};
    const l = sl.get(cd) ?? {};
    const rede = o['Rede geral, rede pluvial ou fossa ligada à rede'];
    const dppo = somaFormas(o);
    const foraLixo = ['Queimado na propriedade', 'Enterrado na propriedade', 'Jogado em terreno baldio, encosta ou área pública', 'Outro destino'].reduce((a, k) => a + (l[k] ?? 0), 0);
    const c = cp.get(cd) ?? {};
    const p = pop.get(cd) ?? 0;
    const lodo = c.LODO_ETE ?? 0, rsu = c.RSU_ORGANICO ?? 0;
    const pctRede = dppo ? (100 * rede) / dppo : null;
    const grupo = pctRede === null ? null : (pctRede >= META ? 'rede' : 'falta') + (lodo > 0 ? '_lodo' : '_sem_lodo');
    linhas.push({
      CD_MUN: cd, NM_MUN: nome, pessoas: p, dppo,
      esgoto_rede: rede, esgoto_fora: dppo - rede, pct_esgoto_rede: pctRede === null ? null : Math.round(10 * pctRede) / 10,
      pct_esgoto_fora: pctRede === null ? null : Math.round(10 * (100 - pctRede)) / 10,
      lixo_fora: foraLixo, pct_lixo_fora: dppo ? Math.round((1000 * foraLixo) / ((l.Coletado ?? 0) + foraLixo)) / 10 : null,
      biometano_lodo_m3d: Math.round(lodo * 10) / 10, biometano_lixo_m3d: Math.round(rsu * 10) / 10, grupo,
    });
  }
  const tot = (k) => soma(linhas.map((l) => l[k] ?? 0));
  const grupos = Object.fromEntries(GRUPOS.map(([k]) => {
    const ls = linhas.filter((l) => l.grupo === k);
    return [k, { n: ls.length, pessoas: soma(ls.map((l) => l.pessoas)), dppo: soma(ls.map((l) => l.dppo)), fora: soma(ls.map((l) => l.esgoto_fora)), lodo: soma(ls.map((l) => l.biometano_lodo_m3d)) }];
  }));
  const comLodo = linhas.filter((l) => l.biometano_lodo_m3d > 0).sort((a, z) => z.biometano_lodo_m3d - a.biometano_lodo_m3d);
  const c = {
    linhas, lim_fora: [5, 10, 20, 35, 50], lim_lodo: quebras(comLodo.map((l) => l.biometano_lodo_m3d), 6), meta: META, versao: cp.versao,
    tot: { pessoas: tot('pessoas'), dppo: tot('dppo'), fora: tot('esgoto_fora'), lodo: tot('biometano_lodo_m3d'), lixo: tot('biometano_lixo_m3d') },
    grupos, com_lodo: comLodo.length, lodo_top: comLodo.slice(0, 6).map((l) => ({ NM_MUN: l.NM_MUN, CD_MUN: l.CD_MUN, v: l.biometano_lodo_m3d })),
    abaixo_meta: linhas.filter((l) => l.pct_esgoto_rede < META).length,
  };
  gravarCache('saneamento-sp-municipios', c);
  console.log('municipios', { tot: c.tot, lim_lodo: c.lim_lodo, grupos, com_lodo: c.com_lodo, top: c.lodo_top, abaixo: c.abaixo_meta });
  return c;
}

/* ------------------------------------------------------------------ GeoPackages */
const ROT_REDE = (en) => (en ? ['up to 10%', '10 to 50%', '50 to 80%', '80 to 95%', '95 to 99%', 'over 99%'] : ['até 10 %', '10 a 50 %', '50 a 80 %', '80 a 95 %', '95 a 99 %', 'mais de 99 %']);
const ROT_LIXO = ['nenhum', 'até 1 %', '1 a 5 %', '5 a 20 %', '20 a 50 %', 'mais de 50 %'];

async function gpkgSetores(S, clsRede, clsDest, clsLixo) {
  const geo = lerGeo();
  const feats = [];
  for (const [cd, s] of S) {
    const g = geo[cd];
    if (!g) continue;
    const o = s.o ?? {};
    const p = { CD_SETOR: cd, CD_MUN: s.b.CD_MUN, NM_MUN: s.b.NM_MUN, situacao: s.b.situacao, dppo: s.o ? (s.dppo ?? null) : 0 };
    for (const [k, vs] of Object.entries(ESG)) p[`esgoto_${k}`] = s.o ? o[vs[0]] : 0;
    for (const [k, vs] of Object.entries(LIXO)) p[`lixo_${k}`] = s.o ? o[vs[0]] : 0;
    const r = clsRede.get(cd), d = clsDest.get(cd), l = clsLixo.get(cd);
    p.classe_rede = r === 0 || r === null ? null : r;
    p.destino = d === null || d < 0 ? null : DESTINOS[d][0];
    p.classe_lixo = l === null || l < 0 ? null : l;
    p.sem_domicilio = s.o ? 0 : 1;
    feats.push({ type: 'Feature', properties: p, geometry: g });
  }
  const ref = camadasReferencia();
  const estilos = {
    setores: [
      ['esgoto_na_rede', 'Nº 051 · DPPO com esgoto na rede geral, pluvial ou fossa ligada, por classe', estiloCategorias('classe_rede', ROT_REDE(false).map((r, i) => [i + 1, r, CORES_REDE[i]])), true],
      ['destino_do_esgoto', 'Nº 052 · Destino predominante do esgoto', estiloCategorias('destino', DESTINOS.map(([k, , cor, pt]) => [k, pt, cor])), false],
      ['lixo_fora_da_coleta', 'Nº 053 · DPPO com lixo queimado, enterrado, jogado ou outro destino, por classe', estiloCategorias('classe_lixo', ROT_LIXO.map((r, i) => [i, r, i === 0 ? '#eef0f1' : CORES_LIXO[i - 1]])), false],
    ],
    ...ref.estilos,
  };
  const arq = join(MAPAS, PASTA.esgoto, 'dados', 'sp_saneamento_setores_2022.gpkg');
  mkdirSync(join(MAPAS, PASTA.esgoto, 'dados'), { recursive: true });
  const campos = Object.keys(feats[0].properties);
  await gravarGpkg(arq, { setores: { feats, campos }, ...ref.camadas }, estilos);
  const z = zipar(arq);
  console.log(`✓ ${z} · ${mb(tamanho(z))}`);
}

async function gpkgMunicipios(c) {
  const malha = malhaMunicipios();
  const por = new Map(c.linhas.map((l) => [l.CD_MUN, l]));
  const feats = malha.map((f) => ({ type: 'Feature', properties: por.get(String(f.properties.CD_MUN)), geometry: f.geometry }));
  const ref = camadasReferencia();
  const estilos = {
    municipios: [
      ['esgoto_fora_da_rede', 'Nº 054 · DPPO com esgoto fora da rede (%)', estiloGraduado('pct_esgoto_fora', [...c.lim_fora, 100], CORES_FORA, { casas: 0, sufixo: ' %' }), false],
      ['biometano_do_lodo', 'Nº 054 · Biometano do lodo de esgoto, CP2B N4 (m³/dia)', estiloGraduado('biometano_lodo_m3d', c.lim_lodo, CORES_LODO, { casas: 0 }), false],
      ['rede_e_lodo', 'Nº 054 · Rede de esgoto (meta de 90 %) e lodo no potencial', estiloCategorias('grupo', GRUPOS.map(([k, cor, pt]) => [k, pt, cor])), true],
    ],
    ...ref.estilos,
  };
  const pasta = join(MAPAS, PASTA.municipios, 'dados');
  mkdirSync(pasta, { recursive: true });
  const arq = join(pasta, 'sp_saneamento_biometano.gpkg');
  await gravarGpkg(arq, { municipios: { feats, campos: Object.keys(c.linhas[0]) }, ...ref.camadas }, estilos);
  const z = zipar(arq);
  const csv = join(pasta, 'sp_saneamento_biometano.csv');
  gravarCsv(csv, c.linhas);
  console.log(`✓ ${z} · ${mb(tamanho(z))} · CSV ${mb(tamanho(csv))}`);
}

/* ------------------------------------------------------------------ */
const pedidos = process.argv.slice(2);
const quer = (k) => !pedidos.length || pedidos.includes(k);
const S = await setores();
const r = quer('esgoto') || quer('gpkg') ? await esgoto(S) : null;
const d = quer('destino') || quer('gpkg') ? await destino(S) : null;
const l = quer('lixo') || quer('gpkg') ? await lixo(S) : null;
const m = quer('municipios') || quer('gpkg') ? await municipios() : null;
if (quer('gpkg')) { await gpkgSetores(S, r, d, l); await gpkgMunicipios(m); }
