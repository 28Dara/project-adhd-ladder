begin;

-- Apply the migration chain with client data access closed. 07-02 verifies
-- isolation before granting the application role access to these functions.
create schema adhd_ladder_private;
revoke all on schema adhd_ladder_private from public, anon, authenticated, service_role;

create role adhd_ladder_writer nologin noinherit nobypassrls;
grant adhd_ladder_writer to current_user;
grant usage on schema public to adhd_ladder_writer;
grant usage, create on schema adhd_ladder_private to adhd_ladder_writer;

alter table public.profiles add column write_time_zone text;

-- Revoke both table and column grants from the preceding migrations.
revoke insert, update, delete, truncate
  on public.tasks, public.task_completions, public.health_checks
  from public, anon, authenticated;
revoke insert (user_id, ladder, title), update (title, archived_at)
  on public.tasks from public, anon, authenticated;
revoke insert (user_id, task_id, completed_date)
  on public.task_completions from public, anon, authenticated;
revoke insert (user_id, date, nutrition, sleep, movement),
  update (nutrition, sleep, movement)
  on public.health_checks from public, anon, authenticated;

-- Auth is a managed schema. Only the migration owner accesses it directly.
create function adhd_ladder_private.request_user_id()
returns uuid
language sql stable security definer set search_path = ''
as $$
  select auth.uid();
$$;

create function adhd_ladder_private.registration_instant()
returns timestamptz
language sql stable security definer set search_path = ''
as $$
  select u.created_at
  from auth.users as u
  where u.id = auth.uid();
$$;

grant select (id, write_time_zone), insert (id), update (write_time_zone)
  on public.profiles to adhd_ladder_writer;
grant select, insert (user_id, ladder, title), update (title, archived_at)
  on public.tasks to adhd_ladder_writer;
grant select (user_id, task_id, completed_date),
  insert (user_id, task_id, completed_date), delete
  on public.task_completions to adhd_ladder_writer;
grant select, insert (user_id, date, nutrition, sleep, movement),
  update (nutrition, sleep, movement)
  on public.health_checks to adhd_ladder_writer;

-- The writer owns functions, never tables. Column and operation grants still
-- bound what these policies can authorize.
create policy profiles_writer_own on public.profiles
  for all to adhd_ladder_writer
  using (id = (select adhd_ladder_private.request_user_id()))
  with check (id = (select adhd_ladder_private.request_user_id()));

create policy tasks_writer_own on public.tasks
  for all to adhd_ladder_writer
  using (user_id = (select adhd_ladder_private.request_user_id()))
  with check (user_id = (select adhd_ladder_private.request_user_id()));

create policy task_completions_writer_own on public.task_completions
  for all to adhd_ladder_writer
  using (user_id = (select adhd_ladder_private.request_user_id()))
  with check (user_id = (select adhd_ladder_private.request_user_id()));

create policy health_checks_writer_own on public.health_checks
  for all to adhd_ladder_writer
  using (user_id = (select adhd_ladder_private.request_user_id()))
  with check (user_id = (select adhd_ladder_private.request_user_id()));

create function adhd_ladder_private.lock_account()
returns uuid
language plpgsql volatile set search_path = ''
as $$
declare
  account_id uuid := adhd_ladder_private.request_user_id();
begin
  if account_id is null then
    raise exception using errcode = '42501', message = 'authentication_required';
  end if;
  -- The checks after this lock must see the preceding writer's committed rows.
  if pg_catalog.current_setting('transaction_isolation') <> 'read committed' then
    raise exception using errcode = '25000', message = 'read_committed_required';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('adhd-ladder:account:' || account_id::text, 0)
  );
  return account_id;
end;
$$;

create function adhd_ladder_private.normalize_task_title(p_title text)
returns text
language plpgsql immutable set search_path = ''
as $$
declare
  -- ECMAScript trim whitespace. Apply Unicode uppercasing to one code point.
  title text := pg_catalog.btrim(p_title,
    U&'\0009\000A\000B\000C\000D\0020\00A0\1680\2000\2001\2002\2003\2004\2005\2006\2007\2008\2009\200A\2028\2029\202F\205F\3000\FEFF');
