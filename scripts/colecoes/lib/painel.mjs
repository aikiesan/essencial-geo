/**
 * Peças de painel comuns às coleções de cruzamentos (uso interno): fita, barras, legendas com barra,
 * caixas avulsas (zero, sem informação) e a hachura de "sem informação" para as camadas do mapa.
 * Mesma linguagem das pranchas da RMC (scripts/colecoes/rmc/prancha.mjs).
 */
import { LP, SERIF, MONO, TINTA, CINZA, PAPEL, esc, nf, f1, lingua, rotuloPainel } from './prancha-sp.mjs';

export const L = (pt, en) => (lingua() === 'en' ? en : pt);
export const NEUTRO = '#f1f2f3';
export const ZERO = '#eef0f1';
export const pct = (v, casas = null) => `${nf(v, casas ?? (v < 10 ? 1 : 0))} %`;
/** Número grande por extenso curto: 1,41 milhão / 685 mil. */
export function grande(v) {
  if (v >= 1e6) return L(`${nf(v / 1e6, v >= 1e7 ? 1 : 2)} ${v >= 2e6 ? 'milhões' : 'milhão'}`, `${nf(v / 1e6, v >= 1e7 ? 1 : 2)} million`);
  if (v >= 1e4) return L(`${nf(Math.round(v / 1e3))} mil`, `${nf(Math.round(v / 1e3))} thousand`);
  return nf(v);
}

/** Hachura de "sem informação" para uma camada do mapa (camadas[].hachura em quadroMapa). */
export const HACHURA = { cor: '#aeb4ba', passo: 7, largura: 1.1, angulo: 45, fundo: PAPEL };

/** Fita dividida pelas partes (soma 100) com contorno. */
export function fita(partes, y, altura = 22) {
  const s = [];
  let x = 0;
  for (const [v, cor] of partes) {
    const w = (v / 100) * LP;
    s.push(`<rect x="${f1(x)}" y="${y}" width="${f1(Math.max(w, 0.6))}" height="${altura}" fill="${cor}"/>`);
    x += w;
  }
  s.push(`<rect x="0" y="${y}" width="${LP}" height="${altura}" fill="none" stroke="${TINTA}" stroke-width=".8"/>`);
  return s.join('\n');
}

/** Barras horizontais curtas com rótulo à esquerda: [[nome, valor, cor, texto?]]. */
export function barras(itens, y, { max, passo = 19, x0 = 190, sufixo = ' %', casas = 0, fmt = null } = {}) {
  const s = [];
  const larg = LP - x0 - 70;
  itens.forEach(([nome, v, cor, txt], i) => {
    const yy = y + i * passo;
    s.push(`<text x="${x0 - 10}" y="${f1(yy + 11)}" text-anchor="end" font-family="${SERIF}" font-size="14">${esc(nome)}</text>`);
    s.push(`<rect x="${x0}" y="${f1(yy + 2)}" width="${f1(Math.max((v / max) * larg, 1))}" height="11" fill="${cor}"/>`);
    s.push(`<text x="${f1(x0 + (v / max) * larg + 6)}" y="${f1(yy + 11)}" font-family="${MONO}" font-size="12">${esc(txt ?? (fmt ? fmt(v) : `${nf(v, casas)}${sufixo}`))}</text>`);
  });
  return { svg: s.join('\n'), y: y + itens.length * passo };
}

/** Legenda vertical com uma barra da parte de cada classe: [[cor, rótulo, valor, total]]. */
export function legendaBarras(itens, y, { titulo, rotuloValor, x0 = 270, passo = 25 }) {
  const s = [rotuloPainel(titulo, y)];
  y += 24;
  const max = Math.max(...itens.map((i) => i[2]));
  for (const [cor, rot, v, tot] of itens) {
    s.push(`<rect x="0" y="${y - 14}" width="30" height="17" fill="${cor}" stroke="#1a211a" stroke-width=".6"/>`);
    s.push(`<text x="42" y="${y}" font-family="${SERIF}" font-size="16">${esc(rot)}</text>`);
    const w = (v / max) * (LP - x0 - 64);
    s.push(`<rect x="${x0}" y="${y - 10}" width="${f1(Math.max(w, 1))}" height="10" fill="${cor}"/>`);
    s.push(`<text x="${f1(x0 + w + 6)}" y="${y}" font-family="${MONO}" font-size="12">${pct((v / tot) * 100)}</text>`);
    y += passo;
  }
  s.push(`<text x="${x0}" y="${y - 2}" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(rotuloValor)}</text>`);
  return { svg: s.join('\n'), y: y + 12 };
}

let nHach = 0;
/** Caixa de legenda avulsa (zero, sem informação). */
export function caixaLegenda(cor, rot, y, { hachura = false, x = 0 } = {}) {
  const id = `semL${nHach++}`;
  const fill = hachura ? `url(#${id})` : cor;
  return `${hachura ? `<defs><pattern id="${id}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="${PAPEL}"/><path d="M0 0V7" stroke="#aeb4ba" stroke-width="1.1"/></pattern></defs>` : ''}<rect x="${x}" y="${y - 14}" width="30" height="17" fill="${fill}" stroke="#1a211a" stroke-width=".6"/><text x="${x + 42}" y="${y}" font-family="${SERIF}" font-size="16">${esc(rot)}</text>`;
}

/** Legenda categórica simples em coluna: [[cor, rótulo, valor à direita?]]. */
export function legendaCategorias(itens, y, { titulo = null, passo = 25, direita = null } = {}) {
  const s = [];
  if (titulo) { s.push(rotuloPainel(titulo, y)); y += 24; }
  for (const [cor, rot, v] of itens) {
    s.push(`<rect x="0" y="${y - 14}" width="30" height="17" fill="${cor}" stroke="#1a211a" stroke-width=".6"/>`);
    s.push(`<text x="42" y="${y}" font-family="${SERIF}" font-size="16">${esc(rot)}</text>`);
    if (v !== undefined && v !== null) s.push(`<text x="${LP}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="13">${esc(v)}</text>`);
    y += passo;
  }
  if (direita) s.push(`<text x="${LP}" y="${y - 4}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(direita)}</text>`);
  return { svg: s.join('\n'), y: y + (direita ? 10 : 0) };
}

/** Parágrafo curto em serifa itálica, quebrado na largura do painel. */
export function nota(texto, y, { tamanho = 15, cor = '#4f4a41', max = LP } = {}) {
  const s = [];
  const palavras = texto.split(' ');
  let linha = '';
  const larg = (t) => t.length * tamanho * 0.47;
  for (const p of palavras) {
    const t = linha ? `${linha} ${p}` : p;
    if (larg(t) > max && linha) { s.push(linha); linha = p; } else linha = t;
  }
  if (linha) s.push(linha);
  return { svg: s.map((l, i) => `<text x="0" y="${f1(y + i * (tamanho + 6))}" font-family="${SERIF}" font-style="italic" font-size="${tamanho}" fill="${cor}">${esc(l)}</text>`).join('\n'), y: y + s.length * (tamanho + 6) };
}
