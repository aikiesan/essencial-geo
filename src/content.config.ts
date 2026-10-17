import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORIA_IDS, FORMATO_IDS } from './site.config';

/**
 * Cada mapa é uma pasta em /mapas/NNN-slug/ e o README.md dessa pasta é a
 * fonte única de verdade: o GitHub o exibe como ficha técnica e o site o lê
 * como conteúdo. O id da entrada é o nome da pasta (ex.: 001-densidade-urbana-campinas).
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
      data: z.coerce.date(),
      atualizado: z.coerce.date().optional(),
      categoria: z.enum(CATEGORIA_IDS),
      tags: z.array(z.string()).default([]),
      rascunho: z.boolean().default(false),
      /** Marca pranchas-modelo com dados sintéticos. */
      exemplo: z.boolean().default(false),

      /** O parágrafo do feed: exatamente um parágrafo, sem quebras. */
      contexto: z
        .string()
        .max(900, 'O contexto deve caber em um parágrafo curto (até 900 caracteres).')
        .refine((t) => !/\n\s*\n/.test(t.trim()), 'O contexto deve ter um único parágrafo.'),

      imagem: image(),
      imagem_alt: z.string().min(10, 'Descreva o mapa para leitores de tela.'),

      recorte: z.string(),
      fontes: z
        .array(z.object({ nome: z.string(), url: z.string().url().optional(), ano: z.union([z.number(), z.string()]).optional() }))
        .min(1),
      crs: z.string(),
      epsg: z.number().int().optional(),
      escala: z.string().optional(),
      software: z.array(z.string()).default([]),
      metodo: z.string().optional(),

      downloads: z
        .array(
          z.object({
            formato: z.enum(FORMATO_IDS),
            /** Caminho relativo à pasta do mapa (ex.: dados/campinas.gpkg.zip) */
            arquivo: z.string().optional(),
            /** Ou um endereço externo (release do GitHub, Zenodo…) */
            url: z.string().url().optional(),
            tamanho: z.string().optional(),
            rotulo: z.string().optional(),
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

export const collections = { mapas };
