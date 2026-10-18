#!/usr/bin/env node
/**
 * Coleção «Bacias de suprimento» — desenha uma prancha a partir do cache de preparar.mjs (uso interno).
 *
 *   node --max-old-space-size=8192 scripts/colecoes/suprimento-sp/prancha.mjs alcance|curva|bacias|disputa
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { geoTransverseMercator, geoBounds, geoDistance } from 'd3-geo';
import { RAIZ, LP, SERIF, MONO, TINTA, CINZA, PAPEL, esc, nf, f1, gerarPrancha, rotuloPainel, legendaFaixa } from '../lib/prancha-sp.mjs';
import { legendaCirculos } from '../lib/arte.mjs';
import { imagemRaster } from '../lib/raster.mjs';
import { SP } from '../lib/cruzamentos.mjs';
import { L, ZERO, pct, grande, barras, caixaLegenda, nota } from '../lib/painel.mjs';
import { friso } from './friso.mjs';

const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'suprimento-sp', 'serie.json'), 'utf8'));
const S = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', 'suprimento-sp.json'), 'utf8'));
const bin = await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', 'suprimento-sp-grade.bin'));
const GR = new Float32Array(bin.buffer, bin.byteOffset, bin.byteLength / 4);
const { largura: NX, altura: NY, x0: X0, y0: Y0, dx: DX, dy: DY, camadas } = S.grade;
const NC = NX * NY;
const lay = Object.fromEntries(camadas.map((k, i) => [k, (c) => GR[i * NC + c]]));
const celDe = (lon, lat) => {
  const i = Math.floor((lon - X0) / DX), j = Math.floor((Y0 - lat) / DY);
  if (i < 0 || j < 0 || i >= NX || j >= NY) return -1;
  const c = j * NX + i;
  return Number.isNaN(GR[c]) ? -1 : c;
};
/** Grade em classes para lib/raster.mjs: codigo(célula) → inteiro (a cor sai de cores[código]) ou null. */
const grade = (codigo) => ({ valor: (lon, lat) => { const c = celDe(lon, lat); return c < 0 ? null : codigo(c); } });

const serie = (i) => () => L(`BACIAS DE SUPRIMENTO · ${i}/4`, `SUPPLY CATCHMENTS · ${i}/4`);
const N4 = () => L('método CP2B v5.1, nível N4 (acessível), cenário de referência', 'CP2B method v5.1, level N4 (accessible), reference scenario');
const CP2B = () => L('CP2B (Unicamp), método v5.1, 2026', 'CP2B (Unicamp), method v5.1, 2026');
const MB = () => L('MapBiomas, Coleção 10 (uso da terra, 2024)', 'MapBiomas, Collection 10 (land use, 2024)');
const EPE = () => L('EPE, WebMap (via MapBiomas)', 'EPE, WebMap (via MapBiomas)');
const MALHA = () => L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025');
const GRUPO = Object.fromEntries(S.grupos.map((g) => [g.k, g]));
const nomeG = (k) => L(GRUPO[k].pt, GRUPO[k].en);
const mil = (v) => (v >= 1e6 ? L(`${nf(v / 1e6, 2)} ${v >= 2e6 ? 'milhões' : 'milhão'}`, `${nf(v / 1e6, 2)} million`) : L(`${nf(Math.round(v / 1000))} mil`, `${nf(Math.round(v / 1000))} thousand`));
const MIL = (v) => mil(v).toUpperCase();
const pA = (a) => (100 * a) / S.area;
const pT = (v) => (100 * v) / S.total;
const cls = (v, lim) => { let i = 0; while (i < lim.length && v > lim[i]) i++; return i; };
const km = (v) => `${nf(v)} km`;
const semPE = (n) => n.replace(/^PE /, '').replace(/ \/ PE /g, ' / ');
const semSE = (n) => n.replace(/^SE /, '');

/** Legenda de faixa com rótulos nos limites internos (sem a caixa do zero). */
function faixa(cores, limites, { larg = 64, y = 0 } = {}) {
  const s = [];
  cores.forEach((c, i) => s.push(`<rect x="${i * larg}" y="${y}" width="${larg}" height="14" fill="${c}" stroke="#1a211a" stroke-width=".6"/>`));
  limites.forEach((l, i) => s.push(`<text x="${(i + 1) * larg}" y="${y + 32}" text-anchor="middle" font-family="${MONO}" font-size="12">${esc(l)}</text>`));
  return s.join('\n');
}
/** Texto quebrado na largura `w`, em serifa itálica. */
function paragrafo(t, x, y, w, tam = 15) {
  const n = nota(t, y, { tamanho: tam, max: w });
  return { svg: x ? `<g transform="translate(${x} 0)">${n.svg}</g>` : n.svg, y: n.y };
}

/* ------------------------------------------------------------------ projeção dos mapas pequenos (igual a prancha-sp) */
const LIM = SP.limite.features[0];
const [[gx0, gy0], [gx1, gy1]] = geoBounds(LIM);
const LON0 = Math.round(((gx0 + gx1) / 2) * 10) / 10, LAT0 = Math.round(((gy0 + gy1) / 2) * 10) / 10;
function projPequena(w = 820, h = 832, pad = 40) {
  const proj = geoTransverseMercator().rotate([-LON0, -LAT0]).fitExtent([[pad, pad], [w - pad, h - pad]], LIM);
  const [cx, cy] = proj([LON0, LAT0]);
  const pxKm = 400 / (geoDistance(proj.invert([cx, cy - 200]), proj.invert([cx, cy + 200])) * 6371.0088);
  return { proj, pxKm };
}

