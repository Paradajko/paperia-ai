import { useTranslation } from 'react-i18next';

type ContextItem = {
  title: string;
  description: string;
};

export function SlovakAdminContext() {
  const { t } = useTranslation();
  const items = t('slovakAdminContext.items', {
    returnObjects: true,
  }) as ContextItem[];

  return (
    <section className="border-y border-line bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-harbor">
            {t('slovakAdminContext.eyebrow')}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t('slovakAdminContext.title')}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {t('slovakAdminContext.description')}
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <article
              key={item.title}
              className="rounded-3xl border border-line bg-porcelain/70 p-5 shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EEF7F1] text-sm font-bold text-[#0F8A6A] ring-1 ring-[#BFE6D2]">
                {index + 1}
              </span>
              <h3 className="mt-4 text-base font-semibold text-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
