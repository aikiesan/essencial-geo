#!/usr/bin/env node
/**
 * Coleção «O ritmo da biomassa» (Brasil) — desenha uma prancha a partir do cache de preparar.py (uso interno).
 *
 *   node scripts/colecoes/ritmo-biomassa-br/prancha.mjs safras|fator|seca
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  RAIZ, LP, SERIF, MONO, CINZA, PAPEL, TINTA, esc, nf, f1, lingua, largura,
  gerarPrancha, rotuloPainel, usarBrasil,
} from '../lib/prancha-sp.mjs';
import { legendaCirculos } from '../lib/arte.mjs';

export const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'ritmo-biomassa-br', 'serie.json'), 'utf8'));
const TOTAL = 3; // pranchas da coleção
const SEM_ESTACAO = '#b8bec4';
const UF_SEM_ESTACAO = '#e2e5e8';
const UF_SEM_SERIE = '#f6f6f4';
const BORDA = '#5c6166';

const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `ritmo-biomassa-br-${nome}.json`), 'utf8'));
const L = (pt, en) => (lingua() === 'en' ? en : pt);
const serie = (i) => () => L(`O RITMO DA BIOMASSA · ${i}/${TOTAL}`, `THE RHYTHM OF BIOMASS · ${i}/${TOTAL}`);
const MESES = () => L(['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
const MESES_LONGOS = () => L(['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);
const INICIAIS = () => ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const pc = (v, casas = 0) => `${nf(v, casas)} %`;
const ref = (r) => `${r.slice(8, 10)}/${r.slice(5, 7)}/${r.slice(0, 4)}`;
const raioMW = (mw) => 2.5 + 1.55 * Math.sqrt(mw);
const soma = (a, ms) => ms.reduce((t, m) => t + a[m - 1], 0);

/** Mistura a cor com branco (f = 0 → cor; 1 → branco). */
const clarear = (cor, f) => `#${[1, 3, 5].map((i) => {
  const c = parseInt(cor.slice(i, i + 2), 16);
  return Math.round(c + (255 - c) * f).toString(16).padStart(2, '0');
}).join('')}`;

/** Ponto no relógio do ano: janeiro no alto, sentido horário; `m` em meses (0 = início de janeiro). */
const relogio = (cx, cy, r, m) => {
  const a = (m / 12) * 2 * Math.PI;
  return [cx + r * Math.sin(a), cy - r * Math.cos(a)];
};

/** Setor anular do mês `i` (0–11), entre os raios r0 e r1. */
function setor(cx, cy, r0, r1, i, folga = 0.04) {
  const [a0, a1] = [i + folga, i + 1 - folga];
  const [x0, y0] = relogio(cx, cy, r1, a0);
  const [x1, y1] = relogio(cx, cy, r1, a1);
  const [x2, y2] = relogio(cx, cy, r0, a1);
  const [x3, y3] = relogio(cx, cy, r0, a0);
  return `M${f1(x0)} ${f1(y0)}A${f1(r1)} ${f1(r1)} 0 0 1 ${f1(x1)} ${f1(y1)}L${f1(x2)} ${f1(y2)}${r0 > 0 ? `A${f1(r0)} ${f1(r0)} 0 0 0 ${f1(x3)} ${f1(y3)}` : ''}Z`;
}

/**
 * Rosa do ano: 12 setores, um por mês, com o raio proporcional à raiz da parcela do mês na geração do ano (a mesma
 * escala em todas as rosas: `rMax` é o raio da parcela `pMax`, em %). O círculo tracejado é o ano sem estação (1/12).
 */
function rosa(perfil, cx, cy, rMax, pMax, cores, { r0 = 5 } = {}) {
  const s = [];
  const r = (p) => r0 + (rMax - r0) * Math.sqrt(p / pMax);
  s.push(`<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(rMax)}" fill="none" stroke="#dfe2e5" stroke-width=".8"/>`);
  perfil.forEach((p, i) => s.push(`<path d="${setor(cx, cy, r0, r(p), i)}" fill="${cores[i]}"/>`));
  s.push(`<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r(100 / 12))}" fill="none" stroke="${TINTA}" stroke-width=".9" stroke-dasharray="3 3"/>`);
  INICIAIS().forEach((t, i) => {
    const [x, y] = relogio(cx, cy, rMax + 10, i + 0.5);
    s.push(`<text x="${f1(x)}" y="${f1(y + 4)}" text-anchor="middle" font-family="${MONO}" font-size="10.5" fill="${CINZA}">${t}</text>`);
  });
  return s.join('\n');
}

/** Anel de legenda dos meses: 12 setores com as cores do mês de pico e os meses por fora. */
function anelMeses(cx, cy, r0, r1, cores, { tamanho = 12 } = {}) {
  const s = cores.map((c, i) => `<path d="${setor(cx, cy, r0, r1, i, 0.03)}" fill="${c}"/>`);
  MESES().forEach((t, i) => {
    const [x, y] = relogio(cx, cy, r1 + tamanho + 2, i + 0.5);
    s.push(`<text x="${f1(x)}" y="${f1(y + tamanho * 0.35)}" text-anchor="middle" font-family="${MONO}" font-size="${tamanho}" fill="${TINTA}">${t}</text>`);
  });
  return s.join('\n');
}

/** Fase do perfil (média circular), em meses a partir de abril: ordena os estados pela época da geração. */
function fase(perfil) {
  let [sx, sy] = [0, 0];
  perfil.forEach((p, i) => {
    const a = ((i + 0.5) / 12) * 2 * Math.PI;
    sx += p * Math.cos(a);
    sy += p * Math.sin(a);
  });
  const m = ((Math.atan2(sy, sx) / (2 * Math.PI)) * 12 + 12) % 12;
  return (m - 3 + 12) % 12;
}

const fontesComuns = (c) => [
  L('ONS, geração por usina em base horária, 2015–2024', 'ONS, hourly generation by plant, 2015–2024'),
  L(`ANEEL, SIGA (dados abertos, ${ref(c.referencia)})`, `ANEEL, SIGA (open data, ${ref(c.referencia)})`),
  L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
];

