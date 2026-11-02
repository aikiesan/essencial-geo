#!/usr/bin/env node
/**
 * Coleção «A nota de cada usina» (Brasil, RenovaBio) — desenha uma prancha a partir do cache de preparar.py (uso interno).
 *
 *   node scripts/colecoes/renovabio-br/prancha.mjs nota|elegivel|renovacao
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  RAIZ, LP, SERIF, MONO, CINZA, PAPEL, TINTA, esc, nf, f1, lingua,
  gerarPrancha, rotuloPainel, usarBrasil,
} from '../lib/prancha-sp.mjs';
import { legendaCirculos } from '../lib/arte.mjs';

export const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'renovabio-br', 'serie.json'), 'utf8'));
const TOTAL = 3; // pranchas da coleção
const BORDA_UF = '#c9ced3';
const FUNDO = '#f1f2f3';

const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `renovabio-br-${nome}.json`), 'utf8'));
const L = (pt, en) => (lingua() === 'en' ? en : pt);
const serie = (i) => () => L(`A NOTA DE CADA USINA · ${i}/${TOTAL}`, `EACH PLANT’S SCORE · ${i}/${TOTAL}`);
const pc = (v, casas = 0) => `${nf(v, casas)} %`;
const mil = (v, casas = 0) => nf(v / 1000, casas);
const sinal = (v, casas = 1) => `${v > 0 ? '+' : v < 0 ? '−' : '±'}${nf(Math.abs(v), casas)}`;
const ANP_RB = () => L('ANP, certificados do RenovaBio (27/10/2026)', 'ANP, RenovaBio certificates (27/10/2026)');
const ANP_PAINEIS = () => L('ANP, painéis de produtores de etanol e biodiesel', 'ANP, ethanol and biodiesel producer panels');
const LOCAL = () => L('IBGE, Localidades 2022 e Malha Municipal 2025', 'IBGE, Localities 2022 and Municipal Mesh 2025');
const texto = (x, y, t, { tamanho = 12.5, cor = TINTA, anc = 'start', fonte = MONO, extra = '' } = {}) =>
  `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anc}" font-family="${fonte}" font-size="${tamanho}" fill="${cor}" ${extra}>${esc(t)}</text>`;
const caixa = (cor, rot, y, { passo = 25, x = 0, borda = BORDA_UF, tamanho = 16 } = {}) => `<rect x="${x}" y="${y}" width="34" height="${passo - 8}" fill="${cor}" stroke="${borda}" stroke-width=".8"/>
<text x="${x + 48}" y="${y + passo - 12}" font-family="${SERIF}" font-size="${tamanho}">${esc(rot)}</text>`;
const NOME_REGIAO = { Norte: ['Norte', 'North'], Nordeste: ['Nordeste', 'Northeast'], 'Centro-Oeste': ['Centro-Oeste', 'Centre-West'],
  Sudeste: ['Sudeste', 'Southeast'], Sul: ['Sul', 'South'] };
const regiao = (r) => L(...NOME_REGIAO[r]);
const ROTA_CURTA = { cana: ['cana', 'cane'], milho: ['milho', 'corn'], flex: ['cana+milho', 'cane+corn'], biodiesel: ['biodiesel', 'biodiesel'],
  biometano: ['biometano', 'biomethane'] };
const rotaCurta = (k) => L(...ROTA_CURTA[k]);

/** Marcador com a forma da rota: círculo (cana), quadrado (milho, flex), triângulo (biodiesel), losango (biometano). */
function forma(tipo, x, y, r, cor, { borda = TINTA, largura = 0.7, opacidade = 0.95 } = {}) {
  const a = `fill="${cor}" fill-opacity="${opacidade}" stroke="${borda}" stroke-width="${largura}" stroke-linejoin="round"`;
  if (tipo === 'quadrado') { const l = r * 1.7; return `<rect x="${f1(x - l / 2)}" y="${f1(y - l / 2)}" width="${f1(l)}" height="${f1(l)}" ${a}/>`; }
  if (tipo === 'triangulo') { const h = r * 1.25; return `<path d="M${f1(x)} ${f1(y - h * 1.15)}L${f1(x + h * 1.1)} ${f1(y + h * 0.75)}L${f1(x - h * 1.1)} ${f1(y + h * 0.75)}Z" ${a}/>`; }
  if (tipo === 'losango') { const h = r * 1.35; return `<path d="M${f1(x)} ${f1(y - h)}L${f1(x + h)} ${f1(y)}L${f1(x)} ${f1(y + h)}L${f1(x - h)} ${f1(y)}Z" ${a}/>`; }
  return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" ${a}/>`;
}

