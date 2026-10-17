#!/usr/bin/env node
/**
 * Gera as quatro pranchas-modelo do Essencial Geo com DADOS SINTÉTICOS
 * (ruído fractal semeado), além de DXF e CSV reais dessas geometrias.
 * Servem para demonstrar o layout, o feed e os downloads antes dos mapas reais.
 *
 *   npm run exemplos
 *
 * Saídas (por pasta em /mapas):  mapa_preview.png · dados/*.dxf · dados/*.csv
 * e o modelo vazio em /templates/mapa/mapa_preview.png.
 * Nada aqui representa um lugar real: as pranchas trazem o selo "dados sintéticos".
 */
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { contours } from 'd3-contour';
import { Delaunay } from 'd3-delaunay';
import { interpolateViridis } from 'd3-scale-chromatic';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));

/* ------------------------------------------------------------------ util */
function semente(s) {
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ruido(seed) {
  const r = semente(seed);
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  const perm = [...p, ...p];
  const val = Array.from({ length: 256 }, () => r());
  const h = (x, y) => val[perm[(perm[x & 255] + y) & 255]];
  const suave = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const n = (x, y) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const u = suave(x - xi);
    const v = suave(y - yi);
    const a = h(xi, yi) + (h(xi + 1, yi) - h(xi, yi)) * u;
    const b = h(xi, yi + 1) + (h(xi + 1, yi + 1) - h(xi, yi + 1)) * u;
    return a + (b - a) * v;
  };
  return (x, y, oitavas = 5) => {
    let s = 0;
    let amp = 0.5;
    let f = 1;
    let norm = 0;
    for (let o = 0; o < oitavas; o++) {
      s += amp * n(x * f + o * 17.3, y * f + o * 9.1);
      norm += amp;
      amp *= 0.5;
      f *= 2.03;
    }
    return s / norm;
  };
}

