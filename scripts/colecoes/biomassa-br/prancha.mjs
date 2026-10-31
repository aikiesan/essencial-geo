#!/usr/bin/env node
/**
 * Coleção «Monitor da biomassa» (Brasil) — desenha uma prancha a partir do cache de preparar.py (uso interno).
 *
 *   node scripts/colecoes/biomassa-br/prancha.mjs boi|eletricidade|lavoura|esterco|floresta|lenha
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  RAIZ, LP, SERIF, MONO, CINZA, PAPEL, TINTA, esc, nf, f1, lingua, largura,
  gerarPrancha, rotuloPainel, usarBrasil,
} from '../lib/prancha-sp.mjs';
import { legendaCirculos } from '../lib/arte.mjs';

export const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'biomassa-br', 'serie.json'), 'utf8'));
const TOTAL = 6; // pranchas da coleção
const SEM_BOI = '#f6f6f4';
const SEM_DADO = '#d5d9dd';

const ler = async (nome) => JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `biomassa-br-${nome}.json`), 'utf8'));
const L = (pt, en) => (lingua() === 'en' ? en : pt);
const serie = (i) => () => L(`MONITOR DA BIOMASSA · ${i}/${TOTAL}`, `BIOMASS MONITOR · ${i}/${TOTAL}`);
const mi = (v, casas = 1) => nf(v / 1e6, casas);
const REGIAO_EN = { Norte: 'North', Nordeste: 'Northeast', Sudeste: 'Southeast', Sul: 'South', 'Centro-Oeste': 'Centre-West' };

/* ------------------------------------------------------------------ 1 mais boi que gente */
async function boi() {
  const c = await ler('boi');
  const br = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', 'brasil-base.json'), 'utf8'));
  const COR = Object.fromEntries(c.classes.map((k) => [k.classe, k.cor]));
  COR[-1] = SEM_BOI;
  COR[-2] = SEM_DADO;
  const xingu = c.maior_rebanho[0];
  const topo = c.mais_bois_hab[0];
  const pct = (c.municipios_mais_boi / c.municipios_total) * 100;
  // Caixa de classe da legenda (y = topo da caixa), comum ao painel e à figura.
  const caixa = (cor, rot, y, passo) => `<rect x="0" y="${y}" width="34" height="${passo - 8}" fill="${cor}" stroke="#c9ced3" stroke-width=".8"/>
<text x="48" y="${y + passo - 12}" font-family="${SERIF}" font-size="16">${esc(rot)}</text>`;
  const extras = () => [[SEM_BOI, L('sem bovinos', 'no cattle')], [SEM_DADO, L('sem dado na PPM', 'no data in the PPM')]];
  return () => ({
    layout: 'um',
    motivo: 'agro',
    serie: serie(1),
    titulo: () => L('Mais boi que gente', 'More cattle than people'),
    subtitulo: () => L('O rebanho que pasta onde mora pouca gente', 'The herd grazes where few people live'),
    descricao: () => L(
      `Bovinos por habitante em cada município: o rebanho da Pesquisa da Pecuária Municipal de 2024 dividido pela população do Censo 2022`,
      `Cattle per inhabitant in each municipality: the herd from the 2024 Municipal Livestock Survey divided by the 2022 Census population`),
    mapa: () => ({
      preencher: () => '#f1f2f3',
      bordaMunicipio: 0,
      semRgint: true,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      camadas: [
        { feats: c.municipios.features, cor: (f) => COR[f.properties.classe] ?? SEM_DADO, borda: 'none', largura: 0 },
        { feats: br.ufs.features, cor: 'none', borda: '#4a4e52', largura: 0.9, opacidade: 1 },
      ],
      chamadas: [{
        coord: xingu.coord, dx: 300, dy: -250,
        titulo: L(`${mi(xingu.bois, 2)} MILHÕES DE CABEÇAS`, `${mi(xingu.bois, 2)} MILLION HEAD`),
        linhas: L([`${xingu.nome} (${xingu.uf}), o maior rebanho do país:`, `${nf(xingu.bois_hab, 0)} bois por morador`],
          [`${xingu.nome} (${xingu.uf}), the country’s largest herd:`, `${nf(xingu.bois_hab, 0)} cattle per resident`]),
      }, {
        coord: topo.coord, dx: -110, dy: 340,
        titulo: L(`${nf(topo.bois_hab, 0)} BOIS POR HABITANTE`, `${nf(topo.bois_hab, 0)} CATTLE PER INHABITANT`),
        linhas: L([`${topo.nome} (${topo.uf}): ${nf(topo.bois)} cabeças`, `para ${nf(topo.pop)} moradores`],
          [`${topo.nome} (${topo.uf}): ${nf(topo.bois)} head`, `for ${nf(topo.pop)} residents`]),
      }],
    }),
    legendaFigura: () => {
      const s = [rotuloPainel(L('BOIS POR HABITANTE', 'CATTLE PER INHABITANT'), 0)];
      const passo = 27;
      let y = 22;
      const itens = [...[...c.classes].reverse().map((k) => [k.cor, L(k.rotulo, k.rotulo_en)]), ...extras()];
      for (const [cor, rot] of itens) { s.push(caixa(cor, rot, y, passo)); y += passo; }
      const larg = 48 + Math.max(...itens.map(([, r]) => largura(r, 16)));
      return { svg: s.join('\n'), altura: y - 8, largura: Math.ceil(larg), canto: 'se' };
    },
    numeros: () => [
      [`${mi(c.bois, 0)} mi`, [L('de bovinos', 'head of cattle'), L(`para ${mi(c.pop_brasil, 0)} mi de pessoas`, `for ${mi(c.pop_brasil, 0)} million people`)]],
      [nf(c.municipios_mais_boi), [L(`dos ${nf(c.municipios_total)} municípios`, `of the ${nf(c.municipios_total)} municipalities`), L('têm mais boi que gente', 'have more cattle than people')]],
      [`${nf(c.area_mais_boi_pct, 0)} %`, [L('do território', 'of the land area'), L('fica nesses municípios', 'lies in them')]],
      [`${nf((c.bois_em_mais_boi / c.bois) * 100, 0)} %`, [L('do rebanho vive neles,', 'of the herd lives there,'), L(`com ${nf((c.pop_mais_boi / c.pop_brasil) * 100, 0)} % da gente`, `with ${nf((c.pop_mais_boi / c.pop_brasil) * 100, 0)} % of the people`)]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('BOIS POR HABITANTE · MUNICÍPIOS', 'CATTLE PER INHABITANT · MUNICIPALITIES'), y)];
      y += 22;
      const passo = 27;
      const maxM = Math.max(...c.classes.map((k) => k.municipios));
      for (const k of [...c.classes].reverse()) {
        s.push(caixa(k.cor, L(k.rotulo, k.rotulo_en), y, passo));
        const wb = (k.municipios / maxM) * (LP - 290);
        s.push(`<rect x="200" y="${y + 5}" width="${f1(wb)}" height="${passo - 18}" fill="${k.cor}" stroke="#7c5a3a" stroke-width=".5"/>`);
        s.push(`<text x="${f1(208 + wb)}" y="${y + passo - 12}" font-family="${MONO}" font-size="12.5">${nf(k.municipios)}</text>`);
        y += passo;
      }
      for (const [cor, rot] of extras()) { s.push(caixa(cor, rot, y, passo)); y += passo; }
      // A linha do empate: acima dela, mais boi que gente.
      y += 30;
      s.push(rotuloPainel(L('MILHÕES DE CABEÇAS · 2014 → 2024', 'MILLION HEAD · 2014 → 2024'), y));
      y += 30;
      const maxB = Math.max(...c.regioes.flatMap((r) => [r.bois_2014, r.bois_2024]));
      const ordem = [...c.regioes].sort((a, b) => b.bois_2024 - a.bois_2024);
      for (const r of ordem) {
        const w14 = (r.bois_2014 / maxB) * (LP - 250);
        const w24 = (r.bois_2024 / maxB) * (LP - 250);
        const v = ((r.bois_2024 / r.bois_2014) - 1) * 100;
        s.push(`<text x="0" y="${y}" font-family="${SERIF}" font-size="16">${esc(L(r.regiao, REGIAO_EN[r.regiao]))}</text>`);
        s.push(`<rect x="130" y="${y - 15}" width="${f1(w14)}" height="7" fill="${PAPEL}" stroke="#7c5a3a" stroke-width=".8"/>`);
        s.push(`<rect x="130" y="${y - 6}" width="${f1(w24)}" height="7" fill="#a8642a"/>`);
        s.push(`<text x="${f1(138 + Math.max(w14, w24))}" y="${y}" font-family="${MONO}" font-size="12.5">${mi(r.bois_2024)}</text>`);
        s.push(`<text x="${LP}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="12.5" fill="${v < 0 ? CINZA : '#6b3a1f'}">${v > 0 ? '+' : '−'}${nf(Math.abs(v), 0)} %</text>`);
        y += 30;
      }
      s.push(`<rect x="0" y="${y - 6}" width="22" height="7" fill="${PAPEL}" stroke="#7c5a3a" stroke-width=".8"/>`);
      s.push(`<text x="30" y="${y + 1}" font-family="${MONO}" font-size="11" fill="${CINZA}">2014</text>`);
      s.push(`<rect x="80" y="${y - 6}" width="22" height="7" fill="#a8642a"/>`);
      s.push(`<text x="110" y="${y + 1}" font-family="${MONO}" font-size="11" fill="${CINZA}">2024</text>`);
      return { svg: s.join('\n'), y: y + 8 };
    },
    fontes: () => [
      L('IBGE, Pesquisa da Pecuária Municipal 2014 e 2024', 'IBGE, Municipal Livestock Survey 2014 and 2024'),
      L('IBGE, Censo 2022 e Malha Municipal 2025', 'IBGE, 2022 Census and Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ 2 eletricidade da biomassa */
async function eletricidade() {
  const c = await ler('eletricidade');
  const COR = Object.fromEntries(c.grupos.map((g) => [g.chave, g.cor]));
  const raio = (kw) => 2 + 0.028 * Math.sqrt(kw);
  const gw = (kw, casas = 1) => nf(kw / 1e6, casas);
  const tot = c.kw_operacao;
  const cana = c.grupos.find((g) => g.chave === 'cana');
  const maior = c.maiores[0];
  const sp = c.ufs.find((u) => u.uf === 'SP');
  const ref = `${c.referencia.slice(8, 10)}/${c.referencia.slice(5, 7)}/${c.referencia.slice(0, 4)}`;
  // Os maiores por baixo; os pequenos (biogás) por cima, com borda branca fina.
  const pontos = c.pontos.map(([g, lon, lat, kw, op]) => ({ coord: [lon, lat], r: raio(kw), cor: COR[g], vazado: !op, opacidade: 0.8, bordaLargura: Math.min(1.2, 0.3 * raio(kw)) }));
  const grupo = (g, y) => `<circle cx="12" cy="${y - 6}" r="8" fill="${g.cor}" fill-opacity=".85" stroke="${PAPEL}"/>
<text x="32" y="${y}" font-family="${SERIF}" font-size="16">${esc(L(g.rotulo, g.rotulo_en))}</text>`;
  const emObra = (x, y) => `<circle cx="${x}" cy="${y}" r="8" fill="${PAPEL}" stroke="${CINZA}" stroke-width="2"/>
<text x="${x + 16}" y="${y + 6}" font-family="${SERIF}" font-size="15">${L('em obra ou a construir', 'being or to be built')}</text>`;
  const circulos = (y) => legendaCirculos([400000, 100000, 10000], raio, (v) => `${nf(v / 1000)} MW`, { y, cor: CINZA });
  return () => ({
    layout: 'um',
    motivo: 'cana',
    serie: serie(2),
    titulo: () => L('A eletricidade da biomassa', 'Electricity from biomass'),
    subtitulo: () => L('O bagaço que acende a rede', 'The bagasse that lights the grid'),
    descricao: () => L(
      `${nf(c.n)} usinas térmicas a biomassa registradas na ANEEL, por combustível e potência outorgada (SIGA, ${ref})`,
      `${nf(c.n)} biomass thermal power plants registered with ANEEL, by fuel and licensed capacity (SIGA, ${ref})`),
    mapa: () => ({
      preencher: () => '#f1f2f3',
      bordaMunicipio: 0.9,
      bordaUnidadeCor: '#c9ced3',
      semRgint: true,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      pontos,
      chamadas: [{
        coord: maior.coord, dx: 300, dy: 150,
        titulo: `${maior.nome.toUpperCase()} · ${nf(maior.kw / 1000, 0)} MW`,
        linhas: L([`${maior.municipio}: a maior, uma fábrica`, 'de celulose que queima o licor negro'],
          [`${maior.municipio}: the largest, a pulp mill`, 'burning its own black liquor']),
      }, {
        coord: [-49.6, -21.3], dx: -330, dy: 230,
        titulo: L(`SÃO PAULO · ${gw(sp.kw)} GW`, `SÃO PAULO · ${gw(sp.kw)} GW`),
        linhas: L([`${nf((sp.kw / tot) * 100, 0)} % da potência a biomassa do país,`, 'quase toda nas usinas de cana'],
          [`${nf((sp.kw / tot) * 100, 0)} % of the country’s biomass capacity,`, 'almost all of it in cane mills']),
      }],
    }),
    legendaFigura: () => {
      const s = [rotuloPainel(L('COMBUSTÍVEL', 'FUEL'), 0)];
      let y = 26;
      for (const g of c.grupos) { s.push(grupo(g, y)); y += 25; }
      y += 22;
      s.push(rotuloPainel(L('POTÊNCIA OUTORGADA', 'LICENSED CAPACITY'), y));
      const lc = circulos(y + 18);
      s.push(lc.svg);
      y += 18 + lc.altura + 24;
      s.push(emObra(12, y - 6));
      const larg = Math.max(260, 32 + Math.max(...c.grupos.map((g) => largura(L(g.rotulo, g.rotulo_en), 16))));
      return { svg: s.join('\n'), altura: y + 6, largura: Math.ceil(larg), canto: 'se' };
    },
    numeros: () => [
      [`${gw(tot)} GW`, [L('em operação,', 'in operation,'), L(`${nf((tot / c.kw_op_brasil) * 100, 1)} % da potência do país`, `${nf((tot / c.kw_op_brasil) * 100, 1)} % of national capacity`)]],
      [nf(c.n_operacao), [L('usinas em operação', 'plants in operation'), L(`(${nf(c.n - c.n_operacao)} em obra ou a construir)`, `(${nf(c.n - c.n_operacao)} being or to be built)`)]],
      [`${nf((cana.kw_operacao / tot) * 100, 0)} %`, [L('da potência queima', 'of capacity burns'), L('bagaço de cana', 'sugarcane bagasse')]],
      [`${nf(c.grupos.find((g) => g.chave === 'biogas').n)}`, [L('usinas a biogás,', 'biogas plants,'), L(`${gw(c.grupos.find((g) => g.chave === 'biogas').kw_operacao, 2)} GW`, `${gw(c.grupos.find((g) => g.chave === 'biogas').kw_operacao, 2)} GW`)]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('POTÊNCIA EM OPERAÇÃO POR COMBUSTÍVEL', 'OPERATING CAPACITY BY FUEL'), y)];
      y += 18;
      let x = 0;
      for (const g of c.grupos) {
        const w = (g.kw_operacao / tot) * LP;
        s.push(`<rect x="${f1(x)}" y="${y}" width="${f1(Math.max(w, 0.8))}" height="22" fill="${g.cor}"/>`);
        x += w;
      }
      s.push(`<rect x="0" y="${y}" width="${LP}" height="22" fill="none" stroke="${TINTA}" stroke-width=".8"/>`);
      y += 52;
      for (const g of c.grupos) {
        s.push(grupo(g, y));
        s.push(`<text x="${LP - 92}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="13" fill="${CINZA}">${nf(g.n)}</text>`);
        s.push(`<text x="${LP}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="13">${nf((g.kw_operacao / tot) * 100, 1)} %</text>`);
        y += 25;
      }
      s.push(`<text x="${LP - 92}" y="${y + 2}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${CINZA}">${L('usinas', 'plants')}</text>`);
      s.push(`<text x="${LP}" y="${y + 2}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${CINZA}">${L('da potência', 'of capacity')}</text>`);
      y += 34;
      // Colunas empilhadas: GW que entraram em operação em cada década, por combustível.
      s.push(rotuloPainel(L('GW QUE ENTRARAM EM OPERAÇÃO, POR DÉCADA', 'GW ENTERING OPERATION, BY DECADE'), y));
      y += 20;
      const decs = [1970, 1980, 1990, 2000, 2010, 2020];
      const soma = (d) => c.decadas.filter((k) => k.decada === d).reduce((a, k) => a + k.kw, 0);
      const maxD = Math.max(...decs.map(soma));
      const hMax = 96;
      const bw = LP / decs.length;
      decs.forEach((d, i) => {
        let yy = y + hMax;
        for (const g of c.grupos) {
          const k = c.decadas.find((e) => e.decada === d && e.grupo === g.chave);
          if (!k) continue;
          const h = (k.kw / maxD) * hMax;
          yy -= h;
          s.push(`<rect x="${f1(i * bw + 6)}" y="${f1(yy)}" width="${f1(bw - 12)}" height="${f1(h)}" fill="${g.cor}"/>`);
        }
        s.push(`<text x="${f1(i * bw + bw / 2)}" y="${f1(yy - 6)}" text-anchor="middle" font-family="${MONO}" font-size="11.5">${gw(soma(d))}</text>`);
        s.push(`<text x="${f1(i * bw + bw / 2)}" y="${y + hMax + 16}" text-anchor="middle" font-family="${MONO}" font-size="11" fill="${CINZA}">${d === 2020 ? L('2020–26', '2020–26') : `${d}s`.replace(/s$/, L('', 's'))}</text>`);
      });
      y += hMax + 52;
      s.push(rotuloPainel(L('POTÊNCIA OUTORGADA', 'LICENSED CAPACITY'), y));
      const lc = circulos(y + 18);
      s.push(lc.svg);
      s.push(emObra(LP - 220, y + 34));
      return { svg: s.join('\n'), y: y + 18 + lc.altura };
    },
    fontes: () => [
      L(`ANEEL, SIGA (dados abertos, ${ref})`, `ANEEL, SIGA (open data, ${ref})`),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ 3 a lavoura que manda */
async function lavoura() {
  const c = await ler('lavoura');
  const br = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', 'brasil-base.json'), 'utf8'));
  const COR = Object.fromEntries(c.grupos.map((g) => [g.chave, g.cor]));
  COR.sem = SEM_BOI;
  COR.sem_dado = SEM_DADO;
  const mha = (ha, casas = 1) => nf(ha / 1e6, casas);
  const soja = c.grupos.find((g) => g.chave === 'soja');
  const so = c.soja_maior;
  const arroz = c.mais_mono.find((r) => r.lavoura.startsWith('Arroz'));
  const caixa = (cor, rot, y, passo) => `<rect x="0" y="${y}" width="34" height="${passo - 8}" fill="${cor}" stroke="#c9ced3" stroke-width=".8"/>
<text x="48" y="${y + passo - 12}" font-family="${SERIF}" font-size="16">${esc(rot)}</text>`;
  const itens = () => [...c.grupos.map((g) => [g.cor, L(g.rotulo, g.rotulo_en), g]), [SEM_BOI, L('sem lavoura', 'no crops'), null]];
  return () => ({
    layout: 'um',
    motivo: 'agro',
    serie: serie(3),
    titulo: () => L('A lavoura que manda', 'The crop in charge'),
    subtitulo: () => L('A cultura de maior área em cada município', 'The crop with the largest area in each municipality'),
    descricao: () => L(
      `A lavoura com mais hectares em cada município, entre as temporárias (área plantada) e as permanentes (área destinada à colheita), na Produção Agrícola Municipal de 2024`,
      `The crop with the most hectares in each municipality, among temporary crops (planted area) and permanent crops (area for harvest), in the 2024 Municipal Agricultural Production survey`),
    mapa: () => ({
      preencher: () => '#f1f2f3',
      bordaMunicipio: 0,
      semRgint: true,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      camadas: [
        { feats: c.municipios.features, cor: (f) => COR[f.properties.grupo] ?? SEM_DADO, borda: 'none', largura: 0 },
        { feats: br.ufs.features, cor: 'none', borda: '#4a4e52', largura: 0.9, opacidade: 1 },
      ],
      chamadas: [{
        coord: so.coord, dx: -230, dy: 270,
        titulo: L(`${nf(so.ha / 1000, 0)} MIL HECTARES DE SOJA`, `${nf(so.ha / 1000, 0)} THOUSAND HECTARES OF SOYA`),
        linhas: L([`${so.nome} (${so.uf}), o maior`, 'campo de soja do país'], [`${so.nome} (${so.uf}), the country’s`, 'largest soya field']),
      }, {
        coord: arroz.coord, dx: 200, dy: 140,
        titulo: L(`${nf(arroz.parcela, 0)} % ARROZ`, `${nf(arroz.parcela, 0)} % RICE`),
        linhas: L([`${arroz.nome} (${arroz.uf}): quase só arroz`, 'nas várzeas da fronteira'], [`${arroz.nome} (${arroz.uf}): almost only rice`, 'on the border floodplains']),
      }],
    }),
    legendaFigura: () => {
      const s = [rotuloPainel(L('LAVOURA DE MAIOR ÁREA', 'CROP WITH THE LARGEST AREA'), 0)];
      const passo = 25;
      let y = 22;
      for (const [cor, rot] of itens()) { s.push(caixa(cor, rot, y, passo)); y += passo; }
      const larg = 48 + Math.max(...itens().map(([, r]) => largura(r, 16)));
      return { svg: s.join('\n'), altura: y - 8, largura: Math.ceil(larg), canto: 'se' };
    },
    numeros: () => [
      [nf(soja.municipios), [L('municípios têm a soja', 'municipalities have soya'), L('como maior lavoura', 'as their largest crop')]],
      [`${mha(soja.area_ha)} Mha`, [L('de soja: quase metade', 'of soya: nearly half'), L(`dos ${mha(c.area_total_ha, 0)} Mha de lavouras`, `of the ${mha(c.area_total_ha, 0)} Mha of crops`)]],
      [nf(c.grupos.find((g) => g.chave === 'milho').municipios), [L('municípios onde', 'municipalities where'), L('manda o milho', 'maize leads')]],
      [nf(c.sem_lavoura), [L('municípios', 'municipalities'), L('sem lavoura', 'with no crops')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('MUNICÍPIOS · MILHÕES DE HECTARES', 'MUNICIPALITIES · MILLION HECTARES'), y)];
      y += 22;
      const passo = 26;
      const maxM = Math.max(...c.grupos.map((g) => g.municipios));
      for (const [cor, rot, g] of itens()) {
        s.push(caixa(cor, rot, y, passo));
        if (g) {
          const wb = (g.municipios / maxM) * (LP - 330);
          s.push(`<rect x="190" y="${y + 5}" width="${f1(Math.max(wb, 1))}" height="${passo - 18}" fill="${cor}" stroke="#7c5a3a" stroke-width=".5"/>`);
          s.push(`<text x="${f1(198 + wb)}" y="${y + passo - 12}" font-family="${MONO}" font-size="12.5">${nf(g.municipios)}</text>`);
          s.push(`<text x="${LP}" y="${y + passo - 12}" text-anchor="end" font-family="${MONO}" font-size="12.5" fill="${CINZA}">${mha(g.area_ha)}</text>`);
        } else {
          s.push(`<text x="190" y="${y + passo - 12}" font-family="${MONO}" font-size="12.5">${nf(c.sem_lavoura)}</text>`);
        }
        y += passo;
      }
      s.push(`<text x="0" y="${y + 14}" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L('barras: municípios onde a lavoura é a maior · à direita: área no país (Mha)', 'bars: municipalities where the crop leads · right: area in Brazil (Mha)'))}</text>`);
      return { svg: s.join('\n'), y: y + 20 };
    },
    fontes: () => [
      L('IBGE, Produção Agrícola Municipal 2024', 'IBGE, Municipal Agricultural Production 2024'),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ 4 onde está o esterco */
async function esterco() {
  const c = await ler('esterco');
  const br = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', 'brasil-base.json'), 'utf8'));
  const COR = Object.fromEntries(c.classes.map((k) => [k.classe, k.cor]));
  COR[-2] = SEM_DADO;
  const ovo = c.topo[0];
  const porco = c.topo.find((r) => r.lider === 'suínos');
  const bov = c.especies[0];
  const caixa = (cor, rot, y, passo) => `<rect x="0" y="${y}" width="34" height="${passo - 8}" fill="${cor}" stroke="#c9ced3" stroke-width=".8"/>
<text x="48" y="${y + passo - 12}" font-family="${SERIF}" font-size="16">${esc(rot)}</text>`;
  const itens = () => [...[...c.classes].reverse().map((k) => [k.cor, L(k.rotulo, k.rotulo_en), k]), [SEM_DADO, L('sem dado na PPM', 'no data in the PPM'), null]];
  return () => ({
    layout: 'um',
    motivo: 'biogas',
    serie: serie(4),
    titulo: () => L('Onde está o esterco', 'Where the manure is'),
    subtitulo: () => L('Boi, porco e galinha na mesma conta', 'Cattle, pigs and hens in one sum'),
    descricao: () => L(
      `Rebanhos da Pesquisa da Pecuária Municipal de 2024 convertidos em unidades animais (UA) da FAO e divididos pela área de cada município`,
      `Herds from the 2024 Municipal Livestock Survey converted into FAO livestock units (LU) and divided by the area of each municipality`),
    mapa: () => ({
      preencher: () => '#f1f2f3',
      bordaMunicipio: 0,
      semRgint: true,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      camadas: [
        { feats: c.municipios.features, cor: (f) => COR[f.properties.classe] ?? SEM_DADO, borda: 'none', largura: 0 },
        { feats: br.ufs.features, cor: 'none', borda: '#4a4e52', largura: 0.9, opacidade: 1 },
      ],
      chamadas: [{
        coord: ovo.coord, dx: 400, dy: -170,
        titulo: L(`${nf(ovo.ua_km2, 0)} UA POR KM²`, `${nf(ovo.ua_km2, 0)} LU PER KM²`),
        linhas: L([`${ovo.nome} (${ovo.uf}), a capital do ovo:`, `${nf(ovo.galinaceos / 1e6, 1)} milhões de galinhas`],
          [`${ovo.nome} (${ovo.uf}), the egg capital:`, `${nf(ovo.galinaceos / 1e6, 1)} million hens`]),
      }, {
        coord: porco.coord, dx: 260, dy: 90,
        titulo: L(`${nf(porco.ua_km2, 0)} UA POR KM²`, `${nf(porco.ua_km2, 0)} LU PER KM²`),
        linhas: L([`${porco.nome} (${porco.uf}): ${nf(porco.suinos)} porcos`, 'no oeste catarinense'],
          [`${porco.nome} (${porco.uf}): ${nf(porco.suinos)} pigs`, 'in western Santa Catarina']),
      }],
    }),
    legendaFigura: () => {
      const s = [rotuloPainel(L('UNIDADES ANIMAIS POR KM²', 'LIVESTOCK UNITS PER KM²'), 0)];
      const passo = 27;
      let y = 22;
      for (const [cor, rot] of itens()) { s.push(caixa(cor, rot, y, passo)); y += passo; }
      const larg = 48 + Math.max(...itens().map(([, r]) => largura(r, 16)));
      return { svg: s.join('\n'), altura: y - 8, largura: Math.ceil(larg), canto: 'se' };
    },
    numeros: () => [
      [`${nf(c.ua / 1e6, 0)} mi`, [L('de unidades animais', 'livestock units'), L('no país', 'in Brazil')]],
      [`${nf((bov.ua / c.ua) * 100, 0)} %`, [L('delas são bovinos', 'are cattle')]],
      [`${nf(c.especies.find((e) => e.chave === 'galináceos').cabecas / 1e9, 2)} bi`, [L('de galináceos:', 'poultry:'), L('pouca UA, muito adensada', 'few LU, densely packed')]],
      [`${nf(c.ua / c.area_km2, 0)} UA/km²`, [L('na média do país', 'national average')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('UA POR KM² · MUNICÍPIOS', 'LU PER KM² · MUNICIPALITIES'), y)];
      y += 22;
      const passo = 27;
      const maxM = Math.max(...c.classes.map((k) => k.municipios));
      for (const [cor, rot, k] of itens()) {
        s.push(caixa(cor, rot, y, passo));
        if (k) {
          const wb = (k.municipios / maxM) * (LP - 290);
          s.push(`<rect x="200" y="${y + 5}" width="${f1(wb)}" height="${passo - 18}" fill="${cor}" stroke="#7c5a3a" stroke-width=".5"/>`);
          s.push(`<text x="${f1(208 + wb)}" y="${y + passo - 12}" font-family="${MONO}" font-size="12.5">${nf(k.municipios)}</text>`);
        }
        y += passo;
      }
      y += 30;
      s.push(rotuloPainel(L('UNIDADES ANIMAIS POR ESPÉCIE', 'LIVESTOCK UNITS BY SPECIES'), y));
      y += 18;
      let x = 0;
      for (const e of c.especies) {
        const w = (e.ua / c.ua) * LP;
        s.push(`<rect x="${f1(x)}" y="${y}" width="${f1(Math.max(w, 0.8))}" height="22" fill="${e.cor}"/>`);
        x += w;
      }
      s.push(`<rect x="0" y="${y}" width="${LP}" height="22" fill="none" stroke="${TINTA}" stroke-width=".8"/>`);
      y += 50;
      for (const e of c.especies.slice(0, 4)) {
        s.push(`<circle cx="12" cy="${y - 6}" r="8" fill="${e.cor}" stroke="${PAPEL}"/>`);
        s.push(`<text x="32" y="${y}" font-family="${SERIF}" font-size="16">${esc(L(e.rotulo, e.rotulo_en))}</text>`);
        s.push(`<text x="${LP - 110}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="12.5" fill="${CINZA}">× ${nf(e.coef, 2)}</text>`);
        s.push(`<text x="${LP}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="12.5">${nf((e.ua / c.ua) * 100, 1)} %</text>`);
        y += 25;
      }
      s.push(`<text x="0" y="${y + 2}" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L('UA por cabeça (FAO, América do Sul) · parcela das UA', 'LU per head (FAO, South America) · share of LU'))}</text>`);
      return { svg: s.join('\n'), y: y + 8 };
    },
    fontes: () => [
      L('IBGE, Pesquisa da Pecuária Municipal 2024', 'IBGE, Municipal Livestock Survey 2024'),
      L('FAO, coeficientes de unidade animal (2011)', 'FAO, livestock unit coefficients (2011)'),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ 5 a floresta que se planta */
/** Friso: fileiras de eucalipto, troncos retos e copas estreitas, plantados em linha. */
function talhao(w, h) {
  const s = [];
  const n = Math.floor(w / 22);
  for (let i = 0; i < n; i++) {
    const x = 11 + i * (w - 22) / (n - 1);
    const alto = h * (0.7 + 0.3 * Math.abs(Math.sin(i * 1.7)));
    const topo = h - alto;
    s.push(`<path d="M${f1(x)} ${h}V${f1(topo + 6)}" stroke="#8a8f84" stroke-width="1.2"/>`);
    s.push(`<path d="M${f1(x)} ${f1(topo)}c-6 ${f1(alto * 0.18)} -6 ${f1(alto * 0.4)} 0 ${f1(alto * 0.55)}c6 ${f1(-alto * 0.15)} 6 ${f1(-alto * 0.37)} 0 ${f1(-alto * 0.55)}z" fill="none" stroke="#5a8f4e" stroke-width="1.1"/>`);
  }
  return s.join('');
}

async function floresta() {
  const c = await ler('floresta');
  const br = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'cache', 'brasil-base.json'), 'utf8'));
  const mha = (ha, casas = 1) => nf(ha / 1e6, casas);
  const eu = c.especies.find((e) => e.chave === 'eucalipto');
  const pin = c.especies.find((e) => e.chave === 'pinus');
  const ribas = c.maiores[0];
  const arroio = c.mais_pct_pinus[0];
  const cel = c.celulose_m3;
  const ESP = () => c.especies.map((e) => [e.chave, L(e.rotulo, e.rotulo_en)]);
  // Legenda em grade: uma linha por espécie, uma coluna por faixa da área do município.
  const grade = (y0) => {
    const s = [];
    const cw = 44;
    const x0 = 128;
    c.rotulos.forEach(([pt, en], j) => s.push(`<text x="${x0 + j * cw + cw / 2 - 2}" y="${y0}" text-anchor="middle" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L(pt, en).replace(/ ?%| ou mais| or more/g, '').replace(' a ', '–').replace(' to ', '–') + (j === 3 ? '+' : ''))}</text>`));
    let y = y0 + 8;
    for (const [k, rot] of ESP()) {
      s.push(`<text x="0" y="${y + 17}" font-family="${SERIF}" font-size="16">${esc(rot)}</text>`);
      c.cores[k].forEach((cor, j) => s.push(`<rect x="${x0 + j * cw}" y="${y}" width="${cw - 4}" height="22" fill="${cor}" stroke="#c9ced3" stroke-width=".6"/>`));
      y += 28;
    }
    s.push(`<text x="${x0 + 2 * cw - 2}" y="${y + 6}" text-anchor="middle" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L('% da área do município', '% of municipal area'))}</text>`);
    y += 22;
    for (const [cor, rot] of [[c.pouca, L('menos de 1 %', 'under 1%')], [SEM_BOI, L('sem floresta plantada registrada', 'no planted forest recorded')], [SEM_DADO, L('sem dado na PEVS', 'no data in the PEVS')]]) {
      s.push(`<rect x="0" y="${y}" width="34" height="19" fill="${cor}" stroke="#c9ced3" stroke-width=".8"/>`);
      s.push(`<text x="48" y="${y + 15}" font-family="${SERIF}" font-size="15">${esc(rot)}</text>`);
      y += 26;
    }
    return { svg: s.join('\n'), y };
  };
  return () => ({
    layout: 'um',
    motivo: talhao,
    serie: serie(5),
    titulo: () => L('A floresta que se planta', 'The forest that is planted'),
    subtitulo: () => L('Eucalipto no Cerrado, pínus no Sul', 'Eucalyptus in the Cerrado, pine in the South'),
    descricao: () => L(
      `Área de floresta plantada em 31/12/2025 como parte da área de cada município, com a cor da espécie de maior área, na Produção da Extração Vegetal e da Silvicultura do IBGE`,
      `Planted forest area on 31/12/2025 as a share of each municipality’s area, coloured by the species with the largest area, in IBGE’s Forestry and Plant Extraction Production survey`),
    mapa: () => ({
      preencher: () => '#f1f2f3',
      bordaMunicipio: 0,
      semRgint: true,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      camadas: [
        { feats: c.municipios.features, cor: (f) => f.properties.cor, borda: 'none', largura: 0 },
        { feats: br.ufs.features, cor: 'none', borda: '#4a4e52', largura: 0.9, opacidade: 1 },
      ],
      chamadas: [{
        coord: ribas.coord, dx: -300, dy: 200,
        titulo: L(`${nf(ribas.ha / 1000, 0)} MIL HECTARES`, `${nf(ribas.ha / 1000, 0)} THOUSAND HECTARES`),
        linhas: L([`${ribas.nome} (${ribas.uf}), a maior área plantada:`, `eucalipto em ${nf(ribas.pct, 0)} % do município`],
          [`${ribas.nome} (${ribas.uf}), the largest planted area:`, `eucalyptus on ${nf(ribas.pct, 0)} % of the municipality`]),
      }, {
        coord: arroio.coord, dx: 300, dy: -40,
        titulo: L(`${nf(arroio.pct, 0)} % DO MUNICÍPIO`, `${nf(arroio.pct, 0)} % OF THE MUNICIPALITY`),
        linhas: L([`${arroio.nome} (${arroio.uf}): o mais plantado`, 'do país, quase todo de pínus'],
          [`${arroio.nome} (${arroio.uf}): the most planted`, 'in the country, almost all pine']),
      }],
    }),
    legendaFigura: () => {
      const s = [rotuloPainel(L('FLORESTA PLANTADA', 'PLANTED FOREST'), 0)];
      const g = grade(30);
      s.push(g.svg);
      return { svg: s.join('\n'), altura: g.y - 8, largura: 310, canto: 'se' };
    },
    numeros: () => [
      [`${mha(c.ha_2025)} Mha`, [L('de floresta plantada,', 'of planted forest,'), L(`${nf(c.pct_brasil, 1)} % do território`, `${nf(c.pct_brasil, 1)} % of the land area`)]],
      [`${nf((eu.ha_2025 / c.ha_2025) * 100, 0)} %`, [L('dela é eucalipto', 'of it is eucalyptus')]],
      [L(`${nf(cel[2025] / 1e6, 0)} mi m³`, `${nf(cel[2025] / 1e6, 0)} M m³`), [L('de tora para celulose', 'of pulpwood logs'), L(`em 2025 (+${nf((cel[2025] / cel[2015] - 1) * 100, 0)} % em 10 anos)`, `in 2025 (+${nf((cel[2025] / cel[2015] - 1) * 100, 0)} % in 10 years)`)]],
      [nf(c.acima_1pct), [L('municípios com mais de', 'municipalities with over'), L('1 % da área plantada', '1 % of their area planted')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('ESPÉCIE DE MAIOR ÁREA · % DA ÁREA DO MUNICÍPIO', 'LEADING SPECIES · % OF MUNICIPAL AREA'), y)];
      const g = grade(y + 26);
      s.push(g.svg);
      y = g.y + 22;
      s.push(rotuloPainel(L('MILHÕES DE HECTARES · 2015 → 2025', 'MILLION HECTARES · 2015 → 2025'), y));
      y += 30;
      const maxH = Math.max(...c.especies.flatMap((e) => [e.ha_2015, e.ha_2025]));
      for (const e of c.especies) {
        const w15 = (e.ha_2015 / maxH) * (LP - 250);
        const w25 = (e.ha_2025 / maxH) * (LP - 250);
        const v = ((e.ha_2025 / e.ha_2015) - 1) * 100;
        s.push(`<text x="0" y="${y}" font-family="${SERIF}" font-size="16">${esc(L(e.rotulo, e.rotulo_en))}</text>`);
        s.push(`<rect x="140" y="${y - 15}" width="${f1(w15)}" height="7" fill="${PAPEL}" stroke="${e.cor}" stroke-width=".8"/>`);
        s.push(`<rect x="140" y="${y - 6}" width="${f1(w25)}" height="7" fill="${e.cor}"/>`);
        s.push(`<text x="${f1(148 + Math.max(w15, w25))}" y="${y}" font-family="${MONO}" font-size="12.5">${mha(e.ha_2025, 2)}</text>`);
        s.push(`<text x="${LP}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="12.5" fill="${v < 0 ? CINZA : '#2a5530'}">${v > 0 ? '+' : '−'}${nf(Math.abs(v), 0)} %</text>`);
        y += 30;
      }
      y += 16;
      s.push(rotuloPainel(L('ONDE ESTÁ · MIL HECTARES', 'WHERE IT IS · THOUSAND HECTARES'), y));
      y += 26;
      const maxU = c.ufs[0].ha;
      for (const u of c.ufs.slice(0, 6)) {
        const w = (u.ha / maxU) * (LP - 120);
        s.push(`<text x="0" y="${y}" font-family="${MONO}" font-size="13">${u.uf}</text>`);
        s.push(`<rect x="40" y="${y - 11}" width="${f1(w)}" height="12" fill="${eu.cor}" fill-opacity=".8"/>`);
        s.push(`<text x="${f1(48 + w)}" y="${y}" font-family="${MONO}" font-size="12.5">${nf(u.ha / 1000)}</text>`);
        y += 22;
      }
      return { svg: s.join('\n'), y: y - 8 };
    },
    fontes: () => [
      L('IBGE, Extração Vegetal e Silvicultura (PEVS) 2015 e 2025', 'IBGE, Forestry and Plant Extraction (PEVS) 2015 and 2025'),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ 6 lenha da mata ou plantada */
async function lenha() {
  const c = await ler('lenha');
  const COR = Object.fromEntries(c.classes.map((k) => [k.classe, k.cor]));
  const raio = (m3) => 1.4 + 0.021 * Math.sqrt(m3);
  const mi3 = (v, casas = 1) => nf(v / 1e6, casas);
  const t15 = c.totais['2015'];
  const t25 = c.totais['2025'];
  const lenhaTot = t25.lenha_nativa + t25.lenha_plantada;
  const nat = c.maiores_nativa[0];
  const pla = c.maiores_plantada[0];
  const pontos = c.pontos.map(([k, lon, lat, m3]) => ({ coord: [lon, lat], r: raio(m3), cor: COR[k], opacidade: 0.82, bordaLargura: Math.min(0.9, 0.25 * raio(m3)) }));
  const classe = (k, y) => `<circle cx="12" cy="${y - 6}" r="8" fill="${k.cor}" fill-opacity=".85" stroke="${PAPEL}"/>
<text x="32" y="${y}" font-family="${SERIF}" font-size="16">${esc(L(k.rotulo, k.rotulo_en))}</text>`;
  const ordem = () => [...c.classes].reverse();
  const circulos = (y) => legendaCirculos([800000, 200000, 20000], raio, (v) => L(`${nf(v / 1000)} mil m³`, `${nf(v / 1000)} thousand m³`), { y, cor: CINZA });
  const NAT = c.classes[3].cor;
  const PLA = c.classes[0].cor;
  // Barra dupla: nativa à esquerda, plantada em seguida, na mesma escala.
  const barra = (rot, n, p, max, y, un) => {
    const wn = (n / max) * (LP - 150);
    const wp = (p / max) * (LP - 150);
    return [`<text x="0" y="${y}" font-family="${SERIF}" font-size="16">${esc(rot)}</text>`,
      `<rect x="60" y="${y - 13}" width="${f1(wn)}" height="14" fill="${NAT}"/>`,
      `<rect x="${f1(60 + wn)}" y="${y - 13}" width="${f1(wp)}" height="14" fill="${PLA}"/>`,
      `<text x="${f1(68 + wn + wp)}" y="${y}" font-family="${MONO}" font-size="12.5">${nf(((n) / (n + p)) * 100, 0)} % ${L('nativa', 'native')}</text>`].join('\n') + (un ?? '');
  };
  return () => ({
    layout: 'um',
    motivo: 'agro',
    serie: serie(6),
    titulo: () => L('Lenha da mata ou plantada', 'Firewood: native or planted'),
    subtitulo: () => L('O Sul queima eucalipto; o Sertão, a mata', 'The South burns eucalyptus; the Sertão, native wood'),
    descricao: () => L(
      `Lenha produzida em 2025 em cada município: a da extração vegetal (mata nativa) e a da silvicultura (floresta plantada), na Produção da Extração Vegetal e da Silvicultura do IBGE`,
      `Firewood produced in 2025 in each municipality: from plant extraction (native forest) and from forestry (planted forest), in IBGE’s Forestry and Plant Extraction Production survey`),
    mapa: () => ({
      preencher: () => '#f1f2f3',
      bordaMunicipio: 0.9,
      bordaUnidadeCor: '#c9ced3',
      semRgint: true,
      bordaEstado: 2,
      tamanhoUnidade: 12,
      pontos,
      chamadas: [{
        coord: nat.coord, dx: -250, dy: 170,
        titulo: L(`${nf(nat.m3 / 1000, 0)} MIL M³ DE LENHA`, `${nf(nat.m3 / 1000, 0)} THOUSAND M³ OF FIREWOOD`),
        linhas: L([`${nat.nome} (${nat.uf}), a maior do país:`, `${nf(nat.nativa * 100, 0)} % tirada da mata nativa`],
          [`${nat.nome} (${nat.uf}), the country’s largest:`, `${nf(nat.nativa * 100, 0)} % cut from native forest`]),
      }, {
        coord: pla.coord, dx: 330, dy: -110,
        titulo: L(`${nf(pla.m3 / 1000, 0)} MIL M³ PLANTADOS`, `${nf(pla.m3 / 1000, 0)} THOUSAND M³ PLANTED`),
        linhas: L([`${pla.nome} (${pla.uf}): lenha de eucalipto`, 'para secar grão e tocar caldeira'],
          [`${pla.nome} (${pla.uf}): eucalyptus firewood`, 'to dry grain and fire boilers']),
      }],
    }),
    legendaFigura: () => {
      const s = [rotuloPainel(L('ORIGEM DA LENHA', 'WHERE THE FIREWOOD COMES FROM'), 0)];
      let y = 26;
      for (const k of ordem()) { s.push(classe(k, y)); y += 25; }
      y += 22;
      s.push(rotuloPainel(L('LENHA EM 2025', 'FIREWOOD IN 2025'), y));
      const lc = circulos(y + 18);
      s.push(lc.svg);
      y += 18 + lc.altura;
      return { svg: s.join('\n'), altura: y, largura: 270, canto: 'se' };
    },
    numeros: () => [
      [L(`${mi3(lenhaTot, 0)} mi m³`, `${mi3(lenhaTot, 0)} M m³`), [L('de lenha em 2025', 'of firewood in 2025')]],
      [`${nf((t25.lenha_nativa / lenhaTot) * 100, 0)} %`, [L('vêm da mata nativa', 'come from native forest'), L(`(${nf((t15.lenha_nativa / (t15.lenha_nativa + t15.lenha_plantada)) * 100, 0)} % em 2015)`, `(${nf((t15.lenha_nativa / (t15.lenha_nativa + t15.lenha_plantada)) * 100, 0)} % in 2015)`)]],
      [`${nf((t25.carvao_plantado / (t25.carvao_plantado + t25.carvao_nativo)) * 100, 0)} %`, [L('do carvão vegetal', 'of charcoal'), L('já é de floresta plantada', 'now comes from planted forest')]],
      [nf(c.classes[3].municipios), [L('municípios queimam', 'municipalities burn'), L('quase só lenha nativa', 'almost only native wood')]],
    ],
    painel: (y) => {
      const s = [rotuloPainel(L('ORIGEM DA LENHA · MUNICÍPIOS · MI M³', 'FIREWOOD ORIGIN · MUNICIPALITIES · MILLION M³'), y)];
      y += 26;
      for (const k of ordem()) {
        s.push(classe(k, y));
        s.push(`<text x="${LP - 92}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="13" fill="${CINZA}">${nf(k.municipios)}</text>`);
        s.push(`<text x="${LP}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="13">${mi3(k.m3)}</text>`);
        y += 25;
      }
      y += 30;
      s.push(rotuloPainel(L('NATIVA E PLANTADA · 2015 → 2025', 'NATIVE AND PLANTED · 2015 → 2025'), y));
      y += 28;
      const maxL = Math.max(t15.lenha_nativa + t15.lenha_plantada, lenhaTot);
      s.push(`<text x="0" y="${y}" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L('LENHA, MI M³', 'FIREWOOD, MILLION M³'))}</text>`);
      y += 22;
      for (const [ano, t] of [['2015', t15], ['2025', t25]]) {
        s.push(barra(ano, t.lenha_nativa, t.lenha_plantada, maxL, y));
        y += 24;
      }
      y += 8;
      const maxC = Math.max(t15.carvao_nativo + t15.carvao_plantado, t25.carvao_nativo + t25.carvao_plantado);
      s.push(`<text x="0" y="${y}" font-family="${MONO}" font-size="11" fill="${CINZA}">${esc(L('CARVÃO VEGETAL, MI T', 'CHARCOAL, MILLION T'))}</text>`);
      y += 22;
      for (const [ano, t] of [['2015', t15], ['2025', t25]]) {
        s.push(barra(ano, t.carvao_nativo, t.carvao_plantado, maxC, y));
        y += 24;
      }
      s.push(`<rect x="0" y="${y - 4}" width="22" height="10" fill="${NAT}"/><text x="30" y="${y + 5}" font-family="${MONO}" font-size="11" fill="${CINZA}">${L('mata nativa', 'native forest')}</text>`);
      s.push(`<rect x="150" y="${y - 4}" width="22" height="10" fill="${PLA}"/><text x="180" y="${y + 5}" font-family="${MONO}" font-size="11" fill="${CINZA}">${L('floresta plantada', 'planted forest')}</text>`);
      y += 40;
      s.push(rotuloPainel(L('LENHA EM 2025', 'FIREWOOD IN 2025'), y));
      const lc = circulos(y + 18);
      s.push(lc.svg);
      return { svg: s.join('\n'), y: y + 18 + lc.altura };
    },
    fontes: () => [
      L('IBGE, Extração Vegetal e Silvicultura (PEVS) 2015 e 2025', 'IBGE, Forestry and Plant Extraction (PEVS) 2015 and 2025'),
      L('IBGE, Malha Municipal 2025', 'IBGE, Municipal Mesh 2025'),
    ],
  });
}

/* ------------------------------------------------------------------ */
const TEMAS = { boi, eletricidade, lavoura, esterco, floresta, lenha };
const nome = process.argv[2];
if (!TEMAS[nome]) {
  console.error(`uso: node scripts/colecoes/biomassa-br/prancha.mjs <${Object.keys(TEMAS).join('|')}>`);
  process.exit(1);
}
await usarBrasil();
const e = SERIE.find((s) => s.tema === nome);
const fazer = await TEMAS[nome]();
const tamanhos = await gerarPrancha({ pasta: e.pasta, base: e.base, numero: e.numero, data: e.data, fazerTema: () => fazer() });
await writeFile(join(RAIZ, 'scripts', 'colecoes', 'cache', `biomassa-br-${nome}_prancha.json`), JSON.stringify(tamanhos, null, 1));
