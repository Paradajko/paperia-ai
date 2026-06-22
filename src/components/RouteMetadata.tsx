import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { getBlogArticle } from '../content/blog';

type PageMetadata = {
  title: string;
  description: string;
  keywords: string;
  ogLocale: string;
  lang: string;
  url: string;
  type?: 'website' | 'article';
  noindex?: boolean;
};

const metadata = {
  landing: {
    title: 'Riadence | AI Residence Guide for Europe',
    description:
      'Get a personalized checklist for your residence permit or return to Slovakia. AI guide Ria walks you through documents, deadlines, and official requirements.',
    keywords: 'residence permit, visa, Slovakia',
    ogLocale: 'en_GB',
    lang: 'en',
    url: 'https://riadence.com/',
  },
  sk: {
    title: 'Riadence | AI sprievodca pobytom na Slovensku',
    description:
      'Získajte personalizovaný checklist pre pobyt alebo návrat na Slovensko. Riadence Vás prevedie dokumentmi, termínmi a oficiálnymi požiadavkami.',
    keywords: 'pobyt, vízum, Slovensko',
    ogLocale: 'sk_SK',
    lang: 'sk',
    url: 'https://riadence.com/sk/',
  },
  rs: {
    title: 'Riadence | AI vodič za boravak u Slovačkoj',
    description:
      'Preuzmite personalizovanu kontrolnu listu za boravak u Slovačkoj. Riadence vodi srpske državljane i dijasporu kroz dokumenta, rokove i zahteve.',
    keywords: 'boravak, viza, Srbija',
    ogLocale: 'sr_RS',
    lang: 'sr',
    url: 'https://riadence.com/rs/',
  },
  ua: {
    title: 'Riadence | AI-помічник із проживання у Словаччині',
    description:
      'Отримайте персоналізований чекліст щодо тимчасового захисту, дозволу на проживання або візи у Словаччині та ЄС.',
    keywords: 'дозвіл на проживання, віза, ЄС',
    ogLocale: 'uk_UA',
    lang: 'uk',
    url: 'https://riadence.com/ua/',
  },
  privacy: {
    title: 'Privacy Policy | Riadence',
    description:
      'Learn how Riadence collects, uses, stores, and protects your personal data when you use our AI residence guide for Slovakia, including your GDPR rights.',
    keywords: 'Riadence privacy, GDPR, Slovakia',
    ogLocale: 'en_GB',
    lang: 'en',
    url: 'https://riadence.com/privacy',
  },
  terms: {
    title: 'Terms of Service | Riadence',
    description:
      'Read the Riadence terms for using our AI residence guide for Slovakia, including service limits, user responsibilities, disclaimers, and governing law.',
    keywords: 'Riadence terms, Slovakia residence guide',
    ogLocale: 'en_GB',
    lang: 'en',
    url: 'https://riadence.com/terms',
  },
  unsubscribed: {
    title: 'Unsubscribed · Riadence',
    description: "You've been unsubscribed from Riadence email updates.",
    keywords: 'Riadence unsubscribe',
    ogLocale: 'en_GB',
    lang: 'en',
    url: 'https://riadence.com/unsubscribed',
  },
  blog: {
    title: 'Blog | Riadence',
    description:
      'Practical, source-aware guides about residence permits, documents, translations, deadlines, and moving to Slovakia.',
    keywords: 'Slovakia residence guide, residence permit blog',
    ogLocale: 'en_GB',
    lang: 'en',
    url: 'https://riadence.com/blog',
  },
} satisfies Record<string, PageMetadata>;

export function RouteMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    const blogSlug = pathname.startsWith('/blog/')
      ? pathname.slice('/blog/'.length).replace(/\/$/, '')
      : undefined;
    const article = getBlogArticle(blogSlug);
    const page: PageMetadata =
      pathname === '/privacy'
        ? metadata.privacy
        : pathname === '/terms'
          ? metadata.terms
          : pathname === '/unsubscribed'
            ? metadata.unsubscribed
            : pathname === '/blog'
              ? metadata.blog
              : pathname.startsWith('/blog/')
                ? article
                  ? {
                      title: `${article.title} | Riadence`,
                      description: article.description,
                      keywords: article.keywords,
                      ogLocale: 'en_GB',
                      lang: 'en',
                      url: `https://riadence.com/blog/${article.slug}`,
                      type: 'article',
                    }
                  : {
                      ...metadata.blog,
                      title: 'Article not found | Riadence',
                      url: `https://riadence.com${pathname}`,
                      noindex: true,
                    }
                : pathname === '/sk' || pathname.startsWith('/sk/')
              ? metadata.sk
              : pathname === '/rs' || pathname.startsWith('/rs/')
                ? metadata.rs
                : pathname === '/ua' || pathname.startsWith('/ua/')
                  ? metadata.ua
                  : metadata.landing;

    document.title = page.title;
    document.documentElement.lang = page.lang;
    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    description?.setAttribute('content', page.description);
    const keywords = document.querySelector<HTMLMetaElement>(
      'meta[name="keywords"]',
    );
    keywords?.setAttribute('content', page.keywords);
    const ogTitle = document.querySelector<HTMLMetaElement>(
      'meta[property="og:title"]',
    );
    ogTitle?.setAttribute('content', page.title);
    const ogDescription = document.querySelector<HTMLMetaElement>(
      'meta[property="og:description"]',
    );
    ogDescription?.setAttribute('content', page.description);
    const ogLocale = document.querySelector<HTMLMetaElement>(
      'meta[property="og:locale"]',
    );
    ogLocale?.setAttribute('content', page.ogLocale);
    const ogUrl = document.querySelector<HTMLMetaElement>(
      'meta[property="og:url"]',
    );
    ogUrl?.setAttribute('content', page.url);
    const ogType = document.querySelector<HTMLMetaElement>(
      'meta[property="og:type"]',
    );
    ogType?.setAttribute('content', page.type ?? 'website');
    const twitterTitle = document.querySelector<HTMLMetaElement>(
      'meta[name="twitter:title"]',
    );
    twitterTitle?.setAttribute('content', page.title);
    const twitterDescription = document.querySelector<HTMLMetaElement>(
      'meta[name="twitter:description"]',
    );
    twitterDescription?.setAttribute('content', page.description);

    const canonical =
      document.querySelector<HTMLLinkElement>('link[rel="canonical"]') ??
      document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = page.url;
    if (!canonical.parentNode) {
      document.head.appendChild(canonical);
    }

    const robots = document.querySelector<HTMLMetaElement>(
      'meta[name="robots"]',
    );
    if (pathname === '/unsubscribed' || page.noindex) {
      const robotsMeta = robots ?? document.createElement('meta');
      robotsMeta.name = 'robots';
      robotsMeta.content = 'noindex,nofollow';
      if (!robots) {
        document.head.appendChild(robotsMeta);
      }
    } else {
      robots?.remove();
    }
  }, [pathname]);

  return null;
}
