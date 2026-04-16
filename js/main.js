/* Nav effets + burger + reveal + filtres galerie */
(() => {
  const nav = document.querySelector('.nav');
  const burger = document.querySelector('.burger');
  const links = document.querySelector('.nav-links');

  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      burger.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        links.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      })
    );
  }

  // Reveal
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && items.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.14 });
    items.forEach(el => io.observe(el));
  } else {
    items.forEach(el => el.classList.add('in'));
  }

  // Filtres galerie
  const filters = document.querySelectorAll('.gallery-filters button');
  const galleryItems = document.querySelectorAll('.gallery-grid [data-cat]');
  if (filters.length && galleryItems.length) {
    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        galleryItems.forEach(it => {
          const show = cat === 'all' || it.dataset.cat === cat;
          it.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // Accordéon appartements
  const aptRows = document.querySelectorAll('.apt-row');
  if (aptRows.length) {
    aptRows.forEach(row => {
      const head = row.querySelector('.apt-head');
      const panel = row.querySelector('.apt-panel');
      if (!head || !panel) return;
      head.setAttribute('aria-expanded', 'false');
      head.addEventListener('click', () => {
        const isOpen = row.classList.contains('open');
        if (isOpen) {
          panel.style.maxHeight = '0px';
          row.classList.remove('open');
          head.setAttribute('aria-expanded', 'false');
        } else {
          aptRows.forEach(r => {
            if (r !== row && r.classList.contains('open')) {
              r.classList.remove('open');
              r.querySelector('.apt-head').setAttribute('aria-expanded', 'false');
              const p = r.querySelector('.apt-panel');
              if (p) p.style.maxHeight = '0px';
            }
          });
          row.classList.add('open');
          head.setAttribute('aria-expanded', 'true');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    });
    window.addEventListener('resize', () => {
      document.querySelectorAll('.apt-row.open .apt-panel').forEach(p => {
        p.style.maxHeight = p.scrollHeight + 'px';
      });
    });
  }

  // Modale contact visite
  const visitModal = document.getElementById('visitModal');
  if (visitModal) {
    const openers = document.querySelectorAll('[data-visit-open]');
    const closeBtn = visitModal.querySelector('.visit-close');
    const open = () => {
      visitModal.classList.add('open');
      visitModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      visitModal.classList.remove('open');
      visitModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    openers.forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); open(); }));
    closeBtn && closeBtn.addEventListener('click', close);
    visitModal.addEventListener('click', (e) => { if (e.target === visitModal) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && visitModal.classList.contains('open')) close(); });
  }

  // Submit contact (mock)
  const form = document.querySelector('form.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Message envoyé ✓';
      btn.disabled = true;
      form.reset();
      setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 3500);
    });
  }
})();
