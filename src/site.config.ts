/**
 * Configuração central do Essencial Geo.
 * Tudo que é identidade, autoria e links vive aqui — os componentes só leem.
 * Itens marcados com TODO precisam ser preenchidos antes do primeiro deploy.
 */

export const SITE = {
  nome: 'Essencial Geo',
  slogan: 'O essencial é invisível aos olhos',
  complemento: '— até ser traduzido em um mapa.',
  descricao:
    'Feed cartográfico, repositório de dados abertos e portfólio contínuo de mapas temáticos do Brasil. Bases vetoriais em GeoPackage e DXF, citáveis com DOI.',
  idioma: 'pt-BR',
  frequencia: 'Um mapa novo a cada dois dias',
  cadencia: '1 mapa / 2 dias',
  licenca: {
    nome: 'CC BY 4.0',
    url: 'https://creativecommons.org/licenses/by/4.0/deed.pt-br',
  },
  repositorio: 'https://github.com/aikiesan/essencial-geo',
};

/** Autoria padrão — usada nas citações ABNT/BibTeX e no Zenodo. */
export const AUTORIA = {
  // TODO: preencha com seu nome no formato de citação.
  sobrenome: 'Sobrenome', // a citação ABNT converte para caixa alta
  nome: 'Nome',
  orcid: '', // ex.: '0000-0000-0000-0000'
  afiliacao: 'Universidade Estadual de Campinas (UNICAMP)',
};

export const LINKS = {
  // TODO: substitua pelos seus endereços reais.
  lattes: 'https://lattes.cnpq.br/',
  orcid: 'https://orcid.org/',
  zenodo: 'https://zenodo.org/communities/essencial-geo',
  github: 'https://github.com/aikiesan/essencial-geo',
  reddit: {
    MapPorn: 'https://www.reddit.com/r/MapPorn/',
    dataisbeautiful: 'https://www.reddit.com/r/dataisbeautiful/',
  },
};

/**
 * Categorias do atlas. A chave é o valor usado no campo `categoria` de cada mapa.
 * A ordem aqui é a ordem da barra lateral.
 */
export const CATEGORIAS = {
  'uso-do-solo': { rotulo: 'Uso do Solo', curto: 'Uso do solo' },
  'censo-renda': { rotulo: 'Censo / Renda', curto: 'Censo · renda' },
  'altimetria-relevo': { rotulo: 'Altimetria / Relevo', curto: 'Altimetria · relevo' },
  'infraestrutura-dxf': { rotulo: 'Infraestrutura / DXF', curto: 'Infraestrutura · DXF' },
  'hidrografia': { rotulo: 'Hidrografia / Bacias', curto: 'Hidrografia' },
  'biomas': { rotulo: 'Biomas / Ambiente', curto: 'Biomas' },
} as const;

export type CategoriaId = keyof typeof CATEGORIAS;
export const CATEGORIA_IDS = Object.keys(CATEGORIAS) as [CategoriaId, ...CategoriaId[]];

/** Formatos de download aceitos e como aparecem nos botões. */
export const FORMATOS = {
  gpkg: { sigla: 'GPKG', rotulo: 'GeoPackage', ext: '.gpkg' },
  dxf: { sigla: 'DXF', rotulo: 'AutoCAD / Illustrator', ext: '.dxf' },
  pdf: { sigla: 'PDF', rotulo: 'Prancha vetorial', ext: '.pdf' },
  png: { sigla: 'PNG', rotulo: 'Prancha 300 dpi', ext: '.png' },
  csv: { sigla: 'CSV', rotulo: 'Tabela de atributos', ext: '.csv' },
  tif: { sigla: 'TIF', rotulo: 'GeoTIFF', ext: '.tif' },
  qgz: { sigla: 'QGZ', rotulo: 'Projeto QGIS', ext: '.qgz' },
  r: { sigla: 'R', rotulo: 'Script R', ext: '.R' },
} as const;

export type FormatoId = keyof typeof FORMATOS;
export const FORMATO_IDS = Object.keys(FORMATOS) as [FormatoId, ...FormatoId[]];
