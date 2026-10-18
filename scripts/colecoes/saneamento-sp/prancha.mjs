#!/usr/bin/env node
/**
 * Coleção «Saneamento e biometano» — desenha uma prancha a partir do cache de preparar.mjs (uso interno).
 *
 *   node scripts/colecoes/saneamento-sp/prancha.mjs esgoto|destino|lixo|municipios
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { RAIZ, LP, SERIF, MONO, TINTA, CINZA, esc, nf, f1, largura, gerarPrancha, rotuloPainel, legendaFaixa } from '../lib/prancha-sp.mjs';
import { lerRaster } from '../lib/raster.mjs';
import { L, NEUTRO, ZERO, HACHURA, pct, grande, barras, legendaBarras, caixaLegenda, legendaCategorias, fita } from '../lib/painel.mjs';

const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'saneamento-sp', 'serie.json'), 'utf8'));
const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `saneamento-sp-${nome}.json`), 'utf8'));
const serie = (i) => () => L(`SANEAMENTO E BIOMETANO · ${i}/4`, `SANITATION AND BIOMETHANE · ${i}/4`);
const FONTES_SETOR = () => [
  L('IBGE, Censo 2022: agregados por setor', 'IBGE, 2022 Census: tract aggregates'),
  L('IBGE, Censo 2022: SIDRA 6805 e 6892', 'IBGE, 2022 Census: SIDRA 6805 and 6892'),
  L('IBGE, Malha de Setores 2022', 'IBGE, 2022 Census Tract Mesh'),
];
/** Camada de hachura dos setores sem informação (classe dependente de um valor em sigilo). */
const semInfo = (c) => ({ feats: c.semInfoFeats, hachura: HACHURA, borda: 'none' });
const mapaSetores = (c, extra = {}) => ({
  preencher: () => NEUTRO,
  bordaMunicipio: 0,
  bordaSobreRaster: '#ffffff',
  larguraSobreRaster: 0.45,
  opacidadeSobreRaster: 0.8,
  bordaRgint: 1.5,
  camadas: [semInfo(c)],
  ...extra,
});
const rotulosRede = () => L(['até 10 %', '10 a 50 %', '50 a 80 %', '80 a 95 %', '95 a 99 %', 'mais de 99 %'], ['up to 10%', '10 to 50%', '50 to 80%', '80 to 95%', '95 to 99%', 'over 99%']);

