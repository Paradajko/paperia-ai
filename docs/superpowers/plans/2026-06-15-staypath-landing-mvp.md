# Ria Landing MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, responsive Ria MVP landing page that explains the applicant-first checklist product and the secondary agency/lawyer business line.

**Architecture:** Create a new Vite React TypeScript frontend because the workspace contains no existing app. Keep the product as a static frontend with reusable presentational components, Tailwind styling, and placeholder-only CTA interactions.

**Tech Stack:** Vite, React, TypeScript, Tailwind CSS, PostCSS, no backend, no auth, no payments, no `.env`.

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `postcss.config.js`
- Create: `tailwind.config.js`
- Create: `.gitignore`

- [ ] Define npm scripts for `dev`, `build`, and `preview`.
- [ ] Configure Vite for React and TypeScript.
- [ ] Configure Tailwind content scanning for `index.html` and `src`.
- [ ] Ignore build output, dependencies, local env files, and brainstorm artifacts.

### Task 2: App Shell and Styles

**Files:**
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`
- Create: `src/vite-env.d.ts`

- [ ] Mount the React app into `#root`.
- [ ] Import Tailwind layers and global base styles.
- [ ] Use semantic sections in `App.tsx`.
- [ ] Add CTA helper behavior for scrolling and placeholder alerts.

### Task 3: Reusable Landing Components

**Files:**
- Create: `src/components/Logo.tsx`
- Create: `src/components/Header.tsx`
- Create: `src/components/HeroDashboard.tsx`
- Create: `src/components/ProblemCard.tsx`
- Create: `src/components/ChecklistPreview.tsx`
- Create: `src/components/ChecklistFlow.tsx`
- Create: `src/components/HowItWorks.tsx`
- Create: `src/components/AgencySection.tsx`
- Create: `src/components/PricingCard.tsx`
- Create: `src/components/FAQ.tsx`
- Create: `src/components/Footer.tsx`

- [ ] Build a professional SVG logo using document, path, and checkmark motifs.
- [ ] Build a dense hero dashboard preview showing applicant, route, missing documents, risk, next step, timeline, and checklist statuses.
- [ ] Build the product preview with route recommendation, required documents, translation/apostille warnings, deadline/timeline, common mistakes, employer questions, and expert handoff.
- [ ] Build the static form-like checklist flow with result preview.
- [ ] Build the agency/lawyer section with mini dashboard and partner CTA.
- [ ] Build pricing teaser cards and FAQ entries with careful no-legal-advice language.

### Task 4: Verification

**Files:**
- Modify as needed only if build or visual review reveals issues.

- [ ] Run `npm install`.
- [ ] Run `npm build`.
- [ ] Start local dev server.
- [ ] Open the app in the in-app browser.
- [ ] Check desktop and mobile layout for obvious overlap or cramped text.
