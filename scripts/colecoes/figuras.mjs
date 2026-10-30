#!/usr/bin/env node
/**
 * Refaz só as figuras de reuso (mapa_figura.png) das coleções, sem tocar nas pranchas.
 *
 *   node scripts/colecoes/figuras.mjs                 todas as coleções
 *   node scripts/colecoes/figuras.mjs agua-sp rmc     só estas
 *   node scripts/colecoes/figuras.mjs estados         só a série «Brasil, estado por estado»
 *
 * Roda cada scripts/colecoes/<coleção>/prancha.mjs <tema> com SO_FIGURA=1; pula os temas cujo mapa
 * ainda não tem pasta em mapas/ (resultados que ficam só no disco, como os de artigo).
 */
import { readdir, readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('../..', import.meta.url));
const AQUI = join(RAIZ, 'scripts', 'colecoes');
const existe = (p) => access(p).then(() => true, () => false);

const pedidas = process.argv.slice(2);
const colecoes = [];
for (const d of (await readdir(AQUI, { withFileTypes: true })).filter((d) => d.isDirectory())) {
  if (pedidas.length && !pedidas.includes(d.name)) continue;
  if (await existe(join(AQUI, d.name, 'prancha.mjs')) && await existe(join(AQUI, d.name, 'serie.json'))) colecoes.push(d.name);
}

const falhas = [];
let feitas = 0;
for (const c of colecoes) {
  const serie = JSON.parse(await readFile(join(AQUI, c, 'serie.json'), 'utf8'));
  for (const e of serie) {
    if (!(await existe(join(RAIZ, 'mapas', e.pasta)))) continue;
    const r = spawnSync(process.execPath, [join(AQUI, c, 'prancha.mjs'), e.tema], { cwd: RAIZ, env: { ...process.env, SO_FIGURA: '1' }, stdio: 'inherit' });
    if (r.status === 0) feitas++;
    else falhas.push(`${c} ${e.tema} (Nº ${e.numero})`);
  }
}
// A série «Brasil, estado por estado» tem prancha própria (scripts/estados/prancha.mjs).
if (!pedidas.length || pedidas.includes('estados')) {
  for (const e of JSON.parse(await readFile(join(RAIZ, 'scripts', 'estados', 'serie.json'), 'utf8'))) {
    if (!(await existe(join(RAIZ, 'mapas', e.pasta)))) continue;
    const r = spawnSync(process.execPath, [join(RAIZ, 'scripts', 'estados', 'prancha.mjs'), e.uf, '--pasta', e.pasta, '--numero', String(e.numero), '--data', e.data, '--so-figura'], { cwd: RAIZ, stdio: 'inherit' });
    if (r.status === 0) feitas++;
    else falhas.push(`estados ${e.uf} (Nº ${e.numero})`);
  }
}
console.log(`\n${feitas} figuras${falhas.length ? ` · ${falhas.length} falhas:\n  ${falhas.join('\n  ')}` : ''}`);
if (falhas.length) process.exitCode = 1;
