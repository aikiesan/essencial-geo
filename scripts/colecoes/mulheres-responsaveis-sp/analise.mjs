// Coleção «Mulheres responsáveis pelo domicílio» (mulheres-responsaveis-sp), passo 3. Estatística antes das pranchas,
// com o mesmo rigor da coleção «O Censo cruzado»: Spearman bruto e parcial (controles: urbanização, densidade e renda
// média do responsável), I de Moran com vizinhança KNN-6, tamanho efetivo da amostra, FDR de Benjamini–Hochberg e
// LISA bivariado, nos municípios e nas áreas de ponderação (APOND).
// Saída: dados-brutos/analises/mulheres/estatistica.json e o resumo no terminal.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { BRUTOS, CACHE, lerCsv } from '../lib/dados.mjs';
import { spearman, spearmanParcial, pCorr, bh, knn, plano, moran, nEfetivo, lisaBivariado } from '../censo-cruzado-sp/estatistica.mjs';

const DIR = join(BRUTOS, 'analises', 'mulheres');
const SIDRA = JSON.parse(readFileSync(join(BRUTOS, 'ibge', 'sidra-sp', 'mulheres', 'indicadores.json'), 'utf8'));
const INFO = JSON.parse(readFileSync(join(CACHE, 'setores-sp-info.json'), 'utf8'));
const num = (v) => (v === '' || v == null ? null : Number(v));

/* ---------------------------------------------------------------- unidades */
async function carregar(nivel) {
  const linhas = await lerCsv(join(DIR, `${nivel}.csv`), { sep: ',' });
  return linhas.map((l) => Object.fromEntries(Object.entries(l).map(([k, v]) => [k, k === 'cd' ? v : num(v)])));
}
const MUN = await carregar('municipios');
const AP = await carregar('apond');

// Ponto de cada unidade: média dos pontos dos setores pesada pela área (só para a vizinhança).
const deP = new Map();
for (const l of readFileSync(join(BRUTOS, 'ibge/malhas-sp/DePara_SetorCensit22xAPOND22_35_SP.csv'), 'utf8').split(/\r?\n/)) {
  const [s, a] = l.replace(/^﻿/, '').split(';');
  if (/^\d/.test(s ?? '')) deP.set(s, a);
}
const pts = { municipios: new Map(), apond: new Map() };
for (const [cd, i] of Object.entries(INFO)) {
  if (!i.pt) continue;
  const w = Math.max(i.area ?? 0, 1e-4);
  for (const [nivel, u] of [['municipios', i.mun], ['apond', deP.get(cd)]]) {
    if (!u) continue;
    const t = pts[nivel].get(u) ?? [0, 0, 0];
    t[0] += i.pt[0] * w; t[1] += i.pt[1] * w; t[2] += w;
    pts[nivel].set(u, t);
  }
}

// Variáveis municipais do SIDRA.
const S = (cd, k) => SIDRA[cd]?.[k] ?? null;
const K = {
  f10: 'resp_sexo_2010|96|317:0/11561:100681/11562:0/12237:0/11563:0/11565:0',
  t10: 'resp_sexo_2010|96|317:0/11561:0/11562:0/12237:0/11563:0/11565:0',
};
const chaveSidra = (cd, pre, re) => Object.keys(SIDRA[cd] ?? {}).find((k) => k.startsWith(pre) && re.test(k));
for (const o of MUN) {
  const cd = o.cd;
  // 2010 (universo): a ordem das classificações na chave vem do SIDRA; procura pela categoria.
  const k10F = chaveSidra(cd, 'resp_sexo_2010|96|', /11561:100681/), k10T = chaveSidra(cd, 'resp_sexo_2010|96|', /11561:0(\/|$)/);
  const f10 = S(cd, k10F), t10 = S(cd, k10T);
  o.pct_resp_mulher_2010 = f10 != null && t10 > 0 ? (100 * f10) / t10 : null;
  // 2022 pelo SIDRA (domicílios particulares), para conferir a soma dos setores.
  const cf = (cat, sx) => S(cd, `conjuge_filhos|800|1887:${cat}/11561:${sx}`);
  const totT = cf(72603, 100679), totF = cf(72603, 100681);
  o.pct_resp_mulher_sidra = totT > 0 ? (100 * totF) / totT : null;
  o.var_resp_mulher = o.pct_resp_mulher_sidra != null && o.pct_resp_mulher_2010 != null ? o.pct_resp_mulher_sidra - o.pct_resp_mulher_2010 : null;
  // Das responsáveis mulheres: com cônjuge (três categorias), sem cônjuge com filhos, outras composições.
  o.pct_mulher_com_conjuge = totF > 0 ? (100 * (cf(72604, 100681) + cf(72605, 100681) + cf(72606, 100681))) / totF : null;
  o.pct_mulher_sem_conjuge_filhos = totF > 0 ? (100 * cf(72607, 100681)) / totF : null;
  o.pct_mulher_outras = totF > 0 ? (100 * cf(72608, 100681)) / totF : null;
  const totM = cf(72603, 100680);
  o.pct_homem_com_conjuge = totM > 0 ? (100 * (cf(72604, 100680) + cf(72605, 100680) + cf(72606, 100680))) / totM : null;
  o.pct_dom_mulher_sem_conjuge_filhos = totT > 0 ? (100 * cf(72607, 100681)) / totT : null;
  // Iluminação pública na face de quadra (setores da Pesquisa Urbanística do Entorno).
  const il = (cat) => S(cd, `iluminacao|9599|14:${cat}/125:2932`) ?? S(cd, chaveSidra(cd, 'iluminacao|9599|', new RegExp(`14:${cat}(\\/|$)`)));
  const ilT = il(200), ilS = il(72254);
  o.dom_entorno = ilT;
  o.pct_iluminacao = ilT > 0 && ilS != null ? (100 * ilS) / ilT : null;
  o.cobertura_entorno = ilT != null && o.dom > 0 ? (100 * ilT) / o.dom : null;
  // Rendimento médio das pessoas de 14 anos ou mais, por sexo (amostra).
  const rk = (sx) => S(cd, chaveSidra(cd, 'renda_sexo|13502|', new RegExp(`2:${sx}(\\/|$)`)));
  const rH = rk(4), rM = rk(5);
  o.renda_homens = rH; o.renda_mulheres = rM;
  o.razao_renda_sexo = rH > 0 && rM != null ? (100 * rM) / rH : null;
}
for (const L of [MUN, AP]) for (const o of L) o.log_renda_resp = o.renda_resp_media > 0 ? Math.log10(o.renda_resp_media) : null;

