#!/usr/bin/env node
/**
 * Coleção «Para onde vai o lixo» (SP) — desenha uma prancha a partir do cache de preparar.py (uso interno).
 *
 *   node scripts/colecoes/lixo-sp/prancha.mjs fluxos|distancia|aterros
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { geoBounds, geoPath, geoTransverseMercator } from 'd3-geo';
import {
  RAIZ, LP, SERIF, MONO, CINZA, PAPEL, TINTA, esc, nf, f1, lingua, largura, halo,
  gerarPrancha, rotuloPainel, municipios,
} from '../lib/prancha-sp.mjs';
import { legendaCirculos } from '../lib/arte.mjs';

export const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'lixo-sp', 'serie.json'), 'utf8'));
const TOTAL = 3; // pranchas da coleção
const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `lixo-sp-${nome}.json`), 'utf8'));
const L = (pt, en) => (lingua() === 'en' ? en : pt);
const serie = (i) => () => L(`PARA ONDE VAI O LIXO · ${i}/${TOTAL}`, `WHERE THE RUBBISH GOES · ${i}/${TOTAL}`);
const pc = (v, casas = 0) => L(`${nf(v, casas)} %`, `${nf(v, casas)}%`);

const FLUXO = '#234e70';         // azul-profundo: lixo levado a outro município paulista
const FORA = '#9c4a32';          // argila: lixo levado a outro estado
const POLO = '#c08a2e';          // ocre: município que recebe lixo de outros
const PROPRIO = '#4a4e52';       // grafite: aterro só do próprio município
const FUNDO_EXPORTA = '#ece3d0'; // município que manda (parte d)o lixo para outro
const FUNDO_PROPRIO = '#f1f2f3'; // município que aterra em casa
const BIOGAS = '#234e70';        // usina a biogás de lixo
const RSU = '#4a4e52';           // outras usinas a lixo no SIGA
const ATERRO = '#9aa3ab';        // município com aterro, sem usina
const BARRA_PROPRIA = '#b9c0c6'; // parte do lixo do próprio município, nas barras
const OCEANO = '#d9e5ec';        // o mesmo mar do mapa grande

// Tamanhos comuns ao mapa grande e à lupa: os círculos e as linhas valem a mesma legenda nos dois.
const raio = (t) => 1.6 + 0.21 * Math.sqrt(t);
const espessura = (t) => 0.6 + t / 280;

/* ------------------------------------------------------------------ geometria */
const sp = JSON.parse(await readFile(join(RAIZ, 'scripts', 'estados', 'cache', 'sp.json'), 'utf8'));
const limite = sp.limite.features[0];
const [[bx0, by0], [bx1, by1]] = geoBounds(limite);
// A mesma projeção do mapa grande (prancha-sp.mjs): transversa de Mercator no centro do estado.
const ROT = [-Math.round(((bx0 + bx1) / 2) * 10) / 10, -Math.round(((by0 + by1) / 2) * 10) / 10];
const caixas = municipios.map((f) => geoBounds(f));

/** Arco de a para b ([lon, lat]), curvado para a direita de quem viaja: ida e volta não se sobrepõem. */
function arco(a, b, k = 0.22, n = 24) {
  const c = Math.cos((((a[1] + b[1]) / 2) * Math.PI) / 180);
  const [ax, ay, bx, by] = [a[0] * c, a[1], b[0] * c, b[1]];
  const [mx, my] = [(ax + bx) / 2 + k * (by - ay), (ay + by) / 2 - k * (bx - ax)];
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push([((1 - t) ** 2 * ax + 2 * (1 - t) * t * mx + t ** 2 * bx) / c, (1 - t) ** 2 * ay + 2 * (1 - t) * t * my + t ** 2 * by]);
  }
  return { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: pts } };
}

/**
 * Rótulos sem sobreposição: tenta à direita, à esquerda, acima e abaixo do símbolo (raio r); se nada couber
 * colado a ele, afasta o rótulo em volta do símbolo e liga os dois com um fio.
 */
function rotular(p, itens, ocupado, { dentro, tamanho = 12.5 } = {}) {
  const s = [];
  const livre = (b) => (!dentro || (b[0] > dentro[0] && b[1] > dentro[1] && b[2] < dentro[2] && b[3] < dentro[3]))
    && !ocupado.some((o) => b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1]);
  const caixa = (x, y, lw, anc) => {
    const x0 = anc === 'start' ? x : anc === 'end' ? x - lw : x - lw / 2;
    return [x0 - 2, y - tamanho + 2, x0 + lw + 2, y + 3];
  };
  const texto = (x, y, anc, it) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anc}" font-family="${MONO}" font-size="${tamanho}" fill="${it.cor ?? TINTA}" ${halo(3.5)}>${esc(it.texto)}</text>`;
  for (const it of itens) {
    const [x, y] = p(it.coord);
    const lw = largura(it.texto, tamanho, { mono: true });
    const r = it.r ?? 3;
    const d = r + 4;
    let feito = false;
    for (const [dx, dy, anc] of [[d, 4, 'start'], [-d, 4, 'end'], [0, -d - 3, 'middle'], [0, d + tamanho, 'middle'], [d * 0.7, -d * 0.7, 'start'], [-d * 0.7, d * 0.7 + tamanho - 4, 'end']]) {
      const b = caixa(x + dx, y + dy, lw, anc);
      if (!livre(b)) continue;
      ocupado.push(b);
      s.push(texto(x + dx, y + dy, anc, it));
      feito = true;
      break;
    }
    for (const dist of feito ? [] : [26, 40, 56, 74, 96, 120]) {
      for (const g of [0, 180, -35, 35, 145, 215, -70, 70, 110, 250, 90, 270]) {
        const [c, sn] = [Math.cos((g * Math.PI) / 180), Math.sin((g * Math.PI) / 180)];
        const [ax, ay] = [x + (r + dist) * c, y + (r + dist) * sn];
        const anc = c >= -0.01 ? 'start' : 'end';
        const [tx, ty] = [ax + (anc === 'start' ? 3 : -3), ay + 4];
        const b = caixa(tx, ty, lw, anc);
        if (!livre(b)) continue;
        ocupado.push(b);
        s.push(`<path d="M${f1(x + (r + 1.5) * c)} ${f1(y + (r + 1.5) * sn)}L${f1(ax)} ${f1(ay)}" stroke="${it.cor ?? TINTA}" stroke-width=".8" fill="none"/>`);
        s.push(texto(tx, ty, anc, it));
        feito = true;
        break;
      }
      if (feito) break;
    }
    if (!feito) console.warn(`aviso: rótulo sem lugar: ${it.texto}`);
  }
  return s.join('\n');
}

