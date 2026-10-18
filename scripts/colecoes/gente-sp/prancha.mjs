#!/usr/bin/env node
/**
 * Coleção «Gente no território» — desenha uma prancha a partir do cache de preparar.mjs (uso interno).
 *
 *   node --max-old-space-size=8192 scripts/colecoes/gente-sp/prancha.mjs densidade|idade|idosos|rural
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { RAIZ, LP, SERIF, MONO, TINTA, CINZA, esc, nf, f1, gerarPrancha, rotuloPainel } from '../lib/prancha-sp.mjs';
import { lerRaster } from '../lib/raster.mjs';
import { L, NEUTRO, ZERO, HACHURA, pct, grande, barras, legendaBarras, caixaLegenda, nota } from '../lib/painel.mjs';
import { CORES_MEDIANA, LIM_MEDIANA, CORES_ENV, LIM_ENV, CORES_SEXO, LIM_SEXO, CORES_RURAL, LIM_RURAL } from './preparar.mjs';

const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'gente-sp', 'serie.json'), 'utf8'));
const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `gente-sp-${nome}.json`), 'utf8'));
const serie = (i) => () => L(`GENTE NO TERRITÓRIO · ${i}/4`, `PEOPLE ACROSS THE LAND · ${i}/4`);
const classe = (v, lim) => { let i = 0; while (i < lim.length && v > lim[i] + 1e-9) i++; return i; };
const FONTES_SETOR = () => [
  L('IBGE, Censo 2022: agregados por setor', 'IBGE, 2022 Census: tract aggregates'),
  L('IBGE, Malha de Setores 2022', 'IBGE, 2022 Census Tract Mesh'),
];
const mapaSetores = (extra = {}) => ({
  preencher: () => NEUTRO,
  bordaMunicipio: 0,
  bordaSobreRaster: '#ffffff',
  larguraSobreRaster: 0.45,
  opacidadeSobreRaster: 0.8,
  bordaRgint: 1.5,
  ...extra,
});

/** Faixa de cores contínua, com os limites nas junções (sem caixa de zero). */
function faixa(cores, limites, { larg = 64, zero = null } = {}) {
  const s = [];
  let x = 0;
  if (zero) {
    s.push(`<rect x="0" y="0" width="${larg * 0.6}" height="14" fill="${ZERO}" stroke="#1a211a" stroke-width=".6"/>`);
    s.push(`<text x="${larg * 0.3}" y="32" text-anchor="middle" font-family="${MONO}" font-size="12">${esc(zero)}</text>`);
    x = larg * 0.6 + 18;
  }
  cores.forEach((c, i) => s.push(`<rect x="${f1(x + i * larg)}" y="0" width="${larg}" height="14" fill="${c}" stroke="#1a211a" stroke-width=".6"/>`));
  limites.forEach((l, i) => s.push(`<text x="${f1(x + (i + 1) * larg)}" y="32" text-anchor="middle" font-family="${MONO}" font-size="12">${esc(l)}</text>`));
  return s.join('\n');
}

