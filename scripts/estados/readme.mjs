#!/usr/bin/env node
/**
 * Série «Brasil, estado por estado» — escreve README.md e README.en.md de cada prancha
 * a partir dos números de preparar.py e das escolhas de prancha.mjs (rode os dois antes).
 *
 *   node scripts/estados/readme.mjs          # todos os estados de serie.json
 *   node scripts/estados/readme.mjs RJ MG    # só estes
 *
 * Nada é escrito à mão aqui além dos moldes de texto: todo número sai do cache.
 * O GPKG compactado (com os estilos do QGIS) fica fora do Git e vai como anexo da release `estados-2025`.
 */
import { readFile, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('../..', import.meta.url));
const RELEASE = 'https://github.com/aikiesan/essencial-geo/releases/download/estados-2025';
// Grafias corrigidas na ficha e na prancha (os arquivos mantêm o nome da tabela do IBGE).
const GRAFIA = { 'Juíz de Fora': 'Juiz de Fora' };
const AREA_BRASIL = 8510345.5; // km², IBGE (Área Territorial Brasileira)

const serie = JSON.parse(await readFile(join(RAIZ, 'scripts', 'estados', 'serie.json'), 'utf8'));
const pedidos = process.argv.slice(2).map((u) => u.toUpperCase());

// Artigo do nome em português ("o Paraná", "a Bahia", "São Paulo").
const ARTIGO = {
  SP: '', MG: '', SC: '', GO: '', SE: '', AL: '', PE: '', RO: '', RR: '',
  PB: 'a', BA: 'a',
  RJ: 'o', ES: 'o', PR: 'o', RS: 'o', MS: 'o', MT: 'o', DF: 'o', RN: 'o', CE: 'o', PI: 'o', MA: 'o',
  TO: 'o', PA: 'o', AP: 'o', AM: 'o', AC: 'o',
};
const sujeito = (uf, nome) => (ARTIGO[uf] ? `${ARTIGO[uf].toUpperCase()} ${nome}` : nome);
const de = (uf, nome) => `${{ '': 'de', o: 'do', a: 'da' }[ARTIGO[uf]]} ${nome}`;

const ILHAS = {
  PE: {
    pt: 'O arquipélago de Fernando de Noronha, município do estado, aparece num quadro próprio: a centenas de quilômetros da costa, ele encolheria o mapa do continente.',
    en: 'The Fernando de Noronha archipelago, a municipality of the state, appears in its own inset: hundreds of kilometres offshore, it would shrink the mainland map.',
  },
  ES: {
    pt: 'As ilhas da Trindade e Martim Vaz, que pertencem ao município de Vitória, aparecem num quadro próprio: a mais de mil quilômetros da costa, elas encolheriam o mapa do continente.',
    en: 'The Trindade and Martim Vaz islands, which belong to the municipality of Vitória, appear in their own inset: over a thousand kilometres offshore, they would shrink the mainland map.',
  },
};

