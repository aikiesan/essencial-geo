/**
 * Coleções do Censo 2022 — leitura e gravação de dados em Node, sem dependências (uso interno).
 *
 *   linhasCsv(arq)            linhas de um CSV do IBGE (separador ";"), em fluxo
 *   linhasXlsx(arq)           linhas da 1ª planilha de um XLSX, em fluxo (o ZIP é lido à mão)
 *   lerShp(base, filtro)      shapefile → feições GeoJSON (ponto, linha, polígono; .dbf com .cpg)
 *   lerGpkg(arq, camada)      GeoPackage → feições GeoJSON (node:sqlite)
 *   gravarGpkg(arq, camadas)  feições → GeoPackage (EPSG:4674), com a tabela layer_styles do QGIS
 *   zipar(arq)                compacta num ZIP (deflate) e apaga o original
 *   gravarCsv, gravarCache, gravarGrade
 *
 * Nada aqui estima valor: lê tabelas oficiais, junta por código e grava.
 */
import { createReadStream, readFileSync, writeFileSync, existsSync, mkdirSync, openSync, readSync, closeSync, statSync, unlinkSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { createInflateRaw, deflateRawSync, inflateRawSync, crc32 } from 'node:zlib';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

export const RAIZ = fileURLToPath(new URL('../../..', import.meta.url));
export const CACHE = join(RAIZ, 'scripts', 'colecoes', 'cache');
export const BRUTOS = join(RAIZ, 'dados-brutos');

/* ------------------------------------------------------------------ CSV */
/** Divide uma linha CSV respeitando aspas. */
function campos(linha, sep) {
  if (!linha.includes('"')) return linha.split(sep);
  const out = [];
  let atual = '';
  let dentro = false;
  for (let i = 0; i < linha.length; i++) {
    const c = linha[i];
    if (c === '"') {
      if (dentro && linha[i + 1] === '"') { atual += '"'; i++; } else dentro = !dentro;
    } else if (c === sep && !dentro) { out.push(atual); atual = ''; } else atual += c;
  }
  out.push(atual);
  return out;
}

export async function* linhasCsv(arq, { sep = ';', encoding = 'utf8' } = {}) {
  const rl = createInterface({ input: createReadStream(arq, { encoding }), crlfDelay: Infinity });
  let primeira = true;
  for await (let l of rl) {
    if (primeira) { l = l.replace(/^﻿/, ''); primeira = false; }
    if (l === '') continue;
    yield campos(l, sep);
  }
}

/** CSV inteiro como lista de objetos (cabeçalho na 1ª linha). */
export async function lerCsv(arq, opts = {}) {
  const out = [];
  let cab = null;
  for await (const c of linhasCsv(arq, opts)) {
    if (!cab) { cab = c; continue; }
    const o = {};
    cab.forEach((k, i) => { o[k] = c[i]; });
    out.push(o);
  }
  return out;
}

const csvCampo = (v) => {
  if (v === null || v === undefined || (typeof v === 'number' && Number.isNaN(v))) return '';
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** Grava objetos como CSV (UTF-8, vírgula), na ordem de `colunas`. */
export function gravarCsv(arq, linhas, colunas) {
  const cols = colunas ?? Object.keys(linhas[0]);
  const txt = [cols.join(','), ...linhas.map((l) => cols.map((c) => csvCampo(l[c])).join(','))].join('\n') + '\n';
  writeFileSync(arq, txt, 'utf8');
  return statSync(arq).size;
}

/* ------------------------------------------------------------------ ZIP (leitura) */
function entradasZip(arq) {
  const fd = openSync(arq, 'r');
  const tam = statSync(arq).size;
  const n = Math.min(tam, 66000);
  const cauda = Buffer.alloc(n);
  readSync(fd, cauda, 0, n, tam - n);
  let p = cauda.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (p < 0) throw new Error(`${arq}: ZIP sem diretório central`);
  let total = cauda.readUInt16LE(p + 10);
  let cdTam = cauda.readUInt32LE(p + 12);
  let cdOff = cauda.readUInt32LE(p + 16);
  const loc = cauda.lastIndexOf(Buffer.from([0x50, 0x4b, 0x06, 0x07]), p);
  if (loc >= 0 && (cdOff === 0xffffffff || total === 0xffff)) {
    const z64 = Number(cauda.readBigUInt64LE(loc + 8));
    const r = Buffer.alloc(56);
    readSync(fd, r, 0, 56, z64);
    total = Number(r.readBigUInt64LE(32));
    cdTam = Number(r.readBigUInt64LE(40));
    cdOff = Number(r.readBigUInt64LE(48));
  }
  const cd = Buffer.alloc(cdTam);
  readSync(fd, cd, 0, cdTam, cdOff);
  const ents = {};
  let q = 0;
  for (let i = 0; i < total; i++) {
    const metodo = cd.readUInt16LE(q + 10);
    let comp = cd.readUInt32LE(q + 20);
    let desc = cd.readUInt32LE(q + 24);
    const nl = cd.readUInt16LE(q + 28);
    const el = cd.readUInt16LE(q + 30);
    const cl = cd.readUInt16LE(q + 32);
    let off = cd.readUInt32LE(q + 42);
    const nome = cd.toString('utf8', q + 46, q + 46 + nl);
    let e = q + 46 + nl;
    const fimE = e + el;
    while (e < fimE) {
      const id = cd.readUInt16LE(e);
      const t = cd.readUInt16LE(e + 2);
      if (id === 1) {
        let k = e + 4;
        if (desc === 0xffffffff) { desc = Number(cd.readBigUInt64LE(k)); k += 8; }
        if (comp === 0xffffffff) { comp = Number(cd.readBigUInt64LE(k)); k += 8; }
        if (off === 0xffffffff) { off = Number(cd.readBigUInt64LE(k)); k += 8; }
      }
      e += 4 + t;
    }
    ents[nome] = { metodo, comp, desc, off };
    q = fimE + cl;
  }
  for (const ent of Object.values(ents)) {
    const h = Buffer.alloc(30);
    readSync(fd, h, 0, 30, ent.off);
    ent.dados = ent.off + 30 + h.readUInt16LE(26) + h.readUInt16LE(28);
  }
  closeSync(fd);
  return ents;
}

function fluxoZip(arq, ent) {
  const s = createReadStream(arq, { start: ent.dados, end: ent.dados + ent.comp - 1 });
  return ent.metodo === 0 ? s : s.pipe(createInflateRaw());
}

function lerEntrada(arq, ent) {
  const fd = openSync(arq, 'r');
  const b = Buffer.alloc(ent.comp);
  readSync(fd, b, 0, ent.comp, ent.dados);
  closeSync(fd);
  return ent.metodo === 0 ? b : inflateRawSync(b);
}

const ENT = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'" };
const desxml = (s) => s.replace(/&(amp|lt|gt|quot|apos);|&#(\d+);|&#x([0-9a-f]+);/gi, (m, a, d, h) =>
  (a ? ENT[m] : String.fromCodePoint(d ? Number(d) : parseInt(h, 16))));

const colunaIdx = (letras) => { let n = 0; for (const c of letras) n = n * 26 + (c.charCodeAt(0) - 64); return n - 1; };

/** Linhas da primeira planilha de um XLSX (valores em texto; células vazias = ''). */
export async function* linhasXlsx(arq) {
  const ents = entradasZip(arq);
  const compartilhadas = [];
  if (ents['xl/sharedStrings.xml']) {
    const xml = lerEntrada(arq, ents['xl/sharedStrings.xml']).toString('utf8');
    for (const m of xml.matchAll(/<si>([\s\S]*?)<\/si>/g)) {
      compartilhadas.push(desxml([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join('')));
    }
  }
  const folha = Object.keys(ents).filter((k) => /^xl\/worksheets\/sheet\d+\.xml$/.test(k)).sort()[0];
  let resto = '';
  const reCel = /<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g;
  for await (const pedaco of fluxoZip(arq, ents[folha])) {
    resto += pedaco.toString('utf8');
    let fim = resto.lastIndexOf('</row>');
    if (fim < 0) continue;
    fim += 6;
    const bloco = resto.slice(0, fim);
    resto = resto.slice(fim);
    for (const r of bloco.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
      const linha = [];
      for (const c of r[1].matchAll(reCel)) {
        const i = colunaIdx(c[1]);
        const tipo = /t="(\w+)"/.exec(c[2])?.[1];
        const corpo = c[3] ?? '';
        let v = '';
        if (tipo === 'inlineStr') v = desxml([...corpo.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join(''));
        else {
          const vv = /<v>([\s\S]*?)<\/v>/.exec(corpo)?.[1] ?? '';
          v = tipo === 's' ? compartilhadas[Number(vv)] : desxml(vv);
        }
        while (linha.length < i) linha.push('');
        linha[i] = v;
      }
      yield linha;
    }
  }
}

/* ------------------------------------------------------------------ geometria */
export const areaAnel = (r) => {
  let a = 0;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += (r[j][0] - r[i][0]) * (r[j][1] + r[i][1]);
  return a / 2; // área com sinal: > 0 = anti-horário, < 0 = horário (y para cima)
};

export function dentroAnel([x, y], r) {
  let d = false;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i];
    const [xj, yj] = r[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) d = !d;
  }
  return d;
}

/** Polígonos de uma geometria (Polygon ou MultiPolygon) como lista de listas de anéis. */
export const poligonos = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []);

export function dentro(pt, g) {
  return poligonos(g).some((p) => dentroAnel(pt, p[0]) && !p.slice(1).some((h) => dentroAnel(pt, h)));
}

export function caixa(g) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const v = (c) => {
    if (typeof c[0] === 'number') { if (c[0] < x0) x0 = c[0]; if (c[0] > x1) x1 = c[0]; if (c[1] < y0) y0 = c[1]; if (c[1] > y1) y1 = c[1]; } else c.forEach(v);
  };
  v(g.coordinates);
  return [x0, y0, x1, y1];
}

