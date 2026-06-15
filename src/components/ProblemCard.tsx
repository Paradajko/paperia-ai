type ProblemCardProps = {
  title: string;
  description: string;
};

export function ProblemCard({ title, description }: ProblemCardProps) {
  return (
    <article className="group rounded-3xl border border-line bg-white/[0.72] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-caution ring-1 ring-amber-100">
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 8v5M12 17h.01M10.3 4.6 2.9 17.4A2 2 0 0 0 4.6 20h14.8a2 2 0 0 0 1.7-2.6L13.7 4.6a2 2 0 0 0-3.4 0Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full w-1/2 rounded-full bg-coral/70 transition group-hover:w-3/4" />
      </div>
    </article>
  );
}
