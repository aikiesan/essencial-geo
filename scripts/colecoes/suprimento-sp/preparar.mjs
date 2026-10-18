#!/usr/bin/env node
/**
 * Coleção «Bacias de suprimento» (suprimento-sp) — prepara os dados das pranchas 085 a 088 (uso interno).
 *
 *   node --max-old-space-size=8192 scripts/colecoes/suprimento-sp/preparar.mjs
 *
 * Adapta ao estado de São Paulo duas leituras de oferta de biomassa: as curvas de oferta por condado do
 * Billion-Ton Report (US DOE) e o custo × oferta do S2Biom (UE). O potencial é o do CP2B v5.1 (Unicamp),
 * cenário de referência, nível N4 (acessível), em m³ de biometano equivalente por dia, por município e resíduo.
 *
 * 1. Grade dasimétrica: o potencial de cada resíduo é espalhado, dentro do município, sobre os pixels de
 *    120 m do uso da terra que o produzem (MapBiomas Coleção 10, 2024; grade da coleção agro-sp): cana sobre
 *    cana, palha de milho e soja sobre lavouras temporárias, bagaço de laranja sobre citros, casca de café
 *    sobre café, dejetos sobre pastagem e mosaico de usos, lixo, poda e lodo sobre a área urbanizada. Se o
 *    município não tem a classe, o resíduo vai por igual sobre todo o município. Os pixels são somados em
 *    células de 10 × 10 pixels (0,0108°, cerca de 1,1 km).
 * 2. Alcance (085): para cada célula, a soma do potencial das células cujo centro está a até 30 km em linha
 *    reta. Só entra potencial paulista: o CP2B não cobre os outros estados.
 * 3. Curva de oferta (086): potencial acumulado pela distância em linha reta do centro da célula ao ponto de
 *    entrega de gás existente mais próximo (EPE, via MapBiomas), também na rede do outro lado da divisa.
 * 4. Bacias (087): cada célula vai para o ponto de entrega (e, à parte, para a subestação da rede básica) mais
 *    próximo; os polígonos do GPKG são as células de Voronoi desses pontos, recortadas no limite do estado.
 * 5. Disputa (088): plantas de biometano da ANP (abril de 2026) e geração distribuída a biogás da ANEEL
 *    (outubro de 2026), no ponto interno do município, como na prancha 059; quantos municípios com usina
 *    alcançam cada célula num raio de 30 km.
 *
 * As distâncias usam a projeção local equirretangular de lib/dados.mjs. Nada aqui estima potencial novo:
 * só distribui, soma e mede o do CP2B.
 */
import { join } from 'node:path';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { RAIZ, CACHE, linhasCsv, lerCsv, lerShp, gravarCache, gravarGpkg, gravarCsv, zipar, tamanho, mb, kb, soma, simplificar, caixa, dentro, pontoInterno, rasterizar, poligonos } from '../lib/dados.mjs';
import { NOME_MUN, SP, DADOS_CP2B, GRUPO_SUBSTRATO, malhaMunicipios, camadasReferencia, cp2b } from '../lib/cruzamentos.mjs';
import { lerRaster } from '../lib/raster.mjs';
import { estiloGraduado, estiloRegras, estiloLinha, marcador, preenchimento } from '../lib/estilos-qgis.mjs';

const SERIE = JSON.parse(readFileSync(join(RAIZ, 'scripts', 'colecoes', 'suprimento-sp', 'serie.json'), 'utf8'));
const pasta = (tema) => join(RAIZ, 'mapas', SERIE.find((s) => s.tema === tema).pasta, 'dados');
const INFRA = join(DADOS_CP2B, 'shapefiles', 'mapbiomas_infra');
const ANP = 'A:/Pilar-2b/analysis/data/05c_anp_biometano_plants_latest.csv';
const ANEEL_GD = join(RAIZ, 'scripts', 'colecoes', 'cache', 'downloads', 'aneel_gd', 'empreendimento-geracao-distribuida.csv');

export const RAIO_KM = 30;
/** Grupos de resíduo: chave, rótulo, rótulo EN, cor (linhas e barras). */
export const GRUPOS = [
  ['cana', 'cana-de-açúcar', 'sugarcane', '#5b7f3a'],
  ['lavouras', 'outras lavouras', 'other crops', '#c99a2e'],
  ['pecuaria', 'dejetos animais', 'animal manure', '#9c4a32'],
  ['urbano', 'lixo, poda e esgoto', 'waste, pruning and sewage', '#234e70'],
];
const G = GRUPOS.map(([k]) => k);
/** Classes do MapBiomas que recebem cada resíduo (distribuição dasimétrica). */
const ALVOS = [
  ['cana', [20], 'cana'],
  ['temporarias', [39, 40, 41, 62], 'lavouras'],
  ['citros', [47], 'lavouras'],
  ['cafe', [46], 'lavouras'],
  ['pasto', [15, 21], 'pecuaria'],
  ['urbano', [24], 'urbano'],
];
const ALVO_SUBSTRATO = {
  PALHA: 'cana', BAGACO: 'cana', TORTA_FILTRO: 'cana', VINHACA: 'cana',
  PALHA_MILHO: 'temporarias', PALHA_SOJA: 'temporarias', BAGACO_CITROS: 'citros', CASCA_CAFE: 'cafe',
  AVES_CORTE: 'pasto', AVES_POSTURA: 'pasto', BOV_LEITE: 'pasto', BOV_CONFINADO: 'pasto', BOV_PASTO_MISTO: 'pasto', SUINOS: 'pasto',
  RSU_ORGANICO: 'urbano', PODA_URBANA: 'urbano', LODO_ETE: 'urbano',
};
const F = 10; // pixels do MapBiomas por lado da célula
const KM_LAT = 110.574;
const KM_LON = (lat) => 111.32 * Math.cos((lat * Math.PI) / 180);

const r0 = (v) => Math.round(v);
const r1 = (v) => Math.round(v * 10) / 10;
const r4 = (v) => Math.round(v * 1e4) / 1e4;
const semAcento = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z ]/g, ' ').replace(/\s+/g, ' ').trim();
const t0 = Date.now();
const maxDe = (xs, f) => { let m = -Infinity; for (const x of xs) { const v = f(x); if (v > m) m = v; } return m; };
const log = (m) => console.log(`[${((Date.now() - t0) / 1000).toFixed(1)} s] ${m}`);

