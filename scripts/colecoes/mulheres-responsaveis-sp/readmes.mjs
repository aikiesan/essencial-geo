// Gera README.md e README.en.md das pranchas 103–110 (coleção mulheres-responsaveis-sp) a partir do cache.
// Uso: node scripts/colecoes/mulheres-responsaveis-sp/readmes.mjs (depois de preparar.mjs dados gpkg e das pranchas).
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LILAS, OCRE, COR_VAR, COR_LUZ, COR_DIF, LIM_DIF, classe } from './preparar.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const C = JSON.parse(readFileSync(join(RAIZ, 'scripts/colecoes/cache/mulheres-responsaveis-sp.json'), 'utf8'));
const SERIE = JSON.parse(readFileSync(join(RAIZ, 'scripts/colecoes/mulheres-responsaveis-sp/serie.json'), 'utf8'));
const REL = 'https://github.com/aikiesan/essencial-geo/releases/download/mulheres-responsaveis-sp-2026';
const GPKG = 'sp_mulheres_responsaveis_2022.gpkg.zip';
const CSV_MUN = 'sp_mulheres_responsaveis_municipios_2022.csv';
const CSV_AP = 'sp_mulheres_responsaveis_apond_2022.csv';
const E = C.est, S = C.estServ, R = C.resumo.municipios, T = (n, x, y) => C.testes[`${n}|${x}|${y}`];

const fmt = (loc) => (v, d = 0) => (v == null ? '—' : Number(v).toLocaleString(loc, { minimumFractionDigits: d, maximumFractionDigits: d }).replace(/^-/, '−'));
const np = fmt('pt-BR'), ne = fmt('en-GB');
const dp = (v) => np(v, 2), de = (v) => ne(v, 2);
const sp_ = (v, d = 1) => (v > 0 ? '+' : '') + np(v, d), se = (v, d = 1) => (v > 0 ? '+' : '') + ne(v, d);
const mi = (v) => np(v / 1e6, 2), mie = (v) => ne(v / 1e6, 2);
const mun = (n) => C.mun.find((m) => m.NM_MUN === n);
const mb = (arq) => (statSync(arq).size / 1e6).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' MB';
const kb = (arq) => `${Math.round(statSync(arq).size / 1e4) * 10} kB`;
const pTxt = (p) => (p < 0.001 ? '< 0,001' : `= ${np(p, 3)}`), pTxtE = (p) => (p < 0.001 ? '< 0.001' : `= ${ne(p, 3)}`);
const ORD_PT = ['primeira', 'segunda', 'terceira', 'quarta', 'quinta', 'sexta', 'sétima', 'oitava'];
const ORD_EN = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'];

/* ------------------------------------------------------------------ fontes */
const sidra = (t, ano, pt, en) => ({ nome: `IBGE — Censo Demográfico ${ano}, SIDRA tabela ${t} (${pt})`, nome_en: `IBGE — ${ano} Population Census, SIDRA table ${t} (${en})`, url: `https://sidra.ibge.gov.br/tabela/${t}`, ano });
const F = {
  setores: { nome: 'IBGE — Censo Demográfico 2022: agregados por setores censitários (domicílio, parte 2; renda do responsável)', nome_en: 'IBGE — 2022 Population Census: aggregates by census tract (households, part 2; income of the responsible person)', url: 'https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html', ano: 2022 },
  apond: { nome: 'IBGE — Malha de setores censitários e áreas de ponderação 2022', nome_en: 'IBGE — 2022 census tract and weighting area mesh', url: 'https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/26565-malhas-de-setores-censitarios-divisoes-intramunicipais.html', ano: 2022 },
  malha: { nome: 'IBGE — Malha Municipal 2025', nome_en: 'IBGE — Municipal Mesh 2025', url: 'https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html', ano: 2025 },
  s9882: sidra(9882, 2022, 'domicílios por presença de cônjuge e filhos e sexo do responsável, universo', 'households by presence of spouse and children and sex of the responsible person, full count'),
  s9583: sidra(9583, 2022, 'iluminação pública no entorno dos domicílios, Pesquisa Urbanística do Entorno', 'street lighting around homes, Urban Surroundings Survey'),
  s10299: sidra(10299, 2022, 'rendimento médio das pessoas de 14 anos ou mais por sexo, amostra', 'mean income of people aged 14 or over by sex, sample'),
  s3221: sidra(3221, 2010, 'domicílios por sexo da pessoa responsável, universo', 'households by sex of the responsible person, full count'),
  s3217: sidra(3217, 2010, 'domicílios por existência de energia elétrica, universo', 'households by access to electricity, full count'),
};

/* ------------------------------------------------------------------ textos comuns */
const respPt = 'Pessoa responsável é quem os moradores apontam como tal ao recenseador. Não quer dizer quem sustenta a casa, nem mãe solo: das casas paulistas com responsável mulher, ' + np(E.f_conjuge, 0) + '% têm cônjuge.';
const respEn = 'The responsible person is whoever the residents name as such to the enumerator. It does not mean the breadwinner, nor a lone mother: of São Paulo homes with a woman responsible, ' + ne(E.f_conjuge, 0) + '% include a spouse.';
const ecoPt = 'Leitura ecológica: o mapa compara lugares, não pessoas. Uma correlação entre municípios não diz que as mesmas casas têm as duas características, nem que uma causa a outra; urbanização, renda e idade podem estar por trás das duas.';
const ecoEn = 'Ecological reading: the map compares places, not people. A correlation between municipalities does not say that the same homes have both traits, nor that one causes the other; urbanisation, income and age may lie behind both.';
const sigiloPt = 'Nos setores, o IBGE troca por X as células de 1 ou 2 domicílios (nas categorias raras, os valores 1 e 2 nunca aparecem publicados). Aqui o X vale 1,5, e cada taxa e diferença traz os limites com X = 1 e X = 2 no pior caso (colunas `_lo` e `_hi`); setores inteiros em X ficam de fora. A soma dos setores reproduz a parte de responsáveis mulheres da tabela 9882 em cada município com erro de no máximo ' + np(Math.max(Math.abs(R.dif_setores_sidra.min), R.dif_setores_sidra.max), 2) + ' ponto (mediana ' + np(R.dif_setores_sidra.med, 2) + ').';
const sigiloEn = 'In census tracts, IBGE replaces cells of 1 or 2 households with X (in the rare categories, the values 1 and 2 never appear in print). Here an X counts as 1.5, and every rate and gap carries the worst-case limits with X = 1 and X = 2 (columns `_lo` and `_hi`); tracts that are wholly X are left out. Summed tracts reproduce the share of women responsible in table 9882 for every municipality within ' + ne(Math.max(Math.abs(R.dif_setores_sidra.min), R.dif_setores_sidra.max), 2) + ' point (median ' + ne(R.dif_setores_sidra.med, 2) + ').';
const decompPt = 'Decomposição da diferença entre mulheres e homens: a parte de «endereço» (onde elas moram) é a cobertura que as casas delas teriam se, em cada setor censitário, tivessem a mesma taxa das casas de homens do setor, menos a cobertura dos homens; a parte «dentro do setor» é o resto. O setor é a menor área publicada; dentro dele, o Censo não diz qual casa fica onde.';
const decompEn = 'Decomposition of the gap between women and men: the “address” part (where they live) is the coverage women’s homes would have if, in each census tract, they had the same rate as men’s homes in that tract, minus men’s coverage; the “within the tract” part is the rest. The tract is the smallest published area; within it, the Census does not say which home stands where.';
const ctrlPt = 'urbanização (parte de moradores em situação urbana), log da densidade demográfica e log da renda média dos responsáveis';
const ctrlEn = 'urbanisation (residents in urban areas), log of population density and log of mean income of the responsible person';
const testePt = (t, txt) => `${txt}: correlação de postos de Spearman ${dp(t.rho)} (${np(t.n)} ${t.nivel === 'apond' ? 'áreas' : 'municípios'}), parcial ${dp(t.parcial)}, amostra efetiva ${np(t.n_eff)}, p ${pTxt(t.p_eff)}`;
const testeEn = (t, txt) => `${txt}: Spearman rank correlation ${de(t.rho)} (${ne(t.n)} ${t.nivel === 'apond' ? 'areas' : 'municipalities'}), partial ${de(t.parcial)}, effective sample ${ne(t.n_eff)}, p ${pTxtE(t.p_eff)}`;
const metodoTestePt = `Correlação parcial: correlação entre os resíduos dos postos de cada variável regredidos nos postos dos controles, que são ${ctrlPt}; sai o controle da mesma família da variável. Amostra efetiva sob autocorrelação espacial: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), com Iₓ e Iᵧ o I de Moran dos resíduos numa vizinhança dos 6 vizinhos mais próximos; valores q de Benjamini–Hochberg sobre todos os testes da coleção.`;
const metodoTesteEn = `Partial correlation: the correlation between the residuals of each variable’s ranks regressed on the ranks of the controls, which are ${ctrlEn}; the control from the variable’s own family is dropped. Effective sample under spatial autocorrelation: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), where Iₓ and Iᵧ are the Moran’s I of the residuals over a 6-nearest-neighbour neighbourhood; Benjamini–Hochberg q values across all tests in the collection.`;
const servPt = (k) => ({ agua_rede: 'água da rede geral', esgoto_rede: 'esgoto na rede', lixo_coletado: 'lixo coletado', banheiro: 'banheiro de uso exclusivo', agua_dentro: 'água encanada dentro de casa' }[k]);
const servEn = (k) => ({ agua_rede: 'mains water', esgoto_rede: 'mains sewerage', lixo_coletado: 'refuse collection', banheiro: 'exclusive bathroom', agua_dentro: 'piped water indoors' }[k]);
const SERV = ['agua_rede', 'esgoto_rede', 'lixo_coletado', 'banheiro', 'agua_dentro'];
const linhaServPt = (k) => `${servPt(k)}: ${np(S[k].mulher, 1)}% nas casas delas e ${np(S[k].homem, 1)}% nas deles (${sp_(S[k].dif, 2)} ${Math.abs(S[k].dif) >= 2 ? 'pontos' : 'ponto'}; endereço ${sp_(S[k].comp, 2)}, dentro do setor ${sp_(S[k].setor, 2)})`;
const linhaServEn = (k) => `${servEn(k)}: ${ne(S[k].mulher, 1)}% in women’s homes and ${ne(S[k].homem, 1)}% in men’s (${se(S[k].dif, 2)} ${Math.abs(S[k].dif) >= 2 ? 'points' : 'point'}; address ${se(S[k].comp, 2)}, within the tract ${se(S[k].setor, 2)})`;
const varServPt = (k, desc) => `\`${k}_homem\`, \`${k}_mulher\`, \`${k}_dif\` (com \`_lo\` e \`_hi\`), \`${k}_dif_composicao\` e \`${k}_dif_setor\`: ${desc}, em % das casas com responsável homem e mulher, e as diferenças em pontos percentuais (setores do Censo 2022, universo).`;
const varServEn = (k, desc) => `\`${k}_homem\`, \`${k}_mulher\`, \`${k}_dif\` (with \`_lo\` and \`_hi\`), \`${k}_dif_composicao\` and \`${k}_dif_setor\`: ${desc}, as % of homes with a man and a woman responsible, and the gaps in percentage points (2022 Census tracts, full count).`;

/* ------------------------------------------------------------------ pranchas */
const P = {};
const tF = (y) => T('municipios', 'pct_resp_mulher', y), tA = (y) => T('apond', 'pct_resp_mulher', y);

