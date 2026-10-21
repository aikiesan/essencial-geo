// Coleção «O Censo cruzado» (censo-cruzado-sp), passo 3 de 3. Triagem de correlações entre as variáveis da base municipal (base.mjs), só com Node.
// Para cada par: Spearman, Spearman parcial (controles: urbanização, densidade e renda), tamanho efetivo da
// amostra sob autocorrelação espacial (Moran I dos resíduos, vizinhança KNN-6), p e q (Benjamini–Hochberg),
// robustez sem a capital e sem a Região Intermediária de São Paulo, e o Spearman no nível das APOND (MAUP).
// Saídas em dados-brutos/analises/triagem/: pares.csv, moran.csv.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { SP, RGINT_MUN } from '../lib/cruzamentos.mjs';
import { pontoInterno, BRUTOS } from '../lib/dados.mjs';

const RAIZ = join(BRUTOS, 'analises');
const OUT = join(RAIZ, 'triagem');
mkdirSync(OUT, { recursive: true });
const N_MIN = 300;
const CONTROLES = ['pct_urbana', 'log_densidade', 'log_renda_pc'];
// Famílias: pares da mesma família são ligados por construção e não contam como achado.
const FAMILIA = {
  log_renda_pc: 'renda', renda_resp_media: 'renda', renda_pc_media: 'renda', renda_pc_mediana: 'renda',
  pct_urbana: 'urbano', log_densidade: 'densidade',
  log_biometano_hab: 'agroenergia', log_biometano_km2: 'agroenergia', pct_biometano_cana: 'agroenergia', pct_biometano_pecuaria: 'agroenergia',
  log_co2_biogenico_hab: 'agroenergia', n_kg_ha_agro: 'agroenergia', log_dens_bovino: 'agroenergia', log_dens_aves: 'agroenergia',
  pct_area_cana: 'agroenergia', pct_area_pastagem: 'agroenergia', pct_area_silvicultura: 'agroenergia', pct_area_citros: 'agroenergia', cana_t_ha: 'agroenergia',
  pct_bioeconomia: 'bioeconomia', pct_ind_residuo: 'bioeconomia', residuos_10mil: 'bioeconomia', pct_ocup_agro: 'bioeconomia',
};

/* ------------------------------------------------------------------ leitura */
function lerCsv(arq) {
  const L = readFileSync(arq, 'utf8').trim().split('\n');
  const cab = L[0].split(',');
  return L.slice(1).map((l) => {
    const c = l.match(/("([^"]|"")*"|[^,]*)(,|$)/g).map((x) => x.replace(/,$/, ''));
    return Object.fromEntries(cab.map((k, i) => [k, c[i] === '' || c[i] == null ? null : c[i].startsWith('"') ? c[i].slice(1, -1) : Number(c[i])]));
  });
}
const VARS = JSON.parse(readFileSync(join(RAIZ, 'base/variaveis.json'), 'utf8'));
const MUN = lerCsv(join(RAIZ, 'base/municipios.csv'));
const AP = lerCsv(join(RAIZ, 'base/apond.csv'));
const nomes = Object.keys(VARS);
const fam = (v) => FAMILIA[v] ?? VARS[v].grupo;
const n = MUN.length;

