(() => {
  const arabic = document.documentElement.lang === 'ar';
  const header = document.getElementById('hd');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 8);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Content is visible before JavaScript runs; observation only adds an entrance effect.
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealing');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01 });
    document.querySelectorAll('.rv').forEach(element => observer.observe(element));
  }

  const menus = document.querySelectorAll('.mobile-menu, .mail-options');
  document.addEventListener('click', event => {
    menus.forEach(menu => {
      if (!menu.contains(event.target)) menu.open = false;
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    menus.forEach(menu => {
      if (menu.open) {
        menu.open = false;
        menu.querySelector('summary').focus();
      }
    });
  });
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      link.closest('details').open = false;
      if (link.hash) {
        const target = document.getElementById(link.hash.slice(1));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      }
    });
  });
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      const status = button.parentElement.querySelector('.copy-status');
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        status.textContent = arabic ? 'تم نسخ عنوان البريد.' : 'Email address copied.';
      } catch {
        status.textContent = (arabic ? 'انسخ العنوان يدويًا: ' : 'Copy this address manually: ') + button.dataset.copy;
      }
    });
  });

  const list = document.querySelector('.hmeta ul');
  if (list) {
    const mark = () => {
      let previous = null;
      [...list.children].forEach(item => {
        item.classList.toggle('ls', !previous || item.offsetTop > previous.offsetTop + 2);
        previous = item;
      });
    };
    mark();
    if (document.fonts) document.fonts.ready.then(mark);
    if ('ResizeObserver' in window) new ResizeObserver(mark).observe(list);
    else window.addEventListener('resize', mark);
  }
})();
