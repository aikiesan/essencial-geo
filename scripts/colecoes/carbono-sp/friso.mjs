/**
 * Friso da coleção «Carbono biogênico» (carbono-sp): uma fileira de dornas de fermentação, com o CO₂ subindo
 * em bolhas e, no alto, moléculas O=C=O soltas no ar. Passado como `motivo: friso` no tema da prancha.
 * Só linha e texto, nas cores de ornamento do atlas (lib/arte.mjs).
 */
import { CESTO, VALE } from '../lib/arte.mjs';

const f1 = (v) => Math.round(v * 10) / 10;
function sorte(semente) {
  let s = semente >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

export function friso(w, h) {
  const r = sorte(89);
  const s = [];
  const chao = h - 4;
  s.push(`<path d="M0 ${f1(chao)}H${w}" stroke="${VALE}" stroke-width="1.1"/>`);
  let x = 10;
  const tubos = [];
  while (x < w - 40) {
    const larg = 30 + r() * 16;
    const alto = h * (0.42 + r() * 0.22);
    const topo = chao - alto;
    // Dorna: costado reto, tampo em arco e duas cintas.
    s.push(`<path d="M${f1(x)} ${f1(chao)}V${f1(topo + 6)}Q${f1(x + larg / 2)} ${f1(topo - 6)} ${f1(x + larg)} ${f1(topo + 6)}V${f1(chao)}" fill="none" stroke="${VALE}" stroke-width="1"/>`);
    for (const k of [0.35, 0.7]) s.push(`<path d="M${f1(x)} ${f1(chao - alto * k)}h${f1(larg)}" stroke="${VALE}" stroke-width=".6"/>`);
    // Respiro no tampo e bolhas que sobem.
    const cx = x + larg / 2;
    s.push(`<path d="M${f1(cx)} ${f1(topo)}v-5" stroke="${VALE}" stroke-width="1"/>`);
    tubos.push([cx, topo - 5]);
    let yb = topo - 10;
    for (let k = 0; k < 3 + Math.floor(r() * 3) && yb > 10; k++) {
      const rb = 1.4 + r() * 2;
      s.push(`<circle cx="${f1(cx + (r() - 0.5) * 8)}" cy="${f1(yb)}" r="${f1(rb)}" fill="none" stroke="${CESTO}" stroke-width=".9"/>`);
      yb -= 5 + rb * 2 + r() * 4;
    }
    x += larg + 22 + r() * 22;
  }
  // Coletor: o CO₂ das dornas reunido num duto, como numa planta de captura.
  if (tubos.length > 1) {
    const yc = Math.min(...tubos.map(([, y]) => y)) - 2;
    s.push(`<path d="M${f1(tubos[0][0])} ${f1(yc)}H${f1(tubos[tubos.length - 1][0])}" stroke="${VALE}" stroke-width=".7" stroke-dasharray="3 3"/>`);
  }
  // Moléculas de CO₂ no alto: O=C=O.
  for (let k = 0; k < Math.floor(w / 90); k++) {
    const mx = 30 + r() * (w - 60), my = 8 + r() * h * 0.22;
    const ang = (r() - 0.5) * 50;
    s.push(`<g transform="translate(${f1(mx)} ${f1(my)}) rotate(${f1(ang)})"><circle r="2.6" fill="none" stroke="${VALE}" stroke-width=".9"/><circle cx="-8" r="2.2" fill="none" stroke="${CESTO}" stroke-width=".9"/><circle cx="8" r="2.2" fill="none" stroke="${CESTO}" stroke-width=".9"/><path d="M-5.6 -1h3M-5.6 1h3M2.6 -1h3M2.6 1h3" stroke="${VALE}" stroke-width=".5"/></g>`);
  }
  return `<g clip-path="url(#motivo-recorte)">${s.join('')}</g>`;
}
