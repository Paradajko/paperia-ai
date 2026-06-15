type LogoProps = {
  compact?: boolean;
  light?: boolean;
  sublabel?: boolean;
};

export function Logo({ compact = false, light = false, sublabel = false }: LogoProps) {
  return (
    <a href="#top" className="inline-flex items-center gap-3" aria-label="Ria home">
      <svg
        aria-hidden="true"
        className="h-11 w-11 flex-none drop-shadow-sm"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="1.5" y="1.5" width="45" height="45" rx="15" fill="#0B1726" />
        <rect x="7.5" y="7.5" width="33" height="33" rx="10.5" fill="#FFFCF6" />
        <path
          d="M14.5 31.5c4.9-8.6 11.8-12.2 20.6-10.7"
          stroke="#0F766E"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M17 17.8h14M17 23.5h9"
          stroke="#102033"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="m22.8 32.2 3.2 3.2 7.4-8.5"
          stroke="#C96F5B"
          strokeWidth="2.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="14.5" cy="31.5" r="2.2" fill="#0F766E" />
        <circle cx="35.1" cy="20.8" r="2.2" fill="#0F766E" />
        <path
          d="M35 13.5v5M32.5 16h5"
          stroke="#C96F5B"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      {!compact && (
        <span className="leading-none">
          <span className={light ? 'block text-2xl font-semibold text-white' : 'block text-2xl font-semibold text-ink'}>
            Ria
          </span>
          {sublabel && (
            <span className={light ? 'mt-1 block text-xs text-slate-300' : 'mt-1 block text-xs text-slate-500'}>
              AI residence guide
            </span>
          )}
        </span>
      )}
    </a>
  );
}