// O primeiro mapa da série tem contexto escrito à mão.
const CONTEXTO_MANUAL = {
  SP: {
    pt: 'São Paulo tem 645 municípios em 248 mil km², quase três por cento do território brasileiro. O IBGE os agrupa em 53 regiões imediatas, desenhadas em torno das cidades que oferecem trabalho, comércio e serviços ao entorno, e em 11 regiões intermediárias, que articulam essas redes. A de São José do Rio Preto, no noroeste, reúne cem municípios pequenos; a de São Paulo, cinquenta, quase todos colados à capital. Esta prancha abre a série «Brasil, estado por estado»: uma base limpa, com os limites oficiais e a malha rodoviária pavimentada, para quem precisa começar um mapa do estado sem perder a primeira tarde reunindo arquivos.',
    en: 'São Paulo has 645 municipalities across 248,000 km², almost three per cent of Brazil. IBGE groups them into 53 immediate regions, drawn around the towns that supply jobs, trade and services to their surroundings, and into 11 intermediate regions that tie those networks together. São José do Rio Preto, in the north-west, gathers a hundred small municipalities; São Paulo, fifty, nearly all pressed against the capital. This plate opens the series “Brazil, state by state”: a clean base, with official boundaries and the paved road network, for anyone who needs to start a map of the state without losing the first afternoon gathering files.',
  },
  DF: {
    pt: 'O Distrito Federal não se divide em municípios: na malha do IBGE ele é um só, Brasília, com {area} km². É também, sozinho, uma região imediata e uma região intermediária. A menor unidade da federação fica no Planalto Central, entre Goiás e Minas Gerais, e dela partem as rodovias federais radiais, numeradas de BR-010 a BR-080. Parte da série «Brasil, estado por estado»: uma base limpa, com os limites oficiais e a malha rodoviária, para começar um mapa sem perder a primeira tarde reunindo arquivos.',
    en: 'The Federal District is not divided into municipalities: in the IBGE mesh it is a single one, Brasília, with {area} km². On its own it is also one immediate region and one intermediate region. The smallest federative unit sits on the Central Plateau, between Goiás and Minas Gerais, and the radial federal highways, numbered BR-010 to BR-080, start from it. Part of the series “Brazil, state by state”: a clean base, with official boundaries and the road network, to start a map without losing the first afternoon gathering files.',
  },
};

const CANTO = {
  pt: { se: 'no canto inferior direito', so: 'no canto inferior esquerdo', ne: 'no canto superior direito', no: 'no canto superior esquerdo' },
  en: { se: 'in the lower-right corner', so: 'in the lower-left corner', ne: 'in the upper-right corner', no: 'in the upper-left corner' },
};

