#!/usr/bin/env node
/**
 * Coleção «De onde vem o biodiesel» (Brasil) — desenha uma prancha a partir do cache de preparar.py (uso interno).
 *
 *   node scripts/colecoes/biodiesel-br/prancha.mjs usinas|sebo|balanco
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  RAIZ, LP, SERIF, MONO, CINZA, PAPEL, TINTA, esc, nf, f1, lingua, halo,
  gerarPrancha, rotuloPainel, usarBrasil,
} from '../lib/prancha-sp.mjs';
import { legendaCirculos } from '../lib/arte.mjs';

export const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'biodiesel-br', 'serie.json'), 'utf8'));
const TOTAL = 3; // pranchas da coleção
const BORDA_UF = '#c9ced3';

const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `biodiesel-br-${nome}.json`), 'utf8'));
const L = (pt, en) => (lingua() === 'en' ? en : pt);
const serie = (i) => () => L(`DE ONDE VEM O BIODIESEL · ${i}/${TOTAL}`, `WHERE BIODIESEL COMES FROM · ${i}/${TOTAL}`);
const mil = (v, casas = 0) => nf(v / 1000, casas);
const mi = (v, casas = 2) => nf(v / 1e6, casas);
const pc = (v, casas = 0) => `${nf(v, casas)} %`;
const ANP_BIO = () => L('ANP, Painel de Produtores de Biodiesel (2026)', 'ANP, Biodiesel Producers Panel (2026)');
const ANP_VENDAS = () => L('ANP, vendas de derivados por UF (2026)', 'ANP, fuel sales by state (2026)');
const PPM = () => L('IBGE, Pesquisa da Pecuária Municipal 2024', 'IBGE, Municipal Livestock Survey 2024');
const MALHA = () => L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025');
const caixa = (cor, rot, y, { passo = 25, x = 0, borda = BORDA_UF, tamanho = 16 } = {}) => `<rect x="${x}" y="${y}" width="34" height="${passo - 8}" fill="${cor}" stroke="${borda}" stroke-width=".8"/>
<text x="${x + 48}" y="${y + passo - 12}" font-family="${SERIF}" font-size="${tamanho}">${esc(rot)}</text>`;
const texto = (x, y, t, { tamanho = 12.5, cor = TINTA, anc = 'start', fonte = MONO, extra = '' } = {}) =>
  `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anc}" font-family="${fonte}" font-size="${tamanho}" fill="${cor}" ${extra}>${esc(t)}</text>`;
const NOME_REGIAO = { Norte: ['Norte', 'North'], Nordeste: ['Nordeste', 'Northeast'], 'Centro-Oeste': ['Centro-Oeste', 'Centre-West'],
  Sudeste: ['Sudeste', 'Southeast'], Sul: ['Sul', 'South'] };
const regiao = (r) => L(...NOME_REGIAO[r]);

/* ------------------------------------------------------------------ 1 as usinas de biodiesel */
async function usinas() {
  const c = await ler('usinas');
  const COR = Object.fromEntries(c.categorias.map((k) => [k.chave, k.cor]));
  const cat = Object.fromEntries(c.categorias.map((k) => [k.chave, k]));
  // Raio dos círculos de capacidade (m³/d).
  const raio = (v) => 2 + 0.5 * Math.sqrt(v);
  const pontos = [];
  for (const [k, lon, lat, c18, c26] of c.pontos) {
    if (c26 > 0) pontos.push({ coord: [lon, lat], r: raio(c26), cor: COR[k], opacidade: 0.88, bordaLargura: 0.8 });
    if (c18 > 0 && k !== 'igual') pontos.push({ coord: [lon, lat], r: raio(c18), cor: k === 'zerou' ? COR.zerou : TINTA, anel: true, largura: k === 'zerou' ? 1.8 : 1 });
  }
  const top = c.pontos[0];
  const cresc = (c.total_2026 / c.total_2018 - 1) * 100;
  const mt = c.ufs.find((u) => u.uf === 'MT');
  const co = c.regioes.find((r) => r.regiao === 'Centro-Oeste');
  const sul = c.regioes.find((r) => r.regiao === 'Sul');
  // Caixa da legenda na prancha (coordenadas do quadro do mapa): sobre Chile e Argentina, longe do Brasil.
  const LEG = { x: 40, y: 1270, w: 440, h: 296 };
  const ORDEM = ['nova', 'cresceu', 'igual', 'encolheu', 'zerou'];
  const simbolo = (k, cx, cy) => {
    const g = cat[k];
    if (k === 'zerou') return `<circle cx="${cx}" cy="${cy}" r="8" fill="none" stroke="${g.cor}" stroke-width="1.8"/>`;
    if (k === 'cresceu') return `<circle cx="${cx}" cy="${cy}" r="9" fill="${g.cor}" fill-opacity=".88" stroke="${PAPEL}" stroke-width=".7"/><circle cx="${cx}" cy="${cy}" r="5.5" fill="none" stroke="${TINTA}"/>`;
    if (k === 'encolheu') return `<circle cx="${cx}" cy="${cy}" r="9" fill="none" stroke="${TINTA}"/><circle cx="${cx}" cy="${cy}" r="5.5" fill="${g.cor}" fill-opacity=".88" stroke="${PAPEL}" stroke-width=".7"/>`;
    return `<circle cx="${cx}" cy="${cy}" r="8" fill="${g.cor}" fill-opacity=".88" stroke="${PAPEL}" stroke-width=".7"/>`;
  };
  const circulos = (y, x = 0) => legendaCirculos([3000, 1000, 250], raio, (v) => `${nf(v)} m³/${L('dia', 'day')}`, { y, x, cor: CINZA, tamanho: 14 });
  const categorias = (y, { tamanho = 16, numeros = false, direita = LP } = {}) => {
    const s = [];
    for (const k of ORDEM) {
      const g = cat[k];
      s.push(simbolo(k, 12, y - 6));
      s.push(texto(32, y, L(g.rotulo, g.rotulo_en), { tamanho, fonte: SERIF }));
      if (numeros) {
        s.push(texto(direita - 110, y, nf(g.municipios), { tamanho: 13, cor: CINZA, anc: 'end' }));
        s.push(texto(direita, y, g.variacao ? `${g.variacao > 0 ? '+' : '−'}${nf(Math.abs(g.variacao))}` : '0', { tamanho: 13, anc: 'end' }));
      }
      y += 25;
    }
    return { svg: s.join('\n'), y };
  };
  return () => ({
    layout: 'um',
    motivo: 'agro',
    serie: serie(1),
    titulo: () => L('As usinas de biodiesel', 'The biodiesel plants'),
    subtitulo: () => L('A capacidade dobrou desde 2018, e um terço dela fica parada',
      'Capacity has doubled since 2018, and a third of it sits idle'),
    descricao: () => L(
      `Capacidade autorizada das ${c.usinas_2026} usinas de biodiesel, somada por município, em ${c.fim} (disco) e ${c.inicio} (anel), e a produção dos últimos doze meses contra essa capacidade`,
      `Authorised capacity of the ${c.usinas_2026} biodiesel plants, summed by municipality, in ${c.fim} (disc) and ${c.inicio} (ring), and output over the last twelve months against that capacity`),
    mapa: () => ({
      preencher: () => '#f1f2f3',
      bordaMunicipio: 0.9,
      bordaUnidadeCor: BORDA_UF,
      semRgint: false,
      bordaRgint: 1.2,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      pontos,
      chamadas: [{
        coord: [top[1], top[2]], dx: -300, dy: -150,
        titulo: L(`${nf(top[4])} M³/DIA EM ${top[5].toUpperCase()} (${top[6]})`, `${nf(top[4])} M³/DAY IN ${top[5].toUpperCase()} (${top[6]})`),
        linhas: L([`${top[7]} usinas; a maior capacidade municipal`, `(${nf(top[3])} m³/dia em ${c.inicio})`],
          [`${top[7]} plants; the largest municipal capacity`, `(${nf(top[3])} m³/day in ${c.inicio})`]),
      }, {
        coord: [-52.5, -28.6], dx: 230, dy: -110,
        titulo: L(`SUL · ${pc(sul.uso)} DA CAPACIDADE EM USO`, `SOUTH · ${pc(sul.uso)} OF CAPACITY IN USE`),
        linhas: L([`${mil(sul.prod_m3)} mil m³ em doze meses;`, `no Centro-Oeste, ${pc(co.uso)}`],
          [`${mil(sul.prod_m3)} thousand m³ in twelve months;`, `in the Centre-West, ${pc(co.uso)}`]),
      }],
    }),
    reservas: () => [[LEG.x - 10, LEG.y - 10, LEG.x + LEG.w + 10, LEG.y + LEG.h + 10]],
    // Legenda numa caixa sobre Chile e Argentina (só na prancha; a figura tem a legendaFigura).
    sobreMapa: () => {
      const s = [`<rect x="${LEG.x}" y="${LEG.y}" width="${LEG.w}" height="${LEG.h}" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1.2"/>`];
      s.push(`<g transform="translate(${LEG.x + 18} ${LEG.y + 30})">`);
      s.push(rotuloPainel(L(`POR MUNICÍPIO, ${c.inicio} → ${c.fim}`, `BY MUNICIPALITY, ${c.inicio} → ${c.fim}`), 0));
      const dir = LEG.w - 36;
      const k = categorias(32, { numeros: true, direita: dir });
      s.push(k.svg);
      s.push(texto(dir - 110, k.y, L('municípios', 'municipalities'), { tamanho: 11, cor: CINZA, anc: 'end' }));
      s.push(texto(dir, k.y, L('Δ m³/dia', 'Δ m³/day'), { tamanho: 11, cor: CINZA, anc: 'end' }));
      s.push(texto(0, k.y, L(`anel: ${c.inicio} · disco: ${c.fim}`, `ring: ${c.inicio} · disc: ${c.fim}`), { tamanho: 11, cor: CINZA }));
      s.push(circulos(k.y + 26).svg, '</g>');
      return s.join('\n');
    },
    sobreMapaFigura: false,
    legendaFigura: () => {
      const s = [rotuloPainel(L('CAPACIDADE POR MUNICÍPIO', 'CAPACITY BY MUNICIPALITY'), 0)];
      const k = categorias(28);
      s.push(k.svg);
      let y = k.y;
      s.push(texto(0, y + 2, L(`anel: ${c.inicio} · disco: ${c.fim}`, `ring: ${c.inicio} · disc: ${c.fim}`), { tamanho: 12.5, cor: CINZA }));
      y += 26;
      const lc = circulos(y);
      s.push(lc.svg);
      return { svg: s.join('\n'), altura: y + lc.altura, largura: 360, canto: 'sw' };
    },
    numeros: () => [
      [L(`${mil(c.total_2026, 1)} mil m³`, `${mil(c.total_2026, 1)} k m³`), [L(`por dia, em ${c.usinas_2026} usinas`, `a day, in ${c.usinas_2026} plants`), L(`(${mil(c.total_2018, 1)} mil em ${c.inicio})`, `(${mil(c.total_2018, 1)} k in ${c.inicio})`)]],
      [`+${pc(cresc)}`, [L('de capacidade autorizada', 'in authorised capacity'), L(`desde ${c.inicio}`, `since ${c.inicio}`)]],
      [pc(c.brasil_12m.uso), [L('da capacidade foi usada', 'of capacity was used'), L(`em ${c.rotulo_12m}`, `in ${c.rotulo_12m}`)]],
      [pc((mt.cap / c.total_2026) * 100), [L(`da capacidade em Mato Grosso,`, `of capacity in Mato Grosso,`), L(`${mt.usinas} usinas`, `${mt.usinas} plants`)]],
    ],
    painel: (y) => {
      // Capacidade por UF, em barras (duas colunas), com o número de usinas.
      const s = [rotuloPainel(L(`CAPACIDADE POR UF, ${c.fim} · MIL M³/DIA`, `CAPACITY BY STATE, ${c.fim} · THOUSAND M³/DAY`), y)];
      y += 24;
      const meio = Math.ceil(c.ufs.length / 2);
      const colW = LP / 2;
      const wMax = colW - 30 - 92;
      const max = c.ufs[0].cap;
      c.ufs.forEach((u, i) => {
        const xc = i < meio ? 0 : colW + 8;
        const yy = y + (i % meio) * 19;
        const x0 = xc + 30;
        const w = (u.cap / max) * wMax;
        s.push(texto(xc, yy, u.uf, { tamanho: 12.5 }));
        s.push(`<rect x="${x0}" y="${yy - 10}" width="${f1(Math.max(w, 1))}" height="11" fill="${cat.cresceu.cor}" fill-opacity=".9"/>`);
        if (u.c18 > 0) s.push(`<path d="M${f1(x0 + (u.c18 / max) * wMax)} ${yy - 13}v17" stroke="${TINTA}" stroke-width="1.4"/>`);
        s.push(texto(x0 + w + 6, yy, `${mil(u.cap, 1)} (${u.usinas})`, { tamanho: 12 }));
      });
      y += meio * 19 - 6;
      s.push(texto(0, y + 4, L(`traço: capacidade em ${c.inicio} · entre parênteses: usinas`, `tick: capacity in ${c.inicio} · in brackets: plants`), { tamanho: 11, cor: CINZA }));
      y += 36;
      // Uso da capacidade por região, nos doze meses.
      s.push(rotuloPainel(L(`PRODUÇÃO ÷ CAPACIDADE, ${c.rotulo_12m}`, `OUTPUT ÷ CAPACITY, ${c.rotulo_12m}`), y));
      y += 24;
      const xr = 120;
      const wr = LP - xr - 150;
      const maxR = Math.max(...c.regioes.map((r) => r.cap_m3));
      for (const r of c.regioes) {
        const wc = (r.cap_m3 / maxR) * wr;
        s.push(texto(0, y, regiao(r.regiao), { tamanho: 12.5 }));
        s.push(`<rect x="${xr}" y="${y - 11}" width="${f1(wc)}" height="13" fill="none" stroke="${TINTA}" stroke-width=".8"/>`);
        s.push(`<rect x="${xr}" y="${y - 11}" width="${f1((r.prod_m3 / maxR) * wr)}" height="13" fill="${cat.nova.cor}"/>`);
        s.push(texto(xr + wc + 8, y, pc(r.uso), { tamanho: 12.5 }));
        s.push(texto(LP, y, L(`${mil(r.prod_m3)} mil m³`, `${mil(r.prod_m3)} k m³`), { tamanho: 11.5, cor: CINZA, anc: 'end' }));
        y += 21;
      }
      s.push(`<rect x="0" y="${y - 6}" width="22" height="10" fill="${cat.nova.cor}"/>`);
      s.push(texto(28, y + 3, L('produzido', 'produced'), { tamanho: 11, cor: CINZA }));
      s.push(`<rect x="120" y="${y - 6}" width="22" height="10" fill="none" stroke="${TINTA}" stroke-width=".8"/>`);
      s.push(texto(148, y + 3, L('capacidade × dias do mês', 'capacity × days in month'), { tamanho: 11, cor: CINZA }));
      y += 30;
      // Série anual do uso no país.
      s.push(rotuloPainel(L('USO DA CAPACIDADE NO PAÍS, POR ANO', 'CAPACITY USE IN BRAZIL, BY YEAR'), y));
      y += 14;
      const h = 54;
      const X = (i) => 40 + (i * (LP - 110)) / (c.anos.length - 1);
      const Y = (v) => y + h - ((v - 40) / 40) * h;
      for (const v of [40, 60, 80]) {
        s.push(`<path d="M40 ${f1(Y(v))}H${LP - 70}" stroke="#d5d9dd" stroke-width=".8"/>`);
        s.push(texto(32, Y(v) + 4, `${v}`, { tamanho: 11, cor: CINZA, anc: 'end' }));
      }
      s.push(`<path d="${c.anos.map((a, i) => `${i ? 'L' : 'M'}${f1(X(i))} ${f1(Y(a.uso))}`).join('')}" fill="none" stroke="${cat.nova.cor}" stroke-width="2.4" stroke-linejoin="round"/>`);
      c.anos.forEach((a, i) => {
        s.push(`<circle cx="${f1(X(i))}" cy="${f1(Y(a.uso))}" r="2.6" fill="${cat.nova.cor}"/>`);
        s.push(texto(X(i), y + h + 16, a.ano === '12m' ? L('12 m', '12 m') : `’${a.ano.slice(2)}`, { tamanho: 11, cor: CINZA, anc: 'middle' }));
      });
      const minA = c.anos.reduce((a, b) => (b.uso < a.uso ? b : a));
      const iMin = c.anos.indexOf(minA);
      s.push(texto(X(iMin), Y(minA.uso) + 16, pc(minA.uso), { tamanho: 12, anc: 'middle' }));
      s.push(texto(X(c.anos.length - 1) + 8, Y(c.anos.at(-1).uso) + 4, pc(c.anos.at(-1).uso), { tamanho: 12 }));
      s.push(texto(X(0) + 6, Y(c.anos[0].uso) + 18, pc(c.anos[0].uso), { tamanho: 12 }));
      return { svg: s.join('\n'), y: y + h + 24 };
    },
    fontes: () => [ANP_BIO(), MALHA()],
  });
}

