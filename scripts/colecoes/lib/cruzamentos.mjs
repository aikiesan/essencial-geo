/**
 * Coleções de cruzamentos (Censo 2022 × energia) — bases comuns em Node (uso interno).
 *
 *   malhaMunicipios()   645 municípios de SP (IBGE, Malha Municipal 2025), para os GeoPackages
 *   baseSp()            regiões intermediárias e limite (scripts/estados/cache/sp.json)
 *   cp2b()              potencial de biometano CP2B v5.1 por município e substrato (cenário de referência, nível N4)
 *   sidraMun(t)         tabela do SIDRA baixada em dados-brutos/ibge/sidra-sp (JSON da API), por município
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { RAIZ, BRUTOS, lerShp, lerCsv, simplificar } from './dados.mjs';
import { estiloContorno } from './estilos-qgis.mjs';

export const DADOS_CP2B = 'A:/Pilar-2b-cp2b/cp2b-workspace/NewLook/backend/data';
export const SP = JSON.parse(readFileSync(join(RAIZ, 'scripts', 'estados', 'cache', 'sp.json'), 'utf8'));
export const NOME_MUN = new Map(SP.municipios.features.map((f) => [f.properties.CD_MUN, f.properties.NM_MUN]));
export const RGINT_MUN = new Map(SP.municipios.features.map((f) => [f.properties.CD_MUN, f.properties.CD_RGINT]));
export const NOME_RGINT = new Map(SP.rgint.features.map((f) => [f.properties.CD_RGINT, f.properties.NM_RGINT]));

let malha = null;
/** Municípios de SP da Malha Municipal 2025 (simplificados a ~20 m), com CD_MUN, NM_MUN, AREA_KM2. */
export function malhaMunicipios(tol = 0.0002) {
  if (!malha) {
    malha = lerShp(join(DADOS_CP2B, 'shapefiles', 'BR_Municipios_2025.shp'), (p) => String(p.CD_MUN).startsWith('35'))
      .map((f) => ({ ...f, geometry: simplificar(f.geometry, tol) }));
  }
  return malha;
}

/** Camadas de referência para os GeoPackages, com estilo: regiões intermediárias e limite estadual. */
export function camadasReferencia(en = false) {
  const camadas = {
    regioes_intermediarias: { feats: SP.rgint.features, campos: ['CD_RGINT', 'NM_RGINT'] },
    limite_estadual: { feats: SP.limite.features.map((f) => ({ ...f, properties: { SIGLA_UF: 'SP', NM_UF: 'São Paulo' } })), campos: ['SIGLA_UF', 'NM_UF'] },
  };
  const estilos = {
    regioes_intermediarias: [['regioes', en ? 'Intermediate regions' : 'Regiões intermediárias', estiloContorno('#1a211a', 0.5, { rotuloCampo: 'NM_RGINT' })]],
    limite_estadual: [['limite', en ? 'State boundary' : 'Limite estadual', estiloContorno('#1a1c1e', 0.9)]],
  };
  return { camadas, estilos };
}

/* ------------------------------------------------------------------ CP2B */
export const GRUPO_SUBSTRATO = {
  PALHA: 'cana', BAGACO: 'cana', TORTA_FILTRO: 'cana', VINHACA: 'cana',
  PALHA_MILHO: 'lavouras', PALHA_SOJA: 'lavouras', BAGACO_CITROS: 'lavouras', CASCA_CAFE: 'lavouras',
  AVES_CORTE: 'pecuaria', AVES_POSTURA: 'pecuaria', BOV_LEITE: 'pecuaria', BOV_CONFINADO: 'pecuaria', BOV_PASTO_MISTO: 'pecuaria', SUINOS: 'pecuaria',
  RSU_ORGANICO: 'urbano', LODO_ETE: 'urbano', PODA_URBANA: 'urbano',
};

/**
 * Biometano CP2B v5.1, cenário de referência ("med"), nível N4 (acessível), em m³ por dia:
 * Map(CD_MUN → { substrato: m³/dia, ..., total, cana, lavouras, pecuaria, urbano }).
 */
export async function cp2b() {
  const arq = join(DADOS_CP2B, 'raw', 'cp2b_potential', '2026', 'cp2b_municipio_substrato_niveis.csv');
  const linhas = await lerCsv(arq, { sep: ',' });
  const out = new Map();
  let versao = null;
  for (const l of linhas) {
    if (l.scenario !== 'med' || !String(l.ibge_code).startsWith('35')) continue;
    versao ??= l.method_version;
    const cd = String(l.ibge_code);
    if (!out.has(cd)) out.set(cd, { total: 0, cana: 0, lavouras: 0, pecuaria: 0, urbano: 0 });
    const o = out.get(cd);
    const v = Number(l.n4_biomethane_eq_nm3_year) / 365;
    o[l.substrate] = (o[l.substrate] ?? 0) + v;
    o.total += v;
    const g = GRUPO_SUBSTRATO[l.substrate];
    if (!g) throw new Error(`substrato sem grupo: ${l.substrate}`);
    o[g] += v;
  }
  out.versao = versao;
  return out;
}

/* ------------------------------------------------------------------ SIDRA */
/** Tabela do SIDRA (JSON da API) → Map(CD_MUN → { categoria: valor | null }), com a coluna de categoria `col` (ex.: 'D4N'). */
export function sidraMun(arquivo, col = 'D4N', { chave = 'D1C' } = {}) {
  const arq = join(BRUTOS, 'ibge', 'sidra-sp', arquivo);
  if (!existsSync(arq)) throw new Error(`falta ${arq}`);
  const d = JSON.parse(readFileSync(arq, 'utf8')).slice(1);
  const out = new Map();
  for (const r of d) {
    const cd = r[chave];
    if (!out.has(cd)) out.set(cd, {});
    const v = r.V;
    // "-" = zero absoluto; "X" e "..." = sem informação.
    out.get(cd)[r[col]] = v === '-' ? 0 : /^-?[\d.]+$/.test(v) ? Number(v) : null;
  }
  return out;
}
