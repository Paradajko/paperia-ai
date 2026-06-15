type PricingCardProps = {
  title: string;
  price: string;
  description: string;
  featured?: boolean;
};

export function PricingCard({ title, price, description, featured = false }: PricingCardProps) {
  return (
    <article
      className={`rounded-3xl border p-5 shadow-sm ${
        featured ? 'border-harbor bg-[linear-gradient(135deg,#EAF8F4_0%,#FFFCF6_100%)] shadow-soft' : 'border-line bg-porcelain'
      }`}
    >
      {featured && (
        <span className="mb-4 inline-flex rounded-full bg-night px-3 py-1 text-xs font-semibold text-white">
          Most useful first
        </span>
      )}
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-4 text-2xl font-semibold text-ink">{price}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}
