import paperiaLogoMark from '../assets/paperia-logo-mark.png';

type LogoProps = {
  compact?: boolean;
  light?: boolean;
  sublabel?: boolean;
};

export function Logo({ compact = false, light = false, sublabel = false }: LogoProps) {
  const textColor = light ? 'text-white' : 'text-[#0B1726]';
  const sublabelColor = light ? 'text-slate-300' : 'text-slate-500';

  return (
    <a href="#top" className="inline-flex items-center gap-2.5" aria-label="Paperia home">
      <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl">
        <img
          src={paperiaLogoMark}
          alt=""
          aria-hidden="true"
          className="h-full w-full scale-[1.78] object-contain"
        />
      </span>
      {!compact && (
        <span className="relative leading-none">
          <span className={`block text-[1.72rem] font-semibold tracking-[-0.035em] ${textColor}`}>Paperia</span>
          {sublabel && <span className={`mt-1 block text-xs ${sublabelColor}`}>AI residence guide</span>}
        </span>
      )}
    </a>
  );
}
