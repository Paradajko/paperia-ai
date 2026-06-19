# Riadence Legal Infrastructure Design

**Date:** 2026-06-19

## Goal

Add production-ready legal infrastructure to Riadence for an EU audience: accessible Privacy Policy and Terms of Service pages, essential-cookie consent disclosure, updated legal links and disclaimers, route-specific metadata, and deployment support for direct legal-page URLs.

## Routing and deployment

Use `react-router-dom` with `BrowserRouter`.

- `/` renders the existing landing page without changing its behavior.
- `/privacy` renders the Privacy Policy.
- `/terms` renders the Terms of Service.
- Unknown routes redirect to `/`.

The landing content currently in `App.tsx` will move into a focused `LandingPage` component. `App.tsx` will own providers, routes, and the global cookie consent banner.

Vercel needs direct-link support. The build will emit route-specific HTML entry files for `/privacy` and `/terms` so HTTP clients and search crawlers receive the correct title and description before React runs. `vercel.json` will preserve those entries and fall back to the root application for unknown SPA routes.

## Shared legal-page layout

Privacy and Terms will share a `LegalPageLayout`:

- fixed Riadence header using the current logo and palette;
- a home link instead of landing-only hash navigation;
- centered readable content with a narrow maximum width;
- short sections, lists, external links, and clear update date;
- existing Riadence footer;
- cream, porcelain, mint, and green brand colors;
- responsive spacing and typography consistent with the landing page.

The existing landing Header remains focused on landing navigation. Footer hash links will become absolute root hash links where needed so they also work from legal routes.

## Privacy Policy

The English Privacy Policy will identify the controller exactly as:

> Riadence is operated by:  
> Fabian Sarkozi  
> Trading as: Fabian Sarkozi - Gejming  
> IČO (Company ID): 57158738  
> DIČ (Tax ID): 1130643118  
> Registered at: Okresný úrad Bratislava (Slovakia)  
> Address: Nábrežie arm. gen. Ludvíka Svobodu 20, 811 02 Bratislava, Slovakia  
> Contact: hello@riadence.com

It will cover:

- email, optional name, nationality, destination country, residence type, intake answers, and server-log IP data;
- service delivery, PDF/email generation, follow-up communication, security, and product improvement;
- contractual/pre-contractual service delivery and legitimate interests where appropriate, plus consent for optional follow-up or marketing;
- Resend, Supabase, OpenAI, and Vercel with direct privacy-policy links;
- lead-data retention for up to two years, email data until unsubscribe where applicable, and earlier deletion on a valid request unless law requires retention;
- GDPR Articles 15–22 rights and complaints to the Slovak Data Protection Authority;
- current use of only essential browser storage and no analytics/tracking;
- material-change notification and `Last updated: June 19, 2026`.

The wording will distinguish operational follow-up needed to deliver the requested service from optional marketing consent. It will not claim that consent is the legal basis for service delivery.

## Terms of Service

The English Terms will explain:

- Riadence is a free AI residence guide for non-EU citizens moving to Slovakia;
- the five-step wizard, PDF checklist, AI follow-up, and service emails;
- Riadence is not a law firm, lawyer, or immigration adviser;
- government authorities make all residence decisions and no outcome, timing, completeness, or accuracy is guaranteed;
- users must provide accurate information, use the service lawfully, independently verify important information, and pay any external professional they separately engage;
- Riadence owns its content, brand, and Ria avatar, while generated PDFs may be used personally;
- liability is limited to the amount paid for the service, currently EUR 0 for the free service, to the extent permitted by mandatory law;
- service suspension or termination, material-change notice, Slovak governing law and courts, contact details, and `Last updated: June 19, 2026`.

Mandatory consumer rights and liabilities that cannot legally be excluded will remain unaffected.

## Cookie consent

`CookieConsent` is global and appears on every route when no decision exists.

- Storage key: `riadence_cookie_consent`.
- Values: `accepted` or `declined`.
- Initial component state: `show` when storage is absent, otherwise the stored decision.
- Both actions persist the decision and hide the banner.
- The banner states that only essential cookies/storage are used and there is no tracking or analytics.
- It links to `/privacy`.
- A failed or unavailable `localStorage` read/write will not break rendering.

Because no optional cookies or analytics are currently loaded, Accept and Decline have identical runtime behavior beyond recording the disclosure choice. No non-essential storage will be added before consent.

## Footer and disclaimers

The Footer will expose:

- Privacy Policy → `/privacy`
- Terms of Service → `/terms`
- Contact → `mailto:hello@riadence.com`

Landing section links will use `/#pricing` and `/#faq`.

The FAQ disclaimer will link to Privacy and Terms. The PDF disclaimer page will include the full URLs `https://riadence.com/privacy` and `https://riadence.com/terms`. Ria's system prompt will direct privacy and terms questions to the matching routes.

## Metadata and indexing

Route metadata:

- `/privacy`: `Privacy Policy | Riadence`
- `/terms`: `Terms of Service | Riadence`
- `/`: existing landing title and description

Each legal page gets a concise route-specific description of no more than approximately 150 characters. Metadata will update during client navigation and exist in route-specific built HTML.

`public/robots.txt` will allow indexing and point to the sitemap. `public/sitemap.xml` will list `/`, `/privacy`, and `/terms` with the Riadence production origin.

## Testing and verification

Tests will be written before implementation changes and will cover:

- required dependency and route declarations;
- Privacy controller identity and required processor links;
- Terms sections and governing-law language;
- cookie consent key, values, and banner copy;
- footer and disclaimer legal links;
- Ria system-prompt instruction;
- route-specific HTML metadata, robots, sitemap, and Vercel routing.

Verification:

1. Observe the new tests fail for missing implementation.
2. Implement the minimum required changes.
3. Run `npm test` and confirm all tests pass.
4. Run `npm run build`.
5. Inspect `git diff --stat` and request code review.
6. Commit the implementation with the requested message.
7. Push `main`.
8. Wait for Vercel deployment and verify production with `curl` and browser checks.

## Out of scope

- Analytics or tracking installation.
- A cookie-preferences center for future optional cookie categories.
- Legal advice or independent legal certification of the policy text.
- Changes to intake data collection or the database schema.
