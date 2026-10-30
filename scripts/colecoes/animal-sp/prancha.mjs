#!/usr/bin/env node
/**
 * Coleção «Leite, ovos, mel e peixe» — desenha uma prancha a partir do cache de preparar.py (uso interno).
 *
 *   node scripts/colecoes/animal-sp/prancha.mjs ovos|leite|mel|tilapia|valor
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  RAIZ, LP, SERIF, MONO, TINTA, CINZA, ZERO, PAPEL, esc, nf, f1, lingua, largura,
  gerarPrancha, legendaClasses, rotuloPainel,
} from '../lib/prancha-sp.mjs';
import { legendaCirculos } from '../lib/arte.mjs';
import { lerRaster } from '../lib/raster.mjs';

export const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'animal-sp', 'serie.json'), 'utf8'));
const OVOS = ['#fdf6dc', '#fbe6a6', '#f6cd6b', '#eaa93a', '#cc7d1c', '#93520f'];
const LEITE = ['#eef2f6', '#cfdbe6', '#a6bfd3', '#7697b5', '#4a6f93', '#26476a'];
const MEL = ['#fbf3d6', '#f4dc96', '#e8bd54', '#d29a26', '#a8711a', '#6e4610'];
const PEIXE = ['#e8f2f4', '#bfdde3', '#8cc1cc', '#559eae', '#2b7a8f', '#12536b'];
const PRODUTO = {
  leite: [LEITE[4], 'Leite', 'Milk'],
  ovos: [OVOS[3], 'Ovos', 'Eggs'],
  mel: [MEL[4], 'Mel', 'Honey'],
  casulos: ['#8a6a9c', 'Casulos do bicho-da-seda', 'Silkworm cocoons'],
  aquicultura: [PEIXE[4], 'Aquicultura', 'Aquaculture'],
};
const NEUTRO = '#f1f2f3';

const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `animal-sp-${nome}.json`), 'utf8'));
const L = (pt, en) => (lingua() === 'en' ? en : pt);
const serie = (i) => () => L(`LEITE, OVOS, MEL E PEIXE · ${i}/5`, `MILK, EGGS, HONEY AND FISH · ${i}/5`);
const cor = (paleta) => (k) => (k === null || k === undefined ? null : k === 0 ? ZERO : paleta[k - 1]);
const pct = (v) => `${nf(v, v < 10 ? 1 : 0)} %`;
const PPM = (t, a0, a1) => L(`IBGE, PPM ${a0} a ${a1} (tabela ${t})`, `IBGE, PPM ${a0}–${a1} (table ${t})`);
const CP2B = () => L('CP2B (Unicamp), método v5.1, 2026', 'CP2B (Unicamp), method v5.1, 2026');
const MALHA = () => L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025');

/** Lista "nome ........ valor" do painel. */
function lista(itens, y, { tamanho = 17, passo = 25, x = 0, larg = LP } = {}) {
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

/** Colunas por ano: { ano: valor }; rotula o primeiro, o último e o maior. */
function colunas(serieAnos, y, { cor: cc, borda, hMax = 80, fmt, larg = LP, x = 0, passoAno = 4 }) {
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
    if (i % passoAno === 0 || i === anos.length - 1)
      s.push(`<text x="${f1(xx + bw / 2)}" y="${y + hMax + 16}" text-anchor="middle" font-family="${MONO}" font-size="11" fill="${CINZA}">${a}</text>`);
  });
  return { svg: s.join('\n'), y: y + hMax + 22 };
}

/**
 * Prancha de um produto: mapa da produção do último ano em classes, legenda, série estadual e maiores produtores.
 * `t` traz os textos e formatos de cada produto.
 */
