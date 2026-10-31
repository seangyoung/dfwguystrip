-- Run once in the Supabase SQL Editor to switch from ranked ballots
-- to per-activity Definitely / Interested / No thanks preferences.
-- Existing submissions are preserved and converted.

begin;

alter table public.activity_votes add column if not exists preference text;

update public.activity_votes
set preference = case
  when would_avoid then 'no_thanks'
  when rank = 1 then 'definitely'
  else 'interested'
end
where preference is null;

alter table public.activity_votes drop constraint if exists one_vote_kind;
drop index if exists public.activity_votes_one_rank_per_person;
alter table public.activity_votes alter column preference set not null;
alter table public.activity_votes add constraint activity_votes_preference_check
  check (preference in ('definitely', 'interested', 'no_thanks'));
alter table public.activity_votes drop column if exists rank;
alter table public.activity_votes drop column if exists would_avoid;
alter table public.activity_votes drop column if exists comment;

commit;
