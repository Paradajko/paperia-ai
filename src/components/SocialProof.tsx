import { useTranslation } from 'react-i18next';

export function SocialProof() {
  const { t } = useTranslation();

  return (
    <section className="border-b border-line bg-white/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold text-[#0F8A6A]">
            {t('socialProof.earlyStage')}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {t('socialProof.description')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
          <span className="rounded-full bg-[#EEF7F1] px-3 py-2 ring-1 ring-[#BFE6D2]">
            {t('socialProof.free')}
          </span>
          <span className="rounded-full bg-[#EEF7F1] px-3 py-2 ring-1 ring-[#BFE6D2]">
            {t('socialProof.slovakiaFocused')}
          </span>
          <span className="rounded-full bg-[#EEF7F1] px-3 py-2 ring-1 ring-[#BFE6D2]">
            {t('socialProof.noAccount')}
          </span>
        </div>
      </div>
    </section>
  );
}
