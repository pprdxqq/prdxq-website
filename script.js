(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (menuButton && mobileNav) {
    const closeMenu = () => { menuButton.setAttribute('aria-expanded','false'); mobileNav.classList.remove('is-open'); mobileNav.setAttribute('aria-hidden','true'); document.body.classList.remove('menu-open'); };
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      mobileNav.classList.toggle('is-open', open);
      mobileNav.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('menu-open', open);
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), {threshold: 0.12, rootMargin: '0px 0px -35px 0px'});
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('visible'));

  // Language toggle uses a deliberately small, curated translation dictionary.
  const translations = {
    en: {
      'nav.home':'Home','nav.projects':'Projects','nav.services':'Services','nav.lab':'Lab','nav.about':'About','nav.contact':'Start a project',
      'hero.eyebrow':'INDEPENDENT DIGITAL STUDIO / LED BY ILIAS ASDUFAN',
      'hero.title1':'Ideas into','hero.title2':'digital reality.',
      'hero.description':'I design and build digital experiences, software and connected systems — from the first concept to the final implementation.',
      'hero.cta':'Start a project','hero.work':'Explore my work','hero.meta':'DESIGN · DEVELOPMENT · SYSTEMS',
      'projects.kicker':'01 / SELECTED WORK','projects.title':'Built with purpose.','projects.title2':'Designed to work.',
      'projects.copy':'A selection of digital products, websites and experiments — with the thinking and implementation behind them.',
      'services.kicker':'02 / CAPABILITIES','services.title':'One vision.','services.title2':'Every layer of execution.',
      'services.copy':'From interfaces and applications to automation and digital communication, I connect the pieces that make a solution work.',
      'process.kicker':'03 / HOW I WORK','process.title':'From first thought to final build.',
      'process.copy':'A clear process keeps the work focused, collaborative and grounded in the actual problem.',
      'founder.kicker':'04 / THE PERSON','founder.title':'Independent by design.','founder.title2':'Technical by nature.',
      'founder.copy':"I'm Ilias Asdufan. I bring design and development together to turn ideas into useful digital products. I enjoy understanding how things work, solving problems and building the solution myself.",
      'cta.title':'Have something worth building?','cta.copy':"Tell me what you're working on. We'll figure out the right next step together.",
      'cta.button':"Let's talk about your project",'footer.line':'WEB · SOFTWARE · SYSTEMS · DESIGN · MEDIA',
      'page.projects.title':'Selected work.','page.projects.title2':'Real decisions.','page.projects.copy':'Explore the thinking, design and engineering behind selected digital projects. Each case study clearly separates completed work, prototypes and experiments.',
      'page.services.title':'Digital work,','page.services.title2':'built around you.','page.services.copy':'A connected approach to design, development and digital communication — scoped to the needs of each project.',
      'page.about.title':'I like understanding','page.about.title2':'how things work.','page.about.copy':"I'm Ilias Asdufan, an independent digital creator working across design, development and connected systems. PRDXQ is where I turn that approach into digital products, experiments and client work.",
      'page.lab.title':'Beyond the','page.lab.title2':'interface.','page.lab.copy':'The Lab is where ideas become experiments. Explore interactions, test design concepts and see how digital systems can work together.',
      'page.design.title':'One idea.','page.design.title2':'Different realities.','page.design.copy':'Explore five visual approaches and discover how typography, contrast, depth and interaction shape a digital experience.',
      'page.contact.title':"Let's make","page.contact.title2":'something useful.','page.contact.copy':'Tell me about your project, an idea you want to explore or an opportunity to discuss.'
    }
  };
  let language = 'de';
  const langButton = document.querySelector('.language-toggle');
  // Apply shared navigation translations on every page, including the mobile menu.
  const navLabels = {
    'index.html':['nav.home','Home','Home'], 'projects.html':['nav.projects','Projekte','Projects'],
    'services.html':['nav.services','Leistungen','Services'], 'lab.html':['nav.lab','Lab','Lab'],
    'design.html':['nav.design','Design','Design'], 'about.html':['nav.about','Über mich','About'],
    'contact.html':['nav.contact','Projekt starten','Start a project']
  };
  document.querySelectorAll('a[href]').forEach(link => {
    const href = (link.getAttribute('href') || '').split('#')[0].split('?')[0];
    const key = navLabels[href];
    if (key && !link.hasAttribute('data-i18n')) {
      const label = link.querySelector('small') ? link.childNodes[0].textContent.trim() : link.textContent.trim().replace(/↗/g,'').trim();
      link.dataset.i18n = key[0];
      link.dataset.de = label || key[1];
    }
  });
  const pageLeadKeys = {
    'projects.html':'page.projects.copy','services.html':'page.services.copy','lab.html':'page.lab.copy',
    'design.html':'page.design.copy','about.html':'page.about.copy','contact.html':'page.contact.copy'
  };
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  const pageLead = document.querySelector('.page-hero .lead');
  if (pageLead && pageLeadKeys[currentPage] && !pageLead.hasAttribute('data-i18n')) {
    pageLead.dataset.i18n = pageLeadKeys[currentPage];
    pageLead.dataset.de = pageLead.textContent.trim();
  }
  function setLanguage(next) {
    language = next;
    document.documentElement.lang = next;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = translations.en[key];
      if (next === 'en' && value) el.textContent = value;
      else if (el.dataset.de) el.textContent = el.dataset.de;
    });
    if (langButton) { langButton.textContent = next === 'de' ? 'EN' : 'DE'; langButton.setAttribute('aria-label', next === 'de' ? 'Switch language to English' : 'Sprache auf Deutsch umstellen'); }
  }
  if (langButton) langButton.addEventListener('click', () => setLanguage(language === 'de' ? 'en' : 'de'));

  // Project filters are progressive enhancement; all projects remain visible by default.
  const filters = document.querySelectorAll('[data-filter]');
  const projectCards = document.querySelectorAll('[data-category]');
  filters.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    projectCards.forEach(card => { card.hidden = category !== 'all' && card.dataset.category !== category; });
  }));

  // Style playground
  const preview = document.querySelector('.design-preview');
  document.querySelectorAll('[data-style-choice]').forEach(button => button.addEventListener('click', () => {
    if (!preview) return;
    preview.dataset.style = button.dataset.styleChoice;
    document.querySelectorAll('[data-style-choice]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    const label = document.querySelector('[data-style-label]');
    if (label) label.textContent = button.textContent.trim();
  }));

  // Lab color tokens
  document.querySelectorAll('[data-token]').forEach(button => button.addEventListener('click', () => {
    document.documentElement.style.setProperty('--accent', button.dataset.token);
    document.documentElement.style.setProperty('--accent-strong', button.dataset.token);
    document.querySelectorAll('[data-token]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  }));
  const motionRange = document.querySelector('[data-motion-range]');
  const motionValue = document.querySelector('[data-motion-value]');
  const motionCube = document.querySelector('.motion-cube');
  if (motionRange && motionValue && motionCube) motionRange.addEventListener('input', () => {
    const value = Number(motionRange.value);
    motionValue.textContent = value + '%';
    motionCube.style.animationDuration = (10 - value / 12) + 's';
    motionCube.style.animationPlayState = value === 0 ? 'paused' : 'running';
  });

  // Contact form creates a prepared email; no data is sent to a server.
  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) contactForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const subject = encodeURIComponent('PRDXQ project inquiry — ' + data.get('name'));
    const body = encodeURIComponent(
      'Name: ' + data.get('name') + '\nContact: ' + data.get('contact') + '\nProject type: ' + (data.get('type') || 'Not specified') +
      '\nBudget: ' + (data.get('budget') || 'Not specified') + '\n\nMessage:\n' + data.get('message')
    );
    const status = document.querySelector('.form-status');
    if (status) status.textContent = 'Your email app will open with the message prepared. Nothing is sent automatically.';
    window.location.href = 'mailto:ilias.asdufan@icloud.de?subject=' + subject + '&body=' + body;
  });

  // Optional desktop pointer light. It never replaces the system cursor.
  const pointer = document.querySelector('[data-pointer-light]');
  if (pointer && !reduced && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    window.addEventListener('pointermove', event => {
      pointer.style.setProperty('--pointer-x', event.clientX + 'px');
      pointer.style.setProperty('--pointer-y', event.clientY + 'px');
    }, {passive:true});
  }
})();