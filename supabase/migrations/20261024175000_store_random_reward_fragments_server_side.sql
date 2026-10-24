alter table public.reward_challenges
  add column if not exists answer text,
  add column if not exists found_fragments jsonb not null default '[]'::jsonb;
alter table public.reward_challenges
  add constraint reward_challenges_found_fragments_array
  check (jsonb_typeof(found_fragments) = 'array');