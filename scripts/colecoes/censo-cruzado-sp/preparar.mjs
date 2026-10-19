#!/usr/bin/env node
/**
 * Coleção «O Censo cruzado» (censo-cruzado-sp) — prepara os dados das pranchas 093 a 102 (uso interno).
 *
 *   node scripts/colecoes/censo-cruzado-sp/sidra.mjs      (1) tabelas municipais do SIDRA
 *   node --max-old-space-size=8192 scripts/colecoes/censo-cruzado-sp/base.mjs   (2) base municipal e por APOND
 *   node scripts/colecoes/censo-cruzado-sp/triagem.mjs    (3) triagem de todos os pares
 *   node --max-old-space-size=8192 scripts/colecoes/censo-cruzado-sp/preparar.mjs [dados|gpkg ...]
 *
 * Cada prancha cruza duas variáveis em terços dos municípios (mapa bivariado 3 × 3), com Spearman, Spearman
 * parcial (controles: urbanização, densidade e renda per capita), tamanho efetivo da amostra sob
 * autocorrelação espacial (vizinhança KNN-6), robustez sem a capital e sem a Região Intermediária de São
 * Paulo, e o LISA bivariado. A 098 desce às áreas de ponderação (APOND) da metrópole.
 */
import { join } from 'node:path';
import { readFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { RAIZ, BRUTOS, gravarCache, lerCache, gravarGpkg, gravarCsv, zipar, tamanho, mb, lerGpkg, simplificar, pontoInterno } from '../lib/dados.mjs';
import { SP, NOME_MUN, RGINT_MUN, NOME_RGINT, malhaMunicipios, camadasReferencia, baseJanela } from '../lib/cruzamentos.mjs';
import { basico } from '../lib/setores-sp.mjs';
import { estiloGraduado, estiloRegras, preenchimento, hachura } from '../lib/estilos-qgis.mjs';
import { postos, pearson, spearmanParcial, pCorr, knn, plano, moran, nEfetivo, lisaBivariado } from './estatistica.mjs';

const MAPAS = join(RAIZ, 'mapas');
const BASE = join(BRUTOS, 'analises', 'base');
export const SERIE = JSON.parse(readFileSync(join(RAIZ, 'scripts', 'colecoes', 'censo-cruzado-sp', 'serie.json'), 'utf8'));
const PASTA = Object.fromEntries(SERIE.map((s) => [s.tema, s.pasta]));
const NUM = Object.fromEntries(SERIE.map((s) => [s.tema, String(s.numero).padStart(3, '0')]));

/** Paleta bivariada 3 × 3 (Stevens, roxo × dourado): BIV[terço de y][terço de x]. */
export const BIV = [
  ['#e8e8e8', '#e4d9ac', '#c8b35a'],
  ['#cbb8d7', '#c8ada0', '#af8e53'],
  ['#9972af', '#976b82', '#804d36'],
];
export const LIM_PAU = [0.25, 0.5, 1, 2];
export const CORES_PAU = ['#f3ede2', '#e4d3b4', '#cfae7c', '#b3834a', '#7f5530'];

/** Pares das pranchas: x nas colunas (dourado), y nas linhas (roxo). */
export const PARES = {
  solar: { x: 'pct_area_cana', y: 'solar_w_dom', extras: [['solar_w_dom', 'pct_area_nativa'], ['solar_w_dom', 'renda_pc_media'], ['solar_w_dom', 'pct_area_pastagem']] },
  esgoto: { x: 'pct_area_cana', y: 'pct_esgoto_rede', extras: [['pct_area_cana', 'pct_ocup_operarios'], ['pct_area_cana', 'pct_favela'], ['pct_area_cana', 'pct_fossa_rudimentar']] },
  boi: { x: 'dens_bovino', y: 'pct_60mais', extras: [['pct_area_pastagem', 'idade_mediana'], ['dens_bovino', 'pct_0a14'], ['pct_area_cana', 'pct_60mais']] },
  segregacao: { x: 'segregacao_racial', y: 'razao_renda_raca', extras: [['segregacao_racial', 'hiato_estudo_raca'], ['segregacao_racial', 'pct_pretos_pardos']] },
  vertical: { x: 'cv_renda_setores', y: 'pct_apartamento', extras: [['cv_renda_setores', 'renda_pc_media'], ['cv_renda_setores', 'pct_favela']] },
  juventude: { x: 'pct_0a14', y: 'pct_pretos_pardos', extras: [['pct_0a14', 'renda_pc_media']] },
  sozinho: { x: 'pct_60mais', y: 'pct_unipessoal', extras: [['pct_unipessoal', 'pct_apartamento']] },
  letras: { x: 'pct_ocup_agro', y: 'hiato_analfabetismo', extras: [['pct_ocup_agro', 'pct_analfabeto'], ['pct_area_cana', 'hiato_analfabetismo']] },
  veraneio: { x: 'pct_uso_ocasional', y: 'pct_sem_esgoto_rede', extras: [['pct_uso_ocasional', 'pct_fossa_rudimentar'], ['pct_uso_ocasional', 'pct_poco']] },
  paudearara: { x: 'pct_sem_fundamental', y: 'pct_pau_de_arara', extras: [['pct_pau_de_arara', 'pct_area_cana'], ['pct_pau_de_arara', 'pct_bioeconomia'], ['pct_pau_de_arara', 'pct_ocup_agro']] },
};
const CONTROLES = ['pct_urbana', 'log_densidade', 'log_renda_pc'];
// Controle da mesma família do par sai (a renda não controla a razão de renda entre raças, por exemplo).
const FAM = { razao_renda_raca: 'renda', renda_pc_media: 'renda', renda_pc_mediana: 'renda', log_renda_pc: 'renda', pct_urbana: 'urbano', log_densidade: 'densidade' };

/** Variáveis que vêm da amostra do Censo (questionário da amostra), com erro amostral. */
export const AMOSTRA = new Set(['razao_renda_raca', 'hiato_estudo_raca', 'pct_ocup_operarios', 'pct_ocup_agro', 'pct_pau_de_arara', 'pct_sem_fundamental', 'renda_pc_media', 'log_renda_pc']);

const CONCURB = ['3550308', '3548500']; // concentrações urbanas de São Paulo e de Santos (IBGE)
const CAPITAL = '3550308';

function lerBase(arq) {
  const L = readFileSync(arq, 'utf8').trim().split('\n');
  const cab = L[0].split(',');
  return L.slice(1).map((l) => {
    const c = l.match(/("([^"]|"")*"|[^,]*)(,|$)/g).map((x) => x.replace(/,$/, ''));
    return Object.fromEntries(cab.map((k, i) => [k, c[i] === '' || c[i] == null ? null : c[i].startsWith('"') ? c[i].slice(1, -1) : Number(c[i])]));
  });
}
const r1 = (v) => (v == null ? null : Math.round(v * 10) / 10);
const r2 = (v) => (v == null ? null : Math.round(v * 100) / 100);
const r3 = (v) => (v == null ? null : Math.round(v * 1000) / 1000);
const ter = (vals) => { const v = [...vals].sort((a, b) => a - b); return [v[Math.floor(v.length / 3)], v[Math.floor((2 * v.length) / 3)]]; };
const terco = (v, t) => (v <= t[0] ? 0 : v <= t[1] ? 1 : 2);

/** Acrescenta as variáveis derivadas das pranchas. */
function derivar(o) {
  o.pct_pretos_pardos = o.pct_preta != null && o.pct_parda != null ? o.pct_preta + o.pct_parda : null;
  o.pct_sem_esgoto_rede = o.pct_esgoto_rede != null ? 100 - o.pct_esgoto_rede : null;
  if ('log_dens_bovino' in o) o.dens_bovino = o.log_dens_bovino != null ? 10 ** o.log_dens_bovino : null;
  o.densidade = o.log_densidade != null ? 10 ** o.log_densidade : null;
  return o;
}

/* ------------------------------------------------------------------ estatística de um par */
function estatPar(U, VIZ, x, y, { lisa = false } = {}) {
  const idx = U.map((o, i) => (o[x] != null && o[y] != null ? i : -1)).filter((i) => i >= 0);
  const vx = idx.map((i) => U[i][x]), vy = idx.map((i) => U[i][y]);
  const rho = pearson(postos(vx), postos(vy));
  const out = { x, y, n: idx.length, rho: r3(rho), p: pCorr(rho, idx.length - 2) };
  // Parcial, com os controles que não são da família de x ou de y.
  const ctrl = CONTROLES.filter((c) => c !== x && c !== y && (FAM[c] ?? c) !== (FAM[x] ?? x) && (FAM[c] ?? c) !== (FAM[y] ?? y));
  const parc = (filtro) => {
    const ii = idx.filter((i) => filtro(i) && ctrl.every((c) => U[i][c] != null));
    const pa = spearmanParcial(ii.map((i) => U[i][x]), ii.map((i) => U[i][y]), ctrl.map((c) => ii.map((i) => U[i][c])));
    return { ...pa, ii };
  };
  const pa = parc(() => true);
  // Tamanho efetivo pelos Moran dos resíduos parciais (vizinhança de todos os municípios, vizinhos sem dado saem).
  const ok = new Array(U.length).fill(false), zx = new Array(U.length).fill(0), zy = new Array(U.length).fill(0);
  pa.ii.forEach((i, k) => { ok[i] = true; zx[i] = pa.rx[k]; zy[i] = pa.ry[k]; });
  const Ix = moran(zx, ok, VIZ), Iy = moran(zy, ok, VIZ);
  const neff = nEfetivo(pa.ii.length, Ix, Iy);
  Object.assign(out, {
    controles: ctrl, n_parcial: pa.ii.length, parcial: r3(pa.r), I_res_x: r3(Ix), I_res_y: r3(Iy), n_eff: Math.round(neff),
    p_eff: pCorr(pa.r, neff - 2 - ctrl.length),
    parcial_sem_capital: r3(parc((i) => U[i].cd !== CAPITAL).r),
    parcial_sem_rgint_sp: r3(parc((i) => RGINT_MUN.get(U[i].cd) !== '3501').r),
  });
  const fora = idx.filter((i) => RGINT_MUN.get(U[i].cd) !== '3501');
  out.rho_sem_rgint_sp = r3(pearson(postos(fora.map((i) => U[i][x])), postos(fora.map((i) => U[i][y]))));
  if (lisa) {
    const pts = idx.map((i) => U[i].xy);
    const L = lisaBivariado(vx, vy, knn(pts, 6));
    out.I_biv = r3(L.I); out.p_I_biv = L.pI;
    out.lisa = { AA: 0, BB: 0, AB: 0, BA: 0, ns: 0 };
    out.classe_lisa = new Map(idx.map((i, k) => [U[i].cd, L.classe[k]]));
    for (const c of L.classe) out.lisa[c]++;
    // Terços e casas do mapa bivariado.
    const tx = ter(vx), ty = ter(vy);
    out.ter_x = tx; out.ter_y = ty;
    out.celula = new Map(idx.map((i) => [U[i].cd, [terco(U[i][y], ty), terco(U[i][x], tx)]]));
    out.casas = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (const [a, b] of out.celula.values()) out.casas[a][b]++;
  }
  return out;
}

/* ------------------------------------------------------------------ dados */
async function dados() {
  const MUN = lerBase(join(BASE, 'municipios.csv')).map(derivar);
  const AP = lerBase(join(BASE, 'apond.csv')).map(derivar);
  const geo = new Map(SP.municipios.features.map((f) => [f.properties.CD_MUN, f.geometry]));
  for (const o of MUN) { o.xy = plano(pontoInterno(geo.get(o.cd))); o.CD_RGINT = RGINT_MUN.get(o.cd); }
  const VIZ = knn(MUN.map((o) => o.xy), 6);

  // Resumo da triagem (triagem.mjs): quantos pares e quantos passam.
  const triagem = JSON.parse(readFileSync(join(BRUTOS, 'analises', 'triagem', 'resumo.json'), 'utf8'));

  const pr = {};
  for (const [tema, def] of Object.entries(PARES)) {
    const e = estatPar(MUN, VIZ, def.x, def.y, { lisa: true });
    e.extras = def.extras.map(([a, b]) => { const s = estatPar(MUN, VIZ, a, b); return { x: a, y: b, n: s.n, rho: s.rho, parcial: s.parcial, n_eff: s.n_eff, p_eff: s.p_eff }; });
    pr[tema] = e;
    console.log(`${NUM[tema]} ${tema}: ${def.x} × ${def.y} · n ${e.n} · ρ ${e.rho} · parcial ${e.parcial} [${e.controles.join('+')}] · n_eff ${e.n_eff} p_eff ${e.p_eff.toExponential(1)} · s/cap ${e.parcial_sem_capital} · s/RGI-SP ${e.parcial_sem_rgint_sp} (bruto ${e.rho_sem_rgint_sp}) · I_biv ${e.I_biv} (p ${e.p_I_biv}) · LISA ${JSON.stringify(e.lisa)} · casas ${JSON.stringify(e.casas)}`);
    for (const s of e.extras) console.log(`   ${s.x} × ${s.y}: ρ ${s.rho} · parcial ${s.parcial} · n_eff ${s.n_eff}`);
  }

  // Linhas municipais com as casas e o LISA de cada prancha.
  const mun = MUN.map((o) => {
    const l = { CD_MUN: o.cd, NM_MUN: o.NM_MUN, CD_RGINT: o.CD_RGINT, NM_RGINT: NOME_RGINT.get(o.CD_RGINT), pessoas: o.pessoas };
    for (const k of COLUNAS_VARS) l[k] = o[k] ?? null;
    for (const [tema, e] of Object.entries(pr)) {
      if (tema === 'paudearara') continue;
      const c = e.celula.get(o.cd);
      l[`b${NUM[tema]}`] = c ? 10 * (c[1] + 1) + (c[0] + 1) : null; // dezena: terço de x; unidade: terço de y
      l[`lisa${NUM[tema]}`] = e.classe_lisa.get(o.cd) ?? null;
    }
    l.lisa102 = pr.paudearara.classe_lisa.get(o.cd) ?? null;
    return l;
  });

  // Pau de arara: classes e médias por terço das variáveis ligadas.
  const pau = mun.filter((m) => m.pct_pau_de_arara != null);
  const mediaPorTerco = (k) => {
    const s = pau.filter((m) => m[k] != null);
    const t = ter(s.map((m) => m[k]));
    return { ter: t, media: [0, 1, 2].map((c) => { const g = s.filter((m) => terco(m[k], t) === c); return r2(g.reduce((a, m) => a + m.pct_pau_de_arara, 0) / g.length); }) };
  };
  const extraPau = { sem_fundamental: mediaPorTerco('pct_sem_fundamental'), cana: mediaPorTerco('pct_area_cana'), bioeconomia: mediaPorTerco('pct_bioeconomia') };

  // Regiões intermediárias: mediana dos municípios em cada variável das pranchas (para os painéis).
  const med = (v) => { const s = v.filter((x) => x != null).sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : null; };
  const regioes = [...new Set(mun.map((m) => m.CD_RGINT))].map((cd) => {
    const ls = mun.filter((m) => m.CD_RGINT === cd);
    const o = { CD_RGINT: cd, NM_RGINT: NOME_RGINT.get(cd), n: ls.length };
    for (const k of COLUNAS_VARS) o[k] = r2(med(ls.map((m) => m[k])));
    for (const tema of Object.keys(pr)) if (tema !== 'paudearara') o[`aa${NUM[tema]}`] = ls.filter((m) => m[`b${NUM[tema]}`] === 33).length;
    return o;
  });

  /* ---------------------------------------------------------------- 098: APOND da metrópole */
  const B = await basico();
  const conc = new Set([...B.values()].filter((b) => CONCURB.includes(b.CD_CONCURB)).map((b) => b.CD_MUN));
  const apGeo = await lerGpkg(join(BRUTOS, 'ibge', 'malhas-sp', 'APONDs2022_35_SP.gpkg'));
  const apPor = new Map(AP.map((o) => [o.cd, o]));
  const AP1000 = AP.filter((o) => o.pessoas >= 1000);
  const rhoAp = (x, y, f = () => true) => { const s = AP1000.filter((o) => f(o) && o[x] != null && o[y] != null); return { n: s.length, rho: r3(pearson(postos(s.map((o) => o[x])), postos(s.map((o) => o[y])))) }; };
  const naConc = (o) => conc.has(o.CD_MUN);
  const ju = PARES.juventude;
  const janelaAp = AP1000.filter((o) => naConc(o) && o[ju.x] != null && o[ju.y] != null);
  const tx = ter(janelaAp.map((o) => o[ju.x])), ty = ter(janelaAp.map((o) => o[ju.y]));
  const casasAp = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  const apond = [], apFeats = [];
  for (const f of apGeo) {
    const o = apPor.get(f.properties.cd_apond) ?? { cd: f.properties.cd_apond, CD_MUN: f.properties.CD_MUN };
    const tem = o.pessoas >= 1000 && o[ju.x] != null && o[ju.y] != null;
    const cel = tem ? [terco(o[ju.y], ty), terco(o[ju.x], tx)] : null;
    const linha = {
      CD_APOND: f.properties.cd_apond, CD_MUN: f.properties.CD_MUN, NM_MUN: f.properties.NM_MUN, pessoas: o.pessoas ?? null,
      pct_0a14: r2(o.pct_0a14), pct_60mais: r2(o.pct_60mais), pct_branca: r2(o.pct_branca), pct_preta: r2(o.pct_preta), pct_parda: r2(o.pct_parda),
      pct_pretos_pardos: r2(o.pct_pretos_pardos), pct_unipessoal: r2(o.pct_unipessoal), pct_apartamento: r2(o.pct_apartamento),
      renda_resp_media: o.renda_resp_media == null ? null : Math.round(o.renda_resp_media), metropole: naConc(o) ? 1 : 0,
      b098: naConc(o) && cel ? 10 * (cel[1] + 1) + (cel[0] + 1) : null,
    };
    if (naConc(o) && cel) casasAp[cel[0]][cel[1]]++;
    apond.push(linha);
    apFeats.push({ type: 'Feature', properties: linha, geometry: simplificar(f.geometry, 0.0001) });
  }
  const base = baseJanela('censo-cruzado-sp-metropole', 'SP', [...conc], { oceano: [-46.2, -24.25], passo: 0.25, folga: 0.06 });
  const leve = (g) => ({ type: g.type, coordinates: JSON.parse(JSON.stringify(g.coordinates), (k, v) => (typeof v === 'number' ? Math.round(v * 1e4) / 1e4 : v)) });
  // Exemplos: a APOND mais jovem e mais negra, e a mais velha e mais branca da janela.
  const ord = (k, s = 1) => [...janelaAp].sort((a, b) => s * (b[k] - a[k]));
  const jovemNegra = ord('pct_0a14').find((o) => terco(o[ju.y], ty) === 2);
  const velhaBranca = [...janelaAp].sort((a, b) => a.pct_0a14 - b.pct_0a14).find((o) => terco(o[ju.y], ty) === 0);
  const pt = (cd) => pontoInterno(apGeo.find((f) => f.properties.cd_apond === cd).geometry);
  const metropole = {
    n_mun: conc.size, n_apond: janelaAp.length, ter_x: tx, ter_y: ty, casas: casasAp,
    rho_estado: rhoAp(ju.x, ju.y), rho_janela: rhoAp(ju.x, ju.y, naConc),
    rho_ppi_estado: rhoAp(ju.x, 'pct_ppi'), rho_naobranca_estado: (() => { const s = AP1000.filter((o) => o.pct_branca != null && o[ju.x] != null); return { n: s.length, rho: r3(-pearson(postos(s.map((o) => o[ju.x])), postos(s.map((o) => o.pct_branca)))) }; })(),
    rho_sozinho_estado: rhoAp('pct_60mais', 'pct_unipessoal'),
    jovem: { ...jovemNegra, pt: pt(jovemNegra.cd) }, velha: { ...velhaBranca, pt: pt(velhaBranca.cd) },
    feats: apFeats.filter((f) => f.properties.metropole).map((f) => ({ type: 'Feature', properties: { b: f.properties.b098 }, geometry: leve(f.geometry) })),
  };
  // Na mesma janela, o município inteiro (para comparar as escalas).
  const munConc = mun.filter((m) => conc.has(m.CD_MUN) && m[ju.x] != null && m[ju.y] != null);
  metropole.rho_mun_janela = { n: munConc.length, rho: r3(pearson(postos(munConc.map((m) => m[ju.x])), postos(munConc.map((m) => m[ju.y])))) };
  console.log('098 APOND', { n_mun: metropole.n_mun, n_apond: metropole.n_apond, est: metropole.rho_estado, jan: metropole.rho_janela, munJan: metropole.rho_mun_janela, ppi: metropole.rho_ppi_estado, naoBr: metropole.rho_naobranca_estado, soz: metropole.rho_sozinho_estado, tx, ty, casasAp });
  console.log('   jovem', jovemNegra.cd, jovemNegra.pct_0a14, jovemNegra.pct_pretos_pardos, '| velha', velhaBranca.cd, velhaBranca.pct_0a14, velhaBranca.pct_pretos_pardos);

  // Sem os mapas de vizinhança e as classes (Map) no cache.
  const prCache = Object.fromEntries(Object.entries(pr).map(([k, e]) => { const { celula, classe_lisa, ...r } = e; return [k, r]; }));
  const c = { triagem, pr: prCache, mun, regioes, pau: extraPau, metropole, apond, janela: base.janela };
  gravarCache('censo-cruzado-sp', { ...c, apond: undefined });
  gravarCache('censo-cruzado-sp-apond', { apond: apFeats });
  console.log('triagem', triagem);
  return { ...c, apFeats };
}

/* ------------------------------------------------------------------ gpkg */
const COLUNAS_VARS = ['pct_area_cana', 'pct_area_nativa', 'pct_area_pastagem', 'solar_w_dom', 'renda_pc_media', 'pct_esgoto_rede', 'pct_sem_esgoto_rede',
  'pct_fossa_rudimentar', 'pct_poco', 'pct_ocup_operarios', 'pct_favela', 'dens_bovino', 'pct_0a14', 'pct_60mais', 'idade_mediana', 'segregacao_racial',
  'razao_renda_raca', 'hiato_estudo_raca', 'cv_renda_setores', 'pct_apartamento', 'pct_preta', 'pct_parda', 'pct_pretos_pardos', 'pct_unipessoal',
  'hiato_analfabetismo', 'pct_analfabeto', 'pct_ocup_agro', 'pct_uso_ocasional', 'pct_pau_de_arara', 'pct_sem_fundamental', 'pct_bioeconomia',
  'pct_urbana', 'densidade'];
const TEMAS_BIV = SERIE.map((s) => s.tema).filter((t) => t !== 'paudearara');
const CAMPOS = ['CD_MUN', 'NM_MUN', 'CD_RGINT', 'NM_RGINT', 'pessoas', ...COLUNAS_VARS, ...TEMAS_BIV.flatMap((t) => [`b${NUM[t]}`, `lisa${NUM[t]}`]), 'lisa102'];
const CAMPOS_AP = ['CD_APOND', 'CD_MUN', 'NM_MUN', 'pessoas', 'pct_0a14', 'pct_60mais', 'pct_branca', 'pct_preta', 'pct_parda', 'pct_pretos_pardos', 'pct_unipessoal', 'pct_apartamento', 'renda_resp_media', 'metropole', 'b098'];

/** Rótulos curtos de x e y para a legenda das casas no QGIS. */
const ROT = {
  solar: ['cana', 'solar'], esgoto: ['cana', 'esgoto na rede'], boi: ['bovinos/km²', '60 anos ou mais'], segregacao: ['segregação', 'razão de renda'],
  vertical: ['desigualdade entre setores', 'apartamentos'], juventude: ['0 a 14 anos', 'pretos e pardos'], sozinho: ['60 anos ou mais', 'mora só'],
  letras: ['ocupados na agropecuária', 'hiato de analfabetismo'], veraneio: ['uso ocasional', 'sem esgoto na rede'],
};
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
    return { type: 'Feature', geometry: f.geometry, properties: Object.fromEntries(CAMPOS.map((k) => [k, typeof o?.[k] === 'number' ? r3(o[k]) : (o?.[k] ?? null)])) };
  });
  const apFeats = c.apFeats ?? lerCache('censo-cruzado-sp-apond').apond;
  const ref = camadasReferencia();
  const estilos = {
    municipios: [
      ...TEMAS_BIV.map((t, i) => [`b${NUM[t]}`, `Nº ${NUM[t]} · ${ROT[t][0]} × ${ROT[t][1]}, em terços dos municípios`, estiloBiv(`b${NUM[t]}`, ROT[t]), i === 0]),
      ['pct_pau_de_arara', 'Nº 102 · Vão ao trabalho de caminhonete ou caminhão adaptado (% dos ocupados)', estiloGraduado('pct_pau_de_arara', [...LIM_PAU, 100], CORES_PAU, { casas: 2, sufixo: ' %' }), false],
    ],
    apond: [['b098', 'Nº 098 · 0 a 14 anos × pretos e pardos, em terços das APOND da metrópole', estiloBiv('b098', ROT.juventude), true]],
    ...ref.estilos,
  };
  const dir = join(MAPAS, PASTA.solar, 'dados');
  mkdirSync(dir, { recursive: true });
  const arq = join(dir, 'sp_censo_cruzado_2022.gpkg');
  await gravarGpkg(arq, { municipios: { feats, campos: CAMPOS }, apond: { feats: apFeats, campos: CAMPOS_AP }, ...ref.camadas }, estilos);
  const zip = zipar(arq);
  const csv = join(dir, 'sp_censo_cruzado_municipios_2022.csv');
  gravarCsv(csv, c.mun.map((o) => Object.fromEntries(CAMPOS.map((k) => [k, typeof o[k] === 'number' ? r3(o[k]) : o[k]]))), CAMPOS);
  for (const p of Object.values(PASTA).slice(1)) {
    mkdirSync(join(MAPAS, p, 'dados'), { recursive: true });
    copyFileSync(csv, join(MAPAS, p, 'dados', 'sp_censo_cruzado_municipios_2022.csv'));
  }
  const csvAp = join(MAPAS, PASTA.juventude, 'dados', 'sp_censo_cruzado_apond_2022.csv');
  gravarCsv(csvAp, apFeats.map((f) => f.properties), CAMPOS_AP);
  console.log(`✓ ${zip} · ${mb(tamanho(zip))} · CSV ${mb(tamanho(csv))} · APOND ${mb(tamanho(csvAp))}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const cmds = process.argv.slice(2);
  const fazer = cmds.length ? cmds : ['dados', 'gpkg'];
  let c = null;
  if (fazer.includes('dados')) c = await dados();
  if (fazer.includes('gpkg')) await gpkg(c ?? lerCache('censo-cruzado-sp'));
}
