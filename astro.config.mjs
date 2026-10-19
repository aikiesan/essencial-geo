// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

/**
 * Painel de admin (/admin/): todas as pranchas, no ar e agendadas, por coleção.
 * No `npm run dev` abre direto. No build só entra com a senha em ADMIN_SENHA (segredo do
 * GitHub), e scripts/painel-cifrado.mjs cifra a página logo depois: o site é estático, e o
 * que vai para o GitHub Pages fica aberto a quem souber o endereço.
 */
const painelAdmin = {
  name: 'painel-admin',
  hooks: {
    /** @param {{ command: string; injectRoute: (r: { pattern: string; entrypoint: string }) => void }} opcoes */
    'astro:config:setup': ({ command, injectRoute }) => {
      // Senha curta: o script de cifra recusa e avisa; o painel nem é gerado.
      const comSenha = (process.env.ADMIN_SENHA ?? '').length >= 12;
      if (command !== 'dev' && !(command === 'build' && comSenha)) return;
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
