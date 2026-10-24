grant select on table public.reward_challenges to authenticated;
drop policy if exists "PRDXQ admins can read reward challenges" on public.reward_challenges;
create policy "PRDXQ admins can read reward challenges"
  on public.reward_challenges for select to authenticated
  using (private.is_prdxq_admin());