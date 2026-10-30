import QRCode from 'qrcode';

/**
 * QR code em SVG, gerado no build (nada de script no navegador). Margem zero: o respiro vem do CSS; a "zona
 * quieta" que o padrão pede fica por conta do fundo claro em volta, no site e no arquivo baixado (margem 2).
 */
export async function qrSvg(texto: string, { margem = 0 } = {}): Promise<string> {
  return QRCode.toString(texto, { type: 'svg', margin: margem, errorCorrectionLevel: 'M', color: { dark: '#1a1c1e', light: '#ffffff' } });
}