begin
  if title is null or title = '' then
    raise exception using errcode = '22023', message = 'empty_task_title';
  end if;
  return pg_catalog.upper(pg_catalog.left(title, 1) collate pg_catalog."und-x-icu")
    || pg_catalog.substr(title, 2);
end;
$$;

create function adhd_ladder_private.active_task(p_account_id uuid, p_task_id uuid)
returns public.tasks
language plpgsql volatile set search_path = ''
as $$
declare
  task public.tasks;
begin
  select t.* into task
  from public.tasks as t
  where t.id = p_task_id and t.user_id = p_account_id and t.archived_at is null;

  if not found then
    raise exception using errcode = 'P0002', message = 'active_task_not_found';
  end if;
  return task;
end;
$$;

create function adhd_ladder_private.parse_local_date(p_local_date text)
returns date
language plpgsql stable set search_path = ''
as $$
begin
  if p_local_date is null or p_local_date !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' then
    raise exception using errcode = '22023', message = 'invalid_local_date';
  end if;
  return p_local_date::date;
exception
  when invalid_datetime_format or datetime_field_overflow then
    raise exception using errcode = '22023', message = 'invalid_local_date';
end;
$$;

create function adhd_ladder_private.authorize_day(
  p_account_id uuid, p_local_date date, p_device_time_zone text
)
returns timestamptz
language plpgsql volatile set search_path = ''
set TimeZone = 'UTC'
as $$
declare
  reference_zone text;
  registration_time timestamptz := adhd_ladder_private.registration_instant();
  write_time timestamptz;
  device_day date;
begin
  if p_local_date is null or not pg_catalog.isfinite(p_local_date) then
    raise exception using errcode = '22023', message = 'invalid_local_date';
  end if;
  -- Named catalog entries include aliases without a slash. Keep free-form
  -- offsets and POSIX specifications outside the accepted set.
  if not exists (
    select 1 from pg_catalog.pg_timezone_names as tz
    where tz.name collate pg_catalog."C" = p_device_time_zone
  ) then
    raise exception using errcode = '22023', message = 'invalid_device_time_zone';
  end if;
  if registration_time is null or not pg_catalog.isfinite(registration_time) then
    raise exception using errcode = 'P0001', message = 'registration_time_unavailable';
  end if;

  -- A profile can be absent. Do not overwrite an existing display name.
  insert into public.profiles (id)
  values (p_account_id)
  on conflict (id) do nothing;

  select p.write_time_zone into reference_zone
  from public.profiles as p where p.id = p_account_id
  for update;

  if not found then
    raise exception using errcode = 'P0001', message = 'profile_unavailable';
  end if;

  reference_zone := coalesce(reference_zone, p_device_time_zone);
  -- Sample after both the account lock and any wait on the profile row.
  write_time := pg_catalog.clock_timestamp();
  if registration_time > write_time then
    raise exception using errcode = 'P0001', message = 'registration_time_unavailable';
  end if;
  -- TimeZone loads named zones without the abbreviation precedence of timezone(text, ...).
  -- The function's SET clause restores the caller's TimeZone on exit.
  perform pg_catalog.set_config('TimeZone', p_device_time_zone, true);
  device_day := write_time::date;
  perform pg_catalog.set_config('TimeZone', reference_zone, true);
  if p_local_date < registration_time::date then
    raise exception using errcode = '22023', message = 'date_before_registration';
  end if;
  if p_local_date <> device_day then
    raise exception using errcode = '22023', message = 'device_local_date_mismatch';
  end if;
  if p_local_date <> write_time::date then
    raise exception using errcode = '22023', message = 'account_local_date_mismatch';
  end if;

  update public.profiles set write_time_zone = reference_zone
  where id = p_account_id and write_time_zone is null;
  return write_time;
end;
$$;

create function adhd_ladder_private.clear_task_completion(
  p_account_id uuid, p_task_id uuid, p_local_date date
)
returns void
language sql volatile set search_path = ''
as $$
  delete from public.task_completions
  where user_id = p_account_id and task_id = p_task_id and completed_date = p_local_date;
$$;