const lim = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const f1 = (v) => Math.round(v * 10) / 10;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function dentro(pt, poli) {
  let c = false;
  for (let i = 0, j = poli.length - 1; i < poli.length; j = i++) {
    const [xi, yi] = poli[i];
    const [xj, yj] = poli[j];
    if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

const caminho = (pts, fechar = true) =>
  pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f1(x)} ${f1(y)}`).join('') + (fechar ? 'Z' : '');

function areaPoli(p) {
  let a = 0;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) a += (p[j][0] + p[i][0]) * (p[j][1] - p[i][1]);
  return Math.abs(a / 2);
}

/** Recuo de um polígono convexo: desloca cada aresta para dentro e intersecta as vizinhas. */
function recuar(poli, d) {
  const p = poli.slice(0, poli[0][0] === poli.at(-1)[0] && poli[0][1] === poli.at(-1)[1] ? -1 : undefined);
  const n = p.length;
  if (n < 3) return null;
  // orientação
  let s = 0;
  for (let i = 0; i < n; i++) {
    const [x1, y1] = p[i];
    const [x2, y2] = p[(i + 1) % n];
    s += x1 * y2 - x2 * y1;
  }
  const sinal = s > 0 ? 1 : -1;
  const linhas = [];
  for (let i = 0; i < n; i++) {
    const [x1, y1] = p[i];
    const [x2, y2] = p[(i + 1) % n];
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    const nx = (-(y2 - y1) / len) * sinal;
    const ny = ((x2 - x1) / len) * sinal;
    linhas.push([x1 + nx * d, y1 + ny * d, x2 + nx * d, y2 + ny * d]);
  }
  const out = [];
  for (let i = 0; i < n; i++) {
    const [a1, b1, a2, b2] = linhas[(i + n - 1) % n];
    const [c1, d1, c2, d2] = linhas[i];
    const den = (a1 - a2) * (d1 - d2) - (b1 - b2) * (c1 - c2);
    if (Math.abs(den) < 1e-9) continue;
    const t = ((a1 - c1) * (d1 - d2) - (b1 - d1) * (c1 - c2)) / den;
    out.push([a1 + t * (a2 - a1), b1 + t * (b2 - b1)]);
  }
  if (out.length < 3) return null;
  // descarta recuos que inverteram (célula pequena demais)
  let s2 = 0;
  for (let i = 0; i < out.length; i++) {
    const [x1, y1] = out[i];
    const [x2, y2] = out[(i + 1) % out.length];
    s2 += x1 * y2 - x2 * y1;
  }
  if (Math.sign(s2) !== Math.sign(s) || areaPoli(out) < 60) return null;
  return out;
}

/* ------------------------------------------------------------------ DXF R12 */
const ACI = { 1: 'vermelho', 2: 'amarelo', 3: 'verde', 4: 'ciano', 5: 'azul', 6: 'magenta', 7: 'branco/preto', 8: 'cinza' };
/**
 * DXF ASCII R12 (AC1009): lido por AutoCAD, Illustrator, QGIS/GDAL, Rhino.
 * camadas: [{ nome, cor (ACI), polilinhas: [{ pts: [[x,y]...], fechada, z }] }]
 */
function dxf(camadas) {
  const L = [];
  const g = (c, v) => L.push(String(c), String(v));
  g(0, 'SECTION'); g(2, 'HEADER'); g(9, '$ACADVER'); g(1, 'AC1009'); g(9, '$INSUNITS'); g(70, 6); g(0, 'ENDSEC');
  g(0, 'SECTION'); g(2, 'TABLES');
  g(0, 'TABLE'); g(2, 'LTYPE'); g(70, 1);
  g(0, 'LTYPE'); g(2, 'CONTINUOUS'); g(70, 0); g(3, 'Solid line'); g(72, 65); g(73, 0); g(40, '0.0');
  g(0, 'ENDTAB');
  g(0, 'TABLE'); g(2, 'LAYER'); g(70, camadas.length);
  for (const c of camadas) {
    g(0, 'LAYER'); g(2, c.nome); g(70, 0); g(62, c.cor ?? 7); g(6, 'CONTINUOUS');
  }
  g(0, 'ENDTAB'); g(0, 'ENDSEC');
  g(0, 'SECTION'); g(2, 'ENTITIES');
  for (const c of camadas) {
    for (const pl of c.polilinhas) {
      const z = (pl.z ?? 0).toFixed(1);
      g(0, 'POLYLINE'); g(8, c.nome); g(66, 1); g(70, pl.fechada ? 1 : 0); g(10, '0.0'); g(20, '0.0'); g(30, z);
      for (const [x, y] of pl.pts) {
        g(0, 'VERTEX'); g(8, c.nome); g(10, x.toFixed(2)); g(20, y.toFixed(2)); g(30, z);
      }
      g(0, 'SEQEND'); g(8, c.nome);
    }
  }
  g(0, 'ENDSEC'); g(0, 'EOF');
  return L.join('\r\n') + '\r\n';
}

/* ------------------------------------------------------------------ prancha */
const W = 2400;
const H = 1800;
const M = 56;
const X0 = M + 12;
const Y0 = M + 12;
const MW = 1640; // largura da área do mapa
const MH = H - 2 * Y0; // 1664
const PX = X0 + MW; // início do painel
const PW = W - X0 - PX;
const PX_M = 10; // 1 px = 10 m (escala sintética)

const FONTE_SERIF = "Georgia, 'Times New Roman', serif";
const FONTE_MONO = "Consolas, 'DejaVu Sans Mono', monospace";
const TINTA = '#1d1b18';
const PAPEL = '#fbf9f4';
const FINA = '#c9c0ad';

/** Converte px do mapa em metros sintéticos (origem no canto inferior esquerdo). */
const metros = ([x, y]) => [x * PX_M, (MH - y) * PX_M];

function prancha({ numero, titulo, subtitulo, data, crs, legenda, mapa, fundoMapa = PAPEL, rodapeFonte }) {
  const cruzes = [];
  for (let x = 200; x < MW; x += 200)
    for (let y = 200; y < MH; y += 200)
      cruzes.push(`M${x - 9} ${y}h18M${x} ${y - 9}v18`);
  const ticks = [];
  for (let x = 0; x <= MW; x += 100) ticks.push(`M${x} 0v${x % 500 === 0 ? 16 : 9}M${x} ${MH}v-${x % 500 === 0 ? 16 : 9}`);
  for (let y = 0; y <= MH; y += 100) ticks.push(`M0 ${y}h${y % 500 === 0 ? 16 : 9}M${MW} ${y}h-${y % 500 === 0 ? 16 : 9}`);

  const linhasTitulo = titulo.map((t, i) => `<text x="0" y="${i * 52}" font-family="${FONTE_SERIF}" font-size="46">${esc(t)}</text>`).join('');
  const linhasSub = subtitulo.map((t, i) => `<text x="0" y="${i * 32}" font-family="${FONTE_SERIF}" font-style="italic" font-size="25" fill="#4f4a41">${esc(t)}</text>`).join('');
  const yTitulo = 270;
  const ySub = yTitulo + titulo.length * 52 + 10;
  const yLeg = ySub + subtitulo.length * 32 + 50;

  const carimbo = [
    ['PROJETO', 'Essencial Geo'],
    ['PRANCHA', `Nº ${String(numero).padStart(3, '0')}`],
    ['DATA', data],
    ['CRS', crs],
    ['FONTE', rodapeFonte],
    ['LICENÇA', 'CC BY 4.0'],
  ];
  const yCar = MH - carimbo.length * 44 - 58;
  const carimboSvg = carimbo
    .map(
      ([k, v], i) =>
        `<g transform="translate(0 ${i * 44})"><path d="M0 0H${PW - 64}" stroke="${TINTA}" stroke-width="${i ? 0.8 : 1.6}"/>` +
        `<text x="0" y="29" font-family="${FONTE_MONO}" font-size="15" letter-spacing="2.2" fill="#857d70">${k}</text>` +
        `<text x="128" y="29" font-family="${FONTE_MONO}" font-size="17" fill="${TINTA}">${esc(v)}</text></g>`,
    )
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${PAPEL}"/>
  <defs><clipPath id="mapa"><rect width="${MW}" height="${MH}"/></clipPath>${mapa.defs ?? ''}</defs>
  <g transform="translate(${X0} ${Y0})">
    <rect width="${MW}" height="${MH}" fill="${fundoMapa}"/>
    <g clip-path="url(#mapa)">${mapa.svg}</g>
    <path d="${cruzes.join('')}" stroke="${TINTA}" stroke-width="1" opacity=".55" fill="none"/>
    <path d="${ticks.join('')}" stroke="${TINTA}" stroke-width="1.2" fill="none"/>
  </g>
  <rect x="${M}" y="${M}" width="${W - 2 * M}" height="${H - 2 * M}" fill="none" stroke="${TINTA}" stroke-width="3"/>
  <rect x="${X0}" y="${Y0}" width="${W - 2 * X0}" height="${MH}" fill="none" stroke="${TINTA}" stroke-width="1.2"/>
  <path d="M${PX} ${Y0}V${Y0 + MH}" stroke="${TINTA}" stroke-width="1.2"/>
  <g transform="translate(${PX + 32} ${Y0})" fill="${TINTA}">
    <text x="0" y="62" font-family="${FONTE_MONO}" font-size="17" letter-spacing="5">ESSENCIAL GEO</text>
    <path d="M0 86H${PW - 64}" stroke="${TINTA}" stroke-width="1.6"/>
    <text x="0" y="176" font-family="${FONTE_SERIF}" font-size="76">Nº ${String(numero).padStart(3, '0')}</text>
    <path d="M${PW - 98} 132l5.2 12.3 13.3 1.1-10.1 8.8 3 13-11.4-6.9-11.4 6.9 3-13-10.1-8.8 13.3-1.1z" fill="#c99a2e"/>
    <g transform="translate(0 ${yTitulo})">${linhasTitulo}</g>
    <g transform="translate(0 ${ySub})">${linhasSub}</g>
    <g transform="translate(0 ${yLeg})">${legenda}</g>
    <g transform="translate(0 ${yCar - 150})">
      <g transform="translate(24 0)" fill="none" stroke="${TINTA}" stroke-width="1.4">
        <path d="M0 96L22 0L44 96L22 76Z"/><path d="M22 0L22 76L0 96Z" fill="${TINTA}"/>
        <text x="22" y="128" text-anchor="middle" font-family="${FONTE_SERIF}" font-size="24" stroke="none" fill="${TINTA}">N</text>
      </g>
      <g transform="translate(120 72)">
        ${[0, 1, 2, 3, 4].map((i) => `<rect x="${i * 50}" y="0" width="50" height="10" fill="${i % 2 ? PAPEL : TINTA}" stroke="${TINTA}" stroke-width="1.2"/>`).join('')}
        ${[0, 1, 2, 3, 4, 5].map((i) => `<text x="${i * 50}" y="38" text-anchor="middle" font-family="${FONTE_MONO}" font-size="14">${i}</text>`).join('')}
        <text x="270" y="38" font-family="${FONTE_MONO}" font-size="14" fill="#857d70">km</text>
        <text x="0" y="-16" font-family="${FONTE_MONO}" font-size="13" letter-spacing="1.5" fill="#857d70">ESCALA GRÁFICA · 1:50.000</text>
      </g>
    </g>
    <g transform="translate(0 ${yCar})">${carimboSvg}</g>
    <g transform="translate(0 ${MH - 46})">
      <rect width="${PW - 64}" height="34" fill="none" stroke="#9c4a32" stroke-width="1.4" stroke-dasharray="7 5"/>
      <text x="${(PW - 64) / 2}" y="23" text-anchor="middle" font-family="${FONTE_MONO}" font-size="14" letter-spacing="3" fill="#9c4a32">PRANCHA-MODELO · DADOS SINTÉTICOS</text>
    </g>
  </g>
</svg>`;
}