/* ------------------------------------------------------------------ 2 soja, sebo e o resto */
async function sebo() {
  const c = await ler('sebo');
  const G = Object.fromEntries(c.grupos.map((g) => [g.chave, g]));
  const chaves = c.grupos.map((g) => g.chave);
  const corDe = (lista) => (k) => (k === -2 ? PAPEL : lista[k].cor);
  const corSebo = corDe(c.classes_sebo);
  const corSoja = corDe(c.classes_soja);
  const corBoi = corDe(c.classes_boi);
  const rSebo = (v) => 2 + 0.045 * Math.sqrt(v);
  const sebo12 = c.anos.at(-1);
  const sebo17 = c.anos[0];
  const pctSebo = (a) => (a.sebo / a.total) * 100;
  const ro = c.tabela.find((t) => t.uf === 'RO');
  const ba = c.tabela.find((t) => t.uf === 'BA');
  const faixa = (classes, titulo, { semBio = true } = {}) => {
    const s = [];
    const lw = 54;
    classes.forEach((k, i) => s.push(`<rect x="${i * lw}" y="-12" width="${lw}" height="16" fill="${k.cor}" stroke="${BORDA_UF}" stroke-width=".8"/>`));
    classes.forEach((k, i) => s.push(texto(i * lw + lw / 2, 22, L(k.rotulo, k.rotulo_en).replace(/ %| mi| M|%/g, '').replace(' ou mais', '+').replace(' or more', '+').replace('até ', '≤').replace('up to ', '≤').replace(' a ', '–').replace(' to ', '–'), { tamanho: 11, anc: 'middle' })));
    if (semBio) {
      const xs = classes.length * lw + 22;
      s.push(`<rect x="${xs}" y="-12" width="${lw * 0.7}" height="16" fill="${PAPEL}" stroke="${BORDA_UF}" stroke-width=".8"/>`);
      s.push(texto(xs + lw * 0.35, 22, L('sem biodiesel', 'no biodiesel'), { tamanho: 11, anc: 'middle' }));
    }
    s.push(texto(0, -24, titulo, { tamanho: 12, cor: CINZA }));
    return s.join('\n');
  };
  const faixaBoi = () => {
    const s = [faixa(c.classes_boi, L('bovinos, milhões de cabeças, 2024', 'cattle, million head, 2024'), { semBio: false })];
    // Três linhas curtas: na figura, a nota da projeção fica logo à direita.
    const x = c.classes_boi.length * 54 + 20;
    s.push(`<circle cx="${x + 9}" cy="-4" r="9" fill="${G.sebo.cor}" fill-opacity=".85" stroke="${PAPEL}"/>`);
    s.push(texto(x + 24, -16, L('sebo no', 'tallow in'), { tamanho: 11.5 }));
    s.push(texto(x + 24, 0, L('biodiesel,', 'biodiesel,'), { tamanho: 11.5 }));
    s.push(texto(x + 24, 16, L('área ∝ m³', 'area ∝ m³'), { tamanho: 11.5 }));
    return s.join('\n');
  };
  const mapa = (titulo, preencher, legenda, extra = {}) => ({
    titulo, pad: 64, preencher, bordaMunicipio: 1, bordaUnidadeCor: '#aab2b9', semRgint: true, tamanhoUnidade: 11, legenda, ...extra,
  });
  const pontosSebo = c.sebo_pontos.filter((p) => p[3] >= 1000).map(([, lon, lat, v]) => ({ coord: [lon, lat], r: rSebo(v), cor: G.sebo.cor, opacidade: 0.85, bordaLargura: 1 }));
  /** Barras empilhadas: a mistura de matérias-primas em cada ano, de 2017 aos últimos doze meses. */
  const mistura = (y0, w) => {
    const s = [];
    const x0 = 64;
    const wb = w - x0 - 60;
    let y = y0;
    for (const a of c.anos) {
      let x = x0;
      s.push(texto(0, y + 12, a.periodo === '12m' ? L('12 m*', '12 m*') : a.periodo, { tamanho: 12 }));
      for (const k of chaves) {
        const ww = (a[k] / a.total) * wb;
        s.push(`<rect x="${f1(x)}" y="${y}" width="${f1(Math.max(ww - 0.6, 0))}" height="16" fill="${G[k].cor}"/>`);
        x += ww;
      }
      const ps = pctSebo(a);
      const xs = x0 + (a.soja / a.total) * wb;
      s.push(texto(xs + 4, y + 12, nf(ps, 1), { tamanho: 11, cor: PAPEL }));
      s.push(texto(w, y + 12, mi(a.total, 1), { tamanho: 11.5, cor: CINZA, anc: 'end' }));
      y += 22;
    }
    s.push(texto(w, y0 - 8, L('mi m³', 'M m³'), { tamanho: 11, cor: CINZA, anc: 'end' }));
    y += 10;
    // Legenda das cores, em duas colunas.
    c.grupos.forEach((g, i) => {
      const xx = (i % 2) * (w / 2);
      const yy = y + Math.floor(i / 2) * 20;
      s.push(`<rect x="${xx}" y="${yy}" width="16" height="12" fill="${g.cor}"/>`);
      s.push(texto(xx + 22, yy + 11, L(g.rotulo, g.rotulo_en), { tamanho: 12.5, fonte: SERIF }));
    });
    y += 74;
    s.push(texto(0, y, L(`* ${c.rotulo_12m}. Número branco: % de sebo bovino.`, `* ${c.rotulo_12m}. White figure: % beef tallow.`), { tamanho: 11.5, cor: CINZA }));
    return s.join('\n');
  };
  return () => ({
    layout: 'quatro',
    motivo: 'agro',
    serie: serie(2),
    titulo: () => L('Soja, sebo e o resto', 'Soy, tallow and the rest'),
    subtitulo: () => L('Um litro em cada cem do diesel da bomba vem da gordura do boi',
      'One litre in every hundred of pump diesel comes from cattle fat'),
    descricao: () => L(
      `Matéria-prima do biodiesel por UF em ${c.rotulo_12m}: a parte do óleo de soja, a do sebo bovino e, ao lado, o rebanho bovino de 2024 com o sebo que cada UF pôs no biodiesel`,
      `Biodiesel feedstock by state in ${c.rotulo_12m}: the share of soybean oil, the share of beef tallow and, alongside, the 2024 cattle herd with the tallow each state put into biodiesel`),
    mapas: () => [
      mapa(L('ÓLEO DE SOJA', 'SOYBEAN OIL'), (s) => corSoja(c.ufs[s].soja), faixa(c.classes_soja, L('% da matéria-prima do biodiesel da UF', '% of the state’s biodiesel feedstock'))),
      mapa(L('SEBO BOVINO', 'BEEF TALLOW'), (s) => corSebo(c.ufs[s].sebo), faixa(c.classes_sebo, L('% da matéria-prima do biodiesel da UF', '% of the state’s biodiesel feedstock'))),
      mapa(L('O REBANHO E O SEBO', 'THE HERD AND THE TALLOW'), (s) => corBoi(c.ufs[s].boi), faixaBoi(), { pontos: pontosSebo }),
    ],
    quartoQuadro: (w) => {
      const s = [rotuloPainel(L('A MISTURA NO PAÍS, ANO A ANO', 'THE MIX IN BRAZIL, YEAR BY YEAR'), 0)];
      s.push(mistura(22, w));
      return s.join('\n');
    },
    numeros: () => [
      [pc(c.sebo_pct_br, 1), [L('do biodiesel veio do sebo', 'of biodiesel came from tallow'), L(`(${mil(c.sebo_m3_br)} mil m³ em 12 meses)`, `(${mil(c.sebo_m3_br)} k m³ in 12 months)`)]],
      [`≈ ${pc(c.sebo_no_diesel_pct, 1)}`, [L('do diesel B15 da bomba', 'of B15 pump diesel'), L('é sebo bovino', 'is beef tallow')]],
      [pc(pctSebo(sebo17), 1), [L('era a parte do sebo em 2017;', 'was tallow’s share in 2017;'), L(`o volume subiu ${pc((sebo12.sebo / sebo17.sebo - 1) * 100)}`, `the volume rose ${pc((sebo12.sebo / sebo17.sebo - 1) * 100)}`)]],
      [pc((ro.sebo / ro.total) * 100), [L('do biodiesel de Rondônia', 'of Rondônia’s biodiesel'), L(`é sebo; na Bahia, ${pc((ba.sebo / ba.total) * 100)}`, `is tallow; in Bahia, ${pc((ba.sebo / ba.total) * 100)}`)]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L(`A MATÉRIA-PRIMA DE CADA UF · ${c.rotulo_12m}`, `EACH STATE’S FEEDSTOCK · ${c.rotulo_12m}`), y)];
      y += 28;
      const xb = 108;
      const wb = LP - xb - 150;
      const cols = [[0, 'start', 'UF'], [96, 'end', L('mil m³', 'k m³')], [xb, 'start', L('mistura', 'mix')], [LP - 78, 'end', L('% sebo', '% tallow')], [LP, 'end', L('mi bois', 'M cattle')]];
      for (const [x, anc, t] of cols) s.push(texto(x, y, t, { tamanho: 11.5, cor: CINZA, anc }));
      y += 22;
      for (const t of c.tabela) {
        s.push(texto(0, y, t.uf, { tamanho: 13 }));
        s.push(texto(96, y, mil(t.total), { tamanho: 12.5, anc: 'end' }));
        let x = xb;
        for (const k of chaves) {
          const ww = (t[k] / t.total) * wb;
          if (ww > 0) s.push(`<rect x="${f1(x)}" y="${y - 11}" width="${f1(Math.max(ww - 0.5, 0.5))}" height="13" fill="${G[k].cor}"/>`);
          x += ww;
        }
        s.push(texto(LP - 78, y, nf((t.sebo / t.total) * 100, 1), { tamanho: 12.5, anc: 'end', cor: t.sebo > 0 ? TINTA : CINZA }));
        s.push(texto(LP, y, nf(t.bovinos / 1e6, 1), { tamanho: 12.5, anc: 'end', cor: CINZA }));
        y += 20;
      }
      y += 8;
      const linhas = L([
        `As ${c.tabela.length} UFs que fazem biodiesel têm ${mi(c.bovinos_br - c.bovinos_ufs_sem_biodiesel, 0)} dos ${mi(c.bovinos_br, 0)} milhões`,
        'de bovinos do país. «Outros materiais graxos» é uma categoria',
        'da própria ANP, sem a origem: pode esconder mais sebo.',
      ], [
        `The ${c.tabela.length} states that make biodiesel hold ${mi(c.bovinos_br - c.bovinos_ufs_sem_biodiesel, 0)} of Brazil’s ${mi(c.bovinos_br, 0)} million`,
        'cattle. «Other fatty materials» is the ANP’s own category, with',
        'no origin given: it may hide more tallow.',
      ]);
      linhas.forEach((l) => { s.push(texto(0, y, l, { tamanho: 12.5 })); y += 19; });
      return { svg: s.join('\n'), y };
    },
    fontes: () => [ANP_BIO(), PPM(), MALHA()],
  });
}

