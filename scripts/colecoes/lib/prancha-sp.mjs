/**
 * Coleções temáticas sobre o estado de São Paulo — prancha comum (uso interno).
 *
 * Mesma linguagem da série «Brasil, estado por estado» (scripts/estados/prancha.mjs):
 * 2400 × 1800, mapa à esquerda, faixa à direita com cabeçalho, números, legenda, escala
 * e carimbo; norte em folha, molécula, lema, estrela e assinatura (docs/ESTILO.md).
 * O conteúdo do mapa vem do tema: um mapa grande (`layout: 'um'`) ou três pequenos e um
 * quadro de localização (`layout: 'quatro'`).
 *
 * Base: scripts/estados/cache/sp.json (geometrias simplificadas como cobertura, de preparar.py).
 */
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { geoTransverseMercator, geoConicEqualArea, geoPath, geoGraticule, geoDistance, geoBounds, geoArea, geoContains } from 'd3-geo';
import { feature } from 'topojson-client';
import { norteFolha, molecula, microtexto, ASSINATURA, ESTRELAS } from '../../lib/identidade.mjs';
import { motivo, chamada } from './arte.mjs';
import { imagemRaster } from './raster.mjs';

export const RAIZ = fileURLToPath(new URL('../../..', import.meta.url));

/* ------------------------------------------------------------------ prancha */
const W = 2400;
const H = 1800;
const M = 56;
const X0 = M + 12;
const Y0 = M + 12;
const MW = 1640;
const MH = H - 2 * Y0;
const PX = X0 + MW;
const PW = W - X0 - PX;
export const LP = PW - 64;

export const SERIF = "Georgia, 'Times New Roman', serif";
export const MONO = "Consolas, 'DejaVu Sans Mono', monospace";
export const TINTA = '#1a1c1e';
export const CINZA = '#7a8189';
export const PAPEL = '#ffffff';
const OCEANO = '#d9e5ec';
const LINHA_AGUA = '#bccdd8';
const ESTRANGEIRO = '#e4e6e8';
const VIZINHO = '#f2f3f4';
const BORDA_VIZINHO = '#b9c0c6';
const OURO = '#c99a2e';
const LIM_RGINT = '#1a211a';
export const ZERO = '#eef0f1';

const EN = {
  'Nº': 'No.',
  'EM NÚMEROS': 'AT A GLANCE',
  'ESCALA GRÁFICA': 'SCALE BAR',
  'verdadeira no meridiano central': 'true on the central meridian',
  'a mesma nos três mapas': 'the same in all three maps',
  LOCALIZAÇÃO: 'LOCATION',
  PRANCHA: 'PLATE',
  DATA: 'DATE',
  PROJEÇÃO: 'PROJECTION',
  FONTES: 'SOURCES',
  LICENÇA: 'LICENCE',
  'OCEANO ATLÂNTICO': 'ATLANTIC OCEAN',
  'O ESSENCIAL É INVISÍVEL AOS OLHOS': 'WHAT IS ESSENTIAL IS INVISIBLE TO THE EYE',
  'Transversa de Mercator': 'Transverse Mercator',
  'Cônica equivalente de Albers': 'Albers equal-area conic',
  'verdadeira nos paralelos-padrão': 'true on the standard parallels',
  'sem informação': 'no data',
  zero: 'zero',
  LIMITES: 'BOUNDARIES',
  estadual: 'state',
  'região intermediária': 'intermediate region',
  capital: 'state capital',
  Fonte: 'Source',
  Mapa: 'Map',
};
let LINGUA = 'pt';
export const lingua = () => LINGUA;
export const tr = (s) => (LINGUA === 'en' ? (EN[s] ?? s) : s);
export const nf = (v, casas = 0) =>
  v.toLocaleString(LINGUA === 'en' ? 'en-GB' : 'pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });

/* ------------------------------------------------------------------ util */
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
export const f1 = (v) => Math.round(v * 10) / 10;
export const halo = (l = 4) => `stroke="${PAPEL}" stroke-width="${l}" stroke-linejoin="round" paint-order="stroke"`;

// Avanços da Georgia Itálica (centésimos de em, de georgiai.ttf); acentos contam como a letra-base.
const ITALICO_C = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,;:!?'’‘\"“”()[]-–—%/&·ºª°×+=…«»$#*€§";
const ITALICO_W = [
  57, 55, 45, 58, 47, 33, 57, 56, 30, 29, 53, 29, 88, 59, 54, 58, 56, 46, 43, 35, 58, 54, 82, 50, 56, 44,
  67, 65, 64, 75, 65, 60, 73, 81, 39, 52, 69, 60, 93, 77, 73, 61, 73, 70, 56, 62, 76, 67, 98, 71, 62, 60,
  61, 43, 56, 55, 56, 53, 57, 50, 60, 57, 24, 27, 27, 38, 38, 33, 48, 22, 20, 20, 41, 39, 39, 38, 38, 38,
  38, 37, 64, 86, 82, 47, 71, 28, 50, 50, 42, 64, 64, 64, 81, 58, 58, 61, 64, 47, 64, 50,
];
const ITALICO = new Map([...ITALICO_C].map((c, i) => [c, ITALICO_W[i] / 100]));
for (const c of '₀₁₂₃₄₅₆₇₈₉⁰¹²³') ITALICO.set(c, 0.5);

export function largura(texto, tamanho, { mono = false, espaco = 0, italico = false } = {}) {
  if (mono) return texto.length * (0.55 * tamanho + espaco) - espaco;
  if (italico) {
    let w = 0;
    for (const c of texto.normalize('NFD')) if (!/\p{M}/u.test(c)) w += ITALICO.get(c) ?? 0.6;
    return w * tamanho + espaco * (texto.length - 1);
  }
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

export function quebrar(texto, n) {
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

/**
 * Linhas de no máximo `max` px, quebrando por palavra. Com `italico`, vale a maior das duas
 * estimativas (a genérica e a da Georgia Itálica, com 1,5 px de tolerância para o erro de
 * medida): só muda a quebra de linha que não cabia.
 */
export function linhasDe(texto, tamanho, max, opts = {}) {
  const w = opts.italico
    ? (t) => Math.max(largura(t, tamanho, { ...opts, italico: false }), largura(t, tamanho, opts) - 1.5)
    : (t) => largura(t, tamanho, opts);
  const out = [];
  let atual = '';
  for (const p of texto.split(' ')) {
    const t = atual ? `${atual} ${p}` : p;
    if (w(t) > max && atual) { out.push(atual); atual = p; } else atual = t;
  }
  if (atual) out.push(atual);
  return out;
}

/* ------------------------------------------------------------------ dados de base */
const cache = JSON.parse(await readFile(join(RAIZ, 'scripts', 'estados', 'cache', 'sp.json'), 'utf8'));
export const municipios = cache.municipios.features;
const limite = cache.limite.features[0];
const mundo = JSON.parse(await readFile(join(RAIZ, 'node_modules', 'world-atlas', 'countries-10m.json'), 'utf8'));
const paises = feature(mundo, mundo.objects.countries).features.filter((f) =>
  ['Argentina', 'Paraguay', 'Bolivia', 'Uruguay'].includes(f.properties.name),
);
const [[bx0, by0], [bx1, by1]] = geoBounds(limite);
const LON0 = Math.round(((bx0 + bx1) / 2) * 10) / 10;
const LAT0 = Math.round(((by0 + by1) / 2) * 10) / 10;
const ROTULOS_UF = [
  ['MINAS GERAIS', [-46.6, -19.75]], ['MATO GROSSO DO SUL', [-52.6, -20.6]], ['PARANÁ', [-51.4, -23.95]],
  ['RIO DE JANEIRO', [-43.9, -22.55]],
];
const PONTO_OCEANO = [-45.6, -25.25];

/* Recorte da prancha: São Paulo (padrão) ou o Brasil inteiro (usarBrasil()). */
const gr = (v, h) => `${nf(Math.abs(v), 1)}° ${h}`;
const BASE_SP = {
  sigla: 'SP',
  estrela: ESTRELAS.SP,
  unidades: municipios,
  codigo: (f) => f.properties.CD_MUN,
  limite,
  internas: cache.rgint.features,
  vizinhos: cache.vizinhos.features.filter((v) => v.properties.SIGLA_UF !== 'SP'),
  paises,
  terra: [...paises, ...cache.vizinhos.features],
  rotulos: ROTULOS_UF.map(([n, c]) => [n, n, c]),
  oceano: PONTO_OCEANO,
  capital: cache.capital,
  grat: { passo: 1, extensao: [[-60, -32], [-38, -14]] },
  bordas: { lon: [-56, -40, 1], lat: [-30, -15, 1] },
  projecao: () => geoTransverseMercator().rotate([-LON0, -LAT0]),
  // Escala medida no meridiano central, onde a transversa de Mercator é verdadeira.
  medir: (proj) => {
    const [cx, cy] = proj([LON0, LAT0]);
    return 400 / (geoDistance(proj.invert([cx, cy - 200]), proj.invert([cx, cy + 200])) * 6371.0088);
  },
  notaEscala: 'verdadeira no meridiano central',
  carimbo: () => [`SIRGAS 2000 · ${tr('Transversa de Mercator')}`, `λ₀ ${gr(LON0, LINGUA === 'en' ? 'W' : 'O')} · φ₀ ${gr(LAT0, 'S')}`],
};
let B = BASE_SP;

const SULAMERICA = ['Argentina', 'Bolivia', 'Chile', 'Colombia', 'Ecuador', 'Guyana', 'Paraguay', 'Peru', 'Suriname',
  'Uruguay', 'Venezuela', 'France', 'Falkland Is.', 'Panama', 'Costa Rica', 'Nicaragua', 'Trinidad and Tobago'];
const PAISES_BR = [
  ['ARGENTINA', 'ARGENTINA', [-63.5, -30.5]], ['BOLÍVIA', 'BOLIVIA', [-64.6, -17.2]], ['PERU', 'PERU', [-75.2, -10.5]],
  ['PARAGUAI', 'PARAGUAY', [-58.4, -23.3]], ['COLÔMBIA', 'COLOMBIA', [-72.6, 2.6]], ['VENEZUELA', 'VENEZUELA', [-65.6, 6.6]],
  ['URUGUAI', 'URUGUAY', [-56, -32.9]], ['GUIANA', 'GUYANA', [-58.9, 5.2]], ['SURINAME', 'SURINAME', [-55.9, 4.1]],
  ['CHILE', 'CHILE', [-70.6, -24]],
];

/** Passa a prancha para o recorte nacional (UFs e regiões de scripts/colecoes/cache/brasil-base.json). */
export async function usarBrasil() {
  const br = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', 'brasil-base.json'), 'utf8'));
  const sa = feature(mundo, mundo.objects.countries).features.filter((f) => SULAMERICA.includes(f.properties.name));
  const lim = br.limite.features[0];
  const proj = () => geoConicEqualArea().parallels([-2, -22]).rotate([54, 0]);
  B = {
    sigla: 'BR',
    estrela: ['CRUX', 'CRUZEIRO DO SUL'],
    unidades: br.ufs.features,
    codigo: (f) => f.properties.SIGLA_UF,
    limite: lim,
    internas: br.regioes.features,
    vizinhos: [],
    paises: sa,
    terra: [...sa, lim],
    rotulos: PAISES_BR,
    oceano: [-31.5, -21],
    capital: br.capital,
    rotulosUnidades: br.ufs.features.map((f) => [f.properties.SIGLA_UF, f.properties.rotulo]),
    grat: { passo: 5, extensao: [[-85, -45], [-25, 15]] },
    bordas: { lon: [-75, -35, 5], lat: [-35, 5, 5] },
    projecao: proj,
    // Albers: escala verdadeira nos paralelos-padrão; medida ao longo de 22° S.
    medir: (p) => {
      const a = p([-56, -22]);
      const b = p([-52, -22]);
      return Math.hypot(b[0] - a[0], b[1] - a[1]) / (geoDistance([-56, -22], [-52, -22]) * 6371.0088);
    },
    notaEscala: 'verdadeira nos paralelos-padrão',
    carimbo: () => [`SIRGAS 2000 · ${tr('Cônica equivalente de Albers')}`,
      `φ₁ 2° S · φ₂ 22° S · λ₀ ${gr(54, LINGUA === 'en' ? 'W' : 'O')}`],
  };
}

/**
 * Passa a prancha para um recorte regional dentro de SP (RMC, serras…), de scripts/colecoes/cache/<nome>-base.json:
 * { sigla, unidades, limite, internas?, vizinhos, rotulos, oceano?, capital, centro, grat, bordas }.
 * As geometrias vêm da malha em resolução cheia, levemente simplificada, para aguentar a escala regional.
 */
export async function usarRegiao(nome) {
  const r = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `${nome}-base.json`), 'utf8'));
  const [lon0, lat0] = r.centro;
  const lim = r.limite.features[0];
  B = {
    sigla: r.sigla,
    regional: true, // o contexto só cobre o quadro da prancha (figura: quadroFigura)
    estrela: ESTRELAS.SP,
    unidades: r.unidades.features,
    codigo: (f) => f.properties.CD_MUN,
    limite: lim,
    internas: r.internas?.features ?? [],
    vizinhos: r.vizinhos.features,
    paises: [],
    terra: [...r.vizinhos.features, lim],
    rotulos: r.rotulos,
    oceano: r.oceano ?? [-45.6, -25.25],
    rotulosUnidades: r.rotulosUnidades?.length ? r.rotulosUnidades : null,
    capital: r.capital,
    grat: r.grat,
    bordas: r.bordas,
    enquadrar: r.enquadrar ? r.enquadrar.features[0] : lim,
    projecao: () => geoTransverseMercator().rotate([-lon0, -lat0]),
    medir: (proj) => {
      const [cx, cy] = proj([lon0, lat0]);
      return 400 / (geoDistance(proj.invert([cx, cy - 200]), proj.invert([cx, cy + 200])) * 6371.0088);
    },
    notaEscala: 'verdadeira no meridiano central',
    carimbo: () => [`SIRGAS 2000 · ${tr('Transversa de Mercator')}`, `λ₀ ${gr(lon0, LINGUA === 'en' ? 'W' : 'O')} · φ₀ ${gr(lat0, 'S')}`],
    loc: { fundo: cache.ufs.features, ajuste: cache.ufs.features.find((f) => f.properties.SIGLA_UF === 'SP'), alvo: r.alvoLoc ? r.alvoLoc.features[0] : lim },
  };
}

