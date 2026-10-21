/**
 * Friso da coleção «O Censo cruzado»: gráficos de dispersão em sequência. Cada trecho tem um par de eixos,
 * uma nuvem de pontos com sua reta de tendência (subindo ou descendo) e, entre eles, a grade 3 × 3 dos terços.
 */
import { CESTO, VALE } from '../lib/arte.mjs';

const f1 = (v) => Math.round(v * 10) / 10;
function sorte(semente) {
  let s = semente >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

export function friso(w, h) {
  const r = sorte(93);
  const s = [];
  const chao = h - 8;
  for (let x0 = 8, k = 0; x0 < w - 30; k++) {
    if (k % 3 === 2) {
      // Grade dos terços.
      const q = (h - 22) / 3;
      for (let i = 0; i <= 3; i++) {
        s.push(`<path d="M${f1(x0)} ${f1(chao - i * q)}h${f1(3 * q)}M${f1(x0 + i * q)} ${f1(chao)}v${f1(-3 * q)}" stroke="${VALE}" stroke-width="1"/>`);
      }
      for (let i = 0; i < 3; i++) s.push(`<rect x="${f1(x0 + i * q + 3)}" y="${f1(chao - (i + 1) * q + 3)}" width="${f1(q - 6)}" height="${f1(q - 6)}" fill="none" stroke="${CESTO}" stroke-width="1"/>`);
      x0 += 3 * q + 34 + r() * 16;
      continue;
    }
    const larg = 70 + r() * 40, alt = h - 20;
    const sobe = r() > 0.3;
    s.push(`<path d="M${f1(x0)} ${f1(chao - alt)}V${f1(chao)}H${f1(x0 + larg)}" fill="none" stroke="${VALE}" stroke-width="1"/>`);
    const n = 16 + Math.floor(r() * 10);
    for (let i = 0; i < n; i++) {
      const u = r();
      const base = sobe ? u : 1 - u;
      const v = Math.min(0.95, Math.max(0.05, base * 0.8 + 0.1 + (r() - 0.5) * 0.35));
      s.push(`<circle cx="${f1(x0 + 6 + u * (larg - 12))}" cy="${f1(chao - 4 - v * (alt - 8))}" r="1.6" fill="none" stroke="${CESTO}" stroke-width="1"/>`);
    }
    const ya = sobe ? 0.15 : 0.85, yb = sobe ? 0.85 : 0.15;
    s.push(`<path d="M${f1(x0 + 6)} ${f1(chao - 4 - ya * (alt - 8))}L${f1(x0 + larg - 6)} ${f1(chao - 4 - yb * (alt - 8))}" stroke="${VALE}" stroke-width="1"/>`);
    x0 += larg + 30 + r() * 20;
  }
  return `<g clip-path="url(#motivo-recorte)">${s.join('')}</g>`;
}
