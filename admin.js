'use strict';

(() => {
  const byId = (id) => document.getElementById(id);
  const loginPanel = byId('loginPanel');
  const passwordSetupPanel = byId('passwordSetupPanel');
  const passwordSetupForm = byId('passwordSetupForm');
  const passwordSetupStatus = byId('passwordSetupStatus');
  const dashboardPanel = byId('dashboardPanel');
  const loginForm = byId('loginForm');
  const loginStatus = byId('loginStatus');
  const dashboardStatus = byId('dashboardStatus');
  const inquiryList = byId('inquiryList');
  const logoutButton = byId('logoutButton');
  const languageSelect = byId('siteLanguage');
  const locale = {
    de: {
      documentTitle: 'Admin — PRDXQ', language: 'Sprache', website: 'Zur Website', logout: 'Abmelden',
      eyebrow: 'PRDXQ / GESCHÜTZTER BEREICH', loginTitle: 'Anfragen. Im Blick.',
      loginLead: 'Melde dich mit deinem freigeschalteten Admin-Konto an. Nur autorisierte Konten können Kundenanfragen öffnen.',
      email: 'E-Mail', password: 'Passwort', passwordLogin: 'Mit Passwort anmelden', or: 'ODER',
      passkey: 'Mit Passkey anmelden', noAccount: 'Noch kein Konto? Ein Admin-Konto muss zuerst im Supabase-Dashboard angelegt und bestätigt werden.',
      passwordSetupEyebrow: 'PRDXQ / ADMIN-KONTO', passwordSetupTitle: 'Lege dein Admin-Passwort fest.',
      passwordSetupLead: 'Dein Konto ist bestätigt. Lege jetzt ein Passwort fest, um den Adminbereich zu öffnen.',
      newPassword: 'Neues Passwort', confirmPassword: 'Passwort wiederholen', passwordSave: 'Passwort speichern',
      passwordTooShort: 'Verwende mindestens 12 Zeichen.', passwordMismatch: 'Die Passwörter stimmen nicht überein.',
      passwordSaved: 'Passwort gespeichert. Dein Adminbereich ist bereit.', passwordSaveError: 'Passwort konnte nicht gespeichert werden.',
      dashboardEyebrow: 'PRDXQ / ANFRAGEN', dashboardTitle: 'Kundenanfragen',
      dashboardLead: 'Neue Projekte, sicher gespeichert und an einem Ort verwaltet.',
      setupPasskey: 'Face ID / Passkey einrichten', new: 'NEU', inProgress: 'IN BEARBEITUNG', closed: 'GESCHLOSSEN',
      search: 'Suchen', searchPlaceholder: 'Name, E-Mail oder Text', status: 'Status', all: 'Alle',
      replied: 'Beantwortet', refresh: 'Anfragen aktualisieren', limit: 'Es werden die letzten 100 Anfragen angezeigt. Kundendaten sind ausschließlich für das freigeschaltete Admin-Konto verfügbar.',
      empty: 'Noch keine Anfragen vorhanden.', message: 'Nachricht', project: 'Projektprofil', notification: 'E-Mail an PRDXQ', receipt: 'Bestätigung an Kunde',
      created: 'Eingegangen', saveStatus: 'Status speichern', newItem: 'Neu', working: 'In Bearbeitung', closedItem: 'Geschlossen',
      repliedItem: 'Beantwortet', loading: 'Anfragen werden geladen …', saved: 'Status gespeichert.',
      authFailed: 'Anmeldung nicht möglich. Prüfe E-Mail und Passwort.', denied: 'Dieses Konto hat keinen Adminzugriff. Verwende die freigeschaltete E-Mail-Adresse.',
      config: 'Der Adminbereich ist noch nicht vollständig konfiguriert.', service: 'Der Adminbereich ist gerade nicht erreichbar. Bitte versuche es erneut.',
      passkeyUnavailable: 'Passkey-Anmeldung ist in Supabase Auth noch nicht aktiviert oder für diesen Browser nicht verfügbar.',
      passkeyReady: 'Passkey eingerichtet. Beim nächsten Login kannst du ihn für die Anmeldung verwenden.',
      passkeyFail: 'Passkey konnte nicht eingerichtet werden. Prüfe, ob Passkeys in Supabase Auth aktiviert sind.',
      signOut: 'Du bist abgemeldet.', statusError: 'Der Status konnte nicht gespeichert werden.',
      mailSent: 'Gesendet', mailFailed: 'Fehlgeschlagen', mailPending: 'Ausstehend'
    },
    en: {
      documentTitle: 'Admin — PRDXQ', language: 'Language', website: 'Back to site', logout: 'Sign out',
      eyebrow: 'PRDXQ / PRIVATE AREA', loginTitle: 'Requests. In view.',
      loginLead: 'Sign in with your approved admin account. Only authorized accounts can open customer requests.',
      email: 'Email', password: 'Password', passwordLogin: 'Sign in with password', or: 'OR',
      passkey: 'Sign in with passkey', noAccount: 'No account yet? An admin account must first be created and confirmed in the Supabase dashboard.',
      passwordSetupEyebrow: 'PRDXQ / ADMIN ACCOUNT', passwordSetupTitle: 'Set your admin password.',
      passwordSetupLead: 'Your account is confirmed. Set a password to open the admin area.',
      newPassword: 'New password', confirmPassword: 'Confirm password', passwordSave: 'Save password',
      passwordTooShort: 'Use at least 12 characters.', passwordMismatch: 'The passwords do not match.',
      passwordSaved: 'Password saved. Your admin area is ready.', passwordSaveError: 'Could not save the password.',
      dashboardEyebrow: 'PRDXQ / REQUESTS', dashboardTitle: 'Customer requests',
      dashboardLead: 'New projects, stored securely and managed in one place.',
      setupPasskey: 'Set up Face ID / passkey', new: 'NEW', inProgress: 'IN PROGRESS', closed: 'CLOSED',
      search: 'Search', searchPlaceholder: 'Name, email or message', status: 'Status', all: 'All',
      replied: 'Replied', refresh: 'Refresh requests', limit: 'Showing the latest 100 requests. Customer details are only available to the approved admin account.',
      empty: 'No requests yet.', message: 'Message', project: 'Project profile', notification: 'Email to PRDXQ', receipt: 'Customer confirmation',
      created: 'Received', saveStatus: 'Save status', newItem: 'New', working: 'In progress', closedItem: 'Closed',
      repliedItem: 'Replied', loading: 'Loading requests …', saved: 'Status saved.',
      authFailed: 'Sign-in failed. Check your email and password.', denied: 'This account does not have admin access. Use the approved email address.',
      config: 'The admin area is not fully configured yet.', service: 'The admin area is unavailable right now. Please try again.',
      passkeyUnavailable: 'Passkey sign-in is not enabled in Supabase Auth yet or is unavailable in this browser.',
      passkeyReady: 'Passkey set up. You can use it to sign in next time.',
      passkeyFail: 'Could not set up the passkey. Check that passkeys are enabled in Supabase Auth.',
      signOut: 'You are signed out.', statusError: 'Could not save the status.',
      mailSent: 'Sent', mailFailed: 'Failed', mailPending: 'Pending'
    }
  };
  let currentLocale = localStorage.getItem('prdxq-language') === 'en' ? 'en' : 'de';
  let client = null;
  let session = null;
  let inquiries = [];
  let authorized = false;
  let passwordSetupPending = ['invite', 'recovery'].includes(new URLSearchParams(location.hash.slice(1)).get('type'));

  const text = (key) => locale[currentLocale][key] || locale.de[key] || key;
  function applyLocale() {
    document.documentElement.lang = currentLocale;
    document.title = text('documentTitle');
    languageSelect.value = currentLocale;
    byId('language-label')?.replaceChildren(document.createTextNode(text('language')));
    byId('loginTitle').textContent = text('loginTitle');
    byId('adminEyebrow').textContent = text('eyebrow');
    byId('adminLead').textContent = text('loginLead');
    byId('emailLabel').textContent = text('email');
    byId('passwordLabel').textContent = text('password');
    byId('passwordLoginLabel').textContent = text('passwordLogin');
    byId('orLabel').textContent = text('or');
    byId('passkeyButton').lastChild.textContent = ' ' + text('passkey');
    byId('noAccount').textContent = text('noAccount');
    byId('passwordSetupEyebrow').textContent = text('passwordSetupEyebrow');
    byId('passwordSetupTitle').textContent = text('passwordSetupTitle');
    byId('passwordSetupLead').textContent = text('passwordSetupLead');
    byId('newPasswordLabel').textContent = text('newPassword');
    byId('confirmPasswordLabel').textContent = text('confirmPassword');
    byId('passwordSaveLabel').textContent = text('passwordSave');
    byId('dashboardEyebrow').textContent = text('dashboardEyebrow');
    byId('dashboardTitle').textContent = text('dashboardTitle');
    byId('dashboardLead').textContent = text('dashboardLead');
    byId('registerPasskeyButton').textContent = text('setupPasskey');
    byId('statNewLabel').textContent = text('new');
    byId('statInProgressLabel').textContent = text('inProgress');
    byId('statClosedLabel').textContent = text('closed');
    byId('searchLabel').textContent = text('search');
    byId('inquirySearch').placeholder = text('searchPlaceholder');
    byId('statusLabel').textContent = text('status');
    byId('statusAll').textContent = text('all');
    byId('statusNew').textContent = text('newItem');
    byId('statusInProgress').textContent = text('working');
    byId('statusReplied').textContent = text('repliedItem');
    byId('statusClosed').textContent = text('closedItem');
    byId('refreshButton').setAttribute('aria-label', text('refresh'));
    byId('adminFootnote').textContent = text('limit');
    byId('websiteLink').childNodes[0].nodeValue = text('website') + ' ';
    logoutButton.textContent = text('logout');
    if (authorized) renderInquiries();
  }

  function setStatus(element, message, error = false) {
    element.textContent = message;
    element.classList.toggle('is-error', Boolean(error));
    element.classList.toggle('is-success', Boolean(message) && !error);
  }

  function messageForError(code) {
    if (code === 'admin_access_denied') return text('denied');
    if (code === 'admin_not_configured') return text('config');
    if (code === 'sign_in_required') return text('authFailed');
    return text('service');
  }

  async function requestAdmin(path = '', options = {}) {
    if (!session?.access_token) throw new Error('sign_in_required');
    const response = await fetch('/api/admin/inquiries' + path, {
      ...options,
      headers: {
        Authorization: 'Bearer ' + session.access_token,
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {})
      },
      cache: 'no-store'
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || 'admin_service_unavailable');
    return body;
  }

  async function showDashboard(nextSession) {
    session = nextSession;
    setStatus(loginStatus, '');
    setStatus(dashboardStatus, text('loading'));
    try {
      const result = await requestAdmin();
      inquiries = result.inquiries || [];
      authorized = true;
      loginPanel.hidden = true;
      if (passwordSetupPending) {
        dashboardPanel.hidden = true;
        passwordSetupPanel.hidden = false;
        logoutButton.hidden = false;
        setStatus(dashboardStatus, '');
        return;
      }
      passwordSetupPanel.hidden = true;
      dashboardPanel.hidden = false;
      logoutButton.hidden = false;
      renderInquiries();
      setStatus(dashboardStatus, '');
    } catch (error) {
      authorized = false;
      await client.auth.signOut({ scope: 'local' }).catch(() => {});
      session = null;
      dashboardPanel.hidden = true;
      passwordSetupPanel.hidden = true;
      logoutButton.hidden = true;
      loginPanel.hidden = false;
      setStatus(loginStatus, messageForError(error.message), true);
    }
  }

  async function refreshInquiries() {
    if (!session) return;
    setStatus(dashboardStatus, text('loading'));
    try {
      const result = await requestAdmin();
      inquiries = result.inquiries || [];
      renderInquiries();
      setStatus(dashboardStatus, '');
    } catch (error) {
      setStatus(dashboardStatus, messageForError(error.message), true);
    }
  }

  function statusLabel(status) {
    return ({ new: text('newItem'), in_progress: text('working'), replied: text('repliedItem'), closed: text('closedItem') })[status] || status;
  }

  function mailLabel(status) {
    return status === 'sent' ? text('mailSent') : status === 'failed' ? text('mailFailed') : text('mailPending');
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.valueOf())) return '—';
    return new Intl.DateTimeFormat(currentLocale === 'de' ? 'de-DE' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  }

  function addText(tag, className, value) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = value || '';
    return element;
  }

  function buildInquiryCard(item) {
    const card = document.createElement('article');
    card.className = 'inquiry-card';
    const head = document.createElement('div');
    head.className = 'inquiry-card-head';
    const identity = document.createElement('div');
    identity.append(addText('h2', 'inquiry-name', item.name), addText('a', 'inquiry-email', item.email));
    const received = document.createElement('time');
    received.dateTime = item.created_at || '';
    received.textContent = text('created') + ' · ' + formatDate(item.created_at);
    head.append(identity, received);

    const metadata = document.createElement('div');
    metadata.className = 'inquiry-meta';
    metadata.append(addText('span', 'inquiry-id', String(item.id || '').slice(0, 8).toUpperCase()));
    if (item.phone) {
      const phone = addText('a', 'inquiry-phone', item.phone);
      phone.href = 'tel:' + item.phone.replace(/[^+0-9]/g, '');
      metadata.append(phone);
    }
    const statusWrap = document.createElement('label');
    statusWrap.className = 'inquiry-status-wrap';
    const statusSelect = document.createElement('select');
    statusSelect.className = 'inquiry-status-select';
    statusSelect.setAttribute('aria-label', text('status') + ': ' + item.name);
    for (const [value, label] of [['new', text('newItem')], ['in_progress', text('working')], ['replied', text('repliedItem')], ['closed', text('closedItem')]]) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      statusSelect.append(option);
    }
    statusSelect.value = item.status;
    statusSelect.addEventListener('change', async () => {
      const updatedStatus = statusSelect.value;
      statusSelect.disabled = true;
      try {
        await requestAdmin('', { method: 'PATCH', body: JSON.stringify({ id: item.id, status: updatedStatus }) });
        item.status = updatedStatus;
        setStatus(dashboardStatus, text('saved'));
        updateStats();
      } catch (error) {
        statusSelect.value = item.status;
        setStatus(dashboardStatus, error.message === 'admin_access_denied' ? text('denied') : text('statusError'), true);
      } finally {
        statusSelect.disabled = false;
      }
    });
    statusWrap.append(statusSelect);
    metadata.append(statusWrap);

    const details = document.createElement('details');
    details.className = 'inquiry-details';
    const summary = document.createElement('summary');
    summary.textContent = text('message') + (item.message ? ' · ' + item.message.slice(0, 94).replace(/\s+/g, ' ') : '');
    const message = addText('p', 'inquiry-message', item.message || '—');
    details.append(summary, message);
    if (item.project_answers && Object.keys(item.project_answers).length) {
      details.append(addText('h3', 'inquiry-subhead', text('project')));
      const answers = addText('pre', 'inquiry-answers', JSON.stringify(item.project_answers, null, 2));
      details.append(answers);
    }
    const mail = document.createElement('div');
    mail.className = 'inquiry-mail-state';
    mail.append(addText('span', '', text('notification') + ': ' + mailLabel(item.notification_status)), addText('span', '', text('receipt') + ': ' + mailLabel(item.receipt_status)));
    card.append(head, metadata, details, mail);
    return card;
  }

  function updateStats() {
    byId('statNew').textContent = String(inquiries.filter((item) => item.status === 'new').length);
    byId('statInProgress').textContent = String(inquiries.filter((item) => item.status === 'in_progress').length);
    byId('statClosed').textContent = String(inquiries.filter((item) => item.status === 'closed').length);
  }

  function renderInquiries() {
    if (!authorized) return;
    const query = byId('inquirySearch').value.trim().toLowerCase();
    const status = byId('statusFilter').value;
    const filtered = inquiries.filter((item) => {
      const matchesStatus = status === 'all' || item.status === status;
      const content = [item.name, item.email, item.phone, item.message, JSON.stringify(item.project_answers || {})].join(' ').toLowerCase();
      return matchesStatus && (!query || content.includes(query));
    });
    updateStats();
    inquiryList.replaceChildren();
    if (!filtered.length) {
      inquiryList.append(addText('p', 'admin-empty-state', text('empty')));
      return;
    }
    filtered.forEach((item) => inquiryList.append(buildInquiryCard(item)));
  }

  async function start() {
    if (!window.supabase?.createClient || !window.PRDXQ_CONFIG?.supabaseUrl || !window.PRDXQ_CONFIG?.supabasePublishableKey) {
      setStatus(loginStatus, text('config'), true);
      return;
    }
    client = window.supabase.createClient(window.PRDXQ_CONFIG.supabaseUrl, window.PRDXQ_CONFIG.supabasePublishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, experimental: { passkey: true } }
    });
    client.auth.onAuthStateChange((event, currentSession) => {
      if (event === 'PASSWORD_RECOVERY') {
        passwordSetupPending = true;
        if (currentSession) queueMicrotask(() => showDashboard(currentSession));
      }
    });
    const { data } = await client.auth.getSession();
    if (data.session) await showDashboard(data.session);
  }

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!client) return setStatus(loginStatus, text('config'), true);
    const submit = loginForm.querySelector('button[type="submit"]');
    submit.disabled = true;
    setStatus(loginStatus, '');
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: byId('adminEmail').value.trim(),
        password: byId('adminPassword').value
      });
      if (error || !data.session) throw new Error('invalid_login');
      byId('adminPassword').value = '';
      await showDashboard(data.session);
    } catch {
      setStatus(loginStatus, text('authFailed'), true);
    } finally {
      submit.disabled = false;
    }
  });

  passwordSetupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const password = byId('newPassword').value;
    const confirmPassword = byId('confirmPassword').value;
    if (password.length < 12) return setStatus(passwordSetupStatus, text('passwordTooShort'), true);
    if (password !== confirmPassword) return setStatus(passwordSetupStatus, text('passwordMismatch'), true);
    const button = byId('passwordSaveButton');
    button.disabled = true;
    setStatus(passwordSetupStatus, '');
    try {
      const { error } = await client.auth.updateUser({ password });
      if (error) throw error;
      byId('newPassword').value = '';
      byId('confirmPassword').value = '';
      passwordSetupPending = false;
      passwordSetupPanel.hidden = true;
      await showDashboard(session);
      setStatus(dashboardStatus, text('passwordSaved'));
    } catch {
      setStatus(passwordSetupStatus, text('passwordSaveError'), true);
    } finally {
      button.disabled = false;
    }
  });

  byId('passkeyButton').addEventListener('click', async () => {
    if (!client || !window.PublicKeyCredential || !window.isSecureContext) return setStatus(loginStatus, text('passkeyUnavailable'), true);
    const button = byId('passkeyButton');
    button.disabled = true;
    setStatus(loginStatus, '');
    try {
      const { data, error } = await client.auth.signInWithPasskey();
      if (error || !data.session) throw new Error('passkey_failed');
      await showDashboard(data.session);
    } catch {
      setStatus(loginStatus, text('passkeyUnavailable'), true);
    } finally {
      button.disabled = false;
    }
  });

  byId('registerPasskeyButton').addEventListener('click', async () => {
    if (!client || !session) return;
    const button = byId('registerPasskeyButton');
    button.disabled = true;
    setStatus(dashboardStatus, '');
    try {
      const { error } = await client.auth.registerPasskey();
      if (error) throw error;
      setStatus(dashboardStatus, text('passkeyReady'));
    } catch {
      setStatus(dashboardStatus, text('passkeyFail'), true);
    } finally {
      button.disabled = false;
    }
  });

  logoutButton.addEventListener('click', async () => {
    await client.auth.signOut({ scope: 'local' });
    session = null;
    authorized = false;
    inquiries = [];
    dashboardPanel.hidden = true;
    passwordSetupPanel.hidden = true;
    logoutButton.hidden = true;
    loginPanel.hidden = false;
    setStatus(loginStatus, text('signOut'));
  });
  byId('refreshButton').addEventListener('click', refreshInquiries);
  byId('inquirySearch').addEventListener('input', renderInquiries);
  byId('statusFilter').addEventListener('change', renderInquiries);
  languageSelect.addEventListener('change', () => {
    currentLocale = languageSelect.value === 'en' ? 'en' : 'de';
    localStorage.setItem('prdxq-language', currentLocale);
    applyLocale();
  });
  applyLocale();
  start();
})();
