#!/usr/bin/env node
/**
 * Coleção «Biogás no território» (biogas-territorio-sp) — prepara os dados das pranchas 055 a 059 (uso interno).
 *
 *   node scripts/colecoes/biogas-territorio-sp/preparar.mjs
 *
 * Potencial de biometano: CP2B v5.1 (Unicamp), cenário de referência, nível N4 (acessível), em m³/dia.
 * População: Censo 2022 (soma dos setores). Área: Malha Municipal 2025 do IBGE.
 * Infraestrutura: EPE WebMap, na versão da base de infraestrutura do MapBiomas (gasodutos de transporte e de
 * distribuição, pontos de entrega de gás, linhas de transmissão e subestações existentes).
 * Biometano em operação: ANP, painel de biometano (instalações que informaram produção em 04/2026).
 * Geração distribuída a biogás: ANEEL, relação de empreendimentos de GD (dados abertos, 10/2026), por município.
 *
 * As distâncias são medidas do ponto interno de cada município (perto do centro do polígono) até a
 * infraestrutura mais próxima, em linha reta. Nada aqui estima potencial: só junta, mede e agrega.
 */
import { join } from 'node:path';
import { mkdirSync, readFileSync } from 'node:fs';
import { RAIZ, linhasCsv, lerCsv, lerShp, gravarCache, gravarGpkg, gravarCsv, zipar, tamanho, mb, kb, soma, quebras, simplificar, segmentos, distanciaKm, distanciaPontosKm, comprimentoKm, pontoInterno, caixa, dentro } from '../lib/dados.mjs';
import { basico } from '../lib/setores-sp.mjs';
import { NOME_MUN, SP, DADOS_CP2B, malhaMunicipios, camadasReferencia, cp2b } from '../lib/cruzamentos.mjs';
import { estiloCategorias, estiloGraduado, estiloRegras, estiloLinha, linha, marcador, preenchimento } from '../lib/estilos-qgis.mjs';

const SERIE = JSON.parse(readFileSync(join(RAIZ, 'scripts', 'colecoes', 'biogas-territorio-sp', 'serie.json'), 'utf8'));
const PASTA_DADOS = join(RAIZ, 'mapas', SERIE[0].pasta, 'dados');
const INFRA = join(DADOS_CP2B, 'shapefiles', 'mapbiomas_infra');
const ANP = 'A:/Pilar-2b/analysis/data/05c_anp_biometano_plants_latest.csv';
const ANEEL_GD = join(RAIZ, 'scripts', 'colecoes', 'cache', 'downloads', 'aneel_gd', 'empreendimento-geracao-distribuida.csv');

const r1 = (v) => Math.round(v * 10) / 10;
const r3 = (v) => Math.round(v * 1000) / 1000;
const semAcento = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z ]/g, ' ').replace(/\s+/g, ' ').trim();

/* ------------------------------------------------------------------ substratos fora da cana (056) */
export const FONTES = [
  ['graos', ['PALHA_MILHO', 'PALHA_SOJA'], '#d9a441', 'palha de milho e soja', 'maize and soy straw'],
  ['citros', ['BAGACO_CITROS'], '#e07b39', 'bagaço de laranja', 'orange bagasse'],
  ['cafe', ['CASCA_CAFE'], '#7a5230', 'casca de café', 'coffee husk'],
  ['aves', ['AVES_CORTE', 'AVES_POSTURA'], '#9c4a32', 'aves de corte e postura', 'broilers and layers'],
  ['bovinos', ['BOV_LEITE', 'BOV_CONFINADO', 'BOV_PASTO_MISTO'], '#6b3d5c', 'bovinos de leite e confinados', 'dairy and feedlot cattle'],
  ['suinos', ['SUINOS'], '#c9879a', 'suínos', 'pigs'],
  ['lixo', ['RSU_ORGANICO', 'PODA_URBANA'], '#234e70', 'lixo orgânico e poda urbana', 'organic waste and tree pruning'],
  ['esgoto', ['LODO_ETE'], '#5f9fb5', 'lodo de esgoto', 'sewage sludge'],
];

