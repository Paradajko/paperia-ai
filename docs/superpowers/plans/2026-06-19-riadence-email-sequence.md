# Riadence Email Sequence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace browser-side lead insertion with a secure completion API and add an opt-in, five-step educational email sequence with atomic cron processing and signed unsubscribe.

**Architecture:** PostgreSQL RPCs own atomic lead/sequence creation, row claiming, and unsubscribe updates. Vercel functions use a server-only Supabase client, central email templates, Resend, and dependency-injected handlers for deterministic tests. The wizard sends one completion request and never receives an elevated database key.

**Tech Stack:** React 19, TypeScript, Vite, Supabase/PostgreSQL, Resend, Vercel Functions/Cron, Node test runner.

---

### Task 1: Write failing database and configuration tests

**Files:**
- Create: `tests/email-sequence-migrations.test.mjs`
- Modify: `tests/legal.test.mjs`

- [ ] **Step 1: Assert the sequence migration**

Test that `20260619000001_email_sequence.sql` contains the table, foreign key, pending index, RLS, five statuses including `processing`, service-role policy, and an atomic `claim_email_sequence` update guarded by `status = 'pending'`.

- [ ] **Step 2: Assert the lead/RPC migration**

Test that `20260619000002_add_email_consent.sql` adds nullable `name`, default-false `email_sequence_consent`, and defines `complete_intake` plus `unsubscribe_email_sequence`. Assert the schedule includes days 0, 2, 5, 8, and 14 and conditionally inserts steps 2–5.

- [ ] **Step 3: Assert Vercel cron configuration**

Extend configuration tests to require both `0 7 * * *` and `0 8 * * *` entries for `/api/cron/send-sequence`.

- [ ] **Step 4: Run `npm test` and observe RED**

Expected: failures identify missing migrations and cron configuration.

### Task 2: Write failing template and unsubscribe-token tests

**Files:**
- Create: `tests/email-templates.test.mjs`
- Create: `tests/unsubscribe.test.mjs`

- [ ] **Step 1: Add a TypeScript import helper**

Compile API modules and their local imports to a temporary directory with `tsc`, then dynamically import the generated module.

- [ ] **Step 2: Test five templates**

For each required key, build an email and assert non-empty subject/HTML/text, Ria avatar, Privacy, Terms, signed unsubscribe URL, disclaimer, `List-Unsubscribe`, and `List-Unsubscribe-Post`.

- [ ] **Step 3: Test content and personalization**

Assert education covers translation, apostille, and health insurance; reminder links to Riadence and mentions Ria; case study is explicitly illustrative and safely escapes country/name data; handoff contains the commission disclosure and does not claim an existing verified marketplace.

- [ ] **Step 4: Test HMAC token behavior**

Assert a generated token validates for the normalized email, rejects tampering and expiry, and cannot be generated with a lifetime above 90 days.

- [ ] **Step 5: Run `npm test` and observe RED**

Expected: missing template and token modules fail.

### Task 3: Write failing completion, cron, and frontend tests

**Files:**
- Create: `tests/email-sequence-api.test.mjs`
- Modify: `tests/leads.test.mjs`
- Modify: `tests/intake.test.mjs`

- [ ] **Step 1: Test `/api/complete-intake` handler contract**

Use injected `completeIntake`, `sendEmail`, `updateSequence`, and `createContact` functions. Assert invalid input rejection, consent false/omitted contract, consent true contract, welcome send in both cases, optional contact creation only for opt-in, and sent/failed step-1 persistence.

- [ ] **Step 2: Test cron handler**

Assert authorization, Bratislava 09:00 guard, 50-row due query, atomic claim skip, revoked-consent behavior, successful sent update, failed update, and aggregate response.

- [ ] **Step 3: Test unsubscribe endpoint**

Assert invalid token rejection, valid GET RPC plus redirect, and valid POST RFC 8058 response.

- [ ] **Step 4: Test browser completion request**

Replace old Supabase-storage tests with assertions that `saveLead` posts all intake fields to `/api/complete-intake`, defaults consent false, and exposes a user-facing failure without a direct database call.

- [ ] **Step 5: Test UI/privacy source requirements**

Assert the exact checkbox label, unchecked initial state, `/privacy` link, and the exact Marketing communications policy text.

- [ ] **Step 6: Run `npm test` and observe RED**

Expected: handler, browser, consent, and privacy tests fail for missing implementation.

### Task 4: Implement the two migrations

**Files:**
- Create: `supabase/migrations/20260619000001_email_sequence.sql`
- Create: `supabase/migrations/20260619000002_add_email_consent.sql`

- [ ] **Step 1: Create sequence table and claim RPC**

Implement the approved schema, index, RLS policy, grants/revokes, and `claim_email_sequence`.

- [ ] **Step 2: Add lead fields and completion RPC**

Add `name` and `email_sequence_consent`, then implement `complete_intake` using a single timestamp and conditional sequence insertion. Step 1 starts `processing`; later steps start `pending`.

- [ ] **Step 3: Add unsubscribe RPC**

Normalize email with `lower(trim(...))`, update pending rows to `unsubscribed`, and set lead consent false.

