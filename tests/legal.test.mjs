import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function read(relativePath) {
  try {
    return readFileSync(resolve(repoRoot, relativePath), 'utf8');
  } catch {
    return '';
  }
}

test('legal routes and global cookie consent are configured', () => {
  const packageJson = JSON.parse(read('package.json'));
  const app = read('src/App.tsx');
  const cookieConsent = read('src/components/CookieConsent.tsx');

  assert.match(packageJson.dependencies?.['react-router-dom'] ?? '', /^\^/);
  assert.match(app, /BrowserRouter/);
  assert.match(app, /path="\/privacy"/);
  assert.match(app, /path="\/terms"/);
  assert.match(app, /path="\*"/);
  assert.match(app, /CookieConsent/);
  assert.match(cookieConsent, /riadence_cookie_consent/);
  assert.match(cookieConsent, /'accepted'/);
  assert.match(cookieConsent, /'declined'/);
  assert.match(
    cookieConsent,
    /We use only essential cookies for site functionality\.\s*No tracking, no analytics\./,
  );
  assert.match(cookieConsent, /to="\/privacy"/);
});

test('privacy policy contains the approved controller identity and GDPR disclosures', () => {
  const privacy = read('src/pages/Privacy.tsx');

  assert.match(privacy, /Riadence is operated by:/);
  assert.match(privacy, /Fabian Sarkozi/);
  assert.match(privacy, /Trading as: Fabian Sarkozi - Gejming/);
  assert.match(privacy, /IČO \(Company ID\): 57158738/);
  assert.match(privacy, /DIČ \(Tax ID\): 1130643118/);
  assert.match(privacy, /Registered at: Okresný úrad Bratislava \(Slovakia\)/);
  assert.match(
    privacy,
    /Address: Nábrežie arm\. gen\. Ludvíka Svobodu 20, 811 02 Bratislava, Slovakia/,
  );
  assert.match(privacy, /Contact:/);
  assert.match(privacy, /hello@riadence\.com/);
  assert.match(privacy, /resend\.com\/legal\/privacy/);
  assert.match(privacy, /supabase\.com\/privacy/);
  assert.match(privacy, /openai\.com\/policies\/privacy-policy/);
  assert.match(privacy, /vercel\.com\/legal\/privacy-policy/);
  assert.match(privacy, /two years/i);
  assert.match(privacy, /Articles 15–22/);
  assert.match(privacy, /dataprotection\.gov\.sk/);
  assert.match(read('src/components/LegalPageLayout.tsx'), /June 19, 2026/);
  assert.match(privacy, /Marketing communications/);
  assert.match(
    privacy,
    /We may send you a 14-day email guide with practical residence tips and case examples\. This is opt-in: you must explicitly agree before we send these emails\. You can unsubscribe anytime using the link in each email footer\./,
  );
});

test('terms contain service limits, governing law, contact, and update date', () => {
  const terms = read('src/pages/Terms.tsx');

  assert.match(terms, /AI residence guide/i);
  assert.match(terms, /not a law firm/i);
  assert.match(terms, /not a lawyer/i);
  assert.match(terms, /not an immigration adviser/i);
  assert.match(terms, /EUR 0/);
  assert.match(terms, /Slovak law/i);
  assert.match(terms, /Slovak courts/i);
  assert.match(terms, /hello@riadence\.com/);
  assert.match(read('src/components/LegalPageLayout.tsx'), /June 19, 2026/);
});

test('footer and FAQ expose legal links', () => {
  const footer = read('src/components/Footer.tsx');
  const faq = read('src/components/FAQ.tsx');

  assert.match(footer, /to="\/privacy"/);
  assert.match(footer, /Privacy Policy/);
  assert.match(footer, /to="\/terms"/);
  assert.match(footer, /Terms of Service/);
  assert.match(footer, /mailto:hello@riadence\.com/);
  assert.match(faq, /to="\/privacy"/);
  assert.match(faq, /to="\/terms"/);
});

test('legal metadata, sitemap, robots, and Vercel routing are configured', () => {
  const privacyHtml = read('privacy/index.html');
  const termsHtml = read('terms/index.html');
  const viteConfig = read('vite.config.ts');
  const robots = read('public/robots.txt');
  const sitemap = read('public/sitemap.xml');
  const vercel = read('vercel.json');

  assert.match(privacyHtml, /<title>Privacy Policy \| Riadence<\/title>/);
  assert.match(privacyHtml, /name="description"/);
  assert.match(termsHtml, /<title>Terms of Service \| Riadence<\/title>/);
  assert.match(termsHtml, /name="description"/);
  assert.match(viteConfig, /privacy\/index\.html/);
  assert.match(viteConfig, /terms\/index\.html/);
  assert.match(robots, /Sitemap: https:\/\/riadence\.com\/sitemap\.xml/);
  assert.match(sitemap, /https:\/\/riadence\.com\/privacy/);
  assert.match(sitemap, /https:\/\/riadence\.com\/terms/);
  assert.match(vercel, /"source": "\/privacy"/);
  assert.match(vercel, /"destination": "\/privacy\/index\.html"/);
  assert.match(vercel, /"source": "\/terms"/);
  assert.match(vercel, /"destination": "\/terms\/index\.html"/);
  assert.match(vercel, /"destination": "\/index\.html"/);
});