/* ------------------------------------------------------------------ 1/4 esgoto na rede */
async function esgoto() {
  const c = await ler('esgoto');
  const r = await lerRaster('grade-saneamento-sp-esgoto');
  const corDe = (v) => (v >= 1 && v <= 6 ? c.cores[v - 1] : v === 253 ? ZERO : null);
  const dom = c.dom_por_classe;
  const totDom = dom.reduce((a, b) => a + b, 0);
  const d = c.destaque;
  return () => ({
    layout: 'um',
    motivo: 'saneamento',
    serie: serie(1),
    raster: { r, modo: 'classes', cor: corDe, recorte: 'limite', fator: 2 },
    titulo: () => L('Esgoto na rede', 'Sewage on the mains'),
    subtitulo: () => L('A rede cobre a cidade; o campo fica na fossa', 'The mains cover the city; the countryside stays on the tank'),
    descricao: () => L(
      `Parte dos domicílios particulares permanentes ocupados de cada setor censitário com o esgoto na rede geral, na rede pluvial ou em fossa ligada à rede, Censo 2022 (${nf(c.n_setores)} setores)`,
      `Share of each census tract’s occupied permanent private households whose sewage goes to the mains, the storm drain or a tank linked to the mains, 2022 Census (${nf(c.n_setores)} tracts)`),
    mapa: () => mapaSetores(c, {
      chamadas: [{
        cd: d.CD_MUN, dx: -250, dy: 250, tamanho: 16,
        titulo: L(`${d.NM_MUN.toUpperCase()} · ${nf(d.pct_fora, 0)} % FORA DA REDE`, `${d.NM_MUN.toUpperCase()} · ${nf(d.pct_fora, 0)}% OFF THE MAINS`),
        linhas: L([`${nf(d.fora)} domicílios: a maior parte`, 'entre as cidades com mais de 20 mil'], [`${nf(d.fora)} homes: the largest share`, 'among towns with over 20,000']),
      }],
    }),
    numeros: () => [
      [pct(c.uf.pct_rede, 1), [L('dos domicílios com esgoto', 'of homes with sewage'), L('na rede ou fossa ligada', 'on the mains or a linked tank')]],
      [grande(c.uf.fora), [L('domicílios fora da rede', 'homes off the mains')]],
      [nf(c.setores_por_classe[0]), [L('setores com até 10 %', 'tracts with up to 10%'), L(`na rede: ${grande(dom[0])} domicílios`, `on the mains: ${grande(dom[0])} homes`)]],
      [nf(c.fora_abs[0].fora), [L('domicílios fora da rede', 'homes off the mains'), L('na cidade de São Paulo', 'in the city of São Paulo')]],
    ],
    painel: (y) => {
      const itens = c.cores.map((k, i) => [k, rotulosRede()[i], dom[i], totDom]);
      const lg = legendaBarras(itens, y, { titulo: L('DOMICÍLIOS LIGADOS À REDE NO SETOR', 'HOMES ON THE MAINS IN THE TRACT'), rotuloValor: L('parte dos domicílios do estado', 'share of the state’s homes') });
      let yy = lg.y + 4;
      const s = [lg.svg, caixaLegenda(ZERO, L('setor sem domicílio ocupado', 'tract with no occupied home'), yy)];
      yy += 25;
      s.push(caixaLegenda(null, L(`sem informação (${nf(c.sem_info)} setores)`, `no data (${nf(c.sem_info)} tracts)`), yy, { hachura: true }));
      yy += 42;
      s.push(rotuloPainel(L('MAIS DOMICÍLIOS FORA DA REDE', 'MOST HOMES OFF THE MAINS'), yy));
      const b = barras(c.fora_abs.map((m) => [m.NM_MUN, m.fora, '#a8653a']), yy + 14, { max: c.fora_abs[0].fora, sufixo: '' });
      s.push(b.svg);
      return { svg: s.join('\n'), y: b.y + 6 };
    },
    fontes: FONTES_SETOR,
  });
}

