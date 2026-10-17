#!/usr/bin/env node
/**
 * Coleção «Bioenergia em SP» — desenha uma prancha a partir do cache de preparar.py (uso interno).
 *
 *   node scripts/colecoes/bioenergia-sp/prancha.mjs biogas|rebanhos|cana|usinas
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  RAIZ, LP, SERIF, MONO, TINTA, CINZA, ZERO, PAPEL, esc, nf, lingua, largura,
  gerarPrancha, legendaClasses, legendaFaixa, rotuloPainel,
} from '../lib/prancha-sp.mjs';
import { legendaCirculos } from '../lib/arte.mjs';

export const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'bioenergia-sp', 'serie.json'), 'utf8'));
const PLASMA = ['#f0f921', '#fca636', '#e16462', '#b12a90', '#6a00a8', '#0d0887'];
const VIRIDIS = ['#fde725', '#7ad151', '#22a884', '#2a788e', '#414487', '#440154'];
const CANA_CLARO = ['#f3efd9', '#e6e2b8', '#d2d39a', '#b9c27f', '#9cad69', '#7f9656'];
const MIN = { verde_mata: '#2f5d3a', ameixa: '#6b3d5c', azul_profundo: '#234e70', argila: '#9c4a32' };
const NEUTRO = '#f1f2f3';

const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `bioenergia-sp-${nome}.json`), 'utf8'));
const L = (pt, en) => (lingua() === 'en' ? en : pt);
const serie = (i) => () => L(`BIOENERGIA EM SP · ${i}/4`, `BIOENERGY IN SÃO PAULO · ${i}/4`);
/** Casas decimais de um limite de classe. */
const casas = (v) => (v < 1 ? 2 : v < 10 ? 1 : 0);
const cor = (paleta) => (k) => (k === null || k === undefined ? null : k === 0 ? ZERO : paleta[k - 1]);
const mw = (kw, c = 1) => nf(kw / 1000, c);

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

/** Legenda de pontos: [[cor, rótulo, raio, vazado?]]. */
function legendaPontos(itens, y, { passo = 30, tamanho = 18, x = 0 } = {}) {
  const s = [];
  itens.forEach(([c, rot, r, vazado], i) => {
    const yy = y + i * passo;
    s.push(`<circle cx="${x + 17}" cy="${yy - 6}" r="${r}" fill="${vazado ? PAPEL : c}" fill-opacity="${vazado ? 1 : 0.9}" stroke="${vazado ? c : PAPEL}" stroke-width="${vazado ? 2 : 1.2}"/>`);
    s.push(`<text x="${x + 50}" y="${yy}" font-family="${SERIF}" font-size="${tamanho}">${esc(rot)}</text>`);
  });
  return { svg: s.join('\n'), y: y + itens.length * passo };
}

