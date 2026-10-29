#!/usr/bin/env node
/**
 * Coleção «O funil do biometano» — desenha uma prancha a partir do cache de preparar.mjs (uso interno).
 *
 *   node scripts/colecoes/funil-sp/prancha.mjs funil|campo|caldeira|estrada|cenarios
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { RAIZ, LP, SERIF, MONO, TINTA, CINZA, PAPEL, esc, nf, f1, gerarPrancha, rotuloPainel, legendaFaixa } from '../lib/prancha-sp.mjs';
import { L, NEUTRO, ZERO, pct, barras, nota } from '../lib/painel.mjs';
import { legendaCirculos } from '../lib/arte.mjs';
import { CORES_RET, LIM_RET, CORES_COLETA, CORES_USOS, CORES_ESTRADA, LIM_ESTRADA, CORES_N4 } from './cores.mjs';
import { friso } from './friso.mjs';

const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'funil-sp', 'serie.json'), 'utf8'));
const c = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', 'funil-sp.json'), 'utf8'));
const por = new Map(c.linhas.map((l) => [l.CD_MUN, l]));
const porNome = (n) => c.linhas.find((l) => l.NM_MUN === n);
const T = c.T;
const R = c.cen.med;
const serie = (i) => () => L(`O FUNIL DO BIOMETANO · ${i}/5`, `THE BIOMETHANE FUNNEL · ${i}/5`);
const CP2B = () => L('CP2B (Unicamp), método v5.1, 2026', 'CP2B (Unicamp), method v5.1, 2026');
const MALHA = () => L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025');
const titulo = (s) => s.toUpperCase();

/** Bilhões de m³ com uma casa: "23,6 bi m³". */
const bi = (v, casas = 1) => L(`${nf(v / 1e9, casas)} bi m³`, `${nf(v / 1e9, casas)} bn m³`);
/** Milhões de m³: "118 mi m³". */
const mi = (v, casas = 0) => L(`${nf(v / 1e6, casas)} mi m³`, `${nf(v / 1e6, casas)} M m³`);
const classe = (v, lim) => { let i = 0; while (i < lim.length && v > lim[i] + 1e-9) i++; return i; };
const rotPct = (lim) => lim.map((v) => `${nf(v)}`);
const rotMi = (lim) => lim.slice(0, -1).map((v) => nf(v / 1e6));

/** O funil desenhado: quatro barras centradas, da largura de cada nível, com as perdas ao lado. */
function desenhoFunil(y, { destaque = null } = {}) {
  const s = [];
  const niveis = [
    ['N1', L('teórico', 'theoretical'), R.n1],
    ['N2', L('técnico', 'technical'), R.n2],
    ['N3', L('mobilizável', 'mobilisable'), R.n3],
    ['N4', L('acessível', 'accessible'), R.n4],
  ];
  const perdas = [
    ['campo', L('fica no campo', 'stays in the field'), R.n1 - R.n2],
    ['caldeira', L('já tem outro destino', 'already has a use'), R.n2 - R.n3],
    ['estrada', L('estocagem e estrada', 'storage and road'), R.n3 - R.n4],
  ];
  const xC = 290, wMax = 220, hB = 26, gap = 22;
  niveis.forEach(([n, nome, v], i) => {
    const yy = y + i * (hB + gap);
    const w = (v / R.n1) * wMax;
    s.push(`<rect x="${f1(xC - w / 2)}" y="${yy}" width="${f1(w)}" height="${hB}" fill="${CORES_RET[2 + Math.min(i, 3)] ?? CORES_RET[5]}"/>`);
    s.push(`<text x="0" y="${yy + 18}" font-family="${MONO}" font-size="15" letter-spacing="1">${esc(`${n} · ${nome}`)}</text>`);
    s.push(`<text x="${f1(xC + Math.max(w, 70) / 2 + 8)}" y="${yy + 18}" font-family="${MONO}" font-size="14">${esc(`${bi(v)} · ${pct((100 * v) / R.n1, 0)}`)}</text>`);
    if (i < 3) {
      const [k, rot, p] = perdas[i];
      const w2 = (niveis[i + 1][2] / R.n1) * wMax;
      // Trapézio entre um nível e o seguinte: o funil.
      s.push(`<path d="M${f1(xC - w / 2)} ${yy + hB}L${f1(xC - w2 / 2)} ${yy + hB + gap}H${f1(xC + w2 / 2)}L${f1(xC + w / 2)} ${yy + hB}Z" fill="#e9ecee"/>`);
      const forte = destaque === k;
      s.push(`<text x="${LP}" y="${yy + hB + gap / 2 + 5}" text-anchor="end" font-family="${SERIF}" font-style="italic" font-size="${forte ? 16 : 14}" fill="${forte ? TINTA : '#4f4a41'}"${forte ? ' font-weight="bold"' : ''}>${esc(`− ${bi(p)}: ${rot}`)}</text>`);
    }
  });
  return { svg: s.join('\n'), y: y + 4 * (hB + gap) - gap };
}

