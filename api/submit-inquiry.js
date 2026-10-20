const { createHmac } = require('node:crypto');

const MAX_BODY_BYTES = 20 * 1024;
const ALLOWED_ANSWER_KEYS = new Set(['type', 'goal', 'features', 'stage', 'style']);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

class RequestError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function text(value, maxLength, { required = false, allowNewlines = false } = {}) {
  if (value === undefined || value === null) value = '';
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new RequestError(400, 'Invalid form fields.');
  }
  let clean = String(value).normalize('NFKC');
  clean = allowNewlines
    ? clean.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    : clean.replace(/[\u0000-\u001f\u007f]/g, ' ');
  clean = clean.trim();
  if (clean.length > maxLength || (required && clean.length < 1)) {
    throw new RequestError(400, 'Invalid form fields.');
  }
  return clean;
}

function normalizeAnswers(value) {
  if (value === undefined || value === null || value === '') return {};
  if (typeof value === 'string') {
    try { value = JSON.parse(value); } catch { throw new RequestError(400, 'Invalid project summary.'); }
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new RequestError(400, 'Invalid project summary.');
  }
  const answers = {};
  for (const [key, selected] of Object.entries(value)) {
    if (!ALLOWED_ANSWER_KEYS.has(key)) continue;
    const values = Array.isArray(selected) ? selected : [selected];
    if (values.length > 10 || values.some((item) => typeof item !== 'string' || !/^[a-z0-9_-]{1,48}$/i.test(item))) {
      throw new RequestError(400, 'Invalid project summary.');
    }
    answers[key] = [...new Set(values)];
  }
  return answers;
}

function normalizeInquiry(body, { noJs = false } = {}) {
  const name = text(body.name, 120, { required: true });
  const email = text(body.email, 254, { required: true }).toLowerCase();
  const phone = text(body.phone, 40);
  const message = text(body.message, 3000, { allowNewlines: true });
  if (name.length < 2 || !EMAIL_PATTERN.test(email) || email.length < 3) {
    throw new RequestError(400, 'Please check the name and email address.');
  }
  if (phone && !/^[+0-9().\s/-]{5,40}$/.test(phone)) {
    throw new RequestError(400, 'Please check the phone number.');
  }
  if (body.website && String(body.website).trim()) {
    throw new RequestError(400, 'Invalid form submission.');
  }
  if (noJs && String(body.challenge || '').trim() !== '7') {
    throw new RequestError(400, 'Please answer the short verification question.');
  }
  return {
    name,
    email,
    phone: phone || null,
    message,
    answers: normalizeAnswers(body.answers ?? body.projectAnswers)
  };
}

async function readRequestBody(req, contentType) {
  let raw;
  if (req.body !== undefined) {
    if (contentType === 'application/x-www-form-urlencoded' && req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
      const serialized = new URLSearchParams(Object.entries(req.body).map(([key, value]) => [key, String(value)])).toString();
      if (Buffer.byteLength(serialized, 'utf8') > MAX_BODY_BYTES) throw new RequestError(413, 'Request is too large.');
      return Object.fromEntries(new URLSearchParams(serialized));
    }
    raw = typeof req.body === 'string' || Buffer.isBuffer(req.body)
      ? Buffer.from(req.body)
      : Buffer.from(JSON.stringify(req.body));
  } else {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) throw new RequestError(413, 'Request is too large.');
      chunks.push(Buffer.from(chunk));
    }
    raw = Buffer.concat(chunks);
  }
  if (raw.length > MAX_BODY_BYTES) throw new RequestError(413, 'Request is too large.');
  const source = raw.toString('utf8');
  if (contentType === 'application/json') {
    try { return JSON.parse(source); } catch { throw new RequestError(400, 'Invalid request body.'); }
  }
  if (contentType === 'application/x-www-form-urlencoded') {
    return Object.fromEntries(new URLSearchParams(source));
  }
  throw new RequestError(415, 'Unsupported content type.');
}

function allowedOrigin(origin, env = process.env) {
  if (!origin) return false;
  let parsed;
  try { parsed = new URL(origin); } catch { return false; }
  const allowed = new Set([(env.SITE_URL || 'https://prdxq.de').replace(/\/+$/, '')]);
  if (env.NODE_ENV !== 'production') {
    allowed.add('http://localhost:4173');
    allowed.add('http://127.0.0.1:4173');
  }
  return allowed.has(parsed.origin);
}

function missingConfiguration(env, noJs) {
  const missing = [];
  if (!env.SUPABASE_URL) missing.push('SUPABASE_URL');
  if (!env.RATE_LIMIT_HASH_SECRET || Buffer.byteLength(env.RATE_LIMIT_HASH_SECRET, 'utf8') < 32) missing.push('RATE_LIMIT_HASH_SECRET');
  if (!env.SUPABASE_SECRET_KEY && !env.SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SECRET_KEY');
  if (!noJs && !env.TURNSTILE_SECRET_KEY) missing.push('TURNSTILE_SECRET_KEY');
  return missing;
}

function requestIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const address = Array.isArray(forwarded) ? forwarded[0] : String(forwarded || '').split(',')[0];
  return address.trim().slice(0, 80) || null;
}

