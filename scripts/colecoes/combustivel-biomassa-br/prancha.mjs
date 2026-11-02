#!/usr/bin/env node
/**
 * Coleção «O que mais a usina queima» (Brasil) — desenha uma prancha a partir do cache de preparar.py (uso interno).
 *
 *   node scripts/colecoes/combustivel-biomassa-br/prancha.mjs licor|combustiveis|chegada
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  RAIZ, LP, SERIF, MONO, CINZA, PAPEL, TINTA, esc, nf, f1, lingua, halo, largura,
  gerarPrancha, rotuloPainel, usarBrasil,
} from '../lib/prancha-sp.mjs';
import { legendaCirculos } from '../lib/arte.mjs';

export const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'combustivel-biomassa-br', 'serie.json'), 'utf8'));
const TOTAL = 3; // pranchas da coleção
const BORDA_UF = '#c9ced3';
const FUNDO = '#f1f2f3';

const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `combustivel-biomassa-br-${nome}.json`), 'utf8'));
const br = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', 'brasil-base.json'), 'utf8'));
const L = (pt, en) => (lingua() === 'en' ? en : pt);
const serie = (i) => () => L(`O QUE MAIS A USINA QUEIMA · ${i}/${TOTAL}`, `WHAT ELSE THE PLANT BURNS · ${i}/${TOTAL}`);
const mw = (kw, casas = 0) => nf(kw / 1000, casas);
const gw = (kw, casas = 2) => nf(kw / 1e6, casas);
const pc = (v, casas = 0) => `${nf(v, casas)} %`;
const dataRef = (r) => `${r.slice(8, 10)}/${r.slice(5, 7)}/${r.slice(0, 4)}`;
const SIGA = (r) => () => L(`ANEEL, SIGA (dados abertos, ${dataRef(r)})`, `ANEEL, SIGA (open data, ${dataRef(r)})`);
const PEVS = () => L('IBGE, PEVS 2025 (silvicultura)', 'IBGE, PEVS 2025 (forestry)');
const MALHA = () => L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025');
const texto = (x, y, t, { tamanho = 12.5, cor = TINTA, anc = 'start', fonte = MONO, extra = '' } = {}) =>
  `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anc}" font-family="${fonte}" font-size="${tamanho}" fill="${cor}" ${extra}>${esc(t)}</text>`;
const bola = (cor, cx, cy, r = 8, { vazado = false } = {}) => (vazado
  ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${PAPEL}" stroke="${cor}" stroke-width="2"/>`
  : `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${cor}" fill-opacity=".88" stroke="${PAPEL}" stroke-width=".7"/>`);
const caixa = (cor, rot, y, { passo = 25, x = 0, tamanho = 16 } = {}) => `<rect x="${x}" y="${y}" width="34" height="${passo - 8}" fill="${cor}" stroke="${BORDA_UF}" stroke-width=".8"/>
<text x="${x + 48}" y="${y + passo - 12}" font-family="${SERIF}" font-size="${tamanho}">${esc(rot)}</text>`;
const curto = (n) => n.replace(/\s*\(Antiga [^)]*\)/, '').replace('Central Geradora ', '');

/* ------------------------------------------------------------------ 1 o licor da celulose */
async function licor() {
  const c = await ler('licor');
  const COR = '#6b3d5c';
  const raio = (kw) => 2 + 0.036 * Math.sqrt(kw);
  const op = c.fabricas.filter((f) => f.fase === 'Operação');
  const tl = c.municipios_top[0];
  const tlCoord = op.find((f) => f.municipio === 'Três Lagoas').coord;
  const ort = c.municipios_top.find((m) => m.municipio.startsWith('Ortigueira'));
  const ortCoord = op.find((f) => f.municipio === 'Ortigueira').coord;
  const obra = c.fabricas.find((f) => f.fase !== 'Operação');
  const suzano = c.donos[0];
  const ms = c.ufs.find((u) => u.uf === 'MS');
  const pontos = c.fabricas.map((f) => ({ coord: f.coord, r: raio(f.kw), cor: COR, vazado: f.fase !== 'Operação', opacidade: 0.85, bordaLargura: 1.2 }));
  const LEG = { x: 40, y: 1226, w: 430, h: 340 };
  const classes = (y, tamanho = 15, passo = 23) => {
    const s = [];
    for (const k of c.classes) { s.push(caixa(k.cor, L(k.rotulo, k.rotulo_en), y, { passo, tamanho })); y += passo; }
    s.push(caixa(c.sem_polpa, L('sem madeira para celulose', 'no pulpwood'), y, { passo, tamanho }));
    y += passo;
    s.push(caixa(c.sem_dado, L('sem dado na PEVS', 'no data in PEVS'), y, { passo, tamanho }));
    return { svg: s.join('\n'), y: y + passo };
  };
  const circulos = (y) => legendaCirculos([400000, 200000, 50000], raio, (v) => `${nf(v / 1000)} MW`, { y, cor: COR, tamanho: 14 });
  const emObra = (y) => `${bola(COR, 12, y - 5, 8, { vazado: true })}${texto(32, y, L('em obra', 'under construction'), { tamanho: 15, fonte: SERIF })}`;
  const legenda = (y0, { tamanho = 15 } = {}) => {
    const s = [rotuloPainel(L('MADEIRA PARA CELULOSE, 2025', 'PULPWOOD HARVESTED, 2025'), y0)];
    const k = classes(y0 + 14, tamanho);
    s.push(k.svg);
    let y = k.y + 30;
    s.push(rotuloPainel(L('USINAS A LICOR NEGRO', 'BLACK-LIQUOR PLANTS'), y));
    const lc = circulos(y + 16);
    s.push(lc.svg);
    y += 16 + lc.altura + 26;
    s.push(emObra(y));
    return { svg: s.join('\n'), y: y + 8 };
  };
  return () => ({
    layout: 'um',
    motivo: 'agro',
    serie: serie(1),
    titulo: () => L('O licor da celulose', 'The pulp mills’ liquor'),
    subtitulo: () => L(`${c.n_op} fábricas de celulose têm dois terços da eletricidade de biomassa que não é cana`,
      `${c.n_op} pulp mills hold two-thirds of Brazil’s non-cane biomass power`),
    descricao: () => L(
      `Usinas que queimam o licor negro, a sobra do cozimento da madeira nas fábricas de celulose, pela potência outorgada (SIGA, ${dataRef(c.referencia)}), sobre a madeira em tora colhida para papel e celulose em cada município em 2025`,
      `Plants burning black liquor, the residue of cooking wood in pulp mills, by licensed capacity (SIGA, ${dataRef(c.referencia)}), over the roundwood harvested for pulp and paper in each municipality in 2025`),
    mapa: () => ({
      preencher: () => FUNDO,
      bordaMunicipio: 0.9,
      bordaUnidadeCor: BORDA_UF,
      semRgint: true,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      camadas: [
        { feats: c.municipios.features, cor: (f) => f.properties.cor, borda: 'none', largura: 0 },
        { feats: br.ufs.features, cor: 'none', borda: '#6d747a', largura: 0.9 },
      ],
      pontos,
      chamadas: [{
        coord: tlCoord, dx: -330, dy: -170,
        titulo: L(`TRÊS LAGOAS (MS) · ${mw(tl.kw)} MW`, `TRÊS LAGOAS (MS) · ${mw(tl.kw)} MW`),
        linhas: L([`${tl.n} fábricas; nenhum município do país`, 'tem mais potência a biomassa'],
          [`${tl.n} mills; no municipality in Brazil`, 'has more biomass capacity']),
      }, {
        coord: ortCoord, dx: 330, dy: 120,
        titulo: L(`ORTIGUEIRA (PR) · ${mw(ort.kw)} MW`, `ORTIGUEIRA (PR) · ${mw(ort.kw)} MW`),
        linhas: L(['Klabin: Puma (2016) e Puma II (2022),', 'ao lado de Telêmaco Borba (1961)'],
          ['Klabin: Puma (2016) and Puma II (2022),', 'next to Telêmaco Borba (1961)']),
      }],
    }),
    reservas: () => [[LEG.x - 10, LEG.y - 10, LEG.x + LEG.w + 10, LEG.y + LEG.h + 10]],
    sobreMapaPrancha: () => {
      const l = legenda(0);
      return `<rect x="${LEG.x}" y="${LEG.y}" width="${LEG.w}" height="${LEG.h}" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1.2"/>
<g transform="translate(${LEG.x + 18} ${LEG.y + 32})">${l.svg}</g>`;
    },
    legendaFigura: () => {
      const l = legenda(0);
      return { svg: l.svg, altura: l.y, largura: 330, canto: 'sw' };
    },
    numeros: () => [
      [`${gw(c.kw_op)} GW`, [L(`em ${c.n_op} usinas a licor negro:`, `in ${c.n_op} black-liquor plants:`), L(`${pc((c.kw_op / c.kw_nao_cana_op) * 100)} da biomassa sem cana`, `${pc((c.kw_op / c.kw_nao_cana_op) * 100)} of non-cane biomass`)]],
      [pc((suzano.kw / c.kw_op) * 100), [L(`é da Suzano, em ${suzano.n} fábricas`, `belongs to Suzano, in ${suzano.n} mills`), L(`(${gw(suzano.kw)} GW)`, `(${gw(suzano.kw)} GW)`)]],
      [pc((c.perto_m3 / c.celulose_2025) * 100), [L(`da madeira para celulose`, `of pulpwood is cut`), L(`sai a até ${c.raio_km} km de uma delas`, `within ${c.raio_km} km of one of them`)]],
      [`${gw(ms.kw)} GW`, [L('em Mato Grosso do Sul,', 'in Mato Grosso do Sul,'), L(`mais ${mw(obra.kw)} MW em obra`, `plus ${mw(obra.kw)} MW being built`)]],
    ],
    painel: (y) => {
      // Potência a licor negro e madeira para celulose por UF, lado a lado.
      const s = [rotuloPainel(L('POTÊNCIA E MADEIRA, POR UF', 'POWER AND WOOD, BY STATE'), y)];
      y += 22;
      const x1 = 40;
      const w1 = 230;
      const x2 = x1 + w1 + 34;
      const w2 = LP - x2 - 54;
      const maxK = Math.max(...c.ufs.map((u) => u.kw));
      const maxM = Math.max(...c.ufs.map((u) => u.m3));
      s.push(texto(x1, y, L('licor negro, MW', 'black liquor, MW'), { tamanho: 11.5, cor: CINZA }));
      s.push(texto(x2, y, L('madeira p/ celulose, mi m³', 'pulpwood, M m³'), { tamanho: 11.5, cor: CINZA }));
      y += 20;
      for (const u of c.ufs) {
        const wk = (u.kw / maxK) * (w1 - 44);
        const wm = (u.m3 / maxM) * w2;
        s.push(texto(0, y, u.uf, { tamanho: 12.5 }));
        s.push(`<rect x="${x1}" y="${y - 10}" width="${f1(Math.max(wk, 1))}" height="11" fill="${COR}"/>`);
        s.push(texto(x1 + wk + 6, y, mw(u.kw), { tamanho: 12 }));
        s.push(`<rect x="${x2}" y="${y - 10}" width="${f1(Math.max(wm, 1))}" height="11" fill="${c.classes[3].cor}"/>`);
        s.push(texto(x2 + wm + 6, y, nf(u.m3 / 1e6, 1), { tamanho: 12 }));
        y += 19;
      }
      y += 4;
      s.push(texto(0, y, L(`Em todo o país, ${nf(c.celulose_2025 / 1e6, 0)} mi m³ em 2025 (${nf(c.celulose_2015 / 1e6, 0)} mi em 2015).`, `Brazil-wide, ${nf(c.celulose_2025 / 1e6, 0)} M m³ in 2025 (${nf(c.celulose_2015 / 1e6, 0)} M in 2015).`), { tamanho: 11.5, cor: CINZA }));
      y += 36;
      // Donos.
      s.push(rotuloPainel(L('DE QUEM É A POTÊNCIA A LICOR NEGRO', 'WHO OWNS THE BLACK-LIQUOR POWER'), y));
      y += 18;
      let x = 0;
      const tons = ['#6b3d5c', '#8a5a7b', '#a87d99', '#c4a3b8', '#dcc7d4', '#ece3e8'];
      const top = c.donos.slice(0, 5);
      const resto = c.kw_op - top.reduce((a, d) => a + d.kw, 0);
      const partes = [...top.map((d) => [d.dono, d.kw, d.n]), [L('outras', 'others'), resto, c.n_op - top.reduce((a, d) => a + d.n, 0)]];
      partes.forEach(([, kw], i) => {
        const w = (kw / c.kw_op) * LP;
        s.push(`<rect x="${f1(x)}" y="${y}" width="${f1(w - 1)}" height="20" fill="${tons[i]}"/>`);
        x += w;
      });
      y += 44;
      const nomes = { 'SUZANO S.A.': 'Suzano', 'KLABIN S.A.': 'Klabin', 'BRACELL SP CELULOSE LTDA': 'Bracell', 'CMPC CELULOSE RIOGRANDENSE LTDA': 'CMPC', 'Eldorado Brasil Celulose S.A': 'Eldorado' };
      partes.forEach(([d, kw, n], i) => {
        const xx = (i % 2) * (LP / 2 + 8);
        const yy = y + Math.floor(i / 2) * 22;
        s.push(`<rect x="${xx}" y="${yy - 11}" width="14" height="12" fill="${tons[i]}"/>`);
        s.push(texto(xx + 22, yy, nomes[d] ?? d, { tamanho: 14, fonte: SERIF }));
        s.push(texto(xx + LP / 2 - 16, yy, `${mw(kw)} MW · ${n}`, { tamanho: 12, anc: 'end' }));
      });
      y += 3 * 22 - 4;
      s.push(texto(0, y, L('MW em operação · número de fábricas', 'MW in operation · number of mills'), { tamanho: 11.5, cor: CINZA }));
      return { svg: s.join('\n'), y: y + 8 };
    },
    fontes: () => [SIGA(c.referencia)(), PEVS(), MALHA()],
  });
}

