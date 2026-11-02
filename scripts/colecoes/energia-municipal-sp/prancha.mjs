#!/usr/bin/env node
/**
 * Coleção «A energia de cada município» (SP) — desenha uma prancha a partir do cache de preparar.py (uso interno).
 *
 *   node scripts/colecoes/energia-municipal-sp/prancha.mjs roca|tanque|gas
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  RAIZ, LP, SERIF, MONO, CINZA, PAPEL, TINTA, esc, nf, f1, lingua, gerarPrancha, rotuloPainel, linhasDe,
} from '../lib/prancha-sp.mjs';
import { CESTO, VALE } from '../lib/arte.mjs';

const COL = 'energia-municipal-sp';
export const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', COL, 'serie.json'), 'utf8'));
const TOTAL = 3;
const HACH = '#aeb4ba';
const LIM_RGINT = '#1a211a';

const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `${COL}-${nome}.json`), 'utf8'));
const L = (pt, en) => (lingua() === 'en' ? en : pt);
const serie = (i) => () => L(`A ENERGIA DE CADA MUNICÍPIO · ${i}/${TOTAL}`, `EACH TOWN’S ENERGY · ${i}/${TOTAL}`);
const pct = (v, casas = 0) => `${nf(v, casas)}${lingua() === 'en' ? '' : ' '}%`;
const FONTE_SEMIL = () => L('SEMIL/SP, Anuário de Energéticos por Município 2025', 'SEMIL/SP, Municipal Energy Yearbook 2025');
const FONTE_MALHA = () => L('IBGE, Malha Municipal 2025; Censo 2022', 'IBGE, Municipal Mesh 2025; 2022 Census');
const hachura = (id) => `<defs><pattern id="${id}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="${PAPEL}"/><path d="M0 0V7" stroke="${HACH}" stroke-width="1.1"/></pattern></defs>`;
let nh = 0;
const novoId = () => `emh${nh++}`;
const texto = (x, y, t, { tam = 15, cor = TINTA, fonte = SERIF, ancora = 'start', italico = false, extra = '' } = {}) =>
  `<text x="${f1(x)}" y="${f1(y)}" font-family="${fonte}" font-size="${tam}"${italico ? ' font-style="italic"' : ''} fill="${cor}"${ancora !== 'start' ? ` text-anchor="${ancora}"` : ''}${extra}>${esc(t)}</text>`;
const nota = (y, t, max = LP) => {
  const s = [];
  for (const l of linhasDe(t, 15, max, { italico: true })) { s.push(texto(0, y, l, { italico: true, cor: '#4f4a41' })); y += 21; }
  return { svg: s.join('\n'), y };
};

/* ------------------------------------------------------------------ friso */
/** Friso da coleção: a rede que corre pela roça, poste a poste, e os fios caídos em catenária. */
function rede(w, h) {
  const s = [];
  const passo = 70;
  const topo = 10;
  const n = Math.floor(w / passo);
  const x0 = (w - n * passo) / 2;
  s.push(`<path d="M0 ${h - 1}H${w}" stroke="${CESTO}" stroke-width="1"/>`);
  for (let i = 0; i <= n; i++) {
    const x = x0 + i * passo;
    s.push(`<path d="M${f1(x)} ${h - 1}V${topo}M${f1(x - 9)} ${topo + 6}H${f1(x + 9)}" stroke="${VALE}" stroke-width="1.2"/>`);
    if (i < n) {
      for (const [dy, dx] of [[6, -9], [6, 9]]) {
        const xa = x + dx;
        const xb = x + passo + dx;
        s.push(`<path d="M${f1(xa)} ${topo + dy}Q${f1((xa + xb) / 2)} ${topo + dy + 16} ${f1(xb)} ${topo + dy}" fill="none" stroke="${CESTO}" stroke-width="1"/>`);
      }
    }
  }
  return s.join('');
}

