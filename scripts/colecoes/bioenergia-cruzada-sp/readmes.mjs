// Gera README.md e README.en.md das pranchas 111–115 (coleção bioenergia-cruzada-sp) a partir do cache.
// Uso: node scripts/colecoes/bioenergia-cruzada-sp/readmes.mjs (depois de preparar.mjs dados gpkg e das pranchas).
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { RAIZ } from '../lib/dados.mjs';
import { SERIE, BIV, COR_DIESEL, COR_115, LIM_POP_115, LIM_KM_115, GPKG, CSV } from './preparar.mjs';

const C = JSON.parse(readFileSync(join(RAIZ, 'scripts/colecoes/cache/bioenergia-cruzada-sp.json'), 'utf8'));
const REL = 'https://github.com/aikiesan/essencial-geo/releases/download/bioenergia-cruzada-sp-2026';
const ZIP = `${GPKG}.zip`;

const fmt = (loc) => (v, d = 0) => (v == null ? '—' : Number(v).toLocaleString(loc, { minimumFractionDigits: d, maximumFractionDigits: d }).replace(/^-/, '−'));
const np = fmt('pt-BR'), ne = fmt('en-GB');
const dp = (v) => np(v, 2), de = (v) => ne(v, 2);
const pp = (v, d = 0) => `${np(v, d)} %`, pe = (v, d = 0) => `${ne(v, d)}%`;
const mun = (n) => C.mun.find((m) => m.NM_MUN === n);
const mb = (arq) => (statSync(arq).size / 1e6).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' MB';
const kb = (arq) => `${Math.round(statSync(arq).size / 1e4) * 10} kB`;
const pTxt = (p) => (p < 0.001 ? '< 0,001' : `= ${np(p, 3)}`), pTxtE = (p) => (p < 0.001 ? '< 0.001' : `= ${ne(p, 3)}`);
const qTxt = (q) => (q < 0.001 ? '< 0,001' : `= ${np(q, 3)}`), qTxtE = (q) => (q < 0.001 ? '< 0.001' : `= ${ne(q, 3)}`);
const lista = (xs, e) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ${e} ${xs.at(-1)}`);
const regs = (rs, n, e) => lista(rs.slice(0, n).map(([r, k]) => `${r} (${k})`), e);
const ORD_PT = ['primeira', 'segunda', 'terceira', 'quarta', 'quinta'];
const ORD_EN = ['first', 'second', 'third', 'fourth', 'fifth'];

/* ------------------------------------------------------------------ fontes */
const F = {
  semil: { nome: 'SEMIL/SP, Anuário de Energéticos por Município 2025 (ano-base 2024): vendas de etanol hidratado, gasolina C, óleo diesel e gás natural canalizado por município', nome_en: 'SEMIL/SP, Municipal Energy Yearbook 2025 (base year 2024): sales of hydrous ethanol, petrol C, diesel oil and piped natural gas by municipality', url: 'https://semil.sp.gov.br/anuario-de-energeticos-por-municipios-do-estado-de-sao-paulo/', ano: 2025 },
  cp2b: { nome: 'CP2B (Unicamp) — potencial de biogás e biometano por município, método v5.1, nível N4, cenário de referência', nome_en: 'CP2B (Unicamp) — biogas and biomethane potential by municipality, method v5.1, level N4, reference scenario', ano: 2026 },
  mapbiomas: { nome: 'MapBiomas — Coleção 10 de cobertura e uso da terra (2024)', nome_en: 'MapBiomas — Land cover and land use Collection 10 (2024)', url: 'https://brasil.mapbiomas.org/colecoes-mapbiomas/', ano: 2024 },
  pevs: { nome: 'IBGE — Produção da Extração Vegetal e da Silvicultura (PEVS) 2024, SIDRA tabela 291 (madeira em tora para papel e celulose)', nome_en: 'IBGE — Forestry and Plant Extraction Survey (PEVS) 2024, SIDRA table 291 (roundwood for paper and pulp)', url: 'https://sidra.ibge.gov.br/tabela/291', ano: 2024 },
  ppm: { nome: 'IBGE — Pesquisa da Pecuária Municipal (PPM) 2024, tabela 3939: efetivo dos rebanhos', nome_en: 'IBGE — Municipal Livestock Survey (PPM) 2024, table 3939: herd size', url: 'https://sidra.ibge.gov.br/tabela/3939', ano: 2024 },
  ca: { nome: 'IBGE — Censo Agropecuário 2017, SIDRA tabela 6847 (estabelecimentos por uso de adubação)', nome_en: 'IBGE — 2017 Agricultural Census, SIDRA table 6847 (holdings by use of fertiliser)', url: 'https://sidra.ibge.gov.br/tabela/6847', ano: 2017 },
  frota: { nome: 'SENATRAN — frota de veículos por município, dezembro de 2025 (IBGE Cidades)', nome_en: 'SENATRAN — vehicle fleet by municipality, December 2025 (IBGE Cidades)', url: 'https://cidades.ibge.gov.br/', ano: 2025 },
  munic: { nome: 'IBGE — Pesquisa de Informações Básicas Municipais (MUNIC) 2023, suplemento de saneamento: manejo de resíduos sólidos', nome_en: 'IBGE — Survey of Basic Municipal Information (MUNIC) 2023, sanitation supplement: solid waste management', ano: 2023 },
  epe: { nome: 'EPE — WebMap: gasodutos de transporte e de distribuição existentes, na versão da base de infraestrutura do MapBiomas', nome_en: 'EPE — WebMap: existing transmission and distribution gas pipelines, as published in the MapBiomas infrastructure database', url: 'https://gisepeprd2.epe.gov.br/WebMapEPE/', ano: 2022 },
  censo: { nome: 'IBGE — Censo Demográfico 2022 (população, urbanização e renda dos municípios)', nome_en: 'IBGE — 2022 Population Census (population, urbanisation and income by municipality)', url: 'https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html', ano: 2022 },
  malha: { nome: 'IBGE — Malha Municipal 2025', nome_en: 'IBGE — Municipal Mesh 2025', url: 'https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html', ano: 2025 },
};

/* ------------------------------------------------------------------ textos comuns */
const ecoPt = 'Leitura ecológica: o mapa compara municípios, não pessoas nem fazendas. Uma correlação entre municípios não diz que as mesmas propriedades ou os mesmos motoristas têm as duas características, nem que uma causa a outra.';
const ecoEn = 'Ecological reading: the map compares municipalities, not people or farms. A correlation between municipalities does not say that the same farms or drivers have both traits, nor that one causes the other.';
const vendaPt = 'Venda não é consumo: o Anuário da SEMIL conta o que postos e distribuidoras vendem no município, inclusive a quem só passa pela estrada ou abastece frotas de fora. Municípios com rodovia movimentada podem vender bem mais diesel do que gastam.';
const vendaEn = 'Sales are not consumption: the SEMIL Yearbook counts what filling stations and distributors sell in the municipality, including to people just driving through or to fleets based elsewhere. Towns on busy highways may sell far more diesel than they use.';
const modeloPt = 'O CP2B é um modelo: o potencial é a estimativa do que os resíduos renderiam no nível N4 (acessível, depois da coleta, dos usos concorrentes, da estocagem e do frete), não biometano produzido.';
const modeloEn = 'CP2B is a model: the potential estimates what residues would yield at level N4 (accessible, after collection, competing uses, storage and haulage), not biomethane actually produced.';
const ctrlPt = 'urbanização (parte de moradores em situação urbana), log da densidade demográfica e log da renda por habitante (Censo 2022)';
const ctrlEn = 'urbanisation (residents in urban areas), log of population density and log of income per head (2022 Census)';
const metodoTestePt = `Correlação parcial: correlação entre os resíduos dos postos de cada variável regredidos nos postos dos controles, que são ${ctrlPt}. Amostra efetiva sob autocorrelação espacial: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), com Iₓ e Iᵧ o I de Moran dos resíduos numa vizinhança dos 6 vizinhos mais próximos; valores q de Benjamini–Hochberg sobre todos os pares da triagem. LISA bivariado: valor do município contra a média dos 6 vizinhos na outra variável, 999 permutações, semente 20261019, p < 0,05.`;
const metodoTesteEn = `Partial correlation: the correlation between the residuals of each variable’s ranks regressed on the ranks of the controls, which are ${ctrlEn}. Effective sample under spatial autocorrelation: n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), where Iₓ and Iᵧ are the Moran’s I of the residuals over a 6-nearest-neighbour neighbourhood; Benjamini–Hochberg q values across all pairs in the screen. Bivariate LISA: the municipality’s value against the mean of its 6 neighbours on the other variable, 999 permutations, seed 20261019, p < 0.05.`;
const testePt = (t, txt) => `${txt}: correlação de postos de Spearman ${dp(t.rho)} (${np(t.n)} municípios), parcial ${dp(t.parcial)}, amostra efetiva ${np(t.n_eff)}, p ${pTxt(t.p_eff)}, q ${qTxt(t.q)}`;
const testeEn = (t, txt) => `${txt}: Spearman rank correlation ${de(t.rho)} (${ne(t.n)} municipalities), partial ${de(t.parcial)}, effective sample ${ne(t.n_eff)}, p ${pTxtE(t.p_eff)}, q ${qTxtE(t.q)}`;
const lisaPt = (e, k, x, y) => `\`${k}\`: aglomerados LISA bivariados (${x} no município × ${y} nos vizinhos): ${np(e.lisa.AA)} alto-alto, ${np(e.lisa.BB)} baixo-baixo, ${np(e.lisa.AB)} alto-baixo e ${np(e.lisa.BA)} baixo-alto; I de Moran bivariado ${dp(e.lisa.moran_biv)}.`;
const lisaEn = (e, k, x, y) => `\`${k}\`: bivariate LISA clusters (${x} in the municipality × ${y} in its neighbours): ${ne(e.lisa.AA)} high-high, ${ne(e.lisa.BB)} low-low, ${ne(e.lisa.AB)} high-low and ${ne(e.lisa.BA)} low-high; bivariate Moran’s I ${de(e.lisa.moran_biv)}.`;
const casasPt = (c) => `De baixo para cima e da esquerda para a direita, as nove casas têm ${c.map((l) => l.join(', ')).join('; ')} municípios`;
const casasEn = (c) => `From bottom to top and left to right, the nine cells hold ${c.map((l) => l.join(', ')).join('; ')} municipalities`;
const bivPt = (k, x, y) => `\`${k}\`: classe bivariada, dezena = terço de ${x} (1 a 3), unidade = terço de ${y} (1 a 3)`;
const bivEn = (k, x, y) => `\`${k}\`: bivariate class, tens = third of ${x} (1 to 3), units = third of ${y} (1 to 3)`;

