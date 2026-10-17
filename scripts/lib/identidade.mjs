/**
 * Assinatura do Essencial Geo: cinco pequenos segredos que toda prancha leva.
 * Nenhum deles se confunde com geografia: a folha é a rosa dos ventos, o resto fica
 * no painel e na moldura.
 *
 *   1. Norte em folha: a folha grande do CP2b, como sombra suave, é a rosa dos
 *      ventos — num canto livre do mapa, com a ponta no norte.
 *   2. Molécula: a molécula do CP2b (biogás), minúscula, como marca do autor no carimbo.
 *   3. Lema: «o essencial é invisível aos olhos» corre na moldura de baixo, em letra
 *      de 3 px. Na tela é um fio pontilhado; só se lê ampliando.
 *   4. Estrela: sob a estrela dourada do cabeçalho, em letra de 3,5 px, o nome da
 *      estrela que representa o estado na Bandeira Nacional (Lei 5.700/1971, anexo).
 *   5. Assinatura: autor e ORCID na moldura de cima, como os cartógrafos suíços
 *      escondiam seus nomes nas cartas.
 *
 * Os desenhos vêm de PILAR-2b Design System/cp2b-avatar-gradient.svg (viewBox 800 × 800).
 * Regras de uso: docs/ESTILO.md → «Assinatura».
 */

export const FOLHAS = [
  'M397.74,447.59c-33.35,57.05,22.48,98.98,22.48,98.98l-85.93-35.86c-103.98-43.4-158.39-148.38-145.87-260.05.26-2.350.46-4.71.56-7.08l3.88-98.86s49.590-14.99,104.55,1.89c90.12,27.69,202.19,126.7,100.32,300.98Z',
  'M438.71,557.1c19.61,38.77-18.71,64.06-18.71,64.06l57.82-20.1c69.97-24.33,109.86-91.04,106.11-164.83-.08-1.55-.12-3.11-.08-4.67l1.4-65.03s-31.95-11.82-68.68-2.93c-60.24,14.57-137.740,75.07-77.85,193.5Z',
  'M400.86,590.75c-.28-21.45,22.2-24.35,22.2-24.35l-30.01-3.63c-36.32-4.4-68.49,16.54-82.84,50.08-.3.71-.62,1.41-.98,2.09l-14.74,28.54s11.6,12.18,29.83,16.21c29.88,6.61,77.39-3.4,76.54-68.93Z',
];
export const MOLECULA =
  'M594.79,269.42c-3.65,0-7.06,1.06-9.93,2.88-8.65-1.89-16.69-5.6-23.64-10.74.85-2.85,1.32-5.87,1.32-9,0-8.84-3.67-16.83-9.56-22.52,3.94-4.04,8.46-7.57,13.46-10.46,3.07,1.06,6.37,1.65,9.8,1.65,16.54,0,29.95-13.41,29.95-29.95s-13.41-29.950-29.95-29.95-29.95,13.41-29.95,29.95c0,6.56,2.11,12.62,5.69,17.55-1,5.79-2.8,11.33-5.3,16.49-4.57-2.6-9.84-4.09-15.48-4.09-7.04,0-13.53,2.32-18.76,6.24-5.93-5.690-10.72-12.54-14.03-20.2.37-1.47.57-3.01.57-4.59,0-10.25-8.31-18.55-18.55-18.55s-18.55,8.31-18.55,18.55,8.31,18.55,18.55,18.55c2.48,0,4.85-.49,7.01-1.37,7.54,2.65,14.43,6.7,20.36,11.89-4.93,5.54-7.92,12.82-7.92,20.82,0,8.67,3.52,16.51,9.2,22.18-4.93,6.59-11.16,12.21-18.43,16.45-1.19-.17-2.41-.27-3.66-.27-13.87,0-25.11,11.24-25.11,25.11s11.24,25.11,25.11,25.11,25.11-11.24,25.11-25.11c0-4.9-1.41-9.48-3.84-13.34.47-8.32,2.61-16.35,6.18-23.67,4.85,3.08,10.6,4.87,16.77,4.87,11.89,0,22.24-6.63,27.55-16.39,7.020,4.94,13.04,11.34,17.56,18.89-.04.52-.07,1.05-.07,1.58,0,10.25,8.31,18.55,18.55,18.55s18.55-8.31,18.55-18.55-8.31-18.55-18.55-18.55Z';
export const LARANJA = '#d37402';

/** Autor e ORCID (os mesmos de src/site.config.ts → AUTORIA). */
export const ASSINATURA = 'LUCAS NAKAMURA CEREJO · ORCID 0000-0002-9292-2752 · NIPE/UNICAMP · CP2B · ESSENCIAL GEO';

/**
 * A estrela de cada UF na Bandeira Nacional: [designação de Bayer, nome próprio (IAU)].
 * Conferida em en.wikipedia.org/wiki/Flag_of_Brazil e no anexo da Lei 5.700/1971.
 */
