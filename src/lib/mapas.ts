import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getCollection, type CollectionEntry } from 'astro:content';
import { AUTORIA, CATEGORIAS, FORMATOS, SITE, type CategoriaId } from '../site.config';

export type Mapa = CollectionEntry<'mapas'>;

const BASE = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

/** Prefixa um caminho interno com o `base` do site (GitHub Pages de projeto). */
export function url(caminho = ''): string {
  return BASE + caminho.replace(/^\/+/, '');
}

/** Todos os mapas publicados, do mais recente para o mais antigo. */
export async function mapasPublicados(): Promise<Mapa[]> {
  const todos = await getCollection('mapas', ({ data }) => import.meta.env.DEV || !data.rascunho);
  return todos.sort((a, b) => b.data.data.getTime() - a.data.data.getTime() || b.data.numero - a.data.numero);
}

export function contarPorCategoria(mapas: Mapa[]): Record<CategoriaId, number> {
  const contagem = Object.fromEntries(Object.keys(CATEGORIAS).map((c) => [c, 0])) as Record<CategoriaId, number>;
  for (const m of mapas) contagem[m.data.categoria]++;
  return contagem;
}

export const numeroFormatado = (n: number) => String(n).padStart(3, '0');

const MESES = ['jan.', 'fev.', 'mar.', 'abr.', 'maio', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];

/** 14 out. 2026 — forma abreviada da ABNT (NBR 6023). Datas tratadas em UTC. */
export function dataAbnt(d: Date): string {
  return `${d.getUTCDate()} ${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function dataIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function linkMapa(m: Mapa): string {
  return url(`mapas/${m.id}/`);
}

export function urlAbsoluta(caminho: string, site: URL | undefined): string {
  return new URL(caminho, site ?? SITE.repositorio).toString();
}

/** Endereço público de um arquivo da pasta do mapa (copiado para /public/mapas pelo script de sincronização). */
export function arquivoDoMapa(m: Mapa, arquivo: string): string {
  return url(`mapas/${m.id}/${arquivo.replace(/^\.\//, '')}`);
}

export interface DownloadResolvido {
  formato: keyof typeof FORMATOS;
  sigla: string;
  rotulo: string;
  ext: string;
  href?: string;
  tamanho?: string;
  externo: boolean;
}

export function resolverDownloads(m: Mapa): DownloadResolvido[] {
  return m.data.downloads.map((d) => {
    const f = FORMATOS[d.formato];
    // Arquivo listado mas ainda não presente na pasta → botão "em breve", nunca link quebrado.
    const local = d.arquivo && existsSync(join(process.cwd(), 'mapas', m.id, d.arquivo)) ? arquivoDoMapa(m, d.arquivo) : undefined;
    const href = d.url ?? local;
    return {
      formato: d.formato,
      sigla: f.sigla,
      rotulo: d.rotulo ?? f.rotulo,
      ext: f.ext,
      href,
      tamanho: d.tamanho,
      externo: Boolean(d.url),
    };
  });
}

export function autoresDe(m: Mapa) {
  return m.data.autores?.length ? m.data.autores : [AUTORIA];
}

export function rotuloCategoria(id: CategoriaId) {
  return CATEGORIAS[id];
}
