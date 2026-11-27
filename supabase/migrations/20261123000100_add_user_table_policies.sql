begin;

create policy profiles_select_own
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy profiles_insert_own
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);

create policy profiles_update_own
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy tasks_select_own
  on public.tasks for select to authenticated
  using ((select auth.uid()) = user_id);

create policy tasks_insert_own
  on public.tasks for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy tasks_update_own
  on public.tasks for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy task_completions_select_own
  on public.task_completions for select to authenticated
  using ((select auth.uid()) = user_id);

create policy task_completions_insert_own
  on public.task_completions for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- The app filters by the browser's local date when unchecking a task.
create policy task_completions_delete_own
  on public.task_completions for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy health_checks_select_own
  on public.health_checks for select to authenticated
  using ((select auth.uid()) = user_id);

create policy health_checks_insert_own
  on public.health_checks for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy health_checks_update_own
  on public.health_checks for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select on table
  public.profiles,
  public.tasks,
  public.task_completions,
  public.health_checks
to authenticated;

grant insert (id, display_name), update (display_name)
  on table public.profiles to authenticated;

-- Archiving updates the task and preserves its completion history.
grant insert (user_id, ladder, title), update (title, archived_at)
  on table public.tasks to authenticated;

grant insert (user_id, task_id, completed_date)
  on table public.task_completions to authenticated;

grant delete on table public.task_completions to authenticated;

grant insert (user_id, date, nutrition, sleep, movement),
  update (nutrition, sleep, movement)
  on table public.health_checks to authenticated;

commit;
