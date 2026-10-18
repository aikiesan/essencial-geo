// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

/**
 * Painel de admin (/admin/): todas as pranchas, no ar e agendadas, por coleção.
 * Só existe no `npm run dev`. O site é estático: qualquer página do build vai para o
 * GitHub Pages e fica aberta a quem souber o endereço, então o painel nunca entra no build.
 */
const painelAdmin = {
  name: 'painel-admin',
  hooks: {
    /** @param {{ command: string; injectRoute: (r: { pattern: string; entrypoint: string }) => void }} opcoes */
    'astro:config:setup': ({ command, injectRoute }) => {
      if (command !== 'dev') return;
      injectRoute({ pattern: '/admin', entrypoint: fileURLToPath(new URL('./src/admin/Painel.astro', import.meta.url)) });
    },
  },
};

// GitHub Pages de projeto: https://aikiesan.github.io/essencial-geo/
// Ao migrar para domínio próprio, troque `site` e defina `base: '/'`.
export default defineConfig({
  site: 'https://aikiesan.github.io',
  base: '/essencial-geo',
  trailingSlash: 'always',
  build: { format: 'directory' },
  image: { responsiveStyles: false },
  integrations: [painelAdmin],
});