/* ------------------------------------------------------------------ 1 a nota de cada usina */
async function nota() {
  const c = await ler('nota');
  const R = Object.fromEntries(c.rotas.map((r) => [r.chave, r]));
  const FORMA = Object.fromEntries(c.rotas.map((r) => [r.chave, r.forma]));
  const COR = c.classes.map((k) => k.cor);
  const classe = (v) => [45, 55, 60, 65, 75].filter((l) => v >= l).length;
  const cana = R.cana;
  const top = c.etanol_topo;
  const ufMax = c.etanol_ufs[0];
  const ufMin = c.etanol_ufs.at(-1);
  // Pontos: notas baixas por cima (são poucas e somem embaixo das outras).
  const desenhar = (proj, raio = 5.6) => {
    const s = [];
    for (const [k, lon, lat, , cl] of [...c.pontos].sort((a, b) => b[3] - a[3])) {
      const [x, y] = proj([lon, lat]);
      s.push(forma(FORMA[k], x, y, k === 'cana' ? raio : raio * 1.15, COR[cl], { largura: 0.6 }));
    }
    return s.join('\n');
  };
  const LEG = { x: 40, y: 1300, w: 452, h: 266 };
  const legenda = (y0, { tamanho = 15 } = {}) => {
    const s = [];
    let y = y0;
    s.push(texto(0, y, L('nota, gCO₂eq/MJ (cor)', 'score, gCO₂eq/MJ (colour)'), { tamanho: 12, cor: CINZA }));
    y += 10;
    c.classes.forEach((k, i) => {
      const xx = (i % 2) * 210;
      const yy = y + Math.floor(i / 2) * 24;
      s.push(`<rect x="${xx}" y="${yy}" width="30" height="16" fill="${k.cor}" stroke="${BORDA_UF}" stroke-width=".8"/>`);
      s.push(texto(xx + 40, yy + 13, L(k.rotulo, k.rotulo_en), { tamanho, fonte: SERIF }));
    });
    y += 3 * 24 + 22;
    s.push(texto(0, y, L('rota (forma)', 'route (shape)'), { tamanho: 12, cor: CINZA }));
    y += 22;
    c.rotas.filter((r) => r.chave !== 'flex').forEach((r, i) => {
      const xx = (i % 2) * 210;
      const yy = y + Math.floor(i / 2) * 26;
      s.push(forma(r.forma, xx + 12, yy, 7, '#ffffff', { largura: 1.2 }));
      const rot = r.chave === 'milho' ? L('etanol de milho*', 'corn ethanol*') : L(r.rotulo, r.rotulo_en);
      s.push(texto(xx + 30, yy + 5, `${rot} (${r.chave === 'milho' ? r.n + R.flex.n : r.n})`, { tamanho, fonte: SERIF }));
    });
    y += 2 * 26 + 6;
    s.push(texto(0, y, L(`* inclui ${R.flex.n} usinas flex, de cana e milho`, `* includes ${R.flex.n} flex plants, cane and corn`), { tamanho: 11, cor: CINZA }));
    return { svg: s.join('\n'), y };
  };
  return () => ({
    layout: 'um',
    motivo: 'agro',
    serie: serie(1),
    titulo: () => L('A nota de cada usina', 'Each plant’s score'),
    subtitulo: () => L(`O biometano e metade do biodiesel tiram perto de 80; o etanol de cana fica em ${nf(cana.mediana, 0)}`,
      `Biomethane and half the biodiesel score close to 80; cane ethanol sits at ${nf(cana.mediana, 0)}`),
    descricao: () => L(
      `Nota de Eficiência Energético-Ambiental das ${c.total} usinas com certificado do RenovaBio válido em ${c.atualizacao}: quanto o biocombustível emite a menos que o fóssil que ele substitui, em gCO₂eq por MJ`,
      `Energy-Environmental Efficiency Score of the ${c.total} plants holding a valid RenovaBio certificate on ${c.atualizacao}: how much less the biofuel emits than the fossil fuel it replaces, in gCO₂eq per MJ`),
    mapa: () => ({
      preencher: () => FUNDO,
      bordaMunicipio: 0.9,
      bordaUnidadeCor: BORDA_UF,
      semRgint: false,
      bordaRgint: 1.2,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      chamadas: [{
        coord: [top.lon, top.lat], dx: -330, dy: -190,
        titulo: L(`${nf(top.nota, 1)} EM ${top.mun.toUpperCase()} (${top.uf})`, `${nf(top.nota, 1)} IN ${top.mun.toUpperCase()} (${top.uf})`),
        linhas: top.rota === 'flex' ? L(['a maior nota do etanol, numa usina', `de cana e milho; a mediana é ${nf(c.etanol_mediana, 1)}`],
          ['the highest ethanol score, at a cane-', `and-corn plant; the median is ${nf(c.etanol_mediana, 1)}`])
          : L(['a maior nota do etanol;', `a mediana é ${nf(c.etanol_mediana, 1)}`], ['the highest ethanol score;', `the median is ${nf(c.etanol_mediana, 1)}`]),
      }, {
        coord: [-36.4, -9.7], dx: -60, dy: 560,
        titulo: L(`ALAGOAS · MEDIANA ${nf(ufMin.mediana, 1)}`, `ALAGOAS · MEDIAN ${nf(ufMin.mediana, 1)}`),
        linhas: L([`no etanol, a menor entre as UFs com 5`, `usinas ou mais; ${ufMax.uf}, ${nf(ufMax.mediana, 1)}`],
          ['in ethanol, the lowest among states with', `5 plants or more; ${ufMax.uf}, ${nf(ufMax.mediana, 1)}`]),
      }],
    }),
    sobreMapa: (proj) => desenhar(proj),
    reservas: () => [[LEG.x - 10, LEG.y - 10, LEG.x + LEG.w + 10, LEG.y + LEG.h + 10]],
    sobreMapaPrancha: () => {
      const s = [`<rect x="${LEG.x}" y="${LEG.y}" width="${LEG.w}" height="${LEG.h}" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1.2"/>`,
        `<g transform="translate(${LEG.x + 18} ${LEG.y + 30})">`, rotuloPainel(L('USINAS CERTIFICADAS', 'CERTIFIED PLANTS'), 0)];
      s.push(legenda(30).svg, '</g>');
      return s.join('\n');
    },
    legendaFigura: () => {
      const s = [rotuloPainel(L('USINAS CERTIFICADAS', 'CERTIFIED PLANTS'), 0)];
      const l = legenda(30);
      s.push(l.svg);
      return { svg: s.join('\n'), altura: l.y + 10, largura: 430, canto: 'sw' };
    },
    numeros: () => [
      [nf(c.total), [L(`usinas certificadas, em`, `certified plants, in`), L(`${c.municipios} municípios de ${c.ufs} UFs`, `${c.municipios} municipalities, ${c.ufs} states`)]],
      [nf(cana.mediana, 1), [L(`nota mediana do etanol`, `median score of cane`), L(`de cana (${cana.n} usinas)`, `ethanol (${cana.n} plants)`)]],
      [nf(R.biometano.mediana, 1), [L(`nota mediana das ${R.biometano.n}`, `median score of the ${R.biometano.n}`), L('usinas de biometano', 'biomethane plants')]],
      [`${c.biodiesel_baixo.n} × ${c.biodiesel_alto.n}`, [L(`biodiesel: medianas de ${nf(c.biodiesel_baixo.mediana, 0)}`, `biodiesel: medians of ${nf(c.biodiesel_baixo.mediana, 0)}`), L(`(abaixo de 50) e ${nf(c.biodiesel_alto.mediana, 0)} (acima de 70)`, `(below 50) and ${nf(c.biodiesel_alto.mediana, 0)} (above 70)`)]],
    ],
    painel: (y) => {
      // Faixa de pontos: cada usina na sua nota, uma linha por rota.
      const s = [rotuloPainel(L('AS NOTAS, USINA A USINA · gCO₂eq/MJ', 'THE SCORES, PLANT BY PLANT · gCO₂eq/MJ'), y)];
      y += 30;
      const x0 = 118;
      const x1 = LP - 46;
      const vMin = 25;
      const vMax = 85;
      const X = (v) => x0 + ((v - vMin) / (vMax - vMin)) * (x1 - x0);
      const ordem = ['cana', 'milho', 'flex', 'biodiesel', 'biometano'];
      const yTop = y - 14;
      for (const v of [30, 40, 50, 60, 70, 80]) s.push(`<path d="M${f1(X(v))} ${yTop}V${yTop + ordem.length * 34 + 4}" stroke="#e1e4e7" stroke-width=".8"/>`);
      for (const k of ordem) {
        const r = R[k];
        s.push(texto(0, y + 4, rotaCurta(k), { tamanho: 12.5 }));
        // Empilha pontos que caem no mesmo meio ponto de nota.
        const pilha = new Map();
        for (const v of r.notas) {
          const b = Math.round(v * 2);
          const n = pilha.get(b) ?? 0;
          pilha.set(b, n + 1);
          const dy = (n % 2 ? 1 : -1) * Math.ceil(n / 2) * 3.2;
          s.push(`<circle cx="${f1(X(v))}" cy="${f1(y + dy)}" r="2.4" fill="${COR[classe(v)]}" stroke="${TINTA}" stroke-width=".35"/>`);
        }
        s.push(`<path d="M${f1(X(r.mediana))} ${y - 13}V${y + 13}" stroke="${TINTA}" stroke-width="2"/>`);
        s.push(texto(LP, y + 4, `${nf(r.n)}`, { tamanho: 11.5, cor: CINZA, anc: 'end' }));
        y += 34;
      }
      for (const v of [30, 40, 50, 60, 70, 80]) s.push(texto(X(v), y - 8, `${v}`, { tamanho: 11, cor: CINZA, anc: 'middle' }));
      y += 10;
      s.push(texto(0, y, L('traço: mediana · à direita: usinas', 'tick: median · right: plants'), { tamanho: 11, cor: CINZA }));
      y += 34;
      // Etanol por UF: mediana das notas.
      s.push(rotuloPainel(L('ETANOL: NOTA MEDIANA POR UF', 'ETHANOL: MEDIAN SCORE BY STATE'), y));
      y += 26;
      const xb = 40;
      const wb = LP - xb - 130;
      const bMin = 50;
      const bMax = 65;
      for (const u of c.etanol_ufs) {
        const w = ((u.mediana - bMin) / (bMax - bMin)) * wb;
        s.push(texto(0, y, u.uf, { tamanho: 12.5 }));
        s.push(`<rect x="${xb}" y="${y - 10}" width="${f1(w)}" height="12" fill="${COR[u.mediana < 55 ? 1 : u.mediana < 60 ? 2 : 3]}" stroke="${BORDA_UF}" stroke-width=".5"/>`);
        s.push(texto(xb + w + 6, y, nf(u.mediana, 1), { tamanho: 12 }));
        s.push(texto(LP, y, L(`${u.n} usinas`, `${u.n} plants`), { tamanho: 11.5, cor: CINZA, anc: 'end' }));
        y += 18;
      }
      y += 4;
      s.push(texto(0, y, L(`barras a partir de ${bMin}; só UFs com 5 usinas ou mais`, `bars start at ${bMin}; states with 5 plants or more`), { tamanho: 11, cor: CINZA }));
      return { svg: s.join('\n'), y: y + 12 };
    },
    fontes: () => [ANP_RB(), ANP_PAINEIS(), LOCAL()],
  });
}

