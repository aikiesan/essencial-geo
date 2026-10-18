#!/usr/bin/env node
/**
 * Coleção «Do campo ao biometano» — desenha uma prancha a partir do cache de preparar.py (uso interno).
 *
 *   node scripts/colecoes/agro-sp/prancha.mjs cana|laranja|graos|urbano|sintese
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  RAIZ, LP, SERIF, MONO, TINTA, CINZA, ZERO, PAPEL, esc, nf, f1, lingua, largura, linhasDe,
  gerarPrancha, legendaClasses, legendaFaixa, rotuloPainel,
} from '../lib/prancha-sp.mjs';
import { legendaCirculos } from '../lib/arte.mjs';

export const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'agro-sp', 'serie.json'), 'utf8'));
const CANA = ['#f3efd9', '#dfe0a8', '#b8c97f', '#86ad5f', '#558a45', '#2b6233'];
const LARANJA = ['#fdf0d9', '#fdd49e', '#fdbb84', '#fc8d59', '#e34a33', '#b30000'];
const SOJA = ['#f7f1dc', '#ecdcab', '#dcc07a', '#c39a4c', '#9c712c', '#6b4a1a'];
const MILHO = ['#fbf6d0', '#f2e58f', '#d9cf55', '#a9b33a', '#748f2d', '#465f22'];
const METANO = ['#e6f1f1', '#bcdcdc', '#86c0c3', '#4f9ea8', '#2a7a8c', '#174f66'];
const DIVERGE = ['#8c510a', '#d8b365', '#efe9dc', '#9fcfc3', '#35978f', '#01665e'];
const MIN = { argila: '#9c4a32', azul_profundo: '#234e70' };
const GRUPO = {
  cana: ['#5b7f3a', 'Cana', 'Sugarcane'],
  lavouras: ['#c99a2e', 'Outras lavouras', 'Other crops'],
  pecuaria: [MIN.argila, 'Pecuária', 'Livestock'],
  urbano: [MIN.azul_profundo, 'Lixo e esgoto', 'Waste and sewage'],
};
const NEUTRO = '#f1f2f3';

const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `agro-sp-${nome}.json`), 'utf8'));
const L = (pt, en) => (lingua() === 'en' ? en : pt);
const serie = (i) => () => L(`DO CAMPO AO BIOMETANO · ${i}/6`, `FROM FIELD TO BIOMETHANE · ${i}/6`);
const casas = (v) => (v < 1 ? 2 : v < 10 ? 1 : 0);
const cor = (paleta) => (k) => (k === null || k === undefined ? null : k === 0 ? ZERO : paleta[k - 1]);
const mil = (v, c = 0) => nf(v / 1000, c);
const CP2B = () => L('CP2B (Unicamp), método v5.1, 2026', 'CP2B (Unicamp), method v5.1, 2026');
const MALHA = () => L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025');

/** Lista "nome ........ valor" do painel. */
function lista(itens, y, { tamanho = 18, passo = 26, x = 0, larg = LP } = {}) {
  const s = [];
  itens.forEach(([nome, valor], i) => {
    const yy = y + i * passo;
    s.push(`<text x="${x}" y="${yy}" font-family="${SERIF}" font-size="${tamanho}">${esc(nome)}</text>`);
    s.push(`<text x="${x + larg}" y="${yy}" text-anchor="end" font-family="${MONO}" font-size="${tamanho - 3}">${esc(valor)}</text>`);
    const x0 = x + largura(nome, tamanho) + 10;
    const x1 = x + larg - largura(valor, tamanho - 3, { mono: true }) - 10;
    if (x1 > x0) s.push(`<path d="M${x0} ${yy - 4}H${x1}" stroke="#c4c9ce" stroke-width="1" stroke-dasharray="1 4"/>`);
  });
  return { svg: s.join('\n'), y: y + itens.length * passo };
}

/** Colunas por ano (série da PAM): { ano: valor }; rotula o primeiro, o último e o maior. */
function colunas(serieAnos, y, { cor: cc, borda, hMax = 92, fmt, larg = LP, x = 0 }) {
  const anos = Object.keys(serieAnos).map(Number).sort((a, b) => a - b);
  const vals = anos.map((a) => serieAnos[a]);
  const max = Math.max(...vals);
  const bw = larg / anos.length;
  const s = [];
  anos.forEach((a, i) => {
    const h = (vals[i] / max) * hMax;
    const xx = x + i * bw;
    s.push(`<rect x="${f1(xx + 2.5)}" y="${f1(y + hMax - h)}" width="${f1(bw - 5)}" height="${f1(h)}" fill="${cc}" stroke="${borda}" stroke-width=".6"/>`);
    if (i === 0 || i === anos.length - 1 || vals[i] === max)
      s.push(`<text x="${f1(xx + bw / 2)}" y="${f1(y + hMax - h - 6)}" text-anchor="middle" font-family="${MONO}" font-size="11.5">${fmt(vals[i])}</text>`);
    if (i % 4 === 0 || i === anos.length - 1)
      s.push(`<text x="${f1(xx + bw / 2)}" y="${y + hMax + 16}" text-anchor="middle" font-family="${MONO}" font-size="11" fill="${CINZA}">${a}</text>`);
  });
  return { svg: s.join('\n'), y: y + hMax + 22 };
}

