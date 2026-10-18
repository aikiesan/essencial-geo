/**
 * Friso da coleção «Dejetos que adubam»: galpões de aves e biodigestores em cúpula, e arcos tracejados que
 * levam o que sai deles de volta às fileiras de brotos da lavoura.
 */
import { CESTO, VALE } from '../lib/arte.mjs';

const f1 = (v) => Math.round(v * 10) / 10;
function sorte(semente) {
  let s = semente >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

/** Galpão de aves visto de lado: corpo baixo e comprido, telhado de duas águas e a fila de janelas. */
function galpao(x, chao, larg, alt) {
  const s = [];
  const beiral = chao - alt;
  s.push(`<path d="M${f1(x)} ${f1(chao)}V${f1(beiral)}L${f1(x + larg / 2)} ${f1(beiral - alt * 0.45)}L${f1(x + larg)} ${f1(beiral)}V${f1(chao)}" fill="none" stroke="${VALE}" stroke-width="1"/>`);
  const n = Math.max(3, Math.round(larg / 9));
  for (let i = 1; i < n; i++) {
    const xj = x + (i * larg) / n;
    s.push(`<path d="M${f1(xj - 1.8)} ${f1(beiral + alt * 0.32)}h3.6" stroke="${VALE}" stroke-width=".9"/>`);
  }
  return s.join('');
}

/** Broto de duas folhas, com a altura dada. */
function broto(x, chao, a) {
  return `<path d="M${f1(x)} ${f1(chao)}V${f1(chao - a)}M${f1(x)} ${f1(chao - a * 0.55)}q${f1(-a * 0.45)} ${f1(-a * 0.15)} ${f1(-a * 0.55)} ${f1(-a * 0.6)}M${f1(x)} ${f1(chao - a * 0.7)}q${f1(a * 0.45)} ${f1(-a * 0.15)} ${f1(a * 0.55)} ${f1(-a * 0.6)}" fill="none" stroke="${VALE}" stroke-width=".9" stroke-linecap="round"/>`;
}

export function friso(w, h) {
  const r = sorte(81);
  const s = [];
  const chao = h - 6;
  s.push(`<path d="M0 ${f1(chao)}H${w}" stroke="${VALE}" stroke-width="1.1"/>`);
  // Fazendas a intervalos irregulares: um galpão e, ao lado, a cúpula do biodigestor.
  const fazendas = [];
  for (let x = 30 + r() * 30; x < w - 120; x += 210 + r() * 90) fazendas.push(x);
  const ocupado = [];
  for (const x of fazendas) {
    const lg = 46 + r() * 18, ag = 9 + r() * 3;
    s.push(galpao(x, chao, lg, ag));
    const rd = 9 + r() * 3, cx = x + lg + 10 + rd;
    s.push(`<path d="M${f1(cx - rd)} ${f1(chao)}A${f1(rd)} ${f1(rd * 0.85)} 0 0 1 ${f1(cx + rd)} ${f1(chao)}" fill="none" stroke="${VALE}" stroke-width="1.2"/>`);
    ocupado.push([x - 6, cx + rd + 6]);
    // Dois arcos tracejados, um para cada lado, que pousam sobre as fileiras.
    for (const lado of [-1, 1]) {
      const alcance = 60 + r() * 50;
      const x0 = lado > 0 ? cx : x + lg * 0.3;
      const x1 = x0 + lado * alcance;
      if (x1 < 4 || x1 > w - 4) continue;
      const topo = chao - h * (0.55 + r() * 0.25);
      s.push(`<path d="M${f1(x0)} ${f1(chao - rd * 0.9)}Q${f1((x0 + x1) / 2)} ${f1(topo)} ${f1(x1)} ${f1(chao - 12)}" fill="none" stroke="${CESTO}" stroke-width="1" stroke-dasharray="${lado > 0 ? '5 3' : '2 3'}"/>`);
    }
  }
  // Fileiras de brotos no que sobra do chão.
  for (let x = 8 + r() * 6; x < w - 6; x += 9 + r() * 5) {
    if (ocupado.some(([a, b]) => x > a && x < b)) continue;
    s.push(broto(x, chao, 6 + r() * 5));
  }
  return `<g clip-path="url(#motivo-recorte)">${s.join('')}</g>`;
}