- [ ] **Step 4: Run migration tests**

Expected: database static contract tests pass.

### Task 5: Implement central email templates and signed unsubscribe

**Files:**
- Create: `api/emails/unsubscribe-token.ts`
- Create: `api/emails/templates.ts`
- Modify: `api/send-welcome.ts`

- [ ] **Step 1: Implement token functions**

Use Node `crypto` HMAC-SHA256, base64url encoding, timing-safe comparison, normalized email, and a maximum 90-day lifetime.

- [ ] **Step 2: Implement shared branded email shell**

Build escaped HTML and plain text with Ria avatar, footer legal links, visible unsubscribe URL, disclaimer, and RFC 8058 headers.

- [ ] **Step 3: Implement all five templates**

Use the exact approved subjects and content constraints. Build case-study country personalization without implying a verified testimonial.

- [ ] **Step 4: Refactor welcome endpoint minimally**

Keep `/api/send-welcome` compatibility but delegate content construction to `buildSequenceEmail('welcome', context)`.

- [ ] **Step 5: Run template and existing welcome tests**

Expected: all template and welcome assertions pass.

### Task 6: Implement server-side completion and browser integration

**Files:**
- Create: `api/_lib/supabase-admin.ts`
- Create: `api/complete-intake.ts`
- Modify: `src/lib/intake.ts`
- Modify: `src/lib/leads.ts`
- Modify: `src/components/RiaIntakeModal.tsx`
- Modify: `src/pages/Privacy.tsx`

- [ ] **Step 1: Add server-only Supabase client**

Read `SUPABASE_URL` and prefer `SUPABASE_SECRET_KEY`, falling back to `SUPABASE_SERVICE_ROLE_KEY`. Throw a bounded configuration error when absent.

- [ ] **Step 2: Implement completion handler**

Validate input, call `complete_intake`, optionally create a Resend contact, generate a signed unsubscribe URL, send welcome, and persist step 1 as `sent` or `failed`.

- [ ] **Step 3: Replace browser insert**

Make `saveLead(values, fetcher = fetch)` POST JSON to `/api/complete-intake`. Remove Supabase from the modal submission path.

- [ ] **Step 4: Add consent state and checkbox**

Extend `IntakeValues`, initialize false, render the exact optional checkbox below email, and link to `/privacy`.

- [ ] **Step 5: Update Privacy**

Add the exact `Marketing communications` section.

- [ ] **Step 6: Run completion, leads, intake, and privacy tests**

Expected: all consent-gate and completion tests pass.

### Task 7: Implement cron and unsubscribe endpoints

**Files:**
- Create: `api/cron/send-sequence.ts`
- Create: `api/unsubscribe.ts`
- Create: `src/pages/Unsubscribed.tsx`
- Modify: `src/App.tsx`
- Modify: `vercel.json`

- [ ] **Step 1: Implement cron handler**

Check bearer authorization, Bratislava hour via injected/current `Date`, fetch due rows, atomically claim each row, re-check consent for steps 2–5, send templates, and persist `sent`, `failed`, or `unsubscribed`.

- [ ] **Step 2: Implement unsubscribe handler**

Validate signed token, call `unsubscribe_email_sequence`, redirect GET to `/unsubscribed`, and return blank 200 for POST.

- [ ] **Step 3: Add confirmation page and route**

Create a branded confirmation page with a home link.

- [ ] **Step 4: Add both UTC cron entries**

Preserve existing rewrites and add the approved `crons` array.

- [ ] **Step 5: Run endpoint and configuration tests**

Expected: cron, unsubscribe, and Vercel tests pass.

### Task 8: Verify, migrate, configure, deploy

**Files:**
- Review all changed files.

- [ ] **Step 1: Run fresh verification**

Run:

```bash
npm test
npm run build
git diff --check
git diff --stat
```

- [ ] **Step 2: Inspect external configuration**

Use `vercel env ls` and Supabase CLI link status without printing secret values. Required production variables are `RESEND_API_KEY`, `SUPABASE_URL`, one elevated Supabase key, `CRON_SECRET`, and `UNSUBSCRIBE_SECRET`.

- [ ] **Step 3: Configure missing Vercel secrets**

Generate independent strong values for `CRON_SECRET` and `UNSUBSCRIBE_SECRET` and add them to production/preview/development only with authorized CLI access. Never print values. If the elevated Supabase key is missing and unavailable locally, stop and request it rather than inventing it.

- [ ] **Step 4: Push migrations**

Run `supabase db push` only if the repository is linked and authentication is available. Otherwise provide exact Dashboard SQL Editor order: run `00001`, then `00002`.

- [ ] **Step 5: Commit and push**

Commit:

```text
feat: add email sequence (5-step follow-up after wizard)
```

Push `origin main` and wait for Vercel.

- [ ] **Step 6: Production verification**

Verify the deployed unsubscribe page, unauthorized cron returns 401, and normal landing/legal pages remain live. Run a real wizard flow only with an authorized recipient and confirmed production database migration; verify one or five sequence rows according to consent and welcome delivery.
