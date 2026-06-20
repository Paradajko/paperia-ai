import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const metadata = {
  landing: {
    title: 'Riadence | AI Residence Guide for Europe',
    description:
      'Get a personalized checklist for your Slovakia residence permit. Riadence guides non-EU citizens through documents, timelines, and official requirements.',
  },
  privacy: {
    title: 'Privacy Policy | Riadence',
    description:
      'Learn how Riadence collects, uses, stores, and protects your personal data when you use our AI residence guide for Slovakia, including your GDPR rights.',
  },
  terms: {
    title: 'Terms of Service | Riadence',
    description:
      'Read the Riadence terms for using our AI residence guide for Slovakia, including service limits, user responsibilities, disclaimers, and governing law.',
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
