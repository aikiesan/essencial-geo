#!/usr/bin/env node
/**
 * Coleção «Energia elétrica no Brasil» — desenha uma prancha a partir do cache de preparar.py (uso interno).
 *
 *   node scripts/colecoes/energia-eletrica/prancha.mjs transmissao|usinas
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  RAIZ, LP, SERIF, MONO, TINTA, CINZA, PAPEL, esc, nf, f1, lingua, largura,
  gerarPrancha, rotuloPainel, usarBrasil,
} from '../lib/prancha-sp.mjs';
import { legendaCirculos } from '../lib/arte.mjs';

export const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'energia-eletrica', 'serie.json'), 'utf8'));
const NEUTRO = '#f1f2f3';

const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `energia-eletrica-${nome}.json`), 'utf8'));
const L = (pt, en) => (lingua() === 'en' ? en : pt);
const serie = (i) => () => L(`ENERGIA ELÉTRICA NO BRASIL · ${i}/3`, `ELECTRICITY IN BRAZIL · ${i}/3`);
const EN_FAIXA = {
  'até 230 kV': 'up to 230 kV', '345 e 440 kV': '345 and 440 kV', '500 a 765 kV': '500 to 765 kV',
  '600 e 800 kV, corrente contínua': '600 and 800 kV, direct current',
};
const milKm = (v) => nf(v / 1000, 1);

/** Lista "nome ........ valor" do painel. */
function lista(itens, y, { tamanho = 17, passo = 25, x = 0, larg = LP } = {}) {
  const s = [];
  itens.forEach(([nome, valor], i) => {
    const yy = y + i * passo;
    s.push(`<text x="${x}" y="${yy}" font-family="${SERIF}" font-size="${tamanho}">${esc(nome)}</text>`);
    s.push(`<text x="${x + larg}" y="${yy}" text-anchor="end" font-family="${MONO}" font-size="${tamanho - 3}">${esc(valor)}</text>`);
    const x0 = x + largura(nome, tamanho) + 10;
    const x1 = x + larg - largura(valor, tamanho - 3, { mono: true }) - 10;
    if (x1 > x0) s.push(`<path d="M${x0} ${yy - 4}H${x1}" stroke="#c4c9ce" stroke-width="1" stroke-dasharray="1 4"/>`);
  });
  return { svg: s.join('\n'), y: y + itens.length * passo };
}