/* ------------------------------------------------------------------ pranchas */
const P = {};

P.cana = () => {
  const e = C.e111, T = e.porTercoCana, a = mun('Ibaté'), b = mun('São Luiz do Paraitinga'), sp = mun('São Paulo');
  return {
    tags: ['cana', 'etanol', 'combustiveis', 'mapbiomas', 'correlacao'], cor: BIV[2][2],
    h1: ['Área com cana e parte do etanol no que os postos vendem, nos municípios de São Paulo', 'Area under cane and ethanol’s share of what filling stations sell, across São Paulo’s municipalities'],
    contextoPt: `Nos municípios paulistas com mais canavial, o etanol pesa mais no combustível vendido para os motores a gasolina e flex. Em energia, o etanol hidratado foi ${pp(e.estado)} das vendas do ciclo Otto no estado em 2024; no terço dos municípios com menos cana, ${pp(T[0].otto)}; no terço com mais, ${pp(T[2].otto)}. A correlação de postos é ${dp(e.rho)} e fica em ${dp(e.parcial)} descontadas urbanização, densidade e renda. Em Ibaté, com cana em ${pp(a.pct_area_cana)} da área, o etanol chega a ${pp(a.pct_etanol_otto)}; em São Luiz do Paraitinga, sem cana, fica em ${pp(b.pct_etanol_otto)}. Venda não é consumo, e preço, frota e distância da usina podem estar por trás. Primeira prancha da coleção «Bioenergia cruzada».`,
    contextoEn: `In São Paulo municipalities with more cane, ethanol weighs more in the fuel sold for petrol and flex-fuel engines. In energy, hydrous ethanol was ${pe(e.estado)} of Otto-cycle sales statewide in 2024; in the third of municipalities with least cane, ${pe(T[0].otto)}; in the third with most, ${pe(T[2].otto)}. The rank correlation is ${de(e.rho)} and stays at ${de(e.parcial)} net of urbanisation, density and income. In Ibaté, with cane on ${pe(a.pct_area_cana)} of its area, ethanol reaches ${pe(a.pct_etanol_otto)}; in São Luiz do Paraitinga, with no cane, it is ${pe(b.pct_etanol_otto)}. Sales are not consumption, and prices, the fleet and distance from mills may lie behind it. First plate of the collection “Bioenergy, crossed”.`,
    altPt: `Mapa bivariado dos ${np(e.n)} municípios de São Paulo em nove cores, cruzando terços da área com cana (do claro ao ocre) com terços da parte do etanol nas vendas do ciclo Otto (do claro ao lilás); onde os dois são altos, marrom-escuro. O marrom domina o centro e o noroeste canavieiros; o cinza-claro, de pouca cana e pouco etanol, a Grande São Paulo, o Vale do Paraíba e o Vale do Ribeira. Dois municípios sem venda de derivados no Anuário aparecem hachurados. Chamadas apontam Ibaté, com ${pp(a.pct_etanol_otto)} de etanol, São Luiz do Paraitinga, com ${pp(b.pct_etanol_otto)}, e São Paulo, com ${pp(sp.pct_etanol_otto)}. No painel, a grade 3 × 3 com o número de municípios em cada casa e a tabela das correlações.`,
    altEn: `Bivariate map of São Paulo’s ${ne(e.n)} municipalities in nine colours, crossing thirds of area under cane (light to ochre) with thirds of ethanol’s share of Otto-cycle sales (light to lilac); where both are high, dark brown. Brown dominates the cane belt in the centre and north-west; light grey, little cane and little ethanol, covers Greater São Paulo, the Paraíba Valley and the Ribeira Valley. Two municipalities with no fuel sales in the Yearbook are hatched. Callouts point to Ibaté, with ${pe(a.pct_etanol_otto)} ethanol, São Luiz do Paraitinga, with ${pe(b.pct_etanol_otto)}, and São Paulo, with ${pe(sp.pct_etanol_otto)}. In the panel, the 3 × 3 grid with the number of municipalities in each cell and the table of correlations.`,
    chamadasPt: `Ibaté, onde o etanol é ${pp(a.pct_etanol_otto)} da energia vendida no ciclo Otto (a maior parte entre os municípios de 10 mil habitantes ou mais) e a cana cobre ${pp(a.pct_area_cana)} da área; São Luiz do Paraitinga, sem cana e com ${pp(b.pct_etanol_otto)} (a menor); e São Paulo, com ${pp(sp.pct_etanol_otto)}, pouco abaixo do estado`,
    chamadasEn: `Ibaté, where ethanol is ${pe(a.pct_etanol_otto)} of the energy sold in the Otto cycle (the highest among municipalities of 10,000 or more) and cane covers ${pe(a.pct_area_cana)} of the area; São Luiz do Paraitinga, with no cane and ${pe(b.pct_etanol_otto)} (the lowest); and São Paulo, at ${pe(sp.pct_etanol_otto)}, just below the state`,
    fontes: [F.semil, F.mapbiomas, F.censo, F.malha],
    metodoPt: 'Parte da área do município com cana-de-açúcar (MapBiomas, coleção 10, 2024) e parte do etanol hidratado na energia vendida no ciclo Otto (etanol e gasolina C, SEMIL/SP, ano-base 2024), cada uma em terços dos municípios, cruzadas num mapa bivariado 3 × 3; correlações de postos de Spearman, brutas e parciais, e LISA bivariado.',
    metodoEn: 'Share of municipal area under sugar cane (MapBiomas, collection 10, 2024) and hydrous ethanol’s share of the energy sold in the Otto cycle (ethanol and petrol C, SEMIL/SP, base year 2024), each in thirds of municipalities, crossed in a 3 × 3 bivariate map; Spearman rank correlations, raw and partial, and bivariate LISA.',
    indicadores: [
      ['Correlação de postos entre cana e etanol', 'Rank correlation between cane and ethanol', +e.rho.toFixed(2), null, `parcial ${dp(e.parcial)}; ${np(e.n)} municípios`, `partial ${de(e.parcial)}; ${ne(e.n)} municipalities`],
      ['Etanol nas vendas do ciclo Otto, terço com mais cana', 'Ethanol in Otto-cycle sales, most-cane third', +T[2].otto.toFixed(1), '%', `${pp(T[0].otto)} no terço com menos cana; ${pp(e.estado)} no estado`, `${pe(T[0].otto)} in the least-cane third; ${pe(e.estado)} statewide`],
      ['Municípios no terço de cima dos dois', 'Municipalities in the top third of both', e.casas[2][2], 'municípios'],
    ],
    variaveisPt: [
      '`pct_area_cana`: área com cana-de-açúcar (MapBiomas, coleção 10, 2024) sobre a área do município, em %.',
      '`etanol_l` e `gasolina_l`: litros de etanol hidratado e de gasolina C vendidos no município em 2024 (SEMIL/SP, Anuário de Energéticos por Município 2025). `pct_etanol_otto` = etanol × 21,3 MJ/L ÷ (etanol × 21,3 + gasolina C × 32,2 MJ/L), em %; a gasolina C já traz etanol anidro misturado, que fica na parte da gasolina.',
      `Terços de cana: até ${pp(e.ter_x[0], 1)}, de ${pp(e.ter_x[0], 1)} a ${pp(e.ter_x[1], 1)} e mais de ${pp(e.ter_x[1], 1)}; de etanol: até ${pp(e.ter_y[0], 1)}, de ${pp(e.ter_y[0], 1)} a ${pp(e.ter_y[1], 1)} e mais de ${pp(e.ter_y[1], 1)}. ${bivPt('b111', 'cana', 'etanol')}. ${casasPt(e.casas)}. Anhumas e Redenção da Serra não têm venda de derivados no Anuário e ficam de fora (${np(e.n)} municípios).`,
      `${testePt(e, 'Cana × etanol no ciclo Otto')}. Sem a capital, ${dp(e.sem_capital)}; fora da região intermediária de São Paulo, parcial ${dp(e.sem_rgint_sp)}.`,
      lisaPt(e, 'lisa111', 'cana', 'etanol'),
      metodoTestePt,
    ],
    variaveisEn: [
      '`pct_area_cana`: area under sugar cane (MapBiomas, collection 10, 2024) over municipal area, in %.',
      '`etanol_l` and `gasolina_l`: litres of hydrous ethanol and petrol C sold in the municipality in 2024 (SEMIL/SP, Municipal Energy Yearbook 2025). `pct_etanol_otto` = ethanol × 21.3 MJ/L ÷ (ethanol × 21.3 + petrol C × 32.2 MJ/L), in %; petrol C already carries blended anhydrous ethanol, which stays in the petrol share.',
      `Thirds of cane: up to ${pe(e.ter_x[0], 1)}, ${pe(e.ter_x[0], 1)} to ${pe(e.ter_x[1], 1)} and over ${pe(e.ter_x[1], 1)}; of ethanol: up to ${pe(e.ter_y[0], 1)}, ${pe(e.ter_y[0], 1)} to ${pe(e.ter_y[1], 1)} and over ${pe(e.ter_y[1], 1)}. ${bivEn('b111', 'cane', 'ethanol')}. ${casasEn(e.casas)}. Anhumas and Redenção da Serra have no fuel sales in the Yearbook and are left out (${ne(e.n)} municipalities).`,
      `${testeEn(e, 'Cane × ethanol in the Otto cycle')}. Without the capital, ${de(e.sem_capital)}; outside the São Paulo intermediate region, partial ${de(e.sem_rgint_sp)}.`,
      lisaEn(e, 'lisa111', 'cane', 'ethanol'),
      metodoTesteEn,
    ],
    limitesPt: [vendaPt, 'O preço relativo na bomba, a frota flex e a distância da usina mais próxima podem estar por trás da relação; o mapa não separa esses efeitos. A parte do etanol é medida em energia, não em litros: em litros, ela seria maior.', ecoPt],
    limitesEn: [vendaEn, 'Relative pump prices, the flex-fuel fleet and distance to the nearest mill may lie behind the link; the map does not separate these effects. Ethanol’s share is measured in energy, not litres: in litres it would be larger.', ecoEn],
  };
};

