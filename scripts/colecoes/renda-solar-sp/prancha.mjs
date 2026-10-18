#!/usr/bin/env node
/**
 * Coleção «Renda e sol nos telhados» — desenha uma prancha a partir do cache de preparar.mjs (uso interno).
 *
 *   node --max-old-space-size=8192 scripts/colecoes/renda-solar-sp/prancha.mjs setores|apond|solar
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { RAIZ, LP, SERIF, MONO, TINTA, CINZA, esc, nf, f1, gerarPrancha, rotuloPainel, usarRegiao } from '../lib/prancha-sp.mjs';
import { lerRaster } from '../lib/raster.mjs';
import { L, NEUTRO, ZERO, HACHURA, pct, grande, barras, legendaBarras, caixaLegenda, nota } from '../lib/painel.mjs';

const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'renda-solar-sp', 'serie.json'), 'utf8'));
const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `renda-solar-sp-${nome}.json`), 'utf8'));
const serie = (i) => () => L(`RENDA E SOL NOS TELHADOS · ${i}/3`, `INCOME AND ROOFTOP SOLAR · ${i}/3`);
const reais = (v) => L(`R$ ${nf(v)}`, `R$ ${nf(v)}`);
const rotSM = () => L(['até 1 SM', '1 a 1,5 SM', '1,5 a 2 SM', '2 a 3 SM', '3 a 5 SM', 'mais de 5 SM'], ['up to 1 min. wage', '1 to 1.5 min. wages', '1.5 to 2 min. wages', '2 to 3 min. wages', '3 to 5 min. wages', 'over 5 min. wages']);

/* ------------------------------------------------------------------ 1/3 renda mediana por setor */
async function setores() {
  const c = await ler('setores');
  const r = await lerRaster('grade-renda-solar-sp-mediana');
  const corDe = (v) => (v >= 1 && v <= 6 ? c.cores[v - 1] : v === 253 ? ZERO : null);
  const tot = c.tot_resp;
  const ate15 = c.resp[0] + c.resp[1];
  const rg = c.rgint;
  const pp = rg[0], cps = rg.at(-1);
  const ig = c.pobres_mun[0];
  return () => ({
    layout: 'um',
    motivo: 'telhados',
    serie: serie(1),
    raster: { r, modo: 'classes', cor: corDe, recorte: 'limite', fator: 2 },
    titulo: () => L('Quanto ganha quem responde pela casa', 'What the head of household earns'),
    subtitulo: () => L('O salário mínimo é a régua de um terço do estado', 'The minimum wage is the yardstick for a third of the state'),
    descricao: () => L(
      `Rendimento nominal mediano mensal das pessoas responsáveis pelo domicílio, com rendimento, em cada setor censitário, em salários mínimos de 2022 (R$ ${nf(c.sm)}), Censo 2022`,
      `Median monthly nominal income of household heads with income in each census tract, in 2022 minimum wages (R$ ${nf(c.sm)}), 2022 Census`),
    mapa: () => ({
      preencher: () => NEUTRO,
      bordaMunicipio: 0,
      bordaSobreRaster: '#ffffff',
      larguraSobreRaster: 0.45,
      opacidadeSobreRaster: 0.8,
      bordaRgint: 1.5,
      camadas: [{ feats: c.semInfoFeats, hachura: HACHURA, borda: 'none' }],
      chamadas: [{
        cd: ig.CD_MUN, dx: -150, dy: 190, tamanho: 16,
        titulo: L(`${ig.NM_MUN.toUpperCase()} · ${nf(ig.pct_ate15, 0)} %`, `${ig.NM_MUN.toUpperCase()} · ${nf(ig.pct_ate15, 0)}%`),
        linhas: L(['dos responsáveis em setores', 'com mediana de até 1,5 SM'], ['of household heads in tracts', 'with a median of up to 1.5 min. wages']),
      }],
    }),
    numeros: () => [
      [pct((100 * ate15) / tot, 0), [L('dos responsáveis vivem em', 'of household heads live in'), L('setores de até 1,5 SM', 'tracts of up to 1.5 min. wages')]],
      [nf(c.n_iguais_sm), [L('setores com a mediana', 'tracts whose median is'), L(`de R$ ${nf(c.sm)}, um SM exato`, `R$ ${nf(c.sm)}, exactly one minimum wage`)]],
      [pct(pp.pct_ate15, 0), [L(`em ${pp.NM_RGINT}`, `in ${pp.NM_RGINT}`), L(`e ${pct(cps.pct_ate15, 0)} em ${cps.NM_RGINT}`, `and ${pct(cps.pct_ate15, 0)} in ${cps.NM_RGINT}`)]],
      [grande(c.resp[5]), [L('responsáveis em setores', 'household heads in tracts'), L('de mais de 5 SM', 'of over 5 min. wages')]],
    ],
    painel: (y) => {
      const itens = c.cores.map((k, i) => [k, rotSM()[i], c.resp[i], tot]);
      const lg = legendaBarras(itens, y, { titulo: L('MEDIANA DO SETOR, EM SALÁRIOS MÍNIMOS', 'TRACT MEDIAN, IN MINIMUM WAGES'), rotuloValor: L('parte dos responsáveis do estado', 'share of the state’s household heads') });
      let yy = lg.y + 4;
      const s = [lg.svg, caixaLegenda(ZERO, L('setor sem domicílio ocupado', 'tract with no occupied home'), yy)];
      yy += 25;
      s.push(caixaLegenda(null, L(`sem informação, sigilo (${nf(c.sem_info)} setores)`, `no data, confidentiality (${nf(c.sem_info)} tracts)`), yy, { hachura: true }));
      yy += 42;
      s.push(rotuloPainel(L('ATÉ 1,5 SM, POR REGIÃO INTERMEDIÁRIA', 'UP TO 1.5 MIN. WAGES, BY INTERMEDIATE REGION'), yy));
      const b = barras(rg.map((x) => [x.NM_RGINT, x.pct_ate15, c.cores[4]]), yy + 14, { max: pp.pct_ate15 * 1.12, x0: 230, passo: 18 });
      s.push(b.svg);
      return { svg: s.join('\n'), y: b.y + 6 };
    },
    fontes: () => [
      L('IBGE, Censo 2022: agregados por setor (renda)', 'IBGE, 2022 Census: tract aggregates (income)'),
      L('IBGE, Malha de Setores 2022', 'IBGE, 2022 Census Tract Mesh'),
    ],
  });
}

