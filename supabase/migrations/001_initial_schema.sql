-- True North — initial schema (Sprint 7)
-- Run in Supabase SQL editor or via Supabase CLI migrations.

-- ---------------------------------------------------------------------------
-- Profiles (extends auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Standards (My Standard / The Code)
-- ---------------------------------------------------------------------------
create table if not exists public.standards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  sort_order int not null,
  statement text not null,
  created_at timestamptz not null default now(),
  unique (user_id, sort_order)
);

alter table public.standards enable row level security;

create policy "Users can manage own standards"
  on public.standards for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Missions
-- ---------------------------------------------------------------------------
create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  purpose text not null,
  why_this_matters text not null default '',
  success_criteria text not null default '',
  current_progress text not null,
  next_milestone text not null,
  lifecycle text not null check (lifecycle in ('active', 'upcoming', 'completed')),
  mission_status text not null check (
    mission_status in ('on_track', 'at_risk', 'off_course', 'complete')
  ),
  status_source text not null default 'manual' check (
    status_source in ('manual', 'calculated')
  ),
  status_updated_at timestamptz,
  lessons_learned text not null default '',
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create unique index if not exists missions_one_active_per_user
  on public.missions (user_id)
  where lifecycle = 'active';

alter table public.missions enable row level security;

create policy "Users can manage own missions"
  on public.missions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Mission intents (daily morning commitment)
-- ---------------------------------------------------------------------------
create table if not exists public.mission_intents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  intent_date date not null,
  commitment text not null,
  source text not null check (source in ('suggested', 'custom')),
  created_at timestamptz not null default now(),
  unique (user_id, intent_date)
);

alter table public.mission_intents enable row level security;

create policy "Users can manage own mission intents"
  on public.mission_intents for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Daily debriefs (completed submissions)
-- ---------------------------------------------------------------------------
create table if not exists public.daily_debriefs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  debrief_date date not null,
  standards jsonb not null default '[]'::jsonb,
  biggest_win text not null default '',
  biggest_lesson text not null default '',
  tomorrow_one_percent text not null default '',
  tomorrow_priority text not null default '',
  course_correction text not null default '',
  completed_at timestamptz not null,
  unique (user_id, debrief_date)
);

alter table public.daily_debriefs enable row level security;

create policy "Users can manage own daily debriefs"
  on public.daily_debriefs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Daily one percent
-- ---------------------------------------------------------------------------
create table if not exists public.daily_one_percent (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  effective_date date not null,
  improvement text not null,
  source text not null check (source in ('debrief', 'seed', 'manual')),
  set_at timestamptz not null,
  unique (user_id, effective_date)
);

alter table public.daily_one_percent enable row level security;

create policy "Users can manage own daily one percent"
  on public.daily_one_percent for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Auto-create profile on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
