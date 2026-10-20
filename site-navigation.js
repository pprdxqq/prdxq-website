'use strict';

(() => {
  const nav = document.querySelector('.nav');
  const desktopNav = nav?.querySelector('nav');
  const mobileMenu = document.querySelector('.mobile-menu');
  const navRight = nav?.querySelector('.nav-right');

  if (desktopNav && !desktopNav.querySelector('a[href="admin.html"]')) {
    const link = document.createElement('a');
    link.className = 'admin-nav-link';
    link.href = 'admin.html';
    link.textContent = 'Admin';
    desktopNav.append(link);
  }
  if (mobileMenu && !mobileMenu.querySelector('a[href="admin.html"]')) {
    const link = document.createElement('a');
    link.className = 'admin-nav-link';
    link.href = 'admin.html';
    link.innerHTML = 'Admin <b>↗</b>';
    mobileMenu.append(link);
  }
  if (navRight && !navRight.querySelector('.site-language')) {
    const wrap = document.createElement('label');
    wrap.className = 'site-language';
    wrap.innerHTML = '<span class="visually-hidden">Sprache</span><select class="site-language-select" aria-label="Sprache"><option value="de">DE</option><option value="en">EN</option></select>';
    const menuButton = navRight.querySelector('.menu-toggle');
    if (menuButton) navRight.insertBefore(wrap, menuButton);
    else navRight.append(wrap);
  }

  const copy = {
    'Sprache': 'Language',
    'Start': 'Home', 'Start ': 'Home ', 'Leistungen': 'Services', 'Leistungen ': 'Services ', 'Playground': 'Playground',
    'Design': 'Design', 'Über mich': 'About', 'Über mich ': 'About ', 'Projekt starten': 'Start a project',
    'Projekt starten ': 'Start a project ', 'Projekt anfragen ': 'Start a project ', 'Projekt anfragen': 'Start a project',
    'Admin': 'Admin', 'Zur Website': 'Back to site', 'Impressum': 'Legal notice', 'Datenschutz': 'Privacy',
    'Digitale Produkte · Design · Entwicklung': 'Digital products · design · development',
    'Ein kleines Studio für digitale Produkte, Gestaltung und Entwicklung.': 'An independent studio for digital products, design and development.',
    'PRDXQ stellt sich vor': 'Introducing PRDXQ', 'Mobile Navigation': 'Mobile navigation', 'Hauptnavigation': 'Main navigation',
    'Digitale Entwicklung für Unternehmen': 'Digital development for businesses', 'Von der Idee': 'From idea', 'zum ': 'to a ',
    'digitalen Produkt.': 'digital product.',
    'PRDXQ entwickelt Websites, Web-Apps und digitale Systeme für Unternehmen und Selbstständige, die online klarer auftreten oder besser arbeiten wollen.': 'PRDXQ builds websites, web apps and digital systems for businesses and independent professionals who want a clearer online presence or better ways of working.',
    'Ein Ansprechpartner verbindet Konzept, Design und Entwicklung — passend zum Vorhaben und ohne unnötige Komplexität.': 'One partner brings strategy, design and development together around your needs, without unnecessary complexity.',
    'Leistungen ansehen ': 'Explore services ', '01 — Was entsteht': '01 — What we create', 'Ein System,': 'One system,',
    'das ': 'that ', 'zusammenpasst.': 'works together.',
    'Vom ersten Bildschirm bis zu Daten, Automationen und Veröffentlichung: Bausteine werden so gewählt, dass sie ein konkretes Ziel unterstützen und später erweiterbar bleiben.': 'From the first screen to data, automation and launch, each part is chosen to support a clear goal and grow with the project.',
    'Digitale Produkte': 'Digital products', 'Abläufe und Integrationen': 'Workflows and integrations', 'Interface und visuelle Identität': 'Interfaces and visual identity', 'Foto, Video und Content': 'Photo, video and content',
    '02 — Zusammenarbeit': '02 — How we work', 'Erst verstehen.': 'Understand first.', 'Dann ': 'Then ', 'gezielt bauen.': 'build with purpose.',
    'Wir klären gemeinsam Ziel, Umfang und die sinnvollste erste Version. Danach folgen Gestaltung, Entwicklung und ein sauberer Start — transparent in überschaubaren Schritten.': 'We agree on your goal, scope and the right first version. Then we design, build and launch in clear, manageable steps.',
    'Projekt besprechen ': 'Discuss your project ', 'Du musst noch keine fertige Spezifikation haben.': 'You do not need a finished specification to get started.',
    'WEITERENTDECKEN': 'EXPLORE MORE', 'PRDXQ / DIGITALE SYSTEME': 'PRDXQ / DIGITAL SYSTEMS', 'PRDXQ / ILIAS ASDUFAN': 'PRDXQ / ILIAS ASDUFAN',
    'Zum digitalen Playground ': 'Explore the digital playground ', 'Von der Idee zum digitalen Produkt': 'Digital products, from idea to launch',
    'PRDXQ® / DIGITALSTUDIO': 'PRDXQ® / DIGITAL STUDIO', 'DE · ONLINE': 'DE · ONLINE', 'WEB · APP · SYSTEME · DESIGN': 'WEB · APPS · SYSTEMS · DESIGN',
    'DIGITALE ENTWICKLUNG FÜR UNTERNEHMEN': 'DIGITAL DEVELOPMENT FOR BUSINESSES', 'Deine Idee wird': 'Your idea becomes', 'ein digitales ': 'a digital ',
    'Produkt.': 'product.',
    'Ich entwickle Websites, Web-Apps und digitale Systeme für Unternehmen und Selbstständige — vom ersten Konzept bis zum fertigen Launch.': 'I build websites, web apps and digital systems for businesses and independent professionals — from the first concept to launch.',
    'Ein Ansprechpartner verbindet Konzept, Design und Entwicklung. Klar geplant, passend zu deinem Ziel.': 'One partner brings strategy, design and development together around your goal.',
    'Leistungen entdecken ': 'Explore services ', 'PRDXQ / LEISTUNGEN': 'PRDXQ / SERVICES', 'Was ich für dich baue.': 'What I can build for you.',
    'Wähle einen Bereich und sieh, was daraus für dein Vorhaben entstehen kann.': 'Choose a discipline to see what it could make possible for your project.',
    'Websites': 'Websites', '& Web-Apps': '& web apps', 'Apps': 'Apps', '& Tools': '& tools', 'Automation': 'Automation', '& Daten': '& data',
    'UI / UX': 'UI / UX', '& Grafik': '& graphics', 'Foto · Video': 'Photo · video', '& Social': '& social', 'Hosting': 'Hosting', '& Infrastruktur': '& infrastructure',
    'PRDXQ / ZUSAMMENARBEIT': 'PRDXQ / HOW WE WORK', 'Vom ersten Gespräch': 'From the first conversation', 'bis zum Start.': 'to launch.',
    'Verstehen': 'Understand', 'Wir klären Ziel, Umfang und die sinnvollste erste Version.': 'We clarify your goal, scope and the right first version.',
    'Gestalten & bauen': 'Design & build', 'Design und Entwicklung greifen von Anfang an ineinander.': 'Design and development work together from the start.',
    'Veröffentlichen': 'Launch', 'Dein Produkt geht online und kann mit deinem Projekt wachsen.': 'Your product goes live and can grow with your project.',
    'PRDXQ / MEHR ENTDECKEN': 'PRDXQ / EXPLORE MORE', 'Digitale Ideen zum Ausprobieren.': 'Digital ideas to explore.', 'Fünf visuelle Richtungen.': 'Five visual directions.',
    'PRDXQ / PROJEKTSTART': 'PRDXQ / START A PROJECT', 'Was möchtest': 'What would', 'du möglich machen?': 'you like to make possible?',
    'Erzähl mir, wo du hinwillst. Gemeinsam finden wir den passenden nächsten Schritt.': 'Tell me what you want to achieve. We will work out the right next step together.',
    'Projekt besprechen': 'Discuss your project', 'Projektanfrage': 'Project enquiry', 'Erzähl mir,': 'Tell me', 'was du bauen willst.': 'what you want to build.',
    'Keine Fachbegriffe nötig. Ich führe dich Schritt für Schritt durch ein paar Fragen und zeige dir direkt, was die einzelnen Möglichkeiten bedeuten.': 'No technical terms needed. I will guide you through a few questions and explain each option as you go.',
    'PROJEKTANFRAGE ': 'PROJECT ENQUIRY ', 'UNVERBINDLICH': 'NO OBLIGATION', '← ZURÜCK': '← BACK', 'WAS SOLL ENTSTEHEN?': 'WHAT ARE YOU LOOKING TO BUILD?',
    'Was möchtest du mit PRDXQ bauen?': 'What would you like to build with PRDXQ?', 'Wähle alles, was interessant klingt. Du musst die Begriffe nicht kennen.': 'Choose anything that sounds relevant. You do not need to know the technical terms.',
    'DEIN PROJEKT-PROFIL': 'YOUR PROJECT PROFILE', 'Das klingt nach': 'This sounds like', 'einem echten Projekt.': 'a real project.',
    'Deine Auswahl wird zusammen mit der Anfrage übermittelt. Ergänze deine Kontaktdaten und schreib kurz, was dir wichtig ist.': 'Your choices will be sent with your enquiry. Add your contact details and tell me what matters most.',
    'DEIN NAME': 'YOUR NAME', 'DEINE E-MAIL': 'YOUR EMAIL', 'TELEFON (OPTIONAL)': 'PHONE (OPTIONAL)', 'WAS SOLL ICH NOCH WISSEN? (OPTIONAL)': 'ANYTHING ELSE I SHOULD KNOW? (OPTIONAL)',
    'Deine Angaben werden an PRDXQ übermittelt, um deine Anfrage zu beantworten. Mehr dazu in den ': 'Your details are sent to PRDXQ so I can respond to your enquiry. Read more in the ',
    'Datenschutzhinweisen': 'privacy notice', 'Sicherheitsprüfung wird geladen.': 'Loading security check.', 'ANFRAGE SENDEN ': 'SEND ENQUIRY ',
    'Antworten neu starten': 'Start over', 'Schreib mir kurz von deinem Vorhaben.': 'Tell me a little about your project.',
    'Falls der Projektberater oder die Sicherheitsprüfung nicht geladen wird, kannst du deine Anfrage hier absenden. Für den Missbrauchsschutz löse bitte die kurze Rechenaufgabe.': 'If the project guide or security check does not load, you can send your enquiry here. Please solve the short maths question to prevent abuse.',
    'Name': 'Name', 'E-Mail': 'Email', 'Telefon (optional)': 'Phone (optional)', 'Nachricht': 'Message', 'Was ist 2 + 5? (Zahl eingeben)': 'What is 2 + 5? (Enter a number)',
    'Mit dem Absenden werden deine Angaben zur Bearbeitung der Anfrage übermittelt. Details stehen in den ': 'Your details will be sent so PRDXQ can respond. More information is in the ',
    'Anfrage senden': 'Send enquiry', 'Kontaktkarte': 'Contact card', 'Kontaktkarte öffnen': 'Open contact card', 'Kontaktkarte schließen': 'Close contact card',
    'Digitale Produkte · Design · Entwicklung': 'Digital products · design · development', 'KELSTERBACH · DEUTSCHLAND': 'KELSTERBACH · GERMANY',
    'Leistungen — PRDXQ': 'Services — PRDXQ', 'Du hast eine': 'You have an', 'Idee.': 'idea.',
    'Hier siehst du nicht nur Begriffe. Klick auf einen Bereich und sieh, was dahinter wirklich entsteht.': 'Explore each discipline and see what it can actually deliver.',
    '06 DISZIPLINEN': '06 DISCIPLINES', 'ANTIPPEN · ERLEBEN · VERSTEHEN': 'TAP · EXPLORE · UNDERSTAND',
    'Websites, Web-Apps und komplette digitale Produkte.': 'Websites, web apps and complete digital products.',
    'Von der Oberfläche bis zur Datenbank.': 'From interface to database.',
    'Tools und Anwendungen für konkrete Aufgaben.': 'Tools and applications for specific tasks.',
    'Daten, APIs und Prozesse miteinander verbinden.': 'Connect data, APIs and processes.',
    'Interfaces und Visuals mit Funktion und Charakter.': 'Interfaces and visuals with purpose and character.',
    'Aufnehmen, bearbeiten und Content produzieren.': 'Capture, edit and produce content.',
    'Hosting, Infrastruktur und technische Setups.': 'Hosting, infrastructure and technical setups.',
    'Tools und Anwendungen, die einen konkreten Job erledigen.': 'Tools and applications built to solve a specific task.',
    'Daten, APIs und Prozesse werden zu einem Ablauf.': 'Data, APIs and processes working as one workflow.',
    'Interfaces, Branding und Visuals mit Funktion und Charakter.': 'Interfaces, branding and visuals with purpose and character.',
    'Aufnehmen, schneiden, bearbeiten und für Social produzieren.': 'Capture, edit and produce content for social channels.',
    'Hosting, Domains, Deployment und die Technik dahinter.': 'Hosting, domains, deployment and the technology behind it.',
    'EIN ANSPRECHPARTNER / VON ANFANG BIS ENDE': 'ONE PARTNER / FROM START TO FINISH', 'Von der ersten Idee': 'From the first idea', 'bis ': 'to ', 'online.': 'launch.', 'Das könnte mein Projekt sein ': 'This could be my project ',
    'PRDXQ / DIGITALER PLAYGROUND': 'PRDXQ / DIGITAL PLAYGROUND', 'Gute digitale Arbeit': 'Good digital work', 'beginnt mit ': 'starts with ', 'klaren Entscheidungen.': 'clear decisions.',
    'Probier drei kleine Werkzeuge aus: Formuliere ein Ziel, passe ein Interface an und sieh, wie ein einfacher digitaler Ablauf zusammenhängt. Alles läuft lokal in deinem Browser; deine Eingaben werden nicht gespeichert.': 'Try three small tools: define a goal, adjust an interface and see how a simple digital workflow fits together. Everything runs in your browser; your input is not saved.',
    'Experimente ansehen ': 'Explore the experiments ', '01 / ZIEL KLÄREN': '01 / CLARIFY A GOAL', 'Worum geht es bei deinem Vorhaben?': 'What is your project about?',
    'Wähle ein Ziel und eine passende Richtung. Das Ergebnis ist ein kurzer Gesprächseinstieg, keine Preis- oder Zeitprognose.': 'Choose a goal and a direction. The result is a conversation starter, not a price or timeline estimate.',
    'Dein Ziel': 'Your goal', 'Besser gefunden werden': 'Be easier to find', 'Arbeit vereinfachen': 'Simplify your work', 'Ein Produkt entwickeln': 'Build a product',
    'DEIN GESPRÄCHSEINSTIEG': 'YOUR CONVERSATION STARTER', 'Ich möchte meinen digitalen Auftritt klarer machen und besser erklären, was mein Unternehmen anbietet.': 'I want to make my online presence clearer and explain my business more effectively.',
    'Text kopieren': 'Copy text', '02 / INTERFACE ABSTIMMEN': '02 / ADJUST AN INTERFACE', 'Ein kleines Interface verändern.': 'Change a small interface.',
    'Verändere den Abstand und die Akzentfarbe. So wird sichtbar, wie Designentscheidungen die Wirkung einer Oberfläche beeinflussen.': 'Change the spacing and accent colour to see how design choices affect an interface.',
    'DEIN DIGITALER AUFTRITT': 'YOUR DIGITAL PRESENCE', 'Klar. Nützlich.': 'Clear. Useful.', 'Für deine Kunden.': 'For your customers.',
    'Gute Gestaltung hilft Menschen, den nächsten Schritt zu erkennen.': 'Good design helps people see what to do next.', 'Mehr erfahren ': 'Learn more ', 'Abstand ': 'Spacing ',
    'Mittel': 'Medium', 'Stärkeren Kontrast ansehen': 'Preview stronger contrast', '03 / ABLAUF VERSTEHEN': '03 / UNDERSTAND A WORKFLOW',
    'Wie kann ein wiederkehrender Ablauf verbunden werden?': 'How can a recurring process be connected?',
    'Starte die lokale Simulation. Sie zeigt exemplarisch, wie ein Formular, eine Datenbank und eine Empfangsbestätigung zusammenspielen.': 'Start the local simulation to see how a form, database and confirmation can work together.',
    'Anfrage erfassen': 'Capture a request', 'Ein Kunde sendet ein Formular.': 'A customer submits a form.', 'Sicher ablegen': 'Store securely',
    'Die Anfrage erhält einen Status.': 'The request receives a status.', 'Rückmeldung vorbereiten': 'Prepare a response', 'Der Eingang wird bestätigt.': 'Receipt is confirmed.',
    'Simulation starten ': 'Start simulation ', 'Bereit. Es werden keine Daten übertragen.': 'Ready. No data is transmitted.',
    'PRDXQ / NÄCHSTER SCHRITT': 'PRDXQ / NEXT STEP', 'Du hast eine Frage': 'Have a question', 'zu deinem Vorhaben?': 'about your project?',
    'Der Playground hilft beim Sortieren. Im Projektgespräch klären wir, was für dich sinnvoll ist.': 'The playground helps you organise your ideas. In a project conversation, we can decide what makes sense for you.',
    'Design Systems — PRDXQ': 'Design systems — PRDXQ', 'Fünf Arten,': 'Five ways', 'eine Idee zu zeigen.': 'to express an idea.',
    'Minimalismus, Neumorphism, Neobrutalism, Flat Design und Glassmorphism — fünf Stilwelten, die zeigen, dass ich nicht an ein Template gebunden bin.': 'Minimalism, neumorphism, neobrutalism, flat design and glassmorphism — five visual directions beyond a single template.',
    'Ruhe durch Reduktion.': 'Calm through simplicity.', 'Kontrast als Charakter.': 'Contrast with character.', 'Klar. Direkt.': 'Clear. Direct.', 'Funktional.': 'Functional.',
    'Design ist keine Schablone.': 'Design is not a template.', 'Es ist eine Entscheidung.': 'It is a choice.', 'Ein Projekt starten ': 'Start a project ',
    'Über mich — Ilias Asdufan / PRDXQ': 'About — Ilias Asdufan / PRDXQ', 'PRDXQ / ÜBER MICH': 'PRDXQ / ABOUT',
    'Hinter PRDXQ steht eine Person mit einem einfachen Anspruch: digitale Dinge nicht nur schön aussehen lassen, sondern sie wirklich bauen.': 'PRDXQ is one person with a simple ambition: not just to make digital things look good, but to build them.',
    'DIE PERSON': 'THE PERSON', 'Ich arbeite an der Schnittstelle von ': 'I work at the intersection of ', 'Entwicklung, Design und digitalem Content.': 'development, design and digital content.',
    'Das bedeutet: Ich kann eine Idee technisch planen, das Interface gestalten, den Code schreiben, die Datenbank aufsetzen, automatisieren, deployen und anschließend auch das visuelle Material dafür erstellen.': 'That means I can plan the technology, design the interface, write the code, set up the database, automate, deploy and create the visual content.',
    'NAME': 'NAME', 'BRAND': 'BRAND', 'ROLE': 'ROLE', 'AGE': 'AGE', '02 — HALTUNG': '02 — APPROACH', 'Kein Baukasten.': 'No template.',
    'Kein ': 'No ', 'Zusammenstückeln.': 'patchwork.', 'Wenn das Projekt mehrere Disziplinen braucht, müssen sie nicht bei fünf verschiedenen Leuten landen. PRDXQ verbindet sie.': 'When a project needs several disciplines, they do not have to be split across five providers. PRDXQ brings them together.',
    'Minimalism': 'Minimalism', 'Ruhe durch Reduktion.': 'Calm through simplicity.'
  };

  const languageSelect = document.querySelector('.site-language-select');
  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  let language = localStorage.getItem('prdxq-language') === 'en' ? 'en' : 'de';

  function translateNode(node) {
    if (node.nodeType !== Node.TEXT_NODE || !node.parentElement || node.parentElement.closest('script,style,textarea')) return;
    if (!originalText.has(node)) originalText.set(node, node.nodeValue);
    const original = originalText.get(node);
    if (language === 'de') { node.nodeValue = original; return; }
    const key = original.trim();
    if (!(key in copy)) return;
    const leading = original.match(/^\s*/)?.[0] || '';
    const trailing = original.match(/\s*$/)?.[0] || '';
    node.nodeValue = leading + copy[key] + trailing;
  }

  function translateAttributes(element) {
    const attrs = ['aria-label', 'title', 'placeholder'];
    if (!originalAttributes.has(element)) originalAttributes.set(element, {});
    const saved = originalAttributes.get(element);
    for (const attribute of attrs) {
      if (!element.hasAttribute(attribute)) continue;
      if (!(attribute in saved)) saved[attribute] = element.getAttribute(attribute);
      const original = saved[attribute];
      element.setAttribute(attribute, language === 'en' ? (copy[original] || original) : original);
    }
  }

  function translate(root = document.body) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) translateNode(node);
    if (root.nodeType === Node.ELEMENT_NODE) translateAttributes(root);
    root.querySelectorAll?.('*').forEach(translateAttributes);
    const labels = {
      de: { 'index.html': ['⌂','START'], 'work.html': ['◫','LEISTUNGEN'], 'lab.html': ['◉','PLAYGROUND'], 'contact.html': ['↗','START'] },
      en: { 'index.html': ['⌂','HOME'], 'work.html': ['◫','WORK'], 'lab.html': ['◉','LAB'], 'contact.html': ['↗','START'] }
    }[language];
    document.querySelectorAll('.mobile-dock a').forEach((link) => {
      const path = (link.getAttribute('href') || '').split('/').pop();
      if (!labels[path]) return;
      const icon = link.querySelector('span');
      const label = link.querySelector('em');
      if (icon) icon.textContent = labels[path][0];
      if (label) label.textContent = labels[path][1];
    });
  }

  function applyLanguage() {
    document.documentElement.lang = language;
    if (languageSelect) languageSelect.value = language;
    const pageTitle = document.title;
    if (!originalAttributes.has(document.documentElement)) originalAttributes.set(document.documentElement, {});
    const rootAttrs = originalAttributes.get(document.documentElement);
    if (!rootAttrs.title) rootAttrs.title = pageTitle;
    document.title = language === 'en' ? (copy[rootAttrs.title] || rootAttrs.title) : rootAttrs.title;
    translate();
  }

  languageSelect?.addEventListener('change', () => {
    language = languageSelect.value === 'en' ? 'en' : 'de';
    localStorage.setItem('prdxq-language', language);
    applyLanguage();
  });
  const menu = document.querySelector('.mobile-menu');
  if (menu) {
    const sync = () => document.body.classList.toggle('nav-menu-open', menu.classList.contains('open'));
    new MutationObserver(sync).observe(menu, { attributes: true, attributeFilter: ['class'] });
    sync();
  }
  new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) translateNode(node);
    else if (node.nodeType === Node.ELEMENT_NODE) translate(node);
  }))).observe(document.body, { childList: true, subtree: true });
  applyLanguage();
})();
