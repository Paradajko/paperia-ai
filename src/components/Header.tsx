import { Logo } from './Logo';

type HeaderProps = {
  onStart: () => void;
};

const navItems = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'For agencies', href: '#agencies' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export function Header({ onStart }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-porcelain/[0.88] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Logo sublabel />
        <nav className="hidden items-center rounded-full border border-line bg-white/[0.55] px-2 py-1 text-sm font-medium text-slate-600 shadow-sm md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="rounded-full px-4 py-2 transition hover:bg-white hover:text-ink">
              {item.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          onClick={onStart}
          className="rounded-full bg-night px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(11,23,38,0.18)] transition hover:bg-slate-800 sm:px-5"
        >
          Start with Ria
        </button>
      </div>
    </header>
  );
}
