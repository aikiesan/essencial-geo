/**
 * Coleção «O Censo cruzado» — estatística das correlações, só com Node (uso interno).
 *
 * Spearman (postos médios nos empates), Spearman parcial (resíduos dos postos por MQO sobre os postos dos
 * controles), p bicaudal pela t de Student (beta incompleta), Benjamini–Hochberg, vizinhança KNN, I de Moran
 * (univariado e bivariado, pesos padronizados por linha) e LISA bivariado com permutações condicionais.
 */

/** Postos 1..n, com a média dos postos nos empates. */
export function postos(v) {
  const idx = v.map((x, i) => [x, i]).sort((a, b) => a[0] - b[0]);
  const r = new Array(v.length);
  for (let i = 0; i < idx.length;) {
    let j = i;
    while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++;
    for (let k = i; k <= j; k++) r[idx[k][1]] = (i + j) / 2 + 1;
    i = j + 1;
  }
  return r;
}

export function pearson(a, b) {
  const m = a.length;
  let sa = 0, sb = 0;
  for (let i = 0; i < m; i++) { sa += a[i]; sb += b[i]; }
  const ma = sa / m, mb = sb / m;
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < m; i++) { const x = a[i] - ma, y = b[i] - mb; num += x * y; da += x * x; db += y * y; }
  return da > 0 && db > 0 ? num / Math.sqrt(da * db) : NaN;
}

export const spearman = (a, b) => pearson(postos(a), postos(b));

/** Resíduos do MQO de y sobre [1, X...], por equações normais (Gauss-Jordan). */
export function residuos(y, X) {
  const m = y.length, k = X.length + 1;
  const col = (j, i) => (j === 0 ? 1 : X[j - 1][i]);
  const A = Array.from({ length: k }, () => new Array(k + 1).fill(0));
  for (let i = 0; i < m; i++) for (let p = 0; p < k; p++) { for (let q = 0; q < k; q++) A[p][q] += col(p, i) * col(q, i); A[p][k] += col(p, i) * y[i]; }
  for (let p = 0; p < k; p++) {
    let piv = p;
    for (let r = p + 1; r < k; r++) if (Math.abs(A[r][p]) > Math.abs(A[piv][p])) piv = r;
    [A[p], A[piv]] = [A[piv], A[p]];
    for (let r = 0; r < k; r++) if (r !== p) { const f = A[r][p] / A[p][p]; for (let c = p; c <= k; c++) A[r][c] -= f * A[p][c]; }
  }
  const b = A.map((r, p) => r[k] / r[p]);
  return y.map((v, i) => { let f = 0; for (let p = 0; p < k; p++) f += b[p] * col(p, i); return v - f; });
}

/** Spearman parcial de x e y dados os controles (vetores já alinhados, sem nulos). */
export function spearmanParcial(x, y, controles) {
  const C = controles.map(postos);
  const rx = residuos(postos(x), C), ry = residuos(postos(y), C);
  return { r: pearson(rx, ry), rx, ry };
}

function lgamma(x) {
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = x, t = x + 5.5;
  t -= (x + 0.5) * Math.log(t);
  let s = 1.000000000190015;
  for (const v of c) s += v / ++y;
  return -t + Math.log((2.5066282746310005 * s) / x);
}
function betacf(a, b, x) {
  const qab = a + b, qap = a + 1, qam = a - 1;
  let c = 1, d = 1 - (qab * x) / qap;
  if (Math.abs(d) < 1e-300) d = 1e-300;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= 300; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < 1e-300) d = 1e-300;
    c = 1 + aa / c; if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d; h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d; if (Math.abs(d) < 1e-300) d = 1e-300;
    c = 1 + aa / c; if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 3e-12) break;
  }
  return h;
}
function betai(a, b, x) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? (bt * betacf(a, b, x)) / a : 1 - (bt * betacf(b, a, 1 - x)) / b;
}
/** p bicaudal de uma correlação r com df graus de liberdade: t = r √(df / (1 − r²)). */
export function pCorr(r, df) {
  if (!(df > 0) || !Number.isFinite(r)) return NaN;
  if (Math.abs(r) >= 1) return 0;
  const t2 = (r * r * df) / (1 - r * r);
  return betai(df / 2, 0.5, df / (df + t2));
}

/** q de Benjamini–Hochberg (FDR) para uma lista de p. */
export function bh(ps) {
  const idx = ps.map((p, i) => [p, i]).filter(([p]) => Number.isFinite(p)).sort((a, b) => a[0] - b[0]);
  const q = new Array(ps.length).fill(NaN);
  let min = 1;
  for (let k = idx.length - 1; k >= 0; k--) { min = Math.min(min, (idx[k][0] * idx.length) / (k + 1)); q[idx[k][1]] = min; }
  return q;
}