/** Legenda de pontos: [[cor, rótulo, raio]]. */
function legendaPontos(itens, y, { passo = 28, tamanho = 17, x = 0 } = {}) {
  const s = [];
  itens.forEach(([c, rot, r], i) => {
    const yy = y + i * passo;
    s.push(`<circle cx="${x + 17}" cy="${yy - 6}" r="${r}" fill="${c}" fill-opacity=".9" stroke="${PAPEL}" stroke-width="1"/>`);
    s.push(`<text x="${x + 44}" y="${yy}" font-family="${SERIF}" font-size="${tamanho}">${esc(rot)}</text>`);
  });
  return { svg: s.join('\n'), y: y + itens.length * passo };
}

/** Texto corrido do quarto quadro. */
function paragrafos(w, textos, { t = 17, y = 34, titulo, yTitulo = 0 } = {}) {
  const s = [`<text x="0" y="${yTitulo}" font-family="${MONO}" font-size="13" letter-spacing="2.4" fill="${CINZA}">${esc(titulo ?? L('COMO LER', 'HOW TO READ'))}</text>`];
  for (const txt of textos) {
    const ls = linhasDe(txt, t, w);
    ls.forEach((l, i) => s.push(`<text x="0" y="${y + i * 24}" font-family="${SERIF}" font-size="${t}" fill="${TINTA}">${esc(l)}</text>`));
    y += ls.length * 24 + 14;
  }
  return { svg: s.join('\n'), y };
}

/** Faixa divergente da variação (seis classes, sem caixa de zero). */
function legendaVar(limites, { larg = 58 } = {}) {
  const s = [];
  DIVERGE.forEach((c, i) => s.push(`<rect x="${i * larg}" y="0" width="${larg}" height="14" fill="${c}" stroke="#1a211a" stroke-width=".6"/>`));
  limites.forEach((l, i) => s.push(`<text x="${(i + 1) * larg}" y="32" text-anchor="middle" font-family="${MONO}" font-size="12" fill="${TINTA}">${l > 0 ? '+' : ''}${nf(l)}</text>`));
  s.push(`<text x="${6 * larg + 16}" y="12" font-family="${MONO}" font-size="12" fill="${CINZA}">p.p.</text>`);
  return s.join('\n');
}