function produto(c, paleta, t) {
  const [a0, a1] = c.anos;
  const top = c.maiores[0];
  const fx = (v) => nf(v / t.div, t.casas(v / t.div));
  const rot = (i) => (i ? `${fx(c.quebras[i - 1])} – ${fx(c.quebras[i])}` : L(`até ${fx(c.quebras[0])}`, `up to ${fx(c.quebras[0])}`));
  return () => ({
    layout: 'um',
    motivo: 'agro',
    serie: serie(t.i),
    raster: t.raster,
    titulo: () => L(...t.titulo),
    subtitulo: () => L(...t.subtitulo),
    descricao: () => L(...t.descricao),
    mapa: () => ({
      preencher: (cd) => cor(paleta)(c.valores[cd] ?? null),
      destaques: c.maiores.slice(1, 5).map((m) => ({ cd: m.cd, texto: m.nome })),
      tamanhoDestaque: 15,
      chamadas: [{ cd: top.cd, dx: t.chamada[0], dy: t.chamada[1], titulo: t.chamadaTitulo(top), linhas: t.chamadaLinhas() }],
    }),
    numeros: t.numeros,
    painel: (y) => {
      const s = [rotuloPainel(L(`PRODUÇÃO EM ${a1} (${t.unidade[0]})`, `PRODUCTION IN ${a1} (${t.unidade[1]})`), y)];
      const itens = [[ZERO, L('zero', 'zero')], ...c.quebras.map((_, i) => [paleta[i], rot(i)]), [null, L(t.semInfo[0], t.semInfo[1])]];
      const l1 = legendaClasses(itens.slice(0, 4), { y: y + 16, passo: 27, tamanho: 16, id: 'lga1' });
      const l2 = legendaClasses(itens.slice(4), { x: LP / 2 + 8, y: y + 16, passo: 27, tamanho: 16, id: 'lga2' });
      s.push(l1.svg, l2.svg);
      y += 16 + Math.max(l1.altura, l2.altura) + 30;
      s.push(rotuloPainel(L(t.serieRotulo[0], t.serieRotulo[1]), y));
      const col = colunas(c.serie, y + 34, { cor: paleta[2], borda: paleta[4], fmt: t.fmtSerie, passoAno: t.passoAno ?? 4 });
      s.push(col.svg);
      y = col.y + 26;
      s.push(rotuloPainel(L(`MAIORES PRODUTORES EM ${a1} (${t.unidade[0]})`, `LARGEST PRODUCERS IN ${a1} (${t.unidade[1]})`), y));
      const l = lista(c.maiores.slice(0, 5).map((m) => [m.nome, fx(m.valor)]), y + 30);
      s.push(l.svg);
      return { svg: s.join('\n'), y: l.y - 10 };
    },
    // Figura: só as classes (e a água do raster, na tilápia); sem a série nem os maiores produtores.
    legendaFigura: () => {
      const s = [rotuloPainel(L(`PRODUÇÃO EM ${a1} (${t.unidade[0]})`, `PRODUCTION IN ${a1} (${t.unidade[1]})`), 0)];
      const itens = [[ZERO, L('zero', 'zero')], ...c.quebras.map((_, i) => [paleta[i], rot(i)]), [null, L(t.semInfo[0], t.semInfo[1])]];
      if (t.raster) itens.push(['#7fa7c9', L('rios e represas', 'rivers and reservoirs')]);
      const meio = Math.ceil(itens.length / 2);
      const l1 = legendaClasses(itens.slice(0, meio), { y: 16, passo: 27, tamanho: 16, id: 'flga1' });
      const l2 = legendaClasses(itens.slice(meio), { x: LP / 2 + 8, y: 16, passo: 27, tamanho: 16, id: 'flga2' });
      s.push(l1.svg, l2.svg);
      return { svg: s.join('\n'), altura: 16 + l1.altura - 8, largura: LP };
    },
    fontes: t.fontes,
  });
}

/* ------------------------------------------------------------------ 1/5 ovos */
async function ovos() {
  const c = await ler('ovos');
  const [a0, a1] = c.anos;
  const cresc = (c.total[a1] / c.total[a0] - 1) * 100;
  return produto(c, OVOS, {
    i: 1, div: 1, casas: () => 0,
    unidade: ['MIL DÚZIAS', 'THOUSAND DOZEN'],
    semInfo: ['sem informação', 'no data'],
    titulo: ['Ovos', 'Eggs'],
    subtitulo: ['Um em cada cinco ovos paulistas sai de Bastos', 'One in five of São Paulo’s eggs comes from Bastos'],
    descricao: [`Produção de ovos de galinha por município em ${a1}, em mil dúzias, segundo a Pesquisa da Pecuária Municipal do IBGE`,
      `Hen egg production by municipality in ${a1}, in thousand dozen, from IBGE’s Municipal Livestock Survey`],
    chamada: [-170, 300],
    chamadaTitulo: (m) => `${m.nome.toUpperCase()} · ${nf(m.valor / 1e3, 0)} ${L('MI DE DÚZIAS', 'M DOZEN')}`,
    chamadaLinhas: () => L([`${nf(c.maior_pct, 0)} % dos ovos de galinha do estado`], [`${nf(c.maior_pct, 0)} % of the state’s hen eggs`]),
    numeros: () => [
      [`${nf(c.total[a1] / 1e6, 2)} ${L('bi', 'bn')}`, [L('de dúzias de ovos', 'dozen hen eggs'), L(`de galinha em ${a1}`, `in ${a1}`)]],
      [pct(c.parte_brasil[a1]), [L('dos ovos de galinha', 'of Brazil’s'), L('do Brasil', 'hen eggs')]],
      [`+${nf(cresc, 0)} %`, [L('de produção', 'in production'), `${a0} → ${a1}`]],
      [`${nf(c.biometano_m3_dia / 1e3, 0)} ${L('mil', 'thousand')} m³`, [L('de biometano por dia', 'of biomethane per day'), L('das poedeiras (CP2B)', 'from laying hens (CP2B)')]],
    ],
    serieRotulo: ['OVOS DE GALINHA EM SP (MI DE DÚZIAS)', 'HEN EGGS IN SP (M DOZEN)'],
    fmtSerie: (v) => nf(v / 1e3, 0),
    fontes: () => [PPM(74, a0, a1), CP2B(), MALHA()],
  });
}

