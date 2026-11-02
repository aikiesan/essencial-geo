#!/usr/bin/env node
/**
 * Coleção «O que se colhe na mata» (Brasil) — desenha uma prancha a partir do cache de preparar.py (uso interno).
 *
 *   node scripts/colecoes/biomassa-da-mata-br/prancha.mjs acai|babacu|carvao
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  RAIZ, LP, SERIF, MONO, CINZA, PAPEL, TINTA, esc, nf, f1, lingua,
  gerarPrancha, rotuloPainel, usarBrasil,
} from '../lib/prancha-sp.mjs';
import { legendaCirculos } from '../lib/arte.mjs';

const COL = 'biomassa-da-mata-br';
export const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', COL, 'serie.json'), 'utf8'));
const TOTAL = 3; // pranchas da coleção

const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `${COL}-${nome}.json`), 'utf8'));
const L = (pt, en) => (lingua() === 'en' ? en : pt);
const serie = (i) => () => L(`O QUE SE COLHE NA MATA · ${i}/${TOTAL}`, `GATHERED FROM THE FOREST · ${i}/${TOTAL}`);
const mil = (v, casas = 0) => nf(v / 1000, casas);
const mi = (v, casas = 2) => nf(v / 1e6, casas);
const pc = (v, casas = 0) => `${nf(v, casas)} %`;
const PEVS = () => L('IBGE, PEVS 1986–2025 (extração e silvicultura)', 'IBGE, PEVS 1986–2025 (extraction and forestry)');
const PAM = () => L('IBGE, Produção Agrícola Municipal 2015–2025', 'IBGE, Municipal Agricultural Survey 2015–2025');
const MALHA = () => L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025');
const texto = (x, y, t, { tamanho = 12.5, cor = TINTA, anc = 'start', fonte = MONO, extra = '' } = {}) =>
  `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anc}" font-family="${fonte}" font-size="${tamanho}" fill="${cor}" ${extra}>${esc(t)}</text>`;
const FUNDO = '#f1f2f3';
const BORDA_UF = '#c9ced3';
const nomeMun = (m) => `${m.nome} (${m.uf})`;

/** Gráfico de linhas simples: séries [{ pts: [[x, y|null]], cor, largura }], eixos x (anos) e y. */
function linhas({ x0 = 44, y0, w, h, anos: [a0, a1], ymax, passoY, series, rotY = (v) => nf(v), marcasX = [] }) {
  const s = [];
  const X = (a) => x0 + ((a - a0) / (a1 - a0)) * (w - x0);
  const Y = (v) => y0 + h - (v / ymax) * h;
  for (let v = 0; v <= ymax + 1e-9; v += passoY) {
    s.push(`<path d="M${x0} ${f1(Y(v))}H${w}" stroke="#d5d9dd" stroke-width=".8"/>`);
    s.push(texto(x0 - 6, Y(v) + 4, rotY(v), { tamanho: 11, cor: CINZA, anc: 'end' }));
  }
  for (const a of marcasX) s.push(texto(X(a), y0 + h + 16, String(a), { tamanho: 11, cor: CINZA, anc: 'middle' }));
  for (const sr of series) {
    let d = '';
    let novo = true;
    for (const [a, v] of sr.pts) {
      if (v == null) { novo = true; continue; }
      d += `${novo ? 'M' : 'L'}${f1(X(a))} ${f1(Y(v))}`;
      novo = false;
    }
    if (sr.area) s.push(`<path d="${d}L${f1(X(sr.pts.at(-1)[0]))} ${f1(Y(0))}L${f1(X(sr.pts.find((p) => p[1] != null)[0]))} ${f1(Y(0))}Z" fill="${sr.cor}" fill-opacity=".14"/>`);
    s.push(`<path d="${d}" fill="none" stroke="${sr.cor}" stroke-width="${sr.largura ?? 2.4}" stroke-linejoin="round"/>`);
  }
  return { svg: s.join('\n'), X, Y };
}