/** Ponto dentro do polígono: o meio do trecho interno mais largo numa varredura horizontal do maior anel. */
export function pontoInterno(g) {
  const ps = poligonos(g);
  if (!ps.length) return g.type === 'Point' ? g.coordinates : null;
  const p = ps.reduce((a, b) => (Math.abs(areaAnel(b[0])) > Math.abs(areaAnel(a[0])) ? b : a));
  const [, y0, , y1] = caixa({ coordinates: p[0] });
  let melhor = null;
  let larg = -1;
  for (let k = 1; k < 12; k++) {
    const y = y0 + ((y1 - y0) * k) / 12;
    const xs = [];
    for (const r of p) for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const [xi, yi] = r[i];
      const [xj, yj] = r[j];
      if ((yi > y) !== (yj > y)) xs.push(((xj - xi) * (y - yi)) / (yj - yi) + xi);
    }
    xs.sort((a, b) => a - b);
    for (let i = 0; i + 1 < xs.length; i += 2) if (xs[i + 1] - xs[i] > larg) { larg = xs[i + 1] - xs[i]; melhor = [(xs[i] + xs[i + 1]) / 2, y]; }
  }
  return melhor;
}

/** Douglas-Peucker num anel ou linha (tolerância em graus). */
export function simplificarLinha(pts, tol) {
  if (pts.length < 4 || !tol) return pts;
  const t2 = tol * tol;
  const manter = new Uint8Array(pts.length);
  manter[0] = manter[pts.length - 1] = 1;
  const pilha = [[0, pts.length - 1]];
  while (pilha.length) {
    const [a, b] = pilha.pop();
    const [ax, ay] = pts[a];
    const [bx, by] = pts[b];
    const dx = bx - ax, dy = by - ay;
    const L = dx * dx + dy * dy;
    let dmax = -1, imax = -1;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = pts[i];
      let t = L ? ((px - ax) * dx + (py - ay) * dy) / L : 0;
      t = Math.max(0, Math.min(1, t));
      const ex = ax + t * dx - px, ey = ay + t * dy - py;
      const d = ex * ex + ey * ey;
      if (d > dmax) { dmax = d; imax = i; }
    }
    if (dmax > t2) { manter[imax] = 1; pilha.push([a, imax], [imax, b]); }
  }
  return pts.filter((_, i) => manter[i]);
}