/* ------------------------------------------------------------------ 1 duas safras, um país */
async function safras() {
  const c = await ler('safras');
  const COR = c.cores_mes;
  const forte = (f) => f >= c.forca_min;
  const corPonto = (pico, forca) => (forte(forca) ? COR[pico - 1] : SEM_ESTACAO);
  const porUf = Object.fromEntries(c.ufs.map((u) => [u.uf, u]));
  const corUf = (uf) => {
    const u = porUf[uf];
    if (!u) return UF_SEM_SERIE;
    return forte(u.forca) ? clarear(COR[u.pico - 1], 0.55) : UF_SEM_ESTACAO;
  };
  const pontos = c.pontos.map(([lon, lat, mw, pico, forca]) => ({ coord: [lon, lat], r: raioMW(mw), cor: corPonto(pico, forca), opacidade: 0.92, bordaLargura: 1.1 }));
  const al = porUf.AL;
  const alSafra = soma(al.perfil, [9, 10, 11, 12, 1, 2, 3]);
  const cana = c.pontos.filter((p) => p[5] === 'cana');
  const centro = [cana.reduce((t, p) => t + p[0], 0) / cana.length, cana.reduce((t, p) => t + p[1], 0) / cana.length];
  const suzano = c.pontos.find((p) => p[7].startsWith('Suzano'));

  const circulos = (y, x = 0) => legendaCirculos([100, 30, 5], raioMW, (v) => L(`${nf(v)} MW médios`, `${nf(v)} average MW`), { x, y, cor: CINZA, tamanho: 13 });
  const chaveCinza = (x, y) => `<circle cx="${x + 8}" cy="${y - 5}" r="8" fill="${SEM_ESTACAO}" stroke="${PAPEL}"/>
<text x="${x + 24}" y="${y}" font-family="${SERIF}" font-size="15">${L('sem estação marcada', 'no marked season')}</text>
<text x="${x + 24}" y="${y + 17}" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L(`pico < ${nf(c.forca_min, 1)} × a média do ano`, `peak < ${nf(c.forca_min, 1)} × the yearly mean`))}</text>`;
  const chaveUf = (x, y) => {
    const s = [];
    const itens = [
      [clarear(COR[6], 0.55), L('pequenas térmicas: pico em julho', 'small thermal plants: peak in July')],
      [clarear(COR[11], 0.55), L('pequenas térmicas: pico em dezembro', 'small thermal plants: peak in December')],
      [UF_SEM_ESTACAO, L('pequenas térmicas sem estação', 'small thermal plants, no season')],
      [UF_SEM_SERIE, L('sem série no ONS', 'no ONS series')],
    ];
    itens.forEach(([cor, rot], i) => {
      s.push(`<rect x="${x}" y="${y + i * 21 - 12}" width="22" height="14" fill="${cor}" stroke="${BORDA}" stroke-width=".6"/>`);
      s.push(`<text x="${x + 32}" y="${y + i * 21}" font-family="${SERIF}" font-size="14.5">${esc(rot)}</text>`);
    });
    return { svg: s.join('\n'), altura: itens.length * 21 };
  };
  return () => ({
    layout: 'um',
    motivo: 'cana',
    serie: serie(1),
    titulo: () => L('Duas safras, um país', 'Two harvests, one country'),
    subtitulo: () => L('Uma safra no inverno, outra no verão', 'One harvest in winter, the other in summer'),
    descricao: () => L(
      `Mês de maior geração de ${nf(c.n_mapa)} unidades a biomassa que o ONS mede uma a uma (2015–2024) e das pequenas térmicas somadas por estado (2022–2024). O ONS conta a menos as usinas pequenas, que não despacha`,
      `Peak month of ${nf(c.n_mapa)} biomass units that ONS measures one by one (2015–2024) and of the small thermal plants summed by state (2022–2024). ONS undercounts the small plants it does not dispatch`),
    mapa: () => ({
      preencher: corUf,
      bordaMunicipio: 0.9,
      bordaUnidadeCor: '#9aa1a8',
      semRgint: true,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      pontos,
      chamadas: [{
        coord: centro, dx: -360, dy: 250,
        titulo: L(`${nf(c.n_cana)} UNIDADES DE CANA · PICO EM ${MESES_LONGOS()[c.cana_cs_pico - 1].toUpperCase()}`, `${nf(c.n_cana)} CANE UNITS · PEAK IN ${MESES_LONGOS()[c.cana_cs_pico - 1].toUpperCase()}`),
        linhas: L([`${pc(c.cana_cs_safra_pct)} da geração de abril a novembro,`, 'na safra do Centro-Sul'],
          [`${pc(c.cana_cs_safra_pct)} of generation from April to November,`, 'the Centre-South harvest']),
      }, {
        coord: [-36.6, -9.6], dx: 12, dy: 470,
        titulo: L(`ALAGOAS · PICO EM ${MESES_LONGOS()[al.pico - 1].toUpperCase()}`, `ALAGOAS · PEAK IN ${MESES_LONGOS()[al.pico - 1].toUpperCase()}`),
        linhas: L([`${pc(alSafra)} da geração de set. a mar.`, `e ${pc(soma(al.perfil, [6, 7, 8]))} de junho a agosto`],
          [`${pc(alSafra)} of output from Sep to Mar`, `and ${pc(soma(al.perfil, [6, 7, 8]))} from June to August`]),
      }, {
        coord: [suzano[0], suzano[1]], dx: -250, dy: -170,
        titulo: L('SUZANO MARANHÃO · CELULOSE', 'SUZANO MARANHÃO · PULP'),
        linhas: L([`${nf(suzano[2], 0)} MW médios, sem estação:`, 'a fábrica queima licor negro o ano todo'],
          [`${nf(suzano[2], 0)} average MW, no season:`, 'the mill burns black liquor all year']),
      }],
    }),
    legendaFigura: () => {
      const s = [`<text x="0" y="14" font-family="${MONO}" font-size="14" letter-spacing="2" fill="${CINZA}">${L('MÊS DE MAIOR GERAÇÃO', 'PEAK MONTH')}</text>`];
      s.push(anelMeses(100, 118, 42, 70, COR, { tamanho: 13 }));
      let y = 236;
      s.push(chaveCinza(0, y));
      y += 46;
      const lc = circulos(y);
      s.push(lc.svg);
      y += lc.altura + 30;
      const cu = chaveUf(0, y);
      s.push(cu.svg);
      return { svg: s.join('\n'), altura: y + cu.altura, largura: 300, canto: 'se' };
    },
    numeros: () => [
      [`${nf(c.cana_pico_jun_ago)} ${L('de', 'of')} ${nf(c.n_cana)}`, [L('unidades de cana do', 'Centre-South cane units'), L('Centro-Sul: pico em jun.–ago.', 'peak in Jun–Aug')]],
      [pc(c.cana_cs_safra_pct), [L('da geração delas cai', 'of their generation falls'), L('de abril a novembro', 'from April to November')]],
      [pc(c.pqu_ne_safra_pct), [L('das pequenas térmicas do', 'of Northeast small thermal'), L('Nordeste: setembro a março', 'output: September to March')]],
      [`${nf(c.ne_cana_com_ano_valido)}`, [L('usinas de cana do Nordeste', 'Northeast cane mills with'), L('com série usável no ONS', 'a usable ONS series')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('PARCELA DE CADA MÊS NA GERAÇÃO DO ANO', 'EACH MONTH’S SHARE OF THE YEAR’S OUTPUT'), y)];
      const rMax = 42;
      const cy = y + 22 + rMax + 12;
      const rosas = [
        [c.rosas.cana_cs, L('CENTRO-SUL', 'CENTRE-SOUTH'), L(`${nf(c.n_cana)} unidades de cana`, `${nf(c.n_cana)} cane units`)],
        [c.rosas.pqu_cs, L('CENTRO-SUL', 'CENTRE-SOUTH'), L('pequenas térmicas', 'small thermal plants')],
        [c.rosas.pqu_ne, L('NORDESTE', 'NORTHEAST'), L('pequenas térmicas', 'small thermal plants')],
      ];
      const pMax = Math.max(...rosas.flatMap(([p]) => p));
      rosas.forEach(([p, t1, t2], i) => {
        const cx = 84 + i * ((LP - 168) / 2);
        s.push(rosa(p, cx, cy, rMax, pMax, COR));
        s.push(`<text x="${f1(cx)}" y="${cy + rMax + 30}" text-anchor="middle" font-family="${MONO}" font-size="12" letter-spacing="1.5">${t1}</text>`);
        s.push(`<text x="${f1(cx)}" y="${cy + rMax + 46}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="14" fill="#4f4a41">${esc(t2)}</text>`);
      });
      y = cy + rMax + 78;
      // Faixa de meses por estado: a cor do mês, mais forte quanto maior a parcela.
      s.push(rotuloPainel(L('PEQUENAS TÉRMICAS (COMBUSTÍVEL NÃO INFORMADO)', 'SMALL THERMAL PLANTS (FUEL NOT REPORTED)'), y));
      y += 22;
      const x0 = 34;
      const cw = 25;
      const rh = 10.4;
      INICIAIS().forEach((t, i) => s.push(`<text x="${x0 + i * cw + cw / 2}" y="${y}" text-anchor="middle" font-family="${MONO}" font-size="10.5" fill="${CINZA}">${t}</text>`));
      const xMw = x0 + 12 * cw + 78;
      s.push(`<text x="${xMw}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="10.5" fill="${CINZA}">${L('MW méd.', 'avg MW')}</text>`);
      s.push(`<text x="${LP}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="10.5" fill="${CINZA}">${L('% bagaço ≤ 30 MW', '% bagasse ≤ 30 MW')}</text>`);
      y += 6;
      const ordem = [...c.ufs].sort((a, b) => (forte(b.forca) - forte(a.forca)) || (fase(a.perfil) - fase(b.perfil)));
      const pMaxUf = 18;
      for (const u of ordem) {
        const f = forte(u.forca);
        s.push(`<text x="0" y="${f1(y + rh - 2.2)}" font-family="${MONO}" font-size="10.5" fill="${f ? TINTA : CINZA}">${u.uf}</text>`);
        u.perfil.forEach((p, i) => {
          s.push(`<rect x="${x0 + i * cw}" y="${f1(y)}" width="${cw - 1.5}" height="${f1(rh - 1.5)}" fill="#f2f3f4"/>`);
          const op = Math.min(1, p / pMaxUf);
          if (op > 0.01) s.push(`<rect x="${x0 + i * cw}" y="${f1(y)}" width="${cw - 1.5}" height="${f1(rh - 1.5)}" fill="${f ? COR[i] : '#7a8189'}" fill-opacity="${f1(op * 100) / 100}"/>`);
        });
        s.push(`<text x="${xMw}" y="${f1(y + rh - 2.2)}" text-anchor="end" font-family="${MONO}" font-size="10.5">${nf(u.mw, u.mw < 10 ? 1 : 0)}</text>`);
        s.push(`<text x="${LP}" y="${f1(y + rh - 2.2)}" text-anchor="end" font-family="${MONO}" font-size="10.5" fill="${CINZA}">${u.bagaco_ate30_pct == null ? '–' : pc(u.bagaco_ate30_pct)}</text>`);
        y += rh;
      }
      y += 12;
      const lc = circulos(y);
      s.push(lc.svg);
      s.push(chaveCinza(LP - 250, y + 8));
      s.push(`<path d="M${LP - 250} ${y + 41}h18" stroke="${TINTA}" stroke-width=".9" stroke-dasharray="3 3"/>`);
      s.push(`<text x="${LP - 226}" y="${y + 45}" font-family="${MONO}" font-size="11" fill="${CINZA}">${L('rosa: ano sem estação (1/12)', 'rose: a year with no season (1/12)')}</text>`);
      return { svg: s.join('\n'), y: y + lc.altura + 6 };
    },
    fontes: () => fontesComuns(c),
  });
}

