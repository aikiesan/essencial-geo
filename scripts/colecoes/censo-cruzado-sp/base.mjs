// Coleção «O Censo cruzado» (censo-cruzado-sp), passo 2 de 3. Base analítica para a triagem de correlações (Censo 2022 × território e energia), só com Node.
// Saídas em dados-brutos/analises/base/: municipios.csv, apond.csv, variaveis.json.
//
// Regras:
// - Taxas sempre com o denominador do próprio grupo de variáveis do Censo.
// - "X" (sigilo) = sem dado. Num setor, a taxa só entra se numerador e denominador vierem completos;
//   o município só recebe a taxa se os setores usados cobrirem ≥ 80% das pessoas dele.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tabelaCenso, basico } from '../lib/setores-sp.mjs';
import { linhasCsv, RAIZ } from '../lib/dados.mjs';

const OUT = join(RAIZ, 'dados-brutos/analises/base');
mkdirSync(OUT, { recursive: true });
const COB_MIN = 0.8;

const VARS = {}; // nome → { grupo, desc, fonte, nivel: ['mun'] | ['mun','apond'] }
const def = (nome, grupo, desc, fonte, nivel = ['mun']) => { VARS[nome] = { grupo, desc, fonte, nivel }; };

/* ------------------------------------------------------------------ 1. setores */
const B = await basico();
const deP = new Map();
for await (const l of linhasCsv(join(RAIZ, 'dados-brutos/ibge/malhas-sp/DePara_SetorCensit22xAPOND22_35_SP.csv'))) {
  if (/^\D/.test(l[0].replace(/^\uFEFF/, ''))) continue;
  deP.set(l[0].replace(/^\uFEFF/, ''), l[1]);
}
const soma = (o, ks) => { let s = 0; for (const k of ks) { const v = o[k]; if (v == null) return null; s += v; } return s; };
const faixa = (a, b, pre = 'V0') => Array.from({ length: b - a + 1 }, (_, i) => `${pre}${String(a + i).padStart(4, '0')}`);
const V = (n) => `V${String(n).padStart(5, '0')}`;
const VS = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => V(a + i));

// Taxas por setor: [nome, grupo, desc, tabela, numerador, denominador, fator]
const TAXAS = [
  ['pct_0a14', 'demografia', 'Pessoas de 0 a 14 anos (%)', 'demografia', VS(1031, 1033), [V(1006)], 100],
  ['pct_15a29', 'demografia', 'Pessoas de 15 a 29 anos (%)', 'demografia', VS(1034, 1036), [V(1006)], 100],
  ['pct_60mais', 'demografia', 'Pessoas de 60 anos ou mais (%)', 'demografia', VS(1040, 1041), [V(1006)], 100],
  ['razao_sexo', 'demografia', 'Homens por 100 mulheres', 'demografia', [V(1007)], [V(1008)], 100],
  ['razao_sexo_20a39', 'demografia', 'Homens por 100 mulheres, 20 a 39 anos', 'demografia', VS(1013, 1015), VS(1024, 1026), 100],
  ['moradores_dom', 'domicilio', 'Moradores por domicílio particular permanente ocupado', 'domicilio1', [V(5)], [V(4)], 1],
  ['pct_unipessoal', 'domicilio', 'Domicílios com 1 morador (%)', 'domicilio1', [V(17)], [V(4)], 100],
  ['pct_ate4_moradores', 'domicilio', 'Domicílios com até 4 moradores (%)', 'domicilio1', VS(17, 20), [V(4)], 100],
  ['pct_apartamento', 'domicilio', 'Domicílios em apartamento (%)', 'domicilio1', [V(49)], [V(4)], 100],
  ['pct_condominio', 'domicilio', 'Domicílios em casa de vila ou condomínio (%)', 'domicilio1', [V(48)], [V(4)], 100],
  ['pct_cortico_degradada', 'domicilio', 'Domicílios em cortiço ou estrutura degradada (%)', 'domicilio1', [V(50), V(52)], [V(4)], 100],
  ['pct_coletivos', 'domicilio', 'Pessoas em domicílios coletivos (%)', 'domicilio1', [V(7)], [V(5), V(6), V(7)], 100],
  ['pct_agua_rede', 'saneamento', 'Domicílios abastecidos pela rede geral (%)', 'domicilio2', [V(111)], ['@dpo'], 100],
  ['pct_poco', 'saneamento', 'Domicílios abastecidos por poço (%)', 'domicilio2', [V(112), V(113)], ['@dpo'], 100],
  ['pct_esgoto_rede', 'saneamento', 'Esgoto na rede geral ou fossa ligada à rede (%)', 'domicilio2', [V(309), V(310)], ['@dpo'], 100],
  ['pct_fossa_rudimentar', 'saneamento', 'Esgoto em fossa rudimentar (%)', 'domicilio2', [V(312)], ['@dpo'], 100],
  ['pct_lixo_coletado', 'saneamento', 'Lixo coletado (porta ou caçamba) (%)', 'domicilio2', [V(397), V(398)], ['@dpo'], 100],
  ['pct_lixo_queimado', 'saneamento', 'Lixo queimado na propriedade (%)', 'domicilio2', [V(399)], ['@dpo'], 100],
  ['pct_sem_banheiro', 'saneamento', 'Domicílios sem banheiro de uso exclusivo (%)', 'domicilio2', [V(495)], [V(494), V(495)], 100],
  ['pct_branca', 'raca', 'Pessoas de cor ou raça branca (%)', 'cor_ou_raca', [V(1317)], ['@pessoas'], 100],
  ['pct_preta', 'raca', 'Pessoas de cor ou raça preta (%)', 'cor_ou_raca', [V(1318)], ['@pessoas'], 100],
  ['pct_parda', 'raca', 'Pessoas de cor ou raça parda (%)', 'cor_ou_raca', [V(1320)], ['@pessoas'], 100],
  ['pct_amarela', 'raca', 'Pessoas de cor ou raça amarela (%)', 'cor_ou_raca', [V(1319)], ['@pessoas'], 100],
  ['pct_indigena', 'raca', 'Pessoas indígenas (cor ou raça) (%)', 'cor_ou_raca', [V(1321)], ['@pessoas'], 100],
  ['pct_analfabeto', 'educacao', 'Analfabetismo, 15 anos ou mais (%)', 'alfabetizacao', [V(901)], ['@p15'], 100],
];
const TAB_VARS = {};
for (const [, , , t, n, d] of TAXAS) TAB_VARS[t] = [...new Set([...(TAB_VARS[t] ?? []), ...n, ...d.filter((x) => !x.startsWith('@'))])];
TAB_VARS.demografia.push(...VS(1034, 1041));
TAB_VARS.renda = ['V06001', 'V06004'];
TAB_VARS.cor_ou_raca.push(V(1317));

