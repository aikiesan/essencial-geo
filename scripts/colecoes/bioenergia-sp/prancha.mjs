#!/usr/bin/env node
/**
 * Coleção «Bioenergia em SP» — desenha uma prancha a partir do cache de preparar.py (uso interno).
 *
 *   node scripts/colecoes/bioenergia-sp/prancha.mjs rebanhos
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  RAIZ, LP, SERIF, MONO, TINTA, CINZA, ZERO, esc, nf, tr, lingua, largura,
  gerarPrancha, legendaClasses, legendaFaixa, rotuloPainel,
} from '../lib/prancha-sp.mjs';

export const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'bioenergia-sp', 'serie.json'), 'utf8'));
const PLASMA = ['#f0f921', '#fca636', '#e16462', '#b12a90', '#6a00a8', '#0d0887'];
const VIRIDIS = ['#fde725', '#7ad151', '#22a884', '#2a788e', '#414487', '#440154'];

const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `bioenergia-sp-${nome}.json`), 'utf8'));
const L = (pt, en) => (lingua() === 'en' ? en : pt);
const serie = (i) => () => L(`BIOENERGIA EM SP · ${i}/4`, `BIOENERGY IN SÃO PAULO · ${i}/4`);
/** Casas decimais de um limite de classe. */
const casas = (v) => (v < 1 ? 2 : v < 10 ? 1 : 0);
const cor = (paleta) => (k) => (k === null || k === undefined ? null : k === 0 ? ZERO : paleta[k - 1]);

/** Lista "nome ........ valor" do painel. */
function lista(itens, y, { tamanho = 18, passo = 26, x = 0, larg = LP } = {}) {
  const s = [];
  itens.forEach(([nome, valor], i) => {
    const yy = y + i * passo;
    s.push(`<text x="${x}" y="${yy}" font-family="${SERIF}" font-size="${tamanho}">${esc(nome)}</text>`);
    s.push(`<text x="${x + larg}" y="${yy}" text-anchor="end" font-family="${MONO}" font-size="${tamanho - 3}">${esc(valor)}</text>`);
    const x0 = x + largura(nome, tamanho) + 10;
    const x1 = x + larg - largura(valor, tamanho - 3, { mono: true }) - 10;
    if (x1 > x0) s.push(`<path d="M${x0} ${yy - 4}H${x1}" stroke="#c4c9ce" stroke-width="1" stroke-dasharray="1 4"/>`);
  });
  return { svg: s.join('\n'), y: y + itens.length * passo };
}