P.distribuicao = () => {
  const A = C.apond, al = A.alta, ba = A.baixa;
  const tu = tA('pct_urbana'), td = tA('log_densidade'), tr = tA('renda_resp_media'), tm = tF('pct_urbana');
  return {
    tags: ['domicilios', 'genero'], escala: 'apond', cor: LILAS[4],
    h1: ['Domicílios com responsável mulher em São Paulo, por área de ponderação', 'Households with a woman responsible in São Paulo, by weighting area'],
    contextoPt: `Em 2022, ${np(E.pct, 1)}% dos domicílios paulistas (${mi(E.domF)} milhões de ${mi(E.domF + E.domM)} milhões) tinham uma mulher como pessoa responsável; em 2010 eram ${np(E.pct2010, 1)}%. Por área de ponderação, a parte é maior nas cidades e nos bairros densos: correlação de postos de ${dp(tu.rho)} com a urbanização e ${dp(td.rho)} com a densidade, nas ${np(tu.n)} áreas. Entre os municípios, vai de ${np(R.pct_resp_mulher.min, 0)}% a ${np(R.pct_resp_mulher.max, 0)}%. Responsável é quem os moradores apontam ao recenseador: não quer dizer quem sustenta a casa, nem mãe solo. Primeira prancha da coleção «Mulheres responsáveis pelo domicílio», que cruza esse dado com esgoto, água, iluminação e renda, sempre comparando lugares, não pessoas.`,
    contextoEn: `In 2022, ${ne(E.pct, 1)}% of São Paulo’s households (${mie(E.domF)} million out of ${mie(E.domF + E.domM)} million) named a woman as the responsible person; in 2010 it was ${ne(E.pct2010, 1)}%. By weighting area, the share is higher in towns and dense neighbourhoods: a rank correlation of ${de(tu.rho)} with urbanisation and ${de(td.rho)} with density, across ${ne(tu.n)} areas. Across municipalities it runs from ${ne(R.pct_resp_mulher.min, 0)}% to ${ne(R.pct_resp_mulher.max, 0)}%. The responsible person is whoever the residents name to the enumerator: it does not mean the breadwinner, nor a lone mother. First plate of the collection “Women heading households”, which crosses this figure with sewerage, water, lighting and income, always comparing places, not people.`,
    altPt: `Mapa coroplético das ${np(A.n)} áreas de ponderação de São Paulo em seis tons de lilás, do claro (menos de 40% de domicílios com responsável mulher) ao escuro (56% ou mais); ${np(A.sem)} áreas sem dado aparecem hachuradas. Os tons escuros aparecem sobretudo nas manchas urbanas, e a capital forma um mosaico de áreas pequenas. Chamadas apontam a área de Ourinhos, com ${np(al.pct_resp_mulher, 0)}%, a maior entre as de 5 mil moradores ou mais, e a de Alumínio, com ${np(ba.pct_resp_mulher, 0)}%, a menor. No painel, a legenda com o número de áreas por classe e a tabela das correlações com urbanização, densidade e renda.`,
    altEn: `Choropleth map of São Paulo’s ${ne(A.n)} weighting areas in six shades of lilac, from light (under 40% of households with a woman responsible) to dark (56% or more); ${ne(A.sem)} areas without data are hatched. Dark shades appear mostly in urban patches, and the capital forms a mosaic of small areas. Callouts point to the Ourinhos area, at ${ne(al.pct_resp_mulher, 0)}%, the highest among areas of 5,000+ residents, and the Alumínio area, at ${ne(ba.pct_resp_mulher, 0)}%, the lowest. In the panel, the legend with the number of areas per class and the table of correlations with urbanisation, density and income.`,
    chamadasPt: `a área de ponderação de Ourinhos, com ${np(al.pct_resp_mulher, 0)}% de domicílios com responsável mulher (a maior entre as de 5 mil moradores ou mais), e a de Alumínio, com ${np(ba.pct_resp_mulher, 0)}% (a menor)`,
    chamadasEn: `the Ourinhos weighting area, with ${ne(al.pct_resp_mulher, 0)}% of households with a woman responsible (the highest among areas of 5,000+ residents), and the Alumínio area, with ${ne(ba.pct_resp_mulher, 0)}% (the lowest)`,
    fontes: [F.setores, F.apond, F.s9882, F.s3221, F.malha],
    metodoPt: 'Domicílios com pessoa responsável mulher sobre o total, por área de ponderação, a partir da soma dos setores censitários do Censo 2022 (universo); seis classes de 4 pontos; correlações de postos de Spearman com urbanização, densidade e renda, brutas e parciais.',
    metodoEn: 'Households with a woman as the responsible person over all households, by weighting area, from summed 2022 Census tracts (full count); six classes of 4 points; Spearman rank correlations with urbanisation, density and income, raw and partial.',
    indicadores: [
      ['Domicílios com responsável mulher no estado', 'Households with a woman responsible statewide', +E.pct.toFixed(1), '%', `${np(E.domF / 1e6, 2)} milhões; ${np(E.pct2010, 1)}% em 2010`, `${ne(E.domF / 1e6, 2)} million; ${ne(E.pct2010, 1)}% in 2010`],
      ['Correlação com a urbanização, nas áreas de ponderação', 'Correlation with urbanisation, across weighting areas', +tu.rho.toFixed(2), null, `parcial ${dp(tu.parcial)}`, `partial ${de(tu.parcial)}`],
      ['Correlação com a densidade, nas áreas de ponderação', 'Correlation with density, across weighting areas', +td.rho.toFixed(2), null, `parcial ${dp(td.parcial)}`, `partial ${de(td.parcial)}`],
    ],
    variaveisPt: [
      '`pct_resp_mulher`: domicílios particulares permanentes ocupados com pessoa responsável mulher sobre o total (setores do Censo 2022, domicílio parte 2, universo), somados por área de ponderação; `pct_resp_mulher_lo` e `_hi` trazem os limites do sigilo.',
      `Seis classes: menos de 40%, 40 a 44%, 44 a 48%, 48 a 52%, 52 a 56% e 56% ou mais. Áreas com menos de 80% dos domicílios em setores com dado ficam sem cor (${np(A.sem)} áreas).`,
      testePt(tu, 'Com a urbanização (moradores em situação urbana)') + '; ' + testePt(td, 'com o log da densidade').replace(/^c/, 'c') + '; ' + testePt(tr, 'com a renda média dos responsáveis') + '.',
      testePt(tm, 'Nos 645 municípios, com a urbanização') + `. I de Moran da parte de responsáveis mulheres: ${dp(tu.Ix)} nas áreas e ${dp(tm.Ix)} nos municípios; LISA univariado nos municípios (6 vizinhos, 999 permutações, semente 20261019, p < 0,05): ${np(C.lisaF.cont.AA)} alto-alto e ${np(C.lisaF.cont.BB)} baixo-baixo (\`lisa103\`).`,
      metodoTestePt,
    ],
    variaveisEn: [
      '`pct_resp_mulher`: occupied permanent private households with a woman as the responsible person over all households (2022 Census tracts, households part 2, full count), summed by weighting area; `pct_resp_mulher_lo` and `_hi` carry the confidentiality limits.',
      `Six classes: under 40%, 40 to 44%, 44 to 48%, 48 to 52%, 52 to 56% and 56% or more. Areas with under 80% of households in tracts with data are left blank (${ne(A.sem)} areas).`,
      testeEn(tu, 'With urbanisation (residents in urban areas)') + '; ' + testeEn(td, 'with log of density') + '; ' + testeEn(tr, 'with mean income of the responsible person') + '.',
      testeEn(tm, 'Across the 645 municipalities, with urbanisation') + `. Moran’s I of the share of women responsible: ${de(tu.Ix)} across areas and ${de(tm.Ix)} across municipalities; univariate LISA across municipalities (6 neighbours, 999 permutations, seed 20261019, p < 0.05): ${ne(C.lisaF.cont.AA)} high-high and ${ne(C.lisaF.cont.BB)} low-low (\`lisa103\`).`,
      metodoTesteEn,
    ],
    limitesPt: [respPt, sigiloPt, 'A parcial com a urbanização cai para perto de zero nas áreas de ponderação porque a densidade carrega quase tudo: o que pesa é o tipo de bairro, não só o rótulo urbano ou rural.', ecoPt],
    limitesEn: [respEn, sigiloEn, 'The partial with urbanisation falls close to zero across weighting areas because density carries nearly all of it: what matters is the kind of neighbourhood, not just the urban or rural label.', ecoEn],
  };
};

P.crescimento = () => {
  const a = mun('Morro Agudo'), sp = mun('São Paulo');
  const tu = T('municipios', 'var_resp_mulher', 'pct_urbana'), t10 = T('municipios', 'pct_resp_mulher_2010', 'var_resp_mulher');
  const queda = C.mun.filter((m) => m.var_resp_mulher < 0);
  const maiorQueda = Math.max(...queda.map((m) => m.pessoas));
  const cresc = Math.round((100 * (E.domF - E.f2010)) / E.f2010);
  return {
    tags: ['domicilios', 'genero', 'censo-2010'], cor: COR_VAR[3],
    h1: ['Variação da parte de domicílios com responsável mulher em São Paulo, 2010–2022', 'Change in the share of households with a woman responsible in São Paulo, 2010–2022'],
    contextoPt: `De 2010 a 2022, a parte dos domicílios paulistas com responsável mulher subiu de ${np(E.pct2010, 1)}% para ${np(E.pct, 1)}%: ${sp_(E.pct - E.pct2010, 1)} pontos e ${cresc}% mais casas (de ${mi(E.f2010)} para ${mi(E.domF)} milhões). Subiu em ${645 - queda.length} dos 645 municípios; os ${queda.length} em que caiu são pequenos. Morro Agudo foi de ${np(a.pct_resp_mulher_2010, 0)}% para ${np(a.pct_resp_mulher, 0)}%, o maior salto entre os de 20 mil habitantes ou mais; a capital, que já partia de ${np(sp.pct_resp_mulher_2010, 0)}%, chegou a ${np(sp.pct_resp_mulher, 0)}%. O aumento não segue a urbanização (ρ ${dp(tu.rho)}) e foi maior onde a parte era menor em 2010 (ρ ${dp(t10.rho)}). Os dois Censos usam o mesmo conceito de responsável e o mesmo universo de domicílios. Segunda prancha da coleção «Mulheres responsáveis pelo domicílio».`,
    contextoEn: `From 2010 to 2022, the share of São Paulo’s households with a woman responsible rose from ${ne(E.pct2010, 1)}% to ${ne(E.pct, 1)}%: ${se(E.pct - E.pct2010, 1)} points and ${cresc}% more homes (from ${mie(E.f2010)} to ${mie(E.domF)} million). It rose in ${645 - queda.length} of the 645 municipalities; the ${queda.length} where it fell are small. Morro Agudo went from ${ne(a.pct_resp_mulher_2010, 0)}% to ${ne(a.pct_resp_mulher, 0)}%, the biggest jump among towns of 20,000 or more; the capital, already at ${ne(sp.pct_resp_mulher_2010, 0)}%, reached ${ne(sp.pct_resp_mulher, 0)}%. The rise does not follow urbanisation (ρ ${de(tu.rho)}) and was larger where the share was lower in 2010 (ρ ${de(t10.rho)}). Both Censuses use the same concept of responsible person and the same universe of households. Second plate of the collection “Women heading households”.`,
    altPt: `Mapa coroplético dos 645 municípios de São Paulo em cinco tons de lilás, da alta de 0 a 5 pontos percentuais (claro) à de 20 pontos ou mais (escuro), e em ocre os ${queda.length} municípios em que a parte de domicílios com responsável mulher caiu de 2010 a 2022. Os tons médios cobrem quase todo o estado. Chamadas apontam Morro Agudo, de ${np(a.pct_resp_mulher_2010, 0)}% para ${np(a.pct_resp_mulher, 0)}%, e São Paulo, de ${np(sp.pct_resp_mulher_2010, 0)}% para ${np(sp.pct_resp_mulher, 0)}%. No painel, a legenda com o número de municípios por classe e a comparação entre o estado, o município mediano e a capital.`,
    altEn: `Choropleth map of São Paulo’s 645 municipalities in five shades of lilac, from a rise of 0 to 5 percentage points (light) to 20 points or more (dark), with the ${queda.length} municipalities where the share of households with a woman responsible fell from 2010 to 2022 in ochre. Middle shades cover almost the whole state. Callouts point to Morro Agudo, from ${ne(a.pct_resp_mulher_2010, 0)}% to ${ne(a.pct_resp_mulher, 0)}%, and São Paulo, from ${ne(sp.pct_resp_mulher_2010, 0)}% to ${ne(sp.pct_resp_mulher, 0)}%. In the panel, the legend with the number of municipalities per class and a comparison of the state, the median municipality and the capital.`,
    chamadasPt: `Morro Agudo, que foi de ${np(a.pct_resp_mulher_2010, 0)}% para ${np(a.pct_resp_mulher, 0)}% (${sp_(a.var_resp_mulher, 0)} pontos, o maior salto entre os de 20 mil habitantes ou mais), e São Paulo, de ${np(sp.pct_resp_mulher_2010, 0)}% para ${np(sp.pct_resp_mulher, 0)}%`,
    chamadasEn: `Morro Agudo, which went from ${ne(a.pct_resp_mulher_2010, 0)}% to ${ne(a.pct_resp_mulher, 0)}% (${se(a.var_resp_mulher, 0)} points, the biggest jump among towns of 20,000 or more), and São Paulo, from ${ne(sp.pct_resp_mulher_2010, 0)}% to ${ne(sp.pct_resp_mulher, 0)}%`,
    fontes: [F.s3221, F.setores, F.malha],
    metodoPt: 'Diferença, em pontos percentuais, entre a parte de domicílios com responsável mulher em 2022 (soma dos setores) e em 2010 (SIDRA 3221), por município, ambos do universo; cinco classes de alta e uma de queda; correlações de postos de Spearman.',
    metodoEn: 'Difference, in percentage points, between the share of households with a woman responsible in 2022 (summed tracts) and in 2010 (SIDRA 3221), by municipality, both full count; five classes of rise and one of fall; Spearman rank correlations.',
    indicadores: [
      ['Variação no estado, 2010–2022', 'Change statewide, 2010–2022', +(E.pct - E.pct2010).toFixed(1), 'pontos percentuais', `de ${np(E.pct2010, 1)}% para ${np(E.pct, 1)}%`, `from ${ne(E.pct2010, 1)}% to ${ne(E.pct, 1)}%`, 'percentage points'],
      ['Aumento dos domicílios com responsável mulher', 'Rise in households with a woman responsible', cresc, '%', `${mi(E.f2010)} → ${mi(E.domF)} milhões`, `${mie(E.f2010)} → ${mie(E.domF)} million`],
      ['Municípios em que a parte subiu', 'Municipalities where the share rose', 645 - queda.length, 'municípios', `de 645`, `out of 645`],
    ],
    variaveisPt: [
      '`pct_resp_mulher_2010`: domicílios particulares permanentes com pessoa responsável mulher sobre o total, Censo 2010 (SIDRA 3221, universo). O total estadual da tabela, 12.827.153 domicílios, é o mesmo da tabela 3217, o que confirma o universo.',
      '`pct_resp_mulher`: o mesmo em 2022, pela soma dos setores censitários (domicílio, parte 2, universo).',
      `\`var_resp_mulher\`: a diferença em pontos percentuais. Classes: queda; 0 a 5; 5 a 10; 10 a 15; 15 a 20; 20 ou mais. No município mediano, ${sp_(R.var_resp_mulher.med, 1)} pontos (de ${np(R.pct_resp_mulher_2010.med, 1)}% para ${np(R.pct_resp_mulher.med, 1)}%).`,
      `${testePt(tu, 'Variação × urbanização')}; ${testePt(t10, 'variação × parte em 2010')}.`,
      metodoTestePt,
    ],
    variaveisEn: [
      '`pct_resp_mulher_2010`: permanent private households with a woman as the responsible person over all households, 2010 Census (SIDRA 3221, full count). The table’s state total, 12,827,153 households, matches table 3217, which confirms the full count.',
      '`pct_resp_mulher`: the same in 2022, from summed census tracts (households, part 2, full count).',
      `\`var_resp_mulher\`: the difference in percentage points. Classes: fall; 0 to 5; 5 to 10; 10 to 15; 15 to 20; 20 or more. In the median municipality, ${se(R.var_resp_mulher.med, 1)} points (from ${ne(R.pct_resp_mulher_2010.med, 1)}% to ${ne(R.pct_resp_mulher.med, 1)}%).`,
      `${testeEn(tu, 'Change × urbanisation')}; ${testeEn(t10, 'change × 2010 share')}.`,
      metodoTesteEn,
    ],
    limitesPt: [
      'A comparação é direta porque os dois Censos usam o mesmo conceito de pessoa responsável, o mesmo universo (domicílios particulares permanentes ocupados) e a mesma lista de 645 municípios. A malha é a de 2025; nenhum município paulista foi criado ou desmembrado no período.',
      `Os ${queda.length} municípios em que a parte caiu são pequenos (o maior tem ${np(maiorQueda)} moradores); neles, poucas dezenas de casas mudam a taxa.`,
      'O aumento pode vir de mudança na família (mais mulheres morando sem cônjuge, mais idosas viúvas) e também de mudança em quem a família aponta como responsável. O Censo não separa as duas coisas.',
      respPt, ecoPt,
    ],
    limitesEn: [
      'The comparison is direct because both Censuses use the same concept of responsible person, the same universe (occupied permanent private households) and the same list of 645 municipalities. The mesh is the 2025 one; no São Paulo municipality was created or split in the period.',
      `The ${queda.length} municipalities where the share fell are small (the largest has ${ne(maiorQueda)} residents); in them, a few dozen homes move the rate.`,
      'The rise may come from changes in families (more women living without a spouse, more widowed older women) and also from changes in whom the family names as responsible. The Census does not separate the two.',
      respEn, ecoEn,
    ],
  };
};

