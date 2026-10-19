// Coleção «Mulheres responsáveis pelo domicílio» (mulheres-responsaveis-sp), passo 1. Baixa do SIDRA (API v3 do IBGE)
// as tabelas municipais que os agregados por setor não trazem: composição do domicílio por sexo do responsável (2022),
// rendimento das pessoas de 14 anos ou mais por sexo (2022, amostra), iluminação pública no entorno (2022) e,
// para comparar, o sexo do responsável e a energia elétrica em 2010.
// Saída: dados-brutos/ibge/sidra-sp/mulheres/<chave>.json (resposta crua) e indicadores.json ({ CD_MUN: { chave: valor } }).
// No SIDRA "-" é zero absoluto; "X" (sigilo), ".." e "..." viram null.
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BRUTOS } from '../lib/dados.mjs';

const DIR = join(BRUTOS, 'ibge', 'sidra-sp', 'mulheres');
mkdirSync(DIR, { recursive: true });
const LOC = 'N6[N3[35]]';

const PEDIDOS = [
  // 2022 · universo
  { chave: 'conjuge_filhos', t: 9882, ano: 2022, v: 800, c: { 1887: 'all', 11561: [100679, 100680, 100681] } },
  { chave: 'iluminacao', t: 9583, ano: 2022, v: 9599, c: { 125: [2932], 14: [200, 72254, 72255, 72256] } },
  // 2022 · amostra
  { chave: 'renda_sexo', t: 10299, ano: 2022, v: '1641|13502|13503', c: { 2: [6794, 4, 5], 629: [32385], 58: [95253] } },
  // 2010 · para comparar
  { chave: 'resp_sexo_2010', t: 3221, ano: 2010, v: 96, c: { 317: [0], 11561: [0, 100680, 100681], 11562: [0], 12237: [0], 11563: [0], 11565: [0] } },
  { chave: 'energia_2010', t: 3217, ano: 2010, v: 96, c: { 1: [0], 61: [0], 67: [0], 309: [0, 3011, 3017, 3018] } },
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
  const url = `https://servicodados.ibge.gov.br/api/v3/agregados/${p.t}/periodos/${p.ano}/variaveis/${p.v}?localidades=${LOC}&classificacao=${cls}`;
  const dados = existsSync(arq) ? JSON.parse(readFileSync(arq, 'utf8')) : await pegar(url);
  writeFileSync(arq, JSON.stringify(dados));
  let n = 0;
  for (const v of dados) {
    for (const r of v.resultados) {
      // Chave: <pedido>|<variável>|<classificação:categoria>/...
      const cats = r.classificacoes.map((c) => `${c.id}:${Object.keys(c.categoria)[0]}`).join('/');
      for (const s of r.series) {
        const cd = s.localidade.id;
        (out[cd] ??= {})[`${p.chave}|${v.id}|${cats}`] = num(s.serie[String(p.ano)]);
        n++;
      }
    }
  }
  console.log(`${p.chave} · tabela ${p.t} · ${n} valores`);
}
writeFileSync(join(DIR, 'indicadores.json'), JSON.stringify(out));
console.log(`✓ ${Object.keys(out).length} municípios`);