/* ------------------------------------------------------------------ 2 o que a usina gera de fato */
async function fator() {
  const c = await ler('fator');
  const COR = c.classes.map((k) => k.cor);
  const raio = (mw) => 2.1 * Math.sqrt(mw);
  // Anel: a potência no papel (SIGA); disco: a geração média (ONS), na mesma escala de área.
  const pontos = c.pontos.flatMap(([lon, lat, inst, ger, k]) => [
    { coord: [lon, lat], r: Math.max(raio(inst), 3), cor: BORDA, anel: true, largura: 1.3 },
    { coord: [lon, lat], r: Math.max(raio(ger), 1.6), cor: COR[k], opacidade: 0.95, borda: BORDA, bordaLargura: 0.8 },
  ]);
  const u = Object.fromEntries(c.usinas.map((r) => [r.nome, r]));
  const klabin = u['Klabin Celulose'];
  const cmpc = c.usinas.find((r) => r.nome.startsWith('CMPC'));
  const grandes = c.usinas.filter((r) => r.mw_instalado >= 100).sort((a, b) => b.fator - a.fator);
  const maisAlto = grandes[0];
  const cana = c.grupos.find((g) => g.chave === 'cana');
  const canaPts = c.usinas.filter((r) => r.grupo === 'cana');
  const centro = [canaPts.reduce((t, p) => t + p.coord[0], 0) / canaPts.length, canaPts.reduce((t, p) => t + p.coord[1], 0) / canaPts.length];
  const biogas = c.grupos.find((g) => g.chave === 'biogas');
  const gw = (mw, casas = 2) => nf(mw / 1000, casas);
  const rotGrupo = () => ({ cana: L('bagaço de cana', 'sugarcane bagasse'), licor: L('licor negro', 'black liquor'), madeira: L('madeira', 'wood'), outros: L('outros', 'others') });
  const MW = (v) => nf(v, 0);
  const encaixe = (x, y, inst, ger, k) => `<circle cx="${x}" cy="${y}" r="${f1(raio(inst))}" fill="none" stroke="${BORDA}" stroke-width="1.3"/>
<circle cx="${x}" cy="${y}" r="${f1(raio(ger))}" fill="${COR[k]}" stroke="${BORDA}" stroke-width=".8"/>`;
  const chaveCirculos = (x, y) => {
    // Um exemplo: 300 MW no papel, 100 MW médios na rede (fator de 33 %).
    const R = raio(300);
    const cx = x + R;
    const cy = y + R;
    return { svg: `${encaixe(cx, cy, 300, 100, 1)}
<path d="M${cx} ${f1(cy - R)}H${f1(cx + R + 14)}" stroke="${TINTA}" stroke-width=".7"/>
<text x="${f1(cx + R + 20)}" y="${f1(cy - R + 5)}" font-family="${MONO}" font-size="12.5">${L('anel: 300 MW de potência (SIGA)', 'ring: 300 MW of capacity (SIGA)')}</text>
<path d="M${cx} ${f1(cy - raio(100))}H${f1(cx + R + 14)}" stroke="${TINTA}" stroke-width=".7"/>
<text x="${f1(cx + R + 20)}" y="${f1(cy - raio(100) + 14)}" font-family="${MONO}" font-size="12.5">${L('disco: 100 MW médios gerados (ONS)', 'disc: 100 average MW generated (ONS)')}</text>
<text x="${f1(cx + R + 20)}" y="${f1(cy - raio(100) + 31)}" font-family="${MONO}" font-size="12.5" fill="${CINZA}">${L('fator de capacidade: 33 %', 'capacity factor: 33 %')}</text>`, altura: 2 * R };
  };
  const chaveClasses = (x, y, larg) => {
    const s = [];
    const w = larg / COR.length;
    c.classes.forEach((k, i) => {
      s.push(`<rect x="${f1(x + i * w)}" y="${y}" width="${f1(w - 3)}" height="14" fill="${k.cor}" stroke="${BORDA}" stroke-width=".6"/>`);
    });
    const lim = [0, ...c.limites, 100];
    lim.forEach((v, i) => {
      if (i === 0 || i === lim.length - 1) return;
      s.push(`<text x="${f1(x + i * w - 1.5)}" y="${y + 30}" text-anchor="middle" font-family="${MONO}" font-size="11.5">${v}</text>`);
    });
    s.push(`<text x="${f1(x + larg)}" y="${y + 30}" text-anchor="end" font-family="${MONO}" font-size="11.5" fill="${CINZA}">%</text>`);
    return s.join('\n');
  };
  return () => ({
    layout: 'um',
    motivo: 'energia',
    serie: serie(2),
    titulo: () => L('O que a usina gera de fato', 'What a plant really yields'),
    subtitulo: () => L('A potência no papel e a energia que chega à rede', 'Capacity on paper, energy on the grid'),
    descricao: () => L(
      `Geração média de ${nf(c.n)} usinas a biomassa que o ONS mede uma a uma (anos válidos, 2015–2024) sobre a potência fiscalizada no SIGA. As pequenas, que o ONS não despacha, ficam de fora`,
      `Mean output of ${nf(c.n)} biomass plants that ONS measures one by one (valid years, 2015–2024) over their inspected SIGA capacity. Small plants, which ONS does not dispatch, are left out`),
    mapa: () => ({
      preencher: () => '#f1f2f3',
      bordaMunicipio: 0.9,
      bordaUnidadeCor: '#c9ced3',
      semRgint: true,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      pontos,
      chamadas: [{
        coord: klabin.coord, dx: 330, dy: 120,
        titulo: `KLABIN · ${MW(klabin.mw_instalado)} → ${MW(klabin.mw_gerado)} MW`,
        linhas: L([`fator de ${pc(klabin.fator)}: a fábrica de celulose`, 'queima licor negro o ano todo'],
          [`a ${pc(klabin.fator)} factor: the pulp mill`, 'burns black liquor all year round']),
      }, {
        coord: cmpc.coord, dx: -300, dy: 120,
        titulo: `CMPC GUAÍBA · ${MW(cmpc.mw_instalado)} → ${MW(cmpc.mw_gerado)} MW`,
        linhas: L([`fator de ${pc(cmpc.fator)}: a maior distância`, 'entre o papel e a rede'],
          [`a ${pc(cmpc.fator)} factor: the widest gap`, 'between paper and grid']),
      }, {
        coord: maisAlto.coord, dx: 280, dy: -60,
        titulo: `${maisAlto.nome.toUpperCase()} · ${MW(maisAlto.mw_instalado)} → ${MW(maisAlto.mw_gerado)} MW`,
        linhas: L([`fator de ${pc(maisAlto.fator)}, o maior entre`, 'as usinas de 100 MW ou mais'],
          [`a ${pc(maisAlto.fator)} factor, the highest among`, 'plants of 100 MW or more']),
      }, {
        coord: centro, dx: -380, dy: 220,
        titulo: L(`${nf(cana.n)} USINAS DE CANA · ${pc(cana.fator)}`, `${nf(cana.n)} CANE MILLS · ${pc(cana.fator)}`),
        linhas: L([`${gw(cana.mw_instalado, 1)} GW no papel, ${gw(cana.mw_gerado, 2)} GW médios:`, 'a caldeira para na entressafra'],
          [`${gw(cana.mw_instalado, 1)} GW on paper, ${gw(cana.mw_gerado, 2)} average GW:`, 'the boilers stop between harvests']),
      }],
    }),
    legendaFigura: () => {
      const s = [`<text x="0" y="14" font-family="${MONO}" font-size="14" letter-spacing="2" fill="${CINZA}">${L('FATOR DE CAPACIDADE', 'CAPACITY FACTOR')}</text>`];
      s.push(chaveClasses(0, 30, 300));
      let y = 98;
      s.push(`<text x="0" y="${y - 6}" font-family="${MONO}" font-size="14" letter-spacing="2" fill="${CINZA}">${L('PAPEL E REDE', 'PAPER AND GRID')}</text>`);
      const cc = chaveCirculos(0, y + 8);
      s.push(cc.svg);
      return { svg: s.join('\n'), altura: y + 8 + cc.altura, largura: 420, canto: 'se' };
    },
    numeros: () => [
      [pc(c.fator), [L('fator de capacidade', 'capacity factor of the'), L(`das ${nf(c.n)} usinas, somadas`, `${nf(c.n)} plants combined`)]],
      [`${gw(c.mw_instalado, 1)} → ${gw(c.mw_gerado, 1)} GW`, [L('de potência no SIGA', 'of SIGA capacity'), L('para a geração média no ONS', 'to mean ONS generation')]],
      [pc((c.mw_instalado / c.siga_mw) * 100), [L('da potência a biomassa', 'of the country’s biomass'), L('do país está nessas usinas', 'capacity is in these plants')]],
      [`${nf(0)} ${L('de', 'of')} ${nf(biogas.siga_n)}`, [L('usinas a biogás do SIGA', 'SIGA biogas plants'), L('aparecem uma a uma no ONS', 'appear one by one in ONS')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('FATOR DE CAPACIDADE · CADA PONTO, UMA USINA', 'CAPACITY FACTOR · EACH DOT, ONE PLANT'), y)];
      y += 30;
      const xa = 168;
      const xb = LP - 64;
      const X = (v) => xa + ((xb - xa) * Math.min(v, 100)) / 100;
      const rp = (mw) => 2 + 0.55 * Math.sqrt(mw);
      const linhas = c.grupos.filter((g) => g.n > 0);
      const rh = 34;
      for (const [v, t] of [[0, '0'], [25, '25'], [50, '50'], [75, '75'], [100, '100 %']]) {
        s.push(`<path d="M${f1(X(v))} ${y - 8}V${y + linhas.length * rh - 8}" stroke="#dfe2e5" stroke-width=".8"/>`);
        s.push(`<text x="${f1(X(v))}" y="${y + linhas.length * rh + 8}" text-anchor="middle" font-family="${MONO}" font-size="11" fill="${CINZA}">${t}</text>`);
      }
      for (const g of linhas) {
        const yc = y + rh / 2 - 8;
        s.push(`<text x="0" y="${yc + 5}" font-family="${SERIF}" font-size="15">${esc(rotGrupo()[g.chave])} <tspan font-family="${MONO}" font-size="11" fill="${CINZA}">${nf(g.n)}</tspan></text>`);
        for (const [, , f, mw] of [...g.usinas].sort((a, b) => b[3] - a[3])) {
          s.push(`<circle cx="${f1(X(f))}" cy="${yc}" r="${f1(rp(mw))}" fill="${g.cor}" fill-opacity=".55" stroke="${g.cor}" stroke-width=".9"/>`);
        }
        s.push(`<path d="M${f1(X(g.fator))} ${yc - 13}V${yc + 13}" stroke="${TINTA}" stroke-width="2"/>`);
        s.push(`<text x="${LP}" y="${yc + 5}" text-anchor="end" font-family="${MONO}" font-size="13">${pc(g.fator)}</text>`);
        y += rh;
      }
      y += 26;
      s.push(`<path d="M0 ${y - 4}h3" stroke="${TINTA}" stroke-width="2"/><path d="M1.5 ${y - 11}v14" stroke="${TINTA}" stroke-width="2"/>`);
      s.push(`<text x="12" y="${y}" font-family="${MONO}" font-size="11" fill="${CINZA}">${L('o traço: o fator do grupo, com as usinas somadas', 'the bar: the group’s factor, plants combined')}</text>`);
      s.push(`<text x="0" y="${y + 17}" font-family="${MONO}" font-size="11" fill="${CINZA}">${L(`biogás: nenhuma das ${nf(biogas.siga_n)} usinas do SIGA no ONS`, `biogas: none of the ${nf(biogas.siga_n)} SIGA plants in ONS`)}</text>`);
      y += 42;
      // Por estado: a potência a biomassa em operação (SIGA), a das usinas medidas pelo ONS e a geração média delas.
      s.push(rotuloPainel(L('NO PAPEL E NA REDE, POR ESTADO · MW', 'ON PAPER AND ON THE GRID, BY STATE · MW'), y));
      y += 16;
      const ufs = c.ufs.slice(0, 9);
      const max = ufs[0].siga;
      const x0 = 36;
      const wMax = LP - x0 - 150;
      const W = (v) => (v / max) * wMax;
      const bh = 15;
      for (const e of ufs) {
        s.push(`<text x="0" y="${y + bh - 3}" font-family="${MONO}" font-size="11.5">${e.uf}</text>`);
        s.push(`<rect x="${x0}" y="${y}" width="${f1(Math.max(W(e.siga), 0.8))}" height="${bh}" fill="#e3e6e9"/>`);
        if (e.ons_mw > 0) {
          s.push(`<rect x="${x0}" y="${y + 2}" width="${f1(W(e.ons_mw))}" height="${bh - 4}" fill="${PAPEL}" stroke="${BORDA}" stroke-width="1"/>`);
          s.push(`<rect x="${x0}" y="${y + 4}" width="${f1(Math.max(W(e.ons_ger), 0.8))}" height="${bh - 8}" fill="${COR[3]}"/>`);
        }
        s.push(`<text x="${LP}" y="${y + bh - 3}" text-anchor="end" font-family="${MONO}" font-size="11">${MW(e.siga)} · ${e.ons_mw > 0 ? `${MW(e.ons_mw)} · ${MW(e.ons_ger)}` : '–'}</text>`);
        y += bh + 6;
      }
      y += 12;
      const chaves = [
        [`<rect x="0" y="${y - 11}" width="20" height="13" fill="#e3e6e9"/>`, L('SIGA, em operação', 'SIGA, in operation')],
        [`<rect x="0" y="${y - 10}" width="20" height="11" fill="${PAPEL}" stroke="${BORDA}"/>`, L('medidas pelo ONS', 'measured by ONS')],
        [`<rect x="0" y="${y - 8}" width="20" height="7" fill="${COR[3]}"/>`, L('geração média', 'mean generation')],
      ];
      let xk = 0;
      for (const [svg, t] of chaves) {
        s.push(`<g transform="translate(${xk} 0)">${svg}<text x="28" y="${y}" font-family="${MONO}" font-size="11" fill="${CINZA}">${t}</text></g>`);
        xk += 38 + largura(t, 11, { mono: true });
      }
      y += 34;
      s.push(chaveClasses(0, y - 10, 210));
      const cc = chaveCirculos(232, y - 14);
      s.push(cc.svg.replace(/font-size="12.5"/g, 'font-size="11"'));
      return { svg: s.join('\n'), y: y + Math.max(cc.altura - 14, 26) + 4 };
    },
    fontes: () => fontesComuns(c),
  });
}