/* ------------------------------------------------------------------ 1/4 alcance */
const LIM_ALC = [10000, 30000, S.ref_m3d, 100000, 300000, 600000];
const CORES_ALC = ['#f4f2ea', '#e7e3d2', '#d8d1b6', '#b9c79a', '#8fab72', '#5f8a52', '#33603a'];
const rotAlc = () => LIM_ALC.map((v) => L(`${nf(v / 1000)} mil`, `${nf(v / 1000)}k`));
function alcance() {
  const top = S.alc_max[0];
  const cap = S.alc_max_g[3][0];
  const itp = S.alc_max_g[1][0];
  const [aT, aC, aL, aP, aU] = S.area_ref;
  return () => ({
    layout: 'um',
    motivo: friso,
    serie: serie(1),
    titulo: () => L('Biometano a 30 km', 'Biomethane within 30 km'),
    subtitulo: () => L('Num raio de caminhão, três quartos do estado juntam gás para uma planta', 'Within a lorry’s radius, three quarters of the state gather gas for a plant'),
    descricao: () => L(
      `Potencial de biometano a até 30 km em linha reta de cada ponto do estado (${N4()}), espalhado dentro de cada município pelo uso da terra que gera cada resíduo`,
      `Biomethane potential within 30 km in a straight line of each point of the state (${N4()}), spread within each municipality over the land use that produces each residue`),
    raster: { r: grade((c) => cls(lay.alc(c), LIM_ALC)), modo: 'classes', cor: (k) => CORES_ALC[k], recorte: 'limite', fator: 2 },
    mapa: () => ({
      preencher: () => PAPEL,
      bordaMunicipio: 0,
      chamadas: [
        { coord: top.coord, dx: 170, dy: -210, tamanho: 16, titulo: L(`${top.NM_MUN.toUpperCase()} · ${MIL(top.v)} M³/DIA`, `${top.NM_MUN.toUpperCase()} · ${MIL(top.v)} M³/DAY`), linhas: L(['a 30 km: o maior alcance do estado,', `${pct((100 * top.cana) / top.v, 0)} dele da cana`], ['within 30 km: the largest catchment', `in the state, ${nf((100 * top.cana) / top.v, 0)}% of it from cane`]) },
        { coord: cap.coord, dx: 120, dy: 250, tamanho: 16, titulo: L(`SÃO PAULO · ${MIL(cap.v)} M³/DIA`, `SÃO PAULO · ${MIL(cap.v)} M³/DAY`), linhas: L(['de lixo, poda e esgoto a 30 km:', 'o maior alcance urbano'], ['of waste, pruning and sewage within', '30 km: the largest urban catchment']) },
        { coord: itp.coord, dx: -60, dy: 230, tamanho: 16, titulo: L(`${itp.NM_MUN.toUpperCase()} · ${MIL(itp.v)} M³/DIA`, `${itp.NM_MUN.toUpperCase()} · ${MIL(itp.v)} M³/DAY`), linhas: L(['de outras lavouras a 30 km:', 'o maior fora da cana'], ['of other crops within 30 km:', 'the largest outside cane']) },
      ],
    }),
    numeros: () => [
      [pct(pA(aT), 0), [L('da área junta, a 30 km,', 'of the area gathers, within'), L(`${nf(S.ref_m3d / 1000)} mil m³/dia ou mais`, `30 km, ${nf(S.ref_m3d / 1000)},000 m³/day or more`)]],
      [pct(pA(S.area_ref_fora_cana), 0), [L('da área chega lá', 'of the area gets there'), L('sem contar a cana', 'leaving cane out')]],
      [mil(top.v), [L('m³/dia a 30 km de', 'm³/day within 30 km of'), L(`${top.NM_MUN}, o máximo`, `${top.NM_MUN}, the maximum`)]],
      [pct(pA(S.area - S.area_limites[0][1]), 0), [L('da área junta menos de', 'of the area gathers under'), L('10 mil m³/dia a 30 km', '10,000 m³/day within 30 km')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L(`ÁREA ONDE 30 KM JUNTAM ${nf(S.ref_m3d / 1000)} MIL M³/DIA`, `AREA WHERE 30 KM GATHER ${nf(S.ref_m3d / 1000)},000 M³/DAY`), y)];
      const itens = [
        [L('todos os resíduos', 'all residues'), pA(aT), TINTA],
        [nomeG('cana'), pA(aC), GRUPO.cana.cor],
        [L('todos, menos a cana', 'all but cane'), pA(S.area_ref_fora_cana), '#6d7165'],
        [nomeG('lavouras'), pA(aL), GRUPO.lavouras.cor],
        [nomeG('pecuaria'), pA(aP), GRUPO.pecuaria.cor],
        [nomeG('urbano'), pA(aU), GRUPO.urbano.cor],
      ];
      const b = barras(itens.map(([n, v, cor]) => [n, v, cor, pct(v, v < 10 ? 1 : 0)]), y + 14, { max: 100, x0: 190, passo: 21 });
      s.push(b.svg);
      const n1 = paragrafo(L(`${nf(S.ref_m3d / 1000)} mil m³/dia é a mediana da capacidade autorizada das ${S.cap_anp.length} plantas de biometano paulistas da ANP (de ${nf(S.cap_anp[0] / 1000)} a ${nf(S.cap_anp.at(-1) / 1000)} mil).`,
        `${nf(S.ref_m3d / 1000)},000 m³/day is the median authorised capacity of São Paulo’s ${S.cap_anp.length} ANP biomethane plants (from ${nf(S.cap_anp[0] / 1000)},000 to ${nf(S.cap_anp.at(-1) / 1000)},000).`), 0, b.y + 16, LP, 14);
      s.push(n1.svg);
      let yy = n1.y + 30;
      s.push(rotuloPainel(L('BIOMETANO A ATÉ 30 KM · M³/DIA', 'BIOMETHANE WITHIN 30 KM · M³/DAY'), yy));
      s.push(`<g transform="translate(0 ${yy + 18})">${faixa(CORES_ALC, rotAlc(), { larg: 78 })}</g>`);
      s.push(`<path d="M${3 * 78} ${yy + 16}v18" stroke="${TINTA}" stroke-width="1.6"/>`);
      s.push(`<text x="${3 * 78}" y="${yy + 70}" text-anchor="middle" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L('porte de referência', 'reference size'))}</text>`);
      return { svg: s.join('\n'), y: yy + 62 };
    },
    fontes: () => [CP2B(), MB(), MALHA()],
  });
}

