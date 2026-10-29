// Coleção «Bioenergia cruzada» (bioenergia-cruzada-sp), passo 3: LISA bivariado dos pares das pranchas (uso interno).
//   node scripts/colecoes/bioenergia-cruzada-sp/lisa.mjs scripts/colecoes/bioenergia-cruzada-sp/pares_lisa.json
// Postos padronizados, KNN-6, 999 permutações condicionais, semente 20261019. Saída: bioenergia/triagem/lisa.json e lisa_municipios.csv.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SP, RGINT_MUN, NOME_RGINT } from '../lib/cruzamentos.mjs';
import { pontoInterno, BRUTOS } from '../lib/dados.mjs';

const RAIZ = join(BRUTOS, 'analises');
const PARES = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const PERM = 999, K = 6, ALFA = 0.05;

const L = readFileSync(join(RAIZ, 'base/municipios.csv'), 'utf8').trim().split('\n');
const cab = L[0].split(',');
const MUN = L.slice(1).map((l) => {
  const c = l.match(/("([^"]|"")*"|[^,]*)(,|$)/g).map((x) => x.replace(/,$/, ''));
  return Object.fromEntries(cab.map((k, i) => [k, c[i] === '' ? null : c[i].startsWith('"') ? c[i].slice(1, -1) : Number(c[i])]));
});
{ const B = readFileSync(join(RAIZ, 'bioenergia/base_bio.csv'), 'utf8').trim().split(/\r?\n/); const cb = B[0].split(',');
  const mapa = new Map(B.slice(1).map((l) => { const c = l.split(','); return [c[0], Object.fromEntries(cb.slice(1).map((k, i) => [k, c[i + 1] === '' ? null : Number(c[i + 1])]))]; }));
  for (const o of MUN) Object.assign(o, mapa.get(o.cd)); }
const geo = new Map(SP.municipios.features.map((f) => [f.properties.CD_MUN, f.geometry]));
const XY = MUN.map((o) => { const [lon, lat] = pontoInterno(geo.get(o.cd)); return [lon * Math.cos((22.5 * Math.PI) / 180), lat]; });

// Gerador determinístico, para o resultado se repetir.
let semente = 20261019;
const aleat = () => ((semente = (semente * 1664525 + 1013904223) >>> 0) / 4294967296);
function postosZ(v) {
  const idx = v.map((x, i) => [x, i]).sort((a, b) => a[0] - b[0]); const r = new Array(v.length);
  for (let i = 0; i < idx.length;) { let j = i; while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++; for (let k = i; k <= j; k++) r[idx[k][1]] = (i + j) / 2 + 1; i = j + 1; }
  const m = r.reduce((a, b) => a + b, 0) / r.length, sd = Math.sqrt(r.reduce((a, b) => a + (b - m) ** 2, 0) / r.length);
  return r.map((x) => (x - m) / sd);
}

const resumo = {}; const porMun = new Map(MUN.map((o) => [o.cd, { cd: o.cd, NM_MUN: o.NM_MUN }]));
for (const [x, y] of PARES) {
  const ids = MUN.map((o, i) => (o[x] != null && o[y] != null ? i : -1)).filter((i) => i >= 0);
  const m = ids.length;
  const zx = postosZ(ids.map((i) => MUN[i][x])), zy = postosZ(ids.map((i) => MUN[i][y]));
  const pts = ids.map((i) => XY[i]);
  const viz = pts.map(([a, b], i) => pts.map(([c, d], j) => [j, (c - a) ** 2 + (d - b) ** 2]).filter(([j]) => j !== i).sort((p, q) => p[1] - q[1]).slice(0, K).map(([j]) => j));
  const cont = { AA: 0, BB: 0, AB: 0, BA: 0, ns: 0 }; const reg = {};
  for (let i = 0; i < m; i++) {
    const lag = viz[i].reduce((s, j) => s + zy[j], 0) / K;
    const Ii = zx[i] * lag;
    let ext = 0; const outros = []; for (let j = 0; j < m; j++) if (j !== i) outros.push(j);
    for (let p = 0; p < PERM; p++) {
      let s = 0; for (let k = 0; k < K; k++) { const t = k + Math.floor(aleat() * (outros.length - k)); [outros[k], outros[t]] = [outros[t], outros[k]]; s += zy[outros[k]]; }
      const Ip = zx[i] * (s / K);
      if (Ii >= 0 ? Ip >= Ii : Ip <= Ii) ext++;
    }
    const p = (ext + 1) / (PERM + 1);
    const cls = p > ALFA ? 'ns' : zx[i] >= 0 ? (lag >= 0 ? 'AA' : 'AB') : lag >= 0 ? 'BA' : 'BB';
    cont[cls]++;
    porMun.get(MUN[ids[i]].cd)[`${x}~${y}`] = cls;
    if (cls !== 'ns') { const rg = NOME_RGINT.get(RGINT_MUN.get(MUN[ids[i]].cd)); (reg[rg] ??= { AA: 0, BB: 0, AB: 0, BA: 0 })[cls]++; }
  }
  // I de Moran bivariado global e seu teste por permutação total.
  const Ig = zx.reduce((s, v, i) => s + v * (viz[i].reduce((a, j) => a + zy[j], 0) / K), 0) / m;
  let ext = 0; const perm = [...zy];
  for (let p = 0; p < PERM; p++) {
    for (let k = m - 1; k > 0; k--) { const t = Math.floor(aleat() * (k + 1)); [perm[k], perm[t]] = [perm[t], perm[k]]; }
    const Ip = zx.reduce((s, v, i) => s + v * (viz[i].reduce((a, j) => a + perm[j], 0) / K), 0) / m;
    if (Math.abs(Ip) >= Math.abs(Ig)) ext++;
  }
  const exemplos = (c) => ids.filter((i) => porMun.get(MUN[i].cd)[`${x}~${y}`] === c).sort((a, b) => (MUN[b].pessoas ?? 0) - (MUN[a].pessoas ?? 0)).slice(0, 6).map((i) => MUN[i].NM_MUN);
  resumo[`${x}~${y}`] = {
    n: m, moran_biv: +Ig.toFixed(3), p_moran_biv: (ext + 1) / (PERM + 1), ...cont,
    regioes: Object.entries(reg).sort((a, b) => b[1].AA + b[1].BB - a[1].AA - a[1].BB).slice(0, 5),
    ex_AA: exemplos('AA'), ex_BB: exemplos('BB'), ex_AB: exemplos('AB'), ex_BA: exemplos('BA'),
  };
  console.log(`${x} × ${y}: I_biv ${Ig.toFixed(3)} (p ${resumo[`${x}~${y}`].p_moran_biv}) · AA ${cont.AA} BB ${cont.BB} AB ${cont.AB} BA ${cont.BA}`);
}
writeFileSync(join(RAIZ, 'bioenergia/triagem/lisa.json'), JSON.stringify(resumo, null, 1));
const colsL = ['cd', 'NM_MUN', ...PARES.map(([x, y]) => `${x}~${y}`)];
writeFileSync(join(RAIZ, 'bioenergia/triagem/lisa_municipios.csv'), [colsL.join(','), ...[...porMun.values()].map((o) => colsL.map((c) => (c === 'NM_MUN' ? `"${o[c]}"` : o[c] ?? '')).join(','))].join('\n'));