P.conjuge = () => {
  const a = mun('Itupeva'), b = mun('Santos');
  const tc = tF('pct_mulher_com_conjuge'), ts = tF('pct_mulher_sem_conjuge_filhos');
  return {
    tags: ['domicilios', 'genero', 'familia'], cor: OCRE[3],
    h1: ['Mulheres responsáveis que vivem com cônjuge nos municípios de São Paulo', 'Women responsible who live with a spouse across São Paulo’s municipalities'],
    contextoPt: `Pessoa responsável não é sinônimo de mãe solo. Das casas paulistas com responsável mulher, ${np(E.f_conjuge, 1)}% têm cônjuge (nas de responsável homem, ${np(E.m_conjuge, 1)}%) e ${np(E.f_sem_conjuge_filhos, 1)}% são de mulher sem cônjuge com filhos ou enteados. Ainda assim, ${np(E.monoparental_mulher_share, 0)}% dos lares sem cônjuge com filhos têm uma mulher à frente. Nos municípios, onde há mais responsáveis mulheres, mais delas vivem com cônjuge (correlação de postos ${dp(tc.rho)}; parcial ${dp(tc.parcial)}) e menos são sem cônjuge com filhos (${dp(ts.rho)}). Em Itupeva, ${np(a.pct_mulher_com_conjuge, 0)}% vivem com cônjuge; em Santos, ${np(b.pct_mulher_com_conjuge, 0)}%. Terceira prancha da coleção «Mulheres responsáveis pelo domicílio».`,
    contextoEn: `The responsible person is not the same as a lone mother. Of São Paulo homes with a woman responsible, ${ne(E.f_conjuge, 1)}% include a spouse (with a man responsible, ${ne(E.m_conjuge, 1)}%) and ${ne(E.f_sem_conjuge_filhos, 1)}% are a woman without a spouse with children or stepchildren. Even so, ${ne(E.monoparental_mulher_share, 0)}% of homes without a spouse but with children have a woman at the head. Across municipalities, where more women are responsible, more of them live with a spouse (rank correlation ${de(tc.rho)}; partial ${de(tc.parcial)}) and fewer are without a spouse with children (${de(ts.rho)}). In Itupeva, ${ne(a.pct_mulher_com_conjuge, 0)}% live with a spouse; in Santos, ${ne(b.pct_mulher_com_conjuge, 0)}%. Third plate of the collection “Women heading households”.`,
    altPt: `Mapa coroplético dos 645 municípios de São Paulo em cinco tons de ocre, do claro (menos de 40% das responsáveis mulheres vivendo com cônjuge) ao escuro (55% ou mais). Os tons claros aparecem na capital, na Baixada Santista e em cidades maiores. Chamadas apontam Itupeva, com ${np(a.pct_mulher_com_conjuge, 0)}%, e Santos, com ${np(b.pct_mulher_com_conjuge, 0)}%. No painel, duas barras comparam a composição das casas com responsável mulher e com responsável homem no estado (com cônjuge, sem cônjuge com filhos, outras), e uma tabela traz as correlações.`,
    altEn: `Choropleth map of São Paulo’s 645 municipalities in five shades of ochre, from light (under 40% of women responsible living with a spouse) to dark (55% or more). Light shades appear in the capital, the Santos coast and larger towns. Callouts point to Itupeva, at ${ne(a.pct_mulher_com_conjuge, 0)}%, and Santos, at ${ne(b.pct_mulher_com_conjuge, 0)}%. In the panel, two bars compare the make-up of homes with a woman and with a man responsible statewide (with spouse, without spouse with children, other), and a table gives the correlations.`,
    chamadasPt: `Itupeva, onde ${np(a.pct_mulher_com_conjuge, 0)}% das responsáveis vivem com cônjuge (a maior parte entre os de 20 mil habitantes ou mais), e Santos, com ${np(b.pct_mulher_com_conjuge, 0)}%, numa cidade de muitas idosas que moram sós`,
    chamadasEn: `Itupeva, where ${ne(a.pct_mulher_com_conjuge, 0)}% of women responsible live with a spouse (the highest share among towns of 20,000 or more), and Santos, at ${ne(b.pct_mulher_com_conjuge, 0)}%, a city with many older women living alone`,
    fontes: [F.s9882, F.malha],
    metodoPt: 'Domicílios com responsável mulher em que há cônjuge (com ou sem filhos), sobre todos os domicílios com responsável mulher, por município (SIDRA 9882, universo); cinco classes; correlações de postos de Spearman com a parte de responsáveis mulheres, brutas e parciais.',
    metodoEn: 'Households with a woman responsible that include a spouse (with or without children), over all households with a woman responsible, by municipality (SIDRA 9882, full count); five classes; Spearman rank correlations with the share of women responsible, raw and partial.',
    indicadores: [
      ['Responsáveis mulheres que vivem com cônjuge', 'Women responsible who live with a spouse', +E.f_conjuge.toFixed(1), '%', `homens: ${np(E.m_conjuge, 1)}%`, `men: ${ne(E.m_conjuge, 1)}%`],
      ['Lares sem cônjuge com filhos que têm uma mulher à frente', 'Homes without a spouse but with children headed by a woman', +E.monoparental_mulher_share.toFixed(0), '%'],
      ['Correlação entre responsáveis mulheres e a parte delas com cônjuge', 'Correlation between women responsible and the share of them with a spouse', +tc.rho.toFixed(2), null, `parcial ${dp(tc.parcial)}`, `partial ${de(tc.parcial)}`],
    ],
    variaveisPt: [
      '`pct_mulher_com_conjuge` e `pct_homem_com_conjuge`: domicílios com cônjuge (com ou sem filhos) sobre os domicílios com responsável do mesmo sexo (SIDRA 9882, Censo 2022, universo). «Filhos» inclui enteados, de qualquer idade.',
      '`pct_mulher_sem_conjuge_filhos`: domicílios de responsável mulher sem cônjuge e com filhos ou enteados, sobre os de responsável mulher.',
      `No estado: com responsável mulher, ${np(E.f_conjuge, 1)}% com cônjuge (${np(E.f_conjuge_sem_filhos, 1)}% sem filhos), ${np(E.f_sem_conjuge_filhos, 1)}% sem cônjuge com filhos e ${np(E.f_outras, 1)}% em outras composições (quem mora só, com parentes ou não parentes); com responsável homem, ${np(E.m_conjuge, 1)}% com cônjuge e ${np(E.m_sem_conjuge_filhos, 1)}% sem cônjuge com filhos.`,
      `Classes: menos de 40%, 40 a 45%, 45 a 50%, 50 a 55% e 55% ou mais. No município mediano, ${np(R.pct_mulher_com_conjuge.med, 1)}% das responsáveis mulheres vivem com cônjuge (homens: ${np(R.pct_homem_com_conjuge.med, 1)}%).`,
      `${testePt(tc, 'Parte de responsáveis mulheres × parte delas com cônjuge')}; ${testePt(ts, '× parte sem cônjuge com filhos')}.`,
      metodoTestePt,
    ],
    variaveisEn: [
      '`pct_mulher_com_conjuge` and `pct_homem_com_conjuge`: homes with a spouse (with or without children) over homes with a responsible person of the same sex (SIDRA 9882, 2022 Census, full count). “Children” includes stepchildren, of any age.',
      '`pct_mulher_sem_conjuge_filhos`: homes with a woman responsible, no spouse and children or stepchildren, over homes with a woman responsible.',
      `Statewide: with a woman responsible, ${ne(E.f_conjuge, 1)}% with a spouse (${ne(E.f_conjuge_sem_filhos, 1)}% without children), ${ne(E.f_sem_conjuge_filhos, 1)}% without a spouse with children and ${ne(E.f_outras, 1)}% in other arrangements (living alone, with relatives or non-relatives); with a man responsible, ${ne(E.m_conjuge, 1)}% with a spouse and ${ne(E.m_sem_conjuge_filhos, 1)}% without a spouse with children.`,
      `Classes: under 40%, 40 to 45%, 45 to 50%, 50 to 55% and 55% or more. In the median municipality, ${ne(R.pct_mulher_com_conjuge.med, 1)}% of women responsible live with a spouse (men: ${ne(R.pct_homem_com_conjuge.med, 1)}%).`,
      `${testeEn(tc, 'Share of women responsible × share of them with a spouse')}; ${testeEn(ts, '× share without a spouse with children')}.`,
      metodoTesteEn,
    ],
    limitesPt: [
      'O Censo registra a composição no dia da entrevista: «sem cônjuge com filhos» inclui viúvas com filhos adultos, não só mães jovens criando filhos sozinhas.',
      'A alta de responsáveis mulheres com cônjuge sugere que parte do aumento desde 2010 vem de casais que passaram a apontar a mulher como responsável; o Censo não pergunta o motivo.',
      ecoPt,
    ],
    limitesEn: [
      'The Census records the household on the day of the interview: “without a spouse with children” includes widows with adult children, not only young mothers raising children alone.',
      'The rise of women responsible who have a spouse suggests that part of the increase since 2010 comes from couples who now name the woman as responsible; the Census does not ask why.',
      ecoEn,
    ],
  };
};