const legTitulo = (t) =>
  `<text x="0" y="0" font-family="${FONTE_MONO}" font-size="15" letter-spacing="2.4" fill="#857d70">${esc(t)}</text>`;

/* =================================================================== 001 */
function densidade() {
  const n = ruido(11);
  const r = semente(5);
  const cx = 830;
  const cy = 840;
  const limite = [];
  for (let i = 0; i < 220; i++) {
    const a = (i / 220) * Math.PI * 2;
    const raio = 690 * (0.82 + 0.36 * n(Math.cos(a) * 1.6 + 3, Math.sin(a) * 1.6 + 3, 4));
    limite.push([cx + Math.cos(a) * raio, cy + Math.sin(a) * raio * 0.97]);
  }
  const centros = [
    [800, 820, 170, 1],
    [1150, 560, 95, 0.55],
    [520, 1160, 115, 0.5],
    [1190, 1190, 80, 0.42],
    [430, 520, 72, 0.35],
  ];
  const eixo = ([x, y]) => {
    // corredor viário diagonal
    const d = Math.abs(x + y - 1660) / Math.SQRT2;
    return 0.28 * Math.exp(-(d * d) / (2 * 45 * 45));
  };
  const C = 22;
  const celulas = [];
  for (let gy = 0; gy < MH / C; gy++)
    for (let gx = 0; gx < MW / C; gx++) {
      const x = gx * C + C / 2;
      const y = gy * C + C / 2;
      if (!dentro([x, y], limite)) continue;
      let v = 0;
      for (const [ax, ay, s, w] of centros) v += w * Math.exp(-((x - ax) ** 2 + (y - ay) ** 2) / (2 * s * s));
      v += eixo([x, y]);
      v += 0.32 * (n(x * 0.012, y * 0.012) - 0.45);
      v = lim(v + (r() - 0.5) * 0.05);
      celulas.push({ x, y, v });
    }
  const quadrados = celulas
    .filter((c) => c.v > 0.035)
    .map((c) => {
      const lado = Math.max(2.5, (C - 3) * Math.sqrt(c.v));
      return `<rect x="${f1(c.x - lado / 2)}" y="${f1(c.y - lado / 2)}" width="${f1(lado)}" height="${f1(lado)}" fill="${interpolateViridis(1 - c.v * 0.92)}"/>`;
    })
    .join('');
  const pontos = celulas
    .filter((c) => c.v <= 0.035)
    .map((c) => `M${f1(c.x - 0.8)} ${f1(c.y)}h1.6`)
    .join('');
  const svg = `
    <path d="${pontos}" stroke="${FINA}" stroke-width="1.6"/>
    ${quadrados}
    <path d="${caminho(limite)}" fill="none" stroke="${TINTA}" stroke-width="2.4" stroke-dasharray="14 6 3 6"/>`;

  const classes = [0.1, 0.3, 0.5, 0.7, 0.92];
  const rotulos = ['muito baixa', 'baixa', 'média', 'alta', 'muito alta'];
  const legenda =
    legTitulo('DENSIDADE (ÍNDICE 0–1)') +
    classes
      .map((v, i) => {
        const lado = (C - 3) * Math.sqrt(v) * 1.4;
        return `<g transform="translate(0 ${30 + i * 40})"><rect x="${f1(14 - lado / 2)}" y="${f1(14 - lado / 2)}" width="${f1(lado)}" height="${f1(lado)}" fill="${interpolateViridis(1 - v * 0.92)}"/>
        <text x="48" y="20" font-family="${FONTE_SERIF}" font-size="21">${rotulos[i]}</text></g>`;
      })
      .join('') +
    `<g transform="translate(0 ${30 + 5 * 40 + 6})"><path d="M0 14h28" stroke="${TINTA}" stroke-width="2.4" stroke-dasharray="10 4 2 4"/><text x="48" y="20" font-family="${FONTE_SERIF}" font-size="21">limite do recorte</text></g>
     <g transform="translate(0 ${30 + 6 * 40 + 6})"><path d="M13 14h2" stroke="${FINA}" stroke-width="2"/><text x="48" y="20" font-family="${FONTE_SERIF}" font-size="21">célula sem população</text></g>
     <text x="0" y="${30 + 7 * 40 + 24}" font-family="${FONTE_MONO}" font-size="14" fill="#857d70">grade regular de ${C * PX_M} m · viridis</text>`;

  const dxfArq = dxf([
    { nome: 'LIMITE', cor: 7, polilinhas: [{ pts: limite.map(metros), fechada: true }] },
    {
      nome: 'GRADE_DENSIDADE',
      cor: 5,
      polilinhas: celulas
        .filter((c) => c.v > 0.1)
        .map((c) => {
          const h = C / 2;
          return {
            fechada: true,
            z: Math.round(c.v * 100) / 100,
            pts: [[c.x - h, c.y - h], [c.x + h, c.y - h], [c.x + h, c.y + h], [c.x - h, c.y + h]].map(metros),
          };
        }),
    },
  ]);
  const csv =
    'id;x_m;y_m;indice_densidade\n' +
    celulas.map((c, i) => `${i + 1};${metros([c.x, c.y]).map((v) => v.toFixed(0)).join(';')};${c.v.toFixed(3)}`).join('\n') +
    '\n';
  return { svg: { svg }, legenda, arquivos: { 'dados/grade_densidade_sintetica.dxf': dxfArq, 'dados/grade_densidade_sintetica.csv': csv } };
}