/** Faixas de distância (km) usadas nas pranchas 057 e 058. */
export const FAIXAS_KM = [10, 25, 50];
const faixa = (d) => { let i = 0; while (i < FAIXAS_KM.length && d > FAIXAS_KM[i]) i++; return i; };

/* ------------------------------------------------------------------ infraestrutura */
function infra() {
  const sp = SP.limite.features[0].geometry;
  const [x0, y0, x1, y1] = caixa(sp);
  const m = 0.6; // margem em graus: a rede logo além da divisa também serve
  const perto = (g) => { const [a, b, c, d] = caixa(g); return c >= x0 - m && a <= x1 + m && d >= y0 - m && b <= y1 + m; };
  const noSp = ([x, y]) => dentro([x, y], sp);
  const tocaSp = (g) => (g.type === 'LineString' ? [g.coordinates] : g.coordinates).some((l) => l.some((p) => noSp(p)));
  const linhas = (feats, tol) => feats.filter((f) => perto(f.geometry)).map((f) => ({ ...f, geometry: simplificar(f.geometry, tol) }));

  const transporte = linhas(lerShp(join(INFRA, 'structure_transportation_gas_pipeline', 'gasoduto-transporte.shp')), 0.0003)
    .filter((f) => /existente/i.test(f.properties['situação'] ?? f.properties.situacao ?? 'Existente'))
    .map((f) => ({ ...f, properties: { nome: f.properties.Nome_Dut_1, transportadora: f.properties.Transporta, diametro_pol: f.properties.Diam_Pol_x, extensao_km: f.properties.COMPRIM_KM, em_sp: 0 } }));
  const distribuicao = linhas(lerShp(join(INFRA, 'structure_distribution_gas_pipeline', 'gasoduto-distribuicao.shp')), 0.0003)
    .map((f) => ({ ...f, properties: { distribuidora: f.properties.Distrib, uf: f.properties.UF, fonte: f.properties.Fonte?.trim(), em_sp: 0 } }));
  const entrega = lerShp(join(INFRA, 'structure_gas_delivery_point', 'PONTOS_ENTREGA.shp'))
    .filter((f) => perto(f.geometry) && /existente/i.test(f.properties.Classifica ?? ''))
    .map((f) => ({ ...f, properties: { nome: f.properties.Nome, municipio: f.properties.Municipio, uf: f.properties.Estado, transportadora: f.properties.Transporta, segmento: f.properties.Segmento, em_sp: 0 } }));
  const lt = linhas(lerShp(join(INFRA, 'structure_transmission_line', 'LT_EXISTENTE.shp')), 0.0003)
    .map((f) => ({ ...f, properties: { nome: f.properties.Nome, concessionaria: f.properties.Concession, tensao_kv: Number(f.properties.Tensao), ano: Number(f.properties.Ano_Opera) || null, em_sp: 0 } }));
  const se = lerShp(join(INFRA, 'structure_substation', 'SE_EXISTENTE.shp'))
    .filter((f) => perto(f.geometry))
    .map((f) => ({ ...f, properties: { nome: f.properties.Nome, concessionaria: f.properties.Concession, tensao: f.properties.Tensao, ano: Number(f.properties.Ano_Opera) || null, em_sp: 0 } }));
  for (const f of [...transporte, ...distribuicao, ...lt]) f.properties.em_sp = tocaSp(f.geometry) ? 1 : 0;
  for (const f of [...entrega, ...se]) f.properties.em_sp = noSp(f.geometry.coordinates) ? 1 : 0;
  const emSp = (fs) => fs.filter((f) => f.properties.em_sp);
  // Comprimento dentro de SP: só os segmentos com as duas pontas no estado (aproximação de recorte).
  const kmSp = (fs) => comprimentoKm(fs.map((f) => ({ geometry: { type: 'MultiLineString', coordinates: (f.geometry.type === 'LineString' ? [f.geometry.coordinates] : f.geometry.coordinates).flatMap((l) => { const out = []; for (let i = 1; i < l.length; i++) if (noSp(l[i - 1]) && noSp(l[i])) out.push([l[i - 1], l[i]]); return out; }) } })));
  const resumo = {
    transporte: { trechos: emSp(transporte).length, km: Math.round(kmSp(transporte)) },
    distribuicao: { distribuidoras: [...new Set(emSp(distribuicao).map((f) => f.properties.distribuidora))], km: Math.round(kmSp(distribuicao)) },
    entrega: emSp(entrega).length,
    lt: { linhas: emSp(lt).length, km: Math.round(kmSp(lt)) },
    se: emSp(se).length,
  };
  return { transporte, distribuicao, entrega, lt, se, resumo };
}

