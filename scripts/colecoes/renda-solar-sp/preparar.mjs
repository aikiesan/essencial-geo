#!/usr/bin/env node
/**
 * Coleção «Renda e sol nos telhados» (renda-solar-sp) — prepara os dados das pranchas 060 a 062 (uso interno).
 *
 *   node --max-old-space-size=8192 scripts/colecoes/renda-solar-sp/preparar.mjs [setores|apond|solar|gpkg ...]
 *
 * Censo 2022, agregados por setor (dados-brutos/ibge/sp/renda.csv, de censo-extrair-sp.mjs): pessoas
 * responsáveis (V06001) e rendimento nominal médio (V06004) e mediano (V06006) mensal dos responsáveis com
 * rendimento. Áreas de ponderação: malha e tabela de correspondência do IBGE (dados-brutos/ibge/malhas-sp).
 * Geração distribuída solar: relação de empreendimentos da ANEEL (só campos agregáveis, sem nomes nem CPF).
 *
 * Sigilo: o IBGE troca por "X" os valores de renda dos setores pequenos. Esses setores ficam como "sem
 * informação" (hachura) e saem das médias por área de ponderação e por município; nunca valem zero.
 */
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';
import { RAIZ, BRUTOS, linhasCsv, lerGpkg, gravarCache, gravarGpkg, gravarCsv, zipar, tamanho, mb, soma, simplificar, pontoInterno } from '../lib/dados.mjs';
import { lerInfo, lerGeo, gradeTema, tabelaCenso, basico } from '../lib/setores-sp.mjs';
import { NOME_MUN, RGINT_MUN, NOME_RGINT, malhaMunicipios, camadasReferencia, baseJanela } from '../lib/cruzamentos.mjs';
import { estiloCategorias, estiloGraduado } from '../lib/estilos-qgis.mjs';

const MAPAS = join(RAIZ, 'mapas');
const PASTA = { setores: '060-renda-mediana-sp', apond: '061-renda-na-metropole-sp', solar: '062-renda-e-solar-sp' };
const ANEEL_GD = join(RAIZ, 'scripts', 'colecoes', 'cache', 'downloads', 'aneel_gd', 'empreendimento-geracao-distribuida.csv');

/** Salário mínimo de 2022, referência do Censo (R$). */
const SM = 1212;
const LIM_SM = [1, 1.5, 2, 3, 5];
const CORES_RENDA = ['#f3ece4', '#e2cfc9', '#c9a7ae', '#a67d92', '#7a5474', '#4b2f4f'];
const ROT_SM = (en) => (en ? ['up to 1', '1 to 1.5', '1.5 to 2', '2 to 3', '3 to 5', 'over 5'] : ['até 1', '1 a 1,5', '1,5 a 2', '2 a 3', '3 a 5', 'mais de 5']);
/** Classe (1..n) pelos limites superiores, fechados à direita (até 1 SM inclui o próprio salário mínimo). */
const classe = (v, lim) => { let i = 0; while (i < lim.length && v > lim[i] + 1e-9) i++; return i + 1; };
const r1 = (v) => Math.round(v * 10) / 10;
const r2 = (v) => Math.round(v * 100) / 100;
const leve = (fc) => fc.map((f) => ({ ...f, geometry: { type: f.geometry.type, coordinates: JSON.parse(JSON.stringify(f.geometry.coordinates), (k, v) => (typeof v === 'number' ? Math.round(v * 1e4) / 1e4 : v)) } }));

/* ------------------------------------------------------------------ dados por setor */
async function setores() {
  const r = await tabelaCenso('renda', ['V06001', 'V06004', 'V06006']);
  const d1 = await tabelaCenso('domicilio1', ['V00001']);
  const b = await basico();
  const out = new Map();
  for (const [cd, bb] of b) {
    const o = r.get(cd);
    const dppo = d1.get(cd)?.V00001 ?? 0;
    // Sem linha de renda: setor sem domicílio ocupado (conferido: nenhum deles tem DPO).
    out.set(cd, {
      cd, b: bb, dppo,
      resp: o ? o.V06001 : 0, media: o ? o.V06004 : null, mediana: o ? o.V06006 : null,
      vazio: !o || !(bb.dpo > 0),
    });
  }
  return out;
}

