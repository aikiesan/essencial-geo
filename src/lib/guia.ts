/**
 * Guia de leitura do atlas: glossário, perguntas de entrada e a grade das UFs
 * do "mapa dos mapas". Conteúdo didático nas duas línguas; os componentes só leem.
 */
import type { ColecaoId } from '../site.config';
import type { Lingua } from '../i18n';
import type { Mapa } from './mapas';

type Bilingue = Record<Lingua, string>;

/* ---------- Glossário ------------------------------------------------------ */

export type GrupoTermo = 'cartografia' | 'cana' | 'biogas' | 'terra' | 'politica' | 'fontes';
export const GRUPOS_TERMO: GrupoTermo[] = ['cartografia', 'cana', 'biogas', 'terra', 'politica', 'fontes'];

export interface Termo {
  id: string;
  grupo: GrupoTermo;
  termo: Bilingue;
  def: Bilingue;
  /** Onde o termo aparece no texto da prancha (título, subtítulo, contexto, método), nas duas línguas. */
  padrao: RegExp;
}

export const GLOSSARIO: Termo[] = [
  // Cartografia
  {
    id: 'sirgas',
    grupo: 'cartografia',
    termo: { pt: 'SIRGAS 2000 · EPSG:4674', en: 'SIRGAS 2000 · EPSG:4674' },
    def: {
      pt: 'O sistema de referência geodésico oficial do Brasil: a “régua” das coordenadas de todas as camadas do atlas. O código EPSG:4674 o identifica em qualquer SIG, e o QGIS o reconhece ao abrir o GeoPackage.',
      en: 'Brazil’s official geodetic reference system: the “ruler” behind the coordinates of every layer in the atlas. The code EPSG:4674 identifies it in any GIS, and QGIS recognises it when you open the GeoPackage.',
    },
    padrao: /SIRGAS|EPSG/,
  },
  {
    id: 'albers',
    grupo: 'cartografia',
    termo: { pt: 'Projeção de Albers', en: 'Albers projection' },
    def: {
      pt: 'Projeção cônica equivalente: achata a Terra no papel sem alterar as áreas. Um município com o dobro do tamanho ocupa o dobro de papel, por isso ela é a escolha para comparar quantidades por território no Brasil inteiro.',
      en: 'An equal-area conic projection: it flattens the Earth onto paper without changing areas. A municipality twice as large takes up twice as much paper, which is why it is used to compare quantities across the whole of Brazil.',
    },
    padrao: /Albers/,
  },
  {
    id: 'coropletico',
    grupo: 'cartografia',
    termo: { pt: 'Mapa coroplético', en: 'Choropleth map' },
    def: {
      pt: 'Cada área (município, setor censitário) recebe a cor da classe do seu valor. A cor diz a faixa, não o total: por isso as pranchas usam taxas, como por km², por pessoa ou por domicílio.',
      en: 'Each area (municipality, census tract) takes the colour of its value’s class. The colour gives the band, not the total, which is why the plates use rates such as per km², per person or per household.',
    },
    padrao: /coropl|choropleth/i,
  },
  {
    id: 'circulos',
    grupo: 'cartografia',
    termo: { pt: 'Círculos proporcionais', en: 'Proportional circles' },
    def: {
      pt: 'A área do círculo cresce com a quantidade: serve para totais (toneladas, usinas, MW) que um coroplético distorceria, porque municípios grandes pareceriam ter mais só por serem grandes.',
      en: 'The circle’s area grows with the quantity. They suit totals (tonnes, plants, MW) that a choropleth would distort, since large municipalities would seem to have more just for being large.',
    },
    padrao: /c[íi]rculos? proporciona|proportional (circle|symbol)/i,
  },
  {
    id: 'setor',
    grupo: 'cartografia',
    termo: { pt: 'Setor censitário', en: 'Census tract' },
    def: {
      pt: 'A menor área de coleta do Censo do IBGE, com algumas centenas de domicílios. É o grão mais fino em que se pode ver renda, saneamento e moradia sem identificar ninguém.',
      en: 'The smallest collection area of the IBGE Census, a few hundred households each. It is the finest grain at which income, sanitation and housing can be seen without identifying anyone.',
    },
    padrao: /setor(es)? censit|census tract|\btracts?\b/i,
  },
  {
    id: 'hipsometria',
    grupo: 'cartografia',
    termo: { pt: 'Hipsometria e sombreamento', en: 'Hypsometric tints and hillshade' },
    def: {
      pt: 'Cores por faixa de altitude, das baixadas às serras, com uma luz rasante simulada que dá volume ao relevo.',
      en: 'Colours by altitude band, from lowlands to ranges, with a simulated low-angle light that gives the relief its volume.',
    },
    padrao: /hipsom|hypsometr|sombreamento|hillshade/i,
  },

  // Cana-de-açúcar
  {
    id: 'safra',
    grupo: 'cana',
    termo: { pt: 'Safra (ano-safra)', en: 'Harvest year' },
    def: {
      pt: 'O ano da cana não é o do calendário: no Centro-Sul a safra vai de abril a março; no Nordeste, de setembro a agosto. Por isso as duas regiões moem em meses opostos.',
      en: 'Cane years are not calendar years: in the Centre-South the harvest runs from April to March; in the Northeast, from September to August. That is why the two regions crush in opposite months.',
    },
    padrao: /\bsafras?\b|harvest/i,
  },
  {
    id: 'atr',
    grupo: 'cana',
    termo: { pt: 'ATR', en: 'ATR (total recoverable sugars)' },
    def: {
      pt: 'Açúcares Totais Recuperáveis: quanto açúcar dá para tirar de cada tonelada de cana, em kg. É a medida da qualidade da cana e a base do seu preço.',
      en: 'Açúcares Totais Recuperáveis, total recoverable sugars: how much sugar can be extracted from each tonne of cane, in kg. It measures cane quality and is the basis of its price.',
    },
    padrao: /\bATR\b/,
  },
  {
    id: 'bagaco',
    grupo: 'cana',
    termo: { pt: 'Bagaço', en: 'Bagasse' },
    def: {
      pt: 'A fibra que sobra da moagem. Queimado nas caldeiras, gera o vapor e a eletricidade da própria usina; o excedente vai para a rede.',
      en: 'The fibre left after crushing. Burnt in the boilers, it makes the mill’s own steam and electricity; the surplus goes to the grid.',
    },
    padrao: /bagaço|bagasse/i,
  },
  {
    id: 'palha',
    grupo: 'cana',
    termo: { pt: 'Palha da cana', en: 'Cane straw' },
    def: {
      pt: 'Pontas e folhas que ficam no campo na colheita mecanizada, desde o fim da queimada. Parte pode ser recolhida para energia; parte precisa ficar para proteger o solo.',
      en: 'Tops and leaves left in the field by mechanised harvesting since cane burning ended. Some can be collected for energy; some must stay to protect the soil.',
    },
    padrao: /\bpalha\b|\bstraw\b/i,
  },
  {
    id: 'vinhaca',
    grupo: 'cana',
    termo: { pt: 'Vinhaça', en: 'Vinasse' },
    def: {
      pt: 'O líquido que sobra da destilação, cerca de dez litros por litro de etanol, rico em potássio. Volta ao canavial como adubo e pode passar por um biodigestor antes.',
      en: 'The liquid left by distillation, around ten litres per litre of ethanol, rich in potassium. It goes back to the cane fields as fertiliser and can pass through a digester first.',
    },
    padrao: /vinhaça|vinasse/i,
  },
  {
    id: 'torta',
    grupo: 'cana',
    termo: { pt: 'Torta de filtro', en: 'Filter cake' },
    def: {
      pt: 'O resíduo da limpeza do caldo de cana, rico em fósforo e matéria orgânica: adubo e matéria-prima de biogás.',
      en: 'The residue from clarifying cane juice, rich in phosphorus and organic matter: a fertiliser and a biogas feedstock.',
    },
    padrao: /torta de filtro|filter cake/i,
  },

  // Biogás e resíduos
  {
    id: 'biogas',
    grupo: 'biogas',
    termo: { pt: 'Biogás', en: 'Biogas' },
    def: {
      pt: 'O gás da decomposição sem ar (digestão anaeróbia) de resíduos orgânicos: dejetos, vinhaça, lodo de esgoto, lixo. Tem de 50% a 70% de metano; o resto é quase todo CO₂.',
      en: 'The gas from the airless breakdown (anaerobic digestion) of organic waste: manure, vinasse, sewage sludge, rubbish. It is 50% to 70% methane; the rest is mostly CO₂.',
    },
    padrao: /biog[áa]s/i,
  },
  {
    id: 'biometano',
    grupo: 'biogas',
    termo: { pt: 'Biometano', en: 'Biomethane' },
    def: {
      pt: 'Biogás purificado, sem a maior parte do CO₂, até a especificação da ANP: aí substitui o gás natural no gasoduto, na indústria e no tanque do caminhão.',
      en: 'Biogas upgraded, with most of the CO₂ removed, to ANP’s specification, at which point it replaces natural gas in the pipeline, in industry and in the lorry’s tank.',
    },
    padrao: /biometan|biomethane/i,
  },
  {
    id: 'niveis',
    grupo: 'biogas',
    termo: { pt: 'N1 a N4 (níveis de potencial)', en: 'N1 to N4 (potential levels)' },
    def: {
      pt: 'Os quatro níveis do CP2B: N1 teórico (todo o resíduo gerado), N2 técnico (depois da coleta), N3 mobilizável (depois dos usos concorrentes e do que já vira biogás) e N4 acessível (depois da estocagem e do fator logístico).',
      en: 'CP2B’s four levels: N1 theoretical (all residue generated), N2 technical (after collection), N3 mobilisable (after competing uses and what already becomes biogas) and N4 accessible (after storage and the logistic factor).',
    },
    padrao: /\bN[1-4]\b/,
  },
  {
    id: 'nm3',
    grupo: 'biogas',
    termo: { pt: 'Nm³ (metro cúbico normal)', en: 'Nm³ (normal cubic metre)' },
    def: {
      pt: 'Volume de gás medido a 0 °C e 1 atm, para que medidas feitas em condições diferentes possam ser somadas e comparadas.',
      en: 'Gas volume measured at 0 °C and 1 atm, so that measurements made under different conditions can be added and compared.',
    },
    padrao: /Nm³|Nm3/,
  },
  {
    id: 'digestato',
    grupo: 'biogas',
    termo: { pt: 'Digestato', en: 'Digestate' },
    def: {
      pt: 'O que sai do biodigestor depois do biogás: um líquido com nitrogênio, fósforo e potássio que volta ao campo como adubo.',
      en: 'What comes out of the digester after the biogas: a liquid with nitrogen, phosphorus and potassium that goes back to the field as fertiliser.',
    },
    padrao: /digestato|digestate/i,
  },
  {
    id: 'aterro',
    grupo: 'biogas',
    termo: { pt: 'Aterro sanitário e lixão', en: 'Landfill and open dump' },
    def: {
      pt: 'O aterro sanitário é uma obra de engenharia: solo impermeabilizado, drenagem do chorume e do gás. O lixão é descarte a céu aberto, proibido pela Política Nacional de Resíduos Sólidos. O gás de aterro é biogás.',
      en: 'A sanitary landfill is an engineered site: sealed ground, leachate and gas drainage. An open dump is tipping in the open air, banned by Brazil’s National Solid Waste Policy. Landfill gas is biogas.',
    },
    padrao: /aterro|lix[ãa]o|landfill|open dump/i,
  },
  {
    id: 'iqr',
    grupo: 'biogas',
    termo: { pt: 'IQR', en: 'IQR (landfill quality index)' },
    def: {
      pt: 'Índice de Qualidade de Aterro de Resíduos, da CETESB: a nota de 0 a 10 que cada aterro paulista recebe todo ano. Acima de 7, o aterro é considerado adequado.',
      en: 'CETESB’s Landfill Quality Index: the 0-to-10 score each São Paulo landfill receives every year. Above 7, the landfill is rated adequate.',
    },
    padrao: /\bIQR\b/,
  },
  {
    id: 'gd',
    grupo: 'biogas',
    termo: { pt: 'Geração distribuída', en: 'Distributed generation' },
    def: {
      pt: 'Pequenas centrais ligadas à rede da distribuidora, perto de quem consome: microgeração até 75 kW e minigeração acima disso, até alguns megawatts. A energia vira crédito na conta de luz.',
      en: 'Small units connected to the distribution grid, close to consumers: micro-generation up to 75 kW and mini-generation above that, up to a few megawatts. The energy becomes credit on the electricity bill.',
    },
    padrao: /gera[çc][ãa]o distribu|distributed generation/i,
  },
  {
    id: 'biogenico',
    grupo: 'biogas',
    termo: { pt: 'CO₂ biogênico', en: 'Biogenic CO₂' },
    def: {
      pt: 'O CO₂ que vem de biomassa recém-crescida, como o das dornas de etanol e da purificação do biogás: devolve ao ar o que a planta tirou pouco antes. Pode ser capturado e usado.',
      en: 'CO₂ from recently grown biomass, such as that from ethanol fermentation and biogas upgrading: it returns to the air what the plant took shortly before. It can be captured and used.',
    },
    padrao: /biog[êe]nic/i,
  },

  // Floresta e uso da terra
  {
    id: 'licor-negro',
    grupo: 'terra',
    termo: { pt: 'Licor negro', en: 'Black liquor' },
    def: {
      pt: 'O caldo escuro que sobra quando a fábrica de celulose cozinha a madeira para separar a fibra. Queimado na caldeira de recuperação, devolve os químicos do processo e gera vapor e eletricidade: é a maior biomassa elétrica do país depois do bagaço.',
      en: 'The dark liquor left when a pulp mill cooks wood to free the fibre. Burnt in the recovery boiler, it returns the process chemicals and makes steam and electricity: the country’s largest source of biomass power after bagasse.',
    },
    padrao: /licor negro|black liquor/i,
  },
  {
    id: 'extrativismo',
    grupo: 'terra',
    termo: { pt: 'Extração vegetal (extrativismo)', en: 'Wild harvesting (extraction)' },
    def: {
      pt: 'O que se colhe da vegetação nativa, sem plantar: açaí da várzea, amêndoa de babaçu, lenha e carvão da mata. O IBGE separa isso da lavoura (PAM) e da floresta plantada (silvicultura).',
      en: 'What is gathered from native vegetation without planting it: floodplain açaí, babassu kernels, firewood and charcoal from the forest. IBGE counts it apart from crops (PAM) and from planted forest (silviculture).',
    },
    padrao: /extra(ç|c)[ãa]o vegetal|extrativis|extra(í|i)d[oa]s? (da|na) mata|wild[- ]harvest|extraction|from (the )?native forest/i,
  },
  {
    id: 'silvicultura',
    grupo: 'terra',
    termo: { pt: 'Silvicultura · floresta plantada', en: 'Silviculture · planted forest' },
    def: {
      pt: 'Floresta cultivada como lavoura, quase toda de eucalipto e pinus, para celulose, carvão, lenha e madeira. O carvão “plantado” das pranchas vem daqui.',
      en: 'Forest grown like a crop, almost all eucalyptus and pine, for pulp, charcoal, firewood and timber. The “planted” charcoal on the plates comes from here.',
    },
    padrao: /silvicultur|floresta plantada|planted forest|plantation|eucalipt|eucalypt/i,
  },
  {
    id: 'carvao',
    grupo: 'terra',
    termo: { pt: 'Carvão vegetal', en: 'Charcoal' },
    def: {
      pt: 'Madeira queimada com pouco ar até virar carbono quase puro; no Brasil, abastece sobretudo a siderurgia de Minas Gerais. Em 1986, quase dois terços vinham da mata nativa; hoje, quase tudo vem de eucalipto plantado.',
      en: 'Wood burnt with little air until it is almost pure carbon; in Brazil it mostly feeds the Minas Gerais steel industry. In 1986 nearly two thirds came from native forest; today almost all comes from planted eucalyptus.',
    },
    padrao: /carv[ãa]o vegetal|charcoal/i,
  },
  {
    id: 'uso-da-terra',
    grupo: 'terra',
    termo: { pt: 'Cobertura e uso da terra', en: 'Land cover and land use' },
    def: {
      pt: 'O que cobre cada pedaço do chão (floresta, pasto, soja, cana, água, cidade), lido de imagens de satélite ano a ano. As pranchas de quarenta anos usam a série do MapBiomas, de 1985 a 2025, somada por município.',
      en: 'What covers each patch of ground (forest, pasture, soy, cane, water, town), read from satellite images year by year. The forty-year plates use MapBiomas’ series, 1985 to 2025, summed by municipality.',
    },
    padrao: /uso da terra|cobertura (e uso )?da terra|land (cover|use)|MapBiomas/i,
  },
  // Política
  {
    id: 'renovabio',
    grupo: 'politica',
    termo: { pt: 'RenovaBio', en: 'RenovaBio' },
    def: {
      pt: 'A Política Nacional de Biocombustíveis (Lei 13.576/2017): fixa metas anuais de descarbonização para as distribuidoras de combustíveis, que as cumprem comprando CBIOs.',
      en: 'Brazil’s National Biofuels Policy (Law 13,576/2017): it sets yearly decarbonisation targets for fuel distributors, which meet them by buying CBIOs.',
    },
    padrao: /RenovaBio/,
  },
  {
    id: 'cbio',
    grupo: 'politica',
    termo: { pt: 'CBIO', en: 'CBIO' },
    def: {
      pt: 'Crédito de Descarbonização: um CBIO equivale a uma tonelada de CO₂ evitada. A usina certificada o emite conforme o volume que vende e a sua nota de eficiência.',
      en: 'Decarbonisation Credit: one CBIO equals one tonne of CO₂ avoided. A certified plant issues them according to the volume it sells and its efficiency score.',
    },
    padrao: /\bCBIOs?\b/,
  },
  {
    id: 'nota',
    grupo: 'politica',
    termo: { pt: 'Nota de eficiência', en: 'Efficiency score' },
    def: {
      pt: 'A Nota de Eficiência Energético-Ambiental do RenovaBio: quanto o biocombustível emite a menos que o fóssil que substitui, em g CO₂eq por MJ. Quanto maior, mais CBIOs por litro.',
      en: 'RenovaBio’s energy-environmental efficiency score: how much less the biofuel emits than the fossil fuel it replaces, in g CO₂eq per MJ. The higher it is, the more CBIOs per litre.',
    },
    padrao: /nota de (efici|carbono)|efficiency score|carbon score/i,
  },
  {
    id: 'sif',
    grupo: 'politica',
    termo: { pt: 'SIF', en: 'SIF (federal inspection)' },
    def: {
      pt: 'Serviço de Inspeção Federal, do Ministério da Agricultura: o selo dos abatedouros e indústrias de origem animal autorizados a vender para outros estados e para fora do país.',
      en: 'Serviço de Inspeção Federal, the Ministry of Agriculture’s federal inspection: the seal of slaughterhouses and animal-product plants allowed to sell to other states and abroad.',
    },
    padrao: /\bSIF\b/,
  },
  {
    id: 'favela',
    grupo: 'politica',
    termo: { pt: 'Favelas e comunidades urbanas', en: 'Favelas and urban communities' },
    def: {
      pt: 'O nome que o IBGE adotou em 2024 no lugar de “aglomerados subnormais”: áreas de moradia popular com insegurança da posse e serviços públicos incompletos.',
      en: 'The name IBGE adopted in 2024 in place of “subnormal agglomerations”: low-income housing areas with insecure tenure and incomplete public services.',
    },
    padrao: /favela/i,
  },

  // Fontes de dados
  {
    id: 'censo',
    grupo: 'fontes',
    termo: { pt: 'Censo 2022', en: '2022 Census' },
    def: {
      pt: 'O recenseamento do IBGE, de casa em casa. Os resultados por setor censitário trazem moradores, idade, renda do responsável, água, esgoto e lixo.',
      en: 'IBGE’s door-to-door count. Results by census tract give residents, age, household-head income, water, sewerage and rubbish.',
    },
    padrao: /Censo|Census/,
  },
  {
    id: 'rais',
    grupo: 'fontes',
    termo: { pt: 'RAIS', en: 'RAIS' },
    def: {
      pt: 'Relação Anual de Informações Sociais, do Ministério do Trabalho: os empregos formais que cada estabelecimento declara, com o município e a atividade econômica (CNAE).',
      en: 'The Labour Ministry’s Annual Social Information Report: the formal jobs each establishment declares, with municipality and economic activity (CNAE).',
    },
    padrao: /\bRAIS\b/,
  },
  {
    id: 'munic',
    grupo: 'fontes',
    termo: { pt: 'MUNIC', en: 'MUNIC' },
    def: {
      pt: 'Pesquisa de Informações Básicas Municipais, do IBGE: um questionário respondido pelas próprias prefeituras sobre como governam, inclusive o lixo.',
      en: 'IBGE’s Survey of Basic Municipal Information: a questionnaire answered by the town halls themselves on how they govern, rubbish included.',
    },
    padrao: /\bMUNIC\b/,
  },
  {
    id: 'anp',
    grupo: 'fontes',
    termo: { pt: 'ANP', en: 'ANP' },
    def: {
      pt: 'Agência Nacional do Petróleo, Gás Natural e Biocombustíveis: autoriza usinas de etanol e biodiesel, acompanha as vendas dos postos e fixa a especificação do biometano.',
      en: 'Brazil’s National Agency of Petroleum, Natural Gas and Biofuels: it licenses ethanol and biodiesel plants, tracks filling-station sales and sets the biomethane specification.',
    },
    padrao: /\bANP\b/,
  },
  {
    id: 'pevs',
    grupo: 'fontes',
    termo: { pt: 'PEVS (IBGE)', en: 'PEVS (IBGE)' },
    def: {
      pt: 'Produção da Extração Vegetal e da Silvicultura: a pesquisa anual do IBGE com o que cada município colhe da mata nativa e da floresta plantada, desde 1986.',
      en: 'Produção da Extração Vegetal e da Silvicultura, IBGE’s yearly survey of what each municipality harvests from native and planted forest, since 1986.',
    },
    padrao: /PEVS/,
  },
  {
    id: 'pam',
    grupo: 'fontes',
    termo: { pt: 'PAM (IBGE)', en: 'PAM (IBGE)' },
    def: {
      pt: 'Produção Agrícola Municipal: área, quantidade e valor de cada lavoura em cada município, ano a ano.',
      en: 'Produção Agrícola Municipal: area, quantity and value of every crop in every municipality, year by year.',
    },
    padrao: /PAM|Produ[çc][ãa]o Agr[íi]cola Municipal/,
  },
  {
    id: 'mapbiomas',
    grupo: 'fontes',
    termo: { pt: 'MapBiomas', en: 'MapBiomas' },
    def: {
      pt: 'Rede de universidades, ONGs e empresas que classifica a cobertura da terra do Brasil inteiro em imagens Landsat, um mapa por ano desde 1985, com dados abertos.',
      en: 'A network of universities, NGOs and companies that classifies land cover across all of Brazil from Landsat images, one map a year since 1985, as open data.',
    },
    padrao: /MapBiomas/,
  },
  {
    id: 'sapcana',
    grupo: 'fontes',
    termo: { pt: 'SAPCana (MAPA)', en: 'SAPCana (MAPA)' },
    def: {
      pt: 'O acompanhamento mensal da produção sucroalcooleira do Ministério da Agricultura: cana moída, açúcar e etanol por estado, acumulados desde o início da safra, em 1º de abril.',
      en: 'The Ministry of Agriculture’s monthly sugar-and-ethanol tracker: cane crushed, sugar and ethanol by state, accumulated from the start of the season on 1 April.',
    },
    padrao: /SAPCana/i,
  },
  {
    id: 'aneel',
    grupo: 'fontes',
    termo: { pt: 'ANEEL', en: 'ANEEL' },
    def: {
      pt: 'Agência Nacional de Energia Elétrica: registra cada usina e cada sistema de geração distribuída, com fonte, potência e município.',
      en: 'Brazil’s National Electricity Agency: it registers every power plant and distributed-generation system, with source, capacity and municipality.',
    },
    padrao: /\bANEEL\b/,
  },
];