/* ------------------------------------------------------------------ 2 o litro que não conta */
async function elegivel() {
  const c = await ler('elegivel');
  const R = Object.fromEntries(c.rotas.map((r) => [r.chave, r]));
  const CL = c.classes.map((k) => k.cor);
  const raio = (v) => 1.5 + 0.21 * Math.sqrt(v);
  const pontos = [];
  for (const [k, lon, lat, cap, el] of c.pontos) {
    pontos.push({ coord: [lon, lat], r: raio(cap), cor: TINTA, anel: true, largura: 0.9 });
    pontos.push({ coord: [lon, lat], r: raio(el), cor: R[k].cor, opacidade: 0.92, borda: TINTA, bordaLargura: 0.4 });
  }
  const porUf = c.ufs;
  const sp = porUf.SP;
  const rs = porUf.RS;
  const mt = porUf.MT;
  const LEG = { x: 40, y: 1170, w: 470, h: 396 };
  const legenda = (y0, { tamanho = 15 } = {}) => {
    const s = [];
    let y = y0;
    s.push(texto(0, y, L('UF: volume elegível, ponderado pela capacidade', 'state: eligible volume, capacity-weighted'), { tamanho: 12, cor: CINZA }));
    y += 10;
    [...c.classes].reverse().forEach((k) => { s.push(caixa(k.cor, L(k.rotulo, k.rotulo_en), y, { passo: 22, tamanho })); y += 22; });
    s.push(caixa(FUNDO, L('sem usina com capacidade', 'no plant with capacity data'), y, { passo: 22, tamanho })); y += 22;
    y += 26;
    s.push(texto(0, y, L('usina: anel = capacidade; disco = parte elegível', 'plant: ring = capacity; disc = eligible share'), { tamanho: 12, cor: CINZA }));
    y += 22;
    c.rotas.forEach((r, i) => {
      const xx = (i % 2) * 220;
      const yy = y + Math.floor(i / 2) * 24;
      s.push(`<circle cx="${xx + 9}" cy="${yy - 5}" r="8" fill="${r.cor}" fill-opacity=".9" stroke="${PAPEL}"/>`);
      s.push(texto(xx + 26, yy, L(r.rotulo, r.rotulo_en), { tamanho, fonte: SERIF }));
    });
    s.push(forma('losango', 220 + 9, y + 2 * 24 - 5, 6, '#8c3f2b', { borda: PAPEL, largura: 1 }));
    s.push(texto(220 + 26, y + 2 * 24, L('biometano (sem capacidade)', 'biomethane (no capacity)'), { tamanho, fonte: SERIF }));
    y += 3 * 24 + 4;
    const lc = legendaCirculos([5000, 2000, 500], raio, (v) => `${nf(v)} m³/${L('dia', 'day')}`, { y, cor: CINZA, tamanho: 13 });
    s.push(lc.svg);
    y += lc.altura;
    return { svg: s.join('\n'), y };
  };
  return () => ({
    layout: 'um',
    motivo: 'agro',
    serie: serie(2),
    titulo: () => L('O litro que não conta', 'The litre that doesn’t count'),
    subtitulo: () => L('No biodiesel, menos da metade do volume certificado rende crédito de carbono',
      'In biodiesel, less than half of certified volume earns carbon credits'),
    descricao: () => L(
      `Volume elegível de cada usina certificada no RenovaBio, a parte da produção feita com biomassa que cumpre as regras do programa e que gera CBIO, aplicado à capacidade autorizada pela ANP`,
      `Eligible volume of each RenovaBio-certified plant, the share of output made from biomass that meets the programme’s rules and earns CBIOs, applied to the capacity authorised by the ANP`),
    mapa: () => ({
      preencher: (s) => (porUf[s] ? CL[porUf[s].classe] : FUNDO),
      bordaMunicipio: 1,
      bordaUnidadeCor: '#aab2b9',
      semRgint: false,
      bordaRgint: 2.2,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      pontos,
      chamadas: [{
        coord: [-53.2, -29.2], dx: 250, dy: 120,
        titulo: L(`RIO GRANDE DO SUL · ${pc(rs.pct)}`, `RIO GRANDE DO SUL · ${pc(rs.pct)}`),
        linhas: L([`${rs.n} usinas, quase todas de biodiesel:`, `${mil(rs.cap, 1)} mil m³/dia, ${mil(rs.cap * rs.pct / 100, 1)} mil elegíveis`],
          [`${rs.n} plants, nearly all biodiesel:`, `${mil(rs.cap, 1)} k m³/day, ${mil(rs.cap * rs.pct / 100, 1)} k eligible`]),
      }, {
        coord: [-48.5, -21.6], dx: 300, dy: 40,
        titulo: L(`SÃO PAULO · ${pc(sp.pct)}`, `SÃO PAULO · ${pc(sp.pct)}`),
        linhas: L([`${sp.n} usinas, quase todas de cana;`, `em Mato Grosso, ${pc(mt.pct)}`],
          [`${sp.n} plants, nearly all cane;`, `in Mato Grosso, ${pc(mt.pct)}`]),
      }],
    }),
    sobreMapa: (proj) => c.biometano.map(([lon, lat]) => { const [x, y] = proj([lon, lat]); return forma('losango', x, y, 5, '#8c3f2b', { borda: PAPEL, largura: 1 }); }).join('\n'),
    reservas: () => [[LEG.x - 10, LEG.y - 10, LEG.x + LEG.w + 10, LEG.y + LEG.h + 10]],
    sobreMapaPrancha: () => {
      const s = [`<rect x="${LEG.x}" y="${LEG.y}" width="${LEG.w}" height="${LEG.h}" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1.2"/>`,
        `<g transform="translate(${LEG.x + 18} ${LEG.y + 30})">`, rotuloPainel(L('VOLUME ELEGÍVEL', 'ELIGIBLE VOLUME'), 0)];
      const l = legenda(30, { tamanho: 14 });
      s.push(l.svg);
      s.push('</g>');
      return s.join('\n');
    },
    legendaFigura: () => {
      const s = [rotuloPainel(L('VOLUME ELEGÍVEL', 'ELIGIBLE VOLUME'), 0)];
      const l = legenda(30, { tamanho: 14 });
      s.push(l.svg);
      return { svg: s.join('\n'), altura: l.y + 6, largura: 440, canto: 'sw' };
    },
    numeros: () => [
      [pc(c.total.pct, 1), [L('da capacidade certificada', 'of certified capacity'), L(`é elegível (${mil(c.total.cap_el)} de ${mil(c.total.cap)} mil m³/dia)`, `is eligible (${mil(c.total.cap_el)} of ${mil(c.total.cap)} k m³/day)`)]],
      [pc(c.biodiesel.pct, 1), [L('no biodiesel; no etanol,', 'in biodiesel; in ethanol,'), L(`${pc(c.etanol.pct, 1)}`, `${pc(c.etanol.pct, 1)}`)]],
      [`${c.biodiesel.abaixo_50} / ${c.biodiesel.n}`, [L('usinas de biodiesel com', 'biodiesel plants with'), L('menos da metade elegível', 'under half eligible')]],
      [pc(R.milho.pct, 1), [L('no etanol de milho;', 'in corn ethanol;'), L(`no de cana, ${pc(R.cana.pct, 1)}`, `in cane ethanol, ${pc(R.cana.pct, 1)}`)]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('CAPACIDADE E PARTE ELEGÍVEL, POR ROTA · MIL M³/DIA', 'CAPACITY AND ELIGIBLE SHARE, BY ROUTE · K M³/DAY'), y)];
      y += 26;
      const xr = 112;
      const wr = LP - xr - 150;
      const maxR = Math.max(...c.rotas.map((r) => r.cap));
      for (const r of c.rotas) {
        const wc = Math.max((r.cap / maxR) * wr, 2);
        s.push(texto(0, y, rotaCurta(r.chave), { tamanho: 12.5 }));
        s.push(`<rect x="${xr}" y="${y - 11}" width="${f1(wc)}" height="13" fill="none" stroke="${TINTA}" stroke-width=".8"/>`);
        s.push(`<rect x="${xr}" y="${y - 11}" width="${f1((r.cap_el / maxR) * wr)}" height="13" fill="${r.cor}"/>`);
        s.push(texto(xr + wc + 8, y, pc(r.pct, 1), { tamanho: 12.5 }));
        s.push(texto(LP, y, `${mil(r.cap_el, 1)} / ${mil(r.cap, 1)}`, { tamanho: 11.5, cor: CINZA, anc: 'end' }));
        y += 21;
      }
      s.push(`<rect x="0" y="${y - 6}" width="22" height="10" fill="${R.cana.cor}"/>`);
      s.push(texto(28, y + 3, L('elegível', 'eligible'), { tamanho: 11, cor: CINZA }));
      s.push(`<rect x="120" y="${y - 6}" width="22" height="10" fill="none" stroke="${TINTA}" stroke-width=".8"/>`);
      s.push(texto(148, y + 3, L('capacidade autorizada', 'authorised capacity'), { tamanho: 11, cor: CINZA }));
      y += 34;
      // Por UF: barras do % elegível, nas 14 UFs com mais capacidade.
      s.push(rotuloPainel(L('VOLUME ELEGÍVEL POR UF, PONDERADO · %', 'ELIGIBLE VOLUME BY STATE, WEIGHTED · %'), y));
      y += 24;
      const lista = c.uf_lista.slice(0, 14);
      const meio = Math.ceil(lista.length / 2);
      const colW = LP / 2;
      const wMax = colW - 30 - 80;
      lista.forEach((u, i) => {
        const xc = i < meio ? 0 : colW + 8;
        const yy = y + (i % meio) * 19;
        const x0 = xc + 30;
        const w = (u.pct / 100) * wMax;
        s.push(texto(xc, yy, u.uf, { tamanho: 12.5 }));
        s.push(`<rect x="${x0}" y="${yy - 10}" width="${f1(wMax)}" height="11" fill="none" stroke="#d5d9dd" stroke-width=".6"/>`);
        s.push(`<rect x="${x0}" y="${yy - 10}" width="${f1(w)}" height="11" fill="${CL[porUf[u.uf].classe]}" stroke="${BORDA_UF}" stroke-width=".5"/>`);
        s.push(texto(x0 + wMax + 6, yy, nf(u.pct, 0), { tamanho: 12 }));
      });
      y += meio * 19 - 4;
      s.push(texto(0, y + 4, L(`as 14 UFs com mais capacidade certificada, da maior (SP) à menor`, `the 14 states with most certified capacity, largest (SP) first`), { tamanho: 11, cor: CINZA }));
      y += 30;
      const linhas = L([
        `Com a mesma fração elegível, a nota decide: no biodiesel,`,
        `as usinas de nota acima de 70 emitem ${nf(c.biodiesel_alto.cbio_m3, 2)} CBIO por m³`,
        `vendido, e as de nota abaixo de 50, ${nf(c.biodiesel_baixo.cbio_m3, 2)} (medianas).`,
      ], [
        'With the same eligible share, the score decides: in biodiesel,',
        `plants scoring above 70 issue ${nf(c.biodiesel_alto.cbio_m3, 2)} CBIO per m³ sold,`,
        `and those scoring below 50, ${nf(c.biodiesel_baixo.cbio_m3, 2)} (medians).`,
      ]);
      linhas.forEach((l) => { s.push(texto(0, y, l, { tamanho: 12.5 })); y += 19; });
      return { svg: s.join('\n'), y };
    },
    fontes: () => [ANP_RB(), ANP_PAINEIS(), LOCAL()],
  });
}

