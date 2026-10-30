#!/usr/bin/env node
/**
 * Coleção «RMC» — desenha uma prancha a partir do cache de preparar.py (uso interno).
 *
 *   node scripts/colecoes/rmc/prancha.mjs uso|domicilios|renda|app
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  RAIZ, LP, SERIF, MONO, TINTA, CINZA, PAPEL, esc, nf, f1, lingua,
  gerarPrancha, rotuloPainel, usarRegiao, legendaClasses,
} from '../lib/prancha-sp.mjs';
import { lerRaster } from '../lib/raster.mjs';

export const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'rmc', 'serie.json'), 'utf8'));
const NEUTRO = '#f1f2f3';
const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `rmc-${nome}.json`), 'utf8'));
const L = (pt, en) => (lingua() === 'en' ? en : pt);
const serie = (i) => () => L(`REGIÃO METROPOLITANA DE CAMPINAS · ${i}/4`, `CAMPINAS METROPOLITAN REGION · ${i}/4`);
const pct = (v) => `${nf(v, v < 10 ? 1 : 0)} %`;

/** Fita dividida pelas partes (soma 100) com contorno. */
function fita(partes, y, altura = 22) {
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

/** Barras horizontais curtas com rótulo à esquerda: [[nome, valor, cor]]. */
function barras(itens, y, { max, passo = 19, x0 = 190, sufixo = ' %', casas = 0 } = {}) {
  const s = [];
  const larg = LP - x0 - 56;
  itens.forEach(([nome, v, cor], i) => {
    const yy = y + i * passo;
    s.push(`<text x="${x0 - 10}" y="${f1(yy + 11)}" text-anchor="end" font-family="${SERIF}" font-size="14">${esc(nome)}</text>`);
    s.push(`<rect x="${x0}" y="${f1(yy + 2)}" width="${f1(Math.max((v / max) * larg, 1))}" height="11" fill="${cor}"/>`);
    s.push(`<text x="${f1(x0 + (v / max) * larg + 6)}" y="${f1(yy + 11)}" font-family="${MONO}" font-size="12">${nf(v, casas)}${sufixo}</text>`);
  });
  return { svg: s.join('\n'), y: y + itens.length * passo };
}

/**
 * Legenda da figura: título e uma caixa por classe, na ordem dada, sem áreas nem partes: [[cor, rótulo, hachura?]].
 * `caixa` usa a caixa maior de caixaLegenda (a das legendas com barra); sem ela, a caixa das fitas.
 */
function colunaFigura(titulo, itens, { caixa = false } = {}) {
  const s = [rotuloPainel(titulo, 0)];
  let y = 24;
  for (const [cor, rot, hachura] of itens) {
    if (caixa) s.push(caixaLegenda(cor, rot, y, hachura));
    else s.push(`<rect x="0" y="${y - 13}" width="26" height="15" fill="${cor}" stroke="#1a211a" stroke-width=".6"/><text x="38" y="${y}" font-family="${SERIF}" font-size="16">${esc(rot)}</text>`);
    y += caixa ? 25 : 23;
  }
  return { svg: s.join('\n'), y };
}

/* ------------------------------------------------------------------ 1/4 uso e cobertura da terra */
async function uso() {
  await usarRegiao('rmc');
  const c = await ler('uso');
  const r = await lerRaster('grade-rmc-uso');
  const corDe = new Map(c.grupos.flatMap((g) => g.codigos.map((k) => [k, g.cor])));
  const g = Object.fromEntries(c.grupos.map((x) => [x.chave, x]));
  const urb = [...c.municipios].sort((a, b) => b.pct_urbano - a.pct_urbano);
  return () => ({
    layout: 'um',
    motivo: 'rmc',
    serie: serie(1),
    raster: { r, modo: 'classes', cor: (v) => corDe.get(v) ?? null, recorte: 'limite', fator: 2 },
    titulo: () => L('Uso e cobertura da terra', 'Land use and land cover'),
    subtitulo: () => L('Entre a cana e a cidade, ilhas de mata', 'Between cane and city, islands of forest'),
    descricao: () => L(
      `Os 20 municípios da RMC classificados em 2024 pelo MapBiomas, pixel de 30 m (Coleção 10)`,
      `The 20 municipalities of the Campinas region classified for 2024 by MapBiomas, 30 m pixels (Collection 10)`),
    mapa: () => ({
      preencher: () => NEUTRO,
      bordaMunicipio: 0,
      semRgint: true,
      bordaEstado: 2.4,
      bordaSobreRaster: PAPEL,
      larguraSobreRaster: 1.1,
      tamanhoUnidade: 14,
      semRotulo: ['Campinas'],
      chamadas: [{
        coord: c.fragmento.coord, dx: 44, dy: 230, tamanho: 16,
        titulo: L(`${nf(c.fragmento.km2, 1)} KM² DE MATA`, `${nf(c.fragmento.km2, 1)} KM² OF FOREST`),
        linhas: L(['o maior fragmento', 'florestal da RMC,', `em ${c.fragmento.municipio}`], ['the largest forest', 'patch in the RMC,', `in ${c.fragmento.municipio}`]),
      }],
    }),
    legendaFigura: () => {
      const g = colunaFigura(L('USO E COBERTURA DA TERRA, 2024', 'LAND USE AND LAND COVER, 2024'),
        [...c.grupos].sort((a, b) => b.pct - a.pct).map((x) => [x.cor, L(x.rotulo, x.rotulo_en)]));
      return { svg: g.svg, altura: g.y, largura: 400 };
    },
    numeros: () => [
      [`${nf(c.total_km2, 0)} km²`, [L('nos 20 municípios', 'across 20 municipalities')]],
      [pct(g.urbano.pct), [L('de área urbanizada', 'urban area')]],
      [pct(g.floresta.pct), [L('de formação florestal,', 'forest,'), L(`em ${nf(c.fragmento.n_fragmentos)} fragmentos`, `in ${nf(c.fragmento.n_fragmentos)} fragments`)]],
      [pct(g.mosaico.pct), [L('de mosaico de usos,', 'mosaic of uses,'), L('a maior classe', 'the largest class')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('A REGIÃO EM UMA FITA (ÁREA)', 'THE REGION IN ONE STRIP (AREA)'), y)];
      y += 18;
      s.push(fita(c.grupos.map((x) => [x.pct, x.cor]), y));
      y += 50;
      const ord = [...c.grupos].sort((a, b) => b.pct - a.pct);
      for (const x of ord) {
        s.push(`<rect x="0" y="${y - 13}" width="26" height="15" fill="${x.cor}" stroke="#1a211a" stroke-width=".6"/>`);
        s.push(`<text x="38" y="${y}" font-family="${SERIF}" font-size="16">${esc(L(x.rotulo, x.rotulo_en))}</text>`);
        s.push(`<text x="${LP - 80}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="13" fill="${CINZA}">${nf(x.km2, 0)}</text>`);
        s.push(`<text x="${LP}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="13">${pct(x.pct)}</text>`);
        y += 23;
      }
      s.push(`<text x="${LP - 80}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${CINZA}">km²</text>`);
      s.push(`<text x="${LP}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${CINZA}">${L('da RMC', 'of the region')}</text>`);
      y += 34;
      s.push(rotuloPainel(L('ÁREA URBANIZADA, % DO MUNICÍPIO', 'URBAN AREA, % OF MUNICIPALITY'), y));
      const b = barras([...urb.slice(0, 4), ...urb.slice(-2)].map((m) => [m.NM_MUN, m.pct_urbano, g.urbano.cor]), y + 14, { max: urb[0].pct_urbano });
      s.push(b.svg);
      s.push(`<path d="M190 ${f1(y + 14 + 4 * 19 + 2)}h${LP - 190}" stroke="${CINZA}" stroke-width=".6" stroke-dasharray="2 3"/>`);
      return { svg: s.join('\n'), y: b.y + 6 };
    },
    fontes: () => [
      L('MapBiomas, Coleção 10 (2024)', 'MapBiomas, Collection 10 (2024)'),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ setores do Censo 2022 */
const ZERO = '#eef0f1';
const SEM = '#ffffff';
const baseRmc = async () => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', 'rmc-base.json'), 'utf8'));

/** Classe de v nos limites (fechados à direita): 0..lim.length. */
const classe = (v, lim) => { let i = 0; while (i < lim.length && v > lim[i]) i++; return i; };

/** Legenda vertical com uma barra da parte de cada classe: [[cor, rótulo, valor, total]]. */
function legendaBarras(itens, y, { titulo, rotuloValor }) {
  const s = [rotuloPainel(titulo, y)];
  y += 24;
  const max = Math.max(...itens.map((i) => i[2]));
  const x0 = 250;
  for (const [cor, rot, v, tot] of itens) {
    s.push(`<rect x="0" y="${y - 14}" width="30" height="17" fill="${cor}" stroke="#1a211a" stroke-width=".6"/>`);
    s.push(`<text x="42" y="${y}" font-family="${SERIF}" font-size="16">${esc(rot)}</text>`);
    const w = (v / max) * (LP - x0 - 64);
    s.push(`<rect x="${x0}" y="${y - 10}" width="${f1(Math.max(w, 1))}" height="10" fill="${cor}"/>`);
    s.push(`<text x="${f1(x0 + w + 6)}" y="${y}" font-family="${MONO}" font-size="12">${pct((v / tot) * 100)}</text>`);
    y += 25;
  }
  s.push(`<text x="${x0}" y="${y - 2}" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(rotuloValor)}</text>`);
  return { svg: s.join('\n'), y: y + 12 };
}

/** Caixa de legenda avulsa (zero, sem informação). */
const caixaLegenda = (cor, rot, y, hachura = false) =>
  `${hachura ? `<defs><pattern id="semR" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="${PAPEL}"/><path d="M0 0V7" stroke="#aeb4ba" stroke-width="1.1"/></pattern></defs>` : ''}<rect x="0" y="${y - 14}" width="30" height="17" fill="${hachura ? 'url(#semR)' : cor}" stroke="#1a211a" stroke-width=".6"/><text x="42" y="${y}" font-family="${SERIF}" font-size="16">${esc(rot)}</text>`;

const linhasMunicipais = (b) => [
  { feats: b.unidades.features, cor: PAPEL, largura: 1.8, opacidade: 0.9 },
  { feats: b.unidades.features, cor: TINTA, largura: 0.6, opacidade: 0.6 },
];

async function domicilios() {
  await usarRegiao('rmc');
  const c = await ler('domicilios');
  const b = await baseRmc();
  // A classe rural (até 100) fica num creme claro: a rampa começa onde a cidade começa.
  const cores = ['#f3edc8', ...c.cores.slice(1)];
  const cor = (d) => (d === null ? SEM : d === 0 ? ZERO : cores[classe(d, c.limites)]);
  const mun = [...c.por_municipio].sort((a, z) => z.dom_km2 - a.dom_km2);
  const denso = mun[0];
  // Rótulos por língua: os números mudam de formato (1.000 / 1,000).
  const rotulos = () => { const lim = c.limites.map((v) => nf(v)); return [L(`até ${lim[0]}`, `up to ${lim[0]}`),
    ...c.limites.slice(1).map((v, i) => `${lim[i]} – ${lim[i + 1]}`), L(`mais de ${lim[lim.length - 1]}`, `over ${lim[lim.length - 1]}`)]; };
  const pctMetade = (c.metade_km2 / c.area_km2) * 100;
  return () => ({
    layout: 'um',
    motivo: 'rmc',
    serie: serie(2),
    titulo: () => L('Domicílios por km²', 'Households per km²'),
    subtitulo: () => L(`Metade dos lares em ${nf(pctMetade, 1)} % do chão`, `Half the homes on ${nf(pctMetade, 1)} % of the ground`),
    descricao: () => L(
      `Domicílios particulares ocupados por km² nos ${nf(c.n_setores)} setores censitários da RMC, Censo 2022`,
      `Occupied private households per km² in the ${nf(c.n_setores)} census tracts of the Campinas region, 2022 Census`),
    mapa: () => ({
      preencher: () => NEUTRO,
      bordaMunicipio: 0,
      semRgint: true,
      bordaEstado: 2.4,
      camadas: [{ feats: c.setores.features, cor: (f) => cor(f.properties.d) }],
      linhas: linhasMunicipais(b),
      tamanhoUnidade: 14,
      semRotulo: ['Campinas'],
      chamadas: [{
        cd: denso.CD_MUN, dx: -330, dy: 330,
        titulo: L(`${nf(denso.dom_km2, 0)} DOMICÍLIOS POR KM²`, `${nf(denso.dom_km2, 0)} HOUSEHOLDS PER KM²`),
        linhas: L([`${denso.NM_MUN}, o município`, 'mais denso da região'], [`${denso.NM_MUN}, the densest`, 'municipality in the region']),
      }],
    }),
    legendaFigura: () => {
      const g = colunaFigura(L('DOMICÍLIOS POR KM²', 'HOUSEHOLDS PER KM²'),
        [...cores.map((k, i) => [k, rotulos()[i]]), [ZERO, L('setor sem domicílio ocupado', 'tract with no occupied household')]], { caixa: true });
      return { svg: g.svg, altura: g.y, largura: 380 };
    },
    numeros: () => [
      [nf(c.domicilios),[L('domicílios ocupados', 'occupied households')]],
      [nf(c.pessoas), [L('pessoas', 'people')]],
      [`${nf(c.metade_km2, 0)} km²`, [L('abrigam metade', 'hold half'), L('dos domicílios', 'of the households')]],
      [nf(c.n_setores), [L('setores censitários,', 'census tracts,'), L(`${nf(c.sem_domicilio)} sem domicílio ocupado`, `${nf(c.sem_domicilio)} with none occupied`)]],
    ],
    painel: (y) => {
      const itens = cores.map((k, i) => [k, rotulos()[i], c.dom_por_classe[i], c.domicilios]);
      const lg = legendaBarras(itens, y, { titulo: L('DOMICÍLIOS POR KM²', 'HOUSEHOLDS PER KM²'), rotuloValor: L('parte dos domicílios da RMC', 'share of the region’s households') });
      let yy = lg.y + 4;
      const s = [lg.svg, caixaLegenda(ZERO, L('setor sem domicílio ocupado', 'tract with no occupied household'), yy)];
      yy += 44;
      s.push(rotuloPainel(L('NO MUNICÍPIO INTEIRO', 'WHOLE MUNICIPALITY'), yy));
      const bb = barras([...mun.slice(0, 4), ...mun.slice(-2)].map((m) => [m.NM_MUN, m.dom_km2, c.cores[3]]), yy + 14, { max: mun[0].dom_km2, sufixo: '' });
      s.push(bb.svg);
      s.push(`<path d="M190 ${f1(yy + 14 + 4 * 19 + 2)}h${LP - 190}" stroke="${CINZA}" stroke-width=".6" stroke-dasharray="2 3"/>`);
      return { svg: s.join('\n'), y: bb.y + 6 };
    },
    fontes: () => [
      L('IBGE, Censo 2022: agregados por setor', 'IBGE, 2022 Census: tract aggregates'),
      L('IBGE, Malha de Setores 2022 e Municipal 2025', 'IBGE, 2022 Tract and 2025 Municipal Meshes'),
    ],
  });
}

async function renda() {
  await usarRegiao('rmc');
  const c = await ler('renda');
  const b = await baseRmc();
  const cor = (m) => (m === null ? 'url(#semRm)' : c.cores[classe(m, c.limites)]);
  const sm = (k) => nf(k, k % 1 ? 1 : 0);
  const rotulos = () => [L(`até 1 SM (R$ ${nf(c.sm)})`, `up to 1 MW (R$ ${nf(c.sm)})`),
    ...[[1, 1.5], [1.5, 2], [2, 3], [3, 5]].map(([a, z]) => L(`${sm(a)} a ${sm(z)} SM`, `${sm(a)} to ${sm(z)} MW`)), L('mais de 5 SM', 'over 5 MW')];
  const ate2 = c.resp_por_classe.slice(0, 3).reduce((a, v) => a + v, 0);
  const acima5 = c.resp_por_classe[5];
  return () => ({
    layout: 'um',
    motivo: 'rmc',
    serie: serie(3),
    titulo: () => L('Renda do responsável', 'Household head income'),
    subtitulo: () => L('A renda desenha outra fronteira', 'Income draws another border'),
    descricao: () => L(
      'Rendimento nominal mediano mensal das pessoas responsáveis pelo domicílio, por setor censitário, Censo 2022 (SM = salário mínimo de 2022)',
      'Median monthly nominal income of household heads, by census tract, 2022 Census (MW = 2022 minimum wage)'),
    sobreMapa: () => '<defs><pattern id="semRm" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="#ffffff"/><path d="M0 0V6" stroke="#aeb4ba" stroke-width="1"/></pattern></defs>',
    mapa: () => ({
      preencher: () => NEUTRO,
      bordaMunicipio: 0,
      semRgint: true,
      bordaEstado: 2.4,
      camadas: [{ feats: c.setores.features, cor: (f) => cor(f.properties.m) }],
      linhas: linhasMunicipais(b),
      tamanhoUnidade: 14,
      semRotulo: ['Campinas'],
      chamadas: [{
        coord: c.mais_alto.coord, dx: 380, dy: 120,
        titulo: L(`R$ ${nf(c.mais_alto.mediana)} · A MAIOR MEDIANA`, `R$ ${nf(c.mais_alto.mediana)} · THE HIGHEST MEDIAN`),
        linhas: L([`um setor de ${c.mais_alto.municipio}:`, `${nf(c.mais_alto.mediana / c.sm, 0)} salários mínimos`], [`a tract in ${c.mais_alto.municipio}:`, `${nf(c.mais_alto.mediana / c.sm, 0)} minimum wages`]),
      }],
    }),
    legendaFigura: () => {
      const g = colunaFigura(L('RENDIMENTO MEDIANO DO RESPONSÁVEL', 'MEDIAN INCOME OF HOUSEHOLD HEAD'),
        [...c.cores.map((k, i) => [k, rotulos()[i]]), [SEM, L('sem informação', 'no data'), true]], { caixa: true });
      return { svg: g.svg, altura: g.y, largura: 380 };
    },
    numeros: () => [
      [`${nf((ate2 / c.responsaveis) * 100, 0)} %`, [L('dos responsáveis vivem em', 'of household heads live in'), L('setores com mediana até 2 SM', 'tracts with a median ≤ 2 MW')]],
      [`${nf((acima5 / c.responsaveis) * 100, 1)} %`, [L('em setores com mediana', 'in tracts with a median'), L('acima de 5 SM', 'above 5 MW')]],
      [`R$ ${nf(c.sm)}`, [L('salário mínimo de 2022,', '2022 minimum wage,'), L('a régua da legenda', 'the legend’s yardstick')]],
      [nf(c.sem_renda), [L(`dos ${nf(c.n_setores)} setores`, `of the ${nf(c.n_setores)} tracts`), L('sem informação de renda', 'with no income data')]],
    ],
    painel: (y) => {
      const itens = c.cores.map((k, i) => [k, rotulos()[i], c.resp_por_classe[i], c.responsaveis]);
      const lg = legendaBarras(itens, y, { titulo: L('RENDIMENTO MEDIANO DO RESPONSÁVEL', 'MEDIAN INCOME OF HOUSEHOLD HEAD'), rotuloValor: L('parte dos responsáveis da RMC', 'share of the region’s household heads') });
      const yy = lg.y + 4;
      return { svg: [lg.svg, caixaLegenda(SEM, L('sem informação', 'no data'), yy, true)].join('\n'), y: yy + 16 };
    },
    fontes: () => [
      L('IBGE, Censo 2022: rendimento do responsável', 'IBGE, 2022 Census: household head income'),
      L('IBGE, Malha de Setores 2022 e Municipal 2025', 'IBGE, 2022 Tract and 2025 Municipal Meshes'),
    ],
  });
}

/* ------------------------------------------------------------------ 4/4 APPs de Campinas (FBDS) */
async function app() {
  await usarRegiao('campinas');
  const c = await ler('app');
    const flo = c.classes.find((x) => x.classe === 'formação florestal');
  const nc = c.nascentes_por_classe;
  const AGUA = '#234e70';
  const LAGO = '#5f8fae';
  return () => ({
    layout: 'um',
    motivo: 'rmc',
    serie: serie(4),
    titulo: () => L('APPs de Campinas', 'Riparian reserves of Campinas'),
    subtitulo: () => L('Onde a água nasce, a mata falta', 'Where water rises, the forest is missing'),
    descricao: () => L(
      'Áreas de preservação permanente ao longo dos rios, nascentes e represas de Campinas e o uso do solo dentro delas, segundo o mapeamento da FBDS',
      'Permanent preservation areas along the rivers, springs and reservoirs of Campinas and the land use inside them, from the FBDS mapping'),
    mapa: () => ({
      preencher: () => PAPEL,
      bordaMunicipio: 0,
      semRgint: true,
      bordaEstado: 2.4,
      // A faixa de 30 m mede pouco mais de 2 px nesta escala: cada classe ganha um contorno da própria cor,
      // da maior para a menor, para que a cor se leia (a largura desenhada é exagerada).
      camadas: [
        ...[...c.classes].sort((a, b) => b.km2 - a.km2).map((x) => ({
          feats: c.uso.features.filter((f) => f.properties.CLASSE_USO === x.classe), cor: x.cor, borda: x.cor, largura: 2.4,
        })),
        { feats: c.agua.features, cor: LAGO, borda: LAGO, largura: 0.6 },
      ],
      linhas: [{ feats: c.rios.features, cor: AGUA, largura: 0.35, opacidade: 0.7 }],
      pontos: c.nascentes_pts.map((p) => ({ coord: p, r: 1.7, cor: AGUA, borda: PAPEL, bordaLargura: 0.4, opacidade: 1 })),
      chamadas: [{
        coord: c.nascente_edificada, dx: 170, dy: 230,
        titulo: L(`${nf(nc['área edificada'])} NASCENTES SOB A CIDADE`, `${nf(nc['área edificada'])} SPRINGS UNDER THE CITY`),
        linhas: L(['a APP virou rua e telhado', 'na mancha urbana'], ['the reserve turned into', 'streets and roofs']),
      }],
    }),
    legendaFigura: () => {
      const g = colunaFigura(L('USO DO SOLO DENTRO DA APP', 'LAND USE INSIDE THE RESERVES'),
        [...c.classes].sort((a, b) => b.pct - a.pct).map((x) => [x.cor, L(x.rotulo, x.rotulo_en)]));
      let y = g.y + 6;
      const s = [g.svg];
      s.push(`<path d="M2 ${y - 5}h24" stroke="${AGUA}" stroke-width="1.6"/><text x="38" y="${y}" font-family="${SERIF}" font-size="16">${L('Curso d’água', 'Stream')}</text>`);
      y += 23;
      s.push(`<rect x="0" y="${y - 13}" width="26" height="15" fill="${LAGO}"/><text x="38" y="${y}" font-family="${SERIF}" font-size="16">${L('Rio largo, lago, represa', 'Wide river, lake, reservoir')}</text>`);
      y += 23;
      s.push(`<circle cx="13" cy="${y - 5}" r="4" fill="${AGUA}" stroke="${PAPEL}" stroke-width=".8"/><text x="38" y="${y}" font-family="${SERIF}" font-size="16">${L('Nascente', 'Spring')}</text>`);
      // A sudoeste a ponta do município encosta na legenda; o sudeste é só entorno. A largura cobre também a
      // escala, que nesta escala tem 10 km (~390 px) e começa no mesmo x da legenda.
      return { svg: s.join('\n'), altura: y + 8, largura: 440, canto: 'se' };
    },
    numeros: () => [
      [`${nf(c.app_km2, 0)} km²`, [L('de APP,', 'of reserves,'), L(`${pct((c.app_km2 / c.municipio_km2) * 100)} do município`, `${pct((c.app_km2 / c.municipio_km2) * 100)} of the municipality`)]],
      [pct(flo.pct), [L('da APP coberta', 'of the reserves'), L('por formação florestal', 'covered by forest')]],
      [nf(c.nascentes), [L('nascentes,', 'springs,'), L(`${nf(c.nascentes_floresta)} delas em mata`, `${nf(c.nascentes_floresta)} of them in forest`)]],
      [`${nf(c.rios_km, 0)} km`, [L('de cursos d’água', 'of streams'), L('de margem simples', 'drawn as lines')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('USO DO SOLO DENTRO DA APP', 'LAND USE INSIDE THE RESERVES'), y)];
      y += 18;
      s.push(fita(c.classes.map((x) => [x.pct, x.cor]), y));
      y += 50;
      for (const x of [...c.classes].sort((a, b) => b.pct - a.pct)) {
        s.push(`<rect x="0" y="${y - 13}" width="26" height="15" fill="${x.cor}" stroke="#1a211a" stroke-width=".6"/>`);
        s.push(`<text x="38" y="${y}" font-family="${SERIF}" font-size="16">${esc(L(x.rotulo, x.rotulo_en))}</text>`);
        s.push(`<text x="${LP - 80}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="13" fill="${CINZA}">${nf(x.km2, x.km2 < 10 ? 1 : 0)}</text>`);
        s.push(`<text x="${LP}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="13">${pct(x.pct)}</text>`);
        y += 23;
      }
      s.push(`<text x="${LP - 80}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${CINZA}">km²</text>`);
      s.push(`<text x="${LP}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${CINZA}">${L('da APP', 'of reserves')}</text>`);
      y += 22;
      s.push(`<path d="M2 ${y - 5}h24" stroke="${AGUA}" stroke-width="1.6"/><text x="38" y="${y}" font-family="${SERIF}" font-size="16">${L('Curso d’água', 'Stream')}</text>`);
      s.push(`<rect x="${LP / 2}" y="${y - 13}" width="26" height="15" fill="${LAGO}"/><text x="${LP / 2 + 38}" y="${y}" font-family="${SERIF}" font-size="16">${L('Rio largo, lago, represa', 'Wide river, lake, reservoir')}</text>`);
      y += 23;
      s.push(`<circle cx="13" cy="${y - 5}" r="4" fill="${AGUA}" stroke="${PAPEL}" stroke-width=".8"/><text x="38" y="${y}" font-family="${SERIF}" font-size="16">${L('Nascente', 'Spring')}</text>`);
      y += 38;
      s.push(rotuloPainel(L('ONDE ESTÃO AS NASCENTES', 'WHERE THE SPRINGS ARE'), y));
      const itens = c.classes.filter((x) => nc[x.classe] > 2).sort((a, b) => nc[b.classe] - nc[a.classe])
        .map((x) => [L(x.rotulo, x.rotulo_en), nc[x.classe], x.cor]);
      const b = barras(itens, y + 14, { max: itens[0][1], sufixo: '', x0: 200 });
      s.push(b.svg);
      return { svg: s.join('\n'), y: b.y + 6 };
    },
    fontes: () => [
      L('FBDS, Mapeamento de APPs e uso do solo', 'FBDS, mapping of reserves and land use'),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { uso, domicilios, renda, app };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/rmc/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
const e = SERIE.find((s) => s.tema === nome);
const fazer = await TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => fazer() });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `rmc-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
