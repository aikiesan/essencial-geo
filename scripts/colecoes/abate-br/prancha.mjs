#!/usr/bin/env node
/**
 * Coleção «Onde o bicho vira resíduo» (Brasil) — desenha uma prancha a partir do cache de preparar.py (uso interno).
 *
 *   node scripts/colecoes/abate-br/prancha.mjs sif|rebanho|ciclo
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  RAIZ, LP, SERIF, MONO, CINZA, PAPEL, TINTA, esc, nf, f1, lingua,
  gerarPrancha, rotuloPainel, usarBrasil,
} from '../lib/prancha-sp.mjs';
import { legendaCirculos } from '../lib/arte.mjs';

export const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'abate-br', 'serie.json'), 'utf8'));
const TOTAL = 3;
const BORDA_UF = '#c9ced3';

const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `abate-br-${nome}.json`), 'utf8'));
const L = (pt, en) => (lingua() === 'en' ? en : pt);
const serie = (i) => () => L(`ONDE O BICHO VIRA RESÍDUO · ${i}/${TOTAL}`, `WHERE LIVESTOCK BECOMES RESIDUE · ${i}/${TOTAL}`);
const mil = (v, casas = 0) => nf(v / 1000, casas);
const mi = (v, casas = 1) => nf(v / 1e6, casas);
const pc = (v, casas = 0) => `${nf(v, casas)} %`;
const SIGSIF = () => L('MAPA, SIGSIF, dados abertos (10/2026)', 'MAPA, SIGSIF open data (10/2026)');
const ABATE = () => L('IBGE, Pesquisa Trimestral do Abate de Animais', 'IBGE, Quarterly Livestock Slaughter Survey');
const PPM = () => L('IBGE, Pesquisa da Pecuária Municipal 2025', 'IBGE, Municipal Livestock Survey 2025');
const MALHA = () => L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025');
const texto = (x, y, t, { tamanho = 12.5, cor = TINTA, anc = 'start', fonte = MONO, extra = '' } = {}) =>
  `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anc}" font-family="${fonte}" font-size="${tamanho}" fill="${cor}" ${extra}>${esc(t)}</text>`;
const HACHURA = (id) => `<defs><pattern id="${id}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="${PAPEL}"/><path d="M0 0V7" stroke="#aeb4ba" stroke-width="1.1"/></pattern></defs>`;

/* ------------------------------------------------------------------ 1 os abatedouros do SIF */
async function sif() {
  const c = await ler('sif');
  const G = Object.fromEntries(c.grupos.map((g) => [g.chave, g]));
  const ABATE_G = ['bovinos', 'aves', 'suinos', 'mista', 'outra'];
  const MIUDOS = ['carne', 'leite', 'ovos', 'pescado', 'mel'];
  const CINZA_PT = '#8e959c';
  const R_AB = 5.6;
  // Pontos por município: os abatedouros em girassol (passo fixo em pixels), os demais num ponto só.
  const porMun = new Map();
  for (const [g, lon, lat, cd] of c.pontos) {
    if (!porMun.has(cd)) porMun.set(cd, { coord: [lon, lat], ab: [], gx: 0, outros: 0 });
    const m = porMun.get(cd);
    if (ABATE_G.includes(g)) m.ab.push(g);
    else if (g === 'graxaria') m.gx += 1;
    else m.outros += 1;
  }
  const OURO = Math.PI * (3 - Math.sqrt(5));
  const desenhar = (proj) => {
    const fundo = [];
    const gx = [];
    const ab = [];
    for (const m of porMun.values()) {
      const [x, y] = proj(m.coord);
      if (m.outros) fundo.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(Math.min(1.8 + 0.5 * Math.sqrt(m.outros), 6))}" fill="${CINZA_PT}" fill-opacity=".45"/>`);
      if (m.gx) gx.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(3.2 + 1.4 * (m.gx - 1))}" fill="none" stroke="${TINTA}" stroke-width="1.3"/>`);
      m.ab.forEach((g, i) => {
        const r = i === 0 ? 0 : 6.2 * Math.sqrt(i + 0.3);
        const a = i * OURO;
        ab.push(`<circle cx="${f1(x + r * Math.cos(a))}" cy="${f1(y + r * Math.sin(a))}" r="${R_AB}" fill="${G[g].cor}" fill-opacity=".92" stroke="${PAPEL}" stroke-width="1"/>`);
      });
    }
    return [...fundo, ...gx, ...ab].join('\n');
  };
  const n = (g) => G[g].n;
  const ufs = [...c.ufs].map((u) => ({ ...u, ab: ABATE_G.reduce((a, g) => a + u[g], 0) })).sort((a, b) => b.ab - a.ab);
  const sulAvesPct = (c.sul_aves / c.aves) * 100;
  const sulSuiPct = (c.sul_suinos / c.suinos) * 100;
  const LEG = { x: 40, y: 1270, w: 520, h: 280 };
  const simbolo = (g, cx, cy) => {
    if (ABATE_G.includes(g)) return `<circle cx="${cx}" cy="${cy}" r="${R_AB + 1}" fill="${G[g].cor}" stroke="${PAPEL}"/>`;
    if (g === 'graxaria') return `<circle cx="${cx}" cy="${cy}" r="5" fill="none" stroke="${TINTA}" stroke-width="1.4"/>`;
    return `<circle cx="${cx}" cy="${cy}" r="4" fill="${CINZA_PT}" fill-opacity=".6"/>`;
  };
  const ROT_CURTO = {
    bovinos: ['abatedouro de bovinos', 'cattle slaughterhouse'], aves: ['abatedouro de aves', 'poultry slaughterhouse'],
    suinos: ['abatedouro de suínos', 'pig slaughterhouse'], mista: ['abatedouro de várias espécies', 'multi-species slaughterhouse'],
    outra: ['outras espécies ou não informada', 'other or unlisted species'],
    graxaria: ['fábrica de não comestíveis', 'inedible by-products plant'],
  };
  const itens = (y, { numeros = false, direita = 400, tamanho = 15 } = {}) => {
    const s = [];
    for (const g of [...ABATE_G, 'graxaria']) {
      s.push(simbolo(g, 10, y - 5));
      s.push(texto(30, y, L(...ROT_CURTO[g]), { tamanho, fonte: SERIF }));
      if (numeros) s.push(texto(direita, y, nf(n(g)), { tamanho: 13, anc: 'end' }));
      y += 24;
    }
    s.push(simbolo('leite', 10, y - 5));
    s.push(texto(30, y, L('leite, carne processada, ovos, pescado, mel', 'dairy, processed meat, eggs, fish, honey'), { tamanho: tamanho - 1, fonte: SERIF }));
    if (numeros) s.push(texto(direita, y, nf(MIUDOS.reduce((a, g) => a + n(g), 0)), { tamanho: 13, anc: 'end' }));
    y += 20;
    s.push(texto(0, y, L('abatedouros: um disco por estabelecimento,', 'slaughterhouses: one disc per plant,'), { tamanho: 11.5, cor: CINZA }));
    s.push(texto(0, y + 16, L('agrupados em volta do município; demais: ponto', 'clustered round the municipality; others: dot'), { tamanho: 11.5, cor: CINZA }));
    s.push(texto(0, y + 32, L('cinza cresce com o número de estabelecimentos', 'grey dot grows with the number of plants'), { tamanho: 11.5, cor: CINZA }));
    return { svg: s.join('\n'), y: y + 32 };
  };
  return () => ({
    layout: 'um',
    motivo: 'agro',
    serie: serie(1),
    titulo: () => L('Os abatedouros do SIF', 'The federal slaughterhouses'),
    subtitulo: () => L(`O frango e o porco se abatem no Sul; o boi, no Centro-Oeste e na borda da Amazônia`,
      'Chicken and pork are slaughtered in the South; cattle in the Centre-West and on the Amazon’s edge'),
    descricao: () => L(
      `Os ${nf(c.total)} estabelecimentos ativos sob o Serviço de Inspeção Federal, por município: os ${nf(c.abatedouros)} abatedouros pela espécie, as fábricas de produtos não comestíveis e o resto da cadeia de origem animal`,
      `The ${nf(c.total)} active plants under the Federal Inspection Service, by municipality: the ${nf(c.abatedouros)} slaughterhouses by species, the inedible by-products plants and the rest of the animal-products chain`),
    mapa: () => ({
      preencher: () => '#f1f2f3',
      bordaMunicipio: 0.9,
      bordaUnidadeCor: BORDA_UF,
      semRgint: false,
      bordaRgint: 1.2,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      chamadas: [{
        coord: [-52.6, -27.1], dx: 260, dy: -60,
        titulo: L(`SUL · ${c.sul_aves} DOS ${c.aves} ABATEDOUROS DE AVES`, `SOUTH · ${c.sul_aves} OF THE ${c.aves} POULTRY PLANTS`),
        linhas: L([`e ${c.sul_suinos} dos ${c.suinos} de suínos, no Paraná,`, 'em Santa Catarina e no Rio Grande do Sul'],
          [`and ${c.sul_suinos} of the ${c.suinos} pig plants, in Paraná,`, 'Santa Catarina and Rio Grande do Sul']),
      }, {
        coord: [-56.1, -15.6], dx: -200, dy: -420,
        titulo: L(`MATO GROSSO · ${c.bov_uf.MT} ABATEDOUROS DE BOVINOS`, `MATO GROSSO · ${c.bov_uf.MT} CATTLE PLANTS`),
        linhas: L([`o maior número do país; Mato Grosso do Sul`, `tem ${c.bov_uf.MS}, Pará e São Paulo, ${c.bov_uf.PA} cada`],
          ['the most in Brazil; Mato Grosso do Sul has', `${c.bov_uf.MS}, Pará and São Paulo ${c.bov_uf.PA} each`]),
      }],
    }),
    sobreMapa: (proj) => desenhar(proj),
    reservas: () => [[LEG.x - 10, LEG.y - 10, LEG.x + LEG.w + 10, LEG.y + LEG.h + 10]],
    sobreMapaPrancha: () => {
      const s = [`<rect x="${LEG.x}" y="${LEG.y}" width="${LEG.w}" height="${LEG.h}" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1.2"/>`,
        `<g transform="translate(${LEG.x + 18} ${LEG.y + 30})">`,
        rotuloPainel(L('ESTABELECIMENTOS SOB SIF, 10/2026', 'PLANTS UNDER FEDERAL INSPECTION, 10/2026'), 0)];
      s.push(itens(34, { numeros: true, direita: LEG.w - 36 }).svg, '</g>');
      return s.join('\n');
    },
    legendaFigura: () => {
      const s = [rotuloPainel(L('ESTABELECIMENTOS SOB SIF', 'PLANTS UNDER FEDERAL INSPECTION'), 0)];
      const k = itens(30);
      s.push(k.svg);
      return { svg: s.join('\n'), altura: k.y + 6, largura: 440, canto: 'sw' };
    },
    numeros: () => [
      [nf(c.total), [L('estabelecimentos ativos sob', 'active plants under federal'), L(`SIF; abate em ${nf(c.municipios_abate)} municípios`, `inspection; slaughter in ${nf(c.municipios_abate)} towns`)]],
      [nf(c.abatedouros), [L(`abatedouros: ${n('bovinos')} de bovinos,`, `slaughterhouses: ${n('bovinos')} cattle,`), L(`${n('aves')} de aves, ${n('suinos')} de suínos`, `${n('aves')} poultry, ${n('suinos')} pig`)]],
      [pc(sulAvesPct), [L('dos abatedouros de aves', 'of poultry slaughterhouses'), L(`ficam no Sul (suínos: ${pc(sulSuiPct)})`, `are in the South (pigs: ${pc(sulSuiPct)})`)]],
      [nf(n('graxaria')), [L('fábricas de produtos não', 'inedible by-products plants'), L('comestíveis: sebo, farinhas', 'turn tallow and meals from waste')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('ABATEDOUROS POR UF E ESPÉCIE', 'SLAUGHTERHOUSES BY STATE AND SPECIES'), y)];
      y += 26;
      const lista = ufs.filter((u) => u.ab > 0);
      const meio = Math.ceil(lista.length / 2);
      const colW = LP / 2;
      const wMax = colW - 30 - 40;
      const max = lista[0].ab;
      lista.forEach((u, i) => {
        const xc = i < meio ? 0 : colW + 8;
        const yy = y + (i % meio) * 19;
        let x = xc + 30;
        s.push(texto(xc, yy, u.uf, { tamanho: 12.5 }));
        for (const g of ABATE_G) {
          const w = (u[g] / max) * wMax;
          if (w > 0) s.push(`<rect x="${f1(x)}" y="${yy - 10}" width="${f1(Math.max(w - 0.6, 0.6))}" height="11" fill="${G[g].cor}"/>`);
          x += w;
        }
        s.push(texto(x + 6, yy, nf(u.ab), { tamanho: 12 }));
      });
      y += meio * 19 + 2;
      ABATE_G.slice(0, 4).forEach((g, i) => {
        const xx = (i % 2) * (LP / 2);
        const yy = y + Math.floor(i / 2) * 19;
        s.push(`<rect x="${xx}" y="${yy - 10}" width="14" height="11" fill="${G[g].cor}"/>`);
        s.push(texto(xx + 20, yy, L(...ROT_CURTO[g]), { tamanho: 12, fonte: SERIF }));
      });
      y += 38;
      s.push(`<rect x="0" y="${y - 10}" width="14" height="11" fill="${G.outra.cor}"/>`);
      s.push(texto(20, y, L(...ROT_CURTO.outra), { tamanho: 12, fonte: SERIF }));
      y += 36;
      s.push(rotuloPainel(L('ABATIDOS SOB SIF EM 2025', 'SLAUGHTERED UNDER SIF IN 2025'), y));
      y += 30;
      const ab = c.abatidos_2025;
      const linhas = [
        [mi(ab.bovinos), L('milhões de bovinos', 'million cattle'), G.bovinos.cor],
        [mi(ab.suinos), L('milhões de suínos', 'million pigs'), G.suinos.cor],
        [nf(ab.frangos / 1e9, 2), L('bilhões de frangos', 'billion chickens'), G.aves.cor],
      ];
      for (const [v, r, cor] of linhas) {
        s.push(`<rect x="0" y="${y - 16}" width="6" height="20" fill="${cor}"/>`);
        s.push(texto(16, y, v, { tamanho: 20, fonte: SERIF }));
        s.push(texto(96, y, r, { tamanho: 12.5 }));
        y += 28;
      }
      y += 4;
      const nota = L([
        'Cada abate deixa sangue, conteúdo ruminal, vísceras,',
        'penas e água de lavagem: resíduo orgânico concentrado',
        'num ponto só, o que estes mapas localizam.',
      ], [
        'Every slaughter leaves blood, rumen content, offal,',
        'feathers and washwater: organic residue concentrated',
        'at a single point, which these maps locate.',
      ]);
      nota.forEach((l) => { s.push(texto(0, y, l, { tamanho: 12.5 })); y += 18; });
      return { svg: s.join('\n'), y };
    },
    fontes: () => [SIGSIF(), MALHA()],
  });
}