/* ------------------------------------------------------------------ 1. grade dasimétrica */
const malha = malhaMunicipios();
const CDS = malha.map((f) => String(f.properties.CD_MUN));
const nM = CDS.length;
const cp = await cp2b();
const mbr = await lerRaster('grade-agro-sp-tabuleiro').catch(() => {
  throw new Error('falta scripts/colecoes/cache/grade-agro-sp-tabuleiro.bin: rode antes o tema «tabuleiro» de scripts/colecoes/agro-sp/preparar.py');
});
const { largura: NX, altura: NY, x0: X0, y0: Y0, dx: DX, dy: DY } = mbr.meta;
const classe = mbr.dados;
const munPx = new Uint16Array(NX * NY);
malha.forEach((f, i) => rasterizar({ largura: NX, altura: NY, x0: X0, y0: Y0, dx: DX, dy: DY, dados: munPx }, f.geometry, i + 1));
log(`municípios na grade de ${NX} × ${NY}`);

const NA = ALVOS.length;
const alvoDe = new Int8Array(256).fill(-1);
ALVOS.forEach(([, cods], t) => cods.forEach((c) => { alvoDe[c] = t; }));
const cont = new Float64Array(nM * (NA + 1));
for (let p = 0; p < NX * NY; p++) {
  const m = munPx[p];
  if (!m) continue;
  const b = (m - 1) * (NA + 1);
  cont[b + NA]++;
  const t = alvoDe[classe[p]];
  if (t >= 0) cont[b + t]++;
}
// Taxas por pixel: potencial do resíduo ÷ pixels da classe-alvo no município (ou ÷ todos os pixels).
const gDoAlvo = ALVOS.map(([, , g]) => G.indexOf(g));
const taxaAlvo = new Float64Array(nM * NA);
const taxaTodos = new Float64Array(nM * G.length);
const semClasse = Object.fromEntries(G.map((g) => [g, 0]));
for (let m = 0; m < nM; m++) {
  const c = cp.get(CDS[m]);
  if (!c) continue;
  const b = m * (NA + 1);
  if (!cont[b + NA]) throw new Error(`município sem pixel: ${CDS[m]}`);
  for (const [s, alvo] of Object.entries(ALVO_SUBSTRATO)) {
    const v = c[s] ?? 0;
    if (!v) continue;
    const t = ALVOS.findIndex(([k]) => k === alvo);
    if (cont[b + t]) taxaAlvo[m * NA + t] += v / cont[b + t];
    else { taxaTodos[m * G.length + G.indexOf(GRUPO_SUBSTRATO[s])] += v / cont[b + NA]; semClasse[GRUPO_SUBSTRATO[s]] += v; }
  }
}
const NXC = Math.ceil(NX / F), NYC = Math.ceil(NY / F), NC = NXC * NYC;
const DXC = DX * F, DYC = DY * F;
const pot = G.map(() => new Float64Array(NC));
const nPx = new Uint16Array(NC);
const munC = new Uint16Array(NC);
for (let j = 0; j < NY; j++) {
  const cj = Math.floor(j / F);
  for (let i = 0; i < NX; i++) {
    const p = j * NX + i;
    const m = munPx[p];
    if (!m) continue;
    const c = cj * NXC + Math.floor(i / F);
    nPx[c]++;
    if (!munC[c] || (i % F === F / 2 && j % F === F / 2)) munC[c] = m;
    const t = alvoDe[classe[p]];
    if (t >= 0) pot[gDoAlvo[t]][c] += taxaAlvo[(m - 1) * NA + t];
    for (let g = 0; g < G.length; g++) pot[g][c] += taxaTodos[(m - 1) * G.length + g];
  }
}
const total = new Float64Array(NC);
for (let c = 0; c < NC; c++) total[c] = pot[0][c] + pot[1][c] + pot[2][c] + pot[3][c];
const lonC = (c) => X0 + ((c % NXC) + 0.5) * DXC;
const latC = (c) => Y0 - (Math.floor(c / NXC) + 0.5) * DYC;
const areaPx = (lat) => DX * KM_LON(lat) * DY * KM_LAT;
const areaC = new Float64Array(NC);
const CEL = [];
for (let c = 0; c < NC; c++) if (nPx[c]) { areaC[c] = nPx[c] * areaPx(latC(c)); CEL.push(c); }
const TOTAL = soma([...cp.values()].map((v) => v.total));
const TOT_G = G.map((_, g) => soma(CEL.map((c) => pot[g][c])));
const AREA = soma(CEL.map((c) => areaC[c]));
log(`grade de ${NXC} × ${NYC} (${CEL.length} células em SP); potencial ${r0(soma(TOT_G))} de ${r0(TOTAL)} m³/dia`);
if (Math.abs(soma(TOT_G) - TOTAL) > 1) throw new Error('a grade não conserva o potencial');

/* ------------------------------------------------------------------ 2. alcance de 30 km */
/** Soma num disco de `raio` km em volta de cada célula, por somas acumuladas em cada linha. */
function disco(campos, raio) {
  const pre = campos.map((a) => {
    const p = new Float64Array(NYC * (NXC + 1));
    for (let j = 0; j < NYC; j++) for (let i = 0; i < NXC; i++) p[j * (NXC + 1) + i + 1] = p[j * (NXC + 1) + i] + a[j * NXC + i];
    return p;
  });
  const out = campos.map(() => new Float64Array(NC));
  const dyKm = DYC * KM_LAT;
  const R = Math.floor(raio / dyKm);
  for (const c of CEL) {
    const i = c % NXC, j = Math.floor(c / NXC);
    const dxKm = DXC * KM_LON(latC(c));
    for (let dj = -R; dj <= R; dj++) {
      const jj = j + dj;
      if (jj < 0 || jj >= NYC) continue;
      const hw = Math.floor(Math.sqrt(raio * raio - (dj * dyKm) ** 2) / dxKm);
      const a = Math.max(0, i - hw), b = Math.min(NXC - 1, i + hw);
      const o = jj * (NXC + 1);
      for (let k = 0; k < campos.length; k++) out[k][c] += pre[k][o + b + 1] - pre[k][o + a];
    }
  }
  return out;
}
const alc = disco([total, ...pot], RAIO_KM);
const ALC = alc[0];
log('alcance de 30 km');