/* ------------------------------------------------------------------ lupa da Grande São Paulo */
// Janela ampliada: a Região Metropolitana, a Baixada Santista e o aterro de Jambeiro.
const JANELA = [[-47.05, -24.05], [-45.65, -23.1]];
const CANTOS = { type: 'MultiPoint', coordinates: [JANELA[0], [JANELA[1][0], JANELA[0][1]], JANELA[1], [JANELA[0][0], JANELA[1][1]]] };
const LUPA = { x: 72, y: 1160, w: 600, h: 470 };
const naJanela = ([lon, lat], folga = 0) => lon > JANELA[0][0] - folga && lon < JANELA[1][0] + folga && lat > JANELA[0][1] - folga && lat < JANELA[1][1] + folga;

/** Desenha a lupa: municípios da janela, o mar e o que `desenhar(p)` puser por cima; devolve o SVG. */
function lupa({ preencher, desenhar, nota }) {
  const { x, y, w, h } = LUPA;
  const [topo, pe] = [58, 40];
  const p = geoTransverseMercator().rotate(ROT).fitExtent([[x + 12, y + topo], [x + w - 12, y + h - pe]], CANTOS);
  const path = geoPath(p).digits(1);
  const [[qx0, qy0], [qx1, qy1]] = path.bounds(CANTOS);
  const s = [];
  s.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1.2"/>`);
  s.push(`<defs><clipPath id="lupa-recorte"><rect x="${f1(qx0)}" y="${f1(qy0)}" width="${f1(qx1 - qx0)}" height="${f1(qy1 - qy0)}"/></clipPath></defs>`);
  s.push(`<g clip-path="url(#lupa-recorte)"><rect x="${f1(qx0)}" y="${f1(qy0)}" width="${f1(qx1 - qx0)}" height="${f1(qy1 - qy0)}" fill="${OCEANO}"/>`);
  const dentro = municipios.filter((_, i) => {
    const [[a0, b0], [a1, b1]] = caixas[i];
    return a1 > JANELA[0][0] && a0 < JANELA[1][0] && b1 > JANELA[0][1] && b0 < JANELA[1][1];
  });
  s.push(`<g stroke="${PAPEL}" stroke-width=".9" stroke-linejoin="round">${dentro.map((f) => `<path d="${path(f)}" fill="${preencher(f.properties.CD_MUN)}"/>`).join('')}</g>`);
  s.push(`<path d="${path(limite)}" fill="none" stroke="${TINTA}" stroke-width="1.4" stroke-linejoin="round"/>`);
  s.push(desenhar(p, [qx0, qy0, qx1, qy1]));
  s.push('</g>');
  s.push(`<rect x="${f1(qx0)}" y="${f1(qy0)}" width="${f1(qx1 - qx0)}" height="${f1(qy1 - qy0)}" fill="none" stroke="${TINTA}" stroke-width=".8"/>`);
  s.push(`<text x="${x + 14}" y="${y + 26}" font-family="${MONO}" font-size="14" letter-spacing="1.6" fill="${TINTA}">${esc(L('GRANDE SÃO PAULO E BAIXADA SANTISTA', 'GREATER SÃO PAULO AND THE COAST'))}</text>`);
  s.push(`<text x="${x + 14}" y="${y + 46}" font-family="${SERIF}" font-style="italic" font-size="13" fill="${CINZA}">${esc(nota)}</text>`);
  // Escala da lupa, medida num paralelo do meio da janela.
  const lat = (JANELA[0][1] + JANELA[1][1]) / 2;
  const km = 20;
  const pxKm = Math.hypot(...[0, 1].map((k) => p([-46.4, lat])[k] - p([-46.4 + km / (111.32 * Math.cos((lat * Math.PI) / 180)), lat])[k])) / km;
  const yb = y + h - 16;
  s.push(`<rect x="${x + 14}" y="${yb - 6}" width="${f1((km * pxKm) / 2)}" height="6" fill="${TINTA}" stroke="${TINTA}"/><rect x="${f1(x + 14 + (km * pxKm) / 2)}" y="${yb - 6}" width="${f1((km * pxKm) / 2)}" height="6" fill="${PAPEL}" stroke="${TINTA}"/>`);
  s.push(`<text x="${f1(x + 22 + km * pxKm)}" y="${yb}" font-family="${MONO}" font-size="12.5" fill="${TINTA}">${km} km</text>`);
  return s.join('\n');
}

/** Moldura tracejada da janela no mapa grande e o fio até a lupa. */
function caixaJanela(proj) {
  const xy = CANTOS.coordinates.map((c) => proj(c));
  return [Math.min(...xy.map((v) => v[0])), Math.min(...xy.map((v) => v[1])), Math.max(...xy.map((v) => v[0])), Math.max(...xy.map((v) => v[1]))];
}
function marcaJanela(proj) {
  const [x0, y0, x1, y1] = caixaJanela(proj);
  return `<rect x="${f1(x0)}" y="${f1(y0)}" width="${f1(x1 - x0)}" height="${f1(y1 - y0)}" fill="none" stroke="${TINTA}" stroke-width="1.2" stroke-dasharray="4 3"/>
<path d="M${f1(x0)} ${f1(y1)}L${LUPA.x + LUPA.w} ${LUPA.y}" stroke="${TINTA}" stroke-width=".9" stroke-dasharray="4 3"/>`;
}
const reservaLupa = () => [[LUPA.x - 10, LUPA.y - 10, LUPA.x + LUPA.w + 10, LUPA.y + LUPA.h + 10]];
// Peças fixas do quadro do mapa (prancha-sp.mjs, layout 'um'): localizador no canto de baixo e norte no de cima.
const FIXOS = { localizador: [1320, 1344, 1640, 1664], norte: [1476, 54, 1586, 224] };
/** Caixa aproximada do texto de uma chamada (a mesma conta de arte.mjs), para os rótulos não caírem nela. */
function caixaChamada(proj, { coord, dx, dy, titulo, linhas = [] }) {
  const [x, y] = proj(coord);
  const [tx, ty] = [x + dx, y + dy];
  const larg = Math.max(largura(titulo, 14, { mono: true, espaco: 1.6 }), ...linhas.map((l) => largura(l, 18, { italico: true })));
  const x0 = dx < 0 ? tx - larg : tx;
  return [x0 - 6, ty - 18, x0 + larg + 6, ty + 10 + linhas.length * 23];
}

