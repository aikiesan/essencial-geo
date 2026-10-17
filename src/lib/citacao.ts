import { SITE } from '../site.config';
import { autoresDe, dataAbnt, type Mapa } from './mapas';

interface Formatada {
  /** Texto puro, pronto para colar (o que o botão copia). */
  texto: string;
  /** Mesma citação com o título em destaque. */
  html: string;
}

export interface Citacao {
  abnt: Formatada;
  apa: Formatada;
  bibtex: string;
}

const escapar = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const iniciais = (nome: string) =>
  nome
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => `${p[0].toUpperCase()}.`)
    .join(' ');

/**
 * Três formatos da mesma referência de conjunto de dados:
 *
 * ABNT NBR 6023:2018 — sempre em português, com o título original:
 *   SOBRENOME, Nome. Título: subtítulo. Versão. Local: Editora, ano. Tipo. DOI. Disponível em. Acesso em.
 *   A data de acesso é reescrita no navegador com a data do dia (ver scripts/cliente.ts).
 *
 * APA 7 — na língua da página. Em inglês, o título original vem seguido da
 *   tradução entre colchetes, como pede a APA para obras em outra língua.
 *
 * BibTeX — título original, com a tradução em `note` na página em inglês.
 */
export function citar(m: Mapa, urlPagina: string, hoje = new Date()): Citacao {
  const o = m.original;
  const ano = o.data.getUTCFullYear();
  const autores = autoresDe(m);
  const editora = o.doi ? 'Zenodo' : SITE.nome;
  const doiUrl = o.doi ? `https://doi.org/${o.doi}` : undefined;
  const disponivel = doiUrl ?? urlPagina;
  const tituloOriginal = `${o.titulo}${o.subtitulo ? `: ${o.subtitulo.charAt(0).toLowerCase()}${o.subtitulo.slice(1)}` : ''}`;
  const tituloEn = m.lingua === 'en' ? `${m.data.titulo}${m.data.subtitulo ? `: ${m.data.subtitulo}` : ''}` : undefined;

  /* ABNT */
  const nomesAbnt = autores.map((a) => `${a.sobrenome.toUpperCase()}, ${a.nome}`).join('; ');
  const sub = o.subtitulo ? `: ${o.subtitulo.charAt(0).toLowerCase()}${o.subtitulo.slice(1)}` : '';
  const acesso = dataAbnt(hoje);
  const abntPartes = (e: (s: string) => string, tituloFmt: string, acessoFmt: string) =>
    [
      `${e(nomesAbnt)}. ${tituloFmt}${e(sub)}.`,
      `Versão ${o.versao}.`,
      `[S. l.]: ${editora}, ${ano}.`,
      'Conjunto de dados.',
      o.doi ? `DOI: ${o.doi}.` : '',
      `Disponível em: ${e(disponivel)}.`,
      `Acesso em: ${acessoFmt}.`,
    ]
      .filter(Boolean)
      .join(' ');
  const abnt = {
    texto: abntPartes((s) => s, o.titulo, acesso),
    html: abntPartes(escapar, `<strong>${escapar(o.titulo)}</strong>`, `<span data-acesso>${acesso}</span>`),
  };

  /* APA 7 */
  const nomesApa = autores.map((a) => `${a.sobrenome}, ${iniciais(a.nome)}`);
  const autoresApa =
    nomesApa.length === 1 ? nomesApa[0] : `${nomesApa.slice(0, -1).join(', ')}, & ${nomesApa[nomesApa.length - 1]}`;
  const versao = m.lingua === 'en' ? `Version ${o.versao}` : `Versão ${o.versao}`;
  const tipo = m.lingua === 'en' ? 'Data set' : 'Conjunto de dados';
  const traducao = tituloEn ? ` [${tituloEn}]` : '';
  const apaPartes = (e: (s: string) => string, tituloFmt: string) =>
    `${e(autoresApa)} (${ano}). ${tituloFmt}${e(traducao)} (${versao}) [${tipo}]. ${editora}. ${e(disponivel)}`;
  const apa = {
    texto: apaPartes((s) => s, tituloOriginal),
    html: apaPartes(escapar, `<em>${escapar(tituloOriginal)}</em>`),
  };

  /* BibTeX */
  const chave = `${autores[0].sobrenome.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '')}${ano}_${m.id.replace(/^\d+-/, '').replace(/-/g, '_')}`;
  const bibtex = [
    `@dataset{${chave},`,
    `  author    = {${autores.map((a) => `${a.sobrenome}, ${a.nome}`).join(' and ')}},`,
    `  title     = {${o.titulo}${o.subtitulo ? `: ${o.subtitulo}` : ''}},`,
    `  year      = {${ano}},`,
    `  publisher = {${editora}},`,
    `  version   = {${o.versao}},`,
    o.doi ? `  doi       = {${o.doi}},` : '',
    `  url       = {${disponivel}},`,
    `  language  = {portuguese},`,
    tituloEn
      ? `  note      = {English title: ${tituloEn}. Licence ${SITE.licenca.nome}}`
      : `  note      = {Licença ${SITE.licenca.nome}}`,
    '}',
  ]
    .filter(Boolean)
    .join('\n');

  return { abnt, apa, bibtex };
}