const servico = (k, nomes, chamadas, ord) => {
  const s = S[k], r = R[k], tt = tF(`${k}_total`), td = tF(`${k}_dif`);
  return { s, r, tt, td };
};

P.esgoto = () => {
  const k = 'esgoto_rede', s = S[k], r = R[k], tt = tF(`${k}_total`), ta = tA(`${k}_total`), td = tF(`${k}_dif`);
  const a = mun('Cunha'), b = mun('Cubatão');
  return {
    tags: ['saneamento', 'esgoto', 'genero', 'setores-censitarios'], cor: COR_DIF[4],
    h1: ['Esgoto na rede por sexo do responsável nos municípios de São Paulo', 'Mains sewerage by sex of the responsible person across São Paulo’s municipalities'],
    contextoPt: `No estado, ${np(s.mulher, 1)}% das casas com responsável mulher têm esgoto na rede, contra ${np(s.homem, 1)}% das com responsável homem: ${sp_(s.dif, 1)} pontos. Quase tudo (${sp_(s.comp, 2)}) é endereço: as casas delas ficam mais nos setores urbanos já ligados à rede. Comparadas às casas de homens do mesmo setor censitário, sobram ${sp_(s.setor, 2)} ponto. Elas têm mais esgoto em ${np(r.mulheres_mais)} dos 645 municípios; Cunha tem a maior diferença (${np(a.esgoto_rede_mulher, 0)}% contra ${np(a.esgoto_rede_homem, 0)}%), e em Cubatão elas têm menos (${sp_(b.esgoto_rede_dif, 1)}). Descontada a urbanização, a parte de responsáveis mulheres não se relaciona com a cobertura (parcial ${dp(tt.parcial)}). Quarta prancha da coleção «Mulheres responsáveis pelo domicílio».`,
    contextoEn: `Statewide, ${ne(s.mulher, 1)}% of homes with a woman responsible are on mains sewerage, against ${ne(s.homem, 1)}% of those with a man responsible: ${se(s.dif, 1)} points. Nearly all of it (${se(s.comp, 2)}) is address: women’s homes sit more in urban tracts already on the network. Compared with men’s homes in the same census tract, ${se(s.setor, 2)} point is left. Women’s homes have more sewerage in ${ne(r.mulheres_mais)} of the 645 municipalities; Cunha has the widest gap (${ne(a.esgoto_rede_mulher, 0)}% against ${ne(a.esgoto_rede_homem, 0)}%), and in Cubatão women’s homes have less (${se(b.esgoto_rede_dif, 1)}). Net of urbanisation, the share of women responsible is unrelated to coverage (partial ${de(tt.parcial)}). Fourth plate of the collection “Women heading households”.`,
    altPt: `Mapa coroplético dos 645 municípios de São Paulo pela diferença, em pontos percentuais, entre a parte das casas com responsável mulher e com responsável homem que têm esgoto na rede: ocre onde elas têm 1 ponto a menos ou mais, cinza entre −1 e +1, e quatro tons de lilás de +1 a +20 pontos ou mais. Quase todo o estado é lilás, mais escuro nos municípios com zona rural grande. Chamadas apontam Cunha, com ${sp_(a.esgoto_rede_dif, 0)} pontos, e Cubatão, com ${sp_(b.esgoto_rede_dif, 1)}. No painel, a decomposição da diferença do estado em endereço e dentro do setor.`,
    altEn: `Choropleth map of São Paulo’s 645 municipalities by the gap, in percentage points, between the share of homes with a woman and with a man responsible that are on mains sewerage: ochre where women’s homes have 1 point less or more, grey between −1 and +1, and four shades of lilac from +1 to +20 points or more. Almost the whole state is lilac, darker in municipalities with large rural areas. Callouts point to Cunha, at ${se(a.esgoto_rede_dif, 0)} points, and Cubatão, at ${se(b.esgoto_rede_dif, 1)}. In the panel, the state gap broken down into address and within the tract.`,
    chamadasPt: `Cunha, onde ${np(a.esgoto_rede_mulher, 0)}% das casas delas e ${np(a.esgoto_rede_homem, 0)}% das deles têm esgoto na rede (${sp_(a.esgoto_rede_dif, 0)} pontos, dos quais ${sp_(a.esgoto_rede_dif_setor, 1)} dentro do setor), e Cubatão, onde elas têm menos (${sp_(b.esgoto_rede_dif, 1)} pontos, entre ${np(b.esgoto_rede_dif_lo, 1)} e ${np(b.esgoto_rede_dif_hi, 1)} com o sigilo)`,
    chamadasEn: `Cunha, where ${ne(a.esgoto_rede_mulher, 0)}% of women’s homes and ${ne(a.esgoto_rede_homem, 0)}% of men’s are on mains sewerage (${se(a.esgoto_rede_dif, 0)} points, of which ${se(a.esgoto_rede_dif_setor, 1)} within the tract), and Cubatão, where women’s homes have less (${se(b.esgoto_rede_dif, 1)} points, between ${ne(b.esgoto_rede_dif_lo, 1)} and ${ne(b.esgoto_rede_dif_hi, 1)} given confidentiality)`,
    fontes: [F.setores, F.s9882, F.malha],
    metodoPt: 'Parte das casas com responsável mulher e com responsável homem com esgoto na rede, pela soma dos setores censitários do Censo 2022 (universo); diferença em pontos percentuais, decomposta em endereço e dentro do setor; seis classes; correlações de postos de Spearman, brutas e parciais.',
    metodoEn: 'Share of homes with a woman and with a man responsible on mains sewerage, from summed 2022 Census tracts (full count); gap in percentage points, broken down into address and within the tract; six classes; Spearman rank correlations, raw and partial.',
    indicadores: [
      ['Diferença no estado, mulheres − homens', 'Gap statewide, women − men', +s.dif.toFixed(2), 'pontos percentuais', `endereço ${sp_(s.comp, 2)}; dentro do setor ${sp_(s.setor, 2)}`, `address ${se(s.comp, 2)}; within the tract ${se(s.setor, 2)}`, 'percentage points'],
      ['Municípios em que as casas delas têm mais esgoto na rede', 'Municipalities where women’s homes have more mains sewerage', r.mulheres_mais, 'municípios', `menos em ${np(r.mulheres_menos)}, robusto ao sigilo`, `less in ${ne(r.mulheres_menos)}, robust to confidentiality`],
      ['Correlação parcial com a parte de responsáveis mulheres', 'Partial correlation with the share of women responsible', +tt.parcial.toFixed(2), null, `bruta ${dp(tt.rho)}`, `raw ${de(tt.rho)}`],
    ],
    variaveisPt: [
      varServPt(k, 'domicílios com esgoto na rede geral ou pluvial ou em fossa séptica ligada à rede'),
      `Classes da diferença: elas com 1 ponto a menos ou mais; −1 a +1; +1 a +5; +5 a +10; +10 a +20; +20 ou mais. Diferença mediana nos municípios: ${sp_(r.dif.med, 1)} pontos (endereço ${sp_(r.composicao.med, 1)}, dentro do setor ${sp_(r.setor.med, 1)}).`,
      `Sinal robusto ao sigilo: elas têm mais em ${np(r.mulheres_mais)} municípios e menos em ${np(r.mulheres_menos)} mesmo no pior caso; em ${np(r.menos_1pp)} (Cubatão, Guarujá e Taquarivaí) a falta passa de 1 ponto. A largura mediana do intervalo do sigilo é de ${np(r.amplitude_sigilo.med, 1)} ponto.`,
      decompPt,
      `${testePt(tt, 'Parte de responsáveis mulheres × esgoto na rede (total)')}; nas áreas de ponderação, ${dp(ta.rho)} (parcial ${dp(ta.parcial)}). ${testePt(td, 'Parte de responsáveis mulheres × diferença')}.`,
      metodoTestePt,
    ],
    variaveisEn: [
      varServEn(k, 'homes with sewage to the general or storm network or to a septic tank linked to it'),
      `Gap classes: women 1 point lower or more; −1 to +1; +1 to +5; +5 to +10; +10 to +20; +20 or more. Median municipal gap: ${se(r.dif.med, 1)} points (address ${se(r.composicao.med, 1)}, within the tract ${se(r.setor.med, 1)}).`,
      `Sign robust to confidentiality: women’s homes have more in ${ne(r.mulheres_mais)} municipalities and less in ${ne(r.mulheres_menos)} even in the worst case; in ${ne(r.menos_1pp)} (Cubatão, Guarujá and Taquarivaí) the shortfall exceeds 1 point. The median width of the confidentiality interval is ${ne(r.amplitude_sigilo.med, 1)} point.`,
      decompEn,
      `${testeEn(tt, 'Share of women responsible × mains sewerage (total)')}; across weighting areas, ${de(ta.rho)} (partial ${de(ta.parcial)}). ${testeEn(td, 'Share of women responsible × gap')}.`,
      metodoTesteEn,
    ],
    limitesPt: [sigiloPt, 'O mapa compara as casas delas e as deles dentro de cada município; não diz que uma mulher que vira responsável passa a ter esgoto. A diferença acompanha onde as casas estão: nas cidades com zona rural grande (Cunha, Vale do Ribeira), as casas de homens ficam mais no campo, fora da rede.', respPt, ecoPt],
    limitesEn: [sigiloEn, 'The map compares women’s and men’s homes within each municipality; it does not say that a woman who becomes responsible gets sewerage. The gap follows where homes are: in towns with large rural areas (Cunha, the Ribeira Valley), men’s homes are more often in the countryside, off the network.', respEn, ecoEn],
  };
};

