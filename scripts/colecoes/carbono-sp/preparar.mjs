#!/usr/bin/env node
/**
 * Coleção «Carbono biogênico» (carbono-sp) — prepara os dados das pranchas 089 a 092 (uso interno).
 *
 *   node scripts/colecoes/carbono-sp/preparar.mjs
 *
 * Fontes (dados-brutos/, fora do Git):
 *   anp/etanol/pb-da-etanol/      ANP, Painel Dinâmico de Produtores de Etanol (pb-da-etanol.zip, baixado em 18/10/2026):
 *                                 capacidade autorizada por produtor e mês (m³/d), produção e matéria-prima por UF e mês
 *   semil/Anuario-...-2024.txt    SEMIL, Anuário de Energéticos por Município 2025 (ano base 2024), texto extraído do PDF
 *                                 com `pdftotext -raw -enc UTF-8` (tabelas de gás natural, derivados e CO₂ por município)
 *   CP2B v5.1 (Unicamp)           potencial de biogás e biometano por município e substrato, nível N4, cenário de referência
 *   cache/biogas-territorio-sp    gasodutos de transporte e de distribuição (EPE via MapBiomas), das pranchas 055 a 059
 *
 * Tudo aqui é estimativa: os coeficientes estão em COEF, cada um com a fonte, e os READMEs os repetem.
 */
import { join } from 'node:path';
import { mkdirSync, readFileSync, existsSync, copyFileSync } from 'node:fs';
import { RAIZ, BRUTOS, CACHE, lerCsv, gravarCache, gravarGpkg, gravarCsv, zipar, tamanho, mb, kb, soma, quebras, segmentos, distanciaKm, pontoInterno } from '../lib/dados.mjs';
import { NOME_MUN, RGINT_MUN, NOME_RGINT, SP, DADOS_CP2B, GRUPO_SUBSTRATO, malhaMunicipios, camadasReferencia } from '../lib/cruzamentos.mjs';
import { estiloGraduado, estiloRegras, estiloCategorias, estiloLinha, marcador, preenchimento } from '../lib/estilos-qgis.mjs';

const SERIE = JSON.parse(readFileSync(join(RAIZ, 'scripts', 'colecoes', 'carbono-sp', 'serie.json'), 'utf8'));
const PASTA = Object.fromEntries(SERIE.map((s) => [s.tema, join(RAIZ, 'mapas', s.pasta, 'dados')]));
const ANP = join(BRUTOS, 'anp', 'etanol', 'pb-da-etanol');
const ANUARIO = join(BRUTOS, 'semil', 'Anuario-Energeticos-Municipios-SP-2025-ab2024.txt');

