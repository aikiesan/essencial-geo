/**
 * Censo 2022, agregados por setor censitário: extrai só São Paulo (setores 35…) de cada grupo, uma vez.
 *
 *   node scripts/colecoes/censo-extrair-sp.mjs [grupo ...] [--refazer]
 *
 * Lê em fluxo os arquivos do Brasil inteiro em dados-brutos/ibge/agregados-setores-br/ (CSV quando há,
 * planilha lida direto do ZIP do XLSX) e grava dados-brutos/ibge/sp/<grupo>.csv (separador ";", chave CD_SETOR).
 * Os valores ficam como o IBGE os publica: "X" é sigilo (sem informação, nunca zero).
 */
import { createWriteStream, existsSync, mkdirSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { BRUTOS, linhasCsv, linhasXlsx } from './lib/dados.mjs';

const BR = join(BRUTOS, 'ibge', 'agregados-setores-br');
const SP = join(BRUTOS, 'ibge', 'sp');

const GRUPOS = {
  domicilio2: 'Agregados_por_setores_caracteristicas_domicilio2_BR_20250417/Agregados_por_setores_caracteristicas_domicilio2_BR_20250417.csv',
  domicilio3: 'Agregados_por_setores_caracteristicas_domicilio3_BR_20250417/Agregados_por_setores_caracteristicas_domicilio3_BR_20250417.csv',
  domicilio1: 'Agregados_por_setores_caracteristicas_domicilio1_BR/Agregados_por_setores_caracteristicas_domicilio1_BR.xlsx',
  basico: 'Agregados_por_setores_basico_BR_20260520/Agregados_por_setores_basico_BR.xlsx',
  renda: 'Agregados_por_setores_renda_responsavel_BR_20260508_xlsx/Agregados_por_setores_renda_responsavel_BR.xlsx',
  demografia: 'Agregados_por_setores_demografia_BR/Agregados_por_setores_demografia_BR.xlsx',
};

const campo = (v) => {
  const s = String(v ?? '').trim();
  return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

async function extrair(grupo, refazer) {
  const origem = join(BR, GRUPOS[grupo]);
  const destino = join(SP, `${grupo}.csv`);
  if (existsSync(destino) && !refazer) { console.log(`= ${grupo}: já extraído`); return; }
  mkdirSync(SP, { recursive: true });
  const tmp = `${destino}.parcial`;
  const saida = createWriteStream(tmp, 'utf8');
  const t0 = Date.now();
  let n = 0, total = 0, chave = -1;
  const linhas = origem.endsWith('.csv') ? linhasCsv(origem) : linhasXlsx(origem);
  for await (const l of linhas) {
    if (chave < 0) {
      chave = l.findIndex((c) => ['CD_SETOR', 'SETOR', 'CD_SETOR_CENSITARIO'].includes(String(c).trim().toUpperCase()));
      if (chave < 0) throw new Error(`${grupo}: sem coluna de setor`);
      l[chave] = 'CD_SETOR';
      saida.write(l.map(campo).join(';') + '\n');
      continue;
    }
    total++;
    if (String(l[chave]).startsWith('35')) {
      if (!saida.write(l.map(campo).join(';') + '\n')) await new Promise((r) => saida.once('drain', r));
      n++;
    }
  }
  await new Promise((r) => saida.end(r));
  renameSync(tmp, destino);
  console.log(`✓ ${grupo}: ${n.toLocaleString('pt-BR')} setores de SP de ${total.toLocaleString('pt-BR')} · ${Math.round((Date.now() - t0) / 1000)} s`);
}

const args = process.argv.slice(2);
const refazer = args.includes('--refazer');
const grupos = args.filter((a) => !a.startsWith('--'));
for (const g of grupos.length ? grupos : Object.keys(GRUPOS)) await extrair(g, refazer);
