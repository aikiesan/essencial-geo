#!/usr/bin/env node
/**
 * Cria a pasta do próximo mapa a partir do modelo em /templates/mapa,
 * com README.md (PT-BR) e README.en.md (EN-UK).
 *
 *   npm run novo-mapa -- "Densidade urbana em Campinas" censo-renda
 *   npm run novo-mapa -- "Densidade urbana em Campinas" censo-renda --en "Urban density in Campinas" --data 2026-10-21
 *
 * --en    título em inglês (pode ser preenchido depois no README.en.md)
 * --data  dia de publicação; uma data futura agenda o mapa (entra no ar às 9h de Brasília)
 */
import { cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
const MAPAS = join(RAIZ, 'mapas');
const MODELO = join(RAIZ, 'templates', 'mapa');
const CATEGORIAS = ['uso-do-solo', 'censo-renda', 'altimetria-relevo', 'infraestrutura-dxf', 'hidrografia', 'biomas', 'energia'];

const args = process.argv.slice(2);
const opcao = (nome) => {
  const i = args.indexOf(`--${nome}`);
  if (i === -1) return undefined;
  const valor = args[i + 1];
  args.splice(i, 2);
  return valor;
};
const tituloEn = opcao('en');
const data = opcao('data') ?? new Date().toISOString().slice(0, 10);
const [titulo, categoria = 'censo-renda'] = args;

if (!titulo) {
  console.error('Uso: npm run novo-mapa -- "Título do mapa" [categoria] [--en "English title"] [--data AAAA-MM-DD]');
  console.error(`Categorias: ${CATEGORIAS.join(', ')}`);
  process.exit(1);
}
if (!CATEGORIAS.includes(categoria)) {
  console.error(`Categoria inválida: ${categoria}. Use uma de: ${CATEGORIAS.join(', ')}`);
  process.exit(1);
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
  console.error(`Data inválida: ${data}. Use AAAA-MM-DD.`);
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

const aspas = (s) => s.replace(/"/g, '\\"');
for (const nome of ['README.md', 'README.en.md']) {
  const arq = join(destino, nome);
  const texto = (await readFile(arq, 'utf8'))
    .replaceAll('{{numero}}', String(numero))
    .replaceAll('{{titulo}}', aspas(titulo))
    .replaceAll('{{titulo_en}}', aspas(tituloEn ?? `TODO: English title for “${titulo}”`))
    .replaceAll('{{data}}', data)
    .replaceAll('{{categoria}}', categoria)
    .replaceAll('{{pasta}}', pasta);
  await writeFile(arq, texto);
}

const agendado = data > new Date().toISOString().slice(0, 10);
console.log(`✓ mapas/${pasta}/ criada${agendado ? ` (agendada para ${data}, 9h de Brasília)` : ''}.

Próximos passos:
  1. Exporte a prancha nas duas línguas: mapa_preview.png (PT) e mapa_preview.en.png (EN).
  2. Coloque os arquivos em dados/ e a prancha final (PDF/PNG 300 dpi) na pasta.
  3. Preencha o README.md (contexto, fontes, CRS, camadas, indicadores, downloads)
     e o README.en.md (título, contexto e texto alternativo em inglês).
  4. npm run dev  → confira o cartão em /essencial-geo/ e em /essencial-geo/en/.
  5. Mude rascunho para false, commit + push. O mapa entra no ar no dia ${data}.
  6. Para gerar o DOI: Actions → "Publicar no Zenodo" → pasta ${pasta}.`);
