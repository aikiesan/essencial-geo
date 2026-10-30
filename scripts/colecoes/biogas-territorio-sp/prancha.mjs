#!/usr/bin/env node
/**
 * Coleção «Biogás no território» — desenha uma prancha a partir do cache de preparar.mjs (uso interno).
 *
 *   node scripts/colecoes/biogas-territorio-sp/prancha.mjs densidade|alem|gas|eletrica|operacao
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { RAIZ, LP, SERIF, MONO, TINTA, CINZA, PAPEL, esc, nf, f1, largura, gerarPrancha, rotuloPainel, legendaFaixa } from '../lib/prancha-sp.mjs';
import { legendaCirculos } from '../lib/arte.mjs';
import { L, NEUTRO, ZERO, pct, grande, barras, legendaCategorias, nota } from '../lib/painel.mjs';

const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'biogas-territorio-sp', 'serie.json'), 'utf8'));
const c = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', 'biogas-territorio-sp.json'), 'utf8'));
const por = new Map(c.linhas.map((l) => [l.CD_MUN, l]));
const serie = (i) => () => L(`BIOGÁS NO TERRITÓRIO · ${i}/5`, `BIOGAS ON THE GROUND · ${i}/5`);
const CP2B = () => L('CP2B (Unicamp), método v5.1, 2026', 'CP2B (Unicamp), method v5.1, 2026');
const N4 = () => L('método CP2B v5.1, nível N4 (acessível), cenário de referência', 'CP2B method v5.1, level N4 (accessible), reference scenario');

const CORES_KM2 = ['#eef0e6', '#d5dcc4', '#b3c39c', '#87a374', '#5b7f53', '#2f5d3a'];
const CORES_HAB = ['#f3ecd4', '#e2c98a', '#c99a52', '#a8653a', '#7a3b2c', '#4a2420'];
const CORES_CONC = ['#2f5d3a', '#6f9468', '#b3c39c', '#e3e8d6'];
const CORES_TOTAL = ['#f0f2ea', '#dbe2cf', '#bccaa9', '#93ab7f', '#678a5c', '#3f6a42'];
const CORES_FAIXA = ['#2f5d3a', '#87a374', '#d9c27a', '#c08a2e'];
const GAS_T = '#6b3d5c', GAS_D = '#c08a2e';
const LT_FAIXAS = [
  [(kv) => kv <= 230, '#c08a2e', 1.0, 'até 230 kV', 'up to 230 kV'],
  [(kv) => kv > 230 && kv <= 440, '#9c4a32', 1.5, '345 e 440 kV', '345 and 440 kV'],
  [(kv) => kv > 440, '#6b3d5c', 2.1, '500 kV ou mais', '500 kV or more'],
];

/** Classe 0..n-1 pelos limites superiores; -1 = zero; null = sem dado. */
const cls = (v, lim) => { if (v === null || v === undefined) return null; if (v === 0) return -1; let i = 0; while (i < lim.length - 1 && v > lim[i]) i++; return i; };
const pintar = (campo, lim, cores) => (cd) => { const k = cls(por.get(cd)?.[campo], lim); return k === null ? null : k < 0 ? ZERO : cores[k]; };
const casas = (v) => (v < 1 ? 2 : v < 10 ? 1 : 0);
const rotLim = (lim) => lim.slice(0, -1).map((v) => (v >= 1000 ? `${nf(v / 1000, v % 1000 ? 1 : 0)} mil` : nf(v, casas(v))));
const rotLimEn = (lim) => lim.slice(0, -1).map((v) => (v >= 1000 ? `${nf(v / 1000, v % 1000 ? 1 : 0)}k` : nf(v, casas(v))));
const faixasRot = () => L(['até 10 km', '10 a 25 km', '25 a 50 km', 'mais de 50 km'], ['up to 10 km', '10 to 25 km', '25 to 50 km', 'over 50 km']);
const mil = (v) => L(`${nf(v / 1000, 0)} mil`, `${nf(v / 1000, 0)} thousand`);

