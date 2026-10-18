#!/usr/bin/env node
/**
 * Coleção «Carbono biogênico» — desenha uma prancha a partir do cache de preparar.mjs (uso interno).
 *
 *   node scripts/colecoes/carbono-sp/prancha.mjs dornas|biogas|fossil|ptx
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { RAIZ, LP, SERIF, MONO, TINTA, CINZA, PAPEL, esc, nf, f1, gerarPrancha, rotuloPainel, legendaFaixa } from '../lib/prancha-sp.mjs';
import { L, NEUTRO, ZERO, pct, barras, caixaLegenda, nota } from '../lib/painel.mjs';
import { legendaCirculos } from '../lib/arte.mjs';
import { friso } from './friso.mjs';

const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'carbono-sp', 'serie.json'), 'utf8'));
const c = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', 'carbono-sp.json'), 'utf8'));
const K = c.coef;
const por = new Map(c.linhas.map((l) => [l.CD_MUN, l]));
const serie = (i) => () => L(`CARBONO BIOGÊNICO · ${i}/4`, `BIOGENIC CARBON · ${i}/4`);
const CP2B = () => L('CP2B (Unicamp), método v5.1, 2026', 'CP2B (Unicamp), method v5.1, 2026');
const N4 = () => L('CP2B v5.1, nível N4, cenário de referência', 'CP2B v5.1, level N4, reference scenario');

const FERM = '#7a3b2c';
const CORES_BIOGAS = ['#f1efe6', '#e2dcc6', '#cbbd97', '#ab9467', '#836a44', '#5a4628'];
const CORES_PCT = ['#5d4a6b', '#9c8aa6', '#d3c9cf', '#b7c4a1', '#6f8f5a', '#3d5e34'];
const LIM_PCT = [10, 25, 50, 75, 90];
const CORES_REG = ['#eef1f3', '#d3dde3', '#a9bfcb', '#7598ab', '#46697f'];
const FOSSIL = '#5d4a6b', BIOGAS = '#836a44';
const GAS_T = '#6b3d5c', GAS_D = '#c08a2e';

/** Mt com uma casa: "8,9 Mt". */
const mt = (t, casas = 1) => `${nf(t / 1e6, casas)} Mt`;
const kt = (t) => L(`${nf(t / 1e3)} mil t`, `${nf(t / 1e3)} kt`);
const cls = (v, lim) => { if (v === null || v === undefined) return null; if (v === 0) return -1; let i = 0; while (i < lim.length - 1 && v > lim[i]) i++; return i; };
const classe = (v, lim) => { let i = 0; while (i < lim.length && v > lim[i] + 1e-9) i++; return i; };
const rotLim = (lim) => lim.slice(0, -1).map((v) => (v >= 1000 ? `${nf(v / 1000, v % 1000 ? 1 : 0)} mil` : nf(v)));
const rotLimEn = (lim) => lim.slice(0, -1).map((v) => (v >= 1000 ? `${nf(v / 1000, v % 1000 ? 1 : 0)}k` : nf(v)));
const MES = () => L(['abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez', 'jan', 'fev', 'mar'], ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']);
const titulo = (s) => s.toUpperCase();

/** Legenda de linhas do mapa: [[cor, largura, rótulo]]. */
function legendaLinhas(itens, y, { passo = 25 } = {}) {
  const s = [];
  for (const [cor, w, rot] of itens) {
    s.push(`<path d="M0 ${y - 6}H30" stroke="${PAPEL}" stroke-width="${w + 3}" stroke-linecap="round"/><path d="M0 ${y - 6}H30" stroke="${cor}" stroke-width="${w}" stroke-linecap="round"/>`);
    s.push(`<text x="42" y="${y}" font-family="${SERIF}" font-size="16">${esc(rot)}</text>`);
    y += passo;
  }
  return { svg: s.join('\n'), y };
}

/* ------------------------------------------------------------------ 1/4 o CO2 das dornas */
function dornas() {
  const mun = c.linhas.filter((l) => l.co2_fermentacao_t > 0);
  const max = Math.max(...mun.map((l) => l.co2_fermentacao_t));
  const R = 30;
  const raio = (t) => R * Math.sqrt(t / max);
  const g1 = c.top_ferm[0], g2 = c.linhas.find((l) => l.NM_MUN === 'Piracicaba');
  const s = c.safra;
  const top = c.top_ferm.slice(0, 6);
  return () => ({
    layout: 'um',
    motivo: friso,
    serie: serie(1),
    titulo: () => L('O CO₂ das dornas', 'The CO₂ from the vats'),
    subtitulo: () => L('Toda usina de etanol solta um gás quase puro, que hoje vai para o ar', 'Every ethanol mill gives off an almost pure gas that now goes into the air'),
    descricao: () => L(
      'CO₂ da fermentação estimado por município, na safra 2025/26: a produção de etanol do estado (ANP) rateada pela capacidade autorizada de cada usina, vezes o CO₂ da estequiometria; estimativa',
      'Fermentation CO₂ estimated by municipality, 2025/26 harvest: the state’s ethanol output (ANP) shared out by each mill’s authorised capacity, times the stoichiometric CO₂; an estimate'),
    mapa: () => ({
      preencher: (cd) => (por.get(cd)?.co2_fermentacao_t > 0 ? '#ece4dc' : NEUTRO),
      bordaMunicipio: 0.4,
      pontos: mun.sort((a, b) => b.co2_fermentacao_t - a.co2_fermentacao_t).map((l) => ({ coord: c.pontos[l.CD_MUN], r: Math.max(raio(l.co2_fermentacao_t), 2.5), cor: FERM, borda: PAPEL, opacidade: 0.78 })),
      chamadas: [
        {
          cd: g1.CD_MUN, dx: 150, dy: -170, tamanho: 16,
          titulo: L(`${titulo(g1.NM_MUN)} · ${nf(g1.v / 1000)} MIL T`, `${titulo(g1.NM_MUN)} · ${nf(g1.v / 1000)} KT`),
          linhas: L([`de CO₂ por safra, em ${g1.n} usinas:`, 'o maior ponto do estado'], [`of CO₂ a harvest, from ${g1.n} mills:`, 'the largest point in the state']),
        },
        {
          cd: g2.CD_MUN, dx: -330, dy: 300, tamanho: 16,
          titulo: L(`PIRACICABA · ${nf(g2.co2_fermentacao_t / 1000)} MIL T`, `PIRACICABA · ${nf(g2.co2_fermentacao_t / 1000)} KT`),
          linhas: L(['onde a dorna fica a', `${nf(g2.km_gasoduto)} km de um gasoduto`], ['where the vat lies', `${nf(g2.km_gasoduto)} km from a gas pipeline`]),
        },
      ],
    }),
    numeros: () => [
      [mt(s.co2_t), [L('de CO₂ de fermentação', 'of fermentation CO₂'), L('na safra 2025/26', 'in the 2025/26 harvest')]],
      [L(`${nf(s.etanol_m3 / 1e9 * 1000, 1)} bi L`, `${nf(s.etanol_m3 / 1e6, 1)} bn L`), [L('de etanol: 57 % hidratado', 'of ethanol: 57% hydrous'), L('e 43 % anidro', 'and 43% anhydrous')]],
      [nf(c.n_usinas), [L('usinas com capacidade', 'mills with authorised'), L(`autorizada, em ${nf(c.n_mun_ferm)} municípios`, `capacity, in ${nf(c.n_mun_ferm)} municipalities`)]],
      [L(`${nf(K.t_co2_por_m3_hidratado, 2)} t`, `${nf(K.t_co2_por_m3_hidratado, 2)} t`), [L('de CO₂ por m³ de hidratado;', 'of CO₂ per m³ of hydrous;'), L(`${nf(K.t_co2_por_m3_anidro, 2)} t por m³ de anidro`, `${nf(K.t_co2_por_m3_anidro, 2)} t per m³ of anhydrous`)]],
    ],
    painel: (y) => {
      const out = [rotuloPainel(L('CO₂ NA SAFRA', 'CO₂ PER HARVEST'), y)];
      const lc = legendaCirculos([250000, 100000, 25000], raio, (v) => L(`${nf(v / 1000)} mil t`, `${nf(v / 1000)} kt`), { y: y + 18, cor: FERM });
      out.push(lc.svg);
      // Sazonalidade: CO2 por mês da safra.
      const xC = 300, wC = LP - xC, hC = 88, y0 = y + 6;
      const mx = Math.max(...s.mensal.map((m) => m.co2_t));
      const bw = wC / s.mensal.length;
      out.push(`<text x="${xC}" y="${y}" font-family="${MONO}" font-size="13" letter-spacing="1.5" fill="${CINZA}">${esc(L('POR MÊS, MIL T', 'BY MONTH, KT'))}</text>`);
      s.mensal.forEach((m, i) => {
        const hh = (m.co2_t / mx) * hC;
        out.push(`<rect x="${f1(xC + i * bw + 2)}" y="${f1(y0 + 14 + hC - hh)}" width="${f1(bw - 4)}" height="${f1(Math.max(hh, 0.8))}" fill="${FERM}"/>`);
        out.push(`<text x="${f1(xC + i * bw + bw / 2)}" y="${f1(y0 + 14 + hC + 16)}" text-anchor="middle" font-family="${MONO}" font-size="10" fill="${CINZA}">${MES()[i]}</text>`);
        if (m.co2_t === mx) out.push(`<text x="${f1(xC + i * bw + bw / 2)}" y="${f1(y0 + 14 + hC - hh - 5)}" text-anchor="middle" font-family="${MONO}" font-size="11">${nf(m.co2_t / 1000)}</text>`);
      });
      let yy = Math.max(y + 18 + lc.altura, y0 + 14 + hC + 16) + 30;
      out.push(rotuloPainel(L('OS MAIORES MUNICÍPIOS', 'THE LARGEST MUNICIPALITIES'), yy));
      const b = barras(top.map((t) => [t.NM_MUN, t.v, FERM, L(`${nf(t.v / 1000)} mil t · ${t.n} us. · ${nf(t.km)} km do gás`, `${nf(t.v / 1000)} kt · ${t.n} ${t.n === 1 ? 'mill' : 'mills'} · ${nf(t.km)} km to gas`)]), yy + 14, { max: max * 2.15, x0: 150, passo: 20 });
      out.push(b.svg);
      const n = nota(L('Estimativa. A ANP publica a produção só por estado e mês; a de cada usina sai da capacidade autorizada. O ponto fica no centro do município. Fermentação: C₆H₁₂O₆ →\u00a02\u00a0C₂H₅OH\u00a0+\u00a02\u00a0CO₂, 0,955 kg de CO₂ por kg de etanol.',
        'An estimate. ANP publishes output only by state and month; each mill’s share comes from its authorised capacity. The dot sits at the municipality’s centre. Fermentation: C₆H₁₂O₆ →\u00a02\u00a0C₂H₅OH\u00a0+\u00a02\u00a0CO₂, 0.955 kg of CO₂ per kg of ethanol.'), b.y + 14, { tamanho: 14 });
      out.push(n.svg);
      return { svg: out.join('\n'), y: n.y + 4 };
    },
    fontes: () => [
      L('ANP, Painel de Produtores de Etanol (2026)', 'ANP, Ethanol Producers Panel (2026)'),
      L('ANP, Resolução nº 907/2022', 'ANP, Resolution 907/2022'),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ 2/4 o CO2 da purificação do biogás */
function biogas() {
  const lim = c.lim_biogas;
  const pintar = (cd) => { const k = cls(por.get(cd)?.co2_biogas_t, lim); return k === null ? null : k < 0 ? ZERO : CORES_BIOGAS[k]; };
  const t1 = c.top_biogas[0];
  const cap = por.get('3550308');
  const tot = c.T.biogas;
  const G = () => ({ cana: L('resíduos da cana', 'sugarcane residues'), lavouras: L('outras lavouras', 'other crops'), pecuaria: L('pecuária', 'livestock'), urbano: L('lixo, poda e esgoto', 'waste, pruning and sewage') });
  const CORG = { cana: CORES_BIOGAS[5], lavouras: CORES_BIOGAS[4], pecuaria: CORES_BIOGAS[3], urbano: '#5f7f8f' };
  const SUB = () => [
    ['VINHACA', L('vinhaça', 'vinasse')], ['BAGACO', L('bagaço e palha', 'bagasse, straw')],
    ['RSU_ORGANICO', L('lixo orgânico', 'organic waste')], ['BOV_LEITE', L('bovinos', 'cattle')],
    ['SUINOS', L('suínos', 'pigs')], ['LODO_ETE', L('lodo de esgoto', 'sewage sludge')],
  ];
  return () => ({
    layout: 'um',
    motivo: friso,
    serie: serie(2),
    titulo: () => L('O CO₂ do biogás', 'The CO₂ in biogas'),
    subtitulo: () => L('Para virar biometano, o biogás solta o CO₂, quase metade do volume', 'To become biomethane, biogas must shed its CO₂, almost half its volume'),
    descricao: () => L(
      `CO₂ que a purificação (upgrading) separaria do biogás possível em cada município, em t por ano: o biogás do potencial ${N4()}, vezes a fração que não é metano; estimativa`,
      `CO₂ that upgrading would separate from the possible biogas in each municipality, in t a year: the biogas of the ${N4()} potential, times the share that is not methane; an estimate`),
    mapa: () => ({
      preencher: pintar,
      bordaMunicipio: 0.4,
      chamadas: [
        {
          cd: t1.CD_MUN, dx: 150, dy: -170, tamanho: 16,
          titulo: L(`${titulo(t1.NM_MUN)} · ${nf(t1.v / 1000)} MIL T`, `${titulo(t1.NM_MUN)} · ${nf(t1.v / 1000)} KT`),
          linhas: L(['de CO₂ por ano, o maior', 'potencial do estado'], ['of CO₂ a year, the largest', 'potential in the state']),
        },
        {
          cd: cap.CD_MUN, dx: 120, dy: 230, tamanho: 16,
          titulo: L(`SÃO PAULO · ${nf(cap.co2_biogas_t / 1000)} MIL T`, `SÃO PAULO · ${nf(cap.co2_biogas_t / 1000)} KT`),
          linhas: L(['do lixo orgânico, da poda', 'e do lodo de esgoto'], ['from organic waste, pruning', 'and sewage sludge']),
        },
      ],
    }),
    numeros: () => [
      [mt(tot), [L('de CO₂ por ano, se todo o', 'of CO₂ a year, if all the'), L('biogás possível fosse purificado', 'possible biogas were upgraded')]],
      [pct((100 * c.grupos_biogas[0].t) / tot, 0), [L('vem dos resíduos da cana:', 'comes from cane residues:'), L('vinhaça, torta, bagaço, palha', 'vinasse, cake, bagasse, straw')]],
      [nf(c.com_biogas), [L('municípios com algum', 'municipalities with some'), L('CO₂ de biogás possível', 'possible biogas CO₂')]],
      [mt(c.T.fermentacao), [L('das dornas, na safra: as duas', 'from the vats per harvest: the'), L('fontes têm quase o mesmo tamanho', 'two sources are about the same')]],
    ],
    painel: (y) => {
      const out = [rotuloPainel(L('CO₂ DO BIOGÁS · T POR ANO', 'BIOGAS CO₂ · T A YEAR'), y)];
      out.push(legendaFaixa(CORES_BIOGAS, L(rotLim(lim), rotLimEn(lim)), { y: y + 18, larg: 62, semInfo: false, id: 'lfb' }));
      let yy = y + 82;
      out.push(rotuloPainel(L('DE ONDE VEM O CO₂', 'WHERE THE CO₂ COMES FROM'), yy));
      const b = barras(c.grupos_biogas.map((g) => [G()[g.g], g.t, CORG[g.g], `${mt(g.t, 2)} · ${pct((100 * g.t) / tot, 0)}`]), yy + 14, { max: c.grupos_biogas[0].t * 1.45, x0: 190, passo: 20 });
      out.push(b.svg);
      yy = b.y + 24;
      out.push(rotuloPainel(L('CO₂ NO BIOGÁS, POR RESÍDUO (% DO VOLUME)', 'CO₂ IN BIOGAS, BY RESIDUE (% OF VOLUME)'), yy));
      // Duas colunas de três: rótulo, barra (0 a 60 %) e valor.
      const b2 = { svg: SUB().map(([k, r], i) => {
        const v = 100 * (1 - c.fracoes[k]), x = i < 3 ? 0 : LP / 2 + 10, yl = yy + 14 + (i % 3) * 19, xb = x + 150, wb = (v / 60) * (LP / 2 - 220);
        return `<text x="${xb - 10}" y="${f1(yl + 11)}" text-anchor="end" font-family="${SERIF}" font-size="14">${esc(r)}</text><rect x="${xb}" y="${f1(yl + 2)}" width="${f1(wb)}" height="11" fill="#ab9467"/><text x="${f1(xb + wb + 6)}" y="${f1(yl + 11)}" font-family="${MONO}" font-size="12">${esc(pct(v, 0))}</text>`;
      }).join('\n'), y: yy + 14 + 3 * 19 };
      out.push(b2.svg);
      const n = nota(L(`Estimativa. O biogás é tomado como metano e CO₂, sem os traços de outros gases; ${nf(K.kg_co2_por_nm3, 3)} kg por m³ de CO₂ (0 °C, 1 atm). O CO₂ só existe se o biogás for feito e purificado: é potencial, não emissão.`,
        `An estimate. Biogas is taken as methane and CO₂, without trace gases; ${nf(K.kg_co2_por_nm3, 3)} kg per m³ of CO₂ (0 °C, 1 atm). This CO₂ exists only if the biogas is made and upgraded: it is potential, not emission.`), b2.y + 14, { tamanho: 14 });
      out.push(n.svg);
      return { svg: out.join('\n'), y: n.y + 4 };
    },
    fontes: () => [CP2B(), L('NIST, Chemistry WebBook (densidade do CO₂)', 'NIST, Chemistry WebBook (CO₂ density)'), L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025')],
  });
}

/* ------------------------------------------------------------------ 3/4 biogênico contra fóssil */
function fossil() {
  const ls = c.linhas.filter((l) => l.pct_biogenico_grandes !== null);
  const grande = (l) => l.co2_fermentacao_2024_t + l.co2_fossil_estacionario_t;
  const max = Math.max(...ls.map(grande));
  const R = 34;
  const raio = (t) => R * Math.sqrt(t / max);
  const T = c.T;
  const parte = (100 * T.fermentacao_2024) / (T.fermentacao_2024 + T.fossil_est);
  const cub = por.get('3513504'), gua = por.get('3517406'), pir = por.get('3538709');
  const nBio = ls.filter((l) => l.pct_biogenico_grandes > 50).length;
  return () => ({
    layout: 'um',
    motivo: friso,
    serie: serie(3),
    titulo: () => L('Biogênico contra fóssil', 'Biogenic versus fossil'),
    subtitulo: () => L('Nas grandes fontes fixas do estado, metade do CO₂ vem da cana', 'In the state’s large fixed sources, half the CO₂ comes from sugarcane'),
    descricao: () => L(
      'CO₂ de 2024 por município: o da fermentação do etanol (ANP, estimado) e o fóssil do gás natural industrial, de cogeração e termelétrico, do óleo combustível e do coque (Anuário de Energéticos da SEMIL, fatores do IPCC); a cor é a parte biogênica',
      'CO₂ in 2024 by municipality: that from ethanol fermentation (ANP, estimated) and the fossil CO₂ from industrial, cogeneration and power-plant natural gas, fuel oil and coke (SEMIL Energy Yearbook, IPCC factors); colour shows the biogenic share'),
    mapa: () => ({
      preencher: () => NEUTRO,
      bordaMunicipio: 0.4,
      pontos: [...ls].sort((a, b) => grande(b) - grande(a)).map((l) => ({ coord: c.pontos[l.CD_MUN], r: Math.max(raio(grande(l)), 2.4), cor: CORES_PCT[classe(l.pct_biogenico_grandes, LIM_PCT)], borda: TINTA, bordaLargura: 0.6, opacidade: 0.92 })),
      chamadas: [
        {
          cd: cub.CD_MUN, dx: 170, dy: 150, tamanho: 16,
          titulo: L(`CUBATÃO · ${nf(cub.co2_fossil_estacionario_t / 1000)} MIL T`, `CUBATÃO · ${nf(cub.co2_fossil_estacionario_t / 1000)} KT`),
          linhas: L(['de CO₂ fóssil do gás e do óleo', 'do polo industrial'], ['of fossil CO₂ from gas and oil', 'in the industrial hub']),
        },
        {
          cd: gua.CD_MUN, dx: 140, dy: -150, tamanho: 16,
          titulo: L(`GUAÍRA · ${nf(gua.co2_fermentacao_2024_t / 1000)} MIL T`, `GUAÍRA · ${nf(gua.co2_fermentacao_2024_t / 1000)} KT`),
          linhas: L(['todo das dornas, sem', 'chaminé fóssil grande'], ['all from the vats, with no', 'large fossil stack']),
        },
        {
          cd: pir.CD_MUN, dx: -260, dy: 260, tamanho: 16,
          titulo: L(`PIRACICABA · ${nf(pir.pct_biogenico_grandes, 0)} %`, `PIRACICABA · ${nf(pir.pct_biogenico_grandes, 0)}%`),
          linhas: L(['biogênico: dorna e fábrica', 'na mesma cidade'], ['biogenic: vat and factory', 'in the same town']),
        },
      ],
    }),
    numeros: () => [
      [pct(parte, 0), [L('do CO₂ das grandes fontes', 'of the CO₂ from large fixed'), L('fixas é biogênico (2024)', 'sources is biogenic (2024)')]],
      [mt(T.fermentacao_2024), [L('das dornas, contra', 'from the vats, against'), L(`${mt(T.fossil_est)} fósseis`, `${mt(T.fossil_est)} fossil`)]],
      [mt(T.fossil_energia, 0), [L('de CO₂ fóssil de toda a energia', 'of fossil CO₂ from all energy'), L('do estado, transporte incluído', 'in the state, transport included')]],
      [L('~100 %', '~100%'), [L('de CO₂ no gás da dorna;', 'CO₂ in the vat gas;'), L('3 a 15 % numa chaminé', '3 to 15% in a stack')]],
    ],
    painel: (y) => {
      const out = [rotuloPainel(L('CO₂ EM SÃO PAULO · MT POR ANO', 'CO₂ IN SÃO PAULO · MT A YEAR'), y)];
      const itens = [
        [L('dornas de etanol (2024)', 'ethanol vats (2024)'), T.fermentacao_2024, FERM, `${mt(T.fermentacao_2024)} · ${L('biogênico', 'biogenic')}`],
        [L('purificação do biogás', 'biogas upgrading'), T.biogas, BIOGAS, `${mt(T.biogas)} · ${L('potencial', 'potential')}`],
        [L('gás, óleo e coque fixos', 'fixed gas, oil and coke'), T.fossil_est, FOSSIL, `${mt(T.fossil_est)} · ${L('fóssil', 'fossil')}`],
        [L('toda a energia fóssil', 'all fossil energy'), T.fossil_energia, '#9c8aa6', `${mt(T.fossil_energia)} · ${L('fóssil', 'fossil')}`],
      ];
      const b = barras(itens, y + 14, { max: T.fossil_energia * 1.45, x0: 210, passo: 20 });
      out.push(b.svg);
      let yy = b.y + 30;
      out.push(rotuloPainel(L('PARTE BIOGÊNICA, POR MUNICÍPIO', 'BIOGENIC SHARE, BY MUNICIPALITY'), yy));
      const rot = L(['até 10 %', '10 a 25 %', '25 a 50 %', '50 a 75 %', '75 a 90 %', 'mais de 90 %'], ['up to 10%', '10 to 25%', '25 to 50%', '50 to 75%', '75 to 90%', 'over 90%']);
      const nCl = new Array(6).fill(0);
      for (const l of ls) nCl[classe(l.pct_biogenico_grandes, LIM_PCT)]++;
      yy += 26;
      const col = (LP - 20) / 2;
      CORES_PCT.forEach((k, i) => {
        const x = i < 3 ? 0 : col + 20, yl = yy + (i % 3) * 22;
        out.push(`<circle cx="${x + 9}" cy="${yl - 6}" r="8" fill="${k}" stroke="${TINTA}" stroke-width=".6"/><text x="${x + 26}" y="${yl}" font-family="${SERIF}" font-size="15">${esc(`${rot[i]} · ${nf(nCl[i])} ${L('mun.', 'mun.')}`)}</text>`);
      });
      yy += 3 * 22 + 4;
      const lc = legendaCirculos([800000, 300000, 50000], raio, (v) => L(`${nf(v / 1000)} mil t`, `${nf(v / 1000)} kt`), { y: yy, cor: '#6f6672' });
      out.push(lc.svg);
      const n = nota(L(`Estimativa. O fóssil é um piso: o Anuário só vê o combustível vendido, e ficam fora o consumo próprio das refinarias, o carvão da siderurgia e o CO₂ da calcinação do cimento. ${nf(nBio)} municípios têm mais CO₂ biogênico que fóssil.`,
        `An estimate. The fossil figure is a floor: the Yearbook sees only fuel sold, leaving out refineries’ own use, steelworks’ coal and cement calcination. ${nf(nBio)} municipalities have more biogenic than fossil CO₂.`), yy + lc.altura + 16, { tamanho: 13 });
      out.push(n.svg);
      return { svg: out.join('\n'), y: n.y + 4 };
    },
    fontes: () => [
      L('SEMIL, Anuário de Energéticos por Município 2025', 'SEMIL, Energy Yearbook by Municipality 2025'),
      L('ANP, Painel de Produtores de Etanol (2026)', 'ANP, Ethanol Producers Panel (2026)'),
      L('IPCC 2006 e 2005; EPE, BEN 2025; CP2B v5.1', 'IPCC 2006 and 2005; EPE, BEN 2025; CP2B v5.1'),
    ],
  });
}

/* ------------------------------------------------------------------ 4/4 o que o CO2 poderia virar */
function ptx() {
  const regs = c.regioes;
  const reg = new Map(regs.map((r) => [r.CD_RGINT, r]));
  const lim = [...regs].map((r) => r.emetano_nm3_dia).sort((a, b) => a - b);
  const LIM_R = [100000, 1000000, 2000000, 4000000, Infinity];
  const pintar = (cd) => { const r = reg.get(por.get(cd)?.CD_RGINT); return r ? CORES_REG[classe(r.emetano_nm3_dia, LIM_R)] : null; };
  const totCo2 = c.biogenico;
  const emet = (totCo2 * K.nm3_ch4_por_t_co2) / 365;
  const emetF = (c.T.fermentacao * K.nm3_ch4_por_t_co2) / 365;
  const twh = (totCo2 * K.mwh_por_t_co2_metano) / 1e6;
  const twhF = (c.T.fermentacao * K.mwh_por_t_co2_metano) / 1e6;
  const gasDia = c.gas_sp_m3 / 366;
  const fontes = c.linhas.filter((l) => l.co2_fermentacao_t >= 100000);
  const mx = Math.max(...fontes.map((l) => l.co2_fermentacao_t));
  const raio = (t) => 22 * Math.sqrt(t / mx);
  const g1 = c.top_ferm[0];
  const r1 = regs[0];
  const fx = c.faixas_ferm;
  return () => ({
    layout: 'um',
    motivo: friso,
    serie: serie(4),
    titulo: () => L('O que o CO₂ poderia virar', 'What CO₂ could become'),
    subtitulo: () => L('Com hidrogênio verde, a cana renderia quase duas vezes o gás consumido no estado', 'With green hydrogen, the cane would yield almost twice the gas the state uses'),
    descricao: () => L(
      'e-metano possível por região intermediária com o CO₂ biogênico das dornas (safra 2025/26) e da purificação do biogás (potencial CP2B N4), por metanação com H₂ de eletrólise; as maiores dornas e os gasodutos; cálculo teórico, estimativa',
      'Possible e-methane by intermediate region from the biogenic CO₂ of the vats (2025/26 harvest) and of biogas upgrading (CP2B N4 potential), by methanation with electrolytic H₂; the largest vats and the gas pipelines; a theoretical calculation, an estimate'),
    mapa: () => ({
      preencher: pintar,
      bordaMunicipio: 0.25,
      bordaUnidadeCor: 'none',
      linhas: [
        { feats: c.desenho.distribuicao.features, cor: GAS_D, largura: 1.3, halo: 2 },
        { feats: c.desenho.transporte.features, cor: GAS_T, largura: 3, halo: 3 },
      ],
      pontos: fontes.map((l) => ({ coord: c.pontos[l.CD_MUN], r: Math.max(raio(l.co2_fermentacao_t), 3), cor: FERM, borda: PAPEL, opacidade: 0.9 })),
      chamadas: [
        {
          cd: g1.CD_MUN, dx: 150, dy: -170, tamanho: 16,
          titulo: L(`${titulo(g1.NM_MUN)} · ${nf(g1.km)} KM`, `${titulo(g1.NM_MUN)} · ${nf(g1.km)} KM`),
          linhas: L(['entre a maior dorna do estado', 'e o gasoduto mais próximo'], ['between the state’s largest vat', 'and the nearest gas pipeline']),
        },
      ],
    }),
    numeros: () => [
      [L(`${nf(emet / 1e6, 1)} mi m³`, `${nf(emet / 1e6, 1)} M m³`), [L('de e-metano por dia,', 'of e-methane a day,'), L(`${nf(emet / gasDia, 1)} vezes o gás de SP`, `${nf(emet / gasDia, 1)} times SP’s gas use`)]],
      [L(`${nf(twh)} TWh`, `${nf(twh)} TWh`), [L('de eletricidade por ano:', 'of electricity a year:'), L(`${nf(twh / c.eletricidade_sp_twh, 1)} vez o consumo do estado`, `${nf(twh / c.eletricidade_sp_twh, 1)} times the state’s use`)]],
      [L(`${nf(emetF / 1e6, 1)} mi m³`, `${nf(emetF / 1e6, 1)} M m³`), [L('por dia só com as dornas,', 'a day from the vats alone,'), L(`${pct((100 * emetF) / gasDia, 0)} do gás consumido`, `${nf((100 * emetF) / gasDia, 0)}% of gas consumed`)]],
      [pct((100 * fx[3].t) / c.T.fermentacao, 0), [L('do CO₂ das dornas fica a', 'of the vat CO₂ lies over'), L('mais de 50 km de um gasoduto', '50 km from a gas pipeline')]],
    ],
    painel: (y) => {
      const out = [rotuloPainel(L('A CONTA, POR TONELADA DE CO₂', 'THE SUM, PER TONNE OF CO₂'), y)];
      const linhas = L([
        `1 t CO₂ + ${nf(K.t_h2_por_t_co2_metano * 1000)} kg H₂ (${nf(K.mwh_por_t_co2_metano, 1)} MWh) → ${nf(K.t_ch4_por_t_co2 * 1000)} kg CH₄ = ${nf(K.nm3_ch4_por_t_co2)} m³`,
        `1 t CO₂ + ${nf(K.t_h2_por_t_co2_metanol * 1000)} kg H₂ (${nf(K.mwh_por_t_co2_metanol, 1)} MWh) → ${nf(K.t_metanol_por_t_co2 * 1000)} kg de metanol`,
      ], [
        `1 t CO₂ + ${nf(K.t_h2_por_t_co2_metano * 1000)} kg H₂ (${nf(K.mwh_por_t_co2_metano, 1)} MWh) → ${nf(K.t_ch4_por_t_co2 * 1000)} kg CH₄ = ${nf(K.nm3_ch4_por_t_co2)} m³`,
        `1 t CO₂ + ${nf(K.t_h2_por_t_co2_metanol * 1000)} kg H₂ (${nf(K.mwh_por_t_co2_metanol, 1)} MWh) → ${nf(K.t_metanol_por_t_co2 * 1000)} kg of methanol`,
      ]);
      linhas.forEach((t, i) => out.push(`<text x="0" y="${y + 26 + i * 22}" font-family="${MONO}" font-size="14">${esc(t)}</text>`));
      let yy = y + 80;
      out.push(rotuloPainel(L('E-METANO POSSÍVEL · MIL M³ POR DIA', 'POSSIBLE E-METHANE · THOUSAND M³ A DAY'), yy));
      yy += 12;
      const x0 = 250, larg = LP - x0 - 80;
      const mxR = regs[0].emetano_nm3_dia;
      for (const r of regs) {
        const a = (r.co2_fermentacao_t * K.nm3_ch4_por_t_co2) / 365, b = (r.co2_biogas_t * K.nm3_ch4_por_t_co2) / 365;
        // O quadrado à esquerda é a cor da região no mapa.
        out.push(`<rect x="0" y="${yy + 1}" width="22" height="13" fill="${CORES_REG[classe(r.emetano_nm3_dia, LIM_R)]}" stroke="${TINTA}" stroke-width=".5"/>`);
        out.push(`<text x="${x0 - 10}" y="${yy + 11}" text-anchor="end" font-family="${SERIF}" font-size="14">${esc(r.NM_RGINT)}</text>`);
        out.push(`<rect x="${x0}" y="${yy + 2}" width="${f1((a / mxR) * larg)}" height="11" fill="${FERM}"/><rect x="${f1(x0 + (a / mxR) * larg)}" y="${yy + 2}" width="${f1(Math.max((b / mxR) * larg, 1))}" height="11" fill="${BIOGAS}"/>`);
        out.push(`<text x="${f1(x0 + ((a + b) / mxR) * larg + 6)}" y="${yy + 11}" font-family="${MONO}" font-size="12">${nf((a + b) / 1000)}</text>`);
        yy += 15;
      }
      yy += 18;
      // Uma linha só de legenda: as duas parcelas da barra, os dois gasodutos e as dornas grandes.
      const leg = [
        `<rect x="0" y="${yy - 12}" width="14" height="11" fill="${FERM}"/><text x="20" y="${yy - 2}" font-family="${MONO}" font-size="12">${esc(L('dornas', 'vats'))}</text>`,
        `<rect x="88" y="${yy - 12}" width="14" height="11" fill="${BIOGAS}"/><text x="108" y="${yy - 2}" font-family="${MONO}" font-size="12">${esc(L('biogás', 'biogas'))}</text>`,
      ];
      const lg = legendaLinhas([[GAS_T, 3, L('gasoduto de transporte', 'transmission pipeline')]], yy + 24);
      const lg2 = legendaLinhas([[GAS_D, 1.3, L('gasoduto de distribuição', 'distribution pipeline')]], yy + 24);
      leg.push(lg.svg, `<g transform="translate(${LP / 2 + 10} 0)">${lg2.svg}</g>`);
      leg.push(`<circle cx="${LP / 2 + 19}" cy="${yy - 7}" r="8" fill="${FERM}" fill-opacity=".9" stroke="${PAPEL}"/><text x="${LP / 2 + 34}" y="${yy - 2}" font-family="${SERIF}" font-size="15">${esc(L('dornas de 100 mil t ou mais', 'vats of 100 kt or more'))}</text>`);
      out.push(leg.join('\n'));
      const n = nota(L(`Teórico (eletrólise a ${K.kwh_por_kg_h2} kWh/kg de H₂): a dorna só solta CO₂ na safra, e o H₂ verde pediria nova geração renovável; a outra saída é guardar o CO₂ no subsolo.`,
        `Theoretical (electrolysis at ${K.kwh_por_kg_h2} kWh/kg of H₂): vats release CO₂ only in the harvest, and green H₂ would need new renewable power; the other route is storing the CO₂ underground.`), lg.y + 6, { tamanho: 13 });
      out.push(n.svg);
      return { svg: out.join('\n'), y: n.y + 4 };
    },
    fontes: () => [
      L('ANP, Painel de Produtores de Etanol; CP2B v5.1', 'ANP, Ethanol Producers Panel; CP2B v5.1'),
      L('IRENA (2020); SEMIL, Anuário 2025', 'IRENA (2020); SEMIL, Yearbook 2025'),
      L('EPE, WebMap (via MapBiomas); IBGE, Malha 2025', 'EPE, WebMap (via MapBiomas); IBGE, Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { dornas, biogas, fossil, ptx };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/carbono-sp/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
const e = SERIE.find((s) => s.tema === nome);
const fazer = TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => fazer() });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `carbono-sp-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
