#!/usr/bin/env node
/**
 * Coleção «O biogás na geração distribuída» (Brasil) — desenha uma prancha a partir do cache de preparar.py (uso interno).
 *
 *   node scripts/colecoes/gd-biogas-br/prancha.mjs rede|remoto|tempo
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  RAIZ, LP, SERIF, MONO, CINZA, PAPEL, TINTA, esc, nf, f1, lingua, largura,
  gerarPrancha, rotuloPainel, usarBrasil,
} from '../lib/prancha-sp.mjs';
import { legendaCirculos } from '../lib/arte.mjs';

export const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'gd-biogas-br', 'serie.json'), 'utf8'));
const TOTAL = 3; // pranchas da coleção
const BORDA_UF = '#c9ced3';
const FUNDO = '#f1f2f3';

const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `gd-biogas-br-${nome}.json`), 'utf8'));
const L = (pt, en) => (lingua() === 'en' ? en : pt);
const serie = (i) => () => L(`O BIOGÁS NA GERAÇÃO DISTRIBUÍDA · ${i}/${TOTAL}`, `BIOGAS IN DISTRIBUTED GENERATION · ${i}/${TOTAL}`);
const pc = (v, casas = 0) => `${nf(v, casas)} %`;
const mw = (kw, casas = 1) => nf(kw / 1000, casas);
// Raio dos círculos de potência (kW), o mesmo nas três pranchas.
const raio = (kw) => 1.6 + 0.3 * Math.sqrt(kw);
const ANEEL = () => L('ANEEL, Geração Distribuída, dados abertos (10/2026)', 'ANEEL, Distributed Generation, open data (10/2026)');
const MALHA = () => L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025');
const texto = (x, y, t, { tamanho = 12.5, cor = TINTA, anc = 'start', fonte = MONO, extra = '' } = {}) =>
  `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anc}" font-family="${fonte}" font-size="${tamanho}" fill="${cor}" ${extra}>${esc(t)}</text>`;
const caixa = (cor, rot, y, { passo = 25, x = 0, borda = BORDA_UF, tamanho = 16 } = {}) => `<rect x="${x}" y="${y}" width="34" height="${passo - 8}" fill="${cor}" stroke="${borda}" stroke-width=".8"/>
<text x="${x + 48}" y="${y + passo - 12}" font-family="${SERIF}" font-size="${tamanho}">${esc(rot)}</text>`;
const disco = (cor, cx, cy, r = 8) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${cor}" fill-opacity=".88" stroke="${PAPEL}" stroke-width=".8"/>`;
const circulos = (y, valores = [5000, 1000, 100], cor = CINZA) => legendaCirculos(valores, raio, (v) => `${nf(v)} kW`, { y, cor });

/* ------------------------------------------------------------------ 1 onde o biogás entra na rede */
async function rede() {
  const c = await ler('rede');
  const COR = Object.fromEntries(c.classes.map((k) => [k.chave, k.cor]));
  const pontos = c.pontos.map(([k, lon, lat, kw]) => ({ coord: [lon, lat], r: raio(kw), cor: COR[k], opacidade: 0.85, bordaLargura: 0.8 }));
  const sp = c.maiores[0];
  const pm = c.mais_usinas;
  const mg = c.ufs.find((u) => u.uf === 'MG');
  const pct = (c.kw / c.gd_kw) * 100;
  const fonte = (k) => c.fontes.find((f) => f.chave === k);
  return () => ({
    layout: 'um',
    motivo: 'biogas',
    serie: serie(1),
    titulo: () => L('Onde o biogás entra na rede', 'Where biogas meets the grid'),
    subtitulo: () => L(`${nf(c.n)} pequenas usinas, ${mw(c.kw)} MW: ${pc(pct, 2)} da geração distribuída do país`,
      `${nf(c.n)} small plants, ${mw(c.kw)} MW: ${pc(pct, 2)} of Brazil’s distributed generation`),
    descricao: () => L(
      `Micro e minigeração distribuída a biogás registrada na ANEEL (${c.referencia}), potência instalada somada por município; a cor é a classe de consumo da unidade onde a usina se liga`,
      `Biogas micro- and mini-generation in ANEEL’s distributed generation register (${c.referencia}), installed capacity summed by municipality; colour is the consumer class of the unit the plant connects to`),
    mapa: () => ({
      preencher: () => FUNDO,
      bordaMunicipio: 0.9,
      bordaUnidadeCor: BORDA_UF,
      semRgint: true,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      pontos,
      chamadas: [{
        coord: pm.coord, dx: -480, dy: -40,
        titulo: L(`${pm.nome.toUpperCase()} (${pm.uf}) · ${pm.n} USINAS`, `${pm.nome.toUpperCase()} (${pm.uf}) · ${pm.n} PLANTS`),
        linhas: L([`${pm.rural} delas rurais, quase todas de 55 a 150 kW;`, `${mw(pm.kw)} MW somados, o maior número do país`],
          [`${pm.rural} of them rural, nearly all 55–150 kW;`, `${mw(pm.kw)} MW in all, the most plants anywhere`]),
      }, {
        coord: sp.coord, dx: 300, dy: 130,
        titulo: L(`SÃO PAULO · ${mw(sp.kw)} MW EM ${sp.n} USINAS`, `SÃO PAULO · ${mw(sp.kw)} MW IN ${sp.n} PLANTS`),
        linhas: L(['a maior potência municipal,', 'em unidades comerciais'], ['the largest municipal capacity,', 'at commercial units']),
      }],
    }),
    legendaFigura: () => {
      const s = [rotuloPainel(L('CLASSE DE CONSUMO COM MAIS kW', 'CONSUMER CLASS WITH MOST kW'), 0)];
      let y = 28;
      for (const k of c.classes) {
        s.push(disco(k.cor, 12, y - 6));
        s.push(texto(32, y, L(k.rotulo, k.rotulo_en), { tamanho: 16, fonte: SERIF }));
        y += 26;
      }
      y += 14;
      const lc = circulos(y);
      s.push(lc.svg);
      return { svg: s.join('\n'), altura: y + lc.altura, largura: 380, canto: 'sw' };
    },
    numeros: () => [
      [nf(c.n), [L('usinas a biogás na GD,', 'biogas plants in DG,'), L(`em ${c.municipios} municípios de ${c.ufs_n} UFs`, `in ${c.municipios} municipalities, ${c.ufs_n} states`)]],
      [`${mw(c.kw)} MW`, [L('de potência instalada;', 'of installed capacity;'), L(`mediana de ${nf(c.kw_mediana)} kW por usina`, `median of ${nf(c.kw_mediana)} kW per plant`)]],
      [pc(pct, 2), [L('da potência da GD do país', 'of national DG capacity'), L(`(${mw(c.gd_kw / 1000)} GW, ${pc((c.solar_kw / c.gd_kw) * 100, 1)} solar)`, `(${mw(c.gd_kw / 1000)} GW, ${pc((c.solar_kw / c.gd_kw) * 100, 1)} solar)`)]],
      [nf(mg.n), [L('usinas em Minas Gerais,', 'plants in Minas Gerais,'), L(`${pc((mg.n / c.n) * 100)} do total; ${mw(mg.kw)} MW`, `${pc((mg.n / c.n) * 100)} of the total; ${mw(mg.kw)} MW`)]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('CLASSE DE CONSUMO · MW E USINAS', 'CONSUMER CLASS · MW AND PLANTS'), y)];
      y += 30;
      const maxC = Math.max(...c.classes.map((k) => k.kw));
      const x0 = 250;
      for (const k of c.classes) {
        s.push(disco(k.cor, 12, y - 6));
        s.push(texto(32, y, L(k.rotulo, k.rotulo_en), { tamanho: 15, fonte: SERIF }));
        const w = (k.kw / maxC) * (LP - x0 - 110);
        s.push(`<rect x="${x0}" y="${y - 12}" width="${f1(w)}" height="13" fill="${k.cor}" fill-opacity=".85"/>`);
        s.push(texto(x0 + w + 6, y, mw(k.kw), { tamanho: 13 }));
        s.push(texto(LP, y, nf(k.n), { tamanho: 13, cor: CINZA, anc: 'end' }));
        y += 23;
      }
      y += 18;
      s.push(rotuloPainel(L('AS UFS · MW E USINAS', 'THE STATES · MW AND PLANTS'), y));
      y += 26;
      const ufs = c.ufs.slice(0, 6);
      const maxU = ufs[0].kw;
      for (const u of ufs) {
        const w = (u.kw / maxU) * (LP - 60 - 130);
        s.push(texto(0, y, u.uf, { tamanho: 13 }));
        s.push(`<rect x="40" y="${y - 11}" width="${f1(w)}" height="12" fill="#5c6166" fill-opacity=".7"/>`);
        s.push(texto(46 + w, y, mw(u.kw), { tamanho: 12.5 }));
        s.push(texto(LP, y, nf(u.n), { tamanho: 12.5, cor: CINZA, anc: 'end' }));
        y += 19;
      }
      const resto = c.ufs.slice(6);
      s.push(texto(0, y + 2, L(`outras ${resto.length} UFs: ${mw(resto.reduce((a, u) => a + u.kw, 0))} MW, ${resto.reduce((a, u) => a + u.n, 0)} usinas (${resto.map((u) => u.uf).join(', ')})`,
        `other ${resto.length} states: ${mw(resto.reduce((a, u) => a + u.kw, 0))} MW, ${resto.reduce((a, u) => a + u.n, 0)} plants (${resto.map((u) => u.uf).join(', ')})`), { tamanho: 11.5, cor: CINZA }));
      y += 32;
      s.push(rotuloPainel(L('A FONTE DECLARADA NO REGISTRO · MW', 'FUEL AS DECLARED IN THE REGISTER · MW'), y));
      y += 26;
      c.fontes.forEach((f, i) => {
        const xx = (i % 2) * (LP / 2 + 8);
        const yy = y + Math.floor(i / 2) * 20;
        s.push(texto(xx, yy, L(f.rotulo, f.rotulo_en), { tamanho: 13, fonte: SERIF }));
        s.push(texto(xx + LP / 2 - 12, yy, mw(f.kw), { tamanho: 12.5, anc: 'end' }));
      });
      y += 44;
      s.push(texto(0, y, L(`${c.rural_urbano.n} usinas rurais aparecem com «resíduos urbanos»: a fonte`, `${c.rural_urbano.n} rural plants are filed as «urban waste»: the fuel`), { tamanho: 11.5, cor: CINZA }));
      s.push(texto(0, y + 16, L('é a declarada e nem sempre bate com a atividade.', 'is as declared and does not always match the activity.'), { tamanho: 11.5, cor: CINZA }));
      y += 38;
      s.push(rotuloPainel(L('POTÊNCIA INSTALADA NO MUNICÍPIO', 'INSTALLED CAPACITY IN THE MUNICIPALITY'), y));
      const lc = circulos(y + 16);
      s.push(lc.svg);
      return { svg: s.join('\n'), y: y + 16 + lc.altura };
    },
    fontes: () => [ANEEL(), MALHA()],
  });
}

