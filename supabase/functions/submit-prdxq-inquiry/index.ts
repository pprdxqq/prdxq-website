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
type DeliveryResult = {
  sent: boolean;
  errorCode?: string;
  status?: "sent" | "failed" | "not_configured";
};

function getMailConfig() {
  return {
    apiKey: Deno.env.get("RESEND_API_KEY") ?? "",
    from: Deno.env.get("PRDXQ_EMAIL_FROM") ?? Deno.env.get("RESEND_FROM_EMAIL") ?? "",
  };
}

// Keep retries short so the inquiry endpoint remains responsive. Persisted delivery
// status makes any remaining provider failure visible without forcing a duplicate submission.
async function postJsonWithRetry(
  url: string,
  headers: Record<string, string>,
  payload: Record<string, unknown>,
  provider: "resend" | "whatsapp",
): Promise<DeliveryResult> {
  let lastError = provider + "_network_error";
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(12000),
      });
      if (response.ok) return { sent: true };
      lastError = provider + "_http_" + response.status;
      // Do not retry permanent request/auth/template errors.
      if (response.status !== 429 && response.status < 500) {
        return { sent: false, errorCode: lastError };
      }
    } catch {
      lastError = provider + "_network_error";
    }
    if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return { sent: false, errorCode: lastError };
}

async function sendAcknowledgement(email: string, name: string): Promise<DeliveryResult> {
  const { apiKey, from } = getMailConfig();
  if (!apiKey) return { sent: false, errorCode: "resend_api_key_missing" };
  if (!from) return { sent: false, errorCode: "email_sender_missing" };
  const safeName = escapeHtml(name);
  return await postJsonWithRetry("https://api.resend.com/emails", {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  }, {
    from,
    replyTo: Deno.env.get("PRDXQ_REPLY_TO_EMAIL") ?? "ilias.asdufan@gmail.com",
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
  }, "resend");
}

async function sendAdminNotification(
  id: string,
  name: string,
  email: string,
  message: string,
): Promise<DeliveryResult> {
  const { apiKey, from } = getMailConfig();
  const adminEmail = Deno.env.get("PRDXQ_ADMIN_EMAIL")
    ?? Deno.env.get("INQUIRY_NOTIFICATION_EMAIL")
    ?? "";
  if (!apiKey) return { sent: false, errorCode: "resend_api_key_missing" };
  if (!from) return { sent: false, errorCode: "email_sender_missing" };
  if (!adminEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) {
    return { sent: false, errorCode: "admin_email_missing_or_invalid" };
  }
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message.slice(0, 3000));
  const due = new Date(Date.now() + 3 * 86400000).toLocaleString("de-DE", { timeZone: "Europe/Berlin" });
  return await postJsonWithRetry("https://api.resend.com/emails", {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  }, {
    from,
    to: [adminEmail],
    subject: "Neue PRDXQ-Anfrage — Demo in 3 Tagen fällig",
    text: `Neue Anfrage #${id}\nName: ${name}\nE-Mail: ${email}\nDemo-Zieltermin: ${due}\n\n${message}\n\nAdmin: https://prdxq.de/admin.html`,
    html: `<!doctype html><html lang="de"><body style="font-family:Arial,sans-serif;color:#17191d;padding:24px"><h1>Neue PRDXQ-Anfrage</h1><p><strong>${safeName}</strong> · <a href="mailto:${safeEmail}">${safeEmail}</a></p><p>Demo-Zieltermin: <strong>${due}</strong></p><pre style="white-space:pre-wrap;font:14px/1.6 Arial,sans-serif">${safeMessage}</pre><p><a href="https://prdxq.de/admin.html">Admin-Bereich öffnen</a></p></body></html>`,
  }, "resend");
}