/* ------------------------------------------------------------------ 1/5 o funil */
function funil() {
  const pintar = (cd) => { const l = por.get(cd); if (!l || l.retencao_pct === null) return null; if (l.n4_m3 === 0) return ZERO; return CORES_RET[classe(l.retencao_pct, LIM_RET)]; };
  const gua = porNome('Guaíra'), bas = porNome('Bastos'), gub = porNome('Guariba'), cap = porNome('São Paulo');
  const nCl = new Array(6).fill(0);
  for (const l of c.linhas) if (l.n4_m3 > 0) nCl[classe(l.retencao_pct, LIM_RET)]++;
  return () => ({
    layout: 'um',
    motivo: friso,
    serie: serie(1),
    titulo: () => L('O funil do biometano', 'The biomethane funnel'),
    subtitulo: () => L('De cada quatro metros cúbicos teóricos, só um chega ao alcance de uma usina', 'Of every four theoretical cubic metres, only one comes within reach of a plant'),
    descricao: () => L(
      'Parte do potencial teórico de metano (N1) que sobra no potencial acessível (N4), por município, no cenário de referência do CP2B v5.1: o que resta depois da coleta, dos usos que já existem, da estocagem e da estrada; modelo, não medição',
      'Share of the theoretical methane potential (N1) left in the accessible potential (N4), by municipality, in the CP2B v5.1 reference scenario: what remains after collection, existing uses, storage and the road; a model, not a measurement'),
    mapa: () => ({
      preencher: pintar,
      bordaMunicipio: 0.4,
      chamadas: [
        {
          cd: gua.CD_MUN, dx: 150, dy: -170, tamanho: 16,
          titulo: L(`GUAÍRA · ${nf(gua.retencao_pct, 0)} %`, `GUAÍRA · ${nf(gua.retencao_pct, 0)}%`),
          linhas: L([`o maior potencial teórico, ${bi(gua.n1_m3, 2)},`, `fica em ${mi(gua.n4_m3)} acessíveis`], [`the largest theoretical potential, ${bi(gua.n1_m3, 2)},`, `shrinks to ${mi(gua.n4_m3)} within reach`]),
        },
        {
          cd: bas.CD_MUN, dx: -40, dy: 330, tamanho: 16,
          titulo: L(`BASTOS · ${nf(bas.retencao_pct, 0)} %`, `BASTOS · ${nf(bas.retencao_pct, 0)}%`),
          linhas: L(['a cama e o esterco das granjas', 'se recolhem quase inteiros'], ['poultry litter and manure', 'are collected almost whole']),
        },
        {
          cd: gub.CD_MUN, dx: 330, dy: -40, tamanho: 16,
          titulo: L(`GUARIBA · ${nf(gub.retencao_pct, 0)} %`, `GUARIBA · ${nf(gub.retencao_pct, 0)}%`),
          linhas: L(['os resíduos da cana já alimentam', 'um biodigestor e saem da conta'], ['cane residues already feed', 'a digester, so they drop out']),
        },
      ],
    }),
    numeros: () => [
      [bi(R.n1), [L('de metano por ano: o teórico', 'of methane a year: the theoretical'), L('de todos os resíduos (N1)', 'from all residues (N1)')]],
      [bi(R.n4), [L('acessíveis (N4): ', 'accessible (N4): ') + pct((100 * R.n4) / R.n1, 0), L('do teórico', 'of the theoretical')]],
      [L(`${nf(T.n4_biometano_m3_dia / 1e6, 1)} mi m³`, `${nf(T.n4_biometano_m3_dia / 1e6, 1)} M m³`), [L('de biometano por dia,', 'of biomethane a day,'), L('o que o N4 daria', 'what N4 would yield')]],
      [pct(c.ret_quantis.p50, 0), [L('a retenção no município', 'retention in the median'), L(`mediano; ${nf(c.n_sem_n4)} ficam sem nada`, `municipality; ${nf(c.n_sem_n4)} are left with none`)]],
    ],
    painel: (y) => {
      const out = [rotuloPainel(L('O FUNIL · M³ DE METANO POR ANO', 'THE FUNNEL · M³ OF METHANE A YEAR'), y)];
      const d = desenhoFunil(y + 22);
      out.push(d.svg);
      let yy = d.y + 38;
      out.push(rotuloPainel(L('PARTE DO TEÓRICO QUE CHEGA AO N4, %', 'SHARE OF THE THEORETICAL REACHING N4, %'), yy));
      out.push(legendaFaixa(CORES_RET, rotPct(LIM_RET), { y: yy + 18, larg: 62, semInfo: false, id: 'lfr' }));
      yy += 74;
      const n = nota(L(`A retenção vai de zero a ${nf(c.top_ret[0].v, 0)} % (Bastos). Os ${nf(c.n_sem_n4)} municípios sem nada no N4 ficam no Vale do Ribeira e no fundo do Vale do Paraíba, onde o resíduo é quase todo esterco de gado no pasto. Por região, de ${nf(c.regioes[c.regioes.length - 1].retencao_pct, 0)} % (São José dos Campos) a ${nf(c.regioes[0].retencao_pct, 0)} % (${c.regioes[0].NM_RGINT}).`,
        `Retention runs from zero to ${nf(c.top_ret[0].v, 0)}% (Bastos). The ${nf(c.n_sem_n4)} municipalities with nothing at N4 lie in the Ribeira Valley and the upper Paraíba Valley, where the residue is almost all grazing-cattle manure. By region, from ${nf(c.regioes[c.regioes.length - 1].retencao_pct, 0)}% (São José dos Campos) to ${nf(c.regioes[0].retencao_pct, 0)}% (${c.regioes[0].NM_RGINT}).`), yy, { tamanho: 14 });
      out.push(n.svg);
      return { svg: out.join('\n'), y: n.y + 4 };
    },
    fontes: () => [CP2B(), L('CP2B, níveis N1 a N4 por município e resíduo', 'CP2B, levels N1 to N4 by municipality and residue'), MALHA()],
  });
}