/** Legenda de linhas e pontos do mapa: [[tipo, cor, largura|raio, rótulo]]. */
function legendaTracos(itens, y, { passo = 25 } = {}) {
  const s = [];
  for (const [tipo, cor, w, rot] of itens) {
    if (tipo === 'linha') s.push(`<path d="M0 ${y - 6}H30" stroke="${PAPEL}" stroke-width="${w + 3}" stroke-linecap="round"/><path d="M0 ${y - 6}H30" stroke="${cor}" stroke-width="${w}" stroke-linecap="round"/>`);
    else if (tipo === 'anel') s.push(`<circle cx="15" cy="${y - 6}" r="${w}" fill="none" stroke="${cor}" stroke-width="2"/>`);
    else s.push(`<circle cx="15" cy="${y - 6}" r="${w}" fill="${cor}" stroke="${PAPEL}" stroke-width="1.2"/>`);
    s.push(`<text x="42" y="${y}" font-family="${SERIF}" font-size="16">${esc(rot)}</text>`);
    y += passo;
  }
  return { svg: s.join('\n'), y };
}

/** Barras do potencial por faixa de distância, com a parte do total e os municípios. */
function barrasFaixas(fx, y, cores = CORES_FAIXA) {
  const itens = fx.map((f, i) => [faixasRot()[i], f.m3d, cores[i], `${pct((100 * f.m3d) / c.total, 0)} · ${nf(f.municipios)}`]);
  return barras(itens, y, { max: 1.12 * Math.max(...fx.map((f) => f.m3d)), x0: 130, passo: 22 });
}

/** Mapa-base do potencial total, claro, para as pranchas de infraestrutura. */
const CORES_CLARO = ['#f3f4ef', '#e6eadc', '#d6ddc8', '#c3cfb0', '#acbe96', '#93ab7f'];
const potencial = (claro = false) => pintar('biometano_m3d', c.lim_total, claro ? CORES_CLARO : CORES_TOTAL);
const legendaPotencial = (y, id, cores = CORES_TOTAL) => {
  const s = [rotuloPainel(L('BIOMETANO, CP2B N4 · M³/DIA', 'BIOMETHANE, CP2B N4 · M³/DAY'), y)];
  s.push(legendaFaixa(cores, L(rotLim(c.lim_total), rotLimEn(c.lim_total)), { y: y + 18, larg: 62, semInfo: false, id }));
  return { svg: s.join('\n'), y: y + 70 };
};

