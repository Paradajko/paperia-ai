# Supabase Lead Capture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Capture validated Ria intake submissions in Supabase `leads` with insert-only anon access.

**Architecture:** Supabase CLI owns local migration files under `supabase/`. The React modal builds a typed lead payload from existing form state, inserts it through a small `src/lib/supabase.ts` client, and shows a thank-you state only after a successful insert. Environment values are read from Vite `import.meta.env`; `.env` is never read or committed.

**Tech Stack:** Vite, React 19, TypeScript, Tailwind, Supabase CLI, `@supabase/supabase-js`.

---

### Task 1: Supabase Project Scaffolding

**Files:**
- Create: `supabase/config.toml`
- Create: `supabase/migrations/*_create_leads_table.sql`
- Create: `.env.example`
- Modify: `.gitignore`

- [ ] **Step 1: Install Supabase CLI**

Run: `brew install supabase/tap/supabase`
Expected: Supabase CLI installed and `supabase --version` prints a version.

- [ ] **Step 2: Initialize Supabase project**

Run: `supabase init`
Expected: `supabase/config.toml` exists.

- [ ] **Step 3: Create migration**

Run: `supabase migration new create_leads_table`
Expected: A new timestamped SQL file exists in `supabase/migrations/`.

- [ ] **Step 4: Add leads table SQL**

Write this migration:

```sql
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
```

Expected: anon can insert leads; anon has no select/update/delete policies.

- [ ] **Step 5: Add env example**

Create `.env.example`:

```dotenv
VITE_SUPABASE_URL=https://bgbxkgprisbukfuxnrrc.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Modify `.gitignore` so `.env` and `.env.*` remain ignored, but `.env.example` is allowed.

### Task 2: Supabase Client And Payload Builder

**Files:**
- Create: `src/lib/supabase.ts`
- Create: `src/lib/leads.ts`

- [ ] **Step 1: Install dependency**

Run: `npm install @supabase/supabase-js`
Expected: `package.json` and `package-lock.json` include `@supabase/supabase-js`.

- [ ] **Step 2: Create client**

Create `src/lib/supabase.ts`:

```ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;
```

- [ ] **Step 3: Create lead payload helper**

Create `src/lib/leads.ts` with a typed `LeadInsert` and `buildLeadInsert(values)` helper. It maps `currentLocation` to `current_location`, `statusReason` to `status_reason`, sets `checklist_route` to `null`, `source` to `web`, and `status` to `new`.

### Task 3: Modal Submission Flow

**Files:**
- Modify: `src/components/RiaIntakeModal.tsx`

- [ ] **Step 1: Wire Supabase insert**

Update `handleSubmit` to be async. On valid form values, clear previous submit error, insert into `leads`, and set submitted only after success.

- [ ] **Step 2: Add failure UI**

If Supabase is not configured or insert returns an error, keep the form visible and show `Nieco sa pokazilo, skus znova.` Do not log env values or Supabase responses.

- [ ] **Step 3: Add success copy**

After successful insert, replace the form panel with `Dakujeme, Ria pripravuje tvoj checklist.` and keep the generated checklist visible.

### Task 4: Verification And Release

**Files:**
- All changed files

- [ ] **Step 1: Build**

Run: `npm run build`
Expected: TypeScript and Vite build exit 0.

- [ ] **Step 2: Dev server**

Run: `npm run dev -- --host 127.0.0.1`
Expected: Vite starts and prints a localhost URL.

- [ ] **Step 3: Review git diff**

Run: `git status --short` and `git diff --check`
Expected: only intended files are changed and no whitespace errors.

- [ ] **Step 4: Commit and push**

Run:

```bash
git add .
git commit -m "feat: supabase lead capture"
git push
```

Expected: commit exists on `main` and push succeeds.