create function adhd_ladder_private.create_task(p_ladder text, p_title text)
returns public.tasks
language plpgsql volatile security definer set search_path = ''
as $$
declare
  account_id uuid := adhd_ladder_private.lock_account();
  title text := adhd_ladder_private.normalize_task_title(p_title);
  result public.tasks;
begin
  if p_ladder is null or p_ladder not in ('activities', 'learning') then
    raise exception using errcode = '22023', message = 'invalid_ladder';
  end if;
  if (
    select count(*) from public.tasks as t
    where t.user_id = account_id and t.ladder = p_ladder and t.archived_at is null
  ) >= 4 then
    raise exception using errcode = 'P0001', message = 'active_task_limit';
  end if;
  insert into public.tasks (user_id, ladder, title)
  values (account_id, p_ladder, title)
  returning * into result;
  return result;
end;
$$;

create function adhd_ladder_private.rename_task(
  p_task_id uuid, p_title text, p_local_date text, p_device_time_zone text
)
returns public.tasks
language plpgsql volatile security definer set search_path = ''
as $$
declare
  account_id uuid := adhd_ladder_private.lock_account();
  action_day date := adhd_ladder_private.parse_local_date(p_local_date);
  task public.tasks := adhd_ladder_private.active_task(account_id, p_task_id);
  normalized_title text := adhd_ladder_private.normalize_task_title(p_title);
begin
  perform adhd_ladder_private.authorize_day(account_id, action_day, p_device_time_zone);
  if task.title collate pg_catalog."C" = normalized_title then
    return task;
  end if;
  update public.tasks as t set title = normalized_title
  where t.id = task.id and t.user_id = account_id
  returning t.* into task;
  perform adhd_ladder_private.clear_task_completion(account_id, p_task_id, action_day);
  return task;
end;
$$;

create function adhd_ladder_private.archive_task(
  p_task_id uuid, p_local_date text, p_device_time_zone text
)
returns public.tasks
language plpgsql volatile security definer set search_path = ''
as $$
declare
  account_id uuid := adhd_ladder_private.lock_account();
  action_day date := adhd_ladder_private.parse_local_date(p_local_date);
  task public.tasks := adhd_ladder_private.active_task(account_id, p_task_id);
  write_time timestamptz;
begin
  if not exists (
    select 1 from public.tasks as t
    where t.user_id = account_id and t.ladder = task.ladder
      and t.archived_at is null and t.id <> task.id
  ) then
    raise exception using errcode = 'P0001', message = 'last_active_task';
  end if;
  write_time := adhd_ladder_private.authorize_day(account_id, action_day, p_device_time_zone);
  update public.tasks as t set archived_at = write_time
  where t.id = task.id and t.user_id = account_id
  returning t.* into task;
  perform adhd_ladder_private.clear_task_completion(account_id, p_task_id, action_day);
  return task;
end;
$$;

create function adhd_ladder_private.set_task_completion(
  p_task_id uuid, p_completed boolean, p_local_date text, p_device_time_zone text
)
returns boolean
language plpgsql volatile security definer set search_path = ''
as $$
declare
  account_id uuid := adhd_ladder_private.lock_account();
  action_day date := adhd_ladder_private.parse_local_date(p_local_date);
begin
  if p_completed is null then
    raise exception using errcode = '22023', message = 'completion_state_required';
  end if;
  perform adhd_ladder_private.active_task(account_id, p_task_id);
  perform adhd_ladder_private.authorize_day(account_id, action_day, p_device_time_zone);
  if p_completed then
    insert into public.task_completions (user_id, task_id, completed_date)
    values (account_id, p_task_id, action_day)
    on conflict (task_id, completed_date) do nothing;
  else
    perform adhd_ladder_private.clear_task_completion(account_id, p_task_id, action_day);
  end if;
  return p_completed;
end;
$$;

create function adhd_ladder_private.set_health_goal(
  p_goal text, p_completed boolean, p_local_date text, p_device_time_zone text
)
returns public.health_checks
language plpgsql volatile security definer set search_path = ''
as $$
declare
  account_id uuid := adhd_ladder_private.lock_account();
  action_day date := adhd_ladder_private.parse_local_date(p_local_date);
  result public.health_checks;
