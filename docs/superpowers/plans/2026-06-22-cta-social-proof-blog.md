# CTA, Social Proof, and Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship four isolated, production-ready commits for CTA sizing, social proof, blog infrastructure, and a pilot article.

**Architecture:** Preserve the existing Vite, React Router, i18next, and Tailwind patterns. Add a typed blog content registry and route-aware metadata without a new CMS dependency.

**Tech Stack:** React 19, React Router 7, TypeScript, i18next, Tailwind CSS, Node test runner, Vite, Playwright.

---

### Task 1: Enforce 48 px checklist CTAs

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/pages/LandingPage.tsx`
- Modify: `src/components/ChecklistFlow.tsx`
- Test: `tests/touch-targets.test.mjs`

- [ ] Write a failing source contract that requires explicit `h-12`/`min-h-12` on every `common.getChecklist` button.
- [ ] Run `node --test tests/touch-targets.test.mjs` and confirm failure.
- [ ] Apply explicit 48 px sizing while leaving locale controls at 44 px.
- [ ] Run the focused test and measure visible CTA heights with Playwright.
- [ ] Run `npm test`, `npm run build`, and `git diff --check`.
- [ ] Commit as `fix(cta): raise primary CTA height to 48 px for accessibility`.

### Task 2: Expand social proof

**Files:**
- Modify: `src/components/SocialProof.tsx`
- Modify: `src/locales/en/translation.json`
- Modify: `src/locales/sk/translation.json`
- Modify: `src/locales/rs/translation.json`
- Modify: `src/locales/ua/translation.json`
- Test: `tests/slovakia-context.test.mjs`

- [ ] Write failing tests for three testimonial cards, the sample disclaimer, six trust badges, and homepage placement.
- [ ] Implement the localized section under the hero.
- [ ] Run focused and complete tests, build, and diff checks.
- [ ] Commit as `feat(social-proof): add testimonials and trust badges`.

### Task 3: Add blog routing and article shell

**Files:**
- Create: `src/pages/blog/BlogIndex.tsx`
- Create: `src/pages/blog/BlogArticle.tsx`
- Create: `src/content/blog/index.ts`
- Modify: `src/App.tsx`
- Modify: `src/components/RouteMetadata.tsx`
- Modify: `public/sitemap.xml`
- Test: `tests/blog.test.mjs`

- [ ] Write failing tests for `/blog`, `/blog/:slug`, visible unknown-slug 404, metadata, and sitemap registration.
- [ ] Implement an empty typed registry, index page, article shell, and route metadata.
- [ ] Run focused and complete tests, build, and diff checks.
- [ ] Commit as `feat(blog): add blog route with article template`.

### Task 4: Publish the Serbian-citizen pilot article

**Files:**
- Create: `src/content/blog/slovakia-residence-permit-serbian-citizens-2026.mdx`
- Create: `src/content/blog/slovakiaResidencePermitSerbianCitizens2026.tsx`
- Modify: `src/content/blog/index.ts`
- Modify: `public/sitemap.xml`
- Test: `tests/blog-article.test.mjs`

- [ ] Verify claims against official sources and write failing tests for slug, length, sections, disclaimer, metadata, Article JSON-LD, and index linkage.
- [ ] Add the 800–1500 word MDX source and renderable article component.
- [ ] Run focused and complete tests, build, and diff checks.
- [ ] Commit as `feat(blog): add pilot article for serbian citizens`.

### Task 5: Deploy and verify

- [ ] Push `main` to `origin`.
- [ ] Wait for Vercel auto-deploy and require status `Ready`.
- [ ] Verify HTTP 200 for `/`, `/sk/`, `/rs/`, `/ua/`, `/blog`, the pilot slug, and `/sitemap.xml`.
- [ ] Verify live CTA height, visible blog index, article SEO metadata, and Article JSON-LD.