/* ------------------------------------------------------------------ 3 a biomassa na seca */
async function seca() {
  const c = await ler('seca');
  const COR = c.classes.map((k) => k.cor);
  const classe = (v) => c.limites.filter((l) => v >= l).length;
  const porUf = Object.fromEntries(c.ufs.map((u) => [u.uf, u]));
  const corUf = (uf) => (porUf[uf] ? clarear(COR[porUf[uf].classe], 0.5) : UF_SEM_SERIE);
  const pontos = c.pontos.map(([lon, lat, mw, k]) => ({ coord: [lon, lat], r: raioMW(mw), cor: COR[k], opacidade: 0.95, borda: BORDA, bordaLargura: 0.9 }));
  const sin = c.sin;
  const al = porUf.AL;
  const go = porUf.GO;
  const cana = c.pontos.filter((p) => p[5] === 'cana');
  const centro = [cana.reduce((t, p) => t + p[0], 0) / cana.length, cana.reduce((t, p) => t + p[1], 0) / cana.length];
  const suzano = c.pontos.find((p) => p[6].startsWith('Suzano'));
  const cel = c.celulose.map((r) => r[2]);
  const brMax = Math.max(...sin.bio_parcela);
  const brMin = Math.min(...sin.bio_parcela);
  const mMax = sin.bio_parcela.indexOf(brMax);
  const earMax = Math.max(...sin.ear);
  const earMin = Math.min(...sin.ear);

  const circulos = (y, x = 0) => legendaCirculos([100, 30, 5], raioMW, (v) => L(`${nf(v)} MW médios`, `${nf(v)} average MW`), { x, y, cor: CINZA, tamanho: 13 });
  const rotulosClasse = () => L(
    ['menos de 45 %', '45 a 55 %', '55 a 62 % (sem estação: 58 %)', '62 a 75 %', '75 a 85 %', '85 % ou mais'],
    ['under 45 %', '45 to 55 %', '55 to 62 % (no season: 58 %)', '62 to 75 %', '75 to 85 %', '85 % or more']);
  return () => ({
    layout: 'um',
    motivo: 'agua',
    serie: serie(3),
    titulo: () => L('A biomassa na seca', 'Dry-season biomass'),
    subtitulo: () => L('O bagaço gera quando os reservatórios baixam', 'Bagasse generates as the reservoirs fall'),
    descricao: () => L(
      `Parcela da geração do ano que sai de maio a novembro, os meses em que os reservatórios do SIN se esvaziam: ${nf(c.n_mapa)} usinas e conjuntos a biomassa do ONS (2015–2024) e, nos estados, as pequenas térmicas (2022–2024). O ONS conta a menos as usinas pequenas, que não despacha`,
      `Share of each year’s generation produced from May to November, the months when the SIN reservoirs draw down: ${nf(c.n_mapa)} ONS biomass plants and plant groups (2015–2024) and, in the states, the small thermal plants (2022–2024). ONS undercounts the small plants it does not dispatch`),
    mapa: () => ({
      preencher: corUf,
      bordaMunicipio: 0.9,
      bordaUnidadeCor: '#9aa1a8',
      semRgint: true,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      pontos,
      chamadas: [{
        coord: centro, dx: -360, dy: 250,
        titulo: L(`CANA NO CENTRO-SUL · MEDIANA DE ${pc(c.cana_mediana)}`, `CENTRE-SOUTH CANE · MEDIAN ${pc(c.cana_mediana)}`),
        linhas: L([`${nf(c.cana_75)} das ${nf(c.cana_n)} unidades geram 75 % ou mais`, 'do ano de maio a novembro'],
          [`${nf(c.cana_75)} of ${nf(c.cana_n)} units generate 75 % or more`, 'of their year from May to November']),
      }, {
        coord: [-36.6, -9.6], dx: 12, dy: 470,
        titulo: L(`ALAGOAS · ${pc(al.seca)} DE MAIO A NOV.`, `ALAGOAS · ${pc(al.seca)} MAY TO NOV`),
        linhas: L(['a safra vai de setembro a março', 'e para de junho a agosto'],
          ['the harvest runs Sep to Mar', 'and stops from June to August']),
      }, {
        coord: [suzano[0], suzano[1]], dx: -250, dy: -170,
        titulo: L(`CELULOSE · ${nf(Math.min(...cel), 0)} A ${pc(Math.max(...cel))}`, `PULP · ${nf(Math.min(...cel), 0)} TO ${pc(Math.max(...cel))}`),
        linhas: L(['as fábricas de celulose geram', 'o ano todo, perto dos 58 %'],
          ['pulp mills generate all year,', 'close to the 58 % of no season']),
      }],
    }),
    legendaFigura: () => {
      const s = [`<text x="0" y="14" font-family="${MONO}" font-size="14" letter-spacing="2" fill="${CINZA}">${L('GERAÇÃO DE MAIO A NOVEMBRO', 'GENERATION FROM MAY TO NOVEMBER')}</text>`];
      let y = 40;
      rotulosClasse().forEach((r, i) => {
        const k = COR.length - 1 - i;
        s.push(`<circle cx="10" cy="${y - 5}" r="8" fill="${COR[k]}" stroke="${BORDA}" stroke-width=".9"/>`);
        s.push(`<rect x="26" y="${y - 12}" width="20" height="14" fill="${clarear(COR[k], 0.5)}" stroke="${BORDA}" stroke-width=".6"/>`);
        s.push(`<text x="56" y="${y}" font-family="${SERIF}" font-size="15">${esc(rotulosClasse()[k])}</text>`);
        y += 23;
      });
      s.push(`<text x="0" y="${y + 6}" font-family="${MONO}" font-size="11.5" fill="${CINZA}">${L('círculo: usina · quadro: estado (pequenas térmicas)', 'circle: plant · box: state (small thermal plants)')}</text>`);
      y += 30;
      const lc = circulos(y);
      s.push(lc.svg);
      return { svg: s.join('\n'), altura: y + lc.altura, largura: 360, canto: 'se' };
    },
    numeros: () => [
      [pc(sin.bio_seca_pct), [L('da geração a biomassa do', 'of SIN biomass generation'), L('SIN sai de maio a novembro', 'comes from May to November')]],
      [`${nf(brMin, 1)} → ${nf(brMax, 1)} %`, [L('da geração do SIN, de', 'of SIN generation, from'), L(`jan. a ${MESES()[mMax]}., vem da biomassa`, `Jan to ${MESES()[mMax]}, is biomass`)]],
      [`${nf(earMax, 0)} → ${nf(earMin, 0)} %`, [L('a energia armazenada nos', 'stored energy in the'), L('reservatórios, de maio a nov.', 'reservoirs, May to Nov')]],
      [`${nf(c.acima_75)} ${L('de', 'of')} ${nf(c.n_mapa)}`, [L('unidades geram 75 % ou', 'units generate 75 % or'), L('mais do ano na seca', 'more of their year in the dry')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('O ANO DO SIN · MÉDIA DE 2015 A 2024', 'THE SIN YEAR · MEAN OF 2015 TO 2024'), y)];
      y += 24;
      const x0 = 44;
      const cw = (LP - x0 - 10) / 12;
      const X = (i) => x0 + i * cw;
      const hE = 56;
      const hB = 80;
      const yE = y + 8;
      const yB = yE + hE + 26;
      // Faixa da estação seca (maio a novembro) atrás dos dois gráficos.
      s.push(`<rect x="${f1(X(4))}" y="${yE - 6}" width="${f1(7 * cw)}" height="${yB + hB - yE + 6}" fill="#f3efe6"/>`);
      s.push(`<text x="${f1(X(4) + 3.5 * cw)}" y="${yE + 6}" text-anchor="middle" font-family="${MONO}" font-size="10.5" letter-spacing="1.5" fill="#8a7a5c">${L('MAIO A NOVEMBRO', 'MAY TO NOVEMBER')}</text>`);
      // Reservatórios: energia armazenada (% do máximo), média dos anos, numa escala de 25 a 65 %.
      const yEar = (v) => yE + hE - ((v - 25) / 40) * hE;
      s.push(`<path d="M${sin.ear.map((v, i) => `${f1(X(i) + cw / 2)} ${f1(yEar(v))}`).join('L')}" fill="none" stroke="#234e70" stroke-width="2.2"/>`);
      sin.ear.forEach((v, i) => {
        s.push(`<circle cx="${f1(X(i) + cw / 2)}" cy="${f1(yEar(v))}" r="2.6" fill="#234e70"/>`);
        if (i === sin.ear.indexOf(earMax) || i === sin.ear.indexOf(earMin) || i === 0) s.push(`<text x="${f1(X(i) + cw / 2)}" y="${f1(yEar(v) - 8)}" text-anchor="middle" font-family="${MONO}" font-size="11" fill="#234e70">${nf(v, 0)}</text>`);
      });
      s.push(`<text x="0" y="${yE + 22}" font-family="${MONO}" font-size="10.5" fill="#234e70">EAR</text>`);
      s.push(`<text x="0" y="${yE + 36}" font-family="${MONO}" font-size="10.5" fill="#234e70">%</text>`);
      // Biomassa: parcela na geração do SIN.
      const yBio = (v) => yB + hB - (v / brMax) * (hB - 16);
      sin.bio_parcela.forEach((v, i) => {
        s.push(`<rect x="${f1(X(i) + 4)}" y="${f1(yBio(v))}" width="${f1(cw - 8)}" height="${f1(yB + hB - yBio(v))}" fill="#c08a2e"/>`);
        s.push(`<text x="${f1(X(i) + cw / 2)}" y="${f1(yBio(v) - 5)}" text-anchor="middle" font-family="${MONO}" font-size="10.5">${nf(v, 1)}</text>`);
      });
      s.push(`<text x="0" y="${yB + 36}" font-family="${MONO}" font-size="10.5" fill="#8a5a1e">BIO</text>`);
      s.push(`<text x="0" y="${yB + 50}" font-family="${MONO}" font-size="10.5" fill="#8a5a1e">%</text>`);
      s.push(`<path d="M${x0} ${yB + hB}H${LP - 10}" stroke="${TINTA}" stroke-width=".8"/>`);
      INICIAIS().forEach((t, i) => s.push(`<text x="${f1(X(i) + cw / 2)}" y="${yB + hB + 16}" text-anchor="middle" font-family="${MONO}" font-size="11" fill="${CINZA}">${t}</text>`));
      y = yB + hB + 34;
      s.push(`<text x="0" y="${y}" font-family="${MONO}" font-size="10.5" fill="${CINZA}">${L('EAR: energia armazenada nos reservatórios, % do máximo (escala de 25 a 65)', 'EAR: energy stored in the reservoirs, % of maximum (scale 25 to 65)')}</text>`);
      s.push(`<text x="0" y="${y + 14}" font-family="${MONO}" font-size="10.5" fill="${CINZA}">${L('BIO: biomassa, % da geração do SIN no mês', 'BIO: biomass, % of SIN generation in the month')}</text>`);
      y += 44;
      // Cada unidade e cada estado na régua da parcela seca.
      s.push(rotuloPainel(L('PARCELA DE MAIO A NOVEMBRO · CADA PONTO, UMA UNIDADE', 'MAY–NOVEMBER SHARE · EACH DOT, ONE UNIT'), y));
      y += 26;
      const xa = 150;
      const xb = LP - 10;
      const v0 = 25;
      const V = (v) => xa + ((xb - xa) * (v - v0)) / (100 - v0);
      const linhas = [
        ['cana', L('bagaço de cana', 'sugarcane bagasse')],
        ['licor', L('licor negro', 'black liquor')],
        ['madeira', L('madeira', 'wood')],
        ['outros', L('outros', 'others')],
      ];
      const rh = 22;
      const altura = (linhas.length + 1) * rh;
      s.push(`<path d="M${f1(V(700 / 12))} ${y - 10}V${y + altura - 8}" stroke="${TINTA}" stroke-width=".9" stroke-dasharray="3 3"/>`);
      for (const [chave, rot] of linhas) {
        const pts = c.pontos.filter((p) => p[5] === chave);
        const yc = y + rh / 2 - 8;
        s.push(`<path d="M${xa} ${yc}H${xb}" stroke="#e3e6e9" stroke-width=".8"/>`);
        s.push(`<text x="0" y="${yc + 5}" font-family="${SERIF}" font-size="15">${esc(rot)} <tspan font-family="${MONO}" font-size="11" fill="${CINZA}">${nf(pts.length)}</tspan></text>`);
        for (const p of [...pts].sort((a, b) => b[2] - a[2])) {
          s.push(`<circle cx="${f1(V(p[4]))}" cy="${yc}" r="${f1(2 + 0.55 * Math.sqrt(p[2]))}" fill="${COR[p[3]]}" fill-opacity=".9" stroke="${BORDA}" stroke-width=".7"/>`);
        }
        y += rh;
      }
      // Pequenas térmicas: um quadradinho por estado, com a sigla dos extremos.
      const yc = y + rh / 2 - 8;
      s.push(`<path d="M${xa} ${yc}H${xb}" stroke="#e3e6e9" stroke-width=".8"/>`);
      s.push(`<text x="0" y="${yc + 5}" font-family="${SERIF}" font-size="15">${L('pequenas térmicas', 'small thermal plants')} <tspan font-family="${MONO}" font-size="11" fill="${CINZA}">${nf(c.ufs.length)}</tspan></text>`);
      for (const u of c.ufs) s.push(`<rect x="${f1(V(u.seca) - 5)}" y="${yc - 5}" width="10" height="10" fill="${clarear(COR[u.classe], 0.35)}" stroke="${BORDA}" stroke-width=".8"/>`);
      for (const u of [c.ufs[0], c.ufs[1], porUf.SP, go]) {
        s.push(`<text x="${f1(V(u.seca))}" y="${yc + 20}" text-anchor="middle" font-family="${MONO}" font-size="10" fill="${CINZA}">${u.uf}</text>`);
      }
      y += rh + 14;
      // Régua com as classes do mapa.
      const lim = [v0, ...c.limites, 100];
      lim.slice(0, -1).forEach((a, i) => s.push(`<rect x="${f1(V(a))}" y="${y}" width="${f1(V(lim[i + 1]) - V(a))}" height="8" fill="${COR[i]}" stroke="${BORDA}" stroke-width=".5"/>`));
      for (const v of [25, ...c.limites, 100]) s.push(`<text x="${f1(V(v))}" y="${y + 22}" text-anchor="middle" font-family="${MONO}" font-size="10.5" fill="${CINZA}">${v}${v === 100 ? ' %' : ''}</text>`);
      s.push(`<text x="${f1(V(700 / 12))}" y="${y - 4}" text-anchor="middle" font-family="${MONO}" font-size="10" fill="${TINTA}">58</text>`);
      y += 46;
      const lc = circulos(y);
      s.push(lc.svg);
      s.push(`<text x="${LP - 250}" y="${y + 14}" font-family="${MONO}" font-size="11" fill="${CINZA}">${L('tracejado: o ano sem estação,', 'dashed: a year with no season,')}</text>`);
      s.push(`<text x="${LP - 250}" y="${y + 29}" font-family="${MONO}" font-size="11" fill="${CINZA}">${L('7 meses em 12 = 58 %', '7 months in 12 = 58 %')}</text>`);
      return { svg: s.join('\n'), y: y + lc.altura + 6 };
    },
    fontes: () => [
      L('ONS, geração por usina e EAR diário, 2015–2024', 'ONS, generation by plant and daily EAR, 2015–2024'),
      L(`ANEEL, SIGA (dados abertos, ${ref(c.referencia)})`, `ANEEL, SIGA (open data, ${ref(c.referencia)})`),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

const TEMAS = { safras, fator, seca };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/ritmo-biomassa-br/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
// O quadro da figura chega a Trindade e Martim Vaz, que o motor desenha com o limite do país: o rótulo do oceano
// (lib/prancha-sp.mjs, em [-31.5, -21]) cai em cima das ilhas na 136, e a legenda do canto sudeste também, na 135 e
// na 137. Só na figura (o tema dela já tem _enquadramento): um ponto invisível nas ilhas dá à legenda o fundo de
// papel do motor e, na 136, o rótulo do oceano vai para o largo da Bahia.
const TRINDADE = [-29.3, -20.5];
const naFigura = (t, rotulo) => {
  const { mapa, sobreMapa } = t;
  return Object.assign(t, {
    mapa: () => {
      const m = mapa();
      return t._enquadramento ? { ...m, oceano: false, pontos: [...(m.pontos ?? []), { coord: TRINDADE, r: 0, opacidade: 0 }] } : m;
    },
    sobreMapa: (proj) => {
      const s = sobreMapa?.(proj) ?? '';
      if (!t._enquadramento || !rotulo) return s;
      const [x, y] = proj([-33.5, -16]);
      return `${s}
<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="19" letter-spacing="5" fill="#6f8796">${L('OCEANO ATLÂNTICO', 'ATLANTIC OCEAN')}</text>`;
    },
  });
};
await usarBrasil();
const e = SERIE.find((s) => s.tema === nome);
const fazer = await TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => naFigura(fazer(), nome === 'fator') });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `ritmo-biomassa-br-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
