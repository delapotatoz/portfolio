(() => {
  const root = document.documentElement;

  // ---------- Thème ----------
  const toggle = document.querySelector('.theme-toggle');
  try {
    const saved = localStorage.getItem('md-theme');
    if (saved) root.dataset.theme = saved;
  } catch (e) { /* stockage indisponible */ }

  toggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('md-theme', next); } catch (e) {}
  });

  // ---------- Heure à Lille ----------
  const clock = document.getElementById('clock');
  const fmt = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris'
  });
  const tick = () => { clock.textContent = fmt.format(new Date()); };
  tick();
  setInterval(tick, 30000);

  document.getElementById('year').textContent = new Date().getFullYear();

  // ---------- Reveal au scroll ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // ---------- Compteurs ----------
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = +el.dataset.count;
    if (reduce) { el.textContent = target; return; }
    const start = performance.now() + 700;
    const dur = 1600;
    const step = (now) => {
      const t = Math.min(Math.max((now - start) / dur, 0), 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 4)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

  // ---------- Hero : morphing variable au survol ----------
  // Chaque lettre du nom varie en largeur (125 → 62) et en graisse (800 → 200)
  // selon sa distance au curseur. Les centres sont mesurés « au repos » pour
  // éviter que le changement de largeur ne fasse boucler le calcul.
  const hero = document.querySelector('.hero');
  const title = document.querySelector('.hero__title');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (title && finePointer && !reduce) {
    title.querySelectorAll('.line__inner').forEach((line) => {
      const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach((node) => {
        const frag = document.createDocumentFragment();
        [...node.textContent].forEach((ch) => {
          const span = document.createElement('span');
          span.className = 'char';
          span.textContent = ch;
          frag.appendChild(span);
        });
        node.replaceWith(frag);
      });
    });

    const chars = [...title.querySelectorAll('.char')].map((el) => ({
      el, x: 0, y: 0, v: 0, target: 0, last: ''
    }));
    let centers = false;
    const measure = () => {
      chars.forEach((c) => { c.el.style.fontVariationSettings = ''; c.last = ''; });
      chars.forEach((c) => {
        const r = c.el.getBoundingClientRect();
        c.x = r.left + r.width / 2 + window.scrollX;
        c.y = r.top + r.height / 2 + window.scrollY;
      });
      centers = true;
    };
    // Mesure après l'animation d'entrée et le chargement des polices
    const ready = Promise.all([document.fonts.ready, new Promise((r) => setTimeout(r, 1400))]);
    ready.then(measure);
    window.addEventListener('resize', () => { centers = false; ready.then(measure); });

    let mx = -1e4, my = -1e4, active = false, running = false;
    const radius = () => Math.max(window.innerWidth * 0.16, 160);

    const frame = () => {
      let moving = false;
      const R = radius();
      chars.forEach((c) => {
        if (active && centers) {
          const d = Math.hypot(mx - (c.x - window.scrollX), my - (c.y - window.scrollY));
          const t = Math.max(0, 1 - d / R);
          c.target = t * t * (3 - 2 * t); // smoothstep
        } else {
          c.target = 0;
        }
        c.v += (c.target - c.v) * 0.14;
        if (Math.abs(c.target - c.v) > 0.001) moving = true;
        const wdth = (125 - c.v * 63).toFixed(1);
        const wght = Math.round(800 - c.v * 600);
        const val = `"wdth" ${wdth}, "wght" ${wght}`;
        if (val !== c.last) { c.el.style.fontVariationSettings = val; c.last = val; }
      });
      if (moving) requestAnimationFrame(frame);
      else running = false;
    };
    const kick = () => { if (!running) { running = true; requestAnimationFrame(frame); } };

    hero.classList.add('has-pointer');
    hero.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY; active = true; kick();
    });
    hero.addEventListener('mouseleave', () => { active = false; kick(); });
    title.addEventListener('mouseenter', () => {
      title.classList.add('is-live');
      hero.classList.add('is-touched');
      document.querySelector('.cursor').classList.add('is-hero');
    });
    title.addEventListener('mouseleave', () => {
      title.classList.remove('is-live');
      document.querySelector('.cursor').classList.remove('is-hero');
    });
  }

  // ---------- Curseur ----------
  const cursor = document.querySelector('.cursor');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let x = 0, y = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', (e) => {
      x = e.clientX; y = e.clientY;
      cursor.classList.add('is-visible');
    });
    document.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));
    const loop = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.querySelectorAll('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
  }
})();
