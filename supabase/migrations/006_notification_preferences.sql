-- User notification preference settings (delivery not implemented yet)

alter table public.profiles
  add column if not exists notification_preferences jsonb not null default '{}'::jsonb;

notify pgrst, 'reload schema';
