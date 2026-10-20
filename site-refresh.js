(() => {
  const toggle = document.querySelector('#contactCardToggle');
  const panel = document.querySelector('#contactCardPanel');
  if (toggle && panel) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Kontaktkarte schließen' : 'Kontaktkarte öffnen');
      panel.hidden = !open;
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.contact-card')) setOpen(false);
    });
  }
})();
