// Coleção «Bioenergia cruzada» (bioenergia-cruzada-sp), passo 1: base municipal (só Node, uso interno).
//   node scripts/colecoes/bioenergia-cruzada-sp/base.mjs
// Junta, por município de SP: CP2B v5.1 por fonte (N4, cenário de referência, do cache das pranchas 055–059),
// infraestrutura de gás e eletricidade, demanda de energéticos (Anuário SEMIL 2025, ano base 2024), frota (SENATRAN 2025 via IBGE), gestão de resíduos
// (MUNIC Saneamento 2023), emprego agroindustrial e logístico (RAIS), PIB 2023, silvicultura (PEVS 2024),
// adubação orgânica (Censo Agro 2017) e crescimento da população 2010–2022 (Censo).
// Saídas: bioenergia/base_bio.csv e bioenergia/variaveis_bio.json.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { NOME_MUN } from '../lib/cruzamentos.mjs';
import { RAIZ } from '../lib/dados.mjs';
import { planilhas } from './xlsx.mjs';

const R = RAIZ;
const OUT = join(R, 'dados-brutos/analises/bioenergia');
const J = (f) => JSON.parse(readFileSync(join(R, f), 'utf8'));
const CDS = [...NOME_MUN.keys()];
const cd6 = new Map(CDS.map((c) => [c.slice(0, 6), c]));
const base = new Map();
const lerBase = () => {
  const L = readFileSync(join(R, 'dados-brutos/analises/base/municipios.csv'), 'utf8').trim().split('\n');
  const cab = L[0].split(',');
  for (const l of L.slice(1)) {
    const c = l.match(/("([^"]|"")*"|[^,]*)(,|$)/g).map((x) => x.replace(/,$/, ''));
    base.set(c[0].replace(/"/g, ''), { pessoas: Number(c[cab.indexOf('pessoas')]) });
  }
};
lerBase();
const M = new Map(CDS.map((c) => [c, {}]));
const VARS = {};
const def = (id, grupo, rotulo, fonte, opts = {}) => { VARS[id] = { grupo, rotulo, fonte, nivel: ['municipio'], ...opts }; };
const log = (v, eps) => (v == null || !Number.isFinite(v) ? null : Math.log10(v + eps));

/* ------------------------------------------------------------------ CP2B e infraestrutura (cache 055–059) */
const BT = J('scripts/colecoes/cache/biogas-territorio-sp.json');
const FONTES = { cana: 'cana_m3d', graos: 'graos_m3d', citros: 'citros_m3d', cafe: 'cafe_m3d', aves: 'aves_m3d', bovinos: 'bovinos_m3d', suinos: 'suinos_m3d', urbano: 'urbano_m3d' };
for (const l of BT.linhas) {
  const o = M.get(l.CD_MUN); const km2 = l.area_km2, hab = l.pessoas;
  o.area_km2 = km2;
  o.log_bm_total = log(l.biometano_m3d, 1);
  for (const k of ['cana', 'graos', 'aves', 'bovinos', 'suinos', 'cafe']) o[`log_bm_${k}_km2`] = log(l[`${k}_m3d`] / km2, 0.01);
  o.bm_lixo_hab = (l.lixo_m3d / hab) * 1000; // L/dia por pessoa
  o.tem_esgoto_cp2b = l.esgoto_m3d > 0 ? 1 : 0;
  o.tem_citros_cp2b = l.citros_m3d > 0 ? 1 : 0;
  o.pct_bm_graos = l.biometano_m3d > 0 ? (100 * l.graos_m3d) / l.biometano_m3d : null;
  o.pct_bm_aves = l.biometano_m3d > 0 ? (100 * l.aves_m3d) / l.biometano_m3d : null;
  o.pct_bm_urbano = l.biometano_m3d > 0 ? (100 * l.urbano_m3d) / l.biometano_m3d : null;
  // Diversidade das fontes: equitabilidade de Shannon entre as 8 fontes do CP2B (0 = uma só fonte, 1 = todas iguais).
  const v = Object.values(FONTES).map((k) => l[k]).filter((x) => x > 0); const t = v.reduce((a, b) => a + b, 0);
  o.diversidade_fontes = t > 0 && v.length > 1 ? -v.reduce((a, x) => a + (x / t) * Math.log(x / t), 0) / Math.log(8) : t > 0 ? 0 : null;
  o.km_gasoduto_transporte = l.km_gasoduto_transporte;
  o.km_gasoduto_distribuicao = l.km_gasoduto_distribuicao;
  o.km_ponto_entrega = l.km_ponto_entrega;
  o.km_linha_transmissao = l.km_linha_transmissao;
  o.tem_biogas_operando = (l.anp_capacidade_m3d > 0 || l.gd_biogas_kw > 0) ? 1 : 0;
  o._bm_m3d = l.biometano_m3d; o._pessoas = hab;
}
const fCP = 'CP2B v5.1, N4, cenário de referência (pranchas 055–059)';
def('log_bm_total', 'cp2b', 'Potencial de biometano total (log10 m³/dia)', fCP);
for (const [k, n] of Object.entries({ cana: 'da cana', graos: 'da palha de milho e soja', aves: 'das aves', bovinos: 'dos bovinos', suinos: 'dos suínos', cafe: 'da casca de café' }))
  def(`log_bm_${k}_km2`, 'cp2b', `Biometano ${n} por km² (log10 m³/dia)`, fCP);
def('bm_lixo_hab', 'cp2b', 'Biometano da fração orgânica do lixo por habitante (L/dia)', fCP);
def('tem_esgoto_cp2b', 'cp2b', 'Tem potencial de lodo de ETE no CP2B (0/1)', fCP, { binaria: true });
def('tem_citros_cp2b', 'cp2b', 'Tem bagaço de citros no CP2B (0/1)', fCP, { binaria: true, triar: false });
def('pct_bm_graos', 'cp2b', 'Parte da palha de milho e soja no potencial (%)', fCP);
def('pct_bm_aves', 'cp2b', 'Parte das aves no potencial (%)', fCP);
def('pct_bm_urbano', 'cp2b', 'Parte do lixo, esgoto e poda no potencial (%)', fCP);
def('diversidade_fontes', 'cp2b', 'Diversidade das fontes de biometano (equitabilidade de Shannon, 8 fontes)', fCP);
const fIn = 'ANP/EPE e ANEEL/EPE (pranchas 057–059)';
def('km_gasoduto_transporte', 'infra', 'Distância ao gasoduto de transporte (km)', fIn);
def('km_gasoduto_distribuicao', 'infra', 'Distância à rede de distribuição de gás (km)', fIn);
def('km_ponto_entrega', 'infra', 'Distância ao ponto de entrega (city gate) (km)', fIn);
def('km_linha_transmissao', 'infra', 'Distância à linha de transmissão (km)', fIn);
def('tem_biogas_operando', 'infra', 'Tem planta de biometano (ANP) ou GD a biogás (ANEEL) (0/1)', 'ANP 04/2026 e ANEEL 10/2026', { binaria: true });

/* ------------------------------------------------------------------ Anuário SEMIL 2025 (ano base 2024) */
{
  const txt = readFileSync(join(R, 'dados-brutos/semil/Anuario-Energeticos-Municipios-SP-2025-ab2024.txt'), 'utf8').split(/\r?\n/);
  const idx = (re) => txt.findIndex((l) => re.test(l));
  const semAc = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z]/g, '');
  const POR = new Map(CDS.map((c) => [semAc(NOME_MUN.get(c)), c]));
  const AP = { MOJIMIRIM: 'MOGIMIRIM', EMBU: 'EMBUDASARTES', SAOLUIZDOPARAITINGA: 'SAOLUISDOPARAITINGA', FLORINIA: 'FLORINEA', MOJIGUACU: 'MOGIGUACU', MOJIDASCRUZES: 'MOGIDASCRUZES', EUCLIDESDACUNHA: 'EUCLIDESDACUNHAPAULISTA', LUIZANTONIO: 'LUISANTONIO', SUDMENUCCI: 'SUDMENNUCCI' };
  const cdDe = (n) => POR.get(semAc(n)) ?? POR.get(AP[semAc(n)] ?? '') ?? null;
  const numBr = (s) => (s === '-' ? 0 : Number(String(s).replace(/\./g, '').replace(',', '.')));
  const INT = String.raw`(-?\d{1,3}(?:\.\d{3})*|-)`; // "-" = zero; negativos = devoluções
  const tabela = (i0, i1, ncol, fn) => {
    const re = new RegExp(`^(.+?) ${Array(ncol).fill(INT).join(' ')}$`); let pre = null; const vistos = new Map(); const sem = new Set();
    for (const l of txt.slice(i0, i1)) {
      const m = l.match(re);
      if (!m) { pre = /\d/.test(l) ? null : l.trim(); continue; }
      const nome = m[1];
      if (/^(Total|Estado|ESTADO)/i.test(nome)) { pre = null; continue; }
      const cd = (pre && cdDe(`${pre} ${nome}`)) || cdDe(nome); pre = null;
      if (!cd) { sem.add(nome); continue; }
      vistos.set(cd, fn(m.slice(2).map(numBr)));
    }
    return { vistos, sem };
  };
  // Eletricidade: 9 pares (consumidores, kWh): residencial, comercial, rural, industrial, iluminação, poder público, serviço público, consumo próprio, total.
  const el = tabela(idx(/^TABELA Nº 2 /), idx(/^TABELA Nº 3 /), 18, (v) => ({ res_nc: v[0], res: v[1], rural_nc: v[4], rural: v[5], ind: v[7], tot: v[17] }));
  const gas = tabela(idx(/^TABELA Nº 4 /), idx(/^TABELA Nº 5 /), 14, (v) => ({ res_nc: v[0], ind: v[5], gnv: v[7], tot: v[13] }));
  const der = tabela(idx(/^TABELA Nº 6 /), idx(/^TABELA Nº 7 /), 10, (v) => ({ gasolina: v[0], diesel: v[2], glp: v[6], etanol: v[8] }));
  console.log(`SEMIL: eletricidade ${el.vistos.size}, gás ${gas.vistos.size}, derivados ${der.vistos.size}; sem código: ${[...el.sem, ...gas.sem, ...der.sem].join(', ') || '—'}`);
  // A tabela 9 (consumo em tep e CO2) tem os 645; a última página da eletricidade por classe (Uchoa a Zacarias) se perdeu na extração do PDF.
  const reTep = new RegExp('^(.+?) ' + Array(6).fill(INT).join(' ') + String.raw` (\d{1,3}(?:\.\d{3})*(?:,\d+)?)$`);
  const tep = new Map(); { let pre = null;
    for (const l of txt.slice(idx(/^TABELA Nº 9 /))) {
      const x = l.match(reTep); if (!x) { pre = /\d/.test(l) ? null : l.trim(); continue; }
      if (/^(Total|Estado)/i.test(x[1])) { pre = null; continue; }
      const cd = (pre && cdDe(pre + ' ' + x[1])) || cdDe(x[1]); pre = null; if (cd) tep.set(cd, x.slice(2, 8).map(numBr));
    } }
  console.log(`SEMIL tep: ${tep.size}; sem derivados: ${CDS.filter((c) => !der.vistos.has(c)).map((c) => NOME_MUN.get(c)).join(', ') || '—'}`);
  if (tep.size < 645 || der.vistos.size < 640) throw new Error('Anuário: leitura incompleta');
  for (const [cd, o] of M) { const t = tep.get(cd); o._tep = t; }
  for (const [cd, o] of M) {
    const hab = base.get(cd)?.pessoas; const e = el.vistos.get(cd), g = gas.vistos.get(cd), d = der.vistos.get(cd);
    if (e) {
      o.kwh_res_consumidor = e.res_nc ? e.res / e.res_nc : null;
      o.pct_kwh_rural = (100 * e.rural) / e.tot; o.pct_kwh_industrial = (100 * e.ind) / e.tot;
    }
    o.kwh_hab = (o._tep[0] / 0.086) * 1000 / hab; o._kwh = (o._tep[0] / 0.086) * 1000; o.tep_hab = o._tep[5] / hab;
    o.tem_gas_canalizado = g && g.tot > 0 ? 1 : 0;
    o.log_gn_m3_hab = log(g ? g.tot / hab : 0, 0.1);
    o.pct_dom_gas = g ? null : null; // sem domicílios por município no Anuário: fica de fora
    o._gn_m3 = g ? g.tot : 0;
    if (d) {
      o.log_diesel_l_hab = log(Math.max(0, d.diesel) / hab, 1); o.gasolina_l_hab = d.gasolina / hab; o.etanol_l_hab = d.etanol / hab; o.glp_kg_hab = Math.max(0, d.glp) / hab;
      // Etanol no ciclo Otto, em energia: etanol hidratado 21,3 MJ/L; gasolina C 32,2 MJ/L (BEN/EPE, valores aproximados).
      o.pct_etanol_otto = (100 * d.etanol * 21.3) / (d.etanol * 21.3 + d.gasolina * 32.2);
      o._diesel_l = d.diesel; o._etanol_l = d.etanol; o._gasolina_l = d.gasolina;
    }
  }
}
const fSe = 'SEMIL, Anuário de Energéticos por Município 2025 (ano base 2024)';
def('kwh_hab', 'demanda', 'Consumo de eletricidade por habitante (kWh/ano)', fSe);
def('tep_hab', 'demanda', 'Consumo de energéticos por habitante (tep/ano)', fSe);
def('kwh_res_consumidor', 'demanda', 'Consumo residencial por unidade consumidora (kWh/ano)', fSe);
def('pct_kwh_rural', 'demanda', 'Parte da classe rural no consumo de eletricidade (%)', fSe);
def('pct_kwh_industrial', 'demanda', 'Parte da indústria no consumo de eletricidade (%)', fSe);
def('tem_gas_canalizado', 'demanda', 'Tem consumo de gás natural canalizado (0/1)', fSe, { binaria: true });
def('log_gn_m3_hab', 'demanda', 'Gás natural por habitante (log10 m³/ano)', fSe);
def('log_diesel_l_hab', 'demanda', 'Óleo diesel vendido por habitante (log10 L/ano)', fSe);
def('gasolina_l_hab', 'demanda', 'Gasolina por habitante (L/ano)', fSe);
def('etanol_l_hab', 'demanda', 'Etanol hidratado por habitante (L/ano)', fSe);
def('glp_kg_hab', 'demanda', 'GLP por habitante (kg/ano)', fSe);
def('pct_etanol_otto', 'demanda', 'Parte do etanol na energia do ciclo Otto (%)', fSe);
delete VARS.pct_dom_gas;

