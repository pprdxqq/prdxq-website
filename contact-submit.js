(() => {
  const form = document.querySelector('#wizardResult');
  if (!form) return;
  const submit = document.querySelector('#sendInquiry');
  const status = document.querySelector('#submitStatus');
  const turnstileStatus = document.querySelector('#turnstileStatus');
  const widget = document.querySelector('#turnstileWidget');
  const siteKey = window.PRDXQ_CONFIG?.turnstileSiteKey?.trim();
  let token = '';
  let widgetId = null;
  let originalLabel = submit.textContent.trim();
  window.prdxqContactReady = false;

  const setStatus = (message, state = '') => {
    status.textContent = message;
    status.dataset.state = state;
  };

  if (!siteKey) {
    turnstileStatus.textContent = 'Das Formular wird vor dem Start noch mit der Sicherheitsprüfung verbunden.';
    submit.disabled = true;
  } else {
    window.prdxqTurnstileReady = () => {
      if (!window.turnstile || !widget) {
        turnstileStatus.textContent = 'Die Sicherheitsprüfung konnte nicht geladen werden. Bitte lade die Seite erneut.';
        return;
      }
      widgetId = window.turnstile.render(widget, {
        sitekey: siteKey,
        action: 'contact',
        appearance: 'interaction-only',
        callback: (value) => {
          token = value;
          submit.disabled = false;
          turnstileStatus.textContent = 'Sicherheitsprüfung abgeschlossen.';
        },
        'expired-callback': () => {
          token = '';
          submit.disabled = true;
          turnstileStatus.textContent = 'Die Prüfung ist abgelaufen. Bitte bestätige sie erneut.';
        },
        'error-callback': () => {
          token = '';
          submit.disabled = true;
          window.prdxqContactReady = false;
          document.body.classList.remove('has-enhanced-contact');
          turnstileStatus.textContent = 'Die Prüfung ist gerade nicht verfügbar. Bitte versuche es später erneut.';
        }
      });
      window.prdxqContactReady = true;
      document.body.classList.add('has-enhanced-contact');
      turnstileStatus.textContent = 'Sicherheitsprüfung wird vorbereitet.';
    };
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=prdxqTurnstileReady&render=explicit';
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      submit.disabled = true;
      window.prdxqContactReady = false;
      document.body.classList.remove('has-enhanced-contact');
      turnstileStatus.textContent = 'Die Sicherheitsprüfung konnte nicht geladen werden. Bitte lade die Seite erneut.';
    };
    document.head.appendChild(script);
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!siteKey || !token) {
      setStatus('Die Sicherheitsprüfung ist noch nicht bereit. Bitte bestätige sie und versuche es erneut.', 'error');
      return;
    }
    const formData = new FormData(form);
    let answers = {};
    try { answers = JSON.parse(String(formData.get('projectAnswers') || '{}')); } catch { answers = {}; }
    submit.disabled = true;
    submit.setAttribute('aria-busy', 'true');
    submit.textContent = 'Wird gesendet …';
    setStatus('Deine Anfrage wird sicher übermittelt.');
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
      answers,
      website: formData.get('website'),
      turnstileToken: token
    };
    try {
      const response = await fetch('/api/submit-inquiry', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        const messages = {
          400: 'Bitte prüfe deine Angaben und die Sicherheitsprüfung.',
          429: 'Es wurden gerade zu viele Anfragen gesendet. Bitte warte eine Weile und versuche es erneut.',
          503: 'Das Anfrageformular ist momentan nicht verfügbar. Deine Angaben wurden nicht versendet.'
        };
        throw new Error(messages[response.status] || 'Das Senden hat nicht geklappt. Bitte versuche es erneut.');
      }
      if (result.receiptStatus === 'sent') {
        setStatus('Danke, deine Anfrage ist angekommen. Eine Empfangsbestätigung ist unterwegs.', 'success');
      } else {
        setStatus('Danke, deine Anfrage ist angekommen. Die automatische Bestätigungs-E-Mail konnte gerade nicht gesendet werden.', 'success');
      }
      submit.textContent = 'Anfrage gesendet';
      form.querySelectorAll('input, textarea').forEach((field) => { field.disabled = true; });
      document.querySelector('#restartWizard').disabled = true;
      token = '';
    } catch (error) {
      setStatus(error.message, 'error');
      token = '';
      if (window.turnstile && widgetId !== null) window.turnstile.reset(widgetId);
      turnstileStatus.textContent = 'Bitte bestätige die Sicherheitsprüfung erneut.';
      submit.disabled = true;
    } finally {
      submit.removeAttribute('aria-busy');
      if (submit.textContent !== 'Anfrage gesendet') submit.textContent = originalLabel;
    }
  });
})();
