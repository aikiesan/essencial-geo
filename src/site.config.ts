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
  'uso-do-solo',
  'censo-renda',
  'altimetria-relevo',
  'infraestrutura-dxf',
  'hidrografia',
  'biomas',
  'energia',
] as const;
export type CategoriaId = (typeof CATEGORIA_IDS)[number];

/** Formatos de download aceitos. Rótulos dos botões: src/i18n/ui.ts. */
export const FORMATOS = {
  gpkg: { sigla: 'GPKG', ext: '.gpkg' },
  dxf: { sigla: 'DXF', ext: '.dxf' },
  pdf: { sigla: 'PDF', ext: '.pdf' },
  png: { sigla: 'PNG', ext: '.png' },
  csv: { sigla: 'CSV', ext: '.csv' },
  tif: { sigla: 'TIF', ext: '.tif' },
  qgz: { sigla: 'QGZ', ext: '.qgz' },
  r: { sigla: 'R', ext: '.R' },
} as const;

export type FormatoId = keyof typeof FORMATOS;
export const FORMATO_IDS = Object.keys(FORMATOS) as [FormatoId, ...FormatoId[]];
