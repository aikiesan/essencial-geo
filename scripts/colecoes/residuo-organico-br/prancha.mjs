#!/usr/bin/env node
/**
 * Coleção «O que a prefeitura faz com o resto» (Brasil) — desenha uma prancha a partir do cache de preparar.py (uso interno).
 *
 *   node scripts/colecoes/residuo-organico-br/prancha.mjs composto|consorcio|taxa
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  RAIZ, LP, SERIF, MONO, CINZA, PAPEL, TINTA, esc, nf, f1, lingua, largura,
  gerarPrancha, rotuloPainel, usarBrasil,
} from '../lib/prancha-sp.mjs';

export const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'residuo-organico-br', 'serie.json'), 'utf8'));
const TOTAL = 3; // pranchas da coleção
const SEM_DADO = '#d5d9dd';
const BORDA = '#c9ced3';

const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `residuo-organico-br-${nome}.json`), 'utf8'));
const L = (pt, en) => (lingua() === 'en' ? en : pt);
const serie = (i) => () => L(`O QUE A PREFEITURA FAZ COM O RESTO · ${i}/${TOTAL}`, `THE TOWN HALL AND THE LEFTOVERS · ${i}/${TOTAL}`);
const mi = (v, casas = 1) => nf(v / 1e6, casas);
const pc = (v, casas = 0) => `${nf(v, casas)} %`;
const MUNIC = () => L('IBGE, MUNIC 2023, Suplemento de Saneamento', 'IBGE, MUNIC 2023, Sanitation Supplement');
const MALHA = () => L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025');
const texto = (x, y, t, { tamanho = 12.5, cor = TINTA, anc = 'start', fonte = MONO, extra = '' } = {}) =>
  `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anc}" font-family="${fonte}" font-size="${tamanho}" fill="${cor}" ${extra}>${esc(t)}</text>`;
const caixa = (cor, rot, y, { passo = 27, tamanho = 16, x = 0 } = {}) => `<rect x="${x}" y="${y}" width="34" height="${passo - 8}" fill="${cor}" stroke="${BORDA}" stroke-width=".8"/>
<text x="${x + 48}" y="${y + passo - 12}" font-family="${SERIF}" font-size="${tamanho}">${esc(rot)}</text>`;
const semDado = (c) => [SEM_DADO, L(`sem informação (${c.sem_dado.length} municípios)`, `no information (${c.sem_dado.length} municipalities)`)];
const camadas = (c, br, COR) => [
  { feats: c.municipios.features, cor: (f) => COR[f.properties.classe] ?? SEM_DADO, borda: 'none', largura: 0 },
  { feats: br.ufs.features, cor: 'none', borda: '#4a4e52', largura: 0.9, opacidade: 1 },
];
const legendaFigura = (titulo, itens, canto = 'se') => () => {
  const s = [rotuloPainel(titulo, 0)];
  const passo = 27;
  let y = 22;
  for (const [cor, rot] of itens()) { s.push(caixa(cor, rot, y, { passo })); y += passo; }
  const larg = Math.max(48 + Math.max(...itens().map(([, r]) => largura(r, 16))), largura(titulo, 15, { mono: true, espaco: 2.4 }));
  return { svg: s.join('\n'), altura: y - 8, largura: Math.ceil(larg), canto };
};
/** Classes com o número de municípios (barra) e a parte da população (à direita). */
const classesComBarras = (c, y, { passo = 27, xb = 300, rotulos = (k) => L(k.rotulo, k.rotulo_en), tamanho = 14 } = {}) => {
  const s = [];
  const maxM = Math.max(...c.classes.map((k) => k.municipios));
  const wMax = LP - xb - 110;
  for (const k of c.classes) {
    s.push(caixa(k.cor, rotulos(k), y, { passo, tamanho }));
    const wb = (k.municipios / maxM) * wMax;
    s.push(`<rect x="${xb}" y="${y + 5}" width="${f1(Math.max(wb, 1))}" height="${passo - 18}" fill="${k.cor}" stroke="#7a8189" stroke-width=".5"/>`);
    s.push(texto(xb + wb + 6, y + passo - 12, nf(k.municipios), { tamanho: 12.5 }));
    s.push(texto(LP, y + passo - 12, pc(k.pop_pct), { tamanho: 12.5, anc: 'end', cor: CINZA }));
    y += passo;
  }
  return { svg: s.join('\n'), y };
};

