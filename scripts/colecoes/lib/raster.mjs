/**
 * Grades raster nas pranchas (uso interno): MapBiomas, modelo digital de elevação…
 *
 * O Python grava a grade em scripts/colecoes/cache/<nome>.bin (little-endian) com
 * <nome>.json ao lado: { largura, altura, x0, y0, dx, dy, tipo: 'uint8' | 'int16' | 'float32', nodata }.
 * x0/y0 são o canto superior esquerdo em graus (SIRGAS 2000) e dx/dy o tamanho do pixel.
 *
 * A prancha amostra a grade pixel a pixel pela projeção inversa do quadro e embute o
 * resultado como PNG no SVG: as linhas e os rótulos continuam vetoriais por cima.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const RAIZ = fileURLToPath(new URL('../../..', import.meta.url));

const TIPOS = { uint8: Uint8Array, int16: Int16Array, uint16: Uint16Array, float32: Float32Array };

export async function lerRaster(nome) {
  const dir = join(RAIZ, 'scripts', 'colecoes', 'cache');
  const meta = JSON.parse(await readFile(join(dir, `${nome}.json`), 'utf8'));
  const buf = await readFile(join(dir, `${nome}.bin`));
  const T = TIPOS[meta.tipo];
  const dados = new T(buf.buffer, buf.byteOffset, buf.byteLength / T.BYTES_PER_ELEMENT);
  const { largura: nx, altura: ny, x0, y0, dx, dy, nodata = null } = meta;
  const vazio = (v) => v === nodata || Number.isNaN(v);
  /** Vizinho mais próximo (classes). */
  const valor = (lon, lat) => {
    const i = Math.floor((lon - x0) / dx);
    const j = Math.floor((y0 - lat) / dy);
    if (i < 0 || j < 0 || i >= nx || j >= ny) return null;
    const v = dados[j * nx + i];
    return vazio(v) ? null : v;
  };
  /** Bilinear (contínuos, como a altitude). */
  const amostrar = (lon, lat) => {
    const fx = (lon - x0) / dx - 0.5;
    const fy = (y0 - lat) / dy - 0.5;
    const i = Math.floor(fx);
    const j = Math.floor(fy);
    if (i < 0 || j < 0 || i + 1 >= nx || j + 1 >= ny) return valor(lon, lat);
    const a = dados[j * nx + i], b = dados[j * nx + i + 1], c = dados[(j + 1) * nx + i], d = dados[(j + 1) * nx + i + 1];
    if ([a, b, c, d].some(vazio)) return valor(lon, lat);
    const tx = fx - i, ty = fy - j;
    return (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty;
  };
  return { meta, dados, valor, amostrar };
}

const hex = (c) => [1, 3, 5].map((k) => parseInt(c.slice(k, k + 2), 16));

/** Rampa linear entre paradas [[valor, '#rrggbb'], …] → [r, g, b]. */
export function rampa(paradas) {
  const ps = paradas.map(([v, c]) => [v, hex(c)]);
  return (v) => {
    if (v <= ps[0][0]) return ps[0][1];
    for (let k = 1; k < ps.length; k++) {
      if (v <= ps[k][0]) {
        const [v0, c0] = ps[k - 1];
        const [v1, c1] = ps[k];
        const t = (v - v0) / (v1 - v0);
        return c0.map((x, i) => x + (c1[i] - x) * t);
      }
    }
    return ps[ps.length - 1][1];
  };
}

/**
 * Desenha a grade no quadro (w × h) da projeção `proj`, com `fator` pixels por unidade do SVG.
 * modo 'classes': cor(v) → '#rrggbb' | null (transparente).
 * modo 'relevo': altitude bilinear, cor(alt) → [r, g, b], sombreamento a noroeste (azimute 315°, 45°)
 *   com exagero vertical `exagero`, `metros` = tamanho do pixel de saída em metros.
 * Devolve o elemento <image> pronto para o SVG.
 */
export async function imagemRaster(r, proj, w, h, { modo = 'classes', cor, fator = 2, opacidade = 1, exagero = 2, metros, luz = 0.55, sombra = 1 } = {}) {
  const W = Math.round(w * fator);
  const H = Math.round(h * fator);
  const rgba = Buffer.alloc(W * H * 4);
  const inv = proj.invert;
  if (modo === 'classes') {
    const cache = new Map();
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const ll = inv([(x + 0.5) / fator, (y + 0.5) / fator]);
        if (!ll) continue;
        const v = r.valor(ll[0], ll[1]);
        if (v === null) continue;
        let c = cache.get(v);
        if (c === undefined) { const cc = cor(v); c = cc ? hex(cc) : null; cache.set(v, c); }
        if (!c) continue;
        const o = (y * W + x) * 4;
        rgba[o] = c[0]; rgba[o + 1] = c[1]; rgba[o + 2] = c[2]; rgba[o + 3] = Math.round(255 * opacidade);
      }
  } else {
    const alt = new Float32Array(W * H).fill(NaN);
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const ll = inv([(x + 0.5) / fator, (y + 0.5) / fator]);
        if (!ll) continue;
        const v = r.amostrar(ll[0], ll[1]);
        if (v !== null) alt[y * W + x] = v;
      }
    const az = (135 * Math.PI) / 180; // azimute 315° (noroeste) no sentido matemático
    const ze = (45 * Math.PI) / 180;
    const e = (x, y) => {
      const v = alt[Math.min(H - 1, Math.max(0, y)) * W + Math.min(W - 1, Math.max(0, x))];
      return Number.isNaN(v) ? alt[y * W + x] : v;
    };
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const z = alt[y * W + x];
        if (Number.isNaN(z) || z <= 0) continue;
        // Horn: derivadas em 3 × 3.
        const a = e(x - 1, y - 1), b = e(x, y - 1), c = e(x + 1, y - 1), d = e(x - 1, y), f = e(x + 1, y), g = e(x - 1, y + 1), hh = e(x, y + 1), ii = e(x + 1, y + 1);
        const dzdx = ((c + 2 * f + ii) - (a + 2 * d + g)) / (8 * metros) * exagero;
        const dzdy = ((g + 2 * hh + ii) - (a + 2 * b + c)) / (8 * metros) * exagero;
        const declive = Math.atan(Math.hypot(dzdx, dzdy));
        const aspecto = Math.atan2(dzdy, -dzdx);
        let s = Math.cos(ze) * Math.cos(declive) + Math.sin(ze) * Math.sin(declive) * Math.cos(az - aspecto);
        s = Math.max(0, s);
        // Mistura: a cor hipsométrica escurece na encosta de sombra e clareia na de luz.
        const plano = Math.cos(ze);
        const k = s >= plano ? 1 + luz * (s - plano) / (1 - plano) * 0.35 : 1 - sombra * (plano - s) / plano * 0.75;
        const [cr, cg, cb] = cor(z);
        const o = (y * W + x) * 4;
        rgba[o] = Math.min(255, cr * k); rgba[o + 1] = Math.min(255, cg * k); rgba[o + 2] = Math.min(255, cb * k);
        rgba[o + 3] = Math.round(255 * opacidade);
      }
  }
  const png = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).png({ compressionLevel: 9, palette: modo === 'classes' }).toBuffer();
  return `<image x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="none" href="data:image/png;base64,${png.toString('base64')}"/>`;
}
