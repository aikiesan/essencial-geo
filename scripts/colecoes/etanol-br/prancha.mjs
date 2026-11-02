#!/usr/bin/env node
/**
 * Coleção «A nova geografia do etanol» (Brasil) — desenha uma prancha a partir do cache de preparar.py (uso interno).
 *
 *   node scripts/colecoes/etanol-br/prancha.mjs endereco|milho|recuperacao
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { geoConicEqualArea, geoPath, geoContains } from 'd3-geo';
import {
  RAIZ, LP, SERIF, MONO, CINZA, PAPEL, TINTA, esc, nf, f1, lingua, largura, halo,
  gerarPrancha, rotuloPainel, usarBrasil,
} from '../lib/prancha-sp.mjs';
import { legendaCirculos } from '../lib/arte.mjs';

export const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'etanol-br', 'serie.json'), 'utf8'));
const TOTAL = 3; // pranchas da coleção
const BORDA_UF = '#c9ced3';

const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `etanol-br-${nome}.json`), 'utf8'));
const brasil = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', 'brasil-base.json'), 'utf8'));
const L = (pt, en) => (lingua() === 'en' ? en : pt);
const serie = (i) => () => L(`A NOVA GEOGRAFIA DO ETANOL · ${i}/${TOTAL}`, `THE NEW GEOGRAPHY OF ETHANOL · ${i}/${TOTAL}`);
const mil = (v, casas = 1) => nf(v / 1000, casas);
const sinal = (v, casas = 1) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${mil(Math.abs(v), casas)}`;
const pc = (v, casas = 0) => `${nf(v, casas)} %`;
// Raio dos círculos de capacidade (m³/d), o mesmo nas pranchas de um mapa.
const raio = (v) => 1.2 + 0.26 * Math.sqrt(v);
// Na linha do carimbo cabem uns 50 caracteres: o detalhe (capacidade, matéria-prima, meses) fica na ficha.
const ANP_CAP = () => L('ANP, Painel Dinâmico de Produtores de Etanol (2026)', 'ANP, Ethanol Producers Dynamic Panel (2026)');
const MALHA = () => L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025');
const caixa = (cor, rot, y, { passo = 25, x = 0, borda = BORDA_UF } = {}) => `<rect x="${x}" y="${y}" width="34" height="${passo - 8}" fill="${cor}" stroke="${borda}" stroke-width=".8"/>
<text x="${x + 48}" y="${y + passo - 12}" font-family="${SERIF}" font-size="16">${esc(rot)}</text>`;
const texto = (x, y, t, { tamanho = 12.5, cor = TINTA, anc = 'start', fonte = MONO, extra = '' } = {}) =>
  `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anc}" font-family="${fonte}" font-size="${tamanho}" fill="${cor}" ${extra}>${esc(t)}</text>`;

/* ------------------------------------------------------------------ 1 o etanol muda de endereço */
// Quadro da lupa na prancha (coordenadas do quadro do mapa): sobre Bolívia, Paraguai e Argentina, longe do Brasil.
const LUPA = { x: 84, y: 1150, w: 470, h: 450 };

