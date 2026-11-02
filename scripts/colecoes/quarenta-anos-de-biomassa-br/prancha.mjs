#!/usr/bin/env node
/**
 * Coleção «Quarenta anos de biomassa» (Brasil) — desenha uma prancha a partir do cache de preparar.py (uso interno).
 *
 *   node scripts/colecoes/quarenta-anos-de-biomassa-br/prancha.mjs chegada|rumo|monocultura
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  RAIZ, LP, SERIF, MONO, CINZA, PAPEL, TINTA, esc, nf, f1, lingua, largura, halo,
  gerarPrancha, rotuloPainel, usarBrasil,
} from '../lib/prancha-sp.mjs';

const COL = 'quarenta-anos-de-biomassa-br';
export const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', COL, 'serie.json'), 'utf8'));
const TOTAL = 3; // pranchas da coleção
const BORDA = '#c9ced3';

const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `${COL}-${nome}.json`), 'utf8'));
const br = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', 'brasil-base.json'), 'utf8'));
const L = (pt, en) => (lingua() === 'en' ? en : pt);
const serie = (i) => () => L(`QUARENTA ANOS DE BIOMASSA · ${i}/${TOTAL}`, `FORTY YEARS OF BIOMASS · ${i}/${TOTAL}`);
const pc = (v, casas = 0) => `${nf(v, casas)} %`;
const MB = () => L('MapBiomas, Coleção 11 (1985–2025)', 'MapBiomas, Collection 11 (1985–2025)');
const MALHA = () => L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025');
const texto = (x, y, t, { tamanho = 12.5, cor = TINTA, anc = 'start', fonte = MONO, extra = '' } = {}) =>
  `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anc}" font-family="${fonte}" font-size="${tamanho}" fill="${cor}" ${extra}>${esc(t)}</text>`;
const caixa = (cor, rot, y, { passo = 25, tamanho = 15, x = 0 } = {}) => `<rect x="${x}" y="${y}" width="34" height="${passo - 8}" fill="${cor}" stroke="${BORDA}" stroke-width=".8"/>
<text x="${x + 48}" y="${y + passo - 12}" font-family="${SERIF}" font-size="${tamanho}">${esc(rot)}</text>`;
const NOME_REGIAO = { Norte: ['Norte', 'North'], Nordeste: ['Nordeste', 'Northeast'], 'Centro-Oeste': ['Centro-Oeste', 'Centre-West'],
  Sudeste: ['Sudeste', 'Southeast'], Sul: ['Sul', 'South'] };
const regiao = (r) => L(...NOME_REGIAO[r]);
const municipal = (feats, cor) => [
  { feats, cor, borda: 'none', largura: 0 },
  { feats: br.ufs.features, cor: 'none', borda: '#4a4e52', largura: 0.9, opacidade: 1 },
];
const legendaFigura = (titulo, itens, canto = 'sw') => () => {
  const s = [rotuloPainel(titulo, 0)];
  const passo = 26;
  let y = 22;
  for (const [cor, rot] of itens()) { s.push(caixa(cor, rot, y, { passo, tamanho: 16 })); y += passo; }
  const larg = Math.max(48 + Math.max(...itens().map(([, r]) => largura(r, 16))), largura(titulo, 15, { mono: true, espaco: 2.4 }));
  return { svg: s.join('\n'), altura: y - 8, largura: Math.ceil(larg), canto };
};
/** Eixo de anos (1985–2025) sob um gráfico de largura w, a partir de x0. */
const eixoAnos = (x0, w, y, anos = [1985, 1995, 2005, 2015, 2025]) =>
  anos.map((a) => texto(x0 + ((a - 1985) / 40) * w, y, String(a), { tamanho: 11, cor: CINZA, anc: 'middle' })).join('\n');