/* ------------------------------------------------------------------ 2/4 curva de oferta */
const LIM_KM = [10, 25, 50, 100, 150];
const CORES_KM = ['#2f4f3a', '#5f8a5a', '#a9bf86', '#e0cf8f', '#c98f4a', '#8f4f2e'];
const misturar = (hex, t) => '#' + [1, 3, 5].map((k) => Math.round(parseInt(hex.slice(k, k + 2), 16) * (1 - t) + 255 * t).toString(16).padStart(2, '0')).join('');
const CORES_KM_CLARO = CORES_KM.map((c) => misturar(c, 0.72));
const GAS_T = '#6b3d5c';
const rotKm = () => L(['até 10 km', '10 a 25 km', '25 a 50 km', '50 a 100 km', '100 a 150 km', 'mais de 150 km'], ['up to 10 km', '10 to 25 km', '25 to 50 km', '50 to 100 km', '100 to 150 km', 'over 150 km']);
function curva() {
  const longe = S.longe[0];
  const ate = (k) => S.ate_ent.find(([d]) => d === k);
  const [, t50] = ate(50);
  const [, , , , , u25] = ate(25);
  const LINHAS = [['total', TINTA, 2.6, 0], ...S.grupos.map((g, q) => [g.k, g.cor, 1.8, q + 1])];
  return () => ({
    layout: 'um',
    motivo: friso,
    serie: serie(2),
    titulo: () => L('A curva de oferta', 'The supply curve'),
    subtitulo: () => L(`Metade do biometano fica a mais de ${S.mediana_km[0]} km de um ponto de entrega de gás`, `Half the biomethane lies over ${S.mediana_km[0]} km from a gas delivery point`),
    descricao: () => L(
      `Potencial de biometano (${N4()}) acumulado pela distância em linha reta ao ponto de entrega de gás existente mais próximo, em células de cerca de 1 km`,
      `Biomethane potential (${N4()}) accumulated by straight-line distance to the nearest existing gas delivery point, in cells of about 1 km`),
    raster: {
      r: grade((c) => { const d = lay.dens(c); if (!(d > 0)) return 12; return cls(lay.d_ent(c), LIM_KM) + (d >= S.dens75 ? 0 : 6); }),
      modo: 'classes', cor: (k) => (k === 12 ? ZERO : k < 6 ? CORES_KM[k] : CORES_KM_CLARO[k - 6]), recorte: 'limite', fator: 2,
    },
    mapa: () => ({
      preencher: () => PAPEL,
      bordaMunicipio: 0,
      linhas: [{ feats: S.desenho.transporte, cor: GAS_T, largura: 2.4, halo: 2.5 }],
      pontos: S.entrega.map((e) => ({ coord: e.coord, r: 5, cor: GAS_T, borda: PAPEL, opacidade: 1, bordaLargura: 1.6 })),
      chamadas: [
        { coord: longe.coord, dx: 120, dy: 200, tamanho: 16, titulo: L(`${longe.NM_MUN.toUpperCase()} · ${nf(longe.v, 0)} KM`, `${longe.NM_MUN.toUpperCase()} · ${nf(longe.v, 0)} KM`), linhas: L(['do ponto de entrega mais próximo,', 'no fim da curva'], ['from the nearest delivery point,', 'at the end of the curve']) },
      ],
    }),
    numeros: () => [
      [km(S.mediana_km[0]), [L('juntam metade do', 'gather half of the'), L('biometano do estado', 'state’s biomethane')]],
      [pct(pT(t50), 0), [L('do potencial fica a até', 'of the potential lies within'), L('50 km de um ponto de entrega', '50 km of a delivery point')]],
      [pct((100 * u25) / GRUPO.urbano.m3d, 0), [L('do lixo, poda e esgoto', 'of waste, pruning and sewage'), L('fica a até 25 km', 'lies within 25 km')]],
      [km(S.mediana_km[3]), [L('juntam metade dos', 'gather half of the'), L('dejetos animais', 'animal manure')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('PARTE DO POTENCIAL A ATÉ X KM', 'SHARE OF POTENTIAL WITHIN X KM'), y)];
      const gx = 44, gy = y + 22, gw = LP - 180, gh = 230, XM = 200;
      const X = (d) => gx + (d / XM) * gw, Y = (v) => gy + gh - v * gh;
      s.push(`<path d="M${gx} ${gy}V${gy + gh}H${gx + gw}" fill="none" stroke="${TINTA}" stroke-width=".8"/>`);
      for (const q of [0.25, 0.5, 0.75, 1]) {
        s.push(`<path d="M${gx} ${f1(Y(q))}H${gx + gw}" stroke="#d5d9dd" stroke-width=".7"/>`);
        s.push(`<text x="${gx - 6}" y="${f1(Y(q) + 4)}" text-anchor="end" font-family="${MONO}" font-size="11">${nf(q * 100)} %</text>`);
      }
      for (const d of [0, 25, 50, 100, 150, 200]) s.push(`<text x="${f1(X(d))}" y="${gy + gh + 17}" text-anchor="middle" font-family="${MONO}" font-size="11">${d}</text>`);
      s.push(`<text x="${gx + gw}" y="${gy + gh + 34}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L('km até o ponto de entrega de gás mais próximo', 'km to the nearest gas delivery point'))}</text>`);
      const traço = (arr, tot) => arr.slice(0, XM + 1).map((v, d) => `${d ? 'L' : 'M'}${f1(X(d))} ${f1(Y(v / tot))}`).join('');
      s.push(`<path d="${traço(S.curva_se, S.total)}" fill="none" stroke="${CINZA}" stroke-width="1.4" stroke-dasharray="5 4"/>`);
      const fins = [];
      for (const [k, cor, w, q] of LINHAS) {
        const tot = q ? GRUPO[k].m3d : S.total;
        s.push(`<path d="${traço(S.curva[q], tot)}" fill="none" stroke="${cor}" stroke-width="${w}" stroke-linejoin="round"/>`);
        fins.push([S.curva[q][Math.min(XM, S.curva[q].length - 1)] / tot, cor, k === 'urbano' ? L('lixo, poda e esgoto', 'waste and sewage') : q ? nomeG(k) : L('todos', 'all')]);
      }
      fins.push([S.curva_se[Math.min(XM, S.curva_se.length - 1)] / S.total, CINZA, L('todos, à subestação', 'all, to substation')]);
      // Rótulos à direita, afastados entre si.
      const ord = fins.map((f, i) => ({ f, i, y: Y(f[0]) })).sort((a, b) => a.y - b.y);
      for (let k = 1; k < ord.length; k++) if (ord[k].y < ord[k - 1].y + 15) ord[k].y = ord[k - 1].y + 15;
      const ajuste = Math.max(0, ord.at(-1).y - (gy + gh));
      for (const o of ord) s.push(`<text x="${gx + gw + 8}" y="${f1(o.y - ajuste + 4)}" font-family="${SERIF}" font-size="13" fill="${o.f[1]}">${esc(o.f[2])}</text>`);
      let yy = gy + gh + 64;
      s.push(rotuloPainel(L('DISTÂNCIA AO PONTO DE ENTREGA', 'DISTANCE TO THE DELIVERY POINT'), yy));
      yy += 18;
      s.push(`<g transform="translate(0 ${yy})">${faixa(CORES_KM, LIM_KM.map((v) => nf(v)), { larg: 62 })}</g>`);
      s.push(`<g transform="translate(0 ${yy + 40})">${faixa(CORES_KM_CLARO, [], { larg: 62 })}</g>`);
      s.push(`<text x="${6 * 62 + 12}" y="${yy + 12}" font-family="${MONO}" font-size="11">${esc(L(`células que somam 75 %`, 'cells holding 75%'))}</text>`);
      s.push(`<text x="${6 * 62 + 12}" y="${yy + 26}" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L(`do potencial (${pct(pA(S.area75), 0)} da área)`, `of potential (${nf(pA(S.area75), 0)}% of area)`))}</text>`);
      s.push(`<text x="${6 * 62 + 12}" y="${yy + 52}" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L('as demais', 'the rest'))}</text>`);
      yy += 84;
      s.push(`<path d="M0 ${yy - 5}H30" stroke="${PAPEL}" stroke-width="5"/><path d="M0 ${yy - 5}H30" stroke="${GAS_T}" stroke-width="2.4"/><text x="42" y="${yy}" font-family="${SERIF}" font-size="15">${esc(L('gasoduto de transporte', 'transmission pipeline'))}</text>`);
      s.push(`<circle cx="${LP / 2 + 15}" cy="${yy - 5}" r="5" fill="${GAS_T}" stroke="${PAPEL}" stroke-width="1.6"/><text x="${LP / 2 + 30}" y="${yy}" font-family="${SERIF}" font-size="15">${esc(L('ponto de entrega de gás', 'gas delivery point'))}</text>`);
      return { svg: s.join('\n'), y: yy + 12 };
    },
    fontes: () => [CP2B(), EPE(), MB(), MALHA()],
  });
}