/* ------------------------------------------------------------------ 2 gerar aqui, consumir lá */
const MODS = [
  ['propria', 'na própria unidade', 'on site', '#b3bac1'],
  ['remoto', 'autoconsumo remoto', 'remote self-consumption', '#234e70'],
  ['compartilhada', 'compartilhada', 'shared generation', '#6b3d5c'],
  ['condominio', 'condomínio', 'condominium', '#c08a2e'],
];

async function remoto() {
  const c = await ler('remoto');
  const COR = Object.fromEntries(c.classes.map((k) => [k.classe, k.cor]));
  COR[-1] = PAPEL;
  const porUf = Object.fromEntries(c.ufs.map((u) => [u.uf, u]));
  const car = c.cariacica;
  const sp = c.maiores_uc.find((m) => m.nome === 'São Paulo');
  const COR_FORA = MODS[1][3];
  const pontos = [
    ...c.pontos.map(([lon, lat, kw]) => ({ coord: [lon, lat], r: raio(kw), cor: TINTA, anel: true, largura: 1 })),
    ...c.pontos.filter((p) => p[3] > 0).map(([lon, lat, , fora]) => ({ coord: [lon, lat], r: raio(fora), cor: COR_FORA, opacidade: 0.85, bordaLargura: 0.8 })),
  ];
  const itens = () => [...[...c.classes].reverse().map((k) => [k.cor, L(k.rotulo, k.rotulo_en)]), [PAPEL, L('sem biogás na GD', 'no biogas in DG')]];
  const simbolos = (y, x = 0, t = 15) => [
    `<circle cx="${x + 12}" cy="${y - 6}" r="9" fill="none" stroke="${TINTA}" stroke-width="1"/>`,
    texto(x + 32, y, L('potência a biogás no município', 'biogas capacity in the municipality'), { tamanho: t, fonte: SERIF }),
    `<circle cx="${x + 12}" cy="${y + 20}" r="8" fill="${COR_FORA}" fill-opacity=".85" stroke="${PAPEL}"/>`,
    texto(x + 32, y + 26, L('parte que credita outras unidades', 'share credited to other units'), { tamanho: t, fonte: SERIF }),
  ].join('\n');
  const solarFora = c.solar_fora_pct;
  return () => ({
    layout: 'um',
    motivo: 'biogas',
    serie: serie(2),
    titulo: () => L('Gerar aqui, consumir lá', 'Made here, used elsewhere'),
    subtitulo: () => L(`${pc(c.bio_fora_pct)} da potência a biogás abate a conta de outras unidades; na solar, ${pc(solarFora)}`,
      `${pc(c.bio_fora_pct)} of biogas capacity offsets other units’ bills; for solar, ${pc(solarFora)}`),
    descricao: () => L(
      'Usinas a biogás da geração distribuída em autoconsumo remoto ou geração compartilhada, cuja energia vira crédito em outras unidades consumidoras; por município da usina e parte da potência de cada UF',
      'Biogas plants in distributed generation under remote self-consumption or shared generation, whose energy becomes credit at other consumer units; by the plant’s municipality and share of each state’s capacity'),
    mapa: () => ({
      preencher: (s) => COR[porUf[s]?.classe ?? -1],
      bordaMunicipio: 1,
      bordaUnidadeCor: '#aab2b9',
      semRgint: true,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      pontos,
      chamadas: [{
        coord: car.coord, dx: 80, dy: 190,
        titulo: L(`CARIACICA (ES) · ${nf(car.uc)} UNIDADES`, `CARIACICA (ES) · ${nf(car.uc)} UNITS`),
        linhas: L([`creditadas por ${car.n} consórcios a biogás,`, `geração compartilhada, ${mw(car.kw)} MW`],
          [`credited by ${car.n} biogas consortia,`, `shared generation, ${mw(car.kw)} MW`]),
      }, {
        coord: [-46.63, -23.6], dx: -300, dy: 190,
        titulo: L(`SÃO PAULO · ${nf(sp.uc)} UNIDADES`, `SÃO PAULO · ${nf(sp.uc)} UNITS`),
        linhas: L([`creditadas por ${sp.n} usinas comerciais (${mw(sp.kw)} MW)`, 'em autoconsumo remoto'],
          [`credited by ${sp.n} commercial plants (${mw(sp.kw)} MW)`, 'under remote self-consumption']),
      }],
    }),
    legendaFigura: () => {
      const s = [rotuloPainel(L('POTÊNCIA QUE CREDITA OUTRAS UNIDADES, % DA UF', 'CAPACITY CREDITED ELSEWHERE, % OF STATE'), 0)];
      let y = 22;
      for (const [cor, rot] of itens()) { s.push(caixa(cor, rot, y)); y += 25; }
      y += 34;
      s.push(rotuloPainel(L('POR MUNICÍPIO DA USINA', 'BY THE PLANT’S MUNICIPALITY'), y));
      y += 30;
      s.push(simbolos(y));
      y += 50;
      const lc = circulos(y);
      s.push(lc.svg);
      return { svg: s.join('\n'), altura: y + lc.altura, largura: 440, canto: 'sw' };
    },
    numeros: () => [
      [pc(c.bio_fora_pct), [L('da potência a biogás vira', 'of biogas capacity becomes'), L(`crédito fora (solar: ${pc(solarFora)})`, `credit elsewhere; solar ${pc(solarFora)}`)]],
      [nf(c.bio_fora_uc), [L('unidades consumidoras recebem', 'consumer units receive'), L(`crédito de ${c.bio_fora_n} usinas a biogás`, `credit from ${c.bio_fora_n} biogas plants`)]],
      [pc(c.biogas.compartilhada.pct), [L('em geração compartilhada', 'in shared generation'), L(`(solar: ${pc(c.solar.compartilhada.pct, 1)})`, `(solar: ${pc(c.solar.compartilhada.pct, 1)})`)]],
      [pc((car.uc / c.bio_fora_uc) * 100), [L('dessas unidades recebem', 'of those units get credit'), L('de usinas em Cariacica (ES)', 'from plants in Cariacica (ES)')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('ONDE VAI A ENERGIA · % DA POTÊNCIA', 'WHERE THE ENERGY GOES · % OF CAPACITY'), y)];
      y += 20;
      const x0 = 80;
      const W = LP - x0;
      for (const [nome, d] of [[L('biogás', 'biogas'), c.biogas], [L('solar', 'solar'), c.solar]]) {
        s.push(texto(0, y + 17, nome, { tamanho: 15, fonte: SERIF }));
        let x = x0;
        for (const [k, , , cor] of MODS) {
          const v = d[k]?.pct ?? 0;
          if (!v) continue;
          const w = (v / 100) * W;
          s.push(`<rect x="${f1(x)}" y="${y}" width="${f1(Math.max(w - 1.5, 0.5))}" height="24" fill="${cor}"/>`);
          if (w > 44) s.push(texto(x + w / 2, y + 17, nf(v), { tamanho: 13, anc: 'middle', cor: k === 'propria' ? TINTA : PAPEL }));
          x += w;
        }
        y += 34;
      }
      MODS.forEach(([, pt, en, cor], i) => {
        const xx = (i % 2) * (LP / 2);
        const yy = y + 4 + Math.floor(i / 2) * 22;
        s.push(`<rect x="${xx}" y="${yy - 11}" width="16" height="12" fill="${cor}"/>`);
        s.push(texto(xx + 24, yy, L(pt, en), { tamanho: 14, fonte: SERIF }));
      });
      y += 46;
      s.push(texto(0, y, L(`Unidades com crédito por MW fora da usina: ${nf(c.bio_fora_uc_mw)} no biogás, ${nf(c.solar_fora_uc_mw)} na solar.`, `Credited units per MW used elsewhere: ${nf(c.bio_fora_uc_mw)} for biogas, ${nf(c.solar_fora_uc_mw)} for solar.`), { tamanho: 11.5, cor: CINZA }));
      y += 36;
      s.push(rotuloPainel(L('ONDE ESTÃO AS USINAS QUE CREDITAM MAIS', 'WHERE THE PLANTS CREDITING MOST ARE'), y));
      y += 26;
      const cols = [[0, 'start', L('município da usina', 'plant’s municipality')], [340, 'end', L('usinas', 'plants')], [430, 'end', 'MW'], [LP, 'end', L('unidades', 'units')]];
      for (const [x, anc, t] of cols) s.push(texto(x, y, t, { tamanho: 11.5, cor: CINZA, anc }));
      y += 22;
      for (const m of c.maiores_uc.slice(0, 5)) {
        s.push(texto(0, y, `${m.nome} (${m.uf})`, { tamanho: 13.5, fonte: SERIF }));
        s.push(texto(340, y, nf(m.n), { tamanho: 13, anc: 'end' }));
        s.push(texto(430, y, mw(m.kw), { tamanho: 13, anc: 'end' }));
        s.push(texto(LP, y, nf(m.uc), { tamanho: 13, anc: 'end' }));
        y += 21;
      }
      y += 2;
      const nota = L([
        'O registro diz quantas unidades recebem o crédito,',
        'mas não onde elas estão: o mapa mostra só onde a',
        'energia é gerada. Remoto e compartilhada exigem a',
        'mesma área de concessão da distribuidora.',
      ], [
        'The register says how many units receive the credit,',
        'but not where they are: the map only shows where the',
        'energy is generated. Remote and shared generation must',
        'stay within the same distributor’s concession area.',
      ]);
      nota.forEach((l, i) => s.push(texto(0, y + i * 19, l, { tamanho: 13, cor: i < 2 ? TINTA : CINZA })));
      y += nota.length * 19 + 16;
      s.push(rotuloPainel(L('POTÊNCIA A BIOGÁS', 'BIOGAS CAPACITY'), y));
      const lc = circulos(y + 16);
      s.push(lc.svg);
      s.push(simbolos(y + 40, LP - 290, 13).replace(L('potência a biogás no município', 'biogas capacity in the municipality'), L('total no município', 'municipal total'))
        .replace(L('parte que credita outras unidades', 'share credited to other units'), L('credita outras unidades', 'credited elsewhere')));
      return { svg: s.join('\n'), y: y + 16 + lc.altura };
    },
    fontes: () => [ANEEL(), MALHA()],
  });
}