/* ------------------------------------------------------------------ 2/6 cana 2008 × 2024 */
async function cana() {
  const c = await ler('cana');
  const [a0, a1] = c.anos;
  const pct = (a) => (c.area[a] / 100 / c.area_sp_km2) * 100;
  const cresc = (c.area[a1] / c.area[a0] - 1) * 100;
  const rotPct = c.classes.slice(0, -1).map((v) => nf(v));
  const g = c.maiores_ganhos[0];
  const p = c.maiores_perdas[0];
  const mapa = (i, titulo, paleta, legenda, extra = {}) => ({
    titulo,
    preencher: (cd) => (i === 2 ? (c.valores[cd]?.[2] ?? null) === null ? null : DIVERGE[c.valores[cd][2]] : cor(paleta)(c.valores[cd]?.[i] ?? null)),
    legenda,
    ...extra,
  });
  return () => ({
    layout: 'quatro',
    motivo: 'agro',
    serie: serie(2),
    titulo: () => L('Cana: 2008 × 2024', 'Cane: 2008 × 2024'),
    subtitulo: () => L('Em dezesseis anos, a mancha andou para o oeste', 'In sixteen years, the patch moved west'),
    descricao: () => L(`Área colhida de cana como parte do território de cada município, em ${a0} e em ${a1}, e a diferença entre os dois anos`,
      `Harvested cane area as a share of each municipality’s territory, in ${a0} and ${a1}, and the difference between the two years`),
    mapas: () => [
      mapa(0, `${L('CANA', 'CANE')} ${a0} · ${L('% DO TERRITÓRIO', '% OF TERRITORY')}`, CANA,
        legendaFaixa(CANA, rotPct, { larg: 58, id: 'lfc0' })),
      mapa(1, `${L('CANA', 'CANE')} ${a1} · ${L('% DO TERRITÓRIO', '% OF TERRITORY')}`, CANA,
        legendaFaixa(CANA, rotPct, { larg: 58, id: 'lfc1' })),
      mapa(2, `${L('DIFERENÇA', 'CHANGE')} ${a0}–${a1}`, null, legendaVar(c.var), {
        destaques: [...c.maiores_ganhos.slice(0, 2), p].map((m) => ({ cd: m.cd, texto: m.nome })),
        tamanhoDestaque: 12,
      }),
    ],
    quartoQuadro: (w) => paragrafos(w, [
      L(`Mesmas classes nos dois anos: área colhida dividida pela área do município. Acima de 60 %, a cana cobre quase tudo o que não é cidade, mata ou rio.`,
        `Same classes in both years: harvested area divided by the municipality’s area. Above 60%, cane covers almost everything that is not town, forest or river.`),
      L(`Na diferença, verde é ganho e marrom é perda, em pontos percentuais do território: ${c.ganharam_10} municípios ganharam mais de 10 pontos; ${c.perderam_10} perderam mais de 10.`,
        `In the change map, green is gain and brown is loss, in percentage points of territory: ${c.ganharam_10} municipalities gained more than 10 points; ${c.perderam_10} lost more than 10.`),
      L(`Em hectares, os maiores ganhos estão no oeste: ${c.ganho_ha[0].nome} colheu ${nf(c.ganho_ha[0].valor)} ha a mais, ${c.ganho_ha[1].nome} ${nf(c.ganho_ha[1].valor)}. As maiores perdas relativas ficam em ${p.nome} e ${c.maiores_perdas[2].nome}, perto de Campinas.`,
        `In hectares, the largest gains are in the west: ${c.ganho_ha[0].nome} harvested ${nf(c.ganho_ha[0].valor)} ha more, ${c.ganho_ha[1].nome} ${nf(c.ganho_ha[1].valor)}. The largest relative losses are in ${p.nome} and ${c.maiores_perdas[2].nome}, near Campinas.`),
    ]).svg,
    numeros: () => [
      [`${nf(c.area[a0] / 1e6, 2)} → ${nf(c.area[a1] / 1e6, 2)}`, [L('milhões de hectares colhidos', 'million hectares harvested'), `${a0} → ${a1}`]],
      [`+${nf(cresc, 0)} %`, [L('de área colhida', 'in harvested area'), L(`em ${a1 - a0} anos`, `in ${a1 - a0} years`)]],
      [`${c.acima_50[a0]} → ${c.acima_50[a1]}`, [L('municípios com mais da', 'municipalities with over'), L('metade do território em cana', 'half their territory in cane')]],
      [`${nf(pct(a1), 1)} %`, [L('do estado colhido', 'of the state harvested'), L(`em cana em ${a1}`, `as cane in ${a1}`)]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('ÁREA COLHIDA EM SP (MILHÕES DE HA)', 'HARVESTED AREA IN SP (MILLION HA)'), y)];
      const col = colunas(c.serie_area, y + 34, { cor: CANA[3], borda: CANA[5], fmt: (v) => nf(v / 1e6, 2) });
      s.push(col.svg);
      y = col.y + 26;
      s.push(rotuloPainel(L('MAIORES GANHOS (P.P. DO TERRITÓRIO)', 'LARGEST GAINS (P.P. OF TERRITORY)'), y));
      const l = lista(c.maiores_ganhos.slice(0, 4).map((m) => [m.nome, `+${nf(m.valor, 1)}`]), y + 32, { passo: 25, tamanho: 17 });
      s.push(l.svg);
      return { svg: s.join('\n'), y: l.y };
    },
    fontes: () => [L(`IBGE, PAM ${a0} e ${a1} (tabela 1612)`, `IBGE, PAM ${a0} and ${a1} (table 1612)`), MALHA()],
  });
}

