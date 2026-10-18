/**
 * Configuração central do Essencial Geo.
 * Tudo que é identidade, autoria e links vive aqui — os componentes só leem.
 * Itens marcados com TODO precisam ser preenchidos antes do primeiro deploy.
 */

export const SITE = {
  nome: 'Essencial Geo',
  licenca: {
    nome: 'CC BY 4.0',
    url: { pt: 'https://creativecommons.org/licenses/by/4.0/deed.pt-br', en: 'https://creativecommons.org/licenses/by/4.0/deed.en' },
  },
  repositorio: 'https://github.com/aikiesan/essencial-geo',
  /** Hora (UTC) em que um mapa agendado entra no ar no dia da sua data: 12h UTC = 9h em Brasília. */
  horaPublicacaoUtc: 12,
  /** Códigos de verificação de propriedade (só o valor de content="…"). Vazio = sem etiqueta. */
  verificacao: {
    google: '6AO0_cB4UqZfjnteowBYa91HsgxbVIKEzjuA9TSsPCQ', // Google Search Console → etiqueta HTML
    bing: '', // Bing Webmaster Tools → etiqueta HTML
  },
};
// Slogan, descrição e demais textos da interface: src/i18n/ui.ts (PT-BR e EN-UK).

/** Autoria padrão — usada nas citações ABNT/BibTeX e no Zenodo. */
export const AUTORIA = {
  sobrenome: 'Cerejo', // a citação ABNT converte para caixa alta
  nome: 'Lucas Nakamura',
  orcid: '0000-0002-9292-2752',
  afiliacao: 'Núcleo Interdisciplinar de Planejamento Energético (NIPE), Universidade Estadual de Campinas (UNICAMP)',
  afiliacaoEn: 'Interdisciplinary Center for Energy Planning (NIPE), University of Campinas (UNICAMP)',
};

/** Apresentação do autor (página Sobre / About). */
export const AUTOR = {
  nomeCompleto: 'Lucas Nakamura Cerejo',
  pt: {
    funcao: 'Pós-doutorando no NIPE/UNICAMP · Coordenador do Eixo 1 do CP2b',
    bio: [
      'Arquiteto e urbanista, mestre e doutor em Arquitetura e Urbanismo pela PUC-Campinas, com doutorado-sanduíche no Korea Research Institute for Human Settlements (KRIHS), na Coreia do Sul.',
      'É pós-doutorando no Núcleo Interdisciplinar de Planejamento Energético da UNICAMP, com bolsa FAPESP, e coordena o Eixo 1 do CP2b — Inventário de Resíduos e Mapeamento de Tecnologias —, onde desenvolve a plataforma geoespacial PILAR-2b, que integra dados territoriais, sensoriamento remoto e geoprocessamento para mapear resíduos de biomassa e estimar potenciais de biogás e bioenergia.',
    ],
    areas: [
      'Mapeamento geoespacial de resíduos de biomassa e estimativa do potencial de biogás e bioenergia',
      'Sistemas de informação geográfica, sensoriamento remoto e análise espacial aplicada a cadeias agroindustriais',
      'Plataformas de dados territoriais, planejamento energético e apoio à localização de recursos para energias renováveis',
    ],
  },
  en: {
    funcao: 'Postdoctoral researcher, NIPE/UNICAMP · Coordinator of CP2b Axis 1',
    bio: [
      'Architect and urban planner, with a master’s degree and a PhD in Architecture and Urbanism from PUC-Campinas, including a doctoral research stay at the Korea Research Institute for Human Settlements (KRIHS), South Korea.',
      'A FAPESP-funded postdoctoral researcher at UNICAMP’s Interdisciplinary Center for Energy Planning (NIPE), Lucas coordinates Axis 1 of CP2b — Waste Inventory and Technology Mapping — developing the PILAR-2b geospatial platform, which brings together territorial data, remote sensing and geoprocessing to map biomass residues and estimate biogas and bioenergy potential.',
    ],
    areas: [
      'Geospatial mapping of biomass residues and estimation of biogas and bioenergy potential',
      'Geographic information systems, remote sensing and spatial analysis applied to agro-industrial supply chains',
      'Territorial data platforms, energy planning and siting support for renewable energy resources',
    ],
  },
};

