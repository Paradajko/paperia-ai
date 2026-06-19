import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const metadata = {
  landing: {
    title: 'Riadence | AI Residence Guide for Europe',
    description:
      'Riadence is an AI residence guide that helps non-EU citizens understand residence permit documents, timelines, risks, and expert handoff.',
  },
  privacy: {
    title: 'Privacy Policy | Riadence',
    description:
      'Learn how Riadence collects, uses, stores, and protects personal data under GDPR.',
  },
  terms: {
    title: 'Terms of Service | Riadence',
    description:
      'Read the terms for using Riadence, the free AI residence guide for people moving to Slovakia.',
  },
} as const;

export function RouteMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    const page =
      pathname === '/privacy'
        ? metadata.privacy
        : pathname === '/terms'
          ? metadata.terms
          : metadata.landing;

    document.title = page.title;
    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    description?.setAttribute('content', page.description);
  }, [pathname]);

  return null;
}