/* ------------------------------------------------------------------ Frota 2025 (SENATRAN, distribuída pelo IBGE) */
{
  const F = J('dados-brutos/ibge/frota-2025/frota_2025_sp.json');
  const v = new Map();
  for (const ind of F) for (const r of ind.res) {
    const cd = cd6.get(r.localidade); if (!cd) continue;
    if (!v.has(cd)) v.set(cd, {}); v.get(cd)[ind.id] = Number(r.res['2025']) || 0;
  }
  for (const [cd, o] of M) {
    const f = v.get(cd); const hab = base.get(cd)?.pessoas; if (!f) continue;
    const cam = (f[28123] ?? 0) + (f[28124] ?? 0), oni = (f[28130] ?? 0) + (f[28127] ?? 0);
    o.caminhoes_mil_hab = (1000 * cam) / hab; o.onibus_mil_hab = (1000 * oni) / hab; o.tratores_mil_hab = (1000 * (f[28131] ?? 0)) / hab;
    o.autos_mil_hab = (1000 * (f[28122] ?? 0)) / hab; o.motos_mil_hab = (1000 * ((f[28128] ?? 0) + (f[28129] ?? 0))) / hab;
    o.pct_frota_pesada = (100 * (cam + oni)) / f[28120];
    o._caminhoes = cam; o._onibus = oni;
  }
}
const fFr = 'SENATRAN, frota de dezembro de 2025 (IBGE Cidades, pesquisa 22)';
def('caminhoes_mil_hab', 'frota', 'Caminhões e caminhões-trator por mil habitantes', fFr);
def('onibus_mil_hab', 'frota', 'Ônibus e micro-ônibus por mil habitantes', fFr);
def('tratores_mil_hab', 'frota', 'Tratores de rodas emplacados por mil habitantes', fFr);
def('autos_mil_hab', 'frota', 'Automóveis por mil habitantes', fFr);
def('motos_mil_hab', 'frota', 'Motocicletas e motonetas por mil habitantes', fFr);
def('pct_frota_pesada', 'frota', 'Caminhões e ônibus na frota (%)', fFr);