function keyedHash(value, secret) {
  return createHmac('sha256', secret).update(value).digest('hex');
}

function supabaseHeaders(env) {
  const newSecret = env.SUPABASE_SECRET_KEY;
  const legacySecret = env.SUPABASE_SERVICE_ROLE_KEY;
  const key = newSecret || legacySecret;
  const headers = { apikey: key, 'Content-Type': 'application/json' };
  if (legacySecret && !newSecret) headers.Authorization = 'Bearer ' + legacySecret;
  return headers;
}

async function supabaseRequest(path, options, env) {
  const base = env.SUPABASE_URL.replace(/\/+$/, '');
  const response = await fetch(base + '/rest/v1/' + path, {
    ...options,
    headers: { ...supabaseHeaders(env), ...(options.headers || {}) },
    signal: AbortSignal.timeout(7000)
  });
  const body = await response.text();
  if (!response.ok) {
    const error = new Error('Database request failed.');
    error.code = 'database_' + response.status;
    throw error;
  }
  if (!body) return null;
  try { return JSON.parse(body); } catch { return body; }
}

async function verifyTurnstile(token, ip, env) {
  if (typeof token !== 'string' || token.length < 1 || token.length > 2048) return false;
  const fields = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token });
  if (ip) fields.set('remoteip', ip);
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: fields.toString(),
    signal: AbortSignal.timeout(6000)
  });
  if (!response.ok) return false;
  const result = await response.json().catch(() => null);
  const expectedHost = (env.SITE_HOSTNAME || 'prdxq.de').toLowerCase();
  return Boolean(result?.success && result.hostname?.toLowerCase() === expectedHost && result.action === 'contact');
}

async function withinRateLimit(ipHash, emailHash, env) {
  const result = await supabaseRequest('rpc/allow_inquiry_request', {
    method: 'POST',
    body: JSON.stringify({ p_ip_hash: ipHash, p_email_hash: emailHash })
  }, env);
  return result === true || (Array.isArray(result) && result[0] === true);
}

function safeErrorCode(code) {
  return typeof code === 'string' && /^[a-z0-9_-]{1,50}$/i.test(code) ? code : 'email_provider_error';
}

async function sendEmail({ to, from, replyTo, subject, message }, apiKey) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], reply_to: replyTo, subject, text: message }),
      signal: AbortSignal.timeout(7000)
    });
    if (!response.ok) {
      const provider = await response.json().catch(() => ({}));
      return { sent: false, errorCode: safeErrorCode(provider.name || provider.code) };
    }
    const result = await response.json().catch(() => ({}));
    return { sent: true, id: typeof result.id === 'string' ? result.id.slice(0, 100) : null };
  } catch {
    return { sent: false, errorCode: 'email_provider_unavailable' };
  }
}

function jsonResponse(res, status, payload) {
  res.status(status);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return res.json(payload);
}

function htmlResponse(res, status, title, message) {
  res.status(status);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'");
  return res.send('<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>' + title + ' — PRDXQ</title><body style="max-width:620px;margin:12vh auto;padding:24px;font:16px/1.6 Arial,sans-serif;color:#17201d;background:#f0f2ed"><p style="font:11px monospace;letter-spacing:.1em">PRDXQ / KONTAKT</p><h1 style="font-size:38px;letter-spacing:-.06em">' + title + '</h1><p>' + message + '</p><a href="/contact.html" style="display:inline-block;margin-top:12px;padding:13px 17px;border-radius:30px;background:#17201d;color:white;text-decoration:none">Zur Kontaktseite</a></body></html>');
}

