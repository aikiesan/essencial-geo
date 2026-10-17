/**
 * robots.txt. Atenção: enquanto o site estiver em aikiesan.github.io/essencial-geo/,
 * os buscadores leem só aikiesan.github.io/robots.txt (do repositório
 * aikiesan.github.io, se existir) e ignoram este arquivo. Ele passa a valer ao
 * migrar para um domínio próprio. Até lá, envie o sitemap pelo Search Console.
 */
import type { APIRoute } from 'astro';
import { url } from '../i18n';

export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *
Allow: /

Sitemap: ${new URL(url('sitemap.xml'), site)}
`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