/* ------------------------------------------------------------------ 060 renda mediana por setor */
async function renda(S) {
  const info = lerInfo();
  const geo = lerGeo();
  const cls = new Map();
  for (const [cd, s] of S) cls.set(cd, s.vazio ? 0 : s.mediana === null ? null : classe(s.mediana / SM, LIM_SM));
  gradeTema('grade-renda-solar-sp-mediana', (cd) => { const c = cls.get(cd); return c === undefined ? null : c === null ? 254 : c === 0 ? 253 : c; });
  const resp = new Array(6).fill(0), set = new Array(6).fill(0), pes = new Array(6).fill(0);
  const semInfo = [];
  let semInfoPes = 0, vazios = 0;
  const porRg = new Map(), porMun = new Map();
  for (const [cd, c] of cls) {
    const s = S.get(cd);
    if (c === 0) { vazios++; continue; }
    if (c === null) { semInfo.push(cd); semInfoPes += s.b.pessoas ?? 0; continue; }
    resp[c - 1] += s.resp; set[c - 1]++; pes[c - 1] += s.b.pessoas ?? 0;
    const rg = RGINT_MUN.get(s.b.CD_MUN);
    if (!porRg.has(rg)) porRg.set(rg, new Array(6).fill(0));
    porRg.get(rg)[c - 1] += s.resp;
    if (!porMun.has(s.b.CD_MUN)) porMun.set(s.b.CD_MUN, new Array(6).fill(0));
    porMun.get(s.b.CD_MUN)[c - 1] += s.resp;
  }
  const totResp = soma(resp);
  const rg = [...porRg].map(([k, v]) => ({ CD_RGINT: k, NM_RGINT: NOME_RGINT.get(k), resp: soma(v), ate1: v[0], ate15: v[0] + v[1], acima5: v[5], pct_ate15: (100 * (v[0] + v[1])) / soma(v), pct_acima5: (100 * v[5]) / soma(v) }))
    .sort((a, z) => z.pct_ate15 - a.pct_ate15);
  const mun = [...porMun].map(([k, v]) => ({ CD_MUN: k, NM_MUN: NOME_MUN.get(k), resp: soma(v), ate15: v[0] + v[1], acima5: v[5], pct_ate15: (100 * (v[0] + v[1])) / soma(v), pct_acima5: (100 * v[5]) / soma(v) }));
  const com = [...S.values()].filter((s) => !s.vazio && s.mediana !== null);
  const topo = com.sort((a, z) => z.mediana - a.mediana)[0];
  const c = {
    sm: SM, lim: LIM_SM, cores: CORES_RENDA, resp, setores: set, pessoas: pes, tot_resp: totResp,
    sem_info: semInfo.length, sem_info_pessoas: semInfoPes, vazios, n_setores: S.size,
    rgint: rg,
    pobres_mun: mun.filter((m) => m.resp >= 10000).sort((a, z) => z.pct_ate15 - a.pct_ate15).slice(0, 6),
    ricos_mun: mun.filter((m) => m.resp >= 10000).sort((a, z) => z.pct_acima5 - a.pct_acima5).slice(0, 6),
    ate15_abs: mun.sort((a, z) => z.ate15 - a.ate15).slice(0, 6),
    topo: { CD_MUN: topo.b.CD_MUN, NM_MUN: topo.b.NM_MUN, bairro: topo.b.NM_BAIRRO, mediana: topo.mediana, pt: info[topo.cd]?.pt },
    n_iguais_sm: com.filter((s) => s.mediana === SM).length,
    semInfoFeats: leve(semInfo.map((cd) => geo[cd]).filter(Boolean).map((g) => ({ type: 'Feature', properties: {}, geometry: g }))),
  };
  gravarCache('renda-solar-sp-setores', c);
  console.log('setores', { resp, set, totResp, semInfo: semInfo.length, semInfoPes, vazios, topo: c.topo, iguais: c.n_iguais_sm });
  console.log(' rgint', rg.map((x) => `${x.NM_RGINT} ${x.pct_ate15.toFixed(1)} / ${x.pct_acima5.toFixed(1)}`).join(' | '));
  console.log(' pobres', c.pobres_mun.map((m) => `${m.NM_MUN} ${m.pct_ate15.toFixed(1)}`).join(', '));
  console.log(' ricos', c.ricos_mun.map((m) => `${m.NM_MUN} ${m.pct_acima5.toFixed(1)}`).join(', '));
  return cls;
}