/* ------------------------------------------------------------------ 2 criado aqui, abatido lá */
async function rebanho() {
  const c = await ler('rebanho');
  const E = Object.fromEntries(c.especies.map((e) => [e.chave, e]));
  const porUf = (e) => Object.fromEntries(E[e].ufs.map((u) => [u.uf, u]));
  const U = { bovinos: porUf('bovinos'), suinos: porUf('suinos'), frangos: porUf('frangos') };
  const corDe = (k) => (k < 0 ? null : c.classes[k].cor);
  const faixa = () => {
    const s = [];
    const lw = 62;
    c.classes.forEach((k, i) => s.push(`<rect x="${i * lw}" y="-12" width="${lw}" height="16" fill="${k.cor}" stroke="${BORDA_UF}" stroke-width=".8"/>`));
    const curto = L(['<0,25', '0,25–0,67', '0,67–1,5', '1,5–3', '3+'], ['<0.25', '0.25–0.67', '0.67–1.5', '1.5–3', '3+']);
    curto.forEach((t, i) => s.push(texto(i * lw + lw / 2, 22, t, { tamanho: 11, anc: 'middle' })));
    const xs = c.classes.length * lw + 20;
    s.push(HACHURA('hreb'));
    s.push(`<rect x="${xs}" y="-12" width="40" height="16" fill="url(#hreb)" stroke="${BORDA_UF}" stroke-width=".8"/>`);
    s.push(texto(xs + 20, 22, L('inibido', 'withheld'), { tamanho: 11, anc: 'middle' }));
    s.push(texto(0, -24, L('abate ÷ rebanho da UF, Brasil = 1', 'state slaughter ÷ herd, Brazil = 1'), { tamanho: 12, cor: CINZA }));
    return s.join('\n');
  };
  const mapa = (titulo, e) => ({
    titulo, pad: 64, preencher: (s) => corDe(U[e][s]?.classe ?? -1), bordaMunicipio: 1, bordaUnidadeCor: '#aab2b9', semRgint: true,
    tamanhoUnidade: 11, legenda: faixa(),
  });
  const sp = U.bovinos.SP;
  const spSif = c.sif.bovinos.find((u) => u.uf === 'SP');
  const prSif = c.sif.suinos.find((u) => u.uf === 'PR');
  const rsSif = c.sif.suinos.find((u) => u.uf === 'RS');
  const neSui = ['BA', 'CE', 'PE'].map((u) => U.suinos[u]);
  return () => ({
    layout: 'quatro',
    motivo: 'agro',
    serie: serie(2),
    titulo: () => L('Criado aqui, abatido lá', 'Raised here, slaughtered there'),
    subtitulo: () => L('São Paulo abate 2,5 vezes o que o seu rebanho de bois daria; o Nordeste cria porcos que o abate inspecionado não vê',
      'São Paulo slaughters 2.5 times what its cattle herd would supply; the Northeast raises pigs that inspected slaughter never sees'),
    descricao: () => L(
      `Cabeças abatidas em ${c.ano} em cada UF divididas pelo rebanho da UF, com o Brasil igual a 1, para bovinos, suínos e frangos; ao lado, a conferência pelos dados do SIF, que dizem de que UF veio o animal`,
      `Head slaughtered in ${c.ano} in each state divided by the state’s herd, with Brazil equal to 1, for cattle, pigs and chickens; alongside, a check against federal inspection data, which give the state each animal came from`),
    mapas: () => [
      mapa(L('BOVINOS', 'CATTLE'), 'bovinos'),
      mapa(L('SUÍNOS', 'PIGS'), 'suinos'),
      mapa(L('FRANGOS', 'CHICKENS'), 'frangos'),
    ],
    quartoQuadro: (w) => {
      // Conferência pelo SIF: abatidos sob SIF nos estabelecimentos da UF (IBGE) menos os que vieram da UF (MAPA).
      const s = [rotuloPainel(L(`O QUE ENTRA E O QUE SAI · SIF, ${c.ano}`, `WHAT COMES IN AND WHAT GOES OUT · SIF, ${c.ano}`), 0)];
      let y = 26;
      s.push(texto(0, y, L('abatidos sob SIF na UF (IBGE) − abatidos sob SIF vindos da UF', 'slaughtered under SIF in the state (IBGE) − those that came'), { tamanho: 12, cor: CINZA }));
      s.push(texto(0, y + 16, L('(MAPA), mil cabeças; os seis maiores saldos', 'from the state (MAPA), thousand head; the six largest balances'), { tamanho: 12, cor: CINZA }));
      y += 50;
      const colW = (w - 30) / 2;
      const mx = Math.max(...[...c.sif.bovinos, ...c.sif.suinos].map((u) => Math.abs(u.saldo)));
      const bloco = (lista, rot, xc) => {
        const sel = [...lista].sort((a, b) => Math.abs(b.saldo) - Math.abs(a.saldo)).slice(0, 6).sort((a, b) => b.saldo - a.saldo);
        let yy = y;
        s.push(texto(xc, yy, rot, { tamanho: 14, fonte: SERIF, extra: 'font-style="italic"' }));
        yy += 24;
        const x0 = xc + 30 + (colW - 30) / 2;
        const esc_ = ((colW - 30) / 2 - 44) / mx;
        const y0 = yy;
        for (const u of sel) {
          const ww = u.saldo * esc_;
          s.push(texto(xc, yy, u.uf, { tamanho: 12.5 }));
          s.push(`<rect x="${f1(ww < 0 ? x0 + ww : x0)}" y="${yy - 10}" width="${f1(Math.max(Math.abs(ww), 1))}" height="11" fill="${ww > 0 ? c.classes[4].cor : c.classes[0].cor}"/>`);
          s.push(texto(ww < 0 ? x0 + ww - 5 : x0 + ww + 5, yy, `${u.saldo > 0 ? '+' : '−'}${mil(Math.abs(u.saldo))}`, { tamanho: 11.5, anc: ww < 0 ? 'end' : 'start' }));
          yy += 18;
        }
        s.push(`<path d="M${f1(x0)} ${y0 - 14}V${yy - 10}" stroke="${TINTA}" stroke-width=".8"/>`);
        return yy;
      };
      const y1 = bloco(c.sif.bovinos, L('bovinos', 'cattle'), 0);
      const y2 = bloco(c.sif.suinos, L('suínos', 'pigs'), colW + 30);
      y = Math.max(y1, y2) + 12;
      s.push(`<rect x="0" y="${y - 10}" width="14" height="11" fill="${c.classes[4].cor}"/>`);
      s.push(texto(20, y, L('recebe animais de outras UFs', 'takes in animals'), { tamanho: 12.5, fonte: SERIF }));
      s.push(`<rect x="${colW + 30}" y="${y - 10}" width="14" height="11" fill="${c.classes[0].cor}"/>`);
      s.push(texto(colW + 50, y, L('manda animais para outras UFs', 'sends animals out'), { tamanho: 12.5, fonte: SERIF }));
      y += 30;
      const nota = L([
        'O abate do IBGE só conta o que passa por inspeção (federal, estadual ou',
        'municipal): um índice baixo no mapa pode ser animal vendido a outra UF',
        'ou abate sem inspeção. UFs com algum trimestre inibido ficam de fora.',
      ], [
        'IBGE slaughter counts only inspected slaughter (federal, state or',
        'municipal): a low index on the map may mean animals sold to another',
        'state or uninspected slaughter. States with a withheld quarter are left out.',
      ]);
      nota.forEach((l) => { s.push(texto(0, y, l, { tamanho: 12 })); y += 17; });
      return s.join('\n');
    },
    numeros: () => [
      [nf(sp.indice, 1), [L('é o índice dos bois em SP:', 'is the cattle index in SP:'), L(`${mi(sp.abate, 2)} mi abatidos, ${mi(sp.rebanho, 1)} mi no pasto`, `${mi(sp.abate, 2)} M killed vs ${mi(sp.rebanho, 1)} M herd`)]],
      [L(`+${mil(spSif.saldo)} mil`, `+${mil(spSif.saldo)} k`), [L('bois de outras UFs nos', 'cattle from other states in'), L(`frigoríficos SIF de SP (${pc((spSif.saldo / spSif.abatido) * 100)})`, `SP’s SIF plants (${pc((spSif.saldo / spSif.abatido) * 100)})`)]],
      [L(`+${mil(prSif.saldo)} mil`, `+${mil(prSif.saldo)} k`), [L('porcos de fora abatidos no', 'pigs from elsewhere slaughtered'), L(`Paraná; o RS mandou ${mil(-rsSif.saldo)} mil`, `in Paraná; RS sent out ${mil(-rsSif.saldo)} k`)]],
      [L('< 0,25', '< 0.25'), [L('é o índice dos porcos na', 'is the pig index in'), L(`BA, no CE e em PE (PE: ${nf(neSui[2].indice, 2)})`, `BA, CE and PE (PE: ${nf(neSui[2].indice, 2)})`)]],
    ],
    painel: (y) => {
      // Para cada espécie: as UFs que mais abatem, com a parte do abate e a parte do rebanho do país.
      const s = [];
      for (const e of c.especies) {
        s.push(rotuloPainel(L(`${e.rotulo.toUpperCase()} · % DO PAÍS, ${c.ano}`, `${e.rotulo_en.toUpperCase()} · % OF BRAZIL, ${c.ano}`), y));
        y += 24;
        const lista = e.ufs.filter((u) => u.abate != null).sort((a, b) => b.abate - a.abate).slice(0, 4);
        const xb = 40;
        const wb = LP - xb - 110;
        const max = Math.max(...lista.map((u) => Math.max(u.abate / e.br_abate, u.rebanho / e.br_rebanho)));
        for (const u of lista) {
          const pa = u.abate / e.br_abate;
          const pr = u.rebanho / e.br_rebanho;
          s.push(texto(0, y, u.uf, { tamanho: 12.5 }));
          s.push(`<rect x="${xb}" y="${y - 11}" width="${f1((pa / max) * wb)}" height="7" fill="${c.classes[4].cor}"/>`);
          s.push(`<rect x="${xb}" y="${y - 3}" width="${f1((pr / max) * wb)}" height="5" fill="${c.classes[0].cor}"/>`);
          s.push(texto(LP, y, `${nf(pa * 100, 1)} · ${nf(pr * 100, 1)}`, { tamanho: 11.5, anc: 'end', cor: CINZA }));
          y += 17;
        }
        y += 4;
        s.push(texto(0, y, L(`Brasil: ${e.chave === 'frangos' ? nf(e.br_abate / 1e9, 2) + ' bi' : mi(e.br_abate) + ' mi'} abatidos; ${nf(e.taxa, 2)} por cabeça do rebanho`,
          `Brazil: ${e.chave === 'frangos' ? nf(e.br_abate / 1e9, 2) + ' bn' : mi(e.br_abate) + ' M'} slaughtered; ${nf(e.taxa, 2)} per head of herd`), { tamanho: 11.5, cor: CINZA }));
        y += 30;
      }
      s.push(`<rect x="0" y="${y - 12}" width="22" height="7" fill="${c.classes[4].cor}"/>`);
      s.push(texto(28, y - 5, L('% do abate', '% of slaughter'), { tamanho: 11.5, cor: CINZA }));
      s.push(`<rect x="160" y="${y - 10}" width="22" height="5" fill="${c.classes[0].cor}"/>`);
      s.push(texto(188, y - 5, L('% do rebanho (frangos: sem as poedeiras)', '% of herd (chickens: excluding layers)'), { tamanho: 11.5, cor: CINZA }));
      y += 6;
      return { svg: s.join('\n'), y };
    },
    fontes: () => [ABATE(), PPM(), SIGSIF(), MALHA()],
  });
}

