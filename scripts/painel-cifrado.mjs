#!/usr/bin/env node
/**
 * Cifra o painel de admin (/admin/) depois do `astro build`. Roda no fim do `npm run build`.
 *
 * Sem ADMIN_SENHA no ambiente, o astro.config.mjs nem gera o painel; este script só confere que
 * dist/admin não existe e sai. Com a senha (segredo ADMIN_SENHA do GitHub, no deploy.yml):
 *
 *   1. as miniaturas da página entram nela como data: URI, e as pranchas grandes das agendadas
 *      (data-grande) viram arquivos cifrados em dist/admin/i/, com nomes que não dizem nada;
 *   2. os originais em dist/_astro que só o painel usava são apagados;
 *   3. a página inteira é cifrada (AES-GCM, chave PBKDF2-SHA-256 da senha) e dist/admin/index.html
 *      passa a ser só a caixa da senha. O navegador decifra com a Web Crypto e abre o painel.
 *
 * Se algo falhar, dist/admin é apagado antes do erro: o painel em claro nunca vai para o ar.
 * A segurança é a da senha: o arquivo cifrado é público, então ela precisa ser longa.
 */
import { createHash, randomBytes, webcrypto } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readdir, readFile, rm, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const { subtle } = webcrypto;
const RAIZ = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(RAIZ, 'dist');
const PASTA = join(DIST, 'admin');
const BASE = '/essencial-geo/'; // astro.config.mjs → base
const ITERACOES = 600_000;
const SENHA = process.env.ADMIN_SENHA;

if (!SENHA) {
  if (existsSync(PASTA)) await rm(PASTA, { recursive: true, force: true });
  console.log('painel de admin: sem ADMIN_SENHA, fora do build');
  process.exit(0);
}

const em64 = (b) => Buffer.from(b).toString('base64');
const deBase = (url) => join(DIST, decodeURI(url.slice(BASE.length)));

async function chaveDaSenha(senha, sal) {
  const base = await subtle.importKey('raw', new TextEncoder().encode(senha), 'PBKDF2', false, ['deriveBits']);
  const bruta = await subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: sal, iterations: ITERACOES }, base, 256);
  return subtle.importKey('raw', bruta, 'AES-GCM', false, ['encrypt']);
}

/** iv (12 bytes) + texto cifrado com etiqueta, o formato que a página e o painel leem. */
async function cifrar(chave, dados) {
  const iv = randomBytes(12);
  const cifrado = await subtle.encrypt({ name: 'AES-GCM', iv }, chave, dados);
  return Buffer.concat([iv, Buffer.from(cifrado)]);
}

