/**
 * Estilos do QGIS (QML) para a tabela layer_styles dos GeoPackages — os mesmos de scripts/colecoes/comum.py,
 * em Node (uso interno). Quem abre o GPKG no QGIS vê cada camada desenhada como na prancha.
 */
const TINTA = '#1a1c1e';
const PAPEL = '#ffffff';
const SERIF = 'Georgia';
const SANS = 'Arial';
export const ZERO = '#eef0f1';
export const SEM_INFO = '#ffffff';
const GEOM = { ponto: 0, linha: 1, poligono: 2 };

const attr = (s) => `"${String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')}"`;
/** Escapa um filtro do QGIS para dentro de um atributo XML (aspas, <, >, &). */
export const xml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function rgba(hexa, alfa = 1) {
  const h = hexa.replace('#', '');
  return `${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${Math.round(alfa * 255)}`;
}

/** Propriedades nos dois formatos: <Option> (QGIS ≥ 3.26) e <prop> (anteriores). */
function props(d) {
  const op = Object.entries(d).map(([k, v]) => `<Option name=${attr(k)} value=${attr(v)} type="QString"/>`).join('');
  const an = Object.entries(d).map(([k, v]) => `<prop k=${attr(k)} v=${attr(v)}/>`).join('');
  return `<Option type="Map">${op}</Option>${an}`;
}

export function preenchimento(cor, borda, largura, alfaBorda = 1) {
  return `<layer class="SimpleFill" enabled="1" locked="0" pass="0">${props({
    color: cor ? rgba(cor) : '0,0,0,0', style: cor ? 'solid' : 'no', outline_color: rgba(borda, alfaBorda),
    outline_style: largura ? 'solid' : 'no', outline_width: largura, outline_width_unit: 'MM', joinstyle: 'round',
  })}</layer>`;
}

/** Hachura (linhas a 45°) como na prancha, para "sem informação". */
export function hachura(cor = '#aeb4ba', fundo = PAPEL) {
  const linha = `<symbol type="line" name="@0@1" alpha="1" clip_to_extent="1" force_rhr="0"><layer class="SimpleLine" enabled="1" locked="0" pass="0">${props({
    line_color: rgba(cor), line_width: 0.2, line_width_unit: 'MM', line_style: 'solid', capstyle: 'square', joinstyle: 'bevel', use_custom_dash: 0,
  })}</layer></symbol>`;
  return `${preenchimento(fundo, PAPEL, 0)}<layer class="LinePatternFill" enabled="1" locked="0" pass="0">${props({
    angle: 45, distance: 1.2, distance_unit: 'MM', line_width: 0.2, line_width_unit: 'MM', color: rgba(cor),
  })}${linha}</layer>`;
}

export function linha(cor, largura, tracejado = null, passe = 0) {
  const d = { line_color: rgba(cor), line_width: largura, line_width_unit: 'MM', line_style: 'solid', capstyle: 'round', joinstyle: 'round', use_custom_dash: 0 };
  if (tracejado) Object.assign(d, { use_custom_dash: 1, customdash: tracejado, customdash_unit: 'MM', capstyle: 'flat' });
  return `<layer class="SimpleLine" enabled="1" locked="0" pass="${passe}">${props(d)}</layer>`;
}

function tamanhoPorExpressao(expr) {
  return '<data_defined_properties><Option type="Map"><Option name="name" value="" type="QString"/>'
    + '<Option name="properties" type="Map"><Option name="size" type="Map"><Option name="active" value="true" type="bool"/>'
    + `<Option name="expression" value=${attr(expr)} type="QString"/><Option name="type" value="3" type="int"/></Option></Option>`
    + '<Option name="type" value="collection" type="QString"/></Option></data_defined_properties>';
}

