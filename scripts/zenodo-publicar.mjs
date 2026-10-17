#!/usr/bin/env node
/**
 * Publica UM mapa no Zenodo como conjunto de dados próprio e grava o DOI no README.
 *
 *   ZENODO_TOKEN=... node scripts/zenodo-publicar.mjs 001-densidade-urbana-grade-estatistica
 *   ... --sandbox        usa sandbox.zenodo.org (teste, DOI falso 10.5072)
 *   ... --simular        mostra o que seria enviado, sem tocar no Zenodo
 *   ... --nova-versao    o mapa já tem DOI: cria uma nova versão do mesmo registro
 *
 * Arquivos enviados: tudo na pasta do mapa (README.md, prancha, dados/*), exceto ocultos.
 * Autoria e comunidade vêm de /.zenodo.json; o resto, do frontmatter do README.
 *
 * Por que um registro por mapa (e não só a integração GitHub→Zenodo)? A integração
 * nativa arquiva o repositório inteiro a cada release: um DOI para o atlas. Para que
 * cada prancha seja citável e entre no Lattes como produção própria, cada uma
 * precisa do seu DOI. As duas coisas convivem: este script para os mapas, a
 * integração nativa (opcional) para o atlas como um todo.
 */
import { readFile, readdir, stat, writeFile, appendFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);
const pasta = args.find((a) => !a.startsWith('--'));
const sandbox = args.includes('--sandbox');
const simular = args.includes('--simular');
const novaVersao = args.includes('--nova-versao');

if (!pasta) {
  console.error('Uso: node scripts/zenodo-publicar.mjs <pasta-do-mapa> [--sandbox] [--simular] [--nova-versao]');
  process.exit(1);
}

const API = sandbox ? 'https://sandbox.zenodo.org/api' : 'https://zenodo.org/api';
const TOKEN = process.env.ZENODO_TOKEN;
if (!TOKEN && !simular) {
  console.error('Defina ZENODO_TOKEN (Zenodo → Applications → Personal access token, escopos deposit:write e deposit:actions).');
  process.exit(1);
}

const dirMapa = join(RAIZ, 'mapas', pasta);
const caminhoReadme = join(dirMapa, 'README.md');
const readme = await readFile(caminhoReadme, 'utf8');
const bloco = readme.match(/^---\r?\n([\s\S]*?)\r?\n---/);
if (!bloco) throw new Error(`Frontmatter não encontrado em ${caminhoReadme}`);
const fm = parse(bloco[1]);
const zenodoJson = JSON.parse(await readFile(join(RAIZ, '.zenodo.json'), 'utf8'));

if (fm.exemplo) {
  console.error('Este mapa está marcado como `exemplo: true` (dados sintéticos). Remova a marcação antes de gerar um DOI.');
  process.exit(1);
}
if (fm.doi && !novaVersao) {
  console.error(`Este mapa já tem DOI (${fm.doi}). Use --nova-versao para publicar uma nova versão.`);
  process.exit(1);
}

/* ---------- metadados ---------------------------------------------------- */
const site = 'https://aikiesan.github.io/essencial-geo';
const paginaMapa = `${site}/mapas/${pasta}/`;
const escapar = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const criadores = fm.autores?.length
  ? fm.autores.map((a) => ({ name: `${a.sobrenome}, ${a.nome}`, ...(a.orcid ? { orcid: a.orcid } : {}) }))
  : zenodoJson.creators;

