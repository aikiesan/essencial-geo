import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../site.config';
import { linkMapa, mapasPublicados } from '../lib/mapas';

export async function GET(context: APIContext) {
  const mapas = await mapasPublicados();
  return rss({
    title: SITE.nome,
    description: SITE.descricao,
    site: context.site!,
    trailingSlash: true,
    customData: `<language>pt-br</language>`,
    items: mapas.map((m) => ({
      title: `Nº ${m.data.numero} — ${m.data.titulo}`,
      link: linkMapa(m),
      pubDate: m.data.data,
      description: m.data.contexto,
      categories: [m.data.categoria, ...m.data.tags],
    })),
  });
}