/* ------------------------------------------------------------------ 3/6 laranja */
async function laranja() {
  const c = await ler('laranja');
  const [a0, a1] = c.anos;
  const queda = (1 - c.area[a1] / c.area[a0]) * 100;
  const fx = (v) => mil(v, v < 1e4 ? 1 : 0);
  const rot = (i) => (i ? `${fx(c.quebras[i - 1])} – ${fx(c.quebras[i])}` : L(`até ${fx(c.quebras[0])}`, `up to ${fx(c.quebras[0])}`));
  const deixou = new Set(c.deixaram_cds);
  const top = c.maiores[0];
  const fab = [...c.fabricas].sort((a, b) => b.v - a.v)[0];
  const raio = (v) => 3 + 0.16 * Math.sqrt(v);
  const [r0, r1] = [c.rendimento[a0], c.rendimento[a1]];
  return () => ({
    layout: 'um',
    motivo: 'agro',
    serie: serie(3),
    titulo: () => L('O cinturão da laranja', 'The orange belt'),
    subtitulo: () => L('O pomar no campo, o bagaço na fábrica', 'The grove in the field, the bagasse at the mill'),
    descricao: () => L(`Produção de laranja por município em ${a1}, com listras onde a laranja sumiu desde ${a0}; os círculos são o biometano que o bagaço daria nas fábricas de suco`,
      `Orange production by municipality in ${a1}, striped where oranges have vanished since ${a0}; circles show the biomethane the bagasse could give at the juice mills`),
    mapa: () => ({
      preencher: (cd) => cor(LARANJA)(c.valores[cd] ?? null),
      hachura: { cds: deixou, cor: '#c2410c', passo: 5, largura: 1.1, angulo: -50 },
      destaques: c.maiores.slice(1, 5).map((m) => ({ cd: m.cd, texto: m.nome })),
      tamanhoDestaque: 15,
      pontos: c.fabricas.map((f) => ({ coord: f.coord, r: raio(f.v), cor: METANO[4], opacidade: 0.82, bordaLargura: 1.4 })),
      chamadas: [{
        cd: top.cd, dx: 60, dy: -250,
        titulo: `${top.nome.toUpperCase()} · ${nf(top.valor / 1e3, 0)} ${L('MIL T', 'THOUSAND T')}`,
        linhas: L(['o maior produtor de laranja do estado'], ['the state’s largest orange grower']),
      }, {
        coord: fab.coord, dx: -40, dy: -450,
        titulo: `${fab.nome.toUpperCase()} · ${nf(fab.v)} M³/${L('DIA', 'DAY')}`,
        linhas: L(['o bagaço fica onde a laranja vira suco'], ['the bagasse stays where oranges become juice']),
      }],
    }),
    numeros: () => [
      [`${nf(c.producao[a1] / 1e6, 1)} mi t`, [L('de laranja colhidas', 'of oranges harvested'), L(`em ${a1}`, `in ${a1}`)]],
      [`−${nf(queda, 0)} %`, [L('de área colhida', 'in harvested area'), `${a0} → ${a1}`]],
      [`${nf(r0, 0)} → ${nf(r1, 0)} t`, [L('de laranja por hectare', 'of oranges per hectare'), `${a0} → ${a1}`]],
      [`${mil(c.biometano_m3_dia, 0)} mil m³`, [L('de biometano por dia', 'of biomethane per day'), L('no bagaço (CP2B)', 'in the bagasse (CP2B)')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L(`PRODUÇÃO EM ${a1} (MIL T)`, `PRODUCTION IN ${a1} (THOUSAND T)`), y)];
      const itens = [[ZERO, L('zero', 'zero')], ...c.quebras.map((_, i) => [LARANJA[i], rot(i)]), [null, L('sem informação', 'no data')]];
      const l1 = legendaClasses(itens.slice(0, 4), { y: y + 16, passo: 27, tamanho: 16, id: 'lgl1' });
      const l2 = legendaClasses(itens.slice(4), { x: LP / 2 + 8, y: y + 16, passo: 27, tamanho: 16, id: 'lgl2' });
      s.push(l1.svg, l2.svg);
      y += 16 + l1.altura + 6;
      s.push(`<defs><pattern id="lglx" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-50)"><rect width="5" height="5" fill="${ZERO}"/><path d="M0 0V5" stroke="#c2410c" stroke-width="1.1"/></pattern></defs>`);
      s.push(`<rect x="0" y="${y}" width="34" height="19" fill="url(#lglx)" stroke="#1a211a" stroke-width=".8"/>`);
      s.push(`<text x="50" y="${y + 15}" font-family="${SERIF}" font-size="16">${esc(L(`listras: ${c.deixaram} municípios deixaram a laranja`, `stripes: ${c.deixaram} municipalities gave up oranges`))}</text>`);
      y += 58;
      s.push(rotuloPainel(L('ÁREA COLHIDA EM SP (MIL HA)', 'HARVESTED AREA IN SP (THOUSAND HA)'), y));
      const col = colunas(c.serie_area, y + 34, { cor: LARANJA[2], borda: LARANJA[4], fmt: (v) => mil(v, 0), hMax: 80 });
      s.push(col.svg);
      y = col.y + 24;
      s.push(rotuloPainel(L(`BAGAÇO NAS FÁBRICAS DE SUCO (M³/DIA)`, `BAGASSE AT THE JUICE MILLS (M³/DAY)`), y));
      const lc = legendaCirculos([20000, 5000, 1000], raio, (v) => nf(v), { y: y + 20, cor: METANO[4] });
      s.push(lc.svg);
      const l = lista(c.biometano_maiores.slice(0, 3).map((m) => [m.nome, nf(m.valor)]), y + 46, { x: 160, larg: LP - 160, passo: 24, tamanho: 16 });
      s.push(l.svg);
      return { svg: s.join('\n'), y: Math.max(y + 20 + lc.altura, l.y) + 4 };
    },
    fontes: () => [L(`IBGE, PAM ${a0} a ${a1} (tabela 1613)`, `IBGE, PAM ${a0}–${a1} (table 1613)`), CP2B(), MALHA()],
  });
}

