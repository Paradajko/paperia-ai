import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function FAQ() {
  const { t } = useTranslation();
  const faqs = t('faq.items', { returnObjects: true }) as Array<{
    question: string;
    answer: string;
  }>;

  return (
    <section id="faq" className="bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-harbor">{t('faq.eyebrow')}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t('faq.title')}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {t('faq.description')}
          </p>
        </div>
        <div className="mt-10 divide-y divide-line rounded-[2rem] border border-line bg-white/70 shadow-sm">
          {faqs.map((faq) => (
            <details key={faq.question} className="group p-5 open:bg-porcelain/70 sm:p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-ink">
                {faq.question}
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-porcelain text-lg text-harbor transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 rounded-3xl border border-[#BFE6D2] bg-[#EEF7F1] px-5 py-4 text-sm font-medium leading-6 text-slate-700">
          {t('faq.legalBefore')}{' '}
          <Link to="/privacy" className="font-semibold text-harbor underline underline-offset-4">
            {t('common.privacy')}
          </Link>{' '}
          {t('faq.legalAnd')}{' '}
          <Link to="/terms" className="font-semibold text-harbor underline underline-offset-4">
            {t('common.terms')}
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