/* ------------------------------------------------------------------ 1/5 densidade */
function densidade() {
  const sp = por.get('3550308');
  const media = c.total / c.pessoas;
  return () => ({
    layout: 'quatro',
    motivo: 'biogas',
    serie: serie(1),
    titulo: () => L('Biometano por km² e por pessoa', 'Biomethane per km² and per person'),
    subtitulo: () => L('O gás está onde a gente não está', 'The gas is where the people are not'),
    descricao: () => L(
      `Potencial de biometano por município dividido pela área e pela população (Censo 2022), ${N4()}`,
      `Biomethane potential by municipality divided by area and population (2022 Census), ${N4()}`),
    mapas: () => [
      {
        titulo: L('BIOMETANO POR KM² · M³/DIA', 'BIOMETHANE PER KM² · M³/DAY'),
        preencher: pintar('m3d_por_km2', c.lim_km2, CORES_KM2),
        legenda: legendaFaixa(CORES_KM2, rotLim(c.lim_km2), { larg: 58, id: 'lb0', semInfo: false }),
      },
      {
        titulo: L('BIOMETANO POR HABITANTE · M³/DIA', 'BIOMETHANE PER INHABITANT · M³/DAY'),
        preencher: pintar('m3d_por_hab', c.lim_hab, CORES_HAB),
        legenda: legendaFaixa(CORES_HAB, c.lim_hab.slice(0, -1).map((v) => nf(v, v < 0.1 ? 2 : v < 1 ? 2 : 1)), { larg: 58, id: 'lb1', semInfo: false }),
        chamadas: [{ cd: '3550308', dx: -30, dy: 170, tamanho: 14, titulo: L(`SÃO PAULO · ${nf(sp.m3d_por_hab, 3)} M³`, `SÃO PAULO · ${nf(sp.m3d_por_hab, 3)} M³`), linhas: L(['por habitante por dia'], ['per inhabitant per day']) }],
      },
      {
        titulo: L('QUARTOS DO POTENCIAL DO ESTADO', 'QUARTERS OF THE STATE’S POTENTIAL'),
        preencher: (cd) => { const k = por.get(cd)?.concentracao; return k ? CORES_CONC[k - 1] : ZERO; },
        legenda: [[CORES_CONC[0], L(`1º quarto: ${c.n25} municípios`, `1st quarter: ${c.n25} municipalities`)], [CORES_CONC[1], L(`2º: ${c.n50 - c.n25}`, `2nd: ${c.n50 - c.n25}`)], [CORES_CONC[2], L(`3º: ${c.n75 - c.n50}`, `3rd: ${c.n75 - c.n50}`)], [CORES_CONC[3], L(`4º: ${c.com_potencial - c.n75}`, `4th: ${c.com_potencial - c.n75}`)]]
          .map(([cor, t], i) => `<rect x="${(i % 2) * 380}" y="${Math.floor(i / 2) * 26 - 12}" width="30" height="16" fill="${cor}" stroke="#1a211a" stroke-width=".6"/><text x="${(i % 2) * 380 + 42}" y="${Math.floor(i / 2) * 26 + 2}" font-family="${SERIF}" font-size="16">${esc(t)}</text>`).join(''),
      },
    ],
    quartoQuadro: (w) => {
      const s = [`<text x="0" y="0" font-family="${MONO}" font-size="13" letter-spacing="2.4" fill="${CINZA}">${L('CURVA DE CONCENTRAÇÃO', 'CONCENTRATION CURVE')}</text>`];
      const gx = 60, gy = 30, gw = w - 110, gh = 250;
      const n = c.linhas.length;
      const X = (i) => gx + (i / n) * gw, Y = (v) => gy + gh - v * gh;
      s.push(`<path d="M${gx} ${gy}V${gy + gh}H${gx + gw}" fill="none" stroke="${TINTA}" stroke-width=".8"/>`);
      for (const q of [0.25, 0.5, 0.75, 1]) {
        s.push(`<path d="M${gx} ${f1(Y(q))}H${gx + gw}" stroke="#d5d9dd" stroke-width=".7"/>`);
        s.push(`<text x="${gx - 8}" y="${f1(Y(q) + 4)}" text-anchor="end" font-family="${MONO}" font-size="12">${nf(q * 100)} %</text>`);
      }
      s.push(`<path d="M${gx} ${gy + gh}L${gx + gw} ${gy}" stroke="${CINZA}" stroke-width=".8" stroke-dasharray="4 4"/>`);
      const d = [[0, 0], ...c.curva].map(([i, v], k) => `${k ? 'L' : 'M'}${f1(X(i))} ${f1(Y(v))}`).join('');
      s.push(`<path d="${d}" fill="none" stroke="${CORES_CONC[0]}" stroke-width="2.4"/>`);
      for (const [q, k] of [[0.25, c.n25], [0.5, c.n50], [0.75, c.n75]]) {
        s.push(`<circle cx="${f1(X(k))}" cy="${f1(Y(q))}" r="4.5" fill="${CORES_CONC[0]}" stroke="${PAPEL}" stroke-width="1.2"/>`);
        s.push(`<text x="${f1(X(k) + 10)}" y="${f1(Y(q) + 16)}" font-family="${SERIF}" font-style="italic" font-size="15">${esc(L(`${k} municípios`, `${k} municipalities`))}</text>`);
      }
      for (const v of [0, 200, 400, 600]) s.push(`<text x="${f1(X(v))}" y="${gy + gh + 20}" text-anchor="middle" font-family="${MONO}" font-size="12">${v}</text>`);
      s.push(`<text x="${gx + gw}" y="${gy + gh + 38}" text-anchor="end" font-family="${MONO}" font-size="12" fill="${CINZA}">${esc(L('municípios, do maior potencial ao menor', 'municipalities, from largest to smallest potential'))}</text>`);
      const t = L(`O estado soma ${grande(c.total)} de m³ por dia; ${nf(c.linhas.length - c.com_potencial)} municípios ficam sem potencial no nível acessível.`,
        `The state adds up to ${grande(c.total)} m³ a day; ${nf(c.linhas.length - c.com_potencial)} municipalities have no potential at the accessible level.`);
      const ls = [];
      let atual = '';
      for (const p of t.split(' ')) { const tt = atual ? `${atual} ${p}` : p; if (largura(tt, 15) > w && atual) { ls.push(atual); atual = p; } else atual = tt; }
      ls.push(atual);
      ls.forEach((l, i) => s.push(`<text x="0" y="${gy + gh + 66 + i * 21}" font-family="${SERIF}" font-style="italic" font-size="15" fill="#4f4a41">${esc(l)}</text>`));
      return s.join('\n');
    },
    numeros: () => [
      [nf(c.n50), [L('municípios somam metade', 'municipalities hold half'), L('do potencial do estado', 'of the state’s potential')]],
      [L(`${nf(media, 2)} m³`, `${nf(media, 2)} m³`), [L('por habitante por dia,', 'per inhabitant per day,'), L('na média do estado', 'state average')]],
      [nf(c.top_km2[0].v), [L(`m³/dia por km² em ${c.top_km2[0].NM_MUN},`, `m³/day per km² in ${c.top_km2[0].NM_MUN},`), L('a maior densidade', 'the highest density')]],
      [L(`${nf(c.top_hab[0].v, 0)} m³`, `${nf(c.top_hab[0].v, 0)} m³`), [L(`por habitante por dia em ${c.top_hab[0].NM_MUN}`, `per inhabitant per day in ${c.top_hab[0].NM_MUN}`)]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('MAIS BIOMETANO POR KM² (M³/DIA)', 'MOST BIOMETHANE PER KM² (M³/DAY)'), y)];
      const b = barras(c.top_km2.map((t) => [t.NM_MUN, t.v, CORES_KM2[4]]), y + 14, { max: c.top_km2[0].v, sufixo: '' });
      s.push(b.svg);
      return { svg: s.join('\n'), y: b.y + 6 };
    },
    fontes: () => [CP2B(), L('IBGE, Censo 2022: agregados por setor', 'IBGE, 2022 Census: tract aggregates'), L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025')],
  });
}