P.agua = () => {
  const k = 'agua_rede', s = S[k], r = R[k], tt = tF(`${k}_total`), ta = tA(`${k}_total`), td = tF(`${k}_dif`);
  const a = mun('Cunha'), b = mun('Piedade'), c = mun('Guarujá');
  return {
    tags: ['saneamento', 'agua', 'genero', 'setores-censitarios'], cor: COR_DIF[4],
    h1: ['Água da rede geral por sexo do responsável nos municípios de São Paulo', 'Mains water by sex of the responsible person across São Paulo’s municipalities'],
    contextoPt: `No estado, ${np(s.mulher, 1)}% das casas com responsável mulher recebem água da rede geral, contra ${np(s.homem, 1)}% das com responsável homem: ${sp_(s.dif, 1)} pontos, dos quais ${sp_(s.comp, 2)} são endereço e ${sp_(s.setor, 2)} sobram dentro do mesmo setor censitário. Elas têm mais água da rede em ${np(r.mulheres_mais)} dos 645 municípios, de forma robusta ao sigilo. Em Cunha são ${np(a.agua_rede_mulher, 0)}% contra ${np(a.agua_rede_homem, 0)}%; em Piedade, ${np(b.agua_rede_mulher, 0)}% contra ${np(b.agua_rede_homem, 0)}%; no Guarujá, uma das exceções, elas têm um pouco menos. Descontada a urbanização, a parte de responsáveis mulheres quase não se relaciona com a cobertura (parcial ${dp(tt.parcial)}). Quinta prancha da coleção «Mulheres responsáveis pelo domicílio».`,
    contextoEn: `Statewide, ${ne(s.mulher, 1)}% of homes with a woman responsible get mains water, against ${ne(s.homem, 1)}% of those with a man responsible: ${se(s.dif, 1)} points, of which ${se(s.comp, 2)} is address and ${se(s.setor, 2)} is left within the same census tract. Women’s homes have more mains water in ${ne(r.mulheres_mais)} of the 645 municipalities, robust to confidentiality. In Cunha it is ${ne(a.agua_rede_mulher, 0)}% against ${ne(a.agua_rede_homem, 0)}%; in Piedade, ${ne(b.agua_rede_mulher, 0)}% against ${ne(b.agua_rede_homem, 0)}%; in Guarujá, one of the exceptions, women’s homes have slightly less. Net of urbanisation, the share of women responsible is barely related to coverage (partial ${de(tt.parcial)}). Fifth plate of the collection “Women heading households”.`,
    altPt: `Mapa coroplético dos 645 municípios de São Paulo pela diferença, em pontos percentuais, entre a parte das casas com responsável mulher e com responsável homem que recebem água da rede geral: cinza entre −1 e +1 e quatro tons de lilás de +1 a +20 pontos ou mais. Quase todo o estado é lilás, mais escuro nos municípios com zona rural grande. Chamadas apontam Cunha, com ${sp_(a.agua_rede_dif, 0)} pontos, Piedade, com ${sp_(b.agua_rede_dif, 0)}, e o Guarujá, com ${sp_(c.agua_rede_dif, 1)}. No painel, a decomposição da diferença do estado em endereço e dentro do setor.`,
    altEn: `Choropleth map of São Paulo’s 645 municipalities by the gap, in percentage points, between the share of homes with a woman and with a man responsible that get mains water: grey between −1 and +1 and four shades of lilac from +1 to +20 points or more. Almost the whole state is lilac, darker in municipalities with large rural areas. Callouts point to Cunha, at ${se(a.agua_rede_dif, 0)} points, Piedade, at ${se(b.agua_rede_dif, 0)}, and Guarujá, at ${se(c.agua_rede_dif, 1)}. In the panel, the state gap broken down into address and within the tract.`,
    chamadasPt: `Cunha (${sp_(a.agua_rede_dif, 0)} pontos, a maior diferença), Piedade (${sp_(b.agua_rede_dif, 0)}: ${np(b.agua_rede_mulher, 0)}% das casas delas e ${np(b.agua_rede_homem, 0)}% das deles) e o Guarujá (${sp_(c.agua_rede_dif, 1)}), um dos poucos em que elas têm menos`,
    chamadasEn: `Cunha (${se(a.agua_rede_dif, 0)} points, the widest gap), Piedade (${se(b.agua_rede_dif, 0)}: ${ne(b.agua_rede_mulher, 0)}% of women’s homes and ${ne(b.agua_rede_homem, 0)}% of men’s) and Guarujá (${se(c.agua_rede_dif, 1)}), one of the few where women’s homes have less`,
    fontes: [F.setores, F.s9882, F.malha],
    metodoPt: 'Parte das casas com responsável mulher e com responsável homem abastecidas pela rede geral, pela soma dos setores censitários do Censo 2022 (universo); diferença em pontos percentuais, decomposta em endereço e dentro do setor; seis classes; correlações de postos de Spearman, brutas e parciais.',
    metodoEn: 'Share of homes with a woman and with a man responsible supplied by the general network, from summed 2022 Census tracts (full count); gap in percentage points, broken down into address and within the tract; six classes; Spearman rank correlations, raw and partial.',
    indicadores: [
      ['Diferença no estado, mulheres − homens', 'Gap statewide, women − men', +s.dif.toFixed(2), 'pontos percentuais', `endereço ${sp_(s.comp, 2)}; dentro do setor ${sp_(s.setor, 2)}`, `address ${se(s.comp, 2)}; within the tract ${se(s.setor, 2)}`, 'percentage points'],
      ['Municípios em que as casas delas têm mais água da rede', 'Municipalities where women’s homes have more mains water', r.mulheres_mais, 'municípios', 'robusto ao sigilo', 'robust to confidentiality'],
      ['Correlação parcial com a parte de responsáveis mulheres', 'Partial correlation with the share of women responsible', +tt.parcial.toFixed(2), null, `bruta ${dp(tt.rho)}`, `raw ${de(tt.rho)}`],
    ],
    variaveisPt: [
      varServPt(k, 'domicílios abastecidos pela rede geral de distribuição'),
      `Classes da diferença: elas com 1 ponto a menos ou mais; −1 a +1; +1 a +5; +5 a +10; +10 a +20; +20 ou mais. Diferença mediana nos municípios: ${sp_(r.dif.med, 1)} pontos (endereço ${sp_(r.composicao.med, 1)}, dentro do setor ${sp_(r.setor.med, 1)}).`,
      `Sinal robusto ao sigilo: elas têm mais em ${np(r.mulheres_mais)} municípios e menos em ${np(r.mulheres_menos)} mesmo no pior caso; em nenhum a falta passa de 1 ponto. A largura mediana do intervalo do sigilo é de ${np(r.amplitude_sigilo.med, 1)} ponto.`,
      decompPt,
      `${testePt(tt, 'Parte de responsáveis mulheres × água da rede (total)')}; nas áreas de ponderação, ${dp(ta.rho)} (parcial ${dp(ta.parcial)}). ${testePt(td, 'Parte de responsáveis mulheres × diferença')}.`,
      metodoTestePt,
    ],
    variaveisEn: [
      varServEn(k, 'homes supplied by the general distribution network'),
      `Gap classes: women 1 point lower or more; −1 to +1; +1 to +5; +5 to +10; +10 to +20; +20 or more. Median municipal gap: ${se(r.dif.med, 1)} points (address ${se(r.composicao.med, 1)}, within the tract ${se(r.setor.med, 1)}).`,
      `Sign robust to confidentiality: women’s homes have more in ${ne(r.mulheres_mais)} municipalities and less in ${ne(r.mulheres_menos)} even in the worst case; in none does the shortfall exceed 1 point. The median width of the confidentiality interval is ${ne(r.amplitude_sigilo.med, 1)} point.`,
      decompEn,
      `${testeEn(tt, 'Share of women responsible × mains water (total)')}; across weighting areas, ${de(ta.rho)} (partial ${de(ta.parcial)}). ${testeEn(td, 'Share of women responsible × gap')}.`,
      metodoTesteEn,
    ],
    limitesPt: [sigiloPt, 'Fora da rede geral estão poço, nascente, carro-pipa e outras formas; no campo, poço não quer dizer falta de água. A diferença mede o acesso à rede, não a qualidade nem a regularidade do abastecimento.', respPt, ecoPt],
    limitesEn: [sigiloEn, 'Off the general network are wells, springs, water trucks and other sources; in the countryside, a well does not mean a lack of water. The gap measures access to the network, not the quality or regularity of supply.', respEn, ecoEn],
  };
};

P.iluminacao = () => {
  const a = mun('Sete Barras'), b = mun('Juquitiba'), t = tF('pct_iluminacao');
  const pctNao = (100 * E.ilum_nao) / E.ilum_tot;
  return {
    tags: ['iluminacao-publica', 'energia', 'entorno', 'genero'], cor: COR_LUZ[3],
    h1: ['Domicílios sem iluminação pública nos municípios de São Paulo', 'Households without street lighting across São Paulo’s municipalities'],
    contextoPt: `O Censo 2022 não perguntou pela energia elétrica; em 2010, ${np(E.energia2010, 2)}% dos domicílios paulistas tinham energia (${np(Math.round(E.sem_energia2010 / 1000))} mil sem). O substituto mais próximo é a iluminação pública da Pesquisa Urbanística do Entorno: ${np(pctNao, 1)}% das casas pesquisadas (${np(Math.round(E.ilum_nao / 1000))} mil) ficam em face de quadra sem luz na rua, e em ${np(C.cont.luz[4])} municípios são 10% ou mais (Sete Barras, ${np(a.pct_sem_iluminacao, 0)}%; Juquitiba, ${np(b.pct_sem_iluminacao, 0)}%). A pesquisa cobre os setores que o IBGE percorreu, quase todos urbanos, e não separa por sexo do responsável. A relação com a parte de responsáveis mulheres é fraca e não passa no teste (ρ ${dp(t.rho)}; parcial ${dp(t.parcial)}): o mapa fica como retrato descritivo. Sexta prancha da coleção «Mulheres responsáveis pelo domicílio».`,
    contextoEn: `The 2022 Census did not ask about electricity; in 2010, ${ne(E.energia2010, 2)}% of São Paulo’s households had it (${ne(Math.round(E.sem_energia2010 / 1000))} thousand without). The nearest substitute is street lighting from the Urban Surroundings Survey: ${ne(pctNao, 1)}% of surveyed homes (${ne(Math.round(E.ilum_nao / 1000))} thousand) sit on a block face with no street light, and in ${ne(C.cont.luz[4])} municipalities it is 10% or more (Sete Barras, ${ne(a.pct_sem_iluminacao, 0)}%; Juquitiba, ${ne(b.pct_sem_iluminacao, 0)}%). The survey covers the tracts IBGE walked, almost all urban, and does not split by sex of the responsible person. The relationship with the share of women responsible is weak and fails the test (ρ ${de(t.rho)}; partial ${de(t.parcial)}): the map stands as a descriptive portrait. Sixth plate of the collection “Women heading households”.`,
    altPt: `Mapa coroplético dos 645 municípios de São Paulo em cinco tons de ocre-amarronzado, do claro (menos de 1% dos domicílios pesquisados sem iluminação pública) ao escuro (10% ou mais). Os tons escuros se juntam no sul e no sudeste do estado, no Vale do Ribeira e na serra perto da metrópole; o oeste é quase todo claro. Chamadas apontam Sete Barras, com ${np(a.pct_sem_iluminacao, 0)}%, e Juquitiba, com ${np(b.pct_sem_iluminacao, 0)}%. No painel, os números de 2010 sobre energia elétrica, a legenda com o número de municípios por classe e a correlação, fraca, com a parte de responsáveis mulheres.`,
    altEn: `Choropleth map of São Paulo’s 645 municipalities in five shades of brownish ochre, from light (under 1% of surveyed homes without street lighting) to dark (10% or more). Dark shades cluster in the south and south-east of the state, the Ribeira Valley and the hills near the metropolis; the west is almost all light. Callouts point to Sete Barras, at ${ne(a.pct_sem_iluminacao, 0)}%, and Juquitiba, at ${ne(b.pct_sem_iluminacao, 0)}%. In the panel, the 2010 figures on electricity, the legend with the number of municipalities per class and the weak correlation with the share of women responsible.`,
    chamadasPt: `Sete Barras, com ${np(a.pct_sem_iluminacao, 0)}% das casas pesquisadas sem luz na rua (a maior parte entre os de 5 mil habitantes ou mais), e Juquitiba, com ${np(b.pct_sem_iluminacao, 0)}%, de chácaras e loteamentos da serra na metrópole`,
    chamadasEn: `Sete Barras, with ${ne(a.pct_sem_iluminacao, 0)}% of surveyed homes without street lighting (the highest share among towns of 5,000 or more), and Juquitiba, at ${ne(b.pct_sem_iluminacao, 0)}%, with smallholdings and hillside plots in the metropolis`,
    fontes: [F.s9583, F.s9882, F.s3217, F.malha],
    metodoPt: 'Domicílios em face de quadra sem iluminação pública sobre os domicílios dos setores da Pesquisa Urbanística do Entorno, por município (SIDRA 9583, Censo 2022); cinco classes; correlação de postos de Spearman com a parte de responsáveis mulheres, bruta e parcial. Energia elétrica de 2010 (SIDRA 3217) como referência.',
    metodoEn: 'Homes on a block face without street lighting over homes in the tracts of the Urban Surroundings Survey, by municipality (SIDRA 9583, 2022 Census); five classes; Spearman rank correlation with the share of women responsible, raw and partial. 2010 electricity (SIDRA 3217) as a reference.',
    indicadores: [
      ['Domicílios pesquisados sem iluminação pública', 'Surveyed homes without street lighting', +pctNao.toFixed(1), '%', `${np(Math.round(E.ilum_nao / 1000))} mil domicílios`, `${ne(Math.round(E.ilum_nao / 1000))} thousand homes`],
      ['Domicílios com energia elétrica em 2010', 'Homes with electricity in 2010', +E.energia2010.toFixed(2), '%', `${np(E.sem_energia2010)} sem`, `${ne(E.sem_energia2010)} without`],
      ['Correlação com a parte de responsáveis mulheres', 'Correlation with the share of women responsible', +t.rho.toFixed(2), null, `parcial ${dp(t.parcial)}; não significativa`, `partial ${de(t.parcial)}; not significant`],
    ],
    variaveisPt: [
      'Energia elétrica: o questionário de 2022 não tem a pergunta, e nem o dicionário dos setores nem o catálogo do SIDRA trazem a variável para 2022. Em 2010 (SIDRA 3217, universo), ' + np(E.energia2010, 2) + '% dos domicílios paulistas tinham energia e ' + np(E.sem_energia2010) + ' não tinham.',
      '`pct_iluminacao` e `pct_sem_iluminacao`: domicílios particulares permanentes ocupados em face de quadra com e sem iluminação pública, sobre o total dos domicílios dos setores pesquisados (SIDRA 9583, Pesquisa Urbanística do Entorno, Censo 2022). `cobertura_entorno` é a parte dos domicílios do município que está nesses setores.',
      `Classes: menos de 1%, 1 a 2%, 2 a 5%, 5 a 10% e 10% ou mais. ${np(C.cont.luzZero)} municípios não têm nenhuma casa pesquisada sem luz na rua. No município mediano, ${np(R.cobertura_entorno.med, 0)}% das casas estão na pesquisa (mínimo ${np(R.cobertura_entorno.min, 0)}%).`,
      `${testePt(t, 'Parte de responsáveis mulheres × parte com iluminação pública')}; q da parcial ${dp(t.q_parc_eff)}.`,
      metodoTestePt,
    ],
    variaveisEn: [
      'Electricity: the 2022 questionnaire does not include the question, and neither the tract dictionary nor the SIDRA catalogue carries the variable for 2022. In 2010 (SIDRA 3217, full count), ' + ne(E.energia2010, 2) + '% of São Paulo’s households had electricity and ' + ne(E.sem_energia2010) + ' did not.',
      '`pct_iluminacao` and `pct_sem_iluminacao`: occupied permanent private households on a block face with and without street lighting, over all households in the surveyed tracts (SIDRA 9583, Urban Surroundings Survey, 2022 Census). `cobertura_entorno` is the share of the municipality’s households in those tracts.',
      `Classes: under 1%, 1 to 2%, 2 to 5%, 5 to 10% and 10% or more. ${ne(C.cont.luzZero)} municipalities have no surveyed home without a street light. In the median municipality, ${ne(R.cobertura_entorno.med, 0)}% of homes are in the survey (minimum ${ne(R.cobertura_entorno.min, 0)}%).`,
      `${testeEn(t, 'Share of women responsible × share with street lighting')}; q of the partial ${de(t.q_parc_eff)}.`,
      metodoTesteEn,
    ],
    limitesPt: [
      'Iluminação pública não é energia elétrica: fala da rua, não da casa. É o substituto mais próximo publicado em 2022, mas outra coisa.',
      'A Pesquisa Urbanística do Entorno cobre os setores que o IBGE percorreu, quase todos urbanos; em municípios com zona rural grande, boa parte das casas fica de fora, e a taxa descreve só a parte urbana.',
      'A tabela não separa por sexo do responsável; a comparação com as responsáveis mulheres só pode ser entre municípios, e ela não aparece.',
      ecoPt,
    ],
    limitesEn: [
      'Street lighting is not electricity: it describes the street, not the home. It is the nearest substitute published for 2022, but a different thing.',
      'The Urban Surroundings Survey covers the tracts IBGE walked, almost all urban; in municipalities with large rural areas, many homes are left out, and the rate describes only the urban part.',
      'The table does not split by sex of the responsible person; the comparison with women responsible can only be between municipalities, and none shows up.',
      ecoEn,
    ],
  };
};

