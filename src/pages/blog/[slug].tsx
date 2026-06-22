import { Link, useParams } from 'react-router-dom';

import { Footer } from '../../components/Footer';
import { Logo } from '../../components/Logo';
import { getBlogArticle } from '../../content/blog';

export function BlogArticlePage() {
  const { slug } = useParams();
  const article = getBlogArticle(slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-paper text-ink">
        <main className="mx-auto flex min-h-[75vh] max-w-2xl items-center px-4 py-16 text-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-harbor">
              404
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              Article not found
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              This guide does not exist or has not been published yet.
            </p>
            <Link
              to="/blog"
              className="mt-7 inline-flex h-12 items-center rounded-full bg-[#0F8A6A] px-6 text-sm font-semibold text-white"
            >
              Browse all guides
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const { Content } = article;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line bg-[#FFFCF6]/92">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" aria-label="Riadence home">
            <Logo />
          </Link>
          <Link
            to="/blog"
            className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
          >
            All guides
          </Link>
        </div>
      </header>

      <main>
        <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-harbor">
            {article.publishedAt} · {article.readingTime}
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            {article.description}
          </p>
          <p className="mt-4 text-sm font-medium text-slate-500">
            By {article.author}
          </p>
          <div className="mt-10 border-t border-line pt-10">
            <Content />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