/* ------------------------------------------------------------------ infraestrutura (como em biogas-territorio-sp) */
const spGeo = SP.limite.features[0].geometry;
const [bx0, by0, bx1, by1] = caixa(spGeo);
const perto = (g, m = 0.6) => { const [a, b, c, d] = caixa(g); return c >= bx0 - m && a <= bx1 + m && d >= by0 - m && b <= by1 + m; };
const noSp = (pt) => dentro(pt, spGeo);
/** Pontos repetidos (a menos de 100 m: registros duplicados ou duas entregas no mesmo local) viram um só. */
function juntar(pts) {
  const out = [];
  for (const p of pts) {
    const q = out.find((o) => Math.hypot((o.coord[0] - p.coord[0]) * 104, (o.coord[1] - p.coord[1]) * KM_LAT) < 0.1);
    if (!q) { out.push({ ...p }); continue; }
    for (const [k, v] of Object.entries(p)) if (k !== 'coord' && v && !String(q[k] ?? '').split(' / ').includes(String(v))) q[k] = q[k] ? `${q[k]} / ${v}` : v;
  }
  return out;
}
const entrega = juntar(lerShp(join(INFRA, 'structure_gas_delivery_point', 'PONTOS_ENTREGA.shp'))
  .filter((f) => perto(f.geometry) && /existente/i.test(f.properties.Classifica ?? ''))
  .map((f) => ({ coord: f.geometry.coordinates, nome: f.properties.Nome?.trim(), municipio: f.properties.Municipio?.trim(), uf: f.properties.Estado?.trim(), transportadora: f.properties.Transporta?.trim(), segmento: f.properties.Segmento?.trim() })));
const subest = juntar(lerShp(join(INFRA, 'structure_substation', 'SE_EXISTENTE.shp'))
  .filter((f) => perto(f.geometry))
  .map((f) => ({ coord: f.geometry.coordinates, nome: f.properties.Nome?.trim(), concessionaria: f.properties.Concession?.trim(), tensao: f.properties.Tensao })));
const transporte = lerShp(join(INFRA, 'structure_transportation_gas_pipeline', 'gasoduto-transporte.shp'))
  .filter((f) => perto(f.geometry) && /existente/i.test(f.properties['situação'] ?? f.properties.situacao ?? 'Existente'))
  .map((f) => ({ type: 'Feature', properties: { nome: f.properties.Nome_Dut_1, transportadora: f.properties.Transporta, diametro_pol: f.properties.Diam_Pol_x }, geometry: simplificar(f.geometry, 0.0003) }));
for (const s of [...entrega, ...subest]) { s.em_sp = noSp(s.coord) ? 1 : 0; }
log(`${entrega.length} pontos de entrega, ${subest.length} subestações (com o entorno)`);

/** Mais próximo e distância (km) de cada célula a uma lista de pontos. */
function maisProximo(pts) {
  const id = new Int16Array(NC).fill(-1), d = new Float32Array(NC).fill(NaN);
  for (const c of CEL) {
    const lon = lonC(c), lat = latC(c), kx = KM_LON(lat);
    let mel = Infinity, k = -1;
    pts.forEach((p, i) => { const v = ((p.coord[0] - lon) * kx) ** 2 + ((p.coord[1] - lat) * KM_LAT) ** 2; if (v < mel) { mel = v; k = i; } });
    id[c] = k; d[c] = Math.sqrt(mel);
  }
  return { id, d };
}
const ENT = maisProximo(entrega);
const SE = maisProximo(subest);

/* ------------------------------------------------------------------ 3. curva de oferta (086) */
function curva(d) {
  const max = Math.ceil(maxDe(CEL, (c) => d[c]));
  const bins = [total, ...pot].map(() => new Float64Array(max + 1));
  for (const c of CEL) { const k = Math.ceil(d[c]); bins.forEach((b, q) => { b[k] += (q ? pot[q - 1] : total)[c]; }); }
  const acum = bins.map((b) => { let a = 0; return Array.from(b, (v) => (a += v)); });
  return { max, acum };
}
const CURVA = curva(ENT.d);
const CURVA_SE = curva(SE.d);
const ate = (cv, km, q = 0) => cv.acum[q][Math.min(km, cv.max)];
/** Distância (km) que junta a parte `p` do potencial do grupo q. */
const distParte = (cv, p, q = 0) => { const alvo = p * cv.acum[q][cv.max]; return cv.acum[q].findIndex((v) => v >= alvo - 1e-6); };

/* ------------------------------------------------------------------ 4. bacias (087) */
function bacias(pts, P) {
  const out = pts.map((p) => ({ ...p, area_km2: 0, biometano_m3d: 0, ...Object.fromEntries(G.map((g) => [`${g}_m3d`, 0])), soma_d: 0 }));
  for (const c of CEL) {
    const b = out[P.id[c]];
    b.area_km2 += areaC[c]; b.biometano_m3d += total[c]; b.soma_d += total[c] * P.d[c];
    G.forEach((g, q) => { b[`${g}_m3d`] += pot[q][c]; });
  }
  for (const b of out) {
    b.fora_da_cana_m3d = b.biometano_m3d - b.cana_m3d;
    b.km_medio = b.biometano_m3d ? b.soma_d / b.biometano_m3d : null;
    delete b.soma_d;
  }
  return out;
}
const BAC_ENT = bacias(entrega, ENT);
const BAC_SE = bacias(subest, SE);

/** Polígonos de Voronoi (plano local) recortados no limite do estado, por Sutherland–Hodgman. */
const LAT0 = (by0 + by1) / 2, KX0 = KM_LON(LAT0);
const plano = ([x, y]) => [x * KX0, y * KM_LAT];
const geo = ([x, y]) => [x / KX0, y / KM_LAT];
function cortar(anel, [a, b, lim]) {
  // Mantém a·x + b·y ≤ lim.
  const out = [];
  const den = (p) => a * p[0] + b * p[1] - lim;
  for (let i = 0; i < anel.length; i++) {
    const P = anel[i], Q = anel[(i + 1) % anel.length];
    const dp = den(P), dq = den(Q);
    if (dp <= 0) out.push(P);
    if ((dp <= 0) !== (dq <= 0)) { const t = dp / (dp - dq); out.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]); }
  }
  return out;
}
const areaPlana = (r) => { let s = 0; for (let i = 0; i < r.length; i++) { const [x1, y1] = r[i], [x2, y2] = r[(i + 1) % r.length]; s += x1 * y2 - x2 * y1; } return s / 2; };
const partesSp = poligonos(spGeo).map((p) => p[0].slice(0, -1).map(plano));
function voronoi(pts, bacs) {
  const P = pts.map((p) => plano(p.coord));
  return bacs.map((b, i) => {
    if (!b.area_km2) return null;
    const meios = P.filter((_, j) => j !== i).map((q) => [q[0] - P[i][0], q[1] - P[i][1], (q[0] ** 2 + q[1] ** 2 - P[i][0] ** 2 - P[i][1] ** 2) / 2]);
    // Célula convexa: começa numa caixa larga e corta pelas mediatrizes.
    let cel = [[-1e5, -1e5], [1e5, -1e5], [1e5, 1e5], [-1e5, 1e5]].map(([x, y]) => [P[i][0] + x * 0.01, P[i][1] + y * 0.01]);
    for (const h of meios) { cel = cortar(cel, h); if (!cel.length) break; }
    if (cel.length < 3) return null;
    const lados = cel.map((p, k) => { const q = cel[(k + 1) % cel.length]; const a = q[1] - p[1], bb = -(q[0] - p[0]); const s = areaPlana(cel) > 0 ? 1 : -1; return [s * a, s * bb, s * (a * p[0] + bb * p[1])]; });
    const partes = [];
    for (const parte of partesSp) {
      let r = parte;
      for (const h of lados) { r = cortar(r, h); if (r.length < 3) break; }
      if (r.length >= 3 && Math.abs(areaPlana(r)) > 0.01) partes.push([[...r, r[0]].map((p) => geo(p).map(r4))]);
    }
    if (!partes.length) return null;
    return partes.length === 1 ? { type: 'Polygon', coordinates: partes[0] } : { type: 'MultiPolygon', coordinates: partes };
  });
}
const POL_ENT = voronoi(entrega, BAC_ENT);
const POL_SE = voronoi(subest, BAC_SE);
const areaPol = (pols) => soma(pols.filter(Boolean).flatMap((g) => poligonos(g).map((p) => Math.abs(areaPlana(p[0].map(plano))))));
log(`bacias e polígonos: ${Math.round(areaPol(POL_ENT))} e ${Math.round(areaPol(POL_SE))} km² nos polígonos, ${Math.round(AREA)} km² na grade`);