/* ------------------------------------------------------------------ 3 a segunda nota */
async function renovacao() {
  const c = await ler('renovacao');
  const CL = c.classes.map((k) => k.cor);
  const R = Object.fromEntries(c.rotas.map((r) => [r.chave, r]));
  const ne = c.regioes.find((r) => r.regiao === 'Nordeste');
  const pontos = c.pontos.map(([k, lon, lat]) => ({ coord: [lon, lat], r: 6.2, cor: CL[k], opacidade: 0.95, borda: TINTA, bordaLargura: 0.5 }));
  // Os que mais mudaram por cima.
  pontos.forEach((p, i) => { p.r = 6.2 - Math.abs(c.pontos[i][0] - 2) * 0.01; });
  const subiuPct = (c.subiu / c.n) * 100;
  const LEG = { x: 40, y: 1330, w: 440, h: 236 };
  const legenda = (y0, { tamanho = 15 } = {}) => {
    const s = [];
    let y = y0;
    s.push(texto(0, y, L('nota em vigor − nota do 1º certificado', 'current score − first-certificate score'), { tamanho: 12, cor: CINZA }));
    y += 24;
    for (const k of [...c.classes].reverse()) {
      s.push(`<circle cx="12" cy="${y - 5}" r="8" fill="${k.cor}" stroke="${TINTA}" stroke-width=".6"/>`);
      s.push(texto(32, y, L(k.rotulo, k.rotulo_en), { tamanho, fonte: SERIF }));
      s.push(texto(LEG.w - 36, y, nf(k.n), { tamanho: 13, cor: CINZA, anc: 'end' }));
      y += 26;
    }
    s.push(texto(0, y, L('gCO₂eq/MJ · à direita: usinas', 'gCO₂eq/MJ · right: plants'), { tamanho: 11, cor: CINZA }));
    return { svg: s.join('\n'), y };
  };
  return () => ({
    layout: 'um',
    motivo: 'agro',
    serie: serie(3),
    titulo: () => L('A segunda nota', 'The second score'),
    subtitulo: () => L(`Na renovação, a nota mediana do milho subiu ${nf(R.milho.nota - R.milho.nota_0, 0)} pontos; no Nordeste, a maioria caiu`,
      `On renewal, corn ethanol’s median score rose ${nf(R.milho.nota - R.milho.nota_0, 0)} points; in the Northeast, most plants fell`),
    descricao: () => L(
      `Diferença entre a nota do certificado em vigor e a do primeiro certificado da mesma usina (CNPJ), para as ${c.n} das ${c.total_validos} usinas certificadas que já passaram por uma renovação`,
      `Difference between the current certificate’s score and the first certificate’s score at the same plant (CNPJ), for the ${c.n} of ${c.total_validos} certified plants that have already been through a renewal`),
    mapa: () => ({
      preencher: () => FUNDO,
      bordaMunicipio: 0.9,
      bordaUnidadeCor: BORDA_UF,
      semRgint: false,
      bordaRgint: 1.2,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      pontos,
      chamadas: [{
        coord: [c.maior.lon, c.maior.lat], dx: -120, dy: -360,
        titulo: L(`${nf(c.maior.nota_0, 1)} → ${nf(c.maior.nota, 1)} EM ${c.maior.mun.toUpperCase()} (${c.maior.uf})`,
          `${nf(c.maior.nota_0, 1)} → ${nf(c.maior.nota, 1)} IN ${c.maior.mun.toUpperCase()} (${c.maior.uf})`),
        linhas: L(['a maior alta, numa usina de cana;', `no Nordeste, ${ne.caiu} de ${ne.n} usinas caíram`],
          ['the largest rise, at a cane mill;', `in the Northeast, ${ne.caiu} of ${ne.n} plants fell`]),
      }, {
        coord: [c.queda.lon, c.queda.lat], dx: -320, dy: 120,
        titulo: L(`${nf(c.queda.nota_0, 1)} → ${nf(c.queda.nota, 1)} EM ${c.queda.mun.toUpperCase()} (${c.queda.uf})`,
          `${nf(c.queda.nota_0, 1)} → ${nf(c.queda.nota, 1)} IN ${c.queda.mun.toUpperCase()} (${c.queda.uf})`),
        linhas: L(['a maior queda, numa usina de biodiesel,', `com o elegível de ${pc(c.queda.eleg_0)} para ${pc(c.queda.eleg)}`],
          ['the largest drop, at a biodiesel plant,', `with eligible volume from ${pc(c.queda.eleg_0)} to ${pc(c.queda.eleg)}`]),
      }],
    }),
    reservas: () => [[LEG.x - 10, LEG.y - 10, LEG.x + LEG.w + 10, LEG.y + LEG.h + 10]],
    sobreMapaFigura: false,
    sobreMapaPrancha: () => {
      const s = [`<rect x="${LEG.x}" y="${LEG.y}" width="${LEG.w}" height="${LEG.h}" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1.2"/>`,
        `<g transform="translate(${LEG.x + 18} ${LEG.y + 30})">`, rotuloPainel(L('MUDANÇA DA NOTA NA RENOVAÇÃO', 'SCORE CHANGE ON RENEWAL'), 0)];
      s.push(legenda(30).svg, '</g>');
      return s.join('\n');
    },
    legendaFigura: () => {
      const s = [rotuloPainel(L('MUDANÇA DA NOTA NA RENOVAÇÃO', 'SCORE CHANGE ON RENEWAL'), 0)];
      const l = legenda(30);
      s.push(l.svg);
      return { svg: s.join('\n'), altura: l.y + 8, largura: 420, canto: 'sw' };
    },
    numeros: () => [
      [`${c.subiu} / ${c.n}`, [L(`usinas subiram a nota`, `plants raised their score`), L(`na renovação (${pc(subiuPct)})`, `on renewal (${pc(subiuPct)})`)]],
      [sinal(c.mediana_delta, 1), [L('mudança mediana,', 'median change,'), L(`de ${nf(c.mediana_0, 1)} para ${nf(c.mediana_1, 1)}`, `from ${nf(c.mediana_0, 1)} to ${nf(c.mediana_1, 1)}`)]],
      [`${nf(R.milho.nota_0, 0)} → ${nf(R.milho.nota, 0)}`, [L(`etanol de milho (${R.milho.n} usinas);`, `corn ethanol (${R.milho.n} plants);`), L(`elegível ${pc(R.milho.eleg_0)} → ${pc(R.milho.eleg)}`, `eligible ${pc(R.milho.eleg_0)} → ${pc(R.milho.eleg)}`)]],
      [`${ne.caiu} / ${ne.n}`, [L('usinas do Nordeste', 'Northeast plants'), L(`perderam nota (${sinal(ne.delta, 1)})`, `lost score (${sinal(ne.delta, 1)})`)]],
    ],
    painel: (y) => {
      // Inclinação: mediana do 1º certificado → mediana do certificado em vigor, por rota.
      const s = [rotuloPainel(L('PRIMEIRA NOTA → NOTA EM VIGOR, MEDIANAS POR ROTA', 'FIRST SCORE → CURRENT SCORE, MEDIANS BY ROUTE'), y)];
      y += 18;
      const h = 150;
      const xa = 150;
      const xb = LP - 150;
      const vMin = 44;
      const vMax = 82;
      const Y = (v) => y + h - ((v - vMin) / (vMax - vMin)) * h;
      s.push(texto(xa, y + 2, L('1º certificado', '1st certificate'), { tamanho: 11, cor: CINZA, anc: 'middle' }));
      s.push(texto(xb, y + 2, L('em vigor', 'current'), { tamanho: 11, cor: CINZA, anc: 'middle' }));
      y += 14;
      const yy = y;
      const Yb = (v) => yy + h - ((v - vMin) / (vMax - vMin)) * h;
      s.push(`<path d="M${xa} ${yy}V${yy + h}M${xb} ${yy}V${yy + h}" stroke="#d5d9dd" stroke-width="1"/>`);
      const COR_R = { cana: '#6f8f3a', milho: '#c9a227', flex: '#9a7b2e', biodiesel: '#4f7590', biometano: '#8c3f2b' };
      // Rótulos sem colisão: empurra para baixo os que ficam a menos de 14 px.
      const arruma = (lista) => { const o = [...lista].sort((a, b) => a.y - b.y); for (let i = 1; i < o.length; i++) if (o[i].y - o[i - 1].y < 14) o[i].y = o[i - 1].y + 14; return o; };
      const esq = arruma(c.rotas.map((r) => ({ k: r.chave, y: Yb(r.nota_0), t: `${rotaCurta(r.chave)} ${nf(r.nota_0, 1)}` })));
      const dir = arruma(c.rotas.map((r) => ({ k: r.chave, y: Yb(r.nota), t: `${nf(r.nota, 1)} ${rotaCurta(r.chave)} (${r.n})` })));
      for (const r of c.rotas) {
        s.push(`<path d="M${xa} ${f1(Yb(r.nota_0))}L${xb} ${f1(Yb(r.nota))}" stroke="${COR_R[r.chave]}" stroke-width="2.6"/>`);
        s.push(`<circle cx="${xa}" cy="${f1(Yb(r.nota_0))}" r="3.5" fill="${COR_R[r.chave]}"/><circle cx="${xb}" cy="${f1(Yb(r.nota))}" r="3.5" fill="${COR_R[r.chave]}"/>`);
      }
      for (const e of esq) s.push(texto(xa - 10, e.y + 4, e.t, { tamanho: 12, anc: 'end' }));
      for (const d of dir) s.push(texto(xb + 10, d.y + 4, d.t, { tamanho: 12 }));
      y = yy + h + 30;
      s.push(texto(0, y - 6, L('gCO₂eq/MJ · entre parênteses: usinas', 'gCO₂eq/MJ · in brackets: plants'), { tamanho: 11, cor: CINZA }));
      y += 28;
      // Histograma da mudança.
      s.push(rotuloPainel(L('QUANTO CADA USINA MUDOU · FAIXAS DE 2 PONTOS', 'HOW MUCH EACH PLANT MOVED · 2-POINT BINS'), y));
      y += 14;
      const hh = 80;
      const { bins, n } = c.hist;
      const x0 = 20;
      const x1 = LP - 10;
      const X = (v) => x0 + ((v - bins[0]) / (bins.at(-1) - bins[0])) * (x1 - x0);
      const nMax = Math.max(...n);
      n.forEach((v, i) => {
        const a = bins[i];
        const b = bins[i + 1];
        const meio = (a + b) / 2;
        const cl = meio < -5 ? 0 : meio < -1 ? 1 : meio <= 1 ? 2 : meio <= 5 ? 3 : 4;
        const hb = (v / nMax) * hh;
        if (v) s.push(`<rect x="${f1(X(a) + 0.5)}" y="${f1(y + hh - hb)}" width="${f1(X(b) - X(a) - 1)}" height="${f1(hb)}" fill="${CL[cl]}" stroke="${TINTA}" stroke-width=".3"/>`);
      });
      s.push(`<path d="M${x0} ${y + hh}H${x1}" stroke="${TINTA}" stroke-width=".8"/>`);
      s.push(`<path d="M${f1(X(0))} ${y - 4}V${y + hh + 4}" stroke="${TINTA}" stroke-width=".8" stroke-dasharray="3 3"/>`);
      for (const v of [-30, -20, -10, 0, 10, 20]) s.push(texto(X(v), y + hh + 16, v > 0 ? `+${v}` : v < 0 ? `−${-v}` : '0', { tamanho: 11, cor: CINZA, anc: 'middle' }));
      s.push(texto(X(bins[0]) , y + 10, L(`pico: ${nMax} usinas`, `peak: ${nMax} plants`), { tamanho: 11, cor: CINZA }));
      y += hh + 40;
      // Por região.
      s.push(rotuloPainel(L('SUBIU × CAIU, POR REGIÃO', 'ROSE × FELL, BY REGION'), y));
      y += 24;
      const xr = 130;
      const wr = LP - xr - 90;
      const maxN = Math.max(...c.regioes.map((r) => r.n));
      for (const r of [...c.regioes].sort((a, b) => b.n - a.n)) {
        const ws = (r.subiu / maxN) * wr;
        const wc = (r.caiu / maxN) * wr;
        s.push(texto(0, y, regiao(r.regiao), { tamanho: 12.5 }));
        s.push(`<rect x="${xr}" y="${y - 10}" width="${f1(ws)}" height="12" fill="${CL[3]}"/>`);
        s.push(`<rect x="${f1(xr + ws)}" y="${y - 10}" width="${f1(wc)}" height="12" fill="${CL[1]}"/>`);
        s.push(texto(xr + ws + wc + 6, y, `${r.subiu} / ${r.caiu}`, { tamanho: 12 }));
        s.push(texto(LP, y, sinal(r.delta, 1), { tamanho: 12, anc: 'end' }));
        y += 19;
      }
      s.push(texto(0, y + 2, L('subiu / caiu · à direita: mudança mediana', 'rose / fell · right: median change'), { tamanho: 11, cor: CINZA }));
      return { svg: s.join('\n'), y: y + 12 };
    },
    fontes: () => [ANP_RB(), ANP_PAINEIS(), LOCAL()],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { nota, elegivel, renovacao };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/renovabio-br/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
// Como na biodiesel-br: o rótulo do oceano do motor sai e este entra ao largo da Bahia.
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
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `renovabio-br-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
