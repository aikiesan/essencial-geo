/**
 * Coleções de cruzamentos (Censo 2022 × energia) — bases comuns em Node (uso interno).
 *
 *   malhaMunicipios()   645 municípios de SP (IBGE, Malha Municipal 2025), para os GeoPackages
 *   baseSp()            regiões intermediárias e limite (scripts/estados/cache/sp.json)
 *   cp2b()              potencial de biometano CP2B v5.1 por município e substrato (cenário de referência, nível N4)
 *   sidraMun(t)         tabela do SIDRA baixada em dados-brutos/ibge/sidra-sp (JSON da API), por município
 */
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
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

/* ------------------------------------------------------------------ recorte regional */
const ASPECTO = 1640 / 1664; // quadro do mapa no layout de um mapa (largura / altura)
/**
 * Base de um recorte regional para usarRegiao() da prancha, sem união de polígonos: uma janela com a
 * proporção do quadro em volta dos municípios `cds`. Entram inteiros os municípios paulistas que tocam a
 * janela (o SVG os recorta no quadro); o limite é o do estado, e o localizador marca a janela.
 * Grava cache/<nome>-base.json.
 */
export function baseJanela(nome, sigla, cds, { capital = SP.capital, oceano = null, passo = 0.25, folga = 0.1, rotulos = [] } = {}) {
  const malha = malhaMunicipios();
  const alvo = new Set(cds);
  let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity];
  const visita = (c) => { if (typeof c[0] === 'number') { x0 = Math.min(x0, c[0]); y0 = Math.min(y0, c[1]); x1 = Math.max(x1, c[0]); y1 = Math.max(y1, c[1]); } else c.forEach(visita); };
  for (const f of malha) if (alvo.has(String(f.properties.CD_MUN))) visita(f.geometry.coordinates);
  const lon0 = Math.round(((x0 + x1) / 2) * 100) / 100, lat0 = Math.round(((y0 + y1) / 2) * 100) / 100;
  const kx = 111.32 * Math.cos((lat0 * Math.PI) / 180), ky = 110.57;
  const hKm = Math.max((y1 - y0) * ky, ((x1 - x0) * kx) / ASPECTO) * (1 + folga);
  const dy = hKm / ky / 2, dx = (hKm * ASPECTO) / kx / 2;
  const [a0, b0, a1, b1] = [lon0 - dx, lat0 - dy, lon0 + dx, lat0 + dy];
  const arr = (c) => (typeof c === 'number' ? Math.round(c * 1e5) / 1e5 : c.map(arr));
  // Anel no sentido horário, como o d3 espera (senão o quadro vira o mundo menos a caixa).
  const caixaFc = { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[a0, b0], [a0, b1], [a1, b1], [a1, b0], [a0, b0]].map(arr)] } }] };
  const toca = (g) => {
    let [p0, q0, p1, q1] = [Infinity, Infinity, -Infinity, -Infinity];
    const v = (c) => { if (typeof c[0] === 'number') { p0 = Math.min(p0, c[0]); q0 = Math.min(q0, c[1]); p1 = Math.max(p1, c[0]); q1 = Math.max(q1, c[1]); } else c.forEach(v); };
    v(g.coordinates);
    return p1 > a0 - 0.05 && p0 < a1 + 0.05 && q1 > b0 - 0.05 && q0 < b1 + 0.05;
  };
  const unidades = malha.filter((f) => toca(f.geometry)).map((f) => ({ type: 'Feature', properties: { CD_MUN: String(f.properties.CD_MUN), NM_MUN: f.properties.NM_MUN }, geometry: { type: f.geometry.type, coordinates: arr(f.geometry.coordinates) } }));
  const passos = (v0, v1) => [Math.floor(v0 / passo) * passo, Math.ceil(v1 / passo) * passo, passo];
  const obj = {
    sigla, centro: [lon0, lat0],
    unidades: { type: 'FeatureCollection', features: unidades },
    limite: SP.limite,
    vizinhos: { type: 'FeatureCollection', features: SP.vizinhos.features.filter((v) => v.properties.SIGLA_UF !== 'SP') },
    rotulos, rotulosUnidades: [], oceano, capital,
    grat: { passo, extensao: [[a0 - 2, b0 - 2], [a1 + 2, b1 + 2]] },
    bordas: { lon: passos(a0, a1), lat: passos(b0, b1) },
    enquadrar: caixaFc, alvoLoc: caixaFc, janela: [a0, b0, a1, b1],
  };
  writeFileSync(join(RAIZ, 'scripts', 'colecoes', 'cache', `${nome}-base.json`), JSON.stringify(obj));
  return obj;
}