/** Projeção do estado ajustada a um quadro (w × h) com folga. */
function projetar(w, h, pad, extensao) {
  // `extensao` ([[x0, y0], [x1, y1]]) troca a folga simétrica por um retângulo próprio (enquadramento da figura).
  const proj = B.projecao().fitExtent(extensao ?? [[pad, pad], [w - pad, h - pad]], B.enquadrar ?? B.limite);
  const recorte = B.projecao().scale(proj.scale()).translate(proj.translate())
    .clipExtent([[-20, -20], [w + 20, h + 20]]);
  const pxKm = B.medir(proj);
  return { proj, path: geoPath(proj).digits(1), pathR: geoPath(recorte).digits(1), pxKm };
}

/** Polígono pronto para o d3: sem partes invertidas (ver camadas extras em quadroMapa). */
function sanear(f) {
  const g = f.geometry;
  const avesso = (coords) => geoArea({ type: 'Polygon', coordinates: coords }) > 2 * Math.PI;
  if (g.type === 'Polygon') {
    if (!avesso(g.coordinates)) return f;
    return { ...f, geometry: { type: 'Polygon', coordinates: g.coordinates.map((r) => [...r].reverse()) } };
  }
  if (g.type === 'MultiPolygon') {
    const partes = g.coordinates.filter((p) => !avesso(p));
    return partes.length ? { ...f, geometry: { type: 'MultiPolygon', coordinates: partes } } : null;
  }
  return f;
}

/* ------------------------------------------------------------------ um quadro de mapa */
let uid = 0;
/**
 * Desenha um mapa do estado num quadro (w × h). `mapa` traz:
 *   preencher(cd) → cor | null (null = sem informação, hachurado)
 *   pontos: [{ coord, r, cor, borda?, vazado? }]   (desenhados do maior para o menor)
 *   destaques: [{ cd, texto }]                     (nomes de municípios em destaque)
 *   pad, graticulado, rotulosUf, oceano, capitalNome
 */
