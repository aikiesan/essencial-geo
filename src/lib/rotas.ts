/**
 * getStaticPaths das páginas que existem nas duas línguas. Cada arquivo em
 * src/pages (PT) e src/pages/en (EN) só escolhe a língua e entrega a vista
 * correspondente em src/vistas.
 */
import type { GetStaticPaths } from 'astro';
import { CATEGORIA_IDS } from '../site.config';
import type { Lingua } from '../i18n';
import { mapasPublicados } from './mapas';
import { notasPublicadas } from './notas';
import { colecoesNoAr } from './colecoes';

export const POR_FOLHA = 8;

export const caminhosFeed = (lingua: Lingua): GetStaticPaths =>
  async ({ paginate }) =>
    paginate(await mapasPublicados(lingua), { pageSize: POR_FOLHA });

export const caminhosCategoria = (lingua: Lingua): GetStaticPaths =>
  async () => {
    const mapas = await mapasPublicados(lingua);
    return CATEGORIA_IDS.map((categoria) => ({
      params: { categoria },
      props: { categoria, mapas: mapas.filter((m) => m.data.categoria === categoria) },
    }));
  };

export const caminhosColecao = (lingua: Lingua): GetStaticPaths =>
  async () =>
    (await colecoesNoAr(lingua)).map((colecao) => ({ params: { colecao: colecao.id }, props: { colecao } }));

export const caminhosMapa = (lingua: Lingua): GetStaticPaths =>
  async () => {
    const mapas = await mapasPublicados(lingua);
    return mapas.map((mapa, i) => ({
      params: { mapa: mapa.id },
      // feed é do mais recente para o mais antigo
      props: { mapa, maisNovo: mapas[i - 1], maisAntigo: mapas[i + 1] },
    }));
  };

export const caminhosNota = (lingua: Lingua): GetStaticPaths =>
  async () => {
    const notas = await notasPublicadas(lingua);
    return notas.map((nota, i) => ({
      params: { nota: nota.pasta },
      props: { nota, maisNova: notas[i - 1], maisAntiga: notas[i + 1] },
    }));
  };
