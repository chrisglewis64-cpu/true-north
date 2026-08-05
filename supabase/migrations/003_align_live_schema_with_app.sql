-- True North — align live Supabase schema with application expectations
-- Safe to re-run. Does NOT drop tables or data (including evidence / reviews).
-- Target: every table/column used by lib/database repositories + database.types.ts

-- Remove leftover helper from earlier migration drafts (if present)
drop function if exists public._tn_add_check_if_missing(regclass, text, text);

-- =============================================================================
-- Profiles (ensure base table + RLS)
-- =============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists display_name text,
  add column if not exists created_at timestamptz default now();

update public.profiles
set display_name = coalesce(nullif(display_name, ''), 'User')
where display_name is null;

update public.profiles
set created_at = coalesce(created_at, now())
where created_at is null;

alter table public.profiles
  alter column display_name set not null,
  alter column created_at set default now(),
  alter column created_at set not null;

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- =============================================================================
-- Standards
-- =============================================================================
create table if not exists public.standards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  sort_order int not null,
  statement text not null,
  created_at timestamptz not null default now()
);

alter table public.standards
  add column if not exists user_id uuid,
  add column if not exists sort_order int,
  add column if not exists statement text,
  add column if not exists created_at timestamptz default now();

update public.standards set created_at = coalesce(created_at, now()) where created_at is null;
alter table public.standards alter column created_at set default now();
alter table public.standards alter column created_at set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'standards_user_id_fkey'
      and conrelid = 'public.standards'::regclass
  ) then
    alter table public.standards
      add constraint standards_user_id_fkey
      foreign key (user_id) references public.profiles (id) on delete cascade;
  end if;
exception
  when duplicate_object then null;
end $$;

-- Resolve duplicate (user_id, sort_order) before unique index (preserve all rows)
with ranked as (
  select
    id,
    row_number() over (
      partition by user_id
      order by created_at nulls last, id
    ) as new_order
  from public.standards
)
update public.standards s
set sort_order = ranked.new_order
from ranked
where s.id = ranked.id
  and s.sort_order is distinct from ranked.new_order;

create unique index if not exists standards_user_id_sort_order_key
  on public.standards (user_id, sort_order);

alter table public.standards enable row level security;

drop policy if exists "Users can manage own standards" on public.standards;
create policy "Users can manage own standards"
  on public.standards for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =============================================================================
-- Missions — add columns the app requires (preserve existing rows)
-- =============================================================================
create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  purpose text not null,
  why_this_matters text not null default '',
  success_criteria text not null default '',
  current_progress text not null default '',
  next_milestone text not null default '',
  lifecycle text not null default 'upcoming',
  mission_status text not null default 'on_track',
  status_source text not null default 'manual',
  status_updated_at timestamptz,
  lessons_learned text not null default '',
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.missions
  add column if not exists why_this_matters text,
  add column if not exists current_progress text,
  add column if not exists lifecycle text,
  add column if not exists status_source text,
  add column if not exists status_updated_at timestamptz,
  add column if not exists lessons_learned text,
  add column if not exists success_criteria text,
  add column if not exists next_milestone text,
  add column if not exists mission_status text,
  add column if not exists created_at timestamptz default now(),
  add column if not exists completed_at timestamptz;

update public.missions
set
  why_this_matters = coalesce(why_this_matters, ''),
  current_progress = coalesce(current_progress, ''),
  success_criteria = coalesce(success_criteria, ''),
  next_milestone = coalesce(next_milestone, ''),
  lessons_learned = coalesce(lessons_learned, ''),
  status_source = coalesce(status_source, 'manual'),
  mission_status = coalesce(
    mission_status,
    case when completed_at is not null then 'complete' else 'on_track' end
  ),
  lifecycle = coalesce(
    lifecycle,
    case when completed_at is not null then 'completed' else 'upcoming' end
  ),
  created_at = coalesce(created_at, now());

-- Normalize any legacy mission_status values before check constraints
update public.missions
set mission_status = case
  when mission_status in ('on_track', 'at_risk', 'off_course', 'complete') then mission_status
  when mission_status in ('on-track', 'on track') then 'on_track'
  when mission_status in ('at-risk', 'at risk') then 'at_risk'
  when mission_status in ('off-course', 'off course') then 'off_course'
  when completed_at is not null then 'complete'
  else 'on_track'
