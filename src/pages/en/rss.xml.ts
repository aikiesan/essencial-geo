import type { APIContext } from 'astro';
import { gerarRss } from '../../lib/rss';

export const GET = (context: APIContext) => gerarRss(context, 'en');
