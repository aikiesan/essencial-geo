#!/usr/bin/env node
/**
 * Coleção «Dejetos que adubam» — desenha uma prancha a partir do cache de preparar.mjs (uso interno).
 *
 *   node scripts/colecoes/nutrientes-sp/prancha.mjs nitrogenio|fosforo|balanco|digestato
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { geoCentroid } from 'd3-geo';
import { RAIZ, LP, SERIF, MONO, TINTA, CINZA, PAPEL, esc, nf, f1, gerarPrancha, rotuloPainel, municipios } from '../lib/prancha-sp.mjs';
import { L, NEUTRO, pct, grande, barras, legendaBarras, caixaLegenda, nota } from '../lib/painel.mjs';
import { legendaCirculos } from '../lib/arte.mjs';
import { GRUPOS, DIRETIVA, LIM_N, CORES_N, LIM_P, CORES_P, LIM_C, CORES_C } from './preparar.mjs';
import { friso } from './friso.mjs';

const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'nutrientes-sp', 'serie.json'), 'utf8'));
const C = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', 'nutrientes-sp.json'), 'utf8'));
const V = C.valores;
const serie = (i) => () => L(`DEJETOS QUE ADUBAM · ${i}/4`, `MANURE THAT FEEDS THE SOIL · ${i}/4`);
const classe = (v, lim) => { let i = 0; while (i < lim.length && v > lim[i] + 1e-9) i++; return i; };
/** Percentual nas duas línguas: «31 %» / «31%». */
const pc = (v, casas = null) => L(pct(v, casas), `${nf(v, casas ?? (v < 10 ? 1 : 0))}%`);
/** Toneladas em mil: «98 mil t» / «98 thousand t». */
const kt = (v) => `${grande(v)} t`;
const LAV_MIN = 1000;
const SEM_PPM = () => L(`sem dado da PPM (${C.n081.sem_info.length} municípios)`, `no PPM data (${C.n081.sem_info.length} municipalities)`);
const POUCA = () => L(`menos de ${nf(LAV_MIN)} ha colhidos`, `under ${nf(LAV_MIN)} ha harvested`);
const centro = new Map(municipios.map((m) => [m.properties.CD_MUN, geoCentroid(m)]));
const GR = Object.fromEntries(GRUPOS.map(([k, , cor, pt, en]) => [k, { cor, rot: () => L(pt, en) }]));
const AVES = '#c9879a', SUINOS = '#8e5b6e', LEITE = '#a9845f', BOVINOS = '#7c5a3c';

const FONTE = {
  ppm: () => L('IBGE, PPM 2024 (tabelas 3939 e 94)', 'IBGE, PPM 2024 (tables 3939 and 94)'),
  pam: () => L('IBGE, PAM 2024 (tabelas 1612 e 1613)', 'IBGE, PAM 2024 (tables 1612 and 1613)'),
  mapbiomas: () => L('MapBiomas, Coleção 10 (2024)', 'MapBiomas, Collection 10 (2024)'),
  ipcc: () => L('IPCC 2019, vol. 4, cap. 10; MWPS-18 (2004)', 'IPCC 2019, vol. 4, ch. 10; MWPS-18 (2004)'),
  ipni: () => L('IPNI Brasil/NPCT, exportação pelas colheitas', 'IPNI Brazil/NPCT, crop nutrient removal'),
  cp2b: () => L(`CP2B ${C.n084.versao.replace(/^CP2b /, '')}, nível N4`, `CP2B ${C.n084.versao.replace(/^CP2b /, '')}, level N4`),
  malha: () => L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
};

/** Faixa de cores contínua com os limites nas junções e caixas avulsas à direita. */
function faixa(cores, limites, extras = [], { larg = 56 } = {}) {
  const s = [];
  cores.forEach((c, i) => s.push(`<rect x="${i * larg}" y="0" width="${larg}" height="14" fill="${c}" stroke="#1a211a" stroke-width=".6"/>`));
  limites.forEach((l, i) => s.push(`<text x="${(i + 1) * larg}" y="32" text-anchor="middle" font-family="${MONO}" font-size="12">${esc(l)}</text>`));
  let x = cores.length * larg + 22;
  for (const [cor, t] of extras) {
    s.push(`<rect x="${x}" y="0" width="30" height="14" fill="${cor}" stroke="#1a211a" stroke-width=".6"/>`);
    s.push(`<text x="${x + 38}" y="12" font-family="${MONO}" font-size="12" fill="${CINZA}">${esc(t)}</text>`);
    x += 38 + t.length * 7.4 + 18;
  }
  return s.join('\n');
}