/** Simplifica uma geometria; anéis que somem viram nada (polígonos pequenos demais são descartados). */
export function simplificar(g, tol) {
  if (!tol) return g;
  const anel = (r) => { const s = simplificarLinha(r, tol); return s.length >= 4 ? s : null; };
  if (g.type === 'Polygon' || g.type === 'MultiPolygon') {
    const ps = poligonos(g).map((p) => { const ext = anel(p[0]); return ext ? [ext, ...p.slice(1).map(anel).filter(Boolean)] : null; }).filter(Boolean);
    if (!ps.length) return null;
    return ps.length === 1 ? { type: 'Polygon', coordinates: ps[0] } : { type: 'MultiPolygon', coordinates: ps };
  }
  if (g.type === 'LineString') return { type: 'LineString', coordinates: simplificarLinha(g.coordinates, tol) };
  if (g.type === 'MultiLineString') return { type: 'MultiLineString', coordinates: g.coordinates.map((l) => simplificarLinha(l, tol)) };
  return g;
}

/** Orienta anéis: externo horário (como o d3 espera para polígonos pequenos), furos anti-horários. */
export function orientar(g, externoHorario = true) {
  const or = (r, horario) => ((areaAnel(r) < 0) === horario ? r : [...r].reverse());
  const ps = poligonos(g).map((p) => [or(p[0], externoHorario), ...p.slice(1).map((h) => or(h, !externoHorario))]);
  if (g.type === 'Polygon') return { type: 'Polygon', coordinates: ps[0] };
  if (g.type === 'MultiPolygon') return { type: 'MultiPolygon', coordinates: ps };
  return g;
}

const arred = (c, k) => (typeof c === 'number' ? Math.round(c * 10 ** k) / 10 ** k : c.map((x) => arred(x, k)));

/** FeatureCollection para a prancha: simplificada, orientada e com coordenadas arredondadas. */
export function paraD3(feats, campos, { tol = 0, casas = 4 } = {}) {
  const out = [];
  for (const f of feats) {
    let g = simplificar(f.geometry, tol);
    if (!g) continue;
    g = orientar(g, true);
    const p = {};
    for (const c of campos) p[c] = f.properties[c] ?? null;
    out.push({ type: 'Feature', properties: p, geometry: { type: g.type, coordinates: arred(g.coordinates, casas) } });
  }
  return { type: 'FeatureCollection', features: out };
}

/* ---- distâncias (km), numa projeção local equirretangular: suficiente para centenas de km */
const KM_LAT = 110.574;
const KM_LON = (lat) => 111.32 * Math.cos((lat * Math.PI) / 180);

/** Segmentos de linhas (LineString/MultiLineString) prontos para medir distância. */
export function segmentos(feats) {
  const s = [];
  for (const f of feats) {
    const g = f.geometry;
    const ls = g.type === 'LineString' ? [g.coordinates] : g.type === 'MultiLineString' ? g.coordinates : [];
    for (const l of ls) for (let i = 1; i < l.length; i++) s.push([l[i - 1][0], l[i - 1][1], l[i][0], l[i][1]]);
  }
  return s;
}