P.renda = () => {
  const B = C.biv, t = tF('razao_renda_sexo'), tr = tF('renda_resp_media'), ta = tA('renda_resp_media'), tm = tF('renda_mulheres');
  const a = mun('Lucélia'), b = mun('Pilar do Sul');
  const maxR = C.mun.reduce((m, x) => (x.razao_renda_sexo > (m?.razao_renda_sexo ?? -1) ? x : m), null);
  return {
    tags: ['renda', 'genero', 'bivariado'], cor: '#804d36', biv: true,
    h1: ['Responsáveis mulheres e a razão de renda entre mulheres e homens nos municípios de São Paulo', 'Women responsible and the women-to-men income ratio across São Paulo’s municipalities'],
    contextoPt: `Onde a renda média das mulheres de 14 anos ou mais chega mais perto da dos homens, há mais casas com responsável mulher: correlação de postos de ${dp(t.rho)} nos 645 municípios e ${dp(t.parcial)} descontadas urbanização e densidade, a relação mais firme da coleção. Em ${np(B.casas[2][2])} municípios os dois estão no terço de cima. Em Lucélia, as mulheres ganham ${np(a.razao_renda_sexo, 0)}% do que ganham os homens e ${np(a.pct_resp_mulher, 0)}% das casas têm responsável mulher; em Pilar do Sul, ${np(b.razao_renda_sexo, 0)}% e ${np(b.pct_resp_mulher, 0)}%. No município mediano, elas ganham ${np(R.razao_renda_sexo.med, 0)}%. A razão vem da amostra e compara todas as mulheres com todos os homens, não as responsáveis: o Censo 2022 não publica renda por sexo do responsável no município. Sétima prancha da coleção «Mulheres responsáveis pelo domicílio».`,
    contextoEn: `Where the mean income of women aged 14 or over comes closer to men’s, more homes have a woman responsible: a rank correlation of ${de(t.rho)} across the 645 municipalities and ${de(t.parcial)} net of urbanisation and density, the firmest relationship in the collection. In ${ne(B.casas[2][2])} municipalities both are in the top third. In Lucélia, women earn ${ne(a.razao_renda_sexo, 0)}% of what men earn and ${ne(a.pct_resp_mulher, 0)}% of homes have a woman responsible; in Pilar do Sul, ${ne(b.razao_renda_sexo, 0)}% and ${ne(b.pct_resp_mulher, 0)}%. In the median municipality, women earn ${ne(R.razao_renda_sexo.med, 0)}%. The ratio comes from the sample and compares all women with all men, not those responsible: the 2022 Census does not publish municipal income by sex of the responsible person. Seventh plate of the collection “Women heading households”.`,
    altPt: `Mapa bivariado dos municípios de São Paulo em nove cores, de uma grade de três por três: o lilás cresce no eixo da parte de domicílios com responsável mulher e o ocre, no da razão entre a renda média das mulheres e a dos homens; o marrom-escuro marca os ${np(B.casas[2][2])} municípios no terço de cima dos dois, frequentes no litoral, na metrópole e no oeste. Chamadas apontam Lucélia, com ${np(a.razao_renda_sexo, 0)}% e ${np(a.pct_resp_mulher, 0)}% de responsáveis mulheres, e Pilar do Sul, com ${np(b.razao_renda_sexo, 0)}% e ${np(b.pct_resp_mulher, 0)}%. No painel, a grade com o número de municípios em cada casa, os limites dos terços e a tabela das correlações.`,
    altEn: `Bivariate map of São Paulo’s municipalities in nine colours from a three-by-three grid: lilac grows along the axis of the share of households with a woman responsible and ochre along that of women’s mean income as a share of men’s; dark brown marks the ${ne(B.casas[2][2])} municipalities in the top third of both, frequent on the coast, in the metropolis and in the west. Callouts point to Lucélia, at ${ne(a.razao_renda_sexo, 0)}% and ${ne(a.pct_resp_mulher, 0)}% women responsible, and Pilar do Sul, at ${ne(b.razao_renda_sexo, 0)}% and ${ne(b.pct_resp_mulher, 0)}%. In the panel, the grid with the number of municipalities in each cell, the tercile limits and the table of correlations.`,
    chamadasPt: `Lucélia, onde as mulheres ganham ${np(a.razao_renda_sexo, 0)}% da renda dos homens e ${np(a.pct_resp_mulher, 0)}% das casas têm responsável mulher (terço de cima nos dois), e Pilar do Sul, com ${np(b.razao_renda_sexo, 0)}% e ${np(b.pct_resp_mulher, 0)}% (terço de baixo nos dois)`,
    chamadasEn: `Lucélia, where women earn ${ne(a.razao_renda_sexo, 0)}% of men’s income and ${ne(a.pct_resp_mulher, 0)}% of homes have a woman responsible (top third of both), and Pilar do Sul, at ${ne(b.razao_renda_sexo, 0)}% and ${ne(b.pct_resp_mulher, 0)}% (bottom third of both)`,
    fontes: [F.s10299, F.setores, F.malha],
    metodoPt: 'Parte de domicílios com responsável mulher (setores do Censo 2022, universo) e razão entre o rendimento médio das mulheres e o dos homens de 14 anos ou mais (SIDRA 10299, amostra), por município, cada uma dividida em terços; o cruzamento dá nove classes. Correlação de postos de Spearman, parcial, amostra efetiva corrigida pela autocorrelação espacial e LISA bivariado.',
    metodoEn: 'Share of households with a woman responsible (2022 Census tracts, full count) and the ratio of women’s to men’s mean income among people aged 14 or over (SIDRA 10299, sample), by municipality, each split into thirds; the cross gives nine classes. Spearman rank correlation, partial, effective sample corrected for spatial autocorrelation and bivariate LISA.',
    indicadores: [
      ['Correlação de postos entre responsáveis mulheres e razão de renda', 'Rank correlation between women responsible and the income ratio', +t.rho.toFixed(2), null, `parcial ${dp(t.parcial)}`, `partial ${de(t.parcial)}`],
      ['Municípios no terço de cima dos dois', 'Municipalities in the top third of both', B.casas[2][2], 'municípios'],
      ['Renda das mulheres sobre a dos homens, no município mediano', 'Women’s income as a share of men’s, in the median municipality', +R.razao_renda_sexo.med.toFixed(0), '%'],
    ],
    variaveisPt: [
      '`pct_resp_mulher`: domicílios com pessoa responsável mulher sobre o total (setores do Censo 2022, universo).',
      '`renda_mulheres`, `renda_homens` e `razao_renda_sexo`: rendimento nominal médio mensal das pessoas de 14 anos ou mais, mulheres e homens (SIDRA 10299, amostra), e a razão entre os dois, em %.',
      `Terços dos 645 municípios, fechados à direita: responsáveis mulheres até ${np(B.tx[0], 0)}%, ${np(B.tx[0], 0)}% a ${np(B.tx[1], 0)}% e mais de ${np(B.tx[1], 0)}%; razão de renda até ${np(B.ty[0], 0)}%, ${np(B.ty[0], 0)}% a ${np(B.ty[1], 0)}% e mais de ${np(B.ty[1], 0)}%. A classe \`b109\` junta os dois (11 a 33: dezena = terço de responsáveis mulheres, unidade = terço da razão de renda): ${np(B.casas[2][2])} municípios no terço de cima dos dois e ${np(B.casas[0][0])} no de baixo dos dois.`,
      `${testePt(t, 'Parte de responsáveis mulheres × razão de renda')}; controles só urbanização e densidade, porque a renda é a própria variável.`,
      `Moran bivariado ${dp(B.I)} (p = ${np(B.pI, 3)}) e LISA bivariado sobre os postos padronizados, 6 vizinhos, 999 permutações (semente 20261019), p < 0,05: ${np(B.lisa.AA)} municípios alto-alto e ${np(B.lisa.BB)} baixo-baixo (\`lisa109\`).`,
      `Pares de apoio: ${testePt(tr, 'responsáveis mulheres × renda média do responsável')}; nas áreas de ponderação, ${dp(ta.rho)} (parcial ${dp(ta.parcial)}); ${testePt(tm, 'responsáveis mulheres × renda das mulheres')}.`,
      metodoTestePt,
    ],
    variaveisEn: [
      '`pct_resp_mulher`: households with a woman as the responsible person over all households (2022 Census tracts, full count).',
      '`renda_mulheres`, `renda_homens` and `razao_renda_sexo`: mean monthly nominal income of people aged 14 or over, women and men (SIDRA 10299, sample), and the ratio between them, in %.',
      `Thirds of the 645 municipalities, closed on the right: women responsible up to ${ne(B.tx[0], 0)}%, ${ne(B.tx[0], 0)}% to ${ne(B.tx[1], 0)}% and over ${ne(B.tx[1], 0)}%; income ratio up to ${ne(B.ty[0], 0)}%, ${ne(B.ty[0], 0)}% to ${ne(B.ty[1], 0)}% and over ${ne(B.ty[1], 0)}%. The class \`b109\` combines both (11 to 33: tens = third of women responsible, units = third of the income ratio): ${ne(B.casas[2][2])} municipalities in the top third of both and ${ne(B.casas[0][0])} in the bottom third of both.`,
      `${testeEn(t, 'Share of women responsible × income ratio')}; controls are urbanisation and density only, since income is the variable itself.`,
      `Bivariate Moran ${de(B.I)} (p = ${ne(B.pI, 3)}) and bivariate LISA on standardised ranks, 6 neighbours, 999 permutations (seed 20261019), p < 0.05: ${ne(B.lisa.AA)} high-high municipalities and ${ne(B.lisa.BB)} low-low (\`lisa109\`).`,
      `Supporting pairs: ${testeEn(tr, 'women responsible × mean income of the responsible person')}; across weighting areas, ${de(ta.rho)} (partial ${de(ta.parcial)}); ${testeEn(tm, 'women responsible × women’s income')}.`,
      metodoTesteEn,
    ],
    limitesPt: [
      'O Censo 2022 não publica, por município, a renda por sexo do responsável. A razão compara todas as mulheres com todos os homens de 14 anos ou mais; diz como a renda se divide entre os sexos no lugar, não quanto ganham as responsáveis.',
      `A razão vem da amostra do Censo 2022: são estimativas expandidas pelo IBGE, com erro amostral que cresce quanto menor o município. Em município pequeno ela oscila muito (o máximo, ${np(maxR.razao_renda_sexo, 0)}% em ${maxR.NM_MUN}, é quase certamente ruído); por isso a prancha usa terços, e não classes finas.`,
      'O rendimento médio das tabelas da amostra pode mudar conforme a inclusão de quem não tem renda; a nota da tabela 10299 não pôde ser conferida, e a razão usa o mesmo critério para os dois sexos.',
      `Descontada a urbanização, onde há mais responsáveis mulheres a renda média dos responsáveis é um pouco menor (parcial ${dp(tr.parcial)}); a relação desta prancha é com a distância entre os sexos, não com o nível de renda.`,
      ecoPt,
      'Os terços são relativos aos municípios paulistas: o terço de baixo de São Paulo pode estar acima da média de outros estados.',
    ],
    limitesEn: [
      'The 2022 Census does not publish, by municipality, income by sex of the responsible person. The ratio compares all women with all men aged 14 or over; it says how income splits between the sexes in a place, not how much women responsible earn.',
      `The ratio comes from the 2022 Census sample: these are estimates expanded by IBGE, with sampling error that grows as the municipality shrinks. In a small town it swings widely (the maximum, ${ne(maxR.razao_renda_sexo, 0)}% in ${maxR.NM_MUN}, is almost certainly noise); hence the thirds rather than fine classes.`,
      'Mean income in the sample tables may change depending on whether people with no income are included; the note to table 10299 could not be checked, and the ratio uses the same rule for both sexes.',
      `Net of urbanisation, where more women are responsible the mean income of the responsible person is slightly lower (partial ${de(tr.parcial)}); this plate’s relationship is with the gap between the sexes, not with the level of income.`,
      ecoEn,
      'The thirds are relative to São Paulo’s municipalities: São Paulo’s bottom third may sit above the average of other states.',
    ],
  };
};

