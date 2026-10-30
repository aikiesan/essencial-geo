#!/usr/bin/env node
/**
 * Coleção «Água em SP» — desenha uma prancha a partir do cache de preparar.py (uso interno).
 *
 *   node scripts/colecoes/agua-sp/prancha.mjs bacias|drenagem|ucs
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  RAIZ, LP, SERIF, MONO, TINTA, CINZA, PAPEL, esc, nf, f1, halo, lingua, largura,
  gerarPrancha, legendaClasses, rotuloPainel,
} from '../lib/prancha-sp.mjs';

export const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'agua-sp', 'serie.json'), 'utf8'));
const VIRIDIS = ['#fde725', '#7ad151', '#22a884', '#2a788e', '#414487', '#440154'];
const MIN = { verde_mata: '#2f5d3a', oliva: '#7d8a3c', palha: '#d9c27a', ocre: '#c08a2e', azul_profundo: '#234e70' };
const AZUL = MIN.azul_profundo;
const NEUTRO = '#f1f2f3';

const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `agua-sp-${nome}.json`), 'utf8'));
const L = (pt, en) => (lingua() === 'en' ? en : pt);
const serie = (i) => () => L(`ÁGUA EM SP · ${i}/3`, `WATER IN SÃO PAULO · ${i}/3`);

/** Números das UGRHIs sobre o mapa: um selo branco com o código, como num índice. */
function selos(proj, pontos, { r = 13, tamanho = 13, cor = AZUL, opacos = new Set() } = {}) {
  return Object.entries(pontos).map(([cod, coord]) => {
    const [x, y] = proj(coord);
    const cheio = opacos.has(Number(cod));
    return `<g><circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${cheio ? cor : PAPEL}" fill-opacity="${cheio ? 1 : 0.92}" stroke="${cor}" stroke-width="1.4"/>
<text x="${f1(x)}" y="${f1(y + tamanho * 0.36)}" text-anchor="middle" font-family="${MONO}" font-size="${tamanho}" fill="${cheio ? PAPEL : cor}">${cod}</text></g>`;
  }).join('\n');
}

/** Índice das 22 bacias em duas colunas: «nº nome». */
function indice(tabela, y, { tamanho = 15, passo = 21, destaque = new Set() } = {}) {
  const s = [];
  const ord = [...tabela].sort((a, b) => a.codigo - b.codigo);
  const meio = Math.ceil(ord.length / 2);
  ord.forEach((u, i) => {
    const x = i < meio ? 0 : LP / 2 + 6;
    const yy = y + (i % meio) * passo;
    const d = destaque.has(u.codigo);
    s.push(`<text x="${x + 22}" y="${yy}" text-anchor="end" font-family="${MONO}" font-size="${tamanho - 2}" fill="${AZUL}">${u.codigo}</text>`);
    let nome = u.nome;
    while (largura(nome, tamanho) > LP / 2 - 40 && nome.length > 4) nome = `${nome.slice(0, -2)}…`;
    s.push(`<text x="${x + 32}" y="${yy}" font-family="${SERIF}" font-size="${tamanho}"${d ? ' font-style="italic"' : ''}>${esc(nome)}</text>`);
  });
  return { svg: s.join('\n'), y: y + meio * passo };
}

