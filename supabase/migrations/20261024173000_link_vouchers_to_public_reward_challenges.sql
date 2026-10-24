alter table public.reward_redemptions drop constraint if exists reward_redemptions_challenge_id_fkey;
alter table public.reward_redemptions
  add constraint reward_redemptions_challenge_id_fkey
  foreign key (challenge_id) references public.reward_challenges(id);