/** Encaixe do rótulo do oceano (como na biodiesel-br): o do motor sai e este entra ao largo da Bahia. */
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
${t._enquadramento ? '' : (t.sobreMapaPrancha?.(proj) ?? '')}
<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="19" letter-spacing="5" fill="#6f8796">${L('OCEANO ATLÂNTICO', 'ATLANTIC OCEAN')}</text>`;
    },
  });
};

/* ------------------------------------------------------------------ 1 a mata e o açaizal */
async function acai() {
  const c = await ler('acai');
  const COR = Object.fromEntries(c.classes.map((k) => [k.classe, k.cor]));
  const MATA = COR[0];
  const ROXO = COR[3];
  const raio = (v) => 1.6 + 0.055 * Math.sqrt(v);
  const pontos = c.pontos.map(([k, lon, lat, t]) => ({ coord: [lon, lat], r: raio(t), cor: COR[k], opacidade: 0.86, bordaLargura: 0.7 }));
  const imiri = c.top[0];
  const coda = c.top_ext.find((m) => m.uf === 'AM');
  const am = c.ufs.find((u) => u.uf === 'AM');
  const total25 = c.ext_2025 + c.cul_2025;
  const razao = c.cul_2025 / c.ext_2025;
  const LEG = { x: 40, y: 1250, w: 470, h: 316 };
  const classes = (y, { tamanho = 15, numeros = false } = {}) => {
    const s = [];
    for (const k of c.classes) {
      s.push(`<circle cx="10" cy="${y - 5}" r="8" fill="${k.cor}" fill-opacity=".86" stroke="${PAPEL}" stroke-width=".7"/>`);
      s.push(texto(28, y, L(k.rotulo, k.rotulo_en), { tamanho, fonte: SERIF }));
      if (numeros) s.push(texto(LEG.w - 36, y, nf(k.municipios), { tamanho: 13, cor: CINZA, anc: 'end' }));
      y += 25;
    }
    return { svg: s.join('\n'), y };
  };
  const circulos = (y, x = 0) => legendaCirculos([400000, 100000, 10000], raio, (v) => L(`${mil(v)} mil t`, `${mil(v)} k t`), { y, x, cor: CINZA, tamanho: 14 });
  return () => ({
    layout: 'um',
    motivo: 'agro',
    serie: serie(1),
    titulo: () => L('A mata e o açaizal', 'Forest and orchard'),
    subtitulo: () => L(`O açaí cultivado já é ${nf(razao, 0)} vezes o colhido na mata`, `Cultivated açaí is now ${nf(razao, 0)} times the forest harvest`),
    descricao: () => L(
      `Açaí de ${c.municipios} municípios em 2025: o fruto colhido na mata (extração vegetal) e o de lavoura (açaí cultivado), com a parte que veio da mata em cada município`,
      `Açaí from ${c.municipios} municipalities in 2025: fruit gathered in the forest (plant extraction) and fruit from orchards (cultivated açaí), with the share that came from the forest in each`),
    mapa: () => ({
      preencher: () => FUNDO,
      bordaMunicipio: 0.9,
      bordaUnidadeCor: BORDA_UF,
      semRgint: true,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      pontos,
      chamadas: [{
        coord: imiri.coord, dx: 250, dy: -170,
        titulo: L(`IGARAPÉ-MIRI (PA) · ${mil(imiri.cul)} MIL T`, `IGARAPÉ-MIRI (PA) · ${mil(imiri.cul)} K T`),
        linhas: L([`de açaí cultivado em 2025: ${nf(imiri.cul / c.ext_2025, 1)} vez`, 'todo o açaí colhido na mata no país'],
          [`of cultivated açaí in 2025: ${nf(imiri.cul / c.ext_2025, 1)} times`, 'all the açaí gathered in Brazil’s forests']),
      }, {
        coord: coda.coord, dx: 30, dy: -230,
        titulo: L(`AMAZONAS · ${pc((am.ext / (am.ext + am.cul)) * 100)} DA MATA`, `AMAZONAS · ${pc((am.ext / (am.ext + am.cul)) * 100)} FROM THE FOREST`),
        linhas: L([`${mil(am.ext, 1)} mil t extraídas; Codajás,`, `${mil(coda.ext, 1)} mil t da mata e ${mil(coda.cul)} mil cultivadas`],
          [`${mil(am.ext, 1)} k t gathered; Codajás,`, `${mil(coda.ext, 1)} k t from the forest, ${mil(coda.cul)} k cultivated`]),
      }],
    }),
    reservas: () => [[LEG.x - 10, LEG.y - 10, LEG.x + LEG.w + 10, LEG.y + LEG.h + 10]],
    sobreMapaPrancha: () => {
      const s = [`<rect x="${LEG.x}" y="${LEG.y}" width="${LEG.w}" height="${LEG.h}" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1.2"/>`,
        `<g transform="translate(${LEG.x + 18} ${LEG.y + 30})">`,
        rotuloPainel(L('PARTE DO AÇAÍ QUE VEIO DA MATA, 2025', 'SHARE OF AÇAÍ FROM THE FOREST, 2025'), 0)];
      const k = classes(32, { numeros: true });
      s.push(k.svg);
      s.push(texto(LEG.w - 36, k.y - 2, L('municípios', 'municipalities'), { tamanho: 11, cor: CINZA, anc: 'end' }));
      s.push(texto(0, k.y - 2, L('círculo: mata + cultivo, 2025', 'circle: forest + cultivated, 2025'), { tamanho: 11, cor: CINZA }));
      s.push(circulos(k.y + 18).svg, '</g>');
      return s.join('\n');
    },
    legendaFigura: () => {
      const s = [rotuloPainel(L('AÇAÍ DA MATA, % DO TOTAL, 2025', 'AÇAÍ FROM THE FOREST, % OF TOTAL, 2025'), 0)];
      const k = classes(28);
      s.push(k.svg);
      const lc = circulos(k.y + 4);
      s.push(lc.svg);
      return { svg: s.join('\n'), altura: k.y + 4 + lc.altura, largura: 440, canto: 'sw' };
    },
    numeros: () => [
      [L(`${nf(razao, 1)} ×`, `${nf(razao, 1)}×`), [L(`açaí cultivado ÷ da mata, 2025`, `cultivated ÷ forest açaí, 2025`), L(`(${mi(c.cul_2025, 2)} mi t e ${mil(c.ext_2025)} mil t)`, `(${mi(c.cul_2025, 2)} M t and ${mil(c.ext_2025)} k t)`)]],
      [pc(c.pct_mata_2025), [L('do açaí veio da mata em 2025;', 'of açaí came from the forest'), L(`eram ${pc(c.pct_mata_2015)} em 2015`, `in 2025; ${pc(c.pct_mata_2015)} in 2015`)]],
      [`+${pc((c.ext_2025 / c.ext_1986 - 1) * 100)}`, [L('o açaí da mata desde 1986', 'forest açaí since 1986'), L(`(${mil(c.ext_1986)} mil → ${mil(c.ext_2025)} mil t)`, `(${mil(c.ext_1986)} k → ${mil(c.ext_2025)} k t)`)]],
      [pc(c.pa_pct_total), [L('de todo o açaí de 2025', 'of all 2025 açaí'), L('saiu do Pará', 'came from Pará')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('MATA E CULTIVO, 1986–2025 · MIL T', 'FOREST AND ORCHARD, 1986–2025 · K T'), y)];
      y += 22;
      const g = linhas({
        y0: y, w: LP - 70, h: 150, anos: [1986, 2025], ymax: 2100000, passoY: 500000, rotY: (v) => mil(v), marcasX: [1986, 1995, 2005, 2015, 2025],
        series: [
          { pts: c.serie.map((a) => [a.ano, a.cul]), cor: ROXO, area: true },
          { pts: c.serie.map((a) => [a.ano, a.ext]), cor: MATA, area: true },
        ],
      });
      s.push(g.svg);
      s.push(texto(g.X(2025) + 6, g.Y(c.cul_2025) + 4, mil(c.cul_2025), { tamanho: 12, cor: ROXO }));
      s.push(texto(g.X(2025) + 6, g.Y(c.ext_2025) + 4, mil(c.ext_2025), { tamanho: 12, cor: MATA }));
      s.push(texto(g.X(2015) - 6, g.Y(c.cul_2015) - 6, L('cultivado (PAM, desde 2015)', 'cultivated (PAM, since 2015)'), { tamanho: 11.5, cor: ROXO, anc: 'end' }));
      s.push(texto(g.X(1987), g.Y(c.ext_1986) - 10, L('da mata (extração vegetal)', 'from the forest (extraction)'), { tamanho: 11.5, cor: MATA }));
      y += 150 + 46;
      // Os dez maiores municípios: barras empilhadas mata + cultivo.
      s.push(rotuloPainel(L('OS DEZ MAIORES, 2025 · MIL T', 'THE TEN LARGEST, 2025 · K T'), y));
      y += 24;
      const xb = 190;
      const wb = LP - xb - 56;
      const max = c.top[0].total;
      for (const m of c.top) {
        const we = (m.ext / max) * wb;
        const wc = (m.cul / max) * wb;
        s.push(texto(0, y, nomeMun(m), { tamanho: 12 }));
        s.push(`<rect x="${xb}" y="${y - 10}" width="${f1(Math.max(we, 0))}" height="12" fill="${MATA}"/>`);
        s.push(`<rect x="${f1(xb + we)}" y="${y - 10}" width="${f1(Math.max(wc, 0.5))}" height="12" fill="${ROXO}"/>`);
        s.push(texto(xb + we + wc + 6, y, mil(m.total), { tamanho: 12 }));
        y += 19;
      }
      s.push(`<rect x="0" y="${y - 4}" width="16" height="10" fill="${MATA}"/>`);
      s.push(texto(22, y + 5, L('da mata', 'forest'), { tamanho: 11, cor: CINZA }));
      s.push(`<rect x="110" y="${y - 4}" width="16" height="10" fill="${ROXO}"/>`);
      s.push(texto(132, y + 5, L('cultivado', 'cultivated'), { tamanho: 11, cor: CINZA }));
      y += 34;
      const notas = L([
        'Do fruto, a polpa é a parte fina; o caroço, a maior parte',
        'da massa, fica na batedeira e vira resíduo. A conta acima',
        'é do fruto inteiro, não da polpa nem do caroço.',
      ], [
        'The pulp is the thin part of the fruit; the pit, most of its',
        'mass, stays behind at the pulping shop as waste. The figures',
        'above are for the whole fruit, not the pulp or the pit.',
      ]);
      for (const l of notas) { s.push(texto(0, y, l, { tamanho: 12.5, fonte: SERIF })); y += 19; }
      return { svg: s.join('\n'), y };
    },
    fontes: () => [PEVS(), PAM(), MALHA()],
  });
}