/* ------------------------------------------------------------------ 061 renda por área de ponderação */
const CONCURB = ['3550308', '3548500']; // concentrações urbanas de São Paulo e de Santos (IBGE)
const LIM_AP = [1.5, 2, 3, 5, 8];
async function apond(S) {
  const dePara = new Map();
  let cab = null;
  for await (const l of linhasCsv(join(BRUTOS, 'ibge', 'malhas-sp', 'DePara_SetorCensit22xAPOND22_35_SP.csv'))) {
    if (!cab) { cab = l; continue; }
    dePara.set(l[0], l[1]);
  }
  const ag = new Map();
  let semAp = 0;
  for (const [cd, s] of S) {
    const ap = dePara.get(cd);
    if (!ap) { if (!s.vazio) semAp++; continue; }
    if (!ag.has(ap)) ag.set(ap, { resp: 0, soma: 0, resp_sem_info: 0, pessoas: 0, setores: 0, setores_sem_info: 0, bairros: new Map() });
    const a = ag.get(ap);
    a.setores++;
    a.pessoas += s.b.pessoas ?? 0;
    // Lugar: o bairro; sem bairro (a capital não tem), o distrito, quando não é o próprio município.
    const lugar = s.b.NM_BAIRRO ?? (s.b.NM_DIST && s.b.NM_DIST !== s.b.NM_MUN ? s.b.NM_DIST : null);
    if (lugar) a.bairros.set(lugar, (a.bairros.get(lugar) ?? 0) + (s.b.pessoas ?? 0));
    if (s.vazio) continue;
    if (s.media === null || s.resp === null) { a.setores_sem_info++; continue; }
    a.resp += s.resp; a.soma += s.resp * s.media;
  }
  const feats = await lerGpkg(join(BRUTOS, 'ibge', 'malhas-sp', 'APONDs2022_35_SP.gpkg'));
  const conc = new Set([...S.values()].filter((s) => CONCURB.includes(s.b.CD_CONCURB)).map((s) => s.b.CD_MUN));
  const linhas = [], geoms = [];
  for (const f of feats) {
    const p = f.properties;
    const a = ag.get(p.cd_apond);
    const bairro = a && a.bairros.size ? [...a.bairros].sort((x, z) => z[1] - x[1])[0][0] : null;
    const media = a && a.resp ? a.soma / a.resp : null;
    const l = {
      CD_APOND: p.cd_apond, CD_MUN: p.CD_MUN, NM_MUN: p.NM_MUN, bairro_principal: bairro, area_km2: r2(p.AREA_KM2),
      setores: a?.setores ?? 0, setores_sem_info: a?.setores_sem_info ?? 0, pessoas: a?.pessoas ?? 0, responsaveis: a?.resp ?? 0,
      renda_media: media === null ? null : Math.round(media), renda_media_sm: media === null ? null : r2(media / SM),
      classe: media === null ? null : classe(media / SM, LIM_AP), concentracao: conc.has(p.CD_MUN) ? 1 : 0,
    };
    linhas.push(l);
    geoms.push(simplificar(f.geometry, 0.0001));
  }
  const nAp = new Map();
  for (const l of linhas) nAp.set(l.CD_MUN, (nAp.get(l.CD_MUN) ?? 0) + 1);
  const comMedia = linhas.filter((l) => l.renda_media !== null);
  const naJanela = comMedia.filter((l) => l.concentracao);
  const ord = [...naJanela].sort((a, z) => z.renda_media - a.renda_media);
  // Distância dentro de cada município com várias áreas: a mais rica sobre a mais pobre.
  const dentro = [...nAp].filter(([, n]) => n >= 5).map(([cd, n]) => {
    const ls = comMedia.filter((l) => l.CD_MUN === cd).sort((a, z) => z.renda_media - a.renda_media);
    const rico = ls[0], pobre = ls.at(-1);
    return { CD_MUN: cd, NM_MUN: NOME_MUN.get(cd), n, rico: { b: rico.bairro_principal, v: rico.renda_media, ap: rico.CD_APOND }, pobre: { b: pobre.bairro_principal, v: pobre.renda_media, ap: pobre.CD_APOND }, razao: rico.renda_media / pobre.renda_media };
  }).sort((a, z) => z.razao - a.razao);
  const respCl = new Array(LIM_AP.length + 1).fill(0), apCl = new Array(LIM_AP.length + 1).fill(0);
  for (const l of naJanela) { respCl[l.classe - 1] += l.responsaveis; apCl[l.classe - 1]++; }
  const pt = (cd) => { const i = linhas.findIndex((l) => l.CD_APOND === cd); return pontoInterno(geoms[i]); };
  const base = baseJanela('renda-solar-sp-metropole', 'SP', [...conc], { oceano: [-46.2, -24.25], passo: 0.25, folga: 0.06 });
  const c = {
    sm: SM, lim: LIM_AP, n_apond: linhas.length, n_janela: naJanela.length, n_mun_janela: conc.size, sem_ap: semAp,
    resp_cl: respCl, ap_cl: apCl, tot_resp: soma(respCl), pessoas_janela: soma(naJanela.map((l) => l.pessoas)),
    rico: { ...ord[0], pt: pt(ord[0].CD_APOND) }, pobre: { ...ord.at(-1), pt: pt(ord.at(-1).CD_APOND) },
    ricos: ord.slice(0, 6).map((l) => ({ NM_MUN: l.NM_MUN, b: l.bairro_principal, v: l.renda_media })),
    pobres: ord.slice(-6).reverse().map((l) => ({ NM_MUN: l.NM_MUN, b: l.bairro_principal, v: l.renda_media })),
    dentro: dentro.slice(0, 8), mun_varias: dentro.length,
    sp: (() => { const d = dentro.find((x) => x.CD_MUN === '3550308'); return { ...d, rico: { ...d.rico, pt: pt(d.rico.ap) }, pobre: { ...d.pobre, pt: pt(d.pobre.ap) } }; })(),
    apond: naJanela.concat(linhas.filter((l) => l.concentracao && l.renda_media === null)).map((l) => {
      const i = linhas.indexOf(l);
      // k: classe; 0 = sem domicílio ocupado; null = só setores em sigilo.
      return { type: 'Feature', properties: { k: l.classe ?? (l.setores_sem_info ? null : 0) }, geometry: geoms[i] };
    }),
    janela: base.janela,
  };
  c.n_sem_dom = c.apond.filter((f) => f.properties.k === 0).length;
  c.n_sigilo = c.apond.filter((f) => f.properties.k === null).length;
  c.apond = leve(c.apond);
  gravarCache('renda-solar-sp-apond', c);
  const qs = [...comMedia].map((l) => l.renda_media_sm).sort((a, z) => a - z);
  console.log('apond', { semDom: c.n_sem_dom, sigilo: c.n_sigilo, n: linhas.length, janela: naJanela.length, mun: conc.size, semAp, respCl, apCl, q: [0.1, 0.25, 0.5, 0.75, 0.9].map((q) => qs[Math.floor(q * qs.length)]) });
  console.log(' rico', c.rico.NM_MUN, c.rico.bairro_principal, c.rico.renda_media, '| pobre', c.pobre.NM_MUN, c.pobre.bairro_principal, c.pobre.renda_media);
  console.log(' dentro', c.dentro.map((d) => `${d.NM_MUN} (${d.n}) ${d.razao.toFixed(1)}× ${d.rico.b}/${d.pobre.b}`).join(' | '));
  return { linhas, geoms };
}

