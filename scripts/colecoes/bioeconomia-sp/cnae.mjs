/**
 * Classificação CNAE 2.0 da bioeconomia (coleção bioeconomia-sp).
 *
 * Segue o recorte do JRC/nova-Institute («Jobs and Wealth in the EU Bioeconomy»): setores que produzem
 * biomassa (agricultura, floresta, pesca) e os que a convertem e são de base biológica por inteiro
 * (alimentos, bebidas e fumo; madeira, papel e móveis de madeira; fibras naturais e couro;
 * biocombustíveis). Os setores parcialmente biológicos do JRC (química, farmacêutica, plásticos,
 * bioeletricidade) ficam fora, porque a CNAE não separa a parte biológica. Resíduos e saneamento
 * ficam num grupo à parte (bioeconomia circular), fora do total.
 */
const div = (sub) => sub.slice(0, 2);
const cls = (sub) => sub.slice(0, 4);

export const SEGMENTOS = ['agro', 'alimentos', 'madeira', 'fibras', 'biocombustiveis'];

/** Segmento da bioeconomia de uma subclasse CNAE (7 dígitos) ou null. */
export function segmento(sub) {
  const d = div(sub), c = cls(sub);
  if (['01', '02', '03'].includes(d)) return 'agro';
  if (c === '1931' || c === '1932') return 'biocombustiveis';
  if (['10', '11', '12'].includes(d)) return 'alimentos';
  if (['16', '17'].includes(d) || sub === '3101200') return 'madeira';
  if (['1311', '1312', '1321', '1322', '1510'].includes(c)) return 'fibras';
  return null;
}

/** Resíduos e saneamento (bioeconomia circular). */
export function residuos(sub) {
  const c = cls(sub);
  if (c === '3701' || c === '3702') return 'esgoto';
  if (c === '3811' || c === '3812') return 'coleta';
  if (c === '3821' || c === '3822') return 'tratamento';
  if (c === '3831' || c === '3832' || c === '3839') return 'recuperacao';
  return null;
}

/** Indústrias que geram resíduo orgânico em volume (efluente e sólidos). */
export const GERADORES = {
  abate: ['1011', '1012', '1013', '1020'],
  laticinios: ['1051', '1052', '1053'],
  frutas: ['1031', '1032', '1033'],
  acucar_etanol: ['1071', '1072', '1931'],
  oleos: ['1041', '1042', '1043'],
  bebidas: ['1111', '1112', '1113', '1121', '1122'],
  graos_racoes: ['1061', '1062', '1063', '1064', '1065', '1066', '1069'],
};
export function gerador(sub) {
  const c = cls(sub);
  for (const [g, l] of Object.entries(GERADORES)) if (l.includes(c)) return g;
  return null;
}