/** Endereços em /_astro/ citados por todo o resto do site, para não apagar o que outra página usa. */
async function usadosForaDoPainel() {
  const usados = new Set();
  async function ler(dir) {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const caminho = join(dir, e.name);
      if (e.isDirectory()) {
        if (caminho !== PASTA && e.name !== 'mapas') await ler(caminho);
      } else if (/\.(html|css|js|xml|json|webmanifest)$/.test(e.name)) {
        for (const m of (await readFile(caminho, 'utf8')).matchAll(/_astro\/[^"'\s)?#,]+/g)) usados.add(m[0]);
      }
    }
  }
  await ler(DIST);
  return usados;
}

const PAGINA = (cofre) => `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Painel do atlas — Essencial Geo</title>
<style>
:root { --papel: #f6f7f8; --folha: #ffffff; --tinta: #1a211a; --tinta-3: #6d7165; --linha: #1a211a; --linha-fina: #d6d9d4; --acento: #3d6a82; --argila: #9c4a32; }
@media (prefers-color-scheme: dark) { :root { --papel: #16181a; --folha: #1f2326; --tinta: #dfd5c4; --tinta-3: #9a9d92; --linha: #bfa88a; --linha-fina: #343a33; --acento: #749fb7; --argila: #d47a5c; } }
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 16px; background: var(--papel); color: var(--tinta); font: 16px/1.5 Georgia, 'Times New Roman', serif; }
form { width: 100%; max-width: 360px; padding: 32px 24px; border: 1px solid var(--linha); background: var(--folha); }
.rotulo { margin: 0 0 8px; font: 500 12px/1.4 ui-monospace, Menlo, Consolas, monospace; letter-spacing: 0.1em; text-transform: uppercase; color: var(--tinta-3); }
h1 { margin: 0 0 24px; font-size: 28px; font-weight: 500; }
label { display: block; margin-bottom: 4px; }
input, button { width: 100%; padding: 10px 12px; border: 1px solid var(--linha); border-radius: 0; font: inherit; color: var(--tinta); background: var(--papel); }
input:focus-visible, button:focus-visible { outline: 2px solid var(--acento); outline-offset: 2px; }
button { margin-top: 12px; background: var(--tinta); color: var(--papel); cursor: pointer; }
button:disabled { cursor: progress; opacity: 0.7; }
#erro { margin: 12px 0 0; color: var(--argila); }
</style>
</head>
<body>
<form id="entrar">
  <p class="rotulo">Essencial Geo · Admin</p>
  <h1>Painel do atlas</h1>
  <label for="senha">Senha</label>
  <input id="senha" type="password" autocomplete="current-password" required autofocus>
  <button type="submit">Entrar</button>
  <p id="erro" role="alert" hidden>Senha incorreta.</p>
</form>
<script type="application/json" id="cofre">${JSON.stringify(cofre)}</script>
<script>
(() => {
  const CHAVE = 'essencial-geo:painel-chave';
  const cofre = JSON.parse(document.getElementById('cofre').textContent);
  const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const em64 = (u) => btoa(String.fromCharCode(...u));
  async function abrir(bruta) {
    const chave = await crypto.subtle.importKey('raw', bruta, 'AES-GCM', false, ['decrypt']);
    const dados = b64(cofre.dados);
    const claro = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: dados.slice(0, 12) }, chave, dados.slice(12));
    window.__chavePainel = chave;
    try { sessionStorage.setItem(CHAVE, em64(bruta)); } catch {}
    // Antes do fim do carregamento, document.write acrescenta em vez de substituir e os módulos
    // do painel não rodam: espera o load (na mesma aba, a chave guardada decifra antes dele).
    if (document.readyState !== 'complete') await new Promise((ok) => window.addEventListener('load', ok, { once: true }));
    document.open();
    document.write(new TextDecoder().decode(claro));
    document.close();
  }
  async function derivar(senha) {
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(senha), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: b64(cofre.sal), iterations: cofre.iteracoes }, base, 256);
    return new Uint8Array(bits);
  }
  // Na mesma aba, o painel reabre sem pedir a senha de novo (até a próxima publicação).
  let guardada = null;
  try { guardada = sessionStorage.getItem(CHAVE); } catch {}
  if (guardada) abrir(b64(guardada)).catch(() => { try { sessionStorage.removeItem(CHAVE); } catch {} });

  const form = document.getElementById('entrar');
  const botao = form.querySelector('button');
  const erro = document.getElementById('erro');
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    erro.hidden = true;
    botao.disabled = true;
    botao.textContent = 'Abrindo…';
    try {
      await abrir(await derivar(document.getElementById('senha').value));
    } catch {
      erro.hidden = false;
      botao.disabled = false;
      botao.textContent = 'Entrar';
    }
  });
})();
</script>
</body>
</html>
`;

try {
  if (SENHA.length < 12) throw new Error('ADMIN_SENHA precisa de pelo menos 12 caracteres: o arquivo cifrado é público.');
  const arquivo = join(PASTA, 'index.html');
  let html = await readFile(arquivo, 'utf8');
  const sal = randomBytes(16);
  const chave = await chaveDaSenha(SENHA, sal);
  const usados = await usadosForaDoPainel();
  const doPainel = new Set();
  const marca = (url) => {
    const relativo = url.slice(BASE.length);
    if (!usados.has(relativo)) doPainel.add(deBase(url));
  };

  // 1a. Pranchas grandes das agendadas → dist/admin/i/<nome opaco>.bin
  await mkdir(join(PASTA, 'i'), { recursive: true });
  const cifradas = new Map();
  for (const [, url] of html.matchAll(/data-grande="([^"]+)"/g)) {
    if (cifradas.has(url)) continue;
    const nome = createHash('sha256').update(sal).update(url).digest('hex').slice(0, 20);
    await writeFile(join(PASTA, 'i', `${nome}.bin`), await cifrar(chave, await readFile(deBase(url))));
    cifradas.set(url, `${BASE}admin/i/${nome}.bin`);
    marca(url);
  }
  html = html.replace(/data-grande="([^"]+)"/g, (_, url) => `data-cifrada="${cifradas.get(url)}"`);

  // 1b. Miniaturas → data: URI dentro da página cifrada
  const miniaturas = new Map();
  for (const [, url] of html.matchAll(/<img[^>]+src="([^"]+\.webp)"/g)) {
    if (miniaturas.has(url) || !url.startsWith(`${BASE}_astro/`)) continue;
    miniaturas.set(url, `data:image/webp;base64,${em64(await readFile(deBase(url)))}`);
    marca(url);
  }
  html = html.replace(/(<img[^>]+src=")([^"]+\.webp)"/g, (t, ini, url) => (miniaturas.has(url) ? `${ini}${miniaturas.get(url)}"` : t));

  // 2. Originais que só o painel usava
  for (const caminho of doPainel) await rm(caminho, { force: true });

  // 3. A página inteira cifrada dentro da caixa da senha
  const pagina = PAGINA({ sal: em64(sal), iteracoes: ITERACOES, dados: em64(await cifrar(chave, new TextEncoder().encode(html))) });
  if (/carta__titulo|data-status=/.test(pagina)) throw new Error('o painel em claro vazou para a página da senha');
  await writeFile(arquivo, pagina);
  console.log(
    `painel de admin cifrado: ${miniaturas.size} miniaturas, ${cifradas.size} pranchas grandes, ` +
      `${doPainel.size} originais apagados, ${(pagina.length / 1e6).toFixed(1)} MB`,
  );
} catch (e) {
  await rm(PASTA, { recursive: true, force: true });
  console.error('painel de admin: falhou, dist/admin apagado.');
  throw e;
}
