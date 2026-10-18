/**
 * Friso da coleção «Bioeconomia no trabalho»: do campo à fábrica. Brotos e árvores à esquerda de cada
 * trecho, um galpão de cobertura em serra com chaminé e tanque à direita, e uma esteira de fardos no chão.
 */
import { CESTO, VALE } from '../lib/arte.mjs';

const f1 = (v) => Math.round(v * 10) / 10;
function sorte(semente) {
  let s = semente >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

export function friso(w, h) {
  const r = sorte(79);
  const s = [];
  const chao = h - 6;
  s.push(`<path d="M0 ${f1(chao)}H${w}" stroke="${VALE}" stroke-width="1.1"/>`);
  for (let x0 = 6; x0 < w - 40;) {
    // Campo: brotos e uma árvore.
    const nb = 3 + Math.floor(r() * 4);
    let x = x0;
    for (let i = 0; i < nb; i++) {
      const a = h * (0.12 + r() * 0.16);
      s.push(`<path d="M${f1(x)} ${f1(chao)}V${f1(chao - a)}M${f1(x)} ${f1(chao - a * 0.6)}q-5 -3 -8 -1M${f1(x)} ${f1(chao - a * 0.8)}q5 -3 8 -1" fill="none" stroke="${CESTO}" stroke-width="1"/>`);
      x += 9 + r() * 5;
    }
    const ta = h * (0.45 + r() * 0.2);
    s.push(`<path d="M${f1(x + 8)} ${f1(chao)}V${f1(chao - ta * 0.55)}" stroke="${VALE}" stroke-width="1.1"/>`);
    s.push(`<circle cx="${f1(x + 8)}" cy="${f1(chao - ta * 0.75)}" r="${f1(ta * 0.25)}" fill="none" stroke="${VALE}" stroke-width="1"/>`);
    x += 26;
    // Fardos na esteira até a fábrica.
    for (let k = 0; k < 3; k++) s.push(`<rect x="${f1(x + k * 9)}" y="${f1(chao - 6)}" width="6" height="6" fill="none" stroke="${CESTO}" stroke-width=".9"/>`);
    x += 32;
    // Fábrica: galpão em serra, chaminé e tanque.
    const larg = 60 + r() * 30, alt = h * (0.32 + r() * 0.12), dente = 3 + Math.floor(r() * 2);
    const passo = larg / dente;
    let d = `M${f1(x)} ${f1(chao)}V${f1(chao - alt)}`;
    for (let k = 0; k < dente; k++) d += `L${f1(x + passo * k + passo)} ${f1(chao - alt - passo * 0.45)}V${f1(chao - alt)}`;
    d += `V${f1(chao)}`;
    s.push(`<path d="${d}" fill="none" stroke="${VALE}" stroke-width="1"/>`);
    const cx = x + larg - 10;
    s.push(`<path d="M${f1(cx)} ${f1(chao - alt)}V${f1(chao - h * 0.86)}h6V${f1(chao - alt - passo * 0.2)}" fill="none" stroke="${VALE}" stroke-width="1"/>`);
    s.push(`<rect x="${f1(x + larg + 6)}" y="${f1(chao - alt * 0.7)}" width="16" height="${f1(alt * 0.7)}" fill="none" stroke="${CESTO}" stroke-width="1"/>`);
    x0 = x + larg + 40 + r() * 30;
  }
  return `<g clip-path="url(#motivo-recorte)">${s.join('')}</g>`;
}
