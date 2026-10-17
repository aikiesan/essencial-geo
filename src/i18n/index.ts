/**
 * Duas línguas, um atlas: português do Brasil (padrão, na raiz) e inglês
 * britânico (em /en/). Rotas, datas e textos da interface passam por aqui.
 */
import { UI } from './ui';

export type Lingua = 'pt' | 'en';
export const LINGUAS: Lingua[] = ['pt', 'en'];

export const IDIOMA = {
  pt: { codigo: 'pt-BR', og: 'pt_BR', sigla: 'PT', nome: 'Português', rss: 'pt-br' },
  en: { codigo: 'en-GB', og: 'en_GB', sigla: 'EN', nome: 'English', rss: 'en-gb' },
} as const;

/** Segmentos de rota traduzidos. Pastas de mapa e ids de categoria são iguais nas duas línguas. */
const SEGMENTOS = {
  categoria: { pt: 'categoria', en: 'category' },
  mapas: { pt: 'mapas', en: 'maps' },
  indice: { pt: 'indice', en: 'contents' },
  sobre: { pt: 'sobre', en: 'about' },
  notas: { pt: 'notas', en: 'notes' },
  colecoes: { pt: 'colecoes', en: 'collections' },
} as const;
export type Secao = keyof typeof SEGMENTOS;

const BASE = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

/** Prefixa um caminho interno com o `base` do site (GitHub Pages de projeto). */
export function url(caminho = ''): string {
  return BASE + caminho.replace(/^\/+/, '');
}

/** Caminho de uma página numa língua: rota('en', 'mapas', '001-x') → /essencial-geo/en/maps/001-x/ */
export function rota(lingua: Lingua, secao?: Secao, ...resto: string[]): string {
  const partes = [lingua === 'en' ? 'en' : '', secao ? SEGMENTOS[secao][lingua] : '', ...resto].filter(Boolean);
  return url(partes.length ? `${partes.join('/')}/` : '');
}

/** Descobre a língua pelo caminho da página. */
export function linguaDe(caminho: string): Lingua {
  const semBase = caminho.startsWith(BASE) ? caminho.slice(BASE.length) : caminho.replace(/^\/+/, '');
  return /^en(\/|$)/.test(semBase) ? 'en' : 'pt';
}

/** A mesma página na outra língua (para o seletor PT · EN e o hreflang). */
export function caminhoEquivalente(caminho: string, destino: Lingua): string {
  let resto = caminho.startsWith(BASE) ? caminho.slice(BASE.length) : caminho.replace(/^\/+/, '');
  const origem = linguaDe(caminho);
  if (origem === 'en') resto = resto.replace(/^en\/?/, '');
  const [primeiro, ...demais] = resto.split('/');
  const secao = (Object.keys(SEGMENTOS) as Secao[]).find((s) => SEGMENTOS[s][origem] === primeiro);
  const traduzido = secao ? [SEGMENTOS[secao][destino], ...demais] : [primeiro, ...demais];
  const final = traduzido.filter((p, i) => p || i === traduzido.length - 1).join('/');
  return url(`${destino === 'en' ? 'en/' : ''}${final}`);
}

/** Textos da interface. */
export const t = (lingua: Lingua) => UI[lingua];

/* ---------- Datas --------------------------------------------------------
 * Datas de publicação são "dias" (AAAA-MM-DD) e são lidas em UTC para não
 * escorregar um dia para trás no fuso de Brasília.
 */
const MESES_ABNT = ['jan.', 'fev.', 'mar.', 'abr.', 'maio', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];
const MESES_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** 14 out. 2026 (ABNT NBR 6023) · 14 Oct 2026 */
export function dataCurta(d: Date, lingua: Lingua = 'pt'): string {
  const mes = (lingua === 'en' ? MESES_EN : MESES_ABNT)[d.getUTCMonth()];
  return `${d.getUTCDate()} ${mes} ${d.getUTCFullYear()}`;
}

/** sexta-feira, 16 de outubro de 2026 · Friday, 16 October 2026 — a "linha de data" de jornal. */
export function dataExtensa(d: Date, lingua: Lingua = 'pt'): string {
  return new Intl.DateTimeFormat(IDIOMA[lingua].codigo, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}

export function dataIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}
