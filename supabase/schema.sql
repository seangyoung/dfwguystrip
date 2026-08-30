-- Run once in the Supabase SQL Editor before deploying the site.
create extension if not exists "pgcrypto";

create type public.trip_role as enum ('participant', 'coordinator');
create type public.availability_status as enum ('available', 'maybe', 'unavailable');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  role public.trip_role not null default 'participant',
  created_at timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  body text not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.activities (
  id text primary key,
  name text not null,
  category text not null,
  tier text not null check (tier in ('flagship', 'alternate')),
  cost_estimate text not null,
  restrictions text not null,
  seasonal_note text not null,
  source_url text not null,
  note text not null,
  is_published boolean not null default true,
  sort_order integer not null default 0
);

create table public.itineraries (
  id text primary key,
  name text not null,
  subtitle text not null,
  cost_estimate text not null,
  theme text not null,
  is_published boolean not null default true,
  sort_order integer not null default 0
);

create table public.itinerary_stops (
  id uuid primary key default gen_random_uuid(),
  itinerary_id text not null references public.itineraries(id) on delete cascade,
  day_number integer not null check (day_number between 1 and 3),
  sort_order integer not null default 0,
  label text not null
);

create table public.candidate_dates (
  day date primary key,
  is_open boolean not null default true,
  note text
);

create table public.availability_responses (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  day date not null references public.candidate_dates(day) on delete cascade,
  status public.availability_status not null,
  updated_at timestamptz not null default now(),
  primary key (profile_id, day)
);

create table public.activity_votes (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  activity_id text not null references public.activities(id) on delete cascade,
  rank integer check (rank between 1 and 3),
  would_avoid boolean not null default false,
  comment text,
  updated_at timestamptz not null default now(),
  primary key (profile_id, activity_id),
  constraint one_vote_kind check ((rank is not null and would_avoid = false) or (rank is null and would_avoid = true))
);

create unique index activity_votes_one_rank_per_person on public.activity_votes(profile_id, rank) where rank is not null;

create or replace function public.is_coordinator()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'coordinator');
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, coalesce(new.email, ''));
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.announcements enable row level security;
alter table public.activities enable row level security;
alter table public.itineraries enable row level security;
alter table public.itinerary_stops enable row level security;
alter table public.candidate_dates enable row level security;
alter table public.availability_responses enable row level security;
alter table public.activity_votes enable row level security;

create policy "participants read their profile" on public.profiles for select using (id = auth.uid());
create policy "coordinators read profiles" on public.profiles for select using (public.is_coordinator());
create policy "participants update their profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));
create policy "coordinators manage profiles" on public.profiles for all using (public.is_coordinator()) with check (public.is_coordinator());

create policy "read published announcements" on public.announcements for select using (is_published or public.is_coordinator());
create policy "coordinators manage announcements" on public.announcements for all using (public.is_coordinator()) with check (public.is_coordinator());
create policy "read published activities" on public.activities for select using (is_published or public.is_coordinator());
create policy "coordinators manage activities" on public.activities for all using (public.is_coordinator()) with check (public.is_coordinator());
create policy "read published itineraries" on public.itineraries for select using (is_published or public.is_coordinator());
create policy "coordinators manage itineraries" on public.itineraries for all using (public.is_coordinator()) with check (public.is_coordinator());
create policy "read stops for visible itineraries" on public.itinerary_stops for select using (exists(select 1 from public.itineraries where id = itinerary_id and (is_published or public.is_coordinator())));
create policy "coordinators manage stops" on public.itinerary_stops for all using (public.is_coordinator()) with check (public.is_coordinator());
create policy "read open dates" on public.candidate_dates for select using (is_open or public.is_coordinator());
create policy "coordinators manage dates" on public.candidate_dates for all using (public.is_coordinator()) with check (public.is_coordinator());

create policy "participants manage own availability" on public.availability_responses for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy "coordinators read availability" on public.availability_responses for select using (public.is_coordinator());
create policy "participants manage own votes" on public.activity_votes for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy "coordinators read votes" on public.activity_votes for select using (public.is_coordinator());

-- After the organizer's first magic-link login, promote that profile exactly once:
-- update public.profiles set role = 'coordinator' where email = 'organizer@example.com';
