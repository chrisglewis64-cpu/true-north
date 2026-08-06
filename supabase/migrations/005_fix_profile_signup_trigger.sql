-- Signup fails when profiles.email is NOT NULL and handle_new_user omits it.
-- Align the auth trigger with the live profiles shape.

alter table public.profiles
  add column if not exists email text;

-- Backfill any existing rows that are missing email
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id
  and (p.email is null or p.email = '');

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'display_name',
      split_part(new.email, '@', 1),
      'Operator'
    )
  )
  on conflict (id) do update
    set
      email = coalesce(public.profiles.email, excluded.email),
      display_name = coalesce(
        nullif(public.profiles.display_name, ''),
        excluded.display_name
      );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

notify pgrst, 'reload schema';
