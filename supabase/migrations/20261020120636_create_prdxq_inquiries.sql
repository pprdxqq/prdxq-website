begin;

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 3 and 254),
  phone text check (phone is null or char_length(phone) <= 40),
  message text not null default '' check (char_length(message) <= 3000),
  project_answers jsonb not null default '{}'::jsonb
    check (jsonb_typeof(project_answers) = 'object'),
  status text not null default 'new'
    check (status in ('new', 'in_progress', 'replied', 'closed')),
  notification_status text not null default 'pending'
    check (notification_status in ('pending', 'sent', 'failed')),
  receipt_status text not null default 'pending'
    check (receipt_status in ('pending', 'sent', 'failed')),
  notification_sent_at timestamptz,
  receipt_sent_at timestamptz,
  notification_error_code text,
  receipt_error_code text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '180 days')
);

create index inquiries_status_created_idx on public.inquiries (status, created_at desc);
create index inquiries_expiry_idx on public.inquiries (expires_at);

alter table public.inquiries enable row level security;
revoke all on table public.inquiries from public, anon, authenticated;
grant select, insert, update, delete on table public.inquiries to service_role;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to service_role;

create table private.inquiry_rate_limits (
  key_hash text primary key check (key_hash ~ '^(ip|email):[0-9a-f]{64}$'),
  window_started_at timestamptz not null,
  request_count integer not null check (request_count > 0)
);

alter table private.inquiry_rate_limits enable row level security;
revoke all on table private.inquiry_rate_limits from public, anon, authenticated;
grant select, insert, update, delete on table private.inquiry_rate_limits to service_role;

create or replace function public.allow_inquiry_request(
  p_ip_hash text,
  p_email_hash text
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $function$
declare
  v_key text;
  v_limit integer;
  v_count integer;
  v_now timestamptz := pg_catalog.clock_timestamp();
begin
  if p_email_hash is null or p_email_hash !~ '^[0-9a-f]{64}$' then
    return false;
  end if;
  if p_ip_hash is not null and p_ip_hash !~ '^[0-9a-f]{64}$' then
    return false;
  end if;

  delete from private.inquiry_rate_limits
  where window_started_at < v_now - interval '24 hours';

  for v_key, v_limit in
    select limits.key_hash, limits.request_limit
    from (
      values
        ('email:' || p_email_hash, 3),
        ('ip:' || p_ip_hash, 8)
    ) as limits(key_hash, request_limit)
    where limits.key_hash is not null
  loop
    insert into private.inquiry_rate_limits as current_limit (
      key_hash,
      window_started_at,
      request_count
    )
    values (v_key, v_now, 1)
    on conflict (key_hash) do update
    set
      window_started_at = case
        when current_limit.window_started_at <= v_now - interval '1 hour' then v_now
        else current_limit.window_started_at
      end,
      request_count = case
        when current_limit.window_started_at <= v_now - interval '1 hour' then 1
        else current_limit.request_count + 1
      end
    returning request_count into v_count;

    if v_count > v_limit then
      return false;
    end if;
  end loop;

  return true;
end;
$function$;

revoke all on function public.allow_inquiry_request(text, text) from public, anon, authenticated;
grant execute on function public.allow_inquiry_request(text, text) to service_role;

create or replace function public.delete_expired_inquiries()
returns integer
language plpgsql
security invoker
set search_path = ''
as $function$
declare
  v_deleted integer;
begin
  delete from public.inquiries where expires_at <= pg_catalog.now();
  get diagnostics v_deleted = row_count;

  delete from private.inquiry_rate_limits
  where window_started_at < pg_catalog.now() - interval '24 hours';

  return v_deleted;
end;
$function$;

revoke all on function public.delete_expired_inquiries() from public, anon, authenticated;
grant execute on function public.delete_expired_inquiries() to service_role;

commit;
