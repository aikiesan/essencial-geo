#!/usr/bin/env node
/**
 * Coleção «Gente no território» (gente-sp) — prepara os dados das pranchas 063 a 066 (uso interno).
 *
 *   node --max-old-space-size=8192 scripts/colecoes/gente-sp/preparar.mjs [densidade|idade|idosos|rural|gpkg ...]
 *
 * Censo 2022: agregados por setor (dados-brutos/ibge/sp: basico e demografia, de censo-extrair-sp.mjs) e
 * tabelas do SIDRA baixadas em dados-brutos/ibge/sidra-sp: 9514 (população por sexo e idade), 9515
 * (índice de envelhecimento, idade mediana e razão de sexo) e 9922 (domicílios e moradores por situação).
 *
 * Sigilo: nos grupos de idade, o IBGE troca por "X" as contagens pequenas do setor. Nos dados de SP não
 * aparece nenhum 1 nem 2 nessas variáveis (o 0, o 3 e o 4 aparecem aos milhares), então um X vale 1 ou 2.
 * O X nunca vira zero: o setor só recebe uma classe quando ela é a mesma com X = 1 e com X = 2.
 */
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, copyFileSync } from 'node:fs';
import { RAIZ, BRUTOS, linhasXlsx, gravarCache, gravarGpkg, gravarCsv, zipar, tamanho, mb, soma } from '../lib/dados.mjs';
import { lerInfo, lerGeo, gradeTema, tabelaCenso, basico } from '../lib/setores-sp.mjs';
import { NOME_MUN, RGINT_MUN, NOME_RGINT, malhaMunicipios, camadasReferencia } from '../lib/cruzamentos.mjs';
import { estiloCategorias, estiloGraduado } from '../lib/estilos-qgis.mjs';

const MAPAS = join(RAIZ, 'mapas');
const PASTA = { densidade: '063-densidade-sp', idade: '064-idade-e-sexo-sp', idosos: '065-idosos-sp', rural: '066-urbano-e-rural-sp' };
const SIDRA = join(BRUTOS, 'ibge', 'sidra-sp');
const IDADES = ['V01031', 'V01032', 'V01033', 'V01034', 'V01035', 'V01036', 'V01037', 'V01038', 'V01039', 'V01040', 'V01041'];
const GRUPOS_IDADE = ['0 a 4', '5 a 9', '10 a 14', '15 a 19', '20 a 24', '25 a 29', '30 a 39', '40 a 49', '50 a 59', '60 a 69', '70 ou mais'];

const LIM_DENS = [10, 100, 1000, 5000, 15000];
const CORES_DENS = ['#f2efe6', '#dcd6bf', '#b9b48f', '#8a8a62', '#5b6142', '#2f3826'];
const LIM_60 = [10, 15, 20, 25, 30];
const CORES_60 = ['#eef2f3', '#cddfe2', '#9ec3c9', '#6b9fab', '#3f7686', '#1f4a5a'];
const classe = (v, lim) => { let i = 0; while (i < lim.length && v > lim[i] + 1e-9) i++; return i + 1; };
const r1 = (v) => Math.round(v * 10) / 10;
const r2 = (v) => Math.round(v * 100) / 100;
const leve = (fc) => fc.map((f) => ({ ...f, geometry: { type: f.geometry.type, coordinates: JSON.parse(JSON.stringify(f.geometry.coordinates), (k, v) => (typeof v === 'number' ? Math.round(v * 1e4) / 1e4 : v)) } }));
const semAcento = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const CD_POR_NOME = new Map([...NOME_MUN].map(([cd, n]) => [semAcento(n), cd]));