/* ------------------------------------------------------------------ 062 renda × solar residencial por município */
const BIV = [
  ['#efede6', '#c9c7d6', '#8f86ad'],
  ['#ead7a8', '#c3b29b', '#86728f'],
  ['#d9a441', '#ae8545', '#6b4e55'],
]; // [solar 1..3][renda 1..3]
async function solar(S) {
  // Renda média do responsável por município: média dos setores com informação, ponderada pelos responsáveis.
  const m = new Map();
  for (const s of S.values()) {
    const cd = s.b.CD_MUN;
    if (!m.has(cd)) m.set(cd, { dppo: 0, resp: 0, soma: 0, pessoas: 0 });
    const o = m.get(cd);
    o.dppo += s.dppo ?? 0; o.pessoas += s.b.pessoas ?? 0;
    if (!s.vazio && s.media !== null && s.resp !== null) { o.resp += s.resp; o.soma += s.resp * s.media; }
  }
  let cab = null, ref = null;
  const gd = new Map();
  let tot = { n: 0, kw: 0, remoto: 0 };
  for await (const c of linhasCsv(ANEEL_GD, { zip: true })) {
    if (!cab) { cab = c; continue; }
    const o = Object.fromEntries(cab.map((k, i) => [k, c[i]]));
    if (o.SigUF !== 'SP' || o.SigTipoGeracao !== 'UFV' || o.DscClasseConsumo !== 'Residencial') continue;
    ref ??= o.AnmPeriodoReferencia;
    const cd = o.CodMunicipioIbge;
    if (!gd.has(cd)) gd.set(cd, { n: 0, kw: 0 });
    const kw = Number(o.MdaPotenciaInstaladaKW.replace(/\./g, '').replace(',', '.'));
    gd.get(cd).n++; gd.get(cd).kw += kw;
    tot.n++; tot.kw += kw;
    if (/remoto/i.test(o.DscModalidadeHabilitado)) tot.remoto++;
  }
  const linhas = [...NOME_MUN].map(([cd, nome]) => {
    const o = m.get(cd) ?? { dppo: 0, resp: 0, soma: 0, pessoas: 0 };
    const g = gd.get(cd) ?? { n: 0, kw: 0 };
    return {
      CD_MUN: cd, NM_MUN: nome, pessoas: o.pessoas, dppo: o.dppo, responsaveis: o.resp,
      renda_media: o.resp ? Math.round(o.soma / o.resp) : null, renda_media_sm: o.resp ? r2(o.soma / o.resp / SM) : null,
      solar_sistemas: g.n, solar_kw: r1(g.kw),
      sistemas_100_dom: o.dppo ? r2((100 * g.n) / o.dppo) : null, w_por_dom: o.dppo ? Math.round((1000 * g.kw) / o.dppo) : null,
    };
  });
  const terc = (vs) => { const s = [...vs].sort((a, z) => a - z); return [s[Math.floor(s.length / 3)], s[Math.floor((2 * s.length) / 3)]]; };
  const tR = terc(linhas.map((l) => l.renda_media_sm)), tS = terc(linhas.map((l) => l.sistemas_100_dom));
  const t3 = (v, t) => (v <= t[0] ? 1 : v <= t[1] ? 2 : 3);
  for (const l of linhas) { l.terco_renda = t3(l.renda_media_sm, tR); l.terco_solar = t3(l.sistemas_100_dom, tS); l.grupo = `${l.terco_solar}${l.terco_renda}`; }
  // Correlação de postos (Spearman) entre renda e adoção.
  const posto = (k) => { const o = [...linhas].sort((a, z) => a[k] - z[k]); const p = new Map(); o.forEach((l, i) => p.set(l.CD_MUN, i)); return p; };
  const pr = posto('renda_media_sm'), ps = posto('sistemas_100_dom');
  const n = linhas.length;
  const rho = 1 - (6 * soma(linhas.map((l) => (pr.get(l.CD_MUN) - ps.get(l.CD_MUN)) ** 2))) / (n * (n * n - 1));
  const grupos = {};
  for (const l of linhas) { grupos[l.grupo] ??= { n: 0, dppo: 0, sistemas: 0 }; grupos[l.grupo].n++; grupos[l.grupo].dppo += l.dppo; grupos[l.grupo].sistemas += l.solar_sistemas; }
  const dppoTot = soma(linhas.map((l) => l.dppo));
  // Adoção por faixa de renda do município (quintos de domicílios), para o painel.
  const ordR = [...linhas].sort((a, z) => a.renda_media_sm - z.renda_media_sm);
  const faixas = [];
  let acc = 0, atual = { dppo: 0, sist: 0, n: 0, min: null, max: null };
  for (const l of ordR) {
    atual.dppo += l.dppo; atual.sist += l.solar_sistemas; atual.n++; atual.min ??= l.renda_media_sm; atual.max = l.renda_media_sm;
    acc += l.dppo;
    if (acc >= ((faixas.length + 1) * dppoTot) / 5 - 1 && faixas.length < 4) { faixas.push(atual); atual = { dppo: 0, sist: 0, n: 0, min: null, max: null }; }
  }
  faixas.push(atual);
  const c = {
    sm: SM, ref, tercos_renda: tR, tercos_solar: tS, biv: BIV, rho, grupos, faixas: faixas.map((f) => ({ ...f, por100: (100 * f.sist) / f.dppo })),
    tot: { ...tot, dppo: dppoTot, por100: (100 * tot.n) / dppoTot, kw_medio: tot.kw / tot.n },
    linhas,
    adocao_top: [...linhas].filter((l) => l.dppo >= 5000).sort((a, z) => z.sistemas_100_dom - a.sistemas_100_dom).slice(0, 6),
    abs_top: [...linhas].sort((a, z) => z.solar_sistemas - a.solar_sistemas).slice(0, 6),
    contra: [...linhas].filter((l) => l.grupo === '31').sort((a, z) => z.sistemas_100_dom - a.sistemas_100_dom).slice(0, 6),
    ricos_pouco: [...linhas].filter((l) => l.grupo === '13').sort((a, z) => z.renda_media_sm - a.renda_media_sm).slice(0, 6),
  };
  gravarCache('renda-solar-sp-solar', c);
  console.log('solar', { ref, tot: c.tot, tR, tS, rho: rho.toFixed(3), grupos });
  console.log(' faixas', c.faixas.map((f) => `${f.min}-${f.max} SM: ${f.por100.toFixed(2)} (${f.n} mun)`).join(' | '));
  console.log(' adocao', c.adocao_top.map((l) => `${l.NM_MUN} ${l.sistemas_100_dom} (${l.renda_media_sm} SM)`).join(', '));
  console.log(' abs', c.abs_top.map((l) => `${l.NM_MUN} ${l.solar_sistemas}`).join(', '));
  console.log(' contra (solar alto, renda baixa)', c.contra.map((l) => `${l.NM_MUN} ${l.sistemas_100_dom} (${l.renda_media_sm})`).join(', '));
  console.log(' ricos com pouco', c.ricos_pouco.map((l) => `${l.NM_MUN} ${l.sistemas_100_dom} (${l.renda_media_sm})`).join(', '));
  return c;
}

