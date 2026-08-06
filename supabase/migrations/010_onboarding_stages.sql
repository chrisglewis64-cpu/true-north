-- True North — explicit onboarding stage persistence
-- Stages: welcome → standards → mission → morning_commitment → complete
-- Safe to re-run.

alter table public.profiles
  add column if not exists welcome_completed_at timestamptz,
  add column if not exists standards_completed_at timestamptz,
  add column if not exists mission_completed_at timestamptz;

-- Users who already finished onboarding should not re-enter welcome/setup.
update public.profiles
set
  welcome_completed_at = coalesce(welcome_completed_at, onboarding_completed_at, created_at),
  standards_completed_at = coalesce(standards_completed_at, onboarding_completed_at, created_at),
  mission_completed_at = coalesce(mission_completed_at, onboarding_completed_at, created_at)
where onboarding_completed_at is not null;