/* ------------------------------------------------------------------ 2/5 o que fica no campo */
function campo() {
  const mun = c.linhas.filter((l) => l.perda_coleta_m3 > 0);
  const max = Math.max(...mun.map((l) => l.perda_coleta_m3));
  const raio = (v) => 26 * Math.sqrt(v / max);
  const t1 = c.top_coleta[0];
  const pb = porNome('Presidente Bernardes');
  const CAUSAS = () => [
    ['palha_cana', L('palha de cana deixada no solo', 'cane straw left on the soil'), T.coleta_palha_cana],
    ['esterco_pasto', L('esterco do gado no pasto', 'manure from grazing cattle'), T.coleta_esterco_pasto],
    ['palha_graos', L('palha de soja e de milho', 'soy and maize straw'), T.coleta_palha_graos],
    ['outros', L('outros resíduos', 'other residues'), T.coleta_outros],
  ];
  return () => ({
    layout: 'um',
    motivo: friso,
    serie: serie(2),
    titulo: () => L('O que fica no campo', 'What stays in the field'),
    subtitulo: () => L('A palha protege o solo e o esterco do pasto não se recolhe: um terço do teórico nunca sai da terra', 'Straw protects the soil and pasture manure cannot be gathered: a third of the theoretical never leaves the land'),
    descricao: () => L(
      'Metano que o resíduo daria mas que não se pode recolher, por município (N1 − N2, m³ por ano, cenário de referência do CP2B v5.1); o círculo tem a área da perda e a cor da maior causa; modelo',
      'Methane the residue could yield but that cannot be collected, by municipality (N1 − N2, m³ a year, CP2B v5.1 reference scenario); the circle’s area is the loss and its colour the largest cause; a model'),
    mapa: () => ({
      preencher: () => NEUTRO,
      bordaMunicipio: 0.4,
      pontos: mun.map((l) => ({ coord: c.pontos[l.CD_MUN], r: Math.max(raio(l.perda_coleta_m3), 1.6), cor: CORES_COLETA[l.causa_coleta], borda: PAPEL, bordaLargura: 0.8, opacidade: 0.85 })),
      chamadas: [
        {
          cd: t1.CD_MUN, dx: 150, dy: -170, tamanho: 16,
          titulo: L(`${titulo(t1.NM_MUN)} · ${mi(t1.v)}`, `${titulo(t1.NM_MUN)} · ${mi(t1.v)}`),
          linhas: L(['ficam no canavial como palha:', 'a maior perda na coleta'], ['stay in the canefield as straw:', 'the largest collection loss']),
        },
        {
          cd: pb.CD_MUN, dx: -60, dy: 250, tamanho: 16,
          titulo: L(`PRESIDENTE BERNARDES · ${mi(pb.coleta_esterco_pasto_m3)}`, `PRESIDENTE BERNARDES · ${mi(pb.coleta_esterco_pasto_m3)}`),
          linhas: L(['de esterco espalhado no pasto,', 'o maior do estado'], ['of manure spread over pasture,', 'the most in the state']),
        },
      ],
    }),
    numeros: () => [
      [bi(T.coleta), [L('de metano por ano ficam', 'of methane a year stay'), L(`no campo: ${pct((100 * T.coleta) / R.n1, 0)} do teórico`, `in the field: ${pct((100 * T.coleta) / R.n1, 0)} of the theoretical`)]],
      [bi(T.coleta_palha_cana), [L('na palha da cana: 60 % dela', 'in cane straw: 60% of it'), L('fica para cobrir o solo', 'stays to cover the soil')]],
      [bi(T.coleta_esterco_pasto, 2), [L('no esterco do gado de pasto:', 'in grazing cattle manure:'), L('nada se recolhe', 'none can be gathered')]],
      [pct(100 * (1 - c.substratos.find((s) => s.substrato === 'BOV_LEITE').n4_m3 / c.substratos.find((s) => s.substrato === 'BOV_LEITE').n1_m3), 0), [L('do esterco das vacas de leite', 'of dairy cow manure'), L('se perde até o N4', 'is lost before N4')]],
    ],
    painel: (y) => {
      const out = [rotuloPainel(L('A MAIOR CAUSA, POR MUNICÍPIO', 'THE LARGEST CAUSE, BY MUNICIPALITY'), y)];
      const nCausa = {};
      for (const l of mun) nCausa[l.causa_coleta] = (nCausa[l.causa_coleta] ?? 0) + 1;
      const b = barras(CAUSAS().map(([k, rot, v]) => [rot, v, CORES_COLETA[k], `${bi(v, 2)} · ${nf(nCausa[k] ?? 0)} mun.`]), y + 14, { max: T.coleta_palha_cana * 1.5, x0: 250, passo: 21 });
      out.push(b.svg);
      let yy = b.y + 30;
      out.push(rotuloPainel(L('METANO QUE FICA NO CAMPO', 'METHANE LEFT IN THE FIELD'), yy));
      const lc = legendaCirculos([1e8, 2e7], raio, (v) => mi(v), { y: yy + 18, cor: '#6d7165' });
      out.push(lc.svg);
      yy += 18 + lc.altura + 22;
      const n = nota(L('Deixar palha no chão não é desperdício: ela segura a erosão, guarda umidade e devolve carbono ao solo. O CP2B recolhe 40 % da palha da cana, 30 % da de soja, 40 % da de milho e nada do esterco de pasto, só o de curral.',
        'Leaving straw on the ground is not waste: it holds back erosion, keeps moisture in and returns carbon to the soil. CP2B collects 40% of cane straw, 30% of soy and 40% of maize straw, and no pasture manure, only that from pens.'), yy, { tamanho: 14 });
      out.push(n.svg);
      return { svg: out.join('\n'), y: n.y + 4 };
    },
    fontes: () => [CP2B(), L('CP2B, fator de coleta (FC) por resíduo', 'CP2B, collection factor (FC) by residue'), MALHA()],
  });
}