/* ------------------------------------------------------------------ 2/4 destino predominante */
async function destino() {
  const c = await ler('destino');
  const r = await lerRaster('grade-saneamento-sp-destino');
  const corDe = (v) => (v >= 1 && v <= c.destinos.length ? c.destinos[v - 1].cor : v === 253 ? ZERO : null);
  const totUf = Object.values(c.uf).reduce((a, b) => a + b, 0);
  const areaTot = c.area.reduce((a, b) => a + b, 0);
  const iRud = c.destinos.findIndex((x) => x.k === 'rudimentar');
  const iRede = c.destinos.findIndex((x) => x.k === 'rede');
  const rio = c.rio_top[0];
  return () => ({
    layout: 'um',
    motivo: 'saneamento',
    serie: serie(2),
    raster: { r, modo: 'classes', cor: corDe, recorte: 'limite', fator: 2 },
    titulo: () => L('Para onde vai o esgoto', 'Where the sewage goes'),
    subtitulo: () => L('Rede na cidade, fossa no campo, rio na beira', 'Mains in town, pits in the country, rivers at the edge'),
    descricao: () => L(
      'Destino do esgoto da maioria dos domicílios particulares permanentes ocupados de cada setor censitário, Censo 2022',
      'Where the sewage of most occupied permanent private households in each census tract goes, 2022 Census'),
    mapa: () => mapaSetores(c, {
      chamadas: [{
        cd: rio.CD_MUN, dx: 230, dy: 240, tamanho: 16,
        titulo: L(`${nf(rio.rio)} DOMICÍLIOS`, `${nf(rio.rio)} HOMES`),
        linhas: L(['na capital lançam o esgoto', 'em rio, córrego, lago ou mar'], ['in the capital send sewage', 'into a river, stream, lake or sea']),
      }],
    }),
    numeros: () => [
      [pct((100 * c.area[iRud]) / areaTot, 0), [L('da área dos setores tem a', 'of the tracts’ area has'), L('fossa rudimentar à frente', 'rudimentary pits in the lead')]],
      [pct((100 * c.area[iRede]) / areaTot, 0), [L('da área tem a rede à frente,', 'of the area has the mains ahead,'), L(`com ${pct((100 * c.dom[iRede]) / c.dom.reduce((a, b) => a + b, 0), 0)} dos domicílios`, `with ${pct((100 * c.dom[iRede]) / c.dom.reduce((a, b) => a + b, 0), 0)} of homes`)]],
      [grande(c.uf.rudimentar), [L('domicílios com fossa', 'homes with a'), L('rudimentar ou buraco', 'rudimentary pit or hole')]],
      [grande(c.uf_detalhe['Rio, lago, córrego ou mar']), [L('domicílios lançam em rio,', 'homes discharge into a river,'), L('lago, córrego ou mar', 'lake, stream or sea')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('DESTINO À FRENTE NO SETOR', 'LEADING DESTINATION IN THE TRACT'), y)];
      y += 18;
      s.push(fita(c.destinos.map((x, i) => [(100 * c.area[i]) / areaTot, x.cor]), y));
      s.push(`<text x="${LP}" y="${y + 40}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${CINZA}">${L('parte da área dos setores', 'share of the tracts’ area')}</text>`);
      y += 70;
      const lg = legendaCategorias(c.destinos.map((x) => [x.cor, L(x.pt, x.en), grande(c.uf[x.k])]), y, { direita: L('domicílios no estado (SIDRA 6805)', 'homes in the state (SIDRA 6805)') });
      s.push(lg.svg);
      y = lg.y + 10;
      s.push(caixaLegenda(ZERO, L('setor sem domicílio ocupado', 'tract with no occupied home'), y));
      y += 25;
      s.push(caixaLegenda(null, L(`empate ou sem informação (${nf(c.sem_info)} setores)`, `tie or no data (${nf(c.sem_info)} tracts)`), y, { hachura: true }));
      y += 42;
      s.push(rotuloPainel(L('ESGOTO EM RIO, LAGO, CÓRREGO OU MAR', 'SEWAGE INTO RIVERS, LAKES, STREAMS OR SEA'), y));
      const b = barras(c.rio_top.map((m) => [m.NM_MUN, m.rio, c.destinos[3].cor]), y + 14, { max: c.rio_top[0].rio, sufixo: '' });
      s.push(b.svg);
      return { svg: s.join('\n'), y: b.y + 6 };
    },
    fontes: FONTES_SETOR,
  });
}