P.diesel = () => {
  const e = C.e112, a = mun('Sertãozinho'), b = mun('São Paulo'), c = mun('Presidente Prudente');
  const r = Object.fromEntries(e.regioes.map((x) => [x.nome, x]));
  const rotPt = ['menos de 0,1', '0,1 a 0,25', '0,25 a 0,5', '0,5 a 1', '1 a 2', '2 ou mais'];
  const rotEn = ['under 0.1', '0.1 to 0.25', '0.25 to 0.5', '0.5 to 1', '1 to 2', '2 or more'];
  return {
    tags: ['biometano', 'diesel', 'cp2b', 'combustiveis', 'potencial'], cor: COR_DIESEL[5],
    h1: ['Potencial de biometano sobre o diesel vendido, em energia, nos municípios de São Paulo', 'Biomethane potential over diesel sold, in energy, across São Paulo’s municipalities'],
    contextoPt: `Se todo o potencial acessível de biometano de São Paulo virasse combustível, ${np(e.bm_bi_m3_ano, 2)} bilhões de m³ por ano, ele cobriria em energia ${pp(100 * e.estado)} dos ${np(e.diesel_bi_l, 1)} bilhões de litros de diesel vendidos no estado em 2024; fora da região intermediária de São Paulo, ${pp(100 * e.fora_rgint_sp)}. Em ${np(e.ge1)} dos ${np(e.n)} municípios o potencial passa do diesel vendido, e no município mediano chega a ${pp(100 * e.mediana)}. Sertãozinho cobriria o próprio diesel e sobraria um terço; a região de Presidente Prudente inteira chega a ${pp(100 * r['Presidente Prudente'].cobre)}; a capital, a ${pp(100 * b.cobertura_diesel)}. É conta de energia, não plano: o CP2B é modelo, e venda de diesel não é consumo. Segunda prancha da coleção «Bioenergia cruzada».`,
    contextoEn: `If all of São Paulo’s accessible biomethane potential became fuel, ${ne(e.bm_bi_m3_ano, 2)} billion m³ a year, it would cover in energy ${pe(100 * e.estado)} of the ${ne(e.diesel_bi_l, 1)} billion litres of diesel sold in the state in 2024; outside the São Paulo intermediate region, ${pe(100 * e.fora_rgint_sp)}. In ${ne(e.ge1)} of the ${ne(e.n)} municipalities the potential exceeds the diesel sold, and in the median municipality it reaches ${pe(100 * e.mediana)}. Sertãozinho would cover its own diesel with a third to spare; the whole Presidente Prudente region reaches ${pe(100 * r['Presidente Prudente'].cobre)}; the capital, ${pe(100 * b.cobertura_diesel)}. It is an energy sum, not a plan: CP2B is a model, and diesel sales are not consumption. Second plate of the collection “Bioenergy, crossed”.`,
    altPt: `Mapa coroplético dos 645 municípios de São Paulo em seis classes da razão entre o potencial de biometano e o diesel vendido, em energia: três tons de ocre para menos de 0,5, bege de 0,5 a 1 e dois tons de verde para 1 ou mais. O verde cobre a maior parte do interior; o ocre, a Grande São Paulo, o Vale do Paraíba, o litoral e as cidades de rodovia; dois municípios sem venda de diesel no Anuário estão hachurados. Chamadas apontam Sertãozinho, com ${np(a.cobertura_diesel, 2)}, Presidente Prudente, com ${np(c.cobertura_diesel, 2)}, e São Paulo, com ${np(b.cobertura_diesel, 2)}. No painel, a legenda com o número de municípios por classe e barras com a razão de cada região intermediária.`,
    altEn: `Choropleth map of São Paulo’s 645 municipalities in six classes of the ratio between biomethane potential and diesel sold, in energy: three shades of ochre below 0.5, beige from 0.5 to 1 and two shades of green for 1 or more. Green covers most of the interior; ochre, Greater São Paulo, the Paraíba Valley, the coast and highway towns; two municipalities with no diesel sales in the Yearbook are hatched. Callouts point to Sertãozinho, at ${ne(a.cobertura_diesel, 2)}, Presidente Prudente, at ${ne(c.cobertura_diesel, 2)}, and São Paulo, at ${ne(b.cobertura_diesel, 2)}. In the panel, the legend with the number of municipalities per class and bars with each intermediate region’s ratio.`,
    chamadasPt: `Sertãozinho, onde o potencial cobriria ${pp(100 * a.cobertura_diesel)} do diesel vendido; Presidente Prudente, cidade de muito diesel vendido (razão ${np(c.cobertura_diesel, 2)}) numa região intermediária que chega a ${pp(100 * r['Presidente Prudente'].cobre)}; e São Paulo, com ${pp(100 * b.cobertura_diesel)}`,
    chamadasEn: `Sertãozinho, where the potential would cover ${pe(100 * a.cobertura_diesel)} of the diesel sold; Presidente Prudente, a city selling a lot of diesel (ratio ${ne(c.cobertura_diesel, 2)}) in an intermediate region that reaches ${pe(100 * r['Presidente Prudente'].cobre)}; and São Paulo, at ${pe(100 * b.cobertura_diesel)}`,
    fontes: [F.cp2b, F.semil, F.frota, F.malha],
    metodoPt: 'Potencial de biometano do CP2B (v5.1, nível N4, cenário de referência) em m³ por ano, convertido em litros de diesel equivalentes em energia (1 m³ ≈ 0,98 L), sobre o óleo diesel vendido no município (SEMIL/SP, ano-base 2024); seis classes da razão; somas por região intermediária.',
    metodoEn: 'CP2B biomethane potential (v5.1, level N4, reference scenario) in m³ a year, converted into energy-equivalent litres of diesel (1 m³ ≈ 0.98 L), over the diesel oil sold in the municipality (SEMIL/SP, base year 2024); six classes of the ratio; sums by intermediate region.',
    indicadores: [
      ['Diesel do estado que o biometano cobriria, em energia', 'State diesel that biomethane could cover, in energy', +(100 * e.estado).toFixed(1), '%', `${pp(100 * e.fora_rgint_sp)} fora da região de São Paulo`, `${pe(100 * e.fora_rgint_sp)} outside the São Paulo region`],
      ['Municípios em que o potencial passa do diesel vendido', 'Municipalities where potential exceeds diesel sold', e.ge1, 'municípios', `de ${np(e.n)}`, `out of ${ne(e.n)}`],
      ['Razão no município mediano', 'Ratio in the median municipality', +e.mediana.toFixed(2), null],
    ],
    variaveisPt: [
      '`biometano_m3d`: potencial de biometano do CP2B, v5.1, nível N4 (acessível), cenário de referência, em m³ por dia (o mesmo das pranchas 055 a 059).',
      '`diesel_l`: litros de óleo diesel vendidos no município em 2024 (SEMIL/SP, Anuário de Energéticos por Município 2025).',
      `\`cobertura_diesel\` = biometano_m3d × 365 × 0,98 ÷ diesel_l. O fator 0,98 L de diesel por m³ de biometano iguala a energia dos dois (poder calorífico inferior). Classes: ${rotPt.map((t, i) => `${t} (${np(e.cont[i])})`).join('; ')}; ${np(e.sem)} sem venda de diesel (Anhumas e Redenção da Serra).`,
      `Por região intermediária: ${e.regioes.map((x) => `${x.nome} ${pp(100 * x.cobre)}`).join('; ')}.`,
      `\`caminhoes\` e \`onibus\`: caminhões e caminhões-trator, ônibus e micro-ônibus registrados no município (SENATRAN, dezembro de 2025); o estado tem ${np(e.caminhoes)} caminhões. ${testePt(e.bm_caminhoes, 'Biometano (log) × caminhões por mil habitantes')}; ${testePt(e.bm_diesel, 'biometano × diesel por habitante')}; ${testePt(e.usinas_diesel, 'empregos em usinas × diesel por habitante')}.`,
      metodoTestePt,
    ],
    variaveisEn: [
      '`biometano_m3d`: CP2B biomethane potential, v5.1, level N4 (accessible), reference scenario, in m³ a day (the same as plates 055 to 059).',
      '`diesel_l`: litres of diesel oil sold in the municipality in 2024 (SEMIL/SP, Municipal Energy Yearbook 2025).',
      `\`cobertura_diesel\` = biometano_m3d × 365 × 0.98 ÷ diesel_l. The factor of 0.98 L of diesel per m³ of biomethane equates their energy (lower heating value). Classes: ${rotEn.map((t, i) => `${t} (${ne(e.cont[i])})`).join('; ')}; ${ne(e.sem)} with no diesel sales (Anhumas and Redenção da Serra).`,
      `By intermediate region: ${e.regioes.map((x) => `${x.nome} ${pe(100 * x.cobre)}`).join('; ')}.`,
      `\`caminhoes\` and \`onibus\`: lorries and tractor units, buses and minibuses registered in the municipality (SENATRAN, December 2025); the state has ${ne(e.caminhoes)} lorries. ${testeEn(e.bm_caminhoes, 'Biomethane (log) × lorries per thousand people')}; ${testeEn(e.bm_diesel, 'biomethane × diesel per head')}; ${testeEn(e.usinas_diesel, 'jobs at mills × diesel per head')}.`,
      metodoTesteEn,
    ],
    limitesPt: [modeloPt, vendaPt, `A razão compara energia; não diz que o biometano chegaria aos ${np(e.caminhoes)} caminhões do estado, que exigem motor ou kit a gás, posto de abastecimento e logística. O biometano também disputa usos: injeção na rede, indústria e geração de eletricidade.`, ecoPt],
    limitesEn: [modeloEn, vendaEn, `The ratio compares energy; it does not say biomethane would reach the state’s ${ne(e.caminhoes)} lorries, which need gas engines or conversion kits, filling stations and logistics. Biomethane also has competing uses: grid injection, industry and power generation.`, ecoEn],
  };
};