export const LINKS = {
  lattes: 'http://lattes.cnpq.br/9131453561416650',
  orcid: 'https://orcid.org/0000-0002-9292-2752',
  scholar: 'https://scholar.google.com/citations?user=AhFVjwkAAAAJ',
  fapesp: 'https://bv.fapesp.br/pt/pesquisador/741698/lucas-nakamura-cerejo/',
  unicamp: 'https://portal.dados.unicamp.br/perfil?origem=&docente=330455',
  zenodo: 'https://zenodo.org/communities/essencial-geo',
  github: 'https://github.com/aikiesan/essencial-geo',
  reddit: {
    MapPorn: 'https://www.reddit.com/r/MapPorn/',
    dataisbeautiful: 'https://www.reddit.com/r/dataisbeautiful/',
  },
};

/**
 * Categorias do atlas. A chave é o valor usado no campo `categoria` de cada mapa
 * e a ordem aqui é a ordem da barra lateral. Rótulos nas duas línguas: src/i18n/ui.ts.
 */
export const CATEGORIA_IDS = [
  'divisao-territorial',
  'uso-do-solo',
  'censo-renda',
  'altimetria-relevo',
  'infraestrutura-dxf',
  'hidrografia',
  'biomas',
  'energia',
] as const;
export type CategoriaId = (typeof CATEGORIA_IDS)[number];

/**
 * Coleções: séries de pranchas sobre um mesmo tema, lidas em ordem. Cada mapa
 * aponta para a sua no campo `colecao` do README.md. A ordem aqui é a ordem da
 * página de coleções e da barra lateral; uma coleção só aparece quando tem mapa no ar.
 */
