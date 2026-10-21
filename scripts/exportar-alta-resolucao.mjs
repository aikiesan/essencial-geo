#!/usr/bin/env node
/**
 * Exporta todas as pranchas em alta resolução, para o backup pessoal (fora do site e do Git).
 *
 *   node scripts/exportar-alta-resolucao.mjs --destino A:/essencial-geo-backup/pranchas
 *   node scripts/exportar-alta-resolucao.mjs --destino ... --escala 3 --so 030-cana-de-acucar-sp
 *
 * Lê a prancha em vetor de cada mapa (mapas/<pasta>/dados/*_prancha.svg e .en.svg, 2400 × 1800)
 * e grava em <destino>/<pasta>/ o PNG ampliado (escala 4 → 9600 × 7200 px, cores completas, sem
 * paleta) e uma cópia do SVG. Inclui os mapas ainda agendados. Pula o que já existe com a mesma
 * data de modificação do SVG; --refazer refaz tudo.
 */
import { readdir, mkdir, copyFile, stat, utimes } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);
const opcao = (nome) => (args.includes(nome) ? args[args.indexOf(nome) + 1] : undefined);
const destino = opcao('--destino');
const escala = Number(opcao('--escala') ?? 4);
const so = opcao('--so');
const refazer = args.includes('--refazer');
if (!destino) {
  console.error('uso: node scripts/exportar-alta-resolucao.mjs --destino <pasta> [--escala 4] [--so <pasta>] [--refazer]');
  process.exit(1);
}

sharp.concurrency(2);
const pastas = (await readdir(join(RAIZ, 'mapas'), { withFileTypes: true }))
  .filter((e) => e.isDirectory() && /^\d{3}-/.test(e.name) && (!so || e.name === so))
  .map((e) => e.name)
  .sort();

let feitos = 0;
let pulados = 0;
let bytes = 0;
const inicio = Date.now();
for (const pasta of pastas) {
  const dados = join(RAIZ, 'mapas', pasta, 'dados');
  if (!existsSync(dados)) continue;
  const svgs = (await readdir(dados)).filter((a) => /_prancha(\.en)?\.svg$/.test(a));
  if (!svgs.length) continue;
  const saida = join(destino, pasta);
  await mkdir(saida, { recursive: true });
  for (const svg of svgs) {
    const origem = join(dados, svg);
    const png = join(saida, svg.replace(/\.svg$/, `_${escala}x.png`));
    const { mtime } = await stat(origem);
    if (!refazer && existsSync(png) && (await stat(png)).mtime.getTime() === mtime.getTime()) {
      pulados++;
      continue;
    }
    await sharp(origem, { density: 72 * escala, limitInputPixels: false })
      .flatten({ background: '#ffffff' })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(png);
    await copyFile(origem, join(saida, svg));
    await utimes(png, mtime, mtime); // a data do SVG marca a versão exportada
    bytes += (await stat(png)).size;
    feitos++;
    console.log(`${pasta}/${svg.replace(/\.svg$/, `_${escala}x.png`)}  ${((await stat(png)).size / 1e6).toFixed(1)} MB`);
  }
}
console.log(
  `\n${feitos} exportadas, ${pulados} já em dia · ${(bytes / 1e9).toFixed(2)} GB · ${((Date.now() - inicio) / 60000).toFixed(1)} min → ${destino}`,
);