/* ------------------------------------------------------------------ 3/5 o bagaço vai para a caldeira */
function caldeira() {
  const lim = c.lim_usos;
  const pintar = (cd) => { const v = por.get(cd)?.perda_usos_m3; if (v === undefined) return null; if (v === 0) return ZERO; return CORES_USOS[classe(v, lim.slice(0, -1))]; };
  const ex = c.linhas.filter((l) => l.ja_em_uso_m3 >= 2e6);
  const mxEx = Math.max(...ex.map((l) => l.ja_em_uso_m3));
  const raio = (v) => 26 * Math.sqrt(v / mxEx);
  const t1 = c.top_usos[0];
  const cap = porNome('São Paulo'), gub = porNome('Guariba');
  const bag = c.substratos.find((s) => s.substrato === 'BAGACO');
  const DEST = () => [
    [L('bagaço: caldeira e cogeração', 'bagasse: boilers, cogeneration'), T.usos_bagaco, CORES_USOS[5]],
    [L('palha, grãos, aves e poda', 'straw, grain, poultry, pruning'), T.usos_outros, CORES_USOS[3]],
    [L('bagaço de laranja: ração', 'orange pulp: animal feed'), T.usos_citros, CORES_USOS[2]],
    [L('casca de café: secadores', 'coffee husks: dryers'), T.usos_cafe, CORES_USOS[1]],
    [L('já vira biogás hoje', 'already becomes biogas'), T.ja_em_uso, '#2a788e'],
  ];
  return () => ({
    layout: 'um',
    motivo: friso,
    serie: serie(3),
    titulo: () => L('O bagaço vai para a caldeira', 'The bagasse goes to the boiler'),
    subtitulo: () => L('Nove décimos do bagaço já viram vapor e eletricidade nas usinas; para o biodigestor sobra o excedente', 'Nine tenths of the bagasse already becomes steam and power at the mills; the digester gets the surplus'),
    descricao: () => L(
      'Metano que o resíduo recolhido daria mas que já tem outro destino, por município (N2 − N3, m³ por ano, cenário de referência do CP2B v5.1): sobretudo o bagaço queimado nas caldeiras das usinas; os círculos são o que já vira biogás hoje; modelo',
      'Methane the collected residue could yield but that already has another use, by municipality (N2 − N3, m³ a year, CP2B v5.1 reference scenario): above all bagasse burnt in the mills’ boilers; circles show what already becomes biogas; a model'),
    mapa: () => ({
      preencher: pintar,
      bordaMunicipio: 0.4,
      pontos: ex.map((l) => ({ coord: c.pontos[l.CD_MUN], r: Math.max(raio(l.ja_em_uso_m3), 4), cor: '#2a788e', anel: true, largura: 2.4 })),
      chamadas: [
        {
          cd: t1.CD_MUN, dx: 150, dy: -170, tamanho: 16,
          titulo: L(`${titulo(t1.NM_MUN)} · ${mi(t1.v)}`, `${titulo(t1.NM_MUN)} · ${mi(t1.v)}`),
          linhas: L(['de metano que o bagaço daria', 'e que vai para a caldeira'], ['of methane the bagasse could give', 'that goes to the boiler instead']),
        },
        {
          cd: cap.CD_MUN, dx: 160, dy: 200, tamanho: 16,
          titulo: L(`SÃO PAULO · ${mi(cap.ja_em_uso_m3)}`, `SÃO PAULO · ${mi(cap.ja_em_uso_m3)}`),
          linhas: L(['de metano do lixo que já', 'é captado e sai da conta'], ['of methane from waste already', 'captured, so it drops out']),
        },
        {
          cd: gub.CD_MUN, dx: 330, dy: -40, tamanho: 16,
          titulo: L(`GUARIBA · ${mi(gub.ja_em_uso_m3)}`, `GUARIBA · ${mi(gub.ja_em_uso_m3)}`),
          linhas: L(['de vinhaça, torta, bagaço e', 'palha que já viram biogás'], ['of vinasse, filter cake, bagasse', 'and straw already turned to biogas']),
        },
      ],
    }),
    numeros: () => [
      [bi(T.usos + T.ja_em_uso), [L('de metano por ano já têm', 'of methane a year already'), L(`outro destino: ${pct((100 * (T.usos + T.ja_em_uso)) / R.n1, 0)} do teórico`, `have a use: ${pct((100 * (T.usos + T.ja_em_uso)) / R.n1, 0)} of the theoretical`)]],
      [bi(T.usos_bagaco), [L('no bagaço: só 10 % dele', 'in bagasse: only 10% of it'), L('sobra para o biodigestor', 'is left for a digester')]],
      [pct((100 * bag.n4_m3) / bag.n1_m3, 0), [L('do metano teórico do bagaço', 'of bagasse’s theoretical methane'), L('chega ao N4', 'reaches N4')]],
      [mi(T.ja_em_uso), [L('já viram biogás: ', 'already become biogas: ') + pct((100 * T.ja_em_uso_rsu) / T.ja_em_uso, 0), L('vem do lixo', 'from urban waste')]],
    ],
    painel: (y) => {
      const out = [rotuloPainel(L('METANO COM OUTRO DESTINO · M³ POR ANO', 'METHANE WITH ANOTHER USE · M³ A YEAR'), y)];
      out.push(legendaFaixa(CORES_USOS, L(rotMi(lim).map((v) => `${v} mi`), rotMi(lim).map((v) => `${v}M`)), { y: y + 18, larg: 62, semInfo: false, id: 'lfu' }));
      let yy = y + 82;
      out.push(rotuloPainel(L('PARA ONDE VAI', 'WHERE IT GOES'), yy));
      const b = barras(DEST().map(([rot, v, cor]) => [rot, v, cor, `${bi(v, 2)} · ${pct((100 * v) / (T.usos + T.ja_em_uso), 0)}`]), yy + 14, { max: T.usos_bagaco * 1.5, x0: 260, passo: 21 });
      out.push(b.svg);
      yy = b.y + 20;
      const lc = legendaCirculos([7e7, 1e7], raio, (v) => L(`${mi(v)} já em biogás`, `${mi(v)} already biogas`), { y: yy, cor: '#2a788e' });
      out.push(lc.svg);
      yy += lc.altura + 22;
      const n = nota(L('Queimar bagaço para gerar vapor e eletricidade é o uso estabelecido das usinas, e o CP2B o respeita: só o excedente, de 5 % a 15 % do bagaço, entra na conta. O que já vira biogás (aterros, ETEs, usinas) também sai, para não contar duas vezes.',
        'Burning bagasse for steam and power is the mills’ settled use, and CP2B respects it: only the surplus, 5% to 15% of the bagasse, is counted. What already becomes biogas (landfills, sewage works, mills) also drops out, so it is not counted twice.'), yy, { tamanho: 14 });
      out.push(n.svg);
      return { svg: out.join('\n'), y: n.y + 4 };
    },
    fontes: () => [CP2B(), L('CP2B, fração disponível (FCo); ANEEL, SIGA', 'CP2B, available fraction (FCo); ANEEL, SIGA'), MALHA()],
  });
}

