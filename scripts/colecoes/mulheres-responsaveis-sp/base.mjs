// Coleção «Mulheres responsáveis pelo domicílio» (mulheres-responsaveis-sp), passo 2. Base por município e por APOND,
// só com Node, a partir dos agregados por setor do Censo 2022 (Características do Domicílio, parte 2), que trazem cada
// serviço separado pelo sexo da pessoa responsável.
// Saídas em dados-brutos/analises/mulheres/: municipios.csv, apond.csv e setores.json (parte de responsáveis mulheres por setor).
//
// Regras:
// - Cada taxa usa o denominador do próprio bloco de variáveis (água, esgoto, lixo, banheiro), por sexo.
// - "X" (sigilo) nunca é zero. Nesta tabela ele cobre duas situações: o setor inteiro em X (setores de poucos domicílios),
//   que fica de fora, e células isoladas em X num setor com dado. Nas 600 mil células das categorias raras não aparece
//   nenhum 1 nem 2, só 0, X e valores de 3 para cima: a célula isolada em X vale 1 ou 2. Ela entra como 1,5 na
//   estimativa, e os limites (1 e 2, combinados no pior caso) dão o intervalo de cada taxa e de cada diferença.
//   A unidade só recebe a taxa se os setores usados cobrirem ≥ 80% dos domicílios dela.
// - Diferença de cobertura (mulheres − homens, em pontos percentuais) decomposta em duas partes:
//     composição = onde as responsáveis moram (cobertura dos homens no mesmo setor, pesada pelos domicílios delas) − cobertura dos homens;
//     dentro do setor = cobertura delas − cobertura dos homens do mesmo setor, pesada pelos domicílios delas.
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tabelaCenso, basico } from '../lib/setores-sp.mjs';
import { linhasCsv, gravarCsv, RAIZ, BRUTOS } from '../lib/dados.mjs';

const OUT = join(BRUTOS, 'analises', 'mulheres');
mkdirSync(OUT, { recursive: true });
const COB_MIN = 0.8;
const V = (n) => `V${String(n).padStart(5, '0')}`;
// Pares (homens, mulheres): o dicionário põe o masculino no número ímpar e o feminino no seguinte.
const par = (a) => [V(a), V(a + 1)];
const bloco = (a, n) => Array.from({ length: n }, (_, i) => par(a + 2 * i));

// Serviço: [nome, descrição, categorias "com serviço", todas as categorias do bloco]
const SERVICOS = [
  ['agua_rede', 'Abastecimento pela rede geral de água', [par(183)], bloco(183, 8)],
  ['agua_dentro', 'Água encanada até dentro de casa', [par(226)], bloco(226, 3)],
  ['esgoto_rede', 'Esgoto na rede geral ou pluvial, ou em fossa ligada à rede', [par(381), par(383)], bloco(381, 8)],
  ['lixo_coletado', 'Lixo coletado no domicílio ou em caçamba', [par(451), par(453)], bloco(451, 6)],
  ['banheiro', 'Ao menos um banheiro de uso exclusivo', bloco(295, 4), bloco(295, 7)],
];
// O total de domicílios por sexo do responsável sai do bloco do esgoto, o único com a categoria "não tinham banheiro".
const TOTAL = bloco(381, 8);

const vars = new Set();
for (const [, , , todas] of SERVICOS) for (const [m, f] of todas) { vars.add(m); vars.add(f); }
const T2 = await tabelaCenso('domicilio2', [...vars]);
const RE = await tabelaCenso('renda', ['V06001', 'V06004']);
const B = await basico();
console.log(`setores: domicilio2 ${T2.size} · renda ${RE.size} · básico ${B.size}`);

const deP = new Map();
for await (const l of linhasCsv(join(BRUTOS, 'ibge/malhas-sp/DePara_SetorCensit22xAPOND22_35_SP.csv'))) {
  const cd = l[0].replace(/^﻿/, '');
  if (/^\d/.test(cd)) deP.set(cd, l[1]);
}

// Soma com X = 1,5 (est), 1 (lo) ou 2 (hi); null se todas as células vierem em X (setor inteiro em sigilo).
const somaV = (o, ks, x = 1.5) => { let s = 0; for (const k of ks) { const v = o[k]; s += v == null ? x : v; } return s; };
const tudoX = (o, ks) => ks.every((k) => o[k] == null);
const lado = (pares, i) => pares.map((p) => p[i]);

