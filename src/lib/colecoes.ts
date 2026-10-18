/**
 * Coleções: séries de pranchas sobre um mesmo tema (campo `colecao` do README.md).
 * A ordem de leitura é o número da prancha.
 */
import { getCollection } from 'astro:content';
import { COLECOES, COLECAO_IDS, type ColecaoId } from '../site.config';
import type { Lingua } from '../i18n';
import { mapasPublicados, noAr, type Mapa } from './mapas';

export interface Colecao {
  id: ColecaoId;
  titulo: string;
  resumo: string;
  /** Pranchas no ar, em ordem de leitura. */
  mapas: Mapa[];
  /** Ids de todas as pranchas previstas (fora de rascunho, inclusive agendadas), em ordem de leitura. */
  ordem: string[];
  /** Dia da próxima prancha agendada da coleção. */
  proxima?: Date;
}

export async function colecoes(lingua: Lingua): Promise<Colecao[]> {
  const agora = new Date();
  const publicados = await mapasPublicados(lingua);
  const previstos = (await getCollection('mapas', ({ data }) => !data.rascunho && Boolean(data.colecao))).sort(
    (a, b) => a.data.numero - b.data.numero,
  );
  return COLECAO_IDS.map((id) => {
    const desta = previstos.filter((m) => m.data.colecao === id);
    return {
      id,
      ...COLECOES[id][lingua],
      mapas: publicados.filter((m) => m.data.colecao === id).sort((a, b) => a.data.numero - b.data.numero),
      ordem: desta.map((m) => m.id),
      proxima: desta.map((m) => m.data.data).find((d) => !noAr(d, agora)),
    };
  });
}

/** Coleções com ao menos uma prancha no ar (as que têm página). */
export async function colecoesNoAr(lingua: Lingua): Promise<Colecao[]> {
  return (await colecoes(lingua)).filter((c) => c.mapas.length > 0);
}

/** A coleção de um mapa e a posição dele na série ("3 de 27"). */
export async function colecaoDoMapa(m: Mapa): Promise<{ colecao: Colecao; posicao: number; total: number } | undefined> {
  if (!m.data.colecao) return undefined;
  const colecao = (await colecoes(m.lingua)).find((c) => c.id === m.data.colecao);
  if (!colecao) return undefined;
  const total = Math.max(colecao.ordem.length, colecao.mapas.length);
  return { colecao, posicao: colecao.ordem.indexOf(m.id) + 1, total };
}