/* ------------------------------------------------------------------ 2 um mapa por combustível */
async function combustiveis() {
  const c = await ler('combustiveis');
  const G = Object.fromEntries(c.grupos.map((g) => [g.chave, g]));
  const raio = (kw) => 2 + 0.06 * Math.sqrt(kw);
  const fam = (k) => c.familias.find((f) => f.chave === k);
  const madeira = fam('madeira');
  const pontosDe = (familia) => c.pontos.filter(([g]) => G[g].familia === familia)
    .map(([g, lon, lat, kw, op]) => ({ coord: [lon, lat], r: raio(kw), cor: G[g].cor, vazado: !op, opacidade: 0.85, bordaLargura: 0.8 }));
  const coordMaior = (k) => G[k].maior.coord;
  const legendaFam = (familia) => {
    const gs = c.grupos.filter((g) => g.familia === familia);
    const s = [];
    gs.forEach((g, i) => {
      const x = (i % 2) * 360;
      const y = -14 + Math.floor(i / 2) * 24;
      s.push(bola(g.cor, x + 8, y - 5, 7));
      s.push(texto(x + 22, y, L(g.rotulo, g.rotulo_en), { tamanho: 14, fonte: SERIF }));
    });
    return s.join('\n');
  };
  const mapa = (familia, chamadas) => {
    const f = fam(familia);
    return {
      titulo: `${L(f.titulo, f.titulo_en)} · ${mw(f.kw_op)} MW`,
      pad: 64, preencher: () => FUNDO, bordaMunicipio: 1, bordaUnidadeCor: '#aab2b9', semRgint: true, tamanhoUnidade: 11,
      pontos: pontosDe(familia), legenda: legendaFam(familia), chamadas,
    };
  };
  const ch = (coord, dx, dy, titulo, linhas) => ({ coord, dx, dy, titulo, linhas, tamanho: 15 });
  const inpasaCoord = c.pontos.length && G.lenha.maior.coord;
  const rsArroz = coordMaior('arroz');
  const aterro = G.aterro.maior;
  return () => ({
    layout: 'quatro',
    motivo: 'agro',
    serie: serie(2),
    titulo: () => L('Um mapa por combustível', 'One map per fuel'),
    subtitulo: () => L('Fora da cana e da celulose, quase oito em cada dez megawatts ainda queimam madeira',
      'Beyond cane and pulp, nearly eight megawatts in ten still burn wood'),
    descricao: () => L(
      `As ${nf(c.n_op)} usinas a biomassa em operação que não queimam bagaço de cana nem licor negro, em três famílias de combustível, pela potência outorgada (SIGA, ${dataRef(c.referencia)}); anel: em obra ou a construir`,
      `The ${nf(c.n_op)} operating biomass plants that burn neither cane bagasse nor black liquor, in three fuel families, by licensed capacity (SIGA, ${dataRef(c.referencia)}); ring: being or to be built`),
    mapas: () => [
      mapa('madeira', [ch(inpasaCoord, -60, -200, L(`INPASA · ${mw(c.inpasa.kw)} MW`, `INPASA · ${mw(c.inpasa.kw)} MW`),
        L([`${c.inpasa.n} usinas de etanol de milho`, 'que queimam lenha e cavaco'], [`${c.inpasa.n} corn-ethanol plants`, 'burning firewood and chips']))]),
      mapa('lavoura', [
        ch(rsArroz, 130, -70, L(`RS · ${c.arroz_rs.n} USINAS, ${mw(c.arroz_rs.kw)} MW`, `RS · ${c.arroz_rs.n} PLANTS, ${mw(c.arroz_rs.kw)} MW`),
          L([`de casca de arroz: ${pc((c.arroz_rs.kw / G.arroz.kw_op) * 100)}`, 'da potência do país'], [`on rice husk: ${pc((c.arroz_rs.kw / G.arroz.kw_op) * 100)}`, 'of Brazil’s capacity'])),
        ch(G.capim.maior.coord, 170, -40, L(`RORAIMA · ${mw(c.roraima.kw)} MW`, `RORAIMA · ${mw(c.roraima.kw)} MW`),
          L([`capim, palma e cavaco: ${c.roraima.n_2022} das`, `${c.roraima.n} usinas são de 2022 e 2023`], [`grass, palm and chips: ${c.roraima.n_2022} of the`, `${c.roraima.n} plants date from 2022–23`])),
      ]),
      mapa('lixo', [ch(aterro.coord, 110, 80, `${aterro.municipio.toUpperCase()} (${aterro.uf}) · ${mw(aterro.kw)} MW`,
        L(['o maior aterro que gera luz;', `${G.aterro.n_op} usinas a biogás de lixo`], ['the largest landfill power plant;', `${G.aterro.n_op} landfill-biogas plants`]))]),
    ],
    quartoQuadro: (w) => {
      const s = [rotuloPainel(L('MW EM OPERAÇÃO, UM COMBUSTÍVEL POR LINHA', 'MW IN OPERATION, ONE FUEL PER ROW'), 0)];
      let y = 30;
      const xb = 300;
      const wb = w - xb - 120;
      const max = Math.max(...c.grupos.map((g) => g.kw_op));
      for (const g of c.grupos) {
        const ww = (g.kw_op / max) * wb;
        s.push(bola(g.cor, 8, y - 5, 7));
        s.push(texto(22, y, L(g.rotulo, g.rotulo_en), { tamanho: 14, fonte: SERIF }));
        s.push(`<rect x="${xb}" y="${y - 12}" width="${f1(Math.max(ww, 1))}" height="14" fill="${g.cor}"/>`);
        s.push(texto(xb + ww + 8, y, mw(g.kw_op, g.kw_op < 10000 ? 1 : 0), { tamanho: 13 }));
        s.push(texto(w, y, nf(g.n_op), { tamanho: 13, cor: CINZA, anc: 'end' }));
        y += 26;
      }
      s.push(texto(w, y, L('usinas', 'plants'), { tamanho: 11, cor: CINZA, anc: 'end' }));
      y += 30;
      s.push(rotuloPainel(L('POTÊNCIA OUTORGADA', 'LICENSED CAPACITY'), y));
      const lc = legendaCirculos([100000, 30000, 5000], raio, (v) => `${nf(v / 1000)} MW`, { y: y + 16, cor: CINZA, tamanho: 13 });
      s.push(lc.svg);
      s.push(bola(CINZA, 330, y + 40, 8, { vazado: true }));
      s.push(texto(348, y + 45, L(`em obra ou a construir (${c.n_obra})`, `being or to be built (${c.n_obra})`), { tamanho: 14, fonte: SERIF }));
      return s.join('\n');
    },
    numeros: () => [
      [`${gw(c.kw_op)} GW`, [L(`em ${nf(c.n_op)} usinas sem cana`, `in ${nf(c.n_op)} plants with no cane`), L('nem licor negro', 'or black liquor')]],
      [pc((madeira.kw_op / c.kw_op) * 100), [L('queima madeira: cavaco,', 'burns wood: chips,'), L('lenha ou carvão vegetal', 'firewood or charcoal')]],
      [pc((c.arroz_rs.kw / G.arroz.kw_op) * 100), [L('da casca de arroz', 'of rice-husk power'), L('queima no Rio Grande do Sul', 'burns in Rio Grande do Sul')]],
      [`${mw(G.aterro.kw_op)} MW`, [L(`em ${G.aterro.n_op} usinas a biogás`, `in ${G.aterro.n_op} plants on landfill`), L('de aterro e esgoto', 'and sewage biogas')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('A MAIOR USINA DE CADA COMBUSTÍVEL', 'THE LARGEST PLANT FOR EACH FUEL'), y)];
      y += 26;
      for (const g of c.grupos) {
        const m = g.maior;
        s.push(bola(g.cor, 8, y - 5, 7));
        s.push(texto(24, y, curto(m.nome), { tamanho: 14, fonte: SERIF }));
        s.push(texto(LP, y, `${mw(m.kw, m.kw < 10000 ? 1 : 0)} MW`, { tamanho: 13, anc: 'end' }));
        s.push(texto(24, y + 17, `${m.municipio} (${m.uf})${m.ano ? ` · ${m.ano}` : ''}`, { tamanho: 11.5, cor: CINZA }));
        y += 40;
      }
      return { svg: s.join('\n'), y: y - 10 };
    },
    fontes: () => [SIGA(c.referencia)(), MALHA()],
  });
}