/* ------------------------------------------------------------------ 2/5 leite */
async function leite() {
  const c = await ler('leite');
  const [a0, a1] = c.anos;
  const queda = (1 - c.total[a1] / c.total[a0]) * 100;
  return produto(c, LEITE, {
    i: 2, div: 1, casas: () => 0,
    unidade: ['MIL LITROS', 'THOUSAND LITRES'],
    semInfo: ['sem informação', 'no data'],
    titulo: ['Leite', 'Milk'],
    subtitulo: ['Em quase todo o estado, no menor volume da série', 'Almost everywhere, at the lowest volume on record'],
    descricao: [`Produção de leite de vaca por município em ${a1}, em mil litros, segundo a Pesquisa da Pecuária Municipal do IBGE`,
      `Cow’s milk production by municipality in ${a1}, in thousand litres, from IBGE’s Municipal Livestock Survey`],
    chamada: [120, -300],
    chamadaTitulo: (m) => `${m.nome.toUpperCase()} · ${nf(m.valor / 1e3, 1)} ${L('MI DE LITROS', 'M LITRES')}`,
    chamadaLinhas: () => L(['o maior produtor, com', `${nf(c.maior_pct, 1)} % do leite do estado`], ['the largest producer, with', `${nf(c.maior_pct, 1)} % of the state’s milk`]),
    numeros: () => [
      [`${nf(c.total[a1] / 1e6, 2)} ${L('bi', 'bn')}`, [L('de litros de leite', 'litres of milk'), L(`em ${a1}`, `in ${a1}`)]],
      [`−${nf(queda, 0)} %`, [L('de produção', 'in production'), `${a0} → ${a1}`]],
      [`${pct(c.parte_brasil[a0])} → ${pct(c.parte_brasil[a1])}`, [L('do leite do Brasil', 'of Brazil’s milk'), `${a0} → ${a1}`]],
      [String(c.produtores[a1]), [L('municípios', 'municipalities'), L('produzem leite', 'produce milk')]],
    ],
    serieRotulo: ['LEITE EM SP (MI DE LITROS)', 'MILK IN SP (M LITRES)'],
    fmtSerie: (v) => nf(v / 1e3, 0),
    fontes: () => [PPM(74, a0, a1), MALHA()],
  });
}

/* ------------------------------------------------------------------ 3/5 mel */
async function mel() {
  const c = await ler('mel');
  const [a0, a1] = c.anos;
  const vezes = c.total[a1] / c.total[a0];
  const bauru = (c.regioes.Bauru / c.total[a1]) * 100;
  return produto(c, MEL, {
    i: 3, div: 1, casas: () => 0,
    unidade: ['KG', 'KG'],
    semInfo: ['sem informação', 'no data'],
    titulo: ['Mel', 'Honey'],
    subtitulo: ['Mais que triplicou em dezesseis anos', 'More than tripled in sixteen years'],
    descricao: [`Produção de mel de abelha por município em ${a1}, em quilos, segundo a Pesquisa da Pecuária Municipal do IBGE`,
      `Honey production by municipality in ${a1}, in kilograms, from IBGE’s Municipal Livestock Survey`],
    chamada: [-260, 280],
    chamadaTitulo: (m) => `${m.nome.toUpperCase()} · ${nf(m.valor / 1e3, 0)} T`,
    chamadaLinhas: () => L(['o maior produtor de mel', 'do estado em ' + a1], ['the state’s largest', `honey producer in ${a1}`]),
    numeros: () => [
      [`${nf(c.total[a1] / 1e6, 1)} ${L('mil t', 'thousand t')}`, [L('de mel em', 'of honey in'), String(a1)]],
      [`${nf(vezes, 1)} ×`, [L('o volume de', 'the volume of'), String(a0)]],
      [pct(c.parte_brasil[a1]), [L('do mel do Brasil;', 'of Brazil’s honey;'), L(`eram ${pct(c.parte_brasil[a0])} em ${a0}`, `it was ${pct(c.parte_brasil[a0])} in ${a0}`)]],
      [pct(bauru), [L('na região de Bauru', 'in the Bauru region')]],
    ],
    serieRotulo: ['MEL EM SP (T)', 'HONEY IN SP (T)'],
    fmtSerie: (v) => nf(v / 1e3, 0),
    fontes: () => [PPM(74, a0, a1), MALHA()],
  });
}