/* ------------------------------------------------------------------ 4/6 milho e soja */
async function graos() {
  const c = await ler('graos');
  const [a0, a1] = c.anos;
  const q = c.quebras;
  const lf = (k, paleta, id, fmt = (v) => nf(v, casas(v))) => legendaFaixa(paleta.slice(0, q[k].length), q[k].slice(0, -1).map(fmt), { larg: 58, id });
  const so = c.series.soja.area;
  const mi = c.series.milho.area;
  return () => ({
    layout: 'quatro',
    motivo: 'agro',
    serie: serie(4),
    titulo: () => L('Milho e soja', 'Maize and soybean'),
    subtitulo: () => L('A soja passou o milho, e a palha ficou no chão', 'Soybean overtook maize, and the straw stayed on the ground'),
    descricao: () => L(`Área colhida de soja e de milho em ${a1} como parte do território, e o biometano que as palhas dariam`,
      `Harvested soybean and maize area in ${a1} as a share of territory, and the biomethane the straw could give`),
    mapas: () => [
      { titulo: `${L('SOJA', 'SOYBEAN')} ${a1} · ${L('% DO TERRITÓRIO', '% OF TERRITORY')}`, preencher: (cd) => cor(SOJA)(c.valores[cd]?.[0] ?? null), legenda: lf('soja_pct', SOJA, 'lfs') },
      { titulo: `${L('MILHO', 'MAIZE')} ${a1} · ${L('% DO TERRITÓRIO', '% OF TERRITORY')}`, preencher: (cd) => cor(MILHO)(c.valores[cd]?.[1] ?? null), legenda: lf('milho_pct', MILHO, 'lfm') },
      {
        titulo: `${L('PALHAS · BIOMETANO M³/DIA', 'STRAW · BIOMETHANE M³/DAY')}`,
        preencher: (cd) => cor(METANO)(c.valores[cd]?.[2] ?? null),
        legenda: lf('palhas_m3_dia', METANO, 'lfp', (v) => nf(v)),
        destaques: c.palhas_maiores.slice(0, 2).map((m) => ({ cd: m.cd, texto: m.nome })),
        tamanhoDestaque: 12,
      },
    ],
    quartoQuadro: (w) => {
      const s = [`<text x="0" y="0" font-family="${MONO}" font-size="13" letter-spacing="2.4" fill="${CINZA}">${L('ÁREA COLHIDA EM SP (MIL HA)', 'HARVESTED AREA IN SP (THOUSAND HA)')}</text>`];
      const anos = Object.keys(so).map(Number).sort((a, b) => a - b);
      const h = 190;
      const y0 = 30;
      const max = Math.max(...anos.map((a) => Math.max(so[a], mi[a]))) * 1.08;
      const X = (i) => 46 + (i * (w - 120)) / (anos.length - 1);
      const Y = (v) => y0 + h - (v / max) * h;
      for (const v of [500e3, 1000e3]) {
        s.push(`<path d="M46 ${f1(Y(v))}H${f1(w - 74)}" stroke="#d5d9dd" stroke-width=".8"/>`);
        s.push(`<text x="38" y="${f1(Y(v) + 4)}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${CINZA}">${nf(v / 1e3)}</text>`);
      }
      for (const [ser, cc, nome] of [[so, SOJA[4], L('soja', 'soybean')], [mi, MILHO[4], L('milho', 'maize')]]) {
        s.push(`<path d="${anos.map((a, i) => `${i ? 'L' : 'M'}${f1(X(i))} ${f1(Y(ser[a]))}`).join('')}" fill="none" stroke="${cc}" stroke-width="3" stroke-linejoin="round"/>`);
        const ul = anos.length - 1;
        s.push(`<circle cx="${f1(X(ul))}" cy="${f1(Y(ser[anos[ul]]))}" r="4" fill="${cc}"/>`);
        s.push(`<text x="${f1(X(ul) + 10)}" y="${f1(Y(ser[anos[ul]]) + 5)}" font-family="${SERIF}" font-style="italic" font-size="16" fill="${TINTA}">${nome}</text>`);
      }
      const ic = anos.indexOf(c.soja_passa_milho);
      s.push(`<circle cx="${f1(X(ic))}" cy="${f1(Y(so[c.soja_passa_milho]))}" r="8" fill="none" stroke="${TINTA}" stroke-width="1.2"/>`);
      s.push(`<text x="${f1(X(ic))}" y="${f1(Y(so[c.soja_passa_milho]) - 16)}" text-anchor="middle" font-family="${MONO}" font-size="12" fill="${TINTA}">${c.soja_passa_milho}</text>`);
      [0, 4, 8, 12, anos.length - 1].forEach((i) => s.push(`<text x="${f1(X(i))}" y="${y0 + h + 20}" text-anchor="middle" font-family="${MONO}" font-size="11" fill="${CINZA}">${anos[i]}</text>`));
      const p = paragrafos(w, [L(
        `Em ${c.soja_passa_milho}, a soja passou o milho em área colhida. O milho soma as duas safras do ano. A palha das duas lavouras pode virar biogás, mas boa parte precisa ficar no campo, protegendo o solo; o método CP2B desconta essa parte.`,
        `In ${c.soja_passa_milho}, soybean overtook maize in harvested area. Maize adds up both crops of the year. The straw of both can become biogas, but much of it has to stay on the field to protect the soil; the CP2B method deducts that share.`)],
      { yTitulo: y0 + h + 60, y: y0 + h + 92 });
      s.push(p.svg);
      return s.join('\n');
    },
    numeros: () => [
      [`×${nf(so[a1] / so[a0], 1)}`, [L('a área de soja', 'soybean area'), `${a0} → ${a1}`]],
      [`${c.com.soja[a0]} → ${c.com.soja[a1]}`, [L('municípios com soja', 'municipalities with soybean'), `${a0} → ${a1}`]],
      [`−${nf((1 - mi[a1] / mi[a0]) * 100, 0)} %`, [L('a área de milho', 'maize area'), `${a0} → ${a1}`]],
      [`${mil(c.palhas_m3_dia, 0)} mil m³`, [L('de biometano por dia', 'of biomethane per day'), L('nas palhas (CP2B)', 'in the straw (CP2B)')]],
    ],
    painel: (y) => {
      const s = [];
      for (const [k, t] of [['soja', L('MAIORES PRODUTORES DE SOJA (T)', 'LARGEST SOYBEAN GROWERS (T)')], ['milho', L('MAIORES PRODUTORES DE MILHO (T)', 'LARGEST MAIZE GROWERS (T)')]]) {
        s.push(rotuloPainel(t, y));
        const l = lista(c.maiores[k].slice(0, 3).map((m) => [m.nome, nf(m.valor)]), y + 30, { passo: 25, tamanho: 17 });
        s.push(l.svg);
        y = l.y + 22;
      }
      return { svg: s.join('\n'), y };
    },
    fontes: () => [L(`IBGE, PAM ${a0} a ${a1} (tabela 1612)`, `IBGE, PAM ${a0}–${a1} (table 1612)`), CP2B(), MALHA()],
  });
}

