-- Mission Golf: multi-user schema with Row Level Security

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text not null default '',
  timezone text not null default 'UTC',
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, timezone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'timezone', 'UTC')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- standards
-- ---------------------------------------------------------------------------
create table public.standards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  statement text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index standards_user_id_idx on public.standards (user_id, sort_order);

alter table public.standards enable row level security;

create policy "standards_select_own"
  on public.standards for select using (auth.uid() = user_id);
create policy "standards_insert_own"
  on public.standards for insert with check (auth.uid() = user_id);
create policy "standards_update_own"
  on public.standards for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "standards_delete_own"
  on public.standards for delete using (auth.uid() = user_id);

create trigger standards_set_updated_at
  before update on public.standards
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- missions
-- ---------------------------------------------------------------------------
create table public.missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  purpose text not null default '',
  success_criteria text not null default '',
  mission_status text not null default '',
  next_milestone text not null default '',
  lifecycle_status text not null default 'upcoming'
    check (lifecycle_status in ('active', 'upcoming', 'completed')),
  sort_order integer not null default 0,
  mission_review text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index missions_user_id_idx on public.missions (user_id, lifecycle_status);

alter table public.missions enable row level security;

create policy "missions_select_own"
  on public.missions for select using (auth.uid() = user_id);
create policy "missions_insert_own"
  on public.missions for insert with check (auth.uid() = user_id);
create policy "missions_update_own"
  on public.missions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "missions_delete_own"
  on public.missions for delete using (auth.uid() = user_id);

create trigger missions_set_updated_at
  before update on public.missions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- mission_intents
-- ---------------------------------------------------------------------------
create table public.mission_intents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  intent_date date not null,
  commitment text not null,
  created_at timestamptz not null default now()
);

create unique index mission_intents_user_date_idx
  on public.mission_intents (user_id, intent_date);

alter table public.mission_intents enable row level security;

create policy "mission_intents_select_own"
  on public.mission_intents for select using (auth.uid() = user_id);
create policy "mission_intents_insert_own"
  on public.mission_intents for insert with check (auth.uid() = user_id);
create policy "mission_intents_update_own"
  on public.mission_intents for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "mission_intents_delete_own"
  on public.mission_intents for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- daily_debriefs
-- ---------------------------------------------------------------------------
create table public.daily_debriefs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  debrief_date date not null,
  submission jsonb not null,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index daily_debriefs_user_date_idx
  on public.daily_debriefs (user_id, debrief_date);

alter table public.daily_debriefs enable row level security;

create policy "daily_debriefs_select_own"
  on public.daily_debriefs for select using (auth.uid() = user_id);
create policy "daily_debriefs_insert_own"
  on public.daily_debriefs for insert with check (auth.uid() = user_id);
create policy "daily_debriefs_update_own"
  on public.daily_debriefs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "daily_debriefs_delete_own"
  on public.daily_debriefs for delete using (auth.uid() = user_id);

create trigger daily_debriefs_set_updated_at
  before update on public.daily_debriefs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- evidence
-- ---------------------------------------------------------------------------
create table public.evidence (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  debrief_id uuid references public.daily_debriefs (id) on delete set null,
  evidence_date date not null,
  kind text not null check (kind in ('standard_proof', 'win')),
  content text not null,
  created_at timestamptz not null default now()
);

create index evidence_user_id_idx on public.evidence (user_id, evidence_date desc);

alter table public.evidence enable row level security;

create policy "evidence_select_own"
  on public.evidence for select using (auth.uid() = user_id);
create policy "evidence_insert_own"
  on public.evidence for insert with check (auth.uid() = user_id);
create policy "evidence_update_own"
  on public.evidence for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "evidence_delete_own"
  on public.evidence for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- reviews
-- ---------------------------------------------------------------------------
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  review_type text not null check (review_type in ('daily', 'weekly', 'monthly', 'annual')),
  period_key text not null,
  completed_at timestamptz not null default now(),
  data jsonb
);

create unique index reviews_user_period_idx
  on public.reviews (user_id, review_type, period_key);

alter table public.reviews enable row level security;

create policy "reviews_select_own"
  on public.reviews for select using (auth.uid() = user_id);
create policy "reviews_insert_own"
  on public.reviews for insert with check (auth.uid() = user_id);
create policy "reviews_update_own"
  on public.reviews for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "reviews_delete_own"
  on public.reviews for delete using (auth.uid() = user_id);
