#!/usr/bin/env node
/**
 * Malha leve das 27 UFs para o "mapa dos mapas" do site (src/data/brasil-ufs.json).
 * Lê a base nacional das coleções (scripts/colecoes/cache/brasil-base.json, IBGE Malha Municipal),
 * simplifica cada anel com Douglas-Peucker e arredonda as coordenadas. Roda à mão, uma vez:
 * o build do site só lê o JSON gravado.
 *
 *   node scripts/site-malha-ufs.mjs [caminho/da/brasil-base.json]
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGEM = process.argv[2] ?? join(RAIZ, 'scripts', 'colecoes', 'cache', 'brasil-base.json');
const DESTINO = join(RAIZ, 'src', 'data', 'brasil-ufs.json');
const TOLERANCIA = 0.035; // graus: abaixo de um pixel num mapa de ~500 px
const CASAS = 2;

function distancia(p, a, b) {
  const [x, y] = p;
  const [x1, y1] = a;
  const [x2, y2] = b;
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx === 0 && dy === 0) return Math.hypot(x - x1, y - y1);
  const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
}

function simplificar(pts, tol) {
  if (pts.length < 3) return pts;
  let maior = 0;
  let indice = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = distancia(pts[i], pts[0], pts[pts.length - 1]);
    if (d > maior) [maior, indice] = [d, i];
  }
  if (maior <= tol) return [pts[0], pts[pts.length - 1]];
  return [...simplificar(pts.slice(0, indice + 1), tol).slice(0, -1), ...simplificar(pts.slice(indice), tol)];
}

const f = 10 ** CASAS;
const arredonda = ([x, y]) => [Math.round(x * f) / f, Math.round(y * f) / f];

function anel(coords) {
  const s = simplificar(coords, TOLERANCIA).map(arredonda);
  const unico = s.filter((p, i) => i === 0 || p[0] !== s[i - 1][0] || p[1] !== s[i - 1][1]);
  if (unico.length < 4) return null;
  const [a, z] = [unico[0], unico[unico.length - 1]];
  if (a[0] !== z[0] || a[1] !== z[1]) unico.push(a);
  return unico;
}

function poligonos(geom) {
  const lista = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
  return lista
    .map((p) => p.map(anel).filter(Boolean))
    .filter((p) => p.length > 0);
}

const base = JSON.parse(await readFile(ORIGEM, 'utf8'));
const ufs = base.ufs.features.map((ft) => ({
  type: 'Feature',
  properties: { uf: ft.properties.SIGLA_UF, rotulo: ft.properties.rotulo },
  geometry: { type: 'MultiPolygon', coordinates: poligonos(ft.geometry) },
}));
const saida = {
  type: 'FeatureCollection',
  fonte: 'IBGE — Malha Municipal (UFs), simplificada para o site',
  features: ufs,
};
await mkdir(dirname(DESTINO), { recursive: true });
await writeFile(DESTINO, JSON.stringify(saida));
const kb = (Buffer.byteLength(JSON.stringify(saida)) / 1024).toFixed(0);
console.log(`${ufs.length} UFs → ${DESTINO} (${kb} KB)`);