/** Legenda de listras (hachura do mapa), na mesma linguagem de caixaLegenda. */
function caixaListras(rot, y, { fundo = CORES_P[2], cor = TINTA } = {}) {
  return `<defs><pattern id="lgx" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-55)"><rect width="5" height="5" fill="${fundo}"/><path d="M0 0V5" stroke="${cor}" stroke-width=".8" stroke-opacity=".75"/></pattern></defs><rect x="0" y="${y - 14}" width="30" height="17" fill="url(#lgx)" stroke="#1a211a" stroke-width=".6"/><text x="42" y="${y}" font-family="${SERIF}" font-size="16">${esc(rot)}</text>`;
}

/** Legenda da figura: título e uma caixa por classe, sem contagens: [[cor, rótulo, 'hachura' | 'listras']]. */
function colunaFigura(titulo, itens, y = 0) {
  const s = [rotuloPainel(titulo, y)];
  y += 24;
  for (const [cor, rot, tipo] of itens) {
    s.push(tipo === 'listras' ? caixaListras(rot, y) : caixaLegenda(cor, rot, y, { hachura: tipo === 'hachura' }));
    y += 25;
  }
  return { svg: s.join('\n'), y };
}

/* ------------------------------------------------------------------ 1/4 nitrogênio */
function nitrogenio() {
  const c = C.n081;
  const [bastos] = c.acima;
  const pb = c.maiores.find((m) => m.NM_MUN === 'Presidente Bernardes');
  const resto = c.acima.slice(1);
  const rot = L(
    ['até 10 kg N/ha', '10 a 25 kg N/ha', '25 a 50 kg N/ha', '50 a 100 kg N/ha', `100 a ${DIRETIVA} kg N/ha`, `mais de ${DIRETIVA} kg N/ha`],
    ['up to 10 kg N/ha', '10 to 25 kg N/ha', '25 to 50 kg N/ha', '50 to 100 kg N/ha', `100 to ${DIRETIVA} kg N/ha`, `over ${DIRETIVA} kg N/ha`]);
  const g = c.grupos;
  const ordem = ['bovinos', 'aves', 'leite', 'suinos', 'outros'];
  return () => ({
    layout: 'um',
    motivo: friso,
    serie: serie(1),
    titulo: () => L('O nitrogênio dos dejetos', 'The nitrogen in manure'),
    subtitulo: () => L(`Meio milhão de toneladas por ano; em Bastos, três vezes o teto europeu`, `Half a million tonnes a year; in Bastos, three times the European cap`),
    descricao: () => L(
      `Nitrogênio excretado pelos rebanhos da PPM 2024 por hectare de área agropecuária (MapBiomas), estimado com coeficientes do IPCC 2019. Acima de ${DIRETIVA} kg N/ha fica o teto da Diretiva Nitratos da União Europeia para o estrume`,
      `Nitrogen excreted by the 2024 PPM herds per hectare of farmland (MapBiomas), estimated with IPCC 2019 coefficients. Above ${DIRETIVA} kg N/ha lies the EU Nitrates Directive cap for manure`),
    mapa: () => ({
      preencher: (cd) => { const v = V[cd]; return !v || v.n_kg_ha_agro == null ? null : CORES_N[classe(v.n_kg_ha_agro, LIM_N)]; },
      bordaMunicipio: 0.5,
      chamadas: [
        {
          cd: bastos.CD_MUN, dx: -190, dy: -470, tamanho: 16,
          titulo: L(`BASTOS · ${nf(bastos.kg_ha)} KG N/HA`, `BASTOS · ${nf(bastos.kg_ha)} KG N/HA`),
          linhas: L([`${pc(bastos.aves * 100, 0)} vêm das aves, quase`, 'tudo das poedeiras do ovo'], [`${nf(bastos.aves * 100, 0)}% from poultry, mostly`, 'egg-laying hens']),
        },
        {
          cd: pb.CD_MUN, dx: -60, dy: 250, tamanho: 16,
          titulo: L(`PRESIDENTE BERNARDES · ${nf(pb.n_t)} T`, `PRESIDENTE BERNARDES · ${nf(pb.n_t)} T`),
          linhas: L(['o maior total depois de Bastos,', 'quase todo de gado no pasto'], ['the largest total after Bastos,', 'nearly all from grazing cattle']),
        },
        {
          cd: resto[0].CD_MUN, dx: 120, dy: 250, tamanho: 16,
          titulo: L(`MAIS ${resto.length} ACIMA DE ${DIRETIVA}`, `${resto.length} MORE ABOVE ${DIRETIVA}`),
          linhas: [resto.map((m) => m.NM_MUN).join(', '), L('com granjas de frango', 'with broiler farms')],
        },
      ],
    }),
    legendaFigura: () => {
      const g = colunaFigura(L('NITROGÊNIO DOS DEJETOS POR HECTARE', 'MANURE NITROGEN PER HECTARE'),
        [...CORES_N.map((k, i) => [k, rot[i]]), [null, L('sem dado da PPM', 'no PPM data'), 'hachura']]);
      return { svg: g.svg, altura: g.y, largura: 380 };
    },
    numeros: () => [
      [kt(c.total_t),[L('de nitrogênio nos dejetos', 'of nitrogen in manure'), L('por ano, estimadas', 'a year, estimated')]],
      [`${nf(c.kg_ha, 1)} kg`, [L('de N por hectare agropecuário;', 'of N per farmland hectare;'), L(`a mediana é ${nf(c.mediana)} kg`, `the median is ${nf(c.mediana)} kg`)]],
      [pc((100 * g.bovinos) / c.total_t, 0), [L('vêm do gado de corte,', 'comes from beef cattle,'), L('espalhado nos pastos', 'spread over the pastures')]],
      [nf(c.acima.length), [L(`municípios acima de ${DIRETIVA} kg/ha,`, `municipalities above ${DIRETIVA} kg/ha,`), L('o teto europeu', 'the European cap')]],
    ],
    painel: (y) => {
      const itens = CORES_N.map((k, i) => [k, `${rot[i]} · ${nf(c.mun_classes[i])} ${L('mun.', 'mun.')}`, c.classes[i], c.total_t]);
      const lg = legendaBarras(itens, y, { titulo: L('NITROGÊNIO DOS DEJETOS POR HECTARE', 'MANURE NITROGEN PER HECTARE'), rotuloValor: L('parte do N dos dejetos do estado', 'share of the state’s manure N') });
      const s = [lg.svg, caixaLegenda(null, SEM_PPM(), lg.y + 4, { hachura: true })];
      let yy = lg.y + 46;
      s.push(rotuloPainel(L('DE ONDE VEM O NITROGÊNIO (MIL T/ANO)', 'WHERE THE NITROGEN COMES FROM (THOUSAND T/YEAR)'), yy));
      const b = barras(ordem.map((k) => [GR[k].rot(), g[k], GR[k].cor, `${nf(g[k] / 1000)} · ${pc((100 * g[k]) / c.total_t, 0)}`]), yy + 14, { max: g.bovinos * 1.25, x0: 230, passo: 20 });
      s.push(b.svg);
      return { svg: s.join('\n'), y: b.y + 6 };
    },
    fontes: () => [FONTE.ppm(), FONTE.mapbiomas(), FONTE.ipcc(), FONTE.malha()],
  });
}