/* ------------------------------------------------------------------ 5. usinas (088) */
const cdPorNome = new Map([...NOME_MUN].map(([cd, n]) => [semAcento(n), cd]));
const pontoMun = new Map(malha.map((f, i) => [CDS[i], pontoInterno(f.geometry)]));
const anpLinhas = await lerCsv(ANP, { sep: ',' });
const mesAnp = anpLinhas.filter((l) => l.uf === 'SP').map((l) => l.mesano).sort((a, b) => b.split('/').reverse().join('').localeCompare(a.split('/').reverse().join('')))[0];
const anp = anpLinhas.filter((l) => l.uf === 'SP' && l.mesano === mesAnp).map((l) => {
  const cd = cdPorNome.get(semAcento(l.municipio));
  if (!cd) throw new Error(`município da ANP sem código: ${l.municipio}`);
  return { cd, razao: l.razao_social.trim(), cap: Number(l.cap_biometano_m3d), uso: Number(l.util_pct) };
});
const gd = new Map();
let gdRef = null, cab = null;
for await (const c of linhasCsv(ANEEL_GD, { zip: true })) {
  if (!cab) { cab = c; continue; }
  const o = Object.fromEntries(cab.map((k, i) => [k, c[i]]));
  if (o.SigUF !== 'SP' || o.SigTipoGeracao !== 'UTE' || !/^Biog/.test(o.DscFonteGeracao)) continue;
  gdRef ??= o.AnmPeriodoReferencia;
  const cd = o.CodMunicipioIbge;
  if (!gd.has(cd)) gd.set(cd, { unidades: 0, kw: 0 });
  gd.get(cd).unidades++;
  gd.get(cd).kw += Number(o.MdaPotenciaInstaladaKW.replace(/\./g, '').replace(',', '.'));
}
log(`ANP ${mesAnp}: ${anp.length} plantas; ANEEL GD ${gdRef}: ${gd.size} municípios`);
// Cada município com usina é um sítio: as fontes da ANP e da ANEEL ficam no mesmo ponto.
const sitios = new Map();
for (const p of anp) {
  if (!sitios.has(p.cd)) sitios.set(p.cd, { cd: p.cd, anp: [], gd: null });
  sitios.get(p.cd).anp.push(p);
}
for (const [cd, v] of gd) {
  if (!sitios.has(cd)) sitios.set(cd, { cd, anp: [], gd: null });
  sitios.get(cd).gd = v;
}
const USINAS = [...sitios.values()].map((s) => ({ ...s, coord: pontoMun.get(s.cd) }));
/** Células a até `raio` km de um ponto. */
function celulasPerto([lon, lat], raio) {
  const out = [];
  const kx = KM_LON(lat);
  const j0 = Math.max(0, Math.floor((Y0 - lat - raio / KM_LAT) / DYC)), j1 = Math.min(NYC - 1, Math.ceil((Y0 - lat + raio / KM_LAT) / DYC));
  const i0 = Math.max(0, Math.floor((lon - raio / kx - X0) / DXC)), i1 = Math.min(NXC - 1, Math.ceil((lon + raio / kx - X0) / DXC));
  for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
    const c = j * NXC + i;
    if (!nPx[c]) continue;
    if (((lonC(c) - lon) * KM_LON(latC(c))) ** 2 + ((latC(c) - lat) * KM_LAT) ** 2 <= raio * raio) out.push(c);
  }
  return out;
}
const COB = new Uint8Array(NC);
for (const u of USINAS) { u.cels = celulasPerto(u.coord, RAIO_KM); for (const c of u.cels) COB[c]++; }
for (const u of USINAS) {
  u.alcance = soma(u.cels.map((c) => total[c]));
  u.alcance_g = G.map((_, q) => soma(u.cels.map((c) => pot[q][c])));
  u.disputado = soma(u.cels.filter((c) => COB[c] > 1).map((c) => total[c]));
  u.vizinhos = USINAS.filter((v) => v !== u && Math.hypot((v.coord[0] - u.coord[0]) * KM_LON(u.coord[1]), (v.coord[1] - u.coord[1]) * KM_LAT) <= 2 * RAIO_KM).map((v) => v.cd);
  delete u.cels;
}
const cobPor = [0, 1, 2, 3].map((k) => soma(CEL.filter((c) => (k < 3 ? COB[c] === k : COB[c] >= 3)).map((c) => total[c])));
const cobArea = [0, 1, 2, 3].map((k) => soma(CEL.filter((c) => (k < 3 ? COB[c] === k : COB[c] >= 3)).map((c) => areaC[c])));
log('usinas e cobertura');