const fontes = (fm.fontes ?? []).map((f) => `<li>${escapar(f.nome)}${f.ano ? ` (${f.ano})` : ''}</li>`).join('');
const metadata = {
  upload_type: 'dataset',
  title: `${fm.titulo}${fm.subtitulo ? `: ${fm.subtitulo}` : ''}`,
  description: [
    `<p>${escapar(fm.contexto)}</p>`,
    `<p><strong>Recorte:</strong> ${escapar(fm.recorte)}<br><strong>Sistema de referência:</strong> ${escapar(fm.crs)}${fm.epsg ? ` (EPSG:${fm.epsg})` : ''}${fm.escala ? `<br><strong>Escala:</strong> ${escapar(fm.escala)}` : ''}</p>`,
    fontes ? `<p><strong>Fontes:</strong></p><ul>${fontes}</ul>` : '',
    fm.metodo ? `<p><strong>Método:</strong> ${escapar(fm.metodo)}</p>` : '',
    `<p>Prancha nº ${fm.numero} do atlas Essencial Geo — <a href="${paginaMapa}">${paginaMapa}</a></p>`,
  ].join(''),
  creators: criadores,
  keywords: [...new Set(['Brasil', 'cartografia', 'mapa temático', 'SIRGAS 2000', ...(fm.tags ?? [])])],
  license: 'cc-by-4.0',
  access_right: 'open',
  version: String(fm.versao ?? '1.0.0'),
  language: 'por',
  publication_date: new Date(fm.data).toISOString().slice(0, 10),
  related_identifiers: [
    { identifier: paginaMapa, relation: 'isDocumentedBy', resource_type: 'other' },
    { identifier: `https://github.com/aikiesan/essencial-geo/tree/main/mapas/${pasta}`, relation: 'isSupplementTo' },
  ],
  ...(zenodoJson.communities?.length && !sandbox ? { communities: zenodoJson.communities } : {}),
};

/* ---------- arquivos ----------------------------------------------------- */
async function listar(dir) {
  const saida = [];
  for (const nome of await readdir(dir)) {
    if (nome.startsWith('.')) continue;
    const p = join(dir, nome);
    if ((await stat(p)).isDirectory()) saida.push(...(await listar(p)));
    else saida.push(p);
  }
  return saida;
}
const arquivos = await listar(dirMapa);
// O Zenodo não aceita subpastas: dados/x.gpkg vira dados__x.gpkg
const nomeZenodo = (p) => relative(dirMapa, p).split(sep).join('__');

if (simular) {
  console.log(JSON.stringify({ api: API, metadata, arquivos: arquivos.map(nomeZenodo) }, null, 2));
  process.exit(0);
}

/* ---------- API ---------------------------------------------------------- */
async function chamar(metodo, url, corpo, tipo = 'application/json') {
  const r = await fetch(url.startsWith('http') ? url : `${API}${url}`, {
    method: metodo,
    headers: { Authorization: `Bearer ${TOKEN}`, ...(corpo !== undefined ? { 'Content-Type': tipo } : {}) },
    body: corpo === undefined ? undefined : tipo === 'application/json' ? JSON.stringify(corpo) : corpo,
  });
  const texto = await r.text();
  if (!r.ok) throw new Error(`${metodo} ${url} → ${r.status}\n${texto}`);
  return texto ? JSON.parse(texto) : {};
}

let deposito;
if (novaVersao) {
  const id = String(fm.doi).split('zenodo.')[1];
  if (!id) throw new Error(`Não consegui extrair o id do registro a partir do DOI ${fm.doi}`);
  const nv = await chamar('POST', `/deposit/depositions/${id}/actions/newversion`);
  deposito = await chamar('GET', nv.links.latest_draft);
  for (const f of deposito.files ?? []) await chamar('DELETE', `/deposit/depositions/${deposito.id}/files/${f.id}`);
  console.log(`Nova versão em rascunho: ${deposito.id}`);
} else {
  deposito = await chamar('POST', '/deposit/depositions', {});
  console.log(`Depósito criado: ${deposito.id}`);
}

for (const arq of arquivos) {
  const nome = nomeZenodo(arq);
  await chamar('PUT', `${deposito.links.bucket}/${encodeURIComponent(nome)}`, await readFile(arq), 'application/octet-stream');
  console.log(`  ↑ ${nome}`);
}

await chamar('PUT', `/deposit/depositions/${deposito.id}`, { metadata });
const publicado = await chamar('POST', `/deposit/depositions/${deposito.id}/actions/publish`);
const doi = publicado.doi ?? publicado.metadata?.doi;
console.log(`✓ Publicado: https://doi.org/${doi}`);

/* ---------- grava o DOI no README --------------------------------------- */
let novo;
if (/^#?\s*doi:.*$/m.test(bloco[1])) {
  novo = readme.replace(/^#?\s*doi:.*$/m, `doi: ${doi}`);
} else {
  novo = readme.replace(/^(versao:.*)$/m, `$1\ndoi: ${doi}`);
}
await writeFile(caminhoReadme, novo);
console.log(`DOI gravado em mapas/${pasta}/README.md`);

if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `doi=${doi}\n`);