/* =================================================================== 002 */
const RAMPA_HIPSO = ['#3d6b4a', '#6f8f55', '#a9a866', '#d1bd7c', '#c99a55', '#a8704a', '#8a5a44', '#b59d8d', '#e9e2d6'];
function corHipso(t) {
  const i = lim(t) * (RAMPA_HIPSO.length - 1);
  const a = Math.floor(i);
  const b = Math.min(a + 1, RAMPA_HIPSO.length - 1);
  const k = i - a;
  const hx = (c) => [1, 3, 5].map((j) => parseInt(c.slice(j, j + 2), 16));
  const [r1, g1, b1] = hx(RAMPA_HIPSO[a]);
  const [r2, g2, b2] = hx(RAMPA_HIPSO[b]);
  const m = (u, v) => Math.round(u + (v - u) * k);
  return `rgb(${m(r1, r2)},${m(g1, g2)},${m(b1, b2)})`;
}

function relevo() {
  const n = ruido(23);
  const nr = ruido(29);
  const C = 8;
  const nx = MW / C + 1;
  const ny = MH / C + 1;
  const vals = new Float64Array(nx * ny);
  let mn = Infinity;
  let mx = -Infinity;
  for (let j = 0; j < ny; j++)
    for (let i = 0; i < nx; i++) {
      const x = i * C;
      const y = j * C;
      const base = n(x * 0.0028, y * 0.0028, 6);
      const crista = 1 - Math.abs(2 * nr(x * 0.004, y * 0.004, 5) - 1);
      const eixo = 560 + 0.42 * x + 110 * Math.sin(x / 260);
      const faixa = Math.exp(-((y - eixo) ** 2) / (2 * 300 * 300));
      const v = 0.5 * base + 0.85 * faixa * crista ** 1.6 + 0.12 * faixa;
      vals[j * nx + i] = v;
      mn = Math.min(mn, v);
      mx = Math.max(mx, v);
    }
  const Z0 = 620;
  const Z1 = 2380;
  for (let k = 0; k < vals.length; k++) vals[k] = Z0 + ((vals[k] - mn) / (mx - mn)) * (Z1 - Z0);

  const niveis = [];
  for (let z = 700; z <= 2350; z += 50) niveis.push(z);
  const gerador = contours().size([nx, ny]).thresholds(niveis);
  const isolinhas = gerador(Array.from(vals));
  const anelParaPx = (anel) => anel.map(([x, y]) => [x * C - C / 2, y * C - C / 2]);
  const paraPath = (mp) => mp.coordinates.map((poly) => poly.map((anel) => caminho(anelParaPx(anel))).join('')).join('');

  const preenchimentos = isolinhas
    .map((c) => `<path d="${paraPath(c)}" fill="${corHipso((c.value - Z0) / (Z1 - Z0))}" stroke="none"/>`)
    .join('');
  const curvas = isolinhas
    .map((c) => {
      const mestra = c.value % 250 === 0;
      return `<path d="${paraPath(c)}" fill="none" stroke="#2b2420" stroke-opacity="${mestra ? 0.75 : 0.32}" stroke-width="${mestra ? 1.5 : 0.7}"/>`;
    })
    .join('');
  const fundo = `<rect width="${MW}" height="${MH}" fill="${corHipso(0)}"/>`;

  const passos = 9;
  const legenda =
    legTitulo('ALTITUDE (m)') +
    Array.from({ length: passos }, (_, i) => {
      const t = 1 - i / (passos - 1);
      const z = Math.round((Z0 + t * (Z1 - Z0)) / 50) * 50;
      return `<g transform="translate(0 ${24 + i * 30})"><rect width="44" height="30" fill="${corHipso(t)}" stroke="${TINTA}" stroke-width=".8"/>
      <text x="60" y="21" font-family="${FONTE_MONO}" font-size="17">${z.toLocaleString('pt-BR')}</text></g>`;
    }).join('') +
    `<g transform="translate(0 ${24 + passos * 30 + 22})">
      <path d="M0 8h44" stroke="#2b2420" stroke-width="1.5"/><text x="60" y="13" font-family="${FONTE_SERIF}" font-size="20">curva mestra · 250 m</text>
      <path d="M0 38h44" stroke="#2b2420" stroke-opacity=".5" stroke-width=".8"/><text x="60" y="43" font-family="${FONTE_SERIF}" font-size="20">intermediária · 50 m</text>
    </g>`;

  // DXF: todas as curvas (50 m) com cota (Z) — prontas para maquete e corte
  const polilinhas = [];
  for (const c of isolinhas) {
    for (const poly of c.coordinates)
      for (const anel of poly) {
        const pts = anelParaPx(anel).filter((_, k, arr) => k % 2 === 0 || k === arr.length - 1);
        if (pts.length > 3) polilinhas.push({ pts: pts.map(metros), fechada: true, z: c.value });
      }
  }
  const dxfArq = dxf([
    { nome: 'CURVAS_MESTRAS_250M', cor: 1, polilinhas: polilinhas.filter((p) => p.z % 250 === 0) },
    { nome: 'CURVAS_INTERMEDIARIAS_50M', cor: 8, polilinhas: polilinhas.filter((p) => p.z % 250 !== 0) },
  ]);
  return { svg: { svg: fundo + preenchimentos + curvas }, legenda, arquivos: { 'dados/curvas_nivel_sinteticas.dxf': dxfArq } };
}

