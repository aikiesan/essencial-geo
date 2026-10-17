import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getCollection, type CollectionEntry } from 'astro:content';
import { AUTORIA, CATEGORIA_IDS, FORMATOS, SITE, type CategoriaId } from '../site.config';
import { dataCurta, rota, t, url, type Lingua } from '../i18n';

export { url, dataIso } from '../i18n';

type Entrada = CollectionEntry<'mapas'>;
type Traducao = CollectionEntry<'traducoes'>;

/** Um mapa já na língua da página. `data` traz os textos traduzidos; `original`, o português. */
export type Mapa = Entrada & {
  lingua: Lingua;
  original: Entrada['data'];
  traducao?: Traducao;
  /** Só em desenvolvimento: falta o README.en.md e o texto caiu para o português. */
  traducaoPendente: boolean;
  /** Só em desenvolvimento: a data ainda não chegou (o mapa está agendado). */
  agendado: boolean;
};

const DEV = import.meta.env.DEV;

/* ---------- Agenda ---------------------------------------------------------
 * Um mapa com data futura fica fora do site até as 12h UTC (9h em Brasília) do
 * seu dia. O site é estático: quem o faz "entrar no ar" é a recompilação diária
 * agendada em .github/workflows/deploy.yml.
 */
export function momentoPublicacao(dia: Date): Date {
  return new Date(dia.getTime() + SITE.horaPublicacaoUtc * 3600_000);
}
export const noAr = (dia: Date, agora = new Date()) => momentoPublicacao(dia) <= agora;

function localizar(m: Entrada, lingua: Lingua, traducoes: Map<string, Traducao>, agora: Date): Mapa {
  const traducao = traducoes.get(m.id);
  const base = { lingua, original: m.data, traducao, agendado: !noAr(m.data.data, agora) };
  if (lingua === 'pt' || !traducao) return { ...m, ...base, traducaoPendente: lingua === 'en' };
  const en = traducao.data;
  return {
    ...m,
    ...base,
    traducaoPendente: false,
    data: {
      ...m.data,
      titulo: en.titulo,
      subtitulo: en.subtitulo,
      contexto: en.contexto,
      imagem: en.imagem ?? m.data.imagem,
      imagem_alt: en.imagem_alt,
      recorte: en.recorte ?? m.data.recorte,
      metodo: en.metodo ?? m.data.metodo,
      escala: en.escala ?? m.data.escala,
    },
  };
}

/**
 * Todos os mapas no ar, do mais recente para o mais antigo, na língua pedida.
 * Em desenvolvimento aparecem também rascunhos e agendados (com selo).
 * Na compilação de produção, um mapa sem README.en.md interrompe o build:
 * todo mapa publicado sai em PT-BR e EN-UK.
 */
export async function mapasPublicados(lingua: Lingua = 'pt'): Promise<Mapa[]> {
  const agora = new Date();
  const todos = await getCollection('mapas', ({ data }) => DEV || (!data.rascunho && noAr(data.data, agora)));
  const traducoes = new Map((await getCollection('traducoes')).map((tr) => [tr.id, tr]));
  if (!DEV) {
    const faltando = todos.filter((m) => !traducoes.has(m.id)).map((m) => m.id);
    if (faltando.length)
      throw new Error(
        `Falta a versão em inglês (README.en.md) de: ${faltando.join(', ')}. Todo mapa publicado sai em PT-BR e EN-UK.`,
      );
  }
  return todos
    .map((m) => localizar(m, lingua, traducoes, agora))
    .sort((a, b) => b.data.data.getTime() - a.data.data.getTime() || b.data.numero - a.data.numero);
}

/** O próximo mapa agendado (fora de rascunho), para a linha "Próxima" da barra lateral. */
export async function proximaPublicacao(): Promise<Date | undefined> {
  const agora = new Date();
  const futuros = await getCollection('mapas', ({ data }) => !data.rascunho && !noAr(data.data, agora));
  return futuros.map((m) => m.data.data).sort((a, b) => a.getTime() - b.getTime())[0];
}

export function contarPorCategoria(mapas: Mapa[]): Record<CategoriaId, number> {
  const contagem = Object.fromEntries(CATEGORIA_IDS.map((c) => [c, 0])) as Record<CategoriaId, number>;
  for (const m of mapas) contagem[m.data.categoria]++;
  return contagem;
}

export const numeroFormatado = (n: number) => String(n).padStart(3, '0');

/** 14 out. 2026 — forma abreviada da ABNT (NBR 6023), sempre em português. */
export const dataAbnt = (d: Date) => dataCurta(d, 'pt');

export function linkMapa(m: Mapa): string {
  return rota(m.lingua, 'mapas', m.id);
}

export function urlAbsoluta(caminho: string, site: URL | undefined): string {
  return new URL(caminho, site ?? SITE.repositorio).toString();
}

/** Endereço público de um arquivo da pasta do mapa (copiado para /public/mapas pelo script de sincronização). */
export function arquivoDoMapa(m: { id: string }, arquivo: string): string {
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
  const formatos = t(m.lingua).formatos;
  return m.data.downloads.map((d) => {
    const f = FORMATOS[d.formato];
    // Arquivo listado mas ainda não presente na pasta → botão "em breve", nunca link quebrado.
    const arquivo = m.lingua === 'en' && d.arquivo_en ? d.arquivo_en : d.arquivo;
    const local = arquivo && existsSync(join(process.cwd(), 'mapas', m.id, arquivo)) ? arquivoDoMapa(m, arquivo) : undefined;
    const url = m.lingua === 'en' && d.url_en ? d.url_en : d.url;
    const href = url ?? local;
    const rotulo = m.lingua === 'en' ? (d.rotulo_en ?? formatos[d.formato]) : (d.rotulo ?? formatos[d.formato]);
    // O README escreve '1,6 MB'; em inglês o separador decimal é o ponto.
    const tamanho = m.lingua === 'en' ? d.tamanho?.replace(/(\d),(\d)/, '$1.$2') : d.tamanho;
    return { formato: d.formato, sigla: f.sigla, rotulo, ext: f.ext, href, tamanho, externo: Boolean(d.url) };
  });
}

/** Nome de uma fonte na língua da página. */
export function nomeFonte(f: { nome: string; nome_en?: string }, lingua: Lingua): string {
  return lingua === 'en' ? (f.nome_en ?? f.nome) : f.nome;
}

/** Escolhe `campo_en` quando a página é em inglês e ele existe. */
export function emLingua<T extends Record<string, unknown>>(obj: T, campo: string, lingua: Lingua): string | undefined {
  const v = lingua === 'en' ? (obj[`${campo}_en`] ?? obj[campo]) : obj[campo];
  return v as string | undefined;
}

export function autoresDe(m: Mapa) {
  return m.data.autores?.length ? m.data.autores : [AUTORIA];
}

export function rotuloCategoria(id: CategoriaId, lingua: Lingua) {
  return t(lingua).categorias[id];
}