/* ------------------------------------------------------------------ GeoPackages */
async function gpkgSetores(S, cls) {
  const geo = lerGeo();
  const feats = [];
  for (const [cd, s] of S) {
    const g = geo[cd];
    if (!g) continue;
    const c = cls.get(cd);
    feats.push({ type: 'Feature', geometry: g, properties: {
      CD_SETOR: cd, CD_MUN: s.b.CD_MUN, NM_MUN: s.b.NM_MUN, NM_BAIRRO: s.b.NM_BAIRRO, situacao: s.b.situacao,
      pessoas: s.b.pessoas, responsaveis: s.vazio ? 0 : s.resp, renda_media: s.vazio ? null : s.media, renda_mediana: s.vazio ? null : s.mediana,
      renda_mediana_sm: s.vazio || s.mediana === null ? null : r2(s.mediana / SM), classe_sm: c > 0 ? c : null, sem_domicilio: s.vazio ? 1 : 0,
    } });
  }
  const ref = camadasReferencia();
  const estilos = {
    setores: [['renda_mediana_sm', 'Nº 060 · Rendimento mediano do responsável, em salários mínimos de 2022', estiloCategorias('classe_sm', ROT_SM(false).map((r, i) => [i + 1, `${r} SM`, CORES_RENDA[i]])), true]],
    ...ref.estilos,
  };
  const pasta = join(MAPAS, PASTA.setores, 'dados');
  mkdirSync(pasta, { recursive: true });
  const arq = join(pasta, 'sp_renda_setores_2022.gpkg');
  await gravarGpkg(arq, { setores: { feats, campos: Object.keys(feats[0].properties) }, ...ref.camadas }, estilos);
  const z = zipar(arq);
  console.log(`✓ ${z} · ${mb(tamanho(z))}`);
}

