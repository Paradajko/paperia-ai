# Riadence Email Sequence Design

**Date:** 2026-06-19

## Goal

Add an opt-in, five-step educational email sequence after wizard completion. The welcome email remains a required service email. Steps 2–5 are sent only when the applicant explicitly opts in to the 14-day guide.

## Consent and wizard UI

The final email step in `RiaIntakeModal.tsx` keeps the existing optional name and required email fields and adds an optional checkbox below the email input.

Exact label:

> Send me the 14-day Riadence email guide with practical residence tips and case examples. I can unsubscribe anytime.

The checkbox:

- defaults to unchecked;
- has no required marker;
- uses smaller supporting text and the existing Riadence visual language;
- links to `/privacy`;
- is represented as `emailSequenceConsent: boolean` in intake state;
- is sent to `/api/complete-intake`.

The Privacy Policy receives a `Marketing communications` section with this exact text:

> We may send you a 14-day email guide with practical residence tips and case examples. This is opt-in: you must explicitly agree before we send these emails. You can unsubscribe anytime using the link in each email footer.

## Database changes

### Email sequence table

Create `supabase/migrations/20260619000001_email_sequence.sql`.

The table contains:

- `id uuid` primary key;
- `lead_id uuid` referencing `public.leads(id)` with cascade deletion;
- `email text`;
- `step int` constrained to 1–10;
- `subject text`;
- `template_key text`;
- `scheduled_for timestamptz`;
- `sent_at timestamptz`;
- `status text` constrained to `pending`, `processing`, `sent`, `failed`, or `unsubscribed`;
- `error_message text`;
- `created_at timestamptz`.

It has a partial pending index on `(status, scheduled_for)`, RLS enabled, and service-role-only access. The browser receives no policy for reading or writing this table.

The migration also adds database functions:

1. `complete_intake(...)`
   - inserts the lead;
   - creates step 1 for every valid request;
   - creates steps 2–5 only when consent is true;
   - returns the lead and step-1 sequence identifiers;
   - runs atomically inside PostgreSQL.

2. `claim_email_sequence(sequence_id uuid)`
   - updates one row from `pending` to `processing`;
   - returns the claimed row;
   - returns no row when another process already claimed it.

3. `unsubscribe_email_sequence(target_email text)`
   - changes future `pending` rows for the normalized email to `unsubscribed`;
   - changes `leads.email_sequence_consent` to false;
   - runs atomically.

The functions are executable only by the server-side elevated database role.

### Lead consent and name

Create `supabase/migrations/20260619000002_add_email_consent.sql`.

It adds:

```sql
alter table public.leads
  add column if not exists name text,
  add column if not exists email_sequence_consent boolean not null default false;
```

`name` remains nullable. Missing or blank names render as `Hi there,`.

Because migration ordering is fixed, migration `00001` must not reference columns introduced only in `00002` before they exist. The database functions that use `name` and `email_sequence_consent` will therefore be created or finalized in `00002`, after both columns exist. Migration `00001` creates the sequence table and claim function.

## Completion API

Create `api/complete-intake.ts` and replace the browser-side Supabase insert plus `/api/send-welcome` scheduling.

The endpoint:

1. accepts `POST` only;
2. validates required email and normalized wizard fields;
3. calls the `complete_intake` Supabase RPC using `SUPABASE_URL` and a server-only `SUPABASE_SECRET_KEY` or legacy `SUPABASE_SERVICE_ROLE_KEY`;
4. creates a Resend contact when consent is true for future Broadcast compatibility, but does not rely on Resend Audience for sequence unsubscribe behavior;
5. builds the welcome email from the central template system;
6. sends welcome immediately through Resend;
7. marks step 1 as `sent` with `sent_at`, or `failed` with a bounded error message;
8. returns success after the lead and sequence exist, including a non-sensitive warning if welcome delivery failed.

Database creation is atomic. Resend delivery cannot participate in the PostgreSQL transaction. This endpoint is a single browser request, with explicit persisted failure state for the external send.

The old public browser insert path is removed from `src/lib/leads.ts`. The anon insert policy may remain for migration compatibility, but the application no longer uses it. No service key is exposed to browser code.