const TAB = {};
for (const [t, vs] of Object.entries(TAB_VARS)) {
  TAB[t] = await tabelaCenso(t, [...new Set(vs)]);
  console.log(`setores: ${t} · ${TAB[t].size}`);
}

// Acumuladores por unidade (município e APOND).
const acc = { mun: new Map(), apond: new Map() };
const pega = (nivel, cd) => { let o = acc[nivel].get(cd); if (!o) { o = { pessoas: 0, area: 0, dom: 0, ocas: 0, vagos: 0, fcu: 0, tx: {}, setores: [] }; acc[nivel].set(cd, o); } return o; };
for (const [cd, b] of B) {
  const unidades = [['mun', b.CD_MUN], ['apond', deP.get(cd)]].filter(([, u]) => u);
  const linha = {};
  const de = TAB.demografia.get(cd);
  const fixo = { '@dpo': b.dpo ?? null, '@pessoas': b.pessoas ?? null, '@p15': de ? soma(de, VS(1034, 1041)) : null };
  for (const [nome, , , t, n, d] of TAXAS) {
    const o = TAB[t].get(cd);
    const dd = d[0].startsWith('@') ? fixo[d[0]] : o ? soma(o, d) : null;
    const nn = o ? soma(o, n) : null;
    // [numerador, denominador] com dado; com o numerador em X, o denominador ainda conta para a cobertura.
    linha[nome] = dd != null && dd > 0 ? [nn, dd] : null;
  }
  const re = TAB.renda.get(cd);
  const cr = TAB.cor_ou_raca.get(cd);
  for (const [nivel, u] of unidades) {
    const a = pega(nivel, u);
    const p = b.pessoas ?? 0;
    a.pessoas += p; a.area += b.area ?? 0;
    if (b.CD_FCU) a.fcu += p;
    for (const [nome, v] of Object.entries(linha)) {
      const t = (a.tx[nome] ??= { n: 0, d: 0, dTot: 0 });
      if (!v) continue;
      t.dTot += v[1];
      if (v[0] != null) { t.n += v[0]; t.d += v[1]; }
    }
    if (nivel === 'mun') {
      a.setores.push({
        p,
        resp: re?.V06001 ?? null, renda: re?.V06004 ?? null,
        branca: cr?.[V(1317)] ?? null, naoBranca: cr?.[V(1317)] != null && p >= cr[V(1317)] ? p - cr[V(1317)] : null,
      });
    }
  }
}