/* ------------------------------------------------------------------ 1/4 densidade por setor */
async function densidade() {
  const c = await ler('densidade');
  const r = await lerRaster('grade-gente-sp-densidade');
  const corDe = (v) => (v >= 1 && v <= 6 ? c.cores[v - 1] : v === 253 ? ZERO : null);
  const rot = L(['até 10', '10 a 100', '100 a 1.000', '1.000 a 5.000', '5.000 a 15.000', 'mais de 15.000'], ['up to 10', '10 to 100', '100 to 1,000', '1,000 to 5,000', '5,000 to 15,000', 'over 15,000']);
  const denso = c.mun_densos[0], vazio = c.mun_vazios[0];
  const pctAreaBaixa = (100 * c.area[0]) / c.tot_a, pctPesBaixa = (100 * c.pessoas[0]) / c.tot_p;
  return () => ({
    layout: 'um',
    motivo: 'gente',
    serie: serie(1),
    raster: { r, modo: 'classes', cor: corDe, recorte: 'limite', fator: 2 },
    titulo: () => L('Onde mora a gente', 'Where people live'),
    subtitulo: () => L('Metade dos paulistas cabe em meio por cento do estado', 'Half of São Paulo’s people fit in half a per cent of the state'),
    descricao: () => L(
      'Pessoas residentes por km² em cada setor censitário, Censo 2022; os setores sem morador ficam em cinza',
      'Residents per km² in each census tract, 2022 Census; tracts with no residents are in grey'),
    mapa: () => mapaSetores({
      chamadas: [
        {
          cd: denso.CD_MUN, dx: 170, dy: 190, tamanho: 16,
          titulo: L(`${denso.NM_MUN.toUpperCase()} · ${nf(denso.dens)} POR KM²`, `${denso.NM_MUN.toUpperCase()} · ${nf(denso.dens)} PER KM²`),
          linhas: L(['o município mais denso do estado;', `a média paulista é de ${nf(c.estado)}`], ['the densest municipality in the state;', `the São Paulo average is ${nf(c.estado)}`]),
        },
        {
          cd: vazio.CD_MUN, dx: -170, dy: 150, tamanho: 16,
          titulo: L(`${vazio.NM_MUN.toUpperCase()} · ${nf(vazio.dens, 1)} POR KM²`, `${vazio.NM_MUN.toUpperCase()} · ${nf(vazio.dens, 1)} PER KM²`),
          linhas: L(['o menos denso, na Mata', 'Atlântica do Vale do Ribeira'], ['the least dense, in the Atlantic', 'Forest of the Ribeira Valley']),
        },
      ],
    }),
    numeros: () => [
      [pct(c.metade.pct_area, 1), [L('do território abriga', 'of the land holds'), L(`metade da gente (${nf(c.metade.area)} km²)`, `half the people (${nf(c.metade.area)} km²)`)]],
      [pct(c.noventa.pct_area, 1), [L('do território abriga', 'of the land holds'), L('90 % dos paulistas', '90% of the population')]],
      [pct(pctAreaBaixa, 0), [L('da área tem menos de', 'of the area has under'), L(`10 por km², e ${pct(pctPesBaixa, 1)} da gente`, `10 per km², and ${pct(pctPesBaixa, 1)} of people`)]],
      [grande(c.tot_p), [L('pessoas em', 'people in'), L(`${nf(c.tot_a)} km²`, `${nf(c.tot_a)} km²`)]],
    ],
    painel: (y) => {
      const itens = c.cores.map((k, i) => [k, rot[i], c.pessoas[i], c.tot_p]);
      const lg = legendaBarras(itens, y, { titulo: L('PESSOAS POR KM² NO SETOR', 'PEOPLE PER KM² IN THE TRACT'), rotuloValor: L('parte da população do estado', 'share of the state’s population') });
      let yy = lg.y + 4;
      const s = [lg.svg, caixaLegenda(ZERO, L(`setor sem morador (${nf(c.n_vazios)})`, `tract with no residents (${nf(c.n_vazios)})`), yy)];
      yy += 42;
      s.push(rotuloPainel(L('PARTE DA ÁREA DO ESTADO EM CADA CLASSE', 'SHARE OF THE STATE’S AREA IN EACH CLASS'), yy));
      const b = barras(c.cores.map((k, i) => [rot[i], (100 * c.area[i]) / c.tot_a, k, pct((100 * c.area[i]) / c.tot_a)]), yy + 14, { max: pctAreaBaixa * 1.1, x0: 200 });
      s.push(b.svg);
      yy = b.y + 26;
      s.push(rotuloPainel(L('MUNICÍPIOS MAIS DENSOS (PESSOAS POR KM²)', 'DENSEST MUNICIPALITIES (PEOPLE PER KM²)'), yy));
      const b2 = barras(c.mun_densos.slice(0, 5).map((m) => [m.NM_MUN, m.dens, c.cores[5], nf(m.dens)]), yy + 14, { max: denso.dens * 1.15, x0: 200 });
      s.push(b2.svg);
      return { svg: s.join('\n'), y: b2.y + 6 };
    },
    fontes: () => [...FONTES_SETOR(), L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025')],
  });
}

/* ------------------------------------------------------------------ 2/4 idade e sexo por município */
async function idade() {
  const c = await ler('municipios');
  const por = new Map(c.linhas.map((l) => [l.CD_MUN, l]));
  const cor = (v, lim, cores) => (v === null || v === undefined ? null : cores[classe(v, lim)]);
  const velho = c.mediana_max[0], jovem = c.env_min[0], homens = c.sexo_max[0];
  const pir = c.uf.piramide;
  // Pirâmide em grupos de 5 anos, com 90 ou mais juntos.
  const junta = (v) => [...v.slice(0, 18), v[18] + v[19] + v[20]];
  const H = junta(pir.homens), M = junta(pir.mulheres);
  const idades = [...Array.from({ length: 18 }, (_, i) => `${i * 5}–${i * 5 + 4}`), '90+'];
  return () => ({
    layout: 'quatro',
    motivo: 'gente',
    serie: serie(2),
    titulo: () => L('Idade e sexo', 'Age and sex'),
    subtitulo: () => L('O noroeste envelhece, a metrópole é jovem e os presídios são homens', 'The north-west grows old, the metropolis is young and prisons are men'),
    descricao: () => L(
      'Idade mediana, índice de envelhecimento (pessoas de 65 anos ou mais por 100 de até 14) e razão de sexo (homens por 100 mulheres) da população residente, por município, Censo 2022',
      'Median age, ageing index (people aged 65 or over per 100 aged up to 14) and sex ratio (men per 100 women) of the resident population, by municipality, 2022 Census'),
    mapas: () => [
      {
        titulo: L('IDADE MEDIANA · ANOS', 'MEDIAN AGE · YEARS'),
        preencher: (cd) => cor(por.get(cd)?.idade_mediana, LIM_MEDIANA, CORES_MEDIANA),
        legenda: faixa(CORES_MEDIANA, LIM_MEDIANA.map((v) => nf(v))),
        chamadas: [{ cd: velho.CD_MUN, dx: 20, dy: 380, tamanho: 14, titulo: L(`${velho.NM_MUN.toUpperCase()} · ${velho.idade_mediana} ANOS`, `${velho.NM_MUN.toUpperCase()} · ${velho.idade_mediana} YEARS`), linhas: L(['a maior idade mediana'], ['the highest median age']) }],
      },
      {
        titulo: L('ÍNDICE DE ENVELHECIMENTO · 65+ POR 100 DE ATÉ 14', 'AGEING INDEX · 65+ PER 100 AGED UP TO 14'),
        preencher: (cd) => cor(por.get(cd)?.indice_envelhecimento, LIM_ENV, CORES_ENV),
        legenda: faixa(CORES_ENV, LIM_ENV.map((v) => nf(v))),
        chamadas: [{ cd: jovem.CD_MUN, dx: 60, dy: 150, tamanho: 14, titulo: L(`${jovem.NM_MUN.toUpperCase()} · ${nf(jovem.indice_envelhecimento)}`, `${jovem.NM_MUN.toUpperCase()} · ${nf(jovem.indice_envelhecimento)}`), linhas: L(['o mais jovem: três crianças', 'para cada pessoa de 65 ou mais'], ['the youngest: three children', 'for each person aged 65 or over']) }],
      },
      {
        titulo: L('RAZÃO DE SEXO · HOMENS POR 100 MULHERES', 'SEX RATIO · MEN PER 100 WOMEN'),
        preencher: (cd) => cor(por.get(cd)?.razao_sexo, LIM_SEXO, CORES_SEXO),
        legenda: faixa(CORES_SEXO, LIM_SEXO.map((v) => nf(v))),
        chamadas: [{ cd: homens.CD_MUN, dx: -100, dy: 260, tamanho: 14, titulo: L(`${homens.NM_MUN.toUpperCase()} · ${nf(homens.razao_sexo)}`, `${homens.NM_MUN.toUpperCase()} · ${nf(homens.razao_sexo)}`), linhas: L([`${pct(homens.pct_fora_dppo, 0)} dos residentes vivem`, 'em domicílios coletivos'], [`${pct(homens.pct_fora_dppo, 0)} of residents live`, 'in collective dwellings']) }],
      },
    ],
    quartoQuadro: (w) => {
      const s = [`<text x="0" y="0" font-family="${MONO}" font-size="13" letter-spacing="2.4" fill="${CINZA}">${L('PIRÂMIDE ETÁRIA DO ESTADO, EM MIL PESSOAS', 'THE STATE’S AGE PYRAMID, IN THOUSANDS')}</text>`];
      const meio = w / 2, col = 30, passo = 16, alt = 12, max = Math.max(...H, ...M), lb = meio - col - 50;
      const y0 = 22;
      s.push(`<text x="${meio - col}" y="${y0 + 8}" text-anchor="end" font-family="${MONO}" font-size="12" fill="${CINZA}">${L('HOMENS', 'MEN')}</text>`);
      s.push(`<text x="${meio + col}" y="${y0 + 8}" font-family="${MONO}" font-size="12" fill="${CINZA}">${L('MULHERES', 'WOMEN')}</text>`);
      for (let i = 0; i < idades.length; i++) {
        const y = y0 + 16 + (idades.length - 1 - i) * passo;
        const wh = (H[i] / max) * lb, wm = (M[i] / max) * lb;
        s.push(`<rect x="${f1(meio - col - wh)}" y="${y}" width="${f1(wh)}" height="${alt}" fill="${CORES_SEXO[4]}"/>`);
        s.push(`<rect x="${f1(meio + col)}" y="${y}" width="${f1(wm)}" height="${alt}" fill="${CORES_SEXO[0]}"/>`);
        s.push(`<text x="${meio}" y="${y + 10}" text-anchor="middle" font-family="${MONO}" font-size="11">${idades[i]}</text>`);
        if (i % 4 === 0 || i === idades.length - 1) {
          s.push(`<text x="${f1(meio - col - wh - 6)}" y="${y + 10}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${CINZA}">${nf(H[i] / 1000)}</text>`);
          s.push(`<text x="${f1(meio + col + wm + 6)}" y="${y + 10}" font-family="${MONO}" font-size="11" fill="${CINZA}">${nf(M[i] / 1000)}</text>`);
        }
      }
      const yb = y0 + 16 + idades.length * passo + 22;
      const n = nota(L(`A base estreita: há menos crianças de até 4 anos que jovens de 20 a 39. Nos 90 anos ou mais, ${nf(M.at(-1) / H.at(-1), 1)} mulheres para cada homem.`,
        `A narrowing base: there are fewer children aged up to 4 than young adults of 20 to 39. At 90 or over, ${nf(M.at(-1) / H.at(-1), 1)} women for every man.`), yb, { tamanho: 14, max: w });
      s.push(n.svg);
      return s.join('\n');
    },
    numeros: () => [
      [L(`${c.uf.idade_mediana} anos`, `${c.uf.idade_mediana} years`), [L('a idade mediana', 'median age'), L('do estado', 'in the state')]],
      [nf(c.env_acima100), [L('municípios com mais gente de', 'municipalities with more people'), L('65 anos ou mais que crianças', 'aged 65+ than children')]],
      [nf(c.sexo_abaixo100), [L('municípios com mais', 'municipalities with more'), L('mulheres que homens', 'women than men')]],
      [`${nf(c.coletivos10_sexo110)}/${nf(c.coletivos10)}`, [L('cidades com mais de 10 % em', 'towns with over 10% in collective'), L('domicílio coletivo têm 110+ homens', 'dwellings have 110+ men')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('MAIS VELHOS (IDADE MEDIANA)', 'OLDEST (MEDIAN AGE)'), y)];
      const b1 = barras(c.mediana_max.map((m) => [m.NM_MUN, m.idade_mediana, CORES_MEDIANA[5], L(`${m.idade_mediana} anos`, `${m.idade_mediana} years`)]), y + 14, { max: velho.idade_mediana * 1.25, x0: 230 });
      s.push(b1.svg);
      let yy = b1.y + 24;
      s.push(rotuloPainel(L('MAIS JOVENS (IDADE MEDIANA)', 'YOUNGEST (MEDIAN AGE)'), yy));
      const b2 = barras(c.mediana_min.map((m) => [m.NM_MUN, m.idade_mediana, CORES_MEDIANA[1], L(`${m.idade_mediana} anos`, `${m.idade_mediana} years`)]), yy + 14, { max: velho.idade_mediana * 1.25, x0: 230 });
      s.push(b2.svg);
      yy = b2.y + 24;
      s.push(rotuloPainel(L('MAIS HOMENS POR 100 MULHERES', 'MOST MEN PER 100 WOMEN'), yy));
      const b3 = barras(c.sexo_max.map((m) => [m.NM_MUN, m.razao_sexo, CORES_SEXO[5], L(`${nf(m.razao_sexo)} · ${pct(m.pct_fora_dppo, 0)} em coletivos`, `${nf(m.razao_sexo)} · ${pct(m.pct_fora_dppo, 0)} collective`)]), yy + 14, { max: homens.razao_sexo * 1.6, x0: 230 });
      s.push(b3.svg);
      const n = nota(L('Domicílio coletivo é o de pessoas sem laço de família, sob uma administração: presídio, asilo, quartel, alojamento. Aqui, os residentes fora dos domicílios particulares permanentes.',
        'A collective dwelling houses people with no family tie under an administration: a prison, care home, barracks or lodging. Here, residents outside permanent private households.'), b3.y + 10, { tamanho: 14 });
      s.push(n.svg);
      return { svg: s.join('\n'), y: n.y + 4 };
    },
    fontes: () => [
      L('IBGE, Censo 2022: SIDRA 9514, 9515 e 9922', 'IBGE, 2022 Census: SIDRA 9514, 9515 and 9922'),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ 3/4 60 anos ou mais por setor */
async function idosos() {
  const c = await ler('idosos');
  const r = await lerRaster('grade-gente-sp-idosos');
  const corDe = (v) => (v >= 1 && v <= 6 ? c.cores[v - 1] : v === 253 ? ZERO : null);
  const rot = L(['até 10 %', '10 a 15 %', '15 a 20 %', '20 a 25 %', '25 a 30 %', 'mais de 30 %'], ['up to 10%', '10 to 15%', '15 to 20%', '20 to 25%', '25 to 30%', 'over 30%']);
  const velho = c.mun_velhos[0], jovem = c.mun_jovens.find((m) => m.pessoas > 50000);
  const tot = c.pessoas.reduce((a, b) => a + b, 0);
  const rg = c.rgint;
  return () => ({
    layout: 'um',
    motivo: 'gente',
    serie: serie(3),
    raster: { r, modo: 'classes', cor: corDe, recorte: 'limite', fator: 2 },
    titulo: () => L('Os de 60 anos ou mais', 'Those aged 60 and over'),
    subtitulo: () => L('Um em cada seis paulistas, e um em cada três nas cidades pequenas do noroeste', 'One in six people in São Paulo, and one in three in the small towns of the north-west'),
    descricao: () => L(
      'Parte das pessoas residentes com 60 anos ou mais em cada setor censitário, Censo 2022; setores cuja classe depende de valor em sigilo ficam sem informação',
      'Share of residents aged 60 or over in each census tract, 2022 Census; tracts whose class depends on a confidential value are left as no data'),
    mapa: () => mapaSetores({
      camadas: [{ feats: c.semInfoFeats, hachura: HACHURA, borda: 'none' }],
      chamadas: [
        {
          cd: velho.CD_MUN, dx: -380, dy: -560, tamanho: 16,
          titulo: L(`${velho.NM_MUN.toUpperCase()} · ${pct(velho.pct60, 0)}`, `${velho.NM_MUN.toUpperCase()} · ${nf(velho.pct60, 0)}%`),
          linhas: L(['de 60 anos ou mais, a cidade', 'mais velha do estado'], ['aged 60 or over, the oldest', 'town in the state']),
        },
        {
          cd: jovem.CD_MUN, dx: 300, dy: -330, tamanho: 16,
          titulo: L(`${jovem.NM_MUN.toUpperCase()} · ${pct(jovem.pct60, 1)}`, `${jovem.NM_MUN.toUpperCase()} · ${nf(jovem.pct60, 1)}%`),
          linhas: L(['a mais jovem das cidades', 'de mais de 50 mil habitantes'], ['the youngest of the towns', 'of over 50,000 people']),
        },
      ],
    }),
    numeros: () => [
      [pct(c.uf.pct60, 1), [L('dos paulistas têm', 'of São Paulo’s people'), L(`60 anos ou mais (${grande(c.uf.de60)})`, `are 60 or over (${grande(c.uf.de60)})`)]],
      [grande(c.uf.de80), [L('pessoas de 80 anos', 'people aged 80'), L('ou mais', 'or over')]],
      [grande(c.pessoas[5]), [L('vivem em setores com', 'live in tracts where over'), L('mais de 30 % de 60 anos ou mais', '30% are aged 60 or over')]],
      [pct(rg[0].pct60, 1), [L(`em ${rg[0].NM_RGINT},`, `in ${rg[0].NM_RGINT},`), L(`e ${pct(rg.at(-1).pct60, 1)} na região de ${rg.at(-1).NM_RGINT}`, `and ${pct(rg.at(-1).pct60, 1)} in the ${rg.at(-1).NM_RGINT} region`)]],
    ],
    painel: (y) => {
      const itens = c.cores.map((k, i) => [k, rot[i], c.pessoas[i], tot]);
      const lg = legendaBarras(itens, y, { titulo: L('60 ANOS OU MAIS, PARTE DO SETOR', 'AGED 60 OR OVER, SHARE OF THE TRACT'), rotuloValor: L('parte da população dos setores com informação', 'share of population in tracts with data') });
      let yy = lg.y + 4;
      const s = [lg.svg, caixaLegenda(ZERO, L(`setor sem morador (${nf(c.vazios)})`, `tract with no residents (${nf(c.vazios)})`), yy)];
      yy += 25;
      s.push(caixaLegenda(null, L(`sem informação, sigilo (${nf(c.sem_info)} setores)`, `no data, confidentiality (${nf(c.sem_info)} tracts)`), yy, { hachura: true }));
      yy += 42;
      s.push(rotuloPainel(L('60 ANOS OU MAIS, POR REGIÃO INTERMEDIÁRIA', 'AGED 60 OR OVER, BY INTERMEDIATE REGION'), yy));
      const b = barras(rg.map((x) => [x.NM_RGINT, x.pct60, c.cores[4], pct(x.pct60, 1)]), yy + 14, { max: rg[0].pct60 * 1.15, x0: 230, passo: 18 });
      s.push(b.svg);
      return { svg: s.join('\n'), y: b.y + 6 };
    },
    fontes: () => [...FONTES_SETOR(), L('IBGE, Censo 2022: SIDRA 9514', 'IBGE, 2022 Census: SIDRA 9514')],
  });
}

/* ------------------------------------------------------------------ 4/4 urbano e rural */
async function rural() {
  const c = await ler('municipios');
  const por = new Map(c.linhas.map((l) => [l.CD_MUN, l]));
  const top = c.rural_max[0], abs = c.rural_abs[0];
  const rot = L(['até 2 %', '2 a 5 %', '5 a 10 %', '10 a 20 %', '20 a 40 %', 'mais de 40 %'], ['up to 2%', '2 to 5%', '5 to 10%', '10 to 20%', '20 to 40%', 'over 40%']);
  const ruraisCl = new Array(6).fill(0), munCl = new Array(6).fill(0);
  for (const l of c.linhas) if (l.moradores_rural > 0) { const k = classe(l.pct_rural, LIM_RURAL); ruraisCl[k] += l.moradores_rural; munCl[k]++; }
  return () => ({
    layout: 'um',
    motivo: 'gente',
    serie: serie(4),
    titulo: () => L('Urbano e rural', 'Urban and rural'),
    subtitulo: () => L('Três em cada cem paulistas moram no campo', 'Three in every hundred people in São Paulo live in the countryside'),
    descricao: () => L(
      'Moradores em domicílios particulares permanentes ocupados de situação rural, parte do total, por município, Censo 2022',
      'Residents of occupied permanent private households in rural areas, share of the total, by municipality, 2022 Census'),
    mapa: () => ({
      preencher: (cd) => { const l = por.get(cd); return !l ? null : l.moradores_rural === 0 ? ZERO : CORES_RURAL[classe(l.pct_rural, LIM_RURAL)]; },
      bordaMunicipio: 0.5,
      chamadas: [
        {
          cd: top.CD_MUN, dx: 170, dy: -170, tamanho: 16,
          titulo: L(`${top.NM_MUN.toUpperCase()} · ${pct(top.pct_rural, 0)}`, `${top.NM_MUN.toUpperCase()} · ${nf(top.pct_rural, 0)}%`),
          linhas: L(['dos moradores no campo, a maior', 'parte rural do estado'], ['of residents in the countryside,', 'the largest rural share in the state']),
        },
        {
          cd: abs.CD_MUN, dx: 120, dy: 200, tamanho: 16,
          titulo: L(`${abs.NM_MUN.toUpperCase()} · ${grande(abs.moradores_rural).toUpperCase()}`, `${abs.NM_MUN.toUpperCase()} · ${grande(abs.moradores_rural).toUpperCase()}`),
          linhas: L(['moradores rurais, o maior número;', `são ${pct(abs.pct_rural, 1)} da cidade`], ['rural residents, the largest number;', `${nf(abs.pct_rural, 1)}% of the town`]),
        },
      ],
    }),
    numeros: () => [
      [pct(c.uf.pct_rural, 1), [L('dos moradores vivem', 'of residents live'), L(`no campo (${grande(c.uf.rural)})`, `in rural areas (${grande(c.uf.rural)})`)]],
      [nf(c.rural_maioria), [L('municípios com maioria', 'municipalities with a'), L('rural', 'rural majority')]],
      [pct(c.rural_rgint[0].pct, 0), [L(`no campo na região de ${c.rural_rgint[0].NM_RGINT},`, `rural in the ${c.rural_rgint[0].NM_RGINT} region,`), L(`e ${pct(c.rural_rgint.at(-1).pct, 1)} na de ${c.rural_rgint.at(-1).NM_RGINT}`, `and ${pct(c.rural_rgint.at(-1).pct, 1)} in ${c.rural_rgint.at(-1).NM_RGINT}`)]],
      [nf(c.sem_rural), [L('municípios sem nenhum', 'municipalities with no'), L('morador rural', 'rural residents at all')]],
    ],
    painel: (y) => {
      const itens = CORES_RURAL.map((k, i) => [k, `${rot[i]} · ${nf(munCl[i])} ${L('mun.', 'mun.')}`, ruraisCl[i], c.uf.rural]);
      const lg = legendaBarras(itens, y, { titulo: L('MORADORES RURAIS, PARTE DO MUNICÍPIO', 'RURAL RESIDENTS, SHARE OF THE MUNICIPALITY'), rotuloValor: L('parte dos moradores rurais do estado', 'share of the state’s rural residents') });
      let yy = lg.y + 4;
      const s = [lg.svg, caixaLegenda(ZERO, L(`nenhum morador rural (${nf(c.sem_rural)} municípios)`, `no rural residents (${nf(c.sem_rural)} municipalities)`), yy)];
      yy += 42;
      s.push(rotuloPainel(L('NO CAMPO, POR REGIÃO INTERMEDIÁRIA', 'RURAL, BY INTERMEDIATE REGION'), yy));
      const b = barras(c.rural_rgint.map((x) => [x.NM_RGINT, x.pct, CORES_RURAL[3], pct(x.pct, 1)]), yy + 14, { max: c.rural_rgint[0].pct * 1.15, x0: 230, passo: 18 });
      s.push(b.svg);
      yy = b.y + 24;
      s.push(rotuloPainel(L('MAIS MORADORES RURAIS', 'MOST RURAL RESIDENTS'), yy));
      const b2 = barras(c.rural_abs.slice(0, 3).map((m) => [m.NM_MUN, m.moradores_rural, CORES_RURAL[4], grande(m.moradores_rural)]), yy + 14, { max: abs.moradores_rural * 1.3, x0: 230 });
      s.push(b2.svg);
      return { svg: s.join('\n'), y: b2.y + 6 };
    },
    fontes: () => [
      L('IBGE, Censo 2022: SIDRA 9922', 'IBGE, 2022 Census: SIDRA 9922'),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { densidade, idade, idosos, rural };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/gente-sp/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
const e = SERIE.find((s) => s.tema === nome);
const fazer = await TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => fazer() });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `gente-sp-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