/* ------------------------------------------------------------------ 3 o ano das vacas */
async function ciclo() {
  const c = await ler('ciclo');
  const corDe = (k) => (k < 0 ? null : c.classes[k].cor);
  const raio = (v) => 3 + 0.0115 * Math.sqrt(v);
  const pontos = c.pontos.map(([, lon, lat, v]) => ({ coord: [lon, lat], r: raio(v), cor: TINTA, anel: true, largura: 1.6 }));
  const br = c.brasil;
  const b25 = br.find((a) => a.ano === c.ano);
  const b21 = br.find((a) => a.ano === '2021');
  const recordeAnt = br.filter((a) => a.ano < c.ano).reduce((m, a) => (a.pct > m.pct ? a : m));
  const reb = c.rebanho;
  const anoPicoReb = Object.keys(reb).reduce((m, a) => (reb[a] > reb[m] ? a : m));
  const pa = c.ufs.PA;
  const sp = c.ufs.SP;
  const LEG = { x: 40, y: 1250, w: 430, h: 320 };
  const faixa = (y, { tamanho = 15 } = {}) => {
    const s = [HACHURA('hfem')];
    [...c.classes].reverse().forEach((k, i) => {
      s.push(`<rect x="0" y="${y + i * 24 - 13}" width="34" height="17" fill="${k.cor}" stroke="${BORDA_UF}" stroke-width=".8"/>`);
      s.push(texto(48, y + i * 24, L(k.rotulo, k.rotulo_en), { tamanho, fonte: SERIF }));
    });
    const yy = y + c.classes.length * 24;
    s.push(`<rect x="0" y="${yy - 13}" width="34" height="17" fill="url(#hfem)" stroke="${BORDA_UF}" stroke-width=".8"/>`);
    s.push(texto(48, yy, L('dado inibido pelo IBGE', 'withheld by IBGE'), { tamanho, fonte: SERIF }));
    return { svg: s.join('\n'), y: yy + 30 };
  };
  const circulos = (y) => legendaCirculos([7e6, 3e6, 1e6], raio, (v) => L(`${mi(v, 0)} mi de cabeças`, `${mi(v, 0)} M head`), { y, cor: TINTA, tamanho: 13 });
  return () => ({
    layout: 'um',
    motivo: 'agro',
    serie: serie(3),
    titulo: () => L('O ano das vacas', 'The year of the cows'),
    subtitulo: () => L(`Em ${c.ano}, ${pc(b25.pct)} dos bovinos abatidos eram fêmeas, o máximo da série iniciada em 1997, e o rebanho encolheu`,
      `In ${c.ano}, ${pc(b25.pct)} of the cattle slaughtered were female, the highest in a series begun in 1997, and the herd shrank`),
    descricao: () => L(
      `Vacas e novilhas como parte dos bovinos abatidos sob inspeção em cada UF em ${c.ano} (cor) e o total de cabeças abatidas (anel); ao lado, a série do país desde 1997`,
      `Cows and heifers as a share of the cattle slaughtered under inspection in each state in ${c.ano} (colour) and total head slaughtered (ring); alongside, the national series since 1997`),
    mapa: () => ({
      preencher: (s) => corDe(c.ufs[s]?.classe ?? -1),
      bordaMunicipio: 1,
      bordaUnidadeCor: '#aab2b9',
      semRgint: true,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      pontos,
      chamadas: [{
        coord: [-52.5, -4.6], dx: 300, dy: -230,
        titulo: L(`PARÁ · ${pc(pa.pct)} DE FÊMEAS`, `PARÁ · ${pc(pa.pct)} FEMALE`),
        linhas: L([`eram ${pc(pa.pct21)} em 2021; ${mi(pa.total, 2)} mi de`, `cabeças abatidas em ${c.ano}`],
          [`${pc(pa.pct21)} in 2021; ${mi(pa.total, 2)} M head`, `slaughtered in ${c.ano}`]),
      }, {
        coord: [-48.6, -22.3], dx: 260, dy: 160,
        titulo: L(`SÃO PAULO · ${pc(sp.pct)}`, `SÃO PAULO · ${pc(sp.pct)}`),
        linhas: L(['os frigoríficos paulistas abatem', 'sobretudo bois e novilhos'], ['São Paulo’s plants slaughter', 'mostly steers and bullocks']),
      }],
    }),
    reservas: () => [[LEG.x - 10, LEG.y - 10, LEG.x + LEG.w + 10, LEG.y + LEG.h + 10]],
    sobreMapaPrancha: () => {
      const s = [`<rect x="${LEG.x}" y="${LEG.y}" width="${LEG.w}" height="${LEG.h}" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1.2"/>`,
        `<g transform="translate(${LEG.x + 18} ${LEG.y + 30})">`,
        rotuloPainel(L(`VACAS E NOVILHAS, % DO ABATE, ${c.ano}`, `COWS AND HEIFERS, % OF SLAUGHTER, ${c.ano}`), 0)];
      const f = faixa(32);
      s.push(f.svg);
      s.push(texto(0, f.y, L('anel: bovinos abatidos na UF', 'ring: cattle slaughtered in the state'), { tamanho: 12, cor: CINZA }));
      s.push(circulos(f.y + 14).svg, '</g>');
      return s.join('\n');
    },
    legendaFigura: () => {
      const s = [rotuloPainel(L(`VACAS E NOVILHAS, % DO ABATE, ${c.ano}`, `COWS AND HEIFERS, % OF SLAUGHTER, ${c.ano}`), 0)];
      const f = faixa(30);
      s.push(f.svg);
      s.push(texto(0, f.y, L('anel: bovinos abatidos na UF', 'ring: cattle slaughtered in the state'), { tamanho: 12.5, cor: CINZA }));
      const lc = circulos(f.y + 14);
      s.push(lc.svg);
      return { svg: s.join('\n'), altura: f.y + 14 + lc.altura, largura: 400, canto: 'sw' };
    },
    numeros: () => [
      [pc(b25.pct, 1), [L(`dos bovinos abatidos em ${c.ano}`, `of cattle slaughtered in ${c.ano}`), L(`eram fêmeas (${pc(b21.pct, 1)} em 2021)`, `were female (${pc(b21.pct, 1)} in 2021)`)]],
      [L(`${mi(b25.total, 1)} mi`, `${mi(b25.total, 1)} M`), [L('de bovinos abatidos em', 'cattle slaughtered in'), L(`${c.ano}, +${pc((b25.total / b21.total - 1) * 100)} sobre 2021`, `${c.ano}, +${pc((b25.total / b21.total - 1) * 100)} on 2021`)]],
      [`−${pc((1 - reb[c.ano] / reb[anoPicoReb]) * 100, 1)}`, [L(`no rebanho bovino desde ${anoPicoReb}`, `in the cattle herd since ${anoPicoReb}`), L(`(${mi(reb[anoPicoReb], 1)} → ${mi(reb[c.ano], 1)} mi)`, `(${mi(reb[anoPicoReb], 1)} → ${mi(reb[c.ano], 1)} M)`)]],
      [pc(c.h1_2026.pct, 1), [L('de fêmeas no 1º semestre', 'female in the first half'), L(`de 2026 (${pc(c.h1_2025.pct, 1)} em 2025)`, `of 2026 (${pc(c.h1_2025.pct, 1)} in 2025)`)]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('FÊMEAS NO ABATE DE BOVINOS, BRASIL', 'FEMALES IN CATTLE SLAUGHTER, BRAZIL'), y)];
      y += 20;
      const h = 120;
      const x0 = 40;
      const wx = LP - x0 - 46;
      const X = (i) => x0 + (i * wx) / (br.length - 1);
      const maxT = 45e6;
      const Yp = (v) => y + h - ((v - 25) / 25) * h; // 25–50 %
      // Barras: total abatido (escala à direita); linha: % de fêmeas.
      br.forEach((a, i) => {
        const bh = (a.total / maxT) * h;
        s.push(`<rect x="${f1(X(i) - 4.5)}" y="${f1(y + h - bh)}" width="9" height="${f1(bh)}" fill="#dfe2e5"/>`);
      });
      for (const v of [30, 40, 50]) {
        s.push(`<path d="M${x0 - 6} ${f1(Yp(v))}H${x0 + wx + 6}" stroke="#c9ced3" stroke-width=".7" stroke-dasharray="3 3"/>`);
        s.push(texto(x0 - 10, Yp(v) + 4, `${v} %`, { tamanho: 11, cor: CINZA, anc: 'end' }));
      }
      for (const v of [20e6, 40e6]) s.push(texto(LP, y + h - (v / maxT) * h + 4, L(`${mi(v, 0)} mi`, `${mi(v, 0)} M`), { tamanho: 11, cor: CINZA, anc: 'end' }));
      s.push(`<path d="${br.map((a, i) => `${i ? 'L' : 'M'}${f1(X(i))} ${f1(Yp(a.pct))}`).join('')}" fill="none" stroke="${c.classes[3].cor}" stroke-width="2.4" stroke-linejoin="round"/>`);
      br.forEach((a, i) => {
        if (['1997', '2001', '2005', '2009', '2013', '2017', '2021', '2025'].includes(a.ano)) s.push(texto(X(i), y + h + 16, `’${a.ano.slice(2)}`, { tamanho: 11, cor: CINZA, anc: 'middle' }));
      });
      const i25 = br.length - 1;
      const iRec = br.indexOf(recordeAnt);
      const i21 = br.findIndex((a) => a.ano === '2021');
      s.push(`<circle cx="${f1(X(i25))}" cy="${f1(Yp(b25.pct))}" r="3.4" fill="${c.classes[3].cor}"/>`);
      s.push(texto(X(i25) - 6, Yp(b25.pct) - 9, pc(b25.pct, 1), { tamanho: 12, anc: 'end' }));
      s.push(texto(X(iRec), Yp(recordeAnt.pct) - 9, `${pc(recordeAnt.pct, 1)} (${recordeAnt.ano})`, { tamanho: 11.5, anc: 'middle' }));
      s.push(texto(X(i21), Yp(b21.pct) + 18, pc(b21.pct, 1), { tamanho: 11.5, anc: 'middle' }));
      y += h + 30;
      s.push(`<rect x="0" y="${y - 9}" width="14" height="10" fill="#dfe2e5"/>`);
      s.push(texto(20, y, L('bovinos abatidos (escala à direita)', 'cattle slaughtered (right-hand scale)'), { tamanho: 11.5, cor: CINZA }));
      y += 17;
      s.push(`<path d="M0 ${y - 4}h14" stroke="${c.classes[3].cor}" stroke-width="2.4"/>`);
      s.push(texto(20, y, L('% de vacas e novilhas', '% cows and heifers'), { tamanho: 11.5, cor: CINZA }));
      y += 36;
      // Três espécies, índice 2015 = 100.
      s.push(rotuloPainel(L('ABATE POR ESPÉCIE, 2015 = 100', 'SLAUGHTER BY SPECIES, 2015 = 100'), y));
      y += 18;
      const h2 = 96;
      const anos = Object.keys(c.especies.bovinos).filter((a) => a <= c.ano);
      const X2 = (i) => x0 + (i * (wx - 60)) / (anos.length - 1);
      const Y2 = (v) => y + h2 - ((v - 80) / 70) * h2; // 80–150
      for (const v of [100, 125, 150]) {
        s.push(`<path d="M${x0 - 6} ${f1(Y2(v))}H${x0 + wx - 54}" stroke="#c9ced3" stroke-width=".7" stroke-dasharray="3 3"/>`);
        s.push(texto(x0 - 10, Y2(v) + 4, `${v}`, { tamanho: 11, cor: CINZA, anc: 'end' }));
      }
      const cores = { bovinos: c.classes[3].cor, suinos: '#c46f86', frangos: '#c99a2e' };
      const nomes = { bovinos: L('bovinos', 'cattle'), suinos: L('suínos', 'pigs'), frangos: L('frangos', 'chickens') };
      const fim = [];
      for (const [e, serie_] of Object.entries(c.especies)) {
        const v = anos.map((a) => (serie_[a] / serie_['2015']) * 100);
        s.push(`<path d="${v.map((q, i) => `${i ? 'L' : 'M'}${f1(X2(i))} ${f1(Y2(q))}`).join('')}" fill="none" stroke="${cores[e]}" stroke-width="2.2" stroke-linejoin="round"/>`);
        fim.push([e, v.at(-1)]);
      }
      // Rótulos no fim das linhas, afastados para não se tocarem.
      fim.sort((a, b) => b[1] - a[1]);
      let yAnt = -Infinity;
      for (const [e, v] of fim) {
        let yy = Y2(v) + 4;
        if (yy - yAnt < 15) yy = yAnt + 15;
        yAnt = yy;
        s.push(texto(X2(anos.length - 1) + 8, yy, `${nomes[e]} ${nf(v)}`, { tamanho: 11.5, cor: cores[e] === c.classes[3].cor ? TINTA : TINTA }));
        s.push(`<circle cx="${f1(X2(anos.length - 1))}" cy="${f1(Y2(v))}" r="3" fill="${cores[e]}"/>`);
      }
      anos.forEach((a, i) => { if (i % 2 === 0) s.push(texto(X2(i), y + h2 + 16, `’${a.slice(2)}`, { tamanho: 11, cor: CINZA, anc: 'middle' })); });
      y += h2 + 40;
      const nota = L([
        'Quando o bezerro vale pouco, o criador vende a vaca, o abate',
        'cresce e o rebanho encolhe; anos depois, ele segura as',
        'fêmeas e o abate cai. Frango e porco não têm esse ciclo.',
      ], [
        'When calves are cheap, ranchers sell cows: slaughter rises',
        'and the herd shrinks; years later they hold back females',
        'and slaughter falls. Chickens and pigs have no such cycle.',
      ]);
      nota.forEach((l) => { s.push(texto(0, y, l, { tamanho: 12.5 })); y += 18; });
      return { svg: s.join('\n'), y };
    },
    fontes: () => [ABATE(), PPM(), MALHA()],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { sif, rebanho, ciclo };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/abate-br/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
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
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `abate-br-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
