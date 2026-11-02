#!/usr/bin/env node
/**
 * Coleção «Biomassa que vira fumaça» (SP) — desenha uma prancha a partir do cache de preparar.py (uso interno).
 *
 *   node scripts/colecoes/fogo-sp/prancha.mjs agosto|mes|lugar
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  RAIZ, LP, SERIF, MONO, CINZA, PAPEL, TINTA, esc, nf, f1, lingua, largura, gerarPrancha, rotuloPainel,
} from '../lib/prancha-sp.mjs';
import { lerRaster } from '../lib/raster.mjs';
import { CESTO, VALE } from '../lib/arte.mjs';

export const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'fogo-sp', 'serie.json'), 'utf8'));
const TOTAL = 3;
const NEUTRO = '#f1f2f3';
const CANA_FUNDO = '#efe3c8';
const CINZA_FOCO = '#9ea5ac';
const HACH = '#aeb4ba';

const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `fogo-sp-${nome}.json`), 'utf8'));
const L = (pt, en) => (lingua() === 'en' ? en : pt);
const serie = (i) => () => L(`BIOMASSA QUE VIRA FUMAÇA · ${i}/${TOTAL}`, `BIOMASS GONE UP IN SMOKE · ${i}/${TOTAL}`);
const pct = (v, casas = 0) => `${nf(v, casas)} %`;
const NAO_E_AREA = () => L('Foco de calor é fogo ativo visto pelo satélite, não área queimada.',
  'A hotspot is active fire seen by the satellite, not burned area.');
const MESES = () => L(['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
const INICIO_MES = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];
/** Dia do ano (1 a 365) → «5 ago» / «5 Aug». */
function dataCurta(doy) {
  const d = Math.round(doy);
  const m = INICIO_MES.findIndex((v, i) => d >= v && d < INICIO_MES[i + 1]);
  return `${d - INICIO_MES[m] + 1} ${MESES()[m]}`;
}
const hachura = (id) => `<defs><pattern id="${id}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="${PAPEL}"/><path d="M0 0V7" stroke="${HACH}" stroke-width="1.1"/></pattern></defs>`;