// Índices de segregação dentro do município (só onde houver ≥ 10 setores com dado).
function dissimilaridade(set, a, b) {
  const s = set.filter((x) => x[a] != null && x[b] != null);
  const A = s.reduce((t, x) => t + x[a], 0), Bt = s.reduce((t, x) => t + x[b], 0);
  if (s.length < 10 || A < 200 || Bt < 200) return null;
  return 50 * s.reduce((t, x) => t + Math.abs(x[a] / A - x[b] / Bt), 0);
}
function cvRenda(set) {
  const s = set.filter((x) => x.resp > 0 && x.renda != null);
  if (s.length < 10) return null;
  const W = s.reduce((t, x) => t + x.resp, 0);
  const m = s.reduce((t, x) => t + x.resp * x.renda, 0) / W;
  const v = s.reduce((t, x) => t + x.resp * (x.renda - m) ** 2, 0) / W;
  return Math.sqrt(v) / m;
}
function rendaMedia(set) {
  const s = set.filter((x) => x.resp > 0 && x.renda != null);
  const W = s.reduce((t, x) => t + x.resp, 0);
  return W ? s.reduce((t, x) => t + x.resp * x.renda, 0) / W : null;
}

for (const [nome, grupo, desc] of TAXAS.filter((t) => t[0] !== 'pct_ate4_moradores')) def(nome, grupo, desc, `Censo 2022, agregados por setor (${TAXAS.find((t) => t[0] === nome)[3]})`, ['mun', 'apond']);
def('hiato_analfabetismo', 'educacao', 'Analfabetismo de pretos e pardos menos o de brancos (pontos %)', 'Censo 2022, universo (SIDRA 9542)');
def('pct_ppi', 'raca', 'Pessoas pretas, pardas ou indígenas (%)', 'Censo 2022, universo (SIDRA 9605)', ['mun', 'apond']);
def('pct_5mais_moradores', 'domicilio', 'Domicílios com 5 ou mais moradores (%)', 'Censo 2022, agregados por setor (domicilio1)', ['mun', 'apond']);
def('pct_favela', 'urbanizacao', 'Pessoas em favelas e comunidades urbanas (%)', 'Censo 2022, malha de setores (CD_FCU)', ['mun', 'apond']);
def('log_densidade', 'controle', 'Densidade de moradores (log10 hab/km²)', 'Censo 2022, básico', ['mun', 'apond']);
def('pct_uso_ocasional', 'domicilio', 'Domicílios de uso ocasional (%)', 'Censo 2022, básico', ['mun', 'apond']);
def('pct_vagos', 'domicilio', 'Domicílios vagos (%)', 'Censo 2022, básico', ['mun', 'apond']);
def('renda_resp_media', 'renda', 'Rendimento médio do responsável (R$)', 'Censo 2022, agregados por setor (renda)', ['mun', 'apond']);
def('cv_renda_setores', 'segregacao', 'Desigualdade de renda entre setores do município (coef. de variação)', 'Censo 2022, agregados por setor (renda)');
def('segregacao_racial', 'segregacao', 'Índice de dissimilaridade brancos × não brancos entre setores', 'Censo 2022, agregados por setor (cor ou raça)');

// Domicílios de uso ocasional e vagos vêm do básico (V0008, V0009, V0003): releio o CSV com as três.
const basExtra = await tabelaCenso('basico', ['V0003', 'V0008', 'V0009']);
for (const [cd, b] of B) {
  const e = basExtra.get(cd);
  for (const [nivel, u] of [['mun', b.CD_MUN], ['apond', deP.get(cd)]]) {
    if (!u) continue;
    const a = pega(nivel, u);
    if (e && e.V0003 != null && e.V0008 != null && e.V0009 != null) { a.dom += e.V0003; a.ocas += e.V0008; a.vagos += e.V0009; }
  }
}

function linhaSetores(nivel, cd, a) {
  const o = { cd };
  for (const [nome] of TAXAS) {
    const t = a.tx[nome];
    o[nome] = t && t.d > 0 && t.d / t.dTot >= COB_MIN ? (t.n / t.d) * TAXAS.find((x) => x[0] === nome)[6] : null;
  }
  o.pct_5mais_moradores = o.pct_ate4_moradores != null ? 100 - o.pct_ate4_moradores : null;
  delete o.pct_ate4_moradores;
  o.pct_ppi = o.pct_branca != null && o.pct_amarela != null ? 100 - o.pct_branca - o.pct_amarela : null;
  o.pct_favela = a.pessoas > 0 ? (100 * a.fcu) / a.pessoas : null;
  o.log_densidade = a.area > 0 && a.pessoas > 0 ? Math.log10(a.pessoas / a.area) : null;
  o.pct_uso_ocasional = a.dom > 0 ? (100 * a.ocas) / a.dom : null;
  o.pct_vagos = a.dom > 0 ? (100 * a.vagos) / a.dom : null;
  o.pessoas = a.pessoas;
  return o;
}