/* ------------------------------------------------------------------ 3 quando cada combustível chegou */
async function chegada() {
  const c = await ler('chegada');
  const P = Object.fromEntries(c.periodos.map((p) => [p.chave, p]));
  const raio = (kw) => 2 + 0.036 * Math.sqrt(kw);
  const pontos = c.pontos.map(([p, lon, lat, kw]) => (p === 'sem data'
    ? { coord: [lon, lat], r: raio(kw), cor: CINZA, vazado: true }
    : { coord: [lon, lat], r: raio(kw), cor: P[p].cor, opacidade: 0.88, bordaLargura: 0.9 }));
  const nova = c.mais_novas[0];
  const velha = c.mais_antiga;
  const LEG = { x: 40, y: 1300, w: 360, h: 266 };
  const legenda = (y0) => {
    const s = [rotuloPainel(L('ENTRADA EM OPERAÇÃO', 'START OF OPERATION'), y0)];
    let y = y0 + 28;
    for (const p of c.periodos) { s.push(bola(p.cor, 12, y - 5)); s.push(texto(32, y, L(p.rotulo, p.rotulo_en), { tamanho: 15, fonte: SERIF })); y += 24; }
    s.push(bola(CINZA, 12, y - 5, 8, { vazado: true }));
    s.push(texto(32, y, L('sem data no SIGA', 'no date in SIGA'), { tamanho: 15, fonte: SERIF }));
    y += 30;
    const lc = legendaCirculos([400000, 100000, 10000], raio, (v) => `${nf(v / 1000)} MW`, { y, cor: CINZA, tamanho: 14 });
    s.push(lc.svg);
    return { svg: s.join('\n'), y: y + lc.altura };
  };
  return () => ({
    layout: 'um',
    motivo: 'agro',
    serie: serie(3),
    titulo: () => L('Quando cada combustível chegou', 'When each fuel arrived'),
    subtitulo: () => L('Desde 2015, a biomassa sem cana ganhou mais potência que o bagaço',
      'Since 2015, non-cane biomass has added more power than bagasse'),
    descricao: () => L(
      `As ${nf(c.n_nao_cana)} usinas a biomassa em operação que não queimam bagaço de cana, pelo ano de entrada em operação registrado no SIGA (${dataRef(c.referencia)}) e pela potência outorgada`,
      `The ${nf(c.n_nao_cana)} operating biomass plants that do not burn cane bagasse, by the year they entered operation as recorded in SIGA (${dataRef(c.referencia)}) and by licensed capacity`),
    mapa: () => ({
      preencher: () => FUNDO,
      bordaMunicipio: 0.9,
      bordaUnidadeCor: BORDA_UF,
      semRgint: true,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      pontos,
      chamadas: [{
        coord: nova.coord, dx: -340, dy: -120,
        titulo: L(`${nova.ano} · ${curto(nova.nome).toUpperCase()} · ${mw(nova.kw)} MW`, `${nova.ano} · ${curto(nova.nome).toUpperCase()} · ${mw(nova.kw)} MW`),
        linhas: L([`${nova.municipio} (${nova.uf}): a maior que chegou`, 'nos últimos dois anos, a licor negro'],
          [`${nova.municipio} (${nova.uf}): the largest arrival`, 'of the last two years, on black liquor']),
      }, {
        coord: velha.coord, dx: 330, dy: -90,
        titulo: L(`${velha.ano} · A MAIS ANTIGA`, `${velha.ano} · THE OLDEST`),
        linhas: L([`${curto(velha.nome)}, ${velha.municipio} (${velha.uf}),`, `${mw(velha.kw)} MW a licor negro`],
          [`${curto(velha.nome)}, ${velha.municipio} (${velha.uf}),`, `${mw(velha.kw)} MW on black liquor`]),
      }],
    }),
    reservas: () => [[LEG.x - 10, LEG.y - 10, LEG.x + LEG.w + 10, LEG.y + LEG.h + 10]],
    sobreMapaPrancha: () => `<rect x="${LEG.x}" y="${LEG.y}" width="${LEG.w}" height="${LEG.h}" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1.2"/>
<g transform="translate(${LEG.x + 18} ${LEG.y + 32})">${legenda(0).svg}</g>`,
    legendaFigura: () => {
      const l = legenda(0);
      return { svg: l.svg, altura: l.y, largura: 300, canto: 'sw' };
    },
    numeros: () => [
      [`${gw(c.nao_cana_desde_2015)} GW`, [L('sem cana entraram desde 2015;', 'of non-cane power since 2015;'), L(`do bagaço, ${gw(c.cana_desde_2015)} GW`, `bagasse added ${gw(c.cana_desde_2015)} GW`)]],
      [pc((c.nao_cana_desde_2015 / c.kw_nao_cana) * 100), [L('da potência sem cana', 'of non-cane capacity'), L('entrou de 2015 para cá', 'came online from 2015 on')]],
      [`${gw(c.blocos.find((b) => b.de === 2010).cana)} GW`, [L('de bagaço em 2010–2014,', 'of bagasse in 2010–2014,'), L('o auge da cana', 'the cane boom')]],
      [String(c.grupos.find((g) => g.chave === 'lenha').mediana_ano), [L('é o ano mediano das', 'is the median year of'), L('usinas a lenha', 'the firewood plants')]],
    ],
    painel: (y) => {
      // Barras por bloco de cinco anos: bagaço (anel) e sem cana (cheio).
      const s = [rotuloPainel(L('MW QUE ENTRARAM, A CADA CINCO ANOS', 'MW ENTERING, EVERY FIVE YEARS'), y)];
      y += 12;
      const blocos = c.blocos.filter((b) => b.de >= 1970);
      const hMax = 110;
      const max = Math.max(...blocos.map((b) => Math.max(b.cana, b.nao_cana)));
      const bw = LP / blocos.length;
      const COR_NC = '#8a2f1d';
      blocos.forEach((b, i) => {
        const x = i * bw;
        const hc = (b.cana / max) * hMax;
        const hn = (b.nao_cana / max) * hMax;
        s.push(`<rect x="${f1(x + 3)}" y="${f1(y + hMax - hc)}" width="${f1(bw / 2 - 3)}" height="${f1(hc)}" fill="#e3d6b4" stroke="#b89a4a" stroke-width=".8"/>`);
        s.push(`<rect x="${f1(x + bw / 2)}" y="${f1(y + hMax - hn)}" width="${f1(bw / 2 - 3)}" height="${f1(hn)}" fill="${COR_NC}"/>`);
        if (i % 2 === 0 || b.de === 2025) s.push(texto(x + bw / 2, y + hMax + 15, b.de === 2025 ? '25–26' : `’${String(b.de).slice(2)}`, { tamanho: 11, cor: CINZA, anc: 'middle' }));
      });
      s.push(`<path d="M0 ${y + hMax}H${LP}" stroke="${TINTA}" stroke-width=".8"/>`);
      const b10 = blocos.find((b) => b.de === 2010);
      const b15 = blocos.find((b) => b.de === 2015);
      const i10 = blocos.indexOf(b10);
      s.push(texto(i10 * bw - 4, y + 12, L(`${gw(b10.cana, 1)} GW de bagaço`, `${gw(b10.cana, 1)} GW of bagasse`), { tamanho: 11.5, anc: 'end' }));
      s.push(texto((i10 + 1) * bw + bw - 2, y + hMax - (b15.nao_cana / max) * hMax - 6, gw(b15.nao_cana, 1), { tamanho: 11.5, anc: 'middle', cor: COR_NC }));
      y += hMax + 36;
      s.push(`<rect x="0" y="${y - 10}" width="18" height="11" fill="#e3d6b4" stroke="#b89a4a" stroke-width=".8"/>`);
      s.push(texto(24, y, L('bagaço de cana', 'cane bagasse'), { tamanho: 12 }));
      s.push(`<rect x="180" y="${y - 10}" width="18" height="11" fill="${COR_NC}"/>`);
      s.push(texto(204, y, L('todos os outros combustíveis', 'every other fuel'), { tamanho: 12 }));
      y += 38;
      // Uma linha por combustível: cada usina é um ponto no ano em que entrou.
      s.push(rotuloPainel(L('CADA USINA NO ANO EM QUE ENTROU', 'EACH PLANT IN ITS START YEAR'), y));
      y += 14;
      const x0 = 150;
      const [a0, a1] = [1955, 2026];
      const X = (a) => x0 + ((a - a0) / (a1 - a0)) * (LP - x0 - 6);
      const rr = (kw) => 1.6 + 0.012 * Math.sqrt(kw);
      const nomes = { licor: ['licor negro', 'black liquor'], residuos: ['cavaco e resíduos', 'chips and residue'], lenha: ['lenha', 'firewood'],
        carvao: ['carvão vegetal', 'charcoal'], arroz: ['casca de arroz', 'rice husk'], capim: ['capim-elefante', 'elephant grass'],
        oleos: ['palma e etanol', 'palm and ethanol'], biogas_rural: ['biogás rural', 'farm biogas'], aterro: ['biogás de aterro', 'landfill biogas'],
        lixo: ['lixo queimado', 'burnt waste'] };
      const y0 = y;
      for (const g of c.grupos) {
        y += 22;
        s.push(`<path d="M${x0} ${y - 4}H${LP}" stroke="#e1e4e7" stroke-width=".8"/>`);
        s.push(texto(0, y, L(...nomes[g.chave]), { tamanho: 12 }));
        for (const [a, kw] of [...g.usinas].sort((p, q) => q[1] - p[1])) s.push(`<circle cx="${f1(X(a))}" cy="${y - 4}" r="${f1(rr(kw))}" fill="${g.cor}" fill-opacity=".75" stroke="${PAPEL}" stroke-width=".5"/>`);
      }
      for (const a of [1960, 1980, 2000, 2015, 2026]) {
        s.push(`<path d="M${f1(X(a))} ${y0 + 8}V${y + 6}" stroke="#c9ced3" stroke-width=".6" stroke-dasharray="2 3"/>`);
        s.push(texto(X(a), y + 20, String(a), { tamanho: 11, cor: CINZA, anc: 'middle' }));
      }
      y += 38;
      s.push(texto(0, y, L(`área do ponto ∝ MW · ${c.sem_data.n} usinas sem data ficam de fora`, `dot area ∝ MW · ${c.sem_data.n} plants with no date left out`), { tamanho: 11.5, cor: CINZA }));
      return { svg: s.join('\n'), y: y + 6 };
    },
    fontes: () => [SIGA(c.referencia)(), MALHA()],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { licor, combustiveis, chegada };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/combustivel-biomassa-br/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
// Como na biodiesel-br: o rótulo do oceano do motor cai sobre Trindade e Martim Vaz; este entra ao largo da Bahia.
// A caixa de legenda (sobreMapaPrancha) só vai na prancha; a figura usa a legendaFigura.
const OCEANO = [-33.5, -16];
const comOceano = (t) => {
  if (t.layout !== 'um') return t;
  const { mapa, sobreMapa } = t;
  return Object.assign(t, {
    mapa: () => ({ ...mapa(), oceano: false }),
    sobreMapa: (proj) => {
      const [x, y] = proj(OCEANO);
      return `${sobreMapa?.(proj) ?? ''}
${t._enquadramento ? '' : (t.sobreMapaPrancha?.(proj) ?? '')}
<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="19" letter-spacing="5" fill="#6f8796">${L('OCEANO ATLÂNTICO', 'ATLANTIC OCEAN')}</text>`;
    },
  });
};
await usarBrasil();
const e = SERIE.find((s) => s.tema === nome);
const fazer = await TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => comOceano(fazer()) });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `combustivel-biomassa-br-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
