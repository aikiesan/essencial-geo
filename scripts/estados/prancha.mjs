#!/usr/bin/env node
/**
 * Série «Brasil, estado por estado» — desenha a prancha de UMA unidade da federação
 * a partir do cache gerado por preparar.py (rode-o antes).
 *
 *   node scripts/estados/prancha.mjs SP --pasta 001-estado-sao-paulo --numero 1 --data 2026-10-26
 *
 * Saídas em mapas/<pasta>/:
 *   mapa_preview.png · mapa_preview.en.png   prancha 2400 × 1800 (PT-BR, EN-GB)
 *   dados/<uf>_prancha.svg · .en.svg          a mesma prancha em vetor, para impressão
 *
 * Tudo é decidido por regra, sem ajuste à mão por estado: rótulos vão para o ponto
 * mais interno de cada região (transformada de distância sobre uma máscara rasterizada),
 * o mapa de localização vai para o canto com menos estado, as cores das regiões
 * intermediárias são escolhidas para que vizinhas fiquem bem distintas.
 */
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import sharp from 'sharp';
import {
  geoTransverseMercator,
  geoConicEqualArea,
  geoPath,
  geoGraticule,
  geoDistance,
  geoBounds,
  geoArea,
} from 'd3-geo';
import { feature } from 'topojson-client';
import { norteFolha, molecula, microtexto, ASSINATURA, ESTRELAS } from '../lib/identidade.mjs';

const RAIZ = fileURLToPath(new URL('../..', import.meta.url));

/* ------------------------------------------------------------------ argumentos */
const { values: opt, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    pasta: { type: 'string' },
    numero: { type: 'string' },
    data: { type: 'string' },
    mascara: { type: 'boolean', default: false }, // grava a máscara de rótulos, para conferência
  },
});
const UF = (positionals[0] ?? '').toUpperCase();
if (!UF || !opt.pasta || !opt.numero || !opt.data) {
  console.error('uso: node scripts/estados/prancha.mjs SP --pasta 001-estado-sao-paulo --numero 1 --data 2026-10-26');
  process.exit(1);
}
const NUMERO = Number(opt.numero);
const DATA = new Date(`${opt.data}T12:00:00Z`);

/* ------------------------------------------------------------------ prancha */
const W = 2400;
const H = 1800;
const M = 56;
const X0 = M + 12;
const Y0 = M + 12;
const MW = 1640;
const MH = H - 2 * Y0; // 1664
const PX = X0 + MW;
const PW = W - X0 - PX; // 624
const LP = PW - 64; // largura útil do painel

const SERIF = "Georgia, 'Times New Roman', serif";
const MONO = "Consolas, 'DejaVu Sans Mono', monospace";
const TINTA = '#1a1c1e';
const CINZA = '#7a8189';
const PAPEL = '#ffffff';
const OCEANO = '#d9e5ec';
const LINHA_AGUA = '#bccdd8';
const ESTRANGEIRO = '#e4e6e8';
const VIZINHO = '#f2f3f4';
const BORDA_VIZINHO = '#b9c0c6';
const OURO = '#c99a2e';
const TERRACOTA = '#9c4a32';

const ROD_FED = TERRACOTA;
const ROD_EST = '#4a4540';
const LIM_RGI = '#5f6458';
const LIM_RGINT = '#1a211a';

// Paleta das regiões intermediárias: tons abafados, todos com texto escuro legível por cima.
const PALETA = [
  '#c3d5e0', '#e8d9b5', '#c9d6b8', '#e6c3ae', '#d3cbe0', '#b9d6cc', '#efd59a',
  '#d8c3b7', '#b8c8d8', '#dccfa6', '#e3cbd3', '#c8d3a0', '#cdbfa6',
];

