-- run once in supabase dashboard -> sql editor
create table if not exists public.quiz_attempts (
  user_id      uuid primary key references auth.users(id) on delete cascade, -- primary key = one attempt per user
  questions    jsonb not null,
  answers      jsonb,
  score        int,
  total        int not null default 64,
  started_at   timestamptz not null default now(),
  submitted_at timestamptz
);

alter table public.quiz_attempts enable row level security;

-- users can only read their own attempt. all writes go through the next.js api (service role)
drop policy if exists "own attempt readable" on public.quiz_attempts;
create policy "own attempt readable" on public.quiz_attempts
  for select using (auth.uid() = user_id);

-- handy view for you (admin) to see all results with email/phone:
-- select u.email, u.phone, a.score, a.total, a.submitted_at
-- from public.quiz_attempts a join auth.users u on u.id = a.user_id
-- where a.submitted_at is not null order by a.score desc;