/** Distância em km de um ponto ao segmento mais próximo (ou ao ponto mais próximo, com `pontos`). */
export function distanciaKm([lon, lat], segs) {
  const kx = KM_LON(lat);
  let melhor = Infinity;
  for (const [x1, y1, x2, y2] of segs) {
    const ax = (x1 - lon) * kx, ay = (y1 - lat) * KM_LAT, bx = (x2 - lon) * kx, by = (y2 - lat) * KM_LAT;
    const dx = bx - ax, dy = by - ay;
    const L = dx * dx + dy * dy;
    let t = L ? -(ax * dx + ay * dy) / L : 0;
    t = Math.max(0, Math.min(1, t));
    const ex = ax + t * dx, ey = ay + t * dy;
    const d = ex * ex + ey * ey;
    if (d < melhor) melhor = d;
  }
  return Math.sqrt(melhor);
}

export function distanciaPontosKm([lon, lat], pts) {
  const kx = KM_LON(lat);
  let melhor = Infinity;
  for (const [x, y] of pts) {
    const d = ((x - lon) * kx) ** 2 + ((y - lat) * KM_LAT) ** 2;
    if (d < melhor) melhor = d;
  }
  return Math.sqrt(melhor);
}

/** Comprimento geodésico aproximado (km) de linhas. */
export function comprimentoKm(feats) {
  let km = 0;
  for (const [x1, y1, x2, y2] of segmentos(feats)) {
    const lat = (y1 + y2) / 2;
    km += Math.hypot((x2 - x1) * KM_LON(lat), (y2 - y1) * KM_LAT);
  }
  return km;
}

/* ---- grade (rasterização por varredura) */
export function novaGrade([x0, y0, x1, y1], passo) {
  const largura = Math.ceil((x1 - x0) / passo);
  const altura = Math.ceil((y1 - y0) / passo);
  return { largura, altura, x0, y0: y1, dx: passo, dy: passo, dados: new Uint8Array(largura * altura) };
}

/** Pinta na grade as células cujo centro cai dentro do polígono. */
export function rasterizar(grade, g, valor) {
  const { largura, altura, x0, y0, dx, dy, dados } = grade;
  for (const p of poligonos(g)) {
    const [bx0, by0, bx1, by1] = caixa({ coordinates: p });
    const j0 = Math.max(0, Math.floor((y0 - by1) / dy));
    const j1 = Math.min(altura - 1, Math.ceil((y0 - by0) / dy));
    for (let j = j0; j <= j1; j++) {
      const y = y0 - (j + 0.5) * dy;
      const xs = [];
      for (const r of p) for (let i = 0, k = r.length - 1; i < r.length; k = i++) {
        const [xi, yi] = r[i];
        const [xk, yk] = r[k];
        if ((yi > y) !== (yk > y)) xs.push(((xk - xi) * (y - yi)) / (yk - yi) + xi);
      }
      if (xs.length < 2) continue;
      xs.sort((a, b) => a - b);
      for (let i = 0; i + 1 < xs.length; i += 2) {
        const i0 = Math.max(0, Math.ceil((xs[i] - x0) / dx - 0.5));
        const i1 = Math.min(largura - 1, Math.floor((xs[i + 1] - x0) / dx - 0.5));
        for (let c = i0; c <= i1; c++) dados[j * largura + c] = valor;
      }
    }
    // Polígono menor que uma célula: pinta a célula do seu ponto interno, se ainda vazia.
    if ((bx1 - bx0) < dx || (by1 - by0) < dy) {
      const c = Math.floor((((bx0 + bx1) / 2) - x0) / dx);
      const j = Math.floor((y0 - (by0 + by1) / 2) / dy);
      if (c >= 0 && j >= 0 && c < largura && j < altura && !dados[j * largura + c]) dados[j * largura + c] = valor;
    }
  }
}

/* ------------------------------------------------------------------ shapefile */
function lerDbf(arq) {
  const b = readFileSync(arq);
  const cpg = arq.replace(/\.dbf$/i, '.cpg');
  const enc = existsSync(cpg) && /utf-?8/i.test(readFileSync(cpg, 'utf8')) ? 'utf8' : 'latin1';
  const n = b.readUInt32LE(4);
  const cab = b.readUInt16LE(8);
  const reg = b.readUInt16LE(10);
  const campos = [];
  for (let p = 32; b[p] !== 0x0d; p += 32) {
    campos.push({ nome: b.toString('latin1', p, p + 11).replace(/\0.*$/, ''), tipo: String.fromCharCode(b[p + 11]), tam: b[p + 16], dec: b[p + 17] });
  }
  const dec = new TextDecoder(enc === 'utf8' ? 'utf-8' : 'latin1');
  const linhas = new Array(n);
  for (let i = 0; i < n; i++) {
    let p = cab + i * reg + 1;
    const o = {};
    for (const c of campos) {
      const s = dec.decode(b.subarray(p, p + c.tam)).trim();
      p += c.tam;
      if (c.tipo === 'N' || c.tipo === 'F') o[c.nome] = s === '' || /^\*+$/.test(s) ? null : Number(s);
      else if (c.tipo === 'L') o[c.nome] = /^[YyTt]/.test(s);
      else o[c.nome] = s;
    }
    linhas[i] = o;
  }
  return linhas;
}

