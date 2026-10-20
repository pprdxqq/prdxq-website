const { timingSafeEqual } = require('node:crypto');

function matchesSecret(actual, expected) {
  if (typeof actual !== 'string' || typeof expected !== 'string') return false;
  const left = Buffer.from(actual);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

module.exports = async function cleanupInquiries(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  const secret = process.env.CRON_SECRET;
  const authorization = req.headers.authorization || '';
  if (!secret || secret.length < 32 || !matchesSecret(authorization, 'Bearer ' + secret)) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const base = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) return res.status(503).json({ error: 'service_unavailable' });
  const headers = { apikey: key, 'Content-Type': 'application/json' };
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SECRET_KEY) {
    headers.Authorization = 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
  try {
    const response = await fetch(base.replace(/\/+$/, '') + '/rest/v1/rpc/delete_expired_inquiries', {
      method: 'POST',
      headers,
      body: '{}',
      signal: AbortSignal.timeout(7000)
    });
    if (!response.ok) {
      console.error('Inquiry retention cleanup failed.', 'database_' + response.status);
      return res.status(503).json({ error: 'cleanup_failed' });
    }
    const deletedCount = await response.json();
    console.info('Inquiry retention cleanup completed.', Number.isInteger(deletedCount) ? deletedCount : 0);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ok: true, deleted: Number.isInteger(deletedCount) ? deletedCount : 0 });
  } catch {
    console.error('Inquiry retention cleanup could not reach the database.');
    return res.status(503).json({ error: 'cleanup_failed' });
  }
};