P.eucalipto = () => {
  const e = C.e113, a = mun('Capão Bonito'), b = mun('Agudos');
  return {
    tags: ['silvicultura', 'eucalipto', 'celulose', 'vegetacao-nativa', 'mapbiomas', 'correlacao'], cor: BIV[2][2],
    h1: ['Vegetação nativa e madeira para papel e celulose nos municípios de São Paulo', 'Native vegetation and wood for paper and pulp across São Paulo’s municipalities'],
    contextoPt: `Nos municípios paulistas que tiram madeira de silvicultura para papel e celulose, quanto mais vegetação nativa resta, mais madeira sai por km². Nos ${np(e.n)} municípios da PEVS 2024, a correlação de postos é ${dp(e.rho)}, e ${dp(e.parcial)} descontadas urbanização, densidade e renda. O produtor mediano tem ${pp(e.nativa_prod, 1)} da área em mata nativa; os municípios da pesquisa que não produzem, ${pp(e.nativa_nao, 1)}. Os ${np(e.n_prod)} produtores tiraram ${np(e.madeira_mi_m3, 1)} milhões de m³, sobretudo no sudoeste, em Sorocaba, e no centro-oeste, em Bauru. Capão Bonito soma ${pp(a.pct_area_nativa)} de mata e ${np(a.madeira_papel_m3 / 1e6, 2)} milhão de m³. Relevo e solo que afastam a cana podem estar por trás das duas coisas. Terceira prancha da coleção «Bioenergia cruzada».`,
    contextoEn: `In São Paulo municipalities that harvest plantation wood for paper and pulp, the more native vegetation remains, the more wood comes out per km². Across the ${ne(e.n)} municipalities in PEVS 2024, the rank correlation is ${de(e.rho)}, and ${de(e.parcial)} net of urbanisation, density and income. The median producer has ${pe(e.nativa_prod, 1)} of its area under native vegetation; surveyed municipalities that do not produce, ${pe(e.nativa_nao, 1)}. The ${ne(e.n_prod)} producers harvested ${ne(e.madeira_mi_m3, 1)} million m³, mostly in the south-west, around Sorocaba, and the centre-west, around Bauru. Capão Bonito combines ${pe(a.pct_area_nativa)} native cover with ${ne(a.madeira_papel_m3 / 1e6, 2)} million m³. Relief and soils that keep cane away may lie behind both. Third plate of the collection “Bioenergy, crossed”.`,
    altPt: `Mapa bivariado de São Paulo em nove cores, cruzando terços da vegetação nativa (do claro ao ocre) com três degraus de madeira para papel e celulose por km² (nenhuma, abaixo e acima da mediana dos produtores, do claro ao lilás); onde os dois são altos, marrom-escuro. Os ${np(e.sem)} municípios fora da PEVS 2024 aparecem hachurados, sem dado. O marrom se junta no sudoeste, em volta de Capão Bonito, no centro-oeste, perto de Agudos, e no Vale do Paraíba. Chamadas apontam Capão Bonito, com ${pp(a.pct_area_nativa)} de mata e ${np(a.madeira_papel_m3 / 1e6, 2)} milhão de m³, e Agudos, com ${pp(b.pct_area_nativa)} e ${np(Math.round(b.madeira_papel_m3 / 1e3))} mil m³. No painel, a grade 3 × 3 e a tabela das correlações.`,
    altEn: `Bivariate map of São Paulo in nine colours, crossing thirds of native vegetation (light to ochre) with three steps of pulpwood per km² (none, below and above the producers’ median, light to lilac); where both are high, dark brown. The ${ne(e.sem)} municipalities outside PEVS 2024 are hatched, with no data. Brown gathers in the south-west, around Capão Bonito, in the centre-west, near Agudos, and in the Paraíba Valley. Callouts point to Capão Bonito, with ${pe(a.pct_area_nativa)} native cover and ${ne(a.madeira_papel_m3 / 1e6, 2)} million m³, and Agudos, with ${pe(b.pct_area_nativa)} and ${ne(Math.round(b.madeira_papel_m3 / 1e3))} thousand m³. In the panel, the 3 × 3 grid and the table of correlations.`,
    chamadasPt: `Capão Bonito, com ${pp(a.pct_area_nativa)} da área em vegetação nativa e ${np(a.madeira_papel_m3 / 1e6, 2)} milhão de m³ de madeira para celulose em 2024 (terço de cima nos dois), e Agudos, no centro-oeste, com ${pp(b.pct_area_nativa)} e ${np(Math.round(b.madeira_papel_m3 / 1e3))} mil m³`,
    chamadasEn: `Capão Bonito, with ${pe(a.pct_area_nativa)} of its area under native vegetation and ${ne(a.madeira_papel_m3 / 1e6, 2)} million m³ of pulpwood in 2024 (top third of both), and Agudos, in the centre-west, with ${pe(b.pct_area_nativa)} and ${ne(Math.round(b.madeira_papel_m3 / 1e3))} thousand m³`,
    fontes: [F.pevs, F.mapbiomas, F.censo, F.malha],
    metodoPt: 'Parte da área do município com vegetação nativa (MapBiomas, coleção 10, 2024), em terços, cruzada com a madeira em tora de silvicultura para papel e celulose por km² (IBGE, PEVS 2024): nenhuma, abaixo e acima da mediana dos produtores; mapa bivariado 3 × 3 só nos municípios da PEVS; correlações de postos de Spearman, brutas e parciais, e LISA bivariado.',
    metodoEn: 'Share of municipal area under native vegetation (MapBiomas, collection 10, 2024), in thirds, crossed with plantation roundwood for paper and pulp per km² (IBGE, PEVS 2024): none, below and above the producers’ median; 3 × 3 bivariate map only in PEVS municipalities; Spearman rank correlations, raw and partial, and bivariate LISA.',
    indicadores: [
      ['Correlação de postos entre mata nativa e madeira para celulose', 'Rank correlation between native cover and pulpwood', +e.rho.toFixed(2), null, `parcial ${dp(e.parcial)}; ${np(e.n)} municípios da PEVS`, `partial ${de(e.parcial)}; ${ne(e.n)} PEVS municipalities`],
      ['Vegetação nativa no produtor mediano', 'Native cover in the median producer', +e.nativa_prod.toFixed(1), '%', `${pp(e.nativa_nao, 1)} nos que não produzem`, `${pe(e.nativa_nao, 1)} in non-producers`],
      ['Madeira para papel e celulose em 2024', 'Pulpwood in 2024', +e.madeira_mi_m3.toFixed(1), 'milhões de m³', `${np(e.n_prod)} municípios produtores`, `${ne(e.n_prod)} producing municipalities`, 'million m³'],
    ],
    variaveisPt: [
      '`pct_area_nativa`: vegetação nativa, as formações naturais do MapBiomas (coleção 10, 2024), sobre a área do município, em %.',
      '`madeira_papel_m3` e `madeira_papel_m3_km2`: madeira em tora de silvicultura para papel e celulose em 2024, em m³ e por km² da área do município (IBGE, PEVS, SIDRA 291).',
      `Terços de mata: até ${pp(e.ter_x[0], 1)}, de ${pp(e.ter_x[0], 1)} a ${pp(e.ter_x[1], 1)} e mais de ${pp(e.ter_x[1], 1)}. Madeira: nenhuma; até ${np(e.med_prod, 1)} m³/km² (mediana dos ${np(e.n_prod)} produtores); mais que isso. ${bivPt('b113', 'mata', 'madeira')}. ${casasPt(e.casas)}.`,
      `A PEVS publica ${np(e.n)} municípios paulistas para essa variável; os outros ${np(e.sem)} ficam sem dado, não zero, e o mapa os hachura. ${testePt(e, 'Mata nativa × madeira para celulose por km² (log)')}.`,
      `${lisaPt(e, 'lisa113', 'mata', 'madeira')} Alto-alto por região intermediária: ${regs(e.regioesAA, 4, 'e')}.`,
      metodoTestePt,
    ],
    variaveisEn: [
      '`pct_area_nativa`: native vegetation, MapBiomas natural formations (collection 10, 2024), over municipal area, in %.',
      '`madeira_papel_m3` and `madeira_papel_m3_km2`: plantation roundwood for paper and pulp in 2024, in m³ and per km² of municipal area (IBGE, PEVS, SIDRA 291).',
      `Thirds of native cover: up to ${pe(e.ter_x[0], 1)}, ${pe(e.ter_x[0], 1)} to ${pe(e.ter_x[1], 1)} and over ${pe(e.ter_x[1], 1)}. Wood: none; up to ${ne(e.med_prod, 1)} m³/km² (median of the ${ne(e.n_prod)} producers); more than that. ${bivEn('b113', 'native cover', 'wood')}. ${casasEn(e.casas)}.`,
      `PEVS publishes ${ne(e.n)} São Paulo municipalities for this variable; the other ${ne(e.sem)} have no data, not zero, and the map hatches them. ${testeEn(e, 'Native cover × pulpwood per km² (log)')}.`,
      `${lisaEn(e, 'lisa113', 'native cover', 'wood')} High-high by intermediate region: ${regs(e.regioesAA, 4, 'and')}.`,
      metodoTesteEn,
    ],
    limitesPt: [
      `A PEVS cobre ${np(e.n)} dos 645 municípios e não diz a espécie: o eucalipto domina a silvicultura paulista, mas no sudoeste há também pinus. Madeira para celulose não é toda a madeira de silvicultura: lenha e toras para serraria ficam de fora.`,
      'Relevo acidentado e solos que afastam a cana e a mecanização podem explicar as duas coisas; o mapa não diz que a silvicultura protege a mata, nem que a ameaça.',
      ecoPt,
    ],
    limitesEn: [
      `PEVS covers ${ne(e.n)} of the 645 municipalities and does not give the species: eucalyptus dominates São Paulo’s plantations, but the south-west also grows pine. Pulpwood is not all plantation wood: firewood and sawlogs are left out.`,
      'Rugged relief and soils that keep cane and machinery away may explain both; the map does not say that plantations protect the forest, nor that they threaten it.',
      ecoEn,
    ],
  };
};

