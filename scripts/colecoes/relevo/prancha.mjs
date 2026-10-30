#!/usr/bin/env node
/**
 * Coleção «Relevo paulista» — desenha uma prancha a partir do cache de preparar.py (uso interno).
 *
 *   node scripts/colecoes/relevo/prancha.mjs mantiqueira|serra-do-mar|cuestas
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  RAIZ, LP, SERIF, MONO, TINTA, CINZA, PAPEL, esc, nf, f1, halo, lingua,
  gerarPrancha, rotuloPainel, usarRegiao,
} from '../lib/prancha-sp.mjs';
import { lerRaster, rampa } from '../lib/raster.mjs';

export const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'relevo', 'serie.json'), 'utf8'));
const lerJson = async (n) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `${n}.json`), 'utf8'));
const L = (pt, en) => (lingua() === 'en' ? en : pt);
const serie = (i) => () => L(`RELEVO PAULISTA · ${i}/3`, `THE RELIEF OF SÃO PAULO · ${i}/3`);
const RIO = '#3f6f92';

/** Gradiente vertical da rampa entre zmin e zmax (para a régua e o perfil). */
function gradiente(id, paradas, zmin, zmax, { vertical = true } = {}) {
  const st = paradas.filter(([v], i) => v <= zmax || (i > 0 && paradas[i - 1][0] < zmax))
    .map(([v, c]) => `<stop offset="${f1(Math.min(100, Math.max(0, ((v - zmin) / (zmax - zmin)) * 100)))}%" stop-color="${c}"/>`);
  return `<linearGradient id="${id}" ${vertical ? 'x1="0" y1="1" x2="0" y2="0"' : 'x1="0" y1="0" x2="1" y2="0"'} gradientUnits="objectBoundingBox">${st.join('')}</linearGradient>`;
}

/** Perfil A–B com a cor da altitude e a subida mais forte marcada. */
function perfil(c, y, alt = 210) {
  const s = [];
  const pts = c.perfil;
  const kmMax = pts[pts.length - 1][0];
  const zMax = Math.ceil((Math.max(...pts.map((p) => p[1])) + 50) / 100) * 100;
  const zMin = 0;
  const x0 = 46;
  const w = LP - x0 - 6;
  const X = (km) => x0 + (km / kmMax) * w;
  const Y = (z) => y + alt - ((z - zMin) / (zMax - zMin)) * alt;
  s.push(`<defs>${gradiente('gperfil', c.rampa, zMin, zMax)}</defs>`);
  const linha = pts.map(([km, z], i) => `${i ? 'L' : 'M'}${f1(X(km))} ${f1(Y(z))}`).join('');
  s.push(`<path d="${linha}L${f1(X(kmMax))} ${f1(Y(zMin))}L${f1(X(0))} ${f1(Y(zMin))}Z" fill="url(#gperfil)"/>`);
  s.push(`<path d="${linha}" fill="none" stroke="${TINTA}" stroke-width="1.3" stroke-linejoin="round"/>`);
  // Grade de altitudes.
  const passo = zMax > 2000 ? 500 : zMax > 900 ? 200 : 100;
  for (let z = zMin; z <= zMax; z += passo) {
    s.push(`<path d="M${x0} ${f1(Y(z))}H${x0 + w}" stroke="${CINZA}" stroke-width=".4" stroke-dasharray="2 3" stroke-opacity=".7"/>`);
    s.push(`<text x="${x0 - 6}" y="${f1(Y(z) + 4)}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${CINZA}">${nf(z)}</text>`);
  }
  // Subida mais forte.
  const { de_km: a, ate_km: b, desnivel_m: d } = c.subida;
  s.push(`<rect x="${f1(X(a))}" y="${y}" width="${f1(X(b) - X(a))}" height="${alt}" fill="${TINTA}" fill-opacity=".07"/>`);
  s.push(`<text x="${f1((X(a) + X(b)) / 2)}" y="${y + 12}" text-anchor="middle" font-family="${MONO}" font-size="11" fill="${TINTA}" ${halo(3)}>${nf(d)} m / 5 km</text>`);
  s.push(`<text x="${x0}" y="${f1(y + alt + 18)}" font-family="${SERIF}" font-size="16" font-weight="bold">A</text>`);
  s.push(`<text x="${x0 + w}" y="${f1(y + alt + 18)}" text-anchor="end" font-family="${SERIF}" font-size="16" font-weight="bold">B</text>`);
  s.push(`<text x="${x0 + w / 2}" y="${f1(y + alt + 18)}" text-anchor="middle" font-family="${MONO}" font-size="11" fill="${CINZA}">${nf(c.perfil_km, 1)} km · ${L('altitude em m', 'elevation in m')}</text>`);
  return { svg: s.join('\n'), y: y + alt + 30 };
}

