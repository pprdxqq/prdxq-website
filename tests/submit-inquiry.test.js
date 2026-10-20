const test = require('node:test');
const assert = require('node:assert/strict');
const submitInquiry = require('../api/submit-inquiry');
const cleanupInquiries = require('../api/cleanup-inquiries');

const { allowedOrigin, keyedHash, normalizeAnswers, normalizeInquiry, missingConfiguration, readRequestBody } = submitInquiry._test;

test('valid inquiry trims and normalizes contact fields', () => {
  const result = normalizeInquiry({
    name: '  Ilias Asdufan  ',
    email: '  ILIAS@example.de ',
    phone: '+49 177 123456',
    message: '  Eine neue Website.\nBitte Rückruf.  ',
    answers: { goal: ['presence'], unknown: ['drop-this'] }
  });
  assert.equal(result.name, 'Ilias Asdufan');
  assert.equal(result.email, 'ilias@example.de');
  assert.equal(result.message, 'Eine neue Website.\nBitte Rückruf.');
  assert.deepEqual(result.answers, { goal: ['presence'] });
});

test('invalid email and phone are rejected server-side', () => {
  assert.throws(() => normalizeInquiry({ name: 'Ada', email: 'bad-address' }), { status: 400 });
  assert.throws(() => normalizeInquiry({ name: 'Ada', email: 'ada@example.de', phone: 'call me' }), { status: 400 });
});

test('honeypot and no-script challenge reject automated submissions', () => {
  assert.throws(() => normalizeInquiry({
    name: 'Ada', email: 'ada@example.de', website: 'filled'
  }), { status: 400 });
  assert.throws(() => normalizeInquiry({
    name: 'Ada', email: 'ada@example.de', challenge: '8'
  }, { noJs: true }), { status: 400 });
});

test('project answers accept only known fields and bounded values', () => {
  assert.deepEqual(normalizeAnswers({
    type: ['website'],
    extra: ['ignored']
  }), { type: ['website'] });
  assert.throws(() => normalizeAnswers({ goal: ['<script>'] }), { status: 400 });
  assert.throws(() => normalizeAnswers({ style: Array(11).fill('clean') }), { status: 400 });
});

test('origin policy accepts the configured site and local development only', () => {
  assert.equal(allowedOrigin('https://prdxq.de', { SITE_URL: 'https://prdxq.de', NODE_ENV: 'production' }), true);
  assert.equal(allowedOrigin('https://evil.example', { SITE_URL: 'https://prdxq.de', NODE_ENV: 'production' }), false);
  assert.equal(allowedOrigin('http://localhost:4173', { SITE_URL: 'https://prdxq.de', NODE_ENV: 'development' }), true);
  assert.equal(allowedOrigin(undefined, {}), false);
});

test('rate-limit fingerprints use HMAC and do not expose the source value', () => {
  const first = keyedHash('ip:203.0.113.8', 'a-test-secret');
  assert.match(first, /^[0-9a-f]{64}$/);
  assert.equal(keyedHash('ip:203.0.113.8', 'a-test-secret'), first);
  assert.notEqual(keyedHash('ip:203.0.113.8', 'another-secret'), first);
});

test('required service settings fail closed when missing', () => {
  assert.ok(missingConfiguration({}, false).includes('TURNSTILE_SECRET_KEY'));
  assert.ok(missingConfiguration({}, true).includes('SUPABASE_SECRET_KEY'));
  assert.deepEqual(missingConfiguration({
    SUPABASE_URL: 'https://example.supabase.co',
    SUPABASE_SECRET_KEY: 'service-key',
    RATE_LIMIT_HASH_SECRET: 'a-test-hash-secret-that-is-long-enough-for-production',
    RESEND_API_KEY: 'mail-key',
    RESEND_FROM_EMAIL: 'PRDXQ <verified@example.com>',
    INQUIRY_NOTIFICATION_EMAIL: 'owner@example.com',
    TURNSTILE_SECRET_KEY: 'captcha-secret'
  }, false), []);
});

test('URL-encoded forms work with Vercel parsed bodies and raw request bodies', async () => {
  const fields = { name: 'Ada Lovelace', email: 'ada@example.de', challenge: '7', nojs: '1' };
  const parsed = await readRequestBody({ body: fields }, 'application/x-www-form-urlencoded');
  assert.deepEqual(parsed, fields);

  const raw = new URLSearchParams(fields).toString();
  const unparsed = await readRequestBody({ body: Buffer.from(raw) }, 'application/x-www-form-urlencoded');
  assert.deepEqual(unparsed, fields);
});

test('retention endpoint rejects unauthenticated requests before database access', async () => {
  const response = {
    statusCode: 200,
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return value; }
  };
  await cleanupInquiries({ method: 'GET', headers: { authorization: 'Bearer invalid' } }, response);
  assert.equal(response.statusCode, 401);
  assert.deepEqual(response.body, { error: 'unauthorized' });
});

test('inquiry endpoint fails closed without service configuration and does not redirect', async () => {
  const keys = [
    'SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'SUPABASE_SERVICE_ROLE_KEY',
    'RATE_LIMIT_HASH_SECRET', 'TURNSTILE_SECRET_KEY', 'RESEND_API_KEY',
    'RESEND_FROM_EMAIL', 'INQUIRY_NOTIFICATION_EMAIL'
  ];
  const saved = new Map(keys.map((key) => [key, Object.hasOwn(process.env, key) ? process.env[key] : undefined]));
  keys.forEach((key) => delete process.env[key]);
  const response = {
    statusCode: 200,
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return value; }
  };
  try {
    await submitInquiry({
      method: 'POST',
      headers: { origin: 'https://prdxq.de', 'content-type': 'application/json', accept: 'application/json' },
      body: { name: 'Ada Lovelace', email: 'ada@example.de' }
    }, response);
    assert.equal(response.statusCode, 503);
    assert.deepEqual(response.body, { error: 'service_unavailable' });
    assert.equal(response.headers.Location, undefined);
  } finally {
    for (const [key, value] of saved) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