## Sequence schedule

The shared sequence definition is:

| Step | Delay | Template key |
|---|---:|---|
| 1 | 0 days | `welcome` |
| 2 | 2 days | `education-day2` |
| 3 | 5 days | `checklist-reminder-day5` |
| 4 | 8 days | `case-study-day8` |
| 5 | 14 days | `agency-handoff-day14` |

All `scheduled_for` values are calculated from the same server/database timestamp. Step 1 is initially created as `processing` because `/api/complete-intake` sends it immediately. Steps 2–5 start as `pending`.

If consent is false or omitted, only step 1 is created.

## Email templates

Create `api/emails/templates.ts`.

It exports:

- template key and context types;
- `EMAIL_TEMPLATES`;
- a builder that returns `subject`, `html`, and `text`;
- shared branded shell, legal footer, Ria avatar, disclaimer, CTA, and escaping helpers.

Every template contains:

- Riadence branding;
- Ria avatar at `https://riadence.com/ria-guide-half.png`;
- English HTML and plain text;
- a signed unsubscribe URL;
- Privacy Policy and Terms of Service links;
- the legal-information disclaimer.

### Step 1: Welcome

Subject:

> Your Slovakia residence checklist is ready inside

The current welcome content moves into the central template module. It confirms saved answers, PDF availability, and Ria chat.

### Step 2: Education

Subject:

> 3 things most applicants forget about Slovakia residence permits

It explains:

- official Slovak translation requirements;
- apostille or legalization checks for foreign public documents;
- health insurance as a separate practical requirement.

It provides practical preparation tips without sales language.

### Step 3: Checklist reminder

Subject:

> Did you download your personalized PDF? Here's what to do next

It links to `https://riadence.com/` as the current wizard/checklist entry point and explains that Ria chat remains available for follow-up questions. No nonexistent persistent completion-page URL is invented.

### Step 4: Case study

Subject:

> Real example: How Maya from India prepared for a Slovakia residence permit

Until verified customer cases exist, the email clearly labels Maya as an illustrative example, not a real testimonial. The country is personalized from the lead when available; the fictional first name remains `Maya` to avoid presenting the recipient as the case subject.

The content focuses on document ordering, translation verification, timing, and official confirmation. It does not claim a guaranteed or verified permit outcome.

### Step 5: Agency handoff

Subject:

> When Riadence isn't enough: How to find a trusted Slovakia lawyer

It explains when licensed support is appropriate, how free Riadence guidance differs from professional fees, and what credentials and scope to verify. Because no verified partner directory currently exists, the CTA is `Ask Riadence about professional support` and links to `mailto:hello@riadence.com`; it does not claim that a verified-agency marketplace exists.

It states:

> We may earn a commission if you use a partner.

## Signed unsubscribe

Create `api/unsubscribe.ts`.

The unsubscribe token format is:

```text
base64url(expirationUnixSeconds).base64url(HMAC-SHA256(normalizedEmail + "." + expirationUnixSeconds))
```

The URL remains:

```text
https://riadence.com/api/unsubscribe?token=...&email=...
```

Rules:

- token validity is at most 90 days from generation;
- malformed, expired, or invalid signatures are rejected;
- comparison uses timing-safe equality;
- email is normalized to trimmed lowercase;
- `GET` performs the unsubscribe and redirects to `/unsubscribed`;
- `POST` supports RFC 8058 one-click unsubscribe and returns 200 with no sensitive data;
- successful unsubscribe calls the database RPC, marking future pending sequence rows `unsubscribed` and lead consent false;
- templates include the visible unsubscribe link;
- Resend sends `List-Unsubscribe` and `List-Unsubscribe-Post: List-Unsubscribe=One-Click` headers.

Create a branded `/unsubscribed` confirmation page and route. The page confirms that future guide emails have stopped and links back to Riadence.

## Cron processing

Create `api/cron/send-sequence.ts`.

`vercel.json` adds:

```json
"crons": [
  { "path": "/api/cron/send-sequence", "schedule": "0 7 * * *" },
  { "path": "/api/cron/send-sequence", "schedule": "0 8 * * *" }
]
```