/** Vizinhos mais próximos (k) de cada ponto [x, y] já em coordenadas planas. */
export function knn(pts, k = 6) {
  return pts.map(([x, y], i) => pts.map(([a, b], j) => [j, (a - x) ** 2 + (b - y) ** 2]).filter(([j]) => j !== i)
    .sort((a, b) => a[1] - b[1]).slice(0, k).map(([j]) => j));
}
/** Lon/lat em plano aproximado para o KNN (cosseno da latitude média de SP). */
export const plano = ([lon, lat]) => [lon * Math.cos((22.5 * Math.PI) / 180), lat];

/** I de Moran de z (posições 0..n-1) só entre unidades com dado (ok); vizinhos sem dado saem da média. */
export function moran(z, ok, viz) {
  const n = z.length;
  let s = 0, m = 0;
  for (let i = 0; i < n; i++) if (ok[i]) { s += z[i]; m++; }
  const mu = s / m;
  let num = 0, den = 0, w = 0;
  for (let i = 0; i < n; i++) {
    if (!ok[i]) continue;
    const d = z[i] - mu;
    den += d * d;
    const vs = viz[i].filter((j) => ok[j]);
    if (!vs.length) continue;
    let lag = 0;
    for (const j of vs) lag += z[j] - mu;
    num += (d * lag) / vs.length;
    w++;
  }
  return (m / w) * (num / den);
}

/** Tamanho efetivo da amostra sob autocorrelação (Clifford e Richardson): n(1 − IₓI_y)/(1 + IₓI_y). */
export const nEfetivo = (n, ix, iy) => { const p = Math.max(0, ix * iy); return Math.max(10, Math.min(n, (n * (1 - p)) / (1 + p))); };

/** Gerador determinístico, para as permutações se repetirem. */
export function sorteio(semente = 20261019) {
  let s = semente >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/** Postos padronizados (média 0, desvio 1). */
export function postosZ(v) {
  const r = postos(v);
  const m = r.reduce((a, b) => a + b, 0) / r.length;
  const sd = Math.sqrt(r.reduce((a, b) => a + (b - m) ** 2, 0) / r.length);
  return r.map((x) => (x - m) / sd);
}

/**
 * Moran bivariado global e LISA bivariado (x no lugar, y na vizinhança) com permutações condicionais.
 * Devolve { I, pI, classe: ['AA'|'BB'|'AB'|'BA'|'ns'], p } para unidades já filtradas (sem nulos).
 */
export function lisaBivariado(x, y, viz, { permutacoes = 999, alfa = 0.05, semente = 20261019 } = {}) {
  const aleat = sorteio(semente);
  const zx = postosZ(x), zy = postosZ(y);
  const m = zx.length;
  const lag = (z, i) => viz[i].reduce((s, j) => s + z[j], 0) / viz[i].length;
  const classe = new Array(m), p = new Array(m);
  const outros = [];
  for (let i = 0; i < m; i++) {
    const l = lag(zy, i), Ii = zx[i] * l, K = viz[i].length;
    outros.length = 0;
    for (let j = 0; j < m; j++) if (j !== i) outros.push(j);
    let ext = 0;
    for (let q = 0; q < permutacoes; q++) {
      let s = 0;
      for (let k = 0; k < K; k++) { const t = k + Math.floor(aleat() * (outros.length - k)); [outros[k], outros[t]] = [outros[t], outros[k]]; s += zy[outros[k]]; }
      const Ip = zx[i] * (s / K);
      if (Ii >= 0 ? Ip >= Ii : Ip <= Ii) ext++;
    }
    p[i] = (ext + 1) / (permutacoes + 1);
    classe[i] = p[i] > alfa ? 'ns' : zx[i] >= 0 ? (l >= 0 ? 'AA' : 'AB') : l >= 0 ? 'BA' : 'BB';
  }
  const global = (zz) => zx.reduce((s, v, i) => s + v * lag(zz, i), 0) / m;
  const I = global(zy);
  let ext = 0;
  const perm = [...zy];
  for (let q = 0; q < permutacoes; q++) {
    for (let k = m - 1; k > 0; k--) { const t = Math.floor(aleat() * (k + 1)); [perm[k], perm[t]] = [perm[t], perm[k]]; }
    if (Math.abs(global(perm)) >= Math.abs(I)) ext++;
  }
  return { I, pI: (ext + 1) / (permutacoes + 1), classe, p };
}
