#!/usr/bin/env node
/**
 * Coleção «O Censo cruzado» — desenha uma prancha a partir do cache de preparar.mjs (uso interno).
 *
 *   node scripts/colecoes/censo-cruzado-sp/prancha.mjs solar|esgoto|boi|segregacao|vertical|juventude|sozinho|letras|veraneio|paudearara
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { RAIZ, LP, SERIF, MONO, TINTA, CINZA, esc, nf, f1, largura, tr, gerarPrancha, rotuloPainel, usarRegiao } from '../lib/prancha-sp.mjs';
import { L, NEUTRO, ZERO, HACHURA, barras, caixaLegenda, nota } from '../lib/painel.mjs';
import { BIV, LIM_PAU, CORES_PAU } from './preparar.mjs';
import { friso } from './friso.mjs';

const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'censo-cruzado-sp', 'serie.json'), 'utf8'));
const C = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', 'censo-cruzado-sp.json'), 'utf8'));
const POR = new Map(C.mun.map((m) => [m.CD_MUN, m]));
const NUM = Object.fromEntries(SERIE.map((s) => [s.tema, String(s.numero).padStart(3, '0')]));
const ORDEM = Object.fromEntries(SERIE.map((s, i) => [s.tema, i + 1]));
const serie = (t) => () => L(`O CENSO CRUZADO · ${ORDEM[t]}/10`, `THE CENSUS, CROSSED · ${ORDEM[t]}/10`);
/** Decimal com o sinal de menos tipográfico. */
const dec = (v, c = 2) => nf(v, c).replace('-', '−');
const pTxt = (p) => (p < 0.001 ? '< 0,001' : nf(p, 3));
const pTxtEn = (p) => (p < 0.001 ? '< 0.001' : nf(p, 3));
const mun = (nome) => C.mun.find((m) => m.NM_MUN === nome);
const pc = (v, c = 1) => L(`${nf(v, c)} %`, `${nf(v, c)}%`);

const FONTE_MALHA = () => L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025');
const FONTE_CENSO = L('IBGE, Censo 2022: SIDRA e agregados por setor', 'IBGE, 2022 Census: SIDRA and tract aggregates');

/** Casa [terço de y, terço de x] de um município numa prancha, ou null. */
const casa = (m, N) => { const b = m?.[`b${N}`]; return b == null ? null : [(b % 10) - 1, Math.floor(b / 10) - 1]; };

/* ------------------------------------------------------------------ painel comum dos mapas bivariados */
/**
 * Grade 3 × 3 com o número de unidades em cada casa, setas dos eixos e os limites dos terços; depois o
 * quadro «como se relacionam» e os cruzamentos vizinhos. cfg: { eixoX, eixoY, terX, terY, unidade }.
 * Sem `unidade` (a figura de reuso), as casas ficam sem as contagens.
 */
function grade(casas, y, cfg) {
  const s = [rotuloPainel(cfg.titulo, y)];
  const q = 44, x0 = 116, y0 = y + 28;
  for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) {
    const xx = x0 + b * q, yy = y0 + (2 - a) * q;
    s.push(`<rect x="${xx}" y="${yy}" width="${q}" height="${q}" fill="${BIV[a][b]}" stroke="#ffffff" stroke-width="1"/>`);
    if (cfg.unidade) s.push(`<text x="${xx + q / 2}" y="${yy + q / 2 + 5}" text-anchor="middle" font-family="${MONO}" font-size="13" fill="${a === 2 || (a === 1 && b === 2) ? '#ffffff' : TINTA}">${casas[a][b]}</text>`);
  }
  s.push(`<path d="M${x0} ${y0 + 3 * q + 10}h${3 * q}" stroke="${TINTA}" stroke-width="1"/><path d="M${x0 + 3 * q - 6} ${y0 + 3 * q + 6}l6 4l-6 4" fill="none" stroke="${TINTA}"/>`);
  s.push(`<text x="${x0 + 1.5 * q}" y="${y0 + 3 * q + 30}" text-anchor="middle" font-family="${MONO}" font-size="12">${esc(`${cfg.eixoX} →`)}</text>`);
  s.push(`<path d="M${x0 - 10} ${y0 + 3 * q}v${-3 * q}" stroke="${TINTA}" stroke-width="1"/><path d="M${x0 - 14} ${y0 + 6}l4 -6l4 6" fill="none" stroke="${TINTA}"/>`);
  s.push(`<text x="${x0 - 22}" y="${y0 + 1.5 * q}" text-anchor="middle" font-family="${MONO}" font-size="12" transform="rotate(-90 ${x0 - 22} ${y0 + 1.5 * q})">${esc(`${cfg.eixoY} →`)}</text>`);
  const tx = x0 + 3 * q + 30;
  const lin = [...cfg.terX, '', ...cfg.terY, ...(cfg.unidade ? ['', cfg.unidade] : [])];
  lin.forEach((l, k) => s.push(`<text x="${tx}" y="${y0 + 10 + k * 15}" font-family="${MONO}" font-size="12" fill="${CINZA}">${esc(l)}</text>`));
  const larg = Math.max(largura(tr(cfg.titulo), 15, { mono: true, espaco: 2.4 }), tx + Math.max(...lin.map((l) => largura(l, 12, { mono: true }))));
  return { svg: s.join('\n'), y: Math.max(y0 + 3 * q + 50, y0 + 10 + lin.length * 15 + 8), largura: Math.ceil(larg) };
}

/**
 * Legenda da figura de reuso de um mapa bivariado: a grade sem as contagens, com os eixos e os limites dos
 * terços, e a hachura quando o mapa a tem. A grade é a chave do mapa; o quadro e a nota ficam na prancha.
 */
function gradeFigura(casas, cfg, semInfo = null) {
  const g = grade(casas, 0, { ...cfg, unidade: null });
  if (!semInfo) return { svg: g.svg, altura: g.y - 14, largura: g.largura };
  const y = g.y + 10;
  return { svg: `${g.svg}\n${caixaLegenda(null, semInfo, y, { hachura: true })}`, altura: y + 6, largura: Math.max(g.largura, Math.ceil(42 + largura(semInfo, 16))) };
}

