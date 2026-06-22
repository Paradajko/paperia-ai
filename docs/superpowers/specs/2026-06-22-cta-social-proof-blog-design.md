# CTA, Social Proof, and Blog Design

## Goal

Deliver four independently verified production changes: genuine 48 px primary checklist CTAs, visible and explicitly illustrative social proof, a real blog route with SEO-aware article rendering, and one sourced pilot article for Serbian citizens.

## Design

### CTA accessibility

Every primary button whose translated label is `common.getChecklist` will use an explicit `h-12` or `min-h-12` plus border-box sizing so its rendered height cannot collapse below 48 px. The locale controls remain 44 px. A browser measurement will inspect every visible primary checklist CTA and assert a computed height of at least 48 px.

### Social proof

The existing `SocialProof` section remains directly below the hero and expands into:

- three testimonial cards;
- a visible disclaimer stating that the quotes are sample testimonials from beta users;
- six trust badges: GDPR-conscious, Not a law firm, Made in Slovakia, Since 2026, AI-powered, and Free PDF.

English and Slovak receive natural localized copy. Serbian and Ukrainian receive complete fallback translations so the existing localization completeness contract remains intact.

### Blog infrastructure

The blog uses React Router and a typed content registry rather than adding a CMS or runtime markdown parser. `BlogIndex` lists registered articles. `BlogArticle` resolves `:slug`, renders article content, and returns a visible 404 page with `noindex` metadata for unknown slugs. Route metadata supports blog index, articles, Open Graph article type, canonical URLs, and JSON-LD.

The requested `.mdx` file is the source-of-record content artifact. A small typed TypeScript content module provides the renderable representation without adding an MDX build dependency for a single article.

### Pilot article

The English article is 800–1500 words and covers the requested topics. Legal and administrative claims are calibrated against current official Slovak and Serbian sources. Processing times are presented as statutory or typical ranges only where supported, never as a guarantee. The article ends with the required legal disclaimer and exposes Article JSON-LD.

## Verification

Each commit must independently satisfy:

- the relevant new test fails before implementation and passes afterward;
- `npm test` passes;
- `npm run build` passes;
- `git diff --check` passes;
- the commit leaves a clean working tree.

After all four commits, production deployment must be `Ready`, required routes must return HTTP 200, and the homepage CTA must measure at least 48 px in Playwright.