/* ------------------------------------------------------------------ estatística */
function postos(v) { // postos médios nos empates
  const idx = v.map((x, i) => [x, i]).sort((a, b) => a[0] - b[0]);
  const r = new Array(v.length);
  for (let i = 0; i < idx.length;) {
    let j = i; while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++;
    for (let k = i; k <= j; k++) r[idx[k][1]] = (i + j) / 2 + 1;
    i = j + 1;
  }
  return r;
}
function pearson(a, b) {
  const m = a.length; let sa = 0, sb = 0; for (let i = 0; i < m; i++) { sa += a[i]; sb += b[i]; }
  const ma = sa / m, mb = sb / m; let num = 0, da = 0, db = 0;
  for (let i = 0; i < m; i++) { const x = a[i] - ma, y = b[i] - mb; num += x * y; da += x * x; db += y * y; }
  return da > 0 && db > 0 ? num / Math.sqrt(da * db) : NaN;
}
function residuos(y, X) { // MQO de y sobre [1, X...] por equações normais
  const m = y.length, k = X.length + 1;
  const col = (j, i) => (j === 0 ? 1 : X[j - 1][i]);
  const A = Array.from({ length: k }, () => new Array(k + 1).fill(0));
  for (let i = 0; i < m; i++) for (let p = 0; p < k; p++) { for (let q = 0; q < k; q++) A[p][q] += col(p, i) * col(q, i); A[p][k] += col(p, i) * y[i]; }
  for (let p = 0; p < k; p++) { // Gauss-Jordan
    let piv = p; for (let r = p + 1; r < k; r++) if (Math.abs(A[r][p]) > Math.abs(A[piv][p])) piv = r;
    [A[p], A[piv]] = [A[piv], A[p]];
    for (let r = 0; r < k; r++) if (r !== p) { const f = A[r][p] / A[p][p]; for (let c = p; c <= k; c++) A[r][c] -= f * A[p][c]; }
  }
  const b = A.map((r, p) => r[k] / r[p]);
  return y.map((v, i) => { let f = 0; for (let p = 0; p < k; p++) f += b[p] * col(p, i); return v - f; });
}
function lgamma(x) {
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t); let s = 1.000000000190015;
  for (const v of c) s += v / ++y;
  return -t + Math.log((2.5066282746310005 * s) / x);
}
function betacf(a, b, x) {
  let qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - (qab * x) / qap;
  if (Math.abs(d) < 1e-300) d = 1e-300; d = 1 / d; let h = d;
  for (let m = 1; m <= 300; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < 1e-300) d = 1e-300; c = 1 + aa / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d; if (Math.abs(d) < 1e-300) d = 1e-300; c = 1 + aa / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d;
    const del = d * c; h *= del; if (Math.abs(del - 1) < 3e-12) break;
  }
  return h;
}
function betai(a, b, x) {
  if (x <= 0) return 0; if (x >= 1) return 1;
  const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? (bt * betacf(a, b, x)) / a : 1 - (bt * betacf(b, a, 1 - x)) / b;
}
function pCorr(r, df) { // bicaudal, t = r √(df / (1 − r²))
  if (!(df > 0) || !Number.isFinite(r)) return NaN;
  if (Math.abs(r) >= 1) return 0;
  const t2 = (r * r * df) / (1 - r * r);
  return betai(df / 2, 0.5, df / (df + t2));
}
function bh(ps) {
  const idx = ps.map((p, i) => [p, i]).filter(([p]) => Number.isFinite(p)).sort((a, b) => a[0] - b[0]);
  const q = new Array(ps.length).fill(NaN); let min = 1;
  for (let k = idx.length - 1; k >= 0; k--) { min = Math.min(min, (idx[k][0] * idx.length) / (k + 1)); q[idx[k][1]] = min; }
  return q;
}

/* ------------------------------------------------------------------ vizinhança KNN-6 */
const geo = new Map(SP.municipios.features.map((f) => [f.properties.CD_MUN, f.geometry]));
const XY = MUN.map((o) => { const [lon, lat] = pontoInterno(geo.get(o.cd)); return [lon * Math.cos((22.5 * Math.PI) / 180), lat]; });
const K = 6;
const VIZ = XY.map(([x, y], i) => XY.map(([a, b], j) => [j, (a - x) ** 2 + (b - y) ** 2]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]).slice(0, K).map(([j]) => j));
// Moran I com pesos padronizados por linha, só entre unidades com dado (vizinhos sem dado saem).
function moran(z, ok) { // z: valores nas posições 0..n-1, ok: máscara
  let s = 0, m = 0; for (let i = 0; i < n; i++) if (ok[i]) { s += z[i]; m++; }
  const mu = s / m; let num = 0, den = 0, w = 0;
  for (let i = 0; i < n; i++) {
    if (!ok[i]) continue; const d = z[i] - mu; den += d * d;
    const vs = VIZ[i].filter((j) => ok[j]); if (!vs.length) continue;
    let lag = 0; for (const j of vs) lag += z[j] - mu; num += (d * lag) / vs.length; w++;
  }
  return (m / w) * (num / den);
}
function moranBiv(zx, zy, ok) { // I_xy = Σ zx_i · lag(zy)_i / Σ zx², com zx e zy padronizados
  const pad = (z) => { let s = 0, s2 = 0, m = 0; for (let i = 0; i < n; i++) if (ok[i]) { s += z[i]; s2 += z[i] ** 2; m++; } const mu = s / m, sd = Math.sqrt(s2 / m - mu * mu); return z.map((v) => (v - mu) / sd); };
  const a = pad(zx), b = pad(zy); let num = 0, m = 0;
  for (let i = 0; i < n; i++) { if (!ok[i]) continue; m++; const vs = VIZ[i].filter((j) => ok[j]); if (!vs.length) continue; let lag = 0; for (const j of vs) lag += b[j]; num += (a[i] * lag) / vs.length; }
  return num / m;
}