/* ------------------------------------------------------------------ 1/3 bacias */
async function bacias() {
  const c = await ler('bacias');
  const t = Object.fromEntries(c.tabela.map((u) => [u.codigo, u]));
  const at = t[6];
  const pctPop = (v) => nf(v, 1);
  const q = c.quebras;
  const rot = (i) => (i ? `${nf(q[i - 1])} – ${nf(q[i])}` : L(`até ${nf(q[0])}`, `up to ${nf(q[0])}`));
  const corClasse = (f) => VIRIDIS[f.properties.classe - 1];
  // O selo do Alto Tietê sai de cima do nome da capital: vai para Mogi das Cruzes, ainda na bacia.
  const pontos = { ...c.pontos, 6: [-46.19, -23.52] };
  return () => ({
    layout: 'um',
    motivo: 'agua',
    serie: serie(1),
    titulo: () => L('Bacias hidrográficas', 'River basins'),
    subtitulo: () => L('Vinte e duas casas para a mesma chuva', 'Twenty-two homes for the same rain'),
    descricao: () => L(
      'As 22 Unidades de Gerenciamento de Recursos Hídricos (UGRHIs) e a população que vive em cada uma, Censo 2022',
      'The 22 Water Resources Management Units (UGRHIs) and the people living in each one, 2022 Census'),
    mapa: () => ({
      preencher: () => NEUTRO,
      bordaMunicipio: 0.3,
      semRgint: true,
      camadas: [
        { feats: c.ugrhi.features, cor: corClasse, opacidade: 0.9, borda: PAPEL, largura: 2.6 },
        { feats: c.ugrhi.features, borda: '#1a211a', largura: 0.7 },
      ],
      chamadas: [{
        coord: pontos[6], dx: 50, dy: 240,
        titulo: L(`${pctPop(at.pct_populacao)} % DA POPULAÇÃO`, `${pctPop(at.pct_populacao)} % OF THE PEOPLE`),
        linhas: L([`em ${pctPop(at.pct_area)} % do território:`, 'a bacia do Alto Tietê, nº 6'],
          [`on ${pctPop(at.pct_area)} % of the land:`, 'the Alto Tietê basin, no. 6']),
      }],
    }),
    sobreMapa: (proj) => {
      const s = [];
      const linhas = c.hidrovia.features.map((f) => f.geometry);
      const d = linhas.map((g) => (g.type === 'LineString' ? [g.coordinates] : g.coordinates)
        .map((l) => `M${l.map((p) => proj(p).map(f1).join(' ')).join('L')}`).join('')).join('');
      s.push(`<path d="${d}" fill="none" stroke="${PAPEL}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-opacity=".9"/>`);
      s.push(`<path d="${d}" fill="none" stroke="${AZUL}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>`);
      for (const e of c.eclusas) {
        const [x, y] = proj(e.coord);
        s.push(`<rect x="${f1(x - 5)}" y="${f1(y - 5)}" width="10" height="10" fill="${PAPEL}" stroke="${AZUL}" stroke-width="2" transform="rotate(45 ${f1(x)} ${f1(y)})"/>`);
      }
      // Nome da hidrovia, junto da eclusa de Promissão.
      const prom = c.eclusas.find((e) => e.nome === 'Promissão') ?? c.eclusas[0];
      const [px, py] = proj(prom.coord);
      s.push(`<text x="${f1(px + 4)}" y="${f1(py - 22)}" font-family="${SERIF}" font-style="italic" font-size="19" fill="${AZUL}" ${halo(5)}>${L('hidrovia Tietê-Paraná', 'Tietê-Paraná waterway')}</text>`);
      s.push(selos(proj, pontos, { opacos: new Set([6]) }));
      return s.join('\n');
    },
    numeros: () => [
      ['22', [L('UGRHIs: unidades de', 'UGRHIs: water'), L('gestão da água', 'management units')]],
      [`${nf(c.populacao / 1e6, 1)} mi`, [L('habitantes', 'inhabitants'), L('(Censo 2022)', '(2022 Census)')]],
      [nf(at.densidade_hab_km2), [L('hab./km² no Alto Tietê', 'people/km² in Alto Tietê'), L(`(${nf(t[22].densidade_hab_km2, 1)} no Pontal)`, `(${nf(t[22].densidade_hab_km2, 1)} in Pontal)`)]],
      [String(c.eclusas.length), [L('eclusas na hidrovia', 'locks on the'), L('Tietê-Paraná', 'Tietê-Paraná waterway')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('HABITANTES POR KM²', 'PEOPLE PER KM²'), y)];
      const itens = q.map((_, i) => [VIRIDIS[i], rot(i)]);
      const a = legendaClasses(itens.slice(0, 3), { y: y + 16, passo: 27, tamanho: 16, id: 'lgb1' });
      const b = legendaClasses(itens.slice(3), { x: LP / 2 + 8, y: y + 16, passo: 27, tamanho: 16, id: 'lgb2' });
      s.push(a.svg, b.svg);
      y += 16 + a.altura + 14;
      s.push(`<path d="M2 ${y + 8}H34" stroke="${PAPEL}" stroke-width="7"/><path d="M2 ${y + 8}H34" stroke="${AZUL}" stroke-width="2.8"/>`);
      s.push(`<rect x="${LP / 2 + 13}" y="${y + 3}" width="10" height="10" fill="${PAPEL}" stroke="${AZUL}" stroke-width="2" transform="rotate(45 ${LP / 2 + 18} ${y + 8})"/>`);
      s.push(`<text x="50" y="${y + 14}" font-family="${SERIF}" font-size="16">${L('hidrovia', 'waterway')}</text>`);
      s.push(`<text x="${LP / 2 + 40}" y="${y + 14}" font-family="${SERIF}" font-size="16">${L('eclusa', 'lock')}</text>`);
      y += 56;
      s.push(rotuloPainel(L('ÍNDICE DAS BACIAS', 'INDEX OF BASINS'), y));
      const ix = indice(c.tabela, y + 30, { destaque: new Set([6]) });
      s.push(ix.svg);
      return { svg: s.join('\n'), y: ix.y };
    },
    // Figura: as classes, a hidrovia e o selo; o índice dos nomes fica só na prancha.
    legendaFigura: () => {
      const s = [rotuloPainel(L('HABITANTES POR KM²', 'PEOPLE PER KM²'), 0)];
      const itens = q.map((_, i) => [VIRIDIS[i], rot(i)]);
      const a = legendaClasses(itens.slice(0, 3), { y: 16, passo: 27, tamanho: 16, id: 'flgb1' });
      const b = legendaClasses(itens.slice(3), { x: LP / 2 + 8, y: 16, passo: 27, tamanho: 16, id: 'flgb2' });
      s.push(a.svg, b.svg);
      const y = 16 + a.altura + 14;
      s.push(`<path d="M2 ${y + 8}H34" stroke="${PAPEL}" stroke-width="7"/><path d="M2 ${y + 8}H34" stroke="${AZUL}" stroke-width="2.8"/>`);
      s.push(`<rect x="${LP / 2 + 13}" y="${y + 3}" width="10" height="10" fill="${PAPEL}" stroke="${AZUL}" stroke-width="2" transform="rotate(45 ${LP / 2 + 18} ${y + 8})"/>`);
      s.push(`<text x="50" y="${y + 14}" font-family="${SERIF}" font-size="16">${L('hidrovia', 'waterway')}</text>`);
      s.push(`<text x="${LP / 2 + 40}" y="${y + 14}" font-family="${SERIF}" font-size="16">${L('eclusa', 'lock')}</text>`);
      s.push(selos(([x, yy]) => [x, yy], { 6: [18, y + 40] }));
      s.push(`<text x="50" y="${y + 46}" font-family="${SERIF}" font-size="16">${L('número da UGRHI', 'UGRHI number')}</text>`);
      return { svg: s.join('\n'), altura: y + 54, largura: LP };
    },
    fontes: () => [
      L('SEADE, GeoSEADE: UGRHIs (CRH-SP)', 'SEADE, GeoSEADE: UGRHIs (CRH-SP)'),
      L('IBGE, Censo 2022; Malha Municipal 2025', 'IBGE, 2022 Census; Municipal Mesh 2025'),
      L('MapBiomas, infraestrutura: hidrovias e eclusas', 'MapBiomas, infrastructure: waterways and locks'),
    ],
  });
}