/** Linhas de uma planilha do SIDRA (UF e municípios): Map('UF' | CD_MUN → valores numéricos). */
async function sidra(arq, { inicio = 1, uf = 'São Paulo' } = {}) {
  const out = new Map();
  for await (const l of linhasXlsx(join(SIDRA, arq))) {
    const nome = String(l[0] ?? '').trim();
    if (!nome) continue;
    const v = l.slice(inicio).map((x) => (x === '-' ? 0 : /^-?[\d.]+$/.test(String(x).trim()) ? Number(x) : null));
    if (nome === uf) { out.set('UF', v); continue; }
    const m = nome.match(/^(.*) \(SP\)$/);
    if (!m) continue;
    const cd = CD_POR_NOME.get(semAcento(m[1]));
    if (!cd) throw new Error(`município do SIDRA sem código: ${nome}`);
    out.set(cd, v);
  }
  return out;
}

/* ------------------------------------------------------------------ setores */
async function setores() {
  const b = await basico();
  const d = await tabelaCenso('demografia', ['V01006', ...IDADES]);
  const out = new Map();
  for (const [cd, bb] of b) out.set(cd, { cd, b: bb, o: d.get(cd) ?? null });
  return out;
}

/* ------------------------------------------------------------------ 063 densidade */
async function densidade(S) {
  const info = lerInfo();
  const cls = new Map();
  const lista = [];
  for (const [cd, s] of S) {
    const p = s.b.pessoas ?? 0, a = s.b.area ?? info[cd]?.area ?? 0;
    if (!p) { cls.set(cd, 0); continue; }
    const dd = p / a;
    cls.set(cd, classe(dd, LIM_DENS));
    lista.push({ cd, p, a, d: dd, mun: s.b.CD_MUN });
  }
  gradeTema('grade-gente-sp-densidade', (cd) => { const c = cls.get(cd); return c === undefined ? null : c === 0 ? 253 : c; });
  const pes = new Array(6).fill(0), area = new Array(6).fill(0), set = new Array(6).fill(0);
  let areaVazia = 0, nVazios = 0;
  for (const [cd, c] of cls) {
    const s = S.get(cd);
    const a = s.b.area ?? info[cd]?.area ?? 0;
    if (c === 0) { areaVazia += a; nVazios++; continue; }
    pes[c - 1] += s.b.pessoas; area[c - 1] += a; set[c - 1]++;
  }
  const totP = soma(pes), totA = soma(area) + areaVazia;
  // Em quanta área cabe metade (e 90 %) da população, dos setores mais densos para os menos densos.
  lista.sort((a, z) => z.d - a.d);
  const marcos = {};
  let ap = 0, aa = 0;
  for (const l of lista) {
    ap += l.p; aa += l.a;
    for (const q of [0.5, 0.9]) if (!marcos[q] && ap >= q * totP) marcos[q] = { area: aa, pct_area: (100 * aa) / totA, setores: lista.indexOf(l) + 1 };
  }
  const topo = lista[0];
  // Municípios: densidade sobre a área oficial.
  const malha = malhaMunicipios();
  const areaMun = new Map(malha.map((f) => [String(f.properties.CD_MUN), f.properties.AREA_KM2]));
  const popMun = new Map();
  for (const s of S.values()) popMun.set(s.b.CD_MUN, (popMun.get(s.b.CD_MUN) ?? 0) + (s.b.pessoas ?? 0));
  const mun = [...popMun].map(([cd, p]) => ({ CD_MUN: cd, NM_MUN: NOME_MUN.get(cd), pessoas: p, area_km2: areaMun.get(cd), dens: p / areaMun.get(cd) })).sort((a, z) => z.dens - a.dens);
  const c = {
    lim: LIM_DENS, cores: CORES_DENS, pessoas: pes, area, setores: set, area_vazia: areaVazia, n_vazios: nVazios, tot_p: totP, tot_a: totA,
    metade: marcos[0.5], noventa: marcos[0.9], topo: { cd: topo.cd, NM_MUN: NOME_MUN.get(topo.mun), bairro: S.get(topo.cd).b.NM_BAIRRO ?? S.get(topo.cd).b.NM_DIST, d: topo.d, p: topo.p, pt: info[topo.cd]?.pt },
    mun_densos: mun.slice(0, 6), mun_vazios: mun.slice(-6).reverse(), estado: totP / soma(mun.map((m) => m.area_km2)),
  };
  gravarCache('gente-sp-densidade', c);
  console.log('densidade', { pes, area: area.map(Math.round), set, areaVazia: Math.round(areaVazia), nVazios, metade: c.metade, noventa: c.noventa, topo: c.topo, estado: c.estado });
  console.log(' densos', c.mun_densos.map((m) => `${m.NM_MUN} ${Math.round(m.dens)}`).join(', '), '| vazios', c.mun_vazios.map((m) => `${m.NM_MUN} ${m.dens.toFixed(1)}`).join(', '));
  return cls;
}