/* ------------------------------------------------------------------ números e destaques */
const nomeCel = (c) => NOME_MUN.get(CDS[munC[c] - 1]);
const cdCel = (c) => CDS[munC[c] - 1];
/** Os n maiores de `val` entre `cels`, a pelo menos `minKm` uns dos outros. */
function maiores(cels, val, n, minKm = 60) {
  const ord = [...cels].sort((a, b) => val(b) - val(a));
  const out = [];
  for (const c of ord) {
    if (out.length >= n) break;
    if (out.some((o) => Math.hypot((lonC(o) - lonC(c)) * KM_LON(latC(c)), (latC(o) - latC(c)) * KM_LAT) < minKm)) continue;
    out.push(c);
  }
  return out.map((c) => ({ c, coord: [r4(lonC(c)), r4(latC(c))], CD_MUN: cdCel(c), NM_MUN: nomeCel(c), v: val(c), cob: COB[c], ...Object.fromEntries(G.map((g, q) => [g, alc[q + 1][c]])) }));
}
const capAnp = anp.map((p) => p.cap).sort((a, b) => a - b);
const medianaAnp = capAnp.length % 2 ? capAnp[(capAnp.length - 1) / 2] : (capAnp[capAnp.length / 2 - 1] + capAnp[capAnp.length / 2]) / 2;
// Porte de referência: a mediana das plantas paulistas da ANP, arredondada.
const REF = Math.round(medianaAnp / 10000) * 10000;
const areaAcima = (q, lim) => soma(CEL.filter((c) => alc[q][c] >= lim).map((c) => areaC[c]));
const quantil = (vals, p) => { const s = [...vals].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(p * (s.length - 1)))]; };
// Densidade (m³/dia por km²) que separa as células mais densas, que somam 75 % do potencial.
const dens = new Float32Array(NC).fill(NaN);
for (const c of CEL) dens[c] = total[c] / areaC[c];
let acum = 0, dens75 = 0;
for (const c of [...CEL].sort((a, b) => dens[b] - dens[a])) { acum += total[c]; if (acum >= 0.75 * TOTAL) { dens75 = dens[c]; break; } }
const area75 = soma(CEL.filter((c) => dens[c] >= dens75).map((c) => areaC[c]));

const S = {
  versao: cp.versao, raio_km: RAIO_KM, total: TOTAL, area: AREA, grupos: GRUPOS.map(([k, pt, en, cor], q) => ({ k, pt, en, cor, m3d: TOT_G[q], sem_classe: semClasse[k] })),
  celula_km: { x: DXC * KM_LON(LAT0), y: DYC * KM_LAT }, n_celulas: CEL.length,
  // 085
  ref_m3d: REF, mediana_anp: medianaAnp, cap_anp: capAnp,
  alc_max: maiores(CEL, (c) => ALC[c], 5, 80),
  alc_max_g: G.map((_, q) => maiores(CEL, (c) => alc[q + 1][c], 3, 80)),
  area_ref: [ALC, ...alc.slice(1)].map((a, q) => areaAcima(q, REF)),
  area_ref_fora_cana: soma(CEL.filter((c) => ALC[c] - alc[1][c] >= REF).map((c) => areaC[c])),
  area_limites: [10000, 30000, 100000, 300000, 600000].map((l) => [l, areaAcima(0, l)]),
  alc_quantis: [0.1, 0.25, 0.5, 0.75, 0.9, 0.99].map((p) => [p, quantil(CEL.map((c) => ALC[c]), p)]),
  capital: { alc: ALC[CEL.find((c) => cdCel(c) === '3550308' && Math.abs(lonC(c) + 46.633) < 0.02 && Math.abs(latC(c) + 23.55) < 0.02) ?? CEL.find((c) => cdCel(c) === '3550308')], urbano: alc[4][CEL.find((c) => cdCel(c) === '3550308' && Math.abs(lonC(c) + 46.633) < 0.02 && Math.abs(latC(c) + 23.55) < 0.02) ?? CEL.find((c) => cdCel(c) === '3550308')] },
  dens75, area75,
  // 086
  curva: CURVA.acum.map((a) => a.filter((_, k) => k <= 250)), curva_max: CURVA.max,
  curva_se: CURVA_SE.acum[0].filter((_, k) => k <= 250), curva_se_max: CURVA_SE.max,
  ate_ent: [10, 25, 50, 100, 150].map((km) => [km, ...[0, 1, 2, 3, 4].map((q) => ate(CURVA, km, q))]),
  ate_se: [10, 25, 50, 100].map((km) => [km, ate(CURVA_SE, km)]),
  mediana_km: [0, 1, 2, 3, 4].map((q) => distParte(CURVA, 0.5, q)),
  p90_km: [0, 1, 2, 3, 4].map((q) => distParte(CURVA, 0.9, q)),
  mediana_km_se: distParte(CURVA_SE, 0.5),
  // 087
  entrega: BAC_ENT.map((b, i) => ({ i, ...b, coord: b.coord.map(r4) })),
  subest: BAC_SE.map((b, i) => ({ i, ...b, coord: b.coord.map(r4) })),
  // 088
  usinas: USINAS.map((u) => ({ cd: u.cd, nome: NOME_MUN.get(u.cd), coord: u.coord.map(r4), anp: u.anp, gd: u.gd, alcance: u.alcance, alcance_g: u.alcance_g, disputado: u.disputado, vizinhos: u.vizinhos })),
  mes_anp: mesAnp, gd_ref: gdRef,
  cob_pot: cobPor, cob_area: cobArea,
  longe: maiores(CEL.filter((c) => dens[c] >= dens75), (c) => ENT.d[c], 3, 100),
  orfaos: maiores(CEL.filter((c) => COB[c] === 0), (c) => ALC[c], 6, 70),
  orfaos_fora_cana: maiores(CEL.filter((c) => COB[c] === 0), (c) => ALC[c] - alc[1][c], 4, 70),
  desenho: { transporte: transporte.map((f) => ({ type: 'Feature', properties: {}, geometry: f.geometry })) },
};
// Grade da prancha: camadas Float32 em cache/suprimento-sp-grade.bin.
const CAMADAS = { alc: ALC, alc_fora_cana: ALC.map((v, c) => v - alc[1][c]), dens, d_ent: ENT.d, i_ent: ENT.id, d_se: SE.d, i_se: SE.id, cob: COB };
const buf = new Float32Array(NC * Object.keys(CAMADAS).length).fill(NaN);
Object.values(CAMADAS).forEach((a, k) => { for (const c of CEL) buf[k * NC + c] = a[c]; });
writeFileSync(join(CACHE, 'suprimento-sp-grade.bin'), Buffer.from(buf.buffer));
S.grade = { largura: NXC, altura: NYC, x0: X0, y0: Y0, dx: DXC, dy: DYC, camadas: Object.keys(CAMADAS) };
gravarCache('suprimento-sp', S);
const pctT = (v) => `${r1((100 * v) / TOTAL)} %`;
console.log({
  total: r0(TOTAL), grupos: S.grupos.map((g) => `${g.k} ${r0(g.m3d)} (sem classe ${r0(g.sem_classe)})`), area: r0(AREA), celula: S.celula_km,
  ref: REF, cap_anp: capAnp, alc_max: S.alc_max.map((o) => `${o.NM_MUN} ${r0(o.v)}`), alc_max_g: S.alc_max_g.map((l) => l.map((o) => `${o.NM_MUN} ${r0(o.v)}`)),
  area_ref_pct: S.area_ref.map((a) => r1((100 * a) / AREA)), area_ref_fora_cana: r1((100 * S.area_ref_fora_cana) / AREA), area_limites: S.area_limites.map(([l, a]) => `${l}: ${r1((100 * a) / AREA)} %`),
  alc_quantis: S.alc_quantis.map(([p, v]) => `${p}: ${r0(v)}`), capital: S.capital, dens75: r1(dens75), area75: r1((100 * area75) / AREA),
  ate_ent: S.ate_ent.map(([km, ...v]) => `${km} km: ${v.map((x, q) => r1((100 * x) / (q ? TOT_G[q - 1] : TOTAL))).join(' / ')} %`),
  ate_se: S.ate_se.map(([km, v]) => `${km} km: ${pctT(v)}`), mediana_km: S.mediana_km, p90_km: S.p90_km, mediana_km_se: S.mediana_km_se,
  entrega_top: [...BAC_ENT].sort((a, b) => b.biometano_m3d - a.biometano_m3d).slice(0, 8).map((b) => `${b.nome} (${b.municipio}/${b.uf}) ${r0(b.biometano_m3d)} fora ${r0(b.fora_da_cana_m3d)} ${r0(b.km_medio)} km`),
  entrega_fora_top: [...BAC_ENT].sort((a, b) => b.fora_da_cana_m3d - a.fora_da_cana_m3d).slice(0, 5).map((b) => `${b.nome} (${b.municipio}) ${r0(b.fora_da_cana_m3d)}`),
  entrega_com_bacia: BAC_ENT.filter((b) => b.area_km2 > 0).length, entrega_sp: entrega.filter((e) => e.em_sp).length,
  se_top: [...BAC_SE].sort((a, b) => b.biometano_m3d - a.biometano_m3d).slice(0, 6).map((b) => `${b.nome} ${b.tensao} ${r0(b.biometano_m3d)}`), se_com_bacia: BAC_SE.filter((b) => b.area_km2 > 0).length,
  usinas: S.usinas.map((u) => `${u.nome} anp ${u.anp.map((p) => p.cap).join('+')} gd ${u.gd ? r0(u.gd.kw) : '-'} kW alc ${r0(u.alcance)} disp ${r1((100 * u.disputado) / u.alcance)} % viz ${u.vizinhos.length}`),
  cob_pot: cobPor.map(pctT), cob_area: cobArea.map((a) => `${r1((100 * a) / AREA)} %`), orfaos: S.orfaos.map((o) => `${o.NM_MUN} ${r0(o.v)}`), orfaos_fora_cana: S.orfaos_fora_cana.map((o) => `${o.NM_MUN} ${r0(o.v - o.cana)}`),
});