/* ------------------------------------------------------------------ 2/4 fósforo */
function fosforo() {
  const c = C.n082;
  const sobra = new Set(c.sobra.map((m) => m.CD_MUN));
  const [bastos] = c.densos;
  const mococa = c.sobra.find((m) => m.NM_MUN === 'Mococa');
  const rot = L(
    ['até 1 kg/ha', '1 a 3 kg/ha', '3 a 6 kg/ha', '6 a 12 kg/ha', '12 a 25 kg/ha', 'mais de 25 kg/ha'],
    ['up to 1 kg/ha', '1 to 3 kg/ha', '3 to 6 kg/ha', '6 to 12 kg/ha', '12 to 25 kg/ha', 'over 25 kg/ha']);
  const g = c.grupos;
  const bOrdem = [
    [L('frangos de corte', 'broilers'), g.frangos, AVES],
    [L('vacas ordenhadas', 'milked cows'), g.leite, LEITE],
    [L('galinhas poedeiras', 'laying hens'), g.galinhas, '#ddb3c1'],
    [L('suínos', 'pigs'), g.suinos, SUINOS],
  ];
  const bOut = (bastos.p_t / C.valores[bastos.CD_MUN].p2o5_exporta_t);
  return () => ({
    layout: 'um',
    motivo: friso,
    serie: serie(2),
    titulo: () => L('O fósforo dos dejetos', 'The phosphorus in manure'),
    subtitulo: () => L(`Em ${nf(c.sobra.length)} municípios, as granjas dão mais fósforo do que a colheita leva`, `In ${nf(c.sobra.length)} municipalities, farms yield more phosphorus than the harvest removes`),
    descricao: () => L(
      'Fósforo (P₂O₅) nos dejetos de aves, suínos e vacas de leite, rebanhos confinados cujo esterco se recolhe, por hectare de área agropecuária, 2024; listras onde ele passa o que as colheitas do município exportam',
      'Phosphorus (P₂O₅) in the manure of poultry, pigs and dairy cows, housed herds whose manure is collected, per hectare of farmland, 2024; stripes where it exceeds what the municipality’s harvests remove'),
    mapa: () => ({
      preencher: (cd) => { const v = V[cd]; return !v || v.p2o5_kg_ha_agro == null ? null : CORES_P[classe(v.p2o5_kg_ha_agro, LIM_P)]; },
      hachura: { cds: sobra, cor: TINTA, passo: 5, largura: 0.8, angulo: -55 },
      bordaMunicipio: 0.5,
      chamadas: [
        {
          cd: bastos.CD_MUN, dx: -220, dy: -470, tamanho: 16,
          titulo: L(`BASTOS · ${nf(bastos.p_t)} T DE P₂O₅`, `BASTOS · ${nf(bastos.p_t)} T OF P₂O₅`),
          linhas: L([`${nf(bOut)} vezes o que as lavouras`, 'do município levam na colheita'], [`${nf(bOut)} times what the town’s`, 'crops remove at harvest']),
        },
        {
          cd: mococa.CD_MUN, dx: 120, dy: -330, tamanho: 16,
          titulo: L(`MOCOCA · ${nf(mococa.p_t)} T`, `MOCOCA · ${nf(mococa.p_t)} T`),
          linhas: L(['granjas de frango: o dobro', 'do que a colheita leva'], ['broiler farms: twice', 'what the harvest removes']),
        },
      ],
    }),
    legendaFigura: () => {
      const g = colunaFigura(L('P₂O₅ DOS DEJETOS CONFINADOS POR HECTARE', 'HOUSED-HERD MANURE P₂O₅ PER HECTARE'), [
        ...CORES_P.map((k, i) => [k, rot[i]]),
        [null, L('dejeto passa a exportação', 'manure exceeds removal'), 'listras'],
        [null, L('sem dado da PPM', 'no PPM data'), 'hachura'],
      ]);
      return { svg: g.svg, altura: g.y, largura: 420 };
    },
    numeros: () => [
      [kt(c.p_t), [L('de P₂O₅ por ano nos dejetos', 'of P₂O₅ a year in the manure'), L('de aves, suínos e leite', 'of poultry, pigs and dairy')]],
      [pc((100 * g.aves) / c.p_t, 0), [L('vêm das aves, frangos', 'comes from poultry, broilers'), L('e galinhas poedeiras', 'and laying hens')]],
      [nf(c.sobra.length), [L('municípios onde o dejeto', 'municipalities where manure'), L('passa a exportação da colheita', 'exceeds crop removal')]],
      [kt(c.p_excesso_t), [L('de P₂O₅ a mais do que as', 'of P₂O₅ beyond what those'), L('colheitas desses municípios levam', 'municipalities’ harvests remove')]],
    ],
    painel: (y) => {
      const itens = CORES_P.map((k, i) => [k, `${rot[i]} · ${nf(c.mun_classes[i])} ${L('mun.', 'mun.')}`, c.classes[i], c.p_t]);
      const lg = legendaBarras(itens, y, { titulo: L('P₂O₅ DOS DEJETOS CONFINADOS POR HECTARE', 'HOUSED-HERD MANURE P₂O₅ PER HECTARE'), rotuloValor: L('parte do P₂O₅ dos dejetos do estado', 'share of the state’s manure P₂O₅') });
      const s = [lg.svg, caixaListras(L(`dejeto passa a exportação · ${nf(c.sobra.length)} mun.`, `manure exceeds removal · ${nf(c.sobra.length)} mun.`), lg.y + 4)];
      s.push(caixaLegenda(null, SEM_PPM(), lg.y + 32, { hachura: true }));
      let yy = lg.y + 74;
      s.push(rotuloPainel(L('DE ONDE VEM O FÓSFORO (MIL T DE P₂O₅/ANO)', 'WHERE THE PHOSPHORUS COMES FROM (THOUSAND T P₂O₅/YEAR)'), yy));
      const b = barras(bOrdem.map(([r, v, k]) => [r, v, k, `${nf(v / 1000, 1)} · ${pc((100 * v) / c.p_t, 0)}`]), yy + 14, { max: g.frangos * 1.3, x0: 230, passo: 20 });
      s.push(b.svg);
      return { svg: s.join('\n'), y: b.y + 6 };
    },
    fontes: () => [FONTE.ppm(), FONTE.pam(), FONTE.mapbiomas(), FONTE.ipcc(), FONTE.ipni(), FONTE.malha()],
  });
}