async function gpkgApond({ linhas, geoms }) {
  const feats = linhas.map((l, i) => ({ type: 'Feature', properties: l, geometry: geoms[i] }));
  const ref = camadasReferencia();
  const rot = ['até 1,5 SM', '1,5 a 2 SM', '2 a 3 SM', '3 a 5 SM', '5 a 8 SM', 'mais de 8 SM'];
  const estilos = {
    areas_de_ponderacao: [['renda_media_sm', 'Nº 061 · Rendimento médio do responsável, em salários mínimos de 2022', estiloCategorias('classe', rot.map((r, i) => [i + 1, r, CORES_RENDA[i]])), true]],
    ...ref.estilos,
  };
  const pasta = join(MAPAS, PASTA.apond, 'dados');
  mkdirSync(pasta, { recursive: true });
  const arq = join(pasta, 'sp_renda_apond_2022.gpkg');
  await gravarGpkg(arq, { areas_de_ponderacao: { feats, campos: Object.keys(linhas[0]) }, ...ref.camadas }, estilos);
  const z = zipar(arq);
  const csv = join(pasta, 'sp_renda_apond_2022.csv');
  gravarCsv(csv, linhas);
  console.log(`✓ ${z} · ${mb(tamanho(z))} · CSV ${mb(tamanho(csv))}`);
}