/** Marcador simples (mm). `tamanhoExpr`: expressão do QGIS para o diâmetro (círculos proporcionais). */
export function marcador(cor, tamanho, { borda = PAPEL, larguraBorda = 0.25, forma = 'circle', vazado = false, alfa = 0.9, tamanhoExpr = null } = {}) {
  const d = {
    name: forma, color: vazado ? '0,0,0,0' : rgba(cor, alfa), outline_color: rgba(vazado ? cor : borda), outline_width: vazado ? 0.5 : larguraBorda,
    outline_width_unit: 'MM', outline_style: 'solid', size: tamanho, size_unit: 'MM', joinstyle: 'round', angle: 0,
    vertical_anchor_point: 1, horizontal_anchor_point: 1, scale_method: 'diameter',
  };
  return `<layer class="SimpleMarker" enabled="1" locked="0" pass="0">${props(d)}${tamanhoExpr ? tamanhoPorExpressao(tamanhoExpr) : ''}</layer>`;
}

const simbolo = (tipo, nome, camadas, alfa = 1) => `<symbol type="${tipo}" name="${nome}" alpha="${alfa}" clip_to_extent="1" force_rhr="0">${camadas}</symbol>`;
const unico = (sym) => `<renderer-v2 type="singleSymbol" symbollevels="0" forceraster="0" enableorderby="0"><symbols>${sym}</symbols></renderer-v2>`;

export function rotulo(campo, { tamanho, cor = TINTA, fonte = SANS, italico = false, negrito = false, expressao = false, posicao = 1, escalaMax = null, buffer = 0.8, prioridade = 5, distancia = 0 } = {}) {
  const escala = escalaMax ? `scaleVisibility="1" scaleMin="1" scaleMax="${escalaMax}"` : 'scaleVisibility="0"';
  return '<labeling type="simple"><settings calloutType="simple">'
    + `<text-style fieldName=${attr(campo)} isExpression="${Number(expressao)}" fontFamily="${fonte}" fontSize="${tamanho}" fontSizeUnit="Point" textColor="${rgba(cor)}" textOpacity="1" fontItalic="${Number(italico)}" fontWeight="${negrito ? 75 : 50}" fontCapitals="0" fontLetterSpacing="0" multilineHeight="1">`
    + `<text-buffer bufferDraw="1" bufferSize="${buffer}" bufferSizeUnits="MM" bufferColor="${rgba(PAPEL)}" bufferOpacity="0.85" bufferJoinStyle="128" bufferNoFill="1"/></text-style>`
    + '<text-format wrapChar="" autoWrapLength="18" useMaxLineLengthForAutoWrap="1" multilineAlign="1"/>'
    + `<placement placement="${posicao}" placementFlags="10" centroidInside="1" centroidWhole="0" fitInPolygonOnly="0" priority="${prioridade}" repeatDistance="0" repeatDistanceUnits="MM" dist="${distancia}" distUnits="MM" overlapHandling="PreventOverlap"/>`
    + `<rendering ${escala} obstacle="1" labelPerPart="0" mergeLines="0" displayAll="0" upsidedownLabels="0" limitNumLabels="0" drawLabels="1"/>`
    + '</settings></labeling>';
}

export const qml = (renderer, geometria, labeling = '', opacidade = 1) =>
  `<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>\n<qgis version="3.28.0" styleCategories="Symbology|Labeling">${renderer}${labeling}<layerOpacity>${opacidade}</layerOpacity><layerGeometryType>${GEOM[geometria]}</layerGeometryType></qgis>`;

