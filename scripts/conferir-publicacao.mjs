#!/usr/bin/env node
/**
 * Rotina diária: confere, no site já publicado, se os mapas no ar estão inteiros.
 *
 *   node scripts/conferir-publicacao.mjs              # mapas que entraram no ar hoje (UTC)
 *   node scripts/conferir-publicacao.mjs --todos      # todos os mapas no ar
 *   node scripts/conferir-publicacao.mjs --dia 2026-10-19
 *
 * Para cada mapa confere: a página em português e em inglês (HTTP 200), a presença das
 * duas no sitemap, a imagem da prancha e cada download (o link responde e não é "em breve").
 * Mapas no ar sem DOI cujas conferências passaram saem no relatório. Os aprovados de antemão
 * (`doi_automatico: true` no README) vão para o job "doi" do deploy.yml, que pede o DOI ao
 * Zenodo; os demais saem com o comando para pedir à mão. O DOI é permanente: a aprovação é por mapa.
 *
 * Sai com erro se algo falhar: o GitHub avisa por e-mail quando uma execução falha.
 * Só usa Node e a rede; nenhum arquivo é alterado.
 */
import { readFile, readdir, appendFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
const SITE = 'https://aikiesan.github.io/essencial-geo/';
const HORA_UTC = 12; // src/site.config.ts → horaPublicacaoUtc

const args = process.argv.slice(2);
const todos = args.includes('--todos');
const diaPedido = args.includes('--dia') ? args[args.indexOf('--dia') + 1] : undefined;
const hoje = diaPedido ?? new Date().toISOString().slice(0, 10);
const agora = new Date();

const frontmatter = (texto) => parse(texto.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
const dia = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d));
const noAr = (d) => new Date(`${dia(d)}T${String(HORA_UTC).padStart(2, '0')}:00:00Z`) <= agora;

/* ---------- mapas do repositório ---------------------------------------- */
const pastas = (await readdir(join(RAIZ, 'mapas'), { withFileTypes: true }))
  .filter((e) => e.isDirectory() && /^\d{3}-/.test(e.name))
  .map((e) => e.name);

const mapas = [];
for (const pasta of pastas) {
  let fm;
  try {
    fm = frontmatter(await readFile(join(RAIZ, 'mapas', pasta, 'README.md'), 'utf8'));
  } catch {
    continue;
  }
  if (fm.rascunho || fm.exemplo || !noAr(fm.data)) continue;
  mapas.push({ pasta, fm });
}
const alvo = todos ? mapas : mapas.filter((m) => dia(m.fm.data) === hoje);

/* ---------- rede --------------------------------------------------------- */
async function responde(url) {
  for (let tentativa = 1; tentativa <= 3; tentativa++) {
    try {
      // GET com Range: alguns servidores (GitHub Releases → S3) recusam HEAD.
      const r = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-0' }, redirect: 'follow' });
      await r.body?.cancel();
      if (r.ok || r.status === 206) return { ok: true, status: r.status };
      if (r.status < 500) return { ok: false, status: r.status };
    } catch (e) {
      if (tentativa === 3) return { ok: false, status: String(e.cause?.code ?? e.message) };
    }
    await new Promise((res) => setTimeout(res, 2000 * tentativa));
  }
  return { ok: false, status: 'sem resposta' };
}
const texto = async (url) => {
  const r = await fetch(url);
  return r.ok ? r.text() : '';
};

/* ---------- conferência -------------------------------------------------- */
const sitemap = await texto(`${SITE}sitemap.xml`);
const linhas = [];
const falhas = [];
const doiPendentes = [];
const doiAutomatico = [];

for (const { pasta, fm } of alvo) {
  const paginas = { pt: `${SITE}mapas/${pasta}/`, en: `${SITE}en/maps/${pasta}/` };
  const problemas = [];

  for (const [lingua, url] of Object.entries(paginas)) {
    const r = await responde(url);
    if (!r.ok) problemas.push(`página ${lingua.toUpperCase()} responde ${r.status}`);
    if (!sitemap.includes(url)) problemas.push(`página ${lingua.toUpperCase()} fora do sitemap`);
  }

  // A página publicada é a fonte da verdade para os links: lê os downloads do HTML.
  const html = await texto(paginas.pt);
  if (html.includes('>em breve<')) problemas.push('há download marcado como "em breve"');
  for (const d of fm.downloads ?? []) {
    for (const url of [d.url, d.url_en].filter(Boolean)) {
      const r = await responde(url);
      if (!r.ok) problemas.push(`download ${d.formato.toUpperCase()} responde ${r.status}: ${url}`);
    }
    for (const arquivo of [d.arquivo, d.arquivo_en].filter(Boolean)) {
      const url = `${SITE}mapas/${pasta}/${arquivo.replace(/^\.\//, '')}`;
      const r = await responde(url);
      if (!r.ok) problemas.push(`arquivo ${arquivo} responde ${r.status}`);
    }
  }

  const imagem = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  if (imagem) {
    const r = await responde(imagem);
    if (!r.ok) problemas.push(`imagem da prancha responde ${r.status}`);
  } else problemas.push('página sem imagem da prancha (og:image)');

  const doi = fm.doi ? `10…${String(fm.doi).split('.').pop()}` : 'sem DOI';
  linhas.push(`| ${String(fm.numero).padStart(3, '0')} | ${fm.titulo} | ${dia(fm.data)} | ${problemas.length ? '✗ ' + problemas.join('; ') : '✓'} | ${doi} |`);
  if (problemas.length) falhas.push(pasta);
  else if (!fm.doi) (fm.doi_automatico ? doiAutomatico : doiPendentes).push(pasta);
}

/* ---------- relatório ---------------------------------------------------- */
const resumo = [
  `## Conferência da publicação — ${todos ? 'todos os mapas no ar' : hoje}`,
  '',
  alvo.length ? '| Nº | Mapa | Data | Conferência | DOI |\n| --- | --- | --- | --- | --- |\n' + linhas.join('\n') : 'Nenhum mapa entrou no ar neste dia.',
  '',
  falhas.length ? `**${falhas.length} com problema:** ${falhas.join(', ')}` : '**Tudo certo.**',
  doiAutomatico.length
    ? `\n### DOI automático\n\nNo ar, conferidos e aprovados (\`doi_automatico: true\`): o job "doi" registra agora no Zenodo.\n\n` +
      doiAutomatico.map((p) => `- ${p}`).join('\n')
    : '',
  doiPendentes.length
    ? `\n### Prontos para DOI, à mão\n\nNo ar, conferidos, sem DOI e sem aprovação automática. Para registrar no Zenodo (DOI permanente):\n\n` +
      doiPendentes.map((p) => `    gh workflow run zenodo.yml -f pasta=${p} -f sandbox=false`).join('\n')
    : '',
].join('\n');

console.log(resumo);
if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, resumo + '\n');
// Para o job "doi". Com qualquer falha a lista sai vazia (e o job nem roda, porque este falha).
if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `doi_automatico=${falhas.length ? '' : doiAutomatico.join(' ')}\n`);
process.exit(falhas.length ? 1 : 0);
