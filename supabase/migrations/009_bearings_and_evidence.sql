-- True North — Bearings + permanent Evidence proof records
-- Safe to re-run. Aligns the legacy Mission Golf `evidence` table
-- (debrief_id / kind / content) with the proof timeline schema.
-- Bearings: weekly identity corrections (exactly three).

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

-- Align legacy Mission Golf columns → proof timeline columns
alter table public.evidence
  add column if not exists evidence_date date,
  add column if not exists debrief_date date,
  add column if not exists standard_statement text,
  add column if not exists evidence_text text,
  add column if not exists mission_reference text,
  add column if not exists recorded_at timestamptz,
  add column if not exists created_at timestamptz;

-- Backfill from legacy `content` when present
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'evidence'
      and column_name = 'content'
  ) then
    execute $sql$
      update public.evidence
      set evidence_text = coalesce(nullif(evidence_text, ''), content)
      where evidence_text is null or evidence_text = ''
    $sql$;
  end if;
end $$;

update public.evidence
set
  recorded_at = coalesce(recorded_at, created_at, now()),
  created_at = coalesce(created_at, recorded_at, now()),
  debrief_date = coalesce(debrief_date, evidence_date),
  evidence_date = coalesce(
    evidence_date,
    debrief_date,
    (coalesce(recorded_at, created_at, now()) at time zone 'UTC')::date,
    current_date
  ),
  standard_statement = coalesce(nullif(standard_statement, ''), 'Legacy evidence'),
  evidence_text = coalesce(nullif(evidence_text, ''), '—');

update public.evidence
set
  evidence_date = coalesce(evidence_date, current_date),
  debrief_date = coalesce(debrief_date, evidence_date, current_date),
  standard_statement = coalesce(nullif(standard_statement, ''), 'Legacy evidence'),
  evidence_text = coalesce(nullif(evidence_text, ''), '—'),
  recorded_at = coalesce(recorded_at, now()),
  created_at = coalesce(created_at, now());

alter table public.evidence
  alter column recorded_at set default now(),
  alter column created_at set default now();

alter table public.evidence
  alter column evidence_date set not null,
  alter column debrief_date set not null,
  alter column standard_statement set not null,
  alter column evidence_text set not null,
  alter column recorded_at set not null,
  alter column created_at set not null;

-- Uniquify legacy collisions before creating the unique index
update public.evidence e
set standard_statement =
  e.standard_statement || ' (' || left(e.id::text, 8) || ')'
where e.id in (
  select id
  from (
    select
      id,
      row_number() over (
        partition by user_id, debrief_date, standard_statement
        order by created_at, id
      ) as rn
    from public.evidence
  ) ranked
  where ranked.rn > 1
);

drop index if exists public.evidence_user_id_idx;

create index if not exists evidence_user_date_idx
  on public.evidence (user_id, evidence_date desc);

create unique index if not exists evidence_user_debrief_standard_uidx
  on public.evidence (user_id, debrief_date, standard_statement);

alter table public.evidence enable row level security;

drop policy if exists "Users can view own evidence" on public.evidence;
drop policy if exists "evidence_select_own" on public.evidence;
create policy "Users can view own evidence"
  on public.evidence for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own evidence" on public.evidence;
drop policy if exists "evidence_insert_own" on public.evidence;
create policy "Users can insert own evidence"
  on public.evidence for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own evidence" on public.evidence;
drop policy if exists "evidence_update_own" on public.evidence;
create policy "Users can update own evidence"
  on public.evidence for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own evidence for resync" on public.evidence;
drop policy if exists "evidence_delete_own" on public.evidence;
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