/* ------------------------------------------------------------------ 3/4 bacias da rede */
const CORES_BAC = ['#eef0e2', '#d5dcbd', '#adbf8e', '#7f9d63', '#557a43', '#2f5530'];
const LIM_ENT = [100000, 300000, 600000, 1200000, 2000000];
const LIM_SE = [50000, 150000, 300000, 600000, 1000000];
const LIM_FORA = [20000, 50000, 100000, 200000, 400000];
const rotMil = (lim) => lim.map((v) => (v >= 1e6 ? L(`${nf(v / 1e6, 1)} mi`, `${nf(v / 1e6, 1)}M`) : L(`${nf(v / 1000)} mil`, `${nf(v / 1000)}k`)));
async function bacias() {
  const { proj, pxKm } = projPequena();
  const fator = 2;
  const tKm = 0.75 / pxKm;
  /** Raster das bacias: cor da classe da bacia do site mais próximo; borda onde os dois mais próximos empatam. */
  const rasterBacias = async (sites, valor, lim) => {
    const kxDe = (lat) => 111.32 * Math.cos((lat * Math.PI) / 180);
    const classes = sites.map((s) => cls(valor(s), lim));
    const r = {
      valor: (lon, lat) => {
        if (celDe(lon, lat) < 0) return null;
        const kx = kxDe(lat);
        let d1 = Infinity, d2 = Infinity, k1 = -1, k2 = -1;
        for (let i = 0; i < sites.length; i++) {
          const [x, y] = sites[i].coord;
          const d = ((x - lon) * kx) ** 2 + ((y - lat) * 110.574) ** 2;
          if (d < d1) { d2 = d1; k2 = k1; d1 = d; k1 = i; } else if (d < d2) { d2 = d; k2 = i; }
        }
        // Distância à mediatriz dos dois sites mais próximos: (d2² − d1²) / (2 · distância entre eles).
        const [ax, ay] = sites[k1].coord, [bx, by] = sites[k2].coord;
        const ab = Math.hypot((ax - bx) * kx, (ay - by) * 110.574);
        return (d2 - d1) / (2 * ab) < tKm ? 99 : classes[k1];
      },
    };
    return imagemRaster(r, proj, 820, 832, { modo: 'classes', cor: (k) => (k === 99 ? '#ffffff' : CORES_BAC[k]), fator });
  };
  const ent = S.entrega, se = S.subest;
  const rEnt = await rasterBacias(ent, (b) => b.biometano_m3d, LIM_ENT);
  const rSe = await rasterBacias(se, (b) => b.biometano_m3d, LIM_SE);
  const rFora = await rasterBacias(ent, (b) => b.fora_da_cana_m3d, LIM_FORA);
  const topE = [...ent].sort((a, b) => b.biometano_m3d - a.biometano_m3d);
  const topF = [...ent].sort((a, b) => b.fora_da_cana_m3d - a.fora_da_cana_m3d);
  const topS = [...se].sort((a, b) => b.biometano_m3d - a.biometano_m3d);
  const nEnt = ent.filter((b) => b.area_km2 > 0).length, nSe = se.filter((b) => b.area_km2 > 0).length;
  const cinco = topE.slice(0, 5).reduce((a, b) => a + b.biometano_m3d, 0);
  const pontos = (sites, r) => sites.filter((b) => b.area_km2 > 0 || b.em_sp).map((b) => ({ coord: b.coord, r, cor: TINTA, borda: PAPEL, opacidade: 1, bordaLargura: 1 }));
  const ch = (b, dx, dy, linhas) => ({ coord: b.coord, dx, dy, tamanho: 14, titulo: '', linhas });
  return () => ({
    layout: 'quatro',
    motivo: friso,
    serie: serie(3),
    titulo: () => L('Biometano à porta da rede', 'Biomethane at the grid’s door'),
    subtitulo: () => L('As bacias dos pontos de entrega de gás e das subestações', 'The catchments of gas delivery points and substations'),
    descricao: () => L(
      `Cada célula de cerca de 1 km vai para o ponto de entrega de gás (ou a subestação da rede básica) mais próximo em linha reta; a bacia soma o potencial de biometano (${N4()})`,
      `Each cell of about 1 km goes to the nearest gas delivery point (or basic-grid substation) in a straight line; the catchment adds up the biomethane potential (${N4()})`),
    mapas: () => [
      {
        titulo: L('PONTOS DE ENTREGA · M³/DIA NA BACIA', 'DELIVERY POINTS · M³/DAY IN CATCHMENT'),
        preencher: () => PAPEL, bordaMunicipio: 0, semRgint: true, rasterSvg: rEnt, rasterRecorte: 'limite',
        pontos: pontos(ent, 3.6),
        chamadas: [{ ...ch(topE[0], 60, -185, L(['a maior bacia'], ['the largest catchment'])), titulo: `${semPE(topE[0].nome).toUpperCase()} · ${MIL(topE[0].biometano_m3d)}` }],
        legenda: faixa(CORES_BAC, rotMil(LIM_ENT), { larg: 64 }),
      },
      {
        titulo: L('SUBESTAÇÕES · M³/DIA NA BACIA', 'SUBSTATIONS · M³/DAY IN CATCHMENT'),
        preencher: () => PAPEL, bordaMunicipio: 0, semRgint: true, rasterSvg: rSe, rasterRecorte: 'limite',
        pontos: pontos(se, 2.6),
        chamadas: [{ ...ch(topS[0], 60, -170, L(['a maior bacia elétrica'], ['the largest power catchment'])), titulo: `${semSE(topS[0].nome).toUpperCase()} · ${MIL(topS[0].biometano_m3d)}` }],
        legenda: faixa(CORES_BAC, rotMil(LIM_SE), { larg: 64 }),
      },
      {
        titulo: L('PONTOS DE ENTREGA · SEM A CANA', 'DELIVERY POINTS · LEAVING OUT CANE'),
        preencher: () => PAPEL, bordaMunicipio: 0, semRgint: true, rasterSvg: rFora, rasterRecorte: 'limite',
        pontos: pontos(ent, 3.6),
        chamadas: [{ ...ch(topF[0], 120, 150, L(['a maior bacia fora da cana'], ['the largest catchment beyond cane'])), titulo: `${semPE(topF[0].nome).toUpperCase()} · ${MIL(topF[0].fora_da_cana_m3d)}` }],
        legenda: faixa(CORES_BAC, rotMil(LIM_FORA), { larg: 64 }),
      },
    ],
    quartoQuadro: (w) => {
      const s = [`<text x="0" y="0" font-family="${MONO}" font-size="13" letter-spacing="2.4" fill="${CINZA}">${esc(L('AS MAIORES BACIAS ELÉTRICAS (M³/DIA)', 'THE LARGEST POWER CATCHMENTS (M³/DAY)'))}</text>`];
      const x0 = 240, larg = w - x0 - 150;
      topS.slice(0, 6).forEach((b, i) => {
        const y = 22 + i * 22;
        const bw = (b.biometano_m3d / topS[0].biometano_m3d) * larg;
        s.push(`<text x="${x0 - 10}" y="${y + 11}" text-anchor="end" font-family="${SERIF}" font-size="15">${esc(semSE(b.nome))}</text>`);
        s.push(`<rect x="${x0}" y="${y + 1}" width="${f1(bw)}" height="12" fill="${CORES_BAC[4]}"/>`);
        s.push(`<text x="${f1(x0 + bw + 6)}" y="${y + 11}" font-family="${MONO}" font-size="12">${esc(`${grande(b.biometano_m3d)} · ${b.tensao} kV`)}</text>`);
      });
      const n = paragrafo(L(`${nf(nSe)} subestações da rede básica têm bacia no estado, contra ${nf(nEnt)} pontos de entrega de gás. Metade do potencial está a até ${S.mediana_km_se} km de uma subestação e a até ${S.mediana_km[0]} km de um ponto de entrega.`,
        `${nf(nSe)} basic-grid substations have a catchment in the state, against ${nf(nEnt)} gas delivery points. Half the potential lies within ${S.mediana_km_se} km of a substation and within ${S.mediana_km[0]} km of a delivery point.`), 0, 22 + 6 * 22 + 30, w, 15);
      s.push(n.svg);
      return s.join('\n');
    },
    numeros: () => [
      [pct(pT(topE[0].biometano_m3d), 0), [L(`do estado cai na bacia de`, `of the state falls in the`), L(`${semPE(topE[0].nome)}`, `${semPE(topE[0].nome)} catchment`)]],
      [pct(pT(cinco), 0), [L('nas bacias dos cinco', 'in the catchments of the'), L('maiores pontos de entrega', 'five largest delivery points')]],
      [mil(topF[0].fora_da_cana_m3d), [L(`m³/dia fora da cana em`, `m³/day beyond cane at`), L(`${semPE(topF[0].nome)}, o maior`, `${semPE(topF[0].nome)}, the largest`)]],
      [km(Math.round(topE[0].km_medio)), [L('em média do gás da maior', 'on average from the largest'), L('bacia até o seu ponto', 'catchment’s gas to its point')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('AS MAIORES BACIAS DE GÁS (M³/DIA)', 'THE LARGEST GAS CATCHMENTS (M³/DAY)'), y)];
      const x0 = 200, larg = LP - x0 - 170;
      let yy = y + 14;
      topE.slice(0, 8).forEach((b) => {
        const wT = (b.biometano_m3d / topE[0].biometano_m3d) * larg, wF = (b.fora_da_cana_m3d / topE[0].biometano_m3d) * larg;
        s.push(`<text x="${x0 - 10}" y="${yy + 11}" text-anchor="end" font-family="${SERIF}" font-size="14">${esc(semPE(b.nome).split(' / ')[0])}</text>`);
        s.push(`<rect x="${x0}" y="${yy + 2}" width="${f1(wT)}" height="11" fill="${GRUPO.cana.cor}"/><rect x="${x0}" y="${yy + 2}" width="${f1(Math.max(wF, 1))}" height="11" fill="${GRUPO.lavouras.cor}"/>`);
        s.push(`<text x="${f1(x0 + wT + 6)}" y="${yy + 11}" font-family="${MONO}" font-size="12">${esc(`${grande(b.biometano_m3d)} · ${nf(b.km_medio)} km`)}</text>`);
        yy += 19;
      });
      yy += 10;
      s.push(`<rect x="${x0}" y="${yy}" width="14" height="10" fill="${GRUPO.cana.cor}"/><text x="${x0 + 20}" y="${yy + 9}" font-family="${MONO}" font-size="11">${esc(L('cana', 'cane'))}</text>`);
      s.push(`<rect x="${x0 + 80}" y="${yy}" width="14" height="10" fill="${GRUPO.lavouras.cor}"/><text x="${x0 + 100}" y="${yy + 9}" font-family="${MONO}" font-size="11">${esc(L('fora da cana', 'beyond cane'))}</text>`);
      s.push(`<text x="${x0}" y="${yy + 26}" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L('km = distância média do biometano ao ponto', 'km = mean distance of biomethane to the point'))}</text>`);
      return { svg: s.join('\n'), y: yy + 36 };
    },
    fontes: () => [CP2B(), EPE(), MB(), MALHA()],
  });
}

