/**
 * Setores censitários de São Paulo (Censo 2022) — malha, grade de índices e tabelas (uso interno).
 *
 *   node scripts/colecoes/lib/setores-sp.mjs        refaz o cache da malha (uma vez, ~1 min)
 *
 * A malha do IBGE (dados-brutos/ibge/malhas-sp/SP_setores_CD2022) tem 103 mil polígonos: grande demais
 * para desenhar em vetor numa prancha do estado inteiro. Aqui ela vira duas coisas, guardadas em cache:
 *   setores-sp-indice.bin/.json  grade de ~200 m (0,002°) em que cada célula guarda o índice do setor
 *                                cujo polígono cobre o centro da célula (Int32; 0 = fora);
 *   setores-sp-geo.json          os polígonos simplificados (~10 m), para os GeoPackages e as hachuras.
 * Cada tema pinta a grade com a classe do seu setor (gradeTema) e a prancha a lê com lib/raster.mjs.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BRUTOS, CACHE, RAIZ, lerShp, novaGrade, rasterizar, simplificar, pontoInterno, linhasCsv, gravarGrade, num } from './dados.mjs';

const SHP = join(BRUTOS, 'ibge', 'malhas-sp', 'SP_setores_CD2022', 'SP_setores_CD2022.shp');
const PASSO = 0.002;

const arred = (c) => (typeof c === 'number' ? Math.round(c * 1e5) / 1e5 : c.map(arred));

/** Lê a malha e grava a grade de índices e as geometrias simplificadas. */
export function montarCache() {
  const t0 = Date.now();
  const sp = JSON.parse(readFileSync(join(RAIZ, 'scripts', 'estados', 'cache', 'sp.json'), 'utf8'));
  const feats = lerShp(SHP);
  console.log(`malha: ${feats.length} setores · ${Math.round((Date.now() - t0) / 1000)} s`);
  let bx = [Infinity, Infinity, -Infinity, -Infinity];
  const visita = (c) => {
    if (typeof c[0] === 'number') { bx = [Math.min(bx[0], c[0]), Math.min(bx[1], c[1]), Math.max(bx[2], c[0]), Math.max(bx[3], c[1])]; } else c.forEach(visita);
  };
  visita(sp.limite.features[0].geometry.coordinates);
  const caixa = [bx[0] - 0.02, bx[1] - 0.02, bx[2] + 0.02, bx[3] + 0.02].map((v) => Math.round(v * 100) / 100);
  const g = novaGrade(caixa, PASSO);
  g.dados = new Int32Array(g.largura * g.altura);
  const codigos = [];
  const info = {};
  const geo = {};
  // Setores maiores primeiro: os pequenos (cidade) pintam por cima e não somem na varredura.
  const ordem = feats.map((f, i) => [i, f.properties.AREA_KM2 ?? 0]).sort((a, b) => b[1] - a[1]).map(([i]) => i);
  for (const i of ordem) {
    const f = feats[i];
    const p = f.properties;
    codigos.push(p.CD_SETOR);
    rasterizar(g, f.geometry, codigos.length);
    const pt = pontoInterno(f.geometry);
    info[p.CD_SETOR] = { mun: p.CD_MUN, area: p.AREA_KM2, sit: p.CD_SIT, fcu: p.CD_FCU || null, pt: pt ? arred(pt) : null };
    const s = simplificar(f.geometry, 0.0001);
    geo[p.CD_SETOR] = s ? { type: s.type, coordinates: arred(s.coordinates) } : null;
  }
  writeFileSync(join(CACHE, 'setores-sp-indice.bin'), Buffer.from(g.dados.buffer));
  writeFileSync(join(CACHE, 'setores-sp-indice.json'), JSON.stringify({ largura: g.largura, altura: g.altura, x0: g.x0, y0: g.y0, dx: g.dx, dy: g.dy, codigos }));
  writeFileSync(join(CACHE, 'setores-sp-info.json'), JSON.stringify(info));
  writeFileSync(join(CACHE, 'setores-sp-geo.json'), JSON.stringify(geo));
  console.log(`✓ grade ${g.largura} × ${g.altura} · ${Math.round((Date.now() - t0) / 1000)} s`);
}

