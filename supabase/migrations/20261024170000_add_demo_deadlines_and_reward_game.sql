-- PRDXQ project demo deadlines and hidden reward game.
-- Additive only: preserves existing inquiry data and policies.

alter table public.inquiries
  add column if not exists demo_due_at timestamptz not null default (now() + interval '3 days'),
  add column if not exists demo_status text not null default 'not_started'
    check (demo_status in ('not_started','in_progress','ready','sent','blocked'));

create index if not exists inquiries_demo_due_idx
  on public.inquiries (demo_due_at)
  where demo_status not in ('sent','blocked');

create table if not exists private.reward_challenges (
  id uuid primary key default gen_random_uuid(),
  answer_hash text not null check (answer_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 minutes'),
  solved_at timestamptz,
  attempts integer not null default 0 check (attempts between 0 and 10)
);
alter table private.reward_challenges enable row level security;
revoke all on table private.reward_challenges from public, anon, authenticated;
grant usage on schema private to service_role;
grant all on table private.reward_challenges to service_role;

create table if not exists public.reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  email text not null check (char_length(email) between 3 and 254),
  voucher_code text not null unique,
  challenge_id uuid not null references private.reward_challenges(id),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 days'),
  redeemed_at timestamptz,
  email_status text not null default 'pending'
    check (email_status in ('pending','sent','failed')),
  constraint reward_redemptions_email_lowercase check (email = lower(email))
);
alter table public.reward_redemptions enable row level security;
revoke all on table public.reward_redemptions from public, anon, authenticated;
grant select on table public.reward_redemptions to authenticated;
drop policy if exists "PRDXQ admins can read reward redemptions" on public.reward_redemptions;
create policy "PRDXQ admins can read reward redemptions"
  on public.reward_redemptions for select to authenticated
  using (private.is_prdxq_admin());
grant all on table public.reward_redemptions to service_role;

create index if not exists reward_redemptions_created_idx
  on public.reward_redemptions (created_at desc);