/* ------------------------------------------------------------------ 2. APOND */
const apond = [];
const rendaAp = new Map();
for (const [cd, b] of B) {
  const u = deP.get(cd); const r = TAB.renda.get(cd);
  if (!u || !r || !(r.V06001 > 0) || r.V06004 == null) continue;
  const t = rendaAp.get(u) ?? { w: 0, s: 0 }; t.w += r.V06001; t.s += r.V06001 * r.V06004; rendaAp.set(u, t);
}
for (const [cd, a] of acc.apond) {
  const o = linhaSetores('apond', cd, a);
  const r = rendaAp.get(cd);
  o.renda_resp_media = r && r.w ? r.s / r.w : null;
  o.CD_MUN = cd.slice(0, 7);
  apond.push(o);
}

/* ------------------------------------------------------------------ 3. municípios */
const mun = new Map();
for (const [cd, a] of acc.mun) {
  const o = linhaSetores('mun', cd, a);
  o.renda_resp_media = rendaMedia(a.setores);
  o.cv_renda_setores = cvRenda(a.setores);
  o.segregacao_racial = dissimilaridade(a.setores, 'branca', 'naoBranca');
  o.NM_MUN = [...B.values()].find((b) => b.CD_MUN === cd)?.NM_MUN;
  mun.set(cd, o);
}