/* ------------------------------------------------------------------ ANP e ANEEL */
async function biometanoAnp(cdPorNome) {
  const linhas = await lerCsv(ANP, { sep: ',' });
  const ult = linhas.filter((l) => l.uf === 'SP').map((l) => l.mesano).sort((a, b) => b.split('/').reverse().join('').localeCompare(a.split('/').reverse().join('')))[0];
  return linhas.filter((l) => l.uf === 'SP' && l.mesano === ult).map((l) => {
    const cd = cdPorNome.get(semAcento(l.municipio));
    if (!cd) throw new Error(`município da ANP sem código: ${l.municipio}`);
    return {
      CD_MUN: cd, NM_MUN: NOME_MUN.get(cd), razao_social: l.razao_social.trim(), cnpj: l.cnpj,
      capacidade_m3d: Number(l.cap_biometano_m3d), biogas_processado_m3d: Number(l.vol_biogas_m3d), capacidade_biogas_m3d: Number(l.cap_biogas_m3d),
      utilizacao_pct: Number(l.util_pct), referencia: l.mesano,
    };
  });
}

const FONTE_GD = { 'Biogás - RA': 'residuos_animais', 'Biogás - RU': 'residuos_urbanos', 'Biogás-AGR': 'agroindustrial', 'Biogás - Floresta': 'florestal' };
async function gdBiogas() {
  let cab = null, ref = null;
  const por = new Map();
  for await (const c of linhasCsv(ANEEL_GD, { zip: true })) {
    if (!cab) { cab = c; continue; }
    const o = Object.fromEntries(cab.map((k, i) => [k, c[i]]));
    if (o.SigUF !== 'SP' || o.SigTipoGeracao !== 'UTE' || !/^Biog/.test(o.DscFonteGeracao)) continue;
    ref ??= o.AnmPeriodoReferencia;
    const cd = o.CodMunicipioIbge;
    if (!por.has(cd)) por.set(cd, { CD_MUN: cd, NM_MUN: NOME_MUN.get(cd), unidades: 0, potencia_kw: 0, residuos_animais: 0, residuos_urbanos: 0, agroindustrial: 0, florestal: 0 });
    const m = por.get(cd);
    const kw = Number(o.MdaPotenciaInstaladaKW.replace(/\./g, '').replace(',', '.'));
    const k = FONTE_GD[o.DscFonteGeracao];
    if (!k) throw new Error(`fonte de GD sem grupo: ${o.DscFonteGeracao}`);
    m.unidades++; m.potencia_kw += kw; m[k] += kw;
  }
  const out = [...por.values()].map((m) => ({ ...m, potencia_kw: r1(m.potencia_kw), residuos_animais: r1(m.residuos_animais), residuos_urbanos: r1(m.residuos_urbanos), agroindustrial: r1(m.agroindustrial), florestal: r1(m.florestal) }));
  out.ref = ref;
  return out;
}

