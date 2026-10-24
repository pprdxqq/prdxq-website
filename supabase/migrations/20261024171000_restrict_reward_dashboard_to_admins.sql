create table if not exists public.reward_challenges (
  id uuid primary key default gen_random_uuid(),
  answer_hash text not null check (answer_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 minutes'),
  solved_at timestamptz,
  attempts integer not null default 0 check (attempts between 0 and 10)
);
alter table public.reward_challenges enable row level security;
revoke all on table public.reward_challenges from public, anon, authenticated;
grant all on table public.reward_challenges to service_role;
create index if not exists reward_challenges_expiry_idx on public.reward_challenges (expires_at);
grant select on table public.reward_challenges to authenticated;
drop policy if exists "PRDXQ admins can read reward challenges" on public.reward_challenges;
create policy "PRDXQ admins can read reward challenges"
  on public.reward_challenges for select to authenticated
  using (private.is_prdxq_admin());