/* ------------------------------------------------------------------ coeficientes */
// Massas molares (IUPAC, pesos atômicos padrão): C 12,011; H 1,008; O 15,999.
const M = { CO2: 44.009, ETANOL: 46.068, CH4: 16.043, METANOL: 32.042, H2: 2.016 };
export const COEF = {
  // Fermentação alcoólica: C6H12O6 → 2 C2H5OH + 2 CO2 (um CO2 por etanol; Kheshgi e Prince, 2005).
  co2_por_kg_etanol: M.CO2 / M.ETANOL, // 0,955 kg/kg
  // Etanol anidro (EAC): massa específica máx. 791,5 kg/m³ e teor de etanol mín. 99,3 % massa (ANP, Res. 907/2022, Tab. 1).
  kg_etanol_por_m3_anidro: 791.5 * 0.993,
  // Etanol hidratado (EHC): 805,2 a 811,2 kg/m³ e 92,5 a 94,6 % massa (ANP, Res. 907/2022): o meio das faixas.
  kg_etanol_por_m3_hidratado: ((805.2 + 811.2) / 2) * ((92.5 + 94.6) / 2 / 100),
  // CO2 a 0 °C e 101,325 kPa (Nm³): 1,977 kg/m³ (NIST Chemistry WebBook; gás real).
  kg_co2_por_nm3: 1.977,
  // Gás natural seco: PCI 8.800 kcal/m³ (EPE, BEN 2025, fatores de conversão); 56.100 kg CO2/TJ (IPCC 2006, v. 2, tab. 1.4).
  kg_co2_por_m3_gas: (8800 * 4.1868e-3) * 56.1e-3, // MJ/m³ × kg/MJ
  // Óleo combustível: PCI 9.590 kcal/kg (BEN); 77.400 kg CO2/TJ (IPCC 2006, residual fuel oil).
  kg_co2_por_kg_oleo: (9590 * 4.1868e-3) * 77.4e-3,
  // Coque de petróleo: PCI 8.390 kcal/kg (BEN); 97.500 kg CO2/TJ (IPCC 2006, petroleum coke).
  kg_co2_por_kg_coque: (8390 * 4.1868e-3) * 97.5e-3,
  // Metanação (Sabatier): CO2 + 4 H2 → CH4 + 2 H2O; metanol: CO2 + 3 H2 → CH3OH + H2O (estequiometria, conversão total).
  t_h2_por_t_co2_metano: (4 * M.H2) / M.CO2,
  t_ch4_por_t_co2: M.CH4 / M.CO2,
  t_h2_por_t_co2_metanol: (3 * M.H2) / M.CO2,
  t_metanol_por_t_co2: M.METANOL / M.CO2,
  // Metano a 0 °C e 101,325 kPa: 0,7168 kg/Nm³.
  kg_ch4_por_nm3: 0.7168,
  // Eletrólise: 55 kWh por kg de H2, hipótese dentro da faixa de 50 a 83 kWh/kg dos eletrolisadores atuais (IRENA, 2020).
  kwh_por_kg_h2: 55,
  // Eletricidade: 1 MWh = 0,086 tep (EPE, BEN), para ler o consumo do Anuário em TWh.
  tep_por_mwh: 0.086,
};
COEF.t_co2_por_m3_anidro = (COEF.kg_etanol_por_m3_anidro * COEF.co2_por_kg_etanol) / 1000;
COEF.t_co2_por_m3_hidratado = (COEF.kg_etanol_por_m3_hidratado * COEF.co2_por_kg_etanol) / 1000;
COEF.nm3_ch4_por_t_co2 = (1000 * COEF.t_ch4_por_t_co2) / COEF.kg_ch4_por_nm3;
COEF.mwh_por_t_co2_metano = COEF.t_h2_por_t_co2_metano * COEF.kwh_por_kg_h2; // t H2 × MWh/t
COEF.mwh_por_t_co2_metanol = COEF.t_h2_por_t_co2_metanol * COEF.kwh_por_kg_h2;

const r1 = (v) => Math.round(v * 10) / 10;
const r0 = (v) => Math.round(v);
const r3 = (v) => Math.round(v * 1000) / 1000;
const semAcento = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z]/g, '');
const CD_POR_NOME = new Map([...NOME_MUN].map(([cd, n]) => [semAcento(n), cd]));
// Grafias das fontes que diferem da Malha Municipal do IBGE.
const APELIDOS = { MOJIMIRIM: 'MOGIMIRIM', EMBU: 'EMBUDASARTES', SAOLUIZDOPARAITINGA: 'SAOLUISDOPARAITINGA', FLORINIA: 'FLORINEA', MOJIGUACU: 'MOGIGUACU', MOJIDASCRUZES: 'MOGIDASCRUZES', EUCLIDESDACUNHA: 'EUCLIDESDACUNHAPAULISTA', LUIZANTONIO: 'LUISANTONIO', SUDMENUCCI: 'SUDMENNUCCI' };
function cdDe(nome) {
  const k = semAcento(nome);
  return CD_POR_NOME.get(k) ?? CD_POR_NOME.get(APELIDOS[k] ?? '') ?? null;
}
const numBr = (s) => (s === '-' ? 0 : Number(String(s).replace(/\./g, '').replace(',', '.')));

