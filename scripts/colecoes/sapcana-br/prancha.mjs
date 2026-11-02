#!/usr/bin/env node
/**
 * Coleção «A safra de cada estado» (Brasil) — desenha uma prancha a partir do cache de preparar.py (uso interno).
 *
 *   node scripts/colecoes/sapcana-br/prancha.mjs safras|acucar|calendario
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  RAIZ, LP, SERIF, MONO, CINZA, PAPEL, TINTA, esc, nf, f1, lingua, halo,
  gerarPrancha, rotuloPainel, usarBrasil,
} from '../lib/prancha-sp.mjs';
import { legendaCirculos } from '../lib/arte.mjs';

export const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'sapcana-br', 'serie.json'), 'utf8'));
const TOTAL = 3; // pranchas da coleção
const BORDA_UF = '#c9ced3';

const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `sapcana-br-${nome}.json`), 'utf8'));
const L = (pt, en) => (lingua() === 'en' ? en : pt);
const serie = (i) => () => L(`A SAFRA DE CADA ESTADO · ${i}/${TOTAL}`, `EACH STATE’S CANE HARVEST · ${i}/${TOTAL}`);
const mi = (v, casas = 1) => nf(v / 1e6, casas);
const pc = (v, casas = 0) => `${nf(v, casas)} %`;
const sinal = (v, fmt) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${fmt(Math.abs(v))}`;
const MAPA_SAP = () => L('MAPA, SAPCana: produção sucroalcooleira (2026)', 'MAPA, SAPCana sugar and ethanol reports (2026)');
const MALHA = () => L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025');
const MESES = { pt: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] };
const mes = (m) => MESES[lingua() === 'en' ? 'en' : 'pt'][m - 1];
const caixa = (cor, rot, y, { passo = 25, x = 0, borda = BORDA_UF, tamanho = 16 } = {}) => `<rect x="${x}" y="${y}" width="34" height="${passo - 8}" fill="${cor}" stroke="${borda}" stroke-width=".8"/>
<text x="${x + 48}" y="${y + passo - 12}" font-family="${SERIF}" font-size="${tamanho}">${esc(rot)}</text>`;
const texto = (x, y, t, { tamanho = 12.5, cor = TINTA, anc = 'start', fonte = MONO, extra = '' } = {}) =>
  `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anc}" font-family="${fonte}" font-size="${tamanho}" fill="${cor}" ${extra}>${esc(t)}</text>`;
const NOME_UF = {
  SP: ['São Paulo', 'São Paulo'], MT: ['Mato Grosso', 'Mato Grosso'], AL: ['Alagoas', 'Alagoas'], MA: ['Maranhão', 'Maranhão'],
};
const nomeUf = (u) => L(...NOME_UF[u]);
/** Hachura de «etanol além da cana» (mesma da prancha 2), para legendas. */
const HACH = '#3b2a12';
const padraoHachura = (id) => `<defs><pattern id="${id}" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-55)"><rect width="5" height="5" fill="none"/><path d="M0 0V5" stroke="${HACH}" stroke-width="1.1" stroke-opacity=".75"/></pattern></defs>`;