/* ------------------------------------------------------------------ MUNIC Saneamento 2023 (resíduos sólidos) */
{
  const P = planilhas(join(R, 'dados-brutos/ibge/munic-saneamento-2023/Base_de_Dados_Suplemento_de_Saneamento_2023.xlsx'));
  const L = P.linhas('Resíduos Sólidos'); const h = L[0];
  const sim = (l, c) => { const x = l[h.indexOf(c)]; return x === 'Sim' ? 1 : x === 'Não' ? 0 : null; };
  for (const l of L.slice(1)) {
    const cd = String(l[0]); if (!M.has(cd)) continue; const o = M.get(cd);
    o.rs_coleta_seletiva = sim(l, 'SMRS28'); o.rs_trat_organicos = sim(l, 'SMRS32'); o.rs_compostagem = sim(l, 'SMRS46');
    o.rs_aterro_sanitario = sim(l, 'SMRS45'); o.rs_transbordo = sim(l, 'SMRS49'); o.rs_lixao = sim(l, 'SMRS42');
    o.rs_regionalizado = sim(l, 'SMRS65'); o.rs_consorcio = sim(l, 'SMRS6515'); o.rs_disposicao_regional = sim(l, 'SMRS6711');
    if (o.rs_regionalizado === 0) { o.rs_consorcio = 0; o.rs_disposicao_regional = 0; }
  }
}
const fMu = 'IBGE, MUNIC 2023, Suplemento de Saneamento (resíduos sólidos)';
for (const [k, r] of Object.entries({
  rs_coleta_seletiva: 'Tem coleta seletiva', rs_trat_organicos: 'Trata resíduos orgânicos', rs_compostagem: 'Tem unidade de compostagem no município',
  rs_aterro_sanitario: 'Tem aterro sanitário no município', rs_transbordo: 'Tem área de transbordo', rs_lixao: 'Tem vazadouro a céu aberto',
  rs_regionalizado: 'Presta o serviço de resíduos de forma regionalizada', rs_consorcio: 'Regionalização por consórcio público', rs_disposicao_regional: 'Disposição final regionalizada',
})) def(k, 'gestao_residuos', `${r} (0/1)`, fMu, { binaria: true });