/* ------------------------------------------------------------------ 089 dornas: ANP */
const mesAno = (s) => { const [m, a] = s.split('/').map(Number); return a * 100 + m; };
async function etanol() {
  const prod = (await lerCsv(join(ANP, 'Etanol_Produção.csv'), { sep: ',' })).filter((l) => l.Estado === 'São Paulo');
  const cap = [
    ...(await lerCsv(join(ANP, 'Etanol_Capacidade 2018_2020.csv'), { sep: ',' })),
    ...(await lerCsv(join(ANP, 'Etanol_Capacidade 2021_2026.csv'), { sep: ',' })),
  ].filter((l) => l.Estado === 'São Paulo');
  const mp = (await lerCsv(join(ANP, 'Etanol_MatériaPrima.csv'), { sep: ',' })).filter((l) => l.Estado === 'São Paulo');
  const K = Object.keys(prod[0]);
  const kHid = K.find((k) => /Hidratado/.test(k)), kAni = K.find((k) => /Anidro/.test(k));
  const KC = Object.keys(cap[0]);
  const cAni = KC.find((k) => /Anidro/.test(k)), cHid = KC.find((k) => /Hidratado/.test(k));
  const mensal = new Map(prod.map((l) => [mesAno(l['Mês/Ano']), { hid: numBr(l[kHid]), ani: numBr(l[kAni]) }]));
  const semNome = new Set();

  /** Janela de meses [de, ate] (AAAAMM): produção do estado, CO2 e rateio pelas usinas, pela capacidade × meses. */
  function janela(de, ate) {
    const meses = [...mensal.keys()].filter((m) => m >= de && m <= ate).sort((a, b) => a - b);
    const hid = soma(meses.map((m) => mensal.get(m).hid)), ani = soma(meses.map((m) => mensal.get(m).ani));
    const co2 = hid * COEF.t_co2_por_m3_hidratado + ani * COEF.t_co2_por_m3_anidro;
    const usinas = new Map();
    for (const l of cap) {
      const m = mesAno(l['Mês/Ano']);
      if (m < de || m > ate) continue;
      const ca = numBr(l[cAni]), ch = numBr(l[cHid]);
      const cd = cdDe(l['Município']);
      if (!cd) { semNome.add(l['Município']); continue; }
      if (!usinas.has(l.CNPJ)) usinas.set(l.CNPJ, { cnpj: l.CNPJ, razao_social: l['Razão Social'].trim().replace(/\s+/g, ' '), CD_MUN: cd, NM_MUN: NOME_MUN.get(cd), peso: 0, meses: 0, cap_anidro_m3d: 0, cap_hidratado_m3d: 0 });
      const u = usinas.get(l.CNPJ);
      // Capacidade diária da usina = a maior das duas autorizadas (o anidro sai do hidratado, não se somam).
      u.peso += Math.max(ca, ch);
      u.meses++;
      if (m === ate || m >= u.ultimo) { u.ultimo = m; u.cap_anidro_m3d = ca; u.cap_hidratado_m3d = ch; u.razao_social = l['Razão Social'].trim().replace(/\s+/g, ' '); }
    }
    const lista = [...usinas.values()].filter((u) => u.peso > 0);
    const pesoTot = soma(lista.map((u) => u.peso));
    for (const u of lista) { u.parte = u.peso / pesoTot; u.co2_t = u.parte * co2; u.etanol_m3 = u.parte * (hid + ani); }
    const capDia = soma(lista.map((u) => (u.peso / u.meses)));
    return {
      de, ate, meses: meses.length, hidratado_m3: hid, anidro_m3: ani, etanol_m3: hid + ani, co2_t: co2, usinas: lista,
      cap_m3d: capDia, uso: (hid + ani) / (capDia * 365 * (meses.length / 12)),
      mensal: meses.map((m) => ({ m, etanol_m3: mensal.get(m).hid + mensal.get(m).ani, co2_t: mensal.get(m).hid * COEF.t_co2_por_m3_hidratado + mensal.get(m).ani * COEF.t_co2_por_m3_anidro })),
    };
  }
  const safra = janela(202504, 202603);
  const ano2024 = janela(202401, 202412);
  // Matéria-prima na safra (t): cana, melaço, milho, outras.
  const materia = {};
  for (const l of mp) { const m = mesAno(l['Mês/Ano']); if (m < 202504 || m > 202603) continue; materia[l.Produto] = (materia[l.Produto] ?? 0) + numBr(l['Quantidade Processada (t)']); }
  if (semNome.size) throw new Error(`municípios da ANP sem código: ${[...semNome].join(', ')}`);
  return { safra, ano2024, materia };
}

/* ------------------------------------------------------------------ 090 biogás: CP2B */
async function biogas() {
  const arq = join(DADOS_CP2B, 'raw', 'cp2b_potential', '2026', 'cp2b_municipio_substrato_niveis.csv');
  const linhas = await lerCsv(arq, { sep: ',' });
  const out = new Map();
  const fracoes = {};
  let versao = null;
  for (const l of linhas) {
    if (l.scenario !== 'med' || !String(l.ibge_code).startsWith('35')) continue;
    versao ??= l.method_version;
    const cd = String(l.ibge_code);
    const f = Number(l.ch4_fraction_in_biogas);
    const biogasNm3 = Number(l.n4_biogas_eq_nm3_year);
    // O biogás é CH4 + CO2 (traços de N2, H2S e vapor desprezados): o CO2 separado no upgrading é a fração 1 − f.
    const co2Nm3 = biogasNm3 * (1 - f);
    fracoes[l.substrate] = f;
    if (!out.has(cd)) out.set(cd, { biogas_nm3: 0, ch4_nm3: 0, co2_nm3: 0, biometano_nm3: 0, cana: 0, lavouras: 0, pecuaria: 0, urbano: 0 });
    const o = out.get(cd);
    o.biogas_nm3 += biogasNm3; o.ch4_nm3 += Number(l.n4_ch4_nm3_year); o.co2_nm3 += co2Nm3; o.biometano_nm3 += Number(l.n4_biomethane_eq_nm3_year);
    const g = GRUPO_SUBSTRATO[l.substrate];
    if (!g) throw new Error(`substrato sem grupo: ${l.substrate}`);
    o[g] += (co2Nm3 * COEF.kg_co2_por_nm3) / 1000;
  }
  for (const o of out.values()) o.co2_t = (o.co2_nm3 * COEF.kg_co2_por_nm3) / 1000;
  out.versao = versao;
  out.fracoes = fracoes;
  return out;
}

