# Riadence Legal Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add GDPR-oriented Privacy and Terms pages, global essential-cookie consent, legal links and disclaimers, route metadata, and production deep-link support.

**Architecture:** `react-router-dom` owns client routing, while Vite builds three HTML inputs (`/`, `/privacy/`, `/terms/`) so legal metadata is available without JavaScript. A shared legal layout keeps legal pages consistent with the landing site, and a global cookie banner records only the user's disclosure decision.

**Tech Stack:** React 19, TypeScript, Vite 8, Tailwind CSS, react-router-dom 7, Node test runner, Vercel.

---

### Task 1: Add failing legal infrastructure tests

**Files:**
- Create: `tests/legal.test.mjs`
- Modify: `tests/api.test.mjs`
- Modify: `tests/pdf.test.mjs`

- [ ] **Step 1: Add static legal infrastructure assertions**

Create one Node test file that reads repository files and asserts:

```js
test('legal routes, pages, consent, metadata, and deployment files exist', () => {
  assert.match(packageJson.dependencies['react-router-dom'], /^\^/);
  assert.match(app, /path="\\/privacy"/);
  assert.match(app, /path="\\/terms"/);
  assert.match(privacy, /Fabian Sarkozi - Gejming/);
  assert.match(privacy, /57158738/);
  assert.match(privacy, /1130643118/);
  assert.match(privacy, /resend\\.com\\/legal\\/privacy/);
  assert.match(privacy, /supabase\\.com\\/privacy/);
  assert.match(privacy, /openai\\.com\\/policies\\/privacy-policy/);
  assert.match(privacy, /vercel\\.com\\/legal\\/privacy-policy/);
  assert.match(terms, /Slovak law/i);
  assert.match(cookieConsent, /riadence_cookie_consent/);
  assert.match(cookieConsent, /accepted/);
  assert.match(cookieConsent, /declined/);
  assert.match(privacyHtml, /Privacy Policy \\| Riadence/);
  assert.match(termsHtml, /Terms of Service \\| Riadence/);
  assert.match(robots, /Sitemap: https:\\/\\/riadence\\.com\\/sitemap\\.xml/);
  assert.match(sitemap, /https:\\/\\/riadence\\.com\\/privacy/);
  assert.match(sitemap, /https:\\/\\/riadence\\.com\\/terms/);
  assert.match(vercel, /index\\.html/);
});
```

- [ ] **Step 2: Strengthen existing disclaimer tests**

Add:

```js
assert.match(completionRequest.messages[0].content, /\\/privacy/);
assert.match(completionRequest.messages[0].content, /\\/terms/);
```

and:

```js
assert.match(content.disclaimer, /https:\/\/riadence\.com\/privacy/);
assert.match(content.disclaimer, /https:\/\/riadence\.com\/terms/);
```

- [ ] **Step 3: Run the tests and verify RED**

Run: `npm test`

Expected: existing tests remain green and legal assertions fail because routing, legal pages, consent, metadata, and disclaimer links do not exist.

### Task 2: Add routing and page structure

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/App.tsx`
- Create: `src/pages/LandingPage.tsx`
- Create: `src/components/LegalPageLayout.tsx`
- Create: `src/pages/Privacy.tsx`
- Create: `src/pages/Terms.tsx`

- [ ] **Step 1: Install router**

Run: `npm install react-router-dom`

Expected: dependency and lockfile update.

- [ ] **Step 2: Extract landing page**

Move the current `App` landing implementation into `src/pages/LandingPage.tsx`, preserving all existing sections, modal behavior, and callbacks. Rename the exported function to:

```tsx
export function LandingPage() {
  // existing landing implementation
}
```

- [ ] **Step 3: Add routes**

Replace `App.tsx` with:

```tsx
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CookieConsent } from './components/CookieConsent';
import { LandingPage } from './pages/LandingPage';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CookieConsent />
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 4: Add shared legal layout**

Implement `LegalPageLayout` with `title`, `intro`, and `children` props. It must render the Riadence logo in a fixed header linked to `/`, a “Back to Riadence” link, the legal article, `Last updated: June 19, 2026`, and the shared Footer.

- [ ] **Step 5: Add Privacy page**

Implement all approved Privacy Policy sections with the exact controller text, data categories, purposes, legal bases, processors and URLs, two-year retention, Articles 15–22 rights, Slovak DPA link, essential-storage disclosure, policy changes, and update date.

- [ ] **Step 6: Add Terms page**

Implement all approved Terms sections covering service scope, non-lawyer status, no guarantees, responsibilities, intellectual property, liability with mandatory-law carve-out, termination, changes, Slovak law/courts, contact, and update date.

- [ ] **Step 7: Run tests**

Run: `npm test`

Expected: route and legal-content assertions pass; consent, metadata, and disclaimer assertions still fail.

