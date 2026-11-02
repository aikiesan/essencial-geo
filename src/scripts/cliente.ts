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
  const raiz = document.documentElement;
  const definir = (aberto: boolean) => {
    raiz.classList.toggle('menu-aberto', aberto);
    botao.setAttribute('aria-expanded', String(aberto));
    botao.setAttribute('aria-label', (aberto ? botao.dataset.rotuloFechar : botao.dataset.rotuloAbrir) ?? 'Menu');
    if (aberto) esq.parentElement?.scrollTo(0, 0);
  };
  botao.addEventListener('click', () => definir(!raiz.classList.contains('menu-aberto')));
  // Esc fecha; escolher um link também (a página muda, mas âncoras na mesma página não).
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && raiz.classList.contains('menu-aberto')) {
      definir(false);
      botao.focus();
    }
  });
  esq.addEventListener('click', (ev) => {
    if ((ev.target as Element).closest('a')) definir(false);
  });
  // Ao alargar a janela, o painel deixa de existir: fecha para não travar a rolagem.
  matchMedia('(min-width: 860px)').addEventListener('change', (m) => m.matches && definir(false));
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

/* ---------- Gaveta da ficha: abre pela direita ao clicar ----------------- */
function iniciarGaveta() {
  const gaveta = document.querySelector<HTMLDialogElement>('[data-gaveta]');
  if (!gaveta || typeof gaveta.showModal !== 'function') return;
  const corpo = gaveta.querySelector<HTMLElement>('[data-gaveta-corpo]');
  const fichas = $$('[data-ficha-de]', gaveta);
  let origem: HTMLElement | null = null;

  document.addEventListener('click', (ev) => {
    const gatilho = (ev.target as Element).closest<HTMLElement>('[data-abrir-ficha]');
    if (!gatilho) return;
    const alvo = fichas.find((f) => f.dataset.fichaDe === gatilho.dataset.abrirFicha);
    if (!alvo) return; // sem ficha nesta página: o link leva à página do mapa
    ev.preventDefault();
    fichas.forEach((f) => (f.hidden = f !== alvo));
    origem = gatilho;
    gaveta.showModal();
    if (corpo) corpo.scrollTop = 0;
    document.documentElement.style.overflow = 'hidden';
  });

  gaveta.querySelector('[data-gaveta-fechar]')?.addEventListener('click', () => gaveta.close());
  // Clique fora do painel (no fundo escurecido) fecha a gaveta.
  gaveta.addEventListener('click', (ev) => {
    if (ev.target === gaveta) gaveta.close();
  });
  gaveta.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    origem?.focus({ preventScroll: true });
  });
}

/* ---------- Versões da imagem na página do mapa ------------------------- */
// Prancha, figura sem moldura e figura sem mapa de base: abas que trocam o painel visível.
function iniciarVersoes() {
  $$('[data-versoes]').forEach((fig) => {
    const abas = $$<HTMLButtonElement>('[data-versao]', fig);
    const paineis = $$('[data-painel-versao]', fig);
    const escolher = (aba: HTMLButtonElement, foco = false) => {
      abas.forEach((a) => a.setAttribute('aria-pressed', String(a === aba)));
      paineis.forEach((p) => (p.hidden = p.dataset.painelVersao !== aba.dataset.versao));
      if (foco) aba.focus();
    };
    abas.forEach((aba, i) => {
      aba.addEventListener('click', () => escolher(aba));
      // Setas esquerda/direita percorrem as abas, como num grupo de abas.
      aba.addEventListener('keydown', (ev) => {
        const passo = ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowLeft' ? -1 : 0;
        if (!passo) return;
        ev.preventDefault();
        escolher(abas[(i + passo + abas.length) % abas.length], true);
      });
    });
  });
}

/* ---------- Galeria da página inicial: busca e filtros ------------------- */
// Coleção, tema, recorte e texto livre; o estado fica na URL (?colecao=…&tema=…&recorte=…&q=…).
const semAcento = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

function iniciarGaleria() {
  const form = document.querySelector<HTMLFormElement>('[data-filtros]');
  const itens = $$('[data-galeria] > li');
  if (!form || !itens.length) return;
  const contagem = form.querySelector<HTMLElement>('[data-filtro-contagem]');
  const vazio = document.querySelector<HTMLElement>('[data-galeria-vazia]');
  const modelo = contagem?.dataset.modelo ?? '{n} / {total}';
  const campos = ['colecao', 'tema', 'recorte', 'q'] as const;

  const ler = () => {
    const f = new FormData(form);
    return Object.fromEntries(campos.map((c) => [c, String(f.get(c) ?? '')])) as Record<(typeof campos)[number], string>;
  };

  const aplicar = (gravar = true) => {
    const v = ler();
    const termos = semAcento(v.q).split(/\s+/).filter(Boolean);
    let n = 0;
    itens.forEach((li) => {
      const d = li.dataset;
      const ok =
        (!v.colecao || d.colecao === v.colecao) &&
        (!v.tema || d.tema === v.tema) &&
        (!v.recorte || d.recorte === v.recorte) &&
        termos.every((t) => (d.busca ?? '').includes(t));
      li.hidden = !ok;
      if (ok) n++;
    });
    if (contagem) contagem.textContent = modelo.replace('{n}', String(n)).replace('{total}', String(itens.length));
    if (vazio) vazio.hidden = n > 0;
    if (gravar) {
      const u = new URL(location.href);
      campos.forEach((c) => (v[c] ? u.searchParams.set(c, v[c]) : u.searchParams.delete(c)));
      history.replaceState(null, '', u);
    }
  };

  // Estado inicial a partir da URL (?tag= também vale, como busca).
  const params = new URLSearchParams(location.search);
  campos.forEach((c) => {
    const valor = params.get(c) ?? (c === 'q' ? params.get('tag') : null);
    if (!valor) return;
    const el = form.elements.namedItem(c);
    if (el instanceof RadioNodeList) el.value = valor;
    else if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) el.value = valor;
  });

  let espera = 0;
  form.addEventListener('input', (ev) => {
    window.clearTimeout(espera);
    const texto = (ev.target as Element).matches('input[type="search"]');
    espera = window.setTimeout(() => aplicar(), texto ? 140 : 0);
  });
  form.addEventListener('submit', (ev) => ev.preventDefault());
  form.addEventListener('reset', () => window.setTimeout(() => aplicar()));
  aplicar(false);
}

iniciarTema();
iniciarMenu();
iniciarGaleria();
iniciarVersoes();
iniciarCitacoes();
iniciarGaveta();
iniciarVisor();
