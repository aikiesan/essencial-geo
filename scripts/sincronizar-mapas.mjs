#!/usr/bin/env node
/**
 * Copia os arquivos públicos de cada pasta em /mapas para /public/mapas,
 * de onde o site os serve para download (PDF, PNG 300 dpi, GPKG, DXF…).
 * O README.md não é copiado: ele já é lido pelo Astro como conteúdo.
 *
 * Arquivos muito grandes não devem ir para o Git: publique-os como anexos de
 * release (ou direto no Zenodo) e use `url:` no frontmatter em vez de `arquivo:`.
 */
import { cp, mkdir, readdir, rm, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
const ORIGEM = join(RAIZ, 'mapas');
const DESTINO = join(RAIZ, 'public', 'mapas');
const IGNORAR = new Set(['README.md', '.DS_Store', 'Thumbs.db']);
const LIMITE_AVISO = 50 * 1024 * 1024; // GitHub recusa > 100 MB e avisa > 50 MB

await rm(DESTINO, { recursive: true, force: true });
await mkdir(DESTINO, { recursive: true });

let copiados = 0;
let bytes = 0;

async function copiar(dir) {
  for (const nome of await readdir(dir)) {
    if (IGNORAR.has(nome) || nome.startsWith('_')) continue;
    const de = join(dir, nome);
    const info = await stat(de);
    if (info.isDirectory()) {
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
  console.log(`mapas → public/mapas: ${copiados} arquivo(s), ${(bytes / 1e6).toFixed(1)} MB`);
} catch (e) {
  if (e.code === 'ENOENT') console.log('Nenhuma pasta /mapas encontrada; nada a sincronizar.');
  else throw e;
}