// SIDRA (municipal, amostra do Censo 2022).
const S = JSON.parse(readFileSync(join(RAIZ, 'dados-brutos/ibge/sidra-sp/censo2022/indicadores-sidra.json'), 'utf8'));
const sid = (m, k) => m?.[k] ?? null;
const razao = (a, b, f = 100) => (a != null && b != null && b > 0 ? (f * a) / b : null);
const P = { j19: 73022, a19: 73026, j20: 73023, a20: 73025, j21: 73021, a21: 73024, j22: 73020 };
const ob = (m, per, idade = 10917) => sid(m, `obitos_periodo|13136|321:72245/322:${per}/420:${idade}`);
const IDADE60 = [72584, 72585, 72586, 72587, 72588, 72589, 72590, 72591, 72592];
const ob60 = (m, per) => {
  let s = 0;
  for (const i of IDADE60) {
    const k = Object.keys(m).find((x) => x.startsWith('obitos_periodo_60') && x.endsWith(`322:${per}/420:${i}`));
    const v = k ? m[k] : null; if (v == null) return null; s += v;
  }
  return s;
};
const somaN = (...xs) => (xs.some((x) => x == null) ? null : xs.reduce((a, b) => a + b, 0));
const SID = [
  ['obitos_excesso_2020_21', 'mortalidade', 'Óbitos de 2020–21 sobre o dobro dos de 2019 (razão; 1 = sem excesso)'],
  ['obitos_pico_2021', 'mortalidade', 'Óbitos de jan–jul/2021 sobre jan–jul/2019 (razão)'],
  ['obitos_excesso_60mais', 'mortalidade', 'Excesso de óbitos 2020–21, pessoas de 60 anos ou mais (razão)'],
  ['obitos_excesso_menos60', 'mortalidade', 'Excesso de óbitos 2020–21, pessoas com menos de 60 anos (razão)'],
  ['mortalidade_2019', 'mortalidade', 'Óbitos declarados em 2019 por mil moradores'],
  ['anos_estudo', 'educacao', 'Média de anos de estudo, 25 anos ou mais'],
  ['hiato_estudo_raca', 'educacao', 'Anos de estudo de brancos menos os de pardos, 25 anos ou mais'],
  ['hiato_estudo_sexo_jovem', 'educacao', 'Anos de estudo de mulheres menos os de homens, 18 a 24 anos'],
  ['pct_superior', 'educacao', 'Superior completo, 25 anos ou mais (%)'],
  ['pct_sem_fundamental', 'educacao', 'Sem instrução ou fundamental incompleto, 25 anos ou mais (%)'],
  ['pct_mais3_dormitorio', 'domicilio', 'Moradores com mais de 3 pessoas por dormitório (%)'],
  ['pct_sem_maquina_lavar', 'domicilio', 'Moradores sem máquina de lavar roupa (%)'],
  ['pct_sem_internet', 'domicilio', 'Moradores sem internet no domicílio (%)'],
  ['pct_alugado', 'domicilio', 'Moradores em domicílio alugado (%)'],
  ['pct_cedido', 'domicilio', 'Moradores em domicílio cedido (%)'],
  ['pct_parede_sem_reboco', 'domicilio', 'Moradores em casa sem parede revestida (%)'],
  ['nivel_ocupacao', 'trabalho', 'Nível de ocupação, 10 anos ou mais (%)'],
  ['hiato_ocupacao_sexo', 'trabalho', 'Nível de ocupação de homens menos o de mulheres (pontos %)'],
  ['pct_informal', 'trabalho', 'Ocupados que não contribuem para a previdência (%)'],
  ['pct_ocup_agro', 'trabalho', 'Ocupados como trabalhadores qualificados da agropecuária (%)'],
  ['pct_ocup_operarios', 'trabalho', 'Ocupados como operários e operadores de máquinas (%)'],
  ['pct_ocup_elementares', 'trabalho', 'Ocupados em ocupações elementares (%)'],
  ['pct_ocup_profissionais', 'trabalho', 'Ocupados como profissionais das ciências e intelectuais (%)'],
  ['pct_desloc_mais1h', 'mobilidade', 'Ocupados que levam mais de 1 h até o trabalho (%)'],
  ['pct_desloc_ate15min', 'mobilidade', 'Ocupados que levam até 15 min até o trabalho (%)'],
  ['pct_a_pe', 'mobilidade', 'Vão a pé ao trabalho (%)'],
  ['pct_bicicleta', 'mobilidade', 'Vão de bicicleta ao trabalho (%)'],
  ['pct_moto', 'mobilidade', 'Vão de moto ou mototáxi ao trabalho (%)'],
  ['pct_automovel', 'mobilidade', 'Vão de automóvel ao trabalho (%)'],
  ['pct_onibus', 'mobilidade', 'Vão de ônibus, BRT ou van ao trabalho (%)'],
  ['pct_trem_metro', 'mobilidade', 'Vão de trem ou metrô ao trabalho (%)'],
  ['pct_pau_de_arara', 'mobilidade', 'Vão de caminhonete ou caminhão adaptado ao trabalho (%)'],
  ['filhos_por_mulher', 'fecundidade', 'Filhos nascidos vivos por mulher de 12 anos ou mais'],
  ['nascimentos_mil_mulheres', 'fecundidade', 'Nascidos vivos nos 12 meses anteriores por mil mulheres de 12 anos ou mais'],
  ['renda_pc_media', 'renda', 'Rendimento domiciliar per capita médio (R$)'],
  ['renda_pc_mediana', 'renda', 'Rendimento domiciliar per capita mediano (R$)'],
  ['razao_renda_raca', 'renda', 'Mediana per capita de brancos sobre a de pardos (razão)'],
];
for (const [n, g, d] of SID) def(n, g, d, 'Censo 2022, amostra (SIDRA)');
for (const [cd, o] of mun) {
  const m = S[cd] ?? {};
  const a19 = somaN(ob(m, P.j19), ob(m, P.a19)), a20 = somaN(ob(m, P.j20), ob(m, P.a20)), a21 = somaN(ob(m, P.j21), ob(m, P.a21));
  const s19 = somaN(ob60(m, P.j19), ob60(m, P.a19)), s20 = somaN(ob60(m, P.j20), ob60(m, P.a20)), s21 = somaN(ob60(m, P.j21), ob60(m, P.a21));
  // Razões de excesso só com base mínima de 30 óbitos em 2019, para não medir ruído.
  o.obitos_excesso_2020_21 = a19 >= 30 ? razao(somaN(a20, a21), 2 * a19, 1) : null;
  o.obitos_pico_2021 = ob(m, P.j19) >= 20 ? razao(ob(m, P.j21), ob(m, P.j19), 1) : null;
  o.obitos_excesso_60mais = s19 >= 30 ? razao(somaN(s20, s21), 2 * s19, 1) : null;
  const u19 = a19 != null && s19 != null ? a19 - s19 : null;
  o.obitos_excesso_menos60 = u19 >= 20 ? razao(somaN(a20, a21) - somaN(s20, s21), 2 * u19, 1) : null;
  o.mortalidade_2019 = razao(a19, o.pessoas, 1000);
  const ae = (sx, id, rc) => sid(m, `anos_estudo|13285|2:${sx}/58:${id}/86:${rc}`);
  o.anos_estudo = ae(6794, 108866, 95251);
  o.hiato_estudo_raca = ae(6794, 108866, 2776) != null && ae(6794, 108866, 2779) != null ? ae(6794, 108866, 2776) - ae(6794, 108866, 2779) : null;
  o.hiato_estudo_sexo_jovem = ae(5, 100052, 95251) != null && ae(4, 100052, 95251) != null ? ae(5, 100052, 95251) - ae(4, 100052, 95251) : null;
  const ins = (c) => sid(m, `instrucao|2667|2:6794/58:108866/86:95251/1568:${c}`);
  o.pct_superior = razao(ins(99713), ins(120704));
  o.pct_sem_fundamental = razao(ins(9493), ins(120704));
  const mor = (t, c, cat) => sid(m, `${t}|382|58:95253/86:95251/${c}:${cat}`);
  const mor2 = (t, c, cat) => sid(m, `${t}|382|58:95253/${c}:${cat}/86:95251`);
  o.pct_mais3_dormitorio = razao(mor('dormitorio', 1975, 73090), mor('dormitorio', 1975, 73086));
  o.pct_sem_maquina_lavar = razao(mor('maquina_lavar', 1977, 73093), mor('maquina_lavar', 1977, 73091));
  o.pct_sem_internet = razao(mor('internet', 2072, 77586), mor('internet', 2072, 77584));
  o.pct_alugado = razao(mor2('condicao_ocupacao', 63, 1055), mor2('condicao_ocupacao', 63, 95826));
  o.pct_cedido = razao(mor2('condicao_ocupacao', 63, 73553), mor2('condicao_ocupacao', 63, 95826));
  const par = (cat) => sid(m, `paredes|382|58:95253/86:95251/137:${cat}`);
  o.pct_parede_sem_reboco = par(13233) ? 100 - razao(par(73073), par(13233)) : null;
  const oc = (sx) => sid(m, `ocupacao|675|2:${sx}/58:95253/86:95251`);
  o.nivel_ocupacao = oc(6794);
  o.hiato_ocupacao_sexo = oc(4) != null && oc(5) != null ? oc(4) - oc(5) : null;
  o.pct_informal = razao(sid(m, 'previdencia|4090|2:6794/86:95251/526:15351/12064:100971'), sid(m, 'previdencia|4090|2:6794/86:95251/526:15349/12064:100971'));
  const og = (c) => sid(m, `ocupacao_grupos|4090|2:6794/86:95251/526:15349/12064:${c}`);
  o.pct_ocup_agro = razao(og(12635), og(100971));
  o.pct_ocup_operarios = razao(somaN(og(12636), og(12637)), og(100971));
  o.pct_ocup_elementares = razao(og(12638), og(100971));
  o.pct_ocup_profissionais = razao(og(12631), og(100971));
  const dt = (c) => sid(m, `deslocamento_tempo|13377|58:95253/86:95251/537:${c}/1568:120704`);
  o.pct_desloc_mais1h = razao(somaN(dt(19432), dt(79191), dt(79192)), dt(31609));
  o.pct_desloc_ate15min = razao(somaN(dt(19429), dt(79189)), dt(31609));
  const dm = (c) => sid(m, `deslocamento_meio|13377|86:95251/1568:120704/2088:${c}`);
  const tot = dm(79488);
  o.pct_a_pe = razao(dm(79193), tot);
  o.pct_bicicleta = razao(dm(79194), tot);
  o.pct_moto = razao(somaN(dm(79195), dm(79196)), tot);
  o.pct_automovel = razao(dm(79197), tot);
  o.pct_onibus = razao(somaN(dm(79208), dm(79209), dm(79207)), tot);
  o.pct_trem_metro = razao(dm(79210), tot);
  o.pct_pau_de_arara = razao(dm(79211), tot);
  const fe = (v) => sid(m, `fecundidade|${v}|1568:120704/12232:58896/12293:58898`);
  o.filhos_por_mulher = razao(fe(13316), fe(13315), 1);
  o.nascimentos_mil_mulheres = razao(fe(13317), fe(13315), 1000);
  const rp = (v, rc) => sid(m, `renda_pc|${v}|2:6794/58:95253/86:${rc}`);
  o.renda_pc_media = rp(13431, 95251);
  o.renda_pc_mediana = rp(13534, 95251);
  const cr = (c) => sid(m, `cor_raca|93|86:${c}`);
  o.pct_branca = razao(cr(2776), cr(95251)); o.pct_preta = razao(cr(2777), cr(95251)); o.pct_parda = razao(cr(2779), cr(95251));
  o.pct_amarela = razao(cr(2778), cr(95251)); o.pct_indigena = razao(cr(2780), cr(95251));
  o.pct_ppi = razao(somaN(cr(2777), cr(2779), cr(2780)), cr(95251));
  const al = (c, rc) => sid(m, `alfabetizacao|950|2:6794/59:${c}/86:${rc}/287:100362`);
  o.pct_analfabeto = razao(al(1024, 95251), al(93024, 95251));
  const tx = (rc) => razao(al(1024, rc), al(93024, rc));
  o.hiato_analfabetismo = al(93024, 2779) >= 200 && al(93024, 2776) >= 200 ? (tx(2777) != null && al(93024, 2777) >= 100
    ? razao(al(1024, 2777) + al(1024, 2779), al(93024, 2777) + al(93024, 2779)) : tx(2779)) - tx(2776) : null;
  const ag = (c) => sid(m, `agua|381|301:${c}/1817:72125`);
  o.pct_agua_rede = razao(ag(31471), ag(72053)); o.pct_poco = razao(somaN(ag(72054), ag(72055)), ag(72053));
  const es = (c) => sid(m, `esgoto|381|11558:${c}`);
  o.pct_esgoto_rede = razao(es(46290), es(46292)); o.pct_fossa_rudimentar = razao(es(72113), es(46292));
  const lx = (c) => sid(m, `lixo|381|67:${c}`);
  o.pct_lixo_coletado = razao(lx(2520), lx(10972)); o.pct_lixo_queimado = razao(lx(72122), lx(10972));
  o.razao_renda_raca = rp(13534, 2779) > 0 && rp(13534, 2776) != null ? rp(13534, 2776) / rp(13534, 2779) : null;
}