P.esterco = () => {
  const e = C.e114, a = mun('Ferraz de Vasconcelos'), b = mun('Presidente Bernardes');
  return {
    tags: ['bovinos', 'adubo-organico', 'esterco', 'censo-agro-2017', 'correlacao'], cor: BIV[0][2],
    h1: ['Bovinos por km² e estabelecimentos com adubo orgânico nos municípios de São Paulo', 'Cattle per km² and holdings using organic fertiliser across São Paulo’s municipalities'],
    contextoPt: `Onde há mais boi por km², menos estabelecimentos agropecuários usam adubo orgânico. Nos ${np(e.n)} municípios paulistas com dado, a correlação de postos entre o rebanho bovino de 2024 e a parte dos estabelecimentos que adubaram com orgânico no Censo Agropecuário de 2017 é ${dp(e.rho)}, e ${dp(e.parcial)} descontadas urbanização, densidade e renda. No quarto dos municípios com menos boi, a mediana é ${pp(e.bov.medBaixo)}; no quarto com mais, ${pp(e.bov.medAlto)}. O gado solto deixa o esterco no pasto, e o adubo orgânico inclui o composto das hortas perto das cidades: Ferraz de Vasconcelos, com ${np(a.bovinos_km2, 1)} bois por km², tem ${pp(a.pct_estab_adubo_organico)}; Presidente Bernardes, com ${np(b.bovinos_km2)}, ${pp(b.pct_estab_adubo_organico)}. Quarta prancha da coleção «Bioenergia cruzada».`,
    contextoEn: `Where there are more cattle per km², fewer farm holdings use organic fertiliser. Across the ${ne(e.n)} São Paulo municipalities with data, the rank correlation between the 2024 cattle herd and the share of holdings that applied organic fertiliser in the 2017 Agricultural Census is ${de(e.rho)}, and ${de(e.parcial)} net of urbanisation, density and income. In the quarter of municipalities with fewest cattle, the median is ${pe(e.bov.medBaixo)}; in the quarter with most, ${pe(e.bov.medAlto)}. Grazing cattle leave their manure on pasture, and organic fertiliser includes compost from market gardens near towns: Ferraz de Vasconcelos, with ${ne(a.bovinos_km2, 1)} cattle per km², has ${pe(a.pct_estab_adubo_organico)}; Presidente Bernardes, with ${ne(b.bovinos_km2)}, ${pe(b.pct_estab_adubo_organico)}. Fourth plate of the collection “Bioenergy, crossed”.`,
    altPt: `Mapa bivariado dos municípios de São Paulo em nove cores, cruzando terços de bovinos por km² (do claro ao ocre) com terços da parte dos estabelecimentos com adubo orgânico (do claro ao lilás). O ocre de muito boi e pouco adubo cobre o oeste e o noroeste, do Pontal a São José do Rio Preto; o lilás de pouco boi e muito adubo, o entorno da capital, o Vale do Ribeira e o Alto Tietê; o marrom de muito dos dois, o Vale do Paraíba. Os ${np(e.sem)} municípios sem dado, quase todos na Grande São Paulo e no litoral, aparecem hachurados. Chamadas apontam Ferraz de Vasconcelos, com ${pp(a.pct_estab_adubo_organico)} dos estabelecimentos com adubo orgânico, e Presidente Bernardes, com ${np(b.bovinos_km2)} bois por km² e ${pp(b.pct_estab_adubo_organico)}. No painel, a grade 3 × 3 e a tabela das correlações.`,
    altEn: `Bivariate map of São Paulo’s municipalities in nine colours, crossing thirds of cattle per km² (light to ochre) with thirds of the share of holdings using organic fertiliser (light to lilac). The ochre of many cattle and little fertiliser covers the west and north-west, from the Pontal to São José do Rio Preto; the lilac of few cattle and much fertiliser, the capital’s surroundings, the Ribeira Valley and the Upper Tietê; the brown of much of both, the Paraíba Valley. The ${ne(e.sem)} municipalities without data, nearly all in Greater São Paulo and on the coast, are hatched. Callouts point to Ferraz de Vasconcelos, with ${pe(a.pct_estab_adubo_organico)} of holdings using organic fertiliser, and Presidente Bernardes, with ${ne(b.bovinos_km2)} cattle per km² and ${pe(b.pct_estab_adubo_organico)}. In the panel, the 3 × 3 grid and the table of correlations.`,
    chamadasPt: `Ferraz de Vasconcelos, no cinturão de hortas da metrópole, onde ${pp(a.pct_estab_adubo_organico)} dos estabelecimentos usaram adubo orgânico com ${np(a.bovinos_km2, 1)} bois por km², e Presidente Bernardes, no Pontal, com ${np(b.bovinos_km2)} bois por km² e ${pp(b.pct_estab_adubo_organico)}: um dos ${np(e.lisa.BA)} municípios de pouco adubo cercados de muito boi`,
    chamadasEn: `Ferraz de Vasconcelos, in the metropolitan market-garden belt, where ${pe(a.pct_estab_adubo_organico)} of holdings used organic fertiliser with ${ne(a.bovinos_km2, 1)} cattle per km², and Presidente Bernardes, in the Pontal, with ${ne(b.bovinos_km2)} cattle per km² and ${pe(b.pct_estab_adubo_organico)}: one of the ${ne(e.lisa.BA)} municipalities with little fertiliser surrounded by many cattle`,
    fontes: [F.ppm, F.ca, F.censo, F.malha],
    metodoPt: 'Bovinos por km² (IBGE, PPM 2024) e parte dos estabelecimentos agropecuários que fizeram adubação orgânica, só ou com a química (IBGE, Censo Agropecuário 2017), cada uma em terços dos municípios, cruzadas num mapa bivariado 3 × 3; correlações de postos de Spearman, brutas e parciais, e LISA bivariado.',
    metodoEn: 'Cattle per km² (IBGE, PPM 2024) and share of farm holdings that applied organic fertiliser, alone or with chemical (IBGE, 2017 Agricultural Census), each in thirds of municipalities, crossed in a 3 × 3 bivariate map; Spearman rank correlations, raw and partial, and bivariate LISA.',
    indicadores: [
      ['Correlação de postos entre bovinos e adubo orgânico', 'Rank correlation between cattle and organic fertiliser', +e.rho.toFixed(2), null, `parcial ${dp(e.parcial)}; ${np(e.n)} municípios`, `partial ${de(e.parcial)}; ${ne(e.n)} municipalities`],
      ['Estabelecimentos com adubo orgânico, quarto com mais boi (mediana)', 'Holdings using organic fertiliser, most-cattle quarter (median)', +e.bov.medAlto.toFixed(1), '%', `${pp(e.bov.medBaixo)} no quarto com menos boi`, `${pe(e.bov.medBaixo)} in the fewest-cattle quarter`],
      ['Municípios de pouco adubo cercados de muito boi (LISA)', 'Municipalities with little fertiliser amid many cattle (LISA)', e.lisa.BA, 'municípios', `sobretudo em ${regs(e.regioesBA, 2, 'e')}`, `mostly in ${regs(e.regioesBA, 2, 'and')}`],
    ],
    variaveisPt: [
      '`bovinos_km2`: efetivo de bovinos em 31/12/2024 (IBGE, PPM, tabela 3939) sobre a área do município.',
      '`estab_agro`, `estab_adubo_organico` e `pct_estab_adubo_organico`: estabelecimentos agropecuários, os que fizeram adubação orgânica ou química e orgânica, e a parte, em % (IBGE, Censo Agropecuário 2017, SIDRA 6847).',
      `Terços de bovinos: até ${np(e.ter_x[0], 1)}, de ${np(e.ter_x[0], 1)} a ${np(e.ter_x[1], 1)} e mais de ${np(e.ter_x[1], 1)} cabeças por km²; de adubo orgânico: até ${pp(e.ter_y[0], 1)}, de ${pp(e.ter_y[0], 1)} a ${pp(e.ter_y[1], 1)} e mais de ${pp(e.ter_y[1], 1)}. \`b114\`: classe bivariada, dezena = terço de bovinos (1 a 3), unidade = terço de adubo orgânico (1 a 3). ${casasPt(e.casas)}. No estado, ${pp(e.estado, 1)} dos estabelecimentos usaram adubo orgânico; ${np(e.sem)} municípios ficam sem dado, quase todos na Grande São Paulo e no litoral: a PPM não publica rebanho bovino neles, e em alguns o Censo Agropecuário também não tem dado. Falta de dado não é zero.`,
      `\`n_kg_ha_agro\`: nitrogênio dos dejetos dos rebanhos por hectare de área agropecuária (prancha 081). Pelos quartos de nitrogênio, a mediana do adubo orgânico cai de ${pp(e.nitro.medBaixo, 1)} para ${pp(e.nitro.medAlto, 1)}.`,
      `${testePt(e, 'Adubo orgânico × bovinos por km² (log)')}. ${lisaPt(e, 'lisa114', 'adubo orgânico', 'bovinos')} Baixo-alto por região intermediária: ${regs(e.regioesBA, 3, 'e')}.`,
      metodoTestePt,
    ],
    variaveisEn: [
      '`bovinos_km2`: cattle herd on 31/12/2024 (IBGE, PPM, table 3939) over municipal area.',
      '`estab_agro`, `estab_adubo_organico` and `pct_estab_adubo_organico`: farm holdings, those that applied organic or chemical-and-organic fertiliser, and the share, in % (IBGE, 2017 Agricultural Census, SIDRA 6847).',
      `Thirds of cattle: up to ${ne(e.ter_x[0], 1)}, ${ne(e.ter_x[0], 1)} to ${ne(e.ter_x[1], 1)} and over ${ne(e.ter_x[1], 1)} head per km²; of organic fertiliser: up to ${pe(e.ter_y[0], 1)}, ${pe(e.ter_y[0], 1)} to ${pe(e.ter_y[1], 1)} and over ${pe(e.ter_y[1], 1)}. \`b114\`: bivariate class, tens = third of cattle (1 to 3), units = third of organic fertiliser (1 to 3). ${casasEn(e.casas)}. Statewide, ${pe(e.estado, 1)} of holdings used organic fertiliser; ${ne(e.sem)} municipalities have no data, nearly all in Greater São Paulo and on the coast: PPM publishes no cattle herd for them, and for some the Agricultural Census has no data either. Missing data is not zero.`,
      `\`n_kg_ha_agro\`: nitrogen in livestock manure per hectare of farmland (plate 081). By quarters of nitrogen, the median share of organic fertiliser falls from ${pe(e.nitro.medBaixo, 1)} to ${pe(e.nitro.medAlto, 1)}.`,
      `${testeEn(e, 'Organic fertiliser × cattle per km² (log)')}. ${lisaEn(e, 'lisa114', 'organic fertiliser', 'cattle')} Low-high by intermediate region: ${regs(e.regioesBA, 3, 'and')}.`,
      metodoTesteEn,
    ],
    limitesPt: [
      'O Censo Agropecuário é de 2017 e o rebanho, de 2024: sete anos separam as duas medidas.',
      'Adubo orgânico não é só esterco: inclui composto e outros resíduos, e o Censo conta estabelecimentos, não toneladas nem hectares. O pasto quase não recebe adubo, e o esterco do gado solto fica no campo, sem ser recolhido; o mapa mostra onde o esterco existe e onde ele é usado como adubo, não quanto dele se perde.',
      ecoPt,
    ],
    limitesEn: [
      'The Agricultural Census dates from 2017 and the herd from 2024: seven years separate the two measures.',
      'Organic fertiliser is not only manure: it includes compost and other residues, and the Census counts holdings, not tonnes or hectares. Pasture is rarely fertilised, and manure from grazing cattle stays in the field, uncollected; the map shows where manure exists and where it is used as fertiliser, not how much of it is lost.',
      ecoEn,
    ],
  };
};

