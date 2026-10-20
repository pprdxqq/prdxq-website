# PRDXQ operations and deployment

## Current architecture

- Public pages are static HTML/CSS/JavaScript served by Vercel.
- api/submit-inquiry.js validates same-origin submissions, verifies Cloudflare Turnstile, applies database-backed rate limits, stores each inquiry, then sends a notification and customer receipt through Resend.
- supabase/migrations/20261020120636_create_prdxq_inquiries.sql creates the inquiry table, private rate-limit table, RLS rules, and restricted maintenance RPCs.
- api/cleanup-inquiries.js is a Vercel Cron endpoint that deletes inquiries after 180 days and expires rate-limit fingerprints.
- The owner handles new inquiries in the Supabase Dashboard table editor. Change status from new to in_progress, replied, or closed as the request is handled. There is no public admin interface.

The live domain currently responds from Vercel. This repository also contains .github/workflows/pages.yml, which deploys static files to GitHub Pages. GitHub Pages does not run the API or cron functions. Keep Vercel as the production deployment unless the backend is migrated to a platform that supports server functions and scheduled jobs. The workflow has not been removed.

## Supabase setup

1. Create a Supabase project in the Frankfurt region (eu-central-1) so the planned EU-region statement in datenschutz.html matches the actual database location.
2. Install or run the current Supabase CLI. The repository was initialized with CLI 2.121.0.
3. Link this checkout to the project and apply the migration:

   ~~~sh
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF
   npx supabase db push
   ~~~

4. In the Supabase Dashboard, confirm that public.inquiries has RLS enabled and that anon and authenticated have no table or function privileges. Only the server-side secret key can read or write inquiry data.
5. Keep the Dashboard and database credentials private. The browser never receives a Supabase key.

The inquiries table stores name, email, optional phone, optional message, project selections, handling status, mail-delivery status, and timestamps. It does not store the request IP address. Keyed HMAC fingerprints of the request IP and email stay in the unexposed private schema for the 24-hour rate-limit window. The next request or daily cleanup removes expired entries; with no traffic, removal can take nearly 48 hours after creation.

## Vercel environment variables

Set these as Vercel Production variables. Use a separate Supabase project, Turnstile widget, sender configuration, and values for Preview. Never put server credentials in site-config.js or commit them.

| Variable | Purpose |
| --- | --- |
| SITE_URL | Exact production origin, normally https://prdxq.de |
| SITE_HOSTNAME | Hostname required in Turnstile results, normally prdxq.de |
| SUPABASE_URL | Project URL, such as https://PROJECT_REF.supabase.co |
| SUPABASE_SECRET_KEY | Supabase server-only secret key; a legacy SUPABASE_SERVICE_ROLE_KEY is supported if needed |
| RATE_LIMIT_HASH_SECRET | Random private HMAC key, at least 32 bytes |
| TURNSTILE_SECRET_KEY | Cloudflare Turnstile server-side secret |
| RESEND_API_KEY | Resend API key for transactional mail |
| RESEND_FROM_EMAIL | Sender address on a domain verified with Resend |
| INQUIRY_NOTIFICATION_EMAIL | Private inbox that receives new inquiry notices |
| CRON_SECRET | Random secret of at least 32 characters for the retention endpoint |

.env.example lists the variable names without real credentials. Generate the random values in a password manager or secret generator and enter them in the Vercel project settings. Do not paste production secrets into chat, source files, browser code, or GitHub Pages.

Create a Cloudflare Turnstile widget restricted to prdxq.de. Put its public site key only in site-config.js as turnstileSiteKey. The matching secret belongs in Vercel as TURNSTILE_SECRET_KEY. For Preview, use a separate test widget and configure its matching hostname. Server-side verification checks the token, hostname, and contact action.

Verify the sender domain with Resend before going live. The API stores the inquiry before attempting both messages; if mail delivery fails, the row remains in Supabase with a failed mail status for follow-up. Check Vercel logs for generic delivery failures and the dashboard for pending/failed requests. Logs do not include submitted names, email addresses, messages, IP addresses, or secrets.

## Deployment and first-run verification

1. Review the migration and apply it to the intended Supabase project.
2. Set all required Vercel variables and the public Turnstile site key.
3. Deploy the repository to Vercel. vercel.json places functions in Frankfurt and schedules cleanup daily at 03:15 UTC.
4. On a Preview deployment, submit one test request using test contact data. Verify the row, status, notification email, customer receipt, and retry/error behavior before using production.
5. Confirm the daily Cron Job appears in Vercel and can call /api/cleanup-inquiries with CRON_SECRET.
6. Verify that prdxq.de resolves to the intended Vercel project. Do not use the GitHub Pages workflow as a substitute for the Vercel deployment.

The local public Turnstile key is blank by design, so the JavaScript form will show a setup message and cannot submit until configured. The no-JavaScript form uses a simple arithmetic check and the same server-side validation and rate limits.

## Data retention and privacy checks

- Inquiry rows expire 180 days after receipt; the daily Vercel Cron Job invokes delete_expired_inquiries.
- Rate-limit fingerprints contain HMAC digests only and are removed after 24 hours.
- The public legal pages disclose Vercel, Google Fonts, Cloudflare Turnstile, Supabase, and Resend. Before activating submissions, verify the actual Supabase region, each provider’s current data-processing terms, the Vercel project region, and applicable transfer safeguards. Update datenschutz.html if the deployed configuration differs.
- The project currently loads Manrope and DM Mono from Google Fonts. This creates a browser request to Google and is described on the privacy page.
- Confirm the published business details in impressum.html before deployment.

## Request handling

Use the Supabase Dashboard table editor, with owner-level project access, to review requests and update the status field. Do not grant public access or expose the Supabase service key to build a public admin panel. Failed notification/receipt messages are indicated by their respective status fields; respond manually to those inquiries from the dashboard.