/* ------------------------------------------------------------------ GeoPackage e CSV */
// Grade de 4 × 4 células (0,043°, cerca de 4,5 km) para o GPKG.
const A = 4;
const gradeFeats = [];
for (let aj = 0; aj < Math.ceil(NYC / A); aj++) for (let ai = 0; ai < Math.ceil(NXC / A); ai++) {
  const cs = [];
  for (let j = aj * A; j < Math.min(NYC, aj * A + A); j++) for (let i = ai * A; i < Math.min(NXC, ai * A + A); i++) if (nPx[j * NXC + i]) cs.push(j * NXC + i);
  if (!cs.length) continue;
  const centro = (aj * A + 2) * NXC + ai * A + 2;
  const k = nPx[centro] ? centro : cs[0];
  const x0 = X0 + ai * A * DXC, y0 = Y0 - aj * A * DYC;
  const area = soma(cs.map((c) => areaC[c]));
  const tot = soma(cs.map((c) => total[c]));
  gradeFeats.push({
    type: 'Feature',
    geometry: { type: 'Polygon', coordinates: [[[x0, y0], [x0 + A * DXC, y0], [x0 + A * DXC, y0 - A * DYC], [x0, y0 - A * DYC], [x0, y0]].map((p) => p.map(r4))] },
    properties: {
      id: gradeFeats.length + 1, lon: r4(x0 + (A * DXC) / 2), lat: r4(y0 - (A * DYC) / 2), area_sp_km2: r1(area),
      biometano_m3d: r1(tot), ...Object.fromEntries(G.map((g, q) => [`${g}_m3d`, r1(soma(cs.map((c) => pot[q][c])))])), m3d_por_km2: r1(tot / area),
      alcance30_m3d: r0(ALC[k]), ...Object.fromEntries(G.map((g, q) => [`alcance30_${g}_m3d`, r0(alc[q + 1][k])])), alcance30_fora_da_cana_m3d: r0(ALC[k] - alc[1][k]),
      km_ponto_entrega: r1(ENT.d[k]), ponto_entrega: entrega[ENT.id[k]].nome, km_subestacao: r1(SE.d[k]), subestacao: subest[SE.id[k]].nome,
      municipios_com_usina_30km: COB[k],
    },
  });
}
const camBacia = (pts, bacs, pols, extra) => bacs.map((b, i) => (pols[i] ? {
  type: 'Feature', geometry: pols[i],
  properties: { ...extra(pts[i]), em_sp: pts[i].em_sp, area_km2: r1(b.area_km2), biometano_m3d: r0(b.biometano_m3d), ...Object.fromEntries(G.map((g) => [`${g}_m3d`, r0(b[`${g}_m3d`])])), fora_da_cana_m3d: r0(b.fora_da_cana_m3d), km_medio: b.km_medio === null ? null : r1(b.km_medio), pct_estado: r1((100 * b.biometano_m3d) / TOTAL) },
} : null)).filter(Boolean);
const extraEnt = (p) => ({ nome: p.nome, municipio: p.municipio, uf: p.uf, transportadora: p.transportadora, segmento: p.segmento });
const extraSe = (p) => ({ nome: p.nome, concessionaria: p.concessionaria, tensao: p.tensao });
const bacEntFeats = camBacia(entrega, BAC_ENT, POL_ENT, extraEnt);
const bacSeFeats = camBacia(subest, BAC_SE, POL_SE, extraSe);
const ptFeats = (pts, bacs, extra) => pts.map((p, i) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: p.coord }, properties: { ...extra(p), em_sp: p.em_sp, bacia_biometano_m3d: r0(bacs[i].biometano_m3d), bacia_fora_da_cana_m3d: r0(bacs[i].fora_da_cana_m3d) } }));
const usinaFeats = S.usinas.map((u) => ({
  type: 'Feature', geometry: { type: 'Point', coordinates: u.coord },
  properties: {
    CD_MUN: u.cd, NM_MUN: u.nome, plantas_anp: u.anp.length, empresas_anp: u.anp.map((p) => p.razao).join('; ') || null, capacidade_biometano_m3d: soma(u.anp.map((p) => p.cap)) || null,
    gd_unidades: u.gd?.unidades ?? 0, gd_potencia_kw: u.gd ? r1(u.gd.kw) : null,
    alcance30_m3d: r0(u.alcance), ...Object.fromEntries(G.map((g, q) => [`alcance30_${g}_m3d`, r0(u.alcance_g[q])])),
    pct_raio_disputado: r1((100 * u.disputado) / u.alcance), municipios_com_usina_60km: u.vizinhos.length,
  },
}));
// As mesmas classes da prancha 085: o corte de 60 mil é o porte de referência (REF).
const CORES_ALC = ['#f4f2ea', '#e7e3d2', '#d8d1b6', '#b9c79a', '#8fab72', '#5f8a52', '#33603a'];
const LIM_ALC = [10000, 30000, REF, 100000, 300000, 600000, Math.ceil(maxDe(CEL, (c) => ALC[c]))];
const CORES_DENS = ['#f1f0e4', '#dcdcbc', '#b9c08f', '#8ea366', '#5f7f45', '#34572d'];
const CORES_KM = ['#2f4f3a', '#5f8a5a', '#a9bf86', '#e0cf8f', '#c98f4a', '#8f4f2e'];
const LIM_KM = [10, 25, 50, 100, 150];
const CORES_COB = ['#e7d3b0', '#b9cfd8', '#7aa5bd', '#2f6688'];
const ref = camadasReferencia();
const regrasKm = (campo) => LIM_KM.concat(Infinity).map((l, i) => {
  const a = i ? LIM_KM[i - 1] : null;
  const f = a === null ? `"${campo}" <= ${l}` : l === Infinity ? `"${campo}" > ${a}` : `"${campo}" > ${a} AND "${campo}" <= ${l}`;
  const r = a === null ? `até ${l} km` : l === Infinity ? `mais de ${a} km` : `${a} a ${l} km`;
  return [f, r, preenchimento(CORES_KM[i], CORES_KM[i], 0.01)];
});
const limBac = [100000, 300000, 600000, 1200000, 2000000, Math.ceil(Math.max(...BAC_ENT.map((b) => b.biometano_m3d), ...BAC_SE.map((b) => b.biometano_m3d)))];
const CORES_BAC = ['#eef0e2', '#d5dcbd', '#adbf8e', '#7f9d63', '#557a43', '#2f5530'];
const estilos = {
  grade: [
    ['alcance30', 'Nº 085 · Biometano a até 30 km (m³/dia)', estiloGraduado('alcance30_m3d', LIM_ALC, CORES_ALC, { casas: 0, borda: '#ffffff', largura: 0 }), true],
    ['alcance30_fora_da_cana', 'Nº 085 · Biometano fora da cana a até 30 km (m³/dia)', estiloGraduado('alcance30_fora_da_cana_m3d', LIM_ALC, CORES_ALC, { casas: 0, borda: '#ffffff', largura: 0 }), false],
    ['por_km2', 'Potencial na célula por km² (m³/dia)', estiloGraduado('m3d_por_km2', [10, 50, 100, 200, 400, 5000], CORES_DENS, { casas: 0, borda: '#ffffff', largura: 0 }), false],
    ['ponto_entrega', 'Nº 086 · Distância ao ponto de entrega de gás mais próximo', estiloRegras('poligono', regrasKm('km_ponto_entrega')), false],
    ['subestacao', 'Nº 087 · Distância à subestação mais próxima', estiloRegras('poligono', regrasKm('km_subestacao')), false],
    ['usinas_30km', 'Nº 088 · Municípios com usina a até 30 km', estiloRegras('poligono', [
      ['"municipios_com_usina_30km" = 0', 'nenhum', preenchimento(CORES_COB[0], CORES_COB[0], 0.01)],
      ['"municipios_com_usina_30km" = 1', 'um', preenchimento(CORES_COB[1], CORES_COB[1], 0.01)],
      ['"municipios_com_usina_30km" = 2', 'dois', preenchimento(CORES_COB[2], CORES_COB[2], 0.01)],
      ['"municipios_com_usina_30km" >= 3', 'três ou mais', preenchimento(CORES_COB[3], CORES_COB[3], 0.01)],
    ]), false],
  ],
  bacias_pontos_entrega: [
    ['biometano', 'Nº 087 · Biometano na bacia de cada ponto de entrega (m³/dia)', estiloGraduado('biometano_m3d', limBac, CORES_BAC, { casas: 0, borda: '#1a1c1e', largura: 0.3 }), true],
    ['fora_da_cana', 'Nº 087 · Biometano fora da cana na bacia (m³/dia)', estiloGraduado('fora_da_cana_m3d', [20000, 50000, 100000, 200000, 400000, 2000000], CORES_BAC, { casas: 0, borda: '#1a1c1e', largura: 0.3 }), false],
  ],
  bacias_subestacoes: [['biometano', 'Nº 087 · Biometano na bacia de cada subestação (m³/dia)', estiloGraduado('biometano_m3d', [50000, 150000, 300000, 600000, 1000000, 2000000], CORES_BAC, { casas: 0, borda: '#1a1c1e', largura: 0.2 }), true]],
  pontos_entrega: [['entrega', 'Pontos de entrega de gás', estiloRegras('ponto', [['', 'ponto de entrega', marcador('#6b3d5c', 2.2, { forma: 'square', borda: '#ffffff' })]]), true]],
  subestacoes: [['subestacoes', 'Subestações da rede básica', estiloRegras('ponto', [['', 'subestação', marcador('#1a1c1e', 1.6)]]), true]],
  usinas: [['usinas', 'Nº 088 · Municípios com usina de biometano (ANP) ou GD a biogás (ANEEL)', estiloRegras('ponto', [
    ['"plantas_anp" > 0', 'com planta de biometano (ANP)', marcador('#234e70', 3.6, { borda: '#ffffff' })],
    ['"plantas_anp" = 0', 'só geração distribuída (ANEEL)', marcador('#9c4a32', 3, { vazado: true })],
  ]), true]],
  gasodutos_transporte: [['transporte', 'Gasodutos de transporte', estiloLinha('#6b3d5c', 0.8), true]],
  ...ref.estilos,
};
const D85 = pasta('alcance');
mkdirSync(D85, { recursive: true });
const arq = join(D85, 'sp_suprimento_biometano.gpkg');
const campos = (fs) => Object.keys(fs[0].properties);
await gravarGpkg(arq, {
  grade: { feats: gradeFeats, campos: campos(gradeFeats) },
  bacias_pontos_entrega: { feats: bacEntFeats, campos: campos(bacEntFeats) },
  bacias_subestacoes: { feats: bacSeFeats, campos: campos(bacSeFeats) },
  pontos_entrega: { feats: ptFeats(entrega, BAC_ENT, extraEnt), campos: campos(ptFeats(entrega, BAC_ENT, extraEnt)) },
  subestacoes: { feats: ptFeats(subest, BAC_SE, extraSe), campos: campos(ptFeats(subest, BAC_SE, extraSe)) },
  usinas: { feats: usinaFeats, campos: campos(usinaFeats) },
  gasodutos_transporte: { feats: transporte, campos: campos(transporte) },
  ...ref.camadas,
}, estilos);
const z = zipar(arq);
console.log(`✓ ${z} · ${mb(tamanho(z))} · grade ${gradeFeats.length} · bacias ${bacEntFeats.length} + ${bacSeFeats.length}`);

