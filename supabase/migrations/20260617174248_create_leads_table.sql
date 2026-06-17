create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  nationality text,
  current_location text,
  purpose text,
  status_reason text,
  documents text[],
  concern text,
  checklist_route text,
  source text not null default 'web',
  status text not null default 'new'
);

alter table public.leads enable row level security;

create policy "anon insert"
on public.leads
for insert
to anon
with check (true);