end;

update public.missions
set lifecycle = case
  when lifecycle in ('active', 'upcoming', 'completed') then lifecycle
  when completed_at is not null then 'completed'
  else 'upcoming'
end;

update public.missions
set status_source = case
  when status_source in ('manual', 'calculated') then status_source
  else 'manual'
end;

alter table public.missions
  alter column why_this_matters set default '',
  alter column current_progress set default '',
  alter column success_criteria set default '',
  alter column next_milestone set default '',
  alter column lessons_learned set default '',
  alter column status_source set default 'manual',
  alter column lifecycle set default 'upcoming',
  alter column mission_status set default 'on_track',
  alter column created_at set default now();

alter table public.missions
  alter column why_this_matters set not null,
  alter column current_progress set not null,
  alter column success_criteria set not null,
  alter column next_milestone set not null,
  alter column lessons_learned set not null,
  alter column status_source set not null,
  alter column lifecycle set not null,
  alter column mission_status set not null,
  alter column created_at set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'missions_user_id_fkey'
      and conrelid = 'public.missions'::regclass
  ) then
    alter table public.missions
      add constraint missions_user_id_fkey
      foreign key (user_id) references public.profiles (id) on delete cascade;
  end if;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'missions_lifecycle_check'
      and conrelid = 'public.missions'::regclass
  ) then
    alter table public.missions
      add constraint missions_lifecycle_check
      check (lifecycle in ('active', 'upcoming', 'completed'));
  end if;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'missions_mission_status_check'
      and conrelid = 'public.missions'::regclass
  ) then
    alter table public.missions
      add constraint missions_mission_status_check
      check (mission_status in ('on_track', 'at_risk', 'off_course', 'complete'));
  end if;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'missions_status_source_check'
      and conrelid = 'public.missions'::regclass
  ) then
    alter table public.missions
      add constraint missions_status_source_check
      check (status_source in ('manual', 'calculated'));
  end if;
exception
  when duplicate_object then null;
end $$;

create unique index if not exists missions_one_active_per_user
  on public.missions (user_id)
  where lifecycle = 'active';

alter table public.missions enable row level security;

drop policy if exists "Users can manage own missions" on public.missions;
create policy "Users can manage own missions"
  on public.missions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =============================================================================
-- Mission intents — add source column required by app upserts
-- =============================================================================
create table if not exists public.mission_intents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  intent_date date not null,
  commitment text not null,
  source text not null default 'custom',
  created_at timestamptz not null default now()
);

alter table public.mission_intents
  add column if not exists source text,
  add column if not exists commitment text,
  add column if not exists intent_date date,
  add column if not exists created_at timestamptz default now();

update public.mission_intents
set
  source = coalesce(source, 'custom'),
  created_at = coalesce(created_at, now());

update public.mission_intents
set source = case
  when source in ('suggested', 'custom') then source
  else 'custom'
end;

alter table public.mission_intents
  alter column source set default 'custom',
  alter column created_at set default now();

alter table public.mission_intents
  alter column source set not null,
  alter column created_at set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'mission_intents_user_id_fkey'
      and conrelid = 'public.mission_intents'::regclass
  ) then
    alter table public.mission_intents
      add constraint mission_intents_user_id_fkey
      foreign key (user_id) references public.profiles (id) on delete cascade;
  end if;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'mission_intents_source_check'
      and conrelid = 'public.mission_intents'::regclass
  ) then
    alter table public.mission_intents
      add constraint mission_intents_source_check
      check (source in ('suggested', 'custom'));
  end if;
exception
  when duplicate_object then null;
end $$;

create unique index if not exists mission_intents_user_id_intent_date_key
  on public.mission_intents (user_id, intent_date);

alter table public.mission_intents enable row level security;

drop policy if exists "Users can manage own mission intents" on public.mission_intents;
create policy "Users can manage own mission intents"
  on public.mission_intents for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =============================================================================
-- Daily debriefs — add debrief payload columns the app maps
-- =============================================================================
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
  completed_at timestamptz not null default now()
);