/* ------------------------------------------------------------------ Moran de cada variável */
const MORAN = {};
const linhasMoran = [];
for (const v of nomes) {
  const ok = MUN.map((o) => o[v] != null);
  const vals = MUN.map((o) => o[v] ?? 0);
  const r = postos(vals.filter((_, i) => ok[i])); const z = new Array(n).fill(0); let k = 0; for (let i = 0; i < n; i++) if (ok[i]) z[i] = r[k++];
  MORAN[v] = moran(z, ok);
  linhasMoran.push([v, VARS[v].grupo, ok.filter(Boolean).length, MORAN[v].toFixed(3)]);
}
writeFileSync(join(OUT, 'moran.csv'), ['variavel,grupo,n,moran_I_postos', ...linhasMoran.sort((a, b) => b[3] - a[3]).map((l) => l.join(','))].join('\n'));

/* ------------------------------------------------------------------ pares */
const capital = MUN.findIndex((o) => o.cd === '3550308');
const rgintSP = MUN.map((o) => RGINT_MUN.get(o.cd) === '3501');
const apMap = AP.map((o) => o);
function spearmanSub(x, y, filtro) {
  const a = [], b = [];
  for (let i = 0; i < n; i++) if (filtro(i) && MUN[i][x] != null && MUN[i][y] != null) { a.push(MUN[i][x]); b.push(MUN[i][y]); }
  return a.length >= N_MIN * 0.8 ? pearson(postos(a), postos(b)) : NaN;
}
function parcial(x, y, filtro = () => true) {
  const ctrl = CONTROLES.filter((c) => c !== x && c !== y && fam(c) !== fam(x) && fam(c) !== fam(y));
  const idx = []; for (let i = 0; i < n; i++) if (filtro(i) && [x, y, ...ctrl].every((v) => MUN[i][v] != null)) idx.push(i);
  if (idx.length < N_MIN * 0.8) return null;
  const R = (v) => postos(idx.map((i) => MUN[i][v]));
  const C = ctrl.map(R);
  const rx = residuos(R(x), C), ry = residuos(R(y), C);
  return { r: pearson(rx, ry), m: idx.length, k: ctrl.length, idx, rx, ry, ctrl };
}
const pares = [];
for (let a = 0; a < nomes.length; a++) for (let b = a + 1; b < nomes.length; b++) {
  const x = nomes[a], y = nomes[b];
  const idx = []; for (let i = 0; i < n; i++) if (MUN[i][x] != null && MUN[i][y] != null) idx.push(i);
  if (idx.length < N_MIN) continue;
  const rho = pearson(postos(idx.map((i) => MUN[i][x])), postos(idx.map((i) => MUN[i][y])));
  const pa = parcial(x, y);
  // Tamanho efetivo pelos Moran dos resíduos parciais (Clifford e Richardson, aproximação de Dutilleul).
  let Ix = NaN, Iy = NaN, neff = NaN, pEff = NaN;
  if (pa) {
    const ok = new Array(n).fill(false), zx = new Array(n).fill(0), zy = new Array(n).fill(0);
    pa.idx.forEach((i, k) => { ok[i] = true; zx[i] = pa.rx[k]; zy[i] = pa.ry[k]; });
    Ix = moran(zx, ok); Iy = moran(zy, ok);
    const prod = Math.max(0, Ix * Iy);
    neff = Math.max(10, Math.min(pa.m, (pa.m * (1 - prod)) / (1 + prod)));
    pEff = pCorr(pa.r, neff - 2 - pa.k);
  }
  const pas = parcial(x, y, (i) => i !== capital), par = parcial(x, y, (i) => !rgintSP[i]);
  // APOND (só variáveis agregadas dos setores).
  let rAp = NaN, nAp = 0;
  if (VARS[x].nivel.includes('apond') && VARS[y].nivel.includes('apond')) {
    const s = apMap.filter((o) => o[x] != null && o[y] != null && o.pessoas >= 1000);
    nAp = s.length; if (nAp >= 300) rAp = pearson(postos(s.map((o) => o[x])), postos(s.map((o) => o[y])));
  }
  pares.push({
    x, y, gx: VARS[x].grupo, gy: VARS[y].grupo, mesma_familia: fam(x) === fam(y) ? 1 : 0, n: idx.length,
    rho, p: pCorr(rho, idx.length - 2), rho_parcial: pa?.r ?? NaN, controles: pa?.ctrl.join('+') ?? '', n_parcial: pa?.m ?? 0,
    I_res_x: Ix, I_res_y: Iy, n_eff: neff, p_eff: pEff,
    rho_parcial_sem_capital: pas?.r ?? NaN, rho_parcial_sem_rgint_sp: par?.r ?? NaN,
    rho_sem_rgint_sp: spearmanSub(x, y, (i) => !rgintSP[i]),
    moran_biv: NaN, rho_apond: rAp, n_apond: nAp,
  });
}
const q = bh(pares.map((p) => p.p_eff));
pares.forEach((p, i) => { p.q_eff = q[i]; });
const qRaw = bh(pares.map((p) => p.p));
pares.forEach((p, i) => { p.q = qRaw[i]; });
// Moran bivariado (postos brutos) para os pares que passam.
for (const p of pares) {
  if (!(Math.abs(p.rho) >= 0.3 || Math.abs(p.rho_parcial) >= 0.3)) continue;
  const ok = MUN.map((o) => o[p.x] != null && o[p.y] != null);
  const sub = (v) => { const r = postos(MUN.filter((_, i) => ok[i]).map((o) => o[v])); const z = new Array(n).fill(0); let k = 0; for (let i = 0; i < n; i++) if (ok[i]) z[i] = r[k++]; return z; };
  p.moran_biv = moranBiv(sub(p.x), sub(p.y), ok);
}
const cols = Object.keys(pares[0]).concat(['Ix_var', 'Iy_var']);
pares.forEach((p) => { p.Ix_var = MORAN[p.x]; p.Iy_var = MORAN[p.y]; });
pares.sort((a, b) => Math.abs(b.rho_parcial) - Math.abs(a.rho_parcial));
const fmt = (v) => (typeof v === 'number' ? (Number.isFinite(v) ? (Math.abs(v) < 1e-4 && v !== 0 ? v.toExponential(2) : +v.toFixed(4)) : '') : v);
writeFileSync(join(OUT, 'pares.csv'), [cols.join(','), ...pares.map((p) => cols.map((c) => fmt(p[c])).join(','))].join('\n'));
const passa = pares.filter((p) => !p.mesma_familia && p.q_eff < 0.05 && Math.abs(p.rho) >= 0.3);
console.log(`pares testados ${pares.length} · entre famílias ${pares.filter((p) => !p.mesma_familia).length}`);
console.log(`q_eff < 0,05 e |ρ| ≥ 0,3 entre famílias: ${passa.length} · com |ρ parcial| ≥ 0,3: ${passa.filter((p) => Math.abs(p.rho_parcial) >= 0.3).length}`);
writeFileSync(join(OUT, 'resumo.json'), JSON.stringify({
  pares: pares.length, entre_familias: pares.filter((p) => !p.mesma_familia).length,
  passam: passa.length, passam_parcial: passa.filter((p) => Math.abs(p.rho_parcial) >= 0.3).length,
}));
