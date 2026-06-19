alter table public.leads
  add column if not exists name text,
  add column if not exists email_sequence_consent boolean not null default false;

create or replace function public.complete_intake(
  input_email text,
  input_name text,
  input_nationality text,
  input_current_location text,
  input_purpose text,
  input_status_reason text,
  input_documents text[],
  input_concern text,
  input_email_sequence_consent boolean default false
)
returns table (
  lead_id uuid,
  sequence_id uuid,
  sequence_count integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lead_id uuid;
  v_sequence_id uuid;
  v_now timestamptz := now();
  v_sequence_count integer;
begin
  insert into public.leads (
    email,
    name,
    nationality,
    current_location,
    purpose,
    status_reason,
    documents,
    concern,
    checklist_route,
    source,
    status,
    email_sequence_consent
  )
  values (
    lower(trim(input_email)),
    nullif(trim(input_name), ''),
    nullif(trim(input_nationality), ''),
    nullif(trim(input_current_location), ''),
    nullif(trim(input_purpose), ''),
    nullif(trim(input_status_reason), ''),
    coalesce(input_documents, array[]::text[]),
    nullif(trim(input_concern), ''),
    null,
    'web',
    'new',
    coalesce(input_email_sequence_consent, false)
  )
  returning id into v_lead_id;

  insert into public.email_sequence (
    lead_id,
    email,
    step,
    subject,
    template_key,
    scheduled_for,
    status
  )
  values (
    v_lead_id,
    lower(trim(input_email)),
    1,
    'Your Slovakia residence checklist is ready inside',
    'welcome',
    v_now + make_interval(days => 0),
    'processing'
  )
  returning id into v_sequence_id;

  v_sequence_count := case when input_email_sequence_consent then 5 else 1 end;

  if coalesce(input_email_sequence_consent, false) then
    insert into public.email_sequence (
      lead_id,
      email,
      step,
      subject,
      template_key,
      scheduled_for,
      status
    )
    values
      (
        v_lead_id,
        lower(trim(input_email)),
        2,
        '3 things most applicants forget about Slovakia residence permits',
        'education-day2',
        v_now + make_interval(days => 2),
        'pending'
      ),
      (
        v_lead_id,
        lower(trim(input_email)),
        3,
        'Did you download your personalized PDF? Here''s what to do next',
        'checklist-reminder-day5',
        v_now + make_interval(days => 5),
        'pending'
      ),
      (
        v_lead_id,
        lower(trim(input_email)),
        4,
        'Real example: How Maya prepared for a Slovakia residence permit',
        'case-study-day8',
        v_now + make_interval(days => 8),
        'pending'
      ),
      (
        v_lead_id,
        lower(trim(input_email)),
        5,
        'When Riadence isn''t enough: How to find a trusted Slovakia lawyer',
        'agency-handoff-day14',
        v_now + make_interval(days => 14),
        'pending'
      );
  end if;

  return query select v_lead_id, v_sequence_id, v_sequence_count;
end;
$$;

create or replace function public.unsubscribe_email_sequence(target_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(trim(target_email));
begin
  update public.email_sequence
  set status = 'unsubscribed',
      error_message = null
  where lower(trim(email)) = v_email
    and status = 'pending';

  update public.leads
  set email_sequence_consent = false
  where lower(trim(email)) = v_email;
end;
$$;

revoke all on function public.complete_intake(
  text, text, text, text, text, text, text[], text, boolean
) from public, anon, authenticated;
grant execute on function public.complete_intake(
  text, text, text, text, text, text, text[], text, boolean
) to service_role;

revoke all on function public.unsubscribe_email_sequence(text)
  from public, anon, authenticated;
grant execute on function public.unsubscribe_email_sequence(text) to service_role;