P.sintese = () => {
  const a = mun('Taquarivaí'), b = mun('Cunha'), n = new Array(LIM_DIF.length + 1).fill(0);
  for (const m of C.mun) if (m.dif_setor_media != null) n[classe(m.dif_setor_media, LIM_DIF)]++;
  return {
    tags: ['saneamento', 'agua', 'esgoto', 'coleta-de-lixo', 'genero', 'setores-censitarios'], cor: COR_DIF[2],
    h1: ['Diferença de serviços entre casas de mulheres e de homens responsáveis dentro do mesmo setor censitário, São Paulo', 'Service gap between homes with women and men responsible within the same census tract, São Paulo'],
    contextoPt: `Comparadas, dentro de cada setor censitário, às casas com responsável homem, as casas com responsável mulher têm quase a mesma cobertura: ${sp_(S.agua_rede.setor, 2)} ponto na água da rede, ${sp_(S.esgoto_rede.setor, 2)} no esgoto e ${sp_(S.lixo_coletado.setor, 2)} na coleta de lixo, no estado. Em ${np(n[1])} dos 645 municípios, a média das três fica entre −1 e +1 ponto. A vantagem das casas delas nas pranchas 106 e 107 vem do endereço: elas moram mais nos setores urbanos, onde a rede já chegou. Banheiro de uso exclusivo e água encanada dentro de casa quase não variam. Taquarivaí tem a maior diferença dentro do setor (${sp_(a.dif_setor_media, 1)}). O setor é a menor área publicada; dentro dele, o Censo não diz qual casa fica onde. Oitava e última prancha da coleção «Mulheres responsáveis pelo domicílio».`,
    contextoEn: `Compared, within each census tract, with homes with a man responsible, homes with a woman responsible have almost the same coverage: ${se(S.agua_rede.setor, 2)} point in mains water, ${se(S.esgoto_rede.setor, 2)} in sewerage and ${se(S.lixo_coletado.setor, 2)} in refuse collection, statewide. In ${ne(n[1])} of the 645 municipalities, the mean of the three lies between −1 and +1 point. The advantage of women’s homes on plates 106 and 107 comes from address: they live more in urban tracts, where the network has already arrived. An exclusive bathroom and piped water indoors barely vary. Taquarivaí has the widest within-tract gap (${se(a.dif_setor_media, 1)}). The tract is the smallest published area; within it, the Census does not say which home stands where. Eighth and last plate of the collection “Women heading households”.`,
    altPt: `Mapa coroplético dos 645 municípios de São Paulo pela diferença dentro do setor censitário entre as casas com responsável mulher e com responsável homem, média de água da rede, esgoto e lixo coletado. Quase todo o estado é cinza (entre −1 e +1 ponto, ${np(n[1])} municípios); ${np(n[2])} aparecem em lilás claro (+1 a +5) e ${np(n[0])} em ocre (elas com 1 ponto a menos ou mais). Chamadas apontam Taquarivaí, com ${sp_(a.dif_setor_media, 1)}, e Cunha, com ${sp_(b.dif_setor_media, 1)} dentro do setor e ${sp_(b.dif_media, 0)} no município inteiro. No painel, barras decompõem a diferença de cada serviço no estado em endereço e dentro do setor.`,
    altEn: `Choropleth map of São Paulo’s 645 municipalities by the within-tract gap between homes with a woman and with a man responsible, averaged over mains water, sewerage and refuse collection. Almost the whole state is grey (between −1 and +1 point, ${ne(n[1])} municipalities); ${ne(n[2])} appear in light lilac (+1 to +5) and ${ne(n[0])} in ochre (women 1 point lower or more). Callouts point to Taquarivaí, at ${se(a.dif_setor_media, 1)}, and Cunha, at ${se(b.dif_setor_media, 1)} within the tract and ${se(b.dif_media, 0)} for the whole town. In the panel, bars break each service’s state gap into address and within the tract.`,
    chamadasPt: `Taquarivaí, com a maior diferença dentro do setor (${sp_(a.dif_setor_media, 1)} pontos; ${sp_(a.dif_media, 1)} sem descontar o endereço), e Cunha, com ${sp_(b.dif_setor_media, 1)} na mesma rua e ${sp_(b.dif_media, 0)} no município inteiro, a maior diferença das pranchas 106 e 107`,
    chamadasEn: `Taquarivaí, with the widest within-tract gap (${se(a.dif_setor_media, 1)} points; ${se(a.dif_media, 1)} before netting out address), and Cunha, with ${se(b.dif_setor_media, 1)} on the same street and ${se(b.dif_media, 0)} for the whole town, the widest gap on plates 106 and 107`,
    fontes: [F.setores, F.s9882, F.malha],
    metodoPt: 'Diferença entre as casas com responsável mulher e com responsável homem do mesmo setor censitário, em pontos percentuais, média de água da rede, esgoto na rede e lixo coletado, por município (setores do Censo 2022, universo); seis classes; decomposição da diferença do estado em endereço e dentro do setor.',
    metodoEn: 'Gap between homes with a woman and with a man responsible in the same census tract, in percentage points, averaged over mains water, mains sewerage and refuse collection, by municipality (2022 Census tracts, full count); six classes; the state gap broken down into address and within the tract.',
    indicadores: [
      ['Municípios entre −1 e +1 ponto dentro do setor', 'Municipalities between −1 and +1 point within the tract', n[1], 'municípios', 'de 645', 'out of 645'],
      ['Água da rede, diferença dentro do setor no estado', 'Mains water, within-tract gap statewide', +S.agua_rede.setor.toFixed(2), 'pontos percentuais', `diferença total ${sp_(S.agua_rede.dif, 2)}`, `total gap ${se(S.agua_rede.dif, 2)}`, 'percentage points'],
      ['Esgoto na rede, diferença dentro do setor no estado', 'Mains sewerage, within-tract gap statewide', +S.esgoto_rede.setor.toFixed(2), 'pontos percentuais', `diferença total ${sp_(S.esgoto_rede.dif, 2)}`, `total gap ${se(S.esgoto_rede.dif, 2)}`, 'percentage points'],
    ],
    variaveisPt: [
      '`dif_setor_media`: média simples de `agua_rede_dif_setor`, `esgoto_rede_dif_setor` e `lixo_coletado_dif_setor`; `dif_media`, a mesma média das diferenças totais.',
      decompPt,
      'No estado, por serviço: ' + SERV.map(linhaServPt).join('; ') + '.',
      `Classes: elas com 1 ponto a menos ou mais (${np(n[0])} municípios); −1 a +1 (${np(n[1])}); +1 a +5 (${np(n[2])}); +5 a +10, +10 a +20 e +20 ou mais (nenhum).`,
      `Banheiro de uso exclusivo: \`banheiro_*\` (domicílios com banheiro de uso exclusivo); água encanada dentro de casa: \`agua_dentro_*\` (canalizada até dentro do domicílio). Lixo coletado: \`lixo_coletado_*\` (coletado no domicílio por serviço de limpeza ou depositado em caçamba). Todos com as mesmas colunas \`_homem\`, \`_mulher\`, \`_dif\`, \`_dif_lo\`, \`_dif_hi\`, \`_dif_composicao\` e \`_dif_setor\`.`,
    ],
    variaveisEn: [
      '`dif_setor_media`: simple mean of `agua_rede_dif_setor`, `esgoto_rede_dif_setor` and `lixo_coletado_dif_setor`; `dif_media`, the same mean of the total gaps.',
      decompEn,
      'Statewide, by service: ' + SERV.map(linhaServEn).join('; ') + '.',
      `Classes: women 1 point lower or more (${ne(n[0])} municipalities); −1 to +1 (${ne(n[1])}); +1 to +5 (${ne(n[2])}); +5 to +10, +10 to +20 and +20 or more (none).`,
      `Exclusive bathroom: \`banheiro_*\` (homes with a bathroom for their sole use); piped water indoors: \`agua_dentro_*\` (piped into the dwelling). Refuse collected: \`lixo_coletado_*\` (collected at the door by a cleaning service or left in a skip). All with the same columns \`_homem\`, \`_mulher\`, \`_dif\`, \`_dif_lo\`, \`_dif_hi\`, \`_dif_composicao\` and \`_dif_setor\`.`,
    ],
    limitesPt: [
      'Diferença dentro do setor perto de zero não prova que não haja desigualdade: o setor tem em média algumas centenas de casas, e a rua dentro dele pode separar. Ela mostra que, no menor recorte publicado, a casa de uma mulher e a de um homem quase não se distinguem nos serviços de rede.',
      sigiloPt, respPt, ecoPt,
    ],
    limitesEn: [
      'A within-tract gap near zero does not prove there is no inequality: a tract holds a few hundred homes on average, and streets within it may divide. It shows that, at the smallest published scale, a woman’s home and a man’s barely differ in network services.',
      sigiloEn, respEn, ecoEn,
    ],
  };
};