/* ------------------------------------------------------------------ 171 o ano em que a soja chegou */
async function chegada() {
  const c = await ler('chegada');
  const P = c.periodos;
  const COR = Object.fromEntries(P.map((p) => [p.chave, p.cor]));
  const SEM = '#f1f2f3';
  const corDe = (f) => COR[f.properties.periodo] ?? SEM;
  const itens = () => [...P.map((p) => [p.cor, L(p.rotulo, p.rotulo_en)]), [SEM, L('a soja nunca passou de 5 %', 'soy never passed 5%')]];
  const rec = P[4];
  const mais = c.soja_br_mha.at(-1);
  const menos = c.soja_br_mha[0];
  return () => ({
    layout: 'um',
    motivo: 'agro',
    serie: serie(1),
    titulo: () => L('O ano em que a soja chegou', 'The year soy arrived'),
    subtitulo: () => L(`Em ${nf(c.chegaram)} municípios a soja passou de 5 % da terra depois de 1985; na última década, do Rio Grande do Sul a Roraima`,
      `Soy passed 5% of the land in ${nf(c.chegaram)} municipalities after 1985; in the last decade, from Rio Grande do Sul to Roraima`),
    descricao: () => L(
      `Primeiro ano em que a soja cobriu ${pc(c.limiar)} ou mais da área do município por três anos seguidos, no mapeamento anual do MapBiomas de 1985 a 2025`,
      `First year in which soy covered ${pc(c.limiar)} or more of the municipality’s area for three years running, in MapBiomas’ yearly mapping from 1985 to 2025`),
    mapa: () => ({
      preencher: () => SEM,
      bordaMunicipio: 0,
      semRgint: true,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      camadas: municipal(c.municipios.features, corDe),
      chamadas: [{
        coord: c.norte.coord, dx: -230, dy: -110,
        titulo: L(`${c.norte.nome.toUpperCase()} (${c.norte.uf}) · ${c.norte.ano}`, `${c.norte.nome.toUpperCase()} (${c.norte.uf}) · ${c.norte.ano}`),
        linhas: L(['a chegada mais ao norte:', `soja em ${pc(c.norte.pct, 1)} da área em 2025`],
          ['the northernmost arrival:', `soy on ${pc(c.norte.pct, 1)} of the land in 2025`]),
      }, {
        coord: c.maior_recente.coord, dx: 260, dy: -190,
        titulo: L(`${c.maior_recente.nome.toUpperCase()} (${c.maior_recente.uf}) · ${c.maior_recente.ano}`, `${c.maior_recente.nome.toUpperCase()} (${c.maior_recente.uf}) · ${c.maior_recente.ano}`),
        linhas: L([`${nf(c.maior_recente.ha / 1000)} mil ha de soja em 2025,`, 'a maior das chegadas desde 2016'],
          [`${nf(c.maior_recente.ha / 1000)} thousand ha of soy in 2025,`, 'the largest arrival since 2016']),
      }],
    }),
    legendaFigura: legendaFigura(L('SOJA ACIMA DE 5 % DA ÁREA, DESDE', 'SOY ABOVE 5% OF THE LAND, SINCE'), itens),
    numeros: () => [
      [nf(c.chegaram), [L('municípios em que a soja', 'municipalities where soy'), L(`chegou depois de 1985`, 'arrived after 1985')]],
      [nf(c.ja_1985), [L('já tinham soja em 1985,', 'already had soy in 1985,'), L(`${nf(P[0].regioes.Sul)} deles no Sul`, `${nf(P[0].regioes.Sul)} of them in the South`)]],
      [L(`${nf(mais, 1)} mi ha`, `${nf(mais, 1)} M ha`), [L('de soja em 2025,', 'of soy in 2025,'), L(`${nf(mais / menos, 1)} vezes os ${nf(menos, 1)} de 1985`, `${nf(mais / menos, 1)} times the ${nf(menos, 1)} of 1985`)]],
      [nf(rec.n), [L('chegadas em 2016–2025;', 'arrivals in 2016–2025;'), L(`${rec.regioes.Norte + rec.regioes.Nordeste} no Norte e no Nordeste`, `${rec.regioes.Norte + rec.regioes.Nordeste} in the North and Northeast`)]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('MUNICÍPIOS, POR PERÍODO DE CHEGADA', 'MUNICIPALITIES, BY PERIOD OF ARRIVAL'), y)];
      y += 16;
      const xb = 300;
      const wMax = LP - xb - 60;
      const maxN = Math.max(...P.map((p) => p.n));
      for (const p of P) {
        s.push(caixa(p.cor, L(p.rotulo, p.rotulo_en), y, { passo: 22, tamanho: 14 }));
        const w = (p.n / maxN) * wMax;
        s.push(`<rect x="${xb}" y="${y + 3}" width="${f1(w)}" height="10" fill="${p.cor}" stroke="#7a8189" stroke-width=".5"/>`);
        s.push(texto(xb + w + 6, y + 12, nf(p.n), { tamanho: 12.5 }));
        y += 22;
      }
      s.push(caixa(SEM, L(`nunca passou de 5 % (${nf(c.municipios_total - c.com_soja)})`, `never above 5% (${nf(c.municipios_total - c.com_soja)})`), y, { passo: 22, tamanho: 14 }));
      y += 22 + 18;
      // Chegadas por ano (1986–2025).
      s.push(rotuloPainel(L('CHEGADAS POR ANO', 'ARRIVALS BY YEAR'), y));
      y += 16;
      const h = 62;
      const x0 = 34;
      const wg = LP - x0 - 10;
      const bw = wg / 41;
      const maxA = Math.max(...c.por_ano.slice(1));
      const periodo = (a) => P.find((p) => a >= (p.chave === 0 ? 1985 : [1986, 1996, 2006, 2016][p.chave - 1]) && a <= [1985, 1995, 2005, 2015, 2025][p.chave]);
      for (const v of [0, 50, 100]) {
        const yy = y + h - (v / maxA) * h;
        if (v > maxA) continue;
        s.push(`<path d="M${x0} ${f1(yy)}H${x0 + wg}" stroke="#d5d9dd" stroke-width=".8"/>`);
        s.push(texto(x0 - 6, yy + 4, String(v), { tamanho: 11, cor: CINZA, anc: 'end' }));
      }
      c.anos.forEach((a, i) => {
        if (i === 0) return;
        const v = c.por_ano[i];
        const hh = (v / maxA) * h;
        s.push(`<rect x="${f1(x0 + i * bw + 0.6)}" y="${f1(y + h - hh)}" width="${f1(bw - 1.2)}" height="${f1(hh)}" fill="${periodo(a).cor}" stroke="#7a8189" stroke-width=".4"/>`);
      });
      const iPico = c.anos.indexOf(c.pico.ano) === 0 ? c.por_ano.slice(1).indexOf(Math.max(...c.por_ano.slice(1))) + 1 : 0;
      s.push(texto(x0 + iPico * bw + bw + 4, y + 10, L(`${c.anos[iPico]}: ${c.por_ano[iPico]}`, `${c.anos[iPico]}: ${c.por_ano[iPico]}`), { tamanho: 11.5 }));
      const i14 = c.anos.indexOf(2014);
      s.push(texto(x0 + i14 * bw + bw / 2, y + h - (c.por_ano[i14] / maxA) * h - 6, `2014–15: ${c.por_ano[i14] + c.por_ano[i14 + 1]}`, { tamanho: 11.5, anc: 'middle' }));
      s.push(eixoAnos(x0 + bw / 2, wg - bw, y + h + 16, [1985, 1995, 2005, 2015, 2025]));
      y += h + 32;
      // Região × período.
      s.push(rotuloPainel(L('POR REGIÃO E PERÍODO DE CHEGADA', 'BY REGION AND PERIOD OF ARRIVAL'), y));
      y += 22;
      const xs = [190, 270, 350, 430, 510];
      P.forEach((p, i) => {
        s.push(`<rect x="${xs[i] - 46}" y="${y - 12}" width="50" height="14" fill="${p.cor}" stroke="${BORDA}" stroke-width=".6"/>`);
        s.push(texto(xs[i], y - 1, p.chave === 0 ? '1985' : `${L('até', 'to')} ’${String([0, 1995, 2005, 2015, 2025][p.chave]).slice(2)}`, { tamanho: 10.5, anc: 'end', cor: p.chave >= 3 ? TINTA : PAPEL }));
      });
      y += 19;
      for (const r of ['Sul', 'Sudeste', 'Centro-Oeste', 'Nordeste', 'Norte']) {
        s.push(texto(0, y, regiao(r), { tamanho: 12.5 }));
        P.forEach((p, i) => s.push(texto(xs[i], y, nf(p.regioes[r]), { tamanho: 12.5, anc: 'end', cor: p.regioes[r] ? TINTA : CINZA })));
        y += 17;
      }
      y += 6;
      const ufs = Object.entries(c.ufs_recentes).slice(0, 4).map(([k, v]) => `${k} ${v}`).join(', ');
      const linhas = L([
        `Desde 2016, a soja avança também por dentro do Sul e`,
        `do Sudeste (${ufs}), sobre pasto e cana.`,
      ], [
        'Since 2016, soy has also spread within the South and',
        `the Southeast (${ufs}), over pasture and cane.`,
      ]);
      linhas.forEach((l) => { s.push(texto(0, y, l, { tamanho: 12 })); y += 18; });
      return { svg: s.join('\n'), y };
    },
    fontes: () => [MB(), MALHA()],
  });
}