const fmt = (lingua) => (v, casas = 0) =>
  Number(v).toLocaleString(lingua === 'en' ? 'en-GB' : 'pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });
const mb = (bytes) => {
  const v = bytes / 1e6;
  return v < 0.1 ? `${Math.max(1, Math.round(bytes / 1e3))} kB` : `${fmt('pt')(v, 1)} MB`;
};
const aspas = (s) => `"${String(s).replace(/"/g, '\\"')}"`;

function contexto(e, N, lingua) {
  const f = fmt(lingua);
  const manual = CONTEXTO_MANUAL[e.uf]?.[lingua];
  if (manual) return manual.replace('{area}', f(N.area_km2_ibge));
  const area = N.area_km2_ibge >= 10000 ? (lingua === 'en' ? `${f(Math.round(N.area_km2_ibge / 1000))},000 km²` : `${f(Math.round(N.area_km2_ibge / 1000))} mil km²`) : `${f(N.area_km2_ibge)} km²`;
  const pct = f((N.area_km2_ibge / AREA_BRASIL) * 100, 1);
  const rg = N.municipios_por_rgint;
  const [mais, menos] = [rg[0], rg.at(-1)];
  if (lingua === 'en')
    return [
      `${e.nome} has ${f(N.municipios)} municipalities across ${area}, ${pct} per cent of Brazil.`,
      `IBGE groups them into ${N.regioes_imediatas} immediate regions, drawn around the towns that supply jobs, trade and services to their surroundings, and into ${N.regioes_intermediarias} intermediate regions that tie those networks together.`,
      rg.length > 1 && mais.n !== menos.n
        ? `${mais.nome} is the intermediate region with the most municipalities (${mais.n}); ${menos.nome}, the one with the fewest (${menos.n}).`
        : '',
      `The largest municipality is ${N.maior_municipio.nome} (${f(N.maior_municipio.area_km2)} km²); the smallest, ${N.menor_municipio.nome} (${f(N.menor_municipio.area_km2, N.menor_municipio.area_km2 < 10 ? 1 : 0)} km²).`,
      'Part of the series “Brazil, state by state”: a clean base, with official boundaries and the road network, to start a map without losing the first afternoon gathering files.',
    ].filter(Boolean).join(' ');
  return [
    `${sujeito(e.uf, e.nome)} tem ${f(N.municipios)} municípios em ${area}, ${pct}% do território brasileiro.`,
    `O IBGE os agrupa em ${N.regioes_imediatas} regiões imediatas, desenhadas em torno das cidades que oferecem trabalho, comércio e serviços ao entorno, e em ${N.regioes_intermediarias} regiões intermediárias, que articulam essas redes.`,
    rg.length > 1 && mais.n !== menos.n
      ? `A região intermediária de ${mais.nome} é a que reúne mais municípios (${mais.n}); a de ${menos.nome}, a que reúne menos (${menos.n}).`
      : '',
    `O maior município é ${N.maior_municipio.nome} (${f(N.maior_municipio.area_km2)} km²); o menor, ${N.menor_municipio.nome} (${f(N.menor_municipio.area_km2, N.menor_municipio.area_km2 < 10 ? 1 : 0)} km²).`,
    'Parte da série «Brasil, estado por estado»: uma base limpa, com os limites oficiais e a malha rodoviária, para começar um mapa sem perder a primeira tarde reunindo arquivos.',
  ].filter(Boolean).join(' ');
}

function textoAlt(e, N, P, lingua) {
  const f = fmt(lingua);
  const df = e.uf === 'DF';
  if (lingua === 'en')
    return `Map of ${e.nome} with ${df ? 'its single municipality, Brasília' : `its ${f(N.municipios)} municipalities coloured by the ${N.regioes_intermediarias} intermediate geographic regions and the immediate-region boundaries`}; federal highways in terracotta red with BR shields, state highways in dark grey and the capital marked with a star. Around it, neighbouring units in light grey${P.oceano ? ' and the Atlantic Ocean in pale blue' : ''}; a locator map of Brazil ${CANTO.en[P.localizador]}${P.ilhas ? `, an inset with the oceanic islands ${CANTO.en[P.ilhas]}` : ''} and a leaf-shaped north arrow ${CANTO.en[P.norte]}.`;
  return `Mapa ${de(e.uf, e.nome)} com ${df ? 'seu único município, Brasília' : `os ${f(N.municipios)} municípios coloridos pelas ${N.regioes_intermediarias} regiões geográficas intermediárias e os limites das regiões imediatas`}; rodovias federais em vermelho-terracota com escudos BR, estaduais em cinza-escuro e a capital marcada por uma estrela. Ao redor, as unidades vizinhas em cinza-claro${P.oceano ? ' e o Oceano Atlântico em azul-pálido' : ''}; um mapa de localização do Brasil ${CANTO.pt[P.localizador]}${P.ilhas ? `, um quadro com as ilhas oceânicas ${CANTO.pt[P.ilhas]}` : ''} e uma seta do norte em forma de folha ${CANTO.pt[P.norte]}.`;
}

async function escrever(e) {
  const uf = e.uf.toLowerCase();
  const pasta = join(RAIZ, 'mapas', e.pasta);
  const N = JSON.parse(await readFile(join(RAIZ, 'scripts', 'estados', 'cache', `${uf}.json`), 'utf8')).numeros;
  for (const r of N.municipios_por_rgint) r.nome = GRAFIA[r.nome] ?? r.nome;
  const P = JSON.parse(await readFile(join(RAIZ, 'scripts', 'estados', 'cache', `${uf}_prancha.json`), 'utf8'));
  const tam = async (rel) => (existsSync(join(pasta, rel)) ? mb((await stat(join(pasta, rel))).size) : undefined);
  const df = e.uf === 'DF';
  const recorte = df ? 'Distrito Federal (DF)' : `Estado ${de(e.uf, e.nome)} (${e.uf})`;
  const recorteEn = df ? 'Federal District (DF)' : `${e.nome} state (${e.uf})`;
  const fpt = fmt('pt');
  const fen = fmt('en');
  const rk = N.rodovias_km;
  const slug = e.pasta.replace(/^\d{3}-(estado-)?/, '');
  const ilhas = ILHAS[e.uf];
  // "Áreas operacionais" do IBGE (as lagoas do RS): no limite e na área, fora dos municípios.
  const agua = (N.areas_operacionais ?? []).map((a) => ({ ...a, nome: a.nome.replace(/^Área Operacional "(.*)"$/, '$1') }));
  const nomesAgua = (l) => agua.map((a) => a.nome).join(l === 'en' ? ' and ' : ' e ');
  const kmAgua = agua.reduce((t, a) => t + a.area_km2, 0);
  const notaAgua = agua.length
    ? {
        pt: `A malha do IBGE traz ${agua.map((a) => `a ${a.nome}`).join(' e ')} como «áreas operacionais»: elas entram no limite e na área do estado (${fpt(kmAgua)} km²), mas não são municípios nem pertencem a região alguma. Ficam numa camada própria, \`areas_operacionais\`, e na prancha aparecem como água.`,
        en: `The IBGE mesh includes ${nomesAgua('en')} as “operational areas”: they count towards the state boundary and area (${fen(kmAgua)} km²) but are not municipalities and belong to no region. They have their own layer, \`areas_operacionais\`, and appear as water on the plate.`,
      }
    : null;
  const extra = (texto) => (texto ? `\n\n${texto}` : '');
  const linhaAgua = (geom, l) => (agua.length ? `| \`areas_operacionais\` | ${geom} | ${nomesAgua(l)}, ${l === 'en' ? 'with' : 'com'} \`area_km2\` |\n` : '');
  const camadaAgua = agua.length ? ', `areas_operacionais`' : '';
  const nCamadas = agua.length ? ['Sete camadas', 'Seven layers'] : ['Seis camadas', 'Six layers'];

  const pt = `---
numero: ${e.numero}
titulo: ${aspas(e.nome)}
subtitulo: "Divisão territorial e rodovias"
data: ${e.data}
categoria: divisao-territorial
tags: [brasil-estado-por-estado, ${slug}, municipios, regioes-geograficas, rodovias, ibge]

contexto: >-
  ${contexto(e, N, 'pt')}

imagem: ./mapa_preview.png
imagem_alt: ${aspas(textoAlt(e, N, P, 'pt'))}

recorte: ${aspas(recorte)}
fontes:
  - nome: "IBGE — Malha Municipal 2025"
    nome_en: "IBGE — Municipal Mesh 2025"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
    ano: 2025
  - nome: "IBGE — Divisão Regional do Brasil em Regiões Geográficas Imediatas e Intermediárias"
    nome_en: "IBGE — Regional Division of Brazil into Immediate and Intermediate Geographic Regions"
    url: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/divisao-regional/15778-divisoes-regionais-do-brasil.html
    ano: 2017
  - nome: "MapBiomas — Infraestrutura: rodovias federais e estaduais"
    nome_en: "MapBiomas — Infrastructure: federal and state highways"
    url: https://mapbiomas.org/
  - nome: "Natural Earth — países (só na prancha)"
    nome_en: "Natural Earth — countries (plate only)"
    url: https://www.naturalearthdata.com/
crs: "SIRGAS 2000 (EPSG:4674)"
epsg: 4674
software: ["Python", "GeoPandas", "GDAL", "QGIS", "Node.js", "d3-geo"]
metodo: "Limites da Malha Municipal do IBGE, dissolvidos em regiões imediatas, intermediárias e limite estadual; rodovias recortadas pelo limite da unidade."

camadas:
  - { nome: municipios, tipo: poligono, descricao: "${fpt(N.municipios)} ${N.municipios === 1 ? 'município' : 'municípios'}, com código IBGE, regiões, concentração urbana e área (km²)", descricao_en: "${fen(N.municipios)} ${N.municipios === 1 ? 'municipality' : 'municipalities'}, with IBGE code, regions, urban concentration and area (km²)" }
  - { nome: regioes_intermediarias, tipo: poligono, cor: "#1a211a", descricao: "${N.regioes_intermediarias} ${N.regioes_intermediarias === 1 ? 'região geográfica intermediária' : 'regiões geográficas intermediárias'}", descricao_en: "${N.regioes_intermediarias} intermediate geographic ${N.regioes_intermediarias === 1 ? 'region' : 'regions'}" }
  - { nome: regioes_imediatas, tipo: poligono, cor: "#5f6458", descricao: "${N.regioes_imediatas} ${N.regioes_imediatas === 1 ? 'região geográfica imediata' : 'regiões geográficas imediatas'}", descricao_en: "${N.regioes_imediatas} immediate geographic ${N.regioes_imediatas === 1 ? 'region' : 'regions'}" }
  - { nome: limite_estadual, tipo: poligono, cor: "#1a1c1e", descricao: "Limite da unidade da federação", descricao_en: "Boundary of the federative unit" }
  - { nome: rodovias, tipo: linha, cor: "#9c4a32", descricao: "Rodovias federais e estaduais: sigla, revestimento, situação física, pistas", descricao_en: "Federal and state highways: route number, surface, physical status, carriageways" }
  - { nome: capital, tipo: ponto, descricao: "Ponto indicativo da capital (não é a sede exata)", descricao_en: "Indicative point for the capital (not the exact seat)" }

indicadores:
  - tipo: barras
    rotulo: "Municípios por região intermediária"
    rotulo_en: "Municipalities per intermediate region"
    unidade: "municípios"
    unidade_en: "municipalities"
    itens:
${N.municipios_por_rgint.map((r) => `      - { rotulo: ${aspas(r.nome)}, valor: ${r.n}, cor: "${P.cores[r.codigo]}" }`).join('\n')}
  - tipo: numero
    rotulo: "Área"
    rotulo_en: "Area"
    valor: ${Math.round(N.area_km2_ibge)}
    unidade: "km²"
${df ? '' : `    nota: "Maior município: ${N.maior_municipio.nome} (${fpt(N.maior_municipio.area_km2)} km²); menor: ${N.menor_municipio.nome} (${fpt(N.menor_municipio.area_km2, N.menor_municipio.area_km2 < 10 ? 1 : 0)} km²)"
    nota_en: "Largest municipality: ${N.maior_municipio.nome} (${fen(N.maior_municipio.area_km2)} km²); smallest: ${N.menor_municipio.nome} (${fen(N.menor_municipio.area_km2, N.menor_municipio.area_km2 < 10 ? 1 : 0)} km²)"
`}  - tipo: numero
    rotulo: "Rodovias pavimentadas"
    rotulo_en: "Paved highways"
    valor: ${Math.round(rk.pavimentadas)}
    unidade: "km"
    nota: "${fpt(rk.federais)} km federais e ${fpt(rk.estaduais)} km estaduais, pavimentadas ou não"
    nota_en: "${fen(rk.federais)} km federal and ${fen(rk.estaduais)} km state highways, paved or not"

downloads:
  - formato: gpkg
    url: ${RELEASE}/${uf}_divisao_territorial.gpkg.zip
    rotulo: "${nCamadas[0]}, SIRGAS 2000, com estilos do QGIS"
    rotulo_en: "${nCamadas[1]}, SIRGAS 2000, with QGIS styles"
    tamanho: "${await tam(`dados/${uf}_divisao_territorial.gpkg.zip`)}"
  - formato: csv
    arquivo: dados/${uf}_municipios.csv
    rotulo: "Municípios com códigos e regiões"
    rotulo_en: "Municipalities with codes and regions"
    tamanho: "${await tam(`dados/${uf}_municipios.csv`)}"
  - formato: svg
    url: ${RELEASE}/${uf}_prancha.svg
    url_en: ${RELEASE}/${uf}_prancha.en.svg
    rotulo: "Prancha em vetor, para impressão"
    rotulo_en: "Vector plate, for printing"
    tamanho: "${mb(P.svg_bytes)}"
  - formato: png
    arquivo: mapa_preview.png
    arquivo_en: mapa_preview.en.png
    rotulo: "Prancha (PNG 2400 px)"
    rotulo_en: "Plate (PNG, 2400 px)"
    tamanho: "${mb(P.png_bytes)}"

versao: "1.0.0"
discussoes: []
---

# ${e.nome} — divisão territorial e rodovias

<p class="so-github"><strong>Português</strong> · <a href="README.en.md">English</a></p>

Prancha Nº ${String(e.numero).padStart(3, '0')} da série **Brasil, estado por estado**: uma base cartográfica de cada
unidade da federação, com os mesmos arquivos, as mesmas camadas e o mesmo desenho,
para baixar e começar a trabalhar.${extra(ilhas?.pt)}${extra(notaAgua?.pt)}

## O que vem nos arquivos

| Camada (GPKG) | Geometria | Conteúdo |
| --- | --- | --- |
| \`municipios\` | polígono | ${fpt(N.municipios)} ${N.municipios === 1 ? 'município' : 'municípios'}: \`CD_MUN\`, \`NM_MUN\`, regiões imediata e intermediária, concentração urbana, \`area_km2\`, \`capital\` |
| \`regioes_intermediarias\` | polígono | ${N.regioes_intermediarias} ${N.regioes_intermediarias === 1 ? 'região' : 'regiões'}, com o número de municípios |
| \`regioes_imediatas\` | polígono | ${N.regioes_imediatas} ${N.regioes_imediatas === 1 ? 'região' : 'regiões'}, com o número de municípios |
| \`limite_estadual\` | polígono | contorno da unidade |
| \`rodovias\` | linha | federais e estaduais: \`sigla\`, \`revestimento\`, \`situacao_fisica\`, \`n_pistas\`, \`pavimentada\` |
| \`capital\` | ponto | ponto indicativo, dentro do município (não é a sede) |
${linhaAgua('polígono', 'pt')}
O **GPKG** vai compactado (ZIP) e fica nos anexos da
[release \`estados-2025\`](https://github.com/aikiesan/essencial-geo/releases/tag/estados-2025)
do repositório, junto com os das outras 26 unidades.

O GPKG já traz os **estilos do QGIS**, gravados como estilo padrão de cada camada: ao
arrastar o arquivo para o QGIS, os municípios aparecem com as cores das regiões
intermediárias, os limites e as rodovias com o traço da prancha e os nomes com halo.
Os trechos de rodovia sem situação física confirmada ficam numa regra desligada da
legenda, como na prancha; basta marcá-la para vê-los. Em outros SIGs as camadas abrem
normalmente, sem o estilo. Para repetir a ordem da prancha, empilhe de cima para baixo
\`capital\`, \`rodovias\`, \`limite_estadual\`, \`regioes_intermediarias\`,
\`regioes_imediatas\`${camadaAgua} e \`municipios\`.

O **CSV** traz a tabela dos municípios, em UTF-8, pronta para cruzar com dados do
Censo ou de qualquer base que use o código IBGE de sete dígitos.

## Método

1. Malha Municipal 2025 do IBGE, sem alteração de geometria nos arquivos para download.
2. Regiões imediatas, intermediárias e limite obtidos por dissolução dos municípios —
   as bordas coincidem exatamente.
3. Rodovias federais e estaduais da base de infraestrutura do MapBiomas, recortadas
   pelo limite da unidade. A prancha mostra só os trechos construídos.
4. Áreas em km² calculadas pelo IBGE; a soma confere com o cálculo em Albers
   (${fpt(N.area_km2_calculada, 1)} km²).
5. Na prancha, as geometrias são simplificadas como cobertura (≈ 400 m), para que
   a unidade, as vizinhas e o litoral compartilhem as mesmas bordas.

## Limitações

- A camada \`rodovias\` tem o campo \`n_pistas\` incompleto; não use a base para medir
  extensão de pistas duplicadas.
- O ponto da capital é indicativo (um ponto interno do polígono do município).
`;

  const en = `---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: ${aspas(e.nome)}
subtitulo: "Territorial divisions and highways"

contexto: >-
  ${contexto(e, N, 'en')}

imagem: ./mapa_preview.en.png
imagem_alt: ${aspas(textoAlt(e, N, P, 'en'))}

recorte: ${aspas(recorteEn)}
metodo: "IBGE Municipal Mesh boundaries, dissolved into immediate and intermediate regions and the unit boundary; highways clipped to the unit."
---

# ${e.nome} — territorial divisions and highways

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. ${String(e.numero).padStart(3, '0')} of the series **Brazil, state by state**: a cartographic base for each
of the 27 federative units, with the same files, the same layers and the same design,
ready to download and get to work.${extra(ilhas?.en)}${extra(notaAgua?.en)}

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| \`municipios\` | polygon | ${fen(N.municipios)} ${N.municipios === 1 ? 'municipality' : 'municipalities'}: \`CD_MUN\`, \`NM_MUN\`, immediate and intermediate regions, urban concentration, \`area_km2\`, \`capital\` |
| \`regioes_intermediarias\` | polygon | ${N.regioes_intermediarias} ${N.regioes_intermediarias === 1 ? 'region' : 'regions'}, with their number of municipalities |
| \`regioes_imediatas\` | polygon | ${N.regioes_imediatas} ${N.regioes_imediatas === 1 ? 'region' : 'regions'}, with their number of municipalities |
| \`limite_estadual\` | polygon | outline of the unit |
| \`rodovias\` | line | federal and state highways: \`sigla\`, \`revestimento\`, \`situacao_fisica\`, \`n_pistas\`, \`pavimentada\` |
| \`capital\` | point | indicative point inside the municipality (not the seat) |
${linhaAgua('polygon', 'en')}
The **GPKG** is zipped and attached to the repository’s
[\`estados-2025\` release](https://github.com/aikiesan/essencial-geo/releases/tag/estados-2025),
together with those of the other 26 units.

The GPKG carries its own **QGIS styles**, saved as each layer’s default style: drag the
file into QGIS and the municipalities appear in the colours of their intermediate
regions, boundaries and highways with the plate’s strokes, and names with a halo.
Highway sections without a confirmed physical status sit in a legend rule that is
switched off, as on the plate; tick it to see them. Other GIS software opens the layers
as usual, without the style. To match the plate, stack them from top to bottom:
\`capital\`, \`rodovias\`, \`limite_estadual\`, \`regioes_intermediarias\`,
\`regioes_imediatas\`${camadaAgua} and \`municipios\`.

The **CSV** holds the municipal table in UTF-8, ready to join with Census data or any
dataset keyed on the seven-digit IBGE code.

## Method

1. IBGE Municipal Mesh 2025, with geometry unchanged in the downloadable files.
2. Immediate and intermediate regions and the boundary are dissolved from the
   municipalities, so their edges match exactly.
3. Federal and state highways from MapBiomas’ infrastructure base, clipped to the
   boundary. The plate shows built sections only.
4. Areas in km² as computed by IBGE; the total matches an Albers calculation
   (${fen(N.area_km2_calculada, 1)} km²).
5. On the plate, geometries are simplified as a coverage (≈ 400 m), so the unit, its
   neighbours and the coastline share the same edges.

## Limitations

- The \`rodovias\` layer has an incomplete \`n_pistas\` field; do not use it to measure
  dual-carriageway length.
- The capital point is indicative (an interior point of the municipal polygon).
`;

  await writeFile(join(pasta, 'README.md'), pt);
  await writeFile(join(pasta, 'README.en.md'), en);
  const ctx = contexto(e, N, 'pt').length;
  console.log(`✓ ${e.uf}  ${e.pasta}  contexto ${ctx} caracteres${ctx > 900 ? '  ⚠ ACIMA DE 900' : ''}`);
}

for (const e of serie) if (!pedidos.length || pedidos.includes(e.uf)) await escrever(e);