/* ------------------------------------------------------------------ principal */
const malha = malhaMunicipios();
const b = await basico();
const pop = new Map();
for (const s of b.values()) pop.set(s.CD_MUN, (pop.get(s.CD_MUN) ?? 0) + (s.pessoas ?? 0));
const cp = await cp2b();
const I = infra();
const segTransp = segmentos(I.transporte), segDist = segmentos(I.distribuicao), segLt = segmentos(I.lt);
const ptsEntrega = I.entrega.map((f) => f.geometry.coordinates), ptsSe = I.se.map((f) => f.geometry.coordinates);
const cdPorNome = new Map([...NOME_MUN].map(([cd, n]) => [semAcento(n), cd]));
const anp = await biometanoAnp(cdPorNome);
const gd = await gdBiogas();
const gdPor = new Map(gd.map((m) => [m.CD_MUN, m]));
const anpPor = new Map();
for (const p of anp) anpPor.set(p.CD_MUN, (anpPor.get(p.CD_MUN) ?? 0) + p.capacidade_m3d);

const linhas = [];
const pontoMun = new Map();
for (const f of malha) {
  const cd = String(f.properties.CD_MUN);
  const c = cp.get(cd) ?? { total: 0, cana: 0, lavouras: 0, pecuaria: 0, urbano: 0 };
  const p = pop.get(cd) ?? 0;
  const area = f.properties.AREA_KM2;
  const pt = pontoInterno(f.geometry);
  pontoMun.set(cd, pt);
  const fontes = Object.fromEntries(FONTES.map(([k, subs]) => [k, soma(subs.map((s) => c[s] ?? 0))]));
  const foraCana = soma(Object.values(fontes));
  const lider = foraCana > 0 ? FONTES.reduce((a, z) => (fontes[z[0]] > fontes[a[0]] ? z : a))[0] : null;
  const dT = distanciaKm(pt, segTransp), dD = distanciaKm(pt, segDist);
  linhas.push({
    CD_MUN: cd, NM_MUN: NOME_MUN.get(cd), pessoas: p, area_km2: r3(area),
    biometano_m3d: r1(c.total), cana_m3d: r1(c.cana), lavouras_m3d: r1(c.lavouras), pecuaria_m3d: r1(c.pecuaria), urbano_m3d: r1(c.urbano),
    ...Object.fromEntries(FONTES.map(([k]) => [`${k}_m3d`, r1(fontes[k])])),
    m3d_por_km2: r1(c.total / area), m3d_por_hab: p ? r3(c.total / p) : null,
    fora_da_cana_m3d: r1(foraCana), pct_cana: c.total ? r1((100 * c.cana) / c.total) : null, lider_fora_da_cana: lider,
    km_gasoduto_transporte: r1(dT), km_gasoduto_distribuicao: r1(dD), km_gasoduto: r1(Math.min(dT, dD)),
    km_ponto_entrega: r1(distanciaPontosKm(pt, ptsEntrega)),
    km_subestacao: r1(distanciaPontosKm(pt, ptsSe)), km_linha_transmissao: r1(distanciaKm(pt, segLt)),
    anp_capacidade_m3d: anpPor.get(cd) ?? 0,
    gd_biogas_kw: gdPor.get(cd)?.potencia_kw ?? 0,
  });
}
linhas.sort((a, z) => a.NM_MUN.localeCompare(z.NM_MUN, 'pt-BR'));

// Concentração (055): municípios em ordem de potencial; grupo pela parte acumulada.
const total = soma(linhas.map((l) => l.biometano_m3d));
let acum = 0;
for (const l of [...linhas].sort((a, z) => z.biometano_m3d - a.biometano_m3d)) {
  const antes = acum;
  acum += l.biometano_m3d;
  l.concentracao = l.biometano_m3d === 0 ? null : antes < total * 0.25 ? 1 : antes < total * 0.5 ? 2 : antes < total * 0.75 ? 3 : 4;
}
const curva = [];
acum = 0;
const ordem = [...linhas].sort((a, z) => z.biometano_m3d - a.biometano_m3d);
for (const [i, l] of ordem.entries()) { acum += l.biometano_m3d; curva.push([i + 1, acum / total]); }
const nAte = (q) => curva.find(([, s]) => s >= q)[0];

