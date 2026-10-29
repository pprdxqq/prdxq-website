# PRDXQ backend configuration

This repository uses the Supabase project **PRDXQ Frankfurt** (nolygqnmpmegkotejuli) for inquiry submission and reward vouchers. The live contact form calls the Supabase Edge Function `submit-prdxq-inquiry`.

## Inquiry email notifications

In **Supabase Dashboard → Edge Functions → Secrets**, configure these for the `submit-prdxq-inquiry` function:

- `RESEND_API_KEY` — Resend API key for transactional email.
- `PRDXQ_EMAIL_FROM` — verified sender address/domain configured in Resend. The handler also accepts `RESEND_FROM_EMAIL` as an alias.
- `PRDXQ_ADMIN_EMAIL` — inbox for every new inquiry notification. The handler also accepts `INQUIRY_NOTIFICATION_EMAIL` as an alias.
- Optional: `PRDXQ_REPLY_TO_EMAIL` — reply-to address for the customer receipt.

**Important:** Vercel environment variables are separate from Supabase Edge Function secrets. The live form calls Supabase directly, so values configured only in Vercel do not automatically reach this function. Copy the intended sender, Resend key, and notification inbox into Supabase's Edge Function Secrets.

Supabase provides `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions. Never add the service-role key to browser code or Git.

The endpoint saves an inquiry first, then sends the customer receipt and admin notification. Transient network, HTTP 429, and HTTP 5xx failures get one short retry. Delivery outcomes are written to `public.inquiries`:
- Admin email: `notification_status`, `notification_sent_at`, `notification_error_code`.
- Customer receipt: `receipt_status`, `receipt_sent_at`, `receipt_error_code`.

Provider response bodies and credentials are not stored in delivery error fields. A stored inquiry remains successful even if a notification provider is temporarily unavailable; check the saved delivery status and Edge Function logs rather than asking the customer to submit again.

The customer receipt promises an initial demo or a clarification response within three days.

## Optional WhatsApp owner alerts

WhatsApp is an additional admin alert. It does not replace the admin email, and WhatsApp failures do not prevent saving the inquiry or sending email.

To enable it, create/configure a Meta WhatsApp Business Platform Cloud API sender and a **Meta-approved message template**. Business-initiated messages need an approved template; the code intentionally does not send free-form texts. In **Supabase Dashboard → Edge Functions → Secrets**, add:

- `WHATSAPP_ACCESS_TOKEN` — preferably a long-lived system-user token with permission to send WhatsApp messages.
- `WHATSAPP_PHONE_NUMBER_ID` — numeric ID for the sender number in Meta.
- `WHATSAPP_ADMIN_TO` — your recipient mobile number in international format (country code + number).
- `WHATSAPP_TEMPLATE_NAME` — exact approved template name, e.g. `prdxq_new_inquiry`.
- `WHATSAPP_TEMPLATE_LANGUAGE` — exact approved template language code, e.g. `de`.
- Optional: `WHATSAPP_GRAPH_API_VERSION` — defaults to `v26.0`; update it when Meta's supported version changes.

The approved template must have **three body parameters** in this order:
1. Customer name: `{{1}}`
2. Customer email: `{{2}}`
3. Short inquiry ID: `{{3}}`

Suggested template text to submit for approval:

> Neue PRDXQ-Anfrage eingegangen. Name: {{1}}. E-Mail: {{2}}. Anfrage-ID: {{3}}. Öffne https://prdxq.de/admin.html zum Antworten.

Meta must approve the template before production delivery works. Once enabled, delivery state is stored in `whatsapp_notification_status`, `whatsapp_sent_at` and `whatsapp_error_code`. If no WhatsApp secrets are configured, the status is `not_configured` and the rest of the inquiry flow continues normally.

## Reward flow

The `prdxq-rewards` Edge Function creates random per-session puzzle answers, serves each fragment only when its matching website marker is clicked, validates the complete answer server-side, and issues one voucher per challenge. Voucher codes expire after 30 days. A failed email delivery can be retried by submitting the same challenge and email again.

## Admin access

The `admin.html` dashboard requires a Supabase Auth user and the `private.prdxq_admins` allowlist. Add the lower-case admin email in the Supabase SQL Editor, for example:

    insert into private.prdxq_admins (email)
    values (lower('YOUR_ADMIN_EMAIL'))
    on conflict do nothing;

Do not commit admin addresses or service credentials to this repository.

## Important verification notes

- Confirm the three email secrets are configured in **Supabase**, not only Vercel, before relying on customer/admin emails.
- Verify the sending domain in Resend and test inbox/spam delivery during an explicitly planned test.
- Configure and approve the WhatsApp template before expecting WhatsApp alerts; absent credentials are not treated as successful delivery.
- The voucher table tracks issued codes and status; an external payment/checkout system is not connected, so `redeemed_at` is not automatically populated yet.
- The Work carousel labels independent, uncommissioned redesign concepts as concepts. Original live previews are not linked until the deployment URL for each project is verified.