async function gpkgSolar(c) {
  const malha = malhaMunicipios();
  const por = new Map(c.linhas.map((l) => [l.CD_MUN, l]));
  const feats = malha.map((f) => ({ type: 'Feature', properties: por.get(String(f.properties.CD_MUN)), geometry: f.geometry }));
  const ref = camadasReferencia();
  const rotT = (k) => ['baixa', 'média', 'alta'][k - 1];
  const itens = [];
  for (let s = 1; s <= 3; s++) for (let r = 1; r <= 3; r++) itens.push([`${s}${r}`, `solar ${rotT(s)} · renda ${rotT(r)}`, BIV[s - 1][r - 1]]);
  const estilos = {
    municipios: [
      ['renda_e_solar', 'Nº 062 · Renda do responsável × sistemas solares residenciais por domicílio, em terços', estiloCategorias('grupo', itens), true],
      ['solar_por_100_domicilios', 'Nº 062 · Sistemas solares residenciais por 100 domicílios', estiloGraduado('sistemas_100_dom', [1, 2, 4, 6, 10, 100], ['#f6efdc', '#ecd9a6', '#dfbd6c', '#c99a2e', '#9c6f1f', '#5e4314'], { casas: 0 }), false],
      ['renda_media_sm', 'Nº 062 · Rendimento médio do responsável (SM de 2022)', estiloGraduado('renda_media_sm', [1.5, 2, 2.5, 3, 4, 20], CORES_RENDA, { casas: 1 }), false],
    ],
    ...ref.estilos,
  };
  const pasta = join(MAPAS, PASTA.solar, 'dados');
  mkdirSync(pasta, { recursive: true });
  const arq = join(pasta, 'sp_renda_solar.gpkg');
  await gravarGpkg(arq, { municipios: { feats, campos: Object.keys(c.linhas[0]) }, ...ref.camadas }, estilos);
  const z = zipar(arq);
  const csv = join(pasta, 'sp_renda_solar.csv');
  gravarCsv(csv, c.linhas);
  console.log(`✓ ${z} · ${mb(tamanho(z))} · CSV ${mb(tamanho(csv))}`);
}

/* ------------------------------------------------------------------ */
const pedidos = process.argv.slice(2);
const quer = (k) => !pedidos.length || pedidos.includes(k);
const S = await setores();
const cls = quer('setores') || quer('gpkg') ? await renda(S) : null;
const ap = quer('apond') || quer('gpkg') ? await apond(S) : null;
const so = quer('solar') || quer('gpkg') ? await solar(S) : null;
if (quer('gpkg')) { await gpkgSetores(S, cls); await gpkgApond(ap); await gpkgSolar(so); }