const acc = { mun: new Map(), apond: new Map() };
const nova = () => ({ pessoas: 0, urb: 0, area: 0, domM: 0, domF: 0, domMLo: 0, domMHi: 0, domFLo: 0, domFHi: 0, domTot: 0, resp: 0, rendaS: 0, sv: {} });
const CAMPOS = ['dM', 'dF', 'nM', 'nF', 'sM', 'sF', 'nLoM', 'nHiM', 'sLoM', 'sHiM', 'nLoF', 'nHiF', 'sLoF', 'sHiF', 'contraF'];
const setores = {};
for (const [cd, b] of B) {
  const o = T2.get(cd);
  const dpo = b.dpo ?? 0;
  const okT = o && !tudoX(o, TOTAL.flat());
  const tot = okT ? [somaV(o, lado(TOTAL, 0)), somaV(o, lado(TOTAL, 1))] : [null, null];
  if (okT && tot[0] + tot[1] > 0) setores[cd] = { m: tot[0], f: tot[1], mLo: somaV(o, lado(TOTAL, 0), 1), mHi: somaV(o, lado(TOTAL, 0), 2), fLo: somaV(o, lado(TOTAL, 1), 1), fHi: somaV(o, lado(TOTAL, 1), 2) };
  const linha = {};
  if (o) {
    for (const [nome, , com, todas] of SERVICOS) {
      if (tudoX(o, todas.flat())) { linha[nome] = null; continue; }
      const sem = todas.filter((p) => !com.some((q) => q[0] === p[0]));
      const v = {};
      for (const [i, sx] of [[0, 'M'], [1, 'F']]) {
        // n: com o serviço; s: sem. Est = X a 1,5; lo/hi = X a 1 ou a 2.
        v['n' + sx] = somaV(o, lado(com, i)); v['s' + sx] = somaV(o, lado(sem, i));
        v['nLo' + sx] = somaV(o, lado(com, i), 1); v['nHi' + sx] = somaV(o, lado(com, i), 2);
        v['sLo' + sx] = somaV(o, lado(sem, i), 1); v['sHi' + sx] = somaV(o, lado(sem, i), 2);
        v['d' + sx] = v['n' + sx] + v['s' + sx];
      }
      linha[nome] = v;
    }
  }
  const r = RE.get(cd);
  for (const [nivel, u] of [['mun', b.CD_MUN], ['apond', deP.get(cd)]]) {
    if (!u) continue;
    let a = acc[nivel].get(u);
    if (!a) { a = nova(); acc[nivel].set(u, a); }
    a.pessoas += b.pessoas ?? 0; a.area += b.area ?? 0;
    if (b.situacao === 'Urbana') a.urb += b.pessoas ?? 0;
    a.domTot += dpo;
    if (setores[cd]) { const t = setores[cd]; a.domM += t.m; a.domF += t.f; a.domMLo += t.mLo; a.domMHi += t.mHi; a.domFLo += t.fLo; a.domFHi += t.fHi; }
    if (r?.V06001 > 0 && r.V06004 != null) { a.resp += r.V06001; a.rendaS += r.V06001 * r.V06004; }
    for (const [nome] of SERVICOS) {
      const s = (a.sv[nome] ??= Object.fromEntries(CAMPOS.map((k) => [k, 0])));
      const v = linha[nome];
      if (!v) continue;
      for (const k of CAMPOS) if (k !== 'contraF') s[k] += v[k];
      // Taxa dos homens no mesmo setor; sem homens no setor, usa a delas (diferença zero dentro do setor).
      const rM = v.dM > 0 ? v.nM / v.dM : v.dF > 0 ? v.nF / v.dF : 0;
      s.contraF += v.dF * rM;
    }
  }
}