/* ------------------------------------------------------------------ 091 fóssil: Anuário da SEMIL */
function anuario() {
  const txt = readFileSync(ANUARIO, 'utf8').split(/\r?\n/);
  const idx = (re) => txt.findIndex((l) => re.test(l));
  const iGas = idx(/^TABELA Nº 4 /), iDer = idx(/^TABELA Nº 5 /), iCo2 = idx(/^TABELA Nº 9 /);
  if ([iGas, iDer, iCo2].some((i) => i < 0)) throw new Error('Anuário: tabelas não encontradas');
  const INT = '(\\d{1,3}(?:\\.\\d{3})*)';
  const gas = new Map(), der = new Map(), co2 = new Map();
  const semCd = new Set();
  let prefixo = null; // nome quebrado em duas linhas no PDF ("Vargem Grande" / "Paulista 17.394 …")
  const guardar = (mapa, nome, v) => {
    if (/^(Total|Estado de São Paulo|ESTADO SÃO PAULO)/i.test(nome)) return;
    const cd = (prefixo && cdDe(`${prefixo} ${nome}`)) || cdDe(nome);
    prefixo = null;
    if (!cd) { semCd.add(nome); return; }
    mapa.set(cd, v);
  };
  // Gás natural: nome + 7 pares (consumidores, m³): residencial, comercial, industrial, automotivo, cogeração, termogeração, total.
  const reGas = new RegExp(`^(.+?) ${Array(14).fill(INT).join(' ')}$`);
  for (const l of txt.slice(iGas, iDer)) {
    const m = l.match(reGas);
    if (!m) { prefixo = /\d/.test(l) ? null : l.trim(); continue; }
    const v = m.slice(2).map(numBr);
    guardar(gas, m[1], { industrial_m3: v[5], cogeracao_m3: v[9], termogeracao_m3: v[11], total_m3: v[13] });
  }
  // Derivados: nome + 10 colunas: gasolina (L), gasolina de aviação (L), diesel (L), óleo combustível (kg), QAV (L),
  // querosene iluminante (L), GLP (kg), coque (kg), etanol (L), asfalto (kg).
  const reDer = new RegExp(`^(.+?) ${Array(10).fill(INT).join(' ')}$`);
  for (const l of txt.slice(iDer, iCo2)) {
    const m = l.match(reDer);
    if (!m) { prefixo = /\d/.test(l) ? null : l.trim(); continue; }
    const v = m.slice(2).map(numBr);
    guardar(der, m[1], { oleo_kg: v[3], coque_kg: v[7] });
  }
  // CO2 de todos os energéticos fósseis (10³ t/ano): nome + 6 consumos em tep + emissão com decimal.
  const INT0 = '(\\d{1,3}(?:\\.\\d{3})*|-)'; // "-" = zero
  const reCo2 = new RegExp(`^(.+?) ${Array(6).fill(INT0).join(' ')} (\\d{1,3}(?:\\.\\d{3})*(?:,\\d+)?)$`);
  let eletricidadeTep = 0;
  for (const l of txt.slice(iCo2)) {
    const m = l.match(reCo2);
    if (!m) { prefixo = /\d/.test(l) ? null : l.trim(); continue; }
    if (/^Total|^Estado/i.test(m[1])) continue;
    guardar(co2, m[1], { co2_energia_t: numBr(m[8]) * 1000, tep_total: numBr(m[7]) });
    eletricidadeTep += numBr(m[2]);
  }
  if (semCd.size) throw new Error(`municípios do Anuário sem código: ${[...semCd].join(', ')}`);
  // Totais do estado, das tabelas 3, 5 e 7 do próprio Anuário, para conferir a leitura.
  const linhaEstado = (i0, i1) => txt.slice(i0, i1).find((l) => /^Estado de São Paulo /.test(l));
  return { gas, der, co2, eletricidade_tep: eletricidadeTep, conferir: { gas: linhaEstado(idx(/^TABELA Nº 3 /), iGas), co2: linhaEstado(idx(/^TABELA Nº 7 /), iCo2) } };
}