/* ------------------------------------------------------------------ 1 quem faz composto */
async function composto() {
  const c = await ler('composto');
  const br = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', 'brasil-base.json'), 'utf8'));
  const COR = Object.fromEntries(c.classes.map((k) => [k.classe, k.cor]));
  const [ssa, cwb, gyn] = c.maiores_sem;
  const grande = c.faixas.at(-1);
  const VERDE = c.classes[0].cor;
  const itens = () => [...c.classes.map((k) => [k.cor, L(k.rotulo, k.rotulo_en)]), semDado(c)];
  return () => ({
    layout: 'um',
    motivo: 'saneamento',
    serie: serie(1),
    titulo: () => L('Quem faz composto', 'Who makes compost'),
    subtitulo: () => L('Só um município em sete trata o lixo orgânico, mas um terço do país mora neles',
      'Only one town in seven treats its organic waste, but a third of Brazilians live in them'),
    descricao: () => L(
      `Municípios que declararam à MUNIC 2023 ter serviço de tratamento de resíduos orgânicos (compostagem e afins) e unidade de compostagem no território`,
      `Municipalities that told the 2023 MUNIC survey they run an organic-waste treatment service (composting and the like) and have a composting unit on their land`),
    mapa: () => ({
      preencher: () => '#f1f2f3',
      bordaMunicipio: 0,
      semRgint: true,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      camadas: camadas(c, br, COR),
      chamadas: [{
        coord: ssa.coord, dx: 12, dy: 190,
        titulo: L(`TRÊS CAPITAIS · ${mi(ssa.pop + cwb.pop + gyn.pop, 1)} MI HAB.`, `THREE CAPITALS · ${mi(ssa.pop + cwb.pop + gyn.pop, 1)} M PEOPLE`),
        linhas: L(['Salvador, Curitiba e Goiânia:', 'nenhum tratamento de orgânicos'],
          ['Salvador, Curitiba and Goiânia:', 'no organic-waste treatment']),
      }, {
        coord: [-52.6, -27.3], dx: 230, dy: -30,
        titulo: L(`O SUL · ${pc(c.regioes.find((r) => r.regiao === 'Sul').pct)} DOS MUNICÍPIOS`, `THE SOUTH · ${pc(c.regioes.find((r) => r.regiao === 'Sul').pct)} OF TOWNS`),
        linhas: L([`tratam orgânicos; no Nordeste, ${pc(c.regioes.find((r) => r.regiao === 'Nordeste').pct)}`],
          [`treat organics; in the Northeast, ${pc(c.regioes.find((r) => r.regiao === 'Nordeste').pct)}`]),
      }],
    }),
    legendaFigura: legendaFigura(L('RESÍDUOS ORGÂNICOS, 2023', 'ORGANIC WASTE, 2023'), itens),
    numeros: () => [
      [nf(c.org), [L(`municípios tratam orgânicos,`, `towns treat organic waste,`), L(`${pc(c.org_pct, 1)} dos ${nf(c.respondentes)}`, `${pc(c.org_pct, 1)} of ${nf(c.respondentes)}`)]],
      [pc(c.pop_org_pct), [L('da população mora neles', 'of Brazilians live in them'), L(`(${mi(c.pop_org, 1)} milhões)`, `(${mi(c.pop_org, 1)} million)`)]],
      [pc(grande.pct), [L(`das ${grande.n} cidades com mais`, `of the ${grande.n} cities over`), L('de 500 mil habitantes', '500,000 people')]],
      [nf(c.unidades), [L('têm unidade de compostagem', 'have a composting unit'), L('no próprio território', 'on their own land')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('MUNICÍPIOS E % DA POPULAÇÃO', 'MUNICIPALITIES AND % OF PEOPLE'), y)];
      y += 18;
      const k = classesComBarras(c, y, { xb: 352, tamanho: 13.5 });
      s.push(k.svg);
      y = k.y;
      s.push(caixa(SEM_DADO, semDado(c)[1], y, { tamanho: 13.5 }));
      y += 27 + 24;
      // Por porte: a curva em U, que só sobe nas cidades grandes.
      s.push(rotuloPainel(L('% QUE TRATA ORGÂNICOS, POR PORTE', '% TREATING ORGANICS, BY SIZE'), y));
      y += 26;
      const xb = 130;
      const wb = LP - xb - 60;
      for (const f of c.faixas) {
        const w = (f.pct / 60) * wb;
        s.push(texto(0, y, L(f.rotulo, f.rotulo_en), { tamanho: 12.5 }));
        s.push(`<rect x="${xb}" y="${y - 11}" width="${f1(w)}" height="13" fill="${VERDE}"/>`);
        s.push(texto(xb + w + 6, y, pc(f.pct), { tamanho: 12.5 }));
        s.push(texto(LP, y, nf(f.n), { tamanho: 11.5, anc: 'end', cor: CINZA }));
        y += 20;
      }
      s.push(texto(0, y + 2, L('habitantes · à direita: municípios no porte', 'inhabitants · right: towns of that size'), { tamanho: 11, cor: CINZA }));
      y += 36;
      // Por região: municípios × população.
      s.push(rotuloPainel(L('POR REGIÃO · % DOS MUNICÍPIOS E DA GENTE', 'BY REGION · % OF TOWNS AND OF PEOPLE'), y));
      y += 26;
      const xr = 130;
      const wr = LP - xr - 60;
      for (const r of c.regioes) {
        s.push(texto(0, y, L(r.regiao, r.regiao_en), { tamanho: 12.5 }));
        s.push(`<rect x="${xr}" y="${y - 13}" width="${f1((r.pct / 50) * wr)}" height="7" fill="${VERDE}"/>`);
        s.push(`<rect x="${xr}" y="${y - 5}" width="${f1((r.pop_pct / 50) * wr)}" height="7" fill="${PAPEL}" stroke="${VERDE}" stroke-width="1"/>`);
        s.push(texto(xr + (Math.max(r.pct, r.pop_pct) / 50) * wr + 6, y, `${nf(r.pct)} · ${nf(r.pop_pct)}`, { tamanho: 12 }));
        y += 22;
      }
      s.push(`<rect x="0" y="${y - 5}" width="22" height="7" fill="${VERDE}"/>`);
      s.push(texto(28, y + 2, L('municípios', 'towns'), { tamanho: 11, cor: CINZA }));
      s.push(`<rect x="130" y="${y - 5}" width="22" height="7" fill="${PAPEL}" stroke="${VERDE}"/>`);
      s.push(texto(158, y + 2, L('população', 'people'), { tamanho: 11, cor: CINZA }));
      return { svg: s.join('\n'), y: y + 10 };
    },
    fontes: () => [MUNIC(), MALHA()],
  });
}