/** Régua hipsométrica horizontal, com o sombreado de exemplo. */
function regua(c, y, zMax, larg = LP) {
  const s = [`<defs>${gradiente('gregua', c.rampa, 0, zMax, { vertical: false })}</defs>`];
  s.push(`<rect x="0" y="${y}" width="${larg}" height="16" fill="url(#gregua)" stroke="${TINTA}" stroke-width=".6"/>`);
  const marcas = c.faixas.filter((v, i, a) => a.length <= 7 || i % 2 === 0);
  for (const v of [...new Set([0, ...marcas])]) {
    if (v > zMax) continue;
    const x = (v / zMax) * larg;
    s.push(`<path d="M${f1(x)} ${y + 16}v5" stroke="${TINTA}" stroke-width=".6"/>`);
    s.push(`<text x="${f1(x)}" y="${y + 34}" text-anchor="${x < 10 ? 'start' : x > larg - 20 ? 'end' : 'middle'}" font-family="${MONO}" font-size="11">${nf(v)}</text>`);
  }
  s.push(`<text x="${larg}" y="${y - 6}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${CINZA}">m</text>`);
  return { svg: s.join('\n'), y: y + 44 };
}

/** Rios (HydroRIVERS, prancha 037) dentro do quadro, por cima do relevo. */
async function rios(min = 3) {
  const d = await lerJson('agua-sp-drenagem');
  const dentro = d.rios.features.filter((f) => f.properties.q >= min);
  const fora = d.fora.features.filter((f) => f.properties.o >= 4);
  return [
    { feats: fora, cor: RIO, largura: (f) => f1(0.3 + 0.25 * (f.properties.o - 3)), opacidade: 0.75 },
    { feats: dentro, cor: RIO, largura: (f) => f1(0.2 + 0.7 * Math.log10(1 + f.properties.q)), opacidade: 0.85 },
  ];
}