/** Anéis de um shapefile → polígonos: externos (horários) recebem os furos (anti-horários) que os contêm. */
function montarPoligonos(aneis) {
  const ext = [];
  const furos = [];
  for (const r of aneis) (areaAnel(r) <= 0 ? ext : furos).push(r);
  if (!ext.length) return furos.length ? { type: 'Polygon', coordinates: [furos[0].reverse()] } : null;
  const ps = ext.map((r) => [r]);
  for (const h of furos) {
    const alvo = ps.find((p) => dentroAnel(h[0], p[0])) ?? ps[0];
    alvo.push(h);
  }
  return ps.length === 1 ? { type: 'Polygon', coordinates: ps[0] } : { type: 'MultiPolygon', coordinates: ps };
}

/** Shapefile (base sem extensão ou .shp) → feições. `filtro(props)` decide antes de ler a geometria. */
export function lerShp(arq, filtro = null) {
  const base = arq.replace(/\.shp$/i, '');
  const props = lerDbf(`${base}.dbf`);
  const b = readFileSync(`${base}.shp`);
  const feats = [];
  let p = 100;
  let i = 0;
  while (p < b.length) {
    const tam = b.readInt32BE(p + 4) * 2;
    const c = p + 8;
    const pr = props[i++];
    p = c + tam;
    if (filtro && !filtro(pr)) continue;
    const tipo = b.readInt32LE(c);
    const t = tipo % 10;
    let geometry = null;
    if (tipo === 0) geometry = null;
    else if (t === 1) geometry = { type: 'Point', coordinates: [b.readDoubleLE(c + 4), b.readDoubleLE(c + 12)] };
    else if (t === 8) {
      const n = b.readInt32LE(c + 36);
      const pts = [];
      for (let k = 0; k < n; k++) pts.push([b.readDoubleLE(c + 40 + 16 * k), b.readDoubleLE(c + 48 + 16 * k)]);
      geometry = n === 1 ? { type: 'Point', coordinates: pts[0] } : { type: 'MultiPoint', coordinates: pts };
    } else if (t === 3 || t === 5) {
      const np = b.readInt32LE(c + 36);
      const n = b.readInt32LE(c + 40);
      const partes = [];
      for (let k = 0; k < np; k++) partes.push(b.readInt32LE(c + 44 + 4 * k));
      const x = c + 44 + 4 * np;
      const aneis = partes.map((ini, k) => {
        const fim = k + 1 < np ? partes[k + 1] : n;
        const r = [];
        for (let q = ini; q < fim; q++) r.push([b.readDoubleLE(x + 16 * q), b.readDoubleLE(x + 16 * q + 8)]);
        return r;
      });
      if (t === 3) geometry = aneis.length === 1 ? { type: 'LineString', coordinates: aneis[0] } : { type: 'MultiLineString', coordinates: aneis };
      else geometry = montarPoligonos(aneis);
    }
    if (geometry) feats.push({ type: 'Feature', properties: pr, geometry });
  }
  return feats;
}

/* ------------------------------------------------------------------ WKB e GeoPackage */
function lerWkb(b, o = 0) {
  const le = b[o] === 1;
  const u32 = (k) => (le ? b.readUInt32LE(k) : b.readUInt32BE(k));
  const f64 = (k) => (le ? b.readDoubleLE(k) : b.readDoubleBE(k));
  let tipo = u32(o + 1);
  let dims = 2;
  if (tipo > 1000) { dims = tipo > 3000 ? 4 : 3; tipo %= 1000; }
  if (tipo & 0x80000000) { dims += 1; tipo &= 0xff; }
  if (tipo & 0x40000000) { dims += 1; tipo &= 0xff; }
  let p = o + 5;
  const ponto = () => { const c = [f64(p), f64(p + 8)]; p += 8 * dims; return c; };
  const pontos = () => { const n = u32(p); p += 4; const r = []; for (let i = 0; i < n; i++) r.push(ponto()); return r; };
  const aneis = () => { const n = u32(p); p += 4; const r = []; for (let i = 0; i < n; i++) r.push(pontos()); return r; };
  let g;
  if (tipo === 1) g = { type: 'Point', coordinates: ponto() };
  else if (tipo === 2) g = { type: 'LineString', coordinates: pontos() };
  else if (tipo === 3) g = { type: 'Polygon', coordinates: aneis() };
  else {
    const n = u32(p); p += 4;
    const partes = [];
    for (let i = 0; i < n; i++) { const r = lerWkb(b, p); partes.push(r.g.coordinates); p = r.fim; }
    g = { type: { 4: 'MultiPoint', 5: 'MultiLineString', 6: 'MultiPolygon' }[tipo], coordinates: partes };
  }
  return { g, fim: p };
}