/* ------------------------------------------------------------------ 2 o lixo em consórcio */
async function consorcio() {
  const c = await ler('consorcio');
  const br = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', 'brasil-base.json'), 'utf8'));
  const COR = Object.fromEntries(c.classes.map((k) => [k.classe, k.cor]));
  const AZUL = c.classes[0].cor;
  const RUIVO = '#b5643a';
  const ro = c.ufs.find((u) => u.uf === 'RO');
  const ma = c.ufs.find((u) => u.uf === 'MA');
  const itens = () => [...c.classes.map((k) => [k.cor, L(k.rotulo, k.rotulo_en)]), semDado(c)];
  return () => ({
    layout: 'um',
    motivo: 'saneamento',
    serie: serie(2),
    titulo: () => L('O lixo em consórcio', 'Waste by consortium'),
    subtitulo: () => L('Um município em seis divide o lixo com os vizinhos, e tem lixão com metade da frequência',
      'One town in six shares its waste with its neighbours; among them, open dumps are half as common'),
    descricao: () => L(
      'Municípios que declararam à MUNIC 2023 prestar o manejo de resíduos sólidos de forma regionalizada, por consórcio público ou outro arranjo, e o que dividem',
      'Municipalities that told the 2023 MUNIC survey they manage solid waste regionally, through a public consortium or another arrangement, and what they share'),
    mapa: () => ({
      preencher: () => '#f1f2f3',
      bordaMunicipio: 0,
      semRgint: true,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      camadas: camadas(c, br, COR),
      chamadas: [{
        coord: [-62.9, -10.9], dx: -40, dy: 320,
        titulo: L(`RONDÔNIA · ${ro.cons} DE ${ro.n}`, `RONDÔNIA · ${ro.cons} OF ${ro.n}`),
        linhas: L([`em consórcio, ${pc(ro.pct)}: a maior`, 'parte; Alagoas e Sergipe, 63 %'],
          [`in a consortium, ${pc(ro.pct)}: the top`, 'share; Alagoas and Sergipe, 63%']),
      }, {
        coord: [-45.2, -5.2], dx: 170, dy: -190,
        titulo: L(`MARANHÃO · ${ma.cons} DE ${ma.n}`, `MARANHÃO · ${ma.cons} OF ${ma.n}`),
        linhas: L(['nenhum consórcio de resíduos;', 'nem em AM, AC, AP e RR'],
          ['no waste consortium at all;', 'nor in AM, AC, AP or RR']),
      }],
    }),
    legendaFigura: legendaFigura(L('MANEJO DOS RESÍDUOS, 2023', 'WASTE MANAGEMENT, 2023'), itens),
    numeros: () => [
      [nf(c.cons), [L(`municípios em consórcio,`, `towns in a consortium,`), L(`${pc(c.cons_pct, 1)} dos ${nf(c.respondentes)}`, `${pc(c.cons_pct, 1)} of ${nf(c.respondentes)}`)]],
      [pc(c.pop_cons_pct, 1), [L('da população; a mediana', 'of the population; median'), L(`é de ${nf(c.mediana_pop_cons)} habitantes`, `size ${nf(c.mediana_pop_cons)} people`)]],
      [pc(c.lixao.cons.pct), [L('deles têm lixão, contra', 'of them have a dump, against'), L(`${pc(c.lixao.so.pct)} dos que estão sós`, `${pc(c.lixao.so.pct)} of those on their own`)]],
      [pc(c.servicos[0].pct), [L('dos consorciados dividem', 'of members share final'), L(`o destino final; ${pc(c.servicos.at(-1).pct)}, orgânicos`, `disposal; ${pc(c.servicos.at(-1).pct)}, organics`)]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('MUNICÍPIOS E % DA POPULAÇÃO', 'MUNICIPALITIES AND % OF PEOPLE'), y)];
      y += 18;
      const k = classesComBarras(c, y, { xb: 352, tamanho: 13.5 });
      s.push(k.svg);
      y = k.y;
      s.push(caixa(SEM_DADO, semDado(c)[1], y, { tamanho: 13.5 }));
      y += 27 + 18;
      // % em consórcio por UF, duas colunas (só as que têm algum).
      s.push(rotuloPainel(L('% DOS MUNICÍPIOS EM CONSÓRCIO, POR UF', '% OF TOWNS IN A CONSORTIUM, BY STATE'), y));
      y += 24;
      const lista = c.ufs.filter((u) => u.cons > 0);
      const meio = Math.ceil(lista.length / 2);
      const colW = LP / 2;
      const wMax = colW - 36 - 50;
      lista.forEach((u, i) => {
        const xc = i < meio ? 0 : colW + 8;
        const yy = y + (i % meio) * 15;
        s.push(texto(xc, yy, u.uf, { tamanho: 12 }));
        const w = (u.pct / 75) * wMax;
        s.push(`<rect x="${xc + 30}" y="${yy - 10}" width="${f1(Math.max(w, 1))}" height="11" fill="${AZUL}"/>`);
        s.push(texto(xc + 36 + w, yy, nf(u.pct), { tamanho: 11.5 }));
      });
      const zeros = c.ufs.filter((u) => u.cons === 0 && u.uf !== 'DF').map((u) => u.uf).join(', ');
      s.push(texto(colW + 8, y + (lista.length - meio) * 15, `zero: ${zeros}`, { tamanho: 11, cor: CINZA }));
      y += meio * 15 + 22;
      // Lixão por porte: consórcio × sozinho, para não confundir com o tamanho da cidade.
      s.push(rotuloPainel(L('TÊM LIXÃO, POR PORTE · %', 'HAVE A DUMP, BY SIZE · %'), y));
      y += 24;
      const xb = 130;
      const wb = LP - xb - 50;
      for (const f of c.faixas.slice(0, 6)) {
        s.push(texto(0, y + 4, L(f.rotulo, f.rotulo_en), { tamanho: 12 }));
        s.push(`<rect x="${xb}" y="${y - 8}" width="${f1((f.pct_cons / 50) * wb)}" height="7" fill="${AZUL}"/>`);
        s.push(`<rect x="${xb}" y="${y}" width="${f1((f.pct_so / 50) * wb)}" height="7" fill="${RUIVO}"/>`);
        s.push(texto(xb + (Math.max(f.pct_cons, f.pct_so) / 50) * wb + 6, y + 4, `${nf(f.pct_cons)} · ${nf(f.pct_so)}`, { tamanho: 11.5 }));
        y += 17;
      }
      s.push(`<rect x="0" y="${y - 3}" width="22" height="7" fill="${AZUL}"/>`);
      s.push(texto(28, y + 4, L('em consórcio', 'in a consortium'), { tamanho: 11, cor: CINZA }));
      s.push(`<rect x="170" y="${y - 3}" width="22" height="7" fill="${RUIVO}"/>`);
      s.push(texto(198, y + 4, L('sozinho', 'on its own'), { tamanho: 11, cor: CINZA }));
      return { svg: s.join('\n'), y: y + 14 };
    },
    fontes: () => [MUNIC(), MALHA()],
  });
}

