/**
 * Visualizador de pranchas em tela cheia.
 * Roda do mouse / trackpad e pinça (dois dedos) ampliam em torno do ponto,
 * arrastar move, duplo clique ou toque duplo alterna entre enquadrar e 2,5×.
 * Teclado: + / − / 0 / setas / Esc.
 */

const MIN_REL = 1; // nunca menor que o enquadramento
const MAX_ABS = 4; // até 4× o tamanho real do arquivo

export function iniciarVisor() {
  const visor = document.querySelector<HTMLDialogElement>('[data-visor]');
  if (!visor || typeof visor.showModal !== 'function') return;

  const palco = visor.querySelector<HTMLElement>('[data-visor-palco]')!;
  const img = visor.querySelector<HTMLImageElement>('[data-visor-img]')!;
  const legenda = visor.querySelector<HTMLElement>('[data-visor-legenda]')!;
  const zoomTxt = visor.querySelector<HTMLElement>('[data-visor-zoom]')!;

  let largura = 1;
  let altura = 1;
  let escala = 1;
  let ajuste = 1; // escala que enquadra a imagem no palco
  let x = 0;
  let y = 0;
  let origem: HTMLElement | null = null;

  const ponteiros = new Map<number, { x: number; y: number }>();
  let pinca: { dist: number; escala: number; cx: number; cy: number } | null = null;
  let arrasto: { x: number; y: number; px: number; py: number } | null = null;
  let ultimoToque = 0;
  let ultimoTipo = 'mouse';

  const limites = () => {
    const r = palco.getBoundingClientRect();
    return { w: r.width, h: r.height, left: r.left, top: r.top };
  };

  const prender = () => {
    const { w, h } = limites();
    const lw = largura * escala;
    const lh = altura * escala;
    // Se a imagem é menor que o palco, centraliza; senão, impede que saia da vista.
    x = lw <= w ? (w - lw) / 2 : Math.min(0, Math.max(w - lw, x));
    y = lh <= h ? (h - lh) / 2 : Math.min(0, Math.max(h - lh, y));
  };

  const aplicar = () => {
    prender();
    img.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${escala})`;
    zoomTxt.textContent = `${Math.round(escala * 100)}%`;
  };

  const enquadrar = () => {
    const { w, h } = limites();
    const margem = 24;
    ajuste = Math.min((w - margem * 2) / largura, (h - margem * 2) / altura, 1);
    escala = ajuste;
    x = (w - largura * escala) / 2;
    y = (h - altura * escala) / 2;
    aplicar();
  };

  /** Amplia mantendo fixo o ponto (px, py) em coordenadas da janela. */
  const zoomEm = (nova: number, px: number, py: number) => {
    const { left, top } = limites();
    const min = ajuste * MIN_REL;
    const max = Math.max(MAX_ABS, ajuste);
    nova = Math.min(max, Math.max(min, nova));
    const lx = px - left;
    const ly = py - top;
    x = lx - ((lx - x) * nova) / escala;
    y = ly - ((ly - y) * nova) / escala;
    escala = nova;
    aplicar();
  };

  const centro = () => {
    const { left, top, w, h } = limites();
    return [left + w / 2, top + h / 2] as const;
  };

  const abrir = (btn: HTMLElement) => {
    origem = btn;
    largura = Number(btn.dataset.largura) || 2000;
    altura = Number(btn.dataset.altura) || 1500;
    legenda.textContent = btn.dataset.legenda ?? '';
    img.alt = btn.querySelector('img')?.alt ?? '';
    img.width = largura;
    img.height = altura;
    // Mostra a versão do feed (já em cache) enquanto a alta resolução carrega.
    const previa = btn.querySelector('img');
    img.src = previa?.currentSrc || previa?.src || '';
    const alta = new Image();
    alta.onload = () => {
      if (origem === btn) img.src = alta.src;
    };
    alta.src = btn.dataset.src ?? img.src;

    visor.showModal();
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(enquadrar);
  };

  const fechar = () => {
    if (visor.open) visor.close();
  };

  visor.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    ponteiros.clear();
    pinca = null;
    arrasto = null;
    origem?.focus({ preventScroll: true });
  });

  document.addEventListener('click', (ev) => {
    const btn = (ev.target as Element).closest<HTMLElement>('[data-lightbox]');
    if (!btn) return;
    ev.preventDefault();
    abrir(btn);
  });

  visor.querySelectorAll<HTMLButtonElement>('[data-visor-acao]').forEach((b) =>
    b.addEventListener('click', () => {
      const [cx, cy] = centro();
      switch (b.dataset.visorAcao) {
        case 'ampliar':
          return zoomEm(escala * 1.5, cx, cy);
        case 'reduzir':
          return zoomEm(escala / 1.5, cx, cy);
        case 'enquadrar':
          return enquadrar();
        case 'fechar':
          return fechar();
      }
    }),
  );

  // Roda / trackpad (ctrlKey = gesto de pinça no trackpad)
  palco.addEventListener(
    'wheel',
    (ev) => {
      ev.preventDefault();
      const fator = Math.exp(-ev.deltaY * (ev.ctrlKey ? 0.01 : 0.0018));
      zoomEm(escala * fator, ev.clientX, ev.clientY);
    },
    { passive: false },
  );

  palco.addEventListener('pointerdown', (ev) => {
    ultimoTipo = ev.pointerType;
    palco.setPointerCapture(ev.pointerId);
    ponteiros.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (ponteiros.size === 2) {
      const [a, b] = [...ponteiros.values()];
      pinca = {
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        escala,
        cx: (a.x + b.x) / 2,
        cy: (a.y + b.y) / 2,
      };
      arrasto = null;
    } else if (ponteiros.size === 1) {
      arrasto = { x, y, px: ev.clientX, py: ev.clientY };
      palco.classList.add('arrastando');
    }
  });

  palco.addEventListener('pointermove', (ev) => {
    if (!ponteiros.has(ev.pointerId)) return;
    ponteiros.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (pinca && ponteiros.size >= 2) {
      const [a, b] = [...ponteiros.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const cx = (a.x + b.x) / 2;
      const cy = (a.y + b.y) / 2;
      // move junto com o centro da pinça e amplia em torno dele
      x += cx - pinca.cx;
      y += cy - pinca.cy;
      pinca.cx = cx;
      pinca.cy = cy;
      zoomEm(pinca.escala * (dist / pinca.dist), cx, cy);
    } else if (arrasto) {
      x = arrasto.x + (ev.clientX - arrasto.px);
      y = arrasto.y + (ev.clientY - arrasto.py);
      aplicar();
    }
  });

  const soltar = (ev: PointerEvent) => {
    ponteiros.delete(ev.pointerId);
    if (ponteiros.size < 2) pinca = null;
    if (ponteiros.size === 1) {
      const [p] = [...ponteiros.values()];
      arrasto = { x, y, px: p.x, py: p.y };
    } else if (ponteiros.size === 0) {
      arrasto = null;
      palco.classList.remove('arrastando');
    }
  };
  palco.addEventListener('pointerup', (ev) => {
    // toque duplo em telas sensíveis ao toque
    if (ev.pointerType === 'touch' && ponteiros.size === 1) {
      const agora = performance.now();
      if (agora - ultimoToque < 280) alternar(ev.clientX, ev.clientY);
      ultimoToque = agora;
    }
    soltar(ev);
  });
  palco.addEventListener('pointercancel', soltar);

  const alternar = (px: number, py: number) => {
    if (escala > ajuste * 1.05) enquadrar();
    else zoomEm(Math.max(ajuste * 2.5, Math.min(1, MAX_ABS)), px, py);
  };
  palco.addEventListener('dblclick', (ev) => {
    if (ultimoTipo !== 'touch') alternar(ev.clientX, ev.clientY);
  });

  visor.addEventListener('keydown', (ev) => {
    const [cx, cy] = centro();
    const passo = 60;
    switch (ev.key) {
      case '+':
      case '=':
        zoomEm(escala * 1.25, cx, cy);
        break;
      case '-':
      case '_':
        zoomEm(escala / 1.25, cx, cy);
        break;
      case '0':
        enquadrar();
        break;
      case 'ArrowLeft':
        x += passo;
        aplicar();
        break;
      case 'ArrowRight':
        x -= passo;
        aplicar();
        break;
      case 'ArrowUp':
        y += passo;
        aplicar();
        break;
      case 'ArrowDown':
        y -= passo;
        aplicar();
        break;
      default:
        return;
    }
    ev.preventDefault();
  });

  window.addEventListener('resize', () => visor.open && enquadrar());
}
