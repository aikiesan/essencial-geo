/**
 * Coleções temáticas — o toque de cada coleção (uso interno).
 *
 * Três peças, todas em linha e texto, nunca em fundo (docs/ESTILO.md → «Paleta»):
 *   motivo(chave, largura)  um friso desenhado, próprio de cada coleção, no respiro do painel;
 *   chamada(...)            uma seta fina com uma frase curta tirada do dado, sobre o mapa;
 *   legendaCirculos(...)    círculos proporcionais aninhados.
 */

export const CESTO = '#bfa88a'; // Basket Beige: ornamentos
export const VALE = '#6d7165'; // Queen Valley: traço técnico
export const FLORESTA = '#444235'; // Forest Night: texto da chamada
const SERIF = "Georgia, 'Times New Roman', serif";
const MONO = "Consolas, 'DejaVu Sans Mono', monospace";
const f1 = (v) => Math.round(v * 10) / 10;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/** Pseudoaleatório determinístico: o friso sai igual a cada exportação. */
function sorte(semente) {
  let s = semente >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

/* ------------------------------------------------------------------ frisos */
/** Bioenergia: uma fileira de colmos de cana, com nós e folhas em arco. */
function cana(w, h) {
  const r = sorte(7);
  const s = [];
  const n = Math.floor(w / 26);
  for (let i = 0; i < n; i++) {
    const x = 13 + i * (w - 26) / (n - 1) + (r() - 0.5) * 6;
    const alto = h * (0.62 + r() * 0.38);
    const topo = h - alto;
    s.push(`<path d="M${f1(x)} ${h}V${f1(topo)}" stroke="${VALE}" stroke-width="1.3"/>`);
    for (let y = h - 12 - r() * 8; y > topo + 10; y -= 14 + r() * 6) s.push(`<path d="M${f1(x - 2.6)} ${f1(y)}h5.2" stroke="${VALE}" stroke-width="1"/>`);
    const lado = r() > 0.5 ? 1 : -1;
    const yf = topo + alto * (0.25 + r() * 0.3);
    s.push(`<path d="M${f1(x)} ${f1(yf)}q${f1(lado * 10)} ${-10} ${f1(lado * 22)} ${f1(-4 + r() * 6)}" fill="none" stroke="${CESTO}" stroke-width="1.2"/>`);
    s.push(`<path d="M${f1(x)} ${f1(topo + 4)}q${f1(-lado * 7)} -8 ${f1(-lado * 15)} -3" fill="none" stroke="${CESTO}" stroke-width="1.1"/>`);
  }
  return s.join('');
}

/** Água: ondas que se apertam, como linhas de corrente. */
function agua(w, h) {
  const s = [];
  for (let k = 0; k < 5; k++) {
    const y0 = 12 + k * (h - 24) / 4;
    const amp = 4 + k * 1.4;
    const comp = 64 - k * 7;
    let d = `M0 ${f1(y0)}`;
    for (let x = 0; x <= w; x += 4) d += `L${x} ${f1(y0 + amp * Math.sin((x / comp) * 2 * Math.PI + k))}`;
    s.push(`<path d="${d}" fill="none" stroke="${k % 2 ? CESTO : VALE}" stroke-width="${k % 2 ? 1.2 : 0.9}"/>`);
  }
  return s.join('');
}

/** Relevo: curvas de nível de um morro baixo, desenhadas a mão. */
function relevo(w, h) {
  const r = sorte(11);
  const s = [];
  const cx = w * 0.62;
  const cy = h * 0.62;
  const fase = Array.from({ length: 5 }, () => r() * Math.PI * 2);
  for (let k = 1; k <= 7; k++) {
    const rx = (w * 0.44 * k) / 7;
    const ry = (h * 0.56 * k) / 7;
    let d = '';
    for (let a = 0; a <= 360; a += 6) {
      const t = (a * Math.PI) / 180;
      const ond = 1 + 0.08 * Math.sin(3 * t + fase[k % 5]) + 0.05 * Math.sin(5 * t + fase[(k + 2) % 5]);
      const x = cx + rx * ond * Math.cos(t);
      const y = cy + ry * ond * Math.sin(t);
      d += `${a ? 'L' : 'M'}${f1(x)} ${f1(y)}`;
    }
    s.push(`<path d="${d}Z" fill="none" stroke="${k % 5 === 0 ? VALE : CESTO}" stroke-width="${k % 5 === 0 ? 1.3 : 0.9}"/>`);
  }
  return `<g clip-path="url(#motivo-recorte)">${s.join('')}</g>`;
}

/** Energia: torres de transmissão e a catenária entre elas. */
function energia(w, h) {
  const s = [];
  const n = 5;
  const torres = Array.from({ length: n }, (_, i) => 24 + (i * (w - 48)) / (n - 1));
  const alto = h - 8;
  const torre = (x) => {
    const b = 13;
    const topo = 8;
    return `<path d="M${f1(x - b)} ${h}L${f1(x - 3)} ${topo}L${f1(x + 3)} ${topo}L${f1(x + b)} ${h}M${f1(x - b * 0.7)} ${f1(h * 0.65)}L${f1(x + b * 0.7)} ${f1(h * 0.65)}M${f1(x - 18)} ${topo + 8}H${f1(x + 18)}M${f1(x - 12)} ${topo + 20}H${f1(x + 12)}M${f1(x - b * 0.86)} ${f1(h * 0.8)}L${f1(x + b * 0.45)} ${f1(h * 0.45)}M${f1(x + b * 0.86)} ${f1(h * 0.8)}L${f1(x - b * 0.45)} ${f1(h * 0.45)}" fill="none" stroke="${VALE}" stroke-width="1.1"/>`;
  };
  torres.forEach((x) => s.push(torre(x)));
  for (const [dy, larg] of [[16, 18], [28, 12]])
    for (let i = 0; i < n - 1; i++) {
      const a = torres[i] + larg;
      const b = torres[i + 1] - larg;
      s.push(`<path d="M${f1(a)} ${dy}Q${f1((a + b) / 2)} ${dy + alto * 0.32} ${f1(b)} ${dy}" fill="none" stroke="${CESTO}" stroke-width="1.1"/>`);
    }
  return s.join('');
}

/** RMC: um tecido de pontos que adensa para o centro, como a mancha urbana. */
function rmc(w, h) {
  const r = sorte(5);
  const s = [];
  for (let x = 6; x < w; x += 9)
    for (let y = 6; y < h; y += 9) {
      const d = Math.hypot((x - w * 0.5) / (w * 0.5), (y - h * 0.5) / (h * 0.6));
      if (r() > 1.15 - d) continue;
      s.push(`<circle cx="${x}" cy="${y}" r="${f1(1.6 - d * 0.7)}" fill="${d < 0.45 ? VALE : CESTO}"/>`);
    }
  return s.join('');
}

/** Do campo ao biometano: sulcos de plantio em curva de nível, com brotos numa fileira sim, outra não. */
function agro(w, h) {
  const r = sorte(17);
  const s = [];
  const n = 9;
  const fase = r() * Math.PI;
  for (let k = 0; k < n; k++) {
    const y0 = 6 + (k * (h - 12)) / (n - 1);
    const amp = 7 + 5 * Math.sin((k / (n - 1)) * Math.PI);
    const yy = (x) => y0 + amp * Math.sin((x / w) * Math.PI * 1.6 + fase + k * 0.18);
    let d = '';
    for (let x = 0; x <= w; x += 5) d += `${x ? 'L' : 'M'}${x} ${f1(yy(x))}`;
    s.push(`<path d="${d}" fill="none" stroke="${k % 2 ? VALE : CESTO}" stroke-width="${k % 2 ? 1 : 1.2}"/>`);
    if (k % 2) {
      for (let x = 8 + r() * 10; x < w - 6; x += 15 + r() * 7) {
        const y = yy(x);
        s.push(`<path d="M${f1(x)} ${f1(y)}v-4.5M${f1(x)} ${f1(y - 2.5)}q-3 -2 -4.5 -1M${f1(x)} ${f1(y - 3.5)}q3 -2 4.5 -1" fill="none" stroke="${VALE}" stroke-width=".9"/>`);
      }
    }
  }
  return `<g clip-path="url(#motivo-recorte)">${s.join('')}</g>`;
}

const FRISOS = { cana, agua, relevo, energia, rmc, agro };

/** Friso da coleção, `w` × `h` px, com uma legenda mínima à direita (opcional). */
export function motivo(chave, w, h = 84) {
  const fn = FRISOS[chave];
  if (!fn) return '';
  return `<g opacity=".9"><defs><clipPath id="motivo-recorte"><rect width="${w}" height="${h}"/></clipPath></defs>${fn(w, h)}</g>`;
}

/* ------------------------------------------------------------------ chamada */
/**
 * Chamada de leitura: um anel no ponto, uma linha curva até o texto e duas ou três linhas
 * (a primeira em versalete mono, as demais em itálico serifado). (x, y) é o ponto no quadro;
 * (dx, dy) leva ao início do texto. Devolve { svg, caixa } para o desvio de rótulos.
 */
export function chamada(x, y, { dx, dy, titulo, linhas = [], tamanho = 18, largura }) {
  const tx = x + dx;
  const ty = y + dy;
  const anc = dx < 0 ? 'end' : 'start';
  const s = [];
  const cxp = x + dx * 0.15;
  const cyp = y + dy * 0.85;
  s.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="7" fill="none" stroke="${FLORESTA}" stroke-width="1.4"/>`);
  const ux = tx - (dx < 0 ? -6 : 6);
  s.push(`<path d="M${f1(x + (dx < 0 ? -5 : 5))} ${f1(y + (dy < 0 ? -5 : 5))}Q${f1(cxp)} ${f1(cyp)} ${f1(ux)} ${f1(ty - 5)}" fill="none" stroke="${FLORESTA}" stroke-width="1.2"/>`);
  const halo = 'stroke="#ffffff" stroke-width="5" stroke-linejoin="round" paint-order="stroke"';
  s.push(`<text x="${f1(tx)}" y="${f1(ty)}" text-anchor="${anc}" font-family="${MONO}" font-size="${tamanho - 4}" letter-spacing="1.6" fill="${FLORESTA}" ${halo}>${esc(titulo)}</text>`);
  linhas.forEach((l, i) => s.push(`<text x="${f1(tx)}" y="${f1(ty + 24 + i * (tamanho + 5))}" text-anchor="${anc}" font-family="${SERIF}" font-style="italic" font-size="${tamanho}" fill="${FLORESTA}" ${halo}>${esc(l)}</text>`));
  const larg = largura ?? Math.max(titulo.length * (tamanho - 4) * 0.62, ...linhas.map((l) => l.length * tamanho * 0.5));
  const x0 = anc === 'end' ? tx - larg : tx;
  const caixa = [x0 - 6, ty - tamanho, x0 + larg + 6, ty + 10 + linhas.length * (tamanho + 5)];
  return { svg: s.join('\n'), caixa };
}

/* ------------------------------------------------------------------ círculos proporcionais */
/**
 * Legenda de círculos aninhados: valores (do maior ao menor), raio(v) em px e rótulo(v).
 * As linhas-guia saem do topo de cada círculo para a direita.
 */
export function legendaCirculos(valores, raio, rotulo, { x = 0, y = 0, cor = '#9c4a32', tinta = '#1a1c1e', tamanho = 15 } = {}) {
  const rMax = raio(valores[0]);
  const base = y + 2 * rMax;
  const cx = x + rMax;
  const s = [];
  valores.forEach((v) => {
    const r = raio(v);
    s.push(`<circle cx="${f1(cx)}" cy="${f1(base - r)}" r="${f1(r)}" fill="${cor}" fill-opacity=".12" stroke="${cor}" stroke-width="1.2"/>`);
  });
  valores.forEach((v, i) => {
    const r = raio(v);
    const yy = base - 2 * r;
    const xt = cx + rMax + 20;
    const yt = Math.max(yy, y + i * (tamanho + 6));
    s.push(`<path d="M${f1(cx)} ${f1(yy)}H${f1(cx + rMax + 8)}L${f1(xt - 4)} ${f1(yt)}" fill="none" stroke="${tinta}" stroke-width=".7"/>`);
    s.push(`<text x="${f1(xt)}" y="${f1(yt + 5)}" font-family="${MONO}" font-size="${tamanho}" fill="${tinta}">${esc(rotulo(v))}</text>`);
  });
  return { svg: s.join('\n'), altura: 2 * rMax };
}