// 085: municípios. Alcance no ponto interno e o máximo dentro do município; área com alcance ≥ porte de referência.
const pxRef = new Float64Array(nM), pxTot = new Float64Array(nM);
for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
  const m = munPx[j * NX + i];
  if (!m) continue;
  pxTot[m - 1]++;
  if (ALC[Math.floor(j / F) * NXC + Math.floor(i / F)] >= REF) pxRef[m - 1]++;
}
const maxMun = new Float64Array(nM);
for (const c of CEL) maxMun[munC[c] - 1] = Math.max(maxMun[munC[c] - 1], ALC[c]);
const celDe = ([lon, lat]) => Math.floor((Y0 - lat) / DYC) * NXC + Math.floor((lon - X0) / DXC);
const munLinhas = CDS.map((cd, m) => {
  const c = cp.get(cd) ?? { total: 0, cana: 0, lavouras: 0, pecuaria: 0, urbano: 0 };
  const k = celDe(pontoMun.get(cd));
  return {
    CD_MUN: cd, NM_MUN: NOME_MUN.get(cd), biometano_m3d: r1(c.total), ...Object.fromEntries(G.map((g) => [`${g}_m3d`, r1(c[g])])),
    alcance30_ponto_interno_m3d: nPx[k] ? r0(ALC[k]) : null, alcance30_fora_da_cana_ponto_interno_m3d: nPx[k] ? r0(ALC[k] - alc[1][k]) : null,
    alcance30_max_m3d: r0(maxMun[m]), pct_area_alcance_ref: r1((100 * pxRef[m]) / pxTot[m]),
    km_ponto_entrega: nPx[k] ? r1(ENT.d[k]) : null, km_subestacao: nPx[k] ? r1(SE.d[k]) : null, municipios_com_usina_30km: nPx[k] ? COB[k] : null,
  };
}).sort((a, b) => a.NM_MUN.localeCompare(b.NM_MUN, 'pt-BR'));
const csv85 = join(D85, 'sp_biometano_alcance_30km_municipios.csv');
gravarCsv(csv85, munLinhas, Object.keys(munLinhas[0]));
// 086: curva.
const D86 = pasta('curva');
mkdirSync(D86, { recursive: true });
const curvaLinhas = [];
for (let km = 0; km <= Math.max(CURVA.max, CURVA_SE.max); km++) {
  const v = (cv, q) => r0(cv.acum[q][Math.min(km, cv.max)]);
  curvaLinhas.push({ km, ...Object.fromEntries([['biometano', 0], ...G.map((g, q) => [g, q + 1])].map(([k, q]) => [`${k}_ate_ponto_entrega_m3d`, v(CURVA, q)])), pct_ate_ponto_entrega: r1((100 * v(CURVA, 0)) / TOTAL), biometano_ate_subestacao_m3d: v(CURVA_SE, 0), pct_ate_subestacao: r1((100 * v(CURVA_SE, 0)) / TOTAL) });
}
const csv86 = join(D86, 'sp_biometano_curva_de_oferta.csv');
gravarCsv(csv86, curvaLinhas, Object.keys(curvaLinhas[0]));
// 087: bacias.
const D87 = pasta('bacias');
mkdirSync(D87, { recursive: true });
const bacLinhas = [
  ...BAC_ENT.map((b) => ({ rede: 'ponto_entrega', municipio: b.municipio, uf: b.uf, operador: b.transportadora, tensao: null, ...b })),
  ...BAC_SE.map((b) => ({ rede: 'subestacao', municipio: null, uf: null, operador: b.concessionaria, ...b })),
].filter((l) => l.area_km2 > 0)
  .map((l) => ({ rede: l.rede, nome: l.nome, municipio: l.municipio, uf: l.uf, operador: l.operador, tensao: l.tensao, em_sp: l.em_sp, lon: r4(l.coord[0]), lat: r4(l.coord[1]), area_km2: r1(l.area_km2), biometano_m3d: r0(l.biometano_m3d), ...Object.fromEntries(G.map((g) => [`${g}_m3d`, r0(l[`${g}_m3d`])])), fora_da_cana_m3d: r0(l.fora_da_cana_m3d), km_medio: r1(l.km_medio), pct_estado: r1((100 * l.biometano_m3d) / TOTAL) }))
  .sort((a, b) => a.rede.localeCompare(b.rede) || b.biometano_m3d - a.biometano_m3d);
const csv87 = join(D87, 'sp_biometano_bacias_da_rede.csv');
gravarCsv(csv87, bacLinhas, Object.keys(bacLinhas[0]));
// 088: usinas.
const D88 = pasta('disputa');
mkdirSync(D88, { recursive: true });
const csv88 = join(D88, 'sp_biometano_disputa_usinas.csv');
const usLinhas = usinaFeats.map((f) => ({ ...f.properties, lon: f.geometry.coordinates[0], lat: f.geometry.coordinates[1] })).sort((a, b) => b.alcance30_m3d - a.alcance30_m3d);
gravarCsv(csv88, usLinhas, Object.keys(usLinhas[0]));
console.log(`✓ CSV ${kb(tamanho(csv85))} · ${kb(tamanho(csv86))} · ${kb(tamanho(csv87))} · ${kb(tamanho(csv88))}`);
log('fim');