/* ------------------------------------------------------------------ 5/6 lixo e esgoto */
async function urbano() {
  const c = await ler('urbano');
  const FAM = {
    reator: [MIN.argila, 'Reator anaeróbio', 'Anaerobic reactor', 5],
    lagoa: ['#5d8fb0', 'Lagoas', 'Ponds', 3.2],
    lodos: ['#3f4a55', 'Lodos ativados', 'Activated sludge', 3.2],
    outros: ['#9aa1a8', 'Outros processos', 'Other processes', 3.2],
  };
  const fx = (v) => nf(v);
  const rot = (i) => (i ? `${fx(c.quebras[i - 1])} – ${fx(c.quebras[i])}` : L(`até ${fx(c.quebras[0])}`, `up to ${fx(c.quebras[0])}`));
  const pctUsado = (c.lixo_ja_usado_ch4_m3_dia / c.lixo_antes_ch4_m3_dia) * 100;
  const sp = c.maiores[0];
  return () => ({
    layout: 'um',
    motivo: 'agro',
    serie: serie(5),
    titulo: () => L('Lixo e esgoto', 'Waste and sewage'),
    subtitulo: () => L('A cidade também é lavoura de gás', 'The city is a gas field too'),
    descricao: () => L(`Biometano que o lixo orgânico, o lodo de esgoto e a poda dariam em cada município (CP2B) e as ${c.etes} estações de tratamento de esgoto da ANA`,
      `Biomethane that organic waste, sewage sludge and prunings could give in each municipality (CP2B), and ANA’s ${c.etes} sewage treatment plants`),
    mapa: () => ({
      preencher: (cd) => cor(METANO)(c.valores[cd] ?? null),
      bordaMunicipio: 0.4,
      pontos: c.pontos.map((p) => ({ coord: p.coord, r: FAM[p.f][3], cor: FAM[p.f][0], opacidade: 0.92, bordaLargura: 0.9 })),
      chamadas: [{
        cd: sp.cd, dx: 180, dy: 210,
        titulo: `${sp.nome.toUpperCase()} · ${mil(sp.valor, 0)} ${L('MIL M³/DIA', 'THOUSAND M³/DAY')}`,
        linhas: L([`${nf((sp.valor / c.urbano_m3_dia) * 100, 0)} % do biometano urbano do estado`], [`${nf((sp.valor / c.urbano_m3_dia) * 100, 0)}% of the state’s urban biomethane`]),
      }],
    }),
    numeros: () => [
      [`${mil(c.urbano_m3_dia, 0)} mil m³`, [L('de biometano por dia', 'of biomethane per day'), L('no lixo, no esgoto e na poda', 'in waste, sewage and prunings')]],
      [`${nf(pctUsado, 0)} %`, [L('do metano do lixo', 'of the methane in waste'), L('já aproveitado em aterros', 'already used at landfills')]],
      [String(c.etes), [L('estações de esgoto,', 'sewage treatment plants'), L(`que atendem ${c.municipios_atendidos} municípios`, `serving ${c.municipios_atendidos} municipalities`)]],
      [String(c.etes_familia.reator), [L('com reator anaeróbio,', 'with an anaerobic reactor,'), L('que já produz biogás', 'which already yields biogas')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('BIOMETANO URBANO (M³/DIA)', 'URBAN BIOMETHANE (M³/DAY)'), y)];
      const itens = [[ZERO, L('zero: longe demais', 'zero: too far')], ...c.quebras.map((_, i) => [METANO[i], rot(i)])];
      const l1 = legendaClasses(itens.slice(0, 4), { y: y + 16, passo: 27, tamanho: 16, id: 'lgu1' });
      const l2 = legendaClasses(itens.slice(4), { x: LP / 2 + 8, y: y + 16, passo: 27, tamanho: 16, id: 'lgu2' });
      s.push(l1.svg, l2.svg);
      y += 16 + l1.altura + 34;
      s.push(rotuloPainel(L('ESTAÇÕES DE ESGOTO (ANA, 2019)', 'SEWAGE TREATMENT PLANTS (ANA, 2019)'), y));
      const lp = legendaPontos(Object.entries(FAM).map(([k, [cc, pt, en, r]]) => [cc, `${L(pt, en)} (${c.etes_familia[k]})`, r + 1]), y + 34);
      s.push(lp.svg);
      y = lp.y + 18;
      s.push(rotuloPainel(L('DE ONDE VEM (MIL M³/DIA)', 'WHERE IT COMES FROM (THOUSAND M³/DAY)'), y));
      y += 22;
      const partes = [['lixo_m3_dia', L('lixo orgânico', 'organic waste')], ['lodo_m3_dia', L('lodo de esgoto', 'sewage sludge')], ['poda_m3_dia', L('poda urbana', 'urban prunings')]];
      const max = Math.max(...partes.map(([k]) => c.partes[k]));
      for (const [k, nome] of partes) {
        const wb = (c.partes[k] / max) * (LP - 260);
        s.push(`<text x="0" y="${y + 15}" font-family="${SERIF}" font-size="16">${esc(nome)}</text>`);
        s.push(`<rect x="170" y="${y + 3}" width="${f1(wb)}" height="15" fill="${METANO[4]}"/>`);
        s.push(`<text x="${f1(178 + wb)}" y="${y + 15}" font-family="${MONO}" font-size="13">${mil(c.partes[k], 0)}</text>`);
        y += 27;
      }
      return { svg: s.join('\n'), y: y + 4 };
    },
    fontes: () => [CP2B(), L('ANA, estações de tratamento de esgoto (2019)', 'ANA, sewage treatment plants (2019)'), MALHA()],
  });
}