/* ---------------------------------------------------------------- testes */
const SERV = ['agua_rede', 'agua_dentro', 'esgoto_rede', 'lixo_coletado', 'banheiro'];
const CONTROLES = ['pct_urbana', 'log_densidade', 'log_renda_resp'];
const FAM = { log_renda_resp: 'renda', renda_resp_media: 'renda', razao_renda_sexo: 'renda', pct_urbana: 'urbano', log_densidade: 'densidade', pct_iluminacao: 'urbano' };
const PARES = [
  ...SERV.map((s) => ['pct_resp_mulher', `${s}_total`]),
  ...SERV.map((s) => ['pct_resp_mulher', `${s}_dif`]),
  ['pct_resp_mulher', 'renda_resp_media'],
  ['pct_resp_mulher', 'pct_urbana'],
  ['pct_resp_mulher', 'log_densidade'],
];
const PARES_MUN = [
  ['pct_resp_mulher', 'pct_iluminacao'],
  ['pct_resp_mulher', 'razao_renda_sexo'],
  ['pct_resp_mulher', 'renda_mulheres'],
  ['pct_resp_mulher', 'pct_mulher_sem_conjuge_filhos'],
  ['pct_resp_mulher', 'pct_mulher_com_conjuge'],
  ['pct_resp_mulher_2010', 'var_resp_mulher'],
  ['pct_resp_mulher', 'var_resp_mulher'],
  ['var_resp_mulher', 'pct_urbana'],
  ['var_resp_mulher', 'esgoto_rede_total'],
];

function testar(L, nivel, pares) {
  const P = pts[nivel];
  const ok = L.filter((o) => P.has(o.cd));
  const xy = ok.map((o) => { const t = P.get(o.cd); return plano([t[0] / t[2], t[1] / t[2]]); });
  const viz = knn(xy, 6);
  const idx = new Map(ok.map((o, i) => [o.cd, i]));
  const moranDe = (v) => {
    const z = ok.map((o) => o[v] ?? 0), m = ok.map((o) => o[v] != null);
    return moran(z, m, viz);
  };
  const out = [];
  for (const [x, y] of pares) {
    const ctl = CONTROLES.filter((c) => c !== x && c !== y && (!FAM[c] || (FAM[c] !== FAM[x] && FAM[c] !== FAM[y])));
    const s = ok.filter((o) => [x, y, ...ctl].every((k) => o[k] != null && Number.isFinite(o[k])));
    if (s.length < 30) continue;
    const a = s.map((o) => o[x]), b = s.map((o) => o[y]);
    const rho = spearman(a, b);
    const parc = spearmanParcial(a, b, ctl.map((c) => s.map((o) => o[c]))).r;
    const Ix = moranDe(x), Iy = moranDe(y);
    const ne = nEfetivo(s.length, Ix, Iy);
    out.push({ nivel, x, y, n: s.length, rho, parcial: parc, controles: ctl, Ix, Iy, n_eff: ne, p: pCorr(rho, s.length - 2), p_eff: pCorr(rho, ne - 2), p_parc_eff: pCorr(parc, ne - 2 - ctl.length) });
  }
  void idx;
  return { out, ok, viz };
}

const tm = testar(MUN, 'municipios', [...PARES, ...PARES_MUN]);
const ta = testar(AP, 'apond', PARES);
const todos = [...tm.out, ...ta.out];
const q = bh(todos.map((t) => t.p_eff)), qp = bh(todos.map((t) => t.p_parc_eff));
todos.forEach((t, i) => { t.q_eff = q[i]; t.q_parc_eff = qp[i]; });

