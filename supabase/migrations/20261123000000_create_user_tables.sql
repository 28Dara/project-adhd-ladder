begin;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete restrict,
  display_name text,
  created_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete restrict,
  ladder text not null,
  title text not null,
  created_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint tasks_ladder_check check (ladder in ('activities', 'learning')),
  constraint tasks_title_not_blank check (btrim(title) <> ''),
  constraint tasks_id_user_id_key unique (id, user_id)
);

create table public.task_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  task_id uuid not null,
  completed_date date not null,
  constraint task_completions_task_date_key unique (task_id, completed_date),
  constraint task_completions_task_owner_fkey
    foreign key (task_id, user_id)
    references public.tasks (id, user_id)
    on delete restrict
);

create table public.health_checks (
  user_id uuid not null references auth.users (id) on delete restrict,
  date date not null,
  nutrition boolean not null default false,
  sleep boolean not null default false,
  movement boolean not null default false,
  primary key (user_id, date)
);

alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.task_completions enable row level security;
alter table public.health_checks enable row level security;

revoke all privileges on table
  public.profiles,
  public.tasks,
  public.task_completions,
  public.health_checks
from public, anon, authenticated;

commit;
