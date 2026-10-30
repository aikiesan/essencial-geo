#!/usr/bin/env node
/**
 * Coleção «Bioenergia cruzada» — desenha uma prancha a partir do cache de preparar.mjs (uso interno).
 * Uma prancha, um mapa: nada de painéis secundários.
 *
 *   node scripts/colecoes/bioenergia-cruzada-sp/prancha.mjs cana|diesel|eucalipto|esterco|pequenos
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { RAIZ, LP, SERIF, MONO, TINTA, CINZA, esc, nf, largura, gerarPrancha, rotuloPainel } from '../lib/prancha-sp.mjs';
import { L, NEUTRO, barras, caixaLegenda, nota } from '../lib/painel.mjs';
import { BIV, LIM_DIESEL, COR_DIESEL, COR_115, LIM_POP_115, LIM_KM_115, classe } from './preparar.mjs';

const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'bioenergia-cruzada-sp', 'serie.json'), 'utf8'));
const C = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', 'bioenergia-cruzada-sp.json'), 'utf8'));
const POR = new Map(C.mun.map((m) => [m.CD_MUN, m]));
const ORDEM = Object.fromEntries(SERIE.map((s, i) => [s.tema, i + 1]));
const serie = (t) => () => L(`BIOENERGIA CRUZADA · ${ORDEM[t]}/${SERIE.length}`, `BIOENERGY, CROSSED · ${ORDEM[t]}/${SERIE.length}`);

/** Decimal com o sinal de menos tipográfico. */
const dec = (v, c = 2) => nf(v, c).replace('-', '−');
const pc = (v, c = 0) => L(`${nf(v, c)} %`, `${nf(v, c)}%`);
const pTxt = (p) => (p < 0.001 ? L('< 0,001', '< 0.001') : nf(p, 3));
const mun = (nome) => C.mun.find((m) => m.NM_MUN === nome);
const mil = (v) => L(`${nf(Math.round(v / 1e3))} mil`, `${nf(Math.round(v / 1e3))} thousand`);

const FONTE_MALHA = () => L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025');
const FONTE_SEMIL = () => L('SEMIL/SP, Anuário de Energéticos por Município 2025', 'SEMIL/SP, Municipal Energy Yearbook 2025');
const FONTE_CP2B = () => L('CP2B (Unicamp), v5.1, N4, cenário de referência', 'CP2B (Unicamp), v5.1, N4, reference scenario');
const ECOLOGICA = () => L(
  'Leitura ecológica: o mapa compara municípios, não pessoas nem fazendas, e a correlação não diz o que causa o quê.',
  'Ecological reading: the map compares municipalities, not people or farms, and correlation does not say what causes what.');
const VENDA = () => L(
  'Venda não é consumo: o Anuário conta o que os postos e distribuidoras do município vendem, inclusive a quem só passa pela estrada.',
  'Sales are not consumption: the Yearbook counts what the municipality’s filling stations and distributors sell, including to people just driving through.');
const MODELO = () => L(
  'O CP2B é um modelo: o potencial é uma estimativa do que os resíduos renderiam, não biometano produzido.',
  'CP2B is a model: the potential estimates what the residues would yield, not biomethane actually produced.');

const chamada = (m, dx, dy, titulo, linhas, tamanho = 16) => ({ cd: m.CD_MUN, dx, dy, tamanho, titulo, linhas });

/** Linhas de rótulo e valor (valor alinhado à direita). */
function quadro(linhas, y, { titulo, passo = 19 } = {}) {
  const s = [];
  if (titulo) { s.push(rotuloPainel(titulo, y)); y += 24; }
  for (const [rot, v, destaque] of linhas) {
    s.push(`<text x="0" y="${y}" font-family="${SERIF}" font-size="15"${destaque ? ' font-weight="bold"' : ''}>${esc(rot)}</text>`);
    s.push(`<text x="${LP}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="13.5">${esc(v)}</text>`);
    s.push(`<path d="M0 ${y + 6}H${LP}" stroke="#d9dcde" stroke-width=".6"/>`);
    y += passo;
  }
  return { svg: s.join('\n'), y };
}

/** Legenda em coluna, com a contagem à direita: [[cor | 'hachura', rótulo, n]]. */
function legenda(itens, y, { titulo, unidade, passo = 24 }) {
  const s = [rotuloPainel(titulo, y)];
  y += 26;
  for (const [cor, rot, n] of itens) {
    s.push(cor === 'hachura' ? caixaLegenda(null, rot, y, { hachura: true }) : `<rect x="0" y="${y - 14}" width="30" height="17" fill="${cor}" stroke="#1a211a" stroke-width=".6"/><text x="42" y="${y}" font-family="${SERIF}" font-size="16">${esc(rot)}</text>`);
    if (n != null) s.push(`<text x="${LP}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="13">${esc(`${nf(n)} ${unidade}`)}</text>`);
    y += passo;
  }
  return { svg: s.join('\n'), y: y + 4 };
}