/* ------------------------------------------------------------------ 065 60 anos ou mais */
async function idosos(S) {
  const geo = lerGeo();
  const cls = new Map();
  const semInfo = [];
  const pes = new Array(6).fill(0), set = new Array(6).fill(0), idosos60 = new Array(6).fill(0);
  let semInfoPes = 0, vazios = 0;
  for (const [cd, s] of S) {
    const o = s.o;
    const tot = o?.V01006;
    if (!o || !s.b.pessoas) { cls.set(cd, 0); vazios++; continue; }
    if (tot === null || tot === undefined) { cls.set(cd, null); semInfo.push(cd); semInfoPes += s.b.pessoas; continue; }
    let lo = 0, hi = 0;
    for (const v of ['V01040', 'V01041']) { const x = o[v]; if (x === null) { lo += 1; hi += 2; } else { lo += x; hi += x; } }
    const a = classe((100 * lo) / tot, LIM_60), z = classe((100 * Math.min(hi, tot)) / tot, LIM_60);
    if (a !== z) { cls.set(cd, null); semInfo.push(cd); semInfoPes += s.b.pessoas; continue; }
    cls.set(cd, a);
    pes[a - 1] += tot; set[a - 1]++; idosos60[a - 1] += lo;
  }
  gradeTema('grade-gente-sp-idosos', (cd) => { const c = cls.get(cd); return c === undefined ? null : c === null ? 254 : c === 0 ? 253 : c; });
  // Totais e regiões: SIDRA 9514 (sem sigilo).
  const t = await sidra('tabela9514_UF_MUN_SP.xlsx', { inicio: 2 });
  const de60 = (v) => soma(v.slice(13, 22)); // 60 a 64 ... 100 ou mais, no bloco Total
  const uf = t.get('UF');
  const mun = [...t].filter(([k]) => k !== 'UF').map(([cd, v]) => ({ CD_MUN: cd, NM_MUN: NOME_MUN.get(cd), pessoas: v[0], de60: de60(v), pct60: (100 * de60(v)) / v[0] }));
  const porRg = new Map();
  for (const m of mun) { const rg = RGINT_MUN.get(m.CD_MUN); if (!porRg.has(rg)) porRg.set(rg, { p: 0, i: 0 }); porRg.get(rg).p += m.pessoas; porRg.get(rg).i += m.de60; }
  const rg = [...porRg].map(([k, v]) => ({ NM_RGINT: NOME_RGINT.get(k), pct60: (100 * v.i) / v.p })).sort((a, z) => z.pct60 - a.pct60);
  const c = {
    lim: LIM_60, cores: CORES_60, pessoas: pes, setores: set, sem_info: semInfo.length, sem_info_pes: semInfoPes, vazios,
    uf: { pessoas: uf[0], de60: de60(uf), pct60: (100 * de60(uf)) / uf[0], de80: soma(uf.slice(17, 22)) },
    mun_velhos: [...mun].sort((a, z) => z.pct60 - a.pct60).slice(0, 6), mun_jovens: [...mun].sort((a, z) => a.pct60 - z.pct60).slice(0, 6),
    abs: [...mun].sort((a, z) => z.de60 - a.de60).slice(0, 3), rgint: rg,
    semInfoFeats: leve(semInfo.map((cd) => geo[cd]).filter(Boolean).map((g) => ({ type: 'Feature', properties: {}, geometry: g }))),
  };
  gravarCache('gente-sp-idosos', c);
  console.log('idosos', { pes, set, semInfo: semInfo.length, semInfoPes, vazios, uf: c.uf });
  console.log(' velhos', c.mun_velhos.map((m) => `${m.NM_MUN} ${m.pct60.toFixed(1)}`).join(', '), '| jovens', c.mun_jovens.map((m) => `${m.NM_MUN} ${m.pct60.toFixed(1)}`).join(', '));
  console.log(' rgint', rg.map((x) => `${x.NM_RGINT} ${x.pct60.toFixed(1)}`).join(' | '));
  return cls;
}

