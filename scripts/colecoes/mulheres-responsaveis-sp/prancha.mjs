#!/usr/bin/env node
/**
 * Coleção «Mulheres responsáveis pelo domicílio» — desenha uma prancha a partir do cache de preparar.mjs (uso interno).
 * Uma prancha, um mapa: nada de painéis secundários.
 *
 *   node scripts/colecoes/mulheres-responsaveis-sp/prancha.mjs distribuicao|crescimento|conjuge|esgoto|agua|iluminacao|renda|sintese
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { RAIZ, LP, SERIF, MONO, TINTA, CINZA, esc, nf, gerarPrancha, rotuloPainel } from '../lib/prancha-sp.mjs';
import { L, NEUTRO, HACHURA, barras, caixaLegenda, nota, fita } from '../lib/painel.mjs';
import { LILAS, OCRE, LIM_F, LIM_VAR, COR_VAR, COR_QUEDA, LIM_CONJ, LIM_DIF, COR_DIF, LIM_LUZ, COR_LUZ, BIV, classe } from './preparar.mjs';

const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'mulheres-responsaveis-sp', 'serie.json'), 'utf8'));
const C = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', 'mulheres-responsaveis-sp.json'), 'utf8'));
const POR = new Map(C.mun.map((m) => [m.CD_MUN, m]));
const ORDEM = Object.fromEntries(SERIE.map((s, i) => [s.tema, i + 1]));
const serie = (t) => () => L(`MULHERES RESPONSÁVEIS · ${ORDEM[t]}/${SERIE.length}`, `WOMEN HEADING HOUSEHOLDS · ${ORDEM[t]}/${SERIE.length}`);
const E = C.est;
const T = (nivel, x, y) => C.testes[`${nivel}|${x}|${y}`];
const R = C.resumo;

/** Decimal com o sinal de menos tipográfico. */
const dec = (v, c = 2) => nf(v, c).replace('-', '−');
const sinal = (v, c = 1) => (v > 0 ? '+' : '') + dec(v, c);
const pc = (v, c = 1) => L(`${nf(v, c)} %`, `${nf(v, c)}%`);
const pp = (v, c = 1) => L(`${sinal(v, c)} p.p.`, `${sinal(v, c)} pp`);
const mun = (nome) => C.mun.find((m) => m.NM_MUN === nome);
const milhoes = (v) => L(`${nf(v / 1e6, 2)} milhões`, `${nf(v / 1e6, 2)} million`);
const mil = (v) => L(`${nf(Math.round(v / 1e3))} mil`, `${nf(Math.round(v / 1e3))} thousand`);
const pTxt = (p) => (p < 0.001 ? L('< 0,001', '< 0.001') : nf(p, 3));

const FONTE_MALHA = () => L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025');
const FONTE_SETORES = () => L('IBGE, Censo 2022: setores (domicílio, parte 2; renda)', 'IBGE, 2022 Census: tracts (households, part 2; income)');

const chamada = (m, dx, dy, titulo, linhas, tamanho = 16) => ({ cd: m.CD_MUN, dx, dy, tamanho, titulo, linhas });
const ECOLOGICA = () => L(
  'Leitura ecológica: o mapa compara lugares, não pessoas, e correlação não diz o que causa o quê.',
  'Ecological reading: the map compares places, not people, and correlation does not say what causes what.');
const RESPONSAVEL = () => L(
  'Responsável é a pessoa que os moradores apontam como tal ao recenseador; não quer dizer quem sustenta a casa, nem mãe sozinha.',
  'The person responsible is whoever the residents name as such to the enumerator; it does not mean the breadwinner, nor a lone mother.');

/** Linhas de rótulo e valor (valor alinhado à direita). */
function quadro(linhas, y, { titulo, passo = 19 } = {}) {
  const s = [];
  if (titulo) { s.push(rotuloPainel(titulo, y)); y += 24; }
  for (const [rot, v, destaque] of linhas) {
    s.push(`<text x="0" y="${y}" font-family="${SERIF}" font-size="15"${destaque ? ' font-weight="bold"' : ''}>${esc(rot)}</text>`);
    s.push(`<text x="${LP}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="13.5">${esc(v)}</text>`);
    s.push(`<path d="M0 ${y + 6}H${LP}" stroke="#d9dcde" stroke-width=".6"/>`);
    y += passo;
  }
  return { svg: s.join('\n'), y };
}

/** Legenda em coluna, com a contagem de unidades à direita: [[cor | 'hachura', rótulo, n]]. */
function legenda(itens, y, { titulo, unidade }) {
  const s = [rotuloPainel(titulo, y)];
  y += 26;
  for (const [cor, rot, n] of itens) {
    s.push(cor === 'hachura' ? caixaLegenda(null, rot, y, { hachura: true }) : `<rect x="0" y="${y - 14}" width="30" height="17" fill="${cor}" stroke="#1a211a" stroke-width=".6"/><text x="42" y="${y}" font-family="${SERIF}" font-size="16">${esc(rot)}</text>`);
    if (n != null) s.push(`<text x="${LP}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="13">${esc(`${nf(n)} ${unidade}`)}</text>`);
    y += 24;
  }
  return { svg: s.join('\n'), y: y + 4 };
}