P.pequenos = () => {
  const e = C.e115, a = mun('Ariranha'), b = mun('Tarumã'), c = mun('Maracaí');
  const m3 = (v) => `${np(Math.round(v / 1e3))} mil m³/dia`, m3e = (v) => `${ne(Math.round(v / 1e3))} thousand m³/day`;
  const fr = (k, n) => `${k} de ${n} (${pp((100 * k) / n)})`, fre = (k, n) => `${k} of ${n} (${pe((100 * k) / n)})`;
  return {
    tags: ['biometano', 'cp2b', 'residuos-solidos', 'consorcios', 'gasodutos', 'munic'], cor: COR_115.sozinho,
    h1: ['Municípios pequenos com muito potencial de biometano, longe do gasoduto, pela forma de prestar o serviço de resíduos', 'Small municipalities with high biomethane potential, far from the pipeline, by how they run waste services'],
    contextoPt: `${e.n} municípios paulistas reúnem três coisas: potencial de biometano no quarto de cima do estado, menos de ${np(LIM_POP_115)} habitantes e mais de ${LIM_KM_115} km do gasoduto de transporte. Juntos, têm ${pp(e.pct_bm)} do potencial acessível do estado, ${np(e.bm / 1e6, 2)} milhões de m³ por dia, para ${np(Math.round(e.pessoas / 1e3))} mil habitantes, sobretudo da cana. Pela MUNIC 2023, ${e.sozinho} deles prestam sozinhos o serviço de resíduos sólidos, ${e.regional} têm outra forma regionalizada e ${e.consorcio} estão em consórcio público; nenhum consome gás canalizado. Ficar sozinho é tão comum no grupo quanto no estado: é retrato descritivo, sem teste. Ariranha, com ${np(a.pessoas)} habitantes, tem o maior potencial do grupo, ${m3(a.biometano_m3d)}. Quinta prancha da coleção «Bioenergia cruzada».`,
    contextoEn: `${e.n} São Paulo municipalities combine three things: biomethane potential in the state’s top quarter, fewer than ${ne(LIM_POP_115)} people and over ${LIM_KM_115} km from the transmission pipeline. Together they hold ${pe(e.pct_bm)} of the state’s accessible potential, ${ne(e.bm / 1e6, 2)} million m³ a day, for ${ne(Math.round(e.pessoas / 1e3))} thousand people, mostly from cane. According to MUNIC 2023, ${e.sozinho} of them run solid-waste services on their own, ${e.regional} have another regional arrangement and ${e.consorcio} are in a public consortium; none uses piped gas. Going it alone is as common in the group as statewide: this is a descriptive portrait, with no test. Ariranha, with ${ne(a.pessoas)} people, has the group’s largest potential, ${m3e(a.biometano_m3d)}. Fifth plate of the collection “Bioenergy, crossed”.`,
    altPt: `Mapa de São Paulo com os ${e.n} municípios pequenos, de muito potencial de biometano e longe do gasoduto, em três cores pela forma de prestar o serviço de resíduos: ocre para quem presta sozinho, lilás-claro para outra forma regionalizada e roxo para consórcio público. Os outros ${e.cheios_n - e.n} municípios do quarto de cima do potencial ficam em cinza-claro, e o resto em branco. Uma linha preta grossa marca o gasoduto de transporte, que corta o estado de oeste a leste, e linhas cinza finas a rede de distribuição, concentrada no leste. O ocre domina o norte e o noroeste. Chamadas apontam Ariranha, Tarumã e Maracaí. No painel, a legenda e uma tabela da MUNIC 2023 comparando o grupo com o estado.`,
    altEn: `Map of São Paulo with the ${e.n} small, biomethane-rich municipalities far from the pipeline in three colours by how they run waste services: ochre for those running them alone, light lilac for another regional arrangement and purple for a public consortium. The other ${e.cheios_n - e.n} municipalities in the top quarter of potential are light grey, and the rest white. A thick black line marks the transmission pipeline, crossing the state from west to east, and thin grey lines the distribution network, concentrated in the east. Ochre dominates the north and north-west. Callouts point to Ariranha, Tarumã and Maracaí. In the panel, the legend and a MUNIC 2023 table comparing the group with the state.`,
    chamadasPt: `Ariranha, com ${m3(a.biometano_m3d)}, ${np(a.pessoas)} habitantes e ${np(a.km_gasoduto_transporte)} km do gasoduto, o maior potencial do grupo, que presta o serviço sozinha; Tarumã, com ${m3(b.biometano_m3d)} a ${np(b.km_gasoduto_transporte)} km do gasoduto de transporte, também sozinha; e Maracaí, com ${m3(c.biometano_m3d)}, um dos ${e.consorcio} do grupo em consórcio público`,
    chamadasEn: `Ariranha, with ${m3e(a.biometano_m3d)}, ${ne(a.pessoas)} people and ${ne(a.km_gasoduto_transporte)} km from the pipeline, the group’s largest potential, which runs its services alone; Tarumã, with ${m3e(b.biometano_m3d)} ${ne(b.km_gasoduto_transporte)} km from the transmission pipeline, also alone; and Maracaí, with ${m3e(c.biometano_m3d)}, one of the group’s ${e.consorcio} in a public consortium`,
    fontes: [F.cp2b, F.munic, F.epe, F.semil, F.censo, F.malha],
    metodoPt: `Municípios com potencial de biometano do CP2B (v5.1, N4, cenário de referência) no quarto de cima do estado (${np(e.p75)} m³/dia ou mais), menos de ${np(LIM_POP_115)} habitantes (Censo 2022) e mais de ${LIM_KM_115} km em linha reta do gasoduto de transporte (EPE), classificados pela forma de prestar o manejo de resíduos sólidos declarada na MUNIC 2023; sem teste estatístico.`,
    metodoEn: `Municipalities with CP2B biomethane potential (v5.1, N4, reference scenario) in the state’s top quarter (${ne(e.p75)} m³/day or more), fewer than ${ne(LIM_POP_115)} people (2022 Census) and over ${LIM_KM_115} km in a straight line from the transmission pipeline (EPE), classified by how they run solid-waste management as declared in MUNIC 2023; no statistical test.`,
    indicadores: [
      ['Municípios pequenos, de muito potencial e longe do gasoduto', 'Small, high-potential municipalities far from the pipeline', e.n, 'municípios', `de ${np(e.cheios_n)} no quarto de cima do potencial`, `of ${ne(e.cheios_n)} in the top quarter of potential`],
      ['Parte do potencial acessível do estado', 'Share of the state’s accessible potential', +e.pct_bm.toFixed(1), '%', `${np(e.bm / 1e6, 2)} milhões de m³/dia`, `${ne(e.bm / 1e6, 2)} million m³/day`],
      ['Prestam sozinhos o serviço de resíduos', 'Run waste services on their own', e.sozinho, 'municípios', `de ${e.n}; ${e.consorcio} em consórcio público`, `of ${e.n}; ${e.consorcio} in a public consortium`],
    ],
    variaveisPt: [
      `\`cheio115\`: potencial de biometano (\`biometano_m3d\`, CP2B v5.1, N4, referência) no quarto de cima dos 645 municípios, ${np(e.p75)} m³/dia ou mais (${np(e.cheios_n)} municípios). \`alvo115\`: além disso, menos de ${np(LIM_POP_115)} habitantes no Censo 2022 (\`pessoas\`) e \`km_gasoduto_transporte\` acima de ${LIM_KM_115} km.`,
      '`km_gasoduto_transporte` e `km_gasoduto_distribuicao`: distância em linha reta do ponto interno do município ao gasoduto de transporte e à rede de distribuição mais próximos (EPE, na base de infraestrutura do MapBiomas; prancha 057).',
      '`arranjo115` (só no grupo): `consorcio` quando a MUNIC 2023 diz que o serviço de resíduos sólidos é prestado de forma regionalizada por consórcio público; `regional` para outra forma regionalizada; `sozinho` quando não é regionalizado; `sem_informacao` quando a prefeitura não respondeu (nenhum caso). `rs_consorcio`, `rs_regionalizado`, `rs_trat_organicos`, `rs_compostagem`, `rs_aterro_sanitario` e `rs_coleta_seletiva` trazem as respostas de todos os municípios (1 sim, 0 não).',
      `No grupo e no estado (${np(e.est_munic)} municípios responderam à MUNIC): consórcio público ${fr(e.consorcio, e.n)} contra ${fr(e.est_consorcio, e.est_munic)}; alguma forma regionalizada ${fr(e.consorcio + e.regional, e.n)} contra ${fr(e.est_regional, e.est_munic)}; tratam resíduos orgânicos ${fr(e.trat_org, e.n)} contra ${fr(e.est_trat_org, e.est_munic)}; compostagem ${fr(e.compostagem, e.n)}; aterro sanitário no município ${fr(e.aterro, e.n)}; coleta seletiva ${fr(e.seletiva, e.n)}.`,
      `\`tem_gas_canalizado\`: consumo de gás natural canalizado no Anuário da SEMIL (2024). No grupo, ${e.gas_canalizado} de ${e.n}; no estado, ${np(645 - e.sem_gas_n)} de 645. Por região intermediária, o grupo fica em ${regs(e.regioes, 5, 'e')}.`,
    ],
    variaveisEn: [
      `\`cheio115\`: biomethane potential (\`biometano_m3d\`, CP2B v5.1, N4, reference) in the top quarter of the 645 municipalities, ${ne(e.p75)} m³/day or more (${ne(e.cheios_n)} municipalities). \`alvo115\`: in addition, fewer than ${ne(LIM_POP_115)} people in the 2022 Census (\`pessoas\`) and \`km_gasoduto_transporte\` above ${LIM_KM_115} km.`,
      '`km_gasoduto_transporte` and `km_gasoduto_distribuicao`: straight-line distance from the municipality’s interior point to the nearest transmission pipeline and distribution network (EPE, in the MapBiomas infrastructure database; plate 057).',
      '`arranjo115` (group only): `consorcio` when MUNIC 2023 says solid-waste services are run regionally through a public consortium; `regional` for another regional arrangement; `sozinho` when they are not regionalised; `sem_informacao` when the town hall did not answer (no cases). `rs_consorcio`, `rs_regionalizado`, `rs_trat_organicos`, `rs_compostagem`, `rs_aterro_sanitario` and `rs_coleta_seletiva` carry every municipality’s answers (1 yes, 0 no).',
      `In the group and statewide (${ne(e.est_munic)} municipalities answered MUNIC): public consortium ${fre(e.consorcio, e.n)} against ${fre(e.est_consorcio, e.est_munic)}; any regional arrangement ${fre(e.consorcio + e.regional, e.n)} against ${fre(e.est_regional, e.est_munic)}; treat organic waste ${fre(e.trat_org, e.n)} against ${fre(e.est_trat_org, e.est_munic)}; composting ${fre(e.compostagem, e.n)}; sanitary landfill in the municipality ${fre(e.aterro, e.n)}; separate collection ${fre(e.seletiva, e.n)}.`,
      `\`tem_gas_canalizado\`: piped natural gas consumption in the SEMIL Yearbook (2024). In the group, ${e.gas_canalizado} of ${e.n}; statewide, ${ne(645 - e.sem_gas_n)} of 645. By intermediate region, the group lies in ${regs(e.regioes, 5, 'and')}.`,
    ],
    limitesPt: [
      modeloPt,
      'O potencial do grupo vem sobretudo da cana, cujos resíduos dependem da usina, não da prefeitura: o serviço municipal de resíduos é só uma das portas para um projeto de biogás. O mapa não diz que um consórcio faria o biogás sair.',
      'Os cortes (quarto de cima, 20 mil habitantes, 50 km) são escolhas de leitura; outros cortes mudam a lista. Distâncias em linha reta, não por estrada. A MUNIC é o que a prefeitura declara.',
    ],
    limitesEn: [
      modeloEn,
      'The group’s potential comes mostly from cane, whose residues depend on the mill, not the town hall: the municipal waste service is only one of the doors to a biogas project. The map does not say a consortium would make the biogas happen.',
      'The cut-offs (top quarter, 20,000 people, 50 km) are reading choices; other cut-offs change the list. Distances are straight-line, not by road. MUNIC is what each town hall declares.',
    ],
  };
};