/** Grade de índices: { meta, indice: Int32Array, codigos }. */
export function lerIndice() {
  if (!existsSync(join(CACHE, 'setores-sp-indice.bin'))) montarCache();
  const meta = JSON.parse(readFileSync(join(CACHE, 'setores-sp-indice.json'), 'utf8'));
  const buf = readFileSync(join(CACHE, 'setores-sp-indice.bin'));
  return { meta, indice: new Int32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4), codigos: meta.codigos };
}

export const lerInfo = () => JSON.parse(readFileSync(join(CACHE, 'setores-sp-info.json'), 'utf8'));
export const lerGeo = () => JSON.parse(readFileSync(join(CACHE, 'setores-sp-geo.json'), 'utf8'));

/**
 * Grade uint8 de um tema: classe(cd) → 1..253 (cor), 254 = sem informação, null/0 = transparente.
 * Grava cache/<nome>.bin/.json para lib/raster.mjs.
 */
export function gradeTema(nome, classe) {
  const { meta, indice, codigos } = lerIndice();
  const tabela = new Uint8Array(codigos.length + 1);
  codigos.forEach((cd, i) => { tabela[i + 1] = classe(cd) ?? 0; });
  const dados = new Uint8Array(indice.length);
  for (let k = 0; k < indice.length; k++) dados[k] = tabela[indice[k]];
  gravarGrade(nome, { ...meta, dados }, 0);
}

/**
 * Tabela de um grupo do Censo (dados-brutos/ibge/sp/<grupo>.csv) como Map(CD_SETOR → { VAR: número | null }).
 * "X" (sigilo) e "." viram null: sem informação, nunca zero.
 */
export async function tabelaCenso(grupo, variaveis = null) {
  const arq = join(BRUTOS, 'ibge', 'sp', `${grupo}.csv`);
  const out = new Map();
  let cab = null;
  let idx = null;
  for await (const l of linhasCsv(arq)) {
    if (!cab) {
      cab = l.map((c) => c.toUpperCase());
      idx = (variaveis ?? cab.slice(1)).map((v) => [v, cab.indexOf(v.toUpperCase())]);
      continue;
    }
    const o = {};
    for (const [v, i] of idx) o[v] = num(l[i]);
    out.set(l[0], o);
  }
  return out;
}

/** Tabela básica: Map(CD_SETOR → { situacao, CD_MUN, NM_MUN, NM_DIST, CD_FCU, NM_FCU, area, pessoas, domicilios, dpo }). */
export async function basico() {
  const arq = join(BRUTOS, 'ibge', 'sp', 'basico.csv');
  const out = new Map();
  let cab = null;
  for await (const l of linhasCsv(arq)) {
    if (!cab) { cab = l.map((c) => c.toUpperCase()); continue; }
    const v = (k) => l[cab.indexOf(k)];
    const t = (k) => { const s = v(k); return s === '.' || s === '' ? null : s; };
    out.set(l[0], {
      situacao: v('SITUACAO'), CD_SIT: v('CD_SIT'), CD_MUN: v('CD_MUN'), NM_MUN: v('NM_MUN'), NM_DIST: t('NM_DIST'), NM_BAIRRO: t('NM_BAIRRO'),
      CD_FCU: t('CD_FCU'), NM_FCU: t('NM_FCU'), CD_RGINT: v('CD_RGINT'), NM_RGINT: v('NM_RGINT'), CD_CONCURB: t('CD_CONCURB'),
      area: num(v('AREA_KM2')), pessoas: num(v('V0001')), domicilios: num(v('V0002')), dpo: num(v('V0007')),
    });
  }
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) montarCache();
