import type { ComponentType } from 'react';

import { SlovakiaResidencePermitSerbianCitizens2026 } from './slovakiaResidencePermitSerbianCitizens2026';

export type BlogArticle = {
  slug: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  readingTime: string;
  keywords: string;
  sources: Array<{ label: string; href: string }>;
  Content: ComponentType;
};

export const blogArticles: BlogArticle[] = [
  {
    slug: 'slovakia-residence-permit-serbian-citizens-2026',
    title: 'Slovakia Residence Permit for Serbian Citizens in 2026',
    description:
      'A practical 2026 guide for Serbian citizens preparing a Slovak residence application: routes, documents, apostilles, translations, filing and timelines.',
    author: 'Riadence Editorial Team',
    publishedAt: 'June 22, 2026',
    readingTime: '8 min read',
    keywords:
      'Slovakia residence permit Serbian citizens 2026, Serbian documents apostille Slovakia',
    sources: [
      {
        label: 'IOM: What is temporary residence?',
        href: 'https://mic.iom.sk/en/residence/temporary-residence/232-what-is-temporary-residence.html',
      },
      {
        label: 'IOM: Application for temporary residence',
        href: 'https://mic.iom.sk/en/residence/temporary-residence/233-application-for-temporary-residence.html',
      },
      {
        label: 'IOM: How to document the purpose of residence',
        href: 'https://mic.iom.sk/en/residence/temporary-residence/234-how-to-document-the-purpose-of-residence.html',
      },
    ],
    Content: SlovakiaResidencePermitSerbianCitizens2026,
  },
];

export function getBlogArticle(slug?: string) {
  return blogArticles.find((article) => article.slug === slug);
}