alter table public.daily_debriefs
  add column if not exists standards jsonb,
  add column if not exists biggest_win text,
  add column if not exists biggest_lesson text,
  add column if not exists tomorrow_one_percent text,
  add column if not exists tomorrow_priority text,
  add column if not exists course_correction text,
  add column if not exists completed_at timestamptz,
  add column if not exists debrief_date date;

update public.daily_debriefs
set
  standards = coalesce(standards, '[]'::jsonb),
  biggest_win = coalesce(biggest_win, ''),
  biggest_lesson = coalesce(biggest_lesson, ''),
  tomorrow_one_percent = coalesce(tomorrow_one_percent, ''),
  tomorrow_priority = coalesce(tomorrow_priority, ''),
  course_correction = coalesce(course_correction, ''),
  completed_at = coalesce(completed_at, now());

alter table public.daily_debriefs
  alter column standards set default '[]'::jsonb,
  alter column biggest_win set default '',
  alter column biggest_lesson set default '',
  alter column tomorrow_one_percent set default '',
  alter column tomorrow_priority set default '',
  alter column course_correction set default '';

alter table public.daily_debriefs
  alter column standards set not null,
  alter column biggest_win set not null,
  alter column biggest_lesson set not null,
  alter column tomorrow_one_percent set not null,
  alter column tomorrow_priority set not null,
  alter column course_correction set not null,
  alter column completed_at set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'daily_debriefs_user_id_fkey'
      and conrelid = 'public.daily_debriefs'::regclass
  ) then
    alter table public.daily_debriefs
      add constraint daily_debriefs_user_id_fkey
      foreign key (user_id) references public.profiles (id) on delete cascade;
  end if;
exception
  when duplicate_object then null;
end $$;

create unique index if not exists daily_debriefs_user_id_debrief_date_key
  on public.daily_debriefs (user_id, debrief_date);

alter table public.daily_debriefs enable row level security;

drop policy if exists "Users can manage own daily debriefs" on public.daily_debriefs;
create policy "Users can manage own daily debriefs"
  on public.daily_debriefs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =============================================================================
-- Daily one percent — missing entirely on live DB
-- =============================================================================
create table if not exists public.daily_one_percent (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  effective_date date not null,
  improvement text not null,
  source text not null,
  set_at timestamptz not null
);

alter table public.daily_one_percent
  add column if not exists user_id uuid,
  add column if not exists effective_date date,
  add column if not exists improvement text,
  add column if not exists source text,
  add column if not exists set_at timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'daily_one_percent_user_id_fkey'
      and conrelid = 'public.daily_one_percent'::regclass
  ) then
    alter table public.daily_one_percent
      add constraint daily_one_percent_user_id_fkey
      foreign key (user_id) references public.profiles (id) on delete cascade;
  end if;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'daily_one_percent_source_check'
      and conrelid = 'public.daily_one_percent'::regclass
  ) then
    alter table public.daily_one_percent
      add constraint daily_one_percent_source_check
      check (source in ('debrief', 'seed', 'manual'));
  end if;
exception
  when duplicate_object then null;
end $$;

create unique index if not exists daily_one_percent_user_id_effective_date_key
  on public.daily_one_percent (user_id, effective_date);

-- Migrate prior debrief "tomorrow 1%" values into daily_one_percent when present
insert into public.daily_one_percent (user_id, effective_date, improvement, source, set_at)
select
  d.user_id,
  d.debrief_date,
  d.tomorrow_one_percent,
  'debrief',
  coalesce(d.completed_at, now())
from public.daily_debriefs d
where coalesce(nullif(trim(d.tomorrow_one_percent), ''), '') <> ''
on conflict (user_id, effective_date) do nothing;

alter table public.daily_one_percent enable row level security;

drop policy if exists "Users can manage own daily one percent" on public.daily_one_percent;
create policy "Users can manage own daily one percent"
  on public.daily_one_percent for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =============================================================================
-- Auto-create profile on signup (idempotent)
-- =============================================================================
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
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================================================
-- Refresh PostgREST schema cache so new tables/columns are visible immediately
-- =============================================================================
notify pgrst, 'reload schema';
