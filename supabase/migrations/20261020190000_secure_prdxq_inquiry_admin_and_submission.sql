-- PRDXQ inquiry submission and admin access.
-- Applied to Supabase project nolygqnmpmegkotejuli (PRDXQ Frankfurt).

create schema if not exists private;

create table if not exists private.prdxq_admins (
  email text primary key,
  created_at timestamptz not null default pg_catalog.now(),
  constraint prdxq_admins_email_lowercase check (email = pg_catalog.lower(email))
);

-- Keep administrator identities out of this public repository.
-- Insert the authorized administrator email directly in the Supabase SQL Editor:
-- insert into private.prdxq_admins (email) values (lower('YOUR_ADMIN_EMAIL')) on conflict do nothing;

revoke all on table private.prdxq_admins from public, anon, authenticated;
grant usage on schema private to anon, authenticated;

create or replace function private.is_prdxq_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select exists (
    select 1 from private.prdxq_admins a
    where a.email = pg_catalog.lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$function$;
revoke all on function private.is_prdxq_admin() from public;
grant execute on function private.is_prdxq_admin() to anon, authenticated;

alter table public.inquiries enable row level security;
revoke all on table public.inquiries from public, anon, authenticated;
grant select, update on table public.inquiries to authenticated;

drop policy if exists "PRDXQ admins can read inquiries" on public.inquiries;
create policy "PRDXQ admins can read inquiries" on public.inquiries
for select to authenticated using (private.is_prdxq_admin());

drop policy if exists "PRDXQ admins can update inquiries" on public.inquiries;
create policy "PRDXQ admins can update inquiries" on public.inquiries
for update to authenticated using (private.is_prdxq_admin())
with check (private.is_prdxq_admin());

create or replace function public.submit_public_inquiry(
  p_name text, p_email text, p_phone text default null, p_message text default '',
  p_project_answers jsonb default '{}'::jsonb, p_ip_hash text default null,
  p_email_hash text default null, p_honeypot text default ''
)
returns uuid
language plpgsql security definer set search_path = ''
as $function$
declare
  v_id uuid;
  v_name text := pg_catalog.btrim(coalesce(p_name, ''));
  v_email text := pg_catalog.lower(pg_catalog.btrim(coalesce(p_email, '')));
  v_phone text := nullif(pg_catalog.btrim(coalesce(p_phone, '')), '');
  v_message text := pg_catalog.btrim(coalesce(p_message, ''));
  v_answers jsonb := coalesce(p_project_answers, '{}'::jsonb);
begin
  if coalesce(p_honeypot, '') <> '' then return null; end if;
  if pg_catalog.char_length(v_name) < 2 or pg_catalog.char_length(v_name) > 120 then
    raise exception 'invalid_name' using errcode = '22023';
  end if;
  if pg_catalog.char_length(v_email) < 3 or pg_catalog.char_length(v_email) > 254
     or v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'invalid_email' using errcode = '22023';
  end if;
  if v_phone is not null and pg_catalog.char_length(v_phone) > 40 then
    raise exception 'invalid_phone' using errcode = '22023';
  end if;
  if pg_catalog.char_length(v_message) > 3000 then
    raise exception 'message_too_long' using errcode = '22023';
  end if;
  if pg_catalog.jsonb_typeof(v_answers) <> 'object' then
    raise exception 'invalid_project_answers' using errcode = '22023';
  end if;
  if p_email_hash is null or p_email_hash !~ '^[0-9a-f]{64}$'
     or (p_ip_hash is not null and p_ip_hash !~ '^[0-9a-f]{64}$') then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  if not public.allow_inquiry_request(p_ip_hash, p_email_hash) then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;
  insert into public.inquiries (name,email,phone,message,project_answers,status)
  values (v_name,v_email,v_phone,v_message,v_answers,'new')
  returning id into v_id;
  return v_id;
end;
$function$;
revoke all on function public.submit_public_inquiry(text,text,text,text,jsonb,text,text,text) from public, anon, authenticated;
grant execute on function public.submit_public_inquiry(text,text,text,text,jsonb,text,text,text) to service_role;

create or replace function public.is_prdxq_admin()
returns boolean language sql stable security invoker set search_path = ''
as $function$
  select private.is_prdxq_admin();
$function$;
revoke all on function public.is_prdxq_admin() from public, anon;
grant execute on function public.is_prdxq_admin() to authenticated;