/** Grade 3 × 3 com o número de municípios em cada casa, setas dos eixos e os limites dos terços (sem `casas`, só as cores). */
function grade(casas, y, cfg) {
  const s = [rotuloPainel(cfg.titulo, y)];
  const q = 44, x0 = 116, y0 = y + 28;
  for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) {
    const xx = x0 + b * q, yy = y0 + (2 - a) * q;
    s.push(`<rect x="${xx}" y="${yy}" width="${q}" height="${q}" fill="${BIV[a][b]}" stroke="#ffffff" stroke-width="1"/>`);
    if (casas) s.push(`<text x="${xx + q / 2}" y="${yy + q / 2 + 5}" text-anchor="middle" font-family="${MONO}" font-size="13" fill="${a === 2 || (a === 1 && b === 2) ? '#ffffff' : TINTA}">${casas[a][b]}</text>`);
  }
  s.push(`<path d="M${x0} ${y0 + 3 * q + 10}h${3 * q}" stroke="${TINTA}" stroke-width="1"/><path d="M${x0 + 3 * q - 6} ${y0 + 3 * q + 6}l6 4l-6 4" fill="none" stroke="${TINTA}"/>`);
  s.push(`<text x="${x0 + 1.5 * q}" y="${y0 + 3 * q + 30}" text-anchor="middle" font-family="${MONO}" font-size="12">${esc(`${cfg.eixoX} →`)}</text>`);
  s.push(`<path d="M${x0 - 10} ${y0 + 3 * q}v${-3 * q}" stroke="${TINTA}" stroke-width="1"/><path d="M${x0 - 14} ${y0 + 6}l4 -6l4 6" fill="none" stroke="${TINTA}"/>`);
  s.push(`<text x="${x0 - 22}" y="${y0 + 1.5 * q}" text-anchor="middle" font-family="${MONO}" font-size="12" transform="rotate(-90 ${x0 - 22} ${y0 + 1.5 * q})">${esc(`${cfg.eixoY} →`)}</text>`);
  const tx = x0 + 3 * q + 30;
  const lin = [...cfg.terX, '', ...cfg.terY, ...(cfg.unidade ? ['', cfg.unidade] : [])];
  lin.forEach((l, k) => s.push(`<text x="${tx}" y="${y0 + 10 + k * 15}" font-family="${MONO}" font-size="12" fill="${CINZA}">${esc(l)}</text>`));
  const larg = Math.max(largura(cfg.titulo, 15, { mono: true, espaco: 2.4 }), tx + Math.max(...lin.map((l) => largura(l, 12, { mono: true }))));
  return { svg: s.join('\n'), y: Math.max(y0 + 3 * q + 50, y0 + 10 + lin.length * 15 + 8), largura: larg };
}

/** Legenda da figura de reuso: a grade sem as contagens e, se o mapa tem hachura, o «sem dado». */
function legendaGrade(cfg, semDado = null) {
  const g = grade(null, 0, cfg);
  if (!semDado) return { svg: g.svg, altura: g.y, largura: g.largura };
  return { svg: `${g.svg}\n${caixaLegenda(null, semDado, g.y + 16, { hachura: true })}`, altura: g.y + 24, largura: Math.max(g.largura, 42 + largura(semDado, 16)) };
}

