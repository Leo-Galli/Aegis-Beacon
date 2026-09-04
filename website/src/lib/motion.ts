/* ============================================================
   Aegis-Beacon motion engine
   Lightweight, dependency-free, cross-browser.

   - Scroll-reveal: every [data-rv] element is hidden on boot
     (html.motion-ok) and fades up when it enters the viewport.
     Optional per-element stagger via the --rv-delay property.
   - Section focus: .prose-wiki headings get .is-in while they
     are the section being read (used by CSS emphasis).
   - Mouse spotlight: [data-glow] cards get a soft radial glow
     that tracks the cursor.
   - Parallax: [data-parallax] translates gently on scroll.
   - Count-up: [data-count] animates its numeric text once.
   Everything respects prefers-reduced-motion.
   ============================================================ */

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── 1. Scroll reveal ─────────────────────────────────────── */
export function initReveal() {
  if (prefersReduced || !('IntersectionObserver' in window)) {
    // No motion needed: make sure nothing is stuck hidden.
    document.querySelectorAll('[data-rv], .rv-item').forEach((el) => {
      el.classList.add('is-in');
    });
    document.documentElement.classList.add('motion-ok');
    return;
  }
  document.documentElement.classList.add('motion-ok');

  // Wiki prose headings animate in as the reader reaches them.
  const prose = Array.from(
    document.querySelectorAll<HTMLElement>('.prose-wiki h2, .prose-wiki h3')
  );
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-rv]')).concat(prose);
  if (targets.length === 0) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.classList.add('is-in');
          io.unobserve(el);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  targets.forEach((t) => io.observe(t));
}

/* ── 2. Cursor spotlight on cards (data-glow / card classes) ─ */
export function initGlowCards() {
  if (prefersReduced || !window.matchMedia('(pointer: fine)').matches) return;

  const cards = Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-glow], .feature-card, .mode-card, .tech-chip'
    )
  );
  cards.forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--gx', `${x}px`);
      card.style.setProperty('--gy', `${y}px`);
    });
  });
}

/* ── 3. Gentle parallax (data-parallax) ───────────────────── */
export function initParallax() {
  if (prefersReduced || !window.matchMedia('(pointer: fine)').matches) return;

  const layers = Array.from(
    document.querySelectorAll<HTMLElement>('[data-parallax]')
  );
  if (layers.length === 0 || !('IntersectionObserver' in window)) return;

  const applyParallax = (els: HTMLElement[]) => {
    for (const el of els) {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) continue;
      const speed = parseFloat(el.dataset.parallax || '0.15');
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh; // -0.5..0.5
      const shift = progress * speed * 100; // px offset
      // Only the transform on the element (its parent keeps layout).
      el.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
    }
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => applyParallax(layers));
        }
      }
    },
    { threshold: 0.05 }
  );
  layers.forEach((el) => io.observe(el));

  let ticking = false;

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          applyParallax(layers);
          ticking = false;
        });
      }
    },
    { passive: true }
  );
}

/* ── 4. Number count-up (data-count) ──────────────────────── */
export function initCounters() {
  if (prefersReduced) return;
  const els = Array.from(
    document.querySelectorAll<HTMLElement>('[data-count]')
  );
  if (els.length === 0) return;

  const parseNum = (text: string): { prefix: string; num: number; suffix: string } => {
    const m = text.match(/^(.*?)([\d.,]+)(.*)$/);
    if (!m) return { prefix: '', num: 0, suffix: '' };
    return {
      prefix: m[1],
      num: parseFloat(m[2].replace(/,/g, '')),
      suffix: m[3],
    };
  };

  const animate = (el: HTMLElement) => {
    const original = el.textContent || '';
    const { prefix, num, suffix } = parseNum(original);
    if (!num) return;
    const duration = 1100;
    const start = performance.now();
    const format = (v: number) =>
      (Number.isInteger(num) ? Math.round(v).toString() : v.toFixed(1));
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + format(num * eased) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          animate(entry.target as HTMLElement);
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.6 }
  );
  els.forEach((el) => io.observe(el));
}

/* ── Boot ─────────────────────────────────────────────────── */
export function initMotion() {
  initReveal();
  initGlowCards();
  initParallax();
  initCounters();
}
