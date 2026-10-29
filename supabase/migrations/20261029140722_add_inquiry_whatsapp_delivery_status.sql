-- Track optional WhatsApp admin notifications for each PRDXQ inquiry.
-- Additive only; existing inquiries, RLS policies and grants are preserved.

alter table public.inquiries
  add column if not exists whatsapp_notification_status text not null default 'not_configured'
    check (whatsapp_notification_status in ('not_configured', 'pending', 'sent', 'failed')),
  add column if not exists whatsapp_sent_at timestamptz,
  add column if not exists whatsapp_error_code text;

comment on column public.inquiries.whatsapp_notification_status is
  'Delivery state for the optional PRDXQ owner WhatsApp notification.';
comment on column public.inquiries.whatsapp_error_code is
  'Sanitized delivery error code only; never store provider response bodies or credentials.';