### Task 3: Add global cookie consent

**Files:**
- Create: `src/components/CookieConsent.tsx`

- [ ] **Step 1: Implement consent state**

Use:

```tsx
type ConsentState = 'show' | 'accepted' | 'declined';
const STORAGE_KEY = 'riadence_cookie_consent';
```

Initialize from `localStorage` inside a lazy state initializer guarded by `try/catch`. Persist accepted or declined in a guarded `try/catch`, then update state.

- [ ] **Step 2: Implement banner UI**

When state is `show`, render a fixed bottom banner containing:

```text
We use only essential cookies for site functionality. No tracking, no analytics. Read our Privacy Policy.
```

Use a React Router `Link` to `/privacy`, plus `Accept` and `Decline` buttons. Return `null` after either decision.

- [ ] **Step 3: Run tests**

Run: `npm test`

Expected: cookie-consent assertions pass.

### Task 4: Update footer and disclaimers

**Files:**
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/FAQ.tsx`
- Modify: `src/lib/pdf-data.ts`
- Modify: `src/lib/pdf.tsx`
- Modify: `api/ria-chat.ts`

- [ ] **Step 1: Add footer legal links**

Use React Router links for `/privacy` and `/terms`, keep mailto contact, and change landing anchors to `/#pricing` and `/#faq`.

- [ ] **Step 2: Add FAQ links**

Append linked text for `Privacy Policy` and `Terms of Service` to the FAQ disclaimer.

- [ ] **Step 3: Add PDF links**

Append these full URLs to the generated disclaimer text:

```text
Privacy Policy: https://riadence.com/privacy. Terms of Service: https://riadence.com/terms.
```

Render the URLs as clickable PDF links on the disclaimer page.

- [ ] **Step 4: Add Ria prompt rule**

Append:

```text
- If asked about data privacy or terms, direct the user to /privacy or /terms.
```

- [ ] **Step 5: Run tests**

Run: `npm test`

Expected: all disclaimer and footer assertions pass.

### Task 5: Add route metadata and production routing

**Files:**
- Create: `privacy/index.html`
- Create: `terms/index.html`
- Modify: `vite.config.ts`
- Create: `vercel.json`
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`
- Create: `src/components/RouteMetadata.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Add route HTML inputs**

Create `privacy/index.html` and `terms/index.html` using the same root and module script as `index.html`, with:

```html
<title>Privacy Policy | Riadence</title>
```

and:

```html
<title>Terms of Service | Riadence</title>
```

Each file receives a concise matching meta description under approximately 150 characters.

- [ ] **Step 2: Configure Vite MPA input**

Configure Rollup input with:

```ts
input: {
  main: resolve(__dirname, 'index.html'),
  privacy: resolve(__dirname, 'privacy/index.html'),
  terms: resolve(__dirname, 'terms/index.html'),
}
```

- [ ] **Step 3: Add runtime metadata**

`RouteMetadata` reads `useLocation()`, sets the matching title and description in an effect, and restores landing metadata for `/` and fallback navigation.

- [ ] **Step 4: Add Vercel routing**

Use exact rewrites:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    { "source": "/privacy", "destination": "/privacy/index.html" },
    { "source": "/terms", "destination": "/terms/index.html" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

- [ ] **Step 5: Add indexing files**

`robots.txt` allows all user agents and points to `https://riadence.com/sitemap.xml`. `sitemap.xml` lists `/`, `/privacy`, and `/terms` with last modification `2026-06-19`.

- [ ] **Step 6: Run tests and build**

Run:

```bash
npm test
npm run build
```

Expected: all tests pass and `dist/privacy/index.html` plus `dist/terms/index.html` contain their matching metadata.

### Task 6: Review, commit, deploy, and verify

**Files:**
- Review all changed files.

- [ ] **Step 1: Inspect changes**

Run:

```bash
git diff --check
git diff --stat
git status --short
```

- [ ] **Step 2: Request code review**

Review the complete change against the approved design, fix all critical and important findings, then rerun tests and build.

- [ ] **Step 3: Commit**

Run:

```bash
git add .
git commit -m "feat: add legal pages (privacy, terms, cookie consent) + GDPR compliance"
```

- [ ] **Step 4: Push**

Run: `git push origin main`

- [ ] **Step 5: Verify deployment**

Poll until the new deployment is live, then run:

```bash
curl -s https://riadence.com/privacy | head -20
curl -s https://riadence.com/terms | head -20
```

Expected: the first response contains `Privacy Policy | Riadence`; the second contains `Terms of Service | Riadence`.

- [ ] **Step 6: Browser QA**

Open `/`, `/privacy`, and `/terms`; verify branding, navigation, readable mobile/desktop layout, cookie banner behavior, legal links, and no console errors.