/* ------------------------------------------------------------------ 4. território e energia (pranchas) */
async function csv(rel) {
  const out = new Map(); let cab = null;
  for await (const l of linhasCsv(join(RAIZ, 'mapas', rel), { sep: ',' })) {
    if (!cab) { cab = l; continue; }
    out.set(l[0], Object.fromEntries(cab.map((c, i) => [c, l[i] === '' ? null : Number.isNaN(Number(l[i])) ? l[i] : Number(l[i])])));
  }
  return out;
}
const T055 = await csv('055-densidade-do-biometano-sp/dados/sp_biogas_territorio_municipios.csv');
const T062 = await csv('062-renda-e-solar-sp/dados/sp_renda_solar.csv');
const T064 = await csv('064-idade-e-sexo-sp/dados/sp_gente_municipios_2022.csv');
const T076 = await csv('076-bioeconomia-no-emprego-sp/dados/sp_bioeconomia_municipios_2025.csv');
const T045 = await csv('045-tabuleiro-agricola-sp/dados/sp_uso_agropecuario_2024.csv');
const T081 = await csv('081-nitrogenio-dos-dejetos-sp/dados/sp_nutrientes_dejetos_2024.csv');
const T029 = await csv('029-rebanhos-sp/dados/sp_rebanhos_2024.csv');
const T030 = await csv('030-cana-de-acucar-sp/dados/sp_cana_2024.csv');
const T091 = await csv('091-co2-biogenico-e-fossil-sp/dados/sp_carbono_municipios.csv');
const lg = (v) => (v != null && v > 0 ? Math.log10(v) : null);
const TER = [
  ['pct_urbana', 'controle', 'Moradores em situação urbana (%)', 'Censo 2022 (prancha 066)'],
  ['idade_mediana', 'demografia', 'Idade mediana', 'Censo 2022, SIDRA 9515 (prancha 064)'],
  ['log_biometano_hab', 'energia', 'Potencial de biometano por habitante (log10 m³/dia/hab)', 'CP2B v5.1, N4 (prancha 055)'],
  ['log_biometano_km2', 'energia', 'Potencial de biometano por km² (log10 m³/dia/km²)', 'CP2B v5.1, N4 (prancha 055)'],
  ['pct_biometano_cana', 'energia', 'Parte da cana no potencial de biometano (%)', 'CP2B v5.1, N4 (prancha 055)'],
  ['pct_biometano_pecuaria', 'energia', 'Parte da pecuária no potencial de biometano (%)', 'CP2B v5.1, N4 (prancha 055)'],
  ['km_gasoduto', 'infraestrutura', 'Distância ao gasoduto mais próximo (km)', 'ANP/EPE (prancha 057)'],
  ['km_subestacao', 'infraestrutura', 'Distância à subestação mais próxima (km)', 'ANEEL/EPE (prancha 058)'],
  ['solar_w_dom', 'energia', 'Geração solar distribuída por domicílio (W)', 'ANEEL (prancha 062)'],
  ['pct_bioeconomia', 'bioeconomia', 'Vínculos formais na bioeconomia (%)', 'RAIS 2025 (prancha 076)'],
  ['residuos_10mil', 'bioeconomia', 'Vínculos em resíduos e esgoto por 10 mil hab.', 'RAIS 2025 (prancha 080)'],
  ['pct_ind_residuo', 'bioeconomia', 'Vínculos em indústrias geradoras de resíduo orgânico (% dos vínculos)', 'RAIS 2025 (prancha 078)'],
  ['vinculos_por_hab', 'trabalho', 'Vínculos formais por habitante', 'RAIS 2025 e Censo 2022'],
  ['pct_area_cana', 'agro', 'Área com cana (%)', 'MapBiomas C10 (prancha 045)'],
  ['pct_area_pastagem', 'agro', 'Área com pastagem (%)', 'MapBiomas C10 (prancha 045)'],
  ['pct_area_nativa', 'territorio', 'Área com vegetação nativa (%)', 'MapBiomas C10 (prancha 045)'],
  ['pct_area_silvicultura', 'agro', 'Área com silvicultura (%)', 'MapBiomas C10 (prancha 045)'],
  ['pct_area_citros', 'agro', 'Área com citros (%)', 'MapBiomas C10 (prancha 045)'],
  ['n_kg_ha_agro', 'agro', 'Nitrogênio dos dejetos por ha agropecuário (kg)', 'PPM 2024 e coeficientes (prancha 081)'],
  ['log_dens_bovino', 'agro', 'Bovinos por km² (log10)', 'PPM 2024 (prancha 029)'],
  ['log_dens_aves', 'agro', 'Galináceos por km² (log10)', 'PPM 2024 (prancha 029)'],
  ['cana_t_ha', 'agro', 'Rendimento da cana (t/ha)', 'PAM 2024 (prancha 030)'],
  ['log_co2_biogenico_hab', 'energia', 'CO₂ biogênico por habitante (log10 t)', 'pranchas 089–091'],
];
for (const [n, g, d, f] of TER) def(n, g, d, f);
for (const [cd, o] of mun) {
  const a = T055.get(cd) ?? {}, s = T062.get(cd) ?? {}, g = T064.get(cd) ?? {}, b = T076.get(cd) ?? {}, u = T045.get(cd) ?? {};
  const n = T081.get(cd) ?? {}, r = T029.get(cd) ?? {}, c = T030.get(cd) ?? {}, k = T091.get(cd) ?? {};
  o.pct_urbana = g.pct_rural != null ? 100 - g.pct_rural : null;
  o.idade_mediana = g.idade_mediana ?? null;
  o.log_biometano_hab = lg(a.m3d_por_hab);
  o.log_biometano_km2 = lg(a.m3d_por_km2);
  o.pct_biometano_cana = a.biometano_m3d > 0 ? (100 * a.cana_m3d) / a.biometano_m3d : null;
  o.pct_biometano_pecuaria = a.biometano_m3d > 0 ? (100 * a.pecuaria_m3d) / a.biometano_m3d : null;
  o.km_gasoduto = a.km_gasoduto ?? null;
  o.km_subestacao = a.km_subestacao ?? null;
  o.solar_w_dom = s.w_por_dom ?? null;
  o.pct_bioeconomia = b.pct_bio ?? null;
  o.residuos_10mil = b.res_10mil ?? null;
  o.pct_ind_residuo = b.vinculos > 0 ? (100 * b.ger) / b.vinculos : null;
  o.vinculos_por_hab = o.pessoas > 0 && b.vinculos != null ? b.vinculos / o.pessoas : null;
  o.pct_area_cana = u.pct_cana ?? null;
  o.pct_area_pastagem = u.pct_pastagem ?? null;
  o.pct_area_nativa = u.pct_nativa ?? null;
  o.pct_area_silvicultura = u.pct_silvicultura ?? null;
  o.pct_area_citros = u.pct_citros ?? null;
  o.n_kg_ha_agro = n.n_kg_ha_agro ?? null;
  o.log_dens_bovino = lg(r.dens_bovino);
  o.log_dens_aves = lg(r.dens_galinaceos);
  o.cana_t_ha = c.rendimento_t_ha ?? null;
  o.log_co2_biogenico_hab = o.pessoas > 0 ? lg(k.co2_biogenico_t / o.pessoas) : null;
}
def('log_renda_pc', 'controle', 'Rendimento domiciliar per capita médio (log10 R$)', 'Censo 2022, amostra (SIDRA 10295)');
for (const o of mun.values()) o.log_renda_pc = lg(o.renda_pc_media);

