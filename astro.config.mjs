// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages de projeto: https://aikiesan.github.io/essencial-geo/
// Ao migrar para domínio próprio, troque `site` e defina `base: '/'`.
export default defineConfig({
  site: 'https://aikiesan.github.io',
  base: '/essencial-geo',
  trailingSlash: 'always',
  build: { format: 'directory' },
  image: { responsiveStyles: false },
});
