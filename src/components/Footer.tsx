import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-porcelain">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl">
            <Logo sublabel />
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Ria is your friendly, practical guide for organizing a Slovakia residence checklist. I am not a lawyer.
              This is general information, not legal advice. For complex cases, consult a licensed immigration
              professional.
            </p>
          </div>
          <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 md:text-right">
            <a href="#pricing" className="hover:text-ink">
              Pricing
            </a>
            <a href="#faq" className="hover:text-ink">
              FAQ
            </a>
            <a href="mailto:hello@riadence.com" className="hover:text-ink">
              Contact Paperia
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