async function sendWhatsAppAdminNotification(
  id: string,
  name: string,
  email: string,
): Promise<DeliveryResult> {
  const token = Deno.env.get("WHATSAPP_ACCESS_TOKEN") ?? "";
  const phoneNumberId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID") ?? "";
  const recipient = (Deno.env.get("WHATSAPP_ADMIN_TO") ?? "").replace(/[^0-9]/g, "");
  const templateName = Deno.env.get("WHATSAPP_TEMPLATE_NAME") ?? "";
  const language = Deno.env.get("WHATSAPP_TEMPLATE_LANGUAGE") ?? "de";
  const apiVersion = Deno.env.get("WHATSAPP_GRAPH_API_VERSION") ?? "v26.0";

  // Optional integration: no WhatsApp secrets means no attempt and no false alarm.
  if (!token && !phoneNumberId && !recipient && !templateName) {
    return { sent: false, status: "not_configured" };
  }
  if (!token || !phoneNumberId || !recipient || !templateName || !language) {
    return { sent: false, status: "failed", errorCode: "whatsapp_configuration_incomplete" };
  }
  if (!/^[0-9]{5,30}$/.test(phoneNumberId) || !/^[0-9]{7,15}$/.test(recipient)
      || !/^[a-z0-9_]+$/.test(templateName) || !/^v\d+\.\d+$/.test(apiVersion)) {
    return { sent: false, status: "failed", errorCode: "whatsapp_configuration_invalid" };
  }

  return await postJsonWithRetry(
    `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
    { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: recipient,
      type: "template",
      template: {
        name: templateName,
        language: { code: language },
        components: [{
          type: "body",
          parameters: [
            { type: "text", text: name.slice(0, 120) },
            { type: "text", text: email.slice(0, 254) },
            { type: "text", text: id.slice(0, 8) },
          ],
        }],
      },
    },
    "whatsapp",
  ).then((result) => ({ ...result, status: result.sent ? "sent" : "failed" }));
}

async function saveDeliveryStatus(
  supabaseUrl: string,
  serviceRoleKey: string,
  id: string,
  fields: Record<string, unknown>,
): Promise<boolean> {
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/inquiries?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
        },
        body: JSON.stringify(fields),
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!response.ok) {
      console.error("Inquiry delivery status update failed with HTTP status:", response.status);
      return false;
    }
    return true;
  } catch {
    console.error("Inquiry delivery status update failed due to a database network error.");
    return false;
  }
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
  // The inquiry has already been saved. Delivery failures must not trigger duplicate submissions.
  const inquiryId = String(id);
  const [receipt, adminEmail, whatsapp] = await Promise.all([
    sendAcknowledgement(email, name),
    sendAdminNotification(inquiryId, name, email, message),
    sendWhatsAppAdminNotification(inquiryId, name, email),
  ]);
  const sentAt = new Date().toISOString();
  const whatsappStatus = whatsapp.status ?? (whatsapp.sent ? "sent" : "failed");
  const deliveryStatusSaved = await saveDeliveryStatus(supabaseUrl, serviceRoleKey, inquiryId, {
    receipt_status: receipt.sent ? "sent" : "failed",
    receipt_sent_at: receipt.sent ? sentAt : null,
    receipt_error_code: receipt.sent ? null : (receipt.errorCode ?? "receipt_delivery_failed"),
    notification_status: adminEmail.sent ? "sent" : "failed",
    notification_sent_at: adminEmail.sent ? sentAt : null,
    notification_error_code: adminEmail.sent ? null : (adminEmail.errorCode ?? "admin_notification_failed"),
    whatsapp_notification_status: whatsappStatus,
    whatsapp_sent_at: whatsapp.sent ? sentAt : null,
    whatsapp_error_code: whatsapp.sent || whatsappStatus === "not_configured"
      ? null
      : (whatsapp.errorCode ?? "whatsapp_delivery_failed"),
  });
  return new Response(JSON.stringify({
    ok: true,
    id: inquiryId,
    emailSent: receipt.sent,
    adminNotified: adminEmail.sent,
    whatsappNotified: whatsapp.sent,
    whatsappStatus,
    deliveryStatusSaved,
  }), { status: 201, headers });
});