/* =================================================================== 003 */
const CLASSES_USO = {
  florestal: { nome: 'Formação florestal', cor: '#2e5a3c' },
  savanica: { nome: 'Formação savânica', cor: '#7f9a52' },
  campestre: { nome: 'Formação campestre', cor: '#cfc78e' },
  pastagem: { nome: 'Pastagem', cor: '#e2c48a' },
  agricultura: { nome: 'Agricultura temporária', cor: '#c07a45' },
  silvicultura: { nome: 'Silvicultura', cor: '#6b5577' },
  urbano: { nome: 'Área urbanizada', cor: '#4a4540' },
  agua: { nome: 'Corpo d’água', cor: '#1f3a5f' },
};

function usoDoSolo() {
  const n1 = ruido(31);
  const n2 = ruido(37);
  const n3 = ruido(41);
  const r = semente(3);
  const S = 30;
  const pts = [];
  for (let y = 0; y < MH + S; y += S) for (let x = 0; x < MW + S; x += S) pts.push([x + (r() - 0.5) * S * 0.9, y + (r() - 0.5) * S * 0.9]);
  const vor = Delaunay.from(pts).voronoi([0, 0, MW, MH]);

  // rio sinuoso
  const rio = [];
  for (let x = -20; x <= MW + 20; x += 10) rio.push([x, 900 + 220 * Math.sin(x / 330) + 90 * (n3(x * 0.004, 2) - 0.5) * 4]);
  const distRio = ([x, y]) => {
    let d = Infinity;
    for (const [rx, ry] of rio) d = Math.min(d, Math.hypot(rx - x, ry - y));
    return d;
  };
  const urbano = [1260, 380];
  const celulas = [];
  pts.forEach((p, i) => {
    const poli = vor.cellPolygon(i);
    if (!poli) return;
    const [x, y] = p;
    const a = n1(x * 0.0035, y * 0.0035);
    const b = n2(x * 0.0025, y * 0.0025);
    const c = n3(x * 0.01, y * 0.01);
    const dr = distRio(p);
    let k;
    if (Math.hypot(x - urbano[0], y - urbano[1]) < 120 + 40 * c) k = 'urbano';
    else if (dr < 34 + 30 * c) k = 'florestal';
    else if (b > 0.57) k = 'agricultura';
    else if (c > 0.74 && a > 0.4) k = 'silvicultura';
    else if (a < 0.4) k = 'pastagem';
    else if (a > 0.62) k = 'campestre';
    else if (a > 0.56 && c < 0.4) k = 'florestal';
    else k = 'savanica';
    celulas.push({ k, poli });
  });

  // pivôs centrais sobre as manchas agrícolas
  const pivos = [];
  for (let t = 0; t < 400 && pivos.length < 16; t++) {
    const x = 80 + r() * (MW - 160);
    const y = 80 + r() * (MH - 160);
    const raio = 38 + r() * 26;
    if (n2(x * 0.0025, y * 0.0025) < 0.62 || distRio([x, y]) < 90) continue;
    if (pivos.some((p) => Math.hypot(p[0] - x, p[1] - y) < p[2] + raio + 10)) continue;
    pivos.push([x, y, raio]);
  }

  const svg =
    celulas.map((c) => `<path d="${caminho(c.poli)}" fill="${CLASSES_USO[c.k].cor}" stroke="#fbf9f4" stroke-width=".7" stroke-opacity=".55"/>`).join('') +
    pivos
      .map(
        ([x, y, rr]) =>
          `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr)}" fill="#d99a5c" stroke="#fbf9f4" stroke-width="1.6"/><path d="M${f1(x)} ${f1(y)}L${f1(x + rr * 0.92)} ${f1(y - rr * 0.38)}" stroke="#fbf9f4" stroke-width="1"/>`,
      )
      .join('') +
    `<path d="${caminho(rio, false)}" fill="none" stroke="#fbf9f4" stroke-width="12"/>` +
    `<path d="${caminho(rio, false)}" fill="none" stroke="${CLASSES_USO.agua.cor}" stroke-width="7"/>`;

  const ordem = ['florestal', 'savanica', 'campestre', 'pastagem', 'agricultura', 'silvicultura', 'urbano', 'agua'];
  const legenda =
    legTitulo('COBERTURA E USO') +
    ordem
      .map(
        (k, i) =>
          `<g transform="translate(0 ${24 + i * 36})"><rect width="34" height="24" fill="${CLASSES_USO[k].cor}" stroke="${TINTA}" stroke-width=".8"/><text x="50" y="19" font-family="${FONTE_SERIF}" font-size="20">${CLASSES_USO[k].nome}</text></g>`,
      )
      .join('') +
    `<g transform="translate(0 ${24 + ordem.length * 36})"><circle cx="17" cy="12" r="12" fill="#d99a5c" stroke="${TINTA}" stroke-width=".8"/><text x="50" y="19" font-family="${FONTE_SERIF}" font-size="20">Pivô central de irrigação</text></g>`;

  const areas = {};
  for (const c of celulas) areas[c.k] = (areas[c.k] ?? 0) + (areaPoli(c.poli) * PX_M * PX_M) / 10000;
  const total = Object.values(areas).reduce((a, b) => a + b, 0);
  const csv =
    'classe;area_ha;percentual\n' +
    ordem
      .filter((k) => areas[k])
      .map((k) => `${CLASSES_USO[k].nome};${areas[k].toFixed(1)};${((areas[k] / total) * 100).toFixed(2)}`)
      .join('\n') +
    '\n';
  const dxfArq = dxf([
    ...ordem.map((k, i) => ({
      nome: `USO_${k.toUpperCase()}`,
      cor: [3, 82, 51, 42, 30, 200, 8, 5][i],
      polilinhas: celulas.filter((c) => c.k === k).map((c) => ({ pts: c.poli.slice(0, -1).map(metros), fechada: true })),
    })),
    {
      nome: 'PIVOS',
      cor: 30,
      polilinhas: pivos.map(([x, y, rr]) => ({
        fechada: true,
        pts: Array.from({ length: 48 }, (_, k) => metros([x + rr * Math.cos((k / 48) * 2 * Math.PI), y + rr * Math.sin((k / 48) * 2 * Math.PI)])),
      })),
    },
    { nome: 'HIDROGRAFIA', cor: 5, polilinhas: [{ pts: rio.map(metros), fechada: false }] },
  ]);
  return { svg: { svg }, legenda, arquivos: { 'dados/uso_solo_sintetico.dxf': dxfArq, 'dados/uso_solo_areas.csv': csv } };
}

