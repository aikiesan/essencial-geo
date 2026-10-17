import { SITE } from '../site.config';
import { autoresDe, dataAbnt, type Mapa } from './mapas';

interface Citacao {
  /** Texto puro, pronto para colar (o que o botão copia). */
  texto: string;
  /** Mesma citação com o título em negrito e o marcador da data de acesso. */
  html: string;
  bibtex: string;
}

const escapar = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Referência de conjunto de dados segundo a ABNT NBR 6023:2018:
 * SOBRENOME, Nome. Título: subtítulo. Versão. Local: Editora, ano. Tipo. DOI. Disponível em. Acesso em.
 * A data de acesso é reescrita no navegador com a data do dia (ver `citacao.ts` do cliente).
 */
export function citar(m: Mapa, urlPagina: string, hoje = new Date()): Citacao {
  const d = m.data;
  const ano = d.data.getUTCFullYear();
  const autores = autoresDe(m);
  const nomes = autores.map((a) => `${a.sobrenome.toUpperCase()}, ${a.nome}`).join('; ');
  const titulo = d.titulo;
  const sub = d.subtitulo ? `: ${d.subtitulo.charAt(0).toLowerCase()}${d.subtitulo.slice(1)}` : '';
  const editora = d.doi ? 'Zenodo' : SITE.nome;
  const doiUrl = d.doi ? `https://doi.org/${d.doi}` : undefined;
  const disponivel = doiUrl ?? urlPagina;
  const acesso = dataAbnt(hoje);

  const partes = (e: (s: string) => string, tituloFmt: string, acessoFmt: string) =>
    [
      `${e(nomes)}. ${tituloFmt}${e(sub)}.`,
      `Versão ${d.versao}.`,
      `[S. l.]: ${editora}, ${ano}.`,
      'Conjunto de dados.',
      d.doi ? `DOI: ${d.doi}.` : '',
      `Disponível em: ${e(disponivel)}.`,
      `Acesso em: ${acessoFmt}.`,
    ]
      .filter(Boolean)
      .join(' ');

  const texto = partes((s) => s, titulo, acesso);
  const html = partes(escapar, `<strong>${escapar(titulo)}</strong>`, `<span data-acesso>${acesso}</span>`);

  const chave = `${autores[0].sobrenome.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '')}${ano}_${m.id.replace(/^\d+-/, '').replace(/-/g, '_')}`;
  const bibtex = [
    `@dataset{${chave},`,
    `  author    = {${autores.map((a) => `${a.sobrenome}, ${a.nome}`).join(' and ')}},`,
    `  title     = {${titulo}${d.subtitulo ? `: ${d.subtitulo}` : ''}},`,
    `  year      = {${ano}},`,
    `  publisher = {${editora}},`,
    `  version   = {${d.versao}},`,
    d.doi ? `  doi       = {${d.doi}},` : '',
    `  url       = {${disponivel}},`,
    `  note      = {Licença ${SITE.licenca.nome}}`,
    '}',
  ]
    .filter(Boolean)
    .join('\n');

  return { texto, html, bibtex };
}
