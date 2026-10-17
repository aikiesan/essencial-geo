import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lingua } from '../i18n';
import { noAr } from './mapas';

/** Uma nota numa língua. `pasta` é o slug comum às duas versões (ex.: 2026-10-17-essencial-geo-no-ar). */
export type Nota = CollectionEntry<'notas'> & { pasta: string; lingua: Lingua; agendada: boolean };

const DEV = import.meta.env.DEV;

/**
 * Notas no ar, da mais recente para a mais antiga. Como os mapas, uma nota com
 * data futura espera o seu dia, e em produção toda nota precisa de pt.md e en.md.
 */
export async function notasPublicadas(lingua: Lingua): Promise<Nota[]> {
  const agora = new Date();
  const todas = await getCollection('notas', ({ data }) => DEV || (!data.rascunho && noAr(data.data, agora)));
  if (!DEV) {
    const por = (l: Lingua) => new Set(todas.filter((n) => n.id.endsWith(`/${l}`)).map((n) => n.id.split('/')[0]));
    const pt = por('pt');
    const en = por('en');
    const soUma = [...pt].filter((p) => !en.has(p)).concat([...en].filter((p) => !pt.has(p)));
    if (soUma.length)
      throw new Error(`Nota sem as duas línguas (pt.md e en.md): ${soUma.join(', ')}. Toda nota sai em PT-BR e EN-UK.`);
  }
  return todas
    .filter((n) => n.id.endsWith(`/${lingua}`))
    .map((n) => ({ ...n, pasta: n.id.split('/')[0], lingua, agendada: !noAr(n.data.data, agora) }))
    .sort((a, b) => b.data.data.getTime() - a.data.data.getTime() || b.pasta.localeCompare(a.pasta));
}