/* ------------------------------------------------------------------ escrita */
const y = (s) => `"${String(s).replace(/"/g, '\\"')}"`;
const quebra = (txt, w = 100) => { const out = []; let l = ''; for (const p of txt.split(' ')) { if ((l + ' ' + p).trim().length > w && l) { out.push(l); l = p; } else l = l ? `${l} ${p}` : p; } if (l) out.push(l); return out.join('\n'); };
const avisos = [];
const TIT = {
  cana: ['Cana no tanque', 'Cane in the tank'],
  diesel: ['O diesel que o biometano cobriria', 'The diesel biomethane could cover'],
  eucalipto: ['Eucalipto encostado na mata', 'Eucalyptus against the forest'],
  esterco: ['O esterco longe de quem aduba', 'Manure far from who spreads it'],
  pequenos: ['Pequenos, cheios de gás e sozinhos', 'Small, gas-rich and on their own'],
};
const SUB = {
  cana: ['Onde há mais canavial, o etanol pesa mais no que os postos vendem', 'Where there is more cane, ethanol weighs more in what filling stations sell'],
  diesel: [`Em ${np(C.e112.ge1)} municípios, o potencial de biometano passa, em energia, do diesel que os postos vendem`, `In ${ne(C.e112.ge1)} municipalities, biomethane potential exceeds, in energy, the diesel sold at the pumps`],
  eucalipto: ['Onde sobra mais vegetação nativa, mais madeira sai para o papel e a celulose', 'Where more native vegetation remains, more wood goes to paper and pulp'],
  esterco: ['Onde há mais boi por km², menos estabelecimentos usam adubo orgânico', 'Where there are more cattle per km², fewer farms use organic fertiliser'],
  pequenos: [`${C.e115.n} municípios de menos de 20 mil habitantes têm ${pp(C.e115.pct_bm)} do potencial de biometano e ficam longe do gasoduto`, `${C.e115.n} towns of under 20,000 people hold ${pe(C.e115.pct_bm)} of the biomethane potential and lie far from the pipeline`],
};
const COL_PT = 'Bioenergia cruzada', COL_EN = 'Bioenergy, crossed';
const introPt = 'A coleção cruza a bioenergia paulista com o que se vende nos postos, com o campo e com as prefeituras, nos 645 municípios de São Paulo. Os pares saíram de uma triagem de correlações entre o potencial de biometano do CP2B, as vendas de combustíveis do Anuário da SEMIL, a silvicultura, o rebanho, o Censo Agropecuário, a frota e a MUNIC. Cada par passou por correlação de postos bruta e parcial (descontadas urbanização, densidade e renda), amostra efetiva corrigida pela autocorrelação espacial, valores q de Benjamini–Hochberg e LISA bivariado. A última prancha é descritiva, sem teste, e o texto diz isso.';
const introEn = 'The collection crosses São Paulo’s bioenergy with what filling stations sell, with the countryside and with town halls, across the state’s 645 municipalities. The pairs came from a correlation screen between CP2B biomethane potential, fuel sales in the SEMIL Yearbook, plantation forestry, the cattle herd, the Agricultural Census, the vehicle fleet and MUNIC. Each pair went through raw and partial rank correlation (net of urbanisation, density and income), an effective sample corrected for spatial autocorrelation, Benjamini–Hochberg q values and bivariate LISA. The last plate is descriptive, with no test, and the text says so.';