/* ------------------------------------------------------------------ RAIS: agroindústria e transporte de carga */
{
  const B = J('scripts/colecoes/cache/bioeconomia-sp.json');
  for (const l of B.mun) {
    const o = M.get(l.CD_MUN); if (!o) continue; const hab = l.pessoas;
    o.usinas_10mil = (1e4 * l.g_acucar_etanol) / hab; o.abate_10mil = (1e4 * l.g_abate) / hab; o.laticinios_10mil = (1e4 * l.g_laticinios) / hab;
  }
  const L = readFileSync(join(R, 'dados-brutos/rais/rais_estab_sp.csv'), 'utf8').split('\n'); const h = L[0].split(',');
  const iC = h.indexOf('cnae_subclasse'), iM = h.indexOf('cd_mun6'), iV = h.indexOf('vinculos_ativos');
  const carga = new Map();
  for (const l of L.slice(1)) { const c = l.split(','); if (!c[iC]?.startsWith('4930') || c[iC] === '4930204') continue; const cd = cd6.get(c[iM]); if (cd) carga.set(cd, (carga.get(cd) ?? 0) + Number(c[iV])); }
  for (const [cd, o] of M) o.carga_10mil = (1e4 * (carga.get(cd) ?? 0)) / base.get(cd).pessoas;
}
const fRa = 'RAIS 2025 (estabelecimentos; prancha 078 para os grupos)';
def('usinas_10mil', 'bioeconomia', 'Vínculos em usinas de açúcar e etanol por 10 mil hab.', fRa);
def('abate_10mil', 'bioeconomia', 'Vínculos em abate e frigoríficos por 10 mil hab.', fRa);
def('laticinios_10mil', 'bioeconomia', 'Vínculos em laticínios por 10 mil hab.', fRa);
def('carga_10mil', 'logistica', 'Vínculos no transporte rodoviário de carga por 10 mil hab.', 'RAIS 2025, CNAE 4930-2 (sem mudanças)');