/* ------------------------------------------------------------------ 3/4 dejetos e colheitas */
function balanco() {
  const c = C.n083;
  const lim = LIM_C.map((v) => nf(v));
  const cor = (cd, k) => {
    const v = V[cd];
    if (!v || v.sem_info_ppm) return null;
    if (!(v.area_lavoura_ha >= LAV_MIN) || v[k] == null) return NEUTRO;
    return CORES_C[classe(v[k], LIM_C)];
  };
  const extras = () => [[NEUTRO, POUCA()]];
  const val = (nome) => Object.values(V).find((v) => v.NM_MUN === nome);
  const ita = val('Itapeva'), bas = val('Bastos'), gua = val('Guaíra');
  const E = c.exporta, O = c.oferta;
  const NUT = [
    ['N', O.n, E.n, E.cana_n],
    ['P₂O₅', O.p, E.p, 0],
    ['K₂O', O.k, E.k, E.cana_k],
  ];
  return () => ({
    layout: 'quatro',
    motivo: friso,
    serie: serie(3),
    titulo: () => L('Dejetos e colheitas', 'Manure and harvests'),
    subtitulo: () => L(`O esterco confinado repõe ${pc(c.cobertura.p, 0)} do fósforo que as colheitas levam, ${pc(c.cobertura.n, 0)} do nitrogênio`, `Housed-herd manure replaces ${nf(c.cobertura.p, 0)}% of the phosphorus harvests remove, ${nf(c.cobertura.n, 0)}% of the nitrogen`),
    descricao: () => L(
      'N, P₂O₅ e K₂O nos dejetos de aves, suínos e vacas de leite como parte do que as lavouras exportam na colheita (PAM 2024 × teores do IPNI), por município com ao menos 1.000 ha colhidos',
      'N, P₂O₅ and K₂O in the manure of poultry, pigs and dairy cows as a share of what crops remove at harvest (PAM 2024 × IPNI contents), by municipality with at least 1,000 ha harvested'),
    mapas: () => [
      {
        titulo: L('NITROGÊNIO · % DA EXPORTAÇÃO', 'NITROGEN · % OF REMOVAL'),
        preencher: (cd) => cor(cd, 'cob_n_pct'),
        legenda: faixa(CORES_C, lim, extras()),
        chamadas: [{ cd: ita.CD_MUN, dx: 30, dy: 120, tamanho: 14, titulo: L(`ITAPEVA · ${pc(ita.cob_n_pct)}`, `ITAPEVA · ${nf(ita.cob_n_pct, 1)}%`), linhas: L([`soja e milho levam ${nf(ita.n_exporta_t)} t de N,`, 'a maior exportação do estado'], [`soy and maize remove ${nf(ita.n_exporta_t)} t of N,`, 'the largest in the state']) }],
      },
      {
        titulo: L('FÓSFORO (P₂O₅) · % DA EXPORTAÇÃO', 'PHOSPHORUS (P₂O₅) · % OF REMOVAL'),
        preencher: (cd) => cor(cd, 'cob_p2o5_pct'),
        legenda: faixa(CORES_C, lim, extras()),
        chamadas: [{ cd: bas.CD_MUN, dx: 40, dy: -270, tamanho: 14, titulo: L(`BASTOS · ${nf(bas.cob_p2o5_pct / 100)} VEZES`, `BASTOS · ${nf(bas.cob_p2o5_pct / 100)} TIMES`), linhas: L(['o fósforo que a colheita leva'], ['the phosphorus the harvest removes']) }],
      },
      {
        titulo: L('POTÁSSIO (K₂O) · % DA EXPORTAÇÃO', 'POTASSIUM (K₂O) · % OF REMOVAL'),
        preencher: (cd) => cor(cd, 'cob_k2o_pct'),
        legenda: faixa(CORES_C, lim, extras()),
        chamadas: [{ cd: gua.CD_MUN, dx: 150, dy: -130, tamanho: 14, titulo: L(`GUAÍRA · ${pc(gua.cob_k2o_pct)}`, `GUAÍRA · ${nf(gua.cob_k2o_pct, 1)}%`), linhas: L(['cana e soja, pouco rebanho'], ['cane and soy, few herds']) }],
      },
    ],
    quartoQuadro: (w) => {
      const s = [`<text x="0" y="0" font-family="${MONO}" font-size="13" letter-spacing="2.4" fill="${CINZA}">${esc(L('NO ESTADO (MIL T POR ANO)', 'STATEWIDE (THOUSAND T A YEAR)'))}</text>`];
      const x0 = 120, larg = w - x0 - 120, max = E.n;
      let y = 26;
      const LEG = [[CORES_C[4], L('esterco confinado', 'housed-herd manure')], ['#c9b58c', L('exportação pela colheita', 'removal by the harvest')]];
      let xl = x0;
      LEG.forEach(([k, t]) => { s.push(`<rect x="${xl}" y="${y - 10}" width="14" height="10" fill="${k}"/><text x="${xl + 20}" y="${y}" font-family="${MONO}" font-size="12">${esc(t)}</text>`); xl += 40 + t.length * 7.4; });
      s.push(`<rect x="${xl}" y="${y - 10}" width="14" height="10" fill="#c9b58c" fill-opacity=".45" stroke="#7f6238" stroke-width=".6"/><text x="${xl + 20}" y="${y}" font-family="${MONO}" font-size="12">${esc(L('parte da cana', 'cane share'))}</text>`);
      y += 26;
      for (const [nome, o, e, cana] of NUT) {
        s.push(`<text x="${x0 - 14}" y="${y + 22}" text-anchor="end" font-family="${SERIF}" font-size="20">${esc(nome)}</text>`);
        const bo = (o / max) * larg, be = (e / max) * larg, bc = (cana / max) * larg;
        s.push(`<rect x="${x0}" y="${y}" width="${f1(bo)}" height="16" fill="${CORES_C[4]}"/>`);
        s.push(`<text x="${f1(x0 + bo + 6)}" y="${y + 13}" font-family="${MONO}" font-size="12">${esc(nf(o / 1000))}</text>`);
        s.push(`<rect x="${x0}" y="${y + 19}" width="${f1(be)}" height="16" fill="#c9b58c"/>`);
        if (bc) s.push(`<rect x="${f1(x0 + be - bc)}" y="${y + 19}" width="${f1(bc)}" height="16" fill="${PAPEL}" fill-opacity=".55" stroke="#7f6238" stroke-width=".6"/>`);
        s.push(`<text x="${f1(x0 + be + 6)}" y="${y + 32}" font-family="${MONO}" font-size="12">${esc(`${nf(e / 1000)} · ${pc((100 * o) / e, 0)}`)}</text>`);
        y += 58;
      }
      const n = nota(L(`A cana leva ${pc((100 * E.cana_n) / E.n, 0)} do nitrogênio e ${pc((100 * E.cana_k) / E.k, 0)} do potássio exportados; a vinhaça e a torta de filtro já devolvem parte disso ao canavial. As lavouras com teor conhecido somam ${pc(c.area_coberta_pct, 0)} da área colhida.`,
        `Sugarcane removes ${nf((100 * E.cana_n) / E.n, 0)}% of the nitrogen and ${nf((100 * E.cana_k) / E.k, 0)}% of the potassium; vinasse and filter cake already return part of it to the canefields. Crops with known contents make up ${nf(c.area_coberta_pct, 0)}% of the harvested area.`), y + 8, { tamanho: 14, max: w });
      s.push(n.svg);
      return s.join('\n');
    },
    numeros: () => [
      [pc(c.cobertura.p, 0), [L('do P₂O₅ que as colheitas', 'of the P₂O₅ harvests remove'), L('levam está no esterco', 'is in the manure')]],
      [pc(c.cobertura.n, 0), [L('do nitrogênio e', 'of the nitrogen and'), L(`${pc(c.cobertura.k, 0)} do potássio`, `${nf(c.cobertura.k, 0)}% of the potassium`)]],
      [nf(c.acima100_lav.p2o5), [L(`de ${nf(c.n_lav)} municípios agrícolas`, `of ${nf(c.n_lav)} farming municipalities`), L('têm esterco para todo o P₂O₅', 'have manure for all the P₂O₅')]],
      [nf(c.acima100_lav.n), [L('têm para todo o nitrogênio;', 'for all the nitrogen;'), L(`${nf(c.acima100_lav.k2o)}, para todo o potássio`, `${nf(c.acima100_lav.k2o)}, for all the potassium`)]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('MAIS ESTERCO QUE COLHEITA (P₂O₅, VEZES)', 'MORE MANURE THAN HARVEST (P₂O₅, TIMES)'), y)];
      const tp = c.top_p.slice(0, 6);
      const b1 = barras(tp.map((m) => [m.NM_MUN, Math.log10(m.cob), CORES_C[5], L(`${nf(m.cob / 100, m.cob < 1000 ? 1 : 0)} × · ${nf(m.p_t)} t`, `${nf(m.cob / 100, m.cob < 1000 ? 1 : 0)}× · ${nf(m.p_t)} t`)]), y + 14, { max: Math.log10(tp[0].cob) * 1.3, x0: 230, passo: 20 });
      s.push(b1.svg);
      let yy = b1.y + 24;
      s.push(rotuloPainel(L('MAIOR EXPORTAÇÃO DE N (T) E PARTE COBERTA', 'LARGEST N REMOVAL (T) AND SHARE COVERED'), yy));
      const me = c.maior_exp_n.slice(0, 6);
      const b2 = barras(me.map((m) => [m.NM_MUN, m.exp_t, '#c9b58c', `${nf(m.exp_t)} · ${pc(m.cob)}`]), yy + 14, { max: me[0].exp_t * 1.35, x0: 230, passo: 20 });
      s.push(b2.svg);
      const n = nota(L('Barras de cima em escala logarítmica. Esterco de aves, suínos e vacas de leite; o gado de pasto deixa o seu no próprio pasto.', 'Top bars on a log scale. Manure of poultry, pigs and dairy cows; grazing cattle leave theirs on the pasture.'), b2.y + 10, { tamanho: 14 });
      s.push(n.svg);
      return { svg: s.join('\n'), y: n.y + 4 };
    },
    fontes: () => [FONTE.ppm(), FONTE.pam(), FONTE.ipcc(), FONTE.ipni(), FONTE.malha()],
  });
}

