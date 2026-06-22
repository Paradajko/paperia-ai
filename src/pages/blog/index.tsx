import { Link } from 'react-router-dom';

import { Footer } from '../../components/Footer';
import { Logo } from '../../components/Logo';
import { blogArticles } from '../../content/blog';

export function BlogIndex() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line bg-[#FFFCF6]/92">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" aria-label="Riadence home">
            <Logo />
          </Link>
          <Link
            to="/"
            className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-[#A7F3D0]"
          >
            Back to Riadence
          </Link>
        </div>
      </header>

      <main>
        <section className="border-b border-[#BFE6D2] bg-[linear-gradient(180deg,#FFFCF6_0%,#EEF7F1_100%)] py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-harbor">
              Riadence guides
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Practical residence guidance for Slovakia
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Clear, source-aware articles about residence routes, documents,
              translations, and common preparation mistakes.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {blogArticles.length === 0 ? (
              <div className="rounded-3xl border border-line bg-white/80 p-8 text-center shadow-sm">
                <h2 className="text-xl font-semibold text-ink">
                  The first guide is being prepared
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Check back soon for practical, sourced guidance about moving
                  to Slovakia.
                </p>
              </div>
            ) : (
              <div className="grid gap-5">
                {blogArticles.map((article) => (
                  <article
                    key={article.slug}
                    className="rounded-3xl border border-line bg-white/80 p-6 shadow-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-harbor">
                      {article.publishedAt} · {article.readingTime}
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold text-ink">
                      <Link
                        to={`/blog/${article.slug}`}
                        className="transition hover:text-harbor"
                      >
                        {article.title}
                      </Link>
                    </h2>
                    <p className="mt-3 text-base leading-7 text-slate-600">
                      {article.description}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