/* ------------------------------------------------------------------ 1/4 biogás */
async function biogas() {
  const c = await ler('biogas');
  const CAT = {
    agropecuaria: [MIN.verde_mata, 'Agropecuária', 'Farming'],
    industria: [MIN.ameixa, 'Indústria', 'Industry'],
    rsu_esgoto: [MIN.azul_profundo, 'Aterro ou esgoto', 'Landfill or sewage'],
  };
  const R = { pequeno: 6, medio: 9, grande: 13 };
  const raioUte = (kw) => 4 + 0.09 * Math.sqrt(kw);
  const maior = c.ute[0];
  const operando = c.por_situacao['Em operação'];
  return () => ({
    layout: 'um',
    motivo: 'cana',
    serie: serie(1),
    titulo: () => L('Usinas de biogás', 'Biogas plants'),
    subtitulo: () => L('Onde o lixo e o esterco viram luz', 'Where rubbish and manure become light'),
    descricao: () => L(
      `${c.usinas} usinas mapeadas pelo MapBiomas (início de operação até ${c.inicio_mais_recente.slice(0, 4)}) e ${c.ute.length} termelétricas a biogás registradas na ANEEL`,
      `${c.usinas} plants mapped by MapBiomas (operations starting up to ${c.inicio_mais_recente.slice(0, 4)}) and ${c.ute.length} biogas power stations registered with ANEEL`),
    mapa: () => ({
      preencher: () => NEUTRO,
      pontos: [
        ...c.pontos.map((p) => ({ coord: p.coord, r: R[p.porte], cor: CAT[p.categoria][0], vazado: !p.operacao, opacidade: 0.88 })),
        ...c.ute.map((u) => ({ coord: u.coord, r: raioUte(u.potencia_kw), cor: MIN.argila, anel: true, largura: 2.2 })),
      ],
      chamadas: [{
        coord: maior.coord, dx: 150, dy: 230,
        titulo: `${maior.nome.toUpperCase()} · ${mw(maior.potencia_kw)} MW`,
        linhas: L(['a maior termelétrica a biogás do estado,', 'movida pelo gás de um aterro sanitário'],
          ['the state’s largest biogas power station,', 'running on gas from a landfill']),
      }],
    }),
    numeros: () => [
      [String(c.usinas), [L('usinas de biogás', 'biogas plants'), L('mapeadas', 'mapped')]],
      [String(operando), [L('em operação', 'in operation')]],
      [String(c.ute.length), [L('termelétricas a biogás', 'biogas power stations'), L('registradas na ANEEL', 'registered with ANEEL')]],
      [`${mw(c.ute_total_kw)} MW`, [L('de potência outorgada', 'of licensed capacity')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('USINAS POR ORIGEM DO RESÍDUO', 'PLANTS BY WASTE SOURCE'), y)];
      const itens = Object.entries(CAT).map(([k, [cc, pt, en]]) => [cc, `${L(pt, en)} (${c.por_categoria[k]})`, 9]);
      itens.push([CINZA, L('fora de operação (vazado)', 'not in operation (hollow)'), 7, true]);
      let l = legendaPontos(itens, y + 36);
      s.push(l.svg);
      y = l.y + 10;
      s.push(rotuloPainel(L('PORTE', 'SCALE'), y));
      const portes = [['pequeno', 'pequeno', 'small'], ['medio', 'médio', 'medium'], ['grande', 'grande', 'large']];
      portes.forEach(([k, pt, en], i) => {
        const x = i * 150;
        s.push(`<circle cx="${x + 14}" cy="${y + 30}" r="${R[k]}" fill="${CINZA}" fill-opacity=".55" stroke="${PAPEL}"/>`);
        s.push(`<text x="${x + 34}" y="${y + 36}" font-family="${SERIF}" font-size="17">${L(pt, en)} (${c.por_porte[k]})</text>`);
      });
      y += 70;
      s.push(rotuloPainel(L('TERMELÉTRICAS A BIOGÁS (ANEEL)', 'BIOGAS POWER STATIONS (ANEEL)'), y));
      const lc = legendaCirculos([25000, 5000, 1000], raioUte, (v) => `${nf(v / 1000)} MW`, { y: y + 18, cor: MIN.argila });
      s.push(`<g>${lc.svg}</g>`);
      const top = lista(c.ute.slice(0, 4).map((u) => [u.nome, `${mw(u.potencia_kw)} MW`]), y + 42, { x: 130, larg: LP - 130, tamanho: 16, passo: 23 });
      s.push(top.svg);
      return { svg: s.join('\n'), y: Math.max(y + 18 + lc.altura, top.y) + 6 };
    },
    fontes: () => [
      L('MapBiomas, infraestrutura: usinas de biogás', 'MapBiomas, infrastructure: biogas plants'),
      L('ANEEL, SIGA (via MapBiomas), 2022', 'ANEEL, SIGA (via MapBiomas), 2022'),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ 2/4 rebanhos */
async function rebanhos() {
  const c = await ler('rebanhos');
  const herds = ['bovino', 'suino', 'galinaceos'];
  const titulos = { bovino: ['BOVINOS', 'CATTLE'], suino: ['SUÍNOS', 'PIGS'], galinaceos: ['GALINÁCEOS', 'POULTRY'] };
  const nSem = c.sem_informacao.length;
  const aves = c.rebanhos.galinaceos;
  const bastos = aves.maiores[0];
  const pctBastos = (bastos.valor / aves.total) * 100;
  return () => ({
    layout: 'quatro',
    motivo: 'cana',
    serie: serie(2),
    titulo: () => L('Rebanhos', 'Livestock'),
    subtitulo: () => L('Três rebanhos, três geografias', 'Three herds, three geographies'),
    descricao: () => L(`Bovinos, suínos e galináceos por município, ${c.ano}`, `Cattle, pigs and poultry by municipality, ${c.ano}`),
    mapas: () =>
      herds.map((h) => {
        const r = c.rebanhos[h];
        const aves_ = h === 'galinaceos';
        return {
          titulo: `${L(...titulos[h])} · ${L('CABEÇAS/KM²', 'HEAD/KM²')}`,
          preencher: (cd) => cor(PLASMA)(c.valores[cd]?.[h] ?? null),
          legenda: legendaFaixa(PLASMA.slice(0, r.quebras.length), r.quebras.map((v) => nf(v, casas(v))), { larg: 58, id: `lf${h}` }),
          destaques: r.maiores.slice(aves_ ? 1 : 0, 3).map((m) => ({ cd: m.cd, texto: m.nome })),
          chamadas: aves_ ? [{
            cd: bastos.cd, dx: 14, dy: 175, tamanho: 15,
            titulo: `${bastos.nome.toUpperCase()} · ${nf(bastos.valor / 1e6, 1)} ${L('MI DE AVES', 'M BIRDS')}`,
            linhas: [L(`${nf(pctBastos, 1)} % dos galináceos do estado`, `${nf(pctBastos, 1)}% of the state’s poultry`)],
          }] : [],
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
  const acima = new Set(c.acima_de_50pct_cds);
  const topo = c.maior_parte[0];
  return () => ({
    layout: 'um',
    motivo: 'cana',
    serie: serie(3),
    titulo: () => L('Cana-de-açúcar', 'Sugarcane'),
    subtitulo: () => L('Um mar verde sobre um quinto do estado', 'A green sea over a fifth of the state'),
    descricao: () => L(`Área colhida como parte do território de cada município, ${c.ano}`, `Harvested area as a share of each municipality’s territory, ${c.ano}`),
    mapa: () => ({
      preencher: (cd) => cor(VIRIDIS)(c.valores[cd] ?? null),
      hachura: { cds: acima, cor: '#ffffff', passo: 6, largura: 1, angulo: -60 },
      destaques: c.maiores_producao.slice(0, 5).map((m) => ({ cd: m.cd, texto: m.nome })),
      tamanhoDestaque: 15,
      chamadas: [{
        cd: topo.cd, dx: -30, dy: 250,
        titulo: `${topo.nome.toUpperCase()} · ${nf(topo.valor, 1)} %`,
        linhas: L(['do território colhido em cana:', 'o município mais canavieiro do estado'],
          ['of its territory harvested as cane:', 'the most cane-covered municipality in the state']),
      }],
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
      y += 16 + leg.altura + 6;
      s.push(`<defs><pattern id="leghx" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-60)"><rect width="6" height="6" fill="${VIRIDIS[5]}"/><path d="M0 0V6" stroke="#fff" stroke-width="1"/></pattern></defs>`);
      s.push(`<rect x="0" y="${y}" width="34" height="21" fill="url(#leghx)" stroke="#1a211a" stroke-width=".8"/>`);
      s.push(`<text x="50" y="${y + 16}" font-family="${SERIF}" font-size="18">${L('listras: mais da metade do território', 'stripes: over half the territory')}</text>`);
      y += 64;
      s.push(rotuloPainel(L('MAIORES PRODUTORES (T)', 'LARGEST PRODUCERS (T)'), y));
      const l = lista(c.maiores_producao.slice(0, 5).map((m) => [m.nome, nf(m.valor)]), y + 32, { passo: 26 });
      s.push(l.svg);
      return { svg: s.join('\n'), y: l.y };
    },
    fontes: () => [L(`IBGE, PAM ${c.ano} (tabela 1612)`, `IBGE, PAM ${c.ano} (table 1612)`), L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025')],
  });
}

/* ------------------------------------------------------------------ 4/4 usinas a bagaço */
async function usinas() {
  const c = await ler('usinas');
  const raio = (kw) => 2.5 + 0.045 * Math.sqrt(kw);
  const maior = c.ute[0];
  const pctCana = (c.producao_em_municipios_com_ute / c.producao_t) * 100;
  const fx = (v) => nf(v / 1000, 0);
  const rot = (i) => (i ? `${fx(c.quebras[i - 1])} – ${fx(c.quebras[i])}` : L(`até ${fx(c.quebras[0])}`, `up to ${fx(c.quebras[0])}`));
  return () => ({
    layout: 'um',
    motivo: 'cana',
    serie: serie(4),
    titulo: () => L('Usinas e cana', 'Mills and cane'),
    subtitulo: () => L('A colheita que acende a rede', 'The harvest that lights the grid'),
    descricao: () => L(
      `Termelétricas a bagaço de cana registradas na ANEEL sobre a produção de cana por município (PAM ${c.ano_pam})`,
      `Sugarcane-bagasse power stations registered with ANEEL over cane production by municipality (PAM ${c.ano_pam})`),
    mapa: () => ({
      preencher: (cd) => cor(CANA_CLARO)(c.valores[cd] ?? null),
      bordaMunicipio: 0.4,
      pontos: c.ute.map((u) => ({ coord: u.coord, r: raio(u.potencia_kw), cor: MIN.argila, vazado: u.fase !== 'Operação', opacidade: 0.78 })),
      chamadas: [{
        coord: maior.coord, dx: -20, dy: 270,
        titulo: `${maior.nome.toUpperCase()} · ${mw(maior.potencia_kw, 0)} MW`,
        linhas: L(['a maior termelétrica a bagaço', 'do estado'], ['the state’s largest', 'bagasse power station']),
      }],
    }),
    numeros: () => [
      [String(c.ute_n), [L('termelétricas a bagaço', 'bagasse power'), L(`(${c.ute_construcao_n} em construção)`, `stations (${c.ute_construcao_n} being built)`)]],
      [`${nf(c.ute_operacao_kw / 1e6, 2)} GW`, [L('em operação', 'in operation')]],
      [String(c.ute_municipios), [L('municípios com', 'municipalities with'), L('ao menos uma usina', 'at least one station')]],
      [`${nf(pctCana, 1)} %`, [L('da cana colhida em', 'of the cane harvested in'), L('municípios com usina', 'municipalities with a station')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('TERMELÉTRICAS A BAGAÇO (ANEEL)', 'BAGASSE POWER STATIONS (ANEEL)'), y)];
      const lc = legendaCirculos([100000, 50000, 10000], raio, (v) => `${nf(v / 1000)} MW`, { y: y + 20, cor: MIN.argila });
      s.push(lc.svg);
      s.push(`<circle cx="${LP - 210}" cy="${y + 34}" r="8" fill="${PAPEL}" stroke="${MIN.argila}" stroke-width="2"/>`);
      s.push(`<text x="${LP - 192}" y="${y + 40}" font-family="${SERIF}" font-size="17">${L('em construção', 'being built')}</text>`);
      y += 20 + lc.altura + 40;
      s.push(rotuloPainel(L('CANA PRODUZIDA (MIL T)', 'CANE PRODUCED (THOUSAND T)'), y));
      const itens = [[ZERO, L('zero', 'zero')], ...c.quebras.map((_, i) => [CANA_CLARO[i], rot(i)]), [null, L('sem informação', 'no data')]];
      const leg = legendaClasses(itens.slice(0, 5), { y: y + 16, passo: 27, tamanho: 16, id: 'legu1' });
      const leg2 = legendaClasses(itens.slice(5), { x: LP / 2 + 8, y: y + 16, passo: 27, tamanho: 16, id: 'legu2' });
      s.push(leg.svg, leg2.svg);
      y += 16 + leg.altura + 30;
      s.push(rotuloPainel(L('MAIORES (MW)', 'LARGEST (MW)'), y));
      const l = lista(c.ute.slice(0, 4).map((u) => [u.nome, mw(u.potencia_kw, 1)]), y + 30, { passo: 25, tamanho: 17 });
      s.push(l.svg);
      return { svg: s.join('\n'), y: l.y };
    },
    fontes: () => [
      L('ANEEL, SIGA (via MapBiomas), 2022', 'ANEEL, SIGA (via MapBiomas), 2022'),
      L(`IBGE, PAM ${c.ano_pam} (tabela 1612)`, `IBGE, PAM ${c.ano_pam} (table 1612)`),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { biogas, rebanhos, cana, usinas };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/bioenergia-sp/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
const e = SERIE.find((s) => s.tema === nome);
const fazer = await TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => fazer() });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `bioenergia-sp-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
