#!/usr/bin/env node
/**
 * Coleção «Monitor da biomassa» (Brasil) — desenha uma prancha a partir do cache de preparar.py (uso interno).
 *
 *   node scripts/colecoes/biomassa-br/prancha.mjs boi|eletricidade
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  RAIZ, LP, SERIF, MONO, CINZA, PAPEL, TINTA, esc, nf, f1, lingua, largura,
  gerarPrancha, rotuloPainel, usarBrasil,
} from '../lib/prancha-sp.mjs';
import { legendaCirculos } from '../lib/arte.mjs';

export const SERIE = JSON.parse(await readFile(join(RAIZ, 'scripts', 'colecoes', 'biomassa-br', 'serie.json'), 'utf8'));
const TOTAL = 8; // pranchas previstas na coleção
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

/* ------------------------------------------------------------------ */
const TEMAS = { boi, eletricidade, lavoura, esterco };
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
