-- Log each reminder send / skip attempt for idempotent delivery

create table if not exists public.notification_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  reminder_id text not null,
  period_key text not null,
  status text not null check (status in ('sent', 'skipped_completed', 'failed')),
  endpoint text,
  error text,
  created_at timestamptz not null default now(),
  unique (user_id, reminder_id, period_key)
);

create index if not exists notification_logs_user_id_idx
  on public.notification_logs (user_id);

create index if not exists notification_logs_created_at_idx
  on public.notification_logs (created_at desc);

alter table public.notification_logs enable row level security;

drop policy if exists "Users can view own notification logs" on public.notification_logs;
create policy "Users can view own notification logs"
  on public.notification_logs for select
  using (auth.uid() = user_id);

-- Optional profile timezone for local reminder scheduling (defaults to UTC)
alter table public.profiles
  add column if not exists timezone text;

update public.profiles
set timezone = coalesce(nullif(timezone, ''), 'UTC')
where timezone is null or timezone = '';

alter table public.profiles
  alter column timezone set default 'UTC';

notify pgrst, 'reload schema';