/* ------------------------------------------------------------------ 2/3 rede de drenagem */
async function drenagem() {
  const c = await ler('drenagem');
  const ATL = '#9c4a32';
  const corV = { p: AZUL, a: ATL };
  const esp = (q) => 0.3 + Math.log10(1 + q);
  const rios = [...c.rios.features].sort((a, b) => a.properties.q - b.properties.q);
  const kmP = c.km_vertente.prata;
  const kmA = c.km_vertente.atlantico;
  // Ponto do rótulo «Tietê»: o vértice do meio da parte mais longa do traçado.
  const partes = c.tiete.features.flatMap((f) => (f.geometry.type === 'LineString' ? [f.geometry.coordinates] : f.geometry.coordinates));
  const longa = partes.sort((a, b) => b.length - a.length)[0];
  const pRot = longa[Math.floor(longa.length * 0.42)];
  return () => ({
    layout: 'um',
    motivo: 'agua',
    serie: serie(2),
    titulo: () => L('Rede de drenagem', 'Drainage network'),
    subtitulo: () => L('Os rios que dão as costas ao mar', 'Rivers that turn their backs on the sea'),
    descricao: () => L(
      `${nf(c.km_total / 1000, 0)} mil km de rios em SP, com a espessura pela vazão média e a cor pela vertente: rumo ao Prata, pelo interior, ou direto para o Atlântico`,
      `${nf(c.km_total / 1000, 0)} thousand km of rivers in São Paulo, with width by mean discharge and colour by slope: inland towards the River Plate, or straight to the Atlantic`),
    mapa: () => ({
      preencher: () => PAPEL,
      bordaMunicipio: 0,
      semRgint: true,
      bordaEstado: 1.6,
      linhas: [
        { feats: c.fora.features, cor: '#b9c0c6', largura: (f) => 0.3 + 0.18 * f.properties.o, opacidade: 0.9 },
        { feats: rios, cor: (f) => corV[f.properties.v], largura: (f) => f1(esp(f.properties.q)), opacidade: 0.95 },
        { feats: c.tiete.features, cor: AZUL, largura: 2.6, halo: 3 },
      ],
      chamadas: [
        {
          coord: c.nascente_tiete, dx: 40, dy: 150,
          titulo: L(`A ${nf(c.nascente_mar_km, 1)} KM DO MAR`, `${nf(c.nascente_mar_km, 1)} KM FROM THE SEA`),
          linhas: L(['nasce o Tietê, que corre', `${nf(c.tiete_km)} km para o interior`], ['rises the Tietê, which runs', `${nf(c.tiete_km)} km inland`]),
        },
        {
          coord: c.maior_vazao.coord, dx: 150, dy: 150,
          titulo: L(`${nf(c.maior_vazao.q)} M³/S`, `${nf(c.maior_vazao.q)} M³/S`),
          linhas: L(['a maior vazão média,', 'no Paraná, na divisa'], ['the largest mean flow,', 'on the Paraná, at the border']),
        },
      ],
    }),
    sobreMapa: (proj) => {
      const [x, y] = proj(pRot);
      return `<text x="${f1(x)}" y="${f1(y - 14)}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="24" letter-spacing="2" fill="${AZUL}" ${halo(5)}>Tietê</text>`;
    },
    numeros: () => [
      [`${nf(c.km_total)} km`, [L('de rios no estado', 'of rivers in the state'), L(`em ${nf(c.n_trechos)} trechos`, `in ${nf(c.n_trechos)} reaches`)]],
      [`${nf(c.pct_prata, 1)} %`, [L('da área drena para', 'of the land drains'), L('o interior, rumo ao Prata', 'inland, to the Plate')]],
      [`${nf(c.tiete_km)} km`, [L('do Tietê, da cabeceira', 'of the Tietê, from source'), L('ao rio Paraná', 'to the Paraná')]],
      [nf(c.fozes_mar), [L('rios chegam ao mar', 'rivers reach the sea'), L('no litoral paulista', 'on the São Paulo coast')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('VERTENTE', 'SLOPE'), y)];
      y += 24;
      for (const [cor, rot, km] of [[AZUL, L('para o interior, bacia do Prata', 'inland, River Plate basin'), kmP], [ATL, L('direto para o Atlântico', 'straight to the Atlantic'), kmA]]) {
        s.push(`<path d="M0 ${y - 5}h34" stroke="${cor}" stroke-width="3.2" stroke-linecap="round"/>`);
        s.push(`<text x="46" y="${y}" font-family="${SERIF}" font-size="16">${esc(rot)}</text>`);
        s.push(`<text x="${LP}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="13">${nf(km)} km</text>`);
        y += 25;
      }
      y += 16;
      s.push(rotuloPainel(L('VAZÃO MÉDIA (M³/S)', 'MEAN DISCHARGE (M³/S)'), y));
      y += 26;
      [1, 10, 100, 1000, 5000].forEach((q, i) => {
        const x = i * (LP / 5);
        s.push(`<path d="M${x} ${y}h${LP / 5 - 26}" stroke="${AZUL}" stroke-width="${f1(esp(q))}" stroke-linecap="round"/>`);
        s.push(`<text x="${x}" y="${y + 24}" font-family="${MONO}" font-size="12">${nf(q)}</text>`);
      });
      y += 52;
      s.push(rotuloPainel(L('KM DE RIO POR ORDEM DE STRAHLER', 'KM OF RIVER BY STRAHLER ORDER'), y));
      y += 14;
      const ords = Object.entries(c.km_ordem).map(([o, km]) => [Number(o), km]);
      const max = Math.max(...ords.map((o) => o[1]));
      const x0 = 34;
      const larg = LP - x0 - 80;
      ords.forEach(([o, km], i) => {
        const yy = y + i * 19;
        s.push(`<text x="${x0 - 10}" y="${f1(yy + 11)}" text-anchor="end" font-family="${MONO}" font-size="12" fill="${AZUL}">${o}</text>`);
        s.push(`<rect x="${x0}" y="${f1(yy + 2)}" width="${f1(Math.max((km / max) * larg, 1))}" height="${f1(Math.min(11, 3 + o))}" fill="${AZUL}"/>`);
        s.push(`<text x="${f1(x0 + (km / max) * larg + 6)}" y="${f1(yy + 11)}" font-family="${MONO}" font-size="12">${nf(km)}</text>`);
      });
      y += ords.length * 19 + 6;
      s.push(`<text x="${x0}" y="${y + 8}" font-family="${MONO}" font-size="11" fill="${CINZA}">${L('1 = cabeceira; cada encontro de dois rios de mesma ordem sobe um', '1 = headwater; each meeting of two equal orders adds one')}</text>`);
      return { svg: s.join('\n'), y: y + 18 };
    },
    // Figura: vertente e vazão, sem os quilômetros nem as ordens de Strahler.
    legendaFigura: () => {
      // Os rios de fora do estado passam por baixo da legenda: um fundo da cor do vizinho a deixa legível
      // (data-fundo: a figura sem mapa de base, que não tem esses rios, o tira).
      const s = [`<rect data-fundo="1" x="-14" y="-30" width="${5 * 90 + 14}" height="${24 + 50 + 16 + 26 + 28 + 40}" fill="#f2f3f4" fill-opacity=".92"/>`, rotuloPainel(L('VERTENTE', 'SLOPE'), 0)];
      let y = 24;
      for (const [cor, rot] of [[AZUL, L('para o interior, bacia do Prata', 'inland, River Plate basin')], [ATL, L('direto para o Atlântico', 'straight to the Atlantic')]]) {
        s.push(`<path d="M0 ${y - 5}h34" stroke="${cor}" stroke-width="3.2" stroke-linecap="round"/>`);
        s.push(`<text x="46" y="${y}" font-family="${SERIF}" font-size="16">${esc(rot)}</text>`);
        y += 25;
      }
      y += 16;
      s.push(rotuloPainel(L('VAZÃO MÉDIA (M³/S)', 'MEAN DISCHARGE (M³/S)'), y));
      y += 26;
      const w = 90;
      [1, 10, 100, 1000, 5000].forEach((q, i) => {
        s.push(`<path d="M${i * w} ${y}h${w - 26}" stroke="${AZUL}" stroke-width="${f1(esp(q))}" stroke-linecap="round"/>`);
        s.push(`<text x="${i * w}" y="${y + 24}" font-family="${MONO}" font-size="12">${nf(q)}</text>`);
      });
      return { svg: s.join('\n'), altura: y + 28, largura: 5 * w };
    },
    fontes: () => [
      L('WWF/HydroSHEDS, HydroRIVERS v1.0', 'WWF/HydroSHEDS, HydroRIVERS v1.0'),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ 3/3 unidades de conservação */
async function ucs() {
  const c = await ler('ucs');
  const r = c.resumo;
  const t = Object.fromEntries(c.tabela.map((u) => [u.codigo, u]));
  const ln = t[3];
  const porGrupo = (g) => c.ucs.features.filter((f) => f.properties.grupo_mapa === g);
  const HACH = { cor: MIN.ocre, passo: 6, largura: 1.1, angulo: 45, fundo: '#f3ead0' };
  const barras = [...c.tabela].sort((a, b) => b.pct_protecao_integral - a.pct_protecao_integral);
  return () => ({
    layout: 'um',
    motivo: 'agua',
    serie: serie(3),
    titulo: () => L('Unidades de conservação', 'Protected areas'),
    subtitulo: () => L('Onde a floresta ainda guarda a nascente', 'Where the forest still keeps the spring'),
    descricao: () => L(
      `${r.n} unidades de conservação do CNUC (2024) sobre as 22 bacias: proteção integral, uso sustentável e APAs`,
      `${r.n} protected areas from the CNUC (2024) over the 22 basins: strict protection, sustainable use and APAs`),
    mapa: () => ({
      preencher: () => NEUTRO,
      bordaMunicipio: 0.4,
      semRgint: true,
      camadas: [
        { feats: porGrupo('apa'), hachura: HACH, borda: MIN.ocre, largura: 0.6 },
        { feats: porGrupo('us'), cor: MIN.oliva, opacidade: 0.92, borda: PAPEL, largura: 0.4 },
        { feats: porGrupo('pi'), cor: MIN.verde_mata, opacidade: 0.95, borda: PAPEL, largura: 0.4 },
        { feats: c.ugrhi.features, borda: PAPEL, largura: 3.2 },
        { feats: c.ugrhi.features, borda: AZUL, largura: 1.2 },
      ],
      chamadas: [{
        coord: c.pontos[3], dx: -150, dy: 250,
        titulo: L(`${nf(ln.pct_protecao_integral, 0)} % EM PROTEÇÃO INTEGRAL`, `${nf(ln.pct_protecao_integral, 0)} % STRICTLY PROTECTED`),
        linhas: L(['o Litoral Norte, nº 3,', 'é a bacia mais protegida do estado'], ['the Litoral Norte, no. 3,', 'is the state’s most protected basin']),
      }],
    }),
    sobreMapa: (proj) => selos(proj, c.pontos, { opacos: new Set([3]) }),
    numeros: () => [
      [String(r.n), [L('unidades de', 'protected areas'), L('conservação', 'in the state')]],
      [`${nf(r.pct_pi, 1)} %`, [L('do estado em', 'of the state under'), L('proteção integral', 'strict protection')]],
      [`${nf(r.pct_qualquer, 1)} %`, [L('em alguma unidade,', 'in some protected area,'), L('com as APAs', 'APAs included')]],
      [String(barras.filter((u) => u.pct_protecao_integral === 0).length), [L('bacias sem nenhuma', 'basins with no strict'), L('proteção integral', 'protection at all')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('GRUPO', 'GROUP'), y)];
      const caixa = (x, yy, fill, rot) => {
        s.push(`<rect x="${x}" y="${yy}" width="34" height="21" fill="${fill}" stroke="#1a211a" stroke-width=".8"/>`);
        s.push(`<text x="${x + 46}" y="${yy + 16}" font-family="${SERIF}" font-size="16">${esc(rot)}</text>`);
      };
      s.push(`<defs><pattern id="lgapa" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="${HACH.fundo}"/><path d="M0 0V6" stroke="${HACH.cor}" stroke-width="1.1"/></pattern></defs>`);
      caixa(0, y + 16, MIN.verde_mata, L(`proteção integral (${r.por_grupo['Proteção Integral']})`, `strict protection (${r.por_grupo['Proteção Integral']})`));
      caixa(0, y + 46, MIN.oliva, L(`uso sustentável, sem APA (${r.por_grupo['Uso Sustentável'] - r.apa_n})`, `sustainable use, not APA (${r.por_grupo['Uso Sustentável'] - r.apa_n})`));
      caixa(0, y + 76, 'url(#lgapa)', L(`Área de Proteção Ambiental (${r.apa_n})`, `Environmental Protection Area (${r.apa_n})`));
      y += 130;
      s.push(rotuloPainel(L('% DA BACIA EM PROTEÇÃO INTEGRAL', '% OF BASIN STRICTLY PROTECTED'), y));
      y += 18;
      const passo = 17.5;
      const x0 = 34;
      const larg = LP - x0 - 64;
      barras.forEach((u, i) => {
        const yy = y + i * passo;
        const w = (u.pct_protecao_integral / 100) * larg;
        s.push(`<text x="${x0 - 8}" y="${f1(yy + 11)}" text-anchor="end" font-family="${MONO}" font-size="12" fill="${AZUL}">${u.codigo}</text>`);
        s.push(`<path d="M${x0} ${f1(yy + 7)}H${x0 + larg}" stroke="#e3e6e9" stroke-width="1"/>`);
        if (w > 0) s.push(`<rect x="${x0}" y="${f1(yy + 2)}" width="${f1(Math.max(w, 1.5))}" height="10" fill="${MIN.verde_mata}"/>`);
        s.push(`<text x="${f1(x0 + Math.max(w, 0) + 6)}" y="${f1(yy + 11)}" font-family="${MONO}" font-size="12" fill="${TINTA}">${nf(u.pct_protecao_integral, u.pct_protecao_integral === 0 ? 0 : u.pct_protecao_integral < 0.1 ? 2 : u.pct_protecao_integral < 10 ? 1 : 0)}</text>`);
      });
      y += barras.length * passo + 4;
      s.push(`<text x="0" y="${y + 14}" font-family="${MONO}" font-size="12" fill="${CINZA}">${L('números das bacias: ver o mapa e a ficha', 'basin numbers: see the map and the notes')}</text>`);
      return { svg: s.join('\n'), y: y + 22 };
    },
    // Figura: os três grupos sem as contagens, o limite e o selo das bacias; sem as barras.
    legendaFigura: () => {
      const s = [rotuloPainel(L('GRUPO', 'GROUP'), 0)];
      const caixa = (yy, fill, rot) => {
        s.push(`<rect x="0" y="${yy}" width="34" height="21" fill="${fill}" stroke="#1a211a" stroke-width=".8"/>`);
        s.push(`<text x="46" y="${yy + 16}" font-family="${SERIF}" font-size="16">${esc(rot)}</text>`);
      };
      s.push(`<defs><pattern id="flgapa" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="${HACH.fundo}"/><path d="M0 0V6" stroke="${HACH.cor}" stroke-width="1.1"/></pattern></defs>`);
      caixa(16, MIN.verde_mata, L('proteção integral', 'strict protection'));
      caixa(46, MIN.oliva, L('uso sustentável, sem APA', 'sustainable use, not APA'));
      caixa(76, 'url(#flgapa)', L('Área de Proteção Ambiental', 'Environmental Protection Area'));
      s.push(`<path d="M0 118H34" stroke="${PAPEL}" stroke-width="3.2"/><path d="M0 118H34" stroke="${AZUL}" stroke-width="1.2"/>`);
      s.push(`<text x="46" y="123" font-family="${SERIF}" font-size="16">${L('limite de bacia (UGRHI)', 'basin (UGRHI) boundary')}</text>`);
      s.push(selos(([x, yy]) => [x, yy], { 3: [17, 150] }));
      s.push(`<text x="46" y="156" font-family="${SERIF}" font-size="16">${L('número da UGRHI', 'UGRHI number')}</text>`);
      return { svg: s.join('\n'), altura: 164, largura: 360 };
    },
    fontes: () => [
      L('MMA, CNUC 2024 (via SEADE, GeoSEADE)', 'MMA, CNUC 2024 (via SEADE, GeoSEADE)'),
      L('SEADE, GeoSEADE: UGRHIs (CRH-SP)', 'SEADE, GeoSEADE: UGRHIs (CRH-SP)'),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { bacias, drenagem, ucs };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/agua-sp/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
const e = SERIE.find((s) => s.tema === nome);
const fazer = await TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => fazer() });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `agua-sp-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