/* ------------------------------------------------------------------ 2/5 além da cana */
function alem() {
  const F = new Map(c.fontes.map((f) => [f.k, f]));
  const fora = [...c.linhas].filter((l) => l.lider_fora_da_cana).sort((a, z) => z.fora_da_cana_m3d - a.fora_da_cana_m3d);
  const ordem = [...c.fontes].sort((a, z) => z.municipios - a.municipios || z.m3d - a.m3d);
  const bastos = fora.find((l) => l.lider_fora_da_cana === 'aves');
  const itapeva = fora.find((l) => l.lider_fora_da_cana === 'graos');
  return () => ({
    layout: 'um',
    motivo: 'biogas',
    serie: serie(2),
    titulo: () => L('Além da cana', 'Beyond sugarcane'),
    subtitulo: () => L('Sem a cana, aparecem o milho, a granja e a cidade', 'Without the cane, maize, poultry and the city appear'),
    descricao: () => L(
      `Maior fonte de biometano de cada município sem contar a cana (palha, bagaço, torta de filtro e vinhaça), ${N4()}`,
      `Each municipality’s largest biomethane source leaving out sugarcane (straw, bagasse, filter cake and vinasse), ${N4()}`),
    mapa: () => ({
      preencher: (cd) => { const k = por.get(cd)?.lider_fora_da_cana; return k ? F.get(k).cor : ZERO; },
      bordaMunicipio: 0.4,
      chamadas: [
        { cd: bastos.CD_MUN, dx: -110, dy: 240, tamanho: 16, titulo: L(`${bastos.NM_MUN.toUpperCase()} · ${mil(bastos.fora_da_cana_m3d)} M³/DIA`, `${bastos.NM_MUN.toUpperCase()} · ${mil(bastos.fora_da_cana_m3d)} M³/DAY`), linhas: L(['das granjas de aves: o maior', 'potencial fora da cana no interior'], ['from poultry farms: the largest', 'non-cane potential in the interior']) },
        { cd: itapeva.CD_MUN, dx: -220, dy: 150, tamanho: 16, titulo: L(`${itapeva.NM_MUN.toUpperCase()} · ${mil(itapeva.fora_da_cana_m3d)} M³/DIA`, `${itapeva.NM_MUN.toUpperCase()} · ${mil(itapeva.fora_da_cana_m3d)} M³/DAY`), linhas: L(['da palha de milho e soja'], ['from maize and soy straw']) },
      ],
    }),
    numeros: () => [
      [pct((100 * c.fora_da_cana) / c.total, 0), [L('do potencial vem de fora', 'of the potential comes from'), L(`da cana (${grande(c.fora_da_cana)} m³/dia)`, `outside cane (${grande(c.fora_da_cana)} m³/day)`)]],
      [nf(F.get('graos').municipios), [L('municípios lideram com', 'municipalities led by'), L('palha de milho e soja', 'maize and soy straw')]],
      [nf(F.get('lixo').municipios), [L('lideram com o lixo', 'led by organic waste'), L('orgânico e a poda', 'and tree pruning')]],
      [nf(F.get('aves').municipios), [L('lideram com as granjas', 'led by poultry'), L('de aves', 'farms')]],
    ],
    legendaFigura: () => {
      const lg = legendaCategorias([...ordem.map((f) => [f.cor, L(f.pt, f.en)]), [ZERO, L('só cana, ou sem potencial', 'cane only, or no potential')]], 0,
        { titulo: L('MAIOR FONTE FORA DA CANA', 'LARGEST SOURCE OUTSIDE CANE') });
      return { svg: lg.svg, altura: lg.y - 20, largura: 380 };
    },
    painel: (y) => {
      const lg = legendaCategorias(ordem.map((f) => [f.cor, L(f.pt, f.en), L(`${nf(f.municipios)} mun. · ${grande(f.m3d)} m³/dia`, `${nf(f.municipios)} mun. · ${grande(f.m3d)} m³/day`)]), y, { titulo: L('MAIOR FONTE FORA DA CANA', 'LARGEST SOURCE OUTSIDE CANE'), direita: L('municípios que lidera · biometano no estado', 'municipalities led · biomethane in the state') });
      const s = [lg.svg];
      let yy = lg.y + 6;
      s.push(`<rect x="0" y="${yy - 14}" width="30" height="17" fill="${ZERO}" stroke="#1a211a" stroke-width=".6"/><text x="42" y="${yy}" font-family="${SERIF}" font-size="16">${esc(L(`só cana, ou sem potencial (${c.sem_fora_da_cana} municípios)`, `cane only, or no potential (${c.sem_fora_da_cana} municipalities)`))}</text>`);
      yy += 42;
      s.push(rotuloPainel(L('MAIS BIOMETANO FORA DA CANA (M³/DIA)', 'MOST BIOMETHANE OUTSIDE CANE (M³/DAY)'), yy));
      const b = barras(fora.slice(0, 6).map((l) => [l.NM_MUN, l.fora_da_cana_m3d, F.get(l.lider_fora_da_cana).cor]), yy + 14, { max: fora[0].fora_da_cana_m3d, sufixo: '' });
      s.push(b.svg);
      return { svg: s.join('\n'), y: b.y + 6 };
    },
    fontes: () => [CP2B(), L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025')],
  });
}

/* ------------------------------------------------------------------ 3/5 gasodutos */
function gas() {
  const fx = c.gas_faixas;
  const longe = c.longe_gas[0];
  /** Faixa do potencial e os traços do gás; `distribuidoras` nomeia as concessionárias (só na prancha). */
  const chave = (y, distribuidoras) => {
    const lp = legendaPotencial(y, 'lpg');
    const d = distribuidoras ? ` (${c.infra.distribuicao.distribuidoras.join(', ')})` : '';
    const lt = legendaTracos([
      ['linha', GAS_T, 3.2, L('gasoduto de transporte', 'transmission pipeline')],
      ['linha', GAS_D, 1.5, L(`gasoduto de distribuição${d}`, `distribution pipeline${d}`)],
      ['ponto', GAS_T, 4.2, L('ponto de entrega de gás', 'gas delivery point')],
    ], lp.y + 10);
    return { svg: `${lp.svg}\n${lt.svg}`, y: lt.y };
  };
  return () => ({
    layout: 'um',
    motivo: 'biogas',
    serie: serie(3),
    titulo: () => L('Biometano e gasodutos', 'Biomethane and gas pipelines'),
    subtitulo: () => L('O gás do campo fica longe do cano', 'Countryside gas lies far from the pipe'),
    descricao: () => L(
      `Potencial de biometano por município (${N4()}), gasodutos de transporte e de distribuição e pontos de entrega de gás existentes`,
      `Biomethane potential by municipality (${N4()}), existing transmission and distribution gas pipelines and gas delivery points`),
    mapa: () => ({
      preencher: potencial(),
      bordaMunicipio: 0.4,
      linhas: [
        { feats: c.desenho.distribuicao.features, cor: GAS_D, largura: 1.5, halo: 2 },
        { feats: c.desenho.transporte.features, cor: GAS_T, largura: 3.2, halo: 3 },
      ],
      pontos: c.desenho.entrega.map((coord) => ({ coord, r: 3.6, cor: GAS_T, borda: PAPEL, opacidade: 1 })),
      chamadas: [{ cd: longe.CD_MUN, dx: -200, dy: -150, tamanho: 16, titulo: L(`${longe.NM_MUN.toUpperCase()} · ${nf(longe.km, 0)} KM`, `${longe.NM_MUN.toUpperCase()} · ${nf(longe.km, 0)} KM`), linhas: L([`do gasoduto mais próximo, com o maior`, `potencial do estado: ${mil(longe.v)} m³/dia`], ['from the nearest pipeline, with the', `state’s largest potential: ${mil(longe.v)} m³/day`]) }],
    }),
    numeros: () => [
      [pct((100 * fx[3].m3d) / c.total, 0), [L('do potencial fica a mais', 'of the potential lies over'), L('de 50 km de um gasoduto', '50 km from a pipeline')]],
      [pct((100 * fx[0].m3d) / c.total, 0), [L('fica a até 10 km, onde', 'lies within 10 km, where'), L(`moram ${grande(fx[0].pessoas)} de pessoas`, `${grande(fx[0].pessoas)} people live`)]],
      [L(`${nf(c.infra.transporte.km)} km`, `${nf(c.infra.transporte.km)} km`), [L('de gasodutos de transporte', 'of transmission pipelines'), L('em São Paulo', 'in São Paulo')]],
      [nf(c.infra.entrega), [L('pontos de entrega de gás', 'gas delivery points'), L('no estado', 'in the state')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('POTENCIAL POR DISTÂNCIA AO GASODUTO', 'POTENTIAL BY DISTANCE TO A PIPELINE'), y)];
      const b = barrasFaixas(fx, y + 14);
      s.push(b.svg);
      s.push(`<text x="130" y="${b.y + 12}" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L('m³/dia · parte do estado · municípios; do centro do município', 'm³/day · share of the state · municipalities; from the municipality’s centre'))}</text>`);
      const k = chave(b.y + 50, true);
      s.push(k.svg);
      return { svg: s.join('\n'), y: k.y };
    },
    legendaFigura: () => {
      const k = chave(0, false);
      return { svg: k.svg, altura: k.y - 20, largura: 440 };
    },
    fontes: () => [CP2B(), L('EPE, WebMap (via MapBiomas)', 'EPE, WebMap (via MapBiomas)'), L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025')],
  });
}

/* ------------------------------------------------------------------ 4/5 rede elétrica */
function eletrica() {
  const fx = c.lt_faixas;
  const fs = c.se_faixas;
  const longe = [...c.linhas].filter((l) => l.km_subestacao > 50).sort((a, z) => z.biometano_m3d - a.biometano_m3d)[0];
  const faixaLt = (kv) => LT_FAIXAS.find(([f]) => f(kv));
  /** Faixa do potencial, as linhas por tensão e as subestações. */
  const chave = (y) => {
    const lp = legendaPotencial(y, 'lpe');
    const lt = legendaTracos([
      ...LT_FAIXAS.map(([, cor, w, pt, en]) => ['linha', cor, w, L(pt, en)]),
      ['ponto', TINTA, 4, L('subestação', 'substation')],
    ], lp.y + 10);
    return { svg: `${lp.svg}\n${lt.svg}`, y: lt.y };
  };
  return () => ({
    layout: 'um',
    motivo: 'biogas',
    serie: serie(4),
    titulo: () => L('Biometano e rede elétrica', 'Biomethane and the power grid'),
    subtitulo: () => L('O fio chega mais perto do que o cano', 'The wire reaches closer than the pipe'),
    descricao: () => L(
      `Potencial de biometano por município (${N4()}), linhas de transmissão e subestações da rede básica existentes`,
      `Biomethane potential by municipality (${N4()}), existing basic-grid transmission lines and substations`),
    mapa: () => ({
      preencher: potencial(),
      bordaMunicipio: 0.4,
      linhas: [{ feats: c.desenho.lt.features, cor: (f) => faixaLt(f.properties.tensao_kv)[1], largura: (f) => faixaLt(f.properties.tensao_kv)[2], halo: 1.6 }],
      pontos: c.desenho.se.map((coord) => ({ coord, r: 3.4, cor: TINTA, borda: PAPEL, opacidade: 0.9 })),
      chamadas: [{ cd: longe.CD_MUN, dx: -100, dy: -160, tamanho: 16, titulo: L(`${longe.NM_MUN.toUpperCase()} · ${nf(longe.km_subestacao, 0)} KM`, `${longe.NM_MUN.toUpperCase()} · ${nf(longe.km_subestacao, 0)} KM`), linhas: L(['da subestação mais próxima,', `com ${mil(longe.biometano_m3d)} m³/dia`], ['from the nearest substation,', `with ${mil(longe.biometano_m3d)} m³/day`]) }],
    }),
    numeros: () => [
      [pct((100 * fx[0].m3d) / c.total, 0), [L('do potencial fica a até', 'of the potential lies within'), L('10 km de uma linha', '10 km of a line')]],
      [pct((100 * (fs[2].m3d + fs[3].m3d)) / c.total, 0), [L('fica a mais de 25 km', 'lies over 25 km'), L('de uma subestação', 'from a substation')]],
      [L(`${nf(c.infra.lt.km / 1000, 1)} mil km`, `${nf(c.infra.lt.km / 1000, 1)} thousand km`), [L('de linhas de 230 kV ou', 'of lines of 230 kV or'), L('mais em São Paulo', 'more in São Paulo')]],
      [nf(c.infra.se), [L('subestações da rede', 'basic-grid substations'), L('básica no estado', 'in the state')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('POTENCIAL POR DISTÂNCIA À LINHA', 'POTENTIAL BY DISTANCE TO A LINE'), y)];
      const b = barrasFaixas(fx, y + 14);
      s.push(b.svg);
      let yy = b.y + 30;
      s.push(rotuloPainel(L('… E À SUBESTAÇÃO', '… AND TO A SUBSTATION'), yy));
      const b2 = barrasFaixas(fs, yy + 14);
      s.push(b2.svg);
      s.push(`<text x="130" y="${b2.y + 12}" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L('m³/dia · parte do estado · municípios; do centro do município', 'm³/day · share of the state · municipalities; from the municipality’s centre'))}</text>`);
      const k = chave(b2.y + 50);
      s.push(k.svg);
      return { svg: s.join('\n'), y: k.y };
    },
    legendaFigura: () => {
      const k = chave(0);
      // As linhas do Paraná enchem o canto de baixo à esquerda; a legenda vai para o mar.
      return { svg: k.svg, altura: k.y - 20, largura: 440, canto: 'se' };
    },
    fontes: () => [CP2B(), L('EPE, WebMap (via MapBiomas)', 'EPE, WebMap (via MapBiomas)'), L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025')],
  });
}

/* ------------------------------------------------------------------ 5/5 em operação */
function operacao() {
  const anp = [...c.anp].sort((a, z) => z.capacidade_m3d - a.capacidade_m3d);
  const capTot = anp.reduce((a, p) => a + p.capacidade_m3d, 0);
  const procTot = anp.reduce((a, p) => a + p.biogas_processado_m3d, 0);
  const capBiogas = anp.reduce((a, p) => a + p.capacidade_biogas_m3d, 0);
  const gd = [...c.gd].sort((a, z) => z.potencia_kw - a.potencia_kw);
  const gdKw = gd.reduce((a, m) => a + m.potencia_kw, 0);
  const gdN = gd.reduce((a, m) => a + m.unidades, 0);
  const raioAnp = (v) => 4 + Math.sqrt(v / 140000) * 26;
  const raioGd = (kw) => 4 + Math.sqrt(kw / 9000) * 20;
  const pm = c.desenho.pontoMun;
  const maior = anp[0];
  const ref = anp[0].referencia;
  /** Faixa do potencial (clara) e os dois conjuntos de círculos, plantas da ANP e GD da ANEEL. */
  const chave = (y) => {
    const s = [];
    const lp = legendaPotencial(y, 'lpo', CORES_CLARO);
    s.push(lp.svg);
    let yy = lp.y + 18;
    const lc = legendaCirculos([130000, 60000, 20000], raioAnp, (v) => L(`${nf(v / 1000)} mil m³/dia`, `${nf(v / 1000)} thousand m³/day`), { y: yy, cor: '#234e70' });
    s.push(lc.svg);
    const lg = legendaCirculos([8000, 1000], raioGd, (v) => `${nf(v / 1000, v < 1000 ? 1 : 0)} MW`, { x: LP / 2 + 30, y: yy + 2 * (raioAnp(130000) - raioGd(8000)), cor: '#9c4a32' });
    s.push(lg.svg);
    yy += Math.max(lc.altura, 2 * raioAnp(130000)) + 18;
    s.push(`<text x="0" y="${yy}" font-family="${SERIF}" font-size="15">${esc(L('plantas de biometano (ANP)', 'biomethane plants (ANP)'))}</text>`);
    s.push(`<text x="${LP / 2 + 30}" y="${yy}" font-family="${SERIF}" font-size="15">${esc(L('GD a biogás por município (ANEEL)', 'biogas DG by municipality (ANEEL)'))}</text>`);
    return { svg: s.join('\n'), y: yy + 10 };
  };
  return () => ({
    layout: 'um',
    motivo: 'biogas',
    serie: serie(5),
    titulo: () => L('Biogás em operação', 'Biogas in operation'),
    subtitulo: () => L('Do potencial, o que já virou planta', 'Of the potential, what has already become a plant'),
    descricao: () => L(
      `Plantas de biometano autorizadas pela ANP que informaram produção em ${ref} e geração distribuída a biogás registrada na ANEEL, sobre o potencial de biometano (${N4()})`,
      `Biomethane plants authorised by ANP that reported production in ${ref} and biogas distributed generation registered with ANEEL, over the biomethane potential (${N4()})`),
    mapa: () => ({
      preencher: potencial(true),
      bordaMunicipio: 0.4,
      pontos: [
        ...anp.map((p) => ({ coord: pm[p.CD_MUN], r: raioAnp(p.capacidade_m3d), cor: '#234e70', borda: PAPEL, opacidade: 0.85 })),
        ...gd.map((m) => ({ coord: pm[m.CD_MUN], r: raioGd(m.potencia_kw), cor: '#9c4a32', anel: true, largura: 2.2 })),
      ],
      chamadas: [{ cd: maior.CD_MUN, dx: 220, dy: 230, tamanho: 16, titulo: L(`${maior.NM_MUN.toUpperCase()} · ${mil(maior.capacidade_m3d)} M³/DIA`, `${maior.NM_MUN.toUpperCase()} · ${mil(maior.capacidade_m3d)} M³/DAY`), linhas: L(['a maior capacidade autorizada,', 'da vinhaça e da torta de filtro'], ['the largest authorised capacity,', 'from vinasse and filter cake']) }],
    }),
    numeros: () => [
      [mil(capTot), [L('m³/dia de biometano', 'm³/day of biomethane'), L(`autorizados (${pct((100 * capTot) / c.total, 1)} do potencial)`, `authorised (${pct((100 * capTot) / c.total, 1)} of potential)`)]],
      [nf(anp.length), [L('plantas de biometano', 'biomethane plants'), L(`informaram à ANP em ${ref}`, `reported to ANP in ${ref}`)]],
      [pct((100 * procTot) / capBiogas, 0), [L('da capacidade de biogás', 'of biogas capacity'), L('foi processada no mês', 'was processed that month')]],
      [L(`${nf(gdKw / 1000, 1)} MW`, `${nf(gdKw / 1000, 1)} MW`), [L(`em ${gdN} unidades de geração`, `in ${gdN} distributed generation`), L('distribuída a biogás', 'units on biogas')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('PLANTAS DE BIOMETANO (M³/DIA AUTORIZADOS)', 'BIOMETHANE PLANTS (AUTHORISED M³/DAY)'), y)];
      const b = barras(anp.map((p) => [p.NM_MUN, p.capacidade_m3d, '#234e70', `${nf(p.capacidade_m3d)} · ${L('uso', 'use')} ${nf(p.utilizacao_pct)} %`]), y + 14, { max: 1.3 * anp[0].capacidade_m3d, x0: 170 });
      s.push(b.svg);
      s.push(`<text x="170" y="${b.y + 12}" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L('uso = biogás processado ÷ capacidade de biogás, no mês', 'use = biogas processed ÷ biogas capacity, in the month'))}</text>`);
      const k = chave(b.y + 50);
      s.push(k.svg);
      return { svg: s.join('\n'), y: k.y };
    },
    legendaFigura: () => {
      const k = chave(0);
      return { svg: k.svg, altura: k.y - 6, largura: 560 };
    },
    fontes: () => [L(`ANP, biometano, ${ref}`, `ANP, biomethane, ${ref}`), L(`ANEEL, geração distribuída, ${c.gd_ref}`, `ANEEL, distributed generation, ${c.gd_ref}`), CP2B()],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { densidade, alem, gas, eletrica, operacao };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/biogas-territorio-sp/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
const e = SERIE.find((s) => s.tema === nome);
const fazer = TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => fazer() });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `biogas-territorio-sp-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
