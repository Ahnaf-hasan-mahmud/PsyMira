-- ============================================================
--  PsyMira — database schema
--  Run this in the Supabase SQL Editor (Dashboard → SQL → New query).
--  Auth users live in the built-in `auth.users` table; we add a
--  `profiles` row per user and a `reflections` table for story results.
-- ============================================================

-- ---- Profiles (display name, streak, xp) -------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text,
  date_of_birth date,
  xp          integer not null default 0,
  streak      integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by their owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, date_of_birth)
  values (
    new.id, 
    new.raw_user_meta_data ->> 'name',
    (new.raw_user_meta_data ->> 'dob')::date
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---- Reflections (one row per completed story) -------------
create table if not exists public.reflections (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  story_id      text not null,
  story_title   text,
  lead_emotion  text,           -- e.g. "stillness"
  emotions      jsonb,          -- full tally { stillness: 5, courage: 2, ... }
  created_at    timestamptz not null default now()
);

alter table public.reflections enable row level security;

create policy "Reflections are viewable by their owner"
  on public.reflections for select
  using (auth.uid() = user_id);

create policy "Users can insert their own reflections"
  on public.reflections for insert
  with check (auth.uid() = user_id);

create index if not exists reflections_user_created_idx
  on public.reflections (user_id, created_at desc);

-- ---- Activities (History of all user events) ---------------
create table if not exists public.activities (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  kind          text not null, -- 'story', 'breathing', 'mood', 'game'
  minutes       integer not null default 0,
  mood          integer not null default 0,
  calm          integer not null default 0,
  story_id      text,
  title         text,
  emotion       text,
  technique     text,
  game_id       text,
  created_at    timestamptz not null default now()
);

alter table public.activities enable row level security;

create policy "Activities are viewable by their owner"
  on public.activities for select
  using (auth.uid() = user_id);

create policy "Users can insert their own activities"
  on public.activities for insert
  with check (auth.uid() = user_id);

create index if not exists activities_user_created_idx
  on public.activities (user_id, created_at desc);
