/**
 * Friso da coleção «Bacias de suprimento»: biodigestores em cúpula, cada um no centro dos seus raios de
 * coleta (arcos tracejados), e caminhões na estrada a caminho do mais próximo.
 */
import { CESTO, VALE } from '../lib/arte.mjs';

const f1 = (v) => Math.round(v * 10) / 10;
function sorte(semente) {
  let s = semente >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

/** Caminhão de traço, de frente para `lado` (1 = direita, -1 = esquerda), com as rodas no chão. */
function caminhao(x, chao, lado, escala) {
  const c = 13 * escala, a = 9 * escala, cab = 6 * escala, r = 2.1 * escala;
  const yb = chao - 2 * r;
  const x0 = lado > 0 ? x : x - c - cab;
  const xc = lado > 0 ? x + c : x - c - cab;
  const s = [];
  s.push(`<rect x="${f1(lado > 0 ? x0 : x0 + cab)}" y="${f1(yb - a)}" width="${f1(c)}" height="${f1(a)}" fill="none" stroke="${VALE}" stroke-width="1"/>`);
  const cx0 = lado > 0 ? xc : x0;
  s.push(`<path d="M${f1(cx0)} ${f1(yb)}V${f1(yb - a * 0.72)}H${f1(cx0 + cab * 0.55)}L${f1(cx0 + cab)} ${f1(yb - a * 0.4)}V${f1(yb)}Z" transform="${lado > 0 ? '' : `translate(${f1(2 * cx0 + cab)} 0) scale(-1 1)`}" fill="none" stroke="${VALE}" stroke-width="1"/>`);
  for (const rx of [x0 + 3 * escala, x0 + c + cab - 3 * escala]) s.push(`<circle cx="${f1(rx)}" cy="${f1(chao - r)}" r="${f1(r)}" fill="none" stroke="${VALE}" stroke-width=".9"/>`);
  return s.join('');
}

export function friso(w, h) {
  const r = sorte(85);
  const s = [];
  const chao = h - 6;
  s.push(`<path d="M0 ${f1(chao)}H${w}" stroke="${VALE}" stroke-width="1.1"/>`);
  // Biodigestores a intervalos irregulares; os raios de coleta se cruzam entre vizinhos.
  const centros = [];
  for (let x = 70 + r() * 30; x < w - 50; x += 150 + r() * 70) centros.push(x);
  for (const cx of centros) {
    for (const k of [1, 2, 3]) {
      const raio = h * 0.3 * k;
      s.push(`<path d="M${f1(cx - raio)} ${f1(chao)}A${f1(raio)} ${f1(raio)} 0 0 1 ${f1(cx + raio)} ${f1(chao)}" fill="none" stroke="${CESTO}" stroke-width="${k === 3 ? 1.1 : 0.8}" stroke-dasharray="${k === 3 ? '5 3' : '2 3'}"/>`);
    }
    const rd = 11 + r() * 4;
    s.push(`<path d="M${f1(cx - rd)} ${f1(chao)}A${f1(rd)} ${f1(rd * 0.85)} 0 0 1 ${f1(cx + rd)} ${f1(chao)}" fill="none" stroke="${VALE}" stroke-width="1.2"/>`);
    s.push(`<path d="M${f1(cx + rd + 4)} ${f1(chao)}V${f1(chao - rd * 1.1)}h5V${f1(chao)}" fill="none" stroke="${VALE}" stroke-width="1"/>`);
  }
  // Caminhões entre os biodigestores, cada um rumo ao centro mais próximo.
  for (let x = 20 + r() * 20; x < w - 30; x += 46 + r() * 40) {
    const perto = centros.reduce((a, c) => (Math.abs(c - x) < Math.abs(a - x) ? c : a), centros[0]);
    if (Math.abs(perto - x) < 34) continue;
    s.push(caminhao(x, chao, perto > x ? 1 : -1, 0.85 + r() * 0.3));
  }
  return `<g clip-path="url(#motivo-recorte)">${s.join('')}</g>`;
}
