-- True North — Bearings + permanent Evidence proof records
-- Bearings: weekly identity corrections (exactly three).
-- Evidence: auto-generated from Daily Debriefs; append-only for users.

-- =============================================================================
-- Evidence (service record — proof of identity lived)
-- =============================================================================
create table if not exists public.evidence (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  evidence_date date not null,
  debrief_date date not null,
  standard_statement text not null,
  evidence_text text not null,
  mission_reference text,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists evidence_user_date_idx
  on public.evidence (user_id, evidence_date desc);

create unique index if not exists evidence_user_debrief_standard_uidx
  on public.evidence (user_id, debrief_date, standard_statement);

alter table public.evidence enable row level security;

drop policy if exists "Users can view own evidence" on public.evidence;
create policy "Users can view own evidence"
  on public.evidence for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own evidence" on public.evidence;
create policy "Users can insert own evidence"
  on public.evidence for insert
  with check (auth.uid() = user_id);

-- Upsert / same-day debrief re-sync only (no user-facing edit UI)
drop policy if exists "Users can update own evidence" on public.evidence;
create policy "Users can update own evidence"
  on public.evidence for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own evidence for resync" on public.evidence;
create policy "Users can delete own evidence for resync"
  on public.evidence for delete
  using (auth.uid() = user_id);

-- =============================================================================
-- Weekly Bearings (exactly three per week)
-- =============================================================================
create table if not exists public.weekly_bearings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  week_start date not null,
  bearing_ids text[] not null,
  source text not null default 'recommended'
    check (source in ('recommended', 'manual')),
  selected_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, week_start),
  constraint weekly_bearings_exactly_three
    check (cardinality(bearing_ids) = 3)
);

create index if not exists weekly_bearings_user_week_idx
  on public.weekly_bearings (user_id, week_start desc);

alter table public.weekly_bearings enable row level security;

drop policy if exists "Users can manage own weekly bearings" on public.weekly_bearings;
create policy "Users can manage own weekly bearings"
  on public.weekly_bearings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