async function endereco() {
  const c = await ler('endereco');
  const COR = Object.fromEntries(c.categorias.map((k) => [k.chave, k.cor]));
  const cat = Object.fromEntries(c.categorias.map((k) => [k.chave, k]));
  const pontos = [];
  for (const [k, lon, lat, c18, c26] of c.pontos) {
    if (c26 > 0) pontos.push({ coord: [lon, lat], r: raio(c26), cor: COR[k], opacidade: 0.88, bordaLargura: 0.7 });
    if (c18 > 0 && k !== 'igual') pontos.push({ coord: [lon, lat], r: raio(c18), cor: k === 'zerou' ? COR.zerou : TINTA, anel: true, largura: k === 'zerou' ? 1.8 : 1 });
  }
  const trilha = c.trilha.map((t) => t.coord);
  const ini = c.trilha[0];
  const fim = c.trilha.at(-1);
  const linhaTrilha = { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: trilha } };
  const maxMun = Math.max(...c.pontos.map((p) => p[4]));
  const top = c.maiores_ganhos[0];
  const mt = c.ufs.find((u) => u.uf === 'MT');
  const sp = c.ufs.find((u) => u.uf === 'SP');
  const cresc = (c.total_2026 / c.total_2018 - 1) * 100;
  const rumo = () => {
    const r = c.rumo;
    const nomes = L(['norte', 'nordeste', 'leste', 'sudeste', 'sul', 'sudoeste', 'oeste', 'noroeste'],
      ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west']);
    return nomes[Math.round(r / 45) % 8];
  };
  const mesTxt = (m) => (m.startsWith('12/') ? m.slice(3) : m);

  /** O trajeto desenhado numa projeção: linha com halo e um ponto por ano. */
  const desenharTrilha = (proj, { r = 2.6, lw = 2 } = {}) => {
    const xy = trilha.map((p) => proj(p));
    const d = xy.map(([x, y], i) => `${i ? 'L' : 'M'}${f1(x)} ${f1(y)}`).join('');
    return [`<path d="${d}" fill="none" stroke="${PAPEL}" stroke-width="${lw + 4}" stroke-linejoin="round" stroke-linecap="round" stroke-opacity=".9"/>`,
      `<path d="${d}" fill="none" stroke="${TINTA}" stroke-width="${lw}" stroke-linejoin="round" stroke-linecap="round"/>`,
      ...xy.map(([x, y], i) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${i === xy.length - 1 ? r * 1.5 : r}" fill="${i === xy.length - 1 ? TINTA : PAPEL}" stroke="${TINTA}" stroke-width="1.2"/>`)].join('\n');
  };

  /** Lupa: o trajeto ampliado, com os municípios em volta, num quadro (x, y, w, h). */
  const lupa = ({ x, y, w, h }) => {
    const s = [];
    const jan = c.lupa.janela.features[0];
    const topo = 58;
    const pe = 46;
    const p = geoConicEqualArea().parallels([-2, -22]).rotate([54, 0]).fitExtent([[x + 12, y + topo], [x + w - 12, y + h - pe]], jan);
    const path = geoPath(p).digits(1);
    const [[bx0, by0], [bx1, by1]] = path.bounds(jan);
    s.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1.2"/>`);
    s.push(`<defs><clipPath id="lupa-recorte"><rect x="${f1(bx0)}" y="${f1(by0)}" width="${f1(bx1 - bx0)}" height="${f1(by1 - by0)}"/></clipPath></defs>`);
    s.push(`<g clip-path="url(#lupa-recorte)">`);
    s.push(`<g fill="#f1f2f3" stroke="#ffffff" stroke-width="1">${c.lupa.municipios.features.map((f) => `<path d="${path(f)}"/>`).join('')}</g>`);
    s.push(`<g fill="none" stroke="#5c6166" stroke-width="1.6" stroke-linejoin="round">${brasil.ufs.features.map((f) => `<path d="${path(f)}"/>`).join('')}</g>`);
    // Destilarias da janela, na mesma escala dos círculos do mapa grande.
    for (const [k, lon, lat, , c26] of c.pontos) {
      if (c26 <= 0) continue;
      const [px, py] = p([lon, lat]);
      if (px < bx0 - 30 || px > bx1 + 30 || py < by0 - 30 || py > by1 + 30) continue;
      s.push(`<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(raio(c26))}" fill="${COR[k]}" fill-opacity=".35" stroke="${PAPEL}" stroke-width=".6"/>`);
    }
    for (const cd of c.lupa.cidades) {
      const [px, py] = p(cd.coord);
      if (c.trilha.some((t) => t.municipio.startsWith(`${cd.nome} (`))) continue;
      if (px < bx0 + 4 || px > bx1 - 4 || py < by0 + 14 || py > by1 - 8) continue;
      // O nome vai à direita do ponto; à esquerda, se passaria da borda da janela.
      const dir = px + 6 + largura(cd.nome, 13, { italico: true }) < bx1 - 4;
      s.push(`<circle cx="${f1(px)}" cy="${f1(py)}" r="2.4" fill="#5c6166"/>`);
      s.push(texto(dir ? px + 6 : px - 6, py + 4, cd.nome, { tamanho: 13, cor: '#4a4e52', fonte: SERIF, anc: dir ? 'start' : 'end', extra: `font-style="italic" ${halo(3)}` }));
    }
    // Siglas das UFs, em pontos escolhidos à mão; só as que caem dentro da própria UF e da janela.
    const siglas = { MG: [-48.6, -19.55], GO: [-50.05, -18.35], MS: [-51.0, -19.6], SP: [-49.9, -20.2] };
    for (const [uf, ll] of Object.entries(siglas)) {
      const [px, py] = p(ll);
      if (!geoContains(brasil.ufs.features.find((f) => f.properties.SIGLA_UF === uf), ll)) continue;
      if (px < bx0 + 20 || px > bx1 - 20 || py < by0 + 20 || py > by1 - 20) continue;
      s.push(texto(px, py, uf, { tamanho: 14, cor: '#5d646b', anc: 'middle', extra: `letter-spacing="2" ${halo(3)}` }));
    }
    s.push(desenharTrilha(p, { r: 4.2, lw: 2.6 }));
    // Rótulos dos anos à direita de cada ponto, sem sobrepor (o trajeto anda para noroeste).
    const ocup = [];
    c.trilha.forEach((t, i) => {
      const [px, py] = p(t.coord);
      const rot = mesTxt(t.mes);
      const ultimo = i === c.trilha.length - 1;
      const tam = ultimo || i === 0 ? 14 : 12.5;
      const lw = largura(rot, tam, { mono: true });
      for (const [dx, dy, anc] of [[10, 5, 'start'], [-10, 5, 'end'], [8, -8, 'start'], [8, 16, 'start']]) {
        const x0 = anc === 'start' ? px + dx : px + dx - lw;
        const bx = [x0 - 2, py + dy - tam, x0 + lw + 2, py + dy + 3];
        if (ocup.some((o) => bx[0] < o[2] && bx[2] > o[0] && bx[1] < o[3] && bx[3] > o[1])) continue;
        ocup.push(bx);
        s.push(texto(px + dx, py + dy, rot, { tamanho: tam, anc, extra: `${ultimo || i === 0 ? 'font-weight="bold"' : ''} ${halo(3)}` }));
        break;
      }
      ocup.push([px - 5, py - 5, px + 5, py + 5]);
    });
    s.push('</g>');
    s.push(`<rect x="${f1(bx0)}" y="${f1(by0)}" width="${f1(bx1 - bx0)}" height="${f1(by1 - by0)}" fill="none" stroke="${TINTA}" stroke-width=".8"/>`);
    // Título, nota e escala.
    s.push(texto(x + 14, y + 26, L('CENTRO DE GRAVIDADE DA CAPACIDADE', 'CENTRE OF GRAVITY OF CAPACITY'), { tamanho: 14, extra: 'letter-spacing="1.6"' }));
    s.push(texto(x + 14, y + 46, L('dezembro de cada ano e agosto de 2026 · ampliado', 'each December and August 2026 · enlarged'), { tamanho: 13, cor: CINZA, fonte: SERIF, extra: 'font-style="italic"' }));
    const pxKm = Math.hypot(...[0, 1].map((k) => p([-49.5, -19])[k] - p([-49.5 + 50 / (111.32 * Math.cos((19 * Math.PI) / 180)), -19])[k])) / 50;
    const yb = y + h - 20;
    const km = 25;
    s.push(`<rect x="${x + 14}" y="${yb - 6}" width="${f1((km * pxKm) / 2)}" height="6" fill="${TINTA}" stroke="${TINTA}"/><rect x="${f1(x + 14 + (km * pxKm) / 2)}" y="${yb - 6}" width="${f1((km * pxKm) / 2)}" height="6" fill="${PAPEL}" stroke="${TINTA}"/>`);
    s.push(texto(x + 22 + km * pxKm, yb, `${km} km`, { tamanho: 12.5 }));
    s.push(texto(x + w - 14, yb, L(`${nf(c.km_reta, 0)} km em linha reta, para ${rumo()}`, `${nf(c.km_reta, 0)} km in a straight line, to the ${rumo()}`), { tamanho: 13, anc: 'end' }));
    return { svg: s.join('\n'), janela: path };
  };

  const simbolo = (k, cx, cy) => {
    const g = cat[k];
    if (k === 'zerou') return `<circle cx="${cx}" cy="${cy}" r="8" fill="none" stroke="${g.cor}" stroke-width="1.8"/>`;
    if (k === 'cresceu') return `<circle cx="${cx}" cy="${cy}" r="9" fill="${g.cor}" fill-opacity=".88" stroke="${PAPEL}" stroke-width=".7"/><circle cx="${cx}" cy="${cy}" r="5.5" fill="none" stroke="${TINTA}"/>`;
    if (k === 'encolheu') return `<circle cx="${cx}" cy="${cy}" r="9" fill="none" stroke="${TINTA}"/><circle cx="${cx}" cy="${cy}" r="5.5" fill="${g.cor}" fill-opacity=".88" stroke="${PAPEL}" stroke-width=".7"/>`;
    return `<circle cx="${cx}" cy="${cy}" r="8" fill="${g.cor}" fill-opacity=".88" stroke="${PAPEL}" stroke-width=".7"/>`;
  };
  const ORDEM = ['nova', 'cresceu', 'igual', 'encolheu', 'zerou'];
  const circulos = (y) => legendaCirculos([6000, 2000, 500], raio, (v) => `${nf(v)} m³/${L('dia', 'day')}`, { y, cor: CINZA });
  const trilhaLegenda = (x, y) => `<path d="M${x} ${y}h40" stroke="${PAPEL}" stroke-width="6"/><path d="M${x} ${y}h40" stroke="${TINTA}" stroke-width="2"/>${[0, 20].map((d) => `<circle cx="${x + d}" cy="${y}" r="2.6" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1.2"/>`).join('')}<circle cx="${x + 40}" cy="${y}" r="3.9" fill="${TINTA}"/>`;

  return () => ({
    layout: 'um',
    motivo: 'cana',
    serie: serie(1),
    titulo: () => L('O etanol muda de endereço', 'Ethanol moves house'),
    subtitulo: () => L('A capacidade sobe para o Centro-Oeste, e o centro de gravidade vai junto',
      'Capacity climbs into the Centre-West, and the centre of gravity follows'),
    descricao: () => L(
      `Capacidade autorizada de etanol das destilarias, somada por município, em ${c.inicio} e em ${c.fim}, e o centro de gravidade dessa capacidade ano a ano`,
      `Authorised ethanol capacity of the distilleries, summed by municipality, in ${c.inicio} and ${c.fim}, and the centre of gravity of that capacity year by year`),
    reservas: () => [[LUPA.x - 10, LUPA.y - 10, LUPA.x + LUPA.w + 10, LUPA.y + LUPA.h + 10]],
    mapa: () => ({
      preencher: () => '#f1f2f3',
      bordaMunicipio: 0.9,
      bordaUnidadeCor: BORDA_UF,
      semRgint: true,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      pontos: [...pontos, ...trilha.map((p, i) => ({ coord: p, r: i === trilha.length - 1 ? 3.6 : 2.2, cor: TINTA, borda: PAPEL, bordaLargura: 1, opacidade: 1 }))],
      linhas: [{ feats: [linhaTrilha], cor: TINTA, largura: 2, halo: 3 }],
      chamadas: [{
        coord: top.coord, dx: -230, dy: -190,
        titulo: L(`${nf(top.c26)} M³/DIA EM ${top.nome.toUpperCase()} (${top.uf})`, `${nf(top.c26)} M³/DAY IN ${top.nome.toUpperCase()} (${top.uf})`),
        linhas: top.c18 === 0 && top.c26 === maxMun
          ? L(['nenhuma destilaria em 2018; hoje,', 'a maior capacidade municipal do país'], ['no distillery in 2018; now the', 'largest municipal capacity in Brazil'])
          : L([`${nf(top.c18)} m³/dia em 2018`], [`${nf(top.c18)} m³/day in 2018`]),
      }, {
        coord: [-48.6, -22.0], dx: 250, dy: 110,
        titulo: L(`SÃO PAULO · ${mil(sp.c18)} → ${mil(sp.c26)} MIL M³/DIA`, `SÃO PAULO · ${mil(sp.c18)} → ${mil(sp.c26)} THOUSAND M³/DAY`),
        linhas: L([`${pc((sp.c26 / c.total_2026) * 100)} da capacidade do país, quase parada;`, `${sp.municipios.zerou} municípios paulistas perderam a última destilaria`],
          [`${pc((sp.c26 / c.total_2026) * 100)} of national capacity, barely moving;`, `${sp.municipios.zerou} of its municipalities lost their last distillery`]),
      }],
    }),
    // Na prancha, a lupa e o trajeto por cima dos círculos; na figura (reuso), só o trajeto em escala verdadeira (linhas e pontos).
    sobreMapa: (proj) => {
      const lp = lupa(LUPA);
      const jan = c.lupa.janela.features[0];
      const [[jx0, jy0], [jx1, jy1]] = geoPath(proj).bounds(jan);
      return [
        `<rect x="${f1(jx0)}" y="${f1(jy0)}" width="${f1(jx1 - jx0)}" height="${f1(jy1 - jy0)}" fill="none" stroke="${TINTA}" stroke-width="1.2" stroke-dasharray="4 3"/>`,
        `<path d="M${f1(jx0)} ${f1(jy1)}L${LUPA.x + LUPA.w} ${LUPA.y}" stroke="${TINTA}" stroke-width=".9" stroke-dasharray="4 3"/>`,
        desenharTrilha(proj),
        lp.svg,
      ].join('\n');
    },
    sobreMapaFigura: false,
    legendaFigura: () => {
      const s = [rotuloPainel(L('CAPACIDADE POR MUNICÍPIO', 'CAPACITY BY MUNICIPALITY'), 0)];
      let y = 28;
      for (const k of ORDEM) {
        s.push(simbolo(k, 12, y - 6));
        s.push(texto(32, y, L(cat[k].rotulo, cat[k].rotulo_en), { tamanho: 16, fonte: SERIF }));
        y += 26;
      }
      s.push(texto(0, y + 2, L(`anel: ${c.inicio} · disco: ${c.fim}`, `ring: ${c.inicio} · disc: ${c.fim}`), { tamanho: 12.5, cor: CINZA }));
      y += 34;
      const lc = circulos(y);
      s.push(lc.svg);
      y += lc.altura + 30;
      s.push(trilhaLegenda(2, y - 5));
      s.push(texto(56, y, L(`centro de gravidade, ${c.inicio} → ${c.fim}`, `centre of gravity, ${c.inicio} → ${c.fim}`), { tamanho: 15, fonte: SERIF }));
      return { svg: s.join('\n'), altura: y + 6, largura: 380, canto: 'sw' };
    },
    numeros: () => [
      [`+${pc(cresc)}`, [L('de capacidade autorizada:', 'in authorised capacity:'), L(`${mil(c.total_2018, 0)} → ${mil(c.total_2026, 0)} mil m³/dia`, `${mil(c.total_2018, 0)} → ${mil(c.total_2026, 0)} thousand m³/day`)]],
      [`${nf(c.km_reta, 0)} km`, [L('andou o centro de gravidade,', 'moved by the centre of gravity,'), L(`para ${rumo()}`, `to the ${rumo()}`)]],
      [`×${nf(mt.c26 / mt.c18, 1)}`, [L('em Mato Grosso:', 'in Mato Grosso:'), L(`${mil(mt.c18)} → ${mil(mt.c26)} mil m³/dia`, `${mil(mt.c18)} → ${mil(mt.c26)} thousand m³/day`)]],
      [nf(cat.nova.municipios), [L('municípios ganharam destilaria;', 'municipalities gained a distillery;'), L(`não tinham nenhuma em ${c.inicio}`, `they had none in ${c.inicio}`)]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L(`CAPACIDADE POR MUNICÍPIO, ${c.inicio} → ${c.fim}`, `CAPACITY BY MUNICIPALITY, ${c.inicio} → ${c.fim}`), y)];
      y += 32;
      for (const k of ORDEM) {
        const g = cat[k];
        s.push(simbolo(k, 12, y - 6));
        s.push(texto(32, y, L(g.rotulo, g.rotulo_en), { tamanho: 16, fonte: SERIF }));
        s.push(texto(LP - 120, y, nf(g.municipios), { tamanho: 13, cor: CINZA, anc: 'end' }));
        s.push(texto(LP, y, g.variacao ? sinal(g.variacao) : '0', { tamanho: 13, anc: 'end' }));
        y += 26;
      }
      s.push(texto(LP - 120, y + 2, L('municípios', 'municipalities'), { tamanho: 11, cor: CINZA, anc: 'end' }));
      s.push(texto(LP, y + 2, L('mil m³/dia', 'thousand m³/day'), { tamanho: 11, cor: CINZA, anc: 'end' }));
      s.push(texto(0, y + 2, L(`anel: ${c.inicio} · disco: ${c.fim}`, `ring: ${c.inicio} · disc: ${c.fim}`), { tamanho: 11, cor: CINZA }));
      y += 34;
      // Barras divergentes: ganho ou perda de cada UF (as que mais ganharam e as que mais perderam).
      s.push(rotuloPainel(L('GANHO E PERDA POR UF · MIL M³/DIA', 'GAIN AND LOSS BY STATE · THOUSAND M³/DAY'), y));
      y += 26;
      const ganho = c.ufs.filter((u) => u.d > 0).slice(0, 6);
      const perda = c.ufs.filter((u) => u.d < 0).sort((a, b) => a.d - b.d).slice(0, 3);
      const x0 = 150;
      const esc_ = (LP - x0 - 70) / Math.max(...ganho.map((u) => u.d));
      for (const u of [...ganho, ...perda]) {
        const w = u.d * esc_;
        s.push(texto(0, y, u.uf, { tamanho: 13 }));
        s.push(texto(40, y, `${mil(u.c18)} → ${mil(u.c26)}`, { tamanho: 11.5, cor: CINZA }));
        s.push(`<rect x="${f1(w < 0 ? x0 + w : x0)}" y="${y - 11}" width="${f1(Math.max(Math.abs(w), 1))}" height="12" fill="${w < 0 ? cat.zerou.cor : cat.nova.cor}" fill-opacity=".85"/>`);
        s.push(texto(w < 0 ? x0 + 6 : x0 + w + 6, y, sinal(u.d), { tamanho: 12.5 }));
        y += 19;
      }
      s.push(`<path d="M${x0} ${y - 19 * (ganho.length + perda.length) - 16}V${y - 12}" stroke="${TINTA}" stroke-width=".8"/>`);
      y += 18;
      s.push(rotuloPainel(L('CAPACIDADE AUTORIZADA', 'AUTHORISED CAPACITY'), y));
      const lc = circulos(y + 16);
      s.push(lc.svg);
      s.push(trilhaLegenda(LP - 230, y + 40));
      s.push(texto(LP - 180, y + 45, L('centro de gravidade', 'centre of gravity'), { tamanho: 15, fonte: SERIF }));
      return { svg: s.join('\n'), y: y + 16 + lc.altura };
    },
    fontes: () => [ANP_CAP(), MALHA()],
  });
}

/* ------------------------------------------------------------------ 2 o milho entra na destilaria */
async function milho() {
  const c = await ler('milho');
  const COR = Object.fromEntries(c.classes.map((k) => [k.classe, k.cor]));
  COR[-1] = c.sem_milho;
  COR[-2] = PAPEL;
  const br = Object.fromEntries(c.brasil.map((b) => [b.periodo, b]));
  const ult = br['12m'];
  const b18 = br['2018'];
  const rotPer = (p) => (p === '12m' ? c.rotulo_12m : p);
  const tab = c.tabela['12m'];
  const uf = (s) => tab.find((t) => t.uf === s);
  const rDest = (v) => 1 + 0.15 * Math.sqrt(v);
  const destilarias = c.destilarias.map(([novo, lon, lat, cap]) => (novo
    ? { coord: [lon, lat], r: rDest(cap), cor: TINTA, opacidade: 0.85, bordaLargura: 0.6 }
    : { coord: [lon, lat], r: rDest(cap), cor: TINTA, anel: true, largura: 1.1 }));
  // Faixa da legenda: «sem milho», as cinco classes (com os limites embaixo) e «sem produção de etanol».
  // No mapa das destilarias, a legenda é só a dos círculos: na figura, à direita dela ficam a escala e a
  // projeção, e não cabe a faixa inteira; as cores são as dos outros dois mapas.
  const faixa = ({ circulos = false } = {}) => {
    const s = [];
    if (circulos) {
      s.push(texto(0, -24, L('destilarias em 08/2026, por capacidade', 'distilleries in 08/2026, by capacity'), { tamanho: 12, cor: CINZA }));
      s.push(`<circle cx="7" cy="-7" r="6.5" fill="${TINTA}" fill-opacity=".85"/>`);
      s.push(texto(22, -3, L('município sem destilaria em 12/2018', 'municipality with no distillery in 12/2018'), { tamanho: 11.5 }));
      s.push(`<circle cx="7" cy="14" r="6.5" fill="none" stroke="${TINTA}" stroke-width="1.1"/>`);
      s.push(texto(22, 18, L('município que já tinha destilaria', 'municipality that already had one'), { tamanho: 11.5 }));
      s.push(texto(0, 40, L('cores: como nos mapas de 2018 e 2022', 'colours: as in the 2018 and 2022 maps'), { tamanho: 11.5, cor: CINZA }));
      return s.join('\n');
    }
    const lw = 50;
    s.push(`<rect x="0" y="-12" width="${lw}" height="16" fill="${c.sem_milho}" stroke="${BORDA_UF}" stroke-width=".8"/>`);
    s.push(texto(lw / 2, 22, L('sem milho', 'no maize'), { tamanho: 11.5, anc: 'middle' }));
    const x0 = lw + 18;
    c.classes.forEach((k, i) => s.push(`<rect x="${x0 + i * lw}" y="-12" width="${lw}" height="16" fill="${k.cor}" stroke="${BORDA_UF}" stroke-width=".8"/>`));
    ['0', '5', '20', '50', '80', '100'].forEach((t, i) => s.push(texto(x0 + i * lw, 22, t, { tamanho: 11.5, anc: 'middle' })));
    const xs = x0 + 5 * lw + 44;
    s.push(`<rect x="${xs}" y="-12" width="${lw * 0.7}" height="16" fill="${PAPEL}" stroke="${BORDA_UF}" stroke-width=".8"/>`);
    s.push(texto(xs + lw * 0.35, 22, L('sem etanol', 'no ethanol'), { tamanho: 11.5, anc: 'middle' }));
    s.push(texto(0, -24, L('etanol de milho, % do produzido na UF (estimativa)', 'maize ethanol, % of the state’s output (estimate)'), { tamanho: 12, cor: CINZA }));
    return s.join('\n');
  };
  const mapa = (p, titulo, extra = {}) => ({
    titulo,
    pad: 64,
    preencher: (s) => COR[c.ufs[p][s]] ?? PAPEL,
    bordaMunicipio: 1,
    bordaUnidadeCor: '#aab2b9',
    semRgint: true,
    tamanhoUnidade: 11,
    legenda: faixa(extra),
    ...extra.mapa,
  });
  const pts = (y0, w, h) => {
    // Gráfico de linhas: parte do milho nas toneladas e no etanol (estimada), no país.
    const s = [];
    const per = c.brasil.map((b) => b.periodo);
    const X = (i) => 40 + (i * (w - 150)) / (per.length - 1);
    const max = 30;
    const Y = (v) => y0 + h - (v / max) * h;
    for (const v of [0, 10, 20, 30]) {
      s.push(`<path d="M40 ${f1(Y(v))}H${f1(w - 110)}" stroke="#d5d9dd" stroke-width=".8"/>`);
      s.push(texto(32, Y(v) + 4, `${v}`, { tamanho: 11, cor: CINZA, anc: 'end' }));
    }
    s.push(texto(32, y0 - 10, '%', { tamanho: 11, cor: CINZA, anc: 'end' }));
    per.forEach((p, i) => s.push(texto(X(i), y0 + h + 18, p === '12m' ? L('12 m*', '12 m*') : `’${p.slice(2)}`, { tamanho: 11, cor: CINZA, anc: 'middle' })));
    for (const [campo, cor, lw, nome] of [['pct_etanol', COR[3], 3, L('do etanol (estimativa)', 'of ethanol (estimate)')], ['pct_t', COR[1], 2, L('das toneladas', 'of tonnes')]]) {
      s.push(`<path d="${c.brasil.map((b, i) => `${i ? 'L' : 'M'}${f1(X(i))} ${f1(Y(b[campo]))}`).join('')}" fill="none" stroke="${cor}" stroke-width="${lw}" stroke-linejoin="round"/>`);
      c.brasil.forEach((b, i) => s.push(`<circle cx="${f1(X(i))}" cy="${f1(Y(b[campo]))}" r="${lw}" fill="${cor}"/>`));
      const ub = c.brasil.at(-1);
      s.push(texto(X(per.length - 1) + 10, Y(ub[campo]) + 5, `${nf(ub[campo], 1)} %`, { tamanho: 13 }));
      s.push(texto(X(per.length - 1) + 10, Y(ub[campo]) + 21, nome, { tamanho: 13, fonte: SERIF, extra: 'font-style="italic"' }));
    }
    s.push(texto(X(0) + 6, Y(b18.pct_etanol) - 10, `${nf(b18.pct_etanol, 1)} %`, { tamanho: 12 }));
    return s.join('\n');
  };
  return () => ({
    layout: 'quatro',
    motivo: 'agro',
    serie: serie(2),
    titulo: () => L('O milho entra na destilaria', 'Maize enters the distillery'),
    subtitulo: () => L('Em oito anos, um quarto do etanol passou a sair do grão', 'In eight years, a quarter of ethanol came to be made from grain'),
    descricao: () => L(
      `Parte do etanol de cada UF feita de milho: toneladas de milho processadas, convertidas pelo rendimento observado nos meses só de milho e divididas pela produção, em 2018, 2022 e ${c.rotulo_12m}`,
      `Share of each state’s ethanol made from maize: tonnes of maize processed, converted at the yield seen in maize-only months and divided by output, in 2018, 2022 and ${c.rotulo_12m}`),
    mapas: () => [
      mapa('2018', L('2018 · ETANOL DE MILHO', '2018 · MAIZE ETHANOL')),
      mapa('2022', L('2022 · ETANOL DE MILHO', '2022 · MAIZE ETHANOL')),
      mapa('12m', `${c.rotulo_12m} · ${L('E AS DESTILARIAS', 'AND THE DISTILLERIES')}`, { circulos: true, mapa: { pontos: destilarias } }),
    ],
    quartoQuadro: (w) => {
      const s = [rotuloPainel(L('PARTE DO MILHO NO PAÍS', 'MAIZE’S SHARE IN BRAZIL'), 0)];
      s.push(pts(34, w, 190));
      const y = 34 + 190 + 52;
      const notas = [
        L(`* ${c.rotulo_12m}. Uma tonelada de milho deu ${nf(c.rendimento_milho.mediana, 2)} m³ de etanol; uma de cana, ${nf(c.rendimento_cana.mediana, 3)} m³:`,
          `* ${c.rotulo_12m}. A tonne of maize gave ${nf(c.rendimento_milho.mediana, 2)} m³ of ethanol; a tonne of cane, ${nf(c.rendimento_cana.mediana, 3)} m³:`),
        L(`medianas dos ${c.rendimento_milho.n} meses em que uma UF só processou milho`, `medians of the ${c.rendimento_milho.n} months in which a state processed only maize`),
        L(`e dos ${c.rendimento_cana.n} em que só processou cana.`, `and the ${c.rendimento_cana.n} in which it processed only cane.`),
        L('Os mapas pequenos não dizem qual destilaria usa milho.', 'The small maps do not say which distillery uses maize.'),
      ];
      notas.forEach((n, i) => s.push(texto(0, y + i * 19, n, { tamanho: 12.5, cor: i === 3 ? TINTA : CINZA })));
      return s.join('\n');
    },
    numeros: () => [
      [pc(ult.pct_etanol), [L('do etanol do país', 'of Brazil’s ethanol'), L(`veio do milho (${pc(b18.pct_etanol, 1)} em 2018)`, `came from maize (${pc(b18.pct_etanol, 1)} in 2018)`)]],
      [L(`${nf(ult.milho_t / 1e6, 1)} mi t`, `${nf(ult.milho_t / 1e6, 1)} M t`), [L('de milho processado', 'of maize processed'), L(`(${nf(b18.milho_t / 1e6, 1)} mi t em 2018)`, `(${nf(b18.milho_t / 1e6, 1)} M t in 2018)`)]],
      [pc(uf('MT').pct_etanol), [L('do etanol de Mato Grosso', 'of Mato Grosso’s ethanol'), L(`e ${pc(uf('MA').pct_etanol)} do Maranhão`, `and ${pc(uf('MA').pct_etanol)} of Maranhão’s`)]],
      [`×${nf(c.rendimento_milho.mediana / c.rendimento_cana.mediana, 1)}`, [L('etanol por tonelada:', 'ethanol per tonne:'), L('milho contra cana', 'maize against cane')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L(`UFS QUE PROCESSAM MILHO · ${c.rotulo_12m}`, `STATES PROCESSING MAIZE · ${c.rotulo_12m}`), y)];
      y += 30;
      const cols = [[0, 'start', L('UF', 'state')], [150, 'end', L('mil t', 'kt')], [260, 'end', L('% das t', '% of t')], [LP, 'end', L('% do etanol', '% of ethanol')]];
      for (const [x, anc, t] of cols) s.push(texto(x, y, t, { tamanho: 11.5, cor: CINZA, anc }));
      y += 24;
      const wMax = LP - 300 - 64;
      for (const t of tab) {
        const k = t.pct_etanol >= 80 ? 4 : t.pct_etanol >= 50 ? 3 : t.pct_etanol >= 20 ? 2 : t.pct_etanol >= 5 ? 1 : 0;
        s.push(texto(0, y, t.uf, { tamanho: 13.5 }));
        s.push(texto(150, y, nf(t.milho_t / 1000), { tamanho: 13, anc: 'end' }));
        s.push(texto(260, y, nf(t.pct_t, 1), { tamanho: 13, anc: 'end', cor: CINZA }));
        const wb = (t.pct_etanol / 100) * wMax;
        s.push(`<rect x="300" y="${y - 11}" width="${f1(Math.max(wb, 1))}" height="12" fill="${COR[k]}" stroke="${BORDA_UF}" stroke-width=".5"/>`);
        s.push(texto(LP, y, nf(t.pct_etanol, 1), { tamanho: 13, anc: 'end' }));
        y += 22;
      }
      y += 8;
      s.push(texto(0, y, L(`Brasil: ${nf(ult.milho_t / 1000)} mil t de milho, ${pc(ult.pct_t, 1)} das toneladas, ${pc(ult.pct_etanol, 1)} do etanol`,
        `Brazil: ${nf(ult.milho_t / 1000)} kt of maize, ${pc(ult.pct_t, 1)} of tonnes, ${pc(ult.pct_etanol, 1)} of ethanol`), { tamanho: 12, cor: CINZA }));
      y += 40;
      s.push(rotuloPainel(L(`DESTILARIAS NESSAS UFS · ${c.destilarias_n}`, `DISTILLERIES IN THOSE STATES · ${c.destilarias_n}`), y));
      y += 28;
      const linhas = L([
        `${mil(c.destilarias_cap)} mil m³/dia de capacidade em ${c.destilarias.length} municípios;`,
        `${c.destilarias.filter((d) => d[0]).length} municípios não tinham etanol em 12/2018 e hoje`,
        `somam ${mil(c.estreantes_cap)} mil m³/dia (círculos cheios no mapa).`,
      ], [
        `${mil(c.destilarias_cap)} thousand m³/day of capacity in ${c.destilarias.length} municipalities;`,
        `${c.destilarias.filter((d) => d[0]).length} municipalities had no ethanol in 12/2018 and now`,
        `add up to ${mil(c.estreantes_cap)} thousand m³/day (filled circles on the map).`,
      ]);
      linhas.forEach((l) => { s.push(texto(0, y, l, { tamanho: 13 })); y += 20; });
      return { svg: s.join('\n'), y };
    },
    fontes: () => [ANP_CAP(), MALHA()],
  });
}

/* ------------------------------------------------------------------ 3 produzir em recuperação judicial */
async function recuperacao() {
  const c = await ler('recuperacao');
  const COR = Object.fromEntries(c.classes.map((k) => [k.classe, k.cor]));
  COR[-1] = c.sem_rj;
  COR[-2] = PAPEL;
  const porUf = Object.fromEntries(c.ufs.map((u) => [u.uf, u]));
  const f = c.fluxo;
  const pr = porUf.PR;
  const sp = porUf.SP;
  const pct = (c.cap_rj / c.cap_total) * 100;
  const s18 = c.serie.find((k) => k.mes === c.inicio);
  const pontos = [
    ...c.pontos_outras.map(([lon, lat, cap]) => ({ coord: [lon, lat], r: raio(cap), cor: '#8a9198', anel: true, largura: 0.8 })),
    ...c.pontos_rj.map(([lon, lat, cap]) => ({ coord: [lon, lat], r: raio(cap), cor: c.cor_rj, opacidade: 0.9, bordaLargura: 0.9 })),
  ];
  const itens = () => [...[...c.classes].reverse().map((k) => [k.cor, L(k.rotulo, k.rotulo_en)]),
    [c.sem_rj, L('nenhuma em recuperação', 'none in recovery')], [PAPEL, L('sem destilaria', 'no distillery')]];
  const simbolos = (y, x = 0) => [
    `<circle cx="${x + 12}" cy="${y - 6}" r="8" fill="${c.cor_rj}" fill-opacity=".9" stroke="${PAPEL}"/>`,
    texto(x + 32, y, L('com «em recuperação judicial» no nome', 'with «em recuperação judicial» in its name'), { tamanho: 15, fonte: SERIF }),
    `<circle cx="${x + 12}" cy="${y + 20}" r="8" fill="none" stroke="#8a9198" stroke-width=".9"/>`,
    texto(x + 32, y + 26, L('demais destilarias', 'other distilleries'), { tamanho: 15, fonte: SERIF }),
  ].join('\n');
  const circulos = (y) => legendaCirculos([3000, 1000, 300], raio, (v) => `${nf(v)} m³/${L('dia', 'day')}`, { y, cor: CINZA });
  return () => ({
    layout: 'um',
    motivo: 'cana',
    serie: serie(3),
    titulo: () => L('Produzir em recuperação judicial', 'Distilling under court protection'),
    subtitulo: () => L(`${f.continuam} das ${c.usinas_rj} destilarias com a marca já a carregavam em ${c.inicio}`,
      `${f.continuam} of the ${c.usinas_rj} distilleries with the tag already carried it in ${c.inicio}`),
    descricao: () => L(
      `Destilarias com autorização da ANP em ${c.fim} cujo nome empresarial registrado traz «em recuperação judicial», por município, e a parte delas na capacidade de cada UF`,
      `Distilleries authorised by the ANP in ${c.fim} whose registered company name carries «em recuperação judicial» (in judicial recovery), by municipality, and their share of each state’s capacity`),
    mapa: () => ({
      preencher: (s) => COR[porUf[s]?.classe ?? -2],
      bordaMunicipio: 1,
      bordaUnidadeCor: '#aab2b9',
      semRgint: true,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      pontos,
      chamadas: [{
        coord: [-51.9, -23.9], dx: -330, dy: 230,
        titulo: L(`PARANÁ · ${pc(pr.pct)} DA CAPACIDADE`, `PARANÁ · ${pc(pr.pct)} OF CAPACITY`),
        linhas: L([`${pr.usinas_rj} destilarias com a marca,`, `${c.maior_grupo_usinas} delas da mesma empresa`],
          [`${pr.usinas_rj} distilleries with the tag,`, `${c.maior_grupo_usinas} of them from one company`]),
      }, {
        coord: [-49.9, -21.6], dx: 330, dy: 120,
        titulo: L(`SÃO PAULO · ${sp.usinas_rj} DESTILARIAS`, `SÃO PAULO · ${sp.usinas_rj} DISTILLERIES`),
        linhas: L([`${mil(sp.cap_rj)} mil m³/dia com a marca,`, `${pc(sp.pct, 1)} da capacidade paulista`],
          [`${mil(sp.cap_rj)} thousand m³/day with the tag,`, `${pc(sp.pct, 1)} of São Paulo’s capacity`]),
      }],
    }),
    legendaFigura: () => {
      const s = [rotuloPainel(L('CAPACIDADE EM RECUPERAÇÃO, % DA UF', 'CAPACITY IN RECOVERY, % OF STATE'), 0)];
      let y = 22;
      for (const [cor, rot] of itens()) { s.push(caixa(cor, rot, y)); y += 25; }
      y += 34;
      s.push(rotuloPainel(L('DESTILARIAS POR MUNICÍPIO', 'DISTILLERIES BY MUNICIPALITY'), y));
      y += 30;
      s.push(simbolos(y));
      y += 50;
      const lc = circulos(y);
      s.push(lc.svg);
      return { svg: s.join('\n'), altura: y + lc.altura, largura: 400, canto: 'sw' };
    },
    numeros: () => [
      [nf(c.usinas_rj), [L(`das ${c.usinas} destilarias`, `of the ${c.usinas} distilleries`), L('estão em recuperação judicial', 'are in judicial recovery')]],
      [pc(pct, 1), [L('da capacidade do país,', 'of national capacity,'), L(`${mil(c.cap_rj)} mil m³/dia`, `${mil(c.cap_rj)} thousand m³/day`)]],
      [nf(c.empresas_rj), [L('empresas, pela raiz do CNPJ', 'companies, by CNPJ root'), L(`(${c.municipios_rj} municípios)`, `(${c.municipios_rj} municipalities)`)]],
      [`${nf(f.sairam_do_registro)}`, [L(`das ${f.rj_2018} de ${c.inicio} saíram`, `of the ${f.rj_2018} of ${c.inicio} left`), L('do registro da ANP', 'the ANP register')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('CAPACIDADE EM RECUPERAÇÃO, % DA UF', 'CAPACITY IN RECOVERY, % OF STATE'), y)];
      y += 18;
      // Classes com as UFs de cada uma à direita.
      const ufsDe = (k) => c.ufs.filter((u) => u.classe === k).map((u) => u.uf);
      const itensK = [...[...c.classes].reverse().map((k) => k.classe), -1];
      itensK.forEach((k, i) => {
        const [cor, rot] = itens()[i];
        s.push(caixa(cor, rot, y, { passo: 22 }));
        const lista = k >= 0 ? ufsDe(k).map((u) => `${u} ${nf(porUf[u].pct, 0)}`).join(' · ') : '';
        if (lista) s.push(texto(LP, y + 12, lista, { tamanho: 12, anc: 'end' }));
        y += 22;
      });
      y += 26;
      // Fluxo por CNPJ entre o início do painel completo e o último mês.
      s.push(rotuloPainel(L(`AS DESTILARIAS COM A MARCA · ${c.inicio} → ${c.fim}`, `DISTILLERIES WITH THE TAG · ${c.inicio} → ${c.fim}`), y));
      y += 20;
      const u = (LP - 70) / f.rj_2018;
      const blocos = (lista, yy, rot) => {
        let x = 70;
        s.push(texto(0, yy + 14, rot, { tamanho: 13 }));
        for (const [n, cor, t, claro] of lista) {
          if (!n) continue;
          s.push(`<rect x="${f1(x)}" y="${yy}" width="${f1(n * u - 2)}" height="20" fill="${cor}"/>`);
          s.push(texto(x + (n * u) / 2, yy + 15, `${n}`, { tamanho: 12.5, anc: 'middle', cor: claro ? TINTA : PAPEL }));
          if (t) s.push(texto(x + (n * u) / 2, yy + 36, t, { tamanho: 11, anc: 'middle', cor: CINZA }));
          x += n * u;
        }
      };
      const trocou = f.sairam_trocaram_cnpj;
      blocos([[f.continuam, c.cor_rj, L('continuam', 'still tagged'), false], [trocou, '#b3bac1', L('outro CNPJ', 'new CNPJ'), true],
        [f.sairam_do_registro - trocou, '#d5d9dd', L('saíram', 'gone'), true]], y, c.inicio);
      y += 46;
      blocos([[f.continuam, c.cor_rj, '', false], [f.entraram, '#a07090', L('novas', 'new'), false]], y, c.fim);
      y += 50;
      s.push(texto(0, y, L(`${f.sairam_da_marca} tiraram a marca do nome sem sair do registro.`, `${f.sairam_da_marca} dropped the tag from their name while staying registered.`), { tamanho: 12.5 }));
      y += 18;
      s.push(texto(0, y, L(`«Outro CNPJ»: o mesmo município ganhou um CNPJ novo com a mesma capacidade.`, `«New CNPJ»: the same municipality gained a new CNPJ with the same capacity.`), { tamanho: 11.5, cor: CINZA }));
      y += 32;
      // Série mensal da parte da capacidade nacional com a marca.
      s.push(rotuloPainel(L('PARTE DA CAPACIDADE DO PAÍS, MÊS A MÊS', 'SHARE OF NATIONAL CAPACITY, MONTH BY MONTH'), y));
      y += 16;
      const ser = c.serie.slice(c.serie.findIndex((k) => k.mes === c.inicio));
      const h = 56;
      const X = (i) => 40 + (i * (LP - 110)) / (ser.length - 1);
      const Y = (v) => y + h - (v / 12) * h;
      for (const v of [0, 4, 8, 12]) {
        s.push(`<path d="M40 ${f1(Y(v))}H${LP - 70}" stroke="#d5d9dd" stroke-width=".8"/>`);
        s.push(texto(32, Y(v) + 4, `${v}`, { tamanho: 11, cor: CINZA, anc: 'end' }));
      }
      s.push(`<path d="${ser.map((k, i) => `${i ? 'L' : 'M'}${f1(X(i))} ${f1(Y(k.pct))}`).join('')}" fill="none" stroke="${c.cor_rj}" stroke-width="2.4" stroke-linejoin="round"/>`);
      s.push(texto(X(0) + 4, Y(s18.pct) + 17, pc(s18.pct, 1), { tamanho: 12.5 }));
      s.push(texto(X(ser.length - 1) + 8, Y(ser.at(-1).pct) + 4, pc(ser.at(-1).pct, 1), { tamanho: 12.5 }));
      ser.forEach((k, i) => { if (k.mes.startsWith('12/') || i === ser.length - 1) s.push(texto(X(i), y + h + 16, `’${k.mes.slice(5)}`, { tamanho: 11, cor: CINZA, anc: 'middle' })); });
      y += h + 40;
      s.push(rotuloPainel(L('CAPACIDADE AUTORIZADA', 'AUTHORISED CAPACITY'), y));
      const lc = circulos(y + 16);
      s.push(lc.svg);
      s.push(simbolos(y + 34, LP - 300).replace(/font-size="15"/g, 'font-size="13"').replace(L('com «em recuperação judicial» no nome', 'with «em recuperação judicial» in its name'), L('em recuperação judicial', 'in judicial recovery')));
      return { svg: s.join('\n'), y: y + 16 + lc.altura };
    },
    fontes: () => [ANP_CAP(), MALHA()],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { endereco, milho, recuperacao };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/etanol-br/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
// O motor põe o rótulo do oceano do Brasil em [-31.5, -21] (lib/prancha-sp.mjs), em cima de Trindade e Martim Vaz,
// na prancha e na figura. Aqui o do motor sai e este entra ao largo da Bahia. O que o tema desenha só na prancha
// (sobreMapaFigura: false, a lupa da 132) continua fora da figura: o tema da figura é o que já tem _enquadramento.
const OCEANO = [-33.5, -16];
const comOceano = (t) => {
  if (t.layout !== 'um') return t;
  const { mapa, sobreMapa } = t;
  const soPrancha = t.sobreMapaFigura === false;
  return Object.assign(t, {
    mapa: () => ({ ...mapa(), oceano: false }),
    sobreMapaFigura: true,
    sobreMapa: (proj) => {
      const [x, y] = proj(OCEANO);
      return `${soPrancha && t._enquadramento ? '' : (sobreMapa?.(proj) ?? '')}
<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="19" letter-spacing="5" fill="#6f8796">${L('OCEANO ATLÂNTICO', 'ATLANTIC OCEAN')}</text>`;
    },
  });
};
await usarBrasil();
const e = SERIE.find((s) => s.tema === nome);
const fazer = await TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => comOceano(fazer()) });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `etanol-br-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