const comPot = linhas.filter((l) => l.biometano_m3d > 0);
const porFaixa = (campo) => FAIXAS_KM.concat(Infinity).map((_, i) => {
  const ls = linhas.filter((l) => faixa(l[campo]) === i);
  return { municipios: ls.length, m3d: soma(ls.map((l) => l.biometano_m3d)), pessoas: soma(ls.map((l) => l.pessoas)) };
});
const top = (campo, n = 6, f = () => true) => [...linhas].filter(f).sort((a, z) => z[campo] - a[campo]).slice(0, n).map((l) => ({ CD_MUN: l.CD_MUN, NM_MUN: l.NM_MUN, v: l[campo], pessoas: l.pessoas, total: l.biometano_m3d }));
const lideres = Object.fromEntries(FONTES.map(([k]) => [k, linhas.filter((l) => l.lider_fora_da_cana === k).length]));
const totFontes = Object.fromEntries(FONTES.map(([k]) => [k, soma(linhas.map((l) => l[`${k}_m3d`]))]));

const c = {
  versao: cp.versao,
  total, pessoas: soma(linhas.map((l) => l.pessoas)), area: soma(linhas.map((l) => l.area_km2)),
  com_potencial: comPot.length,
  lim_km2: quebras(comPot.map((l) => l.m3d_por_km2), 6),
  lim_hab: quebras(comPot.filter((l) => l.m3d_por_hab !== null).map((l) => l.m3d_por_hab), 6),
  lim_total: quebras(comPot.map((l) => l.biometano_m3d), 6),
  n25: nAte(0.25), n50: nAte(0.5), n75: nAte(0.75), curva: curva.filter(([i]) => i <= 20 || i % 5 === 0 || i === curva.length),
  top_km2: top('m3d_por_km2'), top_hab: top('m3d_por_hab', 6, (l) => l.pessoas > 0),
  top_total: top('biometano_m3d'),
  // 056
  fontes: FONTES.map(([k, , cor, pt, en]) => ({ k, cor, pt, en, m3d: totFontes[k], municipios: lideres[k] })),
  fora_da_cana: soma(Object.values(totFontes)), cana: soma(linhas.map((l) => l.cana_m3d)),
  sem_fora_da_cana: linhas.filter((l) => !l.lider_fora_da_cana).length,
  // 057 / 058
  faixas_km: FAIXAS_KM,
  gas_faixas: porFaixa('km_gasoduto'), entrega_faixas: porFaixa('km_ponto_entrega'),
  se_faixas: porFaixa('km_subestacao'), lt_faixas: porFaixa('km_linha_transmissao'),
  longe_gas: top('biometano_m3d', 6, (l) => l.km_gasoduto > 50).map((t) => ({ ...t, km: linhas.find((l) => l.CD_MUN === t.CD_MUN).km_gasoduto })),
  infra: I.resumo,
  // 059
  anp, gd, gd_ref: gd.ref,
};
const linhasD3 = (fs, campos) => ({ type: 'FeatureCollection', features: fs.map((f) => ({ type: 'Feature', properties: Object.fromEntries(campos.map((k) => [k, f.properties[k]])), geometry: f.geometry })) });
c.desenho = {
  transporte: linhasD3(I.transporte, ['nome']),
  distribuicao: linhasD3(I.distribuicao, ['distribuidora']),
  entrega: I.entrega.map((f) => f.geometry.coordinates),
  lt: linhasD3(I.lt, ['tensao_kv']),
  se: I.se.map((f) => f.geometry.coordinates),
  pontoMun: Object.fromEntries(pontoMun),
};
c.linhas = linhas;
gravarCache('biogas-territorio-sp', c);
console.log({
  total: Math.round(total), pessoas: c.pessoas, com_potencial: c.com_potencial, n25: c.n25, n50: c.n50, n75: c.n75,
  lim_km2: c.lim_km2, lim_hab: c.lim_hab, lim_total: c.lim_total,
  top_km2: c.top_km2.map((t) => `${t.NM_MUN} ${t.v}`), top_hab: c.top_hab.map((t) => `${t.NM_MUN} ${t.v}`),
  fontes: c.fontes.map((f) => `${f.k} ${Math.round(f.m3d)} (${f.municipios} mun.)`), sem_fora: c.sem_fora_da_cana, fora: Math.round(c.fora_da_cana),
  gas: c.gas_faixas, entrega: c.entrega_faixas, se: c.se_faixas, lt: c.lt_faixas, longe_gas: c.longe_gas.map((t) => `${t.NM_MUN} ${Math.round(t.v)} ${t.km}`),
  infra: c.infra, anp: anp.map((p) => `${p.NM_MUN} ${p.capacidade_m3d} ${p.utilizacao_pct}%`), gd_n: soma(gd.map((m) => m.unidades)), gd_kw: soma(gd.map((m) => m.potencia_kw)), gd_mun: gd.length, gd_ref: gd.ref,
});

