import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import riaGuide from '../assets/ria-guide-half.png';

const helpCards = [
  {
    tone: 'green',
    mobilePosition: 'left-[2%] top-[6%]',
    position: 'lg:left-[10%] lg:top-[9%]',
    Icon: RouteIcon,
  },
  {
    tone: 'mint',
    mobilePosition: 'right-[2%] top-[6%]',
    position: 'lg:right-[10%] lg:top-[9%]',
    Icon: ChecklistIcon,
  },
  {
    tone: 'risk',
    mobilePosition: 'left-[0%] top-[38%]',
    position: 'lg:left-[6%] lg:top-[39%]',
    Icon: RiskIcon,
  },
  {
    tone: 'paper',
    mobilePosition: 'right-[0%] top-[38%]',
    position: 'lg:right-[6%] lg:top-[39%]',
    Icon: MessageIcon,
  },
  {
    tone: 'mint',
    mobilePosition: 'left-[3%] top-[70%]',
    position: 'lg:left-[11%] lg:top-[69%]',
    Icon: StepsIcon,
  },
  {
    tone: 'green',
    mobilePosition: 'right-[3%] top-[70%]',
    position: 'lg:right-[11%] lg:top-[69%]',
    Icon: SummaryIcon,
  },
];

export function RiadenceHeroMockup() {
  const { t } = useTranslation();
  const titles = t('landing.heroCards', { returnObjects: true }) as string[];
  const localizedHelpCards = helpCards.map((card, index) => ({
    ...card,
    title: titles[index],
  }));

  return (
    <div className="relative mx-auto w-full max-w-6xl">
      <div className="relative min-h-[380px] overflow-hidden sm:min-h-[430px] lg:min-h-[510px]">
        <div className="pointer-events-none absolute left-1/2 top-8 h-[260px] w-[260px] -translate-x-1/2 rounded-full bg-[#A7F3D0]/34 blur-3xl sm:h-[320px] sm:w-[320px] lg:top-0 lg:h-[500px] lg:w-[500px]" />
        <div className="paper-sheet left-[24%] top-14 hidden -rotate-6 lg:block" />
        <div className="paper-sheet right-[24%] top-14 hidden rotate-6 lg:block" />
        <div className="paper-sheet left-[38%] bottom-0 hidden rotate-2 lg:block" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 z-10 hidden h-28 w-[86%] -translate-x-1/2 rounded-[999px] bg-[radial-gradient(ellipse_at_center,rgba(167,243,208,0.52)_0%,rgba(15,138,106,0.13)_46%,rgba(15,138,106,0)_74%)] shadow-[0_18px_50px_rgba(15,138,106,0.14)] lg:block lg:w-[52%]" />
        <div className="pointer-events-none absolute bottom-9 left-1/2 z-10 hidden h-3 w-[58%] -translate-x-1/2 rounded-full bg-[#0F8A6A]/18 blur-sm lg:block lg:w-[28%]" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 z-[25] hidden h-28 w-[420px] -translate-x-1/2 rounded-t-[999px] bg-[linear-gradient(180deg,rgba(238,247,241,0)_0%,rgba(238,247,241,0.76)_52%,rgba(238,247,241,0.98)_100%)] lg:block lg:w-[470px]" />

        <div className="absolute bottom-0 left-1/2 z-20 flex h-[380px] max-w-[320px] -translate-x-1/2 flex-col items-center justify-end overflow-hidden sm:h-[430px] sm:max-w-[370px] lg:-bottom-14 lg:h-auto lg:max-w-none lg:overflow-visible">
          <div className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-16 w-[64%] -translate-x-1/2 rounded-[999px] bg-[radial-gradient(ellipse_at_center,rgba(167,243,208,0.48)_0%,rgba(15,138,106,0.12)_50%,rgba(15,138,106,0)_74%)] lg:hidden" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 z-[25] h-14 w-[70%] -translate-x-1/2 rounded-t-[999px] bg-[linear-gradient(180deg,rgba(238,247,241,0)_0%,rgba(238,247,241,0.78)_62%,rgba(238,247,241,0.98)_100%)] lg:hidden" />
          <img
            src={riaGuide}
            alt="Ria, Riadence's residence guide for Slovakia"
            className="ria-mobile-soft relative z-20 h-[360px] w-auto max-w-none shrink-0 object-contain object-bottom drop-shadow-[0_28px_38px_rgba(15,78,59,0.22)] sm:h-[420px] lg:h-[590px] lg:drop-shadow-[0_34px_48px_rgba(15,78,59,0.24)]"
          />
        </div>

        <div className="absolute inset-0 z-30 lg:contents">
          {localizedHelpCards.map((card) => (
            <HelpCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}

function HelpCard({
  title,
  tone,
  mobilePosition,
  position,
  Icon,
}: {
  title: string;
  tone: string;
  mobilePosition: string;
  position: string;
  Icon: () => ReactNode;
}) {
  const toneClass =
    tone === 'risk'
      ? 'text-[#D97757] bg-[#FFF7F2]'
      : tone === 'mint'
        ? 'text-[#064E3B] bg-[#E8FFF3]'
        : tone === 'paper'
          ? 'text-[#0F8A6A] bg-[#F2FBF6]'
          : 'text-[#0F8A6A] bg-[#EEF7F1]';

  return (
    <article
      className={`group absolute flex h-[44px] w-[96px] items-center overflow-hidden rounded-2xl border border-[#BFE6D2] bg-white/90 p-1.5 text-left shadow-[0_12px_28px_rgba(15,78,59,0.08)] backdrop-blur transition duration-200 ease-out hover:-translate-y-1 hover:border-[#0F8A6A]/35 hover:bg-white hover:shadow-[0_18px_38px_rgba(15,78,59,0.13)] sm:h-[58px] sm:w-[148px] sm:p-2.5 lg:h-[86px] lg:w-[244px] lg:p-3.5 ${mobilePosition} ${position}`}
    >
      <div className="flex w-full items-center gap-1 sm:gap-2 lg:gap-3">
        <div className={`flex h-[18px] w-[18px] flex-none items-center justify-center rounded-md sm:h-7 sm:w-7 sm:rounded-lg lg:h-9 lg:w-9 lg:rounded-xl ${toneClass}`}>
          <Icon />
        </div>
        <div className="min-w-0">
          <h3 className="overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] text-[8px] font-semibold leading-[1.05] text-[#0F8A6A] sm:text-[11px] sm:leading-[1.12] lg:text-[15px] lg:leading-[1.22]">
            {title}
          </h3>
        </div>
      </div>
    </article>
  );
}

function RouteIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
      <path d="M5 18c4.8-8 9.6-10.7 14-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="5" cy="18" r="1.8" fill="currentColor" />
      <circle cx="19" cy="10" r="1.8" fill="currentColor" />
    </svg>
  );
}

function ChecklistIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
      <path d="m5 7 1.8 1.8L10 5.5M13 7h6M5 16l1.8 1.8L10 14.5M13 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
      <path d="M5 6h14v9H9l-4 3V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RiskIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
      <path d="M12 8v5M12 17h.01M10.2 4.8 3 17.2A2 2 0 0 0 4.7 20h14.6a2 2 0 0 0 1.7-2.8L13.8 4.8a2.1 2.1 0 0 0-3.6 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StepsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
      <path d="M6 6h3v3H6zM15 15h3v3h-3zM9 7.5h4a3 3 0 0 1 0 6h-2a3 3 0 0 0 0 6h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SummaryIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
      <path d="M8 7h8M8 11h8M8 15h5M6 3h12a1 1 0 0 1 1 1v16l-3-2-3 2-3-2-3 2-3-2V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