/* ------------------------------------------------------------------ 5. gravar */
const nomes = Object.keys(VARS);
const gravar = (arq, linhas, cols) => writeFileSync(arq, [cols.join(','), ...linhas.map((o) => cols.map((c) => {
  const v = o[c]; if (v == null || (typeof v === 'number' && !Number.isFinite(v))) return '';
  return typeof v === 'number' ? +v.toFixed(6) : `"${String(v).replace(/"/g, '""')}"`;
}).join(','))].join('\n'));
const ML = [...mun.values()].sort((a, b) => a.cd.localeCompare(b.cd));
gravar(join(OUT, 'municipios.csv'), ML, ['cd', 'NM_MUN', 'pessoas', ...nomes]);
const AP = nomes.filter((n) => VARS[n].nivel.includes('apond'));
gravar(join(OUT, 'apond.csv'), apond.sort((a, b) => a.cd.localeCompare(b.cd)), ['cd', 'CD_MUN', 'pessoas', ...AP]);
for (const n of nomes) {
  const vals = ML.map((o) => o[n]).filter((v) => v != null && Number.isFinite(v));
  VARS[n].n_mun = vals.length;
  VARS[n].faltam = ML.length - vals.length;
}
writeFileSync(join(OUT, 'variaveis.json'), JSON.stringify(VARS, null, 1));
console.log(`municípios ${ML.length} · APOND ${apond.length} · variáveis ${nomes.length}`);
for (const n of nomes) if (VARS[n].faltam > 30) console.log(`  ${n}: faltam ${VARS[n].faltam}`);