/* ------------------------------------------------------------------ 2 menos coco quebrado */
async function babacu() {
  const c = await ler('babacu');
  const cat = Object.fromEntries(c.categorias.map((k) => [k.chave, k]));
  const raio = (v) => 1.6 + 0.24 * Math.sqrt(v);
  const pontos = [];
  for (const [k, lon, lat, a, b] of c.pontos) {
    if (b > 0) pontos.push({ coord: [lon, lat], r: raio(b), cor: cat[k].cor, opacidade: 0.9, bordaLargura: 0.7 });
    if (a > 0) pontos.push({ coord: [lon, lat], r: raio(a), cor: k === 'parou' ? cat.parou.cor : TINTA, anel: true, largura: k === 'parou' ? 1.6 : 0.9 });
  }
  const codo = c.top_a[0];
  const toc = c.top_a.find((m) => m.uf === 'TO');
  const to = c.ufs.find((u) => u.uf === 'TO');
  const queda = (1 - c.t_2025 / c.pico_t) * 100;
  const LEG = { x: 40, y: 1240, w: 470, h: 326 };
  const ORDEM = ['caiu90', 'caiu50', 'manteve', 'nova', 'parou'];
  const simbolo = (k, cx, cy) => {
    const g = cat[k];
    if (k === 'parou') return `<circle cx="${cx}" cy="${cy}" r="8" fill="none" stroke="${g.cor}" stroke-width="1.6"/>`;
    if (k === 'nova') return `<circle cx="${cx}" cy="${cy}" r="7" fill="${g.cor}" fill-opacity=".9" stroke="${PAPEL}" stroke-width=".7"/>`;
    return `<circle cx="${cx}" cy="${cy}" r="9" fill="none" stroke="${TINTA}" stroke-width=".9"/><circle cx="${cx}" cy="${cy}" r="${k === 'manteve' ? 7.5 : k === 'caiu50' ? 5 : 3}" fill="${g.cor}" fill-opacity=".9" stroke="${PAPEL}" stroke-width=".6"/>`;
  };
  const categorias = (y, { tamanho = 15, numeros = false, direita = LP } = {}) => {
    const s = [];
    for (const k of ORDEM) {
      const g = cat[k];
      s.push(simbolo(k, 11, y - 5));
      s.push(texto(32, y, L(g.rotulo, g.rotulo_en), { tamanho, fonte: SERIF }));
      if (numeros) s.push(texto(direita, y, nf(g.municipios), { tamanho: 13, cor: CINZA, anc: 'end' }));
      y += 25;
    }
    return { svg: s.join('\n'), y };
  };
  const circulos = (y, x = 0) => legendaCirculos([12000, 4000, 500], raio, (v) => L(`${nf(v)} t/ano`, `${nf(v)} t/yr`), { y, x, cor: CINZA, tamanho: 14 });
  const CORES_UF = { MA: '#9c4a32', PI: '#d6a96a', TO: '#7d8a3c', outras: '#b9bdc1' };
  const NOMES_UF = { MA: ['Maranhão', 'Maranhão'], PI: ['Piauí', 'Piauí'], TO: ['Tocantins', 'Tocantins'], outras: ['outras UFs', 'other states'] };
  return () => ({
    layout: 'um',
    motivo: 'agro',
    serie: serie(2),
    titulo: () => L('Menos coco quebrado', 'Fewer nuts cracked'),
    subtitulo: () => L(`A amêndoa de babaçu caiu ${pc(queda)} desde ${c.pico_ano}, sem que caísse o número de municípios`,
      `Babassu kernel output is down ${pc(queda)} since ${c.pico_ano}, yet no fewer towns gather it`),
    descricao: () => L(
      `Amêndoa de babaçu extraída por município: média anual de ${c.b} (disco) contra a de ${c.a} (anel), com a categoria da mudança`,
      `Babassu kernels gathered by municipality: yearly average for ${c.b} (disc) against ${c.a} (ring), coloured by the kind of change`),
    mapa: () => ({
      preencher: () => FUNDO,
      bordaMunicipio: 0.9,
      bordaUnidadeCor: BORDA_UF,
      semRgint: true,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      pontos,
      chamadas: [{
        coord: codo.coord, dx: 60, dy: -210,
        titulo: L(`CODÓ (MA) · ${mil(codo.a, 1)} MIL → ${nf(codo.b)} T`, `CODÓ (MA) · ${mil(codo.a, 1)} K → ${nf(codo.b)} T`),
        linhas: L([`por ano, de ${c.a} a ${c.b};`, 'o maior quebrador de coco do país'], [`a year, from ${c.a} to ${c.b};`, 'the country’s largest babassu town']),
      }, {
        coord: toc.coord, dx: -260, dy: 300,
        titulo: L(`TOCANTINS · −${pc((1 - to.b / to.a) * 100, 1)}`, `TOCANTINS · −${pc((1 - to.b / to.a) * 100, 1)}`),
        linhas: L([`${mil(to.a, 1)} mil t/ano em ${c.a}, ${nf(to.b)} em ${c.b};`, `Tocantinópolis, ${mil(toc.a)} mil → ${nf(toc.b)} t`],
          [`${mil(to.a, 1)} k t/yr in ${c.a}, ${nf(to.b)} in ${c.b};`, `Tocantinópolis, ${mil(toc.a)} k → ${nf(toc.b)} t`]),
      }],
    }),
    reservas: () => [[LEG.x - 10, LEG.y - 10, LEG.x + LEG.w + 10, LEG.y + LEG.h + 10]],
    sobreMapaPrancha: () => {
      const s = [`<rect x="${LEG.x}" y="${LEG.y}" width="${LEG.w}" height="${LEG.h}" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1.2"/>`,
        `<g transform="translate(${LEG.x + 18} ${LEG.y + 30})">`,
        rotuloPainel(L(`POR MUNICÍPIO, ${c.a} → ${c.b}`, `BY MUNICIPALITY, ${c.a} → ${c.b}`), 0)];
      const dir = LEG.w - 36;
      const k = categorias(32, { numeros: true, direita: dir });
      s.push(k.svg);
      s.push(texto(dir, k.y - 2, L('municípios', 'municipalities'), { tamanho: 11, cor: CINZA, anc: 'end' }));
      s.push(texto(0, k.y - 2, L(`anel: média ${c.a} · disco: ${c.b}`, `ring: ${c.a} mean · disc: ${c.b}`), { tamanho: 11, cor: CINZA }));
      s.push(circulos(k.y + 18).svg, '</g>');
      return s.join('\n');
    },
    legendaFigura: () => {
      const s = [rotuloPainel(L('AMÊNDOA DE BABAÇU POR MUNICÍPIO', 'BABASSU KERNELS BY MUNICIPALITY'), 0)];
      const k = categorias(28);
      s.push(k.svg);
      s.push(texto(0, k.y, L(`anel: média ${c.a} · disco: ${c.b}`, `ring: ${c.a} mean · disc: ${c.b}`), { tamanho: 12.5, cor: CINZA }));
      const lc = circulos(k.y + 22);
      s.push(lc.svg);
      return { svg: s.join('\n'), altura: k.y + 22 + lc.altura, largura: 400, canto: 'sw' };
    },
    numeros: () => [
      [`−${pc(queda)}`, [L(`de amêndoa desde ${c.pico_ano}`, `in kernels since ${c.pico_ano}`), L(`(${mil(c.pico_t)} mil → ${mil(c.t_2025, 1)} mil t)`, `(${mil(c.pico_t)} k → ${mil(c.t_2025, 1)} k t)`)]],
      [nf(c.mun_2025), [L('municípios ainda declaram', 'towns still report babassu'), L(`babaçu (${c.mun_1986} em 1986)`, `(${c.mun_1986} in 1986)`)]],
      [L(`${nf(c.tpm_2025)} t`, `${nf(c.tpm_2025)} t`), [L('por município em 2025;', 'per town in 2025;'), L(`eram ${nf(c.tpm_1986)} t em 1986`, `${nf(c.tpm_1986)} t in 1986`)]],
      [pc(c.ma_pct_2025), [L('da amêndoa vem do Maranhão', 'of kernels come from Maranhão'), L(`(${pc(c.ma_pct_1986)} em 1986)`, `(${pc(c.ma_pct_1986)} in 1986)`)]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('AMÊNDOA DE BABAÇU POR UF · MIL T', 'BABASSU KERNELS BY STATE · K T'), y)];
      y += 22;
      // Áreas empilhadas por UF.
      const h = 150;
      const x0 = 44;
      const w = LP - 40;
      const X = (a) => x0 + ((a - 1986) / (2025 - 1986)) * (w - x0);
      const Y = (v) => y + h - (v / 210000) * h;
      for (let v = 0; v <= 200000; v += 50000) {
        s.push(`<path d="M${x0} ${f1(Y(v))}H${w}" stroke="#d5d9dd" stroke-width=".8"/>`);
        s.push(texto(x0 - 6, Y(v) + 4, mil(v), { tamanho: 11, cor: CINZA, anc: 'end' }));
      }
      const grupos = ['MA', 'PI', 'TO', 'outras'];
      const base = c.serie.map(() => 0);
      for (const g of grupos) {
        const topo = c.serie.map((a, i) => base[i] + a[g]);
        const d = `${c.serie.map((a, i) => `${i ? 'L' : 'M'}${f1(X(a.ano))} ${f1(Y(topo[i]))}`).join('')}${[...c.serie].reverse().map((a, j) => `L${f1(X(a.ano))} ${f1(Y(base[c.serie.length - 1 - j]))}`).join('')}Z`;
        s.push(`<path d="${d}" fill="${CORES_UF[g]}" fill-opacity=".9" stroke="${PAPEL}" stroke-width=".5"/>`);
        topo.forEach((v, i) => { base[i] = v; });
      }
      for (const a of [1986, 1995, 2005, 2015, 2025]) s.push(texto(X(a), y + h + 16, String(a), { tamanho: 11, cor: CINZA, anc: 'middle' }));
      s.push(texto(X(c.pico_ano) + 4, Y(c.pico_t) - 6, `${mil(c.pico_t)}`, { tamanho: 12 }));
      s.push(texto(X(2025) - 2, Y(c.t_2025) - 6, mil(c.t_2025, 1), { tamanho: 12, anc: 'end' }));
      y += h + 34;
      grupos.forEach((g, i) => {
        const xx = i * (LP / 4);
        s.push(`<rect x="${xx}" y="${y - 10}" width="16" height="12" fill="${CORES_UF[g]}"/>`);
        s.push(texto(xx + 22, y, L(...NOMES_UF[g]), { tamanho: 12.5, fonte: SERIF }));
      });
      y += 36;
      // Os maiores municípios de 1986–1990 e o que restou.
      s.push(rotuloPainel(L(`OS MAIORES DE ${c.a} · T POR ANO`, `THE LARGEST IN ${c.a} · T A YEAR`), y));
      y += 24;
      const xb = 230;
      const wb = LP - xb - 120;
      const max = c.top_a[0].a;
      for (const m of c.top_a) {
        s.push(texto(0, y, nomeMun(m), { tamanho: 12 }));
        s.push(`<rect x="${xb}" y="${y - 10}" width="${f1((m.a / max) * wb)}" height="12" fill="none" stroke="${TINTA}" stroke-width=".8"/>`);
        s.push(`<rect x="${xb}" y="${y - 10}" width="${f1(Math.max((m.b / max) * wb, 1))}" height="12" fill="${cat.caiu90.cor}"/>`);
        s.push(texto(LP, y, `${nf(m.a)} → ${nf(m.b)}`, { tamanho: 11.5, anc: 'end' }));
        y += 19;
      }
      s.push(texto(0, y + 6, L(`contorno: ${c.a} · cheio: ${c.b}`, `outline: ${c.a} · filled: ${c.b}`), { tamanho: 11, cor: CINZA }));
      y += 30;
      return { svg: s.join('\n'), y };
    },
    fontes: () => [PEVS(), MALHA()],
  });
}