/* ------------------------------------------------------------------ 064 idade mediana, envelhecimento, razão de sexo; 066 urbano e rural */
async function municipios() {
  const ind = await sidra('tabela9515_UF_SP.xlsx');
  const pir = await sidra('tabela9514_UF_MUN_SP.xlsx', { inicio: 2 });
  const sit = await sidra('tabela9922_MUN_35.xlsx');
  const linhas = [...NOME_MUN].map(([cd, nome]) => {
    const i = ind.get(cd), p = pir.get(cd), s = sit.get(cd);
    if (!i || !p || !s) throw new Error(`falta município ${cd} ${nome}`);
    const de60 = soma(p.slice(13, 22)), ate14 = soma(p.slice(1, 4));
    return {
      CD_MUN: cd, NM_MUN: nome, pessoas: p[0], homens: p[22], mulheres: p[44],
      idade_mediana: i[1], indice_envelhecimento: i[0], razao_sexo: i[2],
      ate14: ate14, de60: de60, pct_60_mais: r1((100 * de60) / p[0]),
      dppo: s[0], dppo_urbana: s[1], dppo_rural: s[2], moradores: s[3], moradores_urbana: s[4], moradores_rural: s[5],
      pct_rural: s[3] ? r1((100 * s[5]) / s[3]) : null,
      fora_dppo: p[0] - s[3], pct_fora_dppo: r1((100 * (p[0] - s[3])) / p[0]),
    };
  });
  const uf = { ind: ind.get('UF'), pir: pir.get('UF'), sit: sit.get('UF') };
  const ord = (k, dir = -1) => [...linhas].sort((a, z) => dir * (a[k] - z[k]));
  const c = {
    linhas, uf: {
      indice_envelhecimento: uf.ind[0], idade_mediana: uf.ind[1], razao_sexo: uf.ind[2],
      piramide: { homens: uf.pir.slice(23, 44), mulheres: uf.pir.slice(45, 66) },
      moradores: uf.sit[3], urbana: uf.sit[4], rural: uf.sit[5], pct_rural: (100 * uf.sit[5]) / uf.sit[3],
    },
    mediana_max: ord('idade_mediana').slice(0, 5), mediana_min: ord('idade_mediana', 1).slice(0, 5),
    env_max: ord('indice_envelhecimento').slice(0, 5), env_min: ord('indice_envelhecimento', 1).slice(0, 5),
    sexo_max: ord('razao_sexo').slice(0, 5), sexo_min: ord('razao_sexo', 1).slice(0, 5),
    env_acima100: linhas.filter((l) => l.indice_envelhecimento > 100).length,
    sexo_abaixo100: linhas.filter((l) => l.razao_sexo < 100).length,
    rural_max: ord('pct_rural').slice(0, 6), rural_abs: ord('moradores_rural').slice(0, 6),
    coletivos10: linhas.filter((l) => l.pct_fora_dppo > 10).length, coletivos10_sexo110: linhas.filter((l) => l.pct_fora_dppo > 10 && l.razao_sexo > 110).length,
    sexo110: linhas.filter((l) => l.razao_sexo > 110).length,
    rural_maioria: linhas.filter((l) => l.pct_rural > 50).length, sem_rural: linhas.filter((l) => l.moradores_rural === 0).length,
  };
  // Rural por região intermediária.
  const rg = new Map();
  for (const l of linhas) { const k = RGINT_MUN.get(l.CD_MUN); if (!rg.has(k)) rg.set(k, { m: 0, r: 0 }); rg.get(k).m += l.moradores; rg.get(k).r += l.moradores_rural; }
  c.rural_rgint = [...rg].map(([k, v]) => ({ NM_RGINT: NOME_RGINT.get(k), rural: v.r, pct: (100 * v.r) / v.m })).sort((a, z) => z.pct - a.pct);
  gravarCache('gente-sp-municipios', c);
  const f = (ls, k) => ls.map((l) => `${l.NM_MUN} ${l[k]}`).join(', ');
  console.log('municipios', { uf: { ...c.uf, piramide: undefined }, env_acima100: c.env_acima100, sexo_abaixo100: c.sexo_abaixo100, rural_maioria: c.rural_maioria, sem_rural: c.sem_rural });
  console.log(' mediana', f(c.mediana_max, 'idade_mediana'), '|', f(c.mediana_min, 'idade_mediana'));
  console.log(' envelhec', f(c.env_max, 'indice_envelhecimento'), '|', f(c.env_min, 'indice_envelhecimento'));
  console.log(' sexo', f(c.sexo_max, 'razao_sexo'), '|', f(c.sexo_min, 'razao_sexo'));
  console.log(' rural', f(c.rural_max, 'pct_rural'), '|', f(c.rural_abs, 'moradores_rural'));
  console.log(' rural rgint', c.rural_rgint.map((x) => `${x.NM_RGINT} ${x.pct.toFixed(1)}`).join(' | '));
  return c;
}

