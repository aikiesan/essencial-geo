/**
 * sitemap.xml com os pares de língua (hreflang) de cada página.
 *
 * Toda página existe em PT e EN (o build de produção garante), então cada <url>
 * lista as duas versões como alternativas uma da outra — é assim que o Google
 * entende que /mapas/x/ e /en/maps/x/ são a mesma página em duas línguas.
 *
 * GitHub Pages de projeto: buscadores só leem robots.txt na raiz do domínio
 * (aikiesan.github.io/robots.txt), não em /essencial-geo/. Por isso este
 * sitemap deve ser enviado direto no Google Search Console e no Bing Webmaster.
 */
import type { APIRoute } from 'astro';
import { CATEGORIA_IDS } from '../site.config';
import { LINGUAS, IDIOMA, rota, type Lingua } from '../i18n';
import { mapasPublicados } from '../lib/mapas';
import { notasPublicadas } from '../lib/notas';
import { POR_FOLHA } from '../lib/rotas';
import { colecoesNoAr } from '../lib/colecoes';

interface Entrada {
  /** Caminho em cada língua. */
  caminhos: Record<Lingua, string>;
  ultima?: Date;
}

const dia = (d: Date) => d.toISOString().slice(0, 10);
const escapar = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export const GET: APIRoute = async ({ site }) => {
  const abs = (caminho: string) => escapar(new URL(caminho, site).toString());
  const nas = (f: (l: Lingua) => string) => Object.fromEntries(LINGUAS.map((l) => [l, f(l)])) as Record<Lingua, string>;

  const mapas = await mapasPublicados('pt');
  const notas = await notasPublicadas('pt');
  const colecoes = await colecoesNoAr('pt');
  const recente = (datas: Date[]) => (datas.length ? new Date(Math.max(...datas.map((d) => d.getTime()))) : undefined);
  const dataDe = (m: { data: { data: Date; atualizado?: Date } }) => m.data.atualizado ?? m.data.data;

  const folhas = Math.max(1, Math.ceil(mapas.length / POR_FOLHA));
  const entradas: Entrada[] = [
    { caminhos: nas((l) => rota(l)), ultima: recente(mapas.map(dataDe)) },
    { caminhos: nas((l) => rota(l, 'mapas')), ultima: recente(mapas.map(dataDe)) },
    ...Array.from({ length: folhas - 1 }, (_, i) => ({ caminhos: nas((l) => `${rota(l, 'mapas')}${i + 2}/`) })),
    ...CATEGORIA_IDS.filter((c) => mapas.some((m) => m.data.categoria === c)).map((c) => ({
      caminhos: nas((l) => rota(l, 'categoria', c)),
      ultima: recente(mapas.filter((m) => m.data.categoria === c).map(dataDe)),
    })),
    { caminhos: nas((l) => rota(l, 'colecoes')), ultima: recente(mapas.filter((m) => m.data.colecao).map(dataDe)) },
    ...colecoes.map((c) => ({
      caminhos: nas((l) => rota(l, 'colecoes', c.id)),
      ultima: recente(c.mapas.map(dataDe)),
    })),
    ...mapas.map((m) => ({ caminhos: nas((l) => rota(l, 'mapas', m.id)), ultima: dataDe(m) })),
    { caminhos: nas((l) => rota(l, 'indice')), ultima: recente(mapas.map(dataDe)) },
    { caminhos: nas((l) => rota(l, 'notas')), ultima: recente(notas.map(dataDe)) },
    ...notas.map((n) => ({ caminhos: nas((l) => rota(l, 'notas', n.pasta)), ultima: dataDe(n) })),
    { caminhos: nas((l) => rota(l, 'sobre')) },
  ];

  const alternativas = (e: Entrada) =>
    [
      ...LINGUAS.map((l) => `    <xhtml:link rel="alternate" hreflang="${IDIOMA[l].codigo}" href="${abs(e.caminhos[l])}"/>`),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(e.caminhos.pt)}"/>`,
    ].join('\n');

  const urls = entradas.flatMap((e) =>
    LINGUAS.map(
      (l) => `  <url>
    <loc>${abs(e.caminhos[l])}</loc>${e.ultima ? `\n    <lastmod>${dia(e.ultima)}</lastmod>` : ''}
${alternativas(e)}
  </url>`,
    ),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