/* ------------------------------------------------------------------ 1 três safras, menos cana */
async function safras() {
  const c = await ler('safras');
  const COR = Object.fromEntries(c.categorias.map((k) => [k.chave, k.cor]));
  const cat = Object.fromEntries(c.categorias.map((k) => [k.chave, k]));
  const porUf = Object.fromEntries(c.ufs.map((u) => [u.uf, u]));
  const tem = new Set(c.ufs.map((u) => u.uf));
  const [s23, s24, s25] = c.safras;
  // Raio dos círculos de cana moída (t).
  const raio = (v) => 2 + 3.3 * Math.sqrt(v / 1e6);
  const pontos = [];
  for (const u of c.ufs) {
    pontos.push({ coord: [u.lon, u.lat], r: raio(u.c25), cor: COR[u.cat], opacidade: 0.86, bordaLargura: 0.9 });
    if (u.cat !== 'igual') pontos.push({ coord: [u.lon, u.lat], r: raio(u.c23), cor: TINTA, anel: true, largura: 1.1 });
  }
  const sp = porUf.SP;
  const d = c.br[s25] - c.br[s23];
  const co = ['GO', 'MS', 'MT'].reduce((a, k) => a + porUf[k].d, 0);
  const mensal = (k) => c.curvas[k].map((v, i, a) => (i ? v - a[i - 1] : v));
  const m23 = mensal(s23);
  const m25 = mensal(s25);
  // Novembro e dezembro (índices 7 e 8 da safra abril–março).
  const nd = m25[7] + m25[8] - (m23[7] + m23[8]);
  const dOut = c.dif_acumulada[6];
  const dDez = c.dif_acumulada[8];
  const LEG = { x: 40, y: 1250, w: 450, h: 316 };
  const ORDEM = ['subiu', 'igual', 'caiu', 'despencou'];
  const simbolo = (k, cx, cy) => {
    const g = cat[k];
    if (k === 'subiu') return `<circle cx="${cx}" cy="${cy}" r="9" fill="${g.cor}" fill-opacity=".86" stroke="${PAPEL}" stroke-width=".7"/><circle cx="${cx}" cy="${cy}" r="5.5" fill="none" stroke="${TINTA}"/>`;
    if (k === 'igual') return `<circle cx="${cx}" cy="${cy}" r="8" fill="${g.cor}" fill-opacity=".86" stroke="${PAPEL}" stroke-width=".7"/>`;
    return `<circle cx="${cx}" cy="${cy}" r="9" fill="none" stroke="${TINTA}"/><circle cx="${cx}" cy="${cy}" r="${k === 'caiu' ? 6.5 : 4.5}" fill="${g.cor}" fill-opacity=".86" stroke="${PAPEL}" stroke-width=".7"/>`;
  };
  const circulos = (y, x = 0) => legendaCirculos([300e6, 50e6, 5e6], raio, (v) => L(`${mi(v, 0)} mi t`, `${mi(v, 0)} M t`), { y, x, cor: CINZA, tamanho: 14 });
  const categorias = (y, { tamanho = 16, numeros = false, direita = LP } = {}) => {
    const s = [];
    for (const k of ORDEM) {
      const g = cat[k];
      s.push(simbolo(k, 12, y - 6));
      s.push(texto(32, y, L(g.rotulo, g.rotulo_en), { tamanho, fonte: SERIF }));
      if (numeros) {
        s.push(texto(direita - 100, y, nf(g.ufs), { tamanho: 13, cor: CINZA, anc: 'end' }));
        s.push(texto(direita, y, sinal(g.d, (v) => mi(v, 1)), { tamanho: 13, anc: 'end' }));
      }
      y += 25;
    }
    return { svg: s.join('\n'), y };
  };
  return () => ({
    layout: 'um',
    motivo: 'cana',
    serie: serie(1),
    titulo: () => L('Três safras, menos cana', 'Three harvests, less cane'),
    subtitulo: () => L('O país moeu 48 milhões de toneladas a menos, e São Paulo responde por 86 % da queda',
      'Brazil crushed 48 million tonnes less, and São Paulo accounts for 86% of the drop'),
    descricao: () => L(
      `Cana moída por UF nas safras ${s23} (anel) e ${s25} (disco), segundo os relatórios mensais do SAPCana, com a cor pela variação entre as duas`,
      `Cane crushed by state in the ${s23} (ring) and ${s25} (disc) harvests, from the monthly SAPCana reports, coloured by the change between them`),
    mapa: () => ({
      preencher: (s) => (tem.has(s) ? '#eef0ea' : PAPEL),
      bordaMunicipio: 0.9,
      bordaUnidadeCor: BORDA_UF,
      semRgint: false,
      bordaRgint: 1.2,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      pontos,
      chamadas: [{
        coord: [sp.lon, sp.lat], dx: 300, dy: 70,
        titulo: L(`SÃO PAULO · ${sinal(sp.d, (v) => mi(v, 1))} MI T (${sinal(sp.p, (v) => nf(v, 1))} %)`,
          `SÃO PAULO · ${sinal(sp.d, (v) => mi(v, 1))} M T (${sinal(sp.p, (v) => nf(v, 1))}%)`),
        linhas: L([`de ${mi(sp.c23, 1)} para ${mi(sp.c25, 1)} milhões de toneladas;`, `${pc((sp.d / d) * 100)} da cana que o país deixou de moer`],
          [`from ${mi(sp.c23, 1)} to ${mi(sp.c25, 1)} million tonnes;`, `${pc((sp.d / d) * 100)} of the cane Brazil stopped crushing`]),
      }, {
        coord: [porUf.MT.lon, porUf.MT.lat], dx: -330, dy: -170,
        titulo: L(`GO, MS E MT · ${sinal(co, (v) => mi(v, 1))} MI T`, `GO, MS AND MT · ${sinal(co, (v) => mi(v, 1))} M T`),
        linhas: L(['o Centro-Oeste moeu um pouco mais', `que em ${s23}`], ['the Centre-West crushed a little more', `than in ${s23}`]),
      }],
    }),
    reservas: () => [[LEG.x - 10, LEG.y - 10, LEG.x + LEG.w + 10, LEG.y + LEG.h + 10]],
    sobreMapa: () => {
      const s = [`<rect x="${LEG.x}" y="${LEG.y}" width="${LEG.w}" height="${LEG.h}" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1.2"/>`];
      s.push(`<g transform="translate(${LEG.x + 18} ${LEG.y + 30})">`);
      s.push(rotuloPainel(L(`CANA MOÍDA POR UF, ${s23} → ${s25}`, `CANE CRUSHED BY STATE, ${s23} → ${s25}`), 0));
      const dir = LEG.w - 36;
      const k = categorias(32, { numeros: true, direita: dir });
      s.push(k.svg);
      s.push(texto(dir - 100, k.y, L('UFs', 'states'), { tamanho: 11, cor: CINZA, anc: 'end' }));
      s.push(texto(dir, k.y, L('Δ mi t', 'Δ M t'), { tamanho: 11, cor: CINZA, anc: 'end' }));
      s.push(texto(0, k.y, L(`anel: ${s23} · disco: ${s25}`, `ring: ${s23} · disc: ${s25}`), { tamanho: 11, cor: CINZA }));
      s.push(circulos(k.y + 24).svg, '</g>');
      return s.join('\n');
    },
    sobreMapaFigura: false,
    legendaFigura: () => {
      const s = [rotuloPainel(L('CANA MOÍDA POR UF', 'CANE CRUSHED BY STATE'), 0)];
      const k = categorias(28);
      s.push(k.svg);
      let y = k.y;
      s.push(texto(0, y + 2, L(`anel: ${s23} · disco: ${s25}`, `ring: ${s23} · disc: ${s25}`), { tamanho: 12.5, cor: CINZA }));
      y += 26;
      const lc = circulos(y);
      s.push(lc.svg);
      return { svg: s.join('\n'), altura: y + lc.altura, largura: 360, canto: 'sw' };
    },
    numeros: () => [
      [L(`${mi(c.br[s25], 1)} mi t`, `${mi(c.br[s25], 1)} M t`), [L(`de cana moída em ${s25}`, `of cane crushed in ${s25}`), L(`(${mi(c.br[s23], 1)} mi t em ${s23})`, `(${mi(c.br[s23], 1)} M t in ${s23})`)]],
      [sinal((c.br[s25] / c.br[s23] - 1) * 100, (v) => pc(v, 1)), [L(`ou ${mi(-d, 1)} mi t a menos`, `or ${mi(-d, 1)} M t less`), L(`que em ${s23}`, `than in ${s23}`)]],
      [pc((sp.d / d) * 100), [L('da queda veio de São Paulo', 'of the drop came from São Paulo'), L(`(${sinal(sp.p, (v) => pc(v, 1))} no estado)`, `(${sinal(sp.p, (v) => pc(v, 1))} in the state)`)]],
      [L(`${mi(-nd, 0)} mi t`, `${mi(-nd, 0)} M t`), [L('a menos só em novembro', 'less in November and'), L(`e dezembro de 2025`, `December 2025 alone`)]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('CANA MOÍDA POR UF · MILHÕES DE T', 'CANE CRUSHED BY STATE · MILLION T'), y)];
      y += 26;
      const xs = [[34, s23], [104, s24], [174, s25]];
      s.push(texto(0, y, 'UF', { tamanho: 11.5, cor: CINZA }));
      for (const [x, t] of xs) s.push(texto(x + 36, y, t, { tamanho: 11.5, cor: CINZA, anc: 'end' }));
      // Barras de variação (%) em torno de um eixo.
      const x0 = 330;
      const esc_ = 5.2; // px por ponto percentual
      s.push(texto(x0, y, L('variação, %', 'change, %'), { tamanho: 11.5, cor: CINZA, anc: 'middle' }));
      y += 20;
      const y0 = y;
      for (const u of c.ufs) {
        s.push(texto(0, y, u.uf, { tamanho: 12.5 }));
        s.push(texto(70, y, mi(u.c23, 1), { tamanho: 12, anc: 'end', cor: CINZA }));
        s.push(texto(140, y, mi(u.c24, 1), { tamanho: 12, anc: 'end', cor: CINZA }));
        s.push(texto(210, y, mi(u.c25, 1), { tamanho: 12, anc: 'end' }));
        const w = Math.max(-80, Math.min(80, u.p * esc_));
        s.push(`<rect x="${f1(w < 0 ? x0 + w : x0)}" y="${y - 10}" width="${f1(Math.max(Math.abs(w), 1))}" height="11" fill="${COR[u.cat]}"/>`);
        s.push(texto(LP, y, sinal(u.p, (v) => nf(v, 1)), { tamanho: 12, anc: 'end' }));
        y += 17;
      }
      s.push(`<path d="M${x0} ${y0 - 14}V${y - 10}" stroke="${TINTA}" stroke-width=".8"/>`);
      y += 4;
      s.push(texto(0, y, L(`barras cortadas em ±15 %. Safra de abril a março.`, `bars clipped at ±15%. Season from April to March.`), { tamanho: 11, cor: CINZA }));
      y += 34;
      // A distância acumulada entre 2025/26 e 2023/24, mês a mês.
      s.push(rotuloPainel(L(`${s25} MENOS ${s23}, ACUMULADO · MI T`, `${s25} MINUS ${s23}, CUMULATIVE · M T`), y));
      y += 16;
      const h = 80;
      const minD = Math.min(...c.dif_acumulada);
      const bw = (LP - 40) / 12;
      const Y = (v) => y + (v / minD) * h;
      s.push(`<path d="M40 ${y}H${LP}" stroke="${TINTA}" stroke-width=".8"/>`);
      for (const v of [-20, -40]) {
        s.push(`<path d="M40 ${f1(Y(v * 1e6))}H${LP}" stroke="#d5d9dd" stroke-width=".8"/>`);
        s.push(texto(32, Y(v * 1e6) + 4, `${v}`.replace('-', '−'), { tamanho: 11, cor: CINZA, anc: 'end' }));
      }
      s.push(texto(32, y + 4, '0', { tamanho: 11, cor: CINZA, anc: 'end' }));
      c.dif_acumulada.forEach((v, i) => {
        const x = 40 + i * bw + 3;
        s.push(`<rect x="${f1(x)}" y="${f1(Math.min(y, Y(v)))}" width="${f1(bw - 6)}" height="${f1(Math.max(Math.abs(Y(v) - y), 1))}" fill="${i >= 7 ? COR.despencou : COR.caiu}"/>`);
        s.push(texto(x + (bw - 6) / 2, y + h + 22, mes(Number(c.meses[i])), { tamanho: 10.5, cor: CINZA, anc: 'middle' }));
      });
      s.push(texto(40 + 6 * bw + bw / 2, Y(dOut) + 16, mi(dOut, 0).replace('-', '−'), { tamanho: 12, anc: 'middle' }));
      s.push(texto(40 + 8 * bw + bw / 2, Y(dDez) + 15, mi(dDez, 0).replace('-', '−'), { tamanho: 12, anc: 'middle' }));
      y += h + 30;
      return { svg: s.join('\n'), y };
    },
    fontes: () => [MAPA_SAP(), MALHA()],
  });
}