function fazer(area, c, linhasRio, i, txt) {
  const zMax = Math.ceil((c.alto.z + 50) / 100) * 100;
  return () => ({
    layout: 'um',
    motivo: 'relevo',
    serie: serie(i),
    pad: 0,
    raster: { r: c._r, modo: 'relevo', cor: rampa(c.rampa), recorte: 'quadro', fator: 2, exagero: txt.exagero, luz: 0.7, sombra: 0.9, jpeg: '#d9e5ec' },
    titulo: () => txt.titulo(),
    subtitulo: () => txt.subtitulo(),
    descricao: () => txt.descricao(),
    mapa: () => ({
      preencher: () => PAPEL,
      bordaMunicipio: 0,
      semRgint: true,
      bordaEstado: 2.2,
      graticulado: false,
      bordaSobreRaster: PAPEL,
      larguraSobreRaster: 0.7,
      opacidadeSobreRaster: 0.55,
      linhas: linhasRio,
      tamanhoUnidade: 12,
      semRotulo: txt.semRotulo ?? [],
      tamanhoUf: 14,
      chamadas: txt.chamadas(),
    }),
    sobreMapa: (proj) => {
      const s = [];
      const [a, b] = c.perfil_ab.map((p) => proj(p));
      s.push(`<path d="M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}" stroke="${PAPEL}" stroke-width="4" stroke-opacity=".8"/>`);
      s.push(`<path d="M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}" stroke="${TINTA}" stroke-width="1.4" stroke-dasharray="7 4"/>`);
      for (const [[x, y], t] of [[a, 'A'], [b, 'B']]) {
        s.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="11" fill="${PAPEL}" stroke="${TINTA}" stroke-width="1.4"/>`);
        s.push(`<text x="${f1(x)}" y="${f1(y + 5)}" text-anchor="middle" font-family="${SERIF}" font-size="15" font-weight="bold">${t}</text>`);
      }
      const [px, py] = proj(c.alto.coord);
      s.push(`<path d="M${f1(px)} ${f1(py - 9)}l8 14h-16z" fill="${TINTA}" stroke="${PAPEL}" stroke-width="1.6" paint-order="stroke"/>`);
      return s.join('\n');
    },
    // Na figura, o perfil A–B e o triângulo do ponto mais alto ficam de fora: sem o gráfico e a chamada, não dizem nada.
    sobreMapaFigura: false,
    legendaFigura: () => {
      // Régua mais curta que a do painel: cabe na faixa livre ao lado do quadro.
      const r = regua(c, 18, zMax, 360);
      const rio = `<path d="M0 ${r.y + 19}H30" stroke="${RIO}" stroke-width="1.6" stroke-opacity=".85"/><text x="42" y="${r.y + 24}" font-family="${SERIF}" font-size="16">${esc(L('rios', 'rivers'))}</text>`;
      return { svg: [rotuloPainel(L('ALTITUDE', 'ELEVATION'), 0), r.svg, rio].join('\n'), altura: r.y + 28, largura: 360 };
    },
    numeros: () => txt.numeros(),
    painel: (y) => {
      const s = [rotuloPainel(L('ALTITUDE', 'ELEVATION'), y)];
      const r = regua(c, y + 18, zMax);
      s.push(r.svg);
      let yy = r.y + 16;
      s.push(rotuloPainel(L('PERFIL A–B', 'PROFILE A–B'), yy));
      const p = perfil(c, yy + 20);
      s.push(p.svg);
      return { svg: s.join('\n'), y: p.y };
    },
    fontes: () => [
      L('Copernicus DEM GLO-90 (ESA, União Europeia)', 'Copernicus DEM GLO-90 (ESA, European Union)'),
      L('WWF/HydroSHEDS, HydroRIVERS; IBGE, Malha 2025', 'WWF/HydroSHEDS, HydroRIVERS; IBGE, 2025 Mesh'),
    ],
  });
}

const pct = (v) => `${nf(v, v < 10 ? 1 : 0)} %`;

const TEXTOS = {
  mantiqueira: (c) => ({
    exagero: 1.6,
    titulo: () => L('Serra da Mantiqueira', 'The Mantiqueira range'),
    subtitulo: () => L('A muralha sobre o vale do Paraíba', 'The wall above the Paraíba valley'),
    descricao: () => L(
      'Altitude do Copernicus DEM GLO-90 (pixel de 90 m) em cores hipsométricas, com sombreamento de noroeste e relevo exagerado 1,6 vez',
      'Copernicus DEM GLO-90 elevation (90 m pixels) in hypsometric tints, lit from the north-west, with relief exaggerated 1.6 times'),
    chamadas: () => [{
      coord: c.alto.coord, dx: -360, dy: -150,
      titulo: L(`${nf(c.alto.z)} M · ${c.alto.nome.toUpperCase()}`, `${nf(c.alto.z)} M · ${c.alto.nome.toUpperCase()}`),
      linhas: L(['o ponto mais alto de São Paulo,', `em ${c.alto.municipio}, na divisa com Minas`], ['the highest point in São Paulo,', `in ${c.alto.municipio}, on the Minas border`]),
    }],
    numeros: () => [
      [`${nf(c.alto.z)} m`, [L(c.alto.nome, c.alto.nome), L('no modelo de 90 m', 'in the 90 m model')]],
      [`${nf(c.subida.desnivel_m)} m`, [L('de desnível em 5 km', 'of climb in 5 km'), L('no perfil A–B', 'along profile A–B')]],
      [pct(c.pct_limiar), [L(`do quadro acima`, 'of the frame above'), L(`de ${nf(c.limiar)} m`, `${nf(c.limiar)} m`)]],
      [`${nf(c.media)} m`, [L('de altitude média', 'mean elevation'), L(`em ${nf(c.area_km2)} km²`, `over ${nf(c.area_km2)} km²`)]],
    ],
  }),
  'serra-do-mar': (c) => ({
    exagero: 1.8,
    titulo: () => L('Serra do Mar', 'The Serra do Mar'),
    subtitulo: () => L('Oitocentos metros entre o porto e o planalto', 'Eight hundred metres between port and plateau'),
    descricao: () => L(
      'Altitude do Copernicus DEM GLO-90 (pixel de 90 m) da Baixada Santista ao planalto paulistano, com sombreamento de noroeste e relevo exagerado 1,8 vez',
      'Copernicus DEM GLO-90 elevation (90 m pixels) from the Santos lowland to the São Paulo plateau, lit from the north-west, with relief exaggerated 1.8 times'),
    semRotulo: [],
    chamadas: () => [{
      coord: c.subida.coord, dx: 260, dy: -120,
      titulo: L(`${nf(c.subida.desnivel_m)} M EM 5 KM`, `${nf(c.subida.desnivel_m)} M IN 5 KM`),
      linhas: L(['a escarpa sobre Cubatão,', 'a subida mais forte do perfil'], ['the scarp above Cubatão,', 'the steepest climb on the profile']),
    }],
    numeros: () => [
      [`${nf(c.subida.desnivel_m)} m`, [L('de desnível em 5 km', 'of climb in 5 km'), L('no perfil A–B', 'along profile A–B')]],
      [`${nf(c.alto.z)} m`, [L('o ponto mais alto', 'the highest point'), L(`do quadro, em ${c.alto.municipio}`, `in the frame, in ${c.alto.municipio}`)]],
      [pct(c.pct_limiar), [L('da terra do quadro', 'of the land in the frame'), L(`acima de ${nf(c.limiar)} m`, `above ${nf(c.limiar)} m`)]],
      [`${nf(c.perfil_km, 0)} km`, [L('do mar ao planalto,', 'from the sea to the plateau,'), L('de A a B', 'from A to B')]],
    ],
  }),
  cuestas: (c) => ({
    exagero: 4,
    titulo: () => L('Cuestas paulistas', 'The cuestas of São Paulo'),
    subtitulo: () => L('O degrau do basalto', 'The basalt step'),
    descricao: () => L(
      'Altitude do Copernicus DEM GLO-90 (pixel de 90 m) entre Botucatu, São Pedro e Itirapina, com sombreamento de noroeste e relevo exagerado 4 vezes',
      'Copernicus DEM GLO-90 elevation (90 m pixels) between Botucatu, São Pedro and Itirapina, lit from the north-west, with relief exaggerated 4 times'),
    chamadas: () => [{
      coord: c.alto.coord, dx: -200, dy: -330,
      titulo: L(`${nf(c.alto.z)} M · ${c.alto.municipio.toUpperCase()}`, `${nf(c.alto.z)} M · ${c.alto.municipio.toUpperCase()}`),
      linhas: L(['o alto da cuesta, a borda do basalto', `com ${nf(c.subida.desnivel_m)} m de desnível em 5 km`], ['the top of the cuesta, the basalt rim,', `with ${nf(c.subida.desnivel_m)} m of climb in 5 km`]),
    }],
    numeros: () => [
      [`${nf(c.subida.desnivel_m)} m`, [L('de desnível em 5 km', 'of climb in 5 km'), L('no perfil A–B', 'along profile A–B')]],
      [`${nf(c.alto.z)} m`, [L('o ponto mais alto', 'the highest point'), L(`do quadro, em ${c.alto.municipio}`, `in the frame, in ${c.alto.municipio}`)]],
      [`${nf(c.amplitude)} m`, [L('entre o ponto mais baixo', 'between the lowest'), L('e o mais alto', 'and highest points')]],
      [pct(c.pct_limiar), [L('do quadro acima', 'of the frame above'), L(`de ${nf(c.limiar)} m`, `${nf(c.limiar)} m`)]],
    ],
  }),
};

/* ------------------------------------------------------------------ */
const nome = process.argv[2];
if (!TEXTOS[nome]) {
  console.error(`uso: node scripts/colecoes/relevo/prancha.mjs <${Object.keys(TEXTOS).join('|')}>`);
  process.exit(1);
}
const e = SERIE.find((s) => s.tema === nome);
await usarRegiao(`relevo-${nome}`);
const c = await lerJson(`relevo-${nome}`);
c._r = await lerRaster(`grade-relevo-${nome}`);
const linhasRio = await rios();
const tema = fazer(nome, c, linhasRio, SERIE.indexOf(e) + 1, TEXTOS[nome](c));
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => tema() });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `relevo-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