/* ------------------------------------------------------------------ 3 o biogás que chegou à conta de luz */
async function tempo() {
  const c = await ler('tempo');
  const COR = Object.fromEntries(c.periodos.map((p) => [p.chave, p.cor]));
  const COR_CL = Object.fromEntries(c.classes.map((k) => [k.chave, k.cor]));
  const ser = c.serie;
  const pico = ser.reduce((a, b) => (b.n > a.n ? b : a));
  const s16 = ser.find((k) => k.ano === 2016);
  const s25 = ser.at(-1);
  const dma = (d) => d.split('-').reverse().join('/');
  const ultimo = dma(c.ultimo);
  const fim = dma(c.fim_registro);
  const ate = (corte) => (corte.ate ? L(`ATÉ ${corte.ate}`, `TO ${corte.ate}`) : L(`ATÉ ${ultimo.slice(3)}`, `TO ${ultimo.slice(3)}`));
  const faixa = (nota) => {
    const s = [texto(0, -24, L('ano de atualização mais antigo no município', 'earliest update year in the municipality'), { tamanho: 12, cor: CINZA })];
    let x = 0;
    for (const p of c.periodos) {
      s.push(disco(p.cor, x + 7, -7, 7));
      s.push(texto(x + 20, -2, L(p.rotulo, p.rotulo_en), { tamanho: 13 }));
      x += 20 + largura(L(p.rotulo, p.rotulo_en), 13, { mono: true }) + 22;
    }
    s.push(texto(0, 20, nota, { tamanho: 11.5, cor: CINZA }));
    return s.join('\n');
  };
  const mapa = (corte) => ({
    titulo: `${ate(corte)} · ${nf(corte.municipios)} ${L('MUNICÍPIOS', 'MUNICIPALITIES')}`,
    pad: 64,
    preencher: () => FUNDO,
    bordaMunicipio: 1,
    bordaUnidadeCor: BORDA_UF,
    semRgint: true,
    tamanhoUnidade: 11,
    pontos: corte.pontos.map(([p, lon, lat, kw]) => ({ coord: [lon, lat], r: raio(kw) * 0.8, cor: COR[p], opacidade: 0.88, bordaLargura: 0.7 })),
    legenda: faixa(L(`${nf(corte.n)} usinas, ${mw(corte.kw)} MW em ${corte.ufs} UFs · círculo: kW acumulado`,
      `${nf(corte.n)} plants, ${mw(corte.kw)} MW in ${corte.ufs} states · circle: cumulative kW`)),
  });
  // Colunas: kW pelo ano da última atualização cadastral, empilhado por classe de consumo, e o número de usinas em cima.
  const colunas = (w, y0, h) => {
    const s = [];
    const n = ser.length;
    const passo = (w - 50) / n;
    const max = 35000;
    const Y = (v) => y0 + h - (v / max) * h;
    for (const v of [0, 10000, 20000, 30000]) {
      s.push(`<path d="M44 ${f1(Y(v))}H${f1(w)}" stroke="#d5d9dd" stroke-width=".8"/>`);
      s.push(texto(38, Y(v) + 4, nf(v / 1000), { tamanho: 11, cor: CINZA, anc: 'end' }));
    }
    s.push(texto(38, y0 - 12, 'MW', { tamanho: 11, cor: CINZA, anc: 'end' }));
    ser.forEach((k, i) => {
      const x = 50 + i * passo;
      let base = 0;
      for (const cl of c.classes) {
        const v = k.por_classe[cl.chave];
        if (!v) continue;
        s.push(`<rect x="${f1(x + 3)}" y="${f1(Y(base + v))}" width="${f1(passo - 6)}" height="${f1(Y(base) - Y(base + v))}" fill="${cl.cor}" fill-opacity=".88"/>`);
        base += v;
      }
      s.push(texto(x + passo / 2, Y(k.kw) - 6, nf(k.n), { tamanho: 11.5, anc: 'middle' }));
      s.push(texto(x + passo / 2, y0 + h + 17, `’${String(k.ano).slice(2)}`, { tamanho: 11, cor: CINZA, anc: 'middle' }));
    });
    return s.join('\n');
  };
  return () => ({
    layout: 'quatro',
    motivo: 'biogas',
    serie: serie(3),
    titulo: () => L('O biogás que chegou à conta de luz', 'Biogas on the electricity bill'),
    subtitulo: () => L(`Pelo ano da última atualização no registro, o biogás sobe até ${pico.ano} e quase some depois de 2023`,
      `By year of last registry update, biogas climbs until ${pico.ano} and nearly vanishes after 2023`),
    descricao: () => L(
      'Usinas a biogás da geração distribuída pelo ano da última atualização cadastral no registro da ANEEL, que aproxima o ano de entrada mas não é a data de ligação; nos mapas, os municípios com usina até cada corte',
      'Biogas plants in distributed generation by year of last update in ANEEL’s register, which approximates the year of entry but is not the connection date; on the maps, municipalities with a plant by each cut-off'),
    mapas: () => c.cortes.map(mapa),
    quartoQuadro: (w) => {
      const s = [rotuloPainel(L('POTÊNCIA POR ANO DA ÚLTIMA ATUALIZAÇÃO · MW', 'CAPACITY BY YEAR OF LAST UPDATE · MW'), 0)];
      let x = 0;
      for (const cl of c.classes) {
        const r = L(cl.rotulo, cl.rotulo_en);
        s.push(`<rect x="${x}" y="16" width="14" height="11" fill="${cl.cor}" fill-opacity=".88"/>`);
        s.push(texto(x + 20, 26, r, { tamanho: 12 }));
        x += 20 + largura(r, 12, { mono: true }) + 18;
      }
      s.push(colunas(w, 60, 210));
      s.push(texto(0, 318, L(`número em cima: usinas; cor: classe de consumo; registro até ${fim}`, `number on top: plants; colour: consumer class; register to ${fim}`), { tamanho: 11.5, cor: CINZA }));
      return s.join('\n');
    },
    numeros: () => [
      [nf(pico.n), [L(`usinas com última atualização`, `plants last updated`), L(`em ${pico.ano}, o máximo (${mw(pico.kw)} MW)`, `in ${pico.ano}, the most (${mw(pico.kw)} MW)`)]],
      [nf(ser.filter((k) => k.ano >= 2024).reduce((a, k) => a + k.n, 0)), [L('usinas a biogás atualizadas', 'biogas plants updated'), L(`em 2024–2026 (até ${fim})`, `in 2024–2026 (to ${fim})`)]],
      [L(`${nf(c.atualizacoes_2026.solar / 1000)} mil`, `${nf(c.atualizacoes_2026.solar / 1000)} k`), [L('usinas solares atualizadas', 'solar plants updated'), L('em 2026; a biogás, nenhuma', 'in 2026; biogas, none')]],
      [`${nf(s16.pct_gd_ano, 1)} → ${nf(s25.pct_gd_ano, 1)} %`, [L('do biogás nos kW da GD,', 'biogas share of DG kW,'), L(`por ano de atualização, ${s16.ano} → ${s25.ano}`, `by update year, ${s16.ano} → ${s25.ano}`)]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('POR ANO DA ÚLTIMA ATUALIZAÇÃO CADASTRAL', 'BY YEAR OF LAST REGISTRY UPDATE'), y)];
      y += 28;
      const cols = [[0, 'start', L('ano', 'year')], [130, 'end', L('usinas', 'plants')], [250, 'end', 'MW'], [390, 'end', L('municípios novos', 'new municipalities')], [LP, 'end', L('% da GD', '% of DG')]];
      for (const [x, anc, t] of cols) s.push(texto(x, y, t, { tamanho: 11.5, cor: CINZA, anc }));
      y += 22;
      for (const k of ser) {
        const forte = k.ano === pico.ano;
        const extra = forte ? 'font-weight="bold"' : '';
        s.push(texto(0, y, String(k.ano), { tamanho: 13, extra }));
        s.push(texto(130, y, nf(k.n), { tamanho: 13, anc: 'end', extra }));
        s.push(texto(250, y, mw(k.kw), { tamanho: 13, anc: 'end', extra }));
        s.push(texto(390, y, nf(k.municipios_novos), { tamanho: 13, anc: 'end' }));
        s.push(texto(LP, y, nf(k.pct_gd_ano, k.pct_gd_ano < 1 ? 2 : 1), { tamanho: 13, anc: 'end', cor: CINZA }));
        y += 19;
      }
      y += 6;
      s.push(texto(0, y, L(`atualização a biogás mais recente: ${ultimo}; % da GD: parte do biogás nos kW do ano`,
        `latest biogas update: ${ultimo}; % of DG: biogas share of that year’s kW`), { tamanho: 11, cor: CINZA }));
      y += 32;
      s.push(rotuloPainel(L('ANO DE ATUALIZAÇÃO MAIS ANTIGO, POR UF', 'EARLIEST UPDATE YEAR, BY STATE'), y));
      y += 26;
      const porAno = {};
      for (const [uf, a] of Object.entries(c.uf_inicio)) (porAno[a] ??= []).push(uf);
      const linhas = Object.entries(porAno).map(([a, ufs]) => `${a} ${ufs.join(' ')}`);
      const meio = Math.ceil(linhas.length / 2);
      linhas.forEach((l, i) => s.push(texto(i < meio ? 0 : LP / 2 + 8, y + (i % meio) * 19, l, { tamanho: 13 })));
      y += meio * 19 + 4;
      return { svg: s.join('\n'), y };
    },
    fontes: () => [ANEEL(), MALHA()],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { rede, remoto, tempo };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/gd-biogas-br/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
// O motor põe o rótulo do oceano do Brasil em [-31.5, -21] (lib/prancha-sp.mjs), em cima de Trindade e Martim Vaz.
// Como na etanol-br, o do motor sai e este entra ao largo da Bahia.
const OCEANO = [-33.5, -16];
const comOceano = (t) => {
  if (t.layout !== 'um') return t;
  const { mapa, sobreMapa } = t;
  return Object.assign(t, {
    mapa: () => ({ ...mapa(), oceano: false }),
    sobreMapaFigura: true,
    sobreMapa: (proj) => {
      const [x, y] = proj(OCEANO);
      return `${sobreMapa?.(proj) ?? ''}
<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="19" letter-spacing="5" fill="#6f8796">${L('OCEANO ATLÂNTICO', 'ATLANTIC OCEAN')}</text>`;
    },
  });
};
await usarBrasil();
const e = SERIE.find((s) => s.tema === nome);
const fazer = await TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => comOceano(fazer()) });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `gd-biogas-br-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