/* ------------------------------------------------------------------ principal */
const malha = malhaMunicipios();
const E = await etanol();
const B = await biogas();
const A = anuario();
const bt = join(CACHE, 'biogas-territorio-sp.json');
if (!existsSync(bt)) throw new Error('falta cache/biogas-territorio-sp.json: rode scripts/colecoes/biogas-territorio-sp/preparar.mjs');
const BT = JSON.parse(readFileSync(bt, 'utf8'));
const segGas = segmentos([...BT.desenho.transporte.features, ...BT.desenho.distribuicao.features]);
const segTransp = segmentos(BT.desenho.transporte.features);

const ponto = new Map(malha.map((f) => [String(f.properties.CD_MUN), pontoInterno(f.geometry)]));
const porMunSafra = new Map(), porMun2024 = new Map();
for (const u of E.safra.usinas) { const o = porMunSafra.get(u.CD_MUN) ?? { n: 0, co2: 0, etanol: 0 }; o.n++; o.co2 += u.co2_t; o.etanol += u.etanol_m3; porMunSafra.set(u.CD_MUN, o); }
for (const u of E.ano2024.usinas) porMun2024.set(u.CD_MUN, (porMun2024.get(u.CD_MUN) ?? 0) + u.co2_t);

const linhas = [];
for (const f of malha) {
  const cd = String(f.properties.CD_MUN);
  const b = B.get(cd) ?? { co2_t: 0, cana: 0, lavouras: 0, pecuaria: 0, urbano: 0, biogas_nm3: 0 };
  const g = A.gas.get(cd) ?? { industrial_m3: 0, cogeracao_m3: 0, termogeracao_m3: 0 };
  const d = A.der.get(cd) ?? { oleo_kg: 0, coque_kg: 0 };
  const e = A.co2.get(cd);
  if (!e) throw new Error(`município sem linha no Anuário: ${NOME_MUN.get(cd)}`);
  const fossilGas = ((g.industrial_m3 + g.cogeracao_m3 + g.termogeracao_m3) * COEF.kg_co2_por_m3_gas) / 1000;
  const fossilOleo = (d.oleo_kg * COEF.kg_co2_por_kg_oleo) / 1000;
  const fossilCoque = (d.coque_kg * COEF.kg_co2_por_kg_coque) / 1000;
  const fossilEst = fossilGas + fossilOleo + fossilCoque;
  const ferm = porMunSafra.get(cd);
  const ferm24 = porMun2024.get(cd) ?? 0;
  const pt = ponto.get(cd);
  const grandes = ferm24 + fossilEst;
  linhas.push({
    CD_MUN: cd, NM_MUN: NOME_MUN.get(cd), CD_RGINT: RGINT_MUN.get(cd), NM_RGINT: NOME_RGINT.get(RGINT_MUN.get(cd)),
    usinas_etanol: ferm?.n ?? 0,
    etanol_m3_safra: r0(ferm?.etanol ?? 0),
    co2_fermentacao_t: r0(ferm?.co2 ?? 0),
    co2_fermentacao_2024_t: r0(ferm24),
    co2_biogas_t: r0(b.co2_t), co2_biogas_cana_t: r0(b.cana), co2_biogas_lavouras_t: r0(b.lavouras), co2_biogas_pecuaria_t: r0(b.pecuaria), co2_biogas_urbano_t: r0(b.urbano),
    biogas_n4_nm3_ano: r0(b.biogas_nm3),
    co2_fossil_gas_t: r0(fossilGas), co2_fossil_oleo_t: r0(fossilOleo), co2_fossil_coque_t: r0(fossilCoque),
    co2_fossil_estacionario_t: r0(fossilEst),
    co2_fossil_energia_t: r0(e.co2_energia_t),
    pct_biogenico_grandes: grandes > 0 ? r1((100 * ferm24) / grandes) : null,
    co2_biogenico_t: r0((ferm?.co2 ?? 0) + b.co2_t),
    emetano_nm3_dia: r0((((ferm?.co2 ?? 0) + b.co2_t) * COEF.nm3_ch4_por_t_co2) / 365),
    km_gasoduto: r1(distanciaKm(pt, segGas)), km_gasoduto_transporte: r1(distanciaKm(pt, segTransp)),
  });
}
linhas.sort((a, z) => a.NM_MUN.localeCompare(z.NM_MUN, 'pt-BR'));