/* ------------------------------------------------------------------ GeoPackage e CSV */
const CORES_KM2 = ['#eef0e6', '#d5dcc4', '#b3c39c', '#87a374', '#5b7f53', '#2f5d3a'];
const CORES_HAB = ['#f3ecd4', '#e2c98a', '#c99a52', '#a8653a', '#7a3b2c', '#4a2420'];
const CORES_CONC = ['#2f5d3a', '#6f9468', '#b3c39c', '#e3e8d6'];
const CORES_TOTAL = ['#f0f2ea', '#dbe2cf', '#bccaa9', '#93ab7f', '#678a5c', '#3f6a42'];
const ROT_CONC = ['primeiro quarto do potencial', 'segundo quarto', 'terceiro quarto', 'último quarto'];
const FAIXA_FILTRO = (campo) => {
  const lim = [0, ...FAIXAS_KM];
  return lim.map((a, i) => (i < FAIXAS_KM.length ? [`"${campo}" > ${a} AND "${campo}" <= ${FAIXAS_KM[i]}`, `${a} a ${FAIXAS_KM[i]} km`] : [`"${campo}" > ${a}`, `mais de ${a} km`]))
    .map(([f, r], i) => [i === 0 ? `"${campo}" <= ${FAIXAS_KM[0]}` : f, i === 0 ? `até ${FAIXAS_KM[0]} km` : r]);
};
const CORES_FAIXA = ['#2f5d3a', '#87a374', '#d9c27a', '#c08a2e'];
const malhaPor = new Map(malha.map((f) => [String(f.properties.CD_MUN), f.geometry]));
const feats = linhas.map((l) => ({ type: 'Feature', properties: l, geometry: malhaPor.get(l.CD_MUN) }));
const ref = camadasReferencia();
const ptAnp = anp.map((p) => ({ type: 'Feature', properties: p, geometry: { type: 'Point', coordinates: pontoMun.get(p.CD_MUN) } }));
const ptGd = gd.map((m) => ({ type: 'Feature', properties: m, geometry: { type: 'Point', coordinates: pontoMun.get(m.CD_MUN) } }));
const estilos = {
  municipios: [
    ['por_km2', 'Nº 055 · Biometano por km² (m³/dia)', estiloGraduado('m3d_por_km2', c.lim_km2, CORES_KM2, { casas: 0 }), true],
    ['por_habitante', 'Nº 055 · Biometano por habitante (m³/dia)', estiloGraduado('m3d_por_hab', c.lim_hab, CORES_HAB, { casas: 2 }), false],
    ['concentracao', 'Nº 055 · Municípios por quarto do potencial do estado', estiloCategorias('concentracao', ROT_CONC.map((r, i) => [i + 1, r, CORES_CONC[i]])), false],
    ['fora_da_cana', 'Nº 056 · Maior fonte de biometano fora da cana', estiloCategorias('lider_fora_da_cana', FONTES.map(([k, , cor, pt]) => [k, pt, cor])), false],
    ['potencial', 'Nº 057 a 059 · Biometano, CP2B N4 (m³/dia)', estiloGraduado('biometano_m3d', c.lim_total, CORES_TOTAL, { casas: 0 }), false],
    ['distancia_gasoduto', 'Nº 057 · Distância do centro do município ao gasoduto mais próximo', estiloRegras('poligono', FAIXA_FILTRO('km_gasoduto').map(([f, r], i) => [f, r, preenchimento(CORES_FAIXA[i], '#ffffff', 0.05)])), false],
    ['distancia_subestacao', 'Nº 058 · Distância do centro do município à subestação mais próxima', estiloRegras('poligono', FAIXA_FILTRO('km_subestacao').map(([f, r], i) => [f, r, preenchimento(CORES_FAIXA[i], '#ffffff', 0.05)])), false],
  ],
  gasodutos_transporte: [['transporte', 'Gasodutos de transporte', estiloLinha('#6b3d5c', 0.8), true]],
  gasodutos_distribuicao: [['distribuicao', 'Gasodutos de distribuição', estiloLinha('#c08a2e', 0.3), true]],
  pontos_entrega: [['entrega', 'Pontos de entrega de gás', estiloRegras('ponto', [['', 'ponto de entrega', marcador('#6b3d5c', 2, { forma: 'square', borda: '#ffffff' })]]), true]],
  linhas_transmissao: [['tensao', 'Linhas de transmissão por tensão', estiloRegras('linha', [
    ['"tensao_kv" <= 230', 'até 230 kV', linha('#c08a2e', 0.3)],
    ['"tensao_kv" > 230 AND "tensao_kv" <= 440', '345 e 440 kV', linha('#9c4a32', 0.45)],
    ['"tensao_kv" > 440', '500 kV ou mais', linha('#6b3d5c', 0.6)],
  ]), true]],
  subestacoes: [['subestacoes', 'Subestações', estiloRegras('ponto', [['', 'subestação', marcador('#1a1c1e', 1.6)]]), true]],
  plantas_biometano: [['capacidade', 'Plantas de biometano (ANP), por capacidade autorizada', estiloRegras('ponto', [['', 'planta de biometano', marcador('#234e70', 4, { tamanhoExpr: 'coalesce(scale_linear(sqrt("capacidade_m3d"), 0, sqrt(140000), 1, 9), 1)' })]]), true]],
  gd_biogas: [['potencia', 'Geração distribuída a biogás (ANEEL), por município', estiloRegras('ponto', [['', 'GD a biogás', marcador('#9c4a32', 3, { vazado: true, tamanhoExpr: 'coalesce(scale_linear(sqrt("potencia_kw"), 0, sqrt(9000), 1.5, 7), 1.5)' })]]), true]],
  ...ref.estilos,
};
mkdirSync(PASTA_DADOS, { recursive: true });
const arq = join(PASTA_DADOS, 'sp_biogas_territorio.gpkg');
const camposDe = (fs) => Object.keys(fs[0].properties);
await gravarGpkg(arq, {
  municipios: { feats, campos: Object.keys(linhas[0]).concat('concentracao').filter((k, i, a) => a.indexOf(k) === i) },
  gasodutos_transporte: { feats: I.transporte, campos: camposDe(I.transporte) },
  gasodutos_distribuicao: { feats: I.distribuicao, campos: camposDe(I.distribuicao) },
  pontos_entrega: { feats: I.entrega, campos: camposDe(I.entrega) },
  linhas_transmissao: { feats: I.lt, campos: camposDe(I.lt) },
  subestacoes: { feats: I.se, campos: camposDe(I.se) },
  plantas_biometano: { feats: ptAnp, campos: camposDe(ptAnp) },
  gd_biogas: { feats: ptGd, campos: camposDe(ptGd) },
  ...ref.camadas,
}, estilos);
const z = zipar(arq);
const csv = join(PASTA_DADOS, 'sp_biogas_territorio_municipios.csv');
gravarCsv(csv, linhas, Object.keys(linhas[0]).concat('concentracao').filter((k, i, a) => a.indexOf(k) === i));
console.log(`✓ ${z} · ${mb(tamanho(z))} · CSV ${kb(tamanho(csv))}`);