/* ------------------------------------------------------------------ 2/3 renda por área de ponderação na metrópole */
async function apond() {
  await usarRegiao('renda-solar-sp-metropole');
  const c = await ler('apond');
  const base = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', 'renda-solar-sp-metropole-base.json'), 'utf8'));
  const cores = ['#f3ece4', '#e2cfc9', '#c9a7ae', '#a67d92', '#7a5474', '#4b2f4f'];
  const rot = L(['até 1,5 SM', '1,5 a 2 SM', '2 a 3 SM', '3 a 5 SM', '5 a 8 SM', 'mais de 8 SM'], ['up to 1.5 min. wages', '1.5 to 2 min. wages', '2 to 3 min. wages', '3 to 5 min. wages', '5 to 8 min. wages', 'over 8 min. wages']);
  const com = c.apond.filter((f) => f.properties.k !== null), sem = c.apond.filter((f) => f.properties.k === null);
  const sp = c.sp;
  const dentro = c.dentro.filter((d) => d.rico.b && d.pobre.b && !/Setor|Bacia/.test(d.rico.b)).slice(0, 5);
  const DESTAQUES = [['3518800', 'GUARULHOS'], ['3534401', 'OSASCO'], ['3547809', 'SANTO ANDRÉ'], ['3530607', 'MOGI DAS CRUZES'], ['3548500', 'SANTOS'], ['3505708', 'BARUERI']];
  return () => ({
    layout: 'um',
    motivo: 'telhados',
    serie: serie(2),
    pad: 20,
    titulo: () => L('A renda na metrópole', 'Income in the metropolis'),
    subtitulo: () => L('Do Itaim Bibi ao Jardim Ângela, onze vezes', 'From Itaim Bibi to Jardim Ângela, eleven times over'),
    descricao: () => L(
      `Rendimento nominal médio mensal dos responsáveis com rendimento por área de ponderação do Censo 2022, em salários mínimos de 2022, nos ${nf(c.n_mun_janela)} municípios das concentrações urbanas de São Paulo e de Santos`,
      `Mean monthly nominal income of household heads with income by 2022 Census weighting area, in 2022 minimum wages, in the ${nf(c.n_mun_janela)} municipalities of the São Paulo and Santos urban concentrations`),
    mapa: () => ({
      preencher: () => NEUTRO,
      bordaMunicipio: 0.6,
      semRgint: true,
      tamanhoCapital: 18,
      camadas: [
        { feats: com, cor: (f) => (f.properties.k ? cores[f.properties.k - 1] : ZERO), borda: '#ffffff', largura: 0.5 },
        { feats: sem, hachura: HACHURA, borda: 'none' },
        { feats: base.unidades.features, cor: 'none', borda: TINTA, largura: 0.9, opacidade: 1 },
      ],
      destaques: DESTAQUES.map(([cd, t]) => ({ cd, texto: t })),
      tamanhoDestaque: 13,
      chamadas: [
        {
          coord: sp.rico.pt, dx: 230, dy: -330, tamanho: 16,
          titulo: L(`ITAIM BIBI · ${reais(sp.rico.v)}`, `ITAIM BIBI · ${reais(sp.rico.v)}`),
          linhas: L([`${nf(sp.rico.v / c.sm, 1)} salários mínimos, a área`, 'de maior renda média da metrópole'], [`${nf(sp.rico.v / c.sm, 1)} minimum wages, the highest`, 'mean income in the metropolis']),
        },
        {
          coord: sp.pobre.pt, dx: 150, dy: 330, tamanho: 16,
          titulo: L(`JARDIM ÂNGELA · ${reais(sp.pobre.v)}`, `JARDIM ÂNGELA · ${reais(sp.pobre.v)}`),
          linhas: L([`${nf(sp.pobre.v / c.sm, 1)} salário mínimo, na mesma cidade,`, 'a 20 km do Itaim Bibi'], [`${nf(sp.pobre.v / c.sm, 1)} minimum wages, in the same city,`, '20 km from Itaim Bibi']),
        },
      ],
    }),
    numeros: () => [
      [`${nf(sp.razao, 1)}×`, [L('a renda média do Itaim Bibi', 'Itaim Bibi’s mean income'), L('sobre a do Jardim Ângela', 'over Jardim Ângela’s')]],
      [nf(c.n_janela), [L('áreas de ponderação', 'weighting areas'), L(`em ${nf(c.n_mun_janela)} municípios`, `in ${nf(c.n_mun_janela)} municipalities`)]],
      [pct((100 * (c.resp_cl[0] + c.resp_cl[1])) / c.tot_resp, 0), [L('dos responsáveis em áreas', 'of household heads in areas'), L('de até 2 SM de média', 'averaging up to 2 min. wages')]],
      [pct((100 * (c.resp_cl[4] + c.resp_cl[5])) / c.tot_resp, 0), [L('em áreas de mais de 5 SM,', 'in areas over 5 min. wages,'), L(`${nf(c.ap_cl[4] + c.ap_cl[5])} das ${nf(c.n_janela)}`, `${nf(c.ap_cl[4] + c.ap_cl[5])} of the ${nf(c.n_janela)}`)]],
    ],
    painel: (y) => {
      const itens = cores.map((k, i) => [k, rot[i], c.resp_cl[i], c.tot_resp]);
      const lg = legendaBarras(itens, y, { titulo: L('MÉDIA DA ÁREA, EM SALÁRIOS MÍNIMOS', 'AREA MEAN, IN MINIMUM WAGES'), rotuloValor: L('parte dos responsáveis do recorte', 'share of household heads in the map') });
      let yy = lg.y + 4;
      const s = [lg.svg];
      if (c.n_sem_dom) { s.push(caixaLegenda(ZERO, L(`área sem domicílio ocupado (${nf(c.n_sem_dom)})`, `area with no occupied home (${nf(c.n_sem_dom)})`), yy)); yy += 25; }
      if (c.n_sigilo) { s.push(caixaLegenda(null, L(`sem informação, sigilo (${nf(c.n_sigilo)} áreas)`, `no data, confidentiality (${nf(c.n_sigilo)} areas)`), yy, { hachura: true })); yy += 25; }
      s.push(rotuloPainel(L('A MAIS RICA SOBRE A MAIS POBRE DA CIDADE', 'RICHEST OVER POOREST AREA IN THE CITY'), yy + 18));
      yy += 32;
      const b = barras(dentro.map((d) => [d.NM_MUN, d.razao, cores[4], `${nf(d.razao, 1)}× · ${d.rico.b} / ${d.pobre.b}`]), yy, { max: dentro[0].razao * 2.4, x0: 200, passo: 19 });
      s.push(b.svg);
      const n = nota(L(`Municípios com cinco áreas de ponderação ou mais, em todo o estado (${nf(c.mun_varias)}). A área leva o nome do bairro ou distrito mais populoso dela.`,
        `Municipalities with five weighting areas or more, statewide (${nf(c.mun_varias)}). Each area is named after its most populous neighbourhood or district.`), b.y + 10, { tamanho: 14 });
      s.push(n.svg);
      return { svg: s.join('\n'), y: n.y + 4 };
    },
    fontes: () => [
      L('IBGE, Censo 2022: agregados por setor (renda)', 'IBGE, 2022 Census: tract aggregates (income)'),
      L('IBGE, Áreas de Ponderação 2022', 'IBGE, 2022 Weighting Areas'),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ 3/3 renda × solar residencial */
async function solar() {
  const c = await ler('solar');
  const por = new Map(c.linhas.map((l) => [l.CD_MUN, l]));
  const sp = por.get('3550308');
  const top = c.adocao_top[0];
  const contra = c.contra.find((l) => l.CD_MUN !== top.CD_MUN) ?? c.contra[0];
  const g = c.grupos;
  // Adoção por terço de renda do município: sistemas por 100 domicílios.
  const porTerco = [1, 2, 3].map((r) => { const ks = [1, 2, 3].map((s) => g[`${s}${r}`]); return (100 * ks.reduce((a, k) => a + k.sistemas, 0)) / ks.reduce((a, k) => a + k.dppo, 0); });
  const rotT = (i) => L(['baixa', 'média', 'alta'], ['low', 'mid', 'high'])[i];
  const tR = c.tercos_renda, tS = c.tercos_solar;
  return () => ({
    layout: 'um',
    motivo: 'telhados',
    serie: serie(3),
    titulo: () => L('Renda e telhado solar', 'Income and rooftop solar'),
    subtitulo: () => L('O sol dos telhados não segue o dinheiro', 'Rooftop sun does not follow the money'),
    descricao: () => L(
      `Rendimento médio dos responsáveis (Censo 2022) e sistemas de geração solar distribuída de classe residencial por 100 domicílios ocupados (ANEEL, ${c.ref}), em terços dos 645 municípios`,
      `Mean income of household heads (2022 Census) and residential distributed solar systems per 100 occupied homes (ANEEL, ${c.ref}), in thirds of the 645 municipalities`),
    mapa: () => ({
      preencher: (cd) => { const l = por.get(cd); return l ? c.biv[l.terco_solar - 1][l.terco_renda - 1] : null; },
      bordaMunicipio: 0.5,
      chamadas: [
        {
          cd: top.CD_MUN, dx: -60, dy: -230, tamanho: 16,
          titulo: L(`${top.NM_MUN.toUpperCase()} · ${nf(top.sistemas_100_dom, 0)} POR 100`, `${top.NM_MUN.toUpperCase()} · ${nf(top.sistemas_100_dom, 0)} PER 100`),
          linhas: L(['domicílios: a maior adoção entre', 'as cidades com mais de 5 mil'], ['homes: the highest uptake among', 'towns with over 5,000']),
        },
        {
          cd: '3550308', dx: 150, dy: 150, tamanho: 16,
          titulo: L(`SÃO PAULO · ${nf(sp.sistemas_100_dom, 1)} POR 100`, `SÃO PAULO · ${nf(sp.sistemas_100_dom, 1)} PER 100`),
          linhas: L([`renda de ${nf(sp.renda_media_sm, 1)} SM, mas a cidade`, 'mora em prédio'], [`income of ${nf(sp.renda_media_sm, 1)} min. wages, but the city`, 'lives in flats']),
        },
      ],
    }),
    numeros: () => [
      [grande(c.tot.n), [L('sistemas solares em', 'solar systems on'), L(`casas, ${nf(c.tot.kw / 1e6, 1)} GW`, `homes, ${nf(c.tot.kw / 1e6, 1)} GW`)]],
      [nf(c.tot.por100, 1), [L('por 100 domicílios', 'per 100 homes'), L('no estado', 'in the state')]],
      [nf(c.rho, 2).replace('-', '−'), [L('correlação de postos entre', 'rank correlation between'), L('renda e adoção (Spearman)', 'income and uptake (Spearman)')]],
      [nf(contra.sistemas_100_dom, 0), [L(`por 100 em ${contra.NM_MUN},`, `per 100 in ${contra.NM_MUN},`), L(`com ${nf(contra.renda_media_sm, 1)} SM de renda média`, `with a mean income of ${nf(contra.renda_media_sm, 1)} min. wages`)]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('RENDA × SOLAR, EM TERÇOS DOS MUNICÍPIOS', 'INCOME × SOLAR, IN THIRDS OF MUNICIPALITIES'), y)];
      const cx = 150, cy = y + 40, lado = 62;
      for (let si = 0; si < 3; si++) for (let ri = 0; ri < 3; ri++) {
        const x = cx + ri * lado, yy = cy + (2 - si) * lado;
        s.push(`<rect x="${x}" y="${yy}" width="${lado}" height="${lado}" fill="${c.biv[si][ri]}" stroke="#ffffff" stroke-width="1.5"/>`);
        s.push(`<text x="${x + lado / 2}" y="${yy + lado / 2 + 5}" text-anchor="middle" font-family="${MONO}" font-size="14" fill="${si === 2 && ri === 2 ? '#ffffff' : TINTA}">${g[`${si + 1}${ri + 1}`].n}</text>`);
      }
      s.push(`<rect x="${cx}" y="${cy}" width="${3 * lado}" height="${3 * lado}" fill="none" stroke="${TINTA}" stroke-width=".8"/>`);
      s.push(`<path d="M${cx} ${cy + 3 * lado + 14}h${3 * lado}m-8 -4l8 4l-8 4" fill="none" stroke="${TINTA}" stroke-width="1"/>`);
      s.push(`<text x="${cx + 1.5 * lado}" y="${cy + 3 * lado + 36}" text-anchor="middle" font-family="${MONO}" font-size="12">${L('renda média do responsável', 'mean income of household head')}</text>`);
      s.push(`<text x="${cx}" y="${cy + 3 * lado + 54}" font-family="${MONO}" font-size="11" fill="${CINZA}">${L(`≤ ${nf(tR[0], 2)}`, `≤ ${nf(tR[0], 2)}`)}</text>`);
      s.push(`<text x="${cx + 3 * lado}" y="${cy + 3 * lado + 54}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${CINZA}">${L(`> ${nf(tR[1], 2)} SM`, `> ${nf(tR[1], 2)} min. wages`)}</text>`);
      s.push(`<path d="M${cx - 14} ${cy + 3 * lado}v${-3 * lado}m-4 8l4 -8l4 8" fill="none" stroke="${TINTA}" stroke-width="1"/>`);
      s.push(`<text transform="translate(${cx - 26} ${cy + 1.5 * lado}) rotate(-90)" text-anchor="middle" font-family="${MONO}" font-size="12">${L('sistemas por 100 domicílios', 'systems per 100 homes')}</text>`);
      s.push(`<text x="${cx - 46}" y="${cy + 3 * lado}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${CINZA}">≤ ${nf(tS[0], 1)}</text>`);
      s.push(`<text x="${cx - 46}" y="${cy + 10}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${CINZA}">&gt; ${nf(tS[1], 1)}</text>`);
      const n = nota(L('Cada casa mostra quantos municípios caem nela. Se o solar seguisse a renda, eles se juntariam na diagonal; estão espalhados.',
        'Each cell shows how many municipalities fall in it. Were solar to follow income, they would gather on the diagonal; they are spread out.'), cy + 10, { tamanho: 14, max: LP - cx - 3 * lado - 30 });
      s.push(n.svg.replace(/<text x="0"/g, `<text x="${cx + 3 * lado + 30}"`));
      let yy = cy + 3 * lado + 92;
      s.push(rotuloPainel(L('SISTEMAS POR 100 DOMICÍLIOS, POR TERÇO DE RENDA', 'SYSTEMS PER 100 HOMES, BY INCOME THIRD'), yy));
      const b1 = barras([0, 1, 2].map((i) => [L(`renda ${rotT(i)}`, `${rotT(i)} income`), porTerco[i], c.biv[2][i], nf(porTerco[i], 1)]), yy + 14, { max: Math.max(...porTerco) * 1.15, x0: 200 });
      s.push(b1.svg);
      yy = b1.y + 26;
      s.push(rotuloPainel(L('MAIS SISTEMAS POR 100 DOMICÍLIOS', 'MOST SYSTEMS PER 100 HOMES'), yy));
      const b2 = barras(c.adocao_top.slice(0, 5).map((l) => [l.NM_MUN, l.sistemas_100_dom, c.biv[2][l.terco_renda - 1], `${nf(l.sistemas_100_dom, 1)} · ${nf(l.renda_media_sm, 1)} ${L('SM', 'min. w.')}`]), yy + 14, { max: top.sistemas_100_dom * 1.4, x0: 230 });
      s.push(b2.svg);
      return { svg: s.join('\n'), y: b2.y + 6 };
    },
    fontes: () => [
      L(`ANEEL, geração distribuída (${c.ref})`, `ANEEL, distributed generation (${c.ref})`),
      L('IBGE, Censo 2022: agregados por setor', 'IBGE, 2022 Census: tract aggregates'),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { setores, apond, solar };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/renda-solar-sp/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
const e = SERIE.find((s) => s.tema === nome);
const fazer = await TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => fazer() });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `renda-solar-sp-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