/* ------------------------------------------------------------------ 3 carvão da mata, carvão plantado */
async function carvao() {
  const c = await ler('carvao');
  const NAT = '#9c4a32';
  const PLA = '#3f5a2a';
  const raio = (v) => 0.9 + 0.036 * Math.sqrt(v);
  const pts = (lista, cor) => lista.filter((p) => p[2] >= 200).map(([lon, lat, v]) => ({ coord: [lon, lat], r: raio(v), cor, opacidade: 0.75, bordaLargura: 0.4 }));
  const legenda = (cor, titulo) => {
    const s = [texto(0, -26, titulo, { tamanho: 12, cor: CINZA })];
    let x = 0;
    for (const v of [200000, 50000, 10000]) {
      const r = raio(v);
      s.push(`<circle cx="${f1(x + r)}" cy="${f1(18 - r)}" r="${f1(r)}" fill="${cor}" fill-opacity=".75" stroke="${PAPEL}" stroke-width=".5"/>`);
      s.push(texto(x + 2 * r + 6, 14, L(`${mil(v)} mil t`, `${mil(v)} k t`), { tamanho: 12 }));
      x += 2 * r + 96;
    }
    return s.join('\n');
  };
  const mapa = (titulo, pontos, leg) => ({
    titulo, pad: 56, preencher: () => FUNDO, bordaMunicipio: 0.8, bordaUnidadeCor: '#aab2b9', semRgint: true, tamanhoUnidade: 10, pontos, legenda: leg,
  });
  const uf = Object.fromEntries(c.ufs.map((u) => [u.uf, u]));
  const mg = uf.MG;
  const frente = ['MA', 'PA', 'PI', 'TO'].reduce((a, k) => a + (uf[k]?.nb ?? 0), 0);
  const cruzou = c.ultimo_ano_nativo_maior + 1;
  return () => ({
    layout: 'quatro',
    motivo: 'agro',
    serie: serie(3),
    titulo: () => L('Carvão da mata, carvão plantado', 'Native wood, planted wood'),
    subtitulo: () => L(`Em 1986, ${pc(c.pct_nat_1986)} do carvão vegetal vinha da mata nativa; em 2025, ${pc(c.pct_nat_2025)}`,
      `In 1986, ${pc(c.pct_nat_1986)} of Brazil’s charcoal came from native forest; in 2025, ${pc(c.pct_nat_2025)}`),
    descricao: () => L(
      `Carvão vegetal por município, média anual: da extração vegetal (mata nativa) em ${c.a} e em ${c.b}, e da silvicultura (floresta plantada) em ${c.b}`,
      `Charcoal by municipality, yearly average: from plant extraction (native forest) in ${c.a} and ${c.b}, and from silviculture (planted forest) in ${c.b}`),
    mapas: () => [
      mapa(L(`DA MATA NATIVA · ${c.a}`, `NATIVE FOREST · ${c.a}`), pts(c.nativo_a, NAT), legenda(NAT, L('t por ano, média do período', 't a year, period average'))),
      mapa(L(`DA MATA NATIVA · ${c.b}`, `NATIVE FOREST · ${c.b}`), pts(c.nativo_b, NAT), legenda(NAT, L('t por ano, média do período', 't a year, period average'))),
      mapa(L(`DE FLORESTA PLANTADA · ${c.b}`, `PLANTED FOREST · ${c.b}`), pts(c.plantado_b, PLA), legenda(PLA, L('t por ano, média do período', 't a year, period average'))),
    ],
    quartoQuadro: (w) => {
      const s = [rotuloPainel(L('CARVÃO VEGETAL NO PAÍS · MI T', 'CHARCOAL IN BRAZIL · M T'), 0)];
      const g = linhas({
        x0: 40, y0: 18, w: w - 60, h: 250, anos: [1986, 2025], ymax: 7500000, passoY: 1500000, rotY: (v) => mi(v, 1), marcasX: [1986, 1995, 2005, 2015, 2025],
        series: [
          { pts: c.serie.map((a) => [a.ano, a.pla]), cor: PLA, largura: 2.6 },
          { pts: c.serie.map((a) => [a.ano, a.nat]), cor: NAT, largura: 2.6 },
        ],
      });
      s.push(g.svg);
      const a25 = c.serie.at(-1);
      s.push(texto(g.X(2025) + 6, g.Y(a25.pla) + 4, mi(a25.pla, 1), { tamanho: 12.5, cor: PLA }));
      s.push(texto(g.X(2025) + 6, g.Y(a25.nat) + 4, mi(a25.nat, 2), { tamanho: 12.5, cor: NAT }));
      s.push(texto(g.X(2010), g.Y(6400000), L('floresta plantada', 'planted forest'), { tamanho: 13, cor: PLA, anc: 'middle', fonte: SERIF }));
      s.push(texto(g.X(1993), g.Y(c.pico_t) - 8, L('mata nativa', 'native forest'), { tamanho: 13, cor: NAT, fonte: SERIF }));
      // Último ano com mais carvão nativo que plantado.
      const xa = g.X(c.ultimo_ano_nativo_maior);
      s.push(`<path d="M${f1(xa)} ${f1(g.Y(0))}V${f1(g.Y(4700000))}" stroke="${TINTA}" stroke-width=".8" stroke-dasharray="3 3"/>`);
      s.push(texto(xa - 6, g.Y(4900000), L(`${c.ultimo_ano_nativo_maior}: última vez`, `${c.ultimo_ano_nativo_maior}: last year`), { tamanho: 11.5, anc: 'end' }));
      s.push(texto(xa - 6, g.Y(4900000) + 15, L('que a mata deu mais', 'native beat planted'), { tamanho: 11.5, anc: 'end' }));
      s.push(texto(g.X(1987) + 8, g.Y(c.pla_1987) + 4, L('1987: dado atípico de MG*', '1987: odd MG figure*'), { tamanho: 11, cor: CINZA }));
      s.push(texto(0, 18 + 250 + 40, L('* Bom Despacho (MG) declarou 2,9 mi t num só ano.', '* Bom Despacho (MG) reported 2.9 M t in a single year.'), { tamanho: 11, cor: CINZA }));
      return s.join('\n');
    },
    numeros: () => [
      [pc(c.pct_nat_2025, 1), [L('do carvão de 2025 veio', 'of 2025 charcoal came'), L(`da mata nativa (${pc(c.pct_nat_1986)} em 1986)`, `from native forest (${pc(c.pct_nat_1986)} in 1986)`)]],
      [`−${pc((1 - c.nat_2025 / c.pico_t) * 100)}`, [L(`de carvão nativo desde ${c.pico_ano}`, `in native charcoal since ${c.pico_ano}`), L(`(${mi(c.pico_t, 2)} → ${mi(c.nat_2025, 2)} mi t)`, `(${mi(c.pico_t, 2)} → ${mi(c.nat_2025, 2)} M t)`)]],
      [L(`${mi(mg.na, 2)} mi t`, `${mi(mg.na, 2)} M t`), [L(`nativas por ano em MG, ${c.a};`, `native a year in MG, ${c.a};`), L(`${mil(mg.nb, 1)} mil t em ${c.b}`, `${mil(mg.nb, 1)} k t in ${c.b}`)]],
      [pc((frente / c.nat_b) * 100), [L('do carvão nativo de 2021–25', 'of 2021–25 native charcoal'), L('veio de MA, PA, PI e TO', 'came from MA, PA, PI and TO')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('POR UF · MIL T POR ANO', 'BY STATE · K T A YEAR'), y)];
      y += 26;
      const cols = [[0, 'start', 'UF'], [170, 'end', L(`mata ${c.a.slice(2, 4)}–${c.a.slice(-2)}`, `native ${c.a.slice(2, 4)}–${c.a.slice(-2)}`)],
        [300, 'end', L(`mata ${c.b.slice(2, 4)}–${c.b.slice(-2)}`, `native ${c.b.slice(2, 4)}–${c.b.slice(-2)}`)], [LP, 'end', L(`plantado ${c.b.slice(2, 4)}–${c.b.slice(-2)}`, `planted ${c.b.slice(2, 4)}–${c.b.slice(-2)}`)]];
      for (const [x, anc, t] of cols) s.push(texto(x, y, t, { tamanho: 11.5, cor: CINZA, anc }));
      y += 22;
      const lista = [...c.ufs].sort((a, b) => b.na + b.nb + b.pb - (a.na + a.nb + a.pb)).slice(0, 12);
      for (const u of lista) {
        s.push(texto(0, y, u.uf, { tamanho: 13 }));
        s.push(texto(170, y, mil(u.na, u.na < 10000 ? 1 : 0), { tamanho: 13, anc: 'end', cor: NAT }));
        s.push(texto(300, y, mil(u.nb, u.nb < 10000 ? 1 : 0), { tamanho: 13, anc: 'end', cor: NAT }));
        s.push(texto(LP, y, mil(u.pb, u.pb < 10000 ? 1 : 0), { tamanho: 13, anc: 'end', cor: PLA }));
        y += 20;
      }
      y += 8;
      const a = c.top_nat_b[0];
      const b = c.top_pla_b[0];
      const notas = L([
        `O maior carvão nativo de ${c.b} sai de ${a.nome} (${a.uf}),`,
        `${mil(a.v, 1)} mil t/ano; o maior plantado, de ${b.nome} (${b.uf}),`,
        `${mil(b.v)} mil t/ano. 12 UFs com mais carvão no período.`,
      ], [
        `The largest native charcoal of ${c.b} comes from ${a.nome} (${a.uf}),`,
        `${mil(a.v, 1)} k t/yr; the largest planted, from ${b.nome} (${b.uf}),`,
        `${mil(b.v)} k t/yr. The 12 states with the most charcoal shown.`,
      ]);
      for (const l of notas) { s.push(texto(0, y, l, { tamanho: 12 })); y += 18; }
      return { svg: s.join('\n'), y };
    },
    fontes: () => [PEVS(), MALHA()],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { acai, babacu, carvao };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/${COL}/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
await usarBrasil();
const e = SERIE.find((s) => s.tema === nome);
const fazer = await TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => comOceano(fazer()) });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `${COL}-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