/* ------------------------------------------------------------------ peças de legenda */
const caixa = (cor, rot, x, y, { borda = '#c9ced3' } = {}) => `<rect x="${x}" y="${y - 14}" width="30" height="18" fill="${cor}" stroke="${borda}" stroke-width=".8"/>
<text x="${x + 42}" y="${y}" font-family="${SERIF}" font-size="15">${esc(rot)}</text>`;
const bola = (cor, rot, x, y, { vazado = false, r = 7 } = {}) => `<circle cx="${x + 15}" cy="${y - 5}" r="${r}" fill="${vazado ? PAPEL : cor}" fill-opacity="${vazado ? 1 : 0.88}" stroke="${vazado ? cor : PAPEL}" stroke-width="${vazado ? 2 : 0.8}"/>
<text x="${x + 42}" y="${y}" font-family="${SERIF}" font-size="15">${esc(rot)}</text>`;

/** Círculos de toneladas por dia, com as chaves de cor à direita. Devolve { svg, y } (y = fim do bloco). */
function blocoCirculos(titulo, chaves, y) {
  const s = [rotuloPainel(titulo, y)];
  y += 18;
  const c = legendaCirculos([5000, 1000, 100], raio, (v) => nf(v), { y, cor: CINZA, tamanho: 13 });
  s.push(c.svg);
  chaves.forEach(([cor, rot, op], i) => s.push(bola(cor, rot, 150, y + 14 + i * 26, op)));
  return { svg: s.join('\n'), y: y + Math.max(c.altura, chaves.length * 26) + 10 };
}

/** Barras de toneladas: [{ nome, t, parte?, cor, direita }], com a parte do próprio município em cinza. */
function barras(itens, y, { max, x0 = 178, cor, direita = 64 } = {}) {
  const s = [];
  const larg = LP - x0 - direita - 56;
  for (const it of itens) {
    const w = (it.t / max) * larg;
    const wp = ((it.parte ?? 0) / max) * larg;
    s.push(`<text x="0" y="${y}" font-family="${SERIF}" font-size="15">${esc(it.nome)}</text>`);
    if (wp > 0) s.push(`<rect x="${x0}" y="${y - 12}" width="${f1(wp)}" height="12" fill="${BARRA_PROPRIA}"/>`);
    s.push(`<rect x="${f1(x0 + wp)}" y="${y - 12}" width="${f1(Math.max(0.8, w - wp))}" height="12" fill="${it.cor ?? cor}"/>`);
    s.push(`<text x="${f1(x0 + w + 8)}" y="${y - 1}" font-family="${MONO}" font-size="12.5">${nf(it.t)}</text>`);
    if (it.direita) s.push(`<text x="${LP}" y="${y - 1}" text-anchor="end" font-family="${MONO}" font-size="12.5" fill="${it.corDireita ?? CINZA}">${esc(it.direita)}</text>`);
    y += 25;
  }
  return { svg: s.join('\n'), y };
}