/* ------------------------------------------------------------------ friso */
function sorte(semente) {
  let s = semente >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

/** Friso da coleção: a palhada cortada no pé e a fumaça subindo em fios, mais rala no alto. */
function fumaca(w, h) {
  const r = sorte(23);
  const s = [];
  for (let x = 3; x < w; x += 5 + r() * 3) s.push(`<path d="M${f1(x)} ${h}v${f1(-3 - r() * 6)}" stroke="${VALE}" stroke-width="1"/>`);
  const n = Math.max(3, Math.floor(w / 95));
  for (let k = 0; k < n; k++) {
    const x0 = (w * (k + 0.5)) / n + (r() - 0.5) * 30;
    for (let fio = 0; fio < 3; fio++) {
      const fase = r() * Math.PI * 2;
      const deriva = 18 + r() * 22;
      const pts = [];
      for (let t = 0; t <= 1.0001; t += 0.05) {
        const y = h - 8 - t * (h - 14);
        const x = x0 + (fio - 1) * 4 * (1 + 2 * t) + deriva * t * t + Math.sin(fase + t * 7) * 6 * t;
        pts.push([x, y]);
      }
      // Quatro trechos, cada um mais apagado: a fumaça se desfaz ao subir.
      for (let q = 0; q < 4; q++) {
        const tr = pts.slice(q * 5, q * 5 + 6);
        s.push(`<path d="M${tr.map(([x, y]) => `${f1(x)} ${f1(y)}`).join('L')}" fill="none" stroke="${fio === 1 ? VALE : CESTO}" stroke-width="${fio === 1 ? 1 : 1.2}" stroke-opacity="${f1(0.95 - q * 0.22)}" stroke-linecap="round"/>`);
      }
    }
  }
  return s.join('');
}

/* ------------------------------------------------------------------ 1 o que queimou em agosto */
async function agosto() {
  const c = await ler('agosto');
  const cana = await lerRaster('fogo-sp-cana');
  const G = c.grupos;
  const gc = G[0];
  const resto = c.n_2024 - c.n_22a24;
  const d23 = c.agosto_dias[22];
  const pita = c.maiores.find((m) => m.nome === 'Pitangueiras');
  const alti = c.maiores.find((m) => m.nome === 'Altinópolis');
  const nativaAlti = alti.sob.floresta + alti.sob.campo;
  const cinzas = c.pontos.filter((p) => !p[3]).map(([lon, lat]) => ({ coord: [lon, lat], r: 1.6, cor: CINZA_FOCO, opacidade: 0.55, bordaLargura: 0 }));
  const destaque = c.pontos.filter((p) => p[3]);
  const R = 3.3;
  const bola = (cor, x, y, r = 7) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${cor}" fill-opacity=".92" stroke="${PAPEL}" stroke-width="1"/>`;
  // Itens comuns ao painel e à figura: o que cada símbolo do mapa é.
  const extras = (y, x = 0) => [
    `<circle cx="${x + 12}" cy="${y - 5}" r="3" fill="${CINZA_FOCO}" fill-opacity=".7"/>`,
    `<text x="${x + 32}" y="${y}" font-family="${SERIF}" font-size="15">${esc(L(`outros focos de 2024 (${nf(resto)})`, `other 2024 hotspots (${nf(resto)})`))}</text>`,
    `<rect x="${x}" y="${y + 12}" width="24" height="14" fill="${CANA_FUNDO}" stroke="#d8c9a6" stroke-width=".6"/>`,
    `<text x="${x + 32}" y="${y + 24}" font-family="${SERIF}" font-size="15">${esc(L('cana em 2024 (fundo)', 'sugarcane in 2024 (background)'))}</text>`,
  ].join('\n');
  return () => ({
    layout: 'um',
    motivo: fumaca,
    serie: serie(1),
    titulo: () => L('O que queimou em agosto', 'What August burned'),
    subtitulo: () => L('Três dias de 2024 e a terra sob os focos', 'Three days of 2024 and the land under the hotspots'),
    descricao: () => L(
      `Focos de calor de 22 a 24 de agosto de 2024 coloridos pela classe da MapBiomas que cobre a maior parte do km² em volta de cada um. ${NAO_E_AREA()}`,
      `Hotspots from 22 to 24 August 2024, coloured by the MapBiomas class covering most of the km² around each one. ${NAO_E_AREA()}`),
    raster: { r: cana, cor: (v) => (v === 1 ? CANA_FUNDO : null), recorte: 'limite' },
    mapa: () => ({
      preencher: () => NEUTRO,
      bordaMunicipio: 0.5,
      bordaRgint: 1,
      pontos: cinzas,
      chamadas: [{
        coord: pita.coord, dx: -150, dy: -300,
        titulo: L(`PITANGUEIRAS · ${pita.focos} FOCOS`, `PITANGUEIRAS · ${pita.focos} HOTSPOTS`),
        linhas: L([`${pct(pita.sob.cana)} de cana sob os focos;`, `a cana cobre ${pct(pita.pct_cana_municipio)} do município`],
          [`${pct(pita.sob.cana)} sugarcane under the hotspots;`, `cane covers ${pct(pita.pct_cana_municipio)} of the municipality`]),
      }, {
        coord: alti.coord, dx: 110, dy: -205,
        titulo: L(`ALTINÓPOLIS · ${alti.focos} FOCOS`, `ALTINÓPOLIS · ${alti.focos} HOTSPOTS`),
        linhas: L([`sob os focos, ${pct(nativaAlti)} de vegetação nativa,`, `${pct(alti.sob.silvicultura)} silvicultura e ${pct(alti.sob.cana)} cana`],
          [`under the hotspots, ${pct(nativaAlti)} native vegetation,`, `${pct(alti.sob.silvicultura)} tree plantation, ${pct(alti.sob.cana)} cane`]),
      }],
    }),
    sobreMapa: (proj) => destaque.map(([lon, lat, g]) => {
      const [x, y] = proj([lon, lat]);
      return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${R}" fill="${G[g].cor}" fill-opacity=".92" stroke="${PAPEL}" stroke-width=".6"/>`;
    }).join(''),
    legendaFigura: () => {
      const s = [rotuloPainel(L('FOCOS DE 22 A 24/08/2024', 'HOTSPOTS, 22–24/08/2024'), 0)];
      s.push(`<text x="0" y="22" font-family="${MONO}" font-size="12" fill="${CINZA}">${esc(L('classe que cobre a maior parte do km² em volta', 'class covering most of the km² around'))}</text>`);
      let y = 50;
      for (const g of G) {
        s.push(bola(g.cor, 12, y - 5, 6));
        s.push(`<text x="32" y="${y}" font-family="${SERIF}" font-size="15">${esc(L(g.rotulo, g.rotulo_en))}</text>`);
        y += 23;
      }
      s.push(extras(y + 6));
      return { svg: s.join('\n'), altura: y + 36, largura: 330, canto: 'sw' };
    },
    numeros: () => [
      [nf(c.n_22a24), [L('focos de 22 a 24/08,', 'hotspots on 22–24 Aug,'), L(`${pct((c.n_22a24 / c.n_2024) * 100)} dos ${nf(c.n_2024)} de 2024`, `${pct((c.n_22a24 / c.n_2024) * 100)} of 2024’s ${nf(c.n_2024)}`)]],
      [nf(d23), [L('só no dia 23: mais que', 'on the 23rd alone: more than'), L('os anos de 2022 e 2023', 'all of 2022 or 2023')]],
      [pct(gc.sob_22a24_pct), [L('da terra sob esses focos', 'of the land under them'), L(`era cana (${pct(gc.area_pct)} do estado)`, `was cane (${pct(gc.area_pct)} of the state)`)]],
      [`× ${nf(gc.sob_22a24_pct / gc.area_pct, 1)}`, [L('o peso da cana sob os focos', 'cane’s weight under the fire'), L('em relação ao do estado', 'relative to the state')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('A TERRA SOB OS FOCOS DE 22 A 24/08', 'THE LAND UNDER THE 22–24 AUG HOTSPOTS'), y)];
      y += 20;
      s.push(`<text x="0" y="${y}" font-family="${MONO}" font-size="12" fill="${CINZA}">${esc(L('% da área no km² em volta de cada foco · contorno: % do estado', '% of the area in the km² around each hotspot · outline: % of the state'))}</text>`);
      y += 28;
      const x0 = 216;
      const larg = LP - x0 - 96;
      const max = 50;
      for (const g of G) {
        const wa = (g.area_pct / max) * larg;
        const wf = (g.sob_22a24_pct / max) * larg;
        s.push(bola(g.cor, 8, y - 5, 6));
        s.push(`<text x="22" y="${y}" font-family="${SERIF}" font-size="14.5">${esc(L(g.rotulo, g.rotulo_en))}</text>`);
        s.push(`<rect x="${x0}" y="${y - 14}" width="${f1(Math.max(wf, 1))}" height="11" fill="${g.cor}" fill-opacity=".9"/>`);
        s.push(`<rect x="${x0}" y="${y - 14}" width="${f1(wa)}" height="11" fill="none" stroke="${TINTA}" stroke-width=".9"/>`);
        s.push(`<text x="${f1(x0 + Math.max(wa, wf) + 6)}" y="${y - 4}" font-family="${MONO}" font-size="12">${nf(g.sob_22a24_pct, 0)}</text>`);
        const raz = g.sob_22a24_pct / g.area_pct;
        s.push(`<text x="${LP}" y="${y - 4}" text-anchor="end" font-family="${MONO}" font-size="12.5" fill="${raz >= 1 ? '#6b3a1f' : CINZA}">× ${nf(raz, 1)}</text>`);
        y += 25;
      }
      s.push(`<text x="${LP}" y="${y - 4}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L('focos ÷ estado', 'hotspots ÷ state'))}</text>`);
      y += 14;
      s.push(extras(y));
      y += 64;
      // Agosto de 2024 dia a dia.
      s.push(rotuloPainel(L('FOCOS POR DIA · AGOSTO DE 2024', 'HOTSPOTS PER DAY · AUGUST 2024'), y));
      y += 18;
      const hMax = 86;
      const bw = LP / 31;
      const maxD = Math.max(...c.agosto_dias);
      c.agosto_dias.forEach((v, i) => {
        const h = (v / maxD) * hMax;
        const em = i >= 21 && i <= 23;
        s.push(`<rect x="${f1(i * bw + 1.5)}" y="${f1(y + hMax - h)}" width="${f1(bw - 3)}" height="${f1(Math.max(h, v ? 1 : 0))}" fill="${em ? gc.cor : '#b9bfc5'}"/>`);
      });
      s.push(`<path d="M0 ${y + hMax}H${LP}" stroke="${TINTA}" stroke-width=".8"/>`);
      s.push(`<text x="${f1(22 * bw + bw / 2 + 10)}" y="${y + 12}" font-family="${MONO}" font-size="12.5">${nf(d23)} ${L('no dia 23', 'on the 23rd')}</text>`);
      for (const dd of [1, 8, 15, 22, 29]) s.push(`<text x="${f1((dd - 1) * bw + bw / 2)}" y="${y + hMax + 16}" text-anchor="middle" font-family="${MONO}" font-size="11" fill="${CINZA}">${dd}</text>`);
      y += hMax + 44;
      const ago = c.agosto_dias.reduce((a, b) => a + b, 0);
      s.push(`<text x="0" y="${y}" font-family="${SERIF}" font-style="italic" font-size="15" fill="#4f4a41">${esc(L(
        `Os três dias somam ${nf(c.n_22a24)} dos ${nf(ago)} focos de agosto de 2024.`,
        `The three days account for ${nf(c.n_22a24)} of the ${nf(ago)} hotspots of August 2024.`))}</text>`);
      return { svg: s.join('\n'), y: y + 8 };
    },
    fontes: () => [
      L('INPE, BDQueimadas, satélite de referência, 2024', 'INPE, BDQueimadas, reference satellite, 2024'),
      L('MapBiomas, coleção 10, cobertura da terra 2024', 'MapBiomas, collection 10, land cover 2024'),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ 2 o mês do fogo */
async function mes() {
  const c = await ler('mes');
  const A = c.periodos[c.antes];
  const D = c.periodos[c.depois];
  const DL = c.deslocamento;
  const P = c.paleta;
  const cor = (doy) => P[Math.min(364, Math.max(0, Math.round(doy) - 1))];
  const rot = (k) => k.replace('_', '–');
  const mj = (p) => p.meses[4] + p.meses[5] + p.meses[6];
  const as = (p) => p.meses_pct[7] + p.meses_pct[8];
  let nh = 0;
  // Faixa do ano com as letras dos meses (a mesma paleta do mapa).
  const faixaAno = (larg) => {
    const id = `fh${nh++}`;
    const s = [hachura(id)];
    s.push(`<text x="0" y="-10" font-family="${MONO}" font-size="13" letter-spacing="1" fill="${CINZA}">${esc(L('DATA MÉDIA DOS FOCOS NO MUNICÍPIO', 'MEAN HOTSPOT DATE IN THE MUNICIPALITY'))}</text>`);
    const n = 73;
    for (let i = 0; i < n; i++) s.push(`<rect x="${f1((i * larg) / n)}" y="0" width="${f1(larg / n + 0.4)}" height="14" fill="${P[Math.floor(((i + 0.5) * 365) / n)]}"/>`);
    s.push(`<rect x="0" y="0" width="${larg}" height="14" fill="none" stroke="#1a211a" stroke-width=".6"/>`);
    MESES().forEach((m, i) => {
      const x0 = ((INICIO_MES[i] - 1) / 365) * larg;
      const x1 = ((INICIO_MES[i + 1] - 1) / 365) * larg;
      if (i) s.push(`<path d="M${f1(x0)} 0v19" stroke="#1a211a" stroke-width=".6"/>`);
      s.push(`<text x="${f1((x0 + x1) / 2)}" y="32" text-anchor="middle" font-family="${MONO}" font-size="12">${m[0].toUpperCase()}</text>`);
    });
    s.push(`<rect x="${larg + 26}" y="0" width="30" height="14" fill="url(#${id})" stroke="#1a211a" stroke-width=".6"/>`);
    s.push(`<text x="${larg + 64}" y="12" font-family="${MONO}" font-size="12" fill="${CINZA}">${esc(L(`< ${c.min_focos} focos ou`, `< ${c.min_focos} hotspots or`))}</text>`);
    s.push(`<text x="${larg + 64}" y="28" font-family="${MONO}" font-size="12" fill="${CINZA}">${esc(L('sem estação nítida', 'no clear season'))}</text>`);
    return s.join('\n');
  };
  const faixaDesloc = () => {
    const id = `fh${nh++}`;
    const larg = 34;
    const s = [hachura(id)];
    // Curta: na figura, a escala e a projeção ocupam o canto direito deste quadro.
    s.push(`<text x="0" y="-10" font-family="${MONO}" font-size="13" letter-spacing="1" fill="${CINZA}">${esc(L(`DIAS MAIS CEDO (−) OU MAIS TARDE (+) EM ${rot(c.depois)}`, `DAYS EARLIER (−) OR LATER (+) IN ${rot(c.depois)}`))}</text>`);
    c.cores_desloc.forEach((k, i) => s.push(`<rect x="${i * larg}" y="0" width="${larg}" height="14" fill="${k}" stroke="#1a211a" stroke-width=".6"/>`));
    c.lim_desloc.forEach((l, i) => s.push(`<text x="${(i + 1) * larg}" y="32" text-anchor="middle" font-family="${MONO}" font-size="12">${l > 0 ? '+' : l < 0 ? '−' : ''}${Math.abs(l)}</text>`));
    const xs = 7 * larg + 18;
    s.push(`<rect x="${xs}" y="0" width="24" height="14" fill="url(#${id})" stroke="#1a211a" stroke-width=".6"/>`);
    s.push(`<text x="${xs + 32}" y="12" font-family="${MONO}" font-size="12" fill="${CINZA}">${esc(L('sem comparação', 'no comparison'))}</text>`);
    return s.join('\n');
  };
  const muni = c.municipios;
  // O relógio do fogo: os doze meses em volta, a parte de cada um nos dois quinquênios e as datas médias.
  const relogio = (cx, cy) => {
    const s = [];
    const r0 = 28;
    const r1 = 118;
    const max = Math.max(...A.meses_pct, ...D.meses_pct);
    const ang = (doy) => ((doy - 1) / 365) * 2 * Math.PI - Math.PI / 2;
    const pt = (a, r) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const setor = (a0, a1, ra, rb) => {
      const [x0, y0] = pt(a0, ra); const [x1, y1] = pt(a0, rb); const [x2, y2] = pt(a1, rb); const [x3, y3] = pt(a1, ra);
      return `M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}A${rb} ${rb} 0 0 1 ${f1(x2)} ${f1(y2)}L${f1(x3)} ${f1(y3)}A${ra} ${ra} 0 0 0 ${f1(x0)} ${f1(y0)}Z`;
    };
    for (const k of [0.25, 0.5, 0.75, 1]) s.push(`<circle cx="${cx}" cy="${cy}" r="${f1(r0 + k * (r1 - r0))}" fill="none" stroke="#d5d9dd" stroke-width=".7"/>`);
    for (let i = 0; i < 12; i++) {
      const a0 = ang(INICIO_MES[i]) + 0.035;
      const a1 = ang(INICIO_MES[i + 1]) - 0.035;
      const meio = (INICIO_MES[i] + INICIO_MES[i + 1]) / 2;
      s.push(`<path d="${setor(a0, a1, r0, r0 + (D.meses_pct[i] / max) * (r1 - r0))}" fill="${cor(meio)}" fill-opacity=".95"/>`);
      s.push(`<path d="${setor(a0, a1, r0, r0 + (A.meses_pct[i] / max) * (r1 - r0))}" fill="none" stroke="${TINTA}" stroke-width="1.3"/>`);
      const [tx, ty] = pt(ang(meio), r1 + 36);
      s.push(`<text x="${f1(tx)}" y="${f1(ty + 4)}" text-anchor="middle" font-family="${MONO}" font-size="12" fill="${TINTA}">${MESES()[i]}</text>`);
    }
    // Anel do ano: a paleta do mapa.
    for (let d = 1; d <= 365; d += 5) {
      const a0 = ang(d);
      const a1 = ang(d + 5.4);
      s.push(`<path d="${setor(a0, a1, r1 + 10, r1 + 18)}" fill="${cor(d + 2)}"/>`);
    }
    // Datas médias do estado nos dois quinquênios.
    for (const [p, cheio] of [[A, false], [D, true]]) {
      const a = ang(p.dia_medio);
      const [x0, y0] = pt(a, r1 + 4);
      const [x1, y1] = pt(a, r1 + 26);
      s.push(`<path d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}" stroke="${TINTA}" stroke-width="1.6"/>`);
      s.push(`<circle cx="${f1(x1)}" cy="${f1(y1)}" r="4.5" fill="${cheio ? TINTA : PAPEL}" stroke="${TINTA}" stroke-width="1.4"/>`);
    }
    s.push(`<circle cx="${cx}" cy="${cy}" r="${r0 - 6}" fill="${PAPEL}" stroke="#d5d9dd" stroke-width=".7"/>`);
    return s.join('\n');
  };
  return () => ({
    layout: 'quatro',
    serie: serie(2),
    titulo: () => L('O mês do fogo', 'The month of fire'),
    subtitulo: () => L('A temporada se juntou no fim da seca', 'The season gathered at the end of the dry months'),
    descricao: () => L(
      `Data média (média circular das datas) dos focos de calor de cada município em ${rot(c.antes)}, quando a palha da cana ainda se queimava, e em ${rot(c.depois)}. ${NAO_E_AREA()}`,
      `Mean date (circular mean of the dates) of the hotspots in each municipality in ${rot(c.antes)}, when cane straw was still burnt, and in ${rot(c.depois)}. ${NAO_E_AREA()}`),
    mapas: () => [
      { titulo: `${rot(c.antes)} · ${L('DATA MÉDIA', 'MEAN DATE')}`, preencher: (cd) => (muni[cd]?.[0] == null ? null : cor(muni[cd][0])), legenda: faixaAno(470) },
      { titulo: `${rot(c.depois)} · ${L('DATA MÉDIA', 'MEAN DATE')}`, preencher: (cd) => (muni[cd]?.[1] == null ? null : cor(muni[cd][1])), legenda: faixaAno(470) },
      { titulo: L('QUANTO A DATA MÉDIA ANDOU', 'HOW FAR THE MEAN DATE MOVED'), preencher: (cd) => (muni[cd]?.[2] == null ? null : c.cores_desloc[muni[cd][2]]), legenda: faixaDesloc() },
    ],
    quartoQuadro: (w) => {
      const s = [];
      // O relógio sobe para o lado do localizador; as notas ficam embaixo.
      const cx = 500;
      const cy = -130;
      s.push(relogio(cx, cy));
      s.push(`<text x="${cx}" y="${cy - 188}" text-anchor="middle" font-family="${MONO}" font-size="13" letter-spacing="2" fill="${CINZA}">${esc(L('FOCOS POR MÊS NO ESTADO', 'HOTSPOTS PER MONTH, STATEWIDE'))}</text>`);
      let y = 64;
      const item = (desenho, texto) => {
        s.push(desenho);
        s.push(`<text x="40" y="${y}" font-family="${SERIF}" font-size="15">${esc(texto)}</text>`);
        y += 26;
      };
      item(`<rect x="0" y="${y - 13}" width="26" height="15" fill="none" stroke="${TINTA}" stroke-width="1.3"/>`,
        L(`${rot(c.antes)}: data média ${dataCurta(A.dia_medio)} (○)`, `${rot(c.antes)}: mean date ${dataCurta(A.dia_medio)} (○)`));
      item(`<rect x="0" y="${y - 13}" width="26" height="15" fill="${cor(232)}"/>`,
        L(`${rot(c.depois)}: data média ${dataCurta(D.dia_medio)} (●)`, `${rot(c.depois)}: mean date ${dataCurta(D.dia_medio)} (●)`));
      s.push(`<text x="0" y="${y + 2}" font-family="${MONO}" font-size="11.5" fill="${CINZA}">${esc(L('raio: % dos focos do quinquênio em cada mês · anel: a cor de cada data nos mapas', 'radius: % of the period’s hotspots in each month · ring: each date’s colour on the maps'))}</text>`);
      y += 40;
      s.push(rotuloPainel(L('COMO LER', 'HOW TO READ'), y));
      y += 26;
      const notas = L([
        `A cor marca o centro do calendário do fogo no município: a média circular das datas dos focos do quinquênio.`,
        `Hachura: menos de ${c.min_focos} focos no quinquênio, ou datas espalhadas pelo ano sem estação nítida (teste de Rayleigh, p ≥ ${nf(c.p_rayleigh, 2)}).`,
        `Foco é o pixel de ~1 km com fogo ativo na passagem da tarde do satélite de referência (Aqua); fogo de noite, sob nuvem ou pequeno escapa.`,
      ], [
        `The colour marks the centre of the municipality’s fire calendar: the circular mean of the period’s hotspot dates.`,
        `Hatched: fewer than ${c.min_focos} hotspots in the period, or dates spread over the year with no clear season (Rayleigh test, p ≥ ${nf(c.p_rayleigh, 2)}).`,
        `A hotspot is the ~1 km pixel with active fire on the reference satellite’s afternoon pass (Aqua); fire at night, under cloud or small fire is missed.`,
      ]);
      for (const n of notas) {
        const linhas = [];
        let atual = '';
        for (const p of n.split(' ')) {
          const t = atual ? `${atual} ${p}` : p;
          if (largura(t, 15, { italico: true }) > w - 10 && atual) { linhas.push(atual); atual = p; } else atual = t;
        }
        linhas.push(atual);
        linhas.forEach((l) => { s.push(`<text x="0" y="${y}" font-family="${SERIF}" font-style="italic" font-size="15" fill="#4f4a41">${esc(l)}</text>`); y += 21; });
        y += 8;
      }
      return s.join('\n');
    },
    numeros: () => [
      [L(`${nf(DL.estado_dias, 0)} dias`, `${nf(DL.estado_dias, 0)} days`), [L('mais tarde: a data média do', 'later: the state’s mean date'), L(`estado foi de ${dataCurta(A.dia_medio)} a ${dataCurta(D.dia_medio)}`, `went from ${dataCurta(A.dia_medio)} to ${dataCurta(D.dia_medio)}`)]],
      [pct(as(D)), [L('dos focos em agosto e', 'of hotspots in August and'), L(`setembro (${pct(as(A))} antes)`, `September (${pct(as(A))} before)`)]],
      [nf(mj(D)), [L('focos de maio a julho,', 'hotspots from May to July,'), L(`contra ${nf(mj(A))} em ${rot(c.antes)}`, `against ${nf(mj(A))} in ${rot(c.antes)}`)]],
      [`${nf(DL.mais_tarde)} / ${nf(DL.municipios)}`, [L('municípios comparáveis', 'comparable municipalities'), L('queimam mais tarde', 'now burn later')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('DATA MÉDIA DOS FOCOS NO ESTADO, ANO A ANO', 'STATE MEAN HOTSPOT DATE, YEAR BY YEAR'), y)];
      y += 22;
      const anos = c.por_ano;
      const x0 = 48;
      const bw = (LP - x0) / anos.length;
      const [d0, d1] = [182, 258]; // 1 jul a 15 set
      const h = 170;
      const yy = (d) => y + h - ((d - d0) / (d1 - d0)) * h;
      // Os dois quinquênios em faixa clara.
      for (const [a, b] of [[2003, 2007], [2020, 2024]]) {
        const i0 = anos.findIndex((k) => k.ano === a);
        s.push(`<rect x="${f1(x0 + i0 * bw)}" y="${y - 4}" width="${f1((b - a + 1) * bw)}" height="${h + 8}" fill="#eef0f1"/>`);
      }
      for (const [d, t] of [[182, L('1 jul', '1 Jul')], [213, L('1 ago', '1 Aug')], [244, L('1 set', '1 Sep')]]) {
        s.push(`<path d="M${x0} ${f1(yy(d))}H${LP}" stroke="#c9ced3" stroke-width=".7" stroke-dasharray="3 3"/>`);
        s.push(`<text x="0" y="${f1(yy(d) + 4)}" font-family="${MONO}" font-size="11" fill="${CINZA}">${t}</text>`);
      }
      for (const [p, cheio] of [[A, false], [D, true]]) {
        const i0 = cheio ? anos.length - 5 : 0;
        s.push(`<path d="M${f1(x0 + i0 * bw + 2)} ${f1(yy(p.dia_medio))}h${f1(5 * bw - 4)}" stroke="${TINTA}" stroke-width="1.6"/>`);
      }
      anos.forEach((k, i) => {
        const x = x0 + i * bw + bw / 2;
        const r = 2 + Math.sqrt(k.focos) / 16;
        s.push(`<circle cx="${f1(x)}" cy="${f1(yy(k.dia_medio))}" r="${f1(r)}" fill="${cor(k.dia_medio)}" stroke="${TINTA}" stroke-width=".6"/>`);
        if (k.ano % 5 === 0 || k.ano === 2003 || k.ano === 2024) s.push(`<text x="${f1(x)}" y="${y + h + 20}" text-anchor="middle" font-family="${MONO}" font-size="11" fill="${CINZA}">${k.ano}</text>`);
      });
      y += h + 38;
      s.push(`<text x="0" y="${y}" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L('círculo: tamanho pelo número de focos do ano · traço: média do quinquênio', 'circle: sized by the year’s hotspots · bar: mean of the five-year period'))}</text>`);
      y += 18;
      const ano = (a) => dataCurta(anos.find((k) => k.ano === a).dia_medio);
      const nota = L(`Muda bastante de um ano para outro: ${ano(2018)} em 2018, ${ano(2020)} em 2020.`,
        `It shifts a lot from year to year: ${ano(2018)} in 2018, ${ano(2020)} in 2020.`);
      s.push(`<text x="0" y="${y}" font-family="${SERIF}" font-style="italic" font-size="15" fill="#4f4a41">${esc(nota)}</text>`);
      // A parte de maio a julho em cada ano: o fogo do começo da seca, que encolheu.
      y += 44;
      s.push(rotuloPainel(L('PARTE DOS FOCOS DE MAIO A JULHO, ANO A ANO', 'SHARE OF HOTSPOTS FROM MAY TO JULY, YEAR BY YEAR'), y));
      y += 22;
      const hb = 96;
      const vmax = 60;
      const yb = (v) => y + hb - (v / vmax) * hb;
      for (const v of [0, 20, 40, 60]) {
        s.push(`<path d="M${x0} ${f1(yb(v))}H${LP}" stroke="${v ? '#c9ced3' : '#8a9096'}" stroke-width=".7"${v ? ' stroke-dasharray="3 3"' : ''}/>`);
        s.push(`<text x="0" y="${f1(yb(v) + 4)}" font-family="${MONO}" font-size="11" fill="${CINZA}">${v} %</text>`);
      }
      for (const [p, cheio] of [[A, false], [D, true]]) {
        const i0 = cheio ? anos.length - 5 : 0;
        const v = p.meses_pct[4] + p.meses_pct[5] + p.meses_pct[6];
        s.push(`<path d="M${f1(x0 + i0 * bw + 2)} ${f1(yb(v))}h${f1(5 * bw - 4)}" stroke="${TINTA}" stroke-width="1.6"/>`);
        const topo = Math.max(v, ...anos.slice(i0, i0 + 5).map((k) => k.maio_julho_pct));
        s.push(`<text x="${f1(x0 + i0 * bw + 2.5 * bw)}" y="${f1(yb(topo) - 6)}" text-anchor="middle" font-family="${MONO}" font-size="11" fill="${TINTA}">${v.toFixed(1).replace('.', L(',', '.'))} %</text>`);
      }
      anos.forEach((k, i) => {
        const x = x0 + i * bw + 3;
        s.push(`<rect x="${f1(x)}" y="${f1(yb(k.maio_julho_pct))}" width="${f1(bw - 6)}" height="${f1(yb(0) - yb(k.maio_julho_pct))}" fill="#6b4a7a" fill-opacity="${k.ano <= 2007 || k.ano >= 2020 ? 0.85 : 0.4}"/>`);
        if (k.ano % 5 === 0 || k.ano === 2003 || k.ano === 2024) s.push(`<text x="${f1(x + bw / 2 - 3)}" y="${y + hb + 18}" text-anchor="middle" font-family="${MONO}" font-size="11" fill="${CINZA}">${k.ano}</text>`);
      });
      y += hb + 36;
      const mj18 = Math.round(anos.find((k) => k.ano === 2018).maio_julho_pct);
      s.push(`<text x="0" y="${y}" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L(`traço: média do quinquênio · 2018, o ano de ${ano(2018)}, teve ${mj18} % dos focos nesses meses`, `bar: five-year mean · 2018, the ${ano(2018)} year, had ${mj18}% of its hotspots in these months`))}</text>`);
      return { svg: s.join('\n'), y: y + 10 };
    },
    fontes: () => [
      L('INPE, BDQueimadas, satélite de referência, 2003–2024', 'INPE, BDQueimadas, reference satellite, 2003–2024'),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ 3 o fogo mudou de lugar */
async function lugar() {
  const c = await ler('lugar');
  const C = c.cores;
  const rot = (k) => k.replace('_', '–');
  const reg = Object.fromEntries(c.regioes.map((r) => [r.nome, r]));
  const soro = reg.Sorocaba;
  const rp = reg['Ribeirão Preto'];
  const srp = reg['São José do Rio Preto'];
  const queda = c.maiores_quedas[0];
  const alta = c.maiores_altas[0];
  const var_ = (r) => (r.razao - 1) * 100;
  const sinal = (v) => `${v > 0 ? '+' : '−'}${nf(Math.abs(v), 0)} %`;
  const faixaDif = (larg = 56) => {
    const s = [];
    C.forEach((k, i) => s.push(`<rect x="${i * larg}" y="0" width="${larg}" height="14" fill="${k}" stroke="#1a211a" stroke-width=".6"/>`));
    c.lim.forEach((l, i) => s.push(`<text x="${(i + 1) * larg}" y="32" text-anchor="middle" font-family="${MONO}" font-size="12">${l > 0 ? '+' : '−'}${nf(Math.abs(l), Math.abs(l) % 1 ? 1 : 0)}</text>`));
    s.push(`<text x="0" y="32" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L('menos', 'fewer'))}</text>`);
    s.push(`<text x="${7 * larg}" y="32" text-anchor="end" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L('mais', 'more'))}</text>`);
    return s.join('\n');
  };
  const contornoCana = (y) => `<rect x="0" y="${y - 13}" width="34" height="16" fill="none" stroke="${TINTA}" stroke-width="2.2"/>
<text x="46" y="${y}" font-family="${SERIF}" font-size="15">${esc(L('metade ou mais da terra em cana (2024)', 'half or more of the land in cane (2024)'))}</text>`;
  const titLeg = () => L(`FOCOS POR 100 KM² POR ANO · ${rot(c.depois)} MENOS ${rot(c.antes)}`, `HOTSPOTS PER 100 KM² PER YEAR · ${rot(c.depois)} MINUS ${rot(c.antes)}`);
  return () => ({
    layout: 'um',
    motivo: fumaca,
    serie: serie(3),
    titulo: () => L('O fogo mudou de lugar', 'Fire moved'),
    subtitulo: () => L('O mesmo número de focos, mais perto da cana', 'The same number of hotspots, closer to the cane'),
    descricao: () => L(
      `Diferença nos focos de calor por 100 km² por ano entre ${rot(c.antes)} e ${rot(c.depois)}, em cada município, com o contorno dos que têm metade ou mais da terra em cana. ${NAO_E_AREA()}`,
      `Change in hotspots per 100 km² per year between ${rot(c.antes)} and ${rot(c.depois)} in each municipality, with the outline of those with half or more of their land in cane. ${NAO_E_AREA()}`),
    mapa: () => ({
      preencher: (cd) => C[c.municipios[cd]] ?? null,
      bordaMunicipio: 0.4,
      bordaRgint: 0.9,
      camadas: [{ feats: c.cana_metade.features, cor: 'none', borda: TINTA, largura: 2.2 }],
      chamadas: [{
        coord: queda.coord, dx: 170, dy: 150,
        titulo: L(`${queda.nome.toUpperCase()} · ${queda.antes} → ${queda.depois} FOCOS`, `${queda.nome.toUpperCase()} · ${queda.antes} → ${queda.depois} HOTSPOTS`),
        linhas: L([`no alto Ribeira, sem cana: de ${nf(queda.dens_antes, 1)} para`, `${nf(queda.dens_depois, 1)} focos por 100 km² por ano`],
          [`in the upper Ribeira, no cane: from ${nf(queda.dens_antes, 1)} to`, `${nf(queda.dens_depois, 1)} hotspots per 100 km² per year`]),
      }, {
        coord: alta.coord, dx: -60, dy: -285,
        titulo: L(`${alta.nome.toUpperCase()} · ${alta.antes} → ${alta.depois} FOCOS`, `${alta.nome.toUpperCase()} · ${alta.antes} → ${alta.depois} HOTSPOTS`),
        linhas: L([`de ${nf(alta.dens_antes, 1)} para ${nf(alta.dens_depois, 1)} focos por 100 km²`, `por ano; ${pct(alta.pct_cana)} da terra é cana`],
          [`from ${nf(alta.dens_antes, 1)} to ${nf(alta.dens_depois, 1)} hotspots per 100 km²`, `per year; ${pct(alta.pct_cana)} of the land is cane`]),
      }],
    }),
    legendaFigura: () => {
      const s = [rotuloPainel(titLeg(), 0)];
      s.push(`<g transform="translate(0 22)">${faixaDif(52)}</g>`);
      s.push(contornoCana(88));
      return { svg: s.join('\n'), altura: 96, largura: 520, canto: 'sw' };
    },
    numeros: () => [
      [nf(c.focos_antes), [L(`focos em ${rot(c.antes)}`, `hotspots in ${rot(c.antes)}`)]],
      [nf(c.focos_depois), [L(`em ${rot(c.depois)}: ${nf(c.dens_depois, 1)} por`, `in ${rot(c.depois)}: ${nf(c.dens_depois, 1)} per`), L('100 km² por ano nos dois', '100 km² per year in both')]],
      [sinal(var_(soro)), [L('na região de Sorocaba,', 'in the Sorocaba region,'), L(`com ${pct(soro.pct_cana)} de cana`, `with ${pct(soro.pct_cana)} cane`)]],
      [sinal(var_(rp)), [L('nas de Ribeirão Preto e', 'in the Ribeirão Preto and'), L('São José do Rio Preto', 'São José do Rio Preto regions')]],
    ],
    painel: (y) => {
      // No painel o título vai em duas linhas: em inglês ele não cabe numa.
      const s = [rotuloPainel(L('FOCOS POR 100 KM² POR ANO, POR MUNICÍPIO', 'HOTSPOTS PER 100 KM² PER YEAR, BY MUNICIPALITY'), y)];
      s.push(`<text x="0" y="${y + 20}" font-family="${MONO}" font-size="12" fill="${CINZA}">${esc(L(`${rot(c.depois)} menos ${rot(c.antes)}`, `${rot(c.depois)} minus ${rot(c.antes)}`))}</text>`);
      s.push(`<g transform="translate(0 ${y + 42})">${faixaDif(56)}</g>`);
      y += 108;
      s.push(contornoCana(y));
      y += 46;
      // Ano a ano no estado, com os dois quinquênios marcados e os marcos da queima da palha.
      s.push(rotuloPainel(L('FOCOS POR ANO EM SÃO PAULO', 'HOTSPOTS PER YEAR IN SÃO PAULO'), y));
      y += 22;
      const anos = Object.entries(c.anos).map(([a, v]) => [+a, v]);
      const hMax = 100;
      const bw = LP / anos.length;
      const max = Math.max(...anos.map(([, v]) => v));
      anos.forEach(([a, v], i) => {
        const h = (v / max) * hMax;
        const em = a <= 2007 || a >= 2020;
        s.push(`<rect x="${f1(i * bw + 2)}" y="${f1(y + 12 + hMax - h)}" width="${f1(bw - 4)}" height="${f1(h)}" fill="${em ? '#6d7165' : '#c9ced3'}"/>`);
        if (a === 2003 || a === 2024 || a === 2010) s.push(`<text x="${f1(i * bw + bw / 2)}" y="${f1(y + 12 + hMax - h - 5)}" text-anchor="middle" font-family="${MONO}" font-size="11">${nf(v)}</text>`);
      });
      s.push(`<path d="M0 ${y + 12 + hMax}H${LP}" stroke="${TINTA}" stroke-width=".8"/>`);
      const xa = (a) => (a - 2003) * bw;
      for (const [a, t] of [[2007, L('protocolo', 'protocol')], [2014, L('prazo 1', 'deadline 1')], [2017, L('prazo 2', 'deadline 2')], [2021, L('lei', 'law')]]) {
        s.push(`<path d="M${f1(xa(a))} ${y + 8}V${y + 12 + hMax}" stroke="${TINTA}" stroke-width=".8" stroke-dasharray="2 2"/>`);
        s.push(`<text x="${f1(xa(a) + 3)}" y="${y + 6}" font-family="${MONO}" font-size="10.5" fill="${CINZA}">${t}</text>`);
      }
      for (const a of [2003, 2008, 2013, 2018, 2024]) s.push(`<text x="${f1(xa(a) + bw / 2)}" y="${y + hMax + 28}" text-anchor="middle" font-family="${MONO}" font-size="11" fill="${CINZA}">${a}</text>`);
      y += hMax + 44;
      s.push(`<text x="0" y="${y}" font-family="${MONO}" font-size="10.5" fill="${CINZA}">${esc(L('Protocolo Agroambiental (2007): fim da queima em 2014 nas áreas', 'Agro-environmental Protocol (2007): burning to end in 2014 on'))}</text>`);
      s.push(`<text x="0" y="${y + 15}" font-family="${MONO}" font-size="10.5" fill="${CINZA}">${esc(L('mecanizáveis e em 2017 nas demais; Lei 11.241/2002: 2021 e 2031', 'mechanisable land, 2017 elsewhere; State Law 11,241/2002: 2021 and 2031'))}</text>`);
      y += 46;
      // Por faixa de cana: a densidade nos dois quinquênios.
      s.push(rotuloPainel(L('FOCOS POR 100 KM² POR ANO, PELA PARTE EM CANA', 'HOTSPOTS PER 100 KM² PER YEAR, BY CANE SHARE'), y));
      y += 28;
      const maxF = Math.max(...c.faixas.flatMap((f) => [f.dens_antes, f.dens_depois]));
      const x0 = 150;
      const larg = LP - x0 - 165;
      for (const f of c.faixas) {
        const wa = (f.dens_antes / maxF) * larg;
        const wd = (f.dens_depois / maxF) * larg;
        s.push(`<text x="0" y="${y}" font-family="${SERIF}" font-size="15">${esc(L(f.rotulo, f.rotulo_en))}</text>`);
        s.push(`<rect x="${x0}" y="${y - 15}" width="${f1(wa)}" height="7" fill="${PAPEL}" stroke="${TINTA}" stroke-width=".8"/>`);
        s.push(`<rect x="${x0}" y="${y - 6}" width="${f1(wd)}" height="7" fill="${C[6]}"/>`);
        s.push(`<text x="${f1(x0 + Math.max(wa, wd) + 6)}" y="${y}" font-family="${MONO}" font-size="12">${nf(f.dens_antes, 1)} → ${nf(f.dens_depois, 1)}</text>`);
        s.push(`<text x="${LP}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="12" fill="${f.dens_depois < f.dens_antes ? '#234e70' : '#6b3a1f'}">${sinal((f.dens_depois / f.dens_antes - 1) * 100)}</text>`);
        y += 27;
      }
      s.push(`<rect x="0" y="${y - 6}" width="22" height="7" fill="${PAPEL}" stroke="${TINTA}" stroke-width=".8"/>`);
      s.push(`<text x="30" y="${y + 1}" font-family="${MONO}" font-size="11" fill="${CINZA}">${rot(c.antes)}</text>`);
      s.push(`<rect x="120" y="${y - 6}" width="22" height="7" fill="${C[6]}"/>`);
      s.push(`<text x="150" y="${y + 1}" font-family="${MONO}" font-size="11" fill="${CINZA}">${rot(c.depois)}</text>`);
      s.push(`<text x="${LP}" y="${y + 1}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L('% da terra em cana, 2024', '% of land in cane, 2024'))}</text>`);
      return { svg: s.join('\n'), y: y + 8 };
    },
    fontes: () => [
      L(`INPE, BDQueimadas, satélite de referência, 2003–2024`, `INPE, BDQueimadas, reference satellite, 2003–2024`),
      L('MapBiomas, coleção 10, cobertura da terra 2024', 'MapBiomas, collection 10, land cover 2024'),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { agosto, mes, lugar };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/fogo-sp/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
const e = SERIE.find((s) => s.tema === nome);
const fazer = await TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => fazer() });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `fogo-sp-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