/* ------------------------------------------------------------------ SIDRA: PIB 2023, PEVS 2024, Censo Agro 2017, população 2010–2022 */
const sidra = (f) => J(`dados-brutos/ibge/sidra-sp/bioenergia/${f}`);
const valor = (s) => (s == null || s === '-' ? 0 : /^[\d.]+$/.test(s) ? Number(s) : null); // X, .., ... → sem dado
{
  for (const v of sidra('pib5938_2023.json')) for (const s of v.resultados[0].series) {
    const o = M.get(s.localidade.id); if (!o) continue; const x = valor(s.serie['2023']);
    if (v.id === '37') o.log_pib_pc = x != null ? Math.log10((1000 * x) / base.get(s.localidade.id).pessoas) : null;
  }
  // O VAB por atividade de 2022 e 2023 ainda sai como "..." por município: usa 2021 e calcula as participações.
  const vab = new Map();
  for (const v of sidra('pib5938_vab_2022.json')) for (const s of v.resultados[0].series) { if (!vab.has(s.localidade.id)) vab.set(s.localidade.id, {}); vab.get(s.localidade.id)[v.id] = valor(s.serie['2021']); }
  for (const [cd, x] of vab) { const o = M.get(cd); if (!o || !(x['498'] > 0)) continue; o.pct_vab_agro = (100 * x['513']) / x['498']; o.pct_vab_industria = (100 * x['517']) / x['498']; }
  const pevs = sidra('pevs291_2024.json')[0];
  const cat = (r) => Object.values(r.classificacoes[0].categoria)[0];
  const somas = { lenha: /^1\.2 - Lenha$/, papel: /Madeira em tora para papel/ };
  for (const r of pevs.resultados) {
    const nome = cat(r); const k = Object.keys(somas).find((x) => somas[x].test(nome)); if (!k) continue;
    for (const s of r.series) { const o = M.get(s.localidade.id); if (!o) continue; o[`_pevs_${k}`] = valor(s.serie['2024']); }
  }
  for (const [cd, o] of M) {
    o.log_lenha_silv_km2 = o._pevs_lenha == null ? null : log(o._pevs_lenha / o.area_km2, 0.01);
    o.log_madeira_papel_km2 = o._pevs_papel == null ? null : log(o._pevs_papel / o.area_km2, 0.01);
  }
  const ca = sidra('ca6847_adubacao.json')[0]; const porCat = {};
  for (const r of ca.resultados) { const id = Object.keys(r.classificacoes.find((c) => c.id === '12522').categoria)[0]; porCat[id] = new Map(r.series.map((s) => [s.localidade.id, valor(s.serie['2017'])])); }
  for (const [cd, o] of M) {
    const t = porCat['46545']?.get(cd), a = porCat['46548']?.get(cd), b = porCat['46549']?.get(cd);
    o._adubo = { t, a, b };
    o.pct_estab_adubo_organico = t > 0 && a != null && b != null ? (100 * (a + b)) / t : null;
  }
  for (const v of sidra('pop4709_2022.json')) if (v.id === '10605') for (const s of v.resultados[0].series) { const o = M.get(s.localidade.id); if (o) o.cresc_pop_2010_22 = Number(s.serie['2022']); }
}
def('log_pib_pc', 'pib', 'PIB por habitante (log10 R$)', 'IBGE, PIB dos Municípios 2023 (SIDRA 5938)');
def('pct_vab_agro', 'pib', 'Agropecuária no valor adicionado (%)', 'IBGE, PIB dos Municípios 2021 (SIDRA 5938)');
def('pct_vab_industria', 'pib', 'Indústria no valor adicionado (%)', 'IBGE, PIB dos Municípios 2021 (SIDRA 5938)');
def('log_lenha_silv_km2', 'agroenergia', 'Lenha de silvicultura por km² (log10 m³/ano)', 'IBGE, PEVS 2024 (SIDRA 291)');
def('log_madeira_papel_km2', 'agroenergia', 'Madeira em tora para papel e celulose por km² (log10 m³/ano)', 'IBGE, PEVS 2024 (SIDRA 291)');
def('pct_estab_adubo_organico', 'agro_pratica', 'Estabelecimentos que usaram adubo orgânico (%)', 'IBGE, Censo Agropecuário 2017 (SIDRA 6847)');
def('cresc_pop_2010_22', 'demografia', 'Crescimento da população 2010–2022 (% ao ano)', 'IBGE, Censo 2022 (SIDRA 4709)');