/* ------------------------------------------------------------------ 172 cada lavoura no seu rumo */
async function rumo() {
  const c = await ler('rumo');
  const K = Object.fromEntries(c.classes.map((k) => [k.classe, k]));
  const ORDEM = ['soja', 'cana', 'pastagem', 'silvicultura', 'floresta'];
  // Posição dos rótulos (relativa ao ponto de 2025, em px) e do rótulo de 1985.
  const ROT = {
    soja: { fim: [14, -12, 'start'], ini: [-12, 22, 'end'] },
    cana: { fim: [14, 28, 'start'], ini: [14, -10, 'start'] },
    pastagem: { fim: [-14, -14, 'end'], ini: [14, 8, 'start'] },
    silvicultura: { fim: [16, 6, 'start'], ini: [12, 24, 'start'] },
    floresta: { fim: [0, -18, 'middle'], ini: [0, 30, 'middle'] },
  };
  const desenhar = (proj, { rotulos = true } = {}) => {
    const s = [];
    const marcas = [];
    for (const k of ORDEM) {
      const g = K[k];
      const pts = g.pontos.map((p) => proj(p));
      const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f1(x)} ${f1(y)}`).join('');
      const lw = k === 'floresta' ? 2.6 : 4;
      s.push(`<path d="${d}" fill="none" stroke="${PAPEL}" stroke-width="${lw + 5}" stroke-linejoin="round" stroke-linecap="round" stroke-opacity=".9"/>`);
      s.push(`<path d="${d}" fill="none" stroke="${g.cor}" stroke-width="${lw}" stroke-linejoin="round" stroke-linecap="round"${k === 'floresta' ? ' stroke-dasharray="6 4"' : ''}/>`);
      // Marcas a cada cinco anos; 1985 vazado, 2025 cheio e maior.
      c.anos.forEach((a, i) => {
        if (a % 5 !== 0 || a === 1985 || a === 2025) return;
        const [x, y] = pts[i];
        s.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="3.4" fill="${g.cor}" stroke="${PAPEL}" stroke-width="1.2"/>`);
      });
      const [x0, y0] = pts[0];
      const [x1, y1] = pts.at(-1);
      s.push(`<circle cx="${f1(x0)}" cy="${f1(y0)}" r="7" fill="${PAPEL}" stroke="${g.cor}" stroke-width="2.6"/>`);
      s.push(`<circle cx="${f1(x1)}" cy="${f1(y1)}" r="8.5" fill="${g.cor}" stroke="${PAPEL}" stroke-width="2"/>`);
      if (!rotulos) continue;
      const [fx, fy, fa] = ROT[k].fim;
      const [ix, iy, ia] = ROT[k].ini;
      marcas.push(texto(x1 + fx, y1 + fy, `${L(g.rotulo, g.rotulo_en)} 2025`, { tamanho: 15, anc: fa, cor: g.cor, fonte: SERIF, extra: `font-weight="bold" ${halo(4)}` }));
      marcas.push(texto(x0 + ix, y0 + iy, '1985', { tamanho: 13, anc: ia, cor: g.cor, extra: halo(4) }));
    }
    return [...s, ...marcas].join('\n');
  };
  const soja = K.soja;
  const cana = K.cana;
  const pasto = K.pastagem;
  const silv = K.silvicultura;
  const itensLinha = (y, { tamanho = 15 } = {}) => {
    const s = [];
    for (const k of ORDEM) {
      const g = K[k];
      s.push(`<path d="M0 ${y - 5}h40" stroke="${g.cor}" stroke-width="4"${k === 'floresta' ? ' stroke-dasharray="6 4"' : ''}/>`);
      s.push(`<circle cx="40" cy="${y - 5}" r="5.5" fill="${g.cor}" stroke="${PAPEL}" stroke-width="1.4"/>`);
      s.push(texto(54, y, L(g.rotulo, g.rotulo_en), { tamanho, fonte: SERIF }));
      y += 25;
    }
    return { svg: s.join('\n'), y };
  };
  const pontoAno = (y) => [
    `<circle cx="8" cy="${y - 5}" r="6" fill="${PAPEL}" stroke="${TINTA}" stroke-width="2.2"/>`,
    texto(22, y, '1985', { tamanho: 12.5 }),
    `<circle cx="88" cy="${y - 5}" r="3.4" fill="${TINTA}"/>`,
    texto(100, y, L('a cada 5 anos', 'every 5 years'), { tamanho: 12.5 }),
    `<circle cx="230" cy="${y - 5}" r="7" fill="${TINTA}"/>`,
    texto(244, y, '2025', { tamanho: 12.5 }),
  ].join('\n');
  const km = (v) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${nf(Math.abs(v))}`;
  return () => ({
    layout: 'um',
    motivo: 'agro',
    serie: serie(2),
    titulo: () => L('Cada lavoura no seu rumo', 'Each crop on its own heading'),
    subtitulo: () => L(`Em quarenta anos, o centro da soja subiu ${nf(soja.liquido_km)} km para o norte e o da cana desceu ${nf(cana.liquido_km)} km para o sudoeste`,
      `In forty years the centre of soy moved ${nf(soja.liquido_km)} km north, and that of cane ${nf(cana.liquido_km)} km south-west`),
    descricao: () => L(
      'Centro de gravidade de cada classe do MapBiomas, ano a ano de 1985 a 2025: a média dos centros dos municípios, pesada pela área da classe em cada um, na projeção equivalente',
      'Centre of gravity of each MapBiomas class, year by year from 1985 to 2025: the mean of municipal centres weighted by the class area in each, in the equal-area projection'),
    mapa: () => ({
      preencher: () => '#f1f2f3',
      bordaMunicipio: 1,
      bordaUnidadeCor: '#aab2b9',
      semRgint: false,
      bordaRgint: 1.6,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      chamadas: [{
        coord: soja.pontos.at(-1), dx: -330, dy: -150,
        titulo: L(`SOJA · ${nf(soja.liquido_km)} KM AO NORTE`, `SOY · ${nf(soja.liquido_km)} KM NORTH`),
        linhas: L([`do noroeste do Paraná ao sudoeste de Goiás;`, `a área cresceu ${nf(soja.fator, 1)} vezes`],
          ['from north-western Paraná to south-western Goiás;', `its area grew ${nf(soja.fator, 1)}-fold`]),
      }, {
        coord: cana.pontos[0], dx: 260, dy: -120,
        titulo: L(`CANA · ${nf(cana.liquido_km)} KM AO SUDOESTE`, `CANE · ${nf(cana.liquido_km)} KM SOUTH-WEST`),
        linhas: L(['em 1985, o peso da Zona da Mata', 'nordestina a puxava para o leste'],
          ['in 1985 the north-eastern coastal', 'cane belt pulled it east']),
      }],
    }),
    sobreMapa: (proj) => desenhar(proj),
    legendaFigura: () => {
      const s = [rotuloPainel(L('CENTRO DE GRAVIDADE, 1985 → 2025', 'CENTRE OF GRAVITY, 1985 → 2025'), 0)];
      const k = itensLinha(30, { tamanho: 16 });
      s.push(k.svg, pontoAno(k.y + 4));
      return { svg: s.join('\n'), altura: k.y + 10, largura: 330, canto: 'sw' };
    },
    numeros: () => [
      [L(`${nf(soja.liquido_km)} km`, `${nf(soja.liquido_km)} km`), [L('ao norte andou o centro da', 'north went the centre of'), L(`soja (${nf(soja.caminho_km)} km de caminho)`, `soy (a ${nf(soja.caminho_km)} km path)`)]],
      [L(`${nf(cana.liquido_km)} km`, `${nf(cana.liquido_km)} km`), [L('ao sudoeste foi o da cana,', 'south-west went cane’s,'), L('do norte de Minas ao Triângulo', 'north Minas → the Triângulo')]],
      [L(`${nf(pasto.liquido_km)} km`, `${nf(pasto.liquido_km)} km`), [L('rumo à Amazônia andou', 'towards the Amazon moved'), L('o centro do pasto', 'the centre of pasture')]],
      [L(`${nf(silv.liquido_km)} km`, `${nf(silv.liquido_km)} km`), [L('só, a silvicultura: cresceu', 'only, for planted forest: it grew'), L(`${nf(silv.fator, 1)} vezes perto de onde estava`, `${nf(silv.fator, 1)}-fold close to where it was`)]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('O DESLOCAMENTO, 1985 → 2025', 'THE SHIFT, 1985 → 2025'), y)];
      y += 26;
      const cols = [[0, 'start', L('classe', 'class')], [300, 'end', L('mi ha', 'M ha')], [390, 'end', L('km N', 'km N')], [470, 'end', L('km L', 'km E')], [LP, 'end', L('total', 'net')]];
      for (const [x, anc, t] of cols) s.push(texto(x, y, t, { tamanho: 11.5, cor: CINZA, anc }));
      y += 22;
      for (const k of ORDEM) {
        const g = K[k];
        s.push(`<path d="M0 ${y - 5}h22" stroke="${g.cor}" stroke-width="4"${k === 'floresta' ? ' stroke-dasharray="6 4"' : ''}/>`);
        s.push(texto(30, y, L(g.rotulo, g.rotulo_en), { tamanho: 14, fonte: SERIF }));
        s.push(texto(300, y, `${nf(g.area_mha[0], 1)} → ${nf(g.area_mha.at(-1), 1)}`, { tamanho: 12.5, anc: 'end' }));
        s.push(texto(390, y, km(g.km_norte), { tamanho: 12.5, anc: 'end' }));
        s.push(texto(470, y, km(g.km_leste), { tamanho: 12.5, anc: 'end' }));
        s.push(texto(LP, y, nf(g.liquido_km), { tamanho: 12.5, anc: 'end' }));
        y += 23;
      }
      s.push(texto(0, y, L('km N: para o norte (−: sul); km L: para o leste (−: oeste)', 'km N: northward (−: south); km E: eastward (−: west)'), { tamanho: 11, cor: CINZA }));
      y += 22;
      // Os quatro deslocamentos a partir de uma origem comum (rosa dos rumos).
      s.push(rotuloPainel(L('OS RUMOS, DE UMA MESMA ORIGEM', 'THE HEADINGS, FROM ONE ORIGIN'), y));
      const R = 92;
      const cx = 150;
      const cy = y + 30 + R;
      const escala = R / 650;
      s.push(`<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#d5d9dd" stroke-width=".8"/>`);
      s.push(`<circle cx="${cx}" cy="${cy}" r="${R / 2}" fill="none" stroke="#d5d9dd" stroke-width=".8"/>`);
      s.push(`<path d="M${cx - R - 8} ${cy}H${cx + R + 8}M${cx} ${cy - R - 8}V${cy + R + 8}" stroke="#d5d9dd" stroke-width=".8"/>`);
      s.push(texto(cx, cy - R - 12, 'N', { tamanho: 12, anc: 'middle', cor: CINZA }));
      s.push(texto(cx + R / 2 + 3, cy + 14, '325 km', { tamanho: 10.5, cor: CINZA }));
      s.push(texto(cx + R + 3, cy + 14, '650', { tamanho: 10.5, cor: CINZA }));
      for (const k of ['silvicultura', 'pastagem', 'cana', 'soja']) {
        const g = K[k];
        const ex = cx + g.km_leste * escala;
        const ey = cy - g.km_norte * escala;
        const ang = Math.atan2(ey - cy, ex - cx);
        const ponta = 10;
        const bx = ex - ponta * Math.cos(ang);
        const by = ey - ponta * Math.sin(ang);
        s.push(`<path d="M${cx} ${cy}L${f1(bx)} ${f1(by)}" stroke="${g.cor}" stroke-width="3.2"/>`);
        s.push(`<path d="M${f1(ex)} ${f1(ey)}L${f1(bx + 5.5 * Math.sin(ang))} ${f1(by - 5.5 * Math.cos(ang))}L${f1(bx - 5.5 * Math.sin(ang))} ${f1(by + 5.5 * Math.cos(ang))}Z" fill="${g.cor}"/>`);
      }
      s.push(`<circle cx="${cx}" cy="${cy}" r="3.5" fill="${TINTA}"/>`);
      // Ao lado da rosa: área de cada lavoura, ano a ano.
      const gx = 300;
      const gw = LP - gx - 6;
      const gh = 150;
      const gy = y + 34;
      const maxV = 50;
      s.push(texto(gx, gy - 6, L('área, mi ha', 'area, M ha'), { tamanho: 11, cor: CINZA }));
      for (const v of [0, 25, 50]) {
        const yy = gy + gh - (v / maxV) * gh;
        s.push(`<path d="M${gx + 22} ${f1(yy)}H${gx + gw}" stroke="#d5d9dd" stroke-width=".8"/>`);
        s.push(texto(gx + 16, yy + 4, String(v), { tamanho: 10.5, cor: CINZA, anc: 'end' }));
      }
      const X = (i) => gx + 22 + (i / 40) * (gw - 22);
      for (const k of ['soja', 'cana', 'silvicultura']) {
        const g = K[k];
        s.push(`<path d="${g.area_mha.map((v, i) => `${i ? 'L' : 'M'}${f1(X(i))} ${f1(gy + gh - (v / maxV) * gh)}`).join('')}" fill="none" stroke="${g.cor}" stroke-width="2.4"/>`);
        s.push(texto(X(40) - 2, gy + gh - (g.area_mha.at(-1) / maxV) * gh + (k === 'silvicultura' ? 15 : -6), nf(g.area_mha.at(-1), 1), { tamanho: 11, anc: 'end', cor: g.cor }));
      }
      s.push(eixoAnos(gx + 22, gw - 22, gy + gh + 16, [1985, 2005, 2025]));
      y = Math.max(cy + R + 26, gy + gh + 30);
      const linhas = L([
        `O pasto não cabe na escala: ${nf(pasto.area_mha[0])} → ${nf(pasto.area_mha.at(-1))} mi ha.`,
        'O centro é uma média: pode cair onde a classe quase não',
        'existe, como o da cana em 1985, no norte de Minas.',
      ], [
        `Pasture is off the scale: ${nf(pasto.area_mha[0])} → ${nf(pasto.area_mha.at(-1))} M ha.`,
        'A centre is an average: it can fall where the class barely',
        'exists, as cane’s did in 1985, in northern Minas Gerais.',
      ]);
      linhas.forEach((l) => { s.push(texto(0, y, l, { tamanho: 12 })); y += 18; });
      return { svg: s.join('\n'), y };
    },
    fontes: () => [MB(), MALHA()],
  });
}