export const ESTRELAS = {
  AM: ['α CANIS MINORIS', 'PROCYON'], MT: ['α CANIS MAJORIS', 'SIRIUS'], AP: ['β CANIS MAJORIS', 'MIRZAM'],
  RO: ['γ CANIS MAJORIS', 'MULIPHEN'], RR: ['δ CANIS MAJORIS', 'WEZEN'], TO: ['ε CANIS MAJORIS', 'ADHARA'],
  PA: ['α VIRGINIS', 'SPICA'], PI: ['α SCORPII', 'ANTARES'], MA: ['β SCORPII', 'GRAFFIAS'],
  CE: ['ε SCORPII', 'LARAWAG'], AL: ['θ SCORPII', 'SARGAS'], SE: ['ι SCORPII', ''],
  PB: ['κ SCORPII', ''], RN: ['λ SCORPII', 'SHAULA'], PE: ['μ SCORPII', 'XAMIDIMURA'],
  MS: ['α HYDRAE', 'ALPHARD'], AC: ['γ HYDRAE', ''], SP: ['α CRUCIS', 'ACRUX'],
  RJ: ['β CRUCIS', 'MIMOSA'], BA: ['γ CRUCIS', 'GACRUX'], MG: ['δ CRUCIS', 'IMAI'],
  ES: ['ε CRUCIS', 'GINAN'], RS: ['α TRIANGULI AUSTRALIS', 'ATRIA'], SC: ['β TRIANGULI AUSTRALIS', ''],
  PR: ['γ TRIANGULI AUSTRALIS', ''], GO: ['α CARINAE', 'CANOPUS'], DF: ['σ OCTANTIS', 'POLARIS AUSTRALIS'],
};

/* Eixo da folha grande (FOLHAS[0]) no desenho original: da base à ponta.
   Medido pela maior extensão ao longo do eixo principal dos pixels da folha. */
const BASE = [418, 545];
const PONTA = [194, 144];
const COMP = Math.hypot(PONTA[0] - BASE[0], PONTA[1] - BASE[1]); // ≈ 459
const GIRO = (Math.atan2(BASE[0] - PONTA[0], BASE[1] - PONTA[1]) * 180) / Math.PI; // ≈ 29,2°: ponta para cima

/**
 * Norte em folha: a folha grande do CP2b como sombra, com a ponta no norte.
 * A nervura (base → ponta) é a agulha; a metade esquerda é um tom mais escura,
 * como nas rosas dos ventos clássicas. (cx, cy) é o centro da folha; `altura` em px.
 */
export function norteFolha({ cx, cy, altura = 110, cor = '#01573a', tinta = '#1a1c1e', id = 'norte-folha' }) {
  const e = altura / COMP;
  const meio = [(BASE[0] + PONTA[0]) / 2, (BASE[1] + PONTA[1]) / 2];
  // Lado esquerdo da agulha, no sistema do desenho (o "oeste" depois do giro).
  const g = (GIRO * Math.PI) / 180;
  const esq = [-Math.cos(g) * 600, Math.sin(g) * 600];
  const lado = `M${PONTA}L${BASE}l${esq}L${PONTA[0] + esq[0]},${PONTA[1] + esq[1]}Z`;
  const folha = FOLHAS[0];
  return `<g>
  <defs>
    <filter id="${id}-suave" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${(0.9 / e).toFixed(2)}"/></filter>
    <clipPath id="${id}-lado"><path d="${lado}"/></clipPath>
  </defs>
  <g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${GIRO.toFixed(2)}) scale(${e.toFixed(4)}) translate(${-meio[0]} ${-meio[1]})">
    <path d="${folha}" fill="${cor}" fill-opacity=".13" filter="url(#${id}-suave)"/>
    <path d="${folha}" fill="${cor}" fill-opacity=".16" clip-path="url(#${id}-lado)" filter="url(#${id}-suave)"/>
    <path d="M${BASE}L${PONTA}" stroke="${tinta}" stroke-opacity=".55" stroke-width="${(1 / e).toFixed(2)}" stroke-linecap="round"/>
  </g>
  <text x="${cx.toFixed(1)}" y="${(cy - altura / 2 - 9).toFixed(1)}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="17" fill="${tinta}" fill-opacity=".7">N</text>
</g>`;
}

/** Molécula do CP2b, com `tamanho` px de largura, a partir do canto (x, y). */
export function molecula(x, y, tamanho = 22, cor = LARANJA) {
  // A molécula ocupa ~x 470–625, y 175–330 no desenho original.
  const e = tamanho / 155;
  return `<path transform="translate(${x} ${y}) scale(${e.toFixed(4)}) translate(-470 -175)" d="${MOLECULA}" fill="${cor}"/>`;
}

/** Microtexto ao longo de um segmento horizontal ou vertical, repetindo a frase até o fim. */
export function microtexto(frase, { x, y, comprimento, vertical = false, tamanho = 3, cor = '#7a8189' }) {
  const unidade = `${frase} · `;
  const porLetra = 0.55 * tamanho + 0.35;
  const vezes = Math.ceil(comprimento / (unidade.length * porLetra)) + 1;
  const texto = unidade.repeat(vezes);
  const rot = vertical ? ` transform="rotate(90 ${x} ${y})"` : '';
  return `<text x="${x}" y="${y}"${rot} font-family="Consolas, 'DejaVu Sans Mono', monospace" font-size="${tamanho}" letter-spacing=".35" fill="${cor}" textLength="${comprimento}" lengthAdjust="spacing">${texto
    .slice(0, Math.floor(comprimento / porLetra))
    .replace(/&/g, '&amp;')}</text>`;
}
