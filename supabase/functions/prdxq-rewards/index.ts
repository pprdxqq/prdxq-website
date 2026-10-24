import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ALLOWED_ORIGINS = new Set(["https://prdxq.de", "https://www.prdxq.de"]);
const headersFor = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://prdxq.de",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
  "Vary": "Origin",
});
async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
}
function json(status: number, payload: Record<string, unknown>, headers: Record<string,string>) {
  return new Response(JSON.stringify(payload), { status, headers });
}
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c] ?? c));
}
async function db(path: string, method: string, body?: unknown, prefer?: string) {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("backend_not_configured");
  const response = await fetch(url + "/rest/v1/" + path, {
    method,
    headers: {
      "apikey": key, "Authorization": "Bearer " + key,
      "Content-Type": "application/json",
      ...(prefer ? { "Prefer": prefer } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const text = await response.text();
  if (!response.ok) throw new Error("database_error:" + response.status + ":" + text.slice(0, 300));
  return text ? JSON.parse(text) : null;
}
async function sendVoucher(email: string, code: string, expiresAt: string): Promise<boolean> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("PRDXQ_EMAIL_FROM");
  if (!apiKey || !from) return false;
  const safeCode = escapeHtml(code);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": "Bearer " + apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      from, to: [email], subject: "Dein PRDXQ 10%-Gutschein",
      text: "Du hast das PRDXQ-Rätsel gelöst! Dein Code: " + code + "\nGültig bis: " + expiresAt.slice(0,10) + "\nDer Code gilt einmalig für ein PRDXQ-Projekt und ist nicht mit anderen Rabatten kombinierbar.",
      html: '<!doctype html><html lang="de"><body style="margin:0;background:#f4f5f7;font-family:Arial,sans-serif;padding:32px 16px;color:#17191d"><main style="max-width:560px;margin:auto;background:#fff;border-radius:18px;padding:32px"><p style="letter-spacing:4px;font-weight:bold">PRDXQ</p><h1>Du hast das Signal gefunden.</h1><p>Dein 10%-Gutschein ist freigeschaltet.</p><p style="font-size:24px;font-weight:bold;letter-spacing:2px;background:#f0f2ec;padding:18px;border-radius:10px">' + safeCode + '</p><p>Gültig bis ' + expiresAt.slice(0,10) + '. Einmalig für ein PRDXQ-Projekt; nicht mit anderen Rabatten kombinierbar.</p><p>Viele Grüße<br>PRDXQ</p></main></body></html>',
    }),
  });
  return response.ok;
}
Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  const headers = headersFor(origin);
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return json(405, { error: "method_not_allowed" }, headers);
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return json(403, { error: "origin_not_allowed" }, headers);
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json(400, { error: "invalid_json" }, headers); }
  const action = typeof body.action === "string" ? body.action : "";
  try {
    if (action === "start") {
      const answer = "PRDXQ";
      const id = crypto.randomUUID();
      const answerHash = await sha256(id + ":" + answer);
      await db("reward_challenges", "POST", { id, answer_hash: answerHash }, "return=minimal");
      return json(201, { ok: true, challengeId: id, expiresInSeconds: 1800 }, headers);
    }
    if (action === "solve") {
      const id = typeof body.challengeId === "string" ? body.challengeId : "";
      const answer = typeof body.answer === "string" ? body.answer.trim().toUpperCase() : "";
      if (!/^[0-9a-f-]{36}$/.test(id) || answer.length < 1 || answer.length > 32) return json(400, { error: "invalid_answer" }, headers);
      const rows = await db("reward_challenges?id=eq." + encodeURIComponent(id) + "&select=id,answer_hash,expires_at,solved_at,attempts", "GET");
      const challenge = rows?.[0];
      if (!challenge || new Date(challenge.expires_at).getTime() < Date.now() || challenge.attempts >= 10) return json(400, { error: "challenge_expired" }, headers);
      if (challenge.solved_at) return json(200, { ok: true, solved: true }, headers);
      const correct = (await sha256(id + ":" + answer)) === challenge.answer_hash;
      await db("reward_challenges?id=eq." + encodeURIComponent(id), "PATCH", { attempts: challenge.attempts + 1, ...(correct ? { solved_at: new Date().toISOString() } : {}) }, "return=minimal");
      return json(correct ? 200 : 400, correct ? { ok: true, solved: true } : { error: "not_solved", attemptsLeft: 9 - challenge.attempts }, headers);
    }
    if (action === "redeem") {
      const id = typeof body.challengeId === "string" ? body.challengeId : "";
      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      if (!/^[0-9a-f-]{36}$/.test(id) || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: "invalid_email" }, headers);
      const challenges = await db("reward_challenges?id=eq." + encodeURIComponent(id) + "&select=id,solved_at,expires_at", "GET");
      const challenge = challenges?.[0];
      if (!challenge || !challenge.solved_at || new Date(challenge.expires_at).getTime() < Date.now()) return json(403, { error: "puzzle_not_solved" }, headers);
      const existing = await db("reward_redemptions?challenge_id=eq." + encodeURIComponent(id) + "&select=id,voucher_code,expires_at,email", "GET");
      if (existing?.length) {
        if (existing[0].email !== email) return json(409, { error: "already_redeemed" }, headers);
        const sentAgain = await sendVoucher(email, existing[0].voucher_code, existing[0].expires_at).catch(() => false);
        if (sentAgain) await db("reward_redemptions?challenge_id=eq." + encodeURIComponent(id), "PATCH", { email_status: "sent" }, "return=minimal");
        return json(200, { ok: true, emailSent: sentAgain, alreadyIssued: true }, headers);
      }
      const code = "PRDXQ-" + Array.from(crypto.getRandomValues(new Uint8Array(5)), n => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[n % 32]).join("");
      const expiresAt = new Date(Date.now() + 30 * 86400000).toISOString();
      await db("reward_redemptions", "POST", { email, voucher_code: code, challenge_id: id, expires_at: expiresAt }, "return=minimal");
      const sent = await sendVoucher(email, code, expiresAt).catch(() => false);
      if (sent) await db("reward_redemptions?challenge_id=eq." + encodeURIComponent(id), "PATCH", { email_status: "sent" }, "return=minimal");
      return json(201, { ok: true, emailSent: sent, message: sent ? "voucher_sent" : "voucher_created_email_pending" }, headers);
    }
    return json(400, { error: "unknown_action" }, headers);
  } catch (error) {
    console.error("PRDXQ reward function error:", String(error));
    return json(500, { error: "backend_error" }, headers);
  }
});