function quadroMapa(w, h, mapa) {
  const { proj, path, pathR, pxKm } = projetar(w, h, mapa.pad ?? 80, mapa.extensao);
  const id = `q${uid++}`;
  const s = [];
  s.push(`<defs><clipPath id="${id}"><rect width="${w}" height="${h}"/></clipPath>
<pattern id="${id}h" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="${PAPEL}"/><path d="M0 0V7" stroke="#aeb4ba" stroke-width="1.1"/></pattern></defs>`);
  s.push(`<g clip-path="url(#${id})">`);
  // Sem mapa de base (figura «sem base»): fundo de papel, só o recorte; o que passa da borda dele é cortado.
  const semBase = !!mapa.semBase;
  const noRecorte = semBase ? ` clip-path="url(#${id}l)"` : '';
  if (semBase) s.push(`<defs><clipPath id="${id}l"><path d="${path(B.limite)}"/></clipPath></defs>`);
  s.push(`<rect width="${w}" height="${h}" fill="${semBase ? PAPEL : OCEANO}"/>`);
  if (!semBase) {
    const terra = B.terra.map((f) => pathR(f)).filter(Boolean).join('');
    for (const [dd, op] of [[26, 0.35], [18, 0.5], [11, 0.7], [5, 0.9]]) {
      s.push(`<path d="${terra}" fill="none" stroke="${LINHA_AGUA}" stroke-opacity="${op}" stroke-width="${2 * dd + 1.4}" stroke-linejoin="round"/>`);
      s.push(`<path d="${terra}" fill="none" stroke="${OCEANO}" stroke-width="${2 * dd}" stroke-linejoin="round"/>`);
    }
    s.push(`<g fill="${ESTRANGEIRO}" stroke="${ESTRANGEIRO}" stroke-width="3">${B.paises.map((p) => pathR(p)).filter(Boolean).map((d) => `<path d="${d}"/>`).join('')}</g>`);
    s.push(`<g fill="${VIZINHO}" stroke="${BORDA_VIZINHO}" stroke-width="1.1" stroke-linejoin="round">${B.vizinhos.map((v) => `<path d="${pathR(v)}"/>`).join('')}</g>`);
  }
  if (mapa.graticulado !== false && !semBase) {
    const grat = geoGraticule().step([B.grat.passo, B.grat.passo]).extent(B.grat.extensao);
    s.push(`<path d="${pathR(grat())}" fill="none" stroke="#8b949c" stroke-width=".7" stroke-opacity=".5"/>`);
  }
  // Municípios.
  const fino = mapa.bordaMunicipio ?? 0.5;
  s.push(`<g${noRecorte} stroke="${mapa.bordaUnidadeCor ?? PAPEL}" stroke-width="${fino}" stroke-linejoin="round">${B.unidades
    .map((m) => {
      const cor = mapa.preencher(B.codigo(m));
      return `<path d="${path(m)}" fill="${cor ?? `url(#${id}h)`}"/>`;
    })
    .join('')}</g>`);
  if (mapa.hachura) {
    const { cds, cor = '#1a211a', passo = 5, largura: lh = 0.8, angulo = -55 } = mapa.hachura;
    s.push(`<defs><pattern id="${id}x" width="${passo}" height="${passo}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angulo})"><path d="M0 0V${passo}" stroke="${cor}" stroke-width="${lh}" stroke-opacity=".75"/></pattern></defs>`);
    s.push(`<g${noRecorte} fill="url(#${id}x)">${B.unidades.filter((m) => cds.has(B.codigo(m))).map((m) => `<path d="${path(m)}"/>`).join('')}</g>`);
  }
  // Grade raster (uso da terra, relevo…), já amostrada na projeção do quadro (gerarPrancha).
  if (mapa.rasterSvg) {
    if (mapa.rasterRecorte === 'limite' || semBase) {
      s.push(`<defs><clipPath id="${id}r"><path d="${path(B.limite)}"/></clipPath></defs><g clip-path="url(#${id}r)">${mapa.rasterSvg}</g>`);
    } else s.push(mapa.rasterSvg);
    if (mapa.bordaSobreRaster) s.push(`<g${noRecorte} fill="none" stroke="${mapa.bordaSobreRaster}" stroke-width="${mapa.larguraSobreRaster ?? 0.8}" stroke-linejoin="round" stroke-opacity="${mapa.opacidadeSobreRaster ?? 0.9}">${B.unidades.map((m) => `<path d="${path(m)}"/>`).join('')}</g>`);
  }
  // Camadas extras (bacias, áreas protegidas…): [{ feats, cor(f) | cor, borda, largura, opacidade, hachura }].
  for (const [k, c] of (mapa.camadas ?? []).entries()) {
    let padrao = '';
    if (c.hachura) {
      const { cor: hc, passo = 6, largura: hl = 1, angulo = 45, fundo = 'none' } = c.hachura;
      padrao = `${id}c${k}`;
      s.push(`<defs><pattern id="${padrao}" width="${passo}" height="${passo}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angulo})"><rect width="${passo}" height="${passo}" fill="${fundo}"/><path d="M0 0V${passo}" stroke="${hc}" stroke-width="${hl}"/></pattern></defs>`);
    }
    // Anel no sentido errado vira o avesso do mundo no d3. Em lascas de recorte (partes de poucos metros que o
    // arredondamento das coordenadas inverte), a parte é descartada; um polígono inteiro invertido é desvirado.
    const feats = c.feats.map((f) => sanear(f)).filter(Boolean);
    const corDe = (f) => (padrao ? `url(#${padrao})` : typeof c.cor === 'function' ? c.cor(f) : (c.cor ?? 'none'));
    s.push(`<g${noRecorte} stroke="${c.borda ?? 'none'}" stroke-width="${c.largura ?? 0}" stroke-linejoin="round" fill-opacity="${c.opacidade ?? 1}"${c.tracejado ? ` stroke-dasharray="${c.tracejado}"` : ''}>${feats
      .map((f) => [f, path(f)]).filter(([, d]) => d).map(([f, d]) => `<path d="${d}" fill="${corDe(f)}"/>`).join('')}</g>`);
  }
  if (!mapa.semRgint) s.push(`<path${noRecorte} d="${B.internas.map((r) => path(r)).join('')}" fill="none" stroke="${LIM_RGINT}" stroke-width="${mapa.bordaRgint ?? 1.4}" stroke-linejoin="round" stroke-opacity=".85"/>`);
  s.push(`<path d="${path(B.limite)}" fill="none" stroke="${TINTA}" stroke-width="${mapa.bordaEstado ?? 2.6}" stroke-linejoin="round"/>`);
  // Camadas de linhas por cima do limite (rede de transmissão…): [{ feats, cor(f) | cor, largura(f) | largura, halo }].
  for (const c of mapa.linhas ?? []) {
    const cor = (f) => (typeof c.cor === 'function' ? c.cor(f) : c.cor);
    const lw = (f) => (typeof c.largura === 'function' ? c.largura(f) : (c.largura ?? 1));
    const ds = c.feats.map((f) => [f, path(f)]).filter(([, d]) => d);
    if (c.halo) s.push(`<g${noRecorte} fill="none" stroke="${PAPEL}" stroke-linecap="round" stroke-linejoin="round" stroke-opacity=".85">${ds.map(([f, d]) => `<path d="${d}" stroke-width="${f1(lw(f) + c.halo)}"/>`).join('')}</g>`);
    s.push(`<g${noRecorte} fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="${c.opacidade ?? 1}">${ds.map(([f, d]) => `<path d="${d}" stroke="${cor(f)}" stroke-width="${lw(f)}"/>`).join('')}</g>`);
  }
  // Pontos: maiores por baixo.
  for (const p of [...(mapa.pontos ?? [])].filter((p) => !semBase || geoContains(B.limite, p.coord)).sort((a, b) => b.r - a.r)) {
    const [x, y] = proj(p.coord);
    if (p.anel) { s.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(p.r)}" fill="none" stroke="${p.cor}" stroke-width="${p.largura ?? 2}" stroke-opacity=".95"/>`); continue; }
    s.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(p.r)}" fill="${p.vazado ? PAPEL : p.cor}" fill-opacity="${p.vazado ? 1 : (p.opacidade ?? 0.9)}" stroke="${p.vazado ? p.cor : (p.borda ?? PAPEL)}" stroke-width="${p.vazado ? 2 : (p.bordaLargura ?? 1.2)}"/>`);
  }
  // Rótulos: UFs vizinhas, oceano, destaques, capital.
  const ocupado = [];
  const cabe = ([a0, b0, a1, b1]) => a0 > 14 && b0 > 14 && a1 < w - 14 && b1 < h - 14 &&
    !ocupado.some(([c0, d0, c1, d1]) => a0 < c1 + 4 && a1 > c0 - 4 && b0 < d1 + 4 && b1 > d0 - 4);
  for (const r of mapa.reservas ?? []) ocupado.push(r);
  const porCd = new Map(B.unidades.map((m) => [B.codigo(m), m]));
  for (const c of mapa.chamadas ?? []) {
    const [x, y] = c.coord ? proj(c.coord) : path.centroid(porCd.get(c.cd));
    const ch = chamada(x, y, c);
    ocupado.push(ch.caixa, [x - 9, y - 9, x + 9, y + 9]);
    s.push(ch.svg);
  }
  const tUf = mapa.tamanhoUf ?? 15;
  if (mapa.rotulosUf !== false && !semBase)
    for (const [pt, en, c] of B.rotulos) {
      const nome = LINGUA === 'en' ? en : pt;
      const [x, y] = proj(c);
      const lw = largura(nome, tUf, { mono: true, espaco: 3 });
      const caixa = [x - lw / 2, y - tUf, x + lw / 2, y + 4];
      if (!cabe(caixa)) continue;
      ocupado.push(caixa);
      s.push(`<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" font-family="${MONO}" font-size="${tUf}" letter-spacing="3" fill="#8a9198">${esc(nome)}</text>`);
    }
  if (mapa.oceano !== false && !semBase) {
    const [x, y] = proj(B.oceano);
    const t = mapa.tamanhoOceano ?? 19;
    const lw = largura(tr('OCEANO ATLÂNTICO'), t, { espaco: 5 });
    const caixa = [x - lw / 2, y - t, x + lw / 2, y + 6];
    if (cabe(caixa)) {
      ocupado.push(caixa);
      s.push(`<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="${t}" letter-spacing="5" fill="#6f8796">${tr('OCEANO ATLÂNTICO')}</text>`);
    }
  }
  // Siglas das unidades (só no recorte nacional).
  if (mapa.rotulosUnidades !== false && B.rotulosUnidades) {
    const tU = mapa.tamanhoUnidade ?? 13;
    for (const [sig, c] of B.rotulosUnidades) {
      if (mapa.semRotulo?.includes(sig)) continue;
      const [x, y] = proj(c);
      const caixa = [x - 12, y - tU, x + 12, y + 3];
      ocupado.push(caixa);
      s.push(`<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" font-family="${MONO}" font-size="${tU}" letter-spacing="1" fill="#5d646b" ${halo(3)}>${sig}</text>`);
    }
  }
  const [cx, cy] = proj(B.capital.coord);
  const est = mapa.tamanhoEstrela ?? 1;
  s.push(`<g transform="translate(${f1(cx)} ${f1(cy)}) scale(${est})"><path d="M0-11l3.1 7.1 7.7.6-5.9 5 1.8 7.6L0 5.3l-6.7 4 1.8-7.6-5.9-5 7.7-.6z" fill="${TINTA}" stroke="${PAPEL}" stroke-width="2.2" paint-order="stroke" stroke-linejoin="round"/></g>`);
  ocupado.push([cx - 12 * est, cy - 12 * est, cx + 12 * est, cy + 12 * est]);
  if (mapa.capitalNome !== false) {
    const t = mapa.tamanhoCapital ?? 20;
    s.push(`<text x="${f1(cx + 14 * est)}" y="${f1(cy + t * 0.32)}" font-family="${SERIF}" font-size="${t}" font-style="italic" fill="${TINTA}" ${halo(5)}>${esc(B.capital.nome)}</text>`);
    ocupado.push([cx, cy - t, cx + 14 * est + largura(B.capital.nome, t), cy + 6]);
  }
  const tD = mapa.tamanhoDestaque ?? 13;
  for (const d of mapa.destaques ?? []) {
    const m = porCd.get(d.cd);
    if (!m) continue;
    const [x, y] = d.coord ? proj(d.coord) : path.centroid(m);
    const lw = largura(d.texto, tD, { mono: true, espaco: 0.6 });
    // Tenta à direita, à esquerda, acima e abaixo do ponto.
    for (const [ax, ay, anc] of [[8, 4, 'start'], [-8, 4, 'end'], [0, -10, 'middle'], [0, 18, 'middle']]) {
      const x0 = anc === 'start' ? x + ax : anc === 'end' ? x + ax - lw : x - lw / 2;
      const caixa = [x0, y + ay - tD, x0 + lw, y + ay + 3];
      if (!cabe(caixa)) continue;
      ocupado.push(caixa);
      s.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="2.6" fill="${TINTA}" stroke="${PAPEL}" stroke-width="1.2"/>`);
      s.push(`<text x="${f1(x + ax)}" y="${f1(y + ay)}" text-anchor="${anc}" font-family="${MONO}" font-size="${tD}" letter-spacing=".6" fill="${TINTA}" ${halo(4)}>${esc(d.texto)}</text>`);
      break;
    }
  }
  s.push('</g>');
  return { svg: s.join('\n'), proj, pxKm };
}

/* ------------------------------------------------------------------ peças fixas */
function localizador(x, y, lado) {
  const pl = geoConicEqualArea().parallels([-2, -22]).rotate([54, 0]);
  // No recorte nacional, o localizador é a América do Sul com o Brasil em destaque.
  const ufs = B.loc ? B.loc.fundo : B.sigla === 'BR' ? [...B.paises.filter((f) => f.properties.name !== 'France'), B.limite] : cache.ufs.features;
  pl.fitExtent([[20, 34], [lado - 20, lado - 20]], B.loc ? B.loc.ajuste : { type: 'FeatureCollection', features: B.sigla === 'BR' ? [B.limite, ...B.paises.filter((f) => !['France', 'Falkland Is.', 'Panama', 'Costa Rica', 'Nicaragua', 'Trinidad and Tobago'].includes(f.properties.name))] : ufs });
  const p = geoPath(pl).digits(1);
  const alvo = B.loc ? B.loc.alvo : B.sigla === 'BR' ? B.limite : ufs.find((f) => f.properties.SIGLA_UF === 'SP');
  return `<g transform="translate(${x} ${y})">
  <rect width="${lado}" height="${lado}" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1.2"/>
  <text x="14" y="26" font-family="${MONO}" font-size="13" letter-spacing="2.4" fill="${CINZA}">${tr('LOCALIZAÇÃO')}</text>
  <clipPath id="loc${x}"><rect width="${lado}" height="${lado}"/></clipPath><g clip-path="url(#loc${x})"><g fill="#e7eaec" stroke="${PAPEL}" stroke-width=".8">${ufs.map((f) => p(f)).filter(Boolean).map((d) => `<path d="${d}"/>`).join('')}</g></g>
  <path d="${p(alvo)}" fill="${TINTA}"/>
</g>`;
}

/** Coordenadas na borda de um quadro (só no layout de um mapa). */
function bordas(proj, w, h, evitar) {
  const s = [];
  const gm = (v) => { const a = Math.abs(v); const g = Math.floor(a + 1e-9); const m = Math.round((a - g) * 60); return m ? `${g}°${String(m).padStart(2, '0')}′` : `${g}°`; };
  const grau = (v, eixo) => (v === 0 ? '0°' : `${gm(v)} ${eixo === 'lon' ? (LINGUA === 'en' ? 'W' : 'O') : v > 0 ? 'N' : 'S'}`);
  const raiz = (fn, a, b) => {
    let fa = fn(a);
    for (let i = 0; i < 60; i++) {
      const m = (a + b) / 2;
      const fm = fn(m);
      if (Math.sign(fm) === Math.sign(fa)) { a = m; fa = fm; } else b = m;
    }
    return (a + b) / 2;
  };
  const sobre = (a0, b0, a1, b1) => evitar.some(([x0, y0, x1, y1]) => a1 > x0 - 8 && a0 < x1 + 8 && b1 > y0 - 8 && b0 < y1 + 8);
  const estilo = `font-family="${MONO}" font-size="13" fill="${TINTA}" ${halo(4)}`;
  for (let k = 0, lon = B.bordas.lon[0]; lon <= B.bordas.lon[1] + 1e-9; k++, lon = B.bordas.lon[0] + k * B.bordas.lon[2])
    for (const [yy, dy] of [[0, 20], [h, -8]]) {
      const lat = raiz((la) => proj([lon, la])[1] - yy, -40, 10);
      const [x] = proj([lon, lat]);
      if (x < 40 || x > w - 70 || sobre(x - 2, yy ? h - 24 : 0, x + 60, yy ? h : 24)) continue;
      s.push(`<path d="M${f1(x)} ${yy}v${yy ? -12 : 12}" stroke="${TINTA}" stroke-width="1.2"/>`);
      s.push(`<text x="${f1(x + 5)}" y="${yy + dy}" ${estilo}>${grau(lon, 'lon')}</text>`);
    }
  for (let k = 0, lat = B.bordas.lat[0]; lat <= B.bordas.lat[1] + 1e-9; k++, lat = B.bordas.lat[0] + k * B.bordas.lat[2])
    for (const [xx, dx, anc] of [[0, 8, 'start'], [w, -8, 'end']]) {
      const lon = raiz((lo) => proj([lo, lat])[0] - xx, -90, -20);
      const [, y] = proj([lon, lat]);
      if (y < 40 || y > h - 40 || sobre(xx ? w - 64 : 0, y - 22, xx ? w : 64, y + 2)) continue;
      s.push(`<path d="M${xx} ${f1(y)}h${xx ? -12 : 12}" stroke="${TINTA}" stroke-width="1.2"/>`);
      s.push(`<text x="${xx + dx}" y="${f1(y - 6)}" text-anchor="${anc}" ${estilo}>${grau(lat, 'lat')}</text>`);
    }
  return s.join('\n');
}

/** Legenda de classes em coluna: [[cor | null, rótulo]] (null = hachura de "sem informação"). */
export function legendaClasses(itens, { x = 0, y = 0, passo = 30, tamanho = 18, id = 'leg' } = {}) {
  const s = [`<defs><pattern id="${id}h" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="${PAPEL}"/><path d="M0 0V7" stroke="#aeb4ba" stroke-width="1.1"/></pattern></defs>`];
  itens.forEach(([cor, rot], i) => {
    const yy = y + i * passo;
    s.push(`<rect x="${x}" y="${yy}" width="34" height="${passo - 8}" fill="${cor ?? `url(#${id}h)`}" stroke="${LIM_RGINT}" stroke-width=".8"/>`);
    s.push(`<text x="${x + 50}" y="${yy + passo - 13}" font-family="${SERIF}" font-size="${tamanho}">${esc(rot)}</text>`);
  });
  return { svg: s.join('\n'), altura: itens.length * passo };
}

/** Legenda horizontal compacta (para os mapas pequenos): uma faixa de caixas com os limites embaixo. */
export function legendaFaixa(cores, limites, { x = 0, y = 0, larg = 56, titulo = '', semInfo = true, id = 'lf' } = {}) {
  const s = [`<defs><pattern id="${id}h" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="${PAPEL}"/><path d="M0 0V6" stroke="#aeb4ba" stroke-width="1"/></pattern></defs>`];
  if (titulo) s.push(`<text x="${x}" y="${y - 10}" font-family="${MONO}" font-size="13" letter-spacing="1" fill="${CINZA}">${esc(titulo)}</text>`);
  const caixas = [[ZERO, null], ...cores.map((c) => [c, null])];
  caixas.forEach(([c], i) => s.push(`<rect x="${x + i * larg}" y="${y}" width="${larg}" height="14" fill="${c}" stroke="${LIM_RGINT}" stroke-width=".6"/>`));
  s.push(`<text x="${x + larg / 2}" y="${y + 32}" text-anchor="middle" font-family="${MONO}" font-size="12" fill="${TINTA}">0</text>`);
  limites.forEach((l, i) => s.push(`<text x="${x + (i + 2) * larg}" y="${y + 32}" text-anchor="middle" font-family="${MONO}" font-size="12" fill="${TINTA}">${esc(l)}</text>`));
  if (semInfo) {
    const xs = x + caixas.length * larg + 26;
    s.push(`<rect x="${xs}" y="${y}" width="${larg * 0.6}" height="14" fill="url(#${id}h)" stroke="${LIM_RGINT}" stroke-width=".6"/>`);
    s.push(`<text x="${xs + larg * 0.3}" y="${y + 32}" text-anchor="middle" font-family="${MONO}" font-size="12" fill="${CINZA}">${LINGUA === "en" ? "n/a" : "s/i"}</text>`);
  }
  return s.join('\n');
}

function escala(pxKm, alvoPx = 300) {
  const bons = [10, 20, 25, 50, 75, 100, 150, 200, 250, 300, 400, 500, 750, 1000];
  const km = bons.reduce((a, b) => (Math.abs(b - alvoPx / pxKm) < Math.abs(a - alvoPx / pxKm) ? b : a));
  return { km, px: km * pxKm };
}

/* ------------------------------------------------------------------ painel */
function cabecalho(tema, numero) {
  const s = [];
  s.push(`<text x="0" y="62" font-family="${MONO}" font-size="17" letter-spacing="5">ESSENCIAL</text>`);
  s.push(`<path d="M0 86H${LP}" stroke="${TINTA}" stroke-width="1.6"/>`);
  s.push(`<text x="0" y="176" font-family="${SERIF}" font-size="76">${tr('Nº')} ${String(numero).padStart(3, '0')}</text>`);
  s.push(`<path d="M${LP - 34} 132l5.2 12.3 13.3 1.1-10.1 8.8 3 13-11.4-6.9-11.4 6.9 3-13-10.1-8.8 13.3-1.1z" fill="${OURO}"/>`);
  const [bayer, nome] = B.estrela;
  s.push(`<text x="${LP - 34}" y="178" text-anchor="middle" font-family="${MONO}" font-size="3.5" letter-spacing=".3" fill="${CINZA}">${esc(`${bayer} · ${nome}`)}</text>`);
  s.push(`<text x="0" y="226" font-family="${MONO}" font-size="15" letter-spacing="3" fill="${CINZA}">${esc(tema.serie())}</text>`);
  s.push(`<text x="${LP}" y="226" text-anchor="end" font-family="${MONO}" font-size="15" letter-spacing="3" fill="${CINZA}">${B.sigla}</text>`);
  let tt = 62;
  let linhas = [tema.titulo()];
  while (largura(linhas[0], tt) > LP * 0.95 && tt > 48) tt -= 2;
  if (largura(linhas[0], tt) > LP * 0.95) { tt = 54; linhas = quebrar(tema.titulo(), 2); }
  let y = 226 + 26 + tt;
  linhas.forEach((l, i) => s.push(`<text x="0" y="${y + i * tt * 1.05}" font-family="${SERIF}" font-size="${tt}">${esc(l)}</text>`));
  y += (linhas.length - 1) * tt * 1.05 + 38;
  for (const l of linhasDe(tema.subtitulo(), 24, LP, { italico: true })) {
    s.push(`<text x="0" y="${y}" font-family="${SERIF}" font-style="italic" font-size="24" fill="#4f4a41">${esc(l)}</text>`);
    y += 32;
  }
  if (tema.descricao) {
    y += 2;
    for (const l of linhasDe(tema.descricao(), 14, LP, { mono: true, espaco: 0.4 })) {
      s.push(`<text x="0" y="${y}" font-family="${MONO}" font-size="14" letter-spacing=".4" fill="${CINZA}">${esc(l)}</text>`);
      y += 20;
    }
  }
  return { svg: s.join('\n'), y: y + 14 };
}

export const rotuloPainel = (t, y, x = 0) =>
  `<text x="${x}" y="${y}" font-family="${MONO}" font-size="15" letter-spacing="2.4" fill="${CINZA}">${esc(tr(t))}</text>`;

function emNumeros(celulas, y) {
  const s = [rotuloPainel('EM NÚMEROS', y)];
  y += 14;
  const linha = celulas.some(([, r]) => r.length > 1) ? 98 : 86;
  celulas.forEach(([v, r], i) => {
    const cx = (i % 2) * (LP / 2 + 8);
    const cy = y + Math.floor(i / 2) * linha;
    s.push(`<path d="M${cx} ${cy}h${LP / 2 - 8}" stroke="${TINTA}" stroke-width=".8"/>`);
    const t = largura(v, 40) > LP / 2 - 12 ? 32 : 40;
    s.push(`<text x="${cx}" y="${cy + 46}" font-family="${SERIF}" font-size="${t}">${esc(v)}</text>`);
    r.forEach((l, k) => s.push(`<text x="${cx}" y="${cy + 68 + k * 16}" font-family="${MONO}" font-size="13.5" letter-spacing=".6" fill="${CINZA}">${esc(l)}</text>`));
  });
  return { svg: s.join('\n'), y: y + Math.ceil(celulas.length / 2) * linha + 24 };
}

const carimboAltura = (fontes) => 5 * 22 + (4 + fontes.length) * 22;

function carimbo(tema, numero, data, yFim) {
  const dataTxt = data.toLocaleDateString(LINGUA === 'en' ? 'en-GB' : 'pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });
  const fontes = tema.fontes();
  const linhas = [
    ['PRANCHA', [`Essencial · ${tr('Nº')} ${String(numero).padStart(3, '0')}`]],
    ['DATA', [dataTxt]],
    ['PROJEÇÃO', B.carimbo()],
    ['FONTES', fontes],
    ['LICENÇA', ['CC BY 4.0']],
  ];
  const s = [];
  let yc = yFim - carimboAltura(fontes);
  const y0 = yc;
  for (const [i, [k, v]] of linhas.entries()) {
    s.push(`<path d="M0 ${yc}H${LP}" stroke="${TINTA}" stroke-width="${i ? 0.8 : 1.6}"/>`);
    s.push(`<text x="0" y="${yc + 28}" font-family="${MONO}" font-size="14" letter-spacing="2" fill="${CINZA}">${tr(k)}</text>`);
    v.forEach((l, j) => s.push(`<text x="138" y="${yc + 28 + j * 22}" font-family="${MONO}" font-size="${largura(l, 16, { mono: true }) > LP - 140 ? 14 : 16}" fill="${TINTA}">${esc(l)}</text>`));
    yc += 22 + v.length * 22;
  }
  s.push(`<path d="M0 ${yc}H${LP}" stroke="${TINTA}" stroke-width="1.6"/>`);
  s.push(molecula(LP - 20, yc - 34, 20));
  return { svg: s.join('\n'), y0 };
}

function blocoEscala(pxKm, y, nota) {
  const { km, px } = escala(pxKm, nota ? 220 : 300);
  const seg = px / 4;
  return `<g transform="translate(0 ${y})">
    <text x="0" y="-18" font-family="${MONO}" font-size="13" letter-spacing="1.5" fill="${CINZA}">${tr('ESCALA GRÁFICA')}</text>
    ${[0, 1, 2, 3].map((i) => `<rect x="${f1(i * seg)}" y="0" width="${f1(seg)}" height="9" fill="${i % 2 ? PAPEL : TINTA}" stroke="${TINTA}" stroke-width="1.1"/>`).join('')}
    ${[0, 2, 4].map((i) => `<text x="${f1(i * seg)}" y="32" text-anchor="middle" font-family="${MONO}" font-size="14">${nf((km / 4) * i)}</text>`).join('')}
    <text x="${f1(px + 16)}" y="9" font-family="${MONO}" font-size="14" fill="${CINZA}">km</text>
    <text x="0" y="54" font-family="${MONO}" font-size="12" fill="${CINZA}">${tr(B.notaEscala)}${nota ? ` · ${tr(nota)}` : ''}</text>
  </g>`;
}

/* ------------------------------------------------------------------ montagem */
function montar(tema, numero, data) {
  const s = [];
  let pxKm;
  if (tema.layout === 'um') {
    const LOC = 280;
    const loc = [MW - LOC - 28, MH - LOC - 28];
    const NB = { w: 90, h: 150 };
    const nor = [MW - 64 - NB.w, 64];
    const reservas = [[loc[0] - 12, loc[1] - 12, MW, MH], [nor[0] - 10, nor[1] - 10, nor[0] + NB.w + 10, nor[1] + NB.h + 10], ...(tema.reservas?.() ?? [])];
    const q = quadroMapa(MW, MH, { ...tema.mapa(), pad: tema.pad ?? 96, reservas, rasterSvg: tema._rasterSvg, rasterRecorte: tema.raster?.recorte });
    pxKm = q.pxKm;
    s.push(`<g transform="translate(${X0} ${Y0})">${q.svg}
${tema.sobreMapa?.(q.proj) ?? ''}
${localizador(loc[0], loc[1], LOC)}
${norteFolha({ cx: nor[0] + NB.w / 2, cy: nor[1] + 30 + 55, altura: 110 })}
${bordas(q.proj, MW, MH, [[loc[0], loc[1], loc[0] + LOC, loc[1] + LOC]])}</g>`);
  } else {
    // Três mapas e um quadro com localização, norte e notas: grade 2 × 2.
    const qw = MW / 2;
    const qh = MH / 2;
    const mapas = tema.mapas();
    const posicoes = [[0, 0], [qw, 0], [0, qh]];
    mapas.forEach((m, i) => {
      const [x, y] = posicoes[i];
      const q = quadroMapa(qw, qh, { pad: 40, rotulosUf: true, tamanhoUf: 12, tamanhoOceano: 15, capitalNome: false, tamanhoEstrela: 0.8, bordaMunicipio: 0.35, bordaRgint: 1, bordaEstado: 2, ...m, reservas: [[0, 0, qw, 70], [0, qh - 96, qw, qh]] });
      pxKm = q.pxKm;
      s.push(`<g transform="translate(${X0 + x} ${Y0 + y})">${q.svg}
<rect x="0" y="0" width="${qw}" height="64" fill="${PAPEL}" fill-opacity=".86"/>
<text x="26" y="42" font-family="${MONO}" font-size="20" letter-spacing="3" fill="${TINTA}">${esc(m.titulo)}</text>
${m.legenda ? `<rect x="0" y="${qh - 92}" width="${qw}" height="92" fill="${PAPEL}" fill-opacity=".86"/><g transform="translate(26 ${qh - 52})">${m.legenda}</g>` : ''}</g>`);
    });
    // Quarto quadro.
    const [x4, y4] = [X0 + qw, Y0 + qh];
    const LOC = 300;
    s.push(`<g transform="translate(${x4} ${y4})"><rect width="${qw}" height="${qh}" fill="${PAPEL}"/>
${localizador(40, 60, LOC)}
${norteFolha({ cx: qw - 110, cy: 60 + 30 + 55, altura: 110 })}
<g transform="translate(40 ${60 + LOC + 56})">${tema.quartoQuadro?.(qw - 80) ?? ''}</g></g>`);
    s.push(`<path d="M${X0 + qw} ${Y0}V${Y0 + MH}M${X0} ${Y0 + qh}H${X0 + MW}" stroke="${TINTA}" stroke-width="1.2"/>`);
  }

  // Painel.
  const p = [];
  const cab = cabecalho(tema, numero);
  p.push(cab.svg);
  let y = cab.y;
  const num = emNumeros(tema.numeros(), y + 16);
  p.push(num.svg);
  y = num.y;
  const extra = tema.painel?.(y) ?? { svg: '', y };
  p.push(extra.svg);
  y = extra.y;
  const fim = MH - 24;
  const c = carimbo(tema, numero, data, fim);
  // Friso da coleção: só quando sobra respiro entre o conteúdo e a escala.
  if (tema.motivo && c.y0 - y > 250) {
    const hM = Math.min(84, c.y0 - y - 196);
    const yM = y + Math.min(60, Math.max(18, (c.y0 - y - 196 - hM) / 2 + 18));
    p.push(`<g transform="translate(0 ${f1(yM)})">${motivo(tema.motivo, LP, hM)}</g>`);
    y = yM + hM;
  }
  const yEsc = y + Math.max(10, (c.y0 - y - 110) / 2) + 46;
  p.push(blocoEscala(pxKm, yEsc, tema.layout === 'um' ? '' : 'a mesma nos três mapas'));
  p.push(c.svg);
  const sobra = c.y0 - (yEsc + 70);
  if (sobra < 0) console.warn(`aviso: painel sem folga (${f1(sobra)} px)`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<title>${esc(`${tema.titulo()} — ${tema.subtitulo()}`)}</title>
<rect width="${W}" height="${H}" fill="${PAPEL}"/>
${s.join('\n')}
<rect x="${M}" y="${M}" width="${W - 2 * M}" height="${H - 2 * M}" fill="none" stroke="${TINTA}" stroke-width="3"/>
<rect x="${X0}" y="${Y0}" width="${W - 2 * X0}" height="${MH}" fill="none" stroke="${TINTA}" stroke-width="1.2"/>
<path d="M${PX} ${Y0}V${Y0 + MH}" stroke="${TINTA}" stroke-width="1.2"/>
${microtexto(ASSINATURA, { x: X0, y: M + 8.6, comprimento: W - 2 * X0 })}
${microtexto(tr('O ESSENCIAL É INVISÍVEL AOS OLHOS'), { x: X0, y: H - M - 4.6, comprimento: W - 2 * X0 })}
<g transform="translate(${PX + 32} ${Y0})" fill="${TINTA}">${p.join('\n')}</g>
</svg>`;
}

/* ------------------------------------------------------------------ figura (reuso) */
const FW = 2400;
const FH = 1600;
const FAIXA = 46;
// Texto escrito sobre o mapa (legenda, escala, crédito) leva um contorno da cor do papel por baixo.
const HALO = `<style>.halo text { stroke: ${PAPEL}; stroke-width: 5px; stroke-linejoin: round; paint-order: stroke; }</style>`;
const ESCALA_LEGENDA = 1.5; // a legenda da figura sai maior que a da prancha, para ler no slide e no artigo
const G4 = 12; // fio de papel entre os três mapas da figura de layout 'quatro'
const ESCALA_LEGENDA4 = 1.15;

/**
 * Quadro do mapa na figura de layout 'um'. Por padrão, 3:2 com folga. Nos recortes regionais (usarRegiao),
 * cujo contexto e cuja grade raster só cobrem o quadro da prancha, o mapa mantém a proporção desse quadro
 * e a legenda vai para uma coluna à direita, como na série dos estados.
 */
function quadroFigura(tema) {
  const h = FH;
  if (B.regional || tema.raster?.recorte === 'quadro') return { w: Math.round((h * MW) / MH), h, pad: tema.pad ?? 56, coluna: true };
  return { w: FW, h, pad: 56, coluna: false };
}

/** Escala gráfica curta, de duas casas, com o comprimento à direita. */
function escalaCurta(pxKm, x, y, alvoPx = 160, { ateX = Infinity, corpo = 14 } = {}) {
  // Escala de figura: aceita também 1, 2 e 5 km, para não passar de ~1,5 × o alvo nos recortes pequenos.
  const bons = [1, 2, 5, 10, 20, 25, 50, 75, 100, 150, 200, 250, 300, 400, 500, 750, 1000];
  const km = bons.reduce((a, b) => (Math.abs(b - alvoPx / pxKm) < Math.abs(a - alvoPx / pxKm) ? b : a));
  const px = km * pxKm;
  // Nos cantos da direita, a escala não passa da borda (o rótulo «NNN km» ocupa uns 70 px).
  x = Math.min(x, ateX - px - 80);
  return `<g transform="translate(${f1(x)} ${f1(y)})">
  ${[0, 1].map((i) => `<rect x="${f1((i * px) / 2)}" y="0" width="${f1(px / 2)}" height="7" fill="${i ? PAPEL : TINTA}" stroke="${TINTA}" stroke-width="1"/>`).join('')}
  <text x="${f1(px + 12)}" y="8" font-family="${MONO}" font-size="${corpo}" fill="${TINTA}">${nf(km)} km</text>
</g>`;
}

/** Norte de figura: seta simples, metade cheia, com o N em cima; (cx, cy) é o centro da seta. */
function norteSimples(cx, cy, h = 64) {
  const [m, b] = [h / 2, h * 0.22];
  return `<g transform="translate(${f1(cx)} ${f1(cy)})" stroke="${TINTA}" stroke-width="1.2" stroke-linejoin="round">
  <path d="M0 ${-m}L${b} ${m}L0 ${m * 0.62}Z" fill="${PAPEL}"/>
  <path d="M0 ${-m}L${-b} ${m}L0 ${m * 0.62}Z" fill="${TINTA}"/>
  <text x="0" y="${-m - 10}" text-anchor="middle" font-family="${MONO}" font-size="20" stroke="none" fill="${TINTA}">N</text>
</g>`;
}

/** Linha de crédito: fontes à esquerda; mapa, autor, licença e endereço à direita. Devolve { svg(y), h }. */
function credito(tema, numero, data, { pasta, doi }, w) {
  const fonte = `${tr('Fonte')}: ${tema.fontes().join(' · ')}`;
  const onde = doi ? `doi.org/${doi}` : `aikiesan.github.io/essencial-geo/${LINGUA === 'en' ? 'en/maps' : 'mapas'}/${pasta}`;
  const mapa = `${tr('Mapa')}: Essencial ${tr('Nº')} ${String(numero).padStart(3, '0')} · Cerejo, L. N. (${data.getUTCFullYear()}) · CC BY 4.0 · ${onde}`;
  let t = 16;
  while (t > 12 && largura(fonte, t, { mono: true }) + largura(mapa, t, { mono: true }) > w - 120) t -= 1;
  // Ainda longa demais: as fontes sobem para uma linha própria.
  const duas = largura(fonte, t, { mono: true }) + largura(mapa, t, { mono: true }) > w - 120;
  // Escrito sobre o próprio mapa, com halo da cor do papel: faz parte da imagem, não de uma faixa à parte.
  const [lf, lm] = [largura(fonte, t, { mono: true }), largura(mapa, t, { mono: true })];
  return {
    h: duas ? FAIXA + 20 : FAIXA,
    /** Retângulos ocupados pelas duas linhas de texto, com a faixa começando em y. */
    caixas: (y) => [[32, y + (duas ? 24 : 29) - t - 4, 48 + lf, y + (duas ? 24 : 29) + 6], [w - 48 - lm, y + (duas ? 46 : 29) - t - 4, w - 32, y + (duas ? 46 : 29) + 6]],
    svg: (y, { fundo = false } = {}) => `${fundo ? [[40, y + (duas ? 24 : 29), largura(fonte, t, { mono: true })], [w - 40 - largura(mapa, t, { mono: true }), y + (duas ? 46 : 29), largura(mapa, t, { mono: true })]]
      .map(([x0, yb, lw]) => `<rect x="${f1(x0 - 8)}" y="${f1(yb - t - 3)}" width="${f1(lw + 16)}" height="${t + 10}" rx="3" fill="${PAPEL}" fill-opacity="0.8"/>`).join('') : ''}
<g class="halo" font-family="${MONO}" font-size="${t}">
<text x="40" y="${y + (duas ? 24 : 29)}" fill="${TINTA}" fill-opacity="0.75">${esc(fonte)}</text>
<text x="${w - 40}" y="${y + (duas ? 46 : 29)}" text-anchor="end" fill="${TINTA}">${esc(mapa)}</text></g>`,
  };
}

/**
 * Figura para reuso (artigo, aula, apresentação): só o mapa, a legenda, a escala e a linha de crédito, sem
 * moldura, graticulado, coordenadas, localizador, norte, chamadas ou painel (docs/ESTILO.md «Figura»).
 * Layout 'um': a legenda vem de `tema.legendaFigura()` → { svg, altura, largura, canto? ('sw' | 'se' | 'nw' | 'ne') },
 * desenhada a partir de y = 0 (a linha de base do título da legenda). `tema.sobreMapaFigura === false` deixa de
 * fora o desenho de `sobreMapa` (quando ele é anotação, não dado). Layout 'quatro': os três mapas lado a lado,
 * cada um com o título e a legenda que já tem; o quarto quadro (notas) fica só na prancha.
 */
function montarFigura(tema, numero, data, ref, { semBase = false } = {}) {
  const limpo = { graticulado: false, chamadas: [], destaques: [], semBase };
  // Fundo que a legenda põe sobre o contexto (data-fundo): sem mapa de base, não há o que esconder.
  const legenda = (svg) => (semBase ? svg.replace(/<rect data-fundo="1"[^>]*\/>/g, '') : svg);
  if (tema.layout === 'quatro') {
    // Cada mapa é desenhado no mesmo quadro da prancha (as grades raster que o tema já amostrou nele
    // continuam alinhadas) e a figura mostra só a janela em volta do estado.
    // Título, legenda, escala e crédito vão dentro das janelas, sobre o fundo do mapa.
    const [qw, qh] = [MW / 2, MH / 2];
    const mapas = tema.mapas();
    const medidas = tema._medidas4 ?? [];
    const S4 = ESCALA_LEGENDA4;
    const pad = mapas[0].pad ?? 40;
    const { path } = projetar(qw, qh, pad);
    const [[, b0], [, b1]] = path.bounds(B.enquadrar ?? B.limite);
    const largTotal = 3 * qw + 2 * G4;
    const cr = credito(tema, numero, data, ref, largTotal);
    const topo = Math.max(0, Math.floor(b0 - 76));
    const legMax = Math.max(60, ...medidas.map((md) => (md ? md.altura - md.topo : 0))) * S4;
    const hj = Math.min(qh, Math.ceil(b1 + 24 + legMax + 28 + cr.h)) - topo;
    const altura = hj;
    const base = altura - cr.h;
    const fora = [[0, 0, qw, topo], [0, topo + hj, qw, qh]];
    const sistema = B.carimbo();
    const s = [];
    let pxKm;
    mapas.forEach((m, i) => {
      const md = medidas[i] ?? { topo: -20, altura: 60, largura: 360 };
      const yLeg = base - md.altura * S4 - 20;
      const caixaLeg = [0, topo + yLeg + md.topo * S4 - 16, 36 + md.largura * S4 + 20, topo + base];
      const ultimo = i === mapas.length - 1;
      const extra = ultimo ? [[qw - 340, topo + base - 96, qw, topo + base], [qw - 80, topo, qw, topo + 120]] : [];
      const q = quadroMapa(qw, qh, { pad: 40, rotulosUf: true, tamanhoUf: 12, tamanhoOceano: 15, capitalNome: false, tamanhoEstrela: 0.8, bordaMunicipio: 0.35, bordaRgint: 1, bordaEstado: 2, ...m, ...limpo, reservas: [...fora, [0, topo, qw, topo + 64], caixaLeg, ...extra] });
      pxKm = q.pxKm;
      const longo = largura(m.titulo, 20, { mono: true, espaco: 3 }) > qw - 72;
      s.push(`<g transform="translate(${f1(i * (qw + G4))} 0)">
<defs><clipPath id="jan${i}"><rect y="${topo}" width="${qw}" height="${hj}"/></clipPath></defs>
<g transform="translate(0 ${-topo})" clip-path="url(#jan${i})">${q.svg}</g>
<g class="halo"><text x="36" y="44" font-family="${MONO}" font-size="${longo ? 16 : 20}" letter-spacing="${longo ? 1.5 : 3}" fill="${TINTA}">${esc(m.titulo)}</text></g>
${m.legenda ? `<g class="halo" transform="translate(36 ${f1(yLeg)}) scale(${S4})" fill="${TINTA}">${legenda(m.legenda)}</g>` : ''}</g>`);
    });
    s.push(`<g class="halo">${escalaCurta(pxKm, Infinity, base - 80, 160, { ateX: largTotal - 36, corpo: 18 })}
${sistema.map((t, k) => `<text x="${largTotal - 36}" y="${base - 40 + 20 * k}" text-anchor="end" font-family="${MONO}" font-size="14" fill="${TINTA}" fill-opacity="0.75">${esc(t)}</text>`).join('')}</g>
<g class="halo">${norteSimples(largTotal - 60, 74, 56)}</g>`);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${largTotal}" height="${altura}" viewBox="0 0 ${largTotal} ${altura}">
<title>${esc(`${tema.titulo()} — ${tema.subtitulo()}`)}</title>
${HALO}
<rect width="${largTotal}" height="${altura}" fill="${PAPEL}"/>
${s.join('\n')}
${cr.svg(base)}
</svg>`;
  }
  // Legenda, escala e crédito ficam DENTRO do quadro do mapa (sobre o fundo dele), como a atribuição da Esri:
  // recortar a figura para tirar o crédito corta o mapa junto. O canto da legenda e o retângulo em que o mapa
  // se ajusta vêm de enquadrarFigura, calculado em gerarFigura antes da amostragem do raster.
  const leg = tema.legendaFigura();
  const S = ESCALA_LEGENDA;
  const E = tema._enquadramento ?? enquadrarFigura(tema, leg, (w) => credito(tema, numero, data, ref, w), { semBase });
  const { largTotal, altura, base, x, yLeg, yEsc, ySis, caixa, nx, coluna, sobreposto, cr } = E;
  const sistema = B.carimbo();
  const mapa = tema.mapa();
  const q = quadroMapa(largTotal, altura, { ...mapa, pad: E.pad, extensao: E.extensao, ...limpo, reservas: [caixa, E.norte], rasterSvg: tema._rasterSvg, rasterRecorte: tema.raster?.recorte });
  // Linhas e pontos de fora do recorte (rede elétrica, gasodutos…) que passam sob a legenda: ela ganha o fundo de papel.
  const naCaixa = ([lon, lat]) => {
    const [px, py] = q.proj([lon, lat]) ?? [-1, -1];
    return px > caixa[0] && px < caixa[2] && py > caixa[1] && py < caixa[3];
  };
  const vertices = (g) => (g.type === 'LineString' ? g.coordinates : g.type === 'MultiLineString' ? g.coordinates.flat() : g.type === 'Point' ? [g.coordinates] : []);
  const cruza = !semBase && ((mapa.linhas ?? []).some((c) => c.feats.some((f) => vertices(f.geometry).some(naCaixa))) || (mapa.pontos ?? []).some((pt) => naCaixa(pt.coord)));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${largTotal}" height="${altura}" viewBox="0 0 ${largTotal} ${altura}">
<title>${esc(`${tema.titulo()} — ${tema.subtitulo()}`)}</title>
${HALO}
<rect width="${largTotal}" height="${altura}" fill="${PAPEL}"/>
${q.svg}
${tema.sobreMapaFigura === false ? '' : semBase ? `<defs><clipPath id="sobreLimite"><path d="${geoPath(q.proj).digits(1)(B.limite)}"/></clipPath></defs><g clip-path="url(#sobreLimite)">${tema.sobreMapa?.(q.proj) ?? ''}</g>` : (tema.sobreMapa?.(q.proj) ?? '')}
${sobreposto || cruza ? `<rect x="${f1(caixa[0])}" y="${f1(caixa[1])}" width="${f1(caixa[2] - caixa[0])}" height="${f1(caixa[3] - caixa[1])}" rx="4" fill="${PAPEL}" fill-opacity="0.88"/>` : ''}
<g class="halo" transform="translate(${f1(x)} ${f1(yLeg)}) scale(${S})" fill="${TINTA}">${legenda(leg.svg)}</g>
<g class="halo">${escalaCurta(q.pxKm, x, yEsc, 200, { ateX: largTotal - 40, corpo: 20 })}
${sistema.map((t, k) => `<text x="${f1(x)}" y="${ySis + 20 * k}" font-family="${MONO}" font-size="15" fill="${TINTA}" fill-opacity="0.75">${esc(t)}</text>`).join('')}</g>
<g class="halo">${norteSimples(nx, 105)}</g>
${cr.svg(base, { fundo: coluna && !semBase })}
</svg>`;
}

/**
 * Enquadramento da figura de layout 'um': escolhe o canto da legenda e o retângulo em que o mapa se ajusta
 * para que o bloco (legenda, escala, sistema), o norte e o crédito não caiam sobre o recorte (o estado, a
 * região). Testa os quatro cantos com o mapa na folga padrão; se todos cobrem o recorte, encolhe o retângulo
 * do lado do canto, aos poucos, e fica com o maior mapa que sai livre. Nos recortes regionais o contexto só
 * cobre a vizinhança: o quadro também pode alargar (até 3:2), abrindo espaço ao lado, e um quadro só vale se
 * o contexto ainda o preenche até a borda. Os recortes com raster no quadro inteiro (relevo) não mudam: vale o
 * canto que menos cobre, e a legenda ganha um fundo de papel. `fazCredito(w)` devolve a linha de crédito.
 */
function enquadrarFigura(tema, leg, fazCredito, { semBase = false } = {}) {
  const S = ESCALA_LEGENDA;
  const { w, h: altura, pad, coluna } = quadroFigura(tema);
  const [lw, lh] = [leg.largura * S, leg.altura * S];
  const topo = (leg.topo ?? -24) * S; // o título da legenda sobe acima da linha de base y = 0
  const sis = B.carimbo(); // «SIRGAS 2000 · projeção» e «λ₀ · φ₀», em duas linhas
  const bloco = Math.max(lw, 300, ...sis.map((t) => largura(t, 15, { mono: true })));
  const posicao = (canto, largTotal, base) => {
    const x = canto.endsWith('w') ? 40 : largTotal - 40 - bloco;
    // De cima para baixo: legenda (lh), escala (+28), sistema (+36 e +20).
    const yLeg = canto.startsWith('s') ? base - 40 - 20 - 36 - 28 - lh : 72 - topo;
    const yEsc = yLeg + lh + 28;
    const ySis = yEsc + 36;
    const caixa = [x - 28, yLeg + topo - 24, x + bloco + 28, ySis + 20 + 16];
    const nx = canto === 'ne' ? 80 : largTotal - 80;
    return { canto, x, yLeg, yEsc, ySis, caixa, nx, norte: [nx - 40, 40, nx + 40, 150] };
  };
  // Quantos pontos de uma grade sobre as caixas caem dentro do recorte.
  const cobertura = (proj, caixas) => {
    let n = 0;
    for (const [x0, y0, x1, y1] of caixas) {
      for (let i = 0; i <= 14; i++) {
        for (let j = 0; j <= 14; j++) {
          const ll = proj.invert([x0 + ((x1 - x0) * i) / 14, y0 + ((y1 - y0) * j) / 14]);
          if (ll && geoContains(B.limite, ll)) n++;
        }
      }
    }
    return n;
  };
  // Recortes regionais: o contexto (municípios vizinhos) chega até a borda do quadro?
  const terra = B.regional ? B.terra.map((f) => ({ f, b: geoBounds(f) })) : [];
  const emTerra = ([lon, lat]) => terra.some(({ f, b: [[l0, p0], [l1, p1]] }) => lon >= l0 && lon <= l1 && lat >= p0 && lat <= p1 && geoContains(f, [lon, lat]));
  const preenche = (proj, lt) => {
    for (let k = 0; k <= 8; k++) {
      for (const pt of [[(lt * k) / 8, 2], [(lt * k) / 8, altura - 2], [2, (altura * k) / 8], [lt - 2, (altura * k) / 8]]) {
        const ll = proj.invert(pt);
        if (!ll || !emTerra(ll)) return false;
      }
    }
    return true;
  };
  const fixo = coluna && !semBase && !(B.regional && tema.raster?.recorte !== 'quadro');
  const preferido = leg.canto ?? (coluna ? 'ne' : 'sw');
  const cantos = [preferido, ...['sw', 'se', 'nw', 'ne'].filter((c) => c !== preferido)];
  // Larguras: a do quadro e, nos regionais, mais largas até 3:2.
  const larguras = coluna && !fixo ? [w, ...[0.25, 0.5, 0.75, 1].map((f) => Math.round(w + f * (FW - w))).filter((l) => l > w)] : [coluna ? w : FW];
  const creditos = new Map(larguras.map((l) => [l, fazCredito(l)]));
  const candidatos = [];
  for (const largTotal of larguras) {
    const cr = creditos.get(largTotal);
    const base = altura - cr.h;
    for (const c of cantos) {
      const P = posicao(c, largTotal, base);
      // O mapa fica com a escala do quadro original; a sobra vai para o lado da legenda.
      const folga = largTotal - (coluna ? w : FW);
      const padrao = c.endsWith('w') ? [[pad + folga, pad], [largTotal - pad, altura - pad]] : [[pad, pad], [largTotal - pad - folga, altura - pad]];
      const exts = [padrao];
      if (!fixo) {
        const [bw, bh] = [P.caixa[2] - P.caixa[0] + 24, P.caixa[3] - P.caixa[1] + 24];
        const [[x0, y0], [x1, y1]] = padrao;
        for (const f of [0.2, 0.4, 0.6, 0.8, 1]) {
          if (!folga) exts.push(c.endsWith('w') ? [[x0 + f * bw, y0], [x1, y1]] : [[x0, y0], [x1 - f * bw, y1]]);
          exts.push(c.startsWith('s') ? [[x0, y0], [x1, y1 - f * bh]] : [[x0, y0 + f * bh], [x1, y1]]);
        }
      }
      for (const ext of exts) {
        const proj = B.projecao().fitExtent(ext, B.enquadrar ?? B.limite);
        const original = largTotal === larguras[0] && ext === padrao;
        if (coluna && !semBase && !original && !preenche(proj, largTotal)) continue;
        candidatos.push({ ...P, largTotal, base, cr, extensao: original ? undefined : ext, cobre: cobertura(proj, [P.caixa, P.norte, ...cr.caixas(base)]), cobreLegenda: cobertura(proj, [P.caixa]), escala: proj.scale() });
      }
    }
  }
  // Sem cobrir nada, o maior mapa (no empate, o quadro mais estreito e o canto preferido, que vêm primeiro);
  // senão, o que menos cobre.
  const livres = candidatos.filter((k) => k.cobre === 0);
  const melhor = livres.length
    ? livres.reduce((m, k) => (k.escala > m.escala * 1.0001 ? k : m))
    : candidatos.reduce((m, k) => (k.cobre < m.cobre ? k : m));
  return { ...melhor, altura, pad, coluna, sobreposto: melhor.cobreLegenda > 0 };
}

/**
 * Caixa real da legenda (os temas declaram altura e largura à mão, e às vezes sobra ou falta): rasteriza o SVG
 * dela sozinho e procura os pixels pintados. Devolve { topo, altura, largura } em unidades da legenda, com y = 0
 * na linha de base do título.
 */
async function medirLegenda(svg) {
  const [M, L] = [80, 1600];
  const doc = `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${L}"><g transform="translate(${M} ${M})" fill="${TINTA}">${svg}</g></svg>`;
  const { data, info } = await sharp(Buffer.from(doc), { density: 72 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let [x1, y0, y1] = [-1, L, -1];
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * 4 + 3] < 8) continue;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  return y1 < 0 ? null : { topo: y0 - M, altura: y1 - M + 1, largura: x1 - M + 1 };
}

const temFigura = (tema) => tema.layout === 'quatro' || typeof tema.legendaFigura === 'function';

/**
 * Grava mapa_figura(.en).png na pasta do mapa e dados/<base>_figura(.en).svg (anexo de release), e a variante sem
 * mapa de base (só o recorte, sobre papel): mapa_figura_sem_base(.en).png e dados/<base>_figura_sem_base(.en).svg.
 */
async function gerarFigura({ pasta, base, numero, data, fazerTema }) {
  const destino = join(RAIZ, 'mapas', pasta);
  const dia = new Date(`${data}T12:00:00Z`);
  const leia = await readFile(join(destino, 'README.md'), 'utf8').catch(() => '');
  const doi = leia.match(/^doi:\s*["']?(10\.[^\s"']+)/m)?.[1] ?? null;
  const imagens = new Map(); // grade raster por quadro (largura × retângulo do mapa)
  for (const l of ['pt', 'en']) {
    LINGUA = l;
    uid = 0;
    const tema = fazerTema(l);
    if (!temFigura(tema)) {
      console.warn(`aviso: Nº ${numero} sem legendaFigura(); figura não gerada`);
      LINGUA = 'pt';
      return false;
    }
    let legMedida = null;
    if (tema.layout !== 'quatro') {
      const leg = tema.legendaFigura();
      const medida = await medirLegenda(leg.svg);
      legMedida = { ...leg, ...(medida ?? {}) };
      tema.legendaFigura = () => legMedida;
    } else {
      tema._medidas4 = await Promise.all(tema.mapas().map((m) => (m.legenda ? medirLegenda(m.legenda) : null)));
    }
    const suf = l === 'en' ? '.en' : '';
    await mkdir(join(destino, 'dados'), { recursive: true });
    for (const semBase of [false, true]) {
      if (legMedida) {
        // Sem base, o quadro é o mesmo da figura com base; só muda se lá a legenda teve de ficar sobre o recorte.
        const comBase = semBase ? tema._enquadramento : null;
        tema._enquadramento = comBase && !comBase.sobreposto ? comBase : enquadrarFigura(tema, legMedida, (w) => credito(tema, numero, dia, { pasta, doi }, w), { semBase });
        // A figura tem outro quadro: a grade raster é amostrada de novo, na projeção dela (uma vez por quadro).
        if (tema.raster) {
          const E = tema._enquadramento;
          const chave = JSON.stringify([E.largTotal, E.extensao ?? null]);
          if (!imagens.has(chave)) {
            const { proj, pxKm } = projetar(E.largTotal, E.altura, E.pad, E.extensao);
            const fator = tema.raster.fator ?? 2;
            imagens.set(chave, await imagemRaster(tema.raster.r, proj, E.largTotal, E.altura, { ...tema.raster, fator, metros: 1000 / (pxKm * fator) }));
          }
          tema._rasterSvg = imagens.get(chave);
        }
      }
      const svg = montarFigura(tema, numero, dia, { pasta, doi }, { semBase });
      const nome = semBase ? '_figura_sem_base' : '_figura';
      await writeFile(join(destino, 'dados', `${base}${nome}${suf}.svg`), svg);
      await sharp(Buffer.from(svg), { density: 72, limitInputPixels: false }).png({ compressionLevel: 9, palette: true, quality: 95, dither: 0 }).toFile(join(destino, `mapa${nome}${suf}.png`));
    }
  }
  LINGUA = 'pt';
  console.log(`✓ figura Nº ${numero} · ${pasta}`);
  return true;
}

/**
 * Gera a prancha e a figura nas duas línguas: mapa_preview(.en).png e mapa_figura(.en).png na pasta do mapa,
 * dados/<base>_prancha(.en).svg e dados/<base>_figura(.en).svg (anexos de release). `fazerTema(lingua)` devolve
 * o tema. Com SO_FIGURA=1 no ambiente, refaz só a figura e devolve os tamanhos da prancha já gravada.
 */
export async function gerarPrancha({ pasta, base, numero, data, fazerTema }) {
  const destino = join(RAIZ, 'mapas', pasta);
  if (process.env.SO_FIGURA) {
    const ok = await gerarFigura({ pasta, base, numero, data, fazerTema });
    if (!ok) process.exitCode = 1;
    const tamanhos = {};
    for (const [l, suf] of [['pt', ''], ['en', '.en']]) {
      const svg = await stat(join(destino, 'dados', `${base}_prancha${suf}.svg`)).catch(() => null);
      const png = await stat(join(destino, `mapa_preview${suf}.png`)).catch(() => null);
      if (svg && png) tamanhos[l] = { svg: svg.size, png: png.size };
    }
    return tamanhos;
  }
  await mkdir(join(destino, 'dados'), { recursive: true });
  const dia = new Date(`${data}T12:00:00Z`);
  const tamanhos = {};
  let imagem = null;
  for (const l of ['pt', 'en']) {
    LINGUA = l;
    uid = 0;
    const tema = fazerTema(l);
    // A grade raster não muda com a língua: amostrada uma vez, na projeção do quadro grande.
    if (tema.raster && !imagem) {
      const { proj, pxKm } = projetar(MW, MH, tema.pad ?? 96);
      const fator = tema.raster.fator ?? 2;
      imagem = await imagemRaster(tema.raster.r, proj, MW, MH, { ...tema.raster, fator, metros: 1000 / (pxKm * fator) });
    }
    if (imagem) tema._rasterSvg = imagem;
    const svg = montar(tema, numero, dia);
    const suf = l === 'en' ? '.en' : '';
    const arqSvg = join(destino, 'dados', `${base}_prancha${suf}.svg`);
    await writeFile(arqSvg, svg);
    const png = join(destino, `mapa_preview${suf}.png`);
    await sharp(Buffer.from(svg), { density: 72, limitInputPixels: false }).png({ compressionLevel: 9, palette: true, quality: 95, dither: 0 }).toFile(png);
    tamanhos[l] = { svg: (await stat(arqSvg)).size, png: (await stat(png)).size };
  }
  LINGUA = 'pt';
  await gerarFigura({ pasta, base, numero, data, fazerTema });
  console.log(`✓ Nº ${numero} · ${pasta} · PNG ${(tamanhos.pt.png / 1e6).toFixed(2)} MB · SVG ${(tamanhos.pt.svg / 1e6).toFixed(2)} MB`);
  return tamanhos;
}