/* ------------------------------------------------------------------ GeoPackages */
const ROT_DENS = ['até 10', '10 a 100', '100 a 1.000', '1.000 a 5.000', '5.000 a 15.000', 'mais de 15.000'];
const ROT_60 = ['até 10 %', '10 a 15 %', '15 a 20 %', '20 a 25 %', '25 a 30 %', 'mais de 30 %'];
async function gpkgSetores(S, clsD, clsI) {
  const geo = lerGeo();
  const info = lerInfo();
  const feats = [];
  for (const [cd, s] of S) {
    const g = geo[cd];
    if (!g) continue;
    const o = s.o ?? {};
    const a = s.b.area ?? info[cd]?.area ?? null;
    const p = { CD_SETOR: cd, CD_MUN: s.b.CD_MUN, NM_MUN: s.b.NM_MUN, situacao: s.b.situacao, area_km2: a, pessoas: s.b.pessoas ?? 0, hab_km2: a && s.b.pessoas ? r1(s.b.pessoas / a) : 0 };
    IDADES.forEach((v, i) => { p[`idade_${GRUPOS_IDADE[i].replace(/ /g, '_')}`] = s.o ? o[v] : 0; });
    const d = clsD.get(cd), i = clsI.get(cd);
    p.classe_densidade = d > 0 ? d : null;
    p.classe_60_mais = i > 0 ? i : null;
    feats.push({ type: 'Feature', properties: p, geometry: g });
  }
  const ref = camadasReferencia();
  const estilos = {
    setores: [
      ['densidade', 'Nº 063 · Pessoas por km² no setor', estiloCategorias('classe_densidade', ROT_DENS.map((r, k) => [k + 1, r, CORES_DENS[k]])), true],
      ['60_anos_ou_mais', 'Nº 065 · Pessoas de 60 anos ou mais no setor (%)', estiloCategorias('classe_60_mais', ROT_60.map((r, k) => [k + 1, r, CORES_60[k]])), false],
    ],
    ...ref.estilos,
  };
  const pasta = join(MAPAS, PASTA.densidade, 'dados');
  mkdirSync(pasta, { recursive: true });
  const arq = join(pasta, 'sp_gente_setores_2022.gpkg');
  await gravarGpkg(arq, { setores: { feats, campos: Object.keys(feats[0].properties) }, ...ref.camadas }, estilos);
  const z = zipar(arq);
  console.log(`✓ ${z} · ${mb(tamanho(z))}`);
}