/* ------------------------------------------------------------------ 1 para onde vai o lixo */
async function fluxos() {
  const c = await ler('fluxos');
  const exporta = new Set(c.exporta);
  const preencher = (cd) => (exporta.has(cd) ? FUNDO_EXPORTA : FUNDO_PROPRIO);
  const sp_ = c.destinos.filter((d) => d.uf === 'SP');
  const top = sp_.slice(0, 7);
  const jamb = c.destinos.find((d) => d.nome === 'Jambeiro');
  const paul = c.destinos.find((d) => d.nome === 'Paulínia');
  const cat = c.destinos.find((d) => d.nome === 'Catanduva');
  const sc = c.fora_do_estado.find((f) => f.uf === 'SC');
  const linhas = c.fluxos.map(([x0, y0, x1, y1, t, tipo]) => ({ ...arco([x0, y0], [x1, y1]), properties: { t, fora: tipo === 'outro_estado' } }));
  const camadaFluxos = (feats) => ({ feats, cor: (f) => (f.properties.fora ? FORA : FLUXO), largura: (f) => f1(espessura(f.properties.t)), halo: 1.4, opacidade: 0.78 });
  const ponto = (d) => ({ coord: d.coord, r: raio(d.t), cor: d.uf !== 'SP' ? FORA : d.de_outros > 0 ? POLO : PROPRIO, vazado: d.uf !== 'SP', borda: PAPEL, bordaLargura: 0.8, opacidade: 0.88 });
  const rotulo = (d) => (d.de_outros > 0 ? `${d.nome} · ${d.municipios}` : d.nome);
  const legenda = (y) => {
    const s = [rotuloPainel(L('LIXO LEVADO A OUTRO MUNICÍPIO · T/DIA', 'WASTE TAKEN TO ANOTHER TOWN · T/DAY'), y)];
    y += 30;
    [3000, 1000, 100].forEach((t, i) => {
      s.push(`<path d="M${i * 130} ${y - 5}h58" stroke="${FLUXO}" stroke-width="${f1(espessura(t))}" stroke-opacity=".85"/>`);
      s.push(`<text x="${i * 130 + 66}" y="${y}" font-family="${MONO}" font-size="13">${nf(t)}</text>`);
    });
    s.push(`<path d="M390 ${y - 5}h58" stroke="${FORA}" stroke-width="2.4"/><text x="456" y="${y}" font-family="${SERIF}" font-size="15">${esc(L('a outro estado', 'to another state'))}</text>`);
    y += 34;
    const b = blocoCirculos(L('LIXO ATERRADO NO MUNICÍPIO DE DESTINO · T/DIA', 'WASTE LANDFILLED IN THE DESTINATION TOWN · T/DAY'), [
      [POLO, L('recebe lixo de outros municípios', 'takes waste from other towns')],
      [PROPRIO, L('aterra só o lixo da própria cidade', 'buries only its own waste')],
      [FORA, L('aterro em outro estado', 'landfill in another state'), { vazado: true }],
    ], y);
    s.push(b.svg);
    y = b.y + 22;
    s.push(caixa(FUNDO_EXPORTA, L('manda lixo para aterro em outro município', 'sends waste to a landfill in another town'), 0, y));
    s.push(caixa(FUNDO_PROPRIO, L('aterra todo o lixo no próprio município', 'buries all its waste within its own borders'), 0, y + 26));
    return { svg: s.join('\n'), y: y + 26 };
  };
  return () => ({
    layout: 'um',
    motivo: 'saneamento',
    serie: serie(1),
    titulo: () => L('Para onde vai o lixo de cada cidade', 'Where each town’s rubbish goes'),
    subtitulo: () => L('Mais da metade do lixo sai da cidade onde nasce; quase metade acaba em cinco municípios',
      'Over half the rubbish leaves its home town; nearly half ends up in five municipalities'),
    descricao: () => L(
      'Lixo urbano de cada município (t/dia, estimativa da CETESB para 2023) e o município do aterro que o recebe: uma linha da sede de origem à de destino, com largura proporcional às toneladas',
      'Urban waste from each municipality (t/day, CETESB estimate for 2023) and the municipality whose landfill takes it: one line from the town seat of origin to that of the destination, its width proportional to the tonnage'),
    reservas: reservaLupa,
    mapa: () => ({
      preencher,
      bordaMunicipio: 0.5,
      semRgint: true,
      bordaEstado: 2,
      linhas: [camadaFluxos(linhas)],
      pontos: c.destinos.map(ponto),
      destaques: sp_.filter((d) => d.municipios >= 10 && !naJanela(d.coord) && d !== paul).map((d) => ({ cd: d.cd, coord: d.coord, texto: rotulo(d) })),
      chamadas: [{
        coord: paul.coord, dx: 200, dy: -390,
        titulo: L(`PAULÍNIA · ${nf(paul.t)} T/DIA`, `PAULÍNIA · ${nf(paul.t)} T/DAY`),
        linhas: L([`lixo de ${paul.municipios} municípios, Campinas incluída;`, `${cat.nome} também atende ${cat.municipios}`],
          [`waste from ${paul.municipios} towns, Campinas among them;`, `${cat.nome} also serves ${cat.municipios}`]),
      }, {
        coord: jamb.coord, dx: 40, dy: -330,
        titulo: L(`JAMBEIRO · ${nf(jamb.t)} T/DIA`, `JAMBEIRO · ${nf(jamb.t)} T/DAY`),
        linhas: L([`${nf(jamb.vezes, 0)} vezes o lixo que a cidade gera,`, `vindo de ${jamb.de_outros} outros municípios`],
          [`${nf(jamb.vezes, 0)} times the waste the town makes,`, `brought from ${jamb.de_outros} other towns`]),
      }, {
        coord: sc.coord_de, dx: 170, dy: 190,
        titulo: L(`${sc.de.toUpperCase()} → ${sc.para.toUpperCase()} (${sc.uf})`, `${sc.de.toUpperCase()} → ${sc.para.toUpperCase()} (${sc.uf})`),
        linhas: L([`${nf(sc.km, 0)} km em linha reta: a viagem mais longa`, `${c.fora_do_estado.length} municípios aterram em outro estado`],
          [`${nf(sc.km, 0)} km as the crow flies: the longest trip`, `${c.fora_do_estado.length} towns bury their waste in another state`]),
      }],
    }),
    // Na prancha, a lupa por cima do mapa; na figura (reuso), só o mapa em escala verdadeira.
    sobreMapa: (proj) => [marcaJanela(proj), lupa({
      preencher,
      nota: L('ampliada; linhas e círculos na mesma escala do mapa · rótulo: destino · municípios atendidos',
        'enlarged; lines and circles on the main map’s scale · label: destination · towns served'),
      desenhar: (p, q) => {
        const g = geoPath(p).digits(1);
        const fl = linhas.filter((f) => naJanela(f.geometry.coordinates[0], 0.4) || naJanela(f.geometry.coordinates.at(-1), 0.4));
        const s = [`<g fill="none" stroke="${PAPEL}" stroke-linecap="round" stroke-opacity=".85">${fl.map((f) => `<path d="${g(f)}" stroke-width="${f1(espessura(f.properties.t) + 1.4)}"/>`).join('')}</g>`,
          `<g fill="none" stroke-linecap="round" stroke-opacity=".78">${fl.map((f) => `<path d="${g(f)}" stroke="${f.properties.fora ? FORA : FLUXO}" stroke-width="${f1(espessura(f.properties.t))}"/>`).join('')}</g>`];
        const ds = c.destinos.filter((d) => naJanela(d.coord, 0.1)).sort((a, b) => b.t - a.t);
        for (const d of ds) {
          const [x, y] = p(d.coord);
          const pt = ponto(d);
          s.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(pt.r)}" fill="${pt.cor}" fill-opacity=".88" stroke="${PAPEL}" stroke-width=".8"/>`);
        }
        const ocup = ds.map((d) => { const [x, y] = p(d.coord); const r = raio(d.t); return [x - r, y - r, x + r, y + r]; });
        s.push(rotular(p, ds.filter((d) => d.t >= 300).map((d) => ({ coord: d.coord, r: raio(d.t), texto: rotulo(d) })), ocup, { dentro: q }));
        return s.join('\n');
      },
    })].join('\n'),
    sobreMapaFigura: false,
    legendaFigura: () => {
      const l = legenda(0);
      return { svg: l.svg, altura: l.y + 6, largura: 560, canto: 'sw' };
    },
    numeros: () => [
      [nf(c.n_exportam), [L('dos 645 municípios mandam o', 'of the 645 towns send waste'), L('lixo a aterro em outro município', 'to a landfill in another town')]],
      [pc(c.top5_pct, 1), [L('do lixo do estado vai a só', 'of the state’s waste goes to'), L('5 municípios de destino', 'just 5 destination towns')]],
      [pc((c.t_particular / c.totais.t_dia_sp) * 100), [L(`do lixo aterrado em SP vai a`, 'of the waste buried in SP goes'), L(`aterros particulares (37 de ${c.n_locais_sp})`, `to private landfills (37 of ${c.n_locais_sp})`)]],
      [pc(c.pct_exportada), [L('do lixo sai do município', 'of the waste leaves the town'), L('onde foi gerado', 'where it was produced')]],
    ],
    painel: (y) => {
      const s = [];
      const l = legenda(y);
      s.push(l.svg);
      y = l.y + 34;
      s.push(rotuloPainel(L('OS MAIORES DESTINOS · T/DIA RECEBIDA', 'THE LARGEST DESTINATIONS · T/DAY RECEIVED'), y));
      s.push(`<text x="${LP}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="12" fill="${CINZA}">${esc(L('MUNICÍPIOS', 'TOWNS'))}</text>`);
      y += 26;
      const b = barras(top.map((d) => ({ nome: d.nome, t: d.t, parte: d.t_propria, cor: d.de_outros > 0 ? POLO : PROPRIO, direita: String(d.municipios) })), y, { max: top[0].t });
      s.push(b.svg);
      y = b.y - 6;
      s.push(`<rect x="0" y="${y - 8}" width="22" height="9" fill="${BARRA_PROPRIA}"/><text x="30" y="${y + 1}" font-family="${MONO}" font-size="11.5" fill="${CINZA}">${esc(L('do próprio município', 'its own waste'))}</text>`);
      s.push(`<rect x="210" y="${y - 8}" width="22" height="9" fill="${POLO}"/><text x="240" y="${y + 1}" font-family="${MONO}" font-size="11.5" fill="${CINZA}">${esc(L('de outros municípios', 'from other towns'))}</text>`);
      return { svg: s.join('\n'), y: y + 10 };
    },
    fontes: () => [
      L('CETESB, Inventário Estadual de RSU 2023', 'CETESB, State MSW Inventory 2023'),
      L('IBGE, Localidades 2022 e Malha Municipal 2025', 'IBGE, Localities 2022 and Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ 2 quilômetros do lixo */
async function distancia() {
  const c = await ler('distancia');
  const kmA = (k) => L(...c.rotulos_km[k]);
  const iqrA = (i) => L(...c.rotulos_iqr[i]);
  const rAnel = (tkm) => 0.085 * Math.sqrt(tkm);
  const MIN_ANEL = 2000;
  const aneis = c.aneis.filter((a) => a[2] >= MIN_ANEL);
  const capital = c.maior_tkm[0];
  // A capital manda um destino só para fora (Caieiras); o resto fica nos aterros da cidade.
  if (c.capital_fora.length !== 1) throw new Error('a chamada da capital supõe um destino fora');
  const fora = c.capital_fora[0];
  const longe = c.mais_longe[0];
  const pior = c.inadequados_lista.find((x) => x.em_casa);
  const claro = (hex) => { const v = parseInt(hex.slice(1), 16); return 0.299 * (v >> 16) + 0.587 * ((v >> 8) & 255) + 0.114 * (v & 255) > 150; };
  const nForaSp = c.totais.municipios_fora.length;
  /** Grade 3 × 3: colunas = distância, linhas = nota (a melhor em cima); com as contagens de municípios. */
  const grade = (y, { contagens = true } = {}) => {
    const s = [];
    const [x0, cw, ch] = [92, 74, 38];
    s.push(`<text x="0" y="${y + 6}" font-family="${MONO}" font-size="11.5" letter-spacing="1" fill="${CINZA}">${esc(L('NOTA DO', 'LANDFILL'))}</text>`);
    s.push(`<text x="0" y="${y + 20}" font-family="${MONO}" font-size="11.5" letter-spacing="1" fill="${CINZA}">${esc(L('ATERRO', 'SCORE'))}</text>`);
    [2, 1, 0].forEach((i, linha) => {
      const yy = y + 30 + linha * ch;
      s.push(`<text x="${x0 - 8}" y="${yy + ch / 2 + 5}" text-anchor="end" font-family="${MONO}" font-size="12.5">${esc(['≤ 7,0', '7,1–9,0', '9,1–10'][i].replace(',', lingua() === 'en' ? '.' : ',').replace(',', lingua() === 'en' ? '.' : ','))}</text>`);
      for (let k = 0; k < 3; k++) {
        const cor = c.cores[i][k];
        s.push(`<rect x="${x0 + k * cw}" y="${yy}" width="${cw - 3}" height="${ch - 3}" fill="${cor}"/>`);
        if (contagens) s.push(`<text x="${x0 + k * cw + (cw - 3) / 2}" y="${yy + ch / 2 + 3}" text-anchor="middle" font-family="${MONO}" font-size="13" fill="${claro(cor) ? TINTA : PAPEL}">${c.grade[i][k].municipios}</text>`);
      }
    });
    const yb = y + 30 + 3 * ch + 14;
    [L('em casa', 'at home'), L('até 40 km', 'up to 40'), L('+ de 40 km', 'over 40')].forEach((t, k) =>
      s.push(`<text x="${x0 + k * cw + (cw - 3) / 2}" y="${yb}" text-anchor="middle" font-family="${MONO}" font-size="12">${esc(t)}</text>`));
    s.push(`<text x="${x0 + 1.5 * cw}" y="${yb + 18}" text-anchor="middle" font-family="${MONO}" font-size="11.5" letter-spacing="1" fill="${CINZA}">${esc(L('DISTÂNCIA MÉDIA', 'MEAN DISTANCE'))}</text>`);
    // À direita: sem nota (outro estado) e os anéis.
    const xr = x0 + 3 * cw + 26;
    s.push(`<rect x="${xr}" y="${y + 30}" width="30" height="18" fill="${c.cor_fora}"/>`);
    s.push(`<text x="${xr + 40}" y="${y + 44}" font-family="${SERIF}" font-size="15">${esc(L(`aterro fora do estado${contagens ? ` (${nForaSp})` : ''}`, `landfill out of state${contagens ? ` (${nForaSp})` : ''}`))}</text>`);
    s.push(`<text x="${xr}" y="${y + 82}" font-family="${MONO}" font-size="11.5" letter-spacing="1" fill="${CINZA}">${esc(L('T·KM POR DIA (ANÉIS)', 'T·KM PER DAY (RINGS)'))}</text>`);
    const ya = y + 96;
    const vals = [100000, 25000, 5000];
    const rM = rAnel(vals[0]);
    vals.forEach((v) => {
      const r = rAnel(v);
      s.push(`<circle cx="${xr + rM}" cy="${f1(ya + 2 * rM - r)}" r="${f1(r)}" fill="none" stroke="${TINTA}" stroke-width="1.3"/>`);
    });
    vals.forEach((v, j) => {
      const r = rAnel(v);
      const yt = Math.max(ya + 2 * rM - 2 * r, ya + j * 18);
      s.push(`<path d="M${xr + rM} ${f1(ya + 2 * rM - 2 * r)}H${xr + 2 * rM + 8}L${xr + 2 * rM + 16} ${f1(yt)}" fill="none" stroke="${TINTA}" stroke-width=".7"/>`);
      s.push(`<text x="${xr + 2 * rM + 20}" y="${f1(yt + 5)}" font-family="${MONO}" font-size="13">${nf(v)}</text>`);
    });
    return { svg: s.join('\n'), y: Math.max(yb + 18, ya + 2 * rM) };
  };
  return () => ({
    layout: 'um',
    motivo: 'saneamento',
    serie: serie(2),
    titulo: () => L('Quilômetros do lixo', 'Rubbish kilometres'),
    subtitulo: () => L('Quem leva o lixo para longe quase sempre chega a um aterro bem avaliado; os aterros ruins ficam com quem aterra em casa',
      'Towns that send their rubbish far almost always reach a well-rated landfill; the poor ones serve towns that bury it at home'),
    descricao: () => L(
      'Distância em linha reta da sede do município à do município do aterro (média por tonelada), cruzada com a nota do aterro (IQR 2023 da CETESB, de 0 a 10); anéis: toneladas × quilômetros por dia',
      'Straight-line distance from the town seat to that of the landfill’s municipality (mean per tonne), crossed with the landfill’s score (CETESB IQR 2023, 0 to 10); rings: tonnes × kilometres per day'),
    mapa: () => ({
      preencher: (cd) => c.cor_por_cd[cd] ?? null,
      bordaMunicipio: 0.5,
      semRgint: true,
      bordaEstado: 2,
      // Anéis de t·km: o halo branco antes de cada anel (mesmo raio, desenhado primeiro).
      pontos: aneis.flatMap(([lon, lat, tkm]) => [
        { coord: [lon, lat], r: rAnel(tkm), cor: PAPEL, anel: true, largura: 3.6 },
        { coord: [lon, lat], r: rAnel(tkm), cor: TINTA, anel: true, largura: 1.3 },
      ]),
      chamadas: [{
        coord: capital.coord, dx: -40, dy: 360,
        titulo: L(`SÃO PAULO · ${nf(capital.tkm)} T·KM/DIA`, `SÃO PAULO · ${nf(capital.tkm)} T·KM/DAY`),
        linhas: L([`${pc((capital.tkm / c.tkm) * 100)} da carga do estado: ${nf(fora.t)} t/dia`, `a ${fora.para}, ${nf(fora.km)} km; o resto fica na cidade`],
          [`${pc((capital.tkm / c.tkm) * 100)} of the state’s load: ${nf(fora.t)} t/day`, `to ${fora.para}, ${nf(fora.km)} km; the rest stays in town`]),
      }, {
        coord: longe.coord, dx: -120, dy: 210,
        titulo: L(`${nf(longe.km, 0)} KM ATÉ ${longe.para.toUpperCase()}`, `${nf(longe.km, 0)} KM TO ${longe.para.toUpperCase()}`),
        linhas: L([`o lixo de ${longe.de}, a viagem mais longa`, 'dentro do estado'], [`${longe.de}’s waste: the longest trip`, 'within the state']),
      }, {
        coord: pior.coord, dx: -400, dy: 160,
        titulo: L(`${pior.nome.toUpperCase()} · IQR ${nf(pior.iqr, 1)}`, `${pior.nome.toUpperCase()} · IQR ${nf(pior.iqr, 1)}`),
        linhas: L([`${nf(pior.t)} t/dia num aterro inadequado, na própria`, 'cidade: o maior volume nessa situação'],
          [`${nf(pior.t)} t/day in an inadequate landfill in the town`, 'itself: the largest volume in that situation']),
      }],
    }),
    legendaFigura: () => {
      const s = [rotuloPainel(L('DISTÂNCIA × NOTA DO ATERRO', 'DISTANCE × LANDFILL SCORE'), 0)];
      const g = grade(10, { contagens: false });
      s.push(g.svg);
      return { svg: s.join('\n'), altura: g.y + 6, largura: 520, canto: 'sw' };
    },
    numeros: () => [
      [`${nf(c.km_por_t, 1)} km`, [L('em média, viaja cada tonelada', 'on average, each tonne travels'), L('até o aterro, em linha reta', 'to the landfill, as the crow flies')]],
      [L(`${nf(c.tkm / 1000, 0)} mil`, `${nf(c.tkm / 1000, 0)} thousand`), [L('toneladas-quilômetro por dia', 'tonne-kilometres a day'), L('no estado inteiro', 'across the state')]],
      [pc(c.pct_longe, 1), [L('do lixo vai a aterro a mais', 'of the waste goes to a landfill'), L(`de 40 km (${c.n_longe} municípios)`, `over 40 km away (${c.n_longe} towns)`)]],
      [`${c.inadequados}`, [L('aterros inadequados (IQR ≤ 7,0):', 'inadequate landfills (IQR ≤ 7.0):'), L('nenhum recebe lixo de fora', 'none takes waste from elsewhere')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('DISTÂNCIA × NOTA DO ATERRO · MUNICÍPIOS', 'DISTANCE × LANDFILL SCORE · TOWNS'), y)];
      const g = grade(y + 10);
      s.push(g.svg);
      y = g.y + 42;
      s.push(rotuloPainel(L('A MAIOR CARGA · T·KM POR DIA', 'THE HEAVIEST LOAD · T·KM PER DAY'), y));
      s.push(`<text x="${LP}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="12" fill="${CINZA}">${esc(L('KM/T', 'KM/T'))}</text>`);
      y += 26;
      const b = barras(c.maior_tkm.slice(0, 6).map((x) => ({ nome: x.nome, t: x.tkm, cor: '#7aa0bf', direita: nf(x.km, 1) })), y, { max: c.maior_tkm[0].tkm });
      s.push(b.svg);
      return { svg: s.join('\n'), y: b.y - 8 };
    },
    fontes: () => [
      L('CETESB, Inventário Estadual de RSU 2023', 'CETESB, State MSW Inventory 2023'),
      L('IBGE, Localidades 2022 e Malha Municipal 2025', 'IBGE, Localities 2022 and Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ 3 os aterros que já acendem a luz */
async function aterros() {
  const c = await ler('aterros');
  const ref = `${c.referencia_siga.slice(8, 10)}/${c.referencia_siga.slice(5, 7)}/${c.referencia_siga.slice(0, 4)}`;
  const paul = c.sem_usina[0];
  const mw = (v) => `${nf(v, v < 1 ? 2 : 1)} MW`;
  const pontos = [
    ...c.aterros.map(([lon, lat, t, usina]) => ({ coord: [lon, lat], r: raio(t), cor: usina ? BIOGAS : ATERRO, borda: PAPEL, bordaLargura: 0.8, opacidade: usina ? 0.88 : 0.6 })),
    ...c.usinas.map((u) => ({ coord: u.coord, r: 4.6, cor: u.grupo === 'biogas' ? BIOGAS : RSU, vazado: true })),
  ];
  // Rótulos: municípios com usina (MW de biogás), usinas fora de município com aterro e os maiores sem usina.
  const porMun = new Map();
  for (const u of c.usinas) {
    const k = porMun.get(u.municipio) ?? { bio: 0, rsu: 0, coord: u.coord, cd: u.cd, aterro: u.aterro_no_municipio };
    k[u.grupo === 'biogas' ? 'bio' : 'rsu'] += u.kw / 1000;
    porMun.set(u.municipio, k);
  }
  const rotUsina = (nome, k) => `${nome} · ${[k.bio ? mw(k.bio) : '', k.rsu ? `${mw(k.rsu)} ${L('RSU', 'MSW')}` : ''].filter(Boolean).join(' + ')}`;
  const sede = new Map([...c.com_usina, ...c.com_rsu, ...c.sem_usina].map((d) => [d.nome, d]));
  // Montados na hora de desenhar: o número segue a língua da prancha.
  const rotulos = () => [
    ...[...porMun.entries()].map(([nome, k]) => {
      const d = sede.get(nome);
      return { coord: d ? d.coord : k.coord, r: d ? raio(d.t) : 4.6, texto: rotUsina(nome, k), cor: k.bio ? BIOGAS : RSU };
    }),
    ...c.sem_usina.slice(0, 5).filter((d) => d !== paul).map((d) => ({ coord: d.coord, r: raio(d.t), texto: d.nome, cor: CINZA })),
  ];
  const chamadaPaulinia = () => ({
    coord: paul.coord, dx: -160, dy: -205,
    titulo: L(`PAULÍNIA · ${nf(paul.t)} T/DIA`, `PAULÍNIA · ${nf(paul.t)} T/DAY`),
    linhas: L([`o maior destino sem usina em operação:`, `lixo de ${paul.municipios} municípios`], [`the largest destination with no plant running:`, `waste from ${paul.municipios} towns`]),
  });
  const legenda = (y) => {
    const s = [];
    const b = blocoCirculos(L('MUNICÍPIOS COM ATERRO · T/DIA RECEBIDA', 'TOWNS WITH A LANDFILL · T/DAY RECEIVED'), [
      [BIOGAS, L('com usina a biogás de lixo', 'with a landfill-gas power plant')],
      [ATERRO, L('sem usina', 'without a plant')],
    ], y);
    s.push(b.svg);
    y = b.y + 24;
    s.push(rotuloPainel(L(`USINAS A LIXO EM OPERAÇÃO · SIGA ${ref}`, `WASTE-FUELLED PLANTS IN OPERATION · SIGA ${ref}`), y));
    y += 26;
    s.push(bola(BIOGAS, L('biogás de lixo', 'waste biogas'), 0, y, { vazado: true, r: 4.6 }));
    s.push(bola(RSU, L('outro combustível de lixo (RSU)', 'other waste fuel (MSW)'), 200, y, { vazado: true, r: 4.6 }));
    return { svg: s.join('\n'), y };
  };
  return () => ({
    layout: 'um',
    motivo: 'biogas',
    serie: serie(3),
    titulo: () => L('Os aterros que já acendem a luz', 'The landfills that already light up'),
    subtitulo: () => L(`Só ${c.n_com_usina} dos ${c.n_aterros} municípios com aterro queimam o gás do lixo para gerar eletricidade`,
      `Only ${c.n_com_usina} of the ${c.n_aterros} towns with a landfill burn rubbish gas to make electricity`),
    descricao: () => L(
      `Lixo recebido por município com aterro (t/dia, CETESB 2023) e usinas a biogás de lixo em operação no SIGA da ANEEL (${ref}), com a potência outorgada; sem estimativa de potencial`,
      `Waste received by each town with a landfill (t/day, CETESB 2023) and the waste-biogas plants running in ANEEL’s SIGA (${ref}), with licensed capacity; no estimate of potential`),
    reservas: reservaLupa,
    mapa: () => ({
      preencher: () => '#f1f2f3',
      bordaMunicipio: 0.5,
      semRgint: true,
      bordaEstado: 2,
      pontos,
      chamadas: [chamadaPaulinia()],
    }),
    // Na prancha: os rótulos do mapa grande (fora da janela), a lupa e o fio até ela.
    sobreMapa: (proj) => [marcaJanela(proj), rotular(proj, rotulos().filter((it) => !naJanela(it.coord)), [
      ...pontos.map((pt) => { const [x, y] = proj(pt.coord); return [x - pt.r, y - pt.r, x + pt.r, y + pt.r]; }),
      ...reservaLupa(), caixaJanela(proj), FIXOS.localizador, FIXOS.norte, caixaChamada(proj, chamadaPaulinia()),
    ]), lupa({
      preencher: () => '#f1f2f3',
      nota: L('ampliada; círculos na mesma escala do mapa', 'enlarged; circles on the main map’s scale'),
      desenhar: (p, q) => {
        const s = [];
        const ps = pontos.filter((pt) => naJanela(pt.coord, 0.1)).sort((a, b) => b.r - a.r);
        for (const pt of ps) {
          const [x, y] = p(pt.coord);
          s.push(pt.vazado
            ? `<circle cx="${f1(x)}" cy="${f1(y)}" r="${pt.r}" fill="${PAPEL}" stroke="${pt.cor}" stroke-width="2"/>`
            : `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(pt.r)}" fill="${pt.cor}" fill-opacity="${pt.opacidade}" stroke="${PAPEL}" stroke-width=".8"/>`);
        }
        const ocup = ps.map((pt) => { const [x, y] = p(pt.coord); return [x - pt.r, y - pt.r, x + pt.r, y + pt.r]; });
        const sedes = c.aterros.filter(([lon, lat, t]) => naJanela([lon, lat]) && t >= 500);
        const itens = rotulos().filter((it) => naJanela(it.coord));
        // Os municípios grandes sem usina que não têm rótulo ainda (Guarulhos, Santo André, Osasco…): só o nome.
        const nomes = new Map([...c.com_usina, ...c.sem_usina].map((d) => [d.coord.join(), d.nome]));
        for (const [lon, lat, t] of sedes) if (!itens.some((it) => it.coord[0] === lon && it.coord[1] === lat) && nomes.has([lon, lat].join())) itens.push({ coord: [lon, lat], r: raio(t), texto: nomes.get([lon, lat].join()), cor: CINZA });
        s.push(rotular(p, itens, ocup, { dentro: q }));
        return s.join('\n');
      },
    })].join('\n'),
    sobreMapaFigura: false,
    legendaFigura: () => {
      const l = legenda(0);
      return { svg: l.svg, altura: l.y + 6, largura: 480, canto: 'sw' };
    },
    numeros: () => [
      [`${nf(c.mw_biogas, 1)} MW`, [L(`em ${c.n_biogas} usinas a biogás de lixo`, `in ${c.n_biogas} urban-waste biogas plants`), L('em operação no estado', 'running in the state')]],
      [`${c.n_com_usina} ${L('de', 'of')} ${c.n_aterros}`, [L('municípios com aterro têm', 'towns with a landfill host'), L('usina a biogás em operação', 'a biogas plant in operation')]],
      [pc(c.pct_com_usina), [L('do lixo do estado vai', 'of the state’s waste goes'), L(`para esses ${c.n_com_usina} municípios`, `to those ${c.n_com_usina} towns`)]],
      [`${nf(c.mw_biogas_em_aterro, 1)} MW`, [L(`das ${c.n_biogas} usinas ficam em`, `of the ${c.n_biogas} plants sit in`), L('municípios com aterro em uso', 'towns with a landfill in use')]],
    ],
    painel: (y) => {
      const s = [];
      const l = legenda(y);
      s.push(l.svg);
      y = l.y + 32;
      s.push(rotuloPainel(L('COM USINA A BIOGÁS · T/DIA RECEBIDA', 'WITH A BIOGAS PLANT · T/DAY RECEIVED'), y));
      s.push(`<text x="${LP}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="12" fill="${CINZA}">MW</text>`);
      y += 26;
      const max = c.com_usina[0].t;
      const b = barras(c.com_usina.map((d) => ({ nome: d.nome, t: d.t, cor: BIOGAS, direita: nf(d.mw_biogas, 1), corDireita: BIOGAS })), y, { max });
      s.push(b.svg);
      y = b.y + 14;
      s.push(rotuloPainel(L('OS MAIORES SEM USINA', 'THE LARGEST WITHOUT ONE'), y));
      s.push(`<text x="${LP}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="12" fill="${CINZA}">${esc(L('MUNICÍPIOS', 'TOWNS'))}</text>`);
      y += 26;
      const b2 = barras(c.sem_usina.slice(0, 3).map((d) => ({ nome: d.nome, t: d.t, cor: ATERRO, direita: String(d.municipios) })), y, { max });
      s.push(b2.svg);
      return { svg: s.join('\n'), y: b2.y - 8 };
    },
    fontes: () => [
      L('CETESB, Inventário Estadual de RSU 2023', 'CETESB, State MSW Inventory 2023'),
      L(`ANEEL, SIGA (${ref})`, `ANEEL, SIGA (${ref})`),
      L('IBGE, Localidades 2022 e Malha Municipal 2025', 'IBGE, Localities 2022 and Municipal Mesh 2025'),
    ],
  });
}

const TEMAS = { fluxos, distancia, aterros };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/lixo-sp/prancha.mjs ${Object.keys(TEMAS).join('|')}`);
  process.exit(1);
}
const e = SERIE.find((s) => s.tema === nome);
const fazer = await TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => fazer() });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `lixo-sp-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
