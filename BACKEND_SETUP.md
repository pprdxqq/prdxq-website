# PRDXQ backend configuration

This repository uses the Supabase project **PRDXQ Frankfurt** (nolygqnmpmegkotejuli) for inquiry submission and reward vouchers.

## Edge Function secrets

In Supabase Dashboard → Edge Functions → Secrets, verify/configure:

- RESEND_API_KEY — Resend API key for transactional email.
- PRDXQ_EMAIL_FROM — verified sender address/domain configured in Resend.
- PRDXQ_ADMIN_EMAIL — inbox for new inquiry notifications.

Supabase provides SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to Edge Functions. Never add the service-role key to browser code or Git.

The existing inquiry endpoint saves the inquiry first, then attempts to send the customer receipt and admin notification. Email delivery is best-effort; the API response indicates whether each email was sent. The customer receipt promises an initial demo or a clarification response within three days.

## Reward flow

The prdxq-rewards Edge Function creates random per-session puzzle answers, serves each fragment only when its matching website marker is clicked, validates the complete answer server-side, and issues one voucher per challenge. Voucher codes expire after 30 days. A failed email delivery can be retried by submitting the same challenge and email again.

## Admin access

The admin.html dashboard requires a Supabase Auth user and the private.prdxq_admins allowlist. Add the lower-case admin email in the Supabase SQL Editor, for example:

    insert into private.prdxq_admins (email)
    values (lower('YOUR_ADMIN_EMAIL'))
    on conflict do nothing;

Do not commit admin addresses or service credentials to this repository.

## Important verification notes

- Confirm the three email secrets are configured before relying on customer/admin emails.
- Verify the sending domain in Resend and test inbox/spam delivery.
- The voucher table tracks issued codes and status; an external payment/checkout system is not connected, so redeemed_at is not automatically populated yet.
- The Work carousel labels independent, uncommissioned redesign concepts as concepts. Original live previews are not linked until the deployment URL for each project is verified.