function escreverWkb(g) {
  const partes = [];
  const cab = (t) => { const h = Buffer.alloc(5); h[0] = 1; h.writeUInt32LE(t, 1); partes.push(h); };
  const u32 = (n) => { const h = Buffer.alloc(4); h.writeUInt32LE(n); partes.push(h); };
  const pts = (l) => { u32(l.length); const h = Buffer.alloc(16 * l.length); l.forEach(([x, y], i) => { h.writeDoubleLE(x, 16 * i); h.writeDoubleLE(y, 16 * i + 8); }); partes.push(h); };
  const poli = (p) => { cab(3); u32(p.length); p.forEach(pts); };
  const linha = (l) => { cab(2); pts(l); };
  const ponto = ([x, y]) => { cab(1); const h = Buffer.alloc(16); h.writeDoubleLE(x, 0); h.writeDoubleLE(y, 8); partes.push(h); };
  if (g.type === 'Point') ponto(g.coordinates);
  else if (g.type === 'LineString') linha(g.coordinates);
  else if (g.type === 'Polygon') poli(g.coordinates);
  else if (g.type === 'MultiPoint') { cab(4); u32(g.coordinates.length); g.coordinates.forEach(ponto); }
  else if (g.type === 'MultiLineString') { cab(5); u32(g.coordinates.length); g.coordinates.forEach(linha); }
  else if (g.type === 'MultiPolygon') { cab(6); u32(g.coordinates.length); g.coordinates.forEach(poli); }
  return Buffer.concat(partes);
}

async function sqlite() {
  const avisar = process.emitWarning;
  process.emitWarning = (w, ...r) => (String(w).includes('SQLite') ? undefined : avisar.call(process, w, ...r));
  const m = await import('node:sqlite');
  process.emitWarning = avisar;
  return m.DatabaseSync;
}

/** GeoPackage → feições GeoJSON (primeira camada de feições, ou `camada`). */
export async function lerGpkg(arq, camada = null) {
  const DatabaseSync = await sqlite();
  const db = new DatabaseSync(arq, { readOnly: true });
  const gc = db.prepare('SELECT table_name, column_name FROM gpkg_geometry_columns').all();
  const { table_name: t, column_name: col } = camada ? gc.find((x) => x.table_name === camada) : gc[0];
  const feats = [];
  for (const r of db.prepare(`SELECT * FROM "${t}"`).iterate()) {
    const blob = Buffer.from(r[col]);
    const env = (blob[3] >> 1) & 7;
    const off = 8 + [0, 32, 48, 48, 64][env];
    const props = { ...r };
    delete props[col];
    feats.push({ type: 'Feature', properties: props, geometry: lerWkb(blob, off).g });
  }
  db.close();
  return feats;
}

const WKT_4674 = 'GEOGCS["SIRGAS 2000",DATUM["Sistema_de_Referencia_Geocentrico_para_las_AmericaS_2000",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],AUTHORITY["EPSG","6674"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4674"]]';
const TIPO_GEOM = { Point: 'POINT', LineString: 'LINESTRING', Polygon: 'POLYGON', MultiPoint: 'MULTIPOINT', MultiLineString: 'MULTILINESTRING', MultiPolygon: 'MULTIPOLYGON' };
const MULTI = { Point: 'MultiPoint', LineString: 'MultiLineString', Polygon: 'MultiPolygon' };

function blobGpkg(g) {
  const [x0, y0, x1, y1] = caixa(g);
  const h = Buffer.alloc(40);
  h.write('GP', 0, 'latin1');
  h[2] = 0;
  h[3] = 0b00000011; // envelope xy, little-endian
  h.writeInt32LE(4674, 4);
  [x0, x1, y0, y1].forEach((v, i) => h.writeDoubleLE(v, 8 + 8 * i));
  return Buffer.concat([h, escreverWkb(g)]);
}

/**
 * Grava um GeoPackage novo (EPSG:4674). camadas = { nome: { feats, campos?, multi? } };
 * estilos = { nome: [[nomeDoEstilo, descrição, QML, padrão?]] }. Mesmo esquema que o QGIS cria.
 */
