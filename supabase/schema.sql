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
  username    text unique,
  avatar_url  text,
  occupation  text,
  gender      text,
  phone_number text,
  interests   text[] default '{}',
  bio         text,
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
  insert into public.profiles (
    id, name, date_of_birth, username, bio, occupation, gender, phone_number, interests
  )
  values (
    new.id, 
    new.raw_user_meta_data ->> 'name',
    (new.raw_user_meta_data ->> 'dob')::date,
    new.raw_user_meta_data ->> 'username',
    new.raw_user_meta_data ->> 'bio',
    new.raw_user_meta_data ->> 'occupation',
    new.raw_user_meta_data ->> 'gender',
    new.raw_user_meta_data ->> 'phone_number',
    case 
      when new.raw_user_meta_data -> 'interests' is not null 
      then array(select jsonb_array_elements_text(new.raw_user_meta_data -> 'interests'))
      else '{}'::text[]
    end
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

-- ---- Goals (Personal Goals) --------------------------------
create table if not exists public.goals (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  title         text not null,
  target        integer not null default 1,
  progress      integer not null default 0,
  completed     boolean not null default false,
  created_at    timestamptz not null default now()
);

alter table public.goals enable row level security;

create policy "Goals are viewable by their owner"
  on public.goals for select
  using (auth.uid() = user_id);

create policy "Users can insert their own goals"
  on public.goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own goals"
  on public.goals for update
  using (auth.uid() = user_id);

create policy "Users can delete their own goals"
  on public.goals for delete
  using (auth.uid() = user_id);
-- ---- Sleep Entries (one row per night) ----------------------
create table if not exists public.sleep_entries (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  date          date not null,                     -- the night's date (YYYY-MM-DD)
  bedtime       text not null,                     -- "HH:mm" 24h
  wake_time     text not null,                     -- "HH:mm" 24h
  hours_slept   numeric(4,1) not null,             -- computed duration
  quality       text not null,                     -- 'poor' | 'okay' | 'good' | 'great'
  notes         text,
  created_at    timestamptz not null default now()
);

alter table public.sleep_entries enable row level security;

create policy "Sleep entries are viewable by their owner"
  on public.sleep_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own sleep entries"
  on public.sleep_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own sleep entries"
  on public.sleep_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own sleep entries"
  on public.sleep_entries for delete
  using (auth.uid() = user_id);

-- One entry per user per date (upsert friendly)
create unique index if not exists sleep_entries_user_date_idx
  on public.sleep_entries (user_id, date desc);

create index if not exists sleep_entries_user_created_idx
  on public.sleep_entries (user_id, created_at desc);

-- ---- Functions ---------------------------------------------
create or replace function public.check_username_available(check_username text)
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare
  is_taken boolean;
begin
  select exists(select 1 from public.profiles where username = check_username) into is_taken;
  return not is_taken;
end;
$$;