/* ------------------------------------------------------------------ 1/3 transmissão */
async function transmissao() {
  const c = await ler('transmissao');
  const F = Object.fromEntries(c.faixas.map((f) => [f.rotulo, f]));
  const longa = c.longas[0];
  const cc = c.faixas[3];
  return () => ({
    layout: 'um',
    motivo: 'energia',
    serie: serie(1),
    titulo: () => L('Linhas de transmissão', 'Transmission lines'),
    subtitulo: () => L('Os fios que costuram o país', 'The wires that stitch the country together'),
    descricao: () => L(
      `${nf(c.trechos)} trechos da rede básica e ${c.subestacoes_n} subestações existentes, por faixa de tensão (EPE, até ${c.ano_max})`,
      `${nf(c.trechos)} stretches of the bulk grid and ${c.subestacoes_n} existing substations, by voltage class (EPE, up to ${c.ano_max})`),
    mapa: () => ({
      preencher: () => NEUTRO,
      bordaMunicipio: 0.9,
      bordaUnidadeCor: '#c9ced3',
      semRgint: true,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      linhas: [{
        feats: c.linhas.features,
        cor: (f) => F[f.properties.faixa].cor,
        largura: (f) => F[f.properties.faixa].largura,
        halo: 1.4,
      }],
      pontos: c.subestacoes.map((coord) => ({ coord, r: 2.1, cor: TINTA, borda: PAPEL, opacidade: 0.85 })),
      chamadas: [{
        coord: longa.meio, dx: 230, dy: 150,
        titulo: `${nf(longa.km, 0)} KM · ${nf(longa.tensao_kv)} KV`,
        linhas: L(['a linha mais longa do país:', `Xingu – Terminal Rio, em corrente contínua (${longa.ano})`],
          ['the country’s longest line:', `Xingu – Terminal Rio, direct current (${longa.ano})`]),
      }],
    }),
    numeros: () => [
      [nf(c.trechos), [L('trechos de linha', 'line stretches'), L('na rede básica', 'in the bulk grid')]],
      [`${milKm(c.km_campo)} mil km`, [L('somados os circuitos', 'adding up circuits'), L('(extensão declarada)', '(declared length)')]],
      [String(c.subestacoes_n), [L('subestações', 'substations')]],
      [`${milKm(cc.km)} mil km`, [L(`em corrente contínua`, 'in direct current'), L(`(${cc.trechos} trechos)`, `(${cc.trechos} stretches)`)]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('TENSÃO · MIL KM DE LINHA', 'VOLTAGE · THOUSAND KM OF LINE'), y)];
      y += 34;
      const maxKm = Math.max(...c.faixas.map((f) => f.km));
      for (const f of [...c.faixas].reverse()) {
        s.push(`<path d="M2 ${y - 6}H38" stroke="${PAPEL}" stroke-width="${f.largura + 3}" stroke-linecap="round"/><path d="M2 ${y - 6}H38" stroke="${f.cor}" stroke-width="${f.largura * 1.6}" stroke-linecap="round"/>`);
        s.push(`<text x="52" y="${y}" font-family="${SERIF}" font-size="17">${esc(L(f.rotulo, EN_FAIXA[f.rotulo]))}</text>`);
        const wb = (f.km / maxKm) * (LP - 120);
        s.push(`<rect x="52" y="${y + 9}" width="${f1(wb)}" height="7" fill="${f.cor}" fill-opacity=".85"/>`);
        s.push(`<text x="${f1(60 + wb)}" y="${y + 17}" font-family="${MONO}" font-size="12.5">${milKm(f.km)}</text>`);
        y += 46;
      }
      s.push(`<circle cx="20" cy="${y - 4}" r="3.2" fill="${TINTA}" stroke="${PAPEL}" stroke-width="1.2"/>`);
      s.push(`<text x="52" y="${y + 2}" font-family="${SERIF}" font-size="17">${L('subestação', 'substation')}</text>`);
      y += 44;
      s.push(rotuloPainel(L('AS MAIS LONGAS (KM)', 'THE LONGEST (KM)'), y));
      const nomes = c.longas.slice(0, 4).map((l) => [l.nome.replace(/^LT /, '').replace(/ n° \d+ C\d\/C\d$| C\d(\/C\d)?$/, ''), nf(l.km, 0)]);
      const l = lista(nomes, y + 30, { tamanho: 15, passo: 23 });
      s.push(l.svg);
      return { svg: s.join('\n'), y: l.y };
    },
    fontes: () => [
      L('EPE, WebMap (via MapBiomas): LT e SE existentes', 'EPE, WebMap (via MapBiomas): existing lines and substations'),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ 2/3 usinas por fonte */
async function usinas() {
  const c = await ler('usinas');
  const COR = Object.fromEntries(c.fontes.map((f) => [f.chave, f.cor]));
  const raio = (kw) => 1.0 + 0.011 * Math.sqrt(kw);
  const maior = c.maiores[0];
  const totOp = c.kw_operacao;
  const hidro = c.fontes.filter((f) => ['uhe', 'pch'].includes(f.chave)).reduce((a, f) => a + f.kw_operacao, 0);
  const ufv = c.fontes.find((f) => f.chave === 'ufv');
  // Sistemas solares de menos de 5 kW: quase todos registrados um a um pelas distribuidoras.
  const mini = c.pontos.filter(([k, , , kw]) => k === 'ufv' && kw < 5);
  const pantanal = mini.filter(([, lon, lat]) => lon < -54 && lat < -15);
  const centro = [pantanal.reduce((a, p) => a + p[1], 0) / pantanal.length, pantanal.reduce((a, p) => a + p[2], 0) / pantanal.length];
  // Desenho: as maiores por baixo; os pontos pequenos (solar) por cima, com borda branca fina.
  const pontos = c.pontos.map(([k, lon, lat, kw, op]) => ({ coord: [lon, lat], r: raio(kw), cor: COR[k], vazado: !op && kw >= 50000, opacidade: 0.82, bordaLargura: Math.min(1.2, 0.3 * raio(kw)) }));
  return () => ({
    layout: 'um',
    motivo: 'energia',
    serie: serie(2),
    titulo: () => L('Usinas por fonte', 'Power plants by source'),
    subtitulo: () => L('Água, vento, sol e fogo', 'Water, wind, sun and fire'),
    descricao: () => L(
      `${nf(c.n)} usinas registradas na ANEEL, em operação e em construção, com a potência outorgada (SIGA, até ${c.inicio_max.slice(0, 4)})`,
      `${nf(c.n)} power plants registered with ANEEL, operating and under construction, with licensed capacity (SIGA, up to ${c.inicio_max.slice(0, 4)})`),
    mapa: () => ({
      preencher: () => NEUTRO,
      bordaMunicipio: 0.9,
      bordaUnidadeCor: '#c9ced3',
      semRgint: true,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      pontos,
      chamadas: [{
        coord: maior.coord, dx: 250, dy: -150,
        titulo: `${maior.nome.toUpperCase()} · ${nf(maior.kw / 1000, 0)} MW`,
        linhas: L(['a maior usina registrada na ANEEL,', 'uma hidrelétrica no Pará'], ['the largest plant registered with ANEEL,', 'a hydropower station in Pará']),
      }, {
        coord: centro, dx: -210, dy: -190,
        titulo: L(`PANTANAL · ${nf(pantanal.length)} PONTOS SOLARES`, `PANTANAL · ${nf(pantanal.length)} SOLAR POINTS`),
        linhas: L(['sistemas de menos de 5 kW,', 'registrados um a um'], ['systems under 5 kW,', 'registered one by one']),
      }],
    }),
    numeros: () => [
      [nf(c.n), [L('usinas', 'power plants'), L('(em operação e em obra)', '(operating and being built)')]],
      [`${nf(totOp / 1e6, 0)} GW`, [L('em operação', 'in operation')]],
      [`${nf((hidro / totOp) * 100, 1)} %`, [L('da potência em operação', 'of operating capacity'), L('vem da água (UHE e PCH)', 'is hydro (UHE and PCH)')]],
      [nf(mini.length), [L(`dos ${nf(ufv.n)} pontos solares`, `of the ${nf(ufv.n)} solar points`), L('têm menos de 5 kW', 'are under 5 kW')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('MATRIZ EM OPERAÇÃO (POTÊNCIA)', 'OPERATING MIX (CAPACITY)'), y)];
      y += 18;
      // Uma fita só, dividida pela potência de cada fonte: a matriz numa linha.
      let x = 0;
      for (const f of c.fontes) {
        const w = (f.kw_operacao / totOp) * LP;
        s.push(`<rect x="${f1(x)}" y="${y}" width="${f1(Math.max(w, 0.8))}" height="22" fill="${f.cor}"/>`);
        x += w;
      }
      s.push(`<rect x="0" y="${y}" width="${LP}" height="22" fill="none" stroke="${TINTA}" stroke-width=".8"/>`);
      y += 52;
      for (const f of c.fontes) {
        s.push(`<circle cx="12" cy="${y - 6}" r="8" fill="${f.cor}" fill-opacity=".85" stroke="${PAPEL}"/>`);
        s.push(`<text x="32" y="${y}" font-family="${SERIF}" font-size="16">${esc(L(f.rotulo, f.rotulo_en))}</text>`);
        s.push(`<text x="${LP - 92}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="13" fill="${CINZA}">${nf(f.n)}</text>`);
        s.push(`<text x="${LP}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="13">${nf((f.kw_operacao / totOp) * 100, 1)} %</text>`);
        y += 25;
      }
      s.push(`<text x="${LP - 92}" y="${y + 2}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${CINZA}">${L('usinas', 'plants')}</text>`);
      s.push(`<text x="${LP}" y="${y + 2}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${CINZA}">${L('da potência', 'of capacity')}</text>`);
      y += 30;
      s.push(rotuloPainel(L('POTÊNCIA OUTORGADA', 'LICENSED CAPACITY'), y));
      const lc = legendaCirculos([10000000, 3000000, 500000], raio, (v) => `${nf(v / 1000)} MW`, { y: y + 18, cor: CINZA });
      s.push(lc.svg);
      s.push(`<circle cx="${LP - 190}" cy="${y + 34}" r="8" fill="${PAPEL}" stroke="${CINZA}" stroke-width="2"/>`);
      s.push(`<text x="${LP - 174}" y="${y + 40}" font-family="${SERIF}" font-size="15">${L('em obra (≥ 50 MW)', 'being built (≥ 50 MW)')}</text>`);
      return { svg: s.join('\n'), y: y + 18 + lc.altura };
    },
    fontes: () => [
      L('ANEEL, SIGA (via MapBiomas), 2022', 'ANEEL, SIGA (via MapBiomas), 2022'),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { transmissao, usinas };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/energia-eletrica/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
await usarBrasil();
const e = SERIE.find((s) => s.tema === nome);
const fazer = await TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => fazer() });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `energia-eletrica-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