const f = (v, c = 2) => (v == null || !Number.isFinite(v) ? '—' : v.toFixed(c));
console.log('nível       x × y                                        n     ρ      parcial  Ix    Iy    n_eff  q_eff   q_parc');
for (const t of todos) console.log(`${t.nivel.padEnd(11)} ${(t.x + ' × ' + t.y).padEnd(44)} ${String(t.n).padStart(5)}  ${f(t.rho).padStart(6)}  ${f(t.parcial).padStart(6)}  ${f(t.Ix)}  ${f(t.Iy)}  ${f(t.n_eff, 0).padStart(5)}  ${t.q_eff.toExponential(1)}  ${t.q_parc_eff.toExponential(1)}`);

/* ---------------------------------------------------------------- descrição */
const resumo = {};
const quart = (v) => { const a = v.filter((x) => x != null).sort((x, y) => x - y); const p = (k) => a[Math.floor(k * (a.length - 1))]; return { n: a.length, min: a[0], p25: p(0.25), med: p(0.5), p75: p(0.75), max: a.at(-1) }; };
for (const [nome, L] of [['municipios', MUN], ['apond', AP]]) {
  const r = (resumo[nome] = {});
  r.pct_resp_mulher = quart(L.map((o) => o.pct_resp_mulher));
  for (const s of SERV) {
    const v = L.filter((o) => o[`${s}_dif`] != null);
    r[s] = {
      dif: quart(v.map((o) => o[`${s}_dif`])),
      composicao: quart(v.map((o) => o[`${s}_dif_composicao`])),
      setor: quart(v.map((o) => o[`${s}_dif_setor`])),
      // Sinal robusto ao sigilo: o intervalo inteiro de um lado do zero.
      mulheres_menos: v.filter((o) => o[`${s}_dif_hi`] < 0).length,
      mulheres_mais: v.filter((o) => o[`${s}_dif_lo`] > 0).length,
      menos_1pp: v.filter((o) => o[`${s}_dif_hi`] <= -1).length,
      mais_1pp: v.filter((o) => o[`${s}_dif_lo`] >= 1).length,
      amplitude_sigilo: quart(v.map((o) => o[`${s}_dif_hi`] - o[`${s}_dif_lo`])),
    };
  }
}
for (const k of ['pct_resp_mulher_2010', 'pct_resp_mulher_sidra', 'var_resp_mulher', 'pct_mulher_com_conjuge', 'pct_homem_com_conjuge', 'pct_mulher_sem_conjuge_filhos', 'pct_iluminacao', 'cobertura_entorno', 'razao_renda_sexo']) resumo.municipios[k] = quart(MUN.map((o) => o[k]));
// Diferença entre a soma dos setores e o SIDRA (sigilo a 1,5 e domicílios improvisados).
resumo.municipios.dif_setores_sidra = quart(MUN.map((o) => (o.pct_resp_mulher != null && o.pct_resp_mulher_sidra != null ? o.pct_resp_mulher - o.pct_resp_mulher_sidra : null)));
console.log(JSON.stringify(resumo, null, 1).slice(0, 6000));

/* ---------------------------------------------------------------- LISA bivariado dos pares das pranchas */
const lisas = {};
for (const [nivel, L, T, pares] of [
  ['municipios', MUN, tm, [['pct_resp_mulher', 'esgoto_rede_total'], ['pct_resp_mulher', 'agua_rede_total'], ['pct_resp_mulher', 'pct_iluminacao'], ['pct_resp_mulher', 'razao_renda_sexo'], ['pct_resp_mulher', 'renda_resp_media'], ['pct_resp_mulher', 'pct_resp_mulher']]],
]) {
  for (const [x, y] of pares) {
    const idx = T.ok.map((o, i) => [o, i]).filter(([o]) => o[x] != null && o[y] != null);
    // A vizinhança é refeita só entre as unidades com dado.
    const sub = idx.map(([o]) => o);
    const xy = sub.map((o) => { const t = pts[nivel].get(o.cd); return plano([t[0] / t[2], t[1] / t[2]]); });
    const viz = knn(xy, 6);
    const r = lisaBivariado(sub.map((o) => o[x]), sub.map((o) => o[y]), viz);
    const cont = {};
    r.classe.forEach((c) => { cont[c] = (cont[c] ?? 0) + 1; });
    lisas[`${nivel}|${x}|${y}`] = { I: r.I, pI: r.pI, cont, classe: Object.fromEntries(sub.map((o, i) => [o.cd, r.classe[i]])) };
    console.log(`LISA ${nivel} ${x} × ${y}: I = ${r.I.toFixed(3)} (p ${r.pI.toFixed(3)}) ·`, cont);
  }
}

writeFileSync(join(DIR, 'estatistica.json'), JSON.stringify({ testes: todos, resumo, lisas }, null, 1));
writeFileSync(join(DIR, 'municipios-sidra.json'), JSON.stringify(Object.fromEntries(MUN.map((o) => [o.cd, o]))));
console.log('✓ estatistica.json');
