/**
 * Metadados para máquinas: o que buscadores e indexadores acadêmicos leem.
 *
 * - schema.org/Dataset (JSON-LD) em cada mapa → Google Dataset Search.
 * - Etiquetas citation_* (Highwire Press) → Google Scholar e gerenciadores de
 *   referência (Zotero, Mendeley) que capturam a página.
 * - schema.org/BlogPosting nas notas e WebSite + Person na página inicial.
 *
 * Pranchas-modelo (`exemplo: true`) não recebem Dataset nem citation_*: são dados
 * sintéticos e não devem aparecer como conjunto de dados real em buscadores.
 */
import { AUTOR, AUTORIA, LINKS, SITE } from '../site.config';
import { IDIOMA, rota, type Lingua } from '../i18n';
import { autoresDe, linkMapa, resolverDownloads, rotuloCategoria, type Mapa } from './mapas';
import type { Nota } from './notas';

const CC_BY = 'https://creativecommons.org/licenses/by/4.0/';

/** JSON seguro dentro de <script>: impede que um "</script>" no texto feche a tag. */
export const jsonLd = (obj: unknown) => JSON.stringify(obj).replace(/</g, '\\u003c');

const abs = (caminho: string, site: URL | undefined) => new URL(caminho, site).toString();
const diaIso = (d: Date) => d.toISOString().slice(0, 10);

const TIPOS_MIME: Record<string, string> = {
  gpkg: 'application/geopackage+sqlite3',
  dxf: 'image/vnd.dxf',
  pdf: 'application/pdf',
  svg: 'image/svg+xml',
  png: 'image/png',
  csv: 'text/csv',
  tif: 'image/tiff',
  qgz: 'application/zip',
  r: 'text/x-r',
};

function pessoa(a: { sobrenome: string; nome: string; orcid?: string }, lingua: Lingua) {
  const autorPrincipal = a.orcid === AUTORIA.orcid;
  return {
    '@type': 'Person',
    name: `${a.nome} ${a.sobrenome}`,
    givenName: a.nome,
    familyName: a.sobrenome,
    ...(a.orcid ? { '@id': `https://orcid.org/${a.orcid}`, sameAs: `https://orcid.org/${a.orcid}` } : {}),
    ...(autorPrincipal
      ? { affiliation: { '@type': 'Organization', name: lingua === 'en' ? AUTORIA.afiliacaoEn : AUTORIA.afiliacao } }
      : {}),
  };
}

const editora = (site: URL | undefined) => ({
  '@type': 'Organization',
  name: SITE.nome,
  url: abs(rota('pt'), site),
});

/* ---------- Mapa: Dataset ------------------------------------------------- */
export function datasetDoMapa(m: Mapa, site: URL | undefined) {
  const d = m.data;
  const o = m.original;
  const pagina = abs(linkMapa(m), site);
  const outra = abs(linkMapa({ ...m, lingua: m.lingua === 'pt' ? 'en' : 'pt' }), site);
  const doiUrl = o.doi ? `https://doi.org/${o.doi}` : undefined;
  const titulo = `${d.titulo}${d.subtitulo ? `: ${d.subtitulo}` : ''}`;
  const anos = d.fontes.map((f) => f.ano).filter((a): a is number => typeof a === 'number');
  const cobertura = anos.length
    ? Math.min(...anos) === Math.max(...anos)
      ? String(anos[0])
      : `${Math.min(...anos)}/${Math.max(...anos)}`
    : undefined;

  const distribuicao = resolverDownloads(m)
    .filter((f) => f.href)
    .map((f) => ({
      '@type': 'DataDownload',
      name: f.rotulo,
      contentUrl: abs(f.href!, site),
      encodingFormat: f.href!.endsWith('.zip') ? 'application/zip' : TIPOS_MIME[f.formato],
      // schema.org espera ponto decimal: '1,6 MB' → '1.6 MB'
      ...(f.tamanho ? { contentSize: f.tamanho.replace(',', '.') } : {}),
    }));

  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': doiUrl ?? pagina,
    name: titulo,
    alternateName: m.lingua === 'en' ? o.titulo : undefined,
    description: d.contexto,
    url: pagina,
    sameAs: [outra, ...(doiUrl ? [doiUrl] : [])],
    identifier: doiUrl ?? pagina,
    inLanguage: IDIOMA[m.lingua].codigo,
    isAccessibleForFree: true,
    license: CC_BY,
    creator: autoresDe(m).map((a) => pessoa(a, m.lingua)),
    publisher: editora(site),
    includedInDataCatalog: { '@type': 'DataCatalog', name: SITE.nome, url: abs(rota(m.lingua), site) },
    datePublished: diaIso(o.data),
    ...(o.atualizado ? { dateModified: diaIso(o.atualizado) } : {}),
    version: o.versao,
    keywords: [rotuloCategoria(o.categoria, m.lingua).rotulo, ...o.tags, 'SIRGAS 2000'],
    spatialCoverage: { '@type': 'Place', name: d.recorte },
    ...(cobertura ? { temporalCoverage: cobertura } : {}),
    ...(d.metodo ? { measurementTechnique: d.metodo } : {}),
    isBasedOn: d.fontes.map((f) => ({
      '@type': 'CreativeWork',
      name: m.lingua === 'en' ? (f.nome_en ?? f.nome) : f.nome,
      ...(f.url ? { url: f.url } : {}),
    })),
    image: abs(d.imagem.src, site),
    ...(distribuicao.length ? { distribution: distribuicao } : {}),
  };
}