/* ------------------------------------------------------------------ montagem */
const y = (s) => `"${String(s).replace(/"/g, '\\"')}"`;
const quebra = (txt, w = 100) => { const out = []; let l = ''; for (const p of txt.split(' ')) { if ((l + ' ' + p).trim().length > w && l) { out.push(l); l = p; } else l = l ? `${l} ${p}` : p; } if (l) out.push(l); return out.join('\n'); };
const avisos = [];
const TIT = {
  distribuicao: ['Quase metade das casas', 'Nearly half the homes'],
  crescimento: ['Dez pontos em doze anos', 'Ten points in twelve years'],
  conjuge: ['Responsável não é mãe solo', 'Responsible is not lone mother'],
  esgoto: ['O esgoto e o endereço', 'Sewerage and the address'],
  agua: ['A água chega pelo endereço', 'Water arrives by address'],
  iluminacao: ['Luz na rua', 'Light in the street'],
  renda: ['Onde elas ganham mais perto deles', 'Where women earn closer to men'],
  sintese: ['Na mesma rua', 'On the same street'],
};
const SUB = {
  distribuicao: ['Em 2022, 49% dos domicílios paulistas tinham uma mulher como responsável', 'In 2022, 49% of São Paulo’s households named a woman as the person responsible'],
  crescimento: ['De 2010 a 2022, a parte de casas com responsável mulher subiu no campo e na cidade', 'From 2010 to 2022, the share of homes with a woman responsible rose in country and town alike'],
  conjuge: ['44% das mulheres responsáveis vivem com cônjuge, e são mais onde elas são mais', '44% of women responsible live with a spouse, and more so where there are more of them'],
  esgoto: ['As casas com responsável mulher têm mais esgoto na rede porque ficam mais na cidade', 'Homes with a woman responsible are more often on mains sewerage because they sit more in town'],
  agua: ['Em quase todo município, as casas delas têm mais água da rede; quase tudo é onde ficam', 'In almost every town, women’s homes have more mains water; nearly all of it is where they are'],
  iluminacao: ['O Censo 2022 não perguntou pela energia elétrica; a iluminação pública não segue o sexo do responsável', 'The 2022 Census did not ask about electricity; street lighting does not follow the sex of the responsible person'],
  renda: ['Onde a renda das mulheres chega mais perto da dos homens, há mais casas com responsável mulher', 'Where women’s income comes closer to men’s, more homes have a woman responsible'],
  sintese: ['Ao lado da casa de um homem responsável, a casa de uma mulher tem a mesma água, esgoto e coleta', 'Next door to a man’s home, a home with a woman responsible has the same water, sewerage and refuse collection'],
};
const COL_PT = 'Mulheres responsáveis pelo domicílio', COL_EN = 'Women heading households';
const introPt = `A coleção cruza a parte de domicílios com responsável mulher com os serviços da casa e da rua e com a renda, nos 645 municípios de São Paulo. Antes dos mapas vieram os testes: correlação de postos bruta e parcial (descontadas urbanização, densidade e renda), amostra efetiva corrigida pela autocorrelação espacial, valores q de Benjamini–Hochberg, I de Moran, LISA, e a comparação entre municípios e áreas de ponderação. A maior parte das relações com os serviços some quando se desconta a urbanização: responsáveis mulheres são mais comuns nas cidades, e as cidades têm mais rede. As relações fracas também viram mapa, como retrato descritivo, e o texto diz que são fracas.`;
const introEn = `The collection crosses the share of households with a woman responsible with home and street services and with income, across São Paulo’s 645 municipalities. The tests came before the maps: raw and partial rank correlation (net of urbanisation, density and income), effective sample corrected for spatial autocorrelation, Benjamini–Hochberg q values, Moran’s I, LISA, and a comparison between municipalities and weighting areas. Most relationships with services vanish once urbanisation is netted out: women responsible are more common in towns, and towns have more network. Weak relationships also become maps, as descriptive portraits, and the text says they are weak.`;

const gpkgArq = join(RAIZ, 'mapas', SERIE[0].pasta, 'dados', GPKG);
const tamGpkg = mb(gpkgArq);

SERIE.forEach((s, i) => {
  const d = P[s.tema]();
  const pasta = join(RAIZ, 'mapas', s.pasta);
  const n3 = String(s.numero).padStart(3, '0');
  const ant = SERIE[i - 1], seg = SERIE[i + 1];
  const ap = d.escala === 'apond';
  if (d.contextoPt.length > 900) avisos.push(`${n3} contexto PT ${d.contextoPt.length}`);
  if (d.contextoEn.length > 900) avisos.push(`${n3} contexto EN ${d.contextoEn.length}`);
  const svg = join(pasta, 'dados', `${s.base}_prancha.svg`);
  const csvMun = join(pasta, 'dados', CSV_MUN);

  // ---------- front matter PT
  const fm = [];
  fm.push('---', `numero: ${s.numero}`, `titulo: ${y(TIT[s.tema][0])}`, `subtitulo: ${y(SUB[s.tema][0])}`, `data: ${s.data}`, `categoria: ${s.categoria}`, 'colecao: mulheres-responsaveis-sp',
    `tags: [${['mulheres-responsaveis-sp', 'sao-paulo', 'censo-2022', ...d.tags, ap ? 'areas-de-ponderacao' : 'municipios'].filter((v, k, a) => a.indexOf(v) === k).join(', ')}]`, '',
    'contexto: >-', `  ${d.contextoPt}`, '', 'imagem: ./mapa_preview.png', `imagem_alt: ${y(d.altPt)}`, '', 'recorte: "Estado de São Paulo (SP)"', 'fontes:');
  for (const f of d.fontes) fm.push(`  - nome: ${y(f.nome)}`, `    nome_en: ${y(f.nome_en)}`, `    url: ${f.url}`, `    ano: ${f.ano}`);
  fm.push('crs: "SIRGAS 2000 (EPSG:4674)"', 'epsg: 4674', 'software: ["Node.js", "d3-geo", "QGIS"]', `metodo: ${y(d.metodoPt)}`, '', 'camadas:');
  const camMun = `  - { nome: municipios, tipo: poligono, cor: "${ap ? '#1a211a' : d.cor}", descricao: "645 municípios com as variáveis das oito pranchas, a classe bivariada b109 e os aglomerados LISA lisa103 e lisa109", descricao_en: "645 municipalities with the variables of all eight plates, the bivariate class b109 and the LISA clusters lisa103 and lisa109" }`;
  const camAp = `  - { nome: apond, tipo: poligono, cor: "${ap ? d.cor : '#1a211a'}", descricao: "${np(C.apond.n)} áreas de ponderação com a parte de responsáveis mulheres, urbanização, renda e as diferenças de água e esgoto", descricao_en: "${ne(C.apond.n)} weighting areas with the share of women responsible, urbanisation, income and the water and sewerage gaps" }`;
  if (ap) fm.push(camAp, camMun); else fm.push(camMun);
  fm.push('  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }');
  fm.push('  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }', '', 'indicadores:');
  for (const [rot, rotEn, valor, unid, nota, notaEn, unidEn] of d.indicadores) {
    fm.push('  - tipo: numero', `    rotulo: ${y(rot)}`, `    rotulo_en: ${y(rotEn)}`, `    valor: ${valor}`);
    if (unid) fm.push(`    unidade: ${y(unid)}`, `    unidade_en: ${y(unidEn ?? (unid === 'municípios' ? 'municipalities' : unid))}`);
    if (nota) fm.push(`    nota: ${y(nota)}`, `    nota_en: ${y(notaEn)}`);
  }
  fm.push('', 'downloads:',
    '  - formato: gpkg', `    url: ${REL}/${GPKG}`, '    rotulo: "Municípios e áreas de ponderação com as variáveis das oito pranchas, SIRGAS 2000, com estilos do QGIS"', '    rotulo_en: "Municipalities and weighting areas with the variables of all eight plates, SIRGAS 2000, with QGIS styles"', `    tamanho: "${tamGpkg}"`,
    '  - formato: csv', `    arquivo: dados/${CSV_MUN}`, '    rotulo: "Tabela dos municípios"', '    rotulo_en: "Municipal table"', `    tamanho: "${kb(csvMun)}"`);
  if (ap) fm.push('  - formato: csv', `    arquivo: dados/${CSV_AP}`, '    rotulo: "Tabela das áreas de ponderação"', '    rotulo_en: "Weighting area table"', `    tamanho: "${kb(join(pasta, 'dados', CSV_AP))}"`);
  fm.push('  - formato: svg', `    url: ${REL}/${s.base}_prancha.svg`, `    url_en: ${REL}/${s.base}_prancha.en.svg`, '    rotulo: "Prancha em vetor, para impressão"', '    rotulo_en: "Vector plate, for printing"', `    tamanho: "${mb(svg)}"`,
    '  - formato: png', '    arquivo: mapa_preview.png', '    arquivo_en: mapa_preview.en.png', '    rotulo: "Prancha (PNG 2400 px)"', '    rotulo_en: "Plate (PNG, 2400 px)"', `    tamanho: "${mb(join(pasta, 'mapa_preview.png'))}"`,
    '', 'versao: "1.0.0"', 'discussoes: []', '---', '', '');

  // ---------- corpo PT
  const b = [];
  b.push(`# ${d.h1[0]}`, '', '<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>', '');
  const vizPt = [ant && `a anterior é a [prancha ${String(ant.numero).padStart(3, '0')}](../${ant.pasta}/README.md)`, seg && `a seguinte, a [prancha ${String(seg.numero).padStart(3, '0')}](../${seg.pasta}/README.md)`].filter(Boolean).join('; ');
  b.push(`Prancha Nº ${n3}, a ${ORD_PT[i]} de oito da coleção **${COL_PT}**; ${vizPt}.`, '');
  b.push(quebra(introPt), '');
  b.push(quebra(`As chamadas do mapa apontam ${d.chamadasPt}.`), '');
  b.push('## O que vem nos arquivos', '', '| Camada (GPKG) | Geometria | Conteúdo |', '| --- | --- | --- |');
  b.push(`| \`municipios\` | polígono | 645 municípios com as variáveis das oito pranchas: parte de responsáveis mulheres em 2010 e 2022, composição das casas, água, esgoto, lixo, banheiro e água encanada por sexo do responsável, iluminação pública, renda por sexo, \`b109\`, \`lisa103\` e \`lisa109\` |`);
  b.push(`| \`apond\` | polígono | ${np(C.apond.n)} áreas de ponderação com a parte de responsáveis mulheres, urbanização, renda dos responsáveis e as diferenças de água e esgoto |`);
  b.push('| `regioes_intermediarias`, `limite_estadual` | polígono | referência |', '');
  b.push(quebra(`O **GPKG** é o mesmo nas oito pranchas e traz um estilo do QGIS para cada uma. O **CSV** tem a tabela dos municípios, sem geometria${ap ? '; o segundo CSV, a das áreas de ponderação' : ''}. Nas colunas, \`_lo\` e \`_hi\` são os limites do sigilo; os aglomerados LISA vêm como \`AA\` (alto-alto), \`BB\` (baixo-baixo), \`AB\`, \`BA\` e \`ns\` (não significativo).`), '');
  b.push('## Método', '');
  b.push(...d.variaveisPt.map((t, k) => quebra(`${k + 1}. ${t}`).replace(/\n/g, '\n   ')));
  b.push('', '## Limitações', '');
  b.push(...d.limitesPt.map((t) => quebra(`- ${t}`).replace(/\n/g, '\n  ')));
  writeFileSync(join(pasta, 'README.md'), fm.join('\n') + b.join('\n') + '\n');

  // ---------- EN
  const en = [];
  en.push('---', '# English version (EN-UK). Numbers, files and layers come from README.md.', `titulo: ${y(TIT[s.tema][1])}`, `subtitulo: ${y(SUB[s.tema][1])}`, '', 'contexto: >-', `  ${d.contextoEn}`, '',
    'imagem: ./mapa_preview.en.png', `imagem_alt: ${y(d.altEn)}`, '', 'recorte: "São Paulo State (SP)"', `metodo: ${y(d.metodoEn)}`, '---', '');
  en.push(`# ${d.h1[1]}`, '', '<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>', '');
  const vizEn = [ant && `the previous one is [plate ${String(ant.numero).padStart(3, '0')}](../${ant.pasta}/README.en.md)`, seg && `the next, [plate ${String(seg.numero).padStart(3, '0')}](../${seg.pasta}/README.en.md)`].filter(Boolean).join('; ');
  en.push(`Plate No. ${n3}, the ${ORD_EN[i]} of eight in the collection **${COL_EN}**; ${vizEn}.`, '');
  en.push(quebra(introEn), '');
  en.push(quebra(`The map’s callouts point to ${d.chamadasEn}.`), '');
  en.push('## What the files contain', '', '| Layer (GPKG) | Geometry | Content |', '| --- | --- | --- |');
  en.push('| `municipios` | polygon | 645 municipalities with the variables of all eight plates: share of women responsible in 2010 and 2022, household make-up, water, sewerage, refuse, bathroom and indoor piped water by sex of the responsible person, street lighting, income by sex, `b109`, `lisa103` and `lisa109` |');
  en.push(`| \`apond\` | polygon | ${ne(C.apond.n)} weighting areas with the share of women responsible, urbanisation, income of the responsible person and the water and sewerage gaps |`);
  en.push('| `regioes_intermediarias`, `limite_estadual` | polygon | reference |', '');
  en.push(quebra(`The **GPKG** is the same for all eight plates and carries a QGIS style for each. The **CSV** has the municipal table, without geometry${ap ? '; the second CSV, the weighting area table' : ''}. In the columns, \`_lo\` and \`_hi\` are the confidentiality limits; LISA clusters come as \`AA\` (high-high), \`BB\` (low-low), \`AB\`, \`BA\` and \`ns\` (not significant).`), '');
  en.push('## Method', '');
  en.push(...d.variaveisEn.map((t, k) => quebra(`${k + 1}. ${t}`).replace(/\n/g, '\n   ')));
  en.push('', '## Limitations', '');
  en.push(...d.limitesEn.map((t) => quebra(`- ${t}`).replace(/\n/g, '\n  ')));
  writeFileSync(join(pasta, 'README.en.md'), en.join('\n') + '\n');
  console.log(`✓ ${n3} contexto ${d.contextoPt.length}/${d.contextoEn.length}`);
});
if (avisos.length) console.log('AVISOS', avisos);