/* ------------------------------------------------------------------ 3/4 lixo fora da coleta */
async function lixo() {
  const c = await ler('lixo');
  const r = await lerRaster('grade-saneamento-sp-lixo');
  const corDe = (v) => (v >= 1 && v <= c.cores.length ? c.cores[v - 1] : v === 252 || v === 253 ? ZERO : null);
  const totDom = c.dom.reduce((a, b) => a + b, 0);
  const rot = L(['até 1 %', '1 a 5 %', '5 a 20 %', '20 a 50 %', 'mais de 50 %'], ['up to 1%', '1 to 5%', '5 to 20%', '20 to 50%', 'over 50%']);
  const topo = c.pct_top[0];
  return () => ({
    layout: 'um',
    motivo: 'saneamento',
    serie: serie(3),
    raster: { r, modo: 'classes', cor: corDe, recorte: 'limite', fator: 2 },
    titulo: () => L('Lixo fora da coleta', 'Rubbish outside collection'),
    subtitulo: () => L('Onde o caminhão não passa, o lixo queima', 'Where the truck does not pass, rubbish burns'),
    descricao: () => L(
      'Parte dos domicílios particulares permanentes ocupados de cada setor censitário que queimam, enterram ou jogam o lixo em terreno baldio, encosta ou área pública, ou lhe dão outro destino, Censo 2022',
      'Share of each census tract’s occupied permanent private households that burn or bury their rubbish, dump it on vacant land, slopes or public areas, or dispose of it otherwise, 2022 Census'),
    mapa: () => mapaSetores(c, {
      chamadas: [{
        cd: topo.CD_MUN, dx: 120, dy: 300, tamanho: 16,
        titulo: L(`${topo.NM_MUN.toUpperCase()} · ${nf(topo.pct_fora, 0)} %`, `${topo.NM_MUN.toUpperCase()} · ${nf(topo.pct_fora, 0)}%`),
        linhas: L(['a maior parte de domicílios', 'com lixo fora da coleta'], ['the largest share of homes', 'with rubbish outside collection']),
      }],
    }),
    numeros: () => [
      [pct((100 * c.uf.fora) / c.uf.total, 2), [L('dos domicílios do estado', 'of the state’s homes'), L(`(${grande(c.uf.fora)}) sem coleta`, `(${grande(c.uf.fora)}) without collection`)]],
      [grande(c.uf.queimado), [L('domicílios queimam', 'homes burn their'), L('o lixo na propriedade', 'rubbish on the property')]],
      [nf(c.setores[5]), [L('setores com mais da metade', 'tracts where over half'), L('do lixo fora da coleta', 'of rubbish is uncollected')]],
      [pct((100 * c.dom[0]) / totDom, 0), [L('dos domicílios vivem em setores', 'of homes are in tracts where'), L('com coleta para todos', 'everyone has collection')]],
    ],
    painel: (y) => {
      const itens = c.cores.map((k, i) => [k, rot[i], c.dom[i + 1], totDom]);
      const lg = legendaBarras(itens, y, { titulo: L('DOMICÍLIOS COM LIXO FORA DA COLETA', 'HOMES WITH UNCOLLECTED RUBBISH'), rotuloValor: L('parte dos domicílios do estado', 'share of the state’s homes') });
      let yy = lg.y + 4;
      const s = [lg.svg, caixaLegenda(ZERO, L(`nenhum, ou setor sem domicílio (${pct((100 * c.dom[0]) / totDom, 0)})`, `none, or tract with no home (${pct((100 * c.dom[0]) / totDom, 0)})`), yy)];
      yy += 25;
      s.push(caixaLegenda(null, L(`sem informação (${nf(c.sem_info)} setores)`, `no data (${nf(c.sem_info)} tracts)`), yy, { hachura: true }));
      yy += 42;
      s.push(rotuloPainel(L('O QUE SE FAZ COM O LIXO NÃO COLETADO', 'WHAT HAPPENS TO UNCOLLECTED RUBBISH'), yy));
      const it = [
        [L('queimado', 'burnt'), c.uf.queimado], [L('outro destino', 'other'), c.uf.outro],
        [L('terreno baldio, encosta', 'vacant land, slope'), c.uf.terreno], [L('enterrado', 'buried'), c.uf.enterrado],
      ];
      const b = barras(it.map(([n, v]) => [n, v, c.cores[3], nf(v)]), yy + 14, { max: it[0][1], x0: 220 });
      s.push(b.svg);
      return { svg: s.join('\n'), y: b.y + 6 };
    },
    fontes: FONTES_SETOR,
  });
}