export const COLECOES = {
  'brasil-estado-por-estado': {
    pt: {
      titulo: 'Brasil, estado por estado',
      resumo: 'Uma base cartográfica de cada unidade da federação — municípios, regiões geográficas, limite e rodovias —, todas com o mesmo desenho e os mesmos arquivos.',
    },
    en: {
      titulo: 'Brazil, state by state',
      resumo: 'A cartographic base for each federative unit — municipalities, geographic regions, boundary and highways — all with the same design and the same files.',
    },
  },
  'bioenergia-sp': {
    pt: {
      titulo: 'Bioenergia em São Paulo',
      resumo: 'Usinas de biogás, rebanhos, cana-de-açúcar e usinas sucroenergéticas: onde estão os resíduos que podem virar energia no estado.',
    },
    en: {
      titulo: 'Bioenergy in São Paulo',
      resumo: 'Biogas plants, livestock, sugarcane and sugar-energy mills: where the residues that can become energy are found across the state.',
    },
  },
  rmc: {
    pt: {
      titulo: 'Região Metropolitana de Campinas',
      resumo: 'Uso da terra, domicílios, renda e água na região onde este atlas é composto.',
    },
    en: {
      titulo: 'Campinas Metropolitan Region',
      resumo: 'Land use, households, income and water in the region where this atlas is made.',
    },
  },
  'agua-sp': {
    pt: {
      titulo: 'Água em São Paulo',
      resumo: 'Bacias hidrográficas, rede de drenagem e unidades de conservação: o caminho da água no estado.',
    },
    en: {
      titulo: 'Water in São Paulo',
      resumo: 'River basins, the drainage network and protected areas: the path of water across the state.',
    },
  },
  relevo: {
    pt: {
      titulo: 'Relevo paulista',
      resumo: 'Serra da Mantiqueira, Serra do Mar e cuestas, em hipsometria e sombreamento.',
    },
    en: {
      titulo: 'The relief of São Paulo',
      resumo: 'The Mantiqueira range, the Serra do Mar and the cuestas, in hypsometric tints and hillshade.',
    },
  },
  'energia-eletrica': {
    pt: {
      titulo: 'Energia elétrica no Brasil',
      resumo: 'Linhas de transmissão e subestações, usinas por fonte e geração solar distribuída por município.',
    },
    en: {
      titulo: 'Electricity in Brazil',
      resumo: 'Transmission lines and substations, power plants by source and distributed solar generation by municipality.',
    },
  },
  'agro-sp': {
    pt: {
      titulo: 'Do campo ao biometano',
      resumo: 'O mosaico agrícola paulista (cana, laranja, milho e soja), o lixo e o esgoto das cidades e o biometano que pode sair de tudo isso.',
    },
    en: {
      titulo: 'From field to biomethane',
      resumo: 'São Paulo’s farming mosaic (sugarcane, oranges, maize and soy), urban waste and sewage, and the biomethane that could come from all of it.',
    },
  },
  'saneamento-sp': {
    pt: {
      titulo: 'Saneamento e biometano',
      resumo: 'O esgoto e o lixo de São Paulo setor por setor no Censo 2022: quem está na rede, para onde vai o resto, onde o lixo queima e quanto biometano o lodo daria.',
    },
    en: {
      titulo: 'Sanitation and biomethane',
      resumo: 'São Paulo’s sewage and rubbish tract by tract in the 2022 Census: who is on the mains, where the rest goes, where rubbish burns and how much biomethane sludge could yield.',
    },
  },
  'biogas-territorio-sp': {
    pt: {
      titulo: 'Biogás no território',
      resumo: 'O potencial de biometano de São Paulo no chão: por km² e por pessoa, a fonte que lidera fora da cana, a distância aos gasodutos e à rede elétrica e o que já opera.',
    },
    en: {
      titulo: 'Biogas on the ground',
      resumo: 'São Paulo’s biomethane potential on the ground: per km² and per person, the leading source outside sugarcane, the distance to gas pipelines and the power grid, and what already operates.',
    },
  },
  'renda-solar-sp': {
    pt: {
      titulo: 'Renda e sol nos telhados',
      resumo: 'Quanto ganha quem responde pela casa, setor por setor e na metrópole, e se os sistemas solares dos telhados seguem a renda: não seguem.',
    },
    en: {
      titulo: 'Income and rooftop solar',
      resumo: 'What the head of household earns, tract by tract and in the metropolis, and whether rooftop solar follows income: it does not.',
    },
  },
  'gente-sp': {
    pt: {
      titulo: 'Gente no território',
      resumo: 'Onde mora a gente de São Paulo, setor por setor: a densidade, a idade e o sexo de cada município, os de 60 anos ou mais e quem ainda vive no campo.',
    },
    en: {
      titulo: 'People across the land',
      resumo: 'Where São Paulo’s people live, tract by tract: density, the age and sex of each municipality, those aged 60 or over and who still lives in the countryside.',
    },
  },
  'animal-sp': {
    pt: {
      titulo: 'Leite, ovos, mel e peixe',
      resumo: 'O que os animais produzem em São Paulo, município a município: os ovos de Bastos, o leite, o mel, a tilápia das represas e quanto vale cada um.',
    },
    en: {
      titulo: 'Milk, eggs, honey and fish',
      resumo: 'What animals produce in São Paulo, municipality by municipality: the eggs of Bastos, milk, honey, tilapia from the reservoirs and what each is worth.',
    },
  },
} as const;
export type ColecaoId = keyof typeof COLECOES;
export const COLECAO_IDS = Object.keys(COLECOES) as [ColecaoId, ...ColecaoId[]];

/** Formatos de download aceitos. Rótulos dos botões: src/i18n/ui.ts. */
export const FORMATOS = {
  gpkg: { sigla: 'GPKG', ext: '.gpkg' },
  dxf: { sigla: 'DXF', ext: '.dxf' },
  pdf: { sigla: 'PDF', ext: '.pdf' },
  svg: { sigla: 'SVG', ext: '.svg' },
  png: { sigla: 'PNG', ext: '.png' },
  csv: { sigla: 'CSV', ext: '.csv' },
  tif: { sigla: 'TIF', ext: '.tif' },
  qgz: { sigla: 'QGZ', ext: '.qgz' },
  r: { sigla: 'R', ext: '.R' },
} as const;

export type FormatoId = keyof typeof FORMATOS;
export const FORMATO_IDS = Object.keys(FORMATOS) as [FormatoId, ...FormatoId[]];