const CONTROLE_NOME = () => ({ pct_urbana: L('urbanização', 'urbanisation'), log_densidade: L('densidade', 'density'), log_renda_pc: L('renda', 'income') });
const listaE = (xs, e) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ${e} ${xs.at(-1)}`);
const controles = (e) => { const n = CONTROLE_NOME(); const xs = e.controles.map((c) => n[c]); return L(listaE(xs, 'e'), listaE(xs, 'and')); };
const rp = (t) => `${dec(t.rho)} · ${L('parcial', 'partial')} ${dec(t.parcial)}`;

/** Bloco «como se relacionam» de um par municipal. */
function relacao(e, y, extras = [], { semForaSp = false } = {}) {
  const linhas = [
    [L('correlação de postos (Spearman)', 'rank correlation (Spearman)'), `${dec(e.rho)} · ${nf(e.n)} mun.`, true],
    [L(`parcial, descontadas ${controles(e)}`, `partial, net of ${controles(e)}`), dec(e.parcial)],
    [L('amostra efetiva, com a autocorrelação', 'effective sample, given autocorrelation'), `${nf(e.n_eff)} · p ${pTxt(e.p_eff)}`],
    ...(semForaSp ? [] : [[L('parcial fora da região de São Paulo', 'partial outside the São Paulo region'), dec(e.sem_rgint_sp)]]),
    [L('Moran bivariado (6 vizinhos)', 'bivariate Moran (6 neighbours)'), dec(e.lisa.moran_biv)],
    [L('aglomerados LISA alto-alto · baixo-baixo', 'LISA clusters high-high · low-low'), `${e.lisa.AA} · ${e.lisa.BB}`],
    ...extras,
  ];
  return quadro(linhas, y, { titulo: L('COMO SE RELACIONAM', 'HOW THEY RELATE') });
}

/** Rótulos dos terços: "até a", "a a b", "mais de b". */
const tercos = (nomePt, nomeEn, t, fmt) => L(
  [`terços de ${nomePt}:`, `até ${fmt(t[0])}, ${fmt(t[0])} a ${fmt(t[1])}`, `e mais de ${fmt(t[1])}`],
  [`thirds of ${nomeEn}:`, `up to ${fmt(t[0])}, ${fmt(t[0])} to ${fmt(t[1])}`, `and over ${fmt(t[1])}`]);
const fPct = (c = 0) => (v) => L(`${nf(v, c)} %`, `${nf(v, c)}%`);
const casaCor = (k) => (cd) => { const b = POR.get(cd)?.[k]; return b == null ? null : BIV[(b % 10) - 1][Math.floor(b / 10) - 1]; };

/* ------------------------------------------------------------------ 111 cana no tanque */
function cana() {
  const e = C.e111;
  const a = mun('Ibaté'), b = mun('São Luiz do Paraitinga'), sp = mun('São Paulo');
  const T = e.porTercoCana;
  const eixos = () => ({
    titulo: L('CANA × ETANOL, EM TERÇOS DOS MUNICÍPIOS', 'CANE × ETHANOL, IN THIRDS OF MUNICIPALITIES'),
    eixoX: L('área com cana', 'area under cane'), eixoY: L('etanol no Otto', 'ethanol in Otto'),
    terX: tercos('cana', 'cane', e.ter_x, fPct(0)), terY: tercos('etanol', 'ethanol', e.ter_y, fPct(0)),
  });
  return () => ({
    layout: 'um',
    serie: serie('cana'),
    titulo: () => L('Cana no tanque', 'Cane in the tank'),
    subtitulo: () => L('Onde há mais canavial, o etanol pesa mais no que os postos vendem', 'Where there is more cane, ethanol weighs more in what filling stations sell'),
    descricao: () => L(
      `Parte da área do município com cana-de-açúcar (MapBiomas, coleção 10, 2024) e parte do etanol hidratado na energia vendida para os motores a gasolina e flex (etanol e gasolina C; SEMIL/SP, ano-base 2024), em terços dos ${nf(e.n)} municípios`,
      `Share of municipal area under sugar cane (MapBiomas, collection 10, 2024) and share of hydrous ethanol in the energy sold for petrol and flex-fuel engines (ethanol and petrol C; SEMIL/SP, base year 2024), in thirds of the ${nf(e.n)} municipalities`),
    mapa: () => ({
      preencher: casaCor('b111'),
      bordaMunicipio: 0.5,
      chamadas: [
        chamada(a, 150, -300, L(`${a.NM_MUN.toUpperCase()} · ${nf(a.pct_etanol_otto, 0)} %`, `${a.NM_MUN.toUpperCase()} · ${nf(a.pct_etanol_otto, 0)}%`),
          L(['de etanol, a maior parte entre os de', `10 mil hab. ou mais; cana em ${nf(a.pct_area_cana, 0)} % da área`], ['ethanol, the highest among towns of', `10,000 or more; cane on ${nf(a.pct_area_cana, 0)}% of the area`])),
        chamada(b, -30, 250, L(`${b.NM_MUN.toUpperCase()} · ${nf(b.pct_etanol_otto, 0)} %`, `${b.NM_MUN.toUpperCase()} · ${nf(b.pct_etanol_otto, 0)}%`),
          L(['de etanol e nenhuma cana: a menor', 'parte entre os de 10 mil hab. ou mais'], ['ethanol and no cane: the lowest', 'share among towns of 10,000 or more'])),
        chamada(sp, -320, 190, L(`SÃO PAULO · ${nf(sp.pct_etanol_otto, 0)} %`, `SÃO PAULO · ${nf(sp.pct_etanol_otto, 0)}%`),
          L(['de etanol, pouco abaixo', `do estado (${nf(e.estado, 0)} %)`], ['ethanol, just below', `the state (${nf(e.estado, 0)}%)`])),
      ],
    }),
    numeros: () => [
      [dec(e.rho), [L('correlação de postos', 'rank correlation'), L(`em ${nf(e.n)} municípios`, `across ${nf(e.n)} municipalities`)]],
      [dec(e.parcial), [L('descontadas', 'net of'), controles(e)]],
      [nf(e.casas[2][2]), [L('municípios no terço de cima', 'municipalities in the top third'), L('dos dois', 'of both')]],
      [L(`${nf(T[0].otto, 0)} → ${nf(T[2].otto, 0)} %`, `${nf(T[0].otto, 0)} → ${nf(T[2].otto, 0)}%`), [L('de etanol no Otto, do terço com', 'ethanol in Otto, from the'), L('menos ao terço com mais cana', 'least- to the most-cane third')]],
    ],
    legendaFigura: () => legendaGrade(eixos(), L('sem venda de etanol ou gasolina no Anuário', 'no ethanol or petrol sales in the Yearbook')),
    painel: (y) => {
      const g = grade(e.casas, y, { ...eixos(), unidade: L('municípios em cada casa', 'municipalities in each cell') });
      const r = relacao(e, g.y + 10);
      const n = nota(`${VENDA()} ${L(
        'Preço na bomba, frota flex e distância da usina podem estar por trás da relação, que fica firme fora da metrópole.',
        'Pump prices, the flex-fuel fleet and distance from mills may lie behind the link, which holds outside the metropolis.')} ${ECOLOGICA()}`, r.y + 12, { tamanho: 13.5 });
      return { svg: [g.svg, r.svg, n.svg].join('\n'), y: n.y };
    },
    fontes: () => [FONTE_SEMIL(), L('MapBiomas, coleção 10 (2024)', 'MapBiomas, collection 10 (2024)'), FONTE_MALHA()],
  });
}

/* ------------------------------------------------------------------ 112 o diesel que o biometano cobriria */
function diesel() {
  const e = C.e112;
  const a = mun('Sertãozinho'), b = mun('São Paulo'), c = mun('Presidente Prudente');
  const rot = () => L(['menos de 0,1', '0,1 a 0,25', '0,25 a 0,5', '0,5 a 1', '1 a 2', '2 ou mais'], ['under 0.1', '0.1 to 0.25', '0.25 to 0.5', '0.5 to 1', '1 to 2', '2 or more']);
  const vez = (v) => L(`${nf(v, 2)} vez${v >= 2 ? 'es' : ''}`, `${nf(v, 2)} times`);
  return () => ({
    layout: 'um',
    serie: serie('diesel'),
    titulo: () => L('O diesel que o biometano cobriria', 'The diesel biomethane could cover'),
    subtitulo: () => L(`Em ${e.ge1} municípios, o potencial de biometano passa, em energia, do diesel que os postos vendem`, `In ${e.ge1} municipalities, biomethane potential exceeds, in energy, the diesel sold at the pumps`),
    descricao: () => L(
      'Potencial de biometano (CP2B, nível N4, cenário de referência) sobre o óleo diesel vendido no município (SEMIL/SP, ano-base 2024), em energia: 1 m³ de biometano ≈ 0,98 L de diesel',
      'Biomethane potential (CP2B, level N4, reference scenario) over the diesel oil sold in the municipality (SEMIL/SP, base year 2024), in energy: 1 m³ of biomethane ≈ 0.98 L of diesel'),
    mapa: () => ({
      preencher: (cd) => { const v = POR.get(cd)?.cobertura_diesel; return v == null ? null : COR_DIESEL[classe(v, LIM_DIESEL)]; },
      bordaMunicipio: 0.5,
      chamadas: [
        chamada(a, 120, -330, L(`${a.NM_MUN.toUpperCase()} · ${nf(a.cobertura_diesel, 2)}`, `${a.NM_MUN.toUpperCase()} · ${nf(a.cobertura_diesel, 2)}`),
          L(['o potencial cobriria o diesel vendido', `e sobraria um terço (${nf(a.pessoas)} hab.)`], ['the potential would cover the diesel sold', `with a third to spare (${nf(a.pessoas)} people)`])),
        chamada(c, -60, 260, L(`PRESIDENTE PRUDENTE · ${nf(c.cobertura_diesel, 2)}`, `PRESIDENTE PRUDENTE · ${nf(c.cobertura_diesel, 2)}`),
          L(['a cidade vende muito diesel; a região', `intermediária inteira chega a ${pc(100 * e.regioes.find((r) => r.nome === 'Presidente Prudente').cobre)}`], ['the city sells a lot of diesel; its whole', `intermediate region reaches ${pc(100 * e.regioes.find((r) => r.nome === 'Presidente Prudente').cobre)}`])),
        chamada(b, 160, 230, L(`SÃO PAULO · ${nf(b.cobertura_diesel, 2)}`, `SÃO PAULO · ${nf(b.cobertura_diesel, 2)}`),
          L(['o potencial da capital daria', `${pc(100 * b.cobertura_diesel, 0)} do diesel vendido nela`], ['the capital’s potential would give', `${pc(100 * b.cobertura_diesel, 0)} of the diesel sold there`])),
      ],
    }),
    numeros: () => [
      [pc(100 * e.estado), [L(`do diesel do estado: ${nf(e.bm_bi_m3_ano, 2)} bi m³`, `of the state’s diesel: ${nf(e.bm_bi_m3_ano, 2)} bn m³`), L(`de biometano por ano, ${nf(e.diesel_bi_l, 1)} bi L`, `of biomethane a year, ${nf(e.diesel_bi_l, 1)} bn L`)]],
      [pc(100 * e.fora_rgint_sp), [L('fora da região', 'outside the São Paulo'), L('intermediária de São Paulo', 'intermediate region')]],
      [nf(e.ge1), [L(`de ${nf(e.n)} municípios em que`, `of ${nf(e.n)} municipalities where`), L('o potencial passa do diesel', 'potential exceeds diesel')]],
      [dec(e.mediana, 2), [L('no município mediano:', 'in the median town:'), L('quase todo o diesel', 'nearly all the diesel')]],
    ],
    legendaFigura: () => {
      const g = legenda([...COR_DIESEL.map((cor, i) => [cor, rot()[i], null]), ['hachura', L('sem venda de diesel no Anuário', 'no diesel sales in the Yearbook'), null]], 0,
        { titulo: L('BIOMETANO ÷ DIESEL VENDIDO, EM ENERGIA', 'BIOMETHANE ÷ DIESEL SOLD, IN ENERGY'), passo: 22 });
      return { svg: g.svg, altura: g.y, largura: 380 };
    },
    painel: (y) => {
      const s = [];
      const g = legenda([...COR_DIESEL.map((cor, i) => [cor, rot()[i], e.cont[i]]), ['hachura', L('sem venda de diesel no Anuário', 'no diesel sales in the Yearbook'), e.sem]], y,
        { titulo: L('BIOMETANO ÷ DIESEL VENDIDO, EM ENERGIA', 'BIOMETHANE ÷ DIESEL SOLD, IN ENERGY'), unidade: L('mun.', 'mun.'), passo: 22 });
      s.push(g.svg);
      s.push(rotuloPainel(L('POR REGIÃO INTERMEDIÁRIA', 'BY INTERMEDIATE REGION'), g.y + 10));
      const br = barras(e.regioes.map((r) => [r.nome, 100 * r.cobre, COR_DIESEL[classe(r.cobre, LIM_DIESEL)] === '#f2efe6' ? '#e2d8bd' : COR_DIESEL[classe(r.cobre, LIM_DIESEL)], pc(100 * r.cobre)]), g.y + 20, { max: 140, x0: 200, passo: 16 });
      s.push(br.svg);
      const n = nota(L(
        `O CP2B é um modelo: potencial, não produção. Venda não é consumo: inclui quem só passa pela estrada. A razão compara energia; não diz que o biometano chegaria aos ${nf(Math.round(e.caminhoes / 1e3))} mil caminhões do estado.`,
        `CP2B is a model: potential, not output. Sales are not consumption: they include people driving through. The ratio compares energy; it does not say biomethane would reach the state’s ${nf(Math.round(e.caminhoes / 1e3))} thousand lorries.`), br.y + 12, { tamanho: 13.5 });
      s.push(n.svg);
      return { svg: s.join('\n'), y: n.y };
    },
    fontes: () => [FONTE_CP2B(), FONTE_SEMIL(), FONTE_MALHA()],
  });
}

/* ------------------------------------------------------------------ 113 eucalipto encostado na mata */
function eucalipto() {
  const e = C.e113;
  const a = mun('Capão Bonito'), b = mun('Agudos');
  const mi = (v) => L(`${nf(v / 1e6, 2)} milhão de m³`, `${nf(v / 1e6, 2)} million m³`);
  const mi2 = (v) => L(`${nf(v / 1e6, 2)} milhões de m³`, `${nf(v / 1e6, 2)} million m³`);
  const mPorKm = (v) => L(`${nf(v)} m³/km²`, `${nf(v)} m³/km²`);
  const eixos = () => ({
    titulo: L('MATA × MADEIRA PARA CELULOSE', 'NATIVE COVER × PULPWOOD'),
    eixoX: L('vegetação nativa', 'native vegetation'), eixoY: L('madeira por km²', 'wood per km²'),
    terX: tercos('mata', 'native cover', e.ter_x, fPct(0)),
    terY: L(['madeira para celulose:', `nenhuma, até ${mPorKm(e.med_prod)}`, `e mais de ${mPorKm(e.med_prod)}`], ['pulpwood:', `none, up to ${mPorKm(e.med_prod)}`, `and over ${mPorKm(e.med_prod)}`]),
  });
  return () => ({
    layout: 'um',
    serie: serie('eucalipto'),
    titulo: () => L('Eucalipto encostado na mata', 'Eucalyptus against the forest'),
    subtitulo: () => L('Onde sobra mais vegetação nativa, mais madeira sai para o papel e a celulose', 'Where more native vegetation remains, more wood goes to paper and pulp'),
    descricao: () => L(
      `Parte da área do município com vegetação nativa (MapBiomas, coleção 10, 2024), em terços, e madeira em tora para papel e celulose por km² (IBGE, PEVS 2024): nenhuma, abaixo e acima da mediana dos ${nf(e.n_prod)} produtores`,
      `Share of municipal area under native vegetation (MapBiomas, collection 10, 2024), in thirds, and roundwood for paper and pulp per km² (IBGE, PEVS 2024): none, below and above the median of the ${nf(e.n_prod)} producers`),
    mapa: () => ({
      preencher: casaCor('b113'),
      bordaMunicipio: 0.5,
      chamadas: [
        chamada(a, 140, 230, L(`${a.NM_MUN.toUpperCase()} · ${nf(a.pct_area_nativa, 0)} % DE MATA`, `${a.NM_MUN.toUpperCase()} · ${nf(a.pct_area_nativa, 0)}% NATIVE`),
          L([`e ${mi(a.madeira_papel_m3)} para celulose:`, 'terço de cima nos dois'], [`and ${mi(a.madeira_papel_m3)} for pulp:`, 'top third of both'])),
        chamada(b, 120, -280, L(`${b.NM_MUN.toUpperCase()} · ${nf(b.pct_area_nativa, 0)} % DE MATA`, `${b.NM_MUN.toUpperCase()} · ${nf(b.pct_area_nativa, 0)}% NATIVE`),
          L([`e ${nf(Math.round(b.madeira_papel_m3 / 1e3))} mil m³ de madeira para celulose`, 'no centro-oeste paulista'], [`and ${nf(Math.round(b.madeira_papel_m3 / 1e3))} thousand m³ of pulpwood`, 'in the state’s centre-west'])),
      ],
    }),
    numeros: () => [
      [dec(e.rho), [L('correlação de postos', 'rank correlation'), L(`em ${nf(e.n)} municípios da PEVS`, `across ${nf(e.n)} PEVS municipalities`)]],
      [dec(e.parcial), [L('descontadas', 'net of'), controles(e)]],
      [nf(e.casas[2][2]), [L('municípios com mais mata', 'municipalities with most forest'), L('e mais madeira por km²', 'and most wood per km²')]],
      [pc(e.nativa_prod), [L('de mata no produtor mediano', 'native cover in the median producer'), L(`(${pc(e.nativa_nao)} nos que não produzem)`, `(${pc(e.nativa_nao)} in non-producers)`)]],
    ],
    legendaFigura: () => legendaGrade(eixos(), L('fora da PEVS 2024: sem dado, não zero', 'outside PEVS 2024: no data, not zero')),
    painel: (y) => {
      const g = grade(e.casas, y, { ...eixos(), unidade: L('municípios em cada casa', 'municipalities in each cell') });
      const r = relacao(e, g.y + 10, [], { semForaSp: true });
      const lg = caixaLegenda(null, L(`fora da PEVS 2024 (${nf(e.sem)} municípios): sem dado, não zero`, `outside PEVS 2024 (${nf(e.sem)} municipalities): no data, not zero`), r.y + 20, { hachura: true });
      const n = nota(L(
        `A PEVS não diz a espécie: o eucalipto domina a silvicultura paulista, mas no sudoeste há também pinus. Relevo e solo que afastam a cana podem estar por trás das duas. O mapa compara municípios, não fazendas.`,
        `PEVS does not give the species: eucalyptus dominates São Paulo’s plantations, but the south-west also grows pine. Relief and soils that keep cane away may lie behind both. The map compares municipalities, not farms.`), r.y + 36, { tamanho: 13.5 });
      return { svg: [g.svg, r.svg, lg, n.svg].join('\n'), y: n.y };
    },
    fontes: () => [L('IBGE, PEVS 2024 (SIDRA 291)', 'IBGE, PEVS 2024 (SIDRA 291)'), L('MapBiomas, coleção 10 (2024)', 'MapBiomas, collection 10 (2024)'), FONTE_MALHA()],
  });
}

/* ------------------------------------------------------------------ 114 o esterco longe de quem aduba */
function esterco() {
  const e = C.e114;
  const a = mun('Ferraz de Vasconcelos'), b = mun('Presidente Bernardes');
  const bov = (v) => nf(v, v < 10 ? 1 : 0);
  const eixos = () => ({
    titulo: L('BOVINOS × ADUBO ORGÂNICO, EM TERÇOS', 'CATTLE × ORGANIC FERTILISER, IN THIRDS'),
    eixoX: L('bovinos por km²', 'cattle per km²'), eixoY: L('adubo orgânico', 'organic fert.'),
    terX: tercos('bovinos/km²', 'cattle/km²', e.ter_x, (v) => nf(v, 0)), terY: tercos('adubo orgânico', 'organic fertiliser', e.ter_y, fPct(0)),
  });
  return () => ({
    layout: 'um',
    serie: serie('esterco'),
    titulo: () => L('O esterco longe de quem aduba', 'Manure far from who spreads it'),
    subtitulo: () => L('Onde há mais boi por km², menos estabelecimentos usam adubo orgânico', 'Where there are more cattle per km², fewer farms use organic fertiliser'),
    descricao: () => L(
      `Bovinos por km² (IBGE, PPM 2024) e parte dos estabelecimentos agropecuários que fizeram adubação orgânica, só ou com a química (IBGE, Censo Agropecuário 2017), em terços dos ${nf(e.n)} municípios`,
      `Cattle per km² (IBGE, PPM 2024) and share of farm holdings that applied organic fertiliser, alone or with chemical (IBGE, 2017 Agricultural Census), in thirds of the ${nf(e.n)} municipalities`),
    mapa: () => ({
      preencher: casaCor('b114'),
      bordaMunicipio: 0.5,
      chamadas: [
        chamada(a, 30, 230, L(`${a.NM_MUN.toUpperCase()} · ${nf(a.pct_estab_adubo_organico, 0)} %`, `${a.NM_MUN.toUpperCase()} · ${nf(a.pct_estab_adubo_organico, 0)}%`),
          L(['dos estabelecimentos com adubo orgânico,', `e ${bov(a.bovinos_km2)} bois por km²: a horta da metrópole`], ['of holdings use organic fertiliser,', `with ${bov(a.bovinos_km2)} cattle per km²: the metropolitan market garden`])),
        chamada(b, -2, -300, L(`${b.NM_MUN.toUpperCase()} · ${nf(b.bovinos_km2, 0)} BOIS/KM²`, `${b.NM_MUN.toUpperCase()} · ${nf(b.bovinos_km2, 0)} CATTLE/KM²`),
          L([`e ${nf(b.pct_estab_adubo_organico, 0)} % com adubo orgânico:`, 'pasto que não volta para a lavoura'], [`and ${nf(b.pct_estab_adubo_organico, 0)}% with organic fertiliser:`, 'pasture that does not return to the field'])),
      ],
    }),
    numeros: () => [
      [dec(e.rho), [L('correlação de postos', 'rank correlation'), L(`em ${nf(e.n)} municípios`, `across ${nf(e.n)} municipalities`)]],
      [dec(e.parcial), [L('descontadas', 'net of'), controles(e)]],
      [nf(e.casas[0][2]), [L('municípios com mais boi', 'municipalities with most cattle'), L('e menos adubo orgânico', 'and least organic fertiliser')]],
      [`${nf(e.bov.medBaixo, 0)} · ${nf(e.bov.medAlto, 0)}`, [L('% com adubo orgânico: quartil', '% with organic fertiliser: least'), L('com menos e com mais boi', 'and most cattle quartile')]],
    ],
    legendaFigura: () => legendaGrade(eixos(), L('sem dado', 'no data')),
    painel: (y) => {
      const g = grade(e.casas, y, { ...eixos(), unidade: L('municípios em cada casa', 'municipalities in each cell') });
      const r = relacao(e, g.y + 10, [[L('pouco adubo cercado de muito boi (LISA)', 'little fertiliser amid many cattle (LISA)'), `${e.lisa.BA} mun.`]], { semForaSp: true });
      const n = nota(`${L(
        `Censo Agropecuário de 2017, rebanho de 2024. Adubo orgânico não é só esterco: inclui o composto das hortas, e o gado solto deixa o esterco no pasto. Pelo nitrogênio dos dejetos, a queda é parecida (${nf(e.nitro.medBaixo, 0)} → ${nf(e.nitro.medAlto, 0)} %). Os casos se juntam no oeste. O mapa compara municípios, não fazendas.`,
        `Agricultural Census of 2017, herd of 2024. Organic fertiliser is not only manure: it includes market-garden compost, and grazing cattle leave manure on pasture. By manure nitrogen the drop is similar (${nf(e.nitro.medBaixo, 0)} → ${nf(e.nitro.medAlto, 0)}%). Cases cluster in the west. The map compares municipalities, not farms.`)}`, r.y + 12, { tamanho: 13.5 });
      return { svg: [g.svg, r.svg, n.svg].join('\n'), y: n.y };
    },
    fontes: () => [L('IBGE, Censo Agropecuário 2017 (SIDRA 6847)', 'IBGE, 2017 Agricultural Census (SIDRA 6847)'), L('IBGE, PPM 2024', 'IBGE, PPM 2024'), FONTE_MALHA()],
  });
}

/* ------------------------------------------------------------------ 115 pequenos, cheios de gás e sozinhos */
function pequenos() {
  const e = C.e115;
  const a = mun('Ariranha'), b = mun('Tarumã'), c = mun('Maracaí');
  const cor = (cd) => {
    const o = POR.get(cd);
    if (!o) return NEUTRO;
    if (o.alvo115) return o.arranjo115 === 'sem_informacao' ? null : COR_115[o.arranjo115];
    return o.cheio115 ? COR_115.outro : NEUTRO;
  };
  const m3 = (v) => L(`${mil(v)} m³/dia`, `${mil(v)} m³/day`);
  const km = (v) => `${nf(v, 0)} km`;
  /** Classes do mapa e as duas linhas de gás; `contar` põe o número de municípios à direita (só na prancha). */
  const classes = (y, contar) => {
    const s = [];
    const g = legenda([
      [COR_115.sozinho, L('presta sozinho', 'runs it alone'), e.sozinho],
      [COR_115.regional, L('outra forma regionalizada', 'other regional arrangement'), e.regional],
      [COR_115.consorcio, L('em consórcio público', 'in a public consortium'), e.consorcio],
      [COR_115.outro, L('outros no quartil de cima', 'others in the top quartile'), e.cheios_n - e.n],
    ].map(([c, r, n]) => [c, r, contar ? n : null]), y, { titulo: L('PEQUENOS, CHEIOS DE GÁS E LONGE: RESÍDUOS', 'SMALL, GAS-RICH AND FAR: WASTE SERVICES'), unidade: L('mun.', 'mun.'), passo: 22 });
    s.push(g.svg);
    let yy = g.y + 2;
    s.push(`<path d="M0 ${yy - 5}h30" stroke="#ffffff" stroke-width="5.4"/><path d="M0 ${yy - 5}h30" stroke="${TINTA}" stroke-width="2.4"/><text x="42" y="${yy}" font-family="${SERIF}" font-size="16">${esc(L('gasoduto de transporte', 'transmission pipeline'))}</text>`);
    yy += 22;
    s.push(`<path d="M0 ${yy - 5}h30" stroke="#7a8189" stroke-width="1.2"/><text x="42" y="${yy}" font-family="${SERIF}" font-size="16">${esc(L('rede de distribuição de gás', 'gas distribution network'))}</text>`);
    return { svg: s.join('\n'), y: yy + 14 };
  };
  return () => ({
    layout: 'um',
    serie: serie('pequenos'),
    titulo: () => L('Pequenos, cheios de gás e sozinhos', 'Small, gas-rich and on their own'),
    subtitulo: () => L(`${e.n} municípios de menos de 20 mil habitantes têm ${nf(e.pct_bm, 0)} % do potencial de biometano e ficam longe do gasoduto`, `${e.n} towns of under 20,000 people hold ${nf(e.pct_bm, 0)}% of the biomethane potential and lie far from the pipeline`),
    descricao: () => L(
      `Municípios com potencial de biometano no quartil de cima (CP2B, N4, cenário de referência: ${nf(e.p75)} m³/dia ou mais), menos de ${nf(LIM_POP_115)} habitantes (Censo 2022) e mais de ${LIM_KM_115} km do gasoduto de transporte, pela forma de prestar o manejo de resíduos sólidos (IBGE, MUNIC 2023)`,
      `Municipalities with biomethane potential in the top quartile (CP2B, N4, reference scenario: ${nf(e.p75)} m³/day or more), under ${nf(LIM_POP_115)} people (2022 Census) and over ${LIM_KM_115} km from the transmission pipeline, by how they run solid-waste services (IBGE, MUNIC 2023)`),
    mapa: () => ({
      preencher: cor,
      bordaMunicipio: 0.5,
      linhas: [
        { feats: C.gas.distribuicao, cor: '#7a8189', largura: 0.9, opacidade: 0.8 },
        { feats: C.gas.transporte, cor: TINTA, largura: 2.4, halo: 2.5 },
      ],
      chamadas: [
        chamada(a, 140, -290, L(`${a.NM_MUN.toUpperCase()} · ${m3(a.biometano_m3d)}`, `${a.NM_MUN.toUpperCase()} · ${m3(a.biometano_m3d)}`),
          L([`${nf(a.pessoas)} habitantes, ${km(a.km_gasoduto_transporte)} do gasoduto:`, 'o maior potencial do grupo, prestado sozinho'], [`${nf(a.pessoas)} people, ${km(a.km_gasoduto_transporte)} from the pipeline:`, 'the group’s largest potential, run alone'])),
        chamada(b, -120, 380, L(`${b.NM_MUN.toUpperCase()} · ${m3(b.biometano_m3d)}`, `${b.NM_MUN.toUpperCase()} · ${m3(b.biometano_m3d)}`),
          L([`a ${km(b.km_gasoduto_transporte)} do gasoduto de transporte,`, 'sem consórcio para os resíduos'], [`${km(b.km_gasoduto_transporte)} from the transmission pipeline,`, 'with no consortium for waste'])),
        chamada(c, -200, 260, L(`${c.NM_MUN.toUpperCase()} · ${m3(c.biometano_m3d)}`, `${c.NM_MUN.toUpperCase()} · ${m3(c.biometano_m3d)}`),
          L(['um dos 5 do grupo que', 'prestam em consórcio'], ['one of the group’s 5', 'that work in a consortium'])),
      ],
    }),
    numeros: () => [
      [nf(e.n), [L('municípios pequenos, cheios', 'small municipalities, gas-rich'), L(`e a mais de ${LIM_KM_115} km do gasoduto`, `and over ${LIM_KM_115} km from the pipeline`)]],
      [pc(e.pct_bm), [L(`do potencial do estado: ${nf(e.bm / 1e6, 2)} mi`, `of the state’s potential: ${nf(e.bm / 1e6, 2)} m`), L(`m³/dia, ${mil(e.pessoas)} hab.`, `m³/day, ${mil(e.pessoas)} people`)]],
      [`${e.sozinho}/${e.n}`, [L('prestam o serviço de', 'run their waste services'), L('resíduos sozinhos', 'on their own')]],
      [`${e.gas_canalizado}/${e.n}`, [L('têm gás canalizado', 'have piped gas'), L(`(no estado, ${645 - e.sem_gas_n} de 645)`, `(statewide, ${645 - e.sem_gas_n} of 645)`)]],
    ],
    legendaFigura: () => {
      const g = classes(0, false);
      return { svg: g.svg, altura: g.y, largura: 430 };
    },
    painel: (y) => {
      const s = [];
      const g = classes(y, true);
      s.push(g.svg);
      const yy = g.y;
      const fr = (k, n) => `${k}/${n} · ${pc((100 * k) / n)}`;
      const q = quadro([
        [L('em consórcio público · no grupo', 'public consortium · in the group'), fr(e.consorcio, e.n), true],
        [L('em consórcio público · no estado', 'public consortium · statewide'), fr(e.est_consorcio, e.est_munic)],
        [L('alguma forma regionalizada · no grupo', 'any regional arrangement · group'), fr(e.consorcio + e.regional, e.n)],
        [L('alguma forma regionalizada · no estado', 'any regional arrangement · state'), fr(e.est_regional, e.est_munic)],
        [L('tratam resíduos orgânicos · no grupo', 'treat organic waste · group'), fr(e.trat_org, e.n)],
        [L('aterro sanitário no próprio município', 'landfill within the municipality'), fr(e.aterro, e.n)],
      ], yy + 10, { titulo: L('O QUE A MUNIC 2023 DIZ', 'WHAT MUNIC 2023 SAYS'), passo: 17 });
      s.push(q.svg);
      const reg = e.regioes.slice(0, 2).map(([n, k]) => `${n} (${k})`).join(L(' e ', ' and '));
      const n = nota(`${L(
        `Retrato descritivo, sem teste: ficar sozinho é tão comum no grupo quanto no estado. O potencial vem sobretudo da cana; ${e.regioes[0][1] + e.regioes[1][1]} dos ${e.n} ficam em ${reg}. A MUNIC é o que a prefeitura declara; o CP2B é um modelo: potencial, não produção.`,
        `A descriptive portrait, with no test: going it alone is as common in the group as statewide. The potential comes mostly from cane; ${e.regioes[0][1] + e.regioes[1][1]} of the ${e.n} lie in ${reg}. MUNIC is what each town hall declares; CP2B is a model: potential, not output.`)}`, q.y + 12, { tamanho: 13.5 });
      s.push(n.svg);
      return { svg: s.join('\n'), y: n.y };
    },
    fontes: () => [FONTE_CP2B(), L('IBGE, MUNIC 2023 (saneamento); EPE, gasodutos', 'IBGE, MUNIC 2023 (sanitation); EPE, pipelines'), FONTE_SEMIL(), FONTE_MALHA()],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { cana, diesel, eucalipto, esterco, pequenos };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/bioenergia-cruzada-sp/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
const s = SERIE.find((x) => x.tema === nome);
const fazer = TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: s.pasta, base: s.base, numero: s.numero, data: s.data, fazerTema: () => fazer() });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `bioenergia-cruzada-sp-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
