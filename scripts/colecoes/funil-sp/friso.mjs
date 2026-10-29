/**
 * Friso da coleção «O funil do biometano» (funil-sp): cascatas de quatro tanques em degrau, N1 a N4, cada um
 * mais baixo e mais raso que o anterior; o que transborda passa ao seguinte e o que se perde pinga no chão.
 * Passado como `motivo: friso` no tema da prancha. Só linha e texto, nas cores de ornamento do atlas (lib/arte.mjs).
 */
import { CESTO, VALE } from '../lib/arte.mjs';

const f1 = (v) => Math.round(v * 10) / 10;
function sorte(semente) {
  let s = semente >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

export function friso(w, h) {
  const r = sorte(116);
  const s = [];
  const chao = h - 4;
  s.push(`<path d="M0 ${f1(chao)}H${w}" stroke="${VALE}" stroke-width="1.1"/>`);
  const larg = 30;
  const passo = larg + 10;
  let x = 8;
  while (x + 4 * passo < w) {
    for (let k = 0; k < 4; k++) {
      const x0 = x + k * passo;
      // Cada tanque desce um degrau e guarda menos água.
      const topo = 8 + k * (h - 26) * 0.2;
      const fundo = topo + (h - 26) * 0.42;
      const nivel = topo + (fundo - topo) * (0.18 + k * 0.17);
      s.push(`<path d="M${f1(x0)} ${f1(topo)}V${f1(fundo)}H${f1(x0 + larg)}V${f1(topo)}" fill="none" stroke="${VALE}" stroke-width="1"/>`);
      // Pé do tanque até o chão.
      s.push(`<path d="M${f1(x0 + 6)} ${f1(fundo)}V${f1(chao)}M${f1(x0 + larg - 6)} ${f1(fundo)}V${f1(chao)}" stroke="${VALE}" stroke-width=".6"/>`);
      // Lâmina d'água ondulada.
      const q = larg / 4;
      s.push(`<path d="M${f1(x0 + 1)} ${f1(nivel)}q${f1(q / 2)} -2 ${f1(q)} 0t${f1(q)} 0t${f1(q)} 0t${f1(q - 2)} 0" fill="none" stroke="${CESTO}" stroke-width=".9"/>`);
      if (k < 3) {
        // Bica para o tanque seguinte.
        const yb = topo + 4;
        const xn = x0 + passo;
        const tn = 8 + (k + 1) * (h - 26) * 0.2;
        s.push(`<path d="M${f1(x0 + larg)} ${f1(yb)}h4Q${f1(xn - 2)} ${f1(yb)} ${f1(xn + 3)} ${f1(tn + 6)}" fill="none" stroke="${CESTO}" stroke-width=".9" stroke-dasharray="2 2"/>`);
        // Gotas que se perdem no caminho.
        let yg = fundo + 6;
        for (let g = 0; g < 1 + Math.floor(r() * 3) && yg < chao - 4; g++) {
          s.push(`<circle cx="${f1(x0 + larg + 3 + (r() - 0.5) * 3)}" cy="${f1(yg)}" r="${f1(1 + r() * 0.8)}" fill="none" stroke="${CESTO}" stroke-width=".8"/>`);
          yg += 6 + r() * 5;
        }
      }
    }
    x += 4 * passo + 26 + r() * 18;
  }
  return `<g clip-path="url(#motivo-recorte)">${s.join('')}</g>`;
}