/* ------------------------------------------------------------------ 4/5 a estrada cobra */
function estrada() {
  const pintar = (cd) => { const v = por.get(cd)?.perda_estrada_pct; if (v === null || v === undefined) return null; return CORES_ESTRADA[classe(v, LIM_ESTRADA)]; };
  const anh = porNome('Anhembi'), epi = porNome('Presidente Epitácio'), cap = porNome('São Paulo');
  const sub = (k) => c.substratos.find((s) => s.substrato === k);
  const perdaN3 = (k) => { const s = sub(k); return s.n3_m3 > 0 ? 100 * (1 - s.n4_m3 / s.n3_m3) : 0; };
  const RES = () => [
    ['BOV_LEITE', L('esterco de vaca de leite', 'dairy cow manure')],
    ['SUINOS', L('dejetos de suínos', 'pig slurry')],
    ['PALHA_SOJA', L('palha de soja', 'soy straw')],
    ['PALHA', L('palha de cana', 'cane straw')],
    ['LODO_ETE', L('lodo de esgoto', 'sewage sludge')],
    ['TORTA_FILTRO', L('torta de filtro', 'filter cake')],
    ['VINHACA', L('vinhaça', 'vinasse')],
    ['RSU_ORGANICO', L('lixo orgânico', 'organic waste')],
  ];
  const nAlto = c.linhas.filter((l) => l.perda_estrada_pct > 50).length;
  return () => ({
    layout: 'um',
    motivo: friso,
    serie: serie(4),
    titulo: () => L('A estrada cobra', 'The road takes its toll'),
    subtitulo: () => L('Longe de onde uma usina faria sentido, o resíduo disponível fica pelo caminho', 'Far from where a plant would make sense, the available residue is lost along the way'),
    descricao: () => L(
      'Parte do potencial mobilizável (N3) que se perde até o acessível (N4), por município, no cenário de referência do CP2B v5.1: perdas na estocagem (FS) e o fator logístico calculado na malha viária (FL); modelo',
      'Share of the mobilisable potential (N3) lost before the accessible (N4), by municipality, in the CP2B v5.1 reference scenario: storage losses (FS) and the logistic factor computed on the road network (FL); a model'),
    mapa: () => ({
      preencher: pintar,
      bordaMunicipio: 0.4,
      chamadas: [
        {
          cd: epi.CD_MUN, dx: 120, dy: 260, tamanho: 16,
          titulo: L(`PRESIDENTE EPITÁCIO · ${nf(epi.perda_estrada_pct, 0)} %`, `PRESIDENTE EPITÁCIO · ${nf(epi.perda_estrada_pct, 0)}%`),
          linhas: L(['no extremo oeste, até a palha', 'de cana fica fora do raio de uma usina'], ['in the far west, even cane straw', 'lies outside any plant’s radius']),
        },
        {
          cd: anh.CD_MUN, dx: -250, dy: 250, tamanho: 16,
          titulo: L(`ANHEMBI · ${nf(anh.perda_estrada_pct, 0)} %`, `ANHEMBI · ${nf(anh.perda_estrada_pct, 0)}%`),
          linhas: L(['a palha de cana sobra, mas', 'longe de onde se juntaria'], ['the cane straw is there, but', 'far from where it would gather']),
        },
        {
          cd: cap.CD_MUN, dx: 160, dy: 190, tamanho: 16,
          titulo: L(`SÃO PAULO · ${nf(cap.perda_estrada_pct, 1)} %`, `SÃO PAULO · ${nf(cap.perda_estrada_pct, 1)}%`),
          linhas: L(['o lixo já chega concentrado', 'no aterro e na estação'], ['waste already arrives gathered', 'at the landfill and the works']),
        },
      ],
    }),
    numeros: () => [
      [bi(T.estrada), [L('de metano por ano se perdem', 'of methane a year are lost'), L(`do N3 ao N4: ${pct((100 * T.estrada) / R.n3, 0)}`, `from N3 to N4: ${pct((100 * T.estrada) / R.n3, 0)}`)]],
      [pct(perdaN3('BOV_LEITE'), 0), [L('do esterco de leite', 'of dairy manure'), L('não chega a uma usina', 'never reaches a plant')]],
      [pct(perdaN3('RSU_ORGANICO'), 0), [L('do lixo orgânico, que', 'of organic waste, which'), L('já anda concentrado', 'already travels gathered')]],
      [nf(nAlto), [L('municípios perdem mais da', 'municipalities lose over'), L('metade do N3 na estrada', 'half their N3 on the road')]],
    ],
    painel: (y) => {
      const out = [rotuloPainel(L('PARTE DO N3 PERDIDA ATÉ O N4, %', 'SHARE OF N3 LOST BEFORE N4, %'), y)];
      out.push(legendaFaixa(CORES_ESTRADA, rotPct(LIM_ESTRADA), { y: y + 18, larg: 62, semInfo: false, id: 'lfe' }));
      let yy = y + 82;
      out.push(rotuloPainel(L('PERDA NA ESTOCAGEM E NA ESTRADA, POR RESÍDUO', 'STORAGE AND ROAD LOSS, BY RESIDUE'), yy));
      const b = barras(RES().map(([k, rot]) => [rot, perdaN3(k), CORES_ESTRADA[classe(perdaN3(k), LIM_ESTRADA)], pct(perdaN3(k), 0)]), yy + 14, { max: 100, x0: 250, passo: 20 });
      out.push(b.svg);
      yy = b.y + 22;
      const n = nota(L('O fator logístico do CP2B mede, na malha viária, quanto do resíduo de cada município cabe no raio econômico de uma usina de codigestão. O esterco de leite pesa pouco por vaca e vem espalhado em muitos sítios; o lixo e a vinhaça já chegam juntos. No Vale do Ribeira e no fundo do Vale do Paraíba, o pouco que há fica todo fora do raio.',
        'CP2B’s logistic factor measures, on the road network, how much of each municipality’s residue fits within the economic radius of a co-digestion plant. Dairy manure is light per cow and scattered over many smallholdings; waste and vinasse already arrive together. In the Ribeira Valley and the upper Paraíba Valley, the little there is lies wholly outside the radius.'), yy, { tamanho: 14 });
      out.push(n.svg);
      return { svg: out.join('\n'), y: n.y + 4 };
    },
    fontes: () => [CP2B(), L('CP2B, fatores de estocagem (FS) e logístico (FL)', 'CP2B, storage (FS) and logistic (FL) factors'), MALHA()],
  });
}

