#!/usr/bin/env node
/**
 * Cria a pasta do próximo mapa a partir do modelo em /templates/mapa.
 *   npm run novo-mapa -- "Densidade urbana em Campinas" censo-renda
 */
import { cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
const MAPAS = join(RAIZ, 'mapas');
const MODELO = join(RAIZ, 'templates', 'mapa');
const CATEGORIAS = ['uso-do-solo', 'censo-renda', 'altimetria-relevo', 'infraestrutura-dxf', 'hidrografia', 'biomas'];

const [titulo, categoria = 'censo-renda'] = process.argv.slice(2);
if (!titulo) {
  console.error('Uso: npm run novo-mapa -- "Título do mapa" [categoria]');
  console.error(`Categorias: ${CATEGORIAS.join(', ')}`);
  process.exit(1);
}
if (!CATEGORIAS.includes(categoria)) {
  console.error(`Categoria inválida: ${categoria}. Use uma de: ${CATEGORIAS.join(', ')}`);
  process.exit(1);
}

const slug = titulo
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .replace(/\b(de|da|do|das|dos|e|em|no|na|nos|nas|a|o|as|os)\b/g, ' ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 60);

const existentes = existsSync(MAPAS) ? await readdir(MAPAS) : [];
const numeros = existentes.map((n) => parseInt(n, 10)).filter(Number.isFinite);
const numero = (numeros.length ? Math.max(...numeros) : 0) + 1;
const pasta = `${String(numero).padStart(3, '0')}-${slug}`;
const destino = join(MAPAS, pasta);

await mkdir(destino, { recursive: true });
await cp(MODELO, destino, { recursive: true });

const hoje = new Date().toISOString().slice(0, 10);
const readme = join(destino, 'README.md');
const texto = (await readFile(readme, 'utf8'))
  .replaceAll('{{numero}}', String(numero))
  .replaceAll('{{titulo}}', titulo.replace(/"/g, '\\"'))
  .replaceAll('{{data}}', hoje)
  .replaceAll('{{categoria}}', categoria)
  .replaceAll('{{pasta}}', pasta);
await writeFile(readme, texto);

console.log(`✓ mapas/${pasta}/ criada.

Próximos passos:
  1. Substitua mapa_preview.png pela prancha exportada (PNG, ~2400 px de largura).
  2. Coloque os arquivos em dados/ e a prancha final (PDF/PNG 300 dpi) na pasta.
  3. Preencha o frontmatter do README.md (contexto, fontes, CRS, downloads).
  4. npm run dev  → confira o cartão no feed.
  5. Commit + push. Para gerar o DOI: Actions → "Publicar no Zenodo" → pasta ${pasta}.`);
