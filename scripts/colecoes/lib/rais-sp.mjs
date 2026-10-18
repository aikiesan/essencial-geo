/**
 * RAIS Estabelecimentos (arquivo público do PDET/MTE): lê o arquivo nacional em fluxo e grava
 *   dados-brutos/rais/rais_estab_sp.csv  — os estabelecimentos de SP (UF 35), só as colunas úteis;
 *   dados-brutos/rais/rais_br_subclasse.csv — vínculos ativos e estabelecimentos por subclasse CNAE no Brasil.
 * Uso: node scripts/colecoes/lib/rais-sp.mjs [caminho do RAIS_ESTAB_PUB.COMT]
 */
import { createReadStream, mkdirSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { join } from 'node:path';
import { BRUTOS } from './dados.mjs';

const ORIGEM = process.argv[2] ?? 'A:/DADOS_CAGED_CAROL_PESQUISA/RAIS_ESTAB_PUB/RAIS_ESTAB_PUB.COMT';
const DESTINO = join(BRUTOS, 'rais');
mkdirSync(DESTINO, { recursive: true });

const limpa = (v) => (v ?? '').replace(/"/g, '').trim();
const leitor = createInterface({ input: createReadStream(ORIGEM, { encoding: 'latin1' }), crlfDelay: Infinity });
let cab = null;
let idx = null;
const sp = ['cnae_subclasse,cnae_classe,cd_mun6,vinculos_ativos,vinculos_clt,vinculos_estatutarios,tamanho,tipo,natureza_juridica,ind_atividade,rais_negativa,simples,cep'];
const br = new Map();
let n = 0, nSp = 0, vincBr = 0, vincSp = 0;
for await (const linha of leitor) {
  const c = linha.split(',');
  if (!cab) { cab = c.map(limpa); idx = Object.fromEntries(cab.map((k, j) => [k, j])); console.log(cab.join(' | ')); continue; }
  n++;
  const i = (nome) => idx[nome];
  const sub = limpa(c[i('CNAE 2.0 Subclasse - Codigo')]).padStart(7, '0');
  const ativos = Number(c[i('Qtd Vínculos Ativos')]) || 0;
  const neg = limpa(c[i('Ind RAIS Negativa - Código')]);
  const o = br.get(sub) ?? { estab: 0, vinculos: 0 };
  o.estab += neg === '1' ? 0 : 1; o.vinculos += ativos; br.set(sub, o);
  vincBr += ativos;
  if (limpa(c[i('UF - Código')]) !== '35') continue;
  nSp++; vincSp += ativos;
  sp.push([sub, limpa(c[i('CNAE 2.0 Classe - Código')]).padStart(5, '0'), limpa(c[i('Município - Código')]), ativos,
    Number(c[i('Qtd Vínculos CLT')]) || 0, Number(c[i('Qtd Vínculos Estatutários')]) || 0,
    limpa(c[i('Tamanho Estabelecimento - Código')]), limpa(c[i('Tipo Estabelecimento - Código')]),
    limpa(c[i('Natureza Jurídica - Código')]), limpa(c[i('Ind Atividade Ano - Código')]), neg,
    limpa(c[i('Ind Estab Participante SIMPLES - Código')]), limpa(c[i('CEP Estab')])].join(','));
}
writeFileSync(join(DESTINO, 'rais_estab_sp.csv'), sp.join('\n') + '\n');
writeFileSync(join(DESTINO, 'rais_br_subclasse.csv'),
  ['cnae_subclasse,estabelecimentos,vinculos_ativos', ...[...br].sort().map(([k, o]) => `${k},${o.estab},${o.vinculos}`)].join('\n') + '\n');
console.log(`linhas ${n} · SP ${nSp} · vínculos ativos Brasil ${vincBr} · SP ${vincSp}`);