/* ------------------------------------------------------------------ 2/4 rebanhos */
async function rebanhos() {
  const c = await ler('rebanhos');
  const herds = ['bovino', 'suino', 'galinaceos'];
  const titulos = { bovino: ['BOVINOS', 'CATTLE'], suino: ['SUÍNOS', 'PIGS'], galinaceos: ['GALINÁCEOS', 'POULTRY'] };
  const nSem = c.sem_informacao.length;
  return () => ({
    layout: 'quatro',
    serie: serie(2),
    titulo: () => L('Rebanhos', 'Livestock'),
    subtitulo: () => L(`Bovinos, suínos e galináceos por município, ${c.ano}`, `Cattle, pigs and poultry by municipality, ${c.ano}`),
    mapas: () =>
      herds.map((h) => {
        const r = c.rebanhos[h];
        return {
          titulo: `${L(...titulos[h])} · ${L('CABEÇAS/KM²', 'HEAD/KM²')}`,
          preencher: (cd) => cor(PLASMA)(c.valores[cd]?.[h] ?? null),
          legenda: legendaFaixa(PLASMA.slice(0, r.quebras.length), r.quebras.map((v) => nf(v, casas(v))), { larg: 58, id: `lf${h}` }),
          destaques: r.maiores.slice(0, 3).map((m) => ({ cd: m.cd, texto: m.nome })),
        };
      }),
    quartoQuadro: (w) => {
      const s = [];
      const t = 17;
      const linhas = (txt, y) => {
        const ls = [];
        let atual = '';
        for (const p of txt.split(' ')) {
          const tt = atual ? `${atual} ${p}` : p;
          if (largura(tt, t) > w && atual) { ls.push(atual); atual = p; } else atual = tt;
        }
        ls.push(atual);
        ls.forEach((l, i) => s.push(`<text x="0" y="${y + i * 24}" font-family="${SERIF}" font-size="${t}" fill="${TINTA}">${esc(l)}</text>`));
        return y + ls.length * 24 + 14;
      };
      s.push(`<text x="0" y="0" font-family="${MONO}" font-size="13" letter-spacing="2.4" fill="${CINZA}">${L('COMO LER', 'HOW TO READ')}</text>`);
      let y = 34;
      y = linhas(L(
        `Cabeças por km²: efetivo em 31/12/${c.ano} dividido pela área do município. Seis classes por quantis, próprias de cada rebanho; cinza-claro é zero.`,
        `Head per km²: herd size on 31/12/${c.ano} divided by the municipality’s area. Six quantile classes, specific to each herd; light grey is zero.`), y);
      y = linhas(L(
        `Hachura: sem informação no IBGE — ${nSem} municípios, a maioria na Grande São Paulo e na Baixada Santista.`,
        `Hatching: no IBGE data — ${nSem} municipalities, most of them in Greater São Paulo and the Santos coast.`), y);
      linhas(L(
        `Os números de ${c.ano} são resultados preliminares da Pesquisa da Pecuária Municipal.`,
        `The ${c.ano} figures are preliminary results of the Municipal Livestock Survey.`), y);
      return s.join('\n');
    },
    numeros: () => [
      ...herds.map((h) => [nf(c.rebanhos[h].total), [L(`${c.rebanhos[h].rotulo} (cabeças)`, `${c.rebanhos[h].rotulo_en} (head)`)]]),
      [String(nSem), [L('municípios sem', 'municipalities'), L('informação', 'without data')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('MAIORES EFETIVOS', 'LARGEST HERDS'), y)];
      y += 40;
      for (const h of herds) {
        s.push(`<text x="0" y="${y}" font-family="${MONO}" font-size="14" letter-spacing="1.6" fill="${TINTA}">${L(...titulos[h])}</text>`);
        const l = lista(c.rebanhos[h].maiores.slice(0, 3).map((m) => [m.nome, nf(m.valor)]), y + 28, { tamanho: 18, passo: 25 });
        s.push(l.svg);
        y = l.y + 16;
      }
      return { svg: s.join('\n'), y };
    },
    fontes: () => [L(`IBGE, PPM ${c.ano} (tabela 3939)`, `IBGE, PPM ${c.ano} (table 3939)`), L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025')],
  });
}

/* ------------------------------------------------------------------ 3/4 cana */
async function cana() {
  const c = await ler('cana');
  const pctSp = c.area_colhida_ha / 100 / c.area_sp_km2 * 100;
  const rot = (i) => (i ? `${nf(c.quebras[i - 1], 1)} – ${nf(c.quebras[i], 1)} %` : L(`até ${nf(c.quebras[0], 1)} %`, `up to ${nf(c.quebras[0], 1)} %`));
  return () => ({
    layout: 'um',
    serie: serie(3),
    titulo: () => L('Cana-de-açúcar', 'Sugarcane'),
    subtitulo: () => L(`Área colhida como parte do território de cada município, ${c.ano}`, `Harvested area as a share of each municipality’s territory, ${c.ano}`),
    mapa: () => ({
      preencher: (cd) => cor(VIRIDIS)(c.valores[cd] ?? null),
      destaques: c.maiores_producao.slice(0, 5).map((m) => ({ cd: m.cd, texto: m.nome })),
      tamanhoDestaque: 15,
    }),
    numeros: () => [
      [nf(c.area_colhida_ha / 1e6, 2), [L('milhões de hectares', 'million hectares'), L('colhidos', 'harvested')]],
      [nf(c.producao_t / 1e6, 1), [L('milhões de toneladas', 'million tonnes'), L('produzidas', 'produced')]],
      [`${nf(pctSp, 1)} %`, [L('do território paulista', 'of the state’s territory')]],
      [String(c.acima_de_50pct), [L('municípios com mais da', 'municipalities with over'), L('metade do território em cana', 'half their territory in cane')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('ÁREA COLHIDA ÷ ÁREA DO MUNICÍPIO', 'HARVESTED AREA ÷ MUNICIPAL AREA'), y)];
      const itens = [[ZERO, L('zero', 'zero')], ...c.quebras.map((_, i) => [VIRIDIS[i], rot(i)]), [null, L('sem informação', 'no data')]];
      const leg = legendaClasses(itens, { y: y + 16, passo: 29, tamanho: 18, id: 'legcana' });
      s.push(leg.svg);
      y += 16 + leg.altura + 34;
      s.push(rotuloPainel(L('MAIORES PRODUTORES (T)', 'LARGEST PRODUCERS (T)'), y));
      const l = lista(c.maiores_producao.slice(0, 5).map((m) => [m.nome, nf(m.valor)]), y + 32, { passo: 26 });
      s.push(l.svg);
      return { svg: s.join('\n'), y: l.y };
    },
    fontes: () => [L(`IBGE, PAM ${c.ano} (tabela 1612)`, `IBGE, PAM ${c.ano} (table 1612)`), L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025')],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { rebanhos, cana };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/bioenergia-sp/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
const e = SERIE.find((s) => s.tema === nome);
const fazer = await TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => fazer() });
const { writeFile } = await import('node:fs/promises');
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `bioenergia-sp-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