/* ------------------------------------------------------------------ 3 quem produz, quem consome */
async function balanco() {
  const c = await ler('balanco');
  const COR = Object.fromEntries(c.classes.map((k) => [k.classe, k.cor]));
  const porUf = Object.fromEntries(c.ufs.map((u) => [u.uf, u]));
  const sp = porUf.SP;
  const mt = porUf.MT;
  // Caixa da legenda na prancha (coordenadas do quadro do mapa): sobre Chile e Argentina.
  const LEG = { x: 40, y: 1200, w: 470, h: 380 };
  const LIMIAR = 20000; // m³: setas abaixo disso ficam de fora do mapa (estão no GPKG)
  const fluxos = c.fluxos.filter((f) => f.m3 >= LIMIAR);
  const maxF = fluxos[0].m3;
  const larg = (v) => 1.5 + 20 * (v / maxF);
  const COR_SETA = '#2d3a44';
  /** Seta curva de a para b, na projeção, com a ponta no fim; devolve o SVG e o ponto do meio. */
  const seta = (proj, a, b, v, { k = 0.18 } = {}) => {
    const [ax, ay] = proj(a);
    const [bx, by] = proj(b);
    const [dx, dy] = [bx - ax, by - ay];
    const d = Math.hypot(dx, dy);
    const [mx, my] = [(ax + bx) / 2 - k * dy, (ay + by) / 2 + k * dx];
    const lw = larg(v);
    const ponta = Math.max(14, lw * 1.6);
    // Recua o fim para a ponta (e o começo para fora do marco da região).
    const q = (t) => [(1 - t) ** 2 * ax + 2 * (1 - t) * t * mx + t ** 2 * bx, (1 - t) ** 2 * ay + 2 * (1 - t) * t * my + t ** 2 * by];
    const t1 = 1 - (ponta + 16) / (d * 1.05);
    const t0 = 22 / d;
    const pts = Array.from({ length: 25 }, (_, i) => q(t0 + ((t1 - t0) * i) / 24));
    const [ex, ey] = pts.at(-1);
    const [px, py] = pts.at(-2);
    const ang = Math.atan2(ey - py, ex - px);
    const tip = [ex + ponta * Math.cos(ang), ey + ponta * Math.sin(ang)];
    const lado = Math.max(lw * 1.05, 8);
    const base1 = [ex + lado * Math.cos(ang + Math.PI / 2), ey + lado * Math.sin(ang + Math.PI / 2)];
    const base2 = [ex - lado * Math.cos(ang + Math.PI / 2), ey - lado * Math.sin(ang + Math.PI / 2)];
    const path = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f1(x)} ${f1(y)}`).join('');
    return {
      svg: `<path d="${path}" fill="none" stroke="${PAPEL}" stroke-width="${f1(lw + 4)}" stroke-opacity=".85"/>
<path d="M${f1(base1[0])} ${f1(base1[1])}L${f1(tip[0])} ${f1(tip[1])}L${f1(base2[0])} ${f1(base2[1])}Z" fill="${COR_SETA}" stroke="${PAPEL}" stroke-width="2" stroke-linejoin="round" paint-order="stroke"/>
<path d="${path}" fill="none" stroke="${COR_SETA}" stroke-width="${f1(lw)}" stroke-opacity=".92"/>`,
      meio: q((t0 + t1) / 2),
    };
  };
  const desenharFluxos = (proj, { rotulos = true } = {}) => {
    const s = [];
    const marcas = [];
    for (const f of [...fluxos].reverse()) {
      const sa = seta(proj, c.ancoras[f.origem], c.ancoras[f.destino], f.m3);
      s.push(sa.svg);
      if (rotulos) marcas.push(texto(sa.meio[0], sa.meio[1] + 5, mil(f.m3), { tamanho: 15, anc: 'middle', extra: `font-weight="bold" ${halo(4)}` }));
    }
    // Marco de cada região: o que fica nela (vendas da região para a própria região).
    for (const r of c.regioes) {
      const [x, y] = proj(c.ancoras[r.regiao]);
      s.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="6" fill="${PAPEL}" stroke="${COR_SETA}" stroke-width="2.4"/>`);
    }
    return [...s, ...marcas].join('\n');
  };
  const legendaSetas = (y, x = 0) => {
    const s = [];
    let yy = y;
    for (const v of [1.5e6, 5e5, 1e5]) {
      const lw = larg(v);
      s.push(`<path d="M${x} ${yy}h52" stroke="${COR_SETA}" stroke-width="${f1(lw)}"/>`);
      s.push(`<path d="M${x + 52} ${f1(yy - Math.max(lw * 1.05, 8))}l${f1(Math.max(14, lw * 1.6))} ${f1(Math.max(lw * 1.05, 8))}l${-f1(Math.max(14, lw * 1.6))} ${f1(Math.max(lw * 1.05, 8))}z" fill="${COR_SETA}"/>`);
      s.push(texto(x + 104, yy + 5, L(`${mil(v)} mil m³`, `${mil(v)} k m³`), { tamanho: 14 }));
      yy += 34;
    }
    return { svg: s.join('\n'), altura: yy - y };
  };
  const itens = () => [...c.classes].reverse().map((k) => [k.cor, L(k.rotulo, k.rotulo_en)]);
  const entre = c.entre_regioes_m3;
  return () => ({
    layout: 'um',
    motivo: 'energia',
    serie: serie(3),
    titulo: () => L('Quem produz, quem consome', 'Who makes it, who burns it'),
    subtitulo: () => L('O biodiesel nasce no Centro-Oeste e no Sul e viaja para o Sudeste',
      'Biodiesel is born in the Centre-West and the South and travels to the Southeast'),
    descricao: () => L(
      `Produção estimada de biodiesel de cada UF menos a demanda estimada (diesel vendido × ${pc(c.mistura * 100)}), em ${c.rotulo_12m}, e as vendas de biodiesel entre regiões, do produtor ao distribuidor`,
      `Estimated biodiesel output of each state minus estimated demand (diesel sold × ${pc(c.mistura * 100)}), in ${c.rotulo_12m}, and biodiesel sales between regions, from producer to distributor`),
    mapa: () => ({
      preencher: (s) => COR[porUf[s]?.classe ?? 3],
      bordaMunicipio: 1,
      bordaUnidadeCor: '#aab2b9',
      semRgint: false,
      bordaRgint: 2.2,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      chamadas: [{
        coord: [-48.6, -22.3], dx: 260, dy: 150,
        titulo: L(`SÃO PAULO · FALTAM ${mi(-sp.saldo, 2)} MI M³`, `SÃO PAULO · SHORT BY ${mi(-sp.saldo, 2)} M M³`),
        linhas: L([`produz ${pc((sp.producao / sp.demanda) * 100)} do biodiesel`, 'que o seu diesel leva'],
          [`makes ${pc((sp.producao / sp.demanda) * 100)} of the biodiesel`, 'its diesel carries']),
      }, {
        coord: [-56.0, -12.4], dx: -250, dy: 170,
        titulo: L(`MATO GROSSO · SOBRAM ${mi(mt.saldo, 2)} MI M³`, `MATO GROSSO · ${mi(mt.saldo, 2)} M M³ SURPLUS`),
        linhas: L([`produz ${nf(mt.producao / mt.demanda, 1)} vezes o que consome`], [`makes ${nf(mt.producao / mt.demanda, 1)} times what it uses`]),
      }],
    }),
    sobreMapa: (proj) => desenharFluxos(proj),
    reservas: () => [[LEG.x - 10, LEG.y - 10, LEG.x + LEG.w + 10, LEG.y + LEG.h + 10]],
    // Legenda das setas numa caixa sobre Chile e Argentina, só na prancha (a figura tem a legendaFigura).
    sobreMapaPrancha: () => {
      const s = [`<rect x="${LEG.x}" y="${LEG.y}" width="${LEG.w}" height="${LEG.h}" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1.2"/>`,
        `<g transform="translate(${LEG.x + 18} ${LEG.y + 30})">`,
        rotuloPainel(L('PRODUÇÃO − DIESEL × 15 %', 'OUTPUT − DIESEL × 15%'), 0)];
      let y = 12;
      for (const [cor, rot] of itens()) { s.push(caixa(cor, rot, y, { passo: 22, tamanho: 14 })); y += 22; }
      y += 34;
      s.push(rotuloPainel(L('VENDAS ENTRE REGIÕES · MIL M³', 'SALES BETWEEN REGIONS · K M³'), y));
      const ls = legendaSetas(y + 30);
      s.push(ls.svg);
      s.push(texto(0, y + 30 + ls.altura - 6, L(`do produtor ao distribuidor; acima de ${mil(LIMIAR)} mil m³`, `producer to distributor; above ${mil(LIMIAR)} k m³`), { tamanho: 12, cor: CINZA }));
      s.push('</g>');
      return s.join('\n');
    },
    legendaFigura: () => {
      const s = [rotuloPainel(L('PRODUÇÃO − DIESEL × 15 %, POR UF', 'OUTPUT − DIESEL × 15%, BY STATE'), 0)];
      let y = 22;
      for (const [cor, rot] of itens()) { s.push(caixa(cor, rot, y)); y += 25; }
      y += 34;
      s.push(rotuloPainel(L('VENDAS ENTRE REGIÕES', 'SALES BETWEEN REGIONS'), y));
      y += 30;
      const ls = legendaSetas(y);
      s.push(ls.svg);
      return { svg: s.join('\n'), altura: y + ls.altura - 10, largura: 420, canto: 'sw' };
    },
    numeros: () => [
      [L(`${mi(-sp.saldo, 2)} mi m³`, `${mi(-sp.saldo, 2)} M m³`), [L('é o que falta a São Paulo,', 'is São Paulo’s shortfall,'), L(`que produz ${pc((sp.producao / sp.demanda) * 100)} da demanda`, `which makes ${pc((sp.producao / sp.demanda) * 100)} of its demand`)]],
      [nf(c.ufs_com_sobra.length), [L('UFs produzem mais do que', 'states make more than'), L(`consomem: ${c.ufs_com_sobra.join(', ')}`, `they use: ${c.ufs_com_sobra.join(', ')}`)]],
      [pc((entre / c.vendas_m3) * 100), [L('das vendas cruzaram a', 'of sales crossed a'), L(`fronteira de uma região (${mi(entre, 1)} mi m³)`, `regional border (${mi(entre, 1)} M m³)`)]],
      [pc(c.mistura_efetiva_12m, 1), [L('biodiesel vendido ÷ diesel', 'biodiesel sold ÷ diesel'), L(`vendido; a mistura é ${pc(c.mistura * 100)}`, `sold; the mandate is ${pc(c.mistura * 100)}`)]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L(`AS CINCO REGIÕES · MIL M³ · ${c.rotulo_12m}`, `THE FIVE REGIONS · THOUSAND M³ · ${c.rotulo_12m}`), y)];
      y += 28;
      const cols = [[0, 'start', L('região', 'region')], [210, 'end', L('produção', 'output')], [320, 'end', L('demanda*', 'demand*')], [430, 'end', L('fica', 'stays')], [LP, 'end', L('sai', 'leaves')]];
      for (const [x, anc, t] of cols) s.push(texto(x, y, t, { tamanho: 11.5, cor: CINZA, anc }));
      y += 22;
      for (const r of c.regioes) {
        const sai = c.fluxos.filter((f) => f.origem === r.regiao).reduce((a, f) => a + f.m3, 0);
        s.push(texto(0, y, regiao(r.regiao), { tamanho: 13 }));
        s.push(texto(210, y, mil(r.producao), { tamanho: 13, anc: 'end' }));
        s.push(texto(320, y, mil(r.demanda), { tamanho: 13, anc: 'end', cor: CINZA }));
        s.push(texto(430, y, mil(r.fica), { tamanho: 13, anc: 'end' }));
        s.push(texto(LP, y, mil(sai), { tamanho: 13, anc: 'end' }));
        y += 21;
      }
      y += 6;
      s.push(texto(0, y, L(`* diesel vendido × ${pc(c.mistura * 100)}. Fica: vendido a distribuidor da mesma região.`, `* diesel sold × ${pc(c.mistura * 100)}. Stays: sold to a distributor in the same region.`), { tamanho: 11.5, cor: CINZA }));
      y += 34;
      // Saldo de cada UF em barras divergentes.
      s.push(rotuloPainel(L('SALDO POR UF · MIL M³', 'BALANCE BY STATE · THOUSAND M³'), y));
      y += 22;
      // Rótulos até x = 150; as barras de falta vão à esquerda do eixo, as de sobra à direita, na mesma escala.
      const x0 = 350;
      const maxNeg = Math.max(...c.ufs.map((u) => -u.saldo));
      const maxPos = Math.max(...c.ufs.map((u) => u.saldo));
      const esc_ = Math.min((x0 - 160) / maxNeg, (LP - x0 - 64) / maxPos);
      const lista = [...c.ufs.filter((u) => u.saldo > 0), ...c.ufs.filter((u) => u.saldo < 0).sort((a, b) => a.saldo - b.saldo).slice(0, 5)];
      const y0 = y;
      for (const u of lista) {
        const w = u.saldo * esc_;
        s.push(texto(0, y, u.uf, { tamanho: 12.5 }));
        s.push(texto(40, y, L(`${mil(u.producao)} − ${mil(u.demanda)}`, `${mil(u.producao)} − ${mil(u.demanda)}`), { tamanho: 11.5, cor: CINZA }));
        s.push(`<rect x="${f1(w < 0 ? x0 + w : x0)}" y="${y - 11}" width="${f1(Math.max(Math.abs(w), 1))}" height="12" fill="${COR[u.classe]}" stroke="${BORDA_UF}" stroke-width=".5"/>`);
        s.push(texto(w < 0 ? x0 + 6 : x0 + w + 6, y, `${u.saldo > 0 ? '+' : '−'}${mil(Math.abs(u.saldo))}`, { tamanho: 12.5 }));
        y += 18;
      }
      s.push(`<path d="M${x0} ${y0 - 16}V${y - 10}" stroke="${TINTA}" stroke-width=".8"/>`);
      y += 4;
      s.push(texto(0, y, L(`produção − demanda; as 5 maiores faltas. Sem usina: ${c.ufs_sem_usina.length} UFs.`, `output − demand; the 5 largest gaps. No plant: ${c.ufs_sem_usina.length} states.`), { tamanho: 11.5, cor: CINZA }));
      return { svg: s.join('\n'), y: y + 10 };
    },
    fontes: () => [ANP_BIO(), ANP_VENDAS(), MALHA()],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { usinas, sebo, balanco };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/biodiesel-br/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
// O motor põe o rótulo do oceano do Brasil em [-31.5, -21] (lib/prancha-sp.mjs), em cima de Trindade e Martim Vaz.
// Como na etanol-br: o do motor sai e este entra ao largo da Bahia.
const OCEANO = [-33.5, -16];
const comOceano = (t) => {
  if (t.layout !== 'um') return t;
  const { mapa, sobreMapa } = t;
  const soPrancha = t.sobreMapaFigura === false;
  return Object.assign(t, {
    mapa: () => ({ ...mapa(), oceano: false }),
    sobreMapaFigura: true,
    sobreMapa: (proj) => {
      const [x, y] = proj(OCEANO);
      return `${soPrancha && t._enquadramento ? '' : (sobreMapa?.(proj) ?? '')}
${t._enquadramento ? '' : (t.sobreMapaPrancha?.(proj) ?? '')}
<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="19" letter-spacing="5" fill="#6f8796">${L('OCEANO ATLÂNTICO', 'ATLANTIC OCEAN')}</text>`;
    },
  });
};
await usarBrasil();
const e = SERIE.find((s) => s.tema === nome);
const fazer = await TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => comOceano(fazer()) });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `biodiesel-br-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