export async function gravarGpkg(arq, camadas, estilos = {}) {
  const DatabaseSync = await sqlite();
  if (existsSync(arq)) unlinkSync(arq);
  mkdirSync(dirname(arq), { recursive: true });
  const db = new DatabaseSync(arq);
  db.exec('PRAGMA application_id = 1196444487; PRAGMA user_version = 10200; PRAGMA journal_mode = OFF;');
  db.exec(`CREATE TABLE gpkg_spatial_ref_sys (srs_name TEXT NOT NULL, srs_id INTEGER NOT NULL PRIMARY KEY, organization TEXT NOT NULL,
    organization_coordsys_id INTEGER NOT NULL, definition TEXT NOT NULL, description TEXT);
  CREATE TABLE gpkg_contents (table_name TEXT NOT NULL PRIMARY KEY, data_type TEXT NOT NULL, identifier TEXT UNIQUE, description TEXT DEFAULT '',
    last_change DATETIME NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')), min_x DOUBLE, min_y DOUBLE, max_x DOUBLE, max_y DOUBLE,
    srs_id INTEGER, CONSTRAINT fk_gc_r_srs_id FOREIGN KEY (srs_id) REFERENCES gpkg_spatial_ref_sys(srs_id));
  CREATE TABLE gpkg_geometry_columns (table_name TEXT NOT NULL, column_name TEXT NOT NULL, geometry_type_name TEXT NOT NULL, srs_id INTEGER NOT NULL,
    z TINYINT NOT NULL, m TINYINT NOT NULL, CONSTRAINT pk_geom_cols PRIMARY KEY (table_name, column_name),
    CONSTRAINT fk_gc_tn FOREIGN KEY (table_name) REFERENCES gpkg_contents(table_name), CONSTRAINT fk_gc_srs FOREIGN KEY (srs_id) REFERENCES gpkg_spatial_ref_sys (srs_id));`);
  const srs = db.prepare('INSERT INTO gpkg_spatial_ref_sys VALUES (?, ?, ?, ?, ?, ?)');
  srs.run('Undefined cartesian SRS', -1, 'NONE', -1, 'undefined', 'undefined cartesian coordinate reference system');
  srs.run('Undefined geographic SRS', 0, 'NONE', 0, 'undefined', 'undefined geographic coordinate reference system');
  srs.run('WGS 84 geodetic', 4326, 'EPSG', 4326, 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]', 'longitude/latitude coordinates in decimal degrees on the WGS 84 spheroid');
  srs.run('SIRGAS 2000', 4674, 'EPSG', 4674, WKT_4674, 'SIRGAS 2000, coordenadas geográficas');
  for (const [nome, { feats, campos, multi = true }] of Object.entries(camadas)) {
    const tipos = new Set(feats.map((f) => f.geometry.type));
    const base = [...tipos][0].replace(/^Multi/, '');
    const gtipo = multi ? MULTI[base] ?? base : [...tipos][0];
    const cols = campos ?? Object.keys(feats[0].properties);
    const tipoCol = (c) => {
      let t = 'INTEGER';
      for (const f of feats) {
        const v = f.properties[c];
        if (v === null || v === undefined || (typeof v === 'number' && Number.isNaN(v))) continue;
        if (typeof v === 'string') return 'TEXT';
        if (typeof v === 'boolean') continue;
        if (!Number.isInteger(v)) t = 'REAL';
      }
      return t;
    };
    const defs = cols.map((c) => `"${c}" ${tipoCol(c)}`);
    db.exec(`CREATE TABLE "${nome}" (fid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, geom ${TIPO_GEOM[gtipo]}${defs.length ? ', ' + defs.join(', ') : ''})`);
    const ins = db.prepare(`INSERT INTO "${nome}" (geom${cols.map((c) => `, "${c}"`).join('')}) VALUES (?${cols.map(() => ', ?').join('')})`);
    let bx = [Infinity, Infinity, -Infinity, -Infinity];
    db.exec('BEGIN');
    for (const f of feats) {
      let g = f.geometry;
      if (multi && MULTI[g.type]) g = { type: MULTI[g.type], coordinates: [g.coordinates] };
      g = orientar(g, false); // GeoPackage/OGC: externo anti-horário
      const [x0, y0, x1, y1] = caixa(g);
      bx = [Math.min(bx[0], x0), Math.min(bx[1], y0), Math.max(bx[2], x1), Math.max(bx[3], y1)];
      ins.run(blobGpkg(g), ...cols.map((c) => {
        const v = f.properties[c];
        if (v === undefined || (typeof v === 'number' && Number.isNaN(v))) return null;
        return typeof v === 'boolean' ? Number(v) : v;
      }));
    }
    db.exec('COMMIT');
    db.prepare("INSERT INTO gpkg_contents (table_name, data_type, identifier, min_x, min_y, max_x, max_y, srs_id) VALUES (?, 'features', ?, ?, ?, ?, ?, 4674)")
      .run(nome, nome, ...bx);
    db.prepare("INSERT INTO gpkg_geometry_columns VALUES (?, 'geom', ?, 4674, 0, 0)").run(nome, TIPO_GEOM[gtipo]);
  }
  const faltando = Object.keys(camadas).filter((c) => !estilos[c]);
  if (faltando.length) throw new Error(`camadas sem estilo: ${faltando}`);
  db.exec(`CREATE TABLE layer_styles (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, f_table_catalog TEXT(256), f_table_schema TEXT(256),
    f_table_name TEXT(256), f_geometry_column TEXT(256), styleName TEXT(30), styleQML TEXT, styleSLD TEXT, useAsDefault BOOLEAN,
    description TEXT, owner TEXT(30), ui TEXT(30), update_time DATETIME DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')))`);
  db.exec("INSERT INTO gpkg_contents (table_name, data_type, identifier, description) VALUES ('layer_styles', 'attributes', 'layer_styles', '')");
  const est = db.prepare("INSERT INTO layer_styles (f_table_catalog, f_table_schema, f_table_name, f_geometry_column, styleName, styleQML, styleSLD, useAsDefault, description, owner, ui) VALUES ('', '', ?, 'geom', ?, ?, '', ?, ?, '', '')");
  for (const [camada, lista] of Object.entries(estilos)) for (const [nome, desc, qml, padrao = true] of lista) est.run(camada, nome, qml, padrao ? 1 : 0, desc);
  db.exec('VACUUM');
  db.close();
  return statSync(arq).size;
}