const nfq = (v, casas, en) => v.toLocaleString(en ? 'en-GB' : 'pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });

/**
 * Renderizador por regras: itens = [[filtro (texto do QGIS, sem escapar), rótulo, camadas de símbolo]].
 * `ordem`: expressão de ordenação ('"campo" DESC' põe os círculos grandes por baixo).
 */
export function estiloRegras(geometria, itens, { rotuloCampo = null, rotuloTamanho = 7, ordem = null, rotuloExpressao = false } = {}) {
  const tipo = { ponto: 'marker', linha: 'line', poligono: 'fill' }[geometria];
  const regras = itens.map(([f, r], i) => `<rule key="r${i}"${f ? ` filter="${xml(f)}"` : ''} label=${attr(r)} symbol="${i}"/>`).join('');
  const simbolos = itens.map(([, , s], i) => simbolo(tipo, String(i), s)).join('');
  let ob = '';
  if (ordem) {
    const [campo, sentido = ''] = ordem.split(' ');
    ob = `<orderby><orderByClause asc="${sentido.toUpperCase() === 'DESC' ? 0 : 1}" nullsFirst="0">${xml(campo)}</orderByClause></orderby>`;
  }
  const renderer = `<renderer-v2 type="RuleRenderer" symbollevels="0" forceraster="0" enableorderby="${Number(Boolean(ordem))}"><rules key="root">${regras}</rules><symbols>${simbolos}</symbols>${ob}</renderer-v2>`;
  const rot = rotuloCampo ? rotulo(rotuloCampo, { tamanho: rotuloTamanho, cor: '#33373a', prioridade: 4, expressao: rotuloExpressao }) : '';
  return qml(renderer, geometria, rot);
}

/**
 * Coroplético por classes: limites superiores `lim` (a última classe vai até o máximo), `cores` por classe;
 * zero em cinza-claro (opcional) e "sem informação" (IS NULL) hachurado. `inferior` = início da 1ª classe.
 */
export function estiloGraduado(campo, lim, cores, { casas = 0, en = false, zero = true, inferior = 0, sufixo = '', rotulos = null, borda = PAPEL, largura = 0.05, rotuloCampo = null } = {}) {
  const q = `"${campo}"`;
  const itens = [];
  if (zero) itens.push([`${q} = 0`, 'zero', preenchimento(ZERO, borda, largura)]);
  const ini = [inferior, ...lim.slice(0, -1)];
  lim.forEach((b, i) => {
    const a = ini[i];
    const f = i === 0 && !zero ? `${q} >= ${a} AND ${q} <= ${b}` : `${q} > ${a} AND ${q} <= ${b}`;
    const r = rotulos?.[i] ?? `${nfq(a, casas, en)} – ${nfq(b, casas, en)}${sufixo}`;
    itens.push([i === lim.length - 1 ? `${q} > ${a}` : f, r, preenchimento(cores[i], borda, largura)]);
  });
  itens.push([`${q} IS NULL`, en ? 'no data' : 'sem informação', hachura()]);
  return estiloRegras('poligono', itens, { rotuloCampo });
}

/** Categórico: itens = [[valor, rótulo, cor]] no campo; o resto (IS NULL) hachurado como sem informação. */
export function estiloCategorias(campo, itens, { en = false, borda = PAPEL, largura = 0.05, semInfo = true } = {}) {
  const regras = itens.map(([v, r, cor]) => [`"${campo}" = ${typeof v === 'string' ? `'${v}'` : v}`, r, preenchimento(cor, borda, largura)]);
  if (semInfo) regras.push([`"${campo}" IS NULL`, en ? 'no data' : 'sem informação', hachura()]);
  return estiloRegras('poligono', regras);
}

export function estiloContorno(cor, largura, { rotuloCampo = null, alfa = 1 } = {}) {
  const rot = rotuloCampo ? rotulo(rotuloCampo, { tamanho: 9, cor, fonte: SERIF, italico: true, buffer: 1, prioridade: 8 }) : '';
  return qml(unico(simbolo('fill', '0', preenchimento(null, cor, largura, alfa))), 'poligono', rot);
}

export function estiloLinha(cor, largura, { tracejado = null } = {}) {
  return qml(unico(simbolo('line', '0', linha(cor, largura, tracejado))), 'linha');
}

export function estiloPonto(cor, tamanho, opts = {}) {
  return qml(unico(simbolo('marker', '0', marcador(cor, tamanho, opts))), 'ponto');
}