/* ------------------------------------------------------------------ 6/6 síntese */
async function sintese() {
  const c = await ler('sintese');
  const raio = (v) => 1 + 0.066 * Math.sqrt(v);
  const top = c.maiores[0];
  const cana = (c.grupos.cana / c.total_m3_dia) * 100;
  return () => ({
    layout: 'um',
    motivo: 'agro',
    serie: serie(6),
    titulo: () => L('Biometano em SP', 'Biomethane in São Paulo'),
    subtitulo: () => L('O gás que já está no campo', 'The gas that is already in the fields'),
    descricao: () => L('Biometano que os resíduos de cada município dariam por dia, no cenário de referência do método CP2B (nível acessível); a cor diz de onde vem a maior parte',
      'Biomethane that each municipality’s residues could give per day, in the CP2B method’s reference scenario (accessible level); the colour shows where most of it comes from'),
    mapa: () => ({
      preencher: () => NEUTRO,
      bordaMunicipio: 0.5,
      bordaUnidadeCor: '#d9dde0',
      pontos: c.pontos.filter((p) => p.v > 0).map((p) => ({ coord: p.coord, r: raio(p.v), cor: GRUPO[p.g][0], opacidade: 0.78, bordaLargura: 0.8 })),
      chamadas: [{
        cd: top.cd, dx: -260, dy: -230,
        titulo: `${top.nome.toUpperCase()} · ${mil(top.valor, 0)} ${L('MIL M³/DIA', 'THOUSAND M³/DAY')}`,
        linhas: L(['o maior potencial do estado'], ['the largest potential in the state']),
      }],
    }),
    numeros: () => [
      [`${nf(c.total_m3_dia / 1e6, 1)} mi m³`, [L('de biometano por dia', 'of biomethane per day'), L('nível acessível (N4)', 'accessible level (N4)')]],
      [`${nf(cana, 0)} %`, [L('vêm da cana:', 'come from cane:'), L('palha, vinhaça, torta, bagaço', 'straw, vinasse, cake, bagasse')]],
      [String(c.metade_em), [L('municípios somam', 'municipalities hold'), L('metade do potencial', 'half the potential')]],
      [`${nf(c.top10_pct, 0)} %`, [L('do potencial nos', 'of the potential in'), L('10 maiores municípios', 'the 10 largest municipalities')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('A MAIOR FONTE DO MUNICÍPIO', 'THE MUNICIPALITY’S LARGEST SOURCE'), y)];
      y += 22;
      const max = Math.max(...Object.values(c.grupos));
      for (const [g, [cc, pt, en]] of Object.entries(GRUPO)) {
        const wb = (c.grupos[g] / max) * (LP - 330);
        s.push(`<circle cx="14" cy="${y + 10}" r="9" fill="${cc}" fill-opacity=".85"/>`);
        s.push(`<text x="34" y="${y + 16}" font-family="${SERIF}" font-size="16">${esc(L(pt, en))} (${c.dominante[g] ?? 0})</text>`);
        s.push(`<rect x="230" y="${y + 4}" width="${f1(Math.max(wb, 1.5))}" height="14" fill="${cc}" fill-opacity=".85"/>`);
        s.push(`<text x="${f1(238 + Math.max(wb, 1.5))}" y="${y + 16}" font-family="${MONO}" font-size="12.5">${mil(c.grupos[g], 0)}</text>`);
        y += 28;
      }
      s.push(`<text x="0" y="${y + 6}" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L('(municípios em que é a maior) · mil m³/dia no estado', '(municipalities where it leads) · thousand m³/day statewide'))}</text>`);
      y += 34;
      s.push(rotuloPainel(L('BIOMETANO POR DIA', 'BIOMETHANE PER DAY'), y));
      const lc = legendaCirculos([300000, 100000, 20000], raio, (v) => `${mil(v)} ${L('mil m³', 'k m³')}`, { y: y + 18, cor: CINZA });
      s.push(lc.svg);
      y += 18 + lc.altura + 28;
      s.push(rotuloPainel(L('DO TEÓRICO AO ACESSÍVEL (MI M³ CH₄/DIA)', 'FROM THEORETICAL TO ACCESSIBLE (M M³ CH₄/DAY)'), y));
      y += 18;
      const nv = c.niveis_ch4_m3_dia;
      const nomes = { n1: L('N1 teórico', 'N1 theoretical'), n2: L('N2 disponível', 'N2 available'), n3: L('N3 mobilizável', 'N3 mobilisable'), n4: L('N4 acessível', 'N4 accessible') };
      for (const k of ['n1', 'n2', 'n3', 'n4']) {
        const wb = (nv[k] / nv.n1) * (LP - 250);
        s.push(`<text x="0" y="${y + 15}" font-family="${SERIF}" font-size="16">${esc(nomes[k])}</text>`);
        s.push(`<rect x="170" y="${y + 3}" width="${f1(wb)}" height="15" fill="${k === 'n4' ? GRUPO.cana[0] : '#c9ced3'}"/>`);
        s.push(`<text x="${f1(178 + wb)}" y="${y + 15}" font-family="${MONO}" font-size="13">${nf(nv[k] / 1e6, 1)}</text>`);
        y += 26;
      }
      return { svg: s.join('\n'), y: y + 4 };
    },
    fontes: () => [CP2B(), MALHA()],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { cana, laranja, graos, urbano, sintese };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/agro-sp/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
const e = SERIE.find((s) => s.tema === nome);
const fazer = await TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => fazer() });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `agro-sp-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
