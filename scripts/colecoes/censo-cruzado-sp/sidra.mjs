// Coleção «O Censo cruzado» (censo-cruzado-sp), passo 1 de 3. Baixa do SIDRA (API v3 do IBGE) tabelas municipais do Censo 2022 para os 645 municípios de SP.
// Saída: dados-brutos/ibge/sidra-sp/censo2022/<chave>.json (resposta crua) e indicadores-sidra.json
// ({ CD_MUN: { chave: valor } }). No SIDRA "-" é zero absoluto; "X" (sigilo), ".." e "..." viram null.
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BRUTOS } from '../lib/dados.mjs';

const DIR = join(BRUTOS, 'ibge', 'sidra-sp', 'censo2022');
mkdirSync(DIR, { recursive: true });
const LOC = 'N6[N3[35]]';

// Cada pedido: tabela, variável e classificações; `cats` nomeia cada combinação que interessa.
const PEDIDOS = [
  { chave: 'obitos_periodo', t: 6584, v: 13136, c: { 322: 'all', 321: [72245], 420: [10917] } },
  { chave: 'obitos_periodo_60a', t: 6584, v: 13136, c: { 322: 'all', 321: [72245], 420: [72584, 72585, 72586] } },
  { chave: 'obitos_periodo_60b', t: 6584, v: 13136, c: { 322: 'all', 321: [72245], 420: [72587, 72588, 72589] } },
  { chave: 'obitos_periodo_60c', t: 6584, v: 13136, c: { 322: 'all', 321: [72245], 420: [72590, 72591, 72592] } },
  { chave: 'obitos_menos1', t: 6584, v: 13136, c: { 322: [72249], 321: [72245], 420: [10917, 10918] } },
  { chave: 'anos_estudo', t: 10062, v: 13285, c: { 58: [108866, 100052], 2: [6794, 4, 5], 86: [95251, 2776, 2777, 2779] } },
  { chave: 'instrucao', t: 10061, v: 2667, c: { 1568: [120704, 9493, 99713], 58: [108866], 2: [6794], 86: [95251] } },
  { chave: 'dormitorio', t: 9940, v: 382, c: { 1975: [73086, 73089, 73090], 86: [95251], 58: [95253] } },
  { chave: 'maquina_lavar', t: 9941, v: 382, c: { 1977: [73091, 73093], 86: [95251], 58: [95253] } },
  { chave: 'internet', t: 9942, v: 382, c: { 2072: [77584, 77586], 86: [95251], 58: [95253] } },
  { chave: 'condicao_ocupacao', t: 9938, v: 382, c: { 63: [95826, 1055, 73553], 86: [95251], 58: [95253] } },
  { chave: 'paredes', t: 9937, v: 382, c: { 137: [13233, 73073], 86: [95251], 58: [95253] } },
  { chave: 'ocupacao', t: 10268, v: 675, c: { 2: [6794, 4, 5], 86: [95251], 58: [95253] } },
  { chave: 'previdencia', t: 10264, v: 4090, c: { 2: [6794], 86: [95251], 526: [15349, 15351], 12064: [100971] } },
  { chave: 'ocupacao_grupos', t: 10264, v: 4090, c: { 2: [6794], 86: [95251], 526: [15349], 12064: 'all' } },
  { chave: 'deslocamento_tempo', t: 10333, v: 13377, c: { 537: 'all', 1568: [120704], 58: [95253], 86: [95251] } },
  { chave: 'deslocamento_meio', t: 10332, v: 13377, c: { 2088: 'all', 1568: [120704], 86: [95251] } },
  { chave: 'fecundidade', t: 10078, v: '13315|13316|13317', c: { 12232: [58896], 1568: [120704], 12293: [58898] } },
  { chave: 'renda_pc', t: 10295, v: '13431|13534', c: { 2: [6794], 86: [95251, 2776, 2777, 2779], 58: [95253] } },
  // Universo, sem sigilo no nível municipal (no setor há muitos X nestas variáveis).
  { chave: 'cor_raca', t: 9605, v: 93, c: { 86: 'all' } },
  { chave: 'alfabetizacao', t: 9542, v: 950, c: { 59: [93024, 1024], 2: [6794], 86: [95251, 2776, 2777, 2779], 287: [100362] } },
  { chave: 'agua', t: 6804, v: 381, c: { 301: [72053, 31471, 72054, 72055], 1817: [72125] } },
  { chave: 'esgoto', t: 6805, v: 381, c: { 11558: 'all' } },
  { chave: 'lixo', t: 6892, v: 381, c: { 67: 'all' } },
];

const espera = (ms) => new Promise((r) => setTimeout(r, ms));
async function pegar(url) {
  for (let i = 0; i < 4; i++) {
    const r = await fetch(url);
    if (r.ok) return r.json();
    console.log(`  ${r.status} · nova tentativa`);
    await espera(3000 * (i + 1));
  }
  throw new Error(`falhou: ${url}`);
}

const out = {};
const num = (s) => (String(s).trim() === '-' ? 0 : s == null || !/^-?\d+(\.\d+)?$/.test(String(s).trim()) ? null : Number(s));
for (const p of PEDIDOS) {
  const arq = join(DIR, `${p.chave}.json`);
  const cls = Object.entries(p.c).map(([id, cs]) => `${id}[${cs === 'all' ? 'all' : cs.join(',')}]`).join('|');
  const url = `https://servicodados.ibge.gov.br/api/v3/agregados/${p.t}/periodos/2022/variaveis/${p.v}?localidades=${LOC}&classificacao=${cls}`;
  const dados = existsSync(arq) ? JSON.parse(readFileSync(arq, 'utf8')) : await pegar(url);
  writeFileSync(arq, JSON.stringify(dados));
  let n = 0;
  for (const v of dados) for (const r of v.resultados) {
    const rot = r.classificacoes.map((c) => `${c.id}:${Object.keys(c.categoria)[0]}`).join('/');
    for (const s of r.series) {
      const cd = s.localidade.id;
      (out[cd] ??= {})[`${p.chave}|${v.id}|${rot}`] = num(s.serie['2022']);
      n++;
    }
  }
  console.log(`${p.chave}: ${n} valores`);
  await espera(800);
}
writeFileSync(join(DIR, 'indicadores-sidra.json'), JSON.stringify(out));
console.log('municípios:', Object.keys(out).length);