const CONTROLE_NOME = () => ({ pct_urbana: L('urbanização', 'urbanisation'), log_densidade: L('densidade', 'density'), log_renda_resp: L('renda', 'income') });
const listaE = (xs, e) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ${e} ${xs.at(-1)}`);
const controles = (t) => { const n = CONTROLE_NOME(); const xs = t.controles.map((c) => n[c]); return L(listaE(xs, 'e'), listaE(xs, 'and')); };
/** Linha «ρ · parcial» de um teste. */
const rp = (t) => `${dec(t.rho)} · ${L('parcial', 'partial')} ${dec(t.parcial)}`;

/** Classe da diferença mulheres − homens, em pontos percentuais. */
const corDif = (v) => (v == null ? null : COR_DIF[classe(v, LIM_DIF)]);
const ROT_DIF = () => L(
  ['mulheres com 1 p.p. a menos ou mais', 'entre −1 e +1 p.p.', '+1 a +5 p.p.', '+5 a +10 p.p.', '+10 a +20 p.p.', '+20 p.p. ou mais'],
  ['women 1 pp or more below', 'between −1 and +1 pp', '+1 to +5 pp', '+5 to +10 pp', '+10 to +20 pp', '+20 pp or more']);

/** Barras da decomposição no estado: diferença total, parte da composição e parte de dentro do setor. */
function decomposicao(servicos, y, { titulo, totalNoNome = false }) {
  const s = [rotuloPainel(titulo, y)];
  let yy = y + 16;
  const max = Math.max(...servicos.map(([, k]) => C.estServ[k].dif)) * 1.25;
  for (const [nome, k] of servicos) {
    const d = C.estServ[k];
    s.push(`<text x="0" y="${yy + 12}" font-family="${SERIF}" font-size="15" font-weight="bold">${esc(totalNoNome ? `${nome} · ${L('diferença total', 'total gap')} ${pp(d.dif, 2)}` : nome)}</text>`);
    yy += 18;
    const b = barras([
      ...(totalNoNome ? [] : [[L('diferença total', 'total gap'), Math.max(d.dif, 0.001), COR_DIF[4], pp(d.dif, 2)]]),
      [L('onde elas moram', 'where they live'), Math.max(d.comp, 0.001), COR_DIF[3], pp(d.comp, 2)],
      [L('dentro do mesmo setor', 'within the same tract'), Math.max(d.setor, 0.001), COR_DIF[2], pp(d.setor, 2)],
    ], yy, { max, x0: 200, passo: 18 });
    s.push(b.svg);
    yy = b.y + 8;
  }
  return { svg: s.join('\n'), y: yy };
}

/* ------------------------------------------------------------------ 103 quase metade das casas (APOND) */
function distribuicao() {
  const A = C.apond, ta = (y) => T('apond', 'pct_resp_mulher', y), tm = (y) => T('municipios', 'pct_resp_mulher', y);
  const rot = () => L(['menos de 40 %', '40 a 44 %', '44 a 48 %', '48 a 52 %', '52 a 56 %', '56 % ou mais'], ['under 40%', '40 to 44%', '44 to 48%', '48 to 52%', '52 to 56%', '56% or more']);
  const al = A.alta, ba = A.baixa;
  return () => ({
    layout: 'um',
    serie: serie('distribuicao'),
    titulo: () => L('Quase metade das casas', 'Nearly half the homes'),
    subtitulo: () => L('Em 2022, 49 % dos domicílios paulistas tinham uma mulher como responsável', 'In 2022, 49% of São Paulo’s households named a woman as the person responsible'),
    descricao: () => L(
      `Domicílios particulares permanentes ocupados cuja pessoa responsável é mulher, sobre o total, por área de ponderação do Censo 2022 (${nf(A.n)} áreas nos 645 municípios)`,
      `Occupied permanent private households whose responsible person is a woman, as a share of all, by 2022 Census weighting area (${nf(A.n)} areas across the 645 municipalities)`),
    mapa: () => ({
      preencher: () => NEUTRO,
      bordaMunicipio: 0.4,
      camadas: [
        { feats: A.feats.filter((f) => f.properties.f != null), cor: (f) => LILAS[classe(f.properties.f, LIM_F)], borda: '#ffffff', largura: 0.25 },
        { feats: A.feats.filter((f) => f.properties.f == null), hachura: HACHURA, borda: 'none' },
      ],
      chamadas: [
        { coord: al.pt, dx: -60, dy: 250, tamanho: 16, titulo: L(`${al.NM_MUN.toUpperCase()} · ${nf(al.pct_resp_mulher, 0)} %`, `${al.NM_MUN.toUpperCase()} · ${nf(al.pct_resp_mulher, 0)}%`),
          linhas: L(['a área de 5 mil moradores ou mais', 'com a maior parte de responsáveis mulheres'], ['the area of 5,000+ residents with the', 'largest share of women responsible']) },
        { coord: ba.pt, dx: 170, dy: 210, tamanho: 16, titulo: L(`${ba.NM_MUN.toUpperCase()} · ${nf(ba.pct_resp_mulher, 0)} %`, `${ba.NM_MUN.toUpperCase()} · ${nf(ba.pct_resp_mulher, 0)}%`),
          linhas: L(['a menor, entre as áreas', 'de 5 mil moradores ou mais'], ['the smallest, among areas', 'of 5,000+ residents']) },
      ],
    }),
    legendaFigura: () => {
      const g = legenda([...LILAS.map((c, i) => [c, rot()[i], null]), ['hachura', L('sem informação', 'no data'), null]], 0,
        { titulo: L('DOMICÍLIOS COM RESPONSÁVEL MULHER', 'HOUSEHOLDS WITH A WOMAN RESPONSIBLE'), unidade: '' });
      return { svg: g.svg, altura: g.y, largura: 400 };
    },
    numeros: () => [
      [pc(E.pct), [L(`${milhoes(E.domF)} de domicílios`, `${milhoes(E.domF)} households`), L(`de ${milhoes(E.domF + E.domM)} no estado`, `out of ${milhoes(E.domF + E.domM)} in the state`)]],
      [pc(E.pct2010), [L('em 2010, com o mesmo', 'in 2010, with the same'), L('conceito e o mesmo universo', 'concept and universe')]],
      [dec(ta('pct_urbana').rho), [L('com a urbanização,', 'with urbanisation,'), L(`nas ${nf(ta('pct_urbana').n)} APOND (Spearman)`, `across ${nf(ta('pct_urbana').n)} areas (Spearman)`)]],
      [`${nf(R.municipios.pct_resp_mulher.min, 0)}–${nf(R.municipios.pct_resp_mulher.max, 0)}`, [L('% nos municípios, do', '% across municipalities,'), L('menor ao maior', 'lowest to highest')]],
    ],
    painel: (y) => {
      const s = [];
      const g = legenda([...LILAS.map((c, i) => [c, rot()[i], C.cont.apond[i]]), ['hachura', L('sem informação', 'no data'), A.sem]], y,
        { titulo: L('DOMICÍLIOS COM RESPONSÁVEL MULHER', 'HOUSEHOLDS WITH A WOMAN RESPONSIBLE'), unidade: L('áreas', 'areas') });
      s.push(g.svg);
      const q = quadro([
        [L('urbanização (APOND)', 'urbanisation (areas)'), rp(ta('pct_urbana')), true],
        [L('densidade (APOND)', 'density (areas)'), rp(ta('log_densidade'))],
        [L('renda média do responsável (APOND)', 'mean income of the responsible (areas)'), rp(ta('renda_resp_media'))],
        [L('urbanização (municípios)', 'urbanisation (municipalities)'), rp(tm('pct_urbana'))],
        [L('autocorrelação (Moran, APOND · municípios)', 'autocorrelation (Moran, areas · municipalities)'), `${dec(ta('pct_urbana').Ix)} · ${dec(tm('pct_urbana').Ix)}`],
      ], g.y + 10, { titulo: L('ONDE HÁ MAIS (SPEARMAN)', 'WHERE THERE ARE MORE (SPEARMAN)') });
      s.push(q.svg);
      const n = nota(L(
        `Responsáveis mulheres são mais comuns nas cidades e nos bairros densos: é o maior traço do mapa. ${RESPONSAVEL()} Nos setores, o IBGE põe X nas células de 1 ou 2 domicílios; aqui o X entra como 1,5, e o intervalo de 1 a 2 muda a taxa de uma área em menos de 1 ponto.`,
        `Women responsible are more common in towns and dense neighbourhoods: that is the map’s strongest feature. ${RESPONSAVEL()} In the tracts, IBGE puts an X in cells of 1 or 2 households; here an X counts as 1.5, and the 1-to-2 range moves an area’s rate by less than 1 point.`), q.y + 12, { tamanho: 14 });
      s.push(n.svg);
      return { svg: s.join('\n'), y: n.y };
    },
    fontes: () => [FONTE_SETORES(), L('IBGE, SIDRA 3221 (Censo 2010); APOND 2022', 'IBGE, SIDRA 3221 (2010 Census); 2022 weighting areas'), FONTE_MALHA()],
  });
}

/* ------------------------------------------------------------------ 104 dez pontos em doze anos */
function crescimento() {
  const corVar = (v) => (v == null ? null : v < 0 ? COR_QUEDA : COR_VAR[classe(v, LIM_VAR)]);
  const com = C.mun.filter((m) => m.var_resp_mulher != null);
  const queda = com.filter((m) => m.var_resp_mulher < 0).length;
  const n = new Array(LIM_VAR.length + 1).fill(0);
  for (const m of com) if (m.var_resp_mulher >= 0) n[classe(m.var_resp_mulher, LIM_VAR)]++;
  const rot = () => L(['caiu', '0 a +5 p.p.', '+5 a +10 p.p.', '+10 a +15 p.p.', '+15 a +20 p.p.', '+20 p.p. ou mais'], ['fell', '0 to +5 pp', '+5 to +10 pp', '+10 to +15 pp', '+15 to +20 pp', '+20 pp or more']);
  const a = mun('Morro Agudo'), sp = mun('São Paulo');
  const tu = T('municipios', 'var_resp_mulher', 'pct_urbana'), te = T('municipios', 'var_resp_mulher', 'esgoto_rede_total');
  const med10 = R.municipios.pct_resp_mulher_2010.med, med22 = R.municipios.pct_resp_mulher.med;
  return () => ({
    layout: 'um',
    serie: serie('crescimento'),
    titulo: () => L('Dez pontos em doze anos', 'Ten points in twelve years'),
    subtitulo: () => L('De 2010 a 2022, a parte de casas com responsável mulher subiu no campo e na cidade', 'From 2010 to 2022, the share of homes with a woman responsible rose in country and town alike'),
    descricao: () => L(
      'Variação, em pontos percentuais, da parte dos domicílios particulares permanentes ocupados com pessoa responsável mulher, de 2010 a 2022, por município (Censos 2010 e 2022, universo)',
      'Change, in percentage points, in the share of occupied permanent private households with a woman as the responsible person, from 2010 to 2022, by municipality (2010 and 2022 Censuses, full count)'),
    mapa: () => ({
      preencher: (cd) => corVar(POR.get(cd)?.var_resp_mulher),
      bordaMunicipio: 0.5,
      chamadas: [
        chamada(a, -40, -250, L(`${a.NM_MUN.toUpperCase()} · ${pp(a.var_resp_mulher, 0)}`, `${a.NM_MUN.toUpperCase()} · ${pp(a.var_resp_mulher, 0)}`),
          L([`de ${nf(a.pct_resp_mulher_2010, 0)} % para ${nf(a.pct_resp_mulher, 0)} %: o maior salto`, 'entre os de 20 mil habitantes ou mais'], [`from ${nf(a.pct_resp_mulher_2010, 0)}% to ${nf(a.pct_resp_mulher, 0)}%: the biggest jump`, 'among towns of 20,000 or more'])),
        chamada(sp, 120, 230, L(`SÃO PAULO · ${pp(sp.var_resp_mulher, 0)}`, `SÃO PAULO · ${pp(sp.var_resp_mulher, 0)}`),
          L([`de ${nf(sp.pct_resp_mulher_2010, 0)} % para ${nf(sp.pct_resp_mulher, 0)} %: a capital`, 'já partia de cima'], [`from ${nf(sp.pct_resp_mulher_2010, 0)}% to ${nf(sp.pct_resp_mulher, 0)}%: the capital`, 'was already high'])),
      ],
    }),
    legendaFigura: () => {
      const g = legenda([[COR_QUEDA, rot()[0], null], ...COR_VAR.map((c, i) => [c, rot()[i + 1], null])], 0,
        { titulo: L('VARIAÇÃO 2010–2022', 'CHANGE 2010–2022'), unidade: '' });
      return { svg: g.svg, altura: g.y, largura: 300 };
    },
    numeros: () => [
      [pp(E.pct - E.pct2010), [L(`no estado: de ${pc(E.pct2010)}`, `statewide: from ${pc(E.pct2010)}`), L(`para ${pc(E.pct)}`, `to ${pc(E.pct)}`)]],
      [L(`+${nf(Math.round((100 * (E.domF - E.f2010)) / E.f2010))} %`, `+${nf(Math.round((100 * (E.domF - E.f2010)) / E.f2010))}%`), [L(`domicílios com responsável mulher:`, 'households with a woman responsible:'), L(`${milhoes(E.f2010)} → ${milhoes(E.domF)}`, `${milhoes(E.f2010)} → ${milhoes(E.domF)}`)]],
      [nf(com.length - queda), [L(`de ${nf(com.length)} municípios`, `of ${nf(com.length)} municipalities`), L('subiram', 'went up')]],
      [dec(tu.rho), [L('variação × urbanização:', 'change × urbanisation:'), L('sem relação', 'no relationship')]],
    ],
    painel: (y) => {
      const s = [];
      const g = legenda([[COR_QUEDA, rot()[0], queda], ...COR_VAR.map((c, i) => [c, rot()[i + 1], n[i]])], y,
        { titulo: L('VARIAÇÃO 2010–2022', 'CHANGE 2010–2022'), unidade: L('mun.', 'mun.') });
      s.push(g.svg);
      const q = quadro([
        [L('estado', 'state'), `${pc(E.pct2010)} → ${pc(E.pct)}`, true],
        [L('município mediano', 'median municipality'), `${pc(med10)} → ${pc(med22)}`],
        [L('capital', 'capital'), `${pc(sp.pct_resp_mulher_2010)} → ${pc(sp.pct_resp_mulher)}`],
        [L('variação × urbanização', 'change × urbanisation'), rp(tu)],
        [L('variação × esgoto na rede', 'change × mains sewerage'), rp(te)],
      ], g.y + 10, { titulo: L('DE 2010 A 2022', 'FROM 2010 TO 2022') });
      s.push(q.svg);
      const nt = nota(L(
        `Os dois censos contam o universo dos domicílios particulares permanentes ocupados e usam o mesmo conceito de responsável, e os 645 municípios são os mesmos: a comparação vale. O que muda pode ser a casa ou o costume de quem responde, que hoje aponta mais a mulher. Os ${nf(queda)} que caíram são pequenos, onde poucas casas mudam a taxa. ${RESPONSAVEL()}`,
        `Both censuses count all occupied permanent private households and use the same definition of the responsible person, and the 645 municipalities are the same: the comparison holds. What changed may be the household or the habit of whoever answers, who now names the woman more often. The ${nf(queda)} that fell are small, where a few homes move the rate. ${RESPONSAVEL()}`), q.y + 12, { tamanho: 14 });
      s.push(nt.svg);
      return { svg: s.join('\n'), y: nt.y };
    },
    fontes: () => [L('IBGE, Censo 2010: SIDRA 3221 (universo)', 'IBGE, 2010 Census: SIDRA 3221 (full count)'), L('IBGE, Censo 2022: setores (domicílio, parte 2)', 'IBGE, 2022 Census: tracts (households, part 2)'), FONTE_MALHA()],
  });
}

/* ------------------------------------------------------------------ 105 responsável não é mãe solo */
function conjuge() {
  const com = C.mun.filter((m) => m.pct_mulher_com_conjuge != null);
  const rot = () => L(['menos de 40 %', '40 a 45 %', '45 a 50 %', '50 a 55 %', '55 % ou mais'], ['under 40%', '40 to 45%', '45 to 50%', '50 to 55%', '55% or more']);
  const a = mun('Itupeva'), b = mun('Santos');
  const t = T('municipios', 'pct_resp_mulher', 'pct_mulher_com_conjuge'), ts = T('municipios', 'pct_resp_mulher', 'pct_mulher_sem_conjuge_filhos');
  const PARTES = () => [
    [L('com cônjuge', 'with a spouse'), OCRE[3]],
    [L('sem cônjuge, com filhos', 'no spouse, with children'), LILAS[3]],
    [L('outras composições', 'other arrangements'), '#d9dcde'],
  ];
  return () => ({
    layout: 'um',
    serie: serie('conjuge'),
    titulo: () => L('Responsável não é mãe solo', 'Responsible is not lone mother'),
    subtitulo: () => L('44 % das mulheres responsáveis vivem com cônjuge, e são mais onde elas são mais', '44% of women responsible live with a spouse, and more so where there are more of them'),
    descricao: () => L(
      'Domicílios com pessoa responsável mulher em que há cônjuge (com ou sem filhos), sobre todos os domicílios com responsável mulher, por município (Censo 2022, universo)',
      'Households with a woman as the responsible person where there is a spouse (with or without children), over all households with a woman responsible, by municipality (2022 Census, full count)'),
    mapa: () => ({
      preencher: (cd) => { const v = POR.get(cd)?.pct_mulher_com_conjuge; return v == null ? null : OCRE[classe(v, LIM_CONJ)]; },
      bordaMunicipio: 0.5,
      chamadas: [
        chamada(a, 160, -500, L(`${a.NM_MUN.toUpperCase()} · ${nf(a.pct_mulher_com_conjuge, 0)} %`, `${a.NM_MUN.toUpperCase()} · ${nf(a.pct_mulher_com_conjuge, 0)}%`),
          L(['das responsáveis vivem com cônjuge:', 'a maior parte, entre os de 20 mil hab. ou mais'], ['of women responsible live with a spouse:', 'the most, in towns of 20,000 or more'])),
        chamada(b, 170, 230, L(`SANTOS · ${nf(b.pct_mulher_com_conjuge, 0)} %`, `SANTOS · ${nf(b.pct_mulher_com_conjuge, 0)}%`),
          L(['com cônjuge, numa cidade', 'de muitas idosas que moram sós'], ['with a spouse, in a city of', 'many older women living alone'])),
      ],
    }),
    legendaFigura: () => {
      const g = legenda(OCRE.map((c, i) => [c, rot()[i], null]), 0,
        { titulo: L('RESPONSÁVEIS MULHERES COM CÔNJUGE', 'WOMEN RESPONSIBLE LIVING WITH A SPOUSE'), unidade: '' });
      return { svg: g.svg, altura: g.y, largura: 420 };
    },
    numeros: () => [
      [pc(E.f_conjuge, 0), [L('das responsáveis mulheres', 'of women responsible'), L(`vivem com cônjuge (homens: ${pc(E.m_conjuge, 0)})`, `live with a spouse (men: ${pc(E.m_conjuge, 0)})`)]],
      [pc(E.f_sem_conjuge_filhos, 0), [L('não têm cônjuge e moram', 'have no spouse and live'), L('com filhos ou enteados', 'with children or stepchildren')]],
      [dec(t.rho), [L('com a parte de responsáveis', 'with the share of women'), L(`mulheres; parcial ${dec(t.parcial)}`, `responsible; partial ${dec(t.parcial)}`)]],
      [pc(E.monoparental_mulher_share, 0), [L('dos lares sem cônjuge e com', 'of homes with children and'), L('filhos têm uma mulher à frente', 'no spouse are headed by a woman')]],
    ],
    painel: (y) => {
      const s = [];
      const g = legenda(OCRE.map((c, i) => [c, rot()[i], C.cont.conj[i]]), y,
        { titulo: L('RESPONSÁVEIS MULHERES COM CÔNJUGE', 'WOMEN RESPONSIBLE LIVING WITH A SPOUSE'), unidade: L('mun.', 'mun.') });
      s.push(g.svg);
      let yy = g.y + 10;
      s.push(rotuloPainel(L('COMO SÃO AS CASAS, NO ESTADO', 'WHAT THE HOMES ARE LIKE, STATEWIDE'), yy));
      yy += 18;
      const comp = (f) => [f ? E.f_conjuge : E.m_conjuge, f ? E.f_sem_conjuge_filhos : E.m_sem_conjuge_filhos];
      for (const [rotulo, f] of [[L('responsável mulher', 'woman responsible'), true], [L('responsável homem', 'man responsible'), false]]) {
        const [c1, c2] = comp(f);
        s.push(`<text x="0" y="${yy + 12}" font-family="${SERIF}" font-size="15">${esc(rotulo)}</text>`);
        s.push(`<g transform="translate(0 ${yy + 20})">${fita([[c1, PARTES()[0][1]], [c2, PARTES()[1][1]], [100 - c1 - c2, PARTES()[2][1]]], 0, 18)}</g>`);
        s.push(`<text x="${LP}" y="${yy + 12}" text-anchor="end" font-family="${MONO}" font-size="12.5">${esc(`${pc(c1, 0)} · ${pc(c2, 0)} · ${pc(100 - c1 - c2, 0)}`)}</text>`);
        yy += 50;
      }
      yy += 4;
      PARTES().forEach(([r, c], i) => { s.push(`<rect x="${i * 190}" y="${yy - 11}" width="14" height="12" fill="${c}" stroke="#1a211a" stroke-width=".5"/><text x="${i * 190 + 20}" y="${yy}" font-family="${SERIF}" font-size="13.5">${esc(r)}</text>`); });
      yy += 22;
      const q = quadro([
        [L('responsáveis mulheres × com cônjuge', 'women responsible × with a spouse'), rp(t), true],
        [L('responsáveis mulheres × sem cônjuge, com filhos', 'women responsible × no spouse, children'), rp(ts)],
        [L('amostra efetiva · p', 'effective sample · p'), `${nf(t.n_eff)} · ${pTxt(t.p_eff)}`],
      ], yy, { titulo: L('COMO SE RELACIONAM (SPEARMAN)', 'HOW THEY RELATE (SPEARMAN)') });
      s.push(q.svg);
      const nt = nota(L(
        `Filhos são de qualquer idade. «Outras composições» inclui quem mora só e quem mora com parentes ou não parentes. Onde há mais responsáveis mulheres, mais delas têm cônjuge: o aumento não veio só de lares sem companheiro. ${ECOLOGICA()}`,
        `Children may be of any age. “Other arrangements” covers people living alone and with relatives or non-relatives. Where more women are responsible, more of them have a spouse: the rise did not come only from homes without a partner. ${ECOLOGICA()}`), q.y + 12, { tamanho: 14 });
      s.push(nt.svg);
      return { svg: s.join('\n'), y: nt.y };
    },
    fontes: () => [L('IBGE, Censo 2022: SIDRA 9882 (universo)', 'IBGE, 2022 Census: SIDRA 9882 (full count)'), FONTE_MALHA()],
  });
}

/* ------------------------------------------------------------------ 106 e 107 a diferença de cobertura */
function servico(tema, s, cfg) {
  const com = C.mun.filter((m) => m[`${s}_dif`] != null);
  const n = new Array(LIM_DIF.length + 1).fill(0);
  for (const m of com) n[classe(m[`${s}_dif`], LIM_DIF)]++;
  const r = R.municipios[s], d = C.estServ[s];
  const tt = T('municipios', 'pct_resp_mulher', `${s}_total`), td = T('municipios', 'pct_resp_mulher', `${s}_dif`);
  return () => ({
    layout: 'um',
    serie: serie(tema),
    titulo: cfg.titulo,
    subtitulo: cfg.subtitulo,
    descricao: cfg.descricao,
    mapa: () => ({
      preencher: (cd) => corDif(POR.get(cd)?.[`${s}_dif`]),
      bordaMunicipio: 0.5,
      chamadas: cfg.chamadas(),
    }),
    legendaFigura: () => {
      const g = legenda(COR_DIF.map((c, i) => [c, ROT_DIF()[i], null]), 0, { titulo: cfg.tituloLegenda(), unidade: '' });
      return { svg: g.svg, altura: g.y, largura: 400 };
    },
    numeros: () => [
      [pp(d.dif),[L(`no estado: ${pc(d.mulher)} nas casas delas,`, `statewide: ${pc(d.mulher)} in their homes,`), L(`${pc(d.homem)} nas deles`, `${pc(d.homem)} in men’s`)]],
      [pp(d.setor, 2), [L('dentro do mesmo setor', 'within the same tract'), L(`(e ${pp(d.comp, 2)} de endereço)`, `(and ${pp(d.comp, 2)} from address)`)]],
      [nf(r.mulheres_mais), [L(`de ${nf(com.length)} municípios em que`, `of ${nf(com.length)} municipalities where`), L('elas têm mais, além do sigilo', 'women have more, beyond the X range')]],
      [mil(E[s].sem_mulher), [L('casas com responsável mulher', 'homes with a woman responsible'), cfg.semRede()]],
    ],
    painel: (y) => {
      const sv = [];
      const g = legenda(COR_DIF.map((c, i) => [c, ROT_DIF()[i], n[i]]), y,
        { titulo: cfg.tituloLegenda(), unidade: L('mun.', 'mun.') });
      sv.push(g.svg);
      const dc = decomposicao([[cfg.nomeServico(), s]], g.y + 8, { titulo: L('DE ONDE VEM A DIFERENÇA, NO ESTADO', 'WHERE THE GAP COMES FROM, STATEWIDE') });
      sv.push(dc.svg);
      const q = quadro([
        [L('mediana dos municípios: total · endereço · setor', 'median municipality: total · address · tract'), `${dec(r.dif.med, 1)} · ${dec(r.composicao.med, 1)} · ${dec(r.setor.med, 1)}`, true],
        [L(`mais responsáveis mulheres × ${cfg.curto()}`, `more women responsible × ${cfg.curto()}`), rp(tt)],
        [L('mais responsáveis mulheres × a diferença', 'more women responsible × the gap'), rp(td)],
        [L('largura mediana do intervalo do sigilo', 'median width of the X range'), L(`${nf(r.amplitude_sigilo.med, 1)} p.p.`, `${nf(r.amplitude_sigilo.med, 1)} pp`)],
      ], dc.y + 8, { titulo: L('NOS MUNICÍPIOS', 'ACROSS MUNICIPALITIES') });
      sv.push(q.svg);
      const nt = nota(`${cfg.nota()} ${L(`Parciais descontadas ${controles(tt)}.`, `Partials net of ${controles(tt)}.`)}`, q.y + 12, { tamanho: 14 });
      sv.push(nt.svg);
      return { svg: sv.join('\n'), y: nt.y };
    },
    fontes: () => [L('IBGE, Censo 2022: setores (domicílio, parte 2)', 'IBGE, 2022 Census: tracts (households, part 2)'), FONTE_MALHA()],
  });
}

const NOTA_ENDERECO = () => L(
  '«Onde elas moram» é a diferença que sobraria se cada casa delas tivesse a cobertura das casas de homens do mesmo setor; «dentro do setor» é o resto.',
  '“Where they live” is the gap that would remain if each of their homes had the coverage of men’s homes in the same tract; “within the tract” is the rest.');

function esgoto() {
  const a = mun('Cunha'), b = mun('Cubatão');
  return servico('esgoto', 'esgoto_rede', {
    titulo: () => L('O esgoto e o endereço', 'Sewerage and the address'),
    subtitulo: () => L('As casas com responsável mulher têm mais esgoto na rede porque ficam mais na cidade', 'Homes with a woman responsible are more often on mains sewerage because they sit more in town'),
    descricao: () => L(
      'Diferença, em pontos percentuais, entre a parte dos domicílios com esgoto na rede geral ou pluvial (ou fossa ligada à rede) quando a responsável é mulher e quando é homem, por município (Censo 2022, universo)',
      'Gap, in percentage points, between the share of households on mains or storm sewers (or a septic tank linked to them) when the responsible person is a woman and when it is a man, by municipality (2022 Census, full count)'),
    chamadas: () => [
      chamada(a, -10, -500, L(`${a.NM_MUN.toUpperCase()} · ${pp(a.esgoto_rede_dif, 0)}`, `${a.NM_MUN.toUpperCase()} · ${pp(a.esgoto_rede_dif, 0)}`),
        L([`a maior diferença; dentro do setor, ${pp(a.esgoto_rede_dif_setor, 1)}:`, 'é o campo, de responsável homem, sem rede'], [`the widest gap; within tracts, ${pp(a.esgoto_rede_dif_setor, 1)}:`, 'it is the countryside, man-headed, unsewered'])),
      chamada(b, -40, 250, L(`${b.NM_MUN.toUpperCase()} · ${pp(b.esgoto_rede_dif, 1)}`, `${b.NM_MUN.toUpperCase()} · ${pp(b.esgoto_rede_dif, 1)}`),
        L(['um dos poucos em que as casas delas', 'têm menos rede, mesmo no pior caso do sigilo'], ['one of few where women’s homes have', 'less network, even in the worst X case'])),
    ],
    tituloLegenda: () => L('ESGOTO NA REDE: MULHERES − HOMENS', 'MAINS SEWERAGE: WOMEN − MEN'),
    nomeServico: () => L('Esgoto na rede', 'Mains sewerage'),
    curto: () => L('esgoto na rede', 'mains sewerage'),
    semRede: () => L(`fora da rede (homens: ${mil(E.esgoto_rede.sem_homem)})`, `off the network (men: ${mil(E.esgoto_rede.sem_homem)})`),
    nota: NOTA_ENDERECO,
  });
}

function agua() {
  const a = mun('Cunha'), b = mun('Piedade'), c = mun('Guarujá');
  return servico('agua', 'agua_rede', {
    titulo: () => L('A água chega pelo endereço', 'Water arrives by address'),
    subtitulo: () => L('Em quase todo município, as casas delas têm mais água da rede; quase tudo é onde ficam', 'In almost every town, women’s homes have more mains water; nearly all of it is where they are'),
    descricao: () => L(
      'Diferença, em pontos percentuais, entre a parte dos domicílios abastecidos pela rede geral de água quando a responsável é mulher e quando é homem, por município (Censo 2022, universo)',
      'Gap, in percentage points, between the share of households supplied by the mains water network when the responsible person is a woman and when it is a man, by municipality (2022 Census, full count)'),
    chamadas: () => [
      chamada(a, -10, -500, L(`${a.NM_MUN.toUpperCase()} · ${pp(a.agua_rede_dif, 0)}`, `${a.NM_MUN.toUpperCase()} · ${pp(a.agua_rede_dif, 0)}`),
        L([`a maior diferença; dentro do setor, ${pp(a.agua_rede_dif_setor, 1)}:`, 'no campo, poço e nascente são das casas deles'], [`the widest gap; within tracts, ${pp(a.agua_rede_dif_setor, 1)}:`, 'rural wells and springs are men’s homes'])),
      chamada(b, -380, 60, L(`${b.NM_MUN.toUpperCase()} · ${pp(b.agua_rede_dif, 0)}`, `${b.NM_MUN.toUpperCase()} · ${pp(b.agua_rede_dif, 0)}`),
        L([`${pp(b.agua_rede_dif_setor, 1)} dentro do setor, das maiores`, 'entre os de 50 mil habitantes ou mais'], [`${pp(b.agua_rede_dif_setor, 1)} within tracts, among the largest`, 'in towns of 50,000 or more'])),
      chamada(c, 90, 200, L(`GUARUJÁ · ${pp(c.agua_rede_dif, 1)}`, `GUARUJÁ · ${pp(c.agua_rede_dif, 1)}`),
        L(['elas têm menos, mas por pouco', 'e só dentro do intervalo do sigilo'], ['women have less, but barely,', 'and within the X range'])),
    ],
    tituloLegenda: () => L('ÁGUA DA REDE: MULHERES − HOMENS', 'MAINS WATER: WOMEN − MEN'),
    nomeServico: () => L('Água da rede geral', 'Mains water'),
    curto: () => L('água da rede', 'mains water'),
    semRede: () => L(`fora da rede (homens: ${mil(E.agua_rede.sem_homem)})`, `off the network (men: ${mil(E.agua_rede.sem_homem)})`),
    nota: NOTA_ENDERECO,
  });
}

/* ------------------------------------------------------------------ 108 luz na rua (substituto da energia) */
function iluminacao() {
  const com = C.mun.filter((m) => m.pct_sem_iluminacao != null);
  const n = new Array(LIM_LUZ.length + 1).fill(0);
  for (const m of com) n[classe(m.pct_sem_iluminacao, LIM_LUZ)]++;
  const rot = () => L(['menos de 1 %', '1 a 2 %', '2 a 5 %', '5 a 10 %', '10 % ou mais'], ['under 1%', '1 to 2%', '2 to 5%', '5 to 10%', '10% or more']);
  const a = mun('Sete Barras'), b = mun('Juquitiba');
  const t = T('municipios', 'pct_resp_mulher', 'pct_iluminacao');
  return () => ({
    layout: 'um',
    serie: serie('iluminacao'),
    titulo: () => L('Luz na rua', 'Light in the street'),
    subtitulo: () => L('O Censo 2022 não perguntou pela energia elétrica; a iluminação pública não segue o sexo do responsável', 'The 2022 Census did not ask about electricity; street lighting does not follow the sex of the responsible person'),
    descricao: () => L(
      'Domicílios particulares permanentes ocupados em face de quadra sem iluminação pública, sobre os domicílios dos setores da Pesquisa Urbanística do Entorno, por município (Censo 2022)',
      'Occupied permanent private households on a block face with no street lighting, over households in the tracts of the Urban Surroundings Survey, by municipality (2022 Census)'),
    mapa: () => ({
      preencher: (cd) => { const v = POR.get(cd)?.pct_sem_iluminacao; return v == null ? null : COR_LUZ[classe(v, LIM_LUZ)]; },
      bordaMunicipio: 0.5,
      chamadas: [
        chamada(a, 60, 210, L(`${a.NM_MUN.toUpperCase()} · ${nf(a.pct_sem_iluminacao, 0)} %`, `${a.NM_MUN.toUpperCase()} · ${nf(a.pct_sem_iluminacao, 0)}%`),
          L(['das casas pesquisadas sem luz na rua:', 'a maior parte, entre os de 5 mil hab. ou mais'], ['of surveyed homes have no street light:', 'the most, in towns of 5,000 or more'])),
        chamada(b, -200, 170, L(`${b.NM_MUN.toUpperCase()} · ${nf(b.pct_sem_iluminacao, 0)} %`, `${b.NM_MUN.toUpperCase()} · ${nf(b.pct_sem_iluminacao, 0)}%`),
          L(['chácaras e loteamentos', 'da serra, na metrópole'], ['smallholdings and plots', 'in the hills of the metropolis'])),
      ],
    }),
    legendaFigura: () => {
      const g = legenda(COR_LUZ.map((c, i) => [c, rot()[i], null]), 0,
        { titulo: L('DOMICÍLIOS SEM ILUMINAÇÃO PÚBLICA', 'HOUSEHOLDS WITH NO STREET LIGHTING'), unidade: '' });
      return { svg: g.svg, altura: g.y, largura: 400 };
    },
    numeros: () => [
      [pc(E.energia2010, 2),[L('das casas tinham energia', 'of homes had electricity'), L(`em 2010 (${mil(E.sem_energia2010)} sem)`, `in 2010 (${mil(E.sem_energia2010)} without)`)]],
      [pc((100 * E.ilum_nao) / E.ilum_tot), [L(`sem luz na rua em 2022:`, 'no street light in 2022:'), L(`${mil(E.ilum_nao)} domicílios`, `${mil(E.ilum_nao)} households`)]],
      [dec(t.rho), [L('com a parte de responsáveis', 'with the share of women'), L(`mulheres; parcial ${dec(t.parcial)}`, `responsible; partial ${dec(t.parcial)}`)]],
      [pc(R.municipios.cobertura_entorno.med, 0), [L('das casas do município mediano', 'of homes in the median town'), L('estão na pesquisa do entorno', 'are in the surroundings survey')]],
    ],
    painel: (y) => {
      const s = [];
      const g = legenda(COR_LUZ.map((c, i) => [c, rot()[i], n[i]]), y,
        { titulo: L('DOMICÍLIOS SEM ILUMINAÇÃO PÚBLICA', 'HOUSEHOLDS WITH NO STREET LIGHTING'), unidade: L('mun.', 'mun.') });
      s.push(g.svg);
      const q = quadro([
        [L('responsáveis mulheres × com iluminação', 'women responsible × with lighting'), rp(t), true],
        [L('amostra efetiva · p', 'effective sample · p'), `${nf(t.n_eff)} · ${pTxt(t.p_eff)}`],
        [L('municípios sem nenhuma casa sem luz', 'municipalities with no unlit home'), nf(C.cont.luzZero)],
      ], g.y + 10, { titulo: L('COMO SE RELACIONAM (SPEARMAN)', 'HOW THEY RELATE (SPEARMAN)') });
      s.push(q.svg);
      const nt = nota(L(
        `A energia elétrica saiu do questionário em 2022; em 2010 ela já chegava a quase todas as casas paulistas. A iluminação pública é o substituto mais próximo, mas é outra coisa: fala da rua, não da casa, e só nos setores que o IBGE percorreu na Pesquisa Urbanística do Entorno, quase todos urbanos. A relação com responsáveis mulheres é fraca e não passa no teste. ${ECOLOGICA()}`,
        `Electricity left the questionnaire in 2022; in 2010 it already reached almost every home in the state. Street lighting is the nearest substitute, but it is something else: it speaks of the street, not the home, and only in the tracts IBGE walked for the Urban Surroundings Survey, nearly all urban. The link with women responsible is weak and fails the test. ${ECOLOGICA()}`), q.y + 12, { tamanho: 14 });
      s.push(nt.svg);
      return { svg: s.join('\n'), y: nt.y };
    },
    fontes: () => [L('IBGE, Censo 2022: SIDRA 9583 e 9882', 'IBGE, 2022 Census: SIDRA 9583 and 9882'), L('IBGE, Censo 2010: SIDRA 3217', 'IBGE, 2010 Census: SIDRA 3217'), FONTE_MALHA()],
  });
}

/* ------------------------------------------------------------------ 109 renda (bivariado) */
function renda() {
  const B = C.biv;
  const t = T('municipios', 'pct_resp_mulher', 'razao_renda_sexo'), tr = T('municipios', 'pct_resp_mulher', 'renda_resp_media'), tm = T('municipios', 'pct_resp_mulher', 'renda_mulheres');
  const ta = T('apond', 'pct_resp_mulher', 'renda_resp_media');
  const a = mun('Lucélia'), b = mun('Pilar do Sul');
  const casa = (cd) => { const v = POR.get(cd)?.b109; return v == null ? null : BIV[(v % 10) - 1][Math.floor(v / 10) - 1]; };
  const fP = (v) => L(`${nf(v, 0)} %`, `${nf(v, 0)}%`);
  /** Chave bivariada 3 × 3 com os eixos e os limites dos terços; `contagens` põe os municípios em cada casa. */
  function chave(y, { contagens = true } = {}) {
    const s = [rotuloPainel(L('RESPONSÁVEIS MULHERES × RAZÃO DE RENDA, EM TERÇOS', 'WOMEN RESPONSIBLE × INCOME RATIO, IN THIRDS'), y)];
    const q = 44, x0 = 116, y0 = y + 28;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const xx = x0 + j * q, yy = y0 + (2 - i) * q;
      s.push(`<rect x="${xx}" y="${yy}" width="${q}" height="${q}" fill="${BIV[i][j]}" stroke="#ffffff" stroke-width="1"/>`);
      if (contagens) s.push(`<text x="${xx + q / 2}" y="${yy + q / 2 + 5}" text-anchor="middle" font-family="${MONO}" font-size="13" fill="${i === 2 || (i === 1 && j === 2) ? '#ffffff' : TINTA}">${B.casas[i][j]}</text>`);
    }
    const eX = L('responsáveis mulheres', 'women responsible'), eY = L('renda delas / deles', 'her / his income');
    s.push(`<path d="M${x0} ${y0 + 3 * q + 10}h${3 * q}" stroke="${TINTA}" stroke-width="1"/><path d="M${x0 + 3 * q - 6} ${y0 + 3 * q + 6}l6 4l-6 4" fill="none" stroke="${TINTA}"/>`);
    s.push(`<text x="${x0 + 1.5 * q}" y="${y0 + 3 * q + 30}" text-anchor="middle" font-family="${MONO}" font-size="12">${esc(`${eX} →`)}</text>`);
    s.push(`<path d="M${x0 - 10} ${y0 + 3 * q}v${-3 * q}" stroke="${TINTA}" stroke-width="1"/><path d="M${x0 - 14} ${y0 + 6}l4 -6l4 6" fill="none" stroke="${TINTA}"/>`);
    s.push(`<text x="${x0 - 22}" y="${y0 + 1.5 * q}" text-anchor="middle" font-family="${MONO}" font-size="12" transform="rotate(-90 ${x0 - 22} ${y0 + 1.5 * q})">${esc(`${eY} →`)}</text>`);
    const tx = x0 + 3 * q + 30;
    const lin = L(
      ['terços de responsáveis mulheres:', `até ${fP(B.tx[0])}, ${fP(B.tx[0])} a ${fP(B.tx[1])}`, `e mais de ${fP(B.tx[1])}`, '', 'terços da razão de renda:', `até ${fP(B.ty[0])}, ${fP(B.ty[0])} a ${fP(B.ty[1])}`, `e mais de ${fP(B.ty[1])}`, ...(contagens ? ['', 'municípios em cada casa'] : [])],
      ['thirds of women responsible:', `up to ${fP(B.tx[0])}, ${fP(B.tx[0])} to ${fP(B.tx[1])}`, `and over ${fP(B.tx[1])}`, '', 'thirds of the income ratio:', `up to ${fP(B.ty[0])}, ${fP(B.ty[0])} to ${fP(B.ty[1])}`, `and over ${fP(B.ty[1])}`, ...(contagens ? ['', 'municipalities in each cell'] : [])]);
    lin.forEach((l, k) => s.push(`<text x="${tx}" y="${y0 + 10 + k * 15}" font-family="${MONO}" font-size="12" fill="${CINZA}">${esc(l)}</text>`));
    return { svg: s.join('\n'), y: Math.max(y0 + 3 * q + 50, y0 + 10 + lin.length * 15 + 8) };
  }
  return () => ({
    layout: 'um',
    serie: serie('renda'),
    titulo: () => L('Onde elas ganham mais perto deles', 'Where women earn closer to men'),
    subtitulo: () => L('Onde a renda das mulheres chega mais perto da dos homens, há mais casas com responsável mulher', 'Where women’s income comes closer to men’s, more homes have a woman responsible'),
    descricao: () => L(
      `Domicílios com responsável mulher (Censo 2022, universo) e rendimento médio das mulheres de 14 anos ou mais sobre o dos homens (amostra), em terços dos ${nf(t.n)} municípios`,
      `Households with a woman responsible (2022 Census, full count) and the mean income of women aged 14 or over as a share of men’s (sample), in thirds of the ${nf(t.n)} municipalities`),
    mapa: () => ({
      preencher: casa,
      bordaMunicipio: 0.5,
      chamadas: [
        chamada(a, -150, -270, L(`${a.NM_MUN.toUpperCase()} · ${nf(a.razao_renda_sexo, 0)} %`, `${a.NM_MUN.toUpperCase()} · ${nf(a.razao_renda_sexo, 0)}%`),
          L([`da renda deles, e ${nf(a.pct_resp_mulher, 0)} % de responsáveis`, 'mulheres: terço de cima nos dois'], [`of men’s income, and ${nf(a.pct_resp_mulher, 0)}% women`, 'responsible: top third of both'])),
        chamada(b, 120, 220, L(`${b.NM_MUN.toUpperCase()} · ${nf(b.razao_renda_sexo, 0)} %`, `${b.NM_MUN.toUpperCase()} · ${nf(b.razao_renda_sexo, 0)}%`),
          L([`e ${nf(b.pct_resp_mulher, 0)} % de responsáveis mulheres:`, 'terço de baixo nos dois'], [`and ${nf(b.pct_resp_mulher, 0)}% women responsible:`, 'bottom third of both'])),
      ],
    }),
    numeros: () => [
      [dec(t.rho), [L('correlação de postos', 'rank correlation'), L(`em ${nf(t.n)} municípios`, `across ${nf(t.n)} municipalities`)]],
      [dec(t.parcial), [L('descontadas', 'net of'), controles(t)]],
      [nf(B.casas[2][2]), [L('municípios no terço de cima', 'municipalities in the top third'), L('dos dois', 'of both')]],
      [fP(R.municipios.razao_renda_sexo.med), [L('da renda dos homens: o que', 'of men’s income: what women'), L('as mulheres ganham, na mediana', 'earn, in the median town')]],
    ],
    legendaFigura: () => {
      const k = chave(0, { contagens: false });
      return { svg: k.svg, altura: k.y, largura: 520 };
    },
    painel: (y) => {
      const k = chave(y);
      const s = [k.svg];
      let yy = k.y + 10;
      const qd = quadro([
        [L('correlação de postos (Spearman)', 'rank correlation (Spearman)'), `${dec(t.rho)} · ${nf(t.n)} mun.`, true],
        [L(`parcial, descontadas ${controles(t)}`, `partial, net of ${controles(t)}`), dec(t.parcial)],
        [L('amostra efetiva, com a autocorrelação', 'effective sample, given autocorrelation'), `${nf(t.n_eff)} · p ${pTxt(t.p_eff)}`],
        [L('Moran bivariado (6 vizinhos)', 'bivariate Moran (6 neighbours)'), `${dec(B.I)} · p ${nf(B.pI, 3)}`],
        [L('responsáveis mulheres × renda média do responsável', 'women responsible × mean income of the responsible'), rp(tr)],
      ], yy, { titulo: L('COMO SE RELACIONAM', 'HOW THEY RELATE') });
      s.push(qd.svg);
      const nt = nota(L(
        `Sem renda por sexo do responsável no município, a razão compara todas as mulheres e todos os homens de 14 anos ou mais; vem da amostra e oscila em município pequeno. Descontada a urbanização, onde há mais responsáveis mulheres a renda média dos responsáveis é um pouco menor (parcial ${dec(tr.parcial)}; ${dec(ta.parcial)} nas APOND). ${ECOLOGICA()}`,
        `With no municipal income by sex of the responsible person, the ratio compares all women and all men aged 14 or over; it comes from the sample and wobbles in small towns. Net of urbanisation, where more women are responsible the mean income of the responsible is slightly lower (partial ${dec(tr.parcial)}; ${dec(ta.parcial)} across weighting areas). ${ECOLOGICA()}`), qd.y + 12, { tamanho: 13.5 });
      s.push(nt.svg);
      return { svg: s.join('\n'), y: nt.y };
    },
    fontes: () => [L('IBGE, Censo 2022: SIDRA 10299 (amostra)', 'IBGE, 2022 Census: SIDRA 10299 (sample)'), FONTE_SETORES(), FONTE_MALHA()],
  });
}

/* ------------------------------------------------------------------ 110 na mesma rua (síntese) */
function sintese() {
  const com = C.mun.filter((m) => m.dif_setor_media != null);
  const n = new Array(LIM_DIF.length + 1).fill(0);
  for (const m of com) n[classe(m.dif_setor_media, LIM_DIF)]++;
  const a = mun('Taquarivaí'), b = mun('Cunha');
  return () => ({
    layout: 'um',
    serie: serie('sintese'),
    titulo: () => L('Na mesma rua', 'On the same street'),
    subtitulo: () => L('Ao lado da casa de um homem responsável, a casa de uma mulher tem a mesma água, esgoto e coleta', 'Next door to a man’s home, a home with a woman responsible has the same water, sewerage and refuse collection'),
    descricao: () => L(
      'Diferença entre as casas com responsável mulher e as com responsável homem do mesmo setor censitário, em pontos percentuais, média de água da rede, esgoto na rede e lixo coletado, por município (Censo 2022, universo)',
      'Gap between homes with a woman responsible and homes with a man responsible in the same census tract, in percentage points, averaged over mains water, mains sewerage and refuse collection, by municipality (2022 Census, full count)'),
    mapa: () => ({
      preencher: (cd) => corDif(POR.get(cd)?.dif_setor_media),
      bordaMunicipio: 0.5,
      chamadas: [
        chamada(a, -60, 230, L(`${a.NM_MUN.toUpperCase()} · ${pp(a.dif_setor_media, 1)}`, `${a.NM_MUN.toUpperCase()} · ${pp(a.dif_setor_media, 1)}`),
          L(['a maior diferença dentro do setor;', `sem descontar o endereço, ${pp(a.dif_media, 1)}`], ['the widest within-tract gap;', `before netting out address, ${pp(a.dif_media, 1)}`])),
        chamada(b, -10, 330, L(`${b.NM_MUN.toUpperCase()} · ${pp(b.dif_setor_media, 1)}`, `${b.NM_MUN.toUpperCase()} · ${pp(b.dif_setor_media, 1)}`),
          L([`na mesma rua; no município inteiro, ${pp(b.dif_media, 0)}`, '(a maior diferença das pranchas 106 e 107)'], [`on the same street; for the whole town, ${pp(b.dif_media, 0)}`, '(the widest gap on plates 106 and 107)'])),
      ],
    }),
    legendaFigura: () => {
      const g = legenda(COR_DIF.map((c, i) => [c, ROT_DIF()[i], null]), 0,
        { titulo: L('DENTRO DO SETOR: MULHERES − HOMENS', 'WITHIN THE TRACT: WOMEN − MEN'), unidade: '' });
      return { svg: g.svg, altura: g.y, largura: 400 };
    },
    numeros: () => [
      [nf(n[1]),[L(`de ${nf(com.length)} municípios entre`, `of ${nf(com.length)} municipalities between`), L('−1 e +1 p.p.', '−1 and +1 pp')]],
      [pp(C.estServ.esgoto_rede.setor, 2), [L('esgoto na rede, no estado,', 'mains sewerage, statewide,'), L('dentro do mesmo setor', 'within the same tract')]],
      [pp(C.estServ.agua_rede.setor, 2), [L('água da rede, no estado,', 'mains water, statewide,'), L('dentro do mesmo setor', 'within the same tract')]],
      [pp(C.estServ.lixo_coletado.setor, 2), [L('lixo coletado, no estado,', 'refuse collection, statewide,'), L('dentro do mesmo setor', 'within the same tract')]],
    ],
    painel: (y) => {
      const s = [];
      const g = legenda(COR_DIF.map((c, i) => [c, ROT_DIF()[i], n[i]]), y,
        { titulo: L('DENTRO DO SETOR: MULHERES − HOMENS', 'WITHIN THE TRACT: WOMEN − MEN'), unidade: L('mun.', 'mun.') });
      s.push(g.svg);
      const dc = decomposicao([
        [L('Água da rede geral', 'Mains water'), 'agua_rede'],
        [L('Esgoto na rede', 'Mains sewerage'), 'esgoto_rede'],
        [L('Lixo coletado', 'Refuse collection'), 'lixo_coletado'],
      ], g.y + 8, { titulo: L('DE ONDE VEM A DIFERENÇA, NO ESTADO', 'WHERE THE GAP COMES FROM, STATEWIDE'), totalNoNome: true });
      s.push(dc.svg);
      const nt = nota(L(
        `Banheiro de uso exclusivo e água encanada dentro de casa quase não variam (${pp(C.estServ.banheiro.dif, 2)} e ${pp(C.estServ.agua_dentro.dif, 2)}). A rede segue a rua, e a rua não sabe quem responde pela casa: o que separa as casas delas das deles é o endereço. O setor é a menor área publicada; dentro dele, o Censo não diz qual casa fica onde.`,
        `An exclusive bathroom and piped water indoors barely vary (${pp(C.estServ.banheiro.dif, 2)} and ${pp(C.estServ.agua_dentro.dif, 2)}). Networks follow the street, and the street does not know who answers for the home: what separates women’s homes from men’s is the address. The tract is the smallest published area; within it, the Census does not say which home stands where.`), dc.y + 10, { tamanho: 14 });
      s.push(nt.svg);
      return { svg: s.join('\n'), y: nt.y };
    },
    fontes: () => [L('IBGE, Censo 2022: setores (domicílio, parte 2)', 'IBGE, 2022 Census: tracts (households, part 2)'), FONTE_MALHA()],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { distribuicao, crescimento, conjuge, esgoto, agua, iluminacao, renda, sintese };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/mulheres-responsaveis-sp/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
const e = SERIE.find((s) => s.tema === nome);
const fazer = await TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => fazer() });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `mulheres-responsaveis-sp-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