async function handler(req, res) {
  const noJs = req.method === 'POST' && req.body && String(req.body.nojs || '') === '1';
  const isJson = (req.headers['content-type'] || '').split(';')[0].trim() === 'application/json';
  const wantsJson = isJson || req.headers.accept?.includes('application/json');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return jsonResponse(res, 405, { error: 'method_not_allowed' });
  }
  if (!allowedOrigin(req.headers.origin)) {
    return wantsJson ? jsonResponse(res, 403, { error: 'origin_not_allowed' }) : htmlResponse(res, 403, 'Anfrage nicht möglich', 'Bitte sende das Formular direkt über prdxq.de ab.');
  }

  try {
    const contentType = (req.headers['content-type'] || '').split(';')[0].trim();
    const body = await readRequestBody(req, contentType);
    const isNoJs = String(body.nojs || '') === '1';
    const missing = missingConfiguration(process.env, isNoJs);
    if (missing.length) {
      return wantsJson ? jsonResponse(res, 503, { error: 'service_unavailable' }) : htmlResponse(res, 503, 'Formular nicht bereit', 'Das Anfrageformular ist noch nicht vollständig eingerichtet. Bitte versuche es später erneut.');
    }

    const inquiry = normalizeInquiry(body, { noJs: isNoJs });
    const ip = requestIp(req);
    if (!isNoJs && !(await verifyTurnstile(body.turnstileToken, ip, process.env))) {
      return jsonResponse(res, 400, { error: 'verification_failed' });
    }

    const secret = process.env.RATE_LIMIT_HASH_SECRET;
    const ipHash = ip ? keyedHash('ip:' + ip, secret) : null;
    const emailHash = keyedHash('email:' + inquiry.email, secret);
    if (!(await withinRateLimit(ipHash, emailHash, process.env))) {
      return wantsJson
        ? jsonResponse(res, 429, { error: 'rate_limited' })
        : htmlResponse(res, 429, 'Bitte warte kurz', 'Zu viele Anfragen wurden gerade gesendet. Bitte versuche es später erneut.');
    }

    const record = {
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      message: inquiry.message,
      project_answers: inquiry.answers,
      status: 'new',
      notification_status: 'pending',
      receipt_status: 'pending'
    };
    const inserted = await supabaseRequest('inquiries?select=id,created_at', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(record)
    }, process.env);
    const row = Array.isArray(inserted) ? inserted[0] : null;
    if (!row?.id) throw new Error('Database did not confirm the inquiry.');

    const formattedAnswers = Object.keys(inquiry.answers).length
      ? JSON.stringify(inquiry.answers, null, 2)
      : 'Keine zusätzliche Projektauswahl.';
    const notificationText = [
      'Neue PRDXQ-Projektanfrage',
      '',
      'Name: ' + inquiry.name,
      'E-Mail: ' + inquiry.email,
      'Telefon: ' + (inquiry.phone || 'Nicht angegeben'),
      '',
      'Nachricht:',
      inquiry.message || 'Keine zusätzliche Nachricht.',
      '',
      'Projektprofil:',
      formattedAnswers,
      '',
      'Anfrage-ID: ' + row.id
    ].join('\n');
    const receiptText = [
      'Hallo ' + inquiry.name + ',',
      '',
      'danke für deine Nachricht an PRDXQ. Deine Projektanfrage ist angekommen und wird gelesen.',
      'Du erhältst eine persönliche Rückmeldung an diese E-Mail-Adresse.',
      '',
      'Viele Grüße',
      'Ilias Asdufan',
      'PRDXQ'
    ].join('\n');
    const mailReady = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL && process.env.INQUIRY_NOTIFICATION_EMAIL);
    let receiptStatus = 'pending';
    if (mailReady) {
      const [notification, receipt] = await Promise.all([
        sendEmail({
          to: process.env.INQUIRY_NOTIFICATION_EMAIL,
          from: process.env.RESEND_FROM_EMAIL,
          replyTo: inquiry.email,
          subject: 'Neue Projektanfrage — ' + inquiry.name,
          message: notificationText
        }, process.env.RESEND_API_KEY),
        sendEmail({
          to: inquiry.email,
          from: process.env.RESEND_FROM_EMAIL,
          replyTo: process.env.INQUIRY_NOTIFICATION_EMAIL,
          subject: 'Deine Anfrage bei PRDXQ ist angekommen',
          message: receiptText
        }, process.env.RESEND_API_KEY)
      ]);
      receiptStatus = receipt.sent ? 'sent' : 'failed';
      const statusUpdate = {
        notification_status: notification.sent ? 'sent' : 'failed',
        receipt_status: receipt.sent ? 'sent' : 'failed',
        notification_sent_at: notification.sent ? new Date().toISOString() : null,
        receipt_sent_at: receipt.sent ? new Date().toISOString() : null,
        notification_error_code: notification.sent ? null : notification.errorCode,
        receipt_error_code: receipt.sent ? null : receipt.errorCode
      };
      try {
        await supabaseRequest('inquiries?id=eq.' + encodeURIComponent(row.id), {
          method: 'PATCH',
          headers: { Prefer: 'return=minimal' },
          body: JSON.stringify(statusUpdate)
        }, process.env);
      } catch {
        // The inquiry is already stored. Its pending mail states remain visible in the dashboard.
        console.error('Inquiry mail status could not be updated.');
      }
      if (!notification.sent) console.error('Inquiry notification email failed.');
      if (!receipt.sent) console.error('Inquiry receipt email failed.');
    }

    return wantsJson
      ? jsonResponse(res, 201, { ok: true, receiptStatus })
      : htmlResponse(res, 201, 'Danke für deine Anfrage', 'Deine Nachricht ist angekommen. Du erhältst eine persönliche Rückmeldung.');
  } catch (error) {
    if (error instanceof RequestError) {
      return wantsJson
        ? jsonResponse(res, error.status, { error: 'invalid_request' })
        : htmlResponse(res, error.status, 'Bitte prüfe das Formular', error.message);
    }
    console.error('Inquiry submission failed.', error?.code || 'internal_error');
    return wantsJson
      ? jsonResponse(res, 503, { error: 'service_unavailable' })
      : htmlResponse(res, 503, 'Senden gerade nicht möglich', 'Deine Anfrage wurde nicht bestätigt. Bitte versuche es später erneut.');
  }
}

handler._test = { normalizeAnswers, normalizeInquiry, allowedOrigin, keyedHash, missingConfiguration, readRequestBody };
module.exports = handler;