/* ------------------------------------------------------------------ idioma */
let LINGUA = 'pt';
const EN = {
  'Nº': 'No.',
  'BRASIL, ESTADO POR ESTADO': 'BRAZIL, STATE BY STATE',
  'Divisão territorial e rodovias': 'Territorial divisions and highways',
  'EM NÚMEROS': 'AT A GLANCE',
  municípios: 'municipalities',
  'km² de área': 'km² of land area',
  'regiões intermediárias': 'intermediate and',
  'e imediatas': 'immediate regions',
  'km de rodovias': 'km of paved',
  pavimentadas: 'highways',
  'REGIÕES GEOGRÁFICAS INTERMEDIÁRIAS': 'INTERMEDIATE GEOGRAPHIC REGIONS',
  'MUN.': 'MUN.',
  LIMITES: 'BOUNDARIES',
  RODOVIAS: 'HIGHWAYS',
  estadual: 'state',
  'região intermediária': 'intermediate region',
  'região imediata': 'immediate region',
  município: 'municipality',
  federal: 'federal',
  'estadual pavimentada': 'state, paved',
  'estadual sem pavimento': 'state, unpaved',
  capital: 'state capital',
  'ESCALA GRÁFICA': 'SCALE BAR',
  'verdadeira no meridiano central': 'true on the central meridian',
  LOCALIZAÇÃO: 'LOCATION',
  PROJETO: 'PROJECT',
  PRANCHA: 'PLATE',
  DATA: 'DATE',
  PROJEÇÃO: 'PROJECTION',
  FONTES: 'SOURCES',
  'LICENÇA': 'LICENCE',
  'OCEANO ATLÂNTICO': 'ATLANTIC OCEAN',
  'O ESSENCIAL É INVISÍVEL AOS OLHOS': 'WHAT IS ESSENTIAL IS INVISIBLE TO THE EYE',
  'Transversa de Mercator': 'Transverse Mercator',
  'IBGE, Malha Municipal 2025': 'IBGE, Municipal Mesh 2025',
  'MapBiomas, rodovias': 'MapBiomas, highways',
};
const tr = (s) => (LINGUA === 'en' ? (EN[s] ?? s) : s);
const nf = (v, casas = 0) =>
  v.toLocaleString(LINGUA === 'en' ? 'en-GB' : 'pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });

// Países vizinhos (Natural Earth, nome em inglês → rótulo).
const PAISES = {
  Argentina: ['ARGENTINA', 'ARGENTINA'], Bolivia: ['BOLÍVIA', 'BOLIVIA'], Paraguay: ['PARAGUAI', 'PARAGUAY'],
  Uruguay: ['URUGUAI', 'URUGUAY'], Peru: ['PERU', 'PERU'], Colombia: ['COLÔMBIA', 'COLOMBIA'],
  Venezuela: ['VENEZUELA', 'VENEZUELA'], Guyana: ['GUIANA', 'GUYANA'], Suriname: ['SURINAME', 'SURINAME'],
  France: ['GUIANA FRANCESA', 'FRENCH GUIANA'],
};

/* ------------------------------------------------------------------ util */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const f1 = (v) => Math.round(v * 10) / 10;

/** Largura aproximada de texto (px). Consolas: avanço fixo de 0,55 em. Georgia: média por classe de caractere. */
function largura(texto, tamanho, { mono = false, espaco = 0 } = {}) {
  if (mono) return texto.length * (0.55 * tamanho + espaco) - espaco;
  let w = 0;
  for (const c of texto) {
    if (c === ' ') w += 0.25;
    else if (/[A-ZÀ-Ý]/.test(c)) w += 0.7;
    else if (/[iljtfrI.,'’]/.test(c)) w += 0.32;
    else if (/[mwMW]/.test(c)) w += 0.82;
    else if (/[0-9]/.test(c)) w += 0.6;
    else w += 0.5;
  }
  return w * tamanho + espaco * (texto.length - 1);
}

/** Quebra em até n linhas equilibradas. */
function quebrar(texto, n) {
  const p = texto.split(' ');
  if (n <= 1 || p.length === 1) return [texto];
  let melhor = [texto];
  let pior = Infinity;
  const tentar = (resto, linhas) => {
    if (linhas.length === n - 1 || resto.length === 0) {
      const ls = resto.length ? [...linhas, resto.join(' ')] : linhas;
      const m = Math.max(...ls.map((l) => l.length));
      if (m < pior) { pior = m; melhor = ls; }
      return;
    }
    for (let i = 1; i < resto.length; i++) tentar(resto.slice(i), [...linhas, resto.slice(0, i).join(' ')]);
  };
  tentar(p, []);
  return melhor;
}

function rgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function lab(h) {
  const [r, g, b] = rgb(h).map((v) => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  const x = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047;
  const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883;
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}
const dLab = (a, b) => Math.hypot(...lab(a).map((v, i) => v - lab(b)[i]));

/** Texto com halo branco (o traço fica por baixo do preenchimento). */
const halo = (largura = 4) => `stroke="${PAPEL}" stroke-width="${largura}" stroke-linejoin="round" paint-order="stroke"`;

/* ------------------------------------------------------------------ dados */
const cache = JSON.parse(await readFile(join(RAIZ, 'scripts', 'estados', 'cache', `${UF.toLowerCase()}.json`), 'utf8'));
const N = cache.numeros;
// Grafias corrigidas só na prancha (os arquivos mantêm o nome da tabela do IBGE).
const GRAFIA = { 'Juíz de Fora': 'Juiz de Fora' };
for (const f of cache.rgint.features)
  if (GRAFIA[f.properties?.NM_RGINT]) f.properties.NM_RGINT = GRAFIA[f.properties.NM_RGINT];
for (const r of [...N.municipios_por_rgint, ...(cache.rotulos_rgint ?? [])]) r.nome = GRAFIA[r.nome] ?? r.nome;
const mundo = JSON.parse(await readFile(join(RAIZ, 'node_modules', 'world-atlas', 'countries-10m.json'), 'utf8'));
// Só a América do Sul: polígonos muito distantes (Antártida, por exemplo) se invertem na
// Transversa de Mercator e cobririam o oceano. Da França fica só a Guiana Francesa.
const paises = feature(mundo, mundo.objects.countries)
  .features.filter((f) => PAISES[f.properties.name])
  .map((f) => {
    if (f.properties.name !== 'France') return f;
    const partes = f.geometry.coordinates.filter((p) => p[0][0][0] < -40 && p[0][0][0] > -60);
    return { ...f, geometry: { type: 'MultiPolygon', coordinates: partes } };
  });

const limite = cache.limite.features[0];

/* Ilhas oceânicas (Fernando de Noronha, Trindade e Martim Vaz) ficam a centenas de km
   da costa: o quadro principal enquadra só o continente e elas ganham um quadro próprio. */
const ILHAS = {
  PE: ['ARQUIPÉLAGO DE FERNANDO DE NORONHA', 'FERNANDO DE NORONHA ARCHIPELAGO'],
  ES: ['ILHAS DA TRINDADE E MARTIM VAZ', 'TRINDADE AND MARTIM VAZ ISLANDS'],
};
const partes = limite.geometry.type === 'MultiPolygon' ? limite.geometry.coordinates : [limite.geometry.coordinates];
const poli = (c) => ({ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: c } });
const principal = partes.reduce((a, b) => (geoArea(poli(b)) > geoArea(poli(a)) ? b : a));
const [[px0, py0], [px1, py1]] = geoBounds(poli(principal));
const perto = (c) => {
  const [[a0, b0], [a1, b1]] = geoBounds(poli(c));
  return a1 > px0 - 1 && a0 < px1 + 1 && b1 > py0 - 1 && b0 < py1 + 1;
};
const continente = { type: 'Feature', properties: {}, geometry: { type: 'MultiPolygon', coordinates: partes.filter(perto) } };
const remotas = partes.filter((c) => !perto(c));
const ilhas = remotas.length ? { type: 'Feature', properties: {}, geometry: { type: 'MultiPolygon', coordinates: remotas } } : null;
if (ilhas && !ILHAS[UF]) console.warn(`aviso: ${UF} tem partes remotas sem nome em ILHAS`);
const [[bx0, by0], [bx1, by1]] = geoBounds(continente);
const LON0 = Math.round(((bx0 + bx1) / 2) * 10) / 10;
const LAT0 = Math.round(((by0 + by1) / 2) * 10) / 10;

const PAD = 96;
const proj = geoTransverseMercator()
  .rotate([-LON0, -LAT0])
  .fitExtent([[PAD, PAD], [MW - PAD, MH - PAD]], continente);
const path = geoPath(proj).digits(1);

// Recorte de tudo à área do mapa (com folga para não aparecer a borda dos traços).
const projRecorte = geoTransverseMercator()
  .rotate([-LON0, -LAT0])
  .scale(proj.scale())
  .translate(proj.translate())
  .clipExtent([[-20, -20], [MW + 20, MH + 20]]);
const pathR = geoPath(projRecorte).digits(1);

/* Escala verdadeira no centro: px por km ao longo do meridiano central. */
const PX_KM = (() => {
  const [cx, cy] = proj([LON0, LAT0]);
  const a = proj.invert([cx, cy - 200]);
  const b = proj.invert([cx, cy + 200]);
  return 400 / (geoDistance(a, b) * 6371.0088);
})();

/* ------------------------------------------------------------------ máscara
 * Rasteriza cada região numa cor única (sem antisserrilhado) para saber, pixel a pixel,
 * o que há em cada ponto do mapa. Com isso: ponto mais interno de cada região (rótulos),
 * vizinhança entre regiões intermediárias (cores) e canto livre para o localizador.
 */
const ESC_M = 0.5; // máscara a meia resolução
const mw = Math.round(MW * ESC_M);
const mh = Math.round(MH * ESC_M);

const classes = []; // { id, tipo, chave, rotulo }
const novaClasse = (tipo, chave, extra = {}) => {
  const id = classes.length + 1; // 0 = oceano
  classes.push({ id, tipo, chave, ...extra });
  return id;
};
const corDe = (id) => `rgb(${(id * 37) % 256},${(id * 91) % 256},${(id * 157 + 64) % 256})`;
const deCor = new Map();
deCor.set('0,0,0', 0);

const camadasMascara = [];
for (const p of paises) {
  const d = pathR(p);
  if (!d) continue;
  const id = novaClasse('pais', p.properties.name);
  camadasMascara.push([id, d]);
}
for (const v of cache.vizinhos.features) {
  if (v.properties.SIGLA_UF === UF) continue;
  const d = pathR(v);
  if (!d) continue;
  const id = novaClasse('uf', v.properties.SIGLA_UF, { nome: v.properties.NM_UF });
  camadasMascara.push([id, d]);
}
const idRgint = new Map();
for (const r of cache.rgint.features) {
  const id = novaClasse('rgint', r.properties.CD_RGINT, { nome: r.properties.NM_RGINT });
  idRgint.set(r.properties.CD_RGINT, id);
  camadasMascara.push([id, pathR(r)]);
}
for (const c of classes) {
  const [r, g, b] = corDe(c.id).match(/\d+/g).map(Number);
  deCor.set(`${r},${g},${b}`, c.id);
}

async function rasterizar(extra = '') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${mw}" height="${mh}" viewBox="0 0 ${MW} ${MH}" shape-rendering="crispEdges">
<rect width="${MW}" height="${MH}" fill="rgb(0,0,0)"/>
${camadasMascara.map(([id, d]) => `<path d="${d}" fill="${corDe(id)}"/>`).join('\n')}
${extra}</svg>`;
  const { data, info } = await sharp(Buffer.from(svg)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const cls = new Int16Array(info.width * info.height);
  let desconhecidos = 0;
  for (let i = 0; i < cls.length; i++) {
    const k = `${data[i * 3]},${data[i * 3 + 1]},${data[i * 3 + 2]}`;
    const v = deCor.get(k);
    if (v === undefined) { cls[i] = -1; desconhecidos++; } else cls[i] = v;
  }
  return { cls, desconhecidos };
}

const { cls: classe0, desconhecidos } = await rasterizar();
if (desconhecidos / classe0.length > 0.02) console.warn(`aviso: ${desconhecidos} pixels sem classe na máscara`);

/** Distância (px da máscara) de cada pixel até a borda da sua região — chanfro 3-4. */
function distancias(cls) {
  const d = new Float32Array(cls.length);
  const INF = 1e9;
  for (let y = 0; y < mh; y++)
    for (let x = 0; x < mw; x++) {
      const i = y * mw + x;
      const c = cls[i];
      const borda =
        c < 0 || x === 0 || y === 0 || x === mw - 1 || y === mh - 1 ||
        cls[i - 1] !== c || cls[i + 1] !== c || cls[i - mw] !== c || cls[i + mw] !== c;
      d[i] = borda ? 0 : INF;
    }
  for (let y = 1; y < mh - 1; y++)
    for (let x = 1; x < mw - 1; x++) {
      const i = y * mw + x;
      if (!d[i]) continue;
      d[i] = Math.min(d[i], d[i - 1] + 3, d[i - mw] + 3, d[i - mw - 1] + 4, d[i - mw + 1] + 4);
    }
  for (let y = mh - 2; y > 0; y--)
    for (let x = mw - 2; x > 0; x--) {
      const i = y * mw + x;
      if (!d[i]) continue;
      d[i] = Math.min(d[i], d[i + 1] + 3, d[i + mw] + 3, d[i + mw + 1] + 4, d[i + mw - 1] + 4);
    }
  for (let i = 0; i < d.length; i++) d[i] = d[i] / 3 / ESC_M; // em px da prancha
  return d;
}

/** Ponto mais interno de cada classe: { id → [x, y, raio] } em px da prancha. */
function maisInternos(cls, d) {
  const melhor = new Map();
  for (let i = 0; i < cls.length; i++) {
    const c = cls[i];
    if (c < 0) continue;
    const m = melhor.get(c);
    if (!m || d[i] > m[2]) melhor.set(c, [((i % mw) + 0.5) / ESC_M, (Math.floor(i / mw) + 0.5) / ESC_M, d[i]]);
  }
  return melhor;
}

/* ---- localizador: canto com menos estado (e sem rótulos de vizinhos por baixo) */
const LOC = 300; // lado do quadro do localizador
const MARGEM_LOC = 28;
const cantos = [
  ['se', MW - LOC - MARGEM_LOC, MH - LOC - MARGEM_LOC],
  ['so', MARGEM_LOC, MH - LOC - MARGEM_LOC],
  ['ne', MW - LOC - MARGEM_LOC, MARGEM_LOC],
  ['no', MARGEM_LOC, MARGEM_LOC],
];
const ehEstado = new Set(classes.filter((c) => c.tipo === 'rgint').map((c) => c.id));
const canto = cantos
  .map(([nome, x, y]) => {
    let estado = 0;
    for (let yy = Math.floor(y * ESC_M); yy < (y + LOC) * ESC_M; yy++)
      for (let xx = Math.floor(x * ESC_M); xx < (x + LOC) * ESC_M; xx++) if (ehEstado.has(classe0[yy * mw + xx])) estado++;
    return { nome, x, y, estado };
  })
  .sort((a, b) => a.estado - b.estado)[0];

/* ---- reservas: localizador e capital não recebem rótulos de região por cima */
const capXY = proj(cache.capital.coord);
const cls = Int16Array.from(classe0);
const reservar = (x0, y0, x1, y1) => {
  for (let y = Math.max(0, Math.floor(y0 * ESC_M)); y < Math.min(mh, y1 * ESC_M); y++)
    for (let x = Math.max(0, Math.floor(x0 * ESC_M)); x < Math.min(mw, x1 * ESC_M); x++) cls[y * mw + x] = -2;
};
reservar(canto.x - 12, canto.y - 12, canto.x + LOC + 12, canto.y + LOC + 12);

/* ---- norte em folha: num dos outros cantos, de preferência em cima e fora do estado */
const NORTE_ALT = 110;
const NB = { w: 90, h: NORTE_ALT + 40 }; // caixa da rosa, com o N
const MARGEM_N = 64; // além da faixa das coordenadas
const norte = Object.entries({
  ne: [MW - MARGEM_N - NB.w, MARGEM_N],
  no: [MARGEM_N, MARGEM_N],
  se: [MW - MARGEM_N - NB.w, MH - MARGEM_N - NB.h],
  so: [MARGEM_N, MH - MARGEM_N - NB.h],
})
  .filter(([nome]) => nome !== canto.nome)
  .map(([nome, [x, y]], ordem) => {
    let estado = 0;
    for (let yy = Math.floor(y * ESC_M); yy < (y + NB.h) * ESC_M; yy++)
      for (let xx = Math.floor(x * ESC_M); xx < (x + NB.w) * ESC_M; xx++) if (ehEstado.has(classe0[yy * mw + xx])) estado++;
    return { nome, x, y, estado, ordem };
  })
  .sort((a, b) => a.estado - b.estado || a.ordem - b.ordem)[0];
reservar(norte.x - 10, norte.y - 10, norte.x + NB.w + 10, norte.y + NB.h + 10);

/* ---- quadro das ilhas oceânicas, no canto livre que sobrar */
const IB = { w: 280, h: 230 };
const quadroIlhas = ilhas
  ? cantos
      .filter(([nome]) => nome !== canto.nome && nome !== norte.nome)
      .map(([nome]) => {
        const x = nome.endsWith('e') ? MW - IB.w - MARGEM_LOC : MARGEM_LOC;
        const y = nome.startsWith('s') ? MH - IB.h - MARGEM_LOC : MARGEM_LOC;
        let estado = 0;
        for (let yy = Math.floor(y * ESC_M); yy < (y + IB.h) * ESC_M; yy++)
          for (let xx = Math.floor(x * ESC_M); xx < (x + IB.w) * ESC_M; xx++) if (ehEstado.has(classe0[yy * mw + xx])) estado++;
        return { nome, x, y, estado };
      })
      .sort((a, b) => a.estado - b.estado)[0]
  : null;
if (quadroIlhas) reservar(quadroIlhas.x - 12, quadroIlhas.y - 12, quadroIlhas.x + IB.w + 12, quadroIlhas.y + IB.h + 12);
// Faixa junto à moldura: é onde ficam as coordenadas do graticulado.
const FAIXA = 40;
reservar(0, 0, MW, FAIXA); reservar(0, MH - FAIXA, MW, MH); reservar(0, 0, FAIXA, MH); reservar(MW - FAIXA, 0, MW, MH);
const largCap = largura(cache.capital.nome, 22) + 40;
reservar(capXY[0] - 26, capXY[1] - 26, capXY[0] + largCap, capXY[1] + 26);

const dist = distancias(cls);
const internos = maisInternos(cls, dist);

/* ---- cores das regiões intermediárias: vizinhas o mais distintas possível */
const vizinhanca = new Map([...idRgint.values()].map((id) => [id, new Set()]));
for (let i = 0; i < classe0.length; i++) {
  const a = classe0[i];
  if (!vizinhanca.has(a)) continue;
  for (const j of [i + 1, i + mw, i + 2, i + 2 * mw]) {
    const b = classe0[j];
    if (b !== a && vizinhanca.has(b)) {
      vizinhanca.get(a).add(b);
      vizinhanca.get(b).add(a);
    }
  }
}
const corRgint = new Map();
{
  const ordem = [...vizinhanca.keys()].sort((a, b) => vizinhanca.get(b).size - vizinhanca.get(a).size || a - b);
  for (const id of ordem) {
    const usadas = new Set(corRgint.values());
    const livres = PALETA.filter((c) => !usadas.has(c));
    const candidatas = livres.length ? livres : PALETA;
    let melhor = candidatas[0];
    let nota = -1;
    for (const c of candidatas) {
      const viz = [...vizinhanca.get(id)].filter((v) => corRgint.has(v)).map((v) => corRgint.get(v));
      const n = viz.length ? Math.min(...viz.map((v) => dLab(c, v))) : 100;
      if (n > nota) { nota = n; melhor = c; }
    }
    corRgint.set(id, melhor);
  }
}
const corDaRgint = (cd) => corRgint.get(idRgint.get(cd));

/* ------------------------------------------------------------------ camadas do mapa */
function mapa() {
  const s = [];
  const terra = [...paises, ...cache.vizinhos.features].map((f) => pathR(f)).filter(Boolean).join('');

  // Linhas-d’água: traços concêntricos do litoral, cada vez mais fracos.
  for (const [dd, op] of [[34, 0.35], [24, 0.5], [15, 0.7], [7, 0.9]]) {
    s.push(`<path d="${terra}" fill="none" stroke="${LINHA_AGUA}" stroke-opacity="${op}" stroke-width="${2 * dd + 1.4}" stroke-linejoin="round"/>`);
    s.push(`<path d="${terra}" fill="none" stroke="${OCEANO}" stroke-width="${2 * dd}" stroke-linejoin="round"/>`);
  }
  // Países (Natural Earth) e UFs vizinhas (IBGE).
  s.push(`<g fill="${ESTRANGEIRO}" stroke="${ESTRANGEIRO}" stroke-width="3" stroke-linejoin="round">${paises.map((p) => pathR(p)).filter(Boolean).map((d) => `<path d="${d}"/>`).join('')}</g>`);
  s.push(`<g fill="${VIZINHO}" stroke="${BORDA_VIZINHO}" stroke-width="1.1" stroke-linejoin="round">${cache.vizinhos.features.filter((v) => v.properties.SIGLA_UF !== UF).map((v) => `<path d="${pathR(v)}"/>`).join('')}</g>`);

  // Graticulado.
  const passo = (bx1 - bx0 > 9 || by1 - by0 > 9) ? 2 : 1;
  const grat = geoGraticule().step([passo, passo]).extent([[-80, -40], [-30, 10]]);
  s.push(`<path d="${pathR(grat())}" fill="none" stroke="#8b949c" stroke-width=".7" stroke-opacity=".5"/>`);

  // Estado: municípios coloridos pela região intermediária.
  s.push(`<g stroke="${PAPEL}" stroke-width=".6" stroke-linejoin="round">${cache.municipios.features.map((m) => `<path d="${path(m)}" fill="${corDaRgint(m.properties.CD_RGINT)}"/>`).join('')}</g>`);
  // Lagoas que o IBGE trata como "área operacional" (RS): água dentro do estado.
  if (cache.agua?.features.length)
    s.push(`<g fill="${OCEANO}" stroke="#8fa6b5" stroke-width=".9" stroke-linejoin="round">${cache.agua.features.map((f) => `<path d="${path(f)}"/>`).join('')}</g>`);
  s.push(`<path d="${cache.rgi.features.map((r) => path(r)).join('')}" fill="none" stroke="${LIM_RGI}" stroke-width="1" stroke-linejoin="round" stroke-opacity=".8"/>`);
  s.push(`<path d="${cache.rgint.features.map((r) => path(r)).join('')}" fill="none" stroke="${LIM_RGINT}" stroke-width="1.8" stroke-linejoin="round"/>`);

  // Rodovias: estaduais por baixo, federais por cima com contorno branco.
  const rod = cache.rodovias.features;
  const est = rod.filter((r) => r.properties.jurisdicao_mapa === 'estadual');
  const fed = rod.filter((r) => r.properties.jurisdicao_mapa === 'federal');
  const junta = (fs) => fs.map((f) => path(f)).join('');
  s.push(`<path d="${junta(est.filter((r) => !r.properties.pavimentada))}" fill="none" stroke="${ROD_EST}" stroke-width=".9" stroke-dasharray="4 3"/>`);
  s.push(`<path d="${junta(est.filter((r) => r.properties.pavimentada))}" fill="none" stroke="${ROD_EST}" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round"/>`);
  s.push(`<path d="${junta(fed)}" fill="none" stroke="${PAPEL}" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/>`);
  s.push(`<path d="${junta(fed)}" fill="none" stroke="${ROD_FED}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`);

  // Limite estadual por cima de tudo.
  s.push(`<path d="${path(limite)}" fill="none" stroke="${TINTA}" stroke-width="3.2" stroke-linejoin="round"/>`);
  return s.join('\n');
}

/* ---- rótulos -------------------------------------------------------------- */
const ocupados = []; // caixas [x0, y0, x1, y1] já usadas por rótulos
const livre = ([a0, b0, a1, b1], folga = 6) =>
  a0 >= 8 && b0 >= 8 && a1 <= MW - 8 && b1 <= MH - 8 &&
  !ocupados.some(([c0, d0, c1, d1]) => a0 < c1 + folga && a1 > c0 - folga && b0 < d1 + folga && b1 > d0 - folga);

function rotuloMono(texto, [x, y, raio], { tamanhos = [17, 16, 15, 14, 13], espaco = 2.2, cor = TINTA, peso = 400, maxLinhas = 3 } = {}) {
  // Escolhe tamanho e quebra para caber no círculo inscrito; se nada couber, o menor.
  let esc_ = null;
  for (const t of tamanhos) {
    for (let n = 1; n <= maxLinhas; n++) {
      const linhas = quebrar(texto, n);
      const lw = Math.max(...linhas.map((l) => largura(l, t, { mono: true, espaco })));
      const lh = linhas.length * t * 1.25;
      if (lw <= raio * 2.3 && lh <= raio * 1.6) { esc_ = { t, linhas, lw, lh }; break; }
    }
    if (esc_) break;
  }
  if (!esc_) {
    const t = tamanhos.at(-1);
    const linhas = quebrar(texto, maxLinhas);
    esc_ = { t, linhas, lw: Math.max(...linhas.map((l) => largura(l, t, { mono: true, espaco }))), lh: linhas.length * t * 1.25 };
  }
  const { t, linhas, lw, lh } = esc_;
  x = Math.min(Math.max(x, FAIXA + lw / 2), MW - FAIXA - lw / 2);
  y = Math.min(Math.max(y, FAIXA + lh / 2), MH - FAIXA - lh / 2);
  ocupados.push([x - lw / 2, y - lh / 2, x + lw / 2, y + lh / 2]);
  const y0 = y - lh / 2 + t * 0.95;
  return `<text x="${f1(x)}" y="${f1(y0)}" text-anchor="middle" font-family="${MONO}" font-size="${t}" font-weight="${peso}" letter-spacing="${espaco}" fill="${cor}" ${halo(4)}>${linhas
    .map((l, i) => `<tspan x="${f1(x)}" dy="${i ? f1(t * 1.25) : 0}">${esc(l)}</tspan>`)
    .join('')}</text>`;
}

function rotulos() {
  const s = [];
  // Capital: estrela e nome.
  const [cx, cy] = capXY;
  s.push(`<g transform="translate(${f1(cx)} ${f1(cy)})"><path d="M0-11l3.1 7.1 7.7.6-5.9 5 1.8 7.6L0 5.3l-6.7 4 1.8-7.6-5.9-5 7.7-.6z" fill="${TINTA}" stroke="${PAPEL}" stroke-width="2.2" paint-order="stroke" stroke-linejoin="round"/></g>`);
  s.push(`<text x="${f1(cx + 16)}" y="${f1(cy + 7)}" font-family="${SERIF}" font-size="22" font-style="italic" fill="${TINTA}" ${halo(5)}>${esc(cache.capital.nome)}</text>`);
  ocupados.push([cx - 14, cy - 14, cx + largCap, cy + 14]);

  // Regiões intermediárias.
  for (const c of classes.filter((k) => k.tipo === 'rgint')) {
    const p = internos.get(c.id);
    if (p) s.push(rotuloMono(c.nome.toLocaleUpperCase('pt-BR'), p, { tamanhos: [16, 15, 14, 13, 12], espaco: 1.8, peso: 700 }));
  }
  // UFs vizinhas e países: cinza, só se houver espaço visível suficiente.
  for (const c of classes.filter((k) => k.tipo === 'uf' || k.tipo === 'pais')) {
    const p = internos.get(c.id);
    if (!p || p[2] < 34) continue;
    const nome = c.tipo === 'uf' ? c.nome.toLocaleUpperCase('pt-BR') : PAISES[c.chave]?.[LINGUA === 'en' ? 1 : 0];
    if (!nome) continue;
    s.push(rotuloMono(nome, p, { tamanhos: [16, 15, 14, 13], espaco: 3.2, cor: '#8a9198', maxLinhas: 2 }));
  }
  // Oceano.
  let o = internos.get(0);
  if (o && o[2] > 40) {
    // O ponto mais "dentro" do mar mede só a altura livre; o rótulo tem ~240 px de largura.
    // Se a caixa sair do mar ou bater no norte, no localizador ou nas ilhas, vai para o lugar livre mais próximo.
    const caixasFixas = [
      [norte.x, norte.y, norte.x + NB.w, norte.y + NB.h],
      [canto.x, canto.y, canto.x + LOC, canto.y + LOC],
      ...(quadroIlhas ? [[quadroIlhas.x, quadroIlhas.y, quadroIlhas.x + IB.w, quadroIlhas.y + IB.h]] : []),
    ];
    const caixaO = ([x, y]) => [x - 120, y - 30, x + 120, y + 34];
    const cruza = (c, k) => c[2] > k[0] - 12 && c[0] < k[2] + 12 && c[3] > k[1] - 12 && c[1] < k[3] + 12;
    const bate = (c) => caixasFixas.some((k) => cruza(c, k));
    const mar = ([x, y]) => {
      const [xx, yy] = [Math.floor(x * ESC_M), Math.floor(y * ESC_M)];
      return xx >= 0 && yy >= 0 && xx < mw && yy < mh && classe0[yy * mw + xx] === 0;
    };
    const noMar = (p) => {
      const c = caixaO(p);
      if (c[0] < FAIXA || c[1] < FAIXA || c[2] > MW - FAIXA || c[3] > MH - FAIXA) return false;
      for (const y of [c[1], p[1], c[3]]) for (let i = 0; i <= 6; i++) if (!mar([c[0] + ((c[2] - c[0]) * i) / 6, y])) return false;
      return true;
    };
    if (bate(caixaO(o)) || !noMar(o)) {
      let melhor = null;
      for (let y = FAIXA + 30; y <= MH - FAIXA - 34; y += 12)
        for (let x = FAIXA + 120; x <= MW - FAIXA - 120; x += 12) {
          const d = Math.hypot(x - o[0], y - o[1]);
          if ((!melhor || d < melhor[2]) && !bate(caixaO([x, y])) && noMar([x, y])) melhor = [x, y, d];
        }
      o = melhor ? [melhor[0], melhor[1], o[2]] : null;
    }
  }
  if (o && o[2] > 40) {
    const linhas = tr('OCEANO ATLÂNTICO').split(' ');
    const t = 20;
    s.push(`<text x="${f1(o[0])}" y="${f1(o[1] - 6)}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="${t}" letter-spacing="6" fill="#6f8796">${linhas
      .map((l, i) => `<tspan x="${f1(o[0])}" dy="${i ? 30 : 0}">${esc(l)}</tspan>`)
      .join('')}</text>`);
    ocupados.push([o[0] - 120, o[1] - 30, o[0] + 120, o[1] + 34]);
  }
  return s.join('\n');
}

/* ---- escudos das rodovias federais ---------------------------------------- */
function escudos() {
  const trechos = new Map(); // BR-xxx → [{pts, comp}]
  for (const f of cache.rodovias.features) {
    if (f.properties.jurisdicao_mapa !== 'federal') continue;
    const brs = String(f.properties.sigla ?? '').match(/BR-\d{3}/g);
    if (!brs) continue;
    const pts = f.geometry.coordinates.map((c) => proj(c));
    let comp = 0;
    for (let i = 1; i < pts.length; i++) comp += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    for (const br of brs) {
      if (!trechos.has(br)) trechos.set(br, []);
      trechos.get(br).push({ pts, comp });
    }
  }
  const total = (br) => trechos.get(br).reduce((a, t) => a + t.comp, 0);
  const s = [];
  const postos = [];
  for (const br of [...trechos.keys()].sort((a, b) => total(b) - total(a))) {
    if (total(br) < 90) continue;
    // Candidatos: pontos ao longo dos trechos, do meio do mais longo para fora.
    const cands = [];
    for (const t of trechos.get(br)) {
      let acc = 0;
      for (let i = 1; i < t.pts.length; i++) {
        const [a, b] = [t.pts[i - 1], t.pts[i]];
        const seg = Math.hypot(b[0] - a[0], b[1] - a[1]);
        for (let u = 0; u < seg; u += 24) {
          const k = u / seg;
          cands.push({ x: a[0] + (b[0] - a[0]) * k, y: a[1] + (b[1] - a[1]) * k, peso: Math.min(acc + u, t.comp - acc - u) });
        }
        acc += seg;
      }
    }
    cands.sort((a, b) => b.peso - a.peso);
    const quantos = total(br) > 700 ? 2 : 1;
    let feitos = 0;
    const largEsc = largura(br, 12.5, { mono: true }) + 12;
    for (const c of cands) {
      if (feitos >= quantos) break;
      const caixa = [c.x - largEsc / 2, c.y - 10, c.x + largEsc / 2, c.y + 10];
      if (!livre(caixa, 10)) continue;
      if (!ehEstado.has(classe0[Math.floor(c.y * ESC_M) * mw + Math.floor(c.x * ESC_M)])) continue;
      if (postos.some((p) => (p.br === br ? Math.hypot(p.x - c.x, p.y - c.y) < 420 : Math.hypot(p.x - c.x, p.y - c.y) < 70))) continue;
      postos.push({ br, x: c.x, y: c.y });
      ocupados.push(caixa);
      s.push(`<g transform="translate(${f1(c.x)} ${f1(c.y)})"><rect x="${f1(-largEsc / 2)}" y="-10" width="${f1(largEsc)}" height="20" rx="3" fill="${ROD_FED}" stroke="${PAPEL}" stroke-width="1.6"/><text y="4.5" text-anchor="middle" font-family="${MONO}" font-size="12.5" font-weight="700" fill="${PAPEL}">${br}</text></g>`);
      feitos++;
    }
  }
  return s.join('\n');
}

/* ---- quadro das ilhas oceânicas ------------------------------------------- */
function quadroDasIlhas() {
  if (!quadroIlhas) return '';
  const { x, y } = quadroIlhas;
  const [cx, cy] = [(bx0 + bx1) / 2, (by0 + by1) / 2];
  const [[ix0, iy0], [ix1, iy1]] = geoBounds(ilhas);
  const centro = [(ix0 + ix1) / 2, (iy0 + iy1) / 2];
  const pi = geoTransverseMercator()
    .rotate([-centro[0], -centro[1]])
    .fitExtent([[24, 50], [IB.w - 24, IB.h - 44]], ilhas);
  const p = geoPath(pi.clipExtent([[0, 0], [IB.w, IB.h]])).digits(1);
  // Municípios a que as ilhas pertencem (Noronha é município; Trindade é de Vitória).
  const muns = cache.municipios.features.filter((m) => {
    const [[a0, b0], [a1, b1]] = geoBounds(m);
    return a1 >= ix0 - 0.5 && b1 >= iy0 - 0.5 && (a0 <= ix1 + 0.5 && b0 <= iy1 + 0.5) && a1 > bx1 + 1;
  });
  const costa = Math.round(Math.min(...continente.geometry.coordinates.flat(2).filter((_, i) => i % 3 === 0).map((c) => geoDistance(c, centro))) * 6371.0088);
  // Escala do quadro: um número redondo perto de 1/3 da largura.
  const pxKm = (() => {
    const a = pi.invert([IB.w / 2 - 50, IB.h / 2]);
    const b = pi.invert([IB.w / 2 + 50, IB.h / 2]);
    return 100 / (geoDistance(a, b) * 6371.0088);
  })();
  const km = [1, 2, 5, 10, 20, 25, 50].reduce((a, b) => (Math.abs(b * pxKm - 80) < Math.abs(a * pxKm - 80) ? b : a));
  const [titulo, tituloEn] = ILHAS[UF] ?? ['', ''];
  const nome = LINGUA === 'en' ? tituloEn : titulo;
  return `<g transform="translate(${x} ${y})">
  <rect width="${IB.w}" height="${IB.h}" fill="${OCEANO}" stroke="${TINTA}" stroke-width="1.2"/>
  <rect width="${IB.w}" height="38" fill="${PAPEL}"/><path d="M0 38H${IB.w}" stroke="${TINTA}" stroke-width=".8"/>
  ${quebrar(nome, largura(nome, 12, { mono: true, espaco: 1.4 }) > IB.w - 24 ? 2 : 1)
    .map((l, i, ls) => `<text x="12" y="${ls.length > 1 ? 16 + i * 14 : 24}" font-family="${MONO}" font-size="12" letter-spacing="1.4" fill="${TINTA}">${esc(l)}</text>`)
    .join('')}
  <g stroke="${TINTA}" stroke-width=".8" stroke-linejoin="round">${muns.map((m) => `<path d="${p(m)}" fill="${corDaRgint(m.properties.CD_RGINT)}"/>`).join('')}</g>
  <text x="12" y="${IB.h - 14}" font-family="${MONO}" font-size="12" fill="${CINZA}">${LINGUA === 'en' ? `${nf(costa)} km from the coast` : `a ${nf(costa)} km da costa`}</text>
  <g transform="translate(${IB.w - 12 - km * pxKm} ${IB.h - 22})"><rect width="${f1(km * pxKm)}" height="5" fill="${TINTA}"/><text x="${f1(km * pxKm)}" y="17" text-anchor="end" font-family="${MONO}" font-size="11" fill="${TINTA}">${km} km</text></g>
</g>`;
}

/* ---- localizador ----------------------------------------------------------- */
function localizador() {
  const pl = geoConicEqualArea().parallels([-2, -22]).rotate([54, 0]);
  const ufs = cache.ufs.features;
  const pad = 22;
  pl.fitExtent([[pad, pad + 14], [LOC - pad, LOC - pad]], { type: 'FeatureCollection', features: ufs });
  const p = geoPath(pl).digits(1);
  const alvo = ufs.find((f) => f.properties.SIGLA_UF === UF);
  return `<g transform="translate(${canto.x} ${canto.y})">
  <rect width="${LOC}" height="${LOC}" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1.2"/>
  <text x="14" y="26" font-family="${MONO}" font-size="13" letter-spacing="2.4" fill="${CINZA}">${tr('LOCALIZAÇÃO')}</text>
  <g fill="#e7eaec" stroke="${PAPEL}" stroke-width=".8">${ufs.map((f) => `<path d="${p(f)}"/>`).join('')}</g>
  <path d="${p(alvo)}" fill="${TINTA}"/>
  <path d="${p({ type: 'FeatureCollection', features: ufs })}" fill="none" stroke="#9aa2a9" stroke-width=".4"/>
</g>`;
}

/* ---- rótulos do graticulado na borda do mapa ------------------------------- */
function bordas() {
  const passo = (bx1 - bx0 > 9 || by1 - by0 > 9) ? 2 : 1;
  const s = [];
  const grau = (v, eixo) => {
    const h = eixo === 'lon' ? (v < 0 ? (LINGUA === 'en' ? 'W' : 'O') : 'E') : v < 0 ? 'S' : 'N';
    return `${Math.abs(v)}° ${h}`;
  };
  const raiz = (fn, a, b) => {
    let fa = fn(a);
    for (let i = 0; i < 60; i++) {
      const m = (a + b) / 2;
      const fm = fn(m);
      if (Math.sign(fm) === Math.sign(fa)) { a = m; fa = fm; } else b = m;
    }
    return (a + b) / 2;
  };
  // Nada de coordenada sobre o localizador ou o quadro das ilhas.
  const caixas = [[canto.x, canto.y, LOC, LOC], ...(quadroIlhas ? [[quadroIlhas.x, quadroIlhas.y, IB.w, IB.h]] : [])];
  const sobre = (a0, b0, a1, b1) => caixas.some(([x, y, w, h]) => a1 > x - 8 && a0 < x + w + 8 && b1 > y - 8 && b0 < y + h + 8);
  const estilo = `font-family="${MONO}" font-size="13" fill="${TINTA}" ${halo(4)}`;
  for (let lon = Math.ceil((bx0 - 8) / passo) * passo; lon <= bx1 + 8; lon += passo) {
    for (const [yy, dy, base] of [[0, 20, 'hanging'], [MH, -8, 'auto']]) {
      const lat = raiz((la) => proj([lon, la])[1] - yy, -40, 10);
      const [x] = proj([lon, lat]);
      if (x < 40 || x > MW - 70 || sobre(x - 2, yy ? MH - 24 : 0, x + 60, yy ? MH : 24)) continue;
      s.push(`<path d="M${f1(x)} ${yy}v${yy ? -12 : 12}" stroke="${TINTA}" stroke-width="1.2"/>`);
      s.push(`<text x="${f1(x + 5)}" y="${yy + dy}" ${estilo}>${grau(lon, 'lon')}</text>`);
    }
  }
  for (let lat = Math.ceil((by0 - 8) / passo) * passo; lat <= by1 + 8; lat += passo) {
    for (const [xx, dx, anc] of [[0, 8, 'start'], [MW, -8, 'end']]) {
      const lon = raiz((lo) => proj([lo, lat])[0] - xx, -90, -20);
      const [, y] = proj([lon, lat]);
      if (y < 40 || y > MH - 40 || sobre(xx ? MW - 64 : 0, y - 22, xx ? MW : 64, y + 2)) continue;
      s.push(`<path d="M${xx} ${f1(y)}h${xx ? -12 : 12}" stroke="${TINTA}" stroke-width="1.2"/>`);
      s.push(`<text x="${xx + dx}" y="${f1(y - 6)}" text-anchor="${anc}" ${estilo}>${grau(lat, 'lat')}</text>`);
    }
  }
  return s.join('\n');
}

/* ------------------------------------------------------------------ painel */
function escalaKm() {
  const alvo = 300 / PX_KM;
  const bons = [10, 20, 25, 50, 75, 100, 150, 200, 250, 300, 400, 500];
  const km = bons.reduce((a, b) => (Math.abs(b - alvo) < Math.abs(a - alvo) ? b : a));
  return { km, px: km * PX_KM };
}

/** Altura do carimbo: cinco linhas, duas delas com dois valores. */
const carimboAltura = () => 5 * 22 + 7 * 22;

function painel() {
  const s = [];
  const legT = (t, y) => `<text x="0" y="${y}" font-family="${MONO}" font-size="15" letter-spacing="2.4" fill="${CINZA}">${esc(tr(t))}</text>`;
  let y = 0;

  // Cabeçalho.
  s.push(`<text x="0" y="62" font-family="${MONO}" font-size="17" letter-spacing="5">ESSENCIAL GEO</text>`);
  s.push(`<path d="M0 86H${LP}" stroke="${TINTA}" stroke-width="1.6"/>`);
  s.push(`<text x="0" y="176" font-family="${SERIF}" font-size="76">${tr('Nº')} ${String(NUMERO).padStart(3, '0')}</text>`);
  s.push(`<path d="M${LP - 34} 132l5.2 12.3 13.3 1.1-10.1 8.8 3 13-11.4-6.9-11.4 6.9 3-13-10.1-8.8 13.3-1.1z" fill="${OURO}"/>`);
  // A estrela que representa o estado na Bandeira Nacional, em letra de 3,5 px.
  const [bayer, nomeEstrela] = ESTRELAS[UF];
  s.push(`<text x="${LP - 34}" y="178" text-anchor="middle" font-family="${MONO}" font-size="3.5" letter-spacing=".3" fill="${CINZA}">${esc(nomeEstrela ? `${bayer} · ${nomeEstrela}` : bayer)}</text>`);
  s.push(`<text x="0" y="226" font-family="${MONO}" font-size="15" letter-spacing="3" fill="${CINZA}">${tr('BRASIL, ESTADO POR ESTADO')}</text>`);
  s.push(`<text x="${LP}" y="226" text-anchor="end" font-family="${MONO}" font-size="15" letter-spacing="3" fill="${CINZA}">${UF}</text>`);

  // Título: o nome do estado, em uma ou duas linhas.
  let tt = 66;
  let linhasT = [N.nome];
  while (largura(linhasT[0], tt) > LP && tt > 50) tt -= 2;
  if (largura(N.nome, tt) > LP) {
    tt = 62;
    linhasT = quebrar(N.nome, 2);
  }
  y = 226 + 26 + tt;
  linhasT.forEach((l, i) => s.push(`<text x="0" y="${y + i * tt * 1.05}" font-family="${SERIF}" font-size="${tt}">${esc(l)}</text>`));
  y += (linhasT.length - 1) * tt * 1.05 + 40;
  s.push(`<text x="0" y="${y}" font-family="${SERIF}" font-style="italic" font-size="26" fill="#4f4a41">${tr('Divisão territorial e rodovias')}</text>`);

  // Em números.
  y += 56;
  s.push(legT('EM NÚMEROS', y));
  const cel = [
    [nf(N.municipios), [tr('municípios')]],
    [nf(Math.round(N.area_km2_ibge)), [tr('km² de área')]],
    [`${N.regioes_intermediarias} · ${N.regioes_imediatas}`, [tr('regiões intermediárias'), tr('e imediatas')]],
    [nf(N.rodovias_km.pavimentadas), [tr('km de rodovias'), tr('pavimentadas')]],
  ];
  y += 14;
  cel.forEach(([v, r], i) => {
    const cx = (i % 2) * (LP / 2 + 8);
    const cy = y + Math.floor(i / 2) * 86;
    s.push(`<path d="M${cx} ${cy}h${LP / 2 - 8}" stroke="${TINTA}" stroke-width=".8"/>`);
    s.push(`<text x="${cx}" y="${cy + 46}" font-family="${SERIF}" font-size="40">${esc(v)}</text>`);
    r.forEach((l, k) => s.push(`<text x="${cx}" y="${cy + 68 + k * 16}" font-family="${MONO}" font-size="13.5" letter-spacing=".6" fill="${CINZA}">${esc(l)}</text>`));
  });
  y += 2 * 86 + 30;

  // Legenda das regiões intermediárias (ordem: mais municípios primeiro).
  s.push(legT('REGIÕES GEOGRÁFICAS INTERMEDIÁRIAS', y));
  s.push(`<text x="${LP}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="13" letter-spacing="1.5" fill="${CINZA}">${tr('MUN.')}</text>`);
  y += 14;
  const passoL = N.municipios_por_rgint.length > 12 ? 27 : 30;
  N.municipios_por_rgint.forEach((r, i) => {
    const yy = y + i * passoL;
    s.push(`<rect x="0" y="${yy}" width="34" height="${passoL - 8}" fill="${corDaRgint(r.codigo)}" stroke="${LIM_RGINT}" stroke-width=".9"/>`);
    s.push(`<text x="50" y="${yy + passoL - 13}" font-family="${SERIF}" font-size="19.5">${esc(r.nome)}</text>`);
    s.push(`<text x="${LP}" y="${yy + passoL - 13}" text-anchor="end" font-family="${MONO}" font-size="15">${r.n}</text>`);
  });
  y += N.municipios_por_rgint.length * passoL + 34;

  // Limites e rodovias, em duas colunas.
  const col = LP / 2 + 8;
  s.push(legT('LIMITES', y));
  s.push(`<g transform="translate(${col} 0)">${legT('RODOVIAS', y)}</g>`);
  y += 12;
  const itensL = [
    [`<path d="M0 11h40" stroke="${TINTA}" stroke-width="3.2"/>`, 'estadual'],
    [`<path d="M0 11h40" stroke="${LIM_RGINT}" stroke-width="1.8"/>`, 'região intermediária'],
    [`<path d="M0 11h40" stroke="${LIM_RGI}" stroke-width="1"/>`, 'região imediata'],
    [`<rect x="0" y="2" width="40" height="18" fill="${PALETA[0]}"/><path d="M20 2v18" stroke="${PAPEL}" stroke-width="1.2"/>`, 'município'],
  ];
  const itensR = [
    [`<path d="M0 11h40" stroke="${PAPEL}" stroke-width="4.6"/><path d="M0 11h40" stroke="${ROD_FED}" stroke-width="2.4"/>`, 'federal'],
    [`<path d="M0 11h40" stroke="${ROD_EST}" stroke-width="1.15"/>`, 'estadual pavimentada'],
    [`<path d="M0 11h40" stroke="${ROD_EST}" stroke-width=".9" stroke-dasharray="4 3"/>`, 'estadual sem pavimento'],
    [`<path transform="translate(14 11)" d="M0-11l3.1 7.1 7.7.6-5.9 5 1.8 7.6L0 5.3l-6.7 4 1.8-7.6-5.9-5 7.7-.6z" fill="${TINTA}"/>`, 'capital'],
  ];
  const item = ([sim, rot], x, yy) =>
    `<g transform="translate(${x} ${yy})">${sim}<text x="54" y="17" font-family="${SERIF}" font-size="18">${esc(tr(rot))}</text></g>`;
  itensL.forEach((it, i) => s.push(item(it, 0, y + i * 30)));
  itensR.forEach((it, i) => s.push(item(it, col, y + i * 30)));
  y += 4 * 30;

  // Escala (o norte é a folha, no mapa).
  const { km, px } = escalaKm();
  // Centrada no vão entre a legenda e o carimbo.
  const yNE = y + Math.max(10, (MH - carimboAltura() - 24 - y - 110) / 2);
  const seg = px / 4;
  s.push(`<g transform="translate(0 ${yNE + 46})">
    <text x="0" y="-18" font-family="${MONO}" font-size="13" letter-spacing="1.5" fill="${CINZA}">${tr('ESCALA GRÁFICA')}</text>
    ${[0, 1, 2, 3].map((i) => `<rect x="${f1(i * seg)}" y="0" width="${f1(seg)}" height="9" fill="${i % 2 ? PAPEL : TINTA}" stroke="${TINTA}" stroke-width="1.1"/>`).join('')}
    ${[0, 2, 4].map((i) => `<text x="${f1(i * seg)}" y="32" text-anchor="middle" font-family="${MONO}" font-size="14">${nf((km / 4) * i)}</text>`).join('')}
    <text x="${f1(px + 16)}" y="9" font-family="${MONO}" font-size="14" fill="${CINZA}">km</text>
    <text x="0" y="54" font-family="${MONO}" font-size="12" fill="${CINZA}">${tr('verdadeira no meridiano central')}</text>
  </g>`);

  // Carimbo.
  const dataTxt = DATA.toLocaleDateString(LINGUA === 'en' ? 'en-GB' : 'pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });
  const gr = (v, h) => `${nf(Math.abs(v), 1)}° ${h}`;
  const carimbo = [
    ['PRANCHA', [`Essencial Geo · ${tr('Nº')} ${String(NUMERO).padStart(3, '0')}`]],
    ['DATA', [dataTxt]],
    ['PROJEÇÃO', [`SIRGAS 2000 · ${tr('Transversa de Mercator')}`, `λ₀ ${gr(LON0, LINGUA === 'en' ? 'W' : 'O')} · φ₀ ${gr(LAT0, 'S')}`]],
    ['FONTES', [tr('IBGE, Malha Municipal 2025'), tr('MapBiomas, rodovias')]],
    ['LICENÇA', ['CC BY 4.0']],
  ];
  const alturaC = carimboAltura();
  let yc = MH - alturaC - 24;
  for (const [i, [k, v]] of carimbo.entries()) {
    s.push(`<path d="M0 ${yc}H${LP}" stroke="${TINTA}" stroke-width="${i ? 0.8 : 1.6}"/>`);
    s.push(`<text x="0" y="${yc + 28}" font-family="${MONO}" font-size="14" letter-spacing="2" fill="${CINZA}">${tr(k)}</text>`);
    v.forEach((l, j) => s.push(`<text x="138" y="${yc + 28 + j * 22}" font-family="${MONO}" font-size="16" fill="${TINTA}">${esc(l)}</text>`));
    yc += 22 + v.length * 22;
  }
  s.push(`<path d="M0 ${yc}H${LP}" stroke="${TINTA}" stroke-width="1.6"/>`);
  s.push(molecula(LP - 20, yc - 34, 20)); // marca do autor, na linha da licença
  const sobra = MH - alturaC - 24 - (yNE + 120);
  return { svg: s.join('\n'), sobra };
}

/* ------------------------------------------------------------------ montagem */
function prancha() {
  ocupados.length = 0;
  ocupados.push([norte.x, norte.y, norte.x + NB.w, norte.y + NB.h], [canto.x, canto.y, canto.x + LOC, canto.y + LOC]);
  if (quadroIlhas) ocupados.push([quadroIlhas.x, quadroIlhas.y, quadroIlhas.x + IB.w, quadroIlhas.y + IB.h]);
  const camadas = mapa();
  const rots = rotulos();
  const esc_ = escudos();
  const { svg: pn, sobra } = painel();
  if (sobra < 10) console.warn(`aviso: painel sem folga (${f1(sobra)} px)`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<title>${esc(`${N.nome} — ${tr('Divisão territorial e rodovias')}`)}</title>
<rect width="${W}" height="${H}" fill="${PAPEL}"/>
<defs><clipPath id="mapa"><rect width="${MW}" height="${MH}"/></clipPath></defs>
<g transform="translate(${X0} ${Y0})">
  <g clip-path="url(#mapa)">
    <rect width="${MW}" height="${MH}" fill="${OCEANO}"/>
    ${camadas}
    ${rots}
    ${esc_}
    ${localizador()}
    ${quadroDasIlhas()}
    ${norteFolha({ cx: norte.x + NB.w / 2, cy: norte.y + 30 + NORTE_ALT / 2, altura: NORTE_ALT })}
  </g>
  ${bordas()}
</g>
<rect x="${M}" y="${M}" width="${W - 2 * M}" height="${H - 2 * M}" fill="none" stroke="${TINTA}" stroke-width="3"/>
<rect x="${X0}" y="${Y0}" width="${W - 2 * X0}" height="${MH}" fill="none" stroke="${TINTA}" stroke-width="1.2"/>
<path d="M${PX} ${Y0}V${Y0 + MH}" stroke="${TINTA}" stroke-width="1.2"/>
${microtexto(ASSINATURA, { x: X0, y: M + 8.6, comprimento: W - 2 * X0 })}
${microtexto(tr('O ESSENCIAL É INVISÍVEL AOS OLHOS'), { x: X0, y: H - M - 4.6, comprimento: W - 2 * X0 })}
<g transform="translate(${PX + 32} ${Y0})" fill="${TINTA}">${pn}</g>
</svg>`;
}

const destino = join(RAIZ, 'mapas', opt.pasta);
await mkdir(join(destino, 'dados'), { recursive: true });
const t0 = Date.now();
const saidas = [];
for (const lingua of ['pt', 'en']) {
  LINGUA = lingua;
  const svg = prancha();
  const sufixo = lingua === 'en' ? '.en' : '';
  const svgArq = join(destino, 'dados', `${UF.toLowerCase()}_prancha${sufixo}.svg`);
  await writeFile(svgArq, svg);
  const png = join(destino, `mapa_preview${sufixo}.png`);
  await sharp(Buffer.from(svg), { density: 72, limitInputPixels: false }).png({ compressionLevel: 9, palette: true, quality: 95, dither: 0 }).toFile(png);
  for (const a of [png, svgArq]) saidas.push(`  ${a.slice(destino.length + 1)}  ${((await stat(a)).size / 1e6).toFixed(2)} MB`);
}
if (opt.mascara) {
  const img = Buffer.alloc(mw * mh * 3);
  for (let i = 0; i < cls.length; i++) {
    const v = cls[i] < 0 ? 255 : Math.min(255, dist[i] * 2);
    img[i * 3] = img[i * 3 + 1] = img[i * 3 + 2] = v;
  }
  await sharp(img, { raw: { width: mw, height: mh, channels: 3 } }).png().toFile(join(RAIZ, 'scripts', 'estados', 'cache', `${UF.toLowerCase()}_mascara.png`));
}
// O que a prancha decidiu, para o README descrever exatamente o desenho (readme.mjs).
await writeFile(
  join(RAIZ, 'scripts', 'estados', 'cache', `${UF.toLowerCase()}_prancha.json`),
  JSON.stringify({
    cores: Object.fromEntries(N.municipios_por_rgint.map((r) => [r.codigo, corDaRgint(r.codigo)])),
    oceano: (internos.get(0)?.[2] ?? 0) > 40,
    localizador: canto.nome,
    norte: norte.nome,
    ilhas: quadroIlhas?.nome ?? null,
    svg_bytes: (await stat(join(destino, 'dados', `${UF.toLowerCase()}_prancha.svg`))).size,
    png_bytes: (await stat(join(destino, 'mapa_preview.png'))).size,
  }, null, 1),
);
console.log(`✓ ${UF} · prancha Nº ${NUMERO} (${Date.now() - t0} ms) · canto do localizador: ${canto.nome} · escala ${f1(PX_KM)} px/km\n${saidas.join('\n')}`);