/* ------------------------------------------------------------------ 2 açúcar ou etanol */
async function acucar() {
  const c = await ler('acucar');
  const COR = Object.fromEntries(c.classes.map((k) => [k.classe, k.cor]));
  const porUf = Object.fromEntries(c.ufs.map((u) => [u.uf, u]));
  const alem = new Set(c.ufs.filter((u) => u.alem).map((u) => u.uf));
  const sp = porUf.SP;
  const mt = porUf.MT;
  const ma = porUf.MA;
  const b23 = c.br['2023/24'];
  const b25 = c.br['2025/26'];
  const acBr = b25.acucar_t;
  const caBr = b25.cana_t;
  const LEG = { x: 40, y: 1316, w: 450, h: 252 };
  const itens = () => [...c.classes].reverse().map((k) => [k.cor, L(k.rotulo, k.rotulo_en)]);
  const legenda = (y0, { tamanho = 15, passo = 24 } = {}) => {
    const s = [padraoHachura('hlegA')];
    let y = y0;
    for (const [cor, rot] of itens()) { s.push(caixa(cor, rot, y, { passo, tamanho })); y += passo; }
    s.push(caixa(c.sem_cana, L('sem cana moída', 'no cane crushed'), y, { passo, tamanho })); y += passo;
    y += 10;
    s.push(`<rect x="0" y="${y}" width="34" height="${passo - 8}" fill="url(#hlegA)" stroke="${BORDA_UF}" stroke-width=".8"/>`);
    s.push(texto(48, y + passo - 12, L(`etanol acima de ${c.teto} L por t de cana`, `ethanol above ${c.teto} L per t of cane`), { tamanho, fonte: SERIF }));
    y += passo;
    s.push(texto(48, y + passo - 14, L('(mais do que a cana rende: milho)', '(more than cane can yield: corn)'), { tamanho: tamanho - 2, fonte: SERIF, cor: CINZA }));
    y += passo;
    return { svg: s.join('\n'), y };
  };
  return () => ({
    layout: 'um',
    motivo: 'cana',
    serie: serie(2),
    titulo: () => L('Açúcar ou etanol', 'Sugar or ethanol'),
    subtitulo: () => L('São Paulo tira 76 kg de açúcar de cada tonelada de cana; Goiás, 39; Tocantins, nenhum',
      'São Paulo gets 76 kg of sugar from each tonne of cane; Goiás 39; Tocantins none'),
    descricao: () => L(
      'Quilos de açúcar por tonelada de cana moída em cada UF na safra 2025/26, e os litros de etanol pela mesma tonelada, em 2023/24 e 2025/26',
      'Kilograms of sugar per tonne of cane crushed in each state in the 2025/26 harvest, and litres of ethanol per tonne, in 2023/24 and 2025/26'),
    mapa: () => ({
      preencher: (s) => COR[c.classe_uf[s] ?? -1] ?? c.sem_cana,
      bordaMunicipio: 1,
      bordaUnidadeCor: '#aab2b9',
      semRgint: false,
      bordaRgint: 2.2,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      hachura: { cds: alem, cor: HACH, passo: 5, largura: 1.1, angulo: -55 },
      chamadas: [{
        coord: [sp.lon, sp.lat], dx: 300, dy: 70,
        titulo: L(`SÃO PAULO · ${nf(sp.kg25)} KG POR TONELADA`, `SÃO PAULO · ${nf(sp.kg25)} KG PER TONNE`),
        linhas: L([`${pc((sp.acucar / acBr) * 100)} do açúcar do país,`, `com ${pc((sp.cana / caBr) * 100)} da cana moída`],
          [`${pc((sp.acucar / acBr) * 100)} of Brazil’s sugar,`, `from ${pc((sp.cana / caBr) * 100)} of the cane crushed`]),
      }, {
        coord: [mt.lon, mt.lat], dx: -330, dy: -170,
        titulo: L(`MATO GROSSO · ${nf(mt.kg25)} KG E ${nf(mt.l25)} L`, `MATO GROSSO · ${nf(mt.kg25)} KG AND ${nf(mt.l25)} L`),
        linhas: L(['de açúcar e de etanol por tonelada de cana:', 'a maior parte do etanol vem do milho'],
          ['of sugar and of ethanol per tonne of cane:', 'most of the ethanol comes from corn']),
      }],
    }),
    reservas: () => [[LEG.x - 10, LEG.y - 10, LEG.x + LEG.w + 10, LEG.y + LEG.h + 10]],
    sobreMapa: () => {
      const s = [`<rect x="${LEG.x}" y="${LEG.y}" width="${LEG.w}" height="${LEG.h}" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1.2"/>`];
      s.push(`<g transform="translate(${LEG.x + 18} ${LEG.y + 30})">`);
      s.push(rotuloPainel(L('AÇÚCAR POR T DE CANA, 2025/26', 'SUGAR PER T OF CANE, 2025/26'), 0));
      s.push(legenda(14).svg, '</g>');
      return s.join('\n');
    },
    sobreMapaFigura: false,
    legendaFigura: () => {
      const s = [rotuloPainel(L('AÇÚCAR POR T DE CANA, 2025/26', 'SUGAR PER T OF CANE, 2025/26'), 0)];
      const l = legenda(16, { tamanho: 16, passo: 25 });
      s.push(l.svg);
      return { svg: s.join('\n'), altura: l.y, largura: 420, canto: 'sw' };
    },
    numeros: () => [
      [L(`${mi(acBr, 1)} mi t`, `${mi(acBr, 1)} M t`), [L('de açúcar em 2025/26', 'of sugar in 2025/26'), L(`(${mi(b23.acucar_t, 1)} mi t em 2023/24)`, `(${mi(b23.acucar_t, 1)} M t in 2023/24)`)]],
      [pc((sp.acucar / acBr) * 100), [L('do açúcar saiu de São Paulo,', 'of the sugar came from São Paulo,'), L(`que moeu ${pc((sp.cana / caBr) * 100)} da cana`, `which crushed ${pc((sp.cana / caBr) * 100)} of the cane`)]],
      [L(`${nf((acBr / caBr) * 1000)} kg`, `${nf((acBr / caBr) * 1000)} kg`), [L('de açúcar por t no país', 'of sugar per t in Brazil'), L(`(${nf((b23.acucar_t / b23.cana_t) * 1000)} kg em 2023/24)`, `(${nf((b23.acucar_t / b23.cana_t) * 1000)} kg in 2023/24)`)]],
      [L(`${nf(ma.l25)} L`, `${nf(ma.l25)} L`), [L('de etanol por t de cana no MA', 'of ethanol per t of cane in MA'), L(`(${nf(ma.l23)} L em 2023/24)`, `(${nf(ma.l23)} L in 2023/24)`)]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('POR TONELADA DE CANA, 2023/24 → 2025/26', 'PER TONNE OF CANE, 2023/24 → 2025/26'), y)];
      y += 26;
      // Duas réguas: kg de açúcar (0–100) e L de etanol (0–120, cortada).
      const xa = 34;
      const wa = 250;
      const xe = xa + wa + 46;
      const we = LP - xe - 8;
      const XA = (v) => xa + (v / 100) * wa;
      const XE = (v) => xe + (Math.min(v, 120) / 120) * we;
      s.push(texto(xa, y, L('kg de açúcar', 'kg of sugar'), { tamanho: 11.5, cor: CINZA }));
      s.push(texto(xe, y, L('L de etanol', 'L of ethanol'), { tamanho: 11.5, cor: CINZA }));
      y += 18;
      const y0 = y;
      const lista = [...c.ufs].sort((a, b) => b.kg25 - a.kg25);
      for (const u of lista) {
        const cor = COR[u.classe];
        s.push(texto(0, y, u.uf, { tamanho: 12.5 }));
        s.push(`<path d="M${f1(XA(u.kg23))} ${y - 4}H${f1(XA(u.kg25))}" stroke="${CINZA}" stroke-width="1.4"/>`);
        s.push(`<circle cx="${f1(XA(u.kg23))}" cy="${y - 4}" r="3.4" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1"/>`);
        s.push(`<circle cx="${f1(XA(u.kg25))}" cy="${y - 4}" r="5" fill="${cor}" stroke="${TINTA}" stroke-width="1"/>`);
        s.push(texto(Math.max(XA(u.kg25), XA(u.kg23)) + 9, y, nf(u.kg25), { tamanho: 11.5 }));
        const corte = u.l25 > 120;
        s.push(`<path d="M${f1(XE(u.l23))} ${y - 4}H${f1(XE(u.l25))}" stroke="${CINZA}" stroke-width="1.4"/>`);
        s.push(`<circle cx="${f1(XE(u.l23))}" cy="${y - 4}" r="3.4" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1"/>`);
        s.push(`<rect x="${f1(XE(u.l25) - 4.5)}" y="${y - 8.5}" width="9" height="9" fill="${u.alem ? HACH : '#8a96a0'}" stroke="${TINTA}" stroke-width=".8"/>`);
        const tx = corte ? `${nf(u.l25)} ›` : nf(u.l25);
        s.push(texto(corte ? XE(120) - 10 : XE(Math.max(u.l25, u.l23)) + 9, corte ? y - 9 : y, tx, { tamanho: 11.5, anc: corte ? 'end' : 'start', extra: corte ? halo(3) : '' }));
        y += 17;
      }
      // Eixos.
      for (const v of [0, 50, 100]) {
        s.push(`<path d="M${f1(XA(v))} ${y0 - 12}V${y - 10}" stroke="#d5d9dd" stroke-width=".8"/>`);
        s.push(texto(XA(v), y + 4, `${v}`, { tamanho: 10.5, cor: CINZA, anc: 'middle' }));
      }
      for (const v of [0, c.teto]) {
        s.push(`<path d="M${f1(XE(v))} ${y0 - 12}V${y - 10}" stroke="${v ? HACH : '#d5d9dd'}" stroke-width=".8" ${v ? 'stroke-dasharray="3 3"' : ''}/>`);
        s.push(texto(XE(v), y + 4, `${v}`, { tamanho: 10.5, cor: CINZA, anc: 'middle' }));
      }
      y += 24;
      s.push(texto(0, y, L(`círculo/quadrado vazio: 2023/24 · cheio: 2025/26 · tracejado: ${c.teto} L/t`, `open marker: 2023/24 · filled: 2025/26 · dashed: ${c.teto} L/t`), { tamanho: 11, cor: CINZA }));
      y += 26;
      // O país em três safras.
      s.push(rotuloPainel(L('O PAÍS, SAFRA A SAFRA', 'BRAZIL, HARVEST BY HARVEST'), y));
      y += 24;
      const cols = [[0, 'start', L('safra', 'harvest')], [150, 'end', L('cana, mi t', 'cane, M t')], [260, 'end', L('açúcar', 'sugar')], [370, 'end', L('etanol, mi m³', 'ethanol, M m³')], [LP - 70, 'end', 'kg/t'], [LP, 'end', 'L/t']];
      for (const [x, anc, t] of cols) s.push(texto(x, y, t, { tamanho: 11, cor: CINZA, anc }));
      y += 20;
      for (const [k, b] of Object.entries(c.br)) {
        s.push(texto(0, y, k, { tamanho: 12.5 }));
        s.push(texto(150, y, mi(b.cana_t, 1), { tamanho: 12.5, anc: 'end' }));
        s.push(texto(260, y, mi(b.acucar_t, 1), { tamanho: 12.5, anc: 'end' }));
        s.push(texto(370, y, mi(b.etanol_m3, 1), { tamanho: 12.5, anc: 'end' }));
        s.push(texto(LP - 70, y, nf((b.acucar_t / b.cana_t) * 1000, 1), { tamanho: 12.5, anc: 'end' }));
        s.push(texto(LP, y, nf((b.etanol_m3 / b.cana_t) * 1000, 1), { tamanho: 12.5, anc: 'end' }));
        y += 18;
      }
      y += 4;
      s.push(texto(0, y, L('O etanol do SAPCana inclui o de milho das usinas que moem cana.', 'SAPCana ethanol includes corn ethanol from mills that crush cane.'), { tamanho: 11, cor: CINZA }));
      return { svg: s.join('\n'), y: y + 10 };
    },
    fontes: () => [MAPA_SAP(), MALHA()],
  });
}