const r1 = (x, c = 2) => (x == null || !Number.isFinite(x) ? null : Math.round(x * 10 ** c) / 10 ** c);
function linhas(nivel) {
  const out = [];
  for (const [cd, a] of acc[nivel]) {
    const o = { cd };
    o.pessoas = a.pessoas;
    o.dom = a.domTot;
    o.dom_resp_homem = a.domM;
    o.dom_resp_mulher = a.domF;
    const cobT = a.domTot > 0 ? (a.domM + a.domF) / a.domTot : 0;
    const okT = cobT >= COB_MIN && a.domM + a.domF > 0;
    o.pct_resp_mulher = okT ? r1((100 * a.domF) / (a.domM + a.domF)) : null;
    o.pct_resp_mulher_lo = okT ? r1((100 * a.domFLo) / (a.domFLo + a.domMHi)) : null;
    o.pct_resp_mulher_hi = okT ? r1((100 * a.domFHi) / (a.domFHi + a.domMLo)) : null;
    o.pct_urbana = a.pessoas > 0 ? r1((100 * a.urb) / a.pessoas) : null;
    o.log_densidade = a.area > 0 && a.pessoas > 0 ? r1(Math.log10(a.pessoas / a.area), 4) : null;
    o.renda_resp_media = a.resp > 0 ? r1(a.rendaS / a.resp, 0) : null;
    for (const [nome] of SERVICOS) {
      const s = a.sv[nome];
      const cob = a.domM + a.domF > 0 ? (s.dM + s.dF) / (a.domM + a.domF) : 0;
      const ok = cob >= COB_MIN && s.dM > 0 && s.dF > 0;
      const cM = ok ? (100 * s.nM) / s.dM : null, cF = ok ? (100 * s.nF) / s.dF : null;
      const contra = ok ? (100 * s.contraF) / s.dF : null;
      o[`${nome}_total`] = ok ? r1((100 * (s.nM + s.nF)) / (s.dM + s.dF)) : null;
      o[`${nome}_homem`] = r1(cM);
      o[`${nome}_mulher`] = r1(cF);
      o[`${nome}_dif`] = ok ? r1(cF - cM) : null;
      o[`${nome}_dif_composicao`] = ok ? r1(contra - cM) : null;
      o[`${nome}_dif_setor`] = ok ? r1(cF - contra) : null;
      // Pior caso do sigilo: taxa mínima de um sexo contra a máxima do outro.
      const tx = (n, sm) => (100 * n) / (n + sm);
      o[`${nome}_dif_lo`] = ok ? r1(tx(s.nLoF, s.sHiF) - tx(s.nHiM, s.sLoM)) : null;
      o[`${nome}_dif_hi`] = ok ? r1(tx(s.nHiF, s.sLoF) - tx(s.nLoM, s.sHiM)) : null;
      // Domicílios sem o serviço, por sexo do responsável (para os números absolutos).
      o[`${nome}_sem_homem`] = ok ? s.dM - s.nM : null;
      o[`${nome}_sem_mulher`] = ok ? s.dF - s.nF : null;
    }
    out.push(o);
  }
  return out.sort((a, b) => a.cd.localeCompare(b.cd));
}

const mun = linhas('mun'), ap = linhas('apond');
const cols = Object.keys(mun[0]);
gravarCsv(join(OUT, 'municipios.csv'), mun, cols);
gravarCsv(join(OUT, 'apond.csv'), ap, cols);
writeFileSync(join(OUT, 'setores.json'), JSON.stringify(setores));

// Estado
const est = { domM: 0, domF: 0 };
const sv = {};
for (const a of acc.mun.values()) {
  est.domM += a.domM; est.domF += a.domF;
  for (const [nome] of SERVICOS) { const s = (sv[nome] ??= Object.fromEntries(CAMPOS.map((k) => [k, 0]))); for (const k in s) s[k] += a.sv[nome][k]; }
}
console.log(`estado: ${est.domF} domicílios com responsável mulher de ${est.domM + est.domF} (${((100 * est.domF) / (est.domM + est.domF)).toFixed(2)} %)`);
const estServ = {};
for (const [nome] of SERVICOS) {
  const s = sv[nome];
  const cM = (100 * s.nM) / s.dM, cF = (100 * s.nF) / s.dF, c = (100 * s.contraF) / s.dF;
  estServ[nome] = { homem: cM, mulher: cF, dif: cF - cM, comp: c - cM, setor: cF - c };
  console.log(`${nome.padEnd(14)} homens ${cM.toFixed(2)} · mulheres ${cF.toFixed(2)} · dif ${(cF - cM).toFixed(2)} = composição ${(c - cM).toFixed(2)} + dentro do setor ${(cF - c).toFixed(2)} · cobertura dos dados ${((100 * (s.dM + s.dF)) / (est.domM + est.domF)).toFixed(1)} %`);
}
writeFileSync(join(OUT, 'estado.json'), JSON.stringify(estServ, null, 1));
console.log(`municípios com taxa: ${mun.filter((o) => o.pct_resp_mulher != null).length}/${mun.length} · APOND: ${ap.filter((o) => o.pct_resp_mulher != null).length}/${ap.length}`);
for (const [nome] of SERVICOS) console.log(`  ${nome}: mun ${mun.filter((o) => o[`${nome}_dif`] != null).length} · apond ${ap.filter((o) => o[`${nome}_dif`] != null).length}`);