begin
  if p_goal is null or p_goal not in ('nutrition', 'sleep', 'movement') then
    raise exception using errcode = '22023', message = 'invalid_health_goal';
  end if;
  if p_completed is null then
    raise exception using errcode = '22023', message = 'health_goal_state_required';
  end if;
  perform adhd_ladder_private.authorize_day(account_id, action_day, p_device_time_zone);

  if not p_completed and not exists (
    select 1 from public.health_checks as h
    where h.user_id = account_id and h.date = action_day
  ) then
    return null;
  end if;

  -- Each branch only names the requested goal's column on insert and update.
  case p_goal
    when 'nutrition' then
      insert into public.health_checks (user_id, date, nutrition)
      values (account_id, action_day, p_completed)
      on conflict (user_id, date) do update set nutrition = excluded.nutrition
      returning * into result;
    when 'sleep' then
      insert into public.health_checks (user_id, date, sleep)
      values (account_id, action_day, p_completed)
      on conflict (user_id, date) do update set sleep = excluded.sleep
      returning * into result;
    when 'movement' then
      insert into public.health_checks (user_id, date, movement)
      values (account_id, action_day, p_completed)
      on conflict (user_id, date) do update set movement = excluded.movement
      returning * into result;
  end case;
  return result;
end;
$$;

revoke all on all functions in schema adhd_ladder_private
  from public, anon, authenticated, service_role;
grant execute on function
  adhd_ladder_private.request_user_id(),
  adhd_ladder_private.registration_instant(),
  adhd_ladder_private.lock_account(),
  adhd_ladder_private.normalize_task_title(text),
  adhd_ladder_private.active_task(uuid, uuid),
  adhd_ladder_private.parse_local_date(text),
  adhd_ladder_private.authorize_day(uuid, date, text),
  adhd_ladder_private.clear_task_completion(uuid, uuid, date)
to adhd_ladder_writer;

create function public.create_task(p_ladder text, p_title text)
returns public.tasks
language sql volatile security invoker set search_path = ''
as $$ select * from adhd_ladder_private.create_task(p_ladder, p_title); $$;

create function public.rename_task(
  p_task_id uuid, p_title text, p_local_date text, p_device_time_zone text
)
returns public.tasks
language sql volatile security invoker set search_path = ''
as $$
  select * from adhd_ladder_private.rename_task(p_task_id, p_title, p_local_date, p_device_time_zone);
$$;

create function public.archive_task(
  p_task_id uuid, p_local_date text, p_device_time_zone text
)
returns public.tasks
language sql volatile security invoker set search_path = ''
as $$
  select * from adhd_ladder_private.archive_task(p_task_id, p_local_date, p_device_time_zone);
$$;

create function public.set_task_completion(
  p_task_id uuid, p_completed boolean, p_local_date text, p_device_time_zone text
)
returns boolean
language sql volatile security invoker set search_path = ''
as $$
  select adhd_ladder_private.set_task_completion(p_task_id, p_completed, p_local_date, p_device_time_zone);
$$;

create function public.set_health_goal(
  p_goal text, p_completed boolean, p_local_date text, p_device_time_zone text
)
returns public.health_checks
language plpgsql volatile security invoker set search_path = ''
as $$
begin
  -- Return the composite value directly, including a SQL NULL.
  return adhd_ladder_private.set_health_goal(p_goal, p_completed, p_local_date, p_device_time_zone);
end;
$$;

revoke all on function
  public.create_task(text, text),
  public.rename_task(uuid, text, text, text),
  public.archive_task(uuid, text, text),
  public.set_task_completion(uuid, boolean, text, text),
  public.set_health_goal(text, boolean, text, text)
from public, anon, authenticated, service_role;

alter function adhd_ladder_private.create_task(text, text) owner to adhd_ladder_writer;
alter function adhd_ladder_private.rename_task(uuid, text, text, text) owner to adhd_ladder_writer;
alter function adhd_ladder_private.archive_task(uuid, text, text) owner to adhd_ladder_writer;
alter function adhd_ladder_private.set_task_completion(uuid, boolean, text, text) owner to adhd_ladder_writer;
alter function adhd_ladder_private.set_health_goal(text, boolean, text, text) owner to adhd_ladder_writer;
revoke create on schema adhd_ladder_private from adhd_ladder_writer;

commit;