/* ------------------------------------------------------------------ ZIP (gravação) */
/** Compacta `arq` num ZIP ao lado (arq.zip) e apaga o original. Devolve o caminho do ZIP. */
export function zipar(arq) {
  const dados = readFileSync(arq);
  const comp = deflateRawSync(dados, { level: 9 });
  const nome = Buffer.from(basename(arq), 'utf8');
  const crc = crc32(dados);
  const d = new Date();
  const hora = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
  const dia = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  const loc = Buffer.alloc(30);
  loc.writeUInt32LE(0x04034b50, 0); loc.writeUInt16LE(20, 4); loc.writeUInt16LE(0x0800, 6); loc.writeUInt16LE(8, 8);
  loc.writeUInt16LE(hora, 10); loc.writeUInt16LE(dia, 12); loc.writeUInt32LE(crc, 14);
  loc.writeUInt32LE(comp.length, 18); loc.writeUInt32LE(dados.length, 22); loc.writeUInt16LE(nome.length, 26);
  const cd = Buffer.alloc(46);
  cd.writeUInt32LE(0x02014b50, 0); cd.writeUInt16LE(20, 4); cd.writeUInt16LE(20, 6); cd.writeUInt16LE(0x0800, 8); cd.writeUInt16LE(8, 10);
  cd.writeUInt16LE(hora, 12); cd.writeUInt16LE(dia, 14); cd.writeUInt32LE(crc, 16); cd.writeUInt32LE(comp.length, 20);
  cd.writeUInt32LE(dados.length, 24); cd.writeUInt16LE(nome.length, 28); cd.writeUInt32LE(0, 42);
  const fimCd = Buffer.alloc(22);
  const offCd = 30 + nome.length + comp.length;
  fimCd.writeUInt32LE(0x06054b50, 0); fimCd.writeUInt16LE(1, 8); fimCd.writeUInt16LE(1, 10);
  fimCd.writeUInt32LE(46 + nome.length, 12); fimCd.writeUInt32LE(offCd, 16);
  const z = `${arq}.zip`;
  writeFileSync(z, Buffer.concat([loc, nome, comp, cd, nome, fimCd]));
  unlinkSync(arq);
  return z;
}

/* ------------------------------------------------------------------ cache da prancha */
const semNaN = (k, v) => (typeof v === 'number' && !Number.isFinite(v) ? null : v);

export function gravarCache(nome, obj) {
  mkdirSync(CACHE, { recursive: true });
  writeFileSync(join(CACHE, `${nome}.json`), JSON.stringify(obj, semNaN, 1), 'utf8');
}

export const lerCache = (nome) => JSON.parse(readFileSync(join(CACHE, `${nome}.json`), 'utf8'));

/** Grade uint8 para lib/raster.mjs: cache/<nome>.bin + <nome>.json. */
export function gravarGrade(nome, grade, nodata = 0) {
  mkdirSync(CACHE, { recursive: true });
  writeFileSync(join(CACHE, `${nome}.bin`), Buffer.from(grade.dados.buffer, grade.dados.byteOffset, grade.dados.byteLength));
  const { largura, altura, x0, y0, dx, dy } = grade;
  writeFileSync(join(CACHE, `${nome}.json`), JSON.stringify({ largura, altura, x0, y0, dx, dy, tipo: 'uint8', nodata }), 'utf8');
}

/* ------------------------------------------------------------------ números */
/** Valor de uma célula do IBGE: número, ou null para "X" (sigilo), "." e "-"/vazio quando não houver dado. */
export function num(v) {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  if (s === '' || s === 'X' || s === '.' || s === '..' || s === '...') return null;
  if (s === '-') return 0;
  const n = Number(s.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

export const soma = (a) => a.reduce((x, y) => x + y, 0);

/** Limites superiores de n classes por quantis dos valores positivos, com dois algarismos significativos. */
export function quebras(valores, n = 6) {
  const pos = valores.filter((v) => v !== null && v > 0).sort((a, b) => a - b);
  const q = (p) => pos[Math.min(pos.length - 1, Math.floor(p * (pos.length - 1)))];
  const dois = (v) => Number(v.toPrecision(2));
  const lim = [];
  for (let i = 1; i < n; i++) { const v = dois(q(i / n)); if (!lim.length || v > lim[lim.length - 1]) lim.push(v); }
  lim.push(pos[pos.length - 1]);
  return lim;
}

/** Índice da classe (1..n) de v pelos limites superiores; 0 = zero; null = sem informação. */
export function classe(v, lim) {
  if (v === null || v === undefined || Number.isNaN(v)) return null;
  if (v === 0) return 0;
  let i = 0;
  while (i < lim.length - 1 && v > lim[i]) i++;
  return i + 1;
}

export const tamanho = (arq) => statSync(arq).size;
export const mb = (b) => `${(b / 1e6).toFixed(1).replace('.', ',')} MB`;
export const kb = (b) => (b < 1e6 ? `${Math.round(b / 1e3)} kB` : mb(b));