/* ------------------------------------------------------------------ 173 cidades de uma cultura só */
async function monocultura() {
  const c = await ler('monocultura');
  const CAT = Object.fromEntries(c.categorias.map((k) => [k.chave, k]));
  const corDe = (f) => CAT[f.properties.categoria]?.cor ?? '#f6f6f4';
  const itens = () => c.categorias.map((k) => [k.cor, L(k.rotulo, k.rotulo_en)]);
  const soja = c.top.soja;
  const cana = c.top.cana;
  const p85 = c.por_classe_1985;
  const p25 = c.por_classe_2025;
  const pico = (k) => { const v = c.serie[k]; const m = Math.max(...v); return { ano: c.anos[v.indexOf(m)], n: m }; };
  const picoPasto = pico('pastagem');
  const nomeMun = (t) => `${t.nome.toUpperCase()} (${t.uf})`;
  return () => ({
    layout: 'um',
    motivo: 'agro',
    serie: serie(3),
    titulo: () => L('Cidades de uma cultura só', 'One-crop towns'),
    subtitulo: () => L(`Os municípios com mais da metade da terra em soja foram de ${p85.soja} a ${p25.soja}, e os da cana, de ${p85.cana} a ${p25.cana}`,
      `Towns with over half their land under soy went from ${p85.soja} to ${p25.soja}, and cane towns from ${p85.cana} to ${p25.cana}`),
    descricao: () => L(
      `Municípios em que uma só classe de lavoura, pasto ou silvicultura do MapBiomas cobre mais de ${pc(c.limiar)} da área, em 1985 e em 2025`,
      `Municipalities where a single MapBiomas crop, pasture or planted-forest class covers over ${pc(c.limiar)} of the land, in 1985 and in 2025`),
    mapa: () => ({
      preencher: () => '#f6f6f4',
      bordaMunicipio: 0,
      semRgint: true,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      camadas: municipal(c.municipios.features, corDe),
      chamadas: [{
        coord: soja.coord, dx: -190, dy: 240,
        titulo: L(`${nomeMun(soja)} · ${pc(soja.pct)} SOJA`, `${nomeMun(soja)} · ${pc(soja.pct)} SOY`),
        linhas: L(['a maior parte da terra numa só cultura;', `em 1985, ${pc(soja.pct_1985)} em outras lavouras`],
          ['the largest share in a single crop;', `in 1985, ${pc(soja.pct_1985)} in other crops`]),
      }, {
        coord: [-48.6, -21.2], dx: 330, dy: 130,
        titulo: L(`SUDESTE · ${c.regioes_2025.Sudeste.cana} MUNICÍPIOS DE CANA`, `SOUTHEAST · ${c.regioes_2025.Sudeste.cana} CANE TOWNS`),
        linhas: L([`todos em São Paulo; eram ${c.regioes_1985.Sudeste.cana} em 1985,`, `e ${c.cana_sp_de_pasto} dos novos eram de pasto`], [`all in São Paulo, up from ${c.regioes_1985.Sudeste.cana} in 1985;`, `${c.cana_sp_de_pasto} of the new ones were pasture towns`]),
      }],
    }),
    legendaFigura: legendaFigura(L(`UMA CLASSE COM MAIS DE ${pc(c.limiar)} DA ÁREA`, `ONE CLASS OVER ${pc(c.limiar)} OF THE LAND`), itens),
    numeros: () => [
      [nf(p25.soja), [L('municípios de soja em 2025;', 'soy towns in 2025;'), L(`eram ${p85.soja} em 1985`, `there were ${p85.soja} in 1985`)]],
      [nf(p25.cana), [L('municípios de cana em 2025;', 'cane towns in 2025;'), L(`${c.regioes_2025.Sudeste.cana} deles no Sudeste`, `${c.regioes_2025.Sudeste.cana} of them in the Southeast`)]],
      [nf(p25.pastagem), [L('municípios de pasto; foram', 'pasture towns; the peak was'), L(`${nf(picoPasto.n)} em ${picoPasto.ano}`, `${nf(picoPasto.n)} in ${picoPasto.ano}`)]],
      [nf(c.pasto_deixou), [L('deixaram de ser de pasto;', 'stopped being pasture towns;'), L(`${c.pasto_virou.cana ?? 0} viraram de cana`, `${c.pasto_virou.cana ?? 0} became cane towns`)]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('MUNICÍPIOS EM 2025, PELA SITUAÇÃO EM 1985', 'TOWNS IN 2025, BY THEIR STATUS IN 1985'), y)];
      y += 14;
      const xb = 380;
      const wMax = LP - xb - 50;
      const maxN = Math.max(...c.categorias.filter((k) => k.chave !== 'nenhuma').map((k) => k.n));
      for (const k of c.categorias) {
        s.push(caixa(k.cor, L(k.rotulo, k.rotulo_en), y, { passo: 20, tamanho: 13 }));
        if (k.chave !== 'nenhuma') {
          const w = (k.n / maxN) * wMax;
          s.push(`<rect x="${xb}" y="${y + 3}" width="${f1(Math.max(w, 1))}" height="9" fill="${k.cor}" stroke="#7a8189" stroke-width=".5"/>`);
          s.push(texto(xb + Math.max(w, 1) + 6, y + 12, nf(k.n), { tamanho: 12 }));
        } else s.push(texto(xb, y + 12, nf(k.n), { tamanho: 12, cor: CINZA }));
        y += 20;
      }
      y += 20;
      // Número de municípios de uma cultura só, ano a ano: pasto num gráfico, soja e cana no outro.
      s.push(rotuloPainel(L('MUNICÍPIOS DE UMA CULTURA SÓ, ANO A ANO', 'ONE-CROP TOWNS, YEAR BY YEAR'), y));
      y += 18;
      const gw = (LP - 30) / 2;
      const gh = 70;
      const graf = (x0, chaves, maxV, passos) => {
        const g = [];
        const X = (i) => x0 + 34 + (i / 40) * (gw - 40);
        for (const v of passos) {
          const yy = y + gh - (v / maxV) * gh;
          g.push(`<path d="M${x0 + 34} ${f1(yy)}H${x0 + gw}" stroke="#d5d9dd" stroke-width=".8"/>`);
          g.push(texto(x0 + 28, yy + 4, nf(v), { tamanho: 10.5, cor: CINZA, anc: 'end' }));
        }
        for (const k of chaves) {
          const cor = CAT[`${k}_nova`].cor;
          const v = c.serie[k];
          g.push(`<path d="${v.map((n, i) => `${i ? 'L' : 'M'}${f1(X(i))} ${f1(y + gh - (n / maxV) * gh)}`).join('')}" fill="none" stroke="${cor}" stroke-width="2.4"/>`);
          g.push(texto(X(40) + 3, y + gh - (v.at(-1) / maxV) * gh - 6, nf(v.at(-1)), { tamanho: 11, anc: 'end', cor }));
        }
        g.push(eixoAnos(x0 + 34, gw - 40, y + gh + 16, [1985, 2005, 2025]));
        return g.join('\n');
      };
      s.push(graf(0, ['pastagem'], 2000, [0, 1000, 2000]));
      s.push(texto(40, y + 4, L('pastagem', 'pasture'), { tamanho: 12, cor: CAT.pastagem_antiga.cor, fonte: SERIF }));
      s.push(graf(gw + 30, ['soja', 'cana'], 300, [0, 150, 300]));
      s.push(texto(gw + 70, y + 4, L('soja', 'soy'), { tamanho: 12, cor: CAT.soja_nova.cor, fonte: SERIF }));
      s.push(texto(gw + 120, y + 4, L('cana', 'cane'), { tamanho: 12, cor: CAT.cana_nova.cor, fonte: SERIF }));
      y += gh + 30;
      // Por região, 1985 → 2025.
      s.push(rotuloPainel(L('POR REGIÃO, 1985 → 2025', 'BY REGION, 1985 → 2025'), y));
      y += 20;
      const xs = [270, 410, LP];
      [[L('soja', 'soy'), 'soja'], [L('cana', 'cane'), 'cana'], [L('pastagem', 'pasture'), 'pastagem']].forEach(([t], i) => s.push(texto(xs[i], y, t, { tamanho: 11.5, cor: CINZA, anc: 'end' })));
      y += 18;
      for (const r of ['Sul', 'Sudeste', 'Centro-Oeste', 'Nordeste', 'Norte']) {
        s.push(texto(0, y, regiao(r), { tamanho: 12.5 }));
        ['soja', 'cana', 'pastagem'].forEach((k, i) => s.push(texto(xs[i], y, `${nf(c.regioes_1985[r][k])} → ${nf(c.regioes_2025[r][k])}`, { tamanho: 12.5, anc: 'end' })));
        y += 17;
      }
      y += 6;
      const linhas = L([
        `As ${p25.soja} cidades da soja têm só ${pc(c.soja_mono_pct_area)} da soja do país: são pequenas,`,
        'quase todas no Sul; no cerrado, os municípios são enormes.',
      ], [
        `The ${p25.soja} soy towns hold just ${pc(c.soja_mono_pct_area)} of Brazil’s soy: small towns,`,
        'nearly all in the South; Cerrado municipalities are huge.',
      ]);
      linhas.forEach((l) => { s.push(texto(0, y, l, { tamanho: 12 })); y += 18; });
      return { svg: s.join('\n'), y };
    },
    fontes: () => [MB(), MALHA()],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { chegada, rumo, monocultura };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/${COL}/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
// Como na biodiesel-br: o rótulo do oceano do motor fica em cima de Trindade; este entra ao largo da Bahia.
const OCEANO = [-33.5, -16];
const comOceano = (t) => {
  const { mapa, sobreMapa } = t;
  return Object.assign(t, {
    mapa: () => ({ ...mapa(), oceano: false }),
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
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `${COL}-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
