/**
 * Comportamentos do cliente. Tudo é aprimoramento progressivo:
 * sem JavaScript o site continua navegável, legível e com downloads.
 */
import { iniciarVisor } from './visor';

const $$ = <T extends Element = HTMLElement>(sel: string, raiz: ParentNode = document) =>
  Array.from(raiz.querySelectorAll<T>(sel));

/* ---------- Tema: papel ⇄ nanquim ---------------------------------------- */
function iniciarTema() {
  const raiz = document.documentElement;
  // Os nomes do tema ("papel/nanquim", "paper/ink") vêm do botão, na língua da página.
  const botao = document.querySelector<HTMLElement>('[data-tema-botao]');
  const nomes: Record<string, string> = {
    claro: botao?.dataset.nomeClaro ?? 'papel',
    escuro: botao?.dataset.nomeEscuro ?? 'nanquim',
  };
  const atualizar = () => $$('[data-tema-nome]').forEach((el) => (el.textContent = nomes[raiz.dataset.tema ?? 'claro']));
  atualizar();
  $$('[data-tema-botao]').forEach((b) =>
    b.addEventListener('click', () => {
      raiz.dataset.tema = raiz.dataset.tema === 'escuro' ? 'claro' : 'escuro';
      try {
        localStorage.setItem('eg-tema', raiz.dataset.tema);
      } catch {
        /* navegação privada: o tema vale só para esta página */
      }
      atualizar();
    }),
  );
}

/* ---------- Menu recolhível (telas estreitas) ---------------------------- */
function iniciarMenu() {
  const esq = document.querySelector<HTMLElement>('[data-esq]');
  const botao = document.querySelector<HTMLButtonElement>('[data-menu]');
  if (!esq || !botao) return;
  botao.addEventListener('click', () => {
    const aberto = esq.toggleAttribute('data-aberto');
    botao.setAttribute('aria-expanded', String(aberto));
  });
}

/* ---------- Citação: abas, data de acesso e cópia ------------------------ */
// A data de acesso só aparece na ABNT, que é sempre em português.
const MESES = ['jan.', 'fev.', 'mar.', 'abr.', 'maio', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];

function iniciarCitacoes() {
  const h = new Date();
  const hoje = `${h.getDate()} ${MESES[h.getMonth()]} ${h.getFullYear()}`;
  $$('[data-acesso]').forEach((el) => (el.textContent = hoje));

  $$('[data-citacao]').forEach((bloco) => {
    const abas = $$<HTMLButtonElement>('[data-formato]', bloco);
    const corpos = $$('[data-bloco]', bloco);
    abas.forEach((aba) =>
      aba.addEventListener('click', () => {
        abas.forEach((a) => a.setAttribute('aria-pressed', String(a === aba)));
        corpos.forEach((c) => (c.hidden = c.dataset.bloco !== aba.dataset.formato));
      }),
    );

    const copiar = bloco.querySelector<HTMLButtonElement>('[data-copiar]');
    const rotulo = bloco.querySelector<HTMLElement>('[data-copiar-rotulo]');
    copiar?.addEventListener('click', async () => {
      const visivel = corpos.find((c) => !c.hidden);
      const texto = (visivel?.textContent ?? '').replace(/\s+\n/g, '\n').trim();
      const ok = await copiarTexto(texto);
      if (!rotulo) return;
      const r = copiar.dataset;
      rotulo.textContent = ok ? (r.rotuloCopiado ?? 'Citação copiada') : (r.rotuloManual ?? 'Selecione e copie (Ctrl+C)');
      copiar.toggleAttribute('data-copiado', ok);
      if (!ok && visivel) selecionar(visivel);
      window.setTimeout(() => {
        rotulo.textContent = copiar.dataset.rotuloCopiar ?? 'Copiar citação';
        copiar.removeAttribute('data-copiado');
      }, 2200);
    });
  });
}

async function copiarTexto(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = texto;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    area.remove();
    return ok;
  }
}

function selecionar(el: Element) {
  const s = window.getSelection();
  const r = document.createRange();
  r.selectNodeContents(el);
  s?.removeAllRanges();
  s?.addRange(r);
}

/* ---------- Painel direito acompanha o cartão em foco -------------------- */
function iniciarPainel() {
  const fichas = $$('[data-ficha-de]');
  if (fichas.length < 2) return;
  const cartoes = $$('[data-mapa]');
  const indicador = document.querySelector<HTMLElement>('[data-painel-indice]');
  let atual = fichas.find((f) => !f.hidden)?.dataset.fichaDe;

  const mostrar = (id: string) => {
    if (id === atual) return;
    atual = id;
    fichas.forEach((f) => (f.hidden = f.dataset.fichaDe !== id));
    if (indicador) {
      const i = cartoes.findIndex((c) => c.dataset.mapa === id);
      indicador.textContent = `${String(i + 1).padStart(2, '0')} / ${String(cartoes.length).padStart(2, '0')}`;
    }
  };

  // O cartão "em foco" é o que cruza a faixa a ~35% da altura da janela.
  const visiveis = new Map<string, number>();
  const obs = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        const id = (e.target as HTMLElement).dataset.mapa!;
        if (e.isIntersecting) visiveis.set(id, e.boundingClientRect.top);
        else visiveis.delete(id);
      }
      const primeiro = cartoes.find((c) => visiveis.has(c.dataset.mapa!));
      if (primeiro) mostrar(primeiro.dataset.mapa!);
    },
    { rootMargin: '-35% 0px -60% 0px' },
  );
  cartoes.forEach((c) => obs.observe(c));
}

iniciarTema();
iniciarMenu();
iniciarCitacoes();
iniciarPainel();
iniciarVisor();