/* ------------------------------------------------------------------ 4/4 municípios × biometano */
async function municipios() {
  const c = await ler('municipios');
  const por = new Map(c.linhas.map((l) => [l.CD_MUN, l]));
  const CORES_FORA = ['#f3ecd4', '#e2c98a', '#c99a52', '#a8653a', '#7a3b2c', '#4a2420'];
  const CORES_LODO = ['#e6f0ef', '#b9d6d3', '#82b5b4', '#4f8f95', '#2a6874', '#16414d'];
  const GRUPOS = [
    ['rede_lodo', '#234e70', 'rede ≥ 90 % · com lodo', 'mains ≥ 90% · sludge'],
    ['rede_sem_lodo', '#9dbdcc', 'rede ≥ 90 % · lodo zero', 'mains ≥ 90% · no sludge'],
    ['falta_lodo', '#c08a2e', 'rede < 90 % · com lodo', 'mains < 90% · sludge'],
    ['falta_sem_lodo', '#9c4a32', 'rede < 90 % · lodo zero', 'mains < 90% · no sludge'],
  ];
  const corGrupo = new Map(GRUPOS.map(([k, cor]) => [k, cor]));
  const cls = (v, lim) => { if (v === null || v === undefined) return null; if (v === 0) return -1; let i = 0; while (i < lim.length - 1 && v > lim[i]) i++; return i; };
  const limFora = [...c.lim_fora, 100];
  const casas = (v) => (v < 10 ? 1 : 0);
  const g = c.grupos;
  const sp = por.get('3550308');
  return () => ({
    layout: 'quatro',
    motivo: 'saneamento',
    serie: serie(4),
    titulo: () => L('Esgoto, rede e biometano', 'Sewage, mains and biomethane'),
    subtitulo: () => L('O gás do lodo só existe onde o esgoto chega à estação', 'Sludge gas only exists where sewage reaches the plant'),
    descricao: () => L(
      `Domicílios fora da rede de esgoto (Censo 2022) e biometano do lodo de esgoto no método CP2B v5.1, nível N4 (acessível), cenário de referência, por município`,
      `Homes off the sewer mains (2022 Census) and sewage-sludge biomethane in the CP2B v5.1 method, level N4 (accessible), reference scenario, by municipality`),
    mapas: () => [
      {
        titulo: L('FORA DA REDE DE ESGOTO · % DOS DOMICÍLIOS', 'OFF THE SEWER MAINS · % OF HOMES'),
        preencher: (cd) => { const k = cls(por.get(cd)?.pct_esgoto_fora, limFora); return k === null ? null : k < 0 ? ZERO : CORES_FORA[k]; },
        legenda: legendaFaixa(CORES_FORA, c.lim_fora.map((v) => nf(v)), { larg: 58, id: 'lfs0' }),
      },
      {
        titulo: L('BIOMETANO DO LODO · M³/DIA', 'SLUDGE BIOMETHANE · M³/DAY'),
        preencher: (cd) => { const k = cls(por.get(cd)?.biometano_lodo_m3d, c.lim_lodo); return k === null ? null : k < 0 ? ZERO : CORES_LODO[k]; },
        legenda: legendaFaixa(CORES_LODO, c.lim_lodo.slice(0, -1).map((v) => nf(v, casas(v))), { larg: 58, id: 'lfs1', semInfo: false }),
        chamadas: [{ cd: '3550308', dx: -40, dy: 190, tamanho: 14, titulo: L(`${nf(sp.biometano_lodo_m3d / 1000, 0)} MIL M³/DIA`, `${nf(sp.biometano_lodo_m3d / 1000, 0)} THOUSAND M³/DAY`), linhas: L([`São Paulo: ${pct((100 * sp.biometano_lodo_m3d) / c.tot.lodo, 0)} do lodo`], [`São Paulo: ${pct((100 * sp.biometano_lodo_m3d) / c.tot.lodo, 0)} of sludge`]) }],
      },
      {
        titulo: L('REDE (META DE 90 %) × LODO', 'MAINS (90% TARGET) × SLUDGE'),
        preencher: (cd) => corGrupo.get(por.get(cd)?.grupo) ?? null,
        legenda: GRUPOS.map(([, cor, pt, en], i) => `<rect x="${(i % 2) * 380}" y="${Math.floor(i / 2) * 26 - 12}" width="30" height="16" fill="${cor}" stroke="#1a211a" stroke-width=".6"/><text x="${(i % 2) * 380 + 42}" y="${Math.floor(i / 2) * 26 + 2}" font-family="${SERIF}" font-size="16">${esc(L(pt, en))}</text>`).join(''),
      },
    ],
    quartoQuadro: (w) => {
      const s = [`<text x="0" y="0" font-family="${MONO}" font-size="13" letter-spacing="2.4" fill="${CINZA}">${L('QUANTA GENTE EM CADA GRUPO', 'HOW MANY PEOPLE IN EACH GROUP')}</text>`];
      let y = 30;
      const max = Math.max(...GRUPOS.map(([k]) => g[k].pessoas));
      for (const [k, cor, pt, en] of GRUPOS) {
        const v = g[k];
        s.push(`<text x="0" y="${y + 12}" font-family="${SERIF}" font-size="16">${esc(L(pt, en))}</text>`);
        const bw = (v.pessoas / max) * (w - 330);
        s.push(`<rect x="250" y="${y}" width="${f1(Math.max(bw, 1))}" height="14" fill="${cor}"/>`);
        s.push(`<text x="${f1(250 + bw + 8)}" y="${y + 12}" font-family="${MONO}" font-size="13">${esc(grande(v.pessoas))}</text>`);
        s.push(`<text x="0" y="${y + 32}" font-family="${MONO}" font-size="12" fill="${CINZA}">${esc(L(`${nf(v.n)} municípios · ${grande(v.fora)} domicílios fora da rede`, `${nf(v.n)} municipalities · ${grande(v.fora)} homes off the mains`))}</text>`);
        y += 58;
      }
      const t = 15;
      const txt = L(
        `A meta de 90 % é a do marco legal do saneamento (Lei 14.026/2020) para 2033. O Censo mede a ligação à rede, não o tratamento. O CP2B só conta o lodo onde há coleta, tratamento e estação compatível com digestão: ${nf(c.com_lodo)} municípios.`,
        `The 90% target is the one set by Brazil’s sanitation framework law (Law 14,026/2020) for 2033. The Census measures connection to the mains, not treatment. CP2B counts sludge only where there is collection, treatment and a plant suited to digestion: ${nf(c.com_lodo)} municipalities.`);
      const ls = [];
      let atual = '';
      for (const p of txt.split(' ')) { const tt = atual ? `${atual} ${p}` : p; if (largura(tt, t) > w && atual) { ls.push(atual); atual = p; } else atual = tt; }
      ls.push(atual);
      y += 6;
      ls.forEach((l, i) => s.push(`<text x="0" y="${y + i * 21}" font-family="${SERIF}" font-style="italic" font-size="${t}" fill="#4f4a41">${esc(l)}</text>`));
      return s.join('\n');
    },
    numeros: () => [
      [nf(c.abaixo_meta), [L('municípios abaixo de 90 %', 'municipalities below 90%'), L('de domicílios na rede', 'of homes on the mains')]],
      [nf(c.com_lodo), [L('municípios com lodo', 'municipalities with sludge'), L('no potencial do CP2B', 'in the CP2B potential')]],
      [L(`${nf(c.tot.lodo / 1000, 0)} mil m³`, `${nf(c.tot.lodo / 1000, 0)} thousand m³`), [L('de biometano por dia', 'of biomethane a day'), L('do lodo de esgoto', 'from sewage sludge')]],
      [grande(g.falta_sem_lodo.pessoas), [L('pessoas em municípios', 'people in municipalities'), L('abaixo da meta e sem lodo', 'below target, no sludge')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('MAIS BIOMETANO DO LODO (M³/DIA)', 'MOST SLUDGE BIOMETHANE (M³/DAY)'), y)];
      const b = barras(c.lodo_top.map((m) => [m.NM_MUN, m.v, CORES_LODO[4]]), y + 14, { max: c.lodo_top[0].v, sufixo: '' });
      s.push(b.svg);
      return { svg: s.join('\n'), y: b.y + 6 };
    },
    fontes: () => [
      L('IBGE, Censo 2022: SIDRA 6805', 'IBGE, 2022 Census: SIDRA 6805'),
      L(`CP2B (Unicamp), método v5.1, 2026`, `CP2B (Unicamp), method v5.1, 2026`),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { esgoto, destino, lixo, municipios };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/saneamento-sp/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
const e = SERIE.find((s) => s.tema === nome);
const fazer = await TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => fazer() });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `saneamento-sp-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