/* ------------------------------------------------------------------ derivadas (descritivas, fora da triagem) */
// Cobertura teórica: biometano N4 sobre o diesel vendido (1 m³ de biometano ≈ 0,94 L de diesel em energia: 35,6 MJ/m³ ÷ 35,5 MJ/L ×
// rendimento… aqui só energia: 9,8 kWh/m³ contra 10,0 kWh/L) e sobre o gás natural consumido.
for (const o of M.values()) {
  o.cobertura_diesel = o._diesel_l > 0 ? (o._bm_m3d * 365 * 0.98) / o._diesel_l : null;
  o.cobertura_gn = o._gn_m3 > 0 ? (o._bm_m3d * 365) / o._gn_m3 : null;
}
def('cobertura_diesel', 'derivada', 'Biometano N4 sobre o diesel vendido, em energia (razão)', 'CP2B e SEMIL', { triar: false });
def('cobertura_gn', 'derivada', 'Biometano N4 sobre o gás natural consumido (razão)', 'CP2B e SEMIL', { triar: false });

/* ------------------------------------------------------------------ saída */
const cols = Object.keys(VARS);
const fmt = (v) => (v == null || !Number.isFinite(v) ? '' : +v.toPrecision(6));
writeFileSync(join(OUT, 'base_bio.csv'), ['cd,' + cols.join(','), ...CDS.map((cd) => cd + ',' + cols.map((c) => fmt(M.get(cd)[c])).join(','))].join('\n'));
writeFileSync(join(OUT, 'variaveis_bio.json'), JSON.stringify(VARS, null, 1));
// Extras para as contas do relatório (totais absolutos).
writeFileSync(join(OUT, 'extras_bio.json'), JSON.stringify(Object.fromEntries(CDS.map((cd) => { const o = M.get(cd); return [cd, { bm_m3d: o._bm_m3d, pessoas: o._pessoas, diesel_l: o._diesel_l, gn_m3: o._gn_m3, kwh: o._kwh, caminhoes: o._caminhoes, onibus: o._onibus, etanol_l: o._etanol_l, gasolina_l: o._gasolina_l, madeira_papel_m3: o._pevs_papel, estab_adubo: o._adubo?.t, estab_adubo_organico: o._adubo && o._adubo.a != null && o._adubo.b != null ? o._adubo.a + o._adubo.b : null }]; }))));
for (const c of cols) { const v = CDS.map((cd) => M.get(cd)[c]).filter((x) => x != null && Number.isFinite(x)); const s = [...v].sort((a, b) => a - b); console.log(c.padEnd(28), String(v.length).padStart(4), 'mín', +s[0]?.toPrecision(3), 'med', +s[s.length >> 1]?.toPrecision(3), 'máx', +s.at(-1)?.toPrecision(3)); }
