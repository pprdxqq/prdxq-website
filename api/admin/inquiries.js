'use strict';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ALLOWED_STATUSES = new Set(['new', 'in_progress', 'replied', 'closed']);
const SELECT = 'id,name,email,phone,message,project_answers,status,notification_status,receipt_status,created_at';

function respond(res, status, payload) {
  res.status(status);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, private');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Vary', 'Authorization, Origin');
  return res.json(payload);
}

function configuration(env) {
  const url = String(env.SUPABASE_URL || '').replace(/\/+$/, '');
  const secretKey = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
  const publishableKey = env.SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY;
  const allowlist = String(env.ADMIN_EMAILS || env.INQUIRY_NOTIFICATION_EMAIL || '')
    .split(',').map((email) => email.trim().toLowerCase()).filter(Boolean);
  return url && secretKey && publishableKey && allowlist.length
    ? { url, secretKey, publishableKey, legacyServiceRoleKey: !env.SUPABASE_SECRET_KEY, allowlist }
    : null;
}

function originAllowed(req, env) {
  const origin = req.headers.origin;
  if (!origin) return true;
  let siteOrigin;
  try { siteOrigin = new URL(env.SITE_URL || 'https://prdxq.de').origin; } catch { return false; }
  return origin === siteOrigin;
}

async function verifyAdmin(req, config) {
  const authorization = req.headers.authorization || '';
  const match = /^Bearer ([A-Za-z0-9._~-]{20,4096})$/.exec(authorization);
  if (!match) return { status: 401 };

  const response = await fetch(config.url + '/auth/v1/user', {
    method: 'GET',
    headers: {
      apikey: config.publishableKey,
      Authorization: 'Bearer ' + match[1]
    },
    signal: AbortSignal.timeout(6500)
  });
  if (response.status === 401 || response.status === 403) return { status: 401 };
  if (!response.ok) return { status: 503 };

  const user = await response.json().catch(() => null);
  const email = typeof user?.email === 'string' ? user.email.trim().toLowerCase() : '';
  if (!email || !config.allowlist.includes(email) || user?.email_confirmed_at == null) return { status: 403 };
  return { user: { id: user.id, email } };
}

async function databaseRequest(config, path, options = {}) {
  const headers = {
    apikey: config.secretKey,
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (config.legacyServiceRoleKey) headers.Authorization = 'Bearer ' + config.secretKey;
  const response = await fetch(config.url + '/rest/v1/' + path, {
    ...options,
    headers,
    signal: AbortSignal.timeout(8000)
  });
  if (response.status === 204) return [];
  const body = await response.text();
  if (!response.ok) throw new Error('database_' + response.status);
  return body ? JSON.parse(body) : [];
}

async function handler(req, res) {
  if (!['GET', 'PATCH'].includes(req.method)) {
    res.setHeader('Allow', 'GET, PATCH');
    return respond(res, 405, { error: 'method_not_allowed' });
  }
  if (!originAllowed(req, process.env)) return respond(res, 403, { error: 'origin_not_allowed' });

  const config = configuration(process.env);
  if (!config) return respond(res, 503, { error: 'admin_not_configured' });

  try {
    const access = await verifyAdmin(req, config);
    if (access.status) return respond(res, access.status, { error: access.status === 401 ? 'sign_in_required' : access.status === 403 ? 'admin_access_denied' : 'auth_unavailable' });

    if (req.method === 'GET') {
      const status = typeof req.query?.status === 'string' && ALLOWED_STATUSES.has(req.query.status) ? req.query.status : null;
      const query = new URLSearchParams({ select: SELECT, order: 'created_at.desc', limit: '100' });
      if (status) query.set('status', 'eq.' + status);
      const rows = await databaseRequest(config, 'inquiries?' + query.toString());
      return respond(res, 200, { inquiries: Array.isArray(rows) ? rows : [] });
    }

    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = null; }
    }
    const id = typeof body?.id === 'string' ? body.id : '';
    const status = typeof body?.status === 'string' ? body.status : '';
    if (!UUID_PATTERN.test(id) || !ALLOWED_STATUSES.has(status)) return respond(res, 400, { error: 'invalid_update' });

    const rows = await databaseRequest(config, 'inquiries?id=eq.' + encodeURIComponent(id) + '&select=id,status', {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ status })
    });
    if (!Array.isArray(rows) || rows.length !== 1) return respond(res, 404, { error: 'inquiry_not_found' });
    return respond(res, 200, { inquiry: rows[0] });
  } catch (error) {
    console.error('Admin inquiry request failed.', error?.message || 'internal_error');
    return respond(res, 503, { error: 'admin_service_unavailable' });
  }
}

module.exports = handler;
