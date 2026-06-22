import { useTranslation } from 'react-i18next';

export function SocialProof() {
  const { t } = useTranslation();
  const testimonials = t('socialProof.testimonials', {
    returnObjects: true,
  }) as Array<{ quote: string; attribution: string }>;
  const badges = t('socialProof.badges', { returnObjects: true }) as string[];

  return (
    <section className="border-b border-line bg-white/84 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#0F8A6A]">
            {t('socialProof.earlyStage')}
          </p>
          <p className="mt-3 text-base leading-7 text-slate-600">
            {t('socialProof.description')}
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.attribution}
              className="rounded-3xl border border-line bg-porcelain/70 p-5 text-left shadow-sm"
            >
              <blockquote className="text-sm leading-6 text-slate-700">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#0F8A6A]">
                {testimonial.attribution}
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-3 text-center text-xs text-slate-500">
          {t('socialProof.sampleDisclaimer')}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-semibold text-slate-600">
          {badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-[#EEF7F1] px-3 py-2 ring-1 ring-[#BFE6D2]"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