const tamZip = mb(join(RAIZ, 'mapas', SERIE[0].pasta, 'dados', ZIP));

SERIE.forEach((s, i) => {
  const d = P[s.tema]();
  const pasta = join(RAIZ, 'mapas', s.pasta);
  const n3 = String(s.numero).padStart(3, '0');
  const ant = SERIE[i - 1], seg = SERIE[i + 1];
  if (d.contextoPt.length > 900) avisos.push(`${n3} contexto PT ${d.contextoPt.length}`);
  if (d.contextoEn.length > 900) avisos.push(`${n3} contexto EN ${d.contextoEn.length}`);
  const svg = join(pasta, 'dados', `${s.base}_prancha.svg`);
  const csv = join(pasta, 'dados', CSV);

  // ---------- front matter PT
  const fm = [];
  fm.push('---', `numero: ${s.numero}`, `titulo: ${y(TIT[s.tema][0])}`, `subtitulo: ${y(SUB[s.tema][0])}`, `data: ${s.data}`, `categoria: ${s.categoria}`, 'colecao: bioenergia-cruzada-sp',
    `tags: [${['bioenergia-cruzada-sp', 'sao-paulo', ...d.tags].join(', ')}]`, '',
    'contexto: >-', `  ${d.contextoPt}`, '', 'imagem: ./mapa_preview.png', `imagem_alt: ${y(d.altPt)}`, '', 'recorte: "Estado de São Paulo (SP)"', 'fontes:');
  for (const f of d.fontes) { fm.push(`  - nome: ${y(f.nome)}`, `    nome_en: ${y(f.nome_en)}`); if (f.url) fm.push(`    url: ${f.url}`); fm.push(`    ano: ${f.ano}`); }
  fm.push('crs: "SIRGAS 2000 (EPSG:4674)"', 'epsg: 4674', 'software: ["Node.js", "d3-geo", "QGIS"]', `metodo: ${y(d.metodoPt)}`, '', 'camadas:');
  fm.push(`  - { nome: municipios, tipo: poligono, cor: "${d.cor}", descricao: "645 municípios com as variáveis das cinco pranchas, as classes bivariadas e os aglomerados LISA (mesmo GPKG das pranchas 111 a 115)", descricao_en: "645 municipalities with the variables of all five plates, the bivariate classes and the LISA clusters (same GPKG as plates 111 to 115)" }`);
  fm.push('  - { nome: gasodutos, tipo: linha, cor: "#1a211a", descricao: "Gasodutos de transporte e rede de distribuição de gás (EPE)", descricao_en: "Gas transmission pipelines and distribution network (EPE)" }');
  fm.push('  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "11 regiões geográficas intermediárias", descricao_en: "11 intermediate geographic regions" }');
  fm.push('  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite do estado", descricao_en: "State boundary" }', '', 'indicadores:');
  for (const [rot, rotEn, valor, unid, nota, notaEn, unidEn] of d.indicadores) {
    fm.push('  - tipo: numero', `    rotulo: ${y(rot)}`, `    rotulo_en: ${y(rotEn)}`, `    valor: ${valor}`);
    if (unid) fm.push(`    unidade: ${y(unid)}`, `    unidade_en: ${y(unidEn ?? (unid === 'municípios' ? 'municipalities' : unid))}`);
    if (nota) fm.push(`    nota: ${y(nota)}`, `    nota_en: ${y(notaEn)}`);
  }
  fm.push('', 'downloads:',
    '  - formato: gpkg', `    url: ${REL}/${ZIP}`, '    rotulo: "Municípios e gasodutos com as variáveis das cinco pranchas, SIRGAS 2000, com estilos do QGIS"', '    rotulo_en: "Municipalities and pipelines with the variables of all five plates, SIRGAS 2000, with QGIS styles"', `    tamanho: "${tamZip}"`,
    '  - formato: csv', `    arquivo: dados/${CSV}`, '    rotulo: "Tabela dos municípios (a mesma nas cinco pranchas)"', '    rotulo_en: "Municipal table (the same on all five plates)"', `    tamanho: "${kb(csv)}"`,
    '  - formato: svg', `    url: ${REL}/${s.base}_prancha.svg`, `    url_en: ${REL}/${s.base}_prancha.en.svg`, '    rotulo: "Prancha em vetor, para impressão"', '    rotulo_en: "Vector plate, for printing"', `    tamanho: "${mb(svg)}"`,
    '  - formato: png', '    arquivo: mapa_preview.png', '    arquivo_en: mapa_preview.en.png', '    rotulo: "Prancha (PNG 2400 px)"', '    rotulo_en: "Plate (PNG, 2400 px)"', `    tamanho: "${mb(join(pasta, 'mapa_preview.png'))}"`,
    '', 'doi_automatico: false', 'versao: "1.0.0"', 'discussoes: []', '---', '', '');

  // ---------- corpo PT
  const b = [];
  b.push(`# ${d.h1[0]}`, '', '<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>', '');
  const vizPt = [ant && `a anterior é a [prancha ${String(ant.numero).padStart(3, '0')}](../${ant.pasta}/README.md)`, seg && `a seguinte, a [prancha ${String(seg.numero).padStart(3, '0')}](../${seg.pasta}/README.md)`].filter(Boolean).join('; ');
  b.push(`Prancha Nº ${n3}, a ${ORD_PT[i]} de cinco da coleção **${COL_PT}**; ${vizPt}.`, '');
  b.push(quebra(introPt), '');
  b.push(quebra(`As chamadas do mapa apontam ${d.chamadasPt}.`), '');
  b.push('## O que vem nos arquivos', '', '| Camada (GPKG) | Geometria | Conteúdo |', '| --- | --- | --- |');
  b.push('| `municipios` | polígono | 645 municípios com cana e etanol, biometano e diesel, frota, mata nativa e madeira para celulose, bovinos e adubo orgânico, distâncias ao gasoduto, gás canalizado e as respostas da MUNIC sobre resíduos; classes `b111`, `b113`, `b114`, `arranjo115` e aglomerados `lisa111`, `lisa113`, `lisa114` |');
  b.push('| `gasodutos` | linha | gasodutos de transporte e rede de distribuição (`tipo`) |');
  b.push('| `regioes_intermediarias`, `limite_estadual` | polígono | referência |', '');
  b.push(quebra('O **GPKG** é o mesmo nas cinco pranchas e traz um estilo do QGIS para cada uma. O **CSV** tem a tabela dos municípios, sem geometria. Campos vazios são falta de dado, não zero. Os aglomerados LISA vêm como `AA` (alto-alto), `BB` (baixo-baixo), `AB`, `BA` e `ns` (não significativo); a primeira letra é a variável do município, a segunda a dos vizinhos.'), '');
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
  en.push(`Plate No. ${n3}, the ${ORD_EN[i]} of five in the collection **${COL_EN}**; ${vizEn}.`, '');
  en.push(quebra(introEn), '');
  en.push(quebra(`The map’s callouts point to ${d.chamadasEn}.`), '');
  en.push('## What the files contain', '', '| Layer (GPKG) | Geometry | Content |', '| --- | --- | --- |');
  en.push('| `municipios` | polygon | 645 municipalities with cane and ethanol, biomethane and diesel, the fleet, native cover and pulpwood, cattle and organic fertiliser, distances to the pipeline, piped gas and the MUNIC answers on waste; classes `b111`, `b113`, `b114`, `arranjo115` and clusters `lisa111`, `lisa113`, `lisa114` |');
  en.push('| `gasodutos` | line | transmission pipelines and distribution network (`tipo`) |');
  en.push('| `regioes_intermediarias`, `limite_estadual` | polygon | reference |', '');
  en.push(quebra('The **GPKG** is the same for all five plates and carries a QGIS style for each. The **CSV** has the municipal table, without geometry. Empty fields are missing data, not zero. LISA clusters come as `AA` (high-high), `BB` (low-low), `AB`, `BA` and `ns` (not significant); the first letter is the municipality’s variable, the second its neighbours’.'), '');
  en.push('## Method', '');
  en.push(...d.variaveisEn.map((t, k) => quebra(`${k + 1}. ${t}`).replace(/\n/g, '\n   ')));
  en.push('', '## Limitations', '');
  en.push(...d.limitesEn.map((t) => quebra(`- ${t}`).replace(/\n/g, '\n  ')));
  writeFileSync(join(pasta, 'README.en.md'), en.join('\n') + '\n');
  console.log(`✓ ${n3} contexto ${d.contextoPt.length}/${d.contextoEn.length}`);
});
if (avisos.length) console.log('AVISOS', avisos);
