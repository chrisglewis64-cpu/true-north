-- Sprint 7: Missions table (idempotent — safe if 001_initial_schema.sql was already applied)

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

drop policy if exists "Users can manage own missions" on public.missions;

create policy "Users can manage own missions"
  on public.missions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
