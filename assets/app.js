/* Booker Liao — CV. Language switching, reveal, marquee, numbers, cursor light, mail form. No dependencies. */
(() => {
  const html = document.documentElement;
  html.classList.remove('no-js');
  const LANGS = ['zh-TW', 'en', 'pt'];
  const STORE = 'cv.lang';
  const GITHUB_URL = 'https://github.com/booker1207';

  /* ---------- i18n ---------- */
  const dict = window.I18N || {};
  const t = (lang, key) => (dict[lang] && dict[lang][key]) ?? (dict.en && dict.en[key]) ?? '';

  function checkKeys() {
    const all = new Set();
    LANGS.forEach(l => Object.keys(dict[l] || {}).forEach(k => all.add(k)));
    LANGS.forEach(l => {
      const missing = [...all].filter(k => !(k in (dict[l] || {})));
      if (missing.length) console.warn(`[i18n] ${l} is missing:`, missing);
    });
  }

  function normalize(code) {
    if (!code) return null;
    code = String(code);
    if (/^zh/i.test(code)) return 'zh-TW';
    if (/^pt/i.test(code)) return 'pt';
    if (/^en/i.test(code)) return 'en';
    return null;
  }

  function resolveLang() {
    const url = new URL(location.href);
    const fromQuery = normalize(url.searchParams.get('lang'));
    const fromHash = normalize((location.hash.match(/lang=([\w-]+)/) || [])[1]);
    let stored = null;
    try { stored = normalize(localStorage.getItem(STORE)); } catch (e) {}
    const fromNav = normalize((navigator.languages || [navigator.language]).find(l => normalize(l)));
    return fromQuery || fromHash || stored || fromNav || 'en';
  }

  function applyLang(lang, { animate = true, pushUrl = true } = {}) {
    if (!LANGS.includes(lang)) lang = 'en';
    html.lang = lang;
    document.title = t(lang, 'meta.title');
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.content = t(lang, 'meta.description');

    if (animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.remove('swapping');
      void document.body.offsetWidth; // restart the animation
      document.body.classList.add('swapping');
      setTimeout(() => document.body.classList.remove('swapping'), 420);
    }

    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(lang, el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(lang, el.dataset.i18nHtml); });
    document.querySelectorAll('[data-i18n-list]').forEach(el => {
      const items = t(lang, el.dataset.i18nList);
      el.textContent = '';
      (Array.isArray(items) ? items : []).forEach(s => { const li = document.createElement('li'); li.textContent = s; el.appendChild(li); });
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(lang, el.dataset.i18nPh); });
    document.querySelectorAll('[data-i18n-alt]').forEach(el => { el.alt = t(lang, el.dataset.i18nAlt); });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(lang, el.dataset.i18nAria)); });
    document.querySelectorAll('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));

    try { localStorage.setItem(STORE, lang); } catch (e) {}
    if (pushUrl) {
      const url = new URL(location.href);
      url.searchParams.set('lang', lang);
      history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
    renderTools(lang);
  }

  /* ---------- Toolbox marquee ---------- */
  // Icons come from Simple Icons; if the CDN is unreachable the text label still reads.
  const TOOLS = [
    ['Swift', 'swift'], ['Flutter', 'flutter'], ['Dart', 'dart'], ['TypeScript', 'typescript'], ['JavaScript', 'javascript'],
    ['Node.js', 'nodedotjs'], ['React', 'react'], ['Next.js', 'nextdotjs'], ['Expo', 'expo'], ['Vue.js', 'vuedotjs'],
    ['Nuxt', 'nuxtdotjs'], ['Electron', 'electron'], ['Socket.IO', 'socketdotio'], ['Vite', 'vite'], ['Tailwind CSS', 'tailwindcss'],
    ['Python', 'python'], ['FastAPI', 'fastapi'], ['SQLAlchemy', 'sqlalchemy'], ['Selenium', 'selenium'], ['Playwright', 'playwright'],
    ['PostgreSQL', 'postgresql'], ['Prisma', 'prisma'], ['SQLite', 'sqlite'], ['Docker', 'docker'], ['Google Cloud', 'googlecloud'],
    ['Nginx', 'nginx'], ['Apache', 'apache'], ['Cloudflare', 'cloudflare'], ['Firebase', 'firebase'], ['Stripe', 'stripe'],
    ['Solidity', 'solidity'], ['Foundry', 'foundry'], ['TRON', 'tron'], ['Telegram', 'telegram'], ['LINE', 'line'],
    ['Git', 'git'], ['GitHub', 'github'], ['pnpm', 'pnpm'], ['Turborepo', 'turborepo'], ['Jest', 'jest'],
    ['Vitest', 'vitest'], ['OpenAPI', 'openapiinitiative'], ['PHP', 'php'], ['Claude', 'claude']
  ];
  let toolsRendered = false;
  function renderTools() {
    if (toolsRendered) return;
    toolsRendered = true;
    const track = document.getElementById('tools-track');
    const list = document.getElementById('tools-list');
    if (!track) return;
    const make = ([name, slug]) => {
      const el = document.createElement('span');
      el.className = 'tool';
      const img = document.createElement('img');
      img.src = `https://cdn.jsdelivr.net/npm/simple-icons@13/icons/${slug}.svg`;
      img.alt = ''; img.width = 26; img.height = 26; img.loading = 'lazy';
      img.onerror = () => el.classList.add('noicon');
      const fb = document.createElement('span');
      fb.className = 'fallback'; fb.textContent = name.slice(0, 2).toUpperCase();
      const label = document.createElement('span'); label.textContent = name;
      el.append(img, fb, label);
      return el;
    };
    // two copies make the loop seamless (translateX(-50%))
    [...TOOLS, ...TOOLS].forEach(tool => track.appendChild(make(tool)));
    const track2 = document.getElementById('tools-track-2');
    if (track2) { const half = Math.ceil(TOOLS.length / 2); const rot = [...TOOLS.slice(half), ...TOOLS.slice(0, half)]; [...rot, ...rot].forEach(tool => track2.appendChild(make(tool))); }
    if (list) TOOLS.forEach(([name]) => { const li = document.createElement('li'); li.textContent = name; list.appendChild(li); });
  }

  /* ---------- Reveal on scroll ---------- */
  // Tiles already on screen at load are never hidden. Tiles below the fold get .pending and
  // enter when they come into view; both an IntersectionObserver and a scroll check drive it.
  function setupReveal() {
    const items = [...document.querySelectorAll('.reveal')];
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const pending = items.filter(el => el.getBoundingClientRect().top > innerHeight + 40);
    pending.forEach(el => el.classList.add('pending'));
    if (!pending.length) return;
    const show = el => { el.classList.add('in'); };
    const check = () => {
      pending.forEach(el => {
        if (el.classList.contains('in')) return;
        const r = el.getBoundingClientRect();
        if (r.top < innerHeight * 0.92 && r.bottom > 0) show(el);
      });
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
      pending.forEach(el => io.observe(el));
    }
    // plain time throttle rather than rAF: rAF is paused in background tabs and embedded panes
    let last = 0;
    const onScroll = () => { const now = Date.now(); if (now - last > 60) { last = now; check(); } };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
    document.addEventListener('visibilitychange', check);
    window.addEventListener('beforeprint', () => pending.forEach(show));
    setTimeout(check, 600);
    setTimeout(check, 2000);
  }

  /* ---------- Counting numbers ---------- */
  function setupCounts() {
    const nums = document.querySelectorAll('.count');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const run = el => {
      if (el.dataset.done) return;
      el.dataset.done = '1';
      const target = Number(el.dataset.count || 0), suffix = el.dataset.suffix || '';
      if (reduce) { el.textContent = target + suffix; return; }
      const start = performance.now(), dur = 1400;
      const tick = now => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + (p === 1 ? suffix : '');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.4 });
    nums.forEach(el => io.observe(el));
    const finish = () => nums.forEach(el => { el.dataset.done = '1'; el.textContent = (el.dataset.count || 0) + (el.dataset.suffix || ''); });
    window.addEventListener('beforeprint', finish);
    setTimeout(() => nums.forEach(el => { if (!el.dataset.done) finish(); }), 4000);
  }

  /* ---------- Cursor light on tiles ---------- */
  function setupLight() {
    const board = document.querySelector('.board');
    if (!board || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    board.classList.add('lit');
    let raf = 0, last = null;
    board.addEventListener('pointermove', e => {
      last = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const tile = last.target.closest('.tile');
        if (!tile) return;
        const r = tile.getBoundingClientRect();
        tile.style.setProperty('--mx', `${last.clientX - r.left}px`);
        tile.style.setProperty('--my', `${last.clientY - r.top}px`);
      });
    }, { passive: true });
  }

  /* ---------- Mail form (no backend: composes a mailto) ---------- */
  function setupForm() {
    const form = document.getElementById('mailform');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.name.value.trim();
      const msg = form.message.value.trim();
      const subject = encodeURIComponent(name ? `Hello from ${name}` : 'Hello Booker');
      const body = encodeURIComponent(msg + (name ? `\n\n— ${name}` : ''));
      location.href = `mailto:booker.ycliao@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  /* ---------- Controls ---------- */
  function setupControls() {
    document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));
    const print = document.getElementById('print');
    if (print) print.addEventListener('click', () => window.print());
    document.addEventListener('keydown', e => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
      if (e.key === '1') applyLang('zh-TW');
      else if (e.key === '2') applyLang('en');
      else if (e.key === '3') applyLang('pt');
      else if (e.key === 'p' || e.key === 'P') { e.preventDefault(); window.print(); }
    });
    const gh = document.getElementById('github');
    if (gh) gh.href = GITHUB_URL;
    // keep the chosen language on in-page anchors
    window.addEventListener('hashchange', () => {
      const l = normalize((location.hash.match(/lang=([\w-]+)/) || [])[1]);
      if (l && l !== html.lang) applyLang(l);
    });
  }

  /* ---------- Capture mode (screenshots): decode every image before marking ready ---------- */
  function setupCapture() {
    const qs = new URL(location.href).searchParams;
    if (!qs.has('capture')) return;
    if (qs.get('nav') === '0') html.classList.add('no-nav'); // share-card phone mockup: content only
    const imgs = [...document.images].filter(i => !i.closest('.tool')); // toolbox icons have a text fallback
    imgs.forEach(i => { i.decoding = 'sync'; i.loading = 'eager'; });
    let failed = 0; const bad = [];
    const settle = img => new Promise(r => {
      const done = () => { if (!img.naturalWidth) { failed++; bad.push(img.getAttribute('src')); } r(); };
      const dec = () => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()).then(done);
      if (img.complete) dec(); else { img.addEventListener('load', dec, { once: true }); img.addEventListener('error', done, { once: true }); }
    });
    Promise.all(imgs.map(settle)).then(() => { html.dataset.ready = failed ? 'err' + failed : '1'; if (failed) html.dataset.readyErr = bad.slice(0, 20).join(' '); });
  }

  /* ---------- Boot ---------- */
  checkKeys();
  applyLang(resolveLang(), { animate: false });
  setupControls();
  setupReveal();
  setupCounts();
  setupLight();
  setupForm();
  setupCapture();
})();