/** Os termos do glossário que aparecem no texto da prancha, na ordem do glossário. */
export function termosDaPrancha(m: Mapa): Termo[] {
  const d = m.data;
  const texto = [d.titulo, d.subtitulo, d.contexto, d.metodo, d.imagem_alt].filter(Boolean).join(' \n ');
  return GLOSSARIO.filter((t) => t.padrao.test(texto));
}

/* ---------- Leitura da prancha --------------------------------------------- */

/** A projeção em que a prancha foi desenhada, quando a descrição da imagem a nomeia. */
export function projecaoDaPrancha(m: Mapa): 'albers' | 'mercator' | undefined {
  const alt = m.original.imagem_alt;
  if (/Albers/.test(alt)) return 'albers';
  if (/Mercator/.test(alt)) return 'mercator';
  return undefined;
}

/** Primeira frase de um parágrafo, cortada com reticências se passar do limite. */
export function primeiraFrase(texto: string, max = 180): string {
  const limpo = texto.trim().replace(/\s+/g, ' ');
  // Fim de frase: ponto seguido de espaço e maiúscula (ignora "1,6 mil." no meio de números e siglas como "S.A.").
  const m = limpo.match(/^(.+?[.!?])\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ«“"])/);
  const frase = m ? m[1] : limpo;
  if (frase.length <= max) return frase;
  const corte = frase.slice(0, max);
  return `${corte.slice(0, corte.lastIndexOf(' ')).replace(/[,;:]$/, '')}…`;
}

/* ---------- Perguntas de entrada ------------------------------------------- */

export interface Pergunta {
  id: string;
  pergunta: Bilingue;
  /** Coleções que respondem, na ordem de leitura sugerida. */
  colecoes: ColecaoId[];
}

export const PERGUNTAS: Pergunta[] = [
  {
    id: 'lixo',
    pergunta: { pt: 'Para onde vai o lixo e o esgoto?', en: 'Where do rubbish and sewage go?' },
    colecoes: ['lixo-sp', 'saneamento-sp', 'residuo-organico-br'],
  },
  {
    id: 'biocombustivel',
    pergunta: { pt: 'Quem faz o biocombustível do Brasil?', en: 'Who makes Brazil’s biofuel?' },
    colecoes: ['etanol-br', 'biodiesel-br', 'renovabio-br', 'sapcana-br'],
  },
  {
    id: 'biometano',
    pergunta: { pt: 'Quanto biometano São Paulo poderia fazer?', en: 'How much biomethane could São Paulo make?' },
    colecoes: ['biogas-territorio-sp', 'bioenergia-sp'],
  },
  {
    id: 'eletricidade',
    pergunta: { pt: 'De onde vem a eletricidade?', en: 'Where does the electricity come from?' },
    colecoes: ['energia-eletrica', 'ritmo-biomassa-br', 'combustivel-biomassa-br', 'gd-biogas-br', 'energia-municipal-sp'],
  },
  {
    id: 'campo',
    pergunta: { pt: 'O que o campo produz e o que sobra dele?', en: 'What does the countryside produce, and what is left over?' },
    colecoes: ['agro-sp', 'biomassa-br', 'animal-sp', 'abate-br', 'nutrientes-sp'],
  },
  {
    id: 'terra',
    pergunta: { pt: 'O que a mata e a lavoura deram em quarenta anos?', en: 'What have forest and farmland yielded over forty years?' },
    colecoes: ['quarenta-anos-de-biomassa-br', 'biomassa-da-mata-br'],
  },
  {
    id: 'gente',
    pergunta: { pt: 'Onde e como vive a gente?', en: 'Where and how do people live?' },
    colecoes: ['gente-sp', 'favelas-sp', 'renda-solar-sp'],
  },
  {
    id: 'fumaca',
    pergunta: { pt: 'O que vira fumaça e carbono?', en: 'What goes up in smoke and carbon?' },
    colecoes: ['fogo-sp', 'carbono-sp', 'bioenergia-cruzada-sp'],
  },
  {
    id: 'chao',
    pergunta: { pt: 'Como é o chão em que tudo isso acontece?', en: 'What is the ground beneath all this like?' },
    colecoes: ['relevo', 'agua-sp', 'rmc', 'brasil-estado-por-estado', 'bioeconomia-sp'],
  },
];

/* ---------- Mapa dos mapas ------------------------------------------------ */

/** Sigla da UF no fim do recorte em português: "Estado do Acre (AC)" → AC. */
export function ufDoRecorte(recorte: string): string | undefined {
  return recorte.trim().match(/\(([A-Z]{2})\)/)?.[1];
}

/**
 * Caixas aproximadas (oeste, sul, leste, norte, em graus) dos recortes menores que o estado de SP,
 * para a lupa do mapa dos mapas. Recorte novo dentro de SP → uma linha aqui; sem caixa, ele fica só
 * na lista. Um município vira ponto.
 */
export const CAIXAS_SP: { padrao: RegExp; caixa: [number, number, number, number]; ponto?: boolean }[] = [
  { padrao: /^Município de Campinas/, caixa: [-47.06, -22.9, -47.06, -22.9], ponto: true },
  { padrao: /^Região Metropolitana de Campinas/, caixa: [-47.6, -23.2, -46.65, -22.5] },
  { padrao: /^Concentrações urbanas de São Paulo e de Santos/, caixa: [-47.2, -24.1, -45.9, -23.15] },
  { padrao: /^Grande São Paulo e Baixada Santista/, caixa: [-47.25, -24.3, -45.7, -23.05] },
  { padrao: /^Baixada Santista, Serra do Mar/, caixa: [-46.8, -24.15, -45.95, -23.4] },
  { padrao: /^Vale do Paraíba/, caixa: [-45.75, -23.35, -44.55, -22.35] },
  { padrao: /^Centro do estado de São Paulo/, caixa: [-48.7, -23.0, -47.6, -21.9] },
];