// Usinas: ponto interno do município (a ANP só dá o município), com a distância ao gasoduto.
const usinas = E.safra.usinas.map((u) => ({
  cnpj: u.cnpj, razao_social: u.razao_social, CD_MUN: u.CD_MUN, NM_MUN: u.NM_MUN, NM_RGINT: NOME_RGINT.get(RGINT_MUN.get(u.CD_MUN)),
  cap_anidro_m3d: u.cap_anidro_m3d, cap_hidratado_m3d: u.cap_hidratado_m3d, meses_na_safra: u.meses,
  parte_pct: r3(100 * u.parte), etanol_m3_estimado: r0(u.etanol_m3), co2_t_estimado: r0(u.co2_t),
  km_gasoduto: r1(distanciaKm(ponto.get(u.CD_MUN), segGas)),
})).sort((a, z) => z.co2_t_estimado - a.co2_t_estimado);

/* ------------------------------------------------------------------ resumos */
const tot = (k) => soma(linhas.map((l) => l[k]));
const T = {
  fermentacao: E.safra.co2_t, fermentacao_2024: E.ano2024.co2_t, biogas: tot('co2_biogas_t'),
  fossil_est: tot('co2_fossil_estacionario_t'), fossil_gas: tot('co2_fossil_gas_t'), fossil_oleo: tot('co2_fossil_oleo_t'), fossil_coque: tot('co2_fossil_coque_t'),
  fossil_energia: tot('co2_fossil_energia_t'),
};
const munFerm = linhas.filter((l) => l.co2_fermentacao_t > 0);
const top = (k, n = 8, f = () => true) => [...linhas].filter(f).sort((a, z) => z[k] - a[k]).slice(0, n).map((l) => ({ CD_MUN: l.CD_MUN, NM_MUN: l.NM_MUN, v: l[k], km: l.km_gasoduto, n: l.usinas_etanol, NM_RGINT: l.NM_RGINT }));
const FAIXAS_KM = [10, 25, 50];
const faixa = (d) => { let i = 0; while (i < FAIXAS_KM.length && d > FAIXAS_KM[i]) i++; return i; };
const porFaixa = (k) => [0, 1, 2, 3].map((i) => { const ls = linhas.filter((l) => l[k] > 0 && faixa(l.km_gasoduto) === i); return { municipios: ls.length, t: soma(ls.map((l) => l[k])) }; });

// Por região intermediária (092): CO2 biogênico das dornas (real, safra 2025/26) e do biogás (potencial), e o que viraria.
const regioes = [...NOME_RGINT].map(([cd, nome]) => {
  const ls = linhas.filter((l) => l.CD_RGINT === cd);
  const ferm = soma(ls.map((l) => l.co2_fermentacao_t)), bio = soma(ls.map((l) => l.co2_biogas_t));
  const co2 = ferm + bio;
  const maior = [...ls].sort((a, z) => z.co2_fermentacao_t - a.co2_fermentacao_t)[0];
  return {
    CD_RGINT: cd, NM_RGINT: nome, municipios: ls.length, usinas_etanol: soma(ls.map((l) => l.usinas_etanol)),
    co2_fermentacao_t: ferm, co2_biogas_t: bio, co2_biogenico_t: co2,
    h2_t: r0(co2 * COEF.t_h2_por_t_co2_metano), eletricidade_gwh: r0((co2 * COEF.mwh_por_t_co2_metano) / 1000),
    emetano_nm3_dia: r0((co2 * COEF.nm3_ch4_por_t_co2) / 365), emetano_mi_m3_ano: r1((co2 * COEF.nm3_ch4_por_t_co2) / 1e6),
    emetanol_t: r0(co2 * COEF.t_metanol_por_t_co2),
    co2_fermentacao_ate_25km_t: soma(ls.filter((l) => l.km_gasoduto <= 25).map((l) => l.co2_fermentacao_t)),
    maior_fonte: maior?.co2_fermentacao_t ? maior.NM_MUN : null,
  };
}).sort((a, z) => z.co2_biogenico_t - a.co2_biogenico_t);

