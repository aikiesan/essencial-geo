#!/usr/bin/env node
/**
 * Copia os arquivos públicos de cada pasta em /mapas para /public/mapas,
 * de onde o site os serve para download (PDF, PNG 300 dpi, GPKG, DXF…).
 * O README.md não é copiado: ele já é lido pelo Astro como conteúdo.
 *
 * Arquivos muito grandes não devem ir para o Git: publique-os como anexos de
 * release (ou direto no Zenodo) e use `url:` no frontmatter em vez de `arquivo:`.
 *
 * Com `--publicadas` (usado no `npm run build`), só copia as pastas que já estão
 * no ar: fora de rascunho e com data + SITE.horaPublicacaoUtc já passada, a mesma
 * regra de noAr em src/lib/mapas.ts. Sem a opção (`npm run dev`), copia tudo,
 * porque o painel /admin/ e as prévias das agendadas precisam dos arquivos.
 */
import { cp, mkdir, readdir, readFile, rm, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';
import { parse } from 'yaml';
import { SITE } from '../src/site.config.ts';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
const ORIGEM = join(RAIZ, 'mapas');
const DESTINO = join(RAIZ, 'public', 'mapas');
const IGNORAR = new Set(['README.md', 'README.en.md', '.DS_Store', 'Thumbs.db']);
const LIMITE_AVISO = 50 * 1024 * 1024; // GitHub recusa > 100 MB e avisa > 50 MB
const SO_PUBLICADAS = process.argv.includes('--publicadas');
const AGORA = new Date();

/** A pasta de prancha (mapas/NNN-*) já está no ar? Mesma regra de noAr em src/lib/mapas.ts. */
async function noAr(pasta) {
  let texto;
  try {
    texto = await readFile(join(pasta, 'README.md'), 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') return false; // sem README não há página nem data a conferir
    throw e;
  }
  const bloco = texto.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const dados = bloco ? parse(bloco[1]) ?? {} : {};
  if (dados.rascunho === true) return false;
  const dia = new Date(dados.data); // como z.coerce.date(): 'AAAA-MM-DD' = meia-noite UTC
  if (Number.isNaN(dia.getTime())) return false;
  return dia.getTime() + SITE.horaPublicacaoUtc * 3600_000 <= AGORA.getTime();
}

await rm(DESTINO, { recursive: true, force: true });
await mkdir(DESTINO, { recursive: true });

let copiados = 0;
let bytes = 0;
let puladas = 0;

async function copiar(dir) {
  for (const nome of await readdir(dir)) {
    if (IGNORAR.has(nome) || nome.startsWith('_')) continue;
    // Anexos de release (fora do Git): o site aponta para a release, não serve cópia local.
    if (/_divisao_territorial\.(gpkg|dxf)\.zip$|_prancha(\.en)?\.svg$/.test(nome)) continue;
    const de = join(dir, nome);
    const info = await stat(de);
    if (info.isDirectory()) {
      if (SO_PUBLICADAS && dir === ORIGEM && !(await noAr(de))) {
        puladas++;
        continue;
      }
      await copiar(de);
      continue;
    }
    const para = join(DESTINO, relative(ORIGEM, de));
    await mkdir(join(para, '..'), { recursive: true });
    await cp(de, para);
    copiados++;
    bytes += info.size;
    if (info.size > LIMITE_AVISO) {
      console.warn(`⚠  ${relative(RAIZ, de)} tem ${(info.size / 1e6).toFixed(1)} MB — prefira anexar à release e usar url:`);
    }
  }
}

try {
  await copiar(ORIGEM);
  const fora = SO_PUBLICADAS ? ` (${puladas} pasta(s) agendada(s) ou em rascunho fora)` : '';
  console.log(`mapas → public/mapas: ${copiados} arquivo(s), ${(bytes / 1e6).toFixed(1)} MB${fora}`);
} catch (e) {
  if (e.code === 'ENOENT') console.log('Nenhuma pasta /mapas encontrada; nada a sincronizar.');
  else throw e;
}