/* =================================================================== 004 */
function figuraFundo() {
  const n = ruido(53);
  const r = semente(7);
  const pts = [];
  // dois tecidos: xadrez rotacionado (expansão planejada) e malha orgânica (núcleo antigo)
  const nucleo = [560, 760];
  for (let y = -60; y < MH + 60; y += 52)
    for (let x = -60; x < MW + 60; x += 52) {
      const d = Math.hypot(x - nucleo[0], y - nucleo[1]);
      if (d < 420) {
        pts.push([x + (r() - 0.5) * 40, y + (r() - 0.5) * 40]);
      } else {
        const a = 0.32;
        const gx = (x - 800) * Math.cos(a) - (y - 800) * Math.sin(a) + 800;
        const gy = (x - 800) * Math.sin(a) + (y - 800) * Math.cos(a) + 800;
        pts.push([gx + (r() - 0.5) * 6, gy + (r() - 0.5) * 6]);
      }
    }
  const dentroMapa = pts.filter(([x, y]) => x > -40 && y > -40 && x < MW + 40 && y < MH + 40);
  const vor = Delaunay.from(dentroMapa).voronoi([-20, -20, MW + 20, MH + 20]);

  const rio = [];
  for (let y = -20; y <= MH + 20; y += 10) rio.push([1180 + 160 * Math.sin(y / 280) + 60 * (n(3, y * 0.004) - 0.5) * 3, y]);
  const avenidas = [
    [[-20, 1500], [600, 1080], [1000, 820], [1700, 380]],
    [[300, -20], [520, 520], [600, 1100], [680, 1700]],
    [[-20, 420], [700, 640], [1700, 900]],
  ];
  const perto = (p, linha, d) => {
    for (let i = 0; i < linha.length - 1; i++) {
      const [ax, ay] = linha[i];
      const [bx, by] = linha[i + 1];
      const t = lim(((p[0] - ax) * (bx - ax) + (p[1] - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2));
      if (Math.hypot(p[0] - (ax + t * (bx - ax)), p[1] - (ay + t * (by - ay))) < d) return true;
    }
    return false;
  };

  const quadras = [];
  const parques = [];
  const pracas = [];
  dentroMapa.forEach((p, i) => {
    const poli = vor.cellPolygon(i);
    if (!poli) return;
    if (perto(p, rio, 70)) return;
    const k = n(p[0] * 0.006, p[1] * 0.006);
    if (perto(p, rio, 120) || k > 0.7) {
      parques.push(poli);
      return;
    }
    const q = recuar(poli, 7);
    if (!q) return;
    if (r() < 0.035) pracas.push(q);
    else quadras.push(q);
  });

  const defs = `<pattern id="hachura" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v9" stroke="#2e5a3c" stroke-width="1.3"/></pattern>`;
  const svg =
    parques.map((p) => `<path d="${caminho(p)}" fill="url(#hachura)"/>`).join('') +
    quadras.map((q) => `<path d="${caminho(q)}" fill="${TINTA}"/>`).join('') +
    pracas.map((q) => `<path d="${caminho(q)}" fill="none" stroke="${TINTA}" stroke-width="1.2" stroke-dasharray="3 4"/>`).join('') +
    avenidas.map((a) => `<path d="${caminho(a, false)}" fill="none" stroke="${PAPEL}" stroke-width="20" stroke-linejoin="round"/>`).join('') +
    `<path d="${caminho(rio, false)}" fill="none" stroke="${TINTA}" stroke-width="46"/>` +
    `<path d="${caminho(rio, false)}" fill="none" stroke="#dfe4e3" stroke-width="42"/>` +
    `<path d="${caminho(rio, false)}" fill="none" stroke="#1f3a5f" stroke-width=".8" stroke-dasharray="12 10" opacity=".7"/>`;

  const legenda =
    legTitulo('FIGURA-FUNDO') +
    `<g transform="translate(0 24)"><rect width="34" height="24" fill="${TINTA}"/><text x="50" y="19" font-family="${FONTE_SERIF}" font-size="20">Quadra edificável (figura)</text></g>
     <g transform="translate(0 60)"><rect width="34" height="24" fill="${PAPEL}" stroke="${TINTA}" stroke-width=".8"/><text x="50" y="19" font-family="${FONTE_SERIF}" font-size="20">Espaço livre público (fundo)</text></g>
     <g transform="translate(0 96)"><rect width="34" height="24" fill="url(#hachura)" stroke="${TINTA}" stroke-width=".8"/><text x="50" y="19" font-family="${FONTE_SERIF}" font-size="20">Parque / área verde</text></g>
     <g transform="translate(0 132)"><rect x="1" y="1" width="32" height="22" fill="none" stroke="${TINTA}" stroke-width="1.2" stroke-dasharray="3 4"/><text x="50" y="19" font-family="${FONTE_SERIF}" font-size="20">Praça</text></g>
     <g transform="translate(0 168)"><rect width="34" height="24" fill="#dfe4e3" stroke="${TINTA}" stroke-width="1.6"/><text x="50" y="19" font-family="${FONTE_SERIF}" font-size="20">Curso d’água</text></g>
     <text x="0" y="234" font-family="${FONTE_MONO}" font-size="14" fill="#857d70">à maneira de G. Nolli (Roma, 1748)</text>`;

  const dxfArq = dxf([
    { nome: 'QUADRAS', cor: 7, polilinhas: quadras.map((q) => ({ pts: q.map(metros), fechada: true })) },
    { nome: 'PRACAS', cor: 8, polilinhas: pracas.map((q) => ({ pts: q.map(metros), fechada: true })) },
    { nome: 'AREAS_VERDES', cor: 3, polilinhas: parques.map((p) => ({ pts: p.slice(0, -1).map(metros), fechada: true })) },
    { nome: 'EIXOS_VIARIOS', cor: 1, polilinhas: avenidas.map((a) => ({ pts: a.map(metros), fechada: false })) },
    { nome: 'HIDROGRAFIA', cor: 5, polilinhas: [{ pts: rio.map(metros), fechada: false }] },
  ]);
  return { svg: { svg, defs }, legenda, arquivos: { 'dados/figura_fundo_sintetica.dxf': dxfArq } };
}

/* =================================================================== modelo vazio */
function modeloVazio() {
  const defs = `<pattern id="vazio" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v14" stroke="${FINA}" stroke-width="1"/></pattern>`;
  const svg = `<rect width="${MW}" height="${MH}" fill="url(#vazio)"/>
    <rect x="${MW / 2 - 330}" y="${MH / 2 - 70}" width="660" height="140" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1.2"/>
    <text x="${MW / 2}" y="${MH / 2 - 6}" text-anchor="middle" font-family="${FONTE_SERIF}" font-size="44">Prancha em preparo</text>
    <text x="${MW / 2}" y="${MH / 2 + 38}" text-anchor="middle" font-family="${FONTE_MONO}" font-size="17" letter-spacing="3" fill="#857d70">SUBSTITUA mapa_preview.png</text>`;
  return { svg: { svg, defs }, legenda: legTitulo('LEGENDA') };
}

/* =================================================================== execução */
const PRANCHAS = [
  {
    pasta: 'mapas/001-densidade-urbana-grade-estatistica',
    numero: 1,
    titulo: ['Densidade urbana', 'em grade regular'],
    subtitulo: ['O município sem os contornos', 'arbitrários dos setores'],
    data: '10 out. 2026',
    crs: 'SIRGAS 2000 / UTM 23S',
    fonte: 'Sintética · modelo IBGE',
    gerar: densidade,
  },
  {
    pasta: 'mapas/002-hipsometria-curvas-de-nivel',
    numero: 2,
    titulo: ['Hipsometria e', 'curvas de nível'],
    subtitulo: ['Patamares de altitude de uma', 'serra imaginária'],
    data: '12 out. 2026',
    crs: 'SIRGAS 2000 / UTM 23S',
    fonte: 'Sintética · modelo MDE',
    gerar: relevo,
  },
  {
    pasta: 'mapas/003-mosaico-uso-cobertura-cerrado',
    numero: 3,
    titulo: ['Mosaico de uso e', 'cobertura do solo'],
    subtitulo: ['Uma paisagem-tipo do Cerrado:', 'veredas, pastos e pivôs'],
    data: '14 out. 2026',
    crs: 'SIRGAS 2000 / UTM 23S',
    fonte: 'Sintética · modelo MapBiomas',
    gerar: usoDoSolo,
  },
  {
    pasta: 'mapas/004-figura-fundo-malha-urbana',
    numero: 4,
    titulo: ['Figura-fundo da', 'malha urbana'],
    subtitulo: ['Cheios e vazios de uma cidade', 'que cresceu em dois tempos'],
    data: '16 out. 2026',
    crs: 'SIRGAS 2000 / UTM 23S',
    fonte: 'Sintética · modelo OSM',
    gerar: figuraFundo,
  },
  {
    pasta: 'templates/mapa',
    numero: 0,
    titulo: ['Título do mapa'],
    subtitulo: ['Subtítulo da prancha'],
    data: 'aaaa-mm-dd',
    crs: 'SIRGAS 2000 / …',
    fonte: '…',
    gerar: modeloVazio,
  },
];

for (const p of PRANCHAS) {
  const t0 = Date.now();
  const { svg, legenda, arquivos = {} } = p.gerar();
  const destino = join(RAIZ, p.pasta);
  await mkdir(join(destino, 'dados'), { recursive: true });
  const prancha_svg = prancha({
    numero: p.numero,
    titulo: p.titulo,
    subtitulo: p.subtitulo,
    data: p.data,
    crs: p.crs,
    legenda,
    mapa: svg,
    rodapeFonte: p.fonte,
  });
  const png = join(destino, 'mapa_preview.png');
  await sharp(Buffer.from(prancha_svg), { density: 72, limitInputPixels: false })
    .png({ compressionLevel: 9, palette: p.numero === 2 ? false : true, quality: 92 })
    .toFile(png);
  const linhas = [`  mapa_preview.png  ${((await stat(png)).size / 1e6).toFixed(2)} MB`];
  for (const [nome, conteudo] of Object.entries(arquivos)) {
    const arq = join(destino, nome);
    await writeFile(arq, conteudo);
    linhas.push(`  ${nome}  ${((await stat(arq)).size / 1e6).toFixed(2)} MB`);
  }
  console.log(`✓ ${p.pasta}  (${Date.now() - t0} ms)\n${linhas.join('\n')}`);
}
