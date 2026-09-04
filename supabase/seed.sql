-- Run this in the Supabase SQL Editor after supabase/schema.sql.
-- It is safe to run again. The React app currently owns the display copy;
-- these rows provide the database identities required for votes and availability.

insert into public.activities (
  id, name, category, tier, cost_estimate, restrictions, seasonal_note, source_url, note, is_published, sort_order
)
select
  id,
  initcap(replace(id, '-', ' ')),
  'Seeded app catalog',
  'alternate',
  'See trip hub',
  'See trip hub',
  'See trip hub',
  'https://github.com/seangyoung/dfwguystrip',
  'Catalog details are maintained in the trip hub.',
  true,
  ordinal
from unnest(array[
  'zero-g', 'speedway', 'six-flags', 'state-fair', 'scarborough', 'mustang-magic',
  'goodguys', 'nascar-weekend', 'stockyards', 'gun-experience', 'mountain-bike',
  'helicopter-tour', 'ifly', 'activate', 'ebike-tour', 'museum-illusions', 'sixth-floor',
  'go-ape', 'att-stadium-tour', 'reunion-tower', 'chapel-thanksgiving',
  'national-videogame-museum', 'escape-game', 'las-colinas-gondola', 'arboretum',
  'katy-trail', 'buc-ees', 'fowling', 'future-flight', 'horseback', 'smash-n-bash',
  'summit-climbing', 'battlefield-nerf', 'meow-wolf', 'medieval-times', 'lonesome-dove',
  'the-mexican', 'fearings', 'pappas-bros', 'cattlemens', 'whataburger', 'uptown-eats',
  'moviehouse-eatery', 'andretti', 'fossil-rim'
]::text[]) with ordinality as seeded(id, ordinal)
on conflict (id) do nothing;

insert into public.candidate_dates (day, is_open, note)
select day::date, true, null
from generate_series('2026-01-01'::date, '2027-12-31'::date, interval '1 day') as dates(day)
on conflict (day) do nothing;
