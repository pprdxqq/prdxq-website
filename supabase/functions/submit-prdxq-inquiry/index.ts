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
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[char] ?? char));
}
async function sendAcknowledgement(email: string, name: string): Promise<boolean> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("PRDXQ_EMAIL_FROM");
  if (!apiKey || !from) {
    console.error("Acknowledgement email not sent: RESEND_API_KEY or PRDXQ_EMAIL_FROM is not configured.");
    return false;
  }
  const safeName = escapeHtml(name);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      replyTo: "ilias.asdufan@gmail.com",
      to: [email],
      subject: "Deine Anfrage bei PRDXQ ist eingegangen",
      text: `Hallo ${name},

vielen Dank, dass du dich für PRDXQ entschieden hast und uns deine Anfrage geschickt hast.

Wir haben deine Anfrage erfolgreich erhalten. Sie wird derzeit geprüft. Du erhältst innerhalb von 3 Tagen eine erste Demo oder eine Rückmeldung, falls wichtige Angaben fehlen.

Falls du in der Zwischenzeit noch wichtige Informationen ergänzen möchtest, kannst du einfach auf diese E-Mail antworten.

Vielen Dank für dein Vertrauen.

Viele Grüße
PRDXQ
https://prdxq.de`,
      html: `<!doctype html><html lang="de"><body style="margin:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;color:#17191d;padding:32px 16px"><div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e6e8ec;border-radius:18px;padding:36px 30px"><p style="font-size:13px;letter-spacing:3px;font-weight:700">PRDXQ</p><h1 style="font-size:25px;line-height:1.3">Deine Anfrage ist eingegangen.</h1><p>Hallo ${safeName},</p><p>vielen Dank, dass du dich für PRDXQ entschieden hast und uns deine Anfrage geschickt hast.</p><p>Wir haben deine Anfrage erfolgreich erhalten. Sie wird derzeit geprüft. Du erhältst innerhalb von 3 Tagen eine erste Demo oder eine Rückmeldung, falls wichtige Angaben fehlen.</p><p style="padding:14px;background:#f0f2ec;border-radius:10px"><strong>Dein nächster Schritt:</strong> Innerhalb von 3 Tagen erhältst du eine erste Demo oder eine Rückmeldung, falls wichtige Angaben fehlen.</p><p>Falls du in der Zwischenzeit noch wichtige Informationen ergänzen möchtest, kannst du einfach auf diese E-Mail antworten.</p><p>Vielen Dank für dein Vertrauen.</p><p style="margin-top:32px">Viele Grüße<br><strong>PRDXQ</strong></p><p style="margin-top:28px;font-size:13px"><a href="https://prdxq.de" style="color:#17191d">prdxq.de</a></p></div></body></html>`,
    }),
  });
  if (!response.ok) {
    const detail = await response.text();
    console.error("Acknowledgement email provider returned an error:", response.status, detail.slice(0, 500));
    return false;
  }
  return true;
}
async function sendAdminNotification(id: string, name: string, email: string, message: string): Promise<boolean> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("PRDXQ_EMAIL_FROM");
  const adminEmail = Deno.env.get("PRDXQ_ADMIN_EMAIL");
  if (!apiKey || !from || !adminEmail) {
    console.error("Admin notification not sent: RESEND_API_KEY, PRDXQ_EMAIL_FROM or PRDXQ_ADMIN_EMAIL is not configured.");
    return false;
  }
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message.slice(0, 3000));
  const due = new Date(Date.now() + 3 * 86400000).toLocaleString("de-DE", { timeZone: "Europe/Berlin" });
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from, to: [adminEmail], subject: "Neue PRDXQ-Anfrage — Demo in 3 Tagen fällig",
      text: `Neue Anfrage #${id}\nName: ${name}\nE-Mail: ${email}\nDemo-Zieltermin: ${due}\n\n${message}\n\nAdmin: https://prdxq.de/admin.html`,
      html: `<!doctype html><html lang="de"><body style="font-family:Arial,sans-serif;color:#17191d;padding:24px"><h1>Neue PRDXQ-Anfrage</h1><p><strong>${safeName}</strong> · <a href="mailto:${safeEmail}">${safeEmail}</a></p><p>Demo-Zieltermin: <strong>${due}</strong></p><pre style="white-space:pre-wrap;font:14px/1.6 Arial,sans-serif">${safeMessage}</pre><p><a href="https://prdxq.de/admin.html">Admin-Bereich öffnen</a></p></body></html>`,
    }),
  });
  if (!response.ok) {
    console.error("Admin notification provider error:", response.status, (await response.text()).slice(0, 300));
    return false;
  }
  return true;
}
Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  const headers = headersFor(origin);
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405, headers });
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return new Response(JSON.stringify({ error: "origin_not_allowed" }), { status: 403, headers });
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400, headers }); }
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const answers = body.project_answers && typeof body.project_answers === "object" && !Array.isArray(body.project_answers) ? body.project_answers : {};
  const honeypot = typeof body.website === "string" ? body.website : "";
  if (honeypot) return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  if (name.length < 2 || name.length > 120) return new Response(JSON.stringify({ error: "invalid_name" }), { status: 400, headers });
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return new Response(JSON.stringify({ error: "invalid_email" }), { status: 400, headers });
  if (phone.length > 40 || message.length > 3000) return new Response(JSON.stringify({ error: "invalid_length" }), { status: 400, headers });
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return new Response(JSON.stringify({ error: "backend_not_configured" }), { status: 500, headers });
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("cf-connecting-ip") ?? "unknown";
  const [ipHash, emailHash] = await Promise.all([sha256(forwarded), sha256(email)]);
  const rpcResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/submit_public_inquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "apikey": serviceRoleKey, "Authorization": `Bearer ${serviceRoleKey}` },
    body: JSON.stringify({ p_name: name, p_email: email, p_phone: phone || null, p_message: message, p_project_answers: answers, p_ip_hash: ipHash, p_email_hash: emailHash, p_honeypot: honeypot }),
  });
  if (!rpcResponse.ok) {
    const details = await rpcResponse.text();
    const limited = details.includes("rate_limited");
    return new Response(JSON.stringify({ error: limited ? "rate_limited" : "submission_failed" }), { status: limited ? 429 : 400, headers });
  }
  const id = await rpcResponse.json();
  // Saving the inquiry is the primary operation. Email delivery is best-effort so a mail-provider
  // outage cannot lose a submitted inquiry or make the customer resubmit it.
  const emailSent = await sendAcknowledgement(email, name).catch((error) => {
    console.error("Acknowledgement email failed:", String(error));
    return false;
  });
  const adminNotified = await sendAdminNotification(String(id), name, email, message).catch((error) => {
    console.error("Admin notification failed:", String(error));
    return false;
  });
  return new Response(JSON.stringify({ ok: true, id, emailSent, adminNotified }), { status: 201, headers });
});