const biogenico = T.fermentacao + T.biogas;
const c = {
  coef: COEF, versao: B.versao, fracoes: B.fracoes,
  safra: { ...E.safra, usinas: undefined }, ano2024: { ...E.ano2024, usinas: undefined }, materia: E.materia,
  n_usinas: usinas.length, n_mun_ferm: munFerm.length, T, biogenico,
  usinas_top: usinas.slice(0, 12),
  top_ferm: top('co2_fermentacao_t'), top_biogas: top('co2_biogas_t'), top_fossil: top('co2_fossil_estacionario_t'),
  top_grandes: [...linhas].map((l) => ({ ...l, grandes: l.co2_fermentacao_2024_t + l.co2_fossil_estacionario_t })).sort((a, z) => z.grandes - a.grandes).slice(0, 10)
    .map((l) => ({ CD_MUN: l.CD_MUN, NM_MUN: l.NM_MUN, ferm: l.co2_fermentacao_2024_t, fossil: l.co2_fossil_estacionario_t, pct: l.pct_biogenico_grandes })),
  lim_ferm: quebras(munFerm.map((l) => l.co2_fermentacao_t), 5),
  lim_biogas: quebras(linhas.map((l) => l.co2_biogas_t), 6),
  grupos_biogas: ['cana', 'lavouras', 'pecuaria', 'urbano'].map((g) => ({ g, t: tot(`co2_biogas_${g}_t`) })),
  com_biogas: linhas.filter((l) => l.co2_biogas_t > 0).length,
  faixas_ferm: porFaixa('co2_fermentacao_t'), faixas_km: FAIXAS_KM,
  regioes,
  // Comparações do 092: consumo de eletricidade e de gás natural do estado em 2024 (Anuário da SEMIL).
  eletricidade_sp_twh: A.eletricidade_tep / COEF.tep_por_mwh / 1e6,
  gas_sp_m3: soma([...A.gas.values()].map((g) => g.total_m3)),
  conferir: A.conferir,
  pontos: Object.fromEntries([...ponto].map(([cd, p]) => [cd, p.map((v) => Math.round(v * 1e4) / 1e4)])),
  desenho: { transporte: BT.desenho.transporte, distribuicao: BT.desenho.distribuicao },
  linhas, usinas,
};
gravarCache('carbono-sp', c);
console.log({
  coef: Object.fromEntries(Object.entries(COEF).map(([k, v]) => [k, r3(v)])),
  safra: { hid: r0(E.safra.hidratado_m3), ani: r0(E.safra.anidro_m3), co2: r0(E.safra.co2_t), usinas: usinas.length, mun: munFerm.length, cap: r0(E.safra.cap_m3d), uso: r3(E.safra.uso) },
  ano2024: { etanol: r0(E.ano2024.etanol_m3), co2: r0(E.ano2024.co2_t), usinas: E.ano2024.usinas.length },
  materia: Object.fromEntries(Object.entries(E.materia).map(([k, v]) => [k, r0(v)])),
  T: Object.fromEntries(Object.entries(T).map(([k, v]) => [k, r0(v)])),
  pct_biogenico_grandes: r1((100 * T.fermentacao_2024) / (T.fermentacao_2024 + T.fossil_est)),
  fracoes: B.fracoes, lim_ferm: c.lim_ferm, lim_biogas: c.lim_biogas, grupos: c.grupos_biogas.map((g) => `${g.g} ${r0(g.t)}`),
  top_ferm: c.top_ferm.map((t) => `${t.NM_MUN} ${t.v} (${t.n}) ${t.km} km`), top_fossil: c.top_fossil.map((t) => `${t.NM_MUN} ${t.v}`),
  top_grandes: c.top_grandes.map((t) => `${t.NM_MUN} ${t.ferm}/${t.fossil} ${t.pct}%`),
  faixas: c.faixas_ferm, eletricidade_twh: r1(c.eletricidade_sp_twh), gas_bi_m3: r3(c.gas_sp_m3 / 1e9), conferir: A.conferir,
  regioes: regioes.map((r) => `${r.NM_RGINT}: ${r0(r.co2_fermentacao_t / 1e3)} + ${r0(r.co2_biogas_t / 1e3)} kt · ${r.emetano_nm3_dia} m³/d · ${r.eletricidade_gwh} GWh`),
});

/* ------------------------------------------------------------------ GeoPackage e CSV */
export const CORES_FERM = '#7a3b2c';
export const CORES_BIOGAS = ['#f1efe6', '#e2dcc6', '#cbbd97', '#ab9467', '#836a44', '#5a4628'];
export const CORES_PCT = ['#5d4a6b', '#9c8aa6', '#d3c9cf', '#b7c4a1', '#6f8f5a', '#3d5e34'];
export const LIM_PCT = [10, 25, 50, 75, 90];
const malhaPor = new Map(malha.map((f) => [String(f.properties.CD_MUN), f.geometry]));
const feats = linhas.map((l) => ({ type: 'Feature', properties: l, geometry: malhaPor.get(l.CD_MUN) }));
const ptUsinas = usinas.map((u) => ({ type: 'Feature', properties: u, geometry: { type: 'Point', coordinates: ponto.get(u.CD_MUN) } }));
const regFeats = SP.rgint.features.map((f) => ({ type: 'Feature', properties: regioes.find((r) => r.CD_RGINT === f.properties.CD_RGINT), geometry: f.geometry }));
const ref = camadasReferencia();
const rotPct = ['até 10 %', '10 a 25 %', '25 a 50 %', '50 a 75 %', '75 a 90 %', 'mais de 90 %'];
const regrasPct = [0, ...LIM_PCT].map((a, i) => [i === LIM_PCT.length ? `"pct_biogenico_grandes" > ${a}` : `"pct_biogenico_grandes" > ${a} AND "pct_biogenico_grandes" <= ${LIM_PCT[i]}`, rotPct[i], preenchimento(CORES_PCT[i], '#ffffff', 0.05)]);
regrasPct[0][0] = `"pct_biogenico_grandes" <= ${LIM_PCT[0]}`;
// As mesmas classes do mapa da prancha 092.
const limReg = [100000, 1000000, 2000000, 4000000, Math.max(...regioes.map((r) => r.emetano_nm3_dia))];
const estilos = {
  usinas_etanol: [['co2', 'Nº 089 · CO2 de fermentação estimado por usina (t/ano)', estiloRegras('ponto', [['', 'usina de etanol (ponto do município)', marcador(CORES_FERM, 3, { tamanhoExpr: 'coalesce(scale_linear(sqrt("co2_t_estimado"), 0, sqrt(450000), 1, 9), 1)' })]]), true]],
  municipios: [
    ['co2_biogas', 'Nº 090 · CO2 separado na purificação do biogás, potencial CP2B N4 (t/ano)', estiloGraduado('co2_biogas_t', c.lim_biogas, CORES_BIOGAS, { casas: 0 }), true],
    ['pct_biogenico', 'Nº 091 · Parte biogênica do CO2 das grandes fontes estacionárias (%)', estiloRegras('poligono', regrasPct), false],
    ['co2_fossil_estacionario', 'Nº 091 · CO2 fóssil de gás natural industrial, óleo combustível e coque (t/ano)', estiloGraduado('co2_fossil_estacionario_t', quebras(linhas.map((l) => l.co2_fossil_estacionario_t), 6), ['#f3f1f4', '#ddd6e0', '#bfb1c6', '#9c8aa6', '#76627f', '#4f3d58'], { casas: 0 }), false],
  ],
  regioes_carbono: [['emetano', 'Nº 092 · e-metano possível com o CO2 biogênico (m³/dia)', estiloGraduado('emetano_nm3_dia', limReg, ['#eef1f3', '#d3dde3', '#a9bfcb', '#7598ab', '#46697f'], { casas: 0 }), true]],
  gasodutos_transporte: [['transporte', 'Gasodutos de transporte', estiloLinha('#6b3d5c', 0.8), true]],
  gasodutos_distribuicao: [['distribuicao', 'Gasodutos de distribuição', estiloLinha('#c08a2e', 0.3), true]],
  ...ref.estilos,
};
mkdirSync(PASTA.dornas, { recursive: true });
const arq = join(PASTA.dornas, 'sp_carbono_biogenico.gpkg');
await gravarGpkg(arq, {
  usinas_etanol: { feats: ptUsinas, campos: Object.keys(usinas[0]) },
  municipios: { feats, campos: Object.keys(linhas[0]) },
  regioes_carbono: { feats: regFeats, campos: Object.keys(regioes[0]) },
  gasodutos_transporte: { feats: BT.desenho.transporte.features, campos: ['nome'] },
  gasodutos_distribuicao: { feats: BT.desenho.distribuicao.features, campos: ['distribuidora'] },
  ...ref.camadas,
}, estilos);
const z = zipar(arq);
const csvU = join(PASTA.dornas, 'sp_co2_fermentacao_usinas.csv');
gravarCsv(csvU, usinas);
const csvM = join(PASTA.biogas, 'sp_carbono_municipios.csv');
mkdirSync(PASTA.biogas, { recursive: true });
gravarCsv(csvM, linhas);
mkdirSync(PASTA.fossil, { recursive: true });
copyFileSync(csvM, join(PASTA.fossil, 'sp_carbono_municipios.csv'));
mkdirSync(PASTA.ptx, { recursive: true });
const csvR = join(PASTA.ptx, 'sp_carbono_regioes.csv');
gravarCsv(csvR, regioes);
console.log(`✓ ${z} · ${mb(tamanho(z))} · usinas ${kb(tamanho(csvU))} · municípios ${kb(tamanho(csvM))} · regiões ${kb(tamanho(csvR))}`);
