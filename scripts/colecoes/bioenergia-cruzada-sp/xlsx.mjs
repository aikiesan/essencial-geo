// Leitura de qualquer planilha de um XLSX (o lib/dados.mjs só lê a primeira).
import { inflateRawSync } from 'node:zlib';
import { readFileSync } from 'node:fs';
function zip(arq) {
  const b = readFileSync(arq); let e = b.length - 22; while (b.readUInt32LE(e) !== 0x06054b50) e--;
  const n = b.readUInt16LE(e + 10); let p = b.readUInt32LE(e + 16); const ents = {};
  for (let i = 0; i < n; i++) {
    const met = b.readUInt16LE(p + 10), tam = b.readUInt32LE(p + 20), ln = b.readUInt16LE(p + 28), lx = b.readUInt16LE(p + 30), lc = b.readUInt16LE(p + 32), off = b.readUInt32LE(p + 42);
    const nome = b.toString('utf8', p + 46, p + 46 + ln); ents[nome] = { met, tam, off }; p += 46 + ln + lx + lc;
  }
  const ler = (nome) => { const x = ents[nome]; const o = x.off + 30 + b.readUInt16LE(x.off + 26) + b.readUInt16LE(x.off + 28); const d = b.subarray(o, o + x.tam); return (x.met === 0 ? d : inflateRawSync(d)).toString('utf8'); };
  return { ents, ler };
}
const ENT = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'" };
const des = (s) => s.replace(/&(amp|lt|gt|quot|apos);|&#(\d+);|&#x([0-9a-f]+);/gi, (m, a, d, h) => (a ? ENT[m] : String.fromCodePoint(d ? Number(d) : parseInt(h, 16))));
const col = (l) => { let n = 0; for (const c of l) n = n * 26 + c.charCodeAt(0) - 64; return n - 1; };
export function planilhas(arq) {
  const z = zip(arq);
  const wb = z.ler('xl/workbook.xml'), rels = z.ler('xl/_rels/workbook.xml.rels');
  const alvo = Object.fromEntries([...rels.matchAll(/<Relationship [^>]*?Id="([^"]+)"[^>]*?Target="([^"]+)"/g)].map((m) => [m[1], m[2]]));
  const alvo2 = Object.fromEntries([...rels.matchAll(/<Relationship [^>]*?Target="([^"]+)"[^>]*?Id="([^"]+)"/g)].map((m) => [m[2], m[1]]));
  const folhas = [...wb.matchAll(/<sheet [^>]*?name="([^"]+)"[^>]*?r:id="([^"]+)"/g)].map((m) => ({ nome: des(m[1]), arq: 'xl/' + (alvo[m[2]] ?? alvo2[m[2]]).replace(/^\/?xl\//, '') }));
  const sh = [];
  if (z.ents['xl/sharedStrings.xml']) for (const m of z.ler('xl/sharedStrings.xml').matchAll(/<si>([\s\S]*?)<\/si>/g)) sh.push(des([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join('')));
  const linhas = (nome) => {
    const f = folhas.find((x) => x.nome === nome); const xml = z.ler(f.arq); const out = [];
    for (const r of xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
      const l = [];
      for (const c of r[1].matchAll(/<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const t = /t="(\w+)"/.exec(c[2])?.[1], corpo = c[3] ?? ''; let v;
        if (t === 'inlineStr') v = des([...corpo.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((x) => x[1]).join(''));
        else { const vv = /<v>([\s\S]*?)<\/v>/.exec(corpo)?.[1] ?? ''; v = t === 's' ? sh[+vv] : des(vv); }
        const i = col(c[1]); while (l.length < i) l.push(''); l[i] = v;
      }
      out.push(l);
    }
    return out;
  };
  return { nomes: folhas.map((f) => f.nome), linhas };
}
