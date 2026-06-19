create table if not exists public.email_sequence (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  email text not null,
  step int not null check (step between 1 and 10),
  subject text not null,
  template_key text not null,
  scheduled_for timestamptz not null,
  sent_at timestamptz,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'sent', 'failed', 'unsubscribed')),
  error_message text,
  created_at timestamptz default now()
);

create index idx_email_sequence_pending
  on public.email_sequence(status, scheduled_for)
  where status = 'pending';

alter table public.email_sequence enable row level security;

create policy "service_role_full_access"
  on public.email_sequence
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create or replace function public.claim_email_sequence(sequence_id uuid)
returns setof public.email_sequence
language sql
security definer
set search_path = public
as $$
  update public.email_sequence
  set status = 'processing',
      error_message = null
  where id = sequence_id
    and status = 'pending'
  returning *;
$$;

revoke all on function public.claim_email_sequence(uuid) from public, anon, authenticated;
grant execute on function public.claim_email_sequence(uuid) to service_role;