/* ------------------------------------------------------------------ 5/5 entre o mínimo e o máximo */
function cenarios() {
  const lim = c.lim_n4;
  const limI = lim.slice(0, -1);
  const pintar = (k) => (cd) => { const v = por.get(cd)?.[k]; if (v === undefined) return null; if (v === 0) return ZERO; return CORES_N4[classe(v, limI)]; };
  const C = c.cen;
  const leg = () => legendaFaixa(CORES_N4, L(rotMi(lim), rotMi(lim)), { larg: 48, semInfo: false, id: `lfc${Math.random().toString(36).slice(2, 7)}`, titulo: L('N4 · MILHÕES DE M³ POR ANO', 'N4 · MILLION M³ A YEAR') });
  const G = () => ({ cana: L('resíduos da cana', 'sugarcane residues'), lavouras: L('outras lavouras', 'other crops'), pecuaria: L('pecuária', 'livestock'), urbano: L('lixo, poda e esgoto', 'waste, pruning, sewage') });
  return () => ({
    layout: 'quatro',
    motivo: friso,
    serie: serie(5),
    titulo: () => L('Entre o mínimo e o máximo', 'Between the lowest and the highest'),
    subtitulo: () => L('O mesmo estado, os mesmos resíduos: trocar as hipóteses multiplica o potencial por oito', 'The same state, the same residues: changing the assumptions multiplies the potential by eight'),
    descricao: () => L(
      'Potencial acessível de metano (N4) por município nos três cenários do CP2B v5.1, com as mesmas classes nos três mapas: no mínimo, cada fator do método no fim baixo da faixa da literatura; no máximo, no alto; modelo',
      'Accessible methane potential (N4) by municipality in the three CP2B v5.1 scenarios, with the same classes in all three maps: in the lowest, each factor of the method at the low end of its literature range; in the highest, at the top; a model'),
    mapas: () => [
      { titulo: L(`MÍNIMO · ${bi(C.min.n4)}`, `LOWEST · ${bi(C.min.n4)}`), preencher: pintar('n4_min_m3'), legenda: leg() },
      { titulo: L(`REFERÊNCIA · ${bi(C.med.n4)}`, `REFERENCE · ${bi(C.med.n4)}`), preencher: pintar('n4_m3'), legenda: leg() },
      { titulo: L(`MÁXIMO · ${bi(C.max.n4)}`, `HIGHEST · ${bi(C.max.n4)}`), preencher: pintar('n4_max_m3'), legenda: leg() },
    ],
    quartoQuadro: (w) => {
      const s = [rotuloPainel(L('N4 POR GRUPO · BI M³ POR ANO', 'N4 BY GROUP · BN M³ A YEAR'), 0)];
      const x0 = 230, larg = w - x0 - 210;
      const mx = Math.max(...c.grupos.map((g) => g.max));
      c.grupos.forEach((g, i) => {
        const yy = 30 + i * 46;
        const px = (v) => x0 + (v / mx) * larg;
        s.push(`<text x="${x0 - 12}" y="${yy + 12}" text-anchor="end" font-family="${SERIF}" font-size="17">${esc(G()[g.g])}</text>`);
        s.push(`<path d="M${f1(px(g.min))} ${yy + 7}H${f1(px(g.max))}" stroke="${CORES_N4[4]}" stroke-width="10" stroke-opacity=".35"/>`);
        s.push(`<path d="M${f1(px(g.med))} ${yy - 2}v18" stroke="${TINTA}" stroke-width="2.4"/>`);
        s.push(`<text x="${f1(px(g.max) + 8)}" y="${yy + 12}" font-family="${MONO}" font-size="13">${esc(`${nf(g.min / 1e9, 2)} · ${nf(g.med / 1e9, 2)} · ${nf(g.max / 1e9, 2)}`)}</text>`);
      });
      const yN = 30 + 4 * 46 + 6;
      s.push(`<text x="0" y="${yN}" font-family="${MONO}" font-size="12" fill="${CINZA}">${esc(L('faixa: mínimo a máximo · traço: referência', 'band: lowest to highest · tick: reference'))}</text>`);
      const n = nota(L(`A faixa é mais larga fora da cana: na pecuária, o máximo é ${nf(c.grupos[2].max / c.grupos[2].min, 0)} vezes o mínimo, porque o esterco que se recolhe e o raio da usina variam muito; na cana, ${nf(c.grupos[0].max / c.grupos[0].min, 1)} vezes.`,
        `The band is wider outside sugarcane: in livestock the highest is ${nf(c.grupos[2].max / c.grupos[2].min, 0)} times the lowest, because the manure that can be gathered and the plant radius vary widely; in cane, ${nf(c.grupos[0].max / c.grupos[0].min, 1)} times.`), yN + 34, { tamanho: 15, max: w });
      s.push(n.svg);
      return s.join('\n');
    },
    numeros: () => [
      [L(`${nf(C.min.n4 / 1e9, 1)} a ${nf(C.max.n4 / 1e9, 1)} bi`, `${nf(C.min.n4 / 1e9, 1)} to ${nf(C.max.n4 / 1e9, 1)} bn`), [L('de m³ de metano por ano', 'm³ of methane a year'), L('acessíveis (N4)', 'within reach (N4)')]],
      [L(`${nf(C.max.n4 / C.min.n4, 1)} vezes`, `${nf(C.max.n4 / C.min.n4, 1)} times`), [L('o máximo sobre o mínimo;', 'the highest over the lowest;'), L(`no teórico, ${nf(C.max.n1 / C.min.n1, 1)} vezes`, `for the theoretical, ${nf(C.max.n1 / C.min.n1, 1)} times`)]],
      [bi(C.med.n4), [L('no cenário de referência,', 'in the reference scenario,'), L('o usado nas outras pranchas', 'the one used on other plates')]],
      [L(`${nf(c.faixa_quantis.p50, 1)} vezes`, `${nf(c.faixa_quantis.p50, 1)} times`), [L('a largura da faixa no município', 'the band’s width in the median'), L('mediano, sobre a referência', 'municipality, over the reference')]],
    ],
    painel: (y) => {
      const out = [rotuloPainel(L('OS TRÊS FUNIS · BI M³ POR ANO', 'THE THREE FUNNELS · BN M³ A YEAR'), y)];
      const cols = [['N1', 'n1'], ['N2', 'n2'], ['N3', 'n3'], ['N4', 'n4']];
      const x0 = 190, passo = (LP - x0) / 4;
      cols.forEach(([n], j) => out.push(`<text x="${f1(x0 + j * passo + passo - 12)}" y="${y + 30}" text-anchor="end" font-family="${MONO}" font-size="14" fill="${CINZA}">${n}</text>`));
      [['min', L('mínimo', 'lowest')], ['med', L('referência', 'reference')], ['max', L('máximo', 'highest')]].forEach(([k, rot], i) => {
        const yy = y + 56 + i * 24;
        out.push(`<text x="0" y="${yy}" font-family="${SERIF}" font-size="16">${esc(rot)}</text>`);
        cols.forEach(([, f], j) => out.push(`<text x="${f1(x0 + j * passo + passo - 12)}" y="${yy}" text-anchor="end" font-family="${MONO}" font-size="15"${f === 'n4' ? ' font-weight="bold"' : ''}>${nf(C[k][f] / 1e9, 1)}</text>`));
      });
      const n = nota(L('Cada fator do método (geração de resíduo, sólidos, BMP, coleta, usos concorrentes, estocagem, logística) tem uma faixa na literatura; os cenários levam todos ao mesmo tempo ao fim baixo ou ao alto, por isso são extremos, não intervalos de confiança.',
        'Each factor of the method (residue generation, solids, BMP, collection, competing uses, storage, logistics) has a range in the literature; the scenarios push them all at once to the low or the high end, so they are extremes, not confidence intervals.'), y + 56 + 3 * 24 + 14, { tamanho: 14 });
      out.push(n.svg);
      return { svg: out.join('\n'), y: n.y + 4 };
    },
    fontes: () => [CP2B(), L('CP2B, parâmetros mín., ref. e máx. por resíduo', 'CP2B, low, reference and high parameters by residue'), MALHA()],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { funil, campo, caldeira, estrada, cenarios };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/funil-sp/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
const e = SERIE.find((s) => s.tema === nome);
const fazer = TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => fazer() });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `funil-sp-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
