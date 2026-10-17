import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORIA_IDS, COLECAO_IDS, FORMATO_IDS } from './site.config';

/** Um parágrafo só, sem linhas em branco — vale para o contexto nas duas línguas. */
const paragrafo = z
  .string()
  .max(900, 'O contexto deve caber em um parágrafo curto (até 900 caracteres).')
  .refine((t) => !/\n\s*\n/.test(t.trim()), 'O contexto deve ter um único parágrafo.');

/** Rótulo com versão opcional em inglês (camadas, indicadores, downloads). */
const rotulo = { rotulo: z.string(), rotulo_en: z.string().optional() };
const unidade = { unidade: z.string().optional(), unidade_en: z.string().optional() };
const itemGrafico = z.object({ ...rotulo, valor: z.number(), cor: z.string().optional() });

/**
 * Painel "Leitura rápida" da ficha, à maneira dos widgets de um SIG web:
 * um número de destaque, barras ou proporção (rosca).
 */
const indicador = z.discriminatedUnion('tipo', [
  z.object({
    tipo: z.literal('numero'),
    ...rotulo,
    ...unidade,
    valor: z.number(),
    nota: z.string().optional(),
    nota_en: z.string().optional(),
  }),
  z.object({ tipo: z.literal('barras'), ...rotulo, ...unidade, itens: z.array(itemGrafico).min(1) }),
  z.object({ tipo: z.literal('proporcao'), ...rotulo, ...unidade, itens: z.array(itemGrafico).min(2) }),
]);

/**
 * Cada mapa é uma pasta em /mapas/NNN-slug/ e o README.md dessa pasta é a
 * fonte única de verdade: o GitHub o exibe como ficha técnica e o site o lê
 * como conteúdo. O id da entrada é o nome da pasta (ex.: 001-estado-sao-paulo).
 * A versão em inglês fica ao lado, em README.en.md (coleção `traducoes`).
 */
const mapas = defineCollection({
  loader: glob({
    pattern: '*/README.md',
    base: './mapas',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z.object({
      numero: z.number().int().positive(),
      titulo: z.string().min(3),
      subtitulo: z.string().optional(),
      /** Dia de publicação. Uma data futura agenda o mapa: ele entra no ar nesse dia, às 9h de Brasília. */
      data: z.coerce.date(),
      atualizado: z.coerce.date().optional(),
      categoria: z.enum(CATEGORIA_IDS),
      /** Série a que o mapa pertence (src/site.config.ts → COLECOES). A ordem de leitura é o número. */
      colecao: z.enum(COLECAO_IDS).optional(),
      tags: z.array(z.string()).default([]),
      rascunho: z.boolean().default(false),
      /** Marca pranchas-modelo com dados sintéticos. */
      exemplo: z.boolean().default(false),

      /** O parágrafo do feed: exatamente um parágrafo, sem quebras. */
      contexto: paragrafo,

      imagem: image(),
      imagem_alt: z.string().min(10, 'Descreva o mapa para leitores de tela.'),

      recorte: z.string(),
      fontes: z
        .array(
          z.object({
            nome: z.string(),
            nome_en: z.string().optional(),
            url: z.string().url().optional(),
            ano: z.union([z.number(), z.string()]).optional(),
          }),
        )
        .min(1),
      crs: z.string(),
      epsg: z.number().int().optional(),
      escala: z.string().optional(),
      software: z.array(z.string()).default([]),
      metodo: z.string().optional(),

      /** Camadas do conjunto de dados, com o tipo de geometria (como a lista de camadas de um SIG). */
      camadas: z
        .array(
          z.object({
            nome: z.string(),
            tipo: z.enum(['ponto', 'linha', 'poligono', 'grade', 'raster']),
            descricao: z.string().optional(),
            descricao_en: z.string().optional(),
            cor: z.string().optional(),
          }),
        )
        .default([]),
      indicadores: z.array(indicador).default([]),

      downloads: z
        .array(
          z.object({
            formato: z.enum(FORMATO_IDS),
            /** Caminho relativo à pasta do mapa (ex.: dados/campinas.gpkg.zip) */
            arquivo: z.string().optional(),
            /** Versão em inglês do mesmo arquivo (ex.: mapa_preview.en.png), usada nas páginas em inglês. */
            arquivo_en: z.string().optional(),
            /** Ou um endereço externo (release do GitHub, Zenodo…) */
            url: z.string().url().optional(),
            /** Endereço externo da versão em inglês, usado nas páginas em inglês. */
            url_en: z.string().url().optional(),
            tamanho: z.string().optional(),
            rotulo: z.string().optional(),
            rotulo_en: z.string().optional(),
          }),
        )
        .default([]),

      doi: z
        .string()
        .regex(/^10\.\d{4,9}\/\S+$/, 'DOI no formato 10.xxxx/yyyy, sem https://doi.org/')
        .optional(),
      versao: z.string().default('1.0.0'),
      autores: z
        .array(z.object({ sobrenome: z.string(), nome: z.string(), orcid: z.string().optional() }))
        .optional(),

      discussoes: z
        .array(z.object({ onde: z.string(), url: z.string().url() }))
        .default([]),
    }),
});

/**
 * Versão em inglês (EN-UK) de cada mapa: mapas/NNN-slug/README.en.md.
 * Só os campos de texto; números, arquivos e DOI vêm do README.md em português.
 */
const traducoes = defineCollection({
  loader: glob({
    pattern: '*/README.en.md',
    base: './mapas',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string().min(3),
      subtitulo: z.string().optional(),
      contexto: paragrafo,
      /** Prancha com os textos em inglês; se ausente, usa a prancha em português. */
      imagem: image().optional(),
      imagem_alt: z.string().min(10, 'Describe the map for screen-reader users.'),
      recorte: z.string().optional(),
      metodo: z.string().optional(),
      escala: z.string().optional(),
    }),
});

/**
 * Notas e novidades do atlas, como num jornal: notas/AAAA-MM-DD-slug/pt.md e en.md.
 * O id é "pasta/língua" (ex.: 2026-10-17-essencial-geo-no-ar/pt).
 */
const notas = defineCollection({
  loader: glob({
    pattern: '*/{pt,en}.md',
    base: './notas',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    titulo: z.string().min(3),
    resumo: z.string().max(320),
    data: z.coerce.date(),
    atualizado: z.coerce.date().optional(),
    tipo: z.enum(['novidade', 'bastidores', 'metodo', 'agenda']).default('novidade'),
    tags: z.array(z.string()).default([]),
    rascunho: z.boolean().default(false),
  }),
});

export const collections = { mapas, traducoes, notas };