/* ------------------------------------------------------------------ 3 a taxa e o lixão */
async function taxa() {
  const c = await ler('taxa');
  const br = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', 'brasil-base.json'), 'utf8'));
  const COR = Object.fromEntries(c.classes.map((k) => [k.classe, k.cor]));
  const K = Object.fromEntries(c.classes.map((k) => [k.classe, k]));
  const dc = c.maiores_ambos[0];
  const norte = c.regioes.find((r) => r.regiao === 'Norte');
  const sul = c.regioes.find((r) => r.regiao === 'Sul');
  const itens = () => [...[1, 0, 3, 2].map((i) => [K[i].cor, L(K[i].rotulo, K[i].rotulo_en)]), semDado(c)];
  return () => ({
    layout: 'um',
    motivo: 'saneamento',
    serie: serie(3),
    titulo: () => L('A taxa e o lixão', 'The fee and the dump'),
    subtitulo: () => L('Onde ninguém paga pelo lixo, metade dos municípios tem lixão',
      'Where nobody pays for rubbish collection, half the towns have an open dump'),
    descricao: () => L(
      'Cruzamento de duas respostas à MUNIC 2023: se a prefeitura cobra pelo manejo dos resíduos sólidos (taxa ou tarifa) e se há vazadouro a céu aberto (lixão) no município',
      'Two answers to the 2023 MUNIC survey crossed: whether the town hall charges for solid-waste services (a fee or tariff) and whether there is an open dump in the municipality'),
    mapa: () => ({
      preencher: () => '#f1f2f3',
      bordaMunicipio: 0,
      semRgint: true,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      camadas: camadas(c, br, COR),
      chamadas: [{
        coord: dc.coord, dx: 200, dy: 60,
        titulo: L(`${dc.nome.toUpperCase()} (${dc.uf}) · ${nf(dc.pop)} HAB.`, `${dc.nome.toUpperCase()} (${dc.uf}) · ${nf(dc.pop)} PEOPLE`),
        linhas: L(['a maior cidade que cobra taxa', 'e ainda declara lixão no território'],
          ['the largest town that charges a fee', 'and still reports a dump on its land']),
      }, {
        coord: [-60.5, -4.5], dx: -150, dy: -330,
        titulo: L(`NORTE · ${nf(norte.c2)} DE ${nf(norte.n)}`, `NORTH · ${nf(norte.c2)} OF ${nf(norte.n)}`),
        linhas: L(['não cobram e têm lixão;', `no Sul, ${nf(sul.c1)} de ${nf(sul.n)}`, 'cobram e não têm'],
          ['charge nothing, have a dump;', `in the South, ${nf(sul.c1)} of ${nf(sul.n)}`, 'charge and have none']),
      }],
    }),
    legendaFigura: legendaFigura(L('TAXA DO LIXO × LIXÃO, 2023', 'WASTE FEE × OPEN DUMP, 2023'), itens),
    numeros: () => [
      [pc(c.lixao_sem_taxa_pct), [L('dos que não cobram', 'of towns with no fee'), L(`têm lixão; ${pc(c.lixao_com_taxa_pct)} dos que cobram`, `have a dump; ${pc(c.lixao_com_taxa_pct)} with one`)]],
      [nf(c.ambos), [L('cobram taxa e têm lixão,', 'charge a fee and have a dump,'), L(`com ${mi(c.pop_ambos, 1)} milhões de pessoas`, `home to ${mi(c.pop_ambos, 1)} million people`)]],
      [pc(c.cobre_custos_pct), [L(`das ${nf(c.cobra)} cobranças`, `of the ${nf(c.cobra)} fees`), L('pagaram o custo em 2022', 'covered the cost in 2022')]],
      [pc(c.motivos[0].pct), [L('dos que não cobram', 'of non-charging towns'), L('dizem que falta lei', 'say there is no law')]],
    ],
    painel: (y) => {
      // Matriz 2 × 2: cobra (colunas) × lixão (linhas), com municípios e população.
      const s = [rotuloPainel(L('COBRA PELO LIXO? TEM LIXÃO?', 'CHARGES A FEE? HAS A DUMP?'), y)];
      y += 30;
      const x0 = 150;
      const cw = (LP - x0) / 2;
      const ch = 66;
      s.push(texto(x0 + cw / 2, y, L('não cobra', 'no fee'), { tamanho: 12.5, anc: 'middle', cor: CINZA }));
      s.push(texto(x0 + cw * 1.5, y, L('cobra', 'charges'), { tamanho: 12.5, anc: 'middle', cor: CINZA }));
      y += 10;
      const celula = (k, col, lin) => {
        const x = x0 + col * cw;
        const yy = y + lin * ch;
        const escuro = k.classe === 3;
        return `<rect x="${f1(x)}" y="${yy}" width="${f1(cw - 4)}" height="${ch - 4}" fill="${k.cor}" stroke="${BORDA}" stroke-width=".8"/>
${texto(x + (cw - 4) / 2, yy + 30, nf(k.municipios), { tamanho: 22, anc: 'middle', fonte: SERIF, cor: escuro ? PAPEL : TINTA })}
${texto(x + (cw - 4) / 2, yy + 50, L(`${pc(k.pop_pct)} da gente`, `${pc(k.pop_pct)} of people`), { tamanho: 11.5, anc: 'middle', cor: escuro ? PAPEL : TINTA })}`;
      };
      s.push(texto(0, y + ch / 2 + 4, L('sem lixão', 'no dump'), { tamanho: 12.5, cor: CINZA }));
      s.push(texto(0, y + ch * 1.5 + 4, L('com lixão', 'has a dump'), { tamanho: 12.5, cor: CINZA }));
      s.push(celula(K[0], 0, 0), celula(K[1], 1, 0), celula(K[2], 0, 1), celula(K[3], 1, 1));
      y += 2 * ch + 12;
      s.push(texto(0, y, L(`municípios; sem informação: ${c.sem_dado.length}`, `municipalities; no information: ${c.sem_dado.length}`), { tamanho: 11, cor: CINZA }));
      y += 34;
      // Por região: barras empilhadas das quatro combinações.
      s.push(rotuloPainel(L('POR REGIÃO · % DOS MUNICÍPIOS', 'BY REGION · % OF TOWNS'), y));
      y += 24;
      const xr = 130;
      const wr = LP - xr;
      const ordem = [1, 0, 2, 3];
      for (const r of c.regioes) {
        s.push(texto(0, y, L(r.regiao, r.regiao_en), { tamanho: 12.5 }));
        let x = xr;
        for (const i of ordem) {
          const w = (r[`c${i}`] / r.n) * wr;
          s.push(`<rect x="${f1(x)}" y="${y - 12}" width="${f1(Math.max(w - 0.6, 0))}" height="15" fill="${K[i].cor}" stroke="${BORDA}" stroke-width=".4"/>`);
          if (w > 34) s.push(texto(x + w / 2, y, nf((r[`c${i}`] / r.n) * 100), { tamanho: 11, anc: 'middle', cor: i === 3 ? PAPEL : TINTA }));
          x += w;
        }
        y += 22;
      }
      y += 26;
      // Por que não cobra.
      s.push(rotuloPainel(L(`POR QUE NÃO COBRA · % DOS ${nf(c.sem_taxa)}`, `WHY NO FEE · % OF THE ${nf(c.sem_taxa)}`), y));
      y += 24;
      const xm = 260;
      const wm = LP - xm - 50;
      for (const m of c.motivos) {
        s.push(texto(0, y, L(m.rotulo, m.rotulo_en), { tamanho: 12 }));
        s.push(`<rect x="${xm}" y="${y - 10}" width="${f1((m.pct / 100) * wm)}" height="11" fill="${K[2].cor}"/>`);
        s.push(texto(xm + (m.pct / 100) * wm + 6, y, nf(m.pct), { tamanho: 11.5 }));
        y += 19;
      }
      s.push(texto(0, y + 2, L('mais de um motivo por município', 'more than one reason per town'), { tamanho: 11, cor: CINZA }));
      return { svg: s.join('\n'), y: y + 10 };
    },
    fontes: () => [MUNIC(), MALHA()],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { composto, consorcio, taxa };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/residuo-organico-br/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
await usarBrasil();
const e = SERIE.find((s) => s.tema === nome);
const fazer = await TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => fazer() });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `residuo-organico-br-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
