import { Link } from 'react-router-dom';

import { Footer } from '../components/Footer';
import { Logo } from '../components/Logo';

export function Unsubscribed() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line bg-porcelain">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" aria-label="Riadence home">
            <Logo />
          </Link>
        </div>
      </header>
      <main className="mx-auto flex min-h-[65vh] max-w-2xl items-center px-4 py-16 text-center sm:px-6">
        <div className="w-full rounded-[2rem] border border-[#BFE6D2] bg-white/80 p-8 shadow-soft sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-harbor">
            Email preferences updated
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            You are unsubscribed.
          </h1>
          <p className="mt-4 leading-7 text-slate-600">
            We will not send the remaining 14-day guide emails to this address.
            Service messages you specifically request may still be delivered.
          </p>
          <Link
            to="/"
            className="mt-7 inline-flex rounded-full bg-[#0F8A6A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0B6F56]"
          >
            Back to Riadence
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