export const CORES_MEDIANA = ['#f1efe6', '#d9dcc4', '#b2bd9c', '#829a76', '#557552', '#2f4d33'];
export const LIM_MEDIANA = [32, 35, 38, 41, 44];
export const CORES_ENV = ['#eef2f3', '#cddfe2', '#9ec3c9', '#6b9fab', '#3f7686', '#1f4a5a'];
export const LIM_ENV = [50, 75, 100, 125, 150];
export const CORES_SEXO = ['#7a5474', '#c9a7ae', '#efe9e4', '#b9cfd6', '#5f8ea0', '#234e70'];
export const LIM_SEXO = [94, 97, 100, 103, 110];
export const CORES_RURAL = ['#f2efe6', '#e6dcb6', '#d0be7f', '#b3964d', '#87692d', '#56411a'];
export const LIM_RURAL = [2, 5, 10, 20, 40];
async function gpkgMunicipios(c) {
  const malha = malhaMunicipios();
  const por = new Map(c.linhas.map((l) => [l.CD_MUN, l]));
  const feats = malha.map((f) => ({ type: 'Feature', properties: por.get(String(f.properties.CD_MUN)), geometry: f.geometry }));
  const ref = camadasReferencia();
  const estilos = {
    municipios: [
      ['idade_mediana', 'Nº 064 · Idade mediana (anos)', estiloGraduado('idade_mediana', [...LIM_MEDIANA, 99], CORES_MEDIANA, { casas: 0, zero: false, inferior: 0 }), true],
      ['indice_envelhecimento', 'Nº 064 · Índice de envelhecimento (65+ por 100 de até 14 anos)', estiloGraduado('indice_envelhecimento', [...LIM_ENV, 1000], CORES_ENV, { casas: 0, zero: false }), false],
      ['razao_sexo', 'Nº 064 · Razão de sexo (homens por 100 mulheres)', estiloGraduado('razao_sexo', [...LIM_SEXO, 1000], CORES_SEXO, { casas: 0, zero: false }), false],
      ['moradores_rurais', 'Nº 066 · Moradores em domicílios rurais (%)', estiloGraduado('pct_rural', [...LIM_RURAL, 100], CORES_RURAL, { casas: 0, sufixo: ' %' }), false],
    ],
    ...ref.estilos,
  };
  const pasta = join(MAPAS, PASTA.idade, 'dados');
  mkdirSync(pasta, { recursive: true });
  const arq = join(pasta, 'sp_gente_municipios_2022.gpkg');
  await gravarGpkg(arq, { municipios: { feats, campos: Object.keys(c.linhas[0]) }, ...ref.camadas }, estilos);
  const z = zipar(arq);
  const csv = join(pasta, 'sp_gente_municipios_2022.csv');
  gravarCsv(csv, c.linhas);
  mkdirSync(join(MAPAS, PASTA.rural, 'dados'), { recursive: true });
  copyFileSync(csv, join(MAPAS, PASTA.rural, 'dados', 'sp_gente_municipios_2022.csv'));
  console.log(`✓ ${z} · ${mb(tamanho(z))} · CSV ${mb(tamanho(csv))}`);
}

/* ------------------------------------------------------------------ */
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const pedidos = process.argv.slice(2);
  const quer = (k) => !pedidos.length || pedidos.includes(k);
  const precisaSetores = quer('densidade') || quer('idosos') || quer('gpkg');
  const S = precisaSetores ? await setores() : null;
  const d = quer('densidade') || quer('gpkg') ? await densidade(S) : null;
  const i = quer('idosos') || quer('gpkg') ? await idosos(S) : null;
  const m = quer('idade') || quer('rural') || quer('gpkg') ? await municipios() : null;
  if (quer('gpkg')) { await gpkgSetores(S, d, i); await gpkgMunicipios(m); }
}
