-- Onboarding completion + mission category for first-time setup

alter table public.profiles
  add column if not exists onboarding_completed_at timestamptz;

-- Existing users who already have standards are treated as onboarded
update public.profiles p
set onboarding_completed_at = coalesce(p.onboarding_completed_at, p.created_at)
where p.onboarding_completed_at is null
  and exists (
    select 1
    from public.standards s
    where s.user_id = p.id
  );

alter table public.missions
  add column if not exists category text;

update public.missions
set category = coalesce(category, '')
where category is null;

alter table public.missions
  alter column category set default '';

alter table public.missions
  alter column category set not null;

notify pgrst, 'reload schema';