/* ------------------------------------------------------------------ 4/4 disputa */
const CORES_COB = ['#f1e8d6', '#ddb986', '#b77b45', '#c6d9e2', '#88b0c6', '#3f7396'];
const AZUL = '#234e70', ARGILA = '#9c4a32';
function disputa() {
  const us = S.usinas;
  const anp = us.filter((u) => u.anp.length).map((u) => ({ ...u, cap: u.anp.reduce((a, p) => a + p.cap, 0) })).sort((a, b) => b.cap - a.cap);
  const [c0, c1, c2, c3] = S.cob_pot;
  const orf = S.orfaos[0];
  const mais = [...us].sort((a, b) => b.vizinhos.length - a.vizinhos.length || b.disputado / b.alcance - a.disputado / a.alcance)[0];
  const raioAnp = (v) => 5 + Math.sqrt(v / 130000) * 17;
  const raioGd = (kw) => 4 + Math.sqrt(kw / 8000) * 13;
  const codigo = (c) => { const n = lay.cob(c); if (n > 0) return 2 + Math.min(n, 3); const a = lay.alc(c); return a >= 300000 ? 2 : a >= S.ref_m3d ? 1 : 0; };
  return () => ({
    layout: 'um',
    motivo: friso,
    serie: serie(4),
    titulo: () => L('Disputa por resíduo', 'Competing for residue'),
    subtitulo: () => L('Onde as usinas dividem o raio de coleta, e onde o gás não tem usina', 'Where plants share a collection radius, and where the gas has no plant'),
    descricao: () => L(
      `Municípios com planta de biometano autorizada pela ANP ou geração distribuída a biogás registrada na ANEEL e quantos deles alcançam cada ponto num raio de 30 km, sobre o potencial de biometano a 30 km (${N4()})`,
      `Municipalities with an ANP-authorised biomethane plant or ANEEL-registered biogas distributed generation and how many of them reach each point within 30 km, over the biomethane potential within 30 km (${N4()})`),
    raster: { r: grade(codigo), modo: 'classes', cor: (k) => CORES_COB[k], recorte: 'limite', fator: 2 },
    mapa: () => ({
      preencher: () => PAPEL,
      bordaMunicipio: 0,
      pontos: [
        ...us.filter((u) => u.gd && !u.anp.length).map((u) => ({ coord: u.coord, r: raioGd(u.gd.kw), cor: ARGILA, anel: true, largura: 2.2 })),
        ...anp.map((u) => ({ coord: u.coord, r: raioAnp(u.cap), cor: AZUL, borda: PAPEL, opacidade: 0.9 })),
        ...anp.filter((u) => u.gd).map((u) => ({ coord: u.coord, r: raioAnp(u.cap) + 3.5, cor: ARGILA, anel: true, largura: 1.8 })),
      ],
      chamadas: [
        { coord: orf.coord, dx: 150, dy: -200, tamanho: 16, titulo: L(`${orf.NM_MUN.toUpperCase()} · ${MIL(orf.v)} M³/DIA`, `${orf.NM_MUN.toUpperCase()} · ${MIL(orf.v)} M³/DAY`), linhas: L(['a 30 km e nenhuma usina de', 'biometano ou GD a biogás por perto'], ['within 30 km and no biomethane', 'or biogas DG plant nearby']) },
        { coord: mais.coord, dx: -330, dy: 330, tamanho: 16, titulo: L(`${mais.nome.toUpperCase()} · ${nf(mais.vizinhos.length)} VIZINHOS`, `${mais.nome.toUpperCase()} · ${nf(mais.vizinhos.length)} NEIGHBOURS`), linhas: L(['com usina a menos de 60 km;', `${pct((100 * mais.disputado) / mais.alcance, 0)} do seu raio é dividido`], ['with plants within 60 km;', `${nf((100 * mais.disputado) / mais.alcance, 0)}% of its radius is shared`]) },
      ],
    }),
    numeros: () => [
      [pct(pT(c0), 0), [L('do potencial não tem usina', 'of the potential has no plant'), L('a até 30 km', 'within 30 km')]],
      [pct(pT(c2 + c3), 1), [L('está ao alcance de duas', 'is within reach of two'), L('usinas ou mais', 'plants or more')]],
      [nf(us.length), [L('municípios com usina:', 'municipalities with plants:'), L(`${anp.length} com biometano (ANP)`, `${anp.length} with biomethane (ANP)`)]],
      [pct((100 * anp[0].cap) / anp[0].alcance, 0), [L(`do potencial a 30 km de ${anp[0].nome}`, `of the potential within 30 km of`), L('é a capacidade da planta', `${anp[0].nome}: the plant’s capacity`)]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('BIOMETANO AUTORIZADO E O QUE HÁ A 30 KM', 'AUTHORISED BIOMETHANE AND WHAT LIES WITHIN 30 KM'), y)];
      const x0 = 190, larg = LP - x0 - 120;
      const mx = Math.max(...anp.map((u) => u.alcance));
      let yy = y + 14;
      for (const u of anp) {
        const wA = (u.alcance / mx) * larg, wC = (u.cap / mx) * larg;
        s.push(`<text x="${x0 - 10}" y="${yy + 12}" text-anchor="end" font-family="${SERIF}" font-size="14">${esc(u.nome)}</text>`);
        s.push(`<rect x="${x0}" y="${yy + 2}" width="${f1(wA)}" height="12" fill="${CORES_COB[3]}"/><rect x="${x0}" y="${yy + 5}" width="${f1(wC)}" height="6" fill="${AZUL}"/>`);
        s.push(`<text x="${f1(x0 + Math.max(wA, wC) + 6)}" y="${yy + 12}" font-family="${MONO}" font-size="12">${esc(pct((100 * u.cap) / u.alcance, 0))}</text>`);
        yy += 17;
      }
      s.push(`<text x="${x0}" y="${yy + 12}" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L('azul: capacidade autorizada; claro: potencial a 30 km', 'blue: authorised capacity; light: potential within 30 km'))}</text>`);
      yy += 38;
      s.push(rotuloPainel(L('MUNICÍPIOS COM USINA A ATÉ 30 KM', 'MUNICIPALITIES WITH PLANTS WITHIN 30 KM'), yy));
      yy += 24;
      const leg = [
        [CORES_COB[0], L(`nenhum, menos de ${nf(S.ref_m3d / 1000)} mil m³/dia a 30 km`, `none, under ${nf(S.ref_m3d / 1000)},000 m³/day within 30 km`)],
        [CORES_COB[1], L(`nenhum, ${nf(S.ref_m3d / 1000)} a 300 mil m³/dia`, `none, ${nf(S.ref_m3d / 1000)},000 to 300,000 m³/day`)],
        [CORES_COB[2], L('nenhum, mais de 300 mil m³/dia', 'none, over 300,000 m³/day')],
        [CORES_COB[3], L('um', 'one')], [CORES_COB[4], L('dois', 'two')], [CORES_COB[5], L('três ou mais', 'three or more')],
      ];
      const vals = [null, null, pct(pT(c0), 0), pct(pT(c1), 0), pct(pT(c2), 0), pct(pT(c3), 1)];
      leg.forEach(([cor, t], i) => {
        s.push(caixaLegenda(cor, t, yy));
        if (vals[i]) s.push(`<text x="${LP}" y="${yy}" text-anchor="end" font-family="${MONO}" font-size="13">${esc(vals[i])}</text>`);
        yy += 21;
      });
      s.push(`<text x="${LP}" y="${yy - 4}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L('parte do potencial do estado (os três «nenhum» somados)', 'share of the state’s potential (the three “none” added)'))}</text>`);
      yy += 22;
      const lc = legendaCirculos([130000, 30000], raioAnp, (v) => L(`${nf(v / 1000)} mil m³/dia`, `${nf(v / 1000)},000 m³/day`), { y: yy, cor: AZUL, tamanho: 13 });
      s.push(lc.svg);
      const lg = legendaCirculos([5000, 500], raioGd, (v) => `${nf(v / 1000, v < 1000 ? 1 : 0)} MW`, { x: LP / 2 + 40, y: yy + 2 * (raioAnp(130000) - raioGd(5000)), cor: ARGILA, tamanho: 13 });
      s.push(lg.svg);
      yy += 2 * raioAnp(130000) + 20;
      s.push(`<text x="0" y="${yy}" font-family="${SERIF}" font-size="14">${esc(L('biometano autorizado (ANP)', 'authorised biomethane (ANP)'))}</text>`);
      s.push(`<text x="${LP / 2 + 40}" y="${yy}" font-family="${SERIF}" font-size="14">${esc(L('GD a biogás (ANEEL)', 'biogas DG (ANEEL)'))}</text>`);
      return { svg: s.join('\n'), y: yy + 8 };
    },
    fontes: () => [L(`ANP, biometano, ${S.mes_anp}`, `ANP, biomethane, ${S.mes_anp}`), L(`ANEEL, geração distribuída, ${S.gd_ref}`, `ANEEL, distributed generation, ${S.gd_ref}`), CP2B(), MB()],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { alcance, curva, bacias, disputa };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/suprimento-sp/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
const e = SERIE.find((s) => s.tema === nome);
const fazer = await TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => fazer() });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `suprimento-sp-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