/** Linhas de rótulo e valor (valor alinhado à direita). */
function quadro(linhas, y, { titulo, passo = 18 } = {}) {
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

const CONTROLE_NOME = () => ({ pct_urbana: L('urbanização', 'urbanisation'), log_densidade: L('densidade', 'density'), log_renda_pc: L('renda', 'income') });
const listaE = (xs, e) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ${e} ${xs.at(-1)}`);
const controles = (e) => { const n = CONTROLE_NOME(); const xs = e.controles.map((c) => n[c]); return L(listaE(xs, 'e'), listaE(xs, 'and')); };

/** Bloco «como se relacionam» de um par municipal. */
function relacao(e, y, extras) {
  const linhas = [
    [L('correlação de postos (Spearman)', 'rank correlation (Spearman)'), `${dec(e.rho)} · ${nf(e.n)} mun.`, true],
    [L(`parcial, descontadas ${controles(e)}`, `partial, net of ${controles(e)}`), dec(e.parcial)],
    [L('amostra efetiva, com a autocorrelação', 'effective sample, given autocorrelation'), `${nf(e.n_eff)} · p ${L(pTxt(e.p_eff), pTxtEn(e.p_eff))}`],
    [L('parcial fora da região de São Paulo', 'partial outside the São Paulo region'), dec(e.parcial_sem_rgint_sp)],
    [L('Moran bivariado (6 vizinhos)', 'bivariate Moran (6 neighbours)'), dec(e.I_biv)],
    [L('aglomerados LISA alto-alto · baixo-baixo', 'LISA clusters high-high · low-low'), `${e.lisa.AA} · ${e.lisa.BB}`],
  ];
  // Cruzamentos vizinhos no mesmo quadro: ρ e parcial.
  for (const [rot, x] of extras ?? []) linhas.push([rot, `${dec(x.rho)} · ${L('parcial', 'partial')} ${dec(x.parcial)}`]);
  return quadro(linhas, y, { titulo: L('COMO SE RELACIONAM', 'HOW THEY RELATE') });
}

const ECOLOGICA = () => L(
  'Leitura ecológica: o mapa compara municípios, não pessoas, e a correlação não diz o que causa o quê.',
  'Ecological reading: the map compares municipalities, not people, and correlation does not say what causes what.');

/** Tema bivariado municipal. cfg traz textos, rótulos, chamadas e o quarto número. */
function bivariado(tema, cfg) {
  const N = NUM[tema];
  const e = C.pr[tema];
  // Município sem casa na grade fica hachurado no mapa; cfg.semInfo diz por quê.
  const temHachura = C.mun.some((m) => casa(m, N) === null);
  return () => ({
    layout: 'um',
    motivo: friso,
    serie: serie(tema),
    titulo: cfg.titulo,
    subtitulo: cfg.subtitulo,
    descricao: cfg.descricao,
    mapa: () => ({
      preencher: (cd) => { const c = casa(POR.get(cd), N); return c ? BIV[c[0]][c[1]] : null; },
      bordaMunicipio: 0.5,
      chamadas: cfg.chamadas(),
    }),
    legendaFigura: () => gradeFigura(e.casas, { titulo: cfg.tituloGrade(), ...cfg.eixos() }, temHachura ? (cfg.semInfo?.() ?? L('sem informação', 'no data')) : null),
    numeros: () => [
      [dec(e.rho), [L('correlação de postos', 'rank correlation'), L(`em ${nf(e.n)} municípios`, `across ${nf(e.n)} municipalities`)]],
      [dec(e.parcial), [L('descontadas', 'net of'), controles(e)]],
      [nf(e.casas[2][2]), [L('municípios no terço de cima', 'municipalities in the top third'), L('das duas variáveis', 'of both variables')]],
      cfg.quarto(),
    ],
    painel: (y) => {
      const g = grade(e.casas, y, { titulo: cfg.tituloGrade(), ...cfg.eixos() });
      const r = relacao(e, g.y + 10, cfg.extras?.());
      const n = nota(`${ECOLOGICA()} ${cfg.nota()}`, r.y + 12, { tamanho: 13.5 });
      return { svg: [g.svg, r.svg, n.svg].join('\n'), y: n.y };
    },
    fontes: cfg.fontes,
  });
}

/** Rótulos dos terços: "até a", "a a b", "mais de b". */
const tercos = (nomePt, nomeEn, t, fmt) => L(
  [`terços de ${nomePt}:`, `até ${fmt(t[0])}, ${fmt(t[0])} a ${fmt(t[1])}`, `e mais de ${fmt(t[1])}`],
  [`thirds of ${nomeEn}:`, `up to ${fmt(t[0])}, ${fmt(t[0])} to ${fmt(t[1])}`, `and over ${fmt(t[1])}`]);
const fPct = (c = 0) => (v) => L(`${nf(v, c)} %`, `${nf(v, c)}%`);
const extra = (tema, x, y) => C.pr[tema].extras.find((s) => s.x === x && s.y === y);
const chamada = (m, dx, dy, tituloPt, tituloEn, linhasPt, linhasEn) => ({ cd: m.CD_MUN, dx, dy, tamanho: 16, titulo: L(tituloPt, tituloEn), linhas: L(linhasPt, linhasEn) });

/* ------------------------------------------------------------------ 093 o sol segue o canavial */
function solar() {
  const e = C.pr.solar;
  const a = mun('Jaboticabal'), b = mun('Santa Fé do Sul'), sp = mun('São Paulo');
  const nat = extra('solar', 'solar_w_dom', 'pct_area_nativa'), renda = extra('solar', 'solar_w_dom', 'renda_pc_media');
  return bivariado('solar', {
    titulo: () => L('O sol segue o canavial', 'Solar follows the cane'),
    subtitulo: () => L('Onde há mais cana, há mais watts solares por casa, mesmo descontada a renda', 'Where there is more cane, there are more solar watts per home, even net of income'),
    descricao: () => L(
      'Parte da área do município com cana-de-açúcar (MapBiomas, coleção 10, 2024) e potência solar residencial de geração distribuída por domicílio ocupado (ANEEL, out. 2026; Censo 2022), em terços dos 645 municípios',
      'Share of municipal area under sugar cane (MapBiomas, collection 10, 2024) and residential distributed solar power per occupied home (ANEEL, Oct. 2026; 2022 Census), in thirds of the 645 municipalities'),
    tituloGrade: () => L('CANA × SOLAR, EM TERÇOS DOS MUNICÍPIOS', 'CANE × SOLAR, IN THIRDS OF MUNICIPALITIES'),
    eixos: () => ({
      eixoX: L('área com cana', 'area under cane'), eixoY: L('W solares por casa', 'solar W per home'),
      terX: tercos('cana', 'cane', e.ter_x, fPct(0)), terY: tercos('W por domicílio', 'W per home', e.ter_y, (v) => nf(v)),
      unidade: L('municípios em cada casa', 'municipalities in each cell'),
    }),
    chamadas: () => [
      chamada(a, 150, -250, `${a.NM_MUN.toUpperCase()} · ${nf(a.solar_w_dom)} W`, `${a.NM_MUN.toUpperCase()} · ${nf(a.solar_w_dom)} W`,
        ['solares por domicílio, com', `${nf(a.pct_area_cana, 0)} % da área em cana`], ['of solar per home, with', `${nf(a.pct_area_cana, 0)}% of its area under cane`]),
      chamada(b, 120, -170, `${b.NM_MUN.toUpperCase()} · ${nf(b.solar_w_dom)} W`, `${b.NM_MUN.toUpperCase()} · ${nf(b.solar_w_dom)} W`,
        ['e quase nenhuma cana: o solar', 'também é forte no oeste do pasto'], ['and almost no cane: solar is', 'strong in the pasture west too']),
      chamada(sp, 170, 220, `SÃO PAULO · ${nf(sp.solar_w_dom)} W`, `SÃO PAULO · ${nf(sp.solar_w_dom)} W`,
        ['por domicílio: a cidade', 'mora em prédio'], ['per home: the city', 'lives in flats']),
    ],
    quarto: () => [dec(nat.rho), [L('entre solar e área de', 'between solar and native'), L('vegetação nativa', 'vegetation area')]],
    extras: () => [
      [L('solar × vegetação nativa', 'solar × native vegetation'), nat],
      [L('solar × renda per capita', 'solar × income per head'), renda],
    ],
    nota: () => L(
      `A renda sozinha explica pouco (ρ ${dec(renda.rho)}); a cana pesa mesmo com ela descontada. A irradiação também cresce para o oeste, onde estão cana e pasto, e o mapa não separa os dois efeitos.`,
      `Income alone explains little (ρ ${dec(renda.rho)}); cane still weighs once it is netted out. Irradiance also rises westwards, where cane and pasture are, and the map does not separate the two.`),
    fontes: () => [L('ANEEL, geração distribuída (out. 2026)', 'ANEEL, distributed generation (Oct. 2026)'), L('MapBiomas, coleção 10 (2024); IBGE, Censo 2022', 'MapBiomas, collection 10 (2024); IBGE, 2022 Census'), FONTE_MALHA()],
  });
}

/* ------------------------------------------------------------------ 094 cana e esgoto */
function esgoto() {
  const e = C.pr.esgoto;
  const a = mun('Sertãozinho'), b = mun('Atibaia'), c = mun('Paulicéia');
  const op = extra('esgoto', 'pct_area_cana', 'pct_ocup_operarios'), fav = extra('esgoto', 'pct_area_cana', 'pct_favela');
  return bivariado('esgoto', {
    titulo: () => L('Cana e esgoto', 'Cane and sewers'),
    subtitulo: () => L('As cidades do canavial estão entre as mais ligadas à rede de esgoto', 'Cane-belt towns are among the best connected to the sewer network'),
    descricao: () => L(
      'Parte da área do município com cana-de-açúcar (MapBiomas, coleção 10, 2024) e domicílios com esgoto na rede geral ou em fossa ligada à rede (Censo 2022), em terços dos 645 municípios',
      'Share of municipal area under sugar cane (MapBiomas, collection 10, 2024) and homes with sewage to the mains or to a septic tank linked to it (2022 Census), in thirds of the 645 municipalities'),
    tituloGrade: () => L('CANA × ESGOTO NA REDE, EM TERÇOS', 'CANE × MAINS SEWERAGE, IN THIRDS'),
    eixos: () => ({
      eixoX: L('área com cana', 'area under cane'), eixoY: L('esgoto na rede', 'mains sewerage'),
      terX: tercos('cana', 'cane', e.ter_x, fPct(0)), terY: tercos('domicílios na rede', 'homes on the mains', e.ter_y, fPct(0)),
      unidade: L('municípios em cada casa', 'municipalities in each cell'),
    }),
    chamadas: () => [
      chamada(a, 130, -230, `${a.NM_MUN.toUpperCase()} · ${pc(a.pct_esgoto_rede)}`, `${a.NM_MUN.toUpperCase()} · ${nf(a.pct_esgoto_rede, 1)}%`,
        ['dos domicílios na rede, com', `${nf(a.pct_area_cana, 0)} % da área em cana`], ['of homes on the mains, with', `${nf(a.pct_area_cana, 0)}% of its area under cane`]),
      chamada(b, 180, 200, `${b.NM_MUN.toUpperCase()} · ${pc(b.pct_esgoto_rede, 0)}`, `${b.NM_MUN.toUpperCase()} · ${nf(b.pct_esgoto_rede, 0)}%`,
        ['na rede e quase nenhuma cana:', 'baixo nos dois eixos'], ['on the mains and almost no cane:', 'low on both axes']),
      chamada(c, 110, 210, `${c.NM_MUN.toUpperCase()} · ${pc(c.pct_esgoto_rede, 0)}`, `${c.NM_MUN.toUpperCase()} · ${nf(c.pct_esgoto_rede, 0)}%`,
        [`na rede, com ${nf(c.pct_area_cana, 0)} % em cana:`, 'a exceção do oeste'], [`on the mains, with ${nf(c.pct_area_cana, 0)}% cane:`, 'the western exception']),
    ],
    quarto: () => [dec(op.rho), [L('entre cana e ocupados', 'between cane and workers'), L('como operários', 'employed as operatives')]],
    extras: () => [
      [L('cana × operários', 'cane × operatives'), op],
      [L('cana × moradores em favelas', 'cane × favela residents'), fav],
    ],
    nota: () => L(
      'A cana desenha cidades médias, compactas e operárias, onde a rede chega a quase todos; a periferia metropolitana e a serra ficam no terço de baixo. Os operários vêm da amostra do Censo, com erro maior nos municípios pequenos.',
      'Cane shapes compact, working-class mid-sized towns where the mains reach nearly everyone; the metropolitan fringe and the hills sit in the bottom third. Operatives come from the Census sample, with larger error in small municipalities.'),
    fontes: () => [L('IBGE, Censo 2022: SIDRA 6805 e amostra', 'IBGE, 2022 Census: SIDRA 6805 and sample'), L('MapBiomas, coleção 10 (2024)', 'MapBiomas, collection 10 (2024)'), FONTE_MALHA()],
  });
}

/* ------------------------------------------------------------------ 095 o oeste do boi envelhece */
function boi() {
  const e = C.pr.boi;
  const a = mun('Jales'), b = mun('São José dos Campos'), c = mun('Socorro');
  const pas = extra('boi', 'pct_area_pastagem', 'idade_mediana'), cana = extra('boi', 'pct_area_cana', 'pct_60mais'), jov = extra('boi', 'dens_bovino', 'pct_0a14');
  return bivariado('boi', {
    titulo: () => L('O oeste do boi envelhece', 'Cattle country is greying'),
    subtitulo: () => L('Onde há mais boi por quilômetro quadrado, há mais gente com 60 anos ou mais', 'Where there are more cattle per square kilometre, there are more people aged 60 or over'),
    descricao: () => L(
      'Bovinos por km² (Pesquisa da Pecuária Municipal 2024) e pessoas com 60 anos ou mais (Censo 2022), em terços dos municípios com rebanho informado',
      'Cattle per km² (Municipal Livestock Survey 2024) and people aged 60 or over (2022 Census), in thirds of municipalities with a reported herd'),
    tituloGrade: () => L('BOVINOS × 60 ANOS OU MAIS, EM TERÇOS', 'CATTLE × AGED 60+, IN THIRDS'),
    eixos: () => ({
      eixoX: L('bovinos por km²', 'cattle per km²'), eixoY: L('60 anos ou mais', 'aged 60+'),
      terX: tercos('bovinos/km²', 'cattle/km²', e.ter_x, (v) => nf(v)), terY: tercos('60 anos ou mais', 'aged 60+', e.ter_y, fPct(1)),
      unidade: L('municípios em cada casa', 'municipalities in each cell'),
    }),
    chamadas: () => [
      chamada(a, 140, -200, `${a.NM_MUN.toUpperCase()} · ${nf(a.dens_bovino)} BOIS/KM²`, `${a.NM_MUN.toUpperCase()} · ${nf(a.dens_bovino)} CATTLE/KM²`,
        [`e ${nf(a.pct_60mais, 1)} % da gente com 60 anos`, 'ou mais'], [`and ${nf(a.pct_60mais, 1)}% of people aged`, '60 or over']),
      chamada(b, -40, 270, `${b.NM_MUN.toUpperCase()} · ${nf(b.dens_bovino)} BOIS/KM²`, `${b.NM_MUN.toUpperCase()} · ${nf(b.dens_bovino)} CATTLE/KM²`,
        [`mas só ${nf(b.pct_60mais, 1)} % com 60 ou mais: o leite`, 'do Vale cerca uma cidade jovem'], [`but only ${nf(b.pct_60mais, 1)}% aged 60+: Valley dairy`, 'farms ring a young city']),
      chamada(c, 120, -250, `${c.NM_MUN.toUpperCase()} · ${pc(c.pct_60mais)}`, `${c.NM_MUN.toUpperCase()} · ${nf(c.pct_60mais, 1)}%`,
        ['com 60 anos ou mais, entre', 'pastos de morro'], ['aged 60 or over, among', 'hillside pastures']),
    ],
    semInfo: () => L('sem rebanho informado', 'no reported herd'),
    quarto: () => [dec(cana.rho), [L('entre cana e 60 anos ou mais:', 'between cane and aged 60+:'), L('o padrão é do boi, não do agro', 'the pattern is cattle, not farming')]],
    extras: () => [
      [L('pastagem × idade mediana', 'pasture × median age'), pas],
      [L('bovinos × 0 a 14 anos', 'cattle × aged 0 to 14'), jov],
      [L('cana × 60 anos ou mais', 'cane × aged 60+'), cana],
    ],
    nota: () => L(
      'O pasto emprega pouca gente por hectare: os jovens saem e quem fica envelhece. É uma hipótese que o mapa sustenta, mas não prova; os rebanhos são de 2024 e as idades, de 2022.',
      'Pasture employs few people per hectare: the young leave and those who stay grow old. The map supports this hypothesis but does not prove it; herds are from 2024 and ages from 2022.'),
    fontes: () => [L('IBGE, PPM 2024 (tabela 3939)', 'IBGE, PPM 2024 (table 3939)'), L('IBGE, Censo 2022 (tabelas 9514 e 9515)', 'IBGE, 2022 Census (tables 9514 and 9515)'), L('MapBiomas, coleção 10; Malha Municipal 2025', 'MapBiomas, collection 10; Municipal Mesh 2025')],
  });
}

/* ------------------------------------------------------------------ 096 segregação e desigualdade racial */
function segregacao() {
  const e = C.pr.segregacao;
  const a = mun('Campinas'), b = mun('Diadema'), c = mun('Franca');
  const est = extra('segregacao', 'segregacao_racial', 'hiato_estudo_raca');
  const sem = C.mun.filter((m) => m.segregacao_racial == null).length;
  return bivariado('segregacao', {
    titulo: () => L('Separados e desiguais', 'Apart and unequal'),
    subtitulo: () => L('Nas cidades mais segregadas, a renda dos brancos fica mais longe da dos pardos', 'In the more segregated towns, white incomes sit further above brown ones'),
    descricao: () => L(
      'Índice de dissimilaridade entre brancos e não brancos nos setores censitários de cada município e razão entre a renda domiciliar per capita mediana de brancos e de pardos (Censo 2022), em terços dos municípios',
      'Dissimilarity index between white and non-white residents across each municipality’s census tracts and ratio of white to brown (pardo) median household income per head (2022 Census), in thirds of municipalities'),
    tituloGrade: () => L('SEGREGAÇÃO × RAZÃO DE RENDA, EM TERÇOS', 'SEGREGATION × INCOME RATIO, IN THIRDS'),
    eixos: () => ({
      eixoX: L('segregação', 'segregation'), eixoY: L('renda brancos/pardos', 'white/brown income'),
      terX: tercos('dissimilaridade', 'dissimilarity', e.ter_x, (v) => nf(v, 0)), terY: tercos('razão de renda', 'income ratio', e.ter_y, (v) => L(`${nf(v, 2)}×`, `${nf(v, 2)}×`)),
      unidade: L('municípios em cada casa', 'municipalities in each cell'),
    }),
    chamadas: () => [
      chamada(a, 150, -330, `${a.NM_MUN.toUpperCase()} · ÍNDICE ${nf(a.segregacao_racial, 0)}`, `${a.NM_MUN.toUpperCase()} · INDEX ${nf(a.segregacao_racial, 0)}`,
        [`e renda dos brancos ${nf(a.razao_renda_raca, 1)} vez`, 'a dos pardos'], [`and white income ${nf(a.razao_renda_raca, 1)} times`, 'brown income']),
      chamada(b, 170, 230, `${b.NM_MUN.toUpperCase()} · ÍNDICE ${nf(b.segregacao_racial, 0)}`, `${b.NM_MUN.toUpperCase()} · INDEX ${nf(b.segregacao_racial, 0)}`,
        [`e razão de ${nf(b.razao_renda_raca, 2)}: a periferia`, 'é mais misturada e mais igual'], [`and a ratio of ${nf(b.razao_renda_raca, 2)}: the fringe`, 'is more mixed and more equal']),
    ],
    semInfo: () => L('menos de 10 setores', 'fewer than 10 tracts'),
    quarto: () => [dec(est.rho), [L('entre segregação e hiato', 'between segregation and the'), L('racial de anos de estudo', 'racial gap in schooling')]],
    extras: () => [[L('segregação × hiato de estudo', 'segregation × schooling gap'), est]],
    nota: () => L(
      `O índice vai de 0 (mistura perfeita) a 100; só entra o município com 10 setores ou mais (${nf(sem)} ficam hachurados). A razão de renda vem da amostra do Censo e oscila nos municípios pequenos. O mapa não diz se a segregação produz a desigualdade ou o contrário.`,
      `The index runs from 0 (perfect mix) to 100; only municipalities with 10 tracts or more count (${nf(sem)} are hatched). The income ratio comes from the Census sample and wobbles in small municipalities. The map does not say whether segregation produces inequality or the reverse.`),
    fontes: () => [L('IBGE, Censo 2022: setores (cor ou raça)', 'IBGE, 2022 Census: tracts (colour or race)'), L('IBGE, Censo 2022: SIDRA 10295 e 10062 (amostra)', 'IBGE, 2022 Census: SIDRA 10295 and 10062 (sample)'), FONTE_MALHA()],
  });
}

/* ------------------------------------------------------------------ 097 verticalização e desigualdade */
function vertical() {
  const e = C.pr.vertical;
  const a = mun('São Paulo'), b = mun('Barueri'), c = mun('Cordeirópolis');
  const sem = C.mun.filter((m) => m.pct_apartamento === 0).length;
  const renda = extra('vertical', 'cv_renda_setores', 'renda_pc_media');
  return bivariado('vertical', {
    titulo: () => L('O prédio e a desigualdade', 'High-rises and inequality'),
    subtitulo: () => L('Quanto mais a cidade sobe, mais a renda varia de um bairro para outro', 'The higher a town builds, the more income varies from one neighbourhood to the next'),
    descricao: () => L(
      'Desigualdade de renda entre setores censitários (coeficiente de variação do rendimento médio dos responsáveis, ponderado) e domicílios em apartamento (Censo 2022), em terços dos municípios com 10 setores ou mais',
      'Income inequality between census tracts (weighted coefficient of variation of household heads’ mean income) and homes in flats (2022 Census), in thirds of municipalities with 10 tracts or more'),
    tituloGrade: () => L('DESIGUALDADE × APARTAMENTOS, EM TERÇOS', 'INEQUALITY × FLATS, IN THIRDS'),
    eixos: () => ({
      eixoX: L('desigualdade entre setores', 'inequality between tracts'), eixoY: L('apartamentos', 'flats'),
      terX: tercos('coef. de variação', 'coef. of variation', e.ter_x, (v) => nf(v, 2)),
      terY: L(['terços de apartamentos:', `nenhum, até ${nf(e.ter_y[1], 1)} %`, `e mais de ${nf(e.ter_y[1], 1)} %`], ['thirds of flats:', `none, up to ${nf(e.ter_y[1], 1)}%`, `and over ${nf(e.ter_y[1], 1)}%`]),
      unidade: L('municípios em cada casa', 'municipalities in each cell'),
    }),
    chamadas: () => [
      chamada(a, 170, 220, `SÃO PAULO · ${pc(a.pct_apartamento, 0)}`, `SÃO PAULO · ${nf(a.pct_apartamento, 0)}%`,
        ['dos domicílios em apartamento', `e coeficiente de ${nf(a.cv_renda_setores, 2)}`], ['of homes are flats, with a', `coefficient of ${nf(a.cv_renda_setores, 2)}`]),
      chamada(b, -220, 330, `${b.NM_MUN.toUpperCase()} · ${pc(b.pct_apartamento, 0)}`, `${b.NM_MUN.toUpperCase()} · ${nf(b.pct_apartamento, 0)}%`,
        ['em apartamento e coeficiente de', `${nf(b.cv_renda_setores, 2)}, o maior acima de 200 mil hab.`], ['in flats and a coefficient of', `${nf(b.cv_renda_setores, 2)}, the highest above 200,000`]),
      chamada(c, -200, -220, `${c.NM_MUN.toUpperCase()} · ${pc(c.pct_apartamento, 1)}`, `${c.NM_MUN.toUpperCase()} · ${nf(c.pct_apartamento, 1)}%`,
        ['em apartamento e renda', 'parecida em toda a cidade'], ['in flats and similar incomes', 'across the whole town']),
    ],
    // Além dos de menos de 10 setores, 18 municípios ficam sem a parte de apartamentos.
    semInfo: () => L('sem informação', 'no data'),
    quarto: () => [nf(sem), [L('municípios sem nenhum', 'municipalities with no'), L('domicílio em apartamento', 'homes in flats at all')]],
    extras: () => [[L('desigualdade × renda per capita', 'inequality × income per head'), renda]],
    nota: () => L(
      'A desigualdade entre setores cresce com o tamanho da cidade; descontados urbanização, densidade e renda, o prédio ainda acompanha a distância entre bairros ricos e pobres. Municípios com menos de 10 setores ficam hachurados.',
      'Inequality between tracts grows with town size; net of urbanisation, density and income, high-rises still track the gap between rich and poor neighbourhoods. Municipalities with fewer than 10 tracts are hatched.'),
    fontes: () => [L('IBGE, Censo 2022: setores (renda e domicílios)', 'IBGE, 2022 Census: tracts (income and households)'), FONTE_MALHA()],
  });
}

/* ------------------------------------------------------------------ 098 a cor da juventude (APOND na metrópole) */
async function juventude() {
  await usarRegiao('censo-cruzado-sp-metropole');
  const M = C.metropole, e = C.pr.juventude;
  const base = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', 'censo-cruzado-sp-metropole-base.json'), 'utf8'));
  const ap = M.feats;
  const com = ap.filter((f) => f.properties.b != null), sem = ap.filter((f) => f.properties.b == null);
  const cor = (b) => BIV[(b % 10) - 1][Math.floor(b / 10) - 1];
  const nomeAp = (o) => C.mun.find((m) => m.CD_MUN === o.CD_MUN)?.NM_MUN ?? '';
  const j = M.jovem, v = M.velha;
  const DESTAQUES = [['3518800', 'GUARULHOS'], ['3534401', 'OSASCO'], ['3547809', 'SANTO ANDRÉ'], ['3530607', 'MOGI DAS CRUZES'], ['3548500', 'SANTOS']];
  // Título, eixos e terços da grade, comuns ao painel e à figura.
  const eixos = () => ({
    titulo: L('0 A 14 ANOS × PRETOS E PARDOS, EM TERÇOS', 'AGED 0–14 × BLACK AND BROWN, IN THIRDS'),
    eixoX: L('0 a 14 anos', 'aged 0–14'), eixoY: L('pretos e pardos', 'black and brown'),
    terX: tercos('0 a 14 anos', 'aged 0–14', M.ter_x, fPct(0)), terY: tercos('pretos e pardos', 'black and brown', M.ter_y, fPct(0)),
  });
  return () => ({
    layout: 'um',
    motivo: friso,
    serie: serie('juventude'),
    pad: 20,
    titulo: () => L('A cor da juventude', 'The colour of youth'),
    subtitulo: () => L('Na metrópole, as áreas com mais crianças são as mais negras; quanto menor a escala, mais forte o laço', 'In the metropolis, the areas with most children are the blackest; the finer the scale, the stronger the link'),
    descricao: () => L(
      `Pessoas de 0 a 14 anos e pessoas pretas e pardas por área de ponderação do Censo 2022 (APOND com mil moradores ou mais), em terços das ${nf(M.n_apond)} áreas dos ${nf(M.n_mun)} municípios das concentrações urbanas de São Paulo e de Santos`,
      `People aged 0 to 14 and black and brown (preto and pardo) people by 2022 Census weighting area (areas with 1,000 residents or more), in thirds of the ${nf(M.n_apond)} areas in the ${nf(M.n_mun)} municipalities of the São Paulo and Santos urban concentrations`),
    mapa: () => ({
      preencher: () => NEUTRO,
      bordaMunicipio: 0.6,
      semRgint: true,
      tamanhoCapital: 18,
      camadas: [
        { feats: com, cor: (f) => cor(f.properties.b), borda: '#ffffff', largura: 0.5 },
        { feats: sem, hachura: HACHURA, borda: 'none' },
        { feats: base.unidades.features, cor: 'none', borda: TINTA, largura: 0.9, opacidade: 1 },
      ],
      destaques: DESTAQUES.map(([cd, t]) => ({ cd, texto: t })),
      tamanhoDestaque: 13,
      chamadas: [
        {
          coord: j.pt, dx: 240, dy: -150, tamanho: 16,
          titulo: L(`${nomeAp(j).toUpperCase()} · ${nf(j.pct_0a14, 0)} % DE 0 A 14`, `${nomeAp(j).toUpperCase()} · ${nf(j.pct_0a14, 0)}% AGED 0–14`),
          linhas: L([`e ${nf(j.pct_pretos_pardos, 0)} % pretos e pardos: a área`, 'mais jovem da metrópole'], [`and ${nf(j.pct_pretos_pardos, 0)}% black and brown: the`, 'youngest area in the metropolis']),
        },
        {
          coord: v.pt, dx: 160, dy: 120, tamanho: 16,
          titulo: L(`SANTOS · ${nf(v.pct_0a14, 0)} % DE 0 A 14`, `SANTOS · ${nf(v.pct_0a14, 0)}% AGED 0–14`),
          linhas: L([`e ${nf(v.pct_pretos_pardos, 0)} % pretos e pardos: a área`, 'com menos crianças da metrópole'], [`and ${nf(v.pct_pretos_pardos, 0)}% black and brown: the area`, 'with fewest children in the metropolis']),
        },
      ],
    }),
    numeros: () => [
      [dec(M.rho_janela.rho), [L(`nas ${nf(M.n_apond)} áreas`, `across the ${nf(M.n_apond)} areas`), L('da metrópole (Spearman)', 'of the metropolis (Spearman)')]],
      [dec(M.rho_estado.rho), [L(`nas ${nf(M.rho_estado.n)} áreas`, `across the state’s`), L('de ponderação do estado', `${nf(M.rho_estado.n)} weighting areas`)]],
      [dec(e.rho), [L(`nos ${nf(e.n)} municípios;`, `across the ${nf(e.n)} municipalities;`), L(`${dec(M.rho_mun_janela.rho)} nos ${nf(M.n_mun)} da metrópole`, `${dec(M.rho_mun_janela.rho)} in the ${nf(M.n_mun)} metropolitan ones`)]],
      [nf(M.casas[2][2]), [L('áreas no terço de cima', 'areas in the top third'), L('das duas variáveis', 'of both variables')]],
    ],
    legendaFigura: () => gradeFigura(M.casas, eixos(), L('área com menos de mil moradores', 'area with under 1,000 residents')),
    painel: (y) => {
      const s = [];
      const g = grade(M.casas, y, { ...eixos(), unidade: L('áreas de ponderação em cada casa', 'weighting areas in each cell') });
      s.push(g.svg);
      let yy = g.y + 4;
      s.push(caixaLegenda(null, L(`área com menos de mil moradores (${nf(sem.length)})`, `area with under 1,000 residents (${nf(sem.length)})`), yy, { hachura: true }));
      yy += 30;
      // A mesma correlação em três escalas.
      s.push(rotuloPainel(L('O MESMO PAR EM TRÊS ESCALAS (SPEARMAN)', 'THE SAME PAIR AT THREE SCALES (SPEARMAN)'), yy));
      const b = barras([
        [L('municípios do estado', 'state municipalities'), e.rho, BIV[1][1], `${dec(e.rho)} · ${nf(e.n)}`],
        [L('municípios da metrópole', 'metropolitan municipalities'), M.rho_mun_janela.rho, BIV[1][1], `${dec(M.rho_mun_janela.rho)} · ${nf(M.rho_mun_janela.n)}`],
        [L('APOND do estado', 'state weighting areas'), M.rho_estado.rho, BIV[2][2], `${dec(M.rho_estado.rho)} · ${nf(M.rho_estado.n)}`],
        [L('APOND da metrópole', 'metropolitan areas'), M.rho_janela.rho, BIV[2][2], `${dec(M.rho_janela.rho)} · ${nf(M.rho_janela.n)}`],
      ], yy + 14, { max: 1.25, x0: 230, passo: 20 });
      s.push(b.svg);
      const n = nota(L(
        `Escala e agregação mudam a força da correlação (o problema da unidade de área modificável): no município ela é ${dec(e.rho)}; descontadas urbanização, densidade e renda, ${dec(e.parcial)}. ${ECOLOGICA()} Fecundidade maior, renda menor e moradia mais barata podem pesar juntas.`,
        `Scale and aggregation change the strength of a correlation (the modifiable areal unit problem): by municipality it is ${dec(e.rho)}; net of urbanisation, density and income, ${dec(e.parcial)}. ${ECOLOGICA()} Higher fertility, lower income and cheaper housing may weigh together.`), b.y + 14, { tamanho: 14 });
      s.push(n.svg);
      return { svg: s.join('\n'), y: n.y };
    },
    fontes: () => [L('IBGE, Censo 2022: setores (idade, cor ou raça)', 'IBGE, 2022 Census: tracts (age, colour or race)'), L('IBGE, Áreas de Ponderação 2022', 'IBGE, 2022 Weighting Areas'), FONTE_MALHA()],
  });
}

/* ------------------------------------------------------------------ 099 envelhecer sozinho */
function sozinho() {
  const e = C.pr.sozinho;
  const a = mun('Santos'), b = mun('Ubatuba'), c = mun('Dracena');
  const ap = C.metropole.rho_sozinho_estado;
  return bivariado('sozinho', {
    titulo: () => L('Envelhecer sozinho', 'Growing old alone'),
    subtitulo: () => L('Onde a população é mais velha, mais casas têm um morador só', 'Where the population is older, more homes have a single resident'),
    descricao: () => L(
      'Pessoas com 60 anos ou mais e domicílios particulares ocupados com um único morador (Censo 2022), em terços dos 645 municípios',
      'People aged 60 or over and occupied private homes with a single resident (2022 Census), in thirds of the 645 municipalities'),
    tituloGrade: () => L('60 ANOS OU MAIS × MORA SÓ, EM TERÇOS', 'AGED 60+ × LIVING ALONE, IN THIRDS'),
    eixos: () => ({
      eixoX: L('60 anos ou mais', 'aged 60+'), eixoY: L('casas de um morador', 'one-person homes'),
      terX: tercos('60 anos ou mais', 'aged 60+', e.ter_x, fPct(1)), terY: tercos('um morador', 'one resident', e.ter_y, fPct(1)),
      unidade: L('municípios em cada casa', 'municipalities in each cell'),
    }),
    chamadas: () => [
      chamada(a, -150, 220, `SANTOS · ${pc(a.pct_unipessoal, 0)}`, `SANTOS · ${nf(a.pct_unipessoal, 0)}%`,
        ['das casas com um morador e', `${nf(a.pct_60mais, 0)} % da gente com 60 ou mais`], ['of homes with one resident and', `${nf(a.pct_60mais, 0)}% of people aged 60+`]),
      chamada(b, -20, 160, `${b.NM_MUN.toUpperCase()} · ${pc(b.pct_unipessoal, 0)}`, `${b.NM_MUN.toUpperCase()} · ${nf(b.pct_unipessoal, 0)}%`,
        ['com um morador, mas só', `${nf(b.pct_60mais, 0)} % da gente com 60 ou mais`], ['with one resident, but only', `${nf(b.pct_60mais, 0)}% of people aged 60+`]),
      chamada(c, 40, -380, `${c.NM_MUN.toUpperCase()} · ${pc(c.pct_60mais, 0)}`, `${c.NM_MUN.toUpperCase()} · ${nf(c.pct_60mais, 0)}%`,
        [`com 60 ou mais e ${nf(c.pct_unipessoal, 0)} % das`, 'casas com um morador'], [`aged 60+ and ${nf(c.pct_unipessoal, 0)}% of`, 'homes with one resident']),
    ],
    quarto: () => [dec(ap.rho), [L(`nas ${nf(ap.n)} áreas de`, `across the state’s ${nf(ap.n)}`), L('ponderação do estado', 'weighting areas')]],
    nota: () => L(
      'O par se mantém fora da metrópole e dentro das cidades, por área de ponderação. Não se sabe, pelo agregado, se quem mora só é o idoso; viuvez e saída dos filhos são as hipóteses de sempre.',
      'The pair holds outside the metropolis and within towns, by weighting area. The aggregate cannot tell whether those living alone are the elderly; widowhood and children moving out are the usual hypotheses.'),
    fontes: () => [L('IBGE, Censo 2022: setores (idade e domicílios)', 'IBGE, 2022 Census: tracts (age and households)'), L('IBGE, Áreas de Ponderação 2022', 'IBGE, 2022 Weighting Areas'), FONTE_MALHA()],
  });
}

/* ------------------------------------------------------------------ 100 letras e enxada */
function letras() {
  const e = C.pr.letras;
  const a = mun('Dois Córregos'), b = mun('São Miguel Arcanjo'), sp = mun('São Paulo');
  const an = extra('letras', 'pct_ocup_agro', 'pct_analfabeto'), cana = extra('letras', 'pct_area_cana', 'hiato_analfabetismo');
  return bivariado('letras', {
    titulo: () => L('As letras e a enxada', 'Letters and the hoe'),
    subtitulo: () => L('Onde mais gente trabalha no campo, maior o hiato entre o analfabetismo de negros e o de brancos', 'Where more people work the land, the wider the gap between black and white illiteracy'),
    descricao: () => L(
      'Ocupados como trabalhadores qualificados da agropecuária (Censo 2022, amostra) e taxa de analfabetismo de pretos e pardos menos a de brancos, 15 anos ou mais (Censo 2022, universo), em terços dos 645 municípios',
      'Employed people working as skilled farm workers (2022 Census, sample) and the illiteracy rate of black and brown people minus that of white people, aged 15+ (2022 Census, universe), in thirds of the 645 municipalities'),
    tituloGrade: () => L('AGROPECUÁRIA × HIATO DE ANALFABETISMO', 'FARMING × ILLITERACY GAP'),
    eixos: () => ({
      eixoX: L('ocupados no campo', 'farm workers'), eixoY: L('hiato racial', 'racial gap'),
      terX: tercos('ocupados no campo', 'farm workers', e.ter_x, fPct(1)), terY: tercos('hiato (pontos)', 'gap (points)', e.ter_y, (v) => nf(v, 1)),
      unidade: L('municípios em cada casa', 'municipalities in each cell'),
    }),
    chamadas: () => [
      chamada(a, -160, -240, `${a.NM_MUN.toUpperCase()} · ${nf(a.hiato_analfabetismo, 1)} PONTOS`, `${a.NM_MUN.toUpperCase()} · ${nf(a.hiato_analfabetismo, 1)} POINTS`,
        ['de hiato, com', `${nf(a.pct_ocup_agro, 1)} % dos ocupados no campo`], ['of gap, with', `${nf(a.pct_ocup_agro, 1)}% of workers on the land`]),
      chamada(b, 150, 210, `${b.NM_MUN.toUpperCase()} · ${pc(b.pct_ocup_agro, 0)}`, `${b.NM_MUN.toUpperCase()} · ${nf(b.pct_ocup_agro, 0)}%`,
        ['dos ocupados no campo e hiato', `de ${nf(b.hiato_analfabetismo, 1)} ponto, no terço de baixo`], ['of workers on the land and a gap', `of ${nf(b.hiato_analfabetismo, 1)} points, in the bottom third`]),
      chamada(sp, 170, 220, `SÃO PAULO · ${nf(sp.hiato_analfabetismo, 1)} PONTOS`, `SÃO PAULO · ${nf(sp.hiato_analfabetismo, 1)} POINTS`,
        ['de hiato, no terço de baixo'], ['of gap, in the bottom third']),
    ],
    quarto: () => [dec(an.rho), [L('entre campo e analfabetismo', 'between farm work and overall'), L(`geral; parcial ${dec(an.parcial)}`, `illiteracy; partial ${dec(an.parcial)}`)]],
    extras: () => [
      [L('campo × analfabetismo geral', 'farm work × overall illiteracy'), an],
      [L('cana × hiato de analfabetismo', 'cane × illiteracy gap'), cana],
    ],
    nota: () => L(
      'O hiato é a diferença em pontos percentuais e só entra onde os dois grupos somam 200 pessoas ou mais. Os ocupados no campo vêm da amostra do Censo, com erro maior nos municípios pequenos; o analfabetismo é do universo.',
      'The gap is the difference in percentage points and counts only where both groups have 200 people or more. Farm workers come from the Census sample, with larger error in small municipalities; illiteracy is from the full count.'),
    fontes: () => [L('IBGE, Censo 2022: SIDRA 9542 (universo)', 'IBGE, 2022 Census: SIDRA 9542 (full count)'), L('IBGE, Censo 2022: SIDRA 10264 (amostra)', 'IBGE, 2022 Census: SIDRA 10264 (sample)'), FONTE_MALHA()],
  });
}

/* ------------------------------------------------------------------ 101 casas de veraneio sem esgoto */
function veraneio() {
  const e = C.pr.veraneio;
  const a = mun('Ibiúna'), b = mun('Praia Grande'), c = mun('Ubatuba');
  const fos = extra('veraneio', 'pct_uso_ocasional', 'pct_fossa_rudimentar'), poco = extra('veraneio', 'pct_uso_ocasional', 'pct_poco');
  return bivariado('veraneio', {
    titulo: () => L('Veraneio sem esgoto', 'Holiday homes, no mains'),
    subtitulo: () => L('Onde há mais casas de uso ocasional, menos domicílios estão ligados à rede de esgoto', 'Where there are more occasional-use homes, fewer homes are connected to the sewer network'),
    descricao: () => L(
      'Domicílios de uso ocasional, sobre todos os domicílios, e domicílios ocupados sem esgoto na rede geral nem em fossa ligada a ela (Censo 2022), em terços dos 645 municípios',
      'Occasional-use homes, over all homes, and occupied homes with sewage neither to the mains nor to a septic tank linked to them (2022 Census), in thirds of the 645 municipalities'),
    tituloGrade: () => L('USO OCASIONAL × SEM ESGOTO NA REDE', 'OCCASIONAL USE × OFF THE MAINS'),
    eixos: () => ({
      eixoX: L('uso ocasional', 'occasional use'), eixoY: L('sem esgoto na rede', 'off the mains'),
      terX: tercos('uso ocasional', 'occasional use', e.ter_x, fPct(0)), terY: tercos('fora da rede', 'off the mains', e.ter_y, fPct(0)),
      unidade: L('municípios em cada casa', 'municipalities in each cell'),
    }),
    chamadas: () => [
      chamada(a, -170, 210, `${a.NM_MUN.toUpperCase()} · ${pc(a.pct_sem_esgoto_rede, 0)}`, `${a.NM_MUN.toUpperCase()} · ${nf(a.pct_sem_esgoto_rede, 0)}%`,
        ['fora da rede e', `${nf(a.pct_uso_ocasional, 0)} % de casas de uso ocasional`], ['off the mains and', `${nf(a.pct_uso_ocasional, 0)}% occasional-use homes`]),
      chamada(b, 120, 190, `${b.NM_MUN.toUpperCase()} · ${pc(b.pct_uso_ocasional, 0)}`, `${b.NM_MUN.toUpperCase()} · ${nf(b.pct_uso_ocasional, 0)}%`,
        [`de uso ocasional e só ${nf(b.pct_sem_esgoto_rede, 0)} % fora`, 'da rede: a praia saneada'], [`occasional use and only ${nf(b.pct_sem_esgoto_rede, 0)}% off`, 'the mains: a sewered beach']),
      chamada(c, -40, -240, `${c.NM_MUN.toUpperCase()} · ${pc(c.pct_uso_ocasional, 0)}`, `${c.NM_MUN.toUpperCase()} · ${nf(c.pct_uso_ocasional, 0)}%`,
        [`de uso ocasional e ${nf(c.pct_sem_esgoto_rede, 0)} % fora da rede`], [`occasional use and ${nf(c.pct_sem_esgoto_rede, 0)}% off the mains`]),
    ],
    quarto: () => [dec(fos.rho), [L('entre uso ocasional e', 'between occasional use and'), L('fossa rudimentar', 'cesspits')]],
    extras: () => [
      [L('uso ocasional × fossa rudimentar', 'occasional use × cesspit'), fos],
      [L('uso ocasional × poço', 'occasional use × well'), poco],
    ],
    nota: () => L(
      'O esgoto conta só os domicílios ocupados; a casa de veraneio vazia no dia do Censo não entra nele. A serra, a represa e o litoral norte têm chácaras e casas de praia longe da rede; a Baixada Santista mostra que dá para ter as duas coisas.',
      'Sewerage counts only occupied homes; a holiday home empty on Census day is not in it. The hills, the reservoirs and the north coast have country and beach houses far from the mains; the Santos lowlands show both can go together.'),
    fontes: () => [L('IBGE, Censo 2022: SIDRA 6805 (esgoto)', 'IBGE, 2022 Census: SIDRA 6805 (sewerage)'), L('IBGE, Censo 2022: setores (básico)', 'IBGE, 2022 Census: tracts (basic)'), FONTE_MALHA()],
  });
}

/* ------------------------------------------------------------------ 102 pau de arara */
function paudearara() {
  const e = C.pr.paudearara, P = C.pau;
  const classe = (v) => { let i = 0; while (i < LIM_PAU.length && v > LIM_PAU[i] + 1e-9) i++; return i; };
  const com = C.mun.filter((m) => m.pct_pau_de_arara != null);
  const zero = com.filter((m) => m.pct_pau_de_arara === 0).length;
  const n = new Array(LIM_PAU.length + 1).fill(0);
  for (const m of com) if (m.pct_pau_de_arara > 0) n[classe(m.pct_pau_de_arara)]++;
  const top = [...com].filter((m) => m.pessoas >= 5000).sort((a, b) => b.pct_pau_de_arara - a.pct_pau_de_arara);
  const umPct = com.filter((m) => m.pct_pau_de_arara >= 1).length;
  const a = top[0];
  const cana = extra('paudearara', 'pct_pau_de_arara', 'pct_area_cana'), bio = extra('paudearara', 'pct_pau_de_arara', 'pct_bioeconomia');
  const rot = () => L(['zero', 'até 0,25 %', '0,25 a 0,5 %', '0,5 a 1 %', '1 a 2 %', 'mais de 2 %'], ['zero', 'up to 0.25%', '0.25 to 0.5%', '0.5 to 1%', '1 to 2%', 'over 2%']);
  const terc = () => L(['terço de baixo', 'terço do meio', 'terço de cima'], ['bottom third', 'middle third', 'top third']);
  return () => ({
    layout: 'um',
    motivo: friso,
    serie: serie('paudearara'),
    titulo: () => L('O pau de arara', 'The open truck to work'),
    subtitulo: () => L('Ir trabalhar na carroceria ainda é coisa do campo e de quem estudou menos', 'Riding to work in the back of a truck is still a matter of the countryside and of less schooling'),
    descricao: () => L(
      'Ocupados que vão ao trabalho de caminhonete ou caminhão adaptado, sobre os que se deslocam para trabalhar (Censo 2022, amostra), por município',
      'Employed people who travel to work by adapted pickup or lorry, over those who commute to work (2022 Census, sample), by municipality'),
    mapa: () => ({
      preencher: (cd) => { const m = POR.get(cd); if (!m || m.pct_pau_de_arara == null) return null; return m.pct_pau_de_arara === 0 ? ZERO : CORES_PAU[classe(m.pct_pau_de_arara)]; },
      bordaMunicipio: 0.5,
      chamadas: [
        chamada(a, -170, -230, `${a.NM_MUN.toUpperCase()} · ${pc(a.pct_pau_de_arara)}`, `${a.NM_MUN.toUpperCase()} · ${nf(a.pct_pau_de_arara, 1)}%`,
          ['dos ocupados vão de pau de arara:', 'a maior taxa entre os de 5 mil hab.'], ['of workers ride an open truck: the', 'highest rate in towns of 5,000+']),
      ],
    }),
    // As classes do painel, sem as contagens de municípios.
    legendaFigura: () => {
      const titulo = L('OCUPADOS QUE VÃO DE PAU DE ARARA', 'WORKERS WHO RIDE OPEN TRUCKS');
      const itens = [[ZERO, rot()[0]], ...CORES_PAU.map((cor, i) => [cor, rot()[i + 1]])];
      const s = [rotuloPainel(titulo, 0)];
      itens.forEach(([cor, r], i) => s.push(caixaLegenda(cor, r, 24 + i * 24)));
      const larg = Math.max(largura(titulo, 15, { mono: true, espaco: 2.4 }), ...itens.map(([, r]) => 42 + largura(r, 16)));
      return { svg: s.join('\n'), altura: 24 + (itens.length - 1) * 24 + 6, largura: Math.ceil(larg) };
    },
    numeros: () => [
      [nf(umPct), [L('municípios com 1 % ou mais', 'municipalities with 1% or more'), L('dos ocupados no pau de arara', 'of workers riding open trucks')]],
      [dec(e.rho), [L('com quem não tem fundamental', 'with no completed primary'), L(`completo; parcial ${dec(e.parcial)}`, `schooling; partial ${dec(e.parcial)}`)]],
      [dec(bio.rho), [L('com o emprego formal', 'with formal jobs in'), L('na bioeconomia', 'the bioeconomy')]],
      [nf(zero), [L('municípios onde a amostra', 'municipalities where the sample'), L('não achou nenhum', 'found none')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('OCUPADOS QUE VÃO DE PAU DE ARARA', 'WORKERS WHO RIDE OPEN TRUCKS'), y)];
      let yy = y + 24;
      const itens = [[ZERO, rot()[0], zero], ...CORES_PAU.map((cor, i) => [cor, rot()[i + 1], n[i]])];
      for (const [cor, r, v] of itens) {
        s.push(`<rect x="0" y="${yy - 14}" width="30" height="17" fill="${cor}" stroke="#1a211a" stroke-width=".6"/>`);
        s.push(`<text x="42" y="${yy}" font-family="${SERIF}" font-size="16">${esc(r)}</text>`);
        s.push(`<text x="${LP}" y="${yy}" text-anchor="end" font-family="${MONO}" font-size="13">${esc(`${nf(v)} mun.`)}</text>`);
        yy += 24;
      }
      yy += 12;
      const blocos = [
        [L('POR TERÇO DE SEM FUNDAMENTAL COMPLETO', 'BY THIRD OF NO COMPLETED PRIMARY'), P.sem_fundamental],
        [L('POR TERÇO DE ÁREA COM CANA', 'BY THIRD OF AREA UNDER CANE'), P.cana],
        [L('POR TERÇO DE EMPREGO NA BIOECONOMIA', 'BY THIRD OF BIOECONOMY JOBS'), P.bioeconomia],
      ];
      for (const [t, d] of blocos) {
        s.push(rotuloPainel(t, yy));
        const b = barras(d.media.map((v, i) => [terc()[i], v, CORES_PAU[2 + i], L(`${nf(v, 2)} %`, `${nf(v, 2)}%`)]), yy + 12, { max: Math.max(...P.sem_fundamental.media, ...P.cana.media, ...P.bioeconomia.media) * 1.3, x0: 140, passo: 18 });
        s.push(b.svg);
        yy = b.y + 14;
      }
      const nt = nota(L(
        `Média simples dos municípios em cada terço. ${ECOLOGICA()} O dado vem da amostra do Censo e trata de poucas pessoas: em município pequeno, um caminhão a mais ou a menos muda a taxa. Por isso o mapa usa classes largas.`,
        `Simple mean of the municipalities in each third. ${ECOLOGICA()} The figure comes from the Census sample and covers few people: in a small municipality, one truck more or less changes the rate. Hence the broad classes.`), yy + 4, { tamanho: 14 });
      s.push(nt.svg);
      return { svg: s.join('\n'), y: nt.y };
    },
    fontes: () => [L('IBGE, Censo 2022: SIDRA 10332 e 10061 (amostra)', 'IBGE, 2022 Census: SIDRA 10332 and 10061 (sample)'), L('MTE, RAIS 2025; MapBiomas, coleção 10', 'MTE, RAIS 2025; MapBiomas, collection 10'), FONTE_MALHA()],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { solar, esgoto, boi, segregacao, vertical, juventude, sozinho, letras, veraneio, paudearara };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/censo-cruzado-sp/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
const e = SERIE.find((s) => s.tema === nome);
const fazer = await TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => fazer() });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `censo-cruzado-sp-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
