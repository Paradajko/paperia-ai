import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Footer } from './Footer';
import { Logo } from './Logo';

type LegalPageLayoutProps = {
  title: string;
  intro: string;
  children: ReactNode;
};

export function LegalPageLayout({
  title,
  intro,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#DDE8DF]/80 bg-[#FFFCF6]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <Link to="/" aria-label="Riadence home">
            <Logo />
          </Link>
          <Link
            to="/"
            className="rounded-full border border-[#D7E9DE] bg-white/80 px-4 py-2 text-sm font-semibold text-ink transition hover:border-[#A7F3D0] hover:bg-white"
          >
            Back to Riadence
          </Link>
        </div>
      </header>

      <main className="pt-[68px]">
        <section className="border-b border-[#BFE6D2] bg-[linear-gradient(180deg,#FFFCF6_0%,#EEF7F1_100%)] py-14 sm:py-18">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-harbor">
              Legal
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              {intro}
            </p>
            <p className="mt-4 text-sm font-medium text-slate-500">
              Last updated: June 19, 2026
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-3xl space-y-10 px-4 py-14 text-base leading-7 text-slate-700 sm:px-6 sm:py-18 lg:px-8">
          {children}
        </article>
      </main>

      <Footer />
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-line bg-white/75 p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-ink">
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
