import { useTranslation } from 'react-i18next';

export function SocialProof() {
  const { t } = useTranslation();
  const badges = t('socialProof.badges', { returnObjects: true }) as string[];

  return (
    <div className="mx-auto mt-4 max-w-3xl border-t border-[#BFE6D2] pt-4">
      <p className="text-sm font-semibold text-[#0F8A6A]">
        {t('socialProof.earlyStage')}
      </p>
      <p className="mx-auto mt-1 max-w-2xl text-sm leading-6 text-slate-600">
        {t('socialProof.description')}
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs font-semibold text-slate-600">
        {badges.map((badge) => (
          <span
            key={badge}
            className="rounded-full bg-white/72 px-3 py-1.5 ring-1 ring-[#BFE6D2]"
          >
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}