/* ------------------------------------------------------------------ 3 o ano inteiro moendo */
async function calendario() {
  const c = await ler('calendario');
  const COR = Object.fromEntries(c.classes.map((k) => [k.classe, k.cor]));
  const porUf = Object.fromEntries(c.ufs.map((u) => [u.uf, u]));
  const al = porUf.AL;
  const sp = porUf.SP;
  const LEG = { x: 40, y: 1350, w: 450, h: 216 };
  const itens = () => [...c.classes].reverse().map((k) => [k.cor, L(k.rotulo, k.rotulo_en)]);
  const legenda = (y0, { tamanho = 15, passo = 24 } = {}) => {
    const s = [];
    let y = y0;
    for (const [cor, rot] of itens()) { s.push(caixa(cor, rot, y, { passo, tamanho })); y += passo; }
    s.push(caixa(c.sem_cana, L('sem cana moída', 'no cane crushed'), y, { passo, tamanho })); y += passo;
    return { svg: s.join('\n'), y };
  };
  const max = c.max_mes;
  const min = c.min_mes;
  const mesAno = (s) => { const [a, m] = s.split('-'); return `${mes(Number(m))}/${a}`; };
  const HEAT = '#6b4415';
  return () => ({
    layout: 'um',
    motivo: 'cana',
    serie: serie(3),
    titulo: () => L('O ano inteiro moendo', 'Crushing all year round'),
    subtitulo: () => L('Quando o Centro-Sul para, o litoral do Nordeste mói quatro em cada cinco toneladas',
      'When the Centre-South stops, the north-eastern coast crushes four tonnes in five'),
    descricao: () => L(
      'Parte da cana moída de outubro a março em cada UF, somando as safras 2023/24 a 2025/26, e a moagem de cada mês',
      'Share of the cane crushed from October to March in each state, adding up the 2023/24 to 2025/26 harvests, and the crush of each month'),
    mapa: () => ({
      preencher: (s) => COR[c.classe_uf[s] ?? -1] ?? c.sem_cana,
      bordaMunicipio: 1,
      bordaUnidadeCor: '#aab2b9',
      semRgint: false,
      bordaRgint: 2.2,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      chamadas: [{
        coord: [al.lon, al.lat], dx: -10, dy: 470,
        titulo: L(`ALAGOAS · ${pc(al.fora)} DE OUTUBRO A MARÇO`, `ALAGOAS · ${pc(al.fora)} FROM OCTOBER TO MARCH`),
        linhas: L(['no litoral nordestino, a safra começa', 'em setembro e entra pelo verão'],
          ['on the north-eastern coast, the harvest starts', 'in September and runs into summer']),
      }, {
        coord: [sp.lon, sp.lat], dx: -330, dy: -50,
        titulo: L(`SÃO PAULO · ${pc(100 - sp.fora)} DE ABRIL A SETEMBRO`, `SÃO PAULO · ${pc(100 - sp.fora)} FROM APRIL TO SEPTEMBER`),
        linhas: L([`pico em ${mes(sp.pico)}, com ${pc(sp.pico_pct)} da cana do ano;`, 'em janeiro e fevereiro, quase nada'],
          [`peak in ${mes(sp.pico)}, with ${pc(sp.pico_pct)} of the year’s cane;`, 'in January and February, almost nothing']),
      }],
    }),
    reservas: () => [[LEG.x - 10, LEG.y - 10, LEG.x + LEG.w + 10, LEG.y + LEG.h + 10]],
    sobreMapa: () => {
      const s = [`<rect x="${LEG.x}" y="${LEG.y}" width="${LEG.w}" height="${LEG.h}" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1.2"/>`];
      s.push(`<g transform="translate(${LEG.x + 18} ${LEG.y + 30})">`);
      s.push(rotuloPainel(L('CANA MOÍDA DE OUT. A MAR.', 'CANE CRUSHED OCT. TO MAR.'), 0));
      const l = legenda(14);
      s.push(l.svg);
      s.push(texto(0, l.y + 22, L('% da moagem da UF, safras 2023/24 a 2025/26', '% of the state’s crush, 2023/24 to 2025/26'), { tamanho: 11.5, cor: CINZA }));
      s.push('</g>');
      return s.join('\n');
    },
    sobreMapaFigura: false,
    legendaFigura: () => {
      const s = [rotuloPainel(L('CANA MOÍDA DE OUT. A MAR.', 'CANE CRUSHED OCT. TO MAR.'), 0)];
      const l = legenda(16, { tamanho: 16, passo: 25 });
      s.push(l.svg);
      s.push(texto(0, l.y + 22, L('% da moagem da UF, 2023/24 a 2025/26', '% of the state’s crush, 2023/24 to 2025/26'), { tamanho: 12.5, cor: CINZA }));
      return { svg: s.join('\n'), altura: l.y + 26, largura: 420, canto: 'sw' };
    },
    numeros: () => [
      [pc(c.jan_fev_ne_pct), [L('da cana de jan. e fev. foi moída', 'of January–February cane was'), L('em AL, PE, PB, RN e SE', 'crushed in AL, PE, PB, RN and SE')]],
      [pc(c.ne_ano_pct, 1), [L('é a parte desses cinco estados', 'is those five states’ share'), L('na moagem do ano inteiro', 'of the whole year’s crush')]],
      [L(`${mi(max.t, 1)} mi t`, `${mi(max.t, 1)} M t`), [L(`em ${mesAno(max.mes)}, o maior mês;`, `in ${mesAno(max.mes)}, the biggest month;`), L(`${mi(min.t, 1)} mi t em ${mesAno(min.mes)}`, `${mi(min.t, 1)} M t in ${mesAno(min.mes)}`)]],
      [pc(100 - sp.fora), [L('da cana de São Paulo é moída', 'of São Paulo’s cane is crushed'), L('de abril a setembro', 'from April to September')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('O CALENDÁRIO DE CADA UF · % DA MOAGEM DO ANO', 'EACH STATE’S CALENDAR · % OF THE YEAR’S CRUSH'), y)];
      y += 24;
      const x0 = 40;
      const xF = LP - 4;
      const cw = (xF - 60 - x0) / 12;
      c.meses.forEach((m, i) => s.push(texto(x0 + i * cw + cw / 2, y, mes(m).slice(0, lingua() === 'en' ? 3 : 3), { tamanho: 10.5, cor: CINZA, anc: 'middle' })));
      s.push(texto(xF, y, L('out–mar', 'Oct–Mar'), { tamanho: 10.5, cor: CINZA, anc: 'end' }));
      y += 8;
      for (const u of c.ufs) {
        s.push(texto(0, y + 12, u.uf, { tamanho: 12, extra: c.litoral_ne.includes(u.uf) ? 'font-weight="bold"' : '' }));
        u.perfil.forEach((v, i) => {
          const op = Math.min(1, v / 22);
          s.push(`<rect x="${f1(x0 + i * cw + 0.5)}" y="${y}" width="${f1(cw - 1)}" height="15" fill="${v > 0.05 ? HEAT : '#f1f2f3'}" fill-opacity="${v > 0.05 ? f1(Math.max(op, 0.06) * 100) / 100 : 1}"/>`);
        });
        s.push(texto(xF, y + 12, pc(u.fora), { tamanho: 12, anc: 'end' }));
        y += 17;
      }
      // Marca entre setembro e outubro: o começo da «entressafra» do Centro-Sul.
      y += 18;
      // Escala de cor.
      [0, 5, 10, 15, 20].forEach((v, i) => {
        s.push(`<rect x="${x0 + i * 46}" y="${y - 10}" width="44" height="11" fill="${v ? HEAT : '#f1f2f3'}" fill-opacity="${v ? Math.min(1, v / 22) : 1}"/>`);
        s.push(texto(x0 + i * 46 + 22, y + 14, i === 4 ? '20+' : `${v}`, { tamanho: 10.5, cor: CINZA, anc: 'middle' }));
      });
      s.push(texto(x0 + 5 * 46 + 10, y, L('% da cana do ano; em negrito,', '% of the year’s cane; in bold,'), { tamanho: 11, cor: CINZA }));
      s.push(texto(x0 + 5 * 46 + 10, y + 15, L('o litoral do Nordeste', 'the north-eastern coast'), { tamanho: 11, cor: CINZA }));
      y += 36;
      // O país, mês a mês: litoral do Nordeste e o resto.
      s.push(rotuloPainel(L('O PAÍS, POR MÊS · MI T (MÉDIA DAS 3 SAFRAS)', 'BRAZIL, BY MONTH · M T (3-HARVEST AVERAGE)'), y));
      y += 14;
      const h = 82;
      const maxB = Math.max(...c.cal_br) / 3;
      c.meses.forEach((m, i) => {
        const tot = c.cal_br[i] / 3;
        const ne = (tot * c.cal_ne_pct[i]) / 100;
        const x = x0 + i * cw + 3;
        const ht = (tot / maxB) * h;
        const hn = (ne / maxB) * h;
        s.push(`<rect x="${f1(x)}" y="${f1(y + h - ht)}" width="${f1(cw - 6)}" height="${f1(ht)}" fill="${COR[0]}"/>`);
        if (hn > 0.2) s.push(`<rect x="${f1(x)}" y="${f1(y + h - hn)}" width="${f1(cw - 6)}" height="${f1(Math.max(hn, 1))}" fill="${COR[3]}"/>`);
        s.push(texto(x + (cw - 6) / 2, y + h + 15, mes(m), { tamanho: 10.5, cor: CINZA, anc: 'middle' }));
        if (c.cal_ne_pct[i] >= 30) s.push(texto(x + (cw - 6) / 2, y + h - Math.max(ht, hn) - 6, pc(c.cal_ne_pct[i]), { tamanho: 11, anc: 'middle' }));
      });
      s.push(texto(0, y + 8, nf(maxB / 1e6, 0), { tamanho: 10.5, cor: CINZA }));
      y += h + 38;
      s.push(`<rect x="0" y="${y - 10}" width="22" height="11" fill="${COR[3]}"/>`);
      s.push(texto(28, y, L('AL, PE, PB, RN e SE', 'AL, PE, PB, RN and SE'), { tamanho: 11, cor: CINZA }));
      s.push(`<rect x="210" y="${y - 10}" width="22" height="11" fill="${COR[0]}"/>`);
      s.push(texto(238, y, L('as outras UFs; % = parte do litoral NE', 'other states; % = NE coast share'), { tamanho: 11, cor: CINZA }));
      return { svg: s.join('\n'), y: y + 10 };
    },
    fontes: () => [MAPA_SAP(), MALHA()],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { safras, acucar, calendario };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/sapcana-br/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
// Como nas coleções etanol-br e biodiesel-br: o rótulo do oceano do motor sai e este entra ao largo da Bahia.
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
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `sapcana-br-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
