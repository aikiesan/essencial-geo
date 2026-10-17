import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../site.config';
import { IDIOMA, rota, t, type Lingua } from '../i18n';
import { linkMapa, mapasPublicados } from './mapas';
import { notasPublicadas } from './notas';

/** Um feed por língua: mapas e notas juntos, do mais recente ao mais antigo. */
export async function gerarRss(context: APIContext, lingua: Lingua) {
  const tx = t(lingua);
  const mapas = (await mapasPublicados(lingua)).filter((m) => !m.agendado);
  const notas = (await notasPublicadas(lingua)).filter((n) => !n.agendada);
  const itens = [
    ...mapas.map((m) => ({
      title: `${tx.geral.no} ${m.data.numero} — ${m.data.titulo}`,
      link: linkMapa(m),
      pubDate: m.data.data,
      description: m.data.contexto,
      categories: [tx.categorias[m.data.categoria].rotulo, ...m.data.tags],
    })),
    ...notas.map((n) => ({
      title: `${tx.notas.tipos[n.data.tipo]}: ${n.data.titulo}`,
      link: rota(lingua, 'notas', n.pasta),
      pubDate: n.data.data,
      description: n.data.resumo,
      categories: [tx.notas.titulo, ...n.data.tags],
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: lingua === 'en' ? `${SITE.nome} (English)` : SITE.nome,
    description: tx.site.descricao,
    site: context.site!,
    trailingSlash: true,
    customData: `<language>${IDIOMA[lingua].rss}</language>`,
    items: itens,
  });
}