/** Legenda em coluna de caixas, com a contagem de municípios à direita. */
function colunaClasses(itens, y, { contagem = null, passo = 25, larg = LP } = {}) {
  const id = novoId();
  const s = [hachura(id)];
  itens.forEach(([cor, rot, n], i) => {
    const yy = y + i * passo;
    s.push(`<rect x="0" y="${yy - 14}" width="34" height="17" fill="${cor ?? `url(#${id})`}" stroke="${LIM_RGINT}" stroke-width=".6"/>`);
    s.push(texto(48, yy, rot, { tam: 15 }));
    if (contagem && n != null) s.push(texto(larg, yy, nf(n), { tam: 13, fonte: MONO, ancora: 'end', cor: CINZA }));
  });
  return { svg: s.join('\n'), y: y + itens.length * passo };
}

/* ------------------------------------------------------------------ 1 a luz da roça */
async function roca() {
  const c = await ler('roca');
  const C = c.cores;
  const rot = () => L(c.rotulos, c.rotulos_en);
  const itai = c.maiores.find((m) => m.nome === 'Itaí');
  const pied = c.mais_ligacoes[0];
  const mwh = (kwh) => nf(kwh / 1000, kwh >= 100000 ? 0 : 1);
  const itens = (comN) => [...C.map((cor, i) => [cor, rot()[i], comN ? c.contagem[i] : null]),
    [null, L('sem informação ou erro no Anuário', 'no data or a Yearbook error'), comN ? c.sem_info : null]];
  const titLeg = () => L('KWH POR LIGAÇÃO RURAL, EM RELAÇÃO À MÉDIA', 'KWH PER RURAL CONNECTION, RELATIVE TO THE MEAN');
  return () => ({
    layout: 'um',
    motivo: rede,
    serie: serie(1),
    titulo: () => L('A luz da roça', 'Lights on the farm'),
    subtitulo: () => L('Onde cada ligação rural gasta muito mais que a média', 'Where each rural connection uses far more than the mean'),
    descricao: () => L(
      `Eletricidade da classe rural por consumidor (ligação) em 2024, dividida pela média do estado, ${nf(c.media)} kWh por ano. A classe rural junta lavoura, criação, irrigação, parte da agroindústria e moradias da roça.`,
      `Rural-class electricity per consumer (connection) in 2024, divided by the state mean of ${nf(c.media)} kWh a year. The rural class covers crops, livestock, irrigation, part of agro-industry and farm homes.`),
    mapa: () => ({
      preencher: (cd) => (c.municipios[cd] == null ? null : C[c.municipios[cd]]),
      bordaMunicipio: 0.4,
      bordaRgint: 1,
      chamadas: [{
        coord: itai.coord, dx: -40, dy: 250,
        titulo: L(`ITAÍ · ${mwh(itai.kwh_nc)} MWH POR LIGAÇÃO`, `ITAÍ · ${mwh(itai.kwh_nc)} MWH PER CONNECTION`),
        linhas: L([`${itai.nc} ligações rurais, ${nf(itai.razao, 0)} × a média;`, `${pct(itai.pct)} da eletricidade da cidade`],
          [`${itai.nc} rural connections, ${nf(itai.razao, 0)} × the mean;`, `${pct(itai.pct)} of the town’s electricity`]),
      }, {
        coord: pied.coord, dx: 120, dy: 190,
        titulo: L(`PIEDADE · ${nf(pied.nc)} LIGAÇÕES RURAIS`, `PIEDADE · ${nf(pied.nc)} RURAL CONNECTIONS`),
        linhas: L([`o município com mais ligações rurais; ${mwh(pied.kwh_nc)} MWh`, `cada; ${pct(pied.pct)} da eletricidade da cidade`],
          [`the state’s most rural connections, ${mwh(pied.kwh_nc)} MWh`, `each; ${pct(pied.pct)} of the town’s electricity`]),
      }],
    }),
    legendaFigura: () => {
      const s = [rotuloPainel(titLeg(), 0)];
      s.push(texto(0, 22, L(`média do estado: ${nf(c.media)} kWh por ano`, `state mean: ${nf(c.media)} kWh a year`), { tam: 12, fonte: MONO, cor: CINZA }));
      s.push(colunaClasses(itens(false), 52, { passo: 23 }).svg);
      return { svg: s.join('\n'), altura: 52 + 8 * 23, largura: 430, canto: 'sw' };
    },
    numeros: () => [
      [L(`${nf(c.media)} kWh`, `${nf(c.media)} kWh`), [L('por ligação rural em 2024,', 'per rural connection in 2024,'), L(`${nf(c.media / c.residencial, 1)} × o de uma casa`, `${nf(c.media / c.residencial, 1)} × a home’s`)]],
      [nf(c.acima2.n), [L('municípios com o dobro', 'municipalities at twice'), L('da média ou mais', 'the mean or more')]],
      [pct(c.acima2.pct_kwh), [L('da luz da roça vai para', 'of farm electricity goes'), L(`esses, com ${pct(c.acima2.pct_ligacoes)} das ligações`, `there, with ${pct(c.acima2.pct_ligacoes)} of connections`)]],
      [L(`${nf(c.mediana_municipios)} kWh`, `${nf(c.mediana_municipios)} kWh`), [L('no município mediano:', 'in the median municipality:'), L('poucos puxam a média', 'a few pull the mean up')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(titLeg(), y)];
      y += 20;
      s.push(texto(0, y, L(`média do estado: ${nf(c.media)} kWh por ano · nº de municípios`, `state mean: ${nf(c.media)} kWh a year · no. of municipalities`), { tam: 12, fonte: MONO, cor: CINZA }));
      y += 30;
      const leg = colunaClasses(itens(true), y, { contagem: true, passo: 24 });
      s.push(leg.svg);
      y = leg.y + 22;
      // Os maiores consumos por ligação.
      s.push(rotuloPainel(L('MWH POR LIGAÇÃO RURAL · OS 6 MAIORES', 'MWH PER RURAL CONNECTION · TOP 6'), y));
      y += 26;
      const x0 = 196;
      const larg = LP - x0 - 120;
      const top = c.maiores.slice(0, 6);
      y += 0;
      const max = top[0].kwh_nc;
      for (const m of top) {
        const w = (m.kwh_nc / max) * larg;
        s.push(texto(0, y, m.nome, { tam: 14.5 }));
        s.push(`<rect x="${x0}" y="${y - 12}" width="${f1(Math.max(w, 1.5))}" height="11" fill="${C[c.lim.findIndex((l) => m.razao < l) === -1 ? C.length - 1 : c.lim.findIndex((l) => m.razao < l)]}"/>`);
        s.push(texto(x0 + w + 6, y - 2, mwh(m.kwh_nc), { tam: 12, fonte: MONO }));
        s.push(texto(LP, y - 2, L(`${m.nc} lig.`, `${m.nc} conn.`), { tam: 12, fonte: MONO, ancora: 'end', cor: CINZA }));
        y += 22;
      }
      y += 18;
      const n = nota(y, L(
        `Seis municípios ficam de fora: em Ribeirão Preto, Rifaina, Rincão, Restinga, Reginópolis e Sales Oliveira o kWh rural repete, número por número, outra célula da tabela.`,
        `Six municipalities are left out: in Ribeirão Preto, Rifaina, Rincão, Restinga, Reginópolis and Sales Oliveira the rural kWh repeats, digit for digit, another cell of the table.`));
      s.push(n.svg);
      return { svg: s.join('\n'), y: n.y };
    },
    fontes: () => [FONTE_SEMIL(), FONTE_MALHA()],
  });
}

/* ------------------------------------------------------------------ 2 o tanque de cada cidade */
/** OKLCh → hex, baixando o croma até caber na gama (o mesmo de preparar.py). */
function oklch(L, C, h) {
  let rgb;
  for (let k = 0; k < 40; k++) {
    const a = C * Math.cos((h * Math.PI) / 180);
    const b = C * Math.sin((h * Math.PI) / 180);
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
    if (rgb.every((v) => v >= -1e-4 && v <= 1.0001)) break;
    C *= 0.93;
  }
  return `#${rgb.map((v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.max(v, 0) ** (1 / 2.4) - 0.055))
    .map((v) => Math.min(255, Math.max(0, Math.round(v * 255))).toString(16).padStart(2, '0')).join('')}`;
}

const COMP = ['etanol', 'gasolina', 'diesel'];
const VERT = [[0.5, Math.sqrt(3) / 2], [0, 0], [1, 0]];
const CENTRO = [0.5, Math.sqrt(3) / 6];
const xyT = (p) => [p[0] * VERT[0][0] + p[1] * VERT[1][0] + p[2] * VERT[2][0], p[0] * VERT[0][1] + p[1] * VERT[1][1] + p[2] * VERT[2][1]];

async function tanque() {
  const c = await ler('tanque');
  const K = c.cor;
  const corDe = (p) => {
    const [x, y] = xyT(p);
    const vx = x - CENTRO[0];
    const vy = y - CENTRO[1];
    const t = Math.min(1, Math.hypot(vx, vy) / c.raio);
    const ang = (Math.atan2(vy, vx) * 180) / Math.PI;
    return oklch(K.L0 - K.L1 * t, K.C1 * t, (((K.h_ang - ang) % 360) + 360) % 360);
  };
  const centrar = (x) => { const y = x.map((v, i) => v / c.centro[i]); const s = y[0] + y[1] + y[2]; return y.map((v) => v / s); };
  const NOME = () => L(['etanol hidratado', 'gasolina C', 'óleo diesel'], ['hydrous ethanol', 'petrol C', 'diesel oil']);
  const CURTO = () => L(['ETANOL', 'GASOLINA C', 'DIESEL'], ['ETHANOL', 'PETROL C', 'DIESEL']);
  const vert = [corDe([0.92, 0.04, 0.04]), corDe([0.04, 0.92, 0.04]), corDe([0.04, 0.04, 0.92])];
  /** O triângulo da legenda: a composição centrada, com a grade das partes originais e os municípios em pontos. */
  const triangulo = (lado, { pontos = true, grade = true } = {}) => {
    const h = (lado * Math.sqrt(3)) / 2;
    const P = ([x, y]) => [x * lado, h - (y / (Math.sqrt(3) / 2)) * h];
    const s = [];
    const n = 30;
    // Campo de cor: triângulos pequenos coloridos pelo centro.
    for (let i = 0; i < n; i++) for (let j = 0; j < n - i; j++) {
      const tri = (a, b, d) => {
        const cen = [(a[0] + b[0] + d[0]) / 3, (a[1] + b[1] + d[1]) / 3, (a[2] + b[2] + d[2]) / 3];
        const pts = [a, b, d].map((q) => P(xyT(q)).map(f1).join(' ')).join(' ');
        s.push(`<polygon points="${pts}" fill="${corDe(cen)}" stroke="${corDe(cen)}" stroke-width=".6"/>`);
      };
      const q = (ii, jj) => [ii / n, jj / n, (n - ii - jj) / n];
      tri(q(i, j), q(i + 1, j), q(i, j + 1));
      if (j < n - i - 1) tri(q(i + 1, j), q(i + 1, j + 1), q(i, j + 1));
    }
    if (grade) {
      // Linhas de parte original constante (25, 50 e 75 %), levadas para o triângulo centrado.
      for (const [i, k] of COMP.entries()) for (const a of [0.25, 0.5, 0.75]) {
        const o = [0, 1, 2].filter((j) => j !== i);
        const e1 = [0, 0, 0]; e1[i] = a; e1[o[0]] = 1 - a;
        const e2 = [0, 0, 0]; e2[i] = a; e2[o[1]] = 1 - a;
        const [x1, y1] = P(xyT(centrar(e1)));
        const [x2, y2] = P(xyT(centrar(e2)));
        s.push(`<path d="M${f1(x1)} ${f1(y1)}L${f1(x2)} ${f1(y2)}" stroke="${PAPEL}" stroke-width="${a === 0.5 ? 1.3 : 0.7}" stroke-opacity=".85"/>`);
        if (a === 0.5 && false) {
          const [xm, ym] = [(x1 * 0.12 + x2 * 0.88), (y1 * 0.12 + y2 * 0.88)];
          s.push(`<text x="${f1(xm)}" y="${f1(ym - 4)}" font-family="${MONO}" font-size="10.5" text-anchor="middle" fill="${TINTA}" stroke="${PAPEL}" stroke-width="3" paint-order="stroke">${esc(`${k === 'etanol' ? 'E' : k === 'gasolina' ? 'G' : 'D'} 50 %`)}</text>`);
        }
      }
    }
    if (pontos) for (const p of c.pontos) {
      const [x, y] = P(xyT(p));
      s.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="1.7" fill="${p[3]}" stroke="${TINTA}" stroke-width=".35"/>`);
    }
    const [cx, cy] = P(CENTRO);
    s.push(`<circle cx="${f1(cx)}" cy="${f1(cy)}" r="4" fill="none" stroke="${TINTA}" stroke-width="1.4"/>`);
    s.push(`<polygon points="${[VERT[0], VERT[1], VERT[2]].map((v) => P(v).map(f1).join(' ')).join(' ')}" fill="none" stroke="${TINTA}" stroke-width="1"/>`);
    return { svg: s.join('\n'), h };
  };
  const rotVert = (lado, h, tam = 13) => [
    texto(lado / 2, -10, CURTO()[0], { tam, fonte: MONO, ancora: 'middle', extra: ' letter-spacing="1.5"' }),
    texto(0, h + 22, CURTO()[1], { tam, fonte: MONO, ancora: 'start', extra: ' letter-spacing="1.5"' }),
    texto(lado, h + 22, CURTO()[2], { tam, fonte: MONO, ancora: 'end', extra: ' letter-spacing="1.5"' }),
  ].join('\n');
  const [ce, cg, cd] = c.centro.map((v) => v * 100);
  const santa = c.mais.etanol[0];
  const potim = c.mais.gasolina[0];
  const ameri = c.mais.diesel[0];
  const linhaComp = (m) => L(`etanol ${pct(m.etanol)} · gasolina ${pct(m.gasolina)} · diesel ${pct(m.diesel)}`,
    `ethanol ${pct(m.etanol)} · petrol ${pct(m.gasolina)} · diesel ${pct(m.diesel)}`);
  return () => ({
    layout: 'um',
    motivo: rede,
    serie: serie(2),
    titulo: () => L('O tanque de cada cidade', 'Every town’s tank'),
    subtitulo: () => L('Etanol, gasolina e diesel: quem foge da mistura do estado', 'Ethanol, petrol and diesel: who strays from the state’s mix'),
    descricao: () => L(
      `Energia vendida em 2024 de etanol hidratado, gasolina C e óleo diesel, em partes do total do município. As cores medem o desvio da mistura do estado (${nf(ce)} % etanol, ${nf(cg)} % gasolina, ${nf(cd)} % diesel), que fica cinza.`,
      `Energy sold in 2024 as hydrous ethanol, petrol C and diesel oil, as shares of the municipal total. Colours measure the departure from the state’s mix (${nf(ce)}% ethanol, ${nf(cg)}% petrol, ${nf(cd)}% diesel), shown in grey.`),
    mapa: () => ({
      preencher: (cd_) => c.municipios[cd_] ?? null,
      bordaMunicipio: 0.4,
      bordaRgint: 1,
      chamadas: [{
        coord: santa.coord, dx: -40, dy: -400,
        titulo: L(`${santa.nome.toUpperCase()} · ${pct(santa.etanol)} ETANOL`, `${santa.nome.toUpperCase()} · ${pct(santa.etanol)} ETHANOL`),
        linhas: [L('a maior parte de etanol entre as cidades', 'the largest ethanol share among towns'), L('de 20 mil habitantes ou mais', 'of 20,000 people or more')],
      }, {
        coord: ameri.coord, dx: 170, dy: -215,
        titulo: L(`${ameri.nome.toUpperCase()} · ${pct(ameri.diesel)} DIESEL`, `${ameri.nome.toUpperCase()} · ${pct(ameri.diesel)} DIESEL`),
        linhas: [L(`${nf(ameri.gj_hab)} GJ por habitante, ${nf(ameri.gj_hab / c.gj_hab_estado)} × o estado:`, `${nf(ameri.gj_hab)} GJ per person, ${nf(ameri.gj_hab / c.gj_hab_estado)} × the state:`),
          L('venda no município não é consumo dos moradores', 'sales in a town are not its residents’ use')],
      }, {
        coord: potim.coord, dx: -60, dy: 330,
        titulo: L(`${potim.nome.toUpperCase()} · ${pct(potim.gasolina)} GASOLINA`, `${potim.nome.toUpperCase()} · ${pct(potim.gasolina)} PETROL`),
        linhas: [linhaComp(potim)],
      }],
    }),
    legendaFigura: () => {
      const lado = 250;
      const tri = triangulo(lado, { pontos: true, grade: true });
      const s = [rotuloPainel(L('ENERGIA VENDIDA, CENTRADA NO ESTADO', 'ENERGY SOLD, CENTRED ON THE STATE'), 0)];
      s.push(`<g transform="translate(60 52)">${tri.svg}${rotVert(lado, tri.h, 12)}</g>`);
      return { svg: s.join('\n'), altura: 52 + tri.h + 30, largura: 380, canto: 'sw' };
    },
    numeros: () => [
      [pct(cd), [L('da energia é diesel; etanol', 'of the energy is diesel;'), L(`${pct(ce)}, gasolina C ${pct(cg)}`, `ethanol ${pct(ce)}, petrol C ${pct(cg)}`)]],
      [nf(c.dominante.diesel), [L('municípios em que o diesel', 'municipalities where diesel'), L('é a maior parte', 'is the largest share')]],
      [L(`${nf(c.gj_hab_estado, 1)} GJ`, `${nf(c.gj_hab_estado, 1)} GJ`), [L('por habitante no ano, com', 'per person a year, incl.'), L(`o GNV (${pct((100 * c.toe.gnv) / (c.toe.etanol + c.toe.gasolina + c.toe.diesel + c.toe.gnv), 1)})`, `CNG (${pct((100 * c.toe.gnv) / (c.toe.etanol + c.toe.gasolina + c.toe.diesel + c.toe.gnv), 1)})`)]],
      [nf(c.dominante.etanol), [L('municípios em que o etanol', 'municipalities where ethanol'), L('passa a gasolina e o diesel', 'tops petrol and diesel')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('COMO LER A COR', 'HOW TO READ THE COLOUR'), y)];
      y += 22;
      const lado = 214;
      const tri = triangulo(lado);
      s.push(`<g transform="translate(14 ${y + 22})">${tri.svg}${rotVert(lado, tri.h)}</g>`);
      const xt = lado + 44;
      const larg = LP - xt;
      let yt = y + 36;
      const itensTxt = L([
        'O meio do triângulo, cinza, é a mistura do estado.',
        'Mais etanol que o estado puxa para o verde; mais gasolina, para o vermelho; mais diesel, para o azul.',
        'Cor mais forte, desvio maior.',
        'Pontos: municípios. Linhas brancas: 25, 50 e 75 % de cada combustível.',
      ], [
        'The grey centre of the triangle is the state’s mix.',
        'More ethanol than the state pulls towards green; more petrol, towards red; more diesel, towards blue.',
        'Stronger colour, bigger departure.',
        'Dots: municipalities. White lines: 25, 50 and 75% of each fuel.',
      ]);
      for (const t of itensTxt) {
        for (const l of linhasDe(t, 14, larg)) { s.push(texto(xt, yt, l, { tam: 14 })); yt += 19; }
        yt += 8;
      }
      y = Math.max(y + tri.h + 80, yt + 10);
      // Composição por região intermediária: barras empilhadas.
      s.push(rotuloPainel(L('A MISTURA DE CADA REGIÃO INTERMEDIÁRIA', 'EACH INTERMEDIATE REGION’S MIX'), y));
      y += 14;
      const x0 = 196;
      const lb = LP - x0;
      const regs = [...c.regioes].sort((a, b) => b.etanol - a.etanol);
      for (const r of regs) {
        y += 17;
        s.push(texto(0, y, r.nome, { tam: 14 }));
        let x = x0;
        COMP.forEach((k, i) => {
          const w = (r[k] / 100) * lb;
          s.push(`<rect x="${f1(x)}" y="${f1(y - 12)}" width="${f1(w)}" height="13" fill="${vert[i]}"/>`);
          if (w > 34) s.push(texto(x + w / 2, y - 1.5, nf(r[k]), { tam: 10.5, fonte: MONO, ancora: 'middle', cor: i === 0 || i === 2 ? PAPEL : TINTA }));
          x += w;
        });
      }
      y += 19;
      s.push(texto(0, y, L('% da energia: etanol · gasolina C · diesel', '% of energy: ethanol · petrol C · diesel'), { tam: 11.5, fonte: MONO, cor: CINZA }));
      return { svg: s.join('\n'), y: y + 6 };
    },
    fontes: () => [FONTE_SEMIL(), FONTE_MALHA()],
  });
}

/* ------------------------------------------------------------------ 3 gás de cano, gás de botijão */
async function gas() {
  const c = await ler('gas');
  const C = c.cores;
  const [t1, t2] = c.terco_glp;
  const jard = c.mais_glp_sem_gn_20mil[0];
  const sant = c.mais_gn[0];
  const cap = c.capital;
  const gnTot = Object.values(c.gn_classes_m3).reduce((a, b) => a + b, 0);
  const pctInd = (100 * c.gn_classes_m3.industrial) / gnTot;
  const ROT_GN = () => L(['sem gás de cano', 'até a mediana', 'acima da mediana'], ['no piped gas', 'up to the median', 'above the median']);
  const ROT_GLP = () => [`≤ ${nf(t1)}`, `${nf(t1)}–${nf(t2)}`, `> ${nf(t2)}`];
  /** A grade 3 × 3: gás de cano na vertical (de baixo para cima), GLP na horizontal; com contagem, se pedida. */
  const grade = (cel, { contagem = false, tamRot = 13 } = {}) => {
    const s = [];
    const xg = 150;
    const yg = 0;
    for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) {
      const x = xg + b * cel;
      const y = yg + (2 - a) * cel;
      s.push(`<rect x="${x}" y="${y}" width="${cel}" height="${cel}" fill="${C[a][b]}" stroke="${PAPEL}" stroke-width="2"/>`);
      if (contagem) s.push(texto(x + cel / 2, y + cel / 2 + 5, nf(c.grade[a][b]), { tam: 13, fonte: MONO, ancora: 'middle', cor: a === 2 && b > 0 ? PAPEL : TINTA }));
    }
    ROT_GN().forEach((r, a) => s.push(texto(xg - 10, yg + (2 - a) * cel + cel / 2 + 5, r, { tam: tamRot, ancora: 'end' })));
    ROT_GLP().forEach((r, b) => s.push(texto(xg + b * cel + cel / 2, yg + 3 * cel + 20, r, { tam: tamRot - 1, fonte: MONO, ancora: 'middle' })));
    s.push(texto(xg + 1.5 * cel, yg + 3 * cel + 42, L('GLP, kg por habitante →', 'LPG, kg per person →'), { tam: tamRot - 1, fonte: MONO, ancora: 'middle', cor: CINZA }));
    s.push(texto(0, yg - 12, L('gás de cano, GJ por hab. ↑', 'piped gas, GJ per person ↑'), { tam: tamRot - 1, fonte: MONO, cor: CINZA }));
    return { svg: s.join('\n'), h: 3 * cel + 48, w: xg + 3 * cel };
  };
  return () => ({
    layout: 'um',
    motivo: rede,
    serie: serie(3),
    titulo: () => L('Gás de cano, gás de botijão', 'Piped gas, bottled gas'),
    subtitulo: () => L('Onde o gás vem pela rede, onde vem no botijão', 'Where gas comes by pipe, where by cylinder'),
    descricao: () => L(
      `Gás natural canalizado de uso fixo (sem GNV e sem usinas térmicas) e GLP vendidos em 2024, por habitante. Gás de cano: nenhum, até a mediana dos municípios atendidos (${nf(c.mediana_gn_gj_hab, 1)} GJ) ou acima. GLP: terços dos municípios.`,
      `Piped natural gas for fixed use (no CNG, no power plants) and LPG sold in 2024, per person. Piped gas: none, up to the median of the towns served (${nf(c.mediana_gn_gj_hab, 1)} GJ) or above. LPG: thirds of the municipalities.`),
    mapa: () => ({
      preencher: (cd) => c.municipios[cd] ?? null,
      bordaMunicipio: 0.4,
      bordaRgint: 1,
      chamadas: [{
        coord: jard.coord, dx: -150, dy: -300,
        titulo: L(`JARDINÓPOLIS · ${nf(jard.glp_kg_hab)} KG DE GLP POR HAB.`, `JARDINÓPOLIS · ${nf(jard.glp_kg_hab)} KG OF LPG PER PERSON`),
        linhas: L([`sem gás de cano; ${nf(jard.glp_kg_hab / c.glp_kg_hab_estado, 0)} × a média do estado,`, `o maior entre as cidades de 20 mil hab. ou mais`],
          [`no piped gas; ${nf(jard.glp_kg_hab / c.glp_kg_hab_estado, 0)} × the state average,`, `the highest among towns of 20,000 or more`]),
      }, {
        coord: sant.coord, dx: -330, dy: 120,
        titulo: L(`SANTA GERTRUDES · ${nf(sant.gn_gj_hab)} GJ POR HAB.`, `SANTA GERTRUDES · ${nf(sant.gn_gj_hab)} GJ PER PERSON`),
        linhas: L([`o maior gás de cano por habitante,`, `${nf(sant.gn_gj_hab / c.mediana_gn_gj_hab, 0)} × a mediana dos atendidos`],
          [`the most piped gas per person,`, `${nf(sant.gn_gj_hab / c.mediana_gn_gj_hab, 0)} × the median of towns served`]),
      }, {
        coord: cap.coord, dx: -260, dy: 290,
        titulo: L(`SÃO PAULO · ${nf(cap.gn_gj_hab, 1)} GJ E ${nf(cap.glp_kg_hab)} KG POR HAB.`, `SÃO PAULO · ${nf(cap.gn_gj_hab, 1)} GJ AND ${nf(cap.glp_kg_hab)} KG PER PERSON`),
        linhas: L([`a capital fica no meio da grade: gás de cano`, `abaixo da mediana, GLP no terço do meio`],
          [`the capital sits mid-grid: piped gas below`, `the median, LPG in the middle third`]),
      }],
    }),
    legendaFigura: () => {
      const g = grade(54);
      const s = [rotuloPainel(L('GÁS DE CANO × GLP, POR HABITANTE', 'PIPED GAS × LPG, PER PERSON'), 0)];
      s.push(`<g transform="translate(0 56)">${g.svg}</g>`);
      return { svg: s.join('\n'), altura: 56 + g.h, largura: 420, canto: 'sw' };
    },
    numeros: () => [
      [nf(c.com_gn), [L('municípios com gás de cano,', 'municipalities with piped'), L(`${pct(c.pct_pop_com_gn)} da população`, `gas, ${pct(c.pct_pop_com_gn)} of the people`)]],
      [pct(c.pct_glp_sem_gn), [L('do GLP sai nos municípios', 'of LPG is sold in towns'), L(`sem rede (${pct(c.pct_pop_sem_gn)} do povo)`, `with no pipes (${pct(c.pct_pop_sem_gn)} of people)`)]],
      [pct(pctInd), [L('do gás de cano de uso fixo', 'of fixed-use piped gas'), L('vai para a indústria', 'goes to industry')]],
      [L(`${nf(c.glp_kg_hab_estado, 1)} kg`, `${nf(c.glp_kg_hab_estado, 1)} kg`), [L('de GLP por habitante no ano;', 'of LPG per person a year;'), L(`mediana ${nf(c.glp_kg_hab_mediana, 1)} kg`, `median ${nf(c.glp_kg_hab_mediana, 1)} kg`)]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('GÁS DE CANO × GLP · Nº DE MUNICÍPIOS', 'PIPED GAS × LPG · NO. OF MUNICIPALITIES'), y)];
      y += 36;
      const g = grade(58, { contagem: true, tamRot: 14 });
      s.push(`<g transform="translate(0 ${y})">${g.svg}</g>`);
      // Ao lado da grade: o que diz o canto do botijão.
      const xt = g.w + 26;
      let yt = y + 16;
      const txt = L(
        `${nf(c.alto_sem.n)} municípios sem gás de cano estão no terço de cima do GLP: levam ${pct(c.alto_sem.pct_glp)} do GLP do estado.`,
        `${nf(c.alto_sem.n)} municipalities with no piped gas sit in LPG’s top third: they take ${pct(c.alto_sem.pct_glp)} of the state’s LPG.`);
      for (const l of linhasDe(txt, 14, LP - xt)) { s.push(texto(xt, yt, l, { tam: 14 })); yt += 19; }
      y += g.h + 34;
      // GLP por habitante nas cidades maiores sem rede.
      s.push(rotuloPainel(L('KG DE GLP POR HAB. · SEM REDE, 20 MIL HAB. +', 'KG OF LPG PER PERSON · NO PIPES, 20,000+'), y));
      y += 28;
      const x0 = 196;
      const larg = LP - x0 - 110;
      const top = c.mais_glp_sem_gn_20mil.slice(0, 4);
      const max = top[0].glp_kg_hab;
      for (const m of top) {
        const w = (m.glp_kg_hab / max) * larg;
        s.push(texto(0, y, m.nome, { tam: 14.5 }));
        s.push(`<rect x="${x0}" y="${y - 12}" width="${f1(w)}" height="11" fill="${C[0][2]}"/>`);
        s.push(texto(x0 + w + 6, y - 2, nf(m.glp_kg_hab), { tam: 12, fonte: MONO }));
        s.push(texto(LP, y - 2, L(`${nf(m.pop / 1000)} mil hab.`, `${nf(m.pop / 1000)}k people`), { tam: 12, fonte: MONO, ancora: 'end', cor: CINZA }));
        y += 22;
      }
      y += 14;
      const n = nota(y, L(
        `GLP vendido não é GLP queimado ali: o botijão é contado onde a distribuidora vende, e muito se compra na cidade vizinha. Borá, com ${nf(c.mais_glp[0].pop)} habitantes, aparece com ${nf(c.mais_glp[0].glp_kg_hab)} kg por pessoa.`,
        `LPG sold is not LPG burned there: the cylinder is counted where the distributor sells it, and much is bought in the next town. Borá, with ${nf(c.mais_glp[0].pop)} people, shows ${nf(c.mais_glp[0].glp_kg_hab)} kg per person.`));
      s.push(n.svg);
      return { svg: s.join('\n'), y: n.y };
    },
    fontes: () => [FONTE_SEMIL(), FONTE_MALHA()],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { roca, tanque, gas };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/${COL}/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
const e = SERIE.find((s) => s.tema === nome);
const fazer = await TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => fazer() });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `${COL}-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