The endpoint:

1. accepts Vercel's `GET` invocation;
2. requires `Authorization: Bearer ${CRON_SECRET}`;
3. determines the current hour in `Europe/Bratislava` using `Intl.DateTimeFormat`;
4. returns 200 without work unless the Bratislava hour is 09;
5. selects up to 50 `pending` rows with `scheduled_for <= now()`, ordered by schedule;
6. calls `claim_email_sequence(id)` for each candidate;
7. skips rows that return no claimed record;
8. retrieves the related lead context;
9. checks `email_sequence_consent` again for steps 2–5 and marks the row `unsubscribed` if consent is false;
10. builds and sends the matching template;
11. updates the row to `sent` with `sent_at`;
12. updates failures to `failed` with a bounded error message;
13. returns aggregate counts without exposing recipient addresses.

The atomic claim prevents duplicate sends from overlapping invocations. Step 1 is sent only by `/api/complete-intake`; the cron normally processes steps 2–5.

Vercel cron expressions use UTC. The two schedules plus the Bratislava-hour guard preserve 09:00 local delivery through CET and CEST.

## Environment variables

Required server-side variables:

- `RESEND_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY` preferred, or `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`, random and at least 16 characters
- `UNSUBSCRIBE_SECRET`, random and independent from `CRON_SECRET`

No secret is prefixed with `VITE_` or exposed to frontend code.

## Testing

Tests are written before production changes.

### Migration tests

Static SQL assertions verify:

- both required migration filenames;
- sequence columns, status constraint including `processing`, index, RLS, and service-role policy;
- nullable lead name and default-false consent;
- atomic claim SQL;
- completion RPC creates one or five records based on consent;
- unsubscribe RPC updates pending rows and lead consent.

### Template tests

For all five keys, tests verify:

- non-empty subject, HTML, and text;
- Ria avatar;
- Privacy and Terms links;
- visible signed unsubscribe URL;
- RFC 8058 send headers;
- expected educational content;
- safe personalization and HTML escaping.

### Completion tests

Tests verify:

- invalid input is rejected;
- omitted or false consent produces one sequence record through the RPC contract;
- true consent produces five;
- welcome is sent in both cases;
- step 1 becomes `sent` or `failed`;
- browser lead saving posts to `/api/complete-intake` and no longer writes to Supabase directly;
- consent defaults false in intake state and payload.

### Cron tests

Tests verify:

- invalid authorization returns 401;
- non-09:00 Bratislava calls return 200 without queries or sends;
- due pending rows are selected;
- only successfully claimed rows are sent;
- success and failure statuses are updated;
- revoked consent blocks steps 2–5;
- processing is bounded to 50 rows.

### Unsubscribe tests

Tests verify:

- generated tokens validate;
- expiration and tampering fail;
- token lifetime never exceeds 90 days;
- GET redirects after database updates;
- POST supports one-click unsubscribe;
- future pending rows and lead consent are covered by the RPC contract.

### Privacy and UI tests

Tests verify the checkbox copy, unchecked default, Privacy link, and `Marketing communications` policy section.

## Deployment and verification

1. Run the new tests and observe expected RED failures.
2. Implement migrations and application code.
3. Run all tests and production build.
4. Run `supabase db push` if the linked project and credentials are available.
5. If the CLI is not linked or authentication is unavailable, provide exact dashboard instructions and do not claim the production database is migrated.
6. Configure the four server-side environment variables in Vercel.
7. Commit with:

```text
feat: add email sequence (5-step follow-up after wizard)
```

8. Push `main` and wait for Vercel deployment.
9. Verify unauthorized cron access, production route availability, and the unsubscribe confirmation page.
10. A real wizard/email/database test is performed only if safe test credentials and an authorized recipient address are available. No unsolicited real email is sent.

## Out of scope

- Claiming fictional examples are verified customer testimonials.
- Creating a partner marketplace before verified partners exist.
- Retrying permanently failed emails automatically.
- Sending sequence emails without explicit consent.
- Exposing service-role or unsubscribe secrets to the browser.