/* ---------- Mapa: etiquetas citation_* (Google Scholar) ------------------ */
export function etiquetasCitacao(m: Mapa, site: URL | undefined): { name: string; content: string }[] {
  const o = m.original;
  const e: { name: string; content: string }[] = [
    // Título original nas duas páginas: as duas versões são o mesmo trabalho, com o mesmo DOI.
    { name: 'citation_title', content: `${o.titulo}${o.subtitulo ? `: ${o.subtitulo}` : ''}` },
    ...autoresDe(m).map((a) => ({ name: 'citation_author', content: `${a.sobrenome}, ${a.nome}` })),
    { name: 'citation_publication_date', content: diaIso(o.data).replace(/-/g, '/') },
    { name: 'citation_publisher', content: o.doi ? 'Zenodo' : SITE.nome },
    { name: 'citation_language', content: m.lingua },
    { name: 'citation_abstract_html_url', content: abs(linkMapa(m), site) },
  ];
  for (const a of autoresDe(m)) if (a.orcid === AUTORIA.orcid) e.push({ name: 'citation_author_institution', content: AUTORIA.afiliacao });
  if (o.doi) e.push({ name: 'citation_doi', content: o.doi });
  const pdf = resolverDownloads(m).find((f) => f.formato === 'pdf' && f.href);
  if (pdf) e.push({ name: 'citation_pdf_url', content: abs(pdf.href!, site) });
  for (const k of o.tags) e.push({ name: 'citation_keywords', content: k });
  return e;
}

/* ---------- Nota: BlogPosting -------------------------------------------- */
export function artigoDaNota(n: Nota, site: URL | undefined) {
  const pagina = abs(rota(n.lingua, 'notas', n.pasta), site);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': pagina,
    headline: n.data.titulo,
    description: n.data.resumo,
    url: pagina,
    inLanguage: IDIOMA[n.lingua].codigo,
    datePublished: diaIso(n.data.data),
    dateModified: diaIso(n.data.atualizado ?? n.data.data),
    keywords: n.data.tags,
    author: pessoa(AUTORIA, n.lingua),
    publisher: editora(site),
    license: CC_BY,
    isPartOf: { '@type': 'Blog', name: SITE.nome, url: abs(rota(n.lingua, 'notas'), site) },
  };
}

/* ---------- Página inicial: WebSite + Person ----------------------------- */
export function siteEAutor(lingua: Lingua, descricao: string, site: URL | undefined) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': abs(rota(lingua), site),
        name: SITE.nome,
        description: descricao,
        url: abs(rota(lingua), site),
        inLanguage: IDIOMA[lingua].codigo,
        license: CC_BY,
        author: { '@id': `https://orcid.org/${AUTORIA.orcid}` },
      },
      {
        ...pessoa(AUTORIA, lingua),
        name: AUTOR.nomeCompleto,
        jobTitle: AUTOR[lingua].funcao,
        sameAs: [LINKS.orcid, LINKS.lattes, LINKS.scholar, LINKS.fapesp, LINKS.unicamp],
      },
    ],
  };
}