/* ------------------------------------------------------------------ 4/4 digestato */
function digestato() {
  const c = C.n084;
  const raio = (v) => 1.5 + 0.42 * Math.sqrt(v);
  const [bastos] = c.maiores;
  const botu = c.maiores.find((m) => m.NM_MUN === 'Botucatu');
  const rot = L(['até 5 %', '5 a 15 %', '15 a 30 %', '30 a 60 %', '60 a 100 %', 'mais de 100 %'], ['up to 5%', '5 to 15%', '15 to 30%', '30 to 60%', '60 to 100%', 'over 100%']);
  const cl = new Array(6).fill(0);
  let nPouca = 0;
  for (const v of Object.values(V)) {
    if (!(v.dig_p2o5_t > 0)) { if (!v.sem_info_ppm) nPouca++; continue; }
    if (!(v.area_lavoura_ha >= LAV_MIN) || v.dig_cob_p2o5_pct == null) { nPouca++; continue; }
    cl[classe(v.dig_cob_p2o5_pct, LIM_C)]++;
  }
  const o = c.origem;
  return () => ({
    layout: 'um',
    motivo: friso,
    serie: serie(4),
    titulo: () => L('O digestato do biogás', 'Biogas digestate'),
    subtitulo: () => L(`Se os dejetos passassem pelo biodigestor, voltariam ao campo ${kt(c.n_t)} de N e ${kt(c.p_t)} de P₂O₅ por ano`, `If manure went through digesters, ${kt(c.n_t)} of N and ${kt(c.p_t)} of P₂O₅ a year would return to the fields`),
    descricao: () => L(
      'Nutrientes no digestato do potencial de biometano dos dejetos de aves, suínos e bovinos no CP2B (nível N4, acessível, cenário de referência); cor: parte do P₂O₅ que as colheitas do município exportam; círculos: toneladas de P₂O₅',
      'Nutrients in the digestate of the biomethane potential from poultry, pig and cattle manure in CP2B (level N4, accessible, reference scenario); colour: share of the P₂O₅ the municipality’s harvests remove; circles: tonnes of P₂O₅'),
    mapa: () => ({
      preencher: (cd) => {
        const v = V[cd];
        if (!v) return null;
        if (!(v.dig_p2o5_t > 0) || !(v.area_lavoura_ha >= LAV_MIN) || v.dig_cob_p2o5_pct == null) return NEUTRO;
        return CORES_C[classe(v.dig_cob_p2o5_pct, LIM_C)];
      },
      bordaMunicipio: 0.5,
      pontos: Object.values(V).filter((v) => v.dig_p2o5_t >= 50 && centro.has(v.CD_MUN)).map((v) => ({ coord: centro.get(v.CD_MUN), r: raio(v.dig_p2o5_t), cor: SUINOS, anel: true, largura: 1.4 })),
      chamadas: [
        {
          cd: bastos.CD_MUN, dx: -150, dy: -470, tamanho: 16,
          titulo: L(`BASTOS · ${nf(bastos.p_t)} T DE P₂O₅`, `BASTOS · ${nf(bastos.p_t)} T OF P₂O₅`),
          linhas: L([`e ${nf(bastos.m3)} m³ de biometano por dia,`, 'cem vezes o que a colheita pede'], [`and ${nf(bastos.m3)} m³ of biomethane a day,`, 'a hundred times what crops need']),
        },
        {
          cd: botu.CD_MUN, dx: 120, dy: 260, tamanho: 16,
          titulo: L(`BOTUCATU · ${pc(botu.cob_p, 0)}`, `BOTUCATU · ${nf(botu.cob_p, 0)}%`),
          linhas: L([`do P₂O₅ de ${nf(botu.lav_ha)} ha de lavoura,`, 'com o digestato dos frangos'], [`of the P₂O₅ of ${nf(botu.lav_ha)} ha of crops,`, 'from broiler digestate']),
        },
      ],
    }),
    legendaFigura: () => {
      const g = colunaFigura(L('DIGESTATO SOBRE A EXPORTAÇÃO DE P₂O₅', 'DIGESTATE OVER P₂O₅ REMOVAL'),
        [...CORES_C.map((k, i) => [k, rot[i]]), [NEUTRO, L(`sem potencial ou ${POUCA()}`, `no potential or ${POUCA()}`)]]);
      const yy = g.y + 12;
      const lc = legendaCirculos([2000, 500, 100], raio, (v) => nf(v), { y: yy + 18, cor: SUINOS, tamanho: 14 });
      return { svg: [g.svg, rotuloPainel(L('P₂O₅ NO DIGESTATO (T/ANO)', 'P₂O₅ IN THE DIGESTATE (T/YEAR)'), yy), lc.svg].join('\n'), altura: yy + 18 + lc.altura, largura: 420 };
    },
    numeros: () => [
      [kt(c.p_t), [L('de P₂O₅ no digestato,', 'of P₂O₅ in the digestate,'), L(`${pc(c.sobre_exp.p, 0)} do que a colheita leva`, `${nf(c.sobre_exp.p, 0)}% of crop removal`)]],
      [kt(c.n_t), [L('de nitrogênio e', 'of nitrogen and'), L(`${kt(c.k_t)} de K₂O`, `${kt(c.k_t)} of K₂O`)]],
      [L(`${nf(c.biometano_m3_dia / 1e6, 2)} mi m³`, `${nf(c.biometano_m3_dia / 1e6, 2)} m m³`), [L('de biometano por dia', 'of biomethane a day'), L('no mesmo potencial', 'from the same potential')]],
      [pc(o.aves * 100, 0), [L('do N do digestato viria', 'of the digestate N would'), L('das granjas de aves', 'come from poultry farms')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('DIGESTATO SOBRE A EXPORTAÇÃO DE P₂O₅', 'DIGESTATE OVER P₂O₅ REMOVAL'), y)];
      let yy = y + 24;
      const meio = Math.ceil(CORES_C.length / 2);
      CORES_C.forEach((k, i) => {
        const col = i < meio ? 0 : LP / 2;
        const lin = i < meio ? i : i - meio;
        s.push(caixaLegenda(k, `${rot[i]} · ${nf(cl[i])}`, yy + lin * 25, { x: col }));
      });
      yy += meio * 25;
      s.push(caixaLegenda(NEUTRO, L(`sem potencial ou ${POUCA()} · ${nf(nPouca)}`, `no potential or ${POUCA()} · ${nf(nPouca)}`), yy));
      yy += 34;
      s.push(rotuloPainel(L('P₂O₅ NO DIGESTATO (T/ANO)', 'P₂O₅ IN THE DIGESTATE (T/YEAR)'), yy));
      const lc = legendaCirculos([2000, 500, 100], raio, (v) => nf(v), { y: yy + 18, cor: SUINOS, tamanho: 14 });
      s.push(lc.svg);
      const b = barras([
        [L('aves', 'poultry'), o.aves * 100, AVES],
        [L('bovinos', 'cattle'), o.bovinos * 100, BOVINOS],
        [L('suínos', 'pigs'), o.suinos * 100, SUINOS],
      ].map(([r, v, k]) => [r, v, k, pc(v, 0)]), yy + 40, { max: 100, x0: 330, passo: 20 });
      s.push(`<text x="330" y="${yy + 30}" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L('origem do N do digestato', 'origin of the digestate N'))}</text>`);
      s.push(b.svg);
      yy = Math.max(yy + 18 + lc.altura, b.y) + 16;
      const n = nota(L('Só dejetos: ficam de fora a cana (vinhaça, torta e palha já voltam ao canavial), as outras lavouras e o lixo urbano. O nível N4 é a parte do potencial que o CP2B considera acessível; os nutrientes saem das mesmas cabeças que esse biometano supõe.',
        'Manure only: sugarcane (vinasse, filter cake and straw already go back to the fields), other crops and urban waste are left out. Level N4 is the part of the potential CP2B deems accessible; the nutrients come from the same head count that biomethane assumes.'), yy, { tamanho: 14 });
      s.push(n.svg);
      return { svg: s.join('\n'), y: n.y + 4 };
    },
    fontes: () => [FONTE.cp2b(), FONTE.ppm(), FONTE.pam(), FONTE.ipcc(), FONTE.ipni(), FONTE.malha()],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { nitrogenio, fosforo, balanco, digestato };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/nutrientes-sp/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
const e = SERIE.find((s) => s.tema === nome);

const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => TEMAS[nome]()() });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `nutrientes-sp-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
