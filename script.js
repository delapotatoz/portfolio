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

  // ---------- Hero : traînée d'images au survol ----------
  // Un pool de cartes (visuels des projets + mots-clés) est recyclé : une carte
  // apparaît sous le curseur tous les `gap` pixels parcourus, puis s'efface.
  const hero = document.querySelector('.hero');
  const trail = document.querySelector('.hero__trail');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (trail && finePointer && !reduce) {
    const medias = [...document.querySelectorAll('.project__media')];
    const words = [
      ['Research', '#d4ff3f', '#0e0e0c'],
      ['Design<br>System', '#7b6cff', '#f1ede4'],
      ['UX / UI', '#ff5b2e', '#0e0e0c'],
      ['Proto&shy;type', '#2e5bff', '#f1ede4'],
      ['10+ ans', '#f1ede4', '#0e0e0c']
    ];
    const variants = [];
    medias.forEach((m, i) => {
      variants.push(() => {
        const card = document.createElement('div');
        card.className = 'trail-card';
        card.appendChild(m.cloneNode(true));
        return card;
      });
      if (words[i]) {
        const [label, bg, fg] = words[i];
        variants.push(() => {
          const card = document.createElement('div');
          card.className = 'trail-card trail-card--word';
          card.style.background = bg;
          card.style.color = fg;
          card.innerHTML = label;
          return card;
        });
      }
    });

    const POOL = 14;
    const pool = Array.from({ length: POOL }, (_, i) => {
      const card = variants[i % variants.length]();
      trail.appendChild(card);
      return card;
    });
    let idx = 0, lastX = null, lastY = null, z = 1;
    const gap = () => Math.max(window.innerWidth * 0.06, 70);

    const spawn = (x, y, dx, dy) => {
      const card = pool[idx];
      idx = (idx + 1) % POOL;
      const rect = trail.getBoundingClientRect();
      const w = card.offsetWidth, h = card.offsetHeight;
      const px = x - rect.left - w / 2;
      const py = y - rect.top - h / 2;
      const rot = (Math.random() - 0.5) * 16;
      card.style.zIndex = z++;
      card.getAnimations().forEach((a) => a.cancel());
      const expo = 'cubic-bezier(0.16, 1, 0.3, 1)';
      card.animate([
        { opacity: 1, transform: `translate(${px - dx * 0.6}px, ${py - dy * 0.6}px) scale(0.4) rotate(${rot * 2}deg)`, easing: expo },
        { opacity: 1, transform: `translate(${px}px, ${py}px) scale(1) rotate(${rot}deg)`, offset: 0.3 },
        { opacity: 1, transform: `translate(${px}px, ${py}px) scale(1) rotate(${rot}deg)`, offset: 0.62, easing: 'cubic-bezier(0.7, 0, 0.84, 0)' },
        { opacity: 0, transform: `translate(${px}px, ${py + 80}px) scale(0.6) rotate(${rot * 0.5}deg)` }
      ], { duration: 1500, fill: 'forwards' });
    };

    hero.classList.add('has-pointer');
    hero.addEventListener('mousemove', (e) => {
      if (lastX === null) { lastX = e.clientX; lastY = e.clientY; return; }
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      if (Math.hypot(dx, dy) < gap()) return;
      spawn(e.clientX, e.clientY, dx, dy);
      lastX = e.clientX; lastY = e.clientY;
      hero.classList.add('is-touched');
    });
    hero.addEventListener('mouseleave', () => { lastX = lastY = null; });
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
