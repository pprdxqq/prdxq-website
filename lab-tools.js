(() => {
  const briefText = document.querySelector('#briefOutput');
  const goalCopy = {
    sichtbarkeit: 'Ich möchte meinen digitalen Auftritt klarer machen und besser erklären, was mein Unternehmen anbietet.',
    ablauf: 'Ich möchte wiederkehrende Arbeit vereinfachen und wichtige digitale Abläufe miteinander verbinden.',
    produkt: 'Ich möchte eine digitale Produktidee sortieren und eine passende erste Version entwickeln.'
  };
  const choices = [...document.querySelectorAll('[data-goal]')];
  choices.forEach((choice) => choice.addEventListener('click', () => {
    choices.forEach((item) => {
      const selected = item === choice;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    if (briefText) briefText.textContent = goalCopy[choice.dataset.goal] || goalCopy.sichtbarkeit;
    const feedback = document.querySelector('#copyFeedback');
    if (feedback) feedback.textContent = '';
  }));
  const copyButton = document.querySelector('#copyBrief');
  if (copyButton && briefText) {
    copyButton.addEventListener('click', async () => {
      const feedback = document.querySelector('#copyFeedback');
      try {
        await navigator.clipboard.writeText(briefText.textContent);
        feedback.textContent = 'Text kopiert.';
      } catch {
        feedback.textContent = 'Kopieren ist hier nicht verfügbar. Markiere den Text und kopiere ihn manuell.';
      }
    });
  }
  const preview = document.querySelector('#interfacePreview');
  const range = document.querySelector('#spacingRange');
  const spacingValue = document.querySelector('#spacingValue');
  const contrastToggle = document.querySelector('#contrastToggle');
  if (preview && range && spacingValue) {
    const updateSpacing = () => {
      const value = Number(range.value);
      spacingValue.textContent = value < 34 ? 'Kompakt' : value > 66 ? 'Großzügig' : 'Mittel';
      preview.querySelector('.preview-content').style.padding = (17 + Math.round(value * 0.14)) + 'px';
    };
    range.addEventListener('input', updateSpacing);
    updateSpacing();
  }
  if (preview && contrastToggle) {
    contrastToggle.addEventListener('click', () => {
      const active = contrastToggle.getAttribute('aria-pressed') !== 'true';
      preview.classList.toggle('high-contrast', active);
      contrastToggle.setAttribute('aria-pressed', String(active));
      contrastToggle.textContent = active ? 'Zur hellen Variante wechseln' : 'Stärkeren Kontrast ansehen';
    });
  }
  const runButton = document.querySelector('#runFlow');
  const flowStatus = document.querySelector('#flowStatus');
  const flowSteps = [...document.querySelectorAll('[data-flow-step]')];
  if (runButton && flowStatus && flowSteps.length) {
    let runId = 0;
    runButton.addEventListener('click', () => {
      const currentRun = ++runId;
      const delay = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 480;
      runButton.disabled = true;
      runButton.textContent = 'Simulation läuft…';
      flowSteps.forEach((step) => step.classList.remove('is-complete'));
      flowStatus.textContent = 'Lokale Simulation gestartet. Es werden keine Daten übertragen.';
      flowSteps.forEach((step, index) => {
        window.setTimeout(() => {
          if (currentRun !== runId) return;
          step.classList.add('is-complete');
          flowStatus.textContent = 'Schritt ' + (index + 1) + ' von ' + flowSteps.length + ' — ' + step.querySelector('strong').textContent;
          if (index === flowSteps.length - 1) {
            runButton.disabled = false;
            runButton.textContent = 'Simulation erneut ansehen';
            flowStatus.textContent = 'Simulation abgeschlossen. Es wurden keine Daten übertragen.';
          }
        }, delay * (index + 1));
      });
    });
  }
})();