/* ------------------------------------------------------------------ 4/5 tilápia */
async function tilapia() {
  const c = await ler('tilapia');
  const [a0, a1] = c.anos;
  const r = await lerRaster('grade-agro-sp-tabuleiro');
  const vezes = c.total[a1] / c.total[a0];
  return produto(c, PEIXE, {
    i: 4, div: 1000, casas: (v) => (v < 10 ? 1 : 0),
    raster: { r, modo: 'classes', cor: (v) => (v === 33 || v === 31 ? '#7fa7c9' : null), recorte: 'limite', fator: 2 },
    unidade: ['T', 'T'],
    semInfo: ['fora da tabela', 'not in the table'],
    titulo: ['Tilápia', 'Tilapia'],
    subtitulo: ['Quase todo peixe criado no estado é tilápia', 'Almost every farmed fish in the state is tilapia'],
    descricao: [`Produção de tilápia em criadouros por município em ${a1}, em toneladas, segundo a Pesquisa da Pecuária Municipal do IBGE; em azul, rios e represas (MapBiomas, 2024)`,
      `Farmed tilapia production by municipality in ${a1}, in tonnes, from IBGE’s Municipal Livestock Survey; rivers and reservoirs in blue (MapBiomas, 2024)`],
    chamada: [-250, -190],
    chamadaTitulo: (m) => `${m.nome.toUpperCase()} · ${nf(m.valor / 1e3, 0)} T`,
    chamadaLinhas: () => L(['o maior produtor de tilápia', 'do estado em ' + a1], ['the state’s largest', `tilapia producer in ${a1}`]),
    numeros: () => [
      [`${nf(c.total[a1] / 1e6, 0)} ${L('mil t', 'thousand t')}`, [L('de tilápia em', 'of tilapia in'), String(a1)]],
      [pct(c.tilapia_pct_peixes), [L('do peixe criado', 'of the farmed fish'), L('no estado', 'in the state')]],
      [`${nf(vezes, 1)} ×`, [L('o volume de', 'the volume of'), String(a0)]],
      [pct(c.parte_brasil[a1]), [L('da tilápia', 'of Brazil’s'), L('do Brasil', 'tilapia')]],
    ],
    serieRotulo: ['TILÁPIA EM SP (MIL T)', 'TILAPIA IN SP (THOUSAND T)'],
    fmtSerie: (v) => nf(v / 1e6, 0),
    passoAno: 3,
    fontes: () => [PPM(3940, a0, a1), L('MapBiomas, Coleção 10 (2024)', 'MapBiomas, Collection 10 (2024)'), MALHA()],
  });
}

/* ------------------------------------------------------------------ 5/5 valor da produção */
async function valor() {
  const c = await ler('valor');
  const raio = (v) => 1 + 0.03 * Math.sqrt(v);
  const top = c.maiores[0];
  const ordem = Object.entries(c.produtos).sort((a, b) => b[1] - a[1]);
  return () => ({
    layout: 'um',
    motivo: 'agro',
    serie: serie(5),
    titulo: () => L('O valor da produção animal', 'The value of animal products'),
    subtitulo: () => L('O leite está em toda parte; o dinheiro, nos ovos', 'Milk is everywhere; the money is in eggs'),
    descricao: () => L(`Valor do leite, dos ovos, do mel, dos casulos e da aquicultura em ${c.ano}, por município (círculo); a cor diz o produto de maior valor`,
      `Value of milk, eggs, honey, cocoons and aquaculture in ${c.ano}, by municipality (circle); the colour shows the most valuable product`),
    mapa: () => ({
      preencher: () => NEUTRO,
      bordaMunicipio: 0.5,
      bordaUnidadeCor: '#d9dde0',
      pontos: [...c.pontos].sort((a, b) => b.v - a.v).map((p) => ({ coord: p.coord, r: raio(p.v), cor: PRODUTO[p.g][0], opacidade: 0.8, bordaLargura: 0.8 })),
      chamadas: [{
        cd: top.cd, dx: -250, dy: -320,
        titulo: `${top.nome.toUpperCase()} · R$ ${nf(top.valor / 1e6, 2)} ${L('BI', 'BN')}`,
        linhas: L([`${nf((top.valor / c.total_mil_reais) * 100, 0)} % do valor do estado`], [`${nf((top.valor / c.total_mil_reais) * 100, 0)} % of the state’s value`]),
      }],
    }),
    numeros: () => [
      [`R$ ${nf(c.total_mil_reais / 1e6, 1)} ${L('bi', 'bn')}`, [L('em leite, ovos, mel,', 'in milk, eggs, honey,'), L(`casulos e peixe em ${c.ano}`, `cocoons and fish in ${c.ano}`)]],
      [pct((c.produtos.ovos / c.total_mil_reais) * 100), [L('desse valor', 'of that value'), L('vem dos ovos', 'comes from eggs')]],
      [String(c.dominante.leite), [L('municípios onde o', 'municipalities where'), L('leite vale mais', 'milk is worth most')]],
      [pct(c.top10_pct), [L('do valor nos 10', 'of the value in the 10'), L('maiores municípios', 'largest municipalities')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('O PRODUTO DE MAIOR VALOR NO MUNICÍPIO', 'THE MOST VALUABLE PRODUCT IN THE MUNICIPALITY'), y)];
      y += 30;
      const max = ordem[0][1];
      for (const [k, v] of ordem) {
        const [cc, pt, en] = PRODUTO[k];
        s.push(`<circle cx="12" cy="${y - 5}" r="7" fill="${cc}" fill-opacity=".85" stroke="${PAPEL}"/>`);
        s.push(`<text x="28" y="${y}" font-family="${SERIF}" font-size="16">${esc(L(pt, en))} (${c.dominante[k] ?? 0})</text>`);
        const w = Math.max((v / max) * (LP - 300), 1);
        s.push(`<rect x="250" y="${y - 11}" width="${f1(w)}" height="12" fill="${cc}"/>`);
        s.push(`<text x="${f1(256 + w)}" y="${y}" font-family="${MONO}" font-size="12">${nf(v / 1e3, v < 1e4 ? 1 : 0)}</text>`);
        y += 25;
      }
      s.push(`<text x="0" y="${y}" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L('(municípios em que é o maior) · milhões de R$ no estado', '(municipalities where it leads) · R$ million in the state'))}</text>`);
      y += 34;
      s.push(rotuloPainel(L(`VALOR POR MUNICÍPIO EM ${c.ano}`, `VALUE BY MUNICIPALITY IN ${c.ano}`), y));
      const lc = legendaCirculos([1000000, 100000], raio, (v) => `R$ ${nf(v / 1e3, 0)} ${L('mi', 'm')}`, { y: y + 20, cor: '#9aa3ab' });
      s.push(lc.svg);
      return { svg: s.join('\n'), y: y + 20 + lc.altura + 4 };
    },
    // Figura: as cores do produto e os círculos, sem as contagens nem as barras.
    legendaFigura: () => {
      const s = [rotuloPainel(L('O PRODUTO DE MAIOR VALOR NO MUNICÍPIO', 'THE MOST VALUABLE PRODUCT IN THE MUNICIPALITY'), 0)];
      let y = 30;
      for (const [k] of ordem) {
        const [cc, pt, en] = PRODUTO[k];
        s.push(`<circle cx="12" cy="${y - 5}" r="7" fill="${cc}" fill-opacity=".85" stroke="${PAPEL}"/>`);
        s.push(`<text x="28" y="${y}" font-family="${SERIF}" font-size="16">${esc(L(pt, en))}</text>`);
        y += 25;
      }
      y += 22;
      s.push(rotuloPainel(L(`VALOR POR MUNICÍPIO EM ${c.ano}`, `VALUE BY MUNICIPALITY IN ${c.ano}`), y));
      const lc = legendaCirculos([1000000, 100000], raio, (v) => `R$ ${nf(v / 1e3, 0)} ${L('mi', 'm')}`, { y: y + 20, cor: '#9aa3ab' });
      s.push(lc.svg);
      return { svg: s.join('\n'), altura: y + 20 + lc.altura, largura: 480 };
    },
    fontes: () => [PPM(74, c.ano, c.ano).replace(/ a \d+| ?–\d+/, ''), L(`IBGE, PPM ${c.ano} (tabela 3940)`, `IBGE, PPM ${c.ano} (table 3940)`), MALHA()],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { ovos, leite, mel, tilapia, valor };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/animal-sp/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
const e = SERIE.find((s) => s.tema === nome);
const fazer = await TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => fazer() });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `animal-